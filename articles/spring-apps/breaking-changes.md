---
title: Azure Spring Apps API breaking changes
description: Describes the breaking changes introduced by the latest Azure Spring Apps stable API version.
author: KarlErickson
ms.author: yuwzho
ms.service: spring-apps
ms.topic: how-to
ms.date: 05/25/2022
ms.custom: devx-track-java, devx-track-azurecli
---

# Azure Spring Apps API breaking changes

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Basic/Standard ✔️ Enterprise

This article describes breaking changes introduced into the Azure Spring Apps API.

The Azure Spring Apps service releases the new stable API version 2022-04-01. The new API version introduces breaking changes based on the previous stable API version 2020-07-01. We suggest that you update your API calls to the new API version.

## Previous API deprecation date

The previous API version 2020-07-01 will not be supported starting April, 2025.

## API breaking changes from 2020-07-01 to 2022-04-01

### Deprecate number value CPU and MemoryInGB in Deployments

Deprecate field `properties.deploymentSettings.cpu` and `properties.deploymentSettings.memoryInGB` in the `Spring/Apps/Deployments` resource. Use `properties.deploymentSettings.resourceRequests.cpu` and `properties.deploymentSettings.resourceRequests.memory` instead.

### RBAC role change for blue-green deployment

Deprecate field `properties.activeDeploymentName` in the `Spring/Apps` resource. Use `POST/SUBSCRIPTIONS/RESOURCEGROUPS/PROVIDERS/MICROSOFT.APPPLATFORM/SPRING/APPS/SETACTIVEDEPLOYMENTS` for blue-green deployment. This action needs a separate RBAC role `spring/apps/setActiveDeployments/action` to perform.

### Move options from different property bags for the Spring/Apps/Deployments resource

- Deprecate `properties.createdTime`. Use `systemData.createdAt`.
- Deprecate `properties.deploymentSettings.jvmOptions`. Use `properties.source.jvmOptions`.
- Deprecate `properties.deploymentSettings.jvmOptions`. Use `properties.source.runtimeVersion`.
- Deprecate `properties.deploymentSettings.netCoreMainEntryPath`. Use `properties.source.netCoreMainEntryPath`.
- Deprecate `properties.appName`, which you can extract from `id`.

## Updates in the Azure CLI extension

### Add new RBAC role for blue-green deployment

You need to add RBAC role `spring/apps/setActiveDeployments/action` to perform the following Azure CLI commands:

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

### Output updates

If you're using the Azure CLI `spring-cloud` extension with a version lower than 3.0.0, and you want to upgrade the extension version or migrate to the `spring` extension, then you should take care of the following output updates.

- `az spring app` command output: Remove `properties.activeDeploymentName`. Use `properties.activeDeployment.name` instead.
- `az spring app` command output: Remove `properties.createdTime`. Use `systemData.createdAt` instead.
- `az spring app` command output: Remove `properties.activeDeployment.properties.deploymentSettings.cpu`. Use `properties.activeDeployment.properties.deploymentSettings.resourceRequests.cpu` instead.
- `az spring app` command output: Remove `properties.activeDeployment.properties.deploymentSettings.memoryInGB`. Use `properties.activeDeployment.properties.deploymentSettings.resourceRequests.memory` instead.
- `az spring app` command output: Remove `properties.activeDeployment.properties.deploymentSettings.jvmOptions`. Use `properties.activeDeployment.properties.source.jvmOptions` instead.
- `az spring app` command output: Remove `properties.activeDeployment.properties.deploymentSettings.runtimeVersion`. Use `properties.activeDeployment.properties.source.runtimeVersion` instead.
- `az spring app` command output: Remove `properties.activeDeployment.properties.deploymentSettings.netCoreMainEntryPath`. Use `properties.activeDeployment.properties.source.netCoreMainEntryPath` instead.
