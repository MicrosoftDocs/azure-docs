---
title: 'Quickstart: Connect an existing Kubernetes cluster to Azure Arc'
description: "In this quickstart, learn how to connect an Azure Arc enabled Kubernetes cluster." 
author: shashankbarsin
ms.author: shasb
ms.service: azure-arc
ms.topic: quickstart
ms.date: 02/18/2021
ms.custom: template-quickstart
keywords: "Kubernetes, Arc, Azure, cluster"
---

# Quickstart: Connect an existing Kubernetes cluster to Azure Arc 

In this quickstart, we'll reap the benefits of Azure Arc enabled Kubernetes and connect an existing Kubernetes cluster to Azure Arc. For a conceptual take on connecting clusters to Azure Arc, see the [Azure Arc enabled Kubernetes Agent Architecture article](./conceptual-agent-architecture.md).

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../includes/azure-cli-prepare-your-environment.md)]

* Verify you have:
    * An up-and-running Kubernetes cluster.
    * A `kubeconfig` file.
    * 'Read' and 'Write' permissions for the user or service principal used with `az login` and `az connectedk8s connect` commands on the `Microsoft.Kubernetes/connectedclusters` resource type.
* Install the [latest release of Helm 3](https://helm.sh/docs/intro/install).
* Install the following Azure Arc enabled Kubernetes CLI extensions:
  
  ```azurecli
  az extension add --name connectedk8s
  az extension add --name k8sconfiguration
  ```
  * To update these extensions to the latest version, run the following commands:
  
  ```azurecli
  az extension update --name connectedk8s
  az extension update --name k8sconfiguration
  ```


>[!NOTE]
>**Supported regions:**
>* East US
>* West Europe

## Meet network requirements

>[!IMPORTANT]
>Azure Arc agents require the following protocols/ports/outbound URLs to function:
>* TCP on port 443: `https://:443`
>* TCP on port 9418: `git://:9418`
  
| Endpoint (DNS) | Description |  
| ----------------- | ------------- |  
| `https://management.azure.com`                                                                                 | Required for the agent to connect to Azure and register the cluster.                                                        |  
| `https://eastus.dp.kubernetesconfiguration.azure.com`, `https://westeurope.dp.kubernetesconfiguration.azure.com` | Data plane endpoint for the agent to push status and fetch configuration information.                                      |  
| `https://login.microsoftonline.com`                                                                            | Required to fetch and update Azure Resource Manager tokens.                                                                                    |  
| `https://mcr.microsoft.com`                                                                            | Required to pull container images for Azure Arc agents.                                                                  |  
| `https://eus.his.arc.azure.com`, `https://weu.his.arc.azure.com`                                                                            |  Required to pull system-assigned Managed Service Identity (MSI) certificates.                                                                  |


## Install the Azure Arc enabled Kubernetes CLI extensions

Enter the following commands:  

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

Create a resource group:  

```console
az group create --name AzureArcTest -l EastUS -o table
```

```output
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
1. Connect your Kubernetes cluster to Azure Arc using the following command:
    ```console
    az connectedk8s connect --name AzureArcTest1 --resource-group AzureArcTest
    ```

    ```output
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

View a list of your connected clusters with the following command:  

```console
az connectedk8s list -g AzureArcTest -o table
```

```output
Command group 'connectedk8s' is in preview. It may be changed/removed in a future release.
Name           Location    ResourceGroup
-------------  ----------  ---------------
AzureArcTest1  eastus      AzureArcTest
```

> [!NOTE]
> After onboarding the cluster, it takes around 5 to 10 minutes for the cluster metadata (cluster version, agent version, number of nodes, etc.) to surface on the overview page of the Azure Arc enabled Kubernetes resource in Azure portal.

## Connect using an outbound proxy server

If your cluster is behind an outbound proxy server, Azure CLI and the Azure Arc enabled Kubernetes agents need to route their requests via the outbound proxy server. 

1. Verify you have the 0.2.5+ version of the `connectedk8s` extension installed on your machine.

    ```console
    az -v
    ```
    * Run the [prerequisite extension update commands](#before-you-begin) to get the latest version of the necessary extensions on your machine.


2. Set the environment variables needed for Azure CLI to use the outbound proxy server:

    * If you are using bash, run the following command with appropriate values:

        ```bash
        export HTTP_PROXY=<proxy-server-ip-address>:<port>
        export HTTPS_PROXY=<proxy-server-ip-address>:<port>
        export NO_PROXY=<cluster-apiserver-ip-address>:<port>
        ```

    * If you are using PowerShell, run the following command with appropriate values:

        ```powershell
        $Env:HTTP_PROXY = "<proxy-server-ip-address>:<port>"
        $Env:HTTPS_PROXY = "<proxy-server-ip-address>:<port>"
        $Env:NO_PROXY = "<cluster-apiserver-ip-address>:<port>"
        ```

3. Run the connect command with proxy parameters specified:

    ```console
    az connectedk8s connect -n <cluster-name> -g <resource-group> --proxy-https https://<proxy-server-ip-address>:<port> --proxy-http http://<proxy-server-ip-address>:<port> --proxy-skip-range <excludedIP>,<excludedCIDR> --proxy-cert <path-to-cert-file>
    ```

> [!NOTE]
> * Specify `excludedCIDR` under `--proxy-skip-range` to ensure in-cluster communication is not broken for the agents.
> * `--proxy-http`, `--proxy-https`, and `--proxy-skip-range` are expected for most outbound proxy environments. `--proxy-cert` is *only* required you need to inject trusted certificates from proxy into trusted certificate store of agent pods.
> * The above proxy specification is currently applied only for Azure Arc agents, not for the flux pods used in `sourceControlConfiguration`. The Azure Arc enabled Kubernetes team is actively working on this feature.

## View Azure Arc agents for Kubernetes

Azure Arc enabled Kubernetes deploys a few operators into the `azure-arc` namespace. 

1. View these deployments and pods using:

    ```console
    kubectl -n azure-arc get deployments,pods
    ```

1. Verify all pods are in a `Running` state.

    ```output
    NAME                                        READY      UP-TO-DATE  AVAILABLE  AGE
    deployment.apps/cluster-metadata-operator     1/1             1        1      16h
    deployment.apps/clusteridentityoperator       1/1             1        1      16h
    deployment.apps/config-agent                  1/1             1        1      16h
    deployment.apps/controller-manager            1/1             1        1      16h
    deployment.apps/flux-logs-agent               1/1             1        1      16h
    deployment.apps/metrics-agent                 1/1             1        1      16h
    deployment.apps/resource-sync-agent           1/1             1        1      16h

    NAME                                           READY    STATUS   RESTART AGE
    pod/cluster-metadata-operator-7fb54d9986-g785b  2/2     Running  0       16h
    pod/clusteridentityoperator-6d6678ffd4-tx8hr    3/3     Running  0       16h
    pod/config-agent-544c4669f9-4th92               3/3     Running  0       16h
    pod/controller-manager-fddf5c766-ftd96          3/3     Running  0       16h
    pod/flux-logs-agent-7c489f57f4-mwqqv            2/2     Running  0       16h
    pod/metrics-agent-58b765c8db-n5l7k              2/2     Running  0       16h
    pod/resource-sync-agent-5cf85976c7-522p5        3/3     Running  0       16h
    ```

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

Deleting the `Microsoft.Kubernetes/connectedcluster` resource using Azure portal removes any associated `sourcecontrolConfiguration` resources, but *does not* remove any agents running on the cluster.

Run the following command:  

    ```console
    az connectedk8s delete --name AzureArcTest1 --resource-group AzureArcTest
    ```

## Next steps

Advance to the next article to learn how to deploy configurations to your connected Kubernetes cluster using GitOps.
> [!div class="nextstepaction"]
> [Deploy configurations using Gitops](use-gitops-connected-cluster.md)
