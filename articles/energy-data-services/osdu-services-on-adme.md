---
title: OSDU Services Available on Azure Data Manager for Energy
description: This article provides an overview of the OSDU services available on Azure Data Manager for Energy and the OSDU services that are exclusively available in the community version.
author: marielherz
ms.service: azure-data-manager-energy
ms.author: marielherzog
ms.topic: conceptual
ms.date: 08/05/2025
ms.custom: template-concept
---

# OSDU&reg; M25.1 services available on Azure Data Manager for Energy 
Azure Data Manager for Energy is currently compliant with the M25.1 OSDU® milestone release. Below you'll find an overview of the OSDU&reg; services that are currently available on Azure Data Manager for Energy. This page will be regularly updated as service versions and availability evolve. 
### Core and helper services
- **CRS Catalog**: Provides API endpoints to work with geodetic reference data, allowing developers to retrieve CRS definitions, select appropriate CRSs for data ingestion, and search for CRSs based on various constraints. 
- **CRS Conversion**: Enables the conversion of coordinates from one coordinate reference system (CRS) to another.
- **Dataset**: Provides internal and external API endpoints to allow and application or user fetch storage/retrieval instructions for various types of datasets.
- **Entitlements**: Used to enable authorization in OSDU Data Ecosystem. The service allows for the creation of groups. A group name defines a permission. Users who are added to that group obtain that permission. The main motivation for entitlements service is data authorization, but the functionality enables three use cases: Data groups used for data authorization, Service groups used for service authorization, User groups used for hierarchical grouping of user and service identities.
- **File**: Provides internal and external API endpoints to let the application or user fetch any records from the system or request file location data. 
- **Indexer**: Provides a mechanism for indexing documents that contain structured or unstructured data. Documents and indices are saved in a separate persistent store optimized for search operations. The indexer API can index any number of documents.
- **Indexer Queue**: Provides a set of APIs that help in forwarding the messages to and from storage service to indexer service.
- **Legal**: Managing LegalTags associated with datasets. A LegalTag is the entity that represents the legal status of data in the Data Ecosystem. It is a collection of properties that governs how the data can be consumed and ingested.
- **Notification**: Allows for interested consumers to subscribe to data and metadata changes using a publish/subscriber pattern.
- **Python SDK**: Offers tools and libraries for developers to interact with OSDU services using Python.
- **Register**: Allow an application to register an action (the function to be triggered). It expects data (context) to come from OSDU to enable the action, and the application can register a filter (enable/disable) to say what data can be used with this action.
- **Schema**: Enables a centralized governance and management of schema in the Data Ecosystem. It offers an implementation of the schema standard. Schema Service provides all necessary APIs to Fetch, create, update, and mark a schema obsolete.
- **Search**: Provides a mechanism for searching indexes. Supports full-text search on string fields, range queries on dates, numeric, or string fields, etc., along with geo-spatial search.
- **Secret (Preview)**: Facilitates the storage and retrieval of various types of secrets in a specified repository(ies) so that secrets can be secure, separated from the secrets in the infrastructure repository, and be managed easily by interfacing applications.
- **Seismic File Metadata**: Manages metadata associated with seismic data. It annotates dimensions, value channels, and generic key/value pairs.
- **Storage**: Provides a set of APIs to manage the entire metadata life-cycle such as ingestion (persistence), modification, deletion, versioning, and data schema.
- **Unit**: Provides dimension/measurement and unit definitions.

### Domain data management services (DDMS)
- **Seismic DDMS**: Enables secure access and efficient handling of seismic datasets.
- **Wellbore DDMS**: Enables secure access and handling of wellbore-related data.
- **Well Delivery DDMS**: Enables secure access, storage, and interaction of Well Delivery (planning and execution) data.
- **Rock and Fluid Samples DDMS**: Allows you to manage storage, retrieval, and association of rock and fluid sample master data, analyses, and reports.
- **Reservoir DDMS [[Preview]](how-to-enable-reservoir-ddms.md)**: Provides storage associated with seismic and well interpretation, structural modeling, geological modeling, and reservoir modeling including reservoir simulation input.

### Ingestion services
- **EDS DMS [[Preview]](how-to-enable-external-data-sources.md)**: Pulls specified data (metadata) from OSDU-compliant data sources via scheduled jobs while leaving associated dataset files (LAS, SEG-Y, etc.) stored at the external source for retrieval on demand.
  - **EDS Fetch & Ingest DAG**: Facilitates fetching data from external providers and ingesting it into the OSDU platform. It involves steps like registering with providers, creating data jobs, and triggering ingestion.
  - **EDS Scheduler DAG**: Automates data fetching based on predefined schedules and sends emails to recipients as needed. It ensures data remains current without manual intervention
  - **EDS Naturalization DAG**: Converts external dataset references into internal ones by fetching and storing actual data files into the OSDU platform, enabling full integration and alignment with internal schemas.
-  **Ingestion Workflow**: Initiates business processes within the system. During the prototype phase, it facilitates CRUD operations on workflow metadata and triggers workflows in Apache Airflow. Additionally, the service manages process startup records, acting as a wrapper around Airflow functions.
- **Manifest Ingestion DAG**: Used for ingesting single or multiple metadata artifacts about datasets in Azure Data Manager for Energy instance. Learn more about [Manifest-based ingestion](concepts-manifest-ingestion.md).
- **CSV Parser DAG**: Helps in parsing CSV files into a format for ingestion and processing. Learn more about [CSV Parser Ingestion](concepts-csv-parser-ingestion.md).
- **osdu-airflow-lib**: A library that enables user context ingestion within the Airflow workflows.
- **osdu-ingestion-lib**: A library that supports user context ingestion and includes various fixes related to Python versioning and authority replacement.
- **SegY-to-oVDS DAG**: Converts SegY file formats to oVDS.
- **SegY-to-oZGY DAG**: Converts SrgY file formats to ZGY.
- **Wellbore-DDMS Worker**: Used internally by the Wellbore DDMS Service & handles high‑volume, bulk wellbore data access through an internal API.

### Reference Data Values and Schema Versions
Reference Data Values and Schemas are released on independent OSDU community schedules and are not tied to OSDU Milestone releases. As a result, when Azure Data Manager for Energy is upgraded to a new milestone, it includes the versions of the OSDU Schemas and OSDU Reference Data Values that are current at the time of the upgrade.

## OSDU&reg; services unavailable on Azure Data Manager for Energy
Note: The following OSDU&reg; services are currently unavailable on Azure Data Manager for Energy.
- **Geospatial Consumption Zone** Users can alternatively [deploy the Geospatial Consumption Zone](how-to-deploy-gcz.md) service integrated with ADME.
- **Partition** Operations can still be performed using the available data partition APIs or through Azure portal.
- **Schema Upgrade** Users can alternatively [deploy the Schema Upgrade Tool](https://github.com/EirikHaughom/ADME/tree/main/Guides/Schema%20Upgrade%20Tool) integrated with ADME.
- **Production DDMS (Historian or Core)** Users can alternatively [deploy the Production DDMS](https://github.com/EirikHaughom/ADME/tree/main/Guides/Connected%20Production%20DDMS) to test functionality standalone.
- **Energistcs Parser DAG (WITSML Parser v2, Resqml Parser, ProdML Parser)**
- **Manifest Ingestion by Reference DAG**
- **Policy Service**
- **Seismic DDMS v4 APIs**
- **WITSML Parser DAG**