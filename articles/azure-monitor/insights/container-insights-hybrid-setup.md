---
title: Configure Hybrid Kubernetes clusters with Azure Monitor for containers | Microsoft Docs
description: This article describes how you can configure Azure Monitor for containers to monitor Kubernetes clusters hosted on Azure Stack or other environment.
ms.topic: conceptual
ms.date: 12/04/2019
---

# Configure hybrid Kubernetes clusters with Azure Monitor for containers

Azure Monitor for containers provides rich monitoring experience for the Azure Kubernetes Service (AKS) and AKS Engine clusters hosted in Azure. This article describes how to enable monitoring of Kubernetes clusters hosted outside of Azure and achieve a similar monitoring experience.

## Prerequisites

Before you start, make sure that you have the following:

* A Log Analytics workspace.

    Azure Monitor for containers supports a Log Analytics workspace in the regions listed in Azure [Products by region](https://azure.microsoft.com/global-infrastructure/services/?regions=all&products=monitor). To create your own workspace, it can be created through [Azure Resource Manager](../platform/template-workspace-configuration.md), through [PowerShell](../scripts/powershell-sample-create-workspace.md?toc=%2fpowershell%2fmodule%2ftoc.json), or in the [Azure portal](../learn/quick-create-workspace.md).

    >[!NOTE]
    >Enable monitoring of multiple clusters with the same cluster name to same Log Analytics workspace is not supported. Cluster names must be unique.
    >

* You are a member of the **Log Analytics contributor role** to enable container monitoring. For more information about how to control access to a Log Analytics workspace, see [Manage access to workspace and log data](../platform/manage-access.md)

* [HELM client](https://helm.sh/docs/using_helm/) to onboard the Azure Monitor for containers chart for the specified Kubernetes cluster.

* The following proxy and firewall configuration information is required for the containerized version of the Log Analytics agent for Linux to communicate with Azure Monitor:

    |Agent Resource|Ports |
    |------|---------|   
    |*.ods.opinsights.azure.com |Port 443 |  
    |*.oms.opinsights.azure.com |Port 443 |  
    |*.blob.core.windows.net |Port 443 |  
    |*.dc.services.visualstudio.com |Port 443 |

* The containerized agent requires `cAdvisor port: 10255` to be opened on all nodes in the cluster to collect performance metrics.

* The containerized agent requires the following environmental variables to be specified on the container in order to communicate with the Kubernetes API service within the cluster to collect inventory data - `KUBERNETES_SERVICE_HOST` and `KUBERNETES_PORT_443_TCP_PORT`.

>[!IMPORTANT]
>The minimum agent version supported for monitoring hybrid Kubernetes clusters is ciprod10182019 or later.

## Supported configurations

The following is officially supported with Azure Monitor for containers.

- Environments: Kubernetes on-premises, AKS Engine on Azure and Azure Stack. For more information, see [AKS Engine on Azure Stack](https://docs.microsoft.com/azure-stack/user/azure-stack-kubernetes-aks-engine-overview?view=azs-1908).
- Versions of Kubernetes and support policy are the same as versions of [AKS supported](../../aks/supported-kubernetes-versions.md).
- Container Runtime: Docker and Moby
- Linux OS release for master and worked nodes: Ubuntu (18.04 LTS and 16.04 LTS)
- Access control supported: Kubernetes RBAC and non-RBAC

## Enable monitoring

Enabling Azure Monitor for containers for the hybrid Kubernetes cluster consists of performing the following steps in order.

1. Configure your Log Analytics workspace with Container Insights solution.

2. Enable the Azure Monitor for containers HELM chart with Log Analytics workspace.

### How to add the Azure Monitor Containers solution

You can deploy the solution with the provided Azure Resource Manager template by using the Azure PowerShell cmdlet `New-AzResourceGroupDeployment` or with Azure CLI.

If you are unfamiliar with the concept of deploying resources by using a template, see:

* [Deploy resources with Resource Manager templates and Azure PowerShell](../../azure-resource-manager/templates/deploy-powershell.md)

* [Deploy resources with Resource Manager templates and the Azure CLI](../../azure-resource-manager/templates/deploy-cli.md)

If you choose to use the Azure CLI, you first need to install and use the CLI locally. You must be running the Azure CLI version 2.0.59 or later. To identify your version, run `az --version`. If you need to install or upgrade the Azure CLI, see [Install the Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli).

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
    Microsoft Azure                       AzureCloud   68627f8c-91fO-4905-z48q-b032a81f8vy0  Enabled  True
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

7. Edit the values for **workspaceResourceId** using the value you copied in step 3, and for **workspaceRegion** copy the **Region** value after running the Azure CLI command [az monitor log-analytics workspace show](https://docs.microsoft.com/cli/azure/monitor/log-analytics/workspace?view=azure-cli-latest#az-monitor-log-analytics-workspace-list).

8. Save this file as containerSolutionParams.json to a local folder.

9. You are ready to deploy this template.

   * To deploy with Azure PowerShell, use the following commands in the folder that contains the template:

       ```powershell
       # configure and login to the cloud of log analytics workspace.Specify the corresponding cloud environment of your workspace to below command.
       Connect-AzureRmAccount -Environment <AzureCloud | AzureChinaCloud | AzureUSGovernment>
       ```

       ```powershell
       # set the context of the subscription of Log Analytics workspace
       Set-AzureRmContext -SubscriptionId <subscription Id of log analytics workspace>
       ```

       ```powershell
       # execute deployment command to add container insights solution to the specified Log Analytics workspace
       New-AzureRmResourceGroupDeployment -Name OnboardCluster -ResourceGroupName <resource group of log analytics workspace> -TemplateFile .\containerSolution.json -TemplateParameterFile .\containerSolutionParams.json
       ```

       The configuration change can take a few minutes to complete. When it's completed, a message is displayed that's similar to the following and includes the result:

       ```powershell
       provisioningState       : Succeeded
       ```

   * To deploy with Azure CLI, run the following commands:

       ```azurecli
       az login
       az account set --name <AzureCloud | AzureChinaCloud | AzureUSGovernment>
       az login
       az account set --subscription "Subscription Name"
       # execute deployment command to add container insights solution to the specified Log Analytics workspace
       az group deployment create --resource-group <resource group of log analytics workspace> --template-file ./containerSolution.json --parameters @./containerSolutionParams.json
       ```

       The configuration change can take a few minutes to complete. When it's completed, a message is displayed that's similar to the following and includes the result:

       ```azurecli
       provisioningState       : Succeeded
       ```

       After you've enabled monitoring, it might take about 15 minutes before you can view health metrics for the cluster.

## Install the chart

To enable the HELM chart, do the following:

1. Add the Azure charts repository to your local list by running the following command:

    ```
    helm repo add incubator https://kubernetes-charts-incubator.storage.googleapis.com/
    ````

2. Install the chart by running the following command:

    ```
    $ helm install --name myrelease-1 \
    --set omsagent.secret.wsid=<your_workspace_id>,omsagent.secret.key=<your_workspace_key>,omsagent.env.clusterName=<my_prod_cluster> incubator/azuremonitor-containers
    ```

    If the Log Analytics workspace is in Azure China, run the following command:

    ```
    $ helm install --name myrelease-1 \
     --set omsagent.domain=opinsights.azure.cn,omsagent.secret.wsid=<your_workspace_id>,omsagent.secret.key=<your_workspace_key>,omsagent.env.clusterName=<your_cluster_name> incubator/azuremonitor-containers
    ```

    If the Log Analytics workspace is in Azure US Government, run the following command:

    ```
    $ helm install --name myrelease-1 \
    --set omsagent.domain=opinsights.azure.us,omsagent.secret.wsid=<your_workspace_id>,omsagent.secret.key=<your_workspace_key>,omsagent.env.clusterName=<your_cluster_name> incubator/azuremonitor-containers
    ```

## Configure agent data collection

Staring with chart version 1.0.0, the agent data collection settings are controlled from the ConfigMap. Refer to documentation about agent data collection settings [here](container-insights-agent-config.md).

After you have successfully deployed the chart, you can review the data for your hybrid Kubernetes cluster in Azure Monitor for containers from the Azure portal.  

>[!NOTE]
>Ingestion latency is around five to ten minutes from agent to commit in the Azure Log Analytics workspace. Status of the cluster show the value **No data** or **Unknown** until all the required monitoring data is available in Azure Monitor.

## Troubleshooting

If you encounter an error while attempting to enable monitoring for your hybrid Kubernetes cluster, copy the PowerShell script [TroubleshootError_nonAzureK8s.ps1](https://raw.githubusercontent.com/microsoft/OMS-docker/ci_feature/Troubleshoot/TroubleshootError_nonAzureK8s.ps1) and save it to a folder on your computer. This script is provided to help detect and fix the issues encountered. The issues it is designed to detect and attempt correction of are the following:

* The specified Log Analytics workspace is valid
* The Log Analytics workspace is configured with the Azure Monitor for Containers solution. If not, configure the workspace.
* OmsAgent replicaset pod are running
* OmsAgent daemonset pod are running
* OmsAgent Health service is running
* The Log Analytics workspace Id and key configured on the containerized agent match with the workspace the Insight is configured with.
* Validate all the Linux worker nodes have `kubernetes.io/role=agent` label to schedule rs pod. If it doesn't exist, add it.
* Validate `cAdvisor port: 10255` is opened on all nodes in the cluster.

To execute with Azure PowerShell, use the following commands in the folder that contains the script:

```powershell
.\TroubleshootError_nonAzureK8s.ps1 - azureLogAnalyticsWorkspaceResourceId </subscriptions/<subscriptionId>/resourceGroups/<resourcegroupName>/providers/Microsoft.OperationalInsights/workspaces/<workspaceName> -kubeConfig <kubeConfigFile>
```

## Next steps

With monitoring enabled to collect health and resource utilization of your hybrid Kubernetes cluster and workloads running on them, learn [how to use](container-insights-analyze.md) Azure Monitor for containers.
