---
title: How to migrate an Azure Spring Cloud Basic or Standard tier instance to Enterprise tier
titleSuffix: Azure Spring Cloud Enterprise tier
description: How to migrate an Azure Spring Cloud Basic or Standard tier instance to Enterprise tier
author: karlerickson
ms.author: yuwzho
ms.service: spring-cloud
ms.topic: how-to
ms.date: 05/25/2022
ms.custom: devx-track-java
---

# Stable API updates (April 2022)

Azure Spring Apps service releases new stable API version 2022-04-01. The new API version introduces breaking changes based on previouse stable API version 2020-07-01. We suggest that you update your API call to the new API version.

## Previous API deprecation date

The previous API version 2020-04-01 will not be supported by April, 2025.

## API Breaking change from 2020-07-01 to 2022-04-01

### Deprecate number value CPU and MemoryInGB in Deployment

Deprecate field `properties.cpu` and `properties.memoryInGB` in `Spring/Apps/Deployments` resource. Use `properties.resourceRequests.cpu` and `properties.resourceRequests.memory` instead.

### RBAC role change for blue-green deployment

Deprecate filed `properties.activeDeploymentName` in `Spring/Apps` resource. Use `POST/SUBSCRIPTIONS/RESOURCEGROUPS/PROVIDERS/MICROSOFT.APPPLATFORM/SPRING/APPS/SETACTIVEDEPLOYMENTS` for blue-green deployment. This action need a separate RBAC role `spring/apps/setActiveDeployments/action` to perform.

### Move options from different property bag for `Spring/Apps/Deployments` resource

- Deprecate `properties.createdTime`. Use `systemData.createdAt`.
- Deprecate `properties.deploymentSettings.jvmOptions`. Use `properties.source.jvmOptions`.
- Deprecate `properties.deploymentSettings.jvmOptions`. Use `properties.source.runtimeVersion`.
- Deprecate `properties.deploymentSettings.netCoreMainEntryPath`. Use `properties.source.netCoreMainEntryPath`.
- Deprecate `properties.appName`, which can be extracted from `id`.

## Update in Azure CLI extension

### Add new RBAC role for blue-green deployment

You need to add RBAC role `spring/apps/setActiveDeployments/action` to perform these Azure CLI commands:

```azurecli
az spring app set-deployment \
    --resource-group <resource-group-name> \
    --service <service-instance-name> \
    --name <app-name> \
    --deployment <deployment-name>
az spring app unset-deployment \
    --resource-group <resource-group-name> \
    --service <service-instance-name> \
    --name <app-name>
```

### Output update

If you're using an Azure CLI `spring-cloud` extension version lower than 3.0.0, and you want to upgrade the extension version or migrate to the `spring` extension. You should take care of the following output update.

- `az spring app` command output: Remove `properties.activeDeploymentName`. Use `properties.activeDeployment.name` instead.
- `az spring app` command output: Remove `properties.createdTime`. Use `systemData.createdAt` instead.
- `az spring app` command output: Remove `properties.activeDeployment.properties.deploymentSettings.cpu`. Use `properties.activeDeployment.properties.deploymentSettings.resourceRequests.cpu` instead.
- `az spring app` command output: Remove `properties.activeDeployment.properties.deploymentSettings.memoryInGB`. Use `properties.activeDeployment.properties.deploymentSettings.resourceRequests.memory` instead.
- `az spring app` command output: Remove `properties.activeDeployment.properties.deploymentSettings.jvmOptions`. Use `properties.activeDeployment.properties.source.jvmOptions` instead.
- `az spring app` command output: Remove `properties.activeDeployment.properties.deploymentSettings.runtimeVersion`. Use `properties.activeDeployment.properties.source.runtimeVersion` instead.
- `az spring app` command output: Remove `properties.activeDeployment.properties.deploymentSettings.netCoreMainEntryPath`. Use `properties.activeDeployment.properties.source.netCoreMainEntryPath` instead.
