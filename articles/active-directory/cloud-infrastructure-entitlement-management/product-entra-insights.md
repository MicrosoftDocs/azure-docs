---
title: View privileged role assignments in Microsoft Entra Insights (Private Preview)
description: How to view current privileged role assignments in the Entra Insights tab.
services: active-directory
author: jenniferf-skc
manager: amycolannino
ms.service: active-directory 
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 03/22/2023
ms.author: jfields
---

# View privileged role assignments in your organization

The **Microsoft Entra Insights** tab shows you who is assigned to privileged roles in your organization. You can review a list of privileged identities assigned to a role and learn more about each identity.

You can also use Privileged Identity Management (PIM) in Microsoft Entra to change permanent role assignments in your organization into just-in-time assignments. Learn more about Privileged Identity Management in [Privileged Identity Management documentation.](https://learn.microsoft.com/en-us/azure/active-directory/privileged-identity-management/)

> [!NOTE] Microsoft recommends that you keep two break glass accounts that are permanently assigned to the global administrator role. Make sure that these accounts don't require the same multi-factor authentication mechanism as your normal administrative accounts to sign in, as described in Manage emergency access accounts in Microsoft Entra. Keep role assignments permanent if a user has a Microsoft account (for example, an account they use to sign in to Microsoft services like Skype, or Outlook.com). If you require multi-factor authentication for a user with a Microsoft account to activate a role assignment, the user will be locked out.  

## View information in the Microsoft Entra Insights tab

1. From the Permissions Management home page, select the **Microsoft Entra Insights** tab.
2. Select **Review global administrators** to review the list of Global administrator role assignments.
3. Select **Review highly privileged roles or Review service principals** to review user service principal role assignments for the following roles: *Application administrator*, *Cloud Application administrator*, *Exchange administrator*, *Intune administrator*, *Privileged role administrator*, *SharePoint administrator*, *Security administrator*, *User administrator*. 


## Next steps

- For information about managing roles, policies and permissions requests in your organization, see [View roles/policies and requests for permission in the Remediation dashboard](ui-remediation.md).
