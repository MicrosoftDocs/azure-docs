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
zone_pivot_groups: client-operating-system
---

# Upload usage data, metrics, and logs to Azure Monitor

Periodically, you can export out usage information. The export and upload of of this information creates and update the data controller, SQL managed instance, and PostgreSQL Hyperscale server group resources in Azure.

> [!NOTE] 
> During the preview period, there is no cost for using Azure Arc enabled data services.

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]


## Prerequisites

[!INCLUDE [arc-data-upload-prerequisites](includes/arc-data-upload-prerequisites.md)]

> [!NOTE]
> Please wait for at least 24 hours after creating the Azure Arc data controller before uploading usage data.

## Create service principal and assign roles

[!INCLUDE [arc-data-create-service-principal](includes/arc-data-create-service-principal.md)]

## Upload usage data

Usage information such as inventory and resource usage can be uploaded to Azure in the following two-step way:

1. Log in to the data controller. Enter the values at the prompt. 

   ```console
   azdata login
   ```

1. Export the usage data using `azdata arc dc export` command, as follows:

   ```console
   azdata arc dc export --type usage --path usage.json
   ```
 
  This command creates a `usage.json` file with all the Azure Arc enabled data resources such as SQL managed instances and PostgreSQL Hyperscale instances etc. that are created on the data controller.

2. Upload the usage data using ```azdata upload``` command

   ```console
   azdata arc dc upload --path usage.json
   ```

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
