
# Overview
## [About Azure Cosmos DB](documentdb-multi-model-introduction.md)
## [Comparison of services](documentdb-nosql-vs-sql.md)

# Quickstarts
## DocumentDB
### [.NET](documentdb-connect-dotnet.md)
### [.NET Core](documentdb-connect-dotnet-core.md)
### [Xamarin](documentdb-connect-xamarin-dotnet.md)
## MongoDB
### [Node.js](documentdb-connect-mongodb-app.md)
## Graph
### [.NET](documentdb-connect-graph-dotnet.md)
### [Gremlin console](documentdb-graph-getting-started-console.md)
## Table
### .NET 
<!---[.NET](documentdb-connect-tables-dotnet.md)--->

# Tutorials

## 1 - Create
### [DocumentDB](documentdb-tutorial-documentdb-create-partitioned.md)
### MongoDB
### Table
### Graph
## 2 - Import 
### [DocumentDB/Table/Graph](documentdb-import-data.md)
### [MongoDB](documentdb-mongodb-migrate.md)
## 3 - Query
### [DocumentDB](documentdb-tutorial-query-documentdb.md)
### [MongoDB](documentdb-tutorial-query-mongodb.md)
### Table
### Graph
## 4 - Index
## 5 - Tune consistency
## 6 - Server-side business logic
## [7 - Multi-region replication](documentdb-portal-global-replication.md)
## 8 - Track changes
## 9 - Develop locally
### [1 - Use the emulator](documentdb-nosql-local-emulator.md)
### [2 - Export certificates](documentdb-nosql-local-emulator-export-ssl-certificates.md)

# Samples
## [Azure CLI 2.0](documentdb-cli-samples.md)
## [Azure PowerShell](documentdb-powershell-samples.md)

# Concepts
## [Multi-model APIs](documentdb-resources.md)
### [DocumentDB API](documentdb-introduction.md)
### [MongoDB API](documentdb-protocol-mongodb.md)
### Table API
<!---### [Table API](documentdb-table-introduction.md)--->
### [Graph API](documentdb-graph-introduction.md)
## [Global distribution](documentdb-distribute-data-globally.md)
## [Partition and scale](documentdb-partition-data.md)
## [Consistency](documentdb-consistency-levels.md)
## [Regional failover](documentdb-regional-failovers.md)
## [Security](documentdb-nosql-database-security.md)
## [NoSQL TCO analysis](https://aka.ms/documentdb-tco-paper)
## Scenarios
### [Common use cases](documentdb-use-cases.md)
### [Going social with Azure Cosmos DB](documentdb-social-media-apps.md)

# How To Guides

## Manage
### [Cost-effective reads and writes](documentdb-key-value-store-cost.md)
### [Request units](documentdb-request-units.md)
### [Connect to your MongoDB account](documentdb-connect-mongodb-account.md)
### [Using MongoChef](documentdb-mongodb-mongochef.md)
### [Using Robomongo](documentdb-mongodb-robomongo.md)
### [Model your data](documentdb-modeling-data.md)
### [Expire data automatically](documentdb-time-to-live.md)
### [Back up and restore](documentdb-online-backup-and-restore.md)
### Automation
#### [Azure CLI 2.0](documentdb-automation-resource-manager-cli.md)
#### [Azure CLI 1.0: Create an account](documentdb-automation-resource-manager-cli-nodejs.md)
#### [Azure CLI 1.0: Add or remove regions](documentdb-automation-region-management.md)
#### [Azure PowerShell](documentdb-manage-account-with-powershell.md)
### Security
#### [Secure access to data](documentdb-secure-access-to-data.md)
#### [Firewall support](documentdb-firewall-support.md)
### [Retire S1, S2, S3](documentdb-performance-levels.md)

## Develop
### [SQL query](documentdb-sql-query.md)
### [Stored procedures, triggers, and UDFs](documentdb-programming.md)
### [Customize your indexes](documentdb-indexing-policies.md)
### [Multi-region development](documentdb-developing-with-multiple-regions.md)
### [Track changes with change feed](documentdb-change-feed.md)
### [Gremlin support](documentdb-gremlin-support.md)
### [Continuation model](documentdb-continuation-model.md)
### [Concurrency model](documentdb-concurrency-model.md)
### [Use geospatial data](documentdb-geospatial.md)
### [Performance testing](documentdb-performance-testing.md)
### [Performance tips](documentdb-performance-tips.md)
### Tutorials 
#### DocumentDB
##### Write your first app 
###### [.NET](documentdb-get-started.md)
###### [.NET Core](documentdb-dotnetcore-get-started.md)
###### [Java](documentdb-java-get-started.md)
###### [Node.js](documentdb-nodejs-get-started.md)
###### [C++](documentdb-cpp-get-started.md)
##### Build a web app
###### [.NET](documentdb-dotnet-application.md)
###### [Xamarin](documentdb-mobile-apps-with-xamarin.md)
###### [Node.js](documentdb-nodejs-application.md)
###### [Java](documentdb-java-application.md)
###### [Python Flask](documentdb-python-application.md)
#### MongoDB
##### [Node.js console app](documentdb-mongodb-samples.md)
##### [.NET web app](documentdb-mongodb-application.md)
#### Graph
##### [Gremlin console](documentdb-graph-getting-started-console.md)
##### [.NET](documentdb-connect-graph-dotnet.md)
#### Table
##### .NET
<!---### [Write your first Table API app](documentdb-dotnet-tables-get-started.md)--->
### Best practices
#### [Multi-master setup](documentdb-multi-region-writers.md)
#### [DateTimes](documentdb-working-with-dates.md)### Samples
#### DocumentDB API
##### [.NET samples](documentdb-dotnet-samples.md)
##### [Node.js samples](documentdb-nodejs-samples.md)
##### [Python samples](documentdb-python-samples.md)
##### [SQL syntax](https://msdn.microsoft.com/library/azure/dn782250.aspx)
##### [SQL grammar cheat sheet](documentdb-sql-query-cheat-sheet.md)
#### Table API
##### [.NET samples](documentdb-tables-dotnet-samples.md)
#### Graph API
##### [.NET samples](documentdb-graph-dotnet-samples.md)

## Use the portal
### [Create a database account](documentdb-create-account.md)
### [Create a collection](documentdb-create-collection.md)
### [Set throughput](documentdb-set-throughput.md)
### [Add global replication](documentdb-portal-global-replication.md)
### [Add and edit documents](documentdb-view-json-document-explorer.md)
### [Query documents](documentdb-query-collections-query-explorer.md)
### [Manage an account](documentdb-manage-account.md)
### [Monitor an account](documentdb-monitor-accounts.md)
### [Manage scripts](documentdb-view-scripts.md)
### [Troubleshooting tips](documentdb-portal-troubleshooting.md)


## Integrate
### [Connect to Spark](documentdb-spark-connector.md)
### [Deploy a website with Azure App Service](documentdb-create-documentdb-website.md)
### [Application logging with Logic Apps](../logic-apps/logic-apps-scenario-error-and-exception-handling.md)
### [Bind to Azure Functions](../azure-functions/functions-bindings-documentdb.md)
### [Analyze data with Hadoop](documentdb-run-hadoop-with-hdinsight.md)
### [Integrate with Azure Search](../search/search-howto-index-documentdb.md)
### [Move data with Azure Data Factory](../data-factory/data-factory-azure-documentdb-connector.md)
### [Analyze real-time data with Azure Stream Analytics](../stream-analytics/stream-analytics-define-outputs.md#documentdb)
### [Get changed HL7 FHIR record using Logic Apps](documentdb-change-feed-hl7-fhir-logic-apps.md)
### [Process sensor data in real time](../hdinsight/hdinsight-storm-iot-eventhub-documentdb.md)
### [Visualize your data with Power BI](documentdb-powerbi-visualize.md)
### [Leverage the ODBC driver for data visualization](documentdb-nosql-odbc-driver.md)

# Reference
## [Java](documentdb-sdk-java.md)
## [.NET](documentdb-sdk-dotnet.md)
## [.NET Core](documentdb-sdk-dotnet-core.md)
## [Node.js](documentdb-sdk-node.md)
## [Python](documentdb-sdk-python.md)
## [REST](/rest/api/documentdb/)
## [REST Resource Provider](/rest/api/documentdbresourceprovider/)

# Resources
## [Pricing](https://azure.microsoft.com/pricing/details/documentdb/)
## [MSDN forum](https://social.msdn.microsoft.com/forums/azure/home?forum=AzureDocumentDB)
## [Stack Overflow](http://stackoverflow.com/questions/tagged/azure-documentdb)
## [Videos](https://azure.microsoft.com/documentation/videos/index/?services=documentdb)
## [Service updates](https://azure.microsoft.com/updates/?product=documentdb)
## [Community portal](documentdb-community.md)
## [Query Playground](https://www.documentdb.com/sql/demo)
## [Table storage](https://docs.microsoft.com/rest/api/storageservices/fileservices/Table-Service-Concepts)
## [Schema agnostic indexing paper](http://www.vldb.org/pvldb/vol8/p1668-shukla.pdf)
## [Data consistency explained through baseball](http://research.microsoft.com/apps/pubs/default.aspx?id=206913)
## [Book: Using Microsoft Azure DocumentDB in a Node.js Application](https://go.microsoft.com/fwlink/?LinkId=828428&clcid=0x409)
## [Learning path](https://azure.microsoft.com/documentation/learning-paths/documentdb/)
