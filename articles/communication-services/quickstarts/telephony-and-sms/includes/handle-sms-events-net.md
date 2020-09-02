---
title: include file
description: include file
services: azure-communication-services
author: dademath
manager: nimag
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 07/28/2020
ms.topic: include
ms.custom: include file
ms.author: dademath
---

## Enable Delivery Reporting

To enable Delivery Report on an SMS we will add send options, specifically `enableDeliveryReport` to it. For more information sending SMS, see [here](../send-sms.md)

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
                from: new PhoneNumber("+15551111111"), // From, purchased phone number for Azure Communication Services
                to: new PhoneNumber("+15552222222"), // To, can be list of numbers as well
                message: "Hello World via SMS", // Message
                new SendSmsOptions { EnableDeliveryReport = true } // Use SendSmsOptions to enable delivery report for the message sent.
                // Use response.Value.MessageId to correlate Delivery Report sent to EventGrid
            );
        }
    }
}
```

Step by step:

1. Refer to previous example Steps 1-3.
2. On success, `SmsClient.Send()` returns SendSmsResponse that returns a MessageId which can be used to corelate DeliveryReport sent to EventGrid
