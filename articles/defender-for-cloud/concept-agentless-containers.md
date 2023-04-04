---
title: Agentless discovery and visibility for Containers using Microsoft Defender for Cloud
description: Learn how Defender for Cloud can gather information about your Containers without installing an agent on your machines.
ms.service: defender-for-cloud
ms.topic: conceptual
ms.date: 04/03/2023
ms.custom: template-concept
---

# Agentless Container Posture (Preview)

Identify security risks in containers and Kubernetes realms with an agentless discovery and visibility capability across SDLC and runtime, including container vulnerability assessment insights as part of [Cloud Security Explorer](how-to-manage-cloud-security-explorer.md) and Kubernetes [Attack Path](concept-attack-path.md) analysis.

Agentless Container Posture maximizes coverage on container posture issues and extends beyond the reach of agent-based assessments, providing a holistic approach to your posture improvement.

Learn more about [Cloud Security Posture Management](concept-cloud-security-posture-management.md).

> [!IMPORTANT]
> The Agentless Container Posture preview features are available on a self-service, opt-in basis. Previews are provided "as is" and "as available," and they're excluded from the service-level agreements and limited warranty. Agentless Container Posture previews are partially covered by customer support on a best-effort basis. As such, these features aren't meant for production use.

## Capabilities

Agentless Container Posture provides the following capabilities:

- Enabling agentless discovery and visibility within Kubernetes parameters.
- Enabling agentless container registry vulnerability assessment, using the image scanning results of your Azure Container Registry (ACR) to enable queries on the Cloud Security Explorer.

    A [vulnerability assessment](defender-for-containers-vulnerability-assessment-azure.md) for Containers in Defender Cloud Security Posture Management (CSPM) gives you frictionless, wide, and instant visibility on actionable posture issues without installed agents, network connectivity requirements, or container performance impact.

- Viewing security insights, such as internet exposure, and other pre-defined security scenarios. For more information, see the [list of Insights](attack-path-reference.md).
- Using Cloud Security Explorer for risk hunting by querying various risk scenarios.
- Using Kubernetes Attack Path analysis to visualize risks and threats to Kubernetes environments.

All of these capabilities are available as part of the [Defender Cloud Security Posture Management](concept-cloud-security-posture-management.md) plan.

## Availability

| Aspect | Details |
|---------|---------|
|Release state:|Preview|
|Pricing:|Requires [Defender Cloud Security Posture Management (CSPM)](concept-cloud-security-posture-management.md) |
| Clouds:    | :::image type="icon" source="./media/icons/yes-icon.png"::: Azure Commercial clouds<br> :::image type="icon" source="./media/icons/no-icon.png"::: Azure Government<br>:::image type="icon" source="./media/icons/no-icon.png"::: Azure China 21Vianet<br>:::image type="icon" source="./media/icons/no-icon.png"::: Connected AWS accounts<br>:::image type="icon" source="./media/icons/no-icon.png"::: Connected GCP accounts        |

## Prerequisites

### Permissions

You need to have access as a Subscription Owner, or, User Access Admin as well as Security Admin permissions for the Azure subscription used for onboarding.

### Environment requirements

You need to have:

- A Defender for CSPM plan enabled
- At least one AKS cluster with workload running - preferably one exposed to the internet based on an image deployed from ACR​
    Learn more about [trusted versions that AKS supports](/azure/aks/supported-kubernetes-versions?tabs=azure-cli).

There's no dependency on Defender for Containers​.

## How agentless containers works

The system’s architecture is based on a snapshot mechanism at intervals.

:::image type="content" source="media/concept-agentless-containers/diagram-permissions-architecture.png" alt-text="Diagram of the permissions architecture." lightbox="media/concept-agentless-containers/diagram-permissions-architecture.png":::

By enabling Agentless discovery for Kubernetes, the following process occurs:

1. **Create**: MDC (Microsoft Defender for Cloud) creates an identity in customer environments called CloudPosture/securityOperator/DefenderCSPMSecurityOperator.
[https://learn.microsoft.com/azure/aks/trusted-access-feature](/azure/aks/trusted-access-feature)
1. **Assign**: MDC assigns 1 built-in role called **Kubernetes Agentless Operator** to that identity on subscription scope.

    The role contains the following permissions:
    - AKS read (Microsoft.ContainerService/managedClusters/read)
    - AKS Trusted Access with the following permissions:
        - Microsoft.ContainerService/managedClusters/trustedAccessRoleBindings/write
        - Microsoft.ContainerService/managedClusters/trustedAccessRoleBindings/read
        - Microsoft.ContainerService/managedClusters/trustedAccessRoleBindings/delete

        Learn more about [AKS Trusted Access](/azure/aks/trusted-access-feature).

1. **Discover**: Using the system assigned identity, MDC performs a discovery of the AKS clusters in your environment using API calls to the API server of AKS.

1. **Bind**: Upon discovery of an AKS cluster, MDC performs an AKS bind operation between the created identity and the Kubernetes role “Microsoft.Security/pricings/microsoft-defender-operator”. The role is visible via API and gives MDC data plane read permission inside the cluster.

Agentless information in Defender CSPM is updated once an hour via snapshotting mechanism.

## Onboarding Agentless Containers for CSPM

1. In the Azure portal, navigate to the Defender for Cloud's **Environment Settings** page.

1. Select the subscription to onboard to the Defender CSPM plan.

    :::image type="content" source="media/concept-agentless-containers/environment-settings.png" alt-text="Screenshot of selecting Environment settings and subscription." lightbox="media/concept-agentless-containers/environment-settings.png":::

1. Toggle on the status for the Defender CSPM plan, then select **Settings**.

    :::image type="content" source="media/concept-agentless-containers/enable-toggle-settings.png" alt-text="Screenshot of selecting the enable toggle for Defender CSPM." lightbox="media/concept-agentless-containers/enable-toggle-settings.png":::

1. Toggle on the **Agentless discovery for Kubernetes** and **Container registries vulnerability assessments** extensions, then select **Continue**.

    :::image type="content" source="media/concept-agentless-containers/settings-continue.png" alt-text="Screenshot of selecting agentless discovery for Kubernetes and Container registries vulnerability assessments." lightbox="media/concept-agentless-containers/settings-continue.png":::

1. In the Defender plans page, select **Save**.

Verify that the settings were saved successfully - a notification message pops up in the top right corner.

### Image scanning intervals

Agentless information in Defender CSPM is updated once an hour via snapshotting mechanism. It can take up to 24 hours to see results in Cloud Security Explorer and Attack Path.

- An image pushed or imported to ACR is scanned and the results are available up to 15 mins later.
- Any image that was pulled in the last 30 days is scanned on a weekly basis.
- Images that were pulled by a covered kubernetes cluster are scanned and the results are available up to 15 mins later.
- Images that are running on covered Kubernetes clusters are scanned on a weekly basis

## FAQ

## Next steps

This article explains how agentless container posture works.

Learn more about [Cloud Security Posture Management](concept-cloud-security-posture-management.md).
