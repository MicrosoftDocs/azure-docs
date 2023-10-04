---
title: Managing SAP HANA data footprint for balancing cost and performance
description: Learn about HANA database archiving strategies to manage data footprint and reduce costs.
ms.workload: infrastructure-services
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: conceptual
ms.date: 09/27/2023
author: manvendravikramsingh
ms.author: manvsingh

---
# Managing SAP HANA data footprint for balancing cost and performance

Data archiving has always been a critical decision-making item and is heavily used by many companies to organize their legacy data to achieve cost benefits, balancing the need to comply with regulations and retain data for certain period with the cost of storing the data. Customers planning to migrate to S/4HANA or HANA based solution or reduce existing data storage footprint can leverage on the various data tiering options supported on Azure. 

This article describes options on Azure with emphasis on classifying the data usage pattern. 

## Overview

SAP HANA is an in-memory database and is supported on SAP certified servers. Azure provides more than 100 solutions [certified](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/#/solutions?filters=iaas;ve:24) to run SAP HANA. In-memory capabilities of SAP HANA allow customers to execute business transactions at an incredible speed. But do you need fast access to all data, at any given point in time? Food for thought. 

Most organizations choose to offload less accessed SAP data to HANA storage tier OR archive legacy data to an extended solution to attain maximum performance out of their investment. This tiering of data helps balance SAP HANA footprint and reduces cost and complexity throughout effectively.  

Customers can refer to the table below for data tier characteristics and choose to move data to the temperature tier as per desired usage.

| Classification | Hot Data | Warm Data | Cold Data |
| ------------ | --- |----- | ---- |
| Frequently accessed | High | Medium | Low |
| Expected performance | High | Medium | Low |
| Business critical | High | Medium | Low |

Frequently accessed, high-value data is classified as "hot" and is stored in-memory on the SAP HANA database. Less frequently accessed "warm" data is offloaded from in-memory and stored on HANA storage tier making it unified part of SAP HANA system. Finally, legacy or rarely accessed data is stored on low-cost storage tiers like disk or Hadoop, which remains accessible at any time.

"One size fits all" approach does not work here. Post data characterization is done, the next step is to map SAP solution to the data tiering solution that is supported by SAP on Azure.

| SAP Solution | Hot | Warm | Cold |
| ------------ | --- |----- | ---- |
| Native SAP HANA | SAP certified VMs | HANA Dynamic Tiering, HANA extension Node, NSE | DLM with Data Intelligence, DLM with Hadoop |
| SAP S/4HANA  | SAP certified VMs | Data aging via NSE | SAP IQ |
| SAP Business Suite on HANA | SAP certified VMs | Data aging via NSE | SAP IQ |
| SAP BW/4 HANA | SAP certified VMs | NSE, HANA extension Node | NLS with SAP IQ and Hadoop, Data Intelligence with ADLS |
| SAP BW on HANA | SAP certified VMs | NSE, HANA extension Node | NLS with SAP IQ and Hadoop, Data Intelligence with ADLS |

[2462641 - Is HANA Dynamic Tiering supported for Business Suite on HANA, or other SAP applications ( S/4, BW ) ? - SAP ONE Support Launchpad](https://launchpad.support.sap.com/#/notes/2462641)

[2140959 - SAP HANA Dynamic Tiering - Additional Information - SAP ONE Support Launchpad](https://launchpad.support.sap.com/#/notes/2140959)

[2799997 - FAQ: SAP HANA Native Storage Extension (NSE) - SAP ONE Support Launchpad](https://launchpad.support.sap.com/#/notes/2799997)

[2816823 - Use of SAP HANA Native Storage Extension in SAP S/4HANA and SAP Business Suite powered by SAP HANA - SAP ONE Support Launchpad](https://launchpad.support.sap.com/#/notes/2816823)

## Configuration

### Warm Data Tiering

#### SAP HANA Dynamic Tiering for Azure Virtual Machines

[SAP HANA infrastructure configurations and operations on Azure - Azure Virtual Machines | Microsoft Learn](./hana-vm-operations.md#sap-hana-dynamic-tiering-20-for-azure-virtual-machines)

#### SAP HANA Native Storage Extension

SAP HANA Native Storage Extension (NSE) is native technology available starting SAP HANA 2.0 SPS 04. NSE is a built-in disk-based extension to in-memory column store data of SAP HANA. Customers do not need special hardware or certification for NSE. Any HANA certified Azure virtual machines are valid to implement NSE.

##### Overview

The capacity of SAP HANA database with NSE is the amount of hot data memory and warm data stored on disk. NSE allocates buffer cache in HANA main memory and is sized separately from SAP HANA hot and working memory. As per SAP documentation, buffer cache is enabled by default and is sized by default as 10% of HANA memory. Please be informed NSE is not a replacement for data archiving as it does not reduce HANA disk size. Unlike data archiving, activation of NSE can be reversed.

[SAP HANA Native Storage Extension | SAP Help Portal](https://help.sap.com/docs/SAP_HANA_PLATFORM/6b94445c94ae495c83a19646e7c3fd56/4efaa94f8057425c8c7021da6fc2ddf5.html)

[2799997 - FAQ: SAP HANA Native Storage Extension (NSE) - SAP ONE Support Launchpad](https://launchpad.support.sap.com/#/notes/2799997)

[2973243 - Guidance for use of SAP HANA Native Storage Extension in SAP S/4HANA and SAP Business Suite powered by SAP HANA - SAP ONE Support Launchpad](https://launchpad.support.sap.com/#/notes/2973243)

NSE is supported for scale-up and scale-out systems. Availability for scale out systems starts with SAP HANA 2.0 SPS 04. Please refer SAP Note 2927591 to understand the functional restrictions.

[2927591 - SAP HANA Native Storage Extension 2.0 SPS 05 Functional Restrictions - SAP ONE Support Launchpad](https://launchpad.support.sap.com/#/notes/2927591)

SAP HANA NSE disaster recovery on Azure can be achieved using a variety of methods, including: 

- HANA System replication: HANA System replication allows you to create a copy of your SAP HANA NSE system in another Azure zone or region of choice. This copy is periodically replicated with your production SAP HANA NSE system. In the event of a disaster, fail over can be triggered to the disaster recovery SAP HANA NSE system. 

- Backup and restore: You can also use backup and restore to protect your SAP HANA NSE system from disaster. You can back up your SAP HANA NSE system to Azure Backup, and then restore it to a new SAP HANA NSE system in the event of a disaster. Native Azure backup capabilities can be leveraged here. 

- Azure Site Recovery: Azure Site Recovery is a disaster recovery service that can be used to replicate and recover your SAP HANA NSE system to another Azure region. Azure Site Recovery provides several features that make it a good choice for SAP HANA NSE disaster recovery, such as: 

    - Asynchronous replication, which can reduce the impact of replication on your production SAP HANA NSE system. 

    - Point-in-time restore, which allows you to restore your SAP HANA NSE system to a specific point in time. 

    - Automated failover and failback, which can help you to quickly recover your SAP HANA NSE system in the event of a disaster. 

The best method for SAP HANA NSE disaster recovery on Azure will depend on your specific needs and requirements. 

[Restore SAP HANA database instances on Azure VMs - Azure Backup | Microsoft Learn](/azure/backup/sap-hana-database-instances-restore)

#### SAP HANA Extension Node

HANA Extension nodes are supported for BW on HANA, BW/4HANA and SAP HANA native applications. For SAP BW on HANA, you will need SAP HANA 1.0 SP 12 as minimum HANA . release and BW 7.4 SP12 as minimum BW release. For SAP HANA native applications, you will need HANA 2 SPS03 as minimum HANA release.

The extension nodes setup is based on HANA scale-out offering. Customers with scale-up architecture need to extend to scale-out deployment. Apart from HANA standard license, no additional license is required. Extension node cannot share the same OS, network and disk with HANA standard node.

##### Networking Configuration

Configure the networking settings for the Azure VMs to ensure proper communication between the SAP HANA primary node and the extension nodes. This includes configuring Azure virtual network (VNet) settings, subnets, and network security groups (NSGs) to allow the necessary network traffic.

##### High Availability and Monitoring

Implement high availability mechanisms, such as clustering or replication, to ensure that the SAP HANA system remains resilient in case of node failures. Additionally, set up monitoring and alerting mechanisms to keep track of the health and performance of the SAP HANA system on Azure.

##### Data Backup and Recovery

Implement a robust backup and recovery strategy to protect your SAP HANA data. Azure offers various backup options, including Azure Backup or SAP HANA-specific backup tools. Configure regular backups of both the primary and extension nodes to ensure data integrity and availability.

##### Advantages of SAP HANA Extension Node

[Data tiering and extension nodes for SAP HANA on Azure (Large Instances) - Azure Virtual Machines | Microsoft Learn](/azure/virtual-machines/workloads/sap/hana-data-tiering-extension-nodes)

### Cold Data Tiering

SAP DLM (Data Lifecycle Management) provides tools and methodologies provided by SAP to manage the lifecycle of data SAP HANA to low-cost storage.

Let's explore three common scenarios for SAP HANA data tiering using Azure services.

#### Data Tiering with SAP Data Intelligence

SAP Data Intelligence enables organizations to discover, integrate, orchestrate, and govern data from various sources, both within and outside the enterprise.

SAP Data Intelligence enables the integration of SAP HANA with Azure Data Lake Storage. Cold data can be seamlessly moved from the in-memory tier to ADLS, leveraging its cost-effective storage capabilities. SAP
Data Intelligence facilitates the orchestration of data pipelines, allowing for transparent access and query execution on data residing in ADLS.

You can leverage the capabilities and services offered by Azure in conjunction with SAP Data Intelligence. Here are a few integration options:

##### Azure Data Lake Storage integration

SAP Data Intelligence supports integration with Azure Data Lake Storage, which is a scalable and secure data storage solution in Azure. You can configure connections
in SAP Data Intelligence to access and process data stored in Azure Data Lake Storage. This allows you to leverage the power of SAP Data Intelligence for data ingestion, data transformation, and advanced analytics on data residing in Azure.

SAP Data Intelligence provides a wide range of connectors and transformations that facilitate data movement and transformation tasks. You can configure SAP Data Intelligence pipelines to extract cold data
from SAP HANA, transform it if necessary, and load it into Azure Blob Storage. This ensures seamless data transfer and enables further processing or analysis on the tiered data.

SAP HANA provides query federation capabilities that seamlessly combine data from different storage tiers. With SAP HANA Smart Data Access (SDA) and SAP Data Intelligence, you can federate queries to access data
stored in SAP HANA and Azure Blob Storage as if it were in a single location. This transparent data access allows users and applications to retrieve and analyze data from both tiers without the need for manual
data movement or complex integration.

##### Azure Synapse Analytics integration
Azure Synapse Analytics is a cloud-based analytics service that combines big data and data warehousing capabilities. You can integrate SAP Data Intelligence with Azure Synapse Analytics to perform advanced analytics and data processing on large volumes of data. SAP Data Intelligence can connect to Azure Synapse Analytics to execute data pipelines, transformations, and machine learning tasks leveraging the power of Azure Synapse Analytics.

##### Azure services integration
SAP Data Intelligence can also integrate with other Azure services like Azure Blob Storage, Azure SQL
Database, Azure Event Hubs, and more. This allows you to leverage the capabilities of these Azure services within your data workflows and processing tasks in SAP Data Intelligence.

#### Data Tiering with SAP IQ

SAP IQ (formerly Sybase IQ), a highly scalable columnar database, can be utilized as a storage option for cold data in the SAP HANA Data Tiering landscape. With SAP Data Intelligence, organizations can set up data pipelines to move cold data from SAP HANA to SAP IQ. This approach provides efficient compression and query performance for historical or less frequently accessed data.

You can provision virtual machines (VMs) in Azure and install SAP IQ on those VMs. Azure Blob Storage is a scalable and cost-effective cloud storage service provided by Microsoft Azure. With SAP HANA Data Tiering,
organizations can integrate SAP IQ with Azure Blob Storage to store the data that has been tiered off from SAP HANA.

SAP HANA Data Tiering enables organizations to define policies and rules to automatically move cold data from SAP HANA to SAP IQ in Azure Blob Storage. This data movement can be performed based on data aging criteria or business rules. Once the data is in SAP IQ, it can be efficiently compressed and stored, optimizing storage utilization.

SAP HANA provides query federation capabilities, allowing queries to seamlessly access and combine data from SAP HANA and SAP IQ as if it were in a single location. This transparent data access ensures that users and applications can retrieve and analyze data from both tiers without the need for manual data movement or complex integration.

It's important to note that the specific steps and configurations may vary based on your requirements, SAP IQ version, and Azure deployment options. Therefore, referring to the official documentation and consulting with SAP and Azure experts is highly recommended for a successful deployment of SAP IQ on Azure with data tiering.

#### Data Tiering with NLS on Hadoop

Near-Line Storage (NLS) on Hadoop offers a cost-effective solution for managing cold data with SAP HANA. SAP Data Intelligence enables seamless integration between SAP HANA and Hadoop-based storage systems, such as
Hadoop Distributed File System (HDFS). Data pipelines can be established to move cold data from SAP HANA to NLS on Hadoop, allowing for efficient data archiving and retrieval.

[Implement SAP BW NLS with SAP IQ on Azure | Microsoft Learn](dbms-guide-sapiq.md)
