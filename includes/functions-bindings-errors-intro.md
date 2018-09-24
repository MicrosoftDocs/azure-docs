Azure Functions [triggers and bindings](..\articles\azure-functions\functions-triggers-bindings.md) communicate with various Azure services. When integrating with these services, you may have errors raised that originate from the APIs of the underlying Azure services. Errors can also occur when you try to communicate with other services from your function code by using REST or client libraries. To avoid loss of data and ensure good behavior of your functions, it is important to handle errors from either source.

The following triggers have built-in retry support:

* [Azure Blob storage](../articles/azure-functions/functions-bindings-storage-blob.md)
* [Azure Queue storage](../articles/azure-functions/functions-bindings-storage-queue.md)
* [Azure Service Bus (queue/topic)](../articles/azure-functions/functions-bindings-service-bus.md)

By default, these triggers are retried up to five times. After the fifth retry, these triggers write a message to a special [poison queue](..\articles\azure-functions\functions-bindings-storage-queue.md#trigger---poison-messages). 

For the other Functions triggers, there is no built-in retry when errors occur during function execution. To prevent loss of trigger information should an error occur in your function, we recommend that you use try-catch blocks in your function code to catch any errors. When an error occurs, write the information passed into the function by the trigger to a special "poison" message queue. This approach is the same one used by the [Blob storage trigger](..\articles\azure-functions\functions-bindings-storage-blob.md#trigger---poison-blobs). 

In this way, you can capture trigger events that could be lost due to errors and retry them at a later time using another function to process messages from the poison queue using the stored information.  
