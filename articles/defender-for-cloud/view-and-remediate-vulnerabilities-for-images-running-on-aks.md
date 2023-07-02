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

To provide findings for the recommendation, Defender CSPM uses [agentless discovery and visibility](concept-agentless-containers#agentless-discovery-and-visibility-within-kubernetes-components) to create a full inventory of your K8s clusters and their workloads and correlates that inventory with the [Agentless Container registry vulnerability vulnerability assessment (concept-agentless-containers#agentless-container-registry-vulnerability-assessment). The recommendation shows your running containers with the vulnerabilities associated with the images that are used by each container and provides vulnerability reports and remediation steps. 

**To view findings for a specific cluster, do the following:**  

1. Open the **Recommendations** page. If issues were found, you'll see the recommendation [Running container images should have vulnerability findings resolved (powered by Microsoft Defender Vulnerability Management)](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/c609cf0f-71ab-41e9-a3c6-9a1f7fe1b8d5). 

    :::image type="content" source="media/view-and-remediate-vulnerabilities-for-images-running-on-aks/find-running-images-recommendation.png" alt-text="Screenshot showing the recommendation line for running container images should have vulnerability findings resolved." lightbox="media/view-and-remediate-vulnerabilities-for-images-running-on-aks/find-running-images-recommendation.png"::: 

1. Select the recommendation; the recommendation details page opens showing the list of Kubernetes clusters  ("affected resources") and categorize the as healthy, unhealthy and not applicable, based on the images used by your workloads. 

    :::image type="content" source="media/view-and-remediate-vulnerabilities-for-images-running-on-aks/running-images-recommendation.png" alt-text="Screenshot showing the recommendation details for running images." lightbox="media/view-and-remediate-vulnerabilities-for-images-running-on-aks/running-images-recommendation.png":::

1. Select the relevant cluster for which you want to remediate vulnerabilities from the unhealthy tab

    :::image type="content" source="media/view-and-remediate-vulnerabilities-for-images-running-on-aks/select-a-finding.png" alt-text="Screenshot showing where to select the specific cluster." lightbox="media/view-and-remediate-vulnerabilities-for-images-running-on-aks/select-a-finding.png":::

 1. The cluster details page opens. It lists all currently running containers categorized into three tabs based on the vulnerability assesment of the images used by those containers.

    :::image type="content" source="media/view-and-remediate-vulnerabilities-for-images-running-on-aks/finding-details.png" alt-text="Screenshot showing the list of findings on the specific image." lightbox="media/view-and-remediate-vulnerabilities-for-images-running-on-aks/finding-details.png":::


    This pane includes a detailed description of the issue and links to external resources to help mitigate the threats, and information on the software version that contributes to resolving the vulnerability.  

## Remediate the vulnerability for running container images

1. Follow the steps in the remediation section of the recommendation pane. 
1. When you've completed the steps required to remediate the security issue, replace the image in your cluster: 
1. Push the updated image to trigger a scan; 
4. Use the new image across all workloads where it is currently being used, or on the specific cluster you are currently addressing vulnerabilities for.
1. Check the recommendations page for the recommendation [Running container images should have vulnerability findings resolved](https://portal.azure.com/#view/Microsoft_Azure_Security_CloudNativeCompute/KubernetesRuntimeVisibilityRecommendationDetailsBlade/assessmentKey/41503391-efa5-47ee-9282-4eff6131462c) . 
    If the recommendation still appears and the image you've handled still appears in the list of vulnerable images, check the remediation steps again. 
1. When you're sure the updated image has been pushed, scanned, and is no longer appearing in the recommendation, delete the “old” vulnerable image from your cluster. 

    > [!NOTE]
    > Kubernetes deployments using the vulnerable images must be updated with the new patched images. 


## Next Steps 

 Learn more about the Defender for Cloud [Defender plans](defender-for-cloud-introduction.md#protect-cloud-workloads).