---
title: Disable Basic Authentication for Deployment
description: Learn about disabling basic authentication for increased security and how it affects App Service deployments.
author: cephalin
ms.author: cephalin
ms.topic: how-to
ms.date: 06/11/2025
keywords: azure app service, security, deployment, FTP, MsDeploy

---

# Disable basic authentication in Azure App Service deployments

This article discusses how to disable basic username and password authentication for deploying code to Azure App Service apps. The article explains several ways to disable basic authentication, fallback deployment methods if any, and how to monitor basic authentication access attempts.

App Service provides basic authentication for FTP and Web Deploy clients to connect using username and password deployment credentials. The basic authentication APIs are good for browsing your site's file system, uploading drivers and utilities, and deploying with MSBuild. For more information, see [Configure deployment credentials for Azure App Service](deploy-configure-credentials.md).

Enterprises often require more secure deployment methods than basic authentication, such as [Microsoft Entra ID](/entra/fundamentals/whatis). Microsoft Entra OAuth 2.0 access tokens have a limited usable lifetime, are specific to the applications and resources they're issued for, and can't be reused. OAuth token-based authorization helps mitigate many problems with basic authentication.

Microsoft Entra also lets you deploy from other Azure services by using managed identities. For more information, see [Authentication types by deployment method in Azure App Service](deploy-authentication-types.md).

## Prerequisites

- To disable basic authentication for FTP access to an app, you must have owner-level access to the app.
- To create and assign a role to prevent lower-privileged users from enabling basic authentication, you must have **Owner** or **User Access Administrator** permissions in the subscription.

## Disable basic authentication

For [FTP deployment](deploy-ftp.md), basic authentication is controlled by the `basicPublishingCredentialsPolicies/ftp` flag or the **FTP Basic Auth Publishing Credentials** portal option.

For other deployment methods that use basic authentication, such as Visual Studio, local Git, and GitHub, basic authentication is controlled by the `basicPublishingCredentialsPolicies/scm` flag or the **SCM Basic Auth Publishing Credentials** portal option.

>[!NOTE]
>SCM basic authentication is required for enabling FTP basic authentication.

To disable basic authentication:

### [Azure portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), search for and select **App Services**, and then select your app.

1. On the app's left navigation menu, select **Configuration** > **General settings**.

1. Select **Off** for **SCM Basic Auth Publishing Credentials**, **FTP Basic Auth Publishing Credentials**, or both, and then select **Save**.

   :::image type="content" source="media/configure-basic-auth-disable/basic-auth-disable.png" alt-text="Screenshot that shows how to disable basic authentication for Azure App Service in the Azure portal.":::

### [Azure CLI](#tab/cli)

Run the following Azure CLI commands in the Bash environment of Azure Cloud Shell by selecting **Open Cloud Shell** at the upper right of the code block. Copy the code, replace any placeholders, paste it into the Cloud Shell, and run it.

To disable FTP basic authentication access, run the following command, replacing the placeholders with your app's resource group and name. You must have owner-level access to the app.

```azurecli-interactive
az resource update --resource-group <group-name> --name ftp --namespace Microsoft.Web --resource-type basicPublishingCredentialsPolicies --parent sites/<app-name> --set properties.allow=false
```

To disable basic authentication access for the Web Deploy port and Git deploy with `https://<app-name>.scm.azurewebsites.net`, run the following command. Replace the placeholders with your app's resource group and name.

```azurecli-interactive
az resource update --resource-group <resource-group> --name scm --namespace Microsoft.Web --resource-type basicPublishingCredentialsPolicies --parent sites/<app-name> --set properties.allow=false
```

-----

To confirm that FTP access is blocked, try to [connect to your app using FTP/FTPS](deploy-ftp.md). You should get a **401 Unauthenticated** message.

To confirm that Git access is blocked, try [local Git deployment](deploy-local-git.md). You should get an **Authentication failed** message.

## Deploy without basic authentication

When you disable basic authentication, deployment methods that depend on basic authentication no longer work. Some deployment methods have fallback deployment mechanisms.

The following table shows how various deployment methods behave when basic authentication is disabled, and the fallback mechanism if any. For more information, see [Authentication types by deployment methods in Azure App Service](deploy-authentication-types.md).

| Deployment method | When basic authentication is disabled |
|-|-|
| Visual Studio deployment | Deployment with Microsoft Entra authentication requires Visual Studio 2022 version 17.12 or later. |
| [FTP](deploy-ftp.md) | Doesn't work. |
| [Local Git](deploy-local-git.md) | Doesn't work. |
| Azure CLI| In Azure CLI 2.48.1 or higher, the following commands fall back to Microsoft Entra authentication:<br/>[`az webapp up`](/cli/azure/webapp#az-webapp-up).<br/>[`az webapp deploy`](/cli/azure/webapp#az-webapp-deploy).<br/>[`az webapp log deployment show`](/cli/azure/webapp/log/deployment#az-webapp-log-deployment-show).<br/>[`az webapp log deployment list`](/cli/azure/webapp/log/deployment#az-webapp-log-deployment-list).<br/>[`az webapp log download`](/cli/azure/webapp/log#az-webapp-log-download).<br/>[`az webapp log tail`](/cli/azure/webapp/log#az-webapp-log-tail).<br/>[`az webapp browse`](/cli/azure/webapp#az-webapp-browse).<br/>[`az webapp create-remote-connection`](/cli/azure/webapp#az-webapp-create-remote-connection).<br/>[`az webapp ssh`](/cli/azure/webapp#az-webapp-ssh).<br/>[`az functionapp deploy`](/cli/azure/functionapp#az-functionapp-deploy).<br/>[`az functionapp log deployment list`](/cli/azure/functionapp/log/deployment#az-functionapp-log-deployment-list).<br/>[`az functionapp log deployment show`](/cli/azure/functionapp/log/deployment#az-functionapp-log-deployment-show).<br/>[`az functionapp deployment source config-zip`](/cli/azure/functionapp/deployment/source#az-functionapp-deployment-source-config-zip).|
| [Maven plugin](https://github.com/microsoft/azure-maven-plugins) or [Gradle plugin](https://github.com/microsoft/azure-gradle-plugins) | Works. |
| [GitHub Actions](deploy-continuous-deployment.md?tabs=github) | Existing GitHub Actions workflows that use basic authentication don't work. Disconnect the existing GitHub configuration and create a new GitHub Actions configuration that uses user-assigned identity. <br/> If the existing GitHub Actions deployment is [manually configured](deploy-github-actions.md), try using a service principal or OpenID Connect instead. <br/> For new GitHub Actions workflows, use the **User-assigned identity** option. |
| [GitHub with the App Service build service](deploy-continuous-deployment.md?tabs=github) | Doesn't work. |
| Deployment from the portal [creation wizard](https://portal.azure.com/#create/Microsoft.WebSite) | If you select a **Continuous deployment** source when **Basic authentication** is set to **Disable**, GitHub Actions is configured with the **user-assigned identity** option (OpenID Connect). |
| [Bitbucket](deploy-continuous-deployment.md?tabs=bitbucket) | Doesn't work. |
| [Azure Repos with the App Service build service](deploy-continuous-deployment.md?tabs=github) | Doesn't work. |
| [Azure Repos with Azure Pipelines](deploy-continuous-deployment.md?tabs=github) | Works. |
| [Azure Pipelines](deploy-azure-pipelines.md) with [`AzureWebApp`](/azure/devops/pipelines/tasks/reference/azure-web-app-v1) task | Works. |
<!--AzureRM is discontinued| [Azure Pipelines](deploy-azure-pipelines.md) with [`AzureRmWebAppDeployment`](/azure/devops/pipelines/tasks/deploy/azure-rm-web-app-deployment) task | Use the latest `AzureRmWebAppDeployment` task to get fallback behavior. <br/> The `PublishProfile` connection type doesn't work, because it uses basic authentication. Change the connection type to `AzureRM`. <br/> On non-Windows Azure Pipelines agents, authentication works. <br/> On Windows agents, the [deployment method used by the task](/azure/devops/pipelines/tasks/reference/azure-rm-web-app-deployment-v4#deployment-methods) might need to be modified. When `DeploymentType: 'webDeploy'` is used and basic authentication is disabled, the task authenticates with a Microsoft Entra token. There are additional requirements if you're not using the `windows-latest` agent or if you're using a self-hosted agent. For more information, see [I can't Web Deploy to my Azure App Service using Microsoft Entra authentication from my Windows agent](/azure/devops/pipelines/tasks/reference/azure-rm-web-app-deployment-v4#i-cant-web-deploy-to-my-azure-app-service-using-microsoft-entra-id-authentication-from-my-windows-agent).<br/> Other deployment methods work, such as **zip deploy** or **run from package**. |-->

## Create a custom role to prevent enabling basic authentication

To prevent lower-privileged users from enabling basic authentication for any app, you can create a custom role and assign the users to the role.

### [Azure portal](#tab/portal)

1. In the Azure portal, select the subscription where you want to create the custom role.
1. On the left navigation menu, select **Access Control (IAM)** > **Add** > **Add custom role**.
1. On the **Create a custom role** page, give the role a name and then select **Next**.
1. In the **Permissions** tab, select **Exclude permissions**.
1. Search and select **Microsoft Web Apps**.
1. Search for and expand **microsoft.web/sites/basicPublishingCredentialsPolicies**.
1. Select the box for **Write**, and then select **Add**. This step adds the operation to **NotActions** for the role.
1. Select **Exclude permissions** again.
1. Search for and expand **microsoft.web/sites/slots/basicPublishingCredentialsPolicies**, select the **Write** box, and then select **Add**.
1. Your **Permissions** tab should now look like the following screenshot. Select **Review + create**, and then select **Create**.

   :::image type="content" source="media/configure-basic-auth-disable/custom-role-no-basic-auth.png" alt-text="Screenshot that shows excluding Write for basicPublishingCredentialsPolicies.":::

You can now assign this role to your organization's users. For more information, see [Create or update Azure custom roles by using the Azure portal](/azure/role-based-access-control/custom-roles-portal#step-2-choose-how-to-start).

### [Azure CLI](#tab/cli)

Run the following command, replacing `<role-name>` with a name for the custom role and `<subscription-guid>` with your subscription ID.

```azurecli-interactive
az role definition create --role-definition '{
    "Name": "<role-name>",
    "IsCustom": true,
    "Description": "Prevents users from enabling basic authentication for all App Service apps or slots.",
    "NotActions": [
        "Microsoft.Web/sites/basicPublishingCredentialsPolicies/Write",
        "Microsoft.Web/sites/slots/basicPublishingCredentialsPolicies/Write"
    ],
    "AssignableScopes": ["/subscriptions/<subscription-guid>"]
}'
```

You can now assign this role to your organization's users. For more information, see [Create or update Azure custom roles using the Azure CLI](/azure/role-based-access-control/custom-roles-cli).

-----

## Monitor for basic authentication attempts

All successful and attempted logins are logged to the Azure Monitor `AppServiceAuditLogs` log type. To audit attempted and successful logins on FTP and Web Deploy, follow the steps at [Send logs to Azure Monitor](troubleshoot-diagnostic-logs.md#send-logs-to-azure-monitor) and enable shipping of the `AppServiceAuditLogs` log type.

To confirm that the logs are shipped to your selected services, try logging in via FTP or Web Deploy. The following example shows a storage account log.

```output
{
  "time": "2023-10-16T17:42:32.9322528Z",
  "ResourceId": "/SUBSCRIPTIONS/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/RESOURCEGROUPS/MYRESOURCEGROUP/PROVIDERS/MICROSOFT.WEB/SITES/MY-DEMO-APP",
  "Category": "AppServiceAuditLogs",
  "OperationName": "Authorization",
  "Properties": {
    "User": "$my-demo-app",
    "UserDisplayName": "$my-demo-app",
    "UserAddress": "24.19.191.170",
    "Protocol": "FTP"
  }
}
```

## Use basic authentication-related policies

[Azure Policy](/azure/governance/policy/overview) can help you enforce organizational standards and assess compliance at scale. You can use Azure Policy to audit for any apps that still use basic authentication, and remediate any noncompliant resources. The following list shows built-in policies for auditing and remediating basic authentication on App Service:

- [Audit policy for FTP](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F871b205b-57cf-4e1e-a234-492616998bf7)
- [Audit policy for SCM](https://ms.portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Faede300b-d67f-480a-ae26-4b3dfb1a1fdc)
- [Remediation policy for FTP](https://ms.portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff493116f-3b7f-4ab3-bf80-0c2af35e46c2)
- [Remediation policy for SCM](https://ms.portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2c034a29-2a5f-4857-b120-f800fe5549ae)

The following list shows corresponding policies for slots:

- [Audit policy for FTP](https://ms.portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fec71c0bc-6a45-4b1f-9587-80dc83e6898c)
- [Audit policy for SCM](https://ms.portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F847ef871-e2fe-4e6e-907e-4adbf71de5cf)
- [Remediation policy for FTP](https://ms.portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff493116f-3b7f-4ab3-bf80-0c2af35e46c2)
- [Remediation policy for SCM](https://ms.portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2c034a29-2a5f-4857-b120-f800fe5549ae)

## Related content

- [Authentication types by deployment method in Azure App Service](deploy-authentication-types.md)
- [Configure continuous deployment to Azure App Service](deploy-continuous-deployment.md)
- [Deploy to Azure App Service by using GitHub Actions](deploy-github-actions.md)
- [Deploy to Azure App Service by using Git locally](deploy-local-git.md)
- [Deploy your app to Azure App Service using FTP/S](deploy-ftp.md)
