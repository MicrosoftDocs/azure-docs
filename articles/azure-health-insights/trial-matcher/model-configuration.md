---
title: Trial Matcher model configuration
titleSuffix: Project Health Insights
description: This article provides Trial Matcher model configuration information.
services: azure-health-insights
author: iBoonZ
manager: urieinav
ms.service: azure-health-insights
ms.topic: overview
ms.date: 02/02/2023
ms.author: behoorne
---

# Trial Matcher model configuration

The Trial Matcher includes a built-in Knowledge graph, which uses trials taken from [clinicaltrials.gov](https://clinicaltrials.gov/), and is being updated periodically. 

When you're matching patients to trials, you can define a list of filters to query a subset of clinical trials. Each filter can be defined based on ```trial conditions```, ```types```, ```recruitment statuses```, ```sponsors```, ```phases```, ```purposes```, ```facility names```, ```locations```, or ```trial IDs```.
- Specifying multiple values for the same filter category results in a trial set that is a union of the two sets.


In the following configuration, the model queries trials that are in recruitment status ```recruiting``` or ```not yet recruiting```.

```json
"recruitmentStatuses": ["recruiting", "notYetRecruiting"]
```


- Specifying multiple filter categories results in a trial set that is the combination of the sets.
In the following case, only trials for diabetes that are recruiting in Illinois are queried.
Leaving a category empty will not limit the trials by that category.

```json
"registryFilters": [
    {
        "conditions": [
            "Diabetes"
        ],
        "sources": [
            "clinicaltrials.gov"
        ],
        "facilityLocations": [
            {
                "country": "United States",
                "state": "IL"
            }
        ],
        "recruitmentStatuses": [
            "recruiting"
        ]
    }
]
```

## Evidence
Evidence is an indication of whether the model’s output should include evidence for the inferences. The default value is true. For each trial that the model concluded the patient is ineligible to, the model returns the relevant patient information and the eligibility criteria that were used to exclude the patient from the trial.

```json
{
    "type": "trialEligibility",
    "evidence": [
        {
            "eligibilityCriteriaEvidence": "Inclusion: Patient must have an Eastern Cooperative Oncology Group performance status of 0 or 1 The diagnosis of invasive adenocarcinoma of the breast must have been made by core needle biopsy.",
            "patientInfoEvidence": {
                "system": "http://www.nlm.nih.gov/research/umls",
                "code": "C1512162",
                "name": "Eastern Cooperative Oncology Group",
                "value": "2"
            }
        },
        {
            "eligibilityCriteriaEvidence": "Inclusion: Blood counts performed within 6 weeks prior to initiating chemotherapy must meet the following criteria: absolute neutrophil count must be greater than or equal 1200 / mm3 ;, platelet count must be greater than or equal 100,000 / mm3 ; and",
            "patientInfoEvidence": {
                "system": "http://www.nlm.nih.gov/research/umls",
                "code": "C0032181",
                "name": "Platelet Count measurement",
                "value": "75000"
            }
        }
    ],
    "id": "NCT03412643",
    "source": "clinicaltrials.gov",
    "value": "Ineligible",
}
```

## Verbose
Verbose is an indication of whether the model should return trial information. The default value is false. If set to True, the model returns trial information including ```Title```, ```Phase```, ```Type```, ```Recruitment status```, ```Sponsors```, ```Contacts```, and ```Facilities```.

If you use [gradual matching](./trial-matcher-modes.md), it’s typically used in the last stage of the qualification process, before displaying trial results


```json
{
    "type": "trialEligibility",
    "id": "NCT03513939",
    "source": "clinicaltrials.gov",
    "metadata": {
        "phases": [
            "phase1",
            "phase2"
        ],
        "studyType": "interventional",
        "recruitmentStatus": "recruiting",
        "sponsors": [
            "Sernova Corp",
            "CTI Clinical Trial and Consulting Services",
            "Juvenile Diabetes Research Foundation",
            "University of Chicago"
        ],
        "contacts": [
            {
                "name": "Frank, MD, PhD",
                "email": "frank@surgery.uchicago.edu",
                "phone": "999-702-2447"
            }
        ],
        "facilities": [
            {
                "name": "University of Chicago Medical Center",
                "city": "Chicago",
                "state": "Illinois",
                "country": "United States"
            }
        ]
    },
    "value": "Eligible",
    "description": "A Safety, Tolerability and Efficacy Study of Sernova's Cell Pouch™ for Clinical Islet Transplantation",
}
```



## Adding custom trials 
Trial Matcher can receive the eligibility criteria of a clinical trial in the format of a custom trial. The user of the service should provide the eligibility criteria section of the custom trial, as a text, in a format that is similar to the format of clinicaltrials.gov (same indentation and structure).
A custom trial can be provided as a unique trial to match a patient to, as a list of custom trials, or as addition to clinicaltrials.gov knowledge graph.
To provide a custom trial, the input to the Trial Matcher service should include ```ClinicalTrialRegisteryFilter.sources``` with value ```custom```. 

```json
{
   "Configuration":{
      "ClinicalTrials":{
         "CustomTrials":[
            {
               "Id":"CustomTrial1",
               "EligibilityCriteriaText":"INCLUSION CRITERIA:\n\n  1. Patients diagnosed with Diabetes\n\n2. patients diagnosed with cancer\n\nEXCLUSION CRITERIA:\n\n1. patients with RET gene alteration\n\n 2. patients taking Aspirin\n\n3. patients treated with Chemotherapy\n\n",
               "Demographics":{
                  "AcceptedGenders":[
                     "Female"
                  ],
                  "AcceptedAgeRange":{
                     "MinimumAge":{
                        "Unit":"Years",
                        "Value":0
                     },
                     "MaximumAge":{
                        "Unit":"Years",
                        "Value":100
                     }
                  }
               },
               "Metadata":{
                  "Phases":[
                     "Phase1"
                  ],
                  "StudyType":"Interventional",
                  "RecruitmentStatus":"Recruiting",
                  "Conditions":[
                     "Diabetes"
                  ],
                  "Sponsors":[
                     "sponsor1",
                     "sponsor2"
                  ],
                  "Contacts":[
                     {
                        "Name":"contact1",
                        "Email":"email1",
                        "Phone":"01"
                     },
                     {
                        "Name":"contact2",
                        "Email":"email2",
                        "Phone":"03"
                     }
                  ]
               }
            }
         ]
      },
      "Verbose":true,
      "IncludeEvidence":true
   },
   "Patients":[
      {
         "Id":"Patient1",
         "Info":{
            "Gender":"Female",
            "BirthDate":"2002-07-19T10:58:02.7500649+00:00",
            "ClinicalInfo":[
               {
                  "System":"http://www.nlm.nih.gov/research/umls",
                  "Code":"C0011849",
                  "Name":"Diabetes",
                  "Value":"True;EntityType:DIAGNOSIS"
               },
               {
                  "System":"http://www.nlm.nih.gov/research/umls",
                  "Code":"C0004057",
                  "Name":"aspirin",
                  "Value":"False;EntityType:MedicationName"
               }
            ]
         }
      }
   ]
}
```

## Next steps

To get started using the Trial Matcher model, refer to

>[!div class="nextstepaction"]
> [Deploy the service via the portal](../deploy-portal.md) 