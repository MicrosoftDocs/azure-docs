---
title: Export your Azure subscription top level information
description: Describes how you can view all Azure subscription IDs associated with your account.
author: bandersmsft
ms.reviewer: matrive
tags: billing
ms.service: cost-management-billing
ms.topic: conceptual
ms.date: 02/12/2020
ms.author: banders
---
# Export and view your top-level Subscription information
If you need to view the set of subscription IDs associated with your user credentials, [download a .json file with your subscription information from the Azure Account Center](https://account.azure.com/subscriptions/download).

[!INCLUDE [gdpr-dsr-and-stp-note](../../../includes/gdpr-dsr-and-stp-note.md)]

The downloaded .json file provides the following information:
- Email: The email address associated with your account.
- Puid: The unique identifier associated with your billing account.
- SubscriptionIds: A list of subscriptions that belong to your account, enumerated by subscription ID.

### subscriptions.json sample

```json
{
  "Email":"admin@contoso.com",
  "Puid":"00052xxxxxxxxxxx",
  "SubscriptionIds":[
    "38124d4d-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "7c8308f1-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "39a25f2b-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "52ec2489-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "e42384b2-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "90757cdc-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
  ]
}
```
