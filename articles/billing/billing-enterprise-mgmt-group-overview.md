---
title: Organzie your resources with Azure Management Groups - Azure | Microsoft Docs
description: Learn about the management groups and how to use them. 
services: ''
documentationcenter: ''
author: rthorn17
manager: rithorn
editor: ''
tags: billing

ms.assetid: 
ms.service: billing
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/25/2017
ms.author: rithorn

experimental: true
experimental_id: "a2b2579c-cd2e-41"
---


# Organize your resources with Azure Management Groups 

If you have multiple subscriptions, you can organize them under management groups to help you manage access, policy, costs, and compliance across your subscriptions. As an example, you can apply policies to a management group that limit which resource types can be created.
 
A few items to note: 
* Management groups are currently available to Azure Enterprise Agreement customers in the Azure Global cloud. 
* Support for the following customers will be enabled in future releases. 
    * Pay-as-You Go customers 
    * Partners 
    * Azure Government
    * Germany and China clouds 

The structure shown here is a sample representation of a management group hierarchy that you can create:

![Hierarchy Tree](media/billing-enterprise-mgmt-groups/tree.png)

## How management groups are related to Azure Active Directory
Like subscriptions, management groups also have a trust relationship with Azure AD. A management group hierarchy trusts a single directory to authenticate users. All admins associated with a management group hierarchy must belong to the same directory.

## How management groups are related to your Azure Enterprise Enrollment
The introduction of management groups is the first step in unifying the Enterprise portal (https://ea.azure.com) and the Azure portal.

The [Enterprise Agreement (EA)](https://azure.microsoft.com/en-us/pricing/enterprise-agreement/https:/azure.microsoft.com/en-us/pricing/enterprise-agreement/) enrollment defines the shape and use of Azure services within a company and is the core governance structure. Within the enrollment, customers can subdivide the environment into departments, accounts, and finally, subscriptions. 

The management group structure is created in the environment that you have defined in the Enterprise portal. The entire hierarchy consisting of Enrollment, Departments, and Accounts are mapped to corresponding management groups – all associated with the same directory. Where possible, an existing directory associated with the Enrollment user accounts is selected. In some cases, a new directory is created and all existing Enrollment users are invited into that directory. This new directory does not impact the directories associated with the subscriptions in the enrollment. Therefore, the hierarchy might get created in a directory different from the subscriptions. [Learn more](https://microsoft-my.sharepoint.com/personal/rithorn_microsoft_com/Documents/EA/Phase%201%20Spec/Docs/How%20to%20find%20an%20Azure%20Subscription%20or%20Management%20Group%20while%20in%20multiple%20directories.docx?web=1)  about how this process impacts the experience of navigating between the hierarchy and its subscriptions.

Here is how the current EA structure maps to management group hierarchy. The initial management group hierarchy is seeded with the hierarchy defined in your enterprise enrollment. 

![Hierarchy Tree](media/billing-enterprise-mgmt-groups/tree2.png)

The users from the Enterprise portal are added with a role to manage the mapped management group node.

|    EA role                                       |    Role on the mapped management   group node    |    Permissions on management   group node                                                         |
|--------------------------------------------------|--------------------------------------------------|---------------------------------------------------------------------------------------------------|
|    EA Administrator                              |    Resource Policy Contributor                   |    -            View costs   -            Manage resource policy   -            View hierarchy    |
|    EA Administrator in read-only mode            |    Billing Reader                                |    -            Read costs   -            View hierarchy                                          |
|    Department Administrator                      |    Billing Reader                                |    -                                                                                              |
|    Department Administrator in read-only mode    |    Billing Reader                                |    -                                                                                              |
|    Account Owner                                 |    Resource Policy Contributor                   |    -                                                                                              |


## View management groups in the Azure portal

View an enrollment, department, or account costs  
1.	Sign in to the Azure portal 
2.	Browse for management groups along the left navigation 
3.	To see the details of the management group, select a management group’s name.

<p style="font-size:12px; background-color:yellow">Placeholder image<p>

![Management Groups](media/billing-enterprise-mgmt-groups/mgmt-groups-main.png)

### Viewing Costs 
On the detail screens of management groups, you see the current month to date costs.  These costs are based on usage and do not account for prepaid amounts, overages, included quantities, adjustments, and taxes.  

For management groups with the type of enrollment, the costs section shows you the commitment remaining.  This displayed cost is based on your current costs against commitment vs your total annual commitment.  

“Costs billed separately” are the monthly accumulation of separate changes like marketplace, overages, and other costs that do not go against your enrollment’s commitment.  For more information about the costs breakout, see the Enterprise portal. 

<p style="font-size:12 px; background-color:yellow"">Placeholder image<p>

![Detail Page](media/billing-enterprise-mgmt-groups/enterprise-detail.png)

## Enabling access to costs
If you are not seeing costs, see our [Troubleshooting Cost View](https://azure.com) document to help/  

## Notes about this preview release: 
•	Amounts displayed within the Azure portal might be delayed compared to values in the Enterprise portal. This issue is temporary and is being worked on.
•	A delay of several minutes is expected in the Azure portal when making changes to settings in the Enterprise portal. 


## Administering your management groups
Management groups within the Azure portal are in preview and are read-only at this initial release. To make any updates, go to the Enterprise portal. Your updates are reflected in the Azure portal automatically. 
See the documentation within the enterprise portal for help on making edits and additions.   

## Policy Management
Resource Manager enables you to create customized policies for managing your resources. With management groups, polices can be assigned at any level in the hierarchy and the resources inherit those policies.  Learn more

 Note: policy is not enforced across directories. 
