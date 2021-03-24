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

# Set up your Azure Percept DK and deploy your first AI model

Complete the Azure Percept DK setup experience to configure your dev kit and deploy your first AI model. After verifying that your Azure account is compatible with Azure Percept, you will:

- Connect your dev kit to a Wi-Fi network
- Set up an SSH login for remote access to your dev kit
- Create a new IoT Hub to use with Azure Percept
- Connect your dev kit to your IoT Hub and Azure account

If you experience any issues during this process, refer to the [setup troubleshooting guide](./how-to-troubleshoot-setup.md) for possible solutions.

## Prerequisites

- An Azure Percept DK (dev kit).
- A Windows, Linux, or OS X based host computer with Wi-Fi capability and a web browser.
- An Azure account with an active subscription. [Create an account for free.](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
- The Azure account must have the **owner** or **contributor** role within the subscription. Follow the steps below to check your Azure account role. For more information on Azure role definitions, check out the [Azure role-based access control documentation](../role-based-access-control/rbac-and-directory-admin-roles.md#azure-roles).

    > [!CAUTION]
    > If you have multiple Azure accounts, your browser may cache credentials from another account. To avoid confusion, it is recommended that you close all unused browser windows and log into the [Azure portal](https://portal.azure.com/) before starting the setup experience. See the [setup troubleshooting guide](./how-to-troubleshoot-setup.md) for additional information on how to ensure you are signed in with the correct account.

### Check your Azure account role

To verify if your Azure account is an “owner” or “contributor” within the subscription, follow these steps:

1. Go to the [Azure portal](https://portal.azure.com/) and log in with the same Azure account you intend to use with Azure Percept.

1. Click on the **Subscriptions** icon (it looks like a yellow key).

1. Select your subscription from the list. If you do not see your subscription, make sure you are signed in with the correct Azure account. If you wish to create a new subscription, follow [these steps](../cost-management-billing/manage/create-subscription.md).

1. From the Subscription menu, select **Access control (IAM)**.
1. Click **View my access**.
1. Check the role:
    - If your role is listed as **Reader** or if you get a message that says you do not have permission to see roles, you will need to follow the necessary process in your organization to elevate your account role.
    - If your role is listed as **owner** or **contributor**, your account will work with Azure Percept, and you may proceed with the setup experience.

## Launch the Azure Percept DK Setup Experience

1. Connect your host computer directly to the dev kit’s Wi-Fi access point. Like connecting to any other Wi-Fi network, open the network and internet settings on your computer, click on the following network, and enter the network password when prompted:

    - **Network name**: depending on your dev kit's operating system version, the name of the Wi-Fi access point is either **scz-xxxx** or **apd-xxxx** (where “xxxx” is the last four digits of the dev kit’s MAC address)
    - **Password**: can be found on the Welcome Card that came with the dev kit

    > [!WARNING]
    > While connected to the Azure Percept DK Wi-Fi access point, your host computer will temporarily lose its connection to the Internet. Active video conference calls, web streaming, or other network-based experiences will be interrupted.

1. Once connected to the dev kit’s Wi-Fi access point, the host computer will automatically launch the setup experience in a new browser window with **your.new.device/** in the address bar. If the tab does not open automatically, launch the setup experience by going to [http://10.1.1.1](http://10.1.1.1). Make sure your browser is signed in with the same Azure account credentials you intend to use with Azure Percept.

    :::image type="content" source="./media/quickstart-percept-dk-setup/main-01-welcome.png" alt-text="Welcome page.":::

    > [!CAUTION]
    > The setup experience web service will shut down after 30 minutes of non-use. If this happens, restart the dev kit to avoid connectivity issues with the dev kit's Wi-Fi access point.

## Complete the Azure Percept DK Setup Experience

1. Click **Next** on the **Welcome** screen.

1. On the **Network connection** page, click **Connect to a new WiFi network**.

    If you have already connected your dev kit to your Wi-Fi network, click **Skip**.

1. Select your Wi-Fi network from the list of available networks and click **connect**. Enter your network password when prompted.

1. Once your dev kit has successfully connected to your network of choice, the page will show the IPv4 address assigned to your dev kit. **Write down the IPv4 address displayed on the page.** You will need the IP address when connecting to your dev kit over SSH for troubleshooting and device updates.

    :::image type="content" source="./media/quickstart-percept-dk-setup/main-04-success-wi-fi.png" alt-text="Copy IP address.":::

	> [!NOTE]
    > The IP address may change with each device boot.

1. Read through the License Agreement, select **I have read and agree to the License Agreement** (you must scroll to the bottom of the agreement), and click **Next**.

    :::image type="content" source="./media/quickstart-percept-dk-setup/main-05-eula.png" alt-text="Accept EULA.":::

1. Enter an SSH account name and password, and **write down your login information for later use**.

    > [!NOTE]
    > SSH (Secure Shell) is a network protocol that enables you to connect to the dev kit remotely via a host computer.

1. On the next page, click **Setup as a new device** to create a new device within your Azure account.

1. Click **Copy** to copy your device code. Afterward, click **Login to Azure**.

    :::image type="content" source="./media/quickstart-percept-dk-setup/main-08-copy-code.png" alt-text="Copy device code.":::

1. A new browser tab will open with a window that says **Enter code**. Paste the code into the window and click **Next**. Do NOT close the **Welcome** tab with the setup experience.

    :::image type="content" source="./media/quickstart-percept-dk-setup/main-09-enter-code.png" alt-text="Enter device code.":::

1. Sign into Azure Percept using the Azure account credentials you will use with your dev kit. Leave the browser tab open when complete.

    > [!CAUTION]
    > Your browser may auto cache other credentials. Double check that you are signing in with the correct account.

    After successfully signing into Azure Percent on the device, return to the **Welcome** tab to continue the setup experience.

1. When the **Assign your device to your Azure IoT Hub** page appears on the **Welcome** tab, take one of the following actions:

    - If you already have an IoT Hub you would like to use with Azure Percept and it is listed on this page, select it and jump to step 15.
    - If you do not have an IoT Hub or would like to create a new one, click **Create a new Azure IoT Hub**.

    > [!IMPORTANT]
    > If you have an IoT Hub, but it is not appearing in the list, you may have signed into Azure Percept with the wrong credentials. See the [setup troubleshooting guide](./how-to-troubleshoot-setup.md) for help.

    :::image type="content" source="./media/quickstart-percept-dk-setup/main-13-iot-hub-select.png" alt-text="Select an IoT Hub.":::

1. To create a new IoT Hub, complete the following fields:

    - Select the Azure subscription you will use with Azure Percept.
    - Select an existing Resource Group. If one does not exist, click **Create new** and follow the prompts.
    - Select the Azure region closest to your physical location.
    - Give your new IoT Hub a name.
    - Select the S1 (standard) pricing tier.

    > [!NOTE]
    > If you end up needing a higher [message throughput](https://docs.microsoft.com/azure/iot-hub/iot-hub-scaling#message-throughput) for your edge AI applications, you may [upgrade your IoT Hub to a higher standard tier](https://docs.microsoft.com/azure/iot-hub/iot-hub-upgrade) in the Azure Portal at any time. B and F tiers do NOT support Azure Percept.

1. IoT Hub deployment may take a few minutes. When the deployment is complete, click **Register**.

    :::image type="content" source="./media/quickstart-percept-dk-setup/main-16-iot-hub-success.png" alt-text="IoT Hub successfully deployed.":::

1. Enter a device name for your dev kit and click **Next**.

1. Wait for the device modules to download – this will take a few minutes.

    :::image type="content" source="./media/quickstart-percept-dk-setup/main-18-finalize.png" alt-text="Finalizing setup.":::

1. When you see the **Device setup complete!** page, your dev kit has successfully linked to your IoT Hub and downloaded the necessary software. Your dev kit will automatically disconnect from the Wi-Fi access point resulting in these two notifications:

    <!---
    > [!NOTE]
    > The onboarding process and connection to the device Wifi access to your host computer shuts down at this point, but your dev kit will stay connected to the internet.   You can restart the onboarding experience with a dev kit reboot, which will allow you to go back through the onboarding and reconnect the device to a different IOT hub associated with the same or a different Azure Subscription..
    --->

    :::image type="content" source="./media/quickstart-percept-dk-setup/main-19-0-warning.png" alt-text="Setup experience disconnect warning.":::

1. Connect your host computer to the Wi-Fi network your devkit connected to in Step 2.

1. Click **Continue to the Azure portal**.

    :::image type="content" source="./media/quickstart-percept-dk-setup/main-20-azure-portal-continue.png" alt-text="Go to Azure Percept Studio.":::

## View your dev kit video stream and deploy a sample model

1. The [Azure Percept Studio Overview page](https://go.microsoft.com/fwlink/?linkid=2135819) is your launch point for accessing many different workflows for both beginning and advanced edge AI solution development. To get started, click on **Devices** from the left menu.

    :::image type="content" source="./media/quickstart-percept-dk-setup/portal-01-get-device-list.png" alt-text="View your list of devices.":::

1. Verify your dev kit is listed as **Connected** and click on it to view the device page.

    :::image type="content" source="./media/quickstart-percept-dk-setup/portal-02-select-device.png" alt-text="Select your device.":::

1. Click **View your device stream**. If this is the first time viewing the video stream of your device, you will see a notification that a new model is being deployed in the upper right-hand corner. This may take a few minutes.

    :::image type="content" source="./media/quickstart-percept-dk-setup/portal-03-1-start-video-stream.png" alt-text="View your video stream.":::

    Once the model has deployed, you will get another notification with a **View stream** link. Click on the link to view the video stream from your Azure Percept Vision camera in a new browser window. The dev kit is preloaded with an AI model that automatically performs object detection of many common objects.

    :::image type="content" source="./media/quickstart-percept-dk-setup/portal-03-2-object-detection.png" alt-text="See object detection.":::

1. Azure Percept Studio also has a number of sample AI models. To deploy a sample model to your dev kit, navigate back to your device page and click **Deploy a sample model**.

    :::image type="content" source="./media/quickstart-percept-dk-setup/portal-04-explore-prebuilt.png" alt-text="Explore pre-built models.":::

1. Select a sample model from the library and click **Deploy to device**.

    :::image type="content" source="./media/quickstart-percept-dk-setup/portal-05-2-select-journey.png" alt-text="See object detection in action.":::

1. Once the model has successfully deployed, you will see a notification with a **View stream** link in the upper right corner of the screen. To view the model inferencing in action, click the link in the notification or return to the device page and click **View your device stream**. Any models previously running on the dev kit will now be replaced with the new model.

## Video walkthrough

For a visual walkthrough of the steps described above, please see the following video (setup experience starts at 0:50):

</br>

> [!VIDEO https://www.youtube.com/embed/-dmcE2aQkDE]

## Next steps

> [!div class="nextstepaction"]
> [Create a no-code vision solution](./tutorial-nocode-vision.md)