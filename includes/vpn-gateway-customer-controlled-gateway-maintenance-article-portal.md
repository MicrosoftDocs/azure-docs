---
author: cherylmc
ms.author: cherylmc
ms.date: 11/01/2023
ms.service: vpn-gateway
ms.topic: include

## This include is the main part of the article for VPN Gateway, ExpressRoute, and Virtual WAN. If you have changes to make to this include, verify that they apply in context for all 3 services. If not, go to the article page for the specific service and add the information as a separate section there.
---

Use the following steps to create a maintenance configuration.

1. In the Azure portal, search for **Maintenance Configurations**.

1. On the **Maintenance Configurations** page, select **+ Create** to open the **create a maintenance configuration** page.

   :::image type="content" source="./media/vpn-gateway-customer-controlled-gateway-maintenance-portal/basics-page.png" alt-text="Screenshot of Maintenance Configurations page." lightbox="./media/vpn-gateway-customer-controlled-gateway-maintenance-portal/basics-page.png":::

1. On the **Basics** page, input the relevant values.

   * **Subscription:** Your subscription.
   * **Resource Group:** The resource group your resources reside in.
   * **Configuration name:** Use an intuitive name by which you can identify this maintenance configuration.
   * **Region:** The Region needs to be same region as your gateway resources.
   * **Maintenance scope:** Select **Network gateways** from the dropdown.
1. Click **Add a schedule** to define the maintenance schedule. The maintenance window needs to be a minimum of 5 Hours.
1. After you specify the schedule, click **Save**.
1. Next, select the resources. On the **Resources** page, click **+ Add resources**. You can add resources to the maintenance configuration when creating the configuration, or you can add the resources after the maintenance configuration is created. For this exercise, we'll add resources at the same time we create a maintenance configuration.
1. On the **Select resources** page you should see your resources. If you don't, go back and make sure that you selected the correct region and maintenance scope. Select the resources you want to include in this maintenance configuration, then click **OK**.

   Values for **Type** are:

   * **VPN Gateway:** Virtual network gateways
   * **ExpressRoute:** Virtual network gateways
   * **Virtual WAN:** VPN gateways and Express route gateways

1. Click **Review + Create** to validate. Once validation completes, click **Create**.