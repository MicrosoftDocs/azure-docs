---
title: Using Trial Matcher
titleSuffix: Project Health Insights
description: This article describes how to use the Trial Matcher
services: azure-health-insights
author: iBoonZ
manager: urieinav
ms.service: azure-health-insights
ms.topic: quickstart
ms.date: 01/27/2023
ms.author: behoorne
---


# Quickstart: Use the Trial Matcher model

This quickstart provides an overview on how to use the Trial Matcher.

## Prerequisites
To use Trial Matcher, you must have an Azure AI services account created. If you haven't already created an Azure AI services account, see [Deploy Project Health Insights using the Azure portal.](../deploy-portal.md)

Once deployment is complete, you use the Azure portal to navigate to the newly created Azure AI services account to see the details, including your Service URL. The Service URL to access your service is: https://```YOUR-NAME```.cognitiveservices.azure.com/. 


## Submit a request and get results
To send an API request, you need your Azure AI services account endpoint and key.
![Screenshot of the Keys and Endpoints for the Trial Matcher.](../media/keys-and-endpoints.png) 

> [!IMPORTANT]
> The Trial Matcher is an asynchronous API. Trial Matcher prediction is performed upon receipt of the API request and the results are returned asynchronously. The API results are available for 1 hour from the time the request was ingested and is indicated in the response. After the time period, the results are purged and are no longer available for retrieval.

### Example Request

To submit a request to the Trial Matcher, you need to make a POST request to the endpoint. 

In the example below the patients are matches to the ```Clinicaltrials_gov``` source, for a ```lung cancer``` condition with facility locations for the city ```Orlando```. 

```http
POST https://{your-cognitive-service-endpoint}/healthinsights/trialmatcher/jobs?api-version=2022-01-01-preview
Content-Type: application/json
Ocp-Apim-Subscription-Key: {your-cognitive-services-api-key}
{
    "Configuration": {
        "ClinicalTrials": {
            "RegistryFilters": [
                {
                    "Sources": [
                        "Clinicaltrials_gov"
                    ],
                    "Conditions": ["lung cancer"],
                    "facilityLocations": [
                        {
                            "State": "FL",
                            "City": "Orlando",
                            "countryOrRegion": "United States"
                        }
                    ]
                }
            ]
        },
        "IncludeEvidence": false,
        "Verbose": false
    },
    "Patients": [
        {
            "Info": {
                "sex": "female",
                "birthDate": "01/01/1987",
                "ClinicalInfo": [
                    
                ]
            },
            "id": "12"
        }
    ]
}

```


The response includes the operation-location in the response header. The value looks similar to the following URL:
```https://eastus.api.cognitive.microsoft.com/healthinsights/trialmatcher/jobs/b58f3776-c6cb-4b19-a5a7-248a0d9481ff?api_version=2022-01-01-preview```


### Example Response

To get the results of the request, make the following GET request to the URL specified in the POST response operation-location header.
```http
GET https://{your-cognitive-service-endpoint}/healthinsights/trialmatcher/jobs/{job-id}?api-version=2022-01-01-preview
Content-Type: application/json
Ocp-Apim-Subscription-Key: {your-cognitive-services-api-key}
```

An example response:

```json
{
    "results": {
        "patients": [
            {
                "id": "12",
                "inferences": [
                    {
                        "type": "trialEligibility",
                        "id": "NCT03318939",
                        "source": "clinicaltrials.gov",
                        "value": "Eligible"
                    },
                    {
                        "type": "trialEligibility",
                        "id": "NCT03417882",
                        "source": "clinicaltrials.gov",
                        "value": "Eligible"
                    },
                    {
                        "type": "trialEligibility",
                        "id": "NCT02628067",
                        "source": "clinicaltrials.gov",
                        "value": "Eligible"
                    },
                    {
                        "type": "trialEligibility",
                        "id": "NCT04948554",
                        "source": "clinicaltrials.gov",
                        "value": "Eligible"
                    },
                    {
                        "type": "trialEligibility",
                        "id": "NCT04616924",
                        "source": "clinicaltrials.gov",
                        "value": "Eligible"
                    },
                    {
                        "type": "trialEligibility",
                        "id": "NCT04504916",
                        "source": "clinicaltrials.gov",
                        "value": "Eligible"
                    },
                    {
                        "type": "trialEligibility",
                        "id": "NCT02635009",
                        "source": "clinicaltrials.gov",
                        "value": "Eligible"
                    },
                    ...
                ],
                "neededClinicalInfo": [
                    {
                        "system": "http://www.nlm.nih.gov/research/umls",
                        "code": "METASTATIC",
                        "name": "metastatic"
                    },
                    {
                        "semanticType": "T000",
                        "system": "http://www.nlm.nih.gov/research/umls",
                        "code": "C0032961",
                        "name": "Pregnancy"
                    },
                    {
                        "semanticType": "T000",
                        "system": "http://www.nlm.nih.gov/research/umls",
                        "code": "C1512162",
                        "name": "Eastern Cooperative Oncology Group"
                    }
                ]
            }
        ],
        "modelVersion": "2022.03.24",
        "knowledgeGraphLastUpdateDate": "2022.03.29"
    },
    "jobId": "26484d27-f5d7-4c74-a078-a359d1634a63",
    "createdDateTime": "2022-04-04T16:56:00Z",
    "expirationDateTime": "2022-04-04T17:56:00Z",
    "lastUpdateDateTime": "2022-04-04T16:56:00Z",
    "status": "succeeded"
}
```


## Data limits

**Limit**                            |**Value**
-------------------------------------|---------
Maximum # patients per request       |1        
Maximum # trials per patient         |5000     
Maximum # location filter per request|1        


## Next steps

To get better insights into the request and responses, read more on the following pages:

>[!div class="nextstepaction"]
> [Model configuration](model-configuration.md) 

>[!div class="nextstepaction"]
> [Patient information](patient-info.md) 
