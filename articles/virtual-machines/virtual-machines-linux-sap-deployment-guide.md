<properties
   pageTitle="SAP NetWeaver on Linux virtual machines (VMs) – Deployment Guide | Microsoft Azure"
   description="SAP NetWeaver on Linux virtual machines (VMs) – Deployment Guide"
   services="virtual-machines-linux,virtual-network,storage"
   documentationCenter="saponazure"
   authors="MSSedusch"
   manager="juergent"
   editor=""
   tags="azure-resource-manager"
   keywords=""/>
<tags
   ms.service="virtual-machines-linux"
   ms.devlang="NA"
   ms.topic="campaign-page"
   ms.tgt_pltfrm="vm-linux"
   ms.workload="na"
   ms.date="05/17/2016"
   ms.author="sedusch"/>

# SAP NetWeaver on Azure virtual machines (VMs) – Deployment Guide

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

[azure-cli]:../xplat-cli-install.md
[azure-portal]:https://portal.azure.com
[azure-ps]:../powershell-install-configure.md
[azure-quickstart-templates-github]:https://github.com/Azure/azure-quickstart-templates
[azure-script-ps]:https://go.microsoft.com/fwlink/p/?LinkID=395017
[azure-subscription-service-limits]:../azure-subscription-service-limits.md
[azure-subscription-service-limits-subscription]:../azure-subscription-service-limits.md#subscription

[dbms-guide]:virtual-machines-linux-sap-dbms-guide.md (SAP NetWeaver on Linux virtual machines (VMs) – DBMS Deployment Guide)
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

[dbms-guide-figure-100]:./media/virtual-machines-linux-sap-dbms-guide/100_storage_account_types.png
[dbms-guide-figure-200]:./media/virtual-machines-linux-sap-dbms-guide/200-ha-set-for-dbms-ha.png
[dbms-guide-figure-300]:./media/virtual-machines-linux-sap-dbms-guide/300-reference-config-iaas.png
[dbms-guide-figure-400]:./media/virtual-machines-linux-sap-dbms-guide/400-sql-2012-backup-to-blob-storage.png
[dbms-guide-figure-500]:./media/virtual-machines-linux-sap-dbms-guide/500-sql-2012-backup-to-blob-storage-different-containers.png
[dbms-guide-figure-600]:./media/virtual-machines-linux-sap-dbms-guide/600-iaas-maxdb.png
[dbms-guide-figure-700]:./media/virtual-machines-linux-sap-dbms-guide/700-livecach-prod.png
[dbms-guide-figure-800]:./media/virtual-machines-linux-sap-dbms-guide/800-azure-vm-sap-content-server.png
[dbms-guide-figure-900]:./media/virtual-machines-linux-sap-dbms-guide/900-sap-cache-server-on-premises.png

[deployment-guide]:virtual-machines-linux-sap-deployment-guide.md (SAP NetWeaver on Linux virtual machines (VMs) – Deployment Guide)
[deployment-guide-2.2]:virtual-machines-linux-sap-deployment-guide.md#42ee2bdb-1efc-4ec7-ab31-fe4c22769b94 (SAP Resources)
[deployment-guide-3.1.2]:virtual-machines-linux-sap-deployment-guide.md#3688666f-281f-425b-a312-a77e7db2dfab (Deploying a VM with a custom image)
[deployment-guide-3.2]:virtual-machines-linux-sap-deployment-guide.md#db477013-9060-4602-9ad4-b0316f8bb281 (Scenario 1: Deploying a VM out of the Azure Marketplace for SAP)
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
[deployment-guide-figure-100]:./media/virtual-machines-linux-sap-deployment-guide/100-deploy-vm-image.png
[deployment-guide-figure-1000]:./media/virtual-machines-linux-sap-deployment-guide/1000-service-properties.png
[deployment-guide-figure-11]:virtual-machines-linux-sap-deployment-guide.md#figure-11
[deployment-guide-figure-1100]:./media/virtual-machines-linux-sap-deployment-guide/1100-azperflib.png
[deployment-guide-figure-1200]:./media/virtual-machines-linux-sap-deployment-guide/1200-cmd-test-login.png
[deployment-guide-figure-1300]:./media/virtual-machines-linux-sap-deployment-guide/1300-cmd-test-executed.png
[deployment-guide-figure-14]:virtual-machines-linux-sap-deployment-guide.md#figure-14
[deployment-guide-figure-1400]:./media/virtual-machines-linux-sap-deployment-guide/1400-azperflib-error-servicenotstarted.png
[deployment-guide-figure-300]:./media/virtual-machines-linux-sap-deployment-guide/300-deploy-private-image.png
[deployment-guide-figure-400]:./media/virtual-machines-linux-sap-deployment-guide/400-deploy-using-disk.png
[deployment-guide-figure-5]:virtual-machines-linux-sap-deployment-guide.md#figure-5
[deployment-guide-figure-50]:./media/virtual-machines-linux-sap-deployment-guide/50-forced-tunneling-suse.png
[deployment-guide-figure-500]:./media/virtual-machines-linux-sap-deployment-guide/500-install-powershell.png
[deployment-guide-figure-6]:virtual-machines-linux-sap-deployment-guide.md#figure-6
[deployment-guide-figure-600]:./media/virtual-machines-linux-sap-deployment-guide/600-powershell-version.png
[deployment-guide-figure-7]:virtual-machines-linux-sap-deployment-guide.md#figure-7
[deployment-guide-figure-700]:./media/virtual-machines-linux-sap-deployment-guide/700-install-powershell-installed.png
[deployment-guide-figure-760]:./media/virtual-machines-linux-sap-deployment-guide/760-azure-cli-version.png
[deployment-guide-figure-900]:./media/virtual-machines-linux-sap-deployment-guide/900-cmd-update-executed.png
[deployment-guide-figure-azure-cli-installed]:virtual-machines-linux-sap-deployment-guide.md#402488e5-f9bb-4b29-8063-1c5f52a892d0
[deployment-guide-figure-azure-cli-version]:virtual-machines-linux-sap-deployment-guide.md#0ad010e6-f9b5-4c21-9c09-bb2e5efb3fda
[deployment-guide-install-vm-agent-windows]:virtual-machines-linux-sap-deployment-guide.md#b2db5c9a-a076-42c6-9835-16945868e866
[deployment-guide-troubleshooting-chapter]:virtual-machines-linux-sap-deployment-guide.md#564adb4f-5c95-4041-9616-6635e83a810b (Checks and Troubleshooting for End-to-End Monitoring Setup for SAP on Azure)

[deploy-template-cli]:../resource-group-template-deploy.md#deploy-with-azure-cli-for-mac-linux-and-windows
[deploy-template-portal]:../resource-group-template-deploy.md#deploy-with-the-preview-portal
[deploy-template-powershell]:../resource-group-template-deploy.md#deploy-with-powershell

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

[Logo_Linux]:./media/virtual-machines-linux-sap-shared/Linux.png
[Logo_Windows]:./media/virtual-machines-linux-sap-shared/Windows.png

[msdn-set-azurermvmaemextension]:https://msdn.microsoft.com/library/azure/mt670598.aspx

[planning-guide]:virtual-machines-linux-sap-planning-guide.md (SAP NetWeaver on Linux virtual machines (VMs) – Planning and Implementation Guide)
[planning-guide-1.2]:virtual-machines-linux-sap-planning-guide.md#e55d1e22-c2c8-460b-9897-64622a34fdff (Resources)
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

[planning-guide-figure-100]:./media/virtual-machines-linux-sap-planning-guide/100-single-vm-in-azure.png
[planning-guide-figure-1300]:./media/virtual-machines-linux-sap-planning-guide/1300-ref-config-iaas-for-sap.png
[planning-guide-figure-1400]:./media/virtual-machines-linux-sap-planning-guide/1400-attach-detach-disks.png
[planning-guide-figure-1600]:./media/virtual-machines-linux-sap-planning-guide/1600-firewall-port-rule.png
[planning-guide-figure-1700]:./media/virtual-machines-linux-sap-planning-guide/1700-single-vm-demo.png
[planning-guide-figure-1900]:./media/virtual-machines-linux-sap-planning-guide/1900-vm-set-vnet.png
[planning-guide-figure-200]:./media/virtual-machines-linux-sap-planning-guide/200-multiple-vms-in-azure.png
[planning-guide-figure-2100]:./media/virtual-machines-linux-sap-planning-guide/2100-s2s.png
[planning-guide-figure-2200]:./media/virtual-machines-linux-sap-planning-guide/2200-network-printing.png
[planning-guide-figure-2300]:./media/virtual-machines-linux-sap-planning-guide/2300-sapgui-stms.png
[planning-guide-figure-2400]:./media/virtual-machines-linux-sap-planning-guide/2400-vm-extension-overview.png
[planning-guide-figure-2500]:./media/virtual-machines-linux-sap-planning-guide/2500-vm-extension-details.png
[planning-guide-figure-2600]:./media/virtual-machines-linux-sap-planning-guide/2600-sap-router-connection.png
[planning-guide-figure-2700]:./media/virtual-machines-linux-sap-planning-guide/2700-exposed-sap-portal.png
[planning-guide-figure-2800]:./media/virtual-machines-linux-sap-planning-guide/2800-endpoint-config.png
[planning-guide-figure-2900]:./media/virtual-machines-linux-sap-planning-guide/2900-azure-ha-sap-ha.png
[planning-guide-figure-300]:./media/virtual-machines-linux-sap-planning-guide/300-vpn-s2s.png
[planning-guide-figure-3000]:./media/virtual-machines-linux-sap-planning-guide/3000-sap-ha-on-azure.png
[planning-guide-figure-3200]:./media/virtual-machines-linux-sap-planning-guide/3200-sap-ha-with-sql.png
[planning-guide-figure-400]:./media/virtual-machines-linux-sap-planning-guide/400-vm-services.png
[planning-guide-figure-600]:./media/virtual-machines-linux-sap-planning-guide/600-s2s-details.png
[planning-guide-figure-700]:./media/virtual-machines-linux-sap-planning-guide/700-decision-tree-deploy-to-azure.png
[planning-guide-figure-800]:./media/virtual-machines-linux-sap-planning-guide/800-portal-vm-overview.png
[planning-guide-microsoft-azure-networking]:virtual-machines-linux-sap-planning-guide.md#61678387-8868-435d-9f8c-450b2424f5bd (Microsoft Azure Networking)
[planning-guide-storage-microsoft-azure-storage-and-data-disks]:virtual-machines-linux-sap-planning-guide.md#a72afa26-4bf4-4a25-8cf7-855d6032157f (Storage: Microsoft Azure Storage and Data Disks)

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
[virtual-machines-azure-resource-manager-architecture]:../resource-manager-deployment-model.md
[virtual-machines-azurerm-versus-azuresm]:virtual-machines-linux-compare-deployment-models.md
[virtual-machines-windows-classic-configure-oracle-data-guard]:virtual-machines-windows-classic-configure-oracle-data-guard.md
[virtual-machines-linux-cli-deploy-templates]:virtual-machines-linux-cli-deploy-templates.md (Deploy and manage virtual machines by using Azure Resource Manager templates and the Azure CLI)
[virtual-machines-deploy-rmtemplates-powershell]:virtual-machines-windows-ps-manage.md (Manage virtual machines using Azure Resource Manager and PowerShell)
[virtual-machines-linux-agent-user-guide]:virtual-machines-linux-agent-user-guide.md
[virtual-machines-linux-agent-user-guide-command-line-options]:virtual-machines-linux-agent-user-guide.md#command-line-options
[virtual-machines-linux-capture-image]:virtual-machines-linux-capture-image.md
[virtual-machines-linux-capture-image-resource-manager]:virtual-machines-linux-capture-image.md
[virtual-machines-linux-capture-image-resource-manager-capture]:virtual-machines-linux-capture-image.md#capture-the-vm
[virtual-machines-linux-configure-raid]:virtual-machines-linux-configure-raid.md
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
[virtual-machines-windows-classic-ps-sql-alwayson-availability-groups]:virtual-machines-windows-classic-ps-sql-alwayson-availability-groups.md
[virtual-machines-windows-classic-ps-sql-int-listener]:virtual-machines-windows-classic-ps-sql-int-listener.md
[virtual-machines-sql-server-high-availability-and-disaster-recovery-solutions]:virtual-machines-windows-sql-high-availability-dr.md
[virtual-machines-sql-server-infrastructure-services]:virtual-machines-windows-sql-server-iaas-overview.md
[virtual-machines-sql-server-performance-best-practices]:virtual-machines-windows-sql-performance.md
[virtual-machines-upload-image-windows-resource-manager]:virtual-machines-windows-upload-image.md
[virtual-machines-windows-tutorial]:virtual-machines-windows-hero-tutorial.md
[virtual-machines-workload-template-sql-alwayson]:https://azure.microsoft.com/documentation/templates/sql-server-2014-alwayson-dsc/
[virtual-network-deploy-multinic-arm-cli]:../virtual-network/virtual-network-deploy-multinic-arm-cli.md
[virtual-network-deploy-multinic-arm-ps]:../virtual-network/virtual-network-deploy-multinic-arm-ps.md
[virtual-network-deploy-multinic-arm-template]:../virtual-network/virtual-network-deploy-multinic-arm-template.md
[virtual-networks-configure-vnet-to-vnet-connection]:../vpn-gateway/virtual-networks-configure-vnet-to-vnet-connection.md
[virtual-networks-create-vnet-arm-pportal]:../virtual-network/virtual-networks-create-vnet-arm-pportal.md
[virtual-networks-manage-dns-in-vnet]:../virtual-network/virtual-networks-manage-dns-in-vnet.md
[virtual-networks-multiple-nics]:../virtual-network/virtual-networks-multiple-nics.md
[virtual-networks-nsg]:../virtual-network/virtual-networks-nsg.md
[virtual-networks-reserved-private-ip]:../virtual-network/virtual-networks-static-private-ip-arm-ps.md
[virtual-networks-static-private-ip-arm-pportal]:../virtual-network/virtual-networks-static-private-ip-arm-pportal.md
[virtual-networks-udr-overview]:../virtual-network/virtual-networks-udr-overview.md
[vpn-gateway-about-vpn-devices]:../vpn-gateway/vpn-gateway-about-vpn-devices.md
[vpn-gateway-create-site-to-site-rm-powershell]:../vpn-gateway/vpn-gateway-create-site-to-site-rm-powershell.md
[vpn-gateway-cross-premises-options]:../vpn-gateway/vpn-gateway-cross-premises-options.md
[vpn-gateway-site-to-site-create]:../vpn-gateway/vpn-gateway-site-to-site-create.md
[vpn-gateway-vpn-faq]:../vpn-gateway/vpn-gateway-vpn-faq.md
[xplat-cli]:../xplat-cli-install.md
[xplat-cli-azure-resource-manager]:../xplat-cli-azure-resource-manager.md

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-rm-include.md)] classic deployment model.

Microsoft Azure enables companies to acquire compute and storage resources in minimal time without lengthy procurement cycles. Azure Virtual Machines allows companies to deploy classical applications, like SAP NetWeaver based applications into Azure and extend their reliability and availability without having further resources available on-premises. Microsoft Azure also supports cross-premises connectivity, which enables companies to actively integrate Azure Virtual Machines into their on-premises domains, their Private Clouds and their SAP System Landscape.

This white paper describes step by step how a Azure Virtual Machine is prepared for the deployment of SAP NetWeaver based applications. It assumes that the information contained in the [Planning and Implementation Guide][planning-guide] is known. If not, the respective document should be read first.

The paper complements the SAP Installation Documentation and SAP Notes which represent the primary resources for installations and deployments of SAP software on given platforms.

[AZURE.INCLUDE [windows-warning](../../includes/virtual-machines-linux-sap-warning.md)]

## Introduction
A large number of companies worldwide use SAP NetWeaver based applications – most prominently the SAP Business Suite – to run their mission critical business processes. System health is therefore a crucial asset, and the ability to provide enterprise support in case of a malfunction, including performance incidents, becomes a vital requirement.
Microsoft Azure provides superior platform instrumentation to accommodate the supportability requirements of all business critical applications. This guide makes sure that a Microsoft Azure Virtual Machine targeted for deployment of SAP Software is configured such that enterprise support can be offered, regardless which way the Virtual Machine gets created, be it taken out of the Azure Marketplace or using a customer specific image.
In the following, all necessary setup steps are described in detail.

## Prerequisites and Resources
### Prerequisites
Before you start, please make sure that the prerequisites that are the described in the following chapters are met.

#### Local Personal Computer
The setup of an Azure Virtual Machine for SAP Software deployment comprises of several steps. To manage Windows VMs or Linux VMs, you need to use a PowerShell script and the Microsoft Azure Portal. For that, a local Personal Computer running Windows 7 or higher is necessary. If you only want to manage Linux VMs and want to use a Linux machine for this task, you can also use the Azure Command Line Interface (Azure CLI).

#### Internet connection
To download and execute the required tools and scripts, an Internet connection is required. Furthermore, the Microsoft Azure Virtual Machine running the Azure Enhanced Monitoring Extension needs access to the Internet. In case this Azure VM is part of an Azure Virtual Network or on-premises domain, make sure that the relevant proxy settings are set as described in chapter [Configure Proxy][deployment-guide-configure-proxy] in this document.

#### Microsoft Azure Subscription
An Azure account already exists and according Logon credentials are known.

#### Topology consideration and Networking
The topology and architecture of the SAP deployment in Azure needs to be defined. Architecture in regards to:

* Microsoft Azure Storage account(s) to be used
* Virtual Network to deploy the SAP system into
* Resource Group to deploy the SAP system into
* Azure Region to deploy the SAP system
* SAP configuration (2-Tier or 3-Tier)
* VM size(s) and number of additional VHDs to be mounted to the VM(s)
* SAP Transport and Correction system configuration

Azure Storage Accounts or Azure Virtual Networks as such should have been created and configured already. How to create and configure them is covered in the [Planning and Implementation Guide][planning-guide].

#### SAP Sizing
* The projected SAP workload has been determined, e.g. by using the SAP Quicksizer, and the according SAPS number is known 
* The required CPU resource and memory consumption of the SAP system should be known
* The required I/O operations per second should be known
* The required network bandwidth in eventual communication between different VMs in Azure is known
* The required network bandwidth between the on-premises assets and the Azure deployed SAP systems is known

#### Resource Groups
Resource groups are a new concept that contain all resources that have the same lifecycle e.g. they are created and deleted at the same time. Read [this article][resource-group-overview] for more information about resource groups. 

### <a name="42ee2bdb-1efc-4ec7-ab31-fe4c22769b94"></a>SAP Resources
During the configuration work, the following resources are needed:

* SAP Note [1928533]
	* the list of Azure Virtual Machine sizes, which are supported for the deployment of SAP Software 
	* important capacity information per Azure Virtual Machine size
	* supported SAP software and OS and DB combination
* SAP Note [2015553] listing prerequisites to be supported by SAP when deploying SAP software into Microsoft Azure.
* SAP Note [1999351] containing additional troubleshooting information for the Enhanced Azure Monitoring for SAP.
* SAP Note [2178632] containing detail information on all available monitoring metrics for SAP on Microsoft Azure. 
* SAP Note [1409604] containing the required SAP Host Agent version for Windows on Microsoft Azure when deploying on the new Azure Resource Manager.
* SAP Note [2191498] containing the required SAP Host Agent version for Linux on Microsoft Azure when deploying on the new Azure Resource Manager.
* SAP Note [2243692] containing information about licensing for SAP on Linux on Azure
* SAP Note [1984787] containing general information about SUSE LINUX Enterprise Server 12
* SAP Note [2002167] containing general information Red Hat Enterprise Linux 7.x
* [SCN](https://wiki.scn.sap.com/wiki/display/HOME/SAPonLinuxNotes) that contains all required SAP Notes for Linux
* SAP specific PowerShell cmdlets that are part of the [Azure PowerShell][azure-ps]
* SAP specific Azure CLI that are part of the [Azure CLI][azure-cli]
* [Microsoft Azure Portal][azure-portal]

[comment]: <> (MSSedusch TODO Add ARM patch level for SAP Host Agent in SAP Note 1409604)
 
The following guides cover the topic of SAP on Microsoft Azure as well:

* [SAP NetWeaver on Azure virtual machines (VMs) – Planning and Implementation Guide][planning-guide]
* [SAP NetWeaver on Azure virtual machines (VMs) – Deployment Guide (this document)][deployment-guide]
* [SAP NetWeaver on Azure virtual machines (VMs) – DBMS Deployment Guide][dbms-guide]

## <a name="b3253ee3-d63b-4d74-a49b-185e76c4088e"></a>Deployment Scenarios of VMs for SAP on Microsoft Azure
In this chapter, you learn the different ways of deployment and the single steps for each deployment type.

### Deployment of VMs for SAP
Microsoft Azure offers multiple ways to deploy VMs and associated disks. Thereby it is very important to understand the differences since preparations of the VMs might differ dependent on the way of deployment. In general, we look into the following scenarios:

#### Deploying a VM out of the Azure Marketplace
You like to take a Microsoft or 3rd party provided image out of the Azure Marketplace to deploy your VM. After you deployed your VM on Microsoft Azure, you follow the same guidelines and tools to install the SAP software inside your VM as you would do in an on-premises environment. For installing the SAP software inside the Azure VM, SAP and Microsoft recommend to upload and store the SAP installation media in Azure VHDs or to create an Azure VM working as a ‘File server’ which contains all the necessary SAP installation media.

[comment]: <> (MSSedusch TODO why do we need to recommend a file management e.g. File Server or VHD? Is that so different from on-premises?)

For more details see chapter [Scenario 1: Deploying a VM out of the Azure Marketplace for SAP][deployment-guide-3.2].

#### <a name="3688666f-281f-425b-a312-a77e7db2dfab"></a>Deploying a VM with a custom image
Due to specific patch requirements in regards to your OS or DBMS version, the provided images out of the Azure Marketplace might not fit your needs. Therefore, you might need to create a VM using your own ‘private’ OS/DB VM image which can be deployed several times afterwards.
The steps to create a private image differ between a Windows and a Linux image.

___

> ![Windows][Logo_Windows] Windows
>
> To prepare a Windows image that can be used to deploy multiple virtual machines, the Windows settings (like Windows SID and hostname) must be abstracted/generalized on the on-premises VM. This can be done using sysprep as described on <https://technet.microsoft.com/library/cc721940.aspx>.
>
> ![Linux][Logo_Linux] Linux
>
> To prepare a Linux image that can be used to deploy multiple virtual machines, some Linux settings must be abstracted/generalized on the on-premises VM. This can be done using waagent -deprovision as described in [this article][virtual-machines-linux-capture-image] or in [this article][virtual-machines-linux-agent-user-guide-command-line-options].

___

You can set up your database content by either using the SAP Software Provision Manager to install a new SAP System, restore a database backup from a VHD that is attached to the virtual machine or directly restore a database backup from Azure Storage if the DBMS supports it. (see the [DBMS Deployment Guide][dbms-guide]). If you have already installed an SAP system in your on-premises VM (especially for 2-Tier systems), you can adapt the SAP system settings after the deployment of the Azure VM through the System Rename procedure supported by the SAP Software Provisioning Manager (SAP Note [1619720]). Otherwise you can install the SAP software later after the deployment of the Azure VM.

For more details see chapter [Scenario 2: Deploying a VM with a custom image for SAP][deployment-guide-3.3].

#### Moving a VM from on-premises to Microsoft Azure with a non-generalized disk
You plan to move a specific SAP system from on-premises to Microsoft Azure. This can be done by uploading the VHD which contains the OS, the SAP binaries and eventual DBMS binaries plus the VHDs with the data and log files of the DBMS to Microsoft Azure. In opposite to the scenario described in chapter [Deploying a VM with a custom image][deployment-guide-3.1.2] above, you keep the hostname, SAP SID and SAP user accounts in the Azure VM as they were configured in the on-premises environment. Therefore, generalizing the operating system is not necessary. This case will mostly apply for cross-premises scenarios where a part of the SAP landscape is run on-premises and parts on Microsoft Azure.

For more details see chapter [Scenario 3: Moving a VM from on-premises using a non-generalized Azure VHD with SAP][deployment-guide-3.4].

### <a name="db477013-9060-4602-9ad4-b0316f8bb281"></a>Scenario 1: Deploying a VM out of the Azure Marketplace for SAP
Microsoft Azure offers the possibility to deploy a VM instance out of the Azure Marketplace, which offers some standard OS images of Windows Server and different Linux distributions. It is also possible to deploy an image that includes DBMS SKUs e.g. SQL Server. For details using those images with DBMS SKUs please refer to the [DBMS Deployment Guide][dbms-guide]

The SAP specific sequence of steps deploying a VM out of the Azure Marketplace would look like:

![Flowchart of VM deployment for SAP systems using a VM image from Azure Marketplace][deployment-guide-figure-100]

Following the flowchart the following steps need to be executed:

#### Create virtual machine using the Azure Portal
The easiest way to create a new virtual machine using an image from the Azure Marketplace is through the Azure Portal. Navigate to <https://portal.azure.com/#create>. Enter the type of operating system you want to deploy in the search field, e.g. Windows, SLES or RHEL and select the version. Make sure to select the deployment model "Azure Resource Manager" and click Create.

The wizard will guide you through the required parameters to create the virtual machine along with all required resources like network interfaces or storage accounts. Some of these parameters are:

1. Basics
    1. Name: The name of the resource i.e. virtual machine name
    1. Username and password/SSH public key: Enter the username and password of the user that is created during the provisioning. For a Linux virtual machine, you can also enter the public SSH key that you want to use to login to the machine using SSH.
    1. Subscription: Select the subscription that you want to use to provision the new virtual machine.
    1. Resource Group: The name of the resource group. You can either insert the name of a new resource group or of a resource group that already exists
    1. Location: Select the location where the new virtual machine should be deployed. If you want to connect the virtual machine to your on-premises network, make sure to select the location of the Virtual Network that connects Azure to your on-premises network. For more details, see chapter [Microsoft Azure Networking][planning-guide-microsoft-azure-networking] in the [Planning Guide][planning-guide].
1. Size: Please read SAP Note [1928533] for a list of supported VM types. Please also make sure to select the correct type if you want to use Premium Storage. Not all VM types support Premium Storage. See chapter [Storage: Microsoft Azure Storage and Data Disks][planning-guide-storage-microsoft-azure-storage-and-data-disks] and [Azure Premium Storage][planning-guide-azure-premium-storage] in the [Planning Guide][planning-guide] for more details.
1. Settings
    1. Storage Account: You can select an existing storage account or create a new one. Please read chapter [Microsoft Azure Storage][dbms-guide-2.3] of the [DBMS Guide][dbms-guide] for more details on the different storage types. Note that not all storage types are supported for running SAP applications.
    1. Virtual network and Subnet: Select the virtual network that is connected to your on-premises network if you want to integrate the virtual machine into your intranet.
    1. Public IP address: Select the Public IP address that you want to use or enter the parameters to create a new Public IP address. You can use a Public IP address to access your virtual machine over the internet. Make sure to also create a Network Security Group to filter access to your virtual machine.
    1. Network Security Group: see [What is a Network Security Group (NSG)][virtual-networks-nsg] for more details.
    1. Monitoring: You can disable the diagnostics setting. It will be enabled automatically when you run the commands to enable the Azure Enhanced Monitoring as described in chapter [Configure Monitoring][deployment-guide-configure-monitoring-scenario-1].
    1. Availability: Select an Availablility Set or enter the parameters to create a new Availablility Set. For more information see chapter [Azure Availability Sets][planning-guide-3.2.3].
1. Summary: Validate the information provided on the summary page and click OK.

After you finished wizard, your virtual machine will be deployed in the resource group you selected.

#### Create virtual machine using a template
You can also create a deployment using one of the SAP templates published in the [azure-quickstart-templates github repository][azure-quickstart-templates-github]. Or you can create a virtual machine using the [Azure Portal][virtual-machines-windows-tutorial], [PowerShell][virtual-machines-ps-create-preconfigure-windows-resource-manager-vms] or [Azure CLI][virtual-machines-linux-tutorial] manually.

* [2-tier configuration (only one virtual machine) template][sap-templates-2-tier-marketplace-image]
Use this template if you want to create a 2-tier system using only one virtual machine.
* [3-tier configuration (multiple virtual machines) template][sap-templates-3-tier-marketplace-image]
Use this template if you want to create a 3-tier system using multiple virtual machines.

After you opened one of the templates above, the Azure Portal navigates to the Edit Parameters panel. Enter the following information:

* **sapSystemId**: SAP System ID
* **osType**: Operating system you want to deploy, e.g. Windows Server 2012 R2, SLES 12 or RHEL 7.2
    * The list only contains versions that are supported by SAP on Microsoft Azure
* **sapSystemSize**: the size of the SAP system
    * The amount of SAPS the new system will provide. If you are not sure how many SAPS the system will require, please ask your SAP Technology Partner or System Integrator
* **systemAvailability**: (3-tier template only) System Availability 
    * Select HA for a configuration that is suitable for a HA installation. Two database servers and two servers for the ASCS will be created.
* storageType: (2-tier template only) Type of storage that should be used 
    * For bigger systems, the usage of Premium Storage is highly recommended. For more information about the different storage types, read 
        * [Microsoft Azure Storage][dbms-guide-2.3] of the [DBMS Guide][dbms-guide]
        * [Premium Storage: High-Performance Storage for Azure Virtual Machine Workloads][storage-premium-storage-preview-portal]
        * [Introduction to Microsoft Azure Storage][storage-introduction]
* **adminUsername** and **adminPassword**: Username and password
    * A new user is created that can be used to log on to the machine.
* **newOrExistingSubnet**: Determines whether a new virtual network and subnet should be created or an existing subnet should be used. If you already have a virtual network that is connected to your on-premises network, select existing.
* **subnetId**: The ID of the subnet to which the virtual machines should be connected to. Select the subnet of your VPN or Express Route virtual network to connect the virtual machine to your on-premises network. The ID usually looks like /subscriptions/`<subscription id`>/resourceGroups/`<resource group name`>/providers/Microsoft.Network/virtualNetworks/`<virtual network name`>/subnets/`<subnet name`>

After you entered all parameters, select the subscription and the resource group you want to use. You can either select an existing resource group or create a new one by selecting "+ New" in the dropdown menu. If you create a new resource group, you also have to select the region where the resource group and the virtual machine will be created.

Review the legal terms, accept them and click on Create.

Please note that the Azure VM Agent is deployed by default when using an image from the Azure Marketplace.

#### Configure Proxy settings
Depending on your on-premises network configuration, it might be required to configure the proxy on your virtual machine if it is connected to your on-premises network via VPN or Express Route. Otherwise the virtual machine might not be able to access the internet and therefore cannot download the required extensions or collect monitoring data. Please see chapter [Configure Proxy][deployment-guide-configure-proxy] of this document.

#### Join Domain (Windows only)
In the case that the deployment in Azure is connected to the on-premises AD/DNS via Azure Site-to-Site or Express Route (also referenced as Cross-Premises in the [Planning and Implementation Guide][planning-guide]), it is expected that the VM is joining an on-premises domain. Considerations of this step are described in chapter [Join VM into on-premises Domain (Windows only)][deployment-guide-4.3] of this document.

#### <a name="ec323ac3-1de9-4c3a-b770-4ff701def65b"></a>Configure Monitoring
Configure the Azure Enhanced Monitoring Extension for SAP as described in chapter [Configure Azure Enhanced Monitoring Extension for SAP][deployment-guide-4.5] of this document.

Check the prerequisites for SAP Monitoring for required minimum versions of SAP Kernel and SAP Host Agent in the resources listed in chapter [SAP Resources][deployment-guide-2.2] of this document.

#### Monitoring Check
Check if the monitoring is working as described in chapter [Checks and Troubleshooting for End-to-End Monitoring Setup for SAP on Azure][deployment-guide-troubleshooting-chapter].

#### Post Deployment Steps
After creating the VM, it will be deployed and it is then on you to install all the necessary software components into the VM. Hence this type of VM deployment would require either the software to be installed beeing already available in Microsoft Azure in some other VM or as disk which can be attached. Or we are looking into Cross-Premises scenarios where connectivity to the on-premises assets (install shares) is a given.

### <a name="54a1fc6d-24fd-4feb-9c57-ac588a55dff2"></a>Scenario 2: Deploying a VM with a custom image for SAP
As described in the [Planning and Implementation Guide][planning-guide] already in detailed steps there is a way to prepare and create a custom image and use it to create multiple new VMs. 
The sequence of steps in the flow chart would look like:
 
![Flowchart of VM deployment for SAP systems using a VM image in Private Marketplace][deployment-guide-figure-300]

Following the flowchart the following steps need to be executed:

#### Create virtual machine
To create a deployment using a private OS image through the Azure Portal, use one of the SAP templates published on the [azure-quickstart-templates github repository][azure-quickstart-templates-github].
You can also create a virtual machine using the [PowerShell][virtual-machines-upload-image-windows-resource-manager] manually. 

* [2-tier configuration (only one virtual machine) template][sap-templates-2-tier-user-image]
Use this template if you want to create a 2-tier system using only one virtual machine and your own OS image.
* [3-tier configuration (multiple virtual machines) template][sap-templates-3-tier-user-image]
Use this template if you want to create a 3-tier system using multiple virtual machines and your own OS image.

After you opened one of the templates above, the Azure Portal navigates to the Edit Parameters panel. Enter the following information:

* **sapSystemId**: SAP System ID
* **osType**: Operating system type you want to deploy, Windows or Linux
* **sapSystemSize**: the size of the SAP system
    * The amount of SAPS the new system will provide. If you are not sure how many SAPS the system will require, please ask your SAP Technology Partner or System Integrator
* **systemAvailability**: (3-tier template only) System Availability 
    * Select HA for a configuration that is suitable for a HA installation. Two database servers and two servers for the ASCS will be created.
* **storageType**: (2-tier template only) Type of storage that should be used 
    * For bigger systems, the usage of Premium Storage is highly recommended. For more information about the different storage types, read 
        * [Microsoft Azure Storage][dbms-guide-2.3] of the [DBMS Guide][dbms-guide]
        * [Premium Storage: High-Performance Storage for Azure Virtual Machine Workloads][storage-premium-storage-preview-portal]
        * [Introduction to Microsoft Azure Storage][storage-introduction]
* **adminUsername** and **adminPassword**: Username and password
    * A new user is created that can be used to log on to the machine.
* **userImageVhdUri**: URI of the private OS image vhd e.g. https://`<accountname`>.blob.core.windows.net/vhds/userimage.vhd
* **userImageStorageAccount**: Name of the storage account where the private OS image is stored e.g. `<accountname`> in the example URI above
* **newOrExistingSubnet**: Determines whether a new virtual network and subnet should be created or an existing subnet should be used. If you already have a virtual network that is connected to your on-premises network, select existing.
* **subnetId**: The ID of the subnet to which the virtual machines should be connected to. Select the subnet of your VPN or Express Route virtual network to connect the virtual machine to your on-premises network. The ID usually looks like
/subscriptions/`<subscription id`>/resourceGroups/`<resource group name`>/providers/Microsoft.Network/virtualNetworks/`<virtual network name`>/subnets/`<subnet name`>

After you entered all parameters, select the subscription and the resource group you want to use. You can either select an existing resource group or create a new one by selecting "+ New" in the dropdown menu. If you create a new resource group, you also have to select the region where the resource group and the virtual machine will be created.

Review the legal terms, accept them and click on Create.

#### Install VM Agent (Linux only)
The Linux Agent must already be installed in the user image if you want to use the templates above. Otherwise the deployment will fail. Download and Install the VM Agent in the user image as described in chapter [Download, Install and enable Azure VM Agent][deployment-guide-4.4] of this document.
If you don’t use the templates above, you can also install the VM Agent afterwards.

#### Join Domain (Windows only)
In the case that the deployment in Azure is connected to the on-premises AD/DNS via Azure Site-to-Site or Express Route (also referenced as Cross-Premises in the [Planning and Implementation Guide][planning-guide]), it is expected that the VM is joining an on-premises domain. Considerations of this step are described in chapter [Join VM into on-premises Domain (Windows only)][deployment-guide-4.3] of this document.

#### Configure Proxy settings
Depending on your on-premises network configuration, it might be required to configure the proxy on your virtual machine if it is connected to your on-premises network via VPN or Express Route. Otherwise the virtual machine might not be able to access the internet and therefore cannot download the required extensions or collect monitoring data. Please see chapter [Configure Proxy][deployment-guide-configure-proxy] of this document.

#### Configure Monitoring
Configure Azure Monitoring Extension for SAP as described in chapter [Configure Azure Enhanced Monitoring Extension for SAP][deployment-guide-4.5] of this document.
Check the prerequisites for SAP Monitoring for required minimum versions of SAP Kernel and SAP Host Agent in the resources listed in chapter [SAP Resources][deployment-guide-2.2] of this document.

#### Monitoring Check
Check if the monitoring is working as described in chapter [Checks and Troubleshooting for End-to-End Monitoring Setup for SAP on Azure][deployment-guide-troubleshooting-chapter].

### <a name="a9a60133-a763-4de8-8986-ac0fa33aa8c1"></a>Scenario 3: Moving a VM from on-premises using a non-generalized Azure VHD with SAP
This scenario is addressing the case of an SAP system simply being moved in its current form and shape from on-premises to Azure. Means no name change of the Windows or Linux hostname and SAP SID or something like that takes place. In this case, the VHD is not referenced as an image during deployment but is directly used as the OS disk. In regards to the deployment, this case differs from the two former cases by the fact that the VM Agent cannot be automatically installed during the deployment. Therefore, the Azure VM Agent needs to be downloaded from Microsoft and needs to be installed and enabled within the VM manually afterwards. After that task succeeded, you can continue to initiate the SAP Host Monitoring Azure Extension and its configuration. For details on the function of the Azure VM Agent, please check this article:

[comment]: <> (MSSedusch TODO Update Windows Link below) 

___

> ![Windows][Logo_Windows] Windows
>
> <http://blogs.msdn.com/b/wats/archive/2014/02/17/bginfo-guest-agent-extension-for-azure-vms.aspx>
>
> ![Linux][Logo_Linux] Linux
>
> [Azure Linux Agent User Guide][virtual-machines-linux-agent-user-guide]

___

The workflow of the different steps looks like:
 
![Flowchart of VM deployment for SAP systems using a VM Disk][deployment-guide-figure-400]

Assuming that the Disk is already uploaded and defined in Azure (see [Planning and Implementation Guide][planning-guide]), follow these steps

#### Create virtual machine
To create a deployment using a private OS disk through the Azure Portal, use the SAP template published on the [azure-quickstart-templates github repository][azure-quickstart-templates-github]. You can also create a virtual machine using the [PowerShell or Azure CLI manually.

* [2-tier configuration (only one virtual machine) template][sap-templates-2-tier-os-disk]
    * Use this template if you want to create a 2-tier system using only one virtual machine.

After you opened the template above, the Azure Portal navigates to the Edit Parameters panel. Enter the following information:

* **sapSystemId**: SAP System ID
* **osType**: Operating system type you want to deploy, Windows or Linux
* **sapSystemSize**: the size of the SAP system
    * The amount of SAPS the new system will provide. If you are not sure how many SAPS the system will require, please ask your SAP Technology Partner or System Integrator
* **storageType**: (2-tier template only) Type of storage that should be used 
    * For bigger systems, the usage of Premium Storage is highly recommended. For more information about the different storage types, read 
        * [Microsoft Azure Storage][dbms-guide-2.3] of the [DBMS Guide][dbms-guide]
        * [Premium Storage: High-Performance Storage for Azure Virtual Machine Workloads][storage-premium-storage-preview-portal]
        * [Introduction to Microsoft Azure Storage][storage-introduction]
* **osDiskVhdUri**: URI of the private OS disk e.g. https://`<accountname`>.blob.core.windows.net/vhds/osdisk.vhd
* **newOrExistingSubnet**: Determines whether a new virtual network and subnet should be created or an existing subnet should be used. If you already have a virtual network that is connected to your on-premises network, select existing.
* **subnetId**: The ID of the subnet to which the virtual machines should be connected to. Select the subnet of your VPN or Express Route virtual network to connect the virtual machine to your on-premises network. The ID usually looks like
/subscriptions/`<subscription id`>/resourceGroups/`<resource group name`>/providers/Microsoft.Network/virtualNetworks/`<virtual network name`>/subnets/`<subnet name`>

After you entered all parameters, select the subscription and the resource group you want to use. You can either select an existing resource group or create a new one by selecting "+ New" in the dropdown menu. If you create a new resource group, you also have to select the region where the resource group and the virtual machine will be created.

Review the legal terms, accept them and click on Create.

#### Install VM Agent
The Linux Agent must already be installed in the OS disk if you want to use the templates above. Otherwise the deployment will fail. Download and Install the VM Agent in the VM as described in chapter [Download, Install and enable Azure VM Agent][deployment-guide-4.4] of this document.

If you don’t use the templates above, you can also install the VM Agent afterwards.

#### Join Domain (Windows only)
In the case that the deployment in Azure is connected to the on-premises AD/DNS via Azure Site-to-Site or Express Route (also referenced as Cross-Premises in the [Planning and Implementation Guide][planning-guide]), it is expected that the VM is joining an on-premises domain. Considerations of this step are described in chapter [Join VM into on-premises Domain (Windows only)][deployment-guide-4.3] of this document.

#### Configure Proxy settings
Depending on your on-premises network configuration, it might be required to configure the proxy on your virtual machine if it is connected to your on-premises network via VPN or Express Route. Otherwise the virtual machine might not be able to access the internet and therefore cannot download the required extensions or collect monitoring data. Please see chapter [Configure Proxy][deployment-guide-configure-proxy] of this document.

#### Configure Monitoring
Configure Azure Enhanced Monitoring Extension for SAP as described in chapter [Configure Azure Enhanced Monitoring Extension for SAP][deployment-guide-4.5] of this document.

Check the prerequisites for SAP Monitoring for required minimum versions of SAP kernel and SAP Host Agent in the resources listed in chapter [SAP Resources][deployment-guide-2.2] of this document.

#### Monitoring Check
Check if the monitoring is working as described in chapter [Checks and Troubleshooting for End-to-End Monitoring Setup for SAP on Azure][deployment-guide-troubleshooting-chapter].

### Scenario 4: Updating the Monitoring Configuration for SAP
There are cases where you would need to update the monitoring configuration:

* The joint MS/SAP team extended the monitoring capabilities and decided to add more counters or delete some counters. 
* Microsoft introduces a new version of the underlying Azure infrastructure delivering the monitoring data, and the Azure Enhanced Monitoring Extension for SAP is adapting to those changes.
* You add additional VHDs mounted to your Azure VM or you remove a VHD. In this case, you need to update the collection of storage related data. If you change your configuration by adding or deleting endpoints or assigning IP addresses to a VM, this will not impact the monitoring configuration.
* You change the size of your Azure VM e.g. from A5 to any other size of VM.
* You add new network interfaces to your Azure VM

In order to update the monitoring configuration, proceed as follows:

* Update the monitoring infrastructure by following the steps explained in chapter [Configure Azure Enhanced Monitoring Extension for SAP][deployment-guide-4.5] of this document. A re-run of the script described in this chapter will detect that a monitoring configuration is deployed and will perform the necessary changes to the monitoring configuration. 

___

> ![Windows][Logo_Windows] Windows
>
> For the update of the Azure VM Agent, no user intervention is required. VM Agent auto updates itself and does not require a VM reboot.
>
> ![Linux][Logo_Linux] Linux
>
> Please follow the steps in [this article][virtual-machines-linux-update-agent] to update the Azure Linux Agent. 

___

## Detailed Single Deployment Steps

### <a name="604bcec2-8b6e-48d2-a944-61b0f5dee2f7"></a>Deploying Azure PowerShell cmdlets
* Go to <https://azure.microsoft.com/downloads/>
* Under the section ‘Command-Line Tools’ there is a section called ‘Windows PowerShell’. Follow the ‘Install’ link.
* Microsoft Download Manager will pop-up with a line item ending with .exe. Select the option ‘Run’.
* A pop-up will come up asking whether to run Microsoft Web Platform Installer. Press YES
* A screen like this one appears:
 
![Installation screen for Azure PowerShell cmdlets][deployment-guide-figure-500]
<a name="figure-5"></a>

* Press Install and accept the EULA.

Check frequently whether the PowerShell cmdlets have been updated. Usually there are updates on a monthly period. The easiest way to do this is to follow the installation steps as described above up to the installation screen shown in [this][deployment-guide-figure-5] figure. In this screen, the release date of the cmdlets is shown as well as the actual release number. Unless stated differently in SAP Notes [1928533] or [2015553], it is recommended to work with the latest version of Azure PowerShell cmdlets.

The current installed version of the Azure cmdlets on the desktop/laptop can be checked with the PS command:

```powershell
Import-Module Azure
(Get-Module Azure).Version
```

The result should be presented as shown below in [this][deployment-guide-figure-6] figure.

![Result of Azure PS cmdlet version check][deployment-guide-figure-600]
<a name="figure-6"></a>

If the Azure cmdlet version installed on the desktop/laptop is the current one, the first screen after starting the Microsoft Web Platform Installer will look slightly different compared to the one shown in [this][deployment-guide-figure-5] figure.

Please notice the red circle below in the [figure][deployment-guide-figure-7] below.
 
![Installation screen for Azure PowerShell cmdlets indicating that most recent release of Azure PS cmdlets are installed][deployment-guide-figure-700]
<a name="figure-7"></a>

If the screen looks as [above][deployment-guide-figure-7], indicating that the most recent Azure cmdlet version is already installed, there is no need to continue with the installation. In this case you can ‘Exit’ the installation at this stage.

### <a name="1ded9453-1330-442a-86ea-e0fd8ae8cab3"></a>Deploying Azure CLI
* Go to <https://azure.microsoft.com/downloads/>
* Under the section ‘Command-Line Tools’ there is a section called ‘Azure command-line interface’. Follow the Install link for your operating system.

Check frequently whether the Azure CLI have been updated. Usually there are updates on a monthly period. The easiest way to do this is to follow the installation steps as described above.

The current installed version of Azure CLI on the desktop/laptop can be checked with the command:

```
azure --version
```

The result should be presented as shown below in [this][deployment-guide-figure-azure-cli-version] figure.

![Result of Azure CLI version check][deployment-guide-figure-760]
<a name="0ad010e6-f9b5-4c21-9c09-bb2e5efb3fda"></a>

### <a name="31d9ecd6-b136-4c73-b61e-da4a29bbc9cc"></a>Join VM into on-premises Domain (Windows only)
In cases where you deploy SAP VMs into a Cross-Premises scenario where on-premises AD and DNS is extended into Azure, it is expected that the VMs are joined in an on-premises domain. The detailed steps of joining a VM to an on-premises domain and additional software required to be a member of an on-premises domain is customer dependent. Usually joining a VM to an on-premises domain means installing additional software like Malware Protection software or various agents of backup or monitoring software.

Additionally, you need to make sure for cases where Internet proxy settings are forced when joining a domain, that the Windows Local System Account(S-1-5-18) in the Guest VM has these settings as well. Easiest is to force the proxy with Domain Group Policy which apply to systems within the domain.

### <a name="c7cbb0dc-52a4-49db-8e03-83e7edc2927d"></a>Download, Install and enable Azure VM Agent
The following steps are necessary when a VM for SAP is deployed from an OS images that is not generalized e.g. not syspreped for Windows. It is not necessary to install the Agent for virtual machines deployed from the Azure marketplace. These images already contain the Azure Agent.

#### <a name="b2db5c9a-a076-42c6-9835-16945868e866"></a>Windows

* Download the Azure VM Agent:
	* Download the Azure VM Agent installer package from: <https://go.microsoft.com/fwlink/?LinkId=394789>
	* Store the VM Agent MSI package locally on the laptop or a server
* Install the Azure VM Agent:
	* Connect to the deployed Azure VM with Terminal Services (RDP)
	* Open a Windows Explorer window on the VM and open a target directory for the MSI file of the VM Agent
	* Drag and drop the Azure VM Agent Installer MSI file from your local laptop/server into the target directory of the VM Agent in the VM
	* Double Click on the MSI file in the VM
	* For VM joined to on-premises domains, make sure that eventual Internet proxy settings apply for the Windows Local System account (S-1-5-18) in the VM as well as described in chapter [Configure Proxy][deployment-guide-configure-proxy]. The VM Agent will run in this context and needs to be able to connect to Azure.

#### <a name="6889ff12-eaaf-4f3c-97e1-7c9edc7f7542"></a>Linux
Please install the VM Agent for Linux using the following command

- **SLES**

```
sudo zypper install WALinuxAgent
```
- **RHEL**

```
sudo yum install WALinuxAgent
```

### <a name="baccae00-6f79-4307-ade4-40292ce4e02d"></a>Configure Proxy
The steps for configuring the proxy differ between Windows and Linux.

#### Windows
These settings must also be valid for the LocalSystem account to access the Internet. If your proxy settings are not set by group policy, you can configure them for the LocalSystem account follow these steps to configure it.

1.	Open gpedit.msc
1.	Navigate to Computer Configuration –> Administrative Templates -> Windows Components -> Internet Explorer and enable “Make proxy settings per-machine (rather than per-user)
1.	Open the Control Panel and navigate to Network and Internet -> Internet Options
1.	Open the Connections tab and click on LAN settings
1.	Disable "Automatically detect settings"
1.	Enable "Use a proxy server for your LAN" and enter the proxy host and port

#### Linux
Configure the correct proxy in the configuration file of the Microsoft Azure Guest Agent, which is located at /etc/waagent.conf. The following parameters must be set:

```
HttpProxy.Host=<proxy host e.g. proxy.corp.local>
HttpProxy.Port=<port of the proxy host e.g. 80>
```

Restart the agent after you have changed its configuration with

```
sudo service waagent restart
```

The proxy settings in /etc/waagent.conf do also apply for the required VM extensions. If you want to use the Azure repositories, make sure that the traffic to these repositories is not going through the on-premises intranet. If you created User Defined Routes to enable Forced Tunneling, make sure to add a route that routes traffic to the repositories directly to the Internet and not through your site-to-site connection.

- **SLES**
You also need to add routes for the IP addresses listed in /etc/regionserverclnt.cfg. An example is shown in the screenshot below. 

- **RHEL**
You also need to add routes for the IP addresses of the hosts listed in /etc/yum.repos.d/rhui-load-balancers. An example is shown in the screenshot below.

For more details about User Defined Routes, see [this article][virtual-networks-udr-overview].

![Forced Tunneling][deployment-guide-figure-50]

### <a name="d98edcd3-f2a1-49f7-b26a-07448ceb60ca"></a>Configure Azure Enhanced Monitoring Extension for SAP
Once the VM is prepared as described in chapter [Deployment Scenarios of VMs for SAP on Microsoft Azure][deployment-guide-3], the Azure VM Agent is installed in the machine. The next important step is to deploy the Azure Enhanced Monitoring Extension for SAP, which is available in the Azure Extension Repository in the global datacenters of Microsoft Azure. For more details, please check the [Planning and Implementation Guide][planning-guide-9.1]. 

You can use Azure PowerShell or Azure CLI to install and configure the Azure Enhanced Monitoring Extension for SAP. Please read chapter [Azure PowerShell][deployment-guide-4.5.1] if you want to install the extension on a Windows or Linux VM using a Windows machine. For installing the extension on a Linux VM using a Linux desktop read chapter [Azure CLI][deployment-guide-4.5.2].

#### <a name="987cf279-d713-4b4c-8143-6b11589bb9d4"></a>Azure PowerShell for Linux and Windows VMs
In order to perform the task of installing the Azure Enhanced Monitoring Extension for SAP, perform the following steps:

* Make sure that you have installed the latest version of the Microsoft Azure PowerShell cmdlet. See chapter [Deploying Azure PowerShell cmdlets][deployment-guide-4.1] of this document.  
* Run the following PowerShell cmdlet. For a list of available environments, run commandlet Get-AzureRmEnvironment. If you want to use public Azure, your environment is AzureCloud. For Azure in China, select AzureChinaCloud.

```powershell
	$env = Get-AzureRmEnvironment -Name <name of the environment>
	Login-AzureRmAccount -Environment $env
	Set-AzureRmContext -SubscriptionName <subscription name>
    
    Set-AzureRmVMAEMExtension -ResourceGroupName <resource group name> -VMName <virtual machine name>
```

After you provided your account data and the Azure Virtual Machine, the script will deploy the required extensions and enable the required features. This can take several minutes.
Please read [this MSDN article][msdn-set-azurermvmaemextension] for more information about the Set-AzureRmVMAEMExtension.
  
![Result screen of successful execution of SAP specific Azure cmdlet Set-AzureRmVMAEMExtension][deployment-guide-figure-900]

A successful run of Set-AzureRmVMAEMExtension will do all the steps necessary to configure the host monitoring functionality for SAP. 

The output the script should deliver looks like:

* Confirmation that the monitoring configuration for the Base VHD (containing the OS) plus all additional VHDs mounted to the VM has been configured.
* The next two messages are confirming the configuration of Storage Metrics for a specific storage account. 
* One line of output will give a status on the actual update of the monitoring configuration.
* Another will show up confirming that the configuration has been deployed or updated.
* The last line of the output is informational showing the possibility to test the monitoring configuration.
* To check, that all steps of the Azure Enhanced Monitoring have been executed successfully and that the Azure Infrastructure provides the necessary data, proceed with the Readiness check for Azure Enhanced Monitoring Extension for SAP, as described in chapter [Readiness Check for Azure Enhanced Monitoring for SAP][deployment-guide-5.1] in this document. 
* To continue doing this, wait for 15-30 minutes until the Azure Diagnostics will have the relevant data collected.

#### <a name="408f3779-f422-4413-82f8-c57a23b4fc2f"></a>Azure CLI for Linux VMs
Please follow the steps in [this article][install-extension-cli] to install the Azure Enhanced Monitoring Extension for SAP on a Linux VM from a Linux laptop/desktop.

 [comment]: <> (MSSedusch TODO check if link is still valid)

## <a name="564adb4f-5c95-4041-9616-6635e83a810b"></a>Checks and Troubleshooting for End-to-End Monitoring Setup for SAP on Azure
After you have deployed your Azure VM and set up the relevant Azure monitoring infrastructure, check whether all the components of the Azure Enhanced Monitoring are working in a proper way. 

Therefore, execute the Readiness check for the Azure Enhanced Monitoring Extension for SAP as described in chapter [Readiness Check for Azure Enhanced Monitoring for SAP][deployment-guide-5.1]. If the result of this check is positive and you get all relevant performance counters, the Azure monitoring has been setup successfully. In this case, proceed with the installation of the SAP Host Agent as described in the SAP Notes listed in chapter [SAP Resources][deployment-guide-2.2] of this document. If the result of the Readiness check indicates missing counters, proceed executing the Health check for the Azure Monitoring Infrastructure as described in chapter [Health check for Azure Monitoring Infrastructure Configuration][deployment-guide-5.2]. In case of any problem with the Azure Monitoring Configuration, check chapter [Further troubleshooting of Azure Monitoring infrastructure for SAP][deployment-guide-5.3] for further help on troubleshooting.

### <a name="bb61ce92-8c5c-461f-8c53-39f5e5ed91f2"></a>Readiness Check for Azure Enhanced Monitoring for SAP
With this check, you make sure that the metrics which will be shown inside your SAP application are provided completely by the underlying Azure Monitoring Infrastructure. 

#### Execute the Readiness check on a Windows VM
In order to execute the readiness check, logon to the Azure Virtual Machine (admin account is not necessary) and execute the following steps:

* Open a Windows Command prompt and change to the installation folder of the Azure Monitoring Extension for SAP 
C:\Packages\Plugins\Microsoft.AzureCAT.AzureEnhancedMonitoring.AzureCATExtensionHandler\\`<version`>\drop

The version part provided in the path to the monitoring extension above may vary. If you see multiple folders of the monitoring extension version in the installation folder, check the configuration of the Windows service ‘AzureEnhancedMonitoring’ and switch to the folder indicated as ‘Path to executable’.
 
![Properties of Service running the Azure Enhanced Monitoring Extension for SAP][deployment-guide-figure-1000]

* Execute azperflib.exe in the command window without any parameters.

> [AZURE.NOTE] The azperflib.exe runs in a loop and updates the collected counters every 60 seconds. In order to finish the loop, close the command window.

If the Azure Enhanced Monitoring Extension is not installed or the service ‘AzureEnhancedMonitoring’ is not running, the extension has not been configured correctly. In this case, follow chapter [Further troubleshooting of Azure Monitoring infrastructure for SAP][deployment-guide-5.3] for detailed instructions how to redeploy the extension.

##### Check the output of azperflib.exe
The output of azperflib.exe shows all populated Azure performance counters for SAP. At the bottom of the list of collected counters, you find a summary and a health indicator, which indicates the status of the Azure Monitoring. 
 
![Output of health check by executing azperflib.exe indicating that no problems exist][deployment-guide-figure-1100]
<a name="figure-11"></a>

Check the result returned for the output of the amount of ‘Counters total’, which are reported as empty and for the ‘Health check’ as shown above in the figure [above][deployment-guide-figure-11].

You can interpret the result values as follows:

| Azperflib.exe Result Values | Azure Monitoring Readiness Status |
| ------------------------------|----------------------------------- |
| **Counters total: empty** | The following 2 Azure storage counters can be empty: <ul><li>Storage Read Op Latency Server msec</li><li>Storage Read Op Latency E2E msec</li></ul>All other counters must contain values. |
| **Health check** | Only OK if return status shows OK |

If not both return values of azperflib.exe show that all populated counters are returned correctly, follow the instructions of the Health check for the Azure Monitoring Infrastructure Configuration as described in chapter [Health check for Azure Monitoring Infrastructure Configuration][deployment-guide-5.2] below.

#### Execute the Readiness check on a Linux VM
In order to execute the readiness check, connect with SSH to the Azure Virtual Machine and execute the following steps:

* Check the output of the Azure Enhanced Monitoring Extension
    * more /var/lib/AzureEnhancedMonitor/PerfCounters
        * Should give you a list of performance counters. The file should not be empty
    * cat /var/lib/AzureEnhancedMonitor/PerfCounters | grep Error
        * Should return one line where the error is none e.g. 3;config;Error;;0;0;**none**;0;1456416792;tst-servercs;
    * more /var/lib/AzureEnhancedMonitor/LatestErrorRecord
        * Should be empty or should not exist
* If the first check above was not successful, perform these additional tests:
    * Make sure that the waagent is installed and started
        * sudo ls -al /var/lib/waagent/
            * should list the content of the waagent directory
        * ps -ax | grep waagent
            * should show one entry similar to 'python /usr/sbin/waagent -daemon'
    * Make sure that the Linux Diagnostic extension is installed and started
        * sudo sh -c 'ls -al /var/lib/waagent/Microsoft.OSTCExtensions.LinuxDiagnostic-*'
            * should list the content of the Linux Diagnostic Extension directory
        * ps -ax | grep diagnostic
            * should show one entry similar to 'python /var/lib/waagent/Microsoft.OSTCExtensions.LinuxDiagnostic-2.0.92/diagnostic.py -daemon'
    * Make sure that the Azure Enhanced Monitoring Extension is installed and started
        * sudo sh -c 'ls -al /var/lib/waagent/Microsoft.OSTCExtensions.AzureEnhancedMonitorForLinux-*/'
            * should list the content of the Azure Enhanced Monitoring Extension directory
        * ps -ax | grep AzureEnhanced
            * should show one entry similar to 'python /var/lib/waagent/Microsoft.OSTCExtensions.AzureEnhancedMonitorForLinux-2.0.0.2/handler.py daemon'
* Install the SAP Host Agent as described in SAP Note [1031096] and check the output of saposcol
    * Execute /usr/sap/hostctrl/exe/saposcol -d
    * Execute dump ccm
    * Check if the metric "Virtualization_Configuration\Enhanced Monitoring Access" is true
* If you already have a SAP NetWeaver ABAP application server installed, open transaction ST06 and check if the enhanced monitoring is enabled.

If any of the checks above fail, follow chapter [Further troubleshooting of Azure Monitoring infrastructure for SAP][deployment-guide-5.3] for detailed instructions how to redeploy the extension.

### <a name="e2d592ff-b4ea-4a53-a91a-e5521edb6cd1"></a>Health check for Azure Monitoring Infrastructure Configuration
If some of the monitoring data is not delivered correctly as indicated by the test described in chapter [Readiness Check for Azure Enhanced Monitoring for SAP][deployment-guide-5.1] above, execute the Test-AzureRmVMAEMExtension cmdlet to test if the current configuration of the Azure Monitoring infrastructure and the Monitoring extension for SAP is correct.

In order to test the monitoring configuration, please execute the following sequence:

* Make sure that you have installed the latest version of the Microsoft Azure PowerShell cmdlet as described in chapter [Deploying Azure PowerShell cmdlets][deployment-guide-4.1] of this document.
* Run the following PowerShell cmdlet. For a list of available environments, run commandlet Get-AzureRmEnvironment. If you want to use public Azure, your environment is AzureCloud. For Azure in China, select AzureChinaCloud.

```powershell
$env = Get-AzureRmEnvironment -Name <name of the environment>
Login-AzureRmAccount -Environment $env
Set-AzureRmContext -SubscriptionName <subscription name>
Test-AzureRmVMAEMExtension -ResourceGroupName <resource group name> -VMName <virtual machine name>
```

* After you provided your account data and the Azure Virtual Machine, the script will test the configuration of the virtual machine you choose.

 
![Input screen of SAP specific Azure cmdlet Test-VMConfigForSAP_GUI][deployment-guide-figure-1200]

After you entered the information about your account and the Azure Virtual Machine, the script will test the configuration of the virtual machine you choose.
 
![Output of successful test of Azure Monitoring Infrastructure for SAP][deployment-guide-figure-1300]

Make sure that every check is marked with OK. If some of the checks are not ok, please execute the update cmdlet as described in chapter [Configure Azure Enhanced Monitoring Extension for SAP][deployment-guide-4.5] of this document. Wait another 15 minutes and perform the checks described in chapter [Readiness Check for Azure Enhanced Monitoring for SAP][deployment-guide-5.1] and [Health check for Azure Monitoring Infrastructure Configuration][deployment-guide-5.2] again. If the checks still indicate a problem with some or all counters, please proceed to chapter [Further troubleshooting of Azure Monitoring infrastructure for SAP][deployment-guide-5.3].

### <a name="fe25a7da-4e4e-4388-8907-8abc2d33cfd8"></a>Further troubleshooting of Azure Monitoring infrastructure for SAP

#### ![Windows][Logo_Windows] Azure performance counters do not show up at all
The collection of the performance metrics on Azure is done by the Windows service ‘AzureEnhancedMonitoring’. If the service has not been installed correctly or if it is not running in your VM, no performance metrics can be collected at all.

##### The installation directory of the Azure Enhanced Monitoring extension is empty 

###### Issue
The installation directory 
C:\Packages\Plugins\Microsoft.AzureCAT.AzureEnhancedMonitoring.AzureCATExtensionHandler\\`<version`>\drop
is empty.

###### Solution
The extension is not installed. Please check if it is a proxy issue (as described before). You may need to reboot the machine and/or re-run the configuration script script Set-AzureRmVMAEMExtension

##### Service for Azure Enhanced Monitoring does not exist 

###### Issue
Windows service ‘AzureEnhancedMonitoring’ does not exist. 
Azperflib.exe:	The azperlib.exe output throws an error as shown in the [figure below][deployment-guide-figure-14].
 
![Execution of azperflib.exe indicates that the service of the Azure Enhanced Monitoring Extension for SAP is not running][deployment-guide-figure-1400]
<a name="figure-14"></a>

###### Solution
If the service does not exist as shown in the [figure above][deployment-guide-figure-14], the Azure Monitoring Extension for SAP has not been installed correctly. Redeploy the extension according to the steps described for your deployment scenario in chapter [Deployment Scenarios of VMs for SAP on Microsoft Azure][deployment-guide-3]. 

After deployment of the extension, recheck whether the Azure performance counters are provided within the Azure VM after 1 hour.

##### Service for Azure Enhanced Monitoring exists, but fails to start 

###### Issue
Windows service ‘AzureEnhancedMonitoring’ exists and is enabled but fails to start. Check the application event log for more information.

###### Solution
Bad configuration. Re-enable the monitoring extension for the VM as described in chapter [Configure Azure Enhanced Monitoring Extension for SAP][deployment-guide-4.5].

#### ![Windows][Logo_Windows] Some Azure performance counters are missing
The collection of the performance metrics on Azure is done by the Windows service ‘AzureEnhancedMonitoring’, which gets data from several sources. Some configuration data are collected locally, performance metrics are read from Azure Diagnostics and storage counters are used from your logging on storage subscription level.

If troubleshooting using SAP Note [1999351] did not help, please re-run the configuration script Set-AzureRmVMAEMExtension. You may have to wait for an hour because storage analytics or diagnostics counters may not be created immediately after they are enabled. If the problem still exists, open an SAP customer support message on the component BC-OP-NT-AZR.

#### ![Linux][Logo_Linux] Azure performance counters do not show up at all

The collection of the performance metrics on Azure is done by a deamon. If the deamon is not running, no performance metrics can be collected at all.

##### The installation directory of the Azure Enhanced Monitoring extension is empty 

###### Issue
The directory /var/lib/waagent/ does not contain a subdirectory for the Azure Enhanced Monitoring extension.

###### Solution
The extension is not installed. Please check if it is a proxy issue (as described before). You may need to reboot the machine and/or re-run the configuration script Set-AzureRmVMAEMExtension

#### ![Linux][Logo_Linux] Some Azure performance counters are missing

The collection of the performance metrics on Azure is done by a daemon, which gets data from several sources. Some configuration data are collected locally, performance metrics are read from Azure Diagnostics and storage counters are used from your logging on storage subscription level.

For a complete and up to date list of known issues please see SAP Note [1999351] containing additional troubleshooting information for the Enhanced Azure Monitoring for SAP.

If troubleshooting using SAP Note [1999351] did not help, please re-run the configuration script Set-AzureRmVMAEMExtension as described in chapter [Configure Azure Enhanced Monitoring Extension for SAP][deployment-guide-4.5]. You may have to wait for an hour because storage analytics or diagnostics counters may not be created immediately after they are enabled. If the problem still exists, open an SAP customer support message on the component BC-OP-NT-AZR for Windows or BC-OP-LNX-AZR for a Linux virtual machine.
