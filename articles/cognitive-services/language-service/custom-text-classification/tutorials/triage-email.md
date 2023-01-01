---
title: Traige incoming emails with power automate
titleSuffix: Azure Cognitive Services
description: Traige incoming emails with power automate
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: tutorial
ms.date: 06/03/2022
ms.author: aahi
ms.custom: 
---

# Tutorial: Traige incoming emails with power automate

In this tutorial we will triage incoming email using custom single text classification project type. When a new email is received, the content of the body gets classified and depending on the classificaiton result, a message is sent to the specialized team on Microsoft Teams.


## Prerequisites
* Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics"  title="Create a Language resource"  target="_blank">create a Language resource </a> in the Azure portal to get your key and endpoint. After it deploys, click **Go to resource**.
    * You will need the key and endpoint from the resource you created in your power automate flow.
    * Successfully created and deployed a [single text classification project](../quickstart.md).


## Create a power automate flow

1- [Signin to power automate](https://make.powerautomate.com/)

2- From the left side menu, choose *My flows* and create a *Automated cloud flow*
:::image type="content" source="../media/create-flow.png" alt-text="A screenshot of the flow creation." lightbox="../media/create-flow.png":::

3- Name your flow as *EmailTriage*, from triggers search for *email* and choose *When a new email arrives* option then click *create*
:::image type="content" source="../media/email-flow.png" alt-text="A screenshot of the language flow." lightbox="../media/email-flow.png":::

4- Start by adding the right connection to your email. This connection will be used to access the email content.

5- To add a Language connector, search for *Azure Language* 
:::image type="content" source="../media/language-connector.png" alt-text="A screenshot of azure language connectors." lightbox="../media/language-connector.png":::

6- Search for *CustomSingleLabelClassification*
:::image type="content" source="../media/single-classification.png" alt-text="A screenshot of Classification connector." lightbox="../media/single-classification.png":::

7- Start by adding the right connection to your connector. This connection will be used to access the classification project.

8- In documents id field, add **1**.

9- In documents text field add *body* from dynamic content.

10- Fill in the project name and deployment name of your deployed model

:::image type="content" source="../media/classification.png" alt-text="A screenshot project details." lightbox="../media/classification.png":::

11- Add condition to send a Microsoft Teams message to the righ team. Choose *results* from dynamic content and add the condition. For this tutorial, we are looking for *Computer_science* related emails. In the *Yes* condition, choose your desired option to notify the team. In the *No* condition, you can add further condition to check other cases and do alternative actions.

:::image type="content" source="../media/email-triage.png" alt-text="A screenshot of email flow." lightbox="../media/email-triage.png":::


# Next steps

[Language studio overview](../../language-studio.md)
