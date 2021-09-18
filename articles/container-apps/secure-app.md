---
title: Secure an app in Azure Container Apps
description: Learn to secure applications in Azure Container Apps.
services: app-service
author: craigshoemaker
ms.service: app-service
ms.topic:  how-to
ms.date: 09/16/2021
ms.author: cshoe
---

# Secure an app in Azure Container Apps

Azure Container Apps allows your application to securely store sensitive configuration values. Once defined at the application level, secured values are available to containers, inside scale rules, and via Dapr.

- Secrets are scoped to an application, outside of any specific revision of an application.
- Adding, removing, or changing secrets does not generate new revisions.
- Each application revision can reference one or more secrets.
- Multiple revisions can reference the same secret(s).

When a secret is updated or deleted, applications can respond to changes in one of two ways:

 1. Deploy a new revision.
 2. Restart an existing revision.

An updated or removed secret does not automatically re-create a revision. If a revision references a deleted secret, the provisioning status shows as "failed" and the application will not be scheduled.

## Defining secrets

# [ARM template](#tab/arm-template)

Secrets are defined at the application level in the `resources.properties.configuration.secrets` section.

```json
"resources": [
{
    ...
    "properties": {
        "configuration": {
            "secrets": [
            {
                "name": "queue-connection-string",
                "value": "<MY-CONNECTION-STRING-VALUE>"
            }],
        }
    }
}
```

In this example, a connection string to a queue storage account is declared in the `secrets` array. In this instance, you would replace `<MY-CONNECTION-STRING-VALUE>` with the value of your connection string.

# [Azure CLI](#tab/azure-cli)

Secrets are defined using the `--secrets` parameter.

The `--secrets` parameter accepts a comma-delimited set of name/value pairs. Each pair is delimited by an equals sign (`=`).

```bash
az containerapp create \
  --resource-group "my-resource-group" \
  --name queuereader \
  --environment "my-environment-name" \
  --image demos/queuereader:v1 \
  --secrets "queue-connection-string=$CONNECTION_STRING" \
  ...
```

In this example, a connection string to a queue storage account is declared in the `--secrets` parameter. In this instance, `queue-connection-string` references an environment variable named `$CONNECTION_STRING`.

---

## Using secrets

Application secrets are referenced via the `secretref` property. Secret values are mapped to application-level secrets where the `secretref` value matches the secret name declared at the application level.

## Example

The following example shows an application that stores an Azure Queue connection string as a secret and references it in a container's environment variable.

# [ARM template](#tab/arm-template)

```json
"resources": [
{
    "name": "myapp",
    "type": "Microsoft.Web/containerApps",
    "apiVersion": "2021-02-01",
    "kind": "containerapp",
    "location": "eastus",
    "properties": {
        "configuration": {
            "secrets": [
            {
                "name": "queue-connection-string",
                "value": "<MY-CONNECTION-STRING-VALUE>"
            }],
        }
    }
}
```

In this example, the application connection string is declared as `queue-connection-string` and becomes available elsewhere in the configuration sections.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-08-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "location": {
            "defaultValue": "North Central US (Stage)",
            "type": "String"
        },
        "environment_id": {
            "defaultValue": "",
            "type": "String"
        },
        "queue-connection-string": {
            "defaultValue": "",
            "type": "String"
        }
    },
    "variables": {},
    "resources": [
    {
        "name": "queuereader",
        "type": "Microsoft.Web/containerApps",
        "apiVersion": "2021-02-01",
        "kind": "containerapp",
        "location": "[parameters('location')]",
        "properties": {
            "kubeEnvironmentId": "[parameters('environment_id')]",
            "configuration": {
                "activeRevisionsMode": "single",
                "secrets": [
                {
                    "name": "queue-connection-string",
                    "value": "[parameters('queue-connection-string')]"
                }]
            },
            "template": {
                "containers": [
                    {
                        "image": "demos/queuereader:v1",
                        "name": "queuereader",
                        "env": [
                            {
                                "name": "QueueName",
                                "value": "demoqueue"
                            },
                            {
                                "secretref": "queue-connection-string",
                                "name": "connection-string"
                            }
                        ]
                    }
                ],
                "scale": {
                    "minReplicas": 0,
                    "maxReplicas": 10,
                    "rules": [
                        {
                            "name": "myqueuerule",
                            "azureQueue": {
                                "queueName": "demoqueue",
                                "queueLength": 100,
                                "auth": [
                                    {
                                        "secretRef": "queue-connection-string",
                                        "triggerParameter": "connection"
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        }
    }]
}
```

Here, the environment variable named `connection-string` gets its value from the application-level `queue-connection-string` secret. Also, the Azure Queue Storage scale rule's authorization configuration uses the `queue-connection-string` as a connection is established.

# [Azure CLI](#tab/azure-cli)

In this example, you create an application with a secret that's referenced in an environment variable using the Azure CLI.

```bash
az containerapp create \
  --resource-group "my-resource-group" \
  --name queuereader \
  --environment "my-environment-name" \
  --image demos/queuereader:v1 \
  --secrets "queue-connection-string=$CONNECTIONSTRING" \
  --environment-variables "QueueName=demoqueue,connection-string=secretref:queue-connection-string"
```

Here, the environment variable named `connection-string` gets its value from the application-level `queue-connection-string` secret by using `secretref`.

---

## Next steps

> [!div class="nextstepaction"]
> [Containers](containers.md)
