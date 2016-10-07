<properties
   pageTitle="SAP NetWeaver on Windows virtual machines (VMs) - High-Availability Guide | Microsoft Azure"
   description="High-availability guide for SAP NetWeaver on Windows virtual machines"
   services="virtual-machines-windows,virtual-network,storage"
   documentationCenter="saponazure"
   authors="goraco"
   manager="timlt"
   editor=""
   tags="azure-resource-manager"
   keywords=""/>
<tags
   ms.service="virtual-machines-windows"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="vm-windows"
   ms.workload="infrastructure-services"
   ms.date="08/18/2016"
   ms.author="goraco"/>

# SAP NetWeaver on Windows virtual machines (VMs) - High-Availability Guide

[767598]:https://service.sap.com/sap/support/notes/767598
[773830]:https://service.sap.com/sap/support/notes/773830
[826037]:https://service.sap.com/sap/support/notes/826037
[965908]:https://service.sap.com/sap/support/notes/965908
[1031096]:https://service.sap.com/sap/support/notes/1031096
[1139904]:https://service.sap.com/sap/support/notes/1139904
[1173395]:https://service.sap.com/sap/support/notes/1173395
[1245200]:https://service.sap.com/sap/support/notes/1245200
[1409604]:https://service.sap.com/sap/support/notes/1409604
[1558958]:https://service.sap.com/sap/support/notes/1558958
[1585981]:https://service.sap.com/sap/support/notes/1585981
[1588316]:https://service.sap.com/sap/support/notes/1588316
[1590719]:https://service.sap.com/sap/support/notes/1590719
[1597355]:https://service.sap.com/sap/support/notes/1597355
[1605680]:https://service.sap.com/sap/support/notes/1605680
[1619720]:https://service.sap.com/sap/support/notes/1619720
[1619726]:https://service.sap.com/sap/support/notes/1619726
[1619967]:https://service.sap.com/sap/support/notes/1619967
[1750510]:https://service.sap.com/sap/support/notes/1750510
[1752266]:https://service.sap.com/sap/support/notes/1752266
[1757924]:https://service.sap.com/sap/support/notes/1757924
[1757928]:https://service.sap.com/sap/support/notes/1757928
[1758182]:https://service.sap.com/sap/support/notes/1758182
[1758496]:https://service.sap.com/sap/support/notes/1758496
[1772688]:https://service.sap.com/sap/support/notes/1772688
[1814258]:https://service.sap.com/sap/support/notes/1814258
[1882376]:https://service.sap.com/sap/support/notes/1882376
[1909114]:https://service.sap.com/sap/support/notes/1909114
[1922555]:https://service.sap.com/sap/support/notes/1922555
[1928533]:https://service.sap.com/sap/support/notes/1928533
[1941500]:https://service.sap.com/sap/support/notes/1941500
[1956005]:https://service.sap.com/sap/support/notes/1956005
[1973241]:https://service.sap.com/sap/support/notes/1973241
[1984787]:https://service.sap.com/sap/support/notes/1984787
[1999351]:https://service.sap.com/sap/support/notes/1999351
[2002167]:https://service.sap.com/sap/support/notes/2002167
[2015553]:https://service.sap.com/sap/support/notes/2015553
[2039619]:https://service.sap.com/sap/support/notes/2039619
[2121797]:https://service.sap.com/sap/support/notes/2121797
[2134316]:https://service.sap.com/sap/support/notes/2134316
[2178632]:https://service.sap.com/sap/support/notes/2178632
[2191498]:https://service.sap.com/sap/support/notes/2191498
[2233094]:https://service.sap.com/sap/support/notes/2233094
[2243692]:https://service.sap.com/sap/support/notes/2243692

[sap-installation-guides]:http://service.sap.com/instguides

[azure-cli]:../xplat-cli-install.md
[azure-portal]:https://portal.azure.com
[azure-ps]:../powershell-install-configure.md
[azure-quickstart-templates-github]:https://github.com/Azure/azure-quickstart-templates
[azure-script-ps]:https://go.microsoft.com/fwlink/p/?LinkID=395017
[azure-subscription-service-limits]:../azure-subscription-service-limits.md
[azure-subscription-service-limits-subscription]:../azure-subscription-service-limits.md#subscription

[dbms-guide]:virtual-machines-windows-sap-dbms-guide.md (SAP NetWeaver on Windows virtual machines (VMs) – DBMS Deployment Guide)
[dbms-guide-2.1]:virtual-machines-windows-sap-dbms-guide.md#c7abf1f0-c927-4a7c-9c1d-c7b5b3b7212f (Caching for VMs and VHDs)
[dbms-guide-2.2]:virtual-machines-windows-sap-dbms-guide.md#c8e566f9-21b7-4457-9f7f-126036971a91 (Software RAID)
[dbms-guide-2.3]:virtual-machines-windows-sap-dbms-guide.md#10b041ef-c177-498a-93ed-44b3441ab152 (Microsoft Azure Storage)
[dbms-guide-2]:virtual-machines-windows-sap-dbms-guide.md#65fa79d6-a85f-47ee-890b-22e794f51a64 (Structure of a RDBMS Deployment)
[dbms-guide-3]:virtual-machines-windows-sap-dbms-guide.md#871dfc27-e509-4222-9370-ab1de77021c3 (High Availability and Disaster Recovery with Azure VMs)
[dbms-guide-5.5.1]:virtual-machines-windows-sap-dbms-guide.md#0fef0e79-d3fe-4ae2-85af-73666a6f7268 (SQL Server 2012 SP1 CU4 and later)
[dbms-guide-5.5.2]:virtual-machines-windows-sap-dbms-guide.md#f9071eff-9d72-4f47-9da4-1852d782087b (SQL Server 2012 SP1 CU3 and earlier releases)
[dbms-guide-5.6]:virtual-machines-windows-sap-dbms-guide.md#1b353e38-21b3-4310-aeb6-a77e7c8e81c8 (Using a SQL Server images out of the Microsoft Azure Marketplace)
[dbms-guide-5.8]:virtual-machines-windows-sap-dbms-guide.md#9053f720-6f3b-4483-904d-15dc54141e30 (General SQL Server for SAP on Azure Summary)
[dbms-guide-5]:virtual-machines-windows-sap-dbms-guide.md#3264829e-075e-4d25-966e-a49dad878737 (Specifics to SQL Server RDBMS)
[dbms-guide-8.4.1]:virtual-machines-windows-sap-dbms-guide.md#b48cfe3b-48e9-4f5b-a783-1d29155bd573 (Storage configuration)
[dbms-guide-8.4.2]:virtual-machines-windows-sap-dbms-guide.md#23c78d3b-ca5a-4e72-8a24-645d141a3f5d (Backup and Restore)
[dbms-guide-8.4.3]:virtual-machines-windows-sap-dbms-guide.md#77cd2fbb-307e-4cbf-a65f-745553f72d2c (Performance Considerations for Backup and Restore)
[dbms-guide-8.4.4]:virtual-machines-windows-sap-dbms-guide.md#f77c1436-9ad8-44fb-a331-8671342de818 (Other)
[dbms-guide-900-sap-cache-server-on-premises]:virtual-machines-windows-sap-dbms-guide.md#642f746c-e4d4-489d-bf63-73e80177a0a8

[dbms-guide-figure-100]:./media/virtual-machines-shared-sap-dbms-guide/100_storage_account_types.png
[dbms-guide-figure-200]:./media/virtual-machines-shared-sap-dbms-guide/200-ha-set-for-dbms-ha.png
[dbms-guide-figure-300]:./media/virtual-machines-shared-sap-dbms-guide/300-reference-config-iaas.png
[dbms-guide-figure-400]:./media/virtual-machines-shared-sap-dbms-guide/400-sql-2012-backup-to-blob-storage.png
[dbms-guide-figure-500]:./media/virtual-machines-shared-sap-dbms-guide/500-sql-2012-backup-to-blob-storage-different-containers.png
[dbms-guide-figure-600]:./media/virtual-machines-shared-sap-dbms-guide/600-iaas-maxdb.png
[dbms-guide-figure-700]:./media/virtual-machines-shared-sap-dbms-guide/700-livecach-prod.png
[dbms-guide-figure-800]:./media/virtual-machines-shared-sap-dbms-guide/800-azure-vm-sap-content-server.png
[dbms-guide-figure-900]:./media/virtual-machines-shared-sap-dbms-guide/900-sap-cache-server-on-premises.png

[deployment-guide]:virtual-machines-windows-sap-deployment-guide.md (SAP NetWeaver on Windows virtual machines (VMs) – Deployment Guide)
[deployment-guide-2.2]:virtual-machines-windows-sap-deployment-guide.md#42ee2bdb-1efc-4ec7-ab31-fe4c22769b94 (SAP Resources)
[deployment-guide-3.1.2]:virtual-machines-windows-sap-deployment-guide.md#3688666f-281f-425b-a312-a77e7db2dfab (Deploying a VM with a custom image)
[deployment-guide-3.2]:virtual-machines-windows-sap-deployment-guide.md#db477013-9060-4602-9ad4-b0316f8bb281 (Scenario 1: Deploying a VM out of the Azure Marketplace for SAP)
[deployment-guide-3.3]:virtual-machines-windows-sap-deployment-guide.md#54a1fc6d-24fd-4feb-9c57-ac588a55dff2 (Scenario 2: Deploying a VM with a custom image for SAP)
[deployment-guide-3.4]:virtual-machines-windows-sap-deployment-guide.md#a9a60133-a763-4de8-8986-ac0fa33aa8c1 (Scenario 3: Moving a VM from on-premises using a non-generalized Azure VHD with SAP)
[deployment-guide-3]:virtual-machines-windows-sap-deployment-guide.md#b3253ee3-d63b-4d74-a49b-185e76c4088e (Deployment Scenarios of VMs for SAP on Microsoft Azure)
[deployment-guide-4.1]:virtual-machines-windows-sap-deployment-guide.md#604bcec2-8b6e-48d2-a944-61b0f5dee2f7 (Deploying Azure PowerShell cmdlets)
[deployment-guide-4.2]:virtual-machines-windows-sap-deployment-guide.md#7ccf6c3e-97ae-4a7a-9c75-e82c37beb18e (Download and Import SAP relevant PowerShell cmdlets)
[deployment-guide-4.3]:virtual-machines-windows-sap-deployment-guide.md#31d9ecd6-b136-4c73-b61e-da4a29bbc9cc (Join VM into on-premises Domain - Windows only)
[deployment-guide-4.4.2]:virtual-machines-windows-sap-deployment-guide.md#6889ff12-eaaf-4f3c-97e1-7c9edc7f7542 (Linux)
[deployment-guide-4.4]:virtual-machines-windows-sap-deployment-guide.md#c7cbb0dc-52a4-49db-8e03-83e7edc2927d (Download, Install and enable Azure VM Agent)
[deployment-guide-4.5.1]:virtual-machines-windows-sap-deployment-guide.md#987cf279-d713-4b4c-8143-6b11589bb9d4 (Azure PowerShell)
[deployment-guide-4.5.2]:virtual-machines-windows-sap-deployment-guide.md#408f3779-f422-4413-82f8-c57a23b4fc2f (Azure CLI)
[deployment-guide-4.5]:virtual-machines-windows-sap-deployment-guide.md#d98edcd3-f2a1-49f7-b26a-07448ceb60ca (Configure Azure Enhanced Monitoring Extension for SAP)
[deployment-guide-5.1]:virtual-machines-windows-sap-deployment-guide.md#bb61ce92-8c5c-461f-8c53-39f5e5ed91f2 (Readiness Check for Azure Enhanced Monitoring for SAP)
[deployment-guide-5.2]:virtual-machines-windows-sap-deployment-guide.md#e2d592ff-b4ea-4a53-a91a-e5521edb6cd1 (Health check for Azure Monitoring Infrastructure Configuration)
[deployment-guide-5.3]:virtual-machines-windows-sap-deployment-guide.md#fe25a7da-4e4e-4388-8907-8abc2d33cfd8 (Further troubleshooting of Azure Monitoring infrastructure for SAP)

[deployment-guide-configure-monitoring-scenario-1]:virtual-machines-windows-sap-deployment-guide.md#ec323ac3-1de9-4c3a-b770-4ff701def65b (Configure Monitoring)
[deployment-guide-configure-proxy]:virtual-machines-windows-sap-deployment-guide.md#baccae00-6f79-4307-ade4-40292ce4e02d (Configure Proxy)
[deployment-guide-figure-100]:./media/virtual-machines-shared-sap-deployment-guide/100-deploy-vm-image.png
[deployment-guide-figure-1000]:./media/virtual-machines-shared-sap-deployment-guide/1000-service-properties.png
[deployment-guide-figure-11]:virtual-machines-windows-sap-deployment-guide.md#figure-11
[deployment-guide-figure-1100]:./media/virtual-machines-shared-sap-deployment-guide/1100-azperflib.png
[deployment-guide-figure-1200]:./media/virtual-machines-shared-sap-deployment-guide/1200-cmd-test-login.png
[deployment-guide-figure-1300]:./media/virtual-machines-shared-sap-deployment-guide/1300-cmd-test-executed.png
[deployment-guide-figure-14]:virtual-machines-windows-sap-deployment-guide.md#figure-14
[deployment-guide-figure-1400]:./media/virtual-machines-shared-sap-deployment-guide/1400-azperflib-error-servicenotstarted.png
[deployment-guide-figure-300]:./media/virtual-machines-shared-sap-deployment-guide/300-deploy-private-image.png
[deployment-guide-figure-400]:./media/virtual-machines-shared-sap-deployment-guide/400-deploy-using-disk.png
[deployment-guide-figure-5]:virtual-machines-windows-sap-deployment-guide.md#figure-5
[deployment-guide-figure-50]:./media/virtual-machines-shared-sap-deployment-guide/50-forced-tunneling-suse.png
[deployment-guide-figure-500]:./media/virtual-machines-shared-sap-deployment-guide/500-install-powershell.png
[deployment-guide-figure-6]:virtual-machines-windows-sap-deployment-guide.md#figure-6
[deployment-guide-figure-600]:./media/virtual-machines-shared-sap-deployment-guide/600-powershell-version.png
[deployment-guide-figure-7]:virtual-machines-windows-sap-deployment-guide.md#figure-7
[deployment-guide-figure-700]:./media/virtual-machines-shared-sap-deployment-guide/700-install-powershell-installed.png
[deployment-guide-figure-760]:./media/virtual-machines-shared-sap-deployment-guide/760-azure-cli-version.png
[deployment-guide-figure-900]:./media/virtual-machines-shared-sap-deployment-guide/900-cmd-update-executed.png
[deployment-guide-figure-azure-cli-installed]:virtual-machines-windows-sap-deployment-guide.md#402488e5-f9bb-4b29-8063-1c5f52a892d0
[deployment-guide-figure-azure-cli-version]:virtual-machines-windows-sap-deployment-guide.md#0ad010e6-f9b5-4c21-9c09-bb2e5efb3fda
[deployment-guide-install-vm-agent-windows]:virtual-machines-windows-sap-deployment-guide.md#b2db5c9a-a076-42c6-9835-16945868e866
[deployment-guide-troubleshooting-chapter]:virtual-machines-windows-sap-deployment-guide.md#564adb4f-5c95-4041-9616-6635e83a810b (Checks and Troubleshooting for End-to-End Monitoring Setup for SAP on Azure)

[deploy-template-cli]:../resource-group-template-deploy.md#deploy-with-azure-cli-for-mac-linux-and-windows
[deploy-template-portal]:../resource-group-template-deploy.md#deploy-with-the-preview-portal
[deploy-template-powershell]:../resource-group-template-deploy.md#deploy-with-powershell

[dr-guide-classic]:http://go.microsoft.com/fwlink/?LinkID=521971

[getting-started]:virtual-machines-windows-sap-get-started.md
[getting-started-dbms]:virtual-machines-windows-sap-get-started.md#1343ffe1-8021-4ce6-a08d-3a1553a4db82
[getting-started-deployment]:virtual-machines-windows-sap-get-started.md#6aadadd2-76b5-46d8-8713-e8d63630e955
[getting-started-planning]:virtual-machines-windows-sap-get-started.md#3da0389e-708b-4e82-b2a2-e92f132df89c

[getting-started-windows-classic]:virtual-machines-windows-classic-sap-get-started.md
[getting-started-windows-classic-dbms]:virtual-machines-windows-classic-sap-get-started.md#c5b77a14-f6b4-44e9-acab-4d28ff72a930
[getting-started-windows-classic-deployment]:virtual-machines-windows-classic-sap-get-started.md#f84ea6ce-bbb4-41f7-9965-34d31b0098ea
[getting-started-windows-classic-dr]:virtual-machines-windows-classic-sap-get-started.md#cff10b4a-01a5-4dc3-94b6-afb8e55757d3
[getting-started-windows-classic-ha-sios]:virtual-machines-windows-classic-sap-get-started.md#4bb7512c-0fa0-4227-9853-4004281b1037
[getting-started-windows-classic-planning]:virtual-machines-windows-classic-sap-get-started.md#f2a5e9d8-49e4-419e-9900-af783173481c

[ha-guide-classic]:http://go.microsoft.com/fwlink/?LinkId=613056

[ha-guide]:virtual-machines-windows-sap-high-availability-guide.md

[install-extension-cli]:virtual-machines-linux-enable-aem.md

[Logo_Linux]:./media/virtual-machines-shared-sap-shared/Linux.png
[Logo_Windows]:./media/virtual-machines-shared-sap-shared/Windows.png

[msdn-set-azurermvmaemextension]:https://msdn.microsoft.com/library/azure/mt670598.aspx

[planning-guide]:virtual-machines-windows-sap-planning-guide.md (SAP NetWeaver on Windows virtual machines (VMs) – Planning and Implementation Guide)
[planning-guide-1.2]:virtual-machines-windows-sap-planning-guide.md#e55d1e22-c2c8-460b-9897-64622a34fdff (Resources)
[planning-guide-11]:virtual-machines-windows-sap-planning-guide.md#7cf991a1-badd-40a9-944e-7baae842a058 (High Availability (HA) and Disaster Recovery (DR) for SAP NetWeaver running on Azure Virtual Machines)
[planning-guide-11.4.1]:virtual-machines-windows-sap-planning-guide.md#5d9d36f9-9058-435d-8367-5ad05f00de77 (High Availability for SAP Application Servers)
[planning-guide-11.5]:virtual-machines-windows-sap-planning-guide.md#4e165b58-74ca-474f-a7f4-5e695a93204f (Using Autostart for SAP instances)
[planning-guide-2.1]:virtual-machines-windows-sap-planning-guide.md#1625df66-4cc6-4d60-9202-de8a0b77f803 (Cloud-Only - Virtual Machine deployments into Azure without dependencies on the on-premises customer network)
[planning-guide-2.2]:virtual-machines-windows-sap-planning-guide.md#f5b3b18c-302c-4bd8-9ab2-c388f1ab3d10 (Cross-Premise - Deployment of single or multiple SAP VMs into Azure with the requirement of being fully integrated into the on-premises network)
[planning-guide-3.1]:virtual-machines-windows-sap-planning-guide.md#be80d1b9-a463-4845-bd35-f4cebdb5424a (Azure Regions)
[planning-guide-3.2.1]:virtual-machines-windows-sap-planning-guide.md#df49dc09-141b-4f34-a4a2-990913b30358 (Fault Domains)
[planning-guide-3.2.2]:virtual-machines-windows-sap-planning-guide.md#fc1ac8b2-e54a-487c-8581-d3cc6625e560 (Upgrade Domains)
[planning-guide-3.2.3]:virtual-machines-windows-sap-planning-guide.md#18810088-f9be-4c97-958a-27996255c665 (Azure Availability Sets)
[planning-guide-3.2]:virtual-machines-windows-sap-planning-guide.md#8d8ad4b8-6093-4b91-ac36-ea56d80dbf77 (The Microsoft Azure Virtual Machine Concept)
[planning-guide-3.3.2]:virtual-machines-windows-sap-planning-guide.md#ff5ad0f9-f7f4-4022-9102-af07aef3bc92 (Azure Premium Storage)
[planning-guide-5.1.1]:virtual-machines-windows-sap-planning-guide.md#4d175f1b-7353-4137-9d2f-817683c26e53 (Moving a VM from on-premises to Azure with a non-generalized disk)
[planning-guide-5.1.2]:virtual-machines-windows-sap-planning-guide.md#e18f7839-c0e2-4385-b1e6-4538453a285c (Deploying a VM with a customer specific image)
[planning-guide-5.2.1]:virtual-machines-windows-sap-planning-guide.md#1b287330-944b-495d-9ea7-94b83aff73ef (Preparation for moving a VM from on-premises to Azure with a non-generalized disk)
[planning-guide-5.2.2]:virtual-machines-windows-sap-planning-guide.md#57f32b1c-0cba-4e57-ab6e-c39fe22b6ec3 (Preparation for deploying a VM with a customer specific image for SAP)
[planning-guide-5.2]:virtual-machines-windows-sap-planning-guide.md#6ffb9f41-a292-40bf-9e70-8204448559e7 (Preparing VMs with SAP for Azure)
[planning-guide-5.3.1]:virtual-machines-windows-sap-planning-guide.md#6e835de8-40b1-4b71-9f18-d45b20959b79 (Difference Between an Azure Disk and Azure Image)
[planning-guide-5.3.2]:virtual-machines-windows-sap-planning-guide.md#a43e40e6-1acc-4633-9816-8f095d5a7b6a (Uploading a VHD from on-premises to Azure)
[planning-guide-5.4.2]:virtual-machines-windows-sap-planning-guide.md#9789b076-2011-4afa-b2fe-b07a8aba58a1 (Copying disks between Azure Storage Accounts)
[planning-guide-5.5.1]:virtual-machines-windows-sap-planning-guide.md#4efec401-91e0-40c0-8e64-f2dceadff646 (VM/VHD structure for SAP deployments)
[planning-guide-5.5.3]:virtual-machines-windows-sap-planning-guide.md#17e0d543-7e8c-4160-a7da-dd7117a1ad9d (Setting automount for attached disks)
[planning-guide-7.1]:virtual-machines-windows-sap-planning-guide.md#3e9c3690-da67-421a-bc3f-12c520d99a30 (Single VM with SAP NetWeaver demo/training scenario)
[planning-guide-7]:virtual-machines-windows-sap-planning-guide.md#96a77628-a05e-475d-9df3-fb82217e8f14 (Concepts of Cloud-Only deployment of SAP instances)
[planning-guide-9.1]:virtual-machines-windows-sap-planning-guide.md#6f0a47f3-a289-4090-a053-2521618a28c3 (Azure Monitoring Solution for SAP)
[planning-guide-azure-premium-storage]:virtual-machines-windows-sap-planning-guide.md#ff5ad0f9-f7f4-4022-9102-af07aef3bc92 (Azure Premium Storage)

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
[planning-guide-microsoft-azure-networking]:virtual-machines-windows-sap-planning-guide.md#61678387-8868-435d-9f8c-450b2424f5bd (Microsoft Azure Networking)
[planning-guide-storage-microsoft-azure-storage-and-data-disks]:virtual-machines-windows-sap-planning-guide.md#a72afa26-4bf4-4a25-8cf7-855d6032157f (Storage: Microsoft Azure Storage and Data Disks)

[sap-ha-guide]:virtual-machines-windows-sap-high-availability-guide.md (High-availability SAP NetWeaver on Windows virtual machines)
[sap-ha-guide-1]:virtual-machines-windows-sap-high-availability-guide.md#217c5479-5595-4cd8-870d-15ab00d4f84c (Prerequisites)
[sap-ha-guide-2]:virtual-machines-windows-sap-high-availability-guide.md#42b8f600-7ba3-4606-b8a5-53c4f026da08 (Resources)
[sap-ha-guide-3]:virtual-machines-windows-sap-high-availability-guide.md#42156640c6-01cf-45a9-b225-4baa678b24f1 (High-availability SAP with Azure Resource Manager vs. the classic deployment model)
[sap-ha-guide-3.1]:virtual-machines-windows-sap-high-availability-guide.md#f76af273-1993-4d83-b12d-65deeae23686 (Resource groups)
[sap-ha-guide-3.2]:virtual-machines-windows-sap-high-availability-guide.md#3e85fbe0-84b1-4892-87af-d9b65ff91860 (Clustering with Azure Resource Manager vs. the classic deployment model)
[sap-ha-guide-4]:virtual-machines-windows-sap-high-availability-guide.md#8ecf3ba0-67c0-4495-9c14-feec1a2255b7 (Windows Server Failover Clustering)
[sap-ha-guide-4.1]:virtual-machines-windows-sap-high-availability-guide.md#1a3c5408-b168-46d6-99f5-4219ad1b1ff2 (Quorum modes)
[sap-ha-guide-5]:virtual-machines-windows-sap-high-availability-guide.md#fdfee875-6e66-483a-a343-14bbaee33275 (Windows Server Failover Clustering on-premises)
[sap-ha-guide-5.1]:virtual-machines-windows-sap-high-availability-guide.md#be21cf3e-fb01-402b-9955-54fbecf66592 (Shared storage)
[sap-ha-guide-5.2]:virtual-machines-windows-sap-high-availability-guide.md#ff7a9a06-2bc5-4b20-860a-46cdb44669cd (Networking and name resolution)
[sap-ha-guide-6]:virtual-machines-windows-sap-high-availability-guide.md#2ddba413-a7f5-4e4e-9a51-87908879c10a (Windows Server Failover Clustering in Azure)
[sap-ha-guide-6.1]:virtual-machines-windows-sap-high-availability-guide.md#1a464091-922b-48d7-9d08-7cecf757f341 (Shared disk in Azure with SIOS DataKeeper)
[sap-ha-guide-6.2]:virtual-machines-windows-sap-high-availability-guide.md#44641e18-a94e-431f-95ff-303ab65e0bcb (Name resolution in Azure)
[sap-ha-guide-7]:virtual-machines-windows-sap-high-availability-guide.md#2e3fec50-241e-441b-8708-0b1864f66dfa (SAP NetWeaver high availability in Azure infrastructure-as-a-service (IaaS))
[sap-ha-guide-7.1]:virtual-machines-windows-sap-high-availability-guide.md#93faa747-907e-440a-b00a-1ae0a89b1c0e (High-availability SAP application servers)
[sap-ha-guide-7.2]:virtual-machines-windows-sap-high-availability-guide.md#f559c285-ee68-4eec-add1-f60fe7b978db (High-availability SAP ASCS/SCS instance)
[sap-ha-guide-7.2.1]:virtual-machines-windows-sap-high-availability-guide.md#b5b1fd0b-1db4-4d49-9162-de07a0132a51 (High-availability SAP ASCS/SCS instance with Windows Server Failover Clustering in Azure)
[sap-ha-guide-7.3]:virtual-machines-windows-sap-high-availability-guide.md#ddd878a0-9c2f-4b8e-8968-26ce60be1027 (High-availability DBMS instance)
[sap-ha-guide-7.4]:virtual-machines-windows-sap-high-availability-guide.md#045252ed-0277-4fc8-8f46-c5a29694a816 (End-to-end high-availability deployment scenarios)
[sap-ha-guide-8]:virtual-machines-windows-sap-high-availability-guide.md#78092dbe-165b-454c-92f5-4972bdbef9bf (Prepare the infrastructure)
[sap-ha-guide-8.1]:virtual-machines-windows-sap-high-availability-guide.md#c87a8d3f-b1dc-4d2f-b23c-da4b72977489 (Deploy virtual machines with corporate network connectivity (cross-premises) to use in production)
[sap-ha-guide-8.2]:virtual-machines-windows-sap-high-availability-guide.md#7fe9af0e-3cce-495b-a5ec-dcb4d8e0a310 (Cloud-only deployment of SAP instances for test and demo)
[sap-ha-guide-8.3]:virtual-machines-windows-sap-high-availability-guide.md#47d5300a-a830-41d4-83dd-1a0d1ffdbe6a (Azure Virtual Network)
[sap-ha-guide-8.4]:virtual-machines-windows-sap-high-availability-guide.md#b22d7b3b-4343-40ff-a319-097e13f62f9e (DNS IP addresses)
[sap-ha-guide-8.5]:virtual-machines-windows-sap-high-availability-guide.md#9fbd43c0-5850-4965-9726-2a921d85d73f (Host names and static IP addresses for the SAP ASCS/SCS clustered instance and DBMS clustered instance)
[sap-ha-guide-8.6]:virtual-machines-windows-sap-high-availability-guide.md#84c019fe-8c58-4dac-9e54-173efd4b2c30 (Set static IP addresses for the SAP virtual machines)
[sap-ha-guide-8.7]:virtual-machines-windows-sap-high-availability-guide.md#7a8f3e9b-0624-4051-9e41-b73fff816a9e (Create a static IP address for the internal load balancer)
[sap-ha-guide-8.8]:virtual-machines-windows-sap-high-availability-guide.md#f19bd997-154d-4583-a46e-7f5a69d0153c (Default ASCS/SCS load balancing rules for the Azure internal load balancer)
[sap-ha-guide-8.9]:virtual-machines-windows-sap-high-availability-guide.md#fe0bd8b5-2b43-45e3-8295-80bee5415716 (Change the ASCS/SCS default load balancing rules for the Azure internal load balancer)
[sap-ha-guide-8.10]:virtual-machines-windows-sap-high-availability-guide.md#e69e9a34-4601-47a3-a41c-d2e11c626c0c (Add Windows virtual machines to the domain)
[sap-ha-guide-8.11]:virtual-machines-windows-sap-high-availability-guide.md#661035b2-4d0f-4d31-86f8-dc0a50d78158 (Add registry entries on both cluster nodes of the SAP ASCS/SCS instance)
[sap-ha-guide-8.12]:virtual-machines-windows-sap-high-availability-guide.md#0d67f090-7928-43e0-8772-5ccbf8f59aab (Set up a Windows Server Failover Clustering cluster for an SAP ASCS/SCS instance)
[sap-ha-guide-8.12.1]:virtual-machines-windows-sap-high-availability-guide.md#5eecb071-c703-4ccc-ba6d-fe9c6ded9d79 (Collect the cluster nodes in a cluster configuration)
[sap-ha-guide-8.12.2]:virtual-machines-windows-sap-high-availability-guide.md#e49a4529-50c9-4dcf-bde7-15a0c21d21ca (Configure a cluster file share witness)
[sap-ha-guide-8.12.2.1]:virtual-machines-windows-sap-high-availability-guide.md#06260b30-d697-4c4d-b1c9-d22c0bd64855 (Create a file share)
[sap-ha-guide-8.12.2.2]:virtual-machines-windows-sap-high-availability-guide.md#4c08c387-78a0-46b1-9d27-b497b08cac3d (Set the file share witness quorum in Failover Cluster Manager)
[sap-ha-guide-8.12.3]:virtual-machines-windows-sap-high-availability-guide.md#5c8e5482-841e-45e1-a89d-a05c0907c868 (Install SIOS DataKeeper Cluster Edition for the SAP ASCS/SCS cluster share disk)
[sap-ha-guide-8.12.3.1]:virtual-machines-windows-sap-high-availability-guide.md#1c2788c3-3648-4e82-9e0d-e058e475e2a3 (Add the .NET Framework 3.5)
[sap-ha-guide-8.12.3.2]:virtual-machines-windows-sap-high-availability-guide.md#dd41d5a2-8083-415b-9878-839652812102 (Install SIOS DataKeeper)
[sap-ha-guide-8.12.3.3]:virtual-machines-windows-sap-high-availability-guide.md#d9c1fc8e-8710-4dff-bec2-1f535db7b006 (Set up SIOS DataKeeper)
[sap-ha-guide-9]:virtual-machines-windows-sap-high-availability-guide.md#a06f0b49-8a7a-42bf-8b0d-c12026c5746b (Install the SAP NetWeaver system)
[sap-ha-guide-9.1]:virtual-machines-windows-sap-high-availability-guide.md#31c6bd4f-51df-4057-9fdf-3fcbc619c170 (Install SAP with a high-availability ASCS/SCS instance)
[sap-ha-guide-9.1.1]:virtual-machines-windows-sap-high-availability-guide.md#a97ad604-9094-44fe-a364-f89cb39bf097 (Create a virtual host name for the clustered SAP ASCS/SCS instance)
[sap-ha-guide-9.1.2]:virtual-machines-windows-sap-high-availability-guide.md#eb5af918-b42f-4803-bb50-eff41f84b0b0 (Install the SAP first cluster node)
[sap-ha-guide-9.1.3]:virtual-machines-windows-sap-high-availability-guide.md#e4caaab2-e90f-4f2c-bc84-2cd2e12a9556 (Modify the SAP profile of the ASCS/SCS instance)
[sap-ha-guide-9.1.4]:virtual-machines-windows-sap-high-availability-guide.md#10822f4f-32e7-4871-b63a-9b86c76ce761 (Add a probe port)
[sap-ha-guide-9.2]:virtual-machines-windows-sap-high-availability-guide.md#85d78414-b21d-4097-92b6-34d8bcb724b7 (Install the database instance)
[sap-ha-guide-9.3]:virtual-machines-windows-sap-high-availability-guide.md#8a276e16-f507-4071-b829-cdc0a4d36748 (Install the second cluster node)
[sap-ha-guide-9.4]:virtual-machines-windows-sap-high-availability-guide.md#094bc895-31d4-4471-91cc-1513b64e406a (Change the start type of the SAP ERS Windows service instance)
[sap-ha-guide-9.5]:virtual-machines-windows-sap-high-availability-guide.md#2477e58f-c5a7-4a5d-9ae3-7b91022cafb5 (Install the SAP Primary Application Server)
[sap-ha-guide-9.6]:virtual-machines-windows-sap-high-availability-guide.md#0ba4a6c1-cc37-4bcf-a8dc-025de4263772 (Install the SAP Additional Application Server)
[sap-ha-guide-10]:virtual-machines-windows-sap-high-availability-guide.md#18aa2b9d-92d2-4c0e-8ddd-5acaabda99e9 (Test the SAP ASCS/SCS instance failover and SIOS replication)
[sap-ha-guide-10.1]:virtual-machines-windows-sap-high-availability-guide.md#65fdef0f-9f94-41f9-b314-ea45bbfea445 (SAP ASCS/SCS instance is running on cluster node A)
[sap-ha-guide-10.2]:virtual-machines-windows-sap-high-availability-guide.md#5e959fa9-8fcd-49e5-a12c-37f6ba07b916 (Failover from node A to node B)
[sap-ha-guide-10.3]:virtual-machines-windows-sap-high-availability-guide.md#755a6b93-0099-4533-9f6d-5c9a613878b5 (SAP ASCS/SCS instance is running on cluster node B)


[sap-ha-guide-figure-1000]:./media/virtual-machines-shared-sap-high-availability-guide/1000-wsfc-for-sap-ascs-on-azure.png
[sap-ha-guide-figure-1001]:./media/virtual-machines-shared-sap-high-availability-guide/1001-wsfc-on-azure-ilb.png
[sap-ha-guide-figure-1002]:./media/virtual-machines-shared-sap-high-availability-guide/1002-wsfc-sios-on-azure-ilb.png
[sap-ha-guide-figure-2000]:./media/virtual-machines-shared-sap-high-availability-guide/2000-wsfc-sap-as-ha-on-azure.png
[sap-ha-guide-figure-2001]:./media/virtual-machines-shared-sap-high-availability-guide/2001-wsfc-sap-ascs-ha-on-azure.png
[sap-ha-guide-figure-2003]:./media/virtual-machines-shared-sap-high-availability-guide/2003-wsfc-sap-dbms-ha-on-azure.png
[sap-ha-guide-figure-2004]:./media/virtual-machines-shared-sap-high-availability-guide/2004-wsfc-sap-ha-e2e-archit-template1-on-azure.png
[sap-ha-guide-figure-3000]:./media/virtual-machines-shared-sap-high-availability-guide/3000-template-parameters-sap-ha-arm-on-azure.png
[sap-ha-guide-figure-3001]:./media/virtual-machines-shared-sap-high-availability-guide/3001-configuring-dns-servers-for-Azure-vnet.png
[sap-ha-guide-figure-3002]:./media/virtual-machines-shared-sap-high-availability-guide/3002-configuring-static-IP-address-for-network-card-of-each-vm.png
[sap-ha-guide-figure-3003]:./media/virtual-machines-shared-sap-high-availability-guide/3003-setup-static-ip-address-ilb-for-ascs-instance.png
[sap-ha-guide-figure-3004]:./media/virtual-machines-shared-sap-high-availability-guide/3004-default-ascs-scs-ilb-balancing-rules-for-azure-ilb.png
[sap-ha-guide-figure-3005]:./media/virtual-machines-shared-sap-high-availability-guide/3005-changing-ascs-scs-default-ilb-rules-for-azure-ilb.png
[sap-ha-guide-figure-3006]:./media/virtual-machines-shared-sap-high-availability-guide/3006-adding-vm-to-domain.png
[sap-ha-guide-figure-3007]:./media/virtual-machines-shared-sap-high-availability-guide/3007-config-wsfc-1.png
[sap-ha-guide-figure-3008]:./media/virtual-machines-shared-sap-high-availability-guide/3008-config-wsfc-2.png
[sap-ha-guide-figure-3009]:./media/virtual-machines-shared-sap-high-availability-guide/3009-config-wsfc-3.png
[sap-ha-guide-figure-3010]:./media/virtual-machines-shared-sap-high-availability-guide/3010-config-wsfc-4.png
[sap-ha-guide-figure-3011]:./media/virtual-machines-shared-sap-high-availability-guide/3011-config-wsfc-5.png
[sap-ha-guide-figure-3012]:./media/virtual-machines-shared-sap-high-availability-guide/3012-config-wsfc-6.png
[sap-ha-guide-figure-3013]:./media/virtual-machines-shared-sap-high-availability-guide/3013-config-wsfc-7.png
[sap-ha-guide-figure-3014]:./media/virtual-machines-shared-sap-high-availability-guide/3014-config-wsfc-8.png
[sap-ha-guide-figure-3015]:./media/virtual-machines-shared-sap-high-availability-guide/3015-config-wsfc-9.png
[sap-ha-guide-figure-3016]:./media/virtual-machines-shared-sap-high-availability-guide/3016-config-wsfc-10.png
[sap-ha-guide-figure-3017]:./media/virtual-machines-shared-sap-high-availability-guide/3017-config-wsfc-11.png
[sap-ha-guide-figure-3018]:./media/virtual-machines-shared-sap-high-availability-guide/3018-config-wsfc-12.png
[sap-ha-guide-figure-3019]:./media/virtual-machines-shared-sap-high-availability-guide/3019-assign-permissions-on-share-for-cluster-name-object.png
[sap-ha-guide-figure-3020]:./media/virtual-machines-shared-sap-high-availability-guide/3020-change-object-type-include-computer-objects.png
[sap-ha-guide-figure-3021]:./media/virtual-machines-shared-sap-high-availability-guide/3021-check-box-for-computer-objects.png
[sap-ha-guide-figure-3022]:./media/virtual-machines-shared-sap-high-availability-guide/3022-set-security-attributes-for-cluster-name-object-on-file-share-quorum.png
[sap-ha-guide-figure-3023]:./media/virtual-machines-shared-sap-high-availability-guide/3023-call-configure-cluster-quorum-setting-wizard.png
[sap-ha-guide-figure-3024]:./media/virtual-machines-shared-sap-high-availability-guide/3024-selection-screen-different-quorum-configurations.png
[sap-ha-guide-figure-3025]:./media/virtual-machines-shared-sap-high-availability-guide/3025-selection-screen-file-share-witness.png
[sap-ha-guide-figure-3026]:./media/virtual-machines-shared-sap-high-availability-guide/3026-define-file-share-location-for-witness-share.png
[sap-ha-guide-figure-3027]:./media/virtual-machines-shared-sap-high-availability-guide/3027-successful-reconfiguration-cluster-file-share-witness.png
[sap-ha-guide-figure-3028]:./media/virtual-machines-shared-sap-high-availability-guide/3028-install-dot-net-framework-35.png
[sap-ha-guide-figure-3029]:./media/virtual-machines-shared-sap-high-availability-guide/3029-install-dot-net-framework-35-progress.png
[sap-ha-guide-figure-3030]:./media/virtual-machines-shared-sap-high-availability-guide/3030-sios-installer.png
[sap-ha-guide-figure-3031]:./media/virtual-machines-shared-sap-high-availability-guide/3031-first-screen-sios-data-keeper-installation.png
[sap-ha-guide-figure-3032]:./media/virtual-machines-shared-sap-high-availability-guide/3032-data-keeper-informs-service-be-disabled.png
[sap-ha-guide-figure-3033]:./media/virtual-machines-shared-sap-high-availability-guide/3033-user-selection-sios-data-keeper.png
[sap-ha-guide-figure-3034]:./media/virtual-machines-shared-sap-high-availability-guide/3034-domain-user-sios-data-keeper.png
[sap-ha-guide-figure-3035]:./media/virtual-machines-shared-sap-high-availability-guide/3035-provide-sios-data-keeper-license.png
[sap-ha-guide-figure-3036]:./media/virtual-machines-shared-sap-high-availability-guide/3036-data-keeper-management-config-tool.png
[sap-ha-guide-figure-3037]:./media/virtual-machines-shared-sap-high-availability-guide/3037-tcp-ip-address-first-node-data-keeper.png
[sap-ha-guide-figure-3038]:./media/virtual-machines-shared-sap-high-availability-guide/3038-create-replication-sios-job.png
[sap-ha-guide-figure-3039]:./media/virtual-machines-shared-sap-high-availability-guide/3039-define-sios-replication-job-name.png
[sap-ha-guide-figure-3040]:./media/virtual-machines-shared-sap-high-availability-guide/3040-define-sios-source-node.png
[sap-ha-guide-figure-3041]:./media/virtual-machines-shared-sap-high-availability-guide/3041-define-sios-target-node.png
[sap-ha-guide-figure-3042]:./media/virtual-machines-shared-sap-high-availability-guide/3042-define-sios-synchronous-replication.png
[sap-ha-guide-figure-3043]:./media/virtual-machines-shared-sap-high-availability-guide/3043-enable-sios-replicated-volume-as-cluster-volume.png
[sap-ha-guide-figure-3044]:./media/virtual-machines-shared-sap-high-availability-guide/3044-data-keeper-synchronous-mirroring-for-SAP-gui.png
[sap-ha-guide-figure-3045]:./media/virtual-machines-shared-sap-high-availability-guide/3045-replicated-disk-by-data-keeper-in-wsfc.png
[sap-ha-guide-figure-3046]:./media/virtual-machines-shared-sap-high-availability-guide/3046-dns-entry-sap-ascs-virtual-name-ip.png
[sap-ha-guide-figure-3047]:./media/virtual-machines-shared-sap-high-availability-guide/3047-dns-manager.png
[sap-ha-guide-figure-3048]:./media/virtual-machines-shared-sap-high-availability-guide/3048-default-cluster-probe-port.png
[sap-ha-guide-figure-3049]:./media/virtual-machines-shared-sap-high-availability-guide/3049-cluster-probe-port-after.png
[sap-ha-guide-figure-3050]:./media/virtual-machines-shared-sap-high-availability-guide/3050-service-type-ers-delayed-automatic.png
[sap-ha-guide-figure-5000]:./media/virtual-machines-shared-sap-high-availability-guide/5000-wsfc-sap-sid-node-a.png
[sap-ha-guide-figure-5001]:./media/virtual-machines-shared-sap-high-availability-guide/5001-sios-replicating-local-volume.png
[sap-ha-guide-figure-5002]:./media/virtual-machines-shared-sap-high-availability-guide/5002-wsfc-sap-sid-node-b.png
[sap-ha-guide-figure-5003]:./media/virtual-machines-shared-sap-high-availability-guide/5003-sios-replicating-local-volume-b-to-a.png


[powershell-install-configure]:../powershell-install-configure.md
[resource-group-authoring-templates]:../resource-group-authoring-templates.md
[resource-group-overview]:../resource-group-overview.md
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
[virtual-machines-windows-attach-disk-portal]:virtual-machines-windows-attach-disk-portal.md
[virtual-machines-azure-resource-manager-architecture]:../resource-manager-deployment-model.md
[virtual-machines-azure-resource-manager-architecture-benefits-arm]:../resource-manager-deployment-model.md#benefits-of-using-resource-manager-and-resource-groups
[virtual-machines-azurerm-versus-azuresm]:virtual-machines-windows-compare-deployment-models.md
[virtual-machines-windows-classic-configure-oracle-data-guard]:virtual-machines-windows-classic-configure-oracle-data-guard.md
[virtual-machines-linux-cli-deploy-templates]:virtual-machines-linux-cli-deploy-templates.md (Deploy and manage virtual machines by using Azure Resource Manager templates and the Azure CLI)
[virtual-machines-deploy-rmtemplates-powershell]:virtual-machines-windows-ps-manage.md (Manage virtual machines using Azure Resource Manager and PowerShell)
[virtual-machines-linux-agent-user-guide]:virtual-machines-linux-agent-user-guide.md
[virtual-machines-linux-agent-user-guide-command-line-options]:virtual-machines-linux-agent-user-guide.md#command-line-options
[virtual-machines-linux-capture-image]:virtual-machines-linux-capture-image.md
[virtual-machines-linux-capture-image-capture]:virtual-machines-linux-capture-image.md#capture-the-vm
[virtual-machines-windows-capture-image]:virtual-machines-windows-capture-image.md
[virtual-machines-windows-capture-image-capture]:virtual-machines-windows-capture-image.md#capture-the-vm
[virtual-machines-linux-configure-lvm]:virtual-machines-linux-configure-lvm.md
[virtual-machines-linux-configure-raid]:virtual-machines-linux-configure-raid.md
[virtual-machines-linux-classic-create-upload-vhd-step-1]:virtual-machines-linux-classic-create-upload-vhd.md#step-1-prepare-the-image-to-be-uploaded
[virtual-machines-linux-create-upload-vhd-suse]:virtual-machines-linux-suse-create-upload-vhd.md
[virtual-machines-linux-redhat-create-upload-vhd]:virtual-machines-linux-redhat-create-upload-vhd.md
[virtual-machines-linux-how-to-attach-disk]:virtual-machines-linux-add-disk.md
[virtual-machines-linux-how-to-attach-disk-how-to-initialize-a-new-data-disk-in-linux]:virtual-machines-linux-add-disk.md#connect-to-the-linux-vm-to-mount-the-new-disk
[virtual-machines-linux-tutorial]:virtual-machines-linux-quick-create-cli.md
[virtual-machines-linux-update-agent]:virtual-machines-linux-update-agent.md
[virtual-machines-manage-availability]:virtual-machines-windows-manage-availability.md
[virtual-machines-ps-create-preconfigure-windows-resource-manager-vms]:virtual-machines-windows-ps-create.md
[virtual-machines-sizes]:virtual-machines-windows-sizes.md
[virtual-machines-windows-classic-ps-sql-alwayson-availability-groups]:virtual-machines-windows-classic-ps-sql-alwayson-availability-groups.md
[virtual-machines-windows-classic-ps-sql-int-listener]:virtual-machines-windows-classic-ps-sql-int-listener.md
[virtual-machines-windows-portal-sql-alwayson-availability-groups-manual]:virtual-machines-windows-portal-sql-alwayson-availability-groups-manual.md
[virtual-machines-windows-portal-sql-alwayson-int-listener]:virtual-machines-windows-portal-sql-alwayson-int-listener.md
[virtual-machines-sql-server-high-availability-and-disaster-recovery-solutions]:virtual-machines-windows-sql-high-availability-dr.md
[virtual-machines-sql-server-infrastructure-services]:virtual-machines-windows-sql-server-iaas-overview.md
[virtual-machines-sql-server-performance-best-practices]:virtual-machines-windows-sql-performance.md
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
[vpn-gateway-site-to-site-create]:../vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-portal.md
[vpn-gateway-vpn-faq]:../vpn-gateway/vpn-gateway-vpn-faq.md
[xplat-cli]:../xplat-cli-install.md
[xplat-cli-azure-resource-manager]:../xplat-cli-azure-resource-manager.md


Azure Virtual Machines is the solution for organizations that need compute, storage, and network resources, in minimal time, and without lengthy procurement cycles. You can use Azure Virtual Machines to deploy classic applications like SAP NetWeaver-based ABAP, Java, and an ABAP+Java stack. Extend reliability and availability without additional on-premises resources. Because Azure Virtual Machines supports cross-premises connectivity, your organization can integrate Azure Virtual Machines into your on-premises domains, private clouds, and SAP system landscape.

In this article, we cover the steps that you can take to deploy high-availability SAP systems in Azure, by using the new Azure Resource Manager deployment model. We walk you through these major tasks:

- Find the right SAP installation guides and notes, listed in the [Resources][sap-ha-guide-2] section. This article complements SAP installation documentation and SAP notes, which are the primary resources that can help you install and deploy SAP software on specific platforms.

- Learn the differences between the Azure classic deployment model and the Azure Resource Manager deployment model.

- Learn about Windows Server Failover Clustering quorum modes, so that you can select the model that is right for your Azure deployment.

- Learn about Windows Server Failover Clustering shared storage in Azure services.

- Learn how to protect single-point-of-failure components like ABAP SAP Central Services (ASCS)/SAP Central Services (SCS) and database management systems (DBMS), and redundant components like SAP application servers, in Azure.

- Follow a step-by-step example of an installation and configuration of a high-availability SAP system in a Windows Server Failover Clustering cluster by using Azure as a platform, with Azure Resource Manager.

- Learn about additional steps required to use Windows Server Failover Clustering in Azure, but which are not needed in an on-premises deployment.

To simplify deployment and configuration, in this article, we're using the new SAP three-tier high-availability Resource Manager templates. The templates automate deployment of the entire infrastructure that you need for a high-availability SAP system. The infrastructure also supports SAPS sizing of your SAP system.

[AZURE.INCLUDE [windows-warning](../../includes/virtual-machines-linux-sap-warning.md)]

## <a name="217c5479-5595-4cd8-870d-15ab00d4f84c"></a> Prerequisites

Before you start, make sure that you meet the prerequisites that are described in the following sections. Also, be sure to check all resources listed in the [Resources][sap-ha-guide-2] section.

In this article, we use Azure Resource Manager templates for [three-tier SAP NetWeaver](https://github.com/Azure/azure-quickstart-templates/tree/master/sap-3-tier-marketplace-image/). For a helpful overview of templates, see [SAP Azure Resource Manager templates](https://blogs.msdn.microsoft.com/saponsqlserver/2016/05/16/azure-quickstart-templates-for-sap/).

## <a name="42b8f600-7ba3-4606-b8a5-53c4f026da08"></a> Resources

These guides also cover SAP deployments in Azure:

- [SAP NetWeaver on Windows virtual machines (VMs) – Planning and Implementation Guide][planning-guide]
- [SAP NetWeaver on Windows virtual machines (VMs) – Deployment Guide][deployment-guide]
- [SAP NetWeaver on Windows virtual machines (VMs) – DBMS Deployment Guide][dbms-guide]
- [SAP NetWeaver on Windows virtual machines (VMs) – High-Availability Guide [this guide] ][sap-ha-guide]

> [AZURE.NOTE] Whenever possible, we give you a link to the referring SAP installation guide (see [SAP installation guides][sap-installation-guides]). For prerequisites and information about the installation process, it's a good idea to read the SAP NetWeaver installation guides carefully. This article covers only specific tasks for SAP NetWeaver-based systems that you can use with Azure Virtual Machines.

These SAP notes are related to the topic of SAP in Azure:

| Note number   | Title                                                    
| ------------- |----------------------------------------------------------
| [1928533]       | SAP Applications on Azure: Supported Products and Sizing
| [2015553]       | SAP on Microsoft Azure: Support Prerequisites         
| [1999351]       | Enhanced Azure Monitoring for SAP                        
| [2178632]       | Key Monitoring Metrics for SAP on Microsoft Azure        
| [1999351]       | Virtualization on Windows: Enhanced Monitoring      


Learn more about the [limitations of Azure subscriptions][azure-subscription-service-limits-subscription], including general default limitations and maximum limitations.

## <a name="42156640c6-01cf-45a9-b225-4baa678b24f1"></a>High-availability SAP with Azure Resource Manager vs. the classic deployment model

The Azure Resource Manager and classic deployment models are different in two main ways:

- Resource groups
- Clustering requirements

### <a name="f76af273-1993-4d83-b12d-65deeae23686"></a> Resource groups
In Azure Resource Manager, you can use resource groups to manage all the application resources in your Azure subscription. In an integrated approach, in a resource group, all resources have the same life cycle. For example, all resources are created at the same time and deleted at the same time. You can get more information about [resource groups](resource-group-overview.md#resource-groups).

### <a name="3e85fbe0-84b1-4892-87af-d9b65ff91860"></a> Clustering with Azure Resource Manager vs. the classic deployment model

In the Azure Resource Manager model, you don't need a cloud service to use Azure internal load balancing for high availability.

To use the Azure classic model, follow the procedures described in [SAP NetWeaver in Azure: Clustering SAP ASCS/SCS instances by using Windows Server Failover Clustering in Azure with SIOS DataKeeper](http://go.microsoft.com/fwlink/?LinkId=613056).

> [AZURE.NOTE] We strongly recommend that you use the Azure Resource Manager deployment model for your SAP installations. It offers many benefits that are not available in the classic deployment model. You can learn more about Azure [deployment models][virtual-machines-azure-resource-manager-architecture-benefits-arm].   

## <a name="8ecf3ba0-67c0-4495-9c14-feec1a2255b7"></a> Windows Server Failover Clustering

Windows Server Failover Clustering is the foundation of a high-availability SAP ASCS/SCS installation and DBMS in Windows.

A failover cluster is a group of 1+n independent servers (nodes) that work together to increase the availability of applications and services. If a node failure occurs, Windows Server Failover Clustering calculates the number of failures that can occur and maintain a healthy cluster to provide the defined applications and services. You can choose from different quorum modes to achieve this.

### <a name="1a3c5408-b168-46d6-99f5-4219ad1b1ff2"></a> Quorum modes

You can choose from four quorum modes when you use Windows Server Failover Clustering:

- **Node Majority**. Each node of the cluster can vote. The cluster functions only with a majority of votes, that is, with more than half the   votes. We recommend this option for clusters that have an uneven number of nodes. For example, three nodes in a seven-node cluster can fail, and the cluster stills achieves a majority and continues to run.  

- **Node and Disk Majority**. Each node and a designated disk (a disk witness) in the cluster storage can vote when they are available and in communication. The cluster functions only with a majority of the votes, that is, with more than half the votes. This mode makes sense in a cluster environment with an even number of nodes. If half the nodes and the disk are online, the cluster remains in a healthy state.

- **Node and File Share Majority**. Each node plus a designated file share (a file share witness) that the administrator creates can vote, regardless of whether they are available and in communication. The cluster functions only with a majority of the votes, that is, with more than half the votes. This mode makes sense in a cluster environment with an even number of nodes. It's similar to the Node and Disk Majority mode, but it uses a witness file share instead of a witness disk. This mode is easy to implement, but if the file share itself is not highly available, it might become a single point of failure.

- **No Majority: Disk Only**. The cluster has a quorum if one node is available and in communication with a specific disk in the cluster storage. Only the nodes that are also in communication with that disk can join the cluster. We recommend that you do not use this mode.
 
## <a name="fdfee875-6e66-483a-a343-14bbaee33275"></a> Windows Server Failover Clustering on-premises
The example in Figure 1 shows a cluster of two nodes. If the network connection between the nodes fails and both nodes stay up and running, a quorum disk or file share determines which node will continue to provide the cluster's applications and services. The node that has access to the quorum disk or file share is the node that ensures that services continue.

Because this example uses a two-node cluster, we use the Node and File Share Majority quorum mode. The Node and Disk Majority also is a valid option. In a production environment, we recommend that you use a quorum disk. You can use network and storage system technology to make it highly available.

![Figure 1: Example of a Windows Server Failover Clustering configuration for SAP ASCS/SCS in Azure][sap-ha-guide-figure-1000]

_**Figure 1:** Example of a Windows Server Failover Clustering configuration for SAP ASCS/SCS in Azure_

### <a name="be21cf3e-fb01-402b-9955-54fbecf66592"></a> Shared storage

Figure 1 also shows a two-node shared storage cluster. In an on-premises shared storage cluster, all nodes in the cluster detect shared storage. A locking mechanism protects the data from corruption. All nodes can detect it when another node fails. If one node fails, the remaining node takes ownership of the storage resources and ensures the availability of services.

> [AZURE.NOTE] You don't need shared disks for high availability with some DBMS applications, like with SQL Server. SQL Server Always On replicates DBMS data and log files from the local disk of one cluster node to the local disk of another cluster node. In that case, the Windows cluster configuration doesn't need a shared disk.

### <a name="ff7a9a06-2bc5-4b20-860a-46cdb44669cd"></a> Networking and name resolution

Client computers reach the cluster over a virtual IP address and a virtual host name that the DNS server provides. The on-premises nodes and the DNS server can handle multiple IP addresses.

In a typical setup, you use two or more network connections:

- A dedicated connection to the storage
- A cluster-internal network connection for the heartbeat
- A public network that clients use to connect to the cluster

## <a name="2ddba413-a7f5-4e4e-9a51-87908879c10a"></a> Windows Server Failover Clustering in Azure

Compared to bare metal or private cloud deployments, Azure Virtual Machines requires additional steps to configure Windows Server Failover Clustering. When you build a shared cluster disk, you'll need to set several IP addresses and virtual host names for the SAP ASCS/SCS instance.

In this article, we discuss key concepts and the additional steps required when you build an SAP high-availability central services cluster in Azure. We show you how to set up the third-party tool SIOS DataKeeper, and how to configure the Azure internal load balancer. You can use these tools to create a Windows failover cluster with a file share witness in Azure.


![Figure 2: Windows Server Failover Clustering configuration in Azure without a shared disk][sap-ha-guide-figure-1001]

_**Figure 2:** Windows Server Failover Clustering configuration in Azure without a shared disk_


### <a name="1a464091-922b-48d7-9d08-7cecf757f341"></a> Shared disk in Azure with SIOS DataKeeper

You need cluster shared storage for a high-availability SAP ASCS/SCS instance. As of September 2016, Azure doesn't offer shared storage that you can use to create a shared storage cluster. You can use third-party software SIOS DataKeeper Cluster Edition to create a mirrored storage that simulates cluster shared storage. The SIOS solution provides real-time synchronous data replication. This is how you can create a shared disk resource for a cluster:

1. Attach an additional Azure virtual hard disk (VHD) to each of the virtual machines in a Windows cluster configuration.
2. Run SIOS DataKeeper Cluster Edition on both virtual machine nodes.
3. Configure SIOS DataKeeper Cluster Edition so that it mirrors the content of the additional VHD attached volume from the source virtual machine to the additional VHD attached volume of the target virtual machine. SIOS DataKeeper abstracts the source and target local volumes, and then presents them to Windows Server Failover Clustering as one shared disk.

Get more information about [SIOS DataKeeper](http://us.sios.com/products/datakeeper-cluster/).

 ![Figure 3: Windows Server Failover Clustering configuration in Azure by using SIOS DataKeeper][sap-ha-guide-figure-1002]

_**Figure 3:** Windows Server Failover Clustering configuration in Azure with SIOS DataKeeper_

> [AZURE.NOTE] You don't need shared disks for high availability with some DBMS products, like SQL Server. SQL Server Always On replicates DBMS data and log files from the local disk of one cluster node to the local disk of another cluster node. In this case, the Windows cluster configuration doesn't need a shared disk.

### <a name="44641e18-a94e-431f-95ff-303ab65e0bcb"></a> Name resolution in Azure

 The Azure cloud platform doesn't offer the option to configure virtual IP addresses, such as floating IPs. Because of this, you need an alternative solution to set up a virtual IP address to reach the cluster resource in the cloud.
Azure has an internal load balancer in the Azure Load Balancer service. With the internal load balancer, clients reach the cluster over the cluster virtual IP address.
You need to deploy the internal load balancer in the resource group that contains the cluster nodes. Then, configure all necessary port forwarding rules with the probe ports of the internal load balancer.
The clients can connect via the virtual host name. The DNS server resolves the cluster IP address, and the internal load balancer handles port forwarding to the active node of the cluster.

## <a name="2e3fec50-241e-441b-8708-0b1864f66dfa"></a> High-availability SAP NetWeaver in Azure infrastructure-as-a-service (IaaS)

To achieve SAP application high availability, such as for SAP software components, you need to protect the following components. This is discussed in more detail in [SAP NetWeaver on Windows virtual machines (VMs) – Planning and Implementation Guide][planning-guide-11].

- SAP application servers
- SAP ASCS/SCS instance
- DBMS server

### <a name="93faa747-907e-440a-b00a-1ae0a89b1c0e"></a> High-availability SAP application servers

You usually don't need a specific high-availability solution for the SAP application servers and dialog instances. You achieve high availability by redundancy, and you'll configure multiple dialog instances in different instances of Azure Virtual Machines. You should have at least two SAP application instances installed in two instances of Azure Virtual Machines.

![Figure 4: High-availability SAP application servers][sap-ha-guide-figure-2000]

_**Figure 4:** High-availability SAP application servers_

You must place all virtual machines that host SAP application servers in the same Azure availability set. An Azure availability set ensures that:

- All virtual machines are part of the same upgrade domain. An upgrade domain, for example, makes sure that the virtual machines aren't updated at the same time during planned maintenance downtime.
- All virtual machines are part of the same fault domain. A fault domain, for example, makes sure that virtual machines are deployed so that no single point of failure affects the availability of all virtual machines.

Learn about how to [manage the availability of virtual machines][virtual-machines-manage-availability].

Because the Azure storage account is a potential single point of failure, it's important to have at least two Azure storage accounts, in which at least two virtual machines are distributed. In an ideal setup, each virtual machine that is running an SAP dialog instance would be deployed in a different storage account.

### <a name="f559c285-ee68-4eec-add1-f60fe7b978db"></a> High-availability SAP ASCS/SCS instance

![Figure 5: High-availability SAP ASCS/SCS instance][sap-ha-guide-figure-2001]

_**Figure 5:** High-availability SAP ASCS/SCS instance_


#### <a name="b5b1fd0b-1db4-4d49-9162-de07a0132a51"></a> High-availability SAP ASCS/SCS instance with Windows Server Failover Clustering in Azure

Compared to bare metal or private cloud deployments, Azure Virtual Machines requires additional steps to configure Windows Server Failover Clustering. To build a Windows failover cluster, you need a shared cluster disk, several IP addresses, several virtual host names, and an Azure internal load balancer for clustering an SAP ASCS/SCS instance.

We discuss this in more detail later in the article.

![Figure 6: Windows Server Failover Clustering for an SAP ASCS/SCS configuration in Azure by using SIOS DataKeeper][sap-ha-guide-figure-1002]

_**Figure 6:** Windows Server Failover Clustering for an SAP ASCS/SCS configuration in Azure with SIOS DataKeeper_


### <a name="ddd878a0-9c2f-4b8e-8968-26ce60be1027"></a> High-availability DBMS instance

The DBMS also is a single point of contact of an SAP system. You need to protect it by using a high-availability solution. Figure 7 shows an example of a SQL Server Always On high-availability solution in Azure by using Windows Server Failover Clustering and the Azure internal load balancer. SQL Server Always On replicates DBMS data and log files by using its own DBMS replication. In this case, you don't need cluster shared disks, which simplifies the entire setting.

![Figure 7: Example of a high-availability SAP DBMS: SQL Server Always On][sap-ha-guide-figure-2003]

_**Figure 7:** Example of a high-availability SAP DBMS: SQL Server Always On_


For more information about clustering SQL Server in Azure by using the Azure Resource Manager deployment model, see these articles:

- [Configure Always On availability group in Azure Virtual Machines manually by using Resource Manager][virtual-machines-windows-portal-sql-alwayson-availability-groups-manual]
- [Configure an internal load balancer for an Always On availability group in Azure][virtual-machines-windows-portal-sql-alwayson-int-listener]

### <a name="045252ed-0277-4fc8-8f46-c5a29694a816"></a> End-to-end high-availability deployment scenarios

Figure 8 shows an example of an SAP NetWeaver high-availability architecture in Azure. In this scenario, we use one dedicated cluster for the SAP ASCS/SCS instance and another one for the DBMS.

![Figure 8: SAP HA Architectural Template 1, with a dedicated cluster for ASCS/SCS, and a dedicated cluster for the DBMS instance][sap-ha-guide-figure-2004]

_**Figure 8:** SAP HA Architectural Template 1: Dedicated clusters for ASCS/SCS and DBMS_

## <a name="78092dbe-165b-454c-92f5-4972bdbef9bf"></a> Prepare the infrastructure

Azure Resource Manager templates for SAP help simplify deployment of required resources.

The three-tier templates also support high-availability scenarios, like Architectural Template 1, which has two clusters. Each cluster is an SAP single point of failure for SAP ASCS/SCS and DBMS.

Here's where you can get Azure Resource Manager templates for Scenario 1:

- [Azure Marketplace image](https://github.com/Azure/azure-quickstart-templates/tree/master/sap-3-tier-marketplace-image)  
- [Custom image](https://github.com/Azure/azure-quickstart-templates/tree/master/sap-3-tier-user-image)

When you select the SAP three-tier Marketplace image, this screen is shown in the Azure portal:

![Figure 9: Specify SAP high-availability Azure Resource Manager parameters][sap-ha-guide-figure-3000]

_**Figure 9:** Specify SAP high-availability Azure Resource Manager parameters_


In **SYSTEMAVAILABILITY**, select **HA**.

The templates create:

- **Virtual machines**:
    - SAP Application Server virtual machines: <*SAPSystemSID*>-di-<*Number*>
    - ASCS/SCS cluster virtual machines: <*SAPSystemSID*>-ascs-<*Number*>
    - A DBMS cluster: <*SAPSystemSID*>-db-<*Number*>
- **Network cards for all virtual machines, with associated IP addresses**:
    - <*SAPSystemSID*>-nic-di-<*Number*>
    - <*SAPSystemSID*>-nic-ascs-<*Number*>
    - <*SAPSystemSID*>-nic-db-<*Number*>
- **Azure storage accounts**
- **Availability groups** for:
    - SAP Application Server virtual machines: <*SAPSystemSID*>-avset-di
    - SAP ASCS/SCS cluster virtual machines: <*SAPSystemSID*>-avset-ascs
    - DBMS cluster virtual machines: <*SAPSystemSID*>-avset-db
- **Azure internal load balancer**:
  - With all ports for the ASCS/SCS instance and IP address <*SAPSystemSID*>-lb-ascs
  - With all ports for the SQL Server DBMS and IP address <*SAPSystemSID*>-lb-db
- **Network security group**: <*SAPSystemSID*>-nsg-ascs-0  
    - With an open external Remote Desktop Protocol (RDP) port to the <*SAPSystemSID*>-ascs-0 virtual machine


> [AZURE.NOTE] All IP addresses of the network cards and Azure internal load balancers are **dynamic** by default. Change them to **static** IP addresses. We describe this later in the article.


### <a name="c87a8d3f-b1dc-4d2f-b23c-da4b72977489"></a> Deploy virtual machines with corporate network connectivity (cross-premises) to use in production

For production SAP systems, deploy Azure virtual machines with [corporate network connectivity (cross-premises)][planning-guide-2.2] by using Azure Site-to-Site VPN or Azure ExpressRoute.

> [AZURE.NOTE] You can use your Azure Virtual Network instance. The virtual network and subnet already have been created and prepared.

In **NEWOREXISTINGSUBNET**, select **existing**.

In **SUBNETID**, add the full string of your prepared Azure network SubnetID, where you plan to deploy your Azure virtual machines.

Run this PowerShell command to get a list of all Azure network subnets:

```powershell
(Get-AzureRmVirtualNetwork -Name <azureVnetName>  -ResourceGroupName <ResourceGroupOfVNET>).Subnets
```

The **ID** field shows the **SUBNETID**.

You can retrieve a list of all **SUBNETID** values by using this PowerShell command:

```PowerShell
(Get-AzureRmVirtualNetwork -Name <azureVnetName>  -ResourceGroupName <ResourceGroupOfVNET>).Subnets.Id
```

The **SUBNETID** looks like this:

```
/subscriptions/<SubscriptionId>/resourceGroups/<VPNName>/providers/Microsoft.Network/virtualNetworks/azureVnet/subnets/<SubnetName>
```

### <a name="7fe9af0e-3cce-495b-a5ec-dcb4d8e0a310"></a> Cloud-only deployment of SAP instances for test and demo

You also can deploy your high-availability SAP system in a cloud-only deployment model.

This kind of deployment primarily is useful for demo or test use cases. It's not suited for production use cases.

In **NEWOREXISTINGSUBNET**, select **new**. Leave the **SUBNETID** field empty.

The SAP Azure Resource Manager template automatically creates the Azure virtual network and subnet.

> [AZURE.NOTE] You also need to deploy at least one dedicated virtual machine for Active Directory and DNS in the same Azure Virtual Network instance. The template doesn't create these virtual machines.

### <a name="47d5300a-a830-41d4-83dd-1a0d1ffdbe6a"></a> Azure Virtual Network

In our example, the address space of the Azure virtual network is 10.0.0.0/16. There is one subnet called **Subnet**, with an address range of 10.0.0.0/24. All virtual machines and internal load balancers are deployed in this virtual network.

> [AZURE.NOTE] Don't make any changes to the network settings inside the guest operating system. This includes IP addresses, DNS servers, and subnet. Configure all your network settings in Azure. The Dynamic Host Configuration Protocol (DHCP) service propagates your settings.

### <a name="b22d7b3b-4343-40ff-a319-097e13f62f9e"></a> DNS IP addresses

Make sure that your virtual network **DNS Servers** option is set to **Custom DNS**.
Then, select your settings based on the type of network you have:

- [Corporate network connectivity (cross-premises)][planning-guide-2.2]: Add the IP addresses of the on-premises DNS servers.  

    You can extend on-premises DNS servers to the virtual machines that are running in Azure. In that scenario, you can add the IP addresses of the Azure virtual machines on which you run the DNS service.

-	[Cloud-only deployment][planning-guide-2.1]: Deploy an additional virtual machine in the same Virtual Network instance that serves as a DNS server. Add the IP addresses of the Azure virtual machines that you've set up to run DNS service.


![Figure 10: Configure DNS servers for Azure Virtual Network][sap-ha-guide-figure-3001]

_**Figure 10:** Configure DNS servers for Azure Virtual Network_

> [AZURE.NOTE] If you change the IP addresses of the DNS servers, you need to restart the Azure virtual machines to apply the change and propagate the new DNS servers.

In our example, the DNS service is installed and configured on these Windows virtual machines:

| Virtual machine role        | Virtual machine host name | Network card name  | Static IP address  
| ---------------|-------------|--------------------|-------------------
| First DNS server | domcontr-0  | pr1-nic-domcontr-0 | 10.0.0.10         
| Second DNS server | domcontr-1  | pr1-nic-domcontr-1 | 10.0.0.11         


### <a name="9fbd43c0-5850-4965-9726-2a921d85d73f"></a> Host names and static IP addresses for the SAP ASCS/SCS clustered instance and DBMS clustered instance

For on-premises deployment, you need these reserved host names and IP addresses:

| Virtual host name role                                                       | Virtual host name | Virtual static IP address
| ----------------------------------------------------------------------------|------------------|---------------------------
| SAP ASCS/SCS first cluster virtual host name (for cluster management) | pr1-ascs-vir     | 10.0.0.42                 
| SAP ASCS/SCS instance virtual host name                                  | pr1-ascs-sap     | 10.0.0.43             
| SAP DBMS second cluster virtual host name (cluster management)     | pr1-dbms-vir     | 10.0.0.32                 

When you create the cluster, create the virtual host names **pr1-ascs-vir** and **pr1-dbms-vir** and the associated IP addresses that manage the cluster itself. The process is described in [Collect Cluster Nodes in Cluster Configuration][sap-ha-guide-8.12.1].

You can manually create the other two virtual host names, **pr1-ascs-sap** and **pr1-dbms-sap**, and the associated IP addresses, on the DNS server. The clustered SAP ASCS/SCS instance and the clustered DBMS instance use these resources. This is described in [Create a virtual host name for clustered SAP ASCS/SCS][sap-ha-guide-9.1.1].

### <a name="84c019fe-8c58-4dac-9e54-173efd4b2c30"></a> Set static IP addresses for the SAP virtual machines

After you deploy the virtual machines to use in your cluster, you need to set static IP addresses for all virtual machines. Do this in Azure Virtual Network configuration, and not in the guest operating system.

One way to set a static IP address is by using the Azure portal. In the Azure portal go to **Resource Group** > **Network Card** > **Settings** > **IP Address**.

Under **Assignment**, select **Static**. In the **IP address** field, enter the IP address that you want to use.

> [AZURE.NOTE] If you change the IP address of the network card, you need to restart the Azure virtual machines to apply the change.  


![Figure 11: Set static IP addresses for the network card of each virtual machine][sap-ha-guide-figure-3002]

_**Figure 11:** Set static IP addresses for the network card of each virtual machine_

Repeat this step for all network interfaces, that is, for all virtual machines, including virtual machines that you want to use for your Active Directory/DNS service.

In our example, we have these virtual machines and static IP addresses:

| Virtual machine role                                 | Virtual machine host name  | Network card name  | Static IP address  
| ----------------------------------------|--------------|--------------------|-------------------
| First SAP application server              | pr1-di-0     | pr1-nic-di-0       | 10.0.0.50         
| Second SAP application server              | pr1-di-1     | pr1-nic-di-1       | 10.0.0.51         
| ...                                     | ...          | ...                | ...               
| Last SAP application server             | pr1-di-5     | pr1-nic-di-5       | 10.0.0.55         
| First cluster node for ASCS/SCS instance  | pr1-ascs-0   | pr1-nic-ascs-0     | 10.0.0.40         
| Second cluster node for ASCS/SCS instance  | pr1-ascs-1   | pr1-nic-ascs-1     | 10.0.0.41         
| First cluster node for DBMS instance      | pr1-db-0     | pr1-nic-db-0       | 10.0.0.30         
| Second cluster node for DBMS instance      | pr1-db-1     | pr1-nic-db-1       | 10.0.0.31         

### <a name="7a8f3e9b-0624-4051-9e41-b73fff816a9e"></a> Set a static IP address for the internal load balancer

The SAP Azure Resource Manager template creates an Azure internal load balancer that is used for the SAP ASCS/SCS instance cluster and the DBMS cluster.

The initial deployment sets the internal load balancer IP address to **Dynamic**. It's important to change the IP address to **Static**.

In our example, we have two Azure internal load balancers that have these static IP addresses:

| Azure internal load balancer role             | Azure internal load balancer name | Static IP address
| ---------------------------|----------------|-------------------
| SAP ASCS/SCS instance internal load balancer  | pr1-lb-ascs    | 10.0.0.43         
| SAP DBMS internal load balancer               | pr1-lb-dbms    | 10.0.0.33         


> [AZURE.NOTE] The IP address of the virtual host name of the SAP ASCS/SCS is the same as the IP address of the SAP ASCS/SCS internal load balancer pr1-lb-ascs.
The IP address of the virtual name of the DBMS is the same as the IP address of the DBMS internal load balancer pr1-lb-dbms.

In our example, we set the IP address of the internal load balancer **pr1-lb-ascs** to the IP address of the virtual host name of the SAP ASCS/SCS instance (in our example, **10.0.0.43**).

![Figure 12: Set static IP addresses for the internal load balancer for the SAP ASCS/SCS instance][sap-ha-guide-figure-3003]

_**Figure 12:** Set static IP addresses for the internal load balancer for the SAP ASCS/SCS instance_

Set the IP address of the internal load balancer **pr1-lb-dbms** to the IP address of the virtual host name of the DBMS instance (in our example, **10.0.0.33**).

### <a name="f19bd997-154d-4583-a46e-7f5a69d0153c"></a> Default ASCS/SCS load balancing rules for the Azure internal load balancer

The SAP Azure Resource Manager template creates the ports you need:

- An ABAP ASCS instance, with the default instance number **00**
- A Java SCS instance, with the default instance number **01**

When you install your SAP ASCS/SCS instance, you must use the default instance number 00 for your ABAP ASCS instance and the default instance number 01 for your Java SCS instance.

Next, create these required internal load balancing endpoints for the SAP NetWeaver ABAP ASCS ports:

| Service/load balancing rule name           | Default port numbers | Concrete ports for (ASCS instance with instance number 00) (ERS with 10)  
| ---------------------------------------------|-----------------------|--------------------------------------------------------------------------
| Enqueue Server / _lbrule3200_                | 32<*InstanceNumber*>  | 3200                                                                     
| ABAP Message Server / _lbrule3600_           | 36<*InstanceNumber*>  | 3600                                                                     
| Internal ABAP Message / _lbrule3900_         | 39<*InstanceNumber*>  | 3900                                                                     
| Message Server HTTP / _Lbrule8100_           | 81<*InstanceNumber*>  | 8100                                                                     
| SAP Start Service ASCS HTTP / _Lbrule50013_  | 5<*InstanceNumber*>13 | 50013                                                                    
| SAP Start Service ASCS HTTPS / _Lbrule50014_ | 5<*InstanceNumber*>14 | 50014                                                                    
| Enqueue Replication / _Lbrule50016_          | 5<*InstanceNumber*>16 | 50016                                                                    
| SAP Start Service ERS HTTP _Lbrule51013_     | 5<*InstanceNumber*>13 | 51013                                                                    
| SAP Start Service ERS HTTP _Lbrule51014_     | 5<*InstanceNumber*>14 | 51014                                                                    
| Win RM _Lbrule5985_                          |                       | 5985                                                                     
| File Share _Lbrule445_                       |                       | 445                                                                      

_**Table 1:** Port numbers of the SAP NetWeaver ABAP ASCS instances_


Then, create these required internal load balancing endpoints for the SAP NetWeaver Java SCS ports:

| Service/load balancing rule name           | Default port numbers | Concrete ports for (SCS instance with instance number 01) (ERS with 11)  
| ---------------------------------------------|-----------------------|--------------------------------------------------------------------------
| Enqueue Server / _lbrule3201_                | 32<*InstanceNumber*>  | 3201                                                                     
| Gateway Server / _lbrule3301_                | 33<*InstanceNumber*>  | 3301                                                                     
| Java Message Server / _lbrule3900_           | 39<*InstanceNumber*>  | 3901                                                                     
| Message Server HTTP / _Lbrule8101_           | 81<*InstanceNumber*>  | 8101                                                                     
| SAP Start Service SCS HTTP / _Lbrule50113_   | 5<*InstanceNumber*>13 | 50113                                                                    
| SAP Start Service SCS HTTPS / _Lbrule50114_  | 5<*InstanceNumber*>14 | 50114                                                                    
| Enqueue Replication / _Lbrule50116_          | 5<*InstanceNumber*>16 | 50116                                                                    
| SAP Start Service ERS HTTP _Lbrule51113_     | 5<*InstanceNumber*>13 | 51113                                                                    
| SAP Start Service ERS HTTP _Lbrule51114_     | 5<*InstanceNumber*>14 | 51114                                                                    
| Win RM _Lbrule5985_                          |                       | 5985                                                                     
| File Share _Lbrule445_                       |                       | 445                                                                      

_**Table 2:** Port numbers of the SAP NetWeaver Java SCS instances_


![Figure 13: Default ASCS/SCS load balancing rules for the Azure internal load balancer][sap-ha-guide-figure-3004]

_**Figure 13:** Default ASCS/SCS load balancing rules for the Azure internal load balancer_

Set the IP address of the load balancer **pr1-lb-dbms** to the IP address of the virtual host name of the DBMS instance (in our example, **10.0.0.33**).

### <a name="fe0bd8b5-2b43-45e3-8295-80bee5415716"></a> Change the ASCS/SCS default load balancing rules for the Azure internal load balancer

If you want to use different numbers for the SAP ASCS or SCS instances, you must update the names and values of those ports.

One way to update instance numbers is by using the Azure portal:

Go to **<*SID*>-lb-ascs load balancer** > **Load Balancing Rules**.

For all load balancing rules that belong to the SAP ASCS or SCS instance, change these values:

- Name
- Port
- Back-end port

For example, if you want to change the default ASCS instance number from 00 to 31, you need to make the changes for all ports listed in Table 1.

Here's an example of an update for port _lbrule3200_.

![Figure 14: Change the ASCS/SCS default load balancing rules for the Azure internal load balancer][sap-ha-guide-figure-3005]

_**Figure 14:** Change the ASCS/SCS default load balancing rules for the Azure internal load balancer_

### <a name="e69e9a34-4601-47a3-a41c-d2e11c626c0c"></a> Add Windows virtual machines to the domain

After you assign a static IP address to the virtual machines, add the virtual machines to the domain.

![Figure 15: Add a virtual machine to a domain][sap-ha-guide-figure-3006]

_**Figure 15:** Add a virtual machine to a domain_

### <a name="661035b2-4d0f-4d31-86f8-dc0a50d78158"></a> Add registry entries on both cluster nodes of the SAP ASCS/SCS instance

Azure Load Balancer has an internal load balancer that closes connections when the connections are idle for a set period of time (an idle timeout). SAP work processes in dialog instances open connections to the SAP enqueue process as soon as the first enqueue/dequeue request needs to be sent. These connections usually remain established until the work process or the enqueue process restarts. However, if the connection is idle for a period of time, the Azure internal load balancer closes the connections. This isn't a problem because the SAP work process reestablishes the connection to the enqueue process if it no longer exists. These activities are documented in the developer traces of SAP processes, but they create a large amount of extra content in those traces. It's a good idea to change the TCP/IP `KeepAliveTime` and `KeepAliveInterval` on both cluster nodes. Combine these changes in the TCP/IP parameters with SAP profile parameters, described later in the article.

Add these Windows registry entries on both Windows cluster nodes for SAP ASCS/SCS:

| Path                  | HKLM\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters   
| ----------------------|-----------------------------------------------------------
| Variable name         | `KeepAliveTime`                                              
| Variable type         | REG_DWORD (Decimal)                                        
| Value                 | 120000                                                     
| Link to documentation | [https://technet.microsoft.com/en-us/library/cc957549.aspx](https://technet.microsoft.com/en-us/library/cc957549.aspx)


_**Table 3:** Change the first TCP/IP parameter_


| Path                  | HKLM\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters   
| ----------------------|-----------------------------------------------------------
| Variable name         | `KeepAliveInterval`                                          
| Variable type         | REG_DWORD (Decimal)                                        
| Value                 | 120000                                                     
| Link to documentation | [https://technet.microsoft.com/en-us/library/cc957548.aspx](https://technet.microsoft.com/en-us/library/cc957548.aspx)


_**Table 4:** Change the second TCP/IP parameter_

To apply the changes, restart both cluster nodes.

### <a name="0d67f090-7928-43e0-8772-5ccbf8f59aab"></a> Set up a Windows Server Failover Clustering cluster for an SAP ASCS/SCS instance

#### <a name="5eecb071-c703-4ccc-ba6d-fe9c6ded9d79"></a> Collect the cluster nodes in a cluster configuration

The first step is to add failover clustering to both cluster nodes. Use the Add Role and Features Wizard.

The second step is to set up the failover cluster by using Failover Cluster Manager.

In Failover Cluster Manager, select **Create Cluster**, and then add only the name of the first cluster node A. For example, add **pr1-ascs-0**. Do not add the second node yet. You'll add the second node in a later step.

![Figure 16: Add the server or virtual machine name of the first cluster node][sap-ha-guide-figure-3007]

_**Figure 16:** Add the server or virtual machine name of the first cluster node_

Next, you're prompted for the network name (virtual host name) of the cluster.

![Figure 17: Define the cluster name][sap-ha-guide-figure-3008]

_**Figure 17:** Define the cluster name_


After you've created the cluster, run a cluster validation test.

![Figure 18: Run the cluster validation check][sap-ha-guide-figure-3009]

_**Figure 18:** Run the cluster validation check_

![Figure 19: No quorum disk is found][sap-ha-guide-figure-3010]

_**Figure 19:** No quorum disk is found_

You can ignore any warnings about disks at this point in the process. You'll add a file share witness and the SIOS shared disks later. At this stage, you don't need to worry about having a quorum.

![Figure 20: Core cluster resource needs a new IP address][sap-ha-guide-figure-3011]

_**Figure 20:** Core cluster resource needs a new IP address_

The cluster can't start because the IP address of the server points to one of the virtual machine nodes. You need to change the IP address of the core cluster service.

For example, we need to assign an IP address (in our example, **10.0.0.42**) for the cluster virtual host name **pr1-ascs-vir**. Do this on the property page of the core cluster service's IP resource, shown in Figure 21.

![Figure 21: In the **Properties** dialog box, change the IP address][sap-ha-guide-figure-3012]

_**Figure 21:** In the **Properties** dialog box, change the IP address_

![Figure 22: Assign the IP address that is reserved for the cluster][sap-ha-guide-figure-3013]

_**Figure 22:** Assign the IP address that is reserved for the cluster_

After you change the IP address, bring the cluster virtual host name online.

![Figure 23: Cluster core service is up and running, and with the correct IP address][sap-ha-guide-figure-3014]

_**Figure 23:** Cluster core service is up and running, and with the correct IP address_

Now that the core cluster service is up and running, you can add the second cluster node.

![Figure 24: Add the second cluster node][sap-ha-guide-figure-3015]

_**Figure 24:** Add the second cluster node_

![Figure 25: Add the second cluster node host name, for example, pr1-ascs-1][sap-ha-guide-figure-3016]

_**Figure 25:** Add the second cluster node host name, for example, **pr1-ascs-1**_

![Figure 26: Do not select the check box][sap-ha-guide-figure-3017]

_**Figure 26:** Do *not* select the check box_

> [AZURE.IMPORTANT] Be sure that the **Add all eligible storage to the cluster** check box is *not* selected.  

![Figure 27: Ignore warnings about the disk quorum][sap-ha-guide-figure-3018]

_**Figure 27:** Ignore warnings about the disk quorum_

You can ignore warnings about quorum and disks. You'll set the quorum and share the disk later, as described in [Installing SIOS DataKeeper Cluster Edition for SAP ASCS/SCS cluster share disk][sap-ha-guide-8.12.3].

#### <a name="e49a4529-50c9-4dcf-bde7-15a0c21d21ca"></a> Configure a cluster file share witness

##### <a name="06260b30-d697-4c4d-b1c9-d22c0bd64855"></a> Create a file share

Select a file share witness instead of a quorum disk. SIOS DataKeeper supports this option.

In the examples in this article, the file share witness is on the Active Directory/DNS server that is running in Azure. The file share witness is called **domcontr-0**. Because you would have configured a virtual private network (VPN) connection to Azure (via Site-to-Site VPN or Azure ExpressRoute), your Active Directory/DNS service is on-premises and isn't suitable to run a file share witness.

> [AZURE.NOTE] If your Active Directory/DNS service runs only on-premises, don't configure your file share witness on the Active Directory/DNS Windows operating system that is running on-premises. Network latency between cluster nodes running in Azure and Active Directory/DNS on-premises might be too large and cause connectivity issues. Be sure to configure the file share witness on an Azure virtual machine that is running close to the cluster node.  

The quorum drive needs at least 1,024 MB of free space. We recommend 2,048 MB of free space.

The first step is to add the cluster name object.

![Figure 28: Assign the permissions on the share for the cluster name object][sap-ha-guide-figure-3019]

_**Figure 28:** Assign the permissions on the share for the cluster name object_

Be sure that the permissions include the authority to change data in the share for the cluster name object (in our example, **pr1-ascs-vir$**). To add the cluster name object to the list, select **Add**. Change the filter to check for computer objects, in addition to those shown in Figure 29:

![Figure 29: Change the object type to include computer objects][sap-ha-guide-figure-3020]

_**Figure 29:** Change the object type to include computer objects_

![Figure 30: Select the check box for computer objects][sap-ha-guide-figure-3021]

_**Figure 30:** Select the check box for computer objects_

Then, enter the cluster name object as shown in Figure 29. Because the record has already been created, you can change the permissions, as shown in Figure 28.

Next, select the **Security** tab of the share, and then set more detailed permissions for the cluster name object.

![Figure 31: Set the security attributes for the cluster name object on the file share quorum][sap-ha-guide-figure-3022]

_**Figure 31:** Set the security attributes for the cluster name object on the file share quorum_

##### <a name="4c08c387-78a0-46b1-9d27-b497b08cac3d"></a> Set the file share witness quorum in Failover Cluster Manager

In Failover Cluster Manager, change the cluster configuration to a file share witness.

![Figure 32: Start the Configure Cluster Quorum Setting Wizard][sap-ha-guide-figure-3023]

_**Figure 32:** Start the Configure Cluster Quorum Setting Wizard_

![Figure 33: Quorum configurations you can choose from][sap-ha-guide-figure-3024]

_**Figure 33:** Quorum configurations you can choose from_

Select **Select the quorum witness**.

![Figure 34: Select the file share witness][sap-ha-guide-figure-3025]

_**Figure 34:** Select the file share witness_

Select **Configure a file share witness**.

![Figure 35: Define the file share location for the witness share][sap-ha-guide-figure-3026]

_**Figure 35:** Define the file share location for the witness share_

Enter the UNC path to the file share (in our example, \\domcontr-0\FSW).

Select **Next** to see a list of the changes you can make. Select the changes you want, and then select **Next**.

![Figure 36: Confirmation that you've reconfigures the cluster][sap-ha-guide-figure-3027]

_**Figure 36:** Confirmation that you've reconfigures the cluster_

In this last step, you need to successfully reconfigure the cluster configuration, as shown in Figure 36.  

### <a name="5c8e5482-841e-45e1-a89d-a05c0907c868"></a> Install SIOS DataKeeper Cluster Edition for the SAP ASCS/SCS cluster share disk

Now you have a working Windows Server Failover Clustering configuration in Azure. But, to install an SAP ASCS/SCS instance, you need a shared disk resource. You can't create the shared disk resources you need in Azure. SIOS DataKeeper Cluster Edition is a third-party solution you can use to create shared disk resources.

#### <a name="1c2788c3-3648-4e82-9e0d-e058e475e2a3"></a> Add the .NET Framework 3.5

The Microsoft .NET Framework 3.5 isn't automatically activated or installed on Windows Server 2012 R2. But SIOS DataKeeper requires the .NET Framework to be on all nodes that you install DataKeeper on. Because of this, you must install the .NET Framework 3.5 on the guest operating system of all virtual machines in the cluster.

There are two ways to add the .NET Framework 3.5. One way is to use the Add Roles and Features Wizard in Windows, shown in Figure 37.

![Figure 37: Install the .NET Framework 3.5 by using the Add Roles and Features Wizard][sap-ha-guide-figure-3028]

_**Figure 37:** Install the .NET Framework 3.5 by using the Add Roles and Features Wizard_

![Figure 38: Installation progress bar when you install the .NET Framework 3.5 by using the Add Roles and Features Wizard][sap-ha-guide-figure-3029]

_**Figure 38:** Installation progress bar when you install the .NET Framework 3.5 through the Add Roles and Features Wizard_

The second option to activate the .NET Framework 3.5 feature is by using the command-line tool dism.exe. For this type of installation, you need to access the SxS directory on the Windows installation media. Run this command at an elevated command prompt:

```
Dism /online /enable-feature /featurename:NetFx3 /All /Source:installation_media_drive:\sources\sxs /LimitAccess
```

#### <a name="dd41d5a2-8083-415b-9878-839652812102"></a> Install SIOS DataKeeper

Install SIOS DataKeeper Cluster Edition on each node in the cluster. With SIOS DataKeeper, to create virtual shared storage, create a synced mirror and then simulate cluster shared storage.

Before you install the SIOS software, create the domain user **DataKeeperSvc**.

> [AZURE.NOTE] Add the **DataKeeperSvc** user to the **Local Administrator** group on both cluster nodes.

Install the SIOS software on both cluster nodes.

![SIOS installer][sap-ha-guide-figure-3030]

![Figure 39: First screen of the SIOS DataKeeper installation][sap-ha-guide-figure-3031]

_**Figure 39:** First screen of the SIOS DataKeeper installation_

![Figure 40: DataKeeper informs you that a service will be disabled][sap-ha-guide-figure-3032]

_**Figure 40:** DataKeeper informs you that a service will be disabled_

In the dialog box shown in Figure 40, select **Yes**.

![Figure 41: User selection for SIOS DataKeeper][sap-ha-guide-figure-3033]

_**Figure 41:** User selection for SIOS DataKeeper_


On the screen shown in Figure 41, we recommend that you select **Domain or Server account**.

![Figure 42: Enter the domain user name and password for the SIOS DataKeeper installation][sap-ha-guide-figure-3034]

_**Figure 42:** Enter the domain user name and password for the SIOS DataKeeper installation_

Enter the domain account user name and passwords that you created for SIOS DataKeeper.

![Figure 43: Enter your SIOS DataKeeper license][sap-ha-guide-figure-3035]

_**Figure 43:** Enter your SIOS DataKeeper license_

Install the license key for your SIOS DataKeeper instance as shown in Figure 43. At the end of the installation, you'll be asked to restart the virtual machine.

#### <a name="d9c1fc8e-8710-4dff-bec2-1f535db7b006"></a> Set up SIOS DataKeeper

After you install SIOS DataKeeper on both nodes, you need to start the configuration. The goal of the configuration is to have synchronous data replication between the additional VHDs attached to each of the virtual machines. These are the steps you take to configure both nodes.

![Figure 44: SIOS DataKeeper Management and Configuration tool][sap-ha-guide-figure-3036]

_**Figure 44:** SIOS DataKeeper Management and Configuration tool_

Start the DataKeeper Management and Configuration tool, and then select **Connect Server**. (In Figure 44, this option is circled in red.)

![Figure 45: Insert the name or TCP/IP address of the first node the Management and Configuration tool should connect to, and in a second step, the second node][sap-ha-guide-figure-3037]

_**Figure 45:** Insert the name or TCP/IP address of the first node the Management and Configuration tool should connect to, and in a second step, the second node_

The next step is to create the replication job between the two nodes.

![Figure 46: Create a replication job][sap-ha-guide-figure-3038]

_**Figure 46:** Create a replication job_

A wizard guides you through the process of creating a replication job.

![Figure 47: Define the name of the replication job][sap-ha-guide-figure-3039]

_**Figure 47:** Define the name of the replication job_

![Figure 48: Define the base data for the node, which should be the current source node][sap-ha-guide-figure-3040]

_**Figure 48:** Define the base data for the node, which should be the current source node_

In the first step, you need to define the name, the TCP/IP address, and the disk volume of the source node. The second step is to define the target node. As explained earlier, you need to define the name, TCP/IP address, and disk volume of the target node.

![Figure 49: Define the base data for the node, which should be the current target node][sap-ha-guide-figure-3041]

_**Figure 49:** Define the base data for the node, which should be the current target node_

Next, define the compression algorithms. In our example, we recommend that you compress the replication stream. Especially in resynchronization situations, the compression of the replication stream dramatically reduces resynchronization time. Note that compression uses the CPU and RAM resources of a virtual machine. As the compression rate increases, so does the volume of CPU resources used. You can adjust this setting later.

Another setting you need to check is whether the replication occurs asynchronously or synchronously. *When you protect SAP ASCS/SCS configurations, you must use synchronous replication*.  

![Figure 50: Define replication details][sap-ha-guide-figure-3042]

_**Figure 50:** Define replication details_

The final step is to define whether the volume that is replicated by the replication job should be represented to a Windows Server Failover Clustering cluster configuration as a shared disk. For the SAP ASCS/SCS configuration, select **Yes** so that the Windows cluster sees the replicated volume as a shared disk that it can use as a cluster volume.

![Figure 51: Select **Yes** to set the replicated volume as a cluster volume][sap-ha-guide-figure-3043]

_**Figure 51:** Select **Yes** to set the replicated volume as a cluster volume_

After the volume is created, the DataKeeper Management and Configuration tool shows that the replication job is active.

![Figure 52: DataKeeper synchronous mirroring for the SAP ASCS/SCS share disk is active][sap-ha-guide-figure-3044]

_**Figure 52:** DataKeeper synchronous mirroring for the SAP ASCS/SCS share disk is active_

Now, Failover Cluster Manager shows the disk as a DataKeeper disk, as shown in Figure 53.

![Figure 53: Failover Cluster Manager shows the disk that DataKeeper replicated][sap-ha-guide-figure-3045]

_**Figure 53:** Failover Cluster Manager shows the disk that DataKeeper replicated_


## <a name="a06f0b49-8a7a-42bf-8b0d-c12026c5746b"></a> Install the SAP NetWeaver system

We won’t describe the DBMS setup because setups vary depending on the DBMS system you use. However, we assume that high-availability concerns with the DBMS are addressed with the functionalities the different DBMS vendors support for Azure. For example, Always On or database mirroring for SQL Server, and Oracle Data Guard for Oracle. In the scenario we use in this article, we didn't add more protection to the DBMS.

There aren't any special considerations when different DBMS services interact with this kind of clustered SAP ASCS/SCS configuration in Azure.


> [AZURE.NOTE] The installation procedures of SAP NetWeaver ABAP systems, Java systems, and ABAP+Java systems are almost identical. The most significant difference is that an SAP ABAP system has one ASCS instance. The SAP Java system has one SCS instance. The SAP ABAP+Java system has one ASCS instance and one SCS instance running in the same Microsoft failover cluster group. Any installation differences for each SAP NetWeaver installation stack are explicitly mentioned. You can assume that all other parts are the same.  

### <a name="31c6bd4f-51df-4057-9fdf-3fcbc619c170"></a> Install SAP with a high-availability ASCS/SCS instance

> [AZURE.IMPORTANT] Be sure not to place your page file on DataKeeper mirrored volumes. DataKeeper does not support mirrored volumes. You can leave your page file on the temporary drive D of an Azure virtual machine, which is the default. If it's not already there, move the Windows page file to drive D of your Azure virtual machine.

#### <a name="a97ad604-9094-44fe-a364-f89cb39bf097"></a> Create a virtual host name for the clustered SAP ASCS/SCS instance

First, in the Windows DNS manager, create a DNS entry for the virtual host name of the ASCS/SCS instance. Then, define the IP address assigned to the virtual host name.

> [AZURE.NOTE]  
Remember that the IP address that you assign to the virtual host name of the ASCS/SCS instance must be the same as the IP address that you assigned to Azure Load Balancer (<*SID*>-lb-ascs).  

The IP address of the virtual SAP ASCS/SCS host name (pr1-ascs-sap) is the same as the IP address of Azure Load Balancer (pr1-lb-ascs).

Only one SAP failover cluster role can run in one Windows Server failover cluster in Azure. For example, this means one ASCS instance for the ABAP system and one SCS instance for the Java system. For ABAP+Java, it would be one ASCS instance and one SCS instance.

> [AZURE.NOTE] Currently, multi-SID clustering as described in the SAP installation guides (see [SAP installation guides][sap-installation-guides]) doesn't work in Azure.

![Figure 54: Define the DNS entry for the SAP ASCS/SCS cluster virtual name and TCP/IP address][sap-ha-guide-figure-3046]

_**Figure 54:** Define the DNS entry for the SAP ASCS/SCS cluster virtual name and TCP/IP address_

The entry is in DNS Manager, under the domain, as shown in Figure 55.

![Figure 55: New virtual name and TCP/IP address for SAP ASCS/SCS cluster configuration][sap-ha-guide-figure-3047]

_**Figure 55:** New virtual name and TCP/IP address for SAP ASCS/SCS cluster configuration_

#### <a name="eb5af918-b42f-4803-bb50-eff41f84b0b0"></a> Install the SAP first cluster node

To install the SAP first cluster, execute the first cluster node option on cluster node A. For example, on the **pr1-ascs-0** host.

If you want to keep the default ports for the Azure internal load balancer, select:

- **ABAP system**: **ASCS** instance number **00**
- **Java system**: **SCS** instance number **01**
- **ABAP + JAVA system**: **ASCS** instance number **00** and **SCS** instance number **01**

If you want to use instance numbers other than 00 for the ABAP ASCS instance and 01 for the Java SCS instance, first you need to change the Azure internal load balancer default load balancing rules as described in [Change the ASCS/SCS default load balancing rules for the Azure internal load balancer][sap-ha-guide-8.9].

Then, do a few steps that aren't described in the usual SAP installation documentation.

> [AZURE.NOTE] The SAP installation documentation describes how to install the first ASCS/SCS cluster node.

#### <a name="e4caaab2-e90f-4f2c-bc84-2cd2e12a9556"></a> Modify the SAP profile of the ASCS/SCS i```powershellnstance

You need to add a new profile parameter. The profile parameter prevents connections between SAP work processes and the enqueue server from closing when they are idle for too long. We mentioned the problem scenario in [Add registry entries on both cluster nodes of the SAP ASCS/SCS instance][sap-ha-guide-8.11] in this article. In that section, we also introduced two changes to some basic TCP/IP connection parameters. In a second step, you need to set the enqueue server to send a **keep_alive** signal so that the connections don't hit the Azure internal load balancer's idle threshold.

Add this profile parameter to the SAP ASCS/SCS instance profile:
```
enque/encni/set_so_keepalive = true
```
In our example, the path is:

`<ShareDisk>:\usr\sap\PR1\SYS\profile\PR1_ASCS00_pr1-ascs-sap`

For example, to the SAP SCS instance profile and corresponding path:

`<ShareDisk>:\usr\sap\PR1\SYS\profile\PR1_SCS01_pr1-ascs-sap`


#### <a name="10822f4f-32e7-4871-b63a-9b86c76ce761"></a> Add a probe port

Use the internal load balancer's probe functionality to make the entire cluster configuration work with Load Balancer. The Azure internal load balancer usually distributes the incoming workload equally between participating virtual machines. However, this won't work in some cluster configurations because only one instance is active. The other instance is passive and can’t accept any of the workload. A probe functionality helps when the Azure internal load balancer assigns work only to an active instance. With the probe functionality, the internal load balancer can detect which instances are active, and then target only the instance with the workload.

First, check the current **ProbePort** setting with this PowerShell command. Execute it within one of the virtual machines in the cluster configuration:

```PowerShell
Get-ClusterResource „SAP PR1 IP" | Get-ClusterParameter
```

![Figure 56: The cluster configuration probe port is 0 by default][sap-ha-guide-figure-3048]

_**Figure 56:** The cluster configuration probe port is 0 by default_

Then, define a probe port. The default probe port number is 0. In our example, we use probe port **62300**.

The port number is defined in SAP Azure Resource Manager templates. You can assign the port number in PowerShell.

First, get the SAP virtual host name cluster resource **SAP WAC IP**.

```PowerShell
$var = Get-ClusterResource | Where-Object {  $_.name -eq "SAP PR1 IP"  }
```

Then, set the probe port to **62300**.

```PowerShell
$var | Set-ClusterParameter -Multiple @{"Address"="10.0.0.43";"ProbePort"=62300;"Subnetmask"="255.255.255.0";"Network"="Cluster Network 1";"OverrideAddressMatch"=1;"EnableDhcp"=0}  
```

To activate the changes, stop and then start the **SAP PR1** cluster role.

After you bring the **SAP PR1** cluster role online, verify that **ProbePort** is set to the new value:

```PowerShell
Get-ClusterResource „SAP PR1 IP" | Get-ClusterParameter
```

![Figure 57: Probe the cluster port after you set the new value][sap-ha-guide-figure-3049]

_**Figure 57:** Probe the cluster port after you set the new value_

The **ProbePort** is set to **62300**. Now you can access the file share **\\\ascsha-clsap\sapmnt** from other hosts, like **ascsha-dbas**.

### <a name="85d78414-b21d-4097-92b6-34d8bcb724b7"></a> Install the database instance

To install the database instance, follow the process described in the SAP installation documentation.

### <a name="8a276e16-f507-4071-b829-cdc0a4d36748"></a> Install the second cluster node

To install the second cluster, follow the steps in the SAP installation guide.

### <a name="094bc895-31d4-4471-91cc-1513b64e406a"></a> Change the start type of the SAP ERS Windows service instance

Change the start type of the SAP Enqueue Replication Server (ERS) Windows service to **Automatic (Delayed Start)** on both cluster nodes.

![Figure 58: Change the service type for the SAP ERS instance to delayed automatic][sap-ha-guide-figure-3050]

_**Figure 58:** Change the service type for the SAP ERS instance to delayed automatic_

### <a name="2477e58f-c5a7-4a5d-9ae3-7b91022cafb5"></a> Install the SAP Primary Application Server

Install the Primary Application Server (PAS) instance <*SID*>-di-0 on the virtual machine that you've designated to host the PAS. There are no dependencies on Azure or DataKeeper specifics.

### <a name="0ba4a6c1-cc37-4bcf-a8dc-025de4263772"></a> Install the SAP Additional Application Server

Install an SAP Additional Application Server (AAS) on all the virtual machines that you've designated to host an SAP application server. For example, on <*SID*>-di-1 to <*SID*>-di-<n>.

## <a name="18aa2b9d-92d2-4c0e-8ddd-5acaabda99e9"></a> Test the SAP ASCS/SCS instance failover and SIOS replication

It's easy to test and monitor an SAP ASCS/SCS instance failover and SIOS disk replication by using Failover Cluster Manager and the SIOS DataKeeper UI.

### <a name="65fdef0f-9f94-41f9-b314-ea45bbfea445"></a> SAP ASCS/SCS instance is running on cluster node A

The **SAP WAC** cluster group is running on cluster node A. For example, on **ascsha-clna**. Assign the shared disk drive S, which is part of the **SAP WAC** cluster group, and which the ASCS/SCS instance uses, to cluster node A.

![Figure 59: Failover Cluster Manager: The SAP <*SID*> cluster group is running on cluster node A][sap-ha-guide-figure-5000]

_**Figure 59:** Failover Cluster Manager: The SAP <*SID*> cluster group is running on cluster node A_

By using the SIOS DataKeeper UI, you can see that the shared disk data is synchronously replicated from the source volume drive S on cluster node A to the target volume drive S on cluster node B. For example, from **ascsha-clna [10.0.0.41]** to **ascsha-clnb [10.0.0.42]**.

![Figure 60: In SIOS DataKeeper, replicate the local volume from cluster node A to cluster node B][sap-ha-guide-figure-5001]

_**Figure 60:** In SIOS DataKeeper, replicate the local volume from cluster node A to cluster node B_


### <a name="5e959fa9-8fcd-49e5-a12c-37f6ba07b916"></a> Failover from node A to node B

You can use one of these options to initiate a failover of the SAP <*SID*> cluster group from cluster node A to cluster node B:

- Use Failover Cluster Manager  
- Use Failover Cluster PowerShell
  ```powershell
  Move-ClusterGroup -Name "SAP WAC"
  ```
- Restart cluster node A within the Windows guest operating system (initiates an automatic failover of the SAP <*SID*> cluster group from node A to node B)  
- Restart cluster node A from the Azure portal (initiates an automatic failover of the SAP <*SID*> cluster group from node A to node B)  
- Restart cluster node A by using Azure PowerShell (initiates an automatic failover of the SAP <*SID*> cluster group from node A to node B)

  ```powershell
  Restart-AzureVM -Name ascsha-clna -ServiceName ascsha-cluster
  ```

After failover, the SAP <*SID*> cluster group is running on cluster node B. For example, on **ascsha-clnb**.

![Figure 61: In Failover Cluster Manager, the SAP <*SID*> cluster group is running on cluster node B][sap-ha-guide-figure-5002]

_**Figure 61**: In Failover Cluster Manager, the SAP <*SID*> cluster group is running on cluster node B_

Now the shared disk is mounted on cluster node B. SIOS DataKeeper is replicating data from source volume drive S on cluster node B to target volume drive S on cluster node A. For example, from **ascsha-clnb [10.0.0.42]** to **ascsha-clna [10.0.0.41]**.


![Figure 62: SIOS DataKeeper replicates the local volume from cluster node B to cluster node A][sap-ha-guide-figure-5003]

_**Figure 62:** SIOS DataKeeper replicates the local volume from cluster node B to cluster node A_
