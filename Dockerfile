FROM node:16

WORKDIR /bodo_web/
COPY . .

RUN yarn config set registry https://registry.npmmirror.com && yarn && yarn build

FROM nginx:alpine
LABEL MAINTAINER="wangrui19970405@gmail.com"

COPY .docker-compose/nginx/conf.d/my.conf /etc/nginx/conf.d/my.conf
COPY --from=0 /bodo_web/dist /usr/share/nginx/html
RUN cat /etc/nginx/nginx.conf
RUN cat /etc/nginx/conf.d/my.conf
RUN ls -al /usr/share/nginx/html
