<properties
   pageTitle="How to configure security alerts | Microsoft Azure"
   description="Learn how to configure security alerts for Azure Privileged Identity Management extension."
   services="active-directory"
   documentationCenter=""
   authors="kgremban"
   manager="stevenpo"
   editor=""/>

<tags
   ms.service="active-directory"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="identity"
   ms.date="06/30/2016"
   ms.author="kgremban"/>

# How to configure security alerts in Azure AD Privileged Identity Management

## Security alerts
Azure Privileged Identity Management (PIM) generates alerts when there is suspicious or unsafe activity in your environment. When an alert is triggered, it shows up on the PIM dashboard.

![PIM dashboard security alerts - screenshot][1]



| Alert | Trigger | Recommendation |
| ----- | ------- | -------------- |
| **Roles are being assigned outside of PIM** | An administrator was permanently assigned to a role, outside of the PIM interface. | Review the new role assignment. Since other services can only assign permanent administrators, change it to an eligible assignment if necessary. |
| **Roles are being activated too frequently** | There were too many re-activations of the same role within the time allowed in the settings. | Contact the user to see why they have activated the role so many times. Maybe the time limit is too short for them to complete their tasks, or maybe they're using scripts to circumvent the process. |
| **Roles don't require multi-factor authentication for activation** | There are roles without MFA enabled in the settings. | We require MFA for the most highly-privileged roles, but strongly encourage that you enable MFA for activation of all roles. |
| **Administrators aren't using their privileged roles** | There are temporary administrators that haven’t activated their roles recently. | Start an access review to determine the users that don't need access anymore. |
| **There are too many global administrators** | There are more global administrators than recommended. | If you have a high number of global administrators, it's likely that users are getting more permissions than they need. Move users to less privileged roles, or make some of them eligible for the role instead of permanently assigned. |

## Configure security alert settings

You can customize some of the security alerts in PIM to work with your environment and security goals. Follow these steps to reach the settings blade:

1. Sign in to the [Azure portal](https://portal.azure.com/) and select the **Azure AD Privileged Identity Management** tile from the dashboard.
2. Select **Managed privileged roles** > **Settings** > **Alerts settings**.

    ![Navigate to security alerts settings][2]

### "Roles are being activated too frequently" alert

This alert triggers if a user activates the same privileged role multiple times within a specified period. You can configure both the time period and the number of activations.

- **Activation renewal timeframe**: Specify in days, hours, minutes, and second the time period you want to use to track suspicious renewals.

- **Number of activation renewals**: Specify the number of activations, from 2 to 100, that you consider suspicious, or at least worthy of alert, within the timeframe you chose. You can set this by moving the slider, or typing a number in the text box.


### "There are too many global administrators" alert

PIM triggers this alert if two different criteria are met, and you can configure both of them. First, you need to reach a certain threshold of global administrators. Second, a certain percentage of your total role assignments must be global administrators. If you only meet one of these measurements, the alert will not appear.  

- **Minimum number of Global Administrators**: Specify the number of global administrators, from 2 to 100, that you consider an unsafe amount.

- **Percentage of global administrators**: Specify the percentage of administrators who are global administrators, from 0% to 100%, that is unsafe in your environment.

### "Administrators aren't using their privileged roles" alert

This alert triggers if a user goes a certain amount of time without activating a role.

- **Number of days**: Specify the number of days, from 0 to 100, that a user can go without activating a role.

<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps
[AZURE.INCLUDE [active-directory-privileged-identity-management-toc](../../includes/active-directory-privileged-identity-management-toc.md)]


<!--Image references-->

[1]: ./media/active-directory-privileged-identity-management-how-to-configure-security-alerts/PIM_security_dash.png
[2]: ./media/active-directory-privileged-identity-management-how-to-configure-security-alerts/PIM_security_settings.png 
