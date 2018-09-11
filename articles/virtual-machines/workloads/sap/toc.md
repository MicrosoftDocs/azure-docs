# Overview
## [Get started](get-started.md)
## [Certifications](sap-certifications.md)
# SAP HANA on Azure (Large Instances)
## Overview
### [What is SAP HANA on Azure (Large Instances)?](hana-overview-architecture.md)
### [Know the terms](hana-know-terms.md)
### [Certification](hana-certification.md)
### [Available SKUs for HLI](hana-available-skus.md)
### [Sizing](hana-sizing.md)
### [Onboarding requirements](hana-onboarding-requirements.md)
### [SAP HANA data tiering and extension nodes](hana-data-tiering-extension-nodes.md)
### [Operations model and responsibilities](hana-operations-model.md)
## Architecture
### [General architecture](hana-architecture.md)
### [Network architecture](hana-network-architecture.md)
### [Storage architecture](hana-storage-architecture.md)
### [HLI supported scenarios](hana-supported-scenario.md)
## Infrastructure and connectivity
### [HLI deployment](hana-overview-infrastructure-connectivity.md)
### [Connecting Azure VMs to HANA Large Instances](hana-connect-azure-vm-large-instances.md)
### [Connecting a VNet to HANA Large Instance ExpressRoute](hana-connect-vnet-express-route.md)
### [Additional network requirements](hana-additional-network-requirements.md)
## Install SAP HANA
### [Validate the configuration](hana-installation.md)
### [Sample HANA Installation](hana-example-installation.md)
## High availability and disaster recovery
### [Options and considerations](hana-overview-high-availability-disaster-recovery.md)
### [Backup and restore](hana-backup-restore.md)
### [Principles and preparation](hana-concept-preparation.md)
### [Disaster recovery failover procedure](hana-failover-procedure.md)
## Troubleshoot and monitor
### [Monitoring HLI](troubleshooting-monitoring.md)
### [Monitoring and troubleshooting from HANA side](hana-monitor-troubleshoot.md)
## How to
### [HA Setup with STONITH](ha-setup-with-stonith.md)
### [OS Backup for Type II SKUs](os-backup-type-ii-skus.md)
### [OS Upgrade for HANA Large Instances](os-upgrade-hana-large-instance.md)
### [Setting up SMT server for SUSE Linux](hana-setup-smt.md)
# SAP HANA on Azure Virtual Machines
## [Single instance SAP HANA installation](hana-get-started.md)
## [S/4 HANA or BW/4 HANA SAP CAL deployment guide](cal-s4h.md)
## [SAP HANA infrastructure configurations and operations on Azure](hana-vm-operations.md)
## SAP HANA Availability in Azure Virtual Machines
### [SAP HANA on Azure Availability overview](sap-hana-availability-overview.md)
### [SAP HANA on Azure Availability within one Azure region](sap-hana-availability-one-region.md)
### [SAP HANA on Azure Availability across Azure regions](sap-hana-availability-across-regions.md)
## [Setup SAP HANA System Replication in Azure VMs](sap-hana-high-availability.md)
## [SAP HANA backup overview](sap-hana-backup-guide.md)
## [SAP HANA file level backup](sap-hana-backup-file-level.md)
## [SAP HANA storage snapshot backups](sap-hana-backup-storage-snapshots.md)
# SAP NetWeaver and Business One on Azure Virtual Machines
## [SAP Business One on Azure Virtual Machines](business-one-azure.md)
## [SAP IDES on Windows/SQL Server SAP CAL deployment guide](cal-ides-erp6-erp7-sp3-sql.md)
## [SAP NetWeaver on Azure Linux VMs](suse-quickstart.md)
## [Plan and implement SAP NetWeaver on Azure](planning-guide.md)
## High Availability (HA) on Windows and Linux
### [Overview](sap-high-availability-guide-start.md)
### High Availability Architecture
#### [HA Architecture and Scenarios](sap-high-availability-architecture-scenarios.md)
#### [Higher Availability Architecture and Scenarios](sap-higher-availability-architecture-scenarios.md)
#### [HA on Windows with Shared Disk for (A)SCS Instance](sap-high-availability-guide-wsfc-shared-disk.md)
#### [HA on Windows with SOFS File Share for (A)SCS Instance](sap-high-availability-guide-wsfc-file-share.md)
#### [HA on SUSE Linux for (A)SCS Instance](high-availability-guide-suse.md)
### Azure Infrastructure Preparation
#### [Windows with Shared Disk for (A)SCS Instance](sap-high-availability-infrastructure-wsfc-shared-disk.md)
#### [Windows with SOFS File Share for (A)SCS Instance](sap-high-availability-infrastructure-wsfc-file-share.md)
#### [High availability for NFS on Azure VMs on SLES](high-availability-guide-suse-nfs.md)
#### [Pacemaker on SLES](high-availability-guide-suse-pacemaker.md)
### SAP Installation
#### [Windows with Shared Disk for (A)SCS Instance](sap-high-availability-installation-wsfc-shared-disk.md)
#### [Windows with SOFS File Share for (A)SCS Instance](sap-high-availability-installation-wsfc-file-share.md)
#### [SUSE Linux with NFS for (A)SCS Instance](high-availability-guide-suse.md)
### SAP Multi-SID
#### [Windows with Shared Disk for (A)SCS Instance](sap-ascs-ha-multi-sid-wsfc-shared-disk.md)
#### [Windows with SOFS File Share for (A)SCS Instance](sap-ascs-ha-multi-sid-wsfc-file-share.md)
## [SAP NetWeaver Deployment guide](deployment-guide.md)
## DBMS deployment guides for SAP workload
### [General Azure Virtual Machines DBMS deployment for SAP workload](dbms_guide_general.md)
### [SQL Server Azure Virtual Machines DBMS deployment for SAP workload](dbms_guide_sqlserver.md)
### [Oracle Azure Virtual Machines DBMS deployment for SAP workload](dbms_guide_oracle.md)
### [IBM DB2 Azure Virtual Machines DBMS deployment for SAP workload](dbms_guide_ibm.md)
### [SAP ASE Azure Virtual Machines DBMS deployment for SAP workload](dbms_guide_sapase.md)
### [SAP MaxDB, liveCache and Content Server deployment on Azure](dbms_guide_maxdb.md)
### [SAP HANA on Azure operations guide](hana-vm-operations.md)
#### SAP HANA Availability in Azure Virtual Machines
##### [SAP HANA on Azure Availability overview](sap-hana-availability-overview.md)
##### [SAP HANA on Azure Availability within one Azure region](sap-hana-availability-one-region.md)
##### [SAP HANA on Azure Availability across Azure regions](sap-hana-availability-across-regions.md)
## [Azure Site Recovery for SAP Disaster Recovery](../../../site-recovery/site-recovery-workload.md#protect-sap)
## [SAP LaMa connector for Azure](lama-installation.md)
# AAD SAP Identity Integration and Single-Sign-On
## [Integration with SAP Cloud](../../../active-directory/saas-apps/sap-customer-cloud-tutorial.md?toc=%2fazure%2fvirtual-machines%2fworkloads%2fsap%2ftoc.json)
## [AAD Integration with SAP Cloud Platform Identity Authentication](../../../active-directory/saas-apps/sap-hana-cloud-platform-identity-authentication-tutorial.md?toc=%2fazure%2fvirtual-machines%2fworkloads%2fsap%2ftoc.json)
## [Set up Single-Sign-On with SAP Cloud Platform](../../../active-directory/saas-apps/sap-hana-cloud-platform-tutorial.md?toc=%2fazure%2fvirtual-machines%2fworkloads%2fsap%2ftoc.json)
## [AAD Integration with SAP NetWeaver](../../../active-directory/saas-apps/sap-netweaver-tutorial.md?toc=%2fazure%2fvirtual-machines%2fworkloads%2fsap%2ftoc.json)
## [AAD Integration with SAP Business ByDesign](../../../active-directory/saas-apps/sapbusinessbydesign-tutorial.md?toc=%2fazure%2fvirtual-machines%2fworkloads%2fsap%2ftoc.json)
## [AAD Integration with SAP HANA DBMS](../../../active-directory/saas-apps/saphana-tutorial.md?toc=%2fazure%2fvirtual-machines%2fworkloads%2fsap%2ftoc.json)
##[SAP Fiori Launchpad SAML Single Sign-On with Azure AD](https://blogs.sap.com/2017/02/20/your-s4hana-environment-part-7-fiori-launchpad-saml-single-sing-on-with-azure-ad)
# Resources
## [Azure Roadmap](https://azure.microsoft.com/roadmap/)
