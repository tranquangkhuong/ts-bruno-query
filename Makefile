CONTAINER_NAME := ts_bruno_query

up:
	docker compose up -d

down:
	docker compose down

stop:
	docker compose stop

install:
	docker compose exec $(CONTAINER_NAME) npm install

build:
	docker compose exec $(CONTAINER_NAME) npm run build

test:
	docker compose exec $(CONTAINER_NAME) npm run test

test2:
	docker compose exec $(CONTAINER_NAME) npm run test2
