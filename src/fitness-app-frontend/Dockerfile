# ---------- Stage 1: Prepare frontend ----------
FROM node:20-alpine AS build

WORKDIR /app

COPY . .

# ---------- Stage 2: Serve frontend ----------
FROM node:20-alpine AS runtime

WORKDIR /app

RUN npm install -g serve

COPY --from=build /app .

EXPOSE 3000

CMD ["serve", "-s", ".", "-l", "3000"]