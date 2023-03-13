---
title: Using Trial Matcher
titleSuffix: Azure Health Insights
description: This article describes how to use the Trial Matcher
services: azure-health-insights
author: iBoonZ
manager: urieinav
ms.service: azure-health-insights
ms.topic: quickstart
ms.date: 01/27/2023
ms.author: behoorne
---


# Using the Trial Matcher

This tutorial provides an overview on how to use the Trial Matcher.


## Prerequisites
To use Trial Matcher, you must have Cognitive Services account created. If you haven't already created a Cognitive Services account, see [Deploy Azure Health Insights using the Azure portal](../deploy-portal.md)

Once deployment is complete, you can use the Azure portal to navigate to the newly created Cognitive Services account to see the details including your Service URL. The Service URL to access your service is: https://```YOUR-NAME```.cognitiveservices.azure.com/. 


## Submitting a request and getting results
To send an API request, you need your Cognitive Services account endpoint and key.

![Screenshot of the Keys and Endpoints for the Trial Matcher.](../media/keys-and-endpoints.jpg) 

> [!IMPORTANT]
> The Trial Matcher is an asynchronous API. Trial Matcher prediction is performed upon receipt of the API request and the results are returned asynchronously. The API results are available for 1 hour from the time the request was ingested and is indicated in the response. After the time period, the results are purged and are no longer available for retrieval.

### Example Request

To submit a request to the Trial Matcher, make a POST request to the following endpoint 

```http
POST https://{your-cognitive-service-endpoint}/healthdecisionsupport/trialmatcher/jobs?api-version=2022-01-01-preview
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
                            "Country": "United States"
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
                "gender": "female",
                "birthDate": "01/01/1987",
                "ClinicalInfo": [
                    
                ]
            },
            "id": "12"
        }
    ]
}

```

With the following fields, at the body of the request:

| Element                                                                                | Valid values                                                                                                                                                              | Required? | Usage                                                                                                                                                                                                                                                                                                     |
| :------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :-------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Patients         |                                                                                                                                                                           |           |      The list of patients including their clinical information and data                                                                                                                                                                                                                                                                                                       |
| ID                                                                                     | string                                                                                                                                                                    | Yes       | A given identifier for the patient. Has to be unique across al patients in a single request.                                                                                                                                                                                                              |
| info                                                                                   | Includes the gender, birthDate and clinicalInfo fields                                                                                                          | Yes       | Patient structured information, including demographics and known structured clinical information.                                                                                                                                                                                                         |
| gender                                                                                 | Allowed values: ```Female``` - ```Male``` - ```unspecified```                                                                                                                              | Yes       | The patient’s gender                                                                                                                                                                                                                                                                                      |
| birthDate                                                                              | string (yyyy-mm-dd)                                                                                                                                                       | Yes       | The patient’s date of birth                                                                                                                                                                                                                                                                               |
| clinicalInfo                                                                           | A list of clinicalCodedElements                                                                                                                                           | No        | Known clinical information for the patient, structured                                                                                                                                                                                                                                                    |
| clinicalCodedElement                                                                   | Contain the system, code, name, and value fields                                                                                                                    | No        | A piece of clinical information, expressed as a code in a clinical coding system, extended by semantic information.                                                                                                                                                                                       |
| system                                                                                 | Allowed values: - ```http://www.nlm.nih.gov /research/umls```                                                                                                                 | Yes       | The clinical coding system                                                                                                                                                                                                                                                                                |
| code                                                                                   | string                                                                                                                                                                    | Yes       | The CUID  within the given clinical coding system                                                                                                                                                                                                                                                         |
| Name                                                                                   | string                                                                                                                                                                    | No        | The name of this coded concept in the coding system                                                                                                                                                                                                                                                       |
| value                                                                                  | string                                                                                                                                                                    | No        | A value associated with the code within the given clinical coding system                                                                                                                                                                                                                                  |
| data                                                                                   | Contains ```Document type```, ```clinical type```, ```id```, ```language```, ```created date``` and ```time``` and ```content```.                                                                                   | No        | Patient clinical data, given as unstructured document or fhirBundle.                                                                                                                                                                                                                                      |
| type                                                                                   | DocumentType string ```note``` or ```fhirBundle``` are supported for this version                                                                                                 | No        | the type of the patient document.                                                                                                                                                                                                                                                                         |
| ClinicalType                                                                           | ClinicalDocumentType String – supported values: ```consultation```, ```dischargeSummary```, ```historyAndPhysical```, ```procedure```, ```progress```, ```imaging```, ```laboratory```, ```pathology```                   | No        | The type of the clinical document.                                                                                                                                                                                                                                                                        |
| ID                                                                                     | string                                                                                                                                                                    | No        | A given identifier for the documents. Has to be unique for all documents for single patient.                                                                                                                                                                                                              |
| Language                                                                               | string                                                                                                                                                                    | No        | A 2 letter ISO 639-1 representation of the language of the document                                                                                                                                                                                                                                       |
| createDateTime                                                                         | string (yyyy-mm-dd)                                                                                                                                                       | No        | The date and time when the document was created.                                                                                                                                                                                                                                                          |
| content                                                                                | Contains the document source type and value                                                                                                                               | No        | The content of the patient document                                                                                                                                                                                                                                                                       |
| Source Type                                                                            | ```inline``` - ```reference ```                                                                                                                             | No        | In case the source type is 'inline', the content is given as a string (for instance, text). In case the source type is 'reference', the content is given as a URI.                                                                                                                                        |
| value                                                                                  | string                                                                                                                                                                    | No        | The content of the document, given either inline (as a string) or as a reference (URI).                                                                                                                                                                                                                   |
| Configuration - includes the verbose, includeEvidence, and clinicalTrials fields |                                                                                                                                                                           |           |                                                                                                                                                                                                                                                                                                           |
| verbose                                                                                | Boolean (default: false)                                                                                                                                                  | No        | An indication whether the model should return trial information  (such as title, location, contact info, etc.)                                                                                                                                                                                            |
| includeEvidence                                                                        | Boolean (default: true)                                                                                                                                                   | No        | An indication whether the model’s output should include evidence for the inferences                                                                                                                                                                                                                       |
| clinicalTrials                                                                         | Includes the registryFilters field                                                                                                                                  | Yes       | The clinical trials that the patient should be matched to. The trial selection is given as a list of filters to clinicaltrials.gov.                                                                                                                                                                       |
| registryFilters                                                                        | Includes the ```conditions```, ```studyTypes```, ```recruitmentStatuses```, ```sponsors```, ```phases```, ```purposes```, ```id```s, ```sources```, ```facilityNames```, and ```facilityLocations``` fields                     | Yes       | A filter defining a subset of clinical trials from clinicaltrials.gov                                                                                                                                                                                                                                     |
| conditions                                                                             | string                                                                                                                                                                    | No        | Trials with any of the given medical conditions are included in the selection (if other limitations are satisfied). Leaving this list empty is not limitting the medical condition. Conditions or IDs are mandatory.                                                                |
| studyTypes                                                                             | Allowed values:  - ```interventional``` - ```observational``` - ```expandedAccess``` - ```patientRegistries```                                                                                   | No        | Trials with any of the given study typesare included in the selection (if other limitations are satisfied). Leaving this list empty are not limitting the study types                                                                                                                        |
| recruitmentStatuses                                                                    | Allowed values:  - ```unknownStatus``` - ```notYetRecruiting``` -  ```recruiting``` -  ```enrollingByInvitation```                                                                               | No        | Trials with any of the given recruitment statuses are included in the selection (if other limitations are satisfied). Leaving this list empty are not limitting the recruitment statuses                                                                                                      |
| sponsors                                                                               | string                                                                                                                                                                    | No        | Trials with any of the given sponsors are included in the selection (if other limitations are satisfied). Leaving this list empty is not limitting the sponsors                                                                                                                             |
| phases                                                                                 | Allowed values:  - ```notApplicable``` - ```earlyPhase1``` - ```phase1``` - ```phase2``` - ```phase3``` - phase4                                                                                        | No        | Trials with any of the given phases are included in the selection (if other limitations are satisfied). Leaving this list empty is not limitting the phases                                                                                                                                  |
| purposes                                                                               | Allowed values: - ```notApplicable``` -  ```screening``` - ```diagnostic``` - ```prevention``` - ```healthServiceResearch``` -  ```treatment``` - ```deviceFeasibility``` - ```supportiveCare``` - ```basiceScience```  - ```other``` | No        | Trials with any of the given purposes are included in the selection (if other limitations are satisfied). Leaving this list empty is not limitting the purposes                                                                                                                              |
| IDs                                                                                    | string                                                                                                                                                                    | No        | Trials with any of the given identifiers are included in the selection (if other limitations are satisfied). Leaving this list empty is not limitting the trial identifiers.                                                                                                                 |
|                                                                                        |                                                                                                                                                                           |           | Conditions or IDs are mandatory.                                                                                                                                                                                                                                                                |
| sources                                                                                | Allowed values: - ```clinicaltrials_gov```                                                                                                                                   | Yes       | Trials with any of the given sources are included in the selection                                                                                                                                                                                                                                    |
| facilityNames                                                                          | string                                                                                                                                                                    | No        | Trials with any of the given facility names are included in the selection (if other limitations are satisfied). Leaving this list empty is not limitting the trial facility names                                                                                                            |
| facilityLocations                                                                      | A list of Locations                                                                                                                                                       | No        | Trials with any of the given facility locations are included in the selection (if other limitations are satisfied). Leaving this list empty is not limitting the trial facility locations.                                                                                                   |
| location                                                                               | Includes the city, state, and country fields.                                                                                                                       | No        | A location given as a combination of city/state/country. It could specify a city, a state or a country. In case a city is specified, either state + country or country (for countries where there are no states) should be added. In case a state is specified (without a city), country should be added. |
| city                                                                                   | string                                                                                                                                                                    | No        | City name                                                                                                                                                                                                                                                                                                 |
| state                                                                                  | string                                                                                                                                                                    | No        | State name                                                                                                                                                                                                                                                                                                |
| country                                                                                | string                                                                                                                                                                    | Yes       | Country name                                                                                                                                                                                                                                                                                              |
|                                                                                        |                                                                                                                                                                           |           |                                                                                                                                                                                                                                                                                                           |


The response will include the operation-location in the response header. The value looks similar to the following URL:
```https://eastus.api.cognitive.microsoft.com/healthdecisionsupport/trialmatcher/jobs/b58f3776-c6cb-4b19-a5a7-248a0d9481ff?api_version=2022-01-01-preview```


### Example Response

To get the results of the request, make the following GET request to the URL specified in the POST response operation-location header.
```http
GET https://{your-cognitive-service-endpoint}/healthdecisionsupport/trialmatcher/jobs/{job-id}?api-version=2022-01-01-preview
Content-Type: application/json
Ocp-Apim-Subscription-Key: {your-cognitive-services-api-key}
```

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

To get better insights into the request and responses, you can read more on following pages:

>[!div class="nextstepaction"]
> [Model configuration](model-configuration.md) 

>[!div class="nextstepaction"]
> [Patient information](patient-info.md) 