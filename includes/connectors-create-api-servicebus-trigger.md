In this example, I will show you how to use the **Service Bus - When a message is received in a queue** trigger to initiate a logic app workflow when a new item is to a Service Bus queue.  

>[AZURE.NOTE]You will get prompted to sign with your Service Bus connection string if you have not already created a *connection* to Service Bus.  

1. Enter *service bus* in the search box on the logic apps designer then select the **Service Bus - When a message is received in a queue**  trigger.  
![Service Bus trigger image 1](./media/connectors-create-api-servicebus/trigger-1.png)   
- The **When a message is received in a queue** control is displayed.  
![Service Bus trigger image 2](./media/connectors-create-api-servicebus/trigger-2.png)   
- Enter the name of the Service Bus queue you would like the trigger to monitor.   
![Service Bus trigger image 3](./media/connectors-create-api-servicebus/trigger-3.png)   

At this point, your logic app has been configured with a trigger that will begin a run of the other triggers and actions in the workflow when a new item is  received in the queue you selected.    