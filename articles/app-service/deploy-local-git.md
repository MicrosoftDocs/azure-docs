---
title: Deploy from a Local Git Repository
description: Learn how to enable local Git deployment to Azure App Service. One of the simplest ways to deploy code is from your local computer.
ms.topic: how-to
ms.date: 02/29/2024
ms.reviewer: dariac
ms.custom: devx-track-azurecli, devx-track-azurepowershell
author: cephalin
ms.author: cephalin
---
# Deploy to Azure App Service by using Git locally

This article shows you how to deploy your app to [Azure App Service](overview.md) from a Git repository on your local computer.

> [!NOTE]
> This deployment method requires [Source Control Manager (SCM) basic authentication](configure-basic-auth-disable.md), which is less secure than [other deployment methods](deploy-authentication-types.md). If local Git deployment doesn't work, you can't configure local Git deployment in the app Deployment Center.

## Prerequisites

To complete the steps that are described in this article:

- [!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]
  
- [Install Git](https://www.git-scm.com/downloads).

- Have a local Git repository with code to deploy. To download a sample repository, run the following command in your local terminal window:
  
  ```bash
  git clone https://github.com/Azure-Samples/nodejs-docs-hello-world.git
  ```

[!INCLUDE [Prepare repository](../../includes/app-service-deploy-prepare-repo.md)]

## Configure a deployment user

Learn how to [configure deployment credentials for Azure App Service](deploy-configure-credentials.md). You can use either user-scope sign-in information or application-scope sign-in information.

## Create a Git-enabled app

If you already have an App Service app and you want to configure a local Git deployment for the app, see [Configure an existing app](#configure-an-existing-app) instead.

# [Azure CLI](#tab/cli)

Run [az webapp create](/cli/azure/webapp#az-webapp-create) with the `--deployment-local-git` option.

For example:

```azurecli
az webapp create --resource-group <group-name> --plan <plan-name> --name <app-name> --runtime "<runtime-flag>" --deployment-local-git
```

The output contains a URL like the example `https://<deployment-username>@<app-name>.scm.azurewebsites.net/<app-name>.git`. Use this URL to deploy your app in the next step.

# [Azure PowerShell](#tab/powershell)

Run [New-AzWebApp](/powershell/module/az.websites/new-azwebapp) from the root of your Git repository.

For example:

```azurepowershell
New-AzWebApp -Name <app-name>
```

When your run this cmdlet from a directory that's a Git repository, a Git remote named `azure` for your App Service app is automatically created.

# [Azure portal](#tab/portal)

In the portal, create an app first. Then, set up deployment for the app. For more information, see [Configure an existing app](#configure-an-existing-app).

-----

## Configure an existing app

If you don't have an app yet, get started with [Create a Git enabled app](#create-a-git-enabled-app).

# [Azure CLI](#tab/cli)

Run [az webapp deployment source config-local-git](/cli/azure/webapp/deployment/source#az-webapp-deployment-source-config-local-git).

For example:

```azurecli
az webapp deployment source config-local-git --name <app-name> --resource-group <group-name>
```

The output contains a URL like the example `https://<deployment-username>@<app-name>.scm.azurewebsites.net/<app-name>.git`. Use this URL to deploy your app in the next step.

> [!TIP]
> This URL contains the user-scope deployment username. You can [use application-scope sign-in information](deploy-configure-credentials.md#appscope) instead.

# [Azure PowerShell](#tab/powershell)

Set the `scmType` of your app by running the [Set-AzResource](/powershell/module/az.resources/set-azresource) cmdlet.

```azurepowershell
$PropertiesObject = @{
    scmType = "LocalGit";
}

Set-AzResource -PropertyObject $PropertiesObject -ResourceGroupName <group-name> `
-ResourceType Microsoft.Web/sites/config -ResourceName <app-name>/web `
-ApiVersion 2015-08-01 -Force
```

# [Azure portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), go to your app.

1. On the resource menu, select **Deployment Center** > **Settings**.
1. For **Source**, select **Local Git**, and then select **Save**.

   :::image type="content" source="media/deploy-local-git/enable-portal.png" alt-text="Screenshot that shows how to enable local Git deployment for App Service in the Azure portal.":::

1. In the **Local Git** section, copy the value for **Git Clone Uri** to use later. This URI doesn't contain any sign-in information.

-----

## Deploy the web app

1. In a local terminal window, change the directory to the root of your Git repository. Add a Git remote by using the URL from your app. If the method you use doesn't provide a URL, use `https://<app-name>.scm.azurewebsites.net/<app-name>.git` with your app name.

   ```bash
   git remote add azure <url>
   ```

    > [!NOTE]
    > If you [created a Git-enabled app in PowerShell by using New-AzWebApp](#create-a-git-enabled-app), the remote is already created.

1. Push to the Azure remote branch by running `git push azure master`.

   For more information, see [Change the deployment branch](#change-the-deployment-branch).

1. In the **Git Credential Manager** dialog, enter your [user-scope or application-scope sign-in information](#configure-a-deployment-user), not your Azure sign-in information.

   If your Git remote URL already contains your username and password, you aren't prompted to enter them.

1. Review the output. You might see runtime-specific automation, such as MSBuild for ASP.NET, npm install for Node.js, or pip install for Python.

1. In the Azure portal, go to your app to verify that the content is deployed.

<a name="change-deployment-branch"></a>

## Change the deployment branch

When you push commits to your App Service repository, App Service deploys the files in the `master` branch by default. Because many Git repositories are moving from `master` to `main`, ensure that you push to the correct branch in the App Service repository in one of two ways:

- Explicitly deploy to `master` by running a command like in this example:

  ```bash
  git push azure main:master
  ```

- Change the deployment branch by setting the `DEPLOYMENT_BRANCH` app setting, and then push commits to the custom branch.

  To do it by using the Azure CLI:

  ```azurecli
  az webapp config appsettings set --name <app-name> --resource-group <group-name> --settings DEPLOYMENT_BRANCH='main'
  git push azure main
  ```

   You can also change the `DEPLOYMENT_BRANCH` app setting in the Azure portal:

   1. Under **Settings**, select **Environment variables**.
   1. Add an app setting that has the name `DEPLOYMENT_BRANCH` and the value `main`.

## Troubleshoot deployment

You might see the following common error messages when you use Git to publish to an App Service app in Azure:

|Message|Cause|Resolution|
|---|---|---|
|`Unable to access '[siteURL]': Failed to connect to [scmAddress]`|The app isn't running.|In the Azure portal, start the app. Git deployment isn't available when the web app is stopped.|
|`Couldn't resolve host 'hostname'`|The address information for the `azure` remote is incorrect.|Use the `git remote -v` command to list all remotes and their associated URLs. Verify that the URL for the `azure` remote is correct. If needed, remove and and then re-create this remote by using the correct URL.|
|`No refs in common and none specified; doing nothing. Perhaps you should specify a branch such as 'main'.`|You didn't specify a branch when you ran `git push` or you haven't set the `push.default` value in `.gitconfig`.|Run `git push` again, and specify the main branch: `git push azure main`.|
|`Error - Changes committed to remote repository but deployment to website failed.`|You pushed a local branch that doesn't match the app deployment branch on `azure`.|Verify that the current branch is `master`. To change the default branch, use the `DEPLOYMENT_BRANCH` application setting. For more information, see [Change deployment branch](#change-the-deployment-branch). |
|`src refspec [branchname] does not match any.`|You tried to push to a branch other than `main` on the `azure` remote.|Run `git push` again, and specify the main branch: `git push azure main`.|
|`RPC failed; result=22, HTTP code = 5xx.`|This error might occur if you try to push a large git repository over HTTPS.|Change the git configuration on the local computer to set a higher value for `postBuffer`. For example: `git config --global http.postBuffer 524288000`.|
|`Error - Changes committed to remote repository but your web app not updated.`|You deployed a Node.js app with a _package.json_ file that specifies additional required modules.|Review the `npm ERR!` error messages that appear before this error for more context. The following causes are known causes of this error and the corresponding `npm ERR!` messages:<br /><br />**Malformed package.json file**: `npm ERR! Couldn't read dependencies.`<br /><br />**Native module doesn't have a binary distribution for Windows**:<br />`npm ERR! \cmd "/c" "node-gyp rebuild"\ failed with 1` <br />or <br />`npm ERR! [modulename@version] preinstall: \make \|\| gmake\` |

## Related content

- [App Service build server (Project Kudu documentation)](https://github.com/projectkudu/kudu/wiki)
- [Continuous deployment to Azure App Service](deploy-continuous-deployment.md)
- [Sample: Create a web app and deploy code from a local Git repository (Azure CLI)](./scripts/cli-deploy-local-git.md?toc=%2fcli%2fazure%2ftoc.json)
- [Sample: Create a web app and deploy code from a local Git repository (PowerShell)](./scripts/powershell-deploy-local-git.md?toc=%2fpowershell%2fmodule%2ftoc.json)
