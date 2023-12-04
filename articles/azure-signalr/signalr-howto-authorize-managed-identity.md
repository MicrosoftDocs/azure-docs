---
title: Authorize requests to Azure SignalR Service resources with Microsoft Entra managed identities
description: This article provides information about authorizing requests to Azure SignalR Service resources by using Microsoft Entra managed identities.
author: vicancy
ms.author: lianwei
ms.date: 03/28/2023
ms.service: signalr
ms.topic: how-to
ms.devlang: csharp
ms.custom: subject-rbac-steps
---

# Authorize requests to Azure SignalR Service resources with Microsoft Entra managed identities

Azure SignalR Service supports Microsoft Entra ID for authorizing requests from [Microsoft Entra managed identities](../active-directory/managed-identities-azure-resources/overview.md).

This article shows how to configure your Azure SignalR Service resource and code to authorize requests to the resource from a managed identity.

## Configure managed identities

The first step is to configure managed identities.

This example shows you how to configure a system-assigned managed identity on a virtual machine (VM) by using the Azure portal:

1. In the [Azure portal](https://portal.azure.com/), search for and select a VM.
1. Under **Settings**, select **Identity**.
1. On the **System assigned** tab, switch **Status** to **On**.

   ![Screenshot of selections for turning on system-assigned managed identities for a virtual machine.](./media/signalr-howto-authorize-managed-identity/identity-virtual-machine.png)
1. Select the **Save** button to confirm the change.

To learn how to create user-assigned managed identities, see [Create a user-assigned managed identity](../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md#create-a-user-assigned-managed-identity).

To learn more about configuring managed identities, see one of these articles:

- [Configure managed identities for Azure resources on a VM using the Azure portal](../active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm.md)
- [Configure managed identities for Azure resources on an Azure VM using PowerShell](../active-directory/managed-identities-azure-resources/qs-configure-powershell-windows-vm.md)
- [Configure managed identities for Azure resources on an Azure VM using the Azure CLI](../active-directory/managed-identities-azure-resources/qs-configure-cli-windows-vm.md)
- [Configure managed identities for Azure resources on an Azure VM using templates](../active-directory/managed-identities-azure-resources/qs-configure-template-windows-vm.md)
- [Configure a VM with managed identities for Azure resources using an Azure SDK](../active-directory/managed-identities-azure-resources/qs-configure-sdk-windows-vm.md)

To learn how to configure managed identities for Azure App Service and Azure Functions, see [How to use managed identities for App Service and Azure Functions](../app-service/overview-managed-identity.md).

## Add role assignments in the Azure portal

The following steps describe how to assign a SignalR App Server role to a system-assigned identity over an Azure SignalR Service resource. For detailed steps, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md).

> [!NOTE]
> A role can be assigned to any scope, including management group, subscription, resource group, or single resource. To learn more about scope, see [Understand scope for Azure RBAC](../role-based-access-control/scope-overview.md).

1. In the [Azure portal](https://portal.azure.com/), go to your Azure SignalR Service resource.

1. Select **Access control (IAM)**.

1. Select **Add** > **Add role assignment**.

   :::image type="content" source="../../includes/role-based-access-control/media/add-role-assignment-menu-generic.png" alt-text="Screenshot that shows the page for access control and selections for adding a role assignment.":::

1. On the **Role** tab, select **SignalR App Server**.

1. On the **Members** tab, select **Managed identity**, and then choose **Select members**.

1. Select your Azure subscription.

1. Select **System-assigned managed identity**, search for a virtual machine to which you want to assign the role, and then select it.

1. On the **Review + assign** tab, select **Review + assign** to assign the role.

> [!IMPORTANT]
> Azure role assignments might take up to 30 minutes to propagate.

To learn more about how to assign and manage Azure roles, see these articles:

- [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md)
- [Assign Azure roles using the REST API](../role-based-access-control/role-assignments-rest.md)
- [Assign Azure roles using Azure PowerShell](../role-based-access-control/role-assignments-powershell.md)
- [Assign Azure roles using the Azure CLI](../role-based-access-control/role-assignments-cli.md)
- [Assign Azure roles using Azure Resource Manager templates](../role-based-access-control/role-assignments-template.md)

## Configure your app

### App server

#### Use a system-assigned identity

You can use either [DefaultAzureCredential](/dotnet/api/overview/azure/identity-readme#defaultazurecredential) or [ManagedIdentityCredential](/dotnet/api/azure.identity.managedidentitycredential) to configure your Azure SignalR Service endpoints. The best practice is to use `ManagedIdentityCredential` directly.

The system-assigned managed identity is used by default, but *make sure that you don't configure any environment variables* that [EnvironmentCredential](/dotnet/api/azure.identity.environmentcredential) preserved if you use `DefaultAzureCredential`. Otherwise, Azure SignalR Service falls back to use `EnvironmentCredential` to make the request, which usually results in an `Unauthorized` response.

```C#
services.AddSignalR().AddAzureSignalR(option =>
{
    option.Endpoints = new ServiceEndpoint[]
    {
        new ServiceEndpoint(new Uri("https://<resource1>.service.signalr.net"), new ManagedIdentityCredential()),
    };
});
```

#### Use a user-assigned identity

Provide `ClientId` while creating the `ManagedIdentityCredential` object.

> [!IMPORTANT]
> Use the client ID, not the object (principal) ID, even if they're both GUIDs.

```C#
services.AddSignalR().AddAzureSignalR(option =>
{
    option.Endpoints = new ServiceEndpoint[]
    {
        var clientId = "<your identity client id>";
        new ServiceEndpoint(new Uri("https://<resource1>.service.signalr.net"), new ManagedIdentityCredential(clientId)),
    };
```

### Azure SignalR Service bindings in Azure Functions

Azure SignalR Service bindings in Azure Functions use [application settings](../azure-functions/functions-how-to-use-azure-function-app-settings.md) in the portal or [local.settings.json](../azure-functions/functions-develop-local.md#local-settings-file) locally to configure a managed identity to access your Azure SignalR Service resources.

You might need a group of key/value pairs to configure an identity. The keys of all the key/value pairs must start with a *connection name prefix* (which defaults to `AzureSignalRConnectionString`) and a separator. The separator is an underscore (`__`) in the portal and a colon (`:`) locally. You can customize the prefix by using the binding property [`ConnectionStringSetting`](../azure-functions/functions-bindings-signalr-service.md).

#### Use a system-assigned identity

If you configure only the service URI, you use the `DefaultAzureCredential` class. This class is useful when you want to share the same configuration on Azure and local development environments. To learn how it works, see [DefaultAzureCredential](/dotnet/api/overview/azure/identity-readme#defaultazurecredential).

In the Azure portal, use the following example to configure `DefaultAzureCredential`. If you don't configure any of [these environment variables](/dotnet/api/overview/azure/identity-readme#environment-variables), the system-assigned identity is used for authentication.

```bash
<CONNECTION_NAME_PREFIX>__serviceUri=https://<SIGNALR_RESOURCE_NAME>.service.signalr.net
```

Here's a configuration sample of `DefaultAzureCredential` in the *local.settings.json* file. At the local scope, there's no managed identity. Authentication via Visual Studio, the Azure CLI, and Azure PowerShell accounts is attempted in order.

```json
{
  "Values": {
    "<CONNECTION_NAME_PREFIX>:serviceUri": "https://<SIGNALR_RESOURCE_NAME>.service.signalr.net"
  }
}
```

If you want to use a system-assigned identity independently and without the influence of [other environment variables](/dotnet/api/overview/azure/identity-readme#environment-variables), set the `credential` key with the connection name prefix to `managedidentity`. Here's a sample for application settings:

```bash
<CONNECTION_NAME_PREFIX>__serviceUri = https://<SIGNALR_RESOURCE_NAME>.service.signalr.net
<CONNECTION_NAME_PREFIX>__credential = managedidentity
```

#### Use a user-assigned identity

If you want to use a user-assigned identity, you need to assign `clientId` in addition to `serviceUri` and `credential` keys with the connection name prefix. Here's a sample for application settings:

```bash
<CONNECTION_NAME_PREFIX>__serviceUri = https://<SIGNALR_RESOURCE_NAME>.service.signalr.net
<CONNECTION_NAME_PREFIX>__credential = managedidentity
<CONNECTION_NAME_PREFIX>__clientId = <CLIENT_ID>
```

## Next steps

See the following related articles:

- [Authorize access with Microsoft Entra ID for Azure SignalR Service](signalr-concept-authorize-azure-active-directory.md)
- [Authorize requests to Azure SignalR Service resources with Microsoft Entra applications](signalr-howto-authorize-application.md)
- [Disable local authentication](./howto-disable-local-auth.md)
