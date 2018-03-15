---
title: Azure Quickstart - Process event streams using Azure CLI | Microsoft Docs
description: Quickly learn to process event streams using Azure CLI
services: event-hubs
documentationcenter: ''
author: sethmanheim
manager: timlt
editor: ''

ms.assetid: ''
ms.service: event-hubs
ms.devlang: na
ms.topic: quickstart
ms.custom: mvc
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/12/2018
ms.author: sethm

---

# Process event streams using Azure CLI

Azure Event Hubs is a highly scalable data streaming platform and ingestion service capable of receiving and processing millions of events per second. This quickstart shows how to send and receive events to and from an event hub, after using Azure CLI to create an Event Hubs namespace and an event hub within that namespace.

If you do not have an Azure subscription, create a [free account][] before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this tutorial requires that you are running the Azure CLI version 2.0.4 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli).

## Log on to Azure

Once CLI is installed, perform the following steps to install the Event Hubs CLI extension, and to log on to Azure:

1. Issue the following command to install the Event Hubs CLI extension:

   ```azurecli-interactive
   az extension add --name eventhubs
   ```

2. Run the following command to log on to Azure:

   ```azurecli-interactive
   az login
   ```
   This command displays the following text:

   ```Output
   To sign in, use a web browser to open the page https://aka.ms/devicelogin and enter the code ######## to authenticate.
   ```

3. Open the https://aka.ms/devicelogin link in the browser and enter the code to authenticate your Azure login.

4. Set the current subscription context:

   ```azurecli
   az account set --subscription <Azure_subscription_name>
   ``` 

## Provision resources

After logging in to Azure, issue the following commands to provision Event Hubs resources. Be sure to replace all placeholders with the appropriate values:

```azurecli
# Create a resource group
az group create --name eventhubsResourceGroup --location eastus

# Create an Event Hubs namespace
az eventhubs namespace create --name <namespace_name> --resource-group <my_resourceGroup> -l eastus2

# Create an event hub
az eventhubs eventhub create --name <event_hub_name> --resource-group <my_resourceGroup> --namespace-name <namespace_name>

# Create a general purpose standard storage account
az storage account create --name <storage_account_name> --resource-group <my_resourceGroup> --location eastus2 --sku Standard_RAGRS --encryption blob

# List the storage account access keys
az storage account keys list --resource-group <my_resourceGroup> --account-name <storage_account_name>

# Get namespace connection string
az eventhubs namespace authorizationrule keys list --resource-group <my_resourceGroup> --namespace-name <namespace_name> --name RootManageSharedAccessKey
```

Copy and paste the connection string to a temporary location, such as Notepad, to use later.

## Download and run the samples

The next step is to download the sample code that sends events to an event hub, and receives those events using the Event Processor Host. 

1. Clone the [Event Hubs GitHub repo](https://github.com/Azure/azure-event-hubs).
2. Navigate to the [Send sample folder](https://github.com/Azure/azure-event-hubs/blob/master/samples/Java/Basic/Send).
2. In the Send.java file, replace the `----EventHubsNamespaceName-----` value with the Event Hubs namespace you obtained in the "Create an Event Hubs namespace" section of this article.
2. Replace `----EventHubName-----` with the name of the event hub you created within that namespace.
3. Replace `-----SharedAccessSignatureKeyName-----` with the name of the Primary Key value you obtained previously. Unless you created a new policy, the default is **RootManageSharedAccessKey**.
4. Replace `---SharedAccessSignatureKey----` with the value of the SAS key in the previous step.
5. Issue the following command to build the application:

   ```shell
   mvn clean package -DskipTests
   ```
6. To run the program, issue the following command:
   
   ```shell
   java -jar ./target/send-1.0.0-jar-with-dependencies.jar
   ```   

### Receive

1. In the ReceiveByDateTime.java file, replace the `----EventHubsNamespaceName-----` value with the Event Hubs namespace you obtained in the "Create an Event Hubs namespace" section of this article. 
2. Replace `----EventHubName-----` with the name of the event hub you created within that namespace.
3. Replace `-----SharedAccessSignatureKeyName-----` with the name of the Primary Key value you obtained previously. Unless you created a new policy, the default is **RootManageSharedAccessKey**.
4. Replace `---SharedAccessSignatureKey----` with the value of the SAS key in the previous step.

### Run the apps

First, run the **Send** application and observe an event being sent. Then, run the **ReceiveByDateTime** app, and observe the event being received into the Event Processor Host.

## Clean up deployment

Run the following command to remove the resource group, namespace, storage account, and all related resources:

```azurecli-interactive
az group delete --name <my_resourceGroup>
```

## Next steps

In this article, you created the Event Hubs namespace and other resources required to send and receive events from your event hub. To learn more, continue with the following articles.

* [Send events to your event hub](https://github.com/Azure/azure-event-hubs/tree/master/samples/Java)
* [Receive events from your event hub](https://github.com/Azure/azure-event-hubs/tree/master/samples/Java)

[1]: ./media/event-hubs-quickstart-namespace-cli/cli1.png
[2]: ./media/event-hubs-quickstart-namespace-cli/cli2.png

[free account]: https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio
[Install Azure CLI 2.0]: /cli/azure/install-azure-cli
[az group create]: /cli/azure/group#az_group_create
[fully qualified domain name]: https://wikipedia.org/wiki/Fully_qualified_domain_name
