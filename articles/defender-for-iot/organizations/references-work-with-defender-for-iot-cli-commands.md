---
title: CLI command users and access for OT monitoring - Microsoft Defender for IoT
description: Learn about the users supported for the Microsoft Defender for IoT CLI commands and how to access the CLI.
ms.date: 12/19/2023
ms.topic: concept-article
---

# Defender for IoT CLI users and access

This article provides an introduction to the Microsoft Defender for IoT command line interface (CLI). The CLI is a text-based user interface that allows you to access your OT sensors for advanced configuration, troubleshooting, and support.

To access the Defender for IoT CLI, you need access to the sensor.

- For OT sensors, you need to sign in as a [privileged user](#privileged-user-access-for-ot-monitoring).
- For Enterprise IoT sensors, you can sign in as any user.

[!INCLUDE [caution do not use manual configurations](includes/caution-manual-configurations.md)]

## Privileged user access for OT monitoring

Use the *admin* user when using the Defender for IoT CLI, which is an administrative account with access to all CLI commands.

If you're using a legacy software version, you may have one or more of the following users:

|Legacy scenario  |Description  |
|---------|---------|
|**Sensor versions earlier than 23.2.0**     |   In sensor versions earlier than [23.2.0](whats-new.md#default-privileged-user-is-now-admin-instead-of-support), the default *admin* user is named *support*. The *support* user is available and supported only on versions earlier than 23.2.0.<br><br>Documentation refers to the *admin* user to match the latest version of the software.    |

Other CLI users cannot be added.

For more information, see [On-premises users and roles for OT monitoring with Defender for IoT](roles-on-premises.md).

### Supported users by CLI actions

The following tables list the activities available by CLI and the privileged users supported for each activity. The *cyberx* and *cyberx_host* users are only supported in versions earlier than [23.1.x](release-notes.md).

### Appliance maintenance commands

|Service area  |Users  |Actions  |
|---------|---------|---------|
|Sensor health     |   *admin*, *cyberx*      | [Check OT monitoring services health](cli-ot-sensor.md#check-ot-monitoring-services-health)        |
|Reboot and shutdown     |  *admin*, *cyberx*, *cyberx_host*       | [Restart an appliance](cli-ot-sensor.md#restart-an-appliance)<br>[Shut down an appliance](cli-ot-sensor.md#shut-down-an-appliance)        |
|Software versions     |  *admin*, *cyberx*       |  [Show installed software version](cli-ot-sensor.md#show-installed-software-version)  <br>[Update software version](update-ot-software.md)     |
|Date and time     |   *admin*, *cyberx*, *cyberx_host*          |  [Show current system date/time](cli-ot-sensor.md#show-current-system-datetime)       |
|NTP     | *admin*, *cyberx*        | [Turn on NTP time sync](cli-ot-sensor.md#turn-on-ntp-time-sync)<br>[Turn off NTP time sync](cli-ot-sensor.md#turn-off-ntp-time-sync)        |

### Backup and restore commands

|Service area  |Users  |Actions  |
|---------|---------|---------|
|List backup files     | *admin*, *cyberx*        | [List current backup files](cli-ot-sensor.md#list-current-backup-files)    <br>[Start an immediate, unscheduled backup](cli-ot-sensor.md#start-an-immediate-unscheduled-backup)    |
|Restore     | *admin*, *cyberx*        | [Restore data from the most recent backup](cli-ot-sensor.md#restore-data-from-the-most-recent-backup)        |
|Backup disk space     |  *cyberx*       |  [Display backup disk space allocation](cli-ot-sensor.md#display-backup-disk-space-allocation)       |

### Local user management commands

|Service area  |Users  |Actions  |
|---------|---------|---------|
|Password management     | *cyberx*, *cyberx_host*        | [Change local user passwords](cli-ot-sensor.md#change-local-user-passwords)        |
| Sign-in configuration     | *cyberx*        | [Define maximum number of failed sign-ins](manage-users-sensor.md#define-maximum-number-of-failed-sign-ins)       |

### Network configuration commands

|Service area  |Users  |Actions  |
|---------|---------|---------|
| Network setting configuration | *cyberx_host* | [Change networking configuration or reassign network interface roles](cli-ot-sensor.md#change-networking-configuration-or-reassign-network-interface-roles) |
|Network setting configuration     |  *admin*       |  [Validate and show network interface configuration](cli-ot-sensor.md#validate-and-show-network-interface-configuration)       |
|Network connectivity     |  *admin*, *cyberx*       |  [Check network connectivity from the OT sensor](cli-ot-sensor.md#check-network-connectivity-from-the-ot-sensor)       |
|Physical interfaces management     | *admin*        | [Locate a physical port by blinking interface lights](cli-ot-sensor.md#locate-a-physical-port-by-blinking-interface-lights)        |
|Physical interfaces management    | *admin*, *cyberx*        |     [List connected physical interfaces](cli-ot-sensor.md#list-connected-physical-interfaces)    |

### Traffic capture filter commands

|Service area  |Users  |Actions  |
|---------|---------|---------|
| Capture filter management    |  *admin*, *cyberx*       | [Create a basic filter for all components](cli-ot-sensor.md#create-a-basic-filter-for-all-components)<br>[Create an advanced filter for specific components](cli-ot-sensor.md#create-an-advanced-filter-for-specific-components)  <br>[List current capture filters for specific components](cli-ot-sensor.md#list-current-capture-filters-for-specific-components)  <br> [Reset all capture filters](cli-ot-sensor.md#reset-all-capture-filters)   |

## Defender for IoT CLI access

To access the Defender for IoT CLI, sign in to your OT or Enterprise IoT sensor using a terminal emulator and SSH.

- **On a Windows system**, use PuTTY or another similar application.
- **On a Mac system**, use Terminal.
- **On a virtual appliance**, access the CLI via SSH, the vSphere client, or Hyper-V Manager. Connect to the virtual appliance's management interface IP address via port 22.

Each CLI command on an OT network sensor is supported a different set of privileged users, as noted in the relevant CLI descriptions. Make sure you sign in as the user required for the command you want to run. For more information, see [Privileged user access for OT monitoring](#privileged-user-access-for-ot-monitoring).

## Access the system root as an *admin* user

When signing in as the *admin* user, run the following command to access the host machine as the root user. Access the host machine as the root user enables you to run CLI commands that aren't available to the *admin* user.

Run:

```support bash
system shell
```

## Sign out of the CLI

Make sure to properly sign out of the CLI when you're done using it. You're automatically signed out after an inactive period of 300 seconds.

To sign out manually on an OT sensor, run one of the following commands:

|User  |Command  |
|---------|---------|
|**admin**     |  `logout`       |
|**cyberx**     |  `cyberx-xsense-logout`       |
|**cyberx_host**     |   `logout`      |

## Next steps

> [!div class="nextstepaction"]
> [Manage an OT sensor from the CLI](cli-ot-sensor.md)

> [!div class="nextstepaction"]
> [On-premises users and roles for OT monitoring](roles-on-premises.md)

You can also control and monitor your cloud connected sensors from the Defender for IoT **Sites and sensors** page. For more information, see [Manage sensors with Defender for IoT in the Azure portal](../how-to-manage-sensors-on-the-cloud.md).
