---
title: The Experience of Blue-Green Deployment in Azure Container Apps
description: Describes the experience of blue-green deployment in Azure Container Apps.
author: KarlErickson
ms.author: dixue
ms.service: azure-spring-apps
ms.topic: upgrade-and-migration-article
ms.date: 01/29/2025
ms.custom: devx-track-java, devx-track-extended-java
---

# The experience of blue-green deployment in Azure Container Apps

[!INCLUDE [deprecation-note](../includes/deprecation-note.md)]

**This article applies to:** ✅ Basic/Standard ✅ Enterprise

This article describes blue-green deployment with Azure Container Apps.

In Azure Container Apps, you can enable blue-green deployment by combining [container apps revisions](../../container-apps/revisions.md), [traffic weights](../../container-apps/traffic-splitting.md), and [revision labels](../../container-apps/revisions.md#labels).

## Create or update a container app with multiple active revisions enabled

To create a new container app with multiple active revisions enabled, use the following command:

```azurecli
az containerapp create \
    --resource-group <RESOURCE_GROUP> \
    --name <APP_NAME> \
    --environment <APP_ENVIRONMENT_NAME> \
    --image mcr.microsoft.com/k8se/samples/test-app:<BLUE_COMMIT_ID> \
    --revision-suffix <BLUE_SUFFIX> \
    --ingress external \
    --target-port 80 \
    --revisions-mode multiple
```

Alternatively, you can use the following command to update an existing app to enable multiple revisions:

```azurecli
az containerapp revision set-mode \
    --resource-group <RESOURCE_GROUP> \
    --name <APP_NAME> \
    --mode multiple
```

## Deploy a new revision and assign labels

To deploy a new revision, use the following command:

```azurecli
az containerapp update \
    --resource-group <RESOURCE_GROUP> \
    --name <APP_NAME> \
    --image mcr.microsoft.com/k8se/samples/test-app:<GREEN_COMMIT_ID> \
    --revision-suffix <GREEN_SUFFIX>
```

You can add labels to specific revisions as shown in the following example:

```azurecli
az containerapp revision label add \
    --resource-group <RESOURCE_GROUP> \
    --name <APP_NAME> \
    --label blue \
    --revision <APP_NAME>--<BLUE_SUFFIX>

az containerapp revision label add \
    --resource-group <RESOURCE_GROUP> \
    --name <APP_NAME> \
    --label green \
    --revision <APP_NAME>--<GREEN_SUFFIX>
```

Initially, the revision with the *blue* `commitId` takes 100% of production traffic, while the newly deployed revision with the *green* `commitId` doesn't take any production traffic.

In Azure Spring Apps, you can deploy at most two revisions of one app: one set as Production and the other as Staging. However, Azure Container Apps supports deploying multiple revisions for a single app.

## Test a new revision

Each revision in Azure Container Apps has its own URL, enabling you to test and verify your deployment against the specific URL. Use the following commands to test the green revision with a specific domain, even though all production traffic is directed to the blue revision:

```azurecli
export GREEN_DOMAIN=$(az containerapp revision show \
    --resource-group <RESOURCE_GROUP> \
    --name <APP_NAME> \
    --revision <GREEN_REVISION_NAME> \
    --query "properties.fqdn" \
    --output tsv \
    | tr -d '\r\n')

curl -s http://$GREEN_DOMAIN
```

Use the following commands to test with the label-specific fully qualified domain name (FQDN):

```azurecli
# Get the containerapp environment default domain
export APP_DOMAIN=$(az containerapp env show \
    --resource-group <RESOURCE_GROUP> \
    --name <APP_ENVIRONMENT_NAME> \
    --query "properties.defaultDomain" \
    --output tsv \
    | tr -d '\r\n')

# Test the production FQDN
curl -s https://$APP_NAME.$APP_DOMAIN

# Test the blue label FQDN
curl -s https://$APP_NAME---blue.$APP_DOMAIN

# Test the green label FQDN
curl -s https://$APP_NAME---green.$APP_DOMAIN
```

## Send production traffic to the green revision

To switch production traffic to the green revision, use the following commands:

```azurecli
# switch based on revision name
az containerapp ingress traffic set \
    --resource-group <RESOURCE_GROUP> \
    --name <APP_NAME> \
    --revision-weight <BLUE_REVISION_NAME>=0 <GREEN_REVISION_NAME>=100

# switch based on label
az containerapp ingress traffic set \
    --resource-group <RESOURCE_GROUP> \
    --name <APP_NAME> \
    --label-weight blue=0 green=100
```

Ensure that the total label weight doesn't exceed 100.

Azure Container Apps not only enables you to switch traffic between blue-green deployments but also between multiple revisions. You can also redirect a specific amount of production traffic to the green deployment.

For more information about blue-green deployment in Azure Container Apps, see [Blue-Green Deployment in Azure Container Apps](../../container-apps/blue-green-deployment.md).

## Limitation

The Eureka Server isn't suitable for blue-green deployment because all revisions of the app are registered with the Eureka Server, preventing effective traffic splitting.

To enable traffic splitting when using Spring Cloud Gateway, you need to set the application URL in the URI field of your gateway configuration. You can obtain the application URL by using the following command:

```azurecli
az containerapp show \
    --resource-group <RESOURCE_GROUP> \
    --name <APP_NAME> \
    --query "properties.configuration.ingress.fqdn" \
    --output tsv \
    | tr -d '\r\n'
```
