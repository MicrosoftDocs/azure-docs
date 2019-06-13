---
title: Deploy from local Git repo - Azure App Service
description: Learn how to enable local Git deployment to Azure App Service.
services: app-service
documentationcenter: ''
author: cephalin
manager: cfowler

ms.assetid: ac50a623-c4b8-4dfd-96b2-a09420770063
ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/13/2019
ms.author: dariagrigoriu;cephalin
ms.custom: seodec18

---
# Local Git deployment to Azure App Service

This how-to guide shows you how to deploy your app to [Azure App Service](overview.md) from a Git repository on your local computer.

## Prerequisites

To follow the steps in this how-to guide:

- [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]
  
- [Install Git](https://www.git-scm.com/downloads).
  
- Have a local Git repository with code you want to deploy. To download a sample repository, run the following command in your local terminal window:
  
  ```bash
  git clone https://github.com/Azure-Samples/nodejs-docs-hello-world.git
  ```

[!INCLUDE [Prepare repository](../../includes/app-service-deploy-prepare-repo.md)]

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Use Cloud Shell to deploy with Kudu build server

The easiest way to enable local Git deployment for your app with the Kudu App Service build service is to use Azure Cloud Shell. Start a Cloud Shell session by using one of the methods in the preceding table. 

### Configure a deployment user

[!INCLUDE [Configure a deployment user](../../includes/configure-deployment-user-no-h.md)]

### Enable local Git with Kudu build server

To enable local Git deployment for an existing app with the Kudu build server, run [`az webapp deployment source config-local-git`](/cli/azure/webapp/deployment/source?view=azure-cli-latest#az-webapp-deployment-source-config-local-git) in the Cloud Shell. Replace \<app_name> and \<group_name> with the names of your app and its Azure resource group.

```azurecli-interactive
az webapp deployment source config-local-git --name <app_name> --resource-group <group_name>
```

The `az webapp deployment source config-local-git` command should return the following code. Copy and save the URL to use in the next step.

```json
{
  "url": "<username>@<app_name>.scm.azurewebsites.net/<app_name>.git"
}
```

Or, to create and enable local Git deployment for a new app, run [`az webapp create`](/cli/azure/webapp?view=azure-cli-latest#az-webapp-create) in the Cloud Shell with the `--deployment-local-git` parameter. Replace \<app_name>, \<group_name>, and \<plan_name> with the names of your Git app, your Azure resource group, and your Azure App Service plan name.

```azurecli-interactive
az webapp create --name <app_name> --resource-group <group_name> --plan <plan_name> --deployment-local-git
```

The `az webapp create` command should return something like the following output. Copy and save the URL in the first line to use in the next step.

```json
Local git is configured with url of 'https://<username>@<app_name>.scm.azurewebsites.net/<app_name>.git'
{
  "availabilityState": "Normal",
  "clientAffinityEnabled": true,
  "clientCertEnabled": false,
  "cloningInfo": null,
  "containerSize": 0,
  "dailyMemoryTimeQuota": 0,
  "defaultHostName": "<app_name>.azurewebsites.net",
  "deploymentLocalGitUrl": "https://<username>@<app_name>.scm.azurewebsites.net/<app_name>.git",
  "enabled": true,
  < JSON data removed for brevity. >
}
```

### Deploy your app

1. In your local terminal window, add an Azure remote to your local Git repository. In the command, replace \<url> with the URL of the Git remote that you got from the [previous step](#enable-local-git-with-kudu-build-server).
   
   ```bash
   git remote add azure <url>
   ```
   
1. Push to the Azure remote with `git push azure master`. 
   
1. On the **Git Credential Manager** page, enter the deployment user password you created in [Configure a deployment user](#configure-a-deployment-user), not your Azure sign-in password.
   
1. Review the output. You may see runtime-specific automation, such as MSBuild for ASP.NET, `npm install` for Node.js, and `pip install` for Python. 
   
1. Browse to your app in the Azure portal to verify that the content is deployed.

## Deploy with Azure Pipelines builds

If your Azure account has the necessary permissions, you can set up Azure Pipelines (Preview) to enable local Git deployment for your app. 

- To use Azure Pipelines continuous delivery, your Azure account must have permissions to write to Azure Active Directory and create a service. 
  
- For Azure App Service to create the necessary Azure Pipelines in your Azure DevOps organization, your Azure account must have the **Owner** role in your Azure subscription.

To enable local Git deployment for your app with Azure Pipelines (Preview):

1. Navigate to your Azure App Service app page in the [Azure portal](https://portal.azure.com), and select **Deployment Center** in the left menu.
   
1. On the **Deployment Center** page, select **Local Git**, and then select **Continue**. 
   
   
   ![Select Local Git, and then select Continue](media/app-service-deploy-local-git/portal-enable.png)
   
1. On the **Build provider** page, select **Azure Pipelines (Preview)**, and then select **Continue**. 
   
   
   ![Select Azure Pipelines (Preview), and then select Continue.](media/app-service-deploy-local-git/pipeline-builds.png)

1. On the **Configure** page, configure a new Azure DevOps organization, or specify an existing organization, and then select **Continue**.
   
   > [!NOTE]
   > If your existing Azure DevOps organization doesn't appear in the list, you need to link it to your Azure subscription. For more information, see [Define your CD release pipeline](/azure/devops/pipelines/apps/cd/deploy-webdeploy-webapps#cd).
   
1. Depending on your App Service plan [pricing tier](https://azure.microsoft.com/pricing/details/app-service/plans/), you may see a **Deploy to staging** page. Choose whether to [enable deployment slots](deploy-staging-slots.md), and then select **Continue**.
   
1. On the **Summary** page, review the settings, and then select **Finish**.

1. When the Azure DevOps organization is ready, copy the Git repository URL from the **Deployment Center** page to use in the next step. 

![](media/app-service-deploy-local-git/vsts-repo-ready.png)

1. In your local terminal window, add an Azure remote to your local Git repository. In the command, replace \<url> with the URL of the Git remote that you got from the previous step.
   
   ```bash
   git remote add azure <url>
   ```
   
1. Push to the Azure remote with `git push azure master`. 
   
1. On the **Git Credential Manager** page, sign in with your visualstudio.com username. For additional authentication methods, see [Azure DevOps Services authentication overview](/vsts/git/auth-overview?view=vsts).
   
1. Once deployment is finished, view the build progress at `https://<azure_devops_account>.visualstudio.com/<project_name>/_build` and the deployment progress at `https://<azure_devops_account>.visualstudio.com/<project_name>/_release`.
   
1. Browse to your app to verify that the content is deployed.

[!INCLUDE [What happens to my app during deployment?](../../includes/app-service-deploy-atomicity.md)]

## Troubleshoot deployment

The following error messages are common problems when you use Git to publish to an App Service app in Azure:

---
**Message**: `Unable to access '[siteURL]': Failed to connect to [scmAddress]`
**Cause**: The app isn't up and running.
**Resolution**: Start the app in the Azure portal. Git deployment is unavailable when the Web App is stopped.

---
**Message**: `Couldn't resolve host 'hostname'`
**Cause**: The address information for the 'azure' remote is incorrect.
**Resolution**: Use the `git remote -v` command to list all remotes, along with the associated URL. Verify that the URL for the 'azure' remote is correct. If needed, remove and recreate this remote using the correct URL.

---
**Message**: `No refs in common and none specified; doing nothing. Perhaps you should specify a branch such as 'master'.`
**Cause**: You didn't specify a branch during `git push`, or you haven't set the `push.default` value in `.gitconfig`.
**Resolution**: Run `git push` again, specifying the master branch. For example:

```bash
git push azure master
```

---
**Message**: `src refspec [branchname] does not match any.`
**Cause**: You tried to push to a branch other than master on the 'azure' remote.
**Resolution**: Run `git push` again, specifying the master branch. For example:

```bash
git push azure master
```

---
**Message**: `RPC failed; result=22, HTTP code = 5xx.`
**Cause**: This error can happen if you try to push a large git repository over HTTPS.
**Resolution**: Change the git configuration on the local machine to make the postBuffer bigger

```bash
git config --global http.postBuffer 524288000
```

---
**Message**: `Error - Changes committed to remote repository but your web app not updated.`
**Cause**: You deployed a Node.js app with a _package.json_ file that specifies additional required modules.
**Resolution**: Look at the 'npm ERR!' error messages before this error for more context on the failure. The following are known causes of this error and the corresponding `npm ERR!` messages:

- **Malformed package.json file**: `npm ERR! Couldn't read dependencies.`
- **Native module doesn't have a binary distribution for Windows**:
  `npm ERR! \cmd "/c" "node-gyp rebuild"\ failed with 1`
  or
  `npm ERR! [modulename@version] preinstall: \make || gmake\`

## Additional resources

- [Project Kudu documentation](https://github.com/projectkudu/kudu/wiki)
- [Continuous deployment to Azure App Service](deploy-continuous-deployment.md)
- [Sample: Create a web app and deploy code from a local Git repository (Azure CLI)](./scripts/cli-deploy-local-git.md?toc=%2fcli%2fazure%2ftoc.json)
- [Sample: Create a web app and deploy code from a local Git repository (PowerShell)](./scripts/powershell-deploy-local-git.md?toc=%2fpowershell%2fmodule%2ftoc.json)
