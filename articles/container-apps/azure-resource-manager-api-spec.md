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

The the [sample ARM template for usage examples](#example).

## Resources

Entries in the `resources` array of the ARM template have the following properties:

| Property | Description | Data type |
|---|---|--|
| `name` | The Container Apps application name. | string |
| `location` | The Azure region where the Container Apps instance is deployed. | string |
| `tags` | Collection of Azure tags associated with the container app. | array |
| `type` | Always `Microsoft.Web/containerApps` ARM endpoint determines which API to forward to  | string |

In this example, you put your values in place of the placeholder tokens surrounded by `<>` brackets.

## properties

A resource's `properties` object has the following properties:

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

Changes made to the configuration are an application-scope change. Does not create new revisions.

A resource's `properties.configuration` object has the following properties:

| Property | Description | Data type |
|---|---|---|
| `activeRevisionsMode` | Setting to `multiple` allows you to maintain multiple revisions. Setting to `single` automatically deactivates old revisions, and only keeps the latest revision active. | string |
| `secrets` | Defines secret values in your container app. | object |
| `ingress` | Object that defines public accessibility configuration of a container app. | object |
| `registries` | Configuration object that references credentials for private container registries. Entries defined with `secretref` reference the secrets configuration object. | object |

## properties.template

Changes made to the configuration are an revision-scope change. Does create new revisions.

A resource's `properties.template` object has the following properties:

| Property | Description | Data type |
|---|---|---|
| `revisionSuffix` | A friendly name for a revision. This value must be unique as the runtime rejects any conflicts with existing revision name suffix values. | string |
| `containers` | Configuration object that defines what container images are included in the container app. | object |
| `scale` | Configuration object that defines scale rules for the container app. | object |
| `dapr` | Configuration object that defines the Dapr settings for the container app. | object  |

## Example

The following is an example ARM template used to deploy a container app.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-08-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "containerappName": {
            "defaultValue": "mycontainerapp",
            "type": "String"
        },
        "location": {
            "defaultValue": "East US 2",
            "type": "String"
        },
        "environment_name": {
            "defaultValue": "myenvironment",
            "type": "String"
        }
    },
    "variables": {},
    "resources": [
        {
            "apiVersion": "2021-03-01",
            "type": "Microsoft.Web/containerApps",
            "name": "[parameters('containerappName')]",
            "location": "[parameters('location')]",
            "properties": {
                "kubeEnvironmentId": "[resourceId('Microsoft.Web/kubeEnvironments', parameters('kubeEnvironmentName'))]",
                "configuration": {
                    "secrets": [
                        {
                            "name": "mysecret",
                            "value": "thisismysecret"
                        }
                    ],
                    "ingress": {
                        "external": true,
                        "targetPort": 80,
                        "allowInsecure": false,
                        "traffic": [
                            {
                                "latestRevision": true,
                                "weight": 100
                            }
                        ]
                    }
                },
                "template": {
                    "revisionSuffix": "myrevision",
                    "containers": [
                        {
                            "name": "nginx",
                            "image": "nginx",
                            "env": [
                                {
                                    "name": "HTTP_PORT",
                                    "value": "80"
                                },
                                {
                                    "name": "SECRET_VAL",
                                    "secretRef": "mysecret"
                                }
                            ],
                            "resources": [
                                {
                                    "cpu": 1,
                                    "memory": "500Mb"
                                }
                            ]
                        }
                    ],
                    "scale": {
                        "minReplicas": 1,
                        "maxReplicas": 3
                    }
                }
            }
        }
    ]
}
```
