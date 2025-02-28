---
title: How to use Service Connector in Azure Kubernetes Service (AKS)
description: Learn how to use Service Connector to connect AKS to other Azure services. Learn about Service Connector operations, resource management, and troubleshooting.
author: houk-ms
ms.reviewer: malev
ms.service: service-connector
ms.topic: how-to
ms.date: 02/06/2025
ms.author: honc
---

# Use Service Connector in Azure Kubernetes Service (AKS)

Azure Kubernetes Service (AKS) is one of the compute services supported by Service Connector. 
This article aims to help you understand:

* What operations are made on the cluster when creating a service connection.
* How to use the Kubernetes resources created by Service Connector.
* How to troubleshoot and view Service Connector logs in an AKS cluster.

## Prerequisites

* This guide assumes that you already know the [basic concepts of Service Connector](concept-service-connector-internals.md).

## Operations performed by Service Connector on the AKS cluster

Depending on the different target services and authentication types selected when creating a service connection, Service Connector makes different operations on the AKS cluster. The following lists the possible operations made by Service Connector.

### Adding the Service Connector Kubernetes extension

A Kubernetes extension named `sc-extension` is added to the cluster the first time a service connection is created. Later on, the extension helps create Kubernetes resources in user's cluster, whenever a service connection request comes to Service Connector. You can find the extension in your AKS cluster in the Azure portal, in the **Extensions + applications** menu.

:::image type="content" source="./media/aks-tutorial/sc-extension.png" alt-text="Screenshot of the Azure portal, view AKS extension.":::

The extension is also where the cluster connections metadata are stored. Uninstalling the extension makes all the connections in the cluster unavailable. The extension operator is hosted in the cluster namespace `sc-system`.

### Creating the Kubernetes resources

Service Connector creates some Kubernetes resources to the namespace the user specified when creating a service connection. The Kubernetes resources store the connection information, which is needed by the user's workload definitions or application code to talk to target services. Depending on different authentication types, different Kubernetes resources are created. For the `Connection String` and `Service Principal` auth types, a Kubernetes secret is created. For the `Workload Identity` auth type, a Kubernetes service account is also created in addition to a Kubernetes secret.

You can find the Kubernetes resources created by Service Connector for each service connection on the Azure portal in your Kubernetes resource, in the Service Connector menu.

:::image type="content" source="./media/aks-tutorial/kubernetes-resources.png" alt-text="Screenshot of the Azure portal, view Service Connector created Kubernetes resources.":::

Deleting a service connection doesn't delete the associated Kubernetes resource. If necessary, remove your resource manually, using for example the kubectl delete command.

### Enabling the `azureKeyvaultSecretsProvider` add-on

If target service is Azure Key Vault and the Secret Store CSI Driver is enabled when creating a service connection, Service Connector enables the `azureKeyvaultSecretsProvider` add-on for the cluster.

:::image type="content" source="./media/aks-tutorial/keyvault-csi.png" alt-text="Screenshot of the Azure portal, enabling CSI driver for keyvault when creating a connection.":::

Follow the [Connect to Azure Key Vault using CSI driver tutorial](./tutorial-python-aks-keyvault-csi-driver.md)to set up a connection to Azure Key Vault using Secret Store CSI driver.

### Enabling workload identity and OpenID Connect (OIDC) issuer

If the authentication type is `Workload Identity` when creating a service connection, Service Connector enables workload identity and OIDC issuer for the cluster.

:::image type="content" source="./media/aks-tutorial/workload-identity.png" alt-text="Screenshot of the Azure portal, using workload identity to create a connection.":::

When the authentication type is `Workload Identity`, a user-assigned managed identity is needed to create the federated identity credential. Learn more from [what are workload identities](/entra/workload-id/workload-identities-overview), or follow the [tutorial](./tutorial-python-aks-storage-workload-identity.md)to set up a connection to Azure Storage using workload identity.

## Use the Kubernetes resources created by Service Connector

Various Kubernetes resources are created by Service Connector depending on the target service type and authentication type. The following sections show how to use the Kubernetes resources created by Service Connector in your cluster workloads definition and application code.

### Kubernetes secret

A Kubernetes secret is created when the authentication type is set to either `Connection String` or `Service Principal`. Your cluster workload definition can reference the secret directly. The following snippet provides an example.

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

Your application code can consume the connection string in the secret from an environment variable. Check the following [sample code](./how-to-integrate-storage-blob.md) to learn more about the environment variable names and how to use them in your application code to authenticate to different target services.

### Kubernetes service account

A Kubernetes service account and a secret are created when the authentication type is set to `Workload Identity`. Your cluster workload definition can reference the service account and secret to authenticate through workload identity. The following snippet provides an example.

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

Check the following tutorial to learn [how to connect to Azure Storage using workload identity](tutorial-python-aks-storage-workload-identity.md).

## Troubleshoot and view logs

If an error occurs and can't be resolved by retrying when creating a service connection, the following methods help gather more information for troubleshooting.

### Check Service Connector Kubernetes extension

The Service Connector Kubernetes extension is built on top of [Azure Arc-enabled Kubernetes cluster extensions](/azure/azure-arc/kubernetes/extensions). Use the following commands to check for any errors that occurred during the extension installation or update process.

1. Install the `k8s-extension` Azure CLI extension.

    ```azurecli
    az extension add --name k8s-extension
    ```

1. Retrieve the status of the Service Connector extension. Check the `statuses` property in the command output to identify any errors.

    ```azurecli
    az k8s-extension show \
        --resource-group MyClusterResourceGroup \
        --cluster-name MyCluster \
        --cluster-type managedClusters \
        --name sc-extension
    ```

### Check Kubernetes cluster logs

If an error occurs during the extension installation and the error message in the `statuses` property doesn't provide sufficient information, you can further investigate by checking the Kubernetes logs with the followings steps.

1. Connect to your AKS cluster.

    ```azurecli
    az aks get-credentials \
        --resource-group MyClusterResourceGroup \
        --name MyCluster
    ```
1. The Service Connector extension is installed in the `sc-system` namespace using a Helm chart. Check the namespace and the Helm release using the following commands.

   - Check the namespace exists.

      ```Bash
      kubectl get ns
      ```

   - Check the helm release status.

      ```Bash
      helm list -n sc-system
      ```

1. During the extension installation or update, a Kubernetes job called `sc-job` creates the Kubernetes resources for the service connection. A job execution failure typically causes the extension to fail. Check the job status by running the following commands. If `sc-job` doesn't exist in the `sc-system` namespace, it should have been executed successfully. This job is designed to be automatically deleted after successful execution.

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

### Common errors and mitigations

#### Extension creation error

**Error message:**

`Unable to get a response from the agent in time`.

**Mitigation:**

Refer to [extension creation errors](/troubleshoot/azure/azure-kubernetes/extensions/cluster-extension-deployment-errors#extension-creation-errors)


#### Helm errors

**Error messages:**

- `Timed out waiting for resource readiness`
- `Unable to download the Helm chart from the repo URL`
- `Helm chart rendering failed with given values`
- `Resource already exists in your cluster`
- `Operation is already in progress for Helm`

**Mitigation:**

Refer to [Helm errors](/troubleshoot/azure/azure-kubernetes/extensions/cluster-extension-deployment-errors#helm-errors)


#### Conflict

**Error message:**

`Operation returned an invalid status code: Conflict`.

**Reason:**

This error typically occurs when attempting to create a service connection while the Azure Kubernetes Service (AKS) cluster is in an updating state. The service connection update conflicts with the ongoing update. This error also occurs when your subscription is not registered with the `Microsoft.KubernetesConfiguration` resource provider.

**Mitigation:**

1. Ensure your cluster is in a "Succeeded" state and retry the creation.
1. Run the following command to make sure your subscription is registered with the `Microsoft.KubernetesConfiguration` resource provider.

    ```azurecli
    az provider register -n Microsoft.KubernetesConfiguration
    ```

#### Unauthorized resource access

**Error message:**

`You do not have permission to perform ... If access was recently granted, please refresh your credentials`.

**Reason:**

Service Connector requires permissions to operate the Azure resources you want to connect to, in order to perform connection operations on your behalf. This error indicates a lack of necessary permissions on some Azure resources.

**Mitigation:**

Check the permissions on the Azure resources specified in the error message. Obtain the required permissions and retry the creation.

#### Missing subscription registration

**Error message:**

`The subscription is not registered to use namespace 'Microsoft.KubernetesConfiguration'`

**Reason:**

Service Connector requires the subscription to be registered with `Microsoft.KubernetesConfiguration`, which is the resource provider for [Azure Arc-enabled Kubernetes cluster extensions](/azure/azure-arc/kubernetes/extensions).

**Mitigation:**

Register the `Microsoft.KubernetesConfiguration` resource provider by running the following command. For more information on resource provider registration errors, please refer to [Resolve errors for resource provider registration](../azure-resource-manager/troubleshooting/error-register-resource-provider.md).

```azurecli
az provider register -n Microsoft.KubernetesConfiguration
```


## Next step

Learn how to integrate different target services and read about their configuration settings and authentication methods.

> [!div class="nextstepaction"]
> [Learn about how to integrate storage blob](./how-to-integrate-storage-blob.md)
