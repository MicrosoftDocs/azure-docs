---
title: Retrieve key-value pairs from a point-in-time
titleSuffix: Azure App Configuration
description: Retrieve old key-value pairs using point-in-time snapshots in Azure App Configuration, which maintains a record of changes to key-values.
services: azure-app-configuration
author: maud-lv
ms.author: malev
ms.service: azure-app-configuration
ms.topic: conceptual
ms.date: 02/22/2022
---

# Point-in-time snapshot

Azure App Configuration maintains a record of changes made to key-value pairs. This record provides a timeline of key-value changes. You can reconstruct the history of any key and provide its past value at any moment within the key history period (7 days for Free tier stores, or 30 days for Standard tier stores). Using this feature, you can “time-travel” backward and retrieve an old key-value pair. For example, you can recover configuration settings used before the most recent deployment in order to roll back the application to the previous configuration.

## Restore key-value pairs

You can use the Azure portal or the Azure CLI to retrieve past key-value pairs.

### [Portal](#tab/azure-portal)

1. Sign in to the [Azure portal](https://portal.azure.com). Select **All resources**, and select the App Configuration store instance where your key-value pairs are stored.

1. In the **Operations** menu, select **Restore**.
   :::image type="content" source="media/restore-key-value-portal.png" alt-text="Screenshot of the Azure portal, selecting restore":::

1. Select **Date: Select date** to select a date and time you want to explore.
1. Click outside of the date and time fields or press **Tab** to validate your choice. You can now access all the key-value pairs that existed at the selected date, and see how they differ from current keys and values.
   :::image type="content" source="media/restore-key-value-past-values.png" alt-text="Screenshot of the Azure portal with saved key-value pairs":::

   The portal displays a table of key-value pairs. The first column includes symbols indicating what will happen if you restore the data for the chosen date and time:
   - The red minus sign (–) means that the key-value pair doesn't exist at that point in time and will be deleted.
   - The green plus sign (+) means that the key-value pair existed then and will be added.
   - The orange bullet sign (•) means that the value was modified since.

1. Check a box on a line to display the difference between the current and compared key-value pairs and select it for restoring.
   :::image type="content" source="media/restore-key-value-compare.png" alt-text="Screenshot of the Azure portal with compared keys-value pairs":::

   In the above example, the preview shows the key TestApp:Settings:BackgroundColor, which currently has a value of #45288E. This value will be modified to #FFF if we go through with restoring the data.

   You can select one or more checkboxes in the table to take action on the key-value pairs of your choice. You can also select all the checkboxes at the same time to revert all keys-value pairs to a date and time in the past.

1. Select **Restore**.
   :::image type="content" source="media/restore-key-value-confirm.png" alt-text="Screenshot of the Azure portal selecting Restore":::

### [Azure CLI](#tab/azure-cli)

Use the Azure CLI as explained below to retrieve and restore past key-value pairs. If you don't have the Azure CLI installed locally, you can optionally use [Azure Cloud Shell](../cloud-shell/overview.md).

In the CLI, use `az appconfig revision list` to view changes or `az appconfig kv restore` to restore key-values, adding appropriate parameters. Specify the Azure App Configuration instance by providing either the store name (`--name <app-config-store-name>`) or by using a connection string (`--connection-string <your-connection-string>`). Restrict the output by specifying a specific point in time (`--datetime`), a label (`--label`) and the maximum number of items to return (`--top`).
and by specifying the maximum number of items to return (`--top`).

Retrieve all recorded changes to your key-values.

```azurecli
az appconfig revision list --name <your-app-config-store-name>
```

Retrieve the last 10 recorded changes to your key-values and return only the values for `key`, `label`, and `last_modified` time stamp.

Restore all key-values to a specific point in time.

```azurecli
az appconfig kv restore --name <app-config-store-name> --datetime "2019-05-01T11:24:12Z"
```

Restore for any label starting with v1. to a specific point in time.

```azurecli
az appconfig kv restore --name <app-config-store-name> --label v1.* --datetime "2019-05-01T11:24:12Z"
```

For more more examples and optional parameters, go to the [Azure CLI documentation](/cli/azure/appconfig/kv).

---

## Access the history of a key-value pair

### [Portal](#tab/azure-portal)

You can also access the revision history of a specific key-value pair in the portal.

1. In the **Operations** menu, select **Configuration explorer**.
1. Select **More actions** for the key you want to explore, and then **History**
   :::image type="content" source="media/explorer-key-history.png" alt-text="Screenshot of the Azure portal selecting key-value history":::

   You can now see the revision history for the selected key and information about the changes.

1. Select Restore to restore the key and value to this point in time.

   :::image type="content" source="media/explorer-key-day-restore.png" alt-text="Screenshot of the Azure portal viewing key-value data for a specific date":::

   > [!TIP]
   > This method is convenient if you have no more than a couple of changes to make, as Configuration explorer only lets you make changes key by key. If you need to restore multiple key-value pairs at once, use the **Restore** menu instead.

### [Azure CLI](#tab/azure-cli)

Use the Azure CLI as explained below to retrieve and restore a single key-value pair. If you don't have the Azure CLI installed locally, you can optionally use [Azure Cloud Shell](../cloud-shell/overview.md).

In the CLI, use `az appconfig revision list` to view changes to a key-value pair or use `az appconfig kv restore` to restore a key-value, adding appropriate parameters. Specify the Azure App Configuration instance by providing either the store name (`--name <app-config-store-name>`) or by using a connection string (`--connection-string <your-connection-string>`). Restrict the output by specifying a specific key  (`--key`). Optionally, specify a label (`--label`), a point in time (`--datetime`) and the maximum number of items to return (`--top`).

List revision history for key "color" with any labels.

```azurecli
az appconfig revision list --name <app-config-store-name> --key color
```

List revision history of a specific key-value with a label.

```azurecli
az appconfig revision list --name <app-config-store-name> --key color --label test
```

List revision history of a key-value with multiple labels.

```azurecli
az appconfig revision list --name <app-config-store-name> --key color --label test,prod,\0
```

Retrieve all recorded changes for the key `color` at a specific point-in-time.

```azurecli
az appconfig revision list --name <app-config-store-name> --key color --datetime "2019-05-01T11:24:12Z" 
```

Retrieve the last 10 recorded changes for the key `color` at a specific point-in-time.

```azurecli
az appconfig revision list --name <app-config-store-name> --key color --top 10 --datetime "2019-05-01T11:24:12Z" 
```

For more more examples and optional parameters, go to the [Azure CLI documentation](/cli/azure/appconfig/revision).

---

## Next steps

> [!div class="nextstepaction"]
> [Create an ASP.NET Core web app](./quickstart-aspnet-core-app.md)
