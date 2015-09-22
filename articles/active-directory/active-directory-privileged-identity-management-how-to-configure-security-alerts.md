<properties
   pageTitle="Azure Privileged Identity Management: How To Configure Security Alerts"
   description="Learn how toc configure security alerts for Azure Privileged Identity Management extension."
   services="active-directory"
   documentationCenter=""
   authors="IHenkel"
   manager="stevenpo"
   editor=""/>

<tags
   ms.service="na"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="identity"
   ms.date="09/21/2015"
   ms.author="inhenk"/>

# Azure Privileged Identity Management: How To Configure Security Alerts
## Security Alerts Overview
Azure Privileged Identity Management offers the following alerts which can be configured. Security Alerts can be viewed in the Alerts section of the PIM dashboard.

| Alert | Trigger |
| ------------- | ------------- |
| **Permanent activation attack suspected** | An administrator activated its temporary role outside of PIM. |
| **Suspicious activation renewal of privileged roles** | There were too many re-activations of the same role with the time allowed in the settings. |
| **Suspicious usage of honey token Global administrator user** | The usage of a “honey pot” user was detected.|
| **Weak authentication is configured for role activation** | There are roles without MFA in the settings. |
| **Redundant administrators increase your attack surface** | There are temporary administrators that didn’t activate their roles within the number of days in the settings. |
| **Too many global administrators increase your attack surface** | There are more global administrators than allowed in the settings. |

## Configuring Security Alerts

### Configure the "Suspicious activation of renewal of privileged roles" Alert
1. From the **Activity** section of the dashboard, select **Security alerts**. The **Active security alerts** blade will appear.
2. Click **Settings**.
3. Set the **Activation renewal timeframe** by adjusting the slider or entering the number of minutes in the text field. The maximum number allowed is 100.
4. Set the **Number of activation renewals** within the activation renewal timeframe by adjusting the slider or entering the number of renewals in the text field.  The maximum number of renewals is 100.
5. Click **Save**.

### Configure the "Redundant administrators increase your attack surface" Alert
1. From the **Activity** section of the dashboard, select **Security alerts**.  The **Active security alerts** blade will appear.
2. click **Settings**.
3. Select the number of days allowed without role activation by adjusting the slider or entering the number of days in the text field.
4. Click **Save**

### Configure the "Too many global administrators increase your attack surface" Alert

This alert has two settings that may trigger the alert.  The minimum number of Global Administrators will trigger the alert if there are more than the allowed number of administrators.  If the percentage of global administrators in the total amount of types of administrators is higher than the percentage in the settings, the alert will also be triggered.

1. From the **Activity** section of the dashboard, select **Security alerts**.  The **Active security alerts** blade will appear.
2. click **Settings**.
3. Set the **Minimum number of Global Administrators** by adjusting the slider or entering the number in the text field.
4. Set the **Percentage if Global Administrators** by adjusting the slider or entering the number in the text field.

<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps
[AZURE.INCLUDE [active-directory-privileged-identity-management-toc](../../includes/active-directory-privileged-identity-management-toc.md)]
