---
title: Support and prerequisites for agentless container posture
description: Learn about the requirements for agentless container posture in Microsoft Defender for Cloud
ms.service: defender-for-cloud
ms.topic: conceptual
ms.date: 07/02/2023
---

# Support and prerequisites for agentless containers posture

All of the agentless container capabilities are available as part of the [Defender Cloud Security Posture Management](concept-cloud-security-posture-management.md) plan.

Review the requirements on this page before setting up [agentless containers posture](concept-agentless-containers.md) in Microsoft Defender for Cloud.

## Availability

| Aspect | Details |
|---------|---------|
|Release state:| General Availability (GA) |
|Pricing:|Requires [Defender Cloud Security Posture Management (CSPM)](concept-cloud-security-posture-management.md) and is billed as shown on the [pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/) |
| Clouds:    | :::image type="icon" source="./media/icons/yes-icon.png"::: Azure Commercial clouds<br> :::image type="icon" source="./media/icons/no-icon.png"::: Azure Government<br>:::image type="icon" source="./media/icons/no-icon.png"::: Microsoft Azure operated by 21Vianet<br>:::image type="icon" source="./media/icons/no-icon.png"::: Connected AWS accounts<br>:::image type="icon" source="./media/icons/no-icon.png"::: Connected GCP accounts         |
| Permissions | You need to have access as a:<br><br> - Subscription Owner, **or** <br> - User Access Admin and Security Admin permissions for the Azure subscription used for onboarding |

## Registries and images - powered by MDVM

[!INCLUDE [Registries and images support powered by MDVM](./includes/registries-images-mdvm.md)]

## Prerequisites

You need to have a Defender CSPM plan enabled. There's no dependency on Defender for Containers​.

This feature uses trusted access. Learn more about [AKS trusted access prerequisites](/azure/aks/trusted-access-feature#prerequisites).

### Are you using an updated version of AKS?

Learn more about [supported Kubernetes versions in Azure Kubernetes Service (AKS)](/azure/aks/supported-kubernetes-versions?tabs=azure-cli).

### Are attack paths triggered on workloads that are running on Azure Container Instances?

Attack paths are currently not triggered for workloads running on [Azure Container Instances](/azure/container-instances/).

## Next steps

Learn how to [enable agentless containers](how-to-enable-agentless-containers.md).
