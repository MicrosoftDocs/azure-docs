---
title: Manage revisions in Azure Container Apps
description: Manage revisions in Azure Container Apps
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.custom: devx-track-azurepowershell, devx-track-azurecli
ms.topic: conceptual
ms.date: 02/03/2025
ms.author: cshoe
---

# Manage revisions in Azure Container Apps

Azure Container Apps allows your container app to support multiple revisions. With this feature, you can activate and deactivate revisions, and control the amount of [traffic sent to each revision](#traffic-splitting). To learn more about revisions, see [Revisions in Azure Container Apps](revisions.md).

A revision is created when you first deploy your application. New revisions are created when you [update](#updating-your-container-app) your application with [revision-scope changes](revisions.md#revision-scope-changes). You can also update your container app based on a specific revision.  

This article describes the commands to manage your container app's revisions. For more information about Container Apps commands, see [`az containerapp`](/cli/azure/containerapp). For more information about commands to manage revisions, see [`az containerapp revision`](/cli/azure/containerapp/revision).

## Updating your container app

To update a container app, use the [`az containerapp update`](/cli/azure/containerapp#az-containerapp-update) command. With this command you can modify environment variables, compute resources, scale parameters, and deploy a different image. If your container app update includes [revision-scope changes](revisions.md#revision-scope-changes), a new revision is generated.

# [Bash](#tab/bash)

This example updates the container image. Replace the \<PLACEHOLDERS\> with your values.

```azurecli
az containerapp update \
  --name <APPLICATION_NAME> \
  --resource-group <RESOURCE_GROUP_NAME> \
  --image <IMAGE_NAME>
```

# [PowerShell](#tab/powershell)

Replace the \<PLACEHOLDERS\> with your values.

```powershell
$ImageParams = @{
    Name = '<ContainerName>'
    Image = 'mcr.microsoft.com/k8se/quickstart'
}
$TemplateObj = New-AzContainerAppTemplateObject @ImageParams

$UpdateArgs = @{
  Name = '<ApplicationName>'
  ResourceGroupName = '<ResourceGroupName>'
  Location = '<Location>'
}
Update-AzContainerApp @UpdateArgs
```

---

You can also update your container app with the [Revision copy](#revision-copy) command.

## Revision list

List all revisions associated with your container app with `az containerapp revision list`. For more information about this command, see [`az containerapp revision list`](/cli/azure/containerapp/revision#az-containerapp-revision-list)

# [Bash](#tab/bash)

Replace the \<PLACEHOLDERS\> with your values.

```azurecli
az containerapp revision list \
  --name <APPLICATION_NAME> \
  --resource-group <RESOURCE_GROUP_NAME> \
  -o table
```

# [PowerShell](#tab/powershell)

Replace the \<PLACEHOLDERS\> with your values.

```powershell
$CmdArgs = @{
  ContainerAppName = '<CONTAINER_APP_NAME>'
  ResourceGroupName = '<RESOURCE_GROUP_NAME>'
}

Get-AzContainerAppRevision @CmdArgs
```

---

## Revision show

Show details about a specific revision by using the [`az containerapp revision show`](/cli/azure/containerapp/revision#az-containerapp-revision-show) command.

# [Bash](#tab/bash)

Replace the \<PLACEHOLDERS\> with your values.

```azurecli
az containerapp revision show \
  --name <APPLICATION_NAME> \
  --revision <REVISION_NAME> \
  --resource-group <RESOURCE_GROUP_NAME>
```

# [PowerShell](#tab/powershell)

Replace the \<PLACEHOLDERS\> with your values.

```powershell
$CmdArgs = @{
  ContainerAppName = '<CONTAINER_APP_NAME>'
  ResourceGroupName = '<RESOURCE_GROUP_NAME>'
  RevisionName = '<REVISION_NAME>'
}

$RevisionObject = (Get-AzContainerAppRevision @CmdArgs) | Select-Object -Property *
echo $RevisionObject
```

---

## Revision copy

To create a new revision based on an existing revision, use the `az containerapp revision copy`. Container Apps uses the configuration of the existing revision, which you can then modify.  

With this command, you can modify environment variables, compute resources, scale parameters, and deploy a different image. You can also use a YAML file to define these and other configuration options and parameters. For more information regarding this command, see [`az containerapp revision copy`](/cli/azure/containerapp/revision#az-containerapp-revision-copy).

This example copies the latest revision and sets the compute resource parameters. (Replace the \<PLACEHOLDERS\> with your values.)

# [Bash](#tab/bash)

```azurecli
az containerapp revision copy \
  --name <APPLICATION_NAME> \
  --resource-group <RESOURCE_GROUP_NAME> \
  --cpu 0.75 \
  --memory 1.5Gi
```

# [PowerShell](#tab/powershell)

The following example demonstrates how to copy a container app revision using the Azure CLI command. There isn't an equivalent PowerShell command. 

```powershell
az containerapp revision copy `
  --name <APPLICATION_NAME> `
  --resource-group <RESOURCE_GROUP_NAME> `
  --cpu 0.75 `
  --memory 1.5Gi
```

---

## Revision activate

Activate a revision by using the [`az containerapp revision activate`](/cli/azure/containerapp/revision#az-containerapp-revision-activate) command.

# [Bash](#tab/bash)

Example: (Replace the \<PLACEHOLDERS\> with your values.)

```azurecli
az containerapp revision activate \
  --revision <REVISION_NAME> \
  --resource-group <RESOURCE_GROUP_NAME>
```

# [PowerShell](#tab/powershell)

Example: (Replace the \<PLACEHOLDERS\> with your values.)

```powershell
$CmdArgs = @{
  ContainerAppName = '<CONTAINER_APP_NAME>'
  ResourceGroupName = '<RESOURCE_GROUP_NAME>'
  RevisionName = '<REVISION_NAME>'
}

Enable-AzContainerAppRevision @CmdArgs
```

---

## Revision deactivate

Deactivate revisions that are no longer in use with the [`az containerapp revision deactivate`](/cli/azure/containerapp/revision#az-containerapp-revision-deactivate) command. Deactivation stops all running replicas of a revision.

# [Bash](#tab/bash)

Example: (Replace the \<PLACEHOLDERS\> with your values.)

```azurecli
az containerapp revision deactivate \
  --revision <REVISION_NAME> \
  --resource-group <RESOURCE_GROUP_NAME>
```

# [PowerShell](#tab/powershell)

Example: (Replace the \<PLACEHOLDERS\> with your values.)

```powershell
$CmdArgs = @{
  ContainerAppName = '<CONTAINER_APP_NAME>'
  ResourceGroupName = '<RESOURCE_GROUP_NAME>'
  RevisionName = '<REVISION_NAME>'
}

Disable-AzContainerAppRevision @CmdArgs
```

---

## Revision restart

The [`az containerapp revision restart`](/cli/azure/containerapp/revision#az-containerapp-revision-restart) command restarts a revision.

When you modify secrets in your container app, you need to restart the active revisions so they can access the secrets.  

# [Bash](#tab/bash)

Example: (Replace the \<PLACEHOLDERS\> with your values.)

```azurecli
az containerapp revision restart \
  --revision <REVISION_NAME> \
  --resource-group <RESOURCE_GROUP_NAME>
```

# [PowerShell](#tab/powershell)

Example: (Replace the \<PLACEHOLDERS\> with your values.)

```powershell
$CmdArgs = @{
  ContainerAppName = '<CONTAINER_APP_NAME>'
  ResourceGroupName = '<RESOURCE_GROUP_NAME>'
  RevisionName = '<REVISION_NAME>'
}

Restart-AzContainerAppRevision @CmdArgs
```

---

## Revision set mode

The revision mode controls whether only a single revision or multiple revisions of your container app can be simultaneously active. To set your container app to support [single revision mode](revisions.md#revision-modes) or [multiple revision mode](revisions.md#revision-modes), use the `az containerapp revision set-mode` command.  

The default setting is *single revision mode*. For more information about this command, see [`az containerapp revision set-mode`](/cli/azure/containerapp/revision#az-containerapp-revision-set-mode).

The mode values are `single` or `multiple`. Changing the revision mode doesn't create a new revision.

Example: (Replace the \<PLACEHOLDERS\> with your values.)

# [Bash](#tab/bash)

Example: (Replace the \<PLACEHOLDERS\> with your values.)

```azurecli
az containerapp revision set-mode \
  --name <APPLICATION_NAME> \
  --resource-group <RESOURCE_GROUP_NAME> \
  --mode <REVISION_MODE>
```

# [PowerShell](#tab/powershell)

Example: (Replace the \<PLACEHOLDERS\> with your values.)

```powershell
$CmdArgs = @{
  Name = '<CONTAINER_APP_NAME>'
  ResourceGroupName = '<RESOURCE_GROUP_NAME>'
  Location = '<LOCATION>'
  ConfigurationActiveRevisionMode = '<REVISION_MODE>'
}

Update-AzContainerApp @CmdArgs
```

---

## Revision labels

Labels provide a unique URL that you can use to direct traffic to a revision. You can move a label between revisions to reroute traffic directed to the label's URL to a different revision. For more information about revision labels, see [Revision Labels](revisions.md#labels).

You can add and remove a label from a revision. For more information about the label commands, see [`az containerapp revision label`](/cli/azure/containerapp/revision/label)

### Revision label add

To add a label to a revision, use the [`az containerapp revision label add`](/cli/azure/containerapp/revision/label#az-containerapp-revision-label-add) command.  

You can only assign a label to one revision at a time, and a revision can only be assigned one label. If the revision you specify has a label, the add command replaces the existing label.

This example adds a label to a revision: (Replace the \<PLACEHOLDERS\> with your values.)

# [Bash](#tab/bash)

```azurecli
az containerapp revision label add \
  --revision <REVISION_NAME> \
  --resource-group <RESOURCE_GROUP_NAME> \
  --label <LABEL_NAME>
```

# [PowerShell](#tab/powershell)

```powershell
az containerapp revision label add `
  --revision <REVISION_NAME> `
  --resource-group <RESOURCE_GROUP_NAME> `
  --label <LABEL_NAME>
```

---

### Revision label remove

To remove a label from a revision, use the [`az containerapp revision label remove`](/cli/azure/containerapp/revision/label#az-containerapp-revision-label-remove) command.  

This example removes a label to a revision: (Replace the \<PLACEHOLDERS\> with your values.)

# [Bash](#tab/bash)

```azurecli
az containerapp revision label remove \
  --revision <REVISION_NAME> \
  --resource-group <RESOURCE_GROUP_NAME> \
  --label <LABEL_NAME>
```

# [PowerShell](#tab/powershell)

```powershell
az containerapp revision label remove `
  --revision <REVISION_NAME> `
  --resource-group <RESOURCE_GROUP_NAME> `
  --label <LABEL_NAME>
```

---

## Traffic splitting

Applied by assigning percentage values, you can decide how to balance traffic among different revisions. Traffic splitting rules are assigned by setting weights to different revisions by their name or [label](#revision-labels). For more information, see, [Traffic Splitting](traffic-splitting.md).

## Next steps

* [Revisions in Azure Container Apps](revisions.md)
* [Application lifecycle management in Azure Container Apps](application-lifecycle-management.md)
