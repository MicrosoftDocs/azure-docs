---
title: Support and prerequisites for agentless container posture - Microsoft Defender for Cloud
description: Learn about the requirements for agentless container posture in Microsoft Defender for Cloud
ms.service: defender-for-cloud
ms.topic: conceptual
ms.date: 05/30/2023
---
# Support and prerequisites for agentless containers posture

All of the agentless container capabilities are available as part of the [Defender Cloud Security Posture Management](concept-cloud-security-posture-management.md) plan.

Review the requirements on this page before setting up [agentless containers posture](concept-data-security-posture.md) in Microsoft Defender for Cloud.

> [!IMPORTANT]
> The Agentless Container Posture preview features are available on a self-service, opt-in basis. Previews are provided "as is" and "as available" and are excluded from the service-level agreements and limited warranty. Agentless Container Posture previews are partially covered by customer support on a best-effort basis. As such, these features aren't meant for production use.

## Availability

| Aspect | Details |
|---------|---------|
|Release state:|Preview|
|Pricing:|Requires [Defender Cloud Security Posture Management (CSPM)](concept-cloud-security-posture-management.md) and is billed as shown on the [pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/) |
| Clouds:    | :::image type="icon" source="./media/icons/yes-icon.png"::: Azure Commercial clouds<br> :::image type="icon" source="./media/icons/no-icon.png"::: Azure Government<br>:::image type="icon" source="./media/icons/no-icon.png"::: Azure China 21Vianet<br>:::image type="icon" source="./media/icons/no-icon.png"::: Connected AWS accounts<br>:::image type="icon" source="./media/icons/no-icon.png"::: Connected GCP accounts         |
| Permissions | You need to have access as a:<br><br> - Subscription Owner, **or** <br> - User Access Admin and Security Admin permissions for the Azure subscription used for onboarding |

## Registries and images

| Aspect | Details |
|--|--|
| Registries and images | **Supported**<br> • ACR registries <br> • [ACR registries protected with Azure Private Link](../container-registry/container-registry-private-link.md) (Private registries requires access to Trusted Services) <br> • Container images in Docker V2 format <br>  **Unsupported**<br>   • Super-minimalist images such as [Docker scratch](https://hub.docker.com/_/scratch/) images<br> • "Distroless" images that only contain an application and its runtime dependencies without a package manager, shell, or OS<br> is currently unsupported <br> • Images in [Open Container Initiative (OCI)](https://github.com/opencontainers/image-spec/blob/main/spec.md) format<br> <br>|
| OS Packages | **Supported** <br> • Alpine Linux 3.12-3.16 <br> • Red Hat Enterprise Linux 6-9 <br> • CentOS 6-9<br> • Oracle Linux 6-9 <br> • Amazon Linux 1, 2 <br> • openSUSE Leap, openSUSE Tumbleweed <br> • SUSE Enterprise Linux 11-15 <br> • Debian GNU/Linux 7-12 <br> • Ubuntu 12.04-22.04 <br>  • Fedora 31-37<br> • Mariner 1-2|
| Language specific packages <br><br>  | **Supported** <br> • Python <br> • Node.js <br> • .NET <br> • JAVA <br> • Go |

## Prerequisites

You need to have a Defender for CSPM plan enabled. There's no dependency on Defender for Containers​.

This feature uses trusted access. Learn more about [AKS trusted access prerequisites](/azure/aks/trusted-access-feature#prerequisites).

### Are you using an updated version of AKS?

Learn more about [supported Kubernetes versions in Azure Kubernetes Service (AKS)](/azure/aks/supported-kubernetes-versions?tabs=azure-cli).

## Next steps

Learn how to [enable agentless containers](how-to-enable-agentless-containers.md).
