---
title: Use Translator V3 connector to configure a Text Translation flow
titleSuffix: Azure AI services
description: Use Microsoft Translator V3 connector and Power Automate to configure a Text Translation flow.
author: laujan
manager: nitinme
ms.service: azure-ai-translator
ms.custom: build-2023
ms.topic: how-to
ms.date: 07/18/2023
ms.author: lajanuar
---

<!-- markdownlint-disable MD051 -->
<!-- markdownlint-disable MD024 -->
<!-- markdownlint-disable MD029 -->
<!-- markdownlint-disable MD036 -->
<!-- markdownlint-disable MD001 -->

# Create a text translation flow (preview)

> [!IMPORTANT]
>
> * The Translator connector is currently available in public preview. Features, approaches and processes may change, prior to General Availability (GA), based on user feedback.

This article guides you through configuring a Microsoft Translator V3 connector cloud flow that supports text translation and transliteration. The Translator V3 connector creates a connection between your Translator Service instance and Microsoft Power Automate enabling you to use one or more prebuilt operations as steps in your apps and workflows.

Text translation is a cloud-based REST API feature of the Azure AI Translator service. The Text Translation API enables quick and accurate source-to-target text translations in real time.

## Prerequisites

To get started, you need  an active Azure subscription. If you don't have an Azure subscription, you can [create one for free](https://azure.microsoft.com/free/cognitive-services/).

* Once you have your Azure subscription, create a [**single-service Translator resource**](https://portal.azure.com/#create/Microsoft.CognitiveServicesTextTranslation) (**not** a multi-service Azure AI services resource):

* You need the key and name from your resource to connect your application to Power Automate. Your Translator resource keys are found under the Resource Management section in the Azure portal and your resource name is located at the top of the page. Copy and paste your key and resource name in a convenient location, such as *Microsoft Notepad*.

   :::image type="content" source="../media/connectors/keys-resource-details.png" alt-text= "Screenshot showing key and endpoint location in the Azure portal.":::

## Configure the Translator V3 connector

Now that you've completed the prerequisites, let's get started.

1. Sign in to [Power Automate](https://powerautomate.microsoft.com/).

1. Select **Create** from the left sidebar menu.

1. Select **Instant cloud flow** from the main content area.

   :::image type="content" source="../media/connectors/create-flow.png" alt-text="Screenshot showing how to create an instant cloud flow.":::

1. In the popup window, **name your flow**, choose **Manually trigger a flow** then, select **Create**.

   :::image type="content" source="../media/connectors/select-manual-flow.png" alt-text="Screenshot showing how to manually trigger a flow.":::

1. The first step for your instant flow—**Manually trigger a flow**—appears on screen. Select **New step**.

   :::image type="content" source="../media/connectors/add-new-step.png" alt-text="Screenshot of add new flow step page.":::

1. A **choose an operation** pop-up window appears. Enter Translator V3 in the **Search connectors and actions** search bar then select the **Microsoft Translator V3** icon.

   :::image type="content" source="../media/connectors/choose-operation.png" alt-text="Screenshot showing the selection of Translator V3 as the next flow step.":::

## Structure your cloud flow

Let's select an action. Choose to translate or transliterate text.

#### [Translate text](#tab/translate)

### Translate

1. Select the **Translate text** action.
1. If you're using the Translator V3 connector for the first time, you need to enter your resource credentials:

   * **Connection name**. Enter a name for your connection.
   * **Subscription Key**. Enter one of your keys that you copied from the Azure portal.
   * **Translator resource name**. Enter the name of your Translator resource found at the top of your resource page in the Azure portal. Select **Create**.

      :::image type="content" source="../media/connectors/add-connection.png" alt-text="Screenshot showing the add connection window.":::

      > [!NOTE]
      > After you've setup your connection, you won't be required to reenter your credentials for subsequent Translator flows.

1. The **Translate text** action window appears next.
1. Select a **Source Language** from the dropdown menu or keep the default **Auto-detect** option.
1. Select a **Target Language** from the dropdown window.
1. Enter the **Body Text**.
1. Select **Save**.

   :::image type="content" source="../media/connectors/translate-text-step.png" alt-text="Screenshot showing the translate text step.":::

#### [Transliterate text](#tab/transliterate)

### Transliterate

1. Select the **Transliterate** action.
1. If you're using the Translator V3 connector for the first time, you need to enter your resource credentials:

   * **Connection name**. Enter a name for your connection.
   * **Subscription Key**. Enter one of your keys that you copied from the Azure portal.
   * **Translator resource name**. Enter the name of your Translator resource found at the top of your resource page in the Azure portal. Select **Create**.

      :::image type="content" source="../media/connectors/add-connection.png" alt-text="Screenshot showing the add connection window.":::

1. Next, the **Transliterate** action window appears.
1. **Language**. Select the language of the text that is to be converted.
1. **Source script**. Select the name of the input text script.
1. **Target script**. Select the name of transliterated text script.
1. Select **Save**.

   :::image type="content" source="../media/connectors/transliterate-text-step.png" alt-text="Screenshot showing the transliterate text step.":::

---

## Test your connector flow

Let's test the cloud flow and view the translated text.

1. There's a green bar at the top of the page indicating that **Your flow is ready to go.**.
1. Select **Test** from the upper-right corner of the page.

   :::image type="content" source="../media/connectors/test-flow.png" alt-text="Screenshot showing the test icon/button.":::

1. Select **Test Flow** → **Manually** → **Test** from the right-side window.
1. In the next window, select the  **Run flow** button. 
1. Finally, select  the **Done** button.
1. You should receive a "Your flow ran successfully" message and green check marks align with each successful step.

   :::image type="content" source="../media/connectors/successful-text-translation-flow.png" alt-text="Screenshot of successful flow.":::

#### [Translate text](#tab/translate)

Select the **Translate text** step to view the translated text (output):

   :::image type="content" source="../media/connectors/translated-text-output.png" alt-text="Screenshot of translated text output.":::

#### [Transliterate text](#tab/transliterate)

Select the **Transliterate** step to view the translated text (output):

   :::image type="content" source="../media/connectors/transliterated-text-output.png" alt-text="Screenshot of transliterated text output.":::

---

> [!TIP]
>
> * Check on the status of your flow by selecting **My flows** tab on the navigation sidebar.
> * Edit or update your connection by selecting **Connections** under the **Data** tab on the navigation sidebar.

That's it! You now know how to automate text translation processes using the Microsoft Translator V3 connector and Power Automate.

## Next steps

> [!div class="nextstepaction"]
> [Configure a Translator V3 connector document translation flow](document-translation-flow.md)
