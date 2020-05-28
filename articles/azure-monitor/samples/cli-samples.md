---
title: Azure Monitor CLI samples
description: Sample CLI commands for Azure Monitor features. Azure Monitor is a Microsoft Azure service, which allows you to send alert notifications, call web URLs based on values of configured telemetry data, and autoScale Cloud Services, Virtual Machines, and Web Apps.
ms.subservice: ""
ms.topic: sample
author: bwren
ms.author: bwren
ms.date: 05/16/2018

---

# Azure Monitor CLI samples
This article shows you sample command-line interface (CLI) commands to help you access Azure Monitor features. Azure Monitor allows you to AutoScale Cloud Services, Virtual Machines, and Web Apps and to send alert notifications or call web URLs based on values of configured telemetry data.

## Prerequisites

If you haven't already installed the Azure CLI, follow the instructions for [Install the Azure CLI](/cli/azure/install-azure-cli). You can also use [Azure Cloud Shell](/azure/cloud-shell) to run the CLI as an interactive experience in your browser. See a full reference of all available commands in the [Azure Monitor CLI reference](https://docs.microsoft.com/cli/azure/monitor?view=azure-cli-latest). 

## Log in to Azure
The first step is to log in to your Azure account.

```azurecli
az login
```

After running this command, you have to sign in via the instructions on the screen. All commands work in the context of your default subscription.

To list the details of your current subscription, use the following command.

```azurecli
az account show
```

To change working context to a different subscription, use the following command.

```azurecli
az account set -s <Subscription ID or name>
```

To view a list of all supported Azure Monitor commands, perform the following command.

```azurecli
az monitor -h
```

## View activity log for a subscription

To view a list of activity log events, perform the following command.

```azurecli
az monitor activity-log list
```

Try the following to view all available options.

```azurecli
az monitor activity-log list -h
```

Here is an example to list logs by a resourceGroup

```azurecli
az monitor activity-log list --resource-group <group name>
```

Example to list logs by caller

```azurecli
az monitor activity-log list --caller myname@company.com
```

Example to list logs by caller on a resource type, within a date range

```azurecli
az monitor activity-log list --resource-provider Microsoft.Web \
    --caller myname@company.com \
    --start-time 2016-03-08T00:00:00Z \
    --end-time 2016-03-16T00:00:00Z
```

## Work with alerts 
> [!NOTE]
> Only alerts (classic) is supported in CLI at this time. 

### Get alert (classic) rules in a resource group

```azurecli
az monitor activity-log alert list --resource-group <group name>
az monitor activity-log alert show --resource-group <group name> --name <alert name>
```

### Create a metric alert (classic) rule

```azurecli
az monitor alert create --name <alert name> --resource-group <group name> \
    --action email <email1 email2 ...> \
    --action webhook <URI> \
    --target <target object ID> \
    --condition "<METRIC> {>,>=,<,<=} <THRESHOLD> {avg,min,max,total,last} ##h##m##s"
```

### Delete an alert (classic) rule

```azurecli
az monitor alert delete --name <alert name> --resource-group <group name>
```

## Log profiles

Use the information in this section to work with log profiles.

### Get a log profile

```azurecli
az monitor log-profiles list
az monitor log-profiles show --name <profile name>
```

### Add a log profile with retention

```azurecli
az monitor log-profiles create --name <profile name> --location <location of profile> \
    --locations <locations to monitor activity in: location1 location2 ...> \
    --categories <categoryName1 categoryName2 ...> \
    --days <# days to retain> \
    --enabled true \
    --storage-account-id <storage account ID to store the logs in>
```

### Add a log profile with retention and EventHub

```azurecli
az monitor log-profiles create --name <profile name> --location <location of profile> \
    --locations <locations to monitor activity in: location1 location2 ...> \
    --categories <categoryName1 categoryName2 ...> \
    --days <# days to retain> \
    --enabled true
    --storage-account-id <storage account ID to store the logs in>
    --service-bus-rule-id <service bus rule ID to stream to>
```

### Remove a log profile

```azurecli
az monitor log-profiles delete --name <profile name>
```

## Diagnostics

Use the information in this section to work with diagnostic settings.

### Get a diagnostic setting

```azurecli
az monitor diagnostic-settings list --resource <target resource ID>
```

### Create a diagnostic setting 

```azurecli
az monitor diagnostic-settings create --name <diagnostic name> \
    --storage-account <storage account ID> \
    --resource <target resource object ID> \
    --logs '[
    {
        "category": <category name>,
        "enabled": true,
        "retentionPolicy": {
            "days": <# days to retain>,
            "enabled": true
        }
    }]'
```

### Delete a diagnostic setting

```azurecli
az monitor diagnostic-settings delete --name <diagnostic name> \
    --resource <target resource ID>
```

## Autoscale

Use the information in this section to work with autoscale settings. You need to modify these examples.

### Get autoscale settings for a resource group

```azurecli
az monitor autoscale list --resource-group <group name>
```

### Get autoscale settings by name in a resource group

```azurecli
az monitor autoscale show --name <settings name> --resource-group <group name>
```

### Set autoscale settings

```azurecli
az monitor autoscale create --name <settings name> --resource-group <group name> \
    --count <# instances> \
    --resource <target resource ID>
```

