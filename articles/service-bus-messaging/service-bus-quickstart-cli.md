---
title: Azure Quickstart - use Azure CLI and Java to send and receive messages from Azure Service Bus | Microsoft Docs
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
ms.date: 03/26/2018
ms.author: sethm

---

# Send and receive using Azure CLI and Java

Microsoft Azure Service Bus is an enterprise integration message broker that provides secure messaging and absolute reliability. A typical Service Bus scenario usually involves decoupling two or more applications, services or processes from each other, and transferring state or data changes. Such scenarios might involve scheduling multiple batch jobs in another application or services, or triggering order fulfillment. For example, a retail company might send their point of sales data to a back office or regional distribution center for replenishment and inventory updates. In this scenario, the workflow sends to and receives messages from a Service Bus queue.  

![queue](./media/service-bus-quickstart-cli/quick-start-queue.png)

This quickstart describes how to send and receive messages with Service Bus, using Azure CLI to create a messaging namespace and a queue within that namespace, and obtain the authorization credentials on that namespace. The procedure then shows how to send and receive messages using the Java library.

If you don't have an Azure subscription, you can create a [free account][] before you begin.

## Prerequisites

To develop a Service Bus app with Java, you must have the following installed:

-  [Java Development Kit](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html), latest version.
-  [Azure CLI](https://docs.microsoft.com/cli/azure)
-  [Apache Maven](https://maven.apache.org), version 3.0 or above.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this tutorial requires that you are running the Azure CLI version 2.0.4 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli).

## Log in to Azure

Once CLI is installed, open Cloud Shell and issue the following commands to log in to Azure: 

1. Run the following command to log in to Azure:

   ```azurecli-interactive
   az login
   ```

2. Set the current subscription context to the Azure subscription you want to use:

   ```azurecli
   az account set --subscription Azure_subscription_name
   ``` 

## Use CLI to provision resources

After logging in to Azure, issue the following commands to provision Service Bus resources. Be sure to replace all placeholders with the appropriate values:

```azurecli
# Create a resource group
az group create --name my-resourcegroup --location eastus

# Create a Messaging namespace
az servicebus namespace create --name namespace-name --resource-group my-resourcegroup -l eastus2

# Create a queue
az servicebus queue create --resource-group my-resourcegroup --namespace-name namespace_name --name queue-name

# Get the connection string
az servicebus namespace authorization-rule keys list --resource-group my-resourcegroup --namespace-name namespace-name --name RootManageSharedAccessKey
```

After the last command runs, copy and paste the connection string, and the queue name you selected, to a temporary location such as Notepad. You will need it in the next step.

## Send and receive messages

After the namespace and queue are provisioned, and you have the necessary credentials, you are ready to send and receive messages. You can examine the code in [this GitHub sample folder](https://github.com/Azure/azure-service-bus/tree/master/samples/Java/quickstarts-and-tutorials/quickstart-java/src/main/java/samples/quickstart).

1. Clone the [Service Bus GitHub repository](https://github.com/Azure/azure-service-bus/).
2. From a command prompt, navigate to the sample folder `\azure-service-bus\samples\Java\quickstarts-and-tutorials\quickstart-java`.
3. Issue the following command to build the application:
   
   ```shell
   mvn clean package -DskipTests
   ```

4. To run the program, issue the following command. Make sure to replace the placeholders with the connection string and queue name you obtained in the previous step:

   ```shell
   java -jar .\target\samples.quickstart-1.0.0-jar-with-dependencies.jar -c "myConnectionString” -q "queue-name"
   ```

Observe 10 messages being sent to the queue, and subsequently received from the queue:

![program output](./media/service-bus-quickstart-cli/javaqs.png)

## Clean up deployment

Run the following command to remove the resource group, namespace, and all related resources:

```azurecli
az group delete --resource-group my-resourcegroup
```

## Next steps

In this article, you created a Service Bus namespace and other resources required to send and receive messages from a queue. To learn more about sending and receiving messages, continue with the following articles:

* [Service Bus messaging overview](service-bus-messaging-overview.md)
* [How to use Service Bus topics and subscriptions](service-bus-dotnet-how-to-use-topics-subscriptions.md)

[free account]: https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio
[fully qualified domain name]: https://wikipedia.org/wiki/Fully_qualified_domain_name
[Install Azure CLI 2.0]: /cli/azure/install-azure-cli
[az group create]: /cli/azure/group#az_group_create