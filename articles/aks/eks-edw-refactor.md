---
title: Update application code for the event-driven workflow (EDW) workload
description: Learn how to update the application code of the AWS EKS event-driven workflow (EDW) workload to replicate it in AKS.
ms.topic: how-to
ms.date: 05/22/2024
author: JnHs
ms.author: jenhayes
---

# Update application code for the event-driven workflow (EDW) workload

This article outlines key application code updates to replicate the EDW workload in Azure using Azure SDKs to work with Azure services.

## Data access code

### AWS implementation

The AWS workload relies on AWS services and their associated data access AWS SDKs. We already [mapped AWS services to equivalent Azure services][map-aws-to-azure], so we can now create the code to access data for the producer queue and consumer results database table in Python using Azure SDKs.

### Azure implementation

For the data plane, the producer message body (payload) is JSON, and it doesn't need any schema changes for Azure. The original consumer app saves the processed messages in a DynamoDB table. With minor modifications to the consumer app code, we can store the processed messages in an Azure Storage Table.

## Authentication code

### AWS implementation

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

In the AWS workload, you assign these policies using the AWS CLI:

```bash
aws iam create-policy --policy-name sqs-sample-policy --policy-document <filepath/filename>.json
aws iam create-policy --policy-name dynamodb-sample-policy --policy-document <filepath/filename>.json
aws iam create-role --role-name keda-sample-iam-role  --assume-role-policy-document <filepath/filename>.json

aws iam attach-role-policy --role-name keda-sample-iam-role --policy-arn=arn:aws:iam::${<AWSAccountID>}:policy/sqs-sample-policy
aws iam attach-role-policy --role-name keda-sample-iam-role --policy-arn=arn:aws:iam::${<AWSAccountID>}:policy/dynamodb-sample-policy

# Set up trust relationship Kubernetes federated identity credential and map IAM role via kubectl annotate serviceaccount
```

### Azure implementation

Let's explore how to perform similar AWS service-to-service logic within the Azure environment using AKS.

You apply two Azure RBAC role definitions to control data plane access to the Azure Storage Queue and the Azure Storage Table. These roles are like the resource-based policies that AWS uses to control access to SQS and DynamoDB. Azure RBAC roles aren't bundled with the resource. Instead, you assign the roles to a service principal associated with a given resource.

In the Azure implementation of the EDW workload, you assign the roles to a user-assigned managed identity linked to a workload identity in an AKS pod. The Azure Python SDKs for the Azure Storage Queue and Azure Storage Table automatically use the context of the security principal to access data in both resources.

You use the [**Storage Queue Data Contributor**][storage-queue-data-contributor] role to allow the role assignee to read, write, or delete against the Azure Storage Queue, and the [**Storage Table Data Contributor**][storage-table-data-contributor] role to permit the assignee to read, write, or delete data against an Azure Storage Table.

The following steps show how to create a managed identity and assign the **Storage Queue Data Contributor** and **Storage Table Data Contributor** roles using the Azure CLI:

1. Create a managed identity using the [`az identity create`][az-identity-create] command.

    ```azurecli-interactive
    managedIdentity=$(az identity create \
        --resource-group $resourceGroup \
        --name $managedIdentityName
    ```

   For convenience, save the JSON object produced by the `az identity create` command in a shell variable for later use.

1. Assign the **Storage Queue Data Contributor** role to the managed identity using the [`az role assignment create`][az-role-assigment-create] command.

    ```azurecli-interactive
    principalId=$(echo $managedIdentity | jq -r `.principalId`)

    az role assignment create \
        --assignee-object-id $principalId \
        --assignee-principal-type ServicePrincipal
        --role "Storage Queue Data Contributor" \
        --scope $resourceId
    ```

1. Assign the **Storage Table Data Contributor** role to the managed identity using the [`az role assignment create`][az-role-assignment-create] command.

   ```azurecli-interactive
   az role assignment create \
       --assignee-object-id $principalId \
       --assignee-principal-type ServicePrincipal
       --role "Storage Table Data Contributor" \
       --scope $resourceId
    ```

To see a working example, refer to the `deploy.sh` script in our [GitHub repository][github-repo].

## Producer code

### AWS implementation

The AWS workload uses the AWS boto3 Python library to interact with AWS SQS queues to configure storage queue access. The AWS IAM `AssumeRole` capability authenticates to the SQS endpoint using the IAM identity associated with the EKS pod hosting the application.

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

### Azure implementation

The Azure implementation uses the [Azure SDK for Python][azure-dsk-python] and passwordless OAuth authentication to interact with Azure Storage Queue services. The [`DefaultAzureCredential`][default-azure-credential] Python class is workload identity aware and uses the managed identity associated with workload identity to authenticate to the storage queue.

The following example shows how to authenticate to an Azure Storage Queue using the `DefaultAzureCredential` class:

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

In the original AWS code for DynamoDB access, the AWS boto3 library is used to interact with AWS SQS queues. You will refactor the application code to use the Azure SDK for Python to interact with Azure Storage Tables.

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

Now you need the producer code to authenticate to Azure Storage Table. As discussed earlier, the schema used in the preceding section with DynamoDB is incompatible with Azure Storage Table. Instead, you'll use a table schema that is compatible with Azure Cosmos DB, which stores the same data as the AWS workload does in DynamoDB.

This example shows the code required for Azure:

```python
from azure.storage.queue import QueueClient
from azure.data.tables import (TableServiceClient)

    creds = DefaultAzureCredential()
    table = TableServiceClient(
        endpoint=f"https://{storage_account_name}.table.core.windows.net/",  
        credential=creds).get_table_client(table_name=azure_table)

entity={
    'PartitionKey': _id,
    'RowKey': str(messageProcessingTime.total_seconds()),
    'data': jsonMessage['msg'],
    'srcStamp': jsonMessage['srcStamp'],
    'dateStamp': current_dateTime}
        
response = table.insert_entity(
    table_name=azure_table,
    entity=entity,
    timeout=60)
```

Notice that unlike DynamoDB, the Azure Storage Table code specifies both `PartitionKey` and `RowKey`. The `PartitionKey` is similar to the ID `uniqueidentifer` in DynamoDB. A `PartitionKey` is a `uniqueidentifier` for a partition in a logical container in Azure Storage Table, while the `RowKey` is a `uniqueidentifier` for all the rows in a given partition. In the case of the AWS workload, each partition will contain at most one row, which doesn't necessitate the use of a `RowKey`.

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
