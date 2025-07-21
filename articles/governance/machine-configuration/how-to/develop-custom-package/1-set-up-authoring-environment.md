---
title: How to install the machine configuration authoring module
description: Learn how to install the PowerShell module for creating and testing machine configuration policy definitions and assignments.
ms.date: 02/01/2024
ms.topic: how-to
---
# How to set up a machine configuration authoring environment

The PowerShell module **GuestConfiguration** automates the process of creating custom content
including:

- Creating a machine configuration content artifact (`.zip`)
- Validating the package meets requirements
- Installing the machine configuration agent locally for testing
- Validating the package can be used to audit settings in a machine
- Validating the package can be used to configure settings in a machine
- Publishing the package to Azure storage
- Creating a policy definition
- Publishing the policy

Support for applying configurations through machine configuration is introduced in version 3.4.2.

### Base requirements

Operating systems where the module can be installed:

- Ubuntu 20
- Windows

The module can be installed on a machine running PowerShell 7.x. Install the versions of PowerShell
listed in the following table for your operating system.

| OS         | Minimum Required PowerShell Version | Installation                           |
|------------|:-----------------------------------:|----------------------------------------|
| Windows    |               `7.1.3`               | [Installing PowerShell on Windows][01] |
| Ubuntu 20  |               `7.2.4`               | [Installing PowerShell on Ubuntu][02]  |

For Linux, the following shell script downloads and installs PowerShell 7.2.4.

```sh
###################################
# Prerequisites

# Update the list of packages
sudo apt-get update

# Install pre-requisite packages.
sudo apt-get install -y wget

# Download the PowerShell package file
wget https://github.com/PowerShell/PowerShell/releases/download/v7.2.4/powershell_7.2.4-1.deb_amd64.deb

###################################
# Install the PowerShell package
sudo dpkg -i powershell_7.2.4-1.deb_amd64.deb

# Resolve missing dependencies and finish the install (if necessary)
sudo apt-get install -f

# Delete the downloaded package file
rm powershell_7.2.4-1.deb_amd64.deb

# Switch the user to root before launching PowerShell
sudo su

# Start PowerShell
pwsh
```

The **GuestConfiguration** module requires the following software:

- Azure PowerShell 5.9.0 or higher. The required Az PowerShell modules are installed automatically
  with the **GuestConfiguration** module, or you can follow [these instructions][03].


### Install the GuestConfiguration module from the PowerShell Gallery

To install the **GuestConfiguration** module on either Windows or Linux, run the following command
in PowerShell 7.

```powershell
# Install the machine configuration DSC resource module from PowerShell Gallery
Install-Module -Name GuestConfiguration
```

Validate that the module has been imported:

```powershell
# Get a list of commands for the imported GuestConfiguration module
Get-Command -Module GuestConfiguration
```

### Install the PSDesiredStateConfiguration module from the PowerShell Gallery

On Windows, to install the **PSDesiredStateConfiguration** module, run the following command in PowerShell 7.

```powershell
# Install PSDesiredStateConfiguration version 2.0.7 (the stable release)
Install-Module -Name PSDesiredStateConfiguration -RequiredVersion 2.0.7
Import-Module -Name PSDesiredStateConfiguration
```

On Linux, to install the **PSDesiredStateConfiguration** module, run the following command in PowerShell 7.

```powershell
# Install PSDesiredStateConfiguration prerelease version 3.0.0
Install-Module -Name PSDesiredStateConfiguration -RequiredVersion 3.0.0-beta1 -AllowPrerelease
Import-Module -Name PSDesiredStateConfiguration
```

Validate that the module has been imported:

```powershell
# Get a list of commands for the imported PSDesiredStateConfiguration module
Get-Command -Module PSDesiredStateConfiguration
```

## Next step

> [!div class="nextstepaction"]
> [Create a custom machine configuration package](./2-create-package.md)

<!-- Reference link definitions -->
[01]: /powershell/scripting/install/installing-powershell-on-windows
[02]: /powershell/scripting/install/install-ubuntu
[03]: /powershell/azure/install-az-ps
