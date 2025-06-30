---
title: Manage Deployment Credentials
description: Learn about the types of deployment credentials for deploying local apps to Azure App Service and how to configure and use them.
author: cephalin
ms.author: cephalin
ms.reviewer: byvinyal
ms.topic: how-to
ms.date: 06/30/2025

---

# Manage deployment credentials for Azure App Service

You can deploy local apps to [Azure App Service](overview.md) by using [local Git deployment](deploy-local-git.md) or [FTP/S deployment](deploy-ftp.md). This article explains how to create and manage deployment credentials for local Git or FTP/S deployment.

App Service supports two types of credentials for secure local app deployment: *user-scope* and *app-scope* credentials. These deployment credentials are different from your Azure subscription credentials.

[!INCLUDE [app-service-deploy-credentials](../../includes/app-service-deploy-credentials.md)]

## Prerequisites

To access, set, or reset deployment user credentials, you must have **Contributor**-level permissions on an App Service app.

<a name="disable-basic-authentication"></a>
### Basic authentication requirement

To publish App Service apps via local Git or FTP/S, you must enable basic authentication. **SCM Basic Auth Publishing Credentials** and **FTP Basic Auth Publishing Credentials** must both be set to **On** on the app's **Configuration** page in the Azure portal.

Basic authentication is less secure than other authentication methods and is disabled by default for new apps. If basic authentication is disabled, you can't view or set deployment credentials in the app's **Deployment Center** or use these credentials for publishing. For more information, see [Disable basic authentication in Azure App Service deployments](configure-basic-auth-disable.md).

<a name="userscope"></a>
## Set user-scope credentials

For FTP/S deployment, you need both a user name and a password. Local Git deployment requires a user name but not a password.

The user name must be unique within Azure. For local Git deployment, the user name can't contain the `@` character.

For FTP/S:

- The user name must follow the format `<app-name>\<user-name>`. Since user-scope credentials are linked to the user and not to the app, the username must be in this format to direct the sign-in action to the correct FTP/S endpoint for the app.

- The password must be at least eight characters and contain capital letters, lowercase letters, numbers, and symbols. The JSON output from credential creation shows the password as `null`.

You can configure user-scope credentials by using Azure CLI or the Azure portal.

# [Azure CLI](#tab/cli)

To create user-scope credentials using Azure CLI, run the [`az webapp deployment user set`](/cli/azure/webapp/deployment/user#az-webapp-deployment-user-set) command, replacing `<username>` and `<password>` with values you select.

```azurecli-interactive
az webapp deployment user set --user-name <username> --password <password>
```

# [Azure PowerShell](#tab/powershell)

You can't create user-scope credentials by using Azure PowerShell. Use Azure CLI or the Azure portal to create the credentials, or use app-scope credentials to deploy to FTP/S or local Git.

# [Azure portal](#tab/portal)

In the [Azure portal](https://portal.azure.com), you must have at least one app to use for setting user-scope credentials. The credentials then apply to all apps for all subscriptions in your Azure account that have **SCM Basic Auth** and **FTP Basic Auth** enabled.

1. Select **Deployment Center** under **Deployment** in the left navigation menu of an app.
1. Select the **FTPS credentials** tab, or if **Local Git** is configured as the build source, the **Local Git/FTPS credentials** tab.
1. In the **User-scope** section, add a **Username**.
1. Add and confirm a **Password**.
1. Select **Save**.

-----

After you set user-scope credentials, you can see your deployment user name on your app's **Overview** page in the Azure portal. If local Git deployment is configured, the label is **Git/Deployment username**. Otherwise, the label is **FTP/Deployment username**.

The portal doesn't show the password. If you forget your password, you can [reset your credentials](#reset-credentials) to get a new one.

![Screenshot that shows the Git deployment user name on an app's Overview page.](./media/app-service-deployment-credentials/deployment_credentials_overview.png)

<a name="appscope"></a>
## Get application-scope credentials

The application-scope credentials are automatically created at app creation. The FTP/S app-scope user name always follows the format `app-name\$app-name`. The local Git user name uses the format `$app-name`.

>[!NOTE]
>When you use `git remote add` in shells that use the dollar sign for variable interpolation, such as Bash, you must use `\$` to escape any dollar signs in the username or password to avoid authentication errors.

You can get your app-scope credentials by using Azure CLI, Azure PowerShell, or the Azure portal.

# [Azure CLI](#tab/cli)

In Azure CLI, get the application-scope credentials by using the [`az webapp deployment list-publishing-profiles`](/cli/azure/webapp/deployment#az-webapp-deployment-list-publishing-profiles) command. For example:

```azurecli-interactive
az webapp deployment list-publishing-profiles --resource-group myResourceGroup --name myApp
```

For [local Git deployment](deploy-local-git.md), you can also use the [`az webapp deployment list-publishing-credentials`](/cli/azure/webapp/deployment#az-webapp-deployment-list-publishing-credentials) command. The following example returns a Git remote URI that has the application-scope credentials for the app already embedded.

```azurecli-interactive
az webapp deployment list-publishing-credentials --resource-group myResourceGroup --name myApp --query scmUri
```

The returned Git remote URI doesn't have `/<app-name>.git` at the end. If you use the URI to add a remote, append `/<app-name>.git` to the URI to avoid an error `22` with `git-http-push`.

# [Azure PowerShell](#tab/powershell)

In Azure PowerShell, get the application-scope credentials by using the [`Get-AzWebAppPublishingProfile`](/powershell/module/az.websites/get-azwebapppublishingprofile) command. For example:

```azurepowershell-interactive
Get-AzWebAppPublishingProfile -ResourceGroupName myResourceGroup -Name myApp
```

# [Azure portal](#tab/portal)

To get the application-scope credentials in the Azure portal:

1. Select **Deployment Center** under **Deployment** in the left navigation menu of your app.
1. On the **Deployment Center** page, select the **FTPS credentials** or **Local Git/FTPS credentials** tab.
1. In the **Application-scope** section, view the **FTPS username**, **Local Git username**, and **Password**. Select the copy icons to copy the values.

-----

## Reset credentials

You can use Azure CLI, Azure PowerShell, or the Azure portal to reset your application-scope deployment credentials and get a new password. The app-scope user names retain their autogenerated values.

In Azure CLI and the Azure portal, you can also reset your user-scope credentials by creating new ones. This action affects all the apps in your account that use the user-scope credentials.

When you reset your deployment credentials, any external integrations and automation via the publishing profile stop working and must be reconfigured with the new values.

# [Azure CLI](#tab/cli)

In Azure CLI, reset the application-scope password by using the [`az resource invoke-action`](/cli/azure/resource#az-resource-invoke-action) command.

```azurecli-interactive
az resource invoke-action --action newpassword --resource-group <group-name> --name <app-name> --resource-type Microsoft.Web/sites
```

Reset the user-scope credentials by rerunning the [`az webapp deployment user set`](/cli/azure/webapp/deployment/user#az-webapp-deployment-user-set) command to create new user name and password values.

```azurecli-interactive
az webapp deployment user set --user-name <new-username> --password <new-password>
```

# [Azure PowerShell](#tab/powershell)

In Azure PowerShell, reset the application-scope password by using the [`Invoke-AzResourceAction`](/powershell/module/az.resources/invoke-azresourceaction) command:

```azurepowershell-interactive
Invoke-AzResourceAction -ResourceGroupName <group-name> -ResourceType Microsoft.Web/sites -ResourceName <app-name> -Action newpassword
```

# [Azure portal](#tab/portal)

In the Azure portal, select **Deployment Center** from your app's left navigation menu, and then select the **FTPS credentials** or **Local Git/FTPS credentials** tab.

- To reset your app-scope credentials and get a new password, select **Reset** at the bottom of the **Application-scope** section.

- To reset your user-scope credentials:
  1. Select **Reset** at the bottom of the **User-scope** section. This selection deletes both user name and password, and disables user-scope credentials.
  1. To reset and reenable your user-scope credentials, enter a new username and password, and select **Save**.

This action takes effect across all the apps in your account that use the user-scope credentials.

-----

## Related content

- [Disable basic authentication in Azure App Service deployments](configure-basic-auth-disable.md)
- [Deploy to Azure App Service by using local Git](deploy-local-git.md)
- [Deploy your app to Azure App Service using FTP/S](deploy-ftp.md)
