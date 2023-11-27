---
title: Triage incoming emails with Power Automate
titleSuffix: Azure AI services
description: Learn how to use custom text classification to categorize and triage incoming emails with Power Automate
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: tutorial
ms.date: 01/27/2023
ms.author: aahi
---

# Tutorial: Triage incoming emails with power automate

In this tutorial you will categorize and triage incoming email using custom text classification. Using this [Power Automate](/power-automate/getting-started) flow, when a new email is received, its contents will have a classification applied, and depending on the result, a message will be sent to a designated channel on [Microsoft Teams](https://www.microsoft.com/microsoft-teams).


## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics"  title="Create a Language resource"  target="_blank">A Language resource </a>
    * A trained [custom text classification](../overview.md) model.
    * You will need the key and endpoint from your Language resource to authenticate your Power Automate flow.
* A successfully created and deployed [single text classification custom model](../quickstart.md)


## Create a Power Automate flow

1. [Sign in to power automate](https://make.powerautomate.com/)

2. From the left side menu, select **My flows** and create a **Automated cloud flow**

    :::image type="content" source="../media/create-flow.png" alt-text="A screenshot of the flow creation screen." lightbox="../media/create-flow.png":::

3. Name your flow `EmailTriage`. Below **Choose your flow's triggers**, search for *email* and select **When a new email arrives**. Then select **create**

    :::image type="content" source="../media/email-flow.png" alt-text="A screenshot of the email flow triggers." lightbox="../media/email-flow.png":::

4. Add the right connection to your email account. This connection will be used to access the email content.

5. To add a Language service connector, search for *Azure AI Language*.
  
    :::image type="content" source="../media/language-connector.png" alt-text="A screenshot of available Azure AI Language service connectors." lightbox="../media/language-connector.png":::

6. Search for *CustomSingleLabelClassification*.

    :::image type="content" source="../media/single-classification.png" alt-text="A screenshot of Classification connector." lightbox="../media/single-classification.png":::

7. Start by adding the right connection to your connector. This connection will be used to access the classification project.

8. In the documents ID field, add **1**.

9. In the documents text field, add **body** from **dynamic content**.

10. Fill in the project name and deployment name of your deployed custom text classification model.

    :::image type="content" source="../media/classification.png" alt-text="A screenshot project details." lightbox="../media/classification.png":::

11. Add a condition to send a Microsoft Teams message to the right team by:
    1. Select **results** from **dynamic content**, and add the condition. For this tutorial, we are looking for `Computer_science` related emails. In the **Yes** condition, choose your desired option to notify a team channel. In the **No** condition, you can add additional conditions to perform alternative actions.

    :::image type="content" source="../media/email-triage.png" alt-text="A screenshot of email flow." lightbox="../media/email-triage.png":::


## Next steps

* [Use the Language service with Power Automate](../../tutorials/power-automate.md)
* [Available Language service connectors](/connectors/cognitiveservicestextanalytics)
