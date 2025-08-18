---
title: Radiology Insight inference information
titleSuffix: Azure AI Health Insights
description: This article provides Radiology Insights inference information for the complete scope.
services: azure-health-insights
author: JanSchietse
manager: JoeriVDV
ms.service: azure-health-insights
ms.topic: overview
ms.date: 04/04/2025
ms.author: JanSchietse
---


# Radiology Insights Inferences

## 1. Introduction

This document describes the semantics of JSON output for a processed medical document. 
The JSON is according to the OpenAPI schema. 
It might be useful to have this schema open when reading this document.

This document briefly describes the input that triggers the results. For more information, see the standards. Its purpose is to explain the meaning of the fields in the OpenAPI specifications.




## 2. Token extensions

Many inferences, and objects within inferences, have a field `extension` with an array of objects of type `extension`. Each such extension can be used to represent a token in the text that the inference pertains to. 
An example of such a token extension is:

```json
{
	"url": "http://hl7.org/fhir/StructureDefinition/derivation-reference",
	"extension": [
		{
			"url": "offset",
			"valueInteger": 137
		},
		{
			"url": "length",
			"valueInteger": 2
		},
		{
			"url": "reference",
			"valueReference": {
				"type": "documentId",
				"reference": "json_testinput1"
			}
		}
	]
}

```

The url value (""http://hl7.org/fhir/StructureDefinition/derivation-reference"") refers to the fact that this is an extension for a token. There can be other extensions too (see infra.)

The offset value ("137") is the position in the processed
text where the referred token starts.

The length value ("2") is the length of the token.

So, for example, if the word at position 137 and with length 2 (that is, between positions 137 and 139) is "an", then that is the token referred.

"json_testinput1" is the document ID. This is the same for all tokens in the json.

Find below the list of inferences in scope of Radiology Insights. 

- Age Mismatch
- Sex Mismatch
- Laterality Discrepancy
- Complete Order Discrepancy
- Limited Order Discrepancy
- Finding
- Critical Result
- Follow-up Recommendation
- Communication
- Radiology Procedure
- Scoring and Assessment
- Quality Measure
- Clinical Guidance


In the next section, a definition is provided and clicking on the inference name provides details.




## 3. Inference Overview
 
#### [AgeMismatchInference](age-mismatch-inference.md)

Annotation triggered when there's discrepancy between age information in meta-data and narrative text. 
 
#### [SexMismatchInference](sex-mismatch-inference.md) 

Annotation triggered when there's discrepancy between sex information in meta-data and narrative text (includes patient references, sex specific findings, and sex specific body parts). 

#### [LateralityMismatchInference](laterality-mismatch-inference.md)

Annotation triggered when there's a discrepancy between laterality information in meta-data and narrative text or between findings and impression section in report text. 

#### [FindingInference](finding-inference.md)  

Annotation that identifies and highlights an assembly of clinical information pertaining to a, clinically relevant, notion found in the report text. 

#### [CompleteOrderDiscrepancyInference](complete-order-discrepancy-inference.md)  

Annotation triggered when report text doesn't contain all relevant body parts according to information in the metadata that a complete study is ordered. 

#### [LimitedOrderDiscrepancyInference](limited-order-discrepancy-inference.md)  

Annotation triggered when limited selection of body parts according to the procedure order present in meta-data should be checked, but report text includes all relevant body parts. 

#### [FollowupCommunicationInference](communication-inference.md)  

Annotation that identifies and highlights when noted in report text that the findings are strict or nonstrictly communicated with the recipient. 

#### [FollowupRecommendationInference](recommendation-inference.md) 

Annotation that identifies and highlights one or more recommendations in the report text and provides a normalization of each recommendation to a set of structured data fields. 

#### [CriticalResultInference](critical-result-inference.md)  

Annotation that identifies and highlights findings in report text that should be communicated within a certain time limit according to regulatory compliance. 

#### [RadiologyProcedureInference](radiology-procedure-inference.md)  

Normalization of procedure order information present in meta-data using Loinc/Radlex codes. 

#### [ScoringAndAssessmentInference](scoring-and-assessment-inference.md)  

Risk scoring and assessment systems are used in medical imaging and diagnostics to standardize the evaluation and reporting of clinical findings. The model surfaces key scoring and assessment risks with values the radiologist dictates in a radiology note or report. 

#### [QualityMeasureInference](quality-measure-inference.md) 

The model evaluates if quality measure performance was met or not met when executing a medical procedure. The quality measure performance is explained by surfacing evidence from the document and/or lack of evidence from the document. 
 
#### [GuidanceInference](guidance-inference.md)

Clinical guidance can be considered as a decision tree, providing a structured approach of evidence-based guidelines (ACR Guidelines1 and Fleischner Society Guidelines2) to help healthcare providers make the most appropriate imaging or treatment decisions for clinical conditions. The model surfaces the key information from the documentation to feed the decision tree, as such to propose one or more candidate recommendations. 