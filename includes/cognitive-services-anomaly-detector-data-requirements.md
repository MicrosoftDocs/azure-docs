---
author: aahill
ms.author: aahi
ms.service: cognitive-services
ms.topic: include
ms.date: 03/20/2019
---

> [!NOTE]
> For [best results](../articles/cognitive-services/anomaly-detector/concepts/anomaly-detection-best-practices.md) when using the Anomaly Detector API, your JSON-formatted time series data should include:
> * data points separated by the same interval, with no more than 10% of the expected number of points missing.
> * at least 12 data points if your data doesn't have a clear seasonal pattern.
> * at least 4 pattern occurrences if your data does have a clear seasonal pattern. 
