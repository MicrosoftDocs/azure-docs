---
title: Azure Monitoring and Linux Virtual Machines | Microsoft Docs
description: Tutorial - Monitor a Linux Virtual Machine with the Azure CLI 
services: virtual-machines-linux
documentationcenter: virtual-machines
author: davidmu1
manager: timlt
editor: tysonn
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 05/03/2017
ms.author: davidmu
---

# Monitor a Linux Virtual Machine with the Azure CLI

[Azure Monitor](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview) can be used to investigate diagnostics data that can be collected on a Linux Virtual Machine (VM). and. You learn how to:

> [!div class="checklist"]
> * Create a resource group and VM 
> * Enable boot diagnostics on the VM
> * View boot diagnostics
> * View host metrics
> * Install the diagnostics extension
> * View VM metrics
> * View activity log
> * Create an alert
> * Set up advanced monitoring

The steps in this tutorial can be completed using the latest [Azure CLI 2.0](/cli/azure/install-azure-cli).

## Create VM

Before you can create any other Azure resources, you need to create a resource group with az group create. The following example creates a resource group named `myResourceGroupMonitor` in the `eastus` location:

```azurecli
az group create --name myResourceGroupMonitor --location eastus
```

Create `myMonitorVM` with [az vm create](https://docs.microsoft.com/cli/azure/vm#create):

```azurecli
az vm create \
  --resource-group myResourceGroupMonitor \
  --name myMonitorVM \
  --image UbuntuLTS \
  --generate-ssh-keys
```

## Enable boot diagnostics

There can be many reasons why a VM gets into a non-bootable state. Using boot diagnostics, you can easily diagnose and recover your VM from boot failures. Boot diagnostics are not automatically enabled when you create a Linux VM.

Before you can enable boot diagnostics, you will need a storage account in `myResourceGroupMonitor` to store the data that is collected. You can create a storage account named `mydiagnosticsstorage` with [az storage account create](https://docs.microsoft.com/cli/azure/storage/account#create):

```azurecli
az storage account create \
  --resource-group myResourceGroupMonitor \
  --name mydiagnosticsstorage \
  --sku Standard_LRS \
  --location eastus
```

**Note:** Storage account names must be between 3 and 24 characters and must contain only numbers and lowercase letters.

Now you can enable boot diagnostics with [az vm boot-diagnostics enable](https://docs.microsoft.com/cli/azure/vm/boot-diagnostics#enable):

```azurecli
az vm boot-diagnostics enable \
  --resource-group myResourceGroupMonitor \
  --name myMonitorVM \
  --storage https://mydiagnosticsstorage.blob.core.windows.net/
```

## View boot diagnostics

When boot diagnostics are enabled, each time you stop and start the VM, information about the boot process is written to a log file.

You can get the boot diagnostic data from `myMonitorVM` with [az vm boot-diagnostics get-boot-log](https://docs.microsoft.com/cli/azure/vm/boot-diagnostics#get-boot-log):

```azurecli
az vm boot-diagnostics get-boot-log \
  -–resource-group myResourceGroupMonitor \
  -–name myMonitorVM
```

## View host metrics

A Linux VM has a dedicated Host VM in Azure that it interacts with. Metrics are automatically collected for the Host VM that you can easily view in the Azure portal.

1. In the Azure portal, click **Resource Groups**, select **myResourceGroupMonitor**, and then select **myMonitorVM** in the resource list.
2. Click **Metrics** on the VM blade, and then select any of the Host metrics under **Available metrics** to see how the Host VM is performing.

![View host metrics](./media/tutorial-monitoring/tutorial-monitor-host-metrics.png)

## Install diagnostics extension

[Azure Diagnostics](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview-of-diagnostic-logs) enables the collection of diagnostic data on a VM. You can use the same storage account that you created for boot diagnostics to collect diagnostics data.

You can get the default diagnostics configuration with [az vm diagnostics get-default-config](https://docs.microsoft.com/cli/azure/vm/diagnostics#get-default-config). You can get the primary access key for your storage account with [az storage account keys list](https://docs.microsoft.com/cli/azure/storage/account/keys#list):

```azurecli
default_config=$(az vm diagnostics get-default-config --query "merge(@, {storageAccount: 'mydiagnosticsstorage'})")
storage_key=$(az storage account keys list -g myRGMonitor -n mydiagnosticsstorage --query "[?keyName=='key1'] | [0].value" -o tsv)
settings="{'storageAccountName': 'mydiagnosticsstorage', 'storageAccountKey': '${storage_key}'}"
```

Now you can install the extension using the diagnostics configuration and settings with [az vm diagnostics set](https://docs.microsoft.com/cli/azure/vm/diagnostics#set):

```azurecli
az vm diagnostics set \
  --settings "${default_config}" \
  --protected-settings "${settings}" \
  --vm-name myMonitorVM \
  --resource-group myResourceGroupMonitor
```

## View VM metrics

You can view the VM metrics in the same way that you viewed the Host VM metrics:

1. In the Azure portal, click **Resource Groups**, select **myResourceGroupMonitor**, and then select **myMonitorVM** in the resource list.
2. Click **Metrics** on the VM blade, and then select any of the diagnostics metrics under **Available metrics** to see how the VM is performing.

## View activity log

The [Azure Activity Log](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview-activity-logs) is a log that provides insight into the operations that were performed on your VM. Using the Activity Log, you can determine the 'what, who, and when' for any write operations taken on the resources in your subscription. You can also understand the status of the operation and other relevant properties.

Before running [az monitor activity-log list](https://docs.microsoft.com/en-us/cli/azure/monitor/activity-log#list), replace {sub-id} with the identifier of your Azure subscription:

```azurecli
az monitor activity-log list \
  --resource-id '/subscriptions/{sub-id}/resourceGroups/myResourceGroupMonitor/providers/Microsoft.Compute/virtualMachines/myMonitorVM'
```

## Create alerts

Alerts are a method of monitoring Azure resource metrics, events, or logs and being notified when a condition you specify is met. In this section, you create an alert that sends email when the percentage of CPU usage goes over the threshold of 1

Before creating an alert with [az monitor alert-rules create](https://docs.microsoft.com/cli/azure/monitor/alert-rules#create), replace {sub-id} with the identifier of your Azure subscription:

```azurecli
az monitor alert-rules create \
  --alert-rule-resource-name cpu-alert \
  --resource-group myResourceGroupMonitor \
  --location eastus \
  --is-enabled true \
  --condition '{"odatatype": "Microsoft.Azure.Management.Insights.Models.ThresholdRuleCondition", "data_source": { "odatatype": "Microsoft.Azure.Management.Insights.Models.RuleMetricDataSource", "resource_uri": "/subscriptions/{sub-id}/resourceGroups/myResourceGroupMonitor/providers/Microsoft.Compute/virtualMachines/myMonitorVM", "metric_name": "Percentage CPU", }, "operator": "GreaterThan", "threshold": 1, "window_size": "PT5M"}' 
  --actions '[{"odatatype": "Microsoft.Azure.Management.Insights.Models.RuleEmailAction", "send_to_service_owners": true}]'
  ```

## Advanced monitoring 

You can do more advanced monitoring of your VM by using [Operations Management Suite](https://docs.microsoft.com/azure/operations-management-suite/operations-management-suite-overview). If you haven't already done so, you can sign up for a [free trial](https://www.microsoft.com/en-us/cloud-platform/operations-management-suite-trial) of Operations Management Suite.

When you have access to the OMS portal, you can find the workspace key and workspace identifier on the Settings blade. Replace <workspace-key> and <workspace-id> with the values for from your OMS workspace and then you can use **az vm extension set** to add the OMS extension to the VM:

```azurecli
az vm extension set \
  --resource-group myResourceGroupMonitor \
  --vm-name myMonitorVM \
  --name OmsAgentForLinux \
  --publisher Microsoft.EnterpriseCloud.Monitoring \
  --version 1.3 \
  --protected-settings '{"workspaceKey": "<workspace-key>"}' \
  --settings '{"workspaceId": "<workspace-id>"}'
```

On the Log Search blade of the OMS portal, you should see `myMonitorVM` such as what is shown in the following picture:

![OMS blade](./media/tutorial-monitoring/tutorial-monitor-oms.png)