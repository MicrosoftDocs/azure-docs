---
author: craigshoemaker
ms.author: cshoe
ms.date: 11/10/2025
ms.service: azure-sre-agent
---

To create an agent, you need to grant your agent the correct permissions, configure the correct settings, and grant access to the right resources:

* **Azure account**: You need an Azure account with an active subscription. If you don't already have one, you can [create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

* **Security context**: Make sure that your user account has the `Microsoft.Authorization/roleAssignments/write` permissions as either [Role Based Access Control Administrator](/azure/role-based-access-control/built-in-roles) or [User Access Administrator](/azure/role-based-access-control/built-in-roles).

* **Firewall settings**: Add `*.azuresre.ai` to the allowlist in your firewall settings. Some networking profiles might block access to `*.azuresre.ai` domain by default.
