---
title: SAP ASE Azure Virtual Machines DBMS deployment for SAP workload | Microsoft Docs
description: SAP ASE Azure Virtual Machines DBMS deployment for SAP workload
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
ms.date: 02/21/2020
ms.author: juergent
ms.custom: H1Hack27Feb2017

---

[767598]:https://launchpad.support.sap.com/#/notes/767598
[826037]:https://launchpad.support.sap.com/#/notes/826037
[965908]:https://launchpad.support.sap.com/#/notes/965908
[1031096]:https://launchpad.support.sap.com/#/notes/1031096
[1114181]:https://launchpad.support.sap.com/#/notes/1114181
[1139904]:https://launchpad.support.sap.com/#/notes/1139904
[1173395]:https://launchpad.support.sap.com/#/notes/1173395
[1409604]:https://launchpad.support.sap.com/#/notes/1409604
[1585981]:https://launchpad.support.sap.com/#/notes/1585981
[1588316]:https://launchpad.support.sap.com/#/notes/1588316
[1597355]:https://launchpad.support.sap.com/#/notes/1597355
[1619720]:https://launchpad.support.sap.com/#/notes/1619720
[1619726]:https://launchpad.support.sap.com/#/notes/1619726
[1752266]:https://launchpad.support.sap.com/#/notes/1752266
[1772688]:https://launchpad.support.sap.com/#/notes/1772688
[1814258]:https://launchpad.support.sap.com/#/notes/1814258
[1909114]:https://launchpad.support.sap.com/#/notes/1909114
[1941500]:https://launchpad.support.sap.com/#/notes/1941500
[1984787]:https://launchpad.support.sap.com/#/notes/1984787
[1999351]:https://launchpad.support.sap.com/#/notes/1999351
[2002167]:https://launchpad.support.sap.com/#/notes/2002167
[2015553]:https://launchpad.support.sap.com/#/notes/2015553
[2039619]:https://launchpad.support.sap.com/#/notes/2039619
[2069760]:https://launchpad.support.sap.com/#/notes/2069760
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
[virtual-machines-sql-server-high-availability-and-disaster-recovery-solutions]:./../../windows/sql/virtual-machines-windows-sql-high-availability-dr.md
[virtual-machines-sql-server-infrastructure-services]:./../../windows/sql/virtual-machines-windows-sql-server-iaas-overview.md
[virtual-machines-sql-server-performance-best-practices]:./../../windows/sql/virtual-machines-windows-sql-performance.md
[virtual-machines-upload-image-windows-resource-manager]:../../virtual-machines-windows-upload-image.md
[virtual-machines-windows-tutorial]:../../virtual-machines-windows-hero-tutorial.md
[virtual-machines-workload-template-sql-alwayson]:https://azure.microsoft.com/resources/templates/sql-server-2014-alwayson-existing-vnet-and-ad/
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


# SAP ASE Azure Virtual Machines DBMS deployment for SAP workload

In this document, covers several different areas to consider when deploying SAP ASE in Azure IaaS. As a precondition to this document, you should have read the document [Considerations for Azure Virtual Machines DBMS deployment for SAP workload](dbms_guide_general.md) and other guides in the [SAP workload on Azure documentation](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/get-started). This document covers SAP ASE running on Linux and on Windows Operating Systems. The minimum supported release on Azure is SAP ASE 16.0 Patch Level 2.  It is recommended to deploy the latest version of SAP and the latest Patch Level.  As a minimum SAP ASE 16.3 Patch Level 7 is recommended.  The most recent version of SAP can be found in [Targeted ASE 16.0 Release Schedule and CR list Information](https://wiki.scn.sap.com/wiki/display/SYBASE/Targeted+ASE+16.0+Release+Schedule+and+CR+list+Information).

Additional information about release support with SAP applications or installation media location are found, besides in the SAP Product Availability Matrix in these locations:

- [SAP support note #2134316](https://launchpad.support.sap.com/#/notes/2134316)
- [SAP support note #1941500](https://launchpad.support.sap.com/#/notes/1941500)
- [SAP support note #1590719](https://launchpad.support.sap.com/#/notes/1590719)
- [SAP support note #1973241](https://launchpad.support.sap.com/#/notes/1973241)

Remark: Throughout documentation within and outside the SAP world, the name of the product is referenced as Sybase ASE or SAP ASE or in some cases both. In order to stay consistent, we use the name **SAP ASE** in this documentation.

## Operating system support
The SAP Product Availability Matrix contains the supported Operating System and SAP Kernel combinations for each SAP application.  Linux distributions SUSE 12.x, SUSE 15.x, Red Hat 7.x are fully supported.  Oracle Linux as operating system for SAP ASE is not supported.  It is recommended to use the most recent Linux releases available. Windows customers should use Windows Server 2016 or Windows Server 2019 releases.  Older releases of Windows such as Windows 2012 are technically supported but the latest Windows version is always recommended.


## Specifics to SAP ASE on Windows
Starting with Microsoft Azure, you can migrate your existing SAP ASE applications to Azure Virtual Machines. SAP ASE in an Azure Virtual Machine enables you to reduce the total cost of ownership of deployment, management, and maintenance of enterprise breadth applications by easily migrating these applications to Microsoft Azure. With SAP ASE in an Azure Virtual Machine, administrators and developers can still use the same development and administration tools that are available on-premises.

Microsoft Azure offers numerous different virtual machine types that allow you to run smallest SAP systems and landscapes up to large SAP systems and landscapes with thousands of users. SAP sizing SAPS numbers of the different SAP certified VM SKUs is provided in [SAP support note #1928533](https://launchpad.support.sap.com/#/notes/1928533).

Documentation to install SAP ASE on Windows can be found in the [SAP ASE Installation Guide for Windows](https://help.sap.com/viewer/36031975851a4f82b1022a9df877280b/16.0.3.7/en-US/a660d3f1bc2b101487cbdbf10069c3ac.html)

Lock Pages in Memory is a setting that will prevent the SAP ASE database buffer from being paged out.  This setting is useful for large busy systems with a lot of memory. Contact BC-DB-SYB for more information. 


## Linux operating system specific settings
On Linux VMs, run `saptune` with profile SAP-ASE 
Linux Huge Pages should be enabled by default and can be verified with command  

`cat /proc/meminfo` 

The page size is typically 2048 KB. For details see the article [Huge Pages on Linux](https://help.sap.com/viewer/ecbccd52e7024feaa12f4e780b43bc3b/16.0.3.7/en-US/a703d580bc2b10149695f7d838203fad.html) 


## Recommendations on VM and disk structure for SAP-related SAP ASE deployments

SAP ASE for SAP NetWeaver Applications is supported on any VM type listed in [SAP support note #1928533](https://launchpad.support.sap.com/#/notes/1928533)
Typical VM types used for medium size SAP ASE database servers include Esv3.  Large multi-terabyte databases can leverage M-series VM types. 
The SAP ASE transaction log disk write performance may be improved by enabling the M-series Write Accelerator. Write Accelerator should be tested carefully with SAP ASE due to the way that SAP ASE performs Log Writes.  Review [SAP support note #2816580](https://docs.microsoft.com/azure/virtual-machines/windows/how-to-enable-write-accelerator) and consider running a performance test.  
Write Accelerator is designed for transaction log disk only. The disk level cache should be set to NONE. Don't be surprised if Azure Write Accelerator does not show similar improvements as with other DBMS. Based on the way SAP ASE writes into the transaction log, it could be that there is little to no acceleration by Azure Write Accelerator.
Separate disks are recommended for Data devices and Log Devices.  The system databases sybsecurity and `saptools` do not require dedicated disks and can be placed on the disks containing the SAP Database Data and Log devices 

![Storage configuration for SAP ASE](./media/dbms-guide-sapase/sapase-disk-structure.png)

### File Systems, Stripe Size & IO balancing 
SAP ASE writes data sequentially into disk storage devices unless configured otherwise. This means an empty SAP ASE database with four devices will write data into the first device only.  The other disk devices will only be written to when the first device is full.  The amount of READ and WRITE IO to each SAP ASE device is likely to be different. To balance disk IO across all available Azure disks either Windows Storage Spaces or Linux LVM2 needs to be used. On Linux, it is recommended to use XFS file system to format the disks. The LVM stripe size should be tested with a performance test. 128 KB stripe size is a good starting point. On Windows, the NTFS Allocation Unit Size (AUS) should be tested. 64 KB can be used as a starting value. 

It is recommended to configure Automatic Database Expansion as described in the article [Configuring Automatic Database Space Expansion in SAP Adaptive Server Enterprise](https://blogs.sap.com/2014/07/09/configuring-automatic-database-space-expansion-in-sap-adaptive-server-enterprise/)  and [SAP support note #1815695](https://launchpad.support.sap.com/#/notes/1815695). 

### Sample SAP ASE on Azure virtual machine, disk and file system configurations 
The templates below show sample configurations for both Linux and Windows. Before confirming the virtual machine and disk configuration ensure that the network and storage bandwidth quotas of the individual VM are sufficient to meet the business requirement. Also keep in mind that different Azure VM types have different maximum numbers of disks that can be attached to the VM. For example, a E4s_v3 VM  has a limit 48 MB/sec storage IO throughput. If the storage throughput required by database backup activity demands more than 48 MB/sec then a larger VM type with more storage bandwidth throughput is unavoidable. When configuring Azure storage, you also need to keep in mind that especially with [Azure Premium storage](https://docs.microsoft.com/azure/virtual-machines/windows/premium-storage-performance) the throughput and IOPS per GB of capacity do change. See more on this topic in the article [What disk types are available in Azure?](https://docs.microsoft.com/azure/virtual-machines/windows/disks-types). The quotas for specific Azure VM types are documented in the article [Memory optimized virtual machine sizes](https://docs.microsoft.com/azure/virtual-machines/sizes-memory) and articles linked to it. 

> [!NOTE]
>  If a DBMS system is being moved from on-premises to Azure, it is recommended to perform monitoring on the VM and assess the CPU, memory, IOPS and storage throughput. Compare the peak values observed with the VM quota limits documented in the articles mentioned above

The examples given below are for illustrative purposes and can be modified based on individual needs. Due to the design of SAP ASE, the number of data devices is not as critical as with other databases. The number of data devices detailed in this document is a guide only. 

An example of a configuration for a small SAP ASE DB Server with a database size between 50 GB – 250 GB, such as SAP solution Manager, could look like

| Configuration | Windows | Linux | Comments |
| --- | --- | --- | --- |
| VM Type | E4s_v3 (4 vCPU/32 GB RAM) | E4s_v3 (4 vCPU/32 GB RAM) | --- |
| Accelerated Networking | Enable | Enable | ---|
| SAP ASE version | 16.3 PL 7 or higher | 16.3 PL 7 or higher | --- |
| # of data devices | 4 | 4 | ---|
| # of log devices | 1 | 1 | --- |
| # of temp devices | 1 | 1 | more for SAP BW workload |
| Operating system | Windows Server 2019 | SUSE 12 SP4/ 15 SP1 or RHEL 7.6 | --- |
| Disk aggregation | Storage Spaces | LVM2 | --- |
| File system | NTFS | XFS |
| Format block size | needs workload testing | needs workload testing | --- |
| # and type of data disks | Premium storage: 2 x P10 (RAID0) | Premium storage: 2 x P10 (RAID0)| Cache = Read Only |
| # and type of log disks | Premium storage: 1 x P20  | Premium storage: 1 x P20 | Cache = NONE |
| ASE MaxMemory parameter | 90% of Physical RAM | 90% of Physical RAM | assuming single instance |
| # of backup devices | 4 | 4| --- |
| # and type of backup disks | 1 | 1 | --- |


An example of a configuration for a medium SAP ASE DB Server with a database size between 250 GB – 750 GB, such as a smaller SAP Business Suite system, could look like

| Configuration | Windows | Linux | Comments |
| --- | --- | --- | --- |
| VM Type | E16s_v3 (16 vCPU/128 GB RAM) | E16s_v3 (16 vCPU/128 GB RAM) | --- |
| Accelerated Networking | Enable | Enable | ---|
| SAP ASE version | 16.3 PL 7 or higher | 16.3 PL 7 or higher | --- |
| # of data devices | 8 | 8 | ---|
| # of log devices | 1 | 1 | --- |
| # of temp devices | 1 | 1 | more for SAP BW workload |
| Operating system | Windows Server 2019 | SUSE 12 SP4/ 15 SP1 or RHEL 7.6 | --- |
| Disk aggregation | Storage Spaces | LVM2 | --- |
| File system | NTFS | XFS |
| Format block size | needs workload testing | needs workload testing | --- |
| # and type of data disks | Premium storage: 4 x P20 (RAID0) | Premium storage: 4 x P20 (RAID0)| Cache = Read Only |
| # and type of log disks | Premium storage: 1 x P20  | Premium storage: 1 x P20 | Cache = NONE |
| ASE MaxMemory parameter | 90% of Physical RAM | 90% of Physical RAM | assuming single instance |
| # of backup devices | 4 | 4| --- |
| # and type of backup disks | 1 | 1 | --- |

An example of a configuration for a small SAP ASE DB Server with a database size between 750 GB – 2000 GB, such as a larger SAP Business Suite system, could look like

| Configuration | Windows | Linux | Comments |
| --- | --- | --- | --- |
| VM Type | E64s_v3 (64 vCPU/432 GB RAM) | E64s_v3 (64 vCPU/432 GB RAM) | --- |
| Accelerated Networking | Enable | Enable | ---|
| SAP ASE version | 16.3 PL 7 or higher | 16.3 PL 7 or higher | --- |
| # of data devices | 16 | 16 | ---|
| # of log devices | 1 | 1 | --- |
| # of temp devices | 1 | 1 | more for SAP BW workload |
| Operating system | Windows Server 2019 | SUSE 12 SP4/ 15 SP1 or RHEL 7.6 | --- |
| Disk aggregation | Storage Spaces | LVM2 | --- |
| File system | NTFS | XFS |
| Format block size | needs workload testing | needs workload testing | --- |
| # and type of data disks | Premium storage: 4 x P30 (RAID0) | Premium storage: 4 x P30 (RAID0)| Cache = Read Only |
| # and type of log disks | Premium storage: 1 x P20  | Premium storage: 1 x P20 | Cache = NONE |
| ASE MaxMemory parameter | 90% of Physical RAM | 90% of Physical RAM | assuming single instance |
| # of backup devices | 4 | 4| --- |
| # and type of backup disks | 1 | 1 | --- |


An example of a configuration for a small SAP ASE DB Server with a database size of 2 TB+, such as a larger globally used SAP Business Suite system, could look like

| Configuration | Windows | Linux | Comments |
| --- | --- | --- | --- |
| VM Type | M-Series (1.0 to 4.0 TB RAM)  | M-Series (1.0 to 4.0 TB RAM) | --- |
| Accelerated Networking | Enable | Enable | ---|
| SAP ASE version | 16.3 PL 7 or higher | 16.3 PL 7 or higher | --- |
| # of data devices | 32 | 32 | ---|
| # of log devices | 1 | 1 | --- |
| # of temp devices | 1 | 1 | more for SAP BW workload |
| Operating system | Windows Server 2019 | SUSE 12 SP4/ 15 SP1 or RHEL 7.6 | --- |
| Disk aggregation | Storage Spaces | LVM2 | --- |
| File system | NTFS | XFS |
| Format block size | needs workload testing | needs workload testing | --- |
| # and type of data disks | Premium storage: 4+ x P30 (RAID0) | Premium storage: 4+ x P30 (RAID0)| Cache = Read Only, Consider Azure Ultra disk |
| # and type of log disks | Premium storage: 1 x P20  | Premium storage: 1 x P20 | Cache = NONE, Consider Azure Ultra disk |
| ASE MaxMemory parameter | 90% of Physical RAM | 90% of Physical RAM | assuming single instance |
| # of backup devices | 16 | 16 | --- |
| # and type of backup disks | 4 | 4 | Use LVM2/Storage Spaces |


### Backup & restore considerations for SAP ASE on Azure
Increasing the number of data and backup devices increases backup and restore performance. It is recommended to stripe the Azure disks that are hosting the SAP ASE backup device as show in the tables shown earlier. Care should be taken to balance the number of backup devices and disks and ensure that backup throughput should not exceed 40%-50% of total VM throughput quota. It is recommended to use SAP Backup Compression as a default. More details can be found in the articles:

- [SAP support note #1588316](https://launchpad.support.sap.com/#/notes/1588316)
- [SAP support note #1801984](https://launchpad.support.sap.com/#/notes/1801984)
- [SAP support note #1585981](https://launchpad.support.sap.com/#/notes/1585981) 

Do not use drive D:\ or /temp space as database or log dump destination.

### Impact of Database Compression
In configurations where I/O bandwidth can become a limiting factor, measures, which reduce IOPS might help to stretch the workload one can run in an IaaS scenario like Azure. Therefore, it is recommended to make sure that SAP ASE compression is used before uploading an existing SAP database to Azure.

The recommendation to apply compression before uploading to Azure is given out of several reasons:

* The amount of data to be uploaded to Azure is lower
* The duration of the compression execution is shorter assuming that one can use stronger hardware with more CPUs or higher I/O bandwidth or less I/O latency on-premises
* Smaller database sizes might lead to less costs for disk allocation

Data- and LOB-Compression work in a VM hosted in Azure Virtual Machines as it does on-premises. For more details on how to check if compression is already in use in an existing SAP ASE database, check [SAP support note 1750510](https://launchpad.support.sap.com/#/notes/1750510). For more details on SAP ASE database compression check [SAP support note #2121797](https://launchpad.support.sap.com/#/notes/2121797)

## High Availability of SAP ASE on Azure 
The HADR Users Guide details the setup and configuration of a 2 node SAP ASE “Always-on” solution.  In addition, a third disaster recovery node is also supported. SAP ASE supports many High Available configurations including shared disk and native OS clustering (floating IP). The only supported configuration on Azure is using Fault Manager without Floating IP.  The Floating IP Address method will not work on Azure.  The SAP Kernel is an “HA Aware” application and knows about the primary and secondary SAP ASE servers. There are no close integrations between the SAP ASE and Azure, the Azure Internal load balancer is not used. Therefore, the standard SAP ASE documentation should be followed starting with [SAP ASE HADR Users Guide](https://help.sap.com/viewer/efe56ad3cad0467d837c8ff1ac6ba75c/16.0.3.7/en-US/a6645e28bc2b1014b54b8815a64b87ba.html) 

> [!NOTE]
> The only supported configuration on Azure is using Fault Manager without Floating IP.  The Floating IP Address method will not work on Azure. 

### Third node for disaster recovery
Beyond using SAP ASE Always-On for local high availability, you might want to extend the configuration to an asynchronously replicated node in another Azure region. Documentation for such a scenario can be found [here](https://techcommunity.microsoft.com/t5/running-sap-applications-on-the/installation-procedure-for-sybase-16-3-patch-level-3-always-on/ba-p/368199).

## SAP ASE Database Encryption & SSL 
SAP Software provisioning Manager (SWPM) is giving an option to encrypt the database during installation.  If you want to use encryption, it is recommended to use SAP Full Database Encryption.  See details documented in:

- [SAP support note #2556658](https://launchpad.support.sap.com/#/notes/2556658)
- [SAP support note #2224138](https://launchpad.support.sap.com/#/notes/2224138)
- [SAP support note #2401066](https://launchpad.support.sap.com/#/notes/2401066)
- [SAP support note #2593925](https://launchpad.support.sap.com/#/notes/2593925) 

> [!NOTE]
> If a SAP ASE database is encrypted then Backup Dump Compression will not work. See also [SAP support note #2680905](https://launchpad.support.sap.com/#/notes/2680905) 

## SAP ASE on Azure Deployment Checklist
 
1. Deploy SAP ASE 16.3 PL7 or higher
1. Update to latest version and patches of FaultManager and SAPHostAgent
1. Deploy on latest certified OS available such as Windows 2019, Suse 15.1 or Redhat 7.6 or higher
1. Use SAP Certified VMs – high memory Azure VM SKUs such as Es_v3 or for x-large systems M-Series VM SKUs are recommended
1. Match the disk IOPS and total VM aggregate throughput quota of the VM with the disk design.  Deploy sufficient number of disks
1. Aggregate disks using Windows Storage Spaces or Linux LVM2 with correct stripe size and file system
1. Create sufficient number of devices for data, log, temp, and backup purposes
1. Consider using UltraDisk for x-large systems 
1. Run `saptune` SAP-ASE on Linux OS 
1. Secure the database with DB Encryption – manually store keys in Azure Key Vault 
1. Complete the [SAP on Azure Checklist](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-deployment-checklist) 
1. Configure log backup and full backup 
1. Test HA/DR, backup and restore and perform stress & volume test 
1. Confirm Automatic Database Extension is working 

## Using DBACockpit to monitor Database Instances
For SAP systems, which are using SAP ASE as database platform, the DBACockpit is accessible as embedded browser windows in transaction DBACockpit or as Webdynpro. However, the full functionality for monitoring and administering the database is available in the Webdynpro implementation of the DBACockpit only.

As with on-premises systems several steps are required to enable all SAP NetWeaver functionality used by the Webdynpro implementation of the DBACockpit. Follow [SAP support note #1245200](https://launchpad.support.sap.com/#/notes/1245200) to enable the usage of webdynpros and generate the required ones. When following the instructions in the above notes, you also configure the Internet Communication Manager (`ICM`) along with the ports to be used for http and https connections. The default setting for http looks like:

> icm/server_port_0 = PROT=HTTP,PORT=8000,PROCTIMEOUT=600,TIMEOUT=600
> 
> icm/server_port_1 = PROT=HTTPS,PORT=443$$,PROCTIMEOUT=600,TIMEOUT=600
> 
> 

and the links generated in transaction DBACockpit looks similar to:

> https:\//\<fullyqualifiedhostname>:44300/sap/bc/webdynpro/sap/dba_cockpit
> 
> http:\//\<fullyqualifiedhostname>:8000/sap/bc/webdynpro/sap/dba_cockpit
> 
> 

Depending on how the Azure Virtual Machine hosting the SAP system is connected to your AD and DNS, you need to make sure that ICM is using a fully qualified hostname that can be resolved on the machine where you are opening the DBACockpit from. See [SAP support note #773830](https://launchpad.support.sap.com/#/notes/773830) to understand how ICM determines the fully qualified host name based on profile parameters and set parameter icm/host_name_full explicitly if necessary.

If you deployed the VM in a Cloud-Only scenario without cross-premises connectivity between on-premises and Azure, you need to define a public IP address and a `domainlabel`. The format of the public DNS name of the VM looks like:

> `<custom domainlabel`>.`<azure region`>.cloudapp.azure.com
> 
> 

More details related to the DNS name can be found [here][virtual-machines-azurerm-versus-azuresm].

Setting the SAP profile parameter icm/host_name_full to the DNS name of the Azure VM the link might look similar to:

> https:\//mydomainlabel.westeurope.cloudapp.net:44300/sap/bc/webdynpro/sap/dba_cockpit
> 
> http:\//mydomainlabel.westeurope.cloudapp.net:8000/sap/bc/webdynpro/sap/dba_cockpit

In this case you need to make sure to:

* Add Inbound rules to the Network Security Group in the Azure portal for the TCP/IP ports used to communicate with ICM
* Add Inbound rules to the Windows Firewall configuration for the TCP/IP ports used to communicate with the ICM

For an automated imported of all corrections available, it is recommended to periodically apply the correction collection SAP Note applicable to your SAP version:

* [SAP support note #1558958](https://launchpad.support.sap.com/#/notes/1558958)
* [SAP support note #1619967](https://launchpad.support.sap.com/#/notes/1619967)
* [SAP support note #1882376](https://launchpad.support.sap.com/#/notes/1882376)

Further information about DBA Cockpit for SAP ASE can be found in the following SAP Notes:

* [SAP support note #1605680](https://launchpad.support.sap.com/#/notes/1605680)
* [SAP support note #1757924](https://launchpad.support.sap.com/#/notes/1757924)
* [SAP support note #1757928](https://launchpad.support.sap.com/#/notes/1757928)
* [SAP support note #1758182](https://launchpad.support.sap.com/#/notes/1758182)
* [SAP support note #1758496](https://launchpad.support.sap.com/#/notes/1758496)    
* [SAP support note #1814258](https://launchpad.support.sap.com/#/notes/1814258)
* [SAP support note #1922555](https://launchpad.support.sap.com/#/notes/1922555)
* [SAP support note #1956005](https://launchpad.support.sap.com/#/notes/1956005)


## Useful Links, Notes & Whitepapers on SAP ASE
The starting page for [Sybase ASE 16.3 PL7 Documentation](https://help.sap.com/viewer/product/SAP_ASE/16.0.3.7/en-US) gives links to various documents of which the documents of:

- SAP ASE Learning Journey - Administration & Monitoring
- SAP ASE Learning Journey - Installation & Upgrade

are helpful. another useful document is [SAP Applications on SAP Adaptive Server Enterprise Best Practices for Migration and Runtime](https://assets.cdn.sap.com/sapcom/docs/2016/06/26450353-767c-0010-82c7-eda71af511fa.pdf).

Other helpful SAP support notes are:

- [SAP support note #2134316](https://launchpad.support.sap.com/#/notes/2134316) 
- [SAP support note #1748888](https://launchpad.support.sap.com/#/notes/1748888) 
- [SAP support note #2588660](https://launchpad.support.sap.com/#/notes/2588660) 
- [SAP support note #1680803](https://launchpad.support.sap.com/#/notes/1680803) 
- [SAP support note #1724091](https://launchpad.support.sap.com/#/notes/1724091) 
- [SAP support note #1775764](https://launchpad.support.sap.com/#/notes/1775764) 
- [SAP support note #2162183](https://launchpad.support.sap.com/#/notes/2162183) 
- [SAP support note #1928533](https://launchpad.support.sap.com/#/notes/1928533)
- [SAP support note #2015553](https://launchpad.support.sap.com/#/notes/2015553)
- [SAP support note #1750510](https://launchpad.support.sap.com/#/notes/1750510) 
- [SAP support note #1752266](https://launchpad.support.sap.com/#/notes/1752266) 
- [SAP support note #2162183](https://launchpad.support.sap.com/#/notes/2162183) 
- [SAP support note #1588316](https://launchpad.support.sap.com/#/notes/158831) 

Other information is published on 

- [SAP Applications on SAP Adaptive Server Enterprise](https://community.sap.com/topics/applications-on-ase)
- [Sybase infocenter](http://infocenter.sybase.com/help/index.jsp) 

A Monthly newsletter is published through [SAP support note #2381575](https://launchpad.support.sap.com/#/notes/2381575) 

[Sybase ASE Always-on with 3rd DR Node Setup](https://techcommunity.microsoft.com/t5/running-sap-applications-on-the/installation-procedure-for-sybase-16-3-patch-level-3-always-on/ba-p/368199) 

## Next steps
Check the article [SAP workloads on Azure: planning and deployment checklist](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-deployment-checklist)

