Azure Functions [triggers and bindings](..\articles\azure-functions\functions-triggers-bindings.md) communicate with various Azure services. When integrating with these services, you may have errors raised that originate from the underlying Azure services SDKs. 

The native retry you must handle errors that occur during function execution. Because the Cosmos DB trigger uses the [change feed](..\articles\cosmos-db\change-feed.md), failures that occur in the function are not resent. 

This topic describes error information specific to the various bindings and also links to the error code documentation for the supported services.