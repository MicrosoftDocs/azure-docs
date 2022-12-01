---
title: "Quickstart: Connect an existing Kubernetes cluster to Azure Arc"
description: In this quickstart, you learn how to connect an Azure Arc-enabled Kubernetes cluster.
ms.topic: quickstart
ms.date: 11/04/2022
ms.custom: template-quickstart, mode-other, devx-track-azurecli, devx-track-azurepowershell
ms.devlang: azurecli
---

# Quickstart: Connect an existing Kubernetes cluster to Azure Arc

Get started with Azure Arc-enabled Kubernetes by using Azure CLI or Azure PowerShell to connect an existing Kubernetes cluster to Azure Arc.

For a conceptual look at connecting clusters to Azure Arc, see [Azure Arc-enabled Kubernetes agent overview](./conceptual-agent-overview.md).

## Prerequisites

### [Azure CLI](#tab/azure-cli)

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* A basic understanding of [Kubernetes core concepts](../../aks/concepts-clusters-workloads.md).

* An identity (user or service principal) which can be used to [log in to Azure CLI](/cli/azure/authenticate-azure-cli) and connect your cluster to Azure Arc.

  > [!IMPORTANT]
  >
  > * The identity must have 'Read' and 'Write' permissions on the Azure Arc-enabled Kubernetes resource type (`Microsoft.Kubernetes/connectedClusters`).
  > * The [Kubernetes Cluster - Azure Arc Onboarding built-in role](../../role-based-access-control/built-in-roles.md#kubernetes-cluster---azure-arc-onboarding) can be used for this identity. This role is useful for at-scale onboarding, as it has only the granular permissions required to connect clusters to Azure Arc, and doesn't have permission to update, delete, or modify any other clusters or other Azure resources.

* [Install or upgrade Azure CLI](/cli/azure/install-azure-cli) to the latest version.

* Install the latest version of **connectedk8s** Azure CLI extension:

  ```azurecli
  az extension add --name connectedk8s
  ```

* An up-and-running Kubernetes cluster. If you don't have one, you can create a cluster using one of these options:
  * [Kubernetes in Docker (KIND)](https://kind.sigs.k8s.io/)
  * Create a Kubernetes cluster using Docker for [Mac](https://docs.docker.com/docker-for-mac/#kubernetes) or [Windows](https://docs.docker.com/docker-for-windows/#kubernetes)
  * Self-managed Kubernetes cluster using [Cluster API](https://cluster-api.sigs.k8s.io/user/quick-start.html)

    >[!NOTE]
    > The cluster needs to have at least one node of operating system and architecture type `linux/amd64`. Clusters with only `linux/arm64` nodes aren't yet supported.

* A [kubeconfig file](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/) and context pointing to your cluster.

* Install [Helm 3](https://helm.sh/docs/intro/install). Ensure that the Helm 3 version is &lt; 3.7.0.

### [Azure PowerShell](#tab/azure-powershell)

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* A basic understanding of [Kubernetes core concepts](../../aks/concepts-clusters-workloads.md).

* [Azure PowerShell version 6.6.0 or later](/powershell/azure/install-az-ps)

* Install the **Az.ConnectedKubernetes** PowerShell module:

    ```azurepowershell-interactive
    Install-Module -Name Az.ConnectedKubernetes
    ```

* [Log in to Azure PowerShell](/powershell/azure/authenticate-azureps) using the identity (user or service principal) that you want to use for connecting your cluster to Azure Arc.
  * The identity used needs to at least have 'Read' and 'Write' permissions on the Azure Arc-enabled Kubernetes resource type (`Microsoft.Kubernetes/connectedClusters`).
  * The [Kubernetes Cluster - Azure Arc Onboarding built-in role](../../role-based-access-control/built-in-roles.md#kubernetes-cluster---azure-arc-onboarding) is useful for at-scale onboarding as it has the granular permissions required to only connect clusters to Azure Arc. This role doesn't have the permissions to update, delete, or modify any other clusters or other Azure resources.

* An up-and-running Kubernetes cluster. If you don't have one, you can create a cluster using one of these options:
  * [Kubernetes in Docker (KIND)](https://kind.sigs.k8s.io/)
  * Create a Kubernetes cluster using Docker for [Mac](https://docs.docker.com/docker-for-mac/#kubernetes) or [Windows](https://docs.docker.com/docker-for-windows/#kubernetes)
  * Self-managed Kubernetes cluster using [Cluster API](https://cluster-api.sigs.k8s.io/user/quick-start.html)
  * If you want to connect an OpenShift cluster to Azure Arc, you need to execute the following command just once on your cluster before running `New-AzConnectedKubernetes`:

    ```bash
    oc adm policy add-scc-to-user privileged system:serviceaccount:azure-arc:azure-arc-kube-aad-proxy-sa
    ```

    >[!NOTE]
    > The cluster needs to have at least one node of operating system and architecture type `linux/amd64`. Clusters with only `linux/arm64` nodes aren't yet supported.

* A [kubeconfig file](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/) and context pointing to your cluster.

* Install [Helm 3](https://helm.sh/docs/intro/install). Ensure that the Helm 3 version is &lt; 3.7.0.

---

## Register providers for Azure Arc-enabled Kubernetes

### [Azure CLI](#tab/azure-cli)

1. Enter the following commands:

    ```azurecli
    az provider register --namespace Microsoft.Kubernetes
    az provider register --namespace Microsoft.KubernetesConfiguration
    az provider register --namespace Microsoft.ExtendedLocation
    ```

1. Monitor the registration process. Registration may take up to 10 minutes.

    ```azurecli
    az provider show -n Microsoft.Kubernetes -o table
    az provider show -n Microsoft.KubernetesConfiguration -o table
    az provider show -n Microsoft.ExtendedLocation -o table
    ```

    Once registered, you should see the `RegistrationState` state for these namespaces change to `Registered`.

### [Azure PowerShell](#tab/azure-powershell)

1. Enter the following commands:

    ```azurepowershell
    Register-AzResourceProvider -ProviderNamespace Microsoft.Kubernetes
    Register-AzResourceProvider -ProviderNamespace Microsoft.KubernetesConfiguration
    Register-AzResourceProvider -ProviderNamespace Microsoft.ExtendedLocation
    ```

1. Monitor the registration process. Registration may take up to 10 minutes.

    ```azurepowershell
    Get-AzResourceProvider -ProviderNamespace Microsoft.Kubernetes
    Get-AzResourceProvider -ProviderNamespace Microsoft.KubernetesConfiguration
    Get-AzResourceProvider -ProviderNamespace Microsoft.ExtendedLocation
    ```

    Once registered, you should see the `RegistrationState` state for these namespaces change to `Registered`.

---

## Meet network requirements

> [!IMPORTANT]
> Azure Arc agents require the following outbound URLs on `https://:443` to function.
> For `*.servicebus.windows.net`, websockets need to be enabled for outbound access on firewall and proxy.

| Endpoint (DNS) | Description |
| ----------------- | ------------- |
| `https://management.azure.com` (for Azure Cloud), `https://management.usgovcloudapi.net` (for Azure US Government) | Required for the agent to connect to Azure and register the cluster. |
| `https://<region>.dp.kubernetesconfiguration.azure.com` (for Azure Cloud), `https://<region>.dp.kubernetesconfiguration.azure.us` (for Azure US Government) | Data plane endpoint for the agent to push status and fetch configuration information. |
| `https://login.microsoftonline.com`, `https://<region>.login.microsoft.com`, `login.windows.net` (for Azure Cloud), `https://login.microsoftonline.us`, `<region>.login.microsoftonline.us` (for Azure US Government) | Required to fetch and update Azure Resource Manager tokens. |
| `https://mcr.microsoft.com`, `https://*.data.mcr.microsoft.com` | Required to pull container images for Azure Arc agents.                                                                  |
| `https://gbl.his.arc.azure.com` (for Azure Cloud), `https://gbl.his.arc.azure.us` (for Azure US Government) |  Required to get the regional endpoint for pulling system-assigned Managed Identity certificates. |
| `https://*.his.arc.azure.com` (for Azure Cloud), `https://usgv.his.arc.azure.us` (for Azure US Government) |  Required to pull system-assigned Managed Identity certificates. |
|`https://k8connecthelm.azureedge.net` | `az connectedk8s connect` uses Helm 3 to deploy Azure Arc agents on the Kubernetes cluster. This endpoint is needed for Helm client download to facilitate deployment of the agent helm chart. |
|`guestnotificationservice.azure.com`, `*.guestnotificationservice.azure.com`, `sts.windows.net`, `https://k8sconnectcsp.azureedge.net` | For [Cluster Connect](cluster-connect.md) and for [Custom Location](custom-locations.md) based scenarios. |
|`*.servicebus.windows.net` | For [Cluster Connect](cluster-connect.md) and for [Custom Location](custom-locations.md) based scenarios. |

> [!NOTE]
> To translate the `*.servicebus.windows.net` wildcard into specific endpoints, use the command `\GET https://guestnotificationservice.azure.com/urls/allowlist?api-version=2020-01-01&location=<location>`. Within this command, the region must be specified for the `<location>` placeholder.

> [!IMPORTANT]
> To view and manage connected clusters in the Azure portal, be sure that your network allows traffic to `*.arc.azure.net`.

## Create a resource group

Run the following command:

### [Azure CLI](#tab/azure-cli)

```azurecli
az group create --name AzureArcTest --location EastUS --output table
```

Output:

```output
Location    Name
----------  ------------
eastus      AzureArcTest
```

### [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzResourceGroup -Name AzureArcTest -Location EastUS
```

Output:

```output
ResourceGroupName : AzureArcTest
Location          : eastus
ProvisioningState : Succeeded
Tags              :
ResourceId        : /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/AzureArcTest
```

---

## Connect an existing Kubernetes cluster

Run the following command:

### [Azure CLI](#tab/azure-cli)

```azurecli
az connectedk8s connect --name AzureArcTest1 --resource-group AzureArcTest
```

> [!NOTE]
> If you are logged into Azure CLI using a service principal, an [additional parameter](troubleshooting.md#enable-custom-locations-using-service-principal) needs to be set to enable the custom location feature on the cluster.

Output:

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
> The above command without the location parameter specified creates the Azure Arc-enabled Kubernetes resource in the same location as the resource group. To create the Azure Arc-enabled Kubernetes resource in a different location, specify either `--location <region>` or `-l <region>` when running the `az connectedk8s connect` command.

> [!IMPORTANT]
> In some cases, deployment may fail due to a timeout error. Please see our [troubleshooting guide](troubleshooting.md#helm-timeout-error) for details on how to resolve this issue.

### [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzConnectedKubernetes -ClusterName AzureArcTest1 -ResourceGroupName AzureArcTest -Location eastus
```

Output:

```output
Location Name          Type
-------- ----          ----
eastus   AzureArcTest1 microsoft.kubernetes/connectedclusters
```

---

## Connect using an outbound proxy server

If your cluster is behind an outbound proxy server, requests must be routed via the outbound proxy server.

### [Azure CLI](#tab/azure-cli)

1. Set the environment variables needed for Azure CLI to use the outbound proxy server:

    ```bash
    export HTTP_PROXY=<proxy-server-ip-address>:<port>
    export HTTPS_PROXY=<proxy-server-ip-address>:<port>
    export NO_PROXY=<cluster-apiserver-ip-address>:<port>
    ```

2. Run the connect command with the `proxy-https` and `proxy-http` parameters specified. If your proxy server is set up with both HTTP and HTTPS, be sure to use `--proxy-http` for the HTTP proxy and `--proxy-https` for the HTTPS proxy. If your proxy server only uses HTTP, you can use that value for both parameters.

    ```azurecli
    az connectedk8s connect --name <cluster-name> --resource-group <resource-group> --proxy-https https://<proxy-server-ip-address>:<port> --proxy-http http://<proxy-server-ip-address>:<port> --proxy-skip-range <excludedIP>,<excludedCIDR> --proxy-cert <path-to-cert-file>
    ```

> [!NOTE]
>
> * Some network requests such as the ones involving in-cluster service-to-service communication need to be separated from the traffic that is routed via the proxy server for outbound communication. The `--proxy-skip-range` parameter can be used to specify the CIDR range and endpoints in a comma-separated way so that any communication from the agents to these endpoints do not go via the outbound proxy. At a minimum, the CIDR range of the services in the cluster should be specified as value for this parameter. For example, let's say `kubectl get svc -A` returns a list of services where all the services have ClusterIP values in the range `10.0.0.0/16`. Then the value to specify for `--proxy-skip-range` is `10.0.0.0/16,kubernetes.default.svc,.svc.cluster.local,.svc`.
> * `--proxy-http`, `--proxy-https`, and `--proxy-skip-range` are expected for most outbound proxy environments. `--proxy-cert` is *only* required if you need to inject trusted certificates expected by proxy into the trusted certificate store of agent pods.
> * The outbound proxy has to be configured to allow websocket connections.

### [Azure PowerShell](#tab/azure-powershell)

1. Set the environment variables needed for Azure PowerShell to use the outbound proxy server:

    ```powershell
    $Env:HTTP_PROXY = "<proxy-server-ip-address>:<port>"
    $Env:HTTPS_PROXY = "<proxy-server-ip-address>:<port>"
    $Env:NO_PROXY = "<cluster-apiserver-ip-address>:<port>"
    ```

2. Run the connect command with the proxy parameter specified:

    ```azurepowershell
    New-AzConnectedKubernetes -ClusterName <cluster-name> -ResourceGroupName <resource-group> -Location eastus -Proxy 'https://<proxy-server-ip-address>:<port>'
    ```

---

For outbound proxy servers where only a trusted certificate needs to be provided without the proxy server endpoint inputs, `az connectedk8s connect` can be run with just the `--proxy-cert` input specified. In case multiple trusted certificates are expected, the combined certificate chain can be provided in a single file using the `--proxy-cert` parameter.

> [!NOTE]
>
> * `--custom-ca-cert` is an alias for `--proxy-cert`. Either parameters can be used interchangeably. Passing both parameters in the same command will honour the one passed last.

### [Azure CLI](#tab/azure-cli)

Run the connect command with the `--proxy-cert` parameter specified:

```azurecli
az connectedk8s connect --name <cluster-name> --resource-group <resource-group> --proxy-cert <path-to-cert-file>
```

### [Azure PowerShell](#tab/azure-powershell)

The ability to pass in the proxy certificate only without the proxy server endpoint details is not yet supported via PowerShell.

---

## Verify cluster connection

Run the following command:

### [Azure CLI](#tab/azure-cli)

```azurecli
az connectedk8s list --resource-group AzureArcTest --output table
```

Output:

```output
Name           Location    ResourceGroup
-------------  ----------  ---------------
AzureArcTest1  eastus      AzureArcTest
```

### [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Get-AzConnectedKubernetes -ResourceGroupName AzureArcTest
```

Output:

```output
Location Name          Type
-------- ----          ----
eastus   AzureArcTest1 microsoft.kubernetes/connectedclusters
```

---

> [!NOTE]
> After onboarding the cluster, it takes around 5 to 10 minutes for the cluster metadata (cluster version, agent version, number of nodes, etc.) to surface on the overview page of the Azure Arc-enabled Kubernetes resource in Azure portal.

> [!TIP]
> For help troubleshooting problems while connecting your cluster, see [Diagnose connection issues for Azure Arc-enabled Kubernetes clusters](diagnose-connection-issues.md).

## View Azure Arc agents for Kubernetes

Azure Arc-enabled Kubernetes deploys a few agents into the `azure-arc` namespace.

1. View these deployments and pods using:

   ```bash
   kubectl get deployments,pods -n azure-arc
   ```

1. Verify all pods are in a `Running` state.

   Output:

   ```output
    NAME                                        READY   UP-TO-DATE   AVAILABLE   AGE
    deployment.apps/cluster-metadata-operator   1/1     1            1           13d
    deployment.apps/clusterconnect-agent        1/1     1            1           13d
    deployment.apps/clusteridentityoperator     1/1     1            1           13d
    deployment.apps/config-agent                1/1     1            1           13d
    deployment.apps/controller-manager          1/1     1            1           13d
    deployment.apps/extension-manager           1/1     1            1           13d
    deployment.apps/flux-logs-agent             1/1     1            1           13d
    deployment.apps/kube-aad-proxy              1/1     1            1           13d
    deployment.apps/metrics-agent               1/1     1            1           13d
    deployment.apps/resource-sync-agent         1/1     1            1           13d

    NAME                                            READY   STATUS    RESTARTS   AGE
    pod/cluster-metadata-operator-9568b899c-2stjn   2/2     Running   0          13d
    pod/clusterconnect-agent-576758886d-vggmv       3/3     Running   0          13d
    pod/clusteridentityoperator-6f59466c87-mm96j    2/2     Running   0          13d
    pod/config-agent-7cbd6cb89f-9fdnt               2/2     Running   0          13d
    pod/controller-manager-df6d56db5-kxmfj          2/2     Running   0          13d
    pod/extension-manager-58c94c5b89-c6q72          2/2     Running   0          13d
    pod/flux-logs-agent-6db9687fcb-rmxww            1/1     Running   0          13d
    pod/kube-aad-proxy-67b87b9f55-bthqv             2/2     Running   0          13d
    pod/metrics-agent-575c565fd9-k5j2t              2/2     Running   0          13d
    pod/resource-sync-agent-6bbd8bcd86-x5bk5        2/2     Running   0          13d
   ```

For more information about these agents, see [Azure Arc-enabled Kubernetes agent overview](conceptual-agent-overview.md).

## Clean up resources

### [Azure CLI](#tab/azure-cli)

You can delete the Azure Arc-enabled Kubernetes resource, any associated configuration resources, *and* any agents running on the cluster using Azure CLI using the following command:

```azurecli
az connectedk8s delete --name AzureArcTest1 --resource-group AzureArcTest
```

If the deletion process fails, use the following command to force deletion (adding `-y` if you want to bypass the confirmation prompt):

```azurecli
az connectedk8s delete -g AzureArcTest1 -n AzureArcTest --force
```

This command can also be used if you experience issues when creating a new cluster deployment (due to previously created resources not being completely removed).

>[!NOTE]
> Deleting the Azure Arc-enabled Kubernetes resource using the Azure portal removes any associated configuration resources, but *does not* remove any agents running on the cluster. Best practice is to delete the Azure Arc-enabled Kubernetes resource using `az connectedk8s delete` rather than deleting the resource in the Azure portal.

### [Azure PowerShell](#tab/azure-powershell)

You can delete the Azure Arc-enabled Kubernetes resource, any associated configuration resources, *and* any agents running on the cluster using Azure PowerShell using the following command:

```azurepowershell
Remove-AzConnectedKubernetes -ClusterName AzureArcTest1 -ResourceGroupName AzureArcTest
```

>[!NOTE]
> Deleting the Azure Arc-enabled Kubernetes resource using the Azure portal removes any associated configuration resources, but *does not* remove any agents running on the cluster. Best practice is to delete the Azure Arc-enabled Kubernetes resource using `Remove-AzConnectedKubernetes` rather than deleting the resource in the Azure portal.

---

## Next steps

Advance to the next article to learn how to deploy configurations to your connected Kubernetes cluster using GitOps.
> [!div class="nextstepaction"]
> [Deploy configurations using GitOps with Flux v2](tutorial-use-gitops-flux2.md)