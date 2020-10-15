---
title: Upload logs to Azure Monitor
description: Upload logs to Azure Monitor
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

# Upload logs to Azure Monitor

Periodically, you can export logs and then upload them to Azure. Exporting and uploading logs also creates and updates the data controller, SQL managed instance, and PostgreSQL Hyperscale server group resources in Azure.

> [!NOTE] 
> During the preview period, there is no cost for using Azure Arc enabled data services.

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

## Prerequisites

[!INCLUDE [arc-data-upload-prerequisites](includes/arc-data-upload-prerequisites.md)]

## Before you begin

There are a few one-time setup steps required to enable the logs and metrics upload scenarios:

1. [Create a service principal](#create-a-service-principal-and-assign-roles) (Azure Active Directory application) including creating a client access secret.
1. [Assign the service principal to the `Monitoring Metrics Publisher` role](#assign-role-to-service-principal) on the subscription(s) where your database instance resources are located.
1. [Create a log analytics workspace](#create-a-log-analytics-workspace) and get the keys and set the information in environment variables.

The first item is required to upload metrics and the second one is required to upload logs.

Follow these commands to create your metrics upload service principal and assign it to the 'Monitoring Metrics Publisher' and 'Contributor' roles so that the service principal can upload metrics and perform create and upload operations.

## Create a service principal

[!INCLUDE [arc-data-create-service-principal](includes/arc-data-create-service-principal.md)]

## Assign role to service principal 

Run this command to assign the service principal to the `Monitoring Metrics Publisher` role on the subscription where your database instance resources are located:

::: zone pivot="client-operating-system-windows-command"

> [!NOTE]
> You need to use double quotes for role names when running from a Windows environment.

```console
az role assignment create --assignee <appId> --role "Monitoring Metrics Publisher" --scope subscriptions/<Subscription ID>
az role assignment create --assignee <appId> --role "Contributor" --scope subscriptions/<Subscription ID>
```
::: zone-end

::: zone pivot="client-operating-system-macos-and-linux"

```console
az role assignment create --assignee <appId> --role 'Monitoring Metrics Publisher' --scope subscriptions/<Subscription ID>
az role assignment create --assignee <appId> --role 'Contributor' --scope subscriptions/<Subscription ID>
```

::: zone-end

::: zone pivot="client-operating-system-powershell"

```powershell
az role assignment create --assignee <appId> --role 'Monitoring Metrics Publisher' --scope subscriptions/<Subscription ID>
az role assignment create --assignee <appId> --role 'Contributor' --scope subscriptions/<Subscription ID>
```

::: zone-end

Example output:

```output
{
  "canDelegate": null,
  "id": "/subscriptions/<Subscription ID>/providers/Microsoft.Authorization/roleAssignments/f82b7dc6-17bd-4e78-93a1-3fb733b912d",
  "name": "f82b7dc6-17bd-4e78-93a1-3fb733b9d123",
  "principalId": "5901025f-0353-4e33-aeb1-d814dbc5d123",
  "principalType": "ServicePrincipal",
  "roleDefinitionId": "/subscriptions/<Subscription ID>/providers/Microsoft.Authorization/roleDefinitions/3913510d-42f4-4e42-8a64-420c39005123",
  "scope": "/subscriptions/<Subscription ID>",
  "type": "Microsoft.Authorization/roleAssignments"
}
```

## Create a log analytics workspace

Next, execute these commands to create a Log Analytics Workspace and set the access information into environment variables.

> [!NOTE]
> Skip this step if you already have a workspace.

```console
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

Save the log workspace analytyics `customerId` as an environment variable to be used later:

::: zone pivot="client-operating-system-windows-command"

```console
SET WORKSPACE_ID=<customerId>
```

::: zone-end

::: zone pivot="client-operating-system-powershell"

```PowerShell
$Env:WORKSPACE_ID='<customerId>'
```
::: zone-end

::: zone pivot="client-operating-system-macos-and-linux"

```console
export WORKSPACE_ID='<customerId>'
```
::: zone-end

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

::: zone pivot="client-operating-system-windows-command"

```console
SET WORKSPACE_SHARED_KEY=<primarySharedKey>
```

::: zone-end

::: zone pivot="client-operating-system-powershell"

```console
$Env:WORKSPACE_SHARED_KEY='<primarySharedKey>'
```
```
::: zone-end


::: zone pivot="client-operating-system-macos-and-linux"

```console
export WORKSPACE_SHARED_KEY='<primarySharedKey>'
```

::: zone-end

## Set final environment variables and confirm

Set the SPN authority URL in an environment variable:

::: zone pivot="client-operating-system-windows-command"

```console
SET SPN_AUTHORITY=https://login.microsoftonline.com
```

::: zone-end

::: zone pivot="client-operating-system-powershell"

```console
$Env:SPN_AUTHORITY='https://login.microsoftonline.com'
```

::: zone-end

::: zone pivot="client-operating-system-macos-and-linux"

```console
export SPN_AUTHORITY='https://login.microsoftonline.com'
```

::: zone-end


## Verify environment variables

Check to make sure that all environment variables required are set if you want:


::: zone pivot="client-operating-system-windows-command"

```console
echo %WORKSPACE_ID%
echo %WORKSPACE_SHARED_KEY%
echo %SPN_TENANT_ID%
echo %SPN_CLIENT_ID%
echo %SPN_CLIENT_SECRET%
echo %SPN_AUTHORITY%
```

::: zone-end

::: zone pivot="client-operating-system-powershell"

```PowerShell
$Env:WORKSPACE_ID
$Env:WORKSPACE_SHARED_KEY
$Env:SPN_TENANT_ID
$Env:SPN_CLIENT_ID
$Env:SPN_CLIENT_SECRET
$Env:SPN_AUTHORITY
```


::: zone-end

::: zone pivot="client-operating-system-macos-and-linux"

```console
echo $WORKSPACE_ID
echo $WORKSPACE_SHARED_KEY
echo $SPN_TENANT_ID
echo $SPN_CLIENT_ID
echo $SPN_CLIENT_SECRET
echo $SPN_AUTHORITY
```

::: zone-end

With the environment variables set, you can upload logs to the log workspace. 

## Upload logs to Azure Monitor

 To upload logs for your Azure Arc enabled SQL managed instances and AzureArc enabled PostgreSQL Hyperscale server groups run the following CLI commands-

1. Log in to to the Azure Arc data controller with `azdata`.

   ```console
   azdata login
   ```

   Follow the prompts to set the namespace, the administrator username, and the password. 

1. Export all logs to the specified file:

   ```console
   azdata arc dc export --type logs --path logs.json
   ```

2. Upload logs to an Azure monitor log analytics workspace:

   ```console
   azdata arc dc upload --path logs.json
   ```

## View your logs in Azure portal

Once your logs are uploaded, you should be able to query them using the log query explorer as follows:

1. Open the Azure portal and then search for your workspace by name in the search bar at the top and then select it.
2. Click Logs in the left panel.
3. Click Get Started (or click the links on the Getting Started page to learn more about Log Analytics if you are new to it).
4. Follow the tutorial to learn more about Log Analytics if this is your first time using Log Analytics.
5. Expand Custom Logs at the bottom of the list of tables and you will see a table called 'sql_instance_logs_CL'.
6. Click the 'eye' icon next to the table name.
7. Click the 'View in query editor' button.
8. You'll now have a query in the query editor that will show the most recent 10 events in the log.
9. From here, you can experiment with querying the logs using the query editor, set alerts, etc.

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
