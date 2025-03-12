---
title: Authorize requests to Azure SignalR Service resources with Microsoft Entra applications
description: This article provides information about authorizing requests to Azure SignalR Service resources by using Microsoft Entra applications.
author: vicancy
ms.author: lianwei
ms.date: 02/03/2023
ms.service: azure-signalr-service
ms.topic: how-to
ms.devlang: csharp
ms.custom: subject-rbac-steps
---

# Authorize requests to Azure SignalR Service resources with Azure applications

Azure SignalR Service supports Microsoft Entra ID for authorizing requests from [Microsoft Entra applications](../entra/identity-platform/app-objects-and-service-principals.md).

This article shows how to configure your Azure SignalR Service resource and codes to authorize requests to the resource from a Microsoft Entra application.

## Register an application in Microsoft Entra ID

The first step is to [Register an application in Microsoft Entra ID](../entra/identity-platform/quickstart-register-app?tabs=certificate%2Cexpose-a-web-api):

After you register your application, you can find the **Application (client) ID** and **Directory (tenant) ID** values on the application's overview page. These GUIDs can be useful in the following steps.

![Screenshot of overview information for a registered application.](./media/signalr-howto-authorize-application/application-overview.png)

## Add credentials

After registering an app, you can add **certificates, client secrets (a string), or federated identity credentials** as credentials to your confidential client app registration. Credentials allow your application to authenticate as itself, requiring no interaction from a user at runtime, and are used by confidential client applications that access a web API.

- [Add a certificate](../entra/identity-platform/quickstart-register-app?tabs=certificate%2Cexpose-a-web-api)
- [Add a client secret](../entra/identity-platform/quickstart-register-app?tabs=client-secret%2Cexpose-a-web-api)
- [Add a federated credential](../entra/identity-platform/quickstart-register-app?tabs=federated-credential%2Cexpose-a-web-api)


## Add role assignments in the Azure portal

The following steps describe how to assign a SignalR App Server role to a service principal (application) over an Azure SignalR Service resource. For detailed steps, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.yml).

> [!NOTE]
> A role can be assigned to any scope, including management group, subscription, resource group, or single resource. To learn more about scope, see [Understand scope for Azure RBAC](../role-based-access-control/scope-overview.md).

1. In the [Azure portal](https://portal.azure.com/), go to your Azure SignalR Service resource.

1. Select **Access control (IAM)**.

1. Select **Add** > **Add role assignment**.

   :::image type="content" source="~/reusable-content/ce-skilling/azure/media/role-based-access-control/add-role-assignment-menu-generic.png" alt-text="Screenshot that shows the page for access control and selections for adding a role assignment.":::

1. On the **Role** tab, select **SignalR App Server**.

1. On the **Members** tab, select **User, group, or service principal**, and then choose **Select members**.

1. Search for and select the application to which you want to assign the role.

1. On the **Review + assign** tab, select **Review + assign** to assign the role.

> [!IMPORTANT]
> Azure role assignments might take up to 30 minutes to propagate.

To learn more about how to assign and manage Azure roles, see these articles:

- [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.yml)
- [Assign Azure roles using the REST API](../role-based-access-control/role-assignments-rest.md)
- [Assign Azure roles using Azure PowerShell](../role-based-access-control/role-assignments-powershell.md)
- [Assign Azure roles using the Azure CLI](../role-based-access-control/role-assignments-cli.md)
- [Assign Azure roles using Azure Resource Manager templates](../role-based-access-control/role-assignments-template.md)

## Microsoft.Azure.SignalR app server SDK for C#

[Azure SignalR server SDK for C#](https://github.com/Azure/azure-signalr)

### Use Microsoft Entra application with certificate
```csharp
services.AddSignalR().AddAzureSignalR(option =>
{
    var credential = new ClientCertificateCredential("tenantId", "clientId", "path-to-cert");

    option.Endpoints = [
      new ServiceEndpoint(new Uri(), "https://<resource>.service.signalr.net"), credential);
    ];
});
```

### Use Microsoft Entra application with client secret

```csharp
services.AddSignalR().AddAzureSignalR(option =>
{
    var credential = new ClientSecretCredential("tenantId", "clientId", "clientSecret");

    option.Endpoints = [
      new ServiceEndpoint(new Uri(), "https://<resource>.service.signalr.net"), credential);
    ];
});
```

### Use Microsoft Entra application with Federated identity

> [!NOTE]
> Configure an application to trust a managed identity is a preview feature. 
> To learn more about it, see [Configure an application to trust a managed identity (preview)](../entra/workload-id/workload-identity-federation-config-app-trust-managed-identity).

```csharp
services.AddSignalR().AddAzureSignalR(option =>
{
    var msiCredential = new ManagedIdentityCredential("msiClientId");

    var credential = new ClientAssertionCredential("tenantId", "appClientId", async (ctoken) =>
    {
        // Entra ID US Government: api://AzureADTokenExchangeUSGov
        // Entra ID China operated by 21Vianet: api://AzureADTokenExchangeChina
        var request = new TokenRequestContext([$"api://AzureADTokenExchange/.default"]);
        var response = await msiCredential.GetTokenAsync(request, ctoken).ConfigureAwait(false);
        return response.Token;
    });

    option.Endpoints = [
      new ServiceEndpoint(new Uri(), "https://<resource>.service.signalr.net"), credential);
    ];
});
```

### Use multiple endpoints

Credentials can be different for different endpoints.

In this sample, the Azure SignalR SDK will connect to `resource1` with client secret and connect to `resource2` with certificate.

```csharp
services.AddSignalR().AddAzureSignalR(option =>
{
    var credential1 = new ClientSecretCredential("tenantId", "clientId", "clientSecret");
    var credential2 = new ClientCertificateCredential("tenantId", "clientId", "path-to-cert");

    option.Endpoints = new ServiceEndpoint[]
    {
        new ServiceEndpoint(new Uri("https://<resource1>.service.signalr.net"), credential1),
        new ServiceEndpoint(new Uri("https://<resource2>.service.signalr.net"), credential2),
    };
});
```

## Azure SignalR Service bindings in Azure Functions

Azure SignalR Service bindings in Azure Functions use [application settings](../azure-functions/functions-how-to-use-azure-function-app-settings.md) in the portal or [local.settings.json](../azure-functions/functions-develop-local.md#local-settings-file) locally to configure Microsoft Entra application identities to access your Azure SignalR Service resources.

First, you need to specify the service URI of Azure SignalR Service. The key of the service URI is `serviceUri`. It starts with a connection name prefix (which defaults to `AzureSignalRConnectionString`) and a separator. The separator is an underscore (`__`) in the Azure portal and a colon (`:`) in the *local.settings.json* file. You can customize the connection name by using the binding property [`ConnectionStringSetting`](../azure-functions/functions-bindings-signalr-service.md). Continue reading to find the sample.

Then, you choose whether to configure your Microsoft Entra application identity in [predefined environment variables](#configure-an-identity-in-predefined-environment-variables) or in [SignalR-specified variables](#configure-an-identity-in-signalr-specified-variables).

#### Configure an identity in predefined environment variables

See [Environment variables](/dotnet/api/overview/azure/identity-readme#environment-variables) for the list of predefined environment variables. When you have multiple services, we recommend that you use the same application identity, so that you don't need to configure the identity for each service. Other services might also use these environment variables, based on the settings of those services.

For example, to use client secret credentials, configure the identity as follows in the *local.settings.json* file:

```json
{
  "Values": {
    "<CONNECTION_NAME_PREFIX>:serviceUri": "https://<SIGNALR_RESOURCE_NAME>.service.signalr.net",
    "AZURE_CLIENT_ID": "...",
    "AZURE_CLIENT_SECRET": "...",
    "AZURE_TENANT_ID": "..."
  }
}
```

In the Azure portal, add settings as follows:

```bash
 <CONNECTION_NAME_PREFIX>__serviceUri=https://<SIGNALR_RESOURCE_NAME>.service.signalr.net
AZURE_CLIENT_ID = ...
AZURE_TENANT_ID = ...
AZURE_CLIENT_SECRET = ...
```

#### Configure an identity in SignalR-specified variables

SignalR-specified variables share the same key prefix with the `serviceUri` key. Here's the list of variables that you might use:

- `clientId`
- `clientSecret`
- `tenantId`

Here are the samples to use client secret credentials in the *local.settings.json* file:

```json
{
  "Values": {
    "<CONNECTION_NAME_PREFIX>:serviceUri": "https://<SIGNALR_RESOURCE_NAME>.service.signalr.net",
    "<CONNECTION_NAME_PREFIX>:clientId": "...",
    "<CONNECTION_NAME_PREFIX>:clientSecret": "...",
    "<CONNECTION_NAME_PREFIX>:tenantId": "..."
  }
}
```

In the Azure portal, add settings as follows:

```bash
<CONNECTION_NAME_PREFIX>__serviceUri = https://<SIGNALR_RESOURCE_NAME>.service.signalr.net
<CONNECTION_NAME_PREFIX>__clientId = ...
<CONNECTION_NAME_PREFIX>__clientSecret = ...
<CONNECTION_NAME_PREFIX>__tenantId = ...
```

## Next steps

See the following related articles:

- [Authorize access with Microsoft Entra ID for Azure SignalR Service](signalr-concept-authorize-azure-active-directory.md)
- [Authorize requests to Azure SignalR Service resources with Microsoft Entra managed identities](signalr-howto-authorize-managed-identity.md)
- [Disable local authentication](./howto-disable-local-auth.md)
