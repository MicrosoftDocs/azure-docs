---
title: Create a Cloud NGFW by Palo Alto Networks - an Azure Native ISV Service resource
description: This article describes how to use the Azure portal to create a Cloud NGFW (Next-Generation Firewall) by Palo Alto Networks - an Azure Native ISV Service resource.

ms.custom: references_regions
ms.topic: quickstart
ms.date: 04/26/2023

---

# QuickStart: Get started with Cloud NGFW by Palo Alto Networks - an Azure Native ISV Service resource

In this quickstart, you use the Azure Marketplace to find and create an instance of  **Cloud NGFW by Palo Alto Networks - an Azure Native ISV Service resource**.

## Create a new Cloud NGFW by Palo Alto Networks resource

### Basics

1. In the Azure portal, create a Cloud NGFW by Palo Alto Networks resource using the Marketplace. Use search to find _Cloud NGFW by Palo Alto Networks_. Then, select **Subscribe**. Then, select **Create**.

1. Set the following values in the Basics tab.

   :::image type="content" source="media/palo-alto-create/palo-alto-basics.png" alt-text="Screenshot of Basics tab of the Palo Alto Networks create experience.":::

   | Property  | Description |
   |---------|---------|
   | **Subscription**  | From the drop-down, select your Azure subscription where you have owner access. |
   | **Resource group**     | Specify whether you want to create a new resource group or use an existing one. A resource group is a container that holds related resources for an Azure solution. For more information, see Azure Resource Group overview. |
   | **Name**  | Put the name for the Palo Alto Networks account you want to create. |
   | **Region** | Select an appropriate region. |
   | **Pricing Plan**     | Specified based on the selected Palo Alto Networks plan. |

### Networking

1. After completing the Basics tap, select the **Next: Networking** to see the **Networking** tab. 1. Select either **Virtual Network** or **Virtual Wan Hub**.

1. Use the dropdowns to set the **Virtual Network**, **Private Subnet**, and Public **Public Subnet** associated with the Palo Alto Networks deployment.

   :::image type="content" source="media/palo-alto-create/palo-alto-networking.png" alt-text="Screenshot of the networking pane in the Palo Alto Networks create experience.":::

1. For **Public IP Address Configuration**,  select either **Create New** or **Use Existing** and type in a name for **Public IP Address Name(s)**.

1. Select the checkbox **Enable Source NAT** to indicate your preferred NAT settings.

### Security Policy

1. After setting the DNS values, select the **Next: Security Policy** to see the **Security Policies** tab. You can set the policies for the firewall using this tab.

   :::image type="content" source="media/palo-alto-create/palo-alto-rulestack.png" alt-text="Screenshot of the Rulestack in the Palo Alto Networks create experience.":::

1. Select checkbox **Managed By** to indicate either **Azure Portal** or **Palo Alto Networks Panorama**.

1. For **Choose Local Rulestack**, select either **Create New** or **Use Existing** options.

1. Input an existing rulestack in the **Local Rulestack** option.

1. Select the checkbox **Best practice rule** to indicate Firewall mode or IDS mode options.

### DNS Proxy

1. After completing the **Security Policies** values, select the **Next: DNS Proxy** to see the **DNS Proxy** screen.

   :::image type="content" source="media/palo-alto-create/palo-alto-dns-proxy.png" alt-text="Screenshot of the DNS Proxy in the Palo Alto Networks create experience.":::

1. Select the checkbox **DNS Proxy** to indicate **Disabled** or **Enabled**.

### Tags

You can specify custom tags for the new Palo Alto Networks resource in Azure by adding custom key-value pairs.

1. Select Tags.

   :::image type="content" source="media/palo-alto-create/palo-alto-tags.png" alt-text="Screenshot showing the tags pane in the Palo Alto Networks create experience.":::

1. Type in the **Name** and **Value** properties that you need.

   | Property | Description |
   |----------| -------------|
   |**Name** | Name of the tag corresponding to the Azure Palo Alto Networks resource. |
   | **Value** | Value of the tag corresponding to the Azure Palo Alto Networks resource. |

### Terms

Next, you must accept the Terms of Use for the new Palo Alto Networks resource.

1. Select Terms.

   :::image type="content" source="media/palo-alto-create/palo-alto-terms.png" alt-text="Screenshot showing the terms pane in the Palo Alto create experience.":::

1. Select the checkbox **I Agree** to indicate approval.

### Review and create

1. Select the **Next: Review + Create** to navigate to the final step for resource creation. When you get to the **Review + Create** page, all validations are run. At this point, review all the selections made in the Basics, Networking, and optionally Tags panes. You can also review the Palo Alto and Azure Marketplace terms and conditions.  

   :::image type="content" source="media/palo-alto-create/palo-alto-review-create.png" alt-text="Screenshot of Review and Create resource tab.":::

1. When you've reviewed all the information, select **Create**. Azure now deploys the Cloud NGFW by Palo Alto Networks.

   :::image type="content" source="media/palo-alto-create/palo-alto-deploying.png" alt-text="Screenshot showing Palo Alto Networks deployment in process.":::

## Deployment completed

1. Once the create process is completed, select **Go to Resource** to navigate to the specific Cloud NGFW by Palo Alto Networks resource.

   :::image type="content" source="media/palo-alto-create/palo-alto-deploy-complete.png" alt-text="Screenshot of a completed Palo Alto Networks deployment.":::

1. Select **Overview** in the Resource menu to see information on the deployed resources.

   :::image type="content" source="media/palo-alto-create/palo-alto-overview-essentials.png" alt-text="Screenshot of information on the Palo Alto Networks resource overview.":::

## Next steps

- [Manage the Palo Alto Networks resource](palo-alto-manage.md)

- Get Started with Cloud Next-Generation Firewall by Palo Alto Networks - an Azure Native ISV Service on

  > [!div class="nextstepaction"]
  > [Azure portal](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/PaloAltoNetworks.Cloudngfw%2Ffirewalls)

  > [!div class="nextstepaction"]
  > [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/paloaltonetworks.pan_swfw_cloud_ngfw?tab=Overview)
