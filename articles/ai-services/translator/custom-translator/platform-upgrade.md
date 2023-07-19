---
title: "Platform upgrade - Custom Translator"
titleSuffix: Azure AI services
description: Custom Translator v1.0 upgrade
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.date: 07/18/2023
ms.author: lajanuar
ms.topic: reference
---
# Custom Translator platform upgrade

> [!CAUTION]
>
> On June 02, 2023, Microsoft will retire the Custom Translator v1.0 model platform. Existing v1.0 models must migrate to the new platform for continued processing and support.

Following measured and consistent high-quality results using models trained on the Custom Translator new platform, the v1.0 platform is retiring. The new Custom Translator platform delivers significant improvements in many domains compared to both standard and Custom v1.0 platform translations. Migrate your v1.0 models to the new platform by June 02, 2023.

## Custom Translator v1.0 upgrade timeline

* **May 01, 2023** → Custom Translator v1.0 model publishing ends. There's no downtime during the v1.0 model migration. All model publishing and in-flight translation requests will continue without disruption until June 02, 2023.

* **May 01, 2023 through June 02, 2023** → Customers voluntarily migrate to new platform models.

* **June 08, 2023** → Remaining v1.0 published models migrate automatically and are published by the Custom Translator team.

## Upgrade to new platform

> [!IMPORTANT]
>
> * Starting **May 01, 2023** the upgrade wizard and workspace banner will be displayed in the Custom Translator portal indicating that you have v1.0 models to upgrade.
> * The banner contains a **Select** button that takes you to the upgrade wizard where a list of all your v1.0 models available for upgrade are displayed.
> * Select any or all of your v1.0 models then select **Train** to start new platform model training.

* **Check to see if you have published v1.0 models**. After signing in to the Custom Translator portal, you'll see a message indicating that you have v1.0 models to upgrade. You can also check to see if a current workspace has v1.0 models by selecting **Workspace settings** and scrolling to the bottom of the page.

* **Use the upgrade wizard**. Follow the steps listed in **Upgrade to the latest version** wizard. Depending on your training data size, it may take from a few hours to a full day to upgrade your models to the new platform.

## Unpublished and opt-out published models

* For unpublished models, save the model data (training, testing, dictionary) and delete the project.

* For published models that you don't want to upgrade, save your model data (training, testing, dictionary), unpublish the model, and delete the project.

## Next steps

For more support, visit [Azure AI services support and help options](../../cognitive-services-support-options.md).
