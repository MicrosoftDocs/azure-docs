---
title: "Platform upgrade - Custom Translator"
titleSuffix: Azure Cognitive Services
description: Custom Translator upgrade.
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.date: 03/21/2023
ms.author: lajanuar
ms.topic: reference
---
# Custom Translator v1.0 platform upgrade

> [!CAUTION]
>
> On April 10, 2023, Microsoft will retire the Custom Translator v1.0 model platform. Existing customers should migrate to v2.0 models by May 07, 2023.

Following measured and consistent high-quality advances with models trained on the Custom Translator v2.0 platform, the decision has been made to deprecate the v1.0 platform. Custom Translator v2.0 delivers significant improvements in many domains compared to standard translations and the v1.0 platform and we recommend that you migrate to the v2.0 platform by April 10, 2023.

## Custom Translator v1.0 timeline

* **April 10, 2023**: v1.0 model publishing ends. There will be no downtime during the v1.0 model migration. All model publishing and in-flight translation requests will continue without disruption until May 07, 2023.

* **April 10, 2023 — May 07, 2023**: Customers voluntarily migrate to v2.0 models.

* **May 08, 2023**: Remaining v1.0 published models will automatically migrated and published by the Custom Translator Team.

## Upgrade to v2.0

* **Check to see if you have published v1.0 models**. After you sign-in to the Custom Translator portal you should see a message indicating you have v1.0 models to upgrade. You can also see if a current workspace has v1.0 models by selecting **Workspace settings** and scrolling to the bottom of the page.

* **Use the upgrade wizard**. Follow the steps listed in **Upgrade to the latest versio** wizard. Depending on your training data size, it may take a few hours to a full day to upgrade your models to the v2.0 platform.

## Unpublished and opt-out published models

* For unpublished models, save the model data (training, testing, dictionary) and delete the project.
* Form published models that you don't want to upgrade, save your model data, unpublish the model, and delete the project.

## Next steps

For additional support, visit the [Azure Cognitive Services support and help options](https://learn.microsoft.com/en-us/azure/cognitive-services/cognitive-services-support-options) page.