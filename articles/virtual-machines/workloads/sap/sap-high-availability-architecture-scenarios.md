---
title: Azure Virtual Machines high-availability architecture and scenarios for SAP NetWeaver | Microsoft Docs
description: High-availability architecture and scenarios for SAP NetWeaver on Azure Virtual Machines
services: virtual-machines-windows,virtual-network,storage
documentationcenter: saponazure
author: goraco
manager: gwallace
editor: ''
tags: azure-resource-manager
keywords: ''

ms.assetid: 887caaec-02ba-4711-bd4d-204a7d16b32b
ms.service: virtual-machines-windows
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure-services
ms.date: 01/21/2019
ms.author: rclaus
ms.custom: H1Hack27Feb2017

---

# High-availability architecture and scenarios for SAP NetWeaver

[1928533]:https://launchpad.support.sap.com/#/notes/1928533
[1999351]:https://launchpad.support.sap.com/#/notes/1999351
[2015553]:https://launchpad.support.sap.com/#/notes/2015553
[2178632]:https://launchpad.support.sap.com/#/notes/2178632
[2243692]:https://launchpad.support.sap.com/#/notes/2243692

[Logo_Linux]:media/virtual-machines-shared-sap-shared/Linux.png
[Logo_Windows]:media/virtual-machines-shared-sap-shared/Windows.png


[sap-installation-guides]:http://service.sap.com/instguides

[azure-subscription-service-limits]:../../../azure-subscription-service-limits.md
[azure-subscription-service-limits-subscription]:../../../azure-subscription-service-limits.md

[dbms-guide]:../../virtual-machines-windows-sap-dbms-guide.md

[deployment-guide]:deployment-guide.md

[dr-guide-classic]:https://go.microsoft.com/fwlink/?LinkID=521971

[getting-started]:get-started.md

[ha-guide]:sap-high-availability-guide.md
[sap-high-availability-architecture-scenarios]:sap-high-availability-architecture-scenarios.md
[sap-high-availability-guide-wsfc-shared-disk]:sap-high-availability-guide-wsfc-shared-disk.md
[sap-high-availability-guide-wsfc-file-share]:sap-high-availability-guide-wsfc-file-share.md
[sap-ascs-high-availability-multi-sid-wsfc]:sap-ascs-high-availability-multi-sid-wsfc.md
[sap-high-availability-infrastructure-wsfc-shared-disk]:sap-high-availability-infrastructure-wsfc-shared-disk.md
[sap-ascs-ha-multi-sid-wsfc-file-share]:sap-ascs-ha-multi-sid-wsfc-file-share.md
[sap-ascs-ha-multi-sid-wsfc-shared-disk]:sap-ascs-ha-multi-sid-wsfc-shared-disk.md
[sap-hana-ha]:sap-hana-high-availability.md
[sap-suse-ascs-ha]:high-availability-guide-suse.md
[sap-suse-ascs-ha-anf]:high-availability-guide-suse-netapp-files.md
[sap-higher-availability]:sap-higher-availability-architecture-scenarios.md

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

[virtual-machines-windows-portal-sql-alwayson-availability-groups-manual]:../../windows/sql/virtual-machines-windows-portal-sql-alwayson-availability-groups-manual.md
[virtual-machines-windows-portal-sql-alwayson-int-listener]:../../windows/sql/virtual-machines-windows-portal-sql-alwayson-int-listener.md

[sap-ha-bc-virtual-env-hyperv-vmware-white-paper]:https://scn.sap.com/docs/DOC-44415
[sap-ha-partner-information]:https://scn.sap.com/docs/DOC-8541
[azure-sla]:https://azure.microsoft.com/support/legal/sla/
[azure-virtual-machines-manage-availability]:https://azure.microsoft.com/documentation/articles/virtual-machines-manage-availability
[azure-storage-redundancy]:https://azure.microsoft.com/documentation/articles/storage-redundancy/
[azure-storage-managed-disks-overview]:https://docs.microsoft.com/azure/storage/storage-managed-disks-overview

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

[planning-guide-microsoft-azure-networking]:planning-guide.md#61678387-8868-435d-9f8c-450b2424f5bd
[planning-guide-storage-microsoft-azure-storage-and-data-disks]:planning-guide.md#a72afa26-4bf4-4a25-8cf7-855d6032157f

[sap-ha-guide]:sap-high-availability-guide.md
[sap-ha-guide-2]:#42b8f600-7ba3-4606-b8a5-53c4f026da08
[sap-ha-guide-4]:#8ecf3ba0-67c0-4495-9c14-feec1a2255b7
[sap-ha-guide-8]:#78092dbe-165b-454c-92f5-4972bdbef9bf
[sap-ha-guide-8.1]:#c87a8d3f-b1dc-4d2f-b23c-da4b72977489
[sap-ha-guide-8.9]:#fe0bd8b5-2b43-45e3-8295-80bee5415716
[sap-ha-guide-8.11]:#661035b2-4d0f-4d31-86f8-dc0a50d78158
[sap-ha-guide-8.12]:#0d67f090-7928-43e0-8772-5ccbf8f59aab
[sap-ha-guide-8.12.1]:#5eecb071-c703-4ccc-ba6d-fe9c6ded9d79
[sap-ha-guide-8.12.3]:#5c8e5482-841e-45e1-a89d-a05c0907c868
[sap-ha-guide-8.12.3.1]:#1c2788c3-3648-4e82-9e0d-e058e475e2a3
[sap-ha-guide-8.12.3.2]:#dd41d5a2-8083-415b-9878-839652812102
[sap-ha-guide-8.12.3.3]:#d9c1fc8e-8710-4dff-bec2-1f535db7b006
[sap-ha-guide-9]:#a06f0b49-8a7a-42bf-8b0d-c12026c5746b
[sap-ha-guide-9.1]:#31c6bd4f-51df-4057-9fdf-3fcbc619c170
[sap-ha-guide-9.1.1]:#a97ad604-9094-44fe-a364-f89cb39bf097

[sap-ha-multi-sid-guide]:sap-high-availability-multi-sid.md (SAP multi-SID high-availability configuration)


[sap-ha-guide-figure-1000]:./media/virtual-machines-shared-sap-high-availability-guide/1000-wsfc-for-sap-ascs-on-azure.png
[sap-ha-guide-figure-1001]:./media/virtual-machines-shared-sap-high-availability-guide/1001-wsfc-on-azure-ilb.png
[sap-ha-guide-figure-1002]:./media/virtual-machines-shared-sap-high-availability-guide/1002-wsfc-sios-on-azure-ilb.png
[sap-ha-guide-figure-2000]:./media/virtual-machines-shared-sap-high-availability-guide/2000-wsfc-sap-as-ha-on-azure.png
[sap-ha-guide-figure-2001]:./media/virtual-machines-shared-sap-high-availability-guide/2001-wsfc-sap-ascs-ha-on-azure.png
[sap-ha-guide-figure-2003]:./media/virtual-machines-shared-sap-high-availability-guide/2003-wsfc-sap-dbms-ha-on-azure.png
[sap-ha-guide-figure-2004]:./media/virtual-machines-shared-sap-high-availability-guide/2004-wsfc-sap-ha-e2e-archit-template1-on-azure.png
[sap-ha-guide-figure-2005]:./media/virtual-machines-shared-sap-high-availability-guide/2005-wsfc-sap-ha-e2e-arch-template2-on-azure.png

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

[sap-ha-guide-figure-6003]:./media/virtual-machines-shared-sap-high-availability-guide/6003-sap-multi-sid-full-landscape.png

[sap-templates-3-tier-multisid-xscs-marketplace-image]:https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fsap-3-tier-marketplace-image-multi-sid-xscs%2Fazuredeploy.json
[sap-templates-3-tier-multisid-xscs-marketplace-image-md]:https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fsap-3-tier-marketplace-image-multi-sid-xscs-md%2Fazuredeploy.json
[sap-templates-3-tier-multisid-db-marketplace-image]:https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fsap-3-tier-marketplace-image-multi-sid-db%2Fazuredeploy.json
[sap-templates-3-tier-multisid-db-marketplace-image-md]:https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fsap-3-tier-marketplace-image-multi-sid-db-md%2Fazuredeploy.json
[sap-templates-3-tier-multisid-apps-marketplace-image]:https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fsap-3-tier-marketplace-image-multi-sid-apps%2Fazuredeploy.json
[sap-templates-3-tier-multisid-apps-marketplace-image-md]:https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fsap-3-tier-marketplace-image-multi-sid-apps-md%2Fazuredeploy.json

[virtual-machines-azure-resource-manager-architecture-benefits-arm]:../../../azure-resource-manager/resource-group-overview.md#the-benefits-of-using-resource-manager

[virtual-machines-manage-availability]:../../virtual-machines-windows-manage-availability.md


## Terminology definitions

**High availability**: Refers to a set of technologies that minimize IT disruptions by providing business continuity of IT services through redundant, fault-tolerant, or failover-protected components inside the *same* data center. In our case, the data center resides within one Azure region.

**Disaster recovery**: Also refers to the minimizing of IT services disruption and their recovery, but across *various* data centers that might be hundreds of miles away from one another. In our case, the data centers might reside in various Azure regions within the same geopolitical region or in locations as established by you as a customer.


## Overview of high availability
SAP high availability in Azure can be separated into three types:

* **Azure infrastructure high availability**: 

    For example, high availability can include compute (VMs), network, or storage and its benefits for increasing the availability of SAP applications.

* **Utilizing Azure infrastructure VM restart to achieve *higher availability* of SAP applications**: 

    If you decide not to use functionalities such as Windows Server Failover Clustering (WSFC) or Pacemaker on Linux, Azure VM restart is utilized. It protects SAP systems against planned and unplanned downtime of the Azure physical server infrastructure and overall underlying Azure platform.

* **SAP application high availability**: 

    To achieve full SAP system high availability, you must protect all critical SAP system components. For example:
    * Redundant SAP application servers.
    * Unique components. An example might be a single point of failure (SPOF) component, such as an SAP ASCS/SCS instance or a database management system (DBMS).

SAP high availability in Azure differs from SAP high availability in an on-premises physical or virtual environment. The following paper [SAP NetWeaver high availability and business continuity in virtual environments with VMware and Hyper-V on Microsoft Windows][sap-ha-bc-virtual-env-hyperv-vmware-white-paper] describes standard SAP high-availability configurations in virtualized environments on Windows.

There is no sapinst-integrated SAP high-availability configuration for Linux as there is for Windows. For information about SAP high availability on-premises for Linux, see [High availability partner information][sap-ha-partner-information].

## Azure infrastructure high availability

### SLA for single-instance virtual machines

There is currently a single-VM SLA of 99.9% with premium storage. To get an idea about what the availability of a single VM might be, you can build the product of the various available [Azure Service Level Agreements][azure-sla].

The basis for the calculation is 30 days per month, or 43,200 minutes. For example, a 0.05% downtime corresponds to 21.6 minutes. As usual, the availability of the various services is calculated in the following way:

(Availability Service #1/100) * (Availability Service #2/100) * (Availability Service #3/100) \*…

For example:

(99.95/100) * (99.9/100) * (99.9/100) = 0.9975 or an overall availability of 99.75%.

### Multiple instances of virtual machines in the same availability set
For all virtual machines that have two or more instances deployed in the same *availability set*, we guarantee that you will have virtual machine connectivity to at least one instance at least 99.95% of the time.

When two or more VMs are part of the same availability set, each virtual machine in the availability set is assigned an *update domain* and a *fault domain* by the underlying Azure platform.

* **Update domains** guarantee that multiple VMs are not rebooted at the same time during the planned maintenance of an Azure infrastructure. Only one VM is rebooted at a time.

* **Fault domains** guarantee that VMs are deployed on hardware components that do not share a common power source and network switch. When servers, a network switch, or a power source undergo an unplanned downtime, only one VM is affected.

For more information, see [Manage the availability of Windows virtual machines in Azure][azure-virtual-machines-manage-availability].

An availability set is used for achieving high availability of:

* Redundant SAP application servers.  
* Clusters with two or more nodes (VMs, for example) that protect SPOFs such as an SAP ASCS/SCS instance or a DBMS.


### Azure Availability Zones
Azure is in process of rolling out a concepts of [Azure Availability Zones](https://docs.microsoft.com/azure/availability-zones/az-overview) throughout different [Azure Regions](https://azure.microsoft.com/global-infrastructure/regions/). In Azure regions where Availability Zones are offered, the Azure regions have multiple data centers, which are independent in supply of power source, cooling, and network. Reason for offering different zones within a single Azure region is to enable you to deploy applications across two or three Availability Zones offered. Assuming that issues in power sources and/or network would affect one Availability Zone infrastructure only, your application deployment within an Azure region is still fully functional. Eventually with some reduced capacity since some VMs in one zone might be lost. But VMs in the other two zones are still up and running. The Azure regions that offer zones are listed in [Azure Availability Zones](https://docs.microsoft.com/azure/availability-zones/az-overview).

Using Availability Zones, there are some things to consider. The considerations list like:

- You can't deploy Azure Availability Sets within an Availability Zone. You need to choose either an Availability Zone or an Availability Set as deployment frame for a VM.
- You can't use the [Basic Load Balancer](https://docs.microsoft.com/azure/load-balancer/load-balancer-overview#skus) to create failover cluster solutions based on Windows Failover Cluster Services or Linux Pacemaker. Instead you need to use the [Azure Standard Load Balancer SKU](https://docs.microsoft.com/azure/load-balancer/load-balancer-standard-availability-zones)
- Azure Availability Zones are not giving any guarantees of certain distance between the different zones within one region
- The network latency between different Azure Availability Zones within the different Azure regions might be different from Azure region to region. There will be cases, where you as a customer can reasonably run the SAP application layer deployed across different zones since the network latency from one zone to the active DBMS VM is still acceptable from a business process impact. Whereas there will be customer scenarios where the latency between the active DBMS VM in one zone and an SAP application instance in a VM in another zone can be too intrusive and not acceptable for the SAP business processes. As a result, the deployment architectures need to be different with an active/active architecture for the application or active/passive architecture if latency is too high.
- Using [Azure managed disks](https://azure.microsoft.com/services/managed-disks/) is mandatory for deploying into Azure Availability Zones 


### Planned and unplanned maintenance of virtual machines

Two types of Azure platform events can affect the availability of your virtual machines:

* **Planned maintenance** events are periodic updates made by Microsoft to the underlying Azure platform. The updates improve overall reliability, performance, and security of the platform infrastructure that your virtual machines run on.

* **Unplanned maintenance** events occur when the hardware or physical infrastructure underlying your virtual machine has failed in some way. It might include local network failures, local disk failures, or other rack level failures. When such a failure is detected, the Azure platform automatically migrates your virtual machine from the unhealthy physical server that hosts your virtual machine to a healthy physical server. Such events are rare, but they might also cause your virtual machine to reboot.

For more information, see [Manage the availability of Windows virtual machines in Azure][azure-virtual-machines-manage-availability].

### Azure Storage redundancy
The data in your storage account is always replicated to ensure durability and high availability, meeting the Azure Storage SLA even in the face of transient hardware failures.

Because Azure Storage keeps three images of the data by default, the use of RAID 5 or RAID 1 across multiple Azure disks is unnecessary.

For more information, see [Azure Storage replication][azure-storage-redundancy].

### Azure Managed Disks
Managed Disks is a resource type in Azure Resource Manager that is recommended to be used instead of virtual hard disks (VHDs) that are stored in Azure storage accounts. Managed disks automatically align with an Azure availability set of the virtual machine they are attached to. They increase the availability of your virtual machine and the services that are running on it.

For more information, see  [Azure Managed Disks overview][azure-storage-managed-disks-overview].

We recommend that you use managed disks because they simplify the deployment and management of your virtual machines.



## Utilizing Azure infrastructure high availability to achieve *higher availability* of SAP applications

If you decide not to use functionalities such as WSFC or Pacemaker on Linux (currently supported only for SUSE Linux Enterprise Server [SLES] 12 and later), Azure VM restart is utilized. It protects SAP systems against planned and unplanned downtime of the Azure physical server infrastructure and overall underlying Azure platform.

For more information about this approach, see [Utilize Azure infrastructure VM restart to achieve higher availability of the SAP system][sap-higher-availability].

## <a name="baed0eb3-c662-4405-b114-24c10a62954e"></a> High availability of SAP applications on Azure IaaS

To achieve full SAP system high availability, you must protect all critical SAP system components. For example:
  * Redundant SAP application servers.
  * Unique components. An example might be a single point of failure (SPOF) component, such as an SAP ASCS/SCS instance or a database management system (DBMS).

The next sections discuss how to achieve high availability for all three critical SAP system components.

### High-availability architecture for SAP application servers

> This section applies to:
>
> ![Windows][Logo_Windows] Windows and ![Linux][Logo_Linux] Linux
>

You usually don't need a specific high-availability solution for the SAP application server and dialog instances. You achieve high availability by redundancy, and you configure multiple dialog instances in various instances of Azure virtual machines. You should have at least two SAP application instances installed in two instances of Azure virtual machines.

![Figure 1: High-availability SAP application server][sap-ha-guide-figure-2000]

_**Figure 1:** High-availability SAP application server_

You must place all virtual machines that host SAP application server instances in the same Azure availability set. An Azure availability set ensures that:

* All virtual machines are part of the same update domain.  
    An update domain ensures that the virtual machines aren't updated at the same time during planned maintenance downtime.

    The basic functionality, which builds on different update and fault domains within an Azure scale unit, was already introduced in the [update domains][planning-guide-3.2.2] section.

* All virtual machines are part of the same fault domain.  
    A fault domain ensures that virtual machines are deployed so that no single point of failure affects the availability of all virtual machines.

The number of update and fault domains that can be used by an Azure availability set within an Azure scale unit is finite. If you keep adding VMs to a single availability set, two or more VMs will eventually end up in the same fault or update domain.

If you deploy a few SAP application server instances in their dedicated VMs, assuming that we have five update domains, the following picture emerges. The actual maximum number of update and fault domains within an availability set might change in the future:

![Figure 2: High availability of SAP application servers in an Azure availability set][planning-guide-figure-3000]
_**Figure 2:** High availability of SAP application servers in an Azure availability set_

For more information, see [Manage the availability of Windows virtual machines in Azure][azure-virtual-machines-manage-availability].

For more information, see the [Azure availability sets][planning-guide-3.2.3] section of the Azure virtual machines planning and implementation for SAP NetWeaver document.

**Unmanaged disks only:** Because the Azure storage account is a potential single point of failure, it's important to have at least two Azure storage accounts, in which at least two virtual machines are distributed. In an ideal setup, the disks of each virtual machine that is running an SAP dialog instance would be deployed in a different storage account.

> [!IMPORTANT]
> We strongly recommend that you use Azure managed disks for your SAP high-availability installations. Because managed disks automatically align with the availability set of the virtual machine they are attached to, they increase the availability of your virtual machine and the services that are running on it.  
>

### High-availability architecture for an SAP ASCS/SCS instance on Windows

> ![Windows][Logo_Windows] Windows
>

You can use a WSFC solution to protect the SAP ASCS/SCS instance. The solution has two variants:

* **Cluster the SAP ASCS/SCS instance by using clustered shared disks**: For more information about this architecture, see [Cluster an SAP ASCS/SCS instance on a Windows failover cluster by using a cluster shared disk][sap-high-availability-guide-wsfc-shared-disk].   

* **Cluster the SAP ASCS/SCS instance by using file share**: For more information about this architecture, see [Cluster an SAP ASCS/SCS instance on a Windows failover cluster by using file share][sap-high-availability-guide-wsfc-file-share].

### High-availability architecture for an SAP ASCS/SCS instance on Linux

> ![Linux][Logo_Linux] Linux
> 
> For more information about clustering the SAP ASCS/SCS instance by using the SLES cluster framework, see [High availability for SAP NetWeaver on Azure VMs on SUSE Linux Enterprise Server for SAP applications][sap-suse-ascs-ha]. For alternative HA architecture on SLES, which doesn't require highly available NFS see [High-availability guide for SAP NetWeaver on SUSE Linux Enterprise Server with Azure NetApp Files for SAP applications][sap-suse-ascs-ha-anf].

For more information about clustering the SAP ASCS/SCS instance by using the Red Hat cluster framework, see [Azure Virtual Machines high availability for SAP NetWeaver on Red Hat Enterprise Linux](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-rhel)


### SAP NetWeaver multi-SID configuration for a clustered SAP ASCS/SCS instance

> ![Windows][Logo_Windows] Windows
> 
> Currently, multi-SID is supported only with WSFC. Multi-SID is supported using file share and shared disk.
> 
> For more information about multi-SID high-availability architecture, see:

* [SAP ASCS/SCS instance multi-SID high availability for Windows Server Failover Clustering and file share][sap-ascs-ha-multi-sid-wsfc-file-share]

* [SAP ASCS/SCS instance multi-SID high availability for Windows Server Failover Clustering and shared disk][sap-ascs-ha-multi-sid-wsfc-shared-disk]

### High-availability DBMS instance

The DBMS also is a single point of contact in an SAP system. You need to protect it by using a high-availability solution. The following figure shows a SQL Server AlwaysOn high-availability solution in Azure, with Windows Server Failover Clustering and the Azure internal load balancer. SQL Server AlwaysOn replicates DBMS data and log files by using its own DBMS replication. In this case, you don't need cluster shared disk, which simplifies the entire setup.

![Figure 3: Example of a high-availability SAP DBMS, with SQL Server AlwaysOn][sap-ha-guide-figure-2003]

_**Figure 3:** Example of a high-availability SAP DBMS, with SQL Server AlwaysOn_

For more information about clustering SQL Server DBMS in Azure by using the Azure Resource Manager deployment model, see these articles:

* [Configure an AlwaysOn availability group in Azure virtual machines manually by using Resource Manager][virtual-machines-windows-portal-sql-alwayson-availability-groups-manual]

* [Configure an Azure internal load balancer for an AlwaysOn availability group in Azure][virtual-machines-windows-portal-sql-alwayson-int-listener]

For more information about clustering SAP HANA DBMS in Azure by using the Azure Resource Manager deployment model, see [High availability of SAP HANA on Azure virtual machines (VMs)][sap-hana-ha].
