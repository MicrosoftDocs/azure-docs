---
title: Create simpler and faster rules for dynamic groups
description: How to optimize your membership rules to automatically populate groups.
services: active-directory
documentationcenter: ''
author: barclayn
manager: amycolannino
ms.service: active-directory
ms.subservice: enterprise-users
ms.workload: identity
ms.topic: overview
ms.date: 06/23/2022
ms.author: barclayn
ms.reviewer: jordandahl
ms.custom: it-pro
ms.collection: M365-identity-device-management
---


# Create simpler, more efficient rules for dynamic groups in Microsoft Entra ID

The team for Microsoft Entra ID, part of Microsoft Entra, receives reports of incidents related to dynamic groups and the processing time for their membership rules. This article uses that reported information to present the most common methods by which our engineering team helps customers to simplify their membership rules. Simpler and more efficient rules result in better dynamic group processing times. When writing membership rules for dynamic groups, follow these steps to ensure that your rules are as efficient as possible.


## Minimize use of MATCH

Minimize the usage of the `match` operator in rules as much as possible. Instead, explore if it's possible to use the `contains`, `startswith`, or `-eq` operators. Considering using other properties that allow you to write rules to select the users you want to be in the group without using the `-match` operator. For example, if you want a rule for the group for all users whose city is Lagos, then instead of using rules like:

- `user.city -match "ago"`
- `user.city -match ".*?ago.*"`

It's better to use rules like:

- `user.city -contains "ago"`
- `user.city -startswith "Lag"` 

Or, best of all:

- `user.city -eq "Lagos"`

## Use fewer OR operators

In your rule, identify when it uses various values for the same property linked together with `-or` operators. Instead, use the `-in` operator to group them into a single criterion to make the rule easier to evaluate. For example, instead of having a rule like this:

```
(user.department -eq "Accounts" -and user.city -eq "Lagos") -or 
(user.department -eq "Accounts" -and user.city -eq "Ibadan") -or 
(user.department -eq "Accounts" -and user.city -eq "Kaduna") -or 
(user.department -eq "Accounts" -and user.city -eq "Abuja") -or 
(user.department -eq "Accounts" -and user.city -eq "Port Harcourt")
```

It's better to have a rule like this:

- `user.department -eq "Accounts" -and user.city -in ["Lagos", "Ibadan", "Kaduna", "Abuja", "Port Harcourt"]`


Conversely, identify similar sub criteria with the same property not equal to various values, that are linked with `-and` operators. Then use the `-notin` operator to group them into a single criterion to make the rule easier to understand and evaluate. For example, instead of using a rule like this:

- `(user.city -ne "Lagos") -and (user.city -ne "Ibadan") -and (user.city -ne "Kaduna") -and (user.city -ne "Abuja") -and (user.city -ne "Port Harcourt")`

It's better to use a rule like this:

- `user.city -notin ["Lagos", "Ibadan", "Kaduna", "Abuja", "Port Harcourt"]`

## Avoid redundant criteria

Ensure that you aren't using redundant criteria in your rule. For example, instead of using a rule like this:

- `user.city -eq "Lagos" or user.city -startswith "Lag"`

It's better to use a rule like this:

- `user.city -startswith "Lag"`


## Next steps

- [Create a dynamic group](groups-dynamic-membership.md)
