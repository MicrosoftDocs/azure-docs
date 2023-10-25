---
title: Upload metrics to Azure Monitor
description: Upload Azure Arc-enabled data services metrics to Azure Monitor
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
ms.custom: devx-track-azurecli
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 11/03/2021
ms.topic: how-to
---

# Upload metrics to Azure Monitor

Periodically, you can export monitoring metrics and then upload them to Azure. The export and upload of data also creates and update the data controller, SQL managed instance, and PostgreSQL server resources in Azure.

With Azure Arc data services, you can optionally upload your metrics to Azure Monitor so you can aggregate and analyze metrics, raise alerts, send notifications, or trigger automated actions. 

Sending your data to Azure Monitor also allows you to store metrics data off-site and at huge scale, enabling long-term storage of the data for advanced analytics.

If you have multiple sites that have Azure Arc data services, you can use Azure Monitor as a central location to collect all of your logs and metrics across your sites.

## Upload metrics for Azure Arc data controller in **direct** mode

In the **direct** connected mode, metrics upload can only be set up in **automatic** mode. This automatic upload of metrics can be set up either during deployment of Azure Arc data controller or post deployment.
The Arc data services extension managed identity is used for uploading metrics. The managed identity needs to have the **Monitoring Metrics Publisher** role assigned to it. 

> [!NOTE]
> If automatic upload of metrics was disabled during Azure Arc Data controller deployment, you must first retrieve the managed identity of the Arc data controller extension and grant **Monitoring Metrics Publisher** role before enabling automatic upload. Follow the steps below to retrieve the managed identity and grant the required roles.   

[!INCLUDE [azure-arc-angle-bracket-example](../../../includes/azure-arc-angle-bracket-example.md)]

### (1) Retrieve managed identity of the Arc data controller extension

# [PowerShell](#tab/powershell)
```azurecli
$Env:MSI_OBJECT_ID = (az k8s-extension show --resource-group <resource group>  --cluster-name <connectedclustername> --cluster-type connectedClusters --name <name of extension> | convertFrom-json).identity.principalId
#Example
$Env:MSI_OBJECT_ID = (az k8s-extension show --resource-group myresourcegroup  --cluster-name myconnectedcluster --cluster-type connectedClusters --name ads-extension | convertFrom-json).identity.principalId
```

# [macOS & Linux](#tab/linux)
```azurecli
export MSI_OBJECT_ID=`az k8s-extension show --resource-group <resource group>  --cluster-name <connectedclustername>  --cluster-type connectedClusters --name <name of extension> | jq '.identity.principalId' | tr -d \"`
#Example
export MSI_OBJECT_ID=`az k8s-extension show --resource-group myresourcegroup  --cluster-name myconnectedcluster --cluster-type connectedClusters --name ads-extension | jq '.identity.principalId' | tr -d \"`
```

# [Windows](#tab/windows)

N/A

---

### (2) Assign role to the managed identity

Run the below command to assign the **Monitoring Metrics Publisher** role:
# [PowerShell](#tab/powershell)
```azurecli
az role assignment create --assignee $Env:MSI_OBJECT_ID --role 'Monitoring Metrics Publisher' --scope "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP_NAME"
```

# [macOS & Linux](#tab/linux)
```azurecli
az role assignment create --assignee ${MSI_OBJECT_ID} --role 'Monitoring Metrics Publisher' --scope "/subscriptions/${subscription}/resourceGroups/${resourceGroup}"
```

# [Windows](#tab/windows)

N/A

---

### Automatic upload of metrics can be enabled as follows:
```
az arcdata dc update --name <name of datacontroller> --resource-group <resource group> --auto-upload-metrics true
#Example
az arcdata dc update --name arcdc --resource-group <myresourcegroup> --auto-upload-metrics true
```

To disable automatic upload of metrics to Azure Monitor,  run the following command:
```
az arcdata dc update --name <name of datacontroller> --resource-group <resource group> --auto-upload-metrics false
#Example
az arcdata dc update --name arcdc --resource-group <myresourcegroup> --auto-upload-metrics false
```

## Upload metrics for Azure Arc data controller in **indirect** mode

In the **indirect** connected mode, service principal is used for uploading metrics.

### Prerequisites

Before you proceed, make sure you have created the required service principal and assigned it to an appropriate role. For details, see:
* [Create service principal](upload-metrics-and-logs-to-azure-monitor.md#create-service-principal).
* [Assign roles to the service principal](upload-metrics-and-logs-to-azure-monitor.md#assign-roles-to-the-service-principal)

### Set environment variables and confirm

Set the SPN authority URL in an environment variable:

# [PowerShell](#tab/powershell)

```PowerShell
$Env:SPN_AUTHORITY='https://login.microsoftonline.com'
```

# [macOS & Linux](#tab/linux)

```console
export SPN_AUTHORITY='https://login.microsoftonline.com'
```

# [Windows](#tab/windows)

```console
SET SPN_AUTHORITY=https://login.microsoftonline.com
```

---

Check to make sure that all environment variables required are set if you want:


# [PowerShell](#tab/powershell)

```PowerShell
$Env:SPN_TENANT_ID
$Env:SPN_CLIENT_ID
$Env:SPN_CLIENT_SECRET
$Env:SPN_AUTHORITY
```


# [macOS & Linux](#tab/linux)

```console
echo $SPN_TENANT_ID
echo $SPN_CLIENT_ID
echo $SPN_CLIENT_SECRET
echo $SPN_AUTHORITY
```

# [Windows](#tab/windows)

```console
echo %SPN_TENANT_ID%
echo %SPN_CLIENT_ID%
echo %SPN_CLIENT_SECRET%
echo %SPN_AUTHORITY%
```

---

### Upload metrics to Azure Monitor

To upload metrics for your Azure Arc-enabled SQL managed instances and Azure Arc-enabled PostgreSQL servers run, the following CLI commands:

 
1. Export all metrics to the specified file:

> [!NOTE]
> Exporting usage/billing information, metrics, and logs using the command `az arcdata dc export` requires bypassing SSL verification for now.  You will be prompted to bypass SSL verification or you can set the `AZDATA_VERIFY_SSL=no` environment variable to avoid prompting.  There is no way to configure an SSL certificate for the data controller export API currently.

   ```azurecli
   az arcdata dc export --type metrics --path metrics.json --k8s-namespace arc
   ```

2. Upload metrics to Azure monitor:

   ```azurecli
   az arcdata dc upload --path metrics.json
   ```

   >[!NOTE]
   >Wait for at least 30 mins after the Azure Arc-enabled data instances are created for the first upload.
   >
   >Make sure `upload` the metrics right away after `export` as Azure Monitor only accepts metrics for the last 30 minutes. [Learn more](../../azure-monitor/essentials/metrics-store-custom-rest-api.md#troubleshooting).


If you see any errors indicating "Failure to get metrics" during export, check if data collection is set to `true` by running the following command:

```azurecli
az arcdata dc config show  --k8s-namespace arc --use-k8s
```

Look under "security section"

```output
 "security": {
      "allowDumps": true,
      "allowNodeMetricsCollection": true,
      "allowPodMetricsCollection": true,
    },
```

Verify if the `allowNodeMetricsCollection` and `allowPodMetricsCollection` properties are set to `true`.

## View the metrics in the Portal

Once your metrics are uploaded, you can view them from the Azure portal.
> [!NOTE]
> Please note that it can take a couple of minutes for the uploaded data to be processed before you can view the metrics in the portal.


To view your metrics, navigate to the [Azure portal](https://portal.azure.com). Then, search for your database instance by name in the search bar:

You can view CPU utilization on the Overview page or if you want more detailed metrics you can click on metrics from the left navigation panel

Choose sql server or postgres as the metric namespace.

Select the metric you want to visualize (you can also select multiple).

Change the frequency to last 30 minutes.

> [!NOTE]
> You can only upload metrics only for the last 30 minutes. Azure Monitor rejects metrics older than 30 minutes.

## Automating uploads (optional)

If you want to upload metrics and logs on a scheduled basis, you can create a script and run it on a timer every few minutes. Below is an example of automating the uploads using a Linux shell script.

In your favorite text/code editor, add the following script to the file and save as a script executable file such as `.sh` (Linux/Mac), `.cmd`, `.bat`, or `.ps1`.

```azurecli
az arcdata dc export --type metrics --path metrics.json --force  --k8s-namespace arc
az arcdata dc upload --path metrics.json
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

Create, read, update, and delete (CRUD) operations on Azure Arc-enabled data services are logged for billing and monitoring purposes. There are background services that monitor for these CRUD operations and calculate the consumption appropriately. The actual calculation of usage or consumption happens on a scheduled basis and is done in the background. 

Upload the usage only once per day. When usage information is exported and uploaded multiple times within the same 24 hour period, only the resource inventory is updated in Azure portal but not the resource usage.

For uploading metrics, Azure monitor only accepts the last 30 minutes of data ([Learn more](../../azure-monitor/essentials/metrics-store-custom-rest-api.md#troubleshooting)). The guidance for uploading metrics is to upload the metrics immediately after creating the export file so you can view the entire data set in Azure portal. For instance, if you exported the metrics at 2:00 PM and ran the upload command at 2:50 PM. Since Azure Monitor only accepts data for the last 30 minutes, you may not see any data in the portal. 

## Next steps

[Upload logs to Azure Monitor](upload-logs.md)

[Upload usage data, metrics, and logs to Azure Monitor](upload-usage-data.md)

[Upload billing data to Azure and view it in the Azure portal](view-billing-data-in-azure.md)

[View Azure Arc data controller resource in Azure portal](view-data-controller-in-azure-portal.md)
