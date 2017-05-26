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

2. **Improve my Set** is a core feature of Custom Vision Service. As you use your https Prediction endpoint, it stores the images for you. These images are ranked, so that the images that can bring the most gains to the classifier are at the top. Hover over an image to see their predicted tags, based on the model’s prediction. Tag any of the mis-predicted images, and remember to train after you are done tagging. 

   **Note:** The default view shows you images from the current iteration. You can drop down to find images submitted during previous iterations. 

   **Improve my Set** is one of the best ways to improve your classifier. It is important to have your data labeled to have similar properties to the data your classifier will encounter in the real world. Over time, consistent use of the **Improve My Set** feature will help you improve your classifier.

3. Sometimes you can get a sense of how to improve your classifier by inspection. On the **My Image Set** tab, you can see all your tagged images. On the left-rail (if you have selected a trained iteration), there are filters that allow you to see which images were predicted correctly, and which were predicted incorrectly. Sometimes, by visual inspection, you can identify patterns that suggest what additional data you might want to label. For example, when building a “roses” vs “daises” classifier, if you notice all your white roses are labeled as daisies, your classifier may need more white roses in its training images. If artificially colored daises are labeled as roses, consider adding more of these daisies. 

4. Your classifier will learn characteristics that your photos have in common, not necessarily the characteristics you are thinking of. For example, if all your tulips where photographed outdoors in a field, and all the roses were photographed in front of a blue wall in a red vase, you have likely trained a field vs wall+vase classifier, not roses vs tulips. 

5. Custom Vision Service supports automatic negative image handling. If you are building a “cat” vs “dog” classifier, you can submit an image of a shoe. Custom Vision Service will likely score that image as 0% for “cat” and 0% for “dog”. 

   **Note:** The automatic approach works for clearly negative images. It may not work well in cases where the negative images are just a variation of the images used in training. For example, if you have a “huski” vs “corgi” classifier, and you feed in an image of a Pomeranian, IRIS may score the Pomeranian as a Huski. If your negative images are of this nature, we recommend you create a new tag, such as “Other”, and apply it to your training images that are negative.
