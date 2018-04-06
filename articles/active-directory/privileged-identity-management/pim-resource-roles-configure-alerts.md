---
title:  Privileged Identity Management for Azure Resources - Security alerts| Microsoft Docs
description: Describes PIM security alerts.
services: active-directory
documentationcenter: ''
author: billmath
manager: mtillman
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/02/2018
ms.author: billmath
ms.custom: pim
---

# Privileged Identity Management - Resource Roles - Alerts
PIM for Azure Resources generates alerts when there is suspicious or unsafe activity in your environment. When an alert is triggered, it shows up on the Alerts page. 

![](media/azure-pim-resource-rbac/RBAC-alerts-home.png)

## Review alerts
Select an alert to see a report that lists the users or roles that triggered the alert as well as remediation advice.
![](media/azure-pim-resource-rbac/rbac-alert-info.png)

## Alerts
| Alert | Severity | Trigger | Recommendation |
| --- | --- | --- | --- |
| **Too many owners assigned to a resource** |Medium |Too many users have the Owner role. |Review the users in the list and re-assign some to less privileged roles. |
| **Too many permanent owners assigned to a resource** |Medium |Too many users are permanently assigned to a role. |Review the users in the list and re-assign some to require activation for role use. |
| **Duplicate role created** |Medium |Multiple roles have the same criteria. |Only use one of these roles. |


### Severity
* **High**: Requires immediate action because of a policy violation. 
* **Medium**: Does not require immediate action but signals a potential policy violation.
* **Low**: Does not require immediate action but suggests a preferrable policy change.

## Configure security alert settings
From the Alerts page, navigate to Settings.
![](media/azure-pim-resource-rbac/rbac-navigate-settings.png)

Customize settings on the different alerts to work with your environment and security goals.
![](media/azure-pim-resource-rbac/rbac-alert-settings.png)
