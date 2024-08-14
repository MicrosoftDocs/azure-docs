---
title: Supported OS Images
description: Get a list of supported operating system images for remote NVMe.
ms.service: virtual-machines
ms.subservice: sizes
ms.date: 06/25/2024
ms.topic: how-to
ms.custom: template-how-to-pattern
---

# Supported OS images for remote NVMe

> [!NOTE]
> This article references CentOS, a Linux distribution that reached the end of support. Consider your use and plan accordingly. For more information, see the [guidance for CentOS end of support](~/articles/virtual-machines/workloads/centos/centos-end-of-life.md).

The following lists provide up-to-date information on which OS images are tagged as supported for remote NVM Express (NVMe).

> [!IMPORTANT]
> Only Gen2 VM images with security type "Standard" support NVMe. For more information, see [FAQ for NVMe](/azure/virtual-machines/enable-nvme-faqs#will-generation-1-vms-be-supported-with-nvme-disks-). Older operating systems cannot support NVMe due to OS driver limitations. If an older version of the OS is not included in the list below, it means that NVMe support is not present for that OS.

For specifics about which virtual machine (VM) generations support which storage types, check the [documentation about VM sizes in Azure](/azure/virtual-machines/sizes).

For more information about enabling the NVMe interface on virtual machines created in Azure, review the [FAQ for remote NVMe disks](/azure/virtual-machines/enable-nvme-remote-faqs).

## Supported Linux OS images

| Distribution                         | Image                                                            |
|--------------------------------------|------------------------------------------------------------------|
|     Almalinux 8.x (currently 8.7)    |   almalinux: almalinux:8-gen2: latest                            |
|     Almalinux 9.x (currently 9.1)    |   almalinux: almalinux:9-gen2: latest                            |
|     Debian 11                        |   Debian: debian-11:11-gen2: latest                              |
|     CentOS 7.9                       |   openlogic: centos:7_9-gen2: latest                             |
|     RHEL 7.9                         |   RedHat: RHEL:79-gen2: latest                                   |
|     RHEL 8.6                         |   RedHat: RHEL:86-gen2: latest                                   |
|     RHEL 8.7                         |   RedHat: RHEL:87-gen2: latest                                   |
|     RHEL 9.0                         |   RedHat: RHEL:90-gen2: latest                                   |
|     RHEL 9.1                         |   RedHat: RHEL:91-gen2: latest                                   |
|     Ubuntu 18.04                     |   Canonical:UbuntuServer:18_04-lts-gen2:latest                   |
|     Ubuntu 20.04                     |   Canonical:0001-com-ubuntu-server-focal:20_04-lts-gen2:latest   |
|     Ubuntu 22.04                     |   Canonical:0001-com-ubuntu-server-jammy:22_04-lts-gen2:latest   |
|     Oracle 7.9                       |   Oracle: Oracle-Linux:79-gen2:latest                       |
|     Oracle 8.5                       |   Oracle: Oracle-Linuz:ol85-lvm-gen2:latest                      |
|     Oracle 8.6                       |   Oracle: Oracle-Linux:ol86-lvm-gen2:latest                      |
|     Oracle 8.7                       |   Oracle: Oracle-Linux:ol87-lvm-gen2:latest                      |
|     Oracle 9.0                       |   Oracle: Oracle-Linux:ol9-lvm-gen2:latest                       |
|     Oracle 9.1                       |   Oracle: Oracle-Linux:ol91-lvm-gen2:latest                      |
|     SLES-for-SAP 15.3                |   SUSE:sles-sap-15-sp3:gen2:latest                               |
|     SLES-for-SAP 15.4                |   SUSE:sles-sap-15-sp4:gen2:latest                               |
|     SLES 15.4                        |   SUSE:sles-15-sp4:gen2:latest                                   |
|     SLES 15.5                        |   SUSE:sles-15-sp5:gen2:latest                                   |

## Supported Windows OS images
- Windows Server 2019
- Windows Server 2022
- Windows 10
- Windows 11

To download an image, go to [Azure Marketplace](https://ms.portal.azure.com/#view/Microsoft_Azure_Marketplace/MarketplaceOffersBlade/selectedMenuItemId/home).