---
title: Test Your Model | Microsoft Docs
description: Procedures for performing a quick test with a single image and for adding that image to the model and retraining the model with it.
services: cognitive-services
author: v-moib
manager: juliakuz

ms.service: cognitive-services
ms.technology: cognitive-services
ms.topic: article
ms.date: 04/27/2017
ms.author: v-moib
---

# Test Your Model

## Perform a quick test

After you train your model, you can quickly test it using a locally stored image or an online image. The test uses the most recently trained iteration.

**To test your model:**

1. Click **Quick Test** on the right of the top menu bar. This action opens a window labeled **Quick Test**.

![The Quick Test button is shown in the upper right corner of the window.](./media/test-your-model/quick-test-button.png)

2. In the **Quick Test** window, click in the **Submit Image** field and enter the URL of the image you want to use for your test. If you want to use a locally stored image instead, click on the **Browse local files** button and select a local image file.

![The Quick Test window is shown. It has a URL field and a button for selecting local files.](./media/test-your-model/submit-image.png)

The image you select appears in the middle of the page. Processing may take a few seconds. Then the results appear below the image in the form of a table with two columns, labeled **Tags** and **Probability**. After you view the results, you may close the **Quick Test** window.

![The Quick Test window is shown with the image used for testing appearing in the middle of the window. The results of the test appear in the form of a table below the image.](./media/test-your-model/quick-test-results.png)


## Add the test image to your model and retrain the model

You can now add this test image to your model and then retrain your model.

**To add the test image to your model:**

1. Click the **IMPROVE MY SET** tab on the top menu bar.
2. Click the image you used for the quick test. A new window appears, with the image in the center.
3. In the new window, assign the correct tag to the image from the **My Tags** drop-down list. If you don't see the appropriate tag in the drop-down list, you can type in a new tag then click the **+** sign to the right of the **My Tags** field.
4. Click the **Save and close** button at the bottom of the window.
4. Click the green **Train** button in the top menu bar.
