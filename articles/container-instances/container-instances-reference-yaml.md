---
title: Azure Container Instances YAML reference    
description: Reference for the YAML file supported by Azure Container Instances to configure a container group
services: container-instances
author: dlepow
manager: gwallace

ms.service: container-instances
ms.topic: article
ms.date: 08/12/2019
ms.author: danlep
---

# YAML reference: Azure Container Instances

This article covers the syntax and properties for the YAML file supported by Azure Container Instances to configure a [container group](container-instances-container-groups.md). Use a YAML file to input the group configuration to the [az container create][az-container-create] command in the Azure CLI. 

A YAML file is a convenient way to configure a container group for reproducible deployments. The YAML syntax provides a concise alternative to configuring a container group using a [Resource Manager template](/azure/templates/Microsoft.ContainerInstance/2018-10-01/containerGroups) or the Azure Container Instances SDKs.

> [!NOTE]
> This reference applies to YAML files for Azure Container Instances REST API version `2018-10-01`.

## Schema 

For a description of the properties in this schema, see the [Property values](/azure/templates/Microsoft.ContainerInstance/2018-10-01/containerGroups#property-values) for the corresponding Resource Manager template schema. Key properties are highlighted with comments below.

```yml
name: string  # Name of the container group
apiVersion: '2018-10-01'
location: string
tags: {}
identity: 
  type: string
  userAssignedIdentities: {}
properties: # Properties of container group
  containers: # Array of container instances in the group
  - name: string 
    properties: # Properties of an instance
      image: string # Container image used to create the instance
      command:
      - string
      ports: # Exposed ports on the instance
      - protocol: string
        port: integer
      environmentVariables:
      - name: string
        value: string
        secureValue: string
      resources: # Resource requirements of the instance
        requests:
          memoryInGB: number
          cpu: number
          gpu:
            count: integer
            sku: string
        limits:
          memoryInGB: number
          cpu: number
          gpu:
            count: integer
            sku: string
      volumeMounts: # Array of volume mounts for the instance
      - name: string
        mountPath: string
        readOnly: boolean
      livenessProbe:
        exec:
          command:
          - string
        httpGet:
          path: string
          port: integer
          scheme: string
        initialDelaySeconds: integer
        periodSeconds: integer
        failureThreshold: integer
        successThreshold: integer
        timeoutSeconds: integer
      readinessProbe:
        exec:
          command:
          - string
        httpGet:
          path: string
          port: integer
          scheme: string
        initialDelaySeconds: integer
        periodSeconds: integer
        failureThreshold: integer
        successThreshold: integer
        timeoutSeconds: integer
  imageRegistryCredentials: # Credentials to pull a private image
  - server: string
    username: string
    password: string
  restartPolicy: string
  ipAddress: # IP address configuration of container group
    ports:
    - protocol: string
      port: integer
    type: string
    ip: string
    dnsNameLabel: string
  osType: string
  volumes: # Array of volumes available to the instances
  - name: string
    azureFile:
      shareName: string
      readOnly: boolean
      storageAccountName: string
      storageAccountKey: string
    emptyDir: {}
    secret: {}
    gitRepo:
      directory: string
      repository: string
      revision: string
  diagnostics:
    logAnalytics:
      workspaceId: string
      workspaceKey: string
      logType: string
      metadata: {}
  networkProfile: # Virtual network profile for container group
    id: string
  dnsConfig: # DNS configuration for container group
    nameServers:
    - string
    searchDomains: string
    options: string
```

## Next steps

See the tutorial [Deploy a multi-container group using a YAML file](container-instances-multi-container-yaml.md).

<!-- LINKS - Internal -->
[az-container-create]: /cli/azure/container#az-container-create

