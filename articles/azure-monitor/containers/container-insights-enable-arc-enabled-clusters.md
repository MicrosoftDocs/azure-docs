---
title: Configure Azure Arc enabled Kubernetes cluster with Container insights | Microsoft Docs
description: This article describes how to configure monitoring with Container insights on Azure Arc enabled Kubernetes clusters.
ms.topic: conceptual
ms.date: 09/23/2020
---

# Enable monitoring of Azure Arc enabled Kubernetes cluster

Container insights provides rich monitoring experience for the Azure Kubernetes Service (AKS) and AKS Engine clusters. This article describes how to enable monitoring of your Kubernetes clusters hosted outside of Azure that are enabled with Azure Arc, to achieve a similar monitoring experience.

Container insights can be enabled for one or more existing deployments of Kubernetes using either a PowerShell or Bash script.

## Supported configurations

Container insights supports monitoring Azure Arc enabled Kubernetes (preview) as described in the [Overview](container-insights-overview.md) article, except for the following features:

- Live Data (preview)

The following is officially supported with Container insights:

- Versions of Kubernetes and support policy are the same as versions of [AKS supported](../../aks/supported-kubernetes-versions.md).

- The following container runtimes are supported: Docker, Moby, and CRI compatible runtimes such CRI-O and ContainerD.

- Linux OS release for master and worker nodes supported are: Ubuntu (18.04 LTS and 16.04 LTS).

## Prerequisites

Before you start, make sure that you have the following:

- A Log Analytics workspace.

    Container insights supports a Log Analytics workspace in the regions listed in Azure [Products by region](https://azure.microsoft.com/global-infrastructure/services/?regions=all&products=monitor). To create your own workspace, it can be created through [Azure Resource Manager](../logs/resource-manager-workspace.md), through [PowerShell](../logs/powershell-sample-create-workspace.md?toc=%2fpowershell%2fmodule%2ftoc.json), or in the [Azure portal](../logs/quick-create-workspace.md).

- To enable and access the features in Container insights, at a minimum you need to be a member of the Azure *Contributor* role in the Azure subscription, and a member of the [*Log Analytics Contributor*](../logs/manage-access.md#manage-access-using-azure-permissions) role of the Log Analytics workspace configured with Container insights.

- You are a member of the [Contributor](../../role-based-access-control/built-in-roles.md#contributor) role on the Azure Arc cluster resource.

- To view the monitoring data, you are a member of the [*Log Analytics reader*](../logs/manage-access.md#manage-access-using-azure-permissions) role permission with the Log Analytics workspace configured with Container insights.

- [HELM client](https://helm.sh/docs/using_helm/) to onboard the Container insights chart for the specified Kubernetes cluster.

- The following proxy and firewall configuration information is required for the containerized version of the Log Analytics agent for Linux to communicate with Azure Monitor:

    |Agent Resource|Ports |
    |------|---------|
    |`*.ods.opinsights.azure.com` |Port 443 |
    |`*.oms.opinsights.azure.com` |Port 443 |
    |`*.dc.services.visualstudio.com` |Port 443 |

- The containerized agent requires Kubelet's `cAdvisor secure port: 10250` or `unsecure port :10255` to be opened on all nodes in the cluster to collect performance metrics. We recommend you configure `secure port: 10250` on the Kubelet's cAdvisor if it's not configured already.

- The containerized agent requires the following environmental variables to be specified on the container in order to communicate with the Kubernetes API service within the cluster to collect inventory data - `KUBERNETES_SERVICE_HOST` and `KUBERNETES_PORT_443_TCP_PORT`.

    >[!IMPORTANT]
    >The minimum agent version supported for monitoring Arc-enabled Kubernetes clusters is ciprod04162020 or later.

- [PowerShell Core](/powershell/scripting/install/installing-powershell?view=powershell-6&preserve-view=true) is required if you enable monitoring using the PowerShell scripted method.

- [Bash version 4](https://www.gnu.org/software/bash/) is required if you enable monitoring using the Bash scripted method.

## Identify workspace resource ID

To enable monitoring of your cluster using the PowerShell or bash script you downloaded earlier and integrate with an existing Log Analytics workspace, perform the following steps to first identify the full resource ID of your Log Analytics workspace. This is required for the `workspaceResourceId` parameter when you run the command to enable the monitoring add-on against the specified workspace. If you don't have a workspace to specify, you can skip including the `workspaceResourceId` parameter, and let the script create a new workspace for you.

1. List all the subscriptions that you have access to using the following command:

    ```azurecli
    az account list --all -o table
    ```

    The output will resemble the following:

    ```azurecli
    Name                                  CloudName    SubscriptionId                        State    IsDefault
    ------------------------------------  -----------  ------------------------------------  -------  -----------
    Microsoft Azure                       AzureCloud   0fb60ef2-03cc-4290-b595-e71108e8f4ce  Enabled  True
    ```

    Copy the value for **SubscriptionId**.

2. Switch to the subscription hosting the Log Analytics workspace using the following command:

    ```azurecli
    az account set -s <subscriptionId of the workspace>
    ```

3. The following example displays the list of workspaces in your subscriptions in the default JSON format.

    ```
    az resource list --resource-type Microsoft.OperationalInsights/workspaces -o json
    ```

    In the output, find the workspace name, and then copy the full resource ID of that Log Analytics workspace under the field **ID**.

## Enable monitoring using PowerShell

1. Download and save the script to a local folder that configures your cluster with the monitoring add-on using the following commands:

    ```powershell
    Invoke-WebRequest https://aka.ms/enable-monitoring-powershell-script -OutFile enable-monitoring.ps1
    ```

2. Configure the `$azureArcClusterResourceId` variable by setting the corresponding values for `subscriptionId`, `resourceGroupName` and `clusterName` representing the resource ID of your Azure Arc-enabled Kubernetes cluster resource.

    ```powershell
    $azureArcClusterResourceId = "/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.Kubernetes/connectedClusters/<clusterName>"
    ```

3. Configure the `$kubeContext` variable with the **kube-context** of your cluster by running the command `kubectl config get-contexts`. If you want to use the current context, set the value to `""`.

    ```powershell
    $kubeContext = "<kubeContext name of your k8s cluster>"
    ```

4. If you want to use existing Azure Monitor Log Analytics workspace, configure the variable `$logAnalyticsWorkspaceResourceId` with the corresponding value representing the resource ID of the workspace. Otherwise, set the variable to `""` and the script creates a default workspace in the default resource group of the cluster subscription if one does not already exist in the region. The default workspace created resembles the format of *DefaultWorkspace-\<SubscriptionID>-\<Region>*.

    ```powershell
    $logAnalyticsWorkspaceResourceId = "/subscriptions/<subscriptionId>/resourceGroups/<resourceGroup>/providers/microsoft.operationalinsights/workspaces/<workspaceName>"
    ```

5. If your Arc-enabled Kubernetes cluster communicates through a proxy server, configure the variable `$proxyEndpoint` with the URL of the proxy server. If the cluster does not communicate through a proxy server, then you can set the value to `""`.  For more information, see [Configure proxy endpoint](#configure-proxy-endpoint) later in this article.

6. Run the following command to enable monitoring.

    ```powershell
    .\enable-monitoring.ps1 -clusterResourceId $azureArcClusterResourceId -kubeContext $kubeContext -workspaceResourceId $logAnalyticsWorkspaceResourceId -proxyEndpoint $proxyEndpoint
    ```

After you've enabled monitoring, it might take about 15 minutes before you can view health metrics for the cluster.

### Using service principal
The script *enable-monitoring.ps1* uses the interactive device login. If you prefer non-interactive login, you can use an existing service principal or create a new one that has the required permissions as described in [Prerequisites](#prerequisites). To use service principal, you will have to pass $servicePrincipalClientId, $servicePrincipalClientSecret and $tenantId parameters with values of service principal you have intended to use to *enable-monitoring.ps1* script.

```powershell
$subscriptionId = "<subscription Id of the Azure Arc connected cluster resource>"
$servicePrincipal = New-AzADServicePrincipal -Role Contributor -Scope "/subscriptions/$subscriptionId"
```

The role assignment below is only applicable if you are using existing Log Analytics workspace in a different Azure Subscription than the Arc K8s Connected Cluster resource.

```powershell
$logAnalyticsWorkspaceResourceId = "<Azure Resource Id of the Log Analytics Workspace>" # format of the Azure Log Analytics workspace should be /subscriptions/<subId>/resourcegroups/<rgName>/providers/microsoft.operationalinsights/workspaces/<workspaceName>
New-AzRoleAssignment -RoleDefinitionName 'Log Analytics Contributor'  -ObjectId $servicePrincipal.Id -Scope  $logAnalyticsWorkspaceResourceId

$servicePrincipalClientId =  $servicePrincipal.ApplicationId.ToString()
$servicePrincipalClientSecret = [System.Net.NetworkCredential]::new("", $servicePrincipal.Secret).Password
$tenantId = (Get-AzSubscription -SubscriptionId $subscriptionId).TenantId
```

For example:

```powershell
.\enable-monitoring.ps1 -clusterResourceId $azureArcClusterResourceId -servicePrincipalClientId $servicePrincipalClientId -servicePrincipalClientSecret $servicePrincipalClientSecret -tenantId $tenantId -kubeContext $kubeContext -workspaceResourceId $logAnalyticsWorkspaceResourceId -proxyEndpoint $proxyEndpoint
```



## Enable using bash script

Perform the following steps to enable monitoring using the provided bash script.

1. Download and save the script to a local folder that configures your cluster with the monitoring add-on using the following commands:

    ```bash
    curl -o enable-monitoring.sh -L https://aka.ms/enable-monitoring-bash-script
    ```

2. Configure the `azureArcClusterResourceId` variable by setting the corresponding values for `subscriptionId`, `resourceGroupName` and `clusterName` representing the resource ID of your Azure Arc-enabled Kubernetes cluster resource.

    ```bash
    export azureArcClusterResourceId="/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.Kubernetes/connectedClusters/<clusterName>"
    ```

3. Configure the `kubeContext` variable with the **kube-context** of your cluster by running the command `kubectl config get-contexts`. If you want to use the current context, set the value to `""`.

    ```bash
    export kubeContext="<kubeContext name of your k8s cluster>"
    ```

4. If you want to use existing Azure Monitor Log Analytics workspace, configure the variable `logAnalyticsWorkspaceResourceId` with the corresponding value representing the resource ID of the workspace. Otherwise, set the variable to `""` and the script creates a default workspace in the default resource group of the cluster subscription if one does not already exist in the region. The default workspace created resembles the format of *DefaultWorkspace-\<SubscriptionID>-\<Region>*.

    ```bash
    export logAnalyticsWorkspaceResourceId="/subscriptions/<subscriptionId>/resourceGroups/<resourceGroup>/providers/microsoft.operationalinsights/workspaces/<workspaceName>"
    ```

5. If your Arc-enabled Kubernetes cluster communicates through a proxy server, configure the variable `proxyEndpoint` with the URL of the proxy server. If the cluster does not communicate through a proxy server, then you can set the value to `""`. For more information, see [Configure proxy endpoint](#configure-proxy-endpoint) later in this article.

6. To enable monitoring on your cluster, there are different commands provided based on your deployment scenario.

    Run the following command to enable monitoring with default options, such as using current kube-context, create a default Log Analytics workspace, and without specifying a proxy server:

    ```bash
    bash enable-monitoring.sh --resource-id $azureArcClusterResourceId
    ```

    Run the following command to create a default Log Analytics workspace and without specifying a proxy server:

    ```bash
   bash enable-monitoring.sh --resource-id $azureArcClusterResourceId --kube-context $kubeContext
    ```

    Run the following command to use an existing Log Analytics workspace and without specifying a proxy server:

    ```bash
    bash enable-monitoring.sh --resource-id $azureArcClusterResourceId --kube-context $kubeContext  --workspace-id $logAnalyticsWorkspaceResourceId
    ```

    Run the following command to use an existing Log Analytics workspace and specify a proxy server:

    ```bash
    bash enable-monitoring.sh --resource-id $azureArcClusterResourceId --kube-context $kubeContext  --workspace-id $logAnalyticsWorkspaceResourceId --proxy $proxyEndpoint
    ```

After you've enabled monitoring, it might take about 15 minutes before you can view health metrics for the cluster.

### Using service principal
The bash script *enable-monitoring.sh* uses the interactive device login. If you prefer non-interactive login, you can use an existing service principal or create a new one that has the required permissions as described in [Prerequisites](#prerequisites). To use service principal, you will have to pass --client-id, --client-secret and  --tenant-id values of service principal you have intended to use to *enable-monitoring.sh* bash script.

```bash
subscriptionId="<subscription Id of the Azure Arc connected cluster resource>"
servicePrincipal=$(az ad sp create-for-rbac --role="Contributor" --scopes="/subscriptions/${subscriptionId}")
servicePrincipalClientId=$(echo $servicePrincipal | jq -r '.appId')
```

The role assignment below is only applicable if you are using existing Log Analytics workspace in a different Azure Subscription than the Arc K8s Connected Cluster resource.

```bash
logAnalyticsWorkspaceResourceId="<Azure Resource Id of the Log Analytics Workspace>" # format of the Azure Log Analytics workspace should be /subscriptions/<subId>/resourcegroups/<rgName>/providers/microsoft.operationalinsights/workspaces/<workspaceName>
az role assignment create --role 'Log Analytics Contributor' --assignee $servicePrincipalClientId --scope $logAnalyticsWorkspaceResourceId

servicePrincipalClientSecret=$(echo $servicePrincipal | jq -r '.password')
tenantId=$(echo $servicePrincipal | jq -r '.tenant')
```

For example:

```bash
bash enable-monitoring.sh --resource-id $azureArcClusterResourceId --client-id $servicePrincipalClientId --client-secret $servicePrincipalClientSecret  --tenant-id $tenantId --kube-context $kubeContext  --workspace-id $logAnalyticsWorkspaceResourceId --proxy $proxyEndpoint
```

## Configure proxy endpoint

With the containerized agent for Container insights, you can configure a proxy endpoint to allow it to communicate through your proxy server. Communication between the containerized agent and Azure Monitor can be an HTTP or HTTPS proxy server, and both anonymous and basic authentication (username/password) are supported.

The proxy configuration value has the following syntax: `[protocol://][user:password@]proxyhost[:port]`

> [!NOTE]
>If your proxy server does not require authentication, you still need to specify a psuedo username/password. This can be any username or password.

|Property| Description |
|--------|-------------|
|Protocol | http or https |
|user | Optional username for proxy authentication |
|password | Optional password for proxy authentication |
|proxyhost | Address or FQDN of the proxy server |
|port | Optional port number for the proxy server |

For example: `http://user01:password@proxy01.contoso.com:3128`

If you specify the protocol as **http**, the HTTP requests are created using SSL/TLS secure connection. Your proxy server must support SSL/TLS protocols.

### Configure using PowerShell

Specify the username and password, IP address or FQDN, and port number for the proxy server. For example:

```powershell
$proxyEndpoint = https://<user>:<password>@<proxyhost>:<port>
```

### Configure using bash

Specify the username and password, IP address or FQDN, and port number for the proxy server. For example:

```bash
export proxyEndpoint=https://<user>:<password>@<proxyhost>:<port>
```

## Next steps

- With monitoring enabled to collect health and resource utilization of your Arc-enabled Kubernetes cluster and workloads running on them, learn [how to use](container-insights-analyze.md) Container insights.

- By default, the containerized agent collects the stdout/ stderr container logs of all the containers running in all the namespaces except kube-system. To configure container log collection specific to particular namespace or namespaces, review [Container Insights agent configuration](container-insights-agent-config.md) to configure desired data collection settings to your ConfigMap configurations file.

- To scrape and analyze Prometheus metrics from your cluster, review [Configure Prometheus metrics scraping](container-insights-prometheus-integration.md)

- To learn how to stop monitoring your Arc enabled Kubernetes cluster with Container insights, see [How to stop monitoring your hybrid cluster](container-insights-optout-hybrid.md#how-to-stop-monitoring-on-arc-enabled-kubernetes).