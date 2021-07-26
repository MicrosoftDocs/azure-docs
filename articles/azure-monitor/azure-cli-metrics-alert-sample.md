---
title: 
description: 
ms.topic: sample
author: bwren
ms.author: bwren
ms.date:  
ms.custom: devx-track-azurecli

---

#

[!INCLUDE [Prepare your Azure CLI environment](../../include/azure-cli-prepare-your-environment.md)]

## Sample commands



### Create alert

This alert monitors an existing virtual machine, named `VM07` in the resource group named `ContosoVMRG`. 

You can create a resource group by using the [az group create](/cli/azure/group#az-group-create) command. For information about creating virtual machines, see [Create a Windows virtual machine with the Azure CLI](../../virtual-machines/windows/quick-create-cli.md),  [Create a Linux virtual machine with the Azure CLI](../../virtual-machines/linux/quick-create-cli.md), and the [az vm create](/cli/azure/vm#az-vm-create) command.

```azurecli

# resource group name: ContosoVMRG
# virtual machine name: VM07

scope=$(az vm show --resource-group ContosoVMRG --name VM07 --output tsv --query id)
action=$(az monitor action-group create --name ContosoWebhookAction \
  --resource-group ContosoVMRG --action webhook https://alerts.contoso.com usecommonalertschema)
condition=$(az monitor metrics alert condition create --aggregation Average \
  --metric "Percentage CPU" --op GreaterThan --type static --threshold 90 --output tsv)

az monitor metrics alert create --name alert-01 --resource-group ContosoVMRG \
  --scopes $scope --action $action --condition $condition --description "test High CPU"
```

This sample uses the `tsv` output type, which doesn't include unwanted symbols such as quotation marks. For more information, see [Use Azure CLI effectively](/cli/azure/use-cli-effectively).

### Create alert with dimension

This sample creates an App Service Plan and then creates a metrics alert for it. The example uses a dimension to specify that all instances of the App Service Plan will fall under this metric.  

```azurecli



```

## Clean up deployment

If you created a resource group to test these commands, you can remove the resource group and all its contents by using the [az group delete](/cli/azure/group#az-group-delete) command:

```azurecli
az group delete --name ContosoVMRG
```

If you used existing resources that you want to keep, use the [az monitor metrics alert delete](/cli/azure/monitor/metrics/alert#az-monitor-metrics-alert-delete) command to delete your practice alerts:

```azurecli
az monitor metrics alert delete --name alert-01
```

## Azure CLI commands used in this article

## Next steps