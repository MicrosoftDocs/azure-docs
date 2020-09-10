---
title: Upload resource inventory, usage data, metrics and logs to Azure Monitor
description: Upload resource inventory, usage data, metrics and logs to Azure Monitor
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 08/04/2020
ms.topic: how-to
---

# Upload resource inventory, usage data, metrics and logs to Azure Monitor

With Azure Arc data services you can *optionally* upload your metrics and logs to Azure Monitor so you can aggregate and analyze metrics, logs, raise alerts, send notifications or trigger automated actions. Sending your data to Azure Monitor also allows you to store monitoring and logs data off site and at huge scale enabling long-term storage of the data for advanced analytics.  If you have multiple sites which have Azure Arc data services, you can use Azure Monitor as a central location to collect all of your logs and metrics across your sites.

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

## Before you begin

There are a few one-time setup steps required to enable the logs and metrics upload scenarios:

1) Create a service principal/Azure Active Directory application including creating a client access secret and assign the service principal to the 'Monitoring Metrics Publisher' role on the subscription(s) where your database instance resources are located.
2) Create a log analytics workspace and get the keys and set the information in environment variables.

The first item is required to upload metrics and the second one is required to upload logs.

Follow these commands to create your metrics upload service principal and assign it to the 'Monitoring Metrics Publisher' and 'Contributor' roles so that the service principal can upload metrics and perform create and upload operations.

## Create service principal and assign roles

Follow these commands to create your metrics upload service principal and assign it to the 'Monitoring Metrics Publisher' role:

To create a service principal, run this command:

> [!NOTE]
> Creating a service principal requires [certain permissions in Azure](/active-directory/develop/howto-create-service-principal-portal#required-permissions).

```console
az ad sp create-for-rbac --name <a name you choose>

#Example:
#az ad sp create-for-rbac --name azure-arc-metrics
```

Example output:

```console
"appId": "2e72adbf-de57-4c25-b90d-2f73f126e123",
"displayName": "azure-arc-metrics",
"name": "http://azure-arc-metrics",
"password": "5039d676-23f9-416c-9534-3bd6afc78123",
"tenant": "72f988bf-85f1-41af-91ab-2d7cd01ad1234"
```

Save the appId and tenant values in an environment variable for use later:

```console
#PowerShell

$Env:SPN_CLIENT_ID='<the 'appId' value from the output of the 'az ad sp create-for-rbac' command above>'
$Env:SPN_CLIENT_SECRET='<the 'password' value from the output of the 'az ad sp create-for-rbac' command above>'
$Env:SPN_TENANT_ID='<the 'tenant' value from the output of the 'az ad sp create-for-rbac' command above>'

#Linux/macOS

export SPN_CLIENT_ID='<the 'appId' value from the output of the 'az ad sp create-for-rbac' command above>'
export SPN_CLIENT_SECRET='<the 'password' value from the output of the 'az ad sp create-for-rbac' command above>'
export SPN_TENANT_ID='<the 'tenant' value from the output of the 'az ad sp create-for-rbac' command above>'

#Example (using Linux):
export SPN_CLIENT_ID='2e72adbf-de57-4c25-b90d-2f73f126e123'
export SPN_CLIENT_SECRET='5039d676-23f9-416c-9534-3bd6afc78123'
export SPN_TENANT_ID='72f988bf-85f1-41af-91ab-2d7cd01ad1234'
```

Run this command to assign the service principal to the 'Monitoring Metrics Publisher' role on the subscription where your database instance resources are located:

```console
az role assignment create --assignee <appId value from output above> --role 'Monitoring Metrics Publisher' --scope subscriptions/<sub ID>
az role assignment create --assignee <appId value from output above> --role 'Contributor' --scope subscriptions/<sub ID>

#Example:
#az role assignment create --assignee 2e72adbf-de57-4c25-b90d-2f73f126ede5 --role 'Monitoring Metrics Publisher' --scope subscriptions/182c901a-129a-4f5d-56e4-cc6b29459123
#az role assignment create --assignee 2e72adbf-de57-4c25-b90d-2f73f126ede5 --role 'Contributor' --scope subscriptions/182c901a-129a-4f5d-56e4-cc6b29459123
```

Example output:

```console
{
  "canDelegate": null,
  "id": "/subscriptions/182c901a-129a-4f5d-86e4-cc6b29459123/providers/Microsoft.Authorization/roleAssignments/f82b7dc6-17bd-4e78-93a1-3fb733b912d",
  "name": "f82b7dc6-17bd-4e78-93a1-3fb733b9d123",
  "principalId": "5901025f-0353-4e33-aeb1-d814dbc5d123",
  "principalType": "ServicePrincipal",
  "roleDefinitionId": "/subscriptions/182c901a-129a-4f5d-86e4-cc6b29459123/providers/Microsoft.Authorization/roleDefinitions/3913510d-42f4-4e42-8a64-420c39005123",
  "scope": "/subscriptions/182c901a-129a-4f5d-86e4-cc6b29459123",
  "type": "Microsoft.Authorization/roleAssignments"
}
```

## Create a log analytics workspace

Next, execute these commands to create a Log Analytics Workspace and set the access information into environment variables.

> [!NOTE]
> Skip this step if you already have a workspace.

```console
az monitor log-analytics workspace create --resource-group <resource group name> --name <some name you choose>

#Example:
#az monitor log-analytics workspace create --resource-group MyResourceGroup --name MyLogsWorkpace
```

Example output:

```console
{
  "customerId": "d6abb435-2626-4df1-b887-445fe44a4123",
  "eTag": null,
  "id": "/subscriptions/182c901a-129a-4f5d-86e4-cc6b29459123/resourcegroups/user-arc-demo/providers/microsoft.operationalinsights/workspaces/user-logworkspace",
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
az monitor log-analytics workspace get-shared-keys --resource-group MyResourceGroup --name MyLogsWorkpace
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

To upload metrics for your Azure SQL managed instances and Azure Database for PostgreSQL Hyperscale server groups run, the following CLI commands:

This will export all metrics to the specified file:

```console
azdata arc dc export -t metrics --path metrics.json
```

This will upload metrics to Azure monitor:

```console
azdata arc dc upload --path metrics.json
```

## View the metrics in the Portal

Once your metrics are uploaded you should be able to visualize them from the Azure portal.

To view your metrics in the portal, use this special link to open the portal: <https://portal.azure.com>
Then, search for your database instance by name in the search bar:

You can view CPU utilization on the Overview page or if you want more detailed metrics you can click on metrics from the left navigation panel

Choose sql server as the metric namespace:

Select the metric you want to visualize (you can also select multiple):

Change the frequency to last 30 minutes:

> [!NOTE]
> You can only upload metrics only for the last 30 minutes. Azure Monitor rejects metrics older than 30 minutes.

## Upload logs to Azure Monitor

 To upload logs for your Azure SQL managed instances and Azure Database for PostgreSQL Hyperscale server groups run the following CLI commands-

This will export all logs to the specified file:

```console
azdata arc dc export -t logs --path logs.json
```

This will upload logs to an Azure monitor log analytics workspace:

```console
azdata arc dc upload --path logs.json
```

## View your logs in Azure portal

Once your logs are uploaded, you should be able to query them using the log query explorer as follows:

1. Open the Azure portal and then search for your workspace by name in the search bar at the top and then select it
2. Click Logs in the left panel
3. Click Get Started (or click the links on the Getting Started page to learn more about Log Analytics if you are new to it)
4. Follow the tutorial to learn more about Log Analytics if is is your first time
5. Expand Custom Logs at the bottom of the list of tables and you will see a table called 'sql_instance_logs_CL'.
6. Click the 'eye' icon next to the table name
7. Click the 'View in query editor' button
8. You'll now have a query in the query editor which will show the most recent 10 events in the log
9. From here, you can experiment with querying the logs using the query editor, set alerts, etc.

## Automating metrics and logs uploads (optional)

If you want to constantly upload metrics and logs, you can create a script and run it on a timer every few minutes.  Below is an example of automating the uploads using a Linux shell script.

In your favorite text/code editor, add the following to the script content to the file and save as a script executable file such as .sh (Linux/Mac) or .cmd, .bat, .ps1.

```console
azdata arc dc export --type metrics --path metrics.json --force
azdata arc dc upload --path metrics.json
```

Make the script file executable

```console
chmod +x myuploadscript.sh
```

Run the script every 2 minutes:

```console
watch -n 120 ./myuploadscript.sh
```

You could also use a job scheduler like cron or Windows Task Scheduler or an orchestrator like Ansible, Puppet, or Chef.
