
# Overview
## [About Azure Cosmos DB](introduction.md)

# Quickstarts
## DocumentDB
### [.NET](create-documentdb-dotnet.md)
### [.NET Core](create-documentdb-dotnet-core.md)
### [Xamarin](create-documentdb-xamarin-dotnet.md)
## MongoDB
### [Node.js](create-mongodb-nodejs.md)
## Graph
### [.NET](create-graph-dotnet.md)
### [Gremlin console](create-graph-gremlin-console.md)
## Table
### [.NET](create-table-dotnet.md)

# Tutorials
## 1 - Create
### [DocumentDB](tutorial-develop-documentdb-dotnet.md)
### [MongoDB](tutorial-develop-mongodb.md)
### [Table](tutorial-develop-table-dotnet.md)
### [Graph](tutorial-develop-graph-dotnet.md)
## 2 - Import 
### [DocumentDB](../documentdb/documentdb-import-data.md)
### [MongoDB](../documentdb/documentdb-mongodb-migrate.md)
## 3 - Query
### [DocumentDB](tutorial-query-documentdb.md)
### [MongoDB](tutorial-query-mongodb.md)
### [Table](tutorial-query-table.md)
### [Graph](tutorial-query-graph.md)
## 4 - Distribute globally
### [DocumentDB](tutorial-global-distribution-documentdb.md)
### [MongoDB](tutorial-global-distribution-mongodb.md)
### [Table](tutorial-global-distribution-table.md)
### [Graph](tutorial-global-distribution-graph.md)
## 5 - Develop locally
### [Use the emulator](../documentdb/documentdb-nosql-local-emulator.md)
### [Export certificates](../documentdb/documentdb-nosql-local-emulator-export-ssl-certificates.md)

# Samples
## [Azure CLI 2.0](cli-samples.md)
## [Azure PowerShell](powershell-samples.md)

# Concepts
## [Global distribution](../documentdb/documentdb-distribute-data-globally.md)
## [Partitioning](partition-data.md)
## [Consistency](../documentdb/documentdb-consistency-levels.md)
## [Throughput](../documentdb/documentdb-request-units.md)
### [Request units per minute](request-units-per-minute.md)
## Multi-model APIs
### [DocumentDB](../documentdb/documentdb-introduction.md)
### [MongoDB](../documentdb/documentdb-protocol-mongodb.md)
### [Table](table-introduction.md)
### [Graph](graph-introduction.md)
## [Security](../documentdb/documentdb-nosql-database-security.md)
## [TCO](https://aka.ms/documentdb-tco-paper)
## [Use cases](../documentdb/documentdb-use-cases.md)

# How To Guides

## Develop
### DocumentDB API
#### [Resources](../documentdb/documentdb-resources.md)
#### [SQL query](../documentdb/documentdb-sql-query.md)
#### [SQL playground](https://www.documentdb.com/sql/demo)
#### [Partitioning](../documentdb/documentdb-partition-data.md)
#### [Stored procedures, triggers, and UDFs](../documentdb/documentdb-programming.md)
#### [Performance testing](../documentdb/documentdb-performance-testing.md)
#### [Performance tips](../documentdb/documentdb-performance-tips.md)
#### [Multi-master setup](../documentdb/documentdb-multi-region-writers.md)
#### [DateTimes](../documentdb/documentdb-working-with-dates.md)
#### Tutorials
##### Write your first app 
###### [.NET](../documentdb/documentdb-get-started.md)
###### [.NET Core](../documentdb/documentdb-dotnetcore-get-started.md)
###### [Java](../documentdb/documentdb-java-get-started.md)
###### [Node.js](../documentdb/documentdb-nodejs-get-started.md)
###### [C++](../documentdb/documentdb-cpp-get-started.md)
##### Build a web app
###### [.NET](../documentdb/documentdb-dotnet-application.md)
###### [Xamarin](../documentdb/documentdb-mobile-apps-with-xamarin.md)
###### [Node.js](../documentdb/documentdb-nodejs-application.md)
###### [Java](../documentdb/documentdb-java-application.md)
###### [Python Flask](../documentdb/documentdb-python-application.md)
#### Samples
##### [.NET samples](../documentdb/documentdb-dotnet-samples.md)
##### [Node.js samples](../documentdb/documentdb-nodejs-samples.md)
##### [Python samples](../documentdb/documentdb-python-samples.md)
##### [SQL syntax](https://msdn.microsoft.com/library/azure/dn782250.aspx)
##### [SQL grammar cheat sheet](../documentdb/documentdb-sql-query-cheat-sheet.md)
#### Resources
##### [Stack Overflow](http://stackoverflow.com/questions/tagged/azure-documentdb)
##### [Videos](https://azure.microsoft.com/documentation/videos/index/?services=documentdb)
##### [Service updates](https://azure.microsoft.com/updates/?product=documentdb)
##### [Community portal](../documentdb/documentdb-community.md)
##### [Schema agnostic indexing paper](http://www.vldb.org/pvldb/vol8/p1668-shukla.pdf)
##### [Retire S1, S2, S3](../documentdb/documentdb-performance-levels.md)

### MongoDB API
#### [Connect to your MongoDB account](../documentdb/documentdb-connect-mongodb-account.md)
#### [Using MongoChef](../documentdb/documentdb-mongodb-mongochef.md)
#### [Using Robomongo](../documentdb/documentdb-mongodb-robomongo.md)
#### Tutorials
##### [Node.js console app](../documentdb/documentdb-mongodb-samples.md)
### Graph API
#### [Gremlin support](gremlin-support.md)
### Table API
#### [Table storage](https://docs.microsoft.com/rest/api/storageservices/fileservices/Table-Service-Concepts)
### [Change feed](../documentdb/documentdb-change-feed.md)
### [Geospatial](../documentdb/documentdb-geospatial.md)
### [Indexing](../documentdb/documentdb-indexing-policies.md)

## Manage
### [Cost-effective reads and writes](../documentdb/documentdb-key-value-store-cost.md)
### [Expire data automatically](../documentdb/documentdb-time-to-live.md)
### [Back up and restore](../documentdb/documentdb-online-backup-and-restore.md)
### [Regional failover](../documentdb/documentdb-regional-failovers.md)
### Automation
#### [Azure CLI 1.0: Create an account](../documentdb/documentdb-automation-resource-manager-cli-nodejs.md)
#### [Azure CLI 1.0: Add or remove regions](../documentdb/documentdb-automation-region-management.md)
#### [Azure PowerShell](../documentdb/documentdb-manage-account-with-powershell.md)
### Security
#### [Encryption at rest](../documentdb/documentdb-nosql-database-encryption-at-rest.md)
#### [Firewall support](../documentdb/documentdb-firewall-support.md)


## Integrate
### [Connect to Spark](../documentdb/documentdb-spark-connector.md)
### [Deploy a website with Azure App Service](../documentdb/documentdb-create-documentdb-website.md)
### [Application logging with Logic Apps](../logic-apps/logic-apps-scenario-error-and-exception-handling.md)
### [Bind to Azure Functions](../azure-functions/functions-bindings-documentdb.md)
### [Analyze data with Hadoop](../documentdb/documentdb-run-hadoop-with-hdinsight.md)
### [Integrate with Azure Search](../search/search-howto-index-documentdb.md)
### [Move data with Azure Data Factory](../data-factory/data-factory-azure-documentdb-connector.md)
### [Analyze real-time data with Azure Stream Analytics](../stream-analytics/stream-analytics-define-outputs.md#documentdb)
### [Get changed HL7 FHIR record using Logic Apps](../documentdb/documentdb-change-feed-hl7-fhir-logic-apps.md)
### [Process sensor data in real time](../hdinsight/hdinsight-storm-iot-eventhub-documentdb.md)
### [Visualize your data with Power BI](../documentdb/documentdb-powerbi-visualize.md)
### [Leverage the ODBC driver for data visualization](../documentdb/documentdb-nosql-odbc-driver.md)

# Reference
## DocumentDB APIs
### [Java](../documentdb/documentdb-sdk-java.md)
### [.NET](../documentdb/documentdb-sdk-dotnet.md)
### [.NET Core](../documentdb/documentdb-sdk-dotnet-core.md)
### [Node.js](../documentdb/documentdb-sdk-node.md)
### [Python](../documentdb/documentdb-sdk-python.md)
### [REST](/rest/api/documentdb/)
### [REST Resource Provider](/rest/api/documentdbresourceprovider/)
## Table APIs
### [.NET](table-sdk-dotnet.md)
## Graph APIs
### [.NET](graph-sdk-dotnet.md)

# Resources
## [Pricing](https://azure.microsoft.com/pricing/details/documentdb/)
## [FAQ](../documentdb/documentdb-faq.md)
## [Stack Overflow](http://stackoverflow.com/questions/tagged/azure-cosmos-db)
## [Data consistency explained through baseball](http://research.microsoft.com/apps/pubs/default.aspx?id=206913)
