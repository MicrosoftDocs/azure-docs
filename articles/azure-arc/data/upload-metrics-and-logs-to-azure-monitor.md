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
---

# Upload usage data, metrics, and logs to Azure Monitor

Periodically you can export out usage information for billing purposes, monitoring metrics, and logs and then upload it to Azure.  The export and upload of any of these three types of data will also create and update the data controller, SQL managed instance, and PostgreSQL Hyperscale server group resources in Azure.

> [!NOTE] 
> During the preview period, there is no cost for using Azure Arc enabled data services.

## Prerequisites

You will need the Azure CLI (az) and the [!INCLUDE [azure-data-cli-azdata](../../../includes/azure-data-cli-azdata.md)] installed.  [Install tools](./install-client-tools.md).

Prior to uploading data to Azure, you need to ensure that your Azure subscription has the Microsoft.AzureData resource provider registered.

You can verify this by running the following command:

```console
az provider show -n Microsoft.AzureData -o table
```

If the resource provider is not currently registered in your subscription, you can register it by running the following command.  This command make take a minute or two to complete.

```console
az provider register -n Microsoft.AzureData --wait
```

## Upload usage data

Usage information such as inventory and resource usage can be uploaded to Azure in the following two-step way:

1. Export the usage data using `azdata export` command, as follows:

   ```console
   #login to the data controller and enter the values at the prompt
   azdata login

   #run the export command
   azdata arc dc export --type usage --path usage.json
   ```
   This command creates a `usage.json` file with all the Azure Arc enabled data resources such as SQL managed instances and PostgreSQL Hyperscale instances etc. that are created on the data controller.

2. Upload the usage data using `azdata upload` command

   > [!NOTE]
   > Please wait for at least 24 hours after creating the Azure Arc data controller before running the upload

   ```console
   #login to the data controller and enter the values at the prompt
   azdata login

   #run the upload command
   azdata arc dc upload --path usage.json
   ```

## Upload metrics and logs

With Azure Arc data services, you can optionally upload your metrics and logs to Azure Monitor so you can aggregate and analyze metrics, logs, raise alerts, send notifications, or trigger automated actions. 

Sending your data to Azure Monitor also allows you to store monitoring and logs data off-site and at huge scale enabling long-term storage of the data for advanced analytics.

If you have multiple sites that have Azure Arc data services, you can use Azure Monitor as a central location to collect all of your logs and metrics across your sites.

### Before you begin

There are a few one-time setup steps required to enable the logs and metrics upload scenarios:

1. Create a Service Principal/Azure Active Directory application including creating a client access secret and assign the service principal to the 'Monitoring Metrics Publisher' role on the subscription(s) where your database instance resources are located.
2. Create a log analytics workspace and get the keys and set the information in environment variables.

The first item is required to upload metrics and the second one is required to upload logs.

Follow these commands to create your metrics upload service principal and assign it to the 'Monitoring Metrics Publisher' and 'Contributor' roles so that the service principal can upload metrics and perform create and upload operations.

## Create service principal and assign roles

Follow these commands to create your metrics upload service principal and assign it to the 'Monitoring Metrics Publisher' role:

To create a service principal, run this command:

> [!NOTE]
> Creating a service principal requires [certain permissions in Azure](../../active-directory/develop/howto-create-service-principal-portal.md#permissions-required-for-registering-an-app).

```console
az ad sp create-for-rbac --name <a name you choose>

#Example:
#az ad sp create-for-rbac --name azure-arc-metrics
```

Example output:

```output
"appId": "2e72adbf-de57-4c25-b90d-2f73f126e123",
"displayName": "azure-arc-metrics",
"name": "http://azure-arc-metrics",
"password": "5039d676-23f9-416c-9534-3bd6afc78123",
"tenant": "72f988bf-85f1-41af-91ab-2d7cd01ad1234"
```

Save the appId and tenant values in an environment variable for use later. 

To save the appId and tenant values with PowerShell, follow this example:

```powershell
$Env:SPN_CLIENT_ID='<the 'appId' value from the output of the 'az ad sp create-for-rbac' command above>'
$Env:SPN_CLIENT_SECRET='<the 'password' value from the output of the 'az ad sp create-for-rbac' command above>'
$Env:SPN_TENANT_ID='<the 'tenant' value from the output of the 'az ad sp create-for-rbac' command above>'
```

Alternatively, on Linux or macOS, you can save the appId and tenant values with this example:

   ```console
   export SPN_CLIENT_ID='<the 'appId' value from the output of the 'az ad sp create-for-rbac' command above>'
   export SPN_CLIENT_SECRET='<the 'password' value from the output of the 'az ad sp create-for-rbac' command above>'
   export SPN_TENANT_ID='<the 'tenant' value from the output of the 'az ad sp create-for-rbac' command above>'

   #Example (using Linux):
   export SPN_CLIENT_ID='2e72adbf-de57-4c25-b90d-2f73f126e123'
   export SPN_CLIENT_SECRET='5039d676-23f9-416c-9534-3bd6afc78123'
   export SPN_TENANT_ID='72f988bf-85f1-41af-91ab-2d7cd01ad1234'
   ```

Run this command to assign the service principal to the 'Monitoring Metrics Publisher' role on the subscription where your database instance resources are located:


> [!NOTE]
> You need to use double quotes for role names when running from a Windows environment.


```console
az role assignment create --assignee <appId value from output above> --role "Monitoring Metrics Publisher" --scope subscriptions/<sub ID>
az role assignment create --assignee <appId value from output above> --role 'Contributor' --scope subscriptions/<sub ID>

#Example:
#az role assignment create --assignee 2e72adbf-de57-4c25-b90d-2f73f126ede5 --role "Monitoring Metrics Publisher" --scope subscriptions/182c901a-129a-4f5d-56e4-cc6b29459123
#az role assignment create --assignee 2e72adbf-de57-4c25-b90d-2f73f126ede5 --role 'Contributor' --scope subscriptions/182c901a-129a-4f5d-56e4-cc6b29459123

#On Windows environment
#az role assignment create --assignee 2e72adbf-de57-4c25-b90d-2f73f126ede5 --role "Monitoring Metrics Publisher" --scope subscriptions/182c901a-129a-4f5d-56e4-cc6b29459123
#az role assignment create --assignee 2e72adbf-de57-4c25-b90d-2f73f126ede5 --role "Contributor" --scope subscriptions/182c901a-129a-4f5d-56e4-cc6b29459123
```

Example output:

```console
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

#Example:
#az monitor log-analytics workspace create --resource-group MyResourceGroup --workspace-name MyLogsWorkpace
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

Save the customerId (workspace ID) as an environment variable to be used later:

```console
#PowerShell
$Env:WORKSPACE_ID='<the customerId from the 'log-analytics workspace create' command output above>'

#Linux/macOS
export WORKSPACE_ID='<the customerId from the 'log-analytics workspace create' command output above>'

#Example (using Linux)
#export WORKSPACE_ID='d6abb435-2626-4df1-b887-445fe44a4123'
```

This command will print the access keys required to connect to your log analytics workspace:

```console
az monitor log-analytics workspace get-shared-keys --resource-group MyResourceGroup --workspace-name MyLogsWorkpace
```

Example output:

```console
{
  "primarySharedKey": "JXzQp1RcGgjXFCDS3v0sXoxPvbgCoGaIv35lf11Km2WbdGFvLXqaydpaj1ByWGvKoCghL8hL4BRoypXxkLr123==",
  "secondarySharedKey": "p2XHSxLJ4o9IAqm2zINcEmx0UWU5Z5EZz8PQC0OHpFjdpuVaI0zsPbTv5VyPFgaCUlCZb2yEbkiR4eTuTSF123=="
}
```

Save the primary key in an environment variable to be used later:

```console
#PowerShell:
$Env:WORKSPACE_SHARED_KEY='<the primarySharedKey value from the 'get-shared-keys' command above'

#Linux/macOS:
export WORKSPACE_SHARED_KEY='<the primarySharedKey value from the 'get-shared-keys' command above'

#Example (using Linux):
export WORKSPACE_SHARED_KEY='JXzQp1RcGgjXFCDS3v0sXoxPvbgCoGaIv35lf11Km2WbdGFvLXqaydpaj1ByWGvKoCghL8hL4BRoypXxkLr123=='

```

## Set final environment variables and confirm

Set the SPN authority URL in an environment variable:

```console
#PowerShell
$Env:SPN_AUTHORITY='https://login.microsoftonline.com'

#Linux/macOS:
export SPN_AUTHORITY='https://login.microsoftonline.com'
```

Check to make sure that all environment variables required are set if you want:

```console
#PowerShell
$Env:WORKSPACE_ID
$Env:WORKSPACE_SHARED_KEY
$Env:SPN_TENANT_ID
$Env:SPN_CLIENT_ID
$Env:SPN_CLIENT_SECRET
$Env:SPN_AUTHORITY

#Linux/macOS
echo $WORKSPACE_ID
echo $WORKSPACE_SHARED_KEY
echo $SPN_TENANT_ID
echo $SPN_CLIENT_ID
echo $SPN_CLIENT_SECRET
echo $SPN_AUTHORITY
```

## Upload metrics to Azure Monitor

To upload metrics for your Azure arc enabled SQL managed instances and Azure Arc enabled PostgreSQL Hyperscale server groups run, the following CLI commands:

1. Export all metrics to the specified file:

   ```console
   #login to the data controller and enter the values at the prompt
   azdata login

   #export the metrics
   azdata arc dc export --type metrics --path metrics.json
   ```

2. Upload metrics to Azure monitor:

   ```console
   #login to the data controller and enter the values at the prompt
   azdata login

   #upload the metrics
   azdata arc dc upload --path metrics.json
   ```

   >[!NOTE]
   >Wait for at least 30 mins after the Azure Arc enabled data instances are created for the first upload
   >
   >Make sure `upload` the metrics right away after `export` as Azure Monitor only accepts metrics for the last 30 minutes. [Learn more](../../azure-monitor/platform/metrics-store-custom-rest-api.md#troubleshooting)


If you see any errors indicating "Failure to get metrics" during export, check if data collection is set to ```true``` by running the following command:

```console
azdata arc dc config show
```

and look under "security section"

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

## Upload logs to Azure Monitor

 To upload logs for your Azure Arc enabled SQL managed instances and AzureArc enabled PostgreSQL Hyperscale server groups run the following CLI commands-

1. Export all logs to the specified file:

   ```console
   #login to the data controller and enter the values at the prompt
   azdata login

   #export the logs
   azdata arc dc export --type logs --path logs.json
   ```

2. Upload logs to an Azure monitor log analytics workspace:

   ```console
   #login to the data controller and enter the values at the prompt
   azdata login

   #Upload the logs
   azdata arc dc upload --path logs.json
   ```

## View your logs in Azure portal

Once your logs are uploaded, you should be able to query them using the log query explorer as follows:

1. Open the Azure portal and then search for your workspace by name in the search bar at the top and then select it
2. Click Logs in the left panel
3. Click Get Started (or click the links on the Getting Started page to learn more about Log Analytics if you are new to it)
4. Follow the tutorial to learn more about Log Analytics if this is your first time using Log Analytics
5. Expand Custom Logs at the bottom of the list of tables and you will see a table called 'sql_instance_logs_CL'.
6. Click the 'eye' icon next to the table name
7. Click the 'View in query editor' button
8. You'll now have a query in the query editor that will show the most recent 10 events in the log
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