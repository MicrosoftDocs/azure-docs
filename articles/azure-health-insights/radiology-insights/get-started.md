---
title: Use Radiology Insights (Preview) 
titleSuffix: Azure AI Health Insights
description: This article describes how to use the Radiology Insights model (Preview)
services: azure-health-insights
author: JanSchietse
manager: JoeriVDV
ms.service: azure-health-insights
ms.topic: quickstart
ms.date: 12/06/2023
ms.author: janschietse
---


# Quickstart: Use the Radiology Insights (Preview)

This quickstart provides an overview on how to use the Radiology Insights (Preview).

## Prerequisites
To use the Radiology Insights (Preview) model, you must have an Azure AI services account created. 

If you have no Azure AI services account, see [Deploy Azure AI Health Insights using the Azure portal.](../deploy-portal.md)

Once deployment is complete, you use the Azure portal to navigate to the newly created Azure AI services account to see the details, including your Service URL. 
The Service URL to access your service is: https://```YOUR-NAME```.cognitiveservices.azure.com. 

## Example request and results

To send an API request, you need your Azure AI services account endpoint and key. 


<!-- You can also find a full view of the [request parameters here](/rest/api/cognitiveservices/healthinsights/radiology-insights/create-job). -->



![[Screenshot of the Keys and Endpoints for the Radiology Insights.](../media/keys-and-endpoints.png)](../media/keys-and-endpoints.png#lightbox)

> [!IMPORTANT]
> Prediction is performed upon receipt of the API request and the results will be returned asynchronously. The API results are available for 24 hours from the time the request was ingested, and is indicated in the response. After this time period, the results are purged and are no longer available for retrieval.

## Example request

### Starting with a request that contains a case

You can use the data from this example, to test your first request to the Radiology Insights model.

```url
POST
http://{cognitive-services-account-endpoint}/health-insights/radiology-insights/jobs?api-version=2023-09-01-preview
Content-Type: application/json
Ocp-Apim-Subscription-Key: {cognitive-services-account-key}
```
```json
{
  "configuration" : {
    "inferenceOptions" : {
      "followupRecommendationOptions" : {
        "includeRecommendationsWithNoSpecifiedModality" : false,
        "includeRecommendationsInReferences" : false,
        "provideFocusedSentenceEvidence" : false
      },
      "findingOptions" : {
        "provideFocusedSentenceEvidence" : false
      }
    },
    "inferenceTypes" : [ "lateralityDiscrepancy" ],
    "locale" : "en-US",
    "verbose" : false,
    "includeEvidence" : false
  },
  "patients" : [ {
    "id" : "11111",
    "info" : {
      "sex" : "female",
      "birthDate" : "1986-07-01T21:00:00+00:00",
      "clinicalInfo" : [ {
        "resourceType" : "Observation",
        "status" : "unknown",
        "code" : {
          "coding" : [ {
            "system" : "http://www.nlm.nih.gov/research/umls",
            "code" : "C0018802",
            "display" : "MalignantNeoplasms"
          } ]
        },
        "valueBoolean" : "true"
      } ]
    },
    "encounters" : [ {
      "id" : "encounterid1",
      "period" : {
        "start" : "2021-08-28T00:00:00",
        "end" : "2021-08-28T00:00:00"
      },
      "class" : "inpatient"
    } ],
    "patientDocuments" : [ {
      "type" : "note",
      "clinicalType" : "radiologyReport",
      "id" : "docid1",
      "language" : "en",
      "authors" : [ {
        "id" : "authorid1",
        "name" : "authorname1"
      } ],
      "specialtyType" : "radiology",
	  "createdDateTime" : "2021-8-28T00:00:00",
      "administrativeMetadata" : {
        "orderedProcedures" : [ {
          "code" : {
            "coding" : [ {
              "system" : "Https://loinc.org",
              "code" : "26688-1",
              "display" : "US BREAST - LEFT LIMITED"
            } ]
          },
          "description" : "US BREAST - LEFT LIMITED"
        } ],
        "encounterId" : "encounterid1"
      },
      "content" : {
        "sourceType" : "inline",
        "value" : "Exam:   US LT BREAST TARGETED\r\n\r\nTechnique:  Targeted imaging of the  right breast  is performed.\r\n\r\nFindings:\r\n\r\nTargeted imaging of the left breast is performed from the 6:00 to the 9:00 position.  \r\n\r\nAt the 6:00 position, 5 cm from the nipple, there is a 3 x 2 x 4 mm minimally hypoechoic mass with a peripheral calcification. This may correspond to the mammographic finding. No other cystic or solid masses visualized.\r\n"
      }
    } ]
  } ]
}
```

<!-- You can also find a full view of the [request parameters here](/rest/api/cognitiveservices/healthinsights/radiology-insights/create-job). -->





### Evaluating a response that contains a case

You get the status of the job by sending a request to the Radiology Insights model by adding the job ID from the initial request in the URL.

Example code snippet:

```url
GET
http://{cognitive-services-account-endpoint}/health-insights/radiology-insights/jobs/d48b4f4d-939a-446f-a000-002a80aa58dc?api-version=2023-09-01-preview
```

```json
{
  "result": {
    "patientResults": [
      {
        "patientId": "11111",
        "inferences": [
          {
            "kind": "lateralityDiscrepancy",
            "lateralityIndication": {
              "coding": [
                {
                  "system": "*SNOMED",
                  "code": "24028007",
                  "display": "RIGHT (QUALIFIER VALUE)"
                }
              ]
            },
            "discrepancyType": "orderLateralityMismatch"
          }
        ]
      }
    ]
  },
  "id": "862768cf-0590-4953-966b-1cc0ef8b8256",
  "createdDateTime": "2023-12-18T12:25:37.8942771Z",
  "expirationDateTime": "2023-12-18T12:42:17.8942771Z",
  "lastUpdateDateTime": "2023-12-18T12:25:49.7221986Z",
  "status": "succeeded"
}
```

<!-- You can also find a full view of the [request parameters here](/rest/api/cognitiveservices/healthinsights/radiology-insights/get-job). -->

## Data limits

Limit, Value
- Maximum # patients per request, 1
- Maximum # patientdocuments per request, 1
- Maximum # encounters per request, 1
- Maximum # characters per patient, 50,000 for data[i].content.value all combined

## Request validation

Every request contains required and optional fields that should be provided to the Radiology Insights model. When you're sending data to the model, make sure that you take the following properties into account:

Within a request:
- patients should be set
- patients should contain one entry
- ID in patients entry should be set

Within configuration:
If set, configuration locale should be one of the following values (case-insensitive): 
-  en-CA
-  en-US
-  en-AU
-  en-DE
-  en-IE
-  en-NZ
-  en-GB


Within patients:
- should contain one patientDocument entry
- ID in patientDocument should be set
- if encounters and/or info are used, ID should be set


For the patientDocuments within a patient:
- createdDateTime (serviceDate) should be set
- Patient Document language should be EN (case-insensitive) 
- documentType should be set to Note
- Patient Document clinicalType should be set to radiology report or pathology report
- Patient Document specialtyType should be radiology or pathology
- If set, orderedProcedures in administrativeMetadata should contain code -with code and display- and description
- Document content shouldn't be blank/empty/null 


```json
"patientDocuments" : [ {
      "type" : "note",
      "clinicalType" : "radiologyReport",
      "id" : "docid1",
      "language" : "en",
      "authors" : [ {
        "id" : "authorid1",
        "name" : "authorname1"
      } ],
      "specialtyType" : "radiology",
	    "createdDateTime" : "2021-8-28T00:00:00",
      "administrativeMetadata" : {
        "orderedProcedures" : [ {
          "code" : {
            "coding" : [ {
              "system" : "Https://loinc.org",
              "code" : "41806-1",
              "display" : "CT ABDOMEN"
            } ]
          },
          "description" : "CT ABDOMEN"
        } ],
        "encounterId" : "encounterid1"
      },
      "content" : {
        "sourceType" : "inline",
        "value" : "CT ABDOMEN AND PELVIS\n\nProvided history: \n78 years old Female\nAbnormal weight loss\n\nTechnique: Routine protocol helical CT of the abdomen and pelvis were performed after the injection of intravenous nonionic iodinated contrast. Axial, Sagittal and coronal 2-D reformats were obtained. Oral contrast was also administered.\n\nFindings:\nLimited evaluation of the included lung bases demonstrates no evidence of abnormality. \n\nGallbladder is absent. "
      }
    } ]
```



## Next steps

To get better insights into the request and responses, you can read more on following pages:

>[!div class="nextstepaction"]
> [Model configuration](model-configuration.md) 

>[!div class="nextstepaction"]
> [Inference information](inferences.md) 
