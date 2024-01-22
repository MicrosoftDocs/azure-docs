---
title: Take a tour of the Azure IoT Central API
description: Become familiar with the key areas of the Azure IoT Central REST API. Use the API to create, manage, and use your IoT solution from client applications.
author: dominicbetts
ms.author: dobett
ms.date: 06/12/2023
ms.topic: overview
ms.service: iot-central
services: iot-central
---

# Take a tour of the Azure IoT Central API

This article introduces you to Azure IoT Central REST API. Use the API to create client applications that can create, manage, and use an IoT Central application and its connected devices. The extensibility surface enabled by the IoT Central REST API lets you integrate IoT insights and device management capabilities into your existing dashboards and business applications.

The REST API operations are grouped into the:

- *Data plane* operations that let you work with resources inside IoT Central applications. Data plane operations let you automate tasks that can also be completed using the IoT Central UI. Currently, there are [generally available](/rest/api/iotcentral/2022-07-31dataplane/api-tokens) and [preview](/rest/api/iotcentral/2022-10-31-previewdataplane/api-tokens) versions of the data plane API.
- *Control plane* operations that let you work with the Azure resources associated with IoT Central applications. Control plane operations let you automate tasks that can also be completed in the Azure portal.

## Data plane operations

Version 2022-07-31 of the data plane API lets you manage the following resources in your IoT Central application:

- API tokens
- Device groups
- Device templates
- Devices
- Enrollment groups
- File uploads
- Jobs
- Organizations
- Roles
- Scheduled jobs
- Users

The preview devices API also lets you [manage dashboards](howto-manage-dashboards-with-rest-api.md), [manage deployment manifests](howto-manage-deployment-manifests-with-rest-api.md), and [manage data exports](howto-manage-data-export-with-rest-api.md).

To get started with the data plane APIs, see [Tutorial: Use the REST API to manage an Azure IoT Central application](tutorial-use-rest-api.md).

## Control plane operations

Version 2021-06-01 of the control plane API lets you manage the IoT Central applications in your Azure subscription. To learn more, see the [Control plane overview](/rest/api/iotcentral/2021-06-01controlplane/apps).

## Next steps

Now that you have an overview of Azure IoT Central and are familiar with the capabilities of the IoT Central REST API, the suggested next step is to complete the [Tutorial: Use the REST API to manage an Azure IoT Central application](tutorial-use-rest-api.md).
