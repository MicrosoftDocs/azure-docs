---
ms.author: cherylmc
author: cherylmc
ms.date: 09/24/2024
ms.service: azure-vpn-gateway
ms.topic: include

 # this file is used for both virtual wan and vpn gateway. When modifying, make sure that your changes work for both environments.
---

If you want users to be prompted for a second factor of authentication before granting access, you can configure Microsoft Entra multifactor authentication (MFA). You can configure MFA on a per user basis, or you can leverage MFA via [Conditional Access](/azure/active-directory/conditional-access/overview).

* MFA per user can be enabled at no-additional cost. When you enable MFA per user, the user is prompted for second factor authentication against all applications tied to the Microsoft Entra tenant. See [Option 1](#peruser) for steps.
* Conditional Access allows for finer-grained control over how a second factor should be promoted. It can allow assignment of MFA to only VPN, and exclude other applications tied to the Microsoft Entra tenant. See [Option 2](#conditional) for configuration steps. For more information about Conditional Access, see [What is Conditional Access](/entra/identity/conditional-access/overview)?