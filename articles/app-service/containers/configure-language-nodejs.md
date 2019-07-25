---
title: Configure Node.js apps - Azure App Service | Microsoft Docs 
description: Learn how to configure Node.js apps to work in Azure App Service
services: app-service
documentationcenter: ''
author: cephalin
manager: jpconnock
editor: ''

ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: dotnet
ms.topic: article
ms.date: 03/28/2019
ms.author: cephalin
---

# Configure a Linux Node.js app for Azure App Service

Node.js apps must be deployed with all the required NPM dependencies. The App Service deployment engine (Kudu) automatically runs `npm install --production` for you when you deploy a [Git repository](../deploy-local-git.md?toc=%2fazure%2fapp-service%2fcontainers%2ftoc.json), or a [Zip package](../deploy-zip.md?toc=%2fazure%2fapp-service%2fcontainers%2ftoc.json) with build processes switched on. If you deploy your files using [FTP/S](../deploy-ftp.md?toc=%2fazure%2fapp-service%2fcontainers%2ftoc.json), however, you need to upload the required packages manually.

This guide provides key concepts and instructions for Node.js developers who use a built-in Linux container in App Service. If you've never used Azure App Service, follow the [Node.js quickstart](quickstart-nodejs.md) and [Node.js with MongoDB tutorial](tutorial-nodejs-mongodb-app.md) first.

## Show Node.js version

To show the current Node.js version, run the following command in the [Cloud Shell](https://shell.azure.com):

```azurecli-interactive
az webapp config show --resource-group <resource-group-name> --name <app-name> --query linuxFxVersion
```

To show all supported Node.js versions, run the following command in the [Cloud Shell](https://shell.azure.com):

```azurecli-interactive
az webapp list-runtimes --linux | grep NODE
```

## Set Node.js version

To set your app to a [supported Node.js version](#show-nodejs-version), run the following command in the [Cloud Shell](https://shell.azure.com):

```azurecli-interactive
az webapp config set --resource-group <resource-group-name> --name <app-name> --linux-fx-version "NODE|10.14"
```

This setting specifies the Node.js version to use, both at runtime and during automated package restore in Kudu.

> [!NOTE]
> You should set the Node.js version in your project's `package.json`. The deployment engine runs in a separate container that contains all the supported Node.js versions.

## Configure Node.js server

The Node.js containers come with [PM2](https://pm2.keymetrics.io/), a production process manager. You can configure your app to start with PM2, or with NPM, or with a custom command.

- [Run custom command](#run-custom-command)
- [Run npm start](#run-npm-start)
- [Run with PM2](#run-with-pm2)

### Run custom command

App Service can start your app using a custom command, such as an executable like *run.sh*. For example, to run `npm run start:prod`, run the following command in the [Cloud Shell](https://shell.azure.com):

```azurecli-interactive
az webapp config set --resource-group <resource-group-name> --name <app-name> --startup-file "npm run start:prod"
```

### Run npm start

To start your app using `npm start`, just make sure a `start` script is in the *package.json* file. For example:

```json
{
  ...
  "scripts": {
    "start": "gulp",
    ...
  },
  ...
}
```

To use a custom *package.json* in your project, run the following command in the [Cloud Shell](https://shell.azure.com):

```azurecli-interactive
az webapp config set --resource-group <resource-group-name> --name <app-name> --startup-file "<filename>.json"
```

### Run with PM2

The container automatically starts your app with PM2 when one of the common Node.js files is found in your project:

- *bin/www*
- *server.js*
- *app.js*
- *index.js*
- *hostingstart.js*
- One of the following [PM2 files](https://pm2.keymetrics.io/docs/usage/application-declaration/#process-file): *process.json* and *ecosystem.config.js*

You can also configure a custom start file with the following extensions:

- A *.js* file
- A [PM2 file](https://pm2.keymetrics.io/docs/usage/application-declaration/#process-file) with the extension *.json*, *.config.js*, *.yaml*, or *.yml*

To add a custom start file, run the following command in the [Cloud Shell](https://shell.azure.com):

```azurecli-interactive
az webapp config set --resource-group <resource-group-name> --name <app-name> --startup-file "<filname-with-extension>"
```

## Debug remotely

> [!NOTE]
> Remote debugging is currently in Preview.

You can debug your Node.js app remotely in [Visual Studio Code](https://code.visualstudio.com/) if you configure it to [run with PM2](#run-with-pm2), except when you run it using a *.config.js, *.yml, or *.yaml*.

In most cases, no extra configuration is required for your app. If your app is run with a *process.json* file (default or custom), it must have a `script` property in the JSON root. For example:

```json
{
  "name"        : "worker",
  "script"      : "./index.js",
  ...
}
```

To set up Visual Studio Code for remote debugging, install the [App Service extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice). Follow the instructions on the extension page and sign in to Azure in Visual Studio Code.

In the Azure explorer, find the app you want to debug, right-click it and select **Start Remote Debugging**. Click **Yes** to enable it for your app. App Service starts a tunnel proxy for you and attaches the debugger. You can then make requests to the app and see the debugger pausing at break points.

Once finished with debugging, stop the debugger by selecting **Disconnect**. When prompted, you should click **Yes** to disable remote debugging. To disable it later, right-click your app again in the Azure explorer and select **Disable Remote Debugging**.

## Access environment variables

In App Service, you can [set app settings](../configure-common.md?toc=%2fazure%2fapp-service%2fcontainers%2ftoc.json#configure-app-settings) outside of your app code. Then you can access them using the standard Node.js pattern. For example, to access an app setting called `NODE_ENV`, use the following code:

```javascript
process.env.NODE_ENV
```

## Run Grunt/Bower/Gulp

By default, Kudu runs `npm install --production` when it recognizes a Node.js app is deployed. If your app requires any of the popular automation tools, such as Grunt, Bower, or Gulp, you need to supply a [custom deployment script](https://github.com/projectkudu/kudu/wiki/Custom-Deployment-Script) to run it.

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

[!INCLUDE [Access diagnostic logs](../../../includes/app-service-web-logs-access-no-h.md)]

## Open SSH session in browser

[!INCLUDE [Open SSH session in browser](../../../includes/app-service-web-ssh-connect-builtin-no-h.md)]

## Troubleshooting

When a working Node.js app behaves differently in App Service or has errors, try the following:

- [Access the log stream](#access-diagnostic-logs).
- Test the app locally in production mode. App Service runs your Node.js apps in production mode, so you need to make sure that your project works as expected in production mode locally. For example:
    - Depending on your *package.json*, different packages may be installed for production mode (`dependencies` vs. `devDependencies`).
    - Certain web frameworks may deploy static files differently in production mode.
    - Certain web frameworks may use custom startup scripts when running in production mode.
- Run your app in App Service in development mode. For example, in [MEAN.js](https://meanjs.org/), you can set your app to development mode in runtime by [setting the `NODE_ENV` app setting](../configure-common.md?toc=%2fazure%2fapp-service%2fcontainers%2ftoc.json#configure-app-settings).

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Node.js app with MongoDB](tutorial-nodejs-mongodb-app.md)

> [!div class="nextstepaction"]
> [App Service Linux FAQ](app-service-linux-faq.md)
