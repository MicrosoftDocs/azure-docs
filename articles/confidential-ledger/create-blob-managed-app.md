---
title: Create a Managed Application to Store Blob Digests
description: Learn to create a managed application that will store blob digests to Azure Confidential Ledger
author: pallabpaul
ms.author: pallabpaul
ms.date: 10/26/2023
ms.service: confidential-ledger
ms.topic: overview
---

# Create a Managed Application to Store Blob Digests

## Prerequisites

- An Azure Storage Account
- [Azure CLI](/cli/azure/install-azure-cli)
- Python versions that are [supported by the Azure SDK for Python](https://github.com/Azure/azure-sdk-for-python#prerequisites).

## Deploying the Managed Application

Please deploy the Managed Application found here named [BlobStorageACLFin](https://ms.portal.azure.com/#@microsoft.onmicrosoft.com/resource/subscriptions/027da7f8-2fc6-46d4-9be9-560706b60fec/resourceGroups/ppaul-rg/providers/Microsoft.Solutions/applicationDefinitions/BlobStorageACLFin/overview).

### Resources to be created

- Confidential Ledger
- Service Bus Queue with sessions enabled
- Storage Account (Publisher owned storage account used to store digest logic and audit history)
- Function App
- Application Insights

## Connecting a Storage Account to the Managed Application

Once a Managed Application is created, you will then be able to connect the Managed Application to your Storage Account to start processing and recording Blob Container digests to Azure Confidential Ledger.

### Create a Topic for the Storage Account

```bash
az eventgrid system-topic create \
--resource-group {resource_group} \
--name {sample_topic_name} \
--location {location} \
--topic-type microsoft.storage.storageaccounts \
--source /subscriptions/{subscription}/resourceGroups/{resource_group}/providers/Microsoft.Storage/storageAccounts/{storage_account_name}
```

`resource-group` - Resource Group of where Topic should be created
`name` - Name of Topic to be created
`location` - Location of Topic to be created
`source` - Resource ID of storage account to create Topic for

### Subscribe to Storage Account Topic

```bash
az eventgrid system-topic event-subscription create \
--name {sample_subscription_name} \
--system-topic-name {sample_topic_name} \
--resource-group {resource_group} \
--event-delivery-schema EventGridSchema \
--included-event-types Microsoft.Storage.BlobCreated \
--delivery-attribute-mapping sessionId static {sample_session_id} false \
--endpoint-type servicebusqueue \
--endpoint /subscriptions/{subscription}/resourceGroups/{managed_resource_group}/providers/Microsoft.ServiceBus/namespaces/{service_bus_namespace}/queues/{service_bus_queue}
```

`name` - Name of Subscription to be created
`system-topic-name` - Name of Topic the Subscription is being created for (Should be same as newly created topic)
`resource-group` - Resource Group of where Subscription should be created
`delivery-attribute-mapping` - Mapping for required sessionId field. Please enter a unique sessionId
`endpoint` - Resource ID of the service bus queue that is subscribing to the storag account Topic

### Add Required Role to Storage Account

```bash
az role assignment create \
--role "Storage Blob Data Owner" \
--assignee-object-id {function_oid} \
--assignee-principal-type ServicePrincipal\
--scope /subscriptions/{subscription}/resourceGroups/{resource_group}/providers/Microsoft.Storage/storageAccounts/{storage_account_name}
```

`assignee-object-id` - OID of the Azure Function created with the Managed Application. Can be found under the 'Identity' blade
`scope` - Resource ID of storage account to create the role for

## Performing an Audit

### Trigger Audit through Portal

*Option to trigger an audit will be made available through the ACL UI*

### Trigger Audit through SDK

A trigger can be triggered by including the following message to the Service Bus Queue associated with your Managed Application:

```json
message = {
    "eventType": "PerformAudit",
    "storageAccount": "STORAGE_ACCOUNT_NAME",
    "blobContainer": "BLOB_CONTAINER_NAME"
}
```

Below is a sample of how to send this message using the Python SDK. This can also be added via Portal, HTTP Request or other SDKs.


```python
import json
import uuid
from azure.servicebus import ServiceBusClient, ServiceBusMessage

SERVICE_BUS_CONNECTION_STR = ""
SESSION_QUEUE_NAME = ""
STORAGE_ACCOUNT_NAME = ""
BLOB_CONTAINER_NAME = ""
SESSION_ID = str(uuid.uuid4())

servicebus_client = ServiceBusClient.from_connection_string(conn_str=SERVICE_BUS_CONNECTION_STR, logging_enable=True)
sender = servicebus_client.get_queue_sender(queue_name=SESSION_QUEUE_NAME)

message = {
    "eventType": "PerformAudit",
    "storageAccount": STORAGE_ACCOUNT_NAME,
    "blobContainer": BLOB_CONTAINER_NAME
}

message = ServiceBusMessage(json.dumps(message), session_id=SESSION_ID)
sender.send_messages(message)
```

## Clean Up Resources

## Next steps

- [Overview of Microsoft Azure confidential ledger](overview.md)