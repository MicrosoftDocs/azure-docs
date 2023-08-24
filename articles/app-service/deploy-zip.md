---
title: Deploy files to App Service
description: Learn to deploy various app packages or discrete libraries, static files, or startup scripts to Azure App Service
ms.topic: article
ms.date: 07/21/2023
ms.author: msangapu
ms.custom: seodec18
---

# Deploy files to App Service

This article shows you how to deploy your code as a ZIP, WAR, JAR, or EAR package to [Azure App Service](overview.md). It also shows how to deploy individual files to App Service, separate from your application package.

## Prerequisites

To complete the steps in this article, [create an App Service app](./index.yml), or use an app that you created for another tutorial.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [Create a project ZIP file](../../includes/app-service-web-deploy-zip-prepare.md)]

## Deploy a ZIP package

When you deploy a ZIP package, App Service unpacks its contents in the default path for your app (`D:\home\site\wwwroot` for Windows, `/home/site/wwwroot` for Linux).

This ZIP package deployment uses the same Kudu service that powers continuous integration-based deployments. Kudu supports the following functionality for ZIP package deployment: 

- Deletion of files left over from a previous deployment.
- Option to turn on the default build process, which includes package restore.
- Deployment customization, including running deployment scripts.  
- Deployment logs. 
- A package size limit of 2048 MB.

For more information, see [Kudu documentation](https://github.com/projectkudu/kudu/wiki/Deploying-from-a-zip-file).

> [!NOTE]
> Files in the ZIP package are copied only if their timestamps don't match what is already deployed. Generating a zip using a build process that caches outputs can result in faster deployments. See [Deploying from a zip file or url](https://github.com/projectkudu/kudu/wiki/Deploying-from-a-zip-file-or-url), for more information.

# [Azure CLI](#tab/cli)

Deploy a ZIP package to your web app by using the [az webapp deploy](/cli/azure/webapp#az-webapp-deploy) command. The CLI command uses the [Kudu publish API](#kudu-publish-api-reference) to deploy the files and can be fully customized.

The following example pushes a ZIP package to your site. Specify the path to your local ZIP package for `--src-path`.

```azurecli-interactive
az webapp deploy --resource-group <group-name> --name <app-name> --src-path <zip-package-path>
```

This command restarts the app after deploying the ZIP package. 

[!INCLUDE [deploying to network secured sites](../../includes/app-service-deploy-network-secured-sites.md)]

The following example uses the `--src-url` parameter to specify the URL of an Azure Storage account that the site should pull the ZIP from.

```azurecli-interactive
az webapp deploy --resource-group <group-name> --name <app-name> --src-url "https://storagesample.blob.core.windows.net/sample-container/myapp.zip?sv=2021-10-01&sb&sig=slk22f3UrS823n4kSh8Skjpa7Naj4CG3
```

# [Azure PowerShell](#tab/powershell)

The following example uses [Publish-AzWebapp](/powershell/module/az.websites/publish-azwebapp) to upload the ZIP package. Replace the placeholders `<group-name>`, `<app-name>`, and `<zip-package-path>`.

```powershell
Publish-AzWebApp -ResourceGroupName Default-Web-WestUS -Name MyApp -ArchivePath <zip-package-path> 
```

# [Kudu API](#tab/api)

The following example uses the cURL tool to deploy a ZIP package. Replace the placeholders `<username>`, `<password>`, `<zip-package-path>`, and `<app-name>`. Use the [deployment credentials](deploy-configure-credentials.md) for authentication.

```bash
curl -X POST \
     -H "Content-Type: application/octet-stream" \
     -u '<username>:<password>' \
     -T "<zip-package-path>" \
     "https://<app-name>.scm.azurewebsites.net/api/zipdeploy"
```

[!INCLUDE [deploying to network secured sites](../../includes/app-service-deploy-network-secured-sites.md)]

The following example uses the `packageUri` parameter to specify the URL of an Azure Storage account that the web app should pull the ZIP from.

```bash
curl -X PUT \
     -H "Content-Type: application/json" \
     -u '<username>:<password>' \
     -d '{"packageUri": "https://storagesample.blob.core.windows.net/sample-container/myapp.zip?sv=2021-10-01&sb&sig=slk22f3UrS823n4kSh8Skjpa7Naj4CG3"}' \
     "https://<app-name>.scm.azurewebsites.net/api/zipdeploy"
```

# [Kudu UI](#tab/kudu-ui)

In the browser, navigate to `https://<app_name>.scm.azurewebsites.net/ZipDeployUI`.

Upload the ZIP package you created in [Create a project ZIP package](#create-a-project-zip-package) by dragging it to the file explorer area on the web page.

When deployment is in progress, an icon in the top right corner shows you the progress in percentage. The page also shows verbose messages for the operation below the explorer area. When it is finished, the last deployment message should say `Deployment successful`.

The above endpoint does not work for Linux App Services at this time. Consider using FTP or the [ZIP deploy API](./faq-app-service-linux.yml) instead.

-----

## Enable build automation for ZIP deploy

By default, the deployment engine assumes that a ZIP package is ready to run as-is and doesn't run any build automation. To enable the same build automation as in a [Git deployment](deploy-local-git.md), set the `SCM_DO_BUILD_DURING_DEPLOYMENT` app setting by running the following command in the [Cloud Shell](https://shell.azure.com):

```azurecli-interactive
az webapp config appsettings set --resource-group <group-name> --name <app-name> --settings SCM_DO_BUILD_DURING_DEPLOYMENT=true
```

For more information, see [Kudu documentation](https://github.com/projectkudu/kudu/wiki/Deploying-from-a-zip-file-or-url).

[!INCLUDE [What happens to my app during deployment?](../../includes/app-service-deploy-atomicity.md)]

## Deploy WAR/JAR/EAR packages

You can deploy your [WAR](https://wikipedia.org/wiki/WAR_(file_format)), [JAR](https://wikipedia.org/wiki/JAR_(file_format)), or [EAR](https://wikipedia.org/wiki/EAR_(file_format)) package to App Service to run your Java web app using the Azure CLI, PowerShell, or the Kudu publish API.

The deployment process places the package on the shared file drive correctly (see [Kudu publish API reference](#kudu-publish-api-reference)). For that reason, deploying WAR/JAR/EAR packages using [FTP](deploy-ftp.md) or WebDeploy is not recommended.

# [Azure CLI](#tab/cli)

Deploy a WAR package to Tomcat or JBoss EAP by using the [az webapp deploy](/cli/azure/webapp#az-webapp-deploy) command. Specify the path to your local Java package for `--src-path`.

```azurecli-interactive
az webapp deploy --resource-group <group-name> --name <app-name> --src-path ./<package-name>.war
```

[!INCLUDE [deploying to network secured sites](../../includes/app-service-deploy-network-secured-sites.md)]

The following example uses the `--src-url` parameter to specify the URL of an Azure Storage account that the web app should pull the WAR from.

```azurecli-interactive
az webapp deploy --resource-group <group-name> --name <app-name> --src-url "https://storagesample.blob.core.windows.net/sample-container/myapp.war?sv=2021-10-01&sb&sig=slk22f3UrS823n4kSh8Skjpa7Naj4CG3 --type war
```

The CLI command uses the [Kudu publish API](#kudu-publish-api-reference) to deploy the package and can be fully customized.

# [Azure PowerShell](#tab/powershell)

The following example uses [Publish-AzWebapp](/powershell/module/az.websites/publish-azwebapp) to upload the .war file. Replace the placeholders `<group-name>`, `<app-name>`, and `<package-path>` (only WAR and JAR files are supported in Azure PowerShell).

```powershell
Publish-AzWebapp -ResourceGroupName <group-name> -Name <app-name> -ArchivePath <package-path>
```

# [Kudu API](#tab/api)

The following example uses the cURL tool to deploy a .war, .jar, or .ear file. Replace the placeholders `<username>`, `<file-path>`, `<app-name>`, and `<package-type>` (`war`, `jar`, or `ear`, accordingly). When prompted by cURL, type in the [deployment password](deploy-configure-credentials.md).

```bash
curl -X POST -u <username> -T @"<file-path>" https://<app-name>.scm.azurewebsites.net/api/publish?type=<package-type>
```

[!INCLUDE [deploying to network secured sites](../../includes/app-service-deploy-network-secured-sites.md)]

The following example uses the `packageUri` parameter to specify the URL of an Azure Storage account that the web app should pull the WAR from. The WAR file could also be a JAR or EAR file.

```bash
curl -X POST -u <username> https://<app-name>.scm.azurewebsites.net/api/publish -d '{"packageUri": "https://storagesample.blob.core.windows.net/sample-container/myapp.war?sv=2021-10-01&sb&sig=slk22f3UrS823n4kSh8Skjpa7Naj4CG3"}'
```

For more information, see [Kudu publish API reference](#kudu-publish-api-reference)

# [Kudu UI](#tab/kudu-ui)

The Kudu UI does not support deploying JAR, WAR, or EAR applications. Please use one of the other options.

-----

## Deploy individual files

# [Azure CLI](#tab/cli)

Deploy a startup script, library, and static file to your web app by using the [az webapp deploy](/cli/azure/webapp#az-webapp-deploy) command with the `--type` parameter.

If you deploy a startup script this way, App Service automatically uses your script to start your app.

The CLI command uses the [Kudu publish API](#kudu-publish-api-reference) to deploy the files and can be fully customized.

### Deploy a startup script

```azurecli
az webapp deploy --resource-group <group-name> --name <app-name> --src-path scripts/startup.sh --type=startup
```

### Deploy a library file

```azurecli
az webapp deploy --resource-group <group-name> --name <app-name> --src-path driver.jar --type=lib
```

### Deploy a static file

```azurecli
az webapp deploy --resource-group <group-name> --name <app-name> --src-path config.json --type=static
```

# [Azure PowerShell](#tab/powershell)

Not supported. See Azure CLI or Kudu API.

# [Kudu API](#tab/api)

### Deploy a startup script

The following example uses the cURL tool to deploy a startup file for their application.Replace the placeholders `<username>`, `<startup-file-path>`, and `<app-name>`. When prompted by cURL, type in the [deployment password](deploy-configure-credentials.md).

```bash
curl -X POST -u <username> -T @"<startup-file-path>" https://<app-name>.scm.azurewebsites.net/api/publish?type=startup
```

### Deploy a library file

The following example uses the cURL tool to deploy a library file for their application. Replace the placeholders `<username>`, `<lib-file-path>`, and `<app-name>`. When prompted by cURL, type in the [deployment password](deploy-configure-credentials.md).

```bash
curl -X POST -u <username> -T @"<lib-file-path>" "https://<app-name>.scm.azurewebsites.net/api/publish?type=lib&path=/home/site/deployments/tools/my-lib.jar"
```

### Deploy a static file

The following example uses the cURL tool to deploy a config file for their application. Replace the placeholders `<username>`, `<config-file-path>`, and `<app-name>`. When prompted by cURL, type in the [deployment password](deploy-configure-credentials.md).

```bash
curl -X POST -u <username> -T @"<config-file-path>" "https://<app-name>.scm.azurewebsites.net/api/publish?type=static&path=/home/site/deployments/tools/my-config.json"
```

# [Kudu UI](#tab/kudu-ui)

The Kudu UI does not support deploying individual files. Please use the Azure CLI or Kudu REST API.

-----

## Kudu publish API reference

The `publish` Kudu API allows you to specify the same parameters from the CLI command as URL query parameters. To authenticate with the Kudu API, you can use basic authentication with your app's [deployment credentials](deploy-configure-credentials.md#userscope).

The table below shows the available query parameters, their allowed values, and descriptions.

| Key | Allowed values | Description | Required | Type  |
|-|-|-|-|-|
| `type` | `war`\|`jar`\|`ear`\|`lib`\|`startup`\|`static`\|`zip` | The type of the artifact being deployed, this sets the default target path and informs the web app how the deployment should be handled. <br/> - `type=zip`: Deploy a ZIP package by unzipping the content to `/home/site/wwwroot`. `path` parameter is optional. <br/> - `type=war`: Deploy a WAR package. By default, the WAR package is deployed to `/home/site/wwwroot/app.war`. The target path can be specified with `path`. <br/> - `type=jar`: Deploy a JAR package to `/home/site/wwwroot/app.jar`. The `path` parameter is ignored <br/> - `type=ear`: Deploy an EAR package to `/home/site/wwwroot/app.ear`. The `path` parameter is ignored <br/> - `type=lib`: Deploy a JAR library file. By default, the file is deployed to `/home/site/libs`. The target path can be specified with `path`. <br/> - `type=static`: Deploy a static file (e.g. a script). By default, the file is deployed to `/home/site/wwwroot`. <br/> - `type=startup`: Deploy a script that App Service automatically uses as the startup script for your app. By default, the script is deployed to `D:\home\site\scripts\<name-of-source>` for Windows and `home/site/wwwroot/startup.sh` for Linux. The target path can be specified with `path`. | Yes | String |
| `restart` | `true`\|`false` | By default, the API restarts the app following the deployment operation (`restart=true`). To deploy multiple artifacts, prevent restarts on the all but the final deployment by setting `restart=false`. | No | Boolean |
| `clean` | `true`\|`false` | Specifies whether to clean (delete) the target deployment before deploying the artifact there. | No | Boolean |
| `ignorestack` | `true`\|`false` | The publish API uses the `WEBSITE_STACK` environment variable to choose safe defaults depending on your site's language stack. Setting this parameter to `false` disables any language-specific defaults. | No | Boolean |
| `path` | `"<absolute-path>"` | The absolute path to deploy the artifact to. For example, `"/home/site/deployments/tools/driver.jar"`, `"/home/site/scripts/helper.sh"`. | No | String |

## Next steps

For more advanced deployment scenarios, try [deploying to Azure with Git](deploy-local-git.md). Git-based deployment to Azure enables version control, package restore, MSBuild, and more.

## More resources

* [Kudu: Deploying from a zip file](https://github.com/projectkudu/kudu/wiki/Deploying-from-a-zip-file)
* [Azure App Service Deployment Credentials](deploy-ftp.md)
* [Environment variables and app settings reference](reference-app-settings.md)
