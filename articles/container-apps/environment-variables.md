---
title: Managing Environment Variables on Azure Container Apps
description: Learn to manage environment variables in Azure Container Apps
services: container-apps
author: fredcardoso
ms.service: container-apps
ms.topic: how-to
ms.date: 04/10/2024
ms.author: fredcardoso
---

# Managing Environment Variables on Azure Container Apps

In Azure Container Apps, you are able to set runtime environment variables. These can be set as manually entries or as references to [secrets](manage-secrets.md).
These environment variables will be loaded onto your Container App during runtime.

## Configuring environment variables

You can configure the Environment Variables upon the creation of the Container App or after it has been created by creating a new revision.

# [Azure Portal](#tab/portal)

If you are creating a new Container App through the [Azure portal](https://portal.azure.com), you can setup the environment variables on the Container section:

:::image type="content" source="media/environment-variables/creating-a-container-app.png" alt-text="Screenshot of Container App creation page.":::

# [Azure CLI](#tab/cli)

You can create your Container App with enviroment variables using the [az containerapp create](/cli/azure/containerapp#az-containerapp-create) command by passing the environment variables as space-separated 'key=value' entries using the `--env-vars` parameter.

If you want to reference a secret, you have to ensure that the secret you want to reference is already created, see [Manage secrets](manage-secrets.md). You can use the secret name and pass it to the value field but starting with `secretref:`

```azurecli
az containerapp create -n my-containerapp -g MyResourceGroup \
    --image my-app:v1.0 --environment MyContainerappEnv \
    --secrets mysecret=secretvalue1 anothersecret="secret value 2" \
    --env-vars GREETING="Hello, world" SECRETENV=secretref:anothersecret
```

## Adding environment variables on existing container apps

# [Azure Portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), search for Container Apps and then select your app.
:::image type="content" source="media/environment-variables/container-apps-portal.png" alt-text="Screenshot of the Azure Portal search bar with Container App as one of the results.":::
1. In the app's left menu, select Revisions and replicas > Create new revision
:::image type="content" source="media/environment-variables/create-new-revision.png" alt-text="Screenshot of Container App Revision creation page.":::
1. Then you have to edit the current existing container image:
:::image type="content" source="media/environment-variables/edit-revision.png" alt-text="Screenshot of Container App Revision container image settings page.":::
1. On the Environment variables section, you can Add new Environment variables by clicking on Add.

1. Then set the Name of your Environment variable and the Source (it can be a reference to a [secret](manage-secrets.md)).
:::image type="content" source="media/environment-variables/secret-env-var.png" alt-text="Screenshot of Container App Revision container image environment settings section.":::
    1. If you select the Source as manual, you can manually input the Environment variable value.
    :::image type="content" source="media/environment-variables/manual-env-var.png" alt-text="Screenshot of Container App Revision container image environment settings section with one of the environments source selected as Manual.":::

# [Azure CLI](#tab/cli)

You can update your Container App with the [az containerapp update](/cli/azure/containerapp#az-containerapp-update) command.

This example creates a environment variable with a manual value (not referencing a secret). Replace the \<PLACEHOLDERS\> with your values.

```azurecli
az containerapp update \
    -n <APP NAME> 
    -g <RESOURCE_GROUP_NAME> 
    --set-env-vars <VAR_NAME>=<VAR_VALUE>
```

If you want to create multiple environment variables, you can insert space-separated values in the 'key=value' format.

If you want to reference a secret, you have to ensure that the secret you want to reference is already created, see [Manage secrets](manage-secrets.md). You can use the secret name and pass it to the value field but starting with `secretref:`, see below:

```azurecli
az containerapp update \
    -n <APP NAME> 
    -g <RESOURCE_GROUP_NAME> 
    --set-env-vars <VAR_NAME>=secretref:<SECRET_NAME>
```

# [Powershell](#tab/powershell)

If you want to use Powershell you have to, first, create a in-memory object called Microsoft.Azure.PowerShell.Cmdlets.App.Models.EnvironmentVar using the [New-AzContainerAppEnvironmentVarObject](/powershell/module/az.app/new-azcontainerappenvironmentvarobject) Powershell cmdlet.

To use this cmdlet, you have to pass the name of the environment variable using the `-Name` parameter and the value using the `-Value` parameter, respectively.

```azurepowershell
$envVar = New-AzContainerAppEnvironmentVarObject -Name "envVarName" -Value "envVarvalue"
```

If you want to reference a secret, you have to ensure that the secret you want to reference is already created, see [Manage secrets](manage-secrets.md). You can use the secret name and pass it to the `-SecretRef` parameter:

```azurepowershell
$envVar = New-AzContainerAppEnvironmentVarObject -Name "envVarName" -SecretRef "secretName"
```

Then you have to create another in-memory object called Microsoft.Azure.PowerShell.Cmdlets.App.Models.Container using the [New-AzContainerAppTemplateObject](/powershell/module/az.app/new-azcontainerapptemplateobject) Powershell cmdlet.

On this cmdlet, you have to pass the name of your container image (not the container app!) you desire using the `-Name` parameter, the fully qualified image name using the `-Image` parameter and reference the environment object you defined previously on the variable `$envVar`.

```azurepowershell
$containerTemplate = New-AzContainerAppTemplateObject -Name "container-app-name" -Image "repo/imagename:tag" -Env $envVar
```

> [!NOTE]
> Please note that there are other settings that you might need to define inside the template object to avoid overriding them like resources, volume mounts, etc. Please check the full documentation about this template on [New-AzContainerAppTemplateObject](/powershell/module/az.app/new-azcontainerapptemplateobject).

Finally, you can update your Container App based on the new template object you created using the [Update-AzContainerApp](/powershell/module/az.app/update-azcontainerapp) Powershell cmdlet.

In this last cmdlet you only need to pass the template object you defined on the `$containerTemplate` variable on the previous step using the `-TemplateContainer` parameter.

```azurepowershell
Update-AzContainerApp -TemplateContainer $containerTemplate
```

## Next steps

 - [Revision management](revisions-manage.md)
