---
title: Use managed identities in Communication Services (.NET)
titleSuffix: An Azure Communication Services quickstart
description: Managed identities let you authorize Azure Communication Services access from applications running in Azure VMs, function apps, and other resources.
services: azure-communication-services
author: stefang931
ms.service: azure-communication-services
ms.topic: how-to
ms.date: 12/04/2020
ms.author: gistefan
ms.reviewer: mikben
---

# Use managed identities (.NET)

Get started with Azure Communication Services by using managed identities in .NET. The Communication Services Administration and SMS client libraries support Azure Active Directory (Azure AD) authentication with [managed identities for Azure resources](../../active-directory/managed-identities-azure-resources/overview.md).

This quickstart shows you how to authorize access to the Administration and SMS client libraries from an Azure environment that supports managed identities. It also describes how to test your code in a development environment.

## Prerequisites

 - An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free)
 - An active Communication Services resource and connection string. [Create a Communication Services resource](./create-communication-resource.md?pivots=platform-azp&tabs=windows).

## Setting Up

### Enable managed identities on a virtual machine or App service

Managed identities should be enabled on the Azure resources that you're authorizing. To learn how to enable managed identities for Azure Resources, see one of these articles:

- [Azure portal](../../active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm.md)
- [Azure PowerShell](../../active-directory/managed-identities-azure-resources/qs-configure-powershell-windows-vm.md)
- [Azure CLI](../../active-directory/managed-identities-azure-resources/qs-configure-cli-windows-vm.md)
- [Azure Resource Manager template](../../active-directory/managed-identities-azure-resources/qs-configure-template-windows-vm.md)
- [Azure Resource Manager client libraries](../../active-directory/managed-identities-azure-resources/qs-configure-sdk-windows-vm.md)
- [App services](../../app-service/overview-managed-identity.md)

#### Assign Azure roles with the Azure portal

1. Navigate to the Azure portal.
1. Navigate to the Azure Communication Service resource.
1. Navigate to Access Control (IAM) menu -> + Add -> Add role assignment.
1. Select the role "Contributor" (this is the only supported role).
1. Select "User assigned managed identity" (or a "System assigned managed identity") then select the desired identity. Save your selection.

![Managed identity role](media/managed-identity-assign-role.png)

#### Assign Azure roles with PowerShell

To assign roles and permissions using PowerShell, see [Add or remove Azure role assignments using Azure PowerShell](../../../articles/role-based-access-control/role-assignments-powershell.md)

## Add managed identity to your Communication Services solution

### Install the client library packages

```console
dotnet add package Azure.Communication.Identity
dotnet add package Azure.Communication.Configuration
dotnet add package Azure.Communication.Sms
dotnet add package Azure.Identity
```

### Use the client library packages

Add the following `using` directives to your code to use the Azure Identity and Azure Storage client libraries.

```csharp
using Azure.Identity;
using Azure.Communication.Identity;
using Azure.Communication.Configuration;
using Azure.Communication.Sms;
```

The examples below are using the [DefaultAzureCredential](/dotnet/api/azure.identity.defaultazurecredential). This credential is suitable for production and development environments.

### Create an identity and issue a token

The following code example shows how to create a service client object with Azure Active Directory tokens, then use the client to issue a token for a new user:

```csharp
     public async Task<Response<CommunicationUserToken>> CreateIdentityAndIssueTokenAsync(Uri resourceEndpoint) 
     {
          TokenCredential credential = new DefaultAzureCredential();
     
          var client = new CommunicationIdentityClient(resourceEndpoint, credential);
          var identityResponse = await client.CreateUserAsync();
     
          var tokenResponse = await client.IssueTokenAsync(identity, scopes: new [] { CommunicationTokenScope.VoIP });

          return tokenResponse;
     }
```

### Send an SMS with Azure Active Directory tokens

The following code example shows how to create a service client object with Azure Active Directory tokens, then use the client to send an SMS message:

```csharp

     public async Task SendSmsAsync(Uri resourceEndpoint, PhoneNumber from, PhoneNumber to, string message)
     {
          TokenCredential credential = new DefaultAzureCredential();
     
          SmsClient smsClient = new SmsClient(resourceEndpoint, credential);
          smsClient.Send(
               from: from,
               to: to,
               message: message,
               new SendSmsOptions { EnableDeliveryReport = true } // optional
          );
     }
```

## Next steps

> [!div class="nextstepaction"]
> [Learn about authentication](../concepts/authentication.md)

You may also want to:

- [Learn more about Azure role-based access control](../../../articles/role-based-access-control/index.yml)
- [Learn more about Azure identity library for .NET](/dotnet/api/overview/azure/identity-readme)
- [Creating user access tokens](../quickstarts/access-tokens.md)
- [Send an SMS message](../quickstarts/telephony-sms/send.md)
- [Learn more about SMS](../concepts/telephony-sms/concepts.md)