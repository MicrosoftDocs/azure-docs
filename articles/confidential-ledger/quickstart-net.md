---
title: Quickstart - Azure Confidential Ledger client library for .NET (version 4)
description: Learn how to use Azure Confidential Ledger using the client library for .NET (SDK v4)
author: msmbaldwin
ms.author: mbaldwin
ms.date: 09/23/2020
ms.service: key-vault
ms.subservice: secrets
ms.topic: quickstart
ms.devlang: csharp
ms.custom: devx-track-csharp, mode-api
---

# Quickstart: Azure confidential ledger client library for .NET

Get started with the Azure confidential ledger client library for .NET. [Azure confidential ledger](overview.md) is a new and highly secure service for managing sensitive data records. Based on a permissioned blockchain model, Azure confidential ledger offers unique data integrity advantages. These include immutability, making the ledger append-only, and tamper proofing, to ensure all records are kept intact.

 In this quickstart, you learn how to create entries in an Azure confidential ledger using the .NET client library

Azure confidential ledger client library resources:

[API reference documentation](/dotnet/api/overview/azure/security.confidentialledger-readme-pre) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/Azure.Security.ConfidentialLedger_1.0.0-beta.2/sdk/confidentialledger/Azure.Security.ConfidentialLedger) | [Package (NuGet)](https://www.nuget.org/packages?q=Azure.Security.ConfidentialLedger)

## Prerequisites

- An Azure subscription - [create one for free](https://azure.microsoft.com/free/dotnet)
- [.NET Core 3.1 SDK or later](https://dotnet.microsoft.com/download/dotnet-core)
- [Azure CLI](/cli/azure/install-azure-cli)

You will also need an running confidential ledger, and a registered user with the `Administrator` privileges. You can create a confidential ledger (and an administrator) using the [Azure portal](quick-portal.md), the [Azure CLI](quick-cli.md), or [Azure PowerShell](quick-powershell.md).

## Setup

### Create new .NET console app

1. In a command shell, run the following command to create a project named `acl-quickstart-app`:

    ```dotnetcli
    dotnet new console --name acl-quickstart-app
    ```

1. Change to the newly created *acl-quickstart-app* directory, and run the following command to build the project:

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
dotnet add package Azure.Security.ConfidentialLedger --prerelease
```

### Authenticate the client

#### Using Azure Active Directory

This document demonstrates using [DefaultAzureCredential][default_cred_ref] to authenticate to the Confidential Ledger via Azure Active Directory. However, any of the credentials offered by the [Azure.Identity][azure_identity] will be accepted.  See the [Azure.Identity][azure_identity] documentation for more information about other credentials.

#### Using a client certificate

As an alternative to Azure Active Directory, clients may choose to use a client certificate to authenticate via mutual TLS.

### Create a client

`DefaultAzureCredential` will automatically handle most Azure SDK client scenarios. To get started, set environment variables for the AAD identity registered with your Confidential Ledger.
```bash
export AZURE_CLIENT_ID="generated app id"
export AZURE_CLIENT_SECRET="random password"
export AZURE_TENANT_ID="tenant id"
```
Then, `DefaultAzureCredential` will be able to authenticate the `ConfidentialLedgerClient`.

Constructing the client also requires your Confidential Ledger's URL and id, which you can get from the Azure CLI or the Azure Portal.  When you have retrieved those values, please replace instances of `"my-ledger-id"` and `"https://my-ledger-url.confidential-ledger.azure.com"` in the examples below

Because Confidential Ledgers use self-signed certificates securely generated and stored in an SGX enclave, the certificate for each Confidential Ledger  must first be retrieved from the Confidential Ledger Identity Service.

```C# Snippet:GetIdentity
Uri identityServiceEndpoint = new("https://identity.confidential-ledger.core.azure.com") // The hostname from the identityServiceUri
var identityClient = new ConfidentialLedgerIdentityServiceClient(identityServiceEndpoint);

// Get the ledger's  TLS certificate for our ledger.
string ledgerId = "<the ledger id>"; // ex. "my-ledger" from "https://my-ledger.eastus.cloudapp.azure.com"
Response response = identityClient.GetLedgerIdentity(ledgerId);
X509Certificate2 ledgerTlsCert = ConfidentialLedgerIdentityServiceClient.ParseCertificate(response);
```

Now we can construct the `ConfidentialLedgerClient` with a transport configuration that trusts the `ledgerTlsCert`.

```C# Snippet:CreateClient
// Create a certificate chain rooted with our TLS cert.
X509Chain certificateChain = new();
certificateChain.ChainPolicy.RevocationMode = X509RevocationMode.NoCheck;
certificateChain.ChainPolicy.RevocationFlag = X509RevocationFlag.ExcludeRoot;
certificateChain.ChainPolicy.VerificationFlags = X509VerificationFlags.AllowUnknownCertificateAuthority;
certificateChain.ChainPolicy.VerificationTime = DateTime.Now;
certificateChain.ChainPolicy.UrlRetrievalTimeout = new TimeSpan(0, 0, 0);
certificateChain.ChainPolicy.ExtraStore.Add(ledgerTlsCert);

var f = certificateChain.Build(ledgerTlsCert);

// Define a validation function to ensure that the ledger certificate is trusted by the ledger identity TLS certificate.
bool CertValidationCheck(HttpRequestMessage httpRequestMessage, X509Certificate2 cert, X509Chain x509Chain, SslPolicyErrors sslPolicyErrors)
{
    bool isChainValid = certificateChain.Build(cert);
    if (!isChainValid) return false;

    var isCertSignedByTheTlsCert = certificateChain.ChainElements.Cast<X509ChainElement>()
        .Any(x => x.Certificate.Thumbprint == ledgerTlsCert.Thumbprint);
    return isCertSignedByTheTlsCert;
}

// Create an HttpClientHandler to use our certValidationCheck function.
var httpHandler = new HttpClientHandler();
httpHandler.ServerCertificateCustomValidationCallback = CertValidationCheck;

// Create the ledger client using a transport that uses our custom ServerCertificateCustomValidationCallback.
var options = new ConfidentialLedgerClientOptions { Transport = new HttpClientTransport(httpHandler) };
var ledgerClient = new ConfidentialLedgerClient(TestEnvironment.ConfidentialLedgerUrl, new DefaultAzureCredential(), options);
```

## Key concepts

### Ledger entries

Every write to Confidential Ledger generates an immutable ledger entry in the service. Writes are uniquely identified by transaction ids that increment with each write.

```C# Snippet:AppendToLedger
PostLedgerEntryOperation postOperation = ledgerClient.PostLedgerEntry(
    RequestContent.Create(
        new { contents = "Hello world!" }),
    waitForCompletion: true);

string transactionId = postOperation.Id;
Console.WriteLine($"Appended transaction with Id: {transactionId}");
```

Since Confidential Ledger is a distributed system, rare transient failures may cause writes to be lost. For entries that must be preserved, it is advisable to verify that the write became durable. Note: It may be necessary to call `GetTransactionStatus` multiple times until it returns a "Committed" status. However, when calling `PostLedgerEntry`, a successful result indicates that the status is "Committed".

```C# Snippet:GetStatus
Response statusResponse = ledgerClient.GetTransactionStatus(transactionId);

string status = JsonDocument.Parse(statusResponse.Content)
    .RootElement
    .GetProperty("state")
    .GetString();

Console.WriteLine($"Transaction status: {status}");

// Wait for the entry to be committed
while (status == "Pending")
{
    statusResponse = ledgerClient.GetTransactionStatus(transactionId);
    status = JsonDocument.Parse(statusResponse.Content)
        .RootElement
        .GetProperty("state")
        .GetString();
}

Console.WriteLine($"Transaction status: {status}");
```

#### Receipts

State changes to the Confidential Ledger are saved in a data structure called a Merkle tree. To cryptographically verify that writes were correctly saved, a Merkle proof, or receipt, can be retrieved for any transaction id.

```C# Snippet:GetReceipt
Response receiptResponse = ledgerClient.GetReceipt(transactionId);
string receiptJson = new StreamReader(receiptResponse.ContentStream).ReadToEnd();

Console.WriteLine(receiptJson);
```

#### Sub-ledgers

While most use cases will involve one ledger, we provide the sub-ledger feature in case different logical groups of data need to be stored in the same Confidential Ledger.

```C# Snippet:SubLedger
ledgerClient.PostLedgerEntry(
    RequestContent.Create(
        new { contents = "Hello from Chris!", subLedgerId = "Chris' messages" }),
    waitForCompletion: true);

ledgerClient.PostLedgerEntry(
    RequestContent.Create(
        new { contents = "Hello from Allison!", subLedgerId = "Allison's messages" }),
    waitForCompletion: true);
```

When no sub-ledger id is specified on method calls, the Confidential Ledger service will assume a constant, service-determined sub-ledger id.

```C# Snippet:NoSubLedgerId
Response postResponse = ledgerClient.PostLedgerEntry(
    RequestContent.Create(
        new { contents = "Hello world!" }),
    waitForCompletion: true);
string transactionId = postOperation.Id;
string subLedgerId = "subledger:0";

// Provide both the transactionId and subLedgerId.
Response getBySubledgerResponse = ledgerClient.GetLedgerEntry(transactionId,  subLedgerId);

// Try until the entry is available.
bool loaded = false;
JsonElement element = default;
string contents = null;
while (!loaded)
{
    loaded = JsonDocument.Parse(getBySubledgerResponse.Content)
        .RootElement
        .TryGetProperty("entry", out element);
    if (loaded)
    {
        contents = element.GetProperty("contents").GetString();
    }
    else
    {
        getBySubledgerResponse = ledgerClient.GetLedgerEntry(transactionId, subLedgerId);
    }
}

Console.WriteLine(contents); // "Hello world!"

// Now just provide the transactionId.
getBySubledgerResponse = ledgerClient.GetLedgerEntry(transactionId);

string subLedgerId2 = JsonDocument.Parse(getBySubledgerResponse.Content)
    .RootElement
    .GetProperty("entry")
    .GetProperty("subLedgerId")
    .GetString();

Console.WriteLine($"{subLedgerId} == {subLedgerId2}");
```

Ledger entries are retrieved from sub-ledgers. When a transaction id is specified, the returned value is the value contained in the specified sub-ledger at the point in time identified by the transaction id. If no transaction id is specified, the latest available value is returned.

```C# Snippet:GetEnteryWithNoTransactionId
PostLedgerEntryOperation firstPostOperation = ledgerClient.PostLedgerEntry(
    RequestContent.Create(new { contents = "Hello world 0" }),
    waitForCompletion: true);
ledgerClient.PostLedgerEntry(
    RequestContent.Create(new { contents = "Hello world 1" }),
    waitForCompletion: true);
PostLedgerEntryOperation subLedgerPostOperation = ledgerClient.PostLedgerEntry(
    RequestContent.Create(new { contents = "Hello world sub-ledger 0" }),
    "my sub-ledger",
    waitForCompletion: true);
ledgerClient.PostLedgerEntry(
    RequestContent.Create(new { contents = "Hello world sub-ledger 1" }),
    "my sub-ledger",
    waitForCompletion: true);

string transactionId = firstPostOperation.Id;

// Wait for the entry to be committed
status = "Pending";
while (status == "Pending")
{
    statusResponse = ledgerClient.GetTransactionStatus(transactionId);
    status = JsonDocument.Parse(statusResponse.Content)
        .RootElement
        .GetProperty("state")
        .GetString();
}

// The ledger entry written at the transactionId in firstResponse is retrieved from the default sub-ledger.
Response getResponse = ledgerClient.GetLedgerEntry(transactionId);

// Try until the entry is available.
loaded = false;
element = default;
contents = null;
while (!loaded)
{
    loaded = JsonDocument.Parse(getResponse.Content)
        .RootElement
        .TryGetProperty("entry", out element);
    if (loaded)
    {
        contents = element.GetProperty("contents").GetString();
    }
    else
    {
        getResponse = ledgerClient.GetLedgerEntry(transactionId, subLedgerId);
    }
}

string firstEntryContents = JsonDocument.Parse(getResponse.Content)
    .RootElement
    .GetProperty("entry")
    .GetProperty("contents")
    .GetString();

Console.WriteLine(firstEntryContents); // "Hello world 0"

// This will return the latest entry available in the default sub-ledger.
getResponse = ledgerClient.GetCurrentLedgerEntry();

// Try until the entry is available.
loaded = false;
element = default;
string latestDefaultSubLedger = null;
while (!loaded)
{
    loaded = JsonDocument.Parse(getResponse.Content)
        .RootElement
        .TryGetProperty("contents", out element);
    if (loaded)
    {
        latestDefaultSubLedger = element.GetString();
    }
    else
    {
        getResponse = ledgerClient.GetCurrentLedgerEntry();
    }
}

Console.WriteLine($"The latest ledger entry from the default sub-ledger is {latestDefaultSubLedger}"); //"Hello world 1"

// The ledger entry written at subLedgerTransactionId is retrieved from the sub-ledger 'sub-ledger'.
string subLedgerTransactionId = subLedgerPostOperation.Id;

getResponse = ledgerClient.GetLedgerEntry(subLedgerTransactionId, "my sub-ledger");
// Try until the entry is available.
loaded = false;
element = default;
string subLedgerEntry = null;
while (!loaded)
{
    loaded = JsonDocument.Parse(getResponse.Content)
        .RootElement
        .TryGetProperty("entry", out element);
    if (loaded)
    {
        subLedgerEntry = element.GetProperty("contents").GetString();
    }
    else
    {
        getResponse = ledgerClient.GetLedgerEntry(subLedgerTransactionId, "my sub-ledger");
    }
}

Console.WriteLine(subLedgerEntry); // "Hello world sub-ledger 0"

// This will return the latest entry available in the sub-ledger.
getResponse = ledgerClient.GetCurrentLedgerEntry("my sub-ledger");
string latestSubLedger = JsonDocument.Parse(getResponse.Content)
    .RootElement
    .GetProperty("contents")
    .GetString();

Console.WriteLine($"The latest ledger entry from the sub-ledger is {latestSubLedger}"); // "Hello world sub-ledger 1"
```

##### Ranged queries

Ledger entries in a sub-ledger may be retrieved over a range of transaction ids.
Note: Both ranges are optional; they can be provided individually or not at all.

```C# Snippet:RangedQuery
ledgerClient.GetLedgerEntries(fromTransactionId: "2.1", toTransactionId: subLedgerTransactionId);
```

### User management

Users are managed directly with the Confidential Ledger instead of through Azure. New users may be AAD-based or certificate-based.

```C# Snippet:NewUser
string newUserAadObjectId = "<some AAD user or service princpal object Id>";
ledgerClient.CreateOrUpdateUser(
    newUserAadObjectId,
    RequestContent.Create(new { assignedRole = "Reader" }));
```


### Confidential consortium and enclave verifications

One may want to validate details about the Confidential Ledger for a variety of reasons. For example, you may want to view details about how Microsoft may manage your Confidential Ledger as part of [Confidential Consortium Framework governance](https://microsoft.github.io/CCF/main/governance/index.html), or verify that your Confidential Ledger is indeed running in SGX enclaves. A number of client methods are provided for these use cases.

```C# Snippet:Consortium
Response consortiumResponse = ledgerClient.GetConsortiumMembers();
string membersJson = new StreamReader(consortiumResponse.ContentStream).ReadToEnd();

// Consortium members can manage and alter the Confidential Ledger, such as by replacing unhealthy nodes.
Console.WriteLine(membersJson);

// The constitution is a collection of JavaScript code that defines actions available to members,
// and vets proposals by members to execute those actions.
Response constitutionResponse = ledgerClient.GetConstitution();
string constitutionJson = new StreamReader(constitutionResponse.ContentStream).ReadToEnd();

Console.WriteLine(constitutionJson);

// Enclave quotes contain material that can be used to cryptographically verify the validity and contents of an enclave.
Response enclavesResponse = ledgerClient.GetEnclaveQuotes();
string enclavesJson = new StreamReader(enclavesResponse.ContentStream).ReadToEnd();

Console.WriteLine(enclavesJson);
```

[Microsoft Azure Attestation Service](https://azure.microsoft.com/services/azure-attestation/) is one provider of SGX enclave quotes.

### Thread safety

We guarantee that all client instance methods are thread-safe and independent of each other ([guideline](https://azure.github.io/azure-sdk/dotnet_introduction.html#dotnet-service-methods-thread-safety)). This ensures that the recommendation of reusing client instances is always safe, even across threads.

### Additional concepts

<!-- CLIENT COMMON BAR -->
[Client options](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/core/Azure.Core/README.md#configuring-service-clients-using-clientoptions) |
[Accessing the response](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/core/Azure.Core/README.md#accessing-http-response-details-using-responset) |
[Long-running operations](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/core/Azure.Core/README.md#consuming-long-running-operations-using-operationt) |
[Handling failures](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/core/Azure.Core/README.md#reporting-errors-requestfailedexception) |
[Diagnostics](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/core/Azure.Core/samples/Diagnostics.md) |
[Mocking](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/core/Azure.Core/README.md#mocking) |
[Client lifetime](https://devblogs.microsoft.com/azure-sdk/lifetime-management-and-thread-safety-guarantees-of-azure-sdk-net-clients/)
<!-- CLIENT COMMON BAR -->

## Examples

Coming Soon...

## Troubleshooting

Response values returned from Confidential Ledger client methods are `Response` objects, which contain information about the http response such as the http `Status` property and a `Headers` object containing more information about the failure.

### Setting up console logging

The simplest way to see the logs is to enable the console logging.
To create an Azure SDK log listener that outputs messages to console use AzureEventSourceListener.CreateConsoleLogger method.

```C#
// Setup a listener to monitor logged events.
using AzureEventSourceListener listener = AzureEventSourceListener.CreateConsoleLogger();
```

To learn more about other logging mechanisms see [here][logging].

## Next steps

For more extensive documentation on Azure Confidential Ledger, see the API [reference documentation](https://azure.github.io/azure-sdk-for-net/).
You may also read more about Microsoft Research's open-source Confidential [Consortium Framework][ccf].

<!-- LINKS -->
[style-guide-msft]: https://docs.microsoft.com/style-guide/capitalization
[style-guide-cloud]: https://aka.ms/azsdk/cloud-style-guide
[client_src]: https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/confidentialledger/Azure.Security.ConfidentialLedger
[client_nuget_package]: https://www.nuget.org/packages?q=Azure.Security.ConfidentialLedger
[azure_cli]: https://docs.microsoft.com/cli/azure
[azure_cloud_shell]: https://shell.azure.com/bash
[azure_confidential_computing]: https://azure.microsoft.com/solutions/confidential-compute
[azure_sub]: https://azure.microsoft.com/free/dotnet/
[ccf]: https://github.com/Microsoft/CCF
[azure_identity]: https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/identity/Azure.Identity
[default_cred_ref]: https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/identity/Azure.Identity/README.md#defaultazurecredential
[logging]: https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/core/Azure.Core/samples/Diagnostics.md
[coc]: https://opensource.microsoft.com/codeofconduct/
[coc_faq]: https://opensource.microsoft.com/codeofconduct/faq
[cla]: https://cla.microsoft.com
[coc_contact]: mailto:opencode@microsoft.com

![Impressions](https://azure-sdk-impressions.azurewebsites.net/api/impressions/azure-sdk-for-net%2Fsdk%2Fconfidentialledger%2FAzure.Template%2FREADME.png)


## Next steps

To learn more about Key Vault and how to integrate it with your apps, see the following articles:

- Read an [Overview of Azure Key Vault](../general/overview.md)
- See an [Access Key Vault from App Service Application Tutorial](../general/tutorial-net-create-vault-azure-web-app.md)
- See an [Access Key Vault from Virtual Machine Tutorial](../general/tutorial-net-virtual-machine.md)
- See the [Azure Key Vault developer's guide](../general/developers-guide.md)
- Review the [Key Vault security overview](../general/security-features.md)
