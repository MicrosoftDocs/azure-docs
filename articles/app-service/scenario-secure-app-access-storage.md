---
title: "Tutorial - .NET Web app accesses storage by using managed identities | Azure"
description: In this tutorial, you learn how to access Azure Storage for a .NET app by using managed identities.
services: storage, app-service-web
author: rwike77
manager: CelesteDG
ms.service: app-service
ms.topic: tutorial
ms.workload: identity
ms.date: 07/31/2023
ms.author: ryanwi
ms.reviewer: stsoneff
ms.devlang: csharp, azurecli
ms.custom: azureday1, devx-track-azurecli, devx-track-azurepowershell, subject-rbac-steps, devx-track-dotnet, AppServiceIdentity
ms.subservice: web-apps
#Customer intent: As an application developer, I want to learn how to access Azure Storage for an app by using managed identities.
---

# Tutorial: Access Azure services from a .NET web app

[!INCLUDE [tutorial-content-above-code](./includes/tutorial-dotnet-storage-managed-identity/introduction.md)]

## Access Blob Storage


The [DefaultAzureCredential](/dotnet/api/azure.identity.defaultazurecredential) class is used to get a token credential for your code to authorize requests to Azure Storage. Create an instance of the [DefaultAzureCredential](/dotnet/api/azure.identity.defaultazurecredential) class, which uses the managed identity to fetch tokens and attach them to the service client. The following code example gets the authenticated token credential and uses it to create a service client object, which uploads a new blob.

To see this code as part of a sample application, see the [sample on GitHub](https://github.com/Azure-Samples/ms-identity-easyauth-dotnet-storage-graphapi/tree/main/1-WebApp-storage-managed-identity).

### Install client library packages

Install the [Blob Storage NuGet package](https://www.nuget.org/packages/Azure.Storage.Blobs/) to work with Blob Storage and the [Azure Identity client library for .NET NuGet package](https://www.nuget.org/packages/Azure.Identity/) to authenticate with Azure AD credentials. Install the client libraries by using the .NET Core command-line interface or the Package Manager Console in Visual Studio.

#### .NET Core command-line

1. Open a command line, and switch to the directory that contains your project file.

1. Run the install commands.

    ```dotnetcli
    dotnet add package Azure.Storage.Blobs
    
    dotnet add package Azure.Identity
    ```

#### Package Manager Console
1. Open the project or solution in Visual Studio, and open the console by using the **Tools** > **NuGet Package Manager** > **Package Manager Console** command.

1. Run the install commands.
    ```powershell
    Install-Package Azure.Storage.Blobs
    
    Install-Package Azure.Identity
    ```

## .NET example

```csharp
using System;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Text;
using System.IO;
using Azure.Identity;

// Some code omitted for brevity.

static public async Task UploadBlob(string accountName, string containerName, string blobName, string blobContents)
{
    // Construct the blob container endpoint from the arguments.
    string containerEndpoint = string.Format("https://{0}.blob.core.windows.net/{1}",
                                                accountName,
                                                containerName);

    // Get a credential and create a client object for the blob container.
    BlobContainerClient containerClient = new BlobContainerClient(new Uri(containerEndpoint),
                                                                    new DefaultAzureCredential());

    try
    {
        // Create the container if it does not exist.
        await containerClient.CreateIfNotExistsAsync();

        // Upload text to a new block blob.
        byte[] byteArray = Encoding.ASCII.GetBytes(blobContents);

        using (MemoryStream stream = new MemoryStream(byteArray))
        {
            await containerClient.UploadBlobAsync(blobName, stream);
        }
    }
    catch (Exception e)
    {
        throw e;
    }
}
```

[!INCLUDE [tutorial-clean-up-steps](./includes/tutorial-cleanup.md)]

[!INCLUDE [tutorial-content-below-code](./includes/tutorial-dotnet-storage-managed-identity/cleanup.md)]
