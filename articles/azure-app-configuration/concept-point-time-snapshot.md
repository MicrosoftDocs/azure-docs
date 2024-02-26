---
title: Retrieve key-values from a point-in-time
titleSuffix: Azure App Configuration
description: Retrieve old key-values using point-in-time revisions in Azure App Configuration, which maintains a record of changes to key-values.
services: azure-app-configuration
author: maud-lv
ms.author: malev
ms.service: azure-app-configuration
ms.custom: devx-track-azurecli
ms.topic: conceptual
ms.date: 05/24/2023
---

# Point-in-time key-values

Azure App Configuration maintains a record of changes made to key-values. This record provides a timeline of key-value changes. You can reconstruct the history of any key and provide its past value at any moment within the key history period (7 days for Free tier stores, or 30 days for Standard tier stores). Using this feature, you can “time-travel” backward and retrieve an old key-value. For example, you can recover configuration settings used before the most recent deployment in order to roll back the application to the previous configuration.

## Restore key-values

You can use the Azure portal or the Azure CLI to retrieve past key-values.

### [Portal](#tab/azure-portal)

1. Sign in to the [Azure portal](https://portal.azure.com). Select **All resources**, and select the App Configuration store instance where your key-value are stored.

2. In the **Operations** menu, select **Restore**.

   :::image type="content" source="media/restore-key-value-portal.png" alt-text="Screenshot of the Azure portal, selecting restore":::

3. Select **Date: Select date** to select a date and time you want to revert to.
4. Click outside of the date and time fields or press **Tab** to validate your choice. You can now see which key values have changed between your selected date and time and the current time. This step helps you understand what keys and values you're preparing to revert to. 

   :::image type="content" source="media/restore-key-value-past-values.png" alt-text="Screenshot of the Azure portal with saved key-values":::

   The portal displays a table of key-values. The first column includes symbols indicating what will happen if you restore the data for the chosen date and time:
   - The red minus sign (–) means that the key-value didn't exist at your selected date and time and will be deleted.
   - The green plus sign (+) means that the key-value existed at your selected date and time and doesn't exist now. If you revert to selected date and time it will be added back to your configuration.
   - The orange bullet sign (•) means that the key-value was modified since your selected date and time. The key will revert to the value it had at the selected date and time.

5. Select the checkbox in the row to select/deselect the key value to take action. When selected it will display the difference for the key value between the current and selected date and time.

   :::image type="content" source="media/restore-key-value-compare.png" alt-text="Screenshot of the Azure portal with compared keys-values":::

   In the above example, the preview shows the key TestApp:Settings:BackgroundColor, which currently has a value of #FFF. This value will be modified to #45288E if we go through with restoring the data.

   You can select one or more checkboxes in the table to take action on the key-value of your choice. You can also use the select-all checkbox at the very top of the list to select/deselect all key-values.

6. Select **Restore** to restore the selected key-value(s) to the selected data and time.

   :::image type="content" source="media/restore-key-value-confirm.png" alt-text="Screenshot of the Azure portal selecting Restore":::

### [Azure CLI](#tab/azure-cli)

Use the Azure CLI as explained below to retrieve and restore past key-values. If you don't have the Azure CLI installed locally, you can optionally use [Azure Cloud Shell](../cloud-shell/overview.md).

In the CLI, use `az appconfig revision list` to view changes or `az appconfig kv restore` to restore key-values, adding appropriate parameters. Specify the Azure App Configuration instance by providing either the store name (`--name <app-config-store-name>`) or by using a connection string (`--connection-string <your-connection-string>`). Restrict the output by specifying a specific point in time (`--datetime`), a label (`--label`) and the maximum number of items to return (`--top`).
and by specifying the maximum number of items to return (`--top`).

Retrieve all recorded changes to your key-values.

```azurecli
az appconfig revision list --name <your-app-config-store-name>
```

Restore all key-values to a specific point in time.

```azurecli
az appconfig kv restore --name <app-config-store-name> --datetime "2019-05-01T11:24:12Z"
```

Restore for any label starting with v1. to a specific point in time.

```azurecli
az appconfig kv restore --name <app-config-store-name> --label v1.* --datetime "2019-05-01T11:24:12Z"
```

For more examples of CLI commands and optional parameters to restore key-value, go to the [Azure CLI documentation](/cli/azure/appconfig/kv).

You can also access the history of a specific key-value. This feature allows you to check the value of a specific key at a chosen point in time and to revert to a past value without updating any other key-value.

---

## Historical/Timeline view of key-value

   > [!TIP]
   > This method is convenient if you have no more than a couple of changes to make, as Configuration explorer only lets you make changes key by key. If you need to restore multiple key-values at once, use the **Restore** menu instead.

### [Portal](#tab/azure-portal)

You can also access the revision history of a specific key-value in the portal.

1. In the **Operations** menu, select **Configuration explorer**.
1. Select **More actions** for the key you want to explore, and then **History**

   :::image type="content" source="media/explorer-key-history.png" alt-text="Screenshot of the Azure portal selecting key-value history":::

   You can now see the revision history for the selected key and information about the changes.

1. Select **Restore** to restore the key and value to this point in time.

   :::image type="content" source="media/explorer-key-day-restore.png" alt-text="Screenshot of the Azure portal viewing key-value data for a specific date":::


### [Azure CLI](#tab/azure-cli)

Use the Azure CLI as explained below to retrieve and restore a single key-value. If you don't have the Azure CLI installed locally, you can optionally use [Azure Cloud Shell](../cloud-shell/overview.md).

In the CLI, use `az appconfig revision list` to view changes to a key-value or use `az appconfig kv restore` to restore a key-value, adding appropriate parameters. Specify the Azure App Configuration instance by providing either the store name (`--name <app-config-store-name>`) or by using a connection string (`--connection-string <your-connection-string>`). Restrict the output by specifying a specific key  (`--key`). Optionally, specify a label (`--label`), a point in time (`--datetime`) and the maximum number of items to return (`--top`).

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

For more examples and optional parameters, go to the [Azure CLI documentation](/cli/azure/appconfig/revision).

---

## Next steps

> [!div class="nextstepaction"]
> [Create an ASP.NET Core web app](./quickstart-aspnet-core-app.md)
