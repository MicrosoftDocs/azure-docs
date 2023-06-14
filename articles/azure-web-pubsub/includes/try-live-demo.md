---
author: vicancy
ms.author: lianwei
ms.service: azure-web-pubsub
ms.topic: include 
ms.date: 08/08/2021
---

## Get the client URL with a temp access token

Azure portal provides a simple client URL Generator to generate a temp URL for quick test/validation purpose. Let's use this tool to get a temp Client Access URL and connect to the instance.

- Go to Azure portal and find out the Azure Web PubSub instance.
- Go to the `Client URL Generator` in `Key` blade. 
- Set proper `Roles`: **Send To Groups** and **Join/Leave Groups**
- Generate and copy the `Client Access URL`. 

:::image type="content" source="../media/quickstart-live-demo/generate-client-url.png" alt-text="Screenshot of generating client URL.":::

## Try the instance with an online demo

With this live demo, you could join or leave a group and send messages to the group members easily:

> [!div class="nextstepaction"]
> [Open the demo](https://aka.ms/awps/quicktry)

> [!NOTE]
>  **Client Access URL** is a convenience tool provided in the portal to simplify your getting-started experience, you can also use this Client Access URL to do some quick connect test. To write your own application, we provide SDKs in 4 languages to help you generate the URL. 

- Try different groups to join and different groups to send messages to, and see what messages are received. For example:
    - Make two clients join the same group. You'll see that the message could broadcast to the group members. 
    - Make two clients join different groups. You'll see that the client can't receive message if it is not group member. 
- You can also try to uncheck `Roles` when generating the `Client Access URL` to see what will happen when join a group or send messages to a group. For example:
    - Uncheck the `Send to Groups` permission. You'll see that the client can't send messages to the group. 
    - Uncheck the `Join/Leave Groups` permission. You'll see that the client can't join a group. 
