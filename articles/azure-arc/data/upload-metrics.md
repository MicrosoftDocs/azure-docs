---
title: Upload usage data, metrics, and logs to Azure Monitor
description: Upload resource inventory, usage data, metrics, and logs to Azure Monitor
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 09/22/2020
ms.topic: how-to
zone_pivot_groups: client-operating-system-macos-and-linux-windows-powershell
---

# Upload metrics, and logs to Azure Monitor

Periodically, you can export out usage information for billing purposes, monitoring metrics, and logs and then upload it to Azure. The export and upload of any of these three types of data will also create and update the data controller, SQL managed instance, and PostgreSQL Hyperscale server group resources in Azure.

> [!NOTE] 
> During the preview period, there is no cost for using Azure Arc enabled data services.

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

## Prerequisites

[!INCLUDE [arc-data-upload-prerequisites](includes/arc-data-upload-prerequisites.md)]

## Create service principal

[!INCLUDE [arc-data-create-service-principal](includes/arc-data-create-service-principal.md)]

## Upload metrics

With Azure Arc data services, you can optionally upload your metrics to Azure Monitor so you can aggregate and analyze metrics, raise alerts, send notifications, or trigger automated actions. 

Sending your data to Azure Monitor also allows you to store monitoring and logs data off-site and at huge scale enabling long-term storage of the data for advanced analytics.

If you have multiple sites that have Azure Arc data services, you can use Azure Monitor as a central location to collect all of your logs and metrics across your sites.

### Before you begin

There are a few one-time setup steps required to enable the logs and metrics upload scenarios:

1. [Create a service principal](#create-a-service-principal) (Azure Active Directory application) including creating a client access secret.
1. [Assign the service principal to the `Monitoring Metrics Publisher` role](#assign-role-to-service-principal) on the subscription(s) where your database instance resources are located.

The first item is required to upload metrics and the second one is required to upload logs.

Follow these commands to create your metrics upload service principal and assign it to the 'Monitoring Metrics Publisher' and 'Contributor' roles so that the service principal can upload metrics and perform create and upload operations.

## Create a service principal

[!INCLUDE [arc-data-create-service-principal](includes/arc-data-create-service-principal.md)]

## Assign roles to the service principal

[!INCLUDE [arc-data-assign-roles-to-service-principal](includes/arc-data-assign-roles-to-service-principal.md)]

## Set final environment variables and confirm

Set the SPN authority URL in an environment variable:

::: zone pivot="client-operating-system-windows-command"

```console
SET SPN_AUTHORITY='https://login.microsoftonline.com'
```

::: zone-end

::: zone pivot="client-operating-system-powershell"

```PowerShell
$Env:SPN_AUTHORITY='https://login.microsoftonline.com'
```

::: zone-end

::: zone pivot="client-operating-system-macos-and-linux"

```console
export SPN_AUTHORITY='https://login.microsoftonline.com'
```

::: zone-end

Check to make sure that all environment variables required are set if you want:


::: zone pivot="client-operating-system-powershell"

```PowerShell
$Env:SPN_TENANT_ID
$Env:SPN_CLIENT_ID
$Env:SPN_CLIENT_SECRET
$Env:SPN_AUTHORITY
```


::: zone-end

::: zone pivot="client-operating-system-macos-and-linux"

```console
echo $SPN_TENANT_ID
echo $SPN_CLIENT_ID
echo $SPN_CLIENT_SECRET
echo $SPN_AUTHORITY
```

::: zone-end

::: zone pivot="client-operating-system-windows-command"

```console
echo %SPN_TENANT_ID%
echo %SPN_CLIENT_ID%
echo %SPN_CLIENT_SECRET%
echo %SPN_AUTHORITY%
```

::: zone-end

## Upload metrics to Azure Monitor

To upload metrics for your Azure arc enabled SQL managed instances and Azure Arc enabled PostgreSQL Hyperscale server groups run, the following CLI commands:

1. Log in to the data controller with `azdata`.
 
1. Export all metrics to the specified file:

   ```console
   azdata arc dc export --type metrics --path metrics.json
   ```

2. Upload metrics to Azure monitor:

   ```console
   azdata arc dc upload --path metrics.json
   ```

   >[!NOTE]
   >Wait for at least 30 mins after the Azure Arc enabled data instances are created for the first upload.
   >
   >Make sure `upload` the metrics right away after `export` as Azure Monitor only accepts metrics for the last 30 minutes. [Learn more](../../azure-monitor/platform/metrics-store-custom-rest-api.md#troubleshooting).


If you see any errors indicating "Failure to get metrics" during export, check if data collection is set to `true` by running the following command:

```console
azdata arc dc config show
```

Look under "security section"

```output
 "security": {
      "allowDumps": true,
      "allowNodeMetricsCollection": true,
      "allowPodMetricsCollection": true,
      "allowRunAsRoot": false
    },
```

Verify if the `allowNodeMetricsCollection` and `allowPodMetricsCollection` properties are set to `true`.

## View the metrics in the Portal

Once your metrics are uploaded, you can view them from the Azure portal.
> [!NOTE]
> Please note that it can take a couple of minutes for the uploaded data to be processed before you can view the metrics in the portal.


To view your metrics in the portal, use this link to open the portal: <https://portal.azure.com>
Then, search for your database instance by name in the search bar:

You can view CPU utilization on the Overview page or if you want more detailed metrics you can click on metrics from the left navigation panel

Choose sql server as the metric namespace:

Select the metric you want to visualize (you can also select multiple):

Change the frequency to last 30 minutes:

> [!NOTE]
> You can only upload metrics only for the last 30 minutes. Azure Monitor rejects metrics older than 30 minutes.

## Automating uploads (optional)

If you want to upload metrics and logs on a scheduled basis, you can create a script and run it on a timer every few minutes. Below is an example of automating the uploads using a Linux shell script.

In your favorite text/code editor, add the following script to the file and save as a script executable file such as .sh (Linux/Mac) or .cmd, .bat, .ps1.

```console
azdata arc dc export --type metrics --path metrics.json --force
azdata arc dc upload --path metrics.json
```

Make the script file executable

```console
chmod +x myuploadscript.sh
```

Run the script every 20 minutes:

```console
watch -n 1200 ./myuploadscript.sh
```

You could also use a job scheduler like cron or Windows Task Scheduler or an orchestrator like Ansible, Puppet, or Chef.

## General guidance on exporting and uploading usage, metrics

Create, read, update, and delete (CRUD) operations on Azure Arc enabled data services are logged for billing and monitoring purposes. There are background services that monitor for these CRUD operations and calculate the consumption appropriately. The actual calculation of usage or consumption happens on a scheduled basis and is done in the background. 

During preview, this process happens nightly. The general guidance is to upload the usage only once per day. When usage information is exported and uploaded multiple times within the same 24 hour period, only the resource inventory is updated in Azure portal but not the resource usage.

For uploading metrics, Azure monitor only accepts the last 30 minutes of data ([Learn more](../../azure-monitor/platform/metrics-store-custom-rest-api.md#troubleshooting)). The guidance for uploading metrics is to upload the metrics immediately after creating the export file so you can view the entire data set in Azure portal. For instance, if you exported the metrics at 2:00 PM and ran the upload command at 2:50 PM. Since Azure Monitor only accepts data for the last 30 minutes, you may not see any data in the portal. 

## Next steps

[Upload billing data to Azure and view it in the Azure portal](view-billing-data-in-azure.md)

[View Azure Arc data controller resource in Azure portal](view-data-controller-in-azure-portal.md)
