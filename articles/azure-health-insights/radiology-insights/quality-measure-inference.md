---
title: Radiology Insight inference information (quality measure)
titleSuffix: Azure AI Health Insights
description: This article provides Radiology Insights inference information (quality measure).
services: azure-health-insights
author: JanSchietse
manager: JoeriVDV
ms.service: azure-health-insights
ms.topic: overview
ms.date: 04/04/2025
ms.author: JanSchietse
---

# QualityMeasureInference


[Back to overview of RI Inferences](inferences.md)


Quality Measure corresponds to a MIPS ("merit based payment incentive") result. 
As described in the standards, a specific concept in the document, such as an incidental pulmonary nodule, triggers a MIPS measure. 
The result can be `performanceMet`, `performanceNotMet`, `denominatorException`, or `notEligible`. 
For example, if there's an incidental pulmonary nodule, the text should contain a follow-up recommendation for the result to be `performanceMet`. 
If the required text isn't present but there's an explanation (for example, the patient has unexplained fever), the result is `denominatorException`. 
If the follow-up recommendation is missing without a valid explanation, the result is `performanceNotMet`. 
Finally, `notEligible` applies if the code was configured to make a mips result for a specific trigger (for example, incidental pulmonary nodule) but the trigger wasn't in the text. 
It's determined by option "measureTypes" in "QualityMeasureOptions" (see the [model configuration](model-configuration.md)) for which triggers a MIPS result will be searched. The possible values of array measureTypes can be found in the description of this option in the [model configuration](model-configuration.md), or under "QualityMeasureType" in the OpenAPI specification.
- Field "kind" has value `qualityMeasure`.  
- Field `qualityMeasureDenominator` has the MIPS kind, for example "INCIDENTAL PULMONARY NODULE".  
- Field `complianceType` has either value `notEligible`, `performanceNotMet`, `performanceMet`, or `denominatorException`.
- Field `qualityCriteria` contains strings that correspond to document substrings supporting result `performanceMet` or `denominatorException`. Even for result `performanceNotMet` it might contain strings, but not enough to support result `performanceMet` or `denominatorException`. These strings are normalized, so in most cases they aren't exactly the same as substrings from the document.  
All fields are mandatory, except `qualityCriteria`.  

Example of a quality measure (without extensions):

```json
{
	"kind": "qualityMeasure",
	"qualityMeasureDenominator": "INCIDENTAL PULMONARY NODULE",
	"complianceType": "performanceMet",
	"qualityCriteria": [
		"FOLLOW-UP RECOMMENDATION"
	]
}
```

The following table contains the possible values for `qualityMeasureDenominator`, each with a URL that provides an explanation of the value:

| Denominator value | URL |
|------------|--------------|
| PROSTATE MRI| https://www.acr.org/-/media/ACR/Files/Registries/QCDR/2023-QCDR-Simplified-Measure-Specifications.pdf |
| ONCOLOGIC FDG PET IMAGING| https://www.acr.org/-/media/ACR/Files/Registries/QCDR/2023-QCDR-Simplified-Measure-Specifications.pdf |
| FLUOROSCOPIC RADIATION EXPOSURE| https://www.acr.org/-/media/ACR/NOINDEX/Measures/2024_Measure_145_MIPSCQM.pdf |
| BONE SCINTIGRAPHY| https://www.acr.org/-/media/ACR/NOINDEX/Measures/2023_Measure_147_MIPSCQM.pdf |
| CT CHEST| https://www.acr.org/-/media/ACR/Files/Registries/QCDR/2023-QCDR-Simplified-Measure-Specifications.pdf |
| HIGH DOSE RADIATION IMAGING| https://www.acr.org/-/media/ACR/NOINDEX/Measures/2024_Measure_360_MIPSCQM.pdf |
| INCIDENTAL PULMONARY NODULE| https://www.acr.org/-/media/ACR/NOINDEX/Measures/2024_Measure_364_MIPSCQM.pdf |
| PULMONARY EMBOLISM| https://www.acr.org/-/media/ACR/Files/Registries/QCDR/2023-QCDR-Simplified-Measure-Specifications.pdf |
| EXAM FOR VENTRICULAR SHUNT| https://www.acr.org/-/media/ACR/Files/Registries/QCDR/2023-QCDR-Simplified-Measure-Specifications.pdf |
| INCIDENTAL ABDOMINAL LESION| https://www.acr.org/-/media/ACR/NOINDEX/Measures/2024_Measure_405_MIPSCQM.pdf |
| INCIDENTAL THYROID NODULE| https://www.acr.org/-/media/ACR/NOINDEX/Measures/2024_Measure_406_MIPSCQM.pdf |
| LIVER NODULE| https://www.acr.org/-/media/ACR/Files/Registries/QCDR/2023-QCDR-Simplified-Measure-Specifications.pdf |
| DOSE LOWERING TECHNIQUE| https://www.acr.org/-/media/ACR/NOINDEX/Measures/2024_Measure_436_MIPSCQM.pdf |
| CVC INSERTION| https://www.acr.org/-/media/ACR/NOINDEX/Measures/2022_Measure_076_MIPSCQM.pdf |

Examples Request/Response JSON:

[!INCLUDE [Example input json](../includes/example-inference-quality-measure-json-request.md)]

[!INCLUDE [Example output json](../includes/example-inference-quality-measure-json-response.md)]
