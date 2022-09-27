---
title: CLI command reference overview - Microsoft Defender for IoT
description: Learn about accessing and using the Microsoft Defender for IoT CLI tools
ms.date: 09/07/2022
ms.topic: conceptual
---

# Getting started

This article provides an introduction to the Microsoft Defender for IoT appliance CLI command line interface. The command line interface (CLI) is a text-based user interface which privileged users can use for advanced configuration, troubleshooting and support.

## Logon and Authentication

There are several ways to connect to the CLI. Once connected, log on to the CLI with the admin credentials. Connection via SSH is available on all appliance platforms. Connect to the CLI using a terminal emulator and SSH. 
- On a Windows system, use PuTTY or similar. 
- On a Mac system use Terminal. 
- On a virtualized appliance, in addition to SSH you can access the CLI via the vSphere client or Hyper-V manager.
Connect to the appliance management interface IP address on port 22.

## Priviledged CLI users

On OT monitoring appliances, CLI access is only available to the privileged users pre-defined in the appliance software (part of the hardend OS). 
- On the sensor, this includes the *cyberx*, *support*, and *cyberx_host* users.
- On the on-premises management console, this includes the *cyberx* and *support* users.

> [!NOTE]
> We recommend that you use the *support* user for CLI access whenever possible.

Privileged users have access to specific functionality within the appliance, the following table describes that access in detail:

|Name  |Connects to  |Permissions  |
|---------|---------|---------|
|**support**     |   The sensor or on-premises management console's `configuration shell`        | Powerful administrative account that can perform all of the tasks that would need to be undertaken using the command line<br>- Manage Log Files<br>- Start and stop services<br><br>Has no filesystem access   |
|**cyberx**     |    The sensor or on-premises management console's `terminal (root)`       | Serves as a root user and has unlimited privileges on the appliance and should be used only for the following tasks:<br>- Changing default passwords<br>- Troubleshooting<br>-filesystem access      |
|**cyberx_host**     | OT Sensor host OS `terminal (root)`         | Serves as a root user and has unlimited privileges on the appliance host OS<br><br>Used for network configuration, control of application containers and filesystem access |

> [!NOTE]
> Additional users are not supported and will not have the correct permissions to perform CLI commands.

## CLI Reference

The following list gives a high-level overview of the functions available from the command line interface.

### OT Sensor 
- [Appliance management](cli-appliance.md)  
- [Configuration commands](cli-configuration.md)  

### On-premises management console
- [Appliance management](cli-cm-appliance-mgmt.md)  
- [Configuration commands](cli-cm-configuration.md)  
- [Sensor Management](cli-cm-sensor-mgmt)

### Enterprise IoT sensor
- [Installation]()
- [Troubleshooting]()

## Sign out of the CLI

Make sure to properly sign out of the CLI when you're done. You're automatically signed out after an inactive period of 300 seconds.

To sign out manually, run one of the following commands:

|User  |Command  |
|---------|---------|
|**support**     |  `logout`       |
|**cyberx**     |  `cyberx-xsense-logout`       |
|**cyberx_host**     |   `logout`      |

## Next steps
More control and monitoring of cloud connected sensors in [Sites and Sensors](how-to-manage-sensors-on-the-cloud.md)


For more information, see:

- [Appliance management commands](cli-appliance.md)
- [Configuration commands](cli-configuration.md)
- [On-premises management console commands](cli-management.md)
