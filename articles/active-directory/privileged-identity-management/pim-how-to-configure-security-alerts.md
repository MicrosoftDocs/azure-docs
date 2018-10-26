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
ms.date: 10/26/2018
ms.author: rolyon
ms.custom: pim
---
# Configure security alerts for Azure AD directory roles in PIM
## Security alerts
Azure Privileged Identity Management (PIM) generates alerts when there is suspicious or unsafe activity in your environment. When an alert is triggered, it shows up on the PIM dashboard. Select the alert to see a report that lists the users or roles that triggered the alert.

![PIM dashboard security alerts - screenshot](./media/pim-how-to-configure-security-alerts/PIM_security_dash.png)

| Alert | Severity | Why am I getting this? | How to fix? | Prevention | In Portal Mitigation Action |
| --- | --- | --- | --- | --- | --- |
| **Roles are being assigned outside of PIM** | High | Privileged role assignments made outside of PIM are not properly monitered and may indicate an active attack. | Review the users in the list and un-assign them from privileged roles assigned outside of PIM. | Investigate where users are being assigned privileged roles outside of PIM and prohibit future assignments from there. | Removes the account from their privileged role |
| **Users aren't using their privileged roles** | Low | Assigning users to privileged roles they don't need increases the chance of an attack. It is also easier for attackers to remain unnoticed in accounts that are not actively being used. | Review the users in the list and un-assign them from privileged roles they do not need. | Only assign privileged roles to users that have a business justification.</br>Schedule regular access reviews to verify that users still need their access | Removes the account from their privileged role |
| **There are too many global administrators** | Low | Global Administrator is the highest privileged role. If  a Global Administrator is compromised, the attacker gains access to all of their permissions, putting your whole system at risk. | Review the users in the list and un-assign any that do not absolutely need the Global Administrator role.</br>Assign these users lower privilged roles | Assign users the least privileged role they need. | Removes the account from their privileged role |
| **Roles are being activated too frequently** | Low | Multiple activations to the same privileged role by the same user is a sign of an attack. | Review the users in the list and ensure that the activation duration for their privileged role is set long enough for them to perform their tasks. (currently no command bar line fix action) | Ensure that the activation duration for privileged roles is set long enough for users to perform their tasks.</br>Require MFA for for privileged roles that have accounts shared by multiple administrators. | N/A |
| **Roles don't require MFA for activation** | Low | Without MFA, compromised users can activate privileged roles. | Review the list of roles and require MFA for each of them | Require MFA for every role in role settings (link to role settings) | Makes MFA required for activation of the privileged role |
| **Potential stale accounts in a privileged role** | Medium | Accounts that have not changed their password recently might be service or shared accounts that aren't being maintained. These accounts in privileged roles are vulnerable to attackers | Review the accounts in the list and if they no longer need access, un-assign them from their privileged roles. | Ensure that accounts that are shared are rotating strong passwords when there is a change in the users that know the password.</br>Regularly review accounts with privileged roles using access reviews and remove role assignments which are no longer needed. | Removes the account from their privileged role |


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
