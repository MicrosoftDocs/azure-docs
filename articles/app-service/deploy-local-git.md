---
title: Deploy From a Local Git Repository
description: Learn how to configure and carry out local Git deployment to Azure App Service.
ms.topic: how-to
ms.date: 06/24/2025
ms.reviewer: dariac
ms.custom: devx-track-azurecli, devx-track-azurepowershell
author: cephalin
ms.author: cephalin
---
# Deploy to Azure App Service by using local Git

One of the simplest ways to deploy code is from your local computer. This article shows you how to deploy your app to [Azure App Service](overview.md) from a Git repository on your local computer.

> [!NOTE]
> Local Git deployment requires [Source Control Manager (SCM) basic authentication](deploy-configure-credentials.md), which is less secure than [other deployment methods](deploy-authentication-types.md). If [basic authentication is disabled]((configure-basic-auth-disable.md)), you can't configure local Git deployment in the app Deployment Center.

## Prerequisites

To complete the steps in this article:

- [!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]
  
- [Install Git](https://www.git-scm.com/downloads), and have a local Git repository with code to deploy.

   To clone a sample repository, run the following command in your local terminal window:
  
  ```bash
  git clone https://github.com/Azure-Samples/nodejs-docs-hello-world.git
  ```

- Configure a deployment user. You can use either [user-scope](deploy-configure-credentials.md#userscope) or [application-scope](deploy-configure-credentials.md#appscope) credentials to deploy your app.

  - To configure a *user-scope deployment user* by using the Azure portal or Azure CLI, follow the instructions at [Configure user-scope credentials](#deploy-configure-credentials.md#userscope). You only need a user name, not a password, to create a local Git deployment user. The deployment user name is different from your Azure account user name. You can use the same App Service deployment user for all the apps in your Azure subscription.
  - An *application-scope user* is app-specific and is created automatically when you create an app. You can get the application-scope user credentials from the **Local Git/FTPS credentials** tab in the **Deployment Center** for your app.

[!INCLUDE [Prepare repository](../../includes/app-service-deploy-prepare-repo.md)]

## Create and configure a Git-enabled app

You can create and configure a Git-enabled app by using Azure CLI, Azure PowerShell, or the Azure portal.

# [Azure CLI](#tab/cli)

- To create a new web app configured for local Git deployment, run [az webapp create](/cli/azure/webapp#az-webapp-create) with the `--deployment-local-git` option. For example:

  ```azurecli
  az webapp create --resource-group myResourceGroup --plan myAppServicePlan --name myApp --runtime "NODE:20-lts" --deployment-local-git
  ```

- To configure local Git deployment for an already-existing app, run [az webapp deployment source config-local-git](/cli/azure/webapp/deployment/source#az-webapp-deployment-source-config-local-git). For example:

  ```azurecli
  az webapp deployment source config-local-git --name myApp --resource-group myResourceGroup
  ```

Either command produces output that includes a URL, such as:

```output
Local git is configured with url of 'https://contoso-user@myapp.scm.azurewebsites.net/myApp.git'
```
The URL contains the user-scope deployment user name. If there's no user-scope deployment user name, the URL for the app uses the [application-scope user name](deploy-configure-credentials.md#appscope), for example `https://$myApp@myApp.scm.azurewebsites.net/myApp.git`. Use this URL to deploy your app in the next step.

# [Azure PowerShell](#tab/powershell)

1. Run [New-AzWebApp](/powershell/module/az.websites/new-azwebapp) from the root of your cloned Git repository. For example:

   ```azurepowershell
   New-AzWebApp -Name myApp
   ```

   When you run this cmdlet from a directory that's a Git repository, it automatically creates a Git remote repository named `azure` for your App Service app.

1. Set the `scmType` of your app by running the [Set-AzResource](/powershell/module/az.resources/set-azresource) cmdlet.

   ```azurepowershell
   $PropertiesObject = @{
       scmType = "LocalGit";
   }
   
   Set-AzResource -PropertyObject $PropertiesObject -ResourceGroupName <group-name> `
   -ResourceType Microsoft.Web/sites/config -ResourceName <app-name>/web `
   -ApiVersion 2015-08-01 -Force
   ```

# [Azure portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), create an App Service app by following any of the portal-based instructions under **Create your first app** at [Getting started with Azure App Service](getting-started.md). On the **Deployment** tab of the app creation screen, make sure to set **Basic Authentication** to **Enabled**.
1. When the app is created, select **Go to resource**.
1. Select **Deployment Center** under **Deployment** in the left navigation menu for the app.
1. On the **Settings** tab, select **Local Git** from the dropdown list next to **Source**, and then select **Save**.

   :::image type="content" source="media/deploy-local-git/enable-portal.png" alt-text="Screenshot that shows how to enable local Git deployment for App Service in the Azure portal.":::

1. The **Git clone URI** appears under **Local Git** on the **Settings** screen. This URI doesn't contain any sign-in information. Copy the value to use in the next step.

If you already have an app to use, you can configure local Git deployment from the **Settings** tab of the app's **Deployment Center**. Copy the deployment URI.

-----

## Deploy the web app

1. In a local Bash terminal window, change directory to the root of your cloned Git repository. 
1. Add a Git remote by using the URL returned from configuring your app.
   - If you used Azure PowerShell`New-AzWebApp` to create the app, the remote is already created.
   - If the method you used didn't provide a URL, use `https://<app-name>.scm.azurewebsites.net/<app-name>.git` for the URL.

   ```bash
   git remote add azure <url>
   ```

1. Push to the Azure remote branch by running `git push azure main`.
1. If the **Git Credential Manager** dialog appears, enter your user-scope deployment user name or application-scope sign-in information. If your Git remote URL already contains the sign-in information, you aren't prompted to enter it.
1. Review the output. You might see runtime-specific automation, such as `MSBuild` for ASP.NET, `npm install` for Node.js, or `pip install` for Python.
1. If you get errors, see [Troubleshoot deployment](#troubleshoot-deployment) or [Change the deployment branch](#change-the-deployment-branch).
1. In the Azure portal, verify that the app deployed successfully by selecting the **Default domain** link on the app's **Overview** page. The app should open in a browser tab and display **Hello World!**.

<a name="change-deployment-branch"></a>
## Change the deployment branch

When you push commits to your `azure` App Service repository, App Service deploys the files in the `master` branch by default. Many Git repositories, including the sample code repository for this article, use `main` as the default branch. You must ensure that you push to the correct branch in the App Service repository by taking one of the following steps:

- Explicitly deploy to `master` instead of `main` by using the following `push` command:

  ```bash
  git push azure main:master
  ```

- Change the `DEPLOYMENT_BRANCH` app setting to `main`, and then push the commit to `main`.

  - Azure CLI:

  ```azurecli
  az webapp config appsettings set --name <app-name> --resource-group <group-name> --settings DEPLOYMENT_BRANCH='main'
  git push azure main
  ```

  Azure portal:

  1. On the portal page for your app, select **Environment variables** under **Settings** in the left navigation menu.
  1. On the **Environmental variables** page, select **Add**.
  1. On the **Add/edit application setting** screen, enter *DEPLOYMENT_BRANCH* for **Name** and *main* for **Value**, and then select **Apply**.
  1. In the Bash terminal, run `git push azure main`.

## Troubleshoot deployment

The following common errors might occur when you use local Git to publish to an App Service app in Azure:

|Message|Cause|Resolution|
|---|---|---|
|`Unable to access '[siteURL]': Failed to connect to [scmAddress]`|The app isn't running.|In the Azure portal, start the app. Git deployment isn't available when the web app is stopped.|
|`Couldn't resolve host 'hostname'`|The address information for the `azure` remote is incorrect.|Use the `git remote -v` command to list all remotes and their associated URLs. Verify that the URL for the `azure` remote is correct. If necessary, remove the incorrect URL by using `git remote remove` and then recreate the remote with the correct URL.|
|`No refs in common and none specified; doing nothing. Perhaps you should specify a branch such as 'main'.`|You didn't specify a branch when you ran `git push` or you didn't set the `push.default` value in `.gitconfig`.|Run `git push` again and specify the main branch with `git push azure main`.|
|`Error - Changes committed to remote repository but deployment to website failed.`|You pushed a local branch that doesn't match the app deployment branch on `azure`.|Verify that the current branch is `master`, or change the deployment branch by following the instructions at [Change the deployment branch](#change-the-deployment-branch). |
|`src refspec [branchname] does not match any.`|You tried to push to a branch other than `main` on the `azure` remote.|Run `git push` again, and specify the main branch with `git push azure main`.|
|`RPC failed; result=22, HTTP code = 5xx.`|You might have tried to push a large Git repository over HTTPS.|Change the git configuration on the local computer to set a higher value for `postBuffer`. For example: `git config --global http.postBuffer 524288000`.|
|`Error - Changes committed to remote repository but your web app not updated.`|You deployed a Node.js app with a *package.json* file that specifies added required modules.|Review the `npm ERR!` error messages that appear before this error for more context. The following causes are known causes of this error and the corresponding `npm ERR!` messages:<br />**Malformed package.json file**: `npm ERR! Couldn't read dependencies.`<br />**Native module doesn't have a binary distribution for Windows**: `npm ERR! \cmd "/c" "node-gyp rebuild"\ failed with 1` or `npm ERR! [modulename@version] preinstall: \make \|\| gmake\` |

## Related content

- [App Service build server (Project Kudu documentation)](https://github.com/projectkudu/kudu/wiki)
- [Continuous deployment to Azure App Service](deploy-continuous-deployment.md)
- [Sample: Create a web app and deploy code from a local Git repository (Azure CLI)](./scripts/cli-deploy-local-git.md?toc=%2fcli%2fazure%2ftoc.json)
- [Sample: Create a web app and deploy code from a local Git repository (PowerShell)](./scripts/powershell-deploy-local-git.md?toc=%2fpowershell%2fmodule%2ftoc.json)
