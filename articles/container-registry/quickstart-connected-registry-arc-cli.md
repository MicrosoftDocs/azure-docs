---
title: "Quickstart: Deploying the Connected Registry Arc Extension"
description: "Learn how to deploy the Connected Registry Arc Extension CLI UX with secure-by-default settings for efficient and secure container workload operations."
author: tejaswikolli-web
ms.author: tejaswikolli
ms.service: azure-container-registry
ms.topic: quickstart  #Don't change
ms.date: 05/09/2024
ai-usage: ai-assisted

#customer intent: As a user, I want to learn how to deploy the connected registry Arc extension using the CLI UX with secure-by-default settings, such as using HTTPS, Read Only, Trust Distribution, and Cert Manager service, so that I can ensure the secure and efficient operation of my container workloads."
---

# Quickstart: Deploy the connected registry Arc extension (Preview)

In this quickstart, you learn how to deploy the Connected registry Arc extension using the CLI UX with secure-by-default settings to ensure robust security and operational integrity. 
 
The connected registry is a pivotal tool for edge customers, enabling efficient management and access to containerized workloads, whether on-premises or at remote sites. By integrating with Azure Arc, the service ensures a seamless and unified lifecycle management experience for Kubernetes-based containerized workloads. Deploying the connected registry Arc extension on Arc-enabled Kubernetes clusters simplifies the management and access of these workloads. 

## Prerequisites

* Set up the [Azure CLI][Install Azure CLI] to connect to Azure and Kubernetes.

* Create or use an existing Azure Container Registry (ACR) with [quickstart.][create-acr]

* Set up the firewall access and communication between the ACR and the connected registry by enabling the [dedicated data endpoints.][dedicated data endpoints]

* Create or use an existing Azure Kubernetes Service (AKS) cluster with the [tutorial.][tutorial-aks-cluster]

* Set up the connection between the Kubernetes cluster and Azure Arc by following the [quickstart.][quickstart-connect-cluster]

* Use the [k8s-extension][k8s-extension] command to manage Kubernetes extensions.

    ```azurecli
    az extension add --name k8s-extension
    ```
* Register the required [Azure resource providers][azure-resource-provider-requirements] in your subscription and use Azure Arc-enabled Kubernetes:

    ```azurecli
    az provider register --namespace Microsoft.Kubernetes
    az provider register --namespace Microsoft.KubernetesConfiguration
    az provider register --namespace Microsoft.ExtendedLocation
    ```
    An Azure resource provider is a set of REST operations that enable functionality for a specific Azure service. 

* Repository in the ACR registry to synchronize with the connected registry.

    ```azurecli
    az acr import --name myacrregistry --source mcr.microsoft.com/mcr/hello-world:latest --image hello-world:latest
    ```

    The `hello-world` repository is created in the ACR registry `myacrregistry` to synchronize with the Connected registry.


## Deploy the Connected registry Arc extension with secure-by-default settings

Once the prerequisites and necessary conditions and components are in place, follow the streamlined approach to securely deploy a connected registry extension on an Arc-enabled Kubernetes cluster using the following settings. These settings define the following configuration with HTTPS, Read Only, Trust Distribution, and Cert Manager service. Follow the steps for a successful deployment: 

1.	[Create the connected registry.](#create-the-connected-registry-and-synchronize-with-acr)
2.	[Deploy the connected registry Arc extension.](#deploy-the-connected-registry-arc-extension-on-the-arc-enabled-kubernetes-cluster)
3.	[Verify the connected registry extension deployment.](#verify-the-connected-registry-extension-deployment) 
4.	[Deploy a pod that uses image from connected registry.](#deploy-a-pod-that-uses-image-from-connected-registry)


### Create the connected registry and synchronize with ACR

Creating the connected registry to synchronize with ACR is the foundational step for deploying the connected registry Arc extension. 

1. Create the connected registry, which synchronizes with the ACR registry:

    To create a connected registry `myconnectedregistry` that synchronizes with the ACR registry `myacrregistry` in the resource group `myresourcegroup` and the repository `hello-world`, you can run the [az acr connected-registry create][az-acr-connected-registry-create] command:
    
    ```azurecli
    az acr connected-registry create --registry myacrregistry \ 
    --name myconnectedregistry \
    --resource-group myresourcegroup \ 
    --repository "hello-world"
    ``` 

- The [az acr connected-registry create][az-acr-connected-registry-create] command creates the connected registry with the specified repository. 
- The [az acr connected-registry create][az-acr-connected-registry-create] command overwrites actions if the sync scope map named `myscopemap` exists and overwrites properties if the sync token named `mysynctoken` exists. 
- The [az acr connected-registry create][az-acr-connected-registry-create] command validates a dedicated data endpoint during the creation of the connected registry and provides a command to enable the dedicated data endpoint on the ACR registry.

### Deploy the connected registry Arc extension on the Arc-enabled kubernetes cluster

By deploying the connected Registry Arc extension, you can synchronize container images and other Open Container Initiative (OCI) artifacts with your ACR registry. The deployment helps speed-up access to registry artifacts and enables the building of advanced scenarios. The extension deployment ensures secure trust distribution between the connected registry and all client nodes within the cluster, and installs the cert-manager service for Transport Layer Security (TLS) encryption. 

1. Generate the Connection String and Protected Settings JSON File

   For secure deployment of the connected registry extension, generate the connection string, including a new password, transport protocol, and create the `protected-settings-extension.json` file required for the extension deployment with [az acr connected-registry get-settings][az-acr-connected-registry-get-settings] command:

    ```Linux
    cat << EOF > protected-settings-extension.json
    {
      "connectionString": "$(az acr connected-registry get-settings \
      --name myconnectedregistry \
      --registry myacrregistry \
      --parent-protocol https \
      --generate-password 1 \
      --query ACR_REGISTRY_CONNECTION_STRING --output tsv --yes)"
    }
    EOF
    ```

   ```Windows
   echo "{\"connectionString\":\"$(az acr connected-registry get-settings \
   --name myconnectedregistry \
   --registry myacrregistry \
   --parent-protocol https \
   --generate-password 1 \
   --query ACR_REGISTRY_CONNECTION_STRING \
   --output tsv \
   --yes | tr -d '\r')\" }" > settings.json
    ```

**Note:** The cat and echo commands create the `protected-settings-extension.json` file with the connection string details, injecting the contents of the connection string into the `protected-settings-extension.json` file, a necessary step for the extension deployment. The [az acr connected-registry get-settings][az-acr-connected-registry-get-settings] command generates the connection string, including the creation of a new password and the specification of the transport protocol. 

2. Deploy the connected registry extension

   Deploy the connected registry extension with the specified configuration details using the [az k8s-extension create][az-k8s-extension-create] command:

    ```azurecli
    az k8s-extension create --cluster-name myarck8scluster \ 
    --cluster-type connectedClusters \
    --extension-type Microsoft.ContainerRegistry.ConnectedRegistry \
    --name myconnectedregistry \
    --resource-group myresourcegroup \ 
    --config service.clusterIP=192.100.100.1 \ 
    --config-protected-file protected-settings-extension.json  
    ```

- The [az k8s-extension create][az-k8s-extension-create] command deploys the connected registry extension on the Kubernetes cluster with the provided configuration parameters and protected settings file. 
- It ensures secure trust distribution between the connected registry and all client nodes within the cluster, and installs the cert-manager service for Transport Layer Security (TLS) encryption.
- The clusterIP must be from the AKS cluster subnet IP range. The `service.clusterIP` parameter specifies the IP address of the connected registry service within the cluster. It is essential to set the `service.clusterIP` within the range of valid service IPs for the Kubernetes cluster. Ensure that the IP address specified for `service.clusterIP` falls within the designated service IP range defined during the cluster's initial configuration, typically found in the cluster's networking settings. If the `service.clusterIP` is not within this range, it must be updated to an IP address that is both within the valid range and not currently in use by another service.


### Verify the connected registry extension deployment

To verify the deployment of the connected registry extension on the Arc-enabled Kubernetes cluster, follow the steps:

1. Verify the deployment status

    Run the [az k8s-extension show][az-k8s-extension-show] command to check the deployment status of the connected registry extension:

    ```azurecli
    az k8s-extension show --name myconnectedregistry \ 
    --cluster-name myarck8scluster \
    --resource-group myresourcegroup \
    --cluster-type connectedClusters
    ```
    **Example Output**

    ```output
      {
      "aksAssignedIdentity": null,
      "autoUpgradeMinorVersion": true,
      "configurationProtectedSettings": {
        "connectionString": ""
      },
      "configurationSettings": {
        "pvc.storageClassName": "standard",
        "pvc.storageRequest": "250Gi",
        "service.clusterIP": "[your service cluster ip]"
      },
      "currentVersion": "0.11.0",
      "customLocationSettings": null,
      "errorInfo": null,
      "extensionType": "microsoft.containerregistry.connectedregistry",
      "id": "/subscriptions/[your subscription id]/resourceGroups/[your resource group name]/providers/Microsoft.Kubernetes/connectedClusters/[your arc cluster name]/providers/Microsoft.KubernetesConfiguration/extensions/[your extension name]",
      "identity": {
        "principalId": "[identity principal id]",
        "tenantId": null,
        "type": "SystemAssigned"
      },
      "isSystemExtension": false,
      "name": "[your extension name]",
      "packageUri": null,
      "plan": null,
      "provisioningState": "Succeeded",
      "releaseTrain": "preview",
      "resourceGroup": "[your resource group]",
      "scope": {
        "cluster": {
          "releaseNamespace": "connected-registry"
        },
        "namespace": null
      },
      "statuses": [],
      "systemData": {
        "createdAt": "2024-07-12T18:17:51.364427+00:00",
        "createdBy": null,
        "createdByType": null,
        "lastModifiedAt": "2024-07-12T18:22:42.156799+00:00",
        "lastModifiedBy": null,
        "lastModifiedByType": null
      },
      "type": "Microsoft.KubernetesConfiguration/extensions",
      "version": null
    }
    ```    

2. Verify the connected registry status and state

    For each connected registry, you can view the status and state of the connected registry using the [az acr connected-registry list][az-acr-connected-registry-list] command:
    
    ```azurecli
        az acr connected-registry list --registry myacrregistry \
        --output table
    ```

**Example Output**

```console
    | NAME | MODE | CONNECTION STATE | PARENT | LOGIN SERVER | LAST SYNC(UTC) |
    |------|------|------------------|--------|--------------|----------------|
    | myconnectedregistry | ReadWrite | online | myacrregistry | myacrregistry.azurecr.io | 2024-05-09 12:00:00 |
    | myreadonlyacr | ReadOnly | offline | myacrregistry | myacrregistry.azurecr.io | 2024-05-09 12:00:00 |
```

3. Verify the specific connected registry details

    For details on a specific connected registry, use [az acr connected-registry show][az-acr-connected-registry-show] command:

    ```azurecli
    az acr connected-registry show --registry myacrregistry \
    --name myreadonlyacr \ 
    --output table
    ```

    **Example Output**

```console
   | NAME                | MODE      | CONNECTION STATE | PARENT        | LOGIN SERVER             | LAST SYNC(UTC)      | SYNC SCHEDULE | SYNC WINDOW       |
   | ------------------- | --------- | ---------------- | ------------- | ------------------------ | ------------------- | ------------- | ----------------- |
   | myconnectedregistry | ReadWrite | online           | myacrregistry | myacrregistry.azurecr.io | 2024-05-09 12:00:00 | 0 0 * * *     | 00:00:00-23:59:59 |
```

- The [az k8s-extension show][az-k8s-extension-show] command verifies the state of the extension deployment.
- The command also provides details on the connected registry's connection status, last sync, sync window, sync schedule, and more.

### Deploy a pod that uses an image from connected registry

To deploy a pod that uses an image from connected registry within the cluster, the operation must be performed from within the cluster node itself. Follow these steps:

1. Create a secret in the cluster to authenticate with the connected registry:

Run the [kubectl create secret docker-registry][kubectl-create-secret-docker-registry] command to create a secret in the cluster to authenticate with the Connected registry:

```bash
kubectl create secret docker-registry regcred --docker-server=192.100.100.1 --docker-username=mytoken --docker-password=mypassword
  ```

2. Deploy the pod that uses the desired image from the connected registry using the value of service.clusterIP address `192.100.100.1` of the connected registry, and the image name `hello-world` with tag `latest`:

    ```bash
    kubectl apply -f - <<EOF
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: hello-world-deployment
      labels:
        app: hello-world
    spec:
      selector:
        matchLabels:
          app: hello-world
      replicas: 1
      template:
        metadata:
          labels:
            app: hello-world
        spec:
          imagePullSecrets:
            - name: regcred
          containers:
            - name: hello-world
              image: 192.100.100.1/hello-world:latest
    EOF
    ``` 

## Clean up resources

By deleting the deployed connected registry extension, you remove the corresponding connected registry pods and configuration settings.  

1. Delete the connected registry extension

    Run the [az k8s-extension delete][az-k8s-extension-delete] command to delete the connected registry extension: 

    ```azurecli
    az k8s-extension delete --name myconnectedregistry 
    --cluster-name myarcakscluster \ 
    --resource-group myresourcegroup \ 
    --cluster-type connectedClusters
    ```   
   
By deleting the deployed connected registry, you remove the connected registry cloud instance and its configuration details. 

2. Delete the connected registry

    Run the [az acr connected-registry delete][az-acr-connected-registry-delete] command to delete the Connected registry: 

    ```azurecli
    az acr connected-registry delete --registry myacrregistry \
    --name myconnectedregistry \
    --resource-group myresourcegroup 
    ```

## Next steps

- [Known issues: Connected registry Arc Extension](troubleshoot-connected-registry-arc.md)


<!-- LINKS - internal -->
[create-acr]: container-registry-get-started-azure-cli.md
[dedicated data endpoints]: container-registry-firewall-access-rules.md#enable-dedicated-data-endpoints
[Install Azure CLI]: /cli/azure/install-azure-cli
[k8s-extension]: /cli/azure/k8s-extension
[azure-resource-provider-requirements]: /azure/azure-arc/kubernetes/system-requirements#azure-resource-provider-requirements
[quickstart-connect-cluster]: /azure/azure-arc/kubernetes/quickstart-connect-cluster
[tutorial-aks-cluster]: /azure/aks/tutorial-kubernetes-deploy-cluster?tabs=azure-cli
[az-acr-connected-registry-create]: /cli/azure/acr/connected-registry#az-acr-connected-registry-create
[az-acr-connected-registry-get-settings]: /cli/azure/acr/connected-registry#az-acr-connected-registry-get-settings
[az-k8s-extension-create]: /cli/azure/k8s-extension#az-k8s-extension-create
[az-k8s-extension-show]: /cli/azure/k8s-extension#az-k8s-extension-show
[az-acr-connected-registry-list]: /cli/azure/acr/connected-registry#az-acr-connected-registry-list
[az-acr-connected-registry-show]: /cli/azure/acr/connected-registry#az-acr-connected-registry-show
[az-k8s-extension-delete]: /cli/azure/k8s-extension#az-k8s-extension-delete
[az-acr-connected-registry-delete]: /cli/azure/acr/connected-registry#az-acr-connected-registry-delete
[kubectl-create-secret-docker-registry]: https://kubernetes.io/docs/reference/kubectl/generated/kubectl_create/kubectl_create_secret_docker-registry/
