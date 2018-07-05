---
title: SQL Server Azure Virtual Machines DBMS deployment for SAP workload | Microsoft Docs
description:SQL Server Azure Virtual Machines DBMS deployment for SAP workload
services: virtual-machines-linux,virtual-machines-windows
documentationcenter: ''
author: msjuergent
manager: patfilot
editor: ''
tags: azure-resource-manager
keywords: ''

ms.service: virtual-machines-linux
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 07/11/2018
ms.author: juergent
ms.custom: H1Hack27Feb2017

---

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
[azure-subscription-service-limits]:../../../azure-subscription-service-limits.md
[azure-subscription-service-limits-subscription]:../../../azure-subscription-service-limits.md#subscription-limits

[dbms-guide]:dbms-guide.md 
[dbms-guide-2.1]:dbms-guide.md#c7abf1f0-c927-4a7c-9c1d-c7b5b3b7212f 
[dbms-guide-2.2]:dbms-guide.md#c8e566f9-21b7-4457-9f7f-126036971a91 
[dbms-guide-2.3]:dbms-guide.md#10b041ef-c177-498a-93ed-44b3441ab152 
[dbms-guide-2]:dbms-guide.md#65fa79d6-a85f-47ee-890b-22e794f51a64 
[dbms-guide-3]:dbms-guide.md#871dfc27-e509-4222-9370-ab1de77021c3 
[dbms-guide-5.5.1]:dbms-guide.md#0fef0e79-d3fe-4ae2-85af-73666a6f7268 
[dbms-guide-5.5.2]:dbms-guide.md#f9071eff-9d72-4f47-9da4-1852d782087b 
[dbms-guide-5.6]:dbms-guide.md#1b353e38-21b3-4310-aeb6-a77e7c8e81c8 
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

[dr-guide-classic]:http://go.microsoft.com/fwlink/?LinkID=521971

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

[ha-guide-classic]:http://go.microsoft.com/fwlink/?LinkId=613056

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

[powershell-install-configure]:https://docs.microsoft.com/powershell/azure/install-azurerm-ps
[resource-group-authoring-templates]:../../../resource-group-authoring-templates.md
[resource-group-overview]:../../../azure-resource-manager/resource-group-overview.md
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
[storage-premium-storage-preview-portal]:../../windows/premium-storage.md
[storage-redundancy]:../../../storage/common/storage-redundancy.md
[storage-scalability-targets]:../../../storage/common/storage-scalability-targets.md
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
[virtual-machines-sql-server-high-availability-and-disaster-recovery-solutions]:./../../windows/sql/virtual-machines-windows-sql-high-availability-dr.md
[virtual-machines-sql-server-infrastructure-services]:./../../windows/sql/virtual-machines-windows-sql-server-iaas-overview.md
[virtual-machines-sql-server-performance-best-practices]:./../../windows/sql/virtual-machines-windows-sql-performance.md
[virtual-machines-upload-image-windows-resource-manager]:../../virtual-machines-windows-upload-image.md
[virtual-machines-windows-tutorial]:../../virtual-machines-windows-hero-tutorial.md
[virtual-machines-workload-template-sql-alwayson]:https://azure.microsoft.com/en-us/resources/templates/sql-server-2014-alwayson-existing-vnet-and-ad/
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

# SQL Server Azure Virtual Machines DBMS deployment for SAP NetWeaver

## SQL Server configuration guidelines for SAP-related SQL Server installations in Azure VMs
### Recommendations on VM/VHD structure for SAP-related SQL Server deployments
In accordance with the general description, SQL Server executables should be located or installed into the system drive of the VM's OS disk (drive C:\).  Typically, most of the SQL Server system databases are not utilized at a high level by SAP NetWeaver workload. Hence the system databases of SQL Server (master, msdb, and model) can remain on the C:\ drive as well. An exception could be tempdb, which in the case of some SAP ERP and all BW workloads, might require either higher data volume or I/O operations volume, which can't fit into the original VM. For such systems, the following steps should be performed:

* Move the primary tempdb data file(s) to the same logical drive as the primary data file(s) of the SAP database.
* Add any additional tempdb data files to each of the other logical drives containing a data file of the SAP user database.
* Add the tempdb logfile to the logical drive, which contains the user database's log file.
* **Exclusively for VM types that use local SSDs** on the compute node tempdb data and log files might be placed on the D:\ drive. Nevertheless, it might be recommended to use multiple tempdb data files. Be aware D:\ drive volumes are different based on the VM type.

These configurations enable tempdb to consume more space than the system drive is able to provide. In order to determine the proper tempdb size, one can check the tempdb sizes on existing systems, which run on-premises. In addition, such a configuration would enable IOPS numbers against tempdb, which cannot be provided with the system drive. Again, systems that are running on-premises can be used to monitor I/O workload against tempdb so that you can derive the IOPS numbers you expect to see on your tempdb.

A VM configuration, which runs SQL Server with an SAP database and where tempdb data and tempdb logfile are placed on the D:\ drive would look like:

![Reference Configuration of Azure IaaS VM for SAP][dbms-guide-figure-300]

Be aware that the D:\ drive has different sizes dependent on the VM type. Dependent on the size requirement of tempdb you might be forced to pair tempdb data and log files with the SAP database data and log files in cases where D:\ drive is too small.

### Formatting the disks
For SQL Server the NTFS block size for disks containing SQL Server data and log files should be 64K. There is no need to format the D:\ drive. This drive comes pre-formatted.

In order to make sure that the restore or creation of databases is not initializing the data files by zeroing the content of the files, one should make sure that the user context the SQL Server service is running in has a certain permission. Usually users in the Windows Administrator group have these permissions. If the SQL Server service is run in the user context of non-Windows Administrator user, you need to assign that user the User Right **Perform volume maintenance tasks**.  See the details in this Microsoft Knowledge Base Article: <https://support.microsoft.com/kb/2574695>

### Impact of database compression
In configurations where I/O bandwidth can become a limiting factor, every measure, which reduces IOPS might help to stretch the workload one can run in an IaaS scenario like Azure. Therefore, if not yet done, applying SQL Server PAGE compression is recommended by both SAP and Microsoft before uploading an existing SAP database to Azure.

The recommendation to perform Database Compression before uploading to Azure is given out of two reasons:

* The amount of data to be uploaded is lower.
* The duration of the compression execution is shorter assuming that one can use stronger hardware with more CPUs or higher I/O bandwidth or less I/O latency on-premises.
* Smaller database sizes might lead to less costs for disk allocation

Database compression works as well in an Azure Virtual Machines as it does on-premises. For more details on how to compress an existing SAP SQL Server database, check here: <https://blogs.msdn.com/b/saponsqlserver/archive/2010/10/08/compressing-an-sap-database-using-report-msscompress.aspx>

## SQL Server 2014 - Storing Database Files directly on Azure Blob Storage
SQL Server 2014 opens the possibility to store database files directly on Azure Blob Store without the 'wrapper' of a VHD around them. Especially with using Standard Azure Storage or smaller VM types this enables scenarios where you can overcome the limits of IOPS that would be enforced by a limited number of disks that can be mounted to some smaller VM types. This works for user databases however not for system databases of SQL Server. It also works for data and log files of SQL Server. If you'd like to deploy an SAP SQL Server database this way instead of 'wrapping' it into VHDs, keep the following in mind:

* The Storage Account used needs to be in the same Azure Region as the one that is used to deploy the VM SQL Server is running in.
* Considerations listed earlier regarding the distribution of VHDs over different Azure Storage Accounts apply for this method of deployments as well. Means the I/O operations count against the limits of the Azure Storage Account.

[comment]: <> (MSSedusch TODO But this will use network bandwidth and not storage bandwidth, doesn't it?)

Details about this type of deployment are listed here: <https://docs.microsoft.com/sql/relational-databases/databases/sql-server-data-files-in-microsoft-azure>

In order to store SQL Server data files directly on Azure Premium Storage, you need to have a minimum SQL Server 2014 patch release, which is documented here: <https://support.microsoft.com/kb/3063054>. Storing SQL Server data files on Azure Standard Storage does work with the released version of SQL Server 2014. However, the very same patches contain another series of fixes, which make the direct usage of Azure Blob Storage for SQL Server data files and backups more reliable. Therefore we recommend using these patches in general.

## SQL Server 2014 Buffer Pool Extension
SQL Server 2014 introduced a new feature, which is called Buffer Pool Extension. This functionality extends the buffer pool of SQL Server, which is kept in memory with a second level cache that is backed by local SSDs of a server or VM. This enables to keep a larger working set of data 'in memory'. Compared to accessing Azure Standard Storage the access into the extension of the buffer pool, which is stored on local SSDs of an Azure VM is many factors faster.  Therefore, leveraging the local D:\ drive of the VM types that have excellent IOPS and throughput could be a very reasonable way to reduce the IOPS load against Azure Storage and improve response times of queries dramatically. This applies especially when not using Premium Storage. In case of Premium Storage and the usage of the Premium Azure Read Cache on the compute node, as recommended for data files, no significant differences are expected. Reason is that both caches (SQL Server Buffer Pool Extension and Premium Storage Read Cache) are using the local disks of the compute nodes.
For more details about this functionality, check this documentation: <https://docs.microsoft.com/sql/database-engine/configure-windows/buffer-pool-extension> 

## Backup/Recovery considerations for SQL Server
When deploying SQL Server into Azure your backup methodology must be reviewed. Even if the system is not a productive system, the SAP database hosted by SQL Server must be backed up periodically. Since Azure Storage keeps three images, a backup is now less important in respect to compensating a storage crash. The priority reason for maintaining a proper backup and recovery plan is more that you can compensate for logical/manual errors by providing point in time recovery capabilities. So the goal is to either use backups to restore the database back to a certain point in time or to use the backups in Azure to seed another system by copying the existing database. For example, you could transfer from a 2-Tier SAP configuration to a 3-Tier system setup of the same system by restoring a backup.

There are three different ways to back up SQL Server to Azure Storage:

1. SQL Server 2012 CU4 and higher can natively back up databases to a URL. This is detailed in the blog [New functionality in SQL Server 2014 - Part 5 - Backup/Restore Enhancements](https://blogs.msdn.com/b/saponsqlserver/archive/2014/02/15/new-functionality-in-sql-server-2014-part-5-backup-restore-enhancements.aspx). See chapter [SQL Server 2012 SP1 CU4 and later][dbms-guide-5.5.1].
2. SQL Server releases prior to SQL 2012 CU4 can use a redirection functionality to backup to a VHD and basically move the write stream towards an Azure Storage location that has been configured. See chapter [SQL Server 2012 SP1 CU3 and earlier releases][dbms-guide-5.5.2].
3. The final method is to perform a conventional SQL Server backup to disk command onto a disk device. This is identical to the on-premises deployment pattern and is not discussed in detail in this document.

#### <a name="0fef0e79-d3fe-4ae2-85af-73666a6f7268"></a>SQL Server 2012 SP1 CU4 and later
This functionality allows you to directly backup to Azure BLOB storage. Without this method, you must backup to other disks, which would consume disk and IOPS capacity. The idea is basically this:

 ![Using SQL Server 2012 backup to Microsoft Azure Storage BLOB][dbms-guide-figure-400]

The advantage in this case is that one doesn't need to spend disks to store SQL Server backups on. So you have fewer disks allocated and the whole bandwidth of disk IOPS can be used for data and log files. Note that the maximum size of a backup is limited to a maximum of 1 TB as documented in the section **Limitations** in this article: <https://docs.microsoft.com/sql/relational-databases/backup-restore/sql-server-backup-to-url#limitations>. If the backup size, despite using SQL Server backup compression would exceed 1 TB in size, the functionality described in chapter [SQL Server 2012 SP1 CU3 and earlier releases][dbms-guide-5.5.2] in this document needs to be used.

[Related documentation](https://docs.microsoft.com/sql/relational-databases/backup-restore/restoring-from-backups-stored-in-microsoft-azure) describing the restore of databases from backups against Azure Blob Store recommend not to restore directly from Azure BLOB store if the backup is >25GB. The recommendation in this article is based on performance considerations and not due to functional restrictions. Therefore, different conditions may apply on a case by case basis.

Documentation on how this type of backup is set up and leveraged can be found in [this](https://docs.microsoft.com/sql/relational-databases/tutorial-use-azure-blob-storage-service-with-sql-server-2016) tutorial

An example of the sequence of steps can be read [here](https://docs.microsoft.com/sql/relational-databases/backup-restore/sql-server-backup-to-url).

Automating backups, it is of highest importance to make sure that the BLOBs for each backup are named differently. Otherwise they are overwritten and the restore chain is broken.

In order not to mix up things between the three different types of backups, it is advisable to create different containers underneath the storage account used for backups. The containers could be by VM only or by VM and backup type. The schema could look like:

 ![Using SQL Server 2012 backup to Microsoft Azure Storage BLOB - Different containers under separate Storage Account][dbms-guide-figure-500]

In the example above, the backups would not be performed into the same storage account where the VMs are deployed. There would be a new storage account specifically for the backups. Within the storage accounts, there would be different containers created with a matrix of the type of backup and the VM name. Such segmentation makes it easier to administrate the backups of the different VMs.

The BLOBs one directly writes the backups to, are not adding to the count of the data disks of a VM. Hence one could maximize the maximum of data disks mounted of the specific VM SKU for the data and transaction log file and still execute a backup against a storage container. 

### <a name="f9071eff-9d72-4f47-9da4-1852d782087b"></a>SQL Server 2012 SP1 CU3 and earlier releases
The first step you must perform in order to achieve a backup directly against Azure Storage would be to download the msi, which is linked to [this](https://www.microsoft.com/download/details.aspx?id=40740) KBA article.

Download the x64 installation file and the documentation. The file installs a program called: **Microsoft SQL Server backup to Microsoft Azure Tool**. Read the documentation of the product thoroughly.  The tool basically works in the following way:

* From the SQL Server side, a disk location for the SQL Server backup is defined (don't use the D:\ drive as location).
* The tool allows you to define rules, which can be used to direct different types of backups to different Azure Storage containers.
* Once the rules are in place, the tool redirects the write stream of the backup to one of the VHDs/disks to the Azure Storage location, which was defined earlier.
* The tool leaves a small stub file of a few KB size on the VHD/Disk, which was defined for the SQL Server backup. **This file should be left on the storage location since it is required to restore again from Azure Storage.**
  * If you have lost the stub file (for example through loss of the storage media that contained the stub file) and you have chosen the option of backing up to a Microsoft Azure Storage account, you may recover the stub file through Microsoft Azure Storage by downloading it from the storage container in which it was placed. Place the stub file into a folder on the local machine where the Tool is configured to detect and upload to the same container with the same encryption password if encryption was used with the original rule. 

This means the schema as described above for more recent releases of SQL Server can be put in place as well for SQL Server releases, which are not allowing direct address an Azure Storage location.

This method should not be used with more recent SQL Server releases, which support backing up natively against Azure Storage. Exceptions are where limitations of the native backup into Azure are blocking native backup execution into Azure.

### Other possibilities to back up SQL Server databases
Other possibilities to back up databases is to attach additional data disks to a VM that you use to store backups on. In such a case, you would need to make sure that the disks are not running full. If that is the case, you would need to unmount the disks and so to speak 'archive' it and replace it with a new empty disk. If you go down that path, you want to keep these VHDs in separate Azure Storage Accounts from the ones that the VHDs with the database files.

A second possibility is to use a large VM that can have many disks attached, for example a D14 with 32VHDs. Use Storage Spaces to build a flexible environment where you could build shares that are used then as backup targets for the different DBMS servers.

Some best practices got documented [here](https://blogs.msdn.com/b/sqlcat/archive/2015/02/26/large-sql-server-database-backup-on-an-azure-vm-and-archiving.aspx) as well. 

### Performance considerations for backups/restores
As in bare-metal deployments, backup/restore performance is dependent on how many volumes can be read in parallel and what the throughput of those volumes might be. In addition, the CPU consumption used by backup compression may play a significant role on VMs with up to eight CPU threads. Therefore, you can assume:

* The fewer the number of disks used to store the data files, the smaller the overall throughput in reading.
* The smaller the number of CPU threads in the VM, the more severe the impact of backup compression.
* The fewer targets (BLOBs, VHDs, or disks) to write the backup to, the lesser the throughput.
* The smaller the VM size, the smaller the storage throughput quota writing and reading from Azure Storage. Independent of whether the backups are directly stored on Azure Blob or whether they are stored in VHDs that again are stored in Azure Blobs.

When using a Microsoft Azure Storage BLOB as the backup target in more recent releases, you are restricted to designating only one URL target for each specific backup.

But when using the "Microsoft SQL Server backup to Microsoft Azure Tool" in older releases, you can define more than one file target. With more than one target, the backup can scale and the throughput of the backup is higher. This would result then in multiple files as well in the Azure Storage account. In the testing, using multiple file destinations you can definitely achieve the throughput, which you could achieve with the backup extensions implemented in from SQL Server 2012 SP1 CU4 on. You also are not blocked by the 1TB limit as in the native backup into Azure.

However, keep in mind, the throughput also is dependent on the location of the Azure Storage Account you use for the backup. An idea might be to locate the storage account in a different region than the VMs are running in. For example you would run the VM configuration in Western Europe, but put the Storage Account that you use to backup against in Northern Europe. That certainly has an impact on the backup throughput and is not likely to generate a throughput of 150MB/sec as it seems to be possible in cases where the target storage and the VMs are running in the same regional datacenter.

### Managing backup BLOBs
There is a requirement to manage the backups on your own. Since the expectation is that many blobs are created by executing frequent transaction log backups, administration of those blobs easily can overburden the Azure portal. Therefore, it is recommendable to leverage an Azure storage explorer. There are several good ones available, which can help to manage an Azure storage account

* Microsoft Visual Studio with Azure SDK installed (<https://azure.microsoft.com/downloads/>)
* Microsoft Azure Storage Explorer (<https://azure.microsoft.com/downloads/>)
* Third party tools

For a more complete discussion of backup and SAP on Azure, refer to [the SAP Backup Guide](sap-hana-backup-guide.md) for more information.

## <a name="1b353e38-21b3-4310-aeb6-a77e7c8e81c8"></a>Using a SQL Server image out of the Microsoft Azure Marketplace
Microsoft offers VMs in the Azure Marketplace, which already contain versions of SQL Server. For SAP customers who require licenses for SQL Server and Windows, this might be an opportunity to basically cover the need for licenses by spinning up VMs with SQL Server already installed. In order to use such images for SAP, the following considerations need to be made:

* The SQL Server non-Evaluation versions acquire higher costs than a 'Windows-only' VM deployed from Azure Marketplace. See these articles to compare prices: <https://azure.microsoft.com/pricing/details/virtual-machines/windows/> and <https://azure.microsoft.com/pricing/details/virtual-machines/sql-server-enterprise/>. 
* You only can use SQL Server releases, which are supported by SAP, like SQL Server 2012.
* The collation of the SQL Server instance, which is installed in the VMs offered in the Azure Marketplace is not the collation SAP NetWeaver requires the SQL Server instance to run. You can change the collation though with the directions in the following section.

### Changing the SQL Server Collation of a Microsoft Windows/SQL Server VM
Since the SQL Server images in the Azure Marketplace are not set up to use the collation, which is required by SAP NetWeaver applications, it needs to be changed immediately after the deployment. For SQL Server 2012, this can be done with the following steps as soon as the VM has been deployed and an administrator is able to log into the deployed VM:

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

If this is not the result, STOP deploying SAP and investigate why the setup command did not work as expected. Deployment of SAP NetWeaver applications onto SQL Server instance with different SQL Server codepages than the one mentioned above is **NOT** supported.

## SQL Server High-Availability for SAP in Azure
As mentioned earlier in this paper, there is no possibility to create shared storage, which is necessary for the usage of the oldest SQL Server high availability functionality. This functionality would install two or more SQL Server instances in a Windows Server Failover Cluster (WSFC) using a shared disk for the user databases (and eventually tempdb). This is the long time standard high availability method, which also is supported by SAP. Because Azure doesn't support shared storage, SQL Server high availability configurations with a shared disk cluster configuration cannot be realized. However, many other high availability methods are still possible and are described in the following sections.

### SQL Server Log Shipping
One of the methods of high availability (HA) is SQL Server Log Shipping. If the VMs participating in the HA configuration have working name resolution, there is no problem and the setup in Azure does not differ from any setup that is done on-premises. It is not recommended to rely on IP resolution only. With regards to setting up Log Shipping and the principles around Log Shipping, check this documentation:

<https://docs.microsoft.com/sql/database-engine/log-shipping/about-log-shipping-sql-server>

In order to achieve any high availability, one needs to deploy the VMs, which are within such a Log Shipping configuration to be within the same Azure Availability Set.

### Database Mirroring
Database Mirroring as supported by SAP (see SAP Note [965908]) relies on defining a failover partner in the SAP connection string. For the Cross-Premises cases, we assume that the two VMs are in the same domain and that the user context the two SQL Server instances are running under a domain user as well and have sufficient privileges in the two SQL Server instances involved. Therefore, the setup of Database Mirroring in Azure does not differ between a typical on-premises setup/configuration.

As of Cloud-Only deployments, the easiest method is to have another domain setup in Azure to have those DBMS VMs (and ideally dedicated SAP VMs) within one domain.

If a domain is not possible, one can also use certificates for the database mirroring endpoints as described here: <https://docs.microsoft.com/sql/database-engine/database-mirroring/use-certificates-for-a-database-mirroring-endpoint-transact-sql>

A tutorial to set up Database Mirroring in Azure can be found here: <https://docs.microsoft.com/sql/database-engine/database-mirroring/database-mirroring-sql-server> 

### SQL Server Always On
As Always On is supported for SAP on-premises (see SAP Note [1772688]), it is supported to be used in combination with SAP in Azure. The fact that you are not able to create shared disks in Azure doesn't mean that one can't create an Always On Windows Server Failover Cluster (WSFC) configuration between different VMs. It only means that you do not have the possibility to use a shared disk as a quorum in the cluster configuration. Hence you can build an Always On WSFC configuration in Azure and not select the quorum type that utilizes shared disk. The Azure environment those VMs are deployed in should resolve the VMs by name and the VMs should be in the same domain. This is true for Azure only and Cross-Premises deployments. There are some special considerations around deploying the SQL Server Availability Group Listener (not to be confused with the Azure Availability Set) since Azure at this point in time does not allow to create an AD/DNS object as it is possible on-premises. Therefore, some different installation steps are necessary to overcome the specific behavior of Azure.

Some considerations using an Availability Group Listener are:

* Using an Availability Group Listener is only possible with Windows Server 2012 or higher as guest OS of the VM. For Windows Server 2012 you need to make sure that this patch is applied: <https://support.microsoft.com/kb/2854082> 
* For Windows Server 2008 R2, this patch does not exist and Always On would need to be used in the same manner as Database Mirroring by specifying a failover partner in the connections string (done through the SAP default.pfl parameter dbs/mss/server - see SAP Note [965908]).
* When using an Availability Group Listener, the Database VMs need to be connected to a dedicated Load Balancer. Name resolution in Cloud-Only deployments would either require all VMs of an SAP system (application servers, DBMS server, and (A)SCS server) are in the same virtual network or would require from an SAP application layer the maintenance of the etc\host file in order to get the VM names of the SQL Server VMs resolved. In order to avoid that Azure is assigning new IP addresses in cases where both VMs incidentally are shutdown, one should assign static IP addresses to the network interfaces of those VMs in the Always On configuration (defining a static IP address is described in [this][virtual-networks-reserved-private-ip] article)

[comment]: <> (Old blogs)
[comment]: <> (<https://blogs.msdn.com/b/alwaysonpro/archive/2014/08/29/recommendations-and-best-practices-when-deploying-sql-server-alwayson-availability-groups-in-windows-azure-iaas.aspx>, <https://blogs.technet.com/b/rmilne/archive/2015/07/27/how-to-set-static-ip-on-azure-vm.aspx>) 
* There are special steps required when building the WSFC cluster configuration where the cluster needs a special IP address assigned, because Azure with its current functionality would assign the cluster name the same IP address as the node the cluster is created on. This means a manual step must be performed to assign a different IP address to the cluster.
* The Availability Group Listener is going to be created in Azure with TCP/IP endpoints, which are assigned to the VMs running the primary and secondary replicas of the Availability group.
* There might be a need to secure these endpoints with ACLs.

[comment]: <> (TODO old blog)
[comment]: <> (The detailed steps and necessities of installing an AlwaysOn configuration on Azure are best experienced when walking through the tutorial available [here][virtual-machines-windows-classic-ps-sql-alwayson-availability-groups])
[comment]: <> (Preconfigured AlwaysOn setup via the Azure gallery <https://blogs.technet.com/b/dataplatforminsider/archive/2014/08/25/sql-server-alwayson-offering-in-microsoft-azure-portal-gallery.aspx>)
[comment]: <> (Creating an Availability Group Listener is best described in [this][virtual-machines-windows-classic-ps-sql-int-listener] tutorial)
[comment]: <> (Securing network endpoints with ACLs are explained best here:)
[comment]: <> (*    <https://michaelwasham.com/windows-azure-powershell-reference-guide/network-access-control-list-capability-in-windows-azure-powershell/>)
[comment]: <> (*    <https://blogs.technet.com/b/heyscriptingguy/archive/2013/08/31/weekend-scripter-creating-acls-for-windows-azure-endpoints-part-1-of-2.aspx> )
[comment]: <> (*    <https://blogs.technet.com/b/heyscriptingguy/archive/2013/09/01/weekend-scripter-creating-acls-for-windows-azure-endpoints-part-2-of-2.aspx>)  
[comment]: <> (*    <https://blogs.technet.com/b/heyscriptingguy/archive/2013/09/18/creating-acls-for-windows-azure-endpoints.aspx>) 

It is possible to deploy a SQL Server Always On Availability Group over different Azure Regions as well. This functionality leverages the Azure VNet-to-Vnet connectivity ([more details][virtual-networks-configure-vnet-to-vnet-connection]).

[comment]: <> (TODO old blog)
[comment]: <> (The setup of SQL Server AlwaysOn Availability Groups in such a scenario is described here: <https://blogs.technet.com/b/dataplatforminsider/archive/2014/06/19/sql-server-alwayson-availability-groups-supported-between-microsoft-azure-regions.aspx>.) 

### Summary on SQL Server High Availability in Azure
Given the fact that Azure Storage is protecting the content, there is one less reason to insist on a hot-standby image. This means your High Availability scenario needs to only protect against the following cases:

* Unavailability of the VM as a whole due to maintenance on the server cluster in Azure or other reasons
* Software issues in the SQL Server instance
* Protecting from manual error where data gets deleted and point-in-time recovery is needed

Looking at matching technologies one can argue that the first two cases can be covered by Database Mirroring or Always On, whereas the third case only can be covered by Log-Shipping.

You need to balance the more complex setup of Always On, compared to Database Mirroring, with the advantages of Always On. Those advantages can be listed like:

* Readable secondary replicas.
* Backups from secondary replicas.
* Better scalability.
* More than one secondary replicas.

## <a name="9053f720-6f3b-4483-904d-15dc54141e30"></a>General SQL Server for SAP on Azure Summary
There are many recommendations in this guide and we recommend you read it more than once before planning your Azure deployment. In general, though, be sure to follow the top ten general DBMS on Azure specific points:

[comment]: <> (2.3 higher throughput than what? Than one VHD?)
1. Use the latest DBMS release, like SQL Server 2014, that has the most advantages in Azure. For SQL Server, this is SQL Server 2012 SP1 CU4, which would include the feature of backing up against Azure Storage. However, in conjunction with SAP it is recommended to use least SQL Server 2014 SP1 CU1 or SQL Server 2012 SP2 and the latest CU.
2. Carefully plan your SAP system landscape in Azure to balance the data file layout and Azure restrictions:
   * Don't have too many disks, but have enough to ensure you can reach your required IOPS.
   * If you don't use Managed Disks, remember that IOPS are also limited per Azure Storage Account and that Storage Accounts are limited within each Azure subscription ([more details][azure-subscription-service-limits]). 
   * Only stripe across disks if you need to achieve a higher throughput.
3. Never install software or put any files that require persistence on the D:\ drive as it is non-permanent and anything on this drive is lost at a Windows reboot.
4. Don't use disk caching for Azure Standard Storage.
5. Don't use Azure geo-replicated Storage Accounts.  Use Locally Redundant for DBMS workloads.
6. Use your DBMS vendor's HA/DR solution to replicate database data.
7. Always use Name Resolution, don't rely on IP addresses.
8. Use the highest database compression possible. Which is page compression for SQL Server.
9. Be careful using SQL Server images from the Azure Marketplace. If you use the SQL Server one, you must change the instance collation before installing any SAP NetWeaver system on it.
10. Install and configure the SAP Host Monitoring for Azure as described in [Deployment Guide][deployment-guide].