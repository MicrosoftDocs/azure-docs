---
title: Enable AKS Monitoring Addon using Azure Policy
description: Describes how to enable AKS Monitoring Addon using Azure Custom Policy.
ms.topic: conceptual
ms.date: 08/29/2022
ms.reviewer: viviandiec
---

# Enable AKS monitoring addon using Azure Policy
This article describes how to enable AKS Monitoring Addon using Azure Custom Policy. 

## Permissions required
Monitoring Addon require following roles on the managed identity used by Azure Policy:

 - [azure-kubernetes-service-contributor-role](../../role-based-access-control/built-in-roles.md#azure-kubernetes-service-contributor-role)
 - [log-analytics-contributor](../../role-based-access-control/built-in-roles.md#log-analytics-contributor)

Monitoring Addon Custom Policy can be assigned at either the subscription or resource group scope. If the Log Analytics workspace and AKS cluster are in different subscriptions, then the managed identity used by the policy assignment must have the required role permissions on both the subscriptions or on the Log Analytics workspace resource. Similarly, if the policy is scoped to the resource group, then the managed identity should have the required role permissions on the Log Analytics workspace if the workspace is not in the selected resource group scope.


## Create and assign policy definition using Azure portal

### Create policy definition

1. Download the Azure Custom Policy definition to enable AKS Monitoring Addon.
 
    ``` sh
    curl -o azurepolicy.json -L https://aka.ms/aks-enable-monitoring-custom-policy
    ```

3. Navigate to https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyMenuBlade/Definitions and create policy definition  with the following details in the Policy definition  create dialogue box.
 
    - **Definition location**: Choose the Azure subscription where the policy definition should be stored.
    - **Name**: *(Preview)AKS-Monitoring-Addon*
    - **Description**: *Azure Custom Policy to enable Monitoring Addon onto Azure Kubernetes Cluster(s) in specified scope*
    - **Category**: Choose *use existing* and pick *Kubernetes* from drop-down.
    - **Policy Rule**: Remove the existing sample rules and copy the contents of *azurepolicy.json* downloaded in step #1 above.

### Assign policy definition to specified scope

> [!NOTE]
>  Managed identity will be created automatically and assigned specified roles in the Policy definition.

1. Select the policy definition *(Preview) AKS Monitoring Addon* that you just created.
4. Click *Assign*** and specify a **Scope** of where the policy should be assigned. 
5. Click **Next** and provide the Resource ID of the Azure Log Analytics Workspace. The Resource ID should be in this format `/subscriptions/<SubscriptionId>/resourceGroups/<ResourceGroup>/providers/Microsoft.OperationalInsights/workspaces/<workspaceName>`.
6. Create a remediation task in case if you want to apply to policy to existing AKS clusters in the selected scope.
7. Click **Review + Create** option to create the policy assignment.
   
## Create and assign policy definition using Azure CLI

### Create policy definition

1. Download the Azure custom policy definition rules and parameters files with the following commands:

    ``` sh
    curl -o azurepolicy.rules.json -L https://aka.ms/aks-enable-monitoring-custom-policy-rules
    curl -o azurepolicy.parameters.json -L https://aka.ms/aks-enable-monitoring-custom-policy-parameters
    ```

2. Create the policy definition with the following command:

    ```azurecli
    az cloud set -n <AzureCloud | AzureChinaCloud | AzureUSGovernment> # set the Azure cloud
    az login # login to cloud environment 
    az account set -s <subscriptionId>
    az policy definition create --name "(Preview)AKS-Monitoring-Addon" --display-name "(Preview)AKS-Monitoring-Addon" --mode Indexed --metadata version=1.0.0 category=Kubernetes --rules azurepolicy.rules.json --params azurepolicy.parameters.json
    ```

### Assign policy definition to specified scope

- Create  the policy assignment with the following command:

    ```azurecli
    az policy assignment create --name aks-monitoring-addon --policy "(Preview)AKS-Monitoring-Addon" --assign-identity --identity-scope /subscriptions/<subscriptionId> --role Contributor --scope /subscriptions/<subscriptionId> --location <locatio> --role Contributor --scope /subscriptions/<subscriptionId> -p "{ \"workspaceResourceId\": { \"value\":  \"/subscriptions/<subscriptionId>/resourcegroups/<resourceGroupName>/providers/microsoft.operationalinsights/workspaces/<workspaceName>\" } }"
    ```

## Next steps

- Learn more about [Azure Policy](../../governance/policy/overview.md).
- Learn how [remediation access control works](../../governance/policy/how-to/remediate-resources.md#how-remediation-access-control-works).
- Learn more about [Container insights](./container-insights-overview.md).
- Install the [Azure CLI](/cli/azure/install-azure-cli).
