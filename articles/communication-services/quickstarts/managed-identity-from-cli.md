---
title: Create an Azure Active Directory managed identity application from the Azure CLI
titleSuffix: An Azure Communication Services quickstart
description: Managed identities let you authorize Azure Communication Services access from applications running in Azure VMs, function apps, and other resources. This quickstart is focused on managing identity using the Azure CLI.
services: azure-communication-services
author: jbeauregardb
ms.service: azure-communication-services
ms.topic: how-to
ms.date: 03/10/2021
ms.author: jbeauregardb
ms.reviewer: mikben
---

# Authorize access with managed identity to your communication resource in your development environment

The Azure Identity client library provides Azure Active Directory (Azure AD) token authentication support for the Azure SDK. The latest versions of the Azure Communication Services client libraries for .NET, Java, Python, and JavaScript integrate with the Azure Identity library to provide a simple and secure means to acquire an OAuth 2.0 token for authorization of Azure Communication Services requests.

An advantage of the Azure Identity client library is that it enables you to use the same code to authenticate across multiple services whether your application is running in the development environment or in Azure. The Azure Identity client library authenticates a security principal. When your code is running in Azure, the security principal is a managed identity for Azure resources. In the development environment, the managed identity does not exist, so the client library authenticates either the user or a registered application for testing purposes.

## Prerequisites

 - Azure CLI. [Installation guide](/cli/azure/install-azure-cli)
 - An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free)

## Setting Up

Managed identities should be enabled on the Azure resources that you're authorizing. To learn how to enable managed identities for Azure Resources, see one of these articles:

- [Azure portal](../../active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm.md)
- [Azure PowerShell](../../active-directory/managed-identities-azure-resources/qs-configure-powershell-windows-vm.md)
- [Azure CLI](../../active-directory/managed-identities-azure-resources/qs-configure-cli-windows-vm.md)
- [Azure Resource Manager template](../../active-directory/managed-identities-azure-resources/qs-configure-template-windows-vm.md)
- [Azure Resource Manager client libraries](../../active-directory/managed-identities-azure-resources/qs-configure-sdk-windows-vm.md)
- [App services](../../app-service/overview-managed-identity.md)

## Authenticate a registered application in the development environment

If your development environment does not support single sign-on or login via a web browser, then you can use a registered application to authenticate from the development environment.

### Creating an Azure Active Directory Registered Application

To create a registered application from the Azure CLI, you need to be logged in to the Azure account where you want the operations to take place. To do this, you can use the `az login` command and enter your credentials in the browser. Once you are logged in to your Azure account from the CLI, we can call the `az ad sp create-for-rbac` command to create the registered application.

The following examples uses the Azure CLI to create a new registered application

```azurecli
az ad sp create-for-rbac --name <application-name> 
```

The `az ad sp create-for-rbac` command will return a list of service principal properties in JSON format. Copy these values so that you can use them to create the necessary environment variables in the next step.

```json
{
    "appId": "generated-app-ID",
    "displayName": "service-principal-name",
    "name": "http://service-principal-uri",
    "password": "generated-password",
    "tenant": "tenant-ID"
}
```
> [!IMPORTANT]
> Azure role assignments may take a few minutes to propagate.

#### Set environment variables

The Azure Identity client library reads values from three environment variables at runtime to authenticate the application. The following table describes the value to set for each environment variable.

|Environment variable|Value
|-|-
|`AZURE_CLIENT_ID`|`appId` value from the generated JSON 
|`AZURE_TENANT_ID`|`tenant` value from the generated JSON
|`AZURE_CLIENT_SECRET`|`password` value from the generated JSON

> [!IMPORTANT]
> After you set the environment variables, close and re-open your console window. If you are using Visual Studio or another development environment, you may need to restart it in order for it to register the new environment variables.


## Next steps

> [!div class="nextstepaction"]
> [Learn about authentication](../concepts/authentication.md)

You may also want to:

- [Learn more about Azure Identity library](/dotnet/api/overview/azure/identity-readme)