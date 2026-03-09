---
title: Automatic connector upgrade
description: This article describes the guidance for automatically upgrading connectors of Azure Data Factory.
author: jianleishen
ms.author: jianleishen
ms.service: azure-data-factory
ms.subservice: data-movement
ms.topic: concept-article
ms.custom:
  - references_regions
  - build-2025
ms.date: 01/08/2026
---

# Automatic connector upgrade

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

## Supported automatic upgraded criteria

You can find more details from the table below on the connector list that is planned for the automatic upgrade.  

| Connector        | Scenario |
|------------------|----------|
| [Amazon RDS for Oracle](connector-amazon-rds-for-oracle.md) | Scenario that doesn't rely on capability below in Amazon RDS for Oracle (version 1.0):<br><br>• Use procedureRetResults, truststore, and truststorepassword as connection properties.<br>• Set the connection properties batchFailureReturnsError to 0 and enableBulkLoad to 0.<br><br>If your pipeline runs on self-hosted integration runtime, it requires SHIR version 5.58 or above. |
| [Amazon Redshift](connector-amazon-redshift.md) | If your pipeline runs on self-hosted integration runtime, it requires SHIR version 5.60 or above.|
| [Google BigQuery](connector-google-bigquery.md)  | Scenario that doesn't rely on below capability in Google BigQuery V1:<br><br>  • Use `trustedCertsPath`, `additionalProjects`, `requestgoogledrivescope` connection properties.<br>  • Set `useSystemTrustStore` connection property as `false`.<br>  • Use **STRUCT** and **ARRAY** data types. <br><br>If your pipeline runs on self-hosted integration runtime, it requires SHIR version 5.58 or above. |
| [Greenplum](connector-greenplum.md) | If your pipeline runs on self-hosted integration runtime, it requires SHIR version 5.56 or above. |
| [Hive](connector-hive.md) | Scenario that doesn't rely on below capability in Hive (version 1.0):<br><br>• Use Username authentication type.<br>• Thrift transport protocol:<br>&nbsp;&nbsp;• HiveServer1<br>• Service discovery mode: True<br>• Use native query: True <br><br>If your pipeline runs on self-hosted integration runtime, it requires SHIR version 5.59 or above.|
| [Impala](connector-impala.md) | Scenario that doesn't rely on below capability in Impala (version 1.0):<br><br>• Use SASL Username authentication type.<br><br>If your pipeline runs on self-hosted integration runtime, it requires SHIR version 5.59 or above. |
| [Jira](connector-jira.md) | Scenario that doesn't rely on below capability in Jira (version 1.0):<br><br>• Use `useEncryptedEndpoints`, `useHostVerification` and `usePeerVerification` as connection properties. <br>• Use `query`. <br><br>The following Jira tables are supported for automatic upgrade:<br>&nbsp;&nbsp;Platform.Api_Groups_Picker, Platform.Api_Issue_Type, Platform.Api_Project, Platform.Api_Field, Platform.Api_Status, Platform.Api_Status_Category, Platform.Api_Project_Type, Platform.Api_Resolution, Platform.Api_Priority, Platform.ApiAllUsers, Platform.Api_Issue_Link_Type, Platform.Api_Role, Platform.Api_Project_Versions, Platform.Api_Component, Platform.Api_Project_IssueTypes, Agile.Agile_Board_Epic, Agile.Agile_Board, Agile.Agile_Board_Sprint, Agile.Agile_Board_Issue, Agile.Agile_Board_Epic_Issue. <br><br>If your pipeline runs on self-hosted integration runtime, it requires SHIR version 5.63 or above. |
| [MariaDB](connector-mariadb.md) | If your pipeline runs on self-hosted integration runtime, it requires SHIR version 5.58 or above. |
| [MySQL](connector-mysql.md) | If your pipeline runs on self-hosted integration runtime, it requires SHIR version 5.58 or above. |
| [Netezza](connector-netezza.md) | If your pipeline runs on self-hosted integration runtime, it requires SHIR version 5.59 or above. |
| [Oracle](connector-oracle.md) | Scenario that doesn't rely on capability below in Oracle (version 1.0):<br><br>• Use procedureRetResults, truststore and truststorepassword as connection properties.<br>• Set the connection properties batchFailureReturnsError to 0 and enableBulkLoad to 0 <br>• Use PL/SQL command in Script activity<br>• Use script parameters in Script activity<br><br>If your pipeline runs on self-hosted integration runtime, it requires SHIR version 5.58 or above. |
| [PostgreSQL](connector-postgresql.md) | If your pipeline runs on self-hosted integration runtime, it requires SHIR version 5.58 or above. |
| [Presto](connector-presto.md) |Scenario that doesn't rely on capability below in Presto (version 1.0):<br><br>• Use MAP,  ARRAY, or ROW data types. <br>• trustedCertPath/allowSelfSignedServerCert/allowSelfSignedServerCert (will be supported soon)   <br><br>If your pipeline runs on self-hosted integration runtime, it requires SHIR version 5.57 or above. |
| [Salesforce](connector-salesforce.md) | Scenario that doesn't rely on capability below in Salesforce V1:<br><br>• Use the following SOQL queries and your pipeline runs on the self-hosted integration runtime with a version below 5.59.<br>&nbsp;&nbsp;• TYPEOF clauses<br>&nbsp;&nbsp;• Compound address/geolocations fields<br>•  Use the following SQL-92 queries and your pipeline runs on the self-hosted integration runtime.<br>&nbsp;&nbsp;• Timestamp ts keyword<br>&nbsp;&nbsp;• Top keyword<br>&nbsp;&nbsp;• Comments with -- or /*<br>&nbsp;&nbsp;• Group By and Having <br>• Report query {call "\<report name>"}|
| [Salesforce Service Cloud](connector-salesforce-service-cloud.md) | Scenario that doesn't rely on capability below in Salesforce Service Cloud V1:<br><br>• Use the following SOQL queries and your pipeline runs on the self-hosted integration runtime with a version below 5.59.<br>&nbsp;&nbsp;• TYPEOF clauses<br>&nbsp;&nbsp;• Compound address/geolocations fields<br>• Use the following SQL-92 queries and your pipeline runs on the self-hosted integration runtime.<br>&nbsp;&nbsp;• Timestamp ts keyword<br>&nbsp;&nbsp;• Top keyword<br>&nbsp;&nbsp;• Comments with -- or /*<br>&nbsp;&nbsp;• Group By and Having <br>• Report query {call "\<report name>"}|
| [ServiceNow](connector-servicenow.md) | Scenario that doesn't use the custom SQL query in dataset in ServiceNow V1. <br><br>Ensure that you have a role with at least read access to *sys_db_object*, *sys_db_view* and *sys_dictionary* tables in ServiceNow. To access views in ServiceNow, you need to have a role with at least read access to *sys_db_view_table* and *sys_db_view_table_field* tables.<br><br>If your pipeline runs on self-hosted integration runtime, it requires SHIR version 5.59 or above. |
| [Snowflake](connector-snowflake.md) | Scenario that doesn't rely on capability below in Snowflake V1:<br><br>• Use any of below<br>&nbsp;&nbsp;properties: connection_timeout, disableocspcheck, enablestaging, on_error, query_tag, quoted_identifiers_ignore_case, skip_header, stage, table, timezone, token, validate_utf8, no_proxy, nonproxyhosts, noproxy. <br>• Use multi-statement query in script activity or lookup activity. <br><br>If your pipeline runs on self-hosted integration runtime, it requires SHIR version 5.59 or above.   |
| [Spark](connector-spark.md) | Scenario that doesn't rely on below capability in Spark (version 1.0):<br><br>• Use Username authentication type. <br>• Thrift transport protocol:<br>&nbsp;&nbsp;• SASL<br>&nbsp;&nbsp;• Binary<br>• Thrift transport protocol:<br>&nbsp;&nbsp;• SharkServer<br>&nbsp;&nbsp;• SharkServer2<br><br>If your pipeline runs on self-hosted integration runtime, it requires SHIR version 5.59 or above.|
| [Teradata](connector-teradata.md)         | Scenario that doesn't rely on below capability in Teradata (version 1.0):<br><br>  • Set below value for **CharacterSet**:<br>&nbsp;&nbsp;• BIG5 (TCHBIG5_1R0)<br>&nbsp;&nbsp;• EUC (Unix compatible, KANJIEC_0U)<br>&nbsp;&nbsp;• GB (SCHGB2312_1T0)<br>&nbsp;&nbsp;• IBM Mainframe (KANJIEBCDIC5035_0I)<br>&nbsp;&nbsp;• NetworkKorean (HANGULKSC5601_2R4)<br>&nbsp;&nbsp;• Shift-JIS (Windows, DOS compatible, KANJISJIS_0S)<br><br>If your pipeline runs on self-hosted integration runtime, it requires SHIR version 5.58 or above.|
| [Vertica](connector-vertica.md) | Scenario that doesn't rely on below capability in Vertica (version 1.0):<br><br>• Linked service that uses Azure integration runtime.<br><br>Automatic upgrade is only applicable when the driver is installed in your machine that installs the self-hosted integration runtime (version 5.56 or above).<br><br> For more information, go to [Install Vertica ODBC driver for the version 2.0](connector-vertica.md#install-vertica-odbc-driver-for-the-version-20). |
| [Xero](connector-xero.md) | Scenario that doesn't rely on below capability in Xero (version 1.0):<br><br>• Use OAuth 1.0 authentication type. <br>• Use `query`. <br><br>The following Xero tables are supported for automatic upgrade: <br>&nbsp;&nbsp;Accounts, Bank_Transaction_Line_Item_Tracking, Bank_Transaction_Line_Items, Bank_Transactions, Bank_Transfers, Budgets, Contact_Group_Contacts, Contact_Groups, Contacts, Contacts_Addresses, Credit_Note_Line_Items, Credit_Notes, Credit_Notes_Allocations, Credit_Notes_Line_Items_Tracking, Currencies, Employees, Invoice_Line_Items, Invoices, Invoices_Credit_Notes, Invoices_Line_Items_Tracking, Items, Journal_Lines, Journals, Manual_Journal_Line_Tracking, Manual_Journal_Lines, Manual_Journals, Organisations, Overpayments, Payments, Prepayments, Projects, ProjectTasks, ProjectUsers, Purchase_Order_Line_Items, Purchase_Orders, Receipts, Tax_Rates, Tracking_Categories, Tracking_Category_Options, Users.   <br><br>If your pipeline runs on self-hosted integration runtime, it requires SHIR version 5.62 or above. |

## Related content

- [Connector overview](connector-overview.md)  
- [Connector lifecycle overview](connector-lifecycle-overview.md) 
- [Connector upgrade advisor](connector-upgrade-advisor.md)  
- [Connector release stages and timelines](connector-release-stages-and-timelines.md)  
- [Connector upgrade FAQ](connector-deprecation-frequently-asked-questions.md)
