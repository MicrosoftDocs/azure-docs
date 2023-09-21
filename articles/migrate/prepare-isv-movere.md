---
title: Prepare Azure Migrate to work with an ISV tool/Movere 
description: This article describes how to prepare Azure Migrate to work with an ISV tool or Movere, and then how to start using the tool. 
author: jyothisuri
ms.author: jsuri
ms.manager: abhemraj
ms.topic: how-to
ms.date: 10/15/2020
ms.custom: engagement-fy23
---

# Prepare to work with an ISV tool or Movere

If you've added an [ISV tool](migrate-services-overview.md#isv-integration) or Movere to an Azure Migrate project, there are a few steps to follow before you link the tool and send data to Azure Migrate. 

## Check Azure AD permissions

Your Azure user account needs these permissions:

- Permission to register an Azure Active Directory (Azure AD) app with your Azure tenant
- Permission to allocate a role to the Azure AD app at the subscription level


### Set permissions to register an Azure AD app

1. In Azure AD, check the role for your account.
2. If you have the user role, select **User settings** on the left and verify whether users can register applications. If it's set to **Yes**, any users in the Azure AD tenant can register an app. If it's set to **No**, then only admin users can register apps.   
3. If you don't have permissions, an admin user can provide your user account with the [Application Administrator](../active-directory/roles/permissions-reference.md#application-administrator) role, so that you can register the app.
4. After the tool is linked to Azure Migrate, the admin can remove the role from your account.

### Set permissions to assign a role to an Azure AD app
 
In your Azure subscription, your account needs **Microsoft.Authorization/*/Write** access to assign a role to an Azure AD app. 

1. In the Azure portal, open **Subscriptions**.
2. Select the relevant subscription. If you don't see it, select the **global subscriptions filter**. 
3. Select **My permissions**. Then, select **Click here to view complete access details for this subscription**.
4. In **Role assignments** > **View**, check the permissions. If your account doesn't have permissions, ask the subscription administrator to add you to [User Access Administrator](../role-based-access-control/built-in-roles.md#user-access-administrator) role or the [Owner](../role-based-access-control/built-in-roles.md#owner) role.

## Allow access to URLs

For ISV tools and Azure Database Migration Assistant, allow access to the public cloud URLs summarized in the table. If you're using a URL-based proxy to connect to the internet, make sure that the proxy resolves any CNAME records received while looking up the URLs. 

**URL** | **Details**
--- | ---
*.portal.azure.com 	| Navigate to the Azure portal. 
*.windows.net<br/> *.msftauth.net<br/> *.msauth.net <br/> *.microsoft.com<br/> *.live.com 	| Sign in to your Azure subscription. 
*.microsoftonline.com<br/> *.microsoftonline-p.com | Create Azure Active Directory (AD) apps for the appliance to communicate with Azure Migrate. 
management.azure.com | Make Azure Resource Manager calls to the Azure Migrate Project.
*.servicebus.windows.net | Communication between the appliance and EventHub for sending the messages.


## Start using the tool

1. If you don't yet have a license or free trial for the tool, in the tool entry in Azure Migrate, in **Register**, select **Learn more**.
2. In the tool, follow the instructions to link from the tool to the Azure Migrate project, and to send data to Azure Migrate.

## Next steps

Follow the instructions from your ISV or Movere to send data to Azure Migrate.

   
