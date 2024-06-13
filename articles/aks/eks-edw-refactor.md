---
title: Update application code for the event-driven workflow (EDW) workload
description: Learn what needs to be updated to replicate the AWS EKS event-driven workflow (EDW) workload in Azure.
ms.topic: how-to
ms.date: 05/22/2024
author: JnHs
ms.author: jenhayes
---

# Update application code for the event-driven workflow (EDW) workload

To replicate the EDW workload in Azure, your code uses Azure SDKs to work with Azure services. This article outlines some key aspects, including example code to support the workflow in Azure.

## Data access code

The AWS workload relies on AWS services and their associated data access AWS SDKs. You have already [mapped AWS services to equivalent Azure services](eks-edw-rearchitect.md#map-aws-services-to-azure-services). Now you need to create the code that accesses data for the producer queue and the consumer results database table in Python, using Azure SDKs.

For the data plane, the producer message body (payload) is JSON, and it doesn't need any schema changes for Azure. However, the consumer saves results in a database, and the table schema for DynamoDB is incompatible with an equivalent table definition in Azure Table storage. The DynamoDB table schema will need to be remapped to an Azure Table storage table schema. The data access layer code also requires changes. Finally, you need to change the authentication logic for the Azure Storage Queue and the Azure Table storage results table.

## Authentication code changes for service-to-service

### AWS service-to-service authentication implementation

The AWS workload uses a resource-based policy that defines full access to an Amazon Simple Queue Service (SQS) resource:

```json
{
  "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "sqs:*",
            "Resource": "*"
        }
    ]
}
```

The AWS workload uses a resource-based policy that defines full access to a DynamoDB resource:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
        "Effect": "Allow",
        "Action": "dynamodb:*",
        "Resource": "*"
    }
  ]
}
```

In the AWS workload deployment, both these policies are assigned via the AWS CLI in a manner similar to the following:

```bash
aws iam create-policy --policy-name sqs-sample-policy --policy-document <filepath/filename>.json
aws iam create-policy --policy-name dynamodb-sample-policy --policy-document <filepath/filename>.json
aws iam create-role --role-name keda-sample-iam-role  --assume-role-policy-document <filepath/filename>.json

aws iam attach-role-policy --role-name keda-sample-iam-role --policy-arn=arn:aws:iam::${<AWSAccountID>}:policy/sqs-sample-policy
aws iam attach-role-policy --role-name keda-sample-iam-role --policy-arn=arn:aws:iam::${<AWSAccountID>}:policy/dynamodb-sample-policy

# Set up trust relationship Kubernetes federated identity credential and map IAM role via kubectl annotate serviceaccount
```

### Azure service-to-service authentication implementation

Next, we’ll explore how to perform similar AWS service-to-service logic within the Azure environment using AKS. To control data plane access to the Azure Storage Queue and the Azure Table storage table, two Azure RBAC role definitions will be applied. These roles are like the resource-based policies that AWS uses to control access to SQS and DynamoDB. However, Azure RBAC roles aren'tf bundled with the resource, but rather assigned to a service principal associated with a given resource. The user-assigned managed identity linked to the workload identity in an Azure Kubernetes Service (AKS) pod will have these roles assigned to it. The Azure Python SDKs for Azure Storage Queue and Azure Table storage automatically use the context of the security principal to access data in both resources.

The [**Storage Queue Data Contributor** role definition](/azure/role-based-access-control/built-in-roles/storage) permits the role assignee to read, write, or delete against the Azure Storage Queue.

The [**Storage Table Data Contributor** role definition](/azure/role-based-access-control/built-in-roles/storage) permits the assignee to read, write, or delete data against an Azure storage table.

The following steps show how to create a managed identity and assign the **Storage Queue Data Contributor** and **Storage Table Data Contributor** roles using the Azure CLI:

1. Create a managed identity:

   ```azurecli
   managedIdentity=$(az identity create /
   –name <display-name-of-the-managed-identity> /
   –resource-group <name-of-the-resource-group-containing-the-identity>)
   ```

   For convenience, save the JSON object produced by the `az identity create` command in a shell variable for later use.

1. Assign the **Storage Queue Data Contributor** role to the managed identity:

   ```azurecli
   principalId=$(echo $managedIdentity | jq -r `.principalId`)
   az role assignment create \
   --assignee-object-id $principalId \
   --assignee-principal-type ServicePrincipal \
   --role "Storage Queue Data Contributor" \
   --scope <resource-id-to-scope-access-down-to>
   ```

1. Assign the **Storage Table Data Contributor** role to the managed identity:

   ```azurecli
   az role assignment create \
    --assignee-object-id $principalId \
    --assignee-principal-type ServicePrincipal \
    --role "Storage Queue Data Contributor" \
    --scope <resource-id-to-scope-access-down-to>```
   ```dotnetcli

To see a working example, refer to the `deploy.sh` script in our [GitHub repository](https://github.com/Azure-Samples/aks-event-driven-replicate-from-aws).

## Producer code changes

In the original AWS code for storage queue access, the AWS boto3 library is used to interact with AWS SQS queues. For Azure, the code uses the [Azure SDK for Python](https://github.com/Azure/azure-sdk-for-python) to interact with Azure Storage Queue services.

### AWS producer code implementation

In the AWS workload, Python code similar to the following example is used to connect to SQS using the AWS IAM `AssumeRole` capability to authenticate to the SQS endpoint using the IAM Identity associated with the EKS pod hosting the application.

```python
import boto3
# other imports removed for brevity
sqs_queue_url = "https://<region>.amazonaws.com/<queueid>/source-queue.fifo"
sqs_queue_client = boto3.client("sqs", region_name="<region>")    
response = sqs_client.send_message(
    QueueUrl = sqs_queue_url,
    MessageBody = 'messageBody1',
    MessageGroupId='messageGroup1')
```

#### Azure producer code implementation

In Azure, an equivalent means of making connections to Azure Storage Queue is to use 'passwordless' OAuth authentication. The [DefaultAzureCredential](/azure/storage/queues/storage-quickstart-queues-python?tabs=passwordless%2Croles-azure-portal%2Cenvironment-variable-windows%2Csign-in-azure-cli#authorize-access-and-create-a-client-object) Python class is workload identity aware and transparently uses the managed identity associated with workload identity to authenticate to the storage queue.

The following example shows how to authenticate to an Azure Storage Queue using the `DefaultAzureCredential` class instead of secrets such as a connection string:

```python
from azure.identity import DefaultAzureCredential
from azure.storage.queue import QueueClient
# other imports removed for brevity

# authenticate to the storage queue.
account_url = "https://<storageaccountname>.queue.core.windows.net"
default_credential = DefaultAzureCredential()
aqs_queue_client = QueueClient(account_url, queue_name=queue_name ,credential=default_credential)

aqs_queue_client.create_queue()
aqs_queue_client.send_message('messageBody1')
```

The code for the queue producer (`aqs-producer.py`) can be found in our [GitHub repository](https://github.com/Azure-Samples/aks-event-driven-replicate-from-aws).

## Consumer code changes

In the original AWS code for DynamoDB access, the AWS boto3 library is used to interact with AWS SQS queues. You will refactor the application code to use the Azure SDK for Python to interact with CosmosDB services.

### AWS consumer code implementation

The consumer part of the workload uses the same code as the producer for connecting to the AWS SQS queue to read messages. In addition, the consumer contains Python code similar to the following in order to connect to DynamoDB. This connection is made using the AWS IAM `AssumeRole` capability to authenticate to the DynamoDB endpoint, using the IAM identity associated with the EKS pod hosting the application.

```python
# presumes policy deployment ahead of time such as: aws iam create-policy --policy-name <policy_name> --policy-document <policy_document.json>
dynamodb = boto3.resource('dynamodb', region_name='<region>')
table = dynamodb.Table('<dynamodb_table_name>')
table.put_item(
    Item = {
    'id':'<guid>',
    'data':jsonMessage["<message_data>"],
    'srcStamp':jsonMessage["<source_timestamp_from_message>"],
    'destStamp':'<current_timestamp_now>',
    'messageProcessingTime':'<duration>')
}
```

#### Azure consumer code implementation

Now you need the producer code to authenticate to Azure Cosmos DB. As discussed earlier, the schema used in the preceding section with DynamoDB is incompatible with Azure Cosmos DB. You'll also use a table schema that is compatible with Azure Cosmos DB, which stores the same data as the AWS workload does in DynamoDB.

This example shows the code required for Azure:

```python
from azure.storage.queue import QueueClient
from azure.data.tables import (TableServiceClient)

table = TableServiceClient(connection_string=cosmos_conn_string)

entity={
    'PartitionKey': _id,
    'RowKey': str(messageProcessingTime.total_seconds()),
    'data': jsonMessage['msg'],
    'srcStamp': jsonMessage['srcStamp'],
    'dateStamp': current_dateTime}
        
response = table.insert_entity(
    table_name=cosmosdb_table,
    entity=entity,
    timeout=60)
```

Notice that unlike DynamoDB, the Azure Cosmos DB code specifies both `PartitionKey` and `RowKey`. The `PartitionKey` is similar to the 'id' `uniqueidentifer` in DynamoDB. A `PartitionKey` is a `uniqueidentifier` for a partition in a logical container in Azure Cosmos DB while the `RowKey` is a `uniqueidentifier` for all the rows in a given partition. In the case of the AWS workload, each partition will contain at most one row, which doesn't necessitate the use of a `RowKey`.

Completed versions of both the producer and consumer code can be found in our [GitHub repository](https://github.com/Azure-Samples/aks-event-driven-replicate-from-aws).

## Create container images and push to Azure Container Registry

Next, build the container images and push them to [Azure Container Registry (ACR)](/azure/container-registry/container-registry-intro).

In the `app` directory of the cloned repository, a shell script called `docker-command.sh` builds the container images and pushes them to ACR. Open the `.sh` file and review the code. The script builds the producer and consumer container images and pushes them to ACR. For more information, see [Introduction to container registries in Azure](/azure/container-registry/container-registry-intro) and learn how to [push and pull images](/azure/container-registry/container-registry-get-started-docker-cli) from ACR.

To build the container images and push them to ACR, make sure the environment variable `AZURE_CONTAINER_REGISTRY` is set to the name of the registry you want to push the images to, then run the following command:

```bash
./app/docker-command.sh
```

## Next steps

- Now that your code is ready, [prepare to deploy the EDW workload to Azure](eks-edw-prepare.md).
