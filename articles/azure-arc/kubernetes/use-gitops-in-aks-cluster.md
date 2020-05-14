---
title: "Use GitOps with Azure Kubernetes Service (AKS)"
services: arc-kubernetes
ms.date: 02/21/2020
ms.topic: "Tutorial"
description: ""
keywords: "GitOps, Kubernetes, K8s, Azure, Arc, AKS, Azure Kubernetes Service, containers"
---

# Enable source control config for Azure Kubernetes Services (AKS)

GitOps configuration can be enabled for Azure Kubernetes Service (AKS) clusters by following the instructions here.

## Supported AKS types

The Config Agent on AKS cluster requires a Service Principal (SPN) for authentication, thus you can enable this capability only for SPN-based AKS clusters. [AKS clusters created with Managed Identity](https://docs.microsoft.com/azure/aks/use-managed-identity#create-an-aks-cluster-with-managed-identities) (MSI) are not supported yet.

You can discover the AKS cluster authentication type using az aks CLI.  If `clientId` is a GUID, then this is a SPN-based cluster; if `cliendId` is the string "msi", then this is a MSI-based cluster.

Example of SPN-based AKS cluster:

```console
az aks show --name "MyAKSCluster" -g "MyResourceGroup"

  ...  
  "servicePrincipalProfile": {
    "clientId": "d384f782-3z46-428f-a91b-1d8ab4e1e96j"
  }
  ...
```

## Supported AKS cluster regions

1. East US
2. West Europe

## Register providers

If you started using Azure Arc enabled Kubernetes before AKS support was added, you need to re-register the Azure service providers. If you are unsure, register the providers anyway!

```console
az provider register --namespace Microsoft.Kubernetes
Registering is still on-going. You can monitor using 'az provider show -n Microsoft.Kubernetes'

az provider register --namespace Microsoft.KubernetesConfiguration
Registering is still on-going. You can monitor using 'az provider show -n Microsoft.KubernetesConfiguration'
```

Registration is an asynchronous process. While registration should complete quickly (within 10 minutes). You may monitor registration process If you do not see registration state progress, reach out to <haikueng@microsoft.com>.

```console
az provider show -n Microsoft.Kubernetes -o table
```

**Output:**

```console
Namespace             RegistrationPolicy    RegistrationState
--------------------  --------------------  -------------------
Microsoft.Kubernetes  RegistrationRequired  Registered
```

```console
az provider show -n Microsoft.KubernetesConfiguration -o table
```

**Output:**

```console
Namespace                          RegistrationPolicy    RegistrationState
---------------------------------  --------------------  -------------------
Microsoft.KubernetesConfiguration  RegistrationRequired  Registered
```

## Install config agent

Azure Kubernetes config helm chart is stored in Azure Container Registry (ACR). Add this repo to your Helm configuration.

Add Azure K8s config repo to your local Helm client:

```console
helm repo add azurearcfork8s https://azurearcfork8s.azurecr.io/helm/v1/repo
```

Retrieve your tenantId and subscriptionId for your current Azure account and set the appropriate environment variables; also choose the AKS cluster that you would like to target for onboarding:

```console
az account show
export AZURE_K8S_ONBOARDING_TENANT=92f988bf-86f1-41af-91ab-2d7cd011db49
export SUBSCRIPTION_ID=57ac26cf-a9f0-4908-b300-9a4e9a0fb205
export LOCATION=eastus # Supported prod regions: eastus, westeurope

az aks list -o table
export RESOURCE_GROUP=managedclusterGroup
export MANAGED_CLUSTER_NAME=azure-k8s1
```

Validate that your environment is configured and ready to go! All values should be filled out:

```console
echo "subscriptionId=${SUBSCRIPTION_ID}"
echo "resourceGroupName=${RESOURCE_GROUP}"
echo "resourceName=${MANAGED_CLUSTER_NAME}"
echo "location=${LOCATION}"
echo "tenantId=${AZURE_K8S_ONBOARDING_TENANT}"
```

Install the Azure Kubernetes configuration agent:

```console
helm upgrade azure-k8s-config azurearcfork8s/azure-k8s-config --install --set global.subscriptionId=${SUBSCRIPTION_ID},global.resourceGroupName=${RESOURCE_GROUP} --set global.resourceName=${MANAGED_CLUSTER_NAME},global.location=${LOCATION} --set global.tenantId=${AZURE_K8S_ONBOARDING_TENANT}
```

**Output:**

```console
Release "azure-k8s-config" does not exist. Installing it now.
NAME: azure-k8s-config
LAST DEPLOYED: 2019-01-12 10:58:47.208546 -0700 PDT m=+0.294581782
NAMESPACE: default
STATUS: deployed
```

## Apply a GitOps configuration using Azure CLI

Using the Azure CLI extension for `k8sconfiguration`, let's link an AKS managed cluster to an example git repository. We will give this configuration a name `cluster-config`, instruct the agent to deploy the operator in the `cluster-config` namespace, and give the operator `cluster-admin` permissions.

Be sure to update `k8sconfiguration` CLI version to 0.1.1 or above. [Install or update CLI extensions](./install-cli-extension.md)

```console
az k8sconfiguration create \
    --name cluster-config \
    --cluster-name ${MANAGED_CLUSTER_NAME} --resource-group ${RESOURCE_GROUP} \
    --operator-instance-name cluster-config --operator-namespace cluster-config \
    --repository-url git://github.com/Azure/arc-k8s-demo.git \
    --cluster-type managedclusters
```

When configuring an AKS cluster, be sure to pass the CLI argument `--cluster-type managedclusters`.

### Additional Parameters

To customize the creation of configuration, [learn about additional parameters you may use](./use-gitops-in-connected-cluster.md#additional-parameters).

## Apply configuration from a private git repository

If you are using a private git repo, then you need to perform one more task to close the loop: you need to add the public key that was generated by `flux` as a **Deploy key** in the repo.

[See this document for instructions](./use-gitops-in-connected-cluster.md#apply-configuration-from-a-private-git-repository).

## Next

* Return to the [README](../README.md)
* [Use GitOps in a connected cluster (has info that also applies to AKS cluster)](./use-gitops-in-connected-cluster.md)
* [Use Azure Policy to govern cluster configuration](./use-azure-policy.md)
