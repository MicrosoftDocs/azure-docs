---
title: Configure Deployment Credentials
description: Learn what types of deployment credentials are in Azure App Service and how to configure and use them.
author: cephalin
ms.author: cephalin
ms.reviewer: byvinyal
ms.topic: how-to
ms.date: 01/26/2024

---

# Configure deployment credentials for Azure App Service
To secure app deployment from a local computer, [Azure App Service](./overview.md) supports two types of credentials for [local Git deployment](deploy-local-git.md) and [FTP/FTPS deployment](deploy-ftp.md). These credentials are different from your Azure subscription credentials.

[!INCLUDE [app-service-deploy-credentials](../../includes/app-service-deploy-credentials.md)]

> [!NOTE]
> When [basic authentication is disabled](configure-basic-auth-disable.md), you can't view or configure deployment credentials in **Deployment Center**.

## <a name="userscope"></a>Configure user-scope credentials

# [Azure CLI](#tab/cli)

Run the [`az webapp deployment user set`](/cli/azure/webapp/deployment/user#az-webapp-deployment-user-set) command. Replace `<username>` and `<password>` with a deployment user's username and password.

- The username must be unique within Azure, and for local Git pushes, must not contain the @ symbol.
- The password must be at least eight characters long, with two of the following three elements: letters, numbers, and symbols.

```azurecli-interactive
az webapp deployment user set --user-name <username> --password <password>
```

The JSON output shows the password as `null`.

# [Azure PowerShell](#tab/powershell)

You can't configure the user-scope credentials by using Azure PowerShell. Use a different method, or consider [using application-scope credentials](#appscope).

# [Azure portal](#tab/portal)

You can configure your user-scope credentials in any app's [resource page](../azure-resource-manager/management/manage-resources-portal.md#manage-resources). Regardless of which app you use to configure these credentials, the credentials apply to all apps for all subscriptions in your Azure account.

 You must have at least one app in the [Azure portal](https://portal.azure.com) before you can access the deployment credentials page. To configure your user-scope credentials:

1. From the left menu of your app, select > **Deployment Center** > **FTPS credentials** or **Local Git/FTPS credentials**.

2. Scroll down to **User scope**, configure the **Username** and **Password**, and then select **Save**.

After you set your deployment credentials, you can find the Git deployment username in your app's **Overview** page.

![Screenshot that shows you how to find the Git deployment user name on your app's Overview page.](./media/app-service-deployment-credentials/deployment_credentials_overview.png)

If Git deployment is configured, the page shows **Git/deployment username**. Otherwise, it shows **FTP/deployment username**.

> [!NOTE]
> Azure doesn't show your user-scope deployment password. If you forget the password, you can follow the steps in this section to reset your credentials.

-----

## Use user-scope credentials with FTP/FTPS

To authenticate to an FTP/FTPS endpoint by using user-scope credentials, your username must follow this format:
`<app-name>\<user-name>`

Since user-scope credentials are linked to the user and not to a specific resource, the username must be in this format to direct the sign-in action to the right app endpoint.

## <a name="appscope"></a>Get application-scope credentials

# [Azure CLI](#tab/cli)

Get the application-scope credentials by using the [`az webapp deployment list-publishing-profiles`](/cli/azure/webapp/deployment#az-webapp-deployment-list-publishing-profiles) command. For example:

```azurecli-interactive
az webapp deployment list-publishing-profiles --resource-group <group-name> --name <app-name>
```

For [local Git deployment](deploy-local-git.md), you can also use the [`az webapp deployment list-publishing-credentials`](/cli/azure/webapp/deployment#az-webapp-deployment-list-publishing-credentials) command. When you use this command, you get a Git remote URI for your app that has the application-scope credentials already embedded. For example:

```azurecli-interactive
az webapp deployment list-publishing-credentials --resource-group <group-name> --name <app-name> --query scmUri
```

> [!NOTE]
> The returned Git remote URI doesn't contain `/<app-name>.git` at the end. When you add the remote URI, make sure to append `/<app-name>.git` to avoid an error 22 with `git-http-push`. Additionally, when using `git remote add ... ` via shells that use the dollar sign for variable interpolation (such as bash), escape any dollar signs `\$` in the username or password. Failure to escape this character can result in authentication errors.

# [Azure PowerShell](#tab/powershell)

Get the application-scope credentials by using the [`Get-AzWebAppPublishingProfile`](/powershell/module/az.websites/get-azwebapppublishingprofile) command. For example:

```azurepowershell-interactive
Get-AzWebAppPublishingProfile -ResourceGroupName <group-name> -Name <app-name>
```

# [Azure portal](#tab/portal)

1. From the left menu of your app, select **Deployment Center** > **FTPS credentials** or **Local Git/FTPS credentials**.

2. In the **Application scope** section, select the **Copy** link to copy the username or password.

-----

## Reset application-scope credentials

# [Azure CLI](#tab/cli)

Reset the application-scope credentials by using the [`az resource invoke-action`](/cli/azure/resource#az-resource-invoke-action) command:

```azurecli-interactive
az resource invoke-action --action newpassword --resource-group <group-name> --name <app-name> --resource-type Microsoft.Web/sites
```

# [Azure PowerShell](#tab/powershell)

Reset the application-scope credentials by using the [`Invoke-AzResourceAction`](/powershell/module/az.resources/invoke-azresourceaction) command:

```azurepowershell-interactive
Invoke-AzResourceAction -ResourceGroupName <group-name> -ResourceType Microsoft.Web/sites -ResourceName <app-name> -Action newpassword
```

# [Azure portal](#tab/portal)

1. From the left menu of your app, select **Deployment Center** > **FTPS credentials** or **Local Git/FTPS credentials**.

2. In the **Application scope** section, select **Reset**.

-----

## Disable basic authentication

See [Disable basic authentication in App Service deployment](configure-basic-auth-disable.md).

## Related content

Find out how to use these credentials to deploy your app from a [local Git](deploy-local-git.md) or by using [FTP/FTPS](deploy-ftp.md).
