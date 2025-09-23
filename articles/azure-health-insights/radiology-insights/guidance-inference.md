---
title: Radiology Insight inference information (guidance)
titleSuffix: Azure AI Health Insights
description: This article provides Radiology Insights inference information (guidance).
services: azure-health-insights
author: JanSchietse
manager: JoeriVDV
ms.service: azure-health-insights
ms.topic: overview
ms.date: 04/04/2025
ms.author: JanSchietse
---

# GuidanceInference


[Back to overview of RI Inferences](inferences.md)


A `guidance inference` is tied to a finding inference (see [finding inference](finding-inference.md).) The ACR (American College of Radiology) determines the guidelines for which findings a `guidance` is made.
A `guidance` can include suppressors, which are aspects of the finding for which one or more values were found in the text, for example, a size. These suppressor values often overlap with the information in the finding. However, the code that generates the guidance sometimes identifies suppressors that aren't present in the finding.  
- Field `kind` is `guidance`.  
- Field `finding` is a finding inference. (see [finding inference](finding-inference.md).)  
- Field `identifier` is a CodeableConcept containing either a SNOMED code or a RadLex code. This concept represents the type of the guidance. See [Appendix A](#appendix-a-possible-codes-for-field-identifier) for the possible codes for `identifier`.  
- Field `ranking` has either value "high" or "low." 
It  indicates how important the guidance is compared to other `guidances` in the document with the same `identifier`.  
- Field `recommendationProposals`, if filled, contains recommendation inferences. See [recommendation inference](recommendation-inference.md). These recommendations are based on the information in `finding` and `presentGuidanceInformation` (see infra.) For a recommendation in this field, an image procedure's modality can be SNOMED code 266750002 ("NO FOLLOW-UP ARRANGED (FINDING)") which means that no follow-up procedure is needed. (This code doesn't occur for normal recommendation inferences outside of guidances.) 
- Field `presentGuidanceInformation`, if filled, contains one or more instances of PresentGuidanceInformation, each of which corresponds to a suppressor. See the next section.  
- Field `missingGuidanceInformation`, if filled, contains suppressor strings (the same kind of strings as in PresentGuidanceInformation.presentGuidanceItem, see the next section.) They're the suppressor strings for which no value is found, and for which the text would need to provide a value to enable the code to make a recommendation.  
Fields `kind`, `finding`, `identifier`, and `ranking` are mandatory. 

Example of a `guidance`, without extensions and without the real contents of the `finding` field:
```json
{
	"kind": "guidance",
	"finding": "<finding inference not shown>",
	"identifier": {
		"coding": [
			{
				"system": "http://radlex.org",
				"code": "RID50503",
				"display": "TI-RADS ASSESSMENT"
			}
		]
	},
	"presentGuidanceInformation": [
		{
			"presentGuidanceItem": "MAX DIAMETER",
			"sizes": [
				{
					"resourceType": "Observation",
					"component": [
						{
							"code": {
								"coding": [
									{
										"system": "http://radlex.org",
										"code": "246115007",
										"display": "SIZE (ATTRIBUTE)"
									}
								]
							},
							"valueQuantity": {
								"value": 5.0,
								"unit": "MILLIMETER"
							},
							"interpretation": [
								{
									"coding": [
										{
											"code": "15240007",
											"display": "CURRENT"
										}
									]
								}
							]
						}
					]
				}
			],
			"presentGuidanceValues": [
				"MAX DIAMETER"
			]
		},
		{
			"presentGuidanceItem": "SIZE",
			"sizes": [
				{
					"resourceType": "Observation",
					"component": [
						{
							"code": {
								"coding": [
									{
										"system": "http://radlex.org",
										"code": "246115007",
										"display": "SIZE (ATTRIBUTE)"
									}
								]
							},
							"valueQuantity": {
								"value": 5.0,
								"unit": "MILLIMETER"
							},
							"interpretation": [
								{
									"coding": [
										{
											"code": "15240007",
											"display": "CURRENT"
										}
									]
								}
							]
						}
					]
				}
			],
			"presentGuidanceValues": [
				"SIZE"
			]
		},
		{
			"presentGuidanceItem": "COMPOSITION",
			"presentGuidanceValues": [
				"CYSTIC OR ALMOST COMPLETELY CYSTIC"
			]
		},
		{
			"presentGuidanceItem": "SOLITARY OR MULTIPLE",
			"presentGuidanceValues": [
				"MULTIPLE"
			]
		}
	],
	"ranking": "high",
	"missingGuidanceInformation": [
		"ECHOGENICITY",
		"SHAPE",
		"MARGIN",
		"ECHOGENIC FOCI"
	]
}
```

## PresentGuidanceInformation

Field `presentGuidanceItem` is a String that represents a kind of information, for example, "SIDE" or "SIZE."  
Field `presentGuidanceValues`, if filled, contain one or more value Strings. For example, for presentGuidanceItem "SIDE" it could be "LEFT" or "RIGHT."  
Field `sizes` is filled if the presentGuidanceItem refers to a size. It contains an array of FHIR.R4. Observation, but this array has at most one element. This Observation element then has the sizes information in its components, in the same format as for findings. See [finding inference](finding-inference.md).  
Field `maximumDiameterAsInText` is filled if the presentGuidanceItem refers to a maximum diameter. Fields `value` and `unit` should be set.  
Only field `presentGuidanceItem` is mandatory, but one of the other three fields should also be filled.  


## Appendix A: possible codes for field "identifier"

| System | Code | Display |
|---|---|---|
| SNOMED | 445039006 | MASS OF UTERINE ADNEXA (FINDING) |
| SNOMED | 237783006 | MASS OF ADRENAL GLAND (FINDING) |
| SNOMED | 39400004 | INJURY OF LIVER (DISORDER) |
| SNOMED | 300331000 | LESION OF LIVER (FINDING) |
| SNOMED | 363358000 | MALIGNANT TUMOR OF LUNG (DISORDER) |
| SNOMED | 61823004 | INJURY OF PANCREAS (DISORDER) |
| SNOMED | 79131000119100 | KIDNEY LESION (FINDING) |
| SNOMED | 23589004 | INJURY OF SPLEEN (DISORDER) |
| SNOMED | 40095003 | INJURY OF KIDNEY (DISORDER) |
| SNOMED | 237495005 | THYROID NODULE (DISORDER) |
| SNOMED | 233985008 | ABDOMINAL AORTIC ANEURYSM (DISORDER) |
| SNOMED | 858901000000108 | PREGNANCY OF UNKNOWN LOCATION (DISORDER) |
| SNOMED | 289208006 | FINDING OF VIABILITY OF PREGNANCY (FINDING) |
| SNOMED | 363351006 | MALIGNANT TUMOR OF RECTUM (DISORDER) |
| SNOMED | 364327007 | VIABILITY OF PREGNANCY (OBSERVABLE ENTITY) |
| SNOMED | 97171000119100 | CYST OF UTERINE ADNEXA (DISORDER) |
| SNOMED | 31258000 | CYST OF PANCREAS (DISORDER) |
| SNOMED | 276650005 | PERINATAL SUBEPENDYMAL HEMORRHAGE (DISORDER) |
| SNOMED | 300346007 | LESION OF GALLBLADDER (FINDING) |
| SNOMED | 399244003 | DISORDER OF PITUITARY GLAND (DISORDER) |
| SNOMED | 289840004 | LESION OF OVARY (FINDING) |
| RADLEX | RID50149 | PULMONARY NODULE |
| RADLEX | RID50503 | TI-RADS ASSESSMENT |
| RADLEX | RID50134 | LUNG-RADS ASSESSMENT |

## Appendix B: Overview of supported guidance inferences grouped by guideline
**ACR Appropriateness Criteria**  
These guidelines assist healthcare providers in making the most appropriate imaging or treatment decisions for specific clinical conditions:  
https://www.acr.org/Clinical-Resources/Clinical-Tools-and-Reference/Appropriateness-Criteria

| Guidance | SNOMED/RADLEX | Code | White paper reference |
|---|---|---|---|
| Abdominal Aortic Aneurysm* | SNOMED | 233985008 | Khosa, F., Krinsky, G., Macari, M., Yucel, E. K., & Berland, L. L. (2013). Managing Incidental Findings on Abdominal and Pelvic CT and MRI, Part 2: White Paper of the ACR Incidental Findings Committee II on Vascular Findings. Journal of the American College of Radiology, 10(10), 789-794. doi: 10.1016/j.jacr.2013.05.021 |
| Gallbladder and Biliary tract* | SNOMED | 300346007 | Sebastian, S., Araujo, C., Neitlich, J. D., & Berland, L. L. (2013). Managing Incidental Findings on Abdominal and Pelvic CT and MRI, Part 4: White Paper of the ACR Incidental Findings Committee II on Gallbladder and Biliary Findings. Journal of the American College of Radiology, 10(12), 953-956. doi: 10.1016/j.jacr.2013.05.022 |
| Germinal Matrix Hemorrhage* | SNOMED | 276650005 | Bowerman RA, Donn SM, Silver TM, Jaffe MH. Natural History of Neonatal Periventricular/Intraventricular Hemorrhage and Its Complications: Sonographic Observations. AJNR Am J Neuroradiol. 1984;5(5):527-538; Brouwer AJ, Groenendaal F, Benders MJNL, de Vries LS. Early and late complications of germinal matrix hemorrhage-intraventricular hemorrhage in the preterm infant: what is new? Neonatology. 2014;106(4):296-303. doi: 10.1159/000365127 |
| Lung Cancer Staging | SNOMED | 363358000 |Amin MB, Edge SB, Greene FL, et al. AJCC Cancer Staging Manual, 8th Edition. Switzerland: Springer; 2017:431-455 |
| Pregnancy Location* | SNOMED | 858901000000108 | Doubilet PM, Benson CB, Bourne T, Blaivas M. Diagnostic Criteria for Nonviable Pregnancy Early in the First Trimester. N Engl J Med. 2013;369(15):1443-1451. doi: 10.1056/NEJMra1302417 |
| Pregnancy Viability Initial* | SNOMED | 289208006 | Doubilet PM, Benson CB, Bourne T, Blaivas M. Diagnostic Criteria for Nonviable Pregnancy Early in the First Trimester. N Engl J Med. 2013;369(15):1443-1451. doi: 10.1056/NEJMra1302417 |
| Pregnancy Viability Follow-up* | SNOMED | 364327007 | Doubilet PM, Benson CB, Bourne T, Blaivas M. Diagnostic Criteria for Nonviable Pregnancy Early in the First Trimester. N Engl J Med. 2013;369(15):1443-1451. doi: 10.1056/NEJMra1302417 |
| Rectal Cancer Staging | SNOMED | 363351006 | Al-Sukhni E, Milot L, Fruitman M, Brown G, Schmocker S, Kennedy E. User’s Guide for the Synoptic MRI Report for Pre-Operative Staging of Rectal Cancer. Cancer Care Ontario; 2015. |

**ACR Incidental Findings**  
These guidelines provide recommendations for managing incidental findings discovered during imaging studies performed for unrelated reasons:  
https://www.acr.org/Clinical-Resources/Clinical-Tools-and-Reference/Incidental-Findings

| Guidance | SNOMED/RADLEX | Code | White paper reference |
|---|---|---|---|
| Adnexal cyst* | SNOMED | 97171000119100 | Levine D, Brown DL, Andreotti RF, et al. Recommendations for adnexal cyst follow-up per Society of Radiologists in Ultrasound 2009 consensus statement on management of asymptomatic ovarian and other adnexal cysts. Radiology. 2010;256(3):943-954. doi: 10.1148/radiol.10100213 |
| Adnexal mass* | SNOMED | 445039006 | Patel MD, Ascher SM, Paspulati RM, Shanbhogue AK, Siegelman ES, Stein MW, Berland LL. Managing Incidental Findings on Abdominal and Pelvic CT and MRI, Part 1: White Paper of the ACR Incidental Findings Committee II on Adnexal Findings. J Am Coll Radiol. 2013;10(9):675-681. doi: 10.1016/j.jacr.2013.05.023 |
| Adrenal nodule* | SNOMED | 237783006 | Mayo-Smith WW, Song JH, Boland GL, et al. Management of Incidental Adrenal Masses: A White Paper of the ACR Incidental Findings Committee. J Am Coll Radiol. 2017;14(8):1038-1044. doi: 10.1016/j.jacr.2017.05.001 |
| Liver lesion* | SNOMED | 300331000 | Berland LL, Silverman SG, Gore RM, et al. Managing Incidental Findings on Abdominal CT: White Paper of the ACR Incidental Findings Committee. J Am Coll Radiol. 2010;7(10):754-773. doi: 10.1016/j.jacr.2010.06.013 |
| Pancreatic cyst* | SNOMED | 31258000 | Megibow AJ, Baker ME, Morgan DE, et al. Management of Incidental Pancreatic Cysts: A White Paper of the ACR Incidental Findings Committee. J Am Coll Radiol. 2017;14(8):911-923. doi: 10.1016/j.jacr.2017.05.001 |
| Pituitary* | SNOMED | 399244003 | Hoang JK, Hoffman AR, González RG, et al. Management of Incidental Pituitary Findings on CT, MRI, and 18F-Fluorodeoxyglucose PET: A White Paper of the ACR Incidental Findings Committee. J Am Coll Radiol. 2018;15(7):966-972. doi: 10.1016/j.jacr.2018.03.037 |
| Renal lesion* | SNOMED | 79131000119100 | Herts BR, Silverman SG, Hindman NM, et al. Management of the Incidental Renal Mass on CT: A White Paper of the ACR Incidental Findings Committee. J Am Coll Radiol. 2018;15(2):264-273. doi: 10.1016/j.jacr.2017.05.001 |
| Thyroid nodule*| SNOMED | 237495005 | Hoang JK, Langer JE, Middleton WD, et al. Managing incidental thyroid nodules detected on imaging: white paper of the ACR Incidental Thyroid Findings Committee. J Am Coll Radiol. 2015;12(2):143-150. doi: 10.1016/j.jacr.2014.09.038 |

**RADS (Reporting and Data Systems)**  
Reporting and Data Systems are standardized systems for reporting and data management in radiology, focusing on specific conditions and imaging modalities:  
https://www.acr.org/Clinical-Resources/Clinical-Tools-and-Reference/Reporting-and-Data-Systems

| Guidance | SNOMED/RADLEX | Code | White paper reference |
|---|---|---|---|
| Lung-RADS | RADLEX | RID50134 | Kazerooni EA, Austin JHM, Black WC, et al. ACR-STR Practice Parameter for the Performance and Reporting of Lung Cancer Screening Thoracic Computed Tomography (Resolution 4). J Thorac Imaging. 2014;29(5):310-316. doi: 10.1097/RTI.0000000000000097 |
| TI-RADS*| RADLEX | RID50503 | Tessler FN, Middleton WD, Grant EG, et al. White Paper of the ACR TI-RADS Committee. J Am Coll Radiol. 2017;14(5):587-595. doi: 10.1016/j.jacr.2017.01.046 |

**Trauma and Injury Grading (American Association for the Surgery of Trauma (AAST))**  
These guidelines provide standardized grading systems for assessing the severity of injuries:
https://www.aast.org/resources-detail/injury-scoring-scale

| Guidance | SNOMED/RADLEX | Code | White paper reference |
|---|---|---|---|
| Hepatic trauma | SNOMED | 39400004 | Tinkoff G, Esposito TJ, Reed J, et al. American Association for the Surgery of Trauma Organ Injury Scale I: Spleen, Liver, and Kidney, Validation Based on the National Trauma Data Bank. J Trauma. 2008;64(2):204-210. doi: 10.1097/TA.0b013e31815b847a |
| Pancreatic Injury Grading | SNOMED | 61823004 | Tinkoff G, Esposito TJ, Reed J, et al. American Association for the Surgery of Trauma Organ Injury Scale I: Spleen, Liver, and Kidney, Validation Based on the National Trauma Data Bank. J Trauma. 2008;64(2):204-210. doi: 10.1097/TA.0b013e31815b847a |
| Renal Injury Grading | SNOMED | 40095003 | Tinkoff G, Esposito TJ, Reed J, et al. American Association for the Surgery of Trauma Organ Injury Scale I: Spleen, Liver, and Kidney, Validation Based on the National Trauma Data Bank. J Trauma. 2008;64(2):204-210. doi: 10.1097/TA.0b013e31815b847a |
| Splenic Injury Grading | SNOMED | 23589004 | Tinkoff G, Esposito TJ, Reed J, et al. American Association for the Surgery of Trauma Organ Injury Scale I: Spleen, Liver, and Kidney, Validation Based on the National Trauma Data Bank. J Trauma. 2008;64(2):204-210. doi: 10.1097/TA.0b013e31815b847a |

**Fleischner society guidelines**

| Guidance | SNOMED/RADLEX | Code | White paper reference |
|---|---|---|---|
| Pulmonary nodule* | RADLEX | RID50149 | MacMahon H, Naidich D, Goo J et al. Guidelines for Management of Incidental Pulmonary Nodules Detected on CT Images: From the Fleischner Society 2017. Radiology. 2017;284(1):228-43. doi: 10.1148/radiol.2017161659 - PubMed |

\* RecommendationProposal is applicable

Examples Request/Response JSON:

[!INCLUDE [Example input json](../includes/example-inference-guidance-json-request.md)]

[!INCLUDE [Example output json](../includes/example-inference-guidance-json-response.md)]
