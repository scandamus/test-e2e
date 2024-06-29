FROM node:17

WORKDIR /app

COPY tools/docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

COPY tools/test/package.json .
COPY tools/test/package-lock.json .
RUN npm install node-fetch node-localstorage prompt

COPY tools/test/test_*.js .

CMD ["npm", "run", "test:e2e"]
ENTRYPOINT [ "/usr/local/bin/docker-entrypoint.sh" ]