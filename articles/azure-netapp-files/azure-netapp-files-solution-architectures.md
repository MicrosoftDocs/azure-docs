---
title: Solution architectures using Azure NetApp Files | Microsoft Docs
description: Provides references to best practices for solution architectures using Azure NetApp Files.
services: azure-netapp-files
documentationcenter: ''
author: b-hchen
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.date: 09/18/2023
ms.author: anfdocs
---
# Solution architectures using Azure NetApp Files

Azure NetApp Files is an enterprise storage service that offers an ideal landing zone component in Azure to accelerate and simplify the migration of various workload categories. Azure NetApp Files provides a high-performance, scalable, and secure storage service for running mission-critical applications and workloads in Azure.

For businesses looking to migrate their applications and workloads to Azure, Azure NetApp Files provides a seamless experience for migrating Windows Apps and SQL server, Linux OSS Apps and Databases, and SAP on Azure. Azure NetApp Files' integration with Azure services makes the migration process easy, enabling users to move their workloads from on-premises to the cloud with minimal effort.

In addition to migration, Azure NetApp Files provides a platform for running specialized workloads in High-Performance Computing (HPC) like Analytics, Oil and Gas, and Electronic Design Automation (EDA). These specialized workloads require high-performance computing resources, and Azure NetApp Files’ scalable and high-performance file storage solution provides the ideal platform for running these workloads in Azure. Azure NetApp Files also supports running Virtual Desktop Infrastructure (VDI) with Azure Virtual Desktop and Citrix, as well as Azure VMware Solution with guest OS mounts and datastores. 

Azure NetApp Files’ integration with Azure native services like Azure Kubernetes Service, Azure Batch, and Azure Machine Learning provides users with a seamless experience and enables them to leverage the full power of Azure's cloud-native services. This integration allows businesses to run their workloads in a scalable, secure, and highly performant environment, providing them with the confidence they need to run mission-critical workloads in the cloud.

The following diagram depicts the categorization of reference architectures, blueprints and solutions on this page as laid out in the above introduction:

**Azure NetApp Files key use cases**
:::image type="content" source="../media/azure-netapp-files/solution-architecture-categories.png" alt-text="Solution architecture categories." lightbox="../media/azure-netapp-files/solution-architecture-categories.png":::

In summary, Azure NetApp Files is a versatile and scalable storage service that provides an ideal platform for migrating various workload categories, running specialized workloads, and integrating with Azure native services. Azure NetApp Files’ high-performance, security, and scalability features make it a reliable choice for businesses looking to run their applications and workloads in Azure.

## Linux OSS Apps and Database solutions

This section provides references for solutions for Linux OSS applications and databases. 

### Linux OSS Apps

* [AIX UNIX on-premises to Azure Linux migration - Azure Example Scenarios](/azure/architecture/example-scenario/unix-migration/migrate-aix-azure-linux)
* [Leverage Azure NetApp Files for R Studio workloads](https://techcommunity.microsoft.com/t5/azure-storage-blog/leverage-azure-netapp-files-for-r-studio-workloads/ba-p/2935878)

### Oracle

* [Oracle Database with Azure NetApp Files - Azure Example Scenarios](/azure/architecture/example-scenario/file-storage/oracle-azure-netapp-files)
* [Oracle VM images and their deployment on Microsoft Azure: Shared storage configuration options](../virtual-machines/workloads/oracle/oracle-vm-solutions.md#shared-storage-configuration-options)
* [Oracle On Azure IaaS Recommended Practices For Success](https://github.com/Azure/Oracle-Workloads-for-Azure/blob/main/Oracle%20on%20Azure%20IaaS%20Recommended%20Practices%20for%20Success.pdf)
* [Run Your Most Demanding Oracle Workloads in Azure without Sacrificing Performance or Scalability](https://techcommunity.microsoft.com/t5/azure-architecture-blog/run-your-most-demanding-oracle-workloads-in-azure-without/ba-p/3264545)
* [Oracle database performance on Azure NetApp Files multiple volumes](performance-oracle-multiple-volumes.md)
* [Oracle database performance on Azure NetApp Files single volumes](performance-oracle-single-volumes.md)
* [Benefits of using Azure NetApp Files with Oracle Database](solutions-benefits-azure-netapp-files-oracle-database.md)
* [Oracle Databases on Microsoft Azure Using Azure NetApp Files](https://www.netapp.com/media/17105-tr4780.pdf)

### Financial analytics and trading
* [Host a Murex MX.3 workload on Azure](/azure/architecture/example-scenario/finance/murex-mx3-azure)

### Product Lifecycle Management

* [Use Teamcenter PLM with Azure NetApp Files](/azure/architecture/example-scenario/manufacturing/teamcenter-plm-netapp-files)
* [Siemens Teamcenter baseline architecture](/azure/architecture/example-scenario/manufacturing/teamcenter-baseline)
* [Migrate Product Lifecycle Management (PLM) to Azure](/industry/manufacturing/architecture/ra-migrate-plm-azure)

### Machine Learning
*	[Cloudera Machine Learning](https://docs.cloudera.com/machine-learning/cloud/requirements-azure/topics/ml-requirements-azure.html)
* [Distributed ML Training for Lane Detection, powered by NVIDIA and Azure NetApp Files](https://techcommunity.microsoft.com/t5/azure-architecture-blog/distributed-ml-training-for-lane-detection-powered-by-nvidia-and/ba-p/3848255)
* [Distributed ML Training for Click-Through Rate Prediction with NVIDIA, Dask and Azure NetApp Files](https://techcommunity.microsoft.com/t5/azure-architecture-blog/distributed-ml-training-for-click-through-rate-prediction-with/ba-p/3848262)

### Education

* [Moodle deployment with Azure NetApp Files - Azure Example Scenarios](/azure/architecture/example-scenario/file-storage/moodle-azure-netapp-files)
* [Moodle on Azure NetApp Files NFS storage](https://techcommunity.microsoft.com/t5/azure-architecture-blog/azure-netapp-files-for-nfs-storage-with-moodle/ba-p/2300630)

### Mainframe refactor

* [General mainframe refactor to Azure - Azure Example Scenarios](/azure/architecture/example-scenario/mainframe/general-mainframe-refactor)
* [Refactor mainframe applications with Advanced - Azure Example Scenarios](/azure/architecture/example-scenario/mainframe/refactor-mainframe-applications-advanced)
* [Refactor mainframe applications with Astadia – Azure Example Scenarios](/azure/architecture/example-scenario/mainframe/refactor-mainframe-applications-astadia)
* [Refactor mainframe computer systems that run Adabas & Natural - Azure Example Scenarios](/azure/architecture/example-scenario/mainframe/refactor-adabas-aks)
* [Refactor IBM z/OS mainframe coupling facility (CF) to Azure - Azure Example Scenarios](/azure/architecture/reference-architectures/zos/refactor-zos-coupling-facility)
* [Refactor mainframe applications to Azure with Raincode compilers - Azure Example Scenarios](/azure/architecture/reference-architectures/app-modernization/raincode-reference-architecture)

## Windows Apps and SQL Server solutions

This section provides references for Windows applications and SQL Server solutions.

### File sharing and Global File Caching

* [Enterprise file shares with disaster recovery - Azure Example Scenarios](/azure/architecture/example-scenario/file-storage/enterprise-file-shares-disaster-recovery)
* [Disaster Recovery for Enterprise File Shares with Azure NetApp Files and DFS Namespaces](https://techcommunity.microsoft.com/t5/azure-architecture-blog/disaster-recovery-for-enterprise-file-shares/ba-p/2808757)
* [Build Your Own Azure NFS? Wrestling Linux File Shares into Cloud](https://cloud.netapp.com/blog/ma-anf-blg-build-your-own-linux-nfs-file-shares)
* [Globally Distributed Enterprise File Sharing with Azure NetApp Files and NetApp Global File Cache](https://f.hubspotusercontent20.net/hubfs/525875/NA-580-0521-Architecture-Doc-R3.pdf)
* [Cloud Compliance for Azure NetApp Files](https://cloud.netapp.com/hubfs/Cloud%20Compliance%20for%20Azure%20NetApp%20Files%20-%20November%202020.pdf)

### SQL Server

* [SQL Server on Azure Virtual Machines with Azure NetApp Files - Azure Example Scenarios](/azure/architecture/example-scenario/file-storage/sql-server-azure-netapp-files)
* [SQL Server on Azure Deployment Guide Using Azure NetApp Files](https://techcommunity.microsoft.com/t5/azure-architecture-blog/deploying-sql-server-on-azure-using-azure-netapp-files/ba-p/3023143)
* [Benefits of using Azure NetApp Files for SQL Server deployment](solutions-benefits-azure-netapp-files-sql-server.md)
* [Managing SQL Server 2022 T-SQL snapshot backup with Azure NetApp Files snapshots](https://techcommunity.microsoft.com/t5/azure-architecture-blog/managing-sql-server-2022-t-sql-snapshot-backup-with-azure-netapp/ba-p/3654798)
* [Deploy SQL Server Over SMB with Azure NetApp Files](https://www.youtube.com/watch?v=x7udfcYbibs)
* [Deploy SQL Server Always-On Failover Cluster over SMB with Azure NetApp Files](https://www.youtube.com/watch?v=zuNJ5E07e8Q) 
* [Deploy Always-On Availability Groups with Azure NetApp Files](https://www.youtube.com/watch?v=y3VQmzzeyvc) 

## SAP on Azure solutions

This section provides references to SAP on Azure solutions. 

### Generic SAP and SAP Netweaver 

* [Run SAP NetWeaver in Windows on Azure - Azure Architecture Center](/azure/architecture/reference-architectures/sap/sap-netweaver)
* [High availability for SAP NetWeaver on Azure VMs on SUSE Linux Enterprise Server with Azure NetApp Files for SAP applications](../virtual-machines/workloads/sap/high-availability-guide-suse-netapp-files.md)
* [High availability for SAP NetWeaver on Azure VMs on Red Hat Enterprise Linux with Azure NetApp Files for SAP applications](../virtual-machines/workloads/sap/high-availability-guide-rhel-netapp-files.md)
* [High availability for SAP NetWeaver on Azure VMs on Windows with Azure NetApp Files (SMB) for SAP applications](../virtual-machines/workloads/sap/high-availability-guide-windows-netapp-files-smb.md)
* [Using Windows DFS-N to support flexible SAPMNT share creation for SMB-based file share](../virtual-machines/workloads/sap/high-availability-guide-windows-dfs.md)
* [High availability for SAP NetWeaver on Azure VMs on Red Hat Enterprise Linux for SAP applications multi-SID guide](../virtual-machines/workloads/sap/high-availability-guide-rhel-multi-sid.md)

### SAP HANA 

* [SAP HANA for Linux VMs in scale-up systems - Azure Architecture Center](/azure/architecture/reference-architectures/sap/run-sap-hana-for-linux-virtual-machines)
* [SAP S/4HANA in Linux on Azure - Azure Architecture Center](/azure/architecture/reference-architectures/sap/sap-s4hana)
* [Run SAP BW/4HANA with Linux VMs - Azure Architecture Center](/azure/architecture/reference-architectures/sap/run-sap-bw4hana-with-linux-virtual-machines)
* [SAP HANA Azure virtual machine storage configurations](../virtual-machines/workloads/sap/hana-vm-operations-storage.md)
* [SAP on Azure NetApp Files Sizing Best Practices](https://techcommunity.microsoft.com/t5/running-sap-applications-on-the/sap-on-azure-netapp-files-sizing-best-practices/ba-p/3895300)
* [Optimize HANA deployments with Azure NetApp Files application volume group for SAP HANA](https://techcommunity.microsoft.com/t5/running-sap-applications-on-the/optimize-hana-deployments-with-azure-netapp-files-application/ba-p/3683417)
* [Configuring Azure NetApp Files Application Volume Group (AVG) for zonal SAP HANA deployment](https://techcommunity.microsoft.com/t5/running-sap-applications-on-the/configuring-azure-netapp-files-anf-application-volume-group-avg/ba-p/3943801)
* [Using Azure NetApp Files AVG for SAP HANA to deploy HANA with multiple partitions (MP)](https://techcommunity.microsoft.com/t5/running-sap-applications-on-the/using-azure-netapp-files-avg-for-sap-hana-to-deploy-hana-with/ba-p/3742747)
* [NFS v4.1 volumes on Azure NetApp Files for SAP HANA](../virtual-machines/workloads/sap/hana-vm-operations-netapp.md)
* [High availability of SAP HANA Scale-up with Azure NetApp Files on Red Hat Enterprise Linux](../virtual-machines/workloads/sap/sap-hana-high-availability-netapp-files-red-hat.md)
* [SAP HANA scale-out with standby node on Azure VMs with Azure NetApp Files on SUSE Linux Enterprise Server](../virtual-machines/workloads/sap/sap-hana-scale-out-standby-netapp-files-suse.md)
* [SAP HANA scale-out with standby node on Azure VMs with Azure NetApp Files on Red Hat Enterprise Linux](../virtual-machines/workloads/sap/sap-hana-scale-out-standby-netapp-files-rhel.md)
* [SAP HANA scale-out with HSR and Pacemaker on RHEL - Azure Virtual Machines](../virtual-machines/workloads/sap/sap-hana-high-availability-scale-out-hsr-rhel.md)
* [Implementing Azure NetApp Files with Kerberos for SAP HANA](https://techcommunity.microsoft.com/t5/running-sap-applications-on-the/implementing-azure-netapp-files-with-kerberos/ba-p/3142010)
* [Azure Application Consistent Snapshot tool (AzAcSnap)](azacsnap-introduction.md)
* [Protecting HANA databases configured with HSR on Azure NetApp Files with AzAcSnap](https://techcommunity.microsoft.com/t5/running-sap-applications-on-the/protecting-hana-databases-configured-with-hsr-on-azure-netapp/ba-p/3654620)
* [Manual Recovery Guide for SAP HANA on Azure VMs from Azure NetApp Files snapshot with AzAcSnap](https://techcommunity.microsoft.com/t5/running-sap-applications-on-the/manual-recovery-guide-for-sap-hana-on-azure-vms-from-azure/ba-p/3290161)
* [SAP HANA on Azure NetApp Files - Data protection with BlueXP backup and recovery](https://techcommunity.microsoft.com/t5/running-sap-applications-on-the/sap-hana-on-azure-netapp-files-data-protection-with-bluexp/ba-p/3840116)
* [SAP HANA on Azure NetApp Files – System refresh & cloning operations with BlueXP backup and recovery](https://techcommunity.microsoft.com/t5/running-sap-applications-on-the/sap-hana-on-azure-netapp-files-system-refresh-amp-cloning/ba-p/3908660)
* [Azure NetApp Files Backup for SAP Solutions](https://techcommunity.microsoft.com/t5/running-sap-applications-on-the/anf-backup-for-sap-solutions/ba-p/3717977)
* [SAP HANA Disaster Recovery with Azure NetApp Files](https://docs.netapp.com/us-en/netapp-solutions-sap/pdfs/sidebar/SAP_HANA_Disaster_Recovery_with_Azure_NetApp_Files.pdf)

### SAP AnyDB

* [SAP System on Oracle Database on Azure - Azure Architecture Center](/azure/architecture/example-scenario/apps/sap-production)
* [Oracle Azure Virtual Machines DBMS deployment for SAP workload - Azure Virtual Machines](../virtual-machines/workloads/sap/dbms_guide_oracle.md)
* [Deploy SAP AnyDB (Oracle 19c) with Azure NetApp Files](https://techcommunity.microsoft.com/t5/running-sap-applications-on-the/deploy-sap-anydb-oracle-19c-with-azure-netapp-files/ba-p/2064043)
* [Manual Recovery Guide for SAP Oracle 19c on Azure VMs from Azure NetApp Files snapshot with AzAcSnap](https://techcommunity.microsoft.com/t5/running-sap-applications-on-the/manual-recovery-guide-for-sap-oracle-19c-on-azure-vms-from-azure/ba-p/3242408)
* [SAP Oracle 19c System Refresh Guide on Azure VMs using Azure NetApp Files Snapshots with AzAcSnap](https://techcommunity.microsoft.com/t5/running-sap-applications-on-the/sap-oracle-19c-system-refresh-guide-on-azure-vms-using-azure/ba-p/3708172)
* [IBM Db2 Azure Virtual Machines DBMS deployment for SAP workload using Azure NetApp Files](../virtual-machines/workloads/sap/dbms_guide_ibm.md#using-azure-netapp-files)
* [DB2 Installation Guide on Azure NetApp Files](https://techcommunity.microsoft.com/t5/running-sap-applications-on-the/db2-installation-guide-on-anf/ba-p/3709437)
* [Manual Recovery Guide for SAP DB2 on Azure VMs from Azure NetApp Files snapshot with AzAcSnap](https://techcommunity.microsoft.com/t5/running-sap-applications-on-the/manual-recovery-guide-for-sap-db2-on-azure-vms-from-azure-netapp/ba-p/3865379)
* [SAP ASE 16.0 on Azure NetApp Files for SAP Workloads on SLES15](https://techcommunity.microsoft.com/t5/running-sap-applications-on-the/sap-ase-16-0-on-azure-netapp-files-for-sap-workloads-on-sles15/ba-p/3729496)
* [SAP Netweaver 7.5 with MaxDB 7.9 on Azure using Azure NetApp Files](https://techcommunity.microsoft.com/t5/running-sap-applications-on-the/sap-netweaver-7-5-with-maxdb-7-9-on-azure-using-azure-netapp/ba-p/3905041)

### SAP IQ-NLS

*	[Deploy SAP IQ-NLS HA Solution using Azure NetApp Files on SUSE Linux Enterprise Server](https://techcommunity.microsoft.com/t5/running-sap-applications-on-the/deploy-sap-iq-nls-ha-solution-using-azure-netapp-files-on-suse/ba-p/1651172#.X2tDfpNzBh4.linkedin)
* [How to manage SAP IQ License in HA Scenario](https://techcommunity.microsoft.com/t5/running-sap-applications-on-the/how-to-manage-sap-iq-license-in-ha-scenario/ba-p/2052583)

### SAP tech community and blog posts 

* [Architectural Decisions to maximize ANF investment in HANA N+M Scale-Out Architecture - Part 1](https://techcommunity.microsoft.com/t5/running-sap-applications-on-the/architectural-decisions-to-maximize-anf-investment-in-hana-n-m/ba-p/2078737)
* [Architectural Decisions to maximize ANF investment in HANA N+M Scale-Out Architecture - Part 2](https://techcommunity.microsoft.com/t5/running-sap-applications-on-the/architectural-decisions-to-maximize-anf-investment-in-hana-n-m/ba-p/2117130)
* [Architectural Decisions to maximize ANF investment in HANA N+M Scale-Out Architecture - Part 3](https://techcommunity.microsoft.com/t5/running-sap-applications-on-the/architectural-decisions-to-maximize-anf-investment-in-hana-n-m/ba-p/2215948)
* [SAP Landscape sizing and volume consolidation with Azure NetApp Files](https://techcommunity.microsoft.com/t5/sap-on-microsoft/sap-landscape-sizing-and-volume-consolidation-with-anf/m-p/2145572/highlight/true#M14)
* [Gain first hands-on experience with the new automated S/4HANA deployment in Microsoft Azure](https://blogs.sap.com/2021/09/13/gain-first-hands-on-experience-with-the-new-automated-s-4hana-deployment-in-microsoft-azure/)

## Azure VMware Solution solutions

* [Attach Azure NetApp Files datastores to Azure VMware Solution hosts](../azure-vmware/attach-azure-netapp-files-to-azure-vmware-solution-hosts.md)
* [Attach Azure NetApp Files to Azure VMware Solution VMs - Guest OS Mounts](../azure-vmware/netapp-files-with-azure-vmware-solution.md)
* [Deploy disaster recovery using JetStream DR software](../azure-vmware/deploy-disaster-recovery-using-jetstream.md#disaster-recovery-with-azure-netapp-files-jetstream-dr-and-azure-vmware-solution)
* [Disaster Recovery with Azure NetApp Files, JetStream DR and AVS (Azure VMware Solution)](https://www.jetstreamsoft.com/portal/jetstream-knowledge-base/disaster-recovery-with-azure-netapp-files-jetstream-dr-and-avs-azure-vmware-solution/) - Jetstream
* [Enable App Volume Replication for Horizon VDI on Azure VMware Solution using Azure NetApp Files](https://techcommunity.microsoft.com/t5/azure-migration-and/enable-app-volume-replication-for-horizon-vdi-on-azure-vmware/ba-p/3798178)
* [Disaster Recovery using cross-region replication with Azure NetApp Files datastores for AVS](https://techcommunity.microsoft.com/t5/azure-architecture-blog/disaster-recovery-using-cross-region-replication-with-azure/ba-p/3870682)
* [Protecting Azure VMware Solution VMs and datastores on Azure NetApp Files with Cloud Backup for VMs](https://techcommunity.microsoft.com/t5/azure-architecture-blog/protecting-azure-vmware-solution-vms-and-datastores-on-azure/ba-p/3894887)

## Virtual Desktop Infrastructure solutions

This section provides references for Virtual Desktop infrastructure solutions.

### <a name="windows-virtual-desktop"></a>Azure Virtual Desktop

* [Benefits of using Azure NetApp Files with Azure Virtual Desktop](solutions-windows-virtual-desktop.md)
* [Storage options for FSLogix profile containers in Azure Virtual Desktop](../virtual-desktop/store-fslogix-profile.md#azure-platform-details)
* [Create an FSLogix profile container for a host pool using Azure NetApp Files](../virtual-desktop/create-fslogix-profile-container.md)
* [Azure Virtual Desktop at enterprise scale](/azure/architecture/example-scenario/wvd/windows-virtual-desktop)
* [Microsoft FSLogix for the enterprise - Azure NetApp Files best practices](/azure/architecture/example-scenario/wvd/windows-virtual-desktop-fslogix#azure-netapp-files-best-practices)
* [Enhanced Performance and Scalability: Microsoft Entra joined Session Hosts with Azure NetApp Files](https://techcommunity.microsoft.com/t5/azure-architecture-blog/enhanced-performance-and-scalability-azure-ad-joined-session/ba-p/3836576)
* [Setting up Azure NetApp Files for MSIX App Attach](https://techcommunity.microsoft.com/t5/windows-virtual-desktop/setting-up-azure-netapp-files-for-msix-app-attach-step-by-step/m-p/1990021)
* [Multiple forests with AD DS and Microsoft Entra ID – Azure Example Scenarios](/azure/architecture/example-scenario/wvd/multi-forest)
* [Multiregion Business Continuity and Disaster Recovery (BCDR) for Azure Virtual Desktop – Azure Example Scenarios](/azure/architecture/example-scenario/wvd/azure-virtual-desktop-multi-region-bcdr)
* [Deploy Esri ArcGIS Pro in Azure Virtual Desktop – Azure Example Scenarios](/azure/architecture/example-scenario/data/esri-arcgis-azure-virtual-desktop)

### Citrix   

* [Citrix Profile Management with Azure NetApp Files Best Practices Guide](https://www.netapp.com/pdf.html?item=/media/55973-tr-4901.pdf)


## HPC solutions

This section provides references for High Performance Computing (HPC) solutions. 

### Generic HPC

* [Azure HPC OnDemand Platform](https://azure.github.io/az-hop/)
* [Azure NetApp Files: Getting the most out of your cloud storage](https://cloud.netapp.com/hubfs/Resources/ANF%20PERFORMANCE%20TESTING%20IN%20TEMPLATE.pdf)
* [Run MPI workloads with Azure Batch and Azure NetApp Files](https://azure.microsoft.com/resources/run-mpi-workloads-with-azure-batch-and-azure-netapp-files/)
* [Azure Cycle Cloud: CycleCloud HPC environments on Azure NetApp Files](/azure/cyclecloud/overview)

### Oil and gas

* [High performance computing (HPC): Oil and gas in Azure](https://techcommunity.microsoft.com/t5/azure-global/high-performance-computing-hpc-oil-and-gas-in-azure/ba-p/824926)
* [Run reservoir simulation software on Azure](/azure/architecture/example-scenario/infrastructure/reservoir-simulation)

### Electronic design automation (EDA)

* [EDA workloads on Azure NetApp Files - Performance Best Practice](https://techcommunity.microsoft.com/t5/azure-global/eda-workloads-on-azure-netapp-files-performance-best-practice/ba-p/2119979)
* [Benefits of using Azure NetApp Files for electronic design automation](solutions-benefits-azure-netapp-files-electronic-design-automation.md)
* [Azure CycleCloud: EDA HPC Lab with Azure NetApp Files](https://github.com/Azure/cyclecloud-hands-on-labs/blob/master/EDA/README.md)
* [Azure for the semiconductor industry](https://azure.microsoft.com/mediahandler/files/resourcefiles/azure-for-the-semiconductor-industry/Azure%20for%20the%20semiconductor%20industry.pdf)

### Analytics

* [SAS on Azure architecture guide - Azure Architecture Center | Azure NetApp Files](/azure/architecture/guide/sas/sas-overview#azure-netapp-files-nfs)
* [Deploy SAS Grid 9.4 on Azure NetApp Files](/azure/architecture/guide/hpc/netapp-files-sas)
* [Best Practices for Using Microsoft Azure with SAS®](https://communities.sas.com/t5/Administration-and-Deployment/Best-Practices-for-Using-Microsoft-Azure-with-SAS/m-p/676833#M19680)
* [Azure NetApp Files: A shared file system to use with SAS Grid on Microsoft Azure](https://communities.sas.com/t5/Administration-and-Deployment/Azure-NetApp-Files-A-shared-file-system-to-use-with-SAS-Grid-on/m-p/705192)
* [Azure NetApp Files: A shared file system to use with SAS Grid on MS Azure – RHEL8.3/nconnect UPDATE](https://communities.sas.com/t5/Administration-and-Deployment/Azure-NetApp-Files-A-shared-file-system-to-use-with-SAS-Grid-on/m-p/722261#M21648)
* [Best Practices for Using Microsoft Azure with SAS®](https://communities.sas.com/t5/Administration-and-Deployment/Best-Practices-for-Using-Microsoft-Azure-with-SAS/m-p/676833#M19680)

## Azure platform services solutions

This section provides solutions for Azure platform services. 

### Azure Kubernetes Services and Kubernetes

* [Astra: protect, recover, and manage your AKS workloads on Azure NetApp Files](https://cloud.netapp.com/hubfs/Astra%20Azure%20Documentation.pdf) 
* [Integrate Azure NetApp Files with Azure Kubernetes Service](../aks/azure-netapp-files.md)
* [Azure NetApp Files SMB volumes for Azure Kubernetes Services with Astra Trident on Windows](https://techcommunity.microsoft.com/t5/azure-architecture-blog/azure-netapp-files-smb-volumes-for-azure-kubernetes-services/ba-p/3052900)
* [Application data protection for AKS workloads on Azure NetApp Files - Azure Example Scenarios](/azure/architecture/example-scenario/file-storage/data-protection-kubernetes-astra-azure-netapp-files)
* [Disaster Recovery of AKS workloads with Astra Control Service and Azure NetApp Files](https://techcommunity.microsoft.com/t5/azure-architecture-blog/disaster-recovery-of-aks-workloads-with-astra-control-service/ba-p/2948089)
* [Protecting MongoDB on AKS/ANF with Astra Control Service using custom execution hooks](https://techcommunity.microsoft.com/t5/azure-architecture-blog/protecting-mongodb-on-aks-anf-with-astra-control-service-using/ba-p/3057574)
* [Comparing and Contrasting the AKS/ANF NFS subdir external provisioner with Astra Trident](https://techcommunity.microsoft.com/t5/azure-architecture-blog/comparing-and-contrasting-the-aks-anf-nfs-subdir-external/ba-p/3057547)
* [Out-of-This-World Kubernetes performance on Azure with Azure NetApp Files](https://cloud.netapp.com/blog/ma-anf-blg-configure-kubernetes-openshift)
* [Azure NetApp Files + Trident = Dynamic and Persistent Storage for Kubernetes](https://anfcommunity.com/2021/02/16/azure-netapp-files-trident-dynamic-and-persistent-storage-for-kubernetes/)
* [Trident - Storage Orchestrator for Containers](https://netapp-trident.readthedocs.io/en/stable-v20.04/kubernetes/operations/tasks/backends/anf.html)
* [Magento e-commerce platform in Azure Kubernetes Service (AKS)](/azure/architecture/example-scenario/magento/magento-azure)
* [Protecting Magento e-commerce platform in AKS against disasters with Astra Control Service](https://techcommunity.microsoft.com/t5/azure-architecture-blog/protecting-magento-e-commerce-platform-in-aks-against-disasters/ba-p/3285525)
* [Protecting applications on private Azure Kubernetes Service clusters with Astra Control Service](https://techcommunity.microsoft.com/t5/azure-architecture-blog/protecting-applications-on-private-azure-kubernetes-service/ba-p/3289422)
* [Providing Disaster Recovery to CloudBees-Jenkins in AKS with Astra Control Service](https://techcommunity.microsoft.com/t5/azure-architecture-blog/providing-disaster-recovery-to-cloudbees-jenkins-in-aks-with/ba-p/3553412)
* [Disaster protection for JFrog Artifactory in AKS with Astra Control Service and Azure NetApp Files](https://techcommunity.microsoft.com/t5/azure-architecture-blog/disaster-protection-for-jfrog-artifactory-in-aks-with-astra/ba-p/3701501)
* [Develop and test easily on AKS with NetApp® Astra Control Service® and Azure NetApp Files](https://techcommunity.microsoft.com/t5/azure-architecture-blog/develop-and-test-easily-on-aks-with-netapp-astra-control-service/ba-p/3604225)

### Azure Machine Learning

* [High-performance storage for AI Model Training tasks using Azure Machine Learning studio with Azure NetApp Files](https://techcommunity.microsoft.com/t5/azure-architecture-blog/high-performance-storage-for-ai-model-training-tasks-using-azure/ba-p/3609189#_Toc112321755)
* [How to use Azure Machine Learning with Azure NetApp Files](https://github.com/csiebler/azureml-with-azure-netapp-files)

### Azure Red Hat Openshift   

*	[Using Trident to Automate Azure NetApp Files from OpenShift](https://techcommunity.microsoft.com/t5/fasttrack-for-azure/using-trident-to-automate-azure-netapp-files-from-openshift/ba-p/2367351)
*   [Deploy IBM Maximo Application Suite on Azure – Azure Example Scenarios](/azure/architecture/example-scenario/apps/deploy-ibm-maximo-application-suite)

### Azure Batch

* [Run MPI workloads with Azure Batch and Azure NetApp Files](https://azure.microsoft.com/resources/run-mpi-workloads-with-azure-batch-and-azure-netapp-files/)
