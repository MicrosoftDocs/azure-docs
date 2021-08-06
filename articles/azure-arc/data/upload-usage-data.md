---
title: Upload usage data to Azure
description: Upload usage Azure Arc—enabled data services data to Azure
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 07/30/2021
ms.topic: how-to
zone_pivot_groups: client-operating-system-macos-and-linux-windows-powershell
---

# Upload usage data to Azure

Periodically, you can export out usage information. The export and upload of this information creates and updates the data controller, SQL managed instance, and PostgreSQL Hyperscale server group resources in Azure.

> [!NOTE] 
> During the preview period, there is no cost for using Azure Arc—enabled data services.



> [!NOTE]
> Wait at least 24 hours after creating the Azure Arc data controller before uploading usage data.

## Create service principal and assign roles

Before you proceed, make sure you have created the required service principal and assigned it to an appropriate role. For details, see:
* [Create service principal](upload-metrics-and-logs-to-azure-monitor.md#create-service-principal).
* [Assign roles to the service principal](upload-metrics-and-logs-to-azure-monitor.md#assign-roles-to-the-service-principal)

## Upload usage data

Usage information such as inventory and resource usage can be uploaded to Azure in the following two-step way:

1. Export the usage data using `az arcdata dc export` command, as follows:

> [!NOTE]
> Exporting usage/billing information, metrics, and logs using the command `az arcdata dc export` requires bypassing SSL verification for now.  You will be prompted to bypass SSL verification or you can set the `AZDATA_VERIFY_SSL=no` environment variable to avoid prompting.  There is no way to configure an SSL certificate for the data controller export API currently.

   ```azurecli
   az arcdata dc export --type usage --path usage.json --k8s-namespace <namespace> --use-k8s
   ```
 
   This command creates a `usage.json` file with all the Azure Arc—enabled data resources such as SQL managed instances and PostgreSQL Hyperscale instances etc. that are created on the data controller.

2. Upload the usage data using the `upload` command.

   ```azurecli
   az arcdata dc upload --path usage.json
   ```

## Automating uploads (optional)

If you want to upload metrics and logs on a scheduled basis, you can create a script and run it on a timer every few minutes. Below is an example of automating the uploads using a Linux shell script.

In your favorite text/code editor, add the following script to the file and save as a script executable file such as `.sh` (Linux/Mac) or `.cmd`, `.bat`, or `.ps1`.

```azurecli
az arcdata dc export --type usage --path usage.json --force --k8s-namespace <namespace> --use-k8s
az arcdata dc upload --path usage.json
```

Make the script file executable

```console
chmod +x myuploadscript.sh
```

Run the script every day for usage:

```console
watch -n 1200 ./myuploadscript.sh
```

You could also use a job scheduler like cron or Windows Task Scheduler or an orchestrator like Ansible, Puppet, or Chef.

## Next steps

[Upload metrics, and logs to Azure Monitor](upload-metrics.md)

[Upload logs to Azure Monitor](upload-logs.md)

[Upload billing data to Azure and view it in the Azure portal](view-billing-data-in-azure.md)

[View Azure Arc data controller resource in Azure portal](view-data-controller-in-azure-portal.md)
