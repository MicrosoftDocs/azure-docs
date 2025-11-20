---
title: Security awareness and Ubuntu Pro support in Azure Update Manager
description: Guidance on security awareness and Ubuntu Pro support in Azure Update Manager.
author: habibaum
ms.author: v-uhabiba
ms.service: azure-update-manager
ms.topic: overview
ms.date: 08/07/2025
ms.custom: sfi-image-nochange

# Customer intent: "As an IT administrator managing Ubuntu servers, I want to upgrade to Ubuntu Pro or migrate to a newer LTS version, so that I can ensure ongoing security updates and reduce vulnerabilities in my environment."
---

# Guidance on security awareness and Ubuntu Pro support

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers.


This article provides the details on security vulnerabilities and Ubuntu Pro support in Azure Update Manager.

If you are using an Ubuntu 18.04 LTS or Ubuntu 20.04 image, you should take necessary steps against security vulnerabilities as these operating systems have reached the end of their standard support in [May 2023](https://ubuntu.com/18-04/azure), and [May 2025](https://ubuntu.com/20-04/azure) respectively. As Canonical has stopped publishing new security or critical updates for these systems, the risk of systems and data to potential security threats is high. Without software updates, you may experience performance issues or compatibility issues whenever a new hardware or software is released.

For systems where the operating system has reached the [end of its standard support](https://ubuntu.com/about/release-cycle), such as Ubuntu 20.04 LTS, the risk is higher as security updates are no longer provided for the `Main` repository either.

To address potential patching disruptions, you can either **migrate to a newer version of LTS** or **enable Ubuntu Pro**. Migrating to a newer LTS version restores standard support for the `Main` repository. Enabling Ubuntu Pro provides [Expanded Security Maintenance (ESM)](https://ubuntu.com/security/esm), which delivers patches for the `Universe` repository on all LTS versions (`esm-apps`) and extends patching for the `Main` repository on systems that are past their standard support window (`esm-infra`).

## Ubuntu Pro on Azure Update Manager
 
Azure Update Manager assesses both Azure and Arc-enabled VMs to identify available security updates. It will highlight when an Ubuntu VM has vulnerabilities that can be patched by enabling Ubuntu Pro. This applies to vulnerabilities in the `Universe` repository for any LTS version, and to systems past their standard support period. For example, an Ubuntu Server 18.04 LTS instance on Azure Update Manager has information about upgrading to Ubuntu Pro.

:::image type="content" source="./media/security-awareness-ubuntu-support/ubuntu-pro-subscription-inline.png" alt-text="Screenshot of recommendation to subscribe to Ubuntu Pro in Azure Update Manager." lightbox="./media/security-awareness-ubuntu-support/ubuntu-pro-subscription-expanded.png":::

## How to enable Ubuntu Pro

You can perform an in-place upgrade to Ubuntu Pro on your existing VMs without downtime.

> [!TIP]
> For detailed instructions, follow the [official guide on how to upgrade to Ubuntu Pro for virtual machines on Azure](/azure/virtual-machines/workloads/canonical/ubuntu-pro-in-place-upgrade).

You can continue to use the Azure Update Manager [capabilities](updates-maintenance-schedules.md) to remain secure after migrating to a supported model from Canonical.

> [!NOTE]
> - [Ubuntu Pro](https://ubuntu.com/azure/pro) will provide the support on 18.04 LTS from Canonical until 2028 through Expanded Security Maintenance (ESM). You can also [upgrade to Ubuntu Pro from Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/canonical.0001-com-ubuntu-pro-bionic?tab=Overview) as well.
> - Ubuntu offers 22.04 LTS as a migration from 18.04 LTS. [Learn more](https://ubuntu.com/18-04/azure).
> - [Ubuntu Pro](https://ubuntu.com/azure/pro) will provide the support on 20.04 LTS from Canonical until 2030 through Expanded Security Maintenance (ESM). You can also [upgrade to Ubuntu Pro from Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/canonical.0001-com-ubuntu-pro-focal?tab=Overview) as well.
> - Ubuntu offers 22.04 LTS as a migration from 20.04 LTS. [Learn more](https://ubuntu.com/20-04/azure).

 
## Next steps
- Learn about the [supported regions for Azure VMs and Arc-enabled servers](supported-regions.md).
- Learn on the [Update sources, types](support-matrix.md) managed by Azure Update Manager.
- Know more on [supported OS and system requirements for machines managed by Azure Update Manager](support-matrix-updates.md).
- Learn on [Automatic VM guest patching](support-matrix-automatic-guest-patching.md).
- Learn more on [unsupported OS and Custom VM images](unsupported-workloads.md).
- Learn more on how to [configure Windows Update settings](configure-wu-agent.md) to work with Azure Update Manager. 
- Learn about [Extended Security Updates (ESU) using Azure Update Manager](extended-security-updates.md).
