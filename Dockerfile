FROM node

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV


ARG PORT=80
ENV PORT $PORT
EXPOSE $PORT 9229

HEALTHCHECK CMD curl -fs http://localhost:$PORT/healthz || exit 1

# Dependencies go under /opt/node_modules

WORKDIR /opt
COPY src/package.json package-lock.json* ./
RUN npm install && npm cache clean --force
# FIXME: Use Yarn & Gulp instead of NPM.
# RUN yarn install
# RUN yarn global add gulp
# RUN gulp build
ENV PATH /opt/node_modules/.bin:$PATH

# Application
WORKDIR /opt/app
COPY src/. /opt/app

nodemon --inspect=0.0.0.0:9229 ../../app/backend/index.js
CMD ["nodemon", "-inspect=0.0.0.0:9229", "../../app/backend/index.js"]