---
title: Create, view, and manage Azure Event Grid system topics using CLI
description: This article shows how to use Azure CLI to create, view, and delete system topics. 
ms.topic: conceptual
ms.date: 07/07/2020
---

# Create, view, and manage Event Grid system topics using Azure CLI
This article shows you how to create and manage system topics using Azure CLI. For an overview of system topics, see [System topics](system-topics.md).

## Install extension for Azure CLI
For Azure CLI, you need the [Event Grid extension](/cli/azure/azure-cli-extensions-list).

In Cloud Shell:

- If you've installed the extension previously, update it: `az extension update -n eventgrid`
- If you haven't installed the extension previously, install it:  `az extension add -n eventgrid`

For a local installation:

1. [Install the Azure CLI](/cli/azure/install-azure-cli). Make sure that you have the latest version, by checking with `az --version`.
2. Uninstall previous versions of the extension: `az extension remove -n eventgrid`
3. Install the eventgrid extension with `az extension add -n eventgrid`

## Create a system topic

- To create a system topic on an Azure source first and then create an event subscription for that topic, see the following reference topics:
    - [az eventgrid system-topic create](/cli/azure/eventgrid/system-topic#az_eventgrid_system_topic_create)

        ```azurecli-interactive
        # Get the ID of the Azure source (for example: Azure Storage account)
        storageid=$(az storage account show \
                --name <AZURE STORAGE ACCOUNT NAME> \
                --resource-group <AZURE RESOURCE GROUP NAME> \
                    --query id --output tsv)
    
        # Create the system topic on the Azure source (example: Azure Storage account)
        az eventgrid system-topic create \
            -g <AZURE RESOURCE GROUP NAME> \
            --name <SPECIFY SYSTEM TOPIC NAME> \
            --location <LOCATION> \
            --topic-type microsoft.storage.storageaccounts \
            --source $storageid
        ```           

        For a list of `topic-type` values that you can use to create a system topic, run the following command. These topic type values represent the event sources that support creation of system topics. Please ignore `Microsoft.EventGrid.Topics` and `Microsoft.EventGrid.Domains` from the list. 

        ```azurecli-interactive
        az eventgrid topic-type  list --output json | grep -w id
        ```
    - [az eventgrid system-topic event-subscription create](/cli/azure/eventgrid/system-topic/event-subscription#az_eventgrid_system_topic_event-subscription-create)

        ```azurecli-interactive
        az eventgrid system-topic event-subscription create --name <SPECIFY EVENT SUBSCRIPTION NAME> \
            -g rg1 --system-topic-name <SYSTEM TOPIC NAME> \
            --endpoint <ENDPOINT URL>		  
        ```
- To create a system topic (implicitly) when creating an event subscription for an Azure source, use the [az eventgrid event-subscription create](/cli/azure/eventgrid/event-subscription#az_eventgrid_event_subscription_create) method. Here's an example:
    
    ```azurecli-interactive
    storageid=$(az storage account show --name <AZURE STORAGE ACCOUNT NAME> --resource-group <AZURE RESOURCE GROUP NAME> --query id --output tsv)
    endpoint=<ENDPOINT URL>

    az eventgrid event-subscription create \
      --source-resource-id $storageid \
      --name <EVENT SUBSCRIPTION NAME> \
      --endpoint $endpoint
    ```
    For a tutorial with step-by-step instructions, see [Subscribe to storage account](../storage/blobs/storage-blob-event-quickstart.md?toc=%2Fazure%2Fevent-grid%2Ftoc.json#subscribe-to-your-storage-account).

## View all system topics
To view all system topics and details of a selected system topic, use the following commands:

- [az eventgrid system-topic list](/cli/azure/eventgrid/system-topic#az_eventgrid_system_topic_list)

    ```azurecli-interactive
    az eventgrid system-topic list	 
	 ```
- [az eventgrid system-topic show](/cli/azure/eventgrid/system-topic#az_eventgrid_system_topic_show)

    ```azurecli-interactive
    az eventgrid system-topic show -g <AZURE RESOURCE GROUP NAME> -n <SYSTEM TOPIC NAME>	 
	 ```

## Delete a system topic
To delete a system topic, use the following command: 

- [az eventgrid system-topic delete](/cli/azure/eventgrid/system-topic#az_eventgrid_system_topic_delete)

    ```azurecli-interactive
    az eventgrid system-topic delete -g <AZURE RESOURCE GROUP NAME> --name <SYSTEM TOPIC NAME>	 
	 ```

## Next steps
See the [System topics in Azure Event Grid](system-topics.md) section to learn more about system topics and topic types supported by Azure Event Grid. 