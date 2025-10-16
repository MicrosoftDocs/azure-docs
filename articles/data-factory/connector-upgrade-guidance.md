---
title: Connector upgrade guidance
description: This article describes the guidance for upgrading connectors of Azure Data Factory.
author: jianleishen
ms.author: jianleishen
ms.service: azure-data-factory
ms.subservice: data-movement
ms.topic: concept-article
ms.custom:
  - references_regions
  - build-2025
ms.date: 10/16/2025
---

# Connector upgrade guidance

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article provides guidance for upgrading connectors in Azure Data Factory.  

## How to receive notifications in Azure Service Health portal

Regular notifications are sent to you to help you upgrade related connectors or notify you the key dates for EOS and removal. You can find the notification under Service Health portal - Health advisories tab.

Here's the steps to help you find the notification: 

1. Navigate to [Service Health portal](https://portal.azure.com/#view/Microsoft_Azure_Health/AzureHealthBrowseBlade/%7E/serviceIssues) or you can select **Service Health** icon on your Azure portal dashboard.
1. Go to **Health advisories** tab and you can see the notification related to your connectors in the list. You can also go to **Health history** tab to check historical notifications.

    :::image type="content" source="media/connector-lifecycle/service-health-health-advisories.png" alt-text="Screenshot of service health.":::

To learn more about the Service Health portal, see this [article](/azure/service-health/service-health-overview).


## How to find your impacted objects from data factory portal

Here's the steps to get your objects which still rely on the deprecated connectors or connectors that have a precise end of support date. It is recommended to take action to upgrade those objects to the new connector version before the end of the support date.

1.	Open your Azure Data Factory.
2.	Go to Manage – Linked services page.
3.	You should see the Linked Service that is still on V1 with an alert behind it.
4.	Click on the number under the 'Related' column will show you the related objects that utilize this Linked service.
5.	To learn more about the upgrade guidance and the comparison between V1 and V2, you can navigate to the connector upgrade section within each connector page.


:::image type="content" source="media/connector-lifecycle/linked-services-page.png" alt-text="Screenshot of the linked services page." lightbox="media/connector-lifecycle/linked-services-page.png":::

## How to find your impacted objects programmatically 

Users can run a PowerShell script to programmatically extract a list of Azure Data Factory or Synapse linked services that are using integration runtimes running on versions that are either out of support or nearing end-of-support. The script can be customized to query each data factory under a specified tenant or subscription, enumerate a list of specified linked services, and inspect configuration properties such as connection types, connector versions. It can then cross-reference these details against known version EOS timelines, flagging any linked services using unsupported or soon-to-be unsupported connector versions. This automated approach enables users to proactively identify and remediate outdated components to ensure continued support, security compliance, and service availability. 

You can find examples of the script and customize it as needed:

- [Script to list all linked services within the specified subscription ID](https://github.com/Azure/Azure-DataFactory/blob/main/Connector/FindImpactedObjects.ps1)
- [Script to list all linked services within the specified tenant ID](https://github.com/Azure/Azure-DataFactory/blob/main/Connector/FindImpactedObjects1.ps1)

## Automatic connector upgrade 

In addition to providing [tools](connector-upgrade-advisor.md) and [best practices](connector-upgrade-guidance.md) to help users manually upgrade their connectors, the service now also provides a more streamlined upgrade process for some cases where applicable. This is designed to help users adopt the most reliable and supported connector versions with minimal disruption.

The following section outlines the general approach that the service takes for automatic upgrades. While this provides a high-level overview, it's strongly recommended to review the documentation specific to each connector to understand which scenarios are supported and how the upgrade process applies to your workloads.

In cases where certain scenarios running on the latest GA connector version are fully backward compatible with the previous version, the service will automatically upgrade existing workloads (such as Copy, Lookup, and Script activities) to a compatibility mode that preserves the behavior of the earlier version.

These auto-upgraded workloads aren't affected by the announced removal date of the older version, giving users additional time to evaluate and transition to the latest GA version without facing immediate failures. 

You can identify which activities have been automatically upgraded by inspecting the activity output, where relevant upgraded information is recorded. The examples below show the upgraded information in various activity outputs.

**Example:**

Copy activity output 

```json
"source": {
    "type": "AmazonS3",
    "autoUpgrade": "true"
} 

"sink": {
    "type": "AmazonS3",
    "autoUpgrade": "true"
}
```

Lookup activity output 

```json
"source": {
    "type": "AmazonS3",
    "autoUpgrade": "true"
}
```
 
Script activity output

```json
"source": {
    "type": "AmazonS3",
    "autoUpgrade": "true"
}
```

> [!NOTE]
> While compatibility mode offers flexibility, we strongly encourage users to upgrade to the latest GA version as soon as possible to benefit from ongoing improvements, optimizations, and full support. 

### Supported automatic upgraded criteria

You can find more details from the table below on the connector list that is planned for the automatic upgrade.  

| Connector        | Scenario |
|------------------|----------|
| [Amazon RDS for Oracle](connector-amazon-rds-for-oracle.md) | Scenario that doesn't rely on capability below in Oracle (version 1.0):<br><br>• Use procedureRetResults, batchFailureReturnsError, truststore, and truststorepassword as connection properties.<br>• Use query ends with the semicolon.<br><br>If your pipeline runs on self-hosted integration runtime, it requires SHIR version 5.56 or above. |
| [Amazon Redshift](connector-amazon-redshift.md) | Scenario that doesn't rely on below capability in Amazon Redshift (version 1.0):<br><br>• Linked service that uses Azure integration runtime.<br>• Use [UNLOAD](connector-amazon-redshift.md#use-unload-to-copy-data-from-amazon-redshift).<br><br>Automatic upgrade is only applicable when the driver is installed in your machine that installs the self-hosted integration runtime.<br><br> For more information, go to [Install Amazon Redshift ODBC driver for the version 2.0](connector-amazon-redshift.md#install-amazon-redshift-odbc-driver-for-the-version-20).|
| [Google BigQuery](connector-google-bigquery.md)  | Scenario that doesn't rely on below capability in Google BigQuery V1:<br><br>  • Use `trustedCertsPath`, `additionalProjects`, `requestgoogledrivescope` connection properties.<br>  • Set `useSystemTrustStore` connection property as `false`.<br>  • Use **STRUCT** and **ARRAY** data types. <br><br>If your pipeline runs on self-hosted integration runtime, it requires SHIR version 5.55 or above. |
| [Greenplum](connector-greenplum.md) | If your pipeline runs on self-hosted integration runtime, it requires SHIR version 5.56 or above. |
| [Hive](connector-hive.md) | Scenario that doesn't rely on below capability in Hive (version 1.0):<br><br>• Authentication types:<br>&nbsp;&nbsp;• Username<br>• Thrift transport protocol:<br>&nbsp;&nbsp;• HiveServer1<br>• Service discovery mode: True<br>• Use native query: True <br><br>If your pipeline runs on self-hosted integration runtime, it requires SHIR version 5.55 or above.|
| [Impala](connector-impala.md) | Scenario that doesn't rely on below capability in Impala (version 1.0):<br><br>• Authentication types:<br>&nbsp;&nbsp;• SASL Username<br><br>If your pipeline runs on self-hosted integration runtime, it requires SHIR version 5.55 or above. |
| [MariaDB](connector-mariadb.md) | If your pipeline runs on self-hosted integration runtime, it requires SHIR version 5.56 or above. |
| [MySQL](connector-mysql.md) | If your pipeline runs on self-hosted integration runtime, it requires SHIR version 5.56 or above. |
| [Oracle](connector-oracle.md) | Scenario that doesn't rely on capability below in Oracle (version 1.0):<br><br>• Use procedureRetResults, batchFailureReturnsError, truststore, and truststorepassword as connection properties.<br>• Use Oracle connector as sink.<br>• Use query ends with the semicolon.<br>• Use PL/SQL command in Script activity<br>• Use script parameters in Script activity<br><br>If your pipeline runs on self-hosted integration runtime, it requires SHIR version 5.56 or above. |
| [PostgreSQL](connector-postgresql.md) | If your pipeline runs on self-hosted integration runtime, it requires SHIR version 5.56 or above. |
| [Presto](connector-presto.md) |Scenario that doesn't rely on capability below in Presto (version 1.0):<br><br>• Use MAP,  ARRAY, or ROW data types. <br>• trustedCertPath/allowSelfSignedServerCert/allowSelfSignedServerCert (will be supported soon)   <br><br>If your pipeline runs on self-hosted integration runtime, it requires SHIR version 5.57 or above. |
| [Salesforce](connector-salesforce.md) | Scenario that doesn't rely on capability below in Salesforce V1:<br><br>• SOQL queries that use:<br>&nbsp;&nbsp;• TYPEOF clauses<br>&nbsp;&nbsp;• Compound address/geolocations fields<br>• All SQL-92 query<br>• Report query {call "\<report name>"}<br>• Use Self-hosted integration runtime (To be supported) |
| [Salesforce Service Cloud](connector-salesforce-service-cloud.md) | Scenario that doesn't rely on capability below in Salesforce Service Cloud V1:<br><br>• SOQL queries that use:<br>&nbsp;&nbsp;• TYPEOF clauses<br>&nbsp;&nbsp;• Compound address/geolocations fields<br>• All SQL-92 query<br>• Report query {call "\<report name>"}<br>• Use Self-hosted integration runtime (To be supported) |
| [ServiceNow](connector-servicenow.md) | Scenario that doesn't use the custom SQL query in dataset in ServiceNow V1. <br><br>If your pipeline runs on self-hosted integration runtime, it requires SHIR version 5.58 or above. |
| [Snowflake](connector-snowflake.md) | Scenario that doesn't rely on capability below in Snowflake V1:<br><br>• Use any of below<br>&nbsp;&nbsp;properties: connection_timeout, disableocspcheck, enablestaging, on_error, query_tag, quoted_identifiers_ignore_case, skip_header, stage, table, timezone, token, validate_utf8, no_proxy, nonproxyhosts, noproxy. <br>• Use multi-statement query in script activity or lookup activity. <br><br>If your pipeline runs on self-hosted integration runtime, it requires SHIR version 5.56 or above.   |
| [Spark](connector-spark.md) | Scenario that doesn't rely on below capability in Spark (version 1.0):<br><br>• Authentication types:<br>&nbsp;&nbsp;• Username<br>• Thrift transport protocol:<br>&nbsp;&nbsp;• SASL<br>&nbsp;&nbsp;• Binary<br>• Thrift transport protocol:<br>&nbsp;&nbsp;• SharkServer<br>&nbsp;&nbsp;• SharkServer2<br><br>If your pipeline runs on self-hosted integration runtime, it requires SHIR version 5.55 or above.|
| [Teradata](connector-teradata.md)         | Scenario that doesn't rely on below capability in Teradata (version 1.0):<br><br>  • Set below value for **CharacterSet**:<br>&nbsp;&nbsp;• BIG5 (TCHBIG5_1R0)<br>&nbsp;&nbsp;• EUC (Unix compatible, KANJIEC_0U)<br>&nbsp;&nbsp;• GB (SCHGB2312_1T0)<br>&nbsp;&nbsp;• IBM Mainframe (KANJIEBCDIC5035_0I)<br>&nbsp;&nbsp;• NetworkKorean (HANGULKSC5601_2R4)<br>&nbsp;&nbsp;• Shift-JIS (Windows, DOS compatible, KANJISJIS_0S)<br><br>If your pipeline runs on self-hosted integration runtime, it requires SHIR version 5.58 or above.|
| [Vertica](connector-vertica.md) | Scenario that doesn't rely on below capability in Vertica (version 1.0):<br><br>• Linked service that uses Azure integration runtime.<br><br>Automatic upgrade is only applicable when the driver is installed in your machine that installs the self-hosted integration runtime (version 5.55 or above).<br><br> For more information, go to [Install Vertica ODBC driver for the version 2.0](connector-vertica.md#install-vertica-odbc-driver-for-the-version-20). |

## Related content

- [Connector overview](connector-overview.md)  
- [Connector lifecycle overview](connector-lifecycle-overview.md) 
- [Connector upgrade advisor](connector-upgrade-advisor.md)  
- [Connector release stages and timelines](connector-release-stages-and-timelines.md)  
- [Connector upgrade FAQ](connector-deprecation-frequently-asked-questions.md)
