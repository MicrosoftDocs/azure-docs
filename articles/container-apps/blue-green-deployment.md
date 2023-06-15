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

In the context of Azure Container Apps the blue/green deployment release approach is enabled by using [container apps revisions](revisions.md), [traffic weights](traffic-splitting.md) and [revision labels](revisions.md#revision-labels). 

This article shows you how to configure traffic splitting rules for your container app. To run the following examples, you need a container app environment in which you can create a new app.

## Create a container app with multiple active revisions enabled

To enable traffic splitting the app has to have the `configuration.activeRevisionsMode` property set to `multiple`. To use deterministic revision names the `template.revisionSuffix` configuration setting can be used. It can be set to some string value that uniquely identifies a release, for example a build number of a git commit id.

::: zone pivot="azure-cli"

```azurecli
export APP_NAME=<APP_NAME>
export APP_ENVIRONMENT_NAME=<APP_ENVIRONMENT_NAME>
export RESOURCE_GROUP=<RESOURCE_GROUP>

# A random commitId that is assumed to belong to the app code currently in production
export BLUE_COMMIT_ID=sha10b699ef
# A random commitId that is assumed to belong to the new version of the code to be deployed
export GREEN_COMMIT_ID=sha1c6f1515
# Note: 'sha1' prefix added to the commit hash as the revision suffix cannot start with number

# create a new app with a new revision
az containerapp create --name $APP_NAME \
  --environment $APP_ENVIRONMENT_NAME \
  --resource-group $RESOURCE_GROUP \
  --image k8seteste2e.azurecr.io/e2e-apps/test-app:latest \
  --revision-suffix $BLUE_COMMIT_ID \
  --env-vars REVISION_COMMIT_ID=$BLUE_COMMIT_ID \
  --ingress external \
  --target-port 80 \
  --revisions-mode multiple

# Fix 100% of traffic to the revision
az containerapp ingress traffic set \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --revision-weight $APP_NAME--$BLUE_COMMIT_ID=100

# give that revision a label 'blue'
az containerapp revision label add \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --label blue \
  --revision $APP_NAME--$BLUE_COMMIT_ID
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
@maxLength(64)
@description('CommitId of a version to deploy')
param commitId string

@description('Name of the blue revision that takes production traffic')
param blueRevisonName string = ''

@description('Name of the green revision that that is used for testing new versions')
param greenRevisonName string = ''

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
          !empty(greenRevisonName) ? {
            revisionName: greenRevisonName
            label: 'green'
            weight: greenRevisionWeight
          } : {
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
              name: 'BuildVersion'
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
export APP_NAME=<APP_NAME>
export APP_ENVIRONMENT_NAME=<APP_ENVIRONMENT_NAME>
export RESOURCE_GROUP=<RESOURCE_GROUP>

# A random commitId that is assumed to belong to the app code currently in production
export BLUE_COMMIT_ID=sha10b699ef
# A random commitId that is assumed to belong to the new version of the code to be deployed
export GREEN_COMMIT_ID=sha1c6f1515
# Note: 'sha1' prefix added to the commit hash as the revision suffix cannot start with number

az deployment group create \
    --name create-app-$BLUE_COMMIT_ID \
    --resource-group $RESOURCE_GROUP \
    --template-file main.bicep \
    --parameters appName=$APP_NAME commitId=$BLUE_COMMIT_ID containerAppsEnvironmentName=$APP_ENVIRONMENT_NAME \
    --query properties.outputs.fqdn
```

::: zone end

## Deploy a new revision and assign labels

For the purposes of this article the `blue` label will refer to a production deployment, which is a revision that takes the production traffic arriving on the apps FQDN. The `green` label will refer to a new version of an app that is about to be rolled out into production. It is identified by a new commit id. The following command will deploy a new revision for that commit id and mark it with `green` label.

::: zone pivot="azure-cli"

```azurecli
# create a second revision for green commitId
az containerapp update --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --image k8seteste2e.azurecr.io/e2e-apps/test-app:latest \
  --revision-suffix $GREEN_COMMIT_ID  \
  --set-env-vars REVISION_COMMIT_ID=$GREEN_COMMIT_ID

# give that revision a 'green' label
az containerapp revision label add \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --label green \
  --revision $APP_NAME--$GREEN_COMMIT_ID
```
::: zone end

::: zone pivot="bicep"

```azurecli
az deployment group create \
    --name create-revision-$GREEN_COMMIT_ID \
    --resource-group $RESOURCE_GROUP \
    --template-file main.bicep \
    --parameters appName=$APP_NAME commitId=$GREEN_COMMIT_ID blueRevisonName=$APP_NAME--$BLUE_COMMIT_ID containerAppsEnvironmentName=$APP_ENVIRONMENT_NAME \
    --query properties.outputs.fqdn
```

::: zone end

After running those commands the traffic section of the app will look as below. The revision with the `blue` commitId is taking 100% of production traffic while the newly deployed revision with `green` commitId does not take any production traffic.

```json
{ 
  "traffic": [
    {
      "revisionName": "<APP_NAME>--sha10b699ef",
      "weight": 100,
      "label": "blue"
    },
    {
      "revisionName": "<APP_NAME>--sha1c6f1515",
      "weight": 0,
      "label": "green"
    }
  ]
}
```

The newly deployed revision can be tested by using the label-specific FQND:

```azurecli
# get the containerapp environment default domain
export APP_DOMAIN=$(az containerapp env show -g $RESOURCE_GROUP -n $APP_ENVIRONMENT_NAME --query properties.defaultDomain -o tsv | tr -d '\r\n')

# Test the production FQDN
curl https://$APP_NAME.$APP_DOMAIN/api/env | jq

# Test the blue lable FQDN
curl https://$APP_NAME---blue.$APP_DOMAIN/api/env | jq

# Test the green lable FQDN
curl https://$APP_NAME---green.$APP_DOMAIN/api/env | jq
```

# Send a percentage of production traffic to the green revision

After testing the newly deployed revosopm via label-specific FQDN the next step is to send some percentage of production traffic to that revision.

::: zone pivot="azure-cli"

```azurecli
az containerapp ingress traffic set \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --label-weight blue=80 green=20
```

::: zone end

::: zone pivot="bicep"

```azurecli
az deployment group create \
    --name set-traffic-$GREEN_COMMIT_ID \
    --resource-group $RESOURCE_GROUP \
    --template-file main.bicep \
    --parameters appName=$APP_NAME commitId=$GREEN_COMMIT_ID blueRevisonName=$APP_NAME--$BLUE_COMMIT_ID greenRevisionWeight=20 containerAppsEnvironmentName=$APP_ENVIRONMENT_NAME \
    --query properties.outputs.fqdn
```

::: zone end

After running that command the traffic section of the app will look as below.

```json
{ 
  "traffic": [
    {
      "revisionName": "<APP_NAME>--sha10b699ef",
      "weight": 80,
      "label": "blue"
    },
    {
      "revisionName": "<APP_NAME>--sha1c6f1515",
      "weight": 20,
      "label": "green"
    }
  ]
}
```

## Swap the labels to send all production traffic to the new revision

After confirming that the app code in the revision labelled `green` works as expected we are ready to swap the labels to make this revision `blue` and send 100% of production traffic to it.

::: zone pivot="azure-cli"

```azurecli
# set 100% of traffic back to the blue label
az containerapp ingress traffic set \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --label-weight blue=100 green=0

# swap revision labels
az containerapp revision label swap \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --source green --target blue
```

::: zone end

::: zone pivot="bicep"

```azurecli
az deployment group create \
    --name swap-labels-$GREEN_COMMIT_ID \
    --resource-group $RESOURCE_GROUP \
    --template-file main.bicep \
    --parameters appName=$APP_NAME commitId=$GREEN_COMMIT_ID blueRevisonName=$APP_NAME--$GREEN_COMMIT_ID greenRevisonName=$APP_NAME--$BLUE_COMMIT_ID containerAppsEnvironmentName=$APP_ENVIRONMENT_NAME \
    --query properties.outputs.fqdn
```

::: zone end

After running that command the traffic section of the app will look as below. The revision that was marked with `green` label is now marked as `blue` and is taking 100% of production traffic.

```json
{ 
  "traffic": [
    {
      "revisionName": "<APP_NAME>--sha1c6f1515",
      "weight": 100,
      "label": "blue"
    },
    {
      "revisionName": "<APP_NAME>--sha10b699ef",
      "weight": 0,
      "label": "green"
    }
  ]
}
```

# Rollback the deployment in case of problems

If after the swap and running in production the new revision found to have bugs then the app can be rolled back to the previous good state by swapping the labels again:

::: zone pivot="azure-cli"

```azurecli
az containerapp revision label swap \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --source blue --target green
```

::: zone end

::: zone pivot="bicep"

```azurecli
az deployment group create \
    --name rollback-$BLUE_COMMIT_ID \
    --resource-group $RESOURCE_GROUP \
    --template-file main.bicep \
    --parameters appName=$APP_NAME commitId=$GREEN_COMMIT_ID blueRevisonName=$APP_NAME--$BLUE_COMMIT_ID greenRevisonName=$APP_NAME--$GREEN_COMMIT_ID containerAppsEnvironmentName=$APP_ENVIRONMENT_NAME \
    --query properties.outputs.fqdn
```

::: zone end

## Next steps

> [!div class="nextstepaction"]
> [GitHub Actions](github-actions.md)
