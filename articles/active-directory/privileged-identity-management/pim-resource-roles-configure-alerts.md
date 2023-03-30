---
title: Configure security alerts for Azure roles in Privileged Identity Management
description: Learn how to configure security alerts for Azure resource roles in Azure AD Privileged Identity Management (PIM).
services: active-directory
documentationcenter: ''
author: amsliu
manager: amycolannino
ms.service: active-directory
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: identity
ms.subservice: pim
ms.date: 3/23/2023
ms.author: amsliu
ms.reviewer: tamimsangrar
ms.custom: pim
ms.collection: M365-identity-device-management
---

# Configure security alerts for Azure roles in Privileged Identity Management

Privileged Identity Management (PIM) generates alerts when there's suspicious or unsafe activity in your organization in Azure Active Directory (Azure AD), part of Microsoft Entra. When an alert is triggered, it shows up on the Alerts page.

![Screenshot of the alerts page listing alert, risk level, and count.](media/pim-resource-roles-configure-alerts/rbac-alerts-page.png)

## Review alerts

Select an alert to see a report that lists the users or roles that triggered the alert, along with remediation guidance.

![Screenshot of the alert report showing last scan time, description, mitigation steps, type, severity, security impact, and how to prevent next time.](media/pim-resource-roles-configure-alerts/rbac-alert-info.png)

## Alerts

Alert | Severity | Trigger | Recommendation
--- | --- | --- | ---
**Too many owners assigned to a resource** | Medium | Too many users have the owner role. | Review the users in the list and reassign some to less privileged roles.
**Too many permanent owners assigned to a resource** | Medium | Too many users are permanently assigned to a role. | Review the users in the list and reassign some to require activation for role use.
**Duplicate role created** | Medium | Multiple roles have the same criteria. | Use only one of these roles.
**Roles are being assigned outside of Privileged Identity Management** | High | A role is managed directly through the Azure IAM resource, or the Azure Resource Manager API. | Review the users in the list and remove them from privileged roles assigned outside of Privilege Identity Management. 

### Severity

- **High**: Requires immediate action because of a policy violation. 
- **Medium**: Doesn't require immediate action but signals a potential policy violation.
- **Low**: Doesn't require immediate action but suggests a preferred policy change.

## Configure security alert settings

Follow these steps to configure security alerts for Azure roles in Privileged Identity Management:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Open **Azure AD Privileged Identity Management**. For information about how to add the Privileged Identity Management tile to your dashboard, see [Start using Privileged Identity Management](pim-getting-started.md).

1. From the left menu, select **Azure resources**.

1. From the list of resources, select your Azure subscription. 

1. On the **Alerts** page, select **Settings**.

    ![Screenshot of the alerts page with settings highlighted.](media/pim-resource-roles-configure-alerts/rbac-navigate-settings.png)

1. Customize settings on the different alerts to work with your environment and security goals.

    ![Screenshot of the alert setting.](media/pim-resource-roles-configure-alerts/rbac-alert-settings.png)

## Next steps

- [Configure Azure resource role settings in Privileged Identity Management](pim-resource-roles-configure-role-settings.md)
