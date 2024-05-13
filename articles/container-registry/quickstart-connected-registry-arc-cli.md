---
title: "Quickstart: Deploying the Connected Registry Arc Extension"
description: "Learn how to deploy the Connected Registry Arc Extension CLI UX with secure-by-default settings for efficient and secure operation of services."
author: tejaswikolli-web
ms.author: tejaswikolli
ms.service: container-registry
ms.topic: quickstart  #Don't change
ms.date: 05/09/2024

#customer intent: As a user, I want to learn how to deploy the Connected Registry Arc Extension using the CLI UX with secure-by-default settings, such as using HTTPS, Read Only, Trust Distribution, and Cert Manager service, so that I can ensure the secure and efficient operation of my services."
---

# Quickstart: Deploying the connected registry arc extension 
 
The connected registry is a pivotal tool for the edge customers for efficiently managing and accessing their containerized workloads, whether located on-premises or at remote sites. When connected registry integrates with Azure arc, the service ensures a seamless and unified lifecycle management experience for Kubernetes-based containerized workloads. Deployment of the connected registry arc extension on arc-enabled kubernetes clusters, simplifies the management and access of containerized workloads. 

The quickstart guides you through a streamlined approach to securely deploy a connected registry extension on an arc-enabled kubernetes cluster using secured-by-default settings to ensure robust security and operational integrity.

## Prerequisites

* Use an existing Azure Container Registry (ACR) or follow the [quickstart](container-registry-get-started-azure-cli.md) to create a new ACR registry.

* Use an existing Azure Kubernetes Service (AKS) cluster or follow the [tutorial](tutorial-kubernetes-deploy-cluster.md) to create a new AKS cluster.

* Set up the firewall access and communication between the ACR registry and the connected registry by enabling the [dedicated data endpoints.](container-registry-firewall-access-rules.md#enable-dedicated-data-endpoints)

* Set up the connection between the Kubernetes cluster and Azure Arc by following the [quickstart.](quickstart-connect-cluster.md)

* [Install Azure CLI] to connect to Azure and Kubernetes.

* Use the [k8s-extension][k8s-extension] command to manage Kubernetes extensions.

    ```azurecli
    az extension add --name k8s-extension
    ```
* An Azure resource provider is a set of REST operations that enable functionality for a specific Azure service. Register the required [Azure resource providers][azure-resource-provider-requirements] in your subscription and use Azure Arc-enabled Kubernetes:

    ```azurecli
    az provider register --namespace Microsoft.Kubernetes
    az provider register --namespace Microsoft.KubernetesConfiguration
    ```

## Deploy the connected registry arc extension using secure-by-default settings

Once the prerequisites and necessary conditions and components are in place, follow the streamlined approach and securely deploy a connected registry extension on an arc-enabled kubernetes cluster using secure-by-default settings. The secure-by-default settings define the following configuration with HTTPS, Read Only, Trust Distribution, Cert Manager service. Follow the steps for a successful deployment: 

1.	Create the connected registry.
1.	Deploy the connected registry Arc extension.
1.	Verify the connected registry extension deployment is operational. 
1.	Pull an image from the connected registry successfully.

### Create the connected registry and synchronize with ACR

Creating the connected registry to synchronize with ACR is the foundation step for deploying the connected registry Arc extension. 

1. Create the connected registry, which synchronizes with the ACR registry:

    To create a connected registry `myconnectedregistry` that synchronizes with the ACR registry `myacrregistry` in the resource group `myresourcegroup` and the repository `hello-world`, you can run the [az acr connected-registry create] command:
    
    ```azurecli
    az acr connected-registry create --registry myacrregistry \ 
    --name myconnectedregistry \
    --resource-group myresourcegroup \ 
    --repository "hello-world"
    ``` 

>[!NOTE]
> The [az acr connected-registry create] command creates the connected registry with the specified repository. 
> Overwrites actions if the sync scope map named `myconnectedregistry` exists and overwrites properties if the sync token named `myconnectedregistry` exists. 
> The [az acr connected-registry create] command validates a dedicated data endpoint during the creation of the connected registry and provides a command to enable the dedicated data endpoint on the ACR registry if it is not already enabled.

### Deploy the connected registry arc extension on the arc-enabled kubernetes cluster

Deploy the connected registry arc extension to integrate the registry with your AKS cluster, for integration.

1. Generate the Connection String and Protected Settings JSON File

   For secure deployment of the connected registry extension, generate the connection string, including a new password, transport protocol, and create the `protected-settings-extension.json` file required for the extension deployment:

    ```azurecli
    cat << EOF > protected-settings-extension.json
    {
      "connectionString": "$(az acr connected-registry get-settings --name myconnectedregistry \
      --registry myacrregistry --parent-protocol https --generate-password 1 \
      --query ACR_REGISTRY_CONNECTION_STRING --output tsv --yes)"
    }
    EOF
    ```

>[!NOTE]
> The [az acr connected-registry get-settings] command generates the connection string, including the creation of a new password and the specification of the transport protocol.
> Creates and injects the contents of the connection string into the `protected-settings-extension.json` file, a necessary step for the extension deployment.

2. Deploy the connected registry extension

   Deploy the connected registry extension with the specified configuration details using the [az k8s-extension create] command:

    ```azurecli
    az k8s-extension create --cluster-name myarck8scluster \ 
    --cluster-type connectedClusters \
    --extension-type Microsoft.ContainerRegistry.ConnectedRegistry \
    --name myconnectedregistry \
    --resource-group myresourcegroup \ 
    --config service.clusterIP=192.100.100.1 \ 
    --config-protected-file protected-settings-extension.json  
    ```

>[!NOTE]
> The [az k8s-extension create] command deploys the connected registry extension on the Kubernetes cluster with the provided configuration parameters and protected settings file. It ensures secure trust distribution between the connected registry and all client nodes within the cluster and installs the cert-manager service for TLS encryption.

### Verify the connected registry extension deployment

To verify the deployment of the connected registry extension on the arc-enabled Kubernetes cluster, follow the steps:

1. Verify the deployment status

    Run the [az k8s-extension show] command to check the deployment status of the connected registry extension:

    ```azurecli
    az k8s-extension show --name myconnectedregistry \ 
    --cluster-name myarck8scluster \
    --resource-group myresourcegroup \
    --cluster-type connectedClusters
    ```

2. Verify the connected registry status and state

    For each connected registry, you can view the status and state of the connected registry using the [az acr connected-registry list] command:
    
        ```azurecli
        az acr connected-registry list --registry myacrregistry --output table
        ```

    **Example Output**
     ```console
    | NAME | MODE | CONNECTION STATE | PARENT | LOGIN SERVER | LAST SYNC(UTC) |
    |------|------|------------------|--------|--------------|----------------|
    | myconnectedregistry | ReadWrite | online | myacrregistry | myacrregistry.azurecr.io | 2024-05-09 12:00:00 |
    | myreadonlyacr | ReadOnly | offline | myacrregistry | myacrregistry.azurecr.io | 2024-05-09 12:00:00 |
    ```

3. Verify the specific connected registry details

    For details on a specific connected registry, use [az acr connected-registry show] command:

    ```azurecli
    az acr connected-registry show --registry myacrregistry --name myreadonlyacr --output table
    ```

    **Example Output**
    ```console
   | NAME                | MODE      | CONNECTION STATE | PARENT        | LOGIN SERVER             | LAST SYNC(UTC)      | SYNC SCHEDULE | SYNC WINDOW       |
   | ------------------- | --------- | ---------------- | ------------- | ------------------------ | ------------------- | ------------- | ----------------- |
   | myconnectedregistry | ReadWrite | online           | myacrregistry | myacrregistry.azurecr.io | 2024-05-09 12:00:00 | 0 0 * * *     | 00:00:00-23:59:59 |
    ```

>[!NOTE] These commands will verify the state of the extension deployment and provide details on the connected registry's connection status, last sync, sync window, sync schedule, and more.

### Pull an image from the connected registry successfully

To authenticate and pull an image from the locally deployed connected registry within the cluster from a cluster client node, follow the steps:

1. Authenticate and pull the desired image from the connected registry using the [ crictl pull] command:

    ```azurecli
    crictl pull --creds mytoken:password1 IP_address_of_connected_registry
    ```

    For example, to pull the `hello-world:latest` image, you would run:

    ```azurecli
    crictl pull --creds mytoken:password1
    ```

>[!NOTE]
> This command pulls an image from the connected registry by specifying the desired repository. Lear to create a client token [here](container-registry-repository-scoped-permissions#create-token---cli).


## Scenario: Deploy the connected registry Arc extension with HTTPS

The connected registry extension deployment can be further secured by enabling TLS encryption between the connected registry and the client nodes within the cluster.

### Deploy connected registry extension with HTTPS (TLS encryption)

While using a preinstalled cert-manager service on the cluster, you can deploy the connected registry extension with HTTPS (TLS encryption) by following the steps:

1. Edit the command in the Deploying the connected registry extension section and set the `cert-manager.enabled=true` and `cert-manager.install=false` parameters to determine the cert-manager service is installed and enabled:

    ```azurecli
    az k8s-extension create --cluster-name myarck8scluster \ 
    --cluster-type connectedClusters \ 
    --extension-type Microsoft.ContainerRegistry.ConnectedRegistry \ 
    --name myconnectedregistry \ 
    --resource-group myresourcegroup \ 
    --config service.clusterIP=192.100.100.1 \  
    trustDistribution.enabled=true trustDistribution.skipNodeSelector=true cert-manager.enabled=true \ 
    --config-protected-file protected-settings-extension.json 

### Deploy connected registry with kubernetes secret management for TLS encryption 

Follow the [Deploying the connected registry extension](#deploy-the-connected-registry-arc-extension-on-the-arc-enabled-kubernetes-cluster), and add the Kubernetes TLS secret string variable + value pair. 

1. Protected settings file example with secret in JSON format: 

    ```json
    { 
    
    # TLS settings 
    
    tls: 
    
    secret: “k8secret” 
    
    } 
    ```

Now, you can deploy the connected registry extension with HTTPS (TLS encryption) using the kubernetes secret management by configuring variables set to `cert-manager.enabled=false` and `cert-manager.install=false`. With these parameters, the cert-manager isn't installed or enabled since the kubernetes secret is used instead for encryption.  

2. Run the [az k8s-extension create] command for deployment after protected settings file is edited:

    ```azurecli
    az k8s-extension create --cluster-name myarck8scluster \
    --cluster-type connectedClusters \  
    --extension-type  Microsoft.ContainerRegistry.ConnectedRegistry \ 
    --name myconnectedregistry \ 
    --resource-group myresourcegroup \
    --config service.clusterIP=192.100.100.1 trustDistribution.enabled=true \ trustDistribution.skipNodeSelector=true cert-manager.enabled=false cert-manager.install=false \ 
    --config-protected-file protected-settings-extension.json 
    ```

### Deploy the connected registry Arc extension with inherent trust distribution and reject connected registry trust distribution

While using your own kubernetes secret or public certificate and private key pairs, you can deploy the connected registry extension with HTTPS (TLS encryption), inherent trust distribution, and reject connected registry trust distribution.

1. Follow the [Deploying the connected registry extension](#deploy-the-connected-registry-arc-extension-on-the-arc-enabled-kubernetes-cluster), to add either the Kubernetes secret or public certificate, and private key variable + value pairs in the protected settings file in JSON format.

2. Run the [az k8s-extension create] command in [Deploying the connected registry extension](#deploy-the-connected-registry-arc-extension-on-the-arc-enabled-kubernetes-cluster) and set the `trustDistribution.enabled=false`, `trustDistribution.skipNodeSelector=false` parameters to reject connected registry trust distribution:

    ```azurecli
    az k8s-extension create --cluster-name myarck8scluster \ 
    --cluster-type connectedClusters \ 
    --extension-type Microsoft.ContainerRegistry.ConnectedRegistry \ 
    --name myconnectedregistry \ 
    --resource-group myresourcegroup \ 
    --config service.clusterIP==192.100.100.1 trustDistribution.enabled=false trustDistribution.skipNodeSelector=false cert-manager.enabled=false cert-manager.install=false \ 
     --config-protected-file <JSON file path> 
    ```

With these parameters, cert-manager isn't installed or enabled, additionally, the connected registry trust distribution isn't enforced. Instead you're using the cluster provided trust distribution for establishing trust between the connected registry and the client nodes.

### Deploy the connected registry Arc extension with HTTP (no TLS encryption)

The connected registry extension deployment can be further secured with HTTP and no TLS encryption.

1. Follow the [Deploying the connected registry extension](#deploy-the-connected-registry-arc-extension-on-the-arc-enabled-kubernetes-cluster), and edit the [az k8s-extension create] command with`add httpsEnabled=false`. You must also set both `cert-manager.enabled` and `cert-manager.install` values to false. These parameters, disables TLS encryption, additionally disables cert-manager. However trust must establish between the connected registry nodes and the client nodes.  

    ```azurecli
    az k8s-extension create --cluster-name myarck8scluster 
    --cluster-type connectedClusters \  
    --extension-type  Microsoft.ContainerRegistry.ConnectedRegistry \ 
    --name myconnectedregistry \ 
    --resource-group myresourcegroup \
    --config service.clusterIP=192.100.100.1 trustDistribution.enabled=true trustDistribution.skipNodeSelector=true cert-manager.enabled=false cert-manager.install=false HttpsEnabled=false \ 
    --config-protected-file <JSON file path>
    ```

## Scenario: Deploy the connected registry Arc extension with upgrades/rollbacks

### Deploy the connected registry Arc extension with autoupgrade

1. Follow the [Deploying the connected registry extension](#deploy-the-connected-registry-arc-extension-on-the-arc-enabled-kubernetes-cluster) to edit the [az k8s-extension create] command and include the `--auto-upgrade-minor-version true` parameter. This parameter automatically upgrades the extension to the latest version whenever a new version is available. 

    ```azurecli
    az k8s-extension create --cluster-name myarck8scluster \ 
    --cluster-type connectedClusters \ 
    --extension-type  Microsoft.ContainerRegistry.ConnectedRegistry \ 
    --name myconnectedregistry \ 
    --resource-group myresourcegroup \ 
    --config service.clusterIP=192.100.100.1 trustDistribution.enabled=true trustDistribution.skipNodeSelector=true cert-manager.enabled=false cert-manager.install=false HttpsEnabled=false \ 
     --config-protected-file <JSON file path> --auto-upgrade-minor-version true
    ```

### Deploy the connected registry Arc extension with auto rollback

1. Follow the [Deploying the connected registry extension](#deploy-the-connected-registry-arc-extension-on-the-arc-enabled-kubernetes-cluster) to edit the [az k8s-extension update] command and add--version with your desired version. This example uses version 0.6.0. This parameter updates the extension version to the desired pinned version. 

    ```azurecli
    az k8s-extension update --cluster-name myarck8scluster \ 
    --cluster-type connectedClusters \ 
    --extension-type  Microsoft.ContainerRegistry.ConnectedRegistry \ 
    --name myconnectedregistry \ 
    --resource-group myresourcegroup 
    --config service.clusterIP=192.100.100.1 trustDistribution.enabled=true trustDistribution.skipNodeSelector=true cert-manager.enabled=false cert-manager.install=false \ HttpsEnabled=false \ 
    --config-protected-file <JSON file path> --version 0.6.0 
    ```

### Deploy the connected registry arc extension with manual upgrade

1. Follow the [Deploying the connected registry extension](#deploy-the-connected-registry-arc-extension-on-the-arc-enabled-kubernetes-cluster) to edit the [az k8s-extension update] command and add--version with your desired version. This example uses version 0.6.1. This parameter upgrades the extension version to 0.6.1. 

    ```azurecli
    az k8s-extension update --cluster-name myarck8scluster \ 
    --cluster-type connectedClusters \ 
    --name myconnectedregistry \ 
    --resource-group myresourcegroup \ 
    --version 0.6.1 
    ```

## Scenario: Update the connected registry arc extension with synchronization schedule/window

### Update the connected registry to sync every day at midnight

1. Run the [az acr connected-registry update] command to update the connected registry synchronization schedule to occasionally connect and sync every day at midnight with sync window for 4 hours:

    ```azurecli 
    az acr connected-registry update --registry myacrregistry \ 
    --name myconnectedregistry \ 
    --sync-schedule "0 12 * * *" \
    --sync-window PT4H
    ```

### Update the connected registry and sync continuously every minute  

1. Run the [az acr connected-registry update] command to update the connected registry synchronization to connect and sync continuously every minute.  

    ```azurecli 
    az acr connected-registry update --registry myacrregistry 
    --name myconnectedregistry \ 
    --sync-schedule "* * * * *"    
    ```

## Clean up resources

1. By deleting the deployed connected registry extension, you remove the corresponding connected registry pods and configuration settings.   

    ```azurecli
    az k8s-extension delete --name myconnectedregistry 
    --cluster-name myarcakscluster \ 
    --resource-group myresourcegroup \ 
    --cluster-type connectedClusters
    ```   
   
2. By deleting the deployed connected registry extension, you remove the connected registry cloud instance and its configuration details. 

    ```azurecli
    az acr connected-registry delete --name myarcakscluster --resource-group myresourcegroup 
    ```

## Next steps 

> [Known issues: Connected Registry Arc Extension](troubleshoot-connected-registry-arc-cli.md)

-->

[Install Azure CLI]: /cli/azure/install-azure-cli
[k8s-extension]: /cli/azure/k8s-extension
[azure-resource-provider-requirements]: /azure/azure-arc/kubernetes/system-requirements#azure-resource-provider-requirements