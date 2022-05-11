---
title: Manage revisions in Azure Container Apps
description: Manage revisions and traffic splitting  in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: conceptual
ms.date: 11/02/2021
ms.author: cshoe
ms.custom: ignite-fall-2021
---

# Manage revisions Azure Container Apps

Supporting multiple revisions in Azure Container Apps allows you to manage the versioning and amount of [traffic sent to each revision](#traffic-splitting). Use the following commands to control of how your container app manages revisions.

## List

List all revisions associated with your container app with `az containerapp revision list`.

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

As you interact with this example, replace the placeholders surrounded by `<>` with your values.

## Show

Show details about a specific revision by using `az containerapp revision show`.

# [Bash](#tab/bash)

```azurecli
az containerapp revision show \
  --name <REVISION_NAME> \
  --app <CONTAINER_APP_NAME> \
  --resource-group <RESOURCE_GROUP_NAME>
```

# [PowerShell](#tab/powershell)

```azurecli
az containerapp revision show `
  --name <REVISION_NAME> `
  --app <CONTAINER_APP_NAME> `
  --resource-group <RESOURCE_GROUP_NAME>
```

---

As you interact with this example, replace the placeholders surrounded by `<>` with your values.

## Update

To update a container app, use `az containerapp update`.

# [Bash](#tab/bash)

```azurecli
az containerapp update \
  --name <APPLICATION_NAME> \
  --resource-group <RESOURCE_GROUP_NAME> \
  --image mcr.microsoft.com/azuredocs/containerapps-helloworld
```

# [PowerShell](#tab/powershell)

```azurecli
az containerapp update `
  --name <APPLICATION_NAME> `
  --resource-group <RESOURCE_GROUP_NAME> `
  --image mcr.microsoft.com/azuredocs/containerapps-helloworld
```

---

As you interact with this example, replace the placeholders surrounded by `<>` with your values.

## Activate

Activate a revision by using `az containerapp revision activate`.

# [Bash](#tab/bash)

```azurecli
az containerapp revision activate \
  --revision <REVISION_NAME> \
  --name <CONTAINER_APP_NAME> \
  --resource-group <RESOURCE_GROUP_NAME>
```

# [PowerShell](#tab/powershell)

```poweshell
az containerapp revision activate `
  --revision <REVISION_NAME> `
  --name <CONTAINER_APP_NAME> `
  --resource-group <RESOURCE_GROUP_NAME>
```

---

As you interact with this example, replace the placeholders surrounded by `<>` with your values.

## Deactivate

Deactivate revisions that are no longer in use with `az container app revision deactivate`. Deactivation stops all running replicas of a revision.

# [Bash](#tab/bash)

```azurecli
az containerapp revision deactivate \
  --revision <REVISION_NAME> \
  --name <CONTAINER_APP_NAME> \
  --resource-group <RESOURCE_GROUP_NAME>
```

# [PowerShell](#tab/powershell)

```azurecli
az containerapp revision deactivate `
  --revision <REVISION_NAME> `
  --name <CONTAINER_APP_NAME> `
  --resource-group <RESOURCE_GROUP_NAME>
```

---

As you interact with this example, replace the placeholders surrounded by `<>` with your values.

## Restart

All existing container apps revisions will not have access to this secret until they are restarted

# [Bash](#tab/bash)

```azurecli
az containerapp revision restart \
  --revision <REVISION_NAME> \
  --name <APPLICATION_NAME> \
  --resource-group <RESOURCE_GROUP_NAME>
```

# [PowerShell](#tab/powershell)

```azurecli
az containerapp revision restart `
  --revision <REVISION_NAME> `
  --name <APPLICATION_NAME> `
  --resource-group <RESOURCE_GROUP_NAME>
```

---

As you interact with this example, replace the placeholders surrounded by `<>` with your values.

## Set active revision mode

Configure whether or not your container app supports multiple active revisions.

The `activeRevisionsMode` property accepts two values:

- `multiple`: Configures the container app to allow more than one active revision.

- `single`: Automatically deactivates all other revisions when a revision is activated. Enabling `single` mode makes it so that when you create a revision-scope change and a new revision is created, any other revisions are automatically deactivated.

```json
{
  ...
  "resources": [
  {
    ...
    "properties": {
        "configuration": {
          "activeRevisionsMode": "multiple"
      }
    }
  }]
}
```

The following configuration fragment shows how to set the `activeRevisionsMode` property. Changes made to this property require the context of the container app's full ARM template.

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

The sum total of all revision weights must equal 100.

In this example, replace the `<REVISION*_NAME>` placeholders with revision names in your container app. You access revision names via the [list](#list) command.

## Next steps

> [!div class="nextstepaction"]
> [Get started](get-started.md)
