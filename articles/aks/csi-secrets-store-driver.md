---
title: Use the Azure Key Vault Provider for Secrets Store CSI Driver for Azure Kubernetes Service secrets
description: Learn how to use the Azure Key Vault Provider for Secrets Store CSI Driver to integrate secrets stores with Azure Kubernetes Service (AKS).
author: nickomang 
ms.author: nickoman
ms.topic: how-to 
ms.date: 02/10/2023
ms.custom: template-how-to, devx-track-azurecli, devx-track-linux
---

# Use the Azure Key Vault Provider for Secrets Store CSI Driver in an AKS cluster

The Azure Key Vault Provider for Secrets Store CSI Driver allows for the integration of an Azure key vault as a secret store with an Azure Kubernetes Service (AKS) cluster via a [CSI volume][kube-csi].

## Features

* Mounts secrets, keys, and certificates to a pod by using a CSI volume
* Supports CSI inline volumes
* Supports mounting multiple secrets store objects as a single volume
* Supports pod portability with the `SecretProviderClass` CRD
* Supports Windows containers
* Syncs with Kubernetes secrets
* Supports autorotation of mounted contents and synced Kubernetes secrets

## Limitations

A container using subPath volume mount won't receive secret updates when it's rotated. For more information, see [Secrets Store CSI Driver known limitations](https://secrets-store-csi-driver.sigs.k8s.io/known-limitations.html#secrets-not-rotated-when-using-subpath-volume-mount).

## Prerequisites

* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
* Check that your version of the Azure CLI is 2.30.0 or later. If it's an earlier version, [install the latest version](/cli/azure/install-azure-cli).
* If you're restricting Ingress to the cluster, make sure ports **9808** and **8095** are open.
* The minimum recommended Kubernetes version is based on the [rolling Kubernetes version support window][kubernetes-version-support]. Make sure you're running version N-2 or later.

## Create an AKS cluster with Azure Key Vault Provider for Secrets Store CSI Driver support

1. Create an Azure resource group.

    ```azurecli-interactive
    az group create -n myResourceGroup -l eastus2
    ```

2. Create an AKS cluster with Azure Key Vault Provider for Secrets Store CSI Driver capability using the [`az aks create`][az-aks-create] command with the `azure-keyvault-secrets-provider` add-on.

    ```azurecli-interactive
    az aks create -n myAKSCluster -g myResourceGroup --enable-addons azure-keyvault-secrets-provider
    ```

3. A user-assigned managed identity, named `azureKeyvaultSecretsProvider`, is created by the add-on to access Azure resources. The following example uses this identity to connect to the Azure key vault where the secrets will be stored, but you can also use other [identity access methods][identity-access-methods]. Take note of the identity's `clientId` in the output.

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

* Upgrade an existing AKS cluster with Azure Key Vault Provider for Secrets Store CSI Driver capability using the [`az aks enable-addons`][az-aks-enable-addons] command with the `azure-keyvault-secrets-provider` add-on. The add-on creates a user-assigned managed identity you can use to authenticate to your Azure key vault.

    ```azurecli-interactive
    az aks enable-addons --addons azure-keyvault-secrets-provider --name myAKSCluster --resource-group myResourceGroup
    ```

## Verify the Azure Key Vault Provider for Secrets Store CSI Driver installation

1. Verify the installation is finished using the `kubectl get pods` command to list all pods that have the `secrets-store-csi-driver` and `secrets-store-provider-azure` labels in the kube-system namespace, and ensure that your output looks similar to the following output:

    ```bash
    kubectl get pods -n kube-system -l 'app in (secrets-store-csi-driver,secrets-store-provider-azure)'
    ```

    ```output
    NAME                                     READY   STATUS    RESTARTS   AGE
    aks-secrets-store-csi-driver-4vpkj       3/3     Running   2          4m25s
    aks-secrets-store-csi-driver-ctjq6       3/3     Running   2          4m21s
    aks-secrets-store-csi-driver-tlvlq       3/3     Running   2          4m24s
    aks-secrets-store-provider-azure-5p4nb   1/1     Running   0          4m21s
    aks-secrets-store-provider-azure-6pqmv   1/1     Running   0          4m24s
    aks-secrets-store-provider-azure-f5qlm   1/1     Running   0          4m25s
    ```

2. Verify that each node in your cluster's node pool has a Secrets Store CSI Driver pod and a Secrets Store Provider Azure pod running.

## Create or use an existing Azure key vault

In addition to an AKS cluster, you'll need an Azure key vault resource that stores the secret content.

1. Create an Azure key vault using the [`az keyvault create`][az-keyvault-create] command. The name of the key vault must be globally unique.

    ```azurecli
    az keyvault create -n <keyvault-name> -g myResourceGroup -l eastus2
    ```

2. Your Azure key vault can store keys, secrets, and certificates. In this example, use the [`az keyvault secret set`][az-keyvault-secret-set] command to set a plain-text secret called `ExampleSecret`.

    ```azurecli
    az keyvault secret set --vault-name <keyvault-name> -n ExampleSecret --value MyAKSExampleSecret
    ```

3. Take note of the following properties for use in the next section:

   * The name of the secret object in the key vault
   * The object type (secret, key, or certificate)
   * The name of your Azure key vault resource
   * The Azure tenant ID that the subscription belongs to

## Provide an identity to access the Azure key vault

The Secrets Store CSI Driver allows for the following methods to access an Azure key vault:

* An [Azure Active Directory pod identity][aad-pod-identity] (preview)
* An [Azure Active Directory workload identity][aad-workload-identity]
* A user-assigned or system-assigned managed identity

Follow the instructions in [Provide an identity to access the Azure Key Vault Provider for Secrets Store CSI Driver][identity-access-methods] for your chosen method.

> [!IMPORTANT]
> The rest of the examples on this page require that you've followed the instructions in [Provide an identity to access the Azure Key Vault Provider for Secrets Store CSI Driver][identity-access-methods], chosen one of the identity methods, and configured a SecretProviderClass. Come back to this page after completing those steps.

## Validate the secrets

After the pod starts, the mounted content at the volume path that you specified in your deployment YAML is available.

* Use the following commands to validate your secrets and print a test secret.

To show secrets held in the secrets store:
    ```bash
    kubectl exec busybox-secrets-store-inline -- ls /mnt/secrets-store/
    ```

To display a secret in the store, for example this command shows the test secret `ExampleSecret`:

```
kubectl exec busybox-secrets-store-inline -- cat /mnt/secrets-store/ExampleSecret
```

## Obtain certificates and keys

The Azure Key Vault design makes sharp distinctions between keys, secrets, and certificates. The Key Vault service’s certificates features were designed to make use of its key and secret capabilities. When a key vault certificate is created, an addressable key and secret are also created with the same name. The key allows key operations, and the secret allows the retrieval of the certificate value as a secret.

A key vault certificate also contains public x509 certificate metadata. The key vault stores both the public and private components of your certificate in a secret. You can obtain each individual component by specifying the `objectType` in `SecretProviderClass`. The following table shows which objects map to the various resources associated with your certificate:

| Object | Return value | Returns entire certificate chain |
|---|---|---|
|`key`|The public key, in Privacy Enhanced Mail (PEM) format|N/A|
|`cert`|The certificate, in PEM format|No|
|`secret`|The private key and certificate, in PEM format|Yes|

## Disable the Azure Key Vault Provider for Secrets Store CSI Driver on an existing AKS cluster

> [!NOTE]
> Before you disable the add-on, ensure that no `SecretProviderClass` is in use. Trying to disable the add-on while `SecretProviderClass` exists will result in an error.

* Disable the Azure Key Vault Provider for Secrets Store CSI Driver capability in an existing cluster using the [`az aks disable-addons`][az-aks-disable-addons] command with the `azure-keyvault-secrets-provider` add-on.

    ```azurecli-interactive
    az aks disable-addons --addons azure-keyvault-secrets-provider -g myResourceGroup -n myAKSCluster
    ```

> [!NOTE]
> If the add-on is disabled, existing workloads will have no issues and will not see any updates in the mounted secrets. If the pod restarts or a new pod is created as part of scale-up event, the pod will fail to start because the driver is no longer running.

## More configuration options

### Enable and disable autorotation

> [!NOTE]
> When the Azure Key Vault Provider for Secrets Store CSI Driver is enabled, it updates the pod mount and the Kubernetes secret that's defined in the `secretObjects` field of `SecretProviderClass`. It does so by polling for changes periodically, based on the rotation poll interval you've defined. The default rotation poll interval is 2 minutes.

>[!NOTE]
> When a secret is updated in an external secrets store after initial pod deployment, the Kubernetes Secret and the pod mount will be periodically updated depending on how the application consumes the secret data.
>
> **Mount the Kubernetes Secret as a volume**: Use the autorotation and Sync K8s secrets features of Secrets Store CSI Driver. The application will need to watch for changes from the mounted Kubernetes Secret volume. When the Kubernetes Secret is updated by the CSI Driver, the corresponding volume contents are automatically updated.
>
> **Application reads the data from the container’s filesystem**: Use the rotation feature of Secrets Store CSI Driver. The application will need to watch for the file change from the volume mounted by the CSI driver.
>
> **Use the Kubernetes Secret for an environment variable**: Restart the pod to get the latest secret as an environment variable.
> Use a tool such as [Reloader][reloader] to watch for changes on the synced Kubernetes Secret and perform rolling upgrades on pods.

#### Enable autorotation on a new AKS cluster

* Enable autorotation of secrets using the `enable-secret-rotation` parameter when you create your cluster.

    ```azurecli-interactive
    az aks create -n myAKSCluster2 -g myResourceGroup --enable-addons azure-keyvault-secrets-provider --enable-secret-rotation
    ```

#### Enable autorotation on an existing AKS cluster

* Update an existing cluster to enable autorotation of secrets using the [`az aks addon update`][az-aks-addon-update] command and the `enable-secret-rotation` parameter.

    ```azurecli-interactive
    az aks addon update -g myResourceGroup -n myAKSCluster2 -a azure-keyvault-secrets-provider --enable-secret-rotation
    ```

#### Specify a custom rotation interval

* Specify a custom rotation interval using the `rotation-poll-interval` parameter.

    ```azurecli-interactive
    az aks addon update -g myResourceGroup -n myAKSCluster2 -a azure-keyvault-secrets-provider --enable-secret-rotation --rotation-poll-interval 5m
    ```

#### Disable autorotation

* To disable autorotation, first disable the addon. Then, re-enable the addon without the `enable-secret-rotation` parameter.

Disable the secrets provider addon:

```azurecli-interactive
az aks addon disable -g myResourceGroup -n myAKSCluster2 -a azure-keyvault-secrets-provider
```

Re-enable the secrets provider addon, but without the `enable-secret-rotation` parameter:

```bash
az aks addon enable -g myResourceGroup -n myAKSCluster2 -a azure-keyvault-secrets-provider
```

### Sync mounted content with a Kubernetes secret

> [!NOTE]
> The YAML examples here are incomplete. You'll need to modify them to support your chosen method of access to your key vault identity. For details, see [Provide an identity to access the Azure Key Vault Provider for Secrets Store CSI Driver][identity-access-methods].

You might want to create a Kubernetes secret to mirror your mounted secrets content. Your secrets will sync after you start a pod to mount them. When you delete the pods that consume the secrets, your Kubernetes secret will also be deleted.

To sync mounted content with a Kubernetes secret, use the `secretObjects` field when creating a `SecretProviderClass` to define the desired state of the Kubernetes secret, as shown in the following example.

```yml
apiVersion: secrets-store.csi.x-k8s.io/v1
kind: SecretProviderClass
metadata:
  name: azure-sync
spec:
  provider: azure                             
  secretObjects:                              # [OPTIONAL] SecretObjects defines the desired state of synced Kubernetes secret objects
  - data:
    - key: username                           # data field to populate
      objectName: foo1                        # name of the mounted content to sync; this could be the object name or the object alias
    secretName: foosecret                     # name of the Kubernetes secret object
    type: Opaque                              # type of Kubernetes secret object (for example, Opaque, kubernetes.io/tls)
```

> [!NOTE]
> Make sure the `objectName` in the `secretObjects` field matches the file name of the mounted content. If you use `objectAlias` instead, it should match the object alias.

#### Set an environment variable to reference Kubernetes secrets

After creating the Kubernetes secret, you can reference it by setting an environment variable in your pod, as shown in the following example code.

> [!NOTE]
> The example YAML demonstrates access to a secret through env variables and through volume/volumeMount. This is for illustrative purposes; a typical application would use one method or the other. However, be aware that in order for a secret to be available through env variables, it first must be mounted by at least one pod.

```yml
kind: Pod
apiVersion: v1
metadata:
  name: busybox-secrets-store-inline
spec:
  containers:
    - name: busybox
      image: registry.k8s.io/e2e-test-images/busybox:1.29-1 
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

## Access metrics

### The Azure Key Vault Provider

Metrics are served via Prometheus from port 8898, but this port isn't exposed outside the pod by default.

* Access the metrics over localhost using `kubectl port-forward`.

    ```bash
    kubectl port-forward -n kube-system ds/aks-secrets-store-provider-azure 8898:8898 & curl localhost:8898/metrics
    ```

#### Metrics provided by the Azure Key Vault Provider for Secrets Store CSI Driver

|Metric|Description|Tags|
|----|----|----|
|keyvault_request|The distribution of how long it took to get from the key vault|`os_type=<runtime os>`, `provider=azure`, `object_name=<keyvault object name>`, `object_type=<keyvault object type>`, `error=<error if failed>`|
|grpc_request|The distribution of how long it took for the gRPC requests|`os_type=<runtime os>`, `provider=azure`, `grpc_method=<rpc full method>`, `grpc_code=<grpc status code>`, `grpc_message=<grpc status message>`|

### The Secrets Store CSI Driver

Metrics are served from port 8095, but this port isn't exposed outside the pod by default.

* Access the metrics over localhost using `kubectl port-forward`.

    ```bash
    kubectl port-forward -n kube-system ds/aks-secrets-store-csi-driver 8095:8095 &
    curl localhost:8095/metrics
    ```

#### Metrics provided by the Secrets Store CSI Driver

|Metric|Description|Tags|
|----|----|----|
|total_node_publish|The total number of successful volume mount requests|`os_type=<runtime os>`, `provider=<provider name>`|
|total_node_unpublish|The total number of successful volume unmount requests|`os_type=<runtime os>`|
|total_node_publish_error|The total number of errors with volume mount requests|`os_type=<runtime os>`, `provider=<provider name>`, `error_type=<error code>`|
|total_node_unpublish_error|The total number of errors with volume unmount requests|`os_type=<runtime os>`|
|total_sync_k8s_secret|The total number of Kubernetes secrets synced|`os_type=<runtime os`, `provider=<provider name>`|
|sync_k8s_secret_duration_sec|The distribution of how long it took to sync the Kubernetes secret|`os_type=<runtime os>`|
|total_rotation_reconcile|The total number of rotation reconciles|`os_type=<runtime os>`, `rotated=<true or false>`|
|total_rotation_reconcile_error|The total number of rotation reconciles with error|`os_type=<runtime os>`, `rotated=<true or false>`, `error_type=<error code>`|
|total_rotation_reconcile_error|The distribution of how long it took to rotate secrets-store content for pods|`os_type=<runtime os>`|

## Troubleshooting

For generic troubleshooting steps, see [Azure Key Vault Provider for Secrets Store CSI Driver troubleshooting](https://azure.github.io/secrets-store-csi-driver-provider-azure/docs/troubleshooting/).

## Next steps

In this article, you learned how to use the Azure Key Vault Provider for Secrets Store CSI Driver with an AKS cluster. To learn more about the Azure Key Vault Provider for Secrets Store CSI Driver, see:

* [Using the Azure Key Vault Provider](https://azure.github.io/secrets-store-csi-driver-provider-azure/docs/getting-started/usage/)
* [Upgrading the Azure Key Vault Provider](https://azure.github.io/secrets-store-csi-driver-provider-azure/docs/upgrading/)
* [Using Secrets Store CSI with AKS and Azure Key Vault](https://github.com/Azure-Samples/secrets-store-csi-with-aks-akv)

<!-- LINKS INTERNAL -->
[az-aks-create]: /cli/azure/aks#az-aks-create

[az-aks-enable-addons]: /cli/azure/aks#az-aks-enable-addons

[az-aks-disable-addons]: /cli/azure/aks#az-aks-disable-addons

[csi-storage-drivers]: ./csi-storage-drivers.md

[identity-access-methods]: ./csi-secrets-store-identity-access.md

[aad-pod-identity]: ./use-azure-ad-pod-identity.md

[aad-workload-identity]: workload-identity-overview.md

[az-keyvault-create]: /cli/azure/keyvault#az-keyvault-create.md

[az-keyvault-secret-set]: /cli/azure/keyvault#az-keyvault-secret-set.md

[az-aks-addon-update]: /cli/azure/aks#addon-update.md

<!-- LINKS EXTERNAL -->
[kube-csi]: https://kubernetes-csi.github.io/docs/

[reloader]: https://github.com/stakater/Reloader

[kubernetes-version-support]: ./supported-kubernetes-versions.md?tabs=azure-cli#kubernetes-version-support-policy


