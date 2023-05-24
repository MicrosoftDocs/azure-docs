## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- The latest version of [.NET Core client library](https://dotnet.microsoft.com/download/dotnet-core) for your operating system.
- An active Communication Services resource and connection string. [Create a Communication Services resource](../../create-communication-resource.md).

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

### Install the package

While still in the application directory, install the Azure Communication Services PhoneNumbers client library for .NET package by using the following command.

```console
dotnet add package Azure.Communication.PhoneNumbers --version 1.0.0
```

Add a `using` directive to the top of **Program.cs** to include the `Azure.Communication` namespace.

```csharp
using System;
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

## Code examples

### Authenticate the client

Phone Number clients can be authenticated using connection string acquired from an Azure Communication Services resource in the [Azure portal][azure_portal].
It's recommended to use a `COMMUNICATION_SERVICES_CONNECTION_STRING` environment variable to avoid putting your connection string in plain text within your code.

```csharp
// This code retrieves your connection string from an environment variable.
string connectionString = Environment.GetEnvironmentVariable("COMMUNICATION_SERVICES_CONNECTION_STRING");
  
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
