---
title: Upload logs to Azure Monitor
description: Upload logs for Azure Arc-enabled data services to Azure Monitor
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
ms.custom: devx-track-azurecli
author: dnethi
ms.author: dinethi
ms.reviewer: mikeray
ms.date: 05/27/2022
ms.topic: how-to
---

# Upload logs to Azure Monitor

Periodically, you can export logs and then upload them to Azure. Exporting and uploading logs also creates and updates the data controller, SQL managed instance, and PostgreSQL server resources in Azure.

## Before you begin

Before you can upload logs, you need to: 

1. [Create a log analytics workspace](#create-a-log-analytics-workspace)
1. [Assign ID and shared key to environment variables](#assign-id-and-shared-key-to-environment-variables)

[!INCLUDE [azure-arc-angle-bracket-example](../../../includes/azure-arc-angle-bracket-example.md)]

## Create a log analytics workspace

To create a log analytics workspace, execute these commands to create a Log Analytics Workspace and set the access information into environment variables.

> [!NOTE]
> Skip this step if you already have a workspace.

```azurecli
az monitor log-analytics workspace create --resource-group <resource group name> --workspace-name <some name you choose>
```

Example output:

```output
{
  "customerId": "d6abb435-2626-4df1-b887-445fe44a4123",
  "eTag": null,
  "id": "/subscriptions/<Subscription ID>/resourcegroups/user-arc-demo/providers/microsoft.operationalinsights/workspaces/user-logworkspace",
  "location": "eastus",
  "name": "user-logworkspace",
  "portalUrl": null,
  "provisioningState": "Succeeded",
  "resourceGroup": "user-arc-demo",
  "retentionInDays": 30,
  "sku": {
    "lastSkuUpdate": "Thu, 30 Jul 2020 22:37:53 GMT",
    "maxCapacityReservationLevel": 3000,
    "name": "pergb2018"
  },
  "source": "Azure",
  "tags": null,
  "type": "Microsoft.OperationalInsights/workspaces"
}
```

## Assign ID and shared key to environment variables

Save the log workspace analytics `customerId` as an environment variable to be used later:

# [Windows](#tab/windows)

```console
SET WORKSPACE_ID=<customerId>
```

# [PowerShell](#tab/powershell)

```PowerShell
$Env:WORKSPACE_ID='<customerId>'
```
# [macOS & Linux](#tab/linux)

```console
export WORKSPACE_ID='<customerId>'
```

---

This command returns the access keys required to connect to your log analytics workspace:

```azurecli
az monitor log-analytics workspace get-shared-keys --resource-group MyResourceGroup --workspace-name MyLogsWorkpace
```

Example output:

```output
{
  "primarySharedKey": "JXzQp1RcGgjXFCDS3v0sXoxPvbgCoGaIv35lf11Km2WbdGFvLXqaydpaj1ByWGvKoCghL8hL4BRoypXxkLr123==",
  "secondarySharedKey": "p2XHSxLJ4o9IAqm2zINcEmx0UWU5Z5EZz8PQC0OHpFjdpuVaI0zsPbTv5VyPFgaCUlCZb2yEbkiR4eTuTSF123=="
}
```

Save the primary key in an environment variable to be used later:

# [Windows](#tab/windows)

```console
SET WORKSPACE_SHARED_KEY=<primarySharedKey>
```

# [PowerShell](#tab/powershell)

```console
$Env:WORKSPACE_SHARED_KEY='<primarySharedKey>'
```

# [macOS & Linux](#tab/linux)

```console
export WORKSPACE_SHARED_KEY='<primarySharedKey>'
```

---


## Verify environment variables

Check to make sure that all environment variables required are set if you want:

# [Windows](#tab/windows)

```console
echo %WORKSPACE_ID%
echo %WORKSPACE_SHARED_KEY%
```

# [PowerShell](#tab/powershell)

```PowerShell
$Env:WORKSPACE_ID
$Env:WORKSPACE_SHARED_KEY
```

# [macOS & Linux](#tab/linux)

```console
echo $WORKSPACE_ID
echo $WORKSPACE_SHARED_KEY
```

---

With the environment variables set, you can upload logs to the log workspace. 

## Configure automatic upload of logs to Azure Log Analytics Workspace in direct mode using `az` CLI

In the **direct** connected mode, Logs upload can only be set up in **automatic** mode. This automatic upload of metrics can be set up either during deployment or post deployment of Azure Arc data controller.

### Enable automatic upload of logs to Azure Log Analytics Workspace

If the automatic upload of logs was disabled during Azure Arc data controller deployment, run the below command to enable automatic upload of logs.

```azurecli
az arcdata dc update --name <name of datacontroller> --resource-group <resource group> --auto-upload-logs true
#Example
az arcdata dc update --name arcdc --resource-group <myresourcegroup> --auto-upload-logs true
```

### Enable automatic upload of logs to Azure Log Analytics Workspace

If the automatic upload of logs was enabled during Azure Arc data controller deployment, run the below command to disable automatic upload of logs.
```
az arcdata dc update --name <name of datacontroller> --resource-group <resource group> --auto-upload-logs false
#Example
az arcdata dc update --name arcdc --resource-group <myresourcegroup> --auto-upload-logs false
```

## Configure automatic upload of logs to Azure Log Analytics Workspace in **direct** mode using `kubectl` CLI

### Enable automatic upload of logs to Azure Log Analytics Workspace

To configure automatic upload of logs using ```kubectl```:

- ensure the Log Analytics Workspace is created as described in the earlier section
- create a Kubernetes secret for the Log Analytics workspace using the ```WorkspaceID``` and `SharedAccessKey` as follows:

```
apiVersion: v1
data:
  primaryKey: <base64 encoding of Azure Log Analytics workspace primary key>
  workspaceId: <base64 encoding of Azure Log Analytics workspace Id>
kind: Secret
metadata:
  name: log-workspace-secret
  namespace: <your datacontroller namespace>
type: Opaque
```

- To create the secret, run:

   ```console
   kubectl apply -f <myLogAnalyticssecret.yaml> --namespace <mynamespace>
   ```

- To open the settings as a yaml file in the default editor, run:

   ```console
   kubectl edit datacontroller <DC name> --name <namespace>
   ```

- update the autoUploadLogs property to ```"true"```, and save the file



### Enable automatic upload of logs to Azure Log Analytics Workspace

To disable automatic upload of logs, run:

```console
kubectl edit datacontroller <DC name> --name <namespace>
```

- update the autoUploadLogs property to `"false"`, and save the file

## Upload logs to Azure Monitor in **indirect** mode

 To upload logs for your Azure Arc-enabled SQL managed instances and Azure Arc-enabled PostgreSQL servers run the following CLI commands-

1. Export all logs to the specified file:

   > [!NOTE]
   > Exporting usage/billing information, metrics, and logs using the command `az arcdata dc export` requires bypassing SSL verification for now.  You will be prompted to bypass SSL verification or you can set the `AZDATA_VERIFY_SSL=no` environment variable to avoid prompting.  There is no way to configure an SSL certificate for the data controller export API currently.

   ```azurecli
   az arcdata dc export --type logs --path logs.json  --k8s-namespace arc
   ```


2. Upload logs to an Azure monitor log analytics workspace:

   ```azurecli
   az arcdata dc upload --path logs.json
   ```

## View your logs in Azure portal

Once your logs are uploaded, you should be able to query them using the log query explorer as follows:

1. Open the Azure portal and then search for your workspace by name in the search bar at the top and then select it.
2. Select Logs in the left panel.
3. Select Get Started (or select the links on the Getting Started page to learn more about Log Analytics if you are new to it).
4. Follow the tutorial to learn more about Log Analytics if this is your first time using Log Analytics.
5. Expand Custom Logs at the bottom of the list of tables and you will see a table called 'sql_instance_logs_CL' or 'postgresInstances_postgresql_logs_CL'.
6. Select the 'eye' icon next to the table name.
7. Select the 'View in query editor' button.
8. You'll now have a query in the query editor that will show the most recent 10 events in the log.
9. From here, you can experiment with querying the logs using the query editor, set alerts, etc.

## Automating uploads (optional)

If you want to upload metrics and logs on a scheduled basis, you can create a script and run it on a timer every few minutes. Below is an example of automating the uploads using a Linux shell script.

In your favorite text/code editor, add the following script to the file and save as a script executable file - such as `.sh` (Linux/Mac), `.cmd`, `.bat`, or `.ps1` (Windows).

```azurecli
az arcdata dc export --type logs --path logs.json --force --k8s-namespace arc
az arcdata dc upload --path logs.json
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

## Next steps

[Upload metrics, and logs to Azure Monitor](upload-metrics.md)

[Upload usage data, metrics, and logs to Azure Monitor](upload-usage-data.md)

[Upload billing data to Azure and view it in the Azure portal](view-billing-data-in-azure.md)

[View Azure Arc data controller resource in Azure portal](view-data-controller-in-azure-portal.md)
