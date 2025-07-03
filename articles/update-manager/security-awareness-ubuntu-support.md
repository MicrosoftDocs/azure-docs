---
title: Security awareness and Ubuntu Pro support in Azure Update Manager
description: Guidance on security awareness and Ubuntu Pro support in Azure Update Manager.
author: habibaum
ms.author: v-uhabiba
ms.service: azure-update-manager
ms.topic: overview
ms.date: 02/26/2025

---

# Guidance on security awareness and Ubuntu Pro support

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers.


This article provides the details on security vulnerabilities and Ubuntu Pro support in Azure Update Manager.

Standard Ubuntu Long-Term Support (LTS) provides security updates for packages in the `Main` repository. However, it does not include security patching from Canonical for the thousands of packages in the `Universe` repository. This can expose systems to security threats even on a fully patched, supported LTS version.

For systems where the operating system has reached the [end of its standard support](https://ubuntu.com/about/release-cycle), such as Ubuntu 20.04 LTS, the risk is higher as security updates are no longer provided for the `Main` repository either.

To address potential patching disruptions, you can either **migrate to a newer version of LTS** or **enable Ubuntu Pro**. Migrating to a newer LTS version restores standard support for the `Main` repository. Enabling Ubuntu Pro provides [Expanded Security Maintenance (ESM)](https://ubuntu.com/security/esm), which delivers patches for the `Universe` repository on all LTS versions (`esm-apps`) and extends patching for the `Main` repository on systems that are past their standard support window (`esm-infra`).


## Ubuntu Pro on Azure Update Manager
 
Azure Update Manager assesses both Azure and Arc-enabled VMs to identify available security updates. It will highlight when an Ubuntu VM has vulnerabilities that can be patched by enabling Ubuntu Pro. This applies to vulnerabilities in the `Universe` repository for any LTS version, and to systems past their standard support period. For example, an Ubuntu Server 18.04 LTS instance on Azure Update Manager has information about upgrading to Ubuntu Pro.

:::image type="content" source="./media/security-awareness-ubuntu-support/ubuntu-pro-subscription-inline.png" alt-text="Screenshot of recommendation to subscribe to Ubuntu Pro in Azure Update Manager." lightbox="./media/security-awareness-ubuntu-support/ubuntu-pro-subscription-expanded.png":::

You can continue to use the Azure Update Manager [capabilities](updates-maintenance-schedules.md) to remain secure after migrating to a supported model from Canonical.

> [!NOTE]
> For detailed information on Ubuntu LTS release cycles, end-of-support dates, and official upgrade paths, see the [Canonical Ubuntu LTS end of standard support guidance](/azure/virtual-machines/workloads/canonical/ubuntu-els-guidance).
> - Ubuntu offers 20.04 LTS and 22.04 LTS as a migration from 18.04 LTS. [Learn more](https://ubuntu.com/18-04/azure).

 
## Next steps
-- Learn about the [supported regions for Azure VMs and Arc-enabled servers](supported-regions.md).
- Learn on the [Update sources, types](support-matrix.md) managed by Azure Update Manager.
- Know more on [supported OS and system requirements for machines managed by Azure Update Manager](support-matrix-updates.md).
- Learn on [Automatic VM guest patching](support-matrix-automatic-guest-patching.md).
- Learn more on [unsupported OS and Custom VM images](unsupported-workloads.md).
- Learn more on how to [configure Windows Update settings](configure-wu-agent.md) to work with Azure Update Manager. 
- Learn about [Extended Security Updates (ESU) using Azure Update Manager](extended-security-updates.md).
