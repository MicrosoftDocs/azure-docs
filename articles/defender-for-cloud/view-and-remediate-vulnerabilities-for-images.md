---
title: Assess vulnerabilities for images running on your Kubernetes clusters
description: Learn how to view and remediate runtime threat findings for images running on your Kubernetes clusters
ms.service: defender-for-cloud
ms.custom: build-2023
ms.topic: how-to
ms.date: 09/06/2023
---

# View and remediate vulnerabilities for images running on your Kubernetes clusters (Risk based)

> [!NOTE]
> This page describes the new risk-based approach to vulnerability management in Defender for Cloud. If you are using the classic secure score approach, see [View and remediate vulnerabilities for images running on your Kubernetes clusters (Secure Score)](view-and-remediate-vulnerabilities-for-images-secure-score.md).

Defender for Cloud gives its customers the ability to prioritize the remediation of vulnerabilities in images that are currently being used within their environment. In this article, we'll review the [Containers running in Azure should have vulnerability findings resolved](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/e9acaf48-d2cf-45a3-a6e7-3caa2ef769e0) recommendation. For the other clouds, see the parallel recommendations in  [Vulnerability assessments for AWS with Microsoft Defender Vulnerability Management](agentless-vulnerability-assessment-aws.md) and [Vulnerability assessments for GCP with Microsoft Defender Vulnerability Management](agentless-vulnerability-assessment-gcp.md).

To provide findings for the recommendation, Defender for Cloud uses [agentless discovery for Kubernetes](defender-for-containers-introduction.md) or the [Defender sensor](tutorial-enable-containers-azure.md#deploy-the-defender-sensor-in-azure) to create a full inventory of your Kubernetes clusters and their workloads and correlates that inventory with the vulnerability reports created for your registry images. The recommendation shows your running containers with the vulnerabilities associated with the images that are used by each container and remediation steps.

Defender for Cloud presents the findings and related information as recommendations, including related information such as remediation steps and relevant CVEs. You can view the identified vulnerabilities for one or more subscriptions, or for a specific resource.

Within each recommendation, resources are grouped into tabs:  

- **Healthy resources** – relevant resources, which either aren't impacted or on which you've already remediated the issue.  
- **Unhealthy resources** – resources that are still impacted by the identified issue.  
- **Not applicable resources** – resources for which the recommendation can't give a definitive answer. The not applicable tab also includes reasons for each resource.

If you are using Defender CSPM, first review and remediate vulnerabilities exposed via [attack paths](how-to-manage-attack-path.md), as they pose the greatest risk to your security posture. Then use the following procedures to view, remediate, prioritize, and monitor vulnerabilities for your containers.

## View vulnerabilities on a specific cluster

**To view vulnerabilities for a specific cluster, do the following:**  

1. In Defender for Cloud, open the **Recommendations** page. If issues were found, you'll see the recommendation [Containers running in Azure should have vulnerability findings resolved](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/e9acaf48-d2cf-45a3-a6e7-3caa2ef769e0). Select the recommendation.

    :::image type="content" source="media/view-and-remediate-vulnerabilities-for-images-running-on-aks/running-image-recommendation-line.png" alt-text="Screenshot showing the recommendation line for running container images should have vulnerability findings resolved." lightbox="media/view-and-remediate-vulnerabilities-for-images-running-on-aks/running-image-recommendation-line.png":::

1. The recommendation details page opens with additional information. This information includes the list of registries with vulnerable containers ("Resource") and the remediation steps. Select the affected container.

    :::image type="content" source="media/view-and-remediate-vulnerabilities-for-images-running-on-aks/running-select-cluster.png" alt-text="Screenshot showing the affected clusters for the recommendation." lightbox="media/view-and-remediate-vulnerabilities-for-images-running-on-aks/running-select-cluster.png":::

1. The container details page opens. Select the **Findings** tab to see the list of vulnerabilities impacting the containers.

    :::image type="content" source="media/view-and-remediate-vulnerabilities-for-images-running-on-aks/running-select-container.png" alt-text="Screenshot showing the findings tab containing the vulnerabilities." lightbox="media/view-and-remediate-vulnerabilities-for-images-running-on-aks/running-select-container.png":::

1. Select each vulnerability for a detailed description of the vulnerability, containers affected by that vulnerability, and links to external resources to help mitigate the threats, affected resources, and information on the software version that contributes to resolving the vulnerability.

    :::image type="content" source="media/view-and-remediate-vulnerabilities-for-images-running-on-aks/running-list-vulnerabilities.png" alt-text="Screenshot showing the container vulnerabilities." lightbox="media/view-and-remediate-vulnerabilities-for-images-running-on-aks/running-list-vulnerabilities.png":::

For information on how to remediate the vulnerabilities, see [Remediate recommendations](implement-security-recommendations.md).

You can also group recommendations by title. This is useful when you want to remediate a recommendation that is affecting multiple resources caused by a specific security issue. For more information, see [Group recommendations by title](review-security-recommendations.md#group-recommendations-by-title).

## Next step

- Learn how to [view and remediate vulnerabilities for registry images](view-and-remediate-vulnerability-assessment-findings.md).
