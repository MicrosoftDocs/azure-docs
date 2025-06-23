---
title: Create a Cloud Next-Generation Firewall (NGFW) by Palo Alto Networks
description: Learn how to use the Azure portal to create a Cloud NGFW (Next-Generation Firewall) by Palo Alto Networks.

ms.custom: references_regions
ms.topic: quickstart
ms.date: 06/27/2025

---

# QuickStart: Get started with Cloud NGFW by Palo Alto Networks

In this quickstart, you use Azure Marketplace to find and create an instance of  **Cloud NGFW by Palo Alto Networks - an Azure Native ISV Service resource**.

## Prerequisites

[!INCLUDE [create-prerequisites](../includes/create-prerequisites.md)]

## Create a Cloud NGFW resource

[!INCLUDE [create-resource](../includes/create-resource.md)]

In this section, you'll create a Palo Alto Networks resource.

### Basics tab

1. In the Azure portal, create a Cloud NGFW resource by using the Marketplace. Use search to find _Cloud NGFW by Palo Alto Networks_. Select **Subscribe** and then select **Create**.

1. Set the following values on the **Basics** tab.

   :::image type="content" source="media/palo-alto-create/palo-alto-basics.png" alt-text="Screenshot of the Basics tab of the Create Cloud NGFW page." lightbox="media/palo-alto-create/palo-alto-basics.png":::

   | Setting  | Description |
   |---------|---------|
   | **Subscription**  | Select an Azure subscription for which you have owner access. |
   | **Resource group**     | Specify whether you want to create a new resource group or use an existing one. A resource group is a container that holds related resources for an Azure solution. For more information, see [What is a resource group?](../../azure-resource-manager/management/manage-resource-groups-portal.md#what-is-a-resource-group). |
   | **Name**  | Enter the name for the Palo Alto Networks account you want to create. |
   | **Region** | Select an appropriate region. |
   | **Pricing Plan**     | Specified based on the selected Palo Alto Networks plan. |

### Networking tab

1. After providing the required information on the **Basics** tab, select **Next: Networking** to go to the **Networking** tab. 

1. Select either **Virtual Network** or **Virtual Wan Hub**.

1. Use the dropdowns to set the **Virtual Network**, **Private Subnet**, and **Public Subnet** that are associated with the Cloud NGFW deployment.

1. For **Public IP Address Configuration**,  select either **Create New** or **Use Existing** and type in a name for **Public IP Address Name(s)**.

1. Select the **Enable Source NAT** checkbox to indicate your preferred NAT settings.

### Security Policy

1. After setting the Domain Name System (DNS) values, select **Next: Security Policy** to see the **Security Policies** tab. You can set the policies for the firewall on this tab.

   :::image type="content" source="media/palo-alto-create/palo-alto-rulestack.png" alt-text="Screenshot of the Rulestack tab of the Create Cloud NGFW page." lightbox="media/palo-alto-create/palo-alto-rulestack.png":::

1. Under **Managed By**, select either **Azure Portal** or **Palo Alto Networks Panorama**.

1. Under **Choose a Local Rulestack**, select either **Create new** or **Use existing**.

1. In **Local Rulestack**, enter an existing rulestack.

1. Under **Best practice rule** select either **Firewall mode** or **IDS mode**.

### DNS Proxy

1. After completing the **Security Policies** values, select the **Next: DNS Proxy** to go to the **DNS Proxy** tab.

   :::image type="content" source="media/palo-alto-create/palo-alto-dns-proxy.png" alt-text="Screenshot of the DNS Proxy tab of the Create Cloud NGFW page." lightbox="media/palo-alto-create/palo-alto-dns-proxy.png":::

1. Under **DNS Proxy**, selet either **Disabled** or **Enabled**.

### Tags tab (optional)

You can optionally create tags for your resource. 

### Terms

Next, you must accept the terms of use for the new Palo Alto Networks resource.

1. Select to to the **Terms** tab.

   :::image type="content" source="media/palo-alto-create/palo-alto-terms.png" alt-text="Screenshot showing the Terms tab of the Create Cloud NGFW page.":::

1. Select the **I Agree** checkbox to indicate your acceptance.
1. Select **Next: Review + Create** to go to the final step of creating the resource.

### Review + create tab

[!INCLUDE [review-create](../includes/review-create.md)]

## Next steps

- [Manage the Cloud NGFW resource](manage.md)

- Get started with Cloud NGFW on:

  > [!div class="nextstepaction"]
  > [Azure portal](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/PaloAltoNetworks.Cloudngfw%2Ffirewalls)

  > [!div class="nextstepaction"]
  > [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/paloaltonetworks.pan_swfw_cloud_ngfw?tab=Overview)
