---
title: Quickstart - Look up operator information for a phone number using Azure Communication Services
description: Learn how to look up operator information for any phone number using Azure Communication Services
services: azure-communication-services
author: ericasp
manager: danielav
ms.service: azure-communication-services
ms.subservice: pstn
ms.date: 05/30/2023
ms.topic: quickstart
ms.author: ericasp
---

# Quickstart: Look up operator information for a phone number using Azure Communication Services

[!INCLUDE [Private Preview Notice](../../includes/private-preview-include.md)]

Get started with the Phone Numbers client library for C# to look up operator information for phone numbers, which can be used to determine whether and how to communicate with that phone number.  Follow these steps to install the package and look up operator information about a phone number.

> [!NOTE]
> Find the code for this quickstart on [GitHub](https://github.com/Azure/communication-preview/tree/master/samples/NumberLookup).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- To enable Number Lookup service on your Azure Communication Services subscription, please complete this [form](https://forms.microsoft.com/pages/responsepage.aspx?id=v4j5cvGGr0GRqy180BHbR058xZQ9HIBLikwspEUN6t5URUVDTTdWMEg5VElQTFpaMVMyM085ODkwVS4u) for us to allow-list your subscription. 
- The latest version of [.NET Core client library](https://dotnet.microsoft.com/download/dotnet-core) for your operating system.
- An active Communication Services resource and connection string. [Create a Communication Services resource](../create-communication-resource.md).

### Prerequisite check

- In a terminal or command window, run the `dotnet` command to check that the .NET SDK is installed.

## Setting up

To set up an environment for sending lookup queries, take the steps in the following sections.

### Create a new C# application

In a console window, such as cmd, PowerShell, or Bash, use the `dotnet new` command to create a new console app with the name `NumberLookupQuickstart`. This command creates a simple "Hello World" C# project with a single source file, **Program.cs**.

```console
dotnet new console -o NumberLookupQuickstart
```

Change your directory to the newly created app folder and use the `dotnet build` command to compile your application.

```console
cd NumberLookupQuickstart
dotnet build
```

### Connect to dev package feed
The private preview version of the SDK is published to a dev package feed. You can add the dev feed using the [NuGet CLI](https://docs.microsoft.com/nuget/reference/nuget-exe-cli-reference), which will add it to the NuGet.Config file.

```console
nuget sources add -Name "Azure SDK for .NET Dev Feed" -Source "https://pkgs.dev.azure.com/azure-sdk/public/_packaging/azure-sdk-for-net/nuget/v3/index.json"
```

More detailed information and other options for connecting to the dev feed can be found in the [contributing guide](https://github.com/Azure/azure-sdk-for-net/blob/main/CONTRIBUTING.md#nuget-package-dev-feed).

### Install the package

While still in the application directory, install the Azure Communication Services PhoneNumbers client library for .NET package by using the following command.

```console
dotnet add package Azure.Communication.PhoneNumbers --version 1.2.0-alpha.20230531.2
```

Add a `using` directive to the top of **Program.cs** to include the `Azure.Communication` namespace.

```csharp
using System;
using System.Threading.Tasks;
using Azure.Communication.PhoneNumbers;
```

Update `Main` function signature to be async.

```csharp
internal class Program
{
    static async Task Main(string[] args)
    {
        ...
    }
}
```

## Code examples

### Authenticate the client

Phone Number clients can be authenticated using connection string acquired from an Azure Communication Services resource in the [Azure portal](https://portal.azure.com).
It's recommended to use a `COMMUNICATION_SERVICES_CONNECTION_STRING` environment variable to avoid putting your connection string in plain text within your code.

```csharp
// This code retrieves your connection string from an environment variable.
string? connectionString = Environment.GetEnvironmentVariable("COMMUNICATION_SERVICES_CONNECTION_STRING");
  
PhoneNumbersClient client = new PhoneNumbersClient(connectionString, new PhoneNumbersClientOptions(PhoneNumbersClientOptions.ServiceVersion.V2023_05_01_Preview));
```

Phone Number clients can also authenticate with Azure Active Directory Authentication. With this option,
`AZURE_CLIENT_SECRET`, `AZURE_CLIENT_ID` and `AZURE_TENANT_ID` environment variables need to be set up for authentication.

```csharp
// Get an endpoint to our Azure Communication Services resource.
Uri endpoint = new Uri("<endpoint_url>");
TokenCredential tokenCredential = new DefaultAzureCredential();
client = new PhoneNumbersClient(endpoint, tokenCredential);
```

### Look up operator information for a number

To search for a phone number's operator information, call `SearchOperatorInformationAsync` from the `PhoneNumbersClient`.

```csharp
OperatorInformationResult searchResult = await client.SearchOperatorInformationAsync(new[] { "<target-phone-number>" });
OperatorInformation operatorInformation = searchResult.Results[0];
```

Replace `<target-phone-number>` with the phone number you're looking up, usually a number you'd like to send a message to.

> [!WARNING]
> Provide phone numbers in E.164 international standard format, for example, +14255550123.

### Use operator information

You can now use the operator information.  For this quickstart guide, we can print some of the details to the console.

```csharp
Console.WriteLine($"{operatorInformation.PhoneNumber} is a {operatorInformation.NumberType ?? "unknown"} number, operated by {operatorInformation.OperatorDetails.Name ?? "an unknown operator"}");
```

You may also use the operator information to determine whether to send an SMS.  For more information on sending an SMS, see the [SMS Quickstart](../sms/send.md).

## Run the code

Run the application from your application directory with the `dotnet run` command.

```console
dotnet run
```

## Sample code

You can download the sample app from [GitHub](https://github.com/Azure/communication-preview/tree/master/samples/NumberLookup).

## Troubleshooting

Common questions and issues:

- The data returned by this endpoint is subject to various international laws and regulations, therefore the accuracy of the results depends on several factors.  These factors include whether the number has been ported, the country code, and the approval status of the caller.  Based on these factors, operator information may not be available for some phone numbers or may reflect the original operator of the phone number, not the current operator.

## Next steps

In this quickstart you learned how to:
> [!div class="checklist"]
> * Look up operator information for a phone number

> [!div class="nextstepaction"]
> [Number Lookup Concept](../../concepts/numbers/number-lookup-concept.md)

> [!div class="nextstepaction"]
> [Number Lookup SDK](../../concepts/numbers/number-lookup-sdk.md)
