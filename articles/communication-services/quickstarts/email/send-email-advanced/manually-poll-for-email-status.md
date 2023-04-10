---
title: Quickstart - Manually poll for email status when sending email
titleSuffix: An Azure Communication Services Quickstart
description: Learn how to manually poll for email status while sending email using Azure Communication Services.
author: natekimball-msft
manager: koagbakp
services: azure-communication-services
ms.author: natekimball
ms.date: 04/07/2023
ms.topic: quickstart
ms.service: azure-communication-services
---

# Quickstart: Manually poll for email status when sending email

In this quick start, you'll learn about how to manually poll for email status while sending email using our Email SDKs.

[!INCLUDE [prepend-net](./includes/prepend-net.md)]
[!INCLUDE [polling-net](./includes/polling-net.md)]

> [!IMPORTANT]
> The success result returned by polling for the status of the send operation only validates the fact that the email has successfully been sent out for delivery. To get additional information about the status of the delivery on the recipient end, you will need to reference [how to handle email events](../handle-email-events.md).

## Troubleshooting

To troubleshoot issues related to email delivery, you can [get status of the email delivery](../handle-email-events.md) to capture delivery details.

## Clean up Azure Communication Service resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. Learn more about [cleaning up resources](../../create-communication-resource.md#clean-up-resources).

## Next steps

In this quick start, you learned how to manually poll for status when sending email using Azure Communication Services.

You may also want to:

 - Learn how to [send email to multiple recipients](./send-email-to-multiple-recipients.md)
 - Learn more about [sending email with attachments](./send-email-with-attachments.md)
 - Familiarize yourself with [email client library](../../../concepts/email/sdk-features.md)
