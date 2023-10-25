---
title: Quickstart - Azure confidential ledger client library for .NET 
description: Learn how to use Azure Confidential Ledger using the client library for .NET
author: msmbaldwin
ms.author: mbaldwin
ms.date: 07/15/2022
ms.service: confidential-ledger
ms.topic: quickstart
ms.devlang: csharp
ms.custom: devx-track-csharp, mode-api, devx-track-dotnet
---

# Quickstart: Azure confidential ledger client library for .NET

Get started with the Azure confidential ledger client library for .NET. [Azure confidential ledger](overview.md) is a new and highly secure service for managing sensitive data records. Based on a permissioned blockchain model, Azure confidential ledger offers unique data integrity advantages. These include immutability, making the ledger append-only, and tamper proofing, to ensure all records are kept intact.

 In this quickstart, you learn how to create entries in an Azure confidential ledger using the .NET client library

Azure confidential ledger client library resources:

[API reference documentation](/dotnet/api/overview/azure/security.confidentialledger-readme) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/confidentialledger/Azure.Security.ConfidentialLedger) | [Package (NuGet)](https://www.nuget.org/packages/Azure.Security.ConfidentialLedger/1.0.0)

## Prerequisites

- An Azure subscription - [create one for free](https://azure.microsoft.com/free/dotnet)
- [.NET Core 3.1 SDK or later](https://dotnet.microsoft.com/download/dotnet-core)
- [Azure CLI](/cli/azure/install-azure-cli)

You will also need a running confidential ledger, and a registered user with the `Administrator` privileges. You can create a confidential ledger (and an administrator) using the [Azure portal](quickstart-portal.md), the [Azure CLI](quickstart-cli.md), or [Azure PowerShell](quickstart-powershell.md).

## Setup

### Create new .NET console app

1. In a command shell, run the following command to create a project named `acl-app`:

    ```dotnetcli
    dotnet new console --name acl-app
    ```

1. Change to the newly created *acl-app* directory, and run the following command to build the project:

    ```dotnetcli
    dotnet build
    ```

    The build output should contain no warnings or errors.
    
    ```console
    Build succeeded.
     0 Warning(s)
     0 Error(s)
    ```

### Install the package

Install the Confidential Ledger client library for .NET with [NuGet][client_nuget_package]:

```dotnetcli
dotnet add package Azure.Security.ConfidentialLedger --version 1.0.0
```

For this quickstart, you'll also need to install the Azure SDK client library for Azure Identity:

```dotnetcli
dotnet add package Azure.Identity
```

## Object model

The Azure confidential ledger client library for .NET allows you to create an immutable ledger entry in the service.  The [Code examples](#code-examples) section shows how to create a write to the ledger and retrieve the transaction ID.

## Code examples

### Add directives

Add the following directives to the top of *Program.cs*:

```csharp
using System;
using Azure.Core;
using Azure.Identity;
using Azure.Security.ConfidentialLedger;
using Azure.Security.ConfidentialLedger.Certificate;
```

### Authenticate and create a client

In this quickstart, logged in user is used to authenticate to Azure confidential ledger, which is preferred method for local development.  The name of your confidential ledger is expanded to the key vault URI, in the format "https://\<your-confidential-ledger-name\>.confidential-ledger.azure.com". This example is using ['DefaultAzureCredential()'](/dotnet/api/azure.identity.defaultazurecredential) class from [Azure Identity Library](/dotnet/api/overview/azure/identity-readme), which allows to use the same code across different environments with different options to provide identity. 

```csharp
credential = DefaultAzureCredential()
```

### Write to the confidential ledger

You can now write to the confidential ledger with the [PostLedgerEntry](/dotnet/api/azure.security.confidentialledger.confidentialledgerclient.postledgerentry#azure-security-confidentialledger-confidentialledgerclient-postledgerentry\(azure-core-requestcontent-system-string-system-boolean-azure-requestcontext\)) method.

```csharp
Operation postOperation = ledgerClient.PostLedgerEntry(
    waitUntil: WaitUntil.Completed,
    RequestContent.Create(
        new { contents = "Hello world!" }));

```

### Get transaction ID

The [PostLedgerEntry](/dotnet/api/azure.security.confidentialledger.confidentialledgerclient.postledgerentry) method returns an object that contains the transaction of the entry you just wrote to the confidential ledger. To get the transaction ID, access the "Id" value:

```csharp
string transactionId = postOperation.Id;
Console.WriteLine($"Appended transaction with Id: {transactionId}");
```

### Read from the confidential ledger

With a transaction ID, you can also read from the confidential ledger using the [GetLedgerEntry](/dotnet/api/azure.security.confidentialledger.confidentialledgerclient.getledgerentry) method:

```csharp
Response ledgerResponse = ledgerClient.GetLedgerEntry(transactionId, collectionId);

string entryContents = JsonDocument.Parse(ledgerResponse.Content)
    .RootElement
    .GetProperty("entry")
    .GetProperty("contents")
    .GetString();

Console.WriteLine(entryContents);
```

## Test and verify

In the console directly, execute the following command to run the app.

```csharp
dotnet run
```

## Sample code

```csharp
using System;
using Azure.Core;
using Azure.Identity;
using Azure.Security.ConfidentialLedger;
using Azure.Security.ConfidentialLedger.Certificate;
    
namespace acl_app
{
    class Program
    {
        static Task Main(string[] args)
        {

            // Replace with the name of your confidential ledger

            const string ledgerName = "myLedger";
            var ledgerUri = $"https://{ledgerName}.confidential-ledger.azure.com";

            // Create a confidential ledger client using the ledger URI and DefaultAzureCredential

            var ledgerClient = new ConfidentialLedgerClient(new Uri(ledgerUri), new DefaultAzureCredential());

            // Write to the ledger

            Operation postOperation = ledgerClient.PostLedgerEntry(
                waitUntil: WaitUntil.Completed,
                RequestContent.Create(
                    new { contents = "Hello world!" }));
            
            // Access the transaction ID of the ledger write

            string transactionId = postOperation.Id;
            Console.WriteLine($"Appended transaction with Id: {transactionId}");


            // Use the transaction ID to read from the ledger

            Response ledgerResponse = ledgerClient.GetLedgerEntry(transactionId, collectionId);

            string entryContents = JsonDocument.Parse(ledgerResponse.Content)
                .RootElement
                .GetProperty("entry")
                .GetProperty("contents")
                .GetString();

            Console.WriteLine(entryContents);

        }
    }
}
```

## Next steps

To learn more about Azure confidential ledger and how to integrate it with your apps, see the following articles:

- [Overview of Microsoft Azure confidential ledger](overview.md)
- [Azure confidential ledger client library source code](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/confidentialledger/Azure.Security.ConfidentialLedger)
- [Package (NuGet)](https://www.nuget.org/packages/Azure.Security.ConfidentialLedger/1.0.0)
