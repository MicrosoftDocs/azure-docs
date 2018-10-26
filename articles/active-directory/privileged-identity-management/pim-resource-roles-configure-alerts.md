---
title: Configure security alerts for Azure resource roles in PIM | Microsoft Docs
description: Learn how to configure security alerts for Azure resource roles in Azure AD Privileged Identity Management (PIM).
services: active-directory
documentationcenter: ''
author: rolyon
manager: mtillman
ms.service: active-directory
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.component: pim
ms.date: 04/02/2018
ms.author: rolyon
ms.custom: pim
---

# Configure security alerts for Azure resource roles in PIM
Privileged Identity Management (PIM) for Azure resources generates alerts when there is suspicious or unsafe activity in your environment. When an alert is triggered, it shows up on the Alerts page. 

![Alerts page](media/azure-pim-resource-rbac/RBAC-alerts-home.png)

## Review alerts
Select an alert to see a report that lists the users or roles that triggered the alert, along with remediation advice.

![Alert report](media/azure-pim-resource-rbac/rbac-alert-info.png)

## Alerts
| Alert | Severity | Trigger | Recommendation |
| --- | --- | --- | --- |
| **Too many owners assigned to a resource** |Medium |Too many users have the owner role. |Review the users in the list and reassign some to less privileged roles. |
| **Too many permanent owners assigned to a resource** |Medium |Too many users are permanently assigned to a role. |Review the users in the list and re-assign some to require activation for role use. |
| **Duplicate role created** |Medium |Multiple roles have the same criteria. |Use only one of these roles. |


### Severity
* **High**: Requires immediate action because of a policy violation. 
* **Medium**: Does not require immediate action but signals a potential policy violation.
* **Low**: Does not require immediate action but suggests a preferred policy change.

## Configure security alert settings
From the Alerts page, go to **Settings**.
![Settings](media/azure-pim-resource-rbac/rbac-navigate-settings.png)

Customize settings on the different alerts to work with your environment and security goals.
![Customize settings](media/azure-pim-resource-rbac/rbac-alert-settings.png)

## Next steps

- [Configure security alerts for Azure resource roles in PIM](pim-resource-roles-configure-alerts.md)
