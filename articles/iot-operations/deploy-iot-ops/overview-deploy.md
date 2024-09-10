---
title: Deployment overview
description: Learn about the components that are included in an Azure IoT Operations deployment and the different deployment options to consider for your scenario.
author: kgremban
ms.author: kgremban
ms.topic: conceptual
ms.custom:
ms.date: 09/10/2024

#CustomerIntent: As an IT professional, I want to understand the components and deployment details before I start using Azure IoT Operations.
---

# Deployment details

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

## Choose your features

Azure IoT Operations offers two deployment modes. You can choose to deploy with *test settings*, a basic subset of features that are simpler to get started with for evaluation scenarios. Or, you can choose to deploy with *secure settings*, the full feature set.

### Test settings

A deployment with only test settings enabled:

* Does not configure secrets or user-assigned managed identity capabilities.
* Is meant to enable the end-to-end quickstart sample for evaluation purposes, so does support the OPC PLC simulator and connect to cloud resources using system-assigned managed identity.
* Can be upgraded to use secure settings. For the steps to enable secrets and user-assigned managed identity, see [Manage secrets on your cluster](./howto-manage-secrets.md)

If you want to deploy Azure IoT Operations with test settings, follow these articles:

1. Start with [Quickstart: Run Azure IoT Operations Preview in GitHub Codespaces with K3s](../get-started-end-to-end-sample/quickstart-deploy.md).
1. Follow the rest of the articles in the end-to-end sample to test and evaluate Azure IoT Operations.
1. If you want to upgrade your Azure IoT Operations instance to use secure settings, follow the steps in [Manage secrets on your cluster](./howto-manage-secrets.md).

### Secure settings

A deployment with secure settings enabled:

* Includes the steps to enable secrets and user-assignment managed identity, which are important capabilities for developing a production-ready scenario. Secrets are used whenever Azure IoT Operations components connect to a resource outside of the cluster; for example, an OPC UA server or a dataflow source or destination endpoint.

If you want to deploy Azure IoT Operations with secure settings, follow these articles:

1. Start with [Prepare your Azure Arc-enabled Kubernetes cluster](./howto-prepare-cluster.md) to configure and Arc-enable your cluster.
1. Then, [Deploy Azure IoT Operations Preview](./howto-deploy-iot-operations.md).

## Included components

Azure IoT Operations is a suite of data services that run on Azure Arc-enabled edge Kubernetes clusters. It also depends on a set of support services that are also installed as part of a deployment.

* Azure IoT Operations core services
  * Dataflows
  * MQTT Broker
  * Connector for OPC UA

* Installed dependencies
  * [Azure Device Registry](../discover-manage-assets/overview-manage-assets.md#store-assets-as-azure-resources-in-a-centralized-registry)
  * [Azure Container Storage enabled by Azure Arc](../../azure-arc/container-storage/overview.md)

Using the installed dependencies might incur additional charges. Always refer to [Azure pricing](https://azure.microsoft.com/pricing/) for the latest information.

## Organize instances by using sites

Azure IoT Operations supports Azure Arc sites for organizing instances. A _site_ is a cluster resource in Azure like a resource group, but sites typically group instances by physical location and make it easier for OT users to locate and manage assets. An IT administrator creates sites and scopes them to a subscription or resource group. Then, any Azure IoT Operations deployed to an Arc-enabled cluster is automatically collected in the site associated with its subscription or resource group

For more information, see [What is Azure Arc site manager (preview)?](../../azure-arc/site-manager/overview.md)


## Next steps

[Prepare your Azure Arc-enabled Kubernetes cluster](./howto-prepare-cluster.md) to configure and Arc-enable a cluster for Azure IoT Operations.