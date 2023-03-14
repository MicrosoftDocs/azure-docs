---
title: OncoPhenotype model configuration
titleSuffix: Azure Health Insights
description: This article provides OncoPhenotype model configuration information.
services: azure-health-insights
author: iBoonZ
manager: urieinav
ms.service: azure-health-insights
ms.topic: overview
ms.date: 01/26/2023
ms.author: behoorne
---


# OncoPhenotype Model configuration

To interact with the OncoPhonetype model you can provide several model configurations parameters, that will modify the outcome of the responses.

> [!IMPORTANT]
> Model configuration is applied to ALL the patients within a request.

```json
"configuration": {
    "checkForCancerCase": false,
    "includeEvidence": false
}
```

## Case finding
Through the model configuration, the API allows you to explicitly check if a cancer case exists in the provided clinical documents and only then generate the inferences

**CHECK FOR CANCER CASE** |**DID THE MODEL FIND A CASE?** |**BEHAVIOR** 
---------------------- |-----------------------|-------------------
true |Yes  |Inferences are returned 
true  |No  |No inferences are returned     
false  |N/A  |Inferences are always returned but they are not meaningful in the event of no cancer case in the provided clinical documents     

Set ```checkForCancerCase``` to ```false``` if
- you are sure that the provided clinical documents definitely contain a case
- the model is unable to find a case in a valid scenario

If there exists a case in the provided clinical documents and the model is able to find that case, inferences returned are same irrespective of ```checkForCancerCase``` configuration.

## Case finding examples 

### With case finding 

```json
Request: 
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

Response:
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
### Without case finding 

```json
Request: 
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
                        "value": "Test document"
                    }
                }   
            ]   
        }
    ]
}

Response: 
{
    "results": {
        "patients": [
            {
                "id": "patient1",
                "inferences": []
            }
        ],
        "modelVersion": "2022-01-01-preview"
    },
    "jobId": "abe71219-b3ce-4def-9e12-3dc511096c88",
    "createdDateTime": "2022-03-08T17:05:23Z",
    "expirationDateTime": "2022-03-08T17:22:03Z",
    "lastUpdateDateTime": "2022-03-08T17:05:23Z",
    "status": "succeeded"
}
```

## Evidence 

Through the model configuration, the API allows you to seek evidence from the provided clinical documents as part of the inferences.

**INCLUDE EVIDENCE** | **BEHAVIOR**                                  
------------------- | ----------------------------------------------
true                | Evidence is returned as part of each inference     
false               | No evidence is returned                           


## Evidence examples 

### Request that contains a case

```json 
Request:
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

Response:
{
   "results":{
      "patients":[
         {
            "id":"patient1",
            "inferences":[
               {
                  "type":"tumorSite",
                  "evidence":[
                     {
                        "patientDataEvidence":{
                           "id":"document1",
                           "text":"Upper inner",
                           "offset":108,
                           "length":11
                        },
                        "importance":0.5563
                     },
                     {
                        "patientDataEvidence":{
                           "id":"document1",
                           "text":"duct",
                           "offset":68,
                           "length":4
                        },
                        "importance":0.0156
                     },
                     ...
                  ],
                  "value":"C50.2",
                  "description":"BREAST",
                  "confidenceScore":0.9214
               },
               {
                  "type":"histology",
                  "evidence":[
                     {
                        "patientDataEvidence":{
                           "id":"document1",
                           "text":"Ductal",
                           "offset":174,
                           "length":6
                        },
                        "importance":0.2937
                     },
                     {
                        "patientDataEvidence":{
                           "id":"document1",
                           "text":"Invasive duct",
                           "offset":43,
                           "length":13
                        },
                        "importance":0.2439
                     },
                     ...
                  ],
                  "value":"8500",
                  "confidenceScore":0.9973
               },
               {
                  "type":"clinicalStageT",
                  "evidence":[
                     {
                        "patientDataEvidence":{
                           "id":"document1",
                           "text":"Invasive duct carcinoma; duct",
                           "offset":43,
                           "length":29
                        },
                        "importance":0.2613
                     },
                     {
                        "patientDataEvidence":{
                           "id":"document1",
                           "text":"invasive",
                           "offset":193,
                           "length":8
                        },
                        "importance":0.1341
                     },
                     ...
                  ],
                  "value":"T1",
                  "confidenceScore":0.9956
               },
               {
                  "type":"clinicalStageN",
                  "evidence":[
                     {
                        "patientDataEvidence":{
                           "id":"document1",
                           "text":"Invasive duct carcinoma; duct carcinoma in situ",
                           "offset":43,
                           "length":47
                        },
                        "importance":0.1529
                     },
                     {
                        "patientDataEvidence":{
                           "id":"document1",
                           "text":"invasive carcinoma: Extensive",
                           "offset":423,
                           "length":30
                        },
                        "importance":0.0782
                     },
                     ...
                  ],
                  "value":"N0",
                  "confidenceScore":0.9931
               },
               {
                  "type":"clinicalStageM",
                  "evidence":[
                     {
                        "patientDataEvidence":{
                           "id":"document1",
                           "text":"Laterality: Left",
                           "offset":0,
                           "length":17
                        },
                        "importance":0.1579
                     },
                     {
                        "patientDataEvidence":{
                           "id":"document1",
                           "text":"Invasive duct",
                           "offset":43,
                           "length":13
                        },
                        "importance":0.1493
                     },
                     ...
                  ],
                  "value":"None",
                  "confidenceScore":0.5217
               },
               {
                  "type":"pathologicStageT",
                  "evidence":[
                     {
                        "patientDataEvidence":{
                           "id":"document1",
                           "text":"Invasive duct",
                           "offset":43,
                           "length":13
                        },
                        "importance":0.3125
                     },
                     {
                        "patientDataEvidence":{
                           "id":"document1",
                           "text":"Left",
                           "offset":13,
                           "length":4
                        },
                        "importance":0.201
                     },
                     ...
                  ],
                  "value":"T1",
                  "confidenceScore":0.9477
               },
               {
                  "type":"pathologicStageN",
                  "evidence":[
                     {
                        "patientDataEvidence":{
                           "id":"document1",
                           "text":"invasive component:",
                           "offset":193,
                           "length":19
                        },
                        "importance":0.1402
                     },
                     {
                        "patientDataEvidence":{
                           "id":"document1",
                           "text":"Nottingham combined histologic score:",
                           "offset":244,
                           "length":37
                        },
                        "importance":0.1096
                     },
                     ...
                  ],
                  "value":"N0",
                  "confidenceScore":0.7927
               },
               {
                  "type":"pathologicStageM",
                  "evidence":[
                     {
                        "patientDataEvidence":{
                           "id":"document1",
                           "text":"In situ carcinoma (DCIS)",
                           "offset":298,
                           "length":24
                        },
                        "importance":0.1111
                     },
                     {
                        "patientDataEvidence":{
                           "id":"document1",
                           "text":"Nottingham combined histologic",
                           "offset":244,
                           "length":30
                        },
                        "importance":0.0999
                     },
                     ....
                  ],
                  "value":"M0",
                  "confidenceScore":0.9208
               }
            ]
         }
      ],
      "modelVersion":"2022-01-01-preview"
   },
   "jobId":"5f975105-6f11-4985-b5cd-896215fb5cd3",
   "createdDateTime":"2022-03-08T17:10:39Z",
   "expirationDateTime":"2022-03-08T17:27:19Z",
   "lastUpdateDateTime":"2022-03-08T17:10:41Z",
   "status":"succeeded"
}

```


## Next steps

To get better insights into the request and responses, you can read more on following pages:

>[!div class="nextstepaction"]
> [Inference information](inferences.md) 