FROM node:12 AS builder

WORKDIR /opt/app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . ./
RUN yarn build

FROM nginx:1.17

COPY deploy/docker/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /opt/app/dist /usr/share/nginx/html
