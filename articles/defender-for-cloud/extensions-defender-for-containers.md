---
title: Collect data from your workloads for Defender for Containers
description: Learn about how Defender for Containers collects data from your workloads to let you protect your workloads with Microsoft Defender for Cloud.
author: bmansheim
ms.author: benmansheim
ms.topic: conceptual
ms.date: 09/12/2022
---

# Collect data from your workloads for Defender for Containers

## Availability

This table shows the availability details for the components that are required for auto provisioning to provide the protections offered by [Microsoft Defender for Containers](defender-for-containers-introduction.md).

By default, auto provisioning is enabled when you enable Defender for Containers from the Azure portal.

| Aspect                                               | Azure Kubernetes Service clusters                                                      | Azure Arc-enabled Kubernetes clusters                                                       |
|------------------------------------------------------|----------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------|
| Release state:                                       | • Defender profile: GA<br> • Azure Policy add-on: Generally available (GA) | • Defender extension: Preview<br> • Azure Policy extension: Preview |
| Relevant Defender plan:                              | [Microsoft Defender for Containers](defender-for-containers-introduction.md)           | [Microsoft Defender for Containers](defender-for-containers-introduction.md)                |
| Required roles and permissions (subscription-level): | [Owner](../role-based-access-control/built-in-roles.md#owner) or [User Access Administrator](../role-based-access-control/built-in-roles.md#user-access-administrator)                          | [Owner](../role-based-access-control/built-in-roles.md#owner) or [User Access Administrator](../role-based-access-control/built-in-roles.md#user-access-administrator)                               |
| Supported destinations:                              | The AKS Defender profile only supports [AKS clusters that have RBAC enabled](../aks/concepts-identity.md#kubernetes-rbac).                                                                                   | [See Kubernetes distributions supported for Arc-enabled Kubernetes](supported-machines-endpoint-solutions-clouds-containers.md?tabs=azure-aks#kubernetes-distributions-and-configurations)             |
| Policy-based:                                        | :::image type="icon" source="./media/icons/yes-icon.png"::: Yes                        | :::image type="icon" source="./media/icons/yes-icon.png"::: Yes                             |
| Clouds:                                              | **Defender profile**:<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/no-icon.png"::: Azure Government, Azure China 21Vianet<br>**Azure Policy add-on**:<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Azure Government, Azure China 21Vianet|**Defender extension**:<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/no-icon.png"::: Azure Government, Azure China 21Vianet<br>**Azure Policy extension for Azure Arc**:<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/no-icon.png"::: Azure Government, Azure China 21Vianet|

[!INCLUDE [Legalese](../../includes/defender-for-cloud-preview-legal-text.md)]