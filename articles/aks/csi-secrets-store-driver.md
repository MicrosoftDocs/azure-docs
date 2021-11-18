---
title: Use the Azure Key Vault Provider for Secrets Store CSI Driver for Azure Kubernetes Service secrets
description: Learn how to use the Azure Key Vault Provider for Secrets Store CSI Driver to integrate secrets stores with Azure Kubernetes Service (AKS).
author: nickomang 
ms.author: nickoman
ms.service: container-service
ms.topic: how-to 
ms.date: 10/13/2021
ms.custom: template-how-to, devx-track-azurecli
---

# Use the Azure Key Vault Provider for Secrets Store CSI Driver in an Azure Kubernetes Service (AKS) cluster

The Azure Key Vault Provider for Secrets Store CSI Driver allows for the integration of Azure Key Vault as a secrets store with a Kubernetes cluster via a [CSI volume][kube-csi].

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

- Before you start, ensure your Azure CLI version is >= `2.30.0`, or [install the latest version](/cli/azure/install-azure-cli).

### Supported Kubernetes versions

The minimum recommended Kubernetes version is based on the [rolling Kubernetes version support window][kubernetes-version-support]. Ensure you are running N-2 or a more recent version.

## Features

- Mount secrets, keys, and/or certs to a pod using a CSI volume
- Supports CSI Inline volumes
- Supports mounting multiple secrets store objects as a single volume
- Supports pod portability with the SecretProviderClass CRD
- Supports Windows containers
- Sync with Kubernetes Secrets
- Supports auto rotation of mounted contents and synced Kubernetes secrets

## Create an AKS cluster with Azure Key Vault Provider for Secrets Store CSI Driver support

First, create an Azure resource group:

```azurecli-interactive
az group create -n myResourceGroup -l eastus2
```

To create an AKS cluster with Azure Key Vault Provider for Secrets Store CSI Driver capability, use the [az aks create][az-aks-create] command with the addon `azure-keyvault-secrets-provider`.

```azurecli-interactive
az aks create -n myAKSCluster -g myResourceGroup --enable-addons azure-keyvault-secrets-provider --enable-managed-identity
```

A user-assigned managed identity is created by the addon for the purpose of accessing Azure resources, named `azurekeyvaultsecretsprovider-*`. For this example, we will use this identity to connect to the Azure Key Vault where our secrets will be stored, but other [identity access methods][identity-access-methods] can be used. Take note of the identity's `clientId` in the output:

```json
...,
 "addonProfiles": {
    "azureKeyvaultSecretsProvider": {
      ...,
      "identity": {
        "clientId": "<client-id>",
        ...
      }
    }
```

## Upgrade an existing AKS cluster with Azure Key Vault Provider for Secrets Store CSI Driver support

To upgrade an existing AKS cluster with Azure Key Vault Provider for Secrets Store CSI Driver capability, use the [az aks enable-addons][az-aks-enable-addons] command with the addon `azure-keyvault-secrets-provider`:

```azurecli-interactive
az aks enable-addons --addons azure-keyvault-secrets-provider --name myAKSCluster --resource-group myResourceGroup
```

As stated above, the addon creates a user-assigned managed identity that can be used to authenticate to Azure Key Vault.

## Verify Azure Key Vault Provider for Secrets Store CSI Driver installation

The above will install the Secrets Store CSI Driver and the Azure Key Vault Provider on your nodes. Verify completion by listing all pods with the `secrets-store-csi-driver` and `secrets-store-provider-azure` labels in the kube-system namespace, and ensure your output looks similar to the following:

```bash
kubectl get pods -n kube-system -l 'app in (secrets-store-csi-driver, secrets-store-provider-azure)'

NAME                                     READY   STATUS    RESTARTS   AGE
aks-secrets-store-csi-driver-4vpkj       3/3     Running   2          4m25s
aks-secrets-store-csi-driver-ctjq6       3/3     Running   2          4m21s
aks-secrets-store-csi-driver-tlvlq       3/3     Running   2          4m24s
aks-secrets-store-provider-azure-5p4nb   1/1     Running   0          4m21s
aks-secrets-store-provider-azure-6pqmv   1/1     Running   0          4m24s
aks-secrets-store-provider-azure-f5qlm   1/1     Running   0          4m25s
```

Be sure that a Secrets Store CSI Driver pod and an Azure Key Vault Provider pod are running on each node in your cluster's node pools.

## Create or use an existing Azure Key Vault

In addition to an AKS cluster, you will need an Azure Key Vault resource containing the secret content. Keep in mind that the Key Vault's name must be globally unique.

```azurecli
az keyvault create -n <keyvault-name> -g myResourceGroup -l eastus2
```

Azure Key Vault can store keys, secrets, and certificates. In this example, we'll set a plain text secret called `ExampleSecret`:

```azurecli
az keyvault secret set --vault-name <keyvault-name> -n ExampleSecret --value MyAKSExampleSecret
```

Take note of the following properties for use in the next section:

- Name of secret object in Key Vault
- Object type (secret, key, or certificate)
- Name of your Azure Key Vault resource
- Azure Tenant ID the Subscription belongs to

## Provide identity to access Azure Key Vault

The Secrets Store CSI Driver allows for the following methods to access an Azure Key Vault instance:
- [Azure Active Directory pod identity][aad-pod-identity]
- User or System-assigned managed identity

Follow the steps to [provide an identity to access Azure Key Vault][identity-access-methods] for your chosen method.

## Validate the secrets

After the pod starts, the mounted content at the volume path specified in your deployment YAML is available.

```Bash
## show secrets held in secrets-store
kubectl exec busybox-secrets-store-inline -- ls /mnt/secrets-store/

## print a test secret 'ExampleSecret' held in secrets-store
kubectl exec busybox-secrets-store-inline -- cat /mnt/secrets-store/ExampleSecret
```

## Obtaining certificates and keys

Azure Key Vault's design makes sharp distinctions between keys, secrets, and certificates. The Key Vault service’s certificates features were designed making use of its key and secret capabilities. When a Key Vault certificate is created, an addressable key and secret are also created with the same name. The key allows key operations and the secret allows retrieval of the certificate value as a secret. A Key Vault certificate also contains public x509 certificate metadata. Azure Key Vault stores both the public and the private parts of your certificate in a secret. Each individual component can be obtained by specifying the `objectType` in your SecretProviderClass. The following table shows what object maps to the different resources associated with your certificate:

|Object|Return value|Returns entire certificate chain|
|---|---|---|
|`key`|The public key in PEM format|N/A|
|`cert`|The certificate in PEM format|No|
|`secret`|The private key and certificate in PEM format|Yes|

## Disable Azure Key Vault Provider for Secrets Store CSI Driver on an existing AKS Cluster

> [!NOTE]
> Before disabling the addon, ensure that there is no `SecretProviderClass` in use. Trying to disable the addon while a `SecretProviderClass` exists will result in error.

To disable the Azure Key Vault Provider for Secrets Store CSI Driver capability in an existing cluster, use the [az aks disable-addons][az-aks-disable-addons] command with the `azure-keyvault-secrets-provider` flag:

```azurecli-interactive
az aks disable-addons --addons azure-keyvault-secrets-provider -g myResourceGroup -n myAKSCluster
```

> [!NOTE]
> If the addon is disabled, existing workloads will have no issues and will not see any updates in the mounted secrets. If the pod restarts or a new pod is created as part of scale up event, then the pod will fail to start because the driver is no longer running.

## Additional configuration options

### Enabling and disabling autorotation

> [!NOTE]
> When enabled, the Azure Key Vault Provider for Secrets Store CSI Driver will update the pod mount and the Kubernetes Secret defined in secretObjects of the SecretProviderClass by polling for changes periodically based on the rotation poll interval defined. The default rotation poll interval is 2m.

To enable autorotation of secrets, use the flag `enable-secret-rotation` when creating your cluster:

```azurecli-interactive
az aks create -n myAKSCluster2 -g myResourceGroup --enable-addons azure-keyvault-secrets-provider --enable-secret-rotation
```

Or update an existing cluster with the addon enabled:

```azurecli-interactive
az aks update -g myResourceGroup -n myAKSCluster2 --enable-secret-rotation
```

To specify a custom rotation interval, use the flag `rotation-poll-interval`:

```azurecli-interactive
az aks update -g myResourceGroup -n myAKSCluster2 --enable-secret-rotation --rotation-poll-interval 5m
```

To disable, use the flag `disable-secret-rotation`:

```azurecli-interactive
az aks update -g myResourceGroup -n myAKSCluster2 --disable-secret-rotation
```

### Sync mounted content with a Kubernetes secret

In some cases, you may want to create a Kubernetes Secret to mirror the mounted content.

When creating a SecretProviderClass, use the `secretObjects` field to define the desired state of Kubernetes secrets:

> [!NOTE]
> This is not a complete example. You will need to make modifications to this example to support your chosen method of Azure Key Vault identity access.

> [!NOTE]
> The secrets will only sync once you start a pod mounting the secrets. Solely relying on the syncing with the Kubernetes secrets feature does not work. When all the pods consuming the secret are deleted, the Kubernetes secret is also deleted.


> [!NOTE]
> Make sure the `objectName` in `secretObjects` matches the file name of the mounted content. If `objectAlias` is used instead, then it should match the object alias.

```yml
apiVersion: secrets-store.csi.x-k8s.io/v1
kind: SecretProviderClass
metadata:
  name: azure-sync
spec:
  provider: azure                             
  secretObjects:                              # [OPTIONAL] SecretObject defines the desired state of synced K8s secret objects
  - data:
    - key: username                           # data field to populate
      objectName: foo1                        # name of the mounted content to sync. this could be the object name or the object alias
    secretName: foosecret                     # name of the Kubernetes Secret object
    type: Opaque                              # type of the Kubernetes Secret object e.g. Opaque, kubernetes.io/tls
```

#### Set environment variables to reference Kubernetes secrets

Once the Kubernetes secret has been created, you can set an environment variable in your pod referencing the Kubernetes secret:

> [!NOTE]
> This is not a complete example. You will need to make modifications to this example to support your chosen method of Azure Key Vault identity access.

```yml
kind: Pod
apiVersion: v1
metadata:
  name: busybox-secrets-store-inline
spec:
  containers:
    - name: busybox
      image: k8s.gcr.io/e2e-test-images/busybox:1.29-1
      command:
        - "/bin/sleep"
        - "10000"
      volumeMounts:
      - name: secrets-store01-inline
        mountPath: "/mnt/secrets-store"
        readOnly: true
      env:
      - name: SECRET_USERNAME
        valueFrom:
          secretKeyRef:
            name: foosecret
            key: username
  volumes:
    - name: secrets-store01-inline
      csi:
        driver: secrets-store.csi.k8s.io
        readOnly: true
        volumeAttributes:
          secretProviderClass: "azure-sync"
```

## Metrics

### Azure Key Vault Provider

Metrics are served via Prometheus from port 8898, but this port is not exposed outside the pod by default. Access the metrics over localhost using `kubectl port-forward`:

```bash
kubectl port-forward -n kube-system ds/aks-secrets-store-provider-azure 8898:8898 &
curl localhost:8898/metrics
```

The following table lists the metrics provided by the Azure Key Vault provider for Secrets Store CSI Driver:

|Metric|Description|Tags|
|----|----|----|
|keyvault_request|Distribution of how long it took to get from keyvault|`os_type=<runtime os>`, `provider=azure`, `object_name=<keyvault object name>`, `object_type=<keyvault object type>`, `error=<error if failed>`|
|grpc_request|Distribution of how long it took for the gRPC requests|`os_type=<runtime os>`, `provider=azure`, `grpc_method=<rpc full method>`, `grpc_code=<grpc status code>`, `grpc_message=<grpc status message>`|

### Secrets Store CSI Driver

Metrics are served from port 8095, but this port is not exposed outside the pod by default. Access the metrics over localhost using `kubectl port-forward`:

```bash
kubectl port-forward -n kube-system ds/aks-secrets-store-csi-driver 8095:8095 &
curl localhost:8095/metrics
```

The following table lists the metrics provided by the Secrets Store CSI Driver:

|Metric|Description|Tags|
|----|----|----|
|total_node_publish|Total number of successful volume mount requests|`os_type=<runtime os>`, `provider=<provider name>`|
|total_node_unpublish|Total number of successful volume unmount requests|`os_type=<runtime os>`|
|total_node_publish_error|Total number of errors with volume mount requests|`os_type=<runtime os>`, `provider=<provider name>`, `error_type=<error code>`|
|total_node_unpublish_error|Total number of errors with volume unmount requests|`os_type=<runtime os>`|
|total_sync_k8s_secret|Total number of k8s secrets synced|`os_type=<runtime os`, `provider=<provider name>`|
|sync_k8s_secret_duration_sec|Distribution of how long it took to sync k8s secret|`os_type=<runtime os>`|
|total_rotation_reconcile|Total number of rotation reconciles|`os_type=<runtime os>`, `rotated=<true or false>`|
|total_rotation_reconcile_error|Total number of rotation reconciles with error|`os_type=<runtime os>`, `rotated=<true or false>`, `error_type=<error code>`|
|total_rotation_reconcile_error|Distribution of how long it took to rotate secrets-store content for pods|`os_type=<runtime os>`|

## Next steps
<!-- Add a context sentence for the following links -->
After learning how to use the Azure Key Vault Provider for Secrets Store CSI Driver with an AKS Cluster, see the following resources:

- [Enable CSI drivers for Azure Disks and Azure Files on AKS][csi-storage-drivers]

<!-- Links -->
<!-- Internal -->
[az-feature-register]: /cli/azure/feature#az_feature_register
[az-feature-list]: /cli/azure/feature#az_feature_list
[az-provider-register]: /cli/azure/provider#az_provider_register
[az-extension-add]: /cli/azure/extension#az_extension_add
[az-extension-update]: /cli/azure/extension#az_extension_update
[az-aks-create]: /cli/azure/aks#az_aks_create
[az-aks-enable-addons]: /cli/azure/aks#az_aks_enable_addons
[az-aks-disable-addons]: /cli/azure/aks#az_aks_disable_addons
[key-vault-provider]: ../key-vault/general/key-vault-integrate-kubernetes.md
[csi-storage-drivers]: ./csi-storage-drivers.md
[create-key-vault]: ../key-vault/general/quick-create-cli.md
[set-secret-key-vault]: ../key-vault/secrets/quick-create-portal.md
[aks-managed-identity]: ./use-managed-identity.md
[identity-access-methods]: ./csi-secrets-store-identity-access.md
[aad-pod-identity]: ./use-azure-ad-pod-identity.md
[kubernetes-version-support]: ./supported-kubernetes-versions.md?tabs=azure-cli#kubernetes-version-support-policy

<!-- External -->
[kube-csi]: https://kubernetes-csi.github.io/docs/
[key-vault-provider-install]: https://azure.github.io/secrets-store-csi-driver-provider-azure/getting-started/installation
[sample-secret-provider-class]: https://azure.github.io/secrets-store-csi-driver-provider-azure/getting-started/usage/#create-your-own-secretproviderclass-object
