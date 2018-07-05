---
title: Considerations for Azure Virtual Machines DBMS deployment for SAP workload | Microsoft Docs
description:Considerations for Azure Virtual Machines DBMS deployment for SAP workload
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



# Considerations for Azure Virtual Machines DBMS deployment for SAP NetWeaver


[!INCLUDE [learn-about-deployment-models](../../../../includes/learn-about-deployment-models-rm-include.md)]

This guide is part of the documentation on implementing and deploying the SAP software on Microsoft Azure. Before reading this guide, read the [Planning and Implementation Guide][planning-guide]. This document covers the  generic deployment aspects of SAP related DBMS systems on Microsoft Azure Virtual Machines (VMs) using the Azure Infrastructure as a Service (IaaS) capabilities.

The paper complements the SAP Installation Documentation and SAP Notes, which represent the primary resources for installations and deployments of SAP software on given platforms.

In this chapter, considerations of running SAP-related DBMS systems in Azure VMs are introduced. There are few references to specific DBMS systems in this chapter. Instead the specific DBMS systems are handled within this paper, after this chapter.

## Definitions upfront
Throughout the document, we use the following terms:

* IaaS: Infrastructure as a Service.
* PaaS: Platform as a Service.
* SaaS: Software as a Service.
* SAP Component: an individual SAP application such as ECC, BW, Solution Manager, or EP.  SAP components can be based on traditional ABAP or Java technologies or a non-NetWeaver based application such as Business Objects.
* SAP Environment: one or more SAP components logically grouped to perform a business function such as Development, QAS, Training, DR, or Production.
* SAP Landscape: This refers to the entire SAP assets in a customer's IT landscape. The SAP landscape includes all production and non-production environments.
* SAP System: The combination of DBMS layer and application layer of, for example, an SAP ERP development system, SAP BW test system, SAP CRM production system, etc. In Azure deployments, it is not supported to divide these two layers between on-premises and Azure. This means an SAP system is either deployed on-premises or it is deployed in Azure. However, you can deploy the different systems of an SAP landscape in Azure or on-premises. For example, you could deploy the SAP CRM development and test systems in Azure but the SAP CRM production system on-premises.
* Cloud-Only deployment: A deployment where the Azure subscription is not connected via a site-to-site or ExpressRoute connection to the on-premises network infrastructure. In common Azure documentation these kinds of deployments are also described as "Cloud-Only" deployments. Virtual Machines deployed with this method are accessed through the Internet and public Internet endpoints assigned to the VMs in Azure. The on-premises Active Directory (AD) and DNS is not extended to Azure in these types of deployments. Hence the VMs are not part of the on-premises Active Directory. Note: Cloud-Only deployments in this document are defined as complete SAP landscapes, which are running exclusively in Azure without extension of Active Directory or name resolution from on-premises into public cloud. Cloud-Only configurations are not supported for production SAP systems or configurations where SAP STMS or other on-premises resources need to be used between SAP systems hosted on Azure and resources residing on-premises.
* Cross-Premises: Describes a scenario where VMs are deployed to an Azure subscription that has site-to-site, multi-site, or ExpressRoute connectivity between the on-premises datacenter(s) and Azure. In common Azure documentation, these kinds of deployments are also described as Cross-Premises scenarios. The reason for the connection is to extend on-premises domains, on-premises Active Directory, and on-premises DNS into Azure. The on-premises landscape is extended to the Azure assets of the subscription. Having this extension, the VMs can be part of the on-premises domain. Domain users of the on-premises domain can access the servers and can run services on those VMs (like DBMS services). Communication and name resolution between VMs deployed on-premises and VMs deployed in Azure is possible. We expect this to be the most common scenario for deploying SAP assets on Azure. For more information, see [Planning and design for VPN gateway][https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-plan-design].

> [!NOTE]
> Cross-Premises deployments of SAP systems where Azure Virtual Machines running SAP systems are members of an on-premises domain are supported for production SAP systems. Cross-Premises configurations are supported for deploying parts or complete SAP landscapes into Azure. Even running the complete SAP landscape in Azure requires having those VMs being part of on-premises domain and ADS. In former versions of the documentation, we talked about Hybrid-IT scenarios, where the term *Hybrid* is rooted in the fact that there is a cross-premises connectivity between on-premises and Azure. In this case *Hybrid* also means that the VMs in Azure are part of the on-premises Active Directory.
> 
> 

Some Microsoft documentation describes Cross-Premises scenarios a bit differently, especially for DBMS HA configurations. In the case of the SAP-related documents, the Cross-Premises scenario boils down to having a site-to-site or private (ExpressRoute) connectivity and to the fact that the SAP landscape is distributed between on-premises and Azure.

## Resources
The  are various articles on SAP workload on Azure releasefollowing guides are available for SAP workload deployments on Azure. It is recommended to start in [SAP workload on Azure - Get Started](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/get-started) and then pick the topic of interests

The following SAP Notes are related to SAP on Azure in regards to the topic of this document:

| Note number | Title |
| --- | --- |
| [1928533] |SAP Applications on Azure: Supported Products and Azure VM types |
| [2015553] |SAP on Microsoft Azure: Support Prerequisites |
| [1999351] |Troubleshooting Enhanced Azure Monitoring for SAP |
| [2178632] |Key Monitoring Metrics for SAP on Microsoft Azure |
| [1409604] |Virtualization on Windows: Enhanced Monitoring |
| [2191498] |SAP on Linux with Azure: Enhanced Monitoring |
| [2039619] |SAP Applications on Microsoft Azure using the Oracle Database: Supported Products and Versions |
| [2233094] |DB6: SAP Applications on Azure Using IBM DB2 for Linux, UNIX, and Windows - Additional Information |
| [2243692] |Linux on Microsoft Azure (IaaS) VM: SAP license issues |
| [1984787] |SUSE LINUX Enterprise Server 12: Installation notes |
| [2002167] |Red Hat Enterprise Linux 7.x: Installation and Upgrade |
| [2069760] |Oracle Linux 7.x SAP Installation and Upgrade |
| [1597355] |Swap-space recommendation for Linux |
| [2171857] |Oracle Database 12c - file system support on Linux |
| [1114181] |Oracle Database 11g - file system support on Linux |


Also read the [SCN Wiki](https://wiki.scn.sap.com/wiki/display/HOME/SAPonLinuxNotes) that contains all SAP Notes for Linux.

You should have a working knowledge about the Microsoft Azure Architecture and how Microsoft Azure Virtual Machines are deployed and operated. You can find more information at [Azure Documentation](https://docs.microsoft.com/azure/).

Since we are discussing IaaS, in general the Windows, Linux, and DBMS installation and configuration are essentially the same as any virtual machine or bare metal machine you would install on-premises. However, there are some architecture and system management implementation decisions, which are different when utilizing IaaS. The purpose of this document is to explain the specific architectural and system management differences that you must be prepared for when using IaaS.

In general, the overall areas of difference that this paper discusses are:

* Planning the proper VM/disk layout of SAP systems to ensure you have the proper data file layout and can achieve enough IOPS for your workload.
* Networking considerations when using IaaS.
* Specific database features to use in order to optimize the database layout.
* Backup and restore considerations in IaaS.
* Utilizing different types of images for deployment.
* High Availability in Azure IaaS.

## <a name="65fa79d6-a85f-47ee-890b-22e794f51a64"></a>Structure of an RDBMS Deployment
In order to follow this chapter, it is necessary to understand what was presented in [this][deployment-guide-3] chapter of the [Deployment Guide][deployment-guide]. Knowledge about the different VM-Series and their differences and differences of Azure Standard and Premium Storage should be understood and known before reading this chapter.

Until March 2015, disks, which contain an operating system were limited to 127 GB in size. This limitation got lifted in March 2015 (for more information check <https://azure.microsoft.com/blog/2015/03/25/azure-vm-os-drive-limit-octupled/>). From there on disks containing the operating system can have the same size as any other disk. Nevertheless, we still prefer a structure of deployment where the operating system, DBMS, and eventual SAP binaries are separate from the database files. Therefore, we expect SAP systems running in Azure Virtual Machines have the base VM (or disk) installed with the operating system, database management system executables, and SAP executables. The DBMS data and log files are stored in Azure Storage (Standard or Premium Storage) in separate disks and attached as logical disks to the original Azure operating system image VM. 

Dependent on leveraging Azure Standard or Premium Storage (for example by using the DS-series or GS-series VMs) there are other quotas in Azure, which are documented [here (Linux)][virtual-machines-sizes-linux] and [here (Windows)][virtual-machines-sizes-windows]. When planning your disk layout, you need to find the best balance of the quotas for the following items:

* The number of data files.
* The number of disks that contain the files.
* The IOPS quotas of a single disk.
* The data throughput per disk.
* The number of additional data disks possible per VM size.
* The overall storage throughput a VM can provide.

Azure enforces an IOPS quota per data disk. These quotas are different for disks hosted on Azure Standard Storage and Premium Storage. I/O latencies are also very different between the two storage types with Premium Storage delivering factors better I/O latencies. Each of the different VM types has a limited number of data disks that you are able to attach. Another restriction is that only certain VM types can leverage Azure Premium Storage. This means the decision for a certain VM type might not only be driven by the CPU and memory requirements, but also by the IOPS, latency and disk throughput requirements that usually are scaled with the number of disks or the type of Premium Storage disks. Especially with Premium Storage the size of a disk also might be dictated by the number of IOPS and throughput that needs to be achieved by each disk.

The fact that the overall IOPS rate, the number of disks mounted, and the size of the VM are all tied together, might cause an Azure configuration of an SAP system to be different than its on-premises deployment. The IOPS limits per LUN are usually configurable in on-premises deployments. Whereas with Azure Storage those limits are fixed or as in Premium Storage dependent on the disk type. So with on-premises deployments we see customer configurations of database servers that are using many different volumes for special executables like SAP and the DBMS or special volumes for temporary databases or table spaces. When such an on-premises system is moved to Azure, it might lead to a waste of potential IOPS bandwidth by wasting a disk for executables or databases, which do not perform any or not a lot of IOPS. Therefore, in Azure VMs we recommend that the DBMS and SAP executables be installed on the OS disk if possible.

The placement of the database files and log files and the type of Azure Storage used, should be defined by IOPS, latency, and throughput requirements. In order to have enough IOPS for the transaction log, you might be forced to leverage multiple disks for the transaction log file or use a larger Premium Storage disk. In such a case one would build a software RAID (for example Windows Storage Pool for Windows or MDADM and LVM (Logical Volume Manager) for Linux) with the disks, which contain the transaction log.

- - -
> ![Windows][Logo_Windows] Windows
> 
> Drive D:\ in an Azure VM is a non-persisted drive, which is backed by some local disks on the Azure compute node. Because it is non-persisted, this means that any changes made to the content on the D:\ drive is lost when the VM is rebooted. By "any changes", we mean saved files, directories created, applications installed, etc.
> 
> ![Linux][Logo_Linux] Linux
> 
> Linux Azure VMs automatically mount a drive at /mnt/resource that is a non-persisted drive backed by local disks on the Azure compute node. Because it is non-persisted, this means that any changes made to content in /mnt/resource are lost when the VM is rebooted. By any changes, we mean files saved, directories created, applications installed, etc.
> 
> 

- - -
Dependent on the Azure VM-series, the local disks on the compute node show different performance, which can be categorized like:

* A0-A7: Very limited performance. Not usable for anything beyond windows page file
* A8-A11: Very good performance characteristics with some ten thousand IOPS and >1GB/sec throughput
* D-Series: Very good performance characteristics with some ten thousand IOPS and >1GB/sec throughput
* DS-Series: Very good performance characteristics with some ten thousand IOPS and >1GB/sec throughput
* G-Series: Very good performance characteristics with some ten thousand IOPS and >1GB/sec throughput
* GS-Series: Very good performance characteristics with some ten thousand IOPS and >1GB/sec throughput

Statements above are applying to the VM types that are certified with SAP. The VM-series with excellent IOPS and throughput qualify for leverage by some DBMS features, like tempdb or temporary table space.

### <a name="c7abf1f0-c927-4a7c-9c1d-c7b5b3b7212f"></a>Caching for VMs and data disks
When we create data disks through the portal or when we mount uploaded disks to VMs, we can choose whether the I/O traffic between the VM and those disks located in Azure storage are cached. Azure Standard and Premium Storage use two different technologies for this type of cache. In both cases, the cache itself would be disk backed on the same drives used by the temporary disk (D:\ on Windows or /mnt/resource on Linux) of the VM.

For Azure Standard Storage the possible cache types are:

* No caching
* Read caching
* Read and Write caching

In order to get consistent and deterministic performance, you should set the caching on Azure Standard Storage for all disks containing **DBMS-related data files, log files, and table space to 'NONE'**. The caching of the VM can remain with the default.

For Azure Premium Storage the following caching options exist:

* No caching
* Read caching

Recommendation for Azure Premium Storage is to leverage **Read caching for data files** of the SAP database and chose **No caching for the disks of log file(s)**.

### <a name="c8e566f9-21b7-4457-9f7f-126036971a91"></a>Software RAID
As already stated above, you need to balance the number of IOPS needed for the database files across the number of disks you can configure and the maximum IOPS an Azure VM provides per disk or Premium Storage disk type. Easiest way to deal with the IOPS load over disks is to build a software RAID over the different disks. Then place a number of data files of the SAP DBMS on the LUNS carved out of the software RAID. Dependent on the requirements you might want to consider the usage of Premium Storage as well since two of the three different Premium Storage disks provide higher IOPS quota than disks based on Standard Storage. Besides the significant better I/O latency provided by Azure Premium Storage. 

Same applies to the transaction log of the different DBMS systems. With many of them adding more Tlog files does not help since the DBMS systems write into one of the files at a time only. If higher IOPS rates are needed than a single Standard Storage based disk can deliver, you can stripe over multiple Standard Storage disks or you can use a larger Premium Storage disk type that beyond higher IOPS rates also delivers factors lower latency for the write I/Os into the transaction log.

Situations experienced in Azure deployments, which would favor using a software RAID are:

* Transaction Log/Redo Log require more IOPS than Azure provides for a single disk. As mentioned above this can be solved by building a LUN over multiple disks using a software RAID.
* Uneven I/O workload distribution over the different data files of the SAP database. In such cases one can experience one data file hitting the quota rather often. Whereas other data files are not even getting close to the IOPS quota of a single disk. In such cases the easiest solution is to build one LUN over multiple disks using a software RAID. 
* You don't know what the exact I/O workload per data file is and only roughly know what the overall IOPS workload against the DBMS is. Easiest to do is to build one LUN with the help of a software RAID. The sum of quotas of multiple disks behind this LUN should then fulfill the known IOPS rate.

- - -
> ![Windows][Logo_Windows] Windows
> 
> We recommend using Windows Storage Spaces if you run on Windows Server 2012 or higher. It is more efficient than Windows Striping of earlier Windows versions. You might need to create the Windows Storage Pools and Storage Spaces by PowerShell commands when using Windows Server 2012 as Operating System. The PowerShell commands can be found here <https://technet.microsoft.com/library/jj851254.aspx>
> 
> ![Linux][Logo_Linux] Linux
> 
> Only MDADM and LVM (Logical Volume Manager) are supported to build a software RAID on Linux. For more information, read the following articles:
> 
> * [Configure Software RAID on Linux][virtual-machines-linux-configure-raid] (for MDADM)
> * [Configure LVM on a Linux VM in Azure][virtual-machines-linux-configure-lvm]
> 
> 

- - -
Considerations for leveraging VM-series, which are able to work with Azure Premium Storage usually are:

* Demands for I/O latencies that are close to what SAN/NAS devices deliver.
* Demand for factors better I/O latency than Azure Standard Storage can deliver.
* Higher IOPS per VM than what could be achieved with multiple Standard Storage disks against a certain VM type.

Since the underlying Azure Storage replicates each disk to at least three storage nodes, simple RAID 0 striping can be used. There is no need to implement RAID5 or RAID1.

### <a name="10b041ef-c177-498a-93ed-44b3441ab152"></a>Microsoft Azure Storage
Microsoft Azure Storage stores the base VM (with OS) and disks or BLOBs to at least three separate storage nodes. When creating a storage account or managed disk, there is a choice of protection as shown here:

![Geo-Replication enabled for Azure Storage account][dbms-guide-figure-100]

Azure Storage Local Replication (Locally Redundant) provides levels of protection against data loss due to infrastructure failure that few customers could afford to deploy. As shown above there are four different options with a fifth being a variation of one of the first three. Looking closer at them we can distinguish:

* **Premium Locally Redundant Storage (LRS)**: Azure Premium Storage delivers high-performance, low-latency disk support for virtual machines running I/O-intensive workloads. There are three replicas of the data within the same Azure datacenter of an Azure region. The copies are in different Fault and Upgrade Domains (for concepts see [this][planning-guide-3.2] chapter in the [Planning Guide][planning-guide]). In case of a replica of the data going out of service due to a storage node failure or disk failure, a new replica is generated automatically.
* **Locally Redundant Storage (LRS)**: In this case, there are three replicas of the data within the same Azure datacenter of an Azure region. The copies are in different Fault and Upgrade Domains (for concepts see [this][planning-guide-3.2] chapter in the [Planning Guide][planning-guide]). In case of a replica of the data going out of service due to a storage node failure or disk failure, a new replica is generated automatically. 
* **Geo Redundant Storage (GRS)**: In this case, there is an asynchronous replication that feeds an additional three replicas of the data in another Azure Region, which is in most of the cases in the same geographical region (like North Europe and West Europe). This results in three additional replicas, so that there are six replicas in sum. A variation of this is an addition where the data in the geo replicated Azure region can be used for read purposes (Read-Access Geo-Redundant).
* **Zone Redundant Storage (ZRS)**: In this case, the three replicas of the data remain in the same Azure Region. As explained in [this][planning-guide-3.1] chapter of the [Planning Guide][planning-guide] an Azure region can be a number of datacenters in close proximity. In the case of LRS the replicas would be distributed over the different datacenters that make one Azure region.

More information can be found [here][storage-redundancy].

> [!NOTE]
> For DBMS deployments, the usage of Geo Redundant Storage is not recommended
> 
> Azure Storage Geo-Replication is asynchronous. Replication of individual disks mounted to a single VM are not synchronized in lock step. Therefore, it is not suitable to replicate DBMS files that are distributed over different disks or deployed against a software RAID based on multiple disks. DBMS software requires that the persistent disk storage is precisely synchronized across different LUNs and underlying disks/spindles. DBMS software uses various mechanisms to sequence IO write activities and a DBMS reports that the disk storage targeted by the replication is corrupted if these vary even by a few milliseconds. Hence if one wants a database configuration with a database stretched across multiple disks geo-replicated, such a replication needs to be performed with database means and functionality. One should not rely on Azure Storage Geo-Replication to perform this job. 
> 
> The problem is simplest to explain with an example system. Let's assume you have an SAP system uploaded into Azure, which has eight disks containing data files of the DBMS plus one disk containing the transaction log file. Each one of these nine disks have data written to them in a consistent method according to the DBMS, whether the data is being written to the data or transaction log files.
> 
> In order to properly geo-replicate the data and maintain a consistent database image, the content of all nine disks would have to be geo-replicated in the exact order the I/O operations were executed against the nine different disks. However, Azure Storage geo-replication does not allow to declare dependencies between disks. This means Microsoft Azure Storage geo-replication doesn't know about the fact that the contents in these nine different disks are related to each other and that the data changes are consistent only when replicating in the order the I/O operations happened across all the nine disks.
> 
> Besides chances being high that the geo-replicated images in the scenario do not provide a consistent database image, there also is a performance penalty that shows up with geo redundant storage that can severely impact performance. In summary, do not use this type of storage redundancy for DBMS type workloads.
> 
> 

#### Mapping VHDs into Azure Virtual Machine Service Storage Accounts
This chapter only applies to Azure Storage Accounts. If you plan to use Managed Disks, the limitations mentioned in this chapter do not apply. For more information about Managed Disks, read chapter [Managed Disks][dbms-guide-managed-disks] of this guide.

An Azure Storage Account is not only an administrative construct, but also a subject of limitations. Whereas the limitations vary on whether we talk about an Azure Standard Storage Account or an Azure Premium Storage Account. The exact capabilities and limitations are listed [here][storage-scalability-targets]

So for Azure Standard Storage it is important to note there is a limit on the IOPS per storage account (Row containing **Total Request Rate** in [the article][storage-scalability-targets]). In addition, there is an initial limit of 100 Storage Accounts per Azure subscription (as of July 2015). Therefore, it is recommended to balance IOPS of VMs between multiple storage accounts when using Azure Standard Storage. Whereas a single VM ideally uses one storage account if possible. So if we talk about DBMS deployments where each VHD that is hosted on Azure Standard Storage could reach its quota limit, you should only deploy 30-40 VHDs per Azure Storage Account that uses Azure Standard Storage. On the other hand, if you leverage Azure Premium Storage and want to store large database volumes, you might be fine in terms of IOPS. But an Azure Premium Storage Account is way more restrictive in data volume than an Azure Standard Storage Account. As a result, you can only deploy a limited number of VHDs within an Azure Premium Storage Account before hitting the data volume limit. At the end, think of an Azure Storage Account as a 'Virtual SAN' that has limited capabilities in IOPS and/or capacity. As a result, the task remains, as in on-premises deployments, to define the layout of the VHDs of the different SAP systems over the different 'imaginary SAN devices' or Azure Storage Accounts.

For Azure Standard Storage, it is not recommended to present storage from different storage accounts to a single VM if possible.

When using the DS or GS-series of Azure VMs, it is possible to mount VHDs out of Azure Standard Storage Accounts and Premium Storage Accounts. Use cases like writing backups into Standard Storage backed VHDs and having DBMS data and log files on Premium Storage come to mind where such heterogeneous storage could be leveraged. 

Based on customer deployments and testing around 30 to 40 VHDs containing database data files and log files can be provisioned on a single Azure Standard Storage Account with acceptable performance. As mentioned earlier, the limitation of an Azure Premium Storage Account is likely to be the data capacity it can hold and not IOPS.

As with SAN devices on-premises, sharing requires some monitoring in order to eventually detect bottlenecks on an Azure Storage Account. The Azure Monitoring Extension for SAP and the Azure portal are tools that can be used to detect busy Azure Storage Accounts that may be delivering suboptimal IO performance.  If this situation is detected, it is recommended to move busy VMs to another Azure Storage Account. Refer to the [Deployment Guide][deployment-guide] for details on how to activate the SAP host monitoring capabilities.

Another article summarizing best practices around Azure Standard Storage and Azure Standard Storage Accounts can be found here <https://blogs.msdn.com/b/mast/archive/2014/10/14/configuring-azure-virtual-machines-for-optimal-storage-performance.aspx>

#### <a name="f42c6cb5-d563-484d-9667-b07ae51bce29"></a>Managed Disks
Managed Disks are a new resource type in Azure Resource Manager that can be used instead of VHDs that are stored in Azure Storage Accounts. Managed Disks automatically align with the Availability Set of the virtual machine they are attached to and therefore increase the availability of your virtual machine and the services that are running on the virtual machine. To learn more, read the [overview article](https://docs.microsoft.com/azure/storage/storage-managed-disks-overview).

SAP currently only supports Premium Managed Disks. Read SAP Note [1928533] for more details.

#### Moving deployed DBMS VMs from Azure Standard Storage to Azure Premium Storage
We encounter quite some scenarios where you as customer want to move a deployed VM from Azure Standard Storage into Azure Premium Storage. If your disks are stored in Azure Storage Accounts, this is not possible without physically moving the data. There are several ways to achieve the goal:

* You could copy all VHDs, base VHD as well as data VHDs into a new Azure Premium Storage Account. Often you chose the number of VHDs in Azure Standard Storage not because of the fact that you needed the data volume. But you needed that many VHDs because of the IOPS. Now that you move to Azure Premium Storage you could go with way fewer VHDs to achieve the same IOPS throughput. Given the fact that in Azure Standard Storage you pay for the used data and not the nominal disk size, the number of VHDs did not matter in terms of costs. However, with Azure Premium Storage, you would pay for the nominal disk size. Therefore, most of the customers try to keep the number of Azure VHDs in Premium Storage at the number needed to achieve the IOPS throughput necessary. So, most customers decide against the way of a simple 1:1 copy.
* If not yet mounted, you mount a single VHD that can contain a database backup of your SAP database. After the backup, you unmount all VHDs including the VHD containing the backup and copy the base VHD and the VHD with the backup into an Azure Premium Storage account. You would then deploy the VM based on the base VHD and mount the VHD with the backup. Now you create additional empty Premium Storage Disks for the VM that are used to restore the database into. This assumes that the DBMS allows you to change paths to the data and log files as part of the restore process.
* Another possibility is a variation of the former process, where you copy the backup VHD into Azure Premium Storage and attach it against a VM that you newly deployed and installed.
* The fourth possibility you would choose when you are in need to change the number of data files of your database. In such a case, you would perform an SAP homogenous system copy using export/import. Put those export files into a VHD that is copied into an Azure Premium Storage Account and attach it to a VM that you use to run the import processes. Customers use this possibility mainly when they want to decrease the number of data files.

If you use Managed Disks, you can migrate to Premium Storage by:

1. Deallocate the virtual machine
1. If necessary, resize the virtual machine to a size that supports Premium Storage (for example DS or GS)
1. Change the Managed Disk account type to Premium (SSD)
1. Change the caching of the data disks as recommended in chapter [Caching for VMs and data disks][dbms-guide-2.1]
1. Start your virtual machine

### Deployment of VMs for SAP in Azure
Microsoft Azure offers multiple ways to deploy VMs and associated disks. Thereby it is important to understand the differences since preparations of the VMs might differ dependent on the way of deployment. In general, we look into the scenarios described in the following chapters.

#### Deploying a VM from the Azure Marketplace
You like to take a Microsoft or third party provided image from the Azure Marketplace to deploy your VM. After you deployed your VM in Azure, you follow the same guidelines and tools to install the SAP software inside your VM as you would do in an on-premises environment. For installing the SAP software inside the Azure VM, SAP and Microsoft recommend uploading and store the SAP installation media in disks or to create an Azure VM working as a 'File server', which contains all the necessary SAP installation media.

#### Deploying a VM with a customer-specific generalized image
Due to specific patch requirements regarding your OS or DBMS version, the provided images in the Azure Marketplace might not fit your needs. Therefore, you might need to create a VM using your own 'private' OS/DBMS VM image, which can be deployed several times afterwards. To prepare such a 'private' image for duplication, the OS must be generalized on the on-premises VM. Refer to the [Deployment Guide][deployment-guide] for details on how to generalize a VM.

If you have already installed SAP content in your on-premises VM (especially for 2-Tier systems), you can adapt the SAP system settings after the deployment of the Azure VM through the instance rename procedure supported by the SAP Software Provisioning Manager (SAP Note [1619720]). Otherwise you can install the SAP software later after the deployment of the Azure VM.

As of the database content used by the SAP application, you can either generate the content freshly by an SAP installation or you can import your content into Azure by using a VHD with a DBMS database backup or by leveraging capabilities of the DBMS to directly back up into Microsoft Azure Storage. In this case, you could also prepare VHDs with the DBMS data and log files on-premises and then import those as Disks into Azure. But the transfer of DBMS data, which is getting loaded from on-premises to Azure would work over VHD disks that need to be prepared on-premises.

#### Moving a VM from on-premises to Azure with a non-generalized disk
You plan to move a specific SAP system from on-premises to Azure (lift and shift). This can be done by uploading the disk, which contains the OS, the SAP binaries, and eventual DBMS binaries plus the disks with the data and log files of the DBMS to Azure. In opposite to scenario #2 above, you keep the hostname, SAP SID, and SAP user accounts in the Azure VM as they were configured in the on-premises environment. Therefore, generalizing the image is not necessary. This case mostly applies for Cross-Premises scenarios where a part of the SAP landscape is run on-premises and parts on Azure.

## <a name="871dfc27-e509-4222-9370-ab1de77021c3"></a>High Availability and Disaster Recovery with Azure VMs
Azure offers the following High Availability (HA) and Disaster Recovery (DR) functionalities, which apply to different components we would use for SAP and DBMS deployments

### VMs deployed on Azure Nodes
The Azure Platform does not offer features such as Live Migration for deployed VMs. This means if there is maintenance necessary on a server cluster on which a VM is deployed, the VM needs to get stopped and restarted. Maintenance in Azure is performed using so called Upgrade Domains within clusters of servers. Only one Upgrade Domain at a time is being maintained. During such a restart, there is an interruption of service while the VM is shut down, maintenance is performed and VM restarted. Most DBMS vendors however provide High Availability and Disaster Recovery functionality that quickly restarts the DBMS services on another node if the primary node is unavailable. The Azure Platform offers functionality to distribute VMs, Storage, and other Azure services across Upgrade Domains to ensure that planned maintenance or infrastructure failures would only impact a small subset of VMs or services.  With careful planning, it is possible to achieve availability levels comparable to on-premises infrastructures.

Microsoft Azure Availability Sets are a logical grouping of VMs or Services that ensures VMs and other services are distributed to different Fault and Upgrade Domains within a cluster such that there would only be one node shutdown at any one point in time (read [this (Linux)][virtual-machines-manage-availability-linux] or [this (Windows)][virtual-machines-manage-availability-windows] article for more details).

It needs to be configured by purpose when rolling out VMs as seen here:

![Definition of Availability Set for DBMS HA configurations][dbms-guide-figure-200]

If we want to create highly available configurations of DBMS deployments (independent of the individual DBMS HA functionality used), the DBMS VMs would need to:

* Add the VMs to the same Azure Virtual Network (<https://azure.microsoft.com/documentation/services/virtual-network/>)
* The VMs of the HA configuration should also be in the same subnet. Name resolution between the different subnets is not possible in Cloud-Only deployments, only IP resolution works. Using site-to-site or ExpressRoute connectivity for Cross-Premises deployments, a network with at least one subnet is already established. Name resolution is done according to the on-premises AD policies and network infrastructure. 



#### IP Addresses
It is highly recommended to setup the VMs for HA configurations in a resilient way. Relying on IP addresses to address the HA partner(s) within the HA configuration is not reliable in Azure unless static IP addresses are used. There are two "Shutdown" concepts in Azure:

* Shut down through Azure portal or Azure PowerShell cmdlet Stop-AzureRmVM: In this case, the Virtual Machine gets shutdown and de-allocated. Your Azure account is no longer charged for this VM so the only charges that incur are for the storage used. However, if the private IP address of the network interface was not static, the IP address is released and it is not guaranteed that the network interface gets the old IP address assigned again after a restart of the VM. Performing the shut down through the Azure portal or by calling Stop-AzureRmVM automatically causes de-allocation. If you do not want to deallocate the machine use Stop-AzureRmVM -StayProvisioned 
* If you shut down the VM from an OS level, the VM gets shut down and NOT de-allocated. However, in this case, your Azure account is still charged for the VM, despite the fact that it is shutdown. In such a case, the assignment of the IP address to a stopped VM remains intact. Shutting down the VM from within does not automatically force de-allocation.

Even for Cross-Premises scenarios, by default a shutdown and de-allocation means de-assignment of the IP addresses from the VM, even if on-premises policies in DHCP settings are different. 

* The exception is if one assigns a static IP address to a network interface as described [here][virtual-networks-reserved-private-ip].
* In such a case the IP address remains fixed as long as the network interface is not deleted.

> [!IMPORTANT]
> In order to keep the whole deployment simple and manageable, the clear recommendation is to setup the VMs partnering in a DBMS HA or DR configuration within Azure in a way that there is a functioning name resolution between the different VMs involved.
> 
> 

## Deployment of Host Monitoring
For productive usage of SAP Applications in Azure Virtual Machines, SAP requires the ability to get host monitoring data from the physical hosts running the Azure Virtual Machines. A specific SAP Host Agent patch level is required that enables this capability in SAPOSCOL and SAP Host Agent. The exact patch level is documented in SAP Note [1409604].

For the details regarding deployment of components that deliver host data to SAPOSCOL and SAP Host Agent and the lifecycle management of those components, refer to the [Deployment Guide][deployment-guide]

