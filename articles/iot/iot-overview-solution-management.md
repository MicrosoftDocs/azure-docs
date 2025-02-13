---
title: Manage your IoT solution
description: An overview of the management options for an IoT solution such as the Azure portal and ARM templates.
ms.service: azure-iot
services: iot
author: dominicbetts
ms.author: dobett
ms.topic: overview
ms.date: 01/23/2025
ms.custom: template-overview, devx-track-azurecli, devx-track-bicep
# Customer intent: As a solution builder, I want a high-level overview of the options for managing an IoT solution so that I can easily find relevant content for my scenario.
---

# Manage your IoT solution

This overview introduces the key concepts around the options to manage an Azure IoT solution. Each section includes links to content that provides further detail and guidance.

# [Edge-based solution](#tab/edge)

The following diagram shows a high-level view of the components in a typical IoT solution. This article focuses on the areas relevant to managing an IoT solution:

:::image type="content" source="media/iot-overview-solution-management/iot-edge-solution-management-architecture.svg" alt-text="Diagram that shows the high-level IoT solution architecture highlighting solution management areas." border="false":::

# [Cloud-based solution](#tab/cloud)

The following diagram shows a high-level view of the components in a typical IoT solution. This article focuses on the areas relevant to managing an IoT solution

:::image type="content" source="media/iot-overview-solution-management/iot-cloud-solution-management-architecture.svg" alt-text="Diagram that shows the high-level IoT solution architecture highlighting solution management areas." border="false":::

---

There are many options for managing your IoT solution including the Azure portal, PowerShell, and ARM templates. This article summarizes the main options.

To learn about securing your IoT solution, see [Secure your IoT solution](iot-overview-security.md).

## Monitoring

# [Edge-based solution](#tab/edge)

Solution monitoring in an edge-based solution involves monitoring both your edge and cloud environments. Azure IoT Operations observability capabilities let you monitor your edge environment using cloud-based tools enabling end-to-end monitoring of your IoT solution.

To learn more, see [Deploy observability resources and set up logs](../iot-operations/configure-observability-monitoring/howto-configure-observability.md).

# [Cloud-based solution](#tab/cloud)

While there are tools specifically for [monitoring devices](iot-overview-device-management.md#device-monitoring) in your IoT solution, you also need to be able to monitor the health of your IoT services:

| Service | Monitoring options |
|---------|--------------------|
| IoT Hub | [Use Azure Monitor to monitor your IoT hub](../iot-hub/monitor-iot-hub.md) </br> [Check IoT Hub service and resource health](../iot-hub/iot-hub-azure-service-health-integration.md) |
| Device Provisioning Service (DPS) | [Use Azure Monitor to monitor your DPS instance](../iot-dps/monitor-iot-dps.md) |
| IoT Edge | [Use Azure Monitor to monitor your IoT Edge fleet](../iot-edge/how-to-collect-and-transport-metrics.md) </br> [Monitor IoT Edge deployments](../iot-edge/how-to-monitor-iot-edge-deployments.md) |
| IoT Central | [Use audit logs to track activity in your IoT Central application](../iot-central/core/howto-use-audit-logs.md) </br> [Use Azure Monitor to monitor your IoT Central application](../iot-central/core/howto-manage-and-monitor-iot-central.md#monitor-application-health) |
| Azure Digital Twins | [Use Azure Monitor to monitor Azure Digital Twins resources](../digital-twins/how-to-monitor.md) |

---

To learn more about the Azure Monitor service, see [Azure Monitor overview](/azure/azure-monitor/overview).

## Azure portal

The Azure portal offers a consistent GUI environment for managing your Azure IoT services. For example, you can use the portal to:

# [Edge-based solution](#tab/edge)

| Action | Links |
|--------|-------|
| Deploy instances to your Kubernetes cluster| [Deploy Azure IoT Operations to an Arc-enabled Kubernetes cluster](../iot-operations/deploy-iot-ops/howto-deploy-iot-operations.md) |
| Configure services | [Configure MQTT broker authentication](../iot-operations/manage-mqtt-broker/howto-configure-authentication.md?tabs=portal) |

# [Cloud-based solution](#tab/cloud)

| Action | Links |
|--------|-------|
| Deploy service instances in your Azure subscription | [Manage your IoT hubs](../iot-hub/iot-hub-create-through-portal.md) </br>[Set up DPS](../iot-dps/quick-setup-auto-provision.md) </br> [Manage IoT Central applications](../iot-central/core/howto-manage-and-monitor-iot-central.md) </br> [Set up an Azure Digital Twins instance](../digital-twins/how-to-set-up-instance-portal.md) |
| Configure services | [Create and delete routes and endpoints (IoT Hub)](../iot-hub/how-to-routing-portal.md) </br> [Deploy IoT Edge modules](../iot-edge/how-to-deploy-at-scale.md) </br> [Configure file uploads (IoT Hub)](../iot-hub/iot-hub-configure-file-upload.md) </br> [Manage device enrollments (DPS)](../iot-dps/how-to-manage-enrollments.md) </br> [Manage allocation policies (DPS)](../iot-dps/how-to-use-allocation-policies.md) |

---

## ARM templates and Bicep

To implement infrastructure as code for your Azure IoT solutions, use Azure Resource Manager templates (ARM templates). The template is a JavaScript Object Notation (JSON) file that defines the infrastructure and configuration for your project. Bicep is a language that offers the same capabilities as ARM templates but with a syntax that's easier to use.

For example, you can use ARM templates or Bicep to:

# [Edge-based solution](#tab/edge)

| Action | Links |
|--------|-------|
| Manage services | [Configure MQTT broker authentication](../iot-operations/manage-mqtt-broker/howto-configure-authentication.md?tabs=bicep) </br> [Configure data flows in Azure IoT Operations](../iot-operations/connect-to-cloud/howto-create-dataflow.md?tabs=bicep) |

For ARM templates and Bicep reference documentation, see:

- [IoT Operations](/azure/templates/microsoft.iotoperations/instances)
- [IoT Operations MQTT broker](/azure/templates/microsoft.iotoperations/instances/brokers)
- [IoT Operations data flows](/azure/templates/microsoft.iotoperations/instances/dataflowprofiles/dataflows)

# [Cloud-based solution](#tab/cloud)

| Action | Links |
|--------|-------|
| Deploy service instances in your Azure subscription | [Create an IoT hub](../iot-hub/iot-hub-rm-template-powershell.md) </br> [Set up DPS](../iot-dps/quick-setup-auto-provision-bicep.md) |
| Manage services | [Create and delete routes and endpoints (IoT Hub)](../iot-hub/how-to-routing-arm.md) </br> [Azure Resource Manager SDK samples (IoT Central)](https://github.com/Azure-Samples/azure-iot-central-arm-sdk-samples) |

For ARM templates and Bicep reference documentation, see:

- [IoT Hub](/azure/templates/microsoft.devices/iothubs)
- [DPS](/azure/templates/microsoft.devices/provisioningservices)
- [Device update for IoT Hub](/azure/templates/microsoft.deviceupdate/accounts)
- [IoT Central](/azure/templates/microsoft.iotcentral/iotapps)

---

## CLI

Use CLI tools such as the Azure CLI or PowerShell to automate the management of your IoT solution:

# [Edge-based solution](#tab/edge)

### Azure CLI

| Action | Links |
|--------|-------|
| Deploy service instances in your Kubernetes cluster | [Prepare your Azure Arc-enabled Kubernetes cluster](../iot-operations/deploy-iot-ops/howto-prepare-cluster.md) </br> [Deploy Azure IoT Operations to an Arc-enabled Kubernetes cluster](../iot-operations/deploy-iot-ops/howto-deploy-iot-operations.md) |
| Manage services | [Manage the lifecycle of an Azure IoT Operations instance](../iot-operations/deploy-iot-ops/howto-manage-update-uninstall.md) </br> [Upgrade or rollback between versions](../iot-operations/deploy-iot-ops/howto-upgrade.md) |

For Azure CLI reference documentation, see [`az iot ops`](/cli/azure/iot/ops).

# [Cloud-based solution](#tab/cloud)

### PowerShell

| Action | Links |
|--------|-------|
| Deploy service instances in your Azure subscription | [Create an IoT hub using the New-AzIotHub cmdlet](../iot-hub/iot-hub-create-using-powershell.md) </br> [Create an IoT Central application](../iot-central/core/howto-create-iot-central-application.md?tabs=azure-powershell) |
| Manage services | [Create and delete routes and endpoints (IoT Hub)](../iot-hub/how-to-routing-powershell.md) </br> [Manage an IoT Central application](../iot-central/core/howto-manage-and-monitor-iot-central.md?tabs=azure-powershell) |

For PowerShell reference documentation, see:

- [Az.IotHub](/powershell/module/az.iothub/) module
- [Az.IotCentral](/powershell/module/az.iothub/) module
- [PowerShell functions for IoT Edge for Linux on Windows](../iot-edge/reference-iot-edge-for-linux-on-windows-functions.md)

### Azure CLI

Use the Azure CLI to automate the management of your IoT solution. For example, you can use the Azure CLI to:

| Action | Links |
|--------|-------|
| Deploy service instances in your Azure subscription | [Create an IoT hub using the Azure CLI](../iot-hub/iot-hub-create-using-cli.md) </br> [Create an IoT Central application](../iot-central/core/howto-create-iot-central-application.md) </br> [Set up an Azure Digital Twins instance](../digital-twins/how-to-set-up-instance-cli.md) </br> [Set up DPS](../iot-dps/quick-setup-auto-provision-cli.md) |
| Manage services | [Create and delete routes and endpoints (IoT Hub)](../iot-hub/how-to-routing-azure-cli.md) </br> [Deploy and monitor IoT Edge modules at scale](../iot-edge/how-to-deploy-cli-at-scale.md) </br> [Manage an IoT Central application](../iot-central/core/howto-manage-and-monitor-iot-central.md) </br> [Create an Azure Digital Twins graph](../digital-twins/tutorial-command-line-cli.md) |

For Azure CLI reference documentation, see:

- [`az iot hub`](/cli/azure/iot/hub)
- [`az iot device` (IoT Hub)](/cli/azure/iot/device)
- [`az iot edge`](/cli/azure/iot/edge)
- [`az iot dps`](/cli/azure/iot/dps)
- [`az iot central`](/cli/azure/iot/central)
- [`az iot du` (Azure Device Update)](/cli/azure/iot/du)
- [`az dt` (Azure Digital Twins)](/cli/azure/dt)

---

## Azure DevOps tools

Use Azure DevOps tools to automate the management of your IoT solution. For example, you can use Azure DevOps tools to enable:

- [Continuous integration and continuous deployment to Azure IoT Edge devices](../iot-edge/how-to-continuous-integration-continuous-deployment.md)
- [Integration of IoT Central with Azure Pipelines for CI/CD](../iot-central/core/howto-integrate-with-devops.md)
