---
title: Disable basic authentication for deployment
description: Learn how to secure App Service deployment by disabling basic authentication.
keywords: azure app service, security, deployment, FTP, MsDeploy
ms.topic: article
ms.date: 02/29/2024
author: cephalin
ms.author: cephalin
---

# Disable basic authentication in App Service deployments

This article shows you how to disable basic authentication (username and password authentication) when deploying code to App Service apps.

App Service provides basic authentication for FTP and WebDeploy clients to connect to it by using [deployment credentials](deploy-configure-credentials.md). These APIs are great for browsing your site’s file system, uploading drivers and utilities, and deploying with MsBuild. However, enterprises often require more secure deployment methods than basic authentication, such as [Microsoft Entra ID](/entra/fundamentals/whatis) authentication (see [Authentication types by deployment methods in Azure App Service](deploy-authentication-types.md)). Microsoft Entra uses OAuth 2.0 token-based authorization and has many benefits and improvements that help mitigate the issues in basic authentication. For example, OAuth access tokens have a limited usable lifetime, and are specific to the applications and resources for which they're issued, so they can't be reused. Microsoft Entra also lets you deploy from other Azure services using managed identities.

## Disable basic authentication

Two different controls for basic authentication are available. Specifically:

- For [FTP deployment](deploy-ftp.md), basic authentication is controlled by the `basicPublishingCredentialsPolicies/ftp` flag (**FTP Basic Auth Publishing Credentials** option in the portal).
- For other deployment methods that use basic authentication, such as Visual Studio, local Git, and GitHub, basic authentication is controlled by the `basicPublishingCredentialsPolicies/scm` flag (**SCM Basic Auth Publishing Credentials** option in the portal).

### [Azure portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), search for and select **App Services**, and then select your app. 

1. In the app's left menu, select **Configuration** > **General settings**.

1. For **SCM Basic Auth Publishing Credentials** or **FTP Basic Auth Publishing Credentials**, select **Off**, then select **Save**.

    :::image type="content" source="media/configure-basic-auth-disable/basic-auth-disable.png" alt-text="A screenshot showing how to disable basic authentication for Azure App Service in the Azure portal.":::

### [Azure CLI](#tab/cli)

There are two different settings to configure when you disable basic authentication with Azure CLI, one for FTP and one for WebDeploy and Git.

#### Disable for FTP

To disable FTP access using basic authentication, you must have owner-level access to the app. Run the following CLI command by replacing the placeholders with your resource group name and app name:

```azurecli-interactive
az resource update --resource-group <group-name> --name ftp --namespace Microsoft.Web --resource-type basicPublishingCredentialsPolicies --parent sites/<app-name> --set properties.allow=false
```

#### Disable for WebDeploy and Git

To disable basic authentication access to the WebDeploy port and the Git deploy URL (https://\<app-name>.scm.azurewebsites.net), run the following CLI command. Replace the placeholders with your resource group name and app name.

```azurecli-interactive
az resource update --resource-group <resource-group> --name scm --namespace Microsoft.Web --resource-type basicPublishingCredentialsPolicies --parent sites/<app-name> --set properties.allow=false
```

-----

To confirm that FTP access is blocked, try [connecting to your app using FTP/S](deploy-ftp.md). You should get a `401 Unauthenticted` message.

To confirm that Git access is blocked, try [local Git deployment](deploy-local-git.md). You should get an `Authentication failed` message.

## Deployment without basic authentication

When you disable basic authentication, deployment methods that depend on basic authentication stop working. 

The following table shows how various deployment methods behave when basic authentication is disabled, and if there's any fallback mechanism. For more information, see [Authentication types by deployment methods in Azure App Service](deploy-authentication-types.md).

| Deployment method | When basic authentication is disabled |
|-|-|
| Visual Studio deployment | Doesn't work. |
| [FTP](deploy-ftp.md) | Doesn't work. |
| [Local Git](deploy-local-git.md) | Doesn't work. |
| Azure CLI | In Azure CLI 2.48.1 or higher, the following commands fall back to Microsoft Entra authentication:<br/>- [az webapp up](/cli/azure/webapp#az-webapp-up)<br/>- [az webapp deploy](/cli/azure/webapp#az-webapp-deploy)<br/>- [az webapp deployment source config-zip](/cli/azure/webapp/deployment/source#az-webapp-deployment-source-config-zip)<br/>- [az webapp log deployment show](/cli/azure/webapp/log/deployment#az-webapp-log-deployment-show)<br/>- [az webapp log deployment list](/cli/azure/webapp/log/deployment#az-webapp-log-deployment-list)<br/>- [az webapp log download](/cli/azure/webapp/log#az-webapp-log-download)<br/>- [az webapp log tail](/cli/azure/webapp/log#az-webapp-log-tail)<br/>- [az webapp browse](/cli/azure/webapp#az-webapp-browse)<br/>- [az webapp create-remote-connection](/cli/azure/webapp#az-webapp-create-remote-connection)<br/>- [az webapp ssh](/cli/azure/webapp#az-webapp-ssh)<br/>- [az functionapp deploy](/cli/azure/functionapp#az-functionapp-deploy)<br/>- [az functionapp log deployment list](/cli/azure/functionapp/log/deployment#az-functionapp-log-deployment-list)<br/>- [az functionapp log deployment show](/cli/azure/functionapp/log/deployment#az-functionapp-log-deployment-show)<br/>- [az functionapp deployment source config-zip](/cli/azure/functionapp/deployment/source#az-functionapp-deployment-source-config-zip) |
| [Maven plugin](https://github.com/microsoft/azure-maven-plugins) or [Gradle plugin](https://github.com/microsoft/azure-gradle-plugins) | Works. |
| [GitHub with App Service Build Service](deploy-continuous-deployment.md?tabs=github) | Doesn't work. |
| [GitHub Actions](deploy-continuous-deployment.md?tabs=github) | - An existing GitHub Actions workflow that uses **basic authentication** can't authenticate. In the Deployment Center, disconnect the existing GitHub configuration and create a new GitHub Actions configuration with the **user-assigned identity** option instead. <br/> - If the existing GitHub Actions deployment is [manually configured](deploy-github-actions.md), try using a service principal or OpenID Connect instead. <br/> - For new GitHub Actions configuration in the Deployment Center, use the **user-assigned identity** option. |
| Deployment in [create wizard](https://portal.azure.com/#create/Microsoft.WebSite) | When **Basic authentication** is set to **Disable** and **Continuous deployment** set to **Enable**, GitHub Actions is configured with the **user-assigned identity** option (OpenID Connect). |
| [Azure Repos with App Service Build Service](deploy-continuous-deployment.md?tabs=github) | Doesn't work. |
| [BitBucket](deploy-continuous-deployment.md?tabs=bitbucket) | Doesn't work. |
| [Azure Pipelines](deploy-azure-pipelines.md) with [AzureWebApp](/azure/devops/pipelines/tasks/reference/azure-web-app-v1) task | Works. |
| [Azure Pipelines](deploy-azure-pipelines.md) with [AzureRmWebAppDeployment](/azure/devops/pipelines/tasks/deploy/azure-rm-web-app-deployment) task | - Use the latest AzureRmWebAppDeployment task to get fallback behavior. <br/> - The **Publish Profile (`PublishProfile`)** connection type doesn't work, because it uses basic authentication. Change the connection type to **Azure Resource Manager (`AzureRM`)**. <br/> - On non-Windows Pipelines agents, authentication works. <br/> - On Windows agents, the [deployment method used by the task](/azure/devops/pipelines/tasks/reference/azure-rm-web-app-deployment-v4#deployment-methods) might need to be modified. When Web Deploy is used (`DeploymentType: 'webDeploy'`) and basic authentication is disabled, the task authenticates with a Microsoft Entra token. There are additional requirements if you're not using the `windows-latest` agent or if you're using a self-hosted agent. For more information, see [I can't Web Deploy to my Azure App Service using Microsoft Entra authentication from my Windows agent](/azure/devops/pipelines/tasks/reference/azure-rm-web-app-deployment-v4#i-cant-web-deploy-to-my-azure-app-service-using-microsoft-entra-id-authentication-from-my-windows-agent).<br/> - Other deployment methods work, such as **zip deploy** or **run from package**. |

## Create a custom role with no permissions for basic authentication

To prevent a lower-priveldged user from enabling basic authentication for any app, you can create a custom role and assign the user to the role.

### [Azure portal](#tab/portal)

1. In the Azure portal, in the top menu, search for and select the subscription you want to create the custom role in.
1. From the left navigation, select **Access Control (IAM)** > **Add** > **Add custom role**.
1. Set the **Basic** tab as you wish, then select **Next**.
1. In the **Permissions** tab, and select **Exclude permissions**.
1. Find and select **Microsoft Web Apps**, then search for the following operations:
    
    |Operation  |Description  |
    |---------|---------|
    |`microsoft.web/sites/basicPublishingCredentialsPolicies/ftp`     | FTP publishing credentials for App Service apps. |
    |`microsoft.web/sites/basicPublishingCredentialsPolicies/scm`     | SCM publishing credentials for App Service apps. |
    |`microsoft.web/sites/slots/basicPublishingCredentialsPolicies/ftp` | FTP publishing credentials for App Service slots. |
    |`microsoft.web/sites/slots/basicPublishingCredentialsPolicies/scm` | SCM publishing credentials for App Service slots. |
    
1. Under each of these operations, select the box for **Write**, then select **Add**. This step adds the operation as **NotActions** for the role.

    Your Permissions tab should look like the following screenshot:

    :::image type="content" source="media/configure-basic-auth-disable/custom-role-no-basic-auth.png" alt-text="A screenshot showing the creation of a custom role with all basic authentication permissions excluded.":::

1. Select **Review + create**, then select **Create**.

1. You can now assign this role to your organization’s users.

For more information, see [Create or update Azure custom roles using the Azure portal](../role-based-access-control/custom-roles-portal.md#step-2-choose-how-to-start)

### [Azure CLI](#tab/cli)

In the following command, replace *\<role-name>* and *\<subscription-guid>* (with the GUID of your subscription) and run in the cloud shell:

```azurecli-interactive
az role definition create --role-definition '{
    "Name": "<role-name>",
    "IsCustom": true,
    "Description": "Prevents users from enabling basic authentication for all App Service apps or slots.",
    "NotActions": [
        "Microsoft.Web/sites/basicPublishingCredentialsPolicies/ftp/Write",
        "Microsoft.Web/sites/basicPublishingCredentialsPolicies/scm/Write",
        "Microsoft.Web/sites/slots/basicPublishingCredentialsPolicies/ftp/Write",
        "Microsoft.Web/sites/slots/basicPublishingCredentialsPolicies/scm/Write"
    ],
    "AssignableScopes": ["/subscriptions/<subscription-guid>"]
}'
```

You can now assign this role to your organization’s users.

For more information, see [Create or update Azure custom roles using Azure CLI](../role-based-access-control/custom-roles-cli.md).

-----

## Monitor for basic authentication attempts

All successful and attempted logins are logged to the Azure Monitor `AppServiceAuditLogs` log type. To audit the attempted and successful logins on FTP and WebDeploy, follow the steps at [Send logs to Azure Monitor](troubleshoot-diagnostic-logs.md#send-logs-to-azure-monitor) and enable shipping of the `AppServiceAuditLogs` log type.

To confirm that the logs are shipped to your selected service(s), try logging in via FTP or WebDeploy. The following example shows a Storage Account log.

<pre>
{
  "time": "2023-10-16T17:42:32.9322528Z",
  "ResourceId": "/SUBSCRIPTIONS/EF90E930-9D7F-4A60-8A99-748E0EEA69DE/RESOURCEGROUPS/MYRESOURCEGROUP/PROVIDERS/MICROSOFT.WEB/SITES/MY-DEMO-APP",
  "Category": "AppServiceAuditLogs",
  "OperationName": "Authorization",
  "Properties": {
    "User": "$my-demo-app",
    "UserDisplayName": "$my-demo-app",
    "UserAddress": "24.19.191.170",
    "Protocol": "FTP"
  }
}
</pre>

## Basic authentication related policies

[Azure Policy](../governance/policy/overview.md) can help you enforce organizational standards and to assess compliance at-scale. You can use Azure Policy to audit for any apps that still use basic authentication, and remediate any noncompliant resources. The following are built-in policies for auditing and remediating basic authentication on App Service:

- [Audit policy for FTP](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F871b205b-57cf-4e1e-a234-492616998bf7)
- [Audit policy for SCM](https://ms.portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Faede300b-d67f-480a-ae26-4b3dfb1a1fdc)
- [Remediation policy for FTP](https://ms.portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff493116f-3b7f-4ab3-bf80-0c2af35e46c2)
- [Remediation policy for SCM](https://ms.portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2c034a29-2a5f-4857-b120-f800fe5549ae)

The following are corresponding policies for slots:

- [Audit policy for FTP](https://ms.portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fec71c0bc-6a45-4b1f-9587-80dc83e6898c)
- [Audit policy for SCM](https://ms.portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F847ef871-e2fe-4e6e-907e-4adbf71de5cf)
- [Remediation policy for FTP](https://ms.portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff493116f-3b7f-4ab3-bf80-0c2af35e46c2)
- [Remediation policy for SCM](https://ms.portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2c034a29-2a5f-4857-b120-f800fe5549ae)

## Frequently asked questions

#### Why do I get a warning in Visual Studio saying that basic authentication is disabled?

Visual Studio requires basic authentication to deploy to Azure App Service. The warning reminds you that the configuration on your app changed and you can no longer deploy to it. Either you disabled basic authentication on the app yourself, or your organization policy enforces that basic authentication is disabled for App Service apps.