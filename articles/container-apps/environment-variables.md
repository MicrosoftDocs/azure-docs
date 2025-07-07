---
title: Manage environment variables on Azure Container Apps
description: Learn to manage environment variables in Azure Container Apps.
services: container-apps
author: fred-cardoso
ms.service: azure-container-apps
ms.custom: devx-track-azurecli, devx-track-azurepowershell
ms.topic: how-to
ms.date: 02/03/2025
ms.author: fredcardoso
---

# Manage environment variables on Azure Container Apps

In Azure Container Apps, you're able to set runtime environment variables. These variables can be set as manually entries or as references to [secrets](manage-secrets.md).
These environment variables are loaded onto your Container App during runtime.

## Configure environment variables

You can configure the Environment Variables upon the creation of the Container App or later by creating a new revision.

> [!NOTE]
> To avoid confusion, it is not recommended to duplicate environment variables. When multiple environment variables have the same name, the last one in the list takes effect.

### [Azure portal](#tab/portal)

If you're creating a new Container App through the [Azure portal](https://portal.azure.com), you can set up the environment variables on the Container section:

:::image type="content" source="media/environment-variables/creating-a-container-app.png" alt-text="Screenshot of Container App creation page.":::

### [Azure CLI](#tab/cli)

You can create your Container App with environment variables using the [az containerapp create](/cli/azure/containerapp#az-containerapp-create) command by passing the environment variables as space-separated 'key=value' entries using the `--env-vars` parameter.

```azurecli
az containerapp create -n my-containerapp -g MyResourceGroup \
    --image my-app:v1.0 --environment MyContainerappEnv \
    --secrets mysecret=secretvalue1 anothersecret="secret value 2" \
    --env-vars GREETING="Hello, world" ANOTHERENV=anotherenv
```

If you want to reference a secret, you have to ensure that the secret you want to reference is already created, see [Manage secrets](manage-secrets.md). You can use the secret name and pass it to the value field but starting with `secretref:`

```azurecli
az containerapp update \
    -n <APP NAME> 
    -g <RESOURCE_GROUP_NAME> 
    --set-env-vars <VAR_NAME>=secretref:<SECRET_NAME>
```

### [PowerShell](#tab/powershell)

If you want to use PowerShell you have to, first, create an in-memory object called [EnvironmentVar](/dotnet/api/Microsoft.Azure.PowerShell.Cmdlets.App.Models.EnvironmentVar) using the [New-AzContainerAppEnvironmentVarObject](/powershell/module/az.app/new-azcontainerappenvironmentvarobject) PowerShell cmdlet.

To use this cmdlet, you have to pass the name of the environment variable using the `-Name` parameter and the value using the `-Value` parameter, respectively.

```azurepowershell
$envVar = New-AzContainerAppEnvironmentVarObject -Name "envVarName" -Value "envVarvalue"
```

If you want to reference a secret, you have to ensure that the secret you want to reference is already created, see [Manage secrets](manage-secrets.md). You can use the secret name and pass it to the `-SecretRef` parameter:

```azurepowershell
$envVar = New-AzContainerAppEnvironmentVarObject -Name "envVarName" -SecretRef "secretName"
```

Then you have to create another in-memory object called [Container](/dotnet/api/Microsoft.Azure.PowerShell.Cmdlets.App.Models.Container) using the [New-AzContainerAppTemplateObject](/powershell/module/az.app/new-azcontainerapptemplateobject) PowerShell cmdlet.

On this cmdlet, you have to pass the name of your container image (not the container app!) you desire using the `-Name` parameter, the fully qualified image name using the `-Image` parameter and reference the environment object you defined previously on the variable `$envVar`.

```azurepowershell
$containerTemplate = New-AzContainerAppTemplateObject -Name "container-app-name" -Image "repo/imagename:tag" -Env $envVar
```

> [!NOTE]
> Please note that there are other settings that you might need to define inside the template object to avoid overriding them like resources, volume mounts, etc. Please check the full documentation about this template on [New-AzContainerAppTemplateObject](/powershell/module/az.app/new-azcontainerapptemplateobject).

Finally, you can update your Container App based on the new template object you created using the [Update-AzContainerApp](/powershell/module/az.app/update-azcontainerapp) PowerShell cmdlet.

In this last cmdlet, you only need to pass the template object you defined on the `$containerTemplate` variable on the previous step using the `-TemplateContainer` parameter.

```azurepowershell
Update-AzContainerApp -TemplateContainer $containerTemplate
```

---

## Add environment variables on existing container apps

After the Container App is created, the only way to update the Container App environment variables is by creating a new revision with the needed changes.

### [Azure portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), search for Container Apps and then select your app.

    :::image type="content" source="media/environment-variables/container-apps-portal.png" alt-text="Screenshot of the Azure portal search bar with Container App as one of the results.":::

1. In the app's left menu, select Revisions and replicas > Create new revision

    :::image type="content" source="media/environment-variables/create-new-revision.png" alt-text="Screenshot of Container App Revision creation page.":::

1. Then you have to edit the current existing container image:

    :::image type="content" source="media/environment-variables/edit-revision.png" alt-text="Screenshot of Container App Revision container image settings page.":::

1. In the Environment variables section, you can Add new Environment variables by clicking on Add.

1. Then set the Name of your Environment variable and the Source (it can be a reference to a [secret](manage-secrets.md)).

    :::image type="content" source="media/environment-variables/secret-env-var.png" alt-text="Screenshot of Container App Revision container image environment settings section.":::

    1. If you select the Source as manual, you can manually input the Environment variable value.
    
        :::image type="content" source="media/environment-variables/manual-env-var.png" alt-text="Screenshot of Container App Revision container image environment settings section with one of the environments source selected as Manual.":::

### [Azure CLI](#tab/cli)

You can update your Container App with the [az containerapp update](/cli/azure/containerapp#az-containerapp-update) command.

This example creates an environment variable with a manual value (not referencing a secret). Replace the \<PLACEHOLDERS\> with your values.

```azurecli
az containerapp update \
    -n <APP NAME> 
    -g <RESOURCE_GROUP_NAME> 
    --set-env-vars <VAR_NAME>=<VAR_VALUE>
```

If you want to create multiple environment variables, you can insert space-separated values in the 'key=value' format.

If you want to reference a secret, you have to ensure that the secret you want to reference is already created, see [Manage secrets](manage-secrets.md). You can use the secret name and pass it to the value field but starting with `secretref:`, see the following example:

```azurecli
az containerapp update \
    -n <APP NAME> 
    -g <RESOURCE_GROUP_NAME> 
    --set-env-vars <VAR_NAME>=secretref:<SECRET_NAME>
```

### [PowerShell](#tab/powershell)

Similarly to what you need to do upon creating a new Container App you have to create an object called [EnvironmentVar](/dotnet/api/Microsoft.Azure.PowerShell.Cmdlets.App.Models.EnvironmentVar), which is contained within a [Container](/dotnet/api/Microsoft.Azure.PowerShell.Cmdlets.App.Models.Container). This [Container](/dotnet/api/Microsoft.Azure.PowerShell.Cmdlets.App.Models.Container) is then used with the [New-AzContainerApp](/powershell/module/az.app/new-azcontainerapp) PowerShell cmdlet.


In this cmdlet, you only need to pass the template object you defined previously as described in the [Configure environment variables](#configure-environment-variables) section.


```azurepowershell
Update-AzContainerApp -TemplateContainer $containerTemplate
```

---

## Built-in environment variables

Azure Container Apps automatically adds environment variables that your apps and jobs can use to obtain platform metadata at run-time.

### Apps

The following variables are available to container apps:

| Variable name | Description | Example value |
|---------------|-------------| ------------- |
| `CONTAINER_APP_NAME` | The name of the container app. | `my-containerapp` |
| `CONTAINER_APP_REVISION` | The name of the container app revision. | `my-containerapp--20mh1s9` |
| `CONTAINER_APP_HOSTNAME` | The revision-specific hostname of the container app. | `my-containerapp--20mh1s9.<DEFAULT_HOSTNAME>.<REGION>.azurecontainerapps.io` |
| `CONTAINER_APP_ENV_DNS_SUFFIX` | The DNS suffix for the Container Apps environment. To obtain the fully qualified domain name (FQDN) of the app, append the app name to the DNS suffix in the format `$CONTAINER_APP_NAME.$CONTAINER_APP_ENV_DNS_SUFFIX`. | `<DEFAULT_HOSTNAME>.<REGION>.azurecontainerapps.io` |
| `CONTAINER_APP_PORT` | The target port of the container app. | `8080` |
| `CONTAINER_APP_REPLICA_NAME` | The name of the container app replica. | `my-containerapp--20mh1s9-86c8c4b497-zx9bq` |

### Jobs

The following variables are available to Container Apps jobs:

| Variable name | Description | Example value |
|---------------|-------------| ------------- |
| `CONTAINER_APP_JOB_NAME` | The name of the job. | `my-job` |
| `CONTAINER_APP_JOB_EXECUTION_NAME` | The name of the job execution. | `my-job-iwpi4il` |

## Next steps

- [Revision management](revisions-manage.md)
