---
title: include file
description: include file
author: anthonychu
ms.service: signalr
ms.topic: include
ms.date: 03/04/2019
ms.author: antchu
ms.custom: include file
---
## Run the web application

1. To simplify your client testing, open your browser to our sample single page web application [https://azure-samples.github.io/signalr-service-quickstart-serverless-chat/demo/chat-v2/](https://azure-samples.github.io/signalr-service-quickstart-serverless-chat/demo/chat-v2/). 

    > [!NOTE]
    > The source of the HTML file is located at [/docs/demo/chat-v2/index.html](https://github.com/Azure-Samples/signalr-service-quickstart-serverless-chat/blob/master/docs/demo/chat-v2/index.html). And if you'd like to host the HTML yourself, please start a local HTTP server such as [http-server](https://www.npmjs.com/package/http-server) in the */docs/demo/chat-v2* directory. Ensure the origin is added to the `CORS` setting in *local.settings.json* similar to the sample.
    > 
    > ```javascript
    > "Host": {
    >  "LocalHttpPort": 7071,
    >  "CORS": "http://localhost:8080,https://azure-samples.github.io",
    >  "CORSCredentials": true
    > }
    >
    > ```

1. When prompted for the function app base URL, enter `http://localhost:7071`.

1. Enter a username when prompted.

1. The web application calls the *GetSignalRInfo* function in the function app to retrieve the connection information to connect to Azure SignalR Service. When the connection is complete, the chat message input box appears.

1. Type a message and press enter. The application sends the message to the *SendMessage* function in the Azure Function app, which then uses the SignalR output binding to broadcast the message to all connected clients. If everything is working correctly, the message should appear in the application.

    ![Run the application](../media/signalr-quickstart-azure-functions-csharp/signalr-quickstart-run-application.png)

1. Open another instance of the web application in a different browser window. You will see that any messages sent will appear in all instances of the application.
