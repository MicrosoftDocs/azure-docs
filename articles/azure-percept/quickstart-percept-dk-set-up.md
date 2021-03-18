---
title: Set up your Azure Percept DK
description: Connect your dev kit to Azure and deploy your first AI model
author: mimcco
ms.author: mimcco
ms.service: azure-percept
ms.topic: quickstart
ms.date: 02/15/2021
ms.custom: template-quickstart #Required; leave this attribute/value as-is.
---

# Set up your Azure Percept DK and deploy your first AI model

Get started with Azure Percept DK and Azure Percept Studio by using the Azure Percept DK setup experience to connect your device to Azure and to deploy your first AI model. After verifying that your Azure account is compatible with Azure Percept Studio, you complete the setup experience to ensure your Azure Percept DK is configured to create Edge AI proof of concepts.

If you experience any issues during this Quick Start, refer to the [troubleshooting](./troubleshoot-dev-kit.md) guide for possible solutions.

## Prerequisites

- An Azure Percept DK.
- A Windows, Linux, or OS X based host computer with wi-fi capability and a web browser.
- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
- The Azure account must have the “owner” or “contributor” role on the subscription. Learn more about [Azure role definitions](https://docs.microsoft.com/azure/role-based-access-control/rbac-and-directory-admin-roles#azure-roles).

### Prerequisite check

To verify if your Azure account is an “owner” or “contributor” on the subscription, following these steps.

1. Go to the Azure portal and log in with the same Azure account you intend to use with Azure Percept Studio. 

    > [!NOTE]
    > If you have multiple Azure accounts, your browser may cache credentials from another account. See the troubleshooting guide for more information on how to ensure you are signed in with the correct account.

1. Expand the main menu from the upper left corner of your screen and click on “Subscriptions” or select “Subscriptions” from the menu of icons on the home page. 
    <!---
    :::image type="content" source="./media/quickstart-percept-dk-setup/prereq-01-subscription.png" alt-text="supscription icon in Azure portal.":::
    --->
1. Select your subscription from the list. If you do not see your subscription in the list, make sure you are signed in with the correct Azure account. 
    <!---
    :::image type="content" source="./media/quickstart-percept-dk-setup/prereq-02-sub-list.png" alt-text="supscription list in Azure portal.":::
    --->
If you wish to create a new subscription, follow [these steps](https://docs.microsoft.com/azure/cost-management-billing/manage/create-subscription).

1. From the Subscription menu select “Access control (IAM)”
1. Click on the “View my access” button
1. Check the role
    - If it shows the role of “Reader” or if you get a message that says you do not have permissions to see roles, you will need to follow the necessary process in your organization to get your account role elevated.
    - If it shows the role as “owner” or “contributor”, your account will work with Azure Percept Studio. 

## Launch the Azure Percept DK Setup Experience

<!---
> [!NOTE]
> Connecting over ethernet? See [this how-to guide](<link needed>) for detailed instructions.
--->
1. Connect your host computer directly to the dev kit’s wi-fi access point. This is done just like connecting to any other wi-fi network,
    - **network name**: scz-xxxx (where “xxxx” is the last four digits of the dev kit’s MAC network address)
    - **password**: can be found on the Welcome Card that came with the dev kit

    > [!WARNING]
    > While connected to the Azure Percept DK wi-fi access point, your host computer will temporarily lose its connection to the Internet. Active video conference calls, web streaming, or other network-based experiences will be interrupted until step 3 of the Azure Percept DK setup experience is completed.

1. Once connected to the dev kit’s wi-fi access point, the host device will automatically launch the Azure Percept DK setup experience in a new browser window. If it does not automatically open, you can launch it manually by opening a browser window and navigating to [http://10.1.1.1](http://10.1.1.1). 

1. Now that you have launched the Azure Percept setup experience, you are ready to proceed through the setup experience. 

    > [!NOTE]
    > The Azure Percept DK setup experience web service will shut down after 30 minutes of non-use and at the completion of the setup experience. When this happens, it is recommended to restart the dev kit to avoid connectivity issues with the dev kit wi-fi access point.

## Complete the Azure Percept DK Setup Experience

1. Get Started - Click **Next** on the Welcome screen.

    :::image type="content" source="./media/quickstart-percept-dk-setup/main-01-welcome.png" alt-text="Welcome page.":::

1. Connect to wi-fi - On the Network connection page, click **Connect to a new WiFi network** to connect your devkit to your wi-fi network.

    If you have previously connected this dev kit to your wi-fi network or if you are already connected to the Azure Percept DK setup experience via your wi-fi network, click the **Skip** link.

    :::image type="content" source="./media/quickstart-percept-dk-setup/main-02-connect-to-wi-fi.png" alt-text="Connect to wi-fi.":::

1. Select your wi-fi network from the available connections and connect. (Will require your local wi-fi password)

    :::image type="content" source="./media/quickstart-percept-dk-setup/main-03-select-wi-fi.png" alt-text="Select wi-fi network."::: 

1. Copy your IP address - Once your devkit has successfully connected to your network of choice, write down the **IPv4 address** displayed on the page. **You will need this IP address later in this quick start guide**. 

    > [!NOTE]
    > The IP address may change with each device boot.

    :::image type="content" source="./media/quickstart-percept-dk-setup/main-04-success-wi-fi.png" alt-text="Copy IP address.":::

1. Review and accept the License Agreement - Read through the License Agreement, select **I have read and agree to the License Agreement** (must scroll to the bottom of the agreement), and click **Next**.

    :::image type="content" source="./media/quickstart-percept-dk-setup/main-05-eula.png" alt-text="Accept EULA.":::

1. Create your SSH login account - Set up SSH for remote access to your devkit. Create a SSH username and password. 

    > [!NOTE]
    > SSH (Secure Shell) is a network protocol used for secure communication between the host device and the dev kit. For more information about SSH, see [this article](https://en.wikipedia.org/wiki/SSH_(Secure_Shell)).

    :::image type="content" source="./media/quickstart-percept-dk-setup/main-06-ssh-login.png" alt-text="Create SSH account."::: 

1. Begin the dev kit connection process - On the next screen, click **Connect with a new device** to begin the process of connecting your dev kit to Azure IoT Hub. 

    <!---
    Connecting with an existing IoT Edge device connection string? See this [how-to guide](<link needed>) for reference.
    --->
    :::image type="content" source="./media/quickstart-percept-dk-setup/main-07-connect-device.png" alt-text="Connect to Azure."::: 

1. Copy the device code - Click the **Copy** link to copy your device code. Then click **Login to Azure**. 

    :::image type="content" source="./media/quickstart-percept-dk-setup/main-08-copy-code.png" alt-text="Copy device code."::: 

1. Paste the device code - A new browser tab will open with a window that asks for the copied device code. Paste the code into the window and click **Next**.

    :::image type="content" source="./media/quickstart-percept-dk-setup/main-09-enter-code.png" alt-text="Enter device code."::: 

1. Sign into Azure - The next window requires you to sign in with the Azure account you verified at the beginning of the Quick Start. Enter those login credentials and click **Next**. 

    > [!NOTE]
    > Your browser may auto cache other credentials. Double check that you are signing in with the correct account.

    :::image type="content" source="./media/quickstart-percept-dk-setup/main-10-azure-sign-in.png" alt-text="Sign-in to Azure.":::
 
1. Do not close the setup experience browser tab at this step - After signing in you will be presented with a screen acknowledging that you have signed in. Although it says you many close the window, **we recommend that you do not close any windows**. 

    :::image type="content" source="./media/quickstart-percept-dk-setup/main-11-sign-in-success.png" alt-text="Sign-in success."::: 

1. Return to the browser tab hosting the setup experience.
1. Select your IoT Hub option
    - If you already have an IoT Hub and it is listed on this page, you can select it and **jump to step 17**.
    - If you do not have an IoT Hub or would like to create a new one, go to the bottom of the list and click on **Create a new Azure IoT Hub**.

    :::image type="content" source="./media/quickstart-percept-dk-setup/main-13-iot-hub-select.png" alt-text="Select an IoT Hub."::: 

1. Create your new IoT Hub – Fill out all fields on this page. 
    - Select the Azure subscription you will use with Azure Percept Studio
    - Select an existing Resource Group. If one does not exist, click “Create new” and follow the prompts. 
    - Select the Azure region. 
    - Give your new IoT Hub a name
    - Select the pricing tier (it will usually match the subscription)

    :::image type="content" source="./media/quickstart-percept-dk-setup/main-14-create-iot-hub.png" alt-text="Create a new IoT Hub."::: 

1. Wait for the IoT Hub to get deployed – It may take a few minutes

    :::image type="content" source="./media/quickstart-percept-dk-setup/main-15-iot-hub-deploy.png" alt-text="Deploy IoT Hub."::: 

1. Register your dev kit - When the deployment is completed, click the **Register** button

    :::image type="content" source="./media/quickstart-percept-dk-setup/main-16-iot-hub-success.png" alt-text="IoT Hub successfully deployed."::: 

1. Name your dev kit - Enter a device name for your dev kit and click **Next**.

    :::image type="content" source="./media/quickstart-percept-dk-setup/main-17-device-name.png" alt-text="Name the device."::: 

1. Wait for the default AI models to download – this will take a few minutes

    :::image type="content" source="./media/quickstart-percept-dk-setup/main-18-finalize.png" alt-text="Finalizing setup."::: 

1. See vision AI in action - Your devkit has been successfully linked to your Azure IoT Hub and it has received the default vision AI object detection model. The Azure Percept Vision camera can now make object detection inferencing without a connection to the cloud. 

    :::image type="content" source="./media/quickstart-percept-dk-setup/main-19-2-preview-video-output.png" alt-text="Click Preview Video Output."::: 
	   
    > [!NOTE]
    > The onboarding process and connection to the device Wifi access to your host computer shuts down at this point, but your dev kit will stay connected to the internet.   You can restart the onboarding experience with a dev kit reboot, which will allow you to go back through the onboarding and reconnect the device to a different IOT hub associated with the same or a different Azure Subscription..

    :::image type="content" source="./media/quickstart-percept-dk-setup/main-19-0-warning.png" alt-text="Setup experience disconnect warning."::: 

1. Continue to the Azure portal – Go back to the setup experience window and click on the **Continue to the Azure portal** button to begin creating your custom AI models in Azure Percept Studio.

    > [!NOTE]
    > Verify that your host computer is no longer connected to the dev kit access point in your wifi settings and is now reconnected to your local wifi.

    :::image type="content" source="./media/quickstart-percept-dk-setup/main-20-azure-portal-continue.png" alt-text="Go to Azure Percept Studio."::: 

## View your Device in the Azure Percept Studio and deploy common prebuilt sample apps

1. View your list of Devices from the [Azure Percept Studio](https://go.microsoft.com/fwlink/?linkid=2135819) Overview Page. The Azure Percept Overview page is your launch point for accessing many different workflows for both beginning and advanced AI Edge Model and Solution Development

	:::image type="content" source="./media/quickstart-percept-dk-setup/portal-01-get-device-list.png" alt-text="View your list of devices.":::
	
1. Verify the device you just created is connected and click on it.

	:::image type="content" source="./media/quickstart-percept-dk-setup/portal-02-select-device.png" alt-text="Select your device.":::

1. View your device stream to see what your dev kit camera is seeing. A default object detection model is deployed out of the box and will detect a number of common objects.

	> [!NOTE]
    > the first time you do this on a new device you will get a notification that a new module is being deployed in the upper right hand corner.  Once this is competed, you will be able to launch the window with the camera video stream. 
	
	:::image type="content" source="./media/quickstart-percept-dk-setup/portal-03-1-start-video-stream.png" alt-text="View your video stream.":::
	
	:::image type="content" source="./media/quickstart-percept-dk-setup/portal-03-2-object-detection.png" alt-text="See object detection.":::

1. Explore Pre-built sample AI Models.   The Azure Precept Studio has a number of common pre-built samples which can be deployed with a single click.   Select “Deploy a sample model” to view and deploy these.

	:::image type="content" source="./media/quickstart-percept-dk-setup/portal-04-explore-prebuilt.png" alt-text="Explore pre-built models.":::
	
1. Deploy a new pre-built sample to your connected device. Select a sample from the library and click on “Deploy to Device”

	:::image type="content" source="./media/quickstart-percept-dk-setup/portal-05-2-select-journey.png" alt-text="See object detection in action.":::

## Video walkthrough

For a visual walkthrough of the steps described above, please see the following video (setup experience starts at 0:50):

</br>

> [!VIDEO https://www.youtube.com/embed/-dmcE2aQkDE]

## Next steps

You can follow a similar flow to try out [prebuilt speech models](./tutorial-no-code-speech.md).