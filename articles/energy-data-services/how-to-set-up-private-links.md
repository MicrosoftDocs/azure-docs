---
title: Microsoft Energy Data Services - how to set up private links #Required; page title is displayed in search results. Include the brand.
description: Guide to set up private links on Microsoft Energy Data Services #Required; article description that is displayed in search results. 
author: Lakshmisha-KS #Required; your GitHub user alias, with correct capitalization.
ms.author: lakshmishaks #Required; microsoft alias of author; optional team alias.
ms.service: energy-data-services #Required; service per approved list. slug assigned by ACOM.
ms.topic: how-to #Required; leave this attribute/value as-is.
ms.date: 09/29/2022
ms.custom: template-concept #Required; leave this attribute/value as-is.
#Customer intent: As a developer, I want to set up private links on Microsoft Energy Data Services
---

# Private Links in Microsoft Energy Data Services
[Azure Private Link](../private-link/private-link-overview.md) provides private connectivity from a virtual network to Azure platform as a service (PaaS). It simplifies the network architecture and secures the connection between endpoints in Azure by eliminating data exposure to the public internet.
By using Azure Private Link, you can connect to a Microsoft Energy Data Services Preview instance from your virtual network via a private endpoint, which is a set of private IP addresses in a subnet within the virtual network.


You can then limit access to your Microsoft Energy Data Services Preview instance over these private IP addresses. 
You can connect to a Microsoft Energy Data Services configured with Private Link by using the automatic or manual approval method. To [learn more](../private-link/private-endpoint-overview.md#access-to-a-private-link-resource-using-approval-workflow), see the Approval workflow section of the Private Link documentation.


This article describes how to set up private endpoints for Microsoft Energy Data Services Preview. 

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

## Pre-requisites

Create a virtual network in the same subscription as the Microsoft Energy Data Services instance. [Learn more](../virtual-network/quick-create-portal.md). This will allow auto-approval of the private link endpoint.

## Create a private endpoint by using the Azure portal

Use the following steps to create a private endpoint for an existing Microsoft Energy Data Services instance by using the Azure portal:
1.	From the **All resources** pane, choose a Microsoft Energy Data Services Preview instance.
2.	Select **Networking** from the list of settings.
 
    [![Screenshot of public access under Networking tab for Private Links.](media/how-to-manage-private-links/private-links-1-Networking.png)](media/how-to-manage-private-links/private-links-1-Networking.png#lightbox)
  
   
3.	Select **Public Access** and select **Enabled from all networks** to allow traffic from all networks.
4.	To block traffic from all networks, select **Disabled**.
5.	Select **Private access** tab and select **Create a private endpoint**, to create a Private Endpoint Connection.
 
    [![Screenshot of private access for Private Links.](media/how-to-manage-private-links/private-links-2-create-private-endpoint.png)](media/how-to-manage-private-links/private-links-2-create-private-endpoint.png#lightbox)
 
6.	In the Create a private endpoint - **Basics pane**, enter or select the following details:

    |Setting|	Value|
    |--------|-----|
    |Project details|
    |Subscription|	Select your subscription.|
    |Resource group|	Select a resource group.|
    |Instance details|	
    |Name|	Enter any name for your private endpoint. If this name is taken, create a unique one.|
    |Region|	Select the region where you want to deploy Private Link. |

    [![Screenshot of creating a MEDS instance with private link.](media/how-to-manage-private-links/private-links-3-basics.png)](media/how-to-manage-private-links/private-links-3-basics.png#lightbox)
	
> [!NOTE]
> Auto-approval only happens when the Microsoft Energy Data Services Preview instance and the vnet for the private link are in the same subscription.


7.	Select **Next: Resource.**
8.	In **Create a private endpoint - Resource**, the following information should be selected or available:

    |Setting |	Value |
    |--------|--------|
    |Subscription|	Your subscription.|
    |Resource type|	Microsoft.OpenEnergyPlatform/energyServices|
    |Resource	|Your Microsoft Energy Data Services instance.|
    |Target sub-resource|	This defaults to MEDS. |
	
    [![Screenshot of resource tab for private link during a MEDS instance creation.](media/how-to-manage-private-links/private-links-4-resource.png)](media/how-to-manage-private-links/private-links-4-resource.png#lightbox)

 
9.	Select **Next: Virtual Network.**
10. In the Virtual Network screen, you can:

    * Configure Networking and Private IP Configuration settings. [Learn more](../private-link/create-private-endpoint-portal.md#create-a-private-endpoint)

    * Configure private endpoint with ASG. [Learn more](../private-link/configure-asg-private-endpoint.md#create-private-endpoint-with-an-asg)

    [![Screenshot of virtual network tab for private link during a MEDS instance creation.](media/how-to-manage-private-links/private-links-4-virtual-network.png)](media/how-to-manage-private-links/private-links-4-virtual-network.png#lightbox)


11. Select **Next: DNS**. You can leave the default settings or learn more about DNS configuration. [Learn more](../private-link/private-endpoint-overview.md#dns-configuration)


    [![Screenshot of DNS tab for private link during a MEDS instance creation.](media/how-to-manage-private-links/private-links-5-dns.png)](media/how-to-manage-private-links/private-links-5-dns.png#lightbox)

12. Select **Next: Tags** and add tags to categorize resources.
13. Select **Review + create**. On the Review + create page, Azure validates your configuration.
14. When you see the Validation passed message, select **Create**.

    [![Screenshot of summary screen while creating MEDS instance.](media/how-to-manage-private-links/private-links-6-review.png)](media/how-to-manage-private-links/private-links-6-review.png#lightbox)

 
15. Once the deployment is complete, select **Go to resource**. 

    [![Screenshot of MEDS resource created.](media/how-to-manage-private-links/private-links-7-deploy.png)](media/how-to-manage-private-links/private-links-7-deploy.png#lightbox)
 
 
16. The Private Endpoint created is **Auto-approved**.

    [![Screenshot of private link created with auto-approval.](media/how-to-manage-private-links/private-links-8-request-response.png)](media/how-to-manage-private-links/private-links-8-request-response.png#lightbox)
 
17. Select the **Microsoft Energy Data Services** instance and navigate to the **Networking** tab to see the Private Endpoint created.

    [![Screenshot of private link showing connection state as auto-approved.](media/how-to-manage-private-links/private-links-9-auto-approved.png)](media/how-to-manage-private-links/private-links-9-auto-approved.png#lightbox)


18. When the Microsoft Energy Data Services and vnet are in different tenants or subscriptions, you will be required to **Approve** or **Reject** the **Private Endpoint** creation request. 

    [![Screenshot of private link showing approve or reject option.](media/how-to-manage-private-links/private-links-10-awaiting-approval.png)](media/how-to-manage-private-links/private-links-10-awaiting-approval.png#lightbox)


## Next steps
<!-- Add a context sentence for the following links -->
> [!div class="nextstepaction"]
> [How to manage users](how-to-manage-users.md)
