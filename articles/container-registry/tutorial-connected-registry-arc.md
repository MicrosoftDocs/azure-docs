---
title: "Secure and deploy Connected registry Arc extension"
description: "Learn to secure the Connected registry Arc extension deployment with HTTPS, TLS, optional no TLS, BYO certificate, and inherent trust."
author: tejaswikolli-web
ms.author: tejaswikolli
ms.service: azure-container-registry
ms.topic: tutorial  #Don't change.
ms.date: 06/17/2024

#customer intent: Learn how to secure and deploy the Connected registry extension with HTTPS, TLS encryption, and upgrades/rollbacks to secure the extension deployment. 

---

# Tutorial: Secure and deploy Connected registry Arc extension

The Connected registry extension deployment can be secured with HTTPS, Transport Layer Security (TLS) encryption, and inherent trust distribution.

The Connected registry is a managed service that enables customers to securely manage and access containerized workloads across multiple locations, including on-premises and remote sites. The Connected registry integrates with Azure Arc, providing a unified lifecycle management experience for Kubernetes-based containerized workloads.

Follow the [quickstart][quickstart] to create an Azure Arc-enabled Kubernetes cluster. Deploying Secure-by-default settings imply the following configuration is being used: HTTPS, Read Only, Trust Distribution, Cert Manager service.

In this tutorial, you:

> [!div class="checklist"]
> - [Deploy Connected registry extension using preinstalled cert-manager.](#deploy-connected-registry-extension-using-preinstalled-cert-manager)
> - [Deploy Connected registry extension using Bring Your Own Certificate (BYOC).](#deploy-connected-registry-extension-using-bring-your-own-certificate-byoc)
> - [Deploy Connected registry with kubernetes secret management.](#deploy-connected-registry-with-kubernetes-secret-management)
> - [Deploy the Connected registry Arc extension with inherent trust distribution or reject Connected registry trust distribution.](#deploy-the-connected-registry-arc-extension-with-inherent-trust-distribution-and-reject-connected-registry-trust-distribution)

## Prerequisites

To complete this tutorial, you need:

* Create or use an existing Azure Container Registry (ACR) with [quickstart.][create-acr]

* Set up the firewall access and communication between the ACR registry and the Connected registry by enabling the [dedicated data endpoints.][dedicated data endpoints]

* Create or use an existing Azure Kubernetes Service (AKS) cluster with the [tutorial.][tutorial-aks-cluster]

* Set up the connection between the Kubernetes cluster and Azure Arc by following the [quickstart.][quickstart-connect-cluster]

* Set up the [Azure CLI][Install Azure CLI] to connect to Azure and Kubernetes.

* Use the [k8s-extension][k8s-extension] command to manage Kubernetes extensions.

    ```azurecli
    az extension add --name k8s-extension
    ```
* Register the required [Azure resource providers][azure-resource-provider-requirements] in your subscription and use Azure Arc-enabled Kubernetes:

    ```azurecli
    az provider register --namespace Microsoft.Kubernetes
    az provider register --namespace Microsoft.KubernetesConfiguration
    ```
    An Azure resource provider is a set of REST operations that enable functionality for a specific Azure service. 

* Follow the [quickstart][quickstart] to create an Azure Arc-enabled Kubernetes cluster. Apply Secure-by-default settings imply the following configuration is being used: HTTPS, Read Only, Trust Distribution, Cert Manager service. 

## Deploy Connected registry extension using preinstalled cert-manager

While using a preinstalled cert-manager service on the cluster, you can deploy the Connected registry extension with HTTPS (TLS encryption) by following the steps:

1. Run the [az-k8s-extension-create][az-k8s-extension-create] command in the [quickstart][quickstart] and set the `cert-manager.enabled=true` and `cert-manager.install=false` parameters to determine the cert-manager service is installed and enabled:

    ```azurecli
    az k8s-extension create --cluster-name myarck8scluster \ 
    --cluster-type connectedClusters \ 
    --extension-type Microsoft.ContainerRegistry.ConnectedRegistry \ 
    --name myconnectedregistry \ 
    --resource-group myresourcegroup \ 
    --config service.clusterIP=192.100.100.1 \ 
    --config cert-manager.install=false \ 
    --config-protected-file protected-settings-extension.json
    ```

## Deploy Connected registry extension using Bring Your Own Certificate (BYOC)

Bring Your Own Certificate (BYOC) allows customers to use their own public certificate and private key pair for HTTPS (TLS encryption) when deploying the Connected registry extension.

>[!NOTE] 
>BYOC is applicable for customers who bring their own certificate that is already trusted by their Kubernetes nodes. It is not recommended to manually update the nodes to trust the certificates.

Follow the [quickstart][quickstart] and add the public certificate and private key string variable + value pair. 

1. Create self-signed SSL cert with connected-registry service IP as the SAN

```bash
  mkdir /certs
```

```bash
openssl req -newkey rsa:4096 -nodes -sha256 -keyout /certs/mycert.key -x509 -days 365 -out /certs/mycert.crt -addext "subjectAltName = IP:<service IP>"
```

2. Get base64 encoded strings of these cert files

```bash
export TLS_CRT=$(cat mycert.crt | base64 -w0) 
export TLS_KEY=$(cat mycert.key | base64 -w0) 
```

3. Protected settings file example with secret in JSON format: 

> [!NOTE]
> The public certificate and private key pair must be encoded in base64 format and added to the protected settings file.
    
```json   
    {
    "connectionString": "[connection string here]",
    "tls.crt": $TLS_CRT,
    "tls.key": $TLS_KEY,
    "tls.cacrt": $TLS_CRT
    } 
```

2. Now, you can deploy the Connected registry extension with HTTPS (TLS encryption) using the public certificate and private key pair management by configuring variables set to `cert-manager.enabled=false` and `cert-manager.install=false`. With these parameters, the cert-manager isn't installed or enabled since the public certificate and private key pair is used instead for encryption.  

3. Run the [az-k8s-extension-create][az-k8s-extension-create] command for deployment after protected settings file is edited:

    ```azurecli
    az k8s-extension create --cluster-name myarck8scluster \
    --cluster-type connectedClusters \  
    --extension-type  Microsoft.ContainerRegistry.ConnectedRegistry \ 
    --name myconnectedregistry \ 
    --resource-group myresourcegroup \
    --config service.clusterIP=192.100.100.1 \
    --config cert-manager.enabled=false \
    --config cert-manager.install=false \ 
    --config-protected-file protected-settings-extension.json 
    ```

## Deploy Connected registry with kubernetes secret management

Follow the [quickstart][quickstart] and add the Kubernetes TLS secret string variable + value pair. 

1. Create self-signed SSL cert with connected-registry service IP as the SAN

```bash
mkdir /certs
```

```bash
openssl req -newkey rsa:4096 -nodes -sha256 -keyout /certs/mycert.key -x509 -days 365 -out /certs/mycert.crt -addext "subjectAltName = IP:<service IP>"
```

2. Get base64 encoded strings of these cert files

```bash
export TLS_CRT=$(cat mycert.crt | base64 -w0) 
export TLS_KEY=$(cat mycert.key | base64 -w0) 
```

3. Create k8s secret

```bash
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Secret
metadata:
  name: k8secret
  type: kubernetes.io/tls
data:
  ca.crt: $TLS_CRT
  tls.crt: $TLS_CRT
  tls.key: $TLS_KEY
EOF
```

4. Protected settings file example with secret in JSON format: 

    ```json
        { 
        "connectionString": "[connection string here]",
        "tls.secret": “k8secret” 
        } 
    ```

Now, you can deploy the Connected registry extension with HTTPS (TLS encryption) using the kubernetes secret management by configuring variables set to `cert-manager.enabled=false` and `cert-manager.install=false`. With these parameters, the cert-manager isn't installed or enabled since the kubernetes secret is used instead for encryption.  

5. Run the [az-k8s-extension-create][az-k8s-extension-create] command for deployment after protected settings file is edited:

    ```azurecli
    az k8s-extension create --cluster-name myarck8scluster \
    --cluster-type connectedClusters \  
    --extension-type  Microsoft.ContainerRegistry.ConnectedRegistry \ 
    --name myconnectedregistry \ 
    --resource-group myresourcegroup \
    --config service.clusterIP=192.100.100.1 \
    --config cert-manager.enabled=false \
    --config cert-manager.install=false \ 
    --config-protected-file protected-settings-extension.json 
    ```

## Deploy the Connected registry Arc extension with inherent trust distribution and reject Connected registry trust distribution

While using your own kubernetes secret or public certificate and private key pairs, you can deploy the Connected registry extension with HTTPS (TLS encryption), inherent trust distribution, and reject Connected registry trust distribution.

1. Follow the [quickstart][quickstart] to add either the Kubernetes secret or public certificate, and private key variable + value pairs in the protected settings file in JSON format.

2. Run the [az-k8s-extension-create][az-k8s-extension-create] command in [quickstart][quickstart] and set the `trustDistribution.enabled=false`, `trustDistribution.skipNodeSelector=false` parameters to reject Connected registry trust distribution:
    
    ```azurecli
    az k8s-extension create --cluster-name myarck8scluster \ 
    --cluster-type connectedClusters \ 
    --extension-type Microsoft.ContainerRegistry.ConnectedRegistry \ 
    --name myconnectedregistry \ 
    --resource-group myresourcegroup \ 
    --config service.clusterIP=192.100.100.1 \
    --config trustDistribution.enabled=false \ 
    --config cert-manager.enabled=false \
    --config cert-manager.install=false \ 
    --config-protected-file <JSON file path> 
    ```

With these parameters, cert-manager isn't installed or enabled, additionally, the Connected registry trust distribution isn't enforced. Instead you're using the cluster provided trust distribution for establishing trust between the Connected registry and the client nodes.

## Clean up resources

By deleting the deployed Connected registry extension, you remove the corresponding Connected registry pods and configuration settings.   

1. Run the [az-k8s-extension-delete][az-k8s-extension-delete] command to delete the Connected registry extension:

    ```azurecli
    az k8s-extension delete --name myconnectedregistry 
    --cluster-name myarcakscluster \ 
    --resource-group myresourcegroup \ 
    --cluster-type connectedClusters
    ```   

2. Run the [az acr connected-registry delete][az-acr-connected-registry-delete] command to delete the Connected registry:

    ```azurecli 
    az acr connected-registry delete --registry myacrregistry \ 
    --name myconnectedregistry \ 
    --resource-group myresourcegroup
    ```

By deleting the Connected registry extension and the Connected registry, you remove all the associated resources and configurations.

## Next steps -or- Related content

> [!div class="nextstepaction"]

> [Enable Connected registry with Azure arc CLI][quickstart]
> [Upgrade Connected registry with Azure arc](tutorial-connected-registry-upgrade.md)
> [Sync Connected registry with Azure arc in Scheduled window](tutorial-connected-registry-sync.md)
> [Troubleshoot Connected registry with Azure arc](troubleshoot-connected-registry-arc.md)
> [Glossary of terms](connected-registry-glossary.md)

<!-- LINKS - internal -->
[create-acr]: container-registry-get-started-azure-cli.md
[dedicated data endpoints]: container-registry-firewall-access-rules.md#enable-dedicated-data-endpoints
[Install Azure CLI]: /cli/azure/install-azure-cli
[k8s-extension]: /cli/azure/k8s-extension
[azure-resource-provider-requirements]: /azure/azure-arc/kubernetes/system-requirements#azure-resource-provider-requirements
[quickstart-connect-cluster]: /azure/azure-arc/kubernetes/quickstart-connect-cluster
[tutorial-aks-cluster]: /azure/aks/tutorial-kubernetes-deploy-cluster?tabs=azure-cli
[quickstart]: quickstart-connected-registry-arc-cli.md

<!-- LINKS - external -->
[az-k8s-extension-create]: /cli/azure/k8s-extension#az-k8s-extension-create
[az-k8s-extension-delete]: /cli/azure/k8s-extension#az-k8s-extension-delete
[az-acr-connected-registry-delete]: /cli/azure/acr/connected-registry#az-acr-connected-registry-delete