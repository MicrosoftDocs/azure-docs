---
title: Understand Device Update for IoT Hub apt manifest | Microsoft Docs
description: Understand how Device Update for IoT Hub uses apt manifest for performing a package-based update.
author: vimeht
ms.author: vimeht
ms.date: 2/12/2021
ms.topic: conceptual
ms.service: iot-hub-device-update
---


# APT Manifest

## Overview

The APT Manifest is a JSON file that describes an update details required by APT Update Handler. 

This file can be imported into ADU just like any other content.

[Learn More](../quickstarts/how-to-import-quickstart.md) about importing content into ADU.

When an APT manifest is delivered to an ADU Agent as an update, the agent will process the manifest and perform the necessary operations, such as, download, and install the packages specified in the APT Manifest file.

ADU supports APT UpdateType and Update Handler that allows the ADU Agent to evaluate the installed Debian packages and update the necessary packages. 

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
scenarios. e.g. `contoso-iot-edge`.

### version

A version number for this APT Manifest. e.g. `1.0.0.0`.


#### packages

A list of objects containing package specific properties.

#### name

The name or ID of the package. e.g. `iotedge`.

#### version

The desired version criteria for the package. e.g. `1.0.8-2`.

Currently only exact version number is supported. The version number is the desired Debian package
version in format [epoch:]upstream_version[-debian_revision].

**epoch** is an unsigned int.

**upstream_version** can include alphanumerics . + - ~ and should start with a digit.
Note that '1.0.8' is equal to '1.0.8-0'

e.g. **"name":"iotedge" and "version":"1.0.8-2"** equivalent to installing a package using command "apt-get install **iotedge=1.0.8-2**"
(Note: version value doesn't contain an equal sign)

If version is omitted, the latest available version of specified package will be installed.

[Learn More](https://www.debian.org/doc/debian-policy/ch-controlfields.html#s-f-version) about how Debian packages are versioned.

**Note**: APT package manager ignores versioning requirements given by a package when the dependent packages to install are being automatically resolved.
Unless explicit versions of dependent packages are given they will use the latest, even though the package itself may specify a strict requirement (=) on a given
version. This can lead to errors regarding an unmet dependency.
[Learn More](https://unix.stackexchange.com/questions/350192/apt-get-not-properly-resolving-a-dependency-on-a-fixed-version-in-a-debian-ubunt)

If you're updating a specific version of the Azure IoT Edge security daemon then you should include in your APT Manifest both the given version of the iotedge package and its dependent libiothsm-std package.
[Learn More](https://docs.microsoft.com/en-us/azure/iot-edge/how-to-update-iot-edge#update-the-security-daemon)

## Recommended value for installed Criteria

The Installed Criteria for a APT Manifest is `<name>-<version>` where `<name>` is the name of the APT Manifest and `<version>` is the version of the APT Manifest. e.g. `contoso-iot-edge-1.0.0.0`. 

[Learn More](../how-adu-uses-iot-pnp.md) about Installed Criteria.

## Guidelines on creating a APT Manifest

-------------------------------------------------------------------------------
While creating the APT Manifest, there are some guidelines to
keep in mind:

- Always ensure that the APT Manifest is a well-formed json file
- Each APT Manifest should have a unique version. Try to come up with a standardized methodology to increment the version of the APT Manifest, so that it makes sense for your scenarios and can be easily followed
- When it comes to the desired state of each individual package, specify the exact name and version of the package that you would like to install on your device. Always validate the values against the package repository that you intend to use as the source for the package
- Ensure that the packages in the APT Manifest are listed in the order they should be installed
- Always validate the installation of packages on a test device to ensure the outcome is desired
- When installing a specific version of a package (e.g. iotedge 1.0.9-1) it is best practice to also have in the APT Manifest the explicit versions of the dependent packages to be installed (e.g. libiothsm 1.0.9-1).
- While it is not mandated, always ensure your APT Manifest is cumulative to avoid getting your device into an unknown state. This will ensure that your devices have the desired version of every package you care about even if the device has skipped a APT Update deployment due to failure in installation, or being taken offline

For example:

**Base APT Manfiest**

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

This includes the bar package, but not the foo package.

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

This includes foo package, and also includes bar package.

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

**[Next steps: Import new update](import-update.md)**
