Many Azure services support passwordless connections through Azure AD and Role Based Access control (RBAC). These techniques provide robust security features and can be implemented using `DefaultAzureCredential` from the Azure Identity client libraries.

> [!IMPORTANT]
> Some languages must implement `DefaultAzureCredential` explicitly in their code, while others utilize `DefaultAzureCredential` internally through underlying plugins or drivers.

`DefaultAzureCredential` supports multiple authentication methods and automatically determines which should be used at runtime. This approach enables your app to use different authentication methods in different environments (local dev vs. production) without implementing environment-specific code.

The order and locations in which `DefaultAzureCredential` searches for credentials can be found in the [Azure Identity library overview](/dotnet/api/overview/azure/Identity-readme#defaultazurecredential) and varies between languages. For example, when working locally with .NET, `DefaultAzureCredential` will generally authenticate using the account the developer used to sign-in to Visual Studio, Azure CLI, or Azure PowerShell. When the app is deployed to Azure, `DefaultAzureCredential` will automatically discover and use the [managed identity](../../../articles/active-directory/managed-identities-azure-resources/overview.md) of the associated hosting service, such as Azure App Service. No code changes are required for this transition.

> [!NOTE]
> A managed identity provides a security identity to represent an app or service. The identity is managed by the Azure platform and does not require you to provision or rotate any secrets. You can read more about managed identities in the [overview](../../../articles/active-directory/managed-identities-azure-resources/overview.md) documentation.

The following code example demonstrates how to connect to Service Bus using passwordless connections. The next section describes how to migrate to this setup for a specific service in more detail.

A .NET application can pass an instance of `DefaultAzureCredential` into the constructor of a service client class. `DefaultAzureCredential` will automatically discover the credentials that are available in that environment.

```csharp
ServiceBusClient serviceBusClient = new(
    new Uri($"https://{serviceBusNamespace}.blob.core.windows.net"),
    new DefaultAzureCredential());
```