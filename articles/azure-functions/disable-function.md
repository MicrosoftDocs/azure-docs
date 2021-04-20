---
title: How to disable functions in Azure Functions
description: Learn how to disable and enable functions in Azure Functions.
ms.topic: conceptual
ms.date: 03/15/2021 
ms.custom: "devx-track-csharp"
---

# How to disable functions in Azure Functions

This article explains how to disable a function in Azure Functions. To *disable* a function means to make the runtime ignore the automatic trigger that's defined for the function. This lets you prevent a specific function from running without stopping the entire function app.

The recommended way to disable a function is with an app setting in the format `AzureWebJobs.<FUNCTION_NAME>.Disabled` set to `true`. You can create and modify this application setting in a number of ways, including by using the [Azure CLI](/cli/azure/) and from your function's **Overview** tab in the [Azure portal](https://portal.azure.com). 

> [!NOTE]  
> When you disable an HTTP triggered function by using the methods described in this article, the endpoint may still by accessible when running on your local computer.  

## Disable a function

# [Portal](#tab/portal)

Use the **Enable** and **Disable** buttons on the function's **Overview** page. These buttons work by changing the value of the `AzureWebJobs.<FUNCTION_NAME>.Disabled` app setting. This function-specific setting is created the first time it's disabled. 

![Function state switch](media/disable-function/function-state-switch.png)

Even when you publish to your function app from a local project, you can still use the portal to disable functions in the function app. 

> [!NOTE]  
> The portal-integrated testing functionality ignores the `Disabled` setting. This means that a disabled function still runs when started from the **Test** window in the portal. 

# [Azure CLI](#tab/azurecli)

In the Azure CLI, you use the [`az functionapp config appsettings set`](/cli/azure/functionapp/config/appsettings#az_functionapp_config_appsettings_set) command to create and modify the app setting. The following command disables a function named `QueueTrigger` by creating an app setting named `AzureWebJobs.QueueTrigger.Disabled` and setting it to `true`. 

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

# [Azure PowerShell](#tab/powershell)

The [`Update-AzFunctionAppSetting`](/powershell/module/az.functions/update-azfunctionappsetting) command adds or updates an application setting. The following command disables a function named `QueueTrigger` by creating an app setting named `AzureWebJobs.QueueTrigger.Disabled` and setting it to `true`. 

```azurepowershell-interactive
Update-AzFunctionAppSetting -Name <FUNCTION_APP_NAME> -ResourceGroupName <RESOURCE_GROUP_NAME> -AppSetting @{"AzureWebJobs.QueueTrigger.Disabled" = "true"}
```

To re-enable the function, rerun the same command with a value of `false`.

```azurepowershell-interactive
Update-AzFunctionAppSetting -Name <FUNCTION_APP_NAME> -ResourceGroupName <RESOURCE_GROUP_NAME> -AppSetting @{"AzureWebJobs.QueueTrigger.Disabled" = "false"}
```
---

## Functions in a slot

By default, app settings also apply to apps running in deployment slots. You can, however, override the app setting used by the slot by setting a slot-specific app setting. For example, you might want a function to be active in production but not during deployment testing, such as a timer triggered function. 

To disable a function only in the staging slot:

# [Portal](#tab/portal)

Navigate to the slot instance of your function app by selecting **Deployment slots** under **Deployment**, choosing your slot, and selecting **Functions** in the slot instance.  Choose your function, then use the **Enable** and **Disable** buttons on the function's **Overview** page. These buttons work by changing the value of the `AzureWebJobs.<FUNCTION_NAME>.Disabled` app setting. This function-specific setting is created the first time it's disabled. 

You can also directly add the app setting named `AzureWebJobs.<FUNCTION_NAME>.Disabled` with value of `true` in the **Configuration** for the slot instance. When you add a slot-specific app setting, make sure to check the **Deployment slot setting** box. This maintains the setting value with the slot during swaps.

# [Azure CLI](#tab/azurecli)

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

# [Azure PowerShell](#tab/powershell)

Azure PowerShell currently doesn't support this functionality.

---

To learn more, see [Azure Functions Deployment slots](functions-deployment-slots.md).

## local.settings.json

Functions can be disabled in the same way when running locally. To disable a function named `HttpExample`, add an entry to the Values collection in the local.settings.json file, as follows:

```json
{
  "IsEncrypted": false,
  "Values": {
    "FUNCTIONS_WORKER_RUNTIME": "python",
    "AzureWebJobsStorage": "UseDevelopmentStorage=true", 
    "AzureWebJobs.HttpExample.Disabled": "true"
  }
}
``` 

## Other methods

While the application setting method is recommended for all languages and all runtime versions, there are several other ways to disable functions. These methods, which vary by language and runtime version, are maintained for backward compatibility. 

### C# class libraries

In a class library function, you can also use the `Disable` attribute to prevent the function from being triggered. This attribute lets you customize the name of the setting used to disable the function. Use the version of the attribute that lets you define a constructor parameter that refers to a Boolean app setting, as shown in the following example:

```csharp
public static class QueueFunctions
{
    [Disable("MY_TIMER_DISABLED")]
    [FunctionName("QueueTrigger")]
    public static void QueueTrigger(
        [QueueTrigger("myqueue-items")] string myQueueItem, 
        TraceWriter log)
    {
        log.Info($"C# function processed: {myQueueItem}");
    }
}
```

This method lets you enable and disable the function by changing the app setting, without recompiling or redeploying. Changing an app setting causes the function app to restart, so the disabled state change is recognized immediately.

There's also a constructor for the parameter that doesn't accept a string for the setting name. This version of the attribute isn't recommended. If you use this version, you must recompile and redeploy the project to change the function's disabled state.

### Functions 1.x - scripting languages

In version 1.x, you can also use the `disabled` property of the *function.json* file to tell the runtime not to trigger a function. This method only works for scripting languages such as C# script and JavaScript. The `disabled` property can be set to `true` or to the name of an app setting:

```json
{
    "bindings": [
        {
            "type": "queueTrigger",
            "direction": "in",
            "name": "myQueueItem",
            "queueName": "myqueue-items",
            "connection":"MyStorageConnectionAppSetting"
        }
    ],
    "disabled": true
}
```
or 

```json
    "bindings": [
        ...
    ],
    "disabled": "IS_DISABLED"
```

In the second example, the function is disabled when there is an app setting that is named IS_DISABLED and is set to `true` or 1.

>[!IMPORTANT]  
>The portal uses application settings to disable v1.x functions. When an application setting conflicts with the function.json file, an error can occur. You should remove the `disabled` property from the function.json file to prevent errors. 


## Next steps

This article is about disabling automatic triggers. For more information about triggers, see [Triggers and bindings](functions-triggers-bindings.md).
