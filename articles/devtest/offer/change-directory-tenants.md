---
title: Change directory tenants with your individual VSS Azure Subscriptions
description: How-to guide for changing directory tenants with your Azure subscriptions. Provides an overview of identity and access management.
author: j-martens
ms.author: jmartens
ms.prod: visual-studio-windows
ms.topic: how-to 
ms.date: 09/30/2021
ms.custom: devtestoffer
---

## Change Directory Tenants with your Azure Subscriptions  

Organizations may have several Azure credit subscriptions. Each subscription an organization sets up is associated with an [Azure Active Directory](https://docs.microsoft.com/en-us/azure/active-directory/fundamentals/active-directory-whatis) \(AAD\).  

AAD is Microsoft’s cloud-based identity and access management service that helps your employees sign in and access internal and external resources.  

As an individual user, you may need to change the Active Directory you’re working in or [transfer your subscription to another Active Directory](https://docs.microsoft.com/en-us/azure/role-based-access-control/transfer-subscription).  

When activating your subscription, your identity is created based on the email you use. That identity is either associated with your organization’s Active Directory tenant or a new directory tenant is created for that identity. You can see the identity you’re logged in under in the upper right-hand side of your Azure portal.  

![A screenshot of the Azure portal with the identity highlighted in the upper right-hand corner.](media/change-directory-tenants/identity.png "The logged in identity is in the upper right-hand corner of your Azure portal.")  

From here, you can either switch identities or switch directories. You may need to change your identity to access certain directories.  

If the identity you’re sign in as is associated with multiple directories, you can easily switch by clicking “Switch directory.” You'll then see the directories that identity is associated with.  

![A screenshot of the Directory and Subscription window in Azure portal.](media/change-directory-tenants/switchdirectory.png "Switch directories by clicking switch directory. Choose the directory you want.")  

Your experience within the portal is highly dependent on the directory associated with the identity used to sign in. To change directory tenants, an Admin will have to add your identity as a user within the target directory.  

## Importance of Changing Your Azure Active Directory Tenant  

When setting up your Azure Credit Subscription through a Visual Studio license, you can use a work email to create your identity or a personal email that is not associated with your organization.  

If you set up your credit subscription using a personal account, your identity and work is isolated from your organization’s active directory. Let’s say you've worked on a new app. That app needed its own subscription for test and learn before deployment. Now, though, you need access to your organization’s work or references. Changing your directory’s tenant is the best way for you to access your organization’s resources and for them to access yours.  

Below is a simple diagram that shows the basic steps you'll take when changing or transferring your subscription.

![A diagram illustrating changing or transferring your subscription.](images/changediagram.png "A diagram of what happens when you change or transfer your subscription.)

## Identity and Access Management

Where and how you have access dictates what you see based on your logged in credentials. This access can be given at different levels within the organization’s hierarchy. You can be given access at the directory level, subscription level or within resource groups.  

![A screenshot of Azure access levels.](media/change-directory-tenants/accessmanagement.png "The access levels available in Azure.")  

You can see and manage your access levels within Access Control. You can also manage others' access to the subscription depending on your access levels.  

![A screenshot of the Visual Studio Subscription access control page.](media/change-directory-tenants/accesscontrol.png "Manage access to your subscription.")

## How to Change your Azure Directory Tenant

To access another Active Directory, you must have an active account with the necessary permissions and access before you can change directory tenants. An admin within the directory tenant you wish to access can either add you as:

* User
* Guest  

Once you’ve been added and given the proper permissions, you can switch directories within your subscription.  

1. Sign in and select the subscription you want to use from the [Subscriptions page in Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade)  
2. Select “Change Directory”  

 ![A screenshot a Contoso Enterprise Subscription page with Change Directory highlighted.](media/change-directory-tenants/changedirectory.png "Select Change Directory.")

3. A pop-up will surface to choose the new directory  
4. Select “Change”  

> [!NOTE]
> If you don’t have access to the target directory it will not show. After the directory is changed for the subscription, you will receive a success message.  
 
 ![A screenshot of the Change Directory validation page.](media/change-directory-tenants/changebutton.png "Select the directory from the dropdown and click the Change button.")

5. Select “Switch Directories” on the subscription page to access the new directory  

 ![A screenshot of the subscriptions page with Switch Directories highlighted.](media/change-directory-tenants/switchdirectoriesoutlined.png "Click Switch Directories to access the new directory.")

You can also add an Admin from the target directory as an Admin within your directory. Follow [these instructions](https://docs.microsoft.com/en-us/visualstudio/subscriptions/cloud-admin) on how to add an Admin to your subscription. Once that’s been done, the Admin has access to both directories and can change the tenant directory for you.  
