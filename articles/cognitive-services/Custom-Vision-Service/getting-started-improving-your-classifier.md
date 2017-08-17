---
title: Getting started improve your classifier using Custom Vision Service machine learning | Microsoft Docs
description: Improve your classifier.
services: cognitive-services
author: v-royhar
manager: juliakuz

ms.service: cognitive-services
ms.technology: custom vision service
ms.topic: article
ms.date: 05/08/2017
ms.author: v-royhar
---

# Getting Started: Improving your classifier

The quality of your classifier is foremost dependent on the quality of the labeled data you provide to it. 

1. The best way to have a quality classifier is to add more varied tagged images (different backgrounds, angles, object size, groups of photos, and variants of types.) Remember to train your classifier after you have added more images. Include images that are representative of what your classifier will encounter in the real world. Photos in context are better than photos of objects in front of neutral backgrounds, for example.

2. A core feature of Custom Vision Service is that images sent to your prediction endpoint are stored for you in the **Predictions** tab, so you can label them and use them to improve your classifier. Select an iteration from the left rail to see the images from that iteration. These images are ranked, so that the images that can bring the most gains to the classifier are at the top. Hover over an image to see predicted tags from your classifier. To tag an image, select one or more images and click "tag images". The images you have tagged will be moved to your **Training Images** tab. Remember to train after you are done tagging. 

   **Note:** The default view shows you images from the current iteration. You can drop down to find images submitted during previous iterations. 

   Tagging images from the **Predictions** tab is one of the best ways to improve your classifier. It is important to have your labeled training data to have similar properties to the data your classifier will encounter in the real world. Over time, consistent image tagging can help you improve your classifier.

3. Sometimes you can get a sense of how to improve your classifier by inspection. On the **Training Images** tab, you can see all your tagged images. On the left-rail if you select "Iteration History" and select an iteration, you can see a visual representation of which images were predicted correctly, and which were predicted incorrectly. Incorrect images (at your given Probability Threshold) and outlined with a red box to highlight them. Sometimes, by visual inspection, you can identify patterns that suggest what additional data you might want to label. For example, when building a “roses” vs “daises” classifier, if you notice all your white roses are labeled as daisies, your classifier may need more white roses in its training images. If artificially colored daises are labeled as roses, consider adding more of these daisies. 

4. Your classifier will learn characteristics that your photos have in common, not necessarily the characteristics you are thinking of. For example, if all your tulips were photographed outdoors in a field, and all the roses were photographed in front of a blue wall in a red vase, you have likely trained a field vs wall+vase classifier, not roses vs tulips. 

5. Custom Vision Service supports some automatic negative image handling. If you are building a “cat” vs “dog” classifier, and you submit an image of a shoe for prediction, Custom Vision Service should score that image as close to 0% for “cat” and 0% for “dog”. 

   **Note:** The automatic approach works for clearly negative images. It may not work well in cases where the negative images are just a variation of the images used in training. For example, if you have a “husky” vs “corgi” classifier, and you feed in an image of a Pomeranian, IRIS may score the Pomeranian as a Husky. If your negative images are of this nature, we recommend you create a new tag, such as “Other”, and apply it to your training images that are negative.
