---
title: include file
description: Multiple recipients .NET SDK include file
author: natekimball-msft
manager: koagbakp
services: azure-communication-services
ms.author: natekimball
ms.date: 04/07/2023
ms.topic: include
ms.service: azure-communication-services
---

## Send an email message to multiple recipients

We can define multiple recipients by adding more EmailAddresses to the EmailRecipients object. These addresses can be added as `To`, `CC`, or `BCC` recipients.

```csharp
var toRecipients = new List<EmailAddress>
{
  new EmailAddress("<emailalias1@emaildomain.com>"),
  new EmailAddress("<emailalias2@emaildomain.com>"),
};

var ccRecipients = new List<EmailAddress>
{
  new EmailAddress("<ccemailalias@emaildomain.com>"),
};

var bccRecipients = new List<EmailAddress>
{
  new EmailAddress("<bccemailalias@emaildomain.com>"),
};

EmailRecipients emailRecipients = new EmailRecipients(toRecipients, ccRecipients, bccRecipients);
```

You can download the sample app demonstrating this action from [GitHub](https://github.com/Azure-Samples/communication-services-dotnet-quickstarts/tree/main/SendEmailAdvanced/SendEmailToMultipleRecipients)
