---
title: Azure Quickstart - use Azure CLI to send and receive messages from Azure Service Bus | Microsoft Docs
description: Quickly learn to send and receive Service Bus messages
services: service-bus-messaging
documentationcenter: ''
author: sethmanheim
manager: timlt
editor: ''

ms.assetid: ''
ms.service: service-bus-messaging
ms.devlang: na
ms.topic: quickstart
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/05/2018
ms.author: sethm

---

# Send and receive messages using Azure CLI and Java

Microsoft Azure Service Bus is an enterprise integration message broker that provides secure messaging and absolute reliability. A typical Service Bus scenario usually involves decoupling two or more applications, services or processes from each other, and transferring state or data changes. Such scenarios might involve scheduling multiple batch jobs in another application or services, or triggering order fulfillment. For example, a retail company might send their point of sales data to a back office or regional distribution center for replenishment and inventory updates. In this scenario, the workflow sends to and receives messages from a Service Bus queue.  

![queue](./media/service-bus-quickstart-cli/quick-start-queue.png)

This quickstart describes how to send and receive messages with Service Bus, using Azure CLI to create a messaging namespace and a queue within that namespace, and obtain the authorization credentials on that namespace.

If you do not have an Azure subscription, create a [free account][] before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this tutorial requires that you are running the Azure CLI version 2.0.4 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli).

## Use CLI to log in to Azure

1. Once CLI is installed, open a command prompt and issue the following commands to log in to Azure:

   ```azurecli-interactive
   az extension add --name servicebus
   ```

2. Run the following command to log in to Azure:

   ```azurecli-interactive
   az login
   ```
   This command displays the following text:

   ```Output
   To sign in, use a web browser to open the page https://aka.ms/devicelogin and enter the code ######## to authenticate.
   ```

3. Open the https://aka.ms/devicelogin link in the browser and enter the code to authenticate your Azure login. 

## Use CLI to provision resources

After logging in to Azure, issue the following commands to provision Service Bus resources. Be sure to replace all placeholders with the appropriate values:

```azurecli
# Create a resource group
az group create --name serviceBusResourceGroup --location eastus

# Create a Messaging namespace
az servicebus namespace create --name <namespace_name> -location eastus

# Create a queue
az servicebus entity create --name <queue_name> -location eastus

# Get the connection string
az servicebus TBD
```

Copy and paste the **PrimaryConnectionString** value to a temporary location, such as Notepad, to use later.

## Send and receive messages TBD: change to Java

After the namespace and queue are provisioned, and you have the necessary credentials, you are ready to send and receive messages.

1. Navigate to [this GitHub sample folder](https://github.com/Azure/azure-service-bus/tree/master/samples/DotNet/GettingStarted/Microsoft.Azure.ServiceBus/BasicSendReceiveUsingQueueClient), and load the **BasicSendReceiveUsingQueueClient.csproj** file into Visual Studio.
2. Double-click **Program.cs** to open it in the Visual Studio editor.
3. Replace the value of the `ServiceBusConnectionString` constant with the full connection string you obtained in the [previous section](#get-the-connection-string).
4. Replace the value of `QueueName` with the name of the queue you [created previously](#create-a-queue).
5. Build and run the program, and observe 10 messages being sent to the queue, and received in parallel from the queue.

## Clean up deployment

Run the following command to remove the resource group, namespace, and all related resources:

```azurecli-interactive
az group delete --name serviceBusResourceGroup
```

## Next steps

In this article, you created a Service Bus namespace and other resources required to send and receive messages from a queue. To learn more about sending and receiving messages, continue with the following articles:

* [Service Bus messaging overview](service-bus-messaging-overview.md)
* [How to use Service Bus topics and subscriptions](service-bus-dotnet-how-to-use-topics-subscriptions.md)

[free account]: https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio
[fully qualified domain name]: https://wikipedia.org/wiki/Fully_qualified_domain_name

[1]: ./media/service-bus-quickstart-cli/cli1.png
[2]: ./media/service-bus-quickstart-cli/cli2.png
[service-bus-flow]: ./media/service-bus-quickstart-cli/service-bus-flow.png
[Install Azure CLI 2.0]: /cli/azure/install-azure-cli
[az group create]: /cli/azure/group#az_group_create