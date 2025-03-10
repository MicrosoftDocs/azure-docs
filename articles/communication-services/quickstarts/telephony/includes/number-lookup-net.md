Get started with the Phone Numbers client library for C# to look up operator information for phone numbers. Use the operator information to determine whether and how to communicate with that phone number. Follow these steps to install the package and look up operator information about a phone number.

> [!NOTE]
> To view the source code for this example, see [Manage Phone Numbers - C# | GitHub](https://github.com/Azure-Samples/communication-services-dotnet-quickstarts/tree/main/LookupNumber).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- The latest version of [.NET Core client library](https://dotnet.microsoft.com/download/dotnet-core) for your operating system.
- An active Communication Services resource and connection string. [Create a Communication Services resource](../../create-communication-resource.md).

### Prerequisite check

In a terminal or command window, run the `dotnet` command to check that the .NET SDK is installed.

## Setting up

To set up an environment for sending lookup queries, take the steps in the following sections.

### Create a new C# application

In a terminal or command window, run the `dotnet new` command to create a new console app with the name `NumberLookupQuickstart`. This command creates a simple "Hello World" C# project with a single source file, **Program.cs**.

```console
dotnet new console -o NumberLookupQuickstart
```

Change your directory to the newly created app folder and use the `dotnet build` command to compile your application.

```console
cd NumberLookupQuickstart
dotnet build
```

### Connect to dev package feed
The public preview version of the SDK is published to a dev package feed. You can add the dev feed using the [NuGet CLI](/nuget/reference/nuget-exe-cli-reference), which adds it to the NuGet.Config file.

```console
nuget sources add -Name "Azure SDK for .NET Dev Feed" -Source "https://pkgs.dev.azure.com/azure-sdk/public/_packaging/azure-sdk-for-net/nuget/v3/index.json"
```

More detailed information and other options for connecting to the dev feed can be found in the [contributing guide](https://github.com/Azure/azure-sdk-for-net/blob/main/CONTRIBUTING.md#nuget-package-dev-feed).

### Install the package

While still in the application directory, install the Azure Communication Services PhoneNumbers client library for .NET package by using the following command.

```console
dotnet add package Azure.Communication.PhoneNumbers --version 1.3.0
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

Phone Number clients can be authenticated using connection string acquired from an Azure Communication Services resource in the [Azure portal](https://portal.azure.com). Using a `COMMUNICATION_SERVICES_CONNECTION_STRING` environment variable is recommended to avoid putting your connection string in plain text within your code. Learn how to [manage your resource's connection string](../../create-communication-resource.md#store-your-connection-string).

```csharp
// This code retrieves your connection string from an environment variable.
string? connectionString = Environment.GetEnvironmentVariable("COMMUNICATION_SERVICES_CONNECTION_STRING");

PhoneNumbersClient client = new PhoneNumbersClient(connectionString, new PhoneNumbersClientOptions(PhoneNumbersClientOptions.ServiceVersion.V2024_03_01_Preview));
```

Phone Number clients can also authenticate with Microsoft Entra authentication. With this option,
`AZURE_CLIENT_SECRET`, `AZURE_CLIENT_ID`, and `AZURE_TENANT_ID` environment variables need to be set up for authentication.

```csharp
// Get an endpoint to our Azure Communication Services resource.
Uri endpoint = new Uri("<endpoint_url>");
TokenCredential tokenCredential = new DefaultAzureCredential();
client = new PhoneNumbersClient(endpoint, tokenCredential);
```

### Look up phone number formatting

To look up the national and international formatting for a number, call  `SearchOperatorInformationAsync` from the `PhoneNumbersClient`.

```csharp
OperatorInformationResult formattingResult = await client.SearchOperatorInformationAsync(new[] { "<target-phone-number>" });
```

Replace `<target-phone-number>` with the phone number you're looking up, usually a number you'd like to send a message to.

> [!WARNING]
> Provide phone numbers in E.164 international standard format, for example, +14255550123.

### Look up operator information for a number

To search for a phone number's operator information, call `SearchOperatorInformationAsync` from the `PhoneNumbersClient`, passing `true` for the `IncludeAdditionalOperatorDetails` option.

```csharp
OperatorInformationResult searchResult = await client.SearchOperatorInformationAsync(new[] { "<target-phone-number>" }, new OperatorInformationOptions() { IncludeAdditionalOperatorDetails = true });
```

> [!WARNING]
> Using this function incurs a charge to your account.

### Use operator information

You can now use the operator information. For this quickstart guide, we can print some of the details to the console.

First, we can print details about the number format.

```csharp
OperatorInformation formattingInfo = formattingResult.Values[0];
Console.WriteLine($"{formattingInfo.PhoneNumber} is formatted {formattingInfo.InternationalFormat} internationally, and {formattingInfo.NationalFormat} nationally");
```

Next, we can print details about the phone number and operator.

```csharp
OperatorInformation operatorInformation = searchResult.Values[0];
Console.WriteLine($"{operatorInformation.PhoneNumber} is a {operatorInformation.NumberType ?? "unknown"} number, operated in {operatorInformation.IsoCountryCode} by {operatorInformation.OperatorDetails.Name ?? "an unknown operator"}");
```

You can also use the operator information to determine whether to send an SMS. For more information about sending an SMS, see [Send an SMS message](../../sms/send.md).

## Run the code

Run the application from your terminal or command window with the `dotnet run` command.

```console
dotnet run --interactive
```

## Sample code

You can download the sample app from [Manage Phone Numbers - C# | GitHub](https://github.com/Azure-Samples/communication-services-dotnet-quickstarts/tree/main/LookupNumber).
