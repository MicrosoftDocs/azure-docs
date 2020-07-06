---
title: Import app steps
services: cognitive-services
author: diberry
manager: nitinme
ms.service: cognitive-services
ms.topic: include
ms.date: 06/22/2020
ms.author: diberry
---

1. In the [LUIS portal](https://www.luis.ai), on the **My apps** page, select **+ New app for conversation**, then **Import as JSON**. Find the saved JSON file from the previous step. You don't need to change the name of the app. Select **Done**

1. From the **Manage** section, on the **Versions** tab, select the `sentiment` version, then select **Clone** to clone the version, and give it a new name of `ml-entity`, then select **Done** to finish the clone process. Because the version name is used as part of the URL route, the name can't contain any characters that are not valid in a URL.

    > [!TIP]
    > Cloning into a new version is a best practice before you modify your app. When you finish with a change to a version, export the version (as a .json or .lu file), and check the file into your source control system.

1. Select **Build** then **Intents** to see the intents, the main building blocks of a LUIS app.

    ![Change from the Versions page to the Intents page.](../media/tutorial-machine-learned-entity/new-version-imported-app.png)