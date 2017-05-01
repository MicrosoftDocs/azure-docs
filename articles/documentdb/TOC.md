
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
### .NET
### Gremlin console
<!---### [.NET](documentdb-connect-graph-dotnet.md)-->
<!---### [Gremlin console](documentdb-connect-gremlin-graph.md)--->
## Table
### .NET 
<!---[.NET](documentdb-connect-tables-dotnet.md)--->

# Tutorials
## 1 - Import
### [DocumentDB/Table/Graph](documentdb-import-data.md)
### [MongoDB](documentdb-mongodb-migrate.md)
## [2 - Partition and scale](documentdb-partition-data.md)
## 3 - Query
### [DocumentDB](documentdb-tutorial-query-documentdb.md)
### [MongoDB](documentdb-tutorial-query-mongodb.md)
### Table
### Graph
## [4 - Index](documentdb-indexing-policies.md)
## [5 - Tune consistency](documentdb-consistency-levels.md)
## [6 - Server-side business logic](documentdb-programming.md)
## [7 - Multi-regions](documentdb-portal-global-replication.md)
## [8 - Track changes](documentdb-change-feed.md)

# Samples
## [Azure CLI 2.0](documentdb-cli-samples.md)
## [Azure PowerShell](documentdb-powershell-samples.md)

# Concepts
## Multi-model approach
### [DocumentDB API](documentdb-introduction.md)
### [MongoDB API](documentdb-protocol-mongodb.md)
### Table API
<!---### [Table API](documentdb-table-introduction.md)--->
### Graph API
<!---### [Graph API](documentdb-graph-introduction.md)--->
## [Resource model](documentdb-resources.md)
## [Global distribution](documentdb-distribute-data-globally.md)
## [Regional failovers](documentdb-regional-failovers.md)
## [Security](documentdb-nosql-database-security.md)
## [Encryption at rest](documentdb-nosql-database-encryption-at-rest.md)
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
### [Multi-region development](documentdb-developing-with-multiple-regions.md)
### Gremlin support
<!---### [Gremlin support](documentdb-gremlin-support.md) --->
### [Continuation model](documentdb-continuation-model.md)
### [Concurrency model](documentdb-concurrency-model.md)
### [Use geospatial data](documentdb-geospatial.md)
### [Performance testing](documentdb-performance-testing.md)
### [Performance tips](documentdb-performance-tips.md)
### Best practices
#### [Multi-master setup](documentdb-multi-region-writers.md)
#### [DateTimes](documentdb-working-with-dates.md)
### Tutorials
### Write your first DocumentDB API app 
#### [.NET console app](documentdb-get-started.md)
#### [.NET Core console app](documentdb-dotnetcore-get-started.md)
#### [Java console app](documentdb-java-get-started.md)
#### [Node.js console app](documentdb-nodejs-get-started.md)
#### [Node.js console app for MongoDB API](documentdb-mongodb-samples.md)
#### [C++ console app](documentdb-cpp-get-started.md)
#### Java app
### Build a DocumentDB API web app
#### [.NET web app](documentdb-dotnet-application.md)
#### [.NET web app for MongoDB API](documentdb-mongodb-application.md)
#### [Xamarin app](documentdb-mobile-apps-with-xamarin.md)
#### [Node.js web app](documentdb-nodejs-application.md)
#### [Java web app](documentdb-java-application.md)
#### [Python Flask web app](documentdb-python-application.md)
### Write your first Table API app
<!---### [Write your first Table API app](documentdb-dotnet-tables-get-started.md)--->
### [Develop Locally](documentdb-nosql-local-emulator.md)
#### [Export Emulator Certificates](documentdb-nosql-local-emulator-export-ssl-certificates.md)
### Samples
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
