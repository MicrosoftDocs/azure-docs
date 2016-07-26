### Prerequisites

- A [ServiceBus](https://azure.microsoft.com/services/service-bus/) account  


Before you can use your ServiceBus account in a logic app, you must authorize the logic app to connect to your ServiceBus account.Fortunately, you can do this easily from within your logic app on the Azure Portal.  

Here are the steps to authorize your logic app to connect to your ServiceBus account:  
1. To create a connection to ServiceBus, in the logic app designer, select **Show Microsoft managed APIs** in the drop down list then enter *ServiceBus* in the search box.Select the trigger or action you'll like to use:  
![Service bus connection image 1](./media/connectors-create-api-servicebus/servicebus-1.png)  
2. If you haven't created any connections to ServiceBus before, you'll get prompted to provide your ServiceBus credentials. These credentials will be used to authorize your logic app to connect to, and access your ServiceBus account's data:  
![Service bus connection image 2](./media/connectors-create-api-servicebus/servicebus-2.png)  
3. Notice the connection has been created and you are now free to proceed with the other steps in your logic app:  
 ![Service bus connection image 3](./media/connectors-create-api-servicebus/servicebus-3.png)   
