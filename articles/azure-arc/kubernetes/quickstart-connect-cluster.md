---
title: 'Quickstart: Connect an existing Kubernetes cluster to Azure Arc'
description: "In this quickstart, learn how to connect an Azure Arc-enabled Kubernetes cluster."
author: mgoedtel
ms.author: magoedte
ms.service: azure-arc
ms.topic: quickstart
ms.date: 06/30/2021
ms.custom: template-quickstart, references_regions, devx-track-azurecli, devx-track-azurepowershell
keywords: "Kubernetes, Arc, Azure, cluster"
---

# Quickstart: Connect an existing Kubernetes cluster to Azure Arc

In this quickstart, you'll learn the benefits of Azure Arc-enabled Kubernetes and how to connect an existing Kubernetes cluster to Azure Arc. For a conceptual look at connecting clusters to Azure Arc, see the [Azure Arc-enabled Kubernetes Agent Architecture article](./conceptual-agent-architecture.md).

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

### [Azure CLI](#tab/azure-cli)

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](../../../includes/azure-cli-prepare-your-environment-no-header.md)]

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
* 'Read' and 'Write' permissions on the Azure Arc-enabled Kubernetes resource type (`Microsoft.Kubernetes/connectedClusters`).

* Install the [latest release of Helm 3](https://helm.sh/docs/intro/install).

* [Install or upgrade Azure CLI](/cli/azure/install-azure-cli) to version >= 2.16.0
* Install the `connectedk8s` Azure CLI extension of version >= 1.0.0:

  ```console
  az extension add --name connectedk8s
  ```
>[!NOTE]
> For [**custom locations**](./custom-locations.md) on your cluster, use East US or West Europe regions. For all other Azure Arc-enabled Kubernetes features, [select any region from this list](https://azure.microsoft.com/global-infrastructure/services/?products=azure-arc).

### [Azure PowerShell](#tab/azure-powershell)

[!INCLUDE [azure-powershell-requirements-no-header.md](../../../includes/azure-powershell-requirements-no-header.md)]

> [!IMPORTANT]
> While the **Az.ConnectedKubernetes** PowerShell module is in preview, you must install it separately using
> the `Install-Module` cmdlet.

```azurepowershell-interactive
Install-Module -Name Az.ConnectedKubernetes
```

* An up-and-running Kubernetes cluster. If you don't have one, you can create a cluster using one of these options:
    * [Kubernetes in Docker (KIND)](https://kind.sigs.k8s.io/)
    * Create a Kubernetes cluster using Docker for [Mac](https://docs.docker.com/docker-for-mac/#kubernetes) or [Windows](https://docs.docker.com/docker-for-windows/#kubernetes)
    * Self-managed Kubernetes cluster using [Cluster API](https://cluster-api.sigs.k8s.io/user/quick-start.html)
    * If you want to connect a OpenShift cluster to Azure Arc, you need to execute the following command just once on your cluster before running `New-AzConnectedKubernetes`:

        ```console
        oc adm policy add-scc-to-user privileged system:serviceaccount:azure-arc:azure-arc-kube-aad-proxy-sa
        ```

    >[!NOTE]
    > The cluster needs to have at least one node of operating system and architecture type `linux/amd64`. Clusters with only `linux/arm64` nodes aren't yet supported.

* A `kubeconfig` file and context pointing to your cluster.
* 'Read' and 'Write' permissions on the Azure Arc-enabled Kubernetes resource type (`Microsoft.Kubernetes/connectedClusters`).

* Install the [latest release of Helm 3](https://helm.sh/docs/intro/install).

* [Azure PowerShell version 5.9.0 or later](/powershell/azure/install-az-ps)

---

>[!NOTE]
> For [**custom locations**](./custom-locations.md) on your cluster, use East US or West Europe regions. For all other Azure Arc-enabled Kubernetes features, [select any region from this list](https://azure.microsoft.com/global-infrastructure/services/?products=azure-arc).

## Meet network requirements

> [!IMPORTANT]
> Azure Arc agents require both of the following protocols/ports/outbound URLs to function:
> * TCP on port 443: `https://:443`

| Endpoint (DNS) | Description |
| ----------------- | ------------- |
| `https://management.azure.com` (for Azure Cloud), `https://management.usgovcloudapi.net` (for Azure US Government) | Required for the agent to connect to Azure and register the cluster. |
| `https://<region>.dp.kubernetesconfiguration.azure.com` (for Azure Cloud), `https://<region>.dp.kubernetesconfiguration.azure.us` (for Azure US Government) | Data plane endpoint for the agent to push status and fetch configuration information. |
| `https://login.microsoftonline.com` (for Azure Cloud), `https://login.microsoftonline.us` (for Azure US Government) | Required to fetch and update Azure Resource Manager tokens. |
| `https://mcr.microsoft.com` | Required to pull container images for Azure Arc agents.                                                                  |
| `https://gbl.his.arc.azure.com` |  Required to get the regional endpoint for pulling system-assigned Managed Service Identity (MSI) certificates. |
| `https://<region-code>.his.arc.azure.com` (for Azure Cloud), `https://usgv.his.arc.azure.us` (for Azure US Government) |  Required to pull system-assigned Managed Service Identity (MSI) certificates. `<region-code>` mapping for Azure cloud regions: `eus` (East US), `weu` (West Europe), `wcus` (West Central US), `scus` (South Central US), `sea` (South East Asia), `uks` (UK South), `wus2` (West US 2), `ae` (Australia East), `eus2` (East US 2), `ne` (North Europe), `fc` (France Central). |

## 1. Register providers for Azure Arc-enabled Kubernetes

### [Azure CLI](#tab/azure-cli)

1. Enter the following commands:
    ```console
    az provider register --namespace Microsoft.Kubernetes
    az provider register --namespace Microsoft.KubernetesConfiguration
    az provider register --namespace Microsoft.ExtendedLocation
    ```
2. Monitor the registration process. Registration may take up to 10 minutes.
    ```console
    az provider show -n Microsoft.Kubernetes -o table
    az provider show -n Microsoft.KubernetesConfiguration -o table
    az provider show -n Microsoft.ExtendedLocation -o table
    ```

### [Azure PowerShell](#tab/azure-powershell)

1. Enter the following commands:
    ```azurepowershell-interactive
    Register-AzResourceProvider -ProviderNamespace Microsoft.Kubernetes
    Register-AzResourceProvider -ProviderNamespace Microsoft.KubernetesConfiguration
    Register-AzResourceProvider -ProviderNamespace Microsoft.ExtendedLocation
    ```
1. Monitor the registration process. Registration may take up to 10 minutes.
    ```azurepowershell-interactive
    Get-AzResourceProvider -ProviderNamespace Microsoft.Kubernetes
    Get-AzResourceProvider -ProviderNamespace Microsoft.KubernetesConfiguration
    Get-AzResourceProvider -ProviderNamespace Microsoft.ExtendedLocation
    ```

---

## 2. Create a resource group

Run the following command:

### [Azure CLI](#tab/azure-cli)

```console
az group create --name AzureArcTest --location EastUS --output table
```

Output:
<pre>
Location    Name
----------  ------------
eastus      AzureArcTest
</pre>

### [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
New-AzResourceGroup -Name AzureArcTest -Location EastUS
```

Output:
<pre>
ResourceGroupName : AzureArcTest
Location          : eastus
ProvisioningState : Succeeded
Tags              :
ResourceId        : /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/AzureArcTest
</pre>

---

## 3. Connect an existing Kubernetes cluster

Run the following command:

### [Azure CLI](#tab/azure-cli)

```console
az connectedk8s connect --name AzureArcTest1 --resource-group AzureArcTest
```

Output:
<pre>
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
</pre>

> [!TIP]
> The above command without the location parameter specified creates the Azure Arc-enabled Kubernetes resource in the same location as the resource group. To create the Azure Arc-enabled Kubernetes resource in a different location, specify either `--location <region>` or `-l <region>` when running the `az connectedk8s connect` command.

> [!NOTE]
> If you are logged into Azure CLI using a service principal, an [additional parameter](troubleshooting.md#enable-custom-locations-using-service-principal) needs to be set for enabling the custom location feature on the cluster.

### [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
New-AzConnectedKubernetes -ClusterName AzureArcTest1 -ResourceGroupName AzureArcTest -Location eastus
```

Output:
<pre>
Location Name          Type
-------- ----          ----
eastus   AzureArcTest1 microsoft.kubernetes/connectedclusters
</pre>

---

## 4. Verify cluster connection

Run the following command:

### [Azure CLI](#tab/azure-cli)

```console
az connectedk8s list --resource-group AzureArcTest --output table
```

Output:
<pre>
Name           Location    ResourceGroup
-------------  ----------  ---------------
AzureArcTest1  eastus      AzureArcTest
</pre>

### [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Get-AzConnectedKubernetes -ResourceGroupName AzureArcTest
```

Output:
<pre>
Location Name          Type
-------- ----          ----
eastus   AzureArcTest1 microsoft.kubernetes/connectedclusters
</pre>

---

> [!NOTE]
> After onboarding the cluster, it takes around 5 to 10 minutes for the cluster metadata (cluster version, agent version, number of nodes, etc.) to surface on the overview page of the Azure Arc-enabled Kubernetes resource in Azure portal.

## 5. Connect using an outbound proxy server

### [Azure CLI](#tab/azure-cli)

If your cluster is behind an outbound proxy server, Azure CLI and the Azure Arc-enabled Kubernetes agents need to route their requests via the outbound proxy server.

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
    az connectedk8s connect --name <cluster-name> --resource-group <resource-group> --proxy-https https://<proxy-server-ip-address>:<port> --proxy-http http://<proxy-server-ip-address>:<port> --proxy-skip-range <excludedIP>,<excludedCIDR> --proxy-cert <path-to-cert-file>
    ```

> [!NOTE]
> * Specify `excludedCIDR` under `--proxy-skip-range` to ensure in-cluster communication is not broken for the agents.
> * `--proxy-http`, `--proxy-https`, and `--proxy-skip-range` are expected for most outbound proxy environments. `--proxy-cert` is *only* required if you need to inject trusted certificates expected by proxy into the trusted certificate store of agent pods.

### [Azure PowerShell](#tab/azure-powershell)

If your cluster is behind an outbound proxy server, Azure PowerShell and the Azure Arc-enabled Kubernetes agents need to route their requests via the outbound proxy server.

1. Set the environment variables needed for Azure PowerShell to use the outbound proxy server:

    * Run the following command with appropriate values:

        ```powershell
        $Env:HTTP_PROXY = "<proxy-server-ip-address>:<port>"
        $Env:HTTPS_PROXY = "<proxy-server-ip-address>:<port>"
        $Env:NO_PROXY = "<cluster-apiserver-ip-address>:<port>"
        ```

2. Run the connect command with the proxy parameter specified:

    ```azurepowershell-interactive
    New-AzConnectedKubernetes -ClusterName <cluster-name> -ResourceGroupName <resource-group> -Location eastus -Proxy 'https://<proxy-server-ip-address>:<port>'
    ```

---

## 6. View Azure Arc agents for Kubernetes

Azure Arc-enabled Kubernetes deploys a few operators into the `azure-arc` namespace.

1. View these deployments and pods using:

    ```console
    kubectl get deployments,pods -n azure-arc
    ```

1. Verify all pods are in a `Running` state.

    Output:
    <pre>

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
    </pre>

## 7. Clean up resources

### [Azure CLI](#tab/azure-cli)

You can delete the Azure Arc-enabled Kubernetes resource, any associated configuration resources, *and* any agents running on the cluster using Azure CLI using the following command:

```console
az connectedk8s delete --name AzureArcTest1 --resource-group AzureArcTest
```

>[!NOTE]
> Deleting the Azure Arc-enabled Kubernetes resource using Azure portal removes any associated configuration resources, but *does not* remove any agents running on the cluster. Best practice is to delete the Azure Arc-enabled Kubernetes resource using `az connectedk8s delete` instead of Azure portal.

### [Azure PowerShell](#tab/azure-powershell)

You can delete the Azure Arc-enabled Kubernetes resource, any associated configuration resources, *and* any agents running on the cluster using Azure PowerShell using the following command:

```azurepowershell-interactive
Remove-AzConnectedKubernetes -ClusterName AzureArcTest1 -ResourceGroupName AzureArcTest
```

>[!NOTE]
> Deleting the Azure Arc-enabled Kubernetes resource using Azure portal removes any associated configuration resources, but *does not* remove any agents running on the cluster. Best practice is to delete the Azure Arc-enabled Kubernetes resource using `Remove-AzConnectedKubernetes` instead of Azure portal.

---

## Next steps

Advance to the next article to learn how to deploy configurations to your connected Kubernetes cluster using GitOps.
> [!div class="nextstepaction"]
> [Deploy configurations using GitOps](tutorial-use-gitops-connected-cluster.md)
