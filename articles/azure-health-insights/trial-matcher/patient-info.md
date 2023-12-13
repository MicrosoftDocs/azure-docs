---
title: Trial Matcher patient info 
titleSuffix: Azure AI Health Insights
description: This article describes how and which patient information can be sent to the Trial Matcher
services: azure-health-insights
author: iBoonZ
manager: urieinav
ms.service: azure-health-insights
ms.topic: overview
ms.date: 02/02/2023
ms.author: behoorne
---


# Trial Matcher patient info

Trial Matcher uses patient information to match relevant patient(s) with the clinical trial(s). You can provide the information in four different ways: 

-	Unstructured clinical notes
- FHIR bundles
- gradual Matching (question and answer)
- JSON key/value

## Unstructured clinical note

Patient data can be provided to the Trial Matcher as an unstructured clinical note.
The Trial Matcher performs a prior step of language understanding to analyze the unstructured text, retrieves the patient clinical information, and builds the patient data into structured data.

When providing patient data in clinical notes, use ```note``` value for  ```Patient.PatientDocument.type```.
Currently, Trial Matcher only supports one clinical note per patient.

The following example shows how to provide patient information as an unstructured clinical note:

```json
{
   "configuration":{
      "clinicalTrials":{
         "registryFilters":[
            {
               "conditions":[
                  "Cancer"
               ],
               "sources":[
                  "clinicaltrials.gov"
               ],
               "facilityLocations":[
                  {
                     "state":"IL",
                     "country":"United States"
                  }
               ]
            }
         ]
      },
      "verbose":true,
      "includeEvidence":true
   },
   "patients":[
      {
         "id":"patient_1",
         "info":{
            "gender":"Male",
            "birthDate":"2000-03-17",
            "clinicalInfo":[
               {
                  "system":"http://www.nlm.nih.gov/research/umls",
                  "code":"C0006826",
                  "name":"MalignantNeoplasms",
                  "value":"true"
               }
            ]
         },
         "data":[
            {
               "type":"Note",
               "clinicalType":"Consultation",
               "id":"12-consult_15",
               "content":{
                  "sourceType":"Inline",
                  "value":"TITLE:  Cardiology Consult\r\n                       DIVISION OF CARDIOLOGY\r\n                   COMPREHENSIVE CONSULTATION NOTE\r\nCHIEF COMPLAINT: Patient is seen in consultation today at the\r\nrequest of Dr. [**Last Name (STitle) 13959**]. We are asked to give consultative advice\r\nregarding evaluation and management of Acute CHF.\r\nHISTORY OF PRESENT ILLNESS:\r\n71 year old man with CAD w\/ diastolic dysfunction, CKD, Renal\r\nCell CA s\/p left nephrectomy, CLL, known lung masses and recent\r\nbrochial artery bleed, s\/p embolization of LLL bronchial artery\r\n[**1-17**], readmitted with hemoptysis on [**2120-2-3**] from [**Hospital 328**] [**Hospital 9250**]\r\ntransferred from BMT floor  following second episode of hypoxic\r\nrespiratory failure, HTN and tachycardia in 3 days. Per report,\r\non the evening of transfer to the [**Hospital Unit Name 1**], patient continued to\r\nremain tachypnic in upper 30s and was receiving IVF NS at\r\n100cc\/hr for concern of hypovolemic hypernatremia. He also had\r\nreceived 1unit PRBCs with temp rise for 98.3 to 100.4, he was\r\ncultured at that time, and transfusion rxn work up was initiated.\r\nAt around 5:30am, he was found to be newly hypertensive with SBP\r\n>200 with a regular tachycardia to 160 with new hypoxia requiring\r\nshovel mask. He received 1mg IV ativan, 1mg morphine, lasix 40mg\r\nIV x1, and lopressor 5mg IV. ABG 7.20\/63\/61 on shovel mask. "
               }
            }
         ]
      }
   ]
}
 ```

## FHIR bundles
Patient data can be provided to the Trial Matcher as a FHIR bundle. Patient data in FHIR bundle format can either be retrieved from a FHIR Server or from an EMR/EHR system that provides a FHIR interface. 

Trial Matcher supports USCore profiles and mCode profiles.

When providing patient data as a FHIR Bundle, use ```fhirBundle``` value for ```Patient.PatientDocument.type```. 
The value of the ```fhirBundle``` should be provided as a reference with the content, including the reference URI. 

The following example shows how to provide patient information as a FHIR Bundle:

```json
{
  "configuration": {
    "clinicalTrials": {
      "registryFilters": [
        {
          "conditions": [
            "Cancer"
          ],
          "phases": [
            "phase1"
          ],
          "sources": [
            "clinicaltrials.gov"
          ],
          "facilityLocations": [
            {
              "state": "CA",
              "country": "United States"
            }
          ]
        }
      ]
    },
    "verbose": true,
    "includeEvidence": true
  },
  "patients": [
    {
      "id": "patient_1",
      "info": {
        "gender": "Female",
        "birthDate": "2000-03-17"
      },
      "data": [
        {
          "type": "FhirBundle",
          "clinicalType": "Consultation",
          "id": "Consultation-14-Demo",
          "content": {
            "sourceType": "Inline",
            "value": "{\"resourceType\":\"Bundle\",\"id\":\"1ca45d61-eb04-4c7d-9784-05e31e03e3c6\",\"meta\":{\"profile\":[\"http://hl7.org/fhir/4.0.1/StructureDefinition/Bundle\"]},\"identifier\":{\"system\":\"urn:ietf:rfc:3986\",\"value\":\"urn:uuid:1ca45d61-eb04-4c7d-9784-05e31e03e3c6\"},\"type\":\"document\",\"entry\":[{\"fullUrl\":\"Composition/baff5da4-0b29-4a57-906d-0e23d6d49eea\",\"resource\":{\"resourceType\":\"Composition\",\"id\":\"baff5da4-0b29-4a57-906d-0e23d6d49eea\",\"status\":\"final\",\"type\":{\"coding\":[{\"system\":\"http://loinc.org\",\"code\":\"11488-4\",\"display\":\"Consult note\"}],\"text\":\"Consult note\"},\"subject\":{\"reference\":\"Patient/894a042e-625c-48b3-a710-759e09454897\",\"type\":\"Patient\"},\"encounter\":{\"reference\":\"Encounter/d6535404-17da-4282-82c2-2eb7b9b86a47\",\"type\":\"Encounter\",\"display\":\"unknown\"},\"date\":\"2022-08-16\",\"author\":[{\"reference\":\"Practitioner/082e9fc4-7483-4ef8-b83d-ea0733859cdc\",\"type\":\"Practitioner\",\"display\":\"Unknown\"}],\"title\":\"Consult note\",\"section\":[{\"title\":\"Chief Complaint\",\"code\":{\"coding\":[{\"system\":\"http://loinc.org\",\"code\":\"46239-0\",\"display\":\"Reason for visit and chief complaint\"}],\"text\":\"Chief Complaint\"},\"text\":{\"div\":\"<div>\\r\\n\\t\\t\\t\\t\\t\\t\\t<h1>Chief Complaint</h1>\\r\\n\\t\\t\\t\\t\\t\\t\\t<p>\\\"swelling of tongue and difficulty breathing and swallowing\\\"</p>\\r\\n\\t\\t\\t\\t\\t</div>\"},\"entry\":[{\"reference\":\"List/a7ba1fc8-7544-4f1a-ac4e-c0430159001f\",\"type\":\"List\",\"display\":\"Chief Complaint\"}]},{\"title\":\"History of Present Illness\",\"code\":{\"coding\":[{\"system\":\"http://loinc.org\",\"code\":\"10164-2\",\"display\":\"History of present illness\"}],\"text\":\"History of Present Illness\"},\"text\":{\"div\":\"<div>\\r\\n\\t\\t\\t\\t\\t\\t\\t<h1>History of Present Illness</h1>\\r\\n\\t\\t\\t\\t\\t\\t\\t<p>77 y o woman in NAD with a h/o CAD, DM2, asthma and HTN on altace for 8 years awoke from sleep around 2:30 am this morning of a sore throat and swelling of tongue. She came immediately to the ED b/c she was having difficulty swallowing and some trouble breathing due to obstruction caused by the swelling. She has never had a similar reaction ever before and she did not have any associated SOB, chest pain, itching, or nausea. She has not noticed any rashes, and has been afebrile. She says that she feels like it is swollen down in her esophagus as well. In the ED she was given 25mg benadryl IV, 125 mg solumedrol IV and pepcid 20 mg IV. This has helped the swelling some but her throat still hurts and it hurts to swallow. Nothing else was able to relieve the pain and nothing make it worse though she has not tried to drink any fluids because of trouble swallowing. She denies any recent travel, recent exposure to unusual plants or animals or other allergens. She has not started any new medications, has not used any new lotions or perfumes and has not eaten any unusual foods. Patient has not taken any of her oral medications today.</p>\\r\\n\\t\\t\\t\\t\\t</div>\"},\"entry\":[{\"reference\":\"List/c1c10373-6325-4339-b962-c3c114969ccd\",\"type\":\"List\",\"display\":\"History of Present Illness\"}]},{\"title\":\"Surgical History\",\"code\":{\"coding\":[{\"system\":\"http://loinc.org\",\"code\":\"10164-2\",\"display\":\"History of present illness\"}],\"text\":\"Surgical History\"},\"text\":{\"div\":\"<div>\\r\\n\\t\\t\\t\\t\\t\\t\\t<h1>Surgical History</h1>\\r\\n\\t\\t\\t\\t\\t\\t\\t<p>s/p Cardiac stent in 1999 \\r\\ns/p hystarectomy in 1970s \\r\\ns/p kidney stone retrieval 1960s</p>\\r\\n\\t\\t\\t\\t\\t</div>\"},\"entry\":[{\"reference\":\"List/1d5dcbe4-7206-4a27-b3a8-52e4d30dacfe\",\"type\":\"List\",\"display\":\"Surgical History\"}]},{\"title\":\"Medical History\",\"code\":{\"coding\":[{\"system\":\"http://loinc.org\",\"code\":\"11348-0\",\"display\":\"Past medical 
            ...."
          }
        }
      ]
    }
  ]
}

 ```

## Gradual Matching

Trial Matcher can also be used with gradual Matching. In this mode, you can send requests to the Trial Matcher in a gradual way. This is done via conversational intelligence or chat-like scenarios. 

The gradual Matching uses patient information for matching, including demographics (gender and birthdate) and structured clinical information. When sending clinical information via gradual matching, it’s passed as a list of ```clinicalCodedElements```.  Each one is expressed in a clinical coding system as a code that’s extended by semantic information and value

### Differentiating concepts

Other clinical information is derived from the eligibility criteria found in the subset of trials within the query. The model selects **up to three** most differentiating concepts, that is, that helps the most in qualifying the patient. The model will only indicate concepts that appear in trials and won't suggest collecting information that isn't required and won't help in qualification.

When you match potential eligible patients to a clinical trial, the same concept of needed clinical info will need to be provided. 
In this case, the three most differentiating concepts for the clinical trial provided are selected. 
In case more than one trial was provided, three concepts for all the clinical trials provided are selected. 

- Customers are expected to use the provided ```UMLSConceptsMapping.json``` file to map each selected concept with the expected answer type. Customers can also use the suggested question text to generate questions to users. Question text can also be edited and/or localized by customers.

- When you send patient information back to the Trial Matcher, you can also send a ```null``` value to any concept. 
This instructs the Trial Matcher to skip that concept, ignore it in patient qualification and instead send the next differentiating concept in the response.

> [!IMPORTANT]
> Typically, when using gradual Matching, the first request to the Trial Matcher will include a list of ```registryFilters``` based on customer configuration and user responses (e.g. condition and location). The response to the initial request will include a list of trial ```ids```. To improve performance and reduce latency, the trial ```ids``` should be used in consecutive requests directly (utilizing the ```ids``` registryFilter), instead of the original ```registryFilters``` that were used.


## Category concepts
There are five different categories that are used as concepts:
-	UMLS concept ID that represents a single concept
-	UMLS concept ID that represents multiple related concepts
- Textual concepts
-	Entity types
-	Semantic types


### 1. UMLS concept ID that represents a single concept

Each concept in this category is represented by a unique UMLS ID. The expected answer types can be Boolean, Numeric, or from a defined Choice set.

Example concept from neededClinicalInfo API response:

```json
{
    "system": "http://www.nlm.nih.gov/research/umls",
    "code": "C1512162",
    "name": "Eastern Cooperative Oncology Group"
}
```

Example mapping for the above concept from UMLSConceptsMapping.json:
```json
"C1512162": {
    "codes": "C1512162;C1520224",
    "name": "ECOG",
    "choices": [ "0", "1", "2", "3", "4" ],
    "question": "What is the patient's ECOG score?",
    "answerType": "Choice"
}
```

Example value sent to Trial Matcher for the above category:
```json
{
    "system": "http://www.nlm.nih.gov/research/umls",
    "code": "C1512162",
    "name": "Eastern Cooperative Oncology Group",
    "value": "2"
}
```

### 2. UMLS concept ID that represents multiple related concepts

Certain UMLS concept IDs can represent multiple related concepts, which are typically displayed to the user as a multi-choice question, such as mental health related concepts, or TNM staging.
In this category, answers are expected to include multiple codes and values, one for each concept that is part of the related concepts.

Example concept from neededClinicalInfo API response:
```json
{
    "system": "http://www.nlm.nih.gov/research/umls",
    "code": " C0475284",
    "name": "TNM tumor staging system "
}
```

Example mapping for the above concept from UMLSConceptsMapping.json:
```json
"C0475284": {
    "codes": "C0475284",
    "name": "TNM tumor staging system",
    "question": "If the patient was diagnosed with cancer, what is the patient's TNM stage?",
    "answerType": "MultiChoice",
    "multiChoice": {
        "C0475455": {
            "codes": "C0475455",
            "name": "T (Tumor)",
            "answerType": "Choice",
            "choices": [ "x", "0", "is", "1", "1a", "1b", "1c", "2", "2a", "2b", "2c", "3", "3a", "3b", "3c", "4", "4a", "4b", "4c" ]
        },
        "C0456532": {
            "codes": "C0456532",
            "name": "N (Lymph nodes)",
            "answerType": "Choice",
            "choices": [ "x", "0", "1", "1a", "1b", "1c", "2", "2a", "2b", "2c", "3", "3a", "3b", "3c" ]
        },
        "C0456533": {
            "codes": "C0456533",
            "name": "M (Metastases)",
            "answerType": "Choice",
            "choices": [ "x", "0", "1", "1a", "1b", "1c" ]
        }
    }
}
```

Example values sent to Trial Matcher for the above category:
```json
{
    "system": "http://www.nlm.nih.gov/research/umls",
    "code": "C0475455",
    "name": "T (Tumor)",
    "value": "1a"
},
{
    "system": "http://www.nlm.nih.gov/research/umls",
    "code": "C0456532",
    "name": "N (Lymph nodes)",
    "value": "1a"
},
{
    "system": "http://www.nlm.nih.gov/research/umls",
    "code": "C0456533",
    "name": "M (Metastases)",
    "value": "1"
}
```

### 3. Textual concepts

Textual concepts are concepts in which the code is a string, instead of a UMLS code. These are typically used to identify disease morphology and behavioral characteristics.

Example concept from neededClinicalInfo API response:
```json
{
    "system": "http://www.nlm.nih.gov/research/umls",
    "code": "NONINVASIVE",
    "name": "noninvasive;non invasive"
}
```

Example mapping for the above concept from UMLSConceptsMapping.json:
```json
"NONINVASIVE": {
    "codes": "noninvasive",
    "name": "noninvasive;non invasive",
    "question": "Was the patient diagnosed with a %p1% disease?",
    "answerType": "Boolean"
}
```

Example value sent to Trial Matcher for the above concept:
```json
{
    "system": "http://www.nlm.nih.gov/research/umls",
    "code": "NONINVASIVE",
    "name": "noninvasive;non invasive",
    "value": "true"
}
```


### 4. Entity types
Entity type concepts are concepts that are grouped by common entity types, such as medications, genomic and biomarker information.

When entity type concepts are sent by customers to the Trial Matcher as part of the patient’s clinical info, customers are expected to concatenate the entity type string to the value, separated with a semicolon. 

Example concept from neededClinicalInfo API response:
```json
{
    "category": "GENEORPROTEIN-VARIANT",
    "system": "http://www.nlm.nih.gov/research/umls",
    "code": " C1414313",
    "name": " EGFR gene ",
    "value": "EntityType:GENEORPROTEIN-VARIANT"
}
```

Example mapping for the above category from UMLSConceptsMapping.json:
```json
"GENEORPROTEIN-VARIANT": {
    "codes": "GeneOrProtein-Variant;GeneOrProtein-MutationType",
    "question": "Does the patient carry %p1% mutation/abnormality?",
    "name": "GeneOrProtein-Variant",
    "answerType": "Boolean"
}
```

Example value sent to Trial Matcher for the above category:
```json
{
    "system": "http://www.nlm.nih.gov/research/umls",
    "code": " C1414313",
    "name": "EGFR gene",
    "value": "true;GENEORPROTEIN-VARIANT"
}
```

### 5. Semantic types
Semantic type concepts are another category of concepts, grouped together by the semantic type of entities. When semantic type concepts are sent by customers to the Trial Matcher as part of the patient’s clinical info, there’s no need to concatenate the entity or semantic type of the entity to the value.

Example concept from neededClinicalInfo API response:
```json
{
    "category": "DIAGNOSIS",
    "semanticType": "T047",
    "system": "http://www.nlm.nih.gov/research/umls",
    "code": "C0014130",
    "name": "Endocrine System Diseases",
    "value": "EntityType:DIAGNOSIS"
}
```

Example mapping for the above category from UMLSConceptsMapping.json:
```json
"DIAGNOSIS,T047": {
    "name": "Diagnosis X Disease or Syndrome",
    "question": "Was the patient diagnosed with %p1%?",
    "answerType": "Boolean"
}
```

Example value sent to Trial Matcher for the above category:
```json
{
    "system": "http://www.nlm.nih.gov/research/umls",
    "code": "C0014130",
    "name": "Endocrine System Diseases",
    "value": "false"
}
```


## Next steps

To get started using the Trial Matcher model:

>[!div class="nextstepaction"]
> [Get started using the Trial Matcher model](./get-started.md) 