---
title: Azure Device Update for IoT Hub apt manifest
description: Understand how Azure Device Update for IoT Hub uses the apt manifest for a package-based update.
author: andrewbrownmsft
ms.author: andbrown
ms.date: 01/21/2025
ms.topic: concept-article
ms.service: azure-iot-hub
ms.subservice: device-update
---


# Azure Device Update for IoT Hub apt manifest

This article describes the apt manifest, a JSON file that describes update details required by the apt update handler. You can import this file into Device Update just like any other update. For more information, see [Import an update to Device Update](import-update.md).

When you deliver an apt manifest to a Device Update agent as an update, the agent processes the manifest and carries out the necessary operations. These operations include downloading and installing the packages specified in the apt manifest file and their dependencies from a designated repository.

Device Update supports the apt update type and [update handler](device-update-agent-overview.md#update-handlers). This support allows the Device Update agent to evaluate the installed Debian packages and update the necessary packages.

You can use an apt manifest to update the Device Update agent itself and its dependencies. List the device update agent name and desired version in the apt manifest as you would any other package. You can then import this apt manifest and deploy it through the Device Update pipeline.

## Schema

An apt manifest file is a JSON file with a versioned schema.

```json
{
    "name": "<name>",
    "version": "<version>",
    "packages": [
        {
            "name": "<package name>",
            "version": "<version specifier>"
        }
    ]
}
```

For example:

```json
{
    "name": "contoso-iot-edge",
    "version": "1.0.0.0",
    "packages": [
        {
            "name" : "thermocontrol",
            "version" : "1.0.1"
        },
        {
            "name" : "tempreport",
            "version" : "2.0.0"
        }
    ]
}
```

Each apt manifest includes the following properties:

- **Name**: A name for this apt manifest, which can be any meaningful name or ID that fits your scenario. For example, `contoso-iot-edge`.
- **Version**: A version number for this apt manifest, for example `1.0.0.0`.
- **Packages**: A list of objects containing package-specific properties.
  - **Name**: The package name or ID, for example `iotedge`.
  - **Version**: The desired package version criteria, for example, `1.0.8-2`.

### Versioning

The apt manifest supports only exact version numbers. The version number is the desired Debian package version in format `<epoch>:<upstream_version>-<debian_revision>`, where `epoch` is an unsigned int and `upstream_version` starts with a digit and can include alphanumerics and characters such as `.`, `,`, `+`, `-`, and `~`. The version value shouldn't contain an equal sign.

For example, `"name":"iotedge"` and `"version":"1.0.8-2"` is equivalent to installing a package using command `apt-get install iotedge=1.0.8-2`. Version `1.0.8` is equal to `1.0.8-0`.

If version is omitted, Device Update installs the latest available version of the specified package. For more information about how Debian packages are versioned, see the [Debian policy manual](https://www.debian.org/doc/debian-policy/ch-controlfields.html#s-f-version).

> [!NOTE]
> The apt package manager ignores versioning requirements given by a package when the dependent packages to install are being automatically resolved. Unless explicit versions of dependent packages are given they use the latest, even though the package itself may specify a strict requirement (=) on a given version. This automatic resolution can lead to errors regarding an unmet dependency.
> 
> Therefore, when you install a specific version of a package, it's best to also include the explicit versions of the dependent packages to install. For more information, see [apt-get not properly resolving a dependency on a fixed version in a Debian/Ubuntu package](https://unix.stackexchange.com/questions/350192/apt-get-not-properly-resolving-a-dependency-on-a-fixed-version-in-a-debian-ubunt).

If you update a specific version of the Azure IoT Edge security daemon, you should include the desired version of the `aziot-edge` package and its dependent `aziot-identity-service` package in your apt manifest. For more information, see [How to update IoT Edge](../iot-edge/how-to-update-iot-edge.md#update-the-security-subsystem).

## Installed criteria

The recommended installed criteria value for an apt manifest is `<name>-<version>`, where `<name>` is the name of the apt manifest and `<version>` is its version. For example, `contoso-iot-edge-1.0.0.0`.

## Package removal

You can also use an apt manifest to remove installed packages from devices. You can use a single apt manifest to remove, add, and update multiple packages.

To remove a package, add a minus sign `-` after the package name. Don't include a version number for the packages you're removing. Removing a package through an apt manifest doesn't remove its dependencies and configurations.

For example, the following apt manifest removes the package `contoso1` from any devices it's deployed to.


```json
{
    "name": "contoso-video",
    "version": "2.0.0.1",
    "packages": [
        {
            "name" : "contoso1-"
        }
    ]
}
```

## Apt manifest creation guidelines

Keep the following guidelines in mind when you create an apt manifest:

- Ensure that the apt manifest is a well-formed JSON file.
- Give each apt manifest a unique version. Try to come up with a standardized methodology to increment the version of the apt manifest, so it makes sense for your scenarios and is easy to follow.
- For the desired state of each individual package, specify the exact name and version of the package you want to install on your device. Always validate the values against the contents of the source package repository.
- List the packages in the apt manifest in the order they should be installed or removed.
- Always validate the installation of packages on a test device to ensure the desired outcome.
- When you install a specific version of a package, for example `iotedge 1.0.9-1`, also include the explicit versions of the dependent packages to install, for example `libiothsm 1.0.9-1`.
- While not required, always making your apt manifest cumulative avoids getting devices into an unknown state. A cumulative update ensures that your devices have the desired version of every relevant package, even if the device skipped an update because of installation failure or being offline.

  For example, consider the following base apt manifest:

  ```JSON
  {
      "name": "contoso-iot-edge",
      "version": "1.0",
      "packages": [
          {
              "name": "contoso1",
              "version": "1.0.1"
          }
      ]
  }
  ```

  The following version 2.0 update includes the `contoso2` package, but not the `contoso1` package. All devices that receive the 2.0 update might not have the `contoso1` package.

  ```JSON
  {
      "name": "contoso-iot-edge",
      "version": "2.0",
      "packages": [
         {
              "name": "contoso2",
              "version": "3.0.2"
          }
      ]
  }
  ```

  The following version 2.0 cumulative update includes both the `contoso1` and `contoso2` packages:

  ```JSON
  {
      "name": "contoso-iot-edge",
      "version": "2.0",
      "packages": [
          {
              "name": "contoso1",
              "version": "1.0.1"
          },
          {
              "name": "contoso2",
              "version": "3.0.2"
          }
      ]
  }
  ```

## Related content

- [Import an update to Device Update](import-update.md)
- [Device Update import manifest concepts](import-concepts.md)

