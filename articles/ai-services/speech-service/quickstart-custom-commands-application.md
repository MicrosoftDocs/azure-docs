---
title: 'Quickstart: Create a voice assistant using Custom Commands - Speech service'
titleSuffix: Azure AI services
description: In this quickstart, you create and test a basic Custom Commands application in Speech Studio. 
#services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: azure-ai-speech
ms.topic: quickstart
ms.date: 02/19/2022
ms.author: eur
ms.custom: cogserv-non-critical-speech, references_regions
---

# Quickstart: Create a voice assistant with Custom Commands

[!INCLUDE [deprecation notice](./includes/custom-commands-retire.md)]

In this quickstart, you create and test a basic Custom Commands application using Speech Studio. You will also be able to access this application from a Windows client app.

## Region Availability
At this time, Custom Commands supports speech resources created in regions that have [voice assistant capabilities](./regions.md#voice-assistants).

## Prerequisites

> [!div class="checklist"]
> * <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesSpeechServices" target="_blank">Create a Speech resource in a region that supports Custom Commands.</a> Refer to the **Region Availability** section above for list of supported regions.
> * Download the sample
[Smart Room Lite](https://aka.ms/speech/cc-quickstart) json file.
> * Download the latest version of [Windows Voice Assistant Client](https://aka.ms/speech/va-samples-wvac).

## Go to the Speech Studio for Custom Commands

1. In a web browser, go to [Speech Studio](https://aka.ms/speechstudio/customcommands).
1. Enter your credentials to sign in to the portal.

   The default view is your list of Speech resources.
   > [!NOTE]
   > If you don't see the select resource page, you can navigate there by choosing "Resource" from the settings menu on the top bar.

1. Select your Speech resource, and then select **Go to Studio**.
1. Select **Custom Commands**.

   The default view is a list of the Custom Commands applications you have under your selected resource.

## Import an existing application as a new Custom Commands project

1. Select **New project** to create a project.

1. In the **Name** box, enter project name as `Smart-Room-Lite` (or something else of your choice).
1. In the **Language** list, select **English (United States)**.
1. Select **Browse files** and in the browse window, select the **SmartRoomLite.json** file.

    > [!div class="mx-imgBorder"]
    > ![Create a project](media/custom-commands/import-project.png)

1.  In the **LUIS authoring resource** list, select an authoring resource. If there are no valid authoring resources,    create one by selecting  **Create new LUIS authoring resource**.
    
    1. In the **Resource Name** box, enter the name of the resource.
    1. In the **Resource Group** list, select a resource group.
    1. In the **Location** list, select a location.
    1. In the **Pricing Tier** list, select a tier.
    
    
    > [!NOTE]
    > You can create resource groups by entering the desired resource group name into the "Resource Group" field. The resource group will be created when **Create** is selected.


1. Next, select **Create** to create your project.
1. After the project is created, select your project.
You should now see overview of your new Custom Commands application.

## Try out some voice commands
1. Select **Train** at the top of the right pane.
1. Once training is completed, select **Test** and try out the following utterances:
    - Turn on the tv
    - Set the temperature to 80 degrees
    - Turn it off
    - The tv
    - Set an alarm for 5 PM

## Integrate Custom Commands application in an assistant
Before you can access this application from outside Speech Studio, you need to publish the application. For publishing an application, you will need to configure prediction LUIS resource.  

### Update prediction LUIS resource


1. Select **Settings** in the left pane and select  **LUIS resources** in the middle pane.
1. Select a prediction resource, or create one by selecting **Create new resource**.
1. Select **Save**.
    
    > [!div class="mx-imgBorder"]
    > ![Set LUIS Resources](media/custom-commands/set-luis-resources.png)

> [!NOTE]
> Because the authoring resource supports only 1,000 prediction endpoint requests per month, you will mandatorily need to set a LUIS prediction resource before publishing your Custom Commands application.

### Publish the application

Select  **Publish** on top of the right pane. Once publish completes, a new window will appear. Note down the **Application ID** and **Speech resource key** value from it. You will need these two values to be able to access the application from outside Speech Studio.

Alternatively, you can also get these values by selecting **Settings** > **General** section.

### Access application from client

In the scope of this article, we will be using the Windows Voice Assistant client you downloaded as part of the pre-requisites. Unzip the folder.
1. Launch **VoiceAssistantClient.exe**.
1. Create a new publish profile and enter value for **Connection Profile**. In the **General Settings** section, enter values **Subscription Key** (this is same as the **Speech resource key** value you saved when publishing the application), **Subscription key region** and **Custom commands app ID**.
    > [!div class="mx-imgBorder"]
    > ![Screenshot that highlights the General Settings section for creating a WVAC profile.](media/custom-commands/create-profile.png)
1. Select **Save and Apply Profile**.
1. Now try out the following inputs via speech/text
    > [!div class="mx-imgBorder"]
    > ![WVAC Create profile](media/custom-commands/conversation.png)


> [!TIP]
> You can select entries in **Activity Log** to inspect the raw responses being sent from the Custom Commands service.

## Next steps

In this article, you used an existing application. Next, in the [how-to sections](./how-to-develop-custom-commands-application.md), you learn how to design, develop, debug, test and integrate a Custom Commands application from scratch.
