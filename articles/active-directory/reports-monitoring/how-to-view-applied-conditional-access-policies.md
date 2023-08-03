---

title: View applied Conditional Access policies in Azure AD sign-in logs
description: Learn how to view Conditional Access policies in Azure AD sign-in logs so that you can assess the effect of those policies.
services: active-directory
author: shlipsey3
manager: amycolannino
ms.service: active-directory
ms.topic: how-to
ms.workload: identity
ms.subservice: report-monitor
ms.date: 02/03/2023
ms.author: sarahlipsey
ms.reviewer: besiler 

ms.collection: M365-identity-device-management
---

# View applied Conditional Access policies in Azure AD sign-in logs

With Conditional Access policies, you can control how your users get access to the resources of your Azure tenant. As a tenant admin, you need to be able to determine what effect your Conditional Access policies have on sign-ins to your tenant, so that you can take action if necessary. 

The sign-in logs in Azure Active Directory (Azure AD) give you the information that you need to assess the effect of your policies. This article explains how to view applied Conditional Access policies in those logs.

## What you should know

As an Azure AD administrator, you can use the sign-in logs to:

- Troubleshoot sign-in problems.
- Check on feature performance.
- Evaluate the security of a tenant.

Some scenarios require you to get an understanding of how your Conditional Access policies were applied to a sign-in event. Common examples include:

- Helpdesk administrators who need to look at applied Conditional Access policies to understand if a policy is the root cause of a ticket that a user opened. 

- Tenant administrators who need to verify that Conditional Access policies have the intended effect on the users of a tenant.

You can access the sign-in logs by using the Azure portal, Microsoft Graph, and PowerShell.  

## Required administrator roles 

To see applied Conditional Access policies in the sign-in logs, administrators must have permissions to view *both* the logs and the policies. The least privileged built-in role that grants *both* permissions is *Security Reader*. As a best practice, your Global Administrator should add the Security Reader role to the related administrator accounts. 

The following built-in roles grant permissions to *read Conditional Access policies*:

- Global Administrator 
- Global Reader 
- Security Administrator 
- Security Reader 
- Conditional Access Administrator 

The following built-in roles grant permission to *view sign-in logs*: 

- Global Administrator 
- Security Administrator 
- Security Reader 
- Global Reader 
- Reports Reader 

## Permissions for client apps 

If you use a client app to pull sign-in logs from Microsoft Graph, your app needs permissions to receive the `appliedConditionalAccessPolicy` resource from Microsoft Graph. As a best practice, assign `Policy.Read.ConditionalAccess` because it's the least privileged permission. 

Any of the following permissions is sufficient for a client app to access applied Conditional Access policies in sign-in logs through Microsoft Graph: 

- `Policy.Read.ConditionalAccess` 
- `Policy.ReadWrite.ConditionalAccess` 
- `Policy.Read.All` 

## Permissions for PowerShell 

Like any other client app, the Microsoft Graph PowerShell module needs client permissions to access applied Conditional Access policies in the sign-in logs. To successfully pull applied Conditional Access policies in the sign-in logs, you must consent to the necessary permissions with your administrator account for Microsoft Graph PowerShell. As a best practice, consent to:

- `Policy.Read.ConditionalAccess`
- `AuditLog.Read.All` 
- `Directory.Read.All` 

The following permissions are the least privileged permissions with the necessary access:

- To consent to the necessary permissions: `Connect-MgGraph -Scopes Policy.Read.ConditionalAccess, AuditLog.Read.All, Directory.Read.All`
- To view the sign-in logs: `Get-MgAuditLogSignIn`

For more information about this cmdlet, see [Get-MgAuditLogSignIn](/powershell/module/microsoft.graph.reports/get-mgauditlogsignin).

The Azure AD Graph PowerShell module doesn't support viewing applied Conditional Access policies. Only the Microsoft Graph PowerShell module returns applied Conditional Access policies.  

## View Conditional Access policies in Azure AD sign-in logs

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

The activity details of sign-in logs contain several tabs. The **Conditional Access** tab lists the Conditional Access policies applied to that sign-in event. 

1. Sign in to the [Azure portal](https://portal.azure.com) using the Security Reader role.
1. In the **Monitoring** section, select **Sign-in logs**. 
1. Select  a sign-in item from the table to open the **Activity Details: Sign-ins context** pane.  
1. Select the **Conditional Access** tab.

If you don't see the Conditional Access policies, confirm you're using a role that provides access to both the sign-in logs and the Conditional Access policies.

## Next steps

* [Troubleshoot sign-in problems](../conditional-access/troubleshoot-conditional-access.md#azure-ad-sign-in-events)
* [Review the Conditional Access sign-in logs FAQs](reports-faq.yml#conditional-access)
* [Learn about the sign-in logs](concept-sign-ins.md)
