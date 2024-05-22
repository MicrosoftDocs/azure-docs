---
title: "Microsoft Azure Data Manager for Energy - How to register external data sources"
description: "This article describes how to register external data sources with Azure Data Manager for Energy."
author: bharathim
ms.author: bselvaraj
ms.service: energy-data-services
ms.topic: how-to #Don't change
ms.date: 03/14/2024

#customer intent: As a Data Manager in Operating company, I want to register external data sources with Azure Data Manager for Energy so that I could pull metadata at scheduled intervals and retrieve bulk data on demand.

---
# How to register an External Data Sources (EDS) with Azure Data Manager for Energy?
This article explains how to register an External Data Sources (EDS) with Azure Data Manager for energy. EDS allow you to fetch and ingest data (metadata) from external data sources. It also allows you to retrieve bulk data on demand.

## Prerequisites 
- Download and import API [collection](https://community.opengroup.org/osdu/platform/pre-shipping/-/blob/main/R3-M20/QA_Artifacts_M20/eds_testing_doc/EDS_Ingest_M20_Pre-Shipping_Setup_and_Testing.postman_collection.json?ref_type=heads) and [environment](https://community.opengroup.org/osdu/platform/pre-shipping/-/blob/main/R3-M20/QA_Artifacts_M20/envFilesAndCollections/envFiles/OSDU%20R3%20M20%20RI%20Pre-ship.postman_environment.json?ref_type=heads) files into API test client (like Postman). Make appropriate modifications in environment based on your data source. 
- Refer **Section 2.2** in [osdu-eds-data-supplier-enablement-guide](https://gitlab.opengroup.org/osdu/r3-program-activities/docs/-/raw/master/R3%20Document%20Snapshot/23-osdu-eds-data-supplier-enablement-guide.pdf) for details on Data source Registration. 
- Review **Connected Source Registry Entry (CSRE)** and **Connection Source Data Job (CSDJ)** sections in [EDS_Documentation-1.0.docx](https://gitlab.opengroup.org/osdu/subcommittees/ea/projects/extern-data/docs/-/blob/master/Design%20Documents/Training/EDS_Documentation-1.0.docx) to understand the various parameters used in data source registration. 
- To run EDS, the user must be a member of `service.eds.user` entitlements group. Additionally, to access Secret service, the user should be a member of the following entitlements: `service.secret.viewer`, `service.secret.editor`, `service.secret.admin`.  

## EDS Fetch and Ingest workflow 
Execute the APIs in the following collections to register your external data source that runs EDS Fetch and Ingest workflow on a schedule: 

1. `001: Pre-req: Validate Schema Registration`
1. `002: Pre-req: Validate Reference Data` 
1. `003: Secret Service` 
1. `004: Pre-req: Add Source Registry` 

After successful data registration, data is regularly fetched from external sources and added to your Azure Data Manager for Energy. 

You can use the Search service to search for your ingested data. 

## Troubleshooting

You could run the below Kusto queries in your Log analytics workspace to identify any issues with Data Source registration. 


```kusto
OEPAirFlowTask 
| where DagName == "eds_ingest"        
| where LogLevel == "ERROR" // ERROR/DEBUG/INFO/WARNING
```

```kusto
OEPAirFlowTask 
| where DagName == "eds_scheduler"        
| where LogLevel == "ERROR" // ERROR/DEBUG/INFO/WARNING
```
## Retrieve bulk data on demand
Use **getRetrievalInstructions** API in `005: Dataset Service collection` to retrieve bulk data from external data sources on demand. 

## References
* [External data sources FAQ](faq-energy-data-services.yml#external-data-sources)
* [EDS documentation 1.0](https://gitlab.opengroup.org/osdu/subcommittees/ea/projects/extern-data/docs/-/blob/master/Design%20Documents/Training/EDS_Documentation-1.0.docx)
* [EDS M18 release notes](https://community.opengroup.org/osdu/governance/project-management-committee/-/wikis/M18-Release-Notes#external-data-sources-eds)
* [EDS Postman collection](https://community.opengroup.org/osdu/platform/pre-shipping/-/blob/main/R3-M20/QA_Artifacts_M20/eds_testing_doc/EDS_Ingest_M20_Pre-Shipping_Setup_and_Testing.postman_collection.json?ref_type=heads)
* [EDS supplier enablement guide](https://gitlab.opengroup.org/osdu/r3-program-activities/docs/-/raw/master/R3%20Document%20Snapshot/23-osdu-eds-data-supplier-enablement-guide.pdf)
* [EDS issues](https://community.opengroup.org/osdu/platform/data-flow/ingestion/external-data-sources/core-external-data-workflow/-/issues)