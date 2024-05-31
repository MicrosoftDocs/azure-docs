---
title: CentOS end-of-life (EOL) guidance
description: Understand your options for moving CentOS workloads
author: clausw
ms.service: virtual-machines
ms.subservice: vm-linux-setup-configuration
ms.custom: linux-related-content, linux-related-content
ms.collection: linux
ms.topic: article
ms.date: 12/1/2023
ms.author: chasecrum
---
# CentOS End-Of-Life guidance

In September 2019, Red Hat announced its intent to sunset CentOS and replace it with CentOS Stream. For more information, see  [Transforming the development experience within CentOS](https://www.redhat.com/en/blog/transforming-development-experience-within-centos)

CentOS 7 and 8 are the final releases of CentOS Linux. The end-of-life dates for CentOS 7 and 8 are:

- CentOS 8 - December 31, 2021
- CentOS 7 - June 30, 2024

## Impact for CentOS users

Workloads running on these CentOS versions need to migrate to alternate platforms to continue to get updates and security patches.

## Migration options

There are several options for CentOS customers to move to a supported OS. The decision of where and how to migrate depends on:

- Whether you need to retain compatibility with CentOS / Red Hat Enterprise Linux (RHEL)
- Prefer a community supported distribution vs. commercial distribution (for example Red Hat Enterprise Linux or RHEL)
- The configuration and image source(s) of your CentOS estate in Azure

If you need to keep CentOS compatibility, migration to Red Hat Enterprise Linux, a commercial distribution, is a low-risk option. There are also several choices such as Oracle Linux, Alma Linux, Rocky Linux, etc.

If your workload runs on many distributions, you may want to consider moving to another distribution, either community based or commercial.

While you evaluate your end state, consider whether performing an in-place conversion (many distributions give tools for this purpose) is preferable vs. taking this opportunity to start with a clean slate and a new VM / OS / image. Microsoft recommends starting with a fresh VM / OS.

There are also several companies offering extended support for CentOS 7, which may give you more time to migrate.<br>

- SUSE: [Liberty Linux: Proven enterprise support for RHEL & CentOS | SUSE](https://www.suse.com/products/suse-liberty-linux/)
- OpenLogic: [Enterprise Linux Support](https://www.openlogic.com/solutions/enterprise-linux-support/centos)
- TuxCare: [Extended Lifecycle Support](https://docs.tuxcare.com/extended-lifecycle-support/)

See the [Endorsed Distribution](../..//linux/endorsed-distros.md) page for details on Azure endorsed distributions and images.

## CentOS compatible distributions

| **Distribution** | **Description** | **Azure Images** | **Support Model** |
|---|---|---|---|
| **Red Hat Enterprise Linux** | Best binary compatible OS w/ support and EUS available. <br/> [Migration offer](https://azuremarketplace.microsoft.com/marketplace/apps/redhat.rh-rhel-migration?tab=Overview) available in the Azure Marketplace.<br/> [Conversion tool](https://www.redhat.com/en/technologies/linux-platforms/enterprise-linux/migration-process/convert2rhel-how-to-convert-from-centos-linux-to-red-hat-enterprise-linux) available from Red Hat.<br/> [Multiple offers and images](../redhat/overview.md) | Yes PAYG, BYOS, ARM64 | Commercial, integrated support |
| **AlmaLinux** | Official community images: <br/> [AlmaLinux OS (x86_64/AMD64)](https://azuremarketplace.microsoft.com/marketplace/apps/almalinux.almalinux-x86_64?tab=Overview)<br/> [AlmaLinux OS (AArch64/Arm64)](https://azuremarketplace.microsoft.com/marketplace/apps/almalinux.almalinux-arm?tab=Overview)<br/> [AlmaLinux HPC](https://azuremarketplace.microsoft.com/marketplace/apps/almalinux.almalinux-hpc?tab=Overview)<br/> [Conversion tool](https://wiki.almalinux.org/documentation/migration-guide.html#how-to-migrate) available from AlmaLinux. | Yes (multiple publishers) | Community, commercial support by third parties |
| **Oracle Linux** | [Migration tooling and guidance](https://docs.oracle.com/en/learn/switch_centos7_ol7/index.html#introduction) available from Oracle. | Yes BYOS | Community and commercial |
| **Rocky Linux** | Official community images:<br/>[Rocky Linux for x86_64 (AMD64) - Official](https://azuremarketplace.microsoft.com/marketplace/apps/resf.rockylinux-x86_64?tab=PlansAndPrice)<br/> [Conversion tool](https://docs.rockylinux.org/guides/migrate2rocky/) available from Rocky.| Yes (multiple publishers), BYOS, ARM64 | Community and commercial |

> [!CAUTION]
> If you perform an in-place major version update following a migration (e.g. CentOS 7 -> RHEL 7 -> RHEL 8) there will be a disconnection between the data plane and the **[control plane](/azure/architecture/guide/multitenant/considerations/control-planes)** of the virtual machine (VM). Azure capabilities such as **[Auto guest patching](/azure/virtual-machines/automatic-vm-guest-patching)**, **[Auto OS image upgrades](/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-automatic-upgrade)**, **[Hotpatching](/windows-server/get-started/hotpatch?toc=%2Fazure%2Fvirtual-machines%2Ftoc.json)**, and **[Azure Update Manager](/azure/update-manager/overview)** won't be available. To utilize these features, it's recommended to create a new VM using your preferred operating system instead of performing an in-place upgrade.
> > [!NOTE]
> - “Binary compatible” (Application Binary Interface or ABI) means based on the same upstream distribution (Fedora). There is no guarantee of bug for bug compatibility.
- For a full list of endorsed Linux Distributions on Azure see: [Linux distributions endorsed on Azure - Azure Virtual Machines | Microsoft Learn](../../linux/endorsed-distros.md)
- For details on Red Hat & Microsoft Integrated Support see: Microsoft and Red Hat Partner and Deliver Integrated Support, a Unique Offering in the IT World | Microsoft Learn

## Alternate distributions

| **Distribution** | **Description** | **Azure Images** | **Support Model(s)** |
|---|---|---|---|
| **CentOS Stream** | Official replacement for CentOS, upstream vs. downstream of RHEL. [CentOS Stream](https://www.centos.org/centos-stream/) | Community Gallery | Community |
| **Fedora** | Upstream project for CentOS stream and RHEL. [Fedora Linux &#124; The Fedora Project](https://www.fedoraproject.org/) | Community Gallery | Community |
| **SUSE / OpenSUSE** | SUSE Enterprise Linux (SLES) is SUSE’s commercial Linux distribution. | Yes PAYG, BYOS, ARM64 | Community (OpenSUSE), commercial and integrated (SLES) |
| **Ubuntu (Server / Pro)** | Both free (Server) and paid (Pro) versions available. In place conversion from Server to Pro possible: [In-place upgrade to Ubuntu Pro Linux images on Azure - Azure Virtual Machines &#124; Microsoft Learn](../canonical/ubuntu-pro-in-place-upgrade.md) | Yes PAYG, BYOS, ARM64 | Community (server), commercial and integrated (Pro) |
| **Debian** | Community  Linux Distribution. | Yes (multiple publishers) | Community |
| **Flatcar** | Community Container Linux | Yes | Community |

## Migrating your systems and workloads

### Stay CentOS compatible

If you stay CentOS compatible and have picked a distribution, you need to decide whether you want to perform an in-place conversion or start with a fresh VM (redeploy).

Many CentOS compatible distributions have conversions utilities that assess the system and perform the replacement of binaries and update the content source.

If you move to a commercial distribution, you may need a valid subscription / license to perform the conversion.

As you consider whether to convert your VM in-place vs redeploying, the way you created your VM in Azure becomes important.

**Converting a custom VM**

If you created your own VM for use in Azure, no software billing information is present in your VM. You're likely OK to convert it in place (after a backup and any necessary prerequisites and updates).

OpenLogic by Perforce Azure Marketplace offers:

- [CentOS-based](https://azuremarketplace.microsoft.com/marketplace/apps/openlogic.centos?tab=Overview)

- [CentOS-based HPC](https://azuremarketplace.microsoft.com/marketplace/apps/openlogic.centos-hpc?tab=Overview)

- [CentOS-based LVM](https://azuremarketplace.microsoft.com/marketplace/apps/openlogic.centos-lvm?tab=Overview)

These are the official / endorsed CentOS images in Azure, and don't have software billing information associated. They're candidates for an in-place conversion (after a backup and any necessary prerequisites and updates).

**Other Azure Marketplace offers**

There's a multitude of CentOS based offers from various publishers available in the Azure Marketplace. They range from simple OS only offers to various bundled offers with more software, desktop versions and configurations for specific cases (for example CIS hardened images).

Some of these offers do have a price tag associated, and can include services such as end customer support etc.

If you convert a system with a price associated, you'll continue to pay the original price after conversion. Even if you have a separate subscription or license for the converted system, you may be double paying.

Check with your image provider whether they recommend / support an in-place upgrade or have further guidance.

### Changing distributions

If you're moving to another distribution, you need to redeploy your Virtual Machines and workloads. Make sure to look at the [Microsoft Cloud Adoption Framework](https://azure.microsoft.com/solutions/cloud-enablement/cloud-adoption-framework) for Azure for guidance, best practices and templates to deploy your solution in Azure.

### Modernize

The end-of-life moment for CentOS may also be an opportunity for you to consider modernizing your workload, move to a PaaS, SaaS or containerized solution.

[What is Application Modernization? | Microsoft Azure](https://azure.microsoft.com/resources/cloud-computing-dictionary/what-is-application-modernization/)
