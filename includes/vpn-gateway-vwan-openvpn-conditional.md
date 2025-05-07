---
ms.author: cherylmc
author: cherylmc
ms.date: 01/17/2025
ms.service: azure-vpn-gateway
ms.topic: include

 # this file is used for both virtual wan and vpn gateway. When modifying, make sure that your changes work for both environments.
---
The recommended way to enable and use Microsoft Entra multifactor authentication is with Conditional Access policies. For granular configuration steps, see the tutorial: [Require multifactor authentication](/entra/identity/authentication/tutorial-enable-azure-mfa).

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Conditional Access Administrator](/entra/identity/role-based-access-control/permissions-reference#conditional-access-administrator).
1. Browse to **Protection** > **Security Center**>**Conditional Access**, select **+ New policy**, and then select **Create new policy**.
1. On the **New** pane, enter a name for the policy, such as VPN Policy.
1. Complete the following fields:

   | Field | Value|
   |---|---|
   |What does this policy apply to?| Users and groups |
   | Assignments | Specific users included|
   | Include | Select users and groups. Select the checkbox for Users and groups |
   | Select | Select at least one user or group |

1. On the **Select** page, browse for and select the Microsoft Entra user or group to which you want this policy to apply. For example, VPN Users, then choose **Select**.

Next, configure conditions for multifactor authentication. In the following steps, you configure the Azure VPN Client app to require multifactor authentication when a user signs in. For more information, see [Configure the conditions](/entra/identity/authentication/tutorial-enable-azure-mfa#configure-the-conditions-for-multifactor-authentication).

1. Select the current value under **Cloud apps or actions**, and then under **Select what this policy applies to**, verify that **Cloud apps** is selected.

1. Under **Include**, choose **Select resources**. Since no apps are yet selected, the list of apps opens automatically.

1. In the **Select** pane, select the **Azure VPN Client** app, then choose **Select**.

Next, configure the access controls to require multifactor authentication during a sign-in event.

1. Under **Access controls**, select **Grant**, and then select **Grant access**.

1. Select **Require multifactor authentication**.

1. For multiple controls, select **Require all the selected controls**.

Now, activate the policy.

1. Under **Enable policy**, select **On**.

1. To apply the Conditional Access policy, select **Create**.
