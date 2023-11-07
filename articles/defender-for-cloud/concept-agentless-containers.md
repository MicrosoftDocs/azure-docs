---
title: Agentless container posture for Microsoft Defender for Cloud
description: Learn how agentless container posture offers discovery, visibility, and vulnerability assessment for containers without installing an agent on your machines.
ms.service: defender-for-cloud
ms.topic: conceptual
ms.date: 07/03/2023
ms.custom: template-concept
---

# Agentless container posture

Agentless container posture provides a holistic approach to improving your container posture within Defender CSPM (Cloud Security Posture Management). You can visualize and hunt for risks and threats to Kubernetes environments with attack path analysis and the cloud security explorer, and leverage agentless discovery and visibility within Kubernetes components.

Learn more about [CSPM](concept-cloud-security-posture-management.md).

## Capabilities

For support and prerequisites for agentless containers posture, see [Support and prerequisites for agentless containers posture](support-agentless-containers-posture.md).

Agentless container posture provides the following capabilities:

- [Agentless discovery and visibility](#agentless-discovery-and-visibility-within-kubernetes-components) within Kubernetes components.
- [Container registry vulnerability assessment](agentless-container-registry-vulnerability-assessment.md) provides vulnerability assessment for all container images, with near real-time scan of new images and daily refresh of results for maximum visibility to current and emerging vulnerabilities, enriched with exploitability insights, and added to Defender CSPM security graph for contextual risk assessment and calculation of attack paths.
- Using Kubernetes [attack path analysis](concept-attack-path.md) to visualize risks and threats to Kubernetes environments.
- Using [cloud security explorer](how-to-manage-cloud-security-explorer.md) for risk hunting by querying various risk scenarios, including viewing security insights, such as internet exposure, and other predefined security scenarios. For more information, search for `Kubernetes` in the [list of Insights](attack-path-reference.md#insights).

All of these capabilities are available as part of the [Defender CSPM](concept-cloud-security-posture-management.md) plan.

## Agentless discovery and visibility within Kubernetes components

Agentless discovery for Kubernetes provides API-based discovery of information about Kubernetes cluster architecture, workload objects, and setup. For more information, see [Agentless discovery for Kubernetes](defender-for-containers-introduction.md#agentless-discovery-for-kubernetes).

### What's the refresh interval?

Agentless information in Defender CSPM is updated through a snapshot mechanism. It can take up to **24 hours** to see results in attack paths and the cloud security explorer.

## Next steps

- Learn about [support and prerequisites for agentless containers posture](support-agentless-containers-posture.md)

- Learn how to [enable agentless containers](how-to-enable-agentless-containers.md)
