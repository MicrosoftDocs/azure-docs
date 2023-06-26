-
title: How-to view and remediate runtime threat findings 
description: Learn how to view and remediate runtime threat findings
ms.service: defender-for-cloud
ms.custom: build-2023
ms.topic: how-to
ms.date: 06/26/2023
---

# View and remediate vulnerabilities for images running on your AKS clusters

Defender for Cloud gives its customers the ability to prioritize the remediation of vulnerabilities in images that are currently being used within their environment using the [Running container images should have vulnerability findings resolved](https://portal.azure.com/#view/Microsoft_Azure_Security_CloudNativeCompute/KubernetesRuntimeVisibilityRecommendationDetailsBlade/assessmentKey/41503391-efa5-47ee-9282-4eff6131462ce) recommendation.

To provide findings for the recommendation, Defender for Cloud collects the inventory of your running containers that are collected by the Defender agent installed on your AKS clusters. Defender for Cloud correlates that inventory with the vulnerability assessment scan of images that are stored in ACR (Azure Container Registry). The recommendation shows your running containers with the vulnerabilities associated with the images that are used by each container and provides vulnerability reports and remediation steps. 

**To view the findings, do the following:**  

1. Open the **Recommendations** page. If issues were found, you'll see the recommendation [Running container images should have vulnerability findings resolved (powered by Microsoft Defender Vulnerability Management)](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/c609cf0f-71ab-41e9-a3c6-9a1f7fe1b8d5). 

    :::image type="content" source="media/view-and-remediate-vulnerabilities-for-images-running-on-aks/find-running-images-recommendation.png" alt-text="Screenshot showing the recommendation line for running container images should have vulnerability findings resolved." lightbox="media/view-and-remediate-vulnerabilities-for-images-running-on-aks/find-running-images-recommendation.png"::: 

1. Select the recommendation; the recommendation details page opens with additional information. This information includes the list of registries with vulnerable images ("Affected resources") and the remediation steps.

    :::image type="content" source="media/view-and-remediate-vulnerability-assessment-findings/recommendation-details.png" alt-text="Screenshot showing the recommendation details for running images." lightbox="media/view-and-remediate-vulnerability-assessment-findings/recommendation-details.png":::

1. Select a specific registry to see the repositories in it that have vulnerable images. 

    :::image type="content" source="media/view-and-remediate-vulnerability-assessment-findings/select-specific-registry.png" alt-text="Screenshot showing where to select the specific registry." lightbox="media/view-and-remediate-vulnerability-assessment-findings/select-specific-registry.png":::

1. The registry details page opens with the list of affected repositories. Select a specific repository to see the images in it that are vulnerable. 

    :::image type="content" source="media/view-and-remediate-vulnerability-assessment-findings/select-specific-repo.png" alt-text="Screenshot showing where to select the specific repository." lightbox="media/view-and-remediate-vulnerability-assessment-findings/select-specific-repo.png":::

 1. The repository details page opens. It lists the vulnerable images together with an assessment of the severity of the findings. Select a specific image to see the vulnerabilities;  the list of findings for the selected image opens.

    :::image type="content" source="media/view-and-remediate-vulnerabilities-for-images-running-on-aks/select-a-finding.png" alt-text="Screenshot showing the list of findings on the specific image." lightbox="media/view-and-remediate-vulnerabilities-for-images-running-on-aks/select-a-finding.png":::

1. To learn more about a finding, select the finding; the findings details pane opens. 
 
    :::image type="content" source="media/view-and-remediate-vulnerabilities-for-images-running-on-aks/list-of-findings-running-images.png" alt-text="Screenshot showing the finding details of the image." lightbox="media/view-and-remediate-vulnerabilities-for-images-running-on-aks/list-of-findings-running-images.png"::: 

    This pane includes a detailed description of the issue and links to external resources to help mitigate the threats, and information on the software version that contributes to resolving the vulnerability.  

## Remediate the vulnerability for images in the registry 

1. Follow the steps in the remediation section of the recommendation pane. 
1. When you've completed the steps required to remediate the security issue, replace the image in your registry: 
1. Push the updated image to trigger a scan; it may take up to 24 hours for the previous image to be removed from the results, and for the new image to be included in the results.
1. Check the recommendations page for the recommendation [Running container images should have vulnerability findings resolved](https://portal.azure.com/#view/Microsoft_Azure_Security_CloudNativeCompute/KubernetesRuntimeVisibilityRecommendationDetailsBlade/assessmentKey/41503391-efa5-47ee-9282-4eff6131462c) . 
    If the recommendation still appears and the image you've handled still appears in the list of vulnerable images, check the remediation steps again. 
1. When you're sure the updated image has been pushed, scanned, and is no longer appearing in the recommendation, delete the “old” vulnerable image from your registry. 

    > [!NOTE]
    > Kubernetes deployments using the vulnerable images must be updated with the new patched images. 


## Next Steps 

 Learn more about the Defender for Cloud [Defender plans](defender-for-cloud-introduction.md#protect-cloud-workloads).