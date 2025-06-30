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

In this section, you'll create a Cloud NGFW by Palo Alto Networks resource.

### Basics tab

1. Set the following values on the **Basics** tab.

   :::image type="content" source="media/palo-alto-create/palo-alto-basics.png" alt-text="Screenshot of the Basics tab of the Create Cloud NGFW page." lightbox="media/palo-alto-create/palo-alto-basics.png":::

   | Setting  | Description |
   |---------|---------|
   | **Subscription**  | Select an Azure subscription for which you have owner access. |
   | **Resource group**     | Specify whether you want to create a new resource group or use an existing one. A resource group is a container that holds related resources for an Azure solution. For more information, see [What is a resource group?](../../azure-resource-manager/management/manage-resource-groups-portal.md#what-is-a-resource-group). |
   | **Firewall name**  | Enter a name for the firewall. |
   | **Region** | Select an appropriate region. |
   | **Marketplace Plan**     | Select **Cloud NGFW by Palo Alto Networks - an Azure Native ISV Service (PAYG)**. |

### Networking tab

1. After providing the required information on the **Basics** tab, select **Next** to go to the **Networking** tab. 

1. Select either **Virtual Network** or **Virtual Wan Hub**.

1. Select the dropdown arrows to set the **Virtual Network**, **Private Subnet**, and **Public Subnet** that are associated with the Cloud NGFW deployment.

1. Under **Public IP Address Configuration**,  select either **Create new** or **Use existing**. 

1. If you select **Create new**, accept the supplied public IP address name or enter a name. If you select **Use existing**, select a public IP address name.

1. Under **Source NAT Settings**, indicate your preferred NAT settings.

### Security Policies tab

1. After setting the networking values, select **Next** to go to the **Security Policies** tab. You can set the policies for the firewall on this tab.

   :::image type="content" source="media/palo-alto-create/palo-alto-rulestack.png" alt-text="Screenshot of the Security Policies tab of the Create Cloud NGFW page." lightbox="media/palo-alto-create/palo-alto-rulestack.png":::

1. Under **Managed by**, select **Azure Rulestack**, **Palo Alto Networks Panorama**, or **Palo Alto Networks Strata Cloud Manager**.

1. Your options depend on the choice you made in the previous step. Indicate your choices for the required settings.

### DNS Proxy

1. After you configure the **Security Policies** values, select **Next** to go to the **DNS Proxy** tab.

   :::image type="content" source="media/palo-alto-create/palo-alto-dns-proxy.png" alt-text="Screenshot of the DNS Proxy tab of the Create Cloud NGFW page." lightbox="media/palo-alto-create/palo-alto-dns-proxy.png":::

1. Under **DNS Proxy**, select either **Disabled** or **Enabled**.

### Tags tab (optional)

[!INCLUDE [tags](../includes/tags.md)]

### Terms tab

Next, you must accept the terms of use for the new Cloud NGFW resource.

1. Select the **Terms** tab.

   :::image type="content" source="media/palo-alto-create/palo-alto-terms.png" alt-text="Screenshot showing the Terms tab of the Create Cloud NGFW page." lightbox="media/palo-alto-create/palo-alto-terms.png":::

1. Select the **I Agree** box to indicate your acceptance.
1. Select **Next** to go to the final step of creating the resource.

### Review + create tab

[!INCLUDE [review-create](../includes/review-create.md)]

## Next steps

- [Manage the Cloud NGFW resource](manage.md)

- Get started with Cloud NGFW on:

  > [!div class="nextstepaction"]
  > [Azure portal](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/PaloAltoNetworks.Cloudngfw%2Ffirewalls)

  > [!div class="nextstepaction"]
  > [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/paloaltonetworks.pan_swfw_cloud_ngfw?tab=Overview)
