<properties
   pageTitle="SAP NetWeaver on Linux virtual machines (VMs) – Planning and Implementation Guide | Microsoft Azure"
   description="SAP NetWeaver on Linux virtual machines (VMs) – Planning and Implementation Guide"
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
   ms.date="08/02/2016"
   ms.author="sedusch"/>

# SAP NetWeaver on Azure virtual machines (VMs) – Planning and Implementation Guide

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
[virtual-machines-ps-create-preconfigure-windows-resource-manager-vms]:virtual-machines-windows-create-powershell.md
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

Microsoft Azure enables companies to acquire compute and storage resources in minimal time without lengthy procurement cycles. Azure Virtual Machines allow companies to deploy classical applications, like SAP NetWeaver based applications into Azure and extend their reliability and availability without having further resources available on-premises. Azure Virtual Machine Services also supports cross-premises connectivity, which enables companies to actively integrate Azure Virtual Machines into their on-premises domains, their Private Clouds and their SAP System Landscape.
This white paper describes the fundamentals of Microsoft Azure Virtual Machine and provides a walk-through of planning and implementation considerations for SAP NetWeaver installations in Azure and as such should be the document to read before starting actual deployments of SAP NetWeaver on Azure.
The paper complements the SAP Installation Documentation and SAP Notes which represent the primary resources for installations and deployments of SAP software on given platforms.

[AZURE.INCLUDE [windows-warning](../../includes/virtual-machines-linux-sap-warning.md)]

## Summary
Cloud Computing is a widely used term which is gaining more and more importance within the IT industry, from small companies up to large and multinational corporations.

Microsoft Azure is the Cloud Services Platform from Microsoft which offers a wide spectrum of new possibilities. Now customers are able to rapidly provision and de-provision applications as a service in the cloud, so they are not limited to technical or budgeting restrictions. Instead of investing time and budget into hardware infrastructure, companies can focus on the application, business processes and its benefits for customers and users.

With Microsoft Azure Virtual Machine Services, Microsoft offers a comprehensive Infrastructure as a Service (IaaS) platform. SAP NetWeaver based applications are supported on Azure Virtual Machines (IaaS). This whitepaper will describe how to plan and implement SAP NetWeaver based applications within Microsoft Azure as the platform of choice.

The paper itself will focus on two main aspects:

* The first part will describe two supported deployment patterns for SAP NetWeaver based applications on Azure. It will also describe general handling of Azure with SAP deployments in mind.
* The second part will detail implementing the two different scenarios described in the first part.

For additional resources see chapter [Resources][planning-guide-1.2] in this document.

### Definitions upfront
Throughout the document we will use the following terms:

* IaaS: Infrastructure as a Service.
* PaaS: Platform as a Service.
* SaaS: Software as a Service.
* ARM : Azure Resource Manager
* SAP Component: an individual SAP application such as ECC, BW, Solution Manager or EP.  SAP components can be based on traditional ABAP or Java technologies or a non-NetWeaver based application such as Business Objects.
* SAP Environment: one or more SAP components logically grouped to perform a business function such as Development, QAS, Training, DR or Production.
* SAP Landscape: This refers to the entire SAP assets in a customer’s IT landscape. The SAP landscape includes all production and non-production environments.
* SAP System: The combination of DBMS layer and application layer of e.g. a SAP ERP development system, SAP BW test system, SAP CRM production system, etc.. In Azure deployments it is not supported to divide these two layers between on-premises and Azure. This means an SAP system is either deployed on-premises or it is deployed in Azure. However, you can deploy the different systems of an SAP landscape into either Azure or on-premises. For example, you could deploy the SAP CRM development and test systems in Azure but the SAP CRM production system on-premises.
* Cloud-Only deployment: A deployment where the Azure subscription is not connected via a site-to-site or ExpressRoute connection to the on-premises network infrastructure. In common Azure documentation these kinds of deployments are also described as ‘Cloud-Only’ deployments. Virtual Machines deployed with this method are accessed through the internet and a public ip address and/or a public DNS name assigned to the VMs in Azure. For Microsoft Windows the on-premises Active Directory (AD) and DNS is not extended to Azure in these types of deployments. Hence the VMs are not part of the on-premises Active Directory. Same is true for Linux implementations using e.g. OpenLDAP + Kerberos.

> [AZURE.NOTE] Cloud-Only deployments in this document is defined as complete SAP landscapes are running exclusively in Azure without extension of Active Directory / OpenLDAP  or name resolution from on-premises into public cloud. Cloud-Only configurations are not supported for production SAP systems or configurations where SAP STMS or other on-premises resources need to be used between SAP systems hosted on Azure and resources residing on-premises.

* Cross-Premises: Describes a scenario where VMs are deployed to an Azure subscription that has site-to-site, multi-site or ExpressRoute connectivity between the on-premises datacenter(s) and Azure. In common Azure documentation, these kinds of deployments are also described as Cross-Premises scenarios. The reason for the connection is to extend on-premises domains, on-premises Active Directory / OpenLDAP and on-premises DNS into Azure. The on-premises landscape is extended to the Azure assets of the subscription. Having this extension, the VMs can be part of the on-premises domain. Domain users of the on-premises domain can access the servers and can run services on those VMs (like DBMS services). Communication and name resolution between VMs deployed on-premises and Azure deployed VMs is possible. This is the scenario we expect most SAP assets to be deployed in.  See [this][vpn-gateway-cross-premises-options] article and [this][vpn-gateway-site-to-site-create] for more information.

> [AZURE.NOTE] Cross-Premises deployments of SAP systems where Azure Virtual Machines running SAP systems are members of an on-premises domain are supported for production SAP systems. Cross-Premises configurations are supported for deploying parts or complete SAP landscapes into Azure. Even running the complete SAP landscape in Azure requires having those VMs being part of on-premises domain and ADS / OpenLDAP. In former versions of the documentation we talked about Hybrid-IT scenarios, where the term ‘Hybrid’ is rooted in the fact that there is a cross-premises connectivity between on-premises and Azure. Plus, the fact that the VMs in Azure are part of the on-premises Active Directory / OpenLDAP.

Some Microsoft documentation describes Cross-Premises scenarios a bit differently, especially for DBMS HA configurations. In the case of the SAP related documents, the Cross-Premises scenario just boils down to having a site-to-site or private (ExpressRoute) connectivity and the fact that the SAP landscape is distributed between on-premises and Azure.  

### <a name="e55d1e22-c2c8-460b-9897-64622a34fdff"></a>Resources
The following additional guides are available for the topic of SAP deployments on Azure:

* [SAP NetWeaver on Azure virtual machines (VMs) – Planning and Implementation Guide (this document)][planning-guide]
* [SAP NetWeaver on Azure virtual machines (VMs) – Deployment Guide][deployment-guide]
* [SAP NetWeaver on Azure virtual machines (VMs) – DBMS Deployment Guide][dbms-guide]

> [AZURE.IMPORTANT] Wherever possible a link to the referring SAP Installation Guide is used (Reference InstGuide-01, see <http://service.sap.com/instguides>). When it comes to the prerequisites and installation process, the SAP NetWeaver Installation Guides should always be read carefully, as this document only covers specific tasks for SAP NetWeaver systems installed in a Microsoft Azure Virtual Machine.

The following SAP Notes are related to the topic of SAP on Azure:

| Note number | Title |
|--------------|-------|
| [1928533] | SAP Applications on Azure: Supported Products and Sizing |
| [2015553] | SAP on Microsoft Azure: Support Prerequisites |
| [1999351] | Troubleshooting Enhanced Azure Monitoring for SAP |
| [2178632] | Key Monitoring Metrics for SAP on Microsoft Azure |
| [1409604] | Virtualization on Windows: Enhanced Monitoring |
| [2191498] | SAP on Linux with Azure: Enhanced Monitoring
| [2243692] | Linux on Microsoft Azure (IaaS) VM: SAP license issues
| [1984787] | SUSE LINUX Enterprise Server 12: Installation notes
| [2002167] | Red Hat Enterprise Linux 7.x: Installation and Upgrade

Please also read the [SCN Wiki](https://wiki.scn.sap.com/wiki/display/HOME/SAPonLinuxNotes) that contains all SAP Notes for Linux.

General default limitations and maximum limitations of Azure subscriptions can be found in [this article][azure-subscription-service-limits-subscription] 

## Possible Scenarios
SAP is often seen as one of the most mission-critical applications within enterprises. The architecture and operations of these applications is mostly very complex and ensuring that you meet requirements on availability and performance is important.

Thus enterprises have to think carefully about which applications can be run in a Public Cloud environment, independent of the chosen Cloud provider.

Possible system types for deploying SAP NetWeaver based applications within public cloud environments are listed below:

1. Medium sized production systems
1. Development systems
1. Testing systems
1. Prototype systems
1. Learning / Demonstration systems

In order to successfully deploy SAP systems into either Azure IaaS or IaaS in general, it is important to understand the significant differences between the offerings of traditional outsourcers or hosters and IaaS offerings. Whereas the traditional hoster or outsourcer will adapt infrastructure (network, storage and server type) to the workload a customer wants to host, it is instead the customer’s responsibility to choose the right workload for IaaS deployments.

As a first step, customers need to verify the following items:

* The SAP supported VM types of Azure
* The SAP supported products/releases on Azure
* The supported OS and DBMS releases for the specific SAP releases in Azure
* SAPS throughput provided by different Azure SKUs

The answers to these questions can be read in SAP Note [1928533]. 

As a second step, Azure resource and bandwidth limitations need to be compared to actual resource consumption of on-premises systems. Therefore, customers need to be familiar with the different capabilities of the Azure types supported with SAP in the area of:

* CPU and memory resources of different VM types and
* IOPS bandwidth of different VM types and 
* Network capabilities of different VM types.

Most of that data can be found [here][virtual-machines-sizes]

Keep in mind that the limits listed in the link above are upper limits. It does not mean that the limits for any of the resources, e.g. IOPS can be provided under all circumstances. The exceptions though are the CPU and memory resources of a chosen VM type. For the VM types supported by SAP, the CPU and memory resources are reserved and as such available at any point in time for consumption within the VM.

The Microsoft Azure platform like other IaaS platforms is a multi-tenant platform. This means that Storage, Network and other resources are shared between tenants. Intelligent throttling and quota logic is used to prevent one tenant from impacting the performance of another tenant (noisy neighbor) in a drastic way. Though logic in Azure tries to keep variances in bandwidth experienced small, highly shared platforms tend to introduce larger variances in resource/bandwidth availability than a lot of customers are used to in their on-premises deployments. As a result, you might experience different levels of bandwidth in regards to networking or storage I/O (the volume as well as latency) from minute to minute. The probability that a SAP system on Azure could experience larger variances than in an on-premises system needs to be taken into account.

A last step is to evaluate availability requirements. It can happen, that the underlying Azure infrastructure needs to get updated and requires the hosts running VMs to be rebooted. In these cases, VMs running on those hosts would be shut down and restarted as well. The timing of such maintenance is done during non-core business hours for a particular region but the potential window of a few hours during which a restart will occur is relatively wide. There are various technologies within the Azure platform that can be configured to mitigate some or all of the impact of such updates. Future enhancements of the Azure platform, DBMS and SAP application are designed to minimize the impact of such restarts. 

In order to successfully deploy a SAP system onto Azure, the on-premises SAP system(s) Operating System, Database and SAP applications must appear on the SAP Azure support matrix, fit within the resources the Azure infrastructure can provide and which can work with the Availability SLAs Microsoft Azure offers. As those systems are identified, you need to decide on one of the following two deployment scenarios.

### <a name="1625df66-4cc6-4d60-9202-de8a0b77f803"></a>Cloud-Only - Virtual Machine deployments into Azure without dependencies on the on-premises customer network
 
![Single VM with SAP demo or training scenario deployed in Azure][planning-guide-figure-100]

This scenario is typical for trainings or demo systems, where all the components of SAP and non-SAP software are installed within a single VM. Production SAP systems are not supported in this deployment scenario. In general, this scenario meets the following requirements:

* The VMs themselves are accessible over the public network. Direct network connectivity for the applications running within the VMs to the on-premises network of either the company owning the demos or trainings content or the customer is not necessary. 
* In case of multiple VMs representing the trainings or demo scenario, network communications and name resolution needs to work between the VMs. But communications between the set of VMs need to be isolated so that several sets of VMs can be deployed side by side without interference.  
* Internet connectivity is required for the end user to remote login into to the VMs hosted in Azure. Depending on the guest OS, Terminal Services/RDS or VNC/ssh is used to access the VM to either fulfill the training tasks or perform the demos. If SAP ports such as 3200, 3300 & 3600 can also be exposed the SAP application instance can be accessed from any Internet connected desktop.
* The SAP system(s) (and VM(s)) represent a standalone scenario in Azure which only requires public internet connectivity for end user access and does not require a connection to other VMs in Azure.
* SAPGUI and a browser are installed and run directly on the VM. 
* A fast reset of a VM to the original state and new deployment of that original state again is required. 
* In the case of demo and training scenarios which are realized in multiple VMs, an Active Directory / OpenLDAP and/or DNS service is required for each set of VMs.


![Group of VM's representing one demo or training scenario in an Azure Cloud Service][planning-guide-figure-200]

It is important to keep in mind that the VM(s) in each of the sets need to be deployed in parallel, where the VM names in each of the set are the same.

### <a name="f5b3b18c-302c-4bd8-9ab2-c388f1ab3d10"></a>Cross-Premise - Deployment of single or multiple SAP VMs into Azure with the requirement of being fully integrated into the on-premises network
 
![VPN with Site-To-Site Connectivity (Cross-Premise)][planning-guide-figure-300]

This scenario is a Cross-Premises scenario with many possible deployment patterns. It can be described as simply as running some parts of the SAP landscape on-premises and other parts of the SAP landscape on Azure. All aspects of the fact that part of the SAP components are running on Azure should be transparent for end users. Hence the SAP Transport Correction System (STMS), RFC Communication, Printing, Security (like SSO), etc. will work seamlessly for the SAP systems running on Azure. But the Cross-Premises scenario also describes a scenario where the complete SAP landscape runs in Azure with the customer’s domain and DNS extended into Azure. 

> [AZURE.NOTE] This is the deployment scenario which is supported for running productive SAP systems.

Read [this article][vpn-gateway-create-site-to-site-rm-powershell] for more information on how to connect your on-premises network to Microsoft Azure

> [AZURE.IMPORTANT] When we are talking about Cross-Premises scenarios between Azure and on-premises customer deployments, we are looking at the granularity of whole SAP systems. Scenarios which are _not supported_ for Cross-Premises scenarios are:
> 
> * Running different layers of SAP applications in different deployment methods. E.g. running the DBMS layer on-premises, but the SAP application layer in VMs deployed as Azure VMs or vice versa.
> * Some components of an SAP layer in Azure and some on-premises. E.g. splitting Instances of the SAP application layer between on-premises and Azure VMs. 
> * Distribution of VMs running SAP instances of one system over multiple Azure Regions is not supported.
> 
> The reason for these restrictions is the requirement for a very low latency high performance network within one SAP system, especially between the application instances and the DBMS layer of a SAP system.



### Supported OS and Database Releases

* Microsoft server software supported for Azure Virtual Machine Services is listed in this article: <http://support.microsoft.com/kb/2721672>. 
* Supported operating system releases, database system releases supported on Azure Virtual Machine Services in conjunction with SAP software are documented in SAP Note [1928533]. 
* SAP applications and releases supported on Azure Virtual Machine Services are documented in SAP Note [1928533].
* Only 64Bit images are supported to run as Guest VMs in Azure for SAP scenarios. This also means that only 64-bit SAP applications and databases are supported.

## Microsoft Azure Virtual Machine Services
The Microsoft Azure platform is an internet-scale cloud services platform hosted and operated in Microsoft data centers. The platform includes the Microsoft Azure Virtual Machine Services (Infrastructure as a Service, or IaaS) and a set of rich Platform as a Service (PaaS) capabilities.

The Azure platform reduces the need for up-front technology and infrastructure purchases. It simplifies maintaining and operating applications by providing on-demand compute and storage to host, scale and manage web application and connected applications. Infrastructure management is automated with a platform that is designed for high availability and dynamic scaling to match usage needs with the option of a pay-as-you-go pricing model.


 
![Positioning of Microsoft Azure Virtual Machine Services][planning-guide-figure-400]

With Azure Virtual Machine Services, Microsoft is enabling you to deploy custom server images to Azure as IaaS instances (see Figure 4). The Virtual Machines in Azure are based on Hyper-V virtual hard drives (VHD) and are able to run different operating systems as Guest OS.

From an operational perspective, the Azure Virtual Machine Service offers similar experiences as virtual machines deployed on premises. However, it has the significant advantage that you don’t need to procure, administer and manage the infrastructure. Developers and Administrators have full control of the operating system image within these virtual machines. Administrators can logon remotely into those virtual machines to perform maintenance and troubleshooting tasks as well as software deployment tasks. In regard to deployment, the only restrictions are the sizes and capabilities of Azure VMs. These may not be as fine granular in configuration as this could be done on premises. There is a choice of VM types that represent a combination of:

* Number of vCPUs,
* Memory,
* Number of VHDs that can be attached,
* Network and Storage bandwidths.

The size and limitations of various different virtual machines sizes offered can be seen in a table in [this article][virtual-machines-sizes]

As you will realize there are different families or series of virtual machines. As of Dec 2015, you can distinguish the following families of VMs:

* A0-A7 VM types: Not all of those are certified for SAP. First VM series that Azure IaaS got introduced with.
* A8-A11 VM types: High Performance computing instances. Running on different better performing compute hosts than other A-series VMs.
* D-Series VM types: Better performing than A0-A7. Not all of the VM types are certified with SAP.
* DS-Series VM types: use same hosts as D-series, but are able to connect to Azure Premium Storage (see chapter [Azure Premium Storage][planning-guide-3.3.2] of this document). Again not all VM types are certified with SAP.
* G-Series VM types: High memory VM types. 
* GS-Series VM types : like G-Series but including the option to use Azure Premium Storage ( see chapter [Azure Premium Storage][planning-guide-3.3.2] of this document ). When using GS-Series VMs as database servers it's mandatory to use Premium Storage for DB data and transaction log files


You may find the same CPU and memory configurations in different VM series. Nevertheless, when you look up the throughput performance of these VMs out of the different series they might differ significantly. Despite having the same CPU and memory configuration. Reason is that the underlying host server hardware at the introduction of the different VM types had different throughput characteristics.  Usually the difference shown in throughput performance also is reflected in the price of the different VMs.

Please note that not all different VM series might be offered in each one of the Azure Regions (for Azure Regions see next chapter). Also be aware that not all VMs or VM-Series are certified for SAP.

> [AZURE.IMPORTANT] For the use of SAP NetWeaver based applications, only the subset of VM types and configurations listed in SAP Note [1928533] are supported.

### <a name="be80d1b9-a463-4845-bd35-f4cebdb5424a"></a>Azure Regions
Microsoft allows to deploy Virtual Machines into so called ‘Azure Regions’. An Azure Region may be one or multiple data centers that are located in close proximity. For most of the geopolitical regions in the world Microsoft has at least two Azure Regions. E.g. in Europe there is an Azure Region of ‘North Europe’ and one of ‘West Europe’. Such two Azure Regions within a geopolitical region are separated by significant enough distance so that natural or technical disasters do not affect both Azure Regions in the same geopolitical region. Since Microsoft is steadily building out new Azure Regions in different geopolitical regions globally, the number of these regions is steadily growing and as of Dec 2015 reached the number of 20 Azure Regions with additional Regions announced already. You as a customer can deploy SAP systems into all these regions, including the two Azure Regions in China. For current up to date information about Azure regions see this website : <https://azure.microsoft.com/regions/>

### <a name="8d8ad4b8-6093-4b91-ac36-ea56d80dbf77"></a>The Microsoft Azure Virtual Machine Concept
Microsoft Azure offers an Infrastructure as a Service (IaaS) solution to host Virtual Machines with similar functionalities as an on-premises virtualization solution. You are able to create Virtual Machines from within the Azure Portal, PowerShell or CLI, which also offer deployment and management capabilities.

Azure Resource Manager allows you to provision your applications using a declarative template. In a single template, you can deploy multiple services along with their dependencies. You use the same template to repeatedly deploy your application during every stage of the application life cycle.

More information about using ARM templates can be found here :

* [Deploy and manage virtual machines by using Azure Resource Manager templates and the Azure CLI][virtual-machines-linux-cli-deploy-templates]
* [Manage virtual machines using Azure Resource Manager and PowerShell][virtual-machines-deploy-rmtemplates-powershell]
* <https://azure.microsoft.com/documentation/templates/>

Another interesting feature is the ability to create images from Virtual Machines, which allows you to prepare certain repositories from which you are able to quickly deploy Virtual machine instances which meet your requirements.

More information about creating images from Virtual Machines can be found in [this article][virtual-machines-linux-capture-image-resource-manager].

#### <a name="df49dc09-141b-4f34-a4a2-990913b30358"></a>Fault Domains
Fault Domains represent a physical unit of failure, very closely related to the physical infrastructure contained in data centers, and while a physical blade or rack can be considered a Fault Domain, there is no direct one-to-one mapping between the two. 

When you deploy multiple Virtual Machines as part of one SAP system in Microsoft Azure Virtual Machine Services, you can influence the Azure Fabric Controller to deploy your application into different Fault Domains, thereby meeting the requirements of the Microsoft Azure SLA. However, the distribution of Fault Domains over an Azure Scale Unit (collection of hundreds of Compute nodes or Storage nodes and networking) or the assignment of VMs to a specific Fault Domain is something over which you do not have direct control. In order to direct the Azure fabric controller to deploy a set of VMs over different Fault Domains, you need to assign an Azure Availability Set to the VMs at deployment time. For more information on Azure Availability Sets, see chapter [Azure Availability Sets][planning-guide-3.2.3] in this document.

#### <a name="fc1ac8b2-e54a-487c-8581-d3cc6625e560"></a>Upgrade Domains
Upgrade Domains represent a logical unit that help to determine how a VM within an SAP system, that consists of SAP instances running in multiple VMs, will be updated. When an upgrade occurs, Microsoft Azure goes through the process of updating these Upgrade Domains one by one. By spreading VMs at deployment time over different Upgrade Domains you can protect your SAP system partly from potential downtime. In order to force Azure to deploy the VMs of an SAP system spread over different Upgrade Domains, you need to set a specific attribute at deployment time of each VM. Similar to Fault Domains, an Azure Scale Unit is divided into multiple Upgrade Domains. In order to direct the Azure fabric controller to deploy a set of VMs over different Upgrade Domains, you need to assign an Azure Availability Set to the VMs at deployment time. For more information on Azure Availability Sets, see chapter [Azure Availability Sets][planning-guide-3.2.3] below.

#### <a name="18810088-f9be-4c97-958a-27996255c665"></a>Azure Availability Sets
Azure Virtual Machines within one Azure Availability Set will be distributed by the Azure Fabric Controller over different Fault and Upgrade Domains. The purpose of the distribution over different Fault and Upgrade Domains is to prevent all VMs of an SAP system from being shut down in the case of infrastructure maintenance or a failure within one Fault Domain. By default, VMs are not part of an Availability Set. The participation of a VM in an Availability Set is defined at deployment time or later on by a reconfiguration and re-deployment of a VM.

To understand the concept of Azure Availability Sets and the way Availability Sets relate to Fault and Upgrade Domains, please read [this article][virtual-machines-manage-availability]

To define availability sets for ARM via a json template see [the rest-api specs](https://github.com/Azure/azure-rest-api-specs/blob/master/arm-compute/2015-06-15/swagger/compute.json) and search for "availability".

### <a name="a72afa26-4bf4-4a25-8cf7-855d6032157f"></a>Storage: Microsoft Azure Storage and Data Disks
Microsoft Azure Virtual Machines utilize different storage types. When implementing SAP on Azure Virtual Machine Services it is important to understand the differences between these two main types of storage:

* Non-Persistent, volatile storage.
* Persistent storage.

The non-persistent storage is directly attached to the running Virtual Machines and resides on the compute nodes themselves – the local instance storage (temporary storage). The size depends on the size of the Virtual Machine chosen when the deployment started. This storage type is volatile and therefore the disk is initialized when a Virtual Machine instance is restarted. Typically, the pagefile for the operating system is located on this temporary disk.

___

> ![Windows][Logo_Windows] Windows
>
> On Windows VMs the temp drive is mounted as drive D:\ in a deployed VM.
>
> ![Linux][Logo_Linux] Linux
> 
> On Linux VMs it's mounted as /mnt/resource or /mnt. See more details here :
> 
> * [How to Attach a Data Disk to a Linux Virtual Machine][virtual-machines-linux-how-to-attach-disk]
> * <http://blogs.msdn.com/b/mast/archive/2013/12/07/understanding-the-temporary-drive-on-windows-azure-virtual-machines.aspx>

___

The actual drive is volatile because it is getting stored on the host server itself. If the VM moved in a redeployment (e.g. due to maintenance on the host or shutdown and restart) the content of the drive is lost. Therefore, it is not an option to store any important data on this drive. The type of media used for this type of storage differs between different VM series with very different performance characteristics which as of June 2015 look like:

* A5-A7: Very limited performance. Not recommended for anything beyond page file
* A8-A11: Very good performance characteristics with some ten thousand IOPS and >1GB/sec throughput.
* D-Series: Very good performance characteristics with some then thousand IOPS and >1GB/sec throughput.
* DS-Series: Very good performance characteristics with some ten thousand IOPS and >1GB/sec throughput.
* G-Series: Very good performance characteristics with some ten thousand IOPS and >1GB/sec throughput.
* GS-Series: Very good performance characteristics with some ten thousand IOPS and >1GB/sec throughput.

Statements above are applying to the VM types that are certified with SAP. The VM-series with excellent IOPS and throughput qualify for leverage by some DBMS features. Please see the [DBMS Deployment Guide][dbms-guide] for more details.

Microsoft Azure Storage provides persisted storage and the typical levels of protection and redundancy seen on SAN storage. Disks based on Azure Storage are virtual hard disk (VHDs) located in the Azure Storage Services. The local OS-Disk (Windows C:\, Linux / ( /dev/sda1 )) is stored on the Azure Storage, and additional Volumes/Disks mounted to the VM get stored there, too.

It is possible to upload an existing VHD from on-premises or create empty ones from within Azure and attach those to deployed VMs. Those VHDs are referenced as Azure Disks. 

After creating or uploading a VHD into Azure Storage, it is possible to mount and attach those to an existing Virtual Machine and to copy existing (unmounted) VHD.

As those VHDs are persisted, data and changes within those are safe when rebooting and recreating a Virtual Machine instance. Even if an instance is deleted, these VHDs stay 
safe and can be redeployed or in case of non-OS disks can be mounted to other VMs.

Within the network of Azure Storage different redundancy levels can be configured:

* Minimum level that can be selected is ‘local redundancy’, which is equivalent to three-replica of the data within the same data center of an Azure Region (see chapter [Azure Regions][planning-guide-3.1]). 
* Zone redundant storage which will spread the three images over different data centers within the same Azure Region.
* Default redundancy level is geographic redundancy which asynchronously replicates the content into another 3 images of the data into another Azure Region which is hosted in the same geopolitical region.

Also see the table on top of this article in regards to the different redundancy options: <https://azure.microsoft.com/pricing/details/storage/> 

More information in regards to Azure Storage can be found here: 

* <https://azure.microsoft.com/documentation/services/storage/>
* <https://azure.microsoft.com/services/site-recovery>
* <https://msdn.microsoft.com/library/windowsazure/ee691964.aspx>
* <https://blogs.msdn.com/b/azuresecurity/archive/2015/11/17/azure-disk-encryption-for-linux-and-windows-virtual-machines-public-preview.aspx>


#### Azure Standard Storage
Azure Standard BLOB storage was the type of storage available when Azure IaaS was released. There were IOPS quotas enforced per single VHD. Latency experienced was not in the same class as SAN/NAS devices typically deployed for high-end SAP systems hosted on-premises. Nevertheless, the Azure Standard Storage proved sufficient for many hundreds SAP systems meanwhile deployed in Azure.

Azure Standard Storage is charged based on the actual data that is stored, the volume of storage transactions, outbound data transfers and redundancy option chosen. Many VHDs can be created at the maximum 1TB in size, but as long as those remain empty there is no charge. If you then fill one VHD with 100GB each, you will be charged for storing 100GB and not for the nominal size the VHD got created with.

#### <a name="ff5ad0f9-f7f4-4022-9102-af07aef3bc92"></a>Azure Premium Storage
In April 2015 Microsoft introduced Azure Premium Storage. Premium Storage got introduced with the goal to provide:

* Better I/O latency.
* Better throughput.
* Less variability in I/O latency.

For that purpose, a lot of changes were introduced of which the two most significant are:

* Usage of SSD disks in the Azure Storage nodes
* A new read cache that is backed by the local SSD of an Azure compute node

In opposite to Standard storage where capabilities did not change dependent on the size of the disk (or VHD), Premium Storage currently has 3 different disk categories which are shown at the end of this article before the  FAQ section : <https://azure.microsoft.com/pricing/details/storage/>

You see that IOPS/VHD and disk throughput/VHD are dependent on the size category of the disks

Cost basis in the case of Premium Storage is not the actual data volume stored in such VHDs, but the size category of such a VHD, independent of the amount of the data that is stored within the VHD.

You also can create VHDs on Premium Storage that are not directly mapping into the size categories shown. This may be the case, especially when copying VHDs from Standard Storage into Premium Storage. In such cases a mapping to the next largest Premium Storage disk option is performed. 

Please be aware that only certain VM series can benefit from the Azure Premium Storage. As of Dec 2015, these are the DS- and GS-series. The DS-series is basically the same as D-series with the exception that DS-series has the ability to mount Premium Storage based VMs additionally to VHDs that are hosted on Azure Standard Storage. Same thing is valid
for G-series compared to GS-series.

If you are checking out the part of the DS-series VMs in [this article][virtual-machines-sizes] you also will realize that there are data volume limitations to Premium Storage VHDs on the granularity of the VM level. Different DS-series or GS-series VMs also have different limitations in regards to the number of VHDs that can be mounted. These limits are documented in the article mentioned above as well. But in essence it means that if you e.g. mount 32 x P30 disks/VHDs to a single DS14 VM you can NOT get 32 x the maximum throughput of a P30 disk. Instead the maximum throughput on VM level as documented in the article will limit data throughput. 

More information on Premium Storage can be found here: <http://azure.microsoft.com/blog/2015/04/16/azure-premium-storage-now-generally-available-2>

#### Azure Storage Accounts
When deploying services or VMs in Azure, deployment of VHDs and VM Images must be organized in units called Azure Storage Accounts. When planning an Azure deployment, you need to carefully consider the restrictions of Azure. On the one side, there is a limited number of Storage Accounts per Azure subscription. Although each Azure Storage Account can hold a large number of VHD files, there is a fixed limit on the total IOPS per Storage Account. When deploying hundreds of SAP VMs with DBMS systems creating significant IO calls, it is recommended to distribute high IOPS DBMS VMs between multiple Azure Storage Accounts. Care must be taken not to exceed the current limit of Azure Storage Accounts per subscription. Because storage is a vital part of the database deployment for an SAP system, this concept is discussed in more detail in the already referenced [DBMS Deployment Guide][dbms-guide].

More information about Azure Storage Accounts can be found in [this article][storage-scalability-targets]. Reading this article, you will realize that there are differences in the limitations between Azure Standard Storage Accounts and Premium Storage Accounts. Major differences are the volume of data that can be stored within such a Storage Account. In Standard Storage the volume is a magnitude larger than with Premium Storage. On the other side the Standard Storage Account is severely limited in IOPS (see column ‘Total Request Rate’), whereas the Azure Premium Storage Account has no such limitation. We will discuss details and results of these differences when discussing the deployments of SAP systems, especially the DBMS servers.

Within a Storage Account, you have the possibility to create different containers for the purpose of organizing and categorizing different VHDs. These containers are usually used to e.g. separate VHDs of different VMs. There are no performance implications in using just one container or multiple containers underneath a single Azure Storage Account.

Within Azure a VHD name follows the following naming connection that needs to provide a unique name for the VHD within Azure:

	http(s)://<storage account name>.blob.core.windows.net/<container name>/<vhd name>

As mentioned the string above needs to uniquely identify the VHD that is stored on Azure Storage.

### <a name="61678387-8868-435d-9f8c-450b2424f5bd"></a>Microsoft Azure Networking
Microsoft Azure will provide a network infrastructure which allows the mapping of all scenarios which we want to realize with SAP software. The capabilities are:

* Access from the outside, directly to the VMs via Windows Terminal Services or ssh/VNC
* Access to services and specific ports used by applications within the VMs
* Internal Communication and Name Resolution between a group of VMs deployed as Azure VMs
* Cross-Premises Connectivity between a customer’s on-premises network and the Azure network
* Cross Azure Region or data center connectivity between Azure sites 

More information can be found here: <https://azure.microsoft.com/documentation/services/virtual-network/>

There are a lot of different possibilities to configure name and IP resolution in Azure. In this document, Cloud-Only scenarios rely on the default of using Azure DNS (in contrast to defining an own DNS service). There is also a new Azure DNS service which can be used instead of setting up your own
DNS server. More information can be found in [this article][virtual-networks-manage-dns-in-vnet] and on [this page](https://azure.microsoft.com/services/dns/).

For Cross-Premises scenarios we are relying on the fact that the on-premises AD/OpenLDAP/DNS has been extended via VPN or private connection to Azure. For certain scenarios as documented here, it might be necessary to have an AD/OpenLDAP replica installed in Azure.

Because networking and name resolution is a vital part of the database deployment for an SAP system, this concept is discussed in more detail in the [DBMS Deployment Guide][dbms-guide].


##### Azure Virtual Networks

By building up an Azure Virtual Network you can define the address range of the private IP addresses allocated by Azure DHCP functionality. In Cross-Premises scenarios, the IP address range defined will still be allocated using DHCP by Azure. However, Domain Name resolution will be done on-premises (assuming that the VMs are a part of an on-premises domain) and hence can resolve addresses beyond different Azure Cloud Services.

[comment]: <> (MSSedusch still needed? TODO Originally an Azure Virtual Network was bound to an Affinity Group. With that a Virtual Network in Azure got restricted to the Azure Scale Unit that the Affinity Group got assigned to. In the end, this meant the Virtual Network was restricted to the resources available in the Azure Scale Unit. This has since changed and now Azure Virtual Networks can stretch across more than one Azure Scale Unit. However, that requires that Azure Virtual Networks are **NOT** associated with Affinity Groups anymore at creation time. We already mentioned earlier that in opposite to recommendations a year ago, you should **NOT leverage Azure Affinity Groups anymore**. For details, please see <https://azure.microsoft.com/blog/regional-virtual-networks/>)

Every Virtual Machine in Azure needs to be connected to a Virtual Network.

More details can be found in [this article][resource-groups-networking] and on [this page](https://azure.microsoft.com/documentation/services/virtual-network/).

[comment]: <> (MShermannd TODO Couldn't find an article which includes the OpenLDAP topic + ARM; )
[comment]: <> (MSSedusch <https://channel9.msdn.com/Blogs/Open/Load-balancing-highly-available-Linux-services-on-Windows-Azure-OpenLDAP-and-MySQL>)

> [AZURE.NOTE] By default, once a VM is deployed you cannot change the Virtual Network configuration. The TCP/IP settings must be left to the Azure DHCP server. Default behavior is Dynamic IP assignment.

The MAC address of the virtual network card may change e.g. after re-size and the Windows or Linux guest OS will pick up the new network card and will automatically use DHCP to assign the IP and DNS addresses in this case.

##### Static IP Assignment
It is possible to assign fixed or reserved IP addresses to VMs within an Azure Virtual Network. Running the VMs in an Azure Virtual Network opens a great possibility to leverage this functionality if needed or required for some scenarios. The IP assignment remains valid throughout the existence of the VM, independent of whether the VM is running or shutdown. As a result, you need to take the overall number of VMs (running and stopped VMS) into account when defining the range of IP addresses for the Virtual Network. The IP address remains assigned either until the VM and its Network Interface is deleted or until the IP address gets de-assigned again. Please see detailed information in [this article][virtual-networks-static-private-ip-arm-pportal].

##### Multiple NICs per VM
You can define multiple virtual network interface cards (vNIC) for an Azure Virtual Machine. With the ability to have multiple vNICs you can start to set up network traffic separation where e.g. client traffic is routed through one vNIC and backend traffic is routed through a second vNIC. Dependent on the type of VM there are different limitations in regards to the number of vNICs. Exact details, functionality and restrictions can be found in these articles:
 
* [Create a VM with multiple NICs][virtual-networks-multiple-nics]
* [Deploy multi NIC VMs using a template][virtual-network-deploy-multinic-arm-template]
* [Deploy multi NIC VMs using PowerShell][virtual-network-deploy-multinic-arm-ps]
* [Deploy multi NIC VMs using the Azure CLI][virtual-network-deploy-multinic-arm-cli]

#### Site-to-Site Connectivity
Cross-Premises is Azure VMs and On-Premises linked with a transparent and permanent VPN connection. It is expected to become the most common SAP deployment pattern in Azure. The assumption is that operational procedures and processes with SAP instances in Azure should work transparently. This means you should be able to print out of these systems as well as use the SAP Transport Management System (TMS) to transport changes from a development system in Azure to a test system which is deployed on-premises. More documentation around site-to-site can be found in [this article][vpn-gateway-create-site-to-site-rm-powershell]

##### VPN Tunnel Device
In order to create a site-to-site connection (on-premises data center to Azure data center), you will need to either obtain and configure a VPN device, or use Routing and Remote Access Service (RRAS) which was introduced as a software component with Windows Server 2012. 

* [Create a virtual network with a site-to-site VPN connection using PowerShell][vpn-gateway-create-site-to-site-rm-powershell]
* [About VPN devices for Site-to-Site VPN Gateway connections][vpn-gateway-about-vpn-devices]
* [VPN Gateway FAQ][vpn-gateway-vpn-faq]

![Site-to-site connection between on-premises and Azure][planning-guide-figure-600]

The Figure above shows two Azure subscriptions have IP address subranges reserved for usage in Virtual Networks in Azure. The connectivity from the on-premises network to Azure is established via VPN.

#### Point-to-Site VPN
Point-to-site VPN requires every client machine to connect with its own VPN into Azure. For the SAP scenarios we are looking at, point-to-site connectivity is not practical. Therefore, no further references will be given to point-to-site VPN connectivity.

[comment]: <> (MSSedusch -- More information can be found here)
[comment]: <> (MShermannd TODO Link no longer valid; But ARM is anyway not supported - see next link below)
[comment]: <> (MSSedusch -- <http://msdn.microsoft.com/library/azure/dn133798.aspx>.)
[comment]: <> (MShermannd TODO Point to Site not supported yet with ARM )
[comment]: <> (MSSedusch -- <https://azure.microsoft.com/documentation/articles/vpn-gateway-point-to-site-create/>)

#### Multi-Site VPN
Azure also nowadays offers the possibility to create Multi-Site VPN connectivity for one Azure subscription. Previously a single subscription was limited to one site-to-site VPN connection. This limitation went away with Multi-Site VPN connections for a single subscription. This makes it possible to leverage more than one Azure Region for a specific subscription through Cross-Premises configurations.

For more documentation please see [this article][vpn-gateway-create-site-to-site-rm-powershell]
[comment]: <> (MShermannd TODO found no ARM docu link)

#### VNet to VNet Connection
Using Multi-Site VPN, you need to configure a separate Azure Virtual Network in each of the regions. However very often you have the requirement that the software components in the different regions should communicate with each other. Ideally this communication should not be routed from one Azure Region to on-premises and from there to the other Azure Region. To shortcut, Azure offers the possibility to configure a connection from one Azure Virtual Network in one region to another Azure Virtual Network hosted in another region. This functionality is called VNet-to-VNet connection. More details on this functionality can be found here: 
<https://azure.microsoft.com/documentation/articles/vpn-gateway-vnet-vnet-rm-ps/>.

#### Private Connection to Azure – ExpressRoute
Microsoft Azure ExpressRoute allows the creation of private connections between Azure data centers and either the customer's on-premises infrastructure or in a co-location environment. ExpressRoute is offered by various MPLS (packet switched) VPN providers or other Network Service Providers. ExpressRoute connections do not go over the public Internet. ExpressRoute connections offer higher security, more reliability through multiple parallel circuits, faster speeds and lower latencies than typical connections over the Internet. 

Find more details on Azure ExpressRoute and offerings here:

* <https://azure.microsoft.com/documentation/services/expressroute/>
* <https://azure.microsoft.com/pricing/details/expressroute/>
* <https://azure.microsoft.com/documentation/articles/expressroute-faqs/>

Express Route enables multiple Azure subscriptions through one ExpressRoute circuit as documented here 

* <https://azure.microsoft.com/documentation/articles/expressroute-howto-linkvnet-arm/> 
* <https://azure.microsoft.com/documentation/articles/expressroute-howto-circuit-arm/>


#### Forced tunneling in case of Cross-Premise
For VMs joining on-premises domains through site-to-site, point-to-site or ExpressRoute, you need to make sure that the Internet proxy settings are getting deployed for all the users in those VMs as well. By default, software running in those VMs or users using a browser to access the internet would not go through the company proxy, but would connect straight through Azure to the internet. But even the proxy setting is not a 100% solution to direct the traffic through the company proxy since it is responsibility of software and services to check for the proxy. If software running in the VM is not doing that or an administrator manipulates the settings, traffic to the Internet can be detoured again directly through Azure to the Internet. 

In order to avoid this, you can configure Forced Tunneling with site-to-site connectivity between on-premises and Azure. The detailed description of the Forced Tunneling feature is published here 
<https://azure.microsoft.com/documentation/articles/vpn-gateway-forced-tunneling-rm/> 

Forced Tunneling with ExpressRoute is enabled by customers advertising a default route via the ExpressRoute BGP peering sessions.

#### Summary of Azure Networking
This chapter contained many important points about Azure Networking. Here is a summary of the main points:


* Azure Virtual Networks allows to set up the network according to your own needs
* Azure Virtual Networks can be leveraged to assign IP address ranges to VMs or assign fixed IP addresses to VMs
* To set up a Site-To-Site or Point-To-Site connection you need to create an Azure Virtual Network first
* Once a virtual machine has been deployed it is no longer possible to change the Virtual Network assigned to the VM

### Quotas in Azure Virtual Machine Services
We need to be clear about the fact that the storage and network infrastructure is shared between VMs running a variety of services in the Azure infrastructure. And just as in the customer’s own data centers, over-provisioning of some of the infrastructure resources does take place to a degree. The Microsoft Azure Platform uses disk, CPU, network and other quotas to limit the resource consumption and to preserve consistent and deterministic performance.  The different VM types (A5, A6, etc) have different quotas for the number of disks, CPU, RAM and Network.

> [AZURE.NOTE] CPU and memory resources of the VM types supported by SAP are pre-allocated on the host nodes. This means that once the VM is deployed, the resources on the host will be available as defined by the VM type.

When planning and sizing SAP on Azure solutions the quotas for each virtual machine size must be considered.  The VM quotas are described [here][virtual-machines-sizes].

The quotas described represent the theoretical maximum values.  The limit of IOPS per VHD may be achieved with small IOs (8kb) but possibly may not be achieved with large IOs (1Mb).  The IOPS limit is enforced on the granularity of single VHDs.

As a rough decision tree to decide whether an SAP system fits into Azure Virtual Machine Services and its capabilities or whether an existing system needs to be configured differently in order to deploy the system on Azure, the decision tree below can be used:
 
![Decision tree to decide ability to deploy SAP on Azure][planning-guide-figure-700]

**Step 1**: The most important information to start with is the SAPS requirement for a given SAP system. The SAPS requirements need to be separated out into the DBMS part and the SAP application part, even if the SAP system is already deployed on-premises in a 2-tier configuration. For existing systems, the SAPS related to the hardware in use often can be determined or estimated based on existing SAP benchmarks. The results can be found here: 
<http://global.sap.com/campaigns/benchmark/index.epx>. 
For newly deployed SAP systems, you should have gone through a sizing exercise which should determine the SAPS requirements of the system.
See also this blog and attached document for SAP sizing on Azure :
<http://blogs.msdn.com/b/saponsqlserver/archive/2015/12/01/new-white-paper-on-sizing-sap-solutions-on-azure-public-cloud.aspx>

**Step 2**: For existing systems, the I/O volume and I/O operations per second on the DBMS server should be measured. For newly planned systems, the sizing exercise for the new system also should give rough ideas of the I/O requirements on the DBMS side. If unsure, you eventually need to conduct a Proof of Concept.

**Step 3**: Compare the SAPS requirement for the DBMS server with the SAPS the different VM types of Azure can provide. The information on SAPS of the different Azure VM types is documented in SAP Note [1928533]. The focus should be on the DBMS VM first since the database layer is the layer in a SAP NetWeaver system that does not scale out in the majority of deployments. In contrast, the SAP application layer can be scaled out. If none of the SAP supported Azure VM types can deliver the required SAPS, the workload of the planned SAP system can’t be run on Azure. You either need to deploy the system on-premises or you need to change the workload volume for the system.

**Step 4**: As documented [here][virtual-machines-sizes], Azure enforces an IOPS quota per VHD independent whether you use Standard Storage or Premium Storage. Dependent on the VM type, the number of VHDs which can be mounted varies. As a result, you can calculate a maximum IOPS number that can be achieved with each of the different VM types. Dependent on the database file layout, you can stripe VHDs to become one volume in the guest OS. However, if the current IOPS volume of a deployed SAP system exceeds the calculated limits of the largest VM type of Azure and if there is no chance to compensate with more memory, the workload of the SAP system can be impacted severely. In such cases, you can hit a point where you should not deploy the system on Azure.

**Step 5**: Especially in SAP systems which are deployed on-premises in 2-Tier configurations, the chances are that the system might need to be configured on Azure in a 3-Tier configuration. In this step, you need to check whether there is a component in the SAP application layer which can’t be scaled out and which would not fit into the CPU and memory resources the different Azure VM types offer. If there indeed is such a component, the SAP system and its workload can’t be deployed into Azure. But if you can scale-out the SAP application components into multiple Azure VMs, the system can be deployed into Azure. 

**Step 6**: If the DBMS and SAP application layer components can be run in Azure VMs, the configuration needs to be defined with regard to:

* Number of Azure VMs
* VM types for the individual components
* Number of VHDs in DBMS VM to provide enough IOPS

## Managing Azure Assets

### Azure Portal
The Azure Portal is one of three interfaces to manage Azure VM deployments. The basic management tasks, like deploying VMs from images, can be done through the Azure Portal. In addition, the creation of Storage Accounts, Virtual Networks and other Azure components are also tasks the Azure Portal can handle very well. However, functionality like uploading VHDs from on-premises to Azure or copying a VHD within Azure are tasks which require either third party tools or administration through PowerShell or CLI.
 
![Microsoft Azure Portal - Virtual Machine overview][planning-guide-figure-800]

[comment]: <> (MSSedusch * <https://azure.microsoft.com/documentation/articles/virtual-networks-create-vnet-arm-pportal/>)
[comment]: <> (MSSedusch * <https://azure.microsoft.com/documentation/articles/virtual-machines-windows-tutorial/>)

Administration and configuration tasks for the Virtual Machine instance are possible from within the Azure Portal. 

Besides restarting and shutting down a Virtual Machine you can also attach, detach and create data disks for the Virtual Machine instance, to capture the instance for image preparation and configure the size of the Virtual Machine instance.

The Azure Portal provides basic functionality to deploy and configure VMs and many other Azure services. However not all available functionality is covered by the Azure Portal. In the Azure Portal, it’s not possible to perform tasks like:

* Uploading VHDs to Azure
* Copying VMs

[comment]: <> (MShermannd TODO what about automation service for SAP VMs ? )
[comment]: <> (MSSedusch deployment of multiple VMs os meanwhile possible)
[comment]: <> (MSSedusch Also any type of automation regarding deployment is not possible with the Azure portal. Tasks such as scripted deployment of multiple VMs is not possible via the Azure Portal.) 

### Management via Microsoft Azure PowerShell cmdlets
Windows PowerShell is a powerful and extensible framework that has been widely adopted by customers deploying larger numbers of systems in Azure. After the installation of PowerShell cmdlets on a desktop, laptop or dedicated management station, the PowerShell cmdlets can be run remotely.

The process to enable a local desktop/laptop for the usage of Azure PowerShell cmdlets and how to configure those for the usage with the Azure subscription(s) is described in [this article][powershell-install-configure]. 

More detailed steps on how to install, update and configure the Azure PowerShell cmdlets can also be found in [this chapter of the Deployment Guide][deployment-guide-4.1].

Customer experience so far has been that PowerShell (PS) is certainly the more powerful tool to deploy VMs and to create custom steps in the deployment of VMs. All of the customers running SAP instances in Azure are using PS cmdlets to supplement management tasks they do in the Azure Portal or are even using PS cmdlets exclusively to manage their deployments in Azure. Since the Azure specific cmdlets share the same naming convention as the more than 2000 Windows related cmdlets, it is an easy task for Windows administrators to leverage those cmdlets.

See example here :
<http://blogs.technet.com/b/keithmayer/archive/2015/07/07/18-steps-for-end-to-end-iaas-provisioning-in-the-cloud-with-azure-resource-manager-arm-powershell-and-desired-state-configuration-dsc.aspx>

[comment]: <> (MShermannd TODO describe new CLI command when tested )
Deployment of the Azure Monitoring Extension for SAP (see chapter [Azure Monitoring Solution for SAP][planning-guide-9.1] in this document) is only possible via PowerShell or CLI. Therefore it is mandatory to setup and configure PowerShell or CLI when deploying or administering an SAP NetWeaver system in Azure.  

As Azure provides more functionality, new PS cmdlets are going to be added that requires an update of the cmdlets. Therefore it makes sense to check the Azure Download site at least once the month <https://azure.microsoft.com/downloads/> for a new version of the cmdlets. The new version will just be installed on top of the older version.

For a general list of Azure related PowerShell commands check here: <https://msdn.microsoft.com/library/azure/dn708514.aspx>. 

### Management via Microsoft Azure CLI commands

For customers who use Linux and want to manage Azure resources Powershell might not be an option. Microsoft offers Azure CLI as an alternative.
The Azure CLI provides a set of open source, cross-platform commands for working with the Azure Platform. The Azure CLI provides much of 
the same functionality found in the Azure portal.

For information about installation, configuration and how to use CLI commands to accomplish Azure tasks see

* [Install the Azure CLI][xplat-cli]
* [Deploy and manage virtual machines by using Azure Resource Manager templates and the Azure CLI][virtual-machines-linux-cli-deploy-templates]
* [Use the Azure CLI for Mac, Linux, and Windows with Azure Resource Manager][xplat-cli-azure-resource-manager]

Please also read chapter [Azure CLI for Linux VMs][deployment-guide-4.5.2] in the [Deployment Guide][planning-guide] on how to use Azure CLI to deploy the Azure Monitoring Extension for SAP.

## Different ways to deploy VMs for SAP in Azure
In this chapter you will learn the different ways to deploy a VM in Azure. Additional preparation procedures, as well as handling of VHDs and VMs in Azure are covered in this chapter.

### Deployment of VMs for SAP
Microsoft Azure offers multiple ways to deploy VMs and associated disks. Thus it is very important to understand the differences since preparations of the VMs might differ depending on the method of deployment. In general, we will take a look at the following scenarios:

#### <a name="4d175f1b-7353-4137-9d2f-817683c26e53"></a>Moving a VM from on-premises to Azure with a non-generalized disk
You plan to move a specific SAP system from on-premises to Azure. This can be done by uploading the VHD which contains the OS, the SAP Binaries and DBMS binaries plus the VHDs with the data and log files of the DBMS to Azure. In contrast to [scenario #2 below][planning-guide-5.1.2], you keep the hostname, SAP SID and SAP user accounts in the Azure VM as they were configured in the on-premises environment. Therefore, generalizing the image is not necessary. Please see chapters [Preparation for moving a VM from on-premises to Azure with a non-generalized disk][planning-guide-5.2.1] of this document for on-premises preparation steps and upload of non-generalized VMs or VHDs to Azure. Please read chapter [Scenario 3: Moving a VM from on-premises using a non-generalized Azure VHD with SAP][deployment-guide-3.4] in the [Deployment Guide][deployment-guide] for detailed steps of deploying such an image in Azure.

#### <a name="e18f7839-c0e2-4385-b1e6-4538453a285c"></a>Deploying a VM with a customer specific image
Due to specific patch requirements of your OS or DBMS version, the provided images in the Azure Marketplace might not fit your needs. Therefore, you might need to create a VM using your own ‘private’ OS/DBMS VM image which can be deployed several times afterwards. To prepare such a ‘private’ image for duplication, the following items have to be considered :

___

> ![Windows][Logo_Windows] Windows
>
> The Windows settings (like Windows SID and hostname) must be abstracted/generalized on the on-premises VM via the sysprep command.
[comment]: <> (MSSedusch > See more details here :)
[comment]: <> (MShermannd TODO first link is about classic model. Didn't find an Azure docu article)
[comment]: <> (MSSedusch > <https://azure.microsoft.com/documentation/articles/virtual-machines-create-upload-vhd-windows-server/>)
[comment]: <> (MSSedusch > <http://blogs.technet.com/b/blainbar/archive/2014/09/12/modernizing-your-infrastructure-with-hybrid-cloud-using-custom-vm-images-and-resource-groups-in-microsoft-azure-part-21-blain-barton.aspx>)
>
> ![Linux][Logo_Linux] Linux
>
> Please follow the steps described in these articles for [SUSE][virtual-machines-linux-create-upload-vhd-suse] or [Red Hat][virtual-machines-linux-redhat-create-upload-vhd] to prepare a VHD to be uploaded to Azure.

___

If you have already installed SAP content in your on-premises VM (especially for 2-Tier systems), you can adapt the SAP system settings after the deployment of the Azure VM through the instance rename procedure supported by the SAP Software Provisioning Manager (SAP Note [1619720]). See chapters [Preparation for deploying a VM with a customer specific image for SAP][planning-guide-5.2.2] and [Uploading a VHD from on-premises to Azure][planning-guide-5.3.2] of this document for on-premises preparation steps and upload of a generalized VM to Azure. Please read chapter [Scenario 2: Deploying a VM with a custom image for SAP][deployment-guide-3.3] in the [Deployment Guide][deployment-guide] for detailed steps of deploying such an image in Azure.

#### Deploying a VM out of the Azure Marketplace
You would like to use a Microsoft or 3rd party provided VM image from the Azure Marketplace to deploy your VM. After you deployed your VM in Azure, you follow the same guidelines and tools to install the SAP software and/or DBMS inside your VM as you would do in an on-premises environment. For more detailed deployment description, please see chapter [Scenario 1: Deploying a VM out of the Azure Marketplace for SAP][deployment-guide-3.2] in the [Deployment Guide][deployment-guide].

### <a name="6ffb9f41-a292-40bf-9e70-8204448559e7"></a>Preparing VMs with SAP for Azure
Before uploading VMs into Azure you need to make sure the VMs and VHDs fulfill certain requirements. There are small differences depending on the deployment method that is used. 

#### <a name="1b287330-944b-495d-9ea7-94b83aff73ef"></a>Preparation for moving a VM from on-premises to Azure with a non-generalized disk
A common deployment method is to move an existing VM which runs an SAP system from on-premises to Azure. That VM and the SAP system in the VM just should run in Azure using the same hostname and very likely the same SAP SID. In this case the guest OS of VM should not be generalized for multiple deployments. If the on-premises network got extended into Azure (see chapter [Cross-Premise - Deployment of single or multiple SAP VMs into Azure with the requirement of being fully integrated into the on-premises network][planning-guide-2.2] in this document), then even the same domain accounts can be used within the VM as those were used before on-premises. 

Requirements when preparing your own Azure VM Disk are:

* Originally the VHD containing the operating system could have a maximum size of 127GB only. This limitation got eliminated at the end of March 2015. Now the VHD containing the operating system can be up to 1TB in size as any other Azure Storage hosted VHD as well.
[comment]: <> (MShermannd  TODO have to check if CLI also converts to static )
* It needs to be in the fixed VHD format. Dynamic VHDs or VHDs in VHDx format are not yet supported on Azure. Dynamic VHDs will be converted to static VHDs when you upload the VHD with PowerShell commandlets or CLI
* VHDs which are mounted to the VM and should be mounted again in Azure to the VM need to be in a fixed VHD format as well. The same size limit of the OS disk applies to data disks as well. VHDs can have a maximum size of 1TB. Dynamic VHDs will be converted to static VHDs when you upload the VHD with PowerShell commandlets or CLI
* Add another local account with administrator privileges which can be used by Microsoft support or which can be assigned as context for services and applications to run in until the VM is deployed and more appropriate users can be used.
* For the case of using a Cloud-Only deployment scenario (see chapter [Cloud-Only - Virtual Machine deployments into Azure without dependencies on the on-premises customer network][planning-guide-2.1] of this document) in combination with this deployment method, domain accounts might not work once the Azure Disk is deployed in Azure. This is especially true for accounts which are used to run services like the DBMS or SAP applications. Therefore you need to replace such domain accounts with VM local accounts and delete the on-premises domain accounts in the VM. Keeping on-premises domain users in the VM image is not an issue when the VM is deployed in the Cross-Premises scenario as described in chapter [Cross-Premise - Deployment of single or multiple SAP VMs into Azure with the requirement of being fully integrated into the on-premises network][planning-guide-2.2] in this document.
* If domain accounts were used as DBMS logins or users when running the system on-premises and those VMs are supposed to be deployed in Cloud-Only scenarios, the domain users need to be deleted. You need to make sure that the local administrator plus another VM local user is added as a login/user into the DBMS as administrators.
* Add other local accounts as those might be needed for the specific deployment scenario.

___

> ![Windows][Logo_Windows] Windows
>
> In this scenario no generalization (sysprep ) of the VM is required to upload and deploy the VM on Azure.
> Make sure that drive D:\ is not used
> Set disk automount for attached disks as described in chapter [Setting automount for attached disks][planning-guide-5.5.3] in this document.
> 
> ![Linux][Logo_Linux] Linux
>
> In this scenario no generalization ( waagent -deprovision ) of the VM is required to upload and deploy the VM on Azure.
> Make sure that /mnt/resource is not used and that ALL disks are mounted via uuid. For the OS disk make sure that the bootloader entry also reflects the uuid-based mount.

___

#### <a name="57f32b1c-0cba-4e57-ab6e-c39fe22b6ec3"></a>Preparation for deploying a VM with a customer specific image for SAP
VHD files that contain a generalized OS are also stored in containers on Azure Storage Accounts. You can deploy a new VM from such an image VHD by referencing the VHD as a source VHD in your deployment template files as described in chapter [Scenario 2: Deploying a VM with a custom image for SAP][deployment-guide-3.3] of the [Deployment Guide][deployment-guide]. 

Requirements when preparing your own Azure VM Image are:

* Originally the VHD containing the operating system could have a maximum size of 127GB only. This limitation got eliminated at the end of March 2015. Now the VHD containing the operating system can be up to 1TB in size as any other Azure Storage hosted VHD as well.
[comment]: <> (MShermannd  TODO have to check if CLI also converts to static )
* It needs to be in the fixed VHD format. Dynamic VHDs or VHDs in VHDx format are not yet supported on Azure. Dynamic VHDs will be converted to static VHDs when you upload the VHD with PowerShell commandlets or CLI
* VHDs which are mounted to the VM and should be mounted again in Azure to the VM need to be in a fixed VHD format as well. The same size limit of the OS disk applies to data disks as well. VHDs can have a maximum size of 1TB. Dynamic VHDs will be converted to static VHDs when you upload the VHD with PowerShell commandlets or CLI
* Since all the Domain users registered as users in the VM will not exist in a Cloud-Only scenario (see chapter [Cloud-Only - Virtual Machine deployments into Azure without dependencies on the on-premises customer network][planning-guide-2.1] of this document), services using such domain accounts might not work once the Image is deployed in Azure. This is especially true for accounts which are used to run services like DBMS or SAP applications. Therefore you need to replace such domain accounts with VM local accounts and delete the on-premises domain accounts in the VM. Keeping on-premises domain users in the VM image might not be an issue when the VM is deployed in the Cross-Premise scenario as described in chapter [Cross-Premise - Deployment of single or multiple SAP VMs into Azure with the requirement of being fully integrated into the on-premises network][planning-guide-2.2] in this document.
* Add another local account with administrator privileges which can be used by Microsoft support in problem investigations or which can be assigned as context for services and applications to run in until the VM is deployed and more appropriate users can be used.
* In Cloud-Only deployments and where domain accounts were used as DBMS logins or users when running the system on-premises, the domain users should be deleted. You need to make sure that the local administrator plus another VM local user is added as a login/user of the DBMS as administrators.
* Add other local accounts as those might be needed for the specific deployment scenario.
* If the image contains an installation of SAP NetWeaver and renaming of the host name from the original name at the point of the Azure deployment is likely, it is recommended to copy the latest versions of the SAP Software Provisioning Manager DVD into the template. This will enable you to easily use the SAP provided rename functionality to adapt the changed hostname and/or change the SID of the SAP system within the deployed VM image as soon as a new copy is started.

___

> ![Windows][Logo_Windows] Windows
>
> Make sure that drive D:\ is not used
> Set disk automount for attached disks as described in chapter [Setting automount for attached disks][planning-guide-5.5.3] in this document.
> 
> ![Linux][Logo_Linux] Linux
>
> Make sure that /mnt/resource is not used and that ALL disks are mounted via uuid. For the OS disk make sure the bootloader entry also reflects the uuid-based mount.

___

* SAP GUI (for administrative and setup purposes) can be pre-installed in such a template.
* Other software necessary to run the VMs successfully in Cross-Premises scenarios can be installed as long as this software can work with the rename of the VM.

If the VM is prepared sufficiently to be generic and eventually independent of accounts/users not available in the targeted Azure deployment scenario, the last preparation step of generalizing such an image is conducted.

##### Generalizing a VM 

___

[comment]: <> (MShermannd  TODO have to find better articles / docu about generalizing the VMs for ARM )
> ![Windows][Logo_Windows] Windows
>
> The last step is to log in to a VM with an Administrator account. Open a Windows command window as ‘administrator’. Go to …\windows\system32\sysprep and execute sysprep.exe.
> A small window will appear. It is important to check the ‘Generalize’ option (the default is un-checked) and change the Shutdown Option from its default of ‘Reboot’ to ‘Shutdown’. This procedure assumes that the sysprep process is executed on-premises in the Guest OS of a VM.
> If you want to perform the procedure with a VM already running in Azure, the sequence as described here is a better one: <http://www.codeisahighway.com/how-to-capture-your-own-custom-virtual-machine-image-under-azure-resource-manager-api/>
> 
> ![Linux][Logo_Linux] Linux
>
> [How to capture a Linux virtual machine to use as a Resource Manager template][virtual-machines-linux-capture-image-resource-manager]

___

### Transferring VMs and VHDs between on-premises to Azure
Since uploading VM images and disks to Azure is not possible via the Azure Portal, you need to use Azure PowerShell cmdlets or CLI. Another possibility is the use of the tool ‘AzCopy’. The tool can copy VHDs between on-premises and Azure (in both directions). It also can copy VHDs between Azure Regions. Please consult [this documentation][storage-use-azcopy] for download and usage of AzCopy.

A third alternative would be to use various third party GUI oriented tools. However, please make sure that these tools are supporting Azure Page Blobs. For our purposes we need to use Azure Page Blob store (the differences are described here: <https://msdn.microsoft.com/library/windowsazure/ee691964.aspx>). Also the tools provided by Azure are very efficient in compressing the VMs and VHDs which need to be uploaded. This is important because this efficiency in compression reduces the upload time (which varies anyway depending on the upload link to the internet from the on-premises facility and the Azure deployment region targeted). It is a fair assumption that uploading a VM or VHD from European location to the U.S. based Azure data centers will take longer than uploading the same VMs/VHDs to the European Azure data centers. 

#### <a name="a43e40e6-1acc-4633-9816-8f095d5a7b6a"></a>Uploading a VHD from on-premises to Azure
To upload an existing VM or VHD from the on-premises network such a VM or VHD needs to meet the requirements as listed in chapter [Preparation for moving a VM from on-premises to Azure with a non-generalized disk][planning-guide-5.2.1] of this document.

Such a VM does NOT need to be generalized and can be uploaded in the state and shape it has after shutdown on the on-premises side. The same is true for additional VHDs which don’t contain any operating system. 

##### Uploading a VHD and making it an Azure Disk
In this case we want to upload a VHD, either with or without an OS in it, and mount it to a VM as a data disk or use it as OS disk. This is a multi-step process 

__Powershell__

* Login to your subscription with _Login-AzureRmAccount_
* Set the subscription of your context with _Set-AzureRmContext_ and parameter SubscriptionId or SubscriptionName - see <https://msdn.microsoft.com/library/mt619263.aspx>
* Upload the VHD with _Add-AzureRmVhd_ to an Azure Storage Account - see <https://msdn.microsoft.com/library/mt603554.aspx>
* Set the OS disk of a new VM config to the VHD with _Set-AzureRmVMOSDisk_ - see <https://msdn.microsoft.com/library/mt603746.aspx>
* Create a new VM from the VM config with _New-AzureRmVM_ - see <https://msdn.microsoft.com/library/mt603754.aspx>
* Add a data disk to a new VM with _Add-AzureRmVMDataDisk_ - see <https://msdn.microsoft.com/library/mt603673.aspx>

__Azure CLI__

* Switch to Azure Resource Manager mode with _azure config mode arm_
* Login to your subscription with _azure login_
* Select your subscription with _azure account set `<subscription name or id`>_
* Upload the VHD with _azure storage blob upload_ - see [Using the Azure CLI with Azure Storage][storage-azure-cli]
* Create a new VM specifying the uploaded VHD as OS disk with _azure vm create_ and parameter -d
* Add a data disk to a new VM with _vm disk attach-new_

__Template__

* Upload the VHD with Powershell or Azure CLI
* Deploy the VM with a JSON template referencing the VHD as shown in [this example JSON template](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-vm-from-specialized-vhd/azuredeploy.json).

#### Deployment of a VM Image
To upload an existing VM or VHD from the on-premises network in order to use it as an Azure VM image such a VM or VHD need to meet the requirements listed in chapter [Preparation for deploying a VM with a customer specific image for SAP][planning-guide-5.2.2] of this document.

* Use _sysprep_ on Windows or _waagent -deprovision_ on Linux to generalize your VM - see [Sysprep Technical Reference](https://technet.microsoft.com/library/cc766049.aspx) for Windows or [How to capture a Linux virtual machine to use as a Resource Manager template][virtual-machines-linux-capture-image-resource-manager-capture] for Linux
* Login to your subscription with _Login-AzureRmAccount_
* Set the subscription of your context with _Set-AzureRmContext_ and parameter SubscriptionId or SubscriptionName - see <https://msdn.microsoft.com/library/mt619263.aspx>
* Upload the VHD with _Add-AzureRmVhd_ to an Azure Storage Account - see <https://msdn.microsoft.com/library/mt603554.aspx>
* Set the OS disk of a new VM config to the VHD with _Set-AzureRmVMOSDisk -SourceImageUri -CreateOption fromImage_ - see <https://msdn.microsoft.com/library/mt603746.aspx>
* Create a new VM from the VM config with _New-AzureRmVM_ - see <https://msdn.microsoft.com/library/mt603754.aspx>

__Azure CLI__

* Use _sysprep_ on Windows or _waagent -deprovision_ on Linux to generalize your VM - see [Sysprep Technical Reference](https://technet.microsoft.com/library/cc766049.aspx) for Windows or [How to capture a Linux virtual machine to use as a Resource Manager template][virtual-machines-linux-capture-image-resource-manager-capture] for Linux
* Switch to Azure Resource Manager mode with _azure config mode arm_
* Login to your subscription with _azure login_
* Select your subscription with _azure account set `<subscription name or id`>_
* Upload the VHD with _azure storage blob upload_ - see [Using the Azure CLI with Azure Storage][storage-azure-cli]
* Create a new VM specifying the uploaded VHD as OS disk with _azure vm create_ and parameter -Q

__Template__

* Use _sysprep_ on Windows or _waagent -deprovision_ on Linux to generalize your VM - see [Sysprep Technical Reference](https://technet.microsoft.com/library/cc766049.aspx) for Windows or [How to capture a Linux virtual machine to use as a Resource Manager template][virtual-machines-linux-capture-image-resource-manager-capture] for Linux
* Upload the VHD with Powershell or Azure CLI
* Deploy the VM with a JSON template referencing the image VHD as shown in [this example JSON template](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-vm-from-user-image/azuredeploy.json).

#### Downloading VHDs to on-premises
Azure Infrastructure as a Service is not a one-way street of only being able to upload VHDs and SAP systems. You can move SAP systems from Azure back into the on-premises world as well.

During the time of the download the VHDs can’t be active. Even when downloading VHDs which are mounted to VMs, the VM needs to be shutdown. If you only want to download the database content which then should be used to set up a new system on-premises and if it is acceptable that during the time of the download and the setup of the new system that the system in Azure can still be operational, you could avoid a long downtime by performing a compressed database backup into a VHD and just download that VHD instead of also downloading the OS base VM.

#### Powershell

Once the SAP system is stopped and the VM is shutdown, you can use the PowerShell cmdlet Save-AzureRmVhd on the on-premises target to download the VHD disks back to the on-premises world. In order to do that, you need the URL of the VHD which you can find in the ‘Storage Section’ of the Azure Portal (need to navigate to the Storage Account and the storage container where the VHD was created) and you need to know where the VHD should be copied to.

Then you can leverage the command by simply defining the parameter SourceUri as the URL of the VHD to download and the LocalFilePath as the physical location of the VHD (including its name). The command could look like:

```powerhell
Save-AzureRmVhd -ResourceGroupName <resource group name of storage account> -SourceUri http://<storage account name>.blob.core.windows.net/<container name>/sapidedata.vhd -LocalFilePath E:\Azure_downloads\sapidesdata.vhd
```

For more details of the Save-AzureRmVhd cmdlet, please check here <https://msdn.microsoft.com/library/mt622705.aspx>. 

#### CLI

Once the SAP system is stopped and the VM is shutdown, you can use the Azure CLI command azure storage blob download on the on-premises target to download the VHD disks back to the on-premises world. In order to do that, you need the name and the container of the VHD which you can find in the ‘Storage Section’ of the Azure Portal (need to navigate to the Storage Account and the storage container where the VHD was created) and you need to know where the VHD should be copied to.

Then you can leverage the command by simply defining the parameters blob and container of the VHD to download and the destination as the physical target location of the VHD (including its name). The command could look like:

```
azure storage blob download --blob <name of the VHD to download> --container <container of the VHD to download> --account-name <storage account name of the VHD to download> --account-key <storage account key> --destination <destination of the VHD to download> 
```

### Transferring VMs and VHDs within Azure

#### Copying SAP systems within Azure

A SAP system or even a dedicated DBMS server supporting a SAP application layer will likely consist of several VHDs which contain either the OS with the binaries or the data and log file(s) of the SAP database. Neither the Azure functionality of copying VHDs nor the Azure functionality of saving VHDs to disk has a synchronization mechanism which would snapshot multiple VHDs synchronously. Therefore, the state of the copied or saved VHDs even if those are mounted against the same VM would be different. This means that in the concrete case of having different data and logfile(s) contained in the different VHDs, the database in the end would be inconsistent. 

**Conclusion: In order to copy or save VHDs which are part of an SAP system configuration you need to stop the SAP system and also need to shut down the deployed VM. Only then can you copy or download the set of VHDs to either create a copy of the SAP system in Azure or on-premises.**

Data disks are stored as VHD files in an Azure Storage Account and can be directly attach to a virtual machine or be used as an image. In this case, the VHD is copied to another location before beeing attached to the virtual machine. The full name of the VHD file in Azure must be unique within Azure. As mentioned earlier already, the name is kind of a three-part name that looks like: 

	http(s)://<storage account name>.blob.core.windows.net/<container name>/<vhd name>

##### Powershell
You can use Azure PowerShell cmdlets to copy a VHD as shown in [this article][storage-powershell-guide-full-copy-vhd].

##### CLI
You can use Azure CLI to copy a VHD as shown in [this article][storage-azure-cli-copy-blobs]

##### Azure Storage tools

* <http://azurestorageexplorer.codeplex.com/downloads/get/391105>

There also are professional editions of Azure Storage Explorers which can be found here:

* <http://www.cerebrata.com/>
* <http://clumsyleaf.com/products/cloudxplorer> 


The copy of a VHD itself within a storage account is a process which takes only a few seconds (similar to SAN hardware creating snapshots with lazy copy and 
copy on write). After you have a copy of the VHD file you can attach it to a virtual machine or use it as an image to attach copies of the VHD to virtual machines.

##### Powershell

```powershell
# attach a vhd to a vm
$vm = Get-AzureRmVM -ResourceGroupName <resource group name> -Name <vm name>
$vm = Add-AzureRmVMDataDisk -VM $vm -Name newdatadisk -VhdUri <path to vhd> -Caching <caching option> -DiskSizeInGB $null -Lun <lun e.g. 0> -CreateOption attach
$vm | Update-AzureRmVM

# attach a copy of the vhd to a vm
$vm = Get-AzureRmVM -ResourceGroupName <resource group name> -Name <vm name>
$vm = Add-AzureRmVMDataDisk -VM $vm -Name newdatadisk -VhdUri <new path of vhd> -SourceImageUri <path to image vhd> -Caching <caching option> -DiskSizeInGB $null -Lun <lun e.g. 0> -CreateOption fromImage
$vm | Update-AzureRmVM
```
##### CLI
```
azure config mode arm 

# attach a vhd to a vm
azure vm disk attach <resource group name> <vm name> <path to vhd>

# attach a copy of the vhd to a vm
# this scenario is currently not possible with Azure CLI. A workaround is to manually copy the vhd to the destination.
```

#### <a name="9789b076-2011-4afa-b2fe-b07a8aba58a1"></a>Copying disks between Azure Storage Accounts
This task cannot be performed on the Azure Portal. You can ise Azure PowerShell cmdlets, Azure CLI or a third party storage browser. The PowerShell cmdlets or CLI commands can create and manage blobs, which include the ability to asynchronously copy blobs across Storage Accounts and across regions within the Azure subscription.

##### Powershell 

Copying VHDs between subscriptions is also possible. An example of a script doing so can be downloaded or reviewed here <http://gallery.technet.microsoft.com/scriptcenter/Copy-all-VHDs-in-Blog-829f316e>. 

The basic flow of the PS cmdlet logic looks like this:

* Create a storage account context for the source storage account with _New-AzureStorageContext_ - see <https://msdn.microsoft.com/library/dn806380.aspx>
* Create a storage account context for the target storage account with _New-AzureStorageContext_ - see <https://msdn.microsoft.com/library/dn806380.aspx>
* Start the copy with

```powershell
Start-AzureStorageBlobCopy -SrcBlob <source blob name> -SrcContainer <source container name> -SrcContext <variable containing context of source storage account> -DestBlob <target blob name> -DestContainer <target container name> -DestContext <variable containing context of target storage account>
```

* Check the status of the copy in a loop with
 
```powershell
Get-AzureStorageBlobCopyState -Blob <target blob name> -Container <target container name> -Context <variable containing context of target storage account>
```

* Attach the new VHD to a virtual machine as described above.

For examples see [this article][storage-powershell-guide-full-copy-vhd]

##### CLI
* Start the copy with

```
  azure storage blob copy start --source-blob <source blob name> --source-container <source container name> --account-name <source storage account name> --account-key <source storage account key> --dest-container <target container name> --dest-blob <target blob name> --dest-account-name <target storage account name> --dest-account-key <target storage account name>
```

* Check the status if the copy in a loop with

```
azure storage blob copy show --blob <target blob name> --container <target container name> --account-name <target storage account name> --account-key <target storage account name>
```
  
* Attach the new VHD to a virtual machine as described above.

For examples see [this article][storage-azure-cli-copy-blobs]

### Disk Handling
#### <a name="4efec401-91e0-40c0-8e64-f2dceadff646"></a>VM/VHD structure for SAP deployments
Ideally the handling of the structure of a VM and the associated VHDs should be very simple. In on-premises installations, customers developed many ways of structuring a server installation. 

* One base VHD which contains the OS and all the binaries of the DBMS and/or SAP. Since March 2015, this VHD can be up to 1TB in size instead of earlier restrictions that limited it to 127GB. 
* One or multiple VHDs which contains the DBMS log file of the SAP database and the log file of the DBMS temp storage area (if the DBMS supports this). If the database log IOPS requirements are high, you need to stripe multiple VHDs in order to reach the IOPS volume required. 
* A number of VHDs containing one or two database files of the SAP database and the DBMS temp data files as well (if the DBMS supports this).

![Reference Configuration of Azure IaaS VM for SAP][planning-guide-figure-1300]

[comment]: <> (MShermannd  TODO describe Linux structure  )

___

> ![Windows][Logo_Windows] Windows
>
> With many customers we saw configurations where, for example, SAP and DBMS binaries were not installed on the c:\ drive where the OS was installed. There were various reasons 
> for this, but when we went back to the root, it usually was that the drives were small and OS upgrades needed additional space 10-15 years ago. Both conditions do not apply these
> days too often anymore. Today the c:\ drive can be mapped on large volume disks or VMs. In order to keep deployments simple in their structure, it is recommended to follow the
> following deployment pattern for SAP NetWeaver systems in Azure
>
> The Windows operating system pagefile should be on the D: drive (non-persistent disk) 
> 
> ![Linux][Logo_Linux] Linux
>
> Place the Linux swapfile under /mnt /mnt/resource on Linux as described in [this article][virtual-machines-linux-agent-user-guide]. The swap file can be configured in the configuration file of the Linux Agent /etc/waagent.conf. Add or change the following settings:

```
ResourceDisk.EnableSwap=y
ResourceDisk.SwapSizeMB=30720
```

To activate the changes, you need to restart the Linux Agent with

```
sudo service waagent restart
```

Please read SAP Note [1597355] for more details on the recommended swap file size

___

The number of VHDs used for the DBMS data files and the type of Azure Storage these VHDs are hosted on should be determined by the IOPS requirements and the latency required. Exact quotas are described in [this article][virtual-machines-sizes]

Experience of SAP deployments over the last 2 years taught us some lessons which can be summarized as:

* IOPS traffic to different data files is not always the same since existing customer systems might have differently sized data files representing their SAP database(s). As a result it turned out to be better using a RAID configuration over multiple VHDs to place the data files LUNs carved out of those. There were situations, especially with Azure Standard Storage where an IOPS rate hit the quota of a single VHD against the DBMS transaction log. In such scenarios the use of Premium Storage is recommended or alternatively aggregating multiple Standard Storage VHDs with a software RAID.

___

> ![Windows][Logo_Windows] Windows
>
> * [Performance best practices for SQL Server in Azure Virtual Machines][virtual-machines-sql-server-performance-best-practices]
> 
> ![Linux][Logo_Linux] Linux
>
> * [Configure Software RAID on Linux][virtual-machines-linux-configure-raid]
> * [Azure Storage secrets and Linux I/O optimizations](http://blogs.msdn.com/b/igorpag/archive/2014/10/23/azure-storage-secrets-and-linux-i-o-optimizations.aspx)

___

* Premium Storage is showing significant better performance, especially for critical transaction log writes. For SAP scenarios that are expected to deliver production like performance, it is highly recommended to use VM-Series that can leverage Azure Premium Storage.

Keep in mind that the VHD which contains the OS, and as we recommend, the binaries of SAP and the database (base VM) as well, is not anymore limited to 127GB. It now can have 
up to 1TB in size. This should be enough space to keep all the necessary file including e.g. SAP batch job logs.

For more suggestions and more details, specifically for DBMS VMs, please consult the [DBMS Deployment Guide][dbms-guide]


#### Disk Handling
In most scenarios you need to create additional disks in order to deploy the SAP database into the VM. We talked about the considerations on number of VHDs in chapter [VM/VHD structure for SAP deployments][planning-guide-5.5.1] of this document. The Azure Portal allows to attach and detach disks once a base VM is deployed. The disks can be attached/detached when the VM is up and running as well as when it is stopped. When attaching a disk, the Azure Portal offers to attach an empty disk or an existing disk which at this point in time is not attached to another VM. 

**Note**: VHDs can only be attached to one VM at any given time.
 
![Attach / detach disks with Azure Standard Storage][planning-guide-figure-1400]

You need to decide whether you want to create a new and empty VHD (which would be created in the same Storage Account as the base VM is in) or whether you want to select an existing VHD that was uploaded earlier and should be attached to the VM now. 

**IMPORTANT**: You **DO NOT** want to use Host Caching with Azure Standard Storage. You should leave the Host Cache preference at the default of NONE. With Azure Premium Storage you should enable Read Caching if the I/O characteristic is mostly read like typical I/O traffic against database data files. In case of database transaction log file no caching is recommended.

___

> ![Windows][Logo_Windows] Windows
>
> [How to attach a data disk in the Azure portal][virtual-machines-linux-attach-disk-portal]
>
> If disks are attached, you need to log in into the VM to open the Windows Disk Manager. If automount is not enabled as recommended in chapter [Setting automount for attached disks][planning-guide-5.5.3], the newly attached volume needs to be taken online and initialized.
>
> ![Linux][Logo_Linux] Linux
>
> If disks are attached, you need to log in into the VM and initialize the disks as described in [this article][virtual-machines-linux-how-to-attach-disk-how-to-initialize-a-new-data-disk-in-linux]

___

If the new disk is an empty disk, you need to format the disk as well. For formatting, especially for DBMS data and log files the same recommendations as for bare-metal deployments of the DBMS apply.

As already mentioned in chapter [The Microsoft Azure Virtual Machine Concept][planning-guide-3.2], an Azure Storage account does not provide infinite resources in terms of I/O volume, IOPS and data volume. Usually DBMS VMs are most affected by this. It might be best to use a separate Storage Account for each VM if you have few high I/O volume VMs to deploy in order to stay within the limit of the Azure Storage Account volume. Otherwise, you need to see how you can balance these VMs between different Storage accounts without hitting the limit of each single Storage Account. More details are discussed in the [DBMS Deployment Guide][dbms-guide]. You should also keep these limitations in mind for pure SAP application server VMs or other VMs which eventually might require additional VHDs.

Another topic which is relevant for Storage Accounts is whether the VHDs in a Storage Account are getting Geo-replicated. Geo-replication is enabled or disabled on the Storage Account level and not on the VM level. If geo-replication is enabled, the VHDs within the Storage Account would be replicated into another Azure data center within the same region. Before deciding on this, you should think about the following restriction:

Azure Geo-replication works locally on each VHD in a VM and does not replicate the IOs in chronological order across multiple VHDs in a VM. Therefore, the VHD that represents the base VM as well as any additional VHDs attached to the VM are replicated independent of each other. This means there is no synchronization between the changes in the different VHDs. The fact that the IOs are replicated independently of the order in which they are written means that geo-replication is not of value for database servers that have their databases distributed over multiple VHDs. In addition to the DBMS, there also might be other applications where processes write or manipulate data in different VHDs and where it is important to keep the order of changes. If that is a requirement, geo-replication in Azure should not be enabled. Dependent on whether you need or want geo-replication for a set of VMs, but not for another set, you can already categorize VMs and their related VHDs into different Storage Accounts that have geo-replication enabled or disabled.

#### <a name="17e0d543-7e8c-4160-a7da-dd7117a1ad9d"></a>Setting automount for attached disks

___


> ![Windows][Logo_Windows] Windows
> 
> For VMs which are created from own Images or Disks, it is necessary to check and possibly set the automount parameter. Setting this parameter will allow the VM after a restart or redeployment in Azure to mount the attached/mounted drives again automatically. 
> The parameter is set for the images provided by Microsoft in the Azure Marketplace.
>
> In order to set the automount, please check the documentation of the command line executable diskpart.exe here: 
> 
> * [DiskPart Command-Line Options](https://technet.microsoft.com/library/cc766465.aspx)
> * [Automount](http://technet.microsoft.com/library/cc753703.aspx)
> 
> The Windows command line window should be opened as administrator.
> 
> If disks are attached, you need to log in into the VM to open the Windows Disk Manager. If automount is not enabled as recommended in chapter [Setting automount for attached disks][planning-guide-5.5.3],  the newly attached volume >needs to be taken online and initialized.
>
> ![Linux][Logo_Linux] Linux
>
> You need to initialize an newly attached empty disk as described in [this article][virtual-machines-linux-how-to-attach-disk-how-to-initialize-a-new-data-disk-in-linux].
> You also need to add new disks to the /etc/fstab.

___


### Final Deployment
For the final Deployment and exact steps, especially with regards to the deployment of SAP Extended Monitoring, please refer to the [Deployment Guide][deployment-guide].

## Accessing SAP systems running within Azure VMs
For Cloud-Only scenarios, you might want to connect to those SAP systems across the public internet using SAP GUI. For these cases, the following procedures need to be applied.

Later in the document we will discuss the other major scenario, connecting to SAP systems in Cross-Premises deployments which have a site-to-site connection (VPN tunnel) or Azure ExpressRoute connection between the on-premises systems and Azure systems.


### Remote Access to SAP systems

With Azure Resource Manager there are no default endpoints anymore like in the former classic model. All ports of an Azure ARM VM are open as long as:

1. No Network Security Group is defined for the subnet or the network interface. Network traffic to Azure VMs can be secured via so-called "Network Security Groups". For more information see [What is a Network Security Group (NSG)?][virtual-networks-nsg]
1. No Azure Load Balancer is defined for the network interface   
 
See the architecture difference between classic model and ARM as described in [this article][virtual-machines-azure-resource-manager-architecture].
 
#### Configuration of the SAP System and SAP GUI connectivity for Cloud-Only scenario
Please see this article which describes details to this topic: 
<http://blogs.msdn.com/b/saponsqlserver/archive/2014/06/24/sap-gui-connection-closed-when-connecting-to-sap-system-in-azure.aspx> 

#### Changing Firewall Settings within VM
It might be neccessary to configure the firewall on your virtual machines to allow inbound traffic to your SAP system. 

___

> ![Windows][Logo_Windows] Windows
>
> By default, the Windows Firewall within an Azure deployed VM is turned on. You now need to allow the SAP Port to be opened, otherwise the SAP GUI will not be able to connect.
> To do this:
>
>  * Open Control Panel\System and Security\Windows Firewall to ‘Advanced Settings’.
>  * Now right-click on Inbound Rules and chose ‘New Rule’.
>  * In the following Wizard chose to create a new ‘Port’ rule.
>  * In the next step of the wizard, leave the setting at TCP and type in the port number you want to open. Since our SAP instance ID is 00, we took 3200. If your instance has a different instance number, the port you defined earlier based on the instance number should be opened.
>  * In the next part of the wizard, you need to leave the item ‘Allow Connection’ checked.
>  * In the next step of the wizard you need to define whether the rule applies for Domain, Private and Public network. Please adjust it if necessary to your needs. However, connecting with SAP GUI from the outside through the public network, you need to have the rule applied to the public network.
>  * In the last step of the wizard, you need to give the rule a name and then save the rule by pressing ‘Finish’
>
>  The rule becomes effective immediately.
>
> ![Port rule definition][planning-guide-figure-1600]
>
> ![Linux][Logo_Linux] Linux
>
> The Linux images in the Azure Marketplace do not enable the iptables firewall by default and the connection to your SAP system should work. If you enabled iptables or another firewall, please refer to the documentation of iptables or the used firewall to allow inbound tcp traffic to  port 32xx (where xx is the system number of your SAP system). 

___

#### Security recommendations

The SAP GUI does not connect immediately to any of the SAP instances (port 32xx) which are running, but first connects via the port opened to the SAP message server 
process (port 36xx). In the past the very same port was used by the message server for the internal communication to the application instances. To prevent on-premises 
application servers from inadvertently communicating with a message server in Azure the internal communication ports can be changed. It is highly recommended to change 
the internal communication between the SAP message server and its application instances to a different port number on systems that have been cloned from on-premises 
systems, such as a clone of development for project testing etc. This can be done with the default profile parameter:

>	rdisp/msserv_internal

as documented in: <https://help.sap.com/saphelp_nwpi71/helpdata/en/47/c56a6938fb2d65e10000000a42189c/content.htm> 

## <a name="96a77628-a05e-475d-9df3-fb82217e8f14"></a>Concepts of Cloud-Only deployment of SAP instances

### <a name="3e9c3690-da67-421a-bc3f-12c520d99a30"></a>Single VM with SAP NetWeaver demo/training scenario
 
![Running single VM SAP Demo systems with the same VM names, isolated in Azure Cloud Services][planning-guide-figure-1700]

In this scenario (see chapter [Cloud-Only][planning-guide-2.1] of this document) we are implementing a typical training/demo system scenario where the complete training/demo scenario is contained within a single VM. We assume that the deployment is done through VM image templates. We also assume that multiple of these demo/trainings VMs need to be deployed with the VMs having the same name.

The assumption is that you created a VM Image as described in some sections of chapter [Preparing VMs with SAP for Azure][planning-guide-5.2] in this document.

The sequence of events to implement the scenario looks like this:

[comment]: <> (MShermannd  TODO have to provide ARM sample / description using json template + clarification regarding unique VM name within ARM virtual network  )   
##### Powershell

* Create a new resoure group for every training/demo landscape

```powershell
$rgName = "SAPERPDemo1"
New-AzureRmResourceGroup -Name $rgName -Location "North Europe"
```

* Create a new storage account

```powershell
$suffix = Get-Random -Minimum 100000 -Maximum 999999
$account = New-AzureRmStorageAccount -ResourceGroupName $rgName -Name "saperpdemo$suffix" -SkuName Standard_LRS -Kind "Storage" -Location "North Europe"
```

* Create a new virtual network for every training/demo landscape to enable the usage of the same hostname and IP addresses. The virtual network is protected by a Network Security Group that only allows traffic to port 3389 to enable Remote Desktop access and port 22 for SSH. 

```powershell
# Create a new Virtual Network
$rdpRule = New-AzureRmNetworkSecurityRuleConfig -Name SAPERPDemoNSGRDP -Protocol * -SourcePortRange * -DestinationPortRange 3389 -Access Allow -Direction Inbound -SourceAddressPrefix * -DestinationAddressPrefix * -Priority 100
$sshRule = New-AzureRmNetworkSecurityRuleConfig -Name SAPERPDemoNSGSSH -Protocol * -SourcePortRange * -DestinationPortRange 22 -Access Allow -Direction Inbound -SourceAddressPrefix * -DestinationAddressPrefix * -Priority 101
$nsg = New-AzureRmNetworkSecurityGroup -Name SAPERPDemoNSG -ResourceGroupName $rgName -Location  "North Europe" -SecurityRules $rdpRule,$sshRule

$subnetConfig = New-AzureRmVirtualNetworkSubnetConfig -Name Subnet1 -AddressPrefix  10.0.1.0/24 -NetworkSecurityGroup $nsg
$vnet = New-AzureRmVirtualNetwork -Name SAPERPDemoVNet -ResourceGroupName $rgName -Location "North Europe"  -AddressPrefix 10.0.1.0/24 -Subnet $subnetConfig
```

* Create a new public IP address that can be used to access the virtual machine from the internet

```powershell
# Create a public IP address with a DNS name
$pip = New-AzureRmPublicIpAddress -Name SAPERPDemoPIP -ResourceGroupName $rgName -Location "North Europe" -DomainNameLabel $rgName.ToLower() -AllocationMethod Dynamic
```

* Create a new network interface for the virtual machine

```powershell 
# Create a new Network Interface
$nic = New-AzureRmNetworkInterface -Name SAPERPDemoNIC -ResourceGroupName $rgName -Location "North Europe" -Subnet $vnet.Subnets[0] -PublicIpAddress $pip 
```

* Create a virtual machine. For the Cloud-Only scenario every VM will have the same name. The SAP SID of the SAP NetWeaver instances in those VMs will be the same as well. Within the Azure Resource Group, the name of the VM needs to be unique, but in different Azure Resource Groups you can run VMs with the same name. The default 'Administrator' account of Windows or 'root' for Linux are not valid. Therefore, a new administrator user name needs to be defined together with a password. The size of the VM also needs to be defined.

```powershell
#####
# Create a new virtual machine with an official image from the Azure Marketplace
#####
$cred=Get-Credential -Message "Type the name and password of the local administrator account."
$vmconfig = New-AzureRmVMConfig -VMName SAPERPDemo -VMSize Standard_D11

# select image
$vmconfig = Set-AzureRmVMSourceImage -VM $vmconfig -PublisherName "MicrosoftWindowsServer" -Offer "WindowsServer" -Skus "2012-R2-Datacenter" -Version "latest"
$vmconfig = Set-AzureRmVMOperatingSystem -VM $vmconfig -Windows -ComputerName "SAPERPDemo" -Credential $cred -ProvisionVMAgent -EnableAutoUpdate
# $vmconfig = Set-AzureRmVMSourceImage -VM $vmconfig -PublisherName "SUSE" -Offer "SLES" -Skus "12" -Version "latest"
# $vmconfig = Set-AzureRmVMSourceImage -VM $vmconfig -PublisherName "RedHat" -Offer "RHEL" -Skus "7.2" -Version "latest"
# $vmconfig = Set-AzureRmVMOperatingSystem -VM $vmconfig -Linux -ComputerName "SAPERPDemo" -Credential $cred

$vmconfig = Add-AzureRmVMNetworkInterface -VM $vmconfig -Id $nic.Id

$diskName="os"
$osDiskUri=$account.PrimaryEndpoints.Blob.ToString() + "vhds/" + $diskName  + ".vhd"
$vmconfig = Set-AzureRmVMOSDisk -VM $vmconfig -Name $diskName -VhdUri $osDiskUri -CreateOption fromImage
$vm = New-AzureRmVM -ResourceGroupName $rgName -Location "North Europe" -VM $vmconfig
```

```powershell
#####
# Create a new virtual machine with a VHD that contains the private image that you want to use
#####
$cred=Get-Credential -Message "Type the name and password of the local administrator account."
$vmconfig = New-AzureRmVMConfig -VMName SAPERPDemo -VMSize Standard_D11

$vmconfig = Add-AzureRmVMNetworkInterface -VM $vmconfig -Id $nic.Id

$diskName="osfromimage"
$osDiskUri=$account.PrimaryEndpoints.Blob.ToString() + "vhds/" + $diskName  + ".vhd"

$vmconfig = Set-AzureRmVMOSDisk -VM $vmconfig -Name $diskName -VhdUri $osDiskUri -CreateOption fromImage -SourceImageUri <path to VHD that contains the OS image> -Windows
$vmconfig = Set-AzureRmVMOperatingSystem -VM $vmconfig -Windows -ComputerName "SAPERPDemo" -Credential $cred
#$vmconfig = Set-AzureRmVMOSDisk -VM $vmconfig -Name $diskName -VhdUri $osDiskUri -CreateOption fromImage -SourceImageUri <path to VHD that contains the OS image> -Linux
#$vmconfig = Set-AzureRmVMOperatingSystem -VM $vmconfig -Linux -ComputerName "SAPERPDemo" -Credential $cred

$vm = New-AzureRmVM -ResourceGroupName $rgName -Location "North Europe" -VM $vmconfig
```

* Optionally add additional disks and restore necessary content. Be aware that all blob names (URLs to the blobs) must be unique within Azure.

```powershell
# Optional: Attach additional data disks
$vm = Get-AzureRmVM -ResourceGroupName $rgName -Name SAPERPDemo
$dataDiskUri = $account.PrimaryEndpoints.Blob.ToString() + "vhds/datadisk.vhd"
Add-AzureRmVMDataDisk -VM $vm -Name datadisk -VhdUri $dataDiskUri -DiskSizeInGB 1023 -CreateOption empty | Update-AzureRmVM
```

##### CLI

The following example code can be used on Linux. For Windows, please either use PowerShell as described above or adapt the example to use %rgName% instead of $rgName and set the environment variable using the Windows command _set_.

* Create a new resoure group for every training/demo landscape

```
rgName=SAPERPDemo1
rgNameLower=saperpdemo1
azure group create $rgName "North Europe"
```

* Create a new storage account

```
azure storage account create --resource-group $rgName --location "North Europe" --kind Storage --sku-name LRS $rgNameLower
```

* Create a new virtual network for every training/demo landscape to enable the usage of the same hostname and IP addresses. The virtual network is protected by a Network Security Group that only allows traffic to port 3389 to enable Remote Desktop access and port 22 for SSH. 

```
azure network nsg create --resource-group $rgName --location "North Europe" --name SAPERPDemoNSG
azure network nsg rule create --resource-group $rgName --nsg-name SAPERPDemoNSG --name SAPERPDemoNSGRDP --protocol \* --source-address-prefix \* --source-port-range \* --destination-address-prefix \* --destination-port-range 3389 --access Allow --priority 100 --direction Inbound
azure network nsg rule create --resource-group $rgName --nsg-name SAPERPDemoNSG --name SAPERPDemoNSGSSH --protocol \* --source-address-prefix \* --source-port-range \* --destination-address-prefix \* --destination-port-range 22 --access Allow --priority 101 --direction Inbound

azure network vnet create --resource-group $rgName --name SAPERPDemoVNet --location "North Europe" --address-prefixes 10.0.1.0/24
azure network vnet subnet create --resource-group $rgName --vnet-name SAPERPDemoVNet --name Subnet1 --address-prefix 10.0.1.0/24 --network-security-group-name SAPERPDemoNSG
```

* Create a new public IP address that can be used to access the virtual machine from the internet

```
azure network public-ip create --resource-group $rgName --name SAPERPDemoPIP --location "North Europe" --domain-name-label $rgNameLower --allocation-method Dynamic
```

* Create a new network interface for the virtual machine

```
azure network nic create --resource-group $rgName --location "North Europe" --name SAPERPDemoNIC --public-ip-name SAPERPDemoPIP --subnet-name Subnet1 --subnet-vnet-name SAPERPDemoVNet 
```

* Create a virtual machine. For the Cloud-Only scenario every VM will have the same name. The SAP SID of the SAP NetWeaver instances in those VMs will be the same as well. Within the Azure Resource Group, the name of the VM needs to be unique, but in different Azure Resource Groups you can run VMs with the same name. The default 'Administrator' account of Windows or 'root' for Linux are not valid. Therefore, a new administrator user name needs to be defined together with a password. The size of the VM also needs to be defined.

```
azure vm create --resource-group $rgName --location "North Europe" --name SAPERPDemo --nic-name SAPERPDemoNIC --image-urn MicrosoftWindowsServer:WindowsServer:2012-R2-Datacenter:latest --os-type Windows --admin-username <username> --admin-password <password> --vm-size Standard_D11 --os-disk-vhd https://$rgNameLower.blob.core.windows.net/vhds/os.vhd --disable-boot-diagnostics
# azure vm create --resource-group $rgName --location "North Europe" --name SAPERPDemo --nic-name SAPERPDemoNIC --image-urn SUSE:SLES:12:latest --os-type Linux --admin-username <username> --admin-password <password> --vm-size Standard_D11 --os-disk-vhd https://$rgNameLower.blob.core.windows.net/vhds/os.vhd --disable-boot-diagnostics
# azure vm create --resource-group $rgName --location "North Europe" --name SAPERPDemo --nic-name SAPERPDemoNIC --image-urn RedHat:RHEL:7.2:latest --os-type Linux --admin-username <username> --admin-password <password> --vm-size Standard_D11 --os-disk-vhd https://$rgNameLower.blob.core.windows.net/vhds/os.vhd --disable-boot-diagnostics
```

```
#####
# Create a new virtual machine with a VHD that contains the private image that you want to use
#####
azure vm create --resource-group $rgName --location "North Europe" --name SAPERPDemo --nic-name SAPERPDemoNIC --os-type Windows --admin-username <username> --admin-password <password> --vm-size Standard_D11 --os-disk-vhd https://$rgNameLower.blob.core.windows.net/vhds/os.vhd -Q <path to image vhd> --disable-boot-diagnostics
#azure vm create --resource-group $rgName --location "North Europe" --name SAPERPDemo --nic-name SAPERPDemoNIC --os-type Linux --admin-username <username> --admin-password <password> --vm-size Standard_D11 --os-disk-vhd https://$rgNameLower.blob.core.windows.net/vhds/os.vhd -Q <path to image vhd> --disable-boot-diagnostics
```

* Optionally add additional disks and restore necessary content. Be aware that all blob names (URLs to the blobs) must be unique within Azure.

```
# Optional: Attach additional data disks
azure vm disk attach-new --resource-group $rgName --vm-name SAPERPDemo --size-in-gb 1023 --vhd-name datadisk
```

##### Template
You can use the sample templates on the azure-quickstart-templates repository on github.

* [Simple Linux VM](https://github.com/Azure/azure-quickstart-templates/tree/master/101-vm-simple-linux)
* [Simple Windows VM](https://github.com/Azure/azure-quickstart-templates/tree/master/101-vm-simple-windows)
* [VM from image](https://github.com/Azure/azure-quickstart-templates/tree/master/101-vm-from-user-image)

### Implement a set of VMs which need to communicate within Azure
This Cloud-Only scenario is a typical scenario for training and demo purposes where the software representing the demo/training scenario is spread over multiple VMs. The different components installed in the different VMs need to communicate with each other. Again, in this scenario no on-premises network communication or Cross-Premises scenario is needed.

This scenario is an extension of the installation described in chapter [Single VM with SAP NetWeaver demo/training scenario][planning-guide-7.1] of this document. In this case more virtual machines will be added to an existing resource group. In the following example the training landscape consists of an SAP ASCS/SCS VM, a VM running a DBMS and an SAP Application Server instance VM.

Before you build this scenario you need to think about basic settings as already exercised in the scenario before.

#### Resource Group and Virtual Machine naming
All resource group names must be unique. Develop your own naming scheme of your resources, such as `<rg-name`>-suffix. 

The virtual machine name has to be unique within the resource group. 

#### Setup Network for communication between the different VMs
 
![Set of VMs within an Azure Virtual Network][planning-guide-figure-1900]

To prevent naming collisions with clones of the same training/demo landscapes, you need to create an Azure Virtual Network for every landscape. DNS name resolution will be provided by Azure or you can configure your own DNS server outside Azure (not to be further discussed here). In this scenario we do not configure our own DNS. For all virtual machines inside one Azure Virtual Network communication via hostnames will be enabled. 

The reasons to separate training or demo landscapes by virtual networks and not only resource groups could be:

* The SAP landscape as set up needs its own AD/OpenLDAP and a Domain Server needs to be part of each of the landscapes.  
* The SAP landscape as set up has components that need to work with fixed IP addresses.

More details about Azure Virtual Networks and how to define them can be found in [this article][virtual-networks-create-vnet-arm-pportal].

## Deploying SAP VMs with Corporate Network Connectivity (Cross-Premises)

You run a SAP landscape and want to divide the deployment between bare-metal for high-end DBMS servers, on-premises virtualized environments for application layers and smaller 2-Tier configured SAP systems and Azure IaaS. The base assumption is that SAP systems within one SAP landscape need to communicate with each other and with many other software components deployed in the company, independent of their deployment form. There also should be no differences introduced by the deployment form for the end user connecting with SAP GUI or other interfaces. These conditions can only be met when we have the on-premises Active Directory/OpenLDAP and DNS services extended to the Azure systems through site-to-site/multi-site connectivity or private connections like Azure ExpressRoute.

In order to get more background on the implementation details of SAP on Azure, we encourage you to read chapter [Concepts of Cloud-Only deployment of SAP instances][planning-guide-7] of this document which explains some of the basics constructs of Azure and how these should be used with SAP applications in Azure.

### Scenario of a SAP landscape

The Cross-Premises scenario can be roughly described like in the graphics below:
 
![Site-to-Site connectivity between on-premises and Azure assets][planning-guide-figure-2100]

The scenario shown above describes a scenario where the on-premises AD/OpenLDAP and DNS is extended to Azure. On the on-premises side, a certain IP address range is reserved per Azure subscription. The IP address range will be assigned to an Azure Virtual Network on the Azure side.

#### Security considerations

The minimum requirement is the use of secure communication protocols such as SSL/TLS for browser access or VPN-based connections for system access to the Azure services. The assumption is that companies handle the VPN connection between their corporate network and Azure very differently. Some companies might blankly open all the ports. Some other companies might want to be very precise in which ports they need to open, etc. 

In the table below typical SAP communication ports are listed. Basically it is sufficient to open the SAP gateway port.

| Service | Port Name | Example `<nn`> = 01 | Default Range (min-max) | Comment |
|---------|-----------|-------------------|-------------------------|---------|
| Dispatcher | sapdp`<nn>` see * | 3201 | 3200 – 3299 | SAP Dispatcher, used by SAP GUI for Windows and Java |
| Message server | sapms`<sid`> see ** | 3600 | free sapms`<anySID`> | sid = SAP-System-ID |
| Gateway | sapgw`<nn`> see * | 3301 | free | SAP gateway, used for CPIC and RFC communication |
| SAP router | sapdp99 | 3299 | free | Only CI (central instance) Service names can be reassigned in /etc/services to an arbitrary value after installation. |

*) nn = SAP Instance Number

**) sid = SAP-System-ID

More detailed information on ports required for different SAP products or services by SAP products can be found here 
<http://scn.sap.com/docs/DOC-17124>. 
With this document you should be able to open dedicated ports in the VPN device necessary for specific SAP products and scenarios.

Other security measures when deploying VMs in such a scenario could be to create a [Network Security Group][virtual-networks-nsg] to define access rules.

### Dealing with different Virtual Machine Series

In the course of last 12 months Microsoft added many more VM types that differ either in number of vCPUs, memory or more important on hardware it is running on. Not all those VMs are supported with SAP (see supported VM types in SAP Note [1928533]). Some of those VMs run on different host hardware generations. These host hardware generations are getting deployed in the granularity of an Azure Scale-Unit. Means cases may arise where the different VM sizes you chose can’t be run on the same Scale-Unit. An Availability Set is limited in the ability to span Scale-Units based of different hardware.  E.g. if you want to run the DBMS on A5-A11 VMs and the SAP application layer on G-Series VMs, you would be forced to deploy a single SAP system or different SAP systems within different Availability Sets.


#### Printing on a local network printer from SAP instance in Azure
##### Printing over TCP/IP in Cross-Premises scenario


Setting up your on-premises TCP/IP based network printers in an Azure VM is overall the same as in your corporate network, assuming you do have a VPN Site-To-Site tunnel or ExpressRoute connection established. 

___

> ![Windows][Logo_Windows] Windows
>
> To do this:
> - Some network printers come with a configuration wizard which makes it easy to set up your printer in an Azure VM. If no wizard software has been distributed with the 
>   printer the “manual” way to set up the printer is to create a new TCP/IP printer port.
> - Open Control Panel -> Devices and Printers -> Add a printer 
> - Choose Add a printer using a TCP/IP address or hostname
> - Type in the IP address of the printer
> - Printer Port standard 9100
> - If necessary install the appropriate printer driver manually. 
> 
> ![Linux][Logo_Linux] Linux
>
> - like for Windows just follow the standard procedure to install a network printer
> - just follow the public Linux guides for [SUSE](https://www.suse.com/documentation/sles-12/book_sle_deployment/data/sec_y2_hw_print.html) or [Red Hat](https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/6/html/Deployment_Guide/sec-Printer_Configuration.html) on how to add a printer.

___

 
![Network printing][planning-guide-figure-2200]



##### Host-based printer over SMB (shared printer) in Cross-Premises scenario

Host-based printers are not network-compatible by design. But a host-based printer can be shared among computers on a network as long as the printer is connected to a powered-on computer. Connect your corporate network either Site-To-Site or ExpressRoute and share your local printer. The SMB protocol uses NetBIOS instead of DNS as name service. The NetBIOS host name can be different from the DNS host name. The standard case is that the NetBIOS host name and the DNS host name are identical. The DNS domain does not make sense in the NetBIOS name space. Accordingly, the fully qualified DNS host name consisting of the DNS host name and DNS domain must not be used in the NetBIOS name space.

The printer share is identified by a unique name in the network:

* Host name of the SMB host (always needed). 
* Name of the share (always needed). 
* Name of the domain if printer share is not in the same domain as SAP system. 
* Additionally, a user name and a password may be required to access the printer share.

How to:

___

> ![Windows][Logo_Windows] Windows
>
> Share your local printer.
> In the Azure VM open the Windows Explorer and type in the share name of the printer.
> A printer installation wizard will guide you through the installation process.
>
> ![Linux][Logo_Linux] Linux
>
> Here are some examples of documentation about configuring network printers in Linux or including
> a chapter regarding printing in Linux. It will work the same way in an Azure Linux VM as long as
> the VM is part of a VPN :
>
> * SLES <https://en.opensuse.org/SDB:Printing_via_SMB_(Samba)_Share_or_Windows_Share>
> * RHEL <https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/6/html/Deployment_Guide/s1-printing-smb-printer.html>

___


##### USB Printer (printer forwarding) 

In Azure the ability of the Remote Desktop Services to provide users the access to their local printer devices in a remote session is not available.

___

> ![Windows][Logo_Windows] Windows
>
> More details on printing with Windows can be found here: <http://technet.microsoft.com/library/jj590748.aspx>.

___

 
#### Integration of SAP Azure Systems into Correction and Transport System (TMS) in Cross-Premises

The SAP Change and Transport System (TMS) needs to be configured to export and import transport request across systems in the landscape. We assume that the development instances of an SAP system (DEV) are located in Azure whereas the quality assurance (QA) and productive systems (PRD) are on-premises. Furthermore, we assume that there is a central transport directory.

##### Configuring the Transport Domain
Configure your Transport Domain on the system you designated as the Transport Domain Controller as described in [Configuring the Transport Domain Controller](http://help.sap.com/erp2005_ehp_04/helpdata/en/44/b4a0b47acc11d1899e0000e829fbbd/content.htm). A system user TMSADM will be created and the required RFC destination will be generated. You may check these RFC connections using the transaction SM59. Hostname resolution must be enabled across your transport domain. 

How to:

* In our scenario we decided the on-premises QAS system will be the CTS domain controller. Call transaction STMS. The TMS dialog box appears. A Configure Transport Domain dialog box is displayed. (This dialog box only appears if you have not yet configured a transport domain.)
* Make sure that the automatically created user TMSADM is authorized (SM59 -> ABAP Connection -> TMSADM@E61.DOMAIN_E61 -> Details -> Utilities(M) -> Authorization Test). The initial screen of transaction STMS should show that this SAP System is now functioning as the controller of the transport domain as shown here:
 
![Initial screen of transaction STMS on the domain controller][planning-guide-figure-2300]

#### Including SAP Systems in the Transport Domain

The sequence of including an SAP system in a transport domain looks as follows:

* On the DEV system in Azure go to the transport system (Client 000) and call transaction STMS. Choose Other Configuration from the dialog box and continue with Include System in Domain. Specify the Domain Controller as target host ([Including SAP Systems in the Transport Domain](http://help.sap.com/erp2005_ehp_04/helpdata/en/44/b4a0c17acc11d1899e0000e829fbbd/content.htm?frameset=/en/44/b4a0b47acc11d1899e0000e829fbbd/frameset.htm)). The system is now waiting to be included in the transport domain.
* For security reasons, you then have to go back to the domain controller to confirm your request. Choose System Overview and Approve of the waiting system. Then confirm the prompt and the configuration will be distributed.

This SAP system now contains the necessary information about all the other SAP systems in the transport domain. At the same time, the address data of the new SAP system is sent to all the other SAP systems, and the SAP system is entered in the transport profile of the transport control program. Check whether RFCs and access to the transport directory of the domain work.

Continue with the configuration of your transport system as usual as described in the documentation [Change and Transport System](http://help.sap.com/saphelp_nw70ehp3/helpdata/en/48/c4300fca5d581ce10000000a42189c/content.htm?frameset=/en/44/b4a0b47acc11d1899e0000e829fbbd/frameset.htm).

How to:

* Make sure your STMS on premises is configured correctly.
* Make sure the hostname of the Transport Domain Controller can be resolved by your virtual machine on Azure and vice visa.
* Call transaction STMS -> Other Configuration -> Include System in Domain.
* Confirm the connection in the on premises TMS system.
* Configure transport routes, groups and layers as usual.

In site-to-site connected Cross-Premises scenarios, the latency between on-premises and Azure still can be substantial. If we follow the sequence of transporting objects through development and test systems to production or think about applying transports or support packages to the different systems, you realize that, dependent on the location of the central transport directory, some of the systems will encounter high latency reading or writing data in the central transport directory. The situation is similar to SAP landscape configurations where the different systems are spread through different data centers with substantial distance between the data centers.

In order to work around such latency and have the systems work fast in reading or writing to or from the transport directory, you can setup two STMS transport domains (one for on-premises and one with the systems in Azure and link the transport domains. Please check this documentation which explains the principles behind this concept in the SAP TMS:
<http://help.sap.com/saphelp_me60/helpdata/en/c4/6045377b52253de10000009b38f889/content.htm?frameset=/en/57/38dd924eb711d182bf0000e829fbfe/frameset.htm>. 

How to:

* Set up a transport domain on each location (on-premises and Azure) using transaction STMS 
  <http://help.sap.com/saphelp_nw70ehp3/helpdata/en/44/b4a0b47acc11d1899e0000e829fbbd/content.htm>
* Link the domains with a domain link and confirm the link between the two domains. 
  <http://help.sap.com/saphelp_nw73ehp1/helpdata/en/a3/139838280c4f18e10000009b38f8cf/content.htm>
* Distribute the configuration to the linked system.

#### RFC traffic between SAP instances located in Azure and on-premises (Cross-Premises)

RFC traffic between systems which are on-premises and in Azure needs to work. To setup a connection call transaction SM59 in a source system where you need to define an RFC connection towards the target system. The configuration is similar to the standard setup of an RFC Connection.

We assume that in the Cross-Premises scenario, the VMs which run SAP systems that need to communicate with each other are in the same domain. Therefore the setup of an RFC connection between SAP systems does not differ from the setup steps and inputs in on-premises scenarios.

#### Accessing ‘local’ fileshares from SAP instances located in Azure or vice versa

SAP instances located in Azure need to access file shares which are within the corporate premises. In addition, on-premises SAP instances need to access file shares which are located in Azure. To enable the file shares you must configure the permissions and sharing options on the local system. Make sure to open the ports on the VPN or ExpressRoute connection between Azure and your datacenter.

## Supportability
### <a name="6f0a47f3-a289-4090-a053-2521618a28c3"></a>Azure Monitoring Solution for SAP
In order to enable the monitoring of mission critical SAP systems on Azure the SAP monitoring tools SAPOSCOL or SAP Host Agent get data off the Azure Virtual Machine Service host via an Azure Monitoring Extension for SAP. Since the demands by SAP were very specific to SAP applications, Microsoft decided not to generically implement the required functionality into Azure, but leave it for customers to deploy the necessary monitoring components and configurations to their Virtual Machines running in Azure. However, deployment and lifecycle management of the monitoring components will be mostly automated by Azure.

#### Solution design

The solution developed to enable SAP Monitoring is based on the architecture of Azure VM Agent and Extension framework. The idea of the Azure VM Agent and Extension framework is to allow installation of software application(s) available in the Azure VM Extension gallery within a VM. The principle idea behind this concept is to allow (in cases like the Azure Monitoring Extension for SAP), the deployment of special functionality into a VM and the configuration of such software at deployment time. 

Since February 2014, the ‘Azure VM Agent’ that enables handling of specific Azure VM Extensions within the VM is injected into Windows VMs by default on VM creation in the Azure Portal. In case of SUSE or Red Hat Linux the VM agent is already part of the 
Azure Marketplace image. In case one would upload a Linux VM from on-premises to Azure the VM agent has to be installed manually.


The basic building blocks of the Monitoring solution in Azure for SAP looks like this:
 
![Microsoft Azure Extension components][planning-guide-figure-2400]

As shown in the block diagram above, one part of the monitoring solution for SAP is hosted in the Azure VM Image and Azure Extension Gallery which is a globally replicated repository that is managed by Azure Operations. It is the responsibility of the joint SAP/MS team working on the Azure implementation of SAP to work with Azure Operations to publish new versions of the Azure Monitoring Extension for SAP. This Azure Monitoring Extension for SAP will use the Microsoft Azure Diagnostics (WAD) Extension or Linux Azure Diagnostics ( LAD ) to get the necessary information. 

When you deploy a new Windows VM, the ‘Azure VM Agent’ is automatically added into the VM. The function of this agent is to coordinate the loading and configuration of the Azure Extensions for monitoring of SAP NetWeaver Systems. For Linux VMs the Azure VM Agent is already part of the Azure Marketplace OS image.

However, there is a step that still needs to be executed by the customer. This is the enablement and configuration of the performance collection. The process related to the ‘configuration’ is automated by a PowerShell script or CLI command. The PowerShell script can be downloaded in the Microsoft Azure Script Center as described in the [Deployment Guide][deployment-guide].

The overall Architecture of the Azure monitoring solution for SAP looks like:
 
![Azure monitoring solution for SAP NetWeaver][planning-guide-figure-2500]

**For the exact how-to and for detailed steps of using these PowerShell cmdlets or CLI command during deployments, follow the instructions given in the [Deployment Guide][deployment-guide].**

### Integration of Azure located SAP instance into SAProuter

SAP instances running in Azure need to be accessible from SAProuter as well.
 
![SAP-Router Network Connection][planning-guide-figure-2600]

A SAProuter enables the TCP/IP communication between participating systems if there is no direct IP connection. This provides the advantage that no end-to-end connection between the communication partners is necessary on network level. The SAProuter is listening on port 3299 by default.
To connect SAP instances through a SAProuter you need to give the SAProuter string and host name with any attempt to connect.

## SAP NetWeaver AS Java

So far the focus of the document has been SAP NetWeaver in general or the SAP NetWeaver ABAP stack. In this small section, specific considerations for the SAP Java stack are listed. One of the most important SAP NetWeaver Java exclusively based applications is the SAP Enterprise Portal. Other SAP NetWeaver based applications like SAP PI and SAP Solution Manager use both the SAP NetWeaver ABAP and Java stacks. Therefore, there certainly is a need to consider specific aspects related to the SAP NetWeaver Java stack as well.

### SAP Enterprise Portal

The setup of an SAP Portal in an Azure Virtual Machine does not differ from an on premises installation if you are deploying in Cross-Premises scenarios. Since the DNS is done by on-premises, the port settings of the individual instances can be done as configured on-premises. The recommendations and restrictions described in this document so far apply for an application like SAP Enterprise Portal or the SAP NetWeaver Java stack in general. 

![Exposed SAP Portal][planning-guide-figure-2700]

A special deployment scenario by some customers is the direct exposure of the SAP Enterprise Portal to the Internet while the virtual machine host is connected to the company network via site-to-site VPN tunnel or ExpressRoute. For such a scenario, you have to make sure that specific ports are open and not blocked by firewall or network security group. The same mechanics would need to be applied when you want to connect to an SAP Java instance from on-premises in a Cloud-Only scenario.

The initial portal URI is http(s):`<Portalserver`>:5XX00/irj where the port is formed by 50000 plus (Systemnumber × 100). The default portal URI of SAP system 00 is `<dns name`>.`<azure region`>.Cloudapp.azure.com:PublicPort/irj. For more details, have a look a
<http://help.sap.com/saphelp_nw70ehp1/helpdata/de/a2/f9d7fed2adc340ab462ae159d19509/frameset.htm>. 
 
![Endpoint configuration][planning-guide-figure-2800]

If you want to customize the URL and/or ports of your SAP Enterprise Portal, please check this documentation:

* [Change Portal URL](http://wiki.scn.sap.com/wiki/display/EP/Change+Portal+URL) 
* [Change Default port numbers, Portal port numbers](http://wiki.scn.sap.com/wiki/display/NWTech/Change+Default++port+numbers%2C+Portal+port+numbers) 


## High Availability (HA) and Disaster Recovery (DR) for SAP NetWeaver running on Azure Virtual Machines
### Definition of terminologies

The Term **high availability (HA)** is generally related to a set of technologies that minimizes IT disruptions by providing business continuity of IT services through redundant, fault-tolerant or failover protected components inside the **same** data center. In our case, within one Azure Region.

**Disaster recovery (DR)** is also targeting minimizing IT services disruption, and their recovery but across **different** data centers, that are usually located hundreds of kilometers away. In our case usually between different Azure Regions within the same geopolitical region or as established by you as a customer.

### Overview of High Availability
We can separate the discussion about SAP high availability in Azure into two parts:

* **Azure infrastructure high availability**, e.g. HA of compute (VMs), network, storage etc. and its benefits for increasing SAP application availability.
* **SAP application high availability**, e.g. HA of SAP software components:
	* SAP application servers
	* SAP ASCS/SCS instance 
	* DB server

and how it can be combined with Azure infrastructure HA.

SAP High Availability in Azure has some differences compared to SAP High Availability in an on-premises physical or virtual environment. The following paper from SAP describes standard SAP High Availability configurations in virtualized environments on Windows: <http://scn.sap.com/docs/DOC-44415>. There is no sapinst-integrated SAP-HA configuration for Linux like it exists for Windows. Regarding SAP HA on-premises for Linux find more information here : <http://scn.sap.com/docs/DOC-8541>.

### Azure Infrastructure High Availability
There is no single-VM SLA available on Azure Virtual Machines right now. To get an idea how the availability of a single VM might look like you can simply build the product of the different available Azure SLAs: <https://azure.microsoft.com/support/legal/sla/>.

The basis for the calculation is 30 days per month, or 43200 minutes. Therefore, 0.05% downtime corresponds to 21.6 minutes. As usual, the availability of the different services will multiply in the following way:

(Availability Service #1/100) * (Availability Service #2/100) * (Availability Service #3/100) *…

Like:

(99.95/100) * (99.9/100) * (99.9/100) = 0.9975 or an overall availability of 99.75%.

#### Virtual Machine (VM) High Availability

There are two types of Azure platform events that can affect the availability of your virtual machines: planned maintenance and unplanned maintenance.

* Planned maintenance events are periodic updates made by Microsoft to the underlying Azure platform to improve overall reliability, performance, and security of the platform infrastructure that your virtual machines run on.
* Unplanned maintenance events occur when the hardware or physical infrastructure underlying your virtual machine has faulted in some way. This may include local network failures, local disk failures, or other rack level failures. When such a failure is detected, the Azure platform will automatically migrate your virtual machine from the unhealthy physical server hosting your virtual machine to a healthy physical server. Such events are rare, but may also cause your virtual machine to reboot.

More details can be found in this documentation: <http://azure.microsoft.com/documentation/articles/virtual-machines-manage-availability>

#### Azure Storage Redundancy

The data in your Microsoft Azure Storage Account is always replicated to ensure durability and high availability, meeting the Azure Storage SLA even in the face of transient hardware failures

Since Azure Storage is keeping 3 images of the data by default, RAID5 or RAID1 across multiple Azure disks are not necessary.

More details can be found in this article: <http://azure.microsoft.com/documentation/articles/storage-redundancy/> 

#### Utilizing Azure Infrastructure VM Restart to Achieve “Higher Availability” of SAP Applications

If you decide not to use functionalities like Windows Server Failover Clustering (WSFC) or a Linux equivalent ( the latter one is not supported yet on Azure in combination with SAP software ), Azure VM Restart is utilized to protect a SAP System against planned and unplanned downtime of the Azure physical server infrastructure and overall underlying Azure platform. 
 
> [AZURE.NOTE] It is important to mention that Azure VM Restart primarily protects VMs and NOT applications. VM Restart does not offer high availability for SAP applications, but it does offer a certain level of infrastructure availability and therefore indirectly “higher availability” of SAP systems. There is also no SLA for the time it will take to restart a VM after a planned or unplanned host outage. Therefore, this method of ‘high availability’ is not suitable for critical components of a SAP system like (A)SCS or DBMS.

Another important infrastructure element for high availability is storage. E.g. Azure Storage SLA is 99,9 % availability. If one deploys all VMs with its disks into a single Azure Storage Account, potential Azure Storage unavailability will cause unavailability of all VMs that are placed in that Azure Storage Account, and also all SAP components running inside of those VMs.  

Instead of putting all VMs into one single Azure Storage Account, you can also use dedicated storage accounts for each VM, and in this way increase overall VM and SAP application availability by using multiple independent Azure Storage Accounts. 

A sample architecture of a SAP NetWeaver system that uses Azure infrastructure HA could look like this:
 
![Utilizing Azure infrastructure HA to achieve SAP application “higher” availability][planning-guide-figure-2900]

For critical SAP components we achieved the following so far :

* High Availability of SAP Application Servers (AS)

SAP application server instances are redundant components. Each SAP AS instance is deployed on its own VM, that is running in a different Azure Fault and Upgrade Domain (see chapters [Fault Domains][planning-guide-3.2.1] and [Upgrade Domains][planning-guide-3.2.2]). This is ensured by using Azure Availability Sets (see chapter [Azure Availability Sets][planning-guide-3.2.3]). Potential planned or unplanned unavailability of an Azure Fault or Upgrade Domain will cause unavailability of a restricted number of VMs with their SAP AS instances. 
Each SAP AS instance is placed in its own Azure Storage account – potential unavailability of one Azure Storage Account will cause unavailability of only one VM with its SAP AS instance. However, be aware that there is a limit of Azure Storage Accounts within one Azure subscription. To ensure automatic start of (A)SCS instance after the VM reboot, make sure to set Autostart parameter in (A)SCS instance start profile described in chapter [Using Autostart for SAP instances][planning-guide-11.5].
Please also read chapter [High Availability for SAP Application Servers][planning-guide-11.4.1] for more details.

* _Higher_ Availability of SAP (A)SCS instance
 
Here we utilize Azure VM Restart to protect the VM with installed SAP (A)SCS instance. In the case of planned or unplanned downtime of Azure severs, VMs will be restarted on another available server. As mentioned earlier, Azure VM Restart primarily protects VMs and NOT applications, in this case the (A)SCS instance. Through the VM Restart we’ll reach indirectly “higher availability” of SAP (A)SCS instance. To insure automatic start of (A)SCS instance after the VM reboot, make sure to set Autostart parameter in (A)SCS instance start profile described in chapter [Using Autostart for SAP instances][planning-guide-11.5]. This means the (A)SCS instance as a Single Point of Failure (SPOF) running in a single VM will be the determinative factor for the availability of the whole SAP landscape. 

* _Higher_ Availability of DBMS Server

Here, similar to the SAP (A)SCS instance use case, we utilize Azure VM Restart to protect the VM with installed DBMS software, and we achieve “higher availability” of DBMS software through VM Restart. 
DBMS running in a single VM is also a SPOF, and it is the determinative factor for the availability of the whole SAP landscape. 

### SAP Application High Availability on Azure IaaS
To achieve full SAP system high availability, we need to protect all critical SAP system components, e.g. redundant SAP application servers, and unique components (e.g. Single Point of Failure) like SAP (A)SCS instance and DBMS. 

#### <a name="5d9d36f9-9058-435d-8367-5ad05f00de77"></a>High Availability for SAP Application Servers
For the SAP application servers/dialog instances it’s not necessary to think about a specific high availability solution. High availability is simply achieved by redundancy and thereby having enough of them in different virtual machines. They should all be placed in the same Azure Availability Set to avoid that the VMs might be updated at the same time during planned maintenance downtime. The basic functionality which builds on different Upgrade and Fault Domains within an Azure Scale Unit was already introduced in chapter [Upgrade Domains][planning-guide-3.2.2]. Azure Availability Sets were presented in chapter [Azure Availability Sets][planning-guide-3.2.3] of this document. 

There is no infinite number of Fault and Upgrade Domains that can be used by an Azure Availability Set within an Azure Scale Unit. This means that putting a number of VMs into one Availability Set sooner or later in the fact that more than one VM ends up in the same Fault or Upgrade Domain

Deploying a few SAP application server instances in their dedicated VMs and assuming that we got 5 Upgrade Domains, the following picture emerges at the end. The actual max number of fault and update domains within an availability set might change in the future :
 
![HA of SAP Application Servers in Azure][planning-guide-figure-3000]

More details can be found in this documentation: <http://azure.microsoft.com/documentation/articles/virtual-machines-manage-availability>


#### High Availability for the SAP (A)SCS instance on Windows

Windows Server Failover Cluster (WSFC) is a frequently used solution to protect the SAP (A)SCS instance. It is also integrated into sapinst in form of a "HA installation". At this point in time the Azure infrastructure is not able to provide the functionality to set up the required Windows Server Failover Cluster the same way as it's done on-premises.

As of January 2016 the Azure cloud platform running the Windows operating system does not provide the possibility of using a cluster shared volume on a disk shared between two Azure VMs.

A valid solution though is the usage of 3rd-party software which provides a shared volume by synchronous and transparent disk replication which can be integrated into WSFC. This approach implies that only the active cluster node is able to access one of the disk copies at a point in time. As of January 2016 this HA configuration is supported to protect the SAP (A)SCS instance on Windows guest OS on Azure VMs in combination with 3rd-party software SIOS DataKeeper.

The SIOS DataKeeper solution provides a shared disk cluster resource to Windows Failover Clusters by having:

* An additional Azure VHD attached to each of the virtual machines (VMs) that are in a Windows Cluster configuration
* SIOS DataKeeper Cluster Edition running on both VM nodes
* Having SIOS DataKeeper Cluster Edition configured in a way that it synchronously mirrors the content of the additional VHD attached volume from source VMs to additional VHD attached volume of target VM.
* SIOS DataKeeper is abstracting the source and target local volumes and presenting them to Windows Failover Cluster as a single shared disk.
 
You can find all details on how to install a Windows Failover Cluster with SIOS Datakeeper and SAP in the [Clustering SAP ASCS Instance using Windows Server Failover Cluster on Azure with SIOS DataKeeper][ha-guide-classic] white paper. 

#### High Availability for the SAP (A)SCS instance on Linux
 
As of Dec 2015 there is also no equivalent to shared disk WSFC for Linux VMs on Azure. Alternative solutions using 3rd-party software like SIOS for Windows are not validated yet for running SAP on Linux on Azure.



#### High Availability for the SAP database instance
The typical SAP DBMS HA setup is based on two DBMS VMs where DBMS high-availability functionality is used to replicate data from the active DBMS instance to the second VM into a passive DBMS instance.

High Availability and Disaster recovery functionality for DBMS in general as well as specific DBMS are described in the [DBMS Deployment Guide][dbms-guide].


#### End-to-End High Availability for the Complete SAP System

Here are two examples of a complete SAP NetWeaver HA architecture in Azure - one for Windows and one for Linux.
The concepts as explained below may need to be compromised a bit when you deploy many SAP systems and the number of VMs deployed are exceeding the maximum limit of Storage Accounts per subscription. In such cases, VHDs of VMs need to be combined within one Storage Account. Usually you would do so by combining VHDs of SAP application layer VMs of different SAP systems.  We also combined different VHDs of different DBMS VMs of different SAP systems in one Azure Storage Account. Thereby keeping the IOPS limits of Azure Storage Accounts in mind ( <https://azure.microsoft.com/documentation/articles/storage-scalability-targets> )

##### ![Windows][Logo_Windows] HA on Windows

![SAP NetWeaver Application HA Architecture with SQL Server in Azure IaaS][planning-guide-figure-3200]

The following Azure constructs are used for the SAP NetWeaver system, to minimize impact by infrastructure issues and host patching:

* The complete system is deployed on Azure (required - DBMS layer, (A)SCS instance and complete application layer need to run in the same location).
* The complete system runs within one Azure subscription (required).
* The complete system runs within one Azure Virtual Network (required).
* The separation of the VMs of one SAP system into three Availability Sets is possible even with all the VMs belonging to the same Virtual Network.
* All VMs running DBMS instances of one SAP system are in one Availability Set. We assume that there is more than one VM running DBMS instances per system since native DBMS high availability features are used, like SQL Server AlwaysOn or Oracle Data Guard.
* All VMs running DBMS instances use their own storage account. DBMS data and log files are replicated from one storage account to another storage account using DBMS high availability functions that synchronize the data. Unavailability of one storage account will cause unavailability of one SQL Windows cluster node, but not the whole SQL Server service. 
* All VMs running (A)SCS instance of one SAP system are in one Availability Set. Inside of those VMs is configure Windows Sever Failover Cluster (WSFC) to protect (A)SCS instance.
* All VMs running (A)SCS instances use their own storage account. (A)SCS instance files and SAP global folder are replicated from one storage account to another storage account using SIOS DataKeeper replication. Unavailability of one storage account will cause unavailability of one (A)SCS Windows cluster node, but not the whole (A)SCS service. 
* ALL the VMs representing the SAP application server layer are in a third Availability Set.
* ALL the VMs running SAP application servers use their own storage account. Unavailability of one storage account will cause unavailability of one SAP application server, where other SAP AS continue to run.

##### ![Linux][Logo_Linux] HA on Linux

The architecture for SAP HA on Linux on Azure is basically the same as for Windows as described above. As of Jan 2016 there are two restrictions though :

* only SAP ASE 16 is currently supported on Linux on Azure without any ASE replication features. 
* there is no SAP (A)SCS HA solution supported yet on Linux on Azure

As a consequence as of January 2016 a SAP-Linux-Azure system cannot achieve the same availability as a SAP-Windows-Azure system because of missing HA for the (A)SCS instance and the single-instance SAP ASE database.

### <a name="4e165b58-74ca-474f-a7f4-5e695a93204f"></a>Using Autostart for SAP instances

SAP offered the functionality to start SAP instances immediately after the start of the OS within the VM. The exact steps were documented in  SAP Knowledge Base Article [1909114] - How to start SAP instances automatically using parameter Autostart. However, SAP is not recommending to use the setting anymore because there is no control in the order of instance restarts, assuming more than one VM got affected or multiple instances ran per VM. Assuming a typical Azure scenario of one SAP application server instance in a VM and the case of a single VM eventually getting restarted, the Autostart is not really critical and can be enabled by adding this parameter:

	Autostart = 1

Into the start profile of the SAP ABAP and/or Java instance.

> [AZURE.NOTE] 
> The Autostart parameter can have some downfalls as well. In more detail, the parameter triggers the start of a SAP ABAP or Java instance when the related Windows/Linux service of the instance is started. That certainly is the case when the operating systems boots up. However, restarts of SAP services are also a common thing for SAP Software Lifecycle Management functionality like SUM or other updates or upgrades. These functionalities are not expecting an instance to be restarted automatically at all. Therefore, the Autostart parameter should be disabled before running such tasks. The Autostart parameter also should not be used for SAP instances that are clustered, like ASCS/SCS/CI.

See additional information regarding autostart for SAP instances here :

* [Start/Stop SAP along with your Unix Server Start/Stop](http://scn.sap.com/community/unix/blog/2012/08/07/startstop-sap-along-with-your-unix-server-startstop)
* [Starting and Stopping SAP NetWeaver Management Agents](https://help.sap.com/saphelp_nwpi711/helpdata/en/49/9a15525b20423ee10000000a421938/content.htm)
* [How to enable auto Start of HANA Database](http://www.freehanatutorials.com/2012/10/how-to-enable-auto-start-of-hana.html)


### Larger 3-Tier SAP systems
High-Availability aspects of 3-Tier SAP configurations got discussed in earlier sections already. But what about systems where the DBMS server requirements are too large to have it located in Azure, but the SAP application layer could be deployed into Azure?

#### Location of 3-Tier SAP configurations

It is not supported to split the application tier itself or the application and DBMS tier between on-premises and Azure. A SAP system is either completely deployed on-premises OR in Azure. It is also not supported to have some of the application servers run on-premises and some others in Azure. That is the starting point of the discussion. We also are not supporting to have the DBMS components of a SAP system and the SAP application server layer deployed in two different Azure Regions. E.g. DBMS in West US and SAP application layer in Central US. Reason for not supporting such configurations is the latency sensitivity of the SAP NetWeaver architecture.

However, over the course of last year data center partners developed co-locations to Azure Regions. These co-locations often are in very close proximity to the physical Azure data centers within an Azure Region. The short distance and connection of assets in the co-location through ExpressRoute into Azure can result in a latency that is less than 2ms. In such cases, to locate the DBMS layer (including storage SAN/NAS) in such a co-location and the SAP application layer in Azure is possible. As of Dec 2015, we don’t have any deployments like that. But different customers with non-SAP application deployments are using such approaches already. 

### Offline Backup of SAP systems

Dependent on the SAP configuration chosen (2-Tier or 3-Tier) there could be a need to backup. The content of the VM itself plus to have a backup of the database. The DBMS related backups are expected to be done with database methods. A detailed description for the different databases, can be found in [DBMS Guide][dbms-guide]. On the other hand, the SAP data can be backed up in an offline manner (including the database content as well) as described in this section or online as described in the next section.

The offline backup would basically require a shutdown of the VM through the Azure Portal and a copy of the base VM disk plus all attached VHDs to the VM. This would preserve a point in time image of the VM and its associated disk. It is recommended to copy the ‘backups’ into a different Azure Storage Account. Hence the procedure described in chapter [Copying disks between Azure Storage Accounts][planning-guide-5.4.2] of this document would apply.
Besides the shutdown using the Azure Portal one can also do it via Powershell or CLI as described here :
<https://azure.microsoft.com/documentation/articles/virtual-machines-deploy-rmtemplates-powershell/>

A restore of that state would consist of deleting the base VM as well as the original disks of the base VM and mounted VHDs, copying back the saved VHDs to the original Storage Account and then redeploying the system.
This article shows an example how to script this process in Powershell :
<http://www.westerndevs.com/azure-snapshots/>

Please make sure to install a new SAP license since restoing a VM backup as described above creates a new hardware key.

### Online backup of an SAP system

Backup of the DBMS is performed with DBMS specific methods as described in the [DBMS Guide][dbms-guide]. 

Other VMs within the SAP system can be backed up using Azure Virtual Machine Backup functionality. Azure Virtual Machine Backup got introduced early in 2015 and meanwhile is a standard method to backup a complete VM in Azure. Azure Backup stores the backups in Azure and allows a restore of a VM again. 

> [AZURE.NOTE] 
> As of Dec 2015 using VM Backup does NOT keep the unique VM ID which is used for SAP licensing. This means that a restore from a VM
> backup requires installation of a new SAP license key as the restored VM is considered to be a new VM and not a replacement of the
> former one which was saved. 
> As of Jan 2016 Azure VM Backup doesn't support VMs that are deployed with Azure Resourc Manager yet.

> ![Windows][Logo_Windows] Windows
>
> Theoretically VMs that run databases can be backed up in a consistent manner as well if the DBMS systems supports the Windows VSS
> (Volume Shadow Copy Service <https://msdn.microsoft.com/library/windows/desktop/bb968832(v=vs.85).aspx> ) as e.g. SQL Server does.
> However, be aware that based on Azure VM backups point-in-time restores of databases are not possible. Therefore, the
> recommendation is to perform backups of databases with DBMS functionality instead of relying on Azure VM Backup
>
> To get familiar with Azure Virtual Machine Backup please start here:
> <https://azure.microsoft.com/documentation/articles/backup-azure-vms/>.
>
> Other possibilities are to use a combination of Microsoft Data Protection Manager installed in an Azure VM and Azure Backup to
> backup/restore databases. More information can be found here:
> <https://azure.microsoft.com/documentation/articles/backup-azure-dpm-introduction/>.  


> ![Linux][Logo_Linux] Linux
> 
> There is no equivalent to Windows VSS in Linux. Therefore only file-consistent backups are possible but not
> application-consistent backups. The SAP DBMS backup should be done using DBMS functionality. The file system
> which includes the SAP related data can be saved e.g. using tar as described here :
> <http://help.sap.com/saphelp_nw70ehp2/helpdata/en/d3/c0da3ccbb04d35b186041ba6ac301f/content.htm>


### Azure as DR site for production SAP landscapes

Since Mid 2014, extensions to various components around Hyper-V, System Center and Azure enable the usage of Azure as DR site for VMs running on-premise based on Hyper-V. 

A blog detailing how to deploy this solution is documented here: 
<http://blogs.msdn.com/b/saponsqlserver/archive/2014/11/19/protecting-sap-solutions-with-azure-site-recovery.aspx>

## Summary
The key points of High Availability for SAP systems in Azure are:

* At this point in time, the SAP single point of failure cannot be secured exactly the same way as it can be done in on-premises deployments. The reason is that Shared Disk clusters can’t yet be built in Azure without the use of 3rd party software.
* For the DBMS layer you need to use DBMS functionality that does not rely on shared disk cluster technology. Details are documented in the [DBMS Guide][dbms-guide].
* To minimize the impact of problems within Fault Domains in the Azure infrastructure or host maintenance, you should use Azure Availability Sets:
	* It is recommended to have one Availability Set for the SAP application layer.
	* It is recommended to have a separate Availability Set for the SAP DBMS layer.
	* It is NOT recommended to apply the same Availability set for VMs of different SAP systems.
* For Backup purposes of the SAP DBMS layer, please check the [DBMS Guide][dbms-guide].
* Backing up SAP Dialog instances makes little sense since it is usually faster to redeploy simple dialog instances.
* Backing up the VM which contains the global directory of the SAP system and with it all the profiles of the different instances, does make sense and should be performed with Windows Backup or e.g. tar on Linux. Since there are differences between Windows Server 2008 (R2) and Windows Server 2012 (R2), which make it easier to backup using the more recent Windows Server releases, we recommend to run Windows Server 2012 (R2) as Windows guest operating system. 
