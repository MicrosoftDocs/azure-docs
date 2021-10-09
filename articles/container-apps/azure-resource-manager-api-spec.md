---
title: Container Apps ARM API specification
description: 
services: app-service
author: craigshoemaker
ms.service: app-service
ms.topic:  reference
ms.date: 10/21/2021
ms.author: cshoe
---

# Container Apps ARM API specification


| Property | Description | Read only| Required |
|---|---|---|---|
| latestRevisionName | The name of the revision that correspond to the current configuration state of the container app's object | Yes | No |
| latestRevisionFqdn | The domain name used to access the latest revision of the container app | Yes | No |
| provisioningState | The state of a long running operation (e.g. when new container revision is created) | Yes | No |
| kubeEnvironmentId |  | Yes | No |
| Fqdn | random part is used to prevent domain name stealing | Yes | No |
| Containers |  | No | Yes |
| Configuration |  | No | No |
| Scale |  | No | No |
| Dapr |  | No | No |
| Transport | Possible values: auto (default), http, http2 | No | No |
| Registries | contains the authentication parameters to pull images from private registries | No | No |

```yml
id: subscriptions/{id}/resourceGroups/{group}/providers/Microsoft.Web/containerapps/mypythonapp
name: mypythonapp
type: Microsoft.Web/containerapps
location: East US 2
tags:
  key1: value 1
kind: containerapp
properties:
  provisioningState: Succeeded,
  kubeEnvironmentId: /subscriptions/{id}/resourceGroups/{group}/providers/Microsoft.Web/kubeEnvironments/{name}
  latestRevisionName: mypythonapp-af5kc0p
  latestRevisionFqdn: mypythonapp-af5kc0p.mykubeenvironment-90cb2y1s.eastus.containerapps.io
  configuration:
    activeRevisionsMode: multiple | single
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
      fqdn: mypythonapp.mykubeenvironment-90cb2y1s.eastus.containerapps.io
      transport: auto
      allowInsecure: true
      traffic:
      - revisionName: mypythonapp-bf32da4
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