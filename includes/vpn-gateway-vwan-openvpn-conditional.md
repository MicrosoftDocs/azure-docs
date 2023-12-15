---
 title: include file
 description: include file
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 08/23/2023
 ms.author: cherylmc
 ms.custom: include file

 # this file is used for both virtual wan and vpn gateway. When modifying, make sure that your changes work for both environments.
---
Conditional Access allows for fine-grained access control on a per-application basis. In order to use Conditional Access, you should have Microsoft Entra ID P1 or P2 or greater licensing applied to the users that will be subject to the Conditional Access rules.

1. Navigate to the **Enterprise applications - All applications** page and click **Azure VPN**.

   - Click **Conditional Access**.
   - Click **New policy** to open the **New** pane.
2. On the **New** pane, navigate to **Assignments -> Users and groups**. On the **Users and groups ->** **Include** tab:

   - Click **Select users and groups**.
   - Check **Users and groups**.
   - Click **Select** to select a group or set of users to be affected by MFA.
   - Click **Done**.

   ![Assignments](./media/vpn-gateway-vwan-openvpn-mfa/mfa-ca-assignments.png)
3. On the **New** pane, navigate to the **Access controls -> Grant** pane:

   - Click **Grant access**.
   - Click **Require multi-factor authentication**.
   - Click **Require all the selected controls**.
   - Click **Select**.
   
   ![Grant access - MFA](./media/vpn-gateway-vwan-openvpn-mfa/mfa-ca-grant-mfa.png)
4. In the **Enable policy** section:

   - Select **On**.
   - Click **Create**.

   ![Enable Policy](./media/vpn-gateway-vwan-openvpn-mfa/mfa-ca-enable-policy.png)
