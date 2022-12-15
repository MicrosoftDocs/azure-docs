---
title: CLI command reference overview - Microsoft Defender for IoT
description: Learn about accessing and using the Microsoft Defender for IoT CLI tools
ms.date: 09/07/2022
ms.topic: conceptual
---

# Getting started with advanced CLI commands

This article provides an introduction to the Microsoft Defender for IoT command line interface (CLI). The CLI is a text-based user interface that allows you to access your OT and Enterprise IoT sensors, and the on-premises management console, for advanced configuration, troubleshooting, and support.

To access the Defender for IoT CLI, you'll need access to the sensor or on-premises management console.

- For OT sensors or the on-premises management console, you'll need to sign in as a [privileged user](#privileged-user-access-for-ot-monitoring).
- For Enterprise IoT sensors, you can sign in as any user.

## Privileged user access for OT monitoring

Privileged users for OT monitoring are pre-defined together with the [OT monitoring software installation](../how-to-install-software.md), as part of the hardened operating system.

- On the sensor, this includes the *cyberx*, *support*, and *cyberx_host* users.
- On the on-premises management console, this includes the *cyberx* and *support* users.

The following table describes the access available to each privileged user:

|Name  |Connects to  |Permissions  |
|---------|---------|---------|
|**support**     |   The OT sensor or on-premises management console's `configuration shell`        | A powerful administrative account with access to:<br>- All CLI commands<br>- The ability to manage log files<br>- Start and stop services<br><br>This user has no filesystem access   |
|**cyberx**     |    The OT sensor or on-premises management console's `terminal (root)`       | Serves as a root user and has unlimited privileges on the appliance. <br><br>Used only for the following following tasks:<br>- Changing default passwords<br>- Troubleshooting<br>- Filesystem access      |
|**cyberx_host**     | The OT sensor's host OS `terminal (root)`         | Serves as a root user and has unlimited privileges on the appliance host OS.<br><br>Used for: <br>- Network configuration<br>- Application container control <br>- Filesystem access |

> [!NOTE]
> We recommend that you use the *support* user for CLI access whenever possible.
> Other CLI users cannot be added.

## Access the CLI

To access the Defender for IoT CLI, sign in to your OT or Enterprise IoT sensor or your on-premises management console using a terminal emulator and SSH.

- **On a Windows system**, use PuTTY or another similar application.
- **On a Mac system**, use Terminal.
- **On a virtual appliance**, access the CLI via SSH, the vSphere client, or Hyper-V Manager. Connect to the virtual appliance's management interface IP address via port 22.

Each CLI command on an OT network sensor or on-premises management console is supported a different set of privileged users, as noted in the relevant CLI descriptions. Make sure you sign in as the user required for the command you want to run. For more information, see [Privileged user access for OT monitoring](#privileged-user-access-for-ot-monitoring).

## Sign out of the CLI

Make sure to properly sign out of the CLI when you're done using it. You're automatically signed out after an inactive period of 300 seconds.

To sign out manually on an OT sensor or on-premises management console, run one of the following commands:

|User  |Command  |
|---------|---------|
|**support**     |  `logout`       |
|**cyberx**     |  `cyberx-xsense-logout`       |
|**cyberx_host**     |   `logout`      |


## Next steps

- [Manage an OT sensor from the CLI](cli-ot-sensor.md)
- [Manage on on-premises management console from the CLI](cli-ot-sensor-configuration.md)

You can also control and monitor your cloud connected sensors from the Defender for IoT **Sites and sensors** page. For more information, see [Manage sensors with Defender for IoT in the Azure portal](../how-to-manage-sensors-on-the-cloud.md).
