---
author: trevorbye
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: include
ms.date: 01/27/2020
ms.author: trbye
---

To complete the intent recognition quickstart, you'll need to create a LUIS account and a project using the LUIS preview portal. This quickstart only requires a LUIS subscription. A Speech service subscription *isn't* required.

The first thing you'll need to do is create a LUIS account and app using the LUIS preview portal. The LUIS app that you create will use a prebuilt domain for home automation, which provides  intents, entities, and example utterances. When you're finished, you'll have a LUIS endpoint running in the cloud that you can call using the Speech SDK. 

Follow these instructions to create your LUIS app:

* <a href="https://docs.microsoft.com/azure/cognitive-services/luis/luis-get-started-create-app" target="_blank">Quickstart: Build prebuilt domain app <span class="docon docon-navigate-external x-hidden-focus"></span></a>

When you're done, you'll need four things:

* Re-publish with **Speech priming** toggled on
* Your LUIS **Primary key**
* Your LUIS **Location**
* Your LUIS **App ID**

Here's where you can find this information in the [LUIS preview portal](https://preview.luis.ai/):

1. From the LUIS preview portal, select your app then select the **Publish** button.

2. Select the **Production** slot, if you're using `en-US` toggle the **Speech priming** option to the **On** position. Then select the **Publish** button.

    > [!IMPORTANT]
    > **Speech priming** is highly recommended as it will improve speech recognition accuracy.

    > [!div class="mx-imgBorder"]
    > ![Publish LUIS to endpoint](../../../media/luis/publish-app-popup.png)

3. From the LUIS preview portal, select **Manage**, then select **Azure Resources**. On this page, you'll find your LUIS key and location (sometimes referred to as _region_).

   > [!div class="mx-imgBorder"]
   > ![LUIS key and location](../../../media/luis/luis-key-region.png)

4. After you've got your key and location, you'll need the app ID. Select **Application Settings** -- your app ID is available on this page.

   > [!div class="mx-imgBorder"]
   > ![LUIS app ID](../../../media/luis/luis-app-id.png)
