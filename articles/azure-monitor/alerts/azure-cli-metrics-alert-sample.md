---
title: Create metric alert monitors in Azure CLI
description: Learn how to create metric alerts in Azure Monitor with Azure CLI commands. These samples create alerts for a virtual machine and an App Service Plan.
ms.topic: sample
ms.date: 11/16/2023
ms.custom: devx-track-azurecli

---

# Create metric alert in Azure CLI

These samples create metric alert monitors in Azure Monitor by using Azure CLI commands. The first sample creates an alert for a virtual machine. The second command creates an alert that includes a dimension for an App Service Plan.  

[!INCLUDE [Prepare your Azure CLI environment](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Create an alert

This alert monitors an existing virtual machine named `VM07` in the resource group named `ContosoVMRG`.

You can create a resource group by using the [az group create](/cli/azure/group#az-group-create) command. For information about creating virtual machines, see [Create a Windows virtual machine with the Azure CLI](../../virtual-machines/windows/quick-create-cli.md),  [Create a Linux virtual machine with the Azure CLI](../../virtual-machines/linux/quick-create-cli.md), and the [az vm create](/cli/azure/vm#az-vm-create) command.

```azurecli
# resource group name: ContosoVMRG
# virtual machine name: VM07

# Create scope
scope=$(az vm show --resource-group ContosoVMRG --name VM07 --output tsv --query id)

# Create action
action=$(az monitor action-group create --name ContosoWebhookAction \
  --resource-group ContosoVMRG --output tsv --query id \
  --action webhook https://alerts.contoso.com usecommonalertschema)

# Create condition
condition=$(az monitor metrics alert condition create --aggregation Average \
  --metric "Percentage CPU" --op GreaterThan --type static --threshold 90 --output tsv)

# Create metrics alert
az monitor metrics alert create --name alert-01 --resource-group ContosoVMRG \
  --scopes $scope --action $action --condition $condition --description "Test High CPU"
```

This sample uses the `tsv` output type, which doesn't include unwanted symbols such as quotation marks. For more information, see [Use Azure CLI effectively](/cli/azure/use-cli-effectively).

## Create an alert with a dimension

This sample creates an App Service Plan and then creates a metrics alert for it. The example uses a dimension to specify that all instances of the App Service Plan will fall under this metric. The sample creates a resource group and application service plan.

```azurecli
# Create resource group
az group create --name ContosoRG --location eastus2
 
# Create application service plan
az appservice plan create --resource-group ContosoRG --name ContosoAppServicePlan \
   --is-linux --number-of-workers 4 --sku S1 
 
# Create scope
scope=$(az appservice plan show --resource-group ContosoRG --name ContosoAppServicePlan \
   --output tsv --query id) 
 
# Create dimension
dim01=$(az monitor metrics alert dimension create --name Instance --value * --op Include --output tsv)
 
# Create condition
condition=$(az monitor metrics alert condition create --aggregation Average \
   --metric CpuPercentage --op GreaterThan --type static --threshold 90 \
   --dimension $dim01 --output tsv)
```

To see a list of the possible metrics, run the [az monitor metrics list-definitions](/cli/azure/monitor/metrics#az-monitor-metrics-list-definitions) command. The `--output` parameter displays the values in a readable format.


```azurecli
az monitor metrics list-definitions --resource $scope --output table 
 
# Create metrics alert
az monitor metrics alert create --name alert-02 --resource-group ContosoRG \
   --scopes $scope --condition $condition --description "Service Plan High CPU"
```

## Clean up deployment

If you created resource groups to test these commands, you can remove a resource group and all its contents by using the [az group delete](/cli/azure/group#az-group-delete) command:

```azurecli
az group delete --name ContosoVMRG

az group delete --name ContosoRG
```

If you used existing resources that you want to keep, use the [az monitor metrics alert delete](/cli/azure/monitor/metrics/alert#az-monitor-metrics-alert-delete) command to delete your practice alerts:

```azurecli
az monitor metrics alert delete --name alert-01

az monitor metrics alert delete --name alert-02
```

## Azure CLI commands used in this article

This article uses the following Azure CLI commands:

- [az appservice plan create](/cli/azure/appservice/plan#az-appservice-plan-create)
- [az appservice plan show](/cli/azure/appservice/plan#az-appservice-plan-show)
- [az group create](/cli/azure/group#az-group-create)
- [az group delete](/cli/azure/group#az-group-delete)
- [az monitor action-group create](/cli/azure/monitor/action-group#az-monitor-action-group-create)
- [az monitor metrics alert condition create](/cli/azure/monitor/metrics/alert#az-monitor-metrics-alert-condition-create)
- [az monitor metrics alert create](/cli/azure/monitor/metrics/alert#az-monitor-metrics-alert-create)
- [az monitor metrics alert delete](/cli/azure/monitor/metrics/alert#az-monitor-metrics-alert-delete)
- [az monitor metrics alert dimension create](/cli/azure/monitor/metrics/alert#az-monitor-metrics-alert-dimension-create)
- [az monitor metrics list-definitions](/cli/azure/monitor/metrics#az-monitor-metrics-list-definitions)
- [az vm show](/cli/azure/vm#az-vm-show)

## Next steps

- [Azure Monitor CLI samples](../cli-samples.md)
- [Understand how metric alerts work in Azure Monitor](alerts-metric-overview.md)
