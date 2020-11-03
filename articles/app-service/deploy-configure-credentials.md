---
title: Configure deployment credentials
description: Learn what types of deployment credentials are in Azure App Service and how to configure and use them.

ms.topic: article
ms.date: 08/14/2019
ms.reviewer: byvinyal
ms.custom: seodec18

---

# Configure deployment credentials for Azure App Service
[Azure App Service](./overview.md) supports two types of credentials for [local Git deployment](deploy-local-git.md) 
and [FTP/S deployment](deploy-ftp.md). These credentials are not the same as your Azure subscription credentials.

[!INCLUDE [app-service-deploy-credentials](../../includes/app-service-deploy-credentials.md)]

## <a name="userscope"></a>Configure user-level credentials

You can configure your user-level credentials in any app's [resource page](../azure-resource-manager/management/manage-resources-portal.md#manage-resources). Regardless in which app you configure these credentials, it applies to all apps and for all subscriptions in your Azure account. 

### In the Cloud Shell

To configure the deployment user in the [Cloud Shell](https://shell.azure.com), run the [az webapp deployment user set](/cli/azure/webapp/deployment/user?view=azure-cli-latest#az-webapp-deployment-user-set) command. Replace \<username> and \<password> with a deployment user username and password. 

- The username must be unique within Azure, and for local Git pushes, must not contain the ‘@’ symbol. 
- The password must be at least eight characters long, with two of the following three elements: letters, numbers, and symbols. 

```azurecli-interactive
az webapp deployment user set --user-name <username> --password <password>
```

The JSON output shows the password as `null`. If you get a `'Conflict'. Details: 409` error, change the username. If you get a `'Bad Request'. Details: 400` error, use a stronger password. 

### In the portal

In the Azure portal, you must have at least one app before you can access the deployment credentials page. To configure your user-level credentials:

1. In the [Azure portal](https://portal.azure.com), from the left menu, select **App Services** > **\<any_app>** > **Deployment center** > **FTP** > **Dashboard**.

    ![Shows how you can select the FTP dashboard from the Deployment center in Azure App Services.](./media/app-service-deployment-credentials/access-no-git.png)

    Or, if you've already configured Git deployment, select **App Services** > **&lt;any_app>** > **Deployment center** > **FTP/Credentials**.

    ![Shows how you can select the FTP dashboard from the Deployment center in Azure App Services for your configured Git deployment.](./media/app-service-deployment-credentials/access-with-git.png)

2. Select **User Credentials**, configure the user name and password, and then select **Save Credentials**.

Once you have set your deployment credentials, you can find the *Git* deployment username in your app's **Overview** page,

![Shows how to find the Git deployment user name on your app's Overview page.](./media/app-service-deployment-credentials/deployment_credentials_overview.png)

If Git deployment is configured, the page shows a **Git/deployment username**; otherwise, an **FTP/deployment username**.

> [!NOTE]
> Azure does not show your user-level deployment password. If you forget the password, you can reset your credentials by following the steps in this section.
>
> 

## Use user-level credentials with FTP/FTPS

Authenticating to an FTP/FTPS endpoint using user-level credentials requirers a username in the following format:
`<app-name>\<user-name>`

Since user-level credentials are linked to the user and not a specific resource, the username must be in this format to direct the sign-in action to the right app endpoint.

## <a name="appscope"></a>Get and reset app-level credentials
To get the app-level credentials:

1. In the [Azure portal](https://portal.azure.com), from the left menu, select **App Services** > **&lt;any_app>** > **Deployment center** > **FTP/Credentials**.

2. Select **App Credentials**, and select the **Copy** link to copy the username or password.

To reset the app-level credentials, select **Reset Credentials** in the same dialog.

## Disable basic authentication

Some organizations need to meet security requirements and would rather disable access via FTP or WebDeploy. This way, the organization's members can only access its App Services through APIs that are controlled by Azure Active Directory (Azure AD).

### FTP

To disable FTP access to the site, run the following CLI command. Replace the placeholders with your resource group and site name. 

```bash
az resource update --resource-group <resource-group> --name ftp --namespace Microsoft.Web --resource-type basicPublishingCredentialsPolicies --parent sites/<site-name> --set properties.allow=false
```

To confirm that FTP access is blocked, you can try to authenticate using an FTP client such as FileZilla. To retrieve the publishing credentials, go to the overview blade of your site and click Download Publish Profile. Use the file’s FTP hostname, username, and password to authenticate, and you will get a 401 error response, indicating that you are not authorized.

### WebDeploy and SCM

To disable basic auth access to the WebDeploy port and SCM site, run the following CLI command. Replace the placeholders with your resource group and site name. 

```bash
az resource update --resource-group <resource-group> --name scm --namespace Microsoft.Web --resource-type basicPublishingCredentialsPolicies --parent sites/<site-name> --set properties.allow=false
```

To confirm that the publish profile credentials are blocked on WebDeploy, try [publishing a web app using Visual Studio 2019](/visualstudio/deployment/quickstart-deploy-to-azure?view=vs-2019).

### Disable access to the API

The API in the previous section is backed Azure role-based access control (Azure RBAC), which means you can [create a custom role](../role-based-access-control/custom-roles.md#steps-to-create-a-custom-role) and assign lower-priveldged users to the role so they cannot enable basic auth on any sites. To configure the custom role, [follow these instructions](https://azure.github.io/AppService/2020/08/10/securing-data-plane-access.html#create-a-custom-rbac-role).

You can also use [Azure Monitor](https://azure.github.io/AppService/2020/08/10/securing-data-plane-access.html#audit-with-azure-monitor) to audit any successful authentication requests and use [Azure Policy](https://azure.github.io/AppService/2020/08/10/securing-data-plane-access.html#enforce-compliance-with-azure-policy) to enforce this configuration for all sites in your subscription.

## Next steps

Find out how to use these credentials to deploy your app from [local Git](deploy-local-git.md) or using [FTP/S](deploy-ftp.md).