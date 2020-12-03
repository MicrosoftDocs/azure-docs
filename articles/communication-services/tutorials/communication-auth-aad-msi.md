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

Administration and SMS APIs support Azure Active Directory (Azure AD) authentication with [managed identities for Azure resources](../../active-directory/managed-identities-azure-resources/overview.md). Managed identities for Azure resources can authorize access to blob and queue data using Azure AD credentials from applications running in Azure virtual machines (VMs), function apps, virtual machine scale sets, and other services. By using managed identities for Azure resources together with Azure AD authentication, you can avoid storing credentials with your applications that run in the cloud.  

This article shows how to authorize access to Administration and SMS APIs from an Azure VM using managed identities for Azure Resources. It also describes how to test your code in the development environment.

## Enable managed identities on an VM or App service

Before you can use managed identities for Azure Resources to authorize access to blobs and queues from your VM, you must first enable managed identities for Azure Resources on the VM. To learn how to enable managed identities for Azure Resources, see one of these articles:

- [Azure portal](../../active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm.md)
- [Azure PowerShell](../../active-directory/managed-identities-azure-resources/qs-configure-powershell-windows-vm.md)
- [Azure CLI](../../active-directory/managed-identities-azure-resources/qs-configure-cli-windows-vm.md)
- [Azure Resource Manager template](../../active-directory/managed-identities-azure-resources/qs-configure-template-windows-vm.md)
- [Azure Resource Manager client libraries](../../active-directory/managed-identities-azure-resources/qs-configure-sdk-windows-vm.md)
- [App services](../../app-service/overview-managed-identity.md)

### Assign Azure roles for access to APIs

When an Azure AD security principal attempts to access an API, that security principal must have permissions to the resource. Whether the security principal is a managed identity in Azure or an Azure AD user account running code in the development environment, the security principal must be assigned an Azure role that grants access to blob or queue data in Azure Storage. For information about assigning permissions via Azure RBAC.

TODO: add examples in portal + commandline

## Authenticate with the Azure Identity library

The Azure Identity client library provides Azure Azure AD token authentication support for the [Azure SDK](https://github.com/Azure/azure-sdk). The latest versions of the ... integrate with the Azure Identity library to provide a simple and secure means to acquire an OAuth 2.0 token for authorization of Azure Storage requests.

(see if that is the case ^^)

An advantage of the Azure Identity client library is that it enables you to use the same code to authenticate whether your application is running in the development environment or in Azure. The Azure Identity client library for .NET authenticates a security principal. When your code is running in Azure, the security principal is a managed identity for Azure resources. In the development environment, the managed identity does not exist, so the client library authenticates either the user or a service principal for testing purposes.

After authenticating, the Azure Identity client library gets a token credential. This token credential is then encapsulated in the service client object that you create to perform operations against Azure Storage. The library handles this for you seamlessly by getting the appropriate token credential.

For more information about the Azure Identity client library for .NET, see [Azure Identity client library for .NET](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/identity/Azure.Identity). For reference documentation for the Azure Identity client library, see [Azure.Identity Namespace](/dotnet/api/azure.identity).

### Authenticate the user in the development environment

When your code is running in the development environment, authentication may be handled automatically, or it may require a browser login, depending on which tools you're using. For example, Microsoft Visual Studio supports single sign-on (SSO), so that the active Azure AD user account is automatically used for authentication. For more information about SSO, see [Single sign-on to applications](../../active-directory/manage-apps/what-is-single-sign-on.md).

Other development tools may prompt you to login via a web browser.

## .NET code example

TODO: Add code example

