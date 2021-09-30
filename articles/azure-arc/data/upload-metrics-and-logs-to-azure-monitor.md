---
title: Upload usage data, metrics, and logs to Azure
description: Upload resource inventory, usage data, metrics, and logs to Azure
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

# Upload usage data, metrics, and logs to Azure

Periodically, you can export out usage information for billing purposes, monitoring metrics, and logs and then upload it to Azure. The export and upload of any of these three types of data will also create and update the data controller, SQL managed instance, and PostgreSQL Hyperscale server group resources in Azure.

Before you can upload usage data, metrics, or logs you need to:

* Install tools 
* [Register the `Microsoft.AzureArcData` resource provider](#register-the-resource-provider) 
* [Create the service principal](#create-service-principal)

## Install tools

The required tools include: 
* Azure CLI (az) 
* `arcdata` extension 

See [Install tools](./install-client-tools.md).

## Register the resource provider

Prior to uploading metrics or user data to Azure, you need to ensure that your Azure subscription has the `Microsoft.AzureArcData` resource provider registered.

To verify the resource provider, run the following command:

```azurecli
az provider show -n Microsoft.AzureArcData -o table
```

If the resource provider is not currently registered in your subscription, you can register it. To register it, run the following command.  This command may take a minute or two to complete.

```azurecli
az provider register -n Microsoft.AzureArcData --wait
```

## Create service principal

The service principal is used to upload usage and metrics data.

Follow these commands to create your metrics upload service principal:

> [!NOTE]
> Creating a service principal requires [certain permissions in Azure](../../active-directory/develop/howto-create-service-principal-portal.md#permissions-required-for-registering-an-app).

To create a service principal, update the following example. Replace `<ServicePrincipalName>`, `SubscriptionId` and `resourcegroup` with your values and run the command:

```azurecli
az ad sp create-for-rbac --name <ServicePrincipalName> --role Contributor --scopes /subscriptions/<SubscriptionId>/resourceGroups/<resourcegroup>
```

If you created the service principal earlier, and just need to get the current credentials, run the following command to reset the credential.

```azurecli
az ad sp credential reset --name <ServicePrincipalName>
```

For example, to create a service principal named `azure-arc-metrics`, run the following command

```azurecli
az ad sp create-for-rbac --name azure-arc-metrics --role Contributor --scopes /subscriptions/a345c178a-845a-6a5g-56a9-ff1b456123z2/resourceGroups/myresourcegroup
```

Example output:

```output
"appId": "2e72adbf-de57-4c25-b90d-2f73f126e123",
"displayName": "azure-arc-metrics",
"name": "http://azure-arc-metrics",
"password": "5039d676-23f9-416c-9534-3bd6afc78123",
"tenant": "72f988bf-85f1-41af-91ab-2d7cd01ad1234"
```

Save the `appId`, `password`, and `tenant` values in an environment variable for use later. 

::: zone pivot="client-operating-system-windows-command"

```console
SET SPN_CLIENT_ID=<appId>
SET SPN_CLIENT_SECRET=<password>
SET SPN_TENANT_ID=<tenant>
```

::: zone-end

::: zone pivot="client-operating-system-macos-and-linux"

```console
export SPN_CLIENT_ID='<appId>'
export SPN_CLIENT_SECRET='<password>'
export SPN_TENANT_ID='<tenant>'
```

::: zone-end

::: zone pivot="client-operating-system-powershell"

```console
$Env:SPN_CLIENT_ID="<appId>"
$Env:SPN_CLIENT_SECRET="<password>"
$Env:SPN_TENANT_ID="<tenant>"
```

::: zone-end

After you have created the service principal, assign the service principal to the appropriate role. 

## Assign roles to the service principal

Run this command to assign the service principal to the `Monitoring Metrics Publisher` role on the subscription where your database instance resources are located:

::: zone pivot="client-operating-system-windows-command"

> [!NOTE]
> You need to use double quotes for role names when running from a Windows environment.

```azurecli
az role assignment create --assignee <appId> --role "Monitoring Metrics Publisher" --scope subscriptions/<SubscriptionID>/resourceGroups/<resourcegroup>

```
::: zone-end

::: zone pivot="client-operating-system-macos-and-linux"

```azurecli
az role assignment create --assignee <appId> --role 'Monitoring Metrics Publisher' --scope subscriptions/<SubscriptionID>/resourceGroups/<resourcegroup>
```

::: zone-end

::: zone pivot="client-operating-system-powershell"

```powershell
az role assignment create --assignee <appId> --role 'Monitoring Metrics Publisher' --scope subscriptions/<SubscriptionID>/resourceGroups/<resourcegroup>
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

## Verify service principal role

```azurecli
az role assignment list -o table
```

With the service principal assigned to the appropriate role, you can proceed to upload metrics, or user data. 



## Upload logs, metrics, or usage data

The specific steps for uploading logs, metrics, or usage data vary depending about the type of information you are uploading. 

[Upload logs to Azure Monitor](upload-logs.md)

[Upload metrics to Azure Monitor](upload-metrics.md)

[Upload usage data to Azure](upload-usage-data.md)

## General guidance on exporting and uploading usage, and metrics

Create, read, update, and delete (CRUD) operations on Azure Arc-enabled data services are logged for billing and monitoring purposes. There are background services that monitor for these CRUD operations and calculate the consumption appropriately. The actual calculation of usage or consumption happens on a scheduled basis and is done in the background. 

Upload the usage only once per day. When usage information is exported and uploaded multiple times within the same 24 hour period, only the resource inventory is updated in Azure portal but not the resource usage.

For uploading metrics, Azure monitor only accepts the last 30 minutes of data ([Learn more](../../azure-monitor/essentials/metrics-store-custom-rest-api.md#troubleshooting)). The guidance for uploading metrics is to upload the metrics immediately after creating the export file so you can view the entire data set in Azure portal. For instance, if you exported the metrics at 2:00 PM and ran the upload command at 2:50 PM. Since Azure Monitor only accepts data for the last 30 minutes, you may not see any data in the portal. 

## Next steps

[Learn about service principals](/powershell/azure/azurerm/create-azure-service-principal-azureps#what-is-a-service-principal)

[Upload billing data to Azure and view it in the Azure portal](view-billing-data-in-azure.md)

[View Azure Arc data controller resource in Azure portal](view-data-controller-in-azure-portal.md)
