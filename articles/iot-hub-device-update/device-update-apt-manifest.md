---
title: Understand Device Update for Azure IoT Hub APT manifest | Microsoft Docs
description: Understand how Device Update for IoT Hub uses apt manifest for a package-based update.
author: vimeht
ms.author: vimeht
ms.date: 2/17/2021
ms.topic: conceptual
ms.service: iot-hub-device-update
---


# Device Update APT Manifest

The APT Manifest is a JSON file that describes an update details required by APT Update Handler. This file can be imported into Device Update for IoT Hub just like any other update.

[Learn More](import-update.md) about importing updates into Device Update.

## Overview

When an APT manifest is delivered to an Device Update Agent as an update, the agent will process the manifest and carry out the necessary operations. These operations include downloading and installing the packages specified in the APT Manifest file and their dependencies.

Device Update supports APT UpdateType and APT Update Handler. This support allows the Device Update Agent to evaluate the installed Debian packages and update the necessary packages. 

## Schema

An APT Manifest file is a JSON file with a versioned schema.

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

Example:

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

### name

The name for this APT Manifest. This can be whatever name or ID is meaningful for your
scenarios. For example, `contoso-iot-edge`.

### version

A version number for this APT Manifest. For example, `1.0.0.0`.


### packages

A list of objects containing package-specific properties.

#### name

The name or ID of the package. For example, `iotedge`.

#### version

The desired version criteria for the package. For example, `1.0.8-2`.

Currently only exact version number is supported. The version number is the desired Debian package
version in format [epoch:]upstream_version[-debian_revision].

**epoch** is an unsigned int.

**upstream_version** can include alphanumerics and characters such as ".","+","-" and "~". It should start with a digit.
> [!NOTE]
> '1.0.8' is equal to '1.0.8-0'

For example, **`"name":"iotedge" and "version":"1.0.8-2"`** is equivalent to installing a package using command `apt-get install iotedge=1.0.8-2`

> [!NOTE]
> Version value doesn't contain an equal sign

If version is omitted, the latest available version of specified package will be installed.

[Learn More](https://www.debian.org/doc/debian-policy/ch-controlfields.html#s-f-version) about how Debian packages are versioned.

> [!NOTE]
> APT package manager ignores versioning requirements given by a package when the dependent packages to install are being automatically resolved. Unless explicit versions of dependent packages are given they will use the latest, even though the package itself may specify a strict requirement (=) on a given
version. This automatic resolution can lead to errors regarding an unmet dependency. [Learn More](https://unix.stackexchange.com/questions/350192/apt-get-not-properly-resolving-a-dependency-on-a-fixed-version-in-a-debian-ubunt)

If you're updating a specific version of the Azure IoT Edge security daemon, then you should include the desired version of the `iotedge` package and its dependent `libiothsm-std` package in your APT manifest.
[Learn More](../iot-edge/how-to-update-iot-edge.md#update-the-security-daemon)

> [!NOTE]
> An apt manifest can be used to update Device Update agent and its dependencies. List the device update agent name and desired version in the apt manifest, like you would for any other package. This apt manifest can then be imported and deployed through the Device Update for IoT Hub pipeline. 

## Removing packages

You can also use an apt manifest to remove installed packages from your device. A single apt manifest can be used to remove, add and update multiple packages. 
To remove a package, add a minus sign "-" after the package name. You shouldn't include a version number for the packages you are removing. 
Removing packages through an apt manifest doesn't remove its dependencies and configurations.

Example:

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
This apt manifest will remove the package "foo" from the device(s) it is deployed to. 

## Recommended value for installed Criteria

The Installed Criteria for an APT Manifest is `<name>-<version>` where `<name>` is the name of the APT Manifest and `<version>` is the version of the APT Manifest. For example, `contoso-iot-edge-1.0.0.0`. 

## Guidelines on creating an APT Manifest

While creating the APT Manifest, there are some guidelines to keep in mind:

- Always ensure that the APT Manifest is a well-formed json file
- Each APT Manifest should have a unique version. Try to come up with a standardized methodology to increment the version of the APT Manifest, so that it makes sense for your scenarios and can be easily followed
- When it comes to the desired state of each individual package, specify the exact name and version of the package that you would like to install on your device. Always validate the values against the package repository that you intend to use as the source for the package
- Ensure that the packages in the APT Manifest are listed in the order they should be installed/removed
- Always validate the installation of packages on a test device to ensure the outcome is desired
- When installing a specific version of a package (For example, `iotedge 1.0.9-1`), it's best practice to also have in the APT Manifest the explicit versions of the dependent packages to be installed (For example, `libiothsm 1.0.9-1`)
- While it's not mandated, always ensure your APT Manifest is cumulative to avoid getting your device into an unknown state. A cumulative update will ensure that your devices have the desired version of every package you care about even if the device has skipped an APT Update deployment because of failure in installation, or being taken offline

For example:

**Base APT manifest**

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

**BAD UPDATE**

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

**GOOD UPDATE**

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

> [!div class="nextstepaction"]
> [Import new update](import-update.md)