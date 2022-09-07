---
title: CLI command reference overview - Microsoft Defender for IoT
description: Learn about accessing and using the Microsoft Defender for IoT CLI tools
ms.date: 09/07/2022
ms.topic: conceptual
---

# CLI command reference overview

This article provides an introduction to the Microsoft Defender for CLI tools, which privileged users can use for advanced troubleshooting and support.

<!--MORE ABOUT WHO THE AUDIENCE IS AND WHAT ITS USED FOR. WHY DO WE CARE?-->

## Access the CLI

The Defender for IoT CLI is only open to the privileged users installed together with the OT network sensor and on-premises management console software installation. On the sensor, this includes the *cyberx*, *support*, and *cyberx_host* users. On the on-premises management console, this includes the *cyberx* and *support* users.

Access the CLI via a terminal, such as Putty, by signing into the sensor or on-premises management console as one of the privileged users. We recommend that you use the *support* user for CLI access whenever possible.

<!-- warning for CLI usage section -->

Privileged users have access to specific containers in the sensor and on-premises management console installations. The following table describes that access in detail:

|Name  |Connects to  |Permissions  |
|---------|---------|---------|
|**cyberx**     |   The sensor or on-premises management console's `sensor_app` container      | Serves as a root user within the main application container. <br><br>Used for troubleshooting with advanced root access.<br><br>Can access the container filesystem, commands, and dedicated CLI commands for controlling OT monitoring      |
|**support**     |   The sensor or on-premises management console's `sensor_app` container       | Serves as a locked-down, user shell for dedicated CLI tools<br><br>Has no filesystem access<br><br>Can access only  dedicated CLI commands for controlling OT monitoring   |
|**cyberx_host**     | The on-premises management console's host OS        | Serves as a root user in the on-premises management console's host OS<br><br>Used for support scenarios with containers and filesystem access <!--this doesn't make sense - isn't this user not installed on the cm? something's missing-->       |

## CLI command references

CLI commands are available for the following types of operations:

- [Appliance management commands](cli-appliance.md) <!--: what do these do?>
- [Configuration commands](cli-configuration.md) <!--: what do these do?>
- [On-premises management console commands](cli-management.md) <!--: what do these do?>

## Sign out of the CLI

Make sure to properly sign out of the CLI when you're done. You're automatically signed out after an inactive period of 300 seconds.

To sign out manually, run one of the following commands:

|User  |Command  |
|---------|---------|
|**support**     |  `logout`       |
|**cyberx**     |  `cyberx-xsense-logout`       |
|**cyberx_host**     |   `cyberx_host-xsense-logout`      |

## Next steps

<!--need to add something intelligent here-->

For more information, see:

- [Appliance management commands](cli-appliance.md)
- [Configuration commands](cli-configuration.md)
- [On-premises management console commands](cli-management.md)