---
title: include file
description: include file
services: azure-communication-services
author: peiliu
manager: rejooyan

ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 05/25/2022
ms.topic: include
ms.author: peiliu
ms.custom:
  - include file
  - sfi-ropc-nochange
---

Get started with Azure Communication Services by using the Communication Services C# SMS SDK to send SMS messages.

Completing this article incurs a small cost of a few USD cents or less in your Azure account.

> [!NOTE]
> See the finalized code at Azure Samples GitHub [Send an SMS message using .NET](https://github.com/Azure-Samples/communication-services-dotnet-quickstarts/tree/main/SendSMS).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- The latest version of [.NET Core SDK](https://dotnet.microsoft.com/download/dotnet-core) for your operating system.
- An active Communication Services resource and connection string. [Create a Communication Services resource](../../create-communication-resource.md).
- An SMS-enabled telephone number, short code, or alphanumeric sender ID. [Get a phone number](../../telephony/get-phone-number.md).

### Prerequisite check

- In a terminal or command window, run the `dotnet` command to check that the .NET SDK is installed.
- To view the phone numbers that are associated with your Communication Services resource, sign in to the [Azure portal](https://portal.azure.com/) and locate your Communication Services resource. In the navigation pane on the left, select **Phone numbers**.

## Set up the application environment

To set up an environment for sending messages, take the steps in the following sections.

### Create a new C# application

1. In a console window, such as cmd, PowerShell, or Bash, use the `dotnet new` command to create a new console app with the name `SmsQuickstart`. This command creates a simple "Hello World" C# project with a single source file, **Program.cs**.

   ```console
   dotnet new console -o SmsQuickstart
   ```

1. Change your directory to the newly created app folder and use the `dotnet build` command to compile your application.

   ```console
   cd SmsQuickstart
   dotnet build
   ```

### Install the package

1. While still in the application directory, install the Azure Communication Services SMS SDK for .NET package by using the following command.

   ```console
   dotnet add package Azure.Communication.Sms --version 1.0.0
   ```

1. Add a `using` directive to the top of **Program.cs** to include the `Azure.Communication` namespace.

   ```csharp

   using System;
   using System.Collections.Generic;

   using Azure;
   using Azure.Communication;
   using Azure.Communication.Sms;

   ```

## Object model

The following classes and interfaces handle some of the major features of the Azure Communication Services SMS SDK for C#.

| Name | Description |
| --- | --- |
| SmsClient | This class is needed for all SMS functionality. You instantiate it with your subscription information, and use it to send SMS messages. |
| SmsSendOptions | This class provides options for configuring delivery reporting. If enable_delivery_report is set to True, an event is emitted when delivery is successful. |
| SmsSendResult | This class contains the result from the SMS service. |

## Authenticate the client

Open **Program.cs** in a text editor and replace the body of the `Main` method with code to initialize an `SmsClient` with your connection string. The following code retrieves the connection string for the resource from an environment variable named `COMMUNICATION_SERVICES_CONNECTION_STRING`. Learn how to [manage your resource's connection string](../../create-communication-resource.md#store-your-connection-string).


```csharp
// This code retrieves your connection string
// from an environment variable.
string connectionString = Environment.GetEnvironmentVariable("COMMUNICATION_SERVICES_CONNECTION_STRING");

SmsClient smsClient = new SmsClient(connectionString);
```

## Send a 1:1 SMS message

To send an SMS message to a single recipient, call the `Send` or `SendAsync` function from the SmsClient. Add this code to the end of the `Main` method in **Program.cs**:

```csharp
SmsSendResult sendResult = smsClient.Send(
    from: "<from-phone-number>",
    to: "<to-phone-number>",
    message: "Hello World via SMS"
);

Console.WriteLine($"Sms id: {sendResult.MessageId}");
```

Make these replacements in the code:

- Replace `<from-phone-number>` with an SMS-enabled phone number associated with your Communication Services resource.
- Replace `<to-phone-number>` with the phone number that you'd like to send a message to.

> [!WARNING]
> Provide phone numbers in E.164 international standard format, such as +14255550123. The value for `<from-phone-number>` can also be a short code, such as 23456 or an alphanumeric sender ID, such as CONTOSO.

## Send a 1:N SMS message with options

To send an SMS message to a list of recipients, call the `Send` or `SendAsync` function from the SmsClient with a list of recipient phone numbers. You can also provide optional parameters to specify whether the delivery report should be enabled and to set custom tags.

```csharp
Response<IReadOnlyList<SmsSendResult>> response = smsClient.Send(
    from: "<from-phone-number>",
    to: new string[] { "<to-phone-number-1>", "<to-phone-number-2>" },
    message: "Weekly Promotion!",
    options: new SmsSendOptions(enableDeliveryReport: true) // OPTIONAL
    {
        Tag = "marketing", // custom tags
    });

IEnumerable<SmsSendResult> results = response.Value;
foreach (SmsSendResult result in results)
{
    Console.WriteLine($"Sms id: {result.MessageId}");
    Console.WriteLine($"Send Result Successful: {result.Successful}");
}
```

Make these replacements in the code:

- Replace `<from-phone-number>` with an SMS-enabled phone number associated with your Communication Services resource.
- Replace `<to-phone-number-1>` and `<to-phone-number-2>` with phone numbers that you'd like to send a message to.

> [!WARNING]
> Provide phone numbers in E.164 international standard format, such as +14255550123. The value for `<from-phone-number>` can also be a short code, such as 23456 or an alphanumeric sender ID, such as CONTOSO.

The `enableDeliveryReport` parameter is an optional parameter that you can use to configure delivery reporting. This functionality is useful when you want to emit events when SMS messages are delivered. See the [Handle SMS Events](../handle-sms-events.md) quickstart to configure delivery reporting for your SMS messages.

You can use the `Tag` parameter to apply a tag to the delivery report.

## Send SMS globally with Messaging Connect

[!INCLUDE [Public Preview Disclaimer](../../../includes/public-preview-include.md)]

If you're using a phone number provisioned via Messaging Connect, you can send SMS messages using the standard Azure Communication Services SDK. The only difference is that you must include the `MessagingConnect` object to specify the partner name and API key.

```csharp
Response<IReadOnlyList<SmsSendResult>> response = smsClient.Send(
    from: "<from-messaging-connect-number>",
    to: new string[] { "<to-phone-number-1>", "<to-phone-number-2>" },
    message: "Weekly Promotion!",
    options: new SmsSendOptions(enableDeliveryReport: true) // OPTIONAL
    {
        Tag = "marketing", // custom tags
        MessagingConnect = new MessagingConnectOptions("<partner-api-key>", "infobip")
    });

IEnumerable<SmsSendResult> results = response.Value;
foreach (SmsSendResult result in results)
{
    Console.WriteLine($"Sms id: {result.MessageId}");
    Console.WriteLine($"Send Result Successful: {result.Successful}");
}
```
Replace these values:

- `<from-messaging-connect-number>`: The phone number acquired through Messaging Connect and linked to your ACS resource.
- `<to-phone-number-1>` and `<to-phone-number-2>`: The recipient phone numbers.
- `<partner-api-key>`: The API key from your Messaging Connect partner (e.g., Infobip).

> [!TIP]
> Want to learn more about global messaging? Check out the [Messaging Connect page](../../../concepts/sms/messaging-connect.md)

> [!WARNING]
> Phone numbers must follow the E.164 international standard format (for example, +14255550123). The `<rom-messaging-connect-number>` must be a Messaging Connect number or a Dynamic Alpha Sender ID (for example, CONTOSO) already provisioned and synced to your ACS resource.

The `enableDeliveryReport` parameter is an optional parameter that you can use to configure delivery reporting. This functionality is useful when you want to emit events when SMS messages are delivered. See the [Handle SMS Events](../handle-sms-events.md) quickstart to configure delivery reporting for your SMS messages. You can use the `Tag` parameter to apply a tag to the delivery report.

## Run the code

Run the application from your application directory with the `dotnet run` command.

```console
dotnet run
```

## Sample code

Download the sample app from Azure Samples GitHub [Send an SMS message using .NET](https://github.com/Azure-Samples/communication-services-dotnet-quickstarts/tree/main/SendSMS).
