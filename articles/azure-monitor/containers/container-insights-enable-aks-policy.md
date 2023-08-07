---
title: Enable the AKS Monitoring Add-on by using Azure Policy
description: This article describes how to enable the AKS Monitoring Add-on by using a custom Azure policy.
ms.topic: conceptual
ms.custom: devx-track-azurecli
ms.date: 08/29/2022
ms.reviewer: viviandiec
---

# Enable the AKS Monitoring Add-on by using Azure Policy
This article describes how to enable the Azure Kubernetes Service (AKS) Monitoring Add-on by using a custom Azure policy.

## Permissions required
The AKS Monitoring Add-on requires the following roles on the managed identity used by Azure Policy:

 - [azure-kubernetes-service-contributor-role](../../role-based-access-control/built-in-roles.md#azure-kubernetes-service-contributor-role)
 - [log-analytics-contributor](../../role-based-access-control/built-in-roles.md#log-analytics-contributor)

The AKS Monitoring Add-on custom policy can be assigned at either the subscription or resource group scope. If the Log Analytics workspace and AKS cluster are in different subscriptions, the managed identity used by the policy assignment must have the required role permissions on both the subscriptions or on the Log Analytics workspace resource. Similarly, if the policy is scoped to the resource group, the managed identity should have the required role permissions on the Log Analytics workspace if the workspace isn't in the selected resource group scope.

## Create and assign a policy definition by using the Azure portal

Use the Azure portal to create and assign a policy definition.

### Create a policy definition

1. Download the Azure custom policy definition to enable the AKS Monitoring Add-on.

    ``` sh
    curl -o azurepolicy.json -L https://aka.ms/aks-enable-monitoring-custom-policy
    ```

1. Go to the [Azure Policy Definitions](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyMenuBlade/Definitions) page. Create a policy definition with the following details on the **Policy definition** page:

    - **Definition location**: Select the Azure subscription where the policy definition should be stored.
    - **Name**: *(Preview)AKS-Monitoring-Addon*
    - **Description**: *Azure custom policy to enable the Monitoring Add-on onto Azure Kubernetes clusters in a specified scope*
    - **Category**: Select **Use existing** and select **Kubernetes** from the dropdown list.
    - **Policy rule**: Remove the existing sample rules and copy the contents of `azurepolicy.json` downloaded in step 1.

### Assign a policy definition to a specified scope

> [!NOTE]
> A managed identity will be created automatically and assigned specified roles in the policy definition.

1. Select the policy definition **(Preview) AKS Monitoring Addon** that you created.
1. Select **Assign** and specify a **Scope** of where the policy should be assigned.
1. Select **Next** and provide the resource ID of the Log Analytics workspace. The resource ID should be in the format `/subscriptions/<SubscriptionId>/resourceGroups/<ResourceGroup>/providers/Microsoft.OperationalInsights/workspaces/<workspaceName>`.
1. Create a remediation task if you want to apply the policy to existing AKS clusters in the selected scope.
1. Select **Review + create** to create the policy assignment.

## Create and assign a policy definition by using the Azure CLI

Use the Azure CLI to create and assign a policy definition.

### Create a policy definition

1. Download the Azure custom policy definition rules and parameter files with the following commands:

    ``` sh
    curl -o azurepolicy.rules.json -L https://aka.ms/aks-enable-monitoring-custom-policy-rules
    curl -o azurepolicy.parameters.json -L https://aka.ms/aks-enable-monitoring-custom-policy-parameters
    ```

1. Create the policy definition with the following command:

    ```azurecli
    az cloud set -n <AzureCloud | AzureChinaCloud | AzureUSGovernment> # set the Azure cloud
    az login # login to cloud environment 
    az account set -s <subscriptionId>
    az policy definition create --name "(Preview)AKS-Monitoring-Addon" --display-name "(Preview)AKS-Monitoring-Addon" --mode Indexed --metadata version=1.0.0 category=Kubernetes --rules azurepolicy.rules.json --params azurepolicy.parameters.json
    ```

### Assign a policy definition to a specified scope

Create the policy assignment with the following command:

```azurecli
az policy assignment create --name aks-monitoring-addon --policy "(Preview)AKS-Monitoring-Addon" --assign-identity --identity-scope /subscriptions/<subscriptionId> --role Contributor --scope /subscriptions/<subscriptionId> --location <locatio> --role Contributor --scope /subscriptions/<subscriptionId> -p "{ \"workspaceResourceId\": { \"value\":  \"/subscriptions/<subscriptionId>/resourcegroups/<resourceGroupName>/providers/microsoft.operationalinsights/workspaces/<workspaceName>\" } }"
```

## Next steps

- Learn more about [Azure Policy](../../governance/policy/overview.md).
- Learn how [remediation access control works](../../governance/policy/how-to/remediate-resources.md#how-remediation-access-control-works).
- Learn more about [Container insights](./container-insights-overview.md).
- Install the [Azure CLI](/cli/azure/install-azure-cli).
