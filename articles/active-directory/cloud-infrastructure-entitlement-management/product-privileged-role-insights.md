---
title: View privileged role assignments in Microsoft Entra Insights
description: How to view current privileged role assignments in the Microsoft Entra Insights tab.
services: active-directory
author: jenniferf-skc
manager: amycolannino
ms.service: active-directory 
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 05/22/2023
ms.author: jfields
---

# View privileged role assignments in your organization

The **Microsoft Entra Insights** tab shows you who is assigned to privileged roles in your organization. You can review a list of identities assigned to a privileged role and learn more about each identity.

> [!NOTE] 
> Microsoft recommends that you keep two break glass accounts permanently assigned to the global administrator role. Make sure that these accounts don't require the same multi-factor authentication mechanism to sign in as other administrative accounts. This is described further in [Manage emergency access accounts in Microsoft Entra](../roles/security-emergency-access.md). 

> [!NOTE] 
> Keep role assignments permanent if a user has a an additional Microsoft account (for example, an account they use to sign in to Microsoft services like Skype or Outlook.com). If you require multi-factor authentication to activate a role assignment, a user with an additional Microsoft account will be locked out.  

## Prerequisite
To view information on the Microsoft Entra Insights tab, you must have Permissions Management Administrator role permissions.

<a name='view-information-in-the-azure-ad-insights-tab'></a>

## View information in the Microsoft Entra Insights tab

1. From the Permissions Management home page, select the **Microsoft Entra Insights** tab.
2. Select **Review global administrators** to review the list of Global administrator role assignments.
3. Select **Review highly privileged roles** or **Review service principals** to review information on principal role assignments for the following roles: *Application administrator*, *Cloud Application administrator*, *Exchange administrator*, *Intune administrator*, *Privileged role administrator*, *SharePoint administrator*, *Security administrator*, *User administrator*. 


## Next steps

- For information about managing roles, policies and permissions requests in your organization, see [View roles/policies and requests for permission in the Remediation dashboard](ui-remediation.md).
