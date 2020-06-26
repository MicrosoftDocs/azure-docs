---
title: SQL Server Azure Virtual Machines DBMS deployment for SAP workload | Microsoft Docs
description: SQL Server Azure Virtual Machines DBMS deployment for SAP workload
services: virtual-machines-linux,virtual-machines-windows
documentationcenter: ''
author: msjuergent
manager: patfilot
editor: ''
tags: azure-resource-manager
keywords: ''

ms.service: virtual-machines-linux

ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 09/26/2018
ms.author: juergent
ms.custom: H1Hack27Feb2017

---

# SQL Server Azure Virtual Machines DBMS deployment for SAP NetWeaver

[767598]:https://launchpad.support.sap.com/#/notes/767598
[773830]:https://launchpad.support.sap.com/#/notes/773830
[826037]:https://launchpad.support.sap.com/#/notes/826037
[965908]:https://launchpad.support.sap.com/#/notes/965908
[1031096]:https://launchpad.support.sap.com/#/notes/1031096
[1114181]:https://launchpad.support.sap.com/#/notes/1114181
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
[2171857]:https://launchpad.support.sap.com/#/notes/2171857
[2178632]:https://launchpad.support.sap.com/#/notes/2178632
[2191498]:https://launchpad.support.sap.com/#/notes/2191498
[2233094]:https://launchpad.support.sap.com/#/notes/2233094
[2243692]:https://launchpad.support.sap.com/#/notes/2243692

[azure-cli]:../../../cli-install-nodejs.md
[azure-portal]:https://portal.azure.com
[azure-ps]:/powershell/azureps-cmdlets-docs
[azure-quickstart-templates-github]:https://github.com/Azure/azure-quickstart-templates
[azure-script-ps]:https://go.microsoft.com/fwlink/p/?LinkID=395017
[azure-resource-manager/management/azure-subscription-service-limits]:../../../azure-resource-manager/management/azure-subscription-service-limits.md
[azure-resource-manager/management/azure-subscription-service-limits-subscription]:../../../azure-resource-manager/management/azure-subscription-service-limits.md#subscription-limits

[dbms-guide]:dbms-guide_general.md 
[dbms-guide-2.1]:dbms-guide.md#c7abf1f0-c927-4a7c-9c1d-c7b5b3b7212f 
[dbms-guide-2.2]:dbms-guide.md#c8e566f9-21b7-4457-9f7f-126036971a91 
[dbms-guide-2.3]:dbms-guide.md#10b041ef-c177-498a-93ed-44b3441ab152 
[dbms-guide-2]:dbms-guide.md#65fa79d6-a85f-47ee-890b-22e794f51a64 
[dbms-guide-3]:dbms-guide.md#871dfc27-e509-4222-9370-ab1de77021c3 
[dbms-guide-5.5.1]:dbms-guide.md#0fef0e79-d3fe-4ae2-85af-73666a6f7268 
[dbms-guide-5.5.2]:dbms-guide.md#f9071eff-9d72-4f47-9da4-1852d782087b 
[dbms-guide-5.6]:dbms_guide_sqlserver.md#1b353e38-21b3-4310-aeb6-a77e7c8e81c8 
[dbms-guide-5.8]:dbms-guide.md#9053f720-6f3b-4483-904d-15dc54141e30 
[dbms-guide-5]:dbms-guide.md#3264829e-075e-4d25-966e-a49dad878737 
[dbms-guide-8.4.1]:dbms-guide.md#b48cfe3b-48e9-4f5b-a783-1d29155bd573 
[dbms-guide-8.4.2]:dbms-guide.md#23c78d3b-ca5a-4e72-8a24-645d141a3f5d 
[dbms-guide-8.4.3]:dbms-guide.md#77cd2fbb-307e-4cbf-a65f-745553f72d2c 
[dbms-guide-8.4.4]:dbms-guide.md#f77c1436-9ad8-44fb-a331-8671342de818 
[dbms-guide-900-sap-cache-server-on-premises]:dbms-guide.md#642f746c-e4d4-489d-bf63-73e80177a0a8
[dbms-guide-managed-disks]:dbms-guide.md#f42c6cb5-d563-484d-9667-b07ae51bce29

[dbms-guide-figure-100]:media/virtual-machines-shared-sap-dbms-guide/100_storage_account_types.png
[dbms-guide-figure-200]:media/virtual-machines-shared-sap-dbms-guide/200-ha-set-for-dbms-ha.png
[dbms-guide-figure-300]:media/virtual-machines-shared-sap-dbms-guide/300-reference-config-iaas.png
[dbms-guide-figure-400]:media/virtual-machines-shared-sap-dbms-guide/400-sql-2012-backup-to-blob-storage.png
[dbms-guide-figure-500]:media/virtual-machines-shared-sap-dbms-guide/500-sql-2012-backup-to-blob-storage-different-containers.png
[dbms-guide-figure-600]:media/virtual-machines-shared-sap-dbms-guide/600-iaas-maxdb.png
[dbms-guide-figure-700]:media/virtual-machines-shared-sap-dbms-guide/700-livecach-prod.png
[dbms-guide-figure-800]:media/virtual-machines-shared-sap-dbms-guide/800-azure-vm-sap-content-server.png
[dbms-guide-figure-900]:media/virtual-machines-shared-sap-dbms-guide/900-sap-cache-server-on-premises.png

[deployment-guide]:deployment-guide.md 
[deployment-guide-2.2]:deployment-guide.md#42ee2bdb-1efc-4ec7-ab31-fe4c22769b94 
[deployment-guide-3.1.2]:deployment-guide.md#3688666f-281f-425b-a312-a77e7db2dfab 
[deployment-guide-3.2]:deployment-guide.md#db477013-9060-4602-9ad4-b0316f8bb281 
[deployment-guide-3.3]:deployment-guide.md#54a1fc6d-24fd-4feb-9c57-ac588a55dff2 
[deployment-guide-3.4]:deployment-guide.md#a9a60133-a763-4de8-8986-ac0fa33aa8c1 
[deployment-guide-3]:deployment-guide.md#b3253ee3-d63b-4d74-a49b-185e76c4088e 
[deployment-guide-4.1]:deployment-guide.md#604bcec2-8b6e-48d2-a944-61b0f5dee2f7 
[deployment-guide-4.2]:deployment-guide.md#7ccf6c3e-97ae-4a7a-9c75-e82c37beb18e 
[deployment-guide-4.3]:deployment-guide.md#31d9ecd6-b136-4c73-b61e-da4a29bbc9cc 
[deployment-guide-4.4.2]:deployment-guide.md#6889ff12-eaaf-4f3c-97e1-7c9edc7f7542 
[deployment-guide-4.4]:deployment-guide.md#c7cbb0dc-52a4-49db-8e03-83e7edc2927d 
[deployment-guide-4.5.1]:deployment-guide.md#987cf279-d713-4b4c-8143-6b11589bb9d4 
[deployment-guide-4.5.2]:deployment-guide.md#408f3779-f422-4413-82f8-c57a23b4fc2f 
[deployment-guide-4.5]:deployment-guide.md#d98edcd3-f2a1-49f7-b26a-07448ceb60ca 
[deployment-guide-5.1]:deployment-guide.md#bb61ce92-8c5c-461f-8c53-39f5e5ed91f2 
[deployment-guide-5.2]:deployment-guide.md#e2d592ff-b4ea-4a53-a91a-e5521edb6cd1
[deployment-guide-5.3]:deployment-guide.md#fe25a7da-4e4e-4388-8907-8abc2d33cfd8 

[deployment-guide-configure-monitoring-scenario-1]:deployment-guide.md#ec323ac3-1de9-4c3a-b770-4ff701def65b 
[deployment-guide-configure-proxy]:deployment-guide.md#baccae00-6f79-4307-ade4-40292ce4e02d 
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
[deployment-guide-troubleshooting-chapter]:deployment-guide.md#564adb4f-5c95-4041-9616-6635e83a810b

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

[msdn-set-azurermvmaemextension]:https://msdn.microsoft.com/library/azure/mt670598.aspx

[planning-guide]:planning-guide.md 
[planning-guide-1.2]:planning-guide.md#e55d1e22-c2c8-460b-9897-64622a34fdff 
[planning-guide-11]:planning-guide.md#7cf991a1-badd-40a9-944e-7baae842a058 
[planning-guide-11.4.1]:planning-guide.md#5d9d36f9-9058-435d-8367-5ad05f00de77 
[planning-guide-11.5]:planning-guide.md#4e165b58-74ca-474f-a7f4-5e695a93204f 
[planning-guide-2.1]:planning-guide.md#1625df66-4cc6-4d60-9202-de8a0b77f803 
[planning-guide-2.2]:planning-guide.md#f5b3b18c-302c-4bd8-9ab2-c388f1ab3d10 
[planning-guide-3.1]:planning-guide.md#be80d1b9-a463-4845-bd35-f4cebdb5424a 
[planning-guide-3.2.1]:planning-guide.md#df49dc09-141b-4f34-a4a2-990913b30358 
[planning-guide-3.2.2]:planning-guide.md#fc1ac8b2-e54a-487c-8581-d3cc6625e560 
[planning-guide-3.2.3]:planning-guide.md#18810088-f9be-4c97-958a-27996255c665 
[planning-guide-3.2]:planning-guide.md#8d8ad4b8-6093-4b91-ac36-ea56d80dbf77 
[planning-guide-3.3.2]:planning-guide.md#ff5ad0f9-f7f4-4022-9102-af07aef3bc92 
[planning-guide-5.1.1]:planning-guide.md#4d175f1b-7353-4137-9d2f-817683c26e53 
[planning-guide-5.1.2]:planning-guide.md#e18f7839-c0e2-4385-b1e6-4538453a285c 
[planning-guide-5.2.1]:planning-guide.md#1b287330-944b-495d-9ea7-94b83aff73ef 
[planning-guide-5.2.2]:planning-guide.md#57f32b1c-0cba-4e57-ab6e-c39fe22b6ec3 
[planning-guide-5.2]:planning-guide.md#6ffb9f41-a292-40bf-9e70-8204448559e7 
[planning-guide-5.3.1]:planning-guide.md#6e835de8-40b1-4b71-9f18-d45b20959b79 
[planning-guide-5.3.2]:planning-guide.md#a43e40e6-1acc-4633-9816-8f095d5a7b6a 
[planning-guide-5.4.2]:planning-guide.md#9789b076-2011-4afa-b2fe-b07a8aba58a1 
[planning-guide-5.5.1]:planning-guide.md#4efec401-91e0-40c0-8e64-f2dceadff646 
[planning-guide-5.5.3]:planning-guide.md#17e0d543-7e8c-4160-a7da-dd7117a1ad9d 
[planning-guide-7.1]:planning-guide.md#3e9c3690-da67-421a-bc3f-12c520d99a30 
[planning-guide-7]:planning-guide.md#96a77628-a05e-475d-9df3-fb82217e8f14 
[planning-guide-9.1]:planning-guide.md#6f0a47f3-a289-4090-a053-2521618a28c3 
[planning-guide-azure-premium-storage]:planning-guide.md#ff5ad0f9-f7f4-4022-9102-af07aef3bc92 

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
[planning-guide-microsoft-azure-networking]:planning-guide.md#61678387-8868-435d-9f8c-450b2424f5bd 
[planning-guide-storage-microsoft-azure-storage-and-data-disks]:planning-guide.md#a72afa26-4bf4-4a25-8cf7-855d6032157f 

[resource-group-authoring-templates]:../../../resource-group-authoring-templates.md
[resource-group-overview]:../../../azure-resource-manager/management/overview.md
[resource-groups-networking]:../../../networking/networking-overview.md
[sap-pam]:https://support.sap.com/pam 
[sap-templates-2-tier-marketplace-image]:https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fsap-2-tier-marketplace-image%2Fazuredeploy.json
[sap-templates-2-tier-os-disk]:https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fsap-2-tier-user-disk%2Fazuredeploy.json
[sap-templates-2-tier-user-image]:https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fsap-2-tier-user-image%2Fazuredeploy.json
[sap-templates-3-tier-marketplace-image]:https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fsap-3-tier-marketplace-image%2Fazuredeploy.json
[sap-templates-3-tier-user-image]:https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fsap-3-tier-user-image%2Fazuredeploy.json
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
[virtual-machines-azurerm-versus-azuresm]:../../../resource-manager-deployment-model.md
[virtual-machines-windows-classic-configure-oracle-data-guard]:../../virtual-machines-windows-classic-configure-oracle-data-guard.md
[virtual-machines-linux-cli-deploy-templates]:../../linux/cli-deploy-templates.md 
[virtual-machines-deploy-rmtemplates-powershell]:../../virtual-machines-windows-ps-manage.md 
[virtual-machines-linux-agent-user-guide]:../../linux/agent-user-guide.md
[virtual-machines-linux-agent-user-guide-command-line-options]:../../linux/agent-user-guide.md#command-line-options
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
[virtual-machines-manage-availability-linux]:../../linux/manage-availability.md
[virtual-machines-manage-availability-windows]:../../windows/manage-availability.md
[virtual-machines-ps-create-preconfigure-windows-resource-manager-vms]:virtual-machines-windows-create-powershell.md
[virtual-machines-sizes-linux]:../../linux/sizes.md
[virtual-machines-sizes-windows]:../../windows/sizes.md
[virtual-machines-windows-classic-ps-sql-alwayson-availability-groups]:./../../windows/sqlclassic/virtual-machines-windows-classic-ps-sql-alwayson-availability-groups.md
[virtual-machines-windows-classic-ps-sql-int-listener]:./../../windows/sqlclassic/virtual-machines-windows-classic-ps-sql-int-listener.md
[virtual-machines-sql-server-high-availability-and-disaster-recovery-solutions]:../../../azure-sql/virtual-machines/windows/business-continuity-high-availability-disaster-recovery-hadr-overview.md
[virtual-machines-sql-server-infrastructure-services]:../../../azure-sql/virtual-machines/windows/sql-server-on-azure-vm-iaas-what-is-overview.md
[virtual-machines-sql-server-performance-best-practices]:../../../azure-sql/virtual-machines/windows/performance-guidelines-best-practices.md
[virtual-machines-upload-image-windows-resource-manager]:../../virtual-machines-windows-upload-image.md
[virtual-machines-windows-tutorial]:../../virtual-machines-windows-hero-tutorial.md
[virtual-machines-workload-template-sql-alwayson]:https://azure.microsoft.com/eresources/templates/sql-server-2014-alwayson-existing-vnet-and-ad/
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




This document covers several different areas to consider when deploying SQL Server for SAP workload in Azure IaaS. As a precondition to this document, you should have read the document [Considerations for Azure Virtual Machines DBMS deployment for SAP workload](dbms_guide_general.md) as well as other guides in the [SAP workload on Azure documentation](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/get-started). 



> [!IMPORTANT]
> The scope of this document is the Windows version on SQL Server. SAP is not supporting the Linux version of SQL Server with any of the SAP software. The document is not discussing Microsoft Azure SQL Database, which is a Platform as a Service offer of the Microsoft Azure Platform. The discussion in this paper is about running the SQL Server product as it is known for on-premises deployments in Azure Virtual Machines, leveraging the Infrastructure as a Service capability of Azure. Database capabilities and functionalities between these two offers are different and should not be mixed up with each other. See also: <https://azure.microsoft.com/services/sql-database/>
> 
>

In general, you should consider using the most recent SQL Server releases to run SAP workload in Azure IaaS. The latest SQL Server releases offer better integration into some of the Azure services and functionality. Or have changes that optimize operations in an Azure IaaS infrastructure.

It is recommended to review [this][virtual-machines-sql-server-infrastructure-services] documentation before continuing.

In the following sections, pieces of parts of the documentation under the link above are aggregated and mentioned. Specifics around SAP are mentioned as well and some concepts are described in more detail. However, it is highly recommended to work through the documentation above first before reading the SQL Server-specific documentation.

There is some SQL Server in IaaS specific information you should know before continuing:

* **SQL Version Support**: For SAP customers, SQL Server 2008 R2 and higher is supported on Microsoft Azure Virtual Machine. Earlier editions are not supported. Review this general [Support Statement](https://support.microsoft.com/kb/956893) for more details. In general, SQL Server 2008 is supported by Microsoft as well. However due to significant functionality for SAP, which was introduced with SQL Server 2008 R2, SQL Server 2008 R2 is the minimum release for SAP. In general, you should consider using the most recent SQL Server releases to run SAP workload in Azure IaaS. The latest SQL Server releases offer better integration into some of the Azure services and functionality. Or have changes that optimize operations in an Azure IaaS infrastructure. Therefore, the paper is restricted to SQL Server 2016 and SQL Server 2017.
* **SQL Performance**: Microsoft Azure hosted Virtual Machines perform well in comparison to other public cloud virtualization offerings, but individual results may vary. Check out the article [Performance best practices for SQL Server in Azure Virtual Machines](https://docs.microsoft.com/azure/virtual-machines/windows/sql/virtual-machines-windows-sql-performance).
* **Using Images from Azure Marketplace**: The fastest way to deploy a new Microsoft Azure VM is to use an image from the Azure Marketplace. There are images in the Azure Marketplace, which contain the most recent SQL Server releases. The images where SQL Server already is installed can't be immediately used for SAP NetWeaver applications. The reason is the default SQL Server collation is installed within those images and not the collation required by SAP NetWeaver systems. In order to use such images, check the steps documented in chapter [Using a SQL Server image out of the Microsoft Azure Marketplace][dbms-guide-5.6]. 


## Recommendations on VM/VHD structure for SAP-related SQL Server deployments
In accordance with the general description, SQL Server executables should be located or installed into the system drive of the VM's OS disk (drive C:\).  Typically, most of the SQL Server system databases are not utilized at a high level by SAP NetWeaver workload. As a result the system databases of SQL Server (master, msdb, and model) can remain on the C:\ drive as well. An exception should be tempdb, which in the case of SAP workloads, might require either higher data volume or I/O operations volume. I/O workload, which should not be applied to the OS VHD. For such systems, the following steps should be performed:


* With all SAP certified VM types (see SAP Note [1928533]), except A-Series VMs, tempdb data, and log files can be placed on the non-persisted D:\ drive. 
* Nevertheless, it is recommended to use multiple tempdb data files. Be aware D:\ drive volumes are different based on the VM type. For exact sizes of the D:\ drive of the different VMs, check the article [Sizes for Windows virtual machines in Azure](https://docs.microsoft.com/azure/virtual-machines/windows/sizes).

These configurations enable tempdb to consume more space than the system drive is able to provide. The non-persistent D:\ drive also offers better I/O latency and throughput (with the exception of A-Series VMs). In order to determine the proper tempdb size, you can check the tempdb sizes on existing systems. 

>[!NOTE]
> in case you place tempdb data files and log file into a folder on D:\ drive that you created, you need to make sure that the folder does exist after a VM reboot. Since the D:\ drive is freshly initialized after a VM reboot all file and directory structures are wiped out. A possibility to recreate eventual directory structures on D:\ drive before the start of the SQL Server service is documented in [this article](https://cloudblogs.microsoft.com/sqlserver/2014/09/25/using-ssds-in-azure-vms-to-store-sql-server-tempdb-and-buffer-pool-extensions/).

A VM configuration, which runs SQL Server with an SAP database and where tempdb data and tempdb logfile are placed on the D:\ drive would look like:

![Diagram of simple VM disk configuration for SQL Server](./media/dbms_sqlserver_deployment_guide/Simple_disk_structure.PNG)

The diagram above displays a simple case. As eluded to in the article [Considerations for Azure Virtual Machines DBMS deployment for SAP workload](dbms_guide_general.md), number, and size of Premium Storage disks is dependent from different factors. But in general we recommend:

- Using storage spaces to form one or a small number of volumes, which contain the SQL Server data files. Reason behind this configuration is that in real life there are numerous SAP databases with different sized database files with different I/O workload.
- Using Storage spaces to supply enough IOPS and for the SQL Server transaction log file. Potential IOPS workload often is the guiding line for the sizing of the transaction log volume and not the potential volume of the SQL Server transaction volume
- Use the D:\drive for tempdb as long as performance is good enough. If the overall workload is limited in performance by tmepdb being located on the D:\ drive you might need to consider to move tempdb to separate Premium Storage disks as recommended in [this article](https://docs.microsoft.com/azure/virtual-machines/windows/sql/virtual-machines-windows-sql-performance).


### Special for M-Series VMs
For Azure M-Series VM, the latency writing into the transaction log can be reduced by factors, compared to Azure Premium Storage performance, when using Azure Write Accelerator. Hence, you should deploy Azure Write Accelerator for the VHD(s) that form the volume for the SQL Server transaction log. Details can be read in the document [Write Accelerator](https://docs.microsoft.com/azure/virtual-machines/windows/how-to-enable-write-accelerator).
  

### Formatting the disks
For SQL Server, the NTFS block size for disks containing SQL Server data and log files should be 64KB. There is no need to format the D:\ drive. This drive comes pre-formatted.

In order to make sure that the restore or creation of databases is not initializing the data files by zeroing the content of the files, you should make sure that the user context the SQL Server service is running in has a certain permission. Usually users in the Windows Administrator group have these permissions. If the SQL Server service is run in the user context of non-Windows Administrator user, you need to assign that user the User Right **Perform volume maintenance tasks**.  See the details in this Microsoft Knowledge Base Article: <https://support.microsoft.com/kb/2574695>

### Impact of database compression
In configurations where I/O bandwidth can become a limiting factor, every measure, which reduces IOPS might help to stretch the workload one can run in an IaaS scenario like Azure. Therefore, if not yet done, applying SQL Server PAGE compression is recommended by both SAP and Microsoft before uploading an existing SAP database to Azure.

The recommendation to perform Database Compression before uploading to Azure is given out of two reasons:

* The amount of data to be uploaded is lower.
* The duration of the compression execution is shorter assuming that one can use stronger hardware with more CPUs or higher I/O bandwidth or less I/O latency on-premises.
* Smaller database sizes might lead to less costs for disk allocation

Database compression works as well in an Azure Virtual Machines as it does on-premises. For more details on how to compress existing SAP NetWeaver SQL Server databases, check the article [Improved SAP compression tool MSSCOMPRESS](https://blogs.msdn.microsoft.com/saponsqlserver/2016/11/25/improved-sap-compression-tool-msscompress/). 

## SQL Server 2014 and more recent - Storing Database Files directly on Azure Blob Storage
SQL Server 2014 and later releases open the possibility to store database files directly on Azure Blob Store without the 'wrapper' of a VHD around them. Especially with using Standard Azure Storage or smaller VM types this type of deployment enables scenarios where you can overcome the limits of IOPS that would be enforced by a limited number of disks that can be mounted to some smaller VM types. This way of deployment works for user databases however not for system databases of SQL Server. It also works for data and log files of SQL Server. If you'd like to deploy an SAP SQL Server database this way instead of 'wrapping' it into VHDs, keep in mind:

* The Storage Account used needs to be in the same Azure Region as the one that is used to deploy the VM SQL Server is running in.
* Considerations listed earlier regarding the distribution of VHDs over different Azure Storage Accounts apply for this method of deployments as well. Means the I/O operations count against the limits of the Azure Storage Account.
* Instead of accounting against the VM's storage I/O quota, the traffic against storage blobs representing the SQL Server data and log files, will be accounted into the VM's network bandwidth of the specific VM type. For network and storage bandwidth of a particular VM type, consult the article [Sizes for Windows virtual machines in Azure](https://docs.microsoft.com/azure/virtual-machines/windows/sizes).
* As a result of pushing file I/O through the network quota, you are stranding the storage quota mostly and with that use the overall bandwidth of the VM only partially.
* The IOPS and I/O throughput Performance targets that Azure Premium Storage has for the different disk sizes do not apply anymore. Even if the blobs you created are located on Azure Premium Storage. The targets are documented the article [High-performance Premium Storage and managed disks for VMs](https://docs.microsoft.com/azure/virtual-machines/windows/premium-storage). As a result of placing SQL Server data files and log files directly on blobs that are stored on Azure Premium Storage, the performance characteristics can be different compared to VHDs on Azure Premium Storage.
* Host based caching as available for Azure Premium Storage disks is not available when placing SQL Server data files directly on Azure blobs.
* On M-Series VMs, Azure Write Accelerator can't be used to support sub-millisecond writes against the SQL Server transaction log file. 

Details of this functionality can be found in the article [SQL Server data files in Microsoft Azure](https://docs.microsoft.com/sql/relational-databases/databases/sql-server-data-files-in-microsoft-azure?view=sql-server-2017)

Recommendation for production systems is to avoid this configuration and rather choose the placements of SQL Server data and log files in Azure Premium Storage VHDs instead of directly on Azure blobs.


## SQL Server 2014 Buffer Pool Extension
SQL Server 2014 introduced a new feature, which is called [Buffer Pool Extension](https://docs.microsoft.com/sql/database-engine/configure-windows/buffer-pool-extension?view=sql-server-2017). This functionality extends the buffer pool of SQL Server, which is kept in memory with a second-level cache that is backed by local SSDs of a server or VM. The buffer pool extension enables keeping a larger working set of data 'in memory'. Compared to accessing Azure Standard Storage the access into the extension of the buffer pool, which is stored on local SSDs of an Azure VM is many factors faster. Comparing Buffer Pool Extension to Azure Premium Storage Read Cache, as recommended for SQL Server data files, no significant advantages are expected for Buffer Pool Extensions. Reason is that both caches (SQL Server Buffer Pool Extension and Premium Storage Read Cache) are using the local disks of the Azure compute node.

Experiences gained in the meantime with SQL Server Buffer Pool Extension with SAP workload is mixed and still does not allow clear recommendations on whether to use it in all cases. The ideal case is that the working set the SAP application requires fits into main memory. With Azure meanwhile offering VMs that come with up to 4 TB of memory, it should be achievable to keep the working set in memory. Hence the usage of Buffer Pool Extension is limited to some rare cases and should not be a mainstream case.  

## Backup/Recovery considerations for SQL Server
When deploying SQL Server into Azure, your backup methodology must be reviewed. Even if the system is not a production system, the SAP database hosted by SQL Server must be backed up periodically. Since Azure Storage keeps three images, a backup is now less important in respect to compensating a storage crash. The priority reason for maintaining a proper backup and recovery plan is more that you can compensate for logical/manual errors by providing point in time recovery capabilities. So the goal is to either use backups to restore the database back to a certain point in time or to use the backups in Azure to seed another system by copying the existing database. 

In order to look at different SQL Server backup possibilities in Azure read the article [Backup and Restore for SQL Server in Azure Virtual Machines](https://docs.microsoft.com/azure/virtual-machines/windows/sql/virtual-machines-windows-sql-backup-recovery). The article covers several different possibilities.

### Manual backups
You have several possibilities to perform 'manual' backups by:

1. Performing conventional SQL Server backups onto direct attached Azure disks. This method has the advantage that you have the backups available swiftly for system refreshes and build up of new systems as copies of existing SAP systems
2.  SQL Server 2012 CU4 and higher can  back up databases to an Azure storage URL.
3.  File-Snapshot Backups for Database Files in Azure Blob Storage. This method only works when your SQL Server data and log files are located on Azure blob storage

The first method is well known and applied in many cases in the on-premises world as well. Nevertheless, it leaves you with the task to solve the longer term backup location. Since you don't want to keep your backups for 30 or more days in the locally attached Azure Storage, you have the need to either use Azure Backup Services or another third-party backup/recovery tool that includes access and retention management for your backups. Or you build out a large file server in Azure using Windows storage spaces.

The second method is described closer in the article [SQL Server Backup to URL](https://docs.microsoft.com/sql/relational-databases/backup-restore/sql-server-backup-to-url?view=sql-server-2017). Different releases of SQL Server have some variations in this functionality. Therefore, you should check out the documentation for your particular SQL Server release check. Important to note that this article lists a lot of restrictions. You either have the possibility to perform the backup against:

- One single Azure page blob, which then limits the backup size to 1000 GB. This also limits the throughput you can achieve.
- Multiple (up to 64) Azure block blobs, which enable a theoretical backup size of 12 TB. However, tests with customer databases revealed that the maximum backup size can be smaller than its theoretical limit. In this case, you are responsible for managing retention of backups and access o the backups as well.


### Automated Backup for SQL Server
Automated Backup provides an automatic backup service for SQL Server Standard and Enterprise editions running in a Windows VM in Azure. This service is provided by the [SQL Server IaaS Agent Extension](https://docs.microsoft.com/azure/virtual-machines/windows/sql/virtual-machines-windows-sql-server-agent-extension), which is automatically installed on SQL Server Windows virtual machine images in the Azure portal. If you deploy your own OS images with SQL Server installed, you need to install the VM extensions separately. The steps necessary are documented in this [article](https://docs.microsoft.com/azure/virtual-machines/windows/sql/virtual-machines-windows-sql-server-agent-extension).

More details about the capabilities of this method can be found in these articles:

- SQL Server 2014: [Automated Backup for SQL Server 2014 Virtual Machines (Resource Manager)](https://docs.microsoft.com/azure/virtual-machines/windows/sql/virtual-machines-windows-sql-automated-backup)
- SQL Server 2016/2017: [Automated Backup v2 for Azure Virtual Machines (Resource Manager)](https://docs.microsoft.com/azure/virtual-machines/windows/sql/virtual-machines-windows-sql-automated-backup-v2)

Looking into the documentation, you can see that the functionality with the more recent SQL Server releases improved. Some more details on SQL Server automated backups are released in the article [SQL Server Managed Backup to Microsoft Azure](https://docs.microsoft.com/sql/relational-databases/backup-restore/sql-server-managed-backup-to-microsoft-azure?view=sql-server-2017). The theoretical backup size limit is 12 TB.  The automated backups can be a good method for backup sizes of up to 12 TB. Since multiple blobs are written to in parallel, you can expect a throughput of larger than 100 MB/sec. 
 

### Azure Backup for SQL Server VMs
This new method of SQL Server backups is offered as of June 2018 as public preview by Azure Backup services. The method to backup SQL Server is the same as other third-party tools are using, namely the SQL Server VSS/VDI interface to stream backups to a target location. In this case the target location is Azure Recovery Service vault.

A more than detailed description of this backup method, which adds numerous advantages of central backup configurations, monitoring, and administration is available [here](https://docs.microsoft.com/azure/backup/backup-azure-sql-database). 


### Third-party backup solutions
For quite a number of SAP customers, there was no possibility to start over and introduce complete new backup solutions for the part of their SAP landscape that was running on Azure. As a result, the existing backup solutions needed to be used and extended into Azure. Extending existing backup solutions into Azure usually worked well with most of the main vendors in this space. 


## <a name="1b353e38-21b3-4310-aeb6-a77e7c8e81c8"></a>Using a SQL Server image out of the Microsoft Azure Marketplace
Microsoft offers VMs in the Azure Marketplace, which already contain versions of SQL Server. For SAP customers who require licenses for SQL Server and Windows, using these images might be an opportunity to cover the need for licenses by spinning up VMs with SQL Server already installed. In order to use such images for SAP, the following considerations need to be made:

* The SQL Server non-Evaluation versions acquire higher costs than a 'Windows-only' VM deployed from Azure Marketplace. See these articles to compare prices: <https://azure.microsoft.com/pricing/details/virtual-machines/windows/> and <https://azure.microsoft.com/pricing/details/virtual-machines/sql-server-enterprise/>. 
* You only can use SQL Server releases, which are supported by SAP.
* The collation of the SQL Server instance, which is installed in the VMs offered in the Azure Marketplace is not the collation SAP NetWeaver requires the SQL Server instance to run. You can change the collation though with the directions in the following section.

### Changing the SQL Server Collation of a Microsoft Windows/SQL Server VM
Since the SQL Server images in the Azure Marketplace are not set up to use the collation, which is required by SAP NetWeaver applications, it needs to be changed immediately after the deployment. For SQL Server, this change of collation can be done with the following steps as soon as the VM has been deployed and an administrator is able to log into the deployed VM:

* Open a Windows Command Window, as administrator.
* Change the directory to C:\Program Files\Microsoft SQL Server\110\Setup Bootstrap\SQLServer2012.
* Execute the command: Setup.exe /QUIET /ACTION=REBUILDDATABASE /INSTANCENAME=MSSQLSERVER /SQLSYSADMINACCOUNTS=`<local_admin_account_name`> /SQLCOLLATION=SQL_Latin1_General_Cp850_BIN2   
  * `<local_admin_account_name`> is the account, which was defined as the administrator account when deploying the VM for the first time through the gallery.

The process should only take a few minutes. In order to make sure whether the step ended up with the correct result, perform the following steps:

* Open SQL Server Management Studio.
* Open a Query Window.
* Execute the command sp_helpsort in the SQL Server master database.

The desired result should look like:

    Latin1-General, binary code point comparison sort for Unicode Data, SQL Server Sort Order 40 on Code Page 850 for non-Unicode Data

If the result is different, STOP deploying SAP and investigate why the setup command did not work as expected. Deployment of SAP NetWeaver applications onto SQL Server instance with different SQL Server codepages than the one mentioned above is **NOT** supported.

## SQL Server High-Availability for SAP in Azure
Using SQL Server in Azure IaaS deployments for SAP, you have several different possibilities to add to deploy the DBMS layer highly available. As discussed in [Considerations for Azure Virtual Machines DBMS deployment for SAP workload](dbms_guide_general.md) already, Azure provide different up-time SLAs for a single VM and a pair of VMs deployed in an Azure Availability Set. Assumption is that you drive towards the up-time SLA for your production deployments that requires the deployment in Azure Availability Sets. In such a case, you need to deploy a minimum of two VMs in such an Availability Set. One VM will run the active SQL Server Instance. The other VM will run the passive Instance

### SQL Server Clustering using Windows Scale-out File Server
With Windows Server 2016, Microsoft introduced [Storage Spaces Direct](https://docs.microsoft.com/windows-server/storage/storage-spaces/storage-spaces-direct-overview). Based on Storage Spaces Direct Deployment, SQL Server FCI clustering is supported. Details can be found in the article [Configure SQL Server Failover Cluster Instance on Azure Virtual Machines](https://docs.microsoft.com/azure/virtual-machines/windows/sql/virtual-machines-windows-portal-sql-create-failover-cluster). The solution requires an Azure load balancer as well to deal with the virtual IP address of the cluster resources. The SQL Server database files are stored in Storage Spaces. Hence, it is a given that you would be required to build up the Windows Storage Spaces based on Azure Premium Storage. Since this solution has been supported for not too long yet, there are no known SAP customers who use this solution in SAP production scenarios.  

### SQL Server Log Shipping
One of the methods of high availability (HA) is SQL Server Log Shipping. If the VMs participating in the HA configuration have working name resolution, there is no problem and the setup in Azure does not differ from any setup that is done on-premises. With regards to setting up Log Shipping and the principles around Log Shipping. Details of SQL Server Log Shipping can be found in the article [About Log Shipping (SQL Server)](https://docs.microsoft.com/sql/database-engine/log-shipping/about-log-shipping-sql-server?view=sql-server-2017).

The SQL Server log shipping functionality was hardly used in Azure to achieve high availability within one Azure region. However in the following scenarios SAP customers were using log shipping successful in conjunction with Azure:

- Disaster Recovery scenarios from one Azure region into another Azure region
- Disaster Recovery configuration from on-premises into an Azure region
- Cut-over scenarios from on-premises to Azure. In those cases, log shipping is used to synchronize the new DBMS deployment in Azure with the ongoing production system on-premises. At the time of cutting over, production is shut down and it is made sure that the last and latest transaction log backups got transferred to the Azure DBMS deployment. Then the Azure DBMS deployment is opened up for production.  



### Database Mirroring
Database Mirroring as supported by SAP (see SAP Note [965908]) relies on defining a failover partner in the SAP connection string. For the Cross-Premises cases, we assume that the two VMs are in the same domain and that the user context the two SQL Server instances are running under a domain user as well and have sufficient privileges in the two SQL Server instances involved. Therefore, the setup of Database Mirroring in Azure does not differ between a typical on-premises setup/configuration.

As of Cloud-Only deployments, the easiest method is to have another domain setup in Azure to have those DBMS VMs (and ideally dedicated SAP VMs) within one domain.

If a domain is not possible, one can also use certificates for the database mirroring endpoints as described here: <https://docs.microsoft.com/sql/database-engine/database-mirroring/use-certificates-for-a-database-mirroring-endpoint-transact-sql>

A tutorial to set up Database Mirroring in Azure can be found here: <https://docs.microsoft.com/sql/database-engine/database-mirroring/database-mirroring-sql-server> 

### SQL Server Always On
As Always On is supported for SAP on-premises (see SAP Note [1772688]), it is supported in combination with SAP in Azure. There are some special considerations around deploying the SQL Server Availability Group Listener (not to be confused with the Azure Availability Set) since Azure at this point in time does not allow creating an AD/DNS object as it is possible on-premises. Therefore, some different installation steps are necessary to overcome the specific behavior of Azure.

Some considerations using an Availability Group Listener are:

* Using an Availability Group Listener is only possible with Windows Server 2012 or higher as guest OS of the VM. For Windows Server 2012 you need to make sure that this patch is applied: <https://support.microsoft.com/kb/2854082> 
* For Windows Server 2008 R2, this patch does not exist and Always On would need to be used in the same manner as Database Mirroring by specifying a failover partner in the connections string (done through the SAP default.pfl parameter dbs/mss/server - see SAP Note [965908]).
* When using an Availability Group Listener, the Database VMs need to be connected to a dedicated Load Balancer. In order to avoid that Azure is assigning new IP addresses in cases where both VMs incidentally are shut down, one should assign static IP addresses to the network interfaces of those VMs in the Always On configuration (defining a static IP address is described in [this][virtual-networks-reserved-private-ip] article)
* There are special steps required when building the WSFC cluster configuration where the cluster needs a special IP address assigned, because Azure with its current functionality would assign the cluster name the same IP address as the node the cluster is created on. This means a manual step must be performed to assign a different IP address to the cluster.
* The Availability Group Listener is going to be created in Azure with TCP/IP endpoints, which are assigned to the VMs running the primary and secondary replicas of the Availability group.
* There might be a need to secure these endpoints with ACLs.

Detailed documentation on deploying Always On with SQL Server in Azure VMs lists like:

- [Introducing SQL Server Always On availability groups on Azure virtual machines](https://docs.microsoft.com/azure/virtual-machines/windows/sql/virtual-machines-windows-portal-sql-availability-group-overview).
- [Configure an Always On availability group on Azure virtual machines in different regions](https://docs.microsoft.com/azure/virtual-machines/windows/sql/virtual-machines-windows-portal-sql-availability-group-dr).
- [Configure a load balancer for an Always On availability group in Azure](https://docs.microsoft.com/azure/virtual-machines/windows/sql/virtual-machines-windows-portal-sql-alwayson-int-listener).

>[!NOTE]
> If you are configuring the Azure load balancer for the virtual IP address of the Availability Group listener, make sure that the DirectServerReturn is configured. configuring this option will reduce the network round trip latency between the SAP application layer and the DBMS layer. 

SQL Server Always On is the most common used high availability and disaster recovery functionality used in Azure for SAP workload deployments. Most customers use Always On for high availability within a single Azure Region. If the deployment is restricted to two nodes only, you have two choices for connectivity:

- Using the Availability Group Listener. With the Availability Group Listener, you are required to deploy an Azure load balancer. This is usually the default method of deployment. SAP applications would be configured to connect against the Availability Group listener and not against a single node
- Using the connectivity parameters of SQL Server Database Mirroring. In this case, you need to configure the connectivity of the SAP applications in a way where both node names are named. Exact details of such an SAP side configuration is documented in SAP Note [#965908](https://launchpad.support.sap.com/#/notes/965908). By using this option, you would have no need to configure an Availability Group listener. And with that no Azure load balancer for the SQL Server high availability. As a result, the network latency between the SAP application layer and the DBMS layer is lower since the incoming traffic to the SQL Server instance is not routed through the Azure load balancer. But recall, this option only works if you restrict your Availability Group to span two instances. 

Quite a few customers are leveraging the SQL Server Always On functionality for additional disaster recovery functionality between Azure regions. Several customers also use the ability to perform backups from a secondary replica. 

## SQL Server Transparent Data Encryption
There is a number of customers who are using SQL Server [Transparent Data Encryption (TDE)](https://docs.microsoft.com/sql/relational-databases/security/encryption/transparent-data-encryption?view=sql-server-2017) when deploying their SAP SQL Server databases in Azure. The SQL Server TDE functionality is fully supported by SAP (see SAP Note [#1380493](https://launchpad.support.sap.com/#/notes/1380493)). 

### Applying SQL Server TDE
In cases where you perform a heterogeneous migration from another DBMS, running on-premises, to Windows/SQL Server running in Azure, you should create your empty target database in SQL Server ahead of time. As next step you would apply SQL Server TDE functionality. While you are still running your production system on-premises. Reason you want to perform in this sequence is that the process of encrypting the empty database can take quite a while. The SAP import processes would then import the data into the encrypted database during the downtime phase. The overhead of importing into an encrypted database has a way lower time impact than encrypting the database after the export phase in the down time phase. Negative experiences where made when trying to apply TDE with SAP workload running on top of the database. Therefore, recommendation is treating the deployment of TDE as an activity that needs to be done without SAP workload on the particular database.

In cases where you move SAP SQL Server databases from on-premises into Azure, we recommend testing on which infrastructure you can get the encryption applied fastest. For this keep these facts in mind:

- You can't define how many threads are used to apply data encryption to the database. The number of threads is majorly dependent on the number of disk volumes the SQL Server data and log files are distributed over. Means the more distinct volumes (drive letters), the more threads will be engaged in parallel to perform the encryption. Such a configuration contradicts a bit with earlier disk configuration suggestion on building one or a smaller number of storage spaces for the SQL Server database files in Azure VMs. A configuration with a small number of volumes would lead to a small number of threads executing the encryption. A single thread encrypting is reading 64KB extents, encrypts it and then write a record into the transaction log file, telling that the extent got encrypted. As a result the load on the transaction log is moderate.
- In older SQL Server releases, backup compression did not get efficiency anymore when you encrypted your SQL Server database. This behavior could develop into an issue when your plan was to encrypt your SQL Server database on-premises and then copy a backup into Azure to restore the database in Azure. SQL Server backup compression usually achieves a compression ratio of factor 4.
- With SQL Server 2016, SQL Server introduced new functionality that allows compressing encrypted databases as well in an efficient manner. See [this blogs](https://blogs.msdn.microsoft.com/sqlcat/2016/06/20/sqlsweet16-episode-1-backup-compression-for-tde-enabled-databases/) for some details.
 
Treating the application of TDE encryption with no to little SAP workload only, you should test in your specific configuration on whether it is better to apply TDE to your SAP database on-premises or to do so in Azure. In Azure, you certainly have more flexibility in terms of over-provisioning infrastructure and shrink the infrastructure after TDE got applied.

### Using Azure Key Vault
Azure offers the service of a [Key Vault](https://azure.microsoft.com/services/key-vault/) to store encryption keys. SQL Server on the other side offer a connector to leverage Azure Key Vault as store for the TDE certificates.

More details to use Azure Key Vault for SQL Server TDE lists like:

- [Extensible Key Management Using Azure Key Vault (SQL Server)](https://docs.microsoft.com/sql/relational-databases/security/encryption/extensible-key-management-using-azure-key-vault-sql-server?view=sql-server-2017).
- [SQL Server TDE Extensible Key Management Using Azure Key Vault - Setup Steps](https://docs.microsoft.com/sql/relational-databases/security/encryption/setup-steps-for-extensible-key-management-using-the-azure-key-vault?view=sql-server-2017).
- [SQL Server Connector Maintenance & Troubleshooting](https://docs.microsoft.com/sql/relational-databases/security/encryption/sql-server-connector-maintenance-troubleshooting?view=sql-server-2017).
- [More Questions From Customers About SQL Server Transparent Data Encryption – TDE + Azure Key Vault](https://blogs.msdn.microsoft.com/saponsqlserver/2017/04/04/more-questions-from-customers-about-sql-server-transparent-data-encryption-tde-azure-key-vault/).


>[!IMPORTANT]
>Using SQL Server TDE, especially with Azure key Vault, it is recommended to use the latest patches of SQL Server 2014, SQL Server 2016, and SQL Server 2017. Reason is that based on customer feedback, optimizations and fixes got applied to the code. As an example, check [KBA #4058175](https://support.microsoft.com/help/4058175/tde-enabled-backup-and-restore-slow-if-encryption-key-is-stored-in-ekm).
>  

## <a name="9053f720-6f3b-4483-904d-15dc54141e30"></a>General SQL Server for SAP on Azure Summary
There are many recommendations in this guide and we recommend you read it more than once before planning your Azure deployment. In general, though, be sure to follow the top general DBMS on Azure-specific recommendations:

1. Use the latest DBMS release, like SQL Server 2017, that has the most advantages in Azure. 
2. Carefully plan your SAP system landscape in Azure to balance the data file layout and Azure restrictions:
   * Don't have too many disks, but have enough to ensure you can reach your required IOPS.
   * If you don't use Managed Disks, remember that IOPS are also limited per Azure Storage Account and that Storage Accounts are limited within each Azure subscription ([more details][azure-resource-manager/management/azure-subscription-service-limits]). 
   * Only stripe across disks if you need to achieve a higher throughput.
3. Never install software or put any files that require persistence on the D:\ drive as it is non-permanent and anything on this drive is lost at a Windows reboot.
4. Don't use disk caching for Azure Standard Storage.
5. Don't use Azure geo-replicated Azure Standard Storage Accounts.  Use Locally Redundant for DBMS workloads.
6. Use your DBMS vendor's HA/DR solution to replicate database data.
7. Always use Name Resolution, don't rely on IP addresses.
8. Using SQL Server TDE, apply the latest SQL Server patches.
9. Use the highest database compression possible. Which is page compression for SQL Server.
10. Be careful using SQL Server images from the Azure Marketplace. If you use the SQL Server one, you must change the instance collation before installing any SAP NetWeaver system on it.
11. Install and configure the SAP Host Monitoring for Azure as described in [Deployment Guide][deployment-guide].
