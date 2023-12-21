---
title: Radiology Insight inference information
titleSuffix: Azure AI Health Insights
description: This article provides Onco-Phenotype inference information.
services: azure-health-insights
author: Jan Schietse
manager: JoeriVDV
ms.service: azure-health-insights
ms.topic: overview
ms.date: 12/12/2023
ms.author: JanSchietse
---


Inference information
- Age Mismatch
- Laterality Discrepancy
- Sex Mismatch
- Complete Order Discrepancy
- Limited Order Discrepancy
- Finding
- Critical Result
- follow-up Recommendation
- Communication
- Radiology Procedure


To interact with the Radiology-Insights model, you can provide several model configuration parameters that modify the outcome of the responses. One of the configurations is “inferenceTypes” which can be used if only part of the Radiology Insights inferences is required. If this list is omitted or empty, the model will return all the inference types.

```json
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
    "inferenceTypes" : [ "finding", "ageMismatch", "lateralityDiscrepancy", "sexMismatch", "completeOrderDiscrepancy", "limitedOrderDiscrepancy", "criticalResult", "followupRecommendation", "followupCommunication", "radiologyProcedure" ],
    "locale" : "en-US",
    "verbose" : false,
    "includeEvidence" : true
  }
```


**Age Mismatch**

An age mismatch occurs when the document gives a certain age for the patient, which differs from the age that is calculated based on the patient’s info birthdate and the encounter period in the request.  
- kind: RadiologyInsightsInferenceType.AgeMismatch;
- Request and json output: age_mm_textLimited

**Laterality Discrepancy**

A laterality mismatch is mostly flagged when the orderedProcedure is for a body part with a laterality (e.g. “x-ray right foot”) and the text refers to the opposite laterality (“e.g. “left foot is normal”.)
- kind: RadiologyInsightsInferenceType.LateralityDiscrepancy
- LateralityIndication: FHIR.R4.CodeableConcept
- DiscrepancyType: LateralityDiscrepancyType
    
There are 3 possible discrepancy types:
1.	“orderLateralityMismatch” means that the laterality in the text conflicts with the one in the order.
2.	“textLateralityContradiction” means that there is a body part with left or right in the finding section, and the same body part occurs with the opposite laterality in the impression section.
3.	“textLateralityMissing” means that the laterality mentioned in the order never occurs in the text.


The lateralityIndication is a FHIR.R4.CodeableConcept. There are 2 possible values (snomed codes):
1. 20028007: RIGHT (QUALIFIER VALUE)
2. 7771000: LEFT (QUALIFIER VALUE)

The meaning of this field is as follows:
-	For orderLateralityMismatch: this is the concept in the text that the laterality was flagged for.
-	For textLateralityContradiction: this is the concept in the impression section that the laterality was flagged for.
-	For “textLateralityMissing”, this is not filled in.

A mismatch with discrepancy type “textLaterityMissing” has no token extensions.

Request and json output: lat_mm_textLimited


**Sex Mismatch**
This mismatch occurs when the document gives a different sex for the patient than stated in the patient’s info in the request. If the patient info contains no sex, then the mismatch can also be flagged when there is contradictory language about the patient’s sex in the text.
- kind: RadiologyInsightsInferenceType.SexMismatch
- sexIndication: FHIR.R4.CodeableConcept  
Field “sexIndication” will contain one coding with a snomed concept for either MALE (FINDING) if the document refers to a male or FEMALE (FINDING) if the document refers to a female:
1. 248153007 : MALE (FINDING)
2. 248152002 : FEMALE (FINDING)

Request and json output: RadInsights_Example1Limited

**Complete Order Discrepancy**
CompleteOrderDiscrepancy is created if there is a complete orderedProcedure - meaning that a certain amount of body parts need to be mentioned in the text, and possibly also measurements for some of them - and not all the body parts or their measurements are in the text.
- kind: RadiologyInsightsInferenceType.CompleteOrderDiscrepancy  
- orderType: FHIR.R4.CodeableConcept 
- MissingBodyParts: Array FHIR.R4.CodeableConcept
- missingBodyPartMeasurements: Array FHIR.R4.CodeableConcept
        
Field “ordertype” contains one Coding, with one of the following CPT codes:
- 76700 : ULTRASOUND, ABDOMINAL, REAL TIME WITH IMAGE DOCUMENTATION; COMPLETE
- 76856 : ULTRASOUND, PELVIC (NONOBSTETRIC), REAL TIME WITH IMAGE DOCUMENTATION; COMPLETE
- 76770 : ULTRASOUND, RETROPERITONEAL (EG, RENAL, AORTA, NODES), REAL TIME WITH IMAGE DOCUMENTATION; COMPLETE
- 76641 : ULTRASOUND BREAST COMPLETE

Fields “missingBodyParts” and/or “missingBodyPartsMeasurements” contain body parts (radlex codes) that are missing or whose measurements are missing. The token extensions refer to body parts or measurements that are present (or words that imply them.)
        
Request and json output: compl_mismatchLimited
        
**Limited Order Discrepancy**

        
This is created if there is a limited order, meaning that not all body parts and measurements for a corresponding complete order should be in the text– but all body parts and measurements for the complete order are present in the text.
- kind: RadiologyInsightsInferenceType.LimitedOrderDiscrepancy 
- orderType: FHIR.R4.CodeableConcept 
- PresentBodyParts: Array FHIR.R4.CodeableConcept
- PresentBodyPartMeasurements: Array FHIR.R4.CodeableConcept
        
Field “ordertype” contains one Coding, with one of the following CPT codes:
- 76705 : ULTRASOUND, ABDOMINAL, REAL TIME WITH IMAGE DOCUMENTATION; LIMITED (EG, SINGLE ORGAN, QUADRANT, FOLLOW-UP)
- 76857 : ULTRASOUND, PELVIC, REAL TIME WITH IMAGE DOCUMENTATION; LIMITED OR FOLLOW-UP
- 76775 : ULTRASOUND, RETROPERITONEAL (EG, RENAL, AORTA, NODES), REAL TIME WITH IMAGE DOCUMENTATION; LIMITED
- 76642 : ULTRASOUND BREAST LIMITED
Fields “presentBodyParts” and/or “presentBodyPartsMeasurements” contain body parts (radlex codes) that are present or whose measurements are present. The token extensions refer to body parts or measurements that are present (or words that imply them.)
        
Request and json output: compl_mismatch3Limited

**Finding**

This is usually created for a medical problem (e.g. “acute infection of the lungs”), but also for a characteristic or a non-pathologic finding of a body part (e.g. “stomach normal”).
- kind: RadiologyInsightsInferenceType.finding
- finding: FHIR.R4.Observation
        
Finding: Section and ci_sentence
Next to the token extensions, there can be an extension with url “section”. This extension has an inner extension with a display name that describes the section. The inner extension can also have a loinc code.
There can also be an extension with url “ci_sentence”. This refers to the sentence containing the first token of the clinical indicator (i.e., the medical problem), if any. The generation of such a sentence is switchable, it will only be switched on for customer Powerscribe or mPower.

Finding: fields within field “finding”
These are the fields within field “finding”, except “component”:
- status: is always set to “unknown”
- resourceType: is always set to "Observation”
- interpretation: contains a sublist of the following snomed codes:
- 7147002 : NEW (QUALIFIER VALUE)
- 36692007 : KNOWN (QUALIFIER VALUE)
- 260413007 : NONE (QUALIFIER VALUE)
- 260385009 : NEGATIVE (QUALIFIER VALUE)
- 723506003 : RESOLVED (QUALIFIER VALUE)
- 64957009 : UNCERTAIN (QUALIFIER VALUE)
- 385434005 : IMPROBABLE DIAGNOSIS (CONTEXTUAL QUALIFIER) (QUALIFIER VALUE)
- 60022001 : POSSIBLE DIAGNOSIS (CONTEXTUAL QUALIFIER) (QUALIFIER VALUE)
- 2931005 : PROBABLE DIAGNOSIS (CONTEXTUAL QUALIFIER) (QUALIFIER VALUE)
- 15841000000104 : CANNOT BE EXCLUDED (QUALIFIER VALUE)
- 260905004 : CONDITION (ATTRIBUTE)
- 441889009 : DENIED (QUALIFIER VALUE)
- 722291000000108 : HISTORY (QUALIFIER VALUE)
- 6493001 : RECENT (QUALIFIER VALUE)
- 2667000 : ABSENT (QUALIFIER VALUE)
- 17621005 : NORMAL (QUALIFIER VALUE)
- 263730007 : CONTINUAL (QUALIFIER VALUE)

In this list, the string before the colon is the code, and the string after the colon is the display name.
If the value is “NONE (QUALIFIER VALUE)”, this means the finding is absent. This is for e.g., “no sepsis”.
category: if filled, this has an array with one element. It contains one of the following snomed concepts:
- 439401001 : DIAGNOSIS (OBSERVABLE ENTITY)
- 404684003 : CLINICAL FINDING (FINDING)
- 162432007 : SYMPTOM: GENERALIZED (FINDING)
- 246501002 : TECHNIQUE (ATTRIBUTE)
- 91722005 : PHYSICAL ANATOMICAL ENTITY (BODY STRUCTURE)

code: this is either snomed code 404684003 : CLINICAL FINDING (FINDING) (meaning that the finding has a clinical indicator) or 123037004 : BODY STRUCTURE (BODY STRUCTURE) (no clinical indicator.)

Finding: field “component”
Much relevant information is in the components. The kind of information in a component is determined by the component’s “code” field, which contains one CodeableConcept with one snomed code.

We will now describe the different kinds of components. Not all of these are always filled in.

Finding: component “subject of information”
This component has snomed code 131195008 : SUBJECT OF INFORMATION (ATTRIBUTE) . It also has the “valueCodeableConcept” field filled. The value is a snomed code describing the medical problem that the finding pertains to.
At least one “subject of information” component is present if and only if the “finding.code” field has 404684003 : CLINICAL FINDING (FINDING). There can be several "subject of information” components, with different concepts in the “valueCodeableConcept” field.

Finding: component “anatomy”
Zero or more components with snomed code “722871000000108: ANATOMY (QUALIFIER VALUE)”. This component has field “valueCodeConcept” filled with a snomed or radlex code. E.g., for “lung infection” this will have a code for the lungs.

Finding: component “region”
Zero or more components with snomed code 45851105 : REGION (ATTRIBUTE). Like anatomy, this component has field “valueCodeableConcept” filled with a snomed or radlex code. Such a concept refers to the body region of the anatomy. E.g., if the anatomy is a code for the vagina, the region may be a code for the female reproductive system.

Finding: component “laterality”
Zero or more components with code 45651917 : LATERALITY (ATTRIBUTE). Each has field “valueCodeableConcept” set to a snomed concept pertaining to the laterality of the finding. E.g., this will be filled for a finding pertaining to the right arm.

Finding: component “change values”
Zero or more components with code 288533004 : CHANGE VALUES (QUALIFIER VALUE). Each has field “valueCodeableConcept” set to a snomed concept pertaining to a size change in the finding (e.g., a nodule that is growing or decreasing.)

Finding: component “percentage”
At most one component with code 45606679 : PERCENT (PROPERTY) (QUALIFIER VALUE). It has field “valueString” set with either a value or a range consisting of a lower and upper value, separated by “-“.

Finding: component “severity”
At most one component with code 272141005 : SEVERITIES (QUALIFIER VALUE), indicating how severe the medical problem is. It has field “valueCodeableConcept” set with a snomed code from the following list:
- 255604002 : MILD (QUALIFIER VALUE)
- 6736007 : MODERATE (SEVERITY MODIFIER) (QUALIFIER VALUE)
- 24484000 : SEVERE (SEVERITY MODIFIER) (QUALIFIER VALUE)
- 371923003 : MILD TO MODERATE (QUALIFIER VALUE)
- 371924009 : MODERATE TO SEVERE (QUALIFIER VALUE)

Finding: component “chronicity”
At most one component with code 246452003 : CHRONICITY (ATTRIBUTE), indicating whether the medical problem is chronic or acute. It has field “valueCodeableConcept” set with a snomed code from the following list:
- 255363002 : SUDDEN (QUALIFIER VALUE)
- 90734009 : CHRONIC (QUALIFIER VALUE)
- 19939008 : SUBACUTE (QUALIFIER VALUE)
- 255212004 : ACUTE-ON-CHRONIC (QUALIFIER VALUE)

Finding: component “cause”
At most one component with code 135650694 : CAUSES OF HARM (QUALIFIER VALUE), indicating what the cause is of the medical problem. It has field “valueString” set to the strings of one or more tokens from the text, separated by “;;”.

Finding: component “qualifier value”
Zero or more components with code 362981000 : QUALIFIER VALUE (QUALIFIER VALUE). This refers to a feature of the medical problem.
Every component has either:
-	Field “valueString” set with token strings from the text, separated by “;;”
-	Or field “valueCodeableConcept” set to a snomed code
-	Or no field set (then the meaning can be retrieved from the token extensions; this should not happen often in practice, but it is theoretically possible)

Finding: component “multiple”
Exactly one component with code 46150521 : MULTIPLE (QUALIFIER VALUE). It has field “valueBoolean” set to true or false. This indicates the difference between, e.g., one nodule (multiple is false) or several nodules (multiple is true). This has no token extensions.

Finding: component “size”
Zero or more components with code 246115007", "SIZE (ATTRIBUTE). Even if there is just one size for a finding, there are several components if the size has 2 or 3 dimensions, e.g., “2.1 x 3.3 cm” or “1.2 x 2.2 x 1.5 cm”. There will be a size component for every dimension.
Every component has field “interpretation” set to either snomed code 15240007 : CURRENT or 9130008 : PREVIOUS, depending on whether the size was measured during this visit or in the past.
Every component has either field “valueQuantity” or “valueRange” set.
If “valueQuantity” is set, then “valueQuantity.value” is always set. In most cases, “valueQuantity.unit” will also be set. It is possible that “valueQuantity.comparator” is also set, to either “>”, “<”, “>=” or “<=”. E.g., This will be set to “<=” for “the tumor is up to 2 cm”.
If “valueRange” is set, then “valueRange.low” and “valueRange.high” are set to quantities with the same data as described in the previous paragraph. This is for e.g., “The tumor is between 2.5 cm and 2.6 cm in size.

**Critical Result**
This is made for a new medical problem that requires attention within a specific time frame, possibly urgently.
- kind: RadiologyInsightsInferenceType.criticalResult
- result: CriticalResult

Field “result.description” gives a description of the medical problem, e.g. “MALIGNANCY”.
Field “result.finding”, if set, contains the same information as the “finding” field in a finding inference (see above).

Next to token extensions, there can be an extension for a section. This is the most specific section that the first token of the critical result is in (or to be precise, the first token that is in a section.) This section is in the same format as a section for a finding (see above.)

Request and json output: recommendation_textCRLimited

**Follow-up Recommendation**

This is created when the text recommends a specific medical procedure or follow-up for the patient.
- kind: RadiologyInsightsInferenceType.FollowupRecommendation
- effectiveDateTime: utcDateTime
- effectivePeriod: FHIR.R4.Period
- Findings: Array RecommendationFinding
- isConditional: boolean
- isOption: boolean
- isGuideline: boolean
- isHedging: boolean

recommendedProcedure: ProcedureRecommendation
- follow up Recommendation: sentences
Next to the token extensions, there can be an extension containing sentences. This behavior is switchable; the sentences will only be generated if the customer is mPower or Powerscribe.
- follow up Recommendation: boolean fields
“isHedging” means that the recommendation is uncertain, e.g., “a follow-up could be done”. “isConditional” is for input like “If the patient continues having pain, an MRI should be performed.”
“isOptions”: is also for conditional input
“isGuideline” means that the recommendation is in a general guideline like the following:

BI-RADS CATEGORIES: (0)Incomplete: Needs additional imaging evaluation (1)Negative (2)Benign (3)Probably benign - Short interval follow-up suggested (4)Suspicious abnormality - Biopsy should be considered (5)Highly suggestive of malignancy - Appropriate action should be taken. (6)Known biopsy-proven malignancy

- follow up Recommendation: effectiveDateTime and effectivePeriod
Field “effectiveDateTime” will be set when the procedure is recommended to be done at a specific point in time, e.g., “next Wednesday”. Field “effectivePeriod” will be set if a specific period is mentioned, with a start and end datetime. E.g., for “within 6 months”, the start datetime will be the date of service, and the end datetime will be the day six months after that.
- follow up Recommendation: findings
If set, field “findings” contains one or more findings that have to do with the recommendation. E.g., a leg scan (procedure) can be recommended because of leg pain (finding).
Every array element of field “findings” is a RecommendationFinding. Field RecommendationFinding.finding has the same information as a FindingInference.finding field (see above).
For field “RecommendationFinding.RecommendationFindingStatus”, see the open api specification for the possible values.
Field “RecommendationFinding.criticalFinding” is set if a critical result is associated with the finding (see section above.) It then contains the same information as described for a critical result inference.
- follow up Recommendation: recommended procedure
Field “recommendedProcedure” is either a GenericProcedureRecommendation, or an ImagingProcedureRecommendation. (Type “procedureRecommendation” given above is a supertype for these 2 types.)
A GenericProcedureRecommendation has the following:
-	Field “kind” has value “genericProcedureRecommendation”
-	Field “description” has either value “MANAGEMENT PROCEDURE (PROCEDURE)” or “CONSULTATION (PROCEDURE)”
-	Field “code” only contains an extension with tokens
        An ImagingProcedureRecommendation has the following:
-	Field “kind” has value “imagingProcedureRecommendation”
-	Field “imagingProcedures” contains an array with one element of type ImagingProcedure. 

This type has the following fields, the first 2 of which are always filled:
1. “modality”: a CodeableConcept containing at most one coding with a snomed code.
2. “anatomy”: a CodeableConcept containing at most one coding with a snomed code.
3. “laterality: a CodeableConcept containing at most one coding with a snomed code.
4. “contrast”: this is currently not set.
5. “view”: this is currently not set.

**follow up Communication**

This is created when findings or test results were communicated to a medical professional.
- kind: RadiologyInsightsInferenceType.FollowupCommunication
- dateTime: Array utcDateTime
- recipient: Array MedicalProfessionalType
- wasAcknowledged: boolean
        
Field “wasAcknowledged” is set to true if the communication was verbal (non-verbal communication might not have reached the recipient yet and can therefore not be considered acknowledged.) Field “dateTime” is set if the date-time of the communication is known. Field “recipient” is set if the recipient(s) are known. See the open api spec for its possible values.

Request and json output: CommunicationTestLimited

**Radiology Procedure**

This is for the ordered radiology procedure(s).
- kind: RadiologyInsightsInferenceType.RadiologyProcedure
- procedureCodes: Array FHIR.R4.CodeableConcept
- imagingProcedures: Array ImagingProcedure
- orderedProcedure: OrderedProcedure
        
Field “imagingProcedures” contains one or more instances of an imaging procedure, as documented for the follow up recommendations (see above).
Field “procedureCodes”, if set, contains loinc codes.
Field “orderedProcedure” contains the description(s) and the code(s) of the ordered procedure(s) as given by the client. The descriptions are in field “orderedProcedure.description”, separated by “;;”. The codes are in “orderedProcedure.code.coding”. In every coding in the array, only field “coding” is set.
        
Request and json output: ContrastMismatch1Limited

## Next steps

To get better insights into the request and responses, read more on following page:

>[!div class="nextstepaction"]
> [Model configuration](model-configuration.md)
