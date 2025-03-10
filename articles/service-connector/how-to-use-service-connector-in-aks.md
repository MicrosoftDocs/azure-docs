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

This article covers:

* The differences between Service Connector for AKS and other compute services.
* The operations executed on the cluster during the creation of a service connection.
* The operations executed on the target services during the creation of a service connection.
* Using the Kubernetes resources created by Service Connector.
* Troubleshooting and viewing Service Connector logs in an AKS cluster.

## Prerequisites

* This guide assumes that you already know the [basic concepts of Service Connector](concept-service-connector-internals.md).

## Differences between Service Connector for AKS and other compute services

Service Connector for AKS differs from how it operates with other [compute services supported by Service Connector](/azure/service-connector/overview#what-services-are-supported-by-service-connector) in several ways. The following outlines AKS-specific options and behaviors for each API operation.

### Creation

The AKS-specific creation options are listed below. Refer to the [Azure portal](/azure/service-connector/quickstart-portal-aks-connection) or [Azure CLI](/azure/service-connector/quickstart-cli-aks-connection) quickstarts to learn how to create a new connection in AKS.

- Service Connector for AKS requires the `Kubernetes namespace` parameter to specify where to [create the Kubernetes resources](#creating-the-kubernetes-resources). By default, it uses the `default` namespace.
- Service Connector for AKS supports `Workload Identity` as the secure credential authentication option, while other compute services offer `System Managed Identity` and `User Managed Identity` options.
- When using Azure Key Vault as the target service with the Secret Store CSI Driver enabled, Service Connector uses the user-assigned managed identity from the AKS `azure-keyvault-secrets-provider` add-on for authentication, without requiring users to specify the authentication type.
- Service Connector for AKS only supports the `Firewall Rules` networking option, whereas other compute services may also support `Private Link` and `Virtual Network` options.

### List configurations

Service Connector for AKS displays only non-credential configurations in the list configuration views. Users should manually check the credentials in the [associated Kubernetes resource](#creating-the-kubernetes-resources) if needed.

Using the Azure CLI command [az aks connection list-configuration](/cli/azure/aks/connection?view=azure-cli-latest&preserve-view=true#az-aks-connection-list-configuration), the value of a credential configuration is an empty string. In the Azure portal, the value of a credential configuration is hidden, as shown below.

:::image type="content" source="./media/aks-tutorial/aks-list-config.png" alt-text="Screenshot of the AKS connection listing configuration.":::

### Validation

Service Connector for AKS doesn't validate configuration value changes made within the user's cluster, whether they're credential or non-credential configurations. However, Service Connector performs the following validations, as it does for other compute services:

- Verifying the existence of the target service
- Checking IP firewall rules for access to the target service
- Ensuring role assignment for workload identity to access the target service

The output of the Azure CLI command [az aks connection validate](/cli/azure/aks/connection?view=azure-cli-latest&preserve-view=true#az-aks-connection-validate) is always `success`. The same applies to the Azure portal, as shown below.

:::image type="content" source="./media/aks-tutorial/aks-validate.png" alt-text="Screenshot of the AKS connection validation.":::

## Operations performed by Service Connector on the AKS cluster

The operations performed by Service Connector on the AKS cluster vary depending on the target services and authentication types selected when creating a service connection. The following lists the possible operations made by Service Connector.

### Adding the Service Connector Kubernetes extension

A Kubernetes extension named `sc-extension` is added to the cluster the first time a service connection is created. Later on, the extension helps create Kubernetes resources in the user's cluster, whenever a service connection request comes to Service Connector. The extension is found in the user's AKS cluster in the Azure portal, in the **Extensions + applications** menu.

:::image type="content" source="./media/aks-tutorial/sc-extension.png" alt-text="Screenshot of the Azure portal, view AKS extension.":::

The cluster connection's metadata are also stored in the extension. Uninstalling the extension renders all the connections in the cluster unavailable. The extension operator is hosted in the cluster namespace `sc-system`.

### Creating the Kubernetes resources

Service Connector creates Kubernetes resources in the namespace the user specifies when creating the service connection. The Kubernetes resources store the connection information needed by the user's workload definitions or application code to communicate with the target services. Depending on the authentication type, different Kubernetes resources are created. For the `Connection String` and `Service Principal` auth types, a Kubernetes secret is created. For the `Workload Identity` auth type, a Kubernetes service account is also created in addition to a Kubernetes secret.

You can find the Kubernetes resources created by Service Connector for each service connection on the Azure portal in your Kubernetes resource, in the Service Connector menu.

:::image type="content" source="./media/aks-tutorial/kubernetes-resources.png" alt-text="Screenshot of the Azure portal, view Service Connector created Kubernetes resources.":::

Deleting a service connection doesn't delete the associated Kubernetes resource. If necessary, remove your resource manually, using for example the `kubectl delete` command.

### Enabling the `azureKeyvaultSecretsProvider` add-on

If  the target service is Azure Key Vault and the Secret Store CSI Driver is enabled, Service Connector enables the `azureKeyvaultSecretsProvider` add-on for the cluster.

:::image type="content" source="./media/aks-tutorial/keyvault-csi.png" alt-text="Screenshot of the Azure portal, enabling CSI driver for keyvault when creating a connection.":::

Follow the [Connect to Azure Key Vault using CSI driver tutorial](./tutorial-python-aks-keyvault-csi-driver.md) to set up a connection to Azure Key Vault using Secret Store CSI driver.

### Enabling workload identity and OpenID Connect (OIDC) issuer

If the authentication type is `Workload Identity`, Service Connector enables workload identity and OIDC issuer for the cluster.

:::image type="content" source="./media/aks-tutorial/workload-identity.png" alt-text="Screenshot of the Azure portal, using workload identity to create a connection.":::

If the authentication type is `Workload Identity`, a user-assigned managed identity is needed to create the federated identity credential. Learn more about [workload identities](/entra/workload-id/workload-identities-overview) or refer [the following tutorial](./tutorial-python-aks-storage-workload-identity.md) to set up a connection to Azure Storage using a workload identity.

## Operations performed by Service Connector on the target services

Service Connector for AKS performs the same operations on target services as other compute services. However, the operations vary depending on the target service types and authentication methods. The following lists some possible operations.

### Get connection configurations

Service Connector retrieves the required connection configurations from the target service and sets them as a Kubernetes secret in the user's cluster. The connection configurations vary based on the target service type and authentication method:

- For the `Connection String` authentication type, the configuration typically includes a service secret or connection string.
- For the `Workload Identity` authentication type, it usually contains the service endpoint.
- For the `Service Principal` authentication type, it contains the service principal's tenant ID, client ID, and client secret. 

For detailed information on specific target services, refer to the corresponding documentation, such as the [Azure AI services](/azure/service-connector/how-to-integrate-ai-services?tabs=dotnet#system-assigned-managed-identity-recommended) guide.

### Create IP based firewall rules

Service Connector retrieves the outbound public IP from the AKS cluster and creates IP firewall rules on the target service to allow network access from the cluster.

### Create Microsoft Entra ID role assignments

When using the `Workload Identity` authentication type, Service Connector automatically creates a role assignment for the identity. The assigned role varies based on the target service to ensure appropriate access.
Users can also customize role assignments as needed. For more information, see [role customization](/azure/service-connector/concept-microsoft-entra-roles#role-customization).

## Use the Kubernetes resources created by Service Connector

Service Connector creates various Kubernetes resources depending on the target service type and authentication type selected. The following sections show how to use the Kubernetes resources created by Service Connector in your cluster workloads definition and application code.

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

The Service Connector Kubernetes extension is built on top of [Azure Arc-enabled Kubernetes cluster extensions](/azure/azure-arc/kubernetes/extensions). Use the following commands to check for any errors occurring during the extension installation or update process.

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

- `Unable to get a response from the agent in time`.
- `Extension pods can't be scheduled if all the node pools in the cluster are "CriticalAddonsOnly" tainted`

**Mitigation:**

Refer to [extension creation errors](/troubleshoot/azure/azure-kubernetes/extensions/cluster-extension-deployment-errors#extension-creation-errors)


#### Helm errors

**Error messages:**

- `Unable to download the Helm chart from the repo URL`

This error is caused by connectivity problems that occur between the cluster and the firewall in addition to egress blocking problems. 
To resolve this problem, see [Outbound network and FQDN rules for Azure Kubernetes Service (AKS) clusters](/azure/aks/outbound-rules-control-egress), 
and add the FQDN required to pull Service Connector Helm chart: `scaksextension.azurecr.io`

**Error messages:**

- `Timed out waiting for resource readiness`
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
