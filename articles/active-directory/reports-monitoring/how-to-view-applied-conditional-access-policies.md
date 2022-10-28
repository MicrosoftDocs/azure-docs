---

title: View applied Conditional Access policies in Azure AD sign-in logs
description: Learn how to view Conditional Access policies in Azure AD sign-in logs so that you can assess the impact of those policies.
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: amycolannino
editor: ''

ms.service: active-directory
ms.topic: how-to
ms.workload: identity
ms.subservice: report-monitor
ms.date: 09/14/2022
ms.author: markvi
ms.reviewer: besiler 

ms.collection: M365-identity-device-management
---

# View applied Conditional Access policies in Azure AD sign-in logs

With Conditional Access policies, you can control how your users get access to the resources of your Azure tenant. As a tenant admin, you need to be able to determine what impact your Conditional Access policies have on sign-ins to your tenant, so that you can take action if necessary. 

The sign-in logs in Azure Active Directory (Azure AD) give you the information that you need to assess the impact of your policies. This article explains how to view applied Conditional Access policies in those logs.

## What you should know

As an Azure AD administrator, you can use the sign-in logs to:

- Troubleshoot sign-in problems.
- Check on feature performance.
- Evaluate the security of a tenant.

Some scenarios require you to get an understanding of how your Conditional Access policies were applied to a sign-in event. Common examples include:

- *Helpdesk administrators* who need to look at applied Conditional Access policies to understand if a policy is the root cause of a ticket that a user opened. 

- *Tenant administrators* who need to verify that Conditional Access policies have the intended impact on the users of a tenant.

You can access the sign-in logs by using the Azure portal, Microsoft Graph, and PowerShell.  

## Required administrator roles 

To see applied Conditional Access policies in the sign-in logs, administrators must have permissions to view both the logs and the policies.

The least privileged built-in role that grants both permissions is *Security Reader*. As a best practice, your global administrator should add the Security Reader role to the related administrator accounts. 

The following built-in roles grant permissions to read Conditional Access policies:

- Global Administrator 

- Global Reader 

- Security Administrator 

- Security Reader 

- Conditional Access Administrator 


The following built-in roles grant permission to view sign-in logs: 

- Global Administrator 

- Security Administrator 

- Security Reader 

- Global Reader 

- Reports Reader 

## Permissions for client apps 

If you use a client app to pull sign-in logs from Microsoft Graph, your app needs permissions to receive the `appliedConditionalAccessPolicy` resource from Microsoft Graph. As a best practice, assign `Policy.Read.ConditionalAccess` because it's the least privileged permission. 

Any of the following permissions is sufficient for a client app to access applied certificate authority (CA) policies in sign-in logs through Microsoft Graph: 

- `Policy.Read.ConditionalAccess` 

- `Policy.ReadWrite.ConditionalAccess` 

- `Policy.Read.All` 

## Permissions for PowerShell 

Like any other client app, the Microsoft Graph PowerShell module needs client permissions to access applied Conditional Access policies in the sign-in logs. To successfully pull applied Conditional Access policies in the sign-in logs, you must consent to the necessary permissions with your administrator account for Microsoft Graph PowerShell. As a best practice, consent to:

- `Policy.Read.ConditionalAccess`
- `AuditLog.Read.All` 
- `Directory.Read.All` 

These permissions are the least privileged permissions with the necessary access. 

To consent to the necessary permissions, use: 

`Connect-MgGraph -Scopes Policy.Read.ConditionalAccess, AuditLog.Read.All, Directory.Read.All`

To view the sign-in logs, use: 

`Get-MgAuditLogSignIn`

For more information about this cmdlet, see [Get-MgAuditLogSignIn](https://learn.microsoft.com/powershell/module/microsoft.graph.reports/get-mgauditlogsignin?view=graph-powershell-1.0).

The Azure AD Graph PowerShell module doesn't support viewing applied Conditional Access policies. Only the Microsoft Graph PowerShell module returns applied Conditional Access policies.  

## Confirming access 

On the **Conditional Access** tab, you see a list of Conditional Access policies applied to that sign-in event. 

To confirm that you have admin access to view applied Conditional Access policies in the sign-in logs: 

1. Go to the Azure portal. 

2. In the upper-right corner, select your directory, and then select **Azure Active Directory** on the left pane. 

3. In the **Monitoring** section, select **Sign-in logs**. 

4. Select an item in the sign-in table to open the **Activity Details: Sign-ins context** pane.  

5. Select the **Conditional Access** tab on the context pane. If your screen is small, you might need to select the ellipsis (**...**) to see all tabs on the context pane.  

## Next steps

* [Sign-in error code reference](./concept-sign-ins.md)
* [Sign-in report overview](concept-sign-ins.md)
