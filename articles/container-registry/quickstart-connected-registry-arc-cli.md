---
title: "Quickstart: Deploying the Connected registry Arc Extension"
description: "Learn how to deploy the Connected registry Arc Extension CLI UX with secure-by-default settings for efficient and secure operation of services."
author: tejaswikolli-web
ms.author: tejaswikolli
ms.service: azure-container-registry
ms.topic: quickstart  #Don't change
ms.date: 05/09/2024
ai-usage: ai-assisted

#customer intent: As a user, I want to learn how to deploy the Connected registry Arc Extension using the CLI UX with secure-by-default settings, such as using HTTPS, Read Only, Trust Distribution, and Cert Manager service, so that I can ensure the secure and efficient operation of my services."
---

# Quickstart: Deploy the Connected registry Arc extension (Preview)

In this quickstart, you learn how to deploy the Connected registry Arc extension using the CLI UX with secure-by-default settings to ensure robust security and operational integrity. 
 
The Connected registry is a pivotal tool for the edge customers for efficiently managing and accessing their containerized workloads, whether located on-premises or at remote sites. When Connected registry integrates with Azure arc, the service ensures a seamless and unified lifecycle management experience for Kubernetes-based containerized workloads. Deployment of the Connected registry arc extension on arc-enabled kubernetes clusters, simplifies the management and access of containerized workloads. 

## Prerequisites

* Set up the [Azure CLI][Install Azure CLI] to connect to Azure and Kubernetes.

* Create or use an existing Azure Container Registry (ACR) with [quickstart.][create-acr]

* Set up the firewall access and communication between the ACR and the Connected registry by enabling the [dedicated data endpoints.][dedicated data endpoints]

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

* Repository in the ACR registry to synchronize with the Connected registry.

    ```azurecli
    az acr import --name myacrregistry --source mcr.microsoft.com/mcr/hello-world:latest --image hello-world:latest
    ```

    The `hello-world` repository is created in the ACR registry `myacrregistry` to synchronize with the Connected registry.


## Deploy the Connected registry Arc extension with secure-by-default settings

Once the prerequisites and necessary conditions and components are in place, follow the streamlined approach and securely deploy a Connected registry extension on an arc-enabled kubernetes cluster using secure-by-default settings. The secure-by-default settings define the following configuration with HTTPS, Read Only, Trust Distribution, Cert Manager service. Follow the steps for a successful deployment: 

1.	[Create the Connected registry.](#create-the-connected-registry-and-synchronize-with-acr)
2.	[Deploy the Connected registry Arc extension.](#deploy-the-connected-registry-arc-extension-on-the-arc-enabled-kubernetes-cluster)
3.	[Verify the Connected registry extension deployment.](#verify-the-connected-registry-extension-deployment) 
4.	[Deploy a pod that uses image from Connected registry.](#deploy-a-pod-that-uses-image-from-connected-registry)


### Create the Connected registry and synchronize with ACR

Creating the Connected registry to synchronize with ACR is the foundation step for deploying the Connected registry Arc extension. 

1. Create the Connected registry, which synchronizes with the ACR registry:

    To create a Connected registry `myconnectedregistry` that synchronizes with the ACR registry `myacrregistry` in the resource group `myresourcegroup` and the repository `hello-world`, you can run the [az acr connected-registry create][az-acr-connected-registry-create] command:
    
    ```azurecli
    az acr connected-registry create --registry myacrregistry \ 
    --name myconnectedregistry \
    --resource-group myresourcegroup \ 
    --repository "hello-world"
    ``` 

- The [az acr connected-registry create][az-acr-connected-registry-create] command creates the Connected registry with the specified repository. 
- The [az acr connected-registry create][az-acr-connected-registry-create] command overwrites actions if the sync scope map named `myconnectedregistry` exists and overwrites properties if the sync token named `myconnectedregistry` exists. 
- The [az acr connected-registry create][az-acr-connected-registry-create] command validates a dedicated data endpoint during the creation of the Connected registry and provides a command to enable the dedicated data endpoint on the ACR registry.

### Deploy the Connected registry arc extension on the Arc-enabled kubernetes cluster

By deploying the Connected Registry Arc Extension, you can synchronize container images and other Open Container Initiative (OCI) artifacts with your cloud-based Azure container registry. The deployment helps speed-up access to registry artifacts and enables the building of advanced scenarios. The extension deployment ensures secure trust distribution between the Connected registry and all client nodes within the cluster and installs the cert-manager service for Transport Layer Security (TLS) encryption. 

1. Generate the Connection String and Protected Settings JSON File

   For secure deployment of the Connected registry extension, generate the connection string, including a new password, transport protocol, and create the `protected-settings-extension.json` file required for the extension deployment with [az acr connected-registry get-settings][az-acr-connected-registry-get-settings] command:

    ```bash
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

- The cat command creates the `protected-settings-extension.json` file with the connection string details. The cat command works on Linux or macOS. If you're using Windows, you can use the `echo` command to create the file. 
- The [az acr connected-registry get-settings][az-acr-connected-registry-get-settings] command generates the connection string, including the creation of a new password and the specification of the transport protocol.
- It creates and injects the contents of the connection string into the `protected-settings-extension.json` file, a necessary step for the extension deployment.

2. Deploy the Connected registry extension

   Deploy the Connected registry extension with the specified configuration details using the [az k8s-extension create][az-k8s-extension-create] command:

    ```azurecli
    az k8s-extension create --cluster-name myarck8scluster \ 
    --cluster-type connectedClusters \
    --extension-type Microsoft.ContainerRegistry.ConnectedRegistry \
    --name myconnectedregistry \
    --resource-group myresourcegroup \ 
    --config service.clusterIP=192.100.100.1 \ 
    --config-protected-file protected-settings-extension.json  
    ```

- The [az k8s-extension create][az-k8s-extension-create] command deploys the Connected registry extension on the Kubernetes cluster with the provided configuration parameters and protected settings file. 
- It ensures secure trust distribution between the Connected registry and all client nodes within the cluster and installs the cert-manager service for Transport Layer Security (TLS) encryption.
-  The clusterIP must be from the AKS cluster subnet. The `service.clusterIP` parameter specifies the IP address of the Connected registry service within the cluster. The `service.clusterIP` must be set within the range of valid service IPs for the Kubernetes (K8s) cluster. It's crucial to ensure that the IP address specified for `service.clusterIP` falls within the designated service IP range defined during the cluster's initial configuration. This range is typically found in the cluster's networking settings. If the `service.clusterIP` isn't within this range, it must be updated to an IP address that is both within the valid range and not currently in use by another service.


### Verify the Connected registry extension deployment

To verify the deployment of the Connected registry extension on the Arc-enabled Kubernetes cluster, follow the steps:

1. Verify the deployment status

    Run the [az k8s-extension show][az-k8s-extension-show] command to check the deployment status of the Connected registry extension:

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

2. Verify the Connected registry status and state

    For each Connected registry, you can view the status and state of the Connected registry using the [az acr connected-registry list][az-acr-connected-registry-list] command:
    
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

3. Verify the specific Connected registry details

    For details on a specific Connected registry, use [az acr connected-registry show][az-acr-connected-registry-show] command:

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
- The command also provides details on the Connected registry's connection status, last sync, sync window, sync schedule, and more.

### Deploy a pod that uses image from Connected registry

To deploy a pod that uses image from Connected registry within the cluster. The operation must be performed from within the cluster node itself. Follow the steps:

1. Create a secret in the cluster to authenticate with the Connected registry:

Run the [kubectl create secret docker-registry][kubectl-create-secret-docker-registry] command to create a secret in the cluster to authenticate with the Connected registry:

```bash
kubectl create secret docker-registry regcred --docker-server=192.100.100.1 --docker-username=mytoken --docker-password=mypassword
  ```

2. Deploy the pod that uses the desired image from the Connected registry using the value of  service.clusterIP address `192.100.100.1` of the Connected registry, and the Image name `hello-world` with tag `latest`:

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

By deleting the deployed Connected registry extension, you remove the corresponding Connected registry pods and configuration settings.  

1. Delete the Connected registry extension

    Run the [az k8s-extension delete][az-k8s-extension-delete] command to delete the Connected registry extension: 

    ```azurecli
    az k8s-extension delete --name myconnectedregistry 
    --cluster-name myarcakscluster \ 
    --resource-group myresourcegroup \ 
    --cluster-type connectedClusters
    ```   
   
By deleting the deployed Connected registry extension, you remove the Connected registry cloud instance and its configuration details. 

2. Delete the Connected registry

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