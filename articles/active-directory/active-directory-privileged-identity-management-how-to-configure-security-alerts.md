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
   ms.date="04/15/2016"
   ms.author="kgremban"/>

# How to configure security alerts in Azure AD Privileged Identity Management

## Security alerts
Azure Privileged Identity Management (PIM) generates the following alerts, which can be viewed in the Alerts section of the PIM dashboard.

| Alert | Trigger | Recommendation |
| ----- | ------- | -------------- |
| **Permanent activation** | An administrator was permanently assigned to a role, outside of PIM. | Review the new role assignment, and change it to temporary if necessary. |
| **Suspicious activation renewal of privileged roles** | There were too many re-activations of the same role within the time allowed in the settings. | Contact the user to make sure they can activate the role successfully. |
| **Weak authentication is configured for role activation** | There are roles without MFA in the settings. | Consider requiring MFA for activation of all roles. |
| **Redundant administrators** | There are temporary administrators that haven’t activated their roles recently. | Remove role assignments that aren't needed anymore. |
| **Too many global administrators** | There are more global administrators than recommended. | Remove role assignments that aren't needed anymore, or make some of them temporary. |

## Configure security alert settings

### "Suspicious activation renewal of privileged roles" alert

Configure the **Activation renewal timeframe** and the **Number of activation renewals** settings to control when this alert triggers.

1. Select **Security alerts** from the **Activity** section of the dashboard. The **Active security alerts** blade will appear.
2. Click **Settings**.
3. Set the **Activation renewal timeframe** by adjusting the slider or entering the number of minutes in the text field. The maximum is 100.
4. Set the **Number of activation renewals** within the activation renewal timeframe by adjusting the slider or entering the number of renewals in the text field.  The maximum is 100.
5. Click **Save**.

### "Redundant administrators" alert
1. Select **Security alerts** from the **Activity** section of the dashboard. The **Active security alerts** blade will appear.
2. Click **Settings**.
3. Select the number of days allowed without role activation by adjusting the slider or entering the number of days in the text field.
4. Click **Save**.

### "Too many global administrators" alert

There are two settings that can trigger this alert:
- **Minimum number of Global Administrators** will trigger the alert if there are more than the allowed number of administrators.
- **Percentage of global administrators** will trigger the alert if the percentage of administrators who are global administrators is high than the settings allow.

1. Select **Security alerts** from the **Activity** section of the dashboard. The **Active security alerts** blade will appear.
2. Click **Settings**.
3. Set the **Minimum number of Global Administrators** by adjusting the slider or entering the number in the text field.
4. Set the **Percentage of Global Administrators** by adjusting the slider or entering the percentage in the text field.
5. Click **Save**.

<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps
[AZURE.INCLUDE [active-directory-privileged-identity-management-toc](../../includes/active-directory-privileged-identity-management-toc.md)]
