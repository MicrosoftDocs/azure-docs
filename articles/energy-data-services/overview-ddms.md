---
title: Microsoft Energy Data Services - Overview of Domain Data Management Services (DDMS). #Required; page title is displayed in search results. Include the brand.
description: This article provides an overview of Domain Data Management Services #Required; article description that is displayed in search results. 
author: marielgherz #Required; your GitHub user alias, with correct capitalization.
ms.author: marielherzog #Required; microsoft alias of author; optional team alias.
ms.topic: overview #Required; leave this attribute/value as-is.
ms.date: 09/01/2022
ms.service: azure
ms.custom: template-overview #Required; leave this attribute/value as-is.
---

# What is Domain Data Management Services (DDMS)?

Domain Data Management Services (DDMS) store, access, and retrieve metadata and bulk data from applications connected to the data platform. The energy industry works with data of an extraordinary magnitude, which has significant ramifications for storage and compute requirements. Geoscientists stream terabytes of seismic, well Log, and other data types at full resolution. Immediate responsiveness of data is essential for all stages of petroleum exploration--particularly for geologic interpretation and analysis. Developers therefore use DDMS to deliver seamless and secure consumption of data in the applications they build on Microsoft Energy Data Services. The Microsoft Energy Data Services suite of DDMS adheres to [Open Subsurface Data Universe](https://osduforum.org/) (OSDU) standards and provides enhancements in performance, geo-availability, and access controls. DDMS is optimized for each data type and can be extended to accommodate new data types. All DDMS preserves raw data and offer multi format support and conversion for consuming applications such as Petrel while tracking lineage. Data within the DDMS is discoverable and governed by entitlement and legal tags.

**OSDU Definition**
  
- Highly optimized storage & access for bulk data, with highly opinionated APIs delivering the data required to enable domain workflows
- Governed schemas that incorporate domain-specific perspective and type-safe accessors for registered entity types

**Aspirational components for any DDMS**

  - Direct connection to OSDU core services: storage, legal, ingestion and entitlements
  - Connection to adjacent or proximal databases (blob storage, Cosmos, external) and client applications
  - Configure infrastructure provisioning to enable optimal performance for data streaming and access

**Additional components for most DDMS (may include but not be limited to)**

  - File format converter--for example, for Seismic DDMS: SGY to ZGY, etc.
  - Hierarchy of data organization and chunking - Tenant, project, and data

## Use cases and value add

### Frictionless Exploration and Production (E&P) Enterprise Data Management(EDM) on Azure

The Microsoft Energy Data Services DDMS suite enables energy companies to access their data in a manner that is fast, portable, testable and extendible. As a result, they'll achieve unparalleled streaming performance and use the standards and output from OSDU. In the near term, the Azure DDMS suite will onboard the OSDU DDMS and Schlumberger proprietary DMS. At the same time, Microsoft contributes to the OSDU community DDMS to ensure compatibility and architectural alignment.

### Seamless connection between applications and data

- Deploy and utilize OSDU Applications – Customers can deploy applications on top of Microsoft Energy Data Services that are OSDU compatible. They're able to connect applications to Core Services and DDMS without spending extensive cycles on deployment.
- Petrel integration and quick getting started – Customers can easily connect DELFI to Microsoft Energy Data Services, eliminating the cycles associated with Petrel deployments and connection to data management systems.
- Seamless data experience on OSDU compatible apps – By connecting DDMS to apps, Geoscientists can execute integrated E&P workflows with unparalleled performance on Azure and use OSDU core services. For example, a geophysicist can pick well ties on a seismic volume in Petrel and stream data from the seismic DMS.  

## OSDU - Seismic DMS

### Definition and overview

Seismic data is a fundamental data type for oil and gas exploration. Seismic data provides a geophysical representation of the subsurface that can be applied for prospect identification and drilling decisions. Typical seismic datasets represent a multi-kilometer survey and are therefore massive in size. 

Due to this extraordinary data size, geoscientists working on-premises struggle to use seismic in domain applications. They suffer from crashes as the seismic dataset exceeds their workstation's RAM, which leads to significant non-productive time. To achieve performance needed for domain workflows, geoscientists must chunk a seismic dataset and view each chunk in isolation. As a result, users suffer from the time spent wrangling seismic data and the opportunity cost of missing the significant picture view of the subsurface and target reservoirs.

The seismic DMS is part of the OSDU platform and enables users to connect seismic data to cloud storage to applications. It allows secure access to metadata associated with seismic data to efficiently retrieve and handle large blocks of data for OpenVDS, ZGY, and other seismic data formats. The DMS therefore enables users to stream huge amounts of data in OSDU compliant applications in real time. Enabling the seismic DMS on Microsoft Energy Data Services opens a pathway for Azure customers to bring their seismic data to the cloud and take advantage of Azure storage and HPC.

### Services

:::image type="content" source="media/overview-ddms/overview-seismic-store-architecture-diagram.jpg" alt-text="Diagram of Seismic store architecture":::

[OSDU Reference overview](https://community.opengroup.org/osdu/platform/domain-data-mgmt-services/seismic/home/-/wikis/Architecture-Details)

## OSDU - Wellbore DMS

### Definition and overview

Well Logs are measurements taken while drilling, which tells energy companies information about the subsurface. Ultimately, they reveal whether hydrocarbons are present (or if the well is dry). Logs contain many attributes that inform geoscientists about the type of rock, its quality, and whether it contains oil, water, gas, or a mix. Energy companies use these attributes to determine the quality of a reservoir – how much oil or gas is present, its quality, and ultimately, economic viability. Maintaining Well Log data and ensuring easy access to historical logs is critical to energy companies. The Wellbore DMS facilitates access to this data in any OSDU compliant application. The Wellbore DMS was contributed by Schlumberger to OSDU.

Well Log data can come in different formats. It's most often indexed by depth or time and the increment of these measurements can vary. Well Logs typically contain multiple attributes for each vertical measurement. Well Logs can therefore be small or for more modern Well Logs that use high frequency data, greater than 1 Gb. Well Log data is smaller than seismic; however, users will want to look at upwards of hundreds of wells at a time. This scenario is common in mature areas that have been heavily drilled such as the Permian Basin in West Texas.

Geoscientists therefore want to access numerous well logs in a single session. They often are looking at all historical drilling programs in an area. As a result, they'll look at Well Log data that was collected using a wide variety of instruments and technology. This data will vary widely in format, quality, and sampling. The Wellbore DMS resolves this data through the OSDU schemas to deliver the data to the consuming applications.

### Services

- **Objects and Consumption** - The Wellbore DMS can consume Wellbore, log set, log, marker, trajectory, and dip objects. This covers most well related exploration workflows
- **Lifecycle** – The Wellbore DMS supports the dataset through creation and writing to storage, versioning, lineage, auditing, and deletion
- **Ingestion**  - connection to file, interpretation software, system of records, and acquisition systems
- **Enrichment** – Today users can enrich data through log recognition – but in the future will grow to support decimation, interpolation, unit conversion, etc.
- **Contextualization** (Contextualized Access)

:::image type="content" source="media/overview-ddms/overview-wellbore-dms-service.png" alt-text="Diagram of Wellbore DMS architecture":::

## OSDU - Well Delivery DMS

### Definition and overview

The Well Delivery DMS stores critical drilling domain information related to the planning and execution of a well. Throughout a drilling program, engineers and domain experts need to access a wide variety of data types including activities, trajectories, risks, subsurface information, equipment used, fluid and cementing, rig utilization, and reports. Integrating this collection of data types together are the cornerstone to drilling insights. At the same time, until now, there was no industry wide standardization or enforced format. The common standards the Well Delivery DMS enables is critical to the Drilling Value Chain as it connects a diverse group of personas including operations, oil companies, service companies, logistics companies, etc.

### Services
:::image type="content" source="media/overview-ddms/well-delivery-dms-service.png" alt-text="Diagram of Well Delivery DMS architecture":::
[OSDU Reference overview](https://community.opengroup.org/osdu/platform/domain-data-mgmt-services/well-delivery/well-delivery)

## Next steps
<!-- Add a context sentence for the following links -->
> [!div class="nextstepaction"]
> [DDMS Concepts](/concepts/overview-ddms.md)