---
ms.author: cherylmc
author: cherylmc
ms.date: 09/24/2024
ms.service: azure-vpn-gateway
ms.topic: include

 # this file is used for both virtual wan and vpn gateway. When modifying, make sure that your changes work for both environments.
---

Conditional Access allows for fine-grained access control on a per-application basis. In order to use Conditional Access, you should have Microsoft Entra ID P1 or P2 or greater licensing applied to the users that will be subject to the Conditional Access rules. For more information, see [What is Conditional Access](/entra/identity/conditional-access/overview)?

1. Go to the **Microsoft Entra ID - Enterprise applications - All applications** page and click **Azure VPN**.

   - Click **Conditional Access**.
   - Click **New policy** to open the **New** pane.
1. On the **New** pane, navigate to **Assignments -> Users and groups**. On the **Users and groups ->** **Include** tab:

   - Click **Select users and groups**.
   - Check **Users and groups**.
   - Click **Select** to select a group or set of users to be affected by MFA.
   - Click **Done**.

   :::image type="content" source="./media/vpn-gateway-vwan-openvpn-mfa/mfa-ca-assignments.png" alt-text="Screenshot of assignments settings." lightbox="./media/vpn-gateway-vwan-openvpn-mfa/mfa-ca-assignments.png":::
1. On the **New** pane, navigate to the **Access controls -> Grant** pane:

   - Click **Grant access**.
   - Click **Require multi-factor authentication**.
   - Click **Require all the selected controls**.
   - Click **Select**.

   :::image type="content" source="./media/vpn-gateway-vwan-openvpn-mfa/mfa-ca-grant-mfa.png" alt-text="Screenshot of multifactor authentication access." lightbox="./media/vpn-gateway-vwan-openvpn-mfa/mfa-ca-grant-mfa.png":::
1. In the **Enable policy** section:

   - Select **On**.
   - Click **Create** to create the policy.
