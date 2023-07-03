---
title: How-to view and remediate runtime threat findings 
description: Learn how to view and remediate runtime threat findings
ms.service: defender-for-cloud
ms.custom: build-2023
ms.topic: how-to
ms.date: 07/02/2023
---

# View and remediate vulnerabilities for images running on your AKS clusters

Defender for Cloud gives its customers the ability to prioritize the remediation of vulnerabilities in images that are currently being used within their environment using the [Running container images should have vulnerability findings resolved](https://portal.azure.com/#view/Microsoft_Azure_Security_CloudNativeCompute/KubernetesRuntimeVisibilityRecommendationDetailsBlade/assessmentKey/41503391-efa5-47ee-9282-4eff6131462ce) recommendation.

To provide findings for the recommendation, Defender CSPM uses [agentless container registry vulnerability assessment](concept-agentless-containers.md#agentless-container-registry-vulnerability-assessment) to create a full inventory of your K8s clusters and their workloads and correlates that inventory with the [agentless container registry vulnerability assessment] (concept-agentless-containers.md#agentless-container-registry-vulnerability-assessment). The recommendation shows your running containers with the vulnerabilities associated with the images that are used by each container and provides vulnerability reports and remediation steps. 

## View findings for a specific cluster

**To view findings for a specific cluster, do the following:**  

1. Open the **Recommendations** page, using the **>** arrow to open the sub-levels. If issues were found, you'll see the recommendation [Running container images should have vulnerability findings resolved (powered by Microsoft Defender Vulnerability Management)](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/c609cf0f-71ab-41e9-a3c6-9a1f7fe1b8d5). 

    :::image type="content" source="media/view-and-remediate-vulnerabilities-for-images-running-on-aks/find-running-images-recommendation.png" alt-text="Screenshot showing the recommendation line for running container images should have vulnerability findings resolved." lightbox="media/view-and-remediate-vulnerabilities-for-images-running-on-aks/find-running-images-recommendation.png"::: 

1. Select the recommendation; the recommendation details page opens showing the list of Kubernetes clusters ("affected resources") and categorize the as healthy, unhealthy and not applicable, based on the images used by your workloads. 

    :::image type="content" source="media/view-and-remediate-vulnerabilities-for-images-running-on-aks/running-images-recommendation.png" alt-text="Screenshot showing the recommendation details for running images." lightbox="media/view-and-remediate-vulnerabilities-for-images-running-on-aks/running-images-recommendation.png":::

1. Select the relevant cluster for which you want to remediate vulnerabilities from the unhealthy tab.

    :::image type="content" source="media/view-and-remediate-vulnerabilities-for-images-running-on-aks/select-a-finding.png" alt-text="Screenshot showing where to select the specific cluster." lightbox="media/view-and-remediate-vulnerabilities-for-images-running-on-aks/select-a-finding.png":::

1. The cluster details page opens. It lists all currently running containers categorized into three tabs based on the vulnerability assessments of the images used by those containers.

    :::image type="content" source="media/view-and-remediate-vulnerabilities-for-images-running-on-aks/finding-details.png" alt-text="Screenshot showing the list of findings on the specific image." lightbox="media/view-and-remediate-vulnerabilities-for-images-running-on-aks/finding-details.png":::

1. Select the relevant image to view the vulnerabilities on that image.
  
    :::image type="content" source="media/view-and-remediate-vulnerabilities-for-images-running-on-aks/select-image.png" alt-text="Screenshot showing where to select a specific image." lightbox="media/view-and-remediate-vulnerabilities-for-images-running-on-aks/select-image.png":::

1. This pane includes a detailed description of the issue and links to external resources to help mitigate the threats, and information on the software version that contributes to resolving the vulnerability.  
  
    :::image type="content" source="media/view-and-remediate-vulnerabilities-for-images-running-on-aks/remediate-image.png" alt-text="Screenshot showing where to finding remediation steps for image vulnerabilities." lightbox="media/view-and-remediate-vulnerabilities-for-images-running-on-aks/remediate-image.png":::

## View and remediate vulnerabilities

For each vulnerability you want to remediate, do the following:

1. Open the **Recommendations** page, using the **>** arrow to open the sub-levels. If issues were found, you'll see the recommendation [Running container images should have vulnerability findings resolved (powered by Microsoft Defender Vulnerability Management)](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/c609cf0f-71ab-41e9-a3c6-9a1f7fe1b8d5).
1. This page lists all the vulnerability findings.

    :::image type="content" source="media/view-and-remediate-vulnerabilities-for-images-running-on-aks/view-vulnerabilities.png" alt-text="Screenshot showing the list of vulnerabilities for the recommendation." lightbox="media/view-and-remediate-vulnerabilities-for-images-running-on-aks/view-vulnerabilities.png":::

1. Select a vulnerability finding. This opens a pane of detailed information of that finding, the affected resources.

    :::image type="content" source="media/view-and-remediate-vulnerabilities-for-images-running-on-aks/vulnerability-details.png" alt-text="Screenshot showing the selected vulnerability and its details." lightbox="media/view-and-remediate-vulnerabilities-for-images-running-on-aks/vulnerability-details.png":::

1. Select the image with the vulnerability.
    
    :::image type="content" source="media/view-and-remediate-vulnerabilities-for-images-running-on-aks/select-vulnerability.png" alt-text="Screenshot showing the selected vulnerability." lightbox="media/view-and-remediate-vulnerabilities-for-images-running-on-aks/select-vulnerability.png":::

1. Follow the steps in the remediation section of the image details pane. 

    :::image type="content" source="media/view-and-remediate-vulnerabilities-for-images-running-on-aks/remediate-vulnerability.png" alt-text="Screenshot showing the open pane with remediation information." lightbox="media/view-and-remediate-vulnerabilities-for-images-running-on-aks/remediate-vulnerability.png":::

1. Build a new image that resolves the vulnerability according to the remediation details on the CVE.
1. Push the new image to the registry and remove the vulnerable image.
1. Use the new images across all vulnerable workloads.
1. Check the recommendations page for the recommendation [Running container images should have vulnerability findings resolved](https://portal.azure.com/#view/Microsoft_Azure_Security_CloudNativeCompute/KubernetesRuntimeVisibilityRecommendationDetailsBlade/assessmentKey/41503391-efa5-47ee-9282-4eff6131462c) . 

    > [!NOTE]
    > It may take up to 24 hours for the recommendation to be updated with the scan results for the new image. 


## Next Steps 

 Learn more about the Defender for Cloud [Defender plans](defender-for-cloud-introduction.md#protect-cloud-workloads).