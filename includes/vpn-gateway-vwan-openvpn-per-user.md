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

### <a name="mfa"></a>Open the MFA page

1. Sign in to the Azure portal.
2. Navigate to **Microsoft Entra ID -> All users**.
3. Select **Multi-Factor Authentication** to open the multi-factor authentication page.

   ![Sign in](./media/vpn-gateway-vwan-openvpn-azure-ad-mfa/mfa1.jpg)

### <a name="users"></a> Select users

1. On the **multi-factor authentication** page, select the user(s) for whom you want to enable MFA.
2. Select **Enable**.

   ![Select](./media/vpn-gateway-vwan-openvpn-azure-ad-mfa/mfa2.jpg)
