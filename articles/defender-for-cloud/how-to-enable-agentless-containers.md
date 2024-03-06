---
title: How-to enable agentless container posture 
description: Learn how to onboard agentless containers
ms.service: defender-for-cloud
ms.topic: how-to
ms.date: 12/13/2023
---

# Onboard agentless container posture in Defender CSPM

Onboarding agentless container posture in Defender CSPM allows you to gain all its [capabilities](concept-agentless-containers.md#capabilities).

> [!NOTE]
> Agentless container posture is available for Azure, AWS, and GCP clouds.

Defender CSPM includes [two extensions](/azure/defender-for-cloud/faq-defender-for-containers#what-are-the-extensions-for-agentless-container-posture-management) that allow for agentless visibility into Kubernetes and containers registries across your organization's software development lifecycle.

## How to onboard agentless container posture in Defender CSPM

1. Before starting, verify that the scope is [onboarded to Defender CSPM](enable-enhanced-security.md).

1. In the Azure portal, navigate to the Defender for Cloud's **Environment Settings** page.

1. Select the scope that's onboarded to the Defender CSPM plan, then select **Settings**.

1. Ensure the **Agentless discovery for Kubernetes** and **Agentless Container vulnerability assessments** extensions are toggled to **On**.

1. Select **Continue**.

    :::image type="content" source="media/concept-agentless-containers/select-components.png" alt-text="Screenshot of selecting components." lightbox="media/concept-agentless-containers/select-components.png":::

1. Select **Save**.

A notification message pops up in the top right corner that verifies that the settings were saved successfully.

> [!NOTE]
> Agentless discovery for Kubernetes uses AKS trusted access. For more information about about AKS trusted access, see [Enable Azure resources to access Azure Kubernetes Service (AKS) clusters using Trusted Access](../aks/trusted-access-feature.md).

## Next steps

- Check out [common questions about Defender for Containers](faq-defender-for-containers.yml).
- Learn more about [Trusted Access](../aks/trusted-access-feature.md).
- Learn how to [view and remediate vulnerability assessment findings for registry images](view-and-remediate-vulnerability-assessment-findings.md).
- Learn how to [view and remediate vulnerabilities for images running on your AKS clusters](view-and-remediate-vulnerabilities-for-images.md).
- Learn how to [Test the Attack Path and Security Explorer using a vulnerable container image](how-to-test-attack-path-and-security-explorer-with-vulnerable-container-image.md)
- Learn how to [create an exemption](exempt-resource.md) for a resource or subscription.
- Learn more about [Cloud Security Posture Management](concept-cloud-security-posture-management.md).
