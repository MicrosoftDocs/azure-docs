---
title: How to Link an Azure Subscription to Azure AD B2C | Microsoft Docs
description: Step-by-step guide to enable billing for Azure AD B2C into an Azure subscription.
services: active-directory-b2c
documentationcenter: dev-center-name
author: rojasja
manager: mbaldwin


ms.service: active-directory-b2c
ms.devlang: may be required
ms.topic: article
ms.tgt_pltfrm: may be required
ms.workload: identity
ms.date: 12/05/2016
ms.author: Your MSFT alias or your full email address;semicolon separates two or more aliases

---
# Linking and Azure Subscription to an Azure B2C tenant to pay for usage charges

Ongoing usage charges for Azure Active Directory B2C (or Azure AD B2C) are billed to an Azure Subscription.  In most cases, it is necessary for the tenant administrator to link or create an association between the Azure AD B2C tenant and an Azure subscription after creating the B2C tenant itself.  This is achieved by creating an Azure "B2C Tenant" resource in the target Azure subscription.  Many B2C Tenants can be linked to a single Azure subscription along with other Azure resources (e.g. VMs, Data storage, LogicApps)

[!IMPORTANT]
For the latest information on usage billing and pricing for B2C visit the [Azure AD B2C Pricing](
https://azure.microsoft.com/pricing/details/active-directory-b2c/)

## Step 1 - Create an Azure AD B2C Tenant

B2C tenant creation must be completed first.  Skip this step if you have already created your target B2C Tenant.   [Get started with Azure AD B2C](https://azure.microsoft.com/documentation/articles/active-directory-b2c-get-started/)

## Step 2 - Open Azure portal in the Azure AD Tenant trusted by your Azure subscription
Navigate to portal.azure.com.  Switch Directory to Azure AD Tenant that is trusted by your target Azure AD subscription.  Within the Azure portal, click on the account name on the upper right of the dashboard to select the Azure AD Tenant.  This tenant is not an Azure AD B2C tenant.  An Azure subscription is needed to proceed. [Get an Azure Subscription](https://account.windowsazure.com/signup?showCatalog=True)

![Switching to your Azure AD Tenant](.media/active-directory-b2c/SelectAzureADTenant.png)

## Step 3 - Create a B2C Tenant resource in Azure Marketplace
Open Marketplace by clicking on the Marketplace icon, or selecting the green "+" in the upper left corner of the dashboard.  Search for and select Azure Active Directory B2C. Select Create.
![Select Marketplace](./marketplace.png)

![Search AD B2C](.media/active-directory-b2c/searchb2c.png)

The Azure AD B2C Resource create dialog covers the following parameters:

1. Azure AD B2C Tenant – Select an Azure AD B2C Tenant from the dropdown.  Only eligible Azure AD B2C tenants will show.  Eligible B2C tenants meet these conditions: The current user is a global administrator of the B2C Tenant, and the B2C Tenant is not currently associated to an Azure subscription.

2. Azure AD Resource name - is preselected to match the domain name of the B2C Tenant.

3. Subscription - An Azure subscription in which the current user is an administrator or a co-administrator.  Multiple Azure AD B2C Tenants may be added to one Azure subscription

4. Resource Group and Location - This is an artifact to help you organize multiple Azure resources.  this choice has no impact on your B2C Tenant location, performance, or billing status

5. Pin to dashboard for easiest access to your B2C Tenant billing information and the B2C Tenant settings
![Create B2C Resource](.media/active-directory-b2c/createresourceb2c.png)

## Step 4 - Manage your B2C Tenant resources (optional)
Once deployment is complete a new "B2C Tenant" resource is created under the target resource group and related Azure subscription.  You should see a new resource of type "B2C Tenant" has been added alongside your other Azure resources.

![Create B2C Resource](.media/active-directory-b2c/b2cresourcedashboard.png)

By clicking on the B2C Tenant resource, you are able to
- Click on Subscription name to review billing information. See Billing & Usage.
- Click on B2C Settings to open a new browser tab directly in to your B2C Tenant Settings blade
- Submit a support request
- Move your B2C Tenant resource to another Azure Subscription, or to another Resource Group.  This choice will change which Azure subscription will receive usage charges.

![B2C Resource settings](.media/active-directory-b2c/b2cresourcesettings.png)


## Next steps
Once these steps are complete for each of your B2C Tenants, your Azure subscription will be billed in accordance with you Azure Direct or Enterprise Agreement details.
- Review usage and billing within you selected Azure subscription
- Review detailed day-by-day usage reports using the Usage Reporting API (TBD)



<!--Reference style links - using these makes the source content way more readable than using inline links-->
[gog]: http://google.com/        
[yah]: http://search.yahoo.com/  
[msn]: http://search.msn.com/    
