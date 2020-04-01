---
 title: include file
 description: include file
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 02/14/2020
 ms.author: cherylmc
 ms.custom: include file

 # this file is used for both virtual wan and vpn gateway. When modifying, make sure that your changes work for both environments.
---

If you want users to be prompted for a second factor of authentication before granting access, you can configure Azure Multi-Factor Authentication (MFA). You can configure MFA on a per user basis, or you can leverage MFA via [Conditional Access](../articles/active-directory/conditional-access/overview.md).

* MFA per user can be enabled at no-additional cost. When enabling MFA per user, the user will be prompted for second factor authentication against all applications tied to the Azure AD tenant. See [Option 1](#peruser) for steps.
* Conditional Access allows for finer-grained control over how a second factor should be promoted. It can allow assignment of MFA to only VPN, and exclude other applications tied to the Azure AD tenant. See [Option 2](#conditional) for steps.