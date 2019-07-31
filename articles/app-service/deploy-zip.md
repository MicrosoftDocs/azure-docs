---
title: Deploy code with a ZIP or WAR file - Azure App Service | Microsoft Docs 
description: Learn how to deploy your app to Azure App Service with a ZIP file (or a WAR file for Java developers).
services: app-service
documentationcenter: ''
author: cephalin
manager: cfowler
editor: ''

ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/07/2018
ms.author: cephalin
ms.reviewer: sisirap
ms.custom: seodec18

---

# Deploy your app to Azure App Service with a ZIP or WAR file

This article shows you how to use a ZIP file or WAR file to deploy your web app to [Azure App Service](overview.md). 

This ZIP file deployment uses the same Kudu service that powers continuous integration-based deployments. Kudu supports the following functionality for ZIP file deployment: 

- Deletion of files left over from a previous deployment.
- Option to turn on the default build process, which includes package restore.
- [Deployment customization](https://github.com/projectkudu/kudu/wiki/Configurable-settings#repository-and-deployment-related-settings), including running deployment scripts.  
- Deployment logs. 
- A file size limit of 2048 MB.

For more information, see [Kudu documentation](https://github.com/projectkudu/kudu/wiki/Deploying-from-a-zip-file).

The WAR file deployment deploys your [WAR](https://wikipedia.org/wiki/WAR_(file_format)) file to App Service to run your Java web app. See [Deploy WAR file](#deploy-war-file).

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

To complete the steps in this article:

* [Create an App Service app](/azure/app-service/), or use an app that you created for another tutorial.

## Create a project ZIP file

>[!NOTE]
> If you downloaded the files in a ZIP file, extract the files first. For example, if you downloaded a ZIP file from GitHub, you cannot deploy that file as-is. GitHub adds additional nested directories, which do not work with App Service. 
>

In a local terminal window, navigate to the root directory of your app project. 

This directory should contain the entry file to your web app, such as _index.html_, _index.php_, and _app.js_. It can also contain package management files like _project.json_, _composer.json_, _package.json_, _bower.json_, and _requirements.txt_.

Create a ZIP archive of everything in your project. The following command uses the default tool in your terminal:

```
# Bash
zip -r <file-name>.zip .

# PowerShell
Compress-Archive -Path * -DestinationPath <file-name>.zip
``` 

[!INCLUDE [Deploy ZIP file](../../includes/app-service-web-deploy-zip.md)]

## Deploy ZIP file with Azure CLI

Make sure your Azure CLI version is 2.0.21 or later. To see which version you have, run `az --version` command in your terminal window.

Deploy the uploaded ZIP file to your web app by using the [az webapp deployment source config-zip](/cli/azure/webapp/deployment/source?view=azure-cli-latest#az-webapp-deployment-source-config-zip) command.  

The following example deploys the ZIP file you uploaded. When using a local installation of Azure CLI, specify the path to your local ZIP file for `--src`.

```azurecli-interactive
az webapp deployment source config-zip --resource-group myResourceGroup --name <app_name> --src clouddrive/<filename>.zip
```

This command deploys the files and directories from the ZIP file to your default App Service application folder (`\home\site\wwwroot`) and restarts the app.

By default, the deployment engine assumes that a ZIP file is ready to run as-is and doesn't run any build automation. To enable the same build automation as in a [Git deployment](deploy-local-git.md), set the `SCM_DO_BUILD_DURING_DEPLOYMENT` app setting by running the following command in the [Cloud Shell](https://shell.azure.com):

```azurecli-interactive
az webapp config appsettings set --resource-group <resource-group-name> --name <app-name> --settings SCM_DO_BUILD_DURING_DEPLOYMENT=true
```



For more information, see [Kudu documentation](https://github.com/projectkudu/kudu/wiki/Deploying-from-a-zip-file-or-url).

[!INCLUDE [app-service-deploy-zip-push-rest](../../includes/app-service-deploy-zip-push-rest.md)]  

## Deploy WAR file

To deploy a WAR file to App Service, send a POST request to `https://<app_name>.scm.azurewebsites.net/api/wardeploy`. The POST request must contain the .war file in the message body. The deployment credentials for your app are provided in the request by using HTTP BASIC authentication.

For the HTTP BASIC authentication, you need your App Service deployment credentials. To see how to set your deployment credentials, see [Set and reset user-level credentials](deploy-configure-credentials.md#userscope).

### With cURL

The following example uses the cURL tool to deploy a .war file. Replace the placeholders `<username>`, `<war_file_path>`, and `<app_name>`. When prompted by cURL, type in the password.

```bash
curl -X POST -u <username> --data-binary @"<war_file_path>" https://<app_name>.scm.azurewebsites.net/api/wardeploy
```

### With PowerShell

The following example uses [Invoke-RestMethod](/powershell/module/microsoft.powershell.utility/invoke-restmethod) to send a request that contains the .war file. Replace the placeholders `<deployment_user>`, `<deployment_password>`, `<zip_file_path>`, and `<app_name>`.

```powershell
$username = "<deployment_user>"
$password = "<deployment_password>"
$filePath = "<war_file_path>"
$apiUrl = "https://<app_name>.scm.azurewebsites.net/api/wardeploy"
$base64AuthInfo = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes(("{0}:{1}" -f $username, $password)))
Invoke-RestMethod -Uri $apiUrl -Headers @{Authorization=("Basic {0}" -f $base64AuthInfo)} -Method POST -InFile $filePath -ContentType "application/octet-stream"
```

[!INCLUDE [What happens to my app during deployment?](../../includes/app-service-deploy-atomicity.md)]

## Next steps

For more advanced deployment scenarios, try [deploying to Azure with Git](deploy-local-git.md). Git-based deployment to Azure
enables version control, package restore, MSBuild, and more.

## More resources

* [Kudu: Deploying from a zip file](https://github.com/projectkudu/kudu/wiki/Deploying-from-a-zip-file)
* [Azure App Service Deployment Credentials](deploy-ftp.md)
