---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 11/03/2022
ms.author: glenga
---
::: zone pivot="programming-language-csharp,programming-language-java,programming-language-javascript,programming-language-typescript,programming-language-python"
You might also need to update the `linuxFxVersion` site setting to target your specific language version. If you already have the correct value of `linuxFxVersion` set, you can skip this step. For more information, see [Valid `linuxFxVersion` values](../articles/azure-functions/functions-app-settings.md#valid-linuxfxversion-values).
::: zone-end
::: zone pivot="programming-language-powershell"
PowerShell apps aren't supported on Linux before Functions 4.x. This fact means you shouldn't need to upgrade a PowerShell function app running on Linux. 
::: zone-end
::: zone pivot="programming-language-csharp"
```azurecli
az functionapp config set --name <APP_NAME> --resource-group <RESOURCE_GROUP_NAME> --linux-fx-version "DOTNET|6.0"
```
If you're migrating to .NET Functions isolated worker process, use either `DOTNET-ISOLATED|6.0` or `DOTNET-ISOLATED|7.0` for `--linux-fx-version`. 
:::zone-end
::: zone pivot="programming-language-java"
```azurecli
az functionapp config set --name <APP_NAME> --resource-group <RESOURCE_GROUP_NAME> --linux-fx-version "Java|11"
```
The `--linux-fx-version` value must match your target Java version. 
:::zone-end
::: zone pivot="programming-language-javascript,programming-language-typescript"
```azurecli
az functionapp config set --name <APP_NAME> --resource-group <RESOURCE_GROUP_NAME> --linux-fx-version "Node|16"
```
The `--linux-fx-version` value must match your target Node.js version. 
:::zone-end
::: zone pivot="programming-language-python"
```azurecli
az functionapp config set --name <APP_NAME> --resource-group <RESOURCE_GROUP_NAME> --linux-fx-version "Python|3.9"
```
The `--linux-fx-version` value must match your target PowerShell version. 
:::zone-end