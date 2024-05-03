---
title: What is Azure AI Translator container?
titlesuffix: Azure AI services
description: Translate text and documents using the Azure AI Translator container.
author: laujan
manager: nitinme
ms.service: azure-ai-translator
ms.topic: overview
ms.date: 05/02/2024
ms.author: lajanuar
---

# What is Azure AI Translator container?

Azure AI Translator container enables you to build translator application architecture that is optimized for both robust cloud capabilities and edge locality. A container is a running instance of an executable software image. The Translator container image includes all libraries, tools, and dependencies needed to run an application consistently in any private, public, or personal computing environment. Containers are isolated, lightweight, portable, and are great for implementing specific security or data governance requirements. Translator container is available in [connected](#connected-containers) and [disconnected (offline)](#disconnected-containers) modalities.

## Connected containers

**Translator connected container** is deployed on premises and processes content in your environment. It requires internet connectivity to transmit usage metadata for billing; however, your content isn't transmitted outside of your premises. The `EULA`, `Billing`, and `APIKey` options must be specified to run a container.

You're billed for connected containers monthly, based on the usage and consumption. Queries to the container are billed at the pricing tier for the Azure resource used for the `APIKey` parameter. For more information, *see* [Billing configuration](configuration.md#billing-configuration-setting).

  ***Sample billing metadata for Translator connected container***

  Usage charges are calculated based upon the `quantity` value.

   ```json
   {
     "apiType": "texttranslation",
     "id": "ab1cf234-0056-789d-e012-f3ghi4j5klmn",
     "containerType": "123a5bc06d7e",
     "quantity": 125000

   }
   ```

## Disconnected containers

**Translator disconnected container** is deployed on premises and processes content in your environment. It doesn't require internet connectivity at runtime. Customer must license the container for projected usage over a year and is charged affront.

Disconnected containers are offered through commitment tier pricing offered at a discounted rate compared to pay-as-you-go pricing. With commitment tier pricing, you can commit to using Translator Service features for a fixed fee, at a predictable total cost, based on the needs of your workload. Commitment plans for disconnected containers have a calendar year commitment period.

When you purchase a plan, you're charged the full price immediately. During the commitment period, you can't change your commitment plan; however you can purchase more units at a pro-rated price for the remaining days in the year. You have until midnight (UTC) on the last day of your commitment, to end a commitment plan.

  ***Sample billing metadata for Translator disconnected container***

   ```json
      {
    "type": "CommerceUsageResponse",
    "meters": [
      {
        "name": "CognitiveServices.TextTranslation.Container.OneDocumentTranslatedCharacters",
        "quantity": 1250000,
        "billedUnit": 1875000
      },
      {
        "name": "CognitiveServices.TextTranslation.Container.TranslatedCharacters",
        "quantity": 1250000,
        "billedUnit": 1250000
      }
    ],
    "apiType": "texttranslation",
    "serviceName": "texttranslation"
   }
```

The aggregated value of `billedUnit` for the following meters is counted  towards the characters you licensed for your disconnected container usage:

* `CognitiveServices.TextTranslation.Container.OneDocumentTranslatedCharacters`

* `CognitiveServices.TextTranslation.Container.TranslatedCharacters`

## Request container access

**Translator containers are a gated offering. To use the Translator container, you must submit an online request for approval.**

* To request access to a connected container, complete and submit the [**connected container access request form**](https://aka.ms/csgate-translator).

* To request access t a disconnected container, complete and submit the [**disconnected container request form**](https://aka.ms/csdisconnectedcontainers).

* The form requests information about you, your company, and the user scenario for which you use the container. After you submit the form, the Azure AI services team reviews it and emails you with a decision within 10 business days.

  > [!IMPORTANT]
  > ✔️ On the form, you must use an email address associated with an Azure subscription ID.
  >
  > ✔️ The Azure resource you use to run the container must have been created with the approved Azure subscription ID.
  >
  > ✔️ Check your email (both inbox and junk folders) for updates on the status of your application from Microsoft.

* After you're approved, you'll be able to run the container after you download it from the Microsoft Container Registry (MCR).

* You can't access the container if your Azure subscription is't approved.

## Next steps

[Install and run Azure AI translator containers](install-run.md).