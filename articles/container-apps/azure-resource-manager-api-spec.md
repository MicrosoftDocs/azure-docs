---
title: Container Apps ARM template API specification
description: Explore the available properties in the Container Apps ARM template.
services: app-service
author: craigshoemaker
ms.service: app-service
ms.topic:  reference
ms.date: 10/21/2021
ms.author: cshoe
---

# Container Apps ARM template API specification

Azure Container Apps deployments are powered by an Azure Resource Manager (ARM) template. The following tables describe the properties available in the container app ARM template.

## Root

| Property | Description | Data type |
|---|---|--|
| `id` | The unique identifier of the container app. See the explanation below for more details. **This is a required property.** | string |
| `name` | The Container Apps application name. This name is used at the end of the `id` property in the ARM template file. | string |
| `location` | The Azure region where the Container Apps instance is deployed. | string |
| `tags` | Collection of Azure tags associated with the container app. | array |
| `kind` | Always `containerapps` ARM endpoint determines which API to forward to  | string |

The `id` value takes the following form:

```console
/subscriptions/<SUBSCRIPTION_ID>/resourcegroups/<RESOURCE_GROUP_NAME>/providers/Microsoft.Web/containerapps/<CONTAINER_APP_NAME>
```

In this example, you put your values in place of the placeholder tokens surrounded by `<>` brackets.

## properties

| Property | Description | Data type | Read only |
|---|---|---|---|
| `provisioningState` | The state of a long running operation, for example when new container revision is created. Possible values include: provisioning, provisioned, failed. Check if app is up and running. | string | Yes |
| `kubeEnvironmentId` | The environment ID for your container app. **This is a required property.** | string | No |
| `latestRevisionName` | The name of the latest revision. | string | Yes |
| `latestRevisionFqdn` | The latest revision's URL. | string | Yes |

The `kubeEnvironmentId` value takes the following form:

```console
/subscriptions/<SUBSCRIPTION_ID>/resourcegroups/<RESOURCE_GROUP_NAME>/providers/Microsoft.Web/kubeEnvironments/<ENVIRONMENT_NAME>
```

In this example, you put your values in place of the placeholder tokens surrounded by `<>` brackets.

## properties.configuration

| Property | Description | Data type |
|---|---|---|
| `activeRevisionsMode` | Setting to `multiple` allows you to maintain multiple revisions. Setting to `single` automatically deactivates old revisions, and only keeps the latest revision active. | string |
| `secrets` | Defines secret values in your container app. | object |
| `ingress` | Object that defines public accessibility configuration of a container app. | object |
| `registries` | Configuration object that references credentials for private container registries. Entries defined with `secretref` reference the secrets configuration object. | object |

## properties.template

| Property | Description | Data type |
|---|---|---|
| `revisionSuffix` | A friendly name for a revision. This value must be unique as the runtime rejects any conflicts with existing revision name suffix values. | string |
| `containers` | Configuration object that defines what container images are included in the container app. | object |
| `scale` | Configuration object that defines scale rules for the container app. | object |
| `dapr` | Configuration object that defines the Dapr settings for the container app. | object  |

## Example template

**\*\*TODO\*\*** example coming from Mike Vu.
