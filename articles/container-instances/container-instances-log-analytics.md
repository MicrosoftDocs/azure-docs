---
title: Container instance logging with Azure Log Analytics
description: Learn how container instance output logs to Azure Log Analytics.
services: container-instances
author: mmacy
manager: jeconnoc

ms.service: container-instances
ms.topic: overview
ms.date: 06/06/2018
ms.author: marsma
---
# Container instance logging with Azure Log Analytics

Log Analytics workspaces provide a centralized location for storing and querying log and telemetry data from not only Azure resources, but also on premises resources and those in other clouds. Azure Container Instances includes built-in support for sending data to Log Analytics.

To send container instance data to Log Analytics, you must create a container group by using the Azure CLI (or Cloud Shell) and a YAML file; the following sections describe how.

## Prerequisites

* [Log Analytics workspace](../log-analytics/log-analytics-quick-create-workspace.md)
* [Azure CLI](/cli/azure/install-azure-cli) (or [Cloud Shell](/azure/cloud-shell/overview))

## Get Log Analytics credentials

To enable your container instances to send data to Log Analytics, you must provide the Log Analytics workspace ID and primary or secondary auth key when you create the container group.

To obtain the Log Analytics workspace ID and primary key:

1. Navigate to your Log Analytics workspace in the Azure portal
1. Under **SETTINGS**, select **Advanced settings**
1. Select **Connected Sources** > **Windows Servers** (or **Linux Servers**--the keys are identical for both)
1. Take note of:
   * **WORKSPACE ID**
   * **PRIMARY KEY**

## Create container group

Now that you have the workspace ID and primary key

## View logs in Log Analytics

TODO

## Next steps

* TODO

<!-- IMAGES -->

<!-- LINKS - External -->

<!-- LINKS - Internal -->