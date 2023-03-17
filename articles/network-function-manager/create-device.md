---
title: 'Quickstart: Create a device resource for Azure Network Function Manager'
description: In this quickstart, learn about how to create a device resource for Azure Network Function Manager.
author: polarapfel
ms.service: network-function-manager
ms.topic: quickstart
ms.date: 11/02/2021
ms.author: tobiaw
ms.custom: ignite-fall-2021, mode-other
---
# Quickstart: Create a Network Function Manager device resource

In this quickstart, you create a **Device** resource for Azure Network Function Manager (NFM). The Network Function Manager device resource is linked to the Azure Stack Edge resource. The device resource aggregates all the network functions deployed on Azure Stack Edge device and provides common services for deployment, monitoring, troubleshooting, and consistent management operations for all network functions deployed on Azure Stack Edge. You are required to create the Network Function Manager device resource before you can deploy network functions to Azure Stack Edge device.

## <a name="pre"></a>Prerequisites

Verify the following prerequisites:

* Verify that you have an Azure account with an active subscription. If you need an account, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* You have met all the prerequisites listed in the [Prerequisites and requirements](requirements.md) article.
* You have the proper permissions assigned. For more information, see [Resource Provider registration and permissions](resources-permissions.md).
* Review the [Region Availability](overview.md#regions) section before creating a Device resource.
* Verify that you can remotely connect from a Windows client to the Azure Stack Edge Pro GPU device via PowerShell. For more information, see [Connect to the PowerShell interface](../databox-online/azure-stack-edge-gpu-connect-powershell-interface.md#connect-to-the-powershell-interface).

## <a name="create"></a>Create a device resource

If you have an existing Azure Network Function Manager device resource, you don't need to create one. Skip this section and go to the [registration key](#key) section.

To create a **device** resource, use the following steps.

1. Sign in to the [Azure portal](https://portal.azure.com) using your Microsoft Azure credentials.

1. On the **Basics** tab, configure **Project details** and **Instance details** with the device settings.
   :::image type="content" source="./media/create-device/device-settings.png" alt-text="Screenshot of device settings.":::

   When you fill in the fields, a green check mark will appear when characters you add are validated. Some details are auto filled, while others are customizable fields:

   * **Subscription:** Verify that the subscription listed is the correct one. You can change subscriptions by using the drop-down.
   * **Resource group:** Select an existing resource group or click **Create new** to create a new one.
   * **Region:** Select the location for your device. This must be a supported region. For more information, see [Region Availability](overview.md#regions).
   * **Name:** Enter the name for your device.
   * **Azure Stack Edge:** Select the Azure Stack Edge resource that you want to register as a device for Azure Network Function Manager. The ASE resource must be in **Online** status for a device resource to be successfully created. You can check the status of your ASE resource by going to **Properties** section in the Azure Stack Edge resource page.
1. Select **Review + create** to validate the device settings.
1. After all the settings have been validated, select **Create**.
   
   >[!NOTE]
   >The Network Function Manager device resource can be linked to only one Azure Stack Edge resource. You will be required to create a separate NFM device resource for each Azure Stack Edge resource.
   >

## <a name="key"></a>Get the registration key

1. Once your device is successfully provisioned, navigate to the resource group in which the device resource is deployed.
1. Click the **device** resource. To obtain the registration key, click **Get registration key**. Ensure you have the proper permissions to generate a registration key. For more information, see the [Resource Provider registration and permissions](resources-permissions.md) article.

   :::image type="content" source="./media/create-device/register-device.png" alt-text="Screenshot of registration key." lightbox="./media/create-device/register-device.png":::
1. Make a note of the device registration key, which will be used in the next steps.

   > [!IMPORTANT]
   > The registration key expires 24 hours after it is generated. If your registration key is no longer active, you can generate a new registration key by repeating the steps in this section.
   >

## <a name="registration"></a>Register the device

Follow these steps to register the device resource with Azure Stack Edge.

1. To register the device with the registration key obtained in the previous step, [connect to the Azure Stack Edge device via Windows PowerShell](../databox-online/azure-stack-edge-gpu-connect-powershell-interface.md#connect-to-the-powershell-interface).

1. Once you have a PowerShell (minishell) connection to the appliance, enter the following command with the device registration key you obtained from the previous step as the parameter:
   ```powershell
   Invoke-MecRegister <device-registration-key>
   ```

1. Verify that the device resource has **Device Status = registered**.

   :::image type="content" source="./media/create-device/device-registered.png" alt-text="Screenshot of device registered." lightbox="./media/create-device/device-registered.png":::
 
## Next steps

> [!div class="nextstepaction"]
> [Deploy a network function](deploy-functions.md)
