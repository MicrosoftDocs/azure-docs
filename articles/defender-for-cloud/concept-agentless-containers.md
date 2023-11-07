---
title: Agentless container posture in Defender CSPM
description: Learn how agentless container posture offers discovery, visibility, and vulnerability assessment for containers without installing an agent on your machines.
ms.service: defender-for-cloud
ms.topic: conceptual
ms.date: 11/07/2023
ms.custom: template-concept
---

# Agentless container posture in Defender CSPM

Agentless container posture provides easy and seamless visibility into your Kubernetes assets and security posture, with contextual risk analysis that empowers security teams to prioritize remediation based on actual risk behind security issues, and proactively hunt for posture issues.

## Capabilities

For support and prerequisites for agentless containers posture, see [Support and prerequisites for agentless containers posture](support-matrix-defender-for-containers.md).

Agentless container posture provides the following capabilities:

- **[Agentless discovery for Kubernetes](/azure/defender-for-cloud/defender-for-containers-enable#enablement-method-per-capability)** - provides zero footprint, API-based discovery of your Kubernetes clusters, their configurations, and deployments.
- **[Comprehensive inventory capabilities](how-to-manage-cloud-security-explorer.md#build-a-query-with-the-cloud-security-explorer)** - enables you to explore resources, pods, services, repositories, images, and configurations through [security explorer](how-to-manage-cloud-security-explorer.md#build-a-query-with-the-cloud-security-explorer) to easily monitor and manage your assets.
- **[Agentless vulnerability assessment](agentless-container-registry-vulnerability-assessment.md)** - provides vulnerability assessment for all container images, including recommendations for registry and runtime, near real-time scans of new images, daily refresh of results, exploitability insights, and more. Vulnerability information is added to the security graph for contextual risk assessment and calculation of attack paths, and hunting capabilities.
- **[Attack path analysis](concept-attack-path.md)** - Contextual risk assessment exposes exploitable paths that attackers might use to breach your environment and are reported as attack paths to help prioritize posture issues that matter most in your environment.
- **[Enhanced risk-hunting](how-to-manage-cloud-security-explorer.md)** - Enables security admins to actively hunt for posture issues in their containerized assets through queries (built-in and custom) and [security insights](attack-path-reference.md#insights) in the [security explorer](how-to-manage-cloud-security-explorer.md).
- **Control plane hardening** - Defender for Cloud continuously assesses the configurations of your clusters and compares them with the initiatives applied to your subscriptions. When it finds misconfigurations, Defender for Cloud generates security recommendations that are available on Defender for Cloud's Recommendations page. The recommendations let you investigate and remediate issues. For details on the recommendations included with this capability, check out the [containers section](recommendations-reference.md#recs-container) of the recommendations reference table for recommendations of the type **control plane**.

### What's the refresh interval for Agentless discovery of Kubernetes?

It can take up to **24 hours** for changes to reflect in the security graph, attack paths, and the security explorer.

## Next steps

- Learn about [support and prerequisites for agentless containers posture](support-matrix-defender-for-containers.md)

- Learn how to [enable agentless containers](how-to-enable-agentless-containers.md)

- Learn more about [CSPM](concept-cloud-security-posture-management.md).
