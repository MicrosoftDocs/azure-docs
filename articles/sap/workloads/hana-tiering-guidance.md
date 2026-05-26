---
title: Managing SAP HANA data footprint for balancing cost and performance
description: Learn about HANA database archiving strategies to manage data footprint and reduce costs.
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: concept-article
ms.date: 02/04/2026
author: manvendravikramsingh
ms.author: manvsingh
# Customer intent: As a data manager, I want to implement effective data archiving and tiering strategies for SAP HANA on Azure, so that I can balance storage costs and performance while ensuring compliance with data retention requirements.
---
# Managing SAP HANA data footprint for balancing cost and performance

Data archiving has always been a critical decision-making item and is heavily used by many companies to organize their legacy data to achieve cost benefits, balancing the need to comply with regulations and retain data for certain period with the cost of storing the data. Customers planning to migrate to S/4HANA or HANA based solution or reduce existing data storage footprint can leverage on the various data tiering options supported on Azure.

This article describes options on Azure with emphasis on classifying the data usage pattern.

## Key Terminology

- **Hot Data**: Frequently accessed, business-critical data stored in-memory for high performance
- **Warm Data**: Less frequently accessed data offloaded from in-memory to HANA storage tier
- **Cold Data**: Legacy or rarely accessed data stored on low-cost storage tiers
- **NSE**: Native Storage Extension - disk-based extension to in-memory column store data
- **DLM**: Data Lifecycle Management - SAP tools for managing data lifecycle to low-cost storage
- **NLS**: Near-Line Storage - cost-effective solution for managing cold data
- **ADLS**: Azure Data Lake Storage - scalable and secure data storage solution in Azure

## Prerequisites

**General Requirements:**
- SAP HANA certified Azure virtual machines
- Completed data characterization and usage pattern analysis
- Understanding of business requirements for data access patterns

**Version Requirements by Technology:**
- **NSE**: SAP HANA 2.0 SPS 04 or later
- **HANA Extension Node**: 
  - SAP BW on HANA: HANA 1.0 SP 12+ and BW 7.4 SP12+
  - SAP HANA native applications: HANA 2 SPS03+

## Data Tier Classification Framework

### Data Tier Characteristics

| Classification | Hot Data | Warm Data | Cold Data |
| ------------ | --- |----- | ---- |
| **Access Frequency** | High | Medium | Low |
| **Performance Requirement** | High | Medium | Low |
| **Business Criticality** | High | Medium | Low |
| **Storage Location** | In-memory | HANA storage tier | Low-cost external storage |

### Solution Mapping Matrix

**Context**: Post data characterization, map SAP solution to appropriate tiering strategy

| SAP Solution | Hot Tier | Warm Tier | Cold Tier |
| ------------ | --- |----- | ---- |
| **Native SAP HANA** | SAP certified VMs | HANA Dynamic Tiering, HANA Extension Node, NSE | DLM with Data Intelligence, DLM with Hadoop |
| **SAP S/4HANA** | SAP certified VMs | Data aging via NSE | SAP IQ |
| **SAP Business Suite on HANA** | SAP certified VMs | Data aging via NSE | SAP IQ |
| **SAP BW/4 HANA** | SAP certified VMs | NSE, HANA Extension Node | NLS with SAP IQ and Hadoop, Data Intelligence with ADLS |
| **SAP BW on HANA** | SAP certified VMs | NSE, HANA Extension Node | NLS with SAP IQ and Hadoop, Data Intelligence with ADLS |

## Decision Framework

### Warm Data Tiering Decision Tree
```
IF warm data requirements exist:
├── IF Native SAP HANA → Options: Dynamic Tiering, Extension Node, or NSE
├── IF S/4HANA or Business Suite → Use: NSE only
└── IF BW/4HANA or BW on HANA → Options: NSE or Extension Node
```

### Cold Data Tiering Decision Tree
```
IF cold data archiving needed:
├── IF S/4HANA or Business Suite → Use: SAP IQ
├── IF BW scenarios → Options: NLS with SAP IQ/Hadoop OR Data Intelligence with ADLS
└── IF Native HANA → Options: DLM with Data Intelligence OR DLM with Hadoop
```

## Implementation Guide

### Warm Data Tiering Technologies

#### SAP HANA Dynamic Tiering

**Applies to**: Native SAP HANA environments  
**Azure Services**: Virtual Machines  
**Implementation Reference**: [SAP HANA infrastructure configurations and operations on Azure](./hana-vm-operations.md#sap-hana-dynamic-tiering-20-for-azure-virtual-machines)

#### SAP HANA Native Storage Extension (NSE)

**Applies to**: SAP HANA 2.0 SPS 04+  
**Azure Services**: Any HANA certified Azure virtual machines  
**Key Characteristics**:
- Built-in disk-based extension to in-memory column store
- No special hardware certification required
- Buffer cache sized at 10% of HANA memory by default
- Reversible (unlike data archiving)
- Does not reduce HANA disk size

**Architecture**: 
- **Capacity Formula**: Total capacity = Hot data memory + Warm data on disk
- **Buffer Management**: NSE buffer cache allocated separately from HANA hot/working memory

**Scale Support**:
- Scale-up: Supported from SAP HANA 2.0 SPS 04
- Scale-out: Available from SAP HANA 2.0 SPS 04

**Functional Restrictions**: See SAP Note 2927591

**Disaster Recovery Options**:

1. **HANA System Replication**
   - **Method**: Periodic replication between zones/regions
   - **Recovery**: Manual failover to DR system
   - **Use Case**: Cross-region disaster recovery

2. **Azure Backup Integration**
   - **Method**: Native Azure backup capabilities
   - **Recovery**: Restore to new SAP HANA NSE system
   - **Reference**: [HANA database backup on Azure VMs](/azure/backup/sap-hana-database-about)

3. **Azure Site Recovery**
   - **Method**: VM-level replication and recovery
   - **Features**:
     - Asynchronous replication
     - Recovery point-based restore (discrete recovery points at regular intervals)
     - Automated failover and failback
   - **Recovery**: Restore to available recovery points captured at intervals

**Reference Documentation**:
- [SAP HANA Native Storage Extension | SAP Help Portal](https://help.sap.com/docs/SAP_HANA_PLATFORM/6b94445c94ae495c83a19646e7c3fd56/4efaa94f8057425c8c7021da6fc2ddf5.html)
- SAP Notes: 2799997, 2973243, 2927591

#### SAP HANA Extension Node

**Applies to**: BW on HANA, BW/4HANA, SAP HANA native applications  
**Architecture Requirements**: Scale-out deployment (scale-up customers must extend to scale-out)  
**Licensing**: No additional license beyond HANA standard license  
**Isolation Requirements**: Extension node cannot share OS, network, or disk with standard node

**Implementation Considerations**:

1. **Networking Configuration**
   - Configure Azure VNet settings and subnets
   - Set up Network Security Groups (NSGs) for proper traffic flow
   - Ensure communication between primary and extension nodes

2. **High Availability Setup**
   - Implement clustering or replication mechanisms
   - Configure monitoring and alerting for system health
   - Plan for node failure resilience

3. **Backup Strategy**
   - Configure backups for both primary and extension nodes
   - Leverage Azure Backup or SAP HANA-specific tools
   - Reference: SAP Note 3639106 - Azure backup 2.0 certification

**SAP Documentation**: [SAP HANA Extension Node](https://help.sap.com/docs/SAP_HANA_PLATFORM/6b94445c94ae495c83a19646e7c3fd56/e285ac03529a4cc9ab2d73206d2e8eca.html)

### Cold Data Tiering Technologies

**Context**: SAP DLM (Data Lifecycle Management) provides tools and methodologies for managing data lifecycle from SAP HANA to low-cost storage.

#### Data Tiering with SAP Data Intelligence

**Purpose**: Discover, integrate, orchestrate, and govern data from various sources  
**Primary Integration**: SAP HANA with Azure Data Lake Storage (ADLS)  
**Data Flow**: Cold data → ADLS → Cost-effective storage with pipeline orchestration

**Azure Integration Options**:

1. **Azure Data Lake Storage Integration**
   - **Capability**: Data ingestion, transformation, and advanced analytics
   - **Process**: Configure Data Intelligence pipelines to extract → transform → load into Azure Blob Storage
   - **Query Federation**: SAP HANA Smart Data Access (SDA) enables transparent access across tiers
   - **Reference**: [Microsoft Azure Data Lake (ADL)](https://help.sap.com/docs/data-intelligence-cloud/modeling-guide-1c1341f6911f4da5a35b191b40b426c8/microsoft-azure-data-lake-adl)

2. **Azure Synapse Analytics Integration**
   - **Purpose**: Advanced analytics and big data processing
   - **Capabilities**: Data pipelines, transformations, machine learning tasks
   - **Reference**: [Connect to Microsoft Azure Synapse Analytics](https://help.sap.com/docs/HANA_SMART_DATA_INTEGRATION/7952ef28a6914997abc01745fef1b607/2ebf5a5968ea4a07a444e68f3af933dc.html)

3. **Additional Azure Services Integration**
   - **Supported Services**: Azure Blob Storage, Azure SQL Database, Azure Event Hubs
   - **Use Case**: Enhanced data workflows and processing tasks

#### Data Tiering with SAP IQ

**Context**: SAP IQ (formerly Sybase IQ) - highly scalable columnar database for cold data storage  
**Architecture**: SAP HANA → SAP Data Intelligence pipelines → SAP IQ on Azure VMs  
**Storage Integration**: SAP IQ with Azure Blob Storage for tiered data


**Implementation Approach**:
1. **Provisioning**: Deploy SAP IQ on Azure Virtual Machines
2. **Policy Configuration**: Define automatic data movement rules based on aging criteria
3. **Data Processing**: Efficient compression and storage optimization in SAP IQ
4. **Query Federation**: Transparent access combining SAP HANA and SAP IQ data

**Deployment Considerations**:
- Requirements vary by SAP IQ version and Azure deployment options
- Consult SAP and Azure experts for specific configurations
- **Implementation Example**: [SAP BW NLS implementation guide with SAP IQ on Azure](https://github.com/MicrosoftDocs/azure-docs/blob/main/articles/sap/workloads/dbms-guide-sapiq.md#sap-bw-nls-implementation-guide-with-sap-iq-on-azure)

#### Data Tiering with NLS on Hadoop

**Context**: Near-Line Storage (NLS) on Hadoop for cost-effective cold data management  
**Integration**: SAP Data Intelligence enables SAP HANA ↔ Hadoop Distributed File System (HDFS) connectivity  
**Process**: Establish data pipelines for efficient archiving and retrieval

**Reference**: [Implement SAP BW NLS with SAP IQ on Azure](dbms-guide-sapiq.md)

## SAP Reference Documentation

**Dynamic Tiering**:
- [2462641 - HANA Dynamic Tiering support for Business Suite, S/4, BW applications](https://launchpad.support.sap.com/#/notes/2462641)
- [2140959 - SAP HANA Dynamic Tiering - Additional Information](https://launchpad.support.sap.com/#/notes/2140959)

**Native Storage Extension**:
- [2799997 - FAQ: SAP HANA Native Storage Extension (NSE)](https://launchpad.support.sap.com/#/notes/2799997)
- [2816823 - Use of NSE in SAP S/4HANA and Business Suite powered by SAP HANA](https://launchpad.support.sap.com/#/notes/2816823)

## Azure Backup References

- [Restore SAP HANA database instances on Azure VMs - Azure Backup](/azure/backup/sap-hana-database-instances-restore)