---
title: Container Apps ARM template API specification
description: Explore the available properties in the Container Apps ARM template.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: reference
ms.date: 07/26/2023
ms.author: cshoe
ms.custom: ignite-fall-2021, event-tier1-build-2022, devx-track-arm-template, build-2023
---

# Container Apps ARM template API specification

Azure Container Apps deployments are powered by an Azure Resource Manager (ARM) template. Some Container Apps CLI commands also support using a YAML template to specify a resource.

## API versions

The latest management API versions for Azure Container Apps are:

- [`2023-05-01`](/rest/api/containerapps/stable/container-apps) (stable)
- [`2023-04-01-preview`](/rest/api/containerapps/preview/container-apps) (preview)

To learn more about the differences between API versions, see [Microsoft.App change log](/azure/templates/microsoft.app/change-log/summary).

### Updating API versions

To use a specific API version in ARM or Bicep, update the version referenced in your templates. To use the latest API version in the Azure CLI, update the Azure Container Apps extension by running the following command:

```bash
az extension add -n containerapp --upgrade
```

To programmatically manage Azure Container Apps with the latest API version, use the latest versions of the management SDK:

- [.NET](/dotnet/api/azure.resourcemanager.appcontainers)
- [Go](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/appcontainers/armappcontainers)
- [Java](/java/api/overview/azure/resourcemanager-appcontainers-readme)
- [Node.js](/javascript/api/overview/azure/arm-appcontainers-readme)
- [Python](/python/api/azure-mgmt-appcontainers/azure.mgmt.appcontainers)

## Container Apps environment

The following tables describe the properties available in the Container Apps environment resource.

### Resource

A container app resource of the ARM template has the following properties:

| Property | Description | Data type |
|---|---|--|
| `name` | The Container Apps environment name. | string |
| `location` | The Azure region where the Container Apps environment is deployed. | string |
| `type` | `Microsoft.App/managedEnvironments` – the ARM resource type | string |

#### `properties`

A resource's `properties` object has the following properties:

| Property | Description | Data type | Read only |
|---|---|---|---|
| `daprAIInstrumentationKey` | The Application Insights instrumentation key used by Dapr. | string | No |
| `appLogsConfiguration` | The environment's logging configuration. | Object | No |
| `peerAuthentication` | How to enable mTLS encryption. | Object | No |

### <a name="container-apps-environment-examples"></a>Examples

The following example ARM template deploys a Container Apps environment.

> [!NOTE]
> The commands to create container app environments don't support YAML configuration input.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "location": {
      "defaultValue": "canadacentral",
      "type": "String"
    },
    "dapr_ai_instrumentation_key": {
      "defaultValue": "",
      "type": "String"
    },
    "environment_name": {
      "defaultValue": "myenvironment",
      "type": "String"
    },
    "log_analytics_customer_id": {
      "type": "String"
    },
    "log_analytics_shared_key": {
      "type": "SecureString"
    },
    "storage_account_name": {
      "type": "String"
    },
    "storage_account_key": {
      "type": "SecureString"
    },
    "storage_share_name": {
      "type": "String"
    }
  },
  "variables": {},
  "resources": [
    {
      "type": "Microsoft.App/managedEnvironments",
      "apiVersion": "2022-03-01",
      "name": "[parameters('environment_name')]",
      "location": "[parameters('location')]",
      "properties": {
        "daprAIInstrumentationKey": "[parameters('dapr_ai_instrumentation_key')]",
        "appLogsConfiguration": {
          "destination": "log-analytics",
          "logAnalyticsConfiguration": {
            "customerId": "[parameters('log_analytics_customer_id')]",
            "sharedKey": "[parameters('log_analytics_shared_key')]"
          }
        }
      },
      "resources": [
        {
          "type": "storages",
          "name": "myazurefiles",
          "apiVersion": "2022-03-01",
          "dependsOn": [
            "[resourceId('Microsoft.App/managedEnvironments', parameters('environment_name'))]"
          ],
          "properties": {
            "azureFile": {
              "accountName": "[parameters('storage_account_name')]",
              "accountKey": "[parameters('storage_account_key')]",
              "shareName": "[parameters('storage_share_name')]",
              "accessMode": "ReadWrite"
            }
          }
        }
      ]
    }
  ]
}
```

## Container app

The following tables describe the properties available in the container app resource.

### Resource 

A container app resource of the ARM template has the following properties:

| Property | Description | Data type |
|---|---|--|
| `name` | The Container Apps application name. | string |
| `location` | The Azure region where the Container Apps instance is deployed. | string |
| `tags` | Collection of Azure tags associated with the container app. | array |
| `type` | `Microsoft.App/containerApps` – the ARM resource type  | string |

In this example, you put your values in place of the placeholder tokens surrounded by `<>` brackets.

#### `properties`

A resource's `properties` object has the following properties:

| Property | Description | Data type | Read only |
|---|---|---|---|
| `provisioningState` | The state of a long running operation, for example when new container revision is created. Possible values include: provisioning, provisioned, failed. Check if app is up and running. | string | Yes |
| `environmentId` | The environment ID for your container app. **This is a required property.** | string | No |
| `latestRevisionName` | The name of the latest revision. | string | Yes |
| `latestRevisionFqdn` | The latest revision's URL. | string | Yes |

The `environmentId` value takes the following form:

```console
/subscriptions/<SUBSCRIPTION_ID>/resourcegroups/<RESOURCE_GROUP_NAME>/providers/Microsoft.App/environmentId/<ENVIRONMENT_NAME>
```

In this example, you put your values in place of the placeholder tokens surrounded by `<>` brackets.

#### `properties.configuration`

A resource's `properties.configuration` object has the following properties:

| Property | Description | Data type |
|---|---|---|
| `activeRevisionsMode` | Setting to `single` automatically deactivates old revisions, and only keeps the latest revision active. Setting to `multiple` allows you to maintain multiple revisions. | string |
| `secrets` | Defines secret values in your container app. | object |
| `ingress` | Object that defines public accessibility configuration of a container app. | object |
| `registries` | Configuration object that references credentials for private container registries. Entries defined with `secretref` reference the secrets configuration object. | object |
| `dapr` | Configuration object that defines the Dapr settings for the container app. | object  |

Changes made to the `configuration` section are [application-scope changes](revisions.md#application-scope-changes), which doesn't trigger a new revision.

#### `properties.template`

A resource's `properties.template` object has the following properties:

| Property | Description | Data type |
|---|---|---|
| `revisionSuffix` | A friendly name for a revision. This value must be unique as the runtime rejects any conflicts with existing revision name suffix values. | string |
| `containers` | Configuration object that defines what container images are included in the container app. | object |
| `scale` | Configuration object that defines scale rules for the container app. | object |

Changes made to the `template` section are [revision-scope changes](revisions.md#revision-scope-changes), which triggers a new revision.

### <a name="container-app-examples"></a>Examples

For details on health probes, refer to [Health probes in Azure Container Apps](./health-probes.md).

# [ARM template](#tab/arm-template)

The following example ARM template deploys a container app.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "containerappName": {
      "defaultValue": "mycontainerapp",
      "type": "String"
    },
    "location": {
      "defaultValue": "canadacentral",
      "type": "String"
    },
    "environment_name": {
      "defaultValue": "myenvironment",
      "type": "String"
    },
    "container_image": {
      "type": "String"
    },
    "registry_password": {
      "type": "SecureString"
    }
  },
  "variables": {},
  "resources": [
    {
      "apiVersion": "2022-11-01-preview",
      "type": "Microsoft.App/containerApps",
      "name": "[parameters('containerappName')]",
      "location": "[parameters('location')]",
      "identity": {
        "type": "None"
      },
      "properties": {
        "managedEnvironmentId": "[resourceId('Microsoft.App/managedEnvironments', parameters('environment_name'))]",
        "configuration": {
          "secrets": [
            {
              "name": "mysecret",
              "value": "thisismysecret"
            },
            {
              "name": "myregistrypassword",
              "value": "[parameters('registry_password')]"
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
          },
          "registries": [
            {
              "server": "myregistry.azurecr.io",
              "username": "[parameters('containerappName')]",
              "passwordSecretRef": "myregistrypassword"
            }
          ],
          "dapr": {
            "appId": "[parameters('containerappName')]",
            "appPort": 80,
            "appProtocol": "http",
            "enabled": true
          }
        },
        "template": {
          "revisionSuffix": "myrevision",
          "containers": [
            {
              "name": "main",
              "image": "[parameters('container_image')]",
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
              "command": [
                "npm",
                "start"
              ],
              "resources": {
                "cpu": 0.5,
                "memory": "1Gi"
              },
              "probes": [
                {
                  "type": "liveness",
                  "httpGet": {
                    "path": "/health",
                    "port": 8080,
                    "httpHeaders": [
                      {
                        "name": "Custom-Header",
                        "value": "liveness probe"
                      }
                    ]
                  },
                  "initialDelaySeconds": 7,
                  "periodSeconds": 3
                },
                {
                  "type": "readiness",
                  "tcpSocket": {
                    "port": 8081
                  },
                  "initialDelaySeconds": 10,
                  "periodSeconds": 3
                },
                {
                  "type": "startup",
                  "httpGet": {
                    "path": "/startup",
                    "port": 8080,
                    "httpHeaders": [
                      {
                        "name": "Custom-Header",
                        "value": "startup probe"
                      }
                    ]
                  },
                  "initialDelaySeconds": 3,
                  "periodSeconds": 3
                }
              ],
              "volumeMounts": [
                {
                  "mountPath": "/myempty",
                  "volumeName": "myempty"
                },
                {
                  "mountPath": "/myfiles",
                  "volumeName": "azure-files-volume"
                },
                {
                  "mountPath": "/mysecrets",
                  "volumeName": "mysecrets"
                }
              ]
            }
          ],
          "scale": {
            "minReplicas": 1,
            "maxReplicas": 3
          },
          "volumes": [
            {
              "name": "myempty",
              "storageType": "EmptyDir"
            },
            {
              "name": "azure-files-volume",
              "storageType": "AzureFile",
              "storageName": "myazurefiles"
            },
            {
              "name": "mysecrets",
              "storageType": "Secret",
              "secrets": [
                {
                  "secretRef": "mysecret",
                  "path": "mysecret.txt"
                }
              ]
            }
          ]
        }
      }
    }
  ]
}
```

# [YAML](#tab/yaml)

The following example YAML configuration deploys a container app when used with the `--yaml` parameter in the following Azure CLI commands:

- [`az containerapp create`](/cli/azure/containerapp?view=azure-cli-latest&preserve-view=true#az-containerapp-create)
- [`az containerapp update`](/cli/azure/containerapp?view=azure-cli-latest&preserve-view=true#az-containerapp-update)
- [`az containerapp revision copy`](/cli/azure/containerapp?view=azure-cli-latest&preserve-view=true#az-containerapp-revision-copy)

```yaml
location: canadacentral
name: mycontainerapp
resourceGroup: myresourcegroup
type: Microsoft.App/containerApps
tags:
  tagname: value
properties:
  managedEnvironmentId: /subscriptions/mysubscription/resourceGroups/myresourcegroup/providers/Microsoft.App/managedEnvironments/myenvironment
  configuration:
    activeRevisionsMode: Multiple
    secrets:
      - name: mysecret
        value: thisismysecret
      - name: myregistrypassword
        value: I<3containerapps
    ingress:
      external: true
      allowInsecure: false
      targetPort: 80
      traffic:
        - latestRevision: true
          weight: 100
      transport: Auto
    registries:
      - passwordSecretRef: myregistrypassword
        server: myregistry.azurecr.io
        username: myregistry
    dapr:
      appId: mycontainerapp
      appPort: 80
      appProtocol: http
      enabled: true
  template:
    revisionSuffix: myrevision
    containers:
      - image: nginx
        name: nginx
        env:
          - name: HTTP_PORT
            value: 80
          - name: secret_name
            secretRef: mysecret
        command:
          - npm
          - start
        resources:
          cpu: 0.5
          memory: 1Gi
        probes:
          - type: liveness
            httpGet:
              path: "/health"
              port: 8080
              httpHeaders:
                - name: "Custom-Header"
                  value: "liveness probe"
            initialDelaySeconds: 7
            periodSeconds: 3
          - type: readiness
            tcpSocket:
              port: 8081
            initialDelaySeconds: 10
            periodSeconds: 3
          - type: startup
            httpGet:
              path: "/startup"
              port: 8080
              httpHeaders:
                - name: "Custom-Header"
                  value: "startup probe"
            initialDelaySeconds: 3
            periodSeconds: 3
        volumeMounts:
          - mountPath: /myempty
            volumeName: myempty
          - mountPath: /myfiles
            volumeName: azure-files-volume
          - mountPath: /mysecrets
            volumeName: mysecrets
    scale:
      minReplicas: 1
      maxReplicas: 3
    volumes:
      - name: myempty
        storageType: EmptyDir
      - name: azure-files-volume
        storageType: AzureFile
        storageName: myazurefiles
      - name: mysecrets
        storageType: Secret
        secrets:
          - secretRef: mysecret
            path: mysecret.txt
```

---
