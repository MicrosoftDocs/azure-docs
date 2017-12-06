---
title: Deploy your app to Azure App Service with a ZIP file | Microsoft Docs 
description: Learn how to deploy your app to Azure App Service with a ZIP file.
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
ms.date: 12/05/2017
ms.author: cephalin;sisirap

---

# Deploy your app to Azure App Service with a ZIP file

This article shows you how to use a ZIP file to deploy your web app to [Azure App Service](app-service-web-overview.md). 

This ZIP file deployment uses the same Kudu service that powers continuous integration-based deployments. Kudu supports the following functionality for ZIP file deployment: 

- Deletion of files leftover from a previous deployment.
- Option to turn on the default build process, which includes package restore.
- [Deployment customization](https://github.com/projectkudu/kudu/wiki/Configurable-settings#repository-and-deployment-related-settings), including running deployment scripts.  
- Deployment logs. 

For more information, see [Kudu documentation](https://github.com/projectkudu/kudu/wiki/Deploying-from-a-zip-file).

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

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Upload ZIP file to Cloud Shell

If you choose to run the Azure CLI from your local terminal instead, skip this step.

Follow the steps here to upload your ZIP file to the Cloud Shell. 

[!INCLUDE [app-service-web-upload-zip.md](../../includes/app-service-web-upload-zip-no-h.md)]

For more information, see [Persist files in Azure Cloud Shell](../cloud-shell/persisting-shell-storage.md).

## Deploy ZIP file

Deploy the uploaded ZIP file to your web app by using the [az webapp deployment source config-zip](/cli/azure/webapp/deployment/source?view=azure-cli-latest#az_webapp_deployment_source_config_zip) command. If you choose not to use Cloud Shell, make sure your Azure CLI version is 2.0.21 or later. To see which version you have, run `az --version` command in the local terminal window. 

The following example deploys the ZIP file you uploaded. When using a local installation of Azure CLI, specify the path to your local ZIP file for `--src`.   

```azurecli-interactive
az webapp deployment source config-zip --resource-group myResouceGroup --name <app_name> --src clouddrive/<filename>.zip
```

This command deploys the files and directories from the ZIP file to your default App Service application folder (`\home\site\wwwroot`) and restarts the app. If any additional custom build process is configured, it is run as well. For more information, see [Kudu documentation](https://github.com/projectkudu/kudu/wiki/Deploying-from-a-zip-file).

To view the list of deployments for this app, you must use the REST APIs (see next section). 

<!-- [!INCLUDE [app-service-deploy-zip-push-rest](../../includes/app-service-deploy-zip-push-rest.md)]  -->

## Next steps

For more advanced deployment scenarios, try [deploying to Azure with Git](app-service-deploy-local-git.md). Git-based deployment to Azure
enables version control, package restore, MSBuild, and more.

## More Resources

* [Kudu: Deploying from a zip file](https://github.com/projectkudu/kudu/wiki/Deploying-from-a-zip-file)
* [Azure App Service Deployment Credentials](app-service-deploy-ftp.md)
