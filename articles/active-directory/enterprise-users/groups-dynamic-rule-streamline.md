---
title: Create simpler and faster rules for dynamic groups - Azure AD | Microsoft Docs
description: How to optimize your membership rules to automatically populate groups.
services: active-directory
documentationcenter: ''
author: curtand
manager: karenhoran
ms.service: active-directory
ms.subservice: enterprise-users
ms.workload: identity
ms.topic: overview
ms.date: 03/25/2022
ms.author: curtand
ms.reviewer: jordandahl
ms.custom: it-pro
ms.collection: M365-identity-device-management
---


# Create simpler, more efficient rules for dynamic groups In Azure Active Directory

The team for Azure Active Directory (Azure AD) sees a lot of incidents related to dynamic groups and the processing time for their membership rules. This article contains the methods by which our engineering team helps customers to simplify their membership rule, which then improves processing time.

When writing membership rules to determine what users or devices get added to dynamic groups, there are steps you can take to ensure the rules are as efficient as possible. More efficient rules result in better dynamic group processing times. 


## Minimize use of MATCH

Minimize the usage of the 'match' operator in rules as much as possible. Instead, explore if it is possible to use the 'contains,' 'startswith,' or ‘-eq’ operators. Considering using other properties that allow you to write rules to select the users you want to be in the group without using the -match operator. For example, if you want a rule for the group for all users whose city is Lagos, then instead of using rules like:

```powershell
user.city -match "ago" or user.city -match ".*?ago.*"
```

It is better to use rules like:

`user.city -contains "ago,"` or
`user.city -startswith "Lag,"` or
best of all, `user.city -eq "Lagos"`

## Use fewer OR operators

In your rule, identify similar sub criteria with the same property equaling various values being linked together with a lot of -or operators. Instead, use the -in operator to group them into a single criterion to make the rule easier to evaluate. For example, instead of having a rule like this:

```powershell
(user.department -eq "Accounts" -and user.city -eq "Lagos") -or 
(user.department -eq "Accounts" -and user.city -eq "Ibadan") -or 
(user.department -eq "Accounts" -and user.city -eq "Kaduna") -or 
(user.department -eq "Accounts" -and user.city -eq "Abuja") -or 
(user.department -eq "Accounts" -and user.city -eq "Port Harcourt")
```

It is better to have a rule like this:

```powershell
user.department -eq "Accounts" -and user.city -in ["Lagos", "Ibadan", "Kaduna", "Abuja", "Port Harcourt"]
```

Conversely, identify similar sub criteria with the same property not equaling various values, being linked with a lot of -and operators. Then use the -notin operator to group them into a single criterion to make the rule easier to understand and evaluate. For example, instead of using a rule like this:

```powershell
(user.city -ne "Lagos") -and (user.city -ne "Ibadan") -and (user.city -ne "Kaduna") -and (user.city -ne "Abuja") -and (user.city -ne "Port Harcourt")
```

It is better to use a rule like this:

```powershell
user.city -notin ["Lagos", "Ibadan", "Kaduna", "Abuja", "Port Harcourt"]
```

## Avoid redundant criteria

Ensure that you aren't using redundant criteria in your rule. For example, instead of using a rule like this:

```powershell
user.city -eq "Lagos" or user.city -startswith "Lag"
```
It is better to simply use a rule like this:

```powershell
user.city -startswith "Lag"
```

## Next steps

- [Create a dynamic group](groups-dynamic-membership.md)

