---
author: ggailey777
ms.service: azure-functions
ms.custom: devx-track-azurecli
ms.topic: include
ms.date: 11/03/2022
ms.author: glenga
---

## Upgrade your function app in Azure

You need to upgrade the runtime of the function app host in Azure to version 4.x before you publish your migrated project. The runtime version used by the Functions host is controlled by the `FUNCTIONS_EXTENSION_VERSION` application setting, but in some cases other settings must also be updated. Both code changes and changes to application settings require your function app to restart.

The easiest way is to [upgrade without slots](#upgrade-without-slots) and then republish your app project. You can also minimize the downtime in your app and simplify rollback by [upgrading using slots](#upgrade-using-slots). 

### Upgrade without slots

The simplest way to upgrade to v4.x is to set the `FUNCTIONS_EXTENSION_VERSION` application setting to `~4` on your function app in Azure. You must follow a [different procedure](#upgrade-using-slots) on a site with slots. 

# [Azure CLI](#tab/azure-cli)

```azurecli
az functionapp config appsettings set --settings FUNCTIONS_EXTENSION_VERSION=~4 -g <RESOURCE_GROUP_NAME> -n <APP_NAME>
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Update-AzFunctionAppSetting -AppSetting @{"FUNCTIONS_EXTENSION_VERSION" = "~4"} -Name <APP_NAME> -ResourceGroupName <RESOURCE_GROUP_NAME> -Force
```
---

During upgrade, you must also set another setting, which differs between Windows and Linux.

# [Windows](#tab/windows/azure-cli)

When running on Windows, you also need to enable .NET 6.0, which is required by version 4.x of the runtime.

```azurecli
az functionapp config set --net-framework-version v6.0 -g <RESOURCE_GROUP_NAME> -n <APP_NAME>
```

.NET 6 is required for function apps in any language running on Windows.

# [Windows](#tab/windows/azure-powershell)

When running on Windows, you also need to enable .NET 6.0, which is required by version 4.x of the runtime.

```azurepowershell
Set-AzWebApp -NetFrameworkVersion v6.0 -Name <APP_NAME> -ResourceGroupName <RESOURCE_GROUP_NAME>
```

.NET 6 is required for function apps in any language running on Windows.

# [Linux](#tab/linux/azure-cli)

[!INCLUDE [functions-migrate-v4-linuxfxversion](./functions-migrate-v4-linuxfxversion.md)]

# [Linux](#tab/linux/azure-powershell)

When running .NET apps on Linux, you also need to update the `linuxFxVersion` site setting. Unfortunately, Azure PowerShell can't be used to set the `linuxFxVersion` at this time. Use the Azure CLI instead.

---

In this example, replace `<APP_NAME>` with the name of your function app and `<RESOURCE_GROUP_NAME>` with the name of the resource group. 

You can now republish your app project that has been migrated to run on version 4.x.

### Upgrade using slots

Using [deployment slots](../articles/azure-functions/functions-deployment-slots.md) is a good way to upgrade your function app to the v4.x runtime from a previous version. By using a staging slot, you can run your app on the new runtime version in the staging slot and switch to production after verification. Slots also provide a way to minimize downtime during upgrade. If you need to minimize downtime, follow the steps in [Minimum downtime upgrade](#minimum-downtime-upgrade).    

After you've verified your app in the upgraded slot, you can swap the app and new version settings into production. This swap requires setting [`WEBSITE_OVERRIDE_STICKY_EXTENSION_VERSIONS=0`](../articles/azure-functions/functions-app-settings.md#website_override_sticky_extension_versions) in the production slot. How you add this setting affects the amount of downtime required for the upgrade. 

#### Standard upgrade

If your slot-enabled function app can handle the downtime of a full restart, you can update the `WEBSITE_OVERRIDE_STICKY_EXTENSION_VERSIONS` setting directly in the production slot. Because changing this setting directly in the production slot causes a restart that impacts availability, consider doing this change at a time of reduced traffic. You can then swap in the upgraded version from the staging slot. 

The [`Update-AzFunctionAppSetting`](/powershell/module/az.functions/update-azfunctionappsetting) PowerShell cmdlet doesn't currently support slots. You must use Azure CLI or the Azure portal.

1. Use the following command to set `WEBSITE_OVERRIDE_STICKY_EXTENSION_VERSIONS=0` in the production slot:

    ```azurecli
    az functionapp config appsettings set --settings WEBSITE_OVERRIDE_STICKY_EXTENSION_VERSIONS=0  -g <RESOURCE_GROUP_NAME>  -n <APP_NAME> 
    ```

    In this example, replace `<APP_NAME>` with the name of your function app and `<RESOURCE_GROUP_NAME>` with the name of the resource group. This command causes the app running in the production slot to restart. 

1. Use the following command to also set `WEBSITE_OVERRIDE_STICKY_EXTENSION_VERSIONS` in the staging slot:

    ```azurecli
    az functionapp config appsettings set --settings WEBSITE_OVERRIDE_STICKY_EXTENSION_VERSIONS=0 -g <RESOURCE_GROUP_NAME>  -n <APP_NAME> --slot <SLOT_NAME>
    ```

1. Use the following command to change `FUNCTIONS_EXTENSION_VERSION` and upgrade the staging slot to the new runtime version:

    ```azurecli
    az functionapp config appsettings set --settings FUNCTIONS_EXTENSION_VERSION=~4 -g <RESOURCE_GROUP_NAME>  -n <APP_NAME> --slot <SLOT_NAME>
    ```

1. Version 4.x of the Functions runtime requires .NET 6 in Windows. On Linux, .NET apps must also upgrade to .NET 6. Use the following command so that the runtime can run on .NET 6:
   
    # [Windows](#tab/windows)

    When running on Windows, you also need to enable .NET 6.0, which is required by version 4.x of the runtime.

    ```azurecli
    az functionapp config set --net-framework-version v6.0 -g <RESOURCE_GROUP_NAME> -n <APP_NAME>
    ```

    .NET 6 is required for function apps in any language running on Windows.

    # [Linux](#tab/linux)

    [!INCLUDE [functions-migrate-v4-linuxfxversion](./functions-migrate-v4-linuxfxversion.md)]

    ---

    In this example, replace `<APP_NAME>` with the name of your function app and `<RESOURCE_GROUP_NAME>` with the name of the resource group. 

1. If your code project required any updates to run on version 4.x, deploy those updates to the staging slot now.

1. Confirm that your function app runs correctly in the upgraded staging environment before swapping.

1. Use the following command to swap the upgraded staging slot to production:

    ```azurecli
    az functionapp deployment slot swap -g <RESOURCE_GROUP_NAME>  -n <APP_NAME> --slot <SLOT_NAME> --target-slot production
    ```

#### Minimum downtime upgrade

To minimize the downtime in your production app, you can swap the `WEBSITE_OVERRIDE_STICKY_EXTENSION_VERSIONS` setting from the staging slot into production. After that, you can swap in the upgraded version from a prewarmed staging slot. 

1. Use the following command to set `WEBSITE_OVERRIDE_STICKY_EXTENSION_VERSIONS=0` in the staging slot:

    ```azurecli
    az functionapp config appsettings set --settings WEBSITE_OVERRIDE_STICKY_EXTENSION_VERSIONS=0 -g <RESOURCE_GROUP_NAME>  -n <APP_NAME> --slot <SLOT_NAME>
    ```
1. Use the following commands to swap the slot with the new setting into production, and at the same time restore the version setting in the staging slot. 

    ```azurecli
    az functionapp deployment slot swap -g <RESOURCE_GROUP_NAME>  -n <APP_NAME> --slot <SLOT_NAME> --target-slot production
    az functionapp config appsettings set --settings FUNCTIONS_EXTENSION_VERSION=~3 -g <RESOURCE_GROUP_NAME>  -n <APP_NAME> --slot <SLOT_NAME>
    ```

    You may see errors from the staging slot during the time between the swap and the runtime version being restored on staging. This error can happen because having `WEBSITE_OVERRIDE_STICKY_EXTENSION_VERSIONS=0` only in staging during a swap removes the `FUNCTIONS_EXTENSION_VERSION` setting in staging. Without the version setting, your slot is in a bad state. Updating the version in the staging slot right after the swap should put the slot back into a good state, and you call roll back your changes if needed. However, any rollback of the swap also requires you to directly remove `WEBSITE_OVERRIDE_STICKY_EXTENSION_VERSIONS=0` from production before the swap back to prevent the same errors in production seen in staging. This change in the production setting would then cause a restart.

1. Use the following command to again set `WEBSITE_OVERRIDE_STICKY_EXTENSION_VERSIONS=0` in the staging slot:

    ```azurecli
    az functionapp config appsettings set --settings WEBSITE_OVERRIDE_STICKY_EXTENSION_VERSIONS=0 -g <RESOURCE_GROUP_NAME>  -n <APP_NAME> --slot <SLOT_NAME>
    ```

    At this point, both slots have `WEBSITE_OVERRIDE_STICKY_EXTENSION_VERSIONS=0` set.

1. Use the following command to change `FUNCTIONS_EXTENSION_VERSION` and upgrade the staging slot to the new runtime version:

    ```azurecli
    az functionapp config appsettings set --settings FUNCTIONS_EXTENSION_VERSION=~4 -g <RESOURCE_GROUP_NAME>  -n <APP_NAME> --slot <SLOT_NAME>
    ```

1. Version 4.x of the Functions runtime requires .NET 6 in Windows. On Linux, .NET apps must also upgrade to .NET 6. Use the following command so that the runtime can run on .NET 6:
   
    # [Windows](#tab/windows)

    When running on Windows, you also need to enable .NET 6.0, which is required by version 4.x of the runtime.

    ```azurecli
    az functionapp config set --net-framework-version v6.0 -g <RESOURCE_GROUP_NAME> -n <APP_NAME>
    ```

    .NET 6 is required for function apps in any language running on Windows.

    # [Linux](#tab/linux)

    [!INCLUDE [functions-migrate-v4-linuxfxversion](./functions-migrate-v4-linuxfxversion.md)]

    ---

    In this example, replace `<APP_NAME>` with the name of your function app and `<RESOURCE_GROUP_NAME>` with the name of the resource group. 

1. If your code project required any updates to run on version 4.x, deploy those updates to the staging slot now.

1. Confirm that your function app runs correctly in the upgraded staging environment before swapping.

1. Use the following command to swap the upgraded and prewarmed staging slot to production:

    ```azurecli
    az functionapp deployment slot swap -g <RESOURCE_GROUP_NAME>  -n <APP_NAME> --slot <SLOT_NAME> --target-slot production
    ```
