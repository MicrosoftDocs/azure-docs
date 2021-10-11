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
| `id` | The unique identifier of the container app. The value uses the following format:<br><br>`subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<GROUP_NAME>/providers/Microsoft.Web/containerapps/<NAME>`<br><br>In this example, you put your values in place of the placeholder tokens surrounded by `<>` brackets. | string |
| `name` | The Container Apps application name. This name is used at the end of the `id` property in the ARM template file. | string |
| `location` | The Azure region where the Container Apps instance is deployed. | string |
| `tags` | Collection of Azure tags associated with the container app. | array |
| `kind` | \*\*TODO\*\* | string |

## properties

| Property | Description | Data type |
|---|---|---|
| `provisioningState` | The state of a long running operation, for example when new container revision is created. Possible values include: \*\*TODO\*\* | string |
| `kubeEnvironmentId` | aklsjdf<br><br>`/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP_NAM>/providers/Microsoft.Web/kubeEnvironments/<KUBERNETES_ENVIRONMENT_NAME>`<br><br> | string |
| `latestRevisionName` | The name of the revision that corresponds to the current configuration state of the container app's object | string |
| `latestRevisionFqdn` | The domain name used to access the latest revision of the container app | string |

## properties.configuration

| Property | Description | Data type |
|---|---|---|
| `activeRevisionsMode` | Setting to `multiple` allows you to maintain multiple revisions. Setting to `single` automatically deactivates old revisions. | string |
| `secrets` | Contains references to secret values passed in to the \*\*TODO\*\*  | object |
| `ingress` | Configuration object that defines the public accessibility of a container app.  | object |
| `registries` | Configuration object that holds references to credentials for external container registries.  | object |

## properties.template

| Property | Description | Data type |
|---|---|---|
| `revisionSuffix` | Value that is appended to the end of each container app revision. | string |
| `containers` | Configuration object that defines what container images are included in the container app. | object |
| `scale` | Configuration object that defines scale rules for the container app. | object |
| `dapr` | Configuration object that defines the Dapr settings for the container app. | object  |

## Example template

```yml
id: subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP_NAME>/providers/Microsoft.Web/containerapps/<CONTAINER_APP_NAME>
name: mysampleapp
type: Microsoft.Web/containerapps
location: East US 2
tags:
  key1: value 1
kind: containerapp
properties:
  provisioningState: Succeeded,
  kubeEnvironmentId: /subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP_NAM>/providers/Microsoft.Web/kubeEnvironments/<KUBERNETES_ENVIRONMENT_NAME>
  latestRevisionName: mysampleapp-af5kc0p
  latestRevisionFqdn: mysampleapp-af5kc0p.mykubeenvironment-90cb2y1s.eastus.containerapps.io
  configuration:
    activeRevisionsMode: multiple
    secrets:
    - name: queueconnection
      value: secretValue1
    - name: service-bus-connection
      value: secretValue2
    - name: redis-connection
      value: secretValue3
    - name: docker-password
      value: secreteValue4
    - name: acr-password
      value: secretValue5
    ingress:
      external: true
      targetPort: 8080
      fqdn: mysampleapp.mykubeenvironment-90cb2y1s.eastus.containerapps.io
      transport: auto
      allowInsecure: true
      traffic:
      - revisionName: mysampleapp-bf32da4
        weight: 80
      - latestRevision: true
        weight: 20
    registries:
      - server: docker.io
        username: someuser
        passwordSecretRef: docker-password
      - server: myacr.azurecr.io
        username: someuser
        passwordSecretRef: acr-password
  template:
    revisionSuffix: friendlyname
    containers:
    - image: myrepo/api-service:v1
      name: webcontainer     
      env:  
      - name: HTTP_PORT
        value: '8080'
      resources:
        cpu: 0.5
        memory: 250Mb
    - image: myacr.azurecr.io/myrepo/queue-service:v1
      name: queuecontainer
      command: "/bin/queue"
      env:
      - name: QUEUE_CONNECTION
        secretRef: queueconnection
      args: []
    scale:
      rules:
      - name: http-scaling-rule
        http:
      - name: queue-scaling-rule
        azureQueue:        
          queueName: myqueue
          queueLength: 20
          auth:
          - secretRef: queueconnection
            triggerParameter: connection
      - name: serviceBusScalingRule
        custom:
          type: azure-servicebus 
          metadata:
            topicName: mytopic
            queueLength: 20
          auth:
          - secretRef: service-bus-connection
            triggerParameter: connection 
      - name: redis-scaling-rules
        custom:
          type: Redis
          metadata:
            address: redis_host
            listName: mylist
            listLength: 5
          auth:
          - secretRef: redis-connection
            triggerParameter: connection 
      minReplicas: 1
      maxReplicas: 5
    dapr:
      enabled: true
      appPort: 80
      appId: my-dapr-app
      components:
      - name: prod-db
        type: state.azure.cosmosdb
        version: v1
        metadata:
        - name: url
          value: <COSMOS-URL>
        - name: database
          value: itemsDB
        - name: collection
          value: items
        - name: masterkey
          secretRef: masterkey
```
