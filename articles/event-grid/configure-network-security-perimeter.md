---
title: Network security perimeter in Azure Event Grid
description: This article shows how to configure network security perimeter in Azure Event Grid. This feature is currently in preview.
ms.topic: how-to
ms.date: 11/18/2024
# Customer intent: I want to know how to configure network security perimeter in Azure Event Grid.
ms.custom:
  - build-2025
---

# Network security perimeter in Azure Event Grid (Preview) 
Network security perimeter is a framework created to manage public traffic to Azure Platform-as-a-Service (PaaS) resources, and traffic between those PaaS resources. The basic building block is a **perimeter**, a group of PaaS resources that can communicate freely with each other. The perimeter defines a boundary with implicit trust access between each resource. This perimeter can have sets of inbound and outbound access rules. 

This article shows you how to associate a network security perimeter with an Event Grid topic or a domain.

> [!NOTE]
> The Network security perimeter configuration is currently available only for topics and domains under the **Networking** setting. 

## Prerequisites
The following procedure assumes that you have the following Azure resources: 

- An Event Grid topic or a domain
- An Event Hubs namespace with an event hub. The event hub is used as an event handler in the example. 

## Create a network security perimeter
First, you create a network security perimeter and add the Event Grid domain and the Event Hubs namespace resources to it. 

1. In the [Azure portal](https://portal.azure.com), search for and navigate to the **Network Security Perimeters** page, and select **Create** on the toolbar or **Create network security perimeter** on the page. 

    :::image type="content" source="./media/configure-network-security-perimeter/create-network-security-perimeter-button.png" alt-text="Screenshot that shows Network Security Perimeters page with Create button selected." lightbox="./media/configure-network-security-perimeter/create-network-security-perimeter-button.png":::        
1. On the **Create a network security perimeter** wizard, follow these steps:
    1. Select your Azure subscription, resource group, and region in which you want to create the network security perimeter.
    1. Enter a **name** for the perimeter. 
    1. For **profile name**, enter a name for the default profile. 
    1. Select **Next** at the bottom of the page. 
    
        :::image type="content" source="./media/configure-network-security-perimeter/create-network-security-perimeter-page.png" alt-text="Screenshot that shows Create a network security perimeter page." lightbox="./media/configure-network-security-perimeter/create-network-security-perimeter-page.png":::             
  1. On the **Resources** page, select **Add**. Then, on the **Select resources** page, select resources you want in your perimeter. For example, you can add an Azure Event Grid domain and an Azure Event Hubs namespace that's used as an event handler or destination. Then, select **Next**.
  
        :::image type="content" source="./media/configure-network-security-perimeter/perimeter-resources.png" alt-text="Screenshot that shows Select resources page for a perimeter." lightbox="./media/configure-network-security-perimeter/perimeter-resources.png":::                 
  1. On the **Inbound access rules** page, select **Add inbound access rule**. 
  1. On the **Add inbound access rule** page, select the source type. You can use this setting to allow inbound access to specific IP address ranges or subscriptions. When you're done, select **Next** at the bottom of the page. 
  
        :::image type="content" source="./media/configure-network-security-perimeter/add-inbound-access-rule.png" alt-text="Screenshot that shows Add inbound access rule." lightbox="./media/configure-network-security-perimeter/add-inbound-access-rule.png":::                 
  1. On the **Outbound access rules** page, if you want to allow egress access, select **Add outbound access rule**. 
  1. On the **Add outbound access rule** page, select the fully qualified domain (FQDN) destination. 
  
        :::image type="content" source="./media/configure-network-security-perimeter/add-outbound-access-rule.png" alt-text="Screenshot that shows Add outbound access rule." lightbox="./media/configure-network-security-perimeter/add-outbound-access-rule.png":::                      
  1. Select **Next** to navigate to the **Tags**, and then select **Next** again to move on to the **Review + create** page.
  1. On the **Review + create** page, review the configuration, and select **Create** to create the security perimeter. 
  
        :::image type="content" source="./media/configure-network-security-perimeter/review-create-page.png" alt-text="Screenshot that shows the Review + create page." lightbox="./media/configure-network-security-perimeter/review-create-page.png":::       
1. Once the network security perimeter resource is created, you find it in the resource group you specified. 

    :::image type="content" source="./media/configure-network-security-perimeter/resource-group-page.png" alt-text="Screenshot that shows the Resource group page with the network security perimeter resource." lightbox="./media/configure-network-security-perimeter/resource-group-page.png":::           


## Configure the network security perimeter
In this step, you associate the network security perimeter you created in the previous step with the Event Grid domain. To configure network security perimeter for a topic or a domain, use the **Networking** tab on **Event Grid Topic** or **Event Grid Domain** page. 

1. On the **Event Grid Topic** or **Event Grid Domain** page, select **Networking** under **Settings** on the left navigation menu. The screenshots and steps in this article use an example Azure Event Grid domain. The steps for the topic are identical. 
1. On the **Networking** page, select **Manage**. 

    :::image type="content" source="./media/configure-network-security-perimeter/networking-page-manage-button.png" alt-text="Screenshot that shows the Networking page with the Manage button selected." lightbox="./media/configure-network-security-perimeter/networking-page-manage-button.png":::
1. On the **Public network access** page, select **Secured by perimeter (Most restricted)**, and then select **Save**.  

    :::image type="content" source="./media/configure-network-security-perimeter/secured-by-perimeter-setting.png" alt-text="Screenshot that shows the selection of Secured by perimeter setting." lightbox="./media/configure-network-security-perimeter/secured-by-perimeter-setting.png":::    

    **Network security perimeter** restricts inbound and outbound access offering the greatest level of inbound and outbound restriction to secure the Azure Event Grid resource. 
1. Now, it’s time to associate the network security perimeter with the Azure Event Grid domain or topic in the **Networking** settings by selecting **Associate**. 

    :::image type="content" source="./media/configure-network-security-perimeter/associate-button.png" alt-text="Screenshot that shows the Networking page with Associate button selected." lightbox="./media/configure-network-security-perimeter/associate-button.png":::               
1. On the **Associate a network security perimeter** page, choose **Select network security perimeter**. 

    :::image type="content" source="./media/configure-network-security-perimeter/select-perimeter-link.png" alt-text="Screenshot that shows the Associate a network security perimeter page with the Select network security perimeter link selected.":::                   
1. Search for the network security perimeter resource, and select the resource. 

    :::image type="content" source="./media/configure-network-security-perimeter/select-perimeter.png" alt-text="Screenshot that shows the Select network security perimeter page.":::                       
1. Now, on the **Associate a network security perimeter** page, select the **profile**, and then select **Associate**.

    :::image type="content" source="./media/configure-network-security-perimeter/select-profile.png" alt-text="Screenshot that shows the Select network security perimeter page with a profile selected.":::                            
1. Now you see the network security perimeter associated with your Azure Event Grid domain or topic resource. 

    :::image type="content" source="./media/configure-network-security-perimeter/network-security-perimeter-filled.png" alt-text="Screenshot that shows the Networking page with the perimeter selected." lightbox="./media/configure-network-security-perimeter/network-security-perimeter-filled.png":::

## Considerations when using network security perimeter 
This article discusses a scenario involving Azure Event Grid domains and Azure Event Hubs as destination. In this scenario, you enable managed identity for the Azure Event Grid domain, and then assign identity the Event Hubs Data Sender role on the Event Hubs namespace. For more information, see [Event delivery, managed service identity, and private link](managed-service-identity.md#use-the-azure-cli---event-hubs). 

