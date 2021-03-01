---
title: Create a voice assistant with Azure Percept DK and Azure Percept Audio
description: Learn how to create and deploy a no-code speech solution to your Azure Percept DK
author: elqu20
ms.author: v-elqu
ms.service: azure-percept
ms.topic: tutorial
ms.date: 02/17/2021
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

# Create a voice assistant with Azure Percept DK and Azure Percept Audio

In this tutorial, you will create a voice assistant from a template to use with your Azure Percept DK and Azure Percept Audio. The voice assistant demo runs within [Azure Percept Studio](https://go.microsoft.com/fwlink/?linkid=2135819) and contains a selection of voice-controlled virtual objects. To control an object, say your keyword, which is a word or short phrase that wakes your device, followed by a command. Each template responds to a set of specific commands.

This guide will walk you through the process of setting up your devices, creating a voice assistant and the necessary [Speech Services](https://docs.microsoft.com/azure/cognitive-services/speech-service/overview) resources, testing your voice assistant, configuring your keyword, and creating custom keywords.

## Prerequisites

- Azure Percept DK (devkit)
- Azure Percept Audio
- Speaker or headphones (optional)
- [Azure subscription](https://azure.microsoft.com/free/)
- [Azure Percept DK setup experience](./quickstart-percept-dk-set-up.md): you connected your devkit to a Wi-Fi network, created an IoT Hub, and connected your devkit to the IoT Hub

## Device setup

1. (Optionally) connect your speaker or headphones to the Audio SoM via the headphone jack, which is labeled "Line Out." This will allow you to hear your voice assistant's audio responses. If you do not connect a speaker or headphones, you will still be able to see the responses as text in the demo window.

1. Connect the Audio SoM to the carrier board of your devkit with the included USB-A to micro B cable.

1. Power on the devkit.

    - LED L01 on the Audio SoM will change to solid green to indicate that the device was powered on.
    - LED L02 will change to blinking green to indicate that the Audio SoM is authenticating.

1. Wait for the authentication process to complete--this can take up to 3 minutes.

1. Proceed to the next section when you see one of the following:

    - LED L01 turns off and L02 turns white. This indicates that authentication is complete, and the devkit has not been configured with a keyword yet.
    - All three LEDs turn blue. This indicates that authentication is complete, and the devkit is configured with a keyword.

    > [!NOTE]
    > Reach out to support if your devkit does not authenticate.

## Create a voice assistant using an available template

1. Navigate to [Azure Percept Studio](https://go.microsoft.com/fwlink/?linkid=2135819).

1. Open the **Demos & tutorials** tab.

    :::image type="content" source="./media/tutorial-no-code-speech/portal-overview.png" alt-text="Azure portal homepage.":::

1. Click **Try out voice assistant templates** under **Speech tutorials and demos**. This will open a window on the right side of your screen.

1. Do the following in the window:

    1. In the **IoT Hub** dropdown menu, select the IoT hub to which your devkit is connected.

    1. In the **Device** dropdown menu, select your devkit.

    1. Select one of the available voice assistant templates.

    1. Click the **I agree to terms & conditions for this project** checkbox.

    1. Click **Create**.

    :::image type="content" source="./media/tutorial-no-code-speech/template-creation.png" alt-text="Voice assistant template creation.":::

1. After clicking **Create**, the portal opens another window to create your speech theme resource. Do the following in the window:

    1. Select your Azure subscription in the **Subscription** box.

    1. Select your preferred resource group from the **Resource group** dropdown menu. If you would like to create a new resource group to use with your voice assistant, click **Create** under the dropdown menu and follow the prompts.

    1. For **Application prefix**, enter a name. This will be the prefix for your project and your custom command name.

    1. Under **Region**, select the region to deploy resources to.

    1. Under **LUIS prediction pricing tier**, select **Standard** (the free tier does not support speech requests).

    1. Click the **Create** button. Resources for the voice assistant application will be deployed to your subscription.

        > [!WARNING]
        > Do **NOT** close the window until the portal has finished deploying the resource. Closing the window prematurely can result in unexpected behavior of the voice assistant. Once your resource has been deployed, the demo will be displayed.

    :::image type="content" source="./media/tutorial-no-code-speech/resource-group.png" alt-text="Subscription and resource group selection window.":::

## Test out your voice assistant

To interact with your voice assistant, say the keyword followed by a command. When the Ear SoM recognizes your keyword, the device emits a chime (which you can hear if a speaker or headphones are connected), and the LEDs will blink blue. The LEDs will switch to racing blue while your command is processed. The voice assistant's response to your command will be printed in text in the demo window and emitted audibly through your speaker/headphones. The default keyword (listed next to **Custom Keyword**) is set to "Computer," and each template has a set of compatible commands that allow you to interact with virtual objects in the demo window. For example, if you are using the hospitality or healthcare demo, say "Computer, turn on TV" to turn on the virtual TV.

:::image type="content" source="./media/tutorial-no-code-speech/hospitality-demo.png" alt-text="Hospitality demo window.":::

### Hospitality and healthcare demo commands

Both the healthcare and hospitality demos have virtual TVs, lights, blinds, and thermostats you can interact with. The following commands (and additional variations) are supported:

* "Turn on/off the lights."
* "Turn on/off the TV."
* "Turn on/off the AC."
* "Open/close the blinds."
* "Set temperature to X degrees." (X is the desired temperature, e.g. 75.)

:::image type="content" source="./media/tutorial-no-code-speech/healthcare-demo.png" alt-text="Healthcare demo window.":::

### Automotive demo commands

The automotive demo has a virtual seat warmer, defroster, and thermostat you can interact with. The following commands (and additional variations) are supported:

* "Turn on/off the defroster."
* "Turn on/off the seat warmer."
* "Set temperature to X degrees." (X is the desired temperature, e.g. 75.)
* "Increase/decrease the temperature by Y degrees."

:::image type="content" source="./media/tutorial-no-code-speech/auto-demo.png" alt-text="Automotive demo window.":::

### Inventory demo commands

The inventory demo has a selection of virtual blue, yellow, and green boxes to interact with along with a virtual inventory app. The following commands (and additional variations) are supported:

* "Add/remove X boxes." (X is the number of boxes, e.g. 4.)
* "Order/ship X boxes."
* "How many boxes are in stock?"
* "Count Y boxes." (Y is the color of the boxes, e.g. yellow.)
* "Ship everything in stock."

:::image type="content" source="./media/tutorial-no-code-speech/inventory-demo.png" alt-text="Inventory demo window.":::

## Configure your keyword

To change your keyword, click **change** next to **Custom Keyword** in the demo window. Select one of the available keywords and click **Save**. You will be able to choose from a selection of prebuilt keywords and any custom keywords you have created.

:::image type="content" source="./media/tutorial-no-code-speech/change-keyword.png" alt-text="Selection of available keywords.":::

### Create a custom keyword

To create a custom keyword, click **+ Create Custom Keyword** near the top of the demo window. Enter your desired keyword, which can be a single word or a short phrase, select your **Speech resource** (this is listed next to **Custom Command** in the demo window and contains your application prefix), and click **Save**. Training for your custom keyword may complete in just a few seconds.

:::image type="content" source="./media/tutorial-no-code-speech/custom-keyword.png" alt-text="Custom keyword creation window.":::

## Create a custom command

The portal also provides functionality for creating custom commands with existing speech resources. "Custom command" refers to the voice assistant application itself, not a specific command within the existing application. By creating a custom command, you are creating a new speech project, which you must further develop in [Speech Studio](https://speech.microsoft.com/).

To create a new custom command from within the demo window, click **+ Create Custom Command** at the top of the page and do the following:

1. Enter a name for your custom command.

1. Enter a description of your project (optional).

1. Select your preferred language.

1. Select your speech resource.

1. Select your LUIS resource.

1. Select your LUIS authoring resource or create a new one.

1. Click **Create**.

:::image type="content" source="./media/tutorial-no-code-speech/custom-commands.png" alt-text="Custom commands creation window.":::

Once you create a custom command, you must go to [Speech Studio](https://speech.microsoft.com/) for further development. If you open Speech Studio and do not see your custom command listed, follow these steps:

1. On the left-hand menu panel in Azure Percept Studio, click on **Speech** under **AI Projects**.

1. Select the **Commands** tab.

    :::image type="content" source="./media/tutorial-no-code-speech/ai-projects.png" alt-text="List of custom commands available to edit.":::

1. Select the custom command you wish to develop. This opens the project in Speech Studio.

    :::image type="content" source="./media/tutorial-no-code-speech/speech-studio.png" alt-text="Speech studio home screen.":::

For more information on developing custom commands, please see the [Speech Service documentation](https://docs.microsoft.com/azure/cognitive-services/speech-service/custom-commands).

## Troubleshooting

### Voice assistant was created but does not respond to commands

Check the LED lights on the Audio SoM:

* Three solid blue lights indicate that the voice assistant is ready and waiting for the keyword.
* If the center LED (L02) is white, the devkit completed initialization and needs to be configured with a keyword.
* Any combination of green lights indicates that the Audio SoM has not completed initialization yet. Initialization may take a few minutes to complete.

For more information about the Audio SoM LED indicators, please see the LED article.

### Voice assistant does not respond to a custom keyword created in Speech Studio

This may occur if the speech module is out of date. Follow these steps to update the speech module to the latest version:

1. Click on **Devices** in the left-hand menu panel of the Azure Percept Studio homepage.

1. Find and select your device.

    :::image type="content" source="./media/tutorial-no-code-speech/devices.png" alt-text="Device list in Azure Percept Studio.":::

1. In the device window, select the **Speech** tab.

1. Check the speech module version. If an update is available, you will see an **Update** button next to the version number.

    :::image type="content" source="./media/tutorial-no-code-speech/devkit.png" alt-text="Devkit speech settings window.":::

1. Click **Update** to deploy the speech module update. The update process generally takes 2-3 minutes to complete.

## Clean up resources

Once you are done working with your voice assistant application, follow these steps to clean up the speech resources you deployed during this tutorial:

1. From the [Azure portal](https://ms.portal.azure.com/#home), select **Resource groups** from the left menu panel or type it into the search bar.

    :::image type="content" source="./media/tutorial-no-code-speech/azure-portal.png" alt-text="Azure portal homepage showing left menu panel and Resource Groups.":::

1. Select your resource group.

1. Select all six resources that contain your application prefix and click the **Delete** icon on the top menu panel.

    :::image type="content" source="./media/tutorial-no-code-speech/select-resources.png" alt-text="Speech resources selected for deletion.":::

1. To confirm deletion, type **yes** in the confirmation box, verify you have selected the correct resources, and click **Delete**.

    :::image type="content" source="./media/tutorial-no-code-speech/delete-confirmation.png" alt-text="Delete confirmation window.":::

> [!WARNING]
> This will remove any custom keywords created with the speech resources you are deleting, and the voice assistant demo will no longer function.

## Next Steps

Now that you have created a no-code speech solution, try creating a [no-code vision solution](./tutorial-nocode-vision.md) for your Azure Percept DK.
