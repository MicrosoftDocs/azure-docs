---
title: OSDU Concepts - Available and Exclusive Services
description: This article provides an overview of the OSDU services available on Azure Data Manager for Energy as well as the OSDU services that are exclusively available in the community version.
author: bananibrahim
ms.service: energy-data-services
ms.author: bananibrahim

ms.topic: conceptual
ms.date: 06/12/2024
ms.custom: template-concept
---

# OSDU&reg; Concepts: Available and exclusive services
Azure Data Manager for Energy is currently compliant with the M18 OSDU® milestone release. 
## OSDU&reg; M18 services available on Azure Data Manager for Energy 
Below you will find an overview of the OSDU&reg; services that are currently available on Azure Data Manager for Energy. Please note that this page will be regularly updated as service versions and availablity evolve. 
### Core and helper services
- **Indexer**: Provides an endpoint to create aliases for existing indices and features flag index extended properties.
- **Indexer Queue**: Manages the queuing of indexing tasks and logs important identifiers.
- **Schema**: Manages OSDU data definition deliverables, including new schemas and schema versions.
- **Search**: Handles search functionality within the OSDU platform.
- **Storage**: Manages the storage of records and includes a ‘Frame of Reference’ header for batch records.
- **Notification**: Manages global exception API responses and notifications within the OSDU platform.
- **Register**: Handles the registration of entity types with consistent entityType regex patterns.
- **Secret**: Manages secret names and handles unknown Secret Manager errors.
- **File**: Manages file-related operations, including default TTL expiry time changes for downloadURL and uploadURL APIs.
- **CRS Conversion**: Manages the conversion of coordinate reference systems
- **CRS Catalog**: Provides a comprehensive listing of coordinate reference systems for geospatial data management.
- **Unit**: Manages units of measurement
- **Legal**: Managing legal tags associated with datasets
- **Partition**: Manages logical divisions of data for efficient access and governance.
- **Python SDK**: Offers tools and libraries for developers to interact with OSDU services using Python.
- **Dataset**: Supports various data operations.
- **CSV Parser**: Assists in parsing CSV files into a format for ingestion and processing. 
- **Entitlements**: Enables authorization by allowing the creation and management of groups that define user permissions.

### Ingestion services
- **Ingestion Workflow**: Manages the workflow for data ingestion, including user ID configuration.
- **osdu-airflow-lib**: A library that enables user context ingestion within the Airflow workflows.
- **osdu-ingestion-lib**: A library that supports user context ingestion and includes various fixes related to Python versioning and authority replacement.
- **Segy to Zgy Conversion**: Converts SEGY file formats to ZGY.
- **Segy to oVDS Conversion**: Converts SEGY files to oVDS format.
- **External Data Services [[Preview]](https://learn.microsoft.com/en-us/azure/energy-data-services/how-to-enable-external-data-sources)**: Pulls specified data (metadata) from OSDU-compliant data sources via scheduled jobs while leaving associated dataset files (LAS, SEG-Y, etc.) stored at the external source for retrieval on demand.

### Domain data management services (DDMS)
- **Seismic DDMS**: Enables secure access and efficient handling of seismic datasets.
- **Wellbore DDMS**: Enables secure access and handling of wellbore-related data.
- **Well Delivery DDMS**: Enables secure access, storage, and interaction of Well Delivery (planning and execution) data.

## OSDU&reg; services exclusive to M18 community version
NOTE: The following OSDU&reg; services are not currently available on Azure Data Manager for Energy.
- **WITSML Parser**
- **Reservoir DDMS**
- **External Data Services**
- **Policy Service**
- **Geospatial Consumption Zone**
- **Manifest Ingestion by Reference**
