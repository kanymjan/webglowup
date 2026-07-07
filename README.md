# webglowup.dev

Сайт-визитка для привлечения клиентов: лендинг с услугами, блог и форма заявки.
Бэкенд на Java (Spring Boot), фронтенд на React (Vite + TypeScript + Tailwind CSS).

## Структура

```
backend/    Spring Boot API (заявки, посты блога, БД)
frontend/   React SPA (лендинг, блог, форма заявки, админка)
```

## Перед первым запуском

Ссылки на соцсети — в [frontend/src/config/socials.ts](frontend/src/config/socials.ts).

## Уведомления о заявках в Telegram

Заявки всегда сохраняются в базе и видны в `/admin`, а дополнительно бэкенд может прислать
уведомление в Telegram сразу при отправке формы. Чтобы включить:

1. Напишите **@BotFather** в Telegram → `/newbot` → следуйте инструкциям → получите токен вида `123456:ABC-DEF...`.
2. Напишите своему новому боту любое сообщение (например, `/start`), иначе он не сможет писать вам первым.
3. Узнайте свой chat_id — самый простой способ: напишите боту **@userinfobot**, он пришлёт ваш числовой id.
4. Запустите бэкенд с переменными окружения:

```bash
TELEGRAM_BOT_TOKEN=123456:ABC-DEF... TELEGRAM_CHAT_ID=ваш_chat_id ./mvnw spring-boot:run
```

Если переменные не заданы — уведомления просто не отправляются, заявка всё равно сохраняется в БД.
В Docker/systemd-запуске (см. ниже) переменные добавляются точно так же.

## Локальный запуск (разработка)

### Бэкенд

```bash
cd backend
./mvnw spring-boot:run
```

Поднимется на `http://localhost:8080`. База данных — файл H2 в `backend/data/` (создаётся автоматически).

По умолчанию admin-ключ — `changeme`. Задать свой можно переменной окружения:

```bash
ADMIN_KEY=мой-секретный-ключ ./mvnw spring-boot:run
```

### Фронтенд

```bash
cd frontend
npm install
npm run dev
```

Поднимется на `http://localhost:5173`, запросы к `/api/*` автоматически проксируются на бэкенд (см. `vite.config.ts`).

### Админка

Откройте `http://localhost:5173/admin`, введите admin-ключ (тот же, что в `ADMIN_KEY` бэкенда) —
там можно посмотреть заявки и создавать/редактировать/удалять посты блога.

## Продакшн: бэкенд должен работать постоянно (24/7)

Java-бэкенд — обычный долгоживущий процесс, а не serverless-функция. Два варианта запуска:

### Вариант 1 — Docker (рекомендуется)

```bash
ADMIN_KEY=мой-секретный-ключ CORS_ALLOWED_ORIGINS=https://ваш-домен.ru docker compose up -d --build
```

Данные H2 сохраняются в volume `backend-data`, бэкенд перезапускается автоматически (`restart: unless-stopped`).
Чтобы перейти на PostgreSQL — раскомментируйте сервис `postgres` в `docker-compose.yml` и поменяйте
`spring.datasource.*` в `backend/src/main/resources/application.properties` (детали — в комментариях файла).

### Вариант 2 — VPS напрямую

```bash
cd backend
./mvnw -DskipTests package
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

Чтобы процесс переживал перезагрузку и падения — заведите systemd-сервис:

```ini
# /etc/systemd/system/webglowup-backend.service
[Unit]
Description=webglowup backend
After=network.target

[Service]
Environment=ADMIN_KEY=мой-секретный-ключ
Environment=CORS_ALLOWED_ORIGINS=https://ваш-домен.ru
Environment=TELEGRAM_BOT_TOKEN=123456:ABC-DEF...
Environment=TELEGRAM_CHAT_ID=ваш_chat_id
ExecStart=/usr/bin/java -jar /path/to/backend-0.0.1-SNAPSHOT.jar
Restart=always
User=webglowup

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable --now webglowup-backend
```

### Фронтенд в продакшне

```bash
cd frontend
VITE_API_URL=https://api.ваш-домен.ru npm run build
```

Соберётся статика в `frontend/dist/` — её можно раздать через Nginx, Netlify, Vercel или любой статический хостинг.
Если бэкенд на том же домене за реверс-прокси (`/api` → backend:8080), `VITE_API_URL` можно не задавать.

## Проверка

- `curl http://localhost:8080/api/posts` — список опубликованных постов
- `curl -X POST http://localhost:8080/api/leads -H "Content-Type: application/json" -d '{"name":"Тест","contact":"@test"}'` — отправка заявки
- `curl -H "X-Admin-Key: ваш-ключ" http://localhost:8080/api/admin/leads` — список заявок (админ)
