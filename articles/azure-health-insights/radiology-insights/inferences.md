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


# Radiolody Insights Inferences

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
- Laterality Discrepancy
- Sex Mismatch
- Complete Order Discrepancy
- Limited Order Discrepancy
- Finding
- Critical Result
- follow-up Recommendation
- Communication
- Radiology Procedure

- Scoring and Assessment
- Quality Measure
- Guidance


In the next section, a definition is provided and clicking on the inference name provides details.




## 3. Inference Overview
 
#### [AgeMismatchInference](age-mismatch-inference.md)

Annotation triggered when there's discrepancy between age information in meta-data and narrative text. 
 
#### [SexMismatchInference](sex-mismatch-inference.md) 

Annotation triggered when there's discrepancy between sex information in meta-data and narrative text (includes patient references, sex specific findings, and sex specific body parts). 

#### [LateralityMismatchInference](laterality-mismatch-inference.md)

Annotation triggered when there's a discrepancy between laterality information in meta-data and narrative text or between findings and impression section in report text.