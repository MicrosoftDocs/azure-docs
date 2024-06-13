---
title: Prepare to deploy the event-driven workflow (EDW) workload to Azure
description: Take the necessary steps so you can deploy the EDW workload in Azure.
ms.topic: how-to
ms.date: 05/22/2024
author: JnHs
ms.author: jenhayes
---

# Prepare to deploy the event-driven workflow (EDW) workload to Azure

The AWS workload sample is deployed using Bash, CloudFormation, and AWS CLI. The consumer Python app is deployed as a container. The following sections describe how the Azure workflow is different. There are changes in the Bash scripts used to deploy the Azure Kubernetes Service (AKS) cluster and supporting infrastructure, and modifications in the Kubernetes deployment manifests to configure KEDA to use an Azure Storage Queue scaler in place of the Amazon Simple Queue Service (SQS) scaler.

The Azure workflow uses the [AKS Node Autoprovisioning (NAP)](/azure/aks/node-autoprovision) feature, which is based on Karpenter. This greatly simplifies the deployment and usage of Karpenter on AKS by eliminating the need to use Helm to deploy Karpenter explicitly. However, if you have a need to deploy Karpenter directly, you can do so using the AKS [Karpenter provider on GitHub](https://github.com/Azure/karpenter-provider-azure).

## Configure Kubernetes deployment manifest

A Kubernetes deployment YAML manifest is used to deploy the AWS Workload to EKS. The deployment YAML has references to SQS and DynamoDB for KEDA scalers, so you need to change them to specify values that KEDA-equivalent Azure scalers can use to connect to the Azure-specific infrastructure. To do so, configure the [Azure Storage Queue KEDA scaler](https://keda.sh/docs/1.4/scalers/azure-storage-queue/).

The following snippets show the differences in the YAML manifest between AWS and Azure.

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
```

### Azure workload deployment manifest example

```yaml
    spec:
      serviceAccountName: $SERVICE_ACCOUNT
      containers:
      - name: keda-queue-reader
        image: ${AZURE_CONTAINER_REGISTRY_NAME}.azurecr.io/aws2azure/aqs-consumer
        imagePullPolicy: Always
        env:
        - name: AZURE_QUEUE_NAME
          value: $AZURE_QUEUE_NAME
        - name: AZURE_STORAGE_ACCOUNT_NAME
          value: $AZURE_STORAGE_ACCOUNT_NAME
        - name: AZURE_TABLE_NAME
          value: $AZURE_TABLE_NAME
```

## Set environment variables

Before executing any of the deployment steps, you need to set some configuration information using environment variables. In the `deployment` directory of our [GitHub repository](https://github.com/Azure-Samples/aks-event-driven-replicate-from-aws), a Bash script, `enviromentVariables.sh`, includes the following environment variables:

- `K8sversion`: The version of Kubernetes deployed on the AKS cluster
- `KARPENTER_VERSION`: The version of Karpenter deployed on the AKS cluster
- `SERVICE_ACCOUNT`: The name of the service account associated with the managed identity
- `AQS_TARGET_DEPLOYMENT`: Name of the consumer app container deployment
- `AQS_TARGET_NAMESPACE`: The namespace into which the consumer app is to be deployed
- `AZURE_QUEUE_NAME`: Name of the Azure Storage Queue
- `AZURE_TABLE_NAME`: Name of the Table where the processed messages are stored
- `LOCAL_NAME`: A simple root for resource names constructed in the deployment scripts
- `LOCATION`: The Azure region where the deployment is to be located
- `TAGS`: Any user-defined tags along with their associated value
- `STORAGE_ACCOUNT_SKU`: Azure Storage Account SKU
- `ACR_SKU`: Azure Container Registry SKU
- `AKS_NODE_COUNT`: Number of nodes

These environment variables have defaults set in the `./deployment/environmentVariables.sh` file, so you don't need to update the file unless you want to change the defaults. The names of the Azure resources created in the `deploy.sh` script are created on the fly and saved in the `deploy.state` file. You can use the `deploy.state` file to create environment variables for Azure resource names, as you'll see later in this workflow.

## Next steps

- Now that you've configured your manifest and set environment variables, [deploy the EDS workload to Azure](eks-edw-deploy.md).
