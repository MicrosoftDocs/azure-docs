---
title: Overview of domain data management services - Microsoft Azure Data Manager for Energy
description: This article provides an overview of Domain data management services
author: marielgherz
ms.author: marielherzog
ms.topic: overview
ms.date: 09/01/2022
ms.service: energy-data-services
ms.custom: template-overview, references_regions  
---

# Domain data management services (DDMS)

The energy industry works with data of an extraordinary magnitude, which has significant ramifications for storage and compute requirements. Geoscientists stream terabytes of seismic, well log, and other data types at full resolution. Immediate responsiveness of data is essential for all stages of petroleum exploration--particularly for geologic interpretation and analysis. 

## Overview
Domain data management services (DDMS) store, access, and retrieve metadata and bulk data from applications connected to the data platform. Developers, therefore, use DDMS to deliver seamless and secure consumption of data in the applications they build on Azure Data Manager for Energy. The Azure Data Manager for Energy suite of DDMS adheres to [Open Subsurface Data Universe](https://osduforum.org/) (OSDU&trade;) standards and provides enhancements in performance, geo-availability, and access controls. DDMS service is optimized for each data type and can be extended to accommodate new data types. The DDMS service preserves raw data and offers multi format support and conversion for consuming applications such as Petrel while tracking lineage. Data within the DDMS service is discoverable and governed by entitlement and legal tags.

### OSDU&trade; definition
  
- Highly optimized storage & access for bulk data, with highly opinionated APIs delivering the data required to enable domain workflows
- Governed schemas that incorporate domain-specific perspective and type-safe accessors for registered entity types

### Aspirational components for any DDMS

  - Direct connection to OSDU&trade; core services: storage, legal, ingestion and entitlements
  - Connection to adjacent or proximal databases (Blob storage, Azure Cosmos DB, external) and client applications
  - Configure infrastructure provisioning to enable optimal performance for data streaming and access

### Additional components for most DDMS (may include but not be limited to)

  - File format converter--for example, for Seismic DDMS: SGY to ZGY, etc.
  - Hierarchy of data organization and chunking - Tenant, project, and data

## Use cases and value add

### Frictionless Exploration and Production(E&P)

The Azure Data Manager for Energy DDMS service enables energy companies to access their data in a manner that is fast, portable, testable and extendible. As a result, they can achieve unparalleled streaming performance and use the standards and output from OSDU&trade;. The Azure DDMS service includes the OSDU&trade; DDMS and SLB proprietary DMS. Microsoft also continues to contribute to the OSDU&trade; community DDMS to ensure compatibility and architectural alignment.

### Seamless connection between applications and data

You can deploy applications on top of Azure Data Manager for Energy that has been developed as per the OSDU&trade; standard. They're able to connect applications to Core Services and DDMS without spending extensive cycles on deployment. Customers can also easily connect DELFI to Azure Data Manager for Energy, eliminating the cycles associated with Petrel deployments and connection to data management systems. By connecting applications to DDMS service, Geoscientists can execute integrated E&P workflows with unparalleled performance on Azure and use OSDU&trade; core services. For example, a geophysicist can pick well ties on a seismic volume in Petrel and stream data from the seismic DMS.  

## Types of DMS 
OSDU&trade; DMS supports the following services: 

### OSDU&trade; - Seismic DMS

Seismic data is a fundamental data type for oil and gas exploration. Seismic data provides a geophysical representation of the subsurface that can be applied for prospect identification and drilling decisions. Typical seismic datasets represent a multi-kilometer survey and are therefore massive in size. 

Due to this extraordinary data size, geoscientists working on-premises struggle to use seismic data in domain applications. They suffer from crashes as the seismic dataset exceeds their workstation's RAM, which leads to significant non-productive time. To achieve performance needed for domain workflows, geoscientists must chunk a seismic dataset and view each chunk in isolation. As a result, users suffer from the time spent wrangling seismic data and the opportunity cost of missing the significant picture view of the subsurface and target reservoirs.

The seismic DMS is part of the OSDU&trade; platform and enables users to connect seismic data to cloud storage to applications. It allows secure access to metadata associated with seismic data to efficiently retrieve and handle large blocks of data for OpenVDS, ZGY, and other seismic data formats. The DMS therefore enables users to stream huge amounts of data in OSDU&trade; compliant applications in real time. Enabling the seismic DMS on Azure Data Manager for Energy opens a pathway for Azure customers to bring their seismic data to the cloud and take advantage of Azure storage and high performance computing.

### OSDU&trade; - Wellbore DMS

Well Logs are measurements taken while drilling, which tells energy companies information about the subsurface. Ultimately, they reveal whether hydrocarbons are present (or if the well is dry). Logs contain many attributes that inform geoscientists about the type of rock, its quality, and whether it contains oil, water, gas, or a mix. Energy companies use these attributes to determine the quality of a reservoir – how much oil or gas is present, its quality, and ultimately, economic viability. Maintaining Well Log data and ensuring easy access to historical logs is critical to energy companies. The Wellbore DMS facilitates access to this data in any OSDU&trade; compliant application. 

Well Log data can come in different formats. It's indexed by depth or time and the increment of these measurements can vary. Well Logs typically contain multiple attributes for each vertical measurement. Well Logs can therefore be small or for more modern Well Logs that use high frequency data, greater than 1 Gb. Well Log data is smaller than seismic data, however, there are hundreds of wells associated with any oil exploration project. This scenario is common in mature areas that have been heavily drilled such as the Permian Basin in West Texas.

As a geoscientist you want to access numerous well logs in a single session. You  often look at all historical drilling programs in an area. As a result, you can look at Well Log data that was collected using a wide variety of instruments and technology. This data can vary widely in format, quality, and sampling. The Wellbore DMS resolves this data through the OSDU&trade; schemas to deliver the data to the consuming applications.

Here are the services that the Wellbore DMS offers - 

- **Objects and Consumption** - The Wellbore DMS can consume Wellbore, log set, log, marker, trajectory, and dip objects. This covers most well related exploration workflows
- **Lifecycle** – The Wellbore DMS supports the dataset through creation and writing to storage, versioning, lineage, auditing, and deletion
- **Ingestion**  - connection to file, interpretation software, system of records, and acquisition systems
- **Contextualization** (Contextualized Access)

### OSDU&trade; - Well Delivery DMS

The Well Delivery DMS stores critical drilling domain information related to the planning and execution of a well. Throughout a drilling program, engineers and domain experts need to access a wide variety of data types including activities, trajectories, risks, subsurface information, equipment used, fluid and cementing, rig utilization, and reports. Integrating this collection of data types together are the cornerstone to drilling insights. At the same time, until now, there was no industry wide standardization or enforced format. The common standards the Well Delivery DMS enables is critical to the Drilling Value Chain as it connects a diverse group of personas including operations, oil companies, service companies, logistics companies, etc.

### SLB&trade; - Petrel Data Services
Geoscientists working in [Petrel](https://www.software.slb.com/products/petrel) build Petrel Projects to store, track, share, and communicate their technical work. A Petrel project stores associated data in a ```.PET``` manifest file. It also keeps track of your windows within Petrel and setup. Petrel Data Services is an open DMS and doesn't require any additional licensing to get started. You can ingest Petrel projects to Petrel Data Services using OpenAPI’s. By moving to Petrel on Azure Data Manager for Energy, you can use Petrel Data Services Project Explorer UI to discover all the Petrel projects across your organization. You can create and save projects as well as track version history and experience unparalleled performance. This enables you to collaborate in real time with data permanently stored in Azure Data Manager for Energy.

Additionally, Petrel Data Services serves to liberate data stored in Petrel ```.PET``` files to their respective DDMS for search and utilization in external applications. For example, you can upload a Petrel project containing many well logs to Azure Data Manager for Energy. With data liberation, once the project is saved, the Wellbore data liberation service is triggered and that well log is extracted to the wellbore DMS. The association with the ```.PET``` Petrel project is tracked through lineage and you can use that well log in  any ISV open app ecosystem. Petrel Data Services offers round trip data liberation and consumption for seismic, wellbore, and Petrel Project data.

## Next steps
Learn more about DDMS concepts.
> [!div class="nextstepaction"]
> [DDMS Concepts](concepts-ddms.md)
