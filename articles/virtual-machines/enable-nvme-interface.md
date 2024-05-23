---
title: OS Images Supported
description: OS Image Support List for Remote NVMe
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: how-to #Required; leave this attribute/value as-is.
ms.custom: template-how-to-pattern
---

# OS Images Supported with Remote NVMe

> [!CAUTION]
> This article references CentOS, a Linux distribution that is nearing End Of Life (EOL) status. Please consider your use and plan accordingly. For more information, see the [CentOS End Of Life guidance](~/articles/virtual-machines/workloads/centos/centos-end-of-life.md).

The following lists provide up-to-date information on which OS images are tagged as NVMe supported. These lists will be updated when new OS images are made available with remote NVMe support.

Always check the [detailed product pages for specifics](/azure/virtual-machines/sizes) about which VM generations support which storage types. 

For more information about enabling the NVMe interface on virtual machines created in Azure, be sure to review the [Remote NVMe Disks FAQ](/azure/virtual-machines/enable-nvme-remote-faqs).

## OS Images supported

### Linux

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


### Windows

- [Azure portal - Plan ID: 2019-datacenter-core-smalldisk](https://portal.azure.com/#create/Microsoft.smalldiskWindowsServer2019DatacenterServerCore)
- [Azure portal - Plan ID: 2019-datacenter-core-smalldisk-g2](https://portal.azure.com/#create/Microsoft.smalldiskWindowsServer2019DatacenterServerCore2019-datacenter-core-smalldisk-g2)
- [Azure portal - Plan ID: 2019 datacenter-core](https://portal.azure.com/#create/Microsoft.WindowsServer2019DatacenterServerCore)
- [Azure portal - Plan ID: 2019-datacenter-core-g2](https://portal.azure.com/#create/Microsoft.WindowsServer2019DatacenterServerCore2019-datacenter-core-g2)
- [Azure portal - Plan ID: 2019-datacenter-core-with-containers-smalldisk](https://portal.azure.com/#create/Microsoft.smalldiskWindowsServer2019DatacenterServerCorewithContainers)
- [Azure portal - Plan ID: 2019-datacenter-core-with-containers-smalldisk-g2](https://portal.azure.com/#create/Microsoft.smalldiskWindowsServer2019DatacenterServerCorewithContainers2019-datacenter-core-with-containers-smalldisk-g2)
- [Azure portal - Plan ID: 2019-datacenter-with-containers-smalldisk](https://portal.azure.com/#create/Microsoft.smalldiskWindowsServer2019DatacenterwithContainers2019-datacenter-with-containers-smalldisk-g2)
- [Azure portal - Plan ID: 2019-datacenter-smalldisk](https://portal.azure.com/#create/Microsoft.smalldiskWindowsServer2019Datacenter)
- [Azure portal - Plan ID: 2019-datacenter-smalldisk-g2](https://portal.azure.com/#create/Microsoft.smalldiskWindowsServer2019Datacenter2019-datacenter-smalldisk-g2)
- [Azure portal - Plan ID: 2019-datacenter-zhcn](https://portal.azure.com/#create/Microsoft.WindowsServer2019Datacenterzhcn)
- [Azure portal - Plan ID: 2019-datacenter-zhcn-g2](https://portal.azure.com/#create/Microsoft.WindowsServer2019Datacenterzhcn2019-datacenter-zhcn-g2)
- [Azure portal - Plan ID: 2019-datacenter-core-with-containers](https://portal.azure.com/#create/Microsoft.WindowsServer2019DatacenterServerCorewithContainers)
- [Azure portal - Plan ID: 2019-datacenter-core-with-containers-g2](https://portal.azure.com/#create/Microsoft.WindowsServer2019DatacenterServerCorewithContainers2019-datacenter-core-with-containers-g2)
- [Azure portal - Plan ID: 2019-datacenter-with-containers](https://portal.azure.com/#create/Microsoft.WindowsServer2019DatacenterwithContainers)
- [Azure portal - Plan ID: 2019-datacenter-with-containers-g2](https://portal.azure.com/#create/Microsoft.WindowsServer2019DatacenterwithContainers2019-datacenter-with-containers-g2)
- [Azure portal - Plan ID: 2019-datacenter](https://portal.azure.com/#create/Microsoft.WindowsServer2019Datacenter)
- [Azure portal - Plan ID: 2019-datacenter-gensecond](https://portal.azure.com/#create/Microsoft.WindowsServer2019Datacenter2019-datacenter-gensecond)
- [Azure portal - Plan ID: 2022-datacenter-core](https://portal.azure.com/#create/microsoftwindowsserver.windowsserver2022-datacenter-core)
- [Azure portal - Plan ID: 2022-datacenter-core-g2](https://portal.azure.com/#create/microsoftwindowsserver.windowsserver2022-datacenter-core-g2)
- [Azure portal - Plan ID: 2022-datacenter-smalldisk](https://portal.azure.com/#create/microsoftwindowsserver.windowsserver2022-datacenter-smalldisk)
- [Azure portal - Plan ID: 2022-datacenter-smalldisk-g2](https://portal.azure.com/#create/microsoftwindowsserver.windowsserver2022-datacenter-smalldisk-g2)
- [Azure portal - Plan ID: 2022-datacenter](https://portal.azure.com/#create/microsoftwindowsserver.windowsserver2022-datacenter)
- [Azure portal - Plan ID: 2022-datacenter-g2](https://portal.azure.com/#create/microsoftwindowsserver.windowsserver2022-datacenter-g2)
- [Azure portal - Plan ID: 2022-datacenter-core-smalldisk](https://portal.azure.com/#create/microsoftwindowsserver.windowsserver2022-datacenter-core-smalldisk)
- [Azure portal - Plan ID: 2022-datacenter-core-smalldisk-g2](https://portal.azure.com/#create/microsoftwindowsserver.windowsserver2022-datacenter-core-smalldisk-g2)
- [Azure portal - Plan ID: 2022-datacenter-azure-edition-smalldisk](https://portal.azure.com/#create/microsoftwindowsserver.windowsserver2022-datacenter-azure-edition-smalldisk)
- [Azure portal - Plan ID: 2022-datacenter-azure-edition](https://portal.azure.com/#create/microsoftwindowsserver.windowsserver2022-datacenter-azure-edition)
- [Azure portal - Plan ID: 2022-datacenter-azure-edition-core](https://portal.azure.com/#create/microsoftwindowsserver.windowsserver2022-datacenter-azure-edition-core)
- [Azure portal - Plan 2022-datacenter-azure-edition-core-smalldisk](https://portal.azure.com/#create/microsoftwindowsserver.windowsserver2022-datacenter-azure-edition-core-smalldisk)
