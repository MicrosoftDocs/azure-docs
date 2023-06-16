---
title: Understand Device Update for Azure IoT Hub apt manifest
description: Understand how Device Update for IoT Hub uses apt manifest for a package-based update.
author: vimeht
ms.author: vimeht
ms.date: 2/17/2021
ms.topic: concept-article
ms.service: iot-hub-device-update
---


# Device Update apt manifest

The apt manifest is a JSON file that describes an update details required by apt update handler. This file can be imported into Device Update for IoT Hub just like any other update.

For more information, see [Import an update to Device Update for IoT Hub](import-update.md).

## Overview

When an apt manifest is delivered to a Device Update agent as an update, the agent processes the manifest and carries out the necessary operations. These operations include downloading and installing the packages specified in the apt manifest file and their dependencies from a designated repository.

Device Update supports apt updateType and apt [update handler](device-update-agent-overview.md#update-handlers). This support allows the Device Update agent to evaluate the installed Debian packages and update the necessary packages.

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

* **Name**: The name for this apt manifest. This can be whatever name or ID is meaningful for your scenarios. For example, `contoso-iot-edge`.
* **Version**: A version number for this apt Manifest. For example, `1.0.0.0`.
* **Packages**: A list of objects containing package-specific properties.
  * **Name**: The name or ID of the package. For example, `iotedge`.
  * **Version**: The desired version criteria for the package. For example, `1.0.8-2`. The version value shouldn't contain an equal sign. If version is omitted, the latest available version of specified package will be installed.

Currently only exact version number is supported. The version number is the desired Debian package version in format **[epoch:]upstream_version[-debian_revision]**, where **epoch** is an unsigned int and **upstream_version** can include alphanumerics and characters such as ".","+","-" and "~". It should start with a digit.

> [!NOTE]
> '1.0.8' is equal to '1.0.8-0'

For example, `"name":"iotedge"` and `"version":"1.0.8-2"` is equivalent to installing a package using command `apt-get install iotedge=1.0.8-2`

For more information about how Debian packages are versioned, see [the Debian policy manual](https://www.debian.org/doc/debian-policy/ch-controlfields.html#s-f-version)

> [!NOTE]
> The apt package manager ignores versioning requirements given by a package when the dependent packages to install are being automatically resolved. Unless explicit versions of dependent packages are given they will use the latest, even though the package itself may specify a strict requirement (=) on a given version. This automatic resolution can lead to errors regarding an unmet dependency. [Learn More](https://unix.stackexchange.com/questions/350192/apt-get-not-properly-resolving-a-dependency-on-a-fixed-version-in-a-debian-ubunt)

If you're updating a specific version of the Azure IoT Edge security daemon, then you should include the desired version of the `aziot-edge` package and its dependent `aziot-identity-service` package in your apt manifest.
For more information, see [How to update IoT Edge](../iot-edge/how-to-update-iot-edge.md#update-the-security-subsystem).

An apt manifest can be used to update Device Update agent and its dependencies. List the device update agent name and desired version in the apt manifest, like you would for any other package. This apt manifest can then be imported and deployed through the Device Update for IoT Hub pipeline.

## Removing packages

You can also use an apt manifest to remove installed packages from your device. A single apt manifest can be used to remove, add, and update multiple packages.

To remove a package, add a minus sign "-" after the package name. You shouldn't include a version number for the packages you're removing. Removing a package through an apt manifest doesn't remove its dependencies and configurations.

For example:

```json
{
    "name": "contoso-video",
    "version": "2.0.0.1",
    "packages": [
        {
            "name" : "foo-"
        }
    ]
}
```

This apt manifest will remove the package "foo" from the device(s) it's deployed to.

## Recommended value for installed criteria

The installed criteria for an apt manifest is `<name>-<version>` where `<name>` is the name of the apt Manifest and `<version>` is the version of the apt manifest. For example, `contoso-iot-edge-1.0.0.0`.

## Guidelines on creating an apt manifest

While creating the apt manifest, there are some guidelines to keep in mind:

* Always ensure that the apt manifest is a well-formed json file.
* Each apt manifest should have a unique version. Try to come up with a standardized methodology to increment the version of the apt manifest, so that it makes sense for your scenarios and can be easily followed.
* When it comes to the desired state of each individual package, specify the exact name and version of the package that you would like to install on your device. Always validate the values against the package repository that you intend to use as the source for the package.
* Ensure that the packages in the apt manifest are listed in the order they should be installed/removed.
* Always validate the installation of packages on a test device to ensure the outcome is desired.
* When installing a specific version of a package (For example, `iotedge 1.0.9-1`), it's best practice to also have in the apt manifest the explicit versions of the dependent packages to be installed (For example, `libiothsm 1.0.9-1`)
* While it's not mandated, always ensure your apt manifest is cumulative to avoid getting your device into an unknown state. A cumulative update will ensure that your devices have the desired version of every package you care about even if the device has skipped an apt update deployment because of failure in installation, or being taken offline

For example:

**Base apt manifest**

```JSON
{
    "name": "contoso-iot-edge",
    "version": "1.0",
    "packages": [
        {
            "name": "foo",
            "version": "1.0.1"
        }
    ]
}
```

**Bad update**

This update includes the bar package, but not the foo package.

```JSON
{
    "name": "contoso-iot-edge",
    "version": "2.0",
    "packages": [
        {
            "name": "bar",
            "version": "3.0.2"
        }
    ]
}
```

**Good update**

This update includes foo package, and also includes bar package.

```JSON
{
    "name": "contoso-iot-edge",
    "version": "2.0",
    "packages": [
        {
            "name": "foo",
            "version": "1.0.1"
        },
        {
            "name": "bar",
            "version": "3.0.2"
        }
    ]
}
```

## Next steps

[Import an update to Device Update](import-update.md)
