---
title: Use OncoPhenotype 
titleSuffix: Azure Health Insights
description: This article describes how to use the OncoPhenotype
services: azure-health-insights
author: iBoonZ
manager: urieinav
ms.service: azure-health-insights
ms.topic: quickstart
ms.date: 01/26/2023
ms.author: behoorne
---


# Use the OncoPhenotype model

This tutorial provides an overview on how to use the OncoPhenotype.

## Prerequisites
To use OncoPhenotype model, you must have Cognitive Services account created. If you haven't already created a Cognitive Services account, see [Deploy Azure Health Insights using the Azure portal](../deploy-portal.md)

Once deployment is complete, you can use the Azure portal to navigate to the newly created Cognitive Services account to see the details including your Service URL. The Service URL to access your service is: https://```YOUR-NAME```.cognitiveservices.azure.com/. 


## Submitting a request and getting results
To send an API request, you need your Cognitive Services account endpoint and key.

![Screenshot of the Keys and Endpoints for the OncoPhenotype.](../media/keys-and-endpoints.jpg) 

> [!IMPORTANT]
> Prediction is performed upon receipt of the API request and the results will be returned asynchronously. The API results are available for 24 hours from the time the request was ingested, and is indicated in the response. After this time period, the results are purged and are no longer available for retrieval.

## Example Request

### Request that contains a case

```http
POST http://{cognitive-services-account-endpoint}/healthdecisionsupport/oncophenotype/jobs?api-version=2022-01-01-preview
Content-Type: application/json
Ocp-Apim-Subscription-Key: {cognitive-services-account-key}
{
"configuration": {
    "checkForCancerCase": true,
    "includeEvidence": false
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
                        "value": "Laterality: Left \n Tumor type present: Invasive duct carcinoma; duct
                        carcinoma in situ \n Tumor site: Upper inner quadrant \n Invasive carcinoma \n Histologic
                        type: Ductal \n Size of invasive component: 0.9 cm \n Histologic Grade - Nottingham combined
                        histologic score: 1 out of 3 \n In situ carcinoma (DCIS) \n Histologic type of DCIS:
                        Cribriform and solid \n Necrosis in DCIS: Yes \n DCIS component of invasive carcinoma:
                        Extensive \n"
                    }
                }
            ]   
        }
    ]
}

202 Accepted
content-length: 0 
date: Tue08 Mar 2022 17:05:22 GMT 
operation-location: http://{cognitive-services-account-
endpoint}/healthdecisionsupport/oncophenotype/jobs/abe71219-b3ce-4def-9e12-3dc511096c88 retry-after: 5 server: Kestrel 

```
### Response that contains a case

You can get the status of the job by sending a request to the oncophenotype model and adding the job ID from the initial request in the uri, as seen in the code snippet:

```url 
http://{cognitive-services-account-endpoint}/healthdecisionsupport/oncophenotype/jobs/385903b2-
ab21-4f9e-a011-43b01f78f04e?api-version=2022-01-01-preview
```

```json
{
"results":{
    "patients":[
        {
        "inferences":[
            {
                "kind":"tumorSite",
                "value":"C50.2",
                "description":"BREAST",
                "confidenceScore":0.9214
            },
            {
                "kind":"histology",
                "value":"8500",
                "confidenceScore":0.9973
            },
            {
                "kind":"clinicalStageT",
                "value":"T1",
                "confidenceScore":0.9956
            },
            {
                "kind":"clinicalStageN",
                "value":"N0",
                "confidenceScore":0.9931
            },
            {
                "kind":"clinicalStageM",
                "value":"None",
                "confidenceScore":0.5217
            },
            {
                "kind":"pathologicStageT",
                "value":"T1",
                "confidenceScore":0.9477
            },
            {
                "kind":"pathologicStageN",
                "value":"N0",
                "confidenceScore":0.7927
            },
            {
                "kind":"pathologicStageM",
                "value":"M0",
                "confidenceScore":0.9208
            }
        ],
    "id":"patient1"
    }
],
    "modelVersion":"2022-01-01-preview"
},
    "jobId":"385903b2-ab21-4f9e-a011-43b01f78f04e",
    "createdDateTime":"2022-03-08T17:02:46Z",
    "expirationDateTime":"2022-03-08T17:19:26Z",
    "lastUpdateDateTime":"2022-03-08T17:02:53Z",
    "status":"succeeded"
}
```

## Request Validation

Within a request:
- ```patients``` should be set
- ```patients``` should contain at least one entry
- ```id```s in patients entries should be unique

For each patient:
- ```data``` should be set
- ```data``` should contain at least one document of clinical type ```pathology```
- ```id``` s in data entries should be unique

For each clinical document within a patient:
- ```createdDateTime``` should be set
- if set, ```language``` should be ```en``` (default is ```en``` if not set)
- ```documentType``` should be set to ```Note```
- ```clinicalType``` should be set to one of ```imaging```, ```pathology```, ```procedure```, ```progress```
- content ```sourceType``` should be set to ```inline```

## Data limits

| **LIMIT**  | **VALUE**  |
| ---------- | ----------- |
| Maximum # patients per request  | 1  |
| Maximum # characters per patient | 50,000 for data[i].content.value all combined |


## Next steps

To get better insights into the request and responses, you can read more on following pages:

>[!div class="nextstepaction"]
> [Model Configuration](model-configuration.md) 

>[!div class="nextstepaction"]
> [Inferences](inferences.md) 