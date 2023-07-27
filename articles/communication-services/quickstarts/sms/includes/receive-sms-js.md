---
title: include file
description: include file
services: azure-communication-services
author: tophpalmer
manager: shahen
ms.author: chpalm
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 02/09/2023
ms.topic: include
ms.custom: include file
---


Event Grid provides out of the box support for Azure Functions, making it easy to set up an event listener without the need to deal with the complexity of parsing headers or debugging webhooks. Using  the out of the box trigger, we can set up an Azure Function that runs each time an event is detected that matches the trigger. In this document, we focus on SMS received triggers.

## Setting up our local environment

1. Using [Visual Studio Code](https://code.visualstudio.com/), install the [Azure Functions Extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions).
2. With the extension, create an Azure Function following these [instructions](../../../../azure-functions/create-first-function-vs-code-node.md).

   Configure the function with the following instructions:
   - Language: TypeScript
   - Template: Azure Event Grid Trigger
   - Function Name: User defined

    Once created, you see a function created in your directory like this:

    ```javascript
    
    import { AzureFunction, Context } from "@azure/functions"

    const eventGridTrigger: AzureFunction = async function (context: Context, eventGridEvent: any): Promise<void> {
        context.log(eventGridEvent);

    };
    
    export default eventGridTrigger;

    ```

## Configure Azure Function to receive SMS event

1. Configure Azure Function to parse values from the event like who sent it, to what number and what the message was.

     ```javascript
    
    import { AzureFunction, Context } from "@azure/functions"

    const eventGridTrigger: AzureFunction = async function (context: Context, eventGridEvent: any): Promise<void> {
        context.log(eventGridEvent);
        const to = eventGridEvent['data']['to'];
        const from = eventGridEvent['data']['from'];
        const message = eventGridEvent['data']['message'];

    };
    
    export default eventGridTrigger;

    ```

At this point, you have successfully handled receiving an SMS through events. Now the possibilities of what to do with that event range from just logging it to responding to it. In the next section, we focus on responding to that SMS we received. If you don't want to do respond to the SMS, skip to the next section on running the function locally.

## Responding to the SMS

1. To respond to the incoming SMS, we use the Azure Communication Service SMS capabilities for sending SMS. We start by invoking the `SmsClient` and initializing it with the `connection string` for our resource. You can either paste the connection string directly in the code or place it inside your local.settings.json file in your Azure Function directory under values. 

``` json

{
  "IsEncrypted": false,
  "Values": {
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "ACS_CONNECTION_STRING": "<<CONNECTION STRING>>"
  }
}

```

2. Then we compose an SMS to send based on the `to` and `from` values from the event we got.

    ```javascript
    import { AzureFunction, Context } from "@azure/functions"
    import { SmsClient } from "@azure/communication-sms";
    
    const connectionString = process.env.ACS_CONNECTION_STRING; //Replace with your connection string
    
    const eventGridTrigger: AzureFunction = async function (context: Context, eventGridEvent: any): Promise<void> {
        context.log(eventGridEvent);
        const to = eventGridEvent['data']['to'];
        const from = eventGridEvent['data']['from'];
        const message = eventGridEvent['data']['message'];
    
        const smsClient = new SmsClient(connectionString);
    
        const sendResults = await smsClient.send({
            from: to,
            to: [from],
            message: "Message received successfully. Will respond shortly."
        });
    
    };
    
    export default eventGridTrigger;
    ```

From here, the possibilities are endless. From responding to a message with a pre-canned answer, to adding a bot or simply storing responses, you can adapt the code in the last step to do that.

## Running locally

To run the function locally, press `F5` in Visual Studio Code. We use [ngrok](https://ngrok.com/) to hook our locally running Azure Function with Azure Event Grid.

1. Once the function is running, we configure ngrok. (You need to [download ngrok](https://ngrok.com/download) for your environment.)

   ```bash

    ngrok http 7071

    ```

    Copy the ngrok link provided where your function is running.

2. Configure SMS events through Event Grid within your Azure Communication Services resource. We do this using the [Azure CLI](/cli/azure/install-azure-cli). You need the resource ID for your Azure Communication Services resource found in the Azure portal. (The resource ID will look something like:  /subscriptions/`<<AZURE SUBSCRIPTION ID>>`/resourceGroups/`<<RESOURCE GROUP NAME>>`/providers/Microsoft.Communication/CommunicationServices/`<<RESOURCE NAME>>`)

    ```bash

    az eventgrid event-subscription create --name "<<EVENT_SUBSCRIPTION_NAME>>" --endpoint-type webhook --endpoint "<<NGROK URL>> " --source-resource-id "<<RESOURCE_ID>>"  --included-event-types Microsoft.Communication.SMSReceived 

    ```

3. Now that everything is hooked up, test the flow by sending an SMS to the phone number you've on your Azure Communication Services resource. You should see the console logs on your terminal where the function is running. If you added the code to respond to the SMS, you should see that text message delivered back to you.

## Deploy to Azure

To deploy the Azure Function to Azure, you need to follow these [instructions](../../../../azure-functions/create-first-function-vs-code-node.md#deploy-the-project-to-azure). Once deployed, we configure Event Grid for the Azure Communication Services resource. With the URL for the Azure Function that was deployed (URL found in the Azure portal under the function), we run the following command:

```bash

az eventgrid event-subscription update --name "<<EVENT_SUBSCRIPTION_NAME>>" --endpoint-type azurefunction --endpoint "<<AZ FUNCTION URL>> " --source-resource-id "<<RESOURCE_ID>>"

```

Since we are updating the event subscription we created for local testing, make sure to use the same event subscription name you used above.

You can test by sending an SMS to the phone number you have procured through Azure Communication Services resource.
