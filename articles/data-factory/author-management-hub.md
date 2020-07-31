---
title: Management hub
description: Manage your connections, source control configuration and global authoring properties in the Azure Data Factory management hub
services: data-factory
ms.service: data-factory
ms.workload: data-services
ms.topic: conceptual
author: djpmsft
ms.author: daperlov
manager: anandsub
ms.date: 06/02/2020
---

# Management hub in Azure Data Factory

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

The management hub, accessed by the *Manage* tab in the Azure Data Factory UX, is a portal that hosts global management actions for your data factory. Here, you can manage your connections to data stores and external computes, source control configuration, and trigger settings.

## Manage connections

### Linked services

Linked services define the connection information for Azure Data Factory to connect to external data stores and compute environments. For more information, see [linked services concepts](concepts-linked-services.md). Linked service creation, editing, and deletion is done in the management hub.

![Manage linked services](media/author-management-hub/management-hub-linked-services.png)

### Integration runtimes

An integration runtime is a compute infrastructure used by Azure Data Factory to provide data integration capabilities across different network environments. For more information, learn about [integration runtime concepts](concepts-integration-runtime.md). In the management hub, you can create, delete, and monitor your integration runtimes.

![Manage integration runtimes](media/author-management-hub/management-hub-integration-runtime.png)

## Manage source control

### Git configuration

View and edit your configured git repository settings in the management hub. For more information, learn about [source control in Azure Data Factory](source-control.md).

![Manage git repo](media/author-management-hub/management-hub-git.png)

### Parameterization template

To override the generated Resource Manager template parameters when publishing from the collaboration branch, you can generate or edit a custom parameters file. For more information, learn how to [use custom parameters in the Resource Manager template](continuous-integration-deployment.md#use-custom-parameters-with-the-resource-manager-template). The parameterization template is only available when working in a git repository. If the *arm-template-parameters-definition.json* file doesn't exist in the working branch, editing the default template will generate it.

![Manage custom params](media/author-management-hub/management-hub-custom-parameters.png)

## Manage authoring

### Triggers

Triggers determine when a pipeline run should be kicked off. Currently triggers can be on a wall clock schedule, operate on a periodic interval, or depend on an event. For more information, learn about [trigger execution](concepts-pipeline-execution-triggers.md#trigger-execution). In the management hub, you can create, edit, delete, or view the current state of a trigger.

![Manage custom params](media/author-management-hub/management-hub-triggers.png)

## Next steps

Learn how to [configure a git repository](source-control.md) to your ADF


