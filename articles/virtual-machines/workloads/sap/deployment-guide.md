---
title: Azure Virtual Machines deployment for SAP NetWeaver | Microsoft Docs
description: Learn how to deploy SAP software on Linux virtual machines in Azure.
services: virtual-machines-linux,virtual-machines-windows
documentationcenter: ''
author: MSSedusch
manager: juergent
editor: ''
tags: azure-resource-manager
keywords: ''

ms.assetid: 1c4f1951-3613-4a5a-a0af-36b85750c84e
ms.service: virtual-machines-linux

ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 09/16/2019
ms.author: sedusch
---
# Azure Virtual Machines deployment for SAP NetWeaver

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
[2069760]:https://launchpad.support.sap.com/#/notes/2069760
[2121797]:https://launchpad.support.sap.com/#/notes/2121797
[2134316]:https://launchpad.support.sap.com/#/notes/2134316
[2178632]:https://launchpad.support.sap.com/#/notes/2178632
[2191498]:https://launchpad.support.sap.com/#/notes/2191498
[2233094]:https://launchpad.support.sap.com/#/notes/2233094
[2243692]:https://launchpad.support.sap.com/#/notes/2243692
[2367194]:https://launchpad.support.sap.com/#/notes/2367194

[azure-cli]:../../../cli-install-nodejs.md
[azure-cli-2]:https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest
[azure-portal]:https://portal.azure.com
[azure-ps]:/powershell/azureps-cmdlets-docs
[azure-quickstart-templates-github]:https://github.com/Azure/azure-quickstart-templates
[azure-script-ps]:https://go.microsoft.com/fwlink/p/?LinkID=395017
[azure-resource-manager/management/azure-subscription-service-limits]:../../../azure-resource-manager/management/azure-subscription-service-limits.md
[azure-resource-manager/management/azure-subscription-service-limits-subscription]:../../../azure-resource-manager/management/azure-subscription-service-limits.md#subscription-limits

[dbms-guide]:dbms-guide.md (Azure Virtual Machines DBMS deployment for SAP)
[dbms-guide-2.1]:dbms-guide.md#c7abf1f0-c927-4a7c-9c1d-c7b5b3b7212f (Caching for VMs and VHDs)
[dbms-guide-2.2]:dbms-guide.md#c8e566f9-21b7-4457-9f7f-126036971a91 (Software RAID)
[dbms-guide-2.3]:dbms-guide.md#10b041ef-c177-498a-93ed-44b3441ab152 (Microsoft Azure Storage)
[dbms-guide-2]:dbms-guide.md#65fa79d6-a85f-47ee-890b-22e794f51a64 (Structure of a RDBMS deployment)
[dbms-guide-3]:dbms-guide.md#871dfc27-e509-4222-9370-ab1de77021c3 (High availability and disaster recovery with Azure VMs)
[dbms-guide-5.5.1]:dbms-guide.md#0fef0e79-d3fe-4ae2-85af-73666a6f7268 (SQL Server 2012 SP1 CU4 and later)
[dbms-guide-5.5.2]:dbms-guide.md#f9071eff-9d72-4f47-9da4-1852d782087b (SQL Server 2012 SP1 CU3 and earlier releases)
[dbms-guide-5.6]:dbms-guide.md#1b353e38-21b3-4310-aeb6-a77e7c8e81c8 (Using a SQL Server image from the Azure Marketplace)
[dbms-guide-5.8]:dbms-guide.md#9053f720-6f3b-4483-904d-15dc54141e30 (General SQL Server for SAP on Azure summary)
[dbms-guide-5]:dbms-guide.md#3264829e-075e-4d25-966e-a49dad878737 (Specifics to SQL Server RDBMS)
[dbms-guide-8.4.1]:dbms-guide.md#b48cfe3b-48e9-4f5b-a783-1d29155bd573 (Storage configuration)
[dbms-guide-8.4.2]:dbms-guide.md#23c78d3b-ca5a-4e72-8a24-645d141a3f5d (Backup and restore)
[dbms-guide-8.4.3]:dbms-guide.md#77cd2fbb-307e-4cbf-a65f-745553f72d2c (Performance considerations for backup and restore)
[dbms-guide-8.4.4]:dbms-guide.md#f77c1436-9ad8-44fb-a331-8671342de818 (Other)
[dbms-guide-900-sap-cache-server-on-premises]:dbms-guide.md#642f746c-e4d4-489d-bf63-73e80177a0a8

[dbms-guide-figure-100]:media/virtual-machines-shared-sap-dbms-guide/100_storage_account_types.png
[dbms-guide-figure-200]:media/virtual-machines-shared-sap-dbms-guide/200-ha-set-for-dbms-ha.png
[dbms-guide-figure-300]:media/virtual-machines-shared-sap-dbms-guide/300-reference-config-iaas.png
[dbms-guide-figure-400]:media/virtual-machines-shared-sap-dbms-guide/400-sql-2012-backup-to-blob-storage.png
[dbms-guide-figure-500]:media/virtual-machines-shared-sap-dbms-guide/500-sql-2012-backup-to-blob-storage-different-containers.png
[dbms-guide-figure-600]:media/virtual-machines-shared-sap-dbms-guide/600-iaas-maxdb.png
[dbms-guide-figure-700]:media/virtual-machines-shared-sap-dbms-guide/700-livecach-prod.png
[dbms-guide-figure-800]:media/virtual-machines-shared-sap-dbms-guide/800-azure-vm-sap-content-server.png
[dbms-guide-figure-900]:media/virtual-machines-shared-sap-dbms-guide/900-sap-cache-server-on-premises.png

[deployment-guide]:deployment-guide.md (Azure Virtual Machines deployment for SAP)
[deployment-guide-2.2]:deployment-guide.md#42ee2bdb-1efc-4ec7-ab31-fe4c22769b94 (SAP resources)
[deployment-guide-3.1.2]:deployment-guide.md#3688666f-281f-425b-a312-a77e7db2dfab (Deploying a VM by using a custom image)
[deployment-guide-3.2]:deployment-guide.md#db477013-9060-4602-9ad4-b0316f8bb281 (Scenario 1: Deploying a VM from the Azure Marketplace for SAP)
[deployment-guide-3.3]:deployment-guide.md#54a1fc6d-24fd-4feb-9c57-ac588a55dff2 (Scenario 2: Deploying a VM with a custom image for SAP)
[deployment-guide-3.4]:deployment-guide.md#a9a60133-a763-4de8-8986-ac0fa33aa8c1 (Scenario 3: Moving a VM from on-premises using a non-generalized Azure VHD with SAP)
[deployment-guide-3]:deployment-guide.md#b3253ee3-d63b-4d74-a49b-185e76c4088e (Deployment scenarios of VMs for SAP on Microsoft Azure)
[deployment-guide-4.1]:deployment-guide.md#604bcec2-8b6e-48d2-a944-61b0f5dee2f7 (Deploying Azure PowerShell cmdlets)
[deployment-guide-4.2]:deployment-guide.md#7ccf6c3e-97ae-4a7a-9c75-e82c37beb18e (Download and import SAP-relevant PowerShell cmdlets)
[deployment-guide-4.3]:deployment-guide.md#31d9ecd6-b136-4c73-b61e-da4a29bbc9cc (Join a VM to an on-premises domain - Windows only)
[deployment-guide-4.4.2]:deployment-guide.md#6889ff12-eaaf-4f3c-97e1-7c9edc7f7542 (Linux)
[deployment-guide-4.4]:deployment-guide.md#c7cbb0dc-52a4-49db-8e03-83e7edc2927d (Download, install, and enable the Azure VM Agent)
[deployment-guide-4.5.1]:deployment-guide.md#987cf279-d713-4b4c-8143-6b11589bb9d4 (Azure PowerShell)
[deployment-guide-4.5.2]:deployment-guide.md#408f3779-f422-4413-82f8-c57a23b4fc2f (Azure CLI)
[deployment-guide-4.5]:deployment-guide.md#d98edcd3-f2a1-49f7-b26a-07448ceb60ca (Configure the Azure Extension for SAP)
[deployment-guide-configure-new-extension-ps]:deployment-guide.md#2ad55a0d-9937-4943-9dd2-69bc2b5d3de0 (Configure the new Azure Extension for SAP with Azure PowerShell)
[deployment-guide-configure-new-extension-cli]:deployment-guide.md#c8749c24-fada-42ad-b114-f9aae2dc37da (Configure the new Azure Extension for SAP with Azure CLI)
[deployment-guide-5.1]:deployment-guide.md#bb61ce92-8c5c-461f-8c53-39f5e5ed91f2 (Readiness check for Azure Extension for SAP)
[deployment-guide-5.1-new]:deployment-guide.md#7bf24f59-7347-4c7a-b094-4693e4687ee5 (Readiness check for new Azure Extension for SAP)
[deployment-guide-5.2]:deployment-guide.md#e2d592ff-b4ea-4a53-a91a-e5521edb6cd1 (Health check for the Azure Extension for SAP configuration)
[deployment-guide-5.2-new]:deployment-guide.md#464ac96d-7d3c-435d-a5ae-3faf3bfef4b3 (Health check for the new Azure Extension for SAP configuration)
[deployment-guide-5.3]:deployment-guide.md#fe25a7da-4e4e-4388-8907-8abc2d33cfd8 (Troubleshooting Azure Extension for SAP)
[deployment-guide-5.3-new]:deployment-guide.md#b7afb8ef-a64c-495d-bb37-2af96688c530 (Troubleshooting the new Azure Extension for SAP)
[deployment-guide-contact-support]:deployment-guide.md#3ba34cfc-c9bb-4648-9c3c-88e8b9130ca2 (Troubleshooting Azure Extension for SAP - Contact Support)
[deployment-guide-run-the-script]:deployment-guide.md#0d2847ad-865d-4a4c-a405-f9b7baaa00c7 (Troubleshooting Azure Extension for SAP - Run the setup script)
[deployment-guide-redeploy-after-sysprep]:deployment-guide.md#2cd61f22-187d-42ed-bb8c-def0c983d756 (Troubleshooting Azure Extension for SAP - Redeploy after sysprep)
[deployment-guide-fix-internet-connection]:deployment-guide.md#e92bc57d-80d9-4a2b-a2f4-16713a22ad89 ( Troubleshooting Azure Extension for SAP - Fix internet connection)


[deployment-guide-configure-monitoring-scenario-1]:deployment-guide.md#ec323ac3-1de9-4c3a-b770-4ff701def65b (Configure VM Extension)
[deployment-guide-configure-proxy]:deployment-guide.md#baccae00-6f79-4307-ade4-40292ce4e02d (Configure the proxy)
[deployment-guide-figure-100]:media/virtual-machines-shared-sap-deployment-guide/100-deploy-vm-image.png
[deployment-guide-figure-1000]:media/virtual-machines-shared-sap-deployment-guide/1000-service-properties.png
[deployment-guide-figure-11]:deployment-guide.md#figure-11
[deployment-guide-figure-1100]:media/virtual-machines-shared-sap-deployment-guide/1100-azperflib.png
[deployment-guide-figure-1200]:media/virtual-machines-shared-sap-deployment-guide/1200-cmd-test-login.png
[deployment-guide-figure-1300]:media/virtual-machines-shared-sap-deployment-guide/1300-cmd-test-executed.png
[deployment-guide-figure-14]:deployment-guide.md#figure-14
[deployment-guide-figure-1400]:media/virtual-machines-shared-sap-deployment-guide/1400-azperflib-error-servicenotstarted.png
[deployment-guide-figure-300]:media/virtual-machines-shared-sap-deployment-guide/300-deploy-private-image.png
[deployment-guide-figure-400]:media/virtual-machines-shared-sap-deployment-guide/400-deploy-using-disk.png
[deployment-guide-figure-5]:deployment-guide.md#figure-5
[deployment-guide-figure-50]:media/virtual-machines-shared-sap-deployment-guide/50-forced-tunneling-suse.png
[deployment-guide-figure-500]:media/virtual-machines-shared-sap-deployment-guide/500-install-powershell.png
[deployment-guide-figure-6]:deployment-guide.md#figure-6
[deployment-guide-figure-600]:media/virtual-machines-shared-sap-deployment-guide/600-powershell-version.png
[deployment-guide-figure-7]:deployment-guide.md#figure-7
[deployment-guide-figure-700]:media/virtual-machines-shared-sap-deployment-guide/700-install-powershell-installed.png
[deployment-guide-figure-760]:media/virtual-machines-shared-sap-deployment-guide/760-azure-cli-version.png
[deployment-guide-figure-900]:media/virtual-machines-shared-sap-deployment-guide/900-cmd-update-executed.png
[deployment-guide-figure-azure-cli-installed]:deployment-guide.md#402488e5-f9bb-4b29-8063-1c5f52a892d0
[deployment-guide-figure-azure-cli-version]:deployment-guide.md#0ad010e6-f9b5-4c21-9c09-bb2e5efb3fda
[deployment-guide-install-vm-agent-windows]:deployment-guide.md#b2db5c9a-a076-42c6-9835-16945868e866
[deployment-guide-troubleshooting-chapter]:deployment-guide.md#564adb4f-5c95-4041-9616-6635e83a810b (Checks and Troubleshooting)

[deploy-template-cli]:../../../resource-group-template-deploy-cli.md
[deploy-template-portal]:../../../resource-group-template-deploy-portal.md
[deploy-template-powershell]:../../../resource-group-template-deploy.md

[dr-guide-classic]:https://go.microsoft.com/fwlink/?LinkID=521971

[getting-started]:get-started.md
[getting-started-dbms]:get-started.md#1343ffe1-8021-4ce6-a08d-3a1553a4db82
[getting-started-deployment]:get-started.md#6aadadd2-76b5-46d8-8713-e8d63630e955
[getting-started-planning]:get-started.md#3da0389e-708b-4e82-b2a2-e92f132df89c

[getting-started-windows-classic]:../../virtual-machines-windows-classic-sap-get-started.md
[getting-started-windows-classic-dbms]:../../virtual-machines-windows-classic-sap-get-started.md#c5b77a14-f6b4-44e9-acab-4d28ff72a930
[getting-started-windows-classic-deployment]:../../virtual-machines-windows-classic-sap-get-started.md#f84ea6ce-bbb4-41f7-9965-34d31b0098ea
[getting-started-windows-classic-dr]:../../virtual-machines-windows-classic-sap-get-started.md#cff10b4a-01a5-4dc3-94b6-afb8e55757d3
[getting-started-windows-classic-ha-sios]:../../virtual-machines-windows-classic-sap-get-started.md#4bb7512c-0fa0-4227-9853-4004281b1037
[getting-started-windows-classic-planning]:../../virtual-machines-windows-classic-sap-get-started.md#f2a5e9d8-49e4-419e-9900-af783173481c

[ha-guide-classic]:https://go.microsoft.com/fwlink/?LinkId=613056

[install-extension-cli]:virtual-machines-linux-enable-aem.md

[Logo_Linux]:media/virtual-machines-shared-sap-shared/Linux.png
[Logo_Windows]:media/virtual-machines-shared-sap-shared/Windows.png

[msdn-set-Azvmaemextension]:https://docs.microsoft.com/powershell/module/az.compute/set-azvmaemextension

[planning-guide]:planning-guide.md (Azure Virtual Machines planning and implementation for SAP)
[planning-guide-1.2]:planning-guide.md#e55d1e22-c2c8-460b-9897-64622a34fdff (Resources)
[planning-guide-11]:planning-guide.md#7cf991a1-badd-40a9-944e-7baae842a058 (High availability and disaster recovery for SAP NetWeaver running on Azure Virtual Machines)
[planning-guide-11.4.1]:planning-guide.md#5d9d36f9-9058-435d-8367-5ad05f00de77 (High availability for SAP Application Servers)
[planning-guide-11.5]:planning-guide.md#4e165b58-74ca-474f-a7f4-5e695a93204f (Using Autostart for SAP instances)
[planning-guide-2.1]:planning-guide.md#1625df66-4cc6-4d60-9202-de8a0b77f803 (Cloud-only - Virtual Machine deployments in Azure without dependencies on the on-premises customer network)
[planning-guide-2.2]:planning-guide.md#f5b3b18c-302c-4bd8-9ab2-c388f1ab3d10 (Cross-premises - Deployment of single or multiple SAP VMs in Azure fully integrated with the on-premises network)
[planning-guide-3.1]:planning-guide.md#be80d1b9-a463-4845-bd35-f4cebdb5424a (Azure regions)
[planning-guide-3.2.1]:planning-guide.md#df49dc09-141b-4f34-a4a2-990913b30358 (Fault domains)
[planning-guide-3.2.2]:planning-guide.md#fc1ac8b2-e54a-487c-8581-d3cc6625e560 (Upgrade domains)
[planning-guide-3.2.3]:planning-guide.md#18810088-f9be-4c97-958a-27996255c665 (Azure availability sets)
[planning-guide-3.2]:planning-guide.md#8d8ad4b8-6093-4b91-ac36-ea56d80dbf77 (Microsoft Azure virtual machines concept)
[planning-guide-3.3.2]:planning-guide.md#ff5ad0f9-f7f4-4022-9102-af07aef3bc92 (Azure Premium Storage)
[planning-guide-5.1.1]:planning-guide.md#4d175f1b-7353-4137-9d2f-817683c26e53 (Moving a VM from on-premises to Azure with a non-generalized disk)
[planning-guide-5.1.2]:planning-guide.md#e18f7839-c0e2-4385-b1e6-4538453a285c (Deploying a VM with a customer specific image)
[planning-guide-5.2.1]:planning-guide.md#1b287330-944b-495d-9ea7-94b83aff73ef (Preparation for moving a VM from on-premises to Azure with a non-generalized disk)
[planning-guide-5.2.2]:planning-guide.md#57f32b1c-0cba-4e57-ab6e-c39fe22b6ec3 (Preparation for deploying a VM with a customer specific image for SAP)
[planning-guide-5.2]:planning-guide.md#6ffb9f41-a292-40bf-9e70-8204448559e7 (Preparing VMs with SAP for Azure)
[planning-guide-5.3.1]:planning-guide.md#6e835de8-40b1-4b71-9f18-d45b20959b79 (Difference between an Azure disk and an Azure image)
[planning-guide-5.3.2]:planning-guide.md#a43e40e6-1acc-4633-9816-8f095d5a7b6a (Uploading a VHD from on-premises to Azure)
[planning-guide-5.4.2]:planning-guide.md#9789b076-2011-4afa-b2fe-b07a8aba58a1 (Copying disks between Azure Storage accounts)
[planning-guide-5.5.1]:planning-guide.md#4efec401-91e0-40c0-8e64-f2dceadff646 (VM/VHD structure for SAP deployments)
[planning-guide-5.5.3]:planning-guide.md#17e0d543-7e8c-4160-a7da-dd7117a1ad9d (Setting automount for attached disks)
[planning-guide-7.1]:planning-guide.md#3e9c3690-da67-421a-bc3f-12c520d99a30 (Single VM with SAP NetWeaver demo/training scenario)
[planning-guide-7]:planning-guide.md#96a77628-a05e-475d-9df3-fb82217e8f14 (Concepts of Cloud-Only deployment of SAP instances)
[planning-guide-9.1]:planning-guide.md#6f0a47f3-a289-4090-a053-2521618a28c3 (Azure Monitoring Solution for SAP)
[planning-guide-azure-premium-storage]:planning-guide.md#ff5ad0f9-f7f4-4022-9102-af07aef3bc92 (Azure Premium Storage)
[planning-guide-managed-disks]:planning-guide.md#c55b2c6e-3ca1-4476-be16-16c81927550f (Managed Disks)
[planning-guide-figure-100]:media/virtual-machines-shared-sap-planning-guide/100-single-vm-in-azure.png
[planning-guide-figure-1300]:media/virtual-machines-shared-sap-planning-guide/1300-ref-config-iaas-for-sap.png
[planning-guide-figure-1400]:media/virtual-machines-shared-sap-planning-guide/1400-attach-detach-disks.png
[planning-guide-figure-1600]:media/virtual-machines-shared-sap-planning-guide/1600-firewall-port-rule.png
[planning-guide-figure-1700]:media/virtual-machines-shared-sap-planning-guide/1700-single-vm-demo.png
[planning-guide-figure-1900]:media/virtual-machines-shared-sap-planning-guide/1900-vm-set-vnet.png
[planning-guide-figure-200]:media/virtual-machines-shared-sap-planning-guide/200-multiple-vms-in-azure.png
[planning-guide-figure-2100]:media/virtual-machines-shared-sap-planning-guide/2100-s2s.png
[planning-guide-figure-2200]:media/virtual-machines-shared-sap-planning-guide/2200-network-printing.png
[planning-guide-figure-2300]:media/virtual-machines-shared-sap-planning-guide/2300-sapgui-stms.png
[planning-guide-figure-2400]:media/virtual-machines-shared-sap-planning-guide/2400-vm-extension-overview.png
[planning-guide-figure-2500]:media/virtual-machines-shared-sap-planning-guide/2500-vm-extension-details.png
[planning-guide-figure-2600]:media/virtual-machines-shared-sap-planning-guide/2600-sap-router-connection.png
[planning-guide-figure-2700]:media/virtual-machines-shared-sap-planning-guide/2700-exposed-sap-portal.png
[planning-guide-figure-2800]:media/virtual-machines-shared-sap-planning-guide/2800-endpoint-config.png
[planning-guide-figure-2900]:media/virtual-machines-shared-sap-planning-guide/2900-azure-ha-sap-ha.png
[planning-guide-figure-300]:media/virtual-machines-shared-sap-planning-guide/300-vpn-s2s.png
[planning-guide-figure-3000]:media/virtual-machines-shared-sap-planning-guide/3000-sap-ha-on-azure.png
[planning-guide-figure-3200]:media/virtual-machines-shared-sap-planning-guide/3200-sap-ha-with-sql.png
[planning-guide-figure-400]:media/virtual-machines-shared-sap-planning-guide/400-vm-services.png
[planning-guide-figure-600]:media/virtual-machines-shared-sap-planning-guide/600-s2s-details.png
[planning-guide-figure-700]:media/virtual-machines-shared-sap-planning-guide/700-decision-tree-deploy-to-azure.png
[planning-guide-figure-800]:media/virtual-machines-shared-sap-planning-guide/800-portal-vm-overview.png
[planning-guide-microsoft-azure-networking]:planning-guide.md#61678387-8868-435d-9f8c-450b2424f5bd (Microsoft Azure networking)
[planning-guide-storage-microsoft-azure-storage-and-data-disks]:planning-guide.md#a72afa26-4bf4-4a25-8cf7-855d6032157f (Storage: Microsoft Azure Storage and data disks)

[resource-group-authoring-templates]:../../../resource-group-authoring-templates.md
[resource-group-overview]:../../../azure-resource-manager/management/overview.md
[resource-groups-networking]:../../../networking/network-overview.md
[sap-pam]:https://support.sap.com/pam (SAP Product Availability Matrix)
[sap-templates-2-tier-marketplace-image]:https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fsap-2-tier-marketplace-image%2Fazuredeploy.json
[sap-templates-2-tier-marketplace-image-md]:https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fsap-2-tier-marketplace-image-md%2Fazuredeploy.json
[sap-templates-2-tier-os-disk]:https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fsap-2-tier-user-disk%2Fazuredeploy.json
[sap-templates-2-tier-os-disk-md]:https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fsap-2-tier-user-disk-md%2Fazuredeploy.json
[sap-templates-2-tier-user-image]:https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fsap-2-tier-user-image%2Fazuredeploy.json
[sap-templates-2-tier-user-image-md]:https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fsap-2-tier-user-image-md%2Fazuredeploy.json
[sap-templates-3-tier-marketplace-image]:https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fsap-3-tier-marketplace-image%2Fazuredeploy.json
[sap-templates-3-tier-marketplace-image-md]:https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fsap-3-tier-marketplace-image-md%2Fazuredeploy.json
[sap-templates-3-tier-user-image]:https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fsap-3-tier-user-image%2Fazuredeploy.json
[sap-templates-3-tier-user-image-md]:https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fsap-3-tier-user-image-md%2Fazuredeploy.json
[storage-azure-cli]:../../../storage/common/storage-azure-cli.md
[storage-azure-cli-copy-blobs]:../../../storage/common/storage-azure-cli.md#copy-blobs
[storage-introduction]:../../../storage/common/storage-introduction.md
[storage-powershell-guide-full-copy-vhd]:../../../storage/common/storage-powershell-guide-full.md#how-to-copy-blobs-from-one-storage-container-to-another
[storage-premium-storage-preview-portal]:../../windows/disks-types.md
[storage-redundancy]:../../../storage/common/storage-redundancy.md
[storage-scalability-targets]:../../../storage/common/scalability-targets-standard-accounts.md
[storage-use-azcopy]:../../../storage/common/storage-use-azcopy.md
[template-201-vm-from-specialized-vhd]:https://github.com/Azure/azure-quickstart-templates/tree/master/201-vm-from-specialized-vhd
[templates-101-simple-windows-vm]:https://github.com/Azure/azure-quickstart-templates/tree/master/101-simple-windows-vm
[templates-101-vm-from-user-image]:https://github.com/Azure/azure-quickstart-templates/tree/master/101-vm-from-user-image
[virtual-machines-linux-attach-disk-portal]:../../linux/attach-disk-portal.md
[virtual-machines-azure-resource-manager-architecture]:../../../resource-manager-deployment-model.md
[virtual-machines-Az-versus-azuresm]:virtual-machines-linux-compare-deployment-models.md
[virtual-machines-windows-classic-configure-oracle-data-guard]:../../virtual-machines-windows-classic-configure-oracle-data-guard.md
[virtual-machines-linux-cli-deploy-templates]:../../linux/cli-deploy-templates.md (Deploy and manage virtual machines by using Azure Resource Manager templates and the Azure CLI)
[virtual-machines-deploy-rmtemplates-powershell]:../../virtual-machines-windows-ps-manage.md (Manage virtual machines by using Azure Resource Manager and PowerShell)
[virtual-machines-windows-agent-user-guide]:../../extensions/agent-windows.md
[virtual-machines-linux-agent-user-guide]:../../extensions/agent-linux.md
[virtual-machines-linux-agent-user-guide-command-line-options]:../../extensions/agent-linux.md#command-line-options
[virtual-machines-linux-capture-image]:../../linux/capture-image.md
[virtual-machines-linux-capture-image-resource-manager]:../../linux/capture-image.md
[virtual-machines-linux-capture-image-resource-manager-capture]:../../linux/capture-image.md#step-2-capture-the-vm
[virtual-machines-linux-configure-raid]:../../linux/configure-raid.md
[virtual-machines-linux-configure-lvm]:../../linux/configure-lvm.md
[virtual-machines-linux-classic-create-upload-vhd-step-1]:../../virtual-machines-linux-classic-create-upload-vhd.md#step-1-prepare-the-image-to-be-uploaded
[virtual-machines-linux-create-upload-vhd-suse]:../../linux/suse-create-upload-vhd.md
[virtual-machines-linux-redhat-create-upload-vhd]:../../linux/redhat-create-upload-vhd.md
[virtual-machines-linux-how-to-attach-disk]:../../linux/add-disk.md
[virtual-machines-linux-how-to-attach-disk-how-to-initialize-a-new-data-disk-in-linux]:../../linux/add-disk.md#connect-to-the-linux-vm-to-mount-the-new-disk
[virtual-machines-linux-tutorial]:../../linux/quick-create-cli.md
[virtual-machines-linux-update-agent]:../../linux/update-agent.md
[virtual-machines-manage-availability]:../../linux/manage-availability.md
[virtual-machines-ps-create-preconfigure-windows-resource-manager-vms]:../../virtual-machines-windows-ps-create.md
[virtual-machines-sizes]:../../linux/sizes.md
[virtual-machines-windows-classic-ps-sql-alwayson-availability-groups]:./../../windows/sqlclassic/virtual-machines-windows-classic-ps-sql-alwayson-availability-groups.md
[virtual-machines-windows-classic-ps-sql-int-listener]:./../../windows/sqlclassic/virtual-machines-windows-classic-ps-sql-int-listener.md
[virtual-machines-sql-server-high-availability-and-disaster-recovery-solutions]:../../../azure-sql/virtual-machines/windows/business-continuity-high-availability-disaster-recovery-hadr-overview.md
[virtual-machines-sql-server-infrastructure-services]:../../../azure-sql/virtual-machines/windows/sql-server-on-azure-vm-iaas-what-is-overview.md
[virtual-machines-sql-server-performance-best-practices]:../../../azure-sql/virtual-machines/windows/performance-guidelines-best-practices.md
[virtual-machines-upload-image-windows-resource-manager]:../../virtual-machines-windows-upload-image.md
[virtual-machines-windows-tutorial]:../../virtual-machines-windows-hero-tutorial.md
[virtual-machines-workload-template-sql-alwayson]:https://azure.microsoft.com/documentation/templates/sql-server-2014-alwayson-dsc/
[virtual-network-deploy-multinic-arm-cli]:../linux/multiple-nics.md
[virtual-network-deploy-multinic-arm-ps]:../windows/multiple-nics.md
[virtual-network-deploy-multinic-arm-template]:../../../virtual-network/template-samples.md
[virtual-networks-configure-vnet-to-vnet-connection]:../../../vpn-gateway/vpn-gateway-vnet-vnet-rm-ps.md
[virtual-networks-create-vnet-arm-pportal]:../../../virtual-network/manage-virtual-network.md#create-a-virtual-network
[virtual-networks-manage-dns-in-vnet]:../../../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md
[virtual-networks-multiple-nics]:../../../virtual-network/virtual-network-deploy-multinic-classic-ps.md
[virtual-networks-nsg]:../../../virtual-network/security-overview.md
[virtual-networks-reserved-private-ip]:../../../virtual-network/virtual-networks-static-private-ip-arm-ps.md
[virtual-networks-static-private-ip-arm-pportal]:../../../virtual-network/virtual-networks-static-private-ip-arm-pportal.md
[virtual-networks-udr-overview]:../../../virtual-network/virtual-networks-udr-overview.md
[vpn-gateway-about-vpn-devices]:../../../vpn-gateway/vpn-gateway-about-vpn-devices.md
[vpn-gateway-create-site-to-site-rm-powershell]:../../../vpn-gateway/vpn-gateway-create-site-to-site-rm-powershell.md
[vpn-gateway-cross-premises-options]:../../../vpn-gateway/vpn-gateway-plan-design.md
[vpn-gateway-site-to-site-create]:../../../vpn-gateway/vpn-gateway-site-to-site-create.md
[vpn-gateway-vpn-faq]:../../../vpn-gateway/vpn-gateway-vpn-faq.md
[xplat-cli]:../../../cli-install-nodejs.md
[xplat-cli-azure-resource-manager]:../../../xplat-cli-azure-resource-manager.md
[qs-configure-powershell-windows-vm]:../../../active-directory/managed-identities-azure-resources/qs-configure-powershell-windows-vm.md
[qs-configure-cli-windows-vm]:../../../active-directory/managed-identities-azure-resources/qs-configure-cli-windows-vm.md
[howto-assign-access-powershell]:../../../active-directory/managed-identities-azure-resources/howto-assign-access-powershell.md
[howto-assign-access-cli]:../../../active-directory/managed-identities-azure-resources/howto-assign-access-cli.md

[!INCLUDE [learn-about-deployment-models](../../../../includes/learn-about-deployment-models-rm-include.md)]

Azure Virtual Machines is the solution for organizations that need compute and storage resources, in minimal time, and without lengthy procurement cycles. You can use Azure Virtual Machines to deploy classical applications, like SAP NetWeaver-based applications, in Azure. Extend an application's reliability and availability without additional on-premises resources. Azure Virtual Machines supports cross-premises connectivity, so you can integrate Azure Virtual Machines into your organization's on-premises domains, private clouds, and SAP system landscape.

In this article, we cover the steps to deploy SAP applications on virtual machines (VMs) in Azure, including alternate deployment options and troubleshooting. This article builds on the information in [Azure Virtual Machines planning and implementation for SAP NetWeaver][planning-guide]. It also complements SAP installation documentation and SAP Notes, which are the primary resources for installing and deploying SAP software.

## Prerequisites

[!INCLUDE [updated-for-az](../../../../includes/updated-for-az.md)]

Setting up an Azure virtual machine for SAP software deployment involves multiple steps and resources. Before you start, make sure that you meet the prerequisites for installing SAP software on virtual machines in Azure.

### Local computer

To manage Windows or Linux VMs, you can use a PowerShell script and the Azure portal. For both tools, you need a local computer running Windows 7 or a later version of Windows. If you want to manage only Linux VMs and you want to use a Linux computer for this task, you can use Azure CLI.

### Internet connection

To download and run the tools and scripts that are required for SAP software deployment, you must be connected to the Internet. The Azure VM that is running the Azure Extension for SAP also needs access to the Internet. If the Azure VM is part of an Azure virtual network or on-premises domain, make sure that the relevant proxy settings are set, as described in [Configure the proxy][deployment-guide-configure-proxy].

### Microsoft Azure subscription

You need an active Azure account.

### Topology and networking

You need to define the topology and architecture of the SAP deployment in Azure:

* Azure storage accounts to be used
* Virtual network where you want to deploy the SAP system
* Resource group to which you want to deploy the SAP system
* Azure region where you want to deploy the SAP system
* SAP configuration (two-tier or three-tier)
* VM sizes and the number of additional data disks to be mounted to the VMs
* SAP Correction and Transport System (CTS) configuration

Create and configure Azure storage accounts (if required) or Azure virtual networks before you begin the SAP software deployment process. For information about how to create and configure these resources, see [Azure Virtual Machines planning and implementation for SAP NetWeaver][planning-guide].

### SAP sizing

Know the following information, for SAP sizing:

* Projected SAP workload, for example, by using the SAP Quick Sizer tool, and the SAP Application Performance Standard (SAPS) number
* Required CPU resource and memory consumption of the SAP system
* Required input/output (I/O) operations per second
* Required network bandwidth of eventual communication between VMs in Azure
* Required network bandwidth between on-premises assets and the Azure-deployed SAP system

### Resource groups

In Azure Resource Manager, you can use resource groups to manage all the application resources in your Azure subscription. For more information, see [Azure Resource Manager overview][resource-group-overview].

## Resources

### <a name="42ee2bdb-1efc-4ec7-ab31-fe4c22769b94"></a>SAP resources

When you are setting up your SAP software deployment, you need the following SAP resources:

* SAP Note [1928533], which has:
  * List of Azure VM sizes that are supported for the deployment of SAP software
  * Important capacity information for Azure VM sizes
  * Supported SAP software, and operating system (OS) and database combinations
  * Required SAP kernel version for Windows and Linux on Microsoft Azure

* SAP Note [2015553] lists prerequisites for SAP-supported SAP software deployments in Azure.
* SAP Note [2178632] has detailed information about all monitoring metrics reported for SAP in Azure.
* SAP Note [1409604] has the required SAP Host Agent version for Windows in Azure.
* SAP Note [2191498] has the required SAP Host Agent version for Linux in Azure.
* SAP Note [2243692] has information about SAP licensing on Linux in Azure.
* SAP Note [1984787] has general information about SUSE Linux Enterprise Server 12.
* SAP Note [2002167] has general information about Red Hat Enterprise Linux 7.x.
* SAP Note [2069760] has general information about Oracle Linux 7.x.
* SAP Note [1999351] has additional troubleshooting information for the Azure Extension for SAP.
* SAP Note [1597355] has general information about swap-space for Linux.
* [SAP on Azure SCN page](https://wiki.scn.sap.com/wiki/x/Pia7Gg) has news and a collection of useful resources.
* [SAP Community WIKI](https://wiki.scn.sap.com/wiki/display/HOME/SAPonLinuxNotes) has all required SAP Notes for Linux.
* SAP-specific PowerShell cmdlets that are part of [Azure PowerShell][azure-ps].
* SAP-specific Azure CLI commands that are part of [Azure CLI][azure-cli].

### <a name="42ee2bdb-1efc-4ec7-ab31-fe4c22769b94"></a>Windows resources

These Microsoft articles cover SAP deployments in Azure:

* [Azure Virtual Machines planning and implementation for SAP NetWeaver][planning-guide]
* [Azure Virtual Machines deployment for SAP NetWeaver (this article)][deployment-guide]
* [Azure Virtual Machines DBMS deployment for SAP NetWeaver][dbms-guide]

## <a name="b3253ee3-d63b-4d74-a49b-185e76c4088e"></a>Deployment scenarios for SAP software on Azure VMs

You have multiple options for deploying VMs and associated disks in Azure. It's important to understand the differences between deployment options, because you might take different steps to prepare your VMs for deployment based on the deployment type you choose.

### <a name="db477013-9060-4602-9ad4-b0316f8bb281"></a>Scenario 1: Deploying a VM from the Azure Marketplace for SAP

You can use an image provided by Microsoft or by a third party in the Azure Marketplace to deploy your VM. The Marketplace offers some standard OS images of Windows Server and different Linux distributions. You also can deploy an image that includes database management system (DBMS) SKUs, for example, Microsoft SQL Server. For more information about using images with DBMS SKUs, see [Azure Virtual Machines DBMS deployment for SAP NetWeaver][dbms-guide].

The following flowchart shows the SAP-specific sequence of steps for deploying a VM from the Azure Marketplace:

![Flowchart of VM deployment for SAP systems by using a VM image from the Azure Marketplace][deployment-guide-figure-100]

#### Create a virtual machine by using the Azure portal

The easiest way to create a new virtual machine with an image from the Azure Marketplace is by using the Azure portal.

1.  Go to <https://portal.azure.com/#create/hub>.  Or, in the Azure portal menu, select **+ New**.
1.  Select **Compute**, and then select the type of operating system you want to deploy. For example, Windows Server 2012 R2, SUSE Linux Enterprise Server 12 (SLES 12), Red Hat Enterprise Linux 7.2 (RHEL 7.2), or Oracle Linux 7.2. The default list view does not show all supported operating systems. Select **see all** for a full list. For more information about supported operating systems for SAP software deployment, see SAP Note [1928533].
1.  On the next page, review terms and conditions.
1.  In the **Select a deployment model** box, select **Resource Manager**.
1.  Select **Create**.

The wizard guides you through setting the required parameters to create the virtual machine, in addition to all required resources, like network interfaces and storage accounts. Some of these parameters are:

1. **Basics**:
   * **Name**: The name of the resource (the virtual machine name).
   * **VM disk type**: Select the disk type of the OS disk. If you want to use Premium Storage for your data disks, we recommend using Premium Storage for the OS disk as well.
   * **Username and password** or **SSH public key**: Enter the username and password of the user that is created during the provisioning. For a Linux virtual machine, you can enter the public Secure Shell (SSH) key that you use to sign in to the machine.
   * **Subscription**: Select the subscription that you want to use to provision the new virtual machine.
   * **Resource group**: The name of the resource group for the VM. You can enter either the name of a new resource group or the name of a resource group that already exists.
   * **Location**: Where to deploy the new virtual machine. If you want to connect the virtual machine to your on-premises network, make sure you select the location of the virtual network that connects Azure to your on-premises network. For more information, see [Microsoft Azure networking][planning-guide-microsoft-azure-networking] in [Azure Virtual Machines planning and implementation for SAP NetWeaver][planning-guide].
1. **Size**:

	 For a list of supported VM types, see SAP Note [1928533]. Be sure you select the correct VM type if you want to use Azure Premium Storage. Not all VM types support Premium Storage. For more information, see [Storage: Microsoft Azure Storage and data disks][planning-guide-storage-microsoft-azure-storage-and-data-disks] and [Azure Premium Storage][planning-guide-azure-premium-storage] in [Azure Virtual Machines planning and implementation for SAP NetWeaver][planning-guide].

1. **Settings**:
   * **Storage**
     * **Disk Type**: Select the disk type of the OS disk. If you want to use Premium Storage for your data disks, we recommend using Premium Storage for the OS disk as well.
     * **Use managed disks**: If you want to use Managed Disks, select Yes. For more information about Managed Disks, see chapter [Managed Disks][planning-guide-managed-disks] in the planning guide.
     * **Storage account**: Select an existing storage account or create a new one. Not all storage types work for running SAP applications. For more information about storage types, see [Storage structure of a VM for RDBMS Deployments](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/dbms_guide_general#65fa79d6-a85f-47ee-890b-22e794f51a64).
   * **Network**
     * **Virtual network** and **Subnet**: To integrate the virtual machine with your intranet, select the virtual network that is connected to your on-premises network.
     * **Public IP address**: Select the public IP address that you want to use, or enter parameters to create a new public IP address. You can use a public IP address to access your virtual machine over the Internet. Make sure that you also create a network security group to help secure access to your virtual machine.
     * **Network security group**: For more information, see [Control network traffic flow with network security groups][virtual-networks-nsg].
   * **Extensions**: You can install virtual machine extensions by adding them to the deployment. You do not need to add extensions in this step. The extensions required for SAP support are installed later. See chapter [Configure the Azure Extension for SAP][deployment-guide-4.5] in this guide.
   * **High Availability**: Select an availability set, or enter the parameters to create a new availability set. For more information, see [Azure availability sets][planning-guide-3.2.3].
   * **Monitoring**
     * **Boot diagnostics**: You can select **Disable** for boot diagnostics.
     * **Guest OS diagnostics**: You can select **Disable** for monitoring diagnostics.

1. **Summary**:

   Review your selections, and then select **OK**.

Your virtual machine is deployed in the resource group you selected.

#### Create a virtual machine by using a template

You can create a virtual machine by using one of the SAP templates published in the [azure-quickstart-templates GitHub repository][azure-quickstart-templates-github]. You also can manually create a virtual machine by using the [Azure portal][virtual-machines-windows-tutorial], [PowerShell][virtual-machines-ps-create-preconfigure-windows-resource-manager-vms], or [Azure CLI][virtual-machines-linux-tutorial].

* [**Two-tier configuration (only one virtual machine) template** (sap-2-tier-marketplace-image)][sap-templates-2-tier-marketplace-image]

  To create a two-tier system by using only one virtual machine, use this template.
* [**Two-tier configuration (only one virtual machine) template - Managed Disks** (sap-2-tier-marketplace-image-md)][sap-templates-2-tier-marketplace-image-md]

  To create a two-tier system by using only one virtual machine and Managed Disks, use this template.
* [**Three-tier configuration (multiple virtual machines) template** (sap-3-tier-marketplace-image)][sap-templates-3-tier-marketplace-image]

  To create a three-tier system by using multiple virtual machines, use this template.
* [**Three-tier configuration (multiple virtual machines) template - Managed Disks** (sap-3-tier-marketplace-image-md)][sap-templates-3-tier-marketplace-image-md]

  To create a three-tier system by using multiple virtual machines and Managed Disks, use this template.

In the Azure portal, enter the following parameters for the template:

1. **Basics**:
   * **Subscription**: The subscription to use to deploy the template.
   * **Resource group**: The resource group to use to deploy the template. You can create a new resource group, or you can select an existing resource group in the subscription.
   * **Location**: Where to deploy the template. If you selected an existing resource group, the location of that resource group is used.

1. **Settings**:
   * **SAP System ID**: The SAP System ID (SID).
   * **OS type**: The operating system you want to deploy, for example, Windows Server 2012 R2, SUSE Linux Enterprise Server 12 (SLES 12), Red Hat Enterprise Linux 7.2 (RHEL 7.2), or Oracle Linux 7.2.

     The list view does not show all supported operating systems. For more information about supported operating systems for SAP software deployment, see SAP Note [1928533].
   * **SAP system size**: The size of the SAP system.

     The number of SAPS the new system provides. If you are not sure how many SAPS the system requires, ask your SAP Technology Partner or System Integrator.
   * **System availability** (three-tier template only): The system availability.

     Select **HA** for a configuration that is suitable for a high-availability installation. Two database servers and two servers for ABAP SAP Central Services (ASCS) are created.
   * **Storage type** (two-tier template only): The type of storage to use.

     For larger systems, we highly recommend using Azure Premium Storage. For more information about storage types, see these resources:
      * [Use of Azure Premium SSD Storage for SAP DBMS Instance][2367194]
      * [Storage structure of a VM for RDBMS Deployments](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/dbms_guide_general#65fa79d6-a85f-47ee-890b-22e794f51a64)
      * [Premium Storage: High-performance storage for Azure Virtual Machine workloads][storage-premium-storage-preview-portal]
      * [Introduction to Microsoft Azure Storage][storage-introduction]
   * **Admin username** and **Admin password**: A username and password.
     A new user is created, for signing in to the virtual machine.
   * **New or existing subnet**: Determines whether a new virtual network and subnet are  created or an existing subnet is used. If you already have a virtual network that is connected to your on-premises network, select **Existing**.
   * **Subnet ID**: If you want to deploy the VM into an existing VNet where you have a subnet defined the VM should be assigned to, name the ID of that specific subnet. The ID usually looks like this:
     /subscriptions/&lt;subscription id>/resourceGroups/&lt;resource group name>/providers/Microsoft.Network/virtualNetworks/&lt;virtual network name>/subnets/&lt;subnet name>

1. **Terms and conditions**:  
    Review and accept the legal terms.

1. Select **Purchase**.

The Azure VM Agent is deployed by default when you use an image from the Azure Marketplace.

#### Configure proxy settings

Depending on how your on-premises network is configured, you might need to set up the proxy on your VM. If your VM is connected to your on-premises network via VPN or ExpressRoute, the VM might not be able to access the Internet, and won't be able to download the required VM extensions or collect Azure infrastructure information for the SAP Host agent via the SAP extension for Azure. For more information, see [Configure the proxy][deployment-guide-configure-proxy].

#### Join a domain (Windows only)

If your Azure deployment is connected to an on-premises Active Directory or DNS instance via an Azure site-to-site VPN connection or ExpressRoute (this is called *cross-premises* in [Azure Virtual Machines planning and implementation for SAP NetWeaver][planning-guide]), it is expected that the VM is joining an on-premises domain. For more information about considerations for this task, see [Join a VM to an on-premises domain (Windows only)][deployment-guide-4.3].

#### <a name="ec323ac3-1de9-4c3a-b770-4ff701def65b"></a>Configure VM Extension

To be sure SAP supports your environment, set up the Azure Extension for SAP as described in [Configure the Azure Extension for SAP][deployment-guide-4.5]. Check the prerequisites for SAP, and required minimum versions of SAP Kernel and SAP Host Agent, in the resources listed in [SAP resources][deployment-guide-2.2].

#### VM extension for SAP check

Check whether the VM Extension for SAP is working, as described in [Checks and Troubleshooting][deployment-guide-troubleshooting-chapter].

#### Post-deployment steps

After you create the VM and the VM is deployed, you need to install the required software components in the VM. Because of the deployment/software installation sequence in this type of VM deployment, the software to be installed must already be available, either in Azure, on another VM, or as a disk that can be attached. Or, consider using a cross-premises scenario, in which connectivity to the on-premises assets (installation shares) is given.

After you deploy your VM in Azure, follow the same guidelines and tools to install the SAP software on your VM as you would in an on-premises environment. To install SAP software on an Azure VM, both SAP and Microsoft recommend that you upload and store the SAP installation media on Azure VHDs or Managed Disks, or that you create an Azure VM that works as a file server that has all the required SAP installation media.

### <a name="54a1fc6d-24fd-4feb-9c57-ac588a55dff2"></a>Scenario 2: Deploying a VM with a custom image for SAP

Because different versions of an operating system or DBMS have different patch requirements, the images you find in the Azure Marketplace might not meet your needs. You might instead want to create a VM by using your own OS/DBMS VM image, which you can deploy again later.
You use different steps to create a private image for Linux than to create one for Windows.

---
> ![Windows][Logo_Windows] Windows
>
> To prepare a Windows image that you can use to deploy multiple virtual machines, the Windows settings (like Windows SID and hostname) must be abstracted or generalized on the on-premises VM. You can use [sysprep](https://msdn.microsoft.com/library/hh825084.aspx) to do this.
>
> ![Linux][Logo_Linux] Linux
>
> To prepare a Linux image that you can use to deploy multiple virtual machines, some Linux settings must be abstracted or generalized on the on-premises VM. You can use `waagent -deprovision`  to do this. For more information, see [Capture a Linux virtual machine running on Azure][virtual-machines-linux-capture-image] and the [Azure Linux agent user guide][virtual-machines-linux-agent-user-guide-command-line-options].
>
>

---
You can prepare and create a custom image, and then use it to create multiple new VMs. This is described in [Azure Virtual Machines planning and implementation for SAP NetWeaver][planning-guide]. Set up your database content either by using SAP Software Provisioning Manager to install a new SAP system (restores a database backup from a disk that's attached to the virtual machine) or by directly restoring a database backup from Azure storage, if your DBMS supports it. For more information, see [Azure Virtual Machines DBMS deployment for SAP NetWeaver][dbms-guide]. If you have already installed an SAP system on your on-premises VM (especially for two-tier systems), you can adapt the SAP system settings after the deployment of the Azure VM by using the System Rename procedure supported by SAP Software Provisioning Manager (SAP Note [1619720]). Otherwise, you can install the SAP software after you deploy the Azure VM.

The following flowchart shows the SAP-specific sequence of steps for deploying a VM from a custom image:

![Flowchart of VM deployment for SAP systems by using a VM image in private Marketplace][deployment-guide-figure-300]

#### Create a virtual machine by using the Azure portal

The easiest way to create a new virtual machine from a Managed Disk image is by using the Azure portal. For more information on how to create a Manage Disk Image, read [Capture a managed image of a generalized VM in Azure](https://docs.microsoft.com/azure/virtual-machines/windows/capture-image-resource)

1.  Go to <https://ms.portal.azure.com/#blade/HubsExtension/Resources/resourceType/Microsoft.Compute%2Fimages>. Or, in the Azure portal menu, select **Images**.
1.  Select the Managed Disk image you want to deploy and click on **Create VM**

The wizard guides you through setting the required parameters to create the virtual machine, in addition to all required resources, like network interfaces and storage accounts. Some of these parameters are:

1. **Basics**:
   * **Name**: The name of the resource (the virtual machine name).
   * **VM disk type**: Select the disk type of the OS disk. If you want to use Premium Storage for your data disks, we recommend using Premium Storage for the OS disk as well.
   * **Username and password** or **SSH public key**: Enter the username and password of the user that is created during the provisioning. For a Linux virtual machine, you can enter the public Secure Shell (SSH) key that you use to sign in to the machine.
   * **Subscription**: Select the subscription that you want to use to provision the new virtual machine.
   * **Resource group**: The name of the resource group for the VM. You can enter either the name of a new resource group or the name of a resource group that already exists.
   * **Location**: Where to deploy the new virtual machine. If you want to connect the virtual machine to your on-premises network, make sure you select the location of the virtual network that connects Azure to your on-premises network. For more information, see [Microsoft Azure networking][planning-guide-microsoft-azure-networking] in [Azure Virtual Machines planning and implementation for SAP NetWeaver][planning-guide].
1. **Size**:

	 For a list of supported VM types, see SAP Note [1928533]. Be sure you select the correct VM type if you want to use Azure Premium Storage. Not all VM types support Premium Storage. For more information, see [Storage: Microsoft Azure Storage and data disks][planning-guide-storage-microsoft-azure-storage-and-data-disks] and [Azure Premium Storage][planning-guide-azure-premium-storage] in [Azure Virtual Machines planning and implementation for SAP NetWeaver][planning-guide].

1. **Settings**:
   * **Storage**
     * **Disk Type**: Select the disk type of the OS disk. If you want to use Premium Storage for your data disks, we recommend using Premium Storage for the OS disk as well.
     * **Use managed disks**: If you want to use Managed Disks, select Yes. For more information about Managed Disks, see chapter [Managed Disks][planning-guide-managed-disks] in the planning guide.
   * **Network**
     * **Virtual network** and **Subnet**: To integrate the virtual machine with your intranet, select the virtual network that is connected to your on-premises network.
     * **Public IP address**: Select the public IP address that you want to use, or enter parameters to create a new public IP address. You can use a public IP address to access your virtual machine over the Internet. Make sure that you also create a network security group to help secure access to your virtual machine.
     * **Network security group**: For more information, see [Control network traffic flow with network security groups][virtual-networks-nsg].
   * **Extensions**: You can install virtual machine extensions by adding them to the deployment. You do not need to add extension in this step. The extensions required for SAP support are installed later. See chapter [Configure the Azure Extension for SAP][deployment-guide-4.5] in this guide.
   * **High Availability**: Select an availability set, or enter the parameters to create a new availability set. For more information, see [Azure availability sets][planning-guide-3.2.3].
   * **Monitoring**
     * **Boot diagnostics**: You can select **Disable** for boot diagnostics.
     * **Guest OS diagnostics**: You can select **Disable** for monitoring diagnostics.

1. **Summary**:

   Review your selections, and then select **OK**.

Your virtual machine is deployed in the resource group you selected.

#### Create a virtual machine by using a template

To create a deployment by using a private OS image from the Azure portal, use one of the following SAP templates. These templates are published in the [azure-quickstart-templates GitHub repository][azure-quickstart-templates-github]. You also can manually create a virtual machine, by using [PowerShell][virtual-machines-upload-image-windows-resource-manager].

* [**Two-tier configuration (only one virtual machine) template** (sap-2-tier-user-image)][sap-templates-2-tier-user-image]

  To create a two-tier system by using only one virtual machine, use this template.
* [**Two-tier configuration (only one virtual machine) template - Managed Disk Image** (sap-2-tier-user-image-md)][sap-templates-2-tier-user-image-md]

  To create a two-tier system by using only one virtual machine and a Managed Disk image, use this template.
* [**Three-tier configuration (multiple virtual machines) template** (sap-3-tier-user-image)][sap-templates-3-tier-user-image]

  To create a three-tier system by using multiple virtual machines or your own OS image, use this template.
* [**Three-tier configuration (multiple virtual machines) template - Managed Disk Image** (sap-3-tier-user-image-md)][sap-templates-3-tier-user-image-md]

  To create a three-tier system by using multiple virtual machines or your own OS image and a Managed Disk image, use this template.

In the Azure portal, enter the following parameters for the template:

1. **Basics**:
   * **Subscription**: The subscription to use to deploy the template.
   * **Resource group**: The resource group to use to deploy the template. You can create a new resource group or select an existing resource group in the subscription.
   * **Location**: Where to deploy the template. If you selected an existing resource group, the location of that resource group is used.
1. **Settings**:
   * **SAP System ID**: The SAP System ID.
   * **OS type**: The operating system type you want to deploy (Windows or Linux).
   * **SAP system size**: The size of the SAP system.

     The number of SAPS the new system provides. If you are not sure how many SAPS the system requires, ask your SAP Technology Partner or System Integrator.
   * **System availability** (three-tier template only): The system availability.

     Select **HA** for a configuration that is suitable for a high-availability installation. Two database servers and two servers for ASCS are created.
   * **Storage type** (two-tier template only): The type of storage to use.

     For larger systems, we highly recommend using Azure Premium Storage. For more information about storage types, see the following resources:
      * [Use of Azure Premium SSD Storage for SAP DBMS Instance][2367194]
      * [Storage structure of a VM for RDBMS Deployments](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/dbms_guide_general#65fa79d6-a85f-47ee-890b-22e794f51a64)
      * [Premium Storage: High-performance storage for Azure virtual machine workloads][storage-premium-storage-preview-portal]
      * [Introduction to Microsoft Azure Storage][storage-introduction]
   * **User image VHD URI** (unmanaged disk image template only): The URI of the private OS image VHD, for example, https://&lt;accountname>.blob.core.windows.net/vhds/userimage.vhd.
   * **User image storage account** (unmanaged disk image template only): The name of the storage account where the private OS image is stored, for example, &lt;accountname> in https://&lt;accountname>.blob.core.windows.net/vhds/userimage.vhd.
   * **userImageId** (managed disk image template only): ID of the Managed Disk image you want to use
   * **Admin username** and **Admin password**: The username and password.

     A new user is created, for signing in to the virtual machine.
   * **New or existing subnet**: Determines whether a new virtual network and subnet is created or an existing subnet is used. If you already have a virtual network that is connected to your on-premises network, select **Existing**.
   * **Subnet ID**: If you want to deploy the VM into an existing VNet where you have a subnet defined the VM should be assigned to, name the ID of that specific subnet. The ID usually looks like this:
     /subscriptions/&lt;subscription id>/resourceGroups/&lt;resource group name>/providers/Microsoft.Network/virtualNetworks/&lt;virtual network name>/subnets/&lt;subnet name>

1. **Terms and conditions**:  
    Review and accept the legal terms.

1. Select **Purchase**.

#### Install the VM Agent (Linux only)

To use the templates described in the preceding section, the Linux Agent must already be installed in the user image, or the deployment will fail. Download and install the VM Agent in the user image as described in [Download, install, and enable the Azure VM Agent][deployment-guide-4.4]. If you don't use the templates, you also can install the VM Agent later.

#### Join a domain (Windows only)

If your Azure deployment is connected to an on-premises Active Directory or DNS instance via an Azure site-to-site VPN connection or Azure ExpressRoute (this is called *cross-premises* in [Azure Virtual Machines planning and implementation for SAP NetWeaver][planning-guide]), it is expected that the VM is joining an on-premises domain. For more information about considerations for this step, see [Join a VM to an on-premises domain (Windows only)][deployment-guide-4.3].

#### Configure proxy settings

Depending on how your on-premises network is configured, you might need to set up the proxy on your VM. If your VM is connected to your on-premises network via VPN or ExpressRoute, the VM might not be able to access the Internet, and won't be able to download the required VM extensions or collect Azure infrastructure information for the SAP Host agent via the SAP extension for Azure, see [Configure the proxy][deployment-guide-configure-proxy].

#### Configure Azure VM Extension for SAP

To be sure SAP supports your environment, set up the Azure Extension for SAP as described in [Configure the Azure Extension for SAP][deployment-guide-4.5]. Check the prerequisites for SAP, and required minimum versions of SAP Kernel and SAP Host Agent, in the resources listed in [SAP resources][deployment-guide-2.2].

#### SAP VM Extension check

Check whether the VM Extension for SAP is working, as described in [Checks and Troubleshooting][deployment-guide-troubleshooting-chapter].


### <a name="a9a60133-a763-4de8-8986-ac0fa33aa8c1"></a>Scenario 3: Moving an on-premises VM by using a non-generalized Azure VHD with SAP

In this scenario, you plan to move a specific SAP system from an on-premises environment to Azure. You can do this by uploading the VHD that has the OS, the SAP binaries, and eventually the DBMS binaries, plus the VHDs with the data and log files of the DBMS, to Azure. Unlike the scenario described in [Scenario 2: Deploying a VM with a custom image for SAP][deployment-guide-3.3], in this case, you keep the hostname, SAP SID, and SAP user accounts in the Azure VM, because they were configured in the on-premises environment. You do not need to generalize the OS. This scenario applies most often to cross-premises scenarios where part of the SAP landscape runs on-premises and part of it runs on Azure.

In this scenario, the VM Agent is **not** automatically installed during deployment. Because the VM Agent and the Azure Extension for SAP are required to run SAP NetWeaver on Azure, you need to download, install, and enable both components manually after you create the virtual machine.

For more information about the Azure VM Agent, see the following resources.

---
> ![Windows][Logo_Windows] Windows
>
> [Azure Virtual Machine Agent overview][virtual-machines-windows-agent-user-guide]
>
> ![Linux][Logo_Linux] Linux
>
> [Azure Linux Agent User Guide][virtual-machines-linux-agent-user-guide]
>
>

---

The following flowchart shows the sequence of steps for moving an on-premises VM by using a non-generalized Azure VHD:

![Flowchart of VM deployment for SAP systems by using a VM disk][deployment-guide-figure-400]

If the disk is already uploaded and defined in Azure (see [Azure Virtual Machines planning and implementation for SAP NetWeaver][planning-guide]), do the tasks described in the next few sections.

#### Create a virtual machine

To create a deployment by using a private OS disk through the Azure portal, use the SAP template published in the [azure-quickstart-templates GitHub repository][azure-quickstart-templates-github]. You also can manually create a virtual machine, by using PowerShell.

* [**Two-tier configuration (only one virtual machine) template** (sap-2-tier-user-disk)][sap-templates-2-tier-os-disk]

  To create a two-tier system by using only one virtual machine, use this template.
* [**Two-tier configuration (only one virtual machine) template - Managed Disk** (sap-2-tier-user-disk-md)][sap-templates-2-tier-os-disk-md]

  To create a two-tier system by using only one virtual machine and a Managed Disk, use this template.

In the Azure portal, enter the following parameters for the template:

1. **Basics**:
   * **Subscription**: The subscription to use to deploy the template.
   * **Resource group**: The resource group to use to deploy the template. You can create a new resource group or select an existing resource group in the subscription.
   * **Location**: Where to deploy the template. If you selected an existing resource group, the location of that resource group is used.
1. **Settings**:
   * **SAP System ID**: The SAP System ID.
   * **OS type**: The operating system type you want to deploy (Windows or Linux).
   * **SAP system size**: The size of the SAP system.

     The number of SAPS the new system provides. If you are not sure how many SAPS the system requires, ask your SAP Technology Partner or System Integrator.
   * **Storage type** (two-tier template only): The type of storage to use.

     For larger systems, we highly recommend using Azure Premium Storage. For more information about storage types, see the following resources:
      * [Use of Azure Premium SSD Storage for SAP DBMS Instance][2367194]
      * [Storage structure of a VM for RDBMS Deployments](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/dbms_guide_general#65fa79d6-a85f-47ee-890b-22e794f51a64)
      * [Premium Storage: High-performance storage for Azure Virtual Machine workloads][storage-premium-storage-preview-portal]
      * [Introduction to Microsoft Azure Storage][storage-introduction]
   * **OS disk VHD URI** (unmanaged disk template only): The URI of the private OS disk, for example, https://&lt;accountname>.blob.core.windows.net/vhds/osdisk.vhd.
   * **OS disk Managed Disk ID** (managed disk template only): The ID of the Managed Disk OS disk, /subscriptions/92d102f7-81a5-4df7-9877-54987ba97dd9/resourceGroups/group/providers/Microsoft.Compute/disks/WIN
   * **New or existing subnet**: Determines whether a new virtual network and subnet are created, or an existing subnet is used. If you already have a virtual network that is connected to your on-premises network, select **Existing**.
   * **Subnet ID**: If you want to deploy the VM into an existing VNet where you have a subnet defined the VM should be assigned to, name the ID of that specific subnet. The ID usually looks like this:
     /subscriptions/&lt;subscription id>/resourceGroups/&lt;resource group name>/providers/Microsoft.Network/virtualNetworks/&lt;virtual network name>/subnets/&lt;subnet name>

1. **Terms and conditions**:  
    Review and accept the legal terms.

1. Select **Purchase**.

#### Install the VM Agent

To use the templates described in the preceding section, the VM Agent must be installed on the OS disk, or the deployment will fail. Download and install the VM Agent in the VM, as described in [Download, install, and enable the Azure VM Agent][deployment-guide-4.4].

If you don't use the templates described in the preceding section, you can also install the VM Agent afterwards.

#### Join a domain (Windows only)

If your Azure deployment is connected to an on-premises Active Directory or DNS instance via an Azure site-to-site VPN connection or ExpressRoute (this is called *cross-premises* in [Azure Virtual Machines planning and implementation for SAP NetWeaver][planning-guide]), it is expected that the VM is joining an on-premises domain. For more information about considerations for this task, see [Join a VM to an on-premises domain (Windows only)][deployment-guide-4.3].

#### Configure proxy settings

Depending on how your on-premises network is configured, you might need to set up the proxy on your VM. If your VM is connected to your on-premises network via VPN or ExpressRoute, the VM might not be able to access the Internet, and won't be able to download the required VM extensions or collect Azure infrastructure information for the SAP Host agent via the SAP extension for Azure, see [Configure the proxy][deployment-guide-configure-proxy].

#### Configure Azure VM Extension for SAP

To be sure SAP supports your environment, set up the Azure Extension for SAP as described in [Configure the Azure Extension for SAP][deployment-guide-4.5]. Check the prerequisites for SAP, and required minimum versions of SAP Kernel and SAP Host Agent, in the resources listed in [SAP resources][deployment-guide-2.2].

#### SAP VM check

Check whether the VM extension for SAP is working, as described in [Checks and Troubleshooting][deployment-guide-troubleshooting-chapter].

## Update the configuration of Azure Extension for SAP

Update the configuration of Azure Extension for SAP in any of the following scenarios:
* The joint Microsoft/SAP team extends the capabilities of the VM extension and requests more or fewer counters.
* Microsoft introduces a new version of the underlying Azure infrastructure that delivers the  data, and the Azure Extension for SAP needs to be adapted to those changes.
* You mount additional data disks to your Azure VM or you remove a data disk. In this scenario, update the collection of storage-related data. Changing your configuration by adding or deleting endpoints or by assigning IP addresses to a VM does not affect the extension configuration.
* You change the size of your Azure VM, for example, from size A5 to any other VM size.
* You add new network interfaces to your Azure VM.

To update settings, update configuration of Azure Extension for SAP by following the steps in [Configure the Azure Extension for SAP][deployment-guide-4.5].

## Detailed tasks for SAP software deployment

This section has detailed steps for doing specific tasks in the configuration and deployment process.

### <a name="604bcec2-8b6e-48d2-a944-61b0f5dee2f7"></a>Deploy Azure PowerShell cmdlets

Follow the steps described in the article [Install the Azure PowerShell module](https://docs.microsoft.com/powershell/azure/install-az-ps)

Check frequently for updates to the PowerShell cmdlets, which usually are updated monthly. Follow the steps described in [this](https://docs.microsoft.com/powershell/azure/install-az-ps#update-the-azure-powershell-module) article. Unless stated otherwise in SAP Note [1928533] or SAP Note [2015553], we recommend that you work with the latest version of Azure PowerShell cmdlets.

To check the version of the Azure PowerShell cmdlets that are installed on your computer, run this PowerShell command:

```powershell
(Get-Module Az.Compute).Version
```

### <a name="1ded9453-1330-442a-86ea-e0fd8ae8cab3"></a>Deploy Azure CLI

Follow the steps described in the article [Install the Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli)

Check frequently for updates to Azure CLI, which usually is updated monthly.

To check the version of Azure CLI that is installed on your computer, run this command:

```console
az --version
```

### <a name="31d9ecd6-b136-4c73-b61e-da4a29bbc9cc"></a>Join a VM to an on-premises domain (Windows only)

If you deploy SAP VMs in a cross-premises scenario, where on-premises Active Directory and DNS are extended in Azure, it is expected that the VMs are joining an on-premises domain. The detailed steps you take to join a VM to an on-premises domain, and the additional software required to be a member of an on-premises domain, varies by customer. Usually, to join a VM to an on-premises domain, you need to install additional software, like antimalware software, and backup or monitoring software.

In this scenario, you also need to make sure that if Internet proxy settings are forced when a VM joins a domain in your environment, the Windows Local System Account (S-1-5-18) in the Guest VM has the same proxy settings. The easiest option is to force the proxy by using a domain Group Policy, which applies to systems in the domain.

### <a name="c7cbb0dc-52a4-49db-8e03-83e7edc2927d"></a>Download, install, and enable the Azure VM Agent

For virtual machines that are deployed from an OS image that is not generalized (for example, an image that doesn't originate in the Windows System Preparation, or sysprep, tool), you need to manually download, install, and enable the Azure VM Agent.

If you deploy a VM from the Azure Marketplace, this step is not required. Images from the Azure Marketplace already have the Azure VM Agent.

#### <a name="b2db5c9a-a076-42c6-9835-16945868e866"></a>Windows

1. Download the Azure VM Agent:
   1.  Download the [Azure VM Agent installer package](https://go.microsoft.com/fwlink/?LinkId=394789).
   1.  Store the VM Agent MSI package locally on a personal computer or server.
1. Install the Azure VM Agent:
   1.  Connect to the deployed Azure VM by using Remote Desktop Protocol (RDP).
   1.  Open a Windows Explorer window on the VM and select the target directory for the MSI file of the VM Agent.
   1.  Drag the Azure VM Agent Installer MSI file from your local computer/server to the target directory of the VM Agent on the VM.
   1.  Double-click the MSI file on the VM.
1. For VMs that are joined to on-premises domains, make sure that eventual Internet proxy settings also apply to the Windows Local System account (S-1-5-18) in the VM, as described in [Configure the proxy][deployment-guide-configure-proxy]. The VM Agent runs in this context and needs to be able to connect to Azure.

No user interaction is required to update the Azure VM Agent. The VM Agent is automatically updated, and does not require a VM restart.

#### <a name="6889ff12-eaaf-4f3c-97e1-7c9edc7f7542"></a>Linux

Use the following commands to install the VM Agent for Linux:

* **SUSE Linux Enterprise Server (SLES)**

  ```console
  sudo zypper install WALinuxAgent
  ```

* **Red Hat Enterprise Linux (RHEL) or Oracle Linux**

  ```console
  sudo yum install WALinuxAgent
  ```

If the agent is already installed, to update the Azure Linux Agent, do the steps described in [Update the Azure Linux Agent on a VM to the latest version from GitHub][virtual-machines-linux-update-agent].

### <a name="baccae00-6f79-4307-ade4-40292ce4e02d"></a>Configure the proxy

The steps you take to configure the proxy in Windows are different from the way you configure the proxy in Linux.

#### Windows

Proxy settings must be set up correctly for the Local System account to access the Internet. If your proxy settings are not set by Group Policy, you can configure the settings for the Local System account.

1. Go to **Start**, enter **gpedit.msc**, and then select **Enter**.
1. Select **Computer Configuration** > **Administrative Templates** > **Windows Components** > **Internet Explorer**. Make sure that the setting **Make proxy settings per-machine (rather than per-user)** is disabled or not configured.
1. In **Control Panel**, go to **Network and Sharing Center** > **Internet Options**.
1. On the **Connections** tab, select the **LAN settings** button.
1. Clear the **Automatically detect settings** check box.
1. Select the **Use a proxy server for your LAN** check box, and then enter the proxy address and port.
1. Select the **Advanced** button.
1. In the **Exceptions** box, enter the IP address **168.63.129.16**. Select **OK**.

#### Linux

Configure the correct proxy in the configuration file of the Microsoft Azure Guest Agent, which is located at \\etc\\waagent.conf.

Set the following parameters:

1. **HTTP proxy host**. For example, set it to **proxy.corp.local**.

   ```console
   HttpProxy.Host=<proxy host>

   ```

1. **HTTP proxy port**. For example, set it to **80**.

   ```console
   HttpProxy.Port=<port of the proxy host>

   ```

1. Restart the agent.

   ```console
   sudo service waagent restart
   ```

The proxy settings in \\etc\\waagent.conf also apply to the required VM extensions. If you want to use the Azure repositories, make sure that the traffic to these repositories is not going through your on-premises intranet. If you created user-defined routes to enable forced tunneling, make sure that you add a route that routes traffic to the repositories directly to the Internet, and not through your site-to-site VPN connection.

* **SLES**

  You also need to add routes for the IP addresses listed in \\etc\\regionserverclnt.cfg. The following figure shows an example:

  ![Forced tunneling][deployment-guide-figure-50]


* **RHEL**

  You also need to add routes for the IP addresses of the hosts listed in \\etc\\yum.repos.d\\rhui-load-balancers. For an example, see the preceding figure.

* **Oracle Linux**

  There are no repositories for Oracle Linux on Azure. You need to configure your own repositories for Oracle Linux or use the public repositories.

For more information about user-defined routes, see [User-defined routes and IP forwarding][virtual-networks-udr-overview].

### <a name="d98edcd3-f2a1-49f7-b26a-07448ceb60ca"></a>Configure the Azure Extension for SAP

> [!NOTE]
> General Support Statement: Please always open an incident with SAP on component BC-OP-NT-AZR for Windows or BC-OP-LNX-AZR if you need support for the Azure Extension for SAP.
> There are dedicated Microsoft support engineers working in the SAP support system to help our joint customers.

When you've prepared the VM as described in [Deployment scenarios of VMs for SAP on Azure][deployment-guide-3], the Azure VM Agent is installed on the virtual machine. The next step is to deploy the Azure Extension for SAP, which is available in the Azure Extension Repository in the global Azure datacenters. For more information, see [Azure Virtual Machines planning and implementation for SAP NetWeaver][planning-guide-9.1].

We are in the process of releasing a new version of the Azure Extension for SAP. The new extension uses the system assigned identity of the virtual machine to get information about the attached disks, network interfaces and the virtual machine itself. To be able to access these resources, the system identity of the virtual machine needs Reader permission for the virtual machine, OS disk, data disks and network interfaces. We currently recommend to only install the new extension in the following scenarios:

1. You want to install the extension with Terraform, Azure Resource Manager Templates or with other means than Azure CLI or Azure PowerShell
1. You want to install the extension on SUSE SLES 15 or higher.
1. Microsoft or SAP support asks you to install the new extension
1. You want to use Azure Ultra Disk or Standard Managed Disks

For these scenarios, follow the steps in chapter [Configure the new Azure Extension for SAP with Azure PowerShell][deployment-guide-configure-new-extension-ps] for Azure PowerShell or [Configure the new Azure Extension for SAP with Azure CLI][deployment-guide-configure-new-extension-cli] for Azure CLI.

Follow [Azure PowerShell][deployment-guide-4.5.1] or [Azure CLI][deployment-guide-4.5.2] to install and configure the standard version of the Azure Extension for SAP.

#### <a name="987cf279-d713-4b4c-8143-6b11589bb9d4"></a>Azure PowerShell for Linux and Windows VMs

To install the Azure Extension for SAP by using PowerShell:

1. Make sure that you have installed the latest version of the Azure PowerShell cmdlet. For more information, see [Deploying Azure PowerShell cmdlets][deployment-guide-4.1].  
1. Run the following PowerShell cmdlet.
    For a list of available environments, run `commandlet Get-AzEnvironment`. If you want to use global Azure, your environment is **AzureCloud**. For Azure China 21Vianet, select **AzureChinaCloud**.

    ```powershell
    $env = Get-AzEnvironment -Name <name of the environment>
    Connect-AzAccount -Environment $env
    Set-AzContext -SubscriptionName <subscription name>

    Set-AzVMAEMExtension -ResourceGroupName <resource group name> -VMName <virtual machine name>
    ```

After you enter your account data, the script deploys the required extensions and enables the required features. This can take several minutes.
For more information about `Set-AzVMAEMExtension`, see [Set-AzVMAEMExtension][msdn-set-Azvmaemextension].

![Successful execution of SAP-specific Azure cmdlet Set-AzVMAEMExtension][deployment-guide-figure-900]

The `Set-AzVMAEMExtension` configuration does all the steps to configure host data collection for SAP.

The script output includes the following information:

* Confirmation that data collection for the OS disk and all additional data disks has been configured.
* The next two messages confirm the configuration of Storage Metrics for a specific storage account.
* One line of output gives the status of the actual update of the VM Extension for SAP configuration.
* Another line of output confirms that the configuration has been deployed or updated.
* The last line of output is informational. It shows your options for testing the VM Extension for SAP configuration.
* To check that all steps of Azure VM Extension for SAP configuration have been executed successfully, and that the Azure Infrastructure provides the necessary data, proceed with the readiness check for the Azure Extension for SAP, as described in [Readiness check for Azure Extension for SAP][deployment-guide-5.1].
* Wait 15-30 minutes for Azure Diagnostics to collect the relevant data.

#### <a name="408f3779-f422-4413-82f8-c57a23b4fc2f"></a>Azure CLI for Linux VMs

To install the Azure Extension for SAP by using Azure CLI:

   1. Install Azure classic CLI, as described in [Install the Azure classic CLI][azure-cli].
   1. Sign in with your Azure account:

      ```console
      azure login
      ```

   1. Switch to Azure Resource Manager mode:

      ```console
      azure config mode arm
      ```

   1. Enable Azure Extension for SAP:

      ```console
      azure vm enable-aem <resource-group-name> <vm-name>
      ```

1. Install using Azure CLI 2.0

   1. Install Azure CLI 2.0, as described in [Install Azure CLI 2.0][azure-cli-2].
   1. Sign in with your Azure account:

      ```azurecli
      az login
      ```

   1. Install Azure CLI AEM Extension
  
      ```azurecli
      az extension add --name aem
      ```
  
   1. Install the extension with
  
      ```azurecli
      az vm aem set -g <resource-group-name> -n <vm name>
      ```

1. Verify that the Azure Extension for SAP is active on the Azure Linux VM. Check whether the file \\var\\lib\\AzureEnhancedMonitor\\PerfCounters exists. If it exists, at a command prompt, run this command to display information collected by the Azure Extension for SAP:

   ```console
   cat /var/lib/AzureEnhancedMonitor/PerfCounters
   ```

   The output looks like this:

   ```output
   ...
   2;cpu;Current Hw Frequency;;0;2194.659;MHz;60;1444036656;saplnxmon;
   2;cpu;Max Hw Frequency;;0;2194.659;MHz;0;1444036656;saplnxmon;
   ...
   ```

#### <a name="2ad55a0d-9937-4943-9dd2-69bc2b5d3de0"></a>Configure the new Azure Extension for SAP with Azure PowerShell

The new VM Extension for SAP uses a Managed Identity assigned to the VM to access monitoring and configuration data of the VM. To install the new Azure Extension for SAP by using PowerShell, you first have to assign such an identity to the VM and grant that identity access to all resources that are in use by that VM, for example disks and network interfaces.

The process will be automated in the next version of Azure PowerShell (> 4.2.0). We will update this article once the new version is available. Until then, please follow these steps to install the extension manually.

1. Make sure to use SAP Host Agent 7.21 PL 47 or higher.
1. Make sure that you have installed the latest version of the Azure PowerShell cmdlet. For more information, see [Deploying Azure PowerShell cmdlets][deployment-guide-4.1].
1. Follow the steps in the [Configure managed identities for Azure resources on an Azure VM using PowerShell][qs-configure-powershell-windows-vm] article to enable a System-Assigned Managed Identity to the VM. User-Assigned Managed Identities are not supported by the VM extension for SAP. However, you can enable both, a system-assigned and a user-assigned identity.
    
    Example:
    ```powershell
    $vm = Get-AzVM -ResourceGroupName <resource-group-name> -Name <vm name>
    Update-AzVM -ResourceGroupName $vm.ResourceGroupName -VM $vm -IdentityType SystemAssigned
    ```

1. Assign the Managed Identity access to the resource group of the VM or to all network interfaces, managed disks and the VM itself as described in [Assign a managed identity access to a resource using PowerShell][howto-assign-access-powershell]
    Example:

    ```powershell
    $spID = (Get-AzVM -ResourceGroupName <resource-group-name> -Name <vm name>).identity.principalid
    $rg = Get-AzResourceGroup -Name $vm.ResourceGroupName
    New-AzRoleAssignment -ObjectId $spID -RoleDefinitionName "Reader" -Scope $rg.ResourceId
    ```

1. Run the following PowerShell cmdlet to install the Azure Extension for SAP.
    The extension is currently only supported in AzureCloud. Azure China 21Vianet, Azure Government or any of the other special environments are not yet supported.

    ```powershell
    $env = Get-AzEnvironment -Name AzureCloud
    Connect-AzAccount -Environment $env
    Set-AzContext -SubscriptionName <subscription name>

    $vm = Get-AzVM -ResourceGroupName <resource-group-name> -Name <vm name>
    if ($vm.StorageProfile.OsDisk.OsType -eq "Windows") {
      Set-AzVMExtension -Publisher Microsoft.AzureCAT.AzureEnhancedMonitoring -ExtensionType MonitorX64Windows -Name MonitorX64Windows -TypeHandlerVersion "1.0" -ResourceGroupName $vm.ResourceGroupName -VMName $vm.Name -Settings @{"system" = "SAP"} -Location $vm.Location
    } else {
      Set-AzVMExtension -Publisher Microsoft.AzureCAT.AzureEnhancedMonitoring -ExtensionType MonitorX64Linux -Name MonitorX64Linux -TypeHandlerVersion "1.0" -ResourceGroupName $vm.ResourceGroupName -VMName $vm.Name -Settings @{"system" = "SAP"} -Location $vm.Location
    }
    ```

#### <a name="c8749c24-fada-42ad-b114-f9aae2dc37da"></a>Configure the new Azure Extension for SAP with Azure CLI

The new VM Extension for SAP uses a Managed Identity assigned to the VM to access monitoring and configuration data of the VM. To install the new Azure Extension for SAP by using Azure CLI, you first have to assign such an identity to the VM and grant that identity access to all resources that are in use by that VM, for example disks and network interfaces.

1. Make sure to use SAP Host Agent 7.21 PL 47 or higher.
1. Install Azure CLI 2.0, as described in [Install Azure CLI 2.0][azure-cli-2].

1. Sign in with your Azure account:

   ```azurecli
   az login
   ```

1. Follow the steps in the [Configure managed identities for Azure resources on an Azure VM using Azure CLI][qs-configure-cli-windows-vm] article to enable a System-Assigned Managed Identity to the VM. User-Assigned Managed Identities are not supported by the VM extension for SAP. However, you can enable both, a system-assigned and a user-assigned identity.

   Example:
   ```azurecli
   az vm identity assign -g <resource-group-name> -n <vm name>
   ```

1. Assign the Managed Identity access to the resource group of the VM or to all network interfaces, managed disks and the VM itself as described in [Assign a managed identity access to a resource using Azure CLI][howto-assign-access-cli]

    Example:

    ```azurecli
    spID=$(az resource show -g <resource-group-name> -n <vm name> --query identity.principalId --out tsv --resource-type Microsoft.Compute/virtualMachines)
    rgId=$(az group show -g <resource-group-name> --query id --out tsv)
    az role assignment create --assignee $spID --role 'Reader' --scope $rgId
    ```

1. Run the following Azure CLI command to install the Azure Extension for SAP.
    The extension is currently only supported in AzureCloud. Azure China 21Vianet, Azure Government or any of the other special environments are not yet supported.

    ```azurecli
    # For Linux machines
    az vm extension set --publisher Microsoft.AzureCAT.AzureEnhancedMonitoring --name MonitorX64Linux --version 1.0 -g <resource-group-name> --vm-name <vm name> --settings '{"system":"SAP"}'

    #For Windows machines
    az vm extension set --publisher Microsoft.AzureCAT.AzureEnhancedMonitoring --name MonitorX64Windows --version 1.0 -g <resource-group-name> --vm-name <vm name> --settings '{"system":"SAP"}'
    ```

## <a name="564adb4f-5c95-4041-9616-6635e83a810b"></a>Checks and Troubleshooting

After you have deployed your Azure VM and set up the relevant Azure Extension for SAP, check whether all the components of the extension are working as expected.

Run the readiness check for the Azure Extension for SAP as described in [Readiness check for the Azure Extension for SAP][deployment-guide-5.1]. If all readiness check results are positive and all relevant performance counters appear OK, Azure Extension for SAP has been set up successfully. You can proceed with the installation of SAP Host Agent as described in the SAP Notes in [SAP resources][deployment-guide-2.2]. If the readiness check indicates that counters are missing, run the health check for the Azure Extension for SAP, as described in [Health check for Azure Extension for SAP configuration][deployment-guide-5.2]. For more troubleshooting options, see [Troubleshooting Azure Extension for SAP][deployment-guide-5.3].

### <a name="bb61ce92-8c5c-461f-8c53-39f5e5ed91f2"></a>Readiness check for the Azure Extension for SAP

This check makes sure that all performance metrics that appear inside your SAP application are provided by the underlying Azure Extension for SAP. If you deployed the new Azure Extension for SAP, follow chapter [Readiness check for the new Azure Extension for SAP][deployment-guide-5.1-new] in this guide.

#### Run the readiness check on a Windows VM

1. Sign in to the Azure virtual machine (using an admin account is not necessary).
1. Open a Command Prompt window.
1. At the command prompt, change the directory to the installation folder of the Azure Extension for SAP:
   C:\\Packages\\Plugins\\Microsoft.AzureCAT.AzureEnhancedMonitoring.AzureCATExtensionHandler\\&lt;version>\\drop

   The *version* in the path to the extension might vary. If you see folders for multiple versions of the extension in the installation folder, check the configuration of the AzureEnhancedMonitoring Windows service, and then switch to the folder indicated as *Path to executable*.

   ![Properties of service running the Azure Extension for SAP][deployment-guide-figure-1000]

1. At the command prompt, run **azperflib.exe** without any parameters.

   > [!NOTE]
   > Azperflib.exe runs in a loop and updates the collected counters every 60 seconds. To end the loop, close the Command Prompt window.
   >
   >

If the Azure Extension for SAP is not installed, or the AzureEnhancedMonitoring service is not running, the extension has not been configured correctly. For detailed information about how to deploy the extension, see [Troubleshooting the Azure Extension for SAP][deployment-guide-5.3].

> [!NOTE]
> The Azperflib.exe is a component that can't be used for own purposes. It is a component which delivers Azure infrastructure data related to the VM for the SAP Host Agent exclusively.
> 

##### Check the output of azperflib.exe

Azperflib.exe output shows all populated Azure performance counters for SAP. At the bottom of the list of collected counters, a summary and health indicator show the status of Azure Extension for SAP.

![Output of health check by executing azperflib.exe, which indicates that no problems exist][deployment-guide-figure-1100]
<a name="figure-11"></a>

Check the result returned for the **Counters total** output, which is reported as empty, and for **Health status**, shown in the preceding figure.

Interpret the resulting values as follows:

| Azperflib.exe result values | Azure Extension for SAP health status |
| --- | --- |
| **API Calls - not available** | Counters that are not available might be either not applicable to the virtual machine configuration, or are errors. See **Health status**. |
| **Counters total - empty** |The following two Azure storage counters can be empty: <ul><li>Storage Read Op Latency Server msec</li><li>Storage Read Op Latency E2E msec</li></ul>All other counters must have values. |
| **Health status** |Only OK if return status shows **OK**. |
| **Diagnostics** |Detailed information about health status. |

If the **Health status** value is not **OK**, follow the instructions in [Health check for Azure Extension for SAP configuration][deployment-guide-5.2].

#### Run the readiness check on a Linux VM

1. Connect to the Azure Virtual Machine by using SSH.

1. Check the output of the Azure Extension for SAP.

   a.  Run `more /var/lib/AzureEnhancedMonitor/PerfCounters`

   **Expected result**: Returns list of performance counters. The file should not be empty.

   b. Run `cat /var/lib/AzureEnhancedMonitor/PerfCounters | grep Error`

   **Expected result**: Returns one line where the error is **none**, for example, **3;config;Error;;0;0;none;0;1456416792;tst-servercs;**

   c. Run `more /var/lib/AzureEnhancedMonitor/LatestErrorRecord`

   **Expected result**: Returns as empty or does not exist.

If the preceding check was not successful, run these additional checks:

1. Make sure that the waagent is installed and enabled.

   a.  Run `sudo ls -al /var/lib/waagent/`

     **Expected result**: Lists the content of the waagent directory.

   b.  Run `ps -ax | grep waagent`

   **Expected result**: Displays one entry similar to: `python /usr/sbin/waagent -daemon`

1. Make sure that the Azure Extension for SAP is installed and running.

   a.  Run `sudo sh -c 'ls -al /var/lib/waagent/Microsoft.OSTCExtensions.AzureEnhancedMonitorForLinux-*/'`

   **Expected result**: Lists the content of the Azure Extension for SAP directory.

   b. Run `ps -ax | grep AzureEnhanced`

   **Expected result**: Displays one entry similar to: `python /var/lib/waagent/Microsoft.OSTCExtensions.AzureEnhancedMonitorForLinux-2.0.0.2/handler.py daemon`

1. Install SAP Host Agent as described in SAP Note [1031096], and check the output of `saposcol`.

   a.  Run `/usr/sap/hostctrl/exe/saposcol -d`

   b.  Run `dump ccm`

   c.  Check whether the **Virtualization_Configuration\Enhanced Monitoring Access** metric is **true**.

If you already have an SAP NetWeaver ABAP application server installed, open transaction ST06 and check whether monitoring is enabled.

If any of these checks fail, and for detailed information about how to redeploy the extension, see [Troubleshooting the Azure Extension for SAP][deployment-guide-5.3].

### <a name="7bf24f59-7347-4c7a-b094-4693e4687ee5"></a>Readiness check for the new Azure Extension for SAP

This check makes sure that all performance metrics that appear inside your SAP application are provided by the underlying Azure Extension for SAP. If you deployed the old Azure Extension for SAP, follow chapter [Readiness check for Azure Extension for SAP][deployment-guide-5.1] in this guide.

#### Run the readiness check on a Windows VM

1. Sign in to the Azure virtual machine (using an admin account is not necessary).
1. Open a web browser and navigate to http://127.0.0.1:11812/azure4sap/metrics
1. The browser should display or download an XML file that contains the monitoring data of your virtual machine. If that is not the case, make sure that the Azure Extension for SAP is installed.

##### Check the content of the XML file

The XML file that you can access at http://127.0.0.1:11812/azure4sap/metrics contains all populated Azure performance counters for SAP. It also contains a summary and health indicator of the status of Azure Extension for SAP.

Check the value of the **Provider Health Description** element. If the value is not **OK**, follow the instructions in [Health check for new Azure Extension for SAP configuration][deployment-guide-5.2-new].

#### Run the readiness check on a Linux VM

1. Connect to the Azure Virtual Machine by using SSH.

1. Check the output of the following command

    ```console
    curl http://127.0.0.1:11812/azure4sap/metrics
    ```
    
   **Expected result**: Returns an XML document that contains the monitoring information of the virtual machine, its disks and network interfaces.

If the preceding check was not successful, run these additional checks:

1. Make sure that the waagent is installed and enabled.

   a.  Run `sudo ls -al /var/lib/waagent/`

     **Expected result**: Lists the content of the waagent directory.

   b.  Run `ps -ax | grep waagent`

   **Expected result**: Displays one entry similar to: `python /usr/sbin/waagent -daemon`

1. Make sure that the Azure Extension for SAP is installed and running.

   a.  Run `sudo sh -c 'ls -al /var/lib/waagent/Microsoft.AzureCAT.AzureEnhancedMonitoring.MonitorX64Linux-*/'`

   **Expected result**: Lists the content of the Azure Extension for SAP directory.

   b. Run `ps -ax | grep AzureEnhanced`

   **Expected result**: Displays one entry similar to: `/var/lib/waagent/Microsoft.AzureCAT.AzureEnhancedMonitoring.MonitorX64Linux-1.0.0.82/AzureEnhancedMonitoring -monitor`

1. Install SAP Host Agent as described in SAP Note [1031096], and check the output of `saposcol`.

   a.  Run `/usr/sap/hostctrl/exe/saposcol -d`

   b.  Run `dump ccm`

   c.  Check whether the **Virtualization_Configuration\Enhanced Monitoring Access** metric is **true**.

If you already have an SAP NetWeaver ABAP application server installed, open transaction ST06 and check whether monitoring is enabled.

If any of these checks fail, and for detailed information about how to redeploy the extension, see [Troubleshooting the new Azure Extension for SAP][deployment-guide-5.3-new].

### <a name="e2d592ff-b4ea-4a53-a91a-e5521edb6cd1"></a>Health check for the Azure Extension for SAP configuration

If some of the infrastructure data is not delivered correctly as indicated by the test described in [Readiness check for Azure Extension for SAP][deployment-guide-5.1], run the `Test-AzVMAEMExtension` cmdlet to check whether the Azure infrastructure and the Azure Extension for SAP are configured correctly.

1. Make sure that you have installed the latest version of the Azure PowerShell cmdlet, as described in [Deploying Azure PowerShell cmdlets][deployment-guide-4.1].
1. Run the following PowerShell cmdlet. For a list of available environments, run the cmdlet `Get-AzEnvironment`. To use global Azure, select the **AzureCloud** environment. For Azure China 21Vianet, select **AzureChinaCloud**.

   ```powershell
   $env = Get-AzEnvironment -Name <name of the environment>
   Connect-AzAccount -Environment $env
   Set-AzContext -SubscriptionName <subscription name>
   Test-AzVMAEMExtension -ResourceGroupName <resource group name> -VMName <virtual machine name>
   ```

1. The script tests the configuration of the virtual machine you select.

   ![Output of successful test of the Azure Extension for SAP][deployment-guide-figure-1300]

Make sure that every health check result is **OK**. If some checks do not display **OK**, run the update cmdlet as described in [Configure the Azure Extension for SAP][deployment-guide-4.5]. Wait 15 minutes, and repeat the checks described in [Readiness check for Azure Extension for SAP][deployment-guide-5.1] and [Health check for Azure Extension for SAP configuration][deployment-guide-5.2]. If the checks still indicate a problem with some or all counters, see [Troubleshooting the Azure Extension for SAP][deployment-guide-5.3].

> [!Note]
> You can experience some warnings in cases where you use Managed Standard Azure Disks. Warnings will be displayed instead of the tests returning "OK". This is normal and intended in case of that disk type. See also see [Troubleshooting the Azure Extension for SAP][deployment-guide-5.3]
> 

### <a name="464ac96d-7d3c-435d-a5ae-3faf3bfef4b3"></a>Health check for the new Azure Extension for SAP configuration

If some of the infrastructure data is not delivered correctly as indicated by the test described in [Readiness check for Azure Extension for SAP][deployment-guide-5.1-new], run the `Get-AzVMExtension` cmdlet to check whether the Azure Extension for SAP is installed. The `Test-AzVMAEMExtension` does not yet support the new extension. Once the cmdlet supports the new extension, we will update this article.

1. Make sure that you have installed the latest version of the Azure PowerShell cmdlet, as described in [Deploying Azure PowerShell cmdlets][deployment-guide-4.1].
1. Run the following PowerShell cmdlet. For a list of available environments, run the cmdlet `Get-AzEnvironment`. To use global Azure, select the **AzureCloud** environment. For Azure China 21Vianet, select **AzureChinaCloud**.

   ```powershell
   $env = Get-AzEnvironment -Name <name of the environment>
   Connect-AzAccount -Environment $env
   Set-AzContext -SubscriptionName <subscription name>
   Get-AzVMExtension -ResourceGroupName <resource group name> -VMName <virtual machine name>
   ```

1. The cmdlet lists all extensions of the selected virtual machine. Make sure that the Azure Extension for SAP is installed on the VM.

### <a name="fe25a7da-4e4e-4388-8907-8abc2d33cfd8"></a>Troubleshooting Azure Extension for SAP

#### ![Windows][Logo_Windows] Azure performance counters do not show up at all

The AzureEnhancedMonitoring Windows service collects performance metrics in Azure. If the service has not been installed correctly or if it is not running in your VM, no performance metrics can be collected.

##### The installation directory of the Azure Extension for SAP is empty

###### Issue

The installation directory
C:\\Packages\\Plugins\\Microsoft.AzureCAT.AzureEnhancedMonitoring.AzureCATExtensionHandler\\&lt;version>\\drop
is empty.

###### Solution

The extension is not installed. Determine whether this is a proxy issue (as described earlier). You might need to restart the machine or rerun the `Set-AzVMAEMExtension` configuration script.

##### Service for Azure Extension for SAP does not exist

###### Issue

The AzureEnhancedMonitoring Windows service does not exist.

Azperflib.exe output throws an error:

![Execution of azperflib.exe indicates that the service of the Azure Extension for SAP is not running][deployment-guide-figure-1400]
<a name="figure-14"></a>

###### Solution

If the service does not exist, the Azure Extension for SAP has not been installed correctly. Redeploy the extension by using the steps described for your deployment scenario in [Deployment scenarios of VMs for SAP in Azure][deployment-guide-3].

After you deploy the extension, after one hour, check again whether the Azure performance counters are provided in the Azure VM.

##### Service for Azure Extension for SAP exists, but fails to start

###### Issue

The AzureEnhancedMonitoring Windows service exists and is enabled, but fails to start. For more information, check the application event log.

###### Solution

The configuration is incorrect. Restart the Azure Extension for SAP in the VM, as described in [Configure the Azure Extension for SAP][deployment-guide-4.5].

#### ![Windows][Logo_Windows] Some Azure performance counters are missing

The AzureEnhancedMonitoring Windows service collects performance metrics in Azure. The service gets data from several sources. Some configuration data is collected locally, and some performance metrics are read from Azure Diagnostics. Storage counters are used from your logging on the storage subscription level.

If troubleshooting by using SAP Note [1999351] doesn't resolve the issue, rerun the `Set-AzVMAEMExtension` configuration script. You might have to wait an hour because storage analytics or diagnostics counters might not be created immediately after they are enabled. If the problem persists, open an SAP customer support message on the component BC-OP-NT-AZR for Windows or BC-OP-LNX-AZR for a Linux virtual machine.

#### ![Linux][Logo_Linux] Azure performance counters do not show up at all

Performance metrics in Azure are collected by a daemon. If the daemon is not running, no performance metrics can be collected.

##### The installation directory of the Azure Extension for SAP is empty

###### Issue

The directory \\var\\lib\\waagent\\ does not have a subdirectory for the Azure Extension for SAP.

###### Solution

The extension is not installed. Determine whether this is a proxy issue (as described earlier). You might need to restart the machine and/or rerun the `Set-AzVMAEMExtension` configuration script.

##### The execution of Set-AzVMAEMExtension and Test-AzVMAEMExtension show warning messages stating that Standard Managed Disks are not supported

###### Issue

When executing Set-AzVMAEMExtension or Test-AzVMAEMExtension messages like these are shown:

<pre><code>
WARNING: [WARN] Standard Managed Disks are not supported. Extension will be installed but no disk metrics will be available.
WARNING: [WARN] Standard Managed Disks are not supported. Extension will be installed but no disk metrics will be available.
WARNING: [WARN] Standard Managed Disks are not supported. Extension will be installed but no disk metrics will be available.
</code></pre>

Executing azperfli.exe as described earlier you can get a result that is indicating a non-healthy state. 

###### Solution

The messages are caused by the fact that Standard Managed Disks are not delivering the APIs used by the SAP Extension for SAP to check on statistics of the Standard Azure Storage Accounts. This is not a matter of concern. Reason for introducing the collecting data for Standard Disk Storage accounts was throttling of inputs and outputs that occurred frequently. Managed disks will avoid such throttling by limiting the number of disks in a storage account. Therefore, not having that type of that data is not critical.


#### ![Linux][Logo_Linux] Some Azure performance counters are missing

Performance metrics in Azure are collected by a daemon, which gets data from several sources. Some configuration data is collected locally, and some performance metrics are read from Azure Diagnostics. Storage counters come from the logs in your storage subscription.

For a complete and up-to-date list of known issues, see SAP Note [1999351], which has additional troubleshooting information for Azure Extension for SAP.

If troubleshooting by using SAP Note [1999351] does not resolve the issue, rerun the `Set-AzVMAEMExtension` configuration script as described in [Configure the Azure Extension for SAP][deployment-guide-4.5]. You might have to wait for an hour because storage analytics or diagnostics counters might not be created immediately after they are enabled. If the problem persists, open an SAP customer support message on the component BC-OP-NT-AZR for Windows or BC-OP-LNX-AZR for a Linux virtual machine.

### <a name="b7afb8ef-a64c-495d-bb37-2af96688c530"></a>Troubleshooting the new Azure Extension for SAP

#### ![Windows][Logo_Windows] Azure performance counters do not show up at all

The AzureEnhancedMonitoring process collects performance metrics in Azure. If the process is not running in your VM, no performance metrics can be collected.

##### The installation directory of the Azure Extension for SAP is empty

###### Issue

The installation directory
C:\\Packages\\Plugins\\Microsoft.AzureCAT.AzureEnhancedMonitoring.MonitorX64Windows\\&lt;version>
is empty.

###### Solution

The extension is not installed. Determine whether this is a proxy issue (as described earlier). You might need to restart the machine or install the VM extension again.

#### ![Windows][Logo_Windows] Some Azure performance counters are missing

The AzureEnhancedMonitoring Windows process collects performance metrics in Azure. The process gets data from several sources. Some configuration data is collected locally, and some performance metrics are read from Azure Monitor.

If troubleshooting by using SAP Note [1999351], open an SAP customer support message on the component BC-OP-NT-AZR for Windows or BC-OP-LNX-AZR for a Linux virtual machine.

#### ![Linux][Logo_Linux] Azure performance counters do not show up at all

Performance metrics in Azure are collected by a daemon. If the daemon is not running, no performance metrics can be collected.

##### The installation directory of the Azure Extension for SAP is empty

###### Issue

The directory \\var\\lib\\waagent\\ does not have a subdirectory for the Azure Extension for SAP.

###### Solution

The extension is not installed. Determine whether this is a proxy issue (as described earlier). You might need to restart the machine and/or install the VM extension again.

#### ![Linux][Logo_Linux] Some Azure performance counters are missing

Performance metrics in Azure are collected by a daemon, which gets data from several sources. Some configuration data is collected locally, and some performance metrics are read from Azure Monitor.

For a complete and up-to-date list of known issues, see SAP Note [1999351], which has additional troubleshooting information for Azure Extension for SAP.

If troubleshooting by using SAP Note [1999351] does not resolve the issue, install the extension again as described in [Configure the Azure Extension for SAP][deployment-guide-4.5]. If the problem persists, open an SAP customer support message on the component BC-OP-NT-AZR for Windows or BC-OP-LNX-AZR for a Linux virtual machine.

## Azure Extension Error Codes

| Error ID | Error description | Solution |
|---|---|---|
| <a name="cfg_018"></a>cfg/018 | App configuration is missing. | [run setup script][deployment-guide-run-the-script] |
| <a name="cfg_019"></a>cfg/019 | No deployment ID in app config. | [contact support][deployment-guide-contact-support] |
| <a name="cfg_020"></a>cfg/020 | No RoleInstanceId in app config. | [contact support][deployment-guide-contact-support] |
| <a name="cfg_022"></a>cfg/022 | No RoleInstanceId in app config. | [contact support][deployment-guide-contact-support] |
| <a name="cfg_031"></a>cfg/031 | Cannot read Azure configuration. | [contact support][deployment-guide-contact-support] |
| <a name="cfg_021"></a>cfg/021 | App configuration file is missing. | [run setup script][deployment-guide-run-the-script] |
| <a name="cfg_015"></a>cfg/015 | No VM size in app config. | [run setup script][deployment-guide-run-the-script] |
| <a name="cfg_016"></a>cfg/016 | GlobalMemoryStatusEx counter failed. | [contact support][deployment-guide-contact-support] |
| <a name="cfg_023"></a>cfg/023 | MaxHwFrequency counter failed. | [contact support][deployment-guide-contact-support] |
| <a name="cfg_024"></a>cfg/024 | NIC counters failed. | [contact support][deployment-guide-contact-support] |
| <a name="cfg_025"></a>cfg/025 | Disk mapping counter failed. | [contact support][deployment-guide-contact-support] |
| <a name="cfg_026"></a>cfg/026 | Processor name counter failed. | [contact support][deployment-guide-contact-support] |
| <a name="cfg_027"></a>cfg/027 | Disk mapping counter failed. | [contact support][deployment-guide-contact-support] |
| <a name="cfg_038"></a>cfg/038 | The metric 'Disk type' is missing in the extension configuration file config.xml. 'Disk type' along with some other counters was introduced in v2.2.0.68 12/16/2015. If you deployed the extension prior to 12/16/2015, it uses the old configuration file. The Azure extension framework automatically upgrades the extension to a newer version, but the config.xml remains unchanged. To update the configuration, download and execute the latest PowerShell setup script. | [run setup script][deployment-guide-run-the-script] |
| <a name="cfg_039"></a>cfg/039 | No disk caching. | [run setup script][deployment-guide-run-the-script] |
| <a name="cfg_036"></a>cfg/036 | No disk SLA throughput. | [run setup script][deployment-guide-run-the-script] |
| <a name="cfg_037"></a>cfg/037 | No disk SLA IOPS. | [run setup script][deployment-guide-run-the-script] |
| <a name="cfg_028"></a>cfg/028 | Disk mapping counter failed. | [contact support][deployment-guide-contact-support] |
| <a name="cfg_029"></a>cfg/029 | Last hardware change counter failed. | [contact support][deployment-guide-contact-support] |
| <a name="cfg_030"></a>cfg/030 | NIC counters failed | [contact support][deployment-guide-contact-support] |
| <a name="cfg_017"></a>cfg/017 | Due to sysprep of the VM your Windows SID has changed. | [redeploy after sysprep][deployment-guide-redeploy-after-sysprep] |
| <a name="str_007"></a>str/007 | Access to the storage analytics failed. <br /><br />As population of storage analytics data on a newly created VM may need up to half an hour,  the error might disappear after some time. If the error still appears, re-run the setup script. | [run setup script][deployment-guide-run-the-script] |
| <a name="str_010"></a>str/010 | No Storage Analytics counters. | [run setup script][deployment-guide-run-the-script] |
| <a name="str_009"></a>str/009 | Storage Analytics failed. | [run setup script][deployment-guide-run-the-script] |
| <a name="wad_004"></a>wad/004 | Bad WAD configuration. | [run setup script][deployment-guide-run-the-script] |
| <a name="wad_002"></a>wad/002 | Unexpected WAD format. | [contact support][deployment-guide-contact-support] |
| <a name="wad_001"></a>wad/001 | No WAD counters found. | [run setup script][deployment-guide-run-the-script] |
| <a name="wad_040"></a>wad/040 | Stale WAD counters found. | [contact support][deployment-guide-contact-support] |
| <a name="wad_003"></a>wad/003 | Cannot read WAD table. There is no connection to WAD table. There can be several causes of this:<br /><br /> 1) outdated configuration <br />2) no network connection to Azure <br />3) issues with WAD setup | [run setup script][deployment-guide-run-the-script]<br />[fix internet connection][deployment-guide-fix-internet-connection]<br />[contact support][deployment-guide-contact-support] |
| <a name="prf_011"></a>prf/011 | Perfmon NIC metrics failed. | [contact support][deployment-guide-contact-support] |
| <a name="prf_012"></a>prf/012 | Perfmon disk metrics failed. | [contact support][deployment-guide-contact-support] |
| <a name="prf_013"></a>prf/013 | Some prefmon metrics failed. | [contact support][deployment-guide-contact-support] |
| <a name="prf_014"></a>prf/014 | Perfmon failed to create a counter. | [contact support][deployment-guide-contact-support] |
| <a name="cfg_035"></a>cfg/035 | No metric providers configured. | [contact support][deployment-guide-contact-support] |
| <a name="str_006"></a>str/006 | Bad Storage Analytics config. | [run setup script][deployment-guide-run-the-script] |
| <a name="str_032"></a>str/032 | Storage Analytics metrics failed. | [run setup script][deployment-guide-run-the-script] |
| <a name="cfg_033"></a>cfg/033 | One of the metric providers failed. | [run setup script][deployment-guide-run-the-script] |
| <a name="str_034"></a>str/034 | Provider thread failed. | [contact support][deployment-guide-contact-support] |

### Detailed Guidelines on Solutions Provided

#### <a name="0d2847ad-865d-4a4c-a405-f9b7baaa00c7"></a>Run the setup script

Follow the steps in chapter [Configure the Azure Extension for SAP][deployment-guide-4.5] in this guide to install the extension again. Note that some counters might need up to 30 minutes for provisioning.

If the errors do not disappear, [contact support][deployment-guide-contact-support].

#### <a name="3ba34cfc-c9bb-4648-9c3c-88e8b9130ca2"></a>Contact Support

Unexpected error or there is no known solution. Collect the AzureEnhancedMonitoring_service.log file located in the folder C:\Packages\Plugins\Microsoft.AzureCAT.AzureEnhancedMonitoring.AzureCATExtensionHandler\\\<version\>\drop (Windows) or /var/log/azure/Microsoft.OSTCExtensions.AzureEnhancedMonitorForLinux (Linux) and contact SAP support for further assistance.

#### <a name="2cd61f22-187d-42ed-bb8c-def0c983d756"></a>Redeploy after sysprep

If you plan to build a generalized sysprepped OS image (which can include SAP software), it is recommended that this image does not include the Azure extension for SAP. You should install the Azure extension for SAP after the new instance of the generalized OS image has been deployed.

However, if your generalized and sysprepped OS image already contains the Azure Extension for SAP, you can apply the following workaround to reconfigure the extension, on the newly deployed VM instance:

* On the newly deployed VM instance delete the content of the following folders:  
  C:\Packages\Plugins\Microsoft.AzureCAT.AzureEnhancedMonitoring.AzureCATExtensionHandler\\\<version\>\RuntimeSettings
  C:\Packages\Plugins\Microsoft.AzureCAT.AzureEnhancedMonitoring.AzureCATExtensionHandler\\\<version\>\Status

* Follow the steps in chapter [Configure the Azure Extension for SAP][deployment-guide-4.5] in this guide to install the extension again.

#### <a name="e92bc57d-80d9-4a2b-a2f4-16713a22ad89"></a>Fix internet connection

The  Microsoft Azure Virtual Machine running the Azure extension for SAP requires access to the Internet. If this Azure VM is part of an Azure Virtual Network or of an on-premises domain, make sure that the relevant proxy settings are set. These settings must also be valid for the LocalSystem account to access the Internet. Follow chapter [Configure the proxy][deployment-guide-configure-proxy] in this guide.

In addition, if you need to set a static IP address for your Azure VM, do not set it manually inside the Azure VM, but set it using [Azure PowerShell](../../../virtual-network/virtual-networks-static-private-ip-arm-ps.md), [Azure CLI](../../../virtual-network/virtual-networks-static-private-ip-arm-cli.md) [Azure portal](../../../virtual-network/virtual-networks-static-private-ip-arm-pportal.md). The static IP is propagated via the Azure DHCP service.

Manually setting a static IP address inside the Azure VM is not supported, and might lead to problems with the Azure extension for SAP.