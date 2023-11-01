---
title: How use Smtp to send an email with Azure Communication Services.
titleSuffix: An Azure Communication Services quick start guide.
description: Learn about how to use SMTP to send emails to Email Communication Services.
author: ddouglas
services: azure-communication-services
ms.author: ddouglas
ms.date: 10/18/2023
ms.topic: quickstart
ms.service: azure-communication-services
zone_pivot_groups: acs-smtp-sending-method
---
# Quickstart: Send email with SMTP

In this quick start, you'll learn about how to send email using SMTP.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- The latest version [.NET Core client library](https://dotnet.microsoft.com/download/dotnet-core) for your operating system.
- An Azure Communication Email Resource created and ready with a provisioned domain [Get started with Creating Email Communication Resource](../create-email-communication-resource.md)
- An active Azure Communication Services Resource connected with Email Domain and a Connection String. [Get started by Connecting Email Resource with a Communication Resource](../connect-email-communication-resource.md)
- Smtp credentials created using an Entra application with access to the Azure Communication Services Resource. [How to create authentication credentials for sending emails using Smtp](./smtp-authentication.md)

Completing this quick start incurs a small cost of a few USD cents or less in your Azure account.

> [!NOTE]
> We can also send an email from our own verified domain. [Add custom verified domains to Email Communication Service](../add-azure-managed-domains.md).

In this quick start, you'll learn about how to send email with Azure Communication Services using SMTP.

::: zone pivot="smtp-method-smtpclient"
[!INCLUDE [Send a message with SMTP and SmtpClient](./includes/send-email-smtp-smtpclient.md)]
::: zone-end

::: zone pivot="smtp-method-powershell"
[!INCLUDE [Send a message with SMTP and Windows Powershell](./includes/send-email-smtp-powershell.md)]
::: zone-end