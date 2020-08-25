---
title: Configure Windows Node.js apps
description: Learn how to configure a Node.js app in the native Windows instances of App Service. This article shows the most common configuration tasks. 
ms.custom: devx-track-javascript
ms.devlang: nodejs
ms.topic: article
ms.date: 06/02/2020

---

# Configure a Windows Node.js app for Azure App Service

Node.js apps must be deployed with all the required NPM dependencies. The App Service deployment engine automatically runs `npm install --production` for you when you deploy a [Git repository](deploy-local-git.md), or a [Zip package](deploy-zip.md) with build automation enabled. If you deploy your files using [FTP/S](deploy-ftp.md), however, you need to upload the required packages manually. For information about Linux apps, see [Configure a Linux PHP app for Azure App Service](containers/configure-language-nodejs.md).

This guide provides key concepts and instructions for Node.js developers who deploy to App Service. If you've never used Azure App Service, follow the [Node.js quickstart](app-service-web-get-started-nodejs.md) and [Node.js with MongoDB tutorial](app-service-web-tutorial-nodejs-mongodb-app.md) first.

## Show Node.js version

To show the current Node.js version, run the following command in the [Cloud Shell](https://shell.azure.com):

```azurecli-interactive
az webapp config appsettings set --name <app-name> --resource-group <resource-group-name> --query "[?name=='WEBSITE_NODE_DEFAULT_VERSION'].value"
```

To show all supported Node.js versions, run the following command in the [Cloud Shell](https://shell.azure.com):

```azurecli-interactive
az webapp list-runtimes | grep node
```

## Set Node.js version

To set your app to a [supported Node.js version](#show-nodejs-version), run the following command in the [Cloud Shell](https://shell.azure.com) to set `WEBSITE_NODE_DEFAULT_VERSION` to a supported version:

```azurecli-interactive
az webapp config appsettings set --name <app-name> --resource-group <resource-group-name> --settings WEBSITE_NODE_DEFAULT_VERSION="10.15"
```

This setting specifies the Node.js version to use, both at runtime and during automated package restore during App Service build automation.

> [!NOTE]
> You should set the Node.js version in your project's `package.json`. The deployment engine runs in a separate process that contains all the supported Node.js versions.

## Access environment variables

In App Service, you can [set app settings](configure-common.md) outside of your app code. Then you can access them using the standard Node.js pattern. For example, to access an app setting called `NODE_ENV`, use the following code:

```javascript
process.env.NODE_ENV
```

## Run Grunt/Bower/Gulp

By default, App Service build automation runs `npm install --production` when it recognizes a Node.js app is deployed through Git (or Zip deployment with build automation enabled). If your app requires any of the popular automation tools, such as Grunt, Bower, or Gulp, you need to supply a [custom deployment script](https://github.com/projectkudu/kudu/wiki/Custom-Deployment-Script) to run it.

To enable your repository to run these tools, you need to add them to the dependencies in *package.json.* For example:

```json
"dependencies": {
  "bower": "^1.7.9",
  "grunt": "^1.0.1",
  "gulp": "^3.9.1",
  ...
}
```

From a local terminal window, change directory to your repository root and run the following commands:

```bash
npm install kuduscript -g
kuduscript --node --scriptType bash --suppressPrompt
```

Your repository root now has two additional files: *.deployment* and *deploy.sh*.

Open *deploy.sh* and find the `Deployment` section, which looks like this:

```bash
##################################################################################################################################
# Deployment
# ----------
```

This section ends with running `npm install --production`. Add the code section you need to run the required tool *at the end* of the `Deployment` section:

- [Bower](#bower)
- [Gulp](#gulp)
- [Grunt](#grunt)

See an [example in the MEAN.js sample](https://github.com/Azure-Samples/meanjs/blob/master/deploy.sh#L112-L135), where the deployment script also runs a custom `npm install` command.

### Bower

This snippet runs `bower install`.

```bash
if [ -e "$DEPLOYMENT_TARGET/bower.json" ]; then
  cd "$DEPLOYMENT_TARGET"
  eval ./node_modules/.bin/bower install
  exitWithMessageOnError "bower failed"
  cd - > /dev/null
fi
```

### Gulp

This snippet runs `gulp imagemin`.

```bash
if [ -e "$DEPLOYMENT_TARGET/gulpfile.js" ]; then
  cd "$DEPLOYMENT_TARGET"
  eval ./node_modules/.bin/gulp imagemin
  exitWithMessageOnError "gulp failed"
  cd - > /dev/null
fi
```

### Grunt

This snippet runs `grunt`.

```bash
if [ -e "$DEPLOYMENT_TARGET/Gruntfile.js" ]; then
  cd "$DEPLOYMENT_TARGET"
  eval ./node_modules/.bin/grunt
  exitWithMessageOnError "Grunt failed"
  cd - > /dev/null
fi
```

## Detect HTTPS session

In App Service, [SSL termination](https://wikipedia.org/wiki/TLS_termination_proxy) happens at the network load balancers, so all HTTPS requests reach your app as unencrypted HTTP requests. If your app logic needs to check if the user requests are encrypted or not, inspect the `X-Forwarded-Proto` header.

Popular web frameworks let you access the `X-Forwarded-*` information in your standard app pattern. In [Express](https://expressjs.com/), you can use [trust proxies](https://expressjs.com/guide/behind-proxies.html). For example:

```javascript
app.set('trust proxy', 1)
...
if (req.secure) {
  // Do something when HTTPS is used
}
```

## Access diagnostic logs

[!INCLUDE [Access diagnostic logs](../../includes/app-service-web-logs-access-no-h.md)]

## Troubleshooting

When a working Node.js app behaves differently in App Service or has errors, try the following:

- [Access the log stream](#access-diagnostic-logs).
- Test the app locally in production mode. App Service runs your Node.js apps in production mode, so you need to make sure that your project works as expected in production mode locally. For example:
    - Depending on your *package.json*, different packages may be installed for production mode (`dependencies` vs. `devDependencies`).
    - Certain web frameworks may deploy static files differently in production mode.
    - Certain web frameworks may use custom startup scripts when running in production mode.
- Run your app in App Service in development mode. For example, in [MEAN.js](https://meanjs.org/), you can set your app to development mode in runtime by [setting the `NODE_ENV` app setting](configure-common.md).

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Node.js app with MongoDB](app-service-web-tutorial-nodejs-mongodb-app.md)

