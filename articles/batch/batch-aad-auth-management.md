---
title: Use Microsoft Entra ID to authenticate Batch Management solutions
description: Learn how to authenticate apps that use the Batch Management .NET library with Microsoft Entra ID and the Azure Identity library.
ms.topic: how-to
ms.date: 05/15/2026
ms.custom: devx-track-csharp, devx-track-arm-template, devx-track-dotnet
# Customer intent: As a developer integrating Batch management solutions, I want to authenticate my application to Microsoft Entra ID using the Azure Identity library, so that I can securely manage Batch accounts, keys, applications, and packages programmatically.
---

# Authenticate Batch Management solutions with Microsoft Entra ID

Applications that call the Azure Batch Management service authenticate with [Microsoft Entra ID](/azure/active-directory/fundamentals/active-directory-whatis), Microsoft's multitenant cloud-based directory and identity management service. Azure itself uses Microsoft Entra ID to authenticate its customers, service administrators, and organizational users.

The recommended way to authenticate Batch management apps is to use the [Azure Identity client library](/dotnet/api/overview/azure/identity-readme), together with the [Azure.ResourceManager.Batch](/dotnet/api/overview/azure/resourcemanager.batch-readme) management library. The Azure Identity library provides token-based credential classes (such as `DefaultAzureCredential`, `ManagedIdentityCredential`, `ClientSecretCredential`, and `InteractiveBrowserCredential`) that work consistently whether your app runs locally, on Azure, or on-premises. For an overview of recommended authentication strategies, see [Authenticate .NET apps to Azure services using the Azure Identity library](/dotnet/azure/sdk/authentication/).

The `Azure.ResourceManager.Batch` library exposes types for managing Batch accounts, account keys, applications, and application packages. It's an Azure resource provider client and works together with [Azure Resource Manager](../azure-resource-manager/management/overview.md) to manage these resources programmatically. Microsoft Entra ID is required to authenticate requests made through any Azure resource provider client, including this library.

> [!NOTE]
> The legacy `Microsoft.Azure.Management.Batch` package and ADAL-based code patterns (`AuthenticationContext.AcquireToken`) are deprecated. New code should use `Azure.ResourceManager.Batch` with `Azure.Identity` credentials.

To learn more about using the Batch Management .NET library, see [Manage Batch accounts and quotas with the Batch Management client library for .NET](batch-management-dotnet.md).

<a name='register-your-application-with-azure-ad'></a>

## Register an application (optional)

Whether you need to register a separate Microsoft Entra application depends on the credential type you use:

- If you use [`DefaultAzureCredential`](/dotnet/api/azure.identity.defaultazurecredential) and sign in through a developer tool (Azure CLI, Azure PowerShell, Visual Studio, or Visual Studio Code), or your app runs on an Azure resource with a managed identity, you don't need to register a separate application. The credential uses the identity already configured in that environment.
- If your app authenticates as a service principal (for example, with [`ClientSecretCredential`](/dotnet/api/azure.identity.clientsecretcredential) or [`ClientCertificateCredential`](/dotnet/api/azure.identity.clientcertificatecredential)), you must register an application in your Microsoft Entra tenant.

To register an application, follow the steps in [Quickstart: Register an application with the Microsoft identity platform](/azure/active-directory/develop/quickstart-register-app). After registration, Microsoft Entra ID provides an *application (client) ID* you use at runtime. For more information, see [Application and service principal objects in Microsoft Entra ID](/azure/active-directory/develop/app-objects-and-service-principals).

## Assign Azure RBAC permissions

After you decide which identity your app uses (a developer account, a managed identity, or a service principal), assign that identity the Azure role-based access control (RBAC) permissions it needs on the resource group or subscription where you manage Batch accounts. Common built-in roles include **Contributor**, **Azure Batch Account Contributor**, and **Reader**.

For steps, see [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal).

<a name='azure-ad-endpoints'></a>
<a name='acquire-an-azure-ad-authentication-token'></a>

## Authenticate with the Azure Identity library

With `Azure.Identity` and `Azure.ResourceManager.Batch`, you don't need to manually reference Microsoft Entra endpoints, resource URIs, or redirect URIs — the credential handles token acquisition, caching, and refresh automatically.

1. Install the required NuGet packages:

   ```bash
   dotnet add package Azure.Identity
   dotnet add package Azure.ResourceManager.Batch
   ```

1. Add the following `using` statements to your code:

   ```csharp
   using Azure.Identity;
   using Azure.ResourceManager;
   using Azure.ResourceManager.Batch;
   ```

1. Create a credential and pass it to `ArmClient`. Use the client to enumerate or manage Batch accounts.

   **Recommended: `DefaultAzureCredential`** — works locally with developer tool sign-ins (Azure CLI, Visual Studio, Visual Studio Code) and uses managed identity automatically when the app runs on Azure:

   ```csharp
   ArmClient arm = new ArmClient(new DefaultAzureCredential());

   SubscriptionResource subscription = await arm.GetDefaultSubscriptionAsync();
   await foreach (BatchAccountResource account in subscription.GetBatchAccountsAsync())
   {
       Console.WriteLine(account.Data.Name);
   }
   ```

   **Interactive (integrated) sign-in** — prompts a user to sign in via the system browser. Use this when your app must authenticate a specific user interactively:

   ```csharp
   var credential = new InteractiveBrowserCredential(
       new InteractiveBrowserCredentialOptions
       {
           TenantId = "<tenant-id>",
           ClientId = "<application-id>",      // optional; required only if you registered your own app
           RedirectUri = new Uri("http://localhost")
       });

   ArmClient arm = new ArmClient(credential);
   ```

   **Service principal (client secret)** — use for unattended apps that authenticate with an app registration secret:

   ```csharp
   var credential = new ClientSecretCredential(
       tenantId: "<tenant-id>",
       clientId: "<application-id>",
       clientSecret: "<client-secret>");

   ArmClient arm = new ArmClient(credential);
   ```

   **Managed identity** — use when your app runs on an Azure resource (such as a VM, App Service, or Container App) that has a system-assigned or user-assigned managed identity:

   ```csharp
   // System-assigned managed identity
   var credential = new ManagedIdentityCredential();

   // Or, user-assigned managed identity
   // var credential = new ManagedIdentityCredential(clientId: "<user-assigned-client-id>");

   ArmClient arm = new ArmClient(credential);
   ```

The credential transparently caches and refreshes tokens, so you can keep `ArmClient` and Batch management resources alive for the lifetime of your app.

## Next steps

- [Manage Batch accounts and quotas with the Batch Management client library for .NET](batch-management-dotnet.md)
- [Authenticate Batch service solutions with Microsoft Entra ID](batch-aad-auth.md)
- [Authenticate .NET apps to Azure services using the Azure Identity library](/dotnet/azure/sdk/authentication/)
- [Azure.ResourceManager.Batch client library for .NET](/dotnet/api/overview/azure/resourcemanager.batch-readme)
- [Azure Identity client library for .NET](/dotnet/api/overview/azure/identity-readme)
- [Application and service principal objects in Microsoft Entra ID](/azure/active-directory/develop/app-objects-and-service-principals)
