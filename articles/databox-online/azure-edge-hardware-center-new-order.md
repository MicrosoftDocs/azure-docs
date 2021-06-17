---
title: Order Azure Edge devices from Azure Edge Hardware Center| Microsoft Docs
description: Learn how to order multiple Azure Stack Edge devices in the Azure Edge Hardware Center.
services: databox
author: v-dalc

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 06/17/2021
ms.author: alkohli
Customer intent: As an IT admin, I want to be able to place a single order for as many Azure Stack Edge devices as my company needs, and ship the devices to different locations. And I want to be able to reuse shipping addresses from my previous orders.
---

# Order Azure Stack Edge devices from Azure Edge Hardware Center

This article describes how to order Azure Stack Edge, Azure Stack Hub, or Azure Stack Edge Zone Enterprise devices centrally, from the Azure Edge Hardware Center. You can order multiple devices in one order, ship them to multiple addresses, and reuse addresses.

Each order can include multiple devices from a single hardware group and configuration. You can ship the devices to different locations within the same country/region. For more information about the Azure Stack Edge Hardware Center, see Azure Stack Edge Hardware Center overview *(link to come)*.

*I will add an "About" section if we need to provide any more detail about the new service. `Alpa` will write an "Overview" article.*

### Prerequisites

Before you begin, make sure that:<!--Anam to provide updated Prerequisites in Support doc by 06/21.-->

- Your Microsoft Azure subscription is enabled for an Azure Stack Edge resource. Make sure that you used a supported subscription such as [Microsoft Enterprise Agreement (EA)](https://azure.microsoft.com/overview/sales-number/), [Cloud Solution Provider (CSP)](/partner-center/azure-plan-lp), or [Microsoft Azure Sponsorship](https://azure.microsoft.com/offers/ms-azr-0036p/). Pay-as-you-go subscriptions aren't supported. To identify the type of Azure subscription you have, see [What is an Azure offer?](../cost-management-billing/manage/switch-azure-offer.md#what-is-an-azure-offer).
- You have owner or contributor access at resource group level for the Azure Stack Edge Pro/Data Box Gateway, IoT Hub, and Azure Storage resources.

    - To create any Azure Stack Edge / Data Box Gateway resource, you should have permissions as a contributor (or higher) scoped at resource group level. 
    - You also need to make sure that the `Microsoft.EdgeOrder` provider is registered. *QUESTION: Azure Stack Edge also requires the `Microsoft.DataBoxEdge` and `Microsoft.KeyVault` resource providers. For IoT Hub resources, the `Microsoft.Devices` provider also is required. Should these providers be included?*<!--STILL REQUIRED? You also need to make sure that the Microsoft.DataBoxEdge and MicrosoftKeyVault resource providers are registered. To create any IoT Hub resource, Microsoft.Devices`provider should be registered.-->
        - To register a resource provider, in the Azure portal, go to **Home > Subscriptions > Your-subscription > Resource providers**.
        - Search for the specific resource provider, for example, Microsoft.DataBoxEdge, and register the resource provider.
    - To create a Storage account resource, again you need contributor or higher access scoped at the resource group level. Azure Storage is by default a registered resource provider. *QUESTION: Requirements from Azure Stack Edge. Still applicable?*
- You have admin or user access to Azure Active Directory Graph API for generating activation key or credential operations such as share creation that uses a storage account. For more information, see [Azure Active Directory Graph API](/previous-versions/azure/ad/graph/howto/azure-ad-graph-api-permission-scopes#default-access-for-administrators-users-and-guest-users-). *QUESTION: Is this bullet the solution to the requirement to "Make sure no policies are preventing access during ordering?*


## Create new order in Azure Hardware Center

<!--Make screen updates Mon, 06/21, when new test portal version has all the latest features.-->

1. Use your Microsoft Azure credentials to sign in to the Azure portal at this URL: [https://portal.azure.com](https://portal.azure.com).

1. Search for and select **Azure Hardware Center**.<!--To become Azure Edge Hardware Center.-->

    ![Screenshot showing how to start a new order with the Azure Hardware Center service](media/azure-edge-hardware-center-new-order/edge-hardware-center-new-resource-01-service-first.png)

1. In the Azure Edge Hardware Center (preview) portal, select **+ Order**.<!--Click View to open the Azure Edge Hardware Center homepage. Will use that info later.-->

    ![Screenshot of the option to create a resource in the Azure Edge Hardware Center](media/azure-edge-hardware-center-new-order/edge-hardware-center-new-resource-02-service-first.png)


1. Select a subscription, and then select **Next**.

    ![Screenshot of the Select a subscription option for an Azure Edge Hardware Center order](media/azure-edge-hardware-center-new-order/edge-hardware-center-new-resource-03.png)

1. To start your order, select **Order** beside the product family that you want to order - for example, for **Azure Stack Edge**. If you don't see the product family, you may need to use a different subscription.

    ![Screen for selecting a product family to order from in the Azure Edge Hardware Center](media/azure-edge-hardware-center-new-order/edge-hardware-center-new-resource-04.png) 

1. Select the country or region that will be the shipping destination for your order. *QUESTION: At release, will customers be able to order from the US West country/region? Our example addresses are on the West Coast.*<!--Recommended destination for testing: SEA (Azure region).-->

    ![Screen for selecting a shipping destination for your Azure Edge Hardware Center order](media/azure-edge-hardware-center-new-order/edge-hardware-center-new-resource-05.png)

1.  On the **Order hardware** page, use the **Select** button to select the hardware product to order.  

    ![Screen for selecting the specific hardware product within the product family selected earlier](media/azure-edge-hardware-center-new-order/edge-hardware-center-new-resource-06.png)

1.  On the next pane, select a device configuration, and then choose **Select**.

    ![Screen for selecting a device model of the selected device type](media/azure-edge-hardware-center-new-order/edge-hardware-center-new-resource-07.png)<!--Remove pricing info from final graphic-->

    The **Create order** wizard opens.

1.  On the **Basics** tab, provide an **Order name** and **Resource group**. Then select **Next: Shipping + quantity**.

    ![Screenshot of the Basics tab for entering an order name, resource group, and region for an Azure Edge Hardware Center order](media/azure-edge-hardware-center-new-order/edge-hardware-center-new-resource-08.png)
  
1. On the **Shipping + quantity** tab, you'll start by specifying a ship to address for the order. 

    - If this is your first order through the Azure Edge Hardware Center, select **Add a new address**.  

       ![Screenshot of the Shipping + quantity tab, Add a new address option for an Azure Edge Hardware Center order](media/azure-edge-hardware-center-new-order/edge-hardware-center-new-resource-09.png)

       A required **Address alias** field on the **New address** screen identifies the address for later use. Select **Add** when you finish filling in the address fields. 

       ![Screen for adding a new ship to address for an Azure Edge Hardware Center order](media/azure-edge-hardware-center-new-order/edge-hardware-center-new-resource-10-new-address.png)

       If you're ordering more than one device, add a ship address for each location you want to ship to.

    - To use a ship to address from a previous order, choose **Select address(es)**. On the **Select address(es)**, select one or more addresses, and choose **Select** screen**.
    
       If you're ordering multiple devices, select each address you'll ship to.

       ![Screen for selecting an existing address for an Azure Edge Hardware Center order](media/azure-edge-hardware-center-new-order/edge-hardware-center-new-resource-10-select-an-address.png)

    The **Shipping + quantity** tab now has a separate item for each ship to address.

1. For each address, enter the **Quantity** of devices to ship.

    When you enter a quantity of more than one, a **+1 more** label is added to the end of the order item name. Select ****+ 1 more** to view the individual order items for that address.

    ![Screenshot showing the Shipping + quantity tab for an Azure Edge Hardware Center order with multiple devices shipping to two addresses](media/azure-edge-hardware-center-new-order/edge-hardware-center-new-resource-11-quantities-for-multiple-addresses.png)

    Each order item name includes a name prefix (the order name followed by the address alias), with an item number for each device that is shipped to that address.

1. If you want to change the names of order items, select and click the order item name to open the **Rename order item** pane. If you're shipping more than one item to an address, select **+n more**.

    You can make two types of name change:

    - Use a different name prefix for all of the order items, edit the **Name prefix** and then select **Apply**.

    - Edit each order item name individually. 

    When you finish updating order item names, select **Done**.

    ![Screenshot showing how to rename order items for an Azure Edge Hardware Center order](media/azure-edge-hardware-center-new-order/edge-hardware-center-new-resource-13.png)

    Select **Next: Notification>** to continue.

1. If you want to receive status notifications as your order progresses, enter as many as 20 the email addresses of recipients on the **Notifications** tab. To add an email address, enter the address, and select **Add**. You can add up to 20 email addresses.

    ![Screenshot of the Notifications tab for an Azure Edge Hardware Center order](media/azure-edge-hardware-center-new-order/edge-hardware-center-new-resource-14.png)

    When you finish, select **Review + create** to continue.

1. Review your order:

    - The order is automatically validated when you open this screen. If you see a **Validation failed** banner, you'll have to fix the issues before you create the order.
    - Review the **Privacy terms**, and select the check box to agree to them.
 
    Then select **Create**.

    ![Screenshot of the Review + create tab for an Azure Edge Hardware Center order](media/azure-edge-hardware-center-new-order/edge-hardware-center-new-resource-15.png)

    While the order is being deployed, the order opens in the Azure portal, showing the status of each order item. After deployment completes, you may need to click the Down arrow by **Deployment details** to see the status of individual items.

    ![Screenshot showing the status of successfully completed order in the Azure Edge Hardware Center](media/azure-edge-hardware-center-new-order/edge-hardware-center-new-resource-16.png)

    <!--Click the Down arrow to display **Deployment details**.

    ![Screenshot showing deployment details for a successfully completed order in the Azure Edge Hardware Center](media/azure-edge-hardware-center-new-order/edge-hardware-center-new-resource-17.png)-->

1.  To review all of the orders in the resource group, click **Next step: View orders for the resource group.** *QUESTION: What do we expect customers to do from the resource group?*

    ![Screenshot showing a summary of orders for the resource group in the Azure Edge Hardware Center](media/azure-edge-hardware-center-new-order/edge-hardware-center-new-resource-18.png)


## Manage orders in Azure Edge Hardware Center

TO BE DEVELOPED. Things they can do with a just-completed order while it's in the Azure Edge Hardware Center. The resource is still managed in Azure Stack Edge.

<!--STOPPED HERE: 06/16 PM



## Create a new Classic order

*STEPS FROM deploy-prep > portal. Not yet updated beyond STOPPED HERE. Text AND PNGs are from deploy-prep.*

When you're using the familiar method to create an individual resource in Azure Stack Edge, Azure Stack Hub, or such - now known as a Classic order - you can switch to the Azure Edge Hardware Center to complete your order.

To switch to the Azure Edge Hardware Center while creating a Classic order, do these steps:

1. Use your Microsoft Azure credentials to sign in to the Azure portal at this URL: [https://portal.azure.com](https://portal.azure.com).

1. Select **+ Create a resource**. Search for and select **Azure Stack Edge (preview). Select **Create**.

      ![Screenshot of option for creating a resource from the Azure Edge Hardware Center](media/azure-edge-hardware-center-new-order/azure-hardware-center-create-resource-01.png)

   1. Select a product family from the selected subscriptions. For example, select **Azure Stack Edge**.

     ![Screenshot of option for selecting a product family for an order in the Azure Edge Hardware Center](media/azure-edge-hardware-center-new order/azure-hardware-center-create-resource-02.png)

STOPPED HERE IN REVIEW OF Classic PROCEDURE. - 06/14/2021

3. Pick the subscription that you want to use for the Azure Stack Edge Pro device. Select the country to where you want to ship this physical device. Select **Show devices**.

    ![Create a resource 1](media/azure-stack-edge-gpu-deploy-prep/create-resource-1.png)

4. Select device type. Under **Azure Stack Edge Pro**, choose **Azure Stack Edge Pro with GPU** and then choose **Select**. If you see any issues or are unable to select the device type, go to [Troubleshoot order issues](azure-stack-edge-troubleshoot-ordering.md).

    ![Create a resource 3](media/azure-edge-hardware-center-new-order/create-resource-3.png)

5. Based on your business need, you can select Azure Stack Edge Pro with 1 or 2 Graphical Processing Units (GPUs) from Nvidia. 

    ![Create a resource 4](media/azure-edge-hardware-center-new-order/create-resource-4.png)

6. On the **Basics** tab, enter or select the following **Project details**.
    
    |Setting  |Value  |
    |---------|---------|
    |Subscription    |The subscription is automatically populated based on the earlier selection. Subscription is linked to your billing account. |
    |Resource group  |Select an existing group or create a new group.<br>Learn more about [Azure Resource Groups](../azure-resource-manager/management/overview.md).     |

7. Enter or select the following **Instance details**.

    |Setting  |Value  |
    |---------|---------|
    |Name   | A friendly name to identify the resource.<br>The name has from 2 to 50 characters containing letters, numbers, and hyphens.<br> Name starts and ends with a letter or a number.        |
    |Region     |For a list of all the regions where the Azure Stack Edge resource is available, see [Azure products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=databox&regions=all). If using Azure Government, all the government regions are available as shown in the [Azure regions](https://azure.microsoft.com/global-infrastructure/regions/).<br> Choose a location closest to the geographical region where you want to deploy your device.|

    ![Create a resource 5](media/azure-edge-hardware-center-new-order/create-resource-5.png)

8. Select **Next: Shipping address**.

    - If you already have a device, select the combo box for **I already have a device**.

        ![Create a resource 6](media/azure-edge-hardware-center-new-order/create-resource-6.png)

    - If this is the new device that you're ordering, enter the contact name, company, address to ship the device, and contact information.

        ![Create a resource 7](media/azure-edge-hardware-center-new-order/create-resource-7.png)

9. Select **Next: Tags**. Optionally provide tags to categorize resources and consolidate billing. Select **Next: Review + create**.

10. On the **Review + create** tab, review the **Pricing details**, **Terms of use**, and the details for your resource. Select the combo box for **I have reviewed the privacy terms**.

    ![Create a resource 8](media/azure-edge-hardware-center-new-order/create-resource-8.png) 

    You are also notified that during the resource creation, a Managed Service Identity (MSI) is enabled that lets you authenticate to cloud services. This identity exists for as long as the resource exists.

11. Select **Create**.

    The resource creation takes a few minutes. An MSI is also created that lets the Azure Stack Edge device communicate with the resource provider in Azure.

    After the resource is successfully created and deployed, you're notified. Select **Go to resource**.

    ![Go to the Azure Stack Edge Pro resource](media/azure-edge-hardware-center-new-order/placeholder.png)

After the order is placed, Microsoft reviews the order and contacts you (via email) with shipping details.

[!NOTE]
> If you want to create multiple orders at one time or clone an existing order, you can use the [scripts in Azure Samples](https://github.com/Azure-Samples/azure-stack-edge-order). For more information, see the README file.<!--When new preview features are released, update this note in deploy-prep. Azure Edge Hardware Center method will be easier. Scripts were a stop-gap measure.

If you run into any issues during the order process, see [Troubleshoot order issues](azure-stack-edge-troubleshoot-ordering.md).<!--LATER: Closer to general release, will need to create separate troubleshooting for order through Azure Edge Hardware Center.-->


## Next steps

- TK: Manage addresses for your Azure Hardware Center orders
- To learn how to deploy virtual machines on your Azure Stack Edge Pro device, see [Deploy virtual machines via the Azure portal](azure-stack-edge-gpu-deploy-virtual-machine-portal.md).
