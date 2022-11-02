---
title: Create an Azure Active Directory Service Principal from the Azure CLI
titleSuffix: An Azure Communication Services quickstart
description: In this quick start we'll create an application and service principal to authenticate with Azure Communication Services.
services: azure-communication-services
author: jbeauregardb
ms.service: azure-communication-services
ms.subservice: identity
ms.topic: quickstart
ms.date: 06/30/2021
ms.author: jbeauregardb
ms.reviewer: mikben
ms.custom: mode-api, devx-track-azurecli 
ms.devlang: azurecli
---

# Quickstart: Authenticate using Azure Active Directory (Azure CLI)

The Azure Identity SDK provides Azure Active Directory (Azure AD) token authentication support for Azure SDK packages. The latest versions of the Azure Communication Services SDKs for .NET, Java, Python, and JavaScript integrate with the Azure Identity library to provide a simple and secure means to acquire an OAuth 2.0 token for authorization of Azure Communication Services requests.

An advantage of the Azure Identity SDK is that it enables you to use the same code to authenticate across multiple services whether your application is running in the development environment or in Azure. 

The Azure Identity SDK can authenticate with many methods. In Development we'll be using a service principal tied to a registered application, with credentials stored in Environnment Variables this is suitable for testing and development.

## Prerequisites

 - Azure CLI. [Installation guide](/cli/azure/install-azure-cli)
 - An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free)

## Setting Up

When using Active Directory for other Azure Resources, you should be using Managed identities. To learn how to enable managed identities for Azure Resources, see one of these articles:

- [Azure portal](../../../active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm.md)
- [Azure PowerShell](../../../active-directory/managed-identities-azure-resources/qs-configure-powershell-windows-vm.md)
- [Azure CLI](../../../active-directory/managed-identities-azure-resources/qs-configure-cli-windows-vm.md)
- [Azure Resource Manager template](../../../active-directory/managed-identities-azure-resources/qs-configure-template-windows-vm.md)
- [Azure Resource Manager SDKs](../../../active-directory/managed-identities-azure-resources/qs-configure-sdk-windows-vm.md)
- [App services](../../../app-service/overview-managed-identity.md)

## Authenticate a registered application in the development environment

If your development environment does not support single sign-on or login via a web browser, then you can use a registered application to authenticate from the development environment.

### Creating an Azure Active Directory Registered Application

To create a registered application from the Azure CLI, you need to be logged in to the Azure account where you want the operations to take place. To do this, you can use the `az login` command and enter your credentials in the browser. Once you are logged in to your Azure account from the CLI, we can call the `az ad sp create-for-rbac` command to create the registered application and service principal.

The following examples uses the Azure CLI to create a new registered application

```azurecli
az ad sp create-for-rbac --name <application-name> --role Contributor --scopes /subscriptions/<subscription-id>
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

The Azure Identity SDK reads values from three environment variables at runtime to authenticate the application. The following table describes the value to set for each environment variable.

| Environment variable  | Value                                    |
| --------------------- | ---------------------------------------- |
| `AZURE_CLIENT_ID`     | `appId` value from the generated JSON    |
| `AZURE_TENANT_ID`     | `tenant` value from the generated JSON   |
| `AZURE_CLIENT_SECRET` | `password` value from the generated JSON |

> [!IMPORTANT]
> After you set the environment variables, close and re-open your console window. If you are using Visual Studio or another development environment, you may need to restart it in order for it to register the new environment variables.

Once these variables have been set, you should be able to use the DefaultAzureCredential object in your code to authenticate to the service client of your choice.

## Next steps

> [!div class="nextstepaction"]
> [Learn about authentication](../../concepts/authentication.md)

You may also want to:

- [Learn more about Azure Identity library](/dotnet/api/overview/azure/identity-readme)
