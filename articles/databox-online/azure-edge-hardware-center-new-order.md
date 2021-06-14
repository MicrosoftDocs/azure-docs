---
title: Order Azure Edge devices from Azure Edge Hardware Center| Microsoft Docs
description: Learn how to order Azure Stack Edge devices in the Azure Edge Hardware Center.
services: databox
author: v-dalc

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 06/14/2021
ms.author: alkohli
Customer intent: As an IT admin, I want to be able to quickly place an order for multiple Azure Stack Edge devices using an existing shipping address.
---

# Order Azure Stack Edge devices from Azure Edge Hardware Center

This article explains how to place an order for one or more Azure Stack Edge devices from the Azure Edge Hardware Center.
       
## About the Azure Edge Hardware Center

BRIEF OVERVIEW - just what they need to know to take advantage of the new order capabilities. 


### Prerequisites

Before you begin, make sure that:

- Your Microsoft Azure subscription is enabled for an Azure Stack Edge resource. Make sure that you used a supported subscription such as [Microsoft Enterprise Agreement (EA)](https://azure.microsoft.com/overview/sales-number/), [Cloud Solution Provider (CSP)](/partner-center/azure-plan-lp), or [Microsoft Azure Sponsorship](https://azure.microsoft.com/offers/ms-azr-0036p/). Pay-as-you-go subscriptions aren't supported. To identify the type of Azure subscription you have, see [What is an Azure offer?](../cost-management-billing/manage/switch-azure-offer.md#what-is-an-azure-offer).
- You have owner or contributor access at resource group level for the Azure Stack Edge Pro/Data Box Gateway, IoT Hub, and Azure Storage resources.

    - To create any Azure Stack Edge / Data Box Gateway resource, you should have permissions as a contributor (or higher) scoped at resource group level. 
    - You also need to make sure that the `Microsoft.DataBoxEdge` and `MicrosoftKeyVault` resource providers are registered. To create any IoT Hub resource, `Microsoft.Devices` provider should be registered. 
        - To register a resource provider, in the Azure portal, go to **Home > Subscriptions > Your-subscription > Resource providers**. 
        - Search for the specific resource provider, for example, `Microsoft.DataBoxEdge`, and register the resource provider. 
    - To create a Storage account resource, again you need contributor or higher access scoped at the resource group level. Azure Storage is by default a registered resource provider.
- You have admin or user access to Azure Active Directory Graph API for generating activation key or credential operations such as share creation that uses a storage account. For more information, see [Azure Active Directory Graph API](/previous-versions/azure/ad/graph/howto/azure-ad-graph-api-permission-scopes#default-access-for-administrators-users-and-guest-users-).


## Create a new order

*STEPS FROM deploy-prep > portal. Not yet updated. Text AND PNGs are from deploy-prep.*

To create an order from the Azure Edge Hardware Center for Azure Stack Edge resources, take these steps:<!--I can now choose Azure Edge Hardware Center initially. This seems to require that I create a Hardware Center workspace before placing my first order. This will need to be a separate procedure. And I need to do a bit more reading first.-->

1. Use your Microsoft Azure credentials to sign in to the Azure portal at this URL: [https://portal.azure.com](https://portal.azure.com).

   1. In the left-pane, select **+ Create a resource**. Search for and select **Azure Stack Edge / Data Box Gateway**. Select **Create**. 

   1. Select **Try Azure Hardware Center**.

      ![Screenshot of option for creating a resource from the Azure Hardware Center](media/azure-stack-edge-gpu-deploy-prep/azure-hardware-center-create-resource-01.png)

   1. Select a product family from the selected subscriptions. For example, select **Azure Stack Edge**.<!--1) What determines "selected subscriptions"? 2) Find out all available product families.-->

    ![Screenshot of option for selecting a product family for an order in the Azure Hardware Center](media/azure-stack-edge-gpu-deploy-prep/azure-hardware-center-create-resource-02.png)

STOPPED HERE - 06/14/2021

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

    ![Go to the Azure Stack Edge Pro resource](media/azure-edge-hardware-center-new-order/azure-stack-edge-resource-1.png)

After the order is placed, Microsoft reviews the order and contacts you (via email) with shipping details.

> [!NOTE]
> If you want to create multiple orders at one time or clone an existing order, you can use the [scripts in Azure Samples](https://github.com/Azure-Samples/azure-stack-edge-order). For more information, see the README file.<!--When new preview features are released, update this note in deploy-prep. Azure Edge Hardware Center method will be easier. Scripts were a stop-gap measure.-->

If you run into any issues during the order process, see [Troubleshoot order issues](azure-stack-edge-troubleshoot-ordering.md).<!--LATER: Closer to general release, will need to create separate troubleshooting for order through Azure Edge Hardware Center.-->

## Initiate an order in Azure Edge Hardware Center

PLACEHOLDER: Will step through how to start by choosing "Azure Edge Hardware Center" as the new resource type.


## Next steps

To learn how to deploy virtual machines on your Azure Stack Edge Pro device, see [Deploy virtual machines via the Azure portal](azure-stack-edge-gpu-deploy-virtual-machine-portal.md).
