---
title: Prepare to deploy the event-driven workflow (EDW) scaling workload to Azure
description: Take the necessary steps so you can deploy the EDW workload in Azure.
ms.topic: how-to
ms.date: 05/01/2024
author: JnHs
ms.author: jenhayes
---

# Prepare to deploy the event-driven workflow (EDW) scaling workload to Azure

The AWS workload is designed to be deployed using Bash, CloudFormation, and AWS CLI. The producer/consumer app is distributed as a container containing the Python scripts, which will work unchanged with Azure Kubernetes Service (AKS). In the following sections, you'll make changes to several Bash shell scripts, and make modifications to the Kubernetes deployment manifests to configure KEDA to use a Azure Storage Queue scaler in place of the Amazon Simple Queue Service (SQS) scaler.

For Karpenter, you'll use the [AKS Node Autoprovisioning (NAP)](/azure/aks/node-autoprovision) feature, which is based on Karpenter. This greatly simplifies the deployment and usage of Karpenter on AKS. If you need to deploy Karpenter directly, this can be done using the AKS [Karpenter provider on Github](https://github.com/Azure/karpenter-provider-azure).

## Configure Kubernetes deployment manifest

A Kubernetes deployment YAML manifest is used to deploy the AWS Workload to EKS. The deployment YAML has references to SQS and DynamoDB for KEDA scalers, so you'll need to change them to specify values that KEDA can use to connect to the Azure-specific infrastructure. To do so, configure the [Azure Storage Queue KEDA scaler](https://keda.sh/docs/1.4/scalers/azure-storage-queue/).

The following snippets show the differences between the manifest in AWS and Azure.

### AWS workload deployment manifest example

```yaml
    spec:
      serviceAccountName: $SERVICE_ACCOUNT
      containers:
      - name: <sqs app name>
        image: <name of Python app container>
        imagePullPolicy: Always
        env:
        - name: SQS_QUEUE_URL
          value: https://<Url To SQS>/<region>/<QueueName>.fifo
        - name: DYNAMODB_TABLE
          value: <table name>
        - name: AWS_REGION
          value: <region>
        resources:
```

### Azure workload deployment manifest example

```yaml
    spec:
      serviceAccountName: $SERVICE_ACCOUNT
      containers:
      - name: keda-queue-reader
        image: <ACR name>.azurecr.io/<project>/keda-aqs-reader
        imagePullPolicy: Always
        env:
        - name: AZURE_QUEUE_NAME
          value: $AZURE_QUEUE_NAME
        - name: AZURE_COSMOSDB_TABLE
          value: $AZURE_COSMOSDB_TABLE
        - name: AZURE_COSMOSDB_CONNECTION_STRING
          value: $AZURE_COSMOSDB_CONNECTION_STRING
        resources:
        <omitted>
      imagePullSecrets:
      - name: acr-auth
```

## Set environment variables

In Visual Studio Code Explorer, in the `deployment` directory, you'll find a file called `environmentVariables.sh`. This file contains the environment variables that you'll use to set up the Azure environment.

Open the `environmentVariables.sh` file, add values for your Azure environment. The following environment variables must be provided. These names can refer to existing resources that you want to use, or they can be new values to be used as the script creates new Azure resources.

- `CLUSTER_NAME`: The name of the AKS cluster
- `K8sversion`: The version of Kubernetes to use
- `KARPENTER_VERSION`: The version of Karpenter to use
- `SERVICE_ACCOUNT`: The name of the Kubernetes service account you are going to associate with the workload identity
- `SQS_TARGET_DEPLOYMENT`: The name of the deployment that will be used to deploy the queue reader app
- `SQS_TARGET_NAMESPACE`:The Kubernetes namepsace where the queue reader app will be deployed
- `AZURE_STORAGE_ACCOUNT_NAME`: The name of the Azure Storage account where the queue resides
- `AZURE_QUEUE_NAME`: The name of the Azure Storage queue from which the app code reads the messages
- `AZURE_COSMOSDB_TABLE`: The name of the Azure CosmosDB to which table the app code writes the processed messages
- `RESOURCE_GROUP_NAME`: Name of the resource group for the solution
- `RESOURCE_GROUP_LOCATION`: Location of the resource group
- `KEY_VAULT_NAME`: Name of the key vault used to store secrets
- `STORAGE_ACCOUNT_NAME`: Name of the storage account
- `STORAGE_ACCOUNT_SKU`: SKU of the storage account
- `STORAGE_ACCOUNT_KIND`: Kind of the storage account
- `ACR_NAME`: Name of the Azure Container Registry
- `ACR_SKU`: SKU of the Azure Container Registry
- `AKS_MANAGED_IDENTITY_NAME`: Name of the user assigned managed identity
- `AKS_CLUSTER_NAME`: Name of the AKS cluster
- `AKS_NODE_COUNT`: Number of nodes in the AKS cluster
- `SUBSCRIPTION_ID`: ID of the Azure subscription
- `TAGS`: Tags to be applied to the resources
- `WORKLOAD_MANAGED_IDENTITY_NAME`: Name of the workload identity
- `SERVICE_ACCOUNT_NAME`: Name of the service account
- `SERVICE_ACCOUNT_NAMESPACE`: Namespace of the service account
- `FEDERATED_IDENTITY_CREDENTIAL_NAME`: Name of the federated identity credential
- `COSMOSDB_ACCOUNT_NAME`: The name of the Azure Cosmos DB account
- `COSMOSDB_DATABASE_NAME`: The name of the Azure Cosmos DB database
- `COSMOSDB_CONTAINER_NAME`: The name of the Azure Cosmos DB container

## Next steps

- Now that you've configured your manifest and set enivronment variables, [deploy the EDS workload to Azure](eks-edw-deploy.md).
