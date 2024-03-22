---
title: Onco-Phenotype model configuration
titleSuffix: Azure AI Health Insights
description: This article provides Onco-Phenotype model configuration information.
services: azure-health-insights
author: iBoonZ
manager: urieinav
ms.service: azure-health-insights
ms.topic: overview
ms.date: 01/26/2023
ms.author: behoorne
---


# Onco-Phenotype model configuration

To interact with the Onco-Phenotype model, you can provide several model configurations parameters that modify the outcome of the responses.

> [!IMPORTANT]
> Model configuration is applied to ALL the patients within a request.

```json
"configuration": {
    "checkForCancerCase": false,
    "includeEvidence": false
}
```

## Case finding


The Onco-Phenotype model configuration helps you find if any cancer cases exist. The API allows you to explicitly check if a cancer case exists in the provided clinical documents. 

**Check for cancer case** |**Did the model find a case?** |**Behavior** 
---------------------- |-----------------------|-------------------
true |Yes  |Inferences are returned 
true  |No  |No inferences are returned     
false  |N/A  |Inferences are always returned but they aren't meaningful if there's no cancer case.

Set ```checkForCancerCase``` to ```false``` if
- you're sure that the provided clinical documents definitely contain a case
- the model is unable to find a case in a valid scenario

If a case is found in the provided clinical documents and the model is able to find that case, the inferences are always returned.

## Case finding examples 

### With case finding 

The following example represents a case finding. The ```checkForCancerCase``` has been set to ```true``` and ```includeEvidence``` has been set to ```false```. Meaning the model checks for a cancer case but not include the evidence.

Request that contains a case:
```json
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
            "value": "Laterality:  Left \n   Tumor type present:  Invasive duct carcinoma; duct carcinoma in situ \n   Tumor site:  Upper inner quadrant \n   Invasive carcinoma \n   Histologic type:  Ductal \n   Size of invasive component:  0.9 cm \n   Histologic Grade - Nottingham combined histologic score:  1 out of 3 \n   In situ carcinoma (DCIS) \n   Histologic type of DCIS:  Cribriform and solid \n   Necrosis in DCIS:  Yes \n   DCIS component of invasive carcinoma:  Extensive \n"
          }
        }
      ]
    }
  ]
}
```
Response:
```json
{
  "results": {
    "patients": [
      {
        "id": "patient1",
        "inferences": [
          {
            "kind": "tumorSite",
            "value": "C50.2",
            "description": "BREAST",
            "confidenceScore": 0.9214
          },
          {
            "kind": "histology",
            "value": "8500",
            "confidenceScore": 0.9973
          },
          {
            "kind": "clinicalStageT",
            "value": "T1",
            "confidenceScore": 0.9956
          },
          {
            "kind": "clinicalStageN",
            "value": "N0",
            "confidenceScore": 0.9931
          },
          {
            "kind": "clinicalStageM",
            "value": "None",
            "confidenceScore": 0.5217
          },
          {
            "kind": "pathologicStageT",
            "value": "T1",
            "confidenceScore": 0.9477
          },
          {
            "kind": "pathologicStageN",
            "value": "N0",
            "confidenceScore": 0.7927
          },
          {
            "kind": "pathologicStageM",
            "value": "M0",
            "confidenceScore": 0.9208
          }
        ]
      }
    ],
    "modelVersion": "2023-03-01-preview"
  },
  "jobId": "385903b2-ab21-4f9e-a011-43b01f78f04e",
  "createdDateTime": "2023-03-08T17:02:46Z",
  "expirationDateTime": "2023-03-08T17:19:26Z",
  "lastUpdateDateTime": "2023-03-08T17:02:53Z",
  "status": "succeeded"
}
```
Request that does not contain a case:
```json
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
```
Response:
```json
{
  "results": {
    "patients": [
      {
        "id": "patient1",
        "inferences": []
      }
    ],
    "modelVersion": "2023-03-01-preview"
  },
  "jobId": "abe71219-b3ce-4def-9e12-3dc511096c88",
  "createdDateTime": "2023-03-08T17:05:23Z",
  "expirationDateTime": "2023-03-08T17:22:03Z",
  "lastUpdateDateTime": "2023-03-08T17:05:23Z",
  "status": "succeeded"
}
```

## Evidence 

Through the model configuration, the API allows you to seek evidence from the provided clinical documents as part of the inferences.

**Include evidence** | **Behavior**                                  
------------------- | ----------------------------------------------
true                | Evidence is returned as part of each inference     
false               | No evidence is returned                           


## Evidence example

The following example represents a case finding. The ```checkForCancerCase``` has been set to ```true``` and ```includeEvidence``` has been set to ```true```. Meaning the model checks for a cancer case and include the evidence.

Request that contains a case:
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
Response:
```json
{
  "results": {
    "patients": [
      {
        "id": "patient1",
        "inferences": [
          {
            "type": "tumorSite",
            "evidence": [
              {
                "patientDataEvidence": {
                  "id": "document1",
                  "text": "Upper inner",
                  "offset": 108,
                  "length": 11
                },
                "importance": 0.5563
              },
              {
                "patientDataEvidence": {
                  "id": "document1",
                  "text": "duct",
                  "offset": 68,
                  "length": 4
                },
                "importance": 0.0156
              }
            ],
            "value": "C50.2",
            "description": "BREAST",
            "confidenceScore": 0.9214
          },
          {
            "type": "histology",
            "evidence": [
              {
                "patientDataEvidence": {
                  "id": "document1",
                  "text": "Ductal",
                  "offset": 174,
                  "length": 6
                },
                "importance": 0.2937
              },
              {
                "patientDataEvidence": {
                  "id": "document1",
                  "text": "Invasive duct",
                  "offset": 43,
                  "length": 13
                },
                "importance": 0.2439
              },
              {
                "patientDataEvidence": {
                  "id": "document1",
                  "text": "invasive",
                  "offset": 193,
                  "length": 8
                },
                "importance": 0.1588
              },
              {
                "patientDataEvidence": {
                  "id": "document1",
                  "text": "duct",
                  "offset": 68,
                  "length": 4
                },
                "importance": 0.1483
              },
              {
                "patientDataEvidence": {
                  "id": "document1",
                  "text": "solid",
                  "offset": 368,
                  "length": 5
                },
                "importance": 0.0694
              },
              {
                "patientDataEvidence": {
                  "id": "document1",
                  "text": "Cribriform",
                  "offset": 353,
                  "length": 10
                },
                "importance": 0.043
              }
            ],
            "value": "8500",
            "confidenceScore": 0.9973
          },
          {
            "type": "clinicalStageT",
            "evidence": [
              {
                "patientDataEvidence": {
                  "id": "document1",
                  "text": "Invasive duct carcinoma; duct",
                  "offset": 43,
                  "length": 29
                },
                "importance": 0.2613
              },
              {
                "patientDataEvidence": {
                  "id": "document1",
                  "text": "invasive",
                  "offset": 193,
                  "length": 8
                },
                "importance": 0.1341
              },
              {
                "patientDataEvidence": {
                  "id": "document1",
                  "text": "Laterality:  Left",
                  "offset": 0,
                  "length": 17
                },
                "importance": 0.0874
              },
              {
                "patientDataEvidence": {
                  "id": "document1",
                  "text": "Invasive",
                  "offset": 133,
                  "length": 8
                },
                "importance": 0.0722
              },
              {
                "patientDataEvidence": {
                  "id": "document1",
                  "text": "situ",
                  "offset": 86,
                  "length": 4
                },
                "importance": 0.0651
              }
            ],
            "value": "T1",
            "confidenceScore": 0.9956
          },
          {
            "type": "clinicalStageN",
            "evidence": [
              {
                "patientDataEvidence": {
                  "id": "document1",
                  "text": "Invasive duct carcinoma; duct carcinoma in situ",
                  "offset": 43,
                  "length": 47
                },
                "importance": 0.1529
              },
              {
                "patientDataEvidence": {
                  "id": "document1",
                  "text": "invasive carcinoma:  Extensive",
                  "offset": 423,
                  "length": 30
                },
                "importance": 0.0782
              },
              {
                "patientDataEvidence": {
                  "id": "document1",
                  "text": "Invasive",
                  "offset": 133,
                  "length": 8
                },
                "importance": 0.0715
              },
              {
                "patientDataEvidence": {
                  "id": "document1",
                  "text": "Tumor",
                  "offset": 95,
                  "length": 5
                },
                "importance": 0.0513
              },
              {
                "patientDataEvidence": {
                  "id": "document1",
                  "text": "Left",
                  "offset": 13,
                  "length": 4
                },
                "importance": 0.0325
              },
              {
                "patientDataEvidence": {
                  "id": "document1",
                  "text": "Tumor",
                  "offset": 22,
                  "length": 5
                },
                "importance": 0.0174
              },
              {
                "patientDataEvidence": {
                  "id": "document1",
                  "text": "Histologic",
                  "offset": 156,
                  "length": 10
                },
                "importance": 0.0066
              }
            ],
            "value": "N0",
            "confidenceScore": 0.9931
          },
          {
            "type": "clinicalStageM",
            "evidence": [
              {
                "patientDataEvidence": {
                  "id": "document1",
                  "text": "Laterality:  Left",
                  "offset": 0,
                  "length": 17
                },
                "importance": 0.1579
              },
              {
                "patientDataEvidence": {
                  "id": "document1",
                  "text": "Invasive duct",
                  "offset": 43,
                  "length": 13
                },
                "importance": 0.1493
              },
              {
                "patientDataEvidence": {
                  "id": "document1",
                  "text": "Histologic Grade - Nottingham",
                  "offset": 225,
                  "length": 29
                },
                "importance": 0.1038
              },
              {
                "patientDataEvidence": {
                  "id": "document1",
                  "text": "Invasive",
                  "offset": 133,
                  "length": 8
                },
                "importance": 0.089
              },
              {
                "patientDataEvidence": {
                  "id": "document1",
                  "text": "duct carcinoma",
                  "offset": 68,
                  "length": 14
                },
                "importance": 0.0807
              },
              {
                "patientDataEvidence": {
                  "id": "document1",
                  "text": "invasive",
                  "offset": 423,
                  "length": 8
                },
                "importance": 0.057
              },
              {
                "patientDataEvidence": {
                  "id": "document1",
                  "text": "Extensive",
                  "offset": 444,
                  "length": 9
                },
                "importance": 0.0494
              },
              {
                "patientDataEvidence": {
                  "id": "document1",
                  "text": "Tumor",
                  "offset": 22,
                  "length": 5
                },
                "importance": 0.0311
              }
            ],
            "value": "None",
            "confidenceScore": 0.5217
          },
          {
            "type": "pathologicStageT",
            "evidence": [
              {
                "patientDataEvidence": {
                  "id": "document1",
                  "text": "Invasive duct",
                  "offset": 43,
                  "length": 13
                },
                "importance": 0.3125
              },
              {
                "patientDataEvidence": {
                  "id": "document1",
                  "text": "Left",
                  "offset": 13,
                  "length": 4
                },
                "importance": 0.201
              },
              {
                "patientDataEvidence": {
                  "id": "document1",
                  "text": "invasive",
                  "offset": 193,
                  "length": 8
                },
                "importance": 0.1244
              },
              {
                "patientDataEvidence": {
                  "id": "document1",
                  "text": "invasive",
                  "offset": 423,
                  "length": 8
                },
                "importance": 0.0961
              },
              {
                "patientDataEvidence": {
                  "id": "document1",
                  "text": "Invasive",
                  "offset": 133,
                  "length": 8
                },
                "importance": 0.0623
              },
              {
                "patientDataEvidence": {
                  "id": "document1",
                  "text": "Tumor",
                  "offset": 22,
                  "length": 5
                },
                "importance": 0.0583
              }
            ],
            "value": "T1",
            "confidenceScore": 0.9477
          },
          {
            "type": "pathologicStageN",
            "evidence": [
              {
                "patientDataEvidence": {
                  "id": "document1",
                  "text": "invasive component:",
                  "offset": 193,
                  "length": 19
                },
                "importance": 0.1402
              },
              {
                "patientDataEvidence": {
                  "id": "document1",
                  "text": "Nottingham combined histologic score:",
                  "offset": 244,
                  "length": 37
                },
                "importance": 0.1096
              },
              {
                "patientDataEvidence": {
                  "id": "document1",
                  "text": "Invasive carcinoma",
                  "offset": 133,
                  "length": 18
                },
                "importance": 0.1067
              },
              {
                "patientDataEvidence": {
                  "id": "document1",
                  "text": "Ductal",
                  "offset": 174,
                  "length": 6
                },
                "importance": 0.0896
              },
              {
                "patientDataEvidence": {
                  "id": "document1",
                  "text": "Invasive duct carcinoma;",
                  "offset": 43,
                  "length": 24
                },
                "importance": 0.0831
              },
              {
                "patientDataEvidence": {
                  "id": "document1",
                  "text": "Histologic",
                  "offset": 156,
                  "length": 10
                },
                "importance": 0.0447
              },
              {
                "patientDataEvidence": {
                  "id": "document1",
                  "text": "in situ",
                  "offset": 83,
                  "length": 7
                },
                "importance": 0.042
              },
              {
                "patientDataEvidence": {
                  "id": "document1",
                  "text": "Tumor",
                  "offset": 22,
                  "length": 5
                },
                "importance": 0.0092
              }
            ],
            "value": "N0",
            "confidenceScore": 0.7927
          },
          {
            "type": "pathologicStageM",
            "evidence": [
              {
                "patientDataEvidence": {
                  "id": "document1",
                  "text": "In situ carcinoma (DCIS)",
                  "offset": 298,
                  "length": 24
                },
                "importance": 0.1111
              },
              {
                "patientDataEvidence": {
                  "id": "document1",
                  "text": "Nottingham combined histologic",
                  "offset": 244,
                  "length": 30
                },
                "importance": 0.0999
              },
              {
                "patientDataEvidence": {
                  "id": "document1",
                  "text": "invasive carcinoma:",
                  "offset": 423,
                  "length": 19
                },
                "importance": 0.0787
              },
              {
                "patientDataEvidence": {
                  "id": "document1",
                  "text": "invasive",
                  "offset": 193,
                  "length": 8
                },
                "importance": 0.0617
              },
              {
                "patientDataEvidence": {
                  "id": "document1",
                  "text": "Invasive duct carcinoma;",
                  "offset": 43,
                  "length": 24
                },
                "importance": 0.0594
              },
              {
                "patientDataEvidence": {
                  "id": "document1",
                  "text": "Tumor",
                  "offset": 22,
                  "length": 5
                },
                "importance": 0.0579
              },
              {
                "patientDataEvidence": {
                  "id": "document1",
                  "text": "of DCIS:",
                  "offset": 343,
                  "length": 8
                },
                "importance": 0.0483
              },
              {
                "patientDataEvidence": {
                  "id": "document1",
                  "text": "Laterality:",
                  "offset": 0,
                  "length": 11
                },
                "importance": 0.0324
              },
              {
                "patientDataEvidence": {
                  "id": "document1",
                  "text": "Invasive carcinoma",
                  "offset": 133,
                  "length": 18
                },
                "importance": 0.0269
              },
              {
                "patientDataEvidence": {
                  "id": "document1",
                  "text": "carcinoma in",
                  "offset": 73,
                  "length": 12
                },
                "importance": 0.0202
              },
              {
                "patientDataEvidence": {
                  "id": "document1",
                  "text": "Tumor",
                  "offset": 95,
                  "length": 5
                },
                "importance": 0.0112
              }
            ],
            "value": "M0",
            "confidenceScore": 0.9208
          }
        ]
      }
    ],
    "modelVersion": "2023-03-01-preview"
  },
  "jobId": "5f975105-6f11-4985-b5cd-896215fb5cd3",
  "createdDateTime": "2023-03-08T17:10:39Z",
  "expirationDateTime": "2023-03-08T17:27:19Z",
  "lastUpdateDateTime": "2023-03-08T17:10:41Z",
  "status": "succeeded"
}
```

## Next steps

Refer to the following page to get better insights into the request and responses:

>[!div class="nextstepaction"]
> [Inference information](inferences.md) 