| Type | Service | Trigger* | Input | Output |  
| --- | --- | --- | --- | --- |  
| [Schedule](../articles/azure-functions/functions-bindings-timer.md)  |Azure Functions |✔ | | |  
| [HTTP (REST or webhook)](../articles/azure-functions/functions-bindings-http-webhook.md) |Azure Functions |✔ |  |✔\** |  
| [Blob Storage](../articles/azure-functions/functions-bindings-storage-blob.md) |Azure Storage |✔ |✔ |✔ |  
| [Events](../articles/azure-functions/functions-bindings-event-hubs.md) |Azure Event Hubs |✔ | |✔ |  
| [Queues](../articles/azure-functions/functions-bindings-storage-queue.md) |Azure Storage |✔ | |✔ |  
| [Queues and topics](../articles/azure-functions/functions-bindings-service-bus.md) |Azure Service Bus |✔ | |✔ |  
| [Storage tables](../articles/azure-functions/functions-bindings-storage-table.md) |Azure Storage | |✔ |✔ |  
| [SQL tables](../articles/azure-functions/functions-bindings-mobile-apps.md) |Azure Mobile Apps | |✔ |✔ |  
| [No-SQL DB](../articles/azure-functions/functions-bindings-documentdb.md) | Azure DocumentDB | |✔ |✔ |  
| [Push Notifications](../articles/azure-functions/functions-bindings-notification-hubs.md) |Azure Notification Hubs | | |✔ |  
| [Twilio SMS Text](../articles/azure-functions/functions-bindings-twilio.md) |Twilio | | |✔ |
| [SendGrid email](../articles/azure-functions/functions-bindings-sendgrid.md) | SendGrid | | |✔ |

(\* - All triggers have associated input data)

(\** - The HTTP output binding requires an HTTP trigger)


