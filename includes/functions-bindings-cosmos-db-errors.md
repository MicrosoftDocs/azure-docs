| Binding | Service | Reference |
|---|---|---|
| DocumentDB | DocumentDB | [DocumentDB Error Codes](https://docs.microsoft.com/en-us/rest/api/documentdb/http-status-codes-for-documentdb) |

When processing documents from Azure Cosmos DB, you must handle errors that occur during function execution. Because the Cosmos DB trigger uses the [change feed](..\articles\cosmos-db\change-feed.md), failures that occur in the function are not resent.  