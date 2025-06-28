---
title: Configure Deployment Credentials
description: Learn about the types of deployment credentials for deploying local apps to Azure App Service and how to configure and use them.
author: cephalin
ms.author: cephalin
ms.reviewer: byvinyal
ms.topic: how-to
ms.date: 06/27/2025

---

# Configure deployment credentials for Azure App Service

You can deploy local apps to [Azure App Service](overview.md) by using [local Git deployment](deploy-local-git.md) or [FTP/S deployment](deploy-ftp.md). App Service supports two types of credentials for secure local app deployment, *user-scope* and *app-scope* credentials. These credentials are different from your Azure subscription credentials.

- **User-scope credentials** provide a user with one set of deployment credentials for their entire Azure account. A user who is granted app access via role-based access control (RBAC) or coadministrator permissions can use their user-level credentials until access is revoked.

  You can use your user-scope credentials to deploy any app to App Service via local Git or FTP/S in any subscription that your Azure account has permission to access. Don't share these credentials with other Azure users.

- **App-scope credentials** provide one set of credentials per app, which can be used to deploy that app only. The app-scope credentials for each app are generated automatically during app creation and can't be configured manually, but they can be reset anytime.

  A user must have at least **Contributor** level permissions on an app, including the built-in **Website Contributor** role, to be granted access to app-level credentials via RBAC. **Reader** role can't publish and can't access these credentials.

>[!IMPORTANT]
>Basic authentication must be enabled to publish via local Git or FTP/S. Basic authentication is less secure than other authentication methods and is disabled by default for new apps. When [basic authentication is disabled](configure-basic-auth-disable.md), you can't view or set deployment credentials in the app's **Deployment Center**.
>
>To enable or disable basic authentication, go to the app's **Configuration** page in the Azure portal.

<a name="userscope"></a>
## Set user-scope credentials

You can configure user-scope credentials by using Azure CLI or the Azure portal. For FTP/S deployment, you need both a user name and password. For local Git deployment, you only need a user name. User names must be unique within Azure.

# [Azure CLI](#tab/cli)

To create user-scope credentials, run the [`az webapp deployment user set`](/cli/azure/webapp/deployment/user#az-webapp-deployment-user-set) command, replacing `<username>` and `<password>` with values you select.

```azurecli-interactive
az webapp deployment user set --user-name <username> --password <password>
```
- For FTP/S, the password must be at least eight characters and contain capital letters, lowercase letters, numbers, and symbols. The JSON output shows the password as `null`.
- For local Git, you only need to provide a user name. The user name can't contain the `@` character.

- The user name must follow the format `<app-name>\<user-name>`. Since user-scope credentials are linked to the user and not to the app, the username must be in this format to direct the sign-in action to the FTP/S endpoint for the app. 

# [Azure PowerShell](#tab/powershell)

You can't create user-scope credentials by using Azure PowerShell. Use Azure CLI or the Azure portal to create the credentials instead. To deploy to FTP/S or local Git, you can use app-scope credentials.

# [Azure portal](#tab/portal)

You must have at least one app to use for setting user-scope deployment credentials in the [Azure portal](https://portal.azure.com). You can set the credentials in any app that has **SCM Basic Auth** and **FTP Basic Auth** enabled. The credentials then apply to all apps for all subscriptions in your Azure account that have **SCM Basic Auth** and **FTP Basic Auth** enabled.

To configure deployment credentials:

1. Select **Deployment Center** under **Deployment** in the left navigation menu of an app.
1. If **Local Git** is configured as the build source, select the **Local Git/FTPS credentials** tab. Otherwise, select the **FTPS credentials** tab.
1. In the **User-scope** section, add a **Username**. For local Git deployments, the user name can't contain the `@` character.
1. For FTP/S deployments, add and confirm a **Password**. The password must be at least eight characters and contain contain capital letters, lowercase letters, numbers, and symbols.
1. Select **Save**.

After you set the credentials, you can see your deployment user name on your app's **Overview** page. If local Git deployment is configured, the label is **Git/deployment username**. Otherwise, the label is **FTP/deployment username**. The page doesn't show the password.

![Screenshot that shows you how to find the Git deployment user name on your app's Overview page.](./media/app-service-deployment-credentials/deployment_credentials_overview.png)

-----

### Deploy to FTP/S with user-scope credentials

To authenticate to an FTP/S endpoint by using user-scope credentials, you must prepend the user name with the app name in the format `<app-name>\<user-name>`. Since user-scope credentials are linked to the user and not to the app, the username must be in this format to direct the sign-in action to the correct FTP/S endpoint for the app.

<a name="appscope"></a>
## Get application-scope credentials

The application-scope credentials are automatically created. The FTP/S app-scope user name always follows the format `app-name\$app-name`. The local Git user name follows the format `$app-name`.

>[!NOTE]
>When you use `git remote add` in shells that use the dollar sign for variable interpolation, such as Bash, you must escape any dollar signs in the username or password by using `\$`, to avoid authentication errors.

You can get your app-scope credentials by using Azure CLI, Azure PowerShell, or the Azure portal.

# [Azure CLI](#tab/cli)

Get the application-scope credentials by using the [`az webapp deployment list-publishing-profiles`](/cli/azure/webapp/deployment#az-webapp-deployment-list-publishing-profiles) command. For example:

```azurecli-interactive
az webapp deployment list-publishing-profiles --resource-group myResourceGroup --name myApp
```

For [local Git deployment](deploy-local-git.md), you can also use the [`az webapp deployment list-publishing-credentials`](/cli/azure/webapp/deployment#az-webapp-deployment-list-publishing-credentials) command. The following example returns a Git remote URI that has the application-scope credentials for the app already embedded.

```azurecli-interactive
az webapp deployment list-publishing-credentials --resource-group myResourceGroup --name myApp --query scmUri
```

The returned Git remote URI doesn't have `/<app-name>.git` at the end. When you add a remote, append `/<app-name>.git` to the URI to avoid an error `22` with `git-http-push`.

# [Azure PowerShell](#tab/powershell)

Get the application-scope credentials by using the [`Get-AzWebAppPublishingProfile`](/powershell/module/az.websites/get-azwebapppublishingprofile) command. For example:

```azurepowershell-interactive
Get-AzWebAppPublishingProfile -ResourceGroupName myResourceGroup -Name myApp
```

# [Azure portal](#tab/portal)

To get the application-scope credentials:

1. In the Azure portal, select **Deployment Center** under **Deployment** in the left navigation menu of your app.
1. On the **Deployment Center** page, select the **FTPS credentials** or **Local Git/FTPS credentials** tab.
1. In the **Application-scope** section, view the **FTPS username**, the **Local Git username**, and the **Password**. Select the copy icons to copy the values.

-----

## Reset application-scope credentials

You can use Azure CLI, Azure PowerShell, or the Azure portal to reset your application-scope deployment credentials and get a new password. The app-scope user names remain at their autogenerated values.

In Azure CLI and the Azure portal, you can also reset your user-scope credentials by creating new ones. This action affects all the apps in your account that use the user-scope credentials.

When you reset your deployment credentials, any external integrations and automation stop working and must be reconfigured with the new values. 

# [Azure CLI](#tab/cli)

Reset the application-scope password by using the [`az resource invoke-action`](/cli/azure/resource#az-resource-invoke-action) command.

```azurecli-interactive
az resource invoke-action --action newpassword --resource-group <group-name> --name <app-name> --resource-type Microsoft.Web/sites
```

Reset the user-scope credentials by rerunning the [`az webapp deployment user set`](/cli/azure/webapp/deployment/user#az-webapp-deployment-user-set) command, supplying new user name and password values.

```azurecli-interactive
az webapp deployment user set --user-name <new-username> --password <new-password>
```

# [Azure PowerShell](#tab/powershell)

Reset the application-scope password by using the [`Invoke-AzResourceAction`](/powershell/module/az.resources/invoke-azresourceaction) command:

```azurepowershell-interactive
Invoke-AzResourceAction -ResourceGroupName <group-name> -ResourceType Microsoft.Web/sites -ResourceName <app-name> -Action newpassword
```

# [Azure portal](#tab/portal)

1. From the left navigation menu of your app, select **Deployment Center** > **FTPS credentials** or **Local Git/FTPS credentials**.
1. To reset your app-scope credentials and get a new password, select **Reset** at the bottom of the **Application-scope** section.
1. To reset your user-scope credentials, select **Reset** at the bottom of the **User-scope** section. This action deletes both user name and password, and disables user-scope credentials. To reenable, enter a new username and password, and select **Save**. This action takes effect across all the apps in your account that use the user-scope credentials.

-----

## Related content

- [Disable basic authentication in Azure App Service deployments](configure-basic-auth-disable.md)
- [Deploy to Azure App Service by using local Git](deploy-local-git.md)
- [Deploy your app to Azure App Service using FTP/S](deploy-ftp.md).
