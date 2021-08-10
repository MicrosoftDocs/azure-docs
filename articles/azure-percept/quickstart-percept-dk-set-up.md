---
title: Set up your Azure Percept DK
description: Connect your dev kit to Azure and deploy your first AI model
author: mimcco
ms.author: mimcco
ms.service: azure-percept
ms.topic: quickstart
ms.date: 03/17/2021
ms.custom: template-quickstart #Required; leave this attribute/value as-is.
---

# Set up your Azure Percept DK

Complete the Azure Percept DK setup experience to configure your dev kit and deploy your first AI model. After verifying that your Azure account is compatible with Azure Percept, you will:

- Launch the Azure Percept DK setup experience
- Connect your dev kit to a Wi-Fi network
- Set up an SSH login for remote access to your dev kit
- Create a new device in Azure IoT Hub

If you experience any issues during this process, refer to the [setup troubleshooting guide](./how-to-troubleshoot-setup.md) for possible solutions.

> [!NOTE]
> The setup experience web service automatically shuts down after 30 minutes of non-use. If you are unable to connect to the dev kit or do not see its Wi-Fi access point, restart the device.

## Prerequisites

- An Azure Percept DK (dev kit).
- A Windows, Linux, or OS X based host computer with Wi-Fi capability and a web browser.
- An active Azure subscription. [Create an account for free.](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
- Users must have the **owner** or **contributor** role within the subscription. Follow the steps below to check your Azure account role. For more information on Azure role definitions, check out the [Azure role-based access control documentation](../role-based-access-control/rbac-and-directory-admin-roles.md#azure-roles).

    > [!CAUTION]
    > Close all browser windows and log into your subscription via the [Azure portal](https://portal.azure.com/) before starting the setup experience. See the [setup troubleshooting guide](./how-to-troubleshoot-setup.md) for additional information on how to ensure you are signed in with the correct account.

### Check your Azure account role

To verify if your Azure account is an “owner” or “contributor” within the subscription, follow these steps:

1. Go to the [Azure portal](https://portal.azure.com/) and log in with the same Azure account you intend to use with Azure Percept.

1. Select the **Subscriptions** icon (it looks like a yellow key).

1. Select your subscription from the list. If you do not see your subscription, make sure you are signed in with the correct Azure account. If you wish to create a new subscription, follow [these steps](../cost-management-billing/manage/create-subscription.md).

1. From the Subscription menu, select **Access control (IAM)**.
1. Select **View my access**.
1. Check the role:
    - If your role is listed as **Reader** or if you get a message that says you do not have permission to see roles, you will need to follow the necessary process in your organization to elevate your account role.
    - If your role is listed as **owner** or **contributor**, your account will work with Azure Percept, and you may proceed with the setup experience.

## Launch the Azure Percept DK Setup Experience

1. Connect your host computer to the dev kit’s Wi-Fi access point. Select the following network, and enter the Wi-Fi password when prompted:

    - **Network name**: **scz-xxxx** or **apd-xxxx** (where **xxxx** is the last four digits of the dev kit’s MAC address)
    - **Password**: found on the welcome card that came with the dev kit

    > [!WARNING]
    > While connected to the Azure Percept DK Wi-Fi access point, your host computer will temporarily lose its connection to the Internet. Active video conference calls, web streaming, or other network-based experiences will be interrupted.

1. Once connected to the dev kit’s Wi-Fi access point, the host computer will automatically launch the setup experience in a new browser window with **your.new.device/** in the address bar. If the tab does not open automatically, launch the setup experience by going to [http://10.1.1.1](http://10.1.1.1) in a web browser. Make sure your browser is signed in with the same Azure account credentials you intend to use with Azure Percept.

    :::image type="content" source="./media/quickstart-percept-dk-setup/main-welcome.png" alt-text="Welcome page.":::

    > [!NOTE]
    > **Mac users** - When going through the setup experience on a Mac, it initially opens a captive portal window that is unable to complete the Setup Experience. Close this window and open a web browser to https://10.1.1.1, which will allow you to complete the setup experience.

## Connect your dev kit to a Wi-Fi network

1. Select **Next** on the **Welcome** screen.

1. On the **Network connection** page, select **Connect to a new WiFi network**.

    If you have already connected your dev kit to your Wi-Fi network, select **Skip**.

1. Select your Wi-Fi network from the list of available networks and select **connect**. Enter your network password when prompted.

    > [!NOTE]
    > It is recommended that you set this network as a “Preferred Network” (Mac) or check the box to “connect automatically” (Windows).  This will allow the host computer to reconnect to the dev kit’s Wi-Fi access point if the connection is interrupted during this process.

1. Once your dev kit has successfully connected, the page will show the IPv4 address assigned to your dev kit. **Write down the IPv4 address displayed on the page.** You will need the IP address when connecting to your dev kit over SSH for troubleshooting and device updates.

    :::image type="content" source="./media/quickstart-percept-dk-setup/main-success-wi-fi.png" alt-text="Copy IP address.":::

	> [!NOTE]
    > The IP address may change with each device boot.

1. Read through the License Agreement (you must scroll to the bottom of the agreement), select **I have read and agree to the License Agreement**, and select **Next**.

    :::image type="content" source="./media/quickstart-percept-dk-setup/main-eula.png" alt-text="Accept EULA.":::

## Set up an SSH login for remote access to your dev kit

1. Create an SSH account name and public key/password, and select **Next**.

    If you have already created an SSH account, you can skip this step.

    **Write down your login information for later use**.

    > [!NOTE]
    > SSH (Secure Shell) is a network protocol that enables you to connect to the dev kit remotely via a host computer.

## 	Create a new device in Azure IoT Hub

1. Select **Setup as a new device** to create a new device within your Azure account.

    A Device Code will now be obtained from Azure.

1. Select **Copy**.

    :::image type="content" source="./media/quickstart-percept-dk-setup/main-copy-code.png" alt-text="Copy device code.":::

    > [!NOTE]
    > If you receive an error when using your Device Code in the next steps or if the Device Code won’t display, please see our [troubleshooting steps](./how-to-troubleshoot-setup.md) for more information. 

1. Select **Login to Azure**.

1. A new browser tab will open with a window that says **Enter code**. Paste the code into the window and select **Next**. Do NOT close the **Welcome** tab with the setup experience.

    :::image type="content" source="./media/quickstart-percept-dk-setup/main-enter-code.png" alt-text="Enter device code.":::

1. Sign into Azure Percept using the Azure account credentials you will use with your dev kit. Leave the browser tab open when complete.

    > [!CAUTION]
    > Your browser may auto cache other credentials. Double check that you are signing in with the correct account.

    After successfully signing into Azure Percent on the device, select **Allow**. 
    
    Return to the **Welcome** tab to continue the setup experience.

1. When the **Assign your device to your Azure IoT Hub** page appears on the **Welcome** tab, take one of the following actions:

    - Jump ahead to **Select your Azure IoT Hub**, if your Iot Hub is listed on this page.
    - If you do not have an IoT Hub or would like to create a new one, select **Create a new Azure IoT Hub**.

    > [!IMPORTANT]
    > If you have an IoT Hub, but it is not appearing in the list, you may have signed into Azure Percept with the wrong credentials. See the [setup troubleshooting guide](./how-to-troubleshoot-setup.md) for help.

    :::image type="content" source="./media/quickstart-percept-dk-setup/main-iot-hub-select.png" alt-text="Select an IoT Hub.":::

1. To create a new IoT Hub,

    - Select the Azure subscription you will use with Azure Percept.
    - Select an existing Resource Group. If one does not exist, select **Create new** and follow the prompts.
    - Select the Azure region closest to your physical location.
    - Give your new IoT Hub a name.
    - Select the S1 (standard) pricing tier.

    > [!NOTE]
    > It may take a few minutes for your IoT Hub deployment to complete. If you need a higher [message throughput](../iot-hub/iot-hub-scaling.md#message-throughput) for your edge AI applications, you may [upgrade your IoT Hub to a higher standard tier](../iot-hub/iot-hub-upgrade.md) in the Azure Portal at any time. B and F tiers do NOT support Azure Percept.

1. When the deployment is complete, select **Register**.

1. Select your Azure IoT Hub

1. Enter a device name for your dev kit and select **Next**.

1. The device modules will now be deployed to your device. – this can take a few minutes.

    :::image type="content" source="./media/quickstart-percept-dk-setup/main-finalize.png" alt-text="Finalizing setup.":::

1. **Device setup complete!** Your dev kit has successfully linked to your IoT Hub and deployed all modules.

    > [!NOTE]
    > After completion, the dev kit’s Wi-Fi access point will automatically disconnect and the setup experience web service will be terminated resulting in two notifications.

    > [!NOTE]
    > The IoT Edge containers that get configured as part of this set up process use certificates that will expire after 90 days. The certificates can be automatically regenerated by restarting IoT Edge. Refer to [Manage certificates on an IoT Edge device](../iot-edge/how-to-manage-device-certificates.md) for more details.

1. Connect your host computer to the Wi-Fi network your dev kit is connected to.

1. Select **Continue to the Azure portal**.

    :::image type="content" source="./media/quickstart-percept-dk-setup/main-Azure-portal-continue.png" alt-text="Go to Azure Percept Studio.":::

### Video walk-through 
See the below video for a visual walk-through of the steps described above.
> [!VIDEO https://www.youtube.com/embed/-dmcE2aQkDE]

## Next steps

Now that your dev kit is set up, it's time to see vision AI in action.
- [View your dev kit video stream](./how-to-view-video-stream.md)
- [Deploy a vision AI model to your dev kit](./how-to-deploy-model.md)