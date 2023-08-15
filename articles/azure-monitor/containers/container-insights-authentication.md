---
title: Configure agent authentication for the Container Insights agent | Microsoft Docs
description: This article describes how to configure authentication for the containerized agent used by Container insights.
ms.topic: conceptual
ms.date: 07/31/2023
ms.reviewer: aul
---

# Authentication for Container Insights 

Container Insights now defaults to managed identity authentication. This secure and simplified authentication model has a monitoring agent that uses the cluster's managed identity to send data to Azure Monitor. It replaces the existing legacy certificate-based local authentication and removes the requirement of adding a Monitoring Metrics Publisher role to the cluster.

> [!Note] 
> [ContainerLogV2](container-insights-logging-v2.md) will be default schema for customers who will be onboarding container insights with Managed Identity Auth using ARM, Bicep, Terraform, Policy and Portal onboarding. ContainerLogV2 can be explicitly enabled through CLI version 2.51.0 or higher using Data collection settings.

## How to enable

Click on the relevant tab for instructions to enable Managed identity authentication on your clusters.  

## [Azure portal](#tab/portal-azure-monitor)

When creating a new cluster from the Azure portal: On the **Integrations** tab, first check the box for *Enable Container Logs*, then check the box for *Use managed identity*.  

:::image type="content" source="./media/container-insights-authentication/aks-cluster-creation.png" alt-text="Screenshot that shows the checkbox to select." lightbox="media/container-insights-authentication/aks-cluster-creation.png":::

For existing clusters, you can switch to Managed Identity authentication from the *Monitor settings* panel: Navigate to your AKS cluster, scroll through the menu on the left till you see the **Monitoring** section, there click on the **Insights** tab. In the Insights tab, click on the *Monitor Settings* option and check the box for *Use managed identity*

:::image type="content" source="./media/container-insights-authentication/monitor-settings.png" alt-text="Screenshot that shows the settings panel." lightbox="media/container-insights-authentication/monitor-settings.png":::

If you don't see the *Use managed identity* option, you are using an SPN cluster. In that case, you must use command line tools to migrate. See other tabs for migration instructions and templates.

## [Azure CLI](#tab/cli)

See [Migrate to managed identity authentication](container-insights-enable-aks.md?tabs=azure-cli#migrate-to-managed-identity-authentication)

## [Resource Manager template](#tab/arm)

See instructions for migrating 

* [AKS clusters](container-insights-enable-aks.md?tabs=arm#existing-aks-cluster)
* [Arc-enabled clusters](container-insights-enable-arc-enabled-clusters.md?tabs=create-cli%2Cverify-portal%2Cmigrate-arm)

## [Bicep](#tab/bicep)

**Enable Monitoring with MSI without syslog** 

1.	Download Bicep templates and Parameter files 

```
curl  -L https://aka.ms/enable-monitoring-msi-bicep-template -o existingClusterOnboarding.bicep 
curl  -L https://aka.ms/enable-monitoring-msi-bicep-parameters -o existingClusterParam.json
```

2.	Edit the values in the parameter file
 
 - **aksResourceId**: Use the values on the AKS Overview page for the AKS cluster.
 - **aksResourceLocation**: Use the values on the AKS Overview page for the AKS cluster.
 - **workspaceResourceId**: Use the resource ID of your Log Analytics workspace.
 - **workspaceRegion**: Use the location of your Log Analytics workspace.
 - **resourceTagValues**: Match the existing tag values specified for the existing Container insights extension data collection rule (DCR) of the cluster and the name of the DCR. The name will match `MSCI-<clusterName>-<clusterRegion>` and this resource is created in the same resource group as the AKS clusters. For first time onboarding, you can set the arbitrary tag values.
 - **enabledContainerLogV2**: Set this parameter value to be true to use the default recommended ContainerLogV2 schema
 - Other parameters are for cost optimization, refer to [this guide](container-insights-cost-config.md?tabs=create-CLI#data-collection-parameters)

3.	Onboard with the following commands:

```
az login
az account set --subscription "Subscription Name"
az deployment group create --resource-group <ClusterResourceGroupName> --template-file ./existingClusterOnboarding.bicep --parameters ./existingClusterParam.json
```

**Enable Monitoring with MSI with syslog**

1.	Download Bicep templates and Parameter files 

```
 	curl  -L https://aka.ms/enable-monitoring-msi-syslog-bicep-template  -o existingClusterOnboarding.bicep 
 	curl  -L https://aka.ms/enable-monitoring-msi-syslog-bicep-parameters -o existingClusterParam.json
```

2.	Edit the values in the parameter file

- **aksResourceId**: Use the values on the AKS Overview page for the AKS cluster.
- **aksResourceLocation**: Use the values on the AKS Overview page for the AKS cluster.
- **workspaceResourceId**: Use the resource ID of your Log Analytics workspace.
- **workspaceRegion**: Use the location of your Log Analytics workspace.
- **resourceTagValues**: Match the existing tag values specified for the existing Container insights extension data collection rule (DCR) of the cluster and the name of the DCR. The name match `MSCI-<clusterName>-<clusterRegion>` and this resource is created in the same resource group as the AKS clusters. For first time onboarding, you can set the arbitrary tag values.
- - **enabledContainerLogV2**: Set this parameter value to be true to use the default recommended ContainerLogV2 

3.	Onboarding with the following commands:

```
az login
az account set --subscription "Subscription Name"
az deployment group create --resource-group <ClusterResourceGroupName> --template-file ./existingClusterOnboarding.bicep --parameters ./existingClusterParam.json
```

For new AKS cluster:
Replace and use the managed cluster resources in this [guide](../../aks/learn/quick-kubernetes-deploy-bicep.md?tabs=azure-cli)


## [Terraform](#tab/terraform)

**Enable Monitoring with MSI without syslog for new AKS cluster**

1.	Download Terraform template for enable monitoring msi with syslog enabled:
https://aka.ms/enable-monitoring-msi-terraform
2.	Adjust the azurerm_kubernetes_cluster resource in main.tf based on what cluster settings you're going to have
3.	Update parameters in variables.tf to replace values in "<>"
 - **aks_resource_group_name**: Use the values on the AKS Overview page for the resource group.
 - **resource_group_location**: Use the values on the AKS Overview page for the resource group.
 - **cluster_name**: Define the cluster name that you would like to create
 - **workspace_resource_id**: Use the resource ID of your Log Analytics workspace.
 - **workspace_region**: Use the location of your Log Analytics workspace.
 - **resource_tag_values**: Match the existing tag values specified for the existing Container insights extension data collection rule (DCR) of the cluster and the name of the DCR. The name match `MSCI-<clusterName>-<clusterRegion>` and this resource is created in the same resource group as the AKS clusters. For first time onboarding, you can set the arbitrary tag values.
 - - **enabledContainerLogV2**: Set this parameter value to be true to use the default recommended ContainerLogV2 
 - Other parameters are for cluster settings or cost optimization, refer to [this guide](container-insights-cost-config.md?tabs=create-CLI#data-collection-parameters)
4.	Run `terraform init -upgrade` to initialize the Terraform deployment.
5.	Run `terraform plan -out main.tfplan` to initialize the Terraform deployment.
6.	Run `terraform apply main.tfplan` to apply the execution plan to your cloud infrastructure.

**Enable Monitoring with MSI with syslog for new AKS cluster** 
1.	Download Terraform template for enable monitoring msi with syslog enabled:
https://aka.ms/enable-monitoring-msi-syslog-terraform
2.	Adjust the azurerm_kubernetes_cluster resource in main.tf based on what cluster settings you're going to have
3.	Update parameters in variables.tf to replace values in "<>"
 - **aks_resource_group_name**: Use the values on the AKS Overview page for the resource group.
 - **resource_group_location**: Use the values on the AKS Overview page for the resource group.
 - **cluster_name**: Define the cluster name that you would like to create
 - **workspace_resource_id**: Use the resource ID of your Log Analytics workspace.
 - **workspace_region**: Use the location of your Log Analytics workspace.
 - **resource_tag_values**: Match the existing tag values specified for the existing Container insights extension data collection rule (DCR) of the cluster and the name of the DCR. The name match `MSCI-<clusterName>-<clusterRegion>` and this resource is created in the same resource group as the AKS clusters. For first time onboarding, you can set the arbitrary tag values.
 - Other parameters are for cluster settings, refer [to guide](container-insights-cost-config.md?tabs=create-CLI#data-collection-parameters)
4.	Run `terraform init -upgrade` to initialize the Terraform deployment.
5.	Run `terraform plan -out main.tfplan` to initialize the Terraform deployment.
6.	Run `terraform apply main.tfplan` to apply the execution plan to your cloud infrastructure.

**Enable Monitoring with MSI for existing AKS cluster:**
1.	Import the existing cluster resource first with this command: ` terraform import azurerm_kubernetes_cluster.k8s <aksResourceId>`
2.	Add the oms_agent add-on profile to the existing azurerm_kubernetes_cluster resource.
```
oms_agent {
    log_analytics_workspace_id = var.workspace_resource_id
    msi_auth_for_monitoring_enabled = true
  }
```
3.	Copy the dcr and dcra resources from the Terraform templates
4.	Run `terraform plan -out main.tfplan` and make sure the change is adding the oms_agent property. Note: If the azurerm_kubernetes_cluster resource defined is different during terraform plan, the existing cluster will get destroyed and recreated.
5.	Run `terraform apply main.tfplan` to apply the execution plan to your cloud infrastructure.

> [!TIP]
> - Edit the `main.tf` file appropriately before running the terraform template
> - Data will start flowing after 10 minutes since the cluster needs to be ready first
> - WorkspaceID needs to match the format `/subscriptions/12345678-1234-9876-4563-123456789012/resourceGroups/example-resource-group/providers/Microsoft.OperationalInsights/workspaces/workspaceValue`
> - If resource group already exists, run `terraform import azurerm_resource_group.rg /subscriptions/<Subscription_ID>/resourceGroups/<Resource_Group_Name>` before terraform plan

## [Azure Policy](#tab/policy)

1. Download Azure Policy templates and parameter files using the following commands: 

```
curl  -L https://aka.ms/enable-monitoring-msi-azure-policy-template -o azure-policy.rules.json 
curl  -L https://aka.ms/enable-monitoring-msi-azure-policy-parameters -o azure-policy.parameters.json
```


2. Activate the policies: 

You can create the policy definition using a command:
```
az policy definition create --name "AKS-Monitoring-Addon-MSI" --display-name "AKS-Monitoring-Addon-MSI" --mode Indexed --metadata version=1.0.0 category=Kubernetes --rules azure-policy.rules.json --params azure-policy.parameters.json
```
You can create the policy assignment with the following command like:
```
az policy assignment create --name aks-monitoring-addon --policy "AKS-Monitoring-Addon-MSI" --assign-identity --identity-scope /subscriptions/<subscriptionId> --role Contributor --scope /subscriptions/<subscriptionId> --location <location> --role Contributor --scope /subscriptions/<subscriptionId> -p "{ \"workspaceResourceId\": { \"value\":  \"/subscriptions/<subscriptionId>/resourcegroups/<resourceGroupName>/providers/microsoft.operationalinsights/workspaces/<workspaceName>\" } }"
```

> [!TIP]
> - Make sure when performing remediation task, the policy assignment has access to workspace you specified.
> - Download all files under AddonPolicyTemplate folder before running the policy template.
> - For assign policy, parameters and remediation task from portal, use the following guides:
>  o	After creating the policy definition through the above command, go to Azure portal -> Policy -> Definitions and select the definition you created.
>  o	Click on 'Assign' and then go to the 'Parameters' tab and fill in the details. Then click 'Review + Create'.
>  o	Once the policy is assigned to the subscription, whenever you create a new cluster, the policy will run and check if Container Insights is enabled. If not, it will deploy the resource. If you want to apply the policy to existing AKS cluster, create a 'Remediation task' for that resource after going to the 'Policy Assignment'.

---

## Limitations 
1.	Ingestion Transformations are not supported: See [Data collection transformation](../essentials/data-collection-transformations.md) to read more.    
2.	Dependency on DCR/DCRA for region availability - For new AKS region, there might be chances that DCR is still not supported in the new region. In that case, onboarding Container Insights with MSI will fail. One workaround is to onboard to Container Insights through CLI with the old way (with the use of Container Insights solution)

## Timeline  
Any new clusters being created or being onboarded now default to Managed Identity authentication. However, existing clusters with legacy solution-based authentication are still supported.  

## Next steps
If you experience issues when you upgrade the agent, review the [troubleshooting guide](container-insights-troubleshoot.md) for support.
