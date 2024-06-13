---
title: Deploy files to App Service
description: Learn to deploy various app packages or discrete libraries, static files, or startup scripts to Azure App Service
ms.topic: article
ms.date: 01/26/2024
ms.custom: devx-track-azurecli
author: cephalin
ms.author: cephalin
---

# Deploy files to App Service

[!INCLUDE [regionalization-note](./includes/regionalization-note.md)]

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

> [!NOTE]
> Files in the ZIP package are copied only if their timestamps don't match what is already deployed. 

#### With zip deploy UI in Kudu

In the browser, navigate to `https://<app_name>.scm.azurewebsites.net/ZipDeployUI` (see [note at top](#dnl-note)).

Upload the ZIP package you created in [Create a project ZIP package](#create-a-project-zip-package) by dragging it to the file explorer area on the web page.

When deployment is in progress, an icon in the top right corner shows you the progress in percentage. The page also shows verbose messages for the operation below the explorer area. When deployment completes, the last message should say `Deployment successful`.

The above endpoint doesn't work for Linux App Services at this time. Consider using FTP or the [ZIP deploy API](./faq-app-service-linux.yml) instead.

#### Without zip deploy UI in Kudu

# [Azure CLI](#tab/cli)

Deploy a ZIP package to your web app by using the [az webapp deploy](/cli/azure/webapp#az-webapp-deploy) command. The CLI command uses the [Kudu publish API](#kudu-publish-api-reference) to deploy the files and can be fully customized.

The following example pushes a ZIP package to your site. Specify the path to your local ZIP package for `--src-path`.

```azurecli-interactive
az webapp deploy --resource-group <group-name> --name <app-name> --src-path <zip-package-path>
```

This command restarts the app after deploying the ZIP package. 

# [Azure PowerShell](#tab/powershell)

The following example uses [Publish-AzWebapp](/powershell/module/az.websites/publish-azwebapp) to upload the ZIP package. Replace the placeholders `<group-name>`, `<app-name>`, and `<zip-package-path>`

```azurepowershell-interactive
Publish-AzWebApp -ResourceGroupName Default-Web-WestUS -Name MyApp -ArchivePath <zip-package-path> 
```

# [Kudu API](#tab/api)

The following example uses the cURL tool to deploy a ZIP package. Replace the placeholders `<zip-package-path>` and `<app-name>`. If you choose basic authentication, supply the [deployment credentials](deploy-configure-credentials.md) in `<username>` and `<password>`.

```bash
# Microsoft Entra authentication
TOKEN=$(az account get-access-token --query accessToken | tr -d '"')

curl -X POST \
     -H "Authorization: Bearer $TOKEN" \
     -T @"<zip-package-path>" \
     "https://<app-name>.scm.azurewebsites.net/api/publish?type=zip"

# Basic authentication
curl -X POST \
     -u '<username>:<password>' \
     -T "<zip-package-path>" \
     "https://<app-name>.scm.azurewebsites.net/api/publish?type=zip"
```

> [!NOTE]
> For the actual fully qualified domain name to use in the URL, see [note at top](#dnl-note)

# [ARM template](#tab/arm)

ARM templates only support [deployments from remotely hosted packages](#deploy-to-network-secured-apps).

-----

## Enable build automation for zip deploy

By default, the deployment engine assumes that a ZIP package is ready to run as-is and doesn't run any build automation. To enable the same build automation as in a [Git deployment](deploy-local-git.md), set the `SCM_DO_BUILD_DURING_DEPLOYMENT` app setting by running the following command in the [Cloud Shell](https://shell.azure.com):

```azurecli-interactive
az webapp config appsettings set --resource-group <group-name> --name <app-name> --settings SCM_DO_BUILD_DURING_DEPLOYMENT=true
```

For more information, see [Kudu documentation](https://github.com/projectkudu/kudu/wiki/Deploying-from-a-zip-file-or-url).

## Deploy WAR/JAR/EAR packages

You can deploy your [WAR](https://wikipedia.org/wiki/WAR_(file_format)), [JAR](https://wikipedia.org/wiki/JAR_(file_format)), or [EAR](https://wikipedia.org/wiki/EAR_(file_format)) package to App Service to run your Java web app using the Azure CLI, PowerShell, or the Kudu publish API.

The deployment process shown here puts the package on the app's content share with the right naming convention and directory structure (see [Kudu publish API reference](#kudu-publish-api-reference)), and it's the recommended approach. If you deploy WAR/JAR/EAR packages using [FTP](deploy-ftp.md) or WebDeploy instead, you might see unknown failures due to mistakes in the naming or structure.

# [Azure CLI](#tab/cli)

Deploy a WAR package to Tomcat or JBoss EAP by using the [az webapp deploy](/cli/azure/webapp#az-webapp-deploy) command. Specify the path to your local Java package for `--src-path`.

```azurecli-interactive
az webapp deploy --resource-group <group-name> --name <app-name> --src-path ./<package-name>.war
```

The CLI command uses the [Kudu publish API](#kudu-publish-api-reference) to deploy the package and can be fully customized.

# [Azure PowerShell](#tab/powershell)

The following example uses [Publish-AzWebapp](/powershell/module/az.websites/publish-azwebapp) to upload the .war file. Replace the placeholders `<group-name>`, `<app-name>`, and `<package-path>` (only WAR and JAR files are supported in Azure PowerShell).

```powershell
Publish-AzWebapp -ResourceGroupName <group-name> -Name <app-name> -ArchivePath <package-path>
```

# [Kudu API](#tab/api)

The following example uses the cURL tool to deploy a .war, .jar, or .ear file. Replace the placeholders `<file-path>`, `<app-name>`, and `<package-type>` (`war`, `jar`, or `ear`, accordingly). If you choose basic authentication, supply the [deployment credentials](deploy-configure-credentials.md) in `<username>` and `<password>`.

```bash
# Microsoft Entra authentication
TOKEN=$(az account get-access-token --query accessToken | tr -d '"')

curl -X POST \
     -H "Authorization: Bearer $TOKEN" \
     -T @"<file-path>" \
     "https://<app-name>.scm.azurewebsites.net/api/publish?type=<package-type>"

# Basic authentication
curl -X POST \
     -u <username>:<password> \
     -T @"<file-path>" \
     "https://<app-name>.scm.azurewebsites.net/api/publish?type=<package-type>"
```

> [!NOTE]
> For the actual fully qualified domain name to use in the URL, see [note at top](#dnl-note)

For more information, see [Kudu publish API reference](#kudu-publish-api-reference)

# [ARM template](#tab/arm)

ARM templates only support [deployments from remotely hosted packages](#deploy-to-network-secured-apps).

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

The following example uses the cURL tool to deploy a startup file for the application. Replace the placeholders `<startup-file-path>` and `<app-name>`. If you choose basic authentication, supply the [deployment credentials](deploy-configure-credentials.md) in `<username>` and `<password>`.

```bash
# Microsoft Entra authentication
TOKEN=$(az account get-access-token --query accessToken | tr -d '"')

curl -X POST \
     -H "Authorization: Bearer $TOKEN" \
     -T @"<startup-file-path>" \
     "https://<app-name>.scm.azurewebsites.net/api/publish?type=startup"

# Basic authentication
curl -X POST \
     -u <username>:<password> \
     -T @"<startup-file-path>" \
     "https://<app-name>.scm.azurewebsites.net/api/publish?type=startup"
```

> [!NOTE]
> For the actual fully qualified domain name to use in the URL, see [note at top](#dnl-note)

### Deploy a library file

The following example uses the cURL tool to deploy a library file for the application. Replace the placeholders `<lib-file-path>` and `<app-name>`. If you choose basic authentication, supply the [deployment credentials](deploy-configure-credentials.md) in `<username>` and `<password>`.

```bash
# Microsoft Entra authentication
TOKEN=$(az account get-access-token --query accessToken | tr -d '"')

curl -X POST \
     -H "Authorization: Bearer $TOKEN" \
     -T @"<lib-file-path>" \
     "https://<app-name>.scm.azurewebsites.net/api/publish?type=lib&path=/home/site/deployments/tools/my-lib.jar"

# Basic authentication
curl -X POST \
     -u <username>:<password> \
     -T @"<lib-file-path>" \
     "https://<app-name>.scm.azurewebsites.net/api/publish?type=lib&path=/home/site/deployments/tools/my-lib.jar"
```

> [!NOTE]
> For the actual fully qualified domain name to use in the URL, see [note at top](#dnl-note)

### Deploy a static file

The following example uses the cURL tool to deploy a config file for the application. Replace the placeholders `<config-file-path>` and `<app-name>`. If you choose basic authentication, supply the [deployment credentials](deploy-configure-credentials.md) in `<username>` and `<password>`.

```bash
# Microsoft Entra authentication
TOKEN=$(az account get-access-token --query accessToken | tr -d '"')

curl -X POST \
     -H "Authorization: Bearer $TOKEN" \
     -T @"<config-file-path>" \
     "https://<app-name>.scm.azurewebsites.net/api/publish?type=static&path=/home/site/deployments/tools/my-config.json"

# Basic authentication
curl -X POST \
     -u <username>:<password> \
     -T @"<config-file-path>" \
     "https://<app-name>.scm.azurewebsites.net/api/publish?type=static&path=/home/site/deployments/tools/my-config.json"
```

> [!NOTE]
> For the actual fully qualified domain name to use in the URL, see [note at top](#dnl-note)

# [ARM template](#tab/arm)

ARM templates only support [deployments from remotely hosted packages](#deploy-to-network-secured-apps).

-----

## Deploy to network-secured apps

Depending on your web app's networking configuration, direct access to the app from your development environment might be blocked (see [Deploying to Network-secured sites](https://azure.github.io/AppService/2021/01/04/deploying-to-network-secured-sites.html) and [Deploying to Network-secured sites, Part 2](https://azure.github.io/AppService/2021/03/01/deploying-to-network-secured-sites-2.html)). Instead of pushing the package or file to the web app directly, you can publish it to a storage system accessible from the web app and trigger the app to pull the ZIP from the storage location.

The remote URL can be any publicly accessible location, but it's best to use a blob storage container with a SAS key to protect it.

# [Azure CLI](#tab/cli)

Use the `az webapp deploy` command like you would in the other sections, but use `--src-url` instead of `--src-path`. The following example uses the `--src-url` parameter to specify the URL of a ZIP file hosted in an Azure Storage account.

```azurecli-interactive
az webapp deploy --resource-group <group-name> --name <app-name> --src-url "https://storagesample.blob.core.windows.net/sample-container/myapp.zip?sv=2021-10-01&sb&sig=slk22f3UrS823n4kSh8Skjpa7Naj4CG3 --type zip
```

# [Azure PowerShell](#tab/powershell)

Not supported. See Azure CLI, Kudu API, or ARM template.

# [Kudu API](#tab/api)

Invoke the [Kudu publish API](#kudu-publish-api-reference) like you would in the other sections, but instead of uploading a file, pass in a JSON object with `packageUri` in the request body. The following examples use this method to specify the URL of a ZIP file hosted in an Azure Storage account. Note the type is still specified as a query string. If you choose basic authentication, supply the [deployment credentials](deploy-configure-credentials.md) in `<username>` and `<password>`.

```bash
# Microsoft Entra authentication
TOKEN=$(az account get-access-token --query accessToken | tr -d '"')

curl -X POST \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"packageUri": "https://storagesample.blob.core.windows.net/sample-container/myapp.zip?sv=2021-10-01&sb&sig=slk22f3UrS823n4kSh8Skjpa7Naj4CG3"}' \
     "https://<app-name>.scm.azurewebsites.net/api/publish?type=zip"

# Basic authentication
curl -X POST \
     -u '<username>:<password>' \
     -H "Content-Type: application/json" \
     -d '{"packageUri": "https://storagesample.blob.core.windows.net/sample-container/myapp.zip?sv=2021-10-01&sb&sig=slk22f3UrS823n4kSh8Skjpa7Naj4CG3"}' \
     "https://<app-name>.scm.azurewebsites.net/api/publish?type=zip"
```

> [!NOTE]
> For the actual fully qualified domain name to use in the URL, see [note at top](#dnl-note)

# [ARM template](#tab/arm)

Add the following JSON to your ARM template. Replace the placeholder `<app-name>`. 

```json
{
    "type": "Microsoft.Web/sites/extensions",
    "apiVersion": "2021-03-01",
    "name": "onedeploy",
    "dependsOn": [
        "[resourceId('Microsoft.Web/Sites', <app-name>')]"
    ],
    "properties": {
        "packageUri": "<zip-package-uri>",
        "type": "<type>",
        "path": "<target-path>"
    }
}
```

Use the following reference to help you configure the properties:

|Property | Description | Required |
|-|-|-|
| `packageUri` | The URI of the package or file. For more information, see [Microsoft.Web sites/extensions 'onedeploy'](/azure/templates/microsoft.web/2021-03-01/sites/extensions-onedeploy?pivots=deployment-language-arm-template). | Yes |
| `type` | See the `type` parameter in [Kudu publish API reference](#kudu-publish-api-reference). | Yes |
| `path` | See the `target-path` parameter in [Kudu publish API reference](#kudu-publish-api-reference). | No |

-----

## Kudu publish API reference

The `publish` Kudu API allows you to specify the same parameters from the CLI command as URL query parameters. To authenticate with the Kudu REST API, it's best to use token authentication, but you can also use basic authentication with your app's [deployment credentials](deploy-configure-credentials.md#userscope).

The following table shows the available query parameters, their allowed values, and descriptions.

| Key | Allowed values | Description | Required | Type  |
|-|-|-|-|-|
| `type` | `war`\|`jar`\|`ear`\|`lib`\|`startup`\|`static`\|`zip` | The type of the artifact being deployed, this sets the default target path and informs the web app how the deployment should be handled. <br/> - `type=zip`: Deploy a ZIP package by unzipping the content to `/home/site/wwwroot`. `target-path` parameter is optional. <br/> - `type=war`: Deploy a WAR package. By default, the WAR package is deployed to `/home/site/wwwroot/app.war`. The target path can be specified with `target-path`. <br/> - `type=jar`: Deploy a JAR package to `/home/site/wwwroot/app.jar`. The `target-path` parameter is ignored <br/> - `type=ear`: Deploy an EAR package to `/home/site/wwwroot/app.ear`. The `target-path` parameter is ignored <br/> - `type=lib`: Deploy a JAR library file. By default, the file is deployed to `/home/site/libs`. The target path can be specified with `target-path`. <br/> - `type=static`: Deploy a static file (such as a script). By default, the file is deployed to `/home/site/wwwroot`. <br/> - `type=startup`: Deploy a script that App Service automatically uses as the startup script for your app. By default, the script is deployed to `D:\home\site\scripts\<name-of-source>` for Windows and `home/site/wwwroot/startup.sh` for Linux. The target path can be specified with `target-path`. | Yes | String |
| `restart` | `true`\|`false` | By default, the API restarts the app following the deployment operation (`restart=true`). To deploy multiple artifacts, prevent restarts on the all but the final deployment by setting `restart=false`. | No | Boolean |
| `clean` | `true`\|`false` | Specifies whether to clean (delete) the target deployment before deploying the artifact there. | No | Boolean |
| `ignorestack` | `true`\|`false` | The publish API uses the `WEBSITE_STACK` environment variable to choose safe defaults depending on your site's language stack. Setting this parameter to `false` disables any language-specific defaults. | No | Boolean |
| `target-path` | An absolute path | The absolute path to deploy the artifact to. For example, `"/home/site/deployments/tools/driver.jar"`, `"/home/site/scripts/helper.sh"`. | No | String |

## Next steps

For more advanced deployment scenarios, try [deploying to Azure with Git](deploy-local-git.md). Git-based deployment to Azure enables version control, package restore, MSBuild, and more.

## More resources

* [Kudu: Deploying from a zip file](https://github.com/projectkudu/kudu/wiki/Deploying-from-a-zip-file)
* [Environment variables and app settings reference](reference-app-settings.md)
