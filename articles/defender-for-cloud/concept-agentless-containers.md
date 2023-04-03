---
title: Agentless discovery and visibility for Containers using Microsoft Defender for Cloud
description: Learn how Defender for Cloud can gather information about your Containers without installing an agent on your machines.
ms.service: defender-for-cloud
ms.topic: conceptual
ms.date: 04/03/2023
ms.custom: template-concept
---

# Agentless Container Posture (Preview)

Identify security risks in containers and Kubernetes realms with an agentless discovery and visibility capability for Kubernetes and containers registries across SDLC and runtime, including container vulnerability assessment insights as part of the cloud security explorer and Kubernetes attack path analysis.

Learn about [Cloud Security Posture Management](concept-cloud-security-posture-management.md).

## Capabilities

- Enabling agentless discovery and visibility within Kubernetes parameters.
- Enabling agentless container registry [vulnerability assessment](defender-for-containers-vulnerability-assessment-azure.md), using the image scanning results of your Azure Container Registry (ACR) to enable queries on the Security Explorer.
- Viewing security insights, such as internet exposure, and other pre-defined security scenarios. For more information, see the [list of Insights](attack-path-reference.md).
- Using Cloud Security Explorer for risk hunting by querying various risk scenarios.
- Using Kubernetes attack path analysis to visualize risks and threats to Kubernetes environments.

All of these capabilities are available as part of the [Defender Cloud Security Posture Management](concept-cloud-security-posture-management.md) plan.

## Availability

| Aspect | Details |
|---------|---------|
|Release state:|Preview|
|Pricing:|Requires [Defender Cloud Security Posture Management (CSPM)](concept-cloud-security-posture-management.md) |
| Clouds:    | :::image type="icon" source="./media/icons/yes-icon.png"::: Azure Commercial clouds<br> :::image type="icon" source="./media/icons/no-icon.png"::: Azure Government<br>:::image type="icon" source="./media/icons/no-icon.png"::: Azure China 21Vianet<br>:::image type="icon" source="./media/icons/no-icon.png"::: Connected AWS accounts<br>:::image type="icon" source="./media/icons/no-icon.png"::: Connected GCP accounts        |

## Prerequisites

### Permissions

Subscription Owner, or, User Access Admin as well as Security Admin permissions for the Azure subscription used for onboarding.

### Environment requirements

You need to have:

- A Defender for CSPM plan enabled ​
- At least one AKS cluster with workload running - preferably one exposed to the internet based on an image deployed from ACR​

There's no dependency on Defender for Containers​.

## How agentless containers works

:::image type="content" source="media/concept-agentless-containers/diagram-permissions-architecture.png" alt-text="Diagram of the permissions architecture." lightbox="media/concept-agentless-containers/diagram-permissions-architecture.png":::

The system’s architecture is based on a snapshot mechanism at intervals.

By enabling **Agentless discovery for Kubernetes**, the following process occurs:

1. **Create**: MDC (Microsoft Defender for Cloud) creates an identity in customer environments called CloudPosture/securityOperator/DefenderCSPMSecurityOperator.
[https://learn.microsoft.com/azure/aks/trusted-access-feature](/azure/aks/trusted-access-feature)
1. **Assign**: MDC will assign 1 built-in role called **Kubernetes Agentless Operator** to that identity on subscription scope.

    The role contains the following permissions:
    - AKS read (Microsoft.ContainerService/managedClusters/read)
    - AKS Trusted Access with the following permissions:
        - Microsoft.ContainerService/managedClusters/trustedAccessRoleBindings/write
        - Microsoft.ContainerService/managedClusters/trustedAccessRoleBindings/read
        - Microsoft.ContainerService/managedClusters/trustedAccessRoleBindings/delete
        Learn more about [AKS Trusted Access](/azure/aks/trusted-access-feature).

1. **Discover**: Using this system assigned identity, MDC performs a discovery of the AKS clusters in your environment using API calls to the API server of AKS.

1. **Bind**: Upon discovery of an AKS cluster, MDC performs an AKS bind operation between the identity mentioned above and the Kubernetes role “Microsoft.Security/pricings/microsoft-defender-operator”.
The role is visible via API and gives MDC data plane read permission inside the cluster.

Agentless information in Defender CSPM is updated once an hour via snapshotting mechanism.

### Image scanning intervals

Add note about 24 hours.

- An image pushed or imported to ACR will be scanned and the results will be available up to 15 mins later.
- Any image that was pulled in the last 30 days will be scanned on a weekly basis.
- Images that were pulled by a covered kubernetes cluster will be scanned and the results will be available up to 15 mins later.
- Images that are running on covered Kubernetes clusters will be scanned on a weekly basis

## Onboarding Agentless Containers for CSPM

1. In the Azure portal, navigate to the Defender for Cloud's security Environments Settings page.

1. Select the subscription to onboard to the Defender CSPM plan.

    :::image type="content" source="media/concept-agentless-containers/environment-settings.png" alt-text="Screenshot of selecting Environment settings blade and subscription." lightbox="media/concept-agentless-containers/environment-settings.png":::

1. Enable the toggle for Defender CSPM plan and select the Settings button.

    :::image type="content" source="media/concept-agentless-containers/enable-toggle-settings.png" alt-text="Screenshot of selecting the enable toggle for Defender CSPM." lightbox="media/concept-agentless-containers/enable-toggle-settings.png":::

1. Verify that “Agentless discovery for Kubernetes” and “Container registries vulnerability assessments“ extensions are enabled. Then select the Continue button.

    :::image type="content" source="media/concept-agentless-containers/settings-continue.png" alt-text="Screenshot of selecting agentless discovery for Kubernetes and Container registries vulnerability assessments." lightbox="media/concept-agentless-containers/settings-continue.png":::

1. This takes you back to the Defender plans page; select Save and verify that settings were saved successfully (a notification message pops up in the top right corner).

## FAQ

## Next steps

This article explains how agentless scanning works and how it helps you collect data from your machines.

Learn more about how to [enable vulnerability assessment with agentless scanning](enable-vulnerability-assessment-agentless.md)
