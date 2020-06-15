---
title: "Connect an Azure Arc-enabled Kubernetes cluster (Preview)"
services: azure-arc
ms.service: azure-arc
#ms.subservice: azure-arc-kubernetes coming soon
ms.date: 05/19/2020
ms.topic: article
author: mlearned
ms.author: mlearned
description: "Connect an Azure Arc-enabled Kubernetes cluster with Azure Arc"
keywords: "Kubernetes, Arc, Azure, K8s, containers"
ms.custom: references_regions
---

# Connect an Azure Arc-enabled Kubernetes cluster (Preview)

Connect a Kubernetes cluster to Azure Arc.

## Before you begin

Verify you have the following requirements ready:

* A Kubernetes cluster that is up and running. If you do not have an existing Kubernetes cluster, you can use one of the following guides to create a test cluster:
  * Create a Kubernetes cluster using [Kubernetes in Docker (kind)](https://kind.sigs.k8s.io/)
  * Create a Kubernetes cluster using Docker for [Mac](https://docs.docker.com/docker-for-mac/#kubernetes) or [Windows](https://docs.docker.com/docker-for-windows/#kubernetes)
* You'll need a kubeconfig file to access the cluster and cluster-admin role on the cluster for deployment of Arc enabled Kubernetes agents.
* The user or service principal used with `az login` and `az connectedk8s connect` commands must have the 'Read' and 'Write' permissions on the 'Microsoft.Kubernetes/connectedclusters' resource type. The "Azure Arc for Kubernetes Onboarding" role having these permissions can be used for role assignments on the user or service principal used with Azure CLI for onboarding.
* Helm 3 is required for the onboarding the cluster using connectedk8s extension. [Install the latest release of Helm 3](https://helm.sh/docs/intro/install) to meet this requirement.
* Azure CLI version 2.3+ is required for installing the Azure Arc enabled Kubernetes CLI extensions. [Install Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest) or update to the latest version to ensure that you have Azure CLI version 2.3+.
* Install the Arc enabled Kubernetes CLI extensions:
  
  Install the `connectedk8s` extension, which helps you connect Kubernetes clusters to Azure:
  
  ```console
  az extension add --name connectedk8s
  ```
  
  Install the `k8sconfiguration` extension:
  
  ```console
  az extension add --name k8sconfiguration
  ```
  
  If you want to update these extensions later, run the following commands:
  
  ```console
  az extension update --name connectedk8s
  az extension update --name k8sconfiguration
  ```

## Supported regions

* East US
* West Europe

## Network requirements

Azure Arc agents require the following protocols/ports/outbound URLs to function.

* TCP on port 443 --> `https://:443`
* TCP on port 9418 --> `git://:9418`

| Endpoint (DNS)                                                                                               | Description                                                                                                                 |
| ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| `https://management.azure.com`                                                                                 | Required for the agent to connect to Azure and register the cluster                                                        |
| `https://eastus.dp.kubernetesconfiguration.azure.com`, `https://westeurope.dp.kubernetesconfiguration.azure.com` | Data plane endpoint for the agent to push status and fetch configuration information                                      |
| `https://docker.io`                                                                                            | Required to pull container images                                                                                         |
| `https://github.com`, git://github.com                                                                         | Example GitOps repos are hosted on GitHub. Configuration agent requires connectivity to whichever git endpoint you specify. |
| `https://login.microsoftonline.com`                                                                            | Required to fetch and update Azure Resource Manager tokens                                                                                    |
| `https://azurearcfork8s.azurecr.io`                                                                            | Required to pull container images for Azure Arc agents                                                                  |

## Register the two providers for Azure Arc enabled Kubernetes:

```console
az provider register --namespace Microsoft.Kubernetes
Registering is still on-going. You can monitor using 'az provider show -n Microsoft.Kubernetes'

az provider register --namespace Microsoft.KubernetesConfiguration
Registering is still on-going. You can monitor using 'az provider show -n Microsoft.KubernetesConfiguration'
```

Registration is an asynchronous process. Registration may take approximately 10 minutes. You can monitor the registration process with the following commands:

```console
az provider show -n Microsoft.Kubernetes -o table
```

```console
az provider show -n Microsoft.KubernetesConfiguration -o table
```

## Create a Resource Group

Use a resource group to store metadata for your cluster.

First, create a resource group to hold the connected cluster resource.

```console
az group create --name AzureArcTest -l EastUS -o table
```

**Output:**

```console
Location    Name
----------  ------------
eastus      AzureArcTest
```

## Connect a cluster

Next, we will connect our Kubernetes cluster to Azure. The workflow for `az connectedk8s connect` is as follows:

1. Verify connectivity to your Kubernetes cluster: via `KUBECONFIG`, `~/.kube/config`, or `--kube-config`
1. Deploy Azure Arc Agents for Kubernetes using Helm 3, into the `azure-arc` namespace

```console
az connectedk8s connect --name AzureArcTest1 --resource-group AzureArcTest
```

**Output:**

```console
Command group 'connectedk8s' is in preview. It may be changed/removed in a future release.
Helm release deployment succeeded

{
  "aadProfile": {
    "clientAppId": "",
    "serverAppId": "",
    "tenantId": ""
  },
  "agentPublicKeyCertificate": "...",
  "agentVersion": "0.1.0",
  "id": "/subscriptions/57ac26cf-a9f0-4908-b300-9a4e9a0fb205/resourceGroups/AzureArcTest/providers/Microsoft.Kubernetes/connectedClusters/AzureArcTest1",
  "identity": {
    "principalId": null,
    "tenantId": null,
    "type": "None"
  },
  "kubernetesVersion": "v1.15.0",
  "location": "eastus",
  "name": "AzureArcTest1",
  "resourceGroup": "AzureArcTest",
  "tags": {},
  "totalNodeCount": 1,
  "type": "Microsoft.Kubernetes/connectedClusters"
}
```

## Verify connected cluster

List your connected clusters:

```console
az connectedk8s list -g AzureArcTest -o table
```

**Output:**

```console
Command group 'connectedk8s' is in preview. It may be changed/removed in a future release.
Name           Location    ResourceGroup
-------------  ----------  ---------------
AzureArcTest1  eastus      AzureArcTest
```

You can also view this resource on the [Azure portal](https://portal.azure.com/). Once you have the portal open in your browser, navigate to the resource group and the Azure Arc enabled Kubernetes resource based on the resource name and resource group name inputs used earlier in the `az connectedk8s connect` command.

Azure Arc enabled Kubernetes deploys a few operators into the `azure-arc` namespace. You can view these deployments and pods here:

```console
kubectl -n azure-arc get deployments,pods
```

**Output:**

```console
NAME										READY	UP-TO-DATE AVAILABLE AGE
deployment.apps/cluster-metadata-operator	1/1		1			1		 16h
deployment.apps/clusteridentityoperator		1/1		1			1	     16h
deployment.apps/config-agent				1/1		1			1		 16h
deployment.apps/controller-manager			1/1		1			1		 16h
deployment.apps/flux-logs-agent				1/1		1			1		 16h
deployment.apps/metrics-agent			    1/1     1           1        16h
deployment.apps/resource-sync-agent			1/1		1			1		 16h

NAME											READY	STATUS	 RESTART AGE
pod/cluster-metadata-operator-7fb54d9986-g785b  2/2		Running  0		 16h
pod/clusteridentityoperator-6d6678ffd4-tx8hr    3/3     Running  0       16h
pod/config-agent-544c4669f9-4th92               3/3     Running  0       16h
pod/controller-manager-fddf5c766-ftd96          3/3     Running  0       16h
pod/flux-logs-agent-7c489f57f4-mwqqv            2/2     Running  0       16h
pod/metrics-agent-58b765c8db-n5l7k              2/2     Running  0       16h
pod/resource-sync-agent-5cf85976c7-522p5        3/3     Running  0       16h
```

## Azure Arc agents for Kubernetes

Azure Arc enabled Kubernetes consists of a few agents (operators) that run in your cluster deployed to the `azure-arc` namespace.

* `deployment.apps/config-agent`: watches the connected cluster for source control configuration resources applied on the cluster and updates compliance state
* `deployment.apps/controller-manager`: is an operator of operators and orchestrates interactions between Azure Arc components
* `deployment.apps/metrics-agent`: collects metrics of other Arc agents to ensure that these agents are exhibiting optimal performance
* `deployment.apps/cluster-metadata-operator`: gathers cluster metadata - cluster version, node count and Arc agent version
* `deployment.apps/resource-sync-agent`: syncs the above mentioned cluster metadata to Azure
* `deployment.apps/clusteridentityoperator`: Azure Arc enabled Kubernetes currently supports system assigned identity. clusteridentityoperator maintains the managed service identity (MSI) certificate used by other agents for communication with Azure.
* `deployment.apps/flux-logs-agent`: collects logs from the flux operators deployed as a part of source control configuration

## Delete a connected cluster

You can delete a `Microsoft.Kubernetes/connectedcluster` resource using the Azure CLI or Azure portal.


* **Deletion using Azure CLI**: The following Azure CLI command can be used to initiate deletion of the Azure Arc enabled Kubernetes resource.
  ```console
  az connectedk8s delete --name AzureArcTest1 --resource-group AzureArcTest
  ```
  This removes the `Microsoft.Kubernetes/connectedCluster` resource and any associated `sourcecontrolconfiguration` resources in Azure. The Azure CLI uses helm uninstall to remove the agents running on the cluster as well.

* **Deletion on Azure portal**: Deletion of the Azure Arc enabled Kubernetes resource on Azure portal deletes the `Microsoft.Kubernetes/connectedcluster` resource and any associated `sourcecontrolconfiguration` resources in Azure, but it doesn't delete the agents running on the cluster. To delete the agents running on the cluster, run the following command.

  ```console
  az connectedk8s delete --name AzureArcTest1 --resource-group AzureArcTest
  ```

## Next steps

* [Use GitOps in a connected cluster](./use-gitops-connected-cluster.md)
* [Use Azure Policy to govern cluster configuration](./use-azure-policy.md)