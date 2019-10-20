---
author: erhopf
ms.service: cognitive-services
ms.topic: include
ms.date: 08/06/2019
ms.author: erhopf
---

## Prerequisites

Before you get started, make sure to:
1. [Create an Azure Speech Resource](../../../create-speech-resource.md)
1. [Setup your development environment](../../../../quickstarts/setup-platform.md?tabs=jre)
1. [Created an empty sample project](../../../../quickstarts/create-project.md?tabs=jre)

## Add sample code

1. To add a new empty class to your Java project, select **File** > **New** > **Class**.

1. In the **New Java Class** window, enter **speechsdk.quickstart** into the **Package** field, and **Main** into the **Name** field.

   ![Screenshot of New Java Class window](~/articles/cognitive-services/Speech-Service/media/sdk/qs-java-jre-06-create-main-java.png)

1. Replace all code in `Main.java` with the following snippet:

````Java

// INSERT JAVA CODE HERE... Copy from "from-microphone", and paste directly here, adding AudioConfig/file name portion

````

1. Replace the string `YourSubscriptionKey` with your subscription key.

1. Replace the string `YourServiceRegion` with the [region](~/articles/cognitive-services/Speech-Service/regions.md) associated with your subscription (for example, `westus` for the free trial subscription).

1. Save changes to the project.

## Build and run the app

Press F11, or select **Run** > **Debug**.
The next 15 seconds of speech input from your microphone will be recognized and logged in the console window.

```text

TODO: CONSOLE OUTPUT FOR JAVA QUICKSTART

```
