---
title: How to migrate an IoT hub
titleSuffix: Azure IoT Hub
description: Use the Azure CLI iot hub state command group to migrate an IoT hub to a new region, a new tier, or a new configuration
author: kgremban

ms.author: kgremban
ms.service: iot-hub
ms.topic: how-to
ms.date: 03/02/2023
---

# How to automatically migrate an IoT hub using the Azure CLI

Use the Azure CLI to migrate an IoT hub to a new region, a new tier, or a new configuration.

The steps in this article are useful if you want to:

* Upgrade from the free tier to a basic or standard tier IoT hub.
* Move an IoT hub to a new region.
* Export IoT hub state information to have as a backup.
* Increase the number of partitions for an IoT hub.

## Compare automatic and manual migration steps

The outcome of this article is similar to [How to clone an Azure IoT hub to another region](iot-hub-how-to-clone.md), but with a different process. Before you begin, decide which process is right for your scenario.

* The Azure CLI process:
  * Migrates your device registry, your routing and endpoint information, and additional configuration details like IoT Edge deployments or automatic device management configurations.
  * Is easier for migrating small numbers of devices (for example, up to 10,000).
  * Doesn't require an Azure Storage account.
  * Collects connection strings for routing and file upload endpoints and includes them in the ARM template output.
* The manual process:
  * Migrates your device registry and your routing and endpoint information. You have to manually recreate additional configuration details in the new IoT hub.
  * Is faster for migrating large numbers of devices (for example, more than 100,000).
  * Uses an Azure Storage account to transfer the device registry.
  * Scrubs connection strings for routing and file upload endpoints from the ARM template output, and you need to manually add them back in.

## Prerequisites

* Azure CLI

  The features described in this article require version 0.20.0 or newer of the **azure-iot** extension. To check your extension version, run `az version`. To update your extension, run `az extension update --name azure-iot`.

  If you still have the legacy **azure-cli-iot-ext** extension installed, remove that extension before adding the **azure-iot** extension.

## IoT Hub state

When we talk about migrating the state of an IoT hub, we're referring to a combination of three aspects:

* **Azure Resource Manager (ARM) resources.** This aspect is everything that can be defined in a resource template, and is the same information you'd get if you exported the resource template from your IoT hub in the Azure portal. Information captured as part of the ARM aspect includes:

  * Built-in event hub's retention time
  * Certificates
  * Cloud-to-device properties
  * Disable device SAS
  * Disable local auth
  * Enable file upload notifications
  * File upload storage endpoint
  * Identities
    * User-assigned identities
    * System-assigned identities (enabled or disabled)
  * Network rule sets
  * Routing
    * Custom endpoints
    * Fallback route
    * Routes
  * Tags

* **Configurations.** This aspect is for aspects of an IoT hub that aren't represented in an ARM template. Specifically, this aspect covers automatic device management configurations and IoT Edge deployments.

* **Devices.** This aspect represents the information in your device registry, which includes:

  * Device identities and twins
  * Module identities and twins

Any IoT Hub property or configuration not listed here may not be exported or imported correctly.

## Export the state of an IoT hub

Use the [az iot hub state export](/cli/azure/iot/hub/state#az-iot-hub-state-export) command to export the state of an IoT hub to a file.

If you want to run both the export and import steps in one command, refer to the section later in this article to [Migrate an IoT hub](#migrate-an-iot-hub).

When you export the state of an IoT hub, you can choose which aspects to export.

| Parameter | Details |
| --------- | ------- |
| `--aspects` | The state aspects to export. Specify one or more of the accepted values: **arm**, **configurations**, or **devices**. If this parameter is left out, then all three aspects will be exported. |
| `--state-file`, `-f` | The path to the file where the state information will be written. |
| `--replace`, `-r` | If this parameter is included, then the export command will overwrite the contents of the state file. |

### Export endpoints

If you choose to export the Azure Resource Manager aspect of an IoT hub, the export command will retrieve the connection strings for any endpoints that have key-based authentication and include them in the output ARM template.

The export command also checks all endpoints to verify that the resource it connects to still exists. If not, then that endpoint and any routes using that endpoint won't be exported.

## Import the state of an IoT hub

Use the [az iot hub state import](/cli/azure/iot/hub/state#az-iot-hub-state-import) command to import state information from an exported file to a new or existing IoT hub.

If you want to run both the export and import steps in one command, refer to the section later in this article to [Migrate an IoT hub](#migrate-an-iot-hub).

| Parameter | Details |
| --------- | ------- |
| `--aspects` | The state aspects to import. Specify one or more of the accepted values: **arm**, **configurations**, or **devices**. If this parameter is left out, then all three aspects will be imported. |
| `--state-file`, `-f` | The path to the exported state file. |
| `--replace`, `-r` | If this parameter is included, then the import command will delete the current state of the destination hub. |

## Migrate an IoT hub

Use the [az iot hub state migrate](/cli/azure/iot/hub/state#az-iot-hub-state-migrate) command to migrate the state of one IoT hub to a new or existing IoT hub.

This command wraps the export and import steps into a single command, and has no output files. If you are migrating a device registry with many devices (for example, a few hundred or a few thousand) you may find it easier and faster to run the export and import commands separately rather than running the migrate command.

| Parameter | Details |
| --------- | ------- |
| `--aspects` | The state aspects to migrate. Specify one or more of the accepted values: **arm**, **configurations**, or **devices**. If this parameter is left out, then all three aspects will be migrated. |
| `--replace`, `-r` | If this parameter is included, then the migrate command will delete the current state of the destination hub. |
| `--destination-hub`, `--dh` |  |
| `--destination-hub-login`, `--dl` |  |
| `--destination-resource-group`, `--dg` |  |
| `--origin-hub`, `--oh` |  |
| `--origin-hub-login`, `--ol` |  |
| `--origin-resource-group`, `--og` |  |

## Troubleshoot a migration

If you can't export or import devices or configurations, check that you have access to those properties. One way to verify this is by running the `az iot hub device-identity list` or `az iot hub configuration list` commands.

## Next steps
