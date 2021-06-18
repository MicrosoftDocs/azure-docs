---
title: Configure Hybrid Kubernetes clusters with Container insights | Microsoft Docs
description: This article describes how you can configure Container insights to monitor Kubernetes clusters hosted on Azure Stack or other environment.
ms.topic: conceptual
ms.date: 06/30/2020
---

# Configure hybrid Kubernetes clusters with Container insights

Container insights provides rich monitoring experience for the Azure Kubernetes Service (AKS) and [AKS Engine on Azure](https://github.com/Azure/aks-engine), which is a self-managed Kubernetes cluster hosted on Azure. This article describes how to enable monitoring of Kubernetes clusters hosted outside of Azure and achieve a similar monitoring experience.

## Supported configurations

The following configurations are officially supported with Container insights. If you have a different version of Kubernetes and operating system versions, please send a mail to askcoin@microsoft.com.

- Environments:

    - Kubernetes on-premises
    - AKS Engine on Azure and Azure Stack. For more information, see [AKS Engine on Azure Stack](/azure-stack/user/azure-stack-kubernetes-aks-engine-overview)
    - [OpenShift](https://docs.openshift.com/container-platform/4.3/welcome/index.html) version 4 and higher, on-premises or other cloud environments.

- Versions of Kubernetes and support policy are the same as versions of [AKS supported](../../aks/supported-kubernetes-versions.md).

- The following container runtimes are supported: Docker, Moby, and CRI compatible runtimes such CRI-O and ContainerD.

- Linux OS release for master and worker nodes supported are: Ubuntu (18.04 LTS and 16.04 LTS), and Red Hat Enterprise Linux CoreOS 43.81.

- Access control supported: Kubernetes RBAC and non-RBAC

## Prerequisites

Before you start, make sure that you have the following:

- A [Log Analytics workspace](../logs/design-logs-deployment.md).

    Container insights supports a Log Analytics workspace in the regions listed in Azure [Products by region](https://azure.microsoft.com/global-infrastructure/services/?regions=all&products=monitor). To create your own workspace, it can be created through [Azure Resource Manager](../logs/resource-manager-workspace.md), through [PowerShell](../logs/powershell-sample-create-workspace.md?toc=%2fpowershell%2fmodule%2ftoc.json), or in the [Azure portal](../logs/quick-create-workspace.md).

    >[!NOTE]
    >Enable monitoring of multiple clusters with the same cluster name to same Log Analytics workspace is not supported. Cluster names must be unique.
    >

- You are a member of the **Log Analytics contributor role** to enable container monitoring. For more information about how to control access to a Log Analytics workspace, see [Manage access to workspace and log data](../logs/manage-access.md).

- To view the monitoring data, you need to have [*Log Analytics reader*](../logs/manage-access.md#manage-access-using-azure-permissions) role in the Log Analytics workspace, configured with Container insights.

- [HELM client](https://helm.sh/docs/using_helm/) to onboard the Container insights chart for the specified Kubernetes cluster.

- The following proxy and firewall configuration information is required for the containerized version of the Log Analytics agent for Linux to communicate with Azure Monitor:

    |Agent Resource|Ports |
    |------|---------|
    |*.ods.opinsights.azure.com |Port 443 |
    |*.oms.opinsights.azure.com |Port 443 |
    |*.dc.services.visualstudio.com |Port 443 |

- The containerized agent requires Kubelet's `cAdvisor secure port: 10250` or `unsecure port :10255` to be opened on all nodes in the cluster to collect performance metrics. We recommend you configure `secure port: 10250` on the Kubelet's cAdvisor if it's not configured already.

- The containerized agent requires the following environmental variables to be specified on the container in order to communicate with the Kubernetes API service within the cluster to collect inventory data - `KUBERNETES_SERVICE_HOST` and `KUBERNETES_PORT_443_TCP_PORT`.

>[!IMPORTANT]
>The minimum agent version supported for monitoring hybrid Kubernetes clusters is ciprod10182019 or later.

## Enable monitoring

Enabling Container insights for the hybrid Kubernetes cluster consists of performing the following steps in order.

1. Configure your Log Analytics workspace with Container Insights solution.   

2. Enable the Container insights HELM chart with Log Analytics workspace.

For additional information on Monitoring solutions in Azure Monitor refer [here](../../azure-monitor/insights/solutions.md).

### How to add the Azure Monitor Containers solution

You can deploy the solution with the provided Azure Resource Manager template by using the Azure PowerShell cmdlet `New-AzResourceGroupDeployment` or with Azure CLI.

If you are unfamiliar with the concept of deploying resources by using a template, see:

- [Deploy resources with Resource Manager templates and Azure PowerShell](../../azure-resource-manager/templates/deploy-powershell.md)

- [Deploy resources with Resource Manager templates and the Azure CLI](../../azure-resource-manager/templates/deploy-cli.md)

If you choose to use the Azure CLI, you first need to install and use the CLI locally. You must be running the Azure CLI version 2.0.59 or later. To identify your version, run `az --version`. If you need to install or upgrade the Azure CLI, see [Install the Azure CLI](/cli/azure/install-azure-cli).

This method includes two JSON templates. One template specifies the configuration to enable monitoring, and the other contains parameter values that you configure to specify the following:

- **workspaceResourceId** - the full resource ID of your Log Analytics workspace.
- **workspaceRegion** - the region the workspace is created in, which is also referred to as **Location** in the workspace properties when viewing from the Azure portal.

To first identify the full resource ID of your Log Analytics workspace required for the `workspaceResourceId` parameter value in the **containerSolutionParams.json** file, perform the following steps and then run the PowerShell cmdlet or Azure CLI command to add the solution.

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

    ```azurecli
    az resource list --resource-type Microsoft.OperationalInsights/workspaces -o json
    ```

    In the output, find the workspace name, and then copy the full resource ID of that Log Analytics workspace under the field **ID**.

4. Copy and paste the following JSON syntax into your file:

    ```json
    {
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "workspaceResourceId": {
            "type": "string",
            "metadata": {
                "description": "Azure Monitor Log Analytics Workspace Resource ID"
            }
        },
        "workspaceRegion": {
            "type": "string",
            "metadata": {
                "description": "Azure Monitor Log Analytics Workspace region"
            }
        }
    },
    "resources": [
        {
            "type": "Microsoft.Resources/deployments",
            "name": "[Concat('ContainerInsights', '-',  uniqueString(parameters('workspaceResourceId')))]",
            "apiVersion": "2017-05-10",
            "subscriptionId": "[split(parameters('workspaceResourceId'),'/')[2]]",
            "resourceGroup": "[split(parameters('workspaceResourceId'),'/')[4]]",
            "properties": {
                "mode": "Incremental",
                "template": {
                    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
                    "contentVersion": "1.0.0.0",
                    "parameters": {},
                    "variables": {},
                    "resources": [
                        {
                            "apiVersion": "2015-11-01-preview",
                            "type": "Microsoft.OperationsManagement/solutions",
                            "location": "[parameters('workspaceRegion')]",
                            "name": "[Concat('ContainerInsights', '(', split(parameters('workspaceResourceId'),'/')[8], ')')]",
                            "properties": {
                                "workspaceResourceId": "[parameters('workspaceResourceId')]"
                            },
                            "plan": {
                                "name": "[Concat('ContainerInsights', '(', split(parameters('workspaceResourceId'),'/')[8], ')')]",
                                "product": "[Concat('OMSGallery/', 'ContainerInsights')]",
                                "promotionCode": "",
                                "publisher": "Microsoft"
                            }
                        }
                    ]
                },
                "parameters": {}
            }
         }
      ]
   }
    ```

5. Save this file as containerSolution.json to a local folder.

6. Paste the following JSON syntax into your file:

    ```json
    {
      "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
      "contentVersion": "1.0.0.0",
      "parameters": {
        "workspaceResourceId": {
          "value": "<workspaceResourceId>"
      },
      "workspaceRegion": {
        "value": "<workspaceRegion>"
      }
     }
    }
    ```

7. Edit the values for **workspaceResourceId** using the value you copied in step 3, and for **workspaceRegion** copy the **Region** value after running the Azure CLI command [az monitor log-analytics workspace show](/cli/azure/monitor/log-analytics/workspace#az_monitor-log-analytics-workspace-list&preserve-view=true).

8. Save this file as containerSolutionParams.json to a local folder.

9. You are ready to deploy this template.

   - To deploy with Azure PowerShell, use the following commands in the folder that contains the template:

       ```powershell
       # configure and login to the cloud of Log Analytics workspace.Specify the corresponding cloud environment of your workspace to below command.
       Connect-AzureRmAccount -Environment <AzureCloud | AzureChinaCloud | AzureUSGovernment>
       ```

       ```powershell
       # set the context of the subscription of Log Analytics workspace
       Set-AzureRmContext -SubscriptionId <subscription Id of Log Analytics workspace>
       ```

       ```powershell
       # execute deployment command to add Container Insights solution to the specified Log Analytics workspace
       New-AzureRmResourceGroupDeployment -Name OnboardCluster -ResourceGroupName <resource group of Log Analytics workspace> -TemplateFile .\containerSolution.json -TemplateParameterFile .\containerSolutionParams.json
       ```

       The configuration change can take a few minutes to complete. When it's completed, a message is displayed that's similar to the following and includes the result:

       ```powershell
       provisioningState       : Succeeded
       ```

   - To deploy with Azure CLI, run the following commands:

       ```azurecli
       az login
       az account set --name <AzureCloud | AzureChinaCloud | AzureUSGovernment>
       az login
       az account set --subscription "Subscription Name"
       # execute deployment command to add container insights solution to the specified Log Analytics workspace
       az deployment group create --resource-group <resource group of log analytics workspace> --name <deployment name> --template-file  ./containerSolution.json --parameters @./containerSolutionParams.json
       ```

       The configuration change can take a few minutes to complete. When it's completed, a message is displayed that's similar to the following and includes the result:

       ```azurecli
       provisioningState       : Succeeded
       ```

       After you've enabled monitoring, it might take about 15 minutes before you can view health metrics for the cluster.

## Install the HELM chart

In this section you install the containerized agent for Container insights. Before proceeding, you need to identify the workspace ID required for the `omsagent.secret.wsid` parameter, and primary key required for the `omsagent.secret.key` parameter. You can identify this information by performing the following steps, and then run the commands to install the agent using the HELM chart.

1. Run the following command to identify the workspace ID:

    `az monitor log-analytics workspace list --resource-group <resourceGroupName>`

    In the output, find the workspace name under the field **name**, and then copy the workspace ID of that Log Analytics workspace under the field **customerID**.

2. Run the following command to identify the primary key for the workspace:

    `az monitor log-analytics workspace get-shared-keys --resource-group <resourceGroupName> --workspace-name <logAnalyticsWorkspaceName>`

    In the output, find the primary key under the field **primarySharedKey**, and then copy the value.

>[!NOTE]
>The following commands are applicable only for Helm version 2. Use of the `--name` parameter is not applicable with Helm version 3. 

>[!NOTE]
>If your Kubernetes cluster communicates through a proxy server, configure the parameter `omsagent.proxy` with the URL of the proxy server. If the cluster does not communicate through a proxy server, then you don't need to specify this parameter. For more information, see [Configure proxy endpoint](#configure-proxy-endpoint) later in this article.

3. Add the Azure charts repository to your local list by running the following command:

    ```
    helm repo add microsoft https://microsoft.github.io/charts/repo
    ````

4. Install the chart by running the following command:

    ```
    $ helm install --name myrelease-1 \
    --set omsagent.secret.wsid=<logAnalyticsWorkspaceId>,omsagent.secret.key=<logAnalyticsWorkspaceKey>,omsagent.env.clusterName=<my_prod_cluster> microsoft/azuremonitor-containers
    ```

    If the Log Analytics workspace is in Azure China 21Vianet, run the following command:

    ```
    $ helm install --name myrelease-1 \
     --set omsagent.domain=opinsights.azure.cn,omsagent.secret.wsid=<logAnalyticsWorkspaceId>,omsagent.secret.key=<logAnalyticsWorkspaceKey>,omsagent.env.clusterName=<your_cluster_name> incubator/azuremonitor-containers
    ```

    If the Log Analytics workspace is in Azure US Government, run the following command:

    ```
    $ helm install --name myrelease-1 \
    --set omsagent.domain=opinsights.azure.us,omsagent.secret.wsid=<logAnalyticsWorkspaceId>,omsagent.secret.key=<logAnalyticsWorkspaceKey>,omsagent.env.clusterName=<your_cluster_name> incubator/azuremonitor-containers
    ```

### Enable the Helm chart using the API Model

You can specify an addon in the AKS Engine cluster specification json file, also referred to as the API Model. In this addon, provide the base64 encoded version of `WorkspaceGUID` and `WorkspaceKey` of the Log Analytics workspace where the collected monitoring data is stored. You can find the `WorkspaceGUID` and `WorkspaceKey` using steps 1 and 2 in the previous section.

Supported API definitions for the Azure Stack Hub cluster can be found in this example - [kubernetes-container-monitoring_existing_workspace_id_and_key.json](https://github.com/Azure/aks-engine/blob/master/examples/addons/container-monitoring/kubernetes-container-monitoring_existing_workspace_id_and_key.json). Specifically, find the **addons** property in **kubernetesConfig**:

```json
"orchestratorType": "Kubernetes",
       "kubernetesConfig": {
         "addons": [
           {
             "name": "container-monitoring",
             "enabled": true,
             "config": {
               "workspaceGuid": "<Azure Log Analytics Workspace Id in Base-64 encoded>",
               "workspaceKey": "<Azure Log Analytics Workspace Key in Base-64 encoded>"
             }
           }
         ]
       }
```

## Configure agent data collection

Staring with chart version 1.0.0, the agent data collection settings are controlled from the ConfigMap. Refer to documentation about agent data collection settings [here](container-insights-agent-config.md).

After you have successfully deployed the chart, you can review the data for your hybrid Kubernetes cluster in Container insights from the Azure portal.  

>[!NOTE]
>Ingestion latency is around five to ten minutes from agent to commit in the Azure Log Analytics workspace. Status of the cluster show the value **No data** or **Unknown** until all the required monitoring data is available in Azure Monitor.

## Configure proxy endpoint

Starting with chart version 2.7.1, chart will support specifying the proxy endpoint with the `omsagent.proxy` chart parameter. This allows it to communicate through your proxy server. Communication between the Container insights agent and Azure Monitor can be an HTTP or HTTPS proxy server, and both anonymous and basic authentication (username/password) are supported.

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

For example: `omsagent.proxy=http://user01:password@proxy01.contoso.com:8080`

If you specify the protocol as **http**, the HTTP requests are created using SSL/TLS secure connection. Your proxy server must support SSL/TLS protocols.

## Troubleshooting

If you encounter an error while attempting to enable monitoring for your hybrid Kubernetes cluster, copy the PowerShell script [TroubleshootError_nonAzureK8s.ps1](https://aka.ms/troubleshoot-non-azure-k8s) and save it to a folder on your computer. This script is provided to help detect and fix the issues encountered. The issues it is designed to detect and attempt correction of are the following:

- The specified Log Analytics workspace is valid
- The Log Analytics workspace is configured with the Container insights solution. If not, configure the workspace.
- OmsAgent replicaset pods are running
- OmsAgent daemonset pods are running
- OmsAgent Health service is running
- The Log Analytics workspace ID and key configured on the containerized agent match with the workspace the Insight is configured with.
- Validate all the Linux worker nodes have `kubernetes.io/role=agent` label to schedule rs pod. If it doesn't exist, add it.
- Validate `cAdvisor secure port:10250` or `unsecure port: 10255` is opened on all nodes in the cluster.

To execute with Azure PowerShell, use the following commands in the folder that contains the script:

```powershell
.\TroubleshootError_nonAzureK8s.ps1 - azureLogAnalyticsWorkspaceResourceId </subscriptions/<subscriptionId>/resourceGroups/<resourcegroupName>/providers/Microsoft.OperationalInsights/workspaces/<workspaceName> -kubeConfig <kubeConfigFile> -clusterContextInKubeconfig <clusterContext>
```

## Next steps

With monitoring enabled to collect health and resource utilization of your hybrid Kubernetes cluster and workloads running on them, learn [how to use](container-insights-analyze.md) Container insights.