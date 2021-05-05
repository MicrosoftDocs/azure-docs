---
title: 'Quickstart: Connect an existing Kubernetes cluster to Azure Arc'
description: "In this quickstart, learn how to connect an Azure Arc enabled Kubernetes cluster." 
author: mgoedtel
ms.author: magoedte
ms.service: azure-arc
ms.topic: quickstart
ms.date: 03/03/2021
ms.custom: template-quickstart, references_regions, devx-track-azurecli
keywords: "Kubernetes, Arc, Azure, cluster"
---

# Quickstart: Connect an existing Kubernetes cluster to Azure Arc 

In this quickstart, we'll reap the benefits of Azure Arc enabled Kubernetes and connect an existing Kubernetes cluster to Azure Arc. For a conceptual take on connecting clusters to Azure Arc, see the [Azure Arc enabled Kubernetes Agent Architecture article](./conceptual-agent-architecture.md).

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../../includes/azure-cli-prepare-your-environment.md)]

* An up-and-running Kubernetes cluster. If you don't have one, you can create a cluster using one of these options:
    * [Kubernetes in Docker (KIND)](https://kind.sigs.k8s.io/)
    * Create a Kubernetes cluster using Docker for [Mac](https://docs.docker.com/docker-for-mac/#kubernetes) or [Windows](https://docs.docker.com/docker-for-windows/#kubernetes)
    * Self-managed Kubernetes cluster using [Cluster API](https://cluster-api.sigs.k8s.io/user/quick-start.html)
    * If you want to connect a OpenShift cluster to Azure Arc, you need to execute the following command just once on your cluster before running `az connectedk8s connect`:
        
        ```console
        oc adm policy add-scc-to-user privileged system:serviceaccount:azure-arc:azure-arc-kube-aad-proxy-sa
        ```

    >[!NOTE]
    > The cluster needs to have at least one node of operating system and architecture type `linux/amd64`. Clusters with only `linux/arm64` nodes aren't yet supported.
    
* A `kubeconfig` file and context pointing to your cluster.
* 'Read' and 'Write' permissions on the Azure Arc enabled Kubernetes resource type (`Microsoft.Kubernetes/connectedClusters`).

* Install the [latest release of Helm 3](https://helm.sh/docs/intro/install).

* [Install or upgrade Azure CLI](/cli/azure/install-azure-cli) to version >= 2.16.0
* Install the `connectedk8s` Azure CLI extension of version >= 1.0.0:
  
  ```azurecli
  az extension add --name connectedk8s
  ```

>[!TIP]
> If the `connectedk8s` extension is already installed, update it to the latest version using the following command - `az extension update --name connectedk8s`

>[!NOTE]
>The list of regions supported by Azure Arc enabled Kubernetes can be found [here](https://azure.microsoft.com/global-infrastructure/services/?products=azure-arc).

>[!NOTE]
> If you want to use custom locations on the cluster, then use East US or West Europe regions for connecting your cluster as custom locations is only available in these regions as of now. All other Azure Arc enabled Kubernetes features are available in all regions listed above.

## Meet network requirements

>[!IMPORTANT]
>Azure Arc agents require the following protocols/ports/outbound URLs to function:
>* TCP on port 443: `https://:443`
>* TCP on port 9418: `git://:9418`
  
| Endpoint (DNS) | Description |  
| ----------------- | ------------- |  
| `https://management.azure.com`                                                                                 | Required for the agent to connect to Azure and register the cluster.                                                        |  
| `https://<region>.dp.kubernetesconfiguration.azure.com` | Data plane endpoint for the agent to push status and fetch configuration information.                                      |  
| `https://login.microsoftonline.com`                                                                            | Required to fetch and update Azure Resource Manager tokens.                                                                                    |  
| `https://mcr.microsoft.com`                                                                            | Required to pull container images for Azure Arc agents.                                                                  |  
| `https://eus.his.arc.azure.com`, `https://weu.his.arc.azure.com`, `https://wcus.his.arc.azure.com`, `https://scus.his.arc.azure.com`, `https://sea.his.arc.azure.com`, `https://uks.his.arc.azure.com`, `https://wus2.his.arc.azure.com`, `https://ae.his.arc.azure.com`, `https://eus2.his.arc.azure.com`, `https://ne.his.arc.azure.com` |  Required to pull system-assigned Managed Service Identity (MSI) certificates.                                                                  |

## Register providers for Azure Arc enabled Kubernetes

1. Enter the following commands:
    ```azurecli
    az provider register --namespace Microsoft.Kubernetes
    az provider register --namespace Microsoft.KubernetesConfiguration
    az provider register --namespace Microsoft.ExtendedLocation
    ```
2. Monitor the registration process. Registration may take up to 10 minutes.
    ```azurecli
    az provider show -n Microsoft.Kubernetes -o table
    az provider show -n Microsoft.KubernetesConfiguration -o table
    az provider show -n Microsoft.ExtendedLocation -o table
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

1. Connect your Kubernetes cluster to Azure Arc using the following command:
    ```console
    az connectedk8s connect --name AzureArcTest1 --resource-group AzureArcTest
    ```

    ```output
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

> [!TIP]
> The above command without the location parameter specified creates the Azure Arc enabled Kubernetes resource in the same location as the resource group. To create the Azure Arc enabled Kubernetes resource in a different location, specify either `--location <region>` or `-l <region>` when running the `az connectedk8s connect` command.

> [!NOTE]
> If you are logged into Azure CLI using a service principal, [additional permissions](troubleshooting.md#enable-custom-locations-using-service-principal) are required on the service principal for enabling the custom location feature when connecting the cluster to Azure Arc.

## Verify cluster connection

View a list of your connected clusters with the following command:  

```console
az connectedk8s list -g AzureArcTest -o table
```

```output
Name           Location    ResourceGroup
-------------  ----------  ---------------
AzureArcTest1  eastus      AzureArcTest
```

> [!NOTE]
> After onboarding the cluster, it takes around 5 to 10 minutes for the cluster metadata (cluster version, agent version, number of nodes, etc.) to surface on the overview page of the Azure Arc enabled Kubernetes resource in Azure portal.

## Connect using an outbound proxy server

If your cluster is behind an outbound proxy server, Azure CLI and the Azure Arc enabled Kubernetes agents need to route their requests via the outbound proxy server. 


1. Set the environment variables needed for Azure CLI to use the outbound proxy server:

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

2. Run the connect command with proxy parameters specified:

    ```console
    az connectedk8s connect -n <cluster-name> -g <resource-group> --proxy-https https://<proxy-server-ip-address>:<port> --proxy-http http://<proxy-server-ip-address>:<port> --proxy-skip-range <excludedIP>,<excludedCIDR> --proxy-cert <path-to-cert-file>
    ```

> [!NOTE]
> * Specify `excludedCIDR` under `--proxy-skip-range` to ensure in-cluster communication is not broken for the agents.
> * `--proxy-http`, `--proxy-https`, and `--proxy-skip-range` are expected for most outbound proxy environments. `--proxy-cert` is *only* required if you need to inject trusted certificates expected by proxy into the trusted certificate store of agent pods.

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

You can delete the Azure Arc enabled Kubernetes resource, any associated configuration resources, *and* any agents running on the cluster using Azure CLI using the following command:

```azurecli
az connectedk8s delete --name AzureArcTest1 --resource-group AzureArcTest
```

>[!NOTE]
>Deleting the Azure Arc enabled Kubernetes resource using Azure portal removes any associated configuration resources, but *does not* remove any agents running on the cluster. Best practice is to delete the Azure Arc enabled Kubernetes resource using `az connectedk8s delete` instead of Azure portal.

## Next steps

Advance to the next article to learn how to deploy configurations to your connected Kubernetes cluster using GitOps.
> [!div class="nextstepaction"]
> [Deploy configurations using Gitops](tutorial-use-gitops-connected-cluster.md)