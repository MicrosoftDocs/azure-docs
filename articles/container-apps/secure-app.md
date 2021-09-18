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

Azure Container Apps allows your application to securely store sensitive configuration values. Once defined, secured values are available to the application, containers, inside scale rules, and via Dapr.

- Secrets are scoped to an application, outside of any specific revision of an application.
- Adding, removing, or changing secrets does not generate a new revision.
- Each application revision can reference one or more secrets.
- Multiple revisions can reference the same secret(s).

When a secret is updated or deleted, applications can respond to changes in one of two ways:

 1. Deploy a new revision.
 2. Restart an existing revision.

An updated or removed secret does not automatically re-create a revision. If a revision references a deleted secret, the provisioning status shows as "failed" and the application will not be scheduled.

## Configuration

# [ARM template](#tab/arm-template)

Secrets are declared at the application level in the `resources.properties.configuration.secrets` section of a container app's ARM template.

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
                "name": "MY-SECRET-VARIABLE-NAME",
                "value": "MY-SECRET-VARIABLE-VALUE"
            }],
        }
    }
}
```

In this example, a few secrets are declared in the `secrets` array and are available throughout the application.

# [Azure CLI](#tab/azure-cli)

\* todo

---

## Using secrets

Application secrets are referenced via the `secretref` property in the configuration. Secret values are mapped to application-level secrets where the `secretref` value matches the `name` value declared in the application's `secrets` array.

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
                "name": "queueconnection",
                "value": "MY-CONNECTION-STRING-VALUE"
            }],
        }
    }
}
```

\* replace placeholder

In this example, you create an application with a secret that's referenced in an environment variable using an ARM template and in an Azure Queue scale rule.

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
        "queueconnection": {
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
                    "name": "queueconnection",
                    "value": "[parameters('queueconnection')]"
                }]
            },
            "template": {
                "containers": [
                    {
                        "image": "demos/dotnet-queuereader:v1",
                        "name": "queuereader",
                        "env": [
                            {
                                "name": "QueueName",
                                "value": "demoqueue"
                            },
                            {
                                "name": "QueueConnectionString",
                                "secretref": "queueconnection"
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
                                        "secretRef": "queueconnection",
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

# [Azure CLI](#tab/azure-cli)

In this example, you create an application with a secret that's referenced in an environment variable using the Azure CLI.  

```bash
az workerapp create \
  --resource-group "my-resource-group" \
  --name queuereader \
  --environment "my-environment-name" \
  --image vturecek/dotnet-queuereader:v1 \
  --secrets "storageconnectionstring=$CONNECTIONSTRING" \
  --environment-variables "QueueName=demoqueue,QueueConnectionString=secretref:storageconnectionstring"
```

---

## Next steps

> [!div class="nextstepaction"]
> [Containers](containers.md)
