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
> Local Git deployment requires [Source Control Manager (SCM) basic authentication](deploy-configure-credentials.md), which is less secure than [other deployment methods](deploy-authentication-types.md). If [basic authentication is disabled](configure-basic-auth-disable.md), you can't configure local Git deployment in the app's Deployment Center.

## Prerequisites

To complete the steps in this article:

- [!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]
  
- [Install Git](https://www.git-scm.com/downloads), and have a local Git repository that contains app code to deploy.

  You can clone a sample Node.js app repository by running the following command in your local Bash terminal window:
  
  ```bash
  git clone https://github.com/Azure-Samples/nodejs-docs-hello-world.git
  ```

### Deployment user

You need deployment user credentials to deploy your app. The deployment user is different from your Azure account or subscription user. The deployment user can use either [user-scope](deploy-configure-credentials.md#userscope) or [application-scope](deploy-configure-credentials.md#appscope) credentials.

You can configure a user-scope deployment user by using Azure CLI or the Azure portal. Follow the instructions at [Configure user-scope credentials](deploy-configure-credentials.md#userscope). You only need a user name, not a password, to authenticate a local Git deployment user. You must have an existing app to create a user-scope deployment user, but you can then use that same user with all the App Service apps you have access to.

An application-scope user is app-specific and is created automatically when you create the app. You can get the application-scope user credentials from the **Local Git/FTPS credentials** tab in the **Deployment Center** for your app.

[!INCLUDE [Prepare repository](../../includes/app-service-deploy-prepare-repo.md)]

## Create and configure a Git-enabled app

You can create and configure a Git-enabled app, or configure local Git deployment for a pre-existing app, by using Azure CLI, Azure PowerShell, or the Azure portal.

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
The URL contains the user-scope deployment user name. If there's no user-scope deployment user name, the URL uses the [application-scope user name](deploy-configure-credentials.md#appscope), for example `https://$myApp@myApp.scm.azurewebsites.net/myApp.git`.

Use this Git clone URL to deploy your app in the next step.

# [Azure PowerShell](#tab/powershell)

1. To create a new web app, run [New-AzWebApp](/powershell/module/az.websites/new-azwebapp) from the root of your cloned Git repository. For example:

   ```azurepowershell
   New-AzWebApp -Name myApp
   ```

   When you run this cmdlet from a directory that's a Git repository, it automatically creates a Git remote repository named `azure` for your App Service app.

1. Run the [Set-AzResource](/powershell/module/az.resources/set-azresource) cmdlet to set the `scmType` of your new or pre-existing app, for example:

   ```azurepowershell
   $PropertiesObject = @{
       scmType = "LocalGit";
   }
   
   Set-AzResource -PropertyObject $PropertiesObject -ResourceGroupName myResourceGroup `
   -ResourceType Microsoft.Web/sites/config -ResourceName myApp/web `
   -ApiVersion 2015-08-01 -Force
   ```

# [Azure portal](#tab/portal)

### Create the app

In the [Azure portal](https://portal.azure.com), create an App Service app by following any of the portal-based instructions under **Create your first app** at [Getting started with Azure App Service](getting-started.md).

- For the sample repository, use the [Node.js](getting-started.md?pivots=stack-nodejs#nodejs) instructions and select **Node 20 LTS** for **Runtime stack** on the **Basics** tab.
- At the bottom of the **Deployment** tab on the **Create Web App** page, set **Basic Authentication** to **Enabled**.

When the app is created, select **Go to resource**.

### Configure local Git deployment

1. On the Azure portal page for your new or pre-existing app, select **Deployment Center** under **Deployment** in the left navigation menu.
1. On the **Settings** tab, select **Local Git** from the dropdown list next to **Source**, and then select **Save**.

   :::image type="content" source="media/deploy-local-git/enable-portal.png" alt-text="Screenshot that shows how to enable local Git deployment for App Service in the Azure portal.":::

1. When the configuration completes, the **Git clone URI** appears under **Local Git** on the **Settings** screen. This URI doesn't contain any sign-in information. Copy the value to use in the next step.

-----

## Deploy the web app

To deploy the app to Azure, create a remote branch, make sure you're deploying to the correct branch, and then push your code to the remote.

### Create the remote branch

1. In a local Bash terminal, change directory to the root of your cloned Git repository. 
1. Add a Git remote named `azure` by using your Git clone URL. If you don't know your Git clone URL, use `https://<app-name>.scm.azurewebsites.net/<app-name>.git`.

   ```bash
   git remote add azure <git-clone-url>
   ```

   >[!NOTE]
   >If you used Azure PowerShell`New-AzWebApp` to create the app, the `azure` remote was already created.

<a name="change-deployment-branch"></a>
### Push to the correct branch

App Service repositories deploy files to the `master` branch by default. If your local code is in the `master` branch of your repository, you can now deploy your app by running `git push azure master`.

However, many Git repositories, including the sample code repository for this article, use `main` or another default branch name. To deploy to the correct branch, you must either explicitly deploy to the remote `master` branch, or change the deployment branch to `main` or other branch name and then deploy to that branch.

Explicitly deploy to `master` from your `main` branch by using the following `push` command:

```bash
git push azure main:master
```

Or change your app's `DEPLOYMENT_BRANCH` app setting to `main` and then push directly to `main`, as follows:

- Azure CLI:

  ```azurecli
  az webapp config appsettings set --name <app-name> --resource-group <group-name> --settings DEPLOYMENT_BRANCH='main'
  git push azure main
  ```

- Azure portal:

  1. On the portal page for your app, select **Environment variables** under **Settings** in the left navigation menu.
  1. Select **Add**, and add an application setting with the name *DEPLOYMENT_BRANCH*  and the value *main*.
  1. In the Bash terminal, run `git push azure main`.

### Finish and verify the deployment

After you push your code, if the **Git Credential Manager** dialog appears, enter your user-scope deployment user name or application-scope user name and password. If your Git remote URL already contains the sign-in information, you aren't prompted to enter it.

Review the output from the `push` command. You might see runtime-specific automation, such as `npm install` for Node.js, `MSBuild` for ASP.NET, or `pip install` for Python. If you get errors, see [Troubleshoot deployment](#troubleshoot-deployment).

Go to the Azure portal and verify that the app deployed successfully by selecting the **Default domain** link on the app's **Overview** page. The app should open in a browser tab and display **Hello World!**.

## Troubleshoot deployment

The following common errors might occur when you use local Git to publish to an App Service app in Azure:

|Message|Cause|Resolution|
|---|---|---|
|`Unable to access '[siteURL]': Failed to connect to [scmAddress]`|The app isn't running.|In the Azure portal, start the app. Git deployment isn't available when the web app is stopped.|
|`Couldn't resolve host 'hostname'`|The address information for the `azure` remote is incorrect.|Use the `git remote -v` command to list all remotes and their associated URLs. Verify that the URL for the `azure` remote is correct. If necessary, remove the incorrect URL by using `git remote remove` and then recreate the remote with the correct URL.|
|`No refs in common and none specified; doing nothing. Perhaps you should specify a branch such as 'main'.`|You didn't specify a branch when you ran `git push` or you didn't set the `push.default` value in `.gitconfig`.|Run `git push` again and specify the main branch with `git push azure main`.|
|`Error - Changes committed to remote repository but deployment to website failed.`|You pushed a local branch that doesn't match the app deployment branch on `azure`.|Verify that the current branch is `master`, or change the deployment branch by following the instructions at [Change the deployment branch](#change-the-deployment-branch). |
|`src refspec [branchname] does not match any.`|You tried to push to a branch other than `main` on the `azure` remote.|Run `git push` again, and specify the `main` branch with `git push azure main`.|
|`RPC failed; result=22, HTTP code = 5xx.`|You tried to push a large Git repository over HTTPS.|Change the git configuration on the local computer to set a higher value for `postBuffer`. For example: `git config --global http.postBuffer 524288000`.|
|`Error - Changes committed to remote repository but your web app not updated.`|You deployed a Node.js app with a *package.json* file that specifies added required modules.|Review the `npm ERR!` error messages that appear before this error for more context. The following known causes of this error produce the corresponding `npm ERR!` messages:<br />**Malformed package.json file**: `npm ERR! Couldn't read dependencies.`<br />**Native module doesn't have a binary distribution for Windows**: `npm ERR! \cmd "/c" "node-gyp rebuild"\ failed with 1`<br />or `npm ERR! [modulename@version] preinstall: \make \|\| gmake\` |

## Related content

- [App Service build server (Project Kudu documentation)](https://github.com/projectkudu/kudu/wiki)
- [Continuous deployment to Azure App Service](deploy-continuous-deployment.md)
- [Sample: Create a web app and deploy code from a local Git repository (Azure CLI)](./scripts/cli-deploy-local-git.md?toc=%2fcli%2fazure%2ftoc.json)
- [Sample: Create a web app and deploy code from a local Git repository (PowerShell)](./scripts/powershell-deploy-local-git.md?toc=%2fpowershell%2fmodule%2ftoc.json)
