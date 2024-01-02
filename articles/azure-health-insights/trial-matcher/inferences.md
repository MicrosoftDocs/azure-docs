---
title: Trial Matcher Inference information
titleSuffix: Azure AI Health Insights
description: This article provides Trial Matcher inference information.
services: azure-health-insights
author: iBoonZ
manager: urieinav
ms.service: azure-health-insights
ms.topic: overview
ms.date: 02/02/2023
ms.author: behoorne
---


# Trial Matcher inference information

The result of the Trial Matcher model includes a list of inferences made regarding the patient. For each trial that was queried for the patient, the model returns an indication of whether the patient appears eligible or ineligible for the trial. If the model concluded the patient is ineligible for a trial, it also provides a piece of evidence to support its conclusion (unless the ```evidence``` flag was set to false). 

## Example model result
```json
"inferences":[
   {
      "type":"trialEligibility",
      "id":"NCT04140526",
      "source":"clinicaltrials.gov",
      "value":"Ineligible",
      "confidenceScore":0.4
   },
   {
      "type":"trialEligibility",
      "id":"NCT04026412",
      "source":"clinicaltrials.gov",
      "value":"Eligible",
      "confidenceScore":0.8
   },
   "..."
]
```

## Next steps

To get better insights into the request and responses, read more on the following pages:

>[!div class="nextstepaction"]
> [Model configuration](model-configuration.md) 
