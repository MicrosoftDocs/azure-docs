---
title: Access Azure App Configuration using Microsoft Entra ID
description: Use Microsoft Entra ID and Azure role-based access control (RBAC) to access your Azure App Configuration store.
author: mrm9084
ms.author: mametcal
ms.date: 11/05/2026
ms.topic: concept-article
ms.service: azure-app-configuration

---
# Access Azure App Configuration using Microsoft Entra ID
Azure App Configuration supports authorizing requests to App Configuration stores by using Microsoft Entra ID. By using Microsoft Entra ID, you can use Azure role-based access control ([Azure RBAC](../role-based-access-control/overview.md)) to grant permissions to security principals, which can be user principals, [managed identities](../active-directory/managed-identities-azure-resources/overview.md), or [service principals](../active-directory/develop/app-objects-and-service-principals.md).

## Overview
Accessing an App Configuration store by using Microsoft Entra ID involves two steps:

1. **Authentication**: Acquire a token of the security principal from Microsoft Entra ID for App Configuration. For more information, see [Microsoft Entra authentication](./rest-api-authentication-azure-ad.md) in App Configuration.

1. **Authorization**: Pass the token as part of a request to an App Configuration store. To authorize access to the specified App Configuration store, the security principal must be assigned the appropriate roles in advance. For more information, see [Microsoft Entra authorization](./rest-api-authorization-azure-ad.md) in App Configuration.

## Azure built-in roles for Azure App Configuration
Azure provides the following built-in roles for authorizing access to App Configuration by using Microsoft Entra ID:

### Data plane access
You send requests for [data plane](../azure-resource-manager/management/control-plane-and-data-plane.md#data-plane) operations to the endpoint of your App Configuration store. These requests pertain to App Configuration data.

- **App Configuration Data Owner**: Use this role to give read, write, and delete access to App Configuration data. This role doesn't grant access to the App Configuration resource.
- **App Configuration Data Reader**: Use this role to give read access to App Configuration data. This role doesn't grant access to the App Configuration resource.

### Control plane access
You send all requests for [control plane](../azure-resource-manager/management/control-plane-and-data-plane.md#control-plane) operations to the Azure Resource Manager URL. These requests pertain to the App Configuration resource.

- **App Configuration Contributor**: Use this role to manage only App Configuration resources. This role doesn't grant access to manage other Azure resources. It can enable access key authentication and read the resource's access keys. As a result, a principal with this role can use an access key to read and modify the store's key-values, even though the role doesn't grant direct data access by using Microsoft Entra ID. To prevent principals with this role from enabling access key authentication, use Azure Policy to enforce that [access key authentication is disabled](./howto-disable-access-key-authentication.md). This role grants access to recover deleted App Configuration resources but not to purge them. To purge deleted App Configuration resources, use the **Contributor** role.
- **App Configuration Reader**: Use this role to read only App Configuration resource. This role doesn't grant access to read other Azure resources. It doesn't grant access to the resource's access keys, nor to the data stored in App Configuration.
- **Contributor** or **Owner**: Use these roles to manage App Configuration resources and other Azure resources. These roles are privileged administrator roles. They can enable access key authentication and read the resource's access keys. As a result, a principal with either role can use an access key to read and modify the store's key-values, even though the roles don't grant direct data access by using Microsoft Entra ID. To prevent principals with these roles from enabling access key authentication, use Azure Policy to enforce that [access key authentication is disabled](./howto-disable-access-key-authentication.md).
- **Reader**: Use this role to read App Configuration resource while also be able to read other Azure resources. This role doesn't grant access to the resource's access keys, nor to the data stored in App Configuration.

> [!NOTE]
> After a role assignment is made for an identity, allow up to 15 minutes for the permission to propagate before accessing data stored in App Configuration by using this identity.

## Authentication with token credentials

To enable your application to authenticate with Microsoft Entra ID, the Azure Identity library supports various token credentials for Microsoft Entra ID authentication. For example, you might choose Visual Studio Credential when developing your application in Visual Studio, Workload Identity Credential when your application runs on Kubernetes, or Managed Identity Credential when your application is deployed in Azure services like Azure Functions.

### Use DefaultAzureCredential

The `DefaultAzureCredential` is a preconfigured [chain of token credentials](/dotnet/azure/sdk/authentication/credential-chains#defaultazurecredential-overview) that automatically attempts an ordered sequence of the most common authentication methods. By using the `DefaultAzureCredential`, you can keep the same code in both local development and Azure environments. However, you need to know which credential is used in each environment, as you need to grant the appropriate roles for authorization to work. For example, authorize your own account when you expect the `DefaultAzureCredential` to fall back to your user identity during local development. Similarly, enable managed identity in Azure Functions and assign it the necessary role when you expect the `DefaultAzureCredential` to fall back to the `ManagedIdentityCredential` when your Function App runs in Azure.

### Assign App Configuration data roles

Regardless of which credential you use, you must assign it the appropriate roles before it can access your App Configuration store. If your application only needs to read data from your App Configuration store, assign it the *App Configuration Data Reader* role. If your application also needs to write data to your App Configuration store, assign it the *App Configuration Data Owner* role.

Follow these steps to assign App Configuration Data roles to your credential.

1. In the Azure portal, navigate to your App Configuration store and select **Access control (IAM)**.
1. Select **Add** > **Add role assignment**.
   
   If you don't have permission to assign roles, the **Add role assignment** option is disabled. Only users with *Owner* or *User Access Administrator* roles can make role assignments.
2. On the **Role** tab, select the **App Configuration Data Reader** role (or another App Configuration role as appropriate) and then select **Next**.
3. On the **Members** tab, follow the wizard to select the credential you're granting access to and then select **Next**.
4. Finally, on the **Review + assign** tab, select **Review + assign** to assign the role.

## Audience for Entra ID authentication

The audience for Microsoft Entra ID authentication defines who is permitted to access a specific resource. It identifies the intended recipient of the security token. App Configuration supports different audiences for different clouds.

### App Configuration audience

For Azure App Configuration in the global Azure cloud, use the following audience: 

`https://appconfig.azure.com`

For Azure App Configuration in the national clouds, use the applicable audience specified in the following table:

| **National cloud**                   | **Audience**                        |
| ------------------------------------ | ----------------------------------- |
| Azure Government                     | `https://appconfig.azure.us`        |
| Microsoft Azure operated by 21Vianet | `https://appconfig.azure.cn`        |
| Bleu                                 | `https://appconfig.sovcloud-api.fr` |

### Configure cloud-specific audience

Recent versions of the SDKs and providers listed in this article automatically detect the appropriate Microsoft Entra ID audience from the App Configuration endpoint unless you explicitly configure an audience. If you use an older version or a client that doesn't support automatic detection, you must configure the appropriate audience when authenticating in clouds other than global Azure, Azure Government, and Microsoft Azure operated by 21Vianet. See the version requirements and configuration examples in the following sections.

> [!TIP]
> If you encounter the following error when connecting to Azure App Configuration, it’s typically because your client doesn't support automatic audience detection and you didn't configure a cloud-specific Microsoft Entra ID audience, or you explicitly configured an incorrect audience.
>
> ```console
> AADSTS500011: The resource principal named https://appconfig.azure.com was not found in the tenant named msazurecloud.
> ```
>
> To resolve this issue, upgrade to a version that supports automatic audience detection or configure the appropriate Microsoft Entra ID audience as shown in the following code snippets. If you explicitly configured an incorrect audience, remove it to use automatic detection in supported versions, or replace it with the appropriate audience.

### [.NET](#tab/dotnet)
#### .NET configuration provider

> [!NOTE]
> If you're using version **8.6.0** or later, the audience is auto detected, unless you manually provide one by using the following method.

If your application uses any of the following packages, configure the audience by using the [ConfigureClientOptions](/dotnet/api/microsoft.extensions.configuration.azureappconfiguration.azureappconfigurationoptions.configureclientoptions#microsoft-extensions-configuration-azureappconfiguration-azureappconfigurationoptions-configureclientoptions(system-action((azure-data-appconfiguration-configurationclientoptions)))) method. Use version **8.2.0** or later of any of the following packages to configure the audience.
 - `Microsoft.Extensions.Configuration.AzureAppConfiguration`
 - `Microsoft.Azure.AppConfiguration.AspNetCore`
 - `Microsoft.Azure.AppConfiguration.Functions.Worker`

The following code snippet shows how to add the Azure App Configuration provider into a .NET application with a cloud-specific audience.

```csharp
builder.AddAzureAppConfiguration(o =>
    {
        o.Connect(
            myStoreEndpoint,
            new DefaultAzureCredential());

        o.ConfigureClientOptions(clientOptions =>
            clientOptions.Audience = "{Cloud specific audience here}");
    });
```

#### Azure SDK for .NET

> [!NOTE]
> If you're using version **1.11.0** or later, the audience is auto detected, unless you manually provide one by using the following method.

If your application uses the following package, configure the audience in `ConfigurationClientOptions` when you construct the `ConfigurationClient` object. Use version **1.6.0** or later of the following package.
 - `Azure.Data.AppConfiguration`

The following code snippet shows how to instantiate a configuration client with a cloud-specific audience.

```csharp
var configurationClient = new ConfigurationClient(
    myStoreEndpoint,
    new DefaultAzureCredential(),
    new ConfigurationClientOptions
    {
        Audience = "{Cloud specific audience here}"
    });
```

### [Java](#tab/java)
#### Spring configuration provider

If your application uses any of the following packages, configure the audience by customizing the `ConfigurationClientBuilder` through the `ConfigurationClientCustomizer` interface, then adding it to the bootstrap registry. Use version **5.22.0** or later of the following packages to configure the audience.
 - `spring-cloud-azure-appconfiguration-config`
 - `spring-cloud-azure-appconfiguration-config-web`

The following code snippet demonstrates how to add the Azure App Configuration provider into a Spring Boot application with a cloud-specific audience.

```java
import com.azure.data.appconfiguration.ConfigurationClientBuilder;
import com.azure.data.appconfiguration.models.ConfigurationAudience;
import com.azure.spring.cloud.appconfiguration.config.ConfigurationClientCustomizer;

public class CustomClient implements ConfigurationClientCustomizer {

    @Override
    public void customize(ConfigurationClientBuilder builder, String endpoint) {
        builder.audience(ConfigurationAudience.fromString("{Cloud specific audience here}"));
    }
}
```

Then, register the `CustomClient` in the bootstrap registry.

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import hello.impl.AppConfigClientImpl;

@SpringBootApplication
@AutoConfiguration
public class Application {

	public static void main(String[] args) {
		SpringApplication app = new SpringApplication(Application.class);
		
		// Register the ConfigurationClientCustomizer in the bootstrap context
		app.addBootstrapRegistryInitializer(registry -> {
			registry.register(CustomClient.class, context -> new CustomClient());
		});
		
		app.run(args);
	}

}
```

#### Azure SDK for Java

If your application uses the following package, configure the audience by passing the `audience` option to the `ConfigurationClientBuilder` when building a `ConfigurationClient`. Use version **1.8.0** or later of the following package.
 - `azure-data-appconfiguration`

The following code snippet shows how to instantiate a configuration client with a cloud-specific audience.

```java
ConfigurationClient configurationClient = new ConfigurationClientBuilder()
    .endpoint(myStoreEndpoint)
    .credential(new DefaultAzureCredentialBuilder().build())
    .audience(ConfigurationAudience.fromString("{Cloud specific audience here}"))
    .buildClient();
```

### [JavaScript](#tab/javascript)
#### JavaScript configuration provider

> [!NOTE]
> If you have version **1.13.0** or later of the `@azure/app-configuration` SDK library installed, the audience is auto detected, unless you manually provide one by using the following method.

If your application uses the following package, configure the audience by passing the `clientOptions` with the `audience` property to the `load` function. Use version **1.0.0** or later of the following package.
 - `@azure/app-configuration-provider`

The following code snippet demonstrates how to load Azure App Configuration in a JavaScript application with a cloud-specific audience.

```javascript
const appConfig = await load(myStoreEndpoint, credential, {
    clientOptions: {
        audience: "{Cloud specific audience here}"
    }
});
```

#### Azure SDK for JavaScript

> [!NOTE]
> If you're using version **1.13.0** or later, the audience is auto detected, unless you manually provide one by using the following method.

If your application uses the following package, configure the audience by passing the `audience` option to the `AppConfigurationClient` constructor. Use version **1.9.0** or later of the following package.
 - `@azure/app-configuration`

The following code snippet shows how to instantiate a configuration client with a cloud-specific audience.

```javascript
const client = new AppConfigurationClient(myStoreEndpoint, new DefaultAzureCredential(), {
    audience: "{Cloud specific audience here}",
});
```

### [Python](#tab/python)
#### Python configuration provider

> [!NOTE]
> If you have version **1.10.0** or later of the `azure-appconfiguration` SDK library installed, the audience is auto detected, unless you manually provide one.

If your application uses the following package, configure the audience by passing the `audience` keyword to the `load` method. Use version **2.4.0** or later of the following package.
 - `azure-appconfiguration-provider`

The following code snippet demonstrates how to load Azure App Configuration in a Python application with a cloud-specific audience.

```python
from azure.appconfiguration.provider import load
from azure.identity import DefaultAzureCredential

config = load(
    endpoint=myStoreEndpoint,
    credential=DefaultAzureCredential(),
    audience="{Cloud specific audience here}",
)
```

#### Azure SDK for Python

> [!NOTE]
> If you're using version **1.10.0** or later, the audience is auto detected, unless you manually provide one.

If your application uses the following package, configure the audience by passing the `audience` keyword to the `AzureAppConfigurationClient` constructor. Use version **1.8.0** or later of the following package.
 - `azure-appconfiguration`

The following code snippet shows how to instantiate a configuration client with a cloud-specific audience.

```python
from azure.appconfiguration import AzureAppConfigurationClient
from azure.identity import DefaultAzureCredential

client = AzureAppConfigurationClient(
    myStoreEndpoint,
    DefaultAzureCredential(),
    audience="{Cloud specific audience here}",
)
```

### [Go](#tab/go)

To configure the Entra ID audience, import the following packages in your Go application first:

```golang
import (
    "github.com/Azure/azure-sdk-for-go/sdk/azcore/cloud"
    "github.com/Azure/azure-sdk-for-go/sdk/azcore/policy"
)
```

#### Go configuration provider

> [!NOTE]
> If you're using version **1.7.0** or later, the audience is auto detected, unless you manually provide one by using the following method.

If your application uses the following package, configure the audience by passing the `ClientOptions` with the cloud configuration to the `Load` function. Use version **1.0.0** or later of the following package.
 - `azureappconfiguration`

The following code snippet demonstrates how to load Azure App Configuration in a Go application with a cloud-specific audience.

```golang
credential, _:= azidentity.NewDefaultAzureCredential(nil)

authOptions := azureappconfiguration.AuthenticationOptions{
    Endpoint: myStoreEndpoint,
    Credential: credential,
}

cloudConfig := cloud.Configuration{
    Services: map[cloud.ServiceName]cloud.ServiceConfiguration{
        azappconfig.ServiceName: {
            Audience: "{Cloud specific audience here}",
        },
    },
}

options := &azureappconfiguration.Options{
    ClientOptions: &azappconfig.ClientOptions{
        ClientOptions: policy.ClientOptions{
            Cloud: cloudConfig,
        },
    },
}

appConfig, _ := azureappconfiguration.Load(context.Background(), authOptions, options)
```

#### Azure SDK for Go

> [!NOTE]
> If you're using version **2.3.0** or later, the audience is auto detected, unless you manually provide one by using the following method.

If your application uses the following package, configure the audience by using the cloud configuration. Use version **2.1.0** or later of the following package.
 - `azappconfig`

The following code snippet shows how to instantiate a configuration client with a cloud-specific audience.

```golang
credential, _:= azidentity.NewDefaultAzureCredential(nil)

cloudConfig := cloud.Configuration{
    Services: map[cloud.ServiceName]cloud.ServiceConfiguration{
        azappconfig.ServiceName: {
            Audience: "{Cloud specific audience here}",
        },
    },
}

clientOptions := &azappconfig.ClientOptions{
    ClientOptions: policy.ClientOptions{
        Cloud: cloudConfig,
    },
}

client, _ := azappconfig.NewClient(myStoreEndpoint, credential, clientOptions)
```

### [Kubernetes](#tab/kubernetes)
#### Kubernetes provider

> [!NOTE]
> If you use version **2.6.8** or later, the provider automatically detects the audience unless you manually provide one by using the following method.

If your application runs on Kubernetes and you use the Azure App Configuration Kubernetes Provider, the audience configuration depends on how you install the provider.

- **AKS extension**: You don't need to configure the audience. The extension automatically determines the audience based on the cloud where it runs.
- **Helm chart**: Configure the audience at installation time by setting the `env.azureAppConfigurationAudience` parameter. Use version **2.6.0** or later of the [Azure App Configuration Kubernetes Provider](./quickstart-azure-kubernetes-service.md) to configure the audience.

The following command shows how to install the Azure App Configuration Kubernetes Provider via Helm with a cloud-specific audience.

```console
helm install azureappconfiguration.kubernetesprovider \
    oci://mcr.microsoft.com/azure-app-configuration/helmchart/kubernetes-provider \
    --namespace azappconfig-system \
    --create-namespace \
    --set env.azureAppConfigurationAudience="{Cloud specific audience here}"
```

### [PowerShell](#tab/powershell)
#### Azure PowerShell

If you use Azure PowerShell, configure the audience by setting the `AzureAppConfigurationEndpointResourceId` parameter on a custom Azure environment by using `Add-AzEnvironment` or `Set-AzEnvironment`. Use version **15.6.0** or later of the **Az** module.

The following example shows how to configure the Bleu environment with the App Configuration audience and endpoint suffix.

```powershell
Add-AzEnvironment -Name "{Environment name}" `
    -AzureAppConfigurationEndpointResourceId "https://appconfig.sovcloud-api.fr" `
    -AzureAppConfigurationEndpointSuffix "appconfig.sovcloud-api.fr"
```

To update an existing environment:

```powershell
Set-AzEnvironment -Name "{Environment name}" `
    -AzureAppConfigurationEndpointResourceId "https://appconfig.sovcloud-api.fr" `
    -AzureAppConfigurationEndpointSuffix "appconfig.sovcloud-api.fr"
```

After you configure the environment, connect to it before running any App Configuration commands:

```powershell
Connect-AzAccount -Environment "{Environment name}"
```

### [Azure CLI](#tab/azure-cli)
#### Azure CLI

If you use Azure CLI, configure the audience by setting the `appconfig_auth_token_audience` endpoint property on a cloud definition. Use `az cloud register` or `az cloud update` to set this property.

The following example demonstrates how to configure a custom cloud for Bleu with the App Configuration audience.

```azurecli
az cloud register --name <BleuCloudName> --cloud-config "{\"endpoints\":{\"resourceManager\":\"<BleuResourceManagerEndpoint>\",\"activeDirectory\":\"<BleuActiveDirectoryEndpoint>\",\"activeDirectoryResourceId\":\"<BleuActiveDirectoryResourceId>\",\"appconfig_auth_token_audience\":\"https://appconfig.sovcloud-api.fr\"}}"
```

To update the current cloud:

```azurecli
az cloud update -n <BleuCloudName> --cloud-config "{\"endpoints\": {\"appconfig_auth_token_audience\": \"https://appconfig.sovcloud-api.fr\"}}"
```

After configuring the cloud, set it as the active cloud before running any App Configuration commands:

```azurecli
az cloud set --name <BleuCloudName>
```

---

## Next steps
Learn how to [use managed identities to access your App Configuration store](howto-integrate-azure-managed-service-identity.md).
