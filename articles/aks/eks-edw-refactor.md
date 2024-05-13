---
title: Refactor application code for the event-driven workflow (EDW) workload
description: Learn what needs to be refactored to replicate the AWS EKS event-driven workflow (EDW) workload in Azure.
ms.topic: how-to
ms.date: 05/01/2024
author: JnHs
ms.author: jenhayes
---

# Refactor application code for the event-driven workflow (EDW) workload

To replicate the EDW workload in Azure you will use Azure services and you need to refactor your application code to use Azure SDKs to access those services. This article outlines the key changes that are needed, including example code to support the workflow in Azure.

## Update data access code

The AWS workload relies on AWS services and their associated data access AWS SDKs. You have already [mapped AWS services to equivalent Azure services](eks-edw-rearchitect.md#map-aws-services-to-azure-services). Now you need to update the code that accesses data for the producer queue and the consumer results database table in Python, using Azure SDKs.

For the data plane, the producer message body (payload) is JSON, and it doesn't need any schema changes for Azure. However, the consumer saves results in a database, and the table schema for DynamoDB is incompatible with an equivalent table definition in Azure Cosmos DB. The DynamoDB table schema will need to be re-mapped to an Azure Cosmos DB table schema. The data access layer code will also require changes to work with Azure Cosmos DB. Finally, you need to change the authentication logic for the Azure Storage Queue and the Azure Cosmos DB results table.

## Authentication code changes for service-to-service

### AWS service-to-service authentication implementation

The AWS workload uses a resource-based policy that defines full access to a Amazon Simple Queue Service (SQS) resource:

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

Next, we’ll explore how to perform similar AWS service-to-service logic within the Azure environment using AKS. To control data plane access to the Azure Storage Queue and the Azure Cosmos DB database, two Azure RBAC role definitions will be applied. These roles are like the resource-based policies that AWS uses to control access to SQS and DynamoDB. However, Azure RBAC roles are not bundled with the resource, but rather assigned to a given resource at a given scope. The user-assigned managed identity security principal linked to the workload identity in an Azure Kubernetes Service (AKS) pod will have these roles assigned to it. The Azure Python SDKs for Azure Storage Queue and Azure Cosmos DB automatically use the context of the security principal to access data in both resources.

The **Storage Queue Data Contributor** role definition is shown below. Note the data actions which permit the role assignee to read, write, or delete against the Azure Storage Queue.

```json
{
  "assignableScopes": [
    "/"
  ],
  "createdBy": null,
  "createdOn": "2017-12-21T00:01:24.797231+00:00",
  "description": "Allows for read, write, and delete access to Azure Storage queues and queue messages",
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Authorization/roleDefinitions/974c5e8b-45b9-4653-ba55-5f855dd0fb88",
  "name": "974c5e8b-45b9-4653-ba55-5f855dd0fb88",
  "permissions": [
    {
      "actions": [
        "Microsoft.Storage/storageAccounts/queueServices/queues/delete",
        "Microsoft.Storage/storageAccounts/queueServices/queues/read",
        "Microsoft.Storage/storageAccounts/queueServices/queues/write"
      ],
      "condition": null,
      "conditionVersion": null,
      "dataActions": [
        "Microsoft.Storage/storageAccounts/queueServices/queues/messages/delete",
        "Microsoft.Storage/storageAccounts/queueServices/queues/messages/read",
        "Microsoft.Storage/storageAccounts/queueServices/queues/messages/write",
        "Microsoft.Storage/storageAccounts/queueServices/queues/messages/process/action"
      ],
      "notActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Storage Queue Data Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions",
  "updatedBy": null,
  "updatedOn": "2021-11-11T20:13:55.472546+00:00"
}
```

The **Cosmos DB Built-in Data Contributor** role works differently than previously applied RBAC roles, and it can't be assigned directly in the Azure portal or through `az role assignment` using the Azure CLI. Instead, a resource [Microsoft.DocumentDB databaseAccounts/sqlRoleAssignments](/azure/templates/microsoft.documentdb/2021-10-15/databaseaccounts/sqlroleassignments?pivots=deployment-language-bicep) can be used. To simplify assignment, you can also use the following Azure CLI command to assign this role:

```azurecli
az cosmosdb sql role assignment create --account-name MyAccountName --resource-group MyResourceGroup --role-assignment-id 00000000-0000-0000-0000-000000000002 --role-definition-name "Cosmos DB Built-in Data Contributor" --scope "/dbs/mydb/collections/mycontainer" --principal-id 00000000-0000-0000-0000-000000000000

# Replace --principal-id with the objectid of the security principal used. In our case this is the objectid associated with the user-assigned managed identity that is bound to the AKS workload identity.
```

To create the EDW workload in Azure, you need to set up service-to-service authentication to allow application code running AKS to authenticate to both Azure Storage Queues and Azure Cosmos DB, in a manner similar to EKS to SQS/DynamoDB. The following steps show how to use Azure CLI to create a single AKS cluster that will let an application access Azure Queue Service and Azure Cosmos DB from a pod using workload identity.

1. Enable the AKS cluster for workload identity and enable the OIDC issuer:

   ```azurecli
   az aks update -g "${RESOURCE_GROUP}" -n $AKS_CLUSTER_NAME --enable-oidc-issuer --enable-workload-identity
   ```

1. You need to configure an identity from an external OpenID Connect Provider (AKS) to get tokens as the user assigned managed identity to access [Microsoft Entra ID protected services](https://learn.microsoft.com/en-us/entra/identity-platform/v2-protocols-oidc) such as Azure Storage Queues or Cosmos DB. Retrieve the OIDC Issuer URL from the AKS cluster before creating the managed identity:

   ```azurecli
   KS_OIDC_ISSUER=$(az aks show --name $AKS_CLUSTER_NAME --resource-group "$RESOURCE_GROUP_NAME" --query "oidcIssuerProfile.issuerUrl" -otsv)
   ```

1. Create a managed identity:

   ```azurecli
   managedIdentity=$(az identity create --name "$AKS_MANAGED_IDENTITY_NAME" 
   managedIdentityObjectId=$(echo "$managedIdentity" | jq -r '.principalId')
   managedIdentityResourceId=$(echo "$managedIdentity" | jq -r '.id')
   ```

1. Create a Kubernetes service account in the AKS cluster:

   ```azurecli
   kubectl create serviceaccount "$SERVICE_ACCOUNT_NAME" -n "$SERVICE_ACCOUNT_NAMESPACE"
   kubectl annotate serviceaccount "$SERVICE_ACCOUNT_NAME" -n "$SERVICE_ACCOUNT_NAMESPACE" "azure.workload.identity/client-id=$workloadManagedIdentityClientId"
   ```

1. Establish a federated identity credential to link the managed identity and Kubernetes service account:

   ```azurecli
   az identity federated-credential create --name ${FEDERATED_IDENTITY_CREDENTIAL_NAME} --identity-name ${WORKLOAD_MANAGED_IDENTITY_NAME} --resource-group "$RESOURCE_GROUP_NAME" --issuer ${AKS_OIDC_ISSUER} --subject system=serviceaccount=${SERVICE_ACCOUNT_NAMESPACE}=${SERVICE_ACCOUNT_NAME}
   ```

1. Grant data plane RBAC role assignements to Azure Queue Service and Azure Cosmos DB for the managed identity:

   ```azurecli
   az role assignment create --assignee-object-id "$workloadManagedIdentityObjectId" --role "Storage Queue Data Contributor" --scope "$storageAccountResourceId" --assignee-principal-type ServicePrincipal
   
   az role assignment create --assignee-object-id "$workloadManagedIdentityObjectId" --role "DocumentDB Account Contributor" --scope "$cosmosdbAccountResourceId" --assignee-principal-type ServicePrincipal
   ```

1. Deploy the application and validate:

   TODO: Link to full completed deploy.sh file here

## Producer code changes

In the original AWS code for storage queue access, the AWS boto3 library is used to interact with AWS SQS queues. You will refactor the application code to use the [Azure SDK for Python](https://github.com/Azure/azure-sdk-for-python) to interact with Azure Storage Queue services.

### AWS producer code implementation

In the AWS workload, Python code similar to the example below is used to connect to SQS using the AWS IAM `AssumeRole` capability to authenticate to the SQS endpoint using the IAM Identity assocated with the EKS pod hosting the application.

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

In Azure, an equivalent means of making connections to Azure Storage Queue is to use 'passwordless' OAuth authentication. The [DefaultAzureCredential](/azure/storage/queues/storage-quickstart-queues-python?tabs=passwordless%2Croles-azure-portal%2Cenvironment-variable-windows%2Csign-in-azure-cli#authorize-access-and-create-a-client-object) Python class is workload identity aware and will transparently use the managed identity associated with workload identity to authenticate to the storage queue.

> [!NOTE]
>
> `DefaultAzureCredential` also exists in Azure SDKs for other popular programming languages including [JavaScript](/javascript/api/overview/azure/identity-readme), [Java](/java/api/overview/azure/identity-readme), [Go](/azure/developer/go/azure-sdk-authentication?tabs=bash), and [.NET](/dotnet/api/azure.identity.defaultazurecredential). This example uses Python, but applications written in any of these programming languages would authenticate easily in a similar manner to what is shown below.
>
> For more fine-grained control over credential discovery, you may also look at using the [ChainedTokenCredential](https://learn.microsoft.com/en-us/python/api/azure-identity/azure.identity.chainedtokencredential?view=azure-python) which also exists in the languages listed above.

For Azure, update your code to:

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

TODO: Insert link to final python code file from the sample (keda-aqs-reader.py)

## Consumer code changes

In the original AWS code for DynamoDB access, the AWS boto3 library is used to interact with AWS SQS queues. You will refactor the application code to use the Azure SDK for Python to interact with CosmosDB services.

### AWS consumer code implementation

The consumer part of the workload works similarly to the producer. In the AWS workload, Python code similar to the example below is used to connect to DynamoDB using the AWS IAM `AssumeRole` capability to authenticate to the DynamoDB endpoint, using the IAM identity assocated with the EKS pod hosting the application.

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

You learned how replicate the passwordless authentication mechanism used in the AWS Workload by using workload identity for AKS. You need to make similar updates to the producer code to authenticate to Azure Cosmos DB. As discussed earlier, the schema used in the preceeding section with DynamoDB is incompatible with Azure Cosmos DB. You'll also make changes that use a table schema compatible with Azure Cosmos DB that stores the same data as the AWS workload does in DynamoDB.

For Azure, update your code to:

```python
# presumes Azure RBAC assignment with a built-in or equivalent Azure RBAC role definition such as 'Cosmos DB Built-in Data Contributor' that is associated with the managed identity used by Microsoft Entra Workload ID with Azure Kubernetes Service.
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

TODO: Insert link to final python code file for the consumer from the sample (karpenter-keda-aqs-reader.py)

## Create container images and push to Azure Container Registry

Once you have refactored the app code to use Azure services and authenticate between Azure services using Microsoft Entra Workload ID with AKS, you can build the container images and push them to [Azure Container Registry (ACR)](/azure/container-registry/container-registry-intro). In the `app` directory of the cloned repository, a shell script builds the container images and pushes them to ACR. The script is called `docker-command.sh`. Open the `.sh` file and review the code. The script builds the producer and consumer container images and pushes them to ACR. For more information, see [Introduction to container registries in Azure](/azure/container-registry/container-registry-intro) and learn how to [push and pull images](/azure/container-registry/container-registry-get-started-docker-cli) from ACR.

To build the container images and push them to ACR, make sure the environment variable `AZURE_CONTAINER_REGISTRY` is set to the name of the registry you want to push the images to, then run the following command:

```bash
./app/docker-command.sh
```

## Next steps

- With your refactored code, [prepare to deploy the EDW workload to Azure](eks-edw-prepare.md).
