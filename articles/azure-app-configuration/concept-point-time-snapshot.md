---
title: Retrieve key-value pairs from a point-in-time
titleSuffix: Azure App Configuration
description: Retrieve old key-value pairs using point-in-time snapshots in Azure App Configuration
services: azure-app-configuration
author: lisaguthrie
ms.author: lcozzens
ms.service: azure-app-configuration
ms.topic: conceptual
ms.date: 02/20/2020
---

# Point-in-time snapshot

Azure App Configuration maintains a record of changes made to key-value pairs. This record provides a timeline of key-value changes. You can reconstruct the history of any key-value and provide its past value at any moment within the previous seven days. Using this feature, you can “time-travel” backward and retrieve an old key-value. For example, you can recover configuration settings used before the most recent deployment in order to roll back the application to the previous configuration.

## Key-value retrieval

You can use Azure PowerShell to retrieve past key values.  Use `az appconfig revision list`, adding appropriate parameters to retrieve the required values.  Specify the Azure App Configuration instance by providing either the store name (`--name {app-config-store-name}`) or by using a connection string (`--connection-string {your-connection-string}`). Restrict the output by specifying a specific point in time (`--datetime`) and by specifying the maximum number of items to return (`--top`).

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

Retrieve all recorded changes to your key-values.

```azurepowershell
az appconfig revision list --name {your-app-config-store-name}.
```

Retrieve all recorded changes for the key `environment` and the labels `test` and `prod`.

```azurepowershell
az appconfig revision list --name {your-app-config-store-name} --key environment --label test,prod
```

Retrieve all recorded changes in the hierarchical key space `environment:prod`.

```azurepowershell
az appconfig revision list --name {your-app-config-store-name} --key environment:prod:* 
```

Retrieve all recorded changes for the key `color` at a specific point-in-time.

```azurepowershell
az appconfig revision list --connection-string {your-app-config-connection-string} --key color --datetime "2019-05-01T11:24:12Z" 
```

Retrieve the last 10 recorded changes to your key-values and return only the values for `key`, `label`, and `last-modified` time stamp.

```azurepowershell
az appconfig revision list --name {your-app-config-store-name} --top 10 --fields key,label,last-modified
```

## Next steps

> [!div class="nextstepaction"]
> [Create an ASP.NET Core web app](./quickstart-aspnet-core-app.md)  
