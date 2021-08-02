---
title: Deploy code with a ZIP or WAR file
description: Learn how to deploy your app to Azure App Service with a ZIP file (or a WAR file for Java developers).
ms.topic: article
ms.date: 08/12/2019
ms.reviewer: sisirap
ms.custom: seodec18, devx-track-azurepowershell

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
The above endpoint does not work for Linux App Services at this time. Consider using FTP or the [ZIP deploy API](/azure/app-service/faq-app-service-linux#continuous-integration-and-deployment) instead.

## Deploy artifacts with Azure CLI

The `az webapp depoy` command allows you to deploy artifacts to your web app, such as a .zip file of your source code. Using the command's optional parameters, you can change the target directory, deploy artifacts from a remote URL or local file system, and choose to delete the directory. For more information, run `az webapp deploy --help` or [see the CLI docs](cli/azure/webapp?view=azure-cli-latest#az_webapp_deploy).

# [ZIP Files](#tab/zipfiles)

Deploy the uploaded ZIP file to your web app by using the [az webapp deploy](cli/azure/webapp?view=azure-cli-latest#az_webapp_deploy) command.  

The following example deploys the ZIP file you uploaded. When using a local installation of Azure CLI, specify the path to your local ZIP file for `--src-path`.

```azurecli-interactive
az webapp deploy --resource-group <group-name> --name <app-name> --src-path clouddrive/<filename>.zip
```

This command deploys the files and directories from the ZIP file to your default App Service application folder (`\home\site\wwwroot`) and restarts the app. 

# [WAR Files](#tab/warfiles)

To deploy a WAR file to Tomcat or JBoss EAP, specify the path to your local WAR file with the `--src-path` parameter. This API will expand your WAR file and place it on the shared file drive correctly. For that reason, deploying WAR files using FTP or WebDeploy is not recommended.

```azurecli-interactive
az webapp deploy --resource-group <group-name> --name <app-name> --src-path clouddrive/<filename>.war
```

# [Other artifacts](#tab/other-artifacts)

You can also use the `webapps deploy` command to deploy startup scripts, libraries, and static assets by specifying the `--type` parameter. Run `az webapp --help` for the full list of supported artifact types.

### Deploy a startup script

```bash
az webapp deploy --resource group <group-name> --name <app-name> --src-path scripts/startup.sh --type=startup
```

### Deploy a library file

```bash
az webapp deploy --resource group <group-name> --name <app-name> --src-path driver.jar --type=lib
```

### Deploy other static files

```bash
az webapp deploy --resource group <group-name> --name <app-name> --src-path config.json --type=static
```

---

## Deploy artifacts to REST API 

The deployment REST API allows you to specify the same parameters from the CLI command as URL query parameters. The table below shows the available query parameters, their allowed values, and descriptions.

| Key         | Allowed values                           | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Required | Type    |
|-------------|------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|---------|
| type        | war\|jar\|ear\|lib\|startup\|static\|zip | The type of the artifact being deployed, this sets the default target path and informs the web app how the deployment should be handled. <br/> `type=zip` will unzip the zip to `/home/site/wwwroot`. `path` parameter is optional. <br/> `type=war` will deploy the war file to `/home/site/wwwroot/app.war` if `path` is _not_ specified <br/> `type=jar` will deploy the war file to `/home/site/wwwroot/app.jar`. `path` parameter will be ignored <br/> `type=ear` will deploy the war file to `/home/site/wwwroot/app.ear`. `path` parameter will be ignored <br/> `type=lib` will deploy the jar to /home/site/libs. `path` parameter must be specified <br/> `type=static` will deploy the script to `/home/site/scripts`. `path` parameter must specified <br/> `type=startup` will deploy the script as `startup.sh` (Linux) or `startup.cmd` (Windows) to `/home/site/scripts/`. `path` parameter will be ignored | True     | String  |
| restart     | true\|false                              | Determines whether or not the site should be restarted following the deployment. By default, the site will be restarted following any deployment, so if you are deploying multiple artifacts you can prevent restarts on the first deployments and restart on the final deployment.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | False    | Boolean |
| clean       | true\|false                              | Determines whether the target deployment directory should be cleaned (deleted) prior to deploying the artifact there.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | False    | Boolean |
| ignorestack | true\|false                              | The deployment API uses the `WEBSITE_STACK` environment variable to choose safe defaults depending on your site's language stack. Setting this parameter to false will disable any language-specific defaults.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | False    | Boolean |
| path        | The absolute path of the target artifact | The absolute path that the artifact should be deployed to. (Ex: "/home/site/deployments/tools/driver.jar", "/home/site/scripts/helper.sh")                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | False    | String  |


For the HTTP BASIC authentication, you need your App Service deployment credentials. To see how to set your deployment credentials, see [Set and reset user-level credentials](deploy-configure-credentials.md#userscope).


# [ZIP Files](#tab/zipfiles)

TODO

# [WAR Files](#tab/warfiles)

The following example uses the cURL tool to deploy a .war file. Replace the placeholders `<username>`, `<war-file-path>`, and `<app-name>`. When prompted by cURL, type in the password.

```bash
curl -X POST -u <username> --data-binary @"<war-file-path>" https://<app-name>.scm.azurewebsites.net/api/publish&type=war
```

# [Other artifacts](#tab/other-artifacts)

The following example uses the cURL tool to deploy a library


---

## Deploy artifacts with PowerShell

# [ZIP Files](#tab/zipfiles)

TODO

# [WAR Files](#tab/warfiles)

The following example uses [Publish-AzWebapp](/powershell/module/az.websites/publish-azwebapp) upload the .war file. Replace the placeholders `<group-name>`, `<app-name>`, and `<war-file-path>`.

```powershell
Publish-AzWebapp -ResourceGroupName <group-name> -Name <app-name> -ArchivePath <war-file-path>
```

# [Other artifacts](#tab/other-artifacts)

TODO

---

## Enable build automation

By default, the deployment engine assumes that a ZIP file is ready to run as-is and doesn't run any build automation. To enable the same build automation as in a [Git deployment](deploy-local-git.md), set the `SCM_DO_BUILD_DURING_DEPLOYMENT` app setting by running the following command in the [Cloud Shell](https://shell.azure.com):

```azurecli-interactive
az webapp config appsettings set --resource-group <group-name> --name <app-name> --settings SCM_DO_BUILD_DURING_DEPLOYMENT=true
```

For more information, see [Kudu documentation](https://github.com/projectkudu/kudu/wiki/Deploying-from-a-zip-file-or-url).

[!INCLUDE [app-service-deploy-zip-push-rest](../../includes/app-service-deploy-zip-push-rest.md)]  

[!INCLUDE [What happens to my app during deployment?](../../includes/app-service-deploy-atomicity.md)]

## Next steps

For more advanced deployment scenarios, try [deploying to Azure with Git](deploy-local-git.md). Git-based deployment to Azure
enables version control, package restore, MSBuild, and more.

## More resources

* [Kudu: Deploying from a zip file](https://github.com/projectkudu/kudu/wiki/Deploying-from-a-zip-file)
* [Azure App Service Deployment Credentials](deploy-ftp.md)
* [Environment variables and app settings reference](reference-app-settings.md)
