---
 title: include file
 description: include file
 services: virtual-network-manager        
 author: mbender-ms
 ms.service: virtual-network-manager
 ms.topic: include
 ms.date: 04/03/2023
 ms.author: mbender
 ms.custom: include file
---
1. From a browser, navigate to the [Azure portal](https://portal.azure.com) and, if necessary, sign in with your Azure account.

1. In the portal, search for and select **Virtual networks**.

1. On the **Virtual networks** page, select **Create**.

1. On the **Basics** tab of the **Create virtual network** screen, enter or select the following information:

   - **Subscription**: Keep the default or select a different subscription.
   - **Resource group**: Select **Create new**, and then name the group *rg-learn-eastus-001*.
   - **Virtual network name**: Enter *vnet-learn-prod-eastus-001*.
   - **Region**: Enter *east us* or select a different region for the network and all its resources.

    :::image type="content" source="../articles/virtual-network-manager/media/includes-resources-portal/virtual-network-create-portal.png" alt-text="Screenshot of the Create virtual network screen in the Azure portal.":::

1. Select **Next** and **Next**.

1. On the **IP Addresses** tab, accept the settings for the **default** subnet.

   :::image type="content" source="../articles/virtual-network-manager/media/includes-resources-portal/example-ip-address-tab.png" alt-text="Screenshot of the IP Addresses tab of the Create virtual network screen.":::

1. On the next screen, select **Review + create** to accept the following defaults:

   - A virtual network IPv4 address space of **10.0.0.0/16**.
   - A resource subnet named **default** with address range **10.0.0.0/24**.

   :::image type="content" source="../articles/virtual-network-manager/media/includes-resources-portal/example-review-create.png" alt-text="Screenshot of the completed IP Addresses tab of the Create virtual network screen.":::

1. After validation succeeds, select **Create**. It takes a few minutes to create the Bastion host.

