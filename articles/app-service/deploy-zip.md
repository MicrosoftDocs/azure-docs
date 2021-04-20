---
title: Deploy code with a ZIP or WAR file
description: Learn how to deploy your app to Azure App Service with a ZIP file (or a WAR file for Java developers).
ms.topic: article
ms.date: 08/12/2019
ms.reviewer: sisirap
ms.custom: seodec18, devx-track-azurecli

---

# Deploy your app to Azure App Service with a ZIP or WAR file

This article shows you how to use a ZIP file or WAR file to deploy your web app to [Azure App Service](overview.md). 

This ZIP file deployment uses the same Kudu service that powers continuous integration-based deployments. Kudu supports the following functionality for ZIP file deployment: 

- Deletion of files left over from a previous deployment.
- Option to turn on the default build process, which includes package restore.
- Deployment customization, including running deployment scripts.  
- Deployment logs. 
- A file size limit of 2048 MB.

For more information, see [Kudu documentation](https://github.com/projectkudu/kudu/wiki/Deploying-from-a-zip-file).

The WAR file deployment deploys your [WAR](https://wikipedia.org/wiki/WAR_(file_format)) file to App Service to run your Java web app. See [Deploy WAR file](#deploy-war-file).

> [!NOTE]
> When using `ZipDeploy`, files will only be copied if their timestamps don't match what is already deployed. Generating a zip using a build process that caches outputs can result in faster deployments. See [Deploying from a zip file or url](https://github.com/projectkudu/kudu/wiki/Deploying-from-a-zip-file-or-url), for more information.

## Prerequisites

To complete the steps in this article, [create an App Service app](./index.yml), or use an app that you created for another tutorial.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [Create a project ZIP file](../../includes/app-service-web-deploy-zip-prepare.md)]

[!INCLUDE [Deploy ZIP file](../../includes/app-service-web-deploy-zip.md)]
The above endpoint does not work for Linux App Services at this time. Consider using FTP or the [ZIP deploy API](faq-app-service-linux.md#continuous-integration-and-deployment) instead.

## Deploy ZIP file with Azure CLI

Deploy the uploaded ZIP file to your web app by using the [az webapp deployment source config-zip](/cli/azure/webapp/deployment/source#az_webapp_deployment_source_config_zip) command.  

The following example deploys the ZIP file you uploaded. When using a local installation of Azure CLI, specify the path to your local ZIP file for `--src`.

```azurecli-interactive
az webapp deployment source config-zip --resource-group <group-name> --name <app-name> --src clouddrive/<filename>.zip
```

This command deploys the files and directories from the ZIP file to your default App Service application folder (`\home\site\wwwroot`) and restarts the app.

By default, the deployment engine assumes that a ZIP file is ready to run as-is and doesn't run any build automation. To enable the same build automation as in a [Git deployment](deploy-local-git.md), set the `SCM_DO_BUILD_DURING_DEPLOYMENT` app setting by running the following command in the [Cloud Shell](https://shell.azure.com):

```azurecli-interactive
az webapp config appsettings set --resource-group <group-name> --name <app-name> --settings SCM_DO_BUILD_DURING_DEPLOYMENT=true
```

For more information, see [Kudu documentation](https://github.com/projectkudu/kudu/wiki/Deploying-from-a-zip-file-or-url).

[!INCLUDE [app-service-deploy-zip-push-rest](../../includes/app-service-deploy-zip-push-rest.md)]  

## Deploy WAR file

To deploy a WAR file to App Service, send a POST request to `https://<app-name>.scm.azurewebsites.net/api/wardeploy`. The POST request must contain the .war file in the message body. The deployment credentials for your app are provided in the request by using HTTP BASIC authentication.

Always use `/api/wardeploy` when deploying WAR files. This API will expand your WAR file and place it on the shared file drive. using other deployment APIs may result in inconsistent behavior. 

For the HTTP BASIC authentication, you need your App Service deployment credentials. To see how to set your deployment credentials, see [Set and reset user-level credentials](deploy-configure-credentials.md#userscope).

### With cURL

The following example uses the cURL tool to deploy a .war file. Replace the placeholders `<username>`, `<war-file-path>`, and `<app-name>`. When prompted by cURL, type in the password.

```bash
curl -X POST -u <username> --data-binary @"<war-file-path>" https://<app-name>.scm.azurewebsites.net/api/wardeploy
```

### With PowerShell

The following example uses [Publish-AzWebapp](/powershell/module/az.websites/publish-azwebapp) upload the .war file. Replace the placeholders `<group-name>`, `<app-name>`, and `<war-file-path>`.

```powershell
Publish-AzWebapp -ResourceGroupName <group-name> -Name <app-name> -ArchivePath <war-file-path>
```

[!INCLUDE [What happens to my app during deployment?](../../includes/app-service-deploy-atomicity.md)]

## Next steps

For more advanced deployment scenarios, try [deploying to Azure with Git](deploy-local-git.md). Git-based deployment to Azure
enables version control, package restore, MSBuild, and more.

## More resources

* [Kudu: Deploying from a zip file](https://github.com/projectkudu/kudu/wiki/Deploying-from-a-zip-file)
* [Azure App Service Deployment Credentials](deploy-ftp.md)
