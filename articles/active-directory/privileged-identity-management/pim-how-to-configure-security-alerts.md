---
title: Configure security alerts for Azure AD directory roles in PIM | Microsoft Docs
description: Learn how to configure security alerts for Azure AD directory roles in Azure AD Privileged Identity Management (PIM).
services: active-directory
documentationcenter: ''
author: rolyon
manager: mtillman
editor: ''

ms.service: active-directory
ms.topic: conceptual
ms.workload: identity
ms.component: pim
ms.date: 06/06/2017
ms.author: rolyon
ms.custom: pim
---
# Configure security alerts for Azure AD directory roles in PIM
## Security alerts
Azure Privileged Identity Management (PIM) generates alerts when there is suspicious or unsafe activity in your environment. When an alert is triggered, it shows up on the PIM dashboard. Select the alert to see a report that lists the users or roles that triggered the alert.

![PIM dashboard security alerts - screenshot](./media/pim-how-to-configure-security-alerts/PIM_security_dash.png)

| Alert | Severity | Trigger | Recommendation |
| --- | --- | --- | --- |
| **Roles are being assigned outside of PIM** |High |A user was permanently assigned a privileged role, outside of the PIM interface. |Review the users in the list and un-assign them from privileged roles assigned outside of PIM. |
| **Roles are being activated too frequently** |Medium |There were too many reactivations of the same role within the time allowed in the settings. |Contact the user to see why they have activated the role so many times. Maybe the time limit is too short for them to complete their tasks, or maybe they're using scripts to automatically activate a role. Make sure the activation duration for their role is set long enough for them to perform their tasks. |
| **Roles don't require multi-factor authentication for activation** |Medium |There are roles without MFA enabled in the settings. |We require MFA for the most highly privileged roles, but strongly encourage that you enable MFA for activation of all roles. |
| **Users aren't using their privileged roles** |Low |There are eligible administrators that haven’t activated their roles recently. |Start an access review to determine the users that don't need access anymore. |
| **There are too many global administrators** |Low |There are more global administrators than recommended. |If you have a high number of global administrators, it's likely that users are getting more permissions than they need. Move users to less privileged roles, or make some of them eligible for the role instead of permanently assigned. |

### Severity
* **High**: Requires immediate action because of a policy violation. 
* **Medium**: Does not require immediate action but signals a potential policy violation.
* **Low**: Does not require immediate action but suggests a preferrable policy change.

## Configure security alert settings
You can customize some of the security alerts in PIM to work with your environment and security goals. Follow these steps to reach the settings blade:

1. Sign in to the [Azure portal](https://portal.azure.com/) and select the **Azure AD Privileged Identity Management** tile from the dashboard.
2. Select **Managed privileged roles** > **Settings** > **Alerts settings**.
   
    ![Navigate to security alerts settings](./media/pim-how-to-configure-security-alerts/PIM_security_settings.png)

### "Roles are being activated too frequently" alert
This alert triggers if a user activates the same privileged role multiple times within a specified period. You can configure both the time period and the number of activations.

* **Activation renewal timeframe**: Specify in days, hours, minutes, and second the time period you want to use to track suspicious renewals.
* **Number of activation renewals**: Specify the number of activations, from 2 to 100, that you consider worthy of alert, within the timeframe you chose. You can change this setting by moving the slider, or typing a number in the text box.

### "There are too many global administrators" alert
PIM triggers this alert if two different criteria are met, and you can configure both of them. First, you need to reach a certain threshold of global administrators. Second, a certain percentage of your total role assignments must be global administrators. If you only meet one of these measurements, the alert does not appear.  

* **Minimum number of Global Administrators**: Specify the number of global administrators, from 2 to 100, that you consider an unsafe amount.
* **Percentage of global administrators**: Specify the percentage of administrators who are global administrators, from 0% to 100%, that is unsafe in your environment.

### "Administrators aren't using their privileged roles" alert
This alert triggers if a user goes a certain amount of time without activating a role.

* **Number of days**: Specify the number of days, from 0 to 100, that a user can go without activating a role.

## Next steps

- [Configure Azure AD directory role settings in PIM](pim-how-to-change-default-settings.md)
