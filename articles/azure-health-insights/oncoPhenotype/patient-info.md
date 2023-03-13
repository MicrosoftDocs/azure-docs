---
title: OncoPhenotype patient info 
titleSuffix: Azure Health Insights
description: This article describes how and which patient information can be sent to the OncoPhenotype model
services: azure-health-insights
author: iBoonZ
manager: urieinav
ms.service: azure-health-insights
ms.topic: overview
ms.date: 02/02/2023
ms.author: behoorne
---


# OncoPhenotype Patient Info

The OncoPhenotype currently can receive patient information in the form of ```Unstructured clinical notes```.
The payload should contain a ```patients``` section with one or more objects where the ```data``` property contains one or more JSON object of ```kind``` "note". 
                      

## Example payload
An example can be seen below


```json
{
  "configuration": {
    "checkForCancerCase": true,
    "includeEvidence": true
  },
  "patients": [
    {
      "id": "patient1",
      "data": [
        {
          "kind": "note",
          "clinicalType": "pathology",
          "id": "document1",
          "language": "en",
          "createdDateTime": "2022-01-01T00:00:00",
          "content": {
            "sourceType": "inline",
            "value": "Laterality:  Left \n   Tumor type present:  Invasive duct carcinoma; duct carcinoma in situ \n   Tumor site:  Upper inner quadrant \n   Invasive carcinoma \n   Histologic type:  Ductal \n   Size of invasive component:  0.9 cm \n   Histologic Grade - Nottingham combined histologic score:  1 out of 3 \n   In situ carcinoma (DCIS) \n   Histologic type of DCIS:  Cribriform and solid \n   Necrosis in DCIS:  Yes \n   DCIS component of invasive carcinoma:  Extensive \n"
          }
        }
      ]
    }
  ]
}
```



## Next steps

To get started using the OncoPhenotype model, you can 

>[!div class="nextstepaction"]
> [deploy the service via the portal](../deploy-portal.md) 