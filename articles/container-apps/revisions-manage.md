---
title: Manage revisions in Azure Container Apps
description: Manage revisions and traffic splitting in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: conceptual
ms.date: 06/07/2022
ms.author: cshoe
---

# Manage revisions in Azure Container Apps

Supporting multiple revisions in Azure Container Apps allows you to manage the versioning of your container app.  With this feature, you can activate and deactivate revisions, and control the amount of [traffic sent to each revision](#traffic-splitting).  To learn more about revisions, see [Revisions in Azure Container Apps](revisions.md)

A revision is created when you first deploy your application.  New revisions are created when you [update](#updating-your-container-app) your application with [revision-scope changes](revisions.md#revision-scope-changes).  You can also update your container app based on a specific revision.  


This article described the commands to manage your container app's revisions. For more information about Container Apps commands, see [`az containerapp`](/cli/azure/containerapp).  For more information about commands to manage revisions, see [`az containerapp revision`](/cli/azure/containerapp/revision).


## Updating your container app

To update a container app, use the `az containerapp update` command.   With this command you can modify environment variables, compute resources, scale parameters, and deploy a different image.  If your container app update includes [revision-scope changes](revisions.md#revision-scope-changes), a new revision will be generated.

You may also use a YAML file to define these and other configuration options and parameters.  For more information regarding this command, see [`az containerapp revision copy`](/cli/azure/containerapp#az-containerapp-update).  

This example updates the container image.  (Replace the \<placeholders\> with your values.)

# [Bash](#tab/bash)

```azurecli
az containerapp update \
  --name <APPLICATION_NAME> \
  --resource-group <RESOURCE_GROUP_NAME> \
  --image <IMAGE_NAME>
```

# [PowerShell](#tab/powershell)

```azurecli
az containerapp update `
  --name <APPLICATION_NAME> `
  --resource-group <RESOURCE_GROUP_NAME> `
  --image <IMAGE_NAME>
```

---

You can also update your container app with the [Revision copy](#revision-copy) command.

## Revision list

List all revisions associated with your container app with `az containerapp revision list`. For more information about this command, see [`az containerapp revision list`](/cli/azure/containerapp/revision#az-containerapp-revision-list)

# [Bash](#tab/bash)

```azurecli
az containerapp revision list \
  --name <APPLICATION_NAME> \
  --resource-group <RESOURCE_GROUP_NAME> \
  -o table
```

# [PowerShell](#tab/powershell)

```azurecli
az containerapp revision list `
  --name <APPLICATION_NAME> `
  --resource-group <RESOURCE_GROUP_NAME> `
  -o table
```

---

## Revision show

Show details about a specific revision by using `az containerapp revision show`.  For more information about this command, see [`az containerapp revision show`](/cli/azure/containerapp/revision#az-containerapp-revision-show).

Example: (Replace the \<placeholders\> with your values.)

# [Bash](#tab/bash)

```azurecli
az containerapp revision show \
  --name <APPLICATION_NAME> \
  --revision <REVISION_NAME> \
  --resource-group <RESOURCE_GROUP_NAME>
```

# [PowerShell](#tab/powershell)

```azurecli
az containerapp revision show `
  --name <APPLICATION_NAME> `
  --revision <REVISION_NAME> `
  --resource-group <RESOURCE_GROUP_NAME>
```

---

## Revision copy

To create a new revision based on an existing revision, use the `az containerapp revision copy`. Container Apps will use the configuration of the existing revision, which you then may modify.  

With this command, you can modify environment variables, compute resources, scale parameters, and deploy a different image.  You may also use a YAML file to define these and other configuration options and parameters.  For more information regarding this command, see [`az containerapp revision copy`](/cli/azure/containerapp/revision#az-containerapp-revision-copy).

This example copies the latest revision and sets the compute resource parameters.  (Replace the \<placeholders\> with your values.)

# [Bash](#tab/bash)

```azurecli
az containerapp revision copy \
  --name <APPLICATION_NAME> \
  --resource-group <RESOURCE_GROUP_NAME> \
  --cpu 0.75 \
  --memory 1.5Gi
```

# [PowerShell](#tab/powershell)

```azurecli
az containerapp revision copy `
  --name <APPLICATION_NAME> `
  --resource-group <RESOURCE_GROUP_NAME> `
  --cpu 0.75 `
  --memory 1.5Gi
```

---

## Revision activate

Activate a revision by using `az containerapp revision activate`.  For more information about this command, see [`az containerapp revision activate`](/cli/azure/containerapp/revision#az-containerapp-revision-activate).

Example: (Replace the \<placeholders\> with your values.)

# [Bash](#tab/bash)

```azurecli
az containerapp revision activate \
  --revision <REVISION_NAME> \
  --resource-group <RESOURCE_GROUP_NAME>
```

# [PowerShell](#tab/powershell)

```azurecli
az containerapp revision activate `
  --revision <REVISION_NAME> `
  --resource-group <RESOURCE_GROUP_NAME>
```

---

## Revision deactivate

Deactivate revisions that are no longer in use with `az containerapp revision deactivate`. Deactivation stops all running replicas of a revision.  For more information, see [`az containerapp revision deactivate`](/cli/azure/containerapp/revision#az-containerapp-revision-deactivate).

Example: (Replace the \<placeholders\> with your values.)

# [Bash](#tab/bash)

```azurecli
az containerapp revision deactivate \
  --revision <REVISION_NAME> \
  --resource-group <RESOURCE_GROUP_NAME>
```

# [PowerShell](#tab/powershell)

```azurecli
az containerapp revision deactivate `
  --revision <REVISION_NAME> `
  --resource-group <RESOURCE_GROUP_NAME>
```

---

## Revision restart

This command restarts a revision.  For more information about this command, see [`az containerapp revision restart`](/cli/azure/containerapp/revision#az-containerapp-revision-restart).

When you modify secrets in your container app, you'll need to restart the active revisions so they can access the secrets.  

Example: (Replace the \<placeholders\> with your values.)

# [Bash](#tab/bash)

```azurecli
az containerapp revision restart \
  --revision <REVISION_NAME> \
  --resource-group <RESOURCE_GROUP_NAME>
```

# [PowerShell](#tab/powershell)

```azurecli
az containerapp revision restart `
  --revision <REVISION_NAME> `
  --resource-group <RESOURCE_GROUP_NAME>
```

---

## Revision set mode

The revision mode controls whether only a single revision or multiple revisions of your container app can be simultaneously active. To set your container app to support [single revision mode](revisions.md#single-revision-mode) or [multiple revision mode](revisions.md#multiple-revision-mode), use the `az containerapp revision set-mode` command.  

The default setting is *single revision mode*. For more information about this command, see [`az containerapp revision set-mode`](/cli/azure/containerapp/revision#az-containerapp-revision-set-mode).

The mode values are `single` or `multiple`.  Changing the revision mode doesn't create a new revision.

Example: (Replace the \<placeholders\> with your values.)

# [Bash](#tab/bash)

```azurecli
az containerapp revision set-mode \
  --name <APPLICATION_NAME> \
  --resource-group <RESOURCE_GROUP_NAME> \
  --mode single
```

# [PowerShell](#tab/powershell)

```azurecli
az containerapp revision set-mode `
  --name <APPLICATION_NAME> `
  --resource-group <RESOURCE_GROUP_NAME> `
  --mode single
```

---

## Revision labels

Labels provide a unique URL that you can use to direct traffic to a revision.  You can move a label between revisions to reroute traffic directed to the label's URL to a different revision.  For more information about revision labels, see [Revision Labels](revisions.md#revision-labels).

You can add and remove a label from a revision.  For more information about the label commands, see [`az containerapp revision label`](/cli/azure/containerapp/revision/label)

### Revision label add

To add a label to a revision, use the [`az containerapp revision label add`](/cli/azure/containerapp/revision/label#az-containerapp-revision-label-add) command.  

You can only assign a label to one revision at a time, and a revision can only be assigned one label.  If the revision you specify has a label, the add command will replace the existing label.

This example adds a label to a revision: (Replace the \<placeholders\> with your values.)

# [Bash](#tab/bash)

```azurecli
az containerapp revision label add \
  --revision <REVISION_NAME> \
  --resource-group <RESOURCE_GROUP_NAME> \
  --label <LABEL_NAME>
```

# [PowerShell](#tab/powershell)

```azurecli
az containerapp revision set-mode `
  --revision <REVISION_NAME> `
  --resource-group <RESOURCE_GROUP_NAME> `
  --mode <LABEL_NAME>
```

---

### Revision label remove

To remove a label from a revision, use the [`az containerapp revision label remove`](/cli/azure/containerapp/revision/label#az-containerapp-revision-label-remove) command.  

This example removes a label to a revision: (Replace the \<placeholders\> with your values.)

# [Bash](#tab/bash)

```azurecli
az containerapp revision label add \
  --revision <REVISION_NAME> \
  --resource-group <RESOURCE_GROUP_NAME> \
  --label <LABEL_NAME>
```

# [PowerShell](#tab/powershell)

```azurecli
az containerapp revision set-mode `
  --revision <REVISION_NAME> `
  --resource-group <RESOURCE_GROUP_NAME> `
  --mode <LABEL_NAME>
```

---

## Traffic splitting

Applied by assigning percentage values, you can decide how to balance traffic among different revisions. Traffic splitting rules are assigned by setting weights to different revisions.

The following example shows how to split traffic between three revisions. 

```json
{
  ...
  "configuration": {
    "ingress": {
      "traffic": [
        {
          "revisionName": <REVISION1_NAME>,
          "weight": 50
        },
        {
          "revisionName": <REVISION2_NAME>,
          "weight": 30
        },
        {
          "latestRevision": true,
          "weight": 20
        }
      ]
    }
  }
}
```

Each revision gets traffic based on the following rules:

- 50% of the requests go to REVISION1
- 30% of the requests go to REVISION2
- 20% of the requests go to the latest revision

The sum of all revision weights must equal 100.

In this example, replace the `<REVISION*_NAME>` placeholders with revision names in your container app. You access revision names via the [revision list](#revision-list) command.

## Next steps

* [Revisions in Azure Container Apps](revisions.md)
* [Application lifecycle management in Azure Container Apps](application-lifecycle-management.md)
