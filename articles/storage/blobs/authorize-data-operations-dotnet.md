---
title: Authorize access to blob data with Azure Active Directory from .NET
titleSuffix: Azure Storage
description: 
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 02/06/2023
ms.author: tamram
ms.reviewer: ozgun
ms.subservice: blobs
---

# Authorize access to blob data with Azure Active Directory from .NET

To authorize with Azure AD, you'll need to use a security principal. The type of security principal you need depends on where your application runs. Use this table as a guide.

## Types of security principals for Azure AD auth

| Where the application runs | Security principal | Guidance |
| --- | --- | --- |
| Local machine (developing and testing) | Service principal | In this method, dedicated **application service principal** objects are set up using the App registration process for use during local development. The identity of the service principal is then stored as environment variables to be accessed by the app when it's run in local development.<br><br>This method allows you to assign the specific resource permissions needed by the app to the service principal objects used by developers during local development. This approach ensures the application only has access to the specific resources it needs and replicates the permissions the app will have in production.<br><br>The downside of this approach is the need to create separate service principal objects for each developer that works on an application.<br><br>[Authorize access using developer service principals](/dotnet/azure/sdk/authentication-local-development-service-principal?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json) |
| Local machine (developing and testing) | User identity | In this method, a developer must be signed-in to Azure from either Visual Studio, the Azure Tools extension for VS Code, the Azure CLI, or Azure PowerShell on their local workstation. The application then can access the developer's credentials from the credential store and use those credentials to access Azure resources from the app.<br><br>This method has the advantage of easier setup since a developer only needs to sign in to their Azure account from Visual Studio, VS Code or the Azure CLI. The disadvantage of this approach is that the developer's account likely has more permissions than required by the application, therefore not properly replicating the permissions the app will run with in production.<br><br>[Authorize access using developer credentials](/dotnet/azure/sdk/authentication-local-development-dev-accounts?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json) | 
| Hosted in Azure | Managed identity | Apps hosted in Azure should use a **managed identity service principal**. Managed identities are designed to represent the identity of an app hosted in Azure and can only be used with Azure hosted apps.<br><br>For example, a .NET web app hosted in Azure App Service would be assigned a managed identity. The managed identity assigned to the app would then be used to authenticate the app to other Azure services.<br><br>[Authorize access from Azure-hosted apps using a managed identity](/dotnet/azure/sdk/authentication-azure-hosted-apps?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json) |
| Hosted outside of Azure (for example, on-premises apps) | Service principal | Apps hosted outside of Azure (for example on-premises apps) that need to connect to Azure services should use an **application service principal**. An application service principal represents the identity of the app in Azure and is created through the application registration process.<br><br>For example, consider a .NET web app hosted on-premises that makes use of Azure Blob Storage. You would create an application service principal for the app using the App registration process. The `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, and `AZURE_CLIENT_SECRET` would all be stored as environment variables to be read by the application at runtime and allow the app to authenticate to Azure using the application service principal.<br><br>[Authorize access from on-premises apps using an application service principal](/dotnet/azure/sdk/authentication-on-premises-apps?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json) |

The easiest way to authorize access and connect to Blob Storage is to obtain an OAuth token by creating a [DefaultAzureCredential](/dotnet/api/azure.identity.defaultazurecredential) instance. You can then use that credential to create a [BlobServiceClient](/dotnet/api/azure.storage.blobs.blobserviceclient) object.

```csharp
public static void GetBlobServiceClient(ref BlobServiceClient blobServiceClient, string accountName)
{
    TokenCredential credential = new DefaultAzureCredential();

    string blobUri = "https://" + accountName + ".blob.core.windows.net";

    blobServiceClient = new BlobServiceClient(new Uri(blobUri), credential);          
}
```

If you know exactly which credential type you'll use to authenticate users, you can obtain an OAuth token by using other classes in the [Azure Identity client library for .NET](/dotnet/api/overview/azure/identity-readme). These classes derive from the [TokenCredential](/dotnet/api/azure.core.tokencredential) class.

## See also

ka;lsdfa