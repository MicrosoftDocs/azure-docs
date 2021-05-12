---
title: 'Tutorial: Create a device resource for Network Functions Manager'
titleSuffix: Azure Network Functions Manager
description: In this tutorial, you learn about how to create a device resource for NFM.
author: cherylmc

ms.service: vnf-manager
ms.topic: tutorial
ms.date: 03/17/2021
ms.author: cherylmc

---
# Tutorial: Create a device (Preview)

In this tutorial, you create a **Device** resource for Azure Network Functions Manager (NFM). A device resource is required in order to deploy network functions to Azure Stack Edge as managed applications.

In this tutorial, you:

> [!div class="checklist"]
> * Verify the  prerequisites
> * Create a device resource
> * Obtain a registration key
> * Register the device

## <a name="pre"></a>Prerequisites

Verify the following prerequisites:

* Verify that you have completed all the prerequisites listed in the [Overview](overview.md#pre) article.
* Verify that your subscription has been onboarded by the Azure Network Function Manager PM team. Contact **MEC-PM@microsoft.com** to help onboard your subscription.
* Review the [supported regions](faq.md) before creating a device.
* Verify that you have registered the **Network Function Manager** resource provider for your subscription. You can register this resource provider by going to your subscription. The status will show **Registered** once complete.

   :::image type="content" source="./media/create-device/providers.png" alt-text="Screenshot of resource providers." lightbox="./media/create-device/providers.png" :::

## <a name="create"></a>Create a device resource

If you have an existing Azure Network Function Manager **device** resource, you don't need to create one. Skip this section and go to the [registration key](#key) section.

To create a **device** resource, use the following steps.

1. Sign in to the Azure [Preview portal](https://aka.ms/AzureNetworkFunctionManager) using your Microsoft Azure credentials.
1. Select **+Add** and in the search bar, search for "Azure Network Function Manager". Select **Azure Network Function Manager – Device (preview)** from the results.

   :::image type="content" source="./media/create-device/preview.png" alt-text="Screenshot of Marketplace." lightbox="./media/create-device/preview.png":::
1. On the **Azure Network Functions Manager - Device (preview)** page, select **Create**.

   :::image type="content" source="./media/create-device/create.png" alt-text="Screenshot of create button." lightbox="./media/create-device/create.png":::
1. On the **Basics** tab, configure **Project details** and **Instance details** with the device settings.
   :::image type="content" source="./media/create-device/device-settings.png" alt-text="Screenshot of device settings." lightbox="./media/create-device/device-settings.png":::

   When you fill in the fields, a green check mark will appear when characters you add are validated. Some details are auto filled, while others are customizable fields:

   * **Subscription:** Verify that the subscription listed is the correct one. You can change subscriptions by using the drop-down.
   * **Resource group:** Select an existing resource group or click **Create new** to create a new one. For more information about resource groups, see Azure Resource Manager overview.
   * **Region:** Select the location for your device. This must be East US for Private Preview
   * **Name:** Enter the name for your device.
   * **Azure Stack Edge:** Select the online Azure Stack Edge device that you want to register as a device for Azure Network Functions Manager.
1. Select **Review + create** to validate the device settings.
1. After all the settings have been validated, select **Create**.

## <a name="key"></a>Get the registration key

1. Once your device is provisioned, navigate to the resource group in which the device is deployed.
1. Click the **device** resource. To obtain the registration key, click **Get registration key**.

   :::image type="content" source="./media/create-device/copy-key.png" alt-text="Screenshot of registration key." lightbox="./media/create-device/copy-key.png":::
1. Make a note of the device registration key, which will be used in the next steps.

   > [!IMPORTANT]
   > The registration key expires 24 hours after it is generated.
   >

## <a name="registration"></a>Register the device

Follow these steps to remotely connect from a Windows client:

1. To register the device with the registration key obtained in the previous step, connect to the Azure Stack Edge device via Windows PowerShell.
1. Once you have a PowerShell (minishell) connection to the appliance, enter the following command with the device registration key you obtained from the previous step as the parameter:

   ```powershell
   Invoke-MecRegister <device-registration-key>
   ```

## Next steps

> [!div class="nextstepaction"]
> [Create a network function as a managed application](create-function.md)

