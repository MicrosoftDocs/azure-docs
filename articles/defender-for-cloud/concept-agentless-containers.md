---
title: Agentless Container Posture for Microsoft Defender for Cloud
description: Learn how Agentless Container Posture offers discovery and visibility for Containers without installing an agent on your machines.
ms.service: defender-for-cloud
ms.topic: conceptual
ms.date: 04/16/2023
ms.custom: template-concept
---

# Agentless Container Posture (Preview)

You can identify security risks that exist in containers and Kubernetes realms with the agentless discovery and visibility capability across SDLC and runtime.

You can maximize the coverage of your container posture issues and extend your protection beyond the reach of agent-based assessments to provide a holistic approach to your posture improvement. This includes, for example, container vulnerability assessment insights as part of [Cloud Security Explorer](how-to-manage-cloud-security-explorer.md) and Kubernetes [Attack Path](attack-path-reference.md#azure-containers) analysis.

Learn more about [Cloud Security Posture Management](concept-cloud-security-posture-management.md).

> [!IMPORTANT]
> The Agentless Container Posture preview features are available on a self-service, opt-in basis. Previews are provided "as is" and "as available" and are excluded from the service-level agreements and limited warranty. Agentless Container Posture previews are partially covered by customer support on a best-effort basis. As such, these features aren't meant for production use.

## Capabilities

Agentless Container Posture provides the following capabilities:

- Using Kubernetes Attack Path analysis to visualize risks and threats to Kubernetes environments.
- Using Cloud Security Explorer for risk hunting by querying various risk scenarios.
- Viewing security insights, such as internet exposure, and other pre-defined security scenarios. For more information, search for `Kubernetes` in the [list of Insights](attack-path-reference.md#insights).
- Agentless discovery and visibility within Kubernetes components.
- Agentless container registry vulnerability assessment, using the image scanning results of your Azure Container Registry (ACR) with Cloud Security Explorer.

    [Vulnerability assessment](defender-for-containers-vulnerability-assessment-azure.md) for Containers in Defender Cloud Security Posture Management (CSPM) gives you frictionless, wide, and instant visibility on actionable posture issues without the need for installed agents, network connectivity requirements, or container performance impact.

All of these capabilities are available as part of the [Defender Cloud Security Posture Management](concept-cloud-security-posture-management.md) plan.

## Availability

| Aspect | Details |
|---------|---------|
|Release state:|Preview|
|Pricing:|Requires [Defender Cloud Security Posture Management (CSPM)](concept-cloud-security-posture-management.md) and is billed as shown on the [pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/) |
| Clouds:    | :::image type="icon" source="./media/icons/yes-icon.png"::: Azure Commercial clouds<br> :::image type="icon" source="./media/icons/no-icon.png"::: Azure Government<br>:::image type="icon" source="./media/icons/no-icon.png"::: Azure China 21Vianet<br>:::image type="icon" source="./media/icons/no-icon.png"::: Connected AWS accounts<br>:::image type="icon" source="./media/icons/no-icon.png"::: Connected GCP accounts         |
| Permissions | You need to have access as a Subscription Owner, or, User Access Admin as well as Security Admin permissions for the Azure subscription used for onboarding |

## Prerequisites

You need to have a Defender for CSPM plan enabled. There's no dependency on Defender for Containers​.

This feature uses trusted access. Learn more about [AKS trusted access prerequisites](/azure/aks/trusted-access-feature#prerequisites).

## Onboard Agentless Containers for CSPM

Onboarding Agentless Containers for CSPM will allow you to gain wide visibility into Kubernetes and containers registries across SDLC and runtime.

**To onboard Agentless Containers for CSPM:**

1. In the Azure portal, navigate to the Defender for Cloud's **Environment Settings** page.

1. Select the subscription that's onboarded to the Defender CSPM plan, then select **Settings**.

1. Ensure the **Agentless discovery for Kubernetes** and **Container registries vulnerability assessments** extensions are toggled to **On**.

1. Select **Continue**.

    :::image type="content" source="media/concept-agentless-containers/settings-continue.png" alt-text="Screenshot of selecting agentless discovery for Kubernetes and Container registries vulnerability assessments." lightbox="media/concept-agentless-containers/settings-continue.png":::

1. Select **Save**.

A notification message pops up in the top right corner that will verify that the settings were saved successfully.

## Agentless Container Posture extensions

### Container registries vulnerability assessments

For container registries vulnerability assessments, recommendations are available based on the vulnerability assessment timeline.

Learn more about [image scanning](defender-for-containers-vulnerability-assessment-azure.md).

### Agentless discovery for Kubernetes

The system’s architecture is based on a snapshot mechanism at intervals.

:::image type="content" source="media/concept-agentless-containers/diagram-permissions-architecture.png" alt-text="Diagram of the permissions architecture." lightbox="media/concept-agentless-containers/diagram-permissions-architecture.png":::

By enabling the Agentless discovery for Kubernetes extension, the following process occurs:

- **Create**: MDC (Microsoft Defender for Cloud) creates an identity in customer environments called CloudPosture/securityOperator/DefenderCSPMSecurityOperator.

- **Assign**: MDC assigns 1 built-in role called **Kubernetes Agentless Operator** to that identity on subscription scope.

    The role contains the following permissions:
    - AKS read (Microsoft.ContainerService/managedClusters/read)
    - AKS Trusted Access with the following permissions:
        - Microsoft.ContainerService/managedClusters/trustedAccessRoleBindings/write
        - Microsoft.ContainerService/managedClusters/trustedAccessRoleBindings/read
        - Microsoft.ContainerService/managedClusters/trustedAccessRoleBindings/delete

        Learn more about [AKS Trusted Access](/azure/aks/trusted-access-feature).

- **Discover**: Using the system assigned identity, MDC performs a discovery of the AKS clusters in your environment using API calls to the API server of AKS.

- **Bind**: Upon discovery of an AKS cluster, MDC performs an AKS bind operation between the created identity and the Kubernetes role “Microsoft.Security/pricings/microsoft-defender-operator”. The role is visible via API and gives MDC data plane read permission inside the cluster.

### Refresh intervals

Agentless information in Defender CSPM is updated once an hour through a snapshot mechanism. It can take up to **24 hours** to see results in Cloud Security Explorer and Attack Path.

## FAQs

### Why don't I see results from my clusters?

If you don't see results from your clusters, check the following:

- Do you have [stopped clusters](#what-do-i-do-if-i-have-stopped-clusters)?
- Are your clusters [Read only (locked)](#what-do-i-do-if-i-have-read-only-clusters-locked)?

### What do I do if I have stopped clusters?

We suggest that you rerun the cluster to solve this issue.

### What do I do if I have Read only clusters (locked)?

We suggest that you do one of the following:

- Remove the lock.
- Perform the bind operation manually by doing an API request.

Learn more about [locked resources](/azure/azure-resource-manager/management/lock-resources?tabs=json).

## Next steps

Learn more about [Cloud Security Posture Management](concept-cloud-security-posture-management.md).
