---
title: Prepare to deploy the event-driven workflow (EDW) workload to Azure
description: Take the necessary steps so you can deploy the EDW workload in Azure.
ms.topic: how-to
ms.date: 06/20/2024
author: JnHs
ms.author: jenhayes
---

# Prepare to deploy the event-driven workflow (EDW) workload to Azure

The AWS workload sample is deployed using Bash, CloudFormation, and AWS CLI. The consumer Python app is deployed as a container. The following sections describe how the Azure workflow is different. There are changes in the Bash scripts used to deploy the Azure Kubernetes Service (AKS) cluster and supporting infrastructure. Additionally, the Kubernetes deployment manifests are modified to configure KEDA to use an Azure Storage Queue scaler in place of the Amazon Simple Queue Service (SQS) scaler.

The Azure workflow uses the [AKS Node Autoprovisioning (NAP)](/azure/aks/node-autoprovision) feature, which is based on Karpenter. This feature greatly simplifies the deployment and usage of Karpenter on AKS by eliminating the need to use Helm to deploy Karpenter explicitly. However, if you have a need to deploy Karpenter directly, you can do so using the AKS [Karpenter provider on GitHub](https://github.com/Azure/karpenter-provider-azure).

## Configure Kubernetes deployment manifest

AWS uses a Kubernetes deployment YAML manifest to deploy the workload to EKS. The AWS deployment YAML has references to SQS and DynamoDB for KEDA scalers, so we need to change them to specify KEDA-equivalent values for the Azure scalers to use to connect to the Azure infrastructure. To do so, configure the [Azure Storage Queue KEDA scaler][azure-storage-queue-scaler].

The following code snippets show example YAML manifests for the AWS and Azure implementations.

### AWS implementation

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

### Azure implementation

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

Before executing any of the deployment steps, you need to set some configuration information using the following environment variables:

- `K8sversion`: The version of Kubernetes deployed on the AKS cluster.
- `KARPENTER_VERSION`: The version of Karpenter deployed on the AKS cluster.
- `SERVICE_ACCOUNT`: The name of the service account associated with the managed identity.
- `AQS_TARGET_DEPLOYMENT`: The name of the consumer app container deployment.
- `AQS_TARGET_NAMESPACE`: The namespace into which the consumer app is deployed.
- `AZURE_QUEUE_NAME`: The name of the Azure Storage Queue.
- `AZURE_TABLE_NAME`: The name of the Azure Storage Table that stores the processed messages.
- `LOCAL_NAME`: A simple root for resource names constructed in the deployment scripts.
- `LOCATION`: The Azure region where the deployment is located.
- `TAGS`: Any user-defined tags along with their associated values.
- `STORAGE_ACCOUNT_SKU`: The Azure Storage Account SKU.
- `ACR_SKU`: The Azure Container Registry SKU.
- `AKS_NODE_COUNT`: The number of nodes.

You can review the `environmentVariables.sh` Bash script in the `deployment` directory of our [GitHub repository][github-repo]. These environment variables have defaults set, so you don't need to update the file unless you want to change the defaults. The names of the Azure resources are created dynamically in the `deploy.sh` script and are saved in the `deploy.state` file. You can use the `deploy.state` file to create environment variables for Azure resource names.

## Next steps

> [!div class="nextstepaction"]
> [Deploy the EDW workload to Azure][eks-edw-deploy]

## Contributors

*This article is maintained by Microsoft. It was originally written by the following contributors*:

- Ken Kilty | Principal TPM
- Russell de Pina | Principal TPM
- Jenny Hayes | Senior Content Developer
- Carol Smith | Senior Content Developer
- Erin Schaffer | Content Developer 2

<!-- LINKS -->
[azure-storage-queue-scaler]: https://keda.sh/docs/1.4/scalers/azure-storage-queue/
[github-repo]: https://github.com/Azure-Samples/aks-event-driven-replicate-from-aws
[eks-edw-deploy]: ./eks-edw-deploy.md
