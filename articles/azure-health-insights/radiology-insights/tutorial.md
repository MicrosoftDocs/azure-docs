---
title: "Tutorial: Retrieve supporting evidence of Radiology Insights inferences (Azure AI Health Insights)"
description: "This tutorial page shows how supporting evidence of Radiology Insights inferences can be retrieved."
author: hvanhoe
ms.author: henkvanhoe
ms.service: azure-health-insights
ms.topic: tutorial  #Don't change.
ms.date: 04/17/2024

#customer intent: As a developer, I want to retrieve supporting evidence of inferences so that the origin of an inference in the report text can be determined.

---

# Tutorial: Retrieve supporting evidence of Radiology Insight inferences

This tutorial shows how to retrieve supporting evidence of Radiology Insight inferences. The supporting evidence shows what part of the report text triggered a specific Radiology Insights inference.

In this tutorial, you:

> [!div class="checklist"]
> * send a document to the Radiology Insights service and retrieve the Follow-up Recommendation inference
> * display the supporting evidence for this inference
> * retrieve the imaging procedure recommendation and imaging procedure contained in this follow-up recommendation
> * display the (SNOMED) codes and the evidence for the Modality and the Anatomy contained in the imaging procedure

If you don’t have a service subscription, create a [free trial account](//azure.microsoft.com/free/ai-services). 

A complete working example of the code contained in this tutorial (with some extra additions) can be found here: [SampleFollowupRecommendationInferenceAsync](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/healthinsights/azure-health-insights-radiologyinsights/src/samples/java/com/azure/health/insights/radiologyinsights/SampleFollowupRecommendationInferenceAsync.java).

## Prerequisites

To use the Radiology Insights (Preview) model, you must have an Azure AI Health Insights service created. If you have no Azure AI Health Insights service, see [Deploy Azure AI Health Insights using the Azure portal](../deploy-portal.md) 

<!--- or [Deploy Azure AI Health Insights using CLI or PowerShell](get-started-CLI.md). --->

See [Azure Cognitive Services Health Insights Radiology Insights client library for Java](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/healthinsights/azure-health-insights-radiologyinsights/README.md) for an explanation on how to create a RadiologyInsightsClient, send a document to it, and retrieve a RadiologyInsightsInferenceResult.

## Retrieve the Follow-up Recommendation inference

Once you have a RadiologyInsightsInferenceResult, use the following code to retrieve the Follow-up Recommendation inference:

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

The objects as exposed by the Java SDK are closely aligned with the FHIR standard. Therefore the supporting evidence for the Follow-up Recommendation inferences is encoded inside FhirExtension objects. Retrieve those objects and display the evidence as in the following code:

```java
        List<FhirR4Extension> extensions = followupRecommendationInference.getExtension();
        System.out.println("   Evidence: " + extractEvidence(extensions));
```

As the evidence is encoded in extensions wrapped in a top level extension, the extractEvidence() method loops over those subExtensions:

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

The extractEvidenceToken() method loops over the subExtensions and extracts the offsets and lengths for each token or word of the supporting evidence. Both offset and length are encoded as separate extensions with a corresponding "url" value ("offset" or "length"). Finally the offsets and length values are used to extract the tokens or words from the document text (as stored in the DOC_CONTENT constant):

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
                    
## Retrieve the imaging procedures contained in the follow-up recommendation

The imaging procedures are wrapped in an ImagingProcedureRecommendation (which is itself a subclass of ProcedureRecommendation), and can be retrieved as follows:

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

The codes (in this example SNOMED) can be displayed using the displayCodes() method. The codes are wrapped in FHir4Coding objects, and can be displayed in a straightforward manner as in the following code. The indentation parameter is only added for formatting purposes:

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
<!---
## Clean up resources

If you created a resource or resource group for this tutorial, these resources can be cleaned up as explained here: [Deploy Azure AI Health Insights using CLI or PowerShell](get-started-cli.md). --->

## Related content

* [SampleFollowupRecommendationInferenceAsync](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/healthinsights/azure-health-insights-radiologyinsights/src/samples/java/com/azure/health/insights/radiologyinsights/SampleFollowupRecommendationInferenceAsync.java)
* [Deploy Azure AI Health Insights using the Azure portal](../deploy-portal.md)
<!---* [Deploy Azure Health Insights using CLI or PowerShell](get-started-CLI.md)--->
* [Azure Cognitive Services Health Insights Radiology Insights client library for Java](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/healthinsights/azure-health-insights-radiologyinsights/README.md)
