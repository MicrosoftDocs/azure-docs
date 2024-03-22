---
title: "Quickstart: Creating a Arc Site"
description: "Describes how to create a Arc Site"
author: kgremban
ms.author: kgremban
ms.service: azure-arc
#ms.subservice: site-manager
ms.topic: quickstart  #Don't change
ms.date: 03/06/2024

#customer intent: As a admin who manages my sites as resource groups in Azure, I want to represent them as Arc Sites and so that I can benefit from logical representation and extended functionality in Arc for my resources under my resource groups.

---
  
# Quickstart: Creating a site in Azure Arc site manager
 

The purpose of this quickstart is to enable starting with Azure Arc site manager and guides on how to create an initial site for resources currently grouped within a single resource group. In this quickstart, you create your first site. Once you create your first Arc site, you're ready to view your resources within Arc, and conduct actions that depend on the specific resources, such as viewing Inventory, Connectivity status, Updates, and Alerts.

For current status on which resources support what functions within Arc sites, view the [Azure Arc site manager overview](overview.md).

Additionally, if you don't have a service subscription, create a free trial account in Azure [here](https://azure.microsoft.com/free/).

## Prerequisites

* Azure portal Access
* Internet Connectivity
* Subscription
* Resource Group or Subscription with at least one compatible resource type for Site (note: it's beneficial to try to name the resource group a similar name to the real site function, for the example of this article, the resource group is named **California**)

## Open Azure Arc site manager

Navigate to Azure Arc site manager the via **Azure Arc** [pane](https://ms.portal.azure.com/#blade/Microsoft_Azure_HybridCompute/AzureArcCenterBlade) in Azure in which **Site manager** will be displayed on the left side. 
![view of site manager from the azure arc portal](./media/quickstart/arc_portal_main.png)

Alternatively, you can also search for **Azure Arc site manager** in the Azure portal or **Sites - Azure Arc** using terms such as **site**, **Arc Site**, **site manager** and so on.
![search view for azure arc site manager](./media/quickstart/portal_search_site.png)

Once you locate **Azure Arc site manager**, select to open the main page of Azure Arc site manager, which will appear as shown below.
![main landing page for azure arc site manager](./media/quickstart/azure_portal_site_manager.png)

## Create your site

1. Select the blue box icon that says **Create a site**.
![site manager page that highlights the creating a site button](./media/quickstart/create_a_site_button.png)
2. Fill in the details for your first site. While these details may change, at the time of this article the required details are:
    * Site scope: subscription or resource group.
     *Note:* The scope can be defined only at the time of creating a site and can't be modified later. By defining the scope for a site, all the resources in the scope can be viewed and managed from site manager.
    * Site name: custom name for site.
    * Display name: custom display name for site.
    * Subscription: subscription for the site to be created under.
    * Address: Physical address for a site.
3. Once these details are provided, select **Review + create** and you're brought to a summary page to review and confirm the site details prior to creation.
![populated site creation for a site called california](./media/quickstart/create_a_site_page_california.png)
4. Select **Create** to create your site.
![final page to create a california site](./media/quickstart/final_create_screen_arc_site.png)


## View and Delete your newly created site

1. Navigate back to the main **site manager** page in **Azure Arc** and then to the **Sites** tab at the top of Azure Arc site manager. 
![site manager page that highlights the overview button](./media/quickstart/sites_button_from_site_manager.png)
2. Here you should find your newly created site. [Note: For demo purposes, the image contains the site **London** as well as **California** to show how multiple sites will be displayed].
![overview page in site manager that highlights a longdon site](./media/quickstart/california_site_select.png)
3. To manage your site, you can select the site to navigate to the specific site’s resource page and perform the delete action. If you wish to delete your site, you can also do so from within the created site.
![california site deletion button highlighted](./media/quickstart/california_site_main_page_delete.png)
    
    *Note:* Deleting a site doesn't affect the resources or the resource group and subscription in its scope. After a site is deleted, the resources of that site can't be viewed or managed from site manager.
    *Note:* A new site can be created for the resource group or the subscription after the original site is deleted.

## Related content

- [Azure Arc](https://azure.microsoft.com/products/azure-arc/)
