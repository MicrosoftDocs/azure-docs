---
title: Configure Node.js apps
description: Learn how to configure a Node.js app in the native Windows instances, or in a pre-built Linux container, in Azure App Service. This article shows the most common configuration tasks. 
ms.custom: devx-track-js, devx-track-azurecli
ms.devlang: javascript, devx-track-azurecli
ms.topic: article
ms.date: 01/21/2022
author: msangapu-msft
ms.author: msangapu
zone_pivot_groups: app-service-platform-windows-linux

---

# Configure a Node.js app for Azure App Service

Node.js apps must be deployed with all the required NPM dependencies. The App Service deployment engine automatically runs `npm install --production` for you when you deploy a [Git repository](deploy-local-git.md), or a [Zip package](deploy-zip.md) [with build automation enabled](deploy-zip.md#enable-build-automation-for-zip-deploy). If you deploy your files using [FTP/S](deploy-ftp.md), however, you need to upload the required packages manually.

This guide provides key concepts and instructions for Node.js developers who deploy to App Service. If you've never used Azure App Service, follow the [Node.js quickstart](quickstart-nodejs.md) and [Node.js with MongoDB tutorial](tutorial-nodejs-mongodb-app.md) first.

## Show Node.js version

::: zone pivot="platform-windows"  

To show the current Node.js version, run the following command in the [Cloud Shell](https://shell.azure.com):

```azurecli-interactive
az webapp config appsettings list --name <app-name> --resource-group <resource-group-name> --query "[?name=='WEBSITE_NODE_DEFAULT_VERSION'].value"
```

To show all supported Node.js versions, navigate to `https://<sitename>.scm.azurewebsites.net/api/diagnostics/runtime` or run the following command in the [Cloud Shell](https://shell.azure.com):

```azurecli-interactive
az webapp list-runtimes --os windows | grep NODE
```

::: zone-end

::: zone pivot="platform-linux"

To show the current Node.js version, run the following command in the [Cloud Shell](https://shell.azure.com):

```azurecli-interactive
az webapp config show --resource-group <resource-group-name> --name <app-name> --query linuxFxVersion
```

To show all supported Node.js versions, run the following command in the [Cloud Shell](https://shell.azure.com):

```azurecli-interactive
az webapp list-runtimes --os linux | grep NODE
```

::: zone-end

## Set Node.js version

::: zone pivot="platform-windows"  

To set your app to a [supported Node.js version](#show-nodejs-version), run the following command in the [Cloud Shell](https://shell.azure.com) to set `WEBSITE_NODE_DEFAULT_VERSION` to a supported version:

```azurecli-interactive
az webapp config appsettings set --name <app-name> --resource-group <resource-group-name> --settings WEBSITE_NODE_DEFAULT_VERSION="~16"
```

> [!NOTE]
> This example uses the recommended "tilde syntax" to target the latest available version of Node.js 16 runtime on App Service.
>
>Since the runtime is regularly patched and updated by the platform it's not recommended to target a specific minor version/patch as these are not guaranteed to be available due to potential security risks.

> [!NOTE]
> You should set the Node.js version in your project's `package.json`. The deployment engine runs in a separate process that contains all the supported Node.js versions.

::: zone-end

::: zone pivot="platform-linux"

To set your app to a [supported Node.js version](#show-nodejs-version), run the following command in the [Cloud Shell](https://shell.azure.com):

```azurecli-interactive
az webapp config set --resource-group <resource-group-name> --name <app-name> --linux-fx-version "NODE|14-lts"
```

This setting specifies the Node.js version to use, both at runtime and during automated package restore in Kudu.

> [!NOTE]
> You should set the Node.js version in your project's `package.json`. The deployment engine runs in a separate container that contains all the supported Node.js versions.

::: zone-end

## Get port number

Your Node.js app needs to listen to the right port to receive incoming requests.

::: zone pivot="platform-windows"  

In App Service on Windows, Node.js apps are hosted with [IISNode](https://github.com/Azure/iisnode), and your Node.js app should listen to the port specified in the `process.env.PORT` variable. The following example shows how you do it in a simple Express app:

::: zone-end

::: zone pivot="platform-linux"  

App Service sets the environment variable `PORT` in the Node.js container, and forwards the incoming requests to your container at that port number. To receive the requests, your app should listen to that port using `process.env.PORT`. The following example shows how you do it in a simple Express app:

::: zone-end

```javascript
const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
```

::: zone pivot="platform-linux"

## Customize build automation

If you deploy your app using Git, or zip packages [with build automation enabled](deploy-zip.md#enable-build-automation-for-zip-deploy), the App Service build automation steps through the following sequence:

1. Run custom script if specified by `PRE_BUILD_SCRIPT_PATH`.
1. Run `npm install` without any flags, which includes npm `preinstall` and `postinstall` scripts and also installs `devDependencies`.
1. Run `npm run build` if a build script is specified in your *package.json*.
1. Run `npm run build:azure` if a build:azure script is specified in your *package.json*.
1. Run custom script if specified by `POST_BUILD_SCRIPT_PATH`.

> [!NOTE]
> As described in [npm docs](https://docs.npmjs.com/misc/scripts), scripts named `prebuild` and `postbuild` run before and after `build`, respectively, if specified. `preinstall` and `postinstall` run before and after `install`, respectively.

`PRE_BUILD_COMMAND` and `POST_BUILD_COMMAND` are environment variables that are empty by default. To run pre-build commands, define `PRE_BUILD_COMMAND`. To run post-build commands, define `POST_BUILD_COMMAND`.

The following example specifies the two variables to a series of commands, separated by commas.

```azurecli-interactive
az webapp config appsettings set --name <app-name> --resource-group <resource-group-name> --settings PRE_BUILD_COMMAND="echo foo, scripts/prebuild.sh"
az webapp config appsettings set --name <app-name> --resource-group <resource-group-name> --settings POST_BUILD_COMMAND="echo foo, scripts/postbuild.sh"
```

For additional environment variables to customize build automation, see [Oryx configuration](https://github.com/microsoft/Oryx/blob/master/doc/configuration.md).

For more information on how App Service runs and builds Node.js apps in Linux, see [Oryx documentation: How Node.js apps are detected and built](https://github.com/microsoft/Oryx/blob/master/doc/runtimes/nodejs.md).

## Configure Node.js server

The Node.js containers come with [PM2](https://pm2.keymetrics.io/), a production process manager. You can configure your app to start with PM2, or with NPM, or with a custom command.

|Tool|Purpose|
|--|--|
|[Run with PM2](#run-with-pm2)|**Recommended** -  Production or staging use. PM2 provides a full-service app management platform.|
|[Run npm start](#run-npm-start)|Development use only.|
|[Run custom command](#run-custom-command)|Either development or staging.|

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

> [!NOTE]
> Starting from **Node 14 LTS**, the container doesn't automatically start your app with PM2. To start your app with PM2, set the startup command to `pm2 start <.js-file-or-PM2-file> --no-daemon`. Be sure to use the `--no-daemon` argument because PM2 needs to run in the foreground for the container to work properly.

To add a custom start file, run the following command in the [Cloud Shell](https://shell.azure.com):

```azurecli-interactive
az webapp config set --resource-group <resource-group-name> --name <app-name> --startup-file "<filename-with-extension>"
```

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

## Debug remotely

> [!NOTE]
> Remote debugging is currently in Preview.

You can debug your Node.js app remotely in [Visual Studio Code](https://code.visualstudio.com/) if you configure it to [run with PM2](#run-with-pm2), except when you run it using a *.config.js,*.yml, or *.yaml*.

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

::: zone-end

## Access environment variables

In App Service, you can [set app settings](configure-common.md) outside of your app code. Then you can access them using the standard Node.js pattern. For example, to access an app setting called `NODE_ENV`, use the following code:

```javascript
process.env.NODE_ENV
```

## Run Grunt/Bower/Gulp

By default, App Service build automation runs `npm install --production` when it recognizes a Node.js app is deployed through Git, or through Zip deployment [with build automation enabled](deploy-zip.md#enable-build-automation-for-zip-deploy). If your app requires any of the popular automation tools, such as Grunt, Bower, or Gulp, you need to supply a [custom deployment script](https://github.com/projectkudu/kudu/wiki/Custom-Deployment-Script) to run it.

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

In App Service, [TLS/SSL termination](https://wikipedia.org/wiki/TLS_termination_proxy) happens at the network load balancers, so all HTTPS requests reach your app as unencrypted HTTP requests. If your app logic needs to check if the user requests are encrypted or not, inspect the `X-Forwarded-Proto` header.

Popular web frameworks let you access the `X-Forwarded-*` information in your standard app pattern. In [Express](https://expressjs.com/), you can use [trust proxies](https://expressjs.com/guide/behind-proxies.html). For example:

```javascript
app.set('trust proxy', 1)
...
if (req.secure) {
  // Do something when HTTPS is used
}
```

## Access diagnostic logs

::: zone pivot="platform-windows"  

[!INCLUDE [Access diagnostic logs](../../includes/app-service-web-logs-access-no-h.md)]

::: zone-end

::: zone pivot="platform-linux"

[!INCLUDE [Access diagnostic logs](../../includes/app-service-web-logs-access-linux-no-h.md)]

::: zone-end

::: zone pivot="platform-linux"

## Monitor with Application Insights

Application Insights allows you to monitor your application's performance, exceptions, and usage without making any code changes. To attach the App Insights agent, go to your web app in the Portal and select **Application Insights** under **Settings**, then select **Turn on Application Insights**. Next, select an existing App Insights resource or create a new one. Finally, select **Apply** at the bottom. To instrument your web app using PowerShell, please see [these instructions](../azure-monitor/app/azure-web-apps-nodejs.md#enable-through-powershell)

This agent will monitor your server-side Node.js application. To monitor your client-side JavaScript, [add the JavaScript SDK to your project](../azure-monitor/app/javascript.md).

For more information, see the [Application Insights extension release notes](../azure-monitor/app/web-app-extension-release-notes.md).

::: zone-end

## Troubleshooting

When a working Node.js app behaves differently in App Service or has errors, try the following:

- [Access the log stream](#access-diagnostic-logs).
- Test the app locally in production mode. App Service runs your Node.js apps in production mode, so you need to make sure that your project works as expected in production mode locally. For example:
  - Depending on your *package.json*, different packages may be installed for production mode (`dependencies` vs. `devDependencies`).
  - Certain web frameworks may deploy static files differently in production mode.
  - Certain web frameworks may use custom startup scripts when running in production mode.
- Run your app in App Service in development mode. For example, in [MEAN.js](https://meanjs.org/), you can set your app to development mode in runtime by [setting the `NODE_ENV` app setting](configure-common.md).

::: zone pivot="platform-windows"

#### You do not have permission to view this directory or page

After deploying your Node.js code to a native Windows app in App Service, you may see the message `You do not have permission to view this directory or page.` in the browser when navigating to your app's URL. This is most likely because you don't have a *web.config* file (see the [template](https://github.com/projectkudu/kudu/blob/master/Kudu.Core/Scripts/iisnode.config.template) and an [example](https://github.com/Azure-Samples/nodejs-docs-hello-world/blob/master/web.config)).

If you deploy your files by using Git, or by using ZIP deployment [with build automation enabled](deploy-zip.md#enable-build-automation-for-zip-deploy), the deployment engine generates a *web.config* in the web root of your app (`%HOME%\site\wwwroot`) automatically if one of the following conditions is true:

- Your project root has a *package.json* that defines a `start` script that contains the path of a JavaScript file.
- Your project root has either a *server.js* or an *app.js*.

The generated *web.config* is tailored to the detected start script. For other deployment methods, add this *web.config* manually. Make sure the file is formatted properly.

If you use [ZIP deployment](deploy-zip.md) (through Visual Studio Code, for example), be sure to [enable build automation](deploy-zip.md#enable-build-automation-for-zip-deploy) because it's not enabled by default. [`az webapp up`](/cli/azure/webapp#az-webapp-up) uses ZIP deployment with build automation enabled.

::: zone-end

::: zone pivot="platform-linux"

[!INCLUDE [robots933456](../../includes/app-service-web-configure-robots933456.md)]

::: zone-end

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Node.js app with MongoDB](tutorial-nodejs-mongodb-app.md)

::: zone pivot="platform-linux"

> [!div class="nextstepaction"]
> [App Service Linux FAQ](faq-app-service-linux.yml)

::: zone-end

Or, see additional resources:

[Environment variables and app settings reference](reference-app-settings.md)
