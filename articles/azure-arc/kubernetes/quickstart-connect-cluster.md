---
title: 'Quickstart: Connect an existing Kubernetes cluster to Azure Arc'
description: "In this quickstart, learn how to connect an Azure Arc enabled Kubernetes cluster." 
author: v-hhunter
ms.author: v-hhunter
ms.service: azure-arc
ms.topic: quickstart
ms.date: 02/18/2021
ms.custom: template-quickstart
keywords: "Kubernetes, Arc, Azure, cluster"
---

# Quickstart: Connect an existing Kubernetes cluster to Azure Arc 

Now that you've read the benefits Azure Arc enabled Kubernetes clusters, let's connect an existing Kubernetes cluster to Azure Arc. For a conceptual take on connecting clusters to Azure Arc, see the [Azure Arc enabled Kubernetes Agent Architecture article](./conceptual-agent-architecture.md).

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* An up-and-running Kubernetes cluster.
* A kubeconfig file.
* 'Read' and 'Write' permissions for the user or service principal used with `az login` and `az connectedk8s connect` commands on the `Microsoft.Kubernetes/connectedclusters` resource type.
* [Latest release of Helm 3](https://helm.sh/docs/intro/install).
* [!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]
* If you prefer, install [Azure CLI 2.15+](/cli/azure/install-azure-cli) to run the CLI reference commands.
* Azure Arc agents network requirements:  
    * TCP on port 443: `https://:443`
    * TCP on port 9418: `git://:9418`

## Install the Azure Arc enabled Kubernetes CLI extensions

1. Enter the following commands:
    ```azurecli
    az extension add --name connectedk8s
    az extension add --name k8sconfiguration
    ```

## Register the two providers for Azure Arc enabled Kubernetes

1. Enter the following commands:
    ```azurecli
    az provider register --namespace Microsoft.Kubernetes
    az provider register --namespace Microsoft.KubernetesConfiguration
    ```
2. Monitor the registration process. Registration may take up to 10 minutes.
    ```azurecli
    az provider show -n Microsoft.Kubernetes -o table
    az provider show -n Microsoft.KubernetesConfiguration -o table    
    ```

## Create a resource group

1. Create a resource group:
    ```console
    az group create --name AzureArcTest -l EastUS -o table
    ```

    **Output:**

    ```console
    Location    Name
    ----------  ------------
    eastus      AzureArcTest
    ```

## Connect an existing Kubernetes cluster

1. Connect your Kubernetes cluster using the following command:
    ```azurecli
    az connectedk8s connect
    ```
1. Verify connectivity to your Kubernetes cluster using one of the following:
   * `KUBECONFIG`
   * `~/.kube/config`
   * `--kube-config`
1. Deploy Azure Arc agents for Kubernetes using Helm 3 into the `azure-arc` namespace.
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
      "agentPublicKeyCertificate": "xxxxxxxxxxxxxxxxxxx",
      "agentVersion": null,
      "connectivityStatus": "Connecting",
      "distribution": "gke",
      "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/AzureArcTest/providers/Microsoft.Kubernetes/connectedClusters/AzureArcTest1",
      "identity": {
        "principalId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        "tenantId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        "type": "SystemAssigned"
      },
      "infrastructure": "gcp",
      "kubernetesVersion": null,
      "lastConnectivityTime": null,
      "location": "eastus",
      "managedIdentityCertificateExpirationTime": null,
      "name": "AzureArcTest1",
      "offering": null,
      "provisioningState": "Succeeded",
      "resourceGroup": "AzureArcTest",
      "tags": {},
      "totalCoreCount": null,
      "totalNodeCount": null,
      "type": "Microsoft.Kubernetes/connectedClusters"
    }
    ```

## Verify cluster connection

1. View a list of your connected clusters with the following command:
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

> [!NOTE]
> After onboarding the cluster, it takes around 5 to 10 minutes for the cluster metadata (cluster version, agent version, number of nodes, etc.) to surface on the overview page of the Azure Arc enabled Kubernetes resource in Azure portal.


## Connect you Kubernetes cluster using an outbound proxy server

If your cluster is behind an outbound proxy server, Azure CLI and the Azure Arc enabled Kubernetes agents need to route their requests via the [outbound proxy server](../connect-cluster#connect-using-an-outbound-proxy-server). 




<!-- 7. Clean up resources
Required. If resources were created during the quickstart. If no resources were created, 
state that there are no resources to clean up in this section.
-->

## Clean up resources

You can delete the `Microsoft.Kubernetes/connectedcluster` using the Azure CLI or Azure portal.

### Using Azure CLI

You can remove the `Microsoft.Kubernetes/connectedcluster` resource, any associated `sourcecontrolConfiguration` resources, *and* any agents running on the cluster using Azure CLI.

1. Delete the Azure Arc enabled Kubernetes resource:
    ```azurecli
    az connectedk8s delete --name AzureArcTest1 --resource-group AzureArcTest
    ```
1. Use `helm uninstall` to remove agents running on the cluster.

### Using Azure portal

Deleting using Azure portal removes the `Microsoft.Kubernetes/connectedcluster` resource and any associated `sourcecontrolConfiguration` resources, but *does not* remove any agents running on the cluster.

1. Run the following command:
    ```console
    az connectedk8s delete --name AzureArcTest1 --resource-group AzureArcTest
    ```
## Next steps

Advance to the next article to learn how to deploy configurations to your connected Kubernetes cluster using GitOps.
> [!div class="nextstepaction"]
> [Deploy configurations using Gitops](use-gitops-connected-cluster.md)

