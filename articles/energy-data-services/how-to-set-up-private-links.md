---
title: Create a private endpoint for Microsoft Azure Data Manager for Energy
description: Learn how to set up private endpoints for Azure Data Manager for Energy by using Azure Private Link.
author: Lakshmisha-KS
ms.author: lakshmishaks
ms.service: energy-data-services
ms.topic: how-to
ms.date: 09/29/2022
ms.custom: template-how-to
#Customer intent: As a developer, I want to set up private endpoints for Azure Data Manager for Energy.
---

# Create a private endpoint for Azure Data Manager for Energy
[Azure Private Link](../private-link/private-link-overview.md) provides private connectivity from a virtual network to Azure platform as a service (PaaS). It simplifies the network architecture and secures the connection between endpoints in Azure by eliminating data exposure to the public internet.

By using Azure Private Link, you can connect to an Azure Data Manager for Energy instance from your virtual network via a private endpoint, which is a set of private IP addresses in a subnet within the virtual network. You can then limit access to your Azure Data Manager for Energy instance over these private IP addresses. 

You can connect to an Azure Data Manager for Energy instance that's configured with Private Link by using an automatic or manual approval method. To learn more, see the [Private Link documentation](../private-link/private-endpoint-overview.md#access-to-a-private-link-resource-using-approval-workflow).

This article describes how to set up a private endpoint for Azure Data Manager for Energy. 

> [!NOTE]
> Terraform currently does not support private endpoint creation for Azure Data Manager for Energy.

## Prerequisites

[Create a virtual network](../virtual-network/quick-create-portal.md) in the same subscription as the Azure Data Manager for Energy instance. This virtual network allows automatic approval of the Private Link endpoint.

## Create a private endpoint during instance provisioning by using the Azure portal 

Use the following steps to create a private endpoint while provisioning Azure Data Manager for Energy resource:

1. During the creation of Azure Data Manager for Energy instance, select the **Networking** tab.

    [![Screenshot of the Networking tab during provisioning.](media/how-to-manage-private-links/private-links-11-networking-tab.png)](media/how-to-manage-private-links/private-links-11-networking-tab.png#lightbox)

1. In the Networking tab, select **Disable public access and use private access** and then choose **Add** under Private endpoint.

    [![Screenshot of choosing add private endpoint.](media/how-to-manage-private-links/private-links-12-add-private-endpoint.png)](media/how-to-manage-private-links/private-links-12-add-private-endpoint.png#lightbox)

1. In **Create private endpoint**, enter or select the following information and select **OK**:

    |Setting| Value|
    |--------|-----|
    |Subscription| Select your subscription|
    |Resource group| Select a resource group|
    |Location| Select the region where you want to deploy the private endpoint|
    |Name| Enter a name for your private endpoint. The name must be unique|
    |Target sub-resource| **Azure Data Manager for Energy** by default|

    **Networking:**

    |Setting| Value|
    |--------|-----|
    |Virtual network| Select the virtual network in which you want to deploy your private endpoint|
    |Subnet| Select the subnet|

    **Private DNS integration:**

    |Setting| Value|
    |--------|-----|
    |Integrate with private DNS zone| Leave the default value - **Yes**|
    |Private DNS zone| Leave the default value|

    [![Screenshot of the Create private endpoint tab - 1.](media/how-to-manage-private-links/private-links-13-create-private-endpoint.png)](media/how-to-manage-private-links/private-links-13-create-private-endpoint.png#lightbox)

    [![Screenshot of the Create private endpoint tab - 2.](media/how-to-manage-private-links/private-links-14-private-dns.png)](media/how-to-manage-private-links/private-links-14-private-dns.png#lightbox)


1. Verify the private endpoint details in the Networking tab and next, select **Review+Create** after completing other tabs.

    [![Screenshot of the Private endpoint details.](media/how-to-manage-private-links/private-links-15-review-private-endpoint.png)](media/how-to-manage-private-links/private-links-15-review-private-endpoint.png#lightbox)

1. On the Review + create page, Azure validates your configurations.
When you see Validation passed, select the **Create** button.
1. An Azure Data Manager for Energy instance is created with private link.
1. You can navigate to Networking post instance provisioning and see the private endpoint created under **Private access** tab.

    [![Screenshot of the private endpoint created.](media/how-to-manage-private-links/private-links-16-validate-private-endpoint.png)](media/how-to-manage-private-links/private-links-16-validate-private-endpoint.png#lightbox)

## Create a private endpoint post instance provisioning by using the Azure portal 

Use the following steps to create a private endpoint for an existing Azure Data Manager for Energy instance by using the Azure portal:

1. From the **All resources** pane, choose an Azure Data Manager for Energy instance.
1. Select **Networking** from the list of settings.       
1. On the **Public Access** tab, select **Enabled from all networks** to allow traffic from all networks.

    [![Screenshot of the Public Access tab.](media/how-to-manage-private-links/private-links-1-Networking.png)](media/how-to-manage-private-links/private-links-1-Networking.png#lightbox)
	
    If you want to block traffic from all networks, select **Disabled**.

1. Select the **Private Access** tab, and then select **Create a private endpoint**.
 
    [![Screenshot of the Private Access tab.](media/how-to-manage-private-links/private-links-2-create-private-endpoint.png)](media/how-to-manage-private-links/private-links-2-create-private-endpoint.png#lightbox)
 
1. In the **Create a private endpoint** wizard, on the **Basics** page, enter or select the following details:

    |Setting| Value|
    |--------|-----|
    |**Subscription**| Select your subscription for the project.|
    |**Resource group**| Select a resource group for the project.|
    |**Name**| Enter a name for your private endpoint. The name must be unique.|
    |**Region**| Select the region where you want to deploy Private Link. |

    [![Screenshot of entering basic information for a private endpoint.](media/how-to-manage-private-links/private-links-3-basics.png)](media/how-to-manage-private-links/private-links-3-basics.png#lightbox)
	
    > [!NOTE]
    > Automatic approval happens only when the Azure Data Manager for Energy instance and the virtual network for the private endpoint are in the same subscription.

1. Select **Next: Resource**. On the **Resource** page, confirm the following information:

    |Setting| Value|
    |--------|--------|
    |**Subscription**| Your subscription|
    |**Resource type**|	**Microsoft.OpenEnergyPlatform/energyServices**|
    |**Resource**| Your Azure Data Manager for Energy instance|
    |**Target sub-resource**| **Azure Data Manager for Energy** (for Azure Data Manager for Energy) by default|
	
    [![Screenshot of resource information for a private endpoint.](media/how-to-manage-private-links/private-links-4-resource.png)](media/how-to-manage-private-links/private-links-4-resource.png#lightbox)
 
1. Select **Next: Virtual Network**. On the **Virtual Network** page, you can:

    * Configure network and private IP settings. [Learn more](../private-link/create-private-endpoint-portal.md#create-a-private-endpoint).

    * Configure a private endpoint with an application security group. [Learn more](../private-link/configure-asg-private-endpoint.md#create-private-endpoint-with-an-asg).

    [![Screenshot of virtual network information for a private endpoint.](media/how-to-manage-private-links/private-links-4-virtual-network.png)](media/how-to-manage-private-links/private-links-4-virtual-network.png#lightbox)

1. Select **Next: DNS**. On the **DNS** page, you can leave the default settings or configure private DNS integration. [Learn more](../private-link/private-endpoint-overview.md#dns-configuration).

    [![Screenshot of DNS information for a private endpoint.](media/how-to-manage-private-links/private-links-5-dns.png)](media/how-to-manage-private-links/private-links-5-dns.png#lightbox)

1. Select **Next: Tags**. On the **Tags** page, you can add tags to categorize resources.
1. Select **Review + create**. On the **Review + create** page, Azure validates your configuration.

    When you see **Validation passed**, select **Create**.

    [![Screenshot of the page that summarizes and validates configuration of your private endpoint.](media/how-to-manage-private-links/private-links-6-review.png)](media/how-to-manage-private-links/private-links-6-review.png#lightbox)
 
1. After the deployment is complete, select **Go to resource**. 

    [![Screenshot that shows an overview of a private endpoint deployment.](media/how-to-manage-private-links/private-links-7-deploy.png)](media/how-to-manage-private-links/private-links-7-deploy.png#lightbox)
  
1. Confirm that the private endpoint that you created was automatically approved.

    [![Screenshot of information about a private endpoint with an indication of automatic approval.](media/how-to-manage-private-links/private-links-8-request-response.png)](media/how-to-manage-private-links/private-links-8-request-response.png#lightbox)
 
1. Select the **Azure Data Manager for Energy** instance, select **Networking**, and then select the **Private Access** tab. Confirm that your newly created private endpoint connection appears in the list.

    [![Screenshot of the Private Access tab with an automatically approved private endpoint connection.](media/how-to-manage-private-links/private-links-9-auto-approved.png)](media/how-to-manage-private-links/private-links-9-auto-approved.png#lightbox)

> [!NOTE]
> When the Azure Data Manager for Energy instance and the virtual network are in different tenants or subscriptions, you have to manually approve the request to create a private endpoint. The **Approve** and **Reject** buttons appear on the **Private Access** tab. 
>
> [![Screenshot that shows options for rejecting or approving a request to create a private endpoint.](media/how-to-manage-private-links/private-links-10-awaiting-approval.png)](media/how-to-manage-private-links/private-links-10-awaiting-approval.png#lightbox)

## Next steps
<!-- Add a context sentence for the following links -->
To learn more about using Customer Lockbox as an interface to review and approve or reject access requests.
> [!div class="nextstepaction"]
> [Use Lockbox for Azure Data Manager for Energy](how-to-create-lockbox.md)
