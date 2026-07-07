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

## Бесплатный деплой (Render + Vercel + Neon)

Самый простой способ выложить сайт без своего сервера. Repo уже на GitHub: `kanymjan/webglowup`.

### 1. База данных — Neon (бесплатный постоянный Postgres)

Бесплатные диски на Render не сохраняются между рестартами, поэтому файловую H2 в проде заменяем
на настоящую БД:

1. Зайдите на **neon.tech**, зарегистрируйтесь, создайте проект `webglowup`.
2. В дашборде найдите Connection string, из него возьмите: хост, имя базы, юзера, пароль.
3. JDBC-адрес будет выглядеть так: `jdbc:postgresql://ВАШ_ХОСТ/ВАША_БАЗА?sslmode=require`.

### 2. Бэкенд — Render

1. **render.com** → New → Web Service → подключите репозиторий `kanymjan/webglowup`.
2. Root Directory: `backend`. Environment: **Docker** (подхватит `backend/Dockerfile`). Instance Type: **Free**.
3. Добавьте переменные окружения (Environment → Add Environment Variable):

| Переменная | Значение |
|---|---|
| `ADMIN_KEY` | свой секретный ключ для `/admin` |
| `CORS_ALLOWED_ORIGINS` | пока `*`, поменяем на адрес Vercel после шага 3 |
| `TELEGRAM_BOT_TOKEN` | токен вашего бота |
| `TELEGRAM_CHAT_ID` | ваш chat_id |
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://ВАШ_ХОСТ/ВАША_БАЗА?sslmode=require` (из Neon) |
| `SPRING_DATASOURCE_USERNAME` | юзер из Neon |
| `SPRING_DATASOURCE_PASSWORD` | пароль из Neon |
| `SPRING_DATASOURCE_DRIVER_CLASS_NAME` | `org.postgresql.Driver` |

4. Deploy. Через пару минут получите адрес вида `https://webglowup-backend.onrender.com`.

На бесплатном тарифе сервис засыпает через 15 минут простоя — первый запрос после паузы
выполняется 30–60 секунд, дальше работает быстро.

### 3. Фронтенд — Vercel

1. **vercel.com** → New Project → импортируйте тот же репозиторий `kanymjan/webglowup`.
2. Root Directory: `frontend` (Vercel сам распознает Vite).
3. Environment Variables: `VITE_API_URL` = адрес бэкенда из Render (`https://webglowup-backend.onrender.com`).
4. Deploy. Получите адрес вида `https://webglowup.vercel.app`.

### 4. Последний шаг

Вернитесь в Render → Environment → поменяйте `CORS_ALLOWED_ORIGINS` на адрес из Vercel
(`https://webglowup.vercel.app`) → сохраните, сервис передеплоится сам.

Готово — сайт живёт на `https://webglowup.vercel.app`, бэкенд и бот работают через Render.
Домен позже можно подключить и в Vercel (фронт), и в Render (бэкенд).

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
