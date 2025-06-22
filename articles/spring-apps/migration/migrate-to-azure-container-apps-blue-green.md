---
title: Blue-Green Deployment to Azure Container Apps
description: Describes blue-green deployment to Azure Container Apps.
author: KarlErickson
ms.author: karler
ms.reviewer: dingmeng-xue
ms.service: azure-spring-apps
ms.topic: upgrade-and-migration-article
ms.date: 03/17/2025
ms.custom: devx-track-java, devx-track-extended-java
---

# Blue-green deployment to Azure Container Apps

**This article applies to:** ✅ Basic/Standard ✅ Enterprise

In Azure Container Apps, you can enable blue-green deployment by combining [container apps revisions](../../container-apps/revisions.md), [traffic weights](../../container-apps/traffic-splitting.md), and [revision labels](../../container-apps/revisions.md#labels).

## Create or update a container app with multiple active revisions enabled

To create a new container app with multiple active revisions enabled, use the following command:

```azurecli
az containerapp create \
    --resource-group <resource-group> \
    --name <app-name> \
    --environment <app-environment-name> \
    --image mcr.microsoft.com/k8se/samples/test-app:<blue-commit-ID> \
    --revision-suffix <blue-suffix> \
    --ingress external \
    --target-port 80 \
    --revisions-mode multiple
```

Alternatively, you can use the following command to update an existing app to enable multiple revisions:

```azurecli
az containerapp revision set-mode \
    --resource-group <resource-group> \
    --name <app-name> \
    --mode multiple
```

## Deploy a new revision and assign labels

To deploy a new revision, use the following command:

```azurecli
az containerapp update \
    --resource-group <resource-group> \
    --name <app-name> \
    --image mcr.microsoft.com/k8se/samples/test-app:<GREEN_COMMIT_ID> \
    --revision-suffix <GREEN_SUFFIX>
```

To add labels to a specific revision, use the following commands:

```azurecli
az containerapp revision label add \
    --resource-group <resource-group> \
    --name <app-name> \
    --label blue \
    --revision <blue-revision-name>

az containerapp revision label add \
    --resource-group <resource-group> \
    --name <app-name> \
    --label green \
    --revision <green-revision-name>
```

Here, `<blue-revision-name>` is `<app-name>--<blue-suffix>`, and `<green-revision-name>` is `<app-name>--<green-suffix>`. You can only assign a label to one revision at a time.

Initially, the revision with the blue `commitId` takes 100% of production traffic, while the newly deployed revision with the green `commitId` doesn't take any production traffic.

In Azure Spring Apps, you can deploy at most two revisions of one app: one set as Production and the other as Staging. However, Azure Container Apps supports deploying multiple revisions for a single app.

## Test a new revision

Each revision in Azure Container Apps has its own URL, enabling you to test and verify your deployment against the specific URL. Use the following commands to test the green revision with a specific domain, even though all production traffic is directed to the blue revision:

```azurecli
export GREEN_DOMAIN=$(az containerapp revision show \
    --resource-group <resource-group> \
    --name <app-name> \
    --revision <green-revision-name> \
    --query "properties.fqdn" \
    --output tsv)

curl -s https://$GREEN_DOMAIN
```

Use the following commands to test with the label-specific fully qualified domain name (FQDN):

```azurecli
export APP_NAME=<app-name>

# Get the containerapp environment default domain
export APP_ENVIRONMENT_DOMAIN=$(az containerapp env show \
    --resource-group <resource-group> \
    --name <app-environment-name> \
    --query "properties.defaultDomain" \
    --output tsv)

# Test the production FQDN
curl -s https://$APP_NAME.$APP_ENVIRONMENT_DOMAIN

# Test the blue label FQDN
curl -s https://$APP_NAME---blue.$APP_ENVIRONMENT_DOMAIN

# Test the green label FQDN
curl -s https://$APP_NAME---green.$APP_ENVIRONMENT_DOMAIN
```

## Send production traffic to the green revision

To switch production traffic to the green revision, use the following commands:

```azurecli
# switch based on revision name
az containerapp ingress traffic set \
    --resource-group <resource-group> \
    --name <app-name> \
    --revision-weight <blue-revision-name>=0 <green-revision-name>=100

# switch based on label
az containerapp ingress traffic set \
    --resource-group <resource-group> \
    --name <app-name> \
    --label-weight blue=0 green=100
```

Ensure that the total label weight equals 100%.

Azure Container Apps not only enables you to switch traffic between blue-green deployments but also between multiple revisions. You can also redirect a specific amount of production traffic to the green deployment.

For more information about blue-green deployment in Azure Container Apps, see [Blue-Green Deployment in Azure Container Apps](../../container-apps/blue-green-deployment.md).

## Limitation

The Eureka Server isn't suitable for blue-green deployment because all revisions of the app are registered with the Eureka Server, preventing effective traffic splitting.

To enable traffic splitting when using Spring Cloud Gateway, you need to set the application URL in the URI field of your gateway configuration. You can obtain the application URL by using the following command:

```azurecli
az containerapp show \
    --resource-group <resource-group> \
    --name <app-name> \
    --query "properties.configuration.ingress.fqdn" \
    --output tsv
```
