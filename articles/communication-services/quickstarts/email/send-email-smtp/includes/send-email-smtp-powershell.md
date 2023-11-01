---
title: include file
description: Sending with SMTP with PowerShell include file
author: ddouglas-msft
manager: koagbakp
services: azure-communication-services
ms.author: ddouglas
ms.date: 11/01/2023
ms.topic: include
ms.service: azure-communication-services
---

### Send an email using Send-MailMessage
The credentials can be verified using the Microsoft PowerShell utility Send-MailMessage. See [Send-MailMessage](/powershell/module/microsoft.powershell.utility/send-mailmessage) for the syntax.

To store the credentials in the required PSCredential format, use the following PowerShell commands:
```PowerShell
$Password = ConvertTo-SecureString -AsPlainText -Force -String '<Entra Application Client Secret>'
$Cred = New-Object -TypeName PSCredential -ArgumentList '<Azure Communication Services Resource name>|<Entra Application ID>|<Entra Tenant ID>', $Password
```

The following PowerShell script can be used to send the email. The **From** value is the mail from address of your verified domain. The **To** value is the email address that you would like to send to.

```PowerShell
Send-MailMessage -From 'User01 <user01@fabrikam.com>' -To 'User02 <user02@fabrikam.com>' -Subject 'Test mail' -Body 'test' -SmtpServer 'smtp.azurecomm.net' -Port 587 -Credential $Cred -UseSsl
```