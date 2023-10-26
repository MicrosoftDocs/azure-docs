---
title: include file
description: Send an email using try email in portal.
author: bashan-git
manager: sundraman
services: azure-communication-services
ms.author: bashan
ms.date: 08/31/2023
ms.topic: include
ms.service: azure-communication-services
---

Get started with Azure Communication Services by using the Communication Services Try Email to send Email messages.
## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- The latest version [.NET Core client library](https://dotnet.microsoft.com/download/dotnet-core) for your operating system.
- An Azure Email Communication Services Resource created and ready with a provisioned domain [Get started with Creating Email Communication Resource](../create-email-communication-resource.md)
- An active Communication Services resource connected with Email Domain. [Get started by Connecting Email Resource with a Communication Resource](../connect-email-communication-resource.md)

Completing this quick start incurs a small cost of a few USD cents or less in your Azure account.

## Sending an Email using Try Email

Try Email helps you kick starting with sending email using Azure Communication Services and as well verifying the configuration for your application to send email. It also helps to jump-start your email notification development with the code snippet in your preferred choice of language.

To send a message to a recipient, and to specify the message subject and body, 

1. From the overview page of a provisioned Azure Communication Service resource, click **Try Email** on the left navigation panel under Email.

    :::image type="content" source="../media/try-email-domains-select.png" alt-text="Screenshot that shows the left navigation panel for Try Email." lightbox="../media/try-email-domains-select.png":::

2. Select one of the verified domains from drop-down.

   :::image type="content" source="../media/try-email-domains-selected-domain.png" alt-text="Screenshot that shows the verfied domain from drop-down." lightbox="../media/try-email-domains-select.png":::

3. Compose the email to send
    - Enter Recipient email address
    - Enter Subject
    - Write the Email Body
          
    :::image type="content" source="../media/try-email-ready-send.png" alt-text="Screenshot that shows how to filter and select one of the verified email domains to connect." lightbox="../media/try-email-ready-send.png":::

4. Click Send 

   :::image type="content" source="../media/try-email-sent-queued.png" alt-text="Screenshot that shows one of the verified email domains is now connected." lightbox="../media/try-email-sent-queued.png":::
   
5. Email Sent Successfully.
 
    :::image type="content" source="../media/try-email-sent-success.png" alt-text="Screenshot that shows successful email send." lightbox="../media/try-email-sent-success.png":::
   
6. You can now also copy the sample *Code Snippet* to send an email to use in your sample project to send notifications.
   - Select Language of your choice
   - Click Insert my Connection
   - Click Copy

     :::image type="content" source="../media/try-email-code-snippet-connection-string.png" alt-text="Screenshot that shows code snippet to send email." lightbox="../media/try-email-code-snippet-connection-string.png":::
        
7. Email Code Snippet is now ready to use in your notification project. 
   
