---
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: include
ms.date: 07/07/2023

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
---
Conditional Access policies are powerful tools, we recommend excluding the following accounts from your policies:

- **Emergency access** or **break-glass** accounts to prevent tenant-wide account lockout. In the unlikely scenario all administrators are locked out of your tenant, your emergency-access administrative account can be used to log into the tenant to take steps to recover access.
   - More information can be found in the article, [Manage emergency access accounts in Azure AD](../articles/active-directory/roles/security-emergency-access.md).
- **Service accounts** and **service principals**, such as the Azure AD Connect Sync Account. Service accounts are non-interactive accounts that aren't tied to any particular user. They're normally used by back-end services allowing programmatic access to applications, but are also used to sign in to systems for administrative purposes. Service accounts like these should be excluded since MFA can't be completed programmatically. Calls made by service principals won't be blocked by Conditional Access policies scoped to users. Use Conditional Access for workload identities to define policies targeting service principals.
   - If your organization has these accounts in use in scripts or code, consider replacing them with [managed identities](../articles/active-directory/managed-identities-azure-resources/overview.md). As a temporary workaround, you can exclude these specific accounts from the baseline policy.