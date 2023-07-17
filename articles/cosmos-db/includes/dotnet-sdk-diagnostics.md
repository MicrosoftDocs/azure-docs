---
author: ealsur
ms.service: cosmos-db
ms.topic: include
ms.date: 08/30/2022
ms.author: maquaran
---
All the responses in the SDK, including `CosmosException`, have a `Diagnostics` property. This property records all the information related to the single request, including if there were retries or any transient failures.

The diagnostics are returned as a string. The string changes with each version, as it's improved for troubleshooting different scenarios. With each version of the SDK, the string will have breaking changes to the formatting. Don't parse the string to avoid breaking changes. The following code sample shows how to read diagnostic logs by using the .NET SDK:

```c#
try
{
    ItemResponse<Book> response = await this.Container.CreateItemAsync<Book>(item: testItem);
    if (response.Diagnostics.GetClientElapsedTime() > ConfigurableSlowRequestTimeSpan)
    {
        // Log the response.Diagnostics.ToString() and add any additional info necessary to correlate to other logs 
    }
}
catch (CosmosException cosmosException)
{
    // Log the full exception including the stack trace with: cosmosException.ToString()
    
    // The Diagnostics can be logged separately if required with: cosmosException.Diagnostics.ToString()
}

// When using Stream APIs
ResponseMessage response = await this.Container.CreateItemStreamAsync(partitionKey, stream);
if (response.Diagnostics.GetClientElapsedTime() > ConfigurableSlowRequestTimeSpan || !response.IsSuccessStatusCode)
{
    // Log the diagnostics and add any additional info necessary to correlate to other logs with: response.Diagnostics.ToString()
}
```