---
title: CLI command users and access for OT monitoring - Microsoft Defender for IoT
description: Learn about the users supported for the Microsoft Defender for IoT CLI commands and how to access the CLI.
ms.date: 08/09/2023
ms.topic: concept-article
---

# Defender for IoT CLI users and access

This article provides an introduction to the Microsoft Defender for IoT command line interface (CLI). The CLI is a text-based user interface that allows you to access your OT sensors and the on-premises management console for advanced configuration, troubleshooting, and support.

To access the Defender for IoT CLI, you'll need access to the sensor or on-premises management console.

- For OT sensors or the on-premises management console, you'll need to sign in as a [privileged user](#privileged-user-access-for-ot-monitoring).
- For Enterprise IoT sensors, you can sign in as any user.

[!INCLUDE [caution do not use manual configurations](includes/caution-manual-configurations.md)]

## Privileged user access for OT monitoring

Use the *support* user when using the Defender for IoT CLI, which is an an administrative account with access to all CLI commands. On the on-premises management console, use either the *support* or the *cyberx* user.

In sensor software versions earlier than [23.1.x](whats-new.md#july-2023), the *cyberx* and *cyberx_host* privileged users are also available. In versions 23.1.x and higher, the *cyberx* and *cyberx_host* users are available, but not enabled by default. To enable these extra privileged users, [change their passwords](manage-users-sensor.md#change-a-sensor-users-password).

Other CLI users cannot be added.

The following table describes the access available to each privileged user:

|Name  |Connects to  |Permissions  |
|---------|---------|---------|
|**support** | The OT sensor or on-premises management console's `configuration shell` |	A powerful administrative account with access to: <br>- All CLI commands <br>- The ability to manage log files <br>- Start and stop services <br><br>This user has no filesystem access |
|**cyberx**     |    The OT sensor or on-premises management console's `terminal (root)`       | Serves as a root user and has unlimited privileges on the appliance. <br><br>Used only for the following tasks:<br>- Changing default passwords<br>- Troubleshooting<br>- Filesystem access      |
|**cyberx_host**     | The OT sensor's host OS `terminal (root)`         | Serves as a root user and has unlimited privileges on the appliance host OS.<br><br>Used for: <br>- Network configuration<br>- Application container control <br>- Filesystem access |

For more information, see [On-premises users and roles for OT monitoring with Defender for IoT](roles-on-premises.md).

### Supported users by CLI actions

The following tables list the activities available by CLI and the privileged users supported for each activity. The *cyberx* and *cyberx_host* users are only supported in versions earlier than [23.1.x](release-notes.md).

### Appliance maintenance commands

|Service area  |Users  |Actions  |
|---------|---------|---------|
|Sensor health     |   *support*, *cyberx*      | [Check OT monitoring services health](cli-ot-sensor.md#check-ot-monitoring-services-health)        |
|Restart and shutdown     |  *support*, *cyberx*, *cyberx_host*       | [Restart an appliance](cli-ot-sensor.md#restart-an-appliance)<br>[Shut down an appliance](cli-ot-sensor.md#shut-down-an-appliance)        |
|Software versions     |  *support*, *cyberx*       |  [Show installed software version](cli-ot-sensor.md#show-installed-software-version)  <br>[Update software version](update-ot-software.md)     |
|Date and time     |   *support*, *cyberx*, *cyberx_host*          |  [Show current system date/time](cli-ot-sensor.md#show-current-system-datetime)       |
|NTP     | *support*, *cyberx*        | [Turn on NTP time sync](cli-ot-sensor.md#turn-on-ntp-time-sync)<br>[Turn off NTP time sync](cli-ot-sensor.md#turn-off-ntp-time-sync)        |

### Backup and restore commands

|Service area  |Users  |Actions  |
|---------|---------|---------|
|Backup files     | *support*, *cyberx*        | [List current backup files](cli-ot-sensor.md#list-current-backup-files)    <br>[Start an immediate, unscheduled backup](cli-ot-sensor.md#start-an-immediate-unscheduled-backup)    |
|Restore     | *support*, *cyberx*        | [Restore data from the most recent backup](cli-ot-sensor.md#restore-data-from-the-most-recent-backup)        |
|Backup disk space     |  *cyberx*       |  [Display backup disk space allocation](cli-ot-sensor.md#display-backup-disk-space-allocation)       |

### TLS/SSL certificate commands

|Service area  |Users  |Actions  |
|---------|---------|---------|
|Certificate management     | *cyberx*        | [Import TLS/SSL certificates to your OT sensor](cli-ot-sensor.md#import-tlsssl-certificates-to-your-ot-sensor)<br>[Restore the default self-signed certificate](cli-ot-sensor.md#restore-the-default-self-signed-certificate)        |

### Local user management commands

|Service area  |Users  |Actions  |
|---------|---------|---------|
|Password management     | *cyberx*, *cyberx_host*        | [Change local user passwords](cli-ot-sensor.md#change-local-user-passwords)        |
|  Sign-in configuration| *support*, *cyberx*, *cyberx_host* |[Control user session timeouts](manage-users-sensor.md#control-user-session-timeouts) |
| Sign-in configuration     | *cyberx*        | [Define maximum number of failed sign-ins](manage-users-sensor.md#define-maximum-number-of-failed-sign-ins)       |

### Network configuration commands

|Service area  |Users  |Actions  |
|---------|---------|---------|
| Network setting configuration | *cyberx_host* | [Change networking configuration or reassign network interface roles](cli-ot-sensor.md#change-networking-configuration-or-reassign-network-interface-roles) |
|Network setting configuration     |  *support*       |  [Validate and show network interface configuration](cli-ot-sensor.md#validate-and-show-network-interface-configuration)       |
|Network connectivity     |  *support*, *cyberx*       |  [Check network connectivity from the OT sensor](cli-ot-sensor.md#check-network-connectivity-from-the-ot-sensor)       |
|Network connectivity      |  *cyberx*       | [Check network interface current load](cli-ot-sensor.md#check-network-interface-current-load) <br>[Check internet connection](cli-ot-sensor.md#check-internet-connection)         |
|Network bandwidth limit     |    *cyberx*     | [Set bandwidth limit for the management network interface](cli-ot-sensor.md#set-bandwidth-limit-for-the-management-network-interface)        |
|Physical interfaces management     | *support*        | [Locate a physical port by blinking interface lights](cli-ot-sensor.md#locate-a-physical-port-by-blinking-interface-lights)        |
|Physical interfaces management    | *support*, *cyberx*        |     [List connected physical interfaces](cli-ot-sensor.md#list-connected-physical-interfaces)    |

### Traffic capture filter commands

|Service area  |Users  |Actions  |
|---------|---------|---------|
| Capture filter management    |  *support*, *cyberx*       | [Create a basic filter for all components](cli-ot-sensor.md#create-a-basic-filter-for-all-components)<br>[Create an advanced filter for specific components](cli-ot-sensor.md#create-an-advanced-filter-for-specific-components)  <br>[List current capture filters for specific components](cli-ot-sensor.md#list-current-capture-filters-for-specific-components)  <br> [Reset all capture filters](cli-ot-sensor.md#reset-all-capture-filters)   |

### Alert commands

|Service area  |Users  |Actions  |
|---------|---------|---------|
|Alert functionality testing     |  *cyberx*       |   [Trigger a test alert](cli-ot-sensor.md#trigger-a-test-alert)      |
| Alert exclusion rules | *support*, *cyberx* | [Show current alert exclusion rules](cli-ot-sensor.md#show-current-alert-exclusion-rules) <br>[Create a new alert exclusion rule](cli-ot-sensor.md#create-a-new-alert-exclusion-rule)<br>[Modify an alert exclusion rule](cli-ot-sensor.md#modify-an-alert-exclusion-rule)<br>[Delete an alert exclusion rule](cli-ot-sensor.md#delete-an-alert-exclusion-rule)

## Defender for IoT CLI access

To access the Defender for IoT CLI, sign in to your OT or Enterprise IoT sensor or your on-premises management console using a terminal emulator and SSH.

- **On a Windows system**, use PuTTY or another similar application.
- **On a Mac system**, use Terminal.
- **On a virtual appliance**, access the CLI via SSH, the vSphere client, or Hyper-V Manager. Connect to the virtual appliance's management interface IP address via port 22.

Each CLI command on an OT network sensor or on-premises management console is supported a different set of privileged users, as noted in the relevant CLI descriptions. Make sure you sign in as the user required for the command you want to run. For more information, see [Privileged user access for OT monitoring](#privileged-user-access-for-ot-monitoring).

## Access the system root as a *support* user


When signing in as the *support* user, run the following command to access the host machine as the root user. Access the host machine as the root user enables you to run CLI commands that aren't available to the *support* user. 

Run:

```support bash
system shell
```

## Sign out of the CLI

Make sure to properly sign out of the CLI when you're done using it. You're automatically signed out after an inactive period of 300 seconds.

To sign out manually on an OT sensor or on-premises management console, run one of the following commands:

|User  |Command  |
|---------|---------|
|**support**     |  `logout`       |
|**cyberx**     |  `cyberx-xsense-logout`       |
|**cyberx_host**     |   `logout`      |

## Next steps

> [!div class="nextstepaction"]
> [Manage an OT sensor from the CLI](cli-ot-sensor.md)

> [!div class="nextstepaction"]
> [On-premises users and roles for OT monitoring](roles-on-premises.md)

You can also control and monitor your cloud connected sensors from the Defender for IoT **Sites and sensors** page. For more information, see [Manage sensors with Defender for IoT in the Azure portal](../how-to-manage-sensors-on-the-cloud.md).
