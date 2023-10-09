---
title: Azure Key Vault Provider for Secrets Store CSI Driver for Azure Kubernetes Service (AKS) configuration and troubleshooting options
description: Learn configuration and troubleshooting options for the Azure Key Vault Provider for Secrets Store CSI Driver in Azure Kubernetes Service (AKS).
author: nickomang 
ms.author: nickoman
ms.topic: how-to 
ms.date: 10/02/2023
ms.custom: template-how-to, devx-track-azurecli, devx-track-linux
---

# Azure Key Vault Provider for Secrets Store CSI Driver for Azure Kubernetes Service (AKS) configuration and troubleshooting options

After following [Use the Azure Key Vault Provider for Secrets Store CSI Driver in an AKS cluster](./csi-secrets-store-driver.md) and [Provide an identity to access the Azure Key Vault Provider for Secrets Store CSI Driver in AKS](./csi-secrets-store-identity-access.md), you can apply additional configurations or perform troubleshooting for the Azure Key Vault Provider for Secrets Store CSI Driver in AKS.

## Configuration options

### Enable and disable autorotation

> [!NOTE]
> When the Azure Key Vault Provider for Secrets Store CSI Driver is enabled, it updates the pod mount and the Kubernetes secret defined in the `secretObjects` field of `SecretProviderClass`. It does so by polling for changes periodically, based on the rotation poll interval you defined. The default rotation poll interval is *two minutes*.

>[!NOTE]
> When a secret updates in an external secrets store after initial pod deployment, the Kubernetes Secret and the pod mount periodically update depending on how the application consumes the secret data.
>
> **Mount the Kubernetes Secret as a volume**: Use the autorotation and Sync K8s secrets features of Secrets Store CSI Driver. The application needs to watch for changes from the mounted Kubernetes Secret volume. When the CSI Driver updates the Kubernetes Secret, the corresponding volume contents automatically update as well.
>
> **Application reads the data from the container’s filesystem**: Use the rotation feature of Secrets Store CSI Driver. The application needs to watch for the file change from the volume mounted by the CSI driver.
>
> **Use the Kubernetes Secret for an environment variable**: Restart the pod to get the latest secret as an environment variable. Use a tool such as [Reloader][reloader] to watch for changes on the synced Kubernetes Secret and perform rolling upgrades on pods.

#### Enable autorotation on a new AKS cluster

* Enable autorotation of secrets on a new cluster using the [`az aks create`][az-aks-create] command and enable the `enable-secret-rotation` add-on.

    ```azurecli-interactive
    az aks create -n myAKSCluster2 -g myResourceGroup --enable-addons azure-keyvault-secrets-provider --enable-secret-rotation
    ```

#### Enable autorotation on an existing AKS cluster

* Update an existing cluster to enable autorotation of secrets using the [`az aks addon update`][az-aks-addon-update] command and the `enable-secret-rotation` parameter.

    ```azurecli-interactive
    az aks addon update -g myResourceGroup -n myAKSCluster2 -a azure-keyvault-secrets-provider --enable-secret-rotation
    ```

#### Specify a custom rotation interval

* Specify a custom rotation interval using the [`az aks addon update`][az-aks-addon-update] command with the `rotation-poll-interval` parameter.

    ```azurecli-interactive
    az aks addon update -g myResourceGroup -n myAKSCluster2 -a azure-keyvault-secrets-provider --enable-secret-rotation --rotation-poll-interval 5m
    ```

#### Disable autorotation

To disable autorotation, you first need to disable the add-on. Then, you can re-enable the add-on without the `enable-secret-rotation` parameter.

1. Disable the secrets provider add-on using the [`az aks addon disable`][az-aks-addon-disable] command.

    ```azurecli-interactive
    az aks addon disable -g myResourceGroup -n myAKSCluster2 -a azure-keyvault-secrets-provider
    ```

2. Re-enable the secrets provider add-on without the `enable-secret-rotation` parameter using the [`az aks addon enable`][az-aks-addon-enable] command.

    ```azurecli-interactive
    az aks addon enable -g myResourceGroup -n myAKSCluster2 -a azure-keyvault-secrets-provider
    ```

### Sync mounted content with a Kubernetes secret

> [!NOTE]
> The YAML examples in this section are incomplete. You need to modify them to support your chosen method of access to your key vault identity. For details, see [Provide an identity to access the Azure Key Vault Provider for Secrets Store CSI Driver][identity-access-methods].

You might want to create a Kubernetes secret to mirror your mounted secrets content. Your secrets sync after you start a pod to mount them. When you delete the pods that consume the secrets, your Kubernetes secret is also deleted.

* Sync mounted content with a Kubernetes secret using the `secretObjects` field when creating a `SecretProviderClass` to define the desired state of the Kubernetes secret, as shown in the following example YAML.

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

> [!NOTE]
> The example YAML demonstrates access to a secret through env variables and volume/volumeMount. This is for illustrative purposes. A typical application would use one method or the other. However, be aware that in order for a secret to be available through env variables, it first must be mounted by at least one pod.

* Reference your newly created Kubernetes secret by setting an environment variable in your pod, as shown in the following example YAML.

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

### Access metrics

#### The Azure Key Vault Provider

Metrics are served via Prometheus from port 8898, but this port isn't exposed outside the pod by default.

* Access the metrics over localhost using `kubectl port-forward`.

    ```bash
    kubectl port-forward -n kube-system ds/aks-secrets-store-provider-azure 8898:8898 & curl localhost:8898/metrics
    ```

##### Metrics provided by the Azure Key Vault Provider for Secrets Store CSI Driver

|Metric|Description|Tags|
|----|----|----|
|keyvault_request|The distribution of how long it took to get from the key vault.|`os_type=<runtime os>`, `provider=azure`, `object_name=<keyvault object name>`, `object_type=<keyvault object type>`, `error=<error if failed>`|
|grpc_request|The distribution of how long it took for the gRPC requests.|`os_type=<runtime os>`, `provider=azure`, `grpc_method=<rpc full method>`, `grpc_code=<grpc status code>`, `grpc_message=<grpc status message>`|

#### The Secrets Store CSI Driver

Metrics are served from port 8095, but this port isn't exposed outside the pod by default.

* Access the metrics over localhost using `kubectl port-forward`.

    ```bash
    kubectl port-forward -n kube-system ds/aks-secrets-store-csi-driver 8095:8095 &
    curl localhost:8095/metrics
    ```

##### Metrics provided by the Secrets Store CSI Driver

|Metric|Description|Tags|
|----|----|----|
|total_node_publish|The total number of successful volume mount requests.|`os_type=<runtime os>`, `provider=<provider name>`|
|total_node_unpublish|The total number of successful volume unmount requests.|`os_type=<runtime os>`|
|total_node_publish_error|The total number of errors with volume mount requests.|`os_type=<runtime os>`, `provider=<provider name>`, `error_type=<error code>`|
|total_node_unpublish_error|The total number of errors with volume unmount requests.|`os_type=<runtime os>`|
|total_sync_k8s_secret|The total number of Kubernetes secrets synced.|`os_type=<runtime os`, `provider=<provider name>`|
|sync_k8s_secret_duration_sec|The distribution of how long it took to sync the Kubernetes secret.|`os_type=<runtime os>`|
|total_rotation_reconcile|The total number of rotation reconciles.|`os_type=<runtime os>`, `rotated=<true or false>`|
|total_rotation_reconcile_error|The total number of rotation reconciles with error.|`os_type=<runtime os>`, `rotated=<true or false>`, `error_type=<error code>`|
|total_rotation_reconcile_error|The distribution of how long it took to rotate secrets-store content for pods.|`os_type=<runtime os>`|

### Migrate from open-source to AKS-managed Secrets Store CSI Driver

1. Uninstall the open-source Secrets Store CSI Driver using the following `helm delete` command.

    ```bash
    helm delete <release name>
    ```

    > [!NOTE]
    > If you installed the driver and provider using deployment YAMLs, you can delete the components using the following `kubectl delete` command.
    >
    > ```bash
    > # Delete AKV provider pods from Linux nodes
    > kubectl delete -f https://raw.githubusercontent.com/Azure/secrets-store-csi-driver-provider-azure/master/deployment/provider-azure-installer.yaml
    >
    > # Delete AKV provider pods from Windows nodes
    > kubectl delete -f https://raw.githubusercontent.com/Azure/secrets-store-csi-driver-provider-azure/master/deployment/provider-azure-installer-windows.yaml
    > ```

2. Upgrade your existing AKS cluster with the feature using the [`az aks enable-addons`][az-aks-enable-addons] command.

    ```azurecli-interactive
    az aks enable-addons --addons azure-keyvault-secrets-provider --name myAKSCluster --resource-group myResourceGroup
    ```

## Troubleshooting

For troubleshooting steps, see [Azure Key Vault Provider for Secrets Store CSI Driver troubleshooting](https://azure.github.io/secrets-store-csi-driver-provider-azure/docs/troubleshooting/).

## Next steps

To learn more about the Azure Key Vault Provider for Secrets Store CSI Driver, see the following resources:

* [Using the Azure Key Vault Provider](https://azure.github.io/secrets-store-csi-driver-provider-azure/docs/getting-started/usage/)
* [Upgrading the Azure Key Vault Provider](https://azure.github.io/secrets-store-csi-driver-provider-azure/docs/upgrading/)
* [Using Secrets Store CSI with AKS and Azure Key Vault](https://github.com/Azure-Samples/secrets-store-csi-with-aks-akv)

<!-- LINKS INTERNAL -->
[az-aks-create]: /cli/azure/aks#az-aks-create
[az-aks-enable-addons]: /cli/azure/aks#az-aks-enable-addons
[identity-access-methods]: ./csi-secrets-store-identity-access.md
[az-aks-addon-update]: /cli/azure/aks#az-aks-addon-update
[az-aks-addon-disable]: /cli/azure/aks#az-aks-addon-disable
[az-aks-addon-enable]: /cli/azure/aks#az-aks-addon-enable

<!-- LINKS EXTERNAL -->
[reloader]: https://github.com/stakater/Reloader
