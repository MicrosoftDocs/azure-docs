---
title: Access Azure App Configuration using Microsoft Entra ID
description: Use Microsoft Entra ID and Azure role-based access control (RBAC) to access your Azure App Configuration store.
author: zhenlan
ms.author: zhenlwa
ms.date: 10/30/2025
ms.topic: concept-article
ms.service: azure-app-configuration

---
# Access Azure App Configuration using Microsoft Entra ID
Azure App Configuration supports authorization of requests to App Configuration stores using Microsoft Entra ID. With Microsoft Entra ID, you can leverage Azure role-based access control ([Azure RBAC](../role-based-access-control/overview.md)) to grant permissions to security principals, which can be user principals, [managed identities](../active-directory/managed-identities-azure-resources/overview.md), or [service principals](../active-directory/develop/app-objects-and-service-principals.md).

## Overview
Accessing an App Configuration store using Microsoft Entra ID involves two steps:

1. **Authentication**: Acquire a token of the security principal from Microsoft Entra ID for App Configuration. For more information, see [Microsoft Entra authentication](./rest-api-authentication-azure-ad.md) in App Configuration.

1. **Authorization**: Pass the token as part of a request to an App Configuration store. To authorize access to the specified App Configuration store, the security principal must be assigned the appropriate roles in advance. For more information, see [Microsoft Entra authorization](./rest-api-authorization-azure-ad.md) in App Configuration.

## Azure built-in roles for Azure App Configuration
Azure provides the following built-in roles for authorizing access to App Configuration using Microsoft Entra ID:

### Data plane access
Requests for [data plane](../azure-resource-manager/management/control-plane-and-data-plane.md#data-plane) operations are sent to the endpoint of your App Configuration store. These requests pertain to App Configuration data.

- **App Configuration Data Owner**: Use this role to give read, write, and delete access to App Configuration data. This role doesn't grant access to the App Configuration resource.
- **App Configuration Data Reader**: Use this role to give read access to App Configuration data. This role doesn't grant access to the App Configuration resource.

### Control plane access
All requests for [control plane](../azure-resource-manager/management/control-plane-and-data-plane.md#control-plane) operations are sent to the Azure Resource Manager URL. These requests pertain to the App Configuration resource.

- **App Configuration Contributor**: Use this role to manage only App Configuration resource. This role does not grant access to manage other Azure resources. It grants access to the resource's access keys. While the App Configuration data can be accessed using access keys, this role doesn't grant direct access to the data using Microsoft Entra ID. It grants access to recover deleted App Configuration resource but not to purge them. To purge deleted App Configuration resources, use the **Contributor** role. 
- **App Configuration Reader**: Use this role to read only App Configuration resource. This role does not grant access to read other Azure resources. It doesn't grant access to the resource's access keys, nor to the data stored in App Configuration.
- **Contributor** or **Owner**: Use this role to manage the App Configuration resource while also be able to manage other Azure resources. This role is a privileged administrator role. It grants access to the resource's access keys. While the App Configuration data can be accessed using access keys, this role doesn't grant direct access to the data using Microsoft Entra ID.
- **Reader**: Use this role to read App Configuration resource while also be able to read other Azure resources. This role doesn't grant access to the resource's access keys, nor to the data stored in App Configuration.

> [!NOTE]
> After a role assignment is made for an identity, allow up to 15 minutes for the permission to propagate before accessing data stored in App Configuration using this identity.

## Authentication with token credentials

To enable your application to authenticate with Microsoft Entra ID, the Azure Identity library supports various token credentials for Microsoft Entra ID authentication. For example, you might choose Visual Studio Credential when developing your application in Visual Studio, Workload Identity Credential when your application runs on Kubernetes, or Managed Identity Credential when your application is deployed in Azure services like Azure Functions.

### Use DefaultAzureCredential

The `DefaultAzureCredential` is a preconfigured [chain of token credentials](/dotnet/azure/sdk/authentication/credential-chains#defaultazurecredential-overview) that automatically attempts an ordered sequence of the most common authentication methods. Using the `DefaultAzureCredential` allows you to keep the same code in both local development and Azure environments. However, it's important to know which credential is being used in each environment, as you need to grant the appropriate roles for authorization to work. For example, authorize your own account when you expect the `DefaultAzureCredential` to fall back to your user identity during local development. Similarly, enable managed identity in Azure Functions and assign it the necessary role when you expect the `DefaultAzureCredential` to fall back to the `ManagedIdentityCredential` when your Function App runs in Azure.

### Assign App Configuration data roles

Regardless of which credential you use, you must assign it the appropriate roles before it can access your App Configuration store. If your application only needs to read data from your App Configuration store, assign it the *App Configuration Data Reader* role. If your application also needs to write data to your App Configuration store, assign it the *App Configuration Data Owner* role.

Follow these steps to assign App Configuration Data roles to your credential.

1. In the Azure portal, navigate to your App Configuration store and select **Access control (IAM)**.
1. Select **Add** -> **Add role assignment**.
   
   If you don't have permission to assign roles, the **Add role assignment** option will be disabled. Only users with *Owner* or *User Access Administrator* roles can make role assignments.
2. On the **Role** tab, select the **App Configuration Data Reader** role (or another App Configuration role as appropriate) and then select **Next**.
3. On the **Members** tab, follow the wizard to select the credential you're granting access to and then select **Next**.
4. Finally, on the **Review + assign** tab, select **Review + assign** to assign the role.

## Cloud-specific audience for Entra ID authentication

When using Entra ID and the following Azure App Configuration libraries in clouds other than Azure cloud, Azure Government, and Microsoft Azure operated by 21Vianet, an appropriate Entra ID audience must be configured to enable authentication.

### [.NET](#tab/dotnet)

The Audience for the target cloud must be configured for the following packages.

- Azure SDK for .NET: Azure.Data.AppConfiguration >= 1.6.0
- .NET configuration provider: Microsoft.Extensions.Configuration.AzureAppConfiguration >= 8.2.0

In the **Azure SDK for .NET**, audience is configured by utilizing the following API calls:

* The ConfigurationClient constructor [accepts ConfigurationClientOptions](/dotnet/api/azure.data.appconfiguration.configurationclient.-ctor#azure-data-appconfiguration-configurationclient-ctor(system-uri-azure-core-tokencredential-azure-data-appconfiguration-configurationclientoptions))
* ConfigurationClientOptions allows [Audience](/dotnet/api/azure.data.appconfiguration.configurationclientoptions.audience#azure-data-appconfiguration-configurationclientoptions-audience) to be set

The following code snippet demonstrates how to instantiate a configuration client with a cloud-specific audience.

```csharp
var configurationClient = new ConfigurationClient(
    myStoreEndpoint,
    new DefaultAzureCredential(),
    new ConfigurationClientOptions
    {
        Audience = "{Cloud specific audience here}"
    });
```

In the **.NET configuration provider**, audience is configured by utilizing the following API calls:

* AzureAppConfigurationOptions exposes a [ConfigureClientOptions](/dotnet/api/microsoft.extensions.configuration.azureappconfiguration.azureappconfigurationoptions.configureclientoptions#microsoft-extensions-configuration-azureappconfiguration-azureappconfigurationoptions-configureclientoptions(system-action((azure-data-appconfiguration-configurationclientoptions)))) method

The following code snippet demonstrates how to add the Azure App Configuration provider into a .NET application with a cloud-specific audience.

```csharp
builder.AddAzureAppConfiguration(o =>
    {
        o.Connect(
            myStoreEndpoint,
            new DefaultAzureCredential());

        o.ConfigureClientOptions(clientOptions => clientOptions.Audience = "{Cloud specific audience here}");
    });
```

---

### Audience

For Azure App Configuration in the global Azure cloud, use the following audience: 

`https://appconfig.azure.com`

For Azure App Configuration in the national clouds, use the applicable audience specified in the table below:

| **National cloud**                   | **Audience**                        |
| ------------------------------------ | ----------------------------------- |
| Azure Government                     | `https://appconfig.azure.us`        |
| Microsoft Azure operated by 21Vianet | `https://appconfig.azure.cn`        |
| Bleu                                 | `https://appconfig.sovcloud-api.fr` |

## Next steps
Learn how to [use managed identities to access your App Configuration store](howto-integrate-azure-managed-service-identity.md).
