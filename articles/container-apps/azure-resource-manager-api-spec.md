---
title: Azure Container Apps ARM and YAML template specifications
description: Explore the available properties in the Azure Container Apps ARM and YAML templates.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: reference
ms.date: 10/24/2023
ms.author: cshoe
ms.custom: build-2023
---

# Azure Container Apps ARM and YAML template specifications

Azure Container Apps deployments are powered by an Azure Resource Manager (ARM) template. Some Container Apps CLI commands also support using a YAML template to specify a resource.

This article describes the ARM and YAML configurations for frequently used Container Apps resources. For a complete list of Container Apps resources see [Azure Resource Manager templates for Container Apps](/azure/templates/microsoft.app/containerapps?pivots=deployment-language-arm-template).

## API versions

The latest management API versions for Azure Container Apps are:

- [`2023-05-01`](/rest/api/containerapps/stable/container-apps?view=rest-containerapps-2023-05-01&preserve-view=true) (stable)
- [`2023-08-01-preview`](/rest/api/containerapps/container-apps?view=rest-containerapps-2023-08-01-preview&preserve-view=true) (preview)

To learn more about the differences between API versions, see [Microsoft.App change log](/azure/templates/microsoft.app/change-log/summary).

### Updating API versions

To use a specific API version in ARM or Bicep, update the version referenced in your templates. To use the latest API version in Azure CLI or Azure PowerShell, update them to the latest version.

Update Azure CLI and the Azure Container Apps extension by running the following commands:

```bash
az upgrade
az extension add -n containerapp --upgrade
```

To update Azure PowerShell, see [How to install Azure PowerShell](/powershell/azure/install-azure-powershell).

To programmatically manage Azure Container Apps with the latest API version, use the latest versions of the management SDK:

- [.NET](/dotnet/api/azure.resourcemanager.appcontainers)
- [Go](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/appcontainers/armappcontainers)
- [Java](/java/api/overview/azure/resourcemanager-appcontainers-readme)
- [Node.js](/javascript/api/overview/azure/arm-appcontainers-readme)
- [Python](/python/api/azure-mgmt-appcontainers/azure.mgmt.appcontainers)

## Container Apps environment

The following tables describe commonly used properties available in the Container Apps environment resource. For a complete list of properties, see [Azure Container Apps REST API reference](/rest/api/containerapps/stable/managed-environments/get?tabs=HTTP).

### Resource

A Container Apps environment resource includes the following properties:

| Property | Description | Data type | Read only |
|---|---|---|---|
| `daprAIInstrumentationKey` | The Application Insights instrumentation key used by Dapr. | string | No |
| `appLogsConfiguration` | The environment's logging configuration. | Object | No |
| `peerAuthentication` | How to enable mTLS encryption. | Object | No |

### <a name="container-apps-environment-examples"></a>Examples

The following example ARM template snippet deploys a Container Apps environment.

> [!NOTE]
> The commands to create container app environments don't support YAML configuration input.

```json
{
  "location": "East US",
  "properties": {
    "daprAIConnectionString": "InstrumentationKey=00000000-0000-0000-0000-000000000000;IngestionEndpoint=https://northcentralus-0.in.applicationinsights.azure.com/",
    "appLogsConfiguration": {
      "logAnalyticsConfiguration": {
        "customerId": "string",
        "sharedKey": "string"
      }
    },
    "zoneRedundant": true,
    "vnetConfiguration": {
      "infrastructureSubnetId": "/subscriptions/<subscription_id>/resourceGroups/RGName/providers/Microsoft.Network/virtualNetworks/VNetName/subnets/subnetName1"
    },
    "customDomainConfiguration": {
      "dnsSuffix": "www.my-name.com",
      "certificateValue": "Y2VydA==",
      "certificatePassword": "1234"
    },
    "workloadProfiles": [
      {
        "name": "My-GP-01",
        "workloadProfileType": "GeneralPurpose",
        "minimumCount": 3,
        "maximumCount": 12
      },
      {
        "name": "My-MO-01",
        "workloadProfileType": "MemoryOptimized",
        "minimumCount": 3,
        "maximumCount": 6
      },
      {
        "name": "My-CO-01",
        "workloadProfileType": "ComputeOptimized",
        "minimumCount": 3,
        "maximumCount": 6
      },
      {
        "name": "My-consumption-01",
        "workloadProfileType": "Consumption"
      }
    ],
    "infrastructureResourceGroup": "myInfrastructureRgName"
  }
}
```

## Container app

The following tables describe the commonly used properties in the container app resource. For a complete list of properties, see [Azure Container Apps REST API reference](/rest/api/containerapps/stable/container-apps/get?tabs=HTTP).

### Resource 

A container app resource's `properties` object includes the following properties:

| Property | Description | Data type | Read only |
|---|---|---|---|
| `provisioningState` | The state of a long running operation, for example when new container revision is created. Possible values include: provisioning, provisioned, failed. Check if app is up and running. | string | Yes |
| `environmentId` | The environment ID for your container app. **This is a required property to create a container app.** If you're using YAML, you can specify the environment ID using the `--environment` option in the Azure CLI instead. | string | No |
| `latestRevisionName` | The name of the latest revision. | string | Yes |
| `latestRevisionFqdn` | The latest revision's URL. | string | Yes |

The `environmentId` value takes the following form:

```console
/subscriptions/<SUBSCRIPTION_ID>/resourcegroups/<RESOURCE_GROUP_NAME>/providers/Microsoft.App/environmentId/<ENVIRONMENT_NAME>
```

In this example, you put your values in place of the placeholder tokens surrounded by `<>` brackets.

#### `properties.configuration`

A resource's `properties.configuration` object includes the following properties:

| Property | Description | Data type |
|---|---|---|
| `activeRevisionsMode` | Setting to `single` automatically deactivates old revisions, and only keeps the latest revision active. Setting to `multiple` allows you to maintain multiple revisions. | string |
| `secrets` | Defines secret values in your container app. | object |
| `ingress` | Object that defines public accessibility configuration of a container app. | object |
| `registries` | Configuration object that references credentials for private container registries. Entries defined with `secretref` reference the secrets configuration object. | object |
| `dapr` | Configuration object that defines the Dapr settings for the container app. | object  |

Changes made to the `configuration` section are [application-scope changes](revisions.md#application-scope-changes), which doesn't trigger a new revision.

#### `properties.template`

A resource's `properties.template` object includes the following properties:

| Property | Description | Data type |
|---|---|---|
| `revisionSuffix` | A friendly name for a revision. This value must be unique as the runtime rejects any conflicts with existing revision name suffix values. | string |
| `containers` | Configuration object that defines what container images are included in the container app. | object |
| `scale` | Configuration object that defines scale rules for the container app. | object |

Changes made to the `template` section are [revision-scope changes](revisions.md#revision-scope-changes), which triggers a new revision.

### <a name="container-app-examples"></a>Examples

For details on health probes, refer to [Health probes in Azure Container Apps](./health-probes.md).

# [ARM template](#tab/arm-template)

The following example ARM template snippet deploys a container app.

```json
{
  "identity": {
    "userAssignedIdentities": {
      "/subscriptions/<subscription_id>/resourcegroups/my-rg/providers/Microsoft.ManagedIdentity/userAssignedIdentities/my-user": {
      }
    },
    "type": "UserAssigned"
  },
  "properties": {
    "environmentId": "/subscriptions/<subscription_id>/resourceGroups/rg/providers/Microsoft.App/managedEnvironments/demokube",
    "workloadProfileName": "My-GP-01",
    "configuration": {
      "ingress": {
        "external": true,
        "targetPort": 3000,
        "customDomains": [
          {
            "name": "www.my-name.com",
            "bindingType": "SniEnabled",
            "certificateId": "/subscriptions/<subscription_id>/resourceGroups/rg/providers/Microsoft.App/managedEnvironments/demokube/certificates/my-certificate-for-my-name-dot-com"
          },
          {
            "name": "www.my-other-name.com",
            "bindingType": "SniEnabled",
            "certificateId": "/subscriptions/<subscription_id>/resourceGroups/rg/providers/Microsoft.App/managedEnvironments/demokube/certificates/my-certificate-for-my-other-name-dot-com"
          }
        ],
        "traffic": [
          {
            "weight": 100,
            "revisionName": "testcontainerApp0-ab1234",
            "label": "production"
          }
        ],
        "ipSecurityRestrictions": [
          {
            "name": "Allow work IP A subnet",
            "description": "Allowing all IP's within the subnet below to access containerapp",
            "ipAddressRange": "192.168.1.1/32",
            "action": "Allow"
          },
          {
            "name": "Allow work IP B subnet",
            "description": "Allowing all IP's within the subnet below to access containerapp",
            "ipAddressRange": "192.168.1.1/8",
            "action": "Allow"
          }
        ],
        "stickySessions": {
          "affinity": "sticky"
        },
        "clientCertificateMode": "accept",
        "corsPolicy": {
          "allowedOrigins": [
            "https://a.test.com",
            "https://b.test.com"
          ],
          "allowedMethods": [
            "GET",
            "POST"
          ],
          "allowedHeaders": [
            "HEADER1",
            "HEADER2"
          ],
          "exposeHeaders": [
            "HEADER3",
            "HEADER4"
          ],
          "maxAge": 1234,
          "allowCredentials": true
        }
      },
      "dapr": {
        "enabled": true,
        "appPort": 3000,
        "appProtocol": "http",
        "httpReadBufferSize": 30,
        "httpMaxRequestSize": 10,
        "logLevel": "debug",
        "enableApiLogging": true
      },
      "maxInactiveRevisions": 10,
      "service": {
        "type": "redis"
      }
    },
    "template": {
      "containers": [
        {
          "image": "repo/testcontainerApp0:v1",
          "name": "testcontainerApp0",
          "probes": [
            {
              "type": "Liveness",
              "httpGet": {
                "path": "/health",
                "port": 8080,
                "httpHeaders": [
                  {
                    "name": "Custom-Header",
                    "value": "Awesome"
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
      "initContainers": [
        {
          "image": "repo/testcontainerApp0:v4",
          "name": "testinitcontainerApp0",
          "resources": {
            "cpu": 0.2,
            "memory": "100Mi"
          },
          "command": [
            "/bin/sh"
          ],
          "args": [
            "-c",
            "while true; do echo hello; sleep 10;done"
          ]
        }
      ],
      "scale": {
        "minReplicas": 1,
        "maxReplicas": 5,
        "rules": [
          {
            "name": "httpscalingrule",
            "custom": {
              "type": "http",
              "metadata": {
                "concurrentRequests": "50"
              }
            }
          }
        ]
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
      ],
      "serviceBinds": [
        {
          "serviceId": "/subscriptions/<subscription_id>/resourceGroups/rg/providers/Microsoft.App/containerApps/redisService",
          "name": "redisService"
        }
      ]
    }
  }
}
```

# [YAML](#tab/yaml)

The following example YAML configuration deploys a container app when used with the `--yaml` parameter in the following Azure CLI commands:

- [`az containerapp create`](/cli/azure/containerapp?view=azure-cli-latest&preserve-view=true#az-containerapp-create)
- [`az containerapp update`](/cli/azure/containerapp?view=azure-cli-latest&preserve-view=true#az-containerapp-update)
- [`az containerapp revision copy`](/cli/azure/containerapp?view=azure-cli-latest&preserve-view=true#az-containerapp-revision-copy)

```yaml
identity:
  userAssignedIdentities:
    "/subscriptions/<subscription_id>/resourcegroups/my-rg/providers/Microsoft.ManagedIdentity/userAssignedIdentities/my-user": {}
  type: UserAssigned
properties:
  environmentId: "/subscriptions/<subscription_id>/resourceGroups/rg/providers/Microsoft.App/managedEnvironments/demokube"
  workloadProfileName: My-GP-01
  configuration:
    ingress:
      external: true
      targetPort: 3000
      customDomains:
      - name: www.my-name.com
        bindingType: SniEnabled
        certificateId: "/subscriptions/<subscription_id>/resourceGroups/rg/providers/Microsoft.App/managedEnvironments/demokube/certificates/my-certificate-for-my-name-dot-com"
      - name: www.my-other-name.com
        bindingType: SniEnabled
        certificateId: "/subscriptions/<subscription_id>/resourceGroups/rg/providers/Microsoft.App/managedEnvironments/demokube/certificates/my-certificate-for-my-other-name-dot-com"
      traffic:
      - weight: 100
        revisionName: testcontainerApp0-ab1234
        label: production
      ipSecurityRestrictions:
      - name: Allow work IP A subnet
        description: Allowing all IP's within the subnet below to access containerapp
        ipAddressRange: 192.168.1.1/32
        action: Allow
      - name: Allow work IP B subnet
        description: Allowing all IP's within the subnet below to access containerapp
        ipAddressRange: 192.168.1.1/8
        action: Allow
      stickySessions:
        affinity: sticky
      clientCertificateMode: accept
      corsPolicy:
        allowedOrigins:
        - https://a.test.com
        - https://b.test.com
        allowedMethods:
        - GET
        - POST
        allowedHeaders:
        - HEADER1
        - HEADER2
        exposeHeaders:
        - HEADER3
        - HEADER4
        maxAge: 1234
        allowCredentials: true
    dapr:
      enabled: true
      appPort: 3000
      appProtocol: http
      httpReadBufferSize: 30
      httpMaxRequestSize: 10
      logLevel: debug
      enableApiLogging: true
    maxInactiveRevisions: 10
    service:
      type: redis
  template:
    containers:
    - image: repo/testcontainerApp0:v1
      name: testcontainerApp0
      probes:
      - type: Liveness
        httpGet:
          path: "/health"
          port: 8080
          httpHeaders:
          - name: Custom-Header
            value: Awesome
        initialDelaySeconds: 3
        periodSeconds: 3
      volumeMounts:
      - mountPath: "/myempty"
        volumeName: myempty
      - mountPath: "/myfiles"
        volumeName: azure-files-volume
      - mountPath: "/mysecrets"
        volumeName: mysecrets
    initContainers:
    - image: repo/testcontainerApp0:v4
      name: testinitcontainerApp0
      resources:
        cpu: 0.2
        memory: 100Mi
      command:
      - "/bin/sh"
      args:
      - "-c"
      - while true; do echo hello; sleep 10;done
    scale:
      minReplicas: 1
      maxReplicas: 5
      rules:
      - name: httpscalingrule
        custom:
          type: http
          metadata:
            concurrentRequests: '50'
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
    serviceBinds:
    - serviceId: "/subscriptions/<subscription_id>/resourceGroups/rg/providers/Microsoft.App/containerApps/redisService"
      name: redisService
```

---

## Container Apps job

The following tables describe the commonly used properties in the Container Apps job resource. For a complete list of properties, see [Azure Container Apps REST API reference](/rest/api/containerapps/stable/jobs/get?tabs=HTTP).

### Resource 

A Container Apps job resource's `properties` object includes the following properties:

| Property | Description | Data type | Read only |
|---|---|---|---|
| `environmentId` | The environment ID for your Container Apps job. **This property is required to create a Container Apps job.** If you're using YAML, you can specify the environment ID using the `--environment` option in the Azure CLI instead. | string | No |

The `environmentId` value takes the following form:

```console
/subscriptions/<SUBSCRIPTION_ID>/resourcegroups/<RESOURCE_GROUP_NAME>/providers/Microsoft.App/environmentId/<ENVIRONMENT_NAME>
```

In this example, you put your values in place of the placeholder tokens surrounded by `<>` brackets.

#### `properties.configuration`

A resource's `properties.configuration` object includes the following properties:

| Property | Description | Data type |
|---|---|---|
| `triggerType` | The type of trigger for a Container Apps job. For specific configuration for each trigger type, see [Jobs trigger types](jobs.md?tabs=azure-resource-manager#job-trigger-types) | string |
| `replicaTimeout` | The timeout in seconds for a Container Apps job. | integer |
| `replicaRetryLimit` | The number of times to retry a Container Apps job. | integer |

#### `properties.template`

A resource's `properties.template` object includes the following properties:

| Property | Description | Data type |
|---|---|---|
| `containers` | Configuration object that defines what container images are included in the job. | object |
| `scale` | Configuration object that defines scale rules for the job. | object |

### <a name="job-examples"></a>Examples

# [ARM template](#tab/arm-template)

The following example ARM template snippet deploys a Container Apps job.

```json
{
  "identity": {
    "userAssignedIdentities": {
      "/subscriptions/<subscription_id>/resourcegroups/my-rg/providers/Microsoft.ManagedIdentity/userAssignedIdentities/my-user": {
      }
    },
    "type": "UserAssigned"
  },
  "properties": {
    "environmentId": "/subscriptions/<subscription_id>/resourceGroups/rg/providers/Microsoft.App/managedEnvironments/demokube",
    "configuration": {
      "replicaTimeout": 10,
      "replicaRetryLimit": 10,
      "manualTriggerConfig": {
        "replicaCompletionCount": 1,
        "parallelism": 4
      },
      "triggerType": "Manual"
    },
    "template": {
      "containers": [
        {
          "image": "repo/testcontainerAppsJob0:v1",
          "name": "testcontainerAppsJob0",
          "probes": [
            {
              "type": "Liveness",
              "httpGet": {
                "path": "/health",
                "port": 8080,
                "httpHeaders": [
                  {
                    "name": "Custom-Header",
                    "value": "Awesome"
                  }
                ]
              },
              "initialDelaySeconds": 5,
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
      "initContainers": [
        {
          "image": "repo/testcontainerAppsJob0:v4",
          "name": "testinitcontainerAppsJob0",
          "resources": {
            "cpu": 0.2,
            "memory": "100Mi"
          },
          "command": [
            "/bin/sh"
          ],
          "args": [
            "-c",
            "while true; do echo hello; sleep 10;done"
          ]
        }
      ],
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
```

# [YAML](#tab/yaml)

The following example YAML configuration deploys a Container Apps job when used with the `--yaml` parameter in the following Azure CLI commands:

- [`az containerapp job create`](/cli/azure/containerapp/job?view=azure-cli-latest&preserve-view=true#az-containerapp-job-create)
- [`az containerapp job update`](/cli/azure/containerapp/job?view=azure-cli-latest&preserve-view=true#az-containerapp-job-update)

```yaml
identity:
  userAssignedIdentities:
    "/subscriptions/<subscription_id>/resourcegroups/my-rg/providers/Microsoft.ManagedIdentity/userAssignedIdentities/my-user": {}
  type: UserAssigned
properties:
  environmentId: "/subscriptions/<subscription_id>/resourceGroups/rg/providers/Microsoft.App/managedEnvironments/demokube"
  configuration:
    replicaTimeout: 10
    replicaRetryLimit: 10
    manualTriggerConfig:
      replicaCompletionCount: 1
      parallelism: 4
    triggerType: Manual
  template:
    containers:
    - image: repo/testcontainerAppsJob0:v1
      name: testcontainerAppsJob0
      probes:
      - type: Liveness
        httpGet:
          path: "/health"
          port: 8080
          httpHeaders:
          - name: Custom-Header
            value: Awesome
        initialDelaySeconds: 5
        periodSeconds: 3
      volumeMounts:
      - mountPath: "/myempty"
        volumeName: myempty
      - mountPath: "/myfiles"
        volumeName: azure-files-volume
      - mountPath: "/mysecrets"
        volumeName: mysecrets
    initContainers:
    - image: repo/testcontainerAppsJob0:v4
      name: testinitcontainerAppsJob0
      resources:
        cpu: 0.2
        memory: 100Mi
      command:
      - "/bin/sh"
      args:
      - "-c"
      - while true; do echo hello; sleep 10;done
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
