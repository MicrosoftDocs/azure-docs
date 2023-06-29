---
title: How to migrate an IoT hub
titleSuffix: Azure IoT Hub
description: Use the Azure CLI iot hub state command group to migrate an IoT hub to a new region, a new tier, or a new configuration
author: kgremban

ms.author: kgremban
ms.service: iot-hub
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.date: 04/14/2023
---

# How to automatically migrate an IoT hub using the Azure CLI

Use the Azure CLI to migrate an IoT hub to a new region, a new tier, or a new configuration.

The steps in this article are useful if you want to:

* Upgrade from the free tier to a basic or standard tier IoT hub.
* Move an IoT hub to a new region.
* Export IoT hub state information to have as a backup.
* Increase the number of [partitions](iot-hub-scaling.md#partitions) for an IoT hub.
* Set up a hub for a development, rather than production, environment.

## Compare automatic and manual migration steps

The outcome of this article is similar to [How to migrate an Azure IoT hub using Azure Resource Manager templates](iot-hub-how-to-clone.md), but with a different process. Before you begin, decide which process is right for your scenario.

* The Azure CLI process (this article):

  * Migrates your device registry, your routing and endpoint information, and other configuration details like IoT Edge deployments or automatic device management configurations.
  * Is easier for migrating small numbers of devices (for example, up to 10,000).
  * Doesn't require an Azure Storage account.
  * Collects connection strings for routing and file upload endpoints and includes them in the ARM template output.

* The manual process:

  * Migrates your device registry and your routing and endpoint information. You have to manually recreate other configuration details in the new IoT hub.
  * Is faster for migrating large numbers of devices (for example, more than 100,000).
  * Uses an Azure Storage account to transfer the device registry.
  * Scrubs connection strings for routing and file upload endpoints from the ARM template output, and you need to manually add them back in.

## Prerequisites

* Azure CLI

  The features described in this article require version 0.20.0 or newer of the **azure-iot** extension. To check your extension version, run `az --version`. To update your extension, run `az extension update --name azure-iot`.

  If you still have the legacy **azure-cli-iot-ext** extension installed, remove that extension before adding the **azure-iot** extension.

## IoT hub state

When we talk about migrating the state of an IoT hub, we're referring to a combination of three aspects:

* **Azure Resource Manager (ARM) resources.** This aspect is everything that can be defined in a resource template, and is the same information you'd get if you exported the resource template from your IoT hub in the Azure portal. Information captured as part of the Azure Resource Manager aspect includes:

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

Use the [az iot hub state export](/cli/azure/iot/hub/state#az-iot-hub-state-export) command to export the state of an IoT hub to a JSON file.

If you want to run both the export and import steps in one command, refer to the section later in this article to [Migrate an IoT hub](#migrate-an-iot-hub).

When you export the state of an IoT hub, you can choose which aspects to export.

| Parameter | Details |
| --------- | ------- |
| `--aspects` | The state aspects to export. Specify one or more of the accepted values: **arm**, **configurations**, or **devices**. If this parameter is left out, then all three aspects are exported. |
| `--state-file -f` | The path to the file where the state information is written. |
| `--replace -r` | If this parameter is included, then the export command overwrites the contents of the state file. |
| `--hub-name -n`<br>**or**<br>`--login -l` | The name of the origin IoT hub (`-n`) or the connection string for the origin IoT hub (`-l`). If both are provided, then the connection string takes priority. |
| `--resource-group -g` | The name of the resource group for the origin IoT hub. |

The following example exports all aspects of an IoT hub's state to a file named **myHub-state**:

```azurecli
az iot hub state export --hub-name myHub --state-file ./myHub-state.json
```

The following example exports only the devices and Azure Resource Manager aspects of an IoT hub's state, and overwrites the content of the existing file:

```azurecli
az iot hub state export --hub-name myHub --state-file ./myHub-state.json --aspects arm devices --replace
```

### Export endpoints

If you choose to export the Azure Resource Manager aspect of an IoT hub, the export command retrieves the connection strings for any endpoints that have key-based authentication and include them in the output ARM template.

The export command also checks all endpoints to verify that the resource it connects to still exists. If not, then that endpoint and any routes using that endpoint aren't exported.

## Import the state of an IoT hub

Use the [az iot hub state import](/cli/azure/iot/hub/state#az-iot-hub-state-import) command to import state information from an exported file to a new or existing IoT hub.

If you want to run both the export and import steps in one command, refer to the section later in this article to [Migrate an IoT hub](#migrate-an-iot-hub).

| Parameter | Details |
| --------- | ------- |
| `--aspects` | The state aspects to import. Specify one or more of the accepted values: **arm**, **configurations**, or **devices**. If this parameter is left out, then all three aspects are imported. |
| `--state-file -f` | The path to the exported state file. |
| `--replace -r` | If this parameter is included, then the import command deletes the current state of the destination hub. |
| `--hub-name -n`<br>**or**<br>`--login -l` | The name of the destination IoT hub (`-n`) or the connection string for the destination IoT hub (`-l`). If both are provided, then the connection string takes priority. |
| `--resource-group -g` | The name of the resource group for the destination IoT hub. |

The following example imports all aspects to a new IoT hub, which is created if it doesn't already exist:

```azurecli
az iot hub state import --hub-name myNewHub --state-file ./myHub-state.json
```

The following example imports only the devices and configurations aspects to a new IoT hub, which must exist already, and overwrites any existing devices and configurations:

```azurecli
az iot hub state import --hub-name myNewHub --state-file ./myHub-state.json --aspects devices configurations --replace
```

### Create a new IoT hub with state import

You can use the `az iot hub state import` command to create a new IoT hub or to write to an existing IoT hub.

If you want to create a new IoT Hub, then you must include the `arm` aspect in the import command. If `arm` isn't included in the command, and the destination hub doesn't exist, then the import command fails.

If the destination hub doesn't exist, then the `--resource-group` parameter is also required for the import command.

### Update an existing IoT hub with state import

If the destination IoT hub already exists, then the `arm` aspect isn't required for the `az iot hub state import` command. If you do include the `arm` aspect, all the resource properties will be overwritten except for the following properties that can't be changed after hub creation:

* Location
* SKU
* Built-in Event Hubs partition count
* Data residency
* Features

If the `--resource-group` is specified in the import command and is different than IoT hub's current resource group, then the command fails because it attempts to create a new hub with the same name as the one that already exists.

If you include the `--replace` flag in the import command, then the following IoT hub aspects are removed from the destination hub before the hub state is uploaded:

* **ARM**: Any uploaded certificates on the destination hub are deleted. If a certificate is present, it needs an etag to be updated.
* **Devices**: All devices and modules, edge and non-edge, are deleted.
* **Configurations**: All ADM configurations and IoT Edge deployments are deleted.

## Migrate an IoT hub

Use the [az iot hub state migrate](/cli/azure/iot/hub/state#az-iot-hub-state-migrate) command to migrate the state of one IoT hub to a new or existing IoT hub.

This command wraps the export and import steps into a single command, but has no output files. All of the guidance and limitations described in the [Export the state of an IoT hub](#export-the-state-of-an-iot-hub) and [Import the state of an IoT hub](#import-the-state-of-an-iot-hub) sections apply to the `state migrate` command as well.

If you're migrating a device registry with many devices (for example, a few hundred or a few thousand) you may find it easier and faster to run the export and import commands separately rather than running the migrate command.

| Parameter | Details |
| --------- | ------- |
| `--aspects` | The state aspects to migrate. Specify one or more of the accepted values: **arm**, **configurations**, or **devices**. If this parameter is left out, then all three aspects are migrated. |
| `--replace -r` | If this parameter is included, then the migrate command deletes the current state of the destination hub. |
| `--destination-hub --dh`<br>**or**<br>`--destination-hub-login --dl` | The name of the destination IoT hub (`--dh`) or the connection string for the destination IoT hub (`--dl`). If both are provided, then the connection string takes priority. |
| `--destination-resource-group --dg` | Name of the resource group for the destination IoT hub. The destination resource group is required if the destination hub doesn't exist. |
| `--origin-hub --oh`<br>**or**<br>`--origin-hub-login --ol` | The name of the origin IoT hub (`--oh`) or the connection string for the origin IoT hub (`--ol`). If both are provided, then the connection string takes priority. Use the connection string to avoid having to sign in to the Azure CLI session.  |
| `--origin-resource-group --og` | The name of the resource group for the origin IoT hub. |

The following example migrates all aspects of the origin hub to the destination hub, which is created if it doesn't exist:

```azurecli
az iot hub state migrate --origin-hub myHub --origin-resource-group myGroup  --destination-hub myNewHub --destination-resource-group myNewGroup
```

## Troubleshoot a migration

If you can't export or import devices or configurations, check that you have access to those properties. One way to verify your access is by running the `az iot hub device-identity list` or `az iot hub configuration list` commands.

If the `az iot hub state migrate` command fails, try running the export and import commands separately. The two commands result in the same functionality as the migrate command alone, but by running them separately you can review the state files that are created from the export command.

## Next steps

For more information about performing bulk operations against the identity registry in an IoT hub, see [Import and export IoT Hub device identities](./iot-hub-bulk-identity-mgmt.md).
