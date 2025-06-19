> [!NOTE]
> Find the finalized code for this quickstart on [GitHub](https://github.com/Azure-Samples/communication-services-dotnet-quickstarts/tree/main/use-managed-Identity)

## Overview

This quickstart demonstrates how to use managed identities via Azure Service Principals to authenticate with Azure Communication Services. It provides examples for issuing an access token for Voice over IP (VoIP) calls and sending SMS messages.

## Setting Up

### Create a New C# Application

The goal is to create a new console application in C# to run the quickstart code. Open a terminal window (e.g., Command Prompt, PowerShell, or Bash) and execute the following command to create a new console app named `ActiveDirectoryAuthenticationQuickstart`:

```console
dotnet new console -o ActiveDirectoryAuthenticationQuickstart
```

This command will generate a simple "Hello World" C# project, including a single source file: `Program.cs`.

### Build the Application

Navigate to the newly created app folder and compile your application using the `dotnet build` command:

```console
cd ActiveDirectoryAuthenticationQuickstart
dotnet build
```

### Install the Required SDK Packages

To interact with Azure Communication Services and Azure Identity, add the following NuGet packages to your project:

```console
dotnet add package Azure.Communication.Identity
dotnet add package Azure.Communication.Sms
dotnet add package Azure.Identity
```

### Update the Program.cs File

To use the installed Azure SDK packages, include the following `using` directives at the top of your `Program.cs` file:

```csharp
using Azure.Identity;
using Azure.Communication.Identity;
using Azure.Communication.Sms;
using Azure.Core;
using Azure;
```

## Authenticate with DefaultAzureCredential

For this quickstart, we'll use the [DefaultAzureCredential](/dotnet/api/azure.identity.defaultazurecredential), which is suitable for both development and production environments. Declare an instance of this credential at the class level in `Program.cs`:

```csharp
private DefaultAzureCredential credential = new DefaultAzureCredential();
```

## Issue a Token with Service Principals

Add the following method to your `Program.cs` file. This method uses the Azure Communication Services SDK to issue a VoIP Access Token:

```csharp
public AccessToken CreateIdentityAndGetTokenAsync(Uri resourceEndpoint)
{
    var client = new CommunicationIdentityClient(resourceEndpoint, this.credential);
    var result = client.CreateUserAndToken(scopes: new[] { CommunicationTokenScope.VoIP });
    var (user, token) = response.Value;
    return token;
}
```

## Send an SMS with Service Principals

To demonstrate sending an SMS, add the following method to your `Program.cs` file. This method uses the Azure Communication Services SDK to send an SMS message:

```csharp
public SmsSendResult SendSms(Uri resourceEndpoint, string from, string to, string message)
{
    SmsClient smsClient = new SmsClient(resourceEndpoint, this.credential);
    SmsSendResult sendResult = smsClient.Send(
            from: from,
            to: to,
            message: message,
            new SmsSendOptions(enableDeliveryReport: true) // optional
        );

    return sendResult;
}
```

## Write the Main Method

In the `Main` method of your `Program.cs` file, add code to call the methods you created for issuing a token and sending an SMS. Your `Main` method should look similar to this:

```csharp
static void Main(string[] args)
{
    // You can find your endpoint and access key from your resource in the Azure portal
    // e.g. "https://<RESOURCE_NAME>.communication.azure.com";
    Uri endpoint = new("https://<RESOURCENAME>.communication.azure.com/");

    // We need an instance of the program class to use within this method.
    Program instance = new();

    Console.WriteLine("Retrieving new Access Token, using Service Principals");
    AccessToken response = instance.CreateIdentityAndGetTokenAsync(endpoint);
    Console.WriteLine($"Retrieved Access Token: {response.Token}");

    Console.WriteLine("Sending SMS using Service Principals");

    // You will need a phone number from your resource to send an SMS.
    SmsSendResult result = instance.SendSms(endpoint, "<Your Azure Communication Services Phone Number>", "<The Phone Number you'd like to send the SMS to.>", "Hello from using Service Principals");
    Console.WriteLine($"Sms id: {result.MessageId}");
    Console.WriteLine($"Send Result Successful: {result.Successful}");
}
```

Your final `Program.cs` file should look like this:

```csharp
class Program
     {
          private DefaultAzureCredential credential = new DefaultAzureCredential();
          static void Main(string[] args)
          {
               // You can find your endpoint and access key from your resource in the Azure portal
               // e.g. "https://<RESOURCE_NAME>.communication.azure.com";
               Uri endpoint = new("https://acstestingrifox.communication.azure.com/");

               // We need an instance of the program class to use within this method.
               Program instance = new();

               Console.WriteLine("Retrieving new Access Token, using Service Principals");
               AccessToken response = instance.CreateIdentityAndGetTokenAsync(endpoint);
               Console.WriteLine($"Retrieved Access Token: {response.Token}");

               Console.WriteLine("Sending SMS using Service Principals");

               // You will need a phone number from your resource to send an SMS.
               SmsSendResult result = instance.SendSms(endpoint, "<Your Azure Communication Services Phone Number>", "<The Phone Number you'd like to send the SMS to.>", "Hello from Service Principals");
               Console.WriteLine($"Sms id: {result.MessageId}");
               Console.WriteLine($"Send Result Successful: {result.Successful}");
          }
          public AccessToken CreateIdentityAndGetTokenAsync(Uri resourceEndpoint)
          {
               var client = new CommunicationIdentityClient(resourceEndpoint, this.credential);
               var result = client.CreateUserAndToken(scopes: new[] { CommunicationTokenScope.VoIP });
               var (user, token) = response.Value;
               return token;
          }
          public SmsSendResult SendSms(Uri resourceEndpoint, string from, string to, string message)
          {
               SmsClient smsClient = new SmsClient(resourceEndpoint, this.credential);
               SmsSendResult sendResult = smsClient.Send(
                    from: from,
                    to: to,
                    message: message,
                    new SmsSendOptions(enableDeliveryReport: true) // optional
               );

               return sendResult;
          }
    }
```

## Run the program

It is time to run your application and verify that it retrieves an access token and sends an SMS. Open a terminal, navigate to your application directory, and run:

```console
     dotnet run
```

The console output should appear as follows:

```Bash
     Retrieving new Access Token, using Service Principals
     Retrieved Access Token: ...
     Sending SMS using Service Principals
     Sms id: ...
     Send Result Successful: True
```