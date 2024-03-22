---
 author: PatrickFarley
 ms.service: azure-ai-custom-vision
 ms.topic: include
 ms.date: 07/17/2019
 ms.author: pafarley
---

Note the **Probability Threshold** slider on the left pane of the **Performance** tab. This is the level of confidence that a prediction needs to have in order to be considered correct (for the purposes of calculating precision and recall). 

When you interpret prediction calls with a high probability threshold, they tend to return results with high precision at the expense of recall&mdash;the detected classifications are correct, but many remain undetected. A low probability threshold does the opposite&mdash;most of the actual classifications are detected, but there are more false positives within that set. With this in mind, you should set the probability threshold according to the specific needs of your project. Later, when you're receiving prediction results on the client side, you should use the same probability threshold value as you used here.
