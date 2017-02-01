---
title: Azure Virtual Machines deployment for SAP on Linux | Microsoft Docs
description: Learn how to deploy SAP software on Linux virtual machines in Azure.
services: virtual-machines-linux
documentationcenter: ''
author: MSSedusch
manager: timlt
editor: ''
tags: azure-resource-manager
keywords: ''

ms.assetid: 1c4f1951-3613-4a5a-a0af-36b85750c84e
ms.service: virtual-machines-linux
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 11/08/2016
ms.author: sedusch

---
# Deploy SAP software on Linux virtual machines in Azure
[767598]:https://launchpad.support.sap.com/#/notes/767598
[773830]:https://launchpad.support.sap.com/#/notes/773830
[826037]:https://launchpad.support.sap.com/#/notes/826037
[965908]:https://launchpad.support.sap.com/#/notes/965908
[1031096]:https://launchpad.support.sap.com/#/notes/1031096
[1139904]:https://launchpad.support.sap.com/#/notes/1139904
[1173395]:https://launchpad.support.sap.com/#/notes/1173395
[1245200]:https://launchpad.support.sap.com/#/notes/1245200
[1409604]:https://launchpad.support.sap.com/#/notes/1409604
[1558958]:https://launchpad.support.sap.com/#/notes/1558958
[1585981]:https://launchpad.support.sap.com/#/notes/1585981
[1588316]:https://launchpad.support.sap.com/#/notes/1588316
[1590719]:https://launchpad.support.sap.com/#/notes/1590719
[1597355]:https://launchpad.support.sap.com/#/notes/1597355
[1605680]:https://launchpad.support.sap.com/#/notes/1605680
[1619720]:https://launchpad.support.sap.com/#/notes/1619720
[1619726]:https://launchpad.support.sap.com/#/notes/1619726
[1619967]:https://launchpad.support.sap.com/#/notes/1619967
[1750510]:https://launchpad.support.sap.com/#/notes/1750510
[1752266]:https://launchpad.support.sap.com/#/notes/1752266
[1757924]:https://launchpad.support.sap.com/#/notes/1757924
[1757928]:https://launchpad.support.sap.com/#/notes/1757928
[1758182]:https://launchpad.support.sap.com/#/notes/1758182
[1758496]:https://launchpad.support.sap.com/#/notes/1758496
[1772688]:https://launchpad.support.sap.com/#/notes/1772688
[1814258]:https://launchpad.support.sap.com/#/notes/1814258
[1882376]:https://launchpad.support.sap.com/#/notes/1882376
[1909114]:https://launchpad.support.sap.com/#/notes/1909114
[1922555]:https://launchpad.support.sap.com/#/notes/1922555
[1928533]:https://launchpad.support.sap.com/#/notes/1928533
[1941500]:https://launchpad.support.sap.com/#/notes/1941500
[1956005]:https://launchpad.support.sap.com/#/notes/1956005
[1973241]:https://launchpad.support.sap.com/#/notes/1973241
[1984787]:https://launchpad.support.sap.com/#/notes/1984787
[1999351]:https://launchpad.support.sap.com/#/notes/1999351
[2002167]:https://launchpad.support.sap.com/#/notes/2002167
[2015553]:https://launchpad.support.sap.com/#/notes/2015553
[2039619]:https://launchpad.support.sap.com/#/notes/2039619
[2121797]:https://launchpad.support.sap.com/#/notes/2121797
[2134316]:https://launchpad.support.sap.com/#/notes/2134316
[2178632]:https://launchpad.support.sap.com/#/notes/2178632
[2191498]:https://launchpad.support.sap.com/#/notes/2191498
[2233094]:https://launchpad.support.sap.com/#/notes/2233094
[2243692]:https://launchpad.support.sap.com/#/notes/2243692
[2367194]:https://launchpad.support.sap.com/#/notes/2367194

[azure-cli]:../xplat-cli-install.md
[azure-portal]:https://portal.azure.com
[azure-ps]:/powershell/azureps-cmdlets-docs
[azure-quickstart-templates-github]:https://github.com/Azure/azure-quickstart-templates
[azure-script-ps]:https://go.microsoft.com/fwlink/p/?LinkID=395017
[azure-subscription-service-limits]:../azure-subscription-service-limits.md
[azure-subscription-service-limits-subscription]:../azure-subscription-service-limits.md#subscription-limits

[dbms-guide]:virtual-machines-linux-sap-dbms-guide.md (Azure Virtual Machines DBMS deployment for SAP on Linux)
[dbms-guide-2.1]:virtual-machines-linux-sap-dbms-guide.md#c7abf1f0-c927-4a7c-9c1d-c7b5b3b7212f (Caching for VMs and VHDs)
[dbms-guide-2.2]:virtual-machines-linux-sap-dbms-guide.md#c8e566f9-21b7-4457-9f7f-126036971a91 (Software RAID)
[dbms-guide-2.3]:virtual-machines-linux-sap-dbms-guide.md#10b041ef-c177-498a-93ed-44b3441ab152 (Microsoft Azure Storage)
[dbms-guide-2]:virtual-machines-linux-sap-dbms-guide.md#65fa79d6-a85f-47ee-890b-22e794f51a64 (Structure of a RDBMS Deployment)
[dbms-guide-3]:virtual-machines-linux-sap-dbms-guide.md#871dfc27-e509-4222-9370-ab1de77021c3 (High Availability and Disaster Recovery with Azure VMs)
[dbms-guide-5.5.1]:virtual-machines-linux-sap-dbms-guide.md#0fef0e79-d3fe-4ae2-85af-73666a6f7268 (SQL Server 2012 SP1 CU4 and later)
[dbms-guide-5.5.2]:virtual-machines-linux-sap-dbms-guide.md#f9071eff-9d72-4f47-9da4-1852d782087b (SQL Server 2012 SP1 CU3 and earlier releases)
[dbms-guide-5.6]:virtual-machines-linux-sap-dbms-guide.md#1b353e38-21b3-4310-aeb6-a77e7c8e81c8 (Using a SQL Server images out of the Microsoft Azure Marketplace)
[dbms-guide-5.8]:virtual-machines-linux-sap-dbms-guide.md#9053f720-6f3b-4483-904d-15dc54141e30 (General SQL Server for SAP on Azure Summary)
[dbms-guide-5]:virtual-machines-linux-sap-dbms-guide.md#3264829e-075e-4d25-966e-a49dad878737 (Specifics to SQL Server RDBMS)
[dbms-guide-8.4.1]:virtual-machines-linux-sap-dbms-guide.md#b48cfe3b-48e9-4f5b-a783-1d29155bd573 (Storage configuration)
[dbms-guide-8.4.2]:virtual-machines-linux-sap-dbms-guide.md#23c78d3b-ca5a-4e72-8a24-645d141a3f5d (Backup and Restore)
[dbms-guide-8.4.3]:virtual-machines-linux-sap-dbms-guide.md#77cd2fbb-307e-4cbf-a65f-745553f72d2c (Performance Considerations for Backup and Restore)
[dbms-guide-8.4.4]:virtual-machines-linux-sap-dbms-guide.md#f77c1436-9ad8-44fb-a331-8671342de818 (Other)
[dbms-guide-900-sap-cache-server-on-premises]:virtual-machines-linux-sap-dbms-guide.md#642f746c-e4d4-489d-bf63-73e80177a0a8

[dbms-guide-figure-100]:./media/virtual-machines-shared-sap-dbms-guide/100_storage_account_types.png
[dbms-guide-figure-200]:./media/virtual-machines-shared-sap-dbms-guide/200-ha-set-for-dbms-ha.png
[dbms-guide-figure-300]:./media/virtual-machines-shared-sap-dbms-guide/300-reference-config-iaas.png
[dbms-guide-figure-400]:./media/virtual-machines-shared-sap-dbms-guide/400-sql-2012-backup-to-blob-storage.png
[dbms-guide-figure-500]:./media/virtual-machines-shared-sap-dbms-guide/500-sql-2012-backup-to-blob-storage-different-containers.png
[dbms-guide-figure-600]:./media/virtual-machines-shared-sap-dbms-guide/600-iaas-maxdb.png
[dbms-guide-figure-700]:./media/virtual-machines-shared-sap-dbms-guide/700-livecach-prod.png
[dbms-guide-figure-800]:./media/virtual-machines-shared-sap-dbms-guide/800-azure-vm-sap-content-server.png
[dbms-guide-figure-900]:./media/virtual-machines-shared-sap-dbms-guide/900-sap-cache-server-on-premises.png

[deployment-guide]:virtual-machines-linux-sap-deployment-guide.md (SAP NetWeaver on Linux virtual machines (VMs) – Deployment Guide)
[deployment-guide-2.2]:virtual-machines-linux-sap-deployment-guide.md#42ee2bdb-1efc-4ec7-ab31-fe4c22769b94 (SAP Resources)
[deployment-guide-3.1.2]:virtual-machines-linux-sap-deployment-guide.md#3688666f-281f-425b-a312-a77e7db2dfab (Deploying a VM with a custom image)
[deployment-guide-3.2]:virtual-machines-linux-sap-deployment-guide.md#db477013-9060-4602-9ad4-b0316f8bb281 (Scenario 1: Deploying a VM from the Azure Marketplace for SAP)
[deployment-guide-3.3]:virtual-machines-linux-sap-deployment-guide.md#54a1fc6d-24fd-4feb-9c57-ac588a55dff2 (Scenario 2: Deploying a VM with a custom image for SAP)
[deployment-guide-3.4]:virtual-machines-linux-sap-deployment-guide.md#a9a60133-a763-4de8-8986-ac0fa33aa8c1 (Scenario 3: Moving a VM from on-premises using a non-generalized Azure VHD with SAP)
[deployment-guide-3]:virtual-machines-linux-sap-deployment-guide.md#b3253ee3-d63b-4d74-a49b-185e76c4088e (Deployment Scenarios of VMs for SAP on Microsoft Azure)
[deployment-guide-4.1]:virtual-machines-linux-sap-deployment-guide.md#604bcec2-8b6e-48d2-a944-61b0f5dee2f7 (Deploying Azure PowerShell cmdlets)
[deployment-guide-4.2]:virtual-machines-linux-sap-deployment-guide.md#7ccf6c3e-97ae-4a7a-9c75-e82c37beb18e (Download and Import SAP relevant PowerShell cmdlets)
[deployment-guide-4.3]:virtual-machines-linux-sap-deployment-guide.md#31d9ecd6-b136-4c73-b61e-da4a29bbc9cc (Join VM into on-premises Domain - Windows only)
[deployment-guide-4.4.2]:virtual-machines-linux-sap-deployment-guide.md#6889ff12-eaaf-4f3c-97e1-7c9edc7f7542 (Linux)
[deployment-guide-4.4]:virtual-machines-linux-sap-deployment-guide.md#c7cbb0dc-52a4-49db-8e03-83e7edc2927d (Download, Install and enable Azure VM Agent)
[deployment-guide-4.5.1]:virtual-machines-linux-sap-deployment-guide.md#987cf279-d713-4b4c-8143-6b11589bb9d4 (Azure PowerShell)
[deployment-guide-4.5.2]:virtual-machines-linux-sap-deployment-guide.md#408f3779-f422-4413-82f8-c57a23b4fc2f (Azure CLI)
[deployment-guide-4.5]:virtual-machines-linux-sap-deployment-guide.md#d98edcd3-f2a1-49f7-b26a-07448ceb60ca (Configure Azure Enhanced Monitoring Extension for SAP)
[deployment-guide-5.1]:virtual-machines-linux-sap-deployment-guide.md#bb61ce92-8c5c-461f-8c53-39f5e5ed91f2 (Readiness Check for Azure Enhanced Monitoring for SAP)
[deployment-guide-5.2]:virtual-machines-linux-sap-deployment-guide.md#e2d592ff-b4ea-4a53-a91a-e5521edb6cd1 (Health check for Azure Monitoring Infrastructure Configuration)
[deployment-guide-5.3]:virtual-machines-linux-sap-deployment-guide.md#fe25a7da-4e4e-4388-8907-8abc2d33cfd8 (Further troubleshooting of Azure Monitoring infrastructure for SAP)

[deployment-guide-configure-monitoring-scenario-1]:virtual-machines-linux-sap-deployment-guide.md#ec323ac3-1de9-4c3a-b770-4ff701def65b (Configure Monitoring)
[deployment-guide-configure-proxy]:virtual-machines-linux-sap-deployment-guide.md#baccae00-6f79-4307-ade4-40292ce4e02d (Configure Proxy)
[deployment-guide-figure-100]:./media/virtual-machines-shared-sap-deployment-guide/100-deploy-vm-image.png
[deployment-guide-figure-1000]:./media/virtual-machines-shared-sap-deployment-guide/1000-service-properties.png
[deployment-guide-figure-11]:virtual-machines-linux-sap-deployment-guide.md#figure-11
[deployment-guide-figure-1100]:./media/virtual-machines-shared-sap-deployment-guide/1100-azperflib.png
[deployment-guide-figure-1200]:./media/virtual-machines-shared-sap-deployment-guide/1200-cmd-test-login.png
[deployment-guide-figure-1300]:./media/virtual-machines-shared-sap-deployment-guide/1300-cmd-test-executed.png
[deployment-guide-figure-14]:virtual-machines-linux-sap-deployment-guide.md#figure-14
[deployment-guide-figure-1400]:./media/virtual-machines-shared-sap-deployment-guide/1400-azperflib-error-servicenotstarted.png
[deployment-guide-figure-300]:./media/virtual-machines-shared-sap-deployment-guide/300-deploy-private-image.png
[deployment-guide-figure-400]:./media/virtual-machines-shared-sap-deployment-guide/400-deploy-using-disk.png
[deployment-guide-figure-5]:virtual-machines-linux-sap-deployment-guide.md#figure-5
[deployment-guide-figure-50]:./media/virtual-machines-shared-sap-deployment-guide/50-forced-tunneling-suse.png
[deployment-guide-figure-500]:./media/virtual-machines-shared-sap-deployment-guide/500-install-powershell.png
[deployment-guide-figure-6]:virtual-machines-linux-sap-deployment-guide.md#figure-6
[deployment-guide-figure-600]:./media/virtual-machines-shared-sap-deployment-guide/600-powershell-version.png
[deployment-guide-figure-7]:virtual-machines-linux-sap-deployment-guide.md#figure-7
[deployment-guide-figure-700]:./media/virtual-machines-shared-sap-deployment-guide/700-install-powershell-installed.png
[deployment-guide-figure-760]:./media/virtual-machines-shared-sap-deployment-guide/760-azure-cli-version.png
[deployment-guide-figure-900]:./media/virtual-machines-shared-sap-deployment-guide/900-cmd-update-executed.png
[deployment-guide-figure-azure-cli-installed]:virtual-machines-linux-sap-deployment-guide.md#402488e5-f9bb-4b29-8063-1c5f52a892d0
[deployment-guide-figure-azure-cli-version]:virtual-machines-linux-sap-deployment-guide.md#0ad010e6-f9b5-4c21-9c09-bb2e5efb3fda
[deployment-guide-install-vm-agent-windows]:virtual-machines-linux-sap-deployment-guide.md#b2db5c9a-a076-42c6-9835-16945868e866
[deployment-guide-troubleshooting-chapter]:virtual-machines-linux-sap-deployment-guide.md#564adb4f-5c95-4041-9616-6635e83a810b (Checks and Troubleshooting for End-to-End Monitoring Setup for SAP on Azure)

[deploy-template-cli]:../azure-resource-manager/resource-group-template-deploy-cli.md
[deploy-template-portal]:../azure-resource-manager/resource-group-template-deploy-portal.md
[deploy-template-powershell]:../azure-resource-manager/resource-group-template-deploy.md

[dr-guide-classic]:http://go.microsoft.com/fwlink/?LinkID=521971

[getting-started]:virtual-machines-linux-sap-get-started.md
[getting-started-dbms]:virtual-machines-linux-sap-get-started.md#1343ffe1-8021-4ce6-a08d-3a1553a4db82
[getting-started-deployment]:virtual-machines-linux-sap-get-started.md#6aadadd2-76b5-46d8-8713-e8d63630e955
[getting-started-planning]:virtual-machines-linux-sap-get-started.md#3da0389e-708b-4e82-b2a2-e92f132df89c

[getting-started-windows-classic]:virtual-machines-windows-classic-sap-get-started.md
[getting-started-windows-classic-dbms]:virtual-machines-windows-classic-sap-get-started.md#c5b77a14-f6b4-44e9-acab-4d28ff72a930
[getting-started-windows-classic-deployment]:virtual-machines-windows-classic-sap-get-started.md#f84ea6ce-bbb4-41f7-9965-34d31b0098ea
[getting-started-windows-classic-dr]:virtual-machines-windows-classic-sap-get-started.md#cff10b4a-01a5-4dc3-94b6-afb8e55757d3
[getting-started-windows-classic-ha-sios]:virtual-machines-windows-classic-sap-get-started.md#4bb7512c-0fa0-4227-9853-4004281b1037
[getting-started-windows-classic-planning]:virtual-machines-windows-classic-sap-get-started.md#f2a5e9d8-49e4-419e-9900-af783173481c

[ha-guide-classic]:http://go.microsoft.com/fwlink/?LinkId=613056

[install-extension-cli]:virtual-machines-linux-enable-aem.md

[Logo_Linux]:./media/virtual-machines-shared-sap-shared/Linux.png
[Logo_Windows]:./media/virtual-machines-shared-sap-shared/Windows.png

[msdn-set-azurermvmaemextension]:https://msdn.microsoft.com/library/azure/mt670598.aspx

[planning-guide]:virtual-machines-linux-sap-planning-guide.md (SAP NetWeaver on Linux virtual machines (VMs) – Planning and Implementation Guide)
[planning-guide-1.2]:virtual-machines-linux-sap-planning-guide.md#e55d1e22-c2c8-460b-9897-64622a34fdff (Resources)
[planning-guide-11]:virtual-machines-linux-sap-planning-guide.md#7cf991a1-badd-40a9-944e-7baae842a058 (High Availability (HA) and Disaster Recovery (DR) for SAP NetWeaver running on Azure Virtual Machines)
[planning-guide-11.4.1]:virtual-machines-linux-sap-planning-guide.md#5d9d36f9-9058-435d-8367-5ad05f00de77 (High Availability for SAP Application Servers)
[planning-guide-11.5]:virtual-machines-linux-sap-planning-guide.md#4e165b58-74ca-474f-a7f4-5e695a93204f (Using Autostart for SAP instances)
[planning-guide-2.1]:virtual-machines-linux-sap-planning-guide.md#1625df66-4cc6-4d60-9202-de8a0b77f803 (Cloud-Only - Virtual Machine deployments into Azure without dependencies on the on-premises customer network)
[planning-guide-2.2]:virtual-machines-linux-sap-planning-guide.md#f5b3b18c-302c-4bd8-9ab2-c388f1ab3d10 (Cross-Premise - Deployment of single or multiple SAP VMs into Azure with the requirement of being fully integrated into the on-premises network)
[planning-guide-3.1]:virtual-machines-linux-sap-planning-guide.md#be80d1b9-a463-4845-bd35-f4cebdb5424a (Azure Regions)
[planning-guide-3.2.1]:virtual-machines-linux-sap-planning-guide.md#df49dc09-141b-4f34-a4a2-990913b30358 (Fault Domains)
[planning-guide-3.2.2]:virtual-machines-linux-sap-planning-guide.md#fc1ac8b2-e54a-487c-8581-d3cc6625e560 (Upgrade Domains)
[planning-guide-3.2.3]:virtual-machines-linux-sap-planning-guide.md#18810088-f9be-4c97-958a-27996255c665 (Azure Availability Sets)
[planning-guide-3.2]:virtual-machines-linux-sap-planning-guide.md#8d8ad4b8-6093-4b91-ac36-ea56d80dbf77 (The Microsoft Azure Virtual Machine Concept)
[planning-guide-3.3.2]:virtual-machines-linux-sap-planning-guide.md#ff5ad0f9-f7f4-4022-9102-af07aef3bc92 (Azure Premium Storage)
[planning-guide-5.1.1]:virtual-machines-linux-sap-planning-guide.md#4d175f1b-7353-4137-9d2f-817683c26e53 (Moving a VM from on-premises to Azure with a non-generalized disk)
[planning-guide-5.1.2]:virtual-machines-linux-sap-planning-guide.md#e18f7839-c0e2-4385-b1e6-4538453a285c (Deploying a VM with a customer specific image)
[planning-guide-5.2.1]:virtual-machines-linux-sap-planning-guide.md#1b287330-944b-495d-9ea7-94b83aff73ef (Preparation for moving a VM from on-premises to Azure with a non-generalized disk)
[planning-guide-5.2.2]:virtual-machines-linux-sap-planning-guide.md#57f32b1c-0cba-4e57-ab6e-c39fe22b6ec3 (Preparation for deploying a VM with a customer specific image for SAP)
[planning-guide-5.2]:virtual-machines-linux-sap-planning-guide.md#6ffb9f41-a292-40bf-9e70-8204448559e7 (Preparing VMs with SAP for Azure)
[planning-guide-5.3.1]:virtual-machines-linux-sap-planning-guide.md#6e835de8-40b1-4b71-9f18-d45b20959b79 (Difference Between an Azure Disk and Azure Image)
[planning-guide-5.3.2]:virtual-machines-linux-sap-planning-guide.md#a43e40e6-1acc-4633-9816-8f095d5a7b6a (Uploading a VHD from on-premises to Azure)
[planning-guide-5.4.2]:virtual-machines-linux-sap-planning-guide.md#9789b076-2011-4afa-b2fe-b07a8aba58a1 (Copying disks between Azure Storage Accounts)
[planning-guide-5.5.1]:virtual-machines-linux-sap-planning-guide.md#4efec401-91e0-40c0-8e64-f2dceadff646 (VM/VHD structure for SAP deployments)
[planning-guide-5.5.3]:virtual-machines-linux-sap-planning-guide.md#17e0d543-7e8c-4160-a7da-dd7117a1ad9d (Setting automount for attached disks)
[planning-guide-7.1]:virtual-machines-linux-sap-planning-guide.md#3e9c3690-da67-421a-bc3f-12c520d99a30 (Single VM with SAP NetWeaver demo/training scenario)
[planning-guide-7]:virtual-machines-linux-sap-planning-guide.md#96a77628-a05e-475d-9df3-fb82217e8f14 (Concepts of Cloud-Only deployment of SAP instances)
[planning-guide-9.1]:virtual-machines-linux-sap-planning-guide.md#6f0a47f3-a289-4090-a053-2521618a28c3 (Azure Monitoring Solution for SAP)
[planning-guide-azure-premium-storage]:virtual-machines-linux-sap-planning-guide.md#ff5ad0f9-f7f4-4022-9102-af07aef3bc92 (Azure Premium Storage)

[planning-guide-figure-100]:./media/virtual-machines-shared-sap-planning-guide/100-single-vm-in-azure.png
[planning-guide-figure-1300]:./media/virtual-machines-shared-sap-planning-guide/1300-ref-config-iaas-for-sap.png
[planning-guide-figure-1400]:./media/virtual-machines-shared-sap-planning-guide/1400-attach-detach-disks.png
[planning-guide-figure-1600]:./media/virtual-machines-shared-sap-planning-guide/1600-firewall-port-rule.png
[planning-guide-figure-1700]:./media/virtual-machines-shared-sap-planning-guide/1700-single-vm-demo.png
[planning-guide-figure-1900]:./media/virtual-machines-shared-sap-planning-guide/1900-vm-set-vnet.png
[planning-guide-figure-200]:./media/virtual-machines-shared-sap-planning-guide/200-multiple-vms-in-azure.png
[planning-guide-figure-2100]:./media/virtual-machines-shared-sap-planning-guide/2100-s2s.png
[planning-guide-figure-2200]:./media/virtual-machines-shared-sap-planning-guide/2200-network-printing.png
[planning-guide-figure-2300]:./media/virtual-machines-shared-sap-planning-guide/2300-sapgui-stms.png
[planning-guide-figure-2400]:./media/virtual-machines-shared-sap-planning-guide/2400-vm-extension-overview.png
[planning-guide-figure-2500]:./media/virtual-machines-shared-sap-planning-guide/2500-vm-extension-details.png
[planning-guide-figure-2600]:./media/virtual-machines-shared-sap-planning-guide/2600-sap-router-connection.png
[planning-guide-figure-2700]:./media/virtual-machines-shared-sap-planning-guide/2700-exposed-sap-portal.png
[planning-guide-figure-2800]:./media/virtual-machines-shared-sap-planning-guide/2800-endpoint-config.png
[planning-guide-figure-2900]:./media/virtual-machines-shared-sap-planning-guide/2900-azure-ha-sap-ha.png
[planning-guide-figure-300]:./media/virtual-machines-shared-sap-planning-guide/300-vpn-s2s.png
[planning-guide-figure-3000]:./media/virtual-machines-shared-sap-planning-guide/3000-sap-ha-on-azure.png
[planning-guide-figure-3200]:./media/virtual-machines-shared-sap-planning-guide/3200-sap-ha-with-sql.png
[planning-guide-figure-400]:./media/virtual-machines-shared-sap-planning-guide/400-vm-services.png
[planning-guide-figure-600]:./media/virtual-machines-shared-sap-planning-guide/600-s2s-details.png
[planning-guide-figure-700]:./media/virtual-machines-shared-sap-planning-guide/700-decision-tree-deploy-to-azure.png
[planning-guide-figure-800]:./media/virtual-machines-shared-sap-planning-guide/800-portal-vm-overview.png
[planning-guide-microsoft-azure-networking]:virtual-machines-linux-sap-planning-guide.md#61678387-8868-435d-9f8c-450b2424f5bd (Microsoft Azure Networking)
[planning-guide-storage-microsoft-azure-storage-and-data-disks]:virtual-machines-linux-sap-planning-guide.md#a72afa26-4bf4-4a25-8cf7-855d6032157f (Storage: Microsoft Azure Storage and Data Disks)

[powershell-install-configure]:/powershell/azureps-cmdlets-docs
[resource-group-authoring-templates]:../azure-resource-manager/resource-group-authoring-templates.md
[resource-group-overview]:../azure-resource-manager/resource-group-overview.md
[resource-groups-networking]:../virtual-network/resource-groups-networking.md
[sap-pam]:https://support.sap.com/pam (SAP Product Availability Matrix)
[sap-templates-2-tier-marketplace-image]:https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fsap-2-tier-marketplace-image%2Fazuredeploy.json
[sap-templates-2-tier-os-disk]:https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fsap-2-tier-user-disk%2Fazuredeploy.json
[sap-templates-2-tier-user-image]:https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fsap-2-tier-user-image%2Fazuredeploy.json
[sap-templates-3-tier-marketplace-image]:https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fsap-3-tier-marketplace-image%2Fazuredeploy.json
[sap-templates-3-tier-user-image]:https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fsap-3-tier-user-image%2Fazuredeploy.json
[storage-azure-cli]:../storage/storage-azure-cli.md
[storage-azure-cli-copy-blobs]:../storage/storage-azure-cli.md#copy-blobs
[storage-introduction]:../storage/storage-introduction.md
[storage-powershell-guide-full-copy-vhd]:../storage/storage-powershell-guide-full.md#how-to-copy-blobs-from-one-storage-container-to-another
[storage-premium-storage-preview-portal]:../storage/storage-premium-storage.md
[storage-redundancy]:../storage/storage-redundancy.md
[storage-scalability-targets]:../storage/storage-scalability-targets.md
[storage-use-azcopy]:../storage/storage-use-azcopy.md
[template-201-vm-from-specialized-vhd]:https://github.com/Azure/azure-quickstart-templates/tree/master/201-vm-from-specialized-vhd
[templates-101-simple-windows-vm]:https://github.com/Azure/azure-quickstart-templates/tree/master/101-simple-windows-vm
[templates-101-vm-from-user-image]:https://github.com/Azure/azure-quickstart-templates/tree/master/101-vm-from-user-image
[virtual-machines-linux-attach-disk-portal]:virtual-machines-linux-attach-disk-portal.md
[virtual-machines-azure-resource-manager-architecture]:../azure-resource-manager/resource-manager-deployment-model.md
[virtual-machines-azurerm-versus-azuresm]:virtual-machines-linux-compare-deployment-models.md
[virtual-machines-windows-classic-configure-oracle-data-guard]:virtual-machines-windows-classic-configure-oracle-data-guard.md
[virtual-machines-linux-cli-deploy-templates]:virtual-machines-linux-cli-deploy-templates.md (Deploy and manage virtual machines by using Azure Resource Manager templates and the Azure CLI)
[virtual-machines-deploy-rmtemplates-powershell]:virtual-machines-windows-ps-manage.md (Manage virtual machines using Azure Resource Manager and PowerShell)
[virtual-machines-linux-agent-user-guide]:virtual-machines-linux-agent-user-guide.md
[virtual-machines-linux-agent-user-guide-command-line-options]:virtual-machines-linux-agent-user-guide.md#command-line-options
[virtual-machines-linux-capture-image]:virtual-machines-linux-capture-image.md
[virtual-machines-linux-capture-image-resource-manager]:virtual-machines-linux-capture-image.md
[virtual-machines-linux-capture-image-resource-manager-capture]:virtual-machines-linux-capture-image.md#step-2-capture-the-vm
[virtual-machines-linux-configure-raid]:virtual-machines-linux-configure-raid.md
[virtual-machines-linux-configure-lvm]:virtual-machines-linux-configure-lvm.md
[virtual-machines-linux-classic-create-upload-vhd-step-1]:virtual-machines-linux-classic-create-upload-vhd.md#step-1-prepare-the-image-to-be-uploaded
[virtual-machines-linux-create-upload-vhd-suse]:virtual-machines-linux-suse-create-upload-vhd.md
[virtual-machines-linux-redhat-create-upload-vhd]:virtual-machines-linux-redhat-create-upload-vhd.md
[virtual-machines-linux-how-to-attach-disk]:virtual-machines-linux-add-disk.md
[virtual-machines-linux-how-to-attach-disk-how-to-initialize-a-new-data-disk-in-linux]:virtual-machines-linux-add-disk.md#connect-to-the-linux-vm-to-mount-the-new-disk
[virtual-machines-linux-tutorial]:virtual-machines-linux-quick-create-cli.md
[virtual-machines-linux-update-agent]:virtual-machines-linux-update-agent.md
[virtual-machines-manage-availability]:virtual-machines-linux-manage-availability.md
[virtual-machines-ps-create-preconfigure-windows-resource-manager-vms]:virtual-machines-windows-ps-create.md
[virtual-machines-sizes]:virtual-machines-linux-sizes.md
[virtual-machines-windows-classic-ps-sql-alwayson-availability-groups]:./windows/sqlclassic/virtual-machines-windows-classic-ps-sql-alwayson-availability-groups.md
[virtual-machines-windows-classic-ps-sql-int-listener]:./windows/sqlclassic/virtual-machines-windows-classic-ps-sql-int-listener.md
[virtual-machines-sql-server-high-availability-and-disaster-recovery-solutions]:./windows/sql/virtual-machines-windows-sql-high-availability-dr.md
[virtual-machines-sql-server-infrastructure-services]:./windows/sql/virtual-machines-windows-sql-server-iaas-overview.md
[virtual-machines-sql-server-performance-best-practices]:./windows/sql/virtual-machines-windows-sql-performance.md
[virtual-machines-upload-image-windows-resource-manager]:virtual-machines-windows-upload-image.md
[virtual-machines-windows-tutorial]:virtual-machines-windows-hero-tutorial.md
[virtual-machines-workload-template-sql-alwayson]:https://azure.microsoft.com/documentation/templates/sql-server-2014-alwayson-dsc/
[virtual-network-deploy-multinic-arm-cli]:../virtual-network/virtual-network-deploy-multinic-arm-cli.md
[virtual-network-deploy-multinic-arm-ps]:../virtual-network/virtual-network-deploy-multinic-arm-ps.md
[virtual-network-deploy-multinic-arm-template]:../virtual-network/virtual-network-deploy-multinic-arm-template.md
[virtual-networks-configure-vnet-to-vnet-connection]:../vpn-gateway/vpn-gateway-vnet-vnet-rm-ps.md
[virtual-networks-create-vnet-arm-pportal]:../virtual-network/virtual-networks-create-vnet-arm-pportal.md
[virtual-networks-manage-dns-in-vnet]:../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md
[virtual-networks-multiple-nics]:../virtual-network/virtual-networks-multiple-nics.md
[virtual-networks-nsg]:../virtual-network/virtual-networks-nsg.md
[virtual-networks-reserved-private-ip]:../virtual-network/virtual-networks-static-private-ip-arm-ps.md
[virtual-networks-static-private-ip-arm-pportal]:../virtual-network/virtual-networks-static-private-ip-arm-pportal.md
[virtual-networks-udr-overview]:../virtual-network/virtual-networks-udr-overview.md
[vpn-gateway-about-vpn-devices]:../vpn-gateway/vpn-gateway-about-vpn-devices.md
[vpn-gateway-create-site-to-site-rm-powershell]:../vpn-gateway/vpn-gateway-create-site-to-site-rm-powershell.md
[vpn-gateway-cross-premises-options]:../vpn-gateway/vpn-gateway-plan-design.md
[vpn-gateway-site-to-site-create]:../vpn-gateway/vpn-gateway-site-to-site-create.md
[vpn-gateway-vpn-faq]:../vpn-gateway/vpn-gateway-vpn-faq.md
[xplat-cli]:../xplat-cli-install.md
[xplat-cli-azure-resource-manager]:../xplat-cli-azure-resource-manager.md

[!INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-rm-include.md)]

Azure Virtual Machines is the solution for organizations that need compute and storage resources, in minimal time, and without lengthy procurement cycles. You can use Azure Virtual Machines to deploy classical applications, like SAP NetWeaver-based applications, in Azure. Extend an application's reliability and availability without additional on-premises resources. Azure Virtual Machines supports cross-premises connectivity, so you can integrate Azure Virtual Machines into your organization's on-premises domains, private clouds, and SAP system landscape.

In this article, we cover the steps to deploy SAP NetWeaver-based applications on Linux virtual machines in Azure, including alternative deployment options and troubleshooting. This article builds on the information in the [Planning and implementation guide][planning-guide]. It also complements SAP installation documentation and SAP Notes, which are the primary resources for installing and deploying SAP software.

## Prerequisites
Before you start, make sure that you meet the prerequisites that are described in the following sections.

### Local computer
Setting up an Azure virtual machine (VM) for SAP software deployment takes several steps. To manage Windows or Linux VMs, you can use a PowerShell script and the Azure portal. For both of these tools, you'll need a local computer running Windows 7 or a later version. If you want to manage only Linux VMs and you want to use a Linux computer for this task, you also can use the Microsoft Azure cross-platform command-line tool (Azure CLI).

### Internet connection
To download and execute the required tools and scripts, you must be connected to the Internet. The Azure VM that is running the Azure Enhanced Monitoring Extension for SAP also needs access to the Internet. If the Azure VM is part of an Azure Virtual Network or on-premises domain, make sure that the relevant proxy settings are set, as described in [Configure proxy][deployment-guide-configure-proxy].

### Microsoft Azure subscription
You need an Azure account, that you can sign in to.

### Topology and networking
You need to define the topology and architecture of the SAP deployment in Azure:

* Azure Storage account(s) to be used
* Virtual network where you want to deploy the SAP system
* Resource group to which you want to deploy the SAP system
* Azure region where you want to deploy the SAP system
* SAP configuration (two-tier or three-tier)
* VM size(s) and number of additional virtual hard disks (VHDs) to be mounted to the VM(s)
* SAP Correction and Transport System (CTS) configuration

Create and configure Azure storage accounts or Azure virtual networks before you begin the SAP software deployment process. For information about how to create and configure these resources, see [Azure Virtual Machines planning and implementation for SAP NetWeaver][planning-guide].

### SAP sizing
Have the following information, for SAP sizing:

* Projected SAP workload, for example, by using the SAP Quick Sizer tool, and the SAP Application Performance Standard (SAPS) number
* Required CPU resource and memory consumption of the SAP system
* Required input/output (I/O) operations per second
* Required network bandwidth in eventual communication between VMs in Azure
* Required network bandwidth between the on-premises assets and the Azure-deployed SAP systems

### Resource groups
In Azure Resource Manager, you can use resource groups to manage all the application resources in your Azure subscription. An integrated approach, in a resource group, all resources have the same life cycle. For example, all resources are created at the same time and they are deleted at the same time. Learn more about [resource groups][resource-group-overview].

## <a name="42ee2bdb-1efc-4ec7-ab31-fe4c22769b94"></a>SAP resources
During the configuration, you'll need the following SAP resources:

* SAP Note [1928533] has:
  * List of Azure VM sizes that are supported for the deployment of SAP software
  * Important capacity information per Azure VM size
  * Supported SAP software and operating system (OS) and database combinations
  * Required SAP kernel version for Windows and Linux on Microsoft Azure

* SAP Note [2015553] lists prerequisites for SAP-supported SAP software deployments in Azure.
* SAP Note [2178632] has detail information on all monitoring metrics reported for SAP in Azure.
* SAP Note [1409604] has the required SAP Host Agent version for Windows in Azure.
* SAP Note [2191498] has the required SAP Host Agent version for Linux in Azure.
* SAP Note [2243692] has information about licensing for SAP on Linux in Azure.
* SAP Note [1984787] has general information about SUSE Linux Enterprise Server 12.
* SAP Note [2002167] has general information about Red Hat Enterprise Linux 7.x.
* SAP Note [1999351] has additional troubleshooting information for the Azure Enhanced Monitoring Extension for SAP.
* [SAP Community WIKI](https://wiki.scn.sap.com/wiki/display/HOME/SAPonLinuxNotes) has all required SAP Notes for Linux.
* SAP-specific PowerShell cmdlets that are part of [Azure PowerShell][azure-ps].
* SAP-specific Azure CLI commands that are part of [Azure CLI][azure-cli].
* [Azure portal][azure-portal].

[comment]: <> (MSSedusch TODO Add ARM patch level for SAP Host Agent in SAP Note 1409604)

These articles cover SAP deployments in Azure:

* [Azure Virtual Machines planning and implementation for SAP on Linux][planning-guide]
* [Azure Virtual Machines deployment for SAP on Linux (this article)][deployment-guide]
* [Azure Virtual Machines DBMS deployment for SAP on Linux][dbms-guide]

## <a name="b3253ee3-d63b-4d74-a49b-185e76c4088e"></a>Deployment scenarios of VMs for SAP in Azure
You have multiple options for deploying VMs and associated disks in Azure. It's important to understand the differences between deployment options because you might take different steps to prepare your VMs for deployment depending on the type of deployment.

### <a name="db477013-9060-4602-9ad4-b0316f8bb281"></a>Scenario 1: Deploying a VM from the Azure Marketplace for SAP
You can deploy a VM instance from the Azure Marketplace, which offers some standard OS images of Windows Server and different Linux distributions. Alternatively, you can deploy an image that includes DBMS SKUs, for example, SQL Server. For more information about using images with DBMS SKUs, see [Azure Virtual Machines DBMS deployment for SAP on Linux][dbms-guide].

The SAP-specific sequence of steps to deploy a VM from the Azure Marketplace looks like this:

![Flowchart of VM deployment for SAP systems by using a VM image from the Azure Marketplace][deployment-guide-figure-100]

Per the flowchart, do the following steps:

#### Create a virtual machine by using the Azure portal
The easiest way to create a new virtual machine by using an image from the Azure Marketplace is through the Azure portal. Go to <https://portal.azure.com/#create> or select the **+** icon on the left side of the Azure portal. In the search field, enter the type of operating system you want to deploy, for example, **Windows**, **SLES**, or **RHEL**, and then select the version. Make sure you select the **Resource Manager** deployment model, and then select **Create**.

The wizard guides you through setting the required parameters to create the virtual machine, along with all required resources, like network interfaces and storage accounts. Some of these parameters are:

1. Basics
   * **Name**: The name of the resource (the virtual machine name)
   * **Username and password/SSH public key**: Enter the username and password of the user that is created during the provisioning. For a Linux virtual machine, you also can enter the public SSH key that you want to use to sign in to the machine by using SSH.
   * **Subscription**: Select the subscription that you want to use to provision the new virtual machine.
   * **Resource Group**: The name of the resource group. You can enter either the name of a new resource group or the name of a resource group that already exists.
   * **Location**: Select the location where the new virtual machine should be deployed. If you want to connect the virtual machine to your on-premises network, make sure you select the location of the virtual network that connects Azure to your on-premises network. For more information, see [Microsoft Azure Networking][planning-guide-microsoft-azure-networking] in the [Planning guide][planning-guide].
2. Size

	Check SAP Note [1928533] for a list of supported VM types. Also, be sure you select the correct VM type if you want to use Premium Storage. Not all VM types support Premium Storage. For more information, see [Storage: Microsoft Azure Storage and data disks][planning-guide-storage-microsoft-azure-storage-and-data-disks] and [Azure Premium Storage][planning-guide-azure-premium-storage] in [Azure Virtual Machines planning and implementation for SAP on Linux][planning-guide].

3. Settings
   * **Storage Account**: Select an existing storage account or create a new one. For more information about storage types, see [Microsoft Azure Storage][dbms-guide-2.3] in [Azure Virtual Machines DBMS deployment for SAP on Linux][dbms-guide]. Note that not all storage types are supported for running SAP applications.
   * **Virtual network and Subnet**: Select the virtual network that is connected to your on-premises network if you want to integrate the virtual machine with your intranet.
   * **Public IP address**: Select the public IP address that you want to use, or enter parameters to create a new public IP address. You can use a public IP address to access your virtual machine over the Internet. Make sure that you also create a Network Security Group to filter access to your virtual machine.
   * **Network Security Group**: For more information, see [What is a Network Security Group (NSG)][virtual-networks-nsg].
   * **Availability**: Select an availablility set, or enter the parameters to create a new availablility set. For more information, see [Azure availability sets][planning-guide-3.2.3].
   * **Monitoring**: You can disable the diagnostics setting. It will be enabled automatically when you run the commands to enable the Azure Enhanced Monitoring Extension, described in [Configure monitoring][deployment-guide-configure-monitoring-scenario-1].

4. **Summary**: On the summary page, verify the information you've entered, and then select **OK**.

Your virtual machine is deployed in the resource group you selected.

#### Create a virtual machine by using a template
You can create a deployment by using one of the SAP templates published in the [azure-quickstart-templates GitHub repository][azure-quickstart-templates-github], or, you can manually create a virtual machine by using the [Azure portal][virtual-machines-windows-tutorial], [PowerShell][virtual-machines-ps-create-preconfigure-windows-resource-manager-vms] or [Azure CLI][virtual-machines-linux-tutorial].

* [Two-tier configuration (only one virtual machine) template (sap-2-tier-marketplace-image)][sap-templates-2-tier-marketplace-image]
  Use this template if you want to create a two-tier system by using only one virtual machine.
* [Three-tier configuration (multiple virtual machines) template (sap-3-tier-marketplace-image)][sap-templates-3-tier-marketplace-image]
  Use this template if you want to create a three-tier system by using multiple virtual machines.

When you open a template, enter the following parameters in the Azure portal:

1. Basics
  * **Subscription**: The subscription you want to deploy the template to.
  * **Resource group**: The resource group you want to deploy the template to. You can create a new resource group, or you can select an existing resource group in the selected subscription.
  * **Location**: Where you want to deploy the template. If you selected an existing resource group, the location of the resource group is used.
2. Settings
  * **Sap System Id**: The SAP System ID.
  * **Os Type**: The operating system you want to deploy, for example, Windows Server 2012 R2, SUSE Linux Enterprise Server 12 (SLES 12), or Red Hat Enterprise Linux 7.2 (RHEL 7.2).
    * The list does not show all supported operating systems. For example, the list does not have Windows Server 2008 R2, although it is supported by SAP. For a list of all supported operating systems, see SAP Note [1928533].
  * **Sap System Size**: The size of the SAP system.
    * The number of SAPS the new system will provide. If you are not sure how many SAPS the system will require, ask your SAP Technology Partner or System Integrator.
  * **System Availability** (three-tier template only): System availability.
    * Select **HA** for a configuration that is suitable for a high-availability installation. Two database servers and two servers for ABAP SAP Central Services (ASCS) are created.
  * **Storage Type** (two-tier template only): The type of storage to use.
    * For larger systems, we highly recommend using Premium Storage. For more information about storage types, see these resources:
      * [Use of Azure Premium SSD Storage for SAP DBMS Instance][2367194]
      * [Microsoft Azure Storage][dbms-guide-2.3] in [Azure Virtual Machines DBMS deployment for SAP on Linux][dbms-guide]
      * [Premium Storage: High-performance storage for Azure Virtual Machine workloads][storage-premium-storage-preview-portal]
      * [Introduction to Microsoft Azure Storage][storage-introduction]
  * **Admin Username** and **Admin Password**: A username and password.
    * A new user is created to sign in to the machine.
  * **New Or Existing Subnet**: Determines whether a new virtual network and subnet should be created or an existing subnet should be used. If you already have a virtual network that is connected to your on-premises network, select **existing**.
  * **Subnet Id**: The ID of the subnet to which the virtual machines should connect. Select the subnet of your virtual private network (VPN) or Azure ExpressRoute virtual network to connect the virtual machine to your on-premises network. The ID usually looks like this: /subscriptions/<subscription id>/resourceGroups/<resource group name>/providers/Microsoft.Network/virtualNetworks/<virtual network name>/subnets/<subnet name>

3. Terms and conditions  
    Review the legal terms, and then accept them.

To confirm your selections and parameters, select **Purchase**.

The Azure VM Agent is deployed by default when you use an image from the Azure Marketplace.

#### Configure proxy settings
Depending on your on-premises network configuration, you might need to set up the proxy on your VM. If your VM is connected to your on-premises network via VPN or ExpressRoute, the VM might not be able to access the Internet and won't be able to download the required extensions or collect monitoring data. For more information, see [Configure the proxy][deployment-guide-configure-proxy].

#### Join domain (Windows only)
If your Azure deployment is connected to an on-premises Active Directory or DNS instance via Azure Site-to-Site or ExpressRoute (also called *cross-premises*, in the [Planning and Implementation Guide][planning-guide]), it is expected that the VM is joining an on-premises domain. For more information about considerations for this step, see [Join VM into on-premises domain (Windows only)][deployment-guide-4.3].

#### <a name="ec323ac3-1de9-4c3a-b770-4ff701def65b"></a>Configure monitoring
To make sure that your environment supports SAP, set up the Azure Enhanced Monitoring Extension for SAP, described in [Configure Azure Enhanced Monitoring Extension for SAP][deployment-guide-4.5].

Check the prerequisites for SAP monitoring, including required minimum versions of SAP Kernel and SAP Host Agent, in [SAP resources][deployment-guide-2.2].

#### Monitoring check
Determine whether monitoring is working, as described in [Checks and troubleshooting for end-to-end monitoring setup for SAP on Azure][deployment-guide-troubleshooting-chapter].

#### Post-deployment steps
After you create the VM and the VM is deployed, you need to install the required software components in the VM. Because of this deployment/software installation sequence, this type of VM deployment requires either that the software to be installed is already available, either in Azure, on another VM, or as a disk that can be attached. Alternatively, you need to consider a cross-premises scenario, in which connectivity to the on-premises assets (installation shares) is given.

You can use an image provided by Microsoft or a third party in the Azure Marketplace to deploy your VM. After you deploy your VM in Azure, follow the same guidelines and tools to install the SAP software on your VM as you would in an on-premises environment. To install SAP software on an Azure VM, both SAP and Microsoft recommend that you upload and store the SAP installation media on Azure VHDs, or that you create an Azure VM that works as a file server that has all the required SAP installation media.

[comment]: <> (MSSedusch TODO why do we need to recommend a file management, for example, File Server or VHD? Is that so different from on-premises?)

For more information, see [Scenario 1: Deploying a VM from the Azure Marketplace for SAP][deployment-guide-3.2].

### <a name="54a1fc6d-24fd-4feb-9c57-ac588a55dff2"></a>Scenario 2: Deploying a VM with a custom image for SAP
Because different operating systems and database management system (DBMS) versions have different patch requirements, the images you find in the Azure Marketplace might not meet your needs. You might instead want to create a VM by using your own OS/DBMS VM image, which you can deploy several times afterward.
You use different steps to create a private Linux image than to create a private Windows image.

- - -
> ![Windows][Logo_Windows] Windows
>
> To prepare a Windows image that can be used to deploy multiple virtual machines, the Windows settings (like Windows SID and hostname) must be abstracted or generalized on the on-premises VM. You can use [sysprep](https://msdn.microsoft.com/library/hh825084.aspx) to do this.
>
> ![Linux][Logo_Linux] Linux
>
> To prepare a Linux image that you can use to deploy multiple virtual machines, some Linux settings must be abstracted or generalized on the on-premises VM. You can use `waagent -deprovision`  to do this. For more information, see [Capture a Linux virtual machine running on Azure][virtual-machines-linux-capture-image.md] and the [Azure Linux agent user guide][virtual-machines-linux-agent-user-guide-command-line-options].
>
>

- - -
You can set up your database content either by using SAP Software Provisioning Manager to install a new SAP system, which restores a database backup from a VHD that is attached to the virtual machine, or by directly restoring a database backup from Azure storage if your DBMS supports it. For more in formation, see [Azure Virtual Machines DBMS deployment for SAP on Linux][dbms-guide]. If you have already installed an SAP system in your on-premises VM (especially for two-tier systems), you can adapt the SAP system settings after the deployment of the Azure VM by using the System Rename procedure supported by SAP Software Provisioning Manager (SAP Note [1619720]). Otherwise, you can install the SAP software after you deploy the Azure VM.

For more information, see [Scenario 2: Deploying a VM with a custom image for SAP][deployment-guide-3.3].

. . . .
You can prepare and create a custom image, and then use it to create multiple new VMs. This is described in the [Planning and Implementation Guide][planning-guide].

The flowchart of steps to take looks like this:

![Flowchart of VM deployment for SAP systems by using a VM image in Private Marketplace][deployment-guide-figure-300]

Per the flowchart, do the following steps:

#### Create the virtual machine
To create a deployment by using a private OS image from the Azure portal, use one of the SAP templates listed below. These templates are published in the [azure-quickstart-templates GitHub repository][azure-quickstart-templates-github].
You also can create a virtual machine manually by using [PowerShell][virtual-machines-upload-image-windows-resource-manager].

* [Two-tier configuration (only one virtual machine) template (sap-2-tier-user-image)][sap-templates-2-tier-user-image]
  Use this template if you want to create a two-tier system by using only one virtual machine and your own OS image.
* [Three-tier configuration (multiple virtual machines) template (sap-3-tier-user-image)][sap-templates-3-tier-user-image]
  Use this template if you want to create a three-tier system by using multiple virtual machines and your own OS image.

When you open a template, enter the following parameters in the Azure portal:

1. Basics
  * **Subscription**: The subscription you want to deploy the template to.
  * **Resource group**: The resource group you want to deploy the template to. You can create a new resource group or select an existing resource group in the selected subscription.
  * **Location**: The location you want to deploy the template to. If you selected an existing resource group, the location of the resource group is used.
2. Settings
  * **Sap System Id**: The SAP System ID.
  * **Os Type**: The operating system type you want to deploy, Windows or Linux.
  * **Sap System Size**: The size of the SAP system.
    * The number of SAPS the new system will provide. If you are not sure how many SAPS the system will require, ask your SAP Technology Partner or System Integrator.
  * **System Availability** (three-tier template only): System availability
    * Select **HA** for a configuration that is suitable for a high-availability installation. Two database servers and two servers for ASCS are created.
  * **Storage Type**: (two-tier template only) The type of storage to use.
    * For larger systems, we highly recommend using Premium Storage. For more information about storage types, see the following resources:
      * [Use of Azure Premium SSD Storage for SAP DBMS Instance][2367194]
      * [Microsoft Azure Storage][dbms-guide-2.3] in [Azure Virtual Machines DBMS deployment for SAP on Linux][dbms-guide]
      * [Premium Storage: High-performance storage for Azure virtual machine workloads][storage-premium-storage-preview-portal]
      * [Introduction to Microsoft Azure Storage][storage-introduction]
  * **User Image Vhd Uri**: The URI of the private OS image VHD, for example, https://<accountname>.blob.core.windows.net/vhds/userimage.vhd.
  * **User Image Storage Account**: The name of the storage account where the private OS image is stored, for example, <accountname> in https://<accountname>.blob.core.windows.net/vhds/userimage.vhd.
  * **Admin Username** and **Admin Password**: The username and password.
    * A new user is created that you can use to sign in to the machine.
  * **New Or Existing Subnet**: Determines whether a new virtual network and subnet should be created or an existing subnet should be used. If you already have a virtual network that is connected to your on-premises network, select existing.
  * **Subnet Id**: The ID of the subnet to which the virtual machines should be connected to. Select the subnet of your VPN or ExpressRoute virtual network to connect the virtual machine to your on-premises network. The ID usually looks like this:
  /subscriptions/<subscription id>/resourceGroups/`<resource group name`>/providers/Microsoft.Network/virtualNetworks/`<virtual network name`>/subnets/`<subnet name`>

3. Terms and conditions  
    Review the legal terms, and then accept them.

To confirm your selections and parameters, select **Purchase**.

#### Install the VM Agent (Linux only)
To use the templates described in the preceding section, the Linux Agent must already be installed in the user image. Otherwise, the deployment will fail. Download and install the VM Agent in the user image as described in [Download, Install and Enable Azure VM Agent][deployment-guide-4.4]. If you don’t use the templates, you can also install the VM Agent afterwards.

#### Join domain (Windows only)
In the case that the deployment in Azure is connected to the on-premises AD/DNS via Azure Site-to-Site or Express Route (also referenced as Cross-Premises in the [Planning and Implementation Guide][planning-guide]), it is expected that the VM is joining an on-premises domain. Considerations of this step are described in [Join VM into On-Premises Domain (Windows only)][deployment-guide-4.3].

#### Configure proxy settings
Depending on your on-premises network configuration, it might be required to configure the proxy on your virtual machine if it is connected to your on-premises network via VPN or Express Route. Otherwise the virtual machine might not be able to access the internet and therefore cannot download the required extensions or collect monitoring data. For more information, see [Configure proxy][deployment-guide-configure-proxy].

#### Configure monitoring
To be sure your environment supports SAP, set up the Azure Monitoring Extension for SAP as described in [Configure Azure Enhanced Monitoring Extension for SAP][deployment-guide-4.5].
Check the prerequisites for SAP Monitoring for required minimum versions of SAP Kernel and SAP Host Agent in the resources listed in [SAP Resources][deployment-guide-2.2].

#### Monitoring check
Check if the monitoring is working as described in [Checks and Troubleshooting for End-to-End Monitoring Setup for SAP on Azure][deployment-guide-troubleshooting-chapter].




### <a name="a9a60133-a763-4de8-8986-ac0fa33aa8c1"></a>Scenario 3: Moving an on-premises VM by using a non-generalized Azure VHD with SAP
If you plan to move your SAP system in its current form and shape (same hostname and SAP SID) from on-premises to Azure, the VHD is directly used as the OS disk and not referenced as an image during deployment. In this case the VM Agent will not be automatically installed during the deployment. As the VM Agent and the Azure Enhanced Monitoring Extension for SAP is a prerequisite for SAP support, you need to download, install and enable both components manually after creation of the virtual machine.

### Moving an on-premises VM to Azure with a non-generalized disk
In this scenario, you plan to move a specific SAP system from on-premises environment to Azure. You can do this by uploading the VHD that has the OS, the SAP binaries, and eventually the DBMS binaries, plus the VHDs with the data and log files of the DBMS to Azure. Unlike the scenario described in [Deploying a VM with a custom image][deployment-guide-3.1.2], in this scenario, you keep the hostname, SAP SID, and SAP user accounts in the Azure VM as they were configured in the on-premises environment. You do not need to generalize the operating system. This scenario applies most often for cross-premises scenarios, where part of the SAP landscape runs on-premises and part runs on Azure.

For more information, see [Scenario 3: Moving an on-premises VM by using a non-generalized Azure VHD with SAP][deployment-guide-3.4].



For more information about the Azure VM Agent, see:

[comment]: <> (MSSedusch TODO Update Windows Link below)

- - -
> ![Windows][Logo_Windows] Windows
>
> <http://blogs.msdn.com/b/wats/archive/2014/02/17/bginfo-guest-agent-extension-for-azure-vms.aspx>
>
> ![Linux][Logo_Linux] Linux
>
> [Azure Linux Agent User Guide][virtual-machines-linux-agent-user-guide]
>
>

- - -
The workflow of the different steps looks like this:

![Flowchart of VM deployment for SAP systems by using a VM disk][deployment-guide-figure-400]

Assuming that the disk is already uploaded and defined in Azure (see [Planning and Implementation Guide][planning-guide]), follow these steps:

#### Create a virtual machine
To create a deployment by using a private OS disk through the Azure portal, use the SAP template published on the [azure-quickstart-templates GitHub repository][azure-quickstart-templates-github]. You also can create a virtual machine manually by using the [PowerShell][virtual-machines-windows-create-vm-specialized].

* [Two-tier configuration (only one virtual machine) template (sap-2-tier-user-disk)][sap-templates-2-tier-os-disk]
  * Use this template to create a two-tier system by using only one virtual machine.

When you open a template, enter the following parameters in the Azure portal:

1. Basics
  * **Subscription**: The subscription you want to deploy the template to.
  * **Resource group**: The resource group you want to deploy the template to. You can create a new resource group or select an existing resource group in the selected subscription.
  * **Location**: The location you want to deploy the template to. If you selected an existing resource group, the location of the resource group is used.
2. Settings
  * **Sap System Id**: The SAP System ID.
  * **Os Type**: The operating system type you want to deploy (Windows or Linux).
  * **Sap System Size**: The size of the SAP system.
    * The number of SAPS the new system provides. If you are not sure how many SAPS the system requires, ask your SAP Technology Partner or System Integrator.
  * **Storage Type** (two-tier template only): The type of storage to use.
    * For larger systems, we highly recommend using Premium Storage. For more information about storage types, see the following resources:
      * [Use of Azure Premium SSD Storage for SAP DBMS Instance][2367194]
      * [Microsoft Azure Storage][dbms-guide-2.3] in [Azure Virtual Machine DBMS deployment for SAP on Linux][dbms-guide]
      * [Premium Storage: High-performance storage for Azure Virtual Machine workloads][storage-premium-storage-preview-portal]
      * [Introduction to Microsoft Azure Storage][storage-introduction]
  * **Os Disk Vhd Uri**: The URI of the private OS disk, for example, https://<accountname>.blob.core.windows.net/vhds/osdisk.vhd.
  * **New Or Existing Subnet**: Determines whether a new virtual network and subnet should be created or an existing subnet should be used. If you already have a virtual network that is connected to your on-premises network, select **existing**.
  * **Subnet Id**: The ID of the subnet to which the virtual machines should be connected to. Select the subnet of your VPN or ExpressRoute virtual network to connect the virtual machine to your on-premises network. The ID usually looks like this:
  /subscriptions/<subscription id>/resourceGroups/<resource group name>/providers/Microsoft.Network/virtualNetworks/<virtual network name>/subnets/<subnet name>

3. Terms and conditions  
    Review the legal terms, and then accept them.

To confirm your selections and parameters, select **Purchase**.

#### Install the VM Agent
To use the templates described in the preceding section, the VM Agent has to be installed on the OS disk, or the deployment will fail. Download and install the VM Agent in the VM, described in [Download, Install and Enable Azure VM Agent][deployment-guide-4.4].

If you don’t use the templates described in the preceding section, you can also install the VM Agent afterwards.

#### Join domain (Windows only)
In the case that the deployment in Azure is connected to the on-premises AD/DNS via Azure Site-to-Site or Express Route (also referenced as Cross-Premises in the [Planning and Implementation Guide][planning-guide]), it is expected that the VM is joining an on-premises domain. Considerations of this step are described in [Join VM into on-premises Domain (Windows only)][deployment-guide-4.3].

#### Configure proxy settings
Depending on your on-premises network configuration, it might be required to configure the proxy on your virtual machine if it is connected to your on-premises network via VPN or Express Route. Otherwise the virtual machine might not be able to access the internet and therefore cannot download the required extensions or collect monitoring data. For more information, see [Configure proxy][deployment-guide-configure-proxy].

#### Configure monitoring
To be sure your environment supports SAP, set up the Azure Enhanced Monitoring Extension for SAP as described in [Configure Azure Enhanced Monitoring Extension for SAP][deployment-guide-4.5].

Check the prerequisites for SAP Monitoring for required minimum versions of SAP kernel and SAP Host Agent in the resources listed in [SAP Resources][deployment-guide-2.2].

#### Monitoring check
Check if the monitoring is working as described in [Checks and Troubleshooting for End-to-End Monitoring Setup for SAP on Azure][deployment-guide-troubleshooting-chapter].

## Update the monitoring configuration for SAP
If any of the following occurs, update the SAP monitoring configuration:

* The joint Microsoft/SAP team extends the monitoring capabilities and requests more or fewer counters.
* Microsoft introduces a new version of the underlying Azure infrastructure that delivers the monitoring data, and the Azure Enhanced Monitoring Extension for SAP needs to be adapted to those changes.
* You mount additional VHDs to your Azure VM or you remove a VHD. In this scenario, update the collection of storage-related data. Changing your configuration by adding or deleting endpoints or by assigning IP addresses to a VM will not affect the monitoring configuration.
* You change the size of your Azure VM, for example, from size A5 to any other VM size.
* You add new network interfaces to your Azure VM.

To update the monitoring configuration, update the monitoring infrastructure by following the steps in [Configure the Azure Enhanced Monitoring Extension for SAP][deployment-guide-4.5]. To detect that a monitoring configuration is deployed and to perform the necessary changes to the monitoring configuration, rerun the script described in this section.

## Detailed single-deployment steps
### <a name="604bcec2-8b6e-48d2-a944-61b0f5dee2f7"></a>Deploy Azure PowerShell cmdlets
1.  Go to <https://azure.microsoft.com/downloads/>.
2.  Under **Command-line tools**, under **PowerShell**, select **Windows install**.
3.  In the Microsoft Download Manager dialog box, for the downloaded file (for example, WindowsAzurePowershellGet.3f.3f.3fnew.exe), select **Run**.
4.  To run Microsoft Web Platform Installer (Microsoft Web PI), select **Yes**.
5.  A screen like this is displayed:
![Installation screen for Azure PowerShell cmdlets][deployment-guide-figure-500]
<a name="figure-5"></a>
6.  Select **Install**, and then accept the Microsoft Software License Terms.
7.  The Web Platform Installer is installed. Select **Finish** to close the installation wizard.

Check frequently for updates to the PowerShell cmdlets, which usually are updated monthly. The easiest way to check for updates is to do the preceding installation steps, up to the installation page shown in [Figure 5][deployment-guide-figure-500]. The release date and release number of the cmdlets are included on the page shown in [Figure 5][deployment-guide-figure-500]. Unless stated otherwise in SAP Note [1928533] or SAP Note [2015553], we recommend that you work with the latest version of Azure PowerShell cmdlets.

To check the version of the Azure PowerShell cmdlets that are installed on your computer, run this PowerShell command:

```powershell
Import-Module Azure
(Get-Module Azure).Version
```

The result looks like this:

![Result of Azure PowerShell cmdlet version check][deployment-guide-figure-600]
<a name="figure-6"></a>

If the Azure cmdlet version installed on your computer is the current version, the first page of the installation wizard indicates that, by adding **(Installed)** to the product title (See [Figure 7][deployment-guide-figure-700].) Your PowerShell Azure cmdlets are up-to-date. Select **Exit** to close the installation wizard.

![Installation screen for Azure PowerShell cmdlets indicating that most recent release of Azure PS cmdlets are installed][deployment-guide-figure-700]
<a name="figure-7"></a>

### <a name="1ded9453-1330-442a-86ea-e0fd8ae8cab3"></a>Deploy Azure CLI
1.  Go to <https://azure.microsoft.com/downloads/>.
2.  Under **Command-line tools**, under **Azure command-line interface**, select the **Install** link for your operating system.
3.  In the Microsoft Download Manager dialog box, for the downloaded file (for example, WindowsAzureXPlatCLI.3f.3f.3fnew.exe), select **Run**.
4.  To run Microsoft Web Platform Installer (Microsoft Web PI), select **Yes**.
5.  A screen similar to [Figure 5](deployment-guide-figure-500) is displayed.
6.  Select **Install**, and then accept the Microsoft Software License Terms.
7.  The Web Platform Installer is installed. Select **Finish** to close the installation wizard.

Check frequently for updates to Azure CLI, which usually is updated monthly. The easiest way to check for updates is to do the preceding installation steps, up to the installation page shown in step 5.

To check the version of Azure CLI that is installed on your computer, run this command:

```
azure --version
```

The result looks like this:

![Result of Azure CLI version check][deployment-guide-figure-760]
<a name="0ad010e6-f9b5-4c21-9c09-bb2e5efb3fda"></a>

### <a name="31d9ecd6-b136-4c73-b61e-da4a29bbc9cc"></a>Join a VM to an on-premises domain (Windows only)
If you deploy SAP VMs in a cross-premises scenario, where on-premises Active Directory and DNS are extended in Azure, it is expected that the VMs join an on-premises domain. The detailed steps you would take to  join a VM to an on-premises domain, and the additional software required to be a member of an on-premises domain, varies by customer. Usually, to join a VM to an on-premises domain, you'll need to install additional software, like antimalware software, and backup or monitoring software.

In this scenario, you also need to make sure that if Internet proxy settings are forced when a VM joins a domain in your environment, the Windows Local System Account (S-1-5-18) in the Guest VM has the same settings. The easiest option is to force the proxy by using a Domain Group Policy, which applies to systems in the domain.

### <a name="c7cbb0dc-52a4-49db-8e03-83e7edc2927d"></a>Download, install, and enable the Azure VM Agent
For virtual machines that are deployed from an OS image that is not generalized (for example, an image that doesn't originate from the Windows System Preparation, or Sysprep, tool), you need to manually download, install, and enable the Azure VM Agent.

If you deploy a VM from the Azure Marketplace, this step is not required. Images from the Azure Marketplace already have the Azure VM Agent.

#### <a name="b2db5c9a-a076-42c6-9835-16945868e866"></a>Windows
1.  Download the Azure VM Agent:
  a.  Download the Azure VM Agent installer package from: <https://go.microsoft.com/fwlink/?LinkId=394789>.
  b. Store the VM Agent MSI package locally on the laptop or a server.
2.  Install the Azure VM Agent:
  a.  Connect to the deployed Azure VM with Remote Desktop (RDP).
  b.  Open a Windows Explorer window on the VM and choose the target directory for the MSI file of the VM Agent.
  c.  Drag and drop the Azure VM Agent Installer MSI file from your local laptop/server into the target directory of the VM Agent in the VM.
  d.  Double-click on the MSI file in the VM.
3.  For VMs joined to on-premises domains, make sure that eventual Internet proxy settings apply for the Windows Local System account (S-1-5-18) in the VM as well as described in [Configure proxy][deployment-guide-configure-proxy]. The VM Agent runs in this context and needs to be able to connect to Azure.

The update of the Azure VM Agent requires no user intervention. VM Agent auto updates itself and does not require a VM reboot.

#### <a name="6889ff12-eaaf-4f3c-97e1-7c9edc7f7542"></a>Linux
Use the following command to install the VM Agent for Linux:

* **SLES**

```
sudo zypper install WALinuxAgent
```
* **RHEL**

```
sudo yum install WALinuxAgent
```

To update the Azure Linux Agent if it is already installed, do the steps described in [Update the Azure Linux Agent on a VM to the latest version from GitHub][virtual-machines-linux-update-agent] .

For more information about the Azure VM Agent, see [About the virtual machine agent and extensions](virtual-machines-windows-classic-agents-and-extensions.md).

### <a name="baccae00-6f79-4307-ade4-40292ce4e02d"></a>Configure the proxy
You take different steps to configuring the proxy in Windows and Linux.

#### Windows
These settings must also be valid for the LocalSystem account to access the Internet. If your proxy settings are not set by group policy, you can configure them for the LocalSystem account. Follow these steps:

1. Go to **Start**, enter **gpedit.msc**, and then select **Enter**.
2. Select **Computer Configuration** > **Administrative Templates** > **Windows Components** > **Internet Explorer**. Make sure that the setting **Make proxy settings per-machine (rather than per-user)** is disabled or not configured.
3. In **Control Panel**, go to **Network and Sharing Center** > **Internet Options**.
4. On the **Connections** tab, select the **LAN settings** button.
5. Clear the **Automatically detect settings** check box.
6. Select the **Use a proxy server for your LAN** check box, and then enter the proxy address and port.
7. Select the **Advanced** button.
8. In the **Exceptions** box, enter the IP address **168.63.129.16**. Select **OK**.

#### Linux
Configure the correct proxy in the configuration file of the Microsoft Azure Guest Agent, which is located at /etc/waagent.conf.

Set the following parameters:

1.  The HTTP proxy host. For example, set to **proxy.corp.local**.

  ```
  HttpProxy.Host=<proxy host>

  ```

2.  The HTTP proxy port. For example, set to **80**.

  ```
  HttpProxy.Port=<port of the proxy host>

  ```

3.  Restart the agent.

  ```
  sudo service waagent restart
  ```

The proxy settings in /etc/waagent.conf also apply for the required VM extensions. If you want to use the Azure repositories, make sure that the traffic to these repositories is not going through the on-premises intranet. If you created User Defined Routes to enable Forced Tunneling, make sure to add a route that routes traffic to the repositories directly to the Internet and not through your site-to-site connection.

* **SLES**
  You also need to add routes for the IP addresses listed in /etc/regionserverclnt.cfg. For an example, see the following image.
* **RHEL**
  You also need to add routes for the IP addresses of the hosts listed in /etc/yum.repos.d/rhui-load-balancers. The following figure shows an example:

![Forced tunneling][deployment-guide-figure-50]

For more information about User Defined Routes, see [User defined routes and IP forwarding][virtual-networks-udr-overview].

### <a name="d98edcd3-f2a1-49f7-b26a-07448ceb60ca"></a>Configure the Azure Enhanced Monitoring Extension for SAP
When you've prepared the VM as described in [Deployment scenarios of VMs for SAP on Azure][deployment-guide-3], the Azure VM Agent is installed on the virtual machine. The next step is to deploy the Azure Enhanced Monitoring Extension for SAP, which is available in the Azure Extension Repository in the global Azure data centers. For more information, see [Planning and implementation guide][planning-guide-9.1].

You can use PowerShell or Azure CLI to install and configure the Azure Enhanced Monitoring Extension for SAP. To install the extension on a Windows or Linux VM by using a Windows machine, see [Azure PowerShell][deployment-guide-4.5.1]. To install the extension on a Linux VM by using a Linux desktop, see [Azure CLI][deployment-guide-4.5.2].

#### <a name="987cf279-d713-4b4c-8143-6b11589bb9d4"></a>Azure PowerShell for Linux and Windows VMs
To install the Azure Enhanced Monitoring Extension for SAP:

1. Make sure that you have installed the latest version of the Azure PowerShell cmdlet. For more information, see [Deploying Azure PowerShell cmdlets][deployment-guide-4.1].  
2. Run the following PowerShell cmdlet.
    For a list of available environments, run `commandlet Get-AzureRmEnvironment`. If you want to use public Azure, your environment is **AzureCloud**. For Azure in China, select **AzureChinaCloud**.

```powershell
    $env = Get-AzureRmEnvironment -Name <name of the environment>
    Login-AzureRmAccount -Environment $env
    Set-AzureRmContext -SubscriptionName <subscription name>

    Set-AzureRmVMAEMExtension -ResourceGroupName <resource group name> -VMName <virtual machine name>
```

After you enter your account data and the Azure virtual machine, the script deploys the required extensions and enables the required features. This can take several minutes.
For more information about `Set-AzureRmVMAEMExtension`, see [this MSDN article][msdn-set-azurermvmaemextension].

![Successful execution of SAP-specific Azure cmdlet Set-AzureRmVMAEMExtension][deployment-guide-figure-900]

The `Set-AzureRmVMAEMExtension` configuration step does all the steps necessary to configure host monitoring for SAP.

The script output includes the following:

* Confirmation that monitoring for the base VHD (with the OS) and all additional VHDs mounted to the VM has been configured.
* The next two messages confirm the configuration of Storage Metrics for a specific storage account.
* One line of output gives a status on the actual update of the monitoring configuration.
* Another line of output confirms that the configuration has been deployed or updated.
* The last line of output is informational. It shows your options for testing the monitoring configuration.
* To check that all steps of the Azure Enhanced Monitoring have been executed successfully, and that the Azure Infrastructure provides the necessary data, proceed with the Readiness Check for the Azure Enhanced Monitoring Extension for SAP, described in [Readiness check for Azure Enhanced Monitoring for SAP][deployment-guide-5.1].
* To continue, wait 15-30 minutes for Azure Diagnostics to collect the relevant data.

#### <a name="408f3779-f422-4413-82f8-c57a23b4fc2f"></a>Azure CLI for Linux VMs
To install the Azure Enhanced Monitoring Extension for SAP by using Azure CLI:

1. Install Azure CLI as described in [Install the Azure CLI][azure-cli].
2. Sign in with your Azure account.

    ```
    azure login
    ```
3. Switch to Azure Resource Manager mode.

    ```
    azure config mode arm
    ```
4. Enable Azure Enhanced Monitoring.

    ```
    azure vm enable-aem <resource-group-name> <vm-name>
    ```  
5. Verify that the Azure Enhanced Monitoring Extension is active on the Azure Linux VM. Check whether the file /var/lib/AzureEnhancedMonitor/PerfCounters exists. If it exists, in a Command Prompt window, run this command to display information collected by the Azure Enhanced Monitor:

    ```
    cat /var/lib/AzureEnhancedMonitor/PerfCounters
    ```
    The output looks like this:

    ```
    2;cpu;Current Hw Frequency;;0;2194.659;MHz;60;1444036656;saplnxmon;
    2;cpu;Max Hw Frequency;;0;2194.659;MHz;0;1444036656;saplnxmon;
    …
    …
    ```

## <a name="564adb4f-5c95-4041-9616-6635e83a810b"></a>Checks and troubleshooting for end-to-end monitoring setup for SAP in Azure
After you have deployed your Azure VM and set up the relevant Azure monitoring infrastructure, check whether all the components of the Azure Enhanced Monitoring Extension are working as expected.

Run the readiness check for the Azure Enhanced Monitoring Extension for SAP as described in [Readiness check for the Azure Enhanced Monitoring Extension for SAP][deployment-guide-5.1]. If the result of the check is positive and you get all relevant performance counters, Azure monitoring has been set up successfully. You can proceed with the installation of SAP Host Agent described in the SAP Notes in [SAP resources][deployment-guide-2.2]. If the Readiness Check indicates that counters are missing, run the health check for the Azure monitoring infrastructure as described in [Health check for Azure monitoring infrastructure configuration][deployment-guide-5.2]. If you have any problems setting up Azure monitoring, for more troubleshooting options, see [Additional troubleshooting for Azure monitoring for SAP][deployment-guide-5.3].

### <a name="bb61ce92-8c5c-461f-8c53-39f5e5ed91f2"></a>Readiness check for the Azure Enhanced Monitoring Extension for SAP
This check makes sure that all the metrics that will be shown inside your SAP application are provided by the underlying Azure monitoring infrastructure.

#### Execute the readiness check on a Windows VM
To execute the readiness check, sign in to the Azure Virtual Machine (an admin account is not necessary), and then do these steps:

1.  In a Command Prompt window, change the directory to the installation folder of the Azure Enhanced Monitoring Extension for SAP:
  C:\\Packages\\Plugins\\Microsoft.AzureCAT.AzureEnhancedMonitoring.AzureCATExtensionHandler\\<version>\\drop

  The *version* in the path to the monitoring extension might vary. If you see folders for multiple versions of the monitoring extension in the installation folder, check the configuration of the AzureEnhancedMonitoring Windows service, and then switch to the folder indicated as *Path to executable*.

  ![Properties of service running the Azure Enhanced Monitoring Extension for SAP][deployment-guide-figure-1000]

2.  In a Command Prompt window, run **azperflib.exe** without any parameters.

> [!NOTE]
> Azperflib.exe runs in a loop and updates the collected counters every 60 seconds. To end the loop, close the Command Prompt window.
>
>

If the Azure Enhanced Monitoring Extension is not installed or the AzureEnhancedMonitoring service is not running, the extension has not been configured correctly. For detailed information about how to deploy the extension, see [Troubleshooting the Azure monitoring infrastructure for SAP][deployment-guide-5.3].

##### Check the output of azperflib.exe
Azperflib.exe output shows all populated Azure performance counters for SAP. At the bottom of the list of collected counters, a summary and health indicator show the status of Azure monitoring.

![Output of health check by executing azperflib.exe, which indicates that no problems exist][deployment-guide-figure-1100]
<a name="figure-11"></a>

Check the result returned for the **Counters total** output, which is reported as empty, and for **Health check**, shown in [Figure 11][deployment-guide-figure-11].

Interpret the resulting values as follows:

| Azperflib.exe result values | Azure monitoring health status |
| --- | --- |
| **API Calls - not available** | Counters that are not available can either be not applicable to the virtual machine configuration or errors. See **Health check**. |
| **Counters total: empty** |The following two Azure storage counters can be empty: <ul><li>Storage Read Op Latency Server msec</li><li>Storage Read Op Latency E2E msec</li></ul>All other counters must have values. |
| **Health check** |Only OK if return status shows **OK** |
| **Diagnostics** |Detailed information about health status |

If the **Health check** value is not **OK**, follow the instructions in [Health check for Azure monitoring infrastructure configuration][deployment-guide-5.2].

#### Execute the readiness check on a Linux VM
To execute the readiness check, connect to the Azure Virtual Machine by using SSH, and then do these steps:

1.  Check the output of the Azure Enhanced Monitoring Extension
  a.  Run `more /var/lib/AzureEnhancedMonitor/PerfCounters`
    Should give you a list of performance counters. The file should not be empty.
  b.  Run `cat /var/lib/AzureEnhancedMonitor/PerfCounters | grep Error`
    Should return one line where the error is **none**, for example, **3;config;Error;;0;0;none;0;1456416792;tst-servercs;**
  c.  Run `more /var/lib/AzureEnhancedMonitor/LatestErrorRecord`
    Should be empty or should not exist.
2.  If the first check was not successful, perform these additional tests:
  a.  Make sure that the waagent is installed and started
    i.  Run `sudo ls -al /var/lib/waagent/`
      * Should list the content of the waagent directory
    ii. Run `ps -ax | grep waagent`
      * Should show one entry similar to `python /usr/sbin/waagent -daemon`
  b.    Make sure that the Linux Diagnostic Extension is installed and running
    i.  Run `sudo sh -c 'ls -al /var/lib/waagent/Microsoft.OSTCExtensions.LinuxDiagnostic-'`
      * Should list the content of the Linux Diagnostic Extension directory
    ii. Run `ps -ax | grep diagnostic`
      * Should show one entry similar to `python /var/lib/waagent/Microsoft.OSTCExtensions.LinuxDiagnostic-2.0.92/diagnostic.py -daemon`
  c.  Make sure that the Azure Enhanced Monitoring Extension is installed and running
    i.  Run `sudo sh -c 'ls -al /var/lib/waagent/Microsoft.OSTCExtensions.AzureEnhancedMonitorForLinux-/'`
      * Should list the content of the Azure Enhanced Monitoring Extension directory
    ii. Run `ps -ax | grep AzureEnhanced`
      * should show one entry similar to `python /var/lib/waagent/Microsoft.OSTCExtensions.AzureEnhancedMonitorForLinux-2.0.0.2/handler.py daemon`
3. Install the SAP Host Agent as described in SAP Note [1031096], and check the output of `saposcol`
  a.  Run `/usr/sap/hostctrl/exe/saposcol -d`
  b.  Run `dump ccm`
  c.  Check whether the metric **Virtualization_Configuration\Enhanced Monitoring Access** is **true**
4.  If you already have a SAP NetWeaver ABAP application server installed, open transaction ST06 and check if the enhanced monitoring is enabled.

If any of the preceding checks fail, for detailed information about how to redeploy the extension, see [Troubleshooting the Azure monitoring infrastructure for SAP][deployment-guide-5.3].

### <a name="e2d592ff-b4ea-4a53-a91a-e5521edb6cd1"></a>Health check for the Azure monitoring infrastructure configuration
If some of the monitoring data is not delivered correctly as indicated by the test described in the preceding section [Readiness Check for Azure Enhanced Monitoring for SAP][deployment-guide-5.1], execute the Test-AzureRmVMAEMExtension cmdlet to test if the current configuration of the Azure monitoring infrastructure and the monitoring extension for SAP is correct.

To test the monitoring configuration, do the following steps:

1.  Make sure that you have installed the latest version of the Microsoft Azure PowerShell cmdlet as described in the section [Deploying Azure PowerShell cmdlets][deployment-guide-4.1].
2.  Run the following PowerShell cmdlet. For a list of available environments, run commandlet Get-AzureRmEnvironment. To use public Azure, select the **AzureCloud** environment. For Azure in China, select **AzureChinaCloud**.

  ```powershell
  $env = Get-AzureRmEnvironment -Name <name of the environment>
  Login-AzureRmAccount -Environment $env
  Set-AzureRmContext -SubscriptionName <subscription name>
  Test-AzureRmVMAEMExtension -ResourceGroupName <resource group name> -VMName <virtual machine name>
  ```

3.  Enter your account data and identify the Azure Virtual Machine.

  ![Input screen of SAP specific Azure cmdlet Test-VMConfigForSAP_GUI][deployment-guide-figure-1200]

4. The script tests the configuration of the virtual machine you choose.

  ![Output of successful test of Azure Monitoring Infrastructure for SAP][deployment-guide-figure-1300]

Make sure every health check is marked **OK**. If some checks are not marked **OK**, run the update cmdlet as described in [Configure Azure Enhanced Monitoring Extension for SAP][deployment-guide-4.5]. Wait 15 minutes and then again perform the checks described in [Readiness check for Azure Enhanced Monitoring for SAP][deployment-guide-5.1] and [Health check for Azure Monitoring Infrastructure Configuration][deployment-guide-5.2]. If the checks still indicate a problem with some or all counters, see [Troubleshooting the Azure monitoring infrastructure for SAP][deployment-guide-5.3].

### <a name="fe25a7da-4e4e-4388-8907-8abc2d33cfd8"></a>Troubleshooting the Azure monitoring infrastructure for SAP
#### ![Windows][Logo_Windows] Azure performance counters do not show up at all
The AzureEnhancedMonitoring Windows service collects performance metrics in Azure. If the service has not been installed correctly or if it is not running in your VM, no performance metrics can be collected.

##### The installation directory of the Azure Enhanced Monitoring Extension is empty
###### Issue
The installation directory
C:\Packages\Plugins\Microsoft.AzureCAT.AzureEnhancedMonitoring.AzureCATExtensionHandler\\`<version`>\drop
is empty.

###### Solution
The extension is not installed. Determine whether it is a proxy issue (as described earlier). You might need to restart the machine or rerun the `Set-AzureRmVMAEMExtension` configuration script.

##### Service for Azure Enhanced Monitoring does not exist
###### Issue
The Windows AzureEnhancedMonitoring service does not exist.

Azperflib.exe: The azperlib.exe output throws an error:

![Execution of azperflib.exe indicates that the service of the Azure Enhanced Monitoring Extension for SAP is not running][deployment-guide-figure-1400]
<a name="figure-14"></a>

###### Solution
If the service does not exist as shown in [Figure 14][deployment-guide-figure-14], the Azure Enhanced Monitoring Extension for SAP has not been installed correctly. Redeploy the extension by doing the steps described for your deployment scenario in [Deployment scenarios of VMs for SAP in Azure][deployment-guide-3].

After you deploy the extension, after one hour, recheck whether the Azure performance counters are provided in the Azure VM.

##### Service for Azure Enhanced Monitoring exists, but fails to start
###### Issue
The Windows AzureEnhancedMonitoring service exists and is enabled but fails to start. For more information, check the application event log.

###### Solution
Bad configuration. Restart the monitoring extension for the VM as described in [Configure Azure Enhanced Monitoring Extension for SAP][deployment-guide-4.5].

#### ![Windows][Logo_Windows] Some Azure performance counters are missing
The AzureEnhancedMonitoring Windows service collects performance metrics in Azure. The service gets data from several sources. Some configuration data is collected locally, some performance metrics are read from Azure Diagnostics, and storage counters are used from your logging on the storage subscription level.

If troubleshooting by using SAP Note [1999351] did not help, rerun the `Set-AzureRmVMAEMExtension` configuration script. You might have to wait an hour because storage analytics or diagnostics counters might not be created immediately after they are enabled. If the problem still exists, open an SAP customer support message on the component BC-OP-NT-AZR for Windows or BC-OP-LNX-AZR for a Linux virtual machine.

#### ![Linux][Logo_Linux] Azure performance counters do not show up at all
The collection of the performance metrics on Azure is done by a deamon. If the deamon is not running, no performance metrics can be collected at all.

##### The installation directory of the Azure Enhanced Monitoring extension is empty
###### Issue
The directory \\var\\lib\\waagent\\ does not have a subdirectory for the Azure Enhanced Monitoring extension.

###### Solution
The extension is not installed. Determine whether it is a proxy issue (as described earlier). You might need to restart the machine and/or rerun the `Set-AzureRmVMAEMExtension` configuration script.

#### ![Linux][Logo_Linux] Some Azure performance counters are missing
The collection of the performance metrics on Azure is done by a daemon, which gets data from several sources. Some configuration data is collected locally, performance metrics are read from Azure Diagnostics, and storage counters are used from your logging on the storage subscription level.

For a complete and up-to-date list of known issues, see SAP Note [1999351], which has additional troubleshooting information for Enhanced Azure Monitoring for SAP.

If troubleshooting by using SAP Note [1999351] did not help, rerun the `Set-AzureRmVMAEMExtension` configuration script as described in [Configure Azure Enhanced Monitoring Extension for SAP][deployment-guide-4.5]. You might have to wait for an hour because storage analytics or diagnostics counters might not be created immediately after they are enabled. If the problem still exists, open an SAP customer support message on the component BC-OP-NT-AZR for Windows or BC-OP-LNX-AZR for a Linux virtual machine.
