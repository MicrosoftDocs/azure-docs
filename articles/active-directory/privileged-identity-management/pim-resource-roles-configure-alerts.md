---
title: Configure security alerts for Azure resource roles in Privileged Identity Management - Azure Active Directory | Microsoft Docs
description: Learn how to configure security alerts for Azure resource roles in Azure AD Privileged Identity Management (PIM).
services: active-directory
documentationcenter: ''
author: curtand
manager: daveba
ms.service: active-directory
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: identity
ms.subservice: pim
ms.date: 11/08/2019
ms.author: curtand
ms.custom: pim
ms.collection: M365-identity-device-management
---

# Configure security alerts for Azure resource roles in Privileged Identity Management

Privileged Identity Management (PIM) generates alerts when there is suspicious or unsafe activity in your Azure Active Directory (Azure AD) organization. When an alert is triggered, it shows up on the Alerts page.

![Azure resources - Alerts page listing alert, risk level, and count](media/pim-resource-roles-configure-alerts/rbac-alerts-page.png)

## Review alerts

Select an alert to see a report that lists the users or roles that triggered the alert, along with remediation guidance.

![Alert report showing last scan time, description, mitigation steps, type, severity, security impact, and how to prevent next time](media/pim-resource-roles-configure-alerts/rbac-alert-info.png)

## Alerts

| Alert | Severity | Trigger | Recommendation |
| --- | --- | --- | --- |
| **Too many owners assigned to a resource** |Medium |Too many users have the owner role. |Review the users in the list and reassign some to less privileged roles. |
| **Too many permanent owners assigned to a resource** |Medium |Too many users are permanently assigned to a role. |Review the users in the list and re-assign some to require activation for role use. |
| **Duplicate role created** |Medium |Multiple roles have the same criteria. |Use only one of these roles. |

### Severity

- **High**: Requires immediate action because of a policy violation. 
- **Medium**: Does not require immediate action but signals a potential policy violation.
- **Low**: Does not require immediate action but suggests a preferred policy change.

## Configure security alert settings

From the Alerts page, go to **Settings**.

![Alerts page with Settings highlighted](media/pim-resource-roles-configure-alerts/rbac-navigate-settings.png)

Customize settings on the different alerts to work with your environment and security goals.

![Setting page for an alert to enable and configure settings](media/pim-resource-roles-configure-alerts/rbac-alert-settings.png)

## Next steps

- [Configure Azure resource role settings in Privileged Identity Management](pim-resource-roles-configure-role-settings.md)
