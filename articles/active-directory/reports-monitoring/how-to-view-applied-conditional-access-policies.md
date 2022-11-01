---

title: How to view applied conditional access policies in the Azure AD sign-in logs | Microsoft Docs
description: Learn how to view applied conditional access policies in the Azure AD sign-in logs
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

# How to: View applied conditional access policies in the Azure AD sign-in logs

With conditional access policies, you can control, how your users get access to the resources of your Azure tenant. As a tenant admin, you need to be able to determine what impact your conditional access policies have on sign-ins to your tenant, so that you can take action if necessary. The sign-in logs in Azure AD provide you with the information you need to assess the impact of your policies.

  
This article explains how you can get access to the information about applied conditional access policies. 


## What you should know

As an Azure AD administrator, you can use the sign-in logs to:

- Troubleshoot sign in problems
- Check on feature performance
- Evaluate security of a tenant

Some scenarios require you to get an understanding for how your conditional access policies were applied to a sign-in event. Common examples include:

- **Helpdesk administrators** who need to look at applied conditional access policies to understand if a policy is the root cause of a ticket opened by a user. 

- **Tenant administrators** who need to verify that conditional access policies have the intended impact on the users of a tenant.


You can access the sign-in logs using the Azure portal, MS Graph, and PowerShell.  



## Required administrator roles 


To see applied conditional access policies in the sign-in logs, administrators must have permissions to:  

- View sign-in logs 
- View conditional access policies

The least privileged built-in role that grants both permissions is the **Security Reader**. As a best practice, your global administrator should add the **Security Reader** role to the related administrator accounts. 


The following built in roles grant permissions to read conditional access policies:

- Global Administrator 

- Global Reader 

- Security Administrator 

- Security Reader 

- Conditional Access Administrator 


The following built in roles grant permission to view sign-in logs: 

- Global Administrator 

- Security Administrator 

- Security Reader 

- Global Reader 

- Reports Reader 


## Permissions for client apps 

If you use a client app to pull sign-in logs from Graph, your app needs permissions to receive the **appliedConditionalAccessPolicy** resource from Graph. As a best practice, assign **Policy.Read.ConditionalAccess** because it's the least privileged permission. Any of the following permissions is sufficient for a client app to access applied CA policies in sign-in logs through Graph: 

- Policy.Read.ConditionalAccess 

- Policy.ReadWrite.ConditionalAccess 

- Policy.Read.All 

 

## Permissions for PowerShell 

Like any other client app, the Microsoft Graph PowerShell module needs client permissions to access applied conditional access policies in the sign-in logs. To successfully pull applied conditional access in the sign-in logs, you must consent to the necessary permissions with your administrator account for MS Graph PowerShell. As a best practice, consent to:

- Policy.Read.ConditionalAccess
- AuditLog.Read.All 
- Directory.Read.All 

These permissions are the least privileged permissions with the necessary access. 

To consent to the necessary permissions, use: 

` Connect-MgGraph -Scopes Policy.Read.ConditionalAccess, AuditLog.Read.All, Directory.Read.All `

To view the sign-in logs, use: 

`Get-MgAuditLogSignIn `

The output of this cmdlet contains a **AppliedConditionalAccessPolicies** property that shows all the conditional access policies applied to the sign-in. 

For more information about this cmdlet, see [Get-MgAuditLogSignIn](https://docs.microsoft.com/powershell/module/microsoft.graph.reports/get-mgauditlogsignin?view=graph-powershell-1.0).

The AzureAD Graph PowerShell module doesn't support viewing applied conditional access policies; only the Microsoft Graph PowerShell module returns applied conditional access policies.  

## Confirming access 

In the **Conditional Access** tab, you see a list of conditional access policies applied to that sign-in event.  


To confirm that you have admin access to view applied conditional access policies in the sign-ins logs, do: 

1. Navigate to the Azure portal. 

2. In the top-right corner, select your directory, and then select **Azure Active Directory** in the left navigation pane. 

3. In the **Monitoring** section, select **Sign-in logs**. 

4. Click an item in the sign-in row table to bring up the Activity Details: Sign-ins context pane.  

5. Click on the Conditional Access tab in the context pane. If your screen is small, you may need to click the ellipsis […] to see all context pane tabs.  




## Next steps

* [Sign-ins error codes reference](./concept-sign-ins.md)
* [Sign-ins report overview](concept-sign-ins.md)