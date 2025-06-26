---
title: include file
description: Send email with Simple Mail Transfer Protocol (SMTP) using PowerShell
author: ddouglas-msft
manager: koagbakp
services: azure-communication-services
ms.author: ddouglas
ms.date: 11/01/2023
ms.topic: include
ms.service: azure-communication-services
---

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- An Azure Communication Email Resource created and ready with a provisioned domain. [Get started with Creating Email Communication Resource](../../create-email-communication-resource.md)
- An active Azure Communication Services Resource connected with Email Domain and a Connection String. [Get started by Connecting Email Resource with a Communication Resource](../../connect-email-communication-resource.md)
- SMTP credentials created using a Microsoft Entra application with access to the Azure Communication Services Resource. [Create credentials for Simple Mail Transfer Protocol (SMTP) authentication](../smtp-authentication.md)

Completing this quick start incurs a small cost of a few USD cents or less in your Azure account.

> [!NOTE]
> We can also send an email from our own verified domain. [Add custom verified domains to Email Communication Service](../../add-azure-managed-domains.md).

This article describes how to send email with Azure Communication Services using SMTP.

### Send an email using Send-MailMessage
The credentials can be verified using the Microsoft PowerShell utility Send-MailMessage. See [Send-MailMessage](/powershell/module/microsoft.powershell.utility/send-mailmessage) for the syntax.

To store the credentials in the required PSCredential format, use the following PowerShell commands:

```PowerShell
$Password = ConvertTo-SecureString -AsPlainText -Force -String '<Entra Application Client Secret>'
$Cred = New-Object -TypeName PSCredential -ArgumentList '<SMTP Username>', $Password
```

Use the following PowerShell script to send the email. The **From** value is the mail from address of your verified domain. The **To** value is the email address that you want to send to.

```PowerShell
Send-MailMessage -From 'User01 <user01@fabrikam.com>' -To 'User02 <user02@fabrikam.com>' -Subject 'Test mail' -Body 'test' -SmtpServer 'smtp.azurecomm.net' -Port 587 -Credential $Cred -UseSsl
```