---
title: Cross subscription patching in Azure Update Manager
description: Learn about the overview, benefits, and limitations of cross-subscription patching in Azure Update Manager. Centralize and streamline patch management across multiple Azure subscriptions.
ms.service: azure-update-manager
ms.date: 02/04/2025
ms.topic: conceptual
author: SnehaSudhirG
ms.author: sudhirsneha
---

# Cross-subscription patching in Azure Update Manager

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers.

Azure Update Management offers a straightforward and efficient solution for managing asset patching within a subscription. The capability is beneficial for organizations with resources distributed across various subscriptions, ensuring consistent and streamlined patch management.

However, its capabilities go well beyond this. With proper configuration, you can manage and apply patches across multiple Azure subscriptions from a centralized location. 

## Key benefits of Cross-subscription patching

- **Operational Efficiency**: You can centralize the management of patches, reducing the complexity and time required for patch management. This leads to more streamlined operations.
- **Improved Reliability**: Regular and consistent patching across all subscriptions helps maintain system stability and reduces downtime caused by unpatched vulnerabilities.

## Supported workloads

# [Supported resource type](#tab/sup-resource)

- **Azure Resource Manager (Arc)-connected hosts**: Non-Azure hosts connected to Azure through Arc, subject to [Arc prerequisites](/azure/azure-arc/servers/prerequisites) and Azure Update Manager [supported regions](support-matrix.md#azure-arc-enabled-servers)

- **Azure VM** - Native virtual machines created in Azure.

# [Supported OS type](#tab/sup-os)

- **Windows**: Cross-subscription patching supports various versions of Windows Server and Windows operating systems. Ensure that your Windows devices are up-to-date and compatible with the patching process. For more information, see [support matrix for Arc-connected hosts](support-matrix-updates.md#azure-arc-enabled-servers)and [Azure VM for supported images](support-matrix-updates.md#supported-windows-os-images). 

- **Linux**: Cross-subscription patching also supports multiple Linux distributions, including most mainstream distributions like Ubuntu, CentOS, and Red Hat Enterprise Linux (RHEL) etc. Ensure that your Linux devices meet the necessary requirements for patching. For more information, see[support matrix for Arc-connected hosts](support-matrix-updates.md#azure-arc-enabled-servers) and [Azure VM for supported images](support-matrix-updates.md#supported-linux-os-images). 

---

> [!NOTE]
> If VMs running unsupported images are included in the schedule, the maintenance configuration (i.e., patch job) will fail.


## Limitations

**Rate limits** - For managing a large number of assets through API/SPN (Service Principal Name), be mindful of rate limits and distribute the load among multiple Service principals to avoid throttling issues.


## Next steps

* Learn more on [how to enable cross-subscription patching either through Azure CLI or portal](enable-cross-subscription-patching.md).
* Learn more about [Dynamic scope](dynamic-scope-overview.md), an advanced capability of schedule patching.
* Learn about [pre and post events](pre-post-scripts-overview.md) to automatically perform tasks before and after a scheduled maintenance configuration.
