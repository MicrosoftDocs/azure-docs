---
title: How Service Connector helps Azure Kubernetes Service (AKS) connect to other Azure services
description: Learn how to use Service Connector in Azure Kubernetes Service (AKS). 
author: houk-ms
ms.service: service-connector
ms.topic: conceptual
ms.date: 03/01/2024
ms.author: honc
---
# How to use Service Connector in Azure Kubernetes Service (AKS)

Azure Kubernetes Service (AKS) is one of the compute services supported by Service Connector. This article aims to help you understand:

* What operations are made on the cluster when creating a service connection.
* How to use the kubernetes resources Service Connector creates.
* How to troubleshoot and view logs of Service Connector in an AKS cluster.

## Prerequisites

* This guide assumes that you already know the [basic concepts of Service Connector](concept-service-connector-internals.md).

## What operations Service Connector makes on the cluster

Depending on the different target services and authentication types selected when creating a service connection, Service Connector makes different operations on the AKS cluster. The following lists the possible operations made by Service Connector.

### Add the Service Connector kubernetes extension

A kubernetes extension named `sc-extension` is added to the cluster the first time a service connection is created. Later on, the extension helps create kubernetes resources in user's cluster, whenever a service connection request comes to Service Connector. You can find the extension in your AKS cluster in the Azure portal, in the **Extensions + applications** menu.

:::image type="content" source="./media/aks-tutorial/sc-extension.png" alt-text="Screenshot of the Azure portal, view AKS extension.":::

The extension is also where the cluster connections metadata are stored. Uninstalling the extension makes all the connections in the cluster unavailable. The extension operator is hosted in the cluster namespace `sc-system`.

### Create kubernetes resources

Service Connector creates some kubernetes resources to the namespace the user specified when creating a service connection. The kubernetes resources store the connection information, which is needed by the user's workload definitions or application code to talk to target services. Depending on different authentication types, different kubernetes resources are created. For the `Connection String` and `Service Principal` auth types, a kubernetes secret is created. For the `Workload Identity` auth type, a kubernetes service account is also created in addition to a kubernetes secret.

You can find the kubernetes resources created by Service Connector for each service connection on the Azure portal in your kubernetes resource, in the Service Connector menu.

:::image type="content" source="./media/aks-tutorial/kubernetes-resources.png" alt-text="Screenshot of the Azure portal, view Service Connector created kubernetes resources.":::

Deleting a service connection doesn't delete the associated Kubernetes resource. If necessary, remove your resource manually, using for example the kubectl delete command.

### Enable the `azureKeyvaultSecretsProvider` addon

If target service is Azure Key Vault and the Secret Store CSI Driver is enabled when creating a service connection, Service Connector enables the `azureKeyvaultSecretsProvider` add-on for the cluster.

:::image type="content" source="./media/aks-tutorial/keyvault-csi.png" alt-text="Screenshot of the Azure portal, enabling CSI driver for keyvault when creating a connection.":::

Follow the [Connect to Azure Key Vault using CSI driver tutorial](./tutorial-python-aks-keyvault-csi-driver.md)to set up a connection to Azure Key Vault using Secret Store CSI driver.

### Enable workload identity and OpenID Connect (OIDC) issuer

If the authentication type is `Workload Identity` when creating a service connection, Service Connector enables workload identity and OIDC issuer for the cluster.

:::image type="content" source="./media/aks-tutorial/workload-identity.png" alt-text="Screenshot of the Azure portal, using workload identity to create a connection.":::

When the authentication type is `Workload Identity`, a user-assigned managed identity is needed to create the federated identity credential. Learn more from [what are workload identities](/entra/workload-id/workload-identities-overview), or follow the [tutorial](./tutorial-python-aks-storage-workload-identity.md)to set up a connection to Azure Storage using workload identity.

## How to use the Service Connector created kubernetes resources

Different kubernetes resources are created when the target service type and authentication type are different. The following sections show how to use the Service Connector created kubernetes resources in your cluster workloads definition and application codes.

#### Kubernetes secret

A kubernetes secret is created when the authentication type is `Connection String` or `Service Principal`. Your cluster workload definition can reference the secret directly. The following snnipet is an example.

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  namespace: default
  name: sc-sample-job
spec:
  template:
    spec:
      containers:
      - name: raw-linux
        image: alpine
        command: ['printenv']
        envFrom:
          - secretRef:
              name: <SecretCreatedByServiceConnector>
      restartPolicy: OnFailure

```

Then, your application codes can consume the connection string in the secret from environment variable. You can check the [sample code](./how-to-integrate-storage-blob.md) to learn more about the environment variable names and how to use them in your application codes to authenticate to different target services.

#### Kubernetes service account

Both a kubernetes service account and a secret are created when the authentication type is `Workload Identity`. Your cluster workload definition can reference the service account and secret to authenticate through workload identity. The following snipet provides an example.

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  namespace: default
  name: sc-sample-job
  labels:
    azure.workload.identity/use: "true"
spec:
  template:
    spec:
      serviceAccountName: <ServiceAccountCreatedByServiceConnector>
      containers:
      - name: raw-linux
        image: alpine
        command: ['printenv']
        envFrom:
          - secretRef:
              name: <SecretCreatedByServiceConnector>
      restartPolicy: OnFailure
```

You may check the tutorial to learn [how to connect to Azure Storage using workload identity](tutorial-python-aks-storage-workload-identity.md).

## How to troubleshoot and view logs

If an error happens and couldn't be mitigated by retrying when creating a service connection, the following methods can help gather more information for troubleshooting.

### Check Service Connector kubernetes extension

Service Connector kubernetes extension is built on top of [Azure Arc-enabled Kubernetes cluster extensions](../azure-arc/kubernetes/extensions.md). Use the following commands to investigate if there are any errors during the extension installation or updating.

1. Install the `k8s-extension` Azure CLI extension.

  ```azurecli
  az extension add --name k8s-extension
  ```

1. Get the Service Connector extension status. Check the `statuses` property in the command output to see if there are any errors.

  ```azurecli
  az k8s-extension show \
      --resource-group MyClusterResourceGroup \
      --cluster-name MyCluster \
      --cluster-type managedClusters \
      --name sc-extension
  ```

### Check kubernetes cluster logs

If there's an error during the extension installation, and the error message in the `statuses` property doesn't provide enough information about what happened, you can further check the kubernetes logs with the followings steps.

1. Connect to your AKS cluster.

   ```azurecli
   az aks get-credentials \
       --resource-group MyClusterResourceGroup \
       --name MyCluster
   ```
1. Service Connector extension is installed in the namespace `sc-system` through helm chart, check the namespace and the helm release by following commands.

   - Check the namespace exists.

   ```Bash
   kubectl get ns
   ```

   - Check the helm release status.

   ```Bash
   helm list -n sc-system
   ```
1. During the extension installation or updating, a kubernetes job called `sc-job` creates the kubernetes resources for the service connection. The job execution failure usually causes the extension failure. Check the job status by running the following commands. If `sc-job` doesn't exist in `sc-system` namespace, it should have been executed successfully. This job is designed to be automatically deleted after successful execution.

   - Check the job exists.

   ```Bash
   kubectl get job -n sc-system
   ```

   - Get the job status.

   ```Bash
   kubectl describe job/sc-job -n sc-system
   ```

   - View the job logs.

   ```Bash
   kubectl logs job/sc-job -n sc-system
   ```

## Next steps

Learn how to integrate different target services and read about their configuration settings and authentication methods.

> [!div class="nextstepaction"]
> [Learn about how to integrate storage blob](./how-to-integrate-storage-blob.md)
