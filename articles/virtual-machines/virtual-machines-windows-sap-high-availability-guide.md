<properties
   pageTitle="SAP NetWeaver on Windows virtual machines (VMs) – High Availability Guide | Microsoft Azure"
   description="SAP NetWeaver on Windows virtual machines (VMs) – High Availability Guide"
   services="virtual-machines-windows"
   documentationCenter=""
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

# SAP NetWeaver on Windows virtual machines (VMs) – High Availability Guide

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

[sap-ha-guide]:virtual-machines-windows-sap-high-availability-guide.md (SAP NetWeaver on Windows virtual machines (VMs) – High Availability Guide)
[sap-ha-guide-1]:virtual-machines-windows-sap-high-availability-guide.md#217c5479-5595-4cd8-870d-15ab00d4f84c (Prerequisites)
[sap-ha-guide-2]:virtual-machines-windows-sap-high-availability-guide.md#42b8f600-7ba3-4606-b8a5-53c4f026da08 (Resources)
[sap-ha-guide-3]:virtual-machines-windows-sap-high-availability-guide.md#42156640c6-01cf-45a9-b225-4baa678b24f1 (Differences in SAP HA Between Azure Resource Manager and Classical Deployment Model)
[sap-ha-guide-3.1]:virtual-machines-windows-sap-high-availability-guide.md#f76af273-1993-4d83-b12d-65deeae23686 (Resource Groups)
[sap-ha-guide-3.2]:virtual-machines-windows-sap-high-availability-guide.md#3e85fbe0-84b1-4892-87af-d9b65ff91860 (Clustering with Azure Resource Manager compared to Classical Deployment Model)
[sap-ha-guide-4]:virtual-machines-windows-sap-high-availability-guide.md#8ecf3ba0-67c0-4495-9c14-feec1a2255b7 (Windows Server Failover Clustering (WSFC))
[sap-ha-guide-4.1]:virtual-machines-windows-sap-high-availability-guide.md#1a3c5408-b168-46d6-99f5-4219ad1b1ff2 (Quorum Modes)
[sap-ha-guide-5]:virtual-machines-windows-sap-high-availability-guide.md#fdfee875-6e66-483a-a343-14bbaee33275 (Windows Failover Cluster on premises)
[sap-ha-guide-5.1]:virtual-machines-windows-sap-high-availability-guide.md#be21cf3e-fb01-402b-9955-54fbecf66592 (Shared Storage)
[sap-ha-guide-5.2]:virtual-machines-windows-sap-high-availability-guide.md#ff7a9a06-2bc5-4b20-860a-46cdb44669cd (Networking / Name Resolution)
[sap-ha-guide-6]:virtual-machines-windows-sap-high-availability-guide.md#2ddba413-a7f5-4e4e-9a51-87908879c10a (Windows Failover Cluster with Microsoft Azure)
[sap-ha-guide-6.1]:virtual-machines-windows-sap-high-availability-guide.md#1a464091-922b-48d7-9d08-7cecf757f341 (Shared Disk on Microsoft Azure with SIOS DataKeeper)
[sap-ha-guide-6.2]:virtual-machines-windows-sap-high-availability-guide.md#44641e18-a94e-431f-95ff-303ab65e0bcb (Name Resolution on Microsoft Azure)
[sap-ha-guide-7]:virtual-machines-windows-sap-high-availability-guide.md#2e3fec50-241e-441b-8708-0b1864f66dfa (SAP NetWeaver High Availability on Azure IaaS)
[sap-ha-guide-7.1]:virtual-machines-windows-sap-high-availability-guide.md#93faa747-907e-440a-b00a-1ae0a89b1c0e (High Availability for SAP Application Servers)
[sap-ha-guide-7.2]:virtual-machines-windows-sap-high-availability-guide.md#f559c285-ee68-4eec-add1-f60fe7b978db (High Availability for SAP (A)SCS Instances)
[sap-ha-guide-7.2.1]:virtual-machines-windows-sap-high-availability-guide.md#b5b1fd0b-1db4-4d49-9162-de07a0132a51 (High Availability for SAP (A)SCS Instance with Windows Failover Cluster in Azure)
[sap-ha-guide-7.3]:virtual-machines-windows-sap-high-availability-guide.md#ddd878a0-9c2f-4b8e-8968-26ce60be1027 (High Availability for DBMS Instance)
[sap-ha-guide-7.4]:virtual-machines-windows-sap-high-availability-guide.md#045252ed-0277-4fc8-8f46-c5a29694a816 (Possible End-To-End HA Deployment Scenarios)
[sap-ha-guide-8]:virtual-machines-windows-sap-high-availability-guide.md#78092dbe-165b-454c-92f5-4972bdbef9bf (Infrastructure Preparation)
[sap-ha-guide-8.1]:virtual-machines-windows-sap-high-availability-guide.md#c87a8d3f-b1dc-4d2f-b23c-da4b72977489 (Deploying VMs with Corporate Network Connectivity (Cross-Premises) for Productive Usage)
[sap-ha-guide-8.2]:virtual-machines-windows-sap-high-availability-guide.md#7fe9af0e-3cce-495b-a5ec-dcb4d8e0a310 (Cloud-Only deployment of SAP instances for Test/Demo)
[sap-ha-guide-8.3]:virtual-machines-windows-sap-high-availability-guide.md#47d5300a-a830-41d4-83dd-1a0d1ffdbe6a (Azure Virtual Network()
[sap-ha-guide-8.4]:virtual-machines-windows-sap-high-availability-guide.md#b22d7b3b-4343-40ff-a319-097e13f62f9e (DNS IP-Addresses)
[sap-ha-guide-8.5]:virtual-machines-windows-sap-high-availability-guide.md#9fbd43c0-5850-4965-9726-2a921d85d73f (Hostnames and Static IP-Addresses for the SAP ASCS/SCS Clustered Instance and DBMS Clustered Instance)
[sap-ha-guide-8.6]:virtual-machines-windows-sap-high-availability-guide.md#84c019fe-8c58-4dac-9e54-173efd4b2c30 (Setup Static IP-Addresses for the SAP VMs)
[sap-ha-guide-8.7]:virtual-machines-windows-sap-high-availability-guide.md#7a8f3e9b-0624-4051-9e41-b73fff816a9e (Setup Static IP-Address for Internal Load Balancer (ILB))
[sap-ha-guide-8.8]:virtual-machines-windows-sap-high-availability-guide.md#f19bd997-154d-4583-a46e-7f5a69d0153c (Default ASCS/SCS Load Balancing Rules for Azure Internal Load Balancer (ILB))
[sap-ha-guide-8.9]:virtual-machines-windows-sap-high-availability-guide.md#fe0bd8b5-2b43-45e3-8295-80bee5415716 (Changing ASCS/SCS Default Load Balancing Rules for Azure Internal Load Balancer (ILB))
[sap-ha-guide-8.10]:virtual-machines-windows-sap-high-availability-guide.md#e69e9a34-4601-47a3-a41c-d2e11c626c0c (Add Windows Machines to the Domain)
[sap-ha-guide-8.11]:virtual-machines-windows-sap-high-availability-guide.md#661035b2-4d0f-4d31-86f8-dc0a50d78158 (Add Registry Entries on Both Cluster Nodes used for SAP ASCS/SCS Instance)
[sap-ha-guide-8.12]:virtual-machines-windows-sap-high-availability-guide.md#0d67f090-7928-43e0-8772-5ccbf8f59aab (Windows Server Failover Cluster setup for SAP ASCS/SCS Instance)
[sap-ha-guide-8.12.1]:virtual-machines-windows-sap-high-availability-guide.md#5eecb071-c703-4ccc-ba6d-fe9c6ded9d79 (Collect Cluster Nodes in Cluster Configuration)
[sap-ha-guide-8.12.2]:virtual-machines-windows-sap-high-availability-guide.md#e49a4529-50c9-4dcf-bde7-15a0c21d21ca (Configure Cluster File Share Witness)
[sap-ha-guide-8.12.2.1]:virtual-machines-windows-sap-high-availability-guide.md#06260b30-d697-4c4d-b1c9-d22c0bd64855 (Create a File Share)
[sap-ha-guide-8.12.2.2]:virtual-machines-windows-sap-high-availability-guide.md#4c08c387-78a0-46b1-9d27-b497b08cac3d (Configure File Share Witness Quorum in the Failover Cluster Manager)
[sap-ha-guide-8.12.3]:virtual-machines-windows-sap-high-availability-guide.md#5c8e5482-841e-45e1-a89d-a05c0907c868 (Installing SIOS DataKeeper Cluster Edition for SAP ASCS/SCS Cluster Share Disk)
[sap-ha-guide-8.12.3.1]:virtual-machines-windows-sap-high-availability-guide.md#1c2788c3-3648-4e82-9e0d-e058e475e2a3 (Add the Microsoft .NET Framework 3.5 Feature)
[sap-ha-guide-8.12.3.2]:virtual-machines-windows-sap-high-availability-guide.md#dd41d5a2-8083-415b-9878-839652812102 (Installing SIOS DataKeeper)
[sap-ha-guide-8.12.3.3]:virtual-machines-windows-sap-high-availability-guide.md#d9c1fc8e-8710-4dff-bec2-1f535db7b006 (Setup SIOS DataKeeper)
[sap-ha-guide-9]:virtual-machines-windows-sap-high-availability-guide.md#a06f0b49-8a7a-42bf-8b0d-c12026c5746b (Installation of SAP NetWeaver System)
[sap-ha-guide-9.1]:virtual-machines-windows-sap-high-availability-guide.md#31c6bd4f-51df-4057-9fdf-3fcbc619c170 (SAP Installation with High Available ASCS/SCS Instance)
[sap-ha-guide-9.1.1]:virtual-machines-windows-sap-high-availability-guide.md#a97ad604-9094-44fe-a364-f89cb39bf097 (Create Virtual Hostname for clustered SAP ASCS/SCS)
[sap-ha-guide-9.1.2]:virtual-machines-windows-sap-high-availability-guide.md#eb5af918-b42f-4803-bb50-eff41f84b0b0 (Install SAP First Cluster Node)
[sap-ha-guide-9.1.3]:virtual-machines-windows-sap-high-availability-guide.md#e4caaab2-e90f-4f2c-bc84-2cd2e12a9556 (Modify the SAP profile of the ASCS/SCS instance)
[sap-ha-guide-9.1.4]:virtual-machines-windows-sap-high-availability-guide.md#10822f4f-32e7-4871-b63a-9b86c76ce761 (Add Probe Port)
[sap-ha-guide-9.2]:virtual-machines-windows-sap-high-availability-guide.md#85d78414-b21d-4097-92b6-34d8bcb724b7 (Installing the Database Instance)
[sap-ha-guide-9.3]:virtual-machines-windows-sap-high-availability-guide.md#8a276e16-f507-4071-b829-cdc0a4d36748 (Installation Second Cluster Node)
[sap-ha-guide-9.4]:virtual-machines-windows-sap-high-availability-guide.md#094bc895-31d4-4471-91cc-1513b64e406a (Change Windows Service Startup Type of SAP ERS Instance)
[sap-ha-guide-9.5]:virtual-machines-windows-sap-high-availability-guide.md#2477e58f-c5a7-4a5d-9ae3-7b91022cafb5 (Installation of SAP Primary Application Server (PAS))
[sap-ha-guide-9.6]:virtual-machines-windows-sap-high-availability-guide.md#0ba4a6c1-cc37-4bcf-a8dc-025de4263772 (Installation of SAP Additional Application Server (AAS))
[sap-ha-guide-10]:virtual-machines-windows-sap-high-availability-guide.md#18aa2b9d-92d2-4c0e-8ddd-5acaabda99e9 (Testing SAP ASCS/SCS Instance Failover and SIOS Replication)
[sap-ha-guide-10.1]:virtual-machines-windows-sap-high-availability-guide.md#65fdef0f-9f94-41f9-b314-ea45bbfea445 (Starting point – SAP ASCS/SCS instance is running on Cluster Node A)
[sap-ha-guide-10.2]:virtual-machines-windows-sap-high-availability-guide.md#5e959fa9-8fcd-49e5-a12c-37f6ba07b916 (Failover process from Node A to Node B)
[sap-ha-guide-10.3]:virtual-machines-windows-sap-high-availability-guide.md#755a6b93-0099-4533-9f6d-5c9a613878b5 (Final result – SAP ASCS/SCS instance is running on Cluster Node B)


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
 

Microsoft Azure enables companies to acquire compute, storage and network resources in minimal time without lengthy procurement cycles. Azure Virtual Machines allow companies to deploy classical applications, like SAP NetWeaver based applications (ABAP, Java and ABAP+Java stack) into Azure, and extend their reliability and availability without having further resources available on premises. Azure Virtual Machines also support cross-premises connectivity, which enables companies to actively integrate Azure Virtual Machines into their on-premises domains, their Private Clouds and their SAP System Landscape. 


This document details all of the steps needed to deploy highly available SAP systems in Azure using our new method with new Azure Resource Manager deployment model. The guide will walk you through the major steps: 


- Finding the appropriate SAP installation guides and Notes, that are listed later in the section titled  [Resources][sap-ha-guide-2].  
  The paper complements the SAP Installation Documentation and SAP Notes which represent the primary resources for installations and deployments of SAP software on given platforms.

- Understanding the difference between the current Azure Classical deployment model and this new one Azure Resource Manager deployment model.

- Understanding Windows Server Failover Cluster (WSFC) quorum modes, so you can select the model appropriate for your Azure deployment

- Understanding Windows Server Failover Cluster (WSFC) shared storage in Azure

- Understanding how SAP single point of failure components like the SAP ASCS/SCS and  DBMS , and redundant components like SAP application servers can be protected in Azure

- Step-by-step approach how to install and configure a high available (HA) SAP system in a Windows Failover Cluster (WSFC) using Microsoft Azure as a platform and the new Azure Resource Manager.

- Additional steps needed for WSFC in Azure which are no needed in on-premise deployments


To simplify the deployment and configuration, we are using the new SAP 3 tier HA Azure Resource Manager templates, that automates deployment of the complete infrastructure needed for highly available SAP system and that supports desired SAPS sizing of your SAP system. 

[AZURE.INCLUDE [windows-warning](../../includes/virtual-machines-linux-sap-warning.md)]

##  <a name="217c5479-5595-4cd8-870d-15ab00d4f84c"></a> Prerequisites

Before you start, please make sure that the prerequisites that are the described in the following chapters are met and that you checked all resources listed in resources chapter. 

We are using Azure Azure Resource Manager templates for 3-tier SAP NetWeaver:   
[https://github.com/Azure/azure-quickstart-templates/tree/master/sap-3-tier-marketplace-image](https://github.com/Azure/azure-quickstart-templates/tree/master/sap-3-tier-marketplace-image/)

An overview of SAP Azure Resource Manager templates is given here:   
[https://blogs.msdn.microsoft.com/saponsqlserver/2016/05/16/azure-quickstart-templates-for-sap/](https://blogs.msdn.microsoft.com/saponsqlserver/2016/05/16/azure-quickstart-templates-for-sap/)


##  <a name="42b8f600-7ba3-4606-b8a5-53c4f026da08"></a>  Resources

The following additional guides are available for the topic of SAP deployments on Azure:

- [SAP NetWeaver on Windows virtual machines (VMs) – Planning and Implementation Guide][planning-guide]
- [SAP NetWeaver on Windows virtual machines (VMs) – Deployment Guide][deployment-guide]
- [SAP NetWeaver on Windows virtual machines (VMs) – DBMS Deployment Guide][dbms-guide]
- [SAP NetWeaver on Windows virtual machines (VMs) – High Availability Guide (this guide)][sap-ha-guide]


> [AZURE.NOTE] Wherever possible a link to the referring SAP Installation Guide is used (see [SAP Installation Guides][sap-installation-guides] ). When it comes to the prerequisites and installation process, the SAP NetWeaver Installation Guides should always be read carefully, as this document only covers specific tasks for SAP NetWeaver based systems installed in a Microsoft Azure Virtual Machine.

The following SAP Notes are related to the topic of SAP on Azure:


| Note number   | Title                                                    
| ------------- |----------------------------------------------------------
| [1928533]       | SAP Applications on Azure: Supported Products and Sizing 
| [2015553]       | SAP on Microsoft Azure: Support Prerequisites         
| [1999351]       | Enhanced Azure Monitoring for SAP                        
| [2178632]       | Key Monitoring Metrics for SAP on Microsoft Azure        
| [1999351]       | Virtualization on Windows: Enhanced Monitoring           


General default limitations and maximum limitations of Azure subscriptions can be found in [this article][azure-subscription-service-limits-subscription].

##  <a name="42156640c6-01cf-45a9-b225-4baa678b24f1"></a> Differences in SAP HA Between Azure Resource Manager and Classical Deployment Model 

> [AZURE.NOTE] Classical deployment model is also known as Azure Service Management (ASM) model. 

### <a name="f76af273-1993-4d83-b12d-65deeae23686"></a> Resource Groups
Resource groups are a new concept that contain all resources that have the same lifecycle, e.g. they are created and deleted at the same time. Read this article  for more information about resource groups.

### <a name="3e85fbe0-84b1-4892-87af-d9b65ff91860"></a> Clustering with Azure Resource Manager compared to Classical Deployment Model 

The new Azure Azure Resource Manager model is offering the following changes in comparison to the classical deployment model for HA:

- There is no need to have a cloud service to use an Azure Internal Load Balancer (ILB)

If you still want to use the old Azure classical model, you need to follow the procedure as described in the paper [SAP NetWeaver on Azure - Clustering SAP ASCS/SCS Instances using Windows Server Failover Cluster on Azure with SIOS DataKeeper](http://go.microsoft.com/fwlink/?LinkId=613056). 

> [AZURE.NOTE] It is strongly recommended to use the new Azure Resource Manager deployment model for your SAP installations, as it is offering many benefits in comparison to the classical deployment model.   
More information can be found in [this article][virtual-machines-azure-resource-manager-architecture-benefits-arm].   


## <a name="8ecf3ba0-67c0-4495-9c14-feec1a2255b7"></a> Windows Server Failover Clustering (WSFC) 

A Microsoft WSFC is the technical basis for a highly available SAP ASCS/SCS installation and DBMS on Windows. 

A failover cluster is a group of 1+n independent servers (nodes) that work together to increase the availability of applications and services. In the event node failure(s) occur, WSFC must determine the number of failures that can occur while still maintaining a healthy cluster in order to be able to provide the defined applications and/or services. Different quorum modes are available to achieve this.
 

### <a name="1a3c5408-b168-46d6-99f5-4219ad1b1ff2"></a> Quorum Modes

With WSFC four different quorum modes are available:

- **Node Majority:** Each node can vote. The cluster functions only with a majority of the votes, that is, more than half. This option is recommended in case of an uneven number of nodes. For example: 3 nodes in a 7 node cluster can fail and the cluster will still achieve a majority and continue to run.  

- **Node and Disk Majority:** Each node plus a designated disk in the cluster storage (the “disk witness”) can vote whenever they are available and in communication. The cluster functions only with a majority of the votes, that is, more than half. This mode makes sense in a cluster environment with an even number of nodes. As long as half of the nodes plus the disk are online the cluster remains in a healthy state.

- **Node and File Share Majority:** Each node plus a designated file share created by the administrator (the file share witness) can vote whether they are available and in communication. The cluster functions only with a majority of the votes, that is, more than half. This mode makes sense in a cluster environment with an even number of nodes and is similar to the Node and Disk Majority mode while it uses a witness file share instead of a witness disk. It is easy to implement but if the file share itself is not highly available then it might become a single point of failure.

- **No Majority: Disk Only:** The cluster has quorum if one node is available and in communication with a specific disk in the cluster storage. Only the nodes that are also in communication with that disk can join the cluster. This mode is not recommended. 
 

## <a name="fdfee875-6e66-483a-a343-14bbaee33275"></a> Windows Failover Cluster on premises

In this example, we have a cluster consisting of two nodes. If the network connection between the nodes fails while both nodes stay up and running, it is necessary to clarify which node is supposed to keep providing the applications and services of the cluster. A quorum disk or file share serves this purpose. The node that has access to the quorum disk or file share is the one to ensure accessibility of the services.

In this example we are using a two node cluster. For this reason, we chose the node and file share quorum mode. The node and disk majority is also a valid option. In a productive environment it is recommended to use a quorum disk instead and use network and storage system technology to make it highly available.

![Figure 1: Proposed Windows Server Failover Cluster configuration for SAP ASCS/SCS on Azure][sap-ha-guide-figure-1000]

_**Figure 1:** Proposed Windows Server Failover Cluster configuration for SAP ASCS/SCS on Azure_

### <a name="be21cf3e-fb01-402b-9955-54fbecf66592"></a> Shared Storage

The figure above shows a shared storage cluster with two nodes. In a shared storage cluster on premises there is a shared storage that is visible for all nodes within the cluster. A locking mechanism protects the data against corruption. Additionally, all nodes can detect if another node fails. If one node fails, the remaining one takes ownership of the storage resources and ensures the availability of the services.

> [AZURE.NOTE] For achieving high availability with some DBMS, like SQL Server, shared disks are not necessary. SQL Server AlwaysOn performs the replication of DBMS data and log files from local disk of one cluster node to local disk of another cluster node. Hence, the Windows cluster configuration does not need a shared disk.

### <a name="ff7a9a06-2bc5-4b20-860a-46cdb44669cd"></a> Networking / Name Resolution

The cluster is reachable over a virtual IP-address and a virtual hostname provided by the DNS-server. The nodes on premises and the DNS Server can handle multiple IP addresses.

In a typical setup, two or more network connections are used:

- A dedicated connection to the storage; and
- A cluster-internal network connection for the heartbeat; and
- A public network used by the clients to connect to the cluster.



## <a name="2ddba413-a7f5-4e4e-9a51-87908879c10a"></a> Windows Failover Cluster with Microsoft Azure

Compared to bare-metal or private cloud deployments, Microsoft Azure Virtual Machines require additional steps to configure a WSFC. In order to build a Shared Cluster Disk, several IP addresses and virtual hostnames are required for SAP ASCS/SCS instance.

Below we discuss the additional concepts and steps required when building an SAP HA Central Services cluster on Microsoft Azure. The steps show how to set up the third party tool SIOS DataKeeper and configure the Azure Internal Load Balancer. These tools will give us the possibility to create a Windows Failover Cluster with a File Share Witness in Microsoft Azure.


![Figure 2: Schema of a Windows Server Failover Cluster configuration in Azure without Shared Disk][sap-ha-guide-figure-1001]

_**Figure 2:** Schema of a Windows Server Failover Cluster configuration in Azure without Shared Disk_


### <a name="1a464091-922b-48d7-9d08-7cecf757f341"></a> Shared Disk on Microsoft Azure with SIOS DataKeeper

As of September 2016, Microsoft Azure does not provide shared storage to create a shared storage cluster.  However, cluster shared storage is needed for a highly available SAP ASCS /SCS instance. 

The third party software SIOS DataKeeper Cluster Edition allows one to create a mirrored storage that simulates cluster shared storage. The SIOS solution provides real-time synchronous data replication. The way how a shared disk resource for a cluster is created is:

- Having an additional Azure VHD attached to each of the VMs that are in a Windows Cluster configuration.
- Having SIOS DataKeeper Cluster Edition running on both VM nodes.
- Having SIOS DataKeeper Cluster Edition configured in a way that it mirrors the content of the additional VHD attached volume from source VMs to additional VHD attached volume of target VM. SIOS DataKeeper is abstracting the source and target local volumes and presenting them to Windows Failover Cluster as one shared disk.

For more details on the SIOS DataKeeper product, please check this source: [http://us.sios.com/products/datakeeper-cluster/](http://us.sios.com/products/datakeeper-cluster/)

 ![Figure 2: Schema of a Windows Server Failover Cluster configuration in Azure using SIOS DataKeeper][sap-ha-guide-figure-1002]

_**Figure 3:** Schema of a Windows Server Failover Cluster configuration in Azure using SIOS DataKeeper_

> [AZURE.NOTE] For achieving high availability with some DBMS, like SQL Server, shared disks are not necessary. SQL Server AlwaysOn is performing the  replication of DBMS data and log files from local disk of one cluster node to local disk of another cluster node. Hence, the Windows cluster configuration does not need a shared disk.

### <a name="44641e18-a94e-431f-95ff-303ab65e0bcb"></a> Name Resolution on Microsoft Azure

The Microsoft Azure cloud platform doesn’t provide the possibility to configure virtual IP addresses, e.g. floating IPs. For this reason, you need an alternative solution to set up a virtual IP address to reach the cluster resource in the cloud.
Azure provides the Internal Load Balancer (ILB). With the ILB the cluster can be reached over the cluster virtual IP address.
Hence, you need to deploy the ILB in the resource group that contains the cluster nodes. Then you need to configure all necessary port forwarding rules with the probe ports of the ILB.
The clients can connect via the virtual hostname.  The DNS Server resolves the Cluster-IP-Address and the ILB handles the forwarding to the active node of the cluster.

## <a name="2e3fec50-241e-441b-8708-0b1864f66dfa"></a> SAP NetWeaver High Availability on Azure IaaS

As already discussed in the HA chapter [SAP NetWeaver on Azure virtual machines (VMs) –  of the SAP NetWeaver on Windows virtual machines (VMs) – Planning and Implementation Guide][planning-guide-11], to achieve SAP application high availability, e.g. HA of SAP software components we need to protect following components:

- SAP application servers
- SAP ASCS / SCS instance 
- DBMS server

### <a name="93faa747-907e-440a-b00a-1ae0a89b1c0e"></a> High Availability for SAP Application Servers

For the SAP application servers/dialog instances, a specific high availability solution usually is not required. You achieve high availability by redundancy and thereby have multiple dialog instances configured on different Azure virtual machines. You should have at least two SAP application instances installed in two Azure VMs. 

![Figure 4: SAP Application Servers HA][sap-ha-guide-figure-2000]

_**Figure 4:** SAP Application Servers HA_


All virtual machines that host SAP application servers have to be placed in the same **Azure Availability Set**. The Azure Availability Set will ensure:

- That all VMs are part of same upgrade domains, e.g. it will make sure to avoid that the VMs might be updated at the same time during planned maintenance downtime. 
- And that all VMs will be part of same fault domains, e.g. will ensure that VMs are deployed in a way that a single point of failure that could impact the availability of all VMs is avoided. 

For more information, check article: [Manage the availability of virtual machines][virtual-machines-manage-availability]. 

As the Azure storage account can be a potential Single Point of Failure, it is important that you have at least two Azure storage accounts where at least two VMs will be distributed. Ideally every one of the VMs running SAP dialog instances should be deployed in a different storage account.

### <a name="f559c285-ee68-4eec-add1-f60fe7b978db"></a> High Availability for SAP (A)SCS Instances 

![Figure 5: Highly available SAP ASCS / SCS Instance HA][sap-ha-guide-figure-2001]

_**Figure 5:** SHighly available SAP ASCS / SCS Instance HA_


#### <a name="b5b1fd0b-1db4-4d49-9162-de07a0132a51"></a> High Availability for SAP (A)SCS Instance with Windows Failover Cluster in Azure

Compared to bare-metal or private cloud deployments, Microsoft Azure Virtual Machines require additional steps to configure a WSFC. In order to build a Windows failover cluster, a Shared Cluster Disk, several IP addresses and virtual hostnames, and Azure internal load balancer (ILB) are required for clustering of SAP ASCS/SCS instance.

This will be discussed more in details, later in the document. 

![Figure 6: Schema of a Windows Server Failover Cluster for SAP ASCS/SCS configuration in Azure using SIOS DataKeeper][sap-ha-guide-figure-1002]

_**Figure 6:** Schema of a Windows Server Failover Cluster for SAP ASCS/SCS configuration in Azure using SIOS DataKeeper_


### <a name="ddd878a0-9c2f-4b8e-8968-26ce60be1027"></a> High Availability for DBMS Instance

The DBMS is as well a SPOF of an SAP system and needs to be protected using an HA solution. Below is an example of a SQL Server AlwaysOn HA solution in Azure using Windows Sever Failover Cluster and Azure Internal Load Balancer. SQL Server AlwaysOn replicates DBMS data and log files using its own DBMS replication. Therefore, we do not need cluster shared disks which simplify the whole setting. 


![Figure 7: SAP DBMS Servers HA – an example of SQL Server AlwaysOn HA setting][sap-ha-guide-figure-2003]

_**Figure 7:** SAP DBMS Servers HA – an example of SQL Server AlwaysOn HA setting_


This document does not cover clustering of the DBMS. 

For more information on clustering of SQL Server in Azure using the Azure Resource Manager deployment model can be found in these articles:

- [Configure Always On availability group in Azure VM manually - Resource Manager][virtual-machines-windows-portal-sql-alwayson-availability-groups-manual] 
- [Configure an internal load balancer for an AlwaysOn availability group in Azure][virtual-machines-windows-portal-sql-alwayson-int-listener]

### <a name="045252ed-0277-4fc8-8f46-c5a29694a816"></a> Possible End-To-End HA Deployment Scenarios

Here is an example of a complete SAP NetWeaver HA architecture in Azure, where we use one dedicated cluster for the SAP ASCS/SCS instance and another one for the DBMS. 

![Figure 8: SAP HA Architectural Template 1 – with dedicated cluster for ASCS/SCS and dedicated cluster for DBMS instance][sap-ha-guide-figure-2004]

_**Figure 8:** SAP HA Architectural Template 1 – with dedicated cluster for ASCS/SCS and dedicated cluster for DBMS instance_

## <a name="78092dbe-165b-454c-92f5-4972bdbef9bf"></a> Infrastructure Preparation

In order to simplify the deployment of the required resources for SAP, we developed Azure Resource Manager templates for SAP. 

These 3-tier templates support also high availability scenarios e.g.:

- **Architectural Template 1** – with two cluster, each cluster for SAP Single Points of Failures of SAP ASCS/SCS and DBMS

Azure Resource Manager templates for Scenario 1 are available here:

- Azure Marketplace image: [https://github.com/Azure/azure-quickstart-templates/tree/master/sap-3-tier-marketplace-image](https://github.com/Azure/azure-quickstart-templates/tree/master/sap-3-tier-marketplace-image)  
- Custom image: [https://github.com/Azure/azure-quickstart-templates/tree/master/sap-3-tier-user-image](https://github.com/Azure/azure-quickstart-templates/tree/master/sap-3-tier-user-image)

When you click on the SAP 3 tier marketplace image, you will get following UI in Azure portal:

![Figure 9: Specifying SAP HA Azure Resource Manager parameters][sap-ha-guide-figure-3000]

_**Figure 9:** Specifying SAP HA Azure Resource Manager parameters_


Makes sure to choose **HA** for the SYSTEMAVAILABILITY option.

The templates will create:

- All needed **VMs** for:	
    - SAP application servers VMs: `<SAPSystemSID>-di-<Number>`
    - ASCS/SCS cluster VMs:   `<SAPSystemSID>-ascs-<Number>`
    - DBMS cluster:  `<SAPSystemSID>-db-<Number>` 
- **Network Cards for all VMs with associated IP addresses**: 
    - `<SAPSystemSID>-nic-di-<Number>`
    - `<SAPSystemSID>-nic-ascs-<Number>`
    - `<SAPSystemSID>-nic-db-<Number>`
- **Azure Storage Accounts** 
- **Availability Groups** for:
    - SAP Application Server VMs: `<SAPSystemSID>-avset-di`
    - SAP ASCS /SCS cluster VMs:  `<SAPSystemSID>-avset-ascs`
    - DBMS cluster VMs:  `<SAPSystemSID>-avset-db`
- **Azure Internal Load Balancer (ILB)** with all ports for ASCS/SCS instance and IP address  
  `<SAPSystemSID>-lb-ascs`
-	**Azure Internal Load Balancer (ILB)** with all ports for SQL Server DBMS and IP address
  `<SAPSystemSID>-lb-db`
- **Network Security Group**: `<SAPSystemSID>-nsg-ascs-0`  
With open external RDP port to `<SAPSystemSID>-ascs-0` VM


> [AZURE.NOTE]  ALL IP addresses of the network cards and Azure ILBs are initially created as **Dynamic**. You have to change them to **Static** IP addresses, as described later in the document.


### <a name="c87a8d3f-b1dc-4d2f-b23c-da4b72977489"></a> Deploying VMs with Corporate Network Connectivity (Cross-Premises) for Productive Usage

For production SAP Systems, you will deploy Azure VMs with [corporate network connectivity (Cross-Premises)][planning-guide-2.2] , using Azure Site-to-Site (VPN) or Azure ExpressRoute.

> [AZURE.NOTE]  In this case, your Azure VNET and subnet is already created and prepared.


In the field **NEWOREXISTINGSUBNET** choose existing. 

In the text field **SUBNETID**, you need to add the full string of your prepared Azure Network SubnetID, where you plan to deploy your Azure VMs. 

You can get a list of all Azure network subnets using this PowerShell command: 

```powershell
(Get-AzureRmVirtualNetwork -Name <azureVnetName>  -ResourceGroupName <ResourceGroupOfVNET>).Subnets
```


The **SUBNETID** is displayed in the field Id. 

A List of all **SUBNETIDs** can be retrieved by using the following PowerShell command:

```PowerShell
(Get-AzureRmVirtualNetwork -Name <azureVnetName>  -ResourceGroupName <ResourceGroupOfVNET>).Subnets.Id
```

The **SUBNETID** looks similar like this:

```
/subscriptions/<SubscriptionId>/resourceGroups/<VPNName>/providers/Microsoft.Network/virtualNetworks/azureVnet/subnets/<SubnetName>
```

### <a name="7fe9af0e-3cce-495b-a5ec-dcb4d8e0a310"></a> Cloud-Only deployment of SAP instances for Test/Demo

You can also deploy your HA SAP system in the so called cloud-only deployment model. 

This deployment is appropriate mostly for the demo use case, but not for production use cases. 

In the field NEWOREXISTINGSUBNET choose _**new**_. Leave the SUBNETID field **empty**. 

The Azure VNET and subnet will be created automatically by the SAP Azure Resource Manager template. 

> [AZURE.NOTE] In addition, you need to deploy at least one dedicated VM for AD/DNS in the same VNET. These VMs are not created by the template.


### <a name="47d5300a-a830-41d4-83dd-1a0d1ffdbe6a"></a> Azure Virtual Network

In our example, the address space of the Azure VNET is 10.0.0.0/16. There is one subnet called _**Subnet**_, with an address range of 10.0.0.0/24. All VMs and ILBs are deployed in this VNET.
  
> [AZURE.NOTE] Do not make any changes on the network settings inside the guest (like IP address, DNS  servers, subnet etc.). All network settings are done through Azure, and are propagated via the DHCP service.

### <a name="b22d7b3b-4343-40ff-a319-097e13f62f9e"></a> DNS IP-Addresses

Make sure that your VNET **DNS Servers** option is set to **Custom DNS**.
In the case of:

- **[Corporate Network Connectivity (Cross-Premises)][planning-guide-2.2]**: Add the IP addresses of the on-premises DNS servers.  
  On-premises DNS Servers can be extended to the VMs running in Azure. In this case, you can add the IP addresses of those Azure VMs that are configured to run DNS service.

-	**[Cloud-Only deployment][planning-guide-2.1]**: Deploy an additional VM in the same VNET, which will serve as DNS server(s). Add the IP addresses of those Azure VMs that are configured to run DNS service.


![Figure 10: Configuring DNS servers for Azure VNET][sap-ha-guide-figure-3001]

_**Figure 10:** Configuring DNS servers for Azure VNET_

> [AZURE.NOTE] If you change the IP addresses of the DNS servers, you need to reboot the Azure VMs in order to apply the change and propagate the new DNS servers.
In our example, the DNS service is installed and configured on the following Windows VMs



| VM Role        | VM hostname | Network Card name  | Static IP Address  
| ---------------|-------------|--------------------|-------------------
| 1st DNS Server | domcontr-0  | pr1-nic-domcontr-0 | 10.0.0.10         
| 2nd DNS Server | domcontr-1  | pr1-nic-domcontr-1 | 10.0.0.11         


### <a name="9fbd43c0-5850-4965-9726-2a921d85d73f"></a> Hostnames and Static IP-Addresses for the SAP ASCS/SCS Clustered Instance and DBMS Clustered Instance

Similar like on-premises, we need the following reserved hostnames / IP addresses:

| Virtual Hostname Role                                                       | Virtual Hostname | Virtual Static IP Address 
| ----------------------------------------------------------------------------|------------------|---------------------------
| SAP ASCS/SCS 1st Cluster Virtual Hostname (used for the cluster management) | pr1-ascs-vir     | 10.0.0.42                 
| SAP ASCS/SCS **INSTANCE** Virtual Hostname                                  | pr1-ascs-sap     | `10.0.0.43`             
| SAP DBMS 2nd Cluster Virtual Hostname (used for the cluster management)     | pr1-dbms-vir     | 10.0.0.32                 
 

The virtual hostnames _**pr1-ascs-vir**_ and _**pr1-dbms-vir**_ and the associated IP addresses, that are used to manage the cluster itself, are created during the cluster creation as described in the chapter [Collect Cluster Nodes in Cluster Configuration][sap-ha-guide-8.12.1].

The other two virtual hostnames _**pr1-ascs-sap**_ and _**pr1-dbms-sap**_ and the associated IP addresses, that are used by the clustered SAP ASCS/SCS instance and the clustered DBMS instance, can be created manually on the DNS server, as described in the chapter [Create Virtual Hostname for clustered SAP ASCS/SCS][sap-ha-guide-9.1.1].

### <a name="84c019fe-8c58-4dac-9e54-173efd4b2c30"></a> Setup Static IP-Addresses for the SAP VMs

After deploying the virtual machines for clustering we have to setup a static IP-addresses for all VMs. This can’t be done within the Guest-OS, but needs to be configured in the Azure Virtual Network configuration. 

One way to do this is using the Azure portal. In the Azure Portal, navigate to:

```
<Resource Group> -> <Network Card> -> Settings -> IP Address
```

Change the field Assignment from **Dynamic** to **Static**, and enter the desired **IP address**. 

> [AZURE.NOTE] If you change the IP address of the network card, you need to reboot the Azure VMs in order to apply the change.  


![Figure 11: Configuring static IP address for the network card of the each VM][sap-ha-guide-figure-3002]

_**Figure 11:** Configuring static IP address for the network card of the each VM_

Repeat this step for all network interfaces i.e. for all VMs, including those VMs that you want to use for AD/DNS service. 

In our example we have following VMs and static IP addresses:

| VM Role                                 | VM hostname  | Network Card name  | Static IP Address  
| ----------------------------------------|--------------|--------------------|-------------------
| 1st SAP Application Server              | pr1-di-0     | pr1-nic-di-0       | 10.0.0.50         
| 2nd SAP Application Server              | pr1-di-1     | pr1-nic-di-1       | 10.0.0.51         
| ...                                     | ...          | ...                | ...               
| Last SAP Application Server             | pr1-di-5     | pr1-nic-di-5       | 10.0.0.55         
| 1st Cluster Node for ASCS/SCS-Instance  | pr1-ascs-0   | pr1-nic-ascs-0     | 10.0.0.40         
| 2nd Cluster Node for ASCS/SCS-Instance  | pr1-ascs-1   | pr1-nic-ascs-1     | 10.0.0.41         
| 1st Cluster Node for DBMS Instance      | pr1-db-0     | pr1-nic-db-0       | 10.0.0.30         
| 2nd Cluster Node for DBMS Instance      | pr1-db-1     | pr1-nic-db-1       | 10.0.0.31         

### <a name="7a8f3e9b-0624-4051-9e41-b73fff816a9e"></a> Setup Static IP-Address for Internal Load Balancer (ILB)

The SAP Azure Resource Manager template creates an Azure Internal Load Balancer (ILB) used for the SAP ASCS / SCS instance cluster and for the DBMS cluster. 

The initial deployment sets the ILB IP address to **Dynamic**. It is important to change the IP address to **Static**. 

In our example we have two Azure ILBs with the following static IP addresses:

| Azure ILB Role             | Azure ILB Name | Static IP Address 
| ---------------------------|----------------|-------------------
| SAP ASCS/SCS Instance ILB  | pr1-lb-ascs    | `10.0.0.43`         
| SAP DBMS ILB               | pr1-lb-dbms    | 10.0.0.33         


> [AZURE.NOTE]  
**IP address of the virtual hostname of the SAP ASCS/SCS = IP address of the SAP ASCS/SCS Azure Load Balancer pr1-lb-ascs**  
**IP address of the virtual name of the DBMS = IP address of the DBMS Azure Load Balancer pr1-lb-dbms**

In our example, set the IP address of the Internal Load Balancer _pr1-lb-ascs_ to the IP address of the virtual hostname of the SAP ASCS/SCS instance (`10.0.0.43`)

![Figure 12: Setup Static IP-Address for Internal Load Balancer (ILB) for SAP ASCS/SCS instance][sap-ha-guide-figure-3003]

_**Figure 12:** Setup Static IP-Address for Internal Load Balancer (ILB) for SAP ASCS/SCS instance_

In the same way, set the IP address of the Load Balancer _pr1-lb-dbms_ to the IP address of the virtual hostname of the DBMS instance  (in our example 10.0.0.33).

### <a name="f19bd997-154d-4583-a46e-7f5a69d0153c"></a> Default ASCS/SCS Load Balancing Rules for Azure Internal Load Balancer (ILB)

By default, the SAP Azure Resource Manager template creates all needed ports for:

- ABAP ASCS instance with default instance number **00**
- Java SCS instance with default instance number **01**

Therefore, during your SAP ASCS/SCS instance installation you have to use these default instance numbers of 00 and 01 for your ABAP ASCS and/or Java SCS instance.

The following Azure ILB endpoints are needed and created for the SAP NetWeaver ABAP ASCS ports:


| Service / Load Balancing Rule Name           | Default Ports Numbers | Concrete ports for (ASCS instance with instance number 00) (ERS with 10)  
| ---------------------------------------------|-----------------------|--------------------------------------------------------------------------
| Enqueue Server / _lbrule3200_                | 32`<InstanceNumber>`  | 3200                                                                     
| ABAP Message Server / _lbrule3600_           | 32`<InstanceNumber>`  | 3600                                                                     
| Internal ABAP Message / _lbrule3900_         | 39`<InstanceNumber>`  | 3900                                                                     
| Message Server HTTP / _Lbrule8100_           | 81`<InstanceNumber>`  | 8100                                                                     
| SAP Start Service ASCS HTTP / _Lbrule50013_  | 5`<InstanceNumber>`13 | 50013                                                                    
| SAP Start Service ASCS HTTPS / _Lbrule50014_ | 5`<InstanceNumber>`14 | 50014                                                                    
| Enqueue Replication / _Lbrule50016_          | 5`<InstanceNumber>`16 | 50016                                                                    
| SAP Start Service ERS HTTP _Lbrule51013_     | 5`<InstanceNumber>`13 | 51013                                                                    
| SAP Start Service ERS HTTP _Lbrule51014_     | 5`<InstanceNumber>`14 | 51014                                                                    
| Win RM _Lbrule5985_                          |                       | 5985                                                                     
| File Share _Lbrule445_                       |                       | 445                                                                      

_**Table 1:** Port numbers of SAP NetWeaver ABAP ASCS instances_


The following Azure ILB endpoints are needed and must be created for the SAP NetWeaver Java SCS ports:

| Service / Load Balancing Rule Name           | Default Ports Numbers | Concrete ports for (SCS instance with instance number 01) (ERS with 11)  
| ---------------------------------------------|-----------------------|--------------------------------------------------------------------------
| Enqueue Server / _lbrule3201_                | 32`<InstanceNumber>`  | 3201                                                                     
| Gateway Server / _lbrule3301_                | 33`<InstanceNumber>`  | 3301                                                                     
| Java Message Server / _lbrule3900_           | 39`<InstanceNumber>`  | 3901                                                                     
| Message Server HTTP / _Lbrule8101_           | 81`<InstanceNumber>`  | 8101                                                                     
| SAP Start Service SCS HTTP / _Lbrule50113_   | 5`<InstanceNumber>`13 | 50113                                                                    
| SAP Start Service SCS HTTPS / _Lbrule50114_  | 5`<InstanceNumber>`14 | 50114                                                                    
| Enqueue Replication / _Lbrule50116_          | 5`<InstanceNumber>`16 | 50116                                                                    
| SAP Start Service ERS HTTP _Lbrule51113_     | 5`<InstanceNumber>`13 | 51113                                                                    
| SAP Start Service ERS HTTP _Lbrule51114_     | 5`<InstanceNumber>`14 | 51114                                                                    
| Win RM _Lbrule5985_                          |                       | 5985                                                                     
| File Share _Lbrule445_                       |                       | 445                                                                      

_**Table 2:** Port numbers of SAP NetWeaver Java SCS instances_


![Figure 13: Default ASCS/SCS Load Balancing Rules for Azure Internal Load Balancer (ILB)][sap-ha-guide-figure-3004]

_**Figure 13:** Default ASCS/SCS Load Balancing Rules for Azure Internal Load Balancer (ILB)_

In the same way, set the IP address of the Load Balancer _**pr1-lb-dbms**_ to the IP address of the virtual hostname of the DBMS instance  (in our example _**10.0.0.33**_). 

### <a name="fe0bd8b5-2b43-45e3-8295-80bee5415716"></a> Changing ASCS/SCS Default Load Balancing Rules for Azure Internal Load Balancer (ILB)

If you would like to use another instance numbers for the SAP ASCS or SCS instance, you have to update the names and values of those ports. 

One way to update this is using the Azure portal. 

Go to `<SID>-lb-ascs load balancer -> Load Balancing Rules`

For all load balancing rules belonging to the SAP ASCS or SCS instance change:

- Name 
- Port
- Backend port

For example, if we want to change the default ASCS instance number from 00 to for example 31, you have to do the changes for all ports listed in _**Table 1:** Port numbers of SAP NetWeaver ABAP ASCS instances_.

Below is an example of an update for port _lbrule3200_.

![Figure 14: Changing ASCS/SCS Default Load Balancing Rules for Azure Internal Load Balancer (ILB)][sap-ha-guide-figure-3005]

_**Figure 14:** Changing ASCS/SCS Default Load Balancing Rules for Azure Internal Load Balancer (ILB)_


### <a name="e69e9a34-4601-47a3-a41c-d2e11c626c0c"></a> Add Windows Machines to the Domain

After assigning a static IP addresses to the VMs, add the VMs to the domain. 

![Figure 15: Adding a VM to a domain][sap-ha-guide-figure-3006]

_**Figure 15:** Adding a VM to a domain_


### <a name="661035b2-4d0f-4d31-86f8-dc0a50d78158"></a> Add Registry Entries on Both Cluster Nodes used for SAP ASCS/SCS Instance

Azure Load Balancers, including the Azure Internal Load Balancer are closing connections when these connections are idle for a certain amount of time (idle timeout). On the other hand, SAP work processes in dialog instances are opening connections to the SAP Enqueue Process as soon as the first enqueue/dequeue request needs to be sent. These connections usually remain established until the work process or the enqueue process restarts. However, if the connection is idle for some time, the Azure ILB will close those. Not really an issue since the SAP work process will re-establish the connection to the enqueue process if it does not exist anymore. However, these activities will be documented in the developer traces of SAP processes and will therefore create a lot of content into those traces for no really good reason. Therefore, we recommend to change the TCP/IP `KeepAliveTime` and `KeepAliveInterval` on both cluster nodes. The changes of the TCP/IP parameters need to be combined with SAP profile parameters which we will describe later in this document.

Add the following windows registry entries on both Windows cluster nodes for SAP ASCS/SCS:

| Path                  | HKLM\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters   
| ----------------------|-----------------------------------------------------------
| Variable Name         | `KeepAliveTime`                                              
| Variable Type         | REG_DWORD (Decimal)                                        
| Value                 | 120000                                                     
| Link to documentation | [https://technet.microsoft.com/en-us/library/cc957549.aspx](https://technet.microsoft.com/en-us/library/cc957549.aspx) 


_**Table 3:** First TCP/IP parameter to be changed_


| Path                  | HKLM\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters   
| ----------------------|-----------------------------------------------------------
| Variable Name         | `KeepAliveInterval`                                          
| Variable Type         | REG_DWORD (Decimal)                                        
| Value                 | 120000                                                     
| Link to documentation | [https://technet.microsoft.com/en-us/library/cc957548.aspx](https://technet.microsoft.com/en-us/library/cc957548.aspx)


_**Table 4:** Second TCP/IP parameter to be changed_

Then **reboot both cluster nodes** in order to apply the changes.

### <a name="0d67f090-7928-43e0-8772-5ccbf8f59aab"></a> Windows Server Failover Cluster setup for SAP ASCS/SCS Instance

#### <a name="5eecb071-c703-4ccc-ba6d-fe9c6ded9d79"></a> Collect Cluster Nodes in Cluster Configuration

The first step is to add the Failover Clustering Feature to both cluster nodes. This is done with the "**Add Role and Features Wizard**" and should not require any more descriptions.

The second step would be to setup the Failover Cluster by using the Windows Failover Cluster Manager.

In the Failover Cluster Manager MMC, click on create Cluster and only add the name of the first cluster node A, e.g. _**pr1-ascs-0**_. Do not add the second node yet. It will be added in a later step.

![Figure 16: First Step for adding a failover cluster configuration – add server/VM name of first node that should be cluster nodes][sap-ha-guide-figure-3007]

_**Figure 16:** First Step for adding a failover cluster configuration – add server/VM name of first node that should be cluster nodes_

In the next steps you are asked for the network name (virtual hostname) of the cluster. 

![Figure 17: Second Step for adding a failover cluster configuration – define name of the cluster][sap-ha-guide-figure-3008]

_**Figure 17:** Second Step for adding a failover cluster configuration – define name of the cluster_


Once the cluster is created a Cluster Validation Test is run

![Figure 18: Last Step for adding a failover cluster configuration – Cluster Validation Check is run][sap-ha-guide-figure-3009]

_**Figure 18:** Last Step for adding a failover cluster configuration – Cluster Validation Check is run_


![Figure 19: Last Step for adding a failover cluster configuration – Cluster Validation Check will show warnings about no quorum disk found][sap-ha-guide-figure-3010]

_**Figure 19:** Last Step for adding a failover cluster configuration – Cluster Validation Check will show warnings about no quorum disk found_

Any warnings about disks can be ignored at this stage, a file share witness will be added later along with the SIOS shared disks. At this stage we don’t care about a quorum.

![Figure 20: Cluster Core Resource with IP address is defined – new IP address needed however][sap-ha-guide-figure-3011]

_**Figure 20:** Cluster Core Resource with IP address is defined – new IP address needed however_


Since the IP address of the server is pointing to one of the VM nodes, the cluster cannot start up. We now need to change the IP address of the core cluster service.

E.g. we need to assign an IP-Address (in our example _**10.0.0.42**_) for the cluster virtual host name _**pr1-ascs-vir**_. This is done through the property page of the IP resource of the core cluster service as shown below

![Figure 21: Use ‘Properties’ to change to correct IP address][sap-ha-guide-figure-3012]

_**Figure 21:** Use ‘Properties’ to change to correct IP address_


![Figure 22: Assign the IP address reserved for the cluster][sap-ha-guide-figure-3013]

_**Figure 22:** Assign the IP address reserved for the cluster_

After changing the IP address, bring the cluster virtual hostname online. 

![Figure 23: Cluster Core Service up and running with the correct IP address][sap-ha-guide-figure-3014]

_**Figure 23:** Cluster Core Service up and running with the correct IP address_

Now that the Core Cluster Service is up and running you can add the second cluster node

![Figure 24: Add the second cluster node][sap-ha-guide-figure-3015]

_**Figure 24:** Add the second cluster node_

![Figure 25: Add the second cluster node hostname, e.g. pr1-ascs-1][sap-ha-guide-figure-3016]

_**Figure 25:** Add the second cluster node hostname, e.g. pr1-ascs-1_

![Figure 26: : Do NOT select check box!][sap-ha-guide-figure-3017]

_**Figure 26:** : Do NOT select check box!_

> [AZURE.NOTE]  
Make sure that check box “Add all eligible storage to the cluster” is **NOT** selected!  

![Figure 27: : Again ignore the warning around the disk quorum][sap-ha-guide-figure-3018]

_**Figure 27:** : Again ignore the warning around the disk quorum_

You can ignore warnings about Quorum and disks. Quorum and share disk setup will be configured later, as described in the chapter **[Installing SIOS DataKeeper Cluster Edition for SAP ASCS/SCS Cluster Share Disk][sap-ha-guide-8.12.3]**.

#### <a name="e49a4529-50c9-4dcf-bde7-15a0c21d21ca"></a> Configure Cluster File Share Witness

##### <a name="06260b30-d697-4c4d-b1c9-d22c0bd64855"></a> Create a File Share

We choose a File Share Witness instead of a Quorum Disk. This option is supported by SIOS DataKeeper.

In the configuration we use for illustrations in this paper, the File Share Witness is configured on the AD/DNS server that is running in Azure and is called _**domcontr-0**_. Since you would have configured a VPN connection to Azure (via Site-to-Site or ExpressRoute), your AD/DNS resides on premises and as a result is not suitable to run a FileShare Witness. 

> [AZURE.NOTE] In the case that your AD/DNS is running only on premises, do not configure your File Share Witness on AD/DNS Windows OS running on premises, because network latency between cluster nodes running on Azure and AD/DNS on premises might be too large and cause connectivity issues. Be sure to configure the File Share Witness on an Azure Windows VM running close to cluster node.  

The Quorum Drive needs at least 1024 MB Free Space. Recommended is 2048 MB

First step is to add the cluster name object 

![Figure 28: : Assign the permissions on the share for the cluster name object][sap-ha-guide-figure-3019]

_**Figure 28:** : Assign the permissions on the share for the cluster name object_

Make sure that the permissions include the ability to change data in the share for the cluster name object (in our example _**pr1-ascs-vir$**_ ). In order to add the cluster name object into the list shown above you need to press ‘**Add**’ and then change the filter to allow checking for computer objects as well as shown below.

![Figure 29: : Change Object type to include Computer Objects as well][sap-ha-guide-figure-3020]

_**Figure 29:** : Change Object type to include Computer Objects as well_

![Figure 30: : Check the box for computer objects][sap-ha-guide-figure-3021]

_**Figure 30:** : Check the box for computer objects_

After this, enter the cluster name object as shown in Figure 29. As the record should be created now, you can change the permissions as shown in Figure 28.

Next step is to use the ‘Security’ Tab of the share and define the finer granular permissions for the cluster name object.

![Figure 31: Set security attributes for the cluster name object on the file share quorum][sap-ha-guide-figure-3022]

_**Figure 31:** Set security attributes for the cluster name object on the file share quorum_

##### <a name="4c08c387-78a0-46b1-9d27-b497b08cac3d"></a> Configure File Share Witness Quorum in the Failover Cluster Manager

Next step is to change the cluster configuration to a file share witness using the Failover Cluster Manager.

![Figure 32: Call ‘Configure Cluster Quorum Setting Wizard’ as shown here][sap-ha-guide-figure-3023]

_**Figure 32:** Call ‘Configure Cluster Quorum Setting Wizard’ as shown here_

![Figure 33: Selection screen of different quorum configurations][sap-ha-guide-figure-3024]

_**Figure 33:** Selection screen of different quorum configurations_

In this selection, you need to choose "_**Select the quorum witness**_".

![Figure 34: Selection screen of file share witness][sap-ha-guide-figure-3025]

_**Figure 34:** Selection screen of file share witness_

In our case you need to choose "_**Configure a file share witness**_".

![Figure 35: Define file share location for witness share][sap-ha-guide-figure-3026]

_**Figure 35:** Define file share location for witness share_


Enter the UNC path to the file share (in our example `\\domcontr-0\FSW` )

Press ‘Next’ which will result in a list of  the changes you want to do. Check them and press ‘Next again to change the Cluster configuration.

![Figure 36: Screen showing successful reconfiguration in the cluster][sap-ha-guide-figure-3027]

_**Figure 36:** Screen showing successful reconfiguration in the cluster_

In this last step, the cluster configuration should be reconfigured successfully.  

### <a name="5c8e5482-841e-45e1-a89d-a05c0907c868"></a> Installing SIOS DataKeeper Cluster Edition for SAP ASCS/SCS Cluster Share Disk

The state we are in now is that we have a working Windows Server Failover Cluster configuration in Azure. However, this cluster configuration has no shared disk resource yet. In order to install a SAP ASCS/SCS, we need a shared disk resources. This is where SIOS DataKeeper Cluster Edition comes into play. Since Azure does not allow us to create a shared disk resources with the necessary functionality, we need to rely on e.g. SIOS DataKeeper to provide this functionality.

#### <a name="1c2788c3-3648-4e82-9e0d-e058e475e2a3"></a> Add the Microsoft .NET Framework 3.5 Feature

The Microsoft .NET framework 3.5 is not automatically enabled or installed on most recent Windows Server releases. However, SIOS DataKeeper requires the .NET framework on all nodes the product is getting installed on. Therefore, it is required to install .NET 3.5 on all the Guest OS of the different VMs.

There are two ways to add .Net 3.5 Framework. The first possibility is to use "**Add Roles and Features**" in Windows as shown below:

![Figure 37: Install .Net framework 3.5 through ‘Add Role and Features Wizard’][sap-ha-guide-figure-3028]

_**Figure 37:** Install .Net framework 3.5 through ‘Add Role and Features Wizard’_

![Figure 38: Progress bar installing .Net framework 3.5 through ‘Add Role and Features Wizard’][sap-ha-guide-figure-3029]

_**Figure 38:** Progress bar installing .Net framework 3.5 through ‘Add Role and Features Wizard’_

The second possibility to enable the .Net Framework 3.5 feature is using the command line tool _**dism.exe**_. For this type of installation, you need to have the ‘sxs’ directory of the Windows install media accessible. The following command needs to be executed in an elevated command line window:

```
Dism /online /enable-feature /featurename:NetFx3 /All /Source:installation_media_drive:\sources\sxs /LimitAccess
```

#### <a name="dd41d5a2-8083-415b-9878-839652812102"></a> Installing SIOS DataKeeper

Let’s go through the installation of the SIOS DataKeeper Cluster Edition. It needs to be installed on each of our two nodes in the cluster. The SIOS DataKeeper enables the creation of virtual shared storage by creating a synced mirror and simulating Cluster Shared Storage. 

Before installing the SIOS software, you have to create a domain user _**DataKeeperSvc**_. 

> [AZURE.NOTE] Add this _**DataKeeperSvc**_ user to the **local Administrators** group on both cluster nodes. 
  
Install the SIOS software on both cluster nodes

![SIOS installer][sap-ha-guide-figure-3030]

![Figure 39: First screen of SIOS DataKeeper installation][sap-ha-guide-figure-3031]

_**Figure 39:** First screen of SIOS DataKeeper installation_

![Figure 40: DataKeeper informs of a Service to be disabled][sap-ha-guide-figure-3032]

_**Figure 40:** DataKeeper informs of a Service to be disabled_

When you receive the pop-up in Figure 40, choose "_**Yes**_".

![Figure 41: User selection for SIOS DataKeeper][sap-ha-guide-figure-3033]

_**Figure 41:** User selection for SIOS DataKeeper_


In the screen above, we recommend to choose _**Domain or Server account**_.

![Figure 42: Supply domain user and password to SIOS DataKeeper installation][sap-ha-guide-figure-3034]

_**Figure 42:** Supply domain user and password to SIOS DataKeeper installation_

Specify the domain account you created for SIOS DataKeeper and the passwords of that account.

![Figure 43: Provide your SIOS DataKeeper license][sap-ha-guide-figure-3035]

_**Figure 43:** Provide your SIOS DataKeeper license_

Install the license key for your SIOS DataKeeper as shown in Figure 43. At the end of the installation, you will be asked to **reboot the VM**.

#### <a name="d9c1fc8e-8710-4dff-bec2-1f535db7b006"></a> Setup SIOS DataKeeper

After installing the SIOS DataKeeper on both nodes we have to start the configuration. The goal of the configuration is to have synchronous data replication between the additional VHD attached to each of the VMs. The following steps show the configuration on both nodes.

![Figure 44: DataKeeper Management and Configuration tool][sap-ha-guide-figure-3036]

_**Figure 44:** DataKeeper Management and Configuration tool_


Start the Management and Configuration Tool of DataKeeper and press the link "_**Connect Server**_" (circled in red above)

![Figure 45: Insert the name or TCP/IP address of the first node and in a second step the second node, the Management tool should connect to][sap-ha-guide-figure-3037]

_**Figure 45:** Insert the name or TCP/IP address of the first node and in a second step the second node, the Management tool should connect to_

The next step is to create the Replication Job between the two nodes

![Figure 46: Create Replication Job][sap-ha-guide-figure-3038]

_**Figure 46:** Create Replication Job_

A wizard will guide through the process

![Figure 47: Define the name of the Replication job][sap-ha-guide-figure-3039]

_**Figure 47:** Define the name of the Replication job_

![Figure 48: Define the base data for the node which should be the current source node][sap-ha-guide-figure-3040]

_**Figure 48:** Define the base data for the node which should be the current source node_

In a first step the name, the TCP/IP address and the disk volume of the source node needs to be defined. The second step is to define the target node. Again, the name, the TCP/IP address and the disk volume of the target node need to be defined.

![Figure 49: Define the base data for the node which should be the current target node][sap-ha-guide-figure-3041]

_**Figure 49:** Define the base data for the node which should be the current target node_

The next step is to define the compression algorithms which should be applied. For our purposes, we recommend to compress the replication stream. Especially in re-synchronization situations, the compression of the replication stream reduces the re-synchronization time dramatically. Be aware that compression utilizes CPU and RAM resources of a VM. Therefore, the higher the compression rate the more CPU utilization will occur. You can adjust and change this setting afterwards. 

Another setting you need to check is whether the replication is executed asynchronously or synchronously. **For protecting SAP ASCS/SCS configurations, the setting of Synchronous Replication is required**.  

![Figure 50: Define details of the replication][sap-ha-guide-figure-3042]

_**Figure 50:** Define details of the replication_

The last step is to define whether the volume which is replicated by the replication job should be represented to a WSFC cluster configuration as a shared disk. For the SAP ASCS/SCS configuration we need to choose ‘YES’ so that the Windows cluster sees the replicated volume as shared disk that can be used as cluster volume.

![Figure 51: Press ‘Yes’ to enable the replicated volume as cluster volume][sap-ha-guide-figure-3043]

_**Figure 51:** Press ‘Yes’ to enable the replicated volume as cluster volume_

After the creation is finished, the DataKeeper Management Tool lists the replication job as active.

![Figure 52: DataKeeper synchronous mirroring for SAP ASCS/SCS share disk is active][sap-ha-guide-figure-3044]

_**Figure 52:** DataKeeper synchronous mirroring for SAP ASCS/SCS share disk is active_

As a result, the disk can now be seen in the Windows Failover Cluster Manager as a DataKeeper Disk as shown below.

![Figure 53: The replicated disk by DataKeeper is shown in Failover Cluster Manager][sap-ha-guide-figure-3045]

_**Figure 53:** The replicated disk by DataKeeper is shown in Failover Cluster Manager_


## <a name="a06f0b49-8a7a-42bf-8b0d-c12026c5746b"></a> Installation of SAP NetWeaver System

We won’t describe the setup of the DBMS since setups will vary dependent on the DBMS system used. However, we assume that High-Availability concerns with the DBMS are addressed with the functionalities the different DBMS vendors support for Azure. E.g. AlwaysOn or Database Mirroring for SQL Server and Oracle Data Guard for Oracle. In our example scenario used for this documentation, we did not protect the DBMS additionally. 

There also are no special considerations with the different DBMS to interact with such a clustered SAP ASCS/SCS configuration on Azure.

> [AZURE.NOTE]  
The installation procedure of SAP NetWeaver ABAP systems, Java systems and ABAP+Java systems is almost identical. The biggest difference is that a SAP ABAP system has one ASCS instance. The SAP Java system has one SCS instance and SAP ABAP+Java system one ASCS and one SCS instance running in the same Microsoft failover cluster group. Any installation difference for each SAP NetWeaver installation stack will be explicitly mentioned. All other parts are assumed to be the same.  

### <a name="31c6bd4f-51df-4057-9fdf-3fcbc619c170"></a> SAP Installation with High Available ASCS/SCS Instance

> [AZURE.NOTE]  
Do NOT place your page file on DataKeeper mirrored volumes, as it is not supported by DataKeeper. You can leave your page file on the temporary D:\ drive of an Azure VM where it is placed already when deploying a VM in Azure. If it isn’t the case, please correct it and put the Windows pagefile on the D:\ drive of your Azure VM.

#### <a name="a97ad604-9094-44fe-a364-f89cb39bf097"></a> Create Virtual Hostname for clustered SAP ASCS/SCS

A first step is to create the necessary DNS entry for the Virtual Hostname of the ASCS/SCS Instance. The tool used to do this is the Windows DNS Manager. Besides the Virtual hostname, the IP address assigned to the Virtual Hostname needs to be defined as well. 

> [AZURE.NOTE]  
**Keep in mind that the IP address we assign to the Virtual Hostname of the ASCS/SCS instance needs to be the same as the IP address we have assigned to the Azure Load Balancer (`<sid>-lb-ascs`)  
IP address of Virtual SAP ASCS/SCS Hostname `(pr1-ascs-sap)` = IP address of Azure Load Balancer `(pr1-lb-ascs)`**

This also means that only one SAP Failover Cluster role, e.g. for ABAP system one ASCS instance, for Java system one SCS instance , and for ABAP+Java one ASCS and one SCS instance can run in one Windows Server Failover Cluster on Azure. 

> [AZURE.NOTE] Multi-SID clustering as described in SAP Installation Guide (see [SAP Installation Guides][sap-installation-guides] ) currently does not work in Azure. 

![Figure 54: Defining the DNS entry for the SAP ASCS/SCS cluster virtual name and TCP/IP address][sap-ha-guide-figure-3046]

_**Figure 54:** Defining the DNS entry for the SAP ASCS/SCS cluster virtual name and TCP/IP address_

The entry is shown in the DNS manager under the domain as shown in the next figure.

![Figure 55: New virtual name and TCP/IP address listed for SAP ASCS/SCS cluster configuration][sap-ha-guide-figure-3047]

_**Figure 55:** New virtual name and TCP/IP address listed for SAP ASCS/SCS cluster configuration_

#### <a name="eb5af918-b42f-4803-bb50-eff41f84b0b0"></a> Install SAP First Cluster Node

The installation of the first ASCS/SCS cluster node does not differ in any way from the way it is documented in the SAP Installation documentation by: 
- Execute the First Cluster Node option on cluster node A, e.g. on _**pr1-ascs-0**_ host as in our example.

If you want to keep the default ports for Azure Internal Load Balancer, then choose:

- For **ABAP system** - **ASCS** instance number **00**
- For **Java system** - **SCS** instance number **01**
- For **ABAP + JAVA system** - **ASCS** instance number **00** and **SCS** instance number **01**

If you want to use other instance numbers than 00 for ABAP ASCS instance and 01 for Java SCS instance, you need to first change the Azure ILB default load balancing rules, as described in: **[Changing ASCS/SCS Default Load Balancing Rules for Azure Internal Load Balancer (ILB)][sap-ha-guide-8.9]**.

After this step finished, you need to perform a few steps which are not described in the usual SAP installation documentation. 

#### <a name="e4caaab2-e90f-4f2c-bc84-2cd2e12a9556"></a> Modify the SAP profile of the ASCS/SCS instance

A new profile parameter needs to be added. This profile parameter prevents the closing of connections between SAP work processes and the enqueue server when they are idle for too long. We mentioned the problem scenario in the chapter **[Add Registry Entries on Both Cluster Nodes used for SAP ASCS/SCS Instance][sap-ha-guide-8.11]** of this document.  In that section, we introduced two changes to some basic TCP/IP connection parameters as well. In a second step we need to configure the enqueue server to send a **keep_alive** signal so that the connections do not hit the idle threshold of the Azure ILB. For this purpose, add this profile parameter:

```
enque/encni/set_so_keepalive = true
```

to the SAP ASCS/SCS instance profile. In our example, the path is: 

`<ShareDisk>:\usr\sap\PR1\SYS\profile\PR1_ASCS00_pr1-ascs-sap`

e.g. to the SAP SCS instance profile and corresponding path 

`<ShareDisk>:\usr\sap\PR1\SYS\profile\PR1_SCS01_pr1-ascs-sap`


#### <a name="10822f4f-32e7-4871-b63a-9b86c76ce761"></a> Add Probe Port

In order to make the whole Cluster configuration work with an Azure Load Balancer, we need to leverage the probe functionality of the Internal Load Balancer. An Azure Internal Load Balancer usually balances and distributes the incoming workload equally between the participating virtual machines. However, that would not work in such a cluster configuration since only one of the instances is active and the other is passive and can’t accept workload. In order to enable configurations where the Azure Internal Load Balancer will assign work to the active instance(s) only, a probe functionality was established. Through that functionality, the Internal Load Balancer has the possibility to check which of the instances are active and subsequently target only that instance with the workload.  First, let’s check the current _**ProbePort**_ setting with this PowerShell command executed within one of the VMs engaged in the cluster configuration:

```PowerShell
Get-ClusterResource „SAP PR1 IP" | Get-ClusterParameter 
```

![Figure 56: Probe port of Cluster configuration is 0 by default][sap-ha-guide-figure-3048]

_**Figure 56:** Probe port of Cluster configuration is 0 by default_

By default, the probe port number is set to 0. In order to make the configuration work, a port needs to be defined. In our case we have to use probe port _**62300**_, as this port number is defined in the SAP Azure Resource Manager templates. Assigning that port number can be done with the two commands below:

First get the SAP virtual host name cluster resource _**SAP WAC IP**_

```PowerShell
$var = Get-ClusterResource | Where-Object {  $_.name -eq "SAP PR1 IP"  } 
```

And then set the probe port to 62300 

```PowerShell
$var | Set-ClusterParameter -Multiple @{"Address"="10.0.0.43";"ProbePort"=62300;"Subnetmask"="255.255.255.0";"Network"="Cluster Network 1";"OverrideAddressMatch"=1;"EnableDhcp"=0}  
```

You need to stop and start the _**SAP PR1**_ cluster role in order to activate the changes.

After bringing the _**SAP PR1**_ cluster role online, check that _**ProbePort**_ is set to new value:

```PowerShell
Get-ClusterResource „SAP PR1 IP" | Get-ClusterParameter 
```

![Figure 57: Probe port of Cluster after change][sap-ha-guide-figure-3049]

_**Figure 57:** Probe port of Cluster after change_

You can see that the _**ProbePort**_ is now set to _**62300**_. Now you are able to access the file share _**\\\ascsha-clsap\sapmnt**_ from other hosts like _**ascsha-dbas**_.

### <a name="85d78414-b21d-4097-92b6-34d8bcb724b7"></a> Installing the Database Instance

Installing the database instance is in no way different from the process as described in the SAP installation documentation. Therefore, it is not documented here.

### <a name="8a276e16-f507-4071-b829-cdc0a4d36748"></a> Installation Second Cluster Node

Again, the installation of the second cluster nodes does not differ from the SAP installation documentation. Therefore, follow the steps in the installation guide for installing the second cluster node.

### <a name="094bc895-31d4-4471-91cc-1513b64e406a"></a> Change Windows Service Startup Type of SAP ERS Instance

Change the startup type of the SAP ERS Windows service(s) to _**Automatic (Delayed Start)**_ on both cluster nodes.

![Figure 58: Change Service type for SAP ERS instance to delayed automatic][sap-ha-guide-figure-3050]

_**Figure 58:** Change Service type for SAP ERS instance to delayed automatic_

### <a name="2477e58f-c5a7-4a5d-9ae3-7b91022cafb5"></a> Installation of SAP Primary Application Server (PAS)

Execute the Primary Application Server Instance `<sid>-di-0` installation on the VM designated for hosting the PAS. There are no dependencies to Azure or DataKeeper specifics.

### <a name="0ba4a6c1-cc37-4bcf-a8dc-025de4263772"></a> Installation of SAP Additional Application Server (AAS)

Execute the installation of an additional SAP Application Server on all VMs designated for hosting an SAP Application Server, e.g. on `<sid>-di-1` till `<sid>-di-<n>`.

## <a name="18aa2b9d-92d2-4c0e-8ddd-5acaabda99e9"></a> Testing SAP ASCS/SCS Instance Failover and SIOS Replication

You can easily test and monitor a SAP ASCS/SCS instance failover and SIOS disk replication using the _**Failover Cluster Manager**_ and the SIOS DataKeeper UI. 

### <a name="65fdef0f-9f94-41f9-b314-ea45bbfea445"></a> Starting point – SAP ASCS/SCS instance is running on Cluster Node A

The _**SAP WAC**_ cluster group is running on cluster node A, e.g. on _**ascsha-clna**_. The shared disk S: that is part of the _**SAP WAC**_ cluster group and used by the ASCS/SCS instance, is assigned to cluster node A. 

![Figure 59: : Failover Cluster Manager: SAP <SID> cluster group is running on cluster Node A][sap-ha-guide-figure-5000]

_**Figure 59:** : Failover Cluster Manager: SAP <SID> cluster group is running on cluster Node A_

Using the SIOS DataKeeper UI, you can see that the shared disk data is synchronously replicated from source volume S: on cluster node A (e.g. _**ascsha-clna [10.0.0.41]**_) to target volume _**S:**_ on cluster node B (e.g. _**ascsha-clnb [10.0.0.42]**_)

![Figure 60: SIOS DataKeeper: Replicating local volume from cluster node A to cluster node B][sap-ha-guide-figure-5001]

_**Figure 60:** SIOS DataKeeper: Replicating local volume from cluster node A to cluster node B_


### <a name="5e959fa9-8fcd-49e5-a12c-37f6ba07b916"></a> Failover process from Node A to Node B

You can initiate a failover of the SAP <SID> cluster group from cluster node A to cluster node B:

- using Failover Cluster Manager  

- using Failover Cluster PowerShell

  ```powershell
  Move-ClusterGroup -Name "SAP WAC" 
  ```

- restarting cluster node A within the Windows guest OS  
(This will initiate an automatic failover of SAP <SID> cluster group from Node A to Node B)  

- restarting cluster node A from the Azure portal  
(This will initiate an automatic failover of SAP <SID> cluster group from Node A to Node B)  

- restarting cluster node A using Azure PowerShell  
(This will initiate an automatic failover of SAP <SID> cluster group from Node A to Node B)  

  ```powershell
  Restart-AzureVM -Name ascsha-clna -ServiceName ascsha-cluster
  ```

### <a name="755a6b93-0099-4533-9f6d-5c9a613878b5"></a> Final result – SAP ASCS/SCS instance is running on Cluster Node B

After failing over, the `SAP <SID>` cluster group is running on cluster node B, e.g. on _**ascsha-clnb**_.

![Figure 61: Failover Cluster Manager: SAP <SID> cluster group is running on cluster Node B][sap-ha-guide-figure-5002]

_**Figure 61:** Failover Cluster Manager: SAP <SID> cluster group is running on cluster Node B_

The shared disk is now mounted on cluster node B. SIOS DataKeeper is replicating data from source volume S: on cluster node B (e.g. _**ascsha-clnb [10.0.0.42]**_) to target volume S: on cluster node A (e.g. _**ascsha-clna [10.0.0.41]**_).

![Figure 62: SIOS DataKeeper: Replicating local volume from cluster node B to cluster node A][sap-ha-guide-figure-5003]

_**Figure 62:** SIOS DataKeeper: Replicating local volume from cluster node B to cluster node A_

