---
title: "Tutorial: Retrieve supporting evidence for Radiology Insight inferences"
description: "This tUtorial page shows how supporting evidence for Radiology Insight inferences can be retrieved."
author: hvanhoe
ms.author: hvanhoe
ms.service: azure-health-insights
ms.topic: tutorial  #Don't change.
ms.date: 04/17/2024

#customer intent: As a developer, I want to retrieve supporting evidence for inferences so that the origin of an inference in the report can be determined.

---

# Tutorial: Retrieve supporting evidence for Radiology Insight inferences

This tutorial shows how to retrieve supporting evidence for Radiology Insight inferences. The supporting evidence shows on what part of the report text an Radiology Insight inference is based.

In this tutorial, you:

> [!div class="checklist"]
> * send a document to the Radiology Insights service and retrieve the Followup Recommendation inference
> * display the supporting evidence for this inference
> * retrieve the imaging procedure recommendation and imaging procedure contained in this followup recommendation
> * display the (SNOMED) codes and the evidence for the Modality and the Anatomy contained in the imaging procedure

[If you don’t have a service subscription, create a free
trial account . . .]

## Prerequisites

Deploy a HealthInsights service...
See ... for how to create a RadiologyInsightsClient and send a document.

## Retrieve the Followup Recommendation inference

Once you have a RadiologyInsightsInferenceResult, use the following code to retrieve the Followup Recommendation inference:

```java
        List<RadiologyInsightsPatientResult> patientResults = radiologyInsightsResult.getPatientResults();
        for (RadiologyInsightsPatientResult patientResult : patientResults) {
            List<RadiologyInsightsInference> inferences = patientResult.getInferences();
            for (RadiologyInsightsInference inference : inferences) {
                
                if (inference instanceof FollowupRecommendationInference) {
                    FollowupRecommendationInference followupRecommendationInference = (FollowupRecommendationInference) inference;
                    ...
                }
            }
        }
```

## Display the supporting evidence for this inference

The object as exposed by the Java SDK are closely aligned with the FHIR standard. Therefore the supporting evidence for the Followup Recommendation inferences is encode inside FhirExtension objects. Retrieve those objects and display the evidence as in the following code:

```java
        List<FhirR4Extension> extensions = followupRecommendationInference.getExtension();
        System.out.println("   Evidence: " + extractEvidence(extensions));
```

As the evidence is encoded in extensions wrapped in a top level extension, the extractEvidence() method loops over those "subextensions":

```java
    private static String extractEvidence(List<FhirR4Extension> extensions) {
        String evidence = "";
        if (extensions != null) {
            for (FhirR4Extension extension : extensions) {
                List<FhirR4Extension> subExtensions = extension.getExtension();
                if (subExtensions != null) {
                    evidence += extractEvidenceToken(subExtensions) + " ";
                }
            }
        }
        return evidence;
    }                    
```

The extractEvidenceToken() method loops over those subExtensions and extracts the offsets and lengths for each token or word of the supporting evidence. Both offset and length are encoded as extensions with a corresponding "url" value. Finally the ofsets and length values are used to extract the tokens or words from the document text (as stored in the DOC_CONTENT constant):

```java
    private static String extractEvidenceToken(List<FhirR4Extension> subExtensions) {
        String evidence = "";
        int offset = -1;
        int length = -1;
        for (FhirR4Extension iExtension : subExtensions) {
            if (iExtension.getUrl().equals("offset")) {
                offset = iExtension.getValueInteger();
            }
            if (iExtension.getUrl().equals("length")) {
                length = iExtension.getValueInteger();
            }
        }
        if (offset > 0 && length > 0) {
            evidence = DOC_CONTENT.substring(offset, Math.min(offset + length, DOC_CONTENT.length()));
        }
        return evidence; 
    }
```
                    
## Retrieve the imaging procedure(s) contained in the followup recommendation

The imaging procedures are wrapped in a ImagingProcedureRecommendation (which is itself a subclass of ProcedureRecommendation), and can be retrieved as follows:

```java
        ProcedureRecommendation recommendedProcedure = followupRecommendationInference.getRecommendedProcedure();
        if (recommendedProcedure instanceof ImagingProcedureRecommendation) {
            System.out.println("   Imaging procedure recommendation: ");
            ImagingProcedureRecommendation imagingProcedureRecommendation = (ImagingProcedureRecommendation) recommendedProcedure;
            System.out.println("      Imaging procedure: ");
            List<ImagingProcedure> imagingProcedures = imagingProcedureRecommendation.getImagingProcedures();
            ...
        }
```

## Display the evidence for the Modality and the Anatomy contained in the imaging procedure

An imaging procedure can contain both a modality and an anatomy. The supporting evidence for both can be retrieved exactly like the inference evidence, using the same method calls:

```java
        for (ImagingProcedure imagingProcedure : imagingProcedures) {
            System.out.println("         Modality");
            FhirR4CodeableConcept modality = imagingProcedure.getModality();
            displayCodes(modality, 4);
            System.out.println("            Evidence: " + extractEvidence(modality.getExtension()));
            
            System.out.println("         Anatomy");
            FhirR4CodeableConcept anatomy = imagingProcedure.getAnatomy();
            displayCodes(anatomy, 4);
            System.out.println("            Evidence: " + extractEvidence(anatomy.getExtension()));
                        }
```

The codes (in this example SNOMED) can be displayed using the displayCodes() method. The codes are wrapped in FHir4Coding objects, and can be displayed in a straightforward manner as in the followin code. The indentation parameter is only added for formatting purposes:

```java
    private static void displayCodes(FhirR4CodeableConcept codeableConcept, int indentation) {
        String initialBlank = "";
        for (int i = 0; i < indentation; i++) {
            initialBlank += "   ";
        }
        if (codeableConcept != null) {
            List<FhirR4Coding> codingList = codeableConcept.getCoding();
            if (codingList != null) {
                for (FhirR4Coding fhirR4Coding : codingList) {
                    System.out.println(initialBlank + "Coding: " + fhirR4Coding.getCode() + ", " + fhirR4Coding.getDisplay() + " (" + fhirR4Coding.getSystem() + ")");
                }
            }
        }
    }
```

## Clean up resources

[Link to deployment documentation.]

## Related content

[Link to corresponding sample, containing full code]

* [Related article title](link.md)
* [Related article title](link.md)
* [Related article title](link.md)
