---
 author: PatrickFarley
 ms.service: cognitive-services
 ms.subservice: custom-vision
 ms.topic: include
 ms.date: 07/17/2019
 ms.author: pafarley
---

Note the **Probability Threshold** slider on the left pane of the **Performance** tab. This is the threshold for a predicted probability to be considered correct when computing precision and recall.

Interpreting prediction calls with a high probability threshold tends to return results with high precision at the expense of recall (the found classifications are correct, but many were not found); a low probability threshold does the opposite (most of the actual classifications were found, but there are false positives within that set). With this in mind, you should set the probability threshold according to the specific needs of your project. Later, on the client side, you should use the same probability threshold value as a filter when receiving prediction results from the model.