---
title: Troubleshoot Azure Log Analytics Linux Agent | Microsoft Docs
description: Describe the symptoms, causes, and resolution for the most common issues with the Log Analytics agent for Linux in Azure Monitor.
ms.topic: conceptual
ms.custom: devx-track-linux
author: guywi-ms
ms.author: guywild
ms.date: 04/25/2023
ms.reviewer: luki, mattmcinnes
---

# Troubleshoot issues with the Log Analytics agent for Linux

This article provides help in troubleshooting errors you might experience with the Log Analytics agent for Linux in Azure Monitor.

## Log Analytics Troubleshooting Tool

The Log Analytics agent for Linux Troubleshooting Tool is a script designed to help find and diagnose issues with the Log Analytics agent. It's automatically included with the agent upon installation. Running the tool should be the first step in diagnosing an issue.

### Use the Troubleshooting Tool

To run the Troubleshooting Tool, paste the following command into a terminal window on a machine with the Log Analytics agent:

`sudo /opt/microsoft/omsagent/bin/troubleshooter`

### Manual installation

The Troubleshooting Tool is automatically included when the Log Analytics agent is installed. If installation fails in any way, you can also install the tool manually:

1. Ensure that the [GNU Project Debugger (GDB)](https://www.gnu.org/software/gdb/) is installed on the machine because the troubleshooter relies on it.
1. Copy the troubleshooter bundle onto your machine: `wget https://raw.github.com/microsoft/OMS-Agent-for-Linux/master/source/code/troubleshooter/omsagent_tst.tar.gz`
1. Unpack the bundle: `tar -xzvf omsagent_tst.tar.gz`
1. Run the manual installation: `sudo ./install_tst`

### Scenarios covered

The Troubleshooting Tool checks the following scenarios:

- The agent is unhealthy; the heartbeat doesn't work properly.
- The agent doesn't start or can't connect to Log Analytics.
- The agent Syslog isn't working.
- The agent has high CPU or memory usage.
- The agent has installation issues.
- The agent custom logs aren't working.
- Agent logs can't be collected.

For more information, see the [Troubleshooting Tool documentation on GitHub](https://github.com/microsoft/OMS-Agent-for-Linux/blob/master/docs/Troubleshooting-Tool.md).

 > [!NOTE]
 > Run the Log Collector tool when you experience an issue. Having the logs initially will help our support team troubleshoot your issue faster.

## Purge and reinstall the Linux agent

A clean reinstall of the agent fixes most issues. This task might be the first suggestion from our support team to get the agent into an uncorrupted state. Running the Troubleshooting Tool and Log Collector tool and attempting a clean reinstall helps to solve issues more quickly.

1. Download the purge script:
   
   `$ wget https://raw.githubusercontent.com/microsoft/OMS-Agent-for-Linux/master/tools/purge_omsagent.sh`
1. Run the purge script (with sudo permissions):
   
   `$ sudo sh purge_omsagent.sh`

## Important log locations and the Log Collector tool

 File | Path
 ---- | -----
 Log Analytics agent for Linux log file | `/var/opt/microsoft/omsagent/<workspace id>/log/omsagent.log`
 Log Analytics agent configuration log file | `/var/opt/microsoft/omsconfig/omsconfig.log`

 We recommend that you use the Log Collector tool to retrieve important logs for troubleshooting or before you submit a GitHub issue. For more information about the tool and how to run it, see [OMS Linux Agent Log Collector](https://github.com/Microsoft/OMS-Agent-for-Linux/blob/master/tools/LogCollector/OMS_Linux_Agent_Log_Collector.md).

## Important configuration files

 Category | File location
 ----- | -----
 Syslog | `/etc/syslog-ng/syslog-ng.conf` or `/etc/rsyslog.conf` or `/etc/rsyslog.d/95-omsagent.conf`
 Performance, Nagios, Zabbix, Log Analytics output and general agent | `/etc/opt/microsoft/omsagent/<workspace id>/conf/omsagent.conf`
 Extra configurations | `/etc/opt/microsoft/omsagent/<workspace id>/conf/omsagent.d/*.conf`

 > [!NOTE]
 > Editing configuration files for performance counters and Syslog is overwritten if the collection is configured from the [agent's configuration](../agents/agent-data-sources.md#configure-data-sources) in the Azure portal for your workspace. To disable configuration for all agents, disable collection from **Legacy agents management**. For a single agent, run the following script:
>
> `sudo /opt/microsoft/omsconfig/Scripts/OMS_MetaConfigHelper.py --disable && sudo rm /etc/opt/omi/conf/omsconfig/configuration/Current.mof* /etc/opt/omi/conf/omsconfig/configuration/Pending.mof*`

## Installation error codes

| Error code | Meaning |
| --- | --- |
| NOT_DEFINED | Because the necessary dependencies aren't installed, the auoms auditd plug-in won't be installed. Installation of auoms failed. Install package auditd. |
| 2 | Invalid option provided to the shell bundle. Run `sudo sh ./omsagent-*.universal*.sh --help` for usage. |
| 3 | No option provided to the shell bundle. Run `sudo sh ./omsagent-*.universal*.sh --help` for usage. |
| 4 | Invalid package type *or* invalid proxy settings. The omsagent-*rpm*.sh packages can only be installed on RPM-based systems. The omsagent-*deb*.sh packages can only be installed on Debian-based systems. We recommend that you use the universal installer from the [latest release](agent-linux.md#agent-install-package). Also review to verify your proxy settings. |
| 5 | The shell bundle must be executed as root *or* there was a 403 error returned during onboarding. Run your command by using `sudo`. |
| 6 | Invalid package architecture *or* there was a 200 error returned during onboarding. The omsagent-\*x64.sh packages can only be installed on 64-bit systems. The omsagent-\*x86.sh packages can only be installed on 32-bit systems. Download the correct package for your architecture from the [latest release](https://github.com/Microsoft/OMS-Agent-for-Linux/releases/latest). |
| 17 | Installation of OMS package failed. Look through the command output for the root failure. |
| 18 | Installation of OMSConfig package failed. Look through the command output for the root failure. |
| 19 | Installation of OMI package failed. Look through the command output for the root failure. |
| 20 | Installation of SCX package failed. Look through the command output for the root failure. |
| 21 | Installation of Provider kits failed. Look through the command output for the root failure. |
| 22 | Installation of bundled package failed. Look through the command output for the root failure |
| 23 | SCX or OMI package already installed. Use `--upgrade` instead of `--install` to install the shell bundle. |
| 30 | Internal bundle error. File a [GitHub issue](https://github.com/Microsoft/OMS-Agent-for-Linux/issues) with details from the output. |
| 55 | Unsupported openssl version *or* can't connect to Azure Monitor *or* dpkg is locked *or* missing curl program. |
| 61 | Missing Python ctypes library. Install the Python ctypes library or package (python-ctypes). |
| 62 | Missing tar program. Install tar. |
| 63 | Missing sed program. Install sed. |
| 64 | Missing curl program. Install curl. |
| 65 | Missing gpg program. Install gpg. |

## Onboarding error codes

| Error code | Meaning |
| --- | --- |
| 2 | Invalid option provided to the omsadmin script. Run `sudo sh /opt/microsoft/omsagent/bin/omsadmin.sh -h` for usage. |
| 3 | Invalid configuration provided to the omsadmin script. Run `sudo sh /opt/microsoft/omsagent/bin/omsadmin.sh -h` for usage. |
| 4 | Invalid proxy provided to the omsadmin script. Verify the proxy and see our [documentation for using an HTTP proxy](./log-analytics-agent.md#firewall-requirements). |
| 5 | 403 HTTP error received from Azure Monitor. See the full output of the omsadmin script for details. |
| 6 | Non-200 HTTP error received from Azure Monitor. See the full output of the omsadmin script for details. |
| 7 | Unable to connect to Azure Monitor. See the full output of the omsadmin script for details. |
| 8 | Error onboarding to Log Analytics workspace. See the full output of the omsadmin script for details. |
| 30 | Internal script error. File a [GitHub issue](https://github.com/Microsoft/OMS-Agent-for-Linux/issues) with details from the output. |
| 31 | Error generating agent ID. File a [GitHub issue](https://github.com/Microsoft/OMS-Agent-for-Linux/issues) with details from the output. |
| 32 | Error generating certificates. See the full output of the omsadmin script for details. |
| 33 | Error generating metaconfiguration for omsconfig. File a [GitHub issue](https://github.com/Microsoft/OMS-Agent-for-Linux/issues) with details from the output. |
| 34 | Metaconfiguration generation script not present. Retry onboarding with `sudo sh /opt/microsoft/omsagent/bin/omsadmin.sh -w <Workspace ID> -s <Workspace Key>`. |

## Enable debug logging

### OMS output plug-in debug

 FluentD allows for plug-in-specific logging levels that allow you to specify different log levels for inputs and outputs. To specify a different log level for OMS output, edit the general agent configuration at `/etc/opt/microsoft/omsagent/<workspace id>/conf/omsagent.conf`.

 In the OMS output plug-in, before the end of the configuration file, change the `log_level` property from `info` to `debug`:

```
<match oms.** docker.**>
  type out_oms
  log_level debug
  num_threads 5
  buffer_chunk_limit 5m
  buffer_type file
  buffer_path /var/opt/microsoft/omsagent/<workspace id>/state/out_oms*.buffer
  buffer_queue_limit 10
  flush_interval 20s
  retry_limit 10
  retry_wait 30s
</match>
```

Debug logging allows you to see batched uploads to Azure Monitor separated by type, number of data items, and time taken to send.

Here's an example debug-enabled log:

```
Success sending oms.nagios x 1 in 0.14s
Success sending oms.omi x 4 in 0.52s
Success sending oms.syslog.authpriv.info x 1 in 0.91s
```

### Verbose output

Instead of using the OMS output plug-in, you can output data items directly to `stdout`, which is visible in the Log Analytics agent for Linux log file.

In the Log Analytics general agent configuration file at `/etc/opt/microsoft/omsagent/<workspace id>/conf/omsagent.conf`, comment out the OMS output plug-in by adding a `#` in front of each line:

```
#<match oms.** docker.**>
#  type out_oms
#  log_level info
#  num_threads 5
#  buffer_chunk_limit 5m
#  buffer_type file
#  buffer_path /var/opt/microsoft/omsagent/<workspace id>/state/out_oms*.buffer
#  buffer_queue_limit 10
#  flush_interval 20s
#  retry_limit 10
#  retry_wait 30s
#</match>
```

Below the output plug-in, uncomment the following section by removing the `#` in front of each line:

```
<match **>
  type stdout
</match>
```

## Issue: Unable to connect through proxy to Azure Monitor

### Probable causes

* The proxy specified during onboarding was incorrect.
* The Azure Monitor and Azure Automation service endpoints aren't included in the approved list in your datacenter.

### Resolution

1. Reonboard to Azure Monitor with the Log Analytics agent for Linux by using the following command with the option `-v` enabled. It allows verbose output of the agent connecting through the proxy to Azure Monitor:
`/opt/microsoft/omsagent/bin/omsadmin.sh -w <Workspace ID> -s <Workspace Key> -p <Proxy Conf> -v`

1. Review the section [Update proxy settings](agent-manage.md#update-proxy-settings) to verify you've properly configured the agent to communicate through a proxy server.

1. Double-check that the endpoints outlined in the Azure Monitor [network firewall requirements](./log-analytics-agent.md#firewall-requirements) list are added to an allowlist correctly. If you use Azure Automation, the necessary network configuration steps are also linked above.

## Issue: You receive a 403 error when trying to onboard

### Probable causes

* Date and time are incorrect on the Linux server.
* The workspace ID and workspace key aren't correct.

### Resolution

1. Check the time on your Linux server with the command date. If the time is +/- 15 minutes from the current time, onboarding fails. To correct this situation, update the date and/or time zone of your Linux server.
1. Verify that you've installed the latest version of the Log Analytics agent for Linux. The newest version now notifies you if time skew is causing the onboarding failure.
1. Reonboard by using the correct workspace ID and workspace key in the installation instructions earlier in this article.

## Issue: You see a 500 and 404 error in the log file right after onboarding

This is a known issue that occurs on the first upload of Linux data into a Log Analytics workspace. This issue doesn't affect data being sent or service experience.

## Issue: You see omiagent using 100% CPU

### Probable causes

A regression in nss-pem package [v1.0.3-5.el7](https://centos.pkgs.org/7/centos-x86_64/nss-pem-1.0.3-7.el7.x86_64.rpm.html) caused a severe performance issue. We've been seeing this issue come up a lot in Redhat/CentOS 7.x distributions. To learn more about this issue, see [1667121 Performance regression in libcurl](https://bugzilla.redhat.com/show_bug.cgi?id=1667121).

Performance-related bugs don't happen all the time, and they're difficult to reproduce. If you experience such an issue with omiagent, use the script `omiHighCPUDiagnostics.sh`, which will collect the stack trace of the omiagent when it exceeds a certain threshold.

1. Download the script: <br/>
`wget https://raw.githubusercontent.com/microsoft/OMS-Agent-for-Linux/master/tools/LogCollector/source/omiHighCPUDiagnostics.sh`

1. Run diagnostics for 24 hours with 30% CPU threshold: <br/>
`bash omiHighCPUDiagnostics.sh --runtime-in-min 1440 --cpu-threshold 30`

1. Callstack will be dumped in the omiagent_trace file. If you notice many curl and NSS function calls, follow these resolution steps.

### Resolution

1. Upgrade the nss-pem package to [v1.0.3-5.el7_6.1](https://centos.pkgs.org/7/centos-x86_64/nss-pem-1.0.3-7.el7.x86_64.rpm.html): <br/>
`sudo yum upgrade nss-pem`

1. If nss-pem isn't available for upgrade, which mostly happens on CentOS, downgrade curl to 7.29.0-46. If you run "yum update" by mistake, curl will be upgraded to 7.29.0-51 and the issue will happen again: <br/>
`sudo yum downgrade curl libcurl`

1. Restart OMI: <br/>
`sudo scxadmin -restart`

## Issue: You're not seeing forwarded Syslog messages

### Probable causes

* The configuration applied to the Linux server doesn't allow collection of the sent facilities or log levels.
* Syslog isn't being forwarded correctly to the Linux server.
* The number of messages being forwarded per second is too great for the base configuration of the Log Analytics agent for Linux to handle.

### Resolution

* Verify the configuration in the Log Analytics workspace for Syslog has all the facilities and the correct log levels. Review [configure Syslog collection in the Azure portal](data-sources-syslog.md#configure-syslog-in-the-azure-portal).
* Verify the native Syslog messaging daemons (`rsyslog`, `syslog-ng`) can receive the forwarded messages.
* Check firewall settings on the Syslog server to ensure that messages aren't being blocked.
* Simulate a Syslog message to Log Analytics by using a `logger` command: <br/>
  `logger -p local0.err "This is my test message"`

## Issue: You're receiving Errno address already in use in omsagent log file

You see `[error]: unexpected error error_class=Errno::EADDRINUSE error=#<Errno::EADDRINUSE: Address already in use - bind(2) for "127.0.0.1" port 25224>` in omsagent.log.

### Probable causes

This error indicates that the Linux diagnostic extension (LAD) is installed side by side with the Log Analytics Linux VM extension. It's using the same port for Syslog data collection as omsagent.

### Resolution

1. As root, execute the following commands. Note that 25224 is an example, and it's possible that in your environment you see a different port number used by LAD.

    ```
    /opt/microsoft/omsagent/bin/configure_syslog.sh configure LAD 25229

    sed -i -e 's/25224/25229/' /etc/opt/microsoft/omsagent/LAD/conf/omsagent.d/syslog.conf
    ```

    You then need to edit the correct `rsyslogd` or `syslog_ng` config file and change the LAD-related configuration to write to port 25229.

1. If the VM is running `rsyslogd`, the file to be modified is `/etc/rsyslog.d/95-omsagent.conf` (if it exists, else `/etc/rsyslog`). If the VM is running `syslog_ng`, the file to be modified is `/etc/syslog-ng/syslog-ng.conf`.
1. Restart omsagent `sudo /opt/microsoft/omsagent/bin/service_control restart`.
1. Restart the Syslog service.

## Issue: You're unable to uninstall omsagent using the purge option

### Probable causes

* The Linux diagnostic extension is installed.
* The Linux diagnostic extension was installed and uninstalled, but you still see an error about omsagent being used by mdsd and it can't be removed.

### Resolution

1. Uninstall the Linux diagnostic extension.
1. Remove Linux diagnostic extension files from the machine if they're present in the following location: `/var/lib/waagent/Microsoft.Azure.Diagnostics.LinuxDiagnostic-<version>/` and `/var/opt/microsoft/omsagent/LAD/`.

## Issue: You can't see any Nagios data

### Probable causes

* The omsagent user doesn't have permissions to read from the Nagios log file.
* The Nagios source and filter haven't been uncommented from the omsagent.conf file.

### Resolution

1. Add the omsagent user to read from the Nagios file by following these [instructions](https://github.com/Microsoft/OMS-Agent-for-Linux/blob/master/docs/OMS-Agent-for-Linux.md#nagios-alerts).
1. In the Log Analytics agent for Linux general configuration file at `/etc/opt/microsoft/omsagent/<workspace id>/conf/omsagent.conf`, ensure that *both* the Nagios source and filter are uncommented.

    ```
    <source>
      type tail
      path /var/log/nagios/nagios.log
      format none
      tag oms.nagios
    </source>

    <filter oms.nagios>
      type filter_nagios_log
    </filter>
    ```

## Issue: You aren't seeing any Linux data

### Probable causes

* Onboarding to Azure Monitor failed.
* Connection to Azure Monitor is blocked.
* Virtual machine was rebooted.
* OMI package was manually upgraded to a newer version compared to what was installed by the Log Analytics agent for Linux package.
* OMI is frozen, blocking the OMS agent.
* DSC resource logs *class not found* error in `omsconfig.log` log file.
* Log Analytics agent for data is backed up.
* DSC logs *Current configuration doesn't exist. Execute Start-DscConfiguration command with -Path parameter to specify a configuration file and create a current configuration first.* in `omsconfig.log` log file, but no log message exists about `PerformRequiredConfigurationChecks` operations.

### Resolution

1. Install all dependencies like the auditd package.
1. Check if onboarding to Azure Monitor was successful by checking if the following file exists: `/etc/opt/microsoft/omsagent/<workspace id>/conf/omsadmin.conf`. If it wasn't, reonboard by using the omsadmin.sh command-line [instructions](https://github.com/Microsoft/OMS-Agent-for-Linux/blob/master/docs/OMS-Agent-for-Linux.md#onboarding-using-the-command-line).
1. If you're using a proxy, check the preceding proxy troubleshooting steps.
1. In some Azure distribution systems, the omid OMI server daemon doesn't start after the virtual machine is rebooted. If this is the case, you won't see Audit, ChangeTracking, or UpdateManagement solution-related data. The workaround is to manually start the OMI server by running `sudo /opt/omi/bin/service_control restart`.
1. After the OMI package is manually upgraded to a newer version, it must be manually restarted for the Log Analytics agent to continue functioning. This step is required for some distros where the OMI server doesn't automatically start after it's upgraded. Run `sudo /opt/omi/bin/service_control restart` to restart the OMI.
   
   In some situations, the OMI can become frozen. The OMS agent might enter a blocked state waiting for the OMI, which blocks all data collection. The OMS agent process will be running but there will be no activity, which is evidenced by no new log lines (such as sent heartbeats) present in `omsagent.log`. Restart the OMI with `sudo /opt/omi/bin/service_control restart` to recover the agent.
1. If you see a DSC resource *class not found* error in omsconfig.log, run `sudo /opt/omi/bin/service_control restart`.
1. In some cases, when the Log Analytics agent for Linux can't talk to Azure Monitor, data on the agent is backed up to the full buffer size of 50 MB. The agent should be restarted by running the following command: `/opt/microsoft/omsagent/bin/service_control restart`.

    > [!NOTE]
    > This issue is fixed in agent version 1.1.0-28 or later.
    >

   * If the `omsconfig.log` log file doesn't indicate that `PerformRequiredConfigurationChecks` operations are running periodically on the system, there might be a problem with the cron job/service. Make sure the cron job exists under `/etc/cron.d/OMSConsistencyInvoker`. If needed, run the following commands to create the cron job:

        ```
        mkdir -p /etc/cron.d/
        echo "*/15 * * * * omsagent /opt/omi/bin/OMSConsistencyInvoker >/dev/null 2>&1" | sudo tee /etc/cron.d/OMSConsistencyInvoker
        ```
    
    * Also, make sure the cron service is running. You can use `service cron status` with Debian, Ubuntu, and SUSE or `service crond status` with RHEL, CentOS, and Oracle Linux to check the status of this service. If the service doesn't exist, you can install the binaries and start the service by using the following instructions:

        **Ubuntu/Debian**
    
        ```
        # To Install the service binaries
        sudo apt-get install -y cron
        # To start the service
        sudo service cron start
        ```
    
        **SUSE**
    
        ```
        # To Install the service binaries
        sudo zypper in cron -y
        # To start the service
        sudo systemctl enable cron
        sudo systemctl start cron
        ```
    
        **RHEL/CentOS**
    
        ```
        # To Install the service binaries
        sudo yum install -y crond
        # To start the service
        sudo service crond start
        ```
    
        **Oracle Linux**
    
        ```
        # To Install the service binaries
        sudo yum install -y cronie
        # To start the service
        sudo service crond start
        ```

## Issue: When you configure collection from the portal for Syslog or Linux performance counters, the settings aren't applied

### Probable causes

* The Log Analytics agent for Linux hasn't picked up the latest configuration.
* The changed settings in the portal weren't applied.

### Resolution

**Background:** `omsconfig` is the Log Analytics agent for Linux configuration agent that looks for new portal-side configuration every five minutes. This configuration is then applied to the Log Analytics agent for Linux configuration files located at /etc/opt/microsoft/omsagent/conf/omsagent.conf.

In some cases, the Log Analytics agent for Linux configuration agent might not be able to communicate with the portal configuration service. This scenario results in the latest configuration not being applied.

1. Check that the `omsconfig` agent is installed by running `dpkg --list omsconfig` or `rpm -qi omsconfig`. If it isn't installed, reinstall the latest version of the Log Analytics agent for Linux.

1. Check that the `omsconfig` agent can communicate with Azure Monitor by running the following command: `sudo su omsagent -c 'python /opt/microsoft/omsconfig/Scripts/GetDscConfiguration.py'`. This command returns the configuration that the agent receives from the service, including Syslog settings, Linux performance counters, and custom logs. If this command fails, run the following command: `sudo su omsagent -c 'python /opt/microsoft/omsconfig/Scripts/PerformRequiredConfigurationChecks.py'`. This command forces the omsconfig agent to talk to Azure Monitor and retrieve the latest configuration.

## Issue: You aren't seeing any custom log data

### Probable causes

* Onboarding to Azure Monitor failed.
* The setting **Apply the following configuration to my Linux Servers** hasn't been selected.
* `omsconfig` hasn't picked up the latest custom log configuration from the service.
* The Log Analytics agent for Linux user `omsagent` is unable to access the custom log due to permissions or not being found. You might see the following errors:
  * `[DATETIME] [warn]: file not found. Continuing without tailing it.`
  * `[DATETIME] [error]: file not accessible by omsagent.`
* Known issue with race condition fixed in Log Analytics agent for Linux version 1.1.0-217.

### Resolution

1. Verify onboarding to Azure Monitor was successful by checking if the following file exists: `/etc/opt/microsoft/omsagent/<workspace id>/conf/omsadmin.conf`. If not, either:

   1. Reonboard by using the omsadmin.sh command line [instructions](https://github.com/Microsoft/OMS-Agent-for-Linux/blob/master/docs/OMS-Agent-for-Linux.md#onboarding-using-the-command-line).
   1. Under **Advanced Settings** in the Azure portal, ensure that the setting **Apply the following configuration to my Linux Servers** is enabled.

1. Check that the `omsconfig` agent can communicate with Azure Monitor by running the following command: `sudo su omsagent -c 'python /opt/microsoft/omsconfig/Scripts/GetDscConfiguration.py'`. This command returns the configuration that the agent receives from the service, including Syslog settings, Linux performance counters, and custom logs. If this command fails, run the following command: `sudo su omsagent -c 'python /opt/microsoft/omsconfig/Scripts/PerformRequiredConfigurationChecks.py'`. This command forces the `omsconfig` agent to talk to Azure Monitor and retrieve the latest configuration.

**Background:** Instead of the Log Analytics agent for Linux running as a privileged user - `root`, the agent runs as the `omsagent` user. In most cases, explicit permission must be granted to this user for certain files to be read. To grant permission to `omsagent` user, run the following commands:

1. Add the `omsagent` user to the specific group: `sudo usermod -a -G <GROUPNAME> <USERNAME>`.
1. Grant universal read access to the required file: `sudo chmod -R ugo+rx <FILE DIRECTORY>`.

There's a known issue with a race condition with the Log Analytics agent for Linux version earlier than 1.1.0-217. After you update to the latest agent, run the following command to get the latest version of the output plug-in: `sudo cp /etc/opt/microsoft/omsagent/sysconf/omsagent.conf /etc/opt/microsoft/omsagent/<workspace id>/conf/omsagent.conf`.

## Issue: You're trying to reonboard to a new workspace

When you try to reonboard an agent to a new workspace, the Log Analytics agent configuration needs to be cleaned up before reonboarding. To clean up old configuration from the agent, run the shell bundle with `--purge`:

```
sudo sh ./omsagent-*.universal.x64.sh --purge
```

Or

```
sudo sh ./onboard_agent.sh --purge
```

You can continue to reonboard after you use the `--purge` option.

## Issue: Log Analytics agent extension in the Azure portal is marked with a failed state: Provisioning failed

### Probable causes

* The Log Analytics agent has been removed from the operating system.
* The Log Analytics agent service is down, disabled, or not configured.

### Resolution

1. Remove the extension from the Azure portal.
1. Install the agent by following the [instructions](../vm/monitor-virtual-machine.md).
1. Restart the agent by running the following command: <br/> `sudo /opt/microsoft/omsagent/bin/service_control restart`.
1. Wait several minutes until the provisioning state changes to **Provisioning succeeded**.

## Issue: The Log Analytics agent upgrade on-demand

### Probable causes

The Log Analytics agent packages on the host are outdated.

### Resolution

1. Check for the latest release on [this GitHub page](https://github.com/Microsoft/OMS-Agent-for-Linux/releases/).
1. Download the installation script (1.4.2-124 is an example version):

    ```
    wget https://github.com/Microsoft/OMS-Agent-for-Linux/releases/download/OMSAgent_GA_v1.4.2-124/omsagent-1.4.2-124.universal.x64.sh
    ```

1. Upgrade packages by executing `sudo sh ./omsagent-*.universal.x64.sh --upgrade`.

## Issue: Installation is failing and says Python2 can't support ctypes, even though Python3 is being used

### Probable causes

For this known issue, if the VM's language isn't English, a check will fail when verifying which version of Python is being used. This issue leads to the agent always assuming Python2 is being used and failing if there's no Python2.

### Resolution

Change the VM's environmental language to English:

```
export LANG=en_US.UTF-8
```
