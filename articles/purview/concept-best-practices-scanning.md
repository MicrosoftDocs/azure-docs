---
title: Best practices for scanning of data sources in Purview
description: This article provides best practices for registering and scanning various data sources in Azure Purview.
author: athenads
ms.author: athenadsouza
ms.service: purview
ms.subservice: purview-data-map
ms.topic: conceptual
ms.date: 10/08/2021
ms.custom: ignite-fall-2021
---

# Azure Purview scanning best practices

Azure Purview supports automated scanning of on-prem, multi-cloud, and SaaS data sources. Running a "scan" invokes the process to ingest metadata from the registered data sources. The metadata curated at the end of scan and curation process includes technical metadata like data asset names (table names/ file names), file size, columns, data lineage and so on. For structured data sources (for example Relational Database Management System) the schema details are also captured. The curation process applies automated classification labels on the schema attributes based on the scan rule set configured, and sensitivity labels if your Purview account is connected to a Microsoft 365 Security & Compliance Center.

## Why do you need best practices to manage data sources?

The best practices enable you to optimize cost, build operational excellence, improve security compliance and performance efficiency.
The design considerations and recommendations have been organized based on the key steps involved in the scanning process.

## Register source and establish connection

### Design considerations

- The hierarchy aligning with the organization’s strategy (geographical, business function, source of data, etc.) defining the data sources to be registered and scanned needs to be created using Collections.

- By design, you cannot register data sources multiple times in the same Purview account. This architecture helps to avoid the risk of assigning different access control to the same data source.

### Design recommendations

- If the metadata of the same data source is consumed by multiple teams, you can register and manage the data source at a parent collection and create corresponding scans under each subcollection, so relevant assets appear under each child collection. Sources without parents are grouped in a dotted box in the map view with no arrows linking them to parents.

  :::image type="content" source="media/concept-best-practices/scanning-parent-child.png" alt-text="Screenshot that shows Azure Purview with data source registered at parent collection.":::

- Use **Azure Multiple** option if you need to register multiple sources (Azure subscriptions or resource groups) on Azure cloud. Refer to the below documentation for more details:
    * [Scan multiple sources in Azure Purview](./register-scan-azure-multiple-sources.md)
    * [Check data source readiness at scale](./tutorial-data-sources-readiness.md) 
    * [Configure access to data sources for Azure Purview MSI at scale](./tutorial-msi-configuration.md)
     
- Once a data source is registered, you may scan the same source multiple times, in case the same source is being used by different teams or business units differently

For more details on defining a hierarchy for registering data sources, refer to the [best practices on Collections architecture](./concept-best-practices-collections.md)

## Scanning

### Design considerations

- Once the data source is registered, you need to set up a scan to manage automated and secure metadata scanning and curation
- Scan set up includes configuring the name of the scan, scope of scan, integration runtime, scan trigger frequency, scan rule set, and resource set uniquely for each data source per scan frequency.
- Before creating any credentials, consider your data source types and networking requirements to decide which authentication method and integration runtime is needed for your scenario.

### Design recommendations

To avoid unexpected cost and rework, it is recommended to plan and follow the below order when setting up scan, after registering your source in the relevant [collection](./how-to-create-and-manage-collections.md):

:::image type="content" source="media/concept-best-practices/scanning-scan-order.png" alt-text="Screenshot that shows the order to be followed while preparing a scan.":::

1. **Identify your classification requirements** from the system in-built classification rules and/or create specific custom classification rules as necessary, based on the specific industry, business, and / or regional requirements (which are not available out-of-the-box)
    - Refer [Classification best practices](./concept-best-practices-classification.md)
    - Refer for details on how to [create a custom classification and classification rule](./create-a-custom-classification-and-classification-rule.md)

2. **Create scan rule sets** before configuring the scan

    :::image type="content" source="media/concept-best-practices/scanning-create-scan-rule-set.png" alt-text="Screenshot that shows the Scan rule sets under Data map.":::

   While creating the scan rule set, ensure the following:
    - Verify if the system default scan rule set suffices for the data source being scanned, else define your custom scan rule set
    - Custom scan rule set can include both system default and custom, hence **uncheck** those not relevant for the data assets being scanned
    - Where necessary, create a custom rule set to exclude unwanted classification labels. For example, the system rule set contains generic government code patterns for the globe, not just the US; so, your data may match the pattern of some other type as well such as “Belgium Driver’s License Number”
    - Limit custom classification rules to **most important** and **relevant** labels, to avoid clutter(too many labels tagged to the asset)
    - If you modify custom classification or scan rule set, a full scan would be triggered. Hence it is recommended to configure classification and scan rule set appropriately to avoid rework and costly full scans
    
    :::image type="content" source="media/concept-best-practices/scanning-create-custom-scan-rule-set.png" alt-text="Screenshot that shows the option to select relevant classification rules while creating the custom scan rule set.":::


    > [!NOTE]
    > When scanning a storage account, Azure Purview uses a set of defined patterns to determine if a group of assets forms a resource set. Resource set pattern rules allow you to customize or override how Azure Purview detects which assets are grouped as resource sets and how they are displayed within the catalog.
    > Refer [How to create resource set pattern rules](./how-to-resource-set-pattern-rules.md) for more details. 
    > This feature has cost considerations, refer to the [pricing page](https://azure.microsoft.com/pricing/details/azure-purview/) for details.

3. **Set up a scan** for the registered data source(s)
    - **Scan name**: By default, Purview uses a naming convention **SCAN-[A-Z][a-z][a-z]** which is not helpful when trying to identify a scan that you have run. As a best practice, use a meaningful naming convention.  An instance could be naming the scan as _environment-source-frequency-time_, for example DEVODS-Daily-0200, which would represent a daily scan at 0200 hrs.
    
    - **Authentication**: Azure Purview offers various authentication methods for scanning the data sources, depending on the type of source (Azure cloud or on-prem or third-party sources). It is recommended to follow the least privilege principle for authentication method following below order of preference:
        - Purview MSI - Managed Identity (for example, for Azure Data Lake Gen2 sources)
        - User-assigned Managed Identity
        - Service Principal
        - SQL Authentication (for example, for on-prem or Azure SQL sources)
        - Account key or Basic Authentication (for example, for SAP S/4HANA sources)
        
        For details, see the how-to guide to [manage credentials](./manage-credentials.md).
        
        > [!Note]
        > If you have firewall enabled for the storage account, you must use Managed Identity authentication method when setting up a scan.
        > While setting up a new credential, the credential name can only contain _letters, numbers, underscores and hyphens_.

    - **Integration runtime**
        - Refer to [Network architecture best practices](./concept-best-practices-network.md#integration-runtime-options).
        - If SHIR is deleted, any ongoing scans relying on it will fail.
        - While using SHIR, ensure that the memory is sufficient for the data source being scanned. For example, when using SHIR for scanning SAP source, if you observe "out of memory error":
            - Ensure the SHIR machine has enough memory (it is recommended to have 128 GB)
            - In the scan setting, set the maximum memory Available as some appropriate value (for example, 100)
            - For details, refer the Prerequisites in [this](./register-scan-sapecc-source.md#create-and-run-scan) document

    - **Scope scan**: 
        - While setting up the scope for the scan, select only the assets, which are relevant at granular level or parent level. This will ensure that the scan cost is optimal and performance is efficient. All future assets under a certain parent will be automatically selected if the parent is fully or partially checked.
        - Some examples for some data sources:
            - For Azure SQL Database or ADLS Gen2, you can scope your scan to specific parts of the data source such as folders, subfolders, collections, or schemas by checking the appropriate items in the list.
            - For Oracle, Hive Metastore Database and Teradata sources, specific list of schemas to be exported can be specified through semi-colon separated values or through schema name patterns using SQL LIKE expressions.
            - For Google Big query, specific list of datasets to be exported can be specified through semi-colon separated values.
            - When creating a scan for an entire AWS account, you can select specific buckets to scan. When creating a scan for a specific AWS S3 bucket, you can select specific folders to scan.
            - For Erwin, you may scope your scan by providing a semicolon separated list of Erwin model locator strings.
            - For Cassandra, specific list of key spaces to be exported can be specified through semi-colon separated values or through key spaces name patterns using SQL LIKE expressions.
            - For Looker, you may scope your scan by providing a semicolon separated list of Looker projects.
            - For Power BI tenant, you may only specify whether to include or exclude personal workspace.
    
            :::image type="content" source="media/concept-best-practices/scanning-scope-scan.png" alt-text="Screenshot that shows the option to scope a scan while configuring the scan.":::
    

        - In general, it is recommended to use 'ignore patterns' (where supported) based on wild card (for example, for data lakes), to exclude temp, config files, RDBMS system tables or backup / STG tables
        - When scanning documents / unstructured data, avoid scanning huge number of such documents as the scan processes the first 20 MB of such documents and may result in longer scan duration.


    - **Scan rule set**
        - While selecting the scan rule set, ensure to configure relevant system / custom scan rule set created earlier
        - There is an option to create custom filetypes and you can fill  the details accordingly. Currently Azure Purview supports only one character in Custom Delimiter. If you use custom delimiters such as ~ in your actual data, you need to create a new scan rule set

    :::image type="content" source="media/concept-best-practices/scanning-scan-rule-set.png" alt-text="Screenshot that shows the Scan rule set selection while configuring the scan.":::

    - **Scan type and schedule**
        - The scan process can be configured to run full or incremental scans.
        - It is recommended to run the scans during non-business or off-peak hours to avoid any processing overload on source.
        - Initial scan is a full scan, and every subsequent scan is incremental. Subsequent scans may be scheduled as periodic incremental scans.
        - The frequency of scans should align with the change management schedule of the data source and/or business requirements. For example:
            - If the source structure could potentially change (new assets or fields within an asset are added, modified, or deleted) weekly then scan frequency should be in sync with the same.
            - If the classification / sensitivity labels are expected to be up to date on a weekly basis (may be due to regulatory reasons), then scan frequency should be weekly.
            For example, if partitions files are being added every week in a source data lake, then you may rather schedule monthly scans instead of weekly scans as there is no change in metadata (assuming there are no new classification scenarios)
            - When scheduling a scan that is to be run on the same day it is created, the start time must be before the scan time by at least one minute.
            - The maximum duration that the scan may run is seven days (possibly due to memory issues), this excludes the ingestion process. If progress has not been updated after seven days, the scan will be marked as failed. The ingestion (into catalog) process currently does not have any such limitation.

    - **Canceling scans**
        - Currently, scans can only be canceled or paused if the status of the scan has transitioned into "In Progress" state from "Queued" after you trigger the scan.
        - Cancelling an individual child scan is not supported.


### Points to note

- If a field / column, table, or a file is removed from the source system after the scan was executed, it will only be reflected (removed) in Purview after the next scheduled full / incremental scan.
- An asset can be deleted from Azure Purview catalog using the **delete** icon under the name of the asset (this will not remove the object in the source). However, if you run full scan on the same source, it would get reingested in the catalog. If you have scheduled a weekly / monthly scan instead (incremental) the deleted asset will not be picked unless the object is modified at source (for example, a column is added / removed from the table).
- To understand the behavior of subsequent scans after *manually* editing a data asset or an underlying schema through Purview Studio, refer to [Catalog asset details](./catalog-asset-details.md#scans-on-edited-assets).
- For more details refer the tutorial on [how to view, edit, and delete assets](./catalog-asset-details.md)

## Next steps
-  [Manage data sources](./manage-data-sources.md)
