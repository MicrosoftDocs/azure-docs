---
title: 'SAP on Azure: Planning and Implementation Guide'
description: Azure Virtual Machines planning and implementation for SAP NetWeaver
services: virtual-machines-linux,virtual-machines-windows
documentationcenter: ''
author: MSSedusch
manager: juergent
editor: ''
tags: azure-resource-manager
keywords: ''

ms.assetid: d7c59cc1-b2d0-4d90-9126-628f9c7a5538
ms.service: virtual-machines-linux

ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 06/23/2020
ms.author: juergent
ms.custom: H1Hack27Feb2017
---
# Azure Virtual Machines planning and implementation for SAP NetWeaver

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

[azure-cli]:../../../cli-install-nodejs.md
[azure-portal]:https://portal.azure.com
[azure-ps]:/powershell/azureps-cmdlets-docs
[azure-quickstart-templates-github]:https://github.com/Azure/azure-quickstart-templates
[azure-script-ps]:https://go.microsoft.com/fwlink/p/?LinkID=395017
[azure-resource-manager/management/azure-subscription-service-limits]:../../../azure-resource-manager/management/azure-subscription-service-limits.md
[azure-resource-manager/management/azure-subscription-service-limits-subscription]:../../../azure-resource-manager/management/azure-subscription-service-limits.md#subscription-limits

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

[msdn-set-Azvmaemextension]:https://msdn.microsoft.com/library/azure/mt670598.aspx

[planning-guide]:planning-guide.md  
[planning-guide-1.2]:planning-guide.md#e55d1e22-c2c8-460b-9897-64622a34fdff
[planning-guide-11]:planning-guide.md#7cf991a1-badd-40a9-944e-7baae842a058
[planning-guide-11.4.1]:planning-guide.md#5d9d36f9-9058-435d-8367-5ad05f00de77
[planning-guide-11.5]:planning-guide.md#4e165b58-74ca-474f-a7f4-5e695a93204f
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
[planning-guide-figure-2500]:media/virtual-machines-shared-sap-planning-guide/planning-monitoring-overview-2502.png
[planning-guide-figure-2600]:media/virtual-machines-shared-sap-planning-guide/2600-sap-router-connection.png
[planning-guide-figure-2700]:media/virtual-machines-shared-sap-planning-guide/2700-exposed-sap-portal.png
[planning-guide-figure-2800]:media/virtual-machines-shared-sap-planning-guide/2800-endpoint-config.png
[planning-guide-figure-2900]:media/virtual-machines-shared-sap-planning-guide/2900-azure-ha-sap-ha.png
[planning-guide-figure-2901]:media/virtual-machines-shared-sap-planning-guide/2901-azure-ha-sap-ha-md.png
[planning-guide-figure-300]:media/virtual-machines-shared-sap-planning-guide/300-vpn-s2s.png
[planning-guide-figure-3000]:media/virtual-machines-shared-sap-planning-guide/3000-sap-ha-on-azure.png
[planning-guide-figure-3200]:media/virtual-machines-shared-sap-planning-guide/3200-sap-ha-with-sql.png
[planning-guide-figure-3201]:media/virtual-machines-shared-sap-planning-guide/3201-sap-ha-with-sql-md.png
[planning-guide-figure-400]:media/virtual-machines-shared-sap-planning-guide/400-vm-services.png
[planning-guide-figure-600]:media/virtual-machines-shared-sap-planning-guide/600-s2s-details.png
[planning-guide-figure-700]:media/virtual-machines-shared-sap-planning-guide/700-decision-tree-deploy-to-azure.png
[planning-guide-figure-800]:media/virtual-machines-shared-sap-planning-guide/800-portal-vm-overview.png
[planning-guide-microsoft-azure-networking]:planning-guide.md#61678387-8868-435d-9f8c-450b2424f5bd
[planning-guide-storage-microsoft-azure-storage-and-data-disks]:planning-guide.md#a72afa26-4bf4-4a25-8cf7-855d6032157f

[powershell-install-configure]:https://docs.microsoft.com/powershell/azure/install-az-ps
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
[storage-powershell-guide-full-copy-vhd]:../../../storage/common/storage-powershell-guide-full.md
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
[virtual-machines-linux-cli-deploy-templates]:../../linux/cli-deploy-templates.md
[virtual-machines-deploy-rmtemplates-powershell]:../../virtual-machines-windows-ps-manage.md
[virtual-machines-linux-agent-user-guide]:../../extensions/agent-linux.md
[virtual-machines-linux-agent-user-guide-command-line-options]:../../extensions/agent-windows.md#command-line-options
[virtual-machines-linux-capture-image]:../../linux/capture-image.md
[virtual-machines-linux-capture-image-resource-manager]:../../linux/capture-image.md
[virtual-machines-linux-capture-image-resource-manager-capture]:../../linux/capture-image.md#step-2-capture-the-vm
[virtual-machines-windows-capture-image-resource-manager]:../../windows/capture-image.md
[virtual-machines-windows-capture-image]:../../virtual-machines-windows-generalize-vhd.md
[virtual-machines-windows-capture-image-prepare-the-vm-for-image-capture]:../../virtual-machines-windows-generalize-vhd.md
[virtual-machines-linux-configure-raid]:../../linux/configure-raid.md
[virtual-machines-linux-configure-lvm]:../../linux/configure-lvm.md
[virtual-machines-linux-classic-create-upload-vhd-step-1]:../../virtual-machines-linux-classic-create-upload-vhd.md#step-1-prepare-the-image-to-be-uploaded
[virtual-machines-linux-create-upload-vhd-suse]:../../linux/suse-create-upload-vhd.md
[virtual-machines-linux-create-upload-vhd-oracle]:../../linux/oracle-create-upload-vhd.md
[virtual-machines-linux-redhat-create-upload-vhd]:../../linux/redhat-create-upload-vhd.md
[virtual-machines-linux-how-to-attach-disk]:../../linux/add-disk.md
[virtual-machines-linux-how-to-attach-disk-how-to-initialize-a-new-data-disk-in-linux]:../../linux/add-disk.md#connect-to-the-linux-vm-to-mount-the-new-disk
[virtual-machines-linux-tutorial]:../../linux/quick-create-cli.md
[virtual-machines-linux-update-agent]:../../linux/update-agent.md
[virtual-machines-manage-availability]:../../linux/manage-availability.md
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
[virtual-machines-workload-template-sql-alwayson]:https://azure.microsoft.com/documentation/templates/sql-server-2014-alwayson-dsc/
[virtual-network-deploy-multinic-arm-cli]:../../linux/multiple-nics.md
[virtual-network-deploy-multinic-arm-ps]:../../windows/multiple-nics.md
[virtual-network-deploy-multinic-arm-template]:../../../virtual-network/template-samples.md
[virtual-networks-configure-vnet-to-vnet-connection]:../../../vpn-gateway/vpn-gateway-vnet-vnet-rm-ps.md
[virtual-networks-create-vnet-arm-pportal]:../../../virtual-network/manage-virtual-network.md#create-a-virtual-network
[virtual-networks-manage-dns-in-vnet]:../../../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md
[virtual-networks-multiple-nics-windows]:../../windows/multiple-nics.md
[virtual-networks-multiple-nics-linux]:../../linux/multiple-nics.md
[virtual-networks-nsg]:../../../virtual-network/security-overview.md
[virtual-networks-reserved-private-ip]:../../../virtual-network/virtual-networks-static-private-ip-arm-ps.md
[virtual-networks-static-private-ip-arm-pportal]:../../../virtual-network/virtual-networks-static-private-ip-arm-pportal.md
[virtual-networks-udr-overview]:../../../virtual-network/virtual-networks-udr-overview.md
[vpn-gateway-about-vpn-devices]:../../../vpn-gateway/vpn-gateway-about-vpn-devices.md
[vpn-gateway-create-site-to-site-rm-powershell]:../../../vpn-gateway/vpn-gateway-create-site-to-site-rm-powershell.md
[vpn-gateway-cross-premises-options]:../../../vpn-gateway/vpn-gateway-about-vpngateways.md
[vpn-gateway-site-to-site-create]:../../../vpn-gateway/vpn-gateway-site-to-site-create.md
[vpn-gateway-vpn-faq]:../../../vpn-gateway/vpn-gateway-vpn-faq.md
[xplat-cli]:../../../cli-install-nodejs.md
[xplat-cli-azure-resource-manager]:../../../xplat-cli-azure-resource-manager.md
[capture-image-linux-step-2-create-vm-image]:../../linux/capture-image.md#step-2-create-vm-image



Microsoft Azure enables companies to acquire compute and storage resources in minimal time without lengthy procurement cycles. Azure Virtual Machine service allows companies to deploy classical applications, like SAP NetWeaver based applications into Azure and extend their reliability and availability without having further resources available on-premises. Azure Virtual Machine Services also supports cross-premises connectivity, which enables companies to actively integrate Azure Virtual Machines into their on-premises domains, their Private Clouds and their SAP System Landscape.
This white paper describes the fundamentals of Microsoft Azure Virtual Machine and provides a walk-through of planning and implementation considerations for SAP NetWeaver installations in Azure and as such should be the document to read before starting actual deployments of SAP NetWeaver on Azure.
The paper complements the SAP Installation Documentation and SAP Notes, which represent the primary resources for installations and deployments of SAP software on given platforms.

[!INCLUDE [updated-for-az](../../../../includes/updated-for-az.md)]

## Summary
Cloud Computing is a widely used term, which is gaining more and more importance within the IT industry, from small companies up to large and multinational corporations.

Microsoft Azure is the Cloud Services Platform from Microsoft, which offers a wide spectrum of new possibilities. Now customers are able to rapidly provision and de-provision applications as a service in the cloud, so they are not limited to technical or budgeting restrictions. Instead of investing time and budget into hardware infrastructure, companies can focus on the application, business processes, and its benefits for customers and users.

With Microsoft Azure Virtual Machine Services, Microsoft offers a comprehensive Infrastructure as a Service (IaaS) platform. SAP NetWeaver based applications are supported on Azure Virtual Machines (IaaS). This whitepaper describes how to plan and implement SAP NetWeaver based applications within Microsoft Azure as the platform of choice.

The paper itself focuses on two main aspects:

* The first part describes two supported deployment patterns for SAP NetWeaver based applications on Azure. It also describes general handling of Azure with SAP deployments in mind.
* The second part details implementing the different scenarios described in the first part.

For additional resources, see chapter [Resources][planning-guide-1.2] in this document.

### Definitions upfront
Throughout the document, we use the following terms:

* IaaS: Infrastructure as a Service
* PaaS: Platform as a Service
* SaaS: Software as a Service
* SAP Component: an individual SAP application such as ECC, BW, Solution Manager, or S/4HANA.  SAP components can be based on traditional ABAP or Java technologies or a non-NetWeaver based application such as Business Objects.
* SAP Environment: one or more SAP components logically grouped to perform a business function such as Development, QAS, Training, DR, or Production.
* SAP Landscape: This term refers to the entire SAP assets in a customer's IT landscape. The SAP landscape includes all production and non-production environments.
* SAP System: The combination of DBMS layer and application layer of, for example, an SAP ERP development system, SAP BW test system, SAP CRM production system, etc. In Azure deployments, it is not supported to divide these two layers between on-premises and Azure. Means an SAP system is either deployed on-premises or it is deployed in Azure. However, you can deploy the different systems of an SAP landscape into either Azure or on-premises. For example, you could deploy the SAP CRM development and test systems in Azure but the SAP CRM production system on-premises.
* Cross-premises or hybrid: Describes a scenario where VMs are deployed to an Azure subscription that has site-to-site, multi-site, or ExpressRoute connectivity between the on-premises datacenter(s) and Azure. In common Azure documentation, these kinds of deployments are also described as cross-premises or hybrid scenarios. The reason for the connection is to extend on-premises domains, on-premises Active Directory/OpenLDAP, and on-premises DNS into Azure. The on-premises landscape is extended to the Azure assets of the subscription. Having this extension, the VMs can be part of the on-premises domain. Domain users of the on-premises domain can access the servers and can run services on those VMs (like DBMS services). Communication and name resolution between VMs deployed on-premises and Azure deployed VMs is possible. This is the most common and nearly exclusive case deploying SAP assets into Azure. For more information, see [this][vpn-gateway-cross-premises-options] article and [this][vpn-gateway-site-to-site-create].
* Azure Monitoring Extension, Enhanced Monitoring, and Azure Extension for SAP: Describe one and the same item. It describes a VM extension that needs to be deployed by you to provide some basic data about the Azure infrastructure to the SAP Host Agent. SAP in SAP notes might refer to it as Monitoring Extension or Enhanced monitoring. In Azure, we are referring to it as **Azure Extension for SAP**.

> [!NOTE]
> Cross-premises or hybrid deployments of SAP systems where Azure Virtual Machines running SAP systems are members of an on-premises domain are supported for production SAP systems. Cross-premises  or hybrid configurations are supported for deploying parts or complete SAP landscapes into Azure. Even running the complete SAP landscape in Azure requires having those VMs being part of on-premises domain and ADS/OpenLDAP. 
>
>



### <a name="e55d1e22-c2c8-460b-9897-64622a34fdff"></a>Resources
The entry point for SAP workload on Azure documentation is found [here](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/get-started). Starting with this entry point you find many articles that cover the topics of:

- SAP NetWeaver and Business One on Azure
- SAP DBMS guides for various DBMS systems in Azure
- High availability and disaster recovery for SAP workload on Azure
- Specific guidance for running SAP HANA on Azure
- Guidance specific to Azure HANA Large Instances for the SAP HANA DBMS 


> [!IMPORTANT]
> Wherever possible a link to the referring SAP Installation Guides or other SAP documentation is used (Reference InstGuide-01, see <http://service.sap.com/instguides>). When it comes to the prerequisites, installation process, or details of specific SAP functionality the SAP documentation and guides should always be read carefully, as the Microsoft documents only covers specific tasks for SAP software installed and operated in a Microsoft Azure Virtual Machine.
>
>

The following SAP Notes are related to the topic of SAP on Azure:

| Note number | Title |
| --- | --- |
| [1928533] |SAP Applications on Azure: Supported Products and Sizing |
| [2015553] |SAP on Microsoft Azure: Support Prerequisites |
| [1999351] |Troubleshooting Enhanced Azure Monitoring for SAP |
| [2178632] |Key Monitoring Metrics for SAP on Microsoft Azure |
| [1409604] |Virtualization on Windows: Enhanced Monitoring |
| [2191498] |SAP on Linux with Azure: Enhanced Monitoring |
| [2243692] |Linux on Microsoft Azure (IaaS) VM: SAP license issues |
| [1984787] |SUSE LINUX Enterprise Server 12: Installation notes |
| [2002167] |Red Hat Enterprise Linux 7.x: Installation and Upgrade |
| [2069760] |Oracle Linux 7.x SAP Installation and Upgrade |
| [1597355] |Swap-space recommendation for Linux |

Also read the [SCN Wiki](https://wiki.scn.sap.com/wiki/display/HOME/SAPonLinuxNotes) that contains all SAP Notes for Linux.

General default limitations and maximum limitations of Azure subscriptions can be found in [this article][azure-resource-manager/management/azure-subscription-service-limits-subscription].

## Possible Scenarios
SAP is often seen as one of the most mission-critical applications within enterprises. The architecture and operations of these applications is mostly complex and ensuring that you meet requirements on availability and performance is important.

Thus enterprises have to think carefully about which cloud provider to choose for running such business critical business processes on. Azure is the ideal public cloud platform for business critical SAP applications and business processes. Given the wide variety of Azure infrastructure,  nearly all existing SAP NetWeaver, and S/4HANA systems can be hosted in Azure today. Azure provides VMs with many Terabytes of memory and more than 200 CPUs. Beyond that Azure offers [HANA Large Instances](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-overview-architecture), which allow scale-up HANA deployments of up to 24 TB and SAP HANA scale-out deployments of up to 120 TB. One can state today that nearly all on-premise SAP scenarios can be run in Azure as well. 

For a rough description of the scenarios and some non-supported scenarios, see the document [SAP workload on Azure virtual machine supported scenarios](./sap-planning-supported-configurations.md).

Check these scenarios and some of the conditions that were named as not supported in the referenced documentation throughout the planning and the development of your architecture that you want to deploy into Azure.

Overall the most common deployment pattern is a cross-premises scenario like displayed

![VPN with Site-To-Site Connectivity (cross-premises)][planning-guide-figure-300]

Reason for many customers to apply a cross-premises deployment pattern is that fact that it is most transparent for all applications to extend on-premises into Azure using Azure ExpressRoute and treat Azure as virtual datacenter. As more and more assets are getting moved into Azure, the Azure deployed infrastructure and network infrastructure will grow and the on-premises assets will reduce accordingly. Everything transparent to users and applications.

In order to successfully deploy SAP systems into either Azure IaaS or IaaS in general, it is important to understand the significant differences between the offerings of traditional outsourcers or hosters and IaaS offerings. Whereas the traditional hoster or outsourcer adapts infrastructure (network, storage and server type) to the workload a customer wants to host, it is instead the customer's  or partner's responsibility to characterize the workload and choose the correct Azure components of VMs, storage, and network for IaaS deployments.

In order to gather data for the planning of your deployment into Azure, it is important to:

- Evaluate what SAP products are supported running in Azure VMs
- Evaluate what specific Operating System releases are supported with specific Azure VMs for those SAP products
- Evaluate what DBMS releases are supported for your SAP products with specific Azure VMs
- Evaluate whether some of the required OS/DBMS releases require you to perform SAP release, Support Package upgrade, and kernel upgrades to get to a supported configuration
- Evaluate whether you need to move to different operating systems in order to deploy on Azure.

Details on supported SAP components on Azure, supported Azure infrastructure units and related operating system releases and DBMS releases are explained in the article [What SAP software is supported for Azure deployments](./sap-supported-product-on-azure.md). Results gained out of the evaluation of valid SAP releases, operating system, and DBMS releases have a large impact on the efforts moving SAP systems to Azure. Results out of this evaluation are going to define whether there could be significant preparation efforts in cases where SAP release upgrades or changes of operating systems are needed.


## <a name="be80d1b9-a463-4845-bd35-f4cebdb5424a"></a>Azure Regions
Microsoft's Azure services are collected in Azure regions. An Azure region is a one or a collection out of datacenters that contain the hardware and infrastructure that runs and hosts the different Azure services. This infrastructure includes a large number of nodes that function as compute nodes or storage nodes, or run network functionality. 

For a list of the different Azure regions, check the article [Azure geographies](https://azure.microsoft.com/global-infrastructure/geographies/). Not all the Azure regions offer the same services. Dependent on the SAP product you want to run, and the operating system and DBMS related to it, you can end up in a situation that a certain region does not offer the VM types you require. This is especially true for running SAP HANA, where you usually need VMs of the M/Mv2 VM-series. These VM families are deployed only in a subset of the regions. You can find out what exact VM, types, Azure storage types or, other Azure Services are available in which of the regions with the help of the site [Products available by region](https://azure.microsoft.com/global-infrastructure/services/). As you start your planning and have certain regions in mind as primary region and eventually secondary region, you need to investigate first whether the necessary services are available in those regions. 

### Availability Zones
Several of the Azure regions implemented a concept called Availability Zones. Availability Zones are physically separate locations within an Azure region. Each Availability Zone is made up of one or more datacenters equipped with independent power, cooling, and networking. For example, deploying two VMs across two Availability Zones of Azure, and implementing a high-availability framework for your SAP DBMS system or the SAP Central Services gives you the best SLA in Azure. For this particular virtual machine SLA in Azure, check the latest version of [Virtual Machine SLAs](https://azure.microsoft.com/support/legal/sla/virtual-machines/). Since Azure regions developed and extended rapidly over the last years, the topology of the Azure regions, the number of physical datacenters, the distance among those datacenters, and the distance between Azure Availability Zones can be different. And with that the network latency.

The principle of Availability Zones does not apply to the HANA specific service of [HANA Large Instances](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-overview-architecture). Service Level agreements for HANA Large Instances can be found in the article [SLA for SAP HANA on Azure Large Instances](https://azure.microsoft.com/support/legal/sla/sap-hana-large/) 


### <a name="df49dc09-141b-4f34-a4a2-990913b30358"></a>Fault Domains
Fault Domains represent a physical unit of failure, closely related to the physical infrastructure contained in data centers, and while a physical blade or rack can be considered a Fault Domain, there is no direct one-to-one mapping between the two.

When you deploy multiple Virtual Machines as part of one SAP system in Microsoft Azure Virtual Machine Services, you can influence the Azure Fabric Controller to deploy your application into different Fault Domains, thereby meeting higher requirements of availability SLAs. However, the distribution of Fault Domains over an Azure Scale Unit (collection of hundreds of Compute nodes or Storage nodes and networking) or the assignment of VMs to a specific Fault Domain is something over which you do not have direct control. In order to direct the Azure fabric controller to deploy a set of VMs over different Fault Domains, you need to assign an Azure availability set to the VMs at deployment time. For more information on Azure availability sets, see chapter [Azure availability sets][planning-guide-3.2.3] in this document.


### <a name="fc1ac8b2-e54a-487c-8581-d3cc6625e560"></a>Upgrade Domains
Upgrade Domains represent a logical unit that helps to determine how a VM within an SAP system, that consists of SAP instances running in multiple VMs, is updated. When an upgrade occurs, Microsoft Azure goes through the process of updating these Upgrade Domains one by one. By spreading VMs at deployment time over different Upgrade Domains, you can protect your SAP system partly from potential downtime. In order to force Azure to deploy the VMs of an SAP system spread over different Upgrade Domains, you need to set a specific attribute at deployment time of each VM. Similar to Fault Domains, an Azure Scale Unit is divided into multiple Upgrade Domains. In order to direct the Azure fabric controller to deploy a set of VMs over different Upgrade Domains, you need to assign an Azure Availability Set to the VMs at deployment time. For more information on Azure availability sets, see chapter [Azure availability sets][planning-guide-3.2.3] below.


### <a name="18810088-f9be-4c97-958a-27996255c665"></a>Azure availability sets
Azure Virtual Machines within one Azure availability set are distributed by the Azure Fabric Controller over different Fault and Upgrade Domains. The purpose of the distribution over different Fault and Upgrade Domains is to prevent all VMs of an SAP system from being shut down in the case of infrastructure maintenance or a failure within one Fault Domain. By default, VMs are not part of an availability set. The participation of a VM in an availability set is defined at deployment time or later on by a reconfiguration and redeployment of a VM.

To understand the concept of Azure availability sets and the way availability sets relate to Fault and Upgrade Domains, read [this article][virtual-machines-manage-availability]. 

As you define availability sets and try to mix various VMs of different VM families within one availability set, you may encounter problems that prevent you to include a certain VM type into such an availability set. The reason is that the availability set is bound to scale unit that contains a certain type of compute hosts. And a certain type of compute host can only run certain types of VM families. For example, if you create an availability set and deploy the first VM into the availability set and you choose a VM type of the Esv3 family and then you try to deploy as second VM a VM of the M family, you will be rejected in the second allocation. Reason is that the Esv3 family VMs are not running on the same host hardware as the virtual machines of the M family do. The same problem can occur, when you try to resize VMs and try to move a VM out of the Esv3 family to a VM type of the M family. In the case of resizing to a VM family that can't be hosted on the same host hardware, you need to shut down all VMs in your availability set and resize them to be able to run on the other host machine type. For SLAs of VMs that are deployed within availability set, check the article [Virtual Machine SLAs](https://azure.microsoft.com/support/legal/sla/virtual-machines/). 

The principle of availability set and related update and fault domain does not apply to the HANA specific service of [HANA Large Instances](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-overview-architecture). Service Level agreements for HANA Large Instances can be found in the article [SLA for SAP HANA on Azure Large Instances](https://azure.microsoft.com/support/legal/sla/sap-hana-large/). 

> [!IMPORTANT]
> The concepts of Azure Availability Zones and Azure availability sets are mutually exclusive. That means, you can either deploy a pair or multiple VMs into a specific Availability Zone or an Azure availability set. But not both.

### Azure paired regions
Azure is offering Azure Region pairs where replication of certain data is enabled between these fixed region pairs. The region pairing is documented in the article [Business continuity and disaster recovery (BCDR): Azure Paired Regions](https://docs.microsoft.com/azure/best-practices-availability-paired-regions). As the article describes, the replication of data is tied Azure storage types that can be configured by you to replicate into the paired region. See also the article [Storage redundancy in a secondary region](https://docs.microsoft.com/azure/storage/common/storage-redundancy#redundancy-in-a-secondary-region). The storage types that allow such a replication are storage types, which are not suitable for DBMS workload. As such the usability of the Azure storage replication would be limited to Azure blob storage (like for backup purposes) or other high latency storage scenarios. As you check for paired regions and the services you want to use as your primary or secondary region, you may encounter situations where Azure services and/or VM types you intend to use in your primary region are not available in the paired region. Or you might encounter a situation where the Azure paired region is not acceptable out of data compliance reasons. For those cases, you need to use a non-paired region as secondary/disaster recovery region. In such a case, you need to take care on replication of some of the part of the data that Azure would have replicated yourself. An example on how to replicate your Active Directory and DNS to your disaster recovery region is described in the article [Set up disaster recovery for Active Directory and DNS](https://docs.microsoft.com/azure/site-recovery/site-recovery-active-directory)
 

## Azure virtual machine services
Azure offers a large variety of virtual machines that you can select to deploy. There is no need for up-front technology and infrastructure purchases. The Azure VM service offering simplifies maintaining and operating applications by providing on-demand compute and storage to host, scale, and manage web application and connected applications. Infrastructure management is automated with a platform that is designed for high availability and dynamic scaling to match usage needs with the option of several different pricing models.

![Positioning of Microsoft Azure Virtual Machine Services][planning-guide-figure-400]

With Azure virtual machines, Microsoft is enabling you to deploy custom server images to Azure as IaaS instances. Or you are able to choose from a rich selection of consumable operating system images out of the Azure image gallery.

From an operational perspective, the Azure Virtual Machine Service offers similar experiences as virtual machines deployed on premises. You are responsible for the administration, operations and also the patching of the particular operating system, running in an Azure VM and its applications in that VM. Microsoft is not providing any more services beyond hosting that VM on its Azure infrastructure (Infrastructure as a Service - IaaS). For SAP workload that you as a customer deploy, Microsoft has no offers beyond the IaaS offerings. 

The Microsoft Azure platform is a multi-tenant platform. As a result storage, network, and compute resources that host Azure VMs are, with a few exceptions, shared between tenants. Intelligent throttling and quota logic is used to prevent one tenant from impacting the performance of another tenant (noisy neighbor) in a drastic way. Especially for certifying the Azure platform for SAP HANA, Microsoft needs to prove the resource isolation for cases where multiple VMs can run on the same host on a regular basis to SAP. Though logic in Azure tries to keep variances in bandwidth experienced small, highly shared platforms tend to introduce larger variances in resource/bandwidth availability than customers might experience in their on-premises deployments. The probability that an SAP system on Azure could experience larger variances than in an on-premises system needs to be taken into account.

### Azure virtual machines for SAP workload

For SAP workload, we narrowed down the selection to different VM families that are suitable for SAP workload and SAP HANA workload more specifically. The way how you find the correct VM type and its capability to work through SAP workload is described in the document [What SAP software is supported for Azure deployments](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-supported-product-on-azure). 

> [!NOTE]
> The VM types that are certified for SAP workload, there is no over-provisioning of CPU and memory resources.

Beyond the selection of purely supported VM types, you also need to check whether those VM types are available in a specific region based on the site [Products available by region](https://azure.microsoft.com/global-infrastructure/services/). But more important, you need to evaluate whether:

- CPU and memory resources of different VM types 
- IOPS bandwidth of different VM types
- Network capabilities of different VM types
- Number of disks that can be attached
- Ability to leverage certain Azure storage types

fit your need. Most of that data can be found [here (Linux)][virtual-machines-sizes-linux] and [here (Windows)][virtual-machines-sizes-windows] for a particular VM type.

As pricing model you have several different pricing options that list like:

- Pay as you go
- One year reserved
- Three years reserved
- Spot pricing

The pricing of each of the different offers with different service offers around operating systems and different regions is available on the site [Linux Virtual Machines Pricing](https://azure.microsoft.com/pricing/details/virtual-machines/linux/) and [Windows Virtual Machines Pricing](https://azure.microsoft.com/pricing/details/virtual-machines/windows/). For details and flexibility of one year and three year reserved instances, check these articles:

- [What are Azure Reservations?](https://docs.microsoft.com/azure/cost-management-billing/reservations/save-compute-costs-reservations)
- [Virtual machine size flexibility with Reserved VM Instances](https://docs.microsoft.com/azure/virtual-machines/windows/reserved-vm-instance-size-flexibility)
- [How the Azure reservation discount is applied to virtual machines](https://docs.microsoft.com/azure/cost-management-billing/manage/understand-vm-reservation-charges) 

For more information on spot pricing, read the article [Azure Spot Virtual Machines](https://azure.microsoft.com/pricing/spot/). Pricing of the same VM type can also be different between different Azure regions. For some customers, it was worth to deploy into a less expensive Azure region.

Additionally, Azure offers the concepts of a dedicated host. The dedicated host concept gives you more control on patching cycles that are done by Azure. You can time the patching according to your own schedules. This offer is specifically targeting customers with workload that might not follow the normal cycle of workload. To read up on the concepts of Azure dedicated host offers, read the article [Azure Dedicated Host](https://docs.microsoft.com/azure/virtual-machines/windows/dedicated-hosts). Using this offer is supported for SAP workload and is used by several SAP customers who want to have more control on patching of infrastructure and eventual maintenance plans of Microsoft. For more information on how Microsoft maintains and patches the Azure infrastructure that hosts virtual machines, read the article [Maintenance for virtual machines in Azure](https://docs.microsoft.com/azure/virtual-machines/maintenance-and-updates).

#### Generation 1 and Generation 2 virtual machines
Microsoft's hypervisor is able to handle two different generations of virtual machines. Those formats are called **Generation 1** and **Generation 2**. **Generation 2** was introduced in the year 2012 with Windows Server 2012 hypervisor. Azure started out using Generation 1 virtual machines. As you deploy Azure virtual machines, the default is still to use the Generation 1 format. Meanwhile you can deploy Generation 2 VM formats as well. The article [Support for generation 2 VMs on Azure](https://docs.microsoft.com/azure/virtual-machines/windows/generation-2) lists the Azure VM families that can be deployed as Generation 2 VM. This article also lists the important functional differences of Generation 2 virtual machines as they can run on Hyper-V private cloud and Azure. More important this article also lists functional differences between Generation 1 virtual machines and Generation 2 VMs, as those run in Azure. 

> [!NOTE]
> There are functional differences of Generation 1 and Generation 2 VMs running in Azure. Read the article  [Support for generation 2 VMs on Azure](https://docs.microsoft.com/azure/virtual-machines/windows/generation-2) to see a list of those differences.  
 
Moving an existing VM from one generation to the other generation is not possible. To change the virtual machine generation, you need to deploy a new VM of the generation you desire and re-install the software that you are running in the virtual machine of the generation. This change only affects the base VHD image of the VM and has no impact on the data disks or attached NFS or SMB shares. Data disks, NFS, or SMB shares that originally were assigned to, for example, on a Generation 1 VM. 

> [!NOTE]
> Deploying Mv1 VM family VMs as Generation 2 VMs is possible as of beginning of May 2020. With that a seeming less up and downsizing between Mv1 and Mv2 family VMs is possible.
 

### <a name="a72afa26-4bf4-4a25-8cf7-855d6032157f"></a>Storage: Microsoft Azure Storage and Data Disks
Microsoft Azure Virtual Machines utilize different storage types. When implementing SAP on Azure Virtual Machine Services, it is important to understand the differences between these two main types of storage:

* Non-Persistent, volatile storage.
* Persistent storage.

Azure VMs offer non-persistent disks after a VM is deployed. In case of a VM reboot, all content on those drives will be wiped out. Hence, it is a given that data files and log/redo files of databases should under no circumstances be located on those non-persisted drives. There might be exceptions for some of the databases, where these non-persisted drives could be suitable for tempdb and temp tablespaces. However, avoid using those drives for A-Series VMs since those non-persisted drives are limited in throughput with that VM family. For further details, read the article [Understanding the temporary drive on Windows VMs in Azure](https://blogs.msdn.microsoft.com/mast/2013/12/06/understanding-the-temporary-drive-on-windows-azure-virtual-machines/)

---
> ![Windows][Logo_Windows] Windows
> 
> Drive D:\ in an Azure VM is a non-persisted drive, which is backed by some local disks on the Azure compute node. Because it is non-persisted, this means that any changes made to the content on the D:\ drive is lost when the VM is rebooted. By "any changes",  like files stored, directories created, applications installed, etc.
> 
> ![Linux][Logo_Linux] Linux
> 
> Linux Azure VMs automatically mount a drive at /mnt/resource that is a non-persisted drive backed by local disks on the Azure compute node. Because it is non-persisted, this means that any changes made to content in /mnt/resource are lost when the VM is rebooted. By any changes, like files stored, directories created, applications installed, etc.
> 
> 

#### Azure Storage accounts

When deploying services or VMs in Azure, deployment of VHDs and VM Images are organized in units called Azure Storage Accounts. [Azure storage accounts](https://docs.microsoft.com/azure/storage/common/storage-account-overview) have limitations either in IOPS, throughput, or sizes those can contain. In the past these limitations, which are documented in: 

- [Scalability targets for standard storage accounts](../../../storage/common/scalability-targets-standard-account.md)
- [Scalability targets for premium page blob storage accounts](../../../storage/blobs/scalability-targets-premium-page-blobs.md)

played an important role in planning an SAP deployment in Azure. It was on you to manage the number of persisted disks within a storage account. You needed to manage the storage accounts and eventually create new storage accounts to create more persisted disks. 

In recent years, the introduction of [Azure managed disks](https://docs.microsoft.com/azure/storage/storage-managed-disks-overview) relieved you from those tasks. The recommendation for SAP deployments is to leverage Azure managed disks instead of managing Azure storage accounts yourself. Azure managed disks will distribute disks across different storage accounts, so, that the limits of the individual storage accounts are not exceeded.

Within a storage account, you have a type of a folder concept called 'containers' that can be used to group certain disks into specific containers.

Within Azure, a disk/VHD name follows the following naming connection that needs to provide a unique name for the VHD within Azure:

    http(s)://<storage account name>.blob.core.windows.net/<container name>/<vhd name>

The string above needs to uniquely identify the disk/VHD that is stored on Azure Storage.


#### Azure persisted storage types
Azure offers a variety of persisted storage option that can be used for SAP workload and specific SAP stack components. For more details, read the document  [Azure storage for SAP workloads](./planning-guide-storage.md).


### <a name="61678387-8868-435d-9f8c-450b2424f5bd"></a>Microsoft Azure Networking

Microsoft Azure provides a network infrastructure, which allows the mapping of all scenarios, which we want to realize with SAP software. The capabilities are:

* Access from the outside, directly to the VMs via Windows Terminal Services or ssh/VNC
* Access to services and specific ports used by applications within the VMs
* Internal Communication and Name Resolution between a group of VMs deployed as Azure VMs
* Cross-premises Connectivity between a customer's on-premises network and the Azure network
* Cross Azure Region or data center connectivity between Azure sites

More information can be found here: <https://azure.microsoft.com/documentation/services/virtual-network/>

There are many different possibilities to configure name and IP resolution in Azure. There is also an Azure DNS service, which can be used instead of setting up your own
DNS server. More information can be found in [this article][virtual-networks-manage-dns-in-vnet] and on [this page](https://azure.microsoft.com/services/dns/).

For cross-premises or hybrid scenarios, we are relying on the fact that the on-premises AD/OpenLDAP/DNS has been extended via VPN or private connection to Azure. For certain scenarios as documented here, it might be necessary to have an AD/OpenLDAP replica installed in Azure.

Because networking and name resolution is a vital part of the database deployment for an SAP system, this concept is discussed in more detail in the [DBMS Deployment Guide][dbms-guide].

##### Azure Virtual Networks

By building up an Azure Virtual Network, you can define the address range of the private IP addresses allocated by Azure DHCP functionality. In cross-premises scenarios, the IP address range defined is still allocated using DHCP by Azure. However, Domain Name resolution is done on-premises (assuming that the VMs are a part of an on-premises domain) and hence can resolve addresses beyond different Azure Cloud Services.

Every Virtual Machine in Azure needs to be connected to a Virtual Network.

More details can be found in [this article][resource-groups-networking] and on [this page](https://azure.microsoft.com/documentation/services/virtual-network/).


> [!NOTE]
> By default, once a VM is deployed you cannot change the Virtual Network configuration. The TCP/IP settings must be left to the Azure DHCP server. Default behavior is Dynamic IP assignment.
>
>

The MAC address of the virtual network card may change, for example after resize and the Windows or Linux guest OS picks up the new network card and automatically uses DHCP to assign the IP and DNS addresses in this case.

##### Static IP Assignment
It is possible to assign fixed or reserved IP addresses to VMs within an Azure Virtual Network. Running the VMs in an Azure Virtual Network opens a great possibility to leverage this functionality if needed or required for some scenarios. The IP assignment remains valid throughout the existence of the VM, independent of whether the VM is running or shutdown. As a result, you need to take the overall number of VMs (running and stopped VMs) into account when defining the range of IP addresses for the Virtual Network. The IP address remains assigned either until the VM and its Network Interface is deleted or until the IP address gets de-assigned again. For more information, read [this article][virtual-networks-static-private-ip-arm-pportal].

> [!NOTE]
> You should assign static IP addresses through Azure means to individual vNICs. You should not assign static IP addresses within the guest OS to a vNIC. Some Azure services like Azure Backup Service rely on the fact that at least the primary vNIC is set to DHCP and not to static IP addresses. See also the document [Troubleshoot Azure virtual machine backup](https://docs.microsoft.com/azure/backup/backup-azure-vms-troubleshoot#networking).
>
>

##### Multiple NICs per VM

You can define multiple virtual network interface cards (vNIC) for an Azure Virtual Machine. With the ability to have multiple vNICs you can start to set up network traffic separation where, for example, client traffic is routed through one vNIC and backend traffic is routed through a second vNIC. Dependent on the type of VM there are different limitations for the number of vNICs a VM can have assigned. Exact details, functionality, and restrictions can be found in these articles:

* [Create a Windows VM with multiple NICs][virtual-networks-multiple-nics-windows]
* [Create a Linux VM with multiple NICs][virtual-networks-multiple-nics-linux]
* [Deploy multi NIC VMs using a template][virtual-network-deploy-multinic-arm-template]
* [Deploy multi NIC VMs using PowerShell][virtual-network-deploy-multinic-arm-ps]
* [Deploy multi NIC VMs using the Azure CLI][virtual-network-deploy-multinic-arm-cli]

#### Site-to-Site Connectivity

Cross-premises is Azure VMs and On-Premises linked with a transparent and permanent VPN connection. It is expected to become the most common SAP deployment pattern in Azure. The assumption is that operational procedures and processes with SAP instances in Azure should work transparently. This means you should be able to print out of these systems as well as use the SAP Transport Management System (TMS) to transport changes from a development system in Azure to a test system, which is deployed on-premises. More documentation around site-to-site can be found in [this article][vpn-gateway-create-site-to-site-rm-powershell]

##### VPN Tunnel Device

In order to create a site-to-site connection (on-premises data center to Azure data center), you need to either obtain and configure a VPN device, or use Routing and Remote Access Service (RRAS) which was introduced as a software component with Windows Server 2012.

* [Create a virtual network with a site-to-site VPN connection using PowerShell][vpn-gateway-create-site-to-site-rm-powershell]
* [About VPN devices for Site-to-Site VPN Gateway connections][vpn-gateway-about-vpn-devices]
* [VPN Gateway FAQ][vpn-gateway-vpn-faq]

![Site-to-site connection between on-premises and Azure][planning-guide-figure-600]

The Figure above shows two Azure subscriptions have IP address subranges reserved for usage in Virtual Networks in Azure. The connectivity from the on-premises network to Azure is established via VPN.

#### Point-to-Site VPN

Point-to-site VPN requires every client machine to connect with its own VPN into Azure. For the SAP scenarios, we are looking at, point-to-site connectivity is not practical. Therefore, no further references are given to point-to-site VPN connectivity.

More information can be found here
* [Configure a Point-to-Site connection to a VNet using the Azure portal](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-howto-point-to-site-resource-manager-portal)
* [Configure a Point-to-Site connection to a VNet using PowerShell](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-howto-point-to-site-rm-ps)

#### Multi-Site VPN

Azure also nowadays offers the possibility to create Multi-Site VPN connectivity for one Azure subscription. Previously a single subscription was limited to one site-to-site VPN connection. This limitation went away with Multi-Site VPN connections for a single subscription. This makes it possible to leverage more than one Azure Region for a specific subscription through cross-premises configurations.

For more documentation, see [this article][vpn-gateway-create-site-to-site-rm-powershell]

#### VNet to VNet Connection

Using Multi-Site VPN, you need to configure a separate Azure Virtual Network in each of the regions. However often you have the requirement that the software components in the different regions should communicate with each other. Ideally this communication should not be routed from one Azure Region to on-premises and from there to the other Azure Region. To shortcut, Azure offers the possibility to configure a connection from one Azure Virtual Network in one region to another Azure Virtual Network hosted in another region. This functionality is called VNet-to-VNet connection. More details on this functionality can be found here:
<https://azure.microsoft.com/documentation/articles/vpn-gateway-vnet-vnet-rm-ps/>.

#### Private Connection to Azure ExpressRoute

Microsoft Azure ExpressRoute allows the creation of private connections between Azure data centers and either the customer's on-premises infrastructure or in a co-location environment. ExpressRoute is offered by various MPLS (packet switched) VPN providers or other Network Service Providers. ExpressRoute connections do not go over the public Internet. ExpressRoute connections offer higher security, more reliability through multiple parallel circuits, faster speeds, and lower latencies than typical connections over the Internet.

Find more details on Azure ExpressRoute and offerings here:

* <https://azure.microsoft.com/documentation/services/expressroute/>
* <https://azure.microsoft.com/pricing/details/expressroute/>
* <https://azure.microsoft.com/documentation/articles/expressroute-faqs/>

Express Route enables multiple Azure subscriptions through one ExpressRoute circuit as documented here

* <https://azure.microsoft.com/documentation/articles/expressroute-howto-linkvnet-arm/>
* <https://azure.microsoft.com/documentation/articles/expressroute-howto-circuit-arm/>

#### Forced tunneling in case of cross-premises
For VMs joining on-premises domains through site-to-site, point-to-site, or ExpressRoute, you need to make sure that the Internet proxy settings are getting deployed for all the users in those VMs as well. By default, software running in those VMs or users using a browser to access the internet would not go through the company proxy, but would connect straight through Azure to the internet. But even the proxy setting is not a 100% solution to direct the traffic through the company proxy since it is responsibility of software and services to check for the proxy. If software running in the VM is not doing that or an administrator manipulates the settings, traffic to the Internet can be detoured again directly through Azure to the Internet.

In order to avoid such a direct internet connectivity, you can configure Forced Tunneling with site-to-site connectivity between on-premises and Azure. The detailed description of the Forced Tunneling feature is published here
<https://azure.microsoft.com/documentation/articles/vpn-gateway-forced-tunneling-rm/>

Forced Tunneling with ExpressRoute is enabled by customers advertising a default route via the ExpressRoute BGP peering sessions.

#### Summary of Azure networking

This chapter contained many important points about Azure Networking. Here is a summary of the main points:

* Azure Virtual Networks allow you to put a network structure into your Azure deployment. VNets can be isolated against each other or with the help of Network Security Groups traffic between VNets can be controlled.
* Azure Virtual Networks can be leveraged to assign IP address ranges to VMs or assign fixed IP addresses to VMs
* To set up a Site-To-Site or Point-To-Site connection you need to create an Azure Virtual Network first
* Once a virtual machine has been deployed, it is no longer possible to change the Virtual Network assigned to the VM

### Quotas in Azure virtual machine services
We need to be clear about the fact that the storage and network infrastructure is shared between VMs running a variety of services in the Azure infrastructure. As in the customer's own data centers, over-provisioning of some of the infrastructure resources does take place to a degree. The Microsoft Azure Platform uses disk, CPU, network, and other quotas to limit the resource consumption and to preserve consistent and deterministic performance.  The different VM types (A5, A6, etc.) have different quotas for the number of disks, CPU, RAM, and Network.

> [!NOTE]
> CPU and memory resources of the VM types supported by SAP are pre-allocated on the host nodes. This means that once the VM is deployed, the resources on the host are available as defined by the VM type.
>
>

When planning and sizing SAP on Azure solutions, the quotas for each virtual machine size must be considered. The VM quotas are described [here (Linux)][virtual-machines-sizes-linux] and [here (Windows)][virtual-machines-sizes-windows].

The quotas described represent the theoretical maximum values.  The limit of IOPS per disk may be achieved with small I/Os (8 KB) but possibly may not be achieved with large I/Os (1 MB).  The IOPS limit is enforced on the granularity of single disk.

As a rough decision tree to decide whether an SAP system fits into Azure Virtual Machine Services and its capabilities or whether an existing system needs to be configured differently in order to deploy the system on Azure, the decision tree below can be used:

![Decision tree to decide ability to deploy SAP on Azure][planning-guide-figure-700]

1. The most important information to start with is the SAPS requirement for a given SAP system. The SAPS requirements need to be separated out into the DBMS part and the SAP application part, even if the SAP system is already deployed on-premises in a 2-tier configuration. For existing systems, the SAPS related to the hardware in use often can be determined or estimated based on existing SAP benchmarks. The results can be found [here](https://sap.com/about/benchmark.html). For newly deployed SAP systems, you should have gone through a sizing exercise, which should determine the SAPS requirements of the system. See also this blog and attached document for [SAP sizing on Azure](https://blogs.msdn.com/b/saponsqlserver/archive/2015/12/01/new-white-paper-on-sizing-sap-solutions-on-azure-public-cloud.aspx)
1. For existing systems, the I/O volume and I/O operations per second on the DBMS server should be measured. For newly planned systems, the sizing exercise for the new system also should give rough ideas of the I/O requirements on the DBMS side. If unsure, you eventually need to conduct a Proof of Concept.
1. Compare the SAPS requirement for the DBMS server with the SAPS the different VM types of Azure can provide. The information on SAPS of the different Azure VM types is documented in SAP Note [1928533]. The focus should be on the DBMS VM first since the database layer is the layer in an SAP NetWeaver system that does not scale out in the majority of deployments. In contrast, the SAP application layer can be scaled out. If none of the SAP supported Azure VM types can deliver the required SAPS, the workload of the planned SAP system can't be run on Azure. You either need to deploy the system on-premises or you need to change the workload volume for the system.
1. As documented [here (Linux)][virtual-machines-sizes-linux] and [here (Windows)][virtual-machines-sizes-windows], Azure enforces an IOPS quota per disk independent whether you use Standard Storage or Premium Storage. Dependent on the VM type, the number of data disks, which can be mounted varies. As a result, you can calculate a maximum IOPS number that can be achieved with each of the different VM types. Dependent on the database file layout, you can stripe disks to become one volume in the guest OS. However, if the current IOPS volume of a deployed SAP system exceeds the calculated limits of the largest VM type of Azure and if there is no chance to compensate with more memory, the workload of the SAP system can be impacted severely. In such cases, you can hit a point where you should not deploy the system on Azure.
1. Especially in SAP systems, which are deployed on-premises in 2-Tier configurations, the chances are that the system might need to be configured on Azure in a 3-Tier configuration. In this step, you need to check whether there is a component in the SAP application layer, which can't be scaled out and which would not fit into the CPU and memory resources the different Azure VM types offer. If there indeed is such a component, the SAP system and its workload can't be deployed into Azure. But if you can scale out the SAP application components into multiple Azure VMs, the system can be deployed into Azure.

If the DBMS and SAP application layer components can be run in Azure VMs, the configuration needs to be defined with regard to:

* Number of Azure VMs
* VM types for the individual components
* Number of VHDs in DBMS VM to provide enough IOPS

## Managing Azure assets

### Azure portal

The Azure portal is one of three interfaces to manage Azure VM deployments. The basic management tasks, like deploying VMs from images, can be done through the Azure portal. In addition, the creation of Storage Accounts, Virtual Networks, and other Azure components are also tasks the Azure portal can handle well. However, functionality like uploading VHDs from on-premises to Azure or copying a VHD within Azure are tasks, which require either third-party tools or administration through PowerShell or CLI.

![Microsoft Azure portal - Virtual Machine overview][planning-guide-figure-800]


Administration and configuration tasks for the Virtual Machine instance are possible from within the Azure portal.

Besides restarting and shutting down a Virtual Machine you can also attach, detach, and create data disks for the Virtual Machine instance, to capture the instance for image preparation, and configure the size of the Virtual Machine instance.

The Azure portal provides basic functionality to deploy and configure VMs and many other Azure services. However not all available functionality is covered by the Azure portal. In the Azure portal, it's not possible to perform tasks like:

* Uploading VHDs to Azure
* Copying VMs


### Management via Microsoft Azure PowerShell cmdlets

Windows PowerShell is a powerful and extensible framework that has been widely adopted by customers deploying larger numbers of systems in Azure. After the installation of PowerShell cmdlets on a desktop, laptop or dedicated management station, the PowerShell cmdlets can be run remotely.

The process to enable a local desktop/laptop for the usage of Azure PowerShell cmdlets and how to configure those for the usage with the Azure subscription(s) is described in [this article][powershell-install-configure].

More detailed steps on how to install, update, and configure the Azure PowerShell cmdlets can also be found in [this chapter of the Deployment Guide][deployment-guide-4.1].

Customer experience so far has been that PowerShell (PS) is certainly the more powerful tool to deploy VMs and to create custom steps in the deployment of VMs. All of the customers running SAP instances in Azure are using PS cmdlets to supplement management tasks they do in the Azure portal or are even using PS cmdlets exclusively to manage their deployments in Azure. Since the Azure-specific cmdlets share the same naming convention as the more than 2000 Windows-related cmdlets, it is an easy task for Windows administrators to leverage those cmdlets.

See example here:
<https://blogs.technet.com/b/keithmayer/archive/2015/07/07/18-steps-for-end-to-end-iaas-provisioning-in-the-cloud-with-azure-resource-manager-arm-powershell-and-desired-state-configuration-dsc.aspx>


Deployment of the Azure Extension for SAP (see chapter [Azure Extension for SAP][planning-guide-9.1] in this document) is only possible via PowerShell or CLI. Therefore it is mandatory to set up and configure PowerShell or CLI when deploying or administering an SAP NetWeaver system in Azure.  

As Azure provides more functionality, new PS cmdlets are going to be added that requires an update of the cmdlets. Therefore it makes sense to check the Azure Download site at least once the month <https://azure.microsoft.com/downloads/> for a new version of the cmdlets. The new version is installed on top of the older version.

For a general list of Azure-related PowerShell commands check here: <https://docs.microsoft.com/powershell/azure/overview>.

### Management via Microsoft Azure CLI commands

For customers who use Linux and want to manage Azure resources PowerShell might not be an option. Microsoft offers Azure CLI as an alternative.
The Azure CLI provides a set of open source, cross-platform commands for working with the Azure Platform. The Azure CLI provides much of
the same functionality found in the Azure portal.

For information about installation, configuration and how to use CLI commands to accomplish Azure tasks see

* [Install the Azure classic CLI][xplat-cli]
* [Deploy and manage virtual machines by using Azure Resource Manager templates and the Azure CLI][../../linux/create-ssh-secured-vm-from-template.md]
* [Use the Azure classic CLI for Mac, Linux, and Windows with Azure Resource Manager][xplat-cli-azure-resource-manager]

Also read chapter [Azure CLI for Linux VMs][deployment-guide-4.5.2] in the [Deployment Guide][planning-guide] on how to use Azure CLI to deploy the Azure  Extension for SAP.


## First steps planning a deployment
The first step in deployment planning is NOT to check for VMs available to run SAP. The first step can be one that is time consuming, but most important, is to work with compliance and security teams in your company on what the boundary conditions are for deploying which type of SAP workload or business process into public cloud. If your company deployed other software before into Azure, the process can be easy. If your company is more at the beginning of the journey, there might be larger discussions necessary in order to figure out the boundary conditions, security conditions, that allow certain SAP data and SAP business processes to be hosted in public cloud.

As useful help, you can point to [Microsoft compliance offerings](https://docs.microsoft.com/microsoft-365/compliance/offering-home) for a list of compliance offers Microsoft can provide. 

Other areas of concerns like data encryption for data at rest or other encryption in Azure service is documented in [Azure encryption overview](https://docs.microsoft.com/azure/security/fundamentals/encryption-overview).

Don't underestimate this phase of the project in your planning. Only when you have agreement and rules around this topic, you need to go to the next step, which is the planning of the network architecture that you deploy in Azure.


## Different ways to deploy VMs for SAP in Azure

In this chapter, you learn the different ways to deploy a VM in Azure. Additional preparation procedures, as well as handling of VHDs and VMs in Azure are covered in this chapter.

### Deployment of VMs for SAP

Microsoft Azure offers multiple ways to deploy VMs and associated disks. Thus it is important to understand the differences since preparations of the VMs might differ depending on the method of deployment. In general, we take a look at the following scenarios:

#### <a name="4d175f1b-7353-4137-9d2f-817683c26e53"></a>Moving a VM from on-premises to Azure with a non-generalized disk

You plan to move a specific SAP system from on-premises to Azure. This can be done by uploading the VHD, which contains the OS, the SAP Binaries, and DBMS binaries plus the VHDs with the data and log files of the DBMS to Azure. In contrast to [scenario #2 below][planning-guide-5.1.2], you keep the hostname, SAP SID, and SAP user accounts in the Azure VM as they were configured in the on-premises environment. Therefore, generalizing the image is not necessary. See chapters [Preparation for moving a VM from on-premises to Azure with a non-generalized disk][planning-guide-5.2.1] of this document for on-premises preparation steps and upload of non-generalized VMs or VHDs to Azure. Read chapter [Scenario 3: Moving a VM from on-premises using a non-generalized Azure VHD with SAP][deployment-guide-3.4] in the [Deployment Guide][deployment-guide] for detailed steps of deploying such an image in Azure.

#### <a name="e18f7839-c0e2-4385-b1e6-4538453a285c"></a>Deploying a VM with a customer-specific image

Due to specific patch requirements of your OS or DBMS version, the provided images in the Azure Marketplace might not fit your needs. Therefore, you might need to create a VM using your own private OS/DBMS VM image, which can be deployed several times afterwards. To prepare such a private image for duplication, the following items have to be considered:

---
> ![Windows][Logo_Windows] Windows
>
> See more details here: <https://docs.microsoft.com/azure/virtual-machines/windows/upload-generalized-managed>
> The Windows settings (like Windows SID and hostname) must be abstracted/generalized on the on-premises VM via the sysprep command.
>
>
> ![Linux][Logo_Linux] Linux
>
> Follow the steps described in these articles for [SUSE][virtual-machines-linux-create-upload-vhd-suse], [Red Hat][virtual-machines-linux-redhat-create-upload-vhd], or [Oracle Linux][virtual-machines-linux-create-upload-vhd-oracle], to prepare a VHD to be uploaded to Azure.
>
>

---
If you have already installed SAP content in your on-premises VM (especially for 2-Tier systems), you can adapt the SAP system settings after the deployment of the Azure VM through the instance rename procedure supported by the SAP Software Provisioning Manager (SAP Note [1619720]). See chapters [Preparation for deploying a VM with a customer-specific image for SAP][planning-guide-5.2.2] and [Uploading a VHD from on-premises to Azure][planning-guide-5.3.2] of this document for on-premises preparation steps and upload of a generalized VM to Azure. Read chapter [Scenario 2: Deploying a VM with a custom image for SAP][deployment-guide-3.3] in the [Deployment Guide][deployment-guide] for detailed steps of deploying such an image in Azure.

#### Deploying a VM out of the Azure Marketplace

You would like to use a Microsoft or third-party provided VM image from the Azure Marketplace to deploy your VM. After you deployed your VM in Azure, you follow the same guidelines and tools to install the SAP software and/or DBMS inside your VM as you would do in an on-premises environment. For more detailed deployment description, see chapter [Scenario 1: Deploying a VM out of the Azure Marketplace for SAP][deployment-guide-3.2] in the [Deployment Guide][deployment-guide].

### <a name="6ffb9f41-a292-40bf-9e70-8204448559e7"></a>Preparing VMs with SAP for Azure

Before uploading VMs into Azure, you need to make sure the VMs and VHDs fulfill certain requirements. There are small differences depending on the deployment method that is used.

#### <a name="1b287330-944b-495d-9ea7-94b83aff73ef"></a>Preparation for moving a VM from on-premises to Azure with a non-generalized disk

A common deployment method is to move an existing VM, which runs an SAP system from on-premises to Azure. That VM and the SAP system in the VM just should run in Azure using the same hostname and likely the same SAP SID. In this case, the guest OS of VM should not be generalized for multiple deployments. If the on-premises network got extended into Azure, then even the same domain accounts can be used within the VM as those were used before on-premises.

Requirements when preparing your own Azure VM Disk are:

* Originally the VHD containing the operating system could have a maximum size of 127 GB only. This limitation got eliminated at the end of March 2015. Now the VHD containing the operating system can be up to 1 TB in size as any other Azure Storage hosted VHD as well.
* It needs to be in the fixed VHD format. Dynamic VHDs or VHDs in VHDx format are not yet supported on Azure. Dynamic VHDs will be converted to static VHDs when you upload the VHD with PowerShell commandlets or CLI
* VHDs, which are mounted to the VM and should be mounted again in Azure to the VM need to be in a fixed VHD format as well. Read [this article (Linux)](../../linux/managed-disks-overview.md) and [this article (Windows)](../../windows/managed-disks-overview.md)) for size limits of data disks. Dynamic VHDs will be converted to static VHDs when you upload the VHD with PowerShell commandlets or CLI
* Add another local account with administrator privileges, which can be used by Microsoft support or which can be assigned as context for services and applications to run in until the VM is deployed and more appropriate users can be used.
* Add other local accounts as those might be needed for the specific deployment scenario.

---
> ![Windows][Logo_Windows] Windows
>
> In this scenario no generalization (sysprep) of the VM is required to upload and deploy the VM on Azure.
> Make sure that drive D:\ is not used.
> Set disk automount for attached disks as described in chapter [Setting automount for attached disks][planning-guide-5.5.3] in this document.
>
> ![Linux][Logo_Linux] Linux
>
> In this scenario no generalization (waagent -deprovision) of the VM is required to upload and deploy the VM on Azure.
> Make sure that /mnt/resource is not used and that ALL disks are mounted via uuid. For the OS disk, make sure that the bootloader entry also reflects the uuid-based mount.
>
>

---
#### <a name="57f32b1c-0cba-4e57-ab6e-c39fe22b6ec3"></a>Preparation for deploying a VM with a customer-specific image for SAP

VHD files that contain a generalized OS are stored in containers on Azure Storage Accounts or as Managed Disk images. You can deploy a new VM from such an image by referencing the VHD or Managed Disk image as a source in your deployment template files as described in chapter [Scenario 2: Deploying a VM with a custom image for SAP][deployment-guide-3.3] of the [Deployment Guide][deployment-guide].

Requirements when preparing your own Azure VM Image are:

* Originally the VHD containing the operating system could have a maximum size of 127 GB only. This limitation got eliminated at the end of March 2015. Now the VHD containing the operating system can be up to 1 TB in size as any other Azure Storage hosted VHD as well.
* It needs to be in the fixed VHD format. Dynamic VHDs or VHDs in VHDx format are not yet supported on Azure. Dynamic VHDs will be converted to static VHDs when you upload the VHD with PowerShell commandlets or CLI
* VHDs, which are mounted to the VM and should be mounted again in Azure to the VM need to be in a fixed VHD format as well. Read [this article (Linux)](../../windows/managed-disks-overview.md) and [this article (Windows)](../../linux/managed-disks-overview.md) for size limits of data disks. Dynamic VHDs will be converted to static VHDs when you upload the VHD with PowerShell commandlets or CLI
* Add other local accounts as those might be needed for the specific deployment scenario.
* If the image contains an installation of SAP NetWeaver and renaming of the host name from the original name at the point of the Azure deployment is likely, it is recommended to copy the latest versions of the SAP Software Provisioning Manager DVD into the template. This will enable you to easily use the SAP provided rename functionality to adapt the changed hostname and/or change the SID of the SAP system within the deployed VM image as soon as a new copy is started.

---
> ![Windows][Logo_Windows] Windows
>
> Make sure that drive D:\ is not used
> Set disk automount for attached disks as described in chapter [Setting automount for attached disks][planning-guide-5.5.3] in this document.
>
> ![Linux][Logo_Linux] Linux
>
> Make sure that /mnt/resource is not used and that ALL disks are mounted via uuid. For the OS disk, make sure the bootloader entry also reflects the uuid-based mount.
>
>

---
* SAP GUI (for administrative and setup purposes) can be pre-installed in such a template.
* Other software necessary to run the VMs successfully in cross-premises scenarios can be installed as long as this software can work with the rename of the VM.

If the VM is prepared sufficiently to be generic and eventually independent of accounts/users not available in the targeted Azure deployment scenario, the last preparation step of generalizing such an image is conducted.

##### Generalizing a VM
---
> ![Windows][Logo_Windows] Windows
>
> The last step is to sign in to a VM with an Administrator account. Open a Windows command window as *administrator*. Go to %windir%\windows\system32\sysprep and execute sysprep.exe.
> A small window will appear. It is important to check the **Generalize** option (the default is unchecked) and change the Shutdown Option from its default of 'Reboot' to 'shutdown'. This procedure assumes that the sysprep process is executed on-premises in the Guest OS of a VM.
> If you want to perform the procedure with a VM already running in Azure, follow the steps described in [this article](https://docs.microsoft.com/azure/virtual-machines/windows/capture-image-resource).
>
> ![Linux][Logo_Linux] Linux
>
> [How to capture a Linux virtual machine to use as a Resource Manager template][capture-image-linux-step-2-create-vm-image]
>
>

---
### Transferring VMs and VHDs between on-premises to Azure
Since uploading VM images and disks to Azure is not possible via the Azure portal, you need to use Azure PowerShell cmdlets or CLI. Another possibility is the use of the tool 'AzCopy'. The tool can copy VHDs between on-premises and Azure (in both directions). It also can copy VHDs between Azure Regions. Consult [this documentation][storage-use-azcopy] for download and usage of AzCopy.

A third alternative would be to use various third-party GUI-oriented tools. However, make sure that these tools are supporting Azure Page Blobs. For our purposes, we need to use Azure Page Blob store (the differences are described here: <https://docs.microsoft.com/rest/api/storageservices/Understanding-Block-Blobs--Append-Blobs--and-Page-Blobs>). Also the tools provided by Azure are efficient in compressing the VMs and VHDs, which need to be uploaded. This is important because this efficiency in compression reduces the upload time (which varies anyway depending on the upload link to the internet from the on-premises facility and the Azure deployment region targeted). It is a fair assumption that uploading a VM or VHD from European location to the U.S.-based Azure data centers will take longer than uploading the same VMs/VHDs to the European Azure data centers.

#### <a name="a43e40e6-1acc-4633-9816-8f095d5a7b6a"></a>Uploading a VHD from on-premises to Azure
To upload an existing VM or VHD from the on-premises network such a VM or VHD needs to meet the requirements as listed in chapter [Preparation for moving a VM from on-premises to Azure with a non-generalized disk][planning-guide-5.2.1] of this document.

Such a VM does NOT need to be generalized and can be uploaded in the state and shape it has after shutdown on the on-premises side. The same is true for additional VHDs, which don't contain any operating system.

##### Uploading a VHD and making it an Azure Disk
In this case we want to upload a VHD, either with or without an OS in it, and mount it to a VM as a data disk or use it as OS disk. This is a multi-step process

**PowerShell**

* Sign in to your subscription with *Connect-AzAccount*
* Set the subscription of your context with *Set-AzContext* and parameter SubscriptionId or SubscriptionName - see <https://docs.microsoft.com/powershell/module/az.accounts/set-Azcontext>
* Upload the VHD with *Add-AzVhd* to an Azure Storage Account - see <https://docs.microsoft.com/powershell/module/az.compute/add-Azvhd>
* (Optional) Create a Managed Disk from the VHD with *New-AzDisk*  - see <https://docs.microsoft.com/powershell/module/az.compute/new-Azdisk>
* Set the OS disk of a new VM config to the VHD or Managed Disk with *Set-AzVMOSDisk* - see <https://docs.microsoft.com/powershell/module/az.compute/set-Azvmosdisk>
* Create a new VM from the VM config with *New-AzVM* - see <https://docs.microsoft.com/powershell/module/az.compute/new-Azvm>
* Add a data disk to a new VM with *Add-AzVMDataDisk* - see <https://docs.microsoft.com/powershell/module/az.compute/add-Azvmdatadisk>

**Azure CLI**

* Sign in to your subscription with *az login*
* Select your subscription with *az account set --subscription `<subscription name or id`>*
* Upload the VHD with *az storage blob upload* - see [Using the Azure CLI with Azure Storage][storage-azure-cli]
* (Optional) Create a Managed Disk from the VHD with *az disk create* - see https://docs.microsoft.com/cli/azure/disk
* Create a new VM specifying the uploaded VHD or Managed Disk as OS disk with *az vm create* and parameter *--attach-os-disk*
* Add a data disk to a new VM with *az vm disk attach* and parameter *--new*

**Template**

* Upload the VHD with PowerShell or Azure CLI
* (Optional) Create a Managed Disk from the VHD with PowerShell, Azure CLI, or the Azure portal
* Deploy the VM with a JSON template referencing the VHD as shown in [this example JSON template](https://github.com/Azure/azure-quickstart-templates/blob/master/201-vm-specialized-vhd-new-or-existing-vnet/azuredeploy.json) or using Managed Disks as shown in [this example JSON template](https://github.com/Azure/azure-quickstart-templates/blob/master/sap-2-tier-user-image-md/azuredeploy.json).

#### Deployment of a VM Image
To upload an existing VM or VHD from the on-premises network, in order to use it as an Azure VM image such a VM or VHD need to meet the requirements listed in chapter [Preparation for deploying a VM with a customer-specific image for SAP][planning-guide-5.2.2] of this document.

* Use *sysprep* on Windows or *waagent -deprovision* on Linux to generalize your VM - see [Sysprep Technical Reference](https://technet.microsoft.com/library/cc766049.aspx) for Windows or [How to capture a Linux virtual machine to use as a Resource Manager template][capture-image-linux-step-2-create-vm-image] for Linux
* Sign in to your subscription with *Connect-AzAccount*
* Set the subscription of your context with *Set-AzContext* and parameter SubscriptionId or SubscriptionName - see <https://docs.microsoft.com/powershell/module/az.accounts/set-Azcontext>
* Upload the VHD with *Add-AzVhd* to an Azure Storage Account - see <https://docs.microsoft.com/powershell/module/az.compute/add-Azvhd>
* (Optional) Create a Managed Disk Image from the VHD with *New-AzImage*  - see <https://docs.microsoft.com/powershell/module/az.compute/new-Azimage>
* Set the OS disk of a new VM config to the
  * VHD with *Set-AzVMOSDisk -SourceImageUri -CreateOption fromImage* - see <https://docs.microsoft.com/powershell/module/az.compute/set-Azvmosdisk>
  * Managed Disk Image *Set-AzVMSourceImage* - see <https://docs.microsoft.com/powershell/module/az.compute/set-Azvmsourceimage>
* Create a new VM from the VM config with *New-AzVM* - see <https://docs.microsoft.com/powershell/module/az.compute/new-Azvm>

**Azure CLI**

* Use *sysprep* on Windows or *waagent -deprovision* on Linux to generalize your VM - see [Sysprep Technical Reference](https://technet.microsoft.com/library/cc766049.aspx) for Windows or [How to capture a Linux virtual machine to use as a Resource Manager template][capture-image-linux-step-2-create-vm-image] for Linux
* Sign in to your subscription with *az login*
* Select your subscription with *az account set --subscription `<subscription name or id`>*
* Upload the VHD with *az storage blob upload* - see [Using the Azure CLI with Azure Storage][storage-azure-cli]
* (Optional) Create a Managed Disk Image from the VHD with *az image create* - see https://docs.microsoft.com/cli/azure/image
* Create a new VM specifying the uploaded VHD or Managed Disk Image as OS disk with *az vm create* and parameter *--image*

**Template**

* Use *sysprep* on Windows or *waagent -deprovision* on Linux to generalize your VM - see [Sysprep Technical Reference](https://technet.microsoft.com/library/cc766049.aspx) for Windows or [How to capture a Linux virtual machine to use as a Resource Manager template][capture-image-linux-step-2-create-vm-image] for Linux
* Upload the VHD with PowerShell or Azure CLI
* (Optional) Create a Managed Disk Image from the VHD with PowerShell, Azure CLI, or the Azure portal
* Deploy the VM with a JSON template referencing the image VHD as shown in [this example JSON template](https://github.com/Azure/azure-quickstart-templates/blob/master/201-vm-specialized-vhd-new-or-existing-vnet/azuredeploy.json) or using the Managed Disk Image as shown in [this example JSON template](https://github.com/Azure/azure-quickstart-templates/blob/master/sap-2-tier-user-image-md/azuredeploy.json).

#### Downloading VHDs or Managed Disks to on-premises
Azure Infrastructure as a Service is not a one-way street of only being able to upload VHDs and SAP systems. You can move SAP systems from Azure back into the on-premises world as well.

During the time of the download the VHDs or Managed Disks can't be active. Even when downloading disks, which are mounted to VMs, the VM needs to be shut down and deallocated. If you only want to download the database content, which, then should be used to set up a new system on-premises and if it is acceptable that during the time of the download and the setup of the new system that the system in Azure can still be operational, you could avoid a long downtime by performing a compressed database backup into a disk and just download that disk instead of also downloading the OS base VM.

#### PowerShell

* Downloading a Managed Disk  
  You first need to get access to the underlying blob of the Managed Disk. Then you can copy the underlying blob to a new storage account and download the blob from this storage account.

  ```powershell
  $access = Grant-AzDiskAccess -ResourceGroupName <resource group> -DiskName <disk name> -Access Read -DurationInSecond 3600
  $key = (Get-AzStorageAccountKey -ResourceGroupName <resource group> -Name <storage account name>)[0].Value
  $destContext = (New-AzStorageContext -StorageAccountName <storage account name -StorageAccountKey $key)
  Start-AzStorageBlobCopy -AbsoluteUri $access.AccessSAS -DestContainer <container name> -DestBlob <blob name> -DestContext $destContext
  # Wait for blob copy to finish
  Get-AzStorageBlobCopyState -Container <container name> -Blob <blob name> -Context $destContext
  Save-AzVhd -SourceUri <blob in new storage account> -LocalFilePath <local file path> -StorageKey $key
  # Wait for download to finish
  Revoke-AzDiskAccess -ResourceGroupName <resource group> -DiskName <disk name>
  ```

* Downloading a VHD  
  Once the SAP system is stopped and the VM is shut down, you can use the PowerShell cmdlet `Save-AzVhd` on the on-premises target to download the VHD disks back to the on-premises world. In order to do that, you need the URL of the VHD, which you can find in the 'storage Section' of the Azure portal (need to navigate to the Storage Account and the storage container where the VHD was created) and you need to know where the VHD should be copied to.

  Then you can leverage the command by defining the parameter SourceUri as the URL of the VHD to download and the LocalFilePath as the physical location of the VHD (including its name). The command could look like:

  ```powerhell
  Save-AzVhd -ResourceGroupName <resource group name of storage account> -SourceUri http://<storage account name>.blob.core.windows.net/<container name>/sapidedata.vhd -LocalFilePath E:\Azure_downloads\sapidesdata.vhd
  ```

  For more details of the Save-AzVhd cmdlet, check here <https://docs.microsoft.com/powershell/module/az.compute/save-Azvhd>.

#### Azure CLI
* Downloading a Managed Disk  
  You first need to get access to the underlying blob of the Managed Disk. Then you can copy the underlying blob to a new storage account and download the blob from this storage account.

  ```azurecli
  az disk grant-access --ids "/subscriptions/<subscription id>/resourceGroups/<resource group>/providers/Microsoft.Compute/disks/<disk name>" --duration-in-seconds 3600
  az storage blob download --sas-token "<sas token>" --account-name <account name> --container-name <container name> --name <blob name> --file <local file>
  az disk revoke-access --ids "/subscriptions/<subscription id>/resourceGroups/<resource group>/providers/Microsoft.Compute/disks/<disk name>"
  ```

* Downloading a VHD   
  Once the SAP system is stopped and the VM is shut down, you can use the Azure CLI command `_azure storage blob download_` on the on-premises target to download the VHD disks back to the on-premises world. In order to do that, you need the name and the container of the VHD, which you can find in the 'Storage Section' of the Azure portal (need to navigate to the Storage Account and the storage container where the VHD was created) and you need to know where the VHD should be copied to.

  Then you can leverage the command by defining the parameters blob and container of the VHD to download and the destination as the physical target location of the VHD (including its name). The command could look like:

  ```azurecli
  az storage blob download --name <name of the VHD to download> --container-name <container of the VHD to download> --account-name <storage account name of the VHD to download> --account-key <storage account key> --file <destination of the VHD to download>
  ```

### Transferring VMs and disks within Azure

#### Copying SAP systems within Azure

An SAP system or even a dedicated DBMS server supporting an SAP application layer will likely consist of several disks, which contain either the OS with the binaries or the data and log file(s) of the SAP database. Neither the Azure functionality of copying disks nor the Azure functionality of saving disks to a local disk has a synchronization mechanism, which snapshots multiple disks in a consistent manner. Therefore, the state of the copied or saved disks even if those are mounted against the same VM would be different. This means that in the concrete case of having different data and logfile(s) contained in the different disks, the database in the end would be inconsistent.

**Conclusion: In order to copy or save disks, which are part of an SAP system configuration you need to stop the SAP system and also need to shut down the deployed VM. Only then you can copy or download the set of disks to either create a copy of the SAP system in Azure or on-premises.**

Data disks can be stored as VHD files in an Azure Storage Account and can be directly attached to a virtual machine or be used as an image. In this case, the VHD is copied to another location before being attached to the virtual machine. The full name of the VHD file in Azure must be unique within Azure. As mentioned earlier already, the name is kind of a three-part name that looks like:

    http(s)://<storage account name>.blob.core.windows.net/<container name>/<vhd name>

Data disks can also be Managed Disks. In this case, the Managed Disk is used to create a new Managed Disk before being attached to the virtual machine. The name of the Managed Disk must be unique within a resource group.

##### PowerShell

You can use Azure PowerShell cmdlets to copy a VHD as shown in [this article][storage-powershell-guide-full-copy-vhd]. To create a new Managed Disk, use New-AzDiskConfig and New-AzDisk as shown in the following example.

```powershell
$config = New-AzDiskConfig -CreateOption Copy -SourceUri "/subscriptions/<subscription id>/resourceGroups/<resource group>/providers/Microsoft.Compute/disks/<disk name>" -Location <location>
New-AzDisk -ResourceGroupName <resource group name> -DiskName <disk name> -Disk $config
```

##### Azure CLI

You can use Azure CLI to copy a VHD. To create a new Managed Disk, use *az disk create* as shown in the following example.

```azurecli
az disk create --source "/subscriptions/<subscription id>/resourceGroups/<resource group>/providers/Microsoft.Compute/disks/<disk name>" --name <disk name> --resource-group <resource group name> --location <location>
```

##### Azure Storage tools

* <https://storageexplorer.com/>

Professional editions of Azure Storage Explorers can be found here:

* <https://www.cerebrata.com/>
* <https://clumsyleaf.com/products/cloudxplorer>

The copy of a VHD itself within a storage account is a process, which takes only a few seconds (similar to SAN hardware creating snapshots with lazy copy and
copy on write). After you have a copy of the VHD file, you can attach it to a virtual machine or use it as an image to attach copies of the VHD to virtual machines.

##### PowerShell

```powershell
# attach a vhd to a vm
$vm = Get-AzVM -ResourceGroupName <resource group name> -Name <vm name>
$vm = Add-AzVMDataDisk -VM $vm -Name newdatadisk -VhdUri <path to vhd> -Caching <caching option> -DiskSizeInGB $null -Lun <lun, for example 0> -CreateOption attach
$vm | Update-AzVM

# attach a managed disk to a vm
$vm = Get-AzVM -ResourceGroupName <resource group name> -Name <vm name>
$vm = Add-AzVMDataDisk -VM $vm -Name newdatadisk -ManagedDiskId <managed disk id> -Caching <caching option> -DiskSizeInGB $null -Lun <lun, for example 0> -CreateOption attach
$vm | Update-AzVM

# attach a copy of the vhd to a vm
$vm = Get-AzVM -ResourceGroupName <resource group name> -Name <vm name>
$vm = Add-AzVMDataDisk -VM $vm -Name <disk name> -VhdUri <new path of vhd> -SourceImageUri <path to image vhd> -Caching <caching option> -DiskSizeInGB $null -Lun <lun, for example 0> -CreateOption fromImage
$vm | Update-AzVM

# attach a copy of the managed disk to a vm
$vm = Get-AzVM -ResourceGroupName <resource group name> -Name <vm name>
$diskConfig = New-AzDiskConfig -Location $vm.Location -CreateOption Copy -SourceUri <source managed disk id>
$disk = New-AzDisk -DiskName <disk name> -Disk $diskConfig -ResourceGroupName <resource group name>
$vm = Add-AzVMDataDisk -VM $vm -Caching <caching option> -Lun <lun, for example 0> -CreateOption attach -ManagedDiskId $disk.Id
$vm | Update-AzVM
```

##### Azure CLI

```azurecli

# attach a vhd to a vm
az vm unmanaged-disk attach --resource-group <resource group name> --vm-name <vm name> --vhd-uri <path to vhd>

# attach a managed disk to a vm
az vm disk attach --resource-group <resource group name> --vm-name <vm name> --disk <managed disk id>

# attach a copy of the vhd to a vm
# this scenario is currently not possible with Azure CLI. A workaround is to manually copy the vhd to the destination.

# attach a copy of a managed disk to a vm
az disk create --name <new disk name> --resource-group <resource group name> --location <location of target virtual machine> --source <source managed disk id>
az vm disk attach --disk <new disk name or managed disk id> --resource-group <resource group name> --vm-name <vm name> --caching <caching option> --lun <lun, for example 0>
```

#### <a name="9789b076-2011-4afa-b2fe-b07a8aba58a1"></a>Copying disks between Azure Storage Accounts
This task cannot be performed on the Azure portal. You can use Azure PowerShell cmdlets, Azure CLI, or a third-party storage browser. The PowerShell cmdlets or CLI commands can create and manage blobs, which include the ability to asynchronously copy blobs across Storage Accounts and across regions within the Azure subscription.

##### PowerShell
You can also copy VHDs between subscriptions. For more information, read [this article][storage-powershell-guide-full-copy-vhd].

The basic flow of the PS cmdlet logic looks like this:

* Create a storage account context for the **source** storage account with *New-AzStorageContext* - see <https://docs.microsoft.com/powershell/module/az.storage/new-AzStoragecontext>
* Create a storage account context for the **target** storage account with *New-AzStorageContext* - see <https://docs.microsoft.com/powershell/module/az.storage/new-AzStoragecontext>
* Start the copy with

```powershell
Start-AzStorageBlobCopy -SrcBlob <source blob name> -SrcContainer <source container name> -SrcContext <variable containing context of source storage account> -DestBlob <target blob name> -DestContainer <target container name> -DestContext <variable containing context of target storage account>
```

* Check the status of the copy in a loop with

```powershell
Get-AzStorageBlobCopyState -Blob <target blob name> -Container <target container name> -Context <variable containing context of target storage account>
```

* Attach the new VHD to a virtual machine as described above.

For examples see [this article][storage-powershell-guide-full-copy-vhd].

##### Azure CLI
* Start the copy with

```azurecli
az storage blob copy start --source-blob <source blob name> --source-container <source container name> --source-account-name <source storage account name> --source-account-key <source storage account key> --destination-container <target container name> --destination-blob <target blob name> --account-name <target storage account name> --account-key <target storage account name>
```

* Check the status if the copy is still in a loop with

```azurecli
az storage blob show --name <target blob name> --container <target container name> --account-name <target storage account name> --account-key <target storage account name>
```

* Attach the new VHD to a virtual machine as described above.

### Disk Handling

#### <a name="4efec401-91e0-40c0-8e64-f2dceadff646"></a>VM/disk structure for SAP deployments

Ideally the handling of the structure of a VM and the associated disks should be simple. In on-premises installations, customers developed many ways of structuring a server installation.

* One base disk, which contains the OS and all the binaries of the DBMS and/or SAP. Since March 2015, this disk can be up to 1 TB in size instead of earlier restrictions that limited it to 127 GB.
* One or multiple disks, which contain the DBMS log file of the SAP database and the log file of the DBMS temp storage area (if the DBMS supports this). If the database log IOPS requirements are high, you need to stripe multiple disks in order to reach the IOPS volume required.
* A number of disks containing one or two database files of the SAP database and the DBMS temp data files as well (if the DBMS supports this).

![Reference Configuration of Azure IaaS VM for SAP][planning-guide-figure-1300]


---
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
>
>

```console
ResourceDisk.EnableSwap=y
ResourceDisk.SwapSizeMB=30720
```

To activate the changes, you need to restart the Linux Agent with

```console
sudo service waagent restart
```

Read SAP Note [1597355] for more details on the recommended swap file size

---
The number of disks used for the DBMS data files and the type of Azure Storage these disks are hosted on should be determined by the IOPS requirements and the latency required. Exact quotas are described in [this article (Linux)][virtual-machines-sizes-linux] and [this article (Windows)][virtual-machines-sizes-windows].

Experience of SAP deployments over the last two years taught us some lessons, which can be summarized as:

* IOPS traffic to different data files is not always the same since existing customer systems might have differently sized data files representing their SAP database(s). As a result it turned out to be better using a RAID configuration over multiple disks to place the data files LUNs carved out of those. There were situations, especially with Azure Standard Storage where an IOPS rate hit the quota of a single disk against the DBMS transaction log. In such scenarios, the use of Premium Storage is recommended or alternatively aggregating multiple Standard Storage disks with a software stripe.

---
> ![Windows][Logo_Windows] Windows
>
> * [Performance best practices for SQL Server in Azure Virtual Machines][virtual-machines-sql-server-performance-best-practices]
>
> ![Linux][Logo_Linux] Linux
>
> * [Configure Software RAID on Linux][virtual-machines-linux-configure-raid]
> * [Configure LVM on a Linux VM in Azure][virtual-machines-linux-configure-lvm]
>
>

---
* Premium Storage is showing significant better performance, especially for critical transaction log writes. For SAP scenarios that are expected to deliver production like performance, it is highly recommended to use VM-Series that can leverage Azure Premium Storage.

Keep in mind that the disk, which contains the OS, and as we recommend, the binaries of SAP and the database (base VM) as well, is not anymore limited to 127 GB. It now can have
up to 1 TB in size. This should be enough space to keep all the necessary file including, for example, SAP batch job logs.

For more suggestions and more details, specifically for DBMS VMs, consult the [DBMS Deployment Guide][dbms-guide]

#### Disk Handling

In most scenarios, you need to create additional disks in order to deploy the SAP database into the VM. We talked about the considerations on number of disks in chapter [VM/disk structure for SAP deployments][planning-guide-5.5.1] of this document. The Azure portal allows to attach and detach disks once a base VM is deployed. The disks can be attached/detached when the VM is up and running as well as when it is stopped. When attaching a disk, the Azure portal offers to attach an empty disk or an existing disk, which at this point in time is not attached to another VM.

**Note**: Disks can only be attached to one VM at any given time.

![Attach / detach disks with Azure Standard Storage][planning-guide-figure-1400]

During the deployment of a new virtual machine, you can decide whether you want to use Managed Disks or place your disks on Azure Storage Accounts. If you want to use Premium Storage, we recommend using Managed Disks.

Next, you need to decide whether you want to create a new and empty disk or whether you want to select an existing disk that was uploaded earlier and should be attached to the VM now.

**IMPORTANT**: You **DO NOT** want to use Host Caching with Azure Standard Storage. You should leave the Host Cache preference at the default of NONE. With Azure Premium Storage, you should enable Read Caching if the I/O characteristic is mostly read like typical I/O traffic against database data files. In case of database transaction log file, no caching is recommended.

---
> ![Windows][Logo_Windows] Windows
>
> [How to attach a data disk in the Azure portal][virtual-machines-linux-attach-disk-portal]
>
> If disks are attached, you need to sign in to the VM to open the Windows Disk Manager. If automount is not enabled as recommended in chapter [Setting automount for attached disks][planning-guide-5.5.3], the newly attached volume needs to be taken online and initialized.
>
> ![Linux][Logo_Linux] Linux
>
> If disks are attached, you need to sign in to the VM and initialize the disks as described in [this article][virtual-machines-linux-how-to-attach-disk-how-to-initialize-a-new-data-disk-in-linux]
>
>

---
If the new disk is an empty disk, you need to format the disk as well. For formatting, especially for DBMS data and log files the same recommendations as for bare-metal deployments of the DBMS apply.

An Azure Storage account does not provide infinite resources in terms of I/O volume, IOPS, and data volume. Usually DBMS VMs are most affected by this. It might be best to use a separate Storage Account for each VM if you have few high I/O volume VMs to deploy in order to stay within the limit of the Azure Storage Account volume. Otherwise, you need to see how you can balance these VMs between different Storage accounts without hitting the limit of each single Storage Account. More details are discussed in the [DBMS Deployment Guide][dbms-guide]. You should also keep these limitations in mind for pure SAP application server VMs or other VMs, which eventually might require additional VHDs. These restrictions do not apply if you use Managed Disk. If you plan to use Premium Storage, we recommend using Managed Disk.

Another topic, which is relevant for Storage Accounts is whether the VHDs in a Storage Account are getting Geo-replicated. Geo-replication is enabled or disabled on the Storage Account level and not on the VM level. If geo-replication is enabled, the VHDs within the Storage Account would be replicated into another Azure data center within the same region. Before deciding on this, you should think about the following restriction:

Azure Geo-replication works locally on each VHD in a VM and does not replicate the I/Os in chronological order across multiple VHDs in a VM. Therefore, the VHD that represents the base VM as well as any additional VHDs attached to the VM are replicated independent of each other. This means there is no synchronization between the changes in the different VHDs. The fact that the I/Os are replicated independently of the order in which they are written means that geo-replication is not of value for database servers that have their databases distributed over multiple VHDs. In addition to the DBMS, there also might be other applications where processes write or manipulate data in different VHDs and where it is important to keep the order of changes. If that is a requirement, geo-replication in Azure should not be enabled. Dependent on whether you need or want geo-replication for a set of VMs, but not for another set, you can already categorize VMs and their related VHDs into different Storage Accounts that have geo-replication enabled or disabled.

#### <a name="17e0d543-7e8c-4160-a7da-dd7117a1ad9d"></a>Setting automount for attached disks
---
> ![Windows][Logo_Windows] Windows
>
> For VMs, which are created from own Images or Disks, it is necessary to check and possibly set the automount parameter. Setting this parameter will allow the VM after a restart or redeployment in Azure to mount the attached/mounted drives again automatically.
> The parameter is set for the images provided by Microsoft in the Azure Marketplace.
>
> In order to set the automount, check the documentation of the command-line executable diskpart.exe here:
>
> * [DiskPart Command-Line Options](https://technet.microsoft.com/library/bb490893.aspx)
> * [Automount](https://technet.microsoft.com/library/cc753703.aspx)
>
> The Windows command-line window should be opened as administrator.
>
> If disks are attached, you need to sign in to the VM to open the Windows Disk Manager. If automount is not enabled as recommended in chapter [Setting automount for attached disks][planning-guide-5.5.3],  the newly attached volume >needs to be taken online and initialized.
>
> ![Linux][Logo_Linux] Linux
>
> You need to initialize a newly attached empty disk as described in [this article][virtual-machines-linux-how-to-attach-disk-how-to-initialize-a-new-data-disk-in-linux].
> You also need to add new disks to the /etc/fstab.
>
>

---
### Final Deployment

For the final deployment and exact steps, especially with regards to the deployment of the Azure Extension for SAP, refer to the [Deployment Guide][deployment-guide].

## Accessing SAP systems running within Azure VMs

For scenarios where you want to connect to those SAP systems across the public internet using SAP GUI, the following procedures need to be applied.

Later in the document we will discuss the other major scenario, connecting to SAP systems in cross-premises deployments, which have a site-to-site connection (VPN tunnel) or Azure ExpressRoute connection between the on-premises systems and Azure systems.

### Remote Access to SAP systems

With Azure Resource Manager, there are no default endpoints anymore like in the former classic model. All ports of an Azure Resource Manager VM are open as long as:

1. No Network Security Group is defined for the subnet or the network interface. Network traffic to Azure VMs can be secured via so-called "Network Security Groups". For more information, see [What is a Network Security Group (NSG)?][virtual-networks-nsg]
2. No Azure Load Balancer is defined for the network interface   

See the architecture difference between classic model and ARM as described in [this article][virtual-machines-azure-resource-manager-architecture].

#### Configuration of the SAP System and SAP GUI connectivity over the internet

See this article, which describes details to this topic:
<https://blogs.msdn.com/b/saponsqlserver/archive/2014/06/24/sap-gui-connection-closed-when-connecting-to-sap-system-in-azure.aspx>

#### Changing Firewall Settings within VM

It might be necessary to configure the firewall on your virtual machines to allow inbound traffic to your SAP system.

---
> ![Windows][Logo_Windows] Windows
>
> By default, the Windows Firewall within an Azure deployed VM is turned on. You now need to allow the SAP Port to be opened, otherwise the SAP GUI will not be able to connect.
> To do this:
>
> * Open Control Panel\System and Security\Windows Firewall to **Advanced Settings**.
> * Now right-click on Inbound Rules and chose **New Rule**.
> * In the following Wizard chose to create a new **Port** rule.
> * In the next step of the wizard, leave the setting at TCP and type in the port number you want to open. Since our SAP instance ID is 00, we took 3200. If your instance has a different instance number, the port you defined earlier based on the instance number should be opened.
> * In the next part of the wizard, you need to leave the item **Allow Connection** checked.
> * In the next step of the wizard you need to define whether the rule applies for Domain, Private and Public network. Adjust it if necessary to your needs. However, connecting with SAP GUI from the outside through the public network, you need to have the rule applied to the public network.
> * In the last step of the wizard, name the rule and save by pressing **Finish**.
>
> The rule becomes effective immediately.
>
> ![Port rule definition][planning-guide-figure-1600]
>
> ![Linux][Logo_Linux] Linux
>
> The Linux images in the Azure Marketplace do not enable the iptables firewall by default and the connection to your SAP system should work. If you enabled iptables or another firewall, refer to the documentation of iptables or the used firewall to allow inbound tcp traffic to  port 32xx (where xx is the system number of your SAP system).
>
>

---
#### Security recommendations

The SAP GUI does not connect immediately to any of the SAP instances (port 32xx) which are running, but first connects via the port opened to the SAP message server
process (port 36xx). In the past, the same port was used by the message server for the internal communication to the application instances. To prevent on-premises
application servers from inadvertently communicating with a message server in Azure, the internal communication ports can be changed. It is highly recommended to change
the internal communication between the SAP message server and its application instances to a different port number on systems that have been cloned from on-premises
systems, such as a clone of development for project testing etc. This can be done with the default profile parameter:

> rdisp/msserv_internal
>
>

as documented in [Security Settings for the SAP Message Server](https://help.sap.com/saphelp_nwpi71/helpdata/en/47/c56a6938fb2d65e10000000a42189c/content.htm)


### <a name="3e9c3690-da67-421a-bc3f-12c520d99a30"></a>Single VM with SAP NetWeaver demo/training scenario

![Running single VM SAP demo systems with the same VM names, isolated in Azure Cloud Services][planning-guide-figure-1700]

In this scenario we are implementing a typical training/demo system scenario where the complete training/demo scenario is contained in a single VM. We assume that the deployment is done through VM image templates. We also assume that multiple of these demo/trainings VMs need to be deployed with the VMs having the same name. The whole training systems don't have connectivity to your on-premises assets and are an opposite to a hybrid deployment.

The assumption is that you created a VM Image as described in some sections of chapter [Preparing VMs with SAP for Azure][planning-guide-5.2] in this document.

The sequence of events to implement the scenario looks like this:

##### PowerShell

* Create a new resource group for every training/demo landscape

```powershell
$rgName = "SAPERPDemo1"
New-AzResourceGroup -Name $rgName -Location "North Europe"
```

* Create a new storage account if you don't want to use Managed Disks

```powershell
$suffix = Get-Random -Minimum 100000 -Maximum 999999
$account = New-AzStorageAccount -ResourceGroupName $rgName -Name "saperpdemo$suffix" -SkuName Standard_LRS -Kind "Storage" -Location "North Europe"
```

* Create a new virtual network for every training/demo landscape to enable the usage of the same hostname and IP addresses. The virtual network is protected by a Network Security Group that only allows traffic to port 3389 to enable Remote Desktop access and port 22 for SSH.

```powershell
# Create a new Virtual Network
$rdpRule = New-AzNetworkSecurityRuleConfig -Name SAPERPDemoNSGRDP -Protocol * -SourcePortRange * -DestinationPortRange 3389 -Access Allow -Direction Inbound -SourceAddressPrefix * -DestinationAddressPrefix * -Priority 100
$sshRule = New-AzNetworkSecurityRuleConfig -Name SAPERPDemoNSGSSH -Protocol * -SourcePortRange * -DestinationPortRange 22 -Access Allow -Direction Inbound -SourceAddressPrefix * -DestinationAddressPrefix * -Priority 101
$nsg = New-AzNetworkSecurityGroup -Name SAPERPDemoNSG -ResourceGroupName $rgName -Location  "North Europe" -SecurityRules $rdpRule,$sshRule

$subnetConfig = New-AzVirtualNetworkSubnetConfig -Name Subnet1 -AddressPrefix  10.0.1.0/24 -NetworkSecurityGroup $nsg
$vnet = New-AzVirtualNetwork -Name SAPERPDemoVNet -ResourceGroupName $rgName -Location "North Europe"  -AddressPrefix 10.0.1.0/24 -Subnet $subnetConfig
```

* Create a new public IP address that can be used to access the virtual machine from the internet

```powershell
# Create a public IP address with a DNS name
$pip = New-AzPublicIpAddress -Name SAPERPDemoPIP -ResourceGroupName $rgName -Location "North Europe" -DomainNameLabel $rgName.ToLower() -AllocationMethod Dynamic
```

* Create a new network interface for the virtual machine

```powershell
# Create a new Network Interface
$nic = New-AzNetworkInterface -Name SAPERPDemoNIC -ResourceGroupName $rgName -Location "North Europe" -Subnet $vnet.Subnets[0] -PublicIpAddress $pip
```

* Create a virtual machine. For this scenario, every VM will have the same name. The SAP SID of the SAP NetWeaver instances in those VMs will be the same as well. Within the Azure Resource Group, the name of the VM needs to be unique, but in different Azure Resource Groups you can run VMs with the same name. The default 'Administrator' account of Windows or 'root' for Linux are not valid. Therefore, a new administrator user name needs to be defined together with a password. The size of the VM also needs to be defined.

```powershell
#####
# Create a new virtual machine with an official image from the Azure Marketplace
#####
$cred=Get-Credential -Message "Type the name and password of the local administrator account."
$vmconfig = New-AzVMConfig -VMName SAPERPDemo -VMSize Standard_D11

# select image
$vmconfig = Set-AzVMSourceImage -VM $vmconfig -PublisherName "MicrosoftWindowsServer" -Offer "WindowsServer" -Skus "2012-R2-Datacenter" -Version "latest"
$vmconfig = Set-AzVMOperatingSystem -VM $vmconfig -Windows -ComputerName "SAPERPDemo" -Credential $cred -ProvisionVMAgent -EnableAutoUpdate
# $vmconfig = Set-AzVMSourceImage -VM $vmconfig -PublisherName "SUSE" -Offer "SLES-SAP" -Skus "12-SP1" -Version "latest"
# $vmconfig = Set-AzVMSourceImage -VM $vmconfig -PublisherName "RedHat" -Offer "RHEL" -Skus "7.2" -Version "latest"
# $vmconfig = Set-AzVMSourceImage -VM $vmconfig -PublisherName "Oracle" -Offer "Oracle-Linux" -Skus "7.2" -Version "latest"
# $vmconfig = Set-AzVMOperatingSystem -VM $vmconfig -Linux -ComputerName "SAPERPDemo" -Credential $cred

$vmconfig = Add-AzVMNetworkInterface -VM $vmconfig -Id $nic.Id

$vmconfig = Set-AzVMBootDiagnostics -Disable -VM $vmconfig
$vm = New-AzVM -ResourceGroupName $rgName -Location "North Europe" -VM $vmconfig
```

```powershell
#####
# Create a new virtual machine with a VHD that contains the private image that you want to use
#####
$cred=Get-Credential -Message "Type the name and password of the local administrator account."
$vmconfig = New-AzVMConfig -VMName SAPERPDemo -VMSize Standard_D11

$vmconfig = Add-AzVMNetworkInterface -VM $vmconfig -Id $nic.Id

$diskName="osfromimage"
$osDiskUri=$account.PrimaryEndpoints.Blob.ToString() + "vhds/" + $diskName  + ".vhd"

$vmconfig = Set-AzVMOSDisk -VM $vmconfig -Name $diskName -VhdUri $osDiskUri -CreateOption fromImage -SourceImageUri <path to VHD that contains the OS image> -Windows
$vmconfig = Set-AzVMOperatingSystem -VM $vmconfig -Windows -ComputerName "SAPERPDemo" -Credential $cred
#$vmconfig = Set-AzVMOSDisk -VM $vmconfig -Name $diskName -VhdUri $osDiskUri -CreateOption fromImage -SourceImageUri <path to VHD that contains the OS image> -Linux
#$vmconfig = Set-AzVMOperatingSystem -VM $vmconfig -Linux -ComputerName "SAPERPDemo" -Credential $cred

$vmconfig = Set-AzVMBootDiagnostics -Disable -VM $vmconfig
$vm = New-AzVM -ResourceGroupName $rgName -Location "North Europe" -VM $vmconfig
```

```powershell
#####
# Create a new virtual machine with a Managed Disk Image
#####
$cred=Get-Credential -Message "Type the name and password of the local administrator account."
$vmconfig = New-AzVMConfig -VMName SAPERPDemo -VMSize Standard_D11

$vmconfig = Add-AzVMNetworkInterface -VM $vmconfig -Id $nic.Id

$vmconfig = Set-AzVMSourceImage -VM $vmconfig -Id <Id of Managed Disk Image>
$vmconfig = Set-AzVMOperatingSystem -VM $vmconfig -Windows -ComputerName "SAPERPDemo" -Credential $cred
#$vmconfig = Set-AzVMOperatingSystem -VM $vmconfig -Linux -ComputerName "SAPERPDemo" -Credential $cred

$vmconfig = Set-AzVMBootDiagnostics -Disable -VM $vmconfig
$vm = New-AzVM -ResourceGroupName $rgName -Location "North Europe" -VM $vmconfig
```

* Optionally add additional disks and restore necessary content. All blob names (URLs to the blobs) must be unique within Azure.

```powershell
# Optional: Attach additional VHD data disks
$vm = Get-AzVM -ResourceGroupName $rgName -Name SAPERPDemo
$dataDiskUri = $account.PrimaryEndpoints.Blob.ToString() + "vhds/datadisk.vhd"
Add-AzVMDataDisk -VM $vm -Name datadisk -VhdUri $dataDiskUri -DiskSizeInGB 1023 -CreateOption empty | Update-AzVM

# Optional: Attach additional Managed Disks
$vm = Get-AzVM -ResourceGroupName $rgName -Name SAPERPDemo
Add-AzVMDataDisk -VM $vm -Name datadisk -DiskSizeInGB 1023 -CreateOption empty -Lun 0 | Update-AzVM
```

##### CLI

The following example code can be used on Linux. For Windows, either use PowerShell as described above or adapt the example to use %rgName% instead of $rgName and set the environment variable using the Windows command *set*.

* Create a new resource group for every training/demo landscape

```azurecli
rgName=SAPERPDemo1
rgNameLower=saperpdemo1
az group create --name $rgName --location "North Europe"
```

* Create a new storage account

```azurecli
az storage account create --resource-group $rgName --location "North Europe" --kind Storage --sku Standard_LRS --name $rgNameLower
```

* Create a new virtual network for every training/demo landscape to enable the usage of the same hostname and IP addresses. The virtual network is protected by a Network Security Group that only allows traffic to port 3389 to enable Remote Desktop access and port 22 for SSH.

```azurecli
az network nsg create --resource-group $rgName --location "North Europe" --name SAPERPDemoNSG
az network nsg rule create --resource-group $rgName --nsg-name SAPERPDemoNSG --name SAPERPDemoNSGRDP --protocol \* --source-address-prefix \* --source-port-range \* --destination-address-prefix \* --destination-port-range 3389 --access Allow --priority 100 --direction Inbound
az network nsg rule create --resource-group $rgName --nsg-name SAPERPDemoNSG --name SAPERPDemoNSGSSH --protocol \* --source-address-prefix \* --source-port-range \* --destination-address-prefix \* --destination-port-range 22 --access Allow --priority 101 --direction Inbound

az network vnet create --resource-group $rgName --name SAPERPDemoVNet --location "North Europe" --address-prefixes 10.0.1.0/24
az network vnet subnet create --resource-group $rgName --vnet-name SAPERPDemoVNet --name Subnet1 --address-prefix 10.0.1.0/24 --network-security-group SAPERPDemoNSG
```

* Create a new public IP address that can be used to access the virtual machine from the internet

```azurecli
az network public-ip create --resource-group $rgName --name SAPERPDemoPIP --location "North Europe" --dns-name $rgNameLower --allocation-method Dynamic
```

* Create a new network interface for the virtual machine

```azurecli
az network nic create --resource-group $rgName --location "North Europe" --name SAPERPDemoNIC --public-ip-address SAPERPDemoPIP --subnet Subnet1 --vnet-name SAPERPDemoVNet
```

* Create a virtual machine. For this scenario, every VM will have the same name. The SAP SID of the SAP NetWeaver instances in those VMs will be the same as well. Within the Azure Resource Group, the name of the VM needs to be unique, but in different Azure Resource Groups you can run VMs with the same name. The default 'Administrator' account of Windows or 'root' for Linux are not valid. Therefore, a new administrator user name needs to be defined together with a password. The size of the VM also needs to be defined.

```azurecli
#####
# Create virtual machines using storage accounts
#####
az vm create --resource-group $rgName --location "North Europe" --name SAPERPDemo --nics SAPERPDemoNIC --image MicrosoftWindowsServer:WindowsServer:2012-R2-Datacenter:latest --admin-username <username> --admin-password <password> --size Standard_D11 --use-unmanaged-disk --storage-account $rgNameLower --storage-container-name vhds --os-disk-name os
#az vm create --resource-group $rgName --location "North Europe" --name SAPERPDemo --nics SAPERPDemoNIC --image SUSE:SLES-SAP:12-SP1:latest --admin-username <username> --admin-password <password> --size Standard_D11 --use-unmanaged-disk --storage-account $rgNameLower --storage-container-name vhds --os-disk-name os --authentication-type password
#az vm create --resource-group $rgName --location "North Europe" --name SAPERPDemo --nics SAPERPDemoNIC --image RedHat:RHEL:7.2:latest --admin-username <username> --admin-password <password> --size Standard_D11 --use-unmanaged-disk --storage-account $rgNameLower --storage-container-name vhds --os-disk-name os --authentication-type password
#az vm create --resource-group $rgName --location "North Europe" --name SAPERPDemo --nics SAPERPDemoNIC --image "Oracle:Oracle-Linux:7.2:latest" --admin-username <username> --admin-password <password> --size Standard_D11 --use-unmanaged-disk --storage-account $rgNameLower --storage-container-name vhds --os-disk-name os --authentication-type password

#####
# Create virtual machines using Managed Disks
#####
az vm create --resource-group $rgName --location "North Europe" --name SAPERPDemo --nics SAPERPDemoNIC --image MicrosoftWindowsServer:WindowsServer:2012-R2-Datacenter:latest --admin-username <username> --admin-password <password> --size Standard_DS11_v2 --os-disk-name os
#az vm create --resource-group $rgName --location "North Europe" --name SAPERPDemo --nics SAPERPDemoNIC --image SUSE:SLES-SAP:12-SP1:latest --admin-username <username> --admin-password <password> --size Standard_DS11_v2 --os-disk-name os --authentication-type password
#az vm create --resource-group $rgName --location "North Europe" --name SAPERPDemo --nics SAPERPDemoNIC --image RedHat:RHEL:7.2:latest --admin-username <username> --admin-password <password> --size Standard_DS11_v2 --os-disk-name os --authentication-type password
#az vm create --resource-group $rgName --location "North Europe" --name SAPERPDemo --nics SAPERPDemoNIC --image "Oracle:Oracle-Linux:7.2:latest" --admin-username <username> --admin-password <password> --size Standard_DS11_v2 --os-disk-name os --authentication-type password
```

```azurecli
#####
# Create a new virtual machine with a VHD that contains the private image that you want to use
#####
az vm create --resource-group $rgName --location "North Europe" --name SAPERPDemo --nics SAPERPDemoNIC --os-type Windows --admin-username <username> --admin-password <password> --size Standard_D11 --use-unmanaged-disk --storage-account $rgNameLower --storage-container-name vhds --os-disk-name os --image <path to image vhd>
#az vm create --resource-group $rgName --location "North Europe" --name SAPERPDemo --nics SAPERPDemoNIC --os-type Linux --admin-username <username> --admin-password <password> --size Standard_D11 --use-unmanaged-disk --storage-account $rgNameLower --storage-container-name vhds --os-disk-name os --image <path to image vhd> --authentication-type password

#####
# Create a new virtual machine with a Managed Disk Image
#####
az vm create --resource-group $rgName --location "North Europe" --name SAPERPDemo --nics SAPERPDemoNIC --admin-username <username> --admin-password <password> --size Standard_DS11_v2 --os-disk-name os --image <managed disk image id>
#az vm create --resource-group $rgName --location "North Europe" --name SAPERPDemo --nics SAPERPDemoNIC --admin-username <username> --admin-password <password> --size Standard_DS11_v2 --os-disk-name os --image <managed disk image id> --authentication-type password
```

* Optionally add additional disks and restore necessary content. All blob names (URLs to the blobs) must be unique within Azure.

```azurecli
# Optional: Attach additional VHD data disks
az vm unmanaged-disk attach --resource-group $rgName --vm-name SAPERPDemo --size-gb 1023 --vhd-uri https://$rgNameLower.blob.core.windows.net/vhds/data.vhd  --new

# Optional: Attach additional Managed Disks
az vm disk attach --resource-group $rgName --vm-name SAPERPDemo --size-gb 1023 --disk datadisk --new
```

##### Template

You can use the sample templates on the Azure-quickstart-templates repository on GitHub.

* [Simple Linux VM](https://github.com/Azure/azure-quickstart-templates/tree/master/101-vm-simple-linux)
* [Simple Windows VM](https://github.com/Azure/azure-quickstart-templates/tree/master/101-vm-simple-windows)
* [VM from image](https://github.com/Azure/azure-quickstart-templates/tree/master/101-vm-from-user-image)

### Implement a set of VMs that communicate within Azure

This non-hybrid scenario is a typical scenario for training and demo purposes where the software representing the demo/training scenario is spread over multiple VMs. The different components installed in the different VMs need to communicate with each other. Again, in this scenario no on-premises network communication or cross-premises scenario is needed.

This scenario is an extension of the installation described in chapter [Single VM with SAP NetWeaver demo/training scenario][planning-guide-7.1] of this document. In this case, more virtual machines will be added to an existing resource group. In the following example, the training landscape consists of an SAP ASCS/SCS VM, a VM running a DBMS, and an SAP Application Server instance VM.

Before you build this scenario, you need to think about basic settings as already exercised in the scenario before.

#### Resource Group and Virtual Machine naming

All resource group names must be unique. Develop your own naming scheme of your resources, such as `<rg-name`>-suffix.

The virtual machine name has to be unique within the resource group.

#### Set up Network for communication between the different VMs

![Set of VMs within an Azure Virtual Network][planning-guide-figure-1900]

To prevent naming collisions with clones of the same training/demo landscapes, you need to create an Azure Virtual Network for every landscape. DNS name resolution will be provided by Azure or you can configure your own DNS server outside Azure (not to be further discussed here). In this scenario, we do not configure our own DNS. For all virtual machines inside one Azure Virtual Network, communication via hostnames will be enabled.

The reasons to separate training or demo landscapes by virtual networks and not only resource groups could be:

* The SAP landscape as set up needs its own AD/OpenLDAP and a Domain Server needs to be part of each of the landscapes.  
* The SAP landscape as set up has components that need to work with fixed IP addresses.

More details about Azure Virtual Networks and how to define them can be found in [this article][virtual-networks-create-vnet-arm-pportal].

## Deploying SAP VMs with corporate network connectivity (Cross-Premises)

You run an SAP landscape and want to divide the deployment between bare-metal for high-end DBMS servers, on-premises virtualized environments for application layers, and smaller 2-Tier configured SAP systems and Azure IaaS. The base assumption is that SAP systems within one SAP landscape need to communicate with each other and with many other software components deployed in the company, independent of their deployment form. There also should be no differences introduced by the deployment form for the end user connecting with SAP GUI or other interfaces. These conditions can only be met when we have the on-premises Active Directory/OpenLDAP and DNS services extended to the Azure systems through site-to-site/multi-site connectivity or private connections like Azure ExpressRoute.



### Scenario of an SAP landscape

The cross-premises or hybrid scenario can be roughly described like in the graphics below:

![Site-to-Site connectivity between on-premises and Azure assets][planning-guide-figure-2100]

The minimum requirement is the use of secure communication protocols such as SSL/TLS for browser access or VPN-based connections for system access to the Azure services. The assumption is that companies handle the VPN connection between their corporate network and Azure differently. Some companies might blankly open all the ports. Some other companies might want to be precise in which ports they need to open, etc.

In the table below typical SAP communication ports are listed. Basically it is sufficient to open the SAP gateway port.

<!-- sapms is prefix of a SAP service name and not a spelling error -->

| Service | Port Name | Example `<nn`> = 01 | Default Range (min-max) | Comment |
| --- | --- | --- | --- | --- |
| Dispatcher |sapdp`<nn>` see * |3201 |3200 - 3299 |SAP Dispatcher, used by SAP GUI for Windows and Java |
| Message server |sapms`<sid`> see ** |3600 |free sapms`<anySID`> |sid = SAP-System-ID |
| Gateway |sapgw`<nn`> see * |3301 |free |SAP gateway, used for CPIC and RFC communication |
| SAP router |sapdp99 |3299 |free |Only CI (central instance) Service names can be reassigned in /etc/services to an arbitrary value after installation. |

*) nn = SAP Instance Number

**) sid = SAP-System-ID

More detailed information on ports required for different SAP products or services by SAP products can be found here
<https://scn.sap.com/docs/DOC-17124>.
With this document, you should be able to open dedicated ports in the VPN device necessary for specific SAP products and scenarios.

Other security measures when deploying VMs in such a scenario could be to create a [Network Security Group][virtual-networks-nsg] to define access rules.



#### Printing on a local network printer from SAP instance in Azure

##### Printing over TCP/IP in Cross-Premises scenario

Setting up your on-premises TCP/IP based network printers in an Azure VM is overall the same as in your corporate network, assuming you do have a VPN Site-To-Site tunnel or ExpressRoute connection established.

---
> ![Windows][Logo_Windows] Windows
>
> To do this:
>
> * Some network printers come with a configuration wizard which makes it easy to set up your printer in an Azure VM. If no wizard software has been distributed with the printer, the manual way to set up the printer is to create a new TCP/IP printer port.
> * Open Control Panel -> Devices and Printers -> Add a printer
> * Choose Add a printer using a TCP/IP address or hostname
> * Type in the IP address of the printer
> * Printer Port standard 9100
> * If necessary install the appropriate printer driver manually.
>
> ![Linux][Logo_Linux] Linux
>
> * like for Windows just follow the standard procedure to install a network printer
> * just follow the public Linux guides for [SUSE](https://www.suse.com/documentation/sles-12/book_sle_deployment/data/sec_y2_hw_print.html) or [Red Hat and Oracle Linux](https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/6/html/Deployment_Guide/sec-Printer_Configuration.html) on how to add a printer.
>
>

---
![Network printing][planning-guide-figure-2200]

##### Host-based printer over SMB (shared printer) in Cross-Premises scenario

Host-based printers are not network-compatible by design. But a host-based printer can be shared among computers on a network as long as the printer is connected to a powered-on computer. Connect your corporate network either Site-To-Site or ExpressRoute and share your local printer. The SMB protocol uses NetBIOS instead of DNS as name service. The NetBIOS host name can be different from the DNS host name. The standard case is that the NetBIOS host name and the DNS host name are identical. The DNS domain does not make sense in the NetBIOS name space. Accordingly, the fully qualified DNS host name consisting of the DNS host name and DNS domain must not be used in the NetBIOS name space.

The printer share is identified by a unique name in the network:

* Host name of the SMB host (always needed).
* Name of the share (always needed).
* Name of the domain if printer share is not in the same domain as SAP system.
* Additionally, a user name and a password may be required to access the printer share.

How to:

---
> ![Windows][Logo_Windows] Windows
>
> Share your local printer.
> In the Azure VM, open the Windows Explorer and type in the share name of the printer.
> A printer installation wizard will guide you through the installation process.
>
> ![Linux][Logo_Linux] Linux
>
> Here are some examples of documentation about configuring network printers in Linux or including
> a chapter regarding printing in Linux. It will work the same way in an Azure Linux VM as long as
> the VM is part of a VPN:
>
> * SLES <https://en.opensuse.org/SDB:Printing_via_SMB_(Samba)_Share_or_Windows_Share>
> * RHEL or Oracle Linux <https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/7/html/System_Administrators_Guide/sec-Printer_Configuration.html#s1-printing-smb-printer>
>
>

---
##### USB Printer (printer forwarding)

In Azure the ability of the Remote Desktop Services to provide users the access to their local printer devices in a remote session is not available.

---
> ![Windows][Logo_Windows] Windows
>
> More details on printing with Windows can be found here: <https://technet.microsoft.com/library/jj590748.aspx>.
>
>

---
#### Integration of SAP Azure Systems into Correction and Transport System (TMS) in Cross-Premises

The SAP Change and Transport System (TMS) needs to be configured to export and import transport request across systems in the landscape. We assume that the development instances of an SAP system (DEV) are located in Azure whereas the quality assurance (QA) and productive systems (PRD) are on-premises. Furthermore, we assume that there is a central transport directory.

##### Configuring the Transport Domain

Configure your Transport Domain on the system you designated as the Transport Domain Controller as described in [Configuring the Transport Domain Controller](https://help.sap.com/erp2005_ehp_04/helpdata/en/44/b4a0b47acc11d1899e0000e829fbbd/content.htm). A system user TMSADM will be created and the required RFC destination will be generated. You may check these RFC connections using the transaction SM59. Hostname resolution must be enabled across your transport domain.

How to:

* In our scenario, we decided the on-premises QAS system will be the CTS domain controller. Call transaction STMS. The TMS dialog box appears. A Configure Transport Domain dialog box is displayed. (This dialog box only appears if you have not yet configured a transport domain.)
* Make sure that the automatically created user TMSADM is authorized (SM59 -> ABAP Connection -> TMSADM@E61.DOMAIN_E61 -> Details -> Utilities(M) -> Authorization Test). The initial screen of transaction STMS should show that this SAP System is now functioning as the controller of the transport domain as shown here:

![Initial screen of transaction STMS on the domain controller][planning-guide-figure-2300]

#### Including SAP Systems in the Transport Domain

The sequence of including an SAP system in a transport domain looks as follows:

* On the DEV system in Azure, go to the transport system (Client 000) and call transaction STMS. Choose Other Configuration from the dialog box and continue with Include System in Domain. Specify the Domain Controller as target host ([Including SAP Systems in the Transport Domain](https://help.sap.com/erp2005_ehp_04/helpdata/en/44/b4a0c17acc11d1899e0000e829fbbd/content.htm?frameset=/en/44/b4a0b47acc11d1899e0000e829fbbd/frameset.htm)). The system is now waiting to be included in the transport domain.
* For security reasons, you then have to go back to the domain controller to confirm your request. Choose System Overview and Approve of the waiting system. Then confirm the prompt and the configuration will be distributed.

This SAP system now contains the necessary information about all the other SAP systems in the transport domain. At the same time, the address data of the new SAP system is sent to all the other SAP systems, and the SAP system is entered in the transport profile of the transport control program. Check whether RFCs and access to the transport directory of the domain work.

Continue with the configuration of your transport system as usual as described in the documentation [Change and Transport System](https://help.sap.com/saphelp_nw70ehp3/helpdata/en/48/c4300fca5d581ce10000000a42189c/content.htm?frameset=/en/44/b4a0b47acc11d1899e0000e829fbbd/frameset.htm).

How to:

* Make sure your STMS on premises is configured correctly.
* Make sure the hostname of the Transport Domain Controller can be resolved by your virtual machine on Azure and vice visa.
* Call transaction STMS -> Other Configuration -> Include System in Domain.
* Confirm the connection in the on premises TMS system.
* Configure transport routes, groups, and layers as usual.

In site-to-site connected cross-premises scenarios, the latency between on-premises and Azure still can be substantial. If we follow the sequence of transporting objects through development and test systems to production or think about applying transports or support packages to the different systems, you realize that, dependent on the location of the central transport directory, some of the systems will encounter high latency reading or writing data in the central transport directory. The situation is similar to SAP landscape configurations where the different systems are spread through different data centers with substantial distance between the data centers.

In order to work around such latency and have the systems work fast in reading or writing to or from the transport directory, you can set up two STMS transport domains (one for on-premises and one with the systems in Azure and link the transport domains. Check this documentation, which explains the principles behind this concept in the SAP TMS:
<https://help.sap.com/saphelp_me60/helpdata/en/c4/6045377b52253de10000009b38f889/content.htm?frameset=/en/57/38dd924eb711d182bf0000e829fbfe/frameset.htm>.

How to:

* Set up a transport domain on each location (on-premises and Azure) using transaction STMS
  <https://help.sap.com/saphelp_nw70ehp3/helpdata/en/44/b4a0b47acc11d1899e0000e829fbbd/content.htm>
* Link the domains with a domain link and confirm the link between the two domains.
  <https://help.sap.com/saphelp_nw73ehp1/helpdata/en/a3/139838280c4f18e10000009b38f8cf/content.htm>
* Distribute the configuration to the linked system.

#### RFC traffic between SAP instances located in Azure and on-premises (Cross-Premises)

RFC traffic between systems, which are on-premises and in Azure needs to work. To set up a connection call transaction SM59 in a source system where you need to define an RFC connection towards the target system. The configuration is similar to the standard setup of an RFC Connection.

We assume that in the cross-premises scenario, the VMs, which run SAP systems that need to communicate with each other are in the same domain. Therefore the setup of an RFC connection between SAP systems does not differ from the setup steps and inputs in on-premises scenarios.

#### Accessing local fileshares from SAP instances located in Azure or vice versa

SAP instances located in Azure need to access file shares, which are within the corporate premises. In addition, on-premises SAP instances need to access file shares, which are located in Azure. To enable the file shares, you must configure the permissions and sharing options on the local system. Make sure to open the ports on the VPN or ExpressRoute connection between Azure and your datacenter.

## Supportability

### <a name="6f0a47f3-a289-4090-a053-2521618a28c3"></a>Azure Extension for SAP

In order to feed some portion of Azure infrastructure information of mission critical SAP systems to the SAP Host Agent instances, installed in VMs, an Azure (VM) Extension for SAP needs to get installed for the deployed VMs. Since the demands by SAP were specific to SAP applications, Microsoft decided not to generically implement the required functionality into Azure, but leave it for customers to deploy the necessary VM extension and configurations to their Virtual Machines running in Azure. However, deployment and lifecycle management of the Azure VM Extension for SAP will be mostly automated by Azure.

#### Solution design

The solution developed to enable SAP Host Agent getting the required information is based on the architecture of Azure VM Agent and Extension framework. The idea of the Azure VM Agent and Extension framework is to allow installation of software application(s) available in the Azure VM Extension gallery within a VM. The principle idea behind this concept is to allow (in cases like the Azure Extension for SAP), the deployment of special functionality into a VM and the configuration of such software at deployment time.

The 'Azure VM Agent' that enables handling of specific Azure VM Extensions within the VM is injected into Windows VMs by default on VM creation in the Azure portal. In case of SUSE, Red Hat or Oracle Linux, the VM agent is already part of the
Azure Marketplace image. In case, one would upload a Linux VM from on-premises to Azure the VM agent has to be installed manually.

The basic building blocks of the solution to provide Azure infrastructure information to SAP Host agent in Azure looks like this:

![Microsoft Azure Extension components][planning-guide-figure-2400]

As shown in the block diagram above, one part of the solution is hosted in the Azure VM Image and Azure Extension Gallery, which is a globally replicated repository that is managed by Azure Operations. It is the responsibility of the joint SAP/MS team working on the Azure implementation of SAP to work with Azure Operations to publish new versions of the Azure Extension for SAP.

When you deploy a new Windows VM, the Azure VM Agent is automatically added into the VM. The function of this agent is to coordinate the loading and configuration of the Azure Extensions of the VMs. For Linux VMs, the Azure VM Agent is already part of the Azure Marketplace OS image.

However, there is a step that still needs to be executed by the customer. This is the enablement and configuration of the performance collection. The process related to the configuration is automated by a PowerShell script or CLI command. The PowerShell script can be downloaded in the Microsoft Azure Script Center as described in the [Deployment Guide][deployment-guide].

The overall Architecture of the Azure extension for SAP looks like:

![Azure extension for SAP ][planning-guide-figure-2500]

**For the exact how-to and for detailed steps of using these PowerShell cmdlets or CLI command during deployments, follow the instructions given in the [Deployment Guide][deployment-guide].**

### Integration of Azure located SAP instance into SAProuter

SAP instances running in Azure need to be accessible from SAProuter as well.

![SAP-Router Network Connection][planning-guide-figure-2600]

A SAProuter enables the TCP/IP communication between participating systems if there is no direct IP connection. This provides the advantage that no end-to-end connection between the communication partners is necessary on network level. The SAProuter is listening on port 3299 by default.
To connect SAP instances through a SAProuter, you need to give the SAProuter string and host name with any attempt to connect.

## SAP NetWeaver AS Java

So far the focus of the document has been SAP NetWeaver in general or the SAP NetWeaver ABAP stack. In this small section, specific considerations for the SAP Java stack are listed. One of the most important SAP NetWeaver Java exclusively based applications is the SAP Enterprise Portal. Other SAP NetWeaver based applications like SAP PI and SAP Solution Manager use both the SAP NetWeaver ABAP and Java stacks. Therefore, there certainly is a need to consider specific aspects related to the SAP NetWeaver Java stack as well.

### SAP Enterprise Portal

The setup of an SAP Portal in an Azure Virtual Machine does not differ from an on premises installation if you are deploying in cross-premises scenarios. Since the DNS is done by on-premises, the port settings of the individual instances can be done as configured on-premises. The recommendations and restrictions described in this document so far apply for an application like SAP Enterprise Portal or the SAP NetWeaver Java stack in general.

![Exposed SAP Portal][planning-guide-figure-2700]

A special deployment scenario by some customers is the direct exposure of the SAP Enterprise Portal to the Internet while the virtual machine host is connected to the company network via site-to-site VPN tunnel or ExpressRoute. For such a scenario, you have to make sure that specific ports are open and not blocked by firewall or network security group. 

The initial portal URI is http(s):`<Portalserver`>:5XX00/irj where the port is formed as documented by SAP in 
<https://help.sap.com/saphelp_nw70ehp1/helpdata/de/a2/f9d7fed2adc340ab462ae159d19509/frameset.htm>.

![Endpoint configuration][planning-guide-figure-2800]

If you want to customize the URL and/or ports of your SAP Enterprise Portal, check this documentation:

* [Change Portal URL](https://wiki.scn.sap.com/wiki/display/EP/Change+Portal+URL)
* [Change Default port numbers, Portal port numbers](https://wiki.scn.sap.com/wiki/display/NWTech/Change+Default++port+numbers%2C+Portal+port+numbers)

## High Availability (HA) and Disaster Recovery (DR) for SAP NetWeaver running on Azure Virtual Machines

### Definition of terminologies

The term **high availability (HA)** is generally related to a set of technologies that minimizes IT disruptions by providing business continuity of IT services through redundant, fault-tolerant, or failover protected components inside the **same** data center. In our case, within one Azure Region.

**Disaster recovery (DR)** is also targeting minimizing IT services disruption, and their recovery but across **different** data centers, that are usually located hundreds of kilometers away. In our case usually between different Azure Regions within the same geopolitical region or as established by you as a customer.

### Overview of High Availability

We can separate the discussion about SAP high availability in Azure into two parts:

* **Azure infrastructure high availability**, for example HA of compute (VMs), network, storage etc. and its benefits for increasing SAP application availability.
* **SAP application high availability**, for example HA of SAP software components:
  * SAP application servers
  * SAP ASCS/SCS instance
  * DB server

and how it can be combined with Azure infrastructure HA.

SAP High Availability in Azure has some differences compared to SAP High Availability in an on-premises physical or virtual environment. The following paper from SAP describes standard SAP High Availability configurations in virtualized environments on Windows: <https://scn.sap.com/docs/DOC-44415>. There is no sapinst-integrated SAP-HA configuration for Linux like it exists for Windows. Regarding SAP HA on-premises for Linux find more information here: <https://scn.sap.com/docs/DOC-8541>.

### Azure Infrastructure High Availability

There is currently a single-VM SLA of 99.9%. To get an idea how the availability of a single VM might look like, you can build the product of the different available Azure SLAs: <https://azure.microsoft.com/support/legal/sla/>.

The basis for the calculation is 30 days per month, or 43200 minutes. Therefore, 0.05% downtime corresponds to 21.6 minutes. As usual, the availability of the different services will multiply in the following way:

(Availability Service #1/100) * (Availability Service #2/100) * (Availability Service #3/100) 

Like:

(99.95/100) * (99.9/100) * (99.9/100) = 0.9975 or an overall availability of 99.75%.

#### Virtual Machine (VM) High Availability

There are two types of Azure platform events that can affect the availability of your virtual machines: planned maintenance and unplanned maintenance.

* Planned maintenance events are periodic updates made by Microsoft to the underlying Azure platform to improve overall reliability, performance, and security of the platform infrastructure that your virtual machines run on.
* Unplanned maintenance events occur when the hardware or physical infrastructure underlying your virtual machine has faulted in some way. This may include local network failures, local disk failures, or other rack level failures. When such a failure is detected, the Azure platform will automatically migrate your virtual machine from the unhealthy physical server hosting your virtual machine to a healthy physical server. Such events are rare, but may also cause your virtual machine to reboot.

More details can be found in this documentation: <https://azure.microsoft.com/documentation/articles/virtual-machines-manage-availability>

#### Azure Storage Redundancy

The data in your Microsoft Azure Storage Account is always replicated to ensure durability and high availability, meeting the Azure Storage SLA even in the face of transient hardware failures.

Since Azure Storage is keeping three images of the data by default, RAID5 or RAID1 across multiple Azure disks are not necessary.

More details can be found in this article: <https://azure.microsoft.com/documentation/articles/storage-redundancy/>

#### Utilizing Azure Infrastructure VM Restart to Achieve Higher Availability of SAP Applications

If you decide not to use functionalities like Windows Server Failover Clustering (WSFC) or Pacemaker on Linux (currently only supported for SLES 12 and higher), Azure VM Restart is utilized to protect an SAP System against planned and unplanned downtime of the Azure physical server infrastructure and overall underlying Azure platform.

> [!NOTE]
> It is important to mention that Azure VM Restart primarily protects VMs and NOT applications. VM Restart does not offer high availability for SAP applications, but it does offer a certain level of infrastructure availability and therefore indirectly higher availability of SAP systems. There is also no SLA for the time it will take to restart a VM after a planned or unplanned host outage. Therefore, this method of high availability is not suitable for critical components of an SAP system like (A)SCS or DBMS.
>
>

Another important infrastructure element for high availability is storage. For example Azure Storage SLA is 99.9 % availability. If one deploys all VMs with its disks into a single Azure Storage Account, potential Azure Storage unavailability will cause unavailability of all VMs that are placed in that Azure Storage Account, and also all SAP components running inside of those VMs.  

Instead of putting all VMs into one single Azure Storage Account, you can also use dedicated storage accounts for each VM, and in this way increase overall VM and SAP application availability by using multiple independent Azure Storage Accounts.

Azure managed disks are automatically placed in the Fault Domain of the virtual machine they are attached to. If you place two virtual machines in an availability set and use Managed Disks, the platform will take care of distributing the Managed Disks into different Fault Domains as well. If you plan to use Premium Storage, we highly recommend using Manage Disks as well.

A sample architecture of an SAP NetWeaver system that uses Azure infrastructure HA and storage accounts could look like this:

![Utilizing Azure infrastructure HA to achieve SAP application higher availability][planning-guide-figure-2900]

A sample architecture of an SAP NetWeaver system that uses Azure infrastructure HA and Managed Disks could look like this:

![Utilizing Azure infrastructure HA to achieve SAP application higher availability][planning-guide-figure-2901]

For critical SAP components, we achieved the following so far:

* High Availability of SAP Application Servers (AS)

  SAP application server instances are redundant components. Each SAP AS instance is deployed on its own VM, that is running in a different Azure Fault and Upgrade Domain (see chapters [Fault Domains][planning-guide-3.2.1] and [Upgrade Domains][planning-guide-3.2.2]). This is ensured by using Azure availability sets (see chapter [Azure Availability Sets][planning-guide-3.2.3]). Potential planned or unplanned unavailability of an Azure Fault or Upgrade Domain will cause unavailability of a restricted number of VMs with their SAP AS instances.

  Each SAP AS instance is placed in its own Azure Storage account - potential unavailability of one Azure Storage Account will cause unavailability of only one VM with its SAP AS instance. However, be aware that there is a limit of Azure Storage Accounts within one Azure subscription. To ensure automatic start of (A)SCS instance after the VM reboot, make sure to set the Autostart parameter in (A)SCS instance start profile described in chapter [Using Autostart for SAP instances][planning-guide-11.5].
  Also read chapter [High Availability for SAP Application Servers][planning-guide-11.4.1] for more details.

  Even if you use Managed Disks, those disks are also stored in an Azure Storage Account and can be unavailable in an event of a storage outage.

* *Higher* Availability of SAP (A)SCS instance

  Here we utilize Azure VM Restart to protect the VM with installed SAP (A)SCS instance. In the case of planned or unplanned downtime of Azure severs, VMs will be restarted on another available server. As mentioned earlier, Azure VM Restart primarily protects VMs and NOT applications, in this case, the (A)SCS instance. Through the VM Restart, we'll reach indirectly higher availability of SAP (A)SCS instance. To insure automatic start of (A)SCS instance after the VM reboot, make sure to set Autostart parameter in (A)SCS instance start profile described in chapter [Using Autostart for SAP instances][planning-guide-11.5]. This means the (A)SCS instance as a Single Point of Failure (SPOF) running in a single VM will be the determinative factor for the availability of the whole SAP landscape.

* *Higher* Availability of DBMS Server

  Here, similar to the SAP (A)SCS instance use case, we utilize Azure VM Restart to protect the VM with installed DBMS software, and we achieve higher availability of DBMS software through VM Restart.
  DBMS running in a single VM is also a SPOF, and it is the determinative factor for the availability of the whole SAP landscape.

### SAP Application High Availability on Azure IaaS

To achieve full SAP system high availability, we need to protect all critical SAP system components, for example redundant SAP application servers, and unique components (for example Single Point of Failure) like SAP (A)SCS instance, and DBMS.

#### <a name="5d9d36f9-9058-435d-8367-5ad05f00de77"></a>High Availability for SAP Application Servers

For the SAP application servers/dialog instances, it's not necessary to think about a specific high availability solution. High availability is achieved by redundancy and thereby having enough of them in different virtual machines. They should all be placed in the same Azure availability set to avoid that the VMs might be updated at the same time during planned maintenance downtime. The basic functionality, which builds on different Upgrade and Fault Domains within an Azure Scale Unit was already introduced in chapter [Upgrade Domains][planning-guide-3.2.2]. Azure availability sets were presented in chapter [Azure Availability Sets][planning-guide-3.2.3] of this document.

There is no infinite number of Fault and Upgrade Domains that can be used by an Azure availability set within an Azure Scale Unit. This means that putting a number of VMs into one availability set, sooner or later more than one VM ends up in the same Fault or Upgrade Domain.

Deploying a few SAP application server instances in their dedicated VMs and assuming that we got five Upgrade Domains, the following picture emerges at the end. The actual max number of fault and update domains within an availability set might change in the future:

![HA of SAP Application Servers in Azure][planning-guide-figure-3000]

More details can be found in this documentation: <https://azure.microsoft.com/documentation/articles/virtual-machines-manage-availability>

#### High Availability for SAP Central Services on Azure

For High availability architecture of SAP Central Services on Azure, check the article [High-availability architecture and scenarios for SAP NetWeaver](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-high-availability-architecture-scenarios) as entry information. The article points to more detailed descriptions for the particular operating systems.

#### High Availability for the SAP database instance

The typical SAP DBMS HA setup is based on two DBMS VMs where DBMS high-availability functionality is used to replicate data from the active DBMS instance to the second VM into a passive DBMS instance.

High Availability and Disaster recovery functionality for DBMS in general as well as specific DBMS are described in the [DBMS Deployment Guide][dbms-guide].

#### End-to-End High Availability for the Complete SAP System

Here are two examples of a complete SAP NetWeaver HA architecture in Azure - one for Windows and one for Linux.

Unmanaged disks only: The concepts as explained below may need to be compromised a bit when you deploy many SAP systems and the number of VMs deployed are exceeding the maximum limit of Storage Accounts per subscription. In such cases, VHDs of VMs need to be combined within one Storage Account. Usually you would do so by combining VHDs of SAP application layer VMs of different SAP systems.  We also combined different VHDs of different DBMS VMs of different SAP systems in one Azure Storage Account. Thereby keeping the IOPS limits of Azure Storage Accounts in mind (<https://azure.microsoft.com/documentation/articles/storage-scalability-targets>)


##### ![Windows][Logo_Windows] HA on Windows

![SAP NetWeaver Application HA Architecture with SQL Server in Azure IaaS][planning-guide-figure-3200]

The following Azure constructs are used for the SAP NetWeaver system, to minimize impact by infrastructure issues and host patching:

* The complete system is deployed on Azure (required - DBMS layer, (A)SCS instance, and complete application layer need to run in the same location).
* The complete system runs within one Azure subscription (required).
* The complete system runs within one Azure Virtual Network (required).
* The separation of the VMs of one SAP system into three availability sets is possible even with all the VMs belonging to the same Virtual Network.
* Each layer (for example DBMS, ASCS, Application Servers) must use a dedicated availability set.
* All VMs running DBMS instances of one SAP system are in one availability set. We assume that there is more than one VM running DBMS instances per system since native DBMS high availability features are used, like SQL Server AlwaysOn or Oracle Data Guard.
* All VMs running DBMS instances use their own storage account. DBMS data and log files are replicated from one storage account to another storage account using DBMS high availability functions that synchronize the data. Unavailability of one storage account will cause unavailability of one SQL Windows cluster node, but not the whole SQL Server service.
* All VMs running (A)SCS instance of one SAP system are in one availability set. A Windows Server Failover Cluster (WSFC) is configured inside of those VMs to protect the (A)SCS instance.
* All VMs running (A)SCS instances use their own storage account. (A)SCS instance files and SAP global folder are replicated from one storage account to another storage account using SIOS DataKeeper replication. Unavailability of one storage account will cause unavailability of one (A)SCS Windows cluster node, but not the whole (A)SCS service.
* ALL the VMs representing the SAP application server layer are in a third availability set.
* ALL the VMs running SAP application servers use their own storage account. Unavailability of one storage account will cause unavailability of one SAP application server, where other SAP application servers continue to run.

The following figure illustrated the same landscape using Managed Disks.

![SAP NetWeaver Application HA Architecture with SQL Server in Azure IaaS][planning-guide-figure-3201]

##### ![Linux][Logo_Linux] HA on Linux

The architecture for SAP HA on Linux on Azure is basically the same as for Windows as described above. Refer to SAP Note [1928533] for a list of supported high availability solutions.

### <a name="4e165b58-74ca-474f-a7f4-5e695a93204f"></a>Using Autostart for SAP instances

SAP offered the functionality to start SAP instances immediately after the start of the OS within the VM. The exact steps were documented in SAP Knowledge Base Article [1909114]. However, SAP is not recommending to use the setting anymore because there is no control in the order of instance restarts, assuming more than one VM got affected or multiple instances ran per VM. Assuming a typical Azure scenario of one SAP application server instance in a VM and the case of a single VM eventually getting restarted, the Autostart is not critical and can be enabled by adding this parameter:

    Autostart = 1

Into the start profile of the SAP ABAP and/or Java instance.

> [!NOTE]
> The Autostart parameter can have some downfalls as well. In more detail, the parameter triggers the start of an SAP ABAP or Java instance when the related Windows/Linux service of the instance is started. That certainly is the case when the operating system boots up. However, restarts of SAP services are also a common thing for SAP Software Lifecycle Management functionality like SUM or other updates or upgrades. These functionalities are not expecting an instance to be restarted automatically at all. Therefore, the Autostart parameter should be disabled before running such tasks. The Autostart parameter also should not be used for SAP instances that are clustered, like ASCS/SCS/CI.
>
>

See additional information regarding autostart for SAP instances here:

* [Start/Stop SAP along with your Unix Server Start/Stop](https://scn.sap.com/community/unix/blog/2012/08/07/startstop-sap-along-with-your-unix-server-startstop)
* [Starting and Stopping SAP NetWeaver Management Agents](https://help.sap.com/saphelp_nwpi711/helpdata/en/49/9a15525b20423ee10000000a421938/content.htm)
* [How to enable auto Start of HANA Database](http://sapbasisinfo.com/blog/2016/08/15/enabling-autostart-of-sap-hana-database-on-server-boot-situation/)

### Larger 3-Tier SAP systems
High-Availability aspects of 3-Tier SAP configurations got discussed in earlier sections already. But what about systems where the DBMS server requirements are too large to have it located in Azure, but the SAP application layer could be deployed into Azure?

#### Location of 3-Tier SAP configurations
It is not supported to split the application tier itself or the application and DBMS tier between on-premises and Azure. An SAP system is either completely deployed on-premises OR in Azure. It is also not supported to have some of the application servers run on-premises and some others in Azure. That is the starting point of the discussion. We also are not supporting to have the DBMS components of an SAP system and the SAP application server layer deployed in two different Azure Regions. For example, DBMS in West US and SAP application layer in Central US. Reason for not supporting such configurations is the latency sensitivity of the SAP NetWeaver architecture.

However, over the course of last year data center partners developed co-locations to Azure Regions. These co-locations often are in close proximity to the physical Azure data centers within an Azure Region. The short distance and connection of assets in the co-location through ExpressRoute into Azure can result in a latency that is less than 2 milliseconds. In such cases, to locate the DBMS layer (including storage SAN/NAS) in such a co-location and the SAP application layer in Azure is possible. [HANA Large Instances](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-overview-architecture). 

### Offline Backup of SAP systems
Dependent on the SAP configuration chosen (2-Tier or 3-Tier) there could be a need to back up. The content of the VM itself plus to have a backup of the database. The DBMS-related backups are expected to be done with database methods. A detailed description for the different databases, can be found in [DBMS Guide][dbms-guide]. On the other hand, the SAP data can be backed up in an offline manner (including the database content as well) as described in this section or online as described in the next section.

The offline backup would basically require a shutdown of the VM through the Azure portal and a copy of the base VM disk plus all attached disks to the VM. This would preserve a point in time image of the VM and its associated disk. It is recommended to copy the backups into a different Azure Storage Account. Hence the procedure described in chapter [Copying disks between Azure Storage Accounts][planning-guide-5.4.2] of this document would apply.
Besides the shutdown using the Azure portal one can also do it via PowerShell or CLI as described here:
<https://azure.microsoft.com/documentation/articles/virtual-machines-deploy-rmtemplates-powershell/>

A restore of that state would consist of deleting the base VM as well as the original disks of the base VM and mounted disks, copying back the saved disks to the original Storage Account or resource group for managed disks and then redeploying the system.
This article shows an example how to script this process in PowerShell:
<http://www.westerndevs.com/azure-snapshots/>

Make sure to install a new SAP license since restoring a VM backup as described above creates a new hardware key.

### Online backup of an SAP system

Backup of the DBMS is performed with DBMS-specific methods as described in the [DBMS Guide][dbms-guide].

Other VMs within the SAP system can be backed up using Azure Virtual Machine Backup functionality. Azure Virtual Machine Backup is a standard method to back up a complete VM in Azure. Azure Backup stores the backups in Azure and allows a restore of a VM again.

> [!NOTE]
> As of Dec 2015 using VM Backup does NOT keep the unique VM ID which is used for SAP licensing. This means that a restore from a VM
> backup requires installation of a new SAP license key as the restored VM is considered to be a new VM and not a replacement of the
> former one which was saved.
>
> ![Windows][Logo_Windows] Windows
>
> Theoretically, VMs that run databases can be backed up in a consistent manner as well if the DBMS system supports the Windows VSS
> (Volume Shadow Copy Service <https://msdn.microsoft.com/library/windows/desktop/bb968832(v=vs.85).aspx>) as, for example, SQL Server does.
> However, be aware that based on Azure VM backups point-in-time restores of databases are not possible. Therefore, the
> recommendation is to perform backups of databases with DBMS functionality instead of relying on Azure VM Backup.
>
> To get familiar with Azure Virtual Machine Backup start here:
> <https://docs.microsoft.com/azure/backup/backup-azure-vms>.
>
> Other possibilities are to use a combination of Microsoft Data Protection Manager installed in an Azure VM and Azure Backup to
> backup/restore databases. More information can be found here:
> <https://docs.microsoft.com/azure/backup/backup-azure-dpm-introduction>.  
>
> ![Linux][Logo_Linux] Linux
>
> There is no equivalent to Windows VSS in Linux. Therefore only file-consistent backups are possible but not
> application-consistent backups. The SAP DBMS backup should be done using DBMS functionality. The file system
> which includes the SAP-related data can be saved, for example, using tar as described here:
> <https://help.sap.com/saphelp_nw70ehp2/helpdata/en/d3/c0da3ccbb04d35b186041ba6ac301f/content.htm>
>
>

### Azure as DR site for production SAP landscapes

Since Mid 2014, extensions to various components around Hyper-V, System Center, and Azure enable the usage of Azure as DR site for VMs running on-premises based on Hyper-V.

A blog detailing how to deploy this solution is documented here:
<https://blogs.msdn.com/b/saponsqlserver/archive/2014/11/19/protecting-sap-solutions-with-azure-site-recovery.aspx>.

## Summary

The key points of High Availability for SAP systems in Azure are:

* At this point in time, the SAP single point of failure cannot be secured exactly the same way as it can be done in on-premises deployments. The reason is that Shared Disk clusters can't yet be built in Azure without the use of 3rd party software.
* For the DBMS layer, you need to use DBMS functionality that does not rely on shared disk cluster technology. Details are documented in the [DBMS Guide][dbms-guide].
* To minimize the impact of problems within Fault Domains in the Azure infrastructure or host maintenance, you should use Azure availability sets:
  * It is recommended to have one availability set for the SAP application layer.
  * It is recommended to have a separate availability set for the SAP DBMS layer.
  * It is NOT recommended to apply the same availability set for VMs of different SAP systems.
  * It is recommended to use Premium Managed Disks.
* For Backup purposes of the SAP DBMS layer, check the [DBMS Guide][dbms-guide].
* Backing up SAP Dialog instances makes little sense since it is usually faster to redeploy simple dialog instances.
* Backing up the VM, which contains the global directory of the SAP system and with it all the profiles of the different instances, does make sense and should be performed with Windows Backup or, for example, tar on Linux. Since there are differences between Windows Server 2008 (R2) and Windows Server 2012 (R2), which make it easier to back up using the more recent Windows Server releases, we recommend running Windows Server 2012 (R2) as Windows guest operating system.

## Next steps
Read the articles:

- [Azure Virtual Machines deployment for SAP NetWeaver](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/deployment-guide)
- [Considerations for Azure Virtual Machines DBMS deployment for SAP workload](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/dbms_guide_general)
- [SAP HANA infrastructure configurations and operations on Azure](https://docs.microsoft.com/
- azure/virtual-machines/workloads/sap/hana-vm-operations)
