---
title: include file
description: include file
services: ACS
author: dademath
manager: nimag
ms.service: ACS
ms.subservice: ACS
ms.date: 07/28/2020
ms.topic: include
ms.custom: include file
ms.author: dademath
---

## Prerequisites

If you don’t already have Visual Studio 2019 installed, you can download and use the **free** [Visual Studio 2019 Community Edition](https://www.visualstudio.com/downloads/). Make sure that you enable **Azure development** during the Visual Studio setup.

This quick start also requires:
- **Deployed Azure Communication Service resource.** Check out the quick start for making an ACS resource in the Azure portal. [create an Azure Communication Resource](../create-a-communication-resource.md).
- **An ACS configured telephone number.** Sending SMS messages requires a telephone number, which ACS can help you obtain easily. Check out the quick start for telephone number management for more information. 
**NOTE:** For private preview, please contact Pranita Kulkarni (prakulka@microsoft.com) or Nikolay Muravlyannikov (nmurav@microsoft.com) or send an email to phone@microsoft.com to aquire telephone numbers for your resource.
- **Download SMS SDK.** Download `Azure.Communication.Sms` C# SDK to send an SMS. **NOTE** For private preview, sdk must be downloaded internally from [Azure Dev Ops](https://dev.azure.com/azure-sdk/internal/_packaging?_a=feed&feed=azure-sdk-for-net-pr%40Local) or [GitHub](https://github.com/Azure/communication-preview/releases).

## Obtain a connection string
Connection strings provide addressing and key information necessary for service clients to connect and authenticate to Azure Communication Services to drive activity. You can get connection strings from the Azure portal or programmatically with Azure Resource Management (ARM) APIs.

In the Azure Portal, use the `Keys` page in `Settings` to view keys and connection strings. You can use either of Primary or Secondary Connection String.

![Screenshot of Key page](../media/key.png)


## Create a .NET console application and download the SMS .NET SDK
This quick start is simple enough that we will leverage the .NET console application template in Visual Studio to get started. 

1. Start Visual Studio.
2. Create a new .NET console project

![Screenshot of Visual Studio console app template](../media/VisualStudio-console-app-template.png)

The ACS SMS .NET SDK is available in GitHub as source code, and on nuget as a built assembly. Visual Studio's nuget package manager makes it easy to find and download packages:

![Screenshot of Visual Studio Manage Package link in solution explorer](../media/solution-explorer-nuget-link.png)

3. Find the ACS SMS SDK in nuget package manager by searching for Azure.Communication.Sms
4. Accept the license and load dependencies. Visual Studio and nuget will automatically load dependencies for `Azure.Communication.Sms` such as  `Azure.Core`.

![Screenshot of Visual Studio nuget package manager](../media/nuget.png)

> **NOTE:**
> During the private preview, `.nupkg` files are not available in public nuget, but must be downloaded internally from [Azure Dev Ops](https://dev.azure.com/azure-sdk/internal/_packaging?_a=feed&feed=azure-sdk-for-net-pr%40Local) or [GitHub](https://github.com/Azure/communication-preview/releases). Once locally downloaded to [your local nuget package source location](https://stackoverflow.com/questions/10240029/how-do-i-install-a-nuget-package-nupkg-file-locally) you can follow these same steps to include in your project.

## Authenticate the SMS client and send a SMS message
Now that we have the SDK included in our project we can send an SMS message with a few lines of code:

```csharp
using Azure.Communication.Sms; // Add NuGet package Azure.Communication.Sms
using Azure.Communication.Sms.Models;

namespace SmsSender
{
    class Program
    {
        static void Main(string[] args)
        {
            string connectionString = "<connection string>";
            SmsClient sms = new SmsClient(connectionString);
            Azure.Communication.Models.PhoneNumber source = new Azure.Communication.Models.PhoneNumber("+5555555555"); // Phone number acquired for your resource
            Azure.Communication.Models.PhoneNumber destination = new Azure.Communication.Models.PhoneNumber("+5555555556");
            sms.Send(source, destination, "Hello World via SMS");       
        }
    }
}
```

Step by step:

1. Include the ACS namespaces with `using Azure.Communication.Sms;` and `using Azure.Communication.Sms.Models;`
2. Initialize the `SmsClient` using the connection string retrieved in the Azure Portal. It is important to protect connection strings, they should only be used by trusted services and devices.
3. Use the `SmsClient.Send()` API to send an SMS message using a number allocated to the Azure Communication Service resource, in this case `+15551111111`, to a destination phone number `+15552222222`. To programmatically list allocated phoned numbers and acquire new ones, check out the allocate phone number quick start.


## Send a SMS message and enable Delivery Reports

Lets modify above code to enable Delivery Report for the message sent.

### Prerequisites
-- Setup EventGrid subscription to receive Sms Delivery Report Event, `Microsoft.CommunicationServices.SMSDeliveryReport` **Refer:** [EventGrid concept for more information.](../concepts/acs-event-grid.md)

```csharp
using Azure.Communication.Sms; // Add NuGet package Azure.Communication.Sms
using Azure.Communication.Sms.Models;

namespace SmsSender
{
    class Program
    {
        static void Main(string[] args)
        {
            var connectionString = "<connectionString>"; // Connection string can be acquired through the Azure portal
            var smsClient = new SmsClient(connectionString);
            var response = smsClient.Send(
                                from: new PhoneNumber("+15551111111"), // Phone number acquired for your resource
                                to: new PhoneNumber("+15552222222"),
                                message: "Hello World 👋🏻 via Sms",
                                sendSmsOptions: new SendSmsOptions { EnableDeliveryReport = true }); // Use SendSmsOptions to enable delivery report for the message sent.
            // Use response.Value.MessageId to correlate Delivery Report sent to EventGrid
        }
    }
}
```

Step by step:

1. Refer to previous example Steps 1-3.
2. On success, `SmsClient.Send()` returns SendSmsResponse that returns a MessageId which can be used to corelate DeliveryReport sent to EventGrid


## Add EventGrid Subscription for Sms Events
Sms events in Azure Communication Service can be subscribed using EventGrid Subscription of the Azure communication resource. Below are sample instructions using Webhook.

Step by step:

1. Navigate to `Events` tab on the Azure Communication Resource Page on Portal
2. Click on `+ Event Subscription`

![Screenshot of Adding a new Event Grid Subscription](../media/sms_event_subscription_1.png)

3. Add a subscription name and select Sms Events `SMS Received` and `SMS Delivery Report Received`

![Screenshot of Adding a new Event Grid Subscription](../media/sms_event_subscription_2.png)

4. Select Endpoint Type. We will use Webhook for this sample

![Screenshot of Adding a new Event Grid Subscription](../media/sms_event_subscription_3.png)

5. Add Webhook url and Create subscription

![Screenshot of Adding a new Event Grid Subscription](../media/sms_event_subscription_4.png)
