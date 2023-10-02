> [!NOTE]
> Find the finalized code for this quickstart on [GitHub](https://github.com/Azure-Samples/communication-services-dotnet-quickstarts/tree/main/PhoneNumbers)

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- The latest version [.NET Core client library](https://dotnet.microsoft.com/download/dotnet-core) for your operating system.
- An active Communication Services resource and connection string. [Create a Communication Services resource](../../create-communication-resource.md).

### Prerequisite check

- In a terminal or command window, run the `dotnet` command to check that the .NET client library is installed.

## Setting up

### Create a new C# application

In a console window (such as cmd, PowerShell, or Bash), use the `dotnet new` command to create a new console app with the name `PhoneNumbersQuickstart`. This command creates a simple "Hello World" C# project with a single source file: **Program.cs**.

```console
dotnet new console -o PhoneNumbersQuickstart
```

Change your directory to the newly created app folder and use the `dotnet build` command to compile your application.

```console
cd PhoneNumbersQuickstart
dotnet build
```

### Install the package

While still in the application directory, install the Azure Communication PhoneNumbers client library for .NET package by using the `dotnet add package` command.

```console
dotnet add package Azure.Communication.PhoneNumbers --version 1.0.0
```

Add a `using` directive to the top of **Program.cs** to include the namespaces.

```csharp
using System;
using System.Linq;
using System.Threading.Tasks;
using Azure.Communication.PhoneNumbers;
```

Update `Main` function signature to be async.

```csharp
static async Task Main(string[] args)
{
  ...
}
```

## Authenticate the client

Phone Number clients can be authenticated using connection string acquired from an Azure Communication Services resources in the [Azure portal](https://portal.azure.com).

```csharp
// Get a connection string to our Azure Communication Services resource.
var connectionString = "<connection_string>";
var client = new PhoneNumbersClient(connectionString);
```

Phone Number clients also have the option to authenticate with Azure Active Directory Authentication. With this option,
`AZURE_CLIENT_SECRET`, `AZURE_CLIENT_ID` and `AZURE_TENANT_ID` environment variables need to be set up for authentication.

```csharp
// Get an endpoint to our Azure Communication Services resource.
var endpoint = new Uri("<endpoint_url>");
TokenCredential tokenCredential = new DefaultAzureCredential();
client = new PhoneNumbersClient(endpoint, tokenCredential);
```

## Manage phone numbers

### Search for available phone numbers

In order to purchase phone numbers, you must first search for available phone numbers. To search for phone numbers, provide the area code, assignment type, [phone number capabilities](../../../concepts/telephony/plan-solution.md#phone-number-capabilities-in-azure-communication-services), [phone number type](../../../concepts/telephony/plan-solution.md#phone-number-types-in-azure-communication-services), and quantity. Note that for the toll-free phone number type, providing the area code is optional.

```csharp
var capabilities = new PhoneNumberCapabilities(calling:PhoneNumberCapabilityType.None, sms:PhoneNumberCapabilityType.Outbound);
var searchOptions = new PhoneNumberSearchOptions { AreaCode = "833", Quantity = 1 };

var searchOperation = await client.StartSearchAvailablePhoneNumbersAsync("US", PhoneNumberType.TollFree, PhoneNumberAssignmentType.Application, capabilities, searchOptions);
await searchOperation.WaitForCompletionAsync();
```

### Purchase phone numbers

The result of searching for phone numbers is a `PhoneNumberSearchResult`. This contains a `SearchId` which can be passed to the purchase numbers API to acquire the numbers in the search. Note that calling the purchase phone numbers API will result in a charge to your Azure Account.

```csharp
var purchaseOperation = await client.StartPurchasePhoneNumbersAsync(searchOperation.Value.SearchId);
await purchaseOperation.WaitForCompletionResponseAsync();
```

### Get phone number(s)

After a purchasing number, you can retrieve it from the client.
```csharp
var getPhoneNumberResponse = await client.GetPurchasedPhoneNumberAsync("+14255550123");
Console.WriteLine($"Phone number: {getPhoneNumberResponse.Value.PhoneNumber}, country code: {getPhoneNumberResponse.Value.CountryCode}");
```

You can also retrieve all the purchased phone numbers.
``` csharp
var purchasedPhoneNumbers = client.GetPurchasedPhoneNumbersAsync();
await foreach (var purchasedPhoneNumber in purchasedPhoneNumbers)
{
    Console.WriteLine($"Phone number: {purchasedPhoneNumber.PhoneNumber}, country code: {purchasedPhoneNumber.CountryCode}");
}
```

### Update phone number capabilities

With a purchased number, you can update the capabilities.

````csharp
var updateCapabilitiesOperation = await client.StartUpdateCapabilitiesAsync("+14255550123", calling: PhoneNumberCapabilityType.Outbound, sms: PhoneNumberCapabilityType.InboundOutbound);
await updateCapabilitiesOperation.WaitForCompletionAsync();
````


### Release phone number

You can release a purchased phone number.

````csharp
var releaseOperation = await client.StartReleasePhoneNumberAsync("+14255550123");
await releaseOperation.WaitForCompletionResponseAsync();
````

## Run the code

Run the application from your application directory with the `dotnet run` command.

```console
dotnet run
```

## Sample Code

You can download the sample app from [GitHub](https://github.com/Azure-Samples/communication-services-dotnet-quickstarts/tree/main/PhoneNumbers)
