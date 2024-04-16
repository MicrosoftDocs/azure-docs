---
title: How to disable functions in Azure Functions
description: Learn how to disable and enable functions in Azure Functions.
ms.topic: conceptual
ms.date: 03/12/2024 
ms.custom: devx-track-csharp
---

# How to disable functions in Azure Functions

This article explains how to disable a function in Azure Functions. To *disable* a function means to make the runtime ignore the event intended to trigger the function. This ability lets you prevent a specific function from running without having to modify and republish the entire function app.

You can disable a function in place by creating an app setting in the format `AzureWebJobs.<FUNCTION_NAME>.Disabled` set to `true`. You can create and modify this application setting in several ways, including by using the [Azure CLI](/cli/azure/), [Azure PowerShell](/powershell/azure/), and from your function's **Overview** tab in the [Azure portal](https://portal.azure.com). 

Changes to application settings cause your function app to restart. For more information, see [App settings reference for Azure Functions](functions-app-settings.md).

## Disable a function

Use one of these modes to create an app setting that disables an example function named `QueueTrigger`: 

### [Portal](#tab/portal)

Use the **Enable** and **Disable** buttons on the function's **Overview** page. These buttons work by changing the value of the `AzureWebJobs.QueueTrigger.Disabled` app setting. The function-specific app setting is created the first time a function is disabled. 

![Function state switch](media/disable-function/function-state-switch.png)

Even when you publish to your function app from a local project, you can still use the portal to disable functions in the function app. 

> [!NOTE]  
> Disabled functions can still be run by calling the REST endpoint using a master key. To learn more, see [Run a disabled function](#run-a-disabled-function). This means that a disabled function still runs when started from the **Test/Run** window in the portal using the **master (Host key)**. 

### [Azure CLI](#tab/azurecli)

In the Azure CLI, you use the [`az functionapp config appsettings set`](/cli/azure/functionapp/config/appsettings#az-functionapp-config-appsettings-set) command to create and modify the app setting. The following command disables a function named `QueueTrigger` by creating an app setting named `AzureWebJobs.QueueTrigger.Disabled` and setting it to `true`.  

```azurecli-interactive
az functionapp config appsettings set --name <FUNCTION_APP_NAME> \
--resource-group <RESOURCE_GROUP_NAME> \
--settings AzureWebJobs.QueueTrigger.Disabled=true
```

To re-enable the function, rerun the same command with a value of `false`.

```azurecli-interactive
az functionapp config appsettings set --name <myFunctionApp> \
--resource-group <myResourceGroup> \
--settings AzureWebJobs.QueueTrigger.Disabled=false
```

### [Azure PowerShell](#tab/powershell)

The [`Update-AzFunctionAppSetting`](/powershell/module/az.functions/update-azfunctionappsetting) command adds or updates an application setting. The following command disables a function named `QueueTrigger` by creating an app setting named `AzureWebJobs.QueueTrigger.Disabled` and setting it to `true`. 

```azurepowershell-interactive
Update-AzFunctionAppSetting -Name <FUNCTION_APP_NAME> -ResourceGroupName <RESOURCE_GROUP_NAME> -AppSetting @{"AzureWebJobs.QueueTrigger.Disabled" = "true"}
```

To re-enable the function, rerun the same command with a value of `false`.

```azurepowershell-interactive
Update-AzFunctionAppSetting -Name <FUNCTION_APP_NAME> -ResourceGroupName <RESOURCE_GROUP_NAME> -AppSetting @{"AzureWebJobs.QueueTrigger.Disabled" = "false"}
```
---

## Disable functions in a slot

By default, app settings also apply to apps running in deployment slots. You can, however, override the app setting used by the slot by setting a slot-specific app setting. For example, you might want a function to be active in production but not during deployment testing. It's common to disable timer triggered functions in slots to prevent simultaneous executions. 

To disable a function only in the staging slot:

### [Portal](#tab/portal)

Navigate to the slot instance of your function app by selecting **Deployment slots** under **Deployment**, choosing your slot, and selecting **Functions** in the slot instance. Choose your function, then use the **Enable** and **Disable** buttons on the function's **Overview** page. These buttons work by changing the value of the `AzureWebJobs.<FUNCTION_NAME>.Disabled` app setting. This function-specific setting is created the first time you disable the function. 

You can also directly add the app setting named `AzureWebJobs.<FUNCTION_NAME>.Disabled` with value of `true` in the **Configuration** for the slot instance. When you add a slot-specific app setting, make sure to check the **Deployment slot setting** box. This option maintains the setting value with the slot during swaps.

### [Azure CLI](#tab/azurecli)

```azurecli-interactive
az functionapp config appsettings set --name <FUNCTION_APP_NAME> \
--resource-group <RESOURCE_GROUP_NAME> --slot <SLOT_NAME> \
--slot-settings AzureWebJobs.QueueTrigger.Disabled=true
```
To re-enable the function, rerun the same command with a value of `false`.

```azurecli-interactive
az functionapp config appsettings set --name <myFunctionApp> \
--resource-group <myResourceGroup> --slot <SLOT_NAME> \
--slot-settings AzureWebJobs.QueueTrigger.Disabled=false
```

### [Azure PowerShell](#tab/powershell)

Azure PowerShell currently doesn't support this functionality.

---

To learn more, see [Azure Functions Deployment slots](functions-deployment-slots.md).

## Run a disabled function

You can still cause a disabled function to run by supplying the [master key](functions-bindings-http-webhook-trigger.md#master-key-admin-level) in a REST request to the endpoint URL of the disabled function. In this way, you can develop and validate functions in Azure in a disabled state while preventing them from being accessed by others. Using any other type of key in the request returns an HTTP 404 response. 

[!INCLUDE [functions-master-key-caution](../../includes/functions-master-key-caution.md)]

To learn more about the master key, see [Obtaining keys](functions-bindings-http-webhook-trigger.md#obtaining-keys). To learn more about calling non-HTTP triggered functions, see [Manually run a non HTTP-triggered function](functions-manually-run-non-http.md).

## Disable functions locally 

Functions can be disabled in the same way when running locally. To disable a function named `QueueTrigger`, add an entry to the Values collection in the local.settings.json file, as follows:

```json
{
  "IsEncrypted": false,
  "Values": {
    "FUNCTIONS_WORKER_RUNTIME": "python",
    "AzureWebJobsStorage": "UseDevelopmentStorage=true", 
    "AzureWebJobs.QueueTrigger.Disabled": true
  }
}
``` 

## Considerations

Keep the following considerations in mind when you disable functions:

+ When you disable an HTTP triggered function by using the methods described in this article, the endpoint can still be accessed when running on your local computer and [in the portal](#run-a-disabled-function).  

+ At this time, function names that contain a hyphen (`-`) can't be disabled when running on Linux. If you plan to disable your functions when running on Linux, don't use hyphens in your function names.

## Next steps

This article is about disabling automatic triggers. For more information about triggers, see [Triggers and bindings](functions-triggers-bindings.md).
