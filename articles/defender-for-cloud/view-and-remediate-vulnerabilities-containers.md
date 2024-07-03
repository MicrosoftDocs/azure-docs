---
title: Assess vulnerabilities for containers running on your Kubernetes clusters
description: Learn how to view and remediate runtime threat findings for containers running on your Kubernetes clusters.
ms.service: defender-for-cloud
ms.custom: build-2023
ms.topic: how-to
ms.date: 09/06/2023
---

# View and remediate vulnerabilities for containers running on your Kubernetes clusters (Risk based)

> [!NOTE]
> This page describes the new risk-based approach to vulnerability management in Defender for Cloud. Defender for CSPM customers should use this method. To use the classic secure score approach, see [View and remediate vulnerabilities for images running on your Kubernetes clusters (Secure Score)](view-and-remediate-vulnerabilities-for-images-secure-score.md).

Defender for Cloud gives its customers the ability to prioritize the remediation of vulnerabilities containers running on your Kubernetes clusters based on contextual risk analysis of the vulnerabilities in your cloud environment. In this article, we review the [Containers running in Azure should have vulnerability findings resolved](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/e9acaf48-d2cf-45a3-a6e7-3caa2ef769e0) recommendation. For the other clouds, see the parallel recommendations in  [Vulnerability assessments for AWS with Microsoft Defender Vulnerability Management](agentless-vulnerability-assessment-aws.md) and [Vulnerability assessments for GCP with Microsoft Defender Vulnerability Management](agentless-vulnerability-assessment-gcp.md).

To provide findings for the recommendation, Defender for Cloud uses [agentless discovery for Kubernetes](defender-for-containers-introduction.md) or the [Defender sensor](tutorial-enable-containers-azure.md#deploy-the-defender-sensor-in-azure) to create a full inventory of your Kubernetes clusters and their workloads and correlates that inventory with the vulnerability reports created for your registry images. The recommendation shows your running containers with the vulnerabilities associated with the images that are used by each container and remediation steps.

Defender for Cloud presents the findings and related information as recommendations, including related information such as remediation steps and relevant CVEs. You can view the identified vulnerabilities for one or more subscriptions, or for a specific resource.

## View vulnerabilities for a container

**To view vulnerabilities for a container, do the following:**  

1. In Defender for Cloud, open the **Recommendations** page. If you're not on the new risk-based page, select **Recommendations by risk** on the top menu. If issues were found, you'll see the recommendation [Containers running in Azure should have vulnerability findings resolved](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/e9acaf48-d2cf-45a3-a6e7-3caa2ef769e0). Select the recommendation.

    :::image type="content" source="media/view-and-remediate-vulnerabilities-for-images-running-on-aks/running-image-recommendation-line.png" alt-text="Screenshot showing the recommendation line for running container images should have vulnerability findings resolved." lightbox="media/view-and-remediate-vulnerabilities-for-images-running-on-aks/running-image-recommendation-line.png":::

1. The recommendation details page opens with additional information. This information includes details about your vulnerable container and the remediation steps.

    :::image type="content" source="media/view-and-remediate-vulnerabilities-for-images-running-on-aks/running-select-cluster.png" alt-text="Screenshot showing the affected clusters for the recommendation." lightbox="media/view-and-remediate-vulnerabilities-for-images-running-on-aks/running-select-cluster.png":::

1. Select the **Findings** tab to see the list of vulnerabilities impacting the container.

    :::image type="content" source="media/view-and-remediate-vulnerabilities-for-images-running-on-aks/running-select-container.png" alt-text="Screenshot showing the findings tab containing the vulnerabilities." lightbox="media/view-and-remediate-vulnerabilities-for-images-running-on-aks/running-select-container.png":::

1. Select each vulnerability for a detailed description of the vulnerability, additional containers affected by that vulnerability,  information on the software version that contributes to resolving the vulnerability, and links to external resources to help with patching the vulnerability.

    :::image type="content" source="media/view-and-remediate-vulnerabilities-for-images-running-on-aks/running-list-vulnerabilities.png" alt-text="Screenshot showing the container vulnerabilities." lightbox="media/view-and-remediate-vulnerabilities-for-images-running-on-aks/running-list-vulnerabilities.png":::

To find all containers impacted by a specific vulnerability, group recommendations by title. For more information, see [Group recommendations by title](review-security-recommendations.md#group-recommendations-by-title).

For information on how to remediate the vulnerabilities, see [Remediate recommendations](implement-security-recommendations.md).

## Next step

- Learn how to [view and remediate vulnerabilities for registry images](view-and-remediate-vulnerability-assessment-findings.md).
