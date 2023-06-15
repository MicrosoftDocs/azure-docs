---
title: Blue/Green Deployment in Azure Container Apps
description: Minimize downtime and reduce the risks associated with new release deployment by using Blue/Green deployment in Azure Container Apps.
services: container-apps
author: ruslany
ms.service: container-apps
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.date: 06/15/2023
ms.author: ruslany
zone_pivot_groups: bicep-azure-cli
---

# Blue/Green Deployment in Azure Container Apps

Blue/green deployment is a software release strategy that aims to minimize downtime and reduce the risk associated with deploying new versions of an application. In a blue/green deployment, two identical environments, referred to as "blue" and "green," are set up.

1. Blue Environment: The blue environment represents the currently running and stable version of the application. It handles the production traffic, and users interact with it.

1. Green Environment: The green environment is an identical clone of the blue environment. It is prepared with the new version of the application or the updates you want to deploy. However, it remains inactive and doesn't receive any production traffic initially.

1. Testing and Verification: The green environment is thoroughly tested and verified to ensure that the new version of the application functions as expected. This testing can involve various activities, including functional tests, performance tests, and compatibility checks.

1. Traffic Switch: Once the green environment passes all the necessary tests, a traffic switch is performed. The router or load balancer directing incoming requests is reconfigured to start routing traffic to the green environment instead of the blue environment. This switch is done in a controlled manner, ensuring a smooth transition.

1. Validation: After the traffic switch, the green environment becomes the active production environment, serving user traffic. This allows you to validate the new version in a real-world scenario. If any issues or errors arise, it's possible to quickly roll back by switching the traffic back to the blue environment.

1. Rollback or Cleanup: If problems occur in the green environment, you can revert the traffic switch, routing traffic back to the stable blue environment. This rollback ensures minimal impact on users in case of issues. After resolving any issues in the green environment, it can be cleaned up, ready for future deployments.

In the context of Azure Container Apps the blue/green deployment release approach is enabled via [container apps revisions](revisions.md), [traffic weights](traffic-splitting.md) and [revision labels](revisions.md#revision-labels). 

This article shows you how to configure traffic splitting rules for your container app. To run the following examples, you need a container app environment.

## Create a container app with multiple active revisions enabled

To enable traffic splitting the app has to have the `configuration.activeRevisionsMode` property set to `multiple`. To use deterministic revision names the `template.revisionSuffix` configuration setting can be used. It can be set to some string value that uniquely identifies a release, for example a build number of a git commit id.

::: zone pivot="azure-cli"

```azurecli
commitId=0b699ef
az containerapp create --name <APP_NAME> \
  --environment <APP_ENVIRONMENT_NAME> \ 
  --resource-group <RESOURCE_GROUP> \
  --image k8seteste2e.azurecr.io/e2e-apps/test-app:latest \
  --revision-suffix $commitId \ # set revision suffix
  --env-vars REVISION_COMMIT_ID=$commitId \ # save commitId in an env variable
  --ingress external \
  --target-port 80 \
  --revisions-mode multiple # set revision mode to 'multiple'
```

::: zone end

::: zone pivot="bicep"

Save the following code into a file named `main.bicep`.

```bicep
targetScope = 'resourceGroup'
param location string = resourceGroup().location

@minLength(1)
@maxLength(64)
@description('Name of containerapp')
param appName string

@minLength(1)
@maxLength(64)
@description('Container environment name')
param containerAppsEnvironmentName string

@minLength(1)
@maxLength(7)
@description('Short commitId of a version to deploy')
param commitId string

@description('Name of the blue revision that takes production traffic')
param blueRevisonName string = ''

@minValue(0)
@maxValue(100)
@description('Percentage of traffic to route to the green (non-production) revision (0-100)')
param greenRevisionWeight int = 0

resource containerAppsEnvironment 'Microsoft.App/managedEnvironments@2022-03-01' existing = {
  name: containerAppsEnvironmentName
}

resource blueGreenDeploymentApp 'Microsoft.App/containerApps@2022-11-01-preview' = {
  name: appName
  location: location  
  properties: {
    environmentId: containerAppsEnvironment.id
    workloadProfileName: 'Consumption'
    configuration: {
      activeRevisionsMode: 'multiple' // Multiple active revisions mode is required when using traffic weights
      ingress: {
        external: true
        targetPort: 80
        traffic: !empty(blueRevisonName) ? [
          {
            revisionName: blueRevisonName
            label: 'blue'
            weight: 100 - greenRevisionWeight
          }
          {
            revisionName: '${appName}--${commitId}'
            label: 'green'
            weight: greenRevisionWeight
          }          
        ] : [
          {
            latestRevision: true // This block is used when an app is created for the first time
            weight: 100
          }
        ]
      }
    }
    template: {
      revisionSuffix: commitId
      containers:[
        {
          image: 'k8seteste2e.azurecr.io/e2e-apps/test-app:latest'
          name: appName
          resources: {
            cpu: json('0.5')
            memory: '1.0Gi'
          }
          env: [
            {
              name: 'REVISION_COMMIT_ID'
              value: commitId
            }
          ]
        }
      ]
    }
  }
}

output fqdn string = blueGreenDeploymentApp.properties.configuration.ingress.fqdn
output latestRevisionName string = blueGreenDeploymentApp.properties.latestRevisionName
```

Deploy the app with the bicep template using this command:

```azurecli
commitId=0b699ef
az deployment group create \
    -n <DEPLOYMENT_NAME> \
    -g <RESOURCE_GROUP> \
    -f main.bicep \
    -p appName=<APP-NAME> commitId=$commitId containerAppsEnvironmentName=<APP_ENVIRONMENT_NAME> \
    --query properties.outputs.latestRevisionName
```

:::

