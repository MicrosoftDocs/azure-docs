---
title: Authorize requests to Azure SignalR Service resources with Microsoft Entra managed identities
description: This article provides information about authorizing requests to Azure SignalR Service resources by using Microsoft Entra managed identities.
author: vicancy
ms.author: lianwei
ms.date: 07/28/2024
ms.service: azure-signalr-service
ms.topic: how-to
ms.devlang: csharp
ms.custom: subject-rbac-steps
---

# Authorize requests to Azure SignalR Service resources with Microsoft Entra managed identities

Azure SignalR Service supports Microsoft Entra ID for authorizing requests from [Microsoft Entra managed identities](../active-directory/managed-identities-azure-resources/overview.md).

This article shows how to configure your Azure SignalR Service resource and code to authorize requests to the resource from a managed identity.

## Configure managed identities

The first step is to configure managed identities.

This example shows you how to configure a system-assigned managed identity on an App Service by using the Azure portal:

1. Access your app's settings in the [Azure portal](https://portal.azure.com) under the **Settings** group in the left navigation pane.
   
1. Select **Identity**.

1. Within the **System assigned** tab, switch **Status** to **On**. Click **Save**.

    ![Screenshot that shows where to switch Status to On and then select Save.](../app-service/media/app-service-managed-service-identity/system-assigned-managed-identity-in-azure-portal.png)

To learn more how to configure managed identities in other ways for Azure App Service and Azure Functions, see [How to use managed identities for App Service and Azure Functions](../app-service/overview-managed-identity.md).

To learn more about configuring managed identities on an Azure VM, see [Configure managed identities on Azure virtual machines (VMs)](../active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm.md)

## Add role assignments in the Azure portal

The following steps describe how to assign a SignalR App Server role to a system-assigned identity over an Azure SignalR Service resource. For detailed steps, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.yml).

> [!NOTE]
> A role can be assigned to any scope, including management group, subscription, resource group, or single resource. To learn more about scope, see [Understand scope for Azure RBAC](../role-based-access-control/scope-overview.md).

1. In the [Azure portal](https://portal.azure.com/), go to your Azure SignalR Service resource.

1. Select **Access control (IAM)**.

1. Select **Add** > **Add role assignment**.

   :::image type="content" source="~/reusable-content/ce-skilling/azure/media/role-based-access-control/add-role-assignment-menu-generic.png" alt-text="Screenshot that shows the page for access control and selections for adding a role assignment.":::

1. On the **Role** tab, select **SignalR App Server**.

1. On the **Members** tab, select **Managed identity**, and then choose **Select members**.

1. Select your Azure subscription.

1. Select **System-assigned managed identity**, search for a virtual machine to which you want to assign the role, and then select it.

1. On the **Review + assign** tab, select **Review + assign** to assign the role.

> [!IMPORTANT]
> Azure role assignments might take up to 30 minutes to propagate.

To learn more about how to assign and manage Azure roles, see these articles:

- [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.yml)
- [Assign Azure roles using the REST API](../role-based-access-control/role-assignments-rest.md)
- [Assign Azure roles using Azure PowerShell](../role-based-access-control/role-assignments-powershell.md)
- [Assign Azure roles using the Azure CLI](../role-based-access-control/role-assignments-cli.md)
- [Assign Azure roles using Azure Resource Manager templates](../role-based-access-control/role-assignments-template.md)

## Configure your app

### App server

#### Use a system-assigned identity

Azure SignalR SDK supports identity based connection string. If the configuration is set in App Server's environment variables, you don't need to redeploy App Server but simply a configuration change to migrate from Access Key to MSI. For example, update your App Server's environment variable `Azure__SignalR__ConnectionString` to `Endpoint=https://<resource1>.service.signalr.net;AuthType=azure.msi;Version=1.0;`. Or set in DI code.

```C#
services.AddSignalR().AddAzureSignalR("Endpoint=https://<resource1>.service.signalr.net;AuthType=azure.msi;Version=1.0;");
```

Besides, you can use either [DefaultAzureCredential](/dotnet/api/overview/azure/identity-readme#defaultazurecredential) or [ManagedIdentityCredential](/dotnet/api/azure.identity.managedidentitycredential) to configure your Azure SignalR Service endpoints. The best practice is to use `ManagedIdentityCredential` directly.

Notice that system-assigned managed identity is used by default, but *make sure that you don't configure any environment variables* that [EnvironmentCredential](/dotnet/api/azure.identity.environmentcredential) preserved if you use `DefaultAzureCredential`. Otherwise, Azure SignalR Service falls back to use `EnvironmentCredential` to make the request, which usually results in an `Unauthorized` response. 

> [!IMPORTANT]
> Remove `Azure__SignalR__ConnectionString` if there was from environment variables in this way. `Azure__SignalR__ConnectionString` will be used to build default `ServiceEndpoint` with first priority and may leads your App Server use Access Key unexpectedly.

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

Use identity based connection string.

```C#
services.AddSignalR().AddAzureSignalR("Endpoint=https://<resource1>.service.signalr.net;AuthType=azure.msi;ClientId=<your-user-identity-client-id>;Version=1.0;");
```

Or build `ServiceEndpoint` with `ManagedIdentityCredential`.

```C#
services.AddSignalR().AddAzureSignalR(option =>
{
    option.Endpoints = new ServiceEndpoint[]
    {
        var clientId = "<your-user-identity-client-id>";
        new ServiceEndpoint(new Uri("https://<resource1>.service.signalr.net"), new ManagedIdentityCredential(clientId)),
    };
});
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
