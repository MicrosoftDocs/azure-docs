---
title: Authorize access to data with a managed identity
titleSuffix: An Azure Communication Services tutorial
description: Use managed identities for Azure resources to authorize administration and SMS APIs access from applications running in Azure VMs, function apps, and others.
services: azure-communication-services
author: gistefan

ms.service: azure-communication-services
ms.topic: how-to
ms.date: 12/04/2020
ms.author: tamram
ms.reviewer: <>
---

# Authorize access to Administration and SMS APIs with managed identities for Azure resources

Administration and SMS APIs support Azure Active Directory (Azure AD) authentication with [managed identities for Azure resources](../../active-directory/managed-identities-azure-resources/overview.md). Managed identities for Azure resources can authorize access to administration and SMS APIs using Azure AD credentials from applications running in Azure virtual machines (VMs), function apps, virtual machine scale sets, and other services. By using managed identities for Azure resources together with Azure AD authentication, you can avoid storing credentials with your applications that run in the cloud.  

This article shows how to authorize access to Administration and SMS APIs from an Azure environemnt that supports managed identities. It also describes how to test your code in the development environment.

## Enable managed identities on an VM or App service

Before you can use managed identities for Azure Resources to authorize access to ACS APIs from your Azure Function, you must first enable managed identities for Azure Resources on the VM. To learn how to enable managed identities for Azure Resources, see one of these articles:

- [Azure portal](../../active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm.md)
- [Azure PowerShell](../../active-directory/managed-identities-azure-resources/qs-configure-powershell-windows-vm.md)
- [Azure CLI](../../active-directory/managed-identities-azure-resources/qs-configure-cli-windows-vm.md)
- [Azure Resource Manager template](../../active-directory/managed-identities-azure-resources/qs-configure-template-windows-vm.md)
- [Azure Resource Manager client libraries](../../active-directory/managed-identities-azure-resources/qs-configure-sdk-windows-vm.md)
- [App services](../../app-service/overview-managed-identity.md)

### Assign Azure roles for access to APIs

When an Azure AD security principal attempts to access an API, that security principal must have permissions to the resource. Whether the security principal is a managed identity in Azure or an Azure AD user account running code in the development environment, the security principal must be assigned an Azure role that grants access to ACS APIs. For information about assigning permissions via Azure RBAC.

#### Azure Portal example

1. Go to the azure portal
1. Go to the Azure Communication Service resource
1. Navigate to Access Control (IAM) menu -> + Add -> Add role assignment
1. Select the role "Contributor" (the only one supported at the moment)
1. In the Assign access to field select "User assigned managed identity" (or a "System assigned managed identity") then select the desired identity then save
![Managed identity role](media/communication-auth-aad-msi-assign.png)


## Authenticate with the Azure Identity library

The Azure Identity client library provides Azure Azure AD token authentication support for the [Azure SDK](https://github.com/Azure/azure-sdk). The latest versions of the ACS SDKs integrate with the Azure Identity library to provide a simple and secure means to acquire an OAuth 2.0 token for authorization of Communication requests.

For more information about the Azure Identity client library for .NET, see [Azure Identity client library for .NET](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/identity/Azure.Identity). For reference documentation for the Azure Identity client library, see [Azure.Identity Namespace](/dotnet/api/azure.identity).

### Authenticate the user in the development environment

When your code is running in the development environment, authentication may be handled automatically, or it may require a browser login, depending on which tools you're using. For example, Microsoft Visual Studio supports single sign-on (SSO), so that the active Azure AD user account is automatically used for authentication. For more information about SSO, see [Single sign-on to applications](../../active-directory/manage-apps/what-is-single-sign-on.md).

Other development tools may prompt you to login via a web browser.

## Set up

### Install client library packages

```console
dotnet add package Azure.Communication.Administration
dotnet add package Azure.Identity
```

The examples below are using the [DefaultAzureCredential](https://docs.microsoft.com/dotnet/api/azure.identity.defaultazurecredential) that is suitable for multiple environments

### Administration SDK example (create identity and issue token)

```csharp
     string connectionString = Environment.GetEnvironmentVariable("COMMUNICATION_SERVICES_RESOURCE_ENDPOINT");
     TokenCredential credential = new DefaultAzureCredential();
     
     var client = new CommunicationIdentityClient(managedIdentityCredential, ResourceEndpoint);
     var identityResponse = await client.CreateUserAsync();
     
     var tokenResponse = await client.IssueTokenAsync(identity, scopes: new [] { CommunicationTokenScope.VoIP });
```


### SMS SDK example (send SMS)


```csharp
     string connectionString = Environment.GetEnvironmentVariable("COMMUNICATION_SERVICES_RESOURCE_ENDPOINT");
     TokenCredential credential = new DefaultAzureCredential();
     
     SmsClient smsClient = new SmsClient(managedIdentityCredential, ResourceEndpoint);
     smsClient.Send(
         from: new PhoneNumber("<leased-phone-number>"),
         to: new PhoneNumber("<to-phone-number>"),
         message: "Hello World via SMS",
         new SendSmsOptions { EnableDeliveryReport = true } // optional
     );
```
