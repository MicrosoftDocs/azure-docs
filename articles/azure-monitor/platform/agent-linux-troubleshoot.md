---
title: Troubleshoot Azure Log Analytics Linux Agent | Microsoft Docs
description: Describe the symptoms, causes, and resolution for the most common issues with the Log Analytics agent for Linux in Azure Monitor.
services: log-analytics
documentationcenter: ''
author: mgoedtel
manager: carmonm
editor: ''
ms.assetid: 
ms.service: log-analytics
ms.workload: na
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.date: 11/13/2018
ms.author: magoedte
---

# How to troubleshoot issues with the Log Analytics agent for Linux 

This article provides help troubleshooting errors you might experience with the Log Analytics agent for Linux in Azure Monitor and suggests possible solutions to resolve them.

If none of these steps work for you, the following support channels are also available:

* Customers with Premier support benefits can open a support request with [Premier](https://premier.microsoft.com/).
* Customers with Azure support agreements can open a support request [in the Azure portal](https://manage.windowsazure.com/?getsupport=true).
* Diagnose OMI Problems with the [OMI troubleshooting guide](https://github.com/Microsoft/omi/blob/master/Unix/doc/diagnose-omi-problems.md).
* File a [GitHub Issue](https://github.com/Microsoft/OMS-Agent-for-Linux/issues).
* Visit the Log Analytics Feedback page to review submitted ideas and bugs [https://aka.ms/opinsightsfeedback](https://aka.ms/opinsightsfeedback) or file a new one.  

## Important log locations and Log Collector tool

 File | Path
 ---- | -----
 Log Analytics agent for Linux log file | `/var/opt/microsoft/omsagent/<workspace id>/log/omsagent.log`
 Log Analytics agent configuration log file | `/var/opt/microsoft/omsconfig/omsconfig.log`

 We recommend you to use our log collector tool to retrieve important logs for troubleshooting or before submitting a GitHub issue. You can read more about the tool and how to run it [here](https://github.com/Microsoft/OMS-Agent-for-Linux/blob/master/tools/LogCollector/OMS_Linux_Agent_Log_Collector.md).

## Important configuration files

 Category | File Location
 ----- | -----
 Syslog | `/etc/syslog-ng/syslog-ng.conf` or `/etc/rsyslog.conf` or `/etc/rsyslog.d/95-omsagent.conf`
 Performance, Nagios, Zabbix, Log Analytics output and general agent | `/etc/opt/microsoft/omsagent/<workspace id>/conf/omsagent.conf`
 Additional configurations | `/etc/opt/microsoft/omsagent/<workspace id>/conf/omsagent.d/*.conf`

 >[!NOTE]
 >Editing configuration files for performance counters and Syslog is overwritten if the collection is configured from the [data menu Log Analytics Advanced Settings](../../azure-monitor/platform/agent-data-sources.md#configuring-data-sources) in the Azure portal for your workspace. To disable configuration for all agents, disable collection from Log Analytics **Advanced Settings** or for a single agent run the following:  
> `sudo su omsagent -c /opt/microsoft/omsconfig/Scripts/OMS_MetaConfigHelper.py --disable`

## Installation error codes

| Error Code | Meaning |
| --- | --- |
| NOT_DEFINED | Because the necessary dependencies are not installed, the auoms auditd plugin will not be installed | Installation of auoms failed, install package auditd. |
| 2 | Invalid option provided to the shell bundle. Run `sudo sh ./omsagent-*.universal*.sh --help` for usage |
| 3 | No option provided to the shell bundle. Run `sudo sh ./omsagent-*.universal*.sh --help` for usage. |
| 4 | Invalid package type OR invalid proxy settings; omsagent-*rpm*.sh packages can only be installed on RPM-based systems, and omsagent-*deb*.sh packages can only be installed on Debian-based systems. It is recommend you use the universal installer from the [latest release](../../azure-monitor/learn/quick-collect-linux-computer.md#install-the-agent-for-linux). Also review to verify your proxy settings. |
| 5 | The shell bundle must be executed as root OR there was 403 error returned during onboarding. Run your command using `sudo`. |
| 6 | Invalid package architecture OR there was error 200 error returned during onboarding; omsagent-*x64.sh packages can only be installed on 64-bit systems, and omsagent-*x86.sh packages can only be installed on 32-bit systems. Download the correct package for your architecture from the [latest release](https://github.com/Microsoft/OMS-Agent-for-Linux/releases/latest). |
| 17 | Installation of OMS package failed. Look through the command output for the root failure. |
| 19 | Installation of OMI package failed. Look through the command output for the root failure. |
| 20 | Installation of SCX package failed. Look through the command output for the root failure. |
| 21 | Installation of Provider kits failed. Look through the command output for the root failure. |
| 22 | Installation of bundled package failed. Look through the command output for the root failure |
| 23 | SCX or OMI package already installed. Use `--upgrade` instead of `--install` to install the shell bundle. |
| 30 | Internal bundle error. File a [GitHub Issue](https://github.com/Microsoft/OMS-Agent-for-Linux/issues) with details from the output. |
| 55 | Unsupported openssl version OR Cannot connect to Azure Monitor OR dpkg is locked OR missing curl program. |
| 61 | Missing Python ctypes library. Install the Python ctypes library or package (python-ctypes). |
| 62 | Missing tar program, install tar. |
| 63 | Missing sed program, install sed. |
| 64 | Missing curl program, install curl. |
| 65 | Missing gpg program, install gpg. |

## Onboarding error codes

| Error Code | Meaning |
| --- | --- |
| 2 | Invalid option provided to the omsadmin script. Run `sudo sh /opt/microsoft/omsagent/bin/omsadmin.sh -h` for usage. |
| 3 | Invalid configuration provided to the omsadmin script. Run `sudo sh /opt/microsoft/omsagent/bin/omsadmin.sh -h` for usage. |
| 4 | Invalid proxy provided to the omsadmin script. Verify the proxy and see our [documentation for using an HTTP proxy](log-analytics-agent.md#network-firewall-requirements). |
| 5 | 403 HTTP error received from Azure Monitor. See the full output of the omsadmin script for details. |
| 6 | Non-200 HTTP error received from Azure Monitor. See the full output of the omsadmin script for details. |
| 7 | Unable to connect to Azure Monitor. See the full output of the omsadmin script for details. |
| 8 | Error onboarding to Log Analytics workspace. See the full output of the omsadmin script for details. |
| 30 | Internal script error. File a [GitHub Issue](https://github.com/Microsoft/OMS-Agent-for-Linux/issues) with details from the output. |
| 31 | Error generating agent ID. File a [GitHub Issue](https://github.com/Microsoft/OMS-Agent-for-Linux/issues) with details from the output. |
| 32 | Error generating certificates. See the full output of the omsadmin script for details. |
| 33 | Error generating metaconfiguration for omsconfig. File a [GitHub Issue](https://github.com/Microsoft/OMS-Agent-for-Linux/issues) with details from the output. |
| 34 | Metaconfiguration generation script not present. Retry onboarding with `sudo sh /opt/microsoft/omsagent/bin/omsadmin.sh -w <Workspace ID> -s <Workspace Key>`. |

## Enable debug logging
### OMS output plugin debug
 FluentD allows for plugin-specific logging levels allowing you to specify different log levels for inputs and outputs. To specify a different log level for OMS output, edit the general agent configuration at `/etc/opt/microsoft/omsagent/<workspace id>/conf/omsagent.conf`.  

 In the OMS output plugin, before the end of the configuration file, change the `log_level` property from `info` to `debug`:

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

Debug logging allows you to see batched uploads to Azure Monitor separated by type, number of data items, and time taken to send:

*Example debug enabled log:*

```
Success sending oms.nagios x 1 in 0.14s
Success sending oms.omi x 4 in 0.52s
Success sending oms.syslog.authpriv.info x 1 in 0.91s
```

### Verbose output
Instead of using the OMS output plugin you can also output data items directly to `stdout`, which is visible in the Log Analytics agent for Linux log file.

In the Log Analytics general agent configuration file at `/etc/opt/microsoft/omsagent/<workspace id>/conf/omsagent.conf`, comment out the OMS output plugin by adding a `#` in front of each line:

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

Below the output plugin, uncomment the following section by removing the `#` in front of each line:

```
<match **>
  type stdout
</match>
```

## Issue:  Unable to connect through proxy to Azure Monitor

### Probable causes
* The proxy specified during onboarding was incorrect
* The Azure Monitor and Azure Automation Service Endpoints are not whitelisted in your datacenter 

### Resolution
1. Reonboard to Azure Monitor with the Log Analytics agent for Linux by using the following command with the option `-v` enabled. It allows verbose output of the agent connecting through the proxy to Azure Monitor. 
`/opt/microsoft/omsagent/bin/omsadmin.sh -w <Workspace ID> -s <Workspace Key> -p <Proxy Conf> -v`

2. Review the section [Update proxy settings](agent-manage.md#update-proxy-settings) to verify you have properly configured the agent to communicate through a proxy server.    
* Double check that the following Azure Monitor endpoints are whitelisted:

    |Agent Resource| Ports | Direction |
    |------|---------|----------|  
    |*.ods.opinsights.azure.com | Port 443| Inbound and outbound |  
    |*.oms.opinsights.azure.com | Port 443| Inbound and outbound |  
    |*.blob.core.windows.net | Port 443| Inbound and outbound |  
    |*.azure-automation.net | Port 443| Inbound and outbound | 

## Issue: You receive a 403 error when trying to onboard

### Probable causes
* Date and Time is incorrect on Linux Server 
* Workspace ID and Workspace Key used are not correct

### Resolution

1. Check the time on your Linux server with the command date. If the time is +/- 15 minutes from current time, then onboarding fails. To correct this update the date and/or timezone of your Linux server. 
2. Verify you have installed the latest version of the Log Analytics agent for Linux.  The newest version now notifies you if time skew is causing the onboarding failure.
3. Reonboard using correct Workspace ID and Workspace Key following the installation instructions earlier in this article.

## Issue: You see a 500 and 404 error in the log file right after onboarding
This is a known issue that occurs on first upload of Linux data into a Log Analytics workspace. This does not affect data being sent or service experience.


## Issue: You see omiagent using 100% CPU

### Probable causes
A regression in nss-pem package [v1.0.3-5.el7](https://centos.pkgs.org/7/centos-x86_64/nss-pem-1.0.3-5.el7.x86_64.rpm.html) caused a severe performance issue, that we've been seeing come up a lot in Redhat/Centos 7.x distributions. To learn more about this issue, check the following documentation: Bug [1667121 Performance regression in libcurl](https://bugzilla.redhat.com/show_bug.cgi?id=1667121).

Performance related bugs don't happen all the time, and they are very difficult to reproduce. If you experience such issue with omiagent you should use the script omiHighCPUDiagnostics.sh which will collect the stack trace of the omiagent when exceeding a certain threshold.

1. Download the script <br/>
`wget https://raw.githubusercontent.com/microsoft/OMS-Agent-for-Linux/master/tools/LogCollector/source/omiHighCPUDiagnostics.sh`

2. Run diagnostics for 24 hours with 30% CPU threshold <br/>
`bash omiHighCPUDiagnostics.sh --runtime-in-min 1440 --cpu-threshold 30`

3. Callstack will be dumped in omiagent_trace file, If you notice many Curl and NSS function calls, follow resolution steps below.

### Resolution (step by step)

1. Upgrade the nss-pem package to [v1.0.3-5.el7_6.1](https://centos.pkgs.org/7/centos-updates-x86_64/nss-pem-1.0.3-5.el7_6.1.x86_64.rpm.html). <br/>
`sudo yum upgrade nss-pem`

2. If nss-pem is not available for upgrade (mostly happens on Centos), then downgrade curl to 7.29.0-46. If by mistake you run "yum update", then curl will be upgraded to 7.29.0-51 and the issue will happen again. <br/>
`sudo yum downgrade curl libcurl`

3. Restart OMI: <br/>
`sudo scxadmin -restart`

## Issue: You are not seeing any data in the Azure portal

### Probable causes

- Onboarding to Azure Monitor failed
- Connection to Azure Monitor is blocked
- Log Analytics agent for Linux data is backed up

### Resolution
1. Check if onboarding Azure Monitor was successful by checking if the following file exists: `/etc/opt/microsoft/omsagent/<workspace id>/conf/omsadmin.conf`
2. Reonboard using the `omsadmin.sh` command-line instructions
3. If using a proxy, refer to the proxy resolution steps provided earlier.
4. In some cases, when the Log Analytics agent for Linux cannot communicate with the service, data on the agent is queued to the full buffer size, which is 50 MB. The agent should be restarted by running the following command: `/opt/microsoft/omsagent/bin/service_control restart [<workspace id>]`. 

    >[!NOTE]
    >This issue is fixed in agent version 1.1.0-28 and later.


## Issue: You are not seeing forwarded Syslog messages 

### Probable causes
* The configuration applied to the Linux server does not allow collection of the sent facilities and/or log levels
* Syslog is not being forwarded correctly to the Linux server
* The number of messages being forwarded per second are too great for the base configuration of the Log Analytics agent for Linux to handle

### Resolution
* Verify the configuration in the Log Analytics workspace for Syslog has all the facilities and the correct log levels. Review [configure Syslog collection in the Azure portal](../../azure-monitor/platform/data-sources-syslog.md#configure-syslog-in-the-azure-portal)
* Verify the native syslog messaging daemons (`rsyslog`, `syslog-ng`) are able to receive the forwarded messages
* Check firewall settings on the Syslog server to ensure that messages are not being blocked
* Simulate a Syslog message to Log Analytics using `logger` command
  * `logger -p local0.err "This is my test message"`

## Issue: You are receiving Errno address already in use in omsagent log file
If you see `[error]: unexpected error error_class=Errno::EADDRINUSE error=#<Errno::EADDRINUSE: Address already in use - bind(2) for "127.0.0.1" port 25224>` in omsagent.log.

### Probable causes
This error indicates that the Linux Diagnostic extension (LAD) is installed side by side with the Log Analytics Linux VM extension, and it is using same port for syslog data collection as omsagent.

### Resolution
1. As root, execute the following commands (note that 25224 is an example and it is possible that in your environment you see a different port number used by LAD):

    ```
    /opt/microsoft/omsagent/bin/configure_syslog.sh configure LAD 25229

    sed -i -e 's/25224/25229/' /etc/opt/microsoft/omsagent/LAD/conf/omsagent.d/syslog.conf
    ```

    You then need to edit the correct `rsyslogd` or `syslog_ng` config file and change the LAD-related configuration to write to port 25229.

2. If the VM is running `rsyslogd`, the file to be modified is: `/etc/rsyslog.d/95-omsagent.conf` (if it exists, else `/etc/rsyslog`). If the VM is running `syslog_ng`, the file to be modified is: `/etc/syslog-ng/syslog-ng.conf`.
3. Restart omsagent `sudo /opt/microsoft/omsagent/bin/service_control restart`.
4. Restart syslog service.

## Issue: You are unable to uninstall omsagent using purge option

### Probable causes

* Linux Diagnostic Extension is installed
* Linux Diagnostic Extension was installed and uninstalled, but you still see an error about omsagent being used by mdsd and cannot be removed.

### Resolution
1. Uninstall the Linux Diagnostic Extension (LAD).
2. Remove Linux Diagnostic Extension files from the machine if they are present in the following location: `/var/lib/waagent/Microsoft.Azure.Diagnostics.LinuxDiagnostic-<version>/` and `/var/opt/microsoft/omsagent/LAD/`.

## Issue: You cannot see data any Nagios data 

### Probable causes
* Omsagent user does not have permissions to read from Nagios log file
* Nagios source and filter have not been uncommented from omsagent.conf file

### Resolution
1. Add omsagent user to read from Nagios file by following these [instructions](https://github.com/Microsoft/OMS-Agent-for-Linux/blob/master/docs/OMS-Agent-for-Linux.md#nagios-alerts).
2. In the Log Analytics agent for Linux general configuration file at `/etc/opt/microsoft/omsagent/<workspace id>/conf/omsagent.conf`, ensure that **both** the Nagios source and filter are uncommented.

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

## Issue: You are not seeing any Linux data 

### Probable causes
* Onboarding to Azure Monitor failed
* Connection to Azure Monitor is blocked
* Virtual machine was rebooted
* OMI package was manually upgraded to a newer version compared to what was installed by Log Analytics agent for Linux package
* DSC resource logs *class not found* error in `omsconfig.log` log file
* Log Analytics agent for data is backed up
* DSC logs *Current configuration does not exist. Execute Start-DscConfiguration command with -Path parameter to specify a configuration file and create a current configuration first.* in `omsconfig.log` log file, but no log message exists about `PerformRequiredConfigurationChecks` operations.

### Resolution
1. Install all dependencies like auditd package.
2. Check if onboarding to Azure Monitor was successful by checking if the following file exists: `/etc/opt/microsoft/omsagent/<workspace id>/conf/omsadmin.conf`.  If it was not, reonboard using the omsadmin.sh command line [instructions](https://github.com/Microsoft/OMS-Agent-for-Linux/blob/master/docs/OMS-Agent-for-Linux.md#onboarding-using-the-command-line).
4. If using a proxy, check proxy troubleshooting steps above.
5. In some Azure distribution systems, omid OMI server daemon does not start after the virtual machine is rebooted. This will result in not seeing Audit, ChangeTracking, or UpdateManagement solution-related data. The workaround is to manually start omi server by running `sudo /opt/omi/bin/service_control restart`.
6. After OMI package is manually upgraded to a newer version, it has to be manually restarted for Log Analytics agent to continue functioning. This step is required for some distros where OMI server does not automatically start after it is upgraded. Run `sudo /opt/omi/bin/service_control restart` to restart OMI.
7. If you see DSC resource *class not found* error in omsconfig.log, run `sudo /opt/omi/bin/service_control restart`.
8. In some cases, when the Log Analytics agent for Linux cannot talk to Azure Monitor, data on the agent is backed up to the full buffer size: 50 MB. The agent should be restarted by running the following command `/opt/microsoft/omsagent/bin/service_control restart`.

    >[!NOTE]
    >This issue is fixed in Agent version 1.1.0-28 or later
    >

* If `omsconfig.log` log file does not indicate that `PerformRequiredConfigurationChecks` operations are running periodically on the system, there might be a problem with the cron job/service. Make sure cron job exists under `/etc/cron.d/OMSConsistencyInvoker`. If needed run the following commands to create the cron job:

    ```
    mkdir -p /etc/cron.d/
    echo "*/15 * * * * omsagent /opt/omi/bin/OMSConsistencyInvoker >/dev/null 2>&1" | sudo tee /etc/cron.d/OMSConsistencyInvoker
    ```

    Also, make sure the cron service is running. You can use `service cron status` with Debian, Ubuntu, SUSE, or `service crond status` with RHEL, CentOS, Oracle Linux to check the status of this service. If the service does not exist, you can install the binaries and start the service using the following:

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

    **RHEL/CeonOS**

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

## Issue: When configuring collection from the portal for Syslog or Linux performance counters, the settings are not applied

### Probable causes
* The Log Analytics agent for Linux has not picked up the latest configuration
* The changed settings in the portal were not applied

### Resolution
**Background:** `omsconfig` is the Log Analytics agent for Linux configuration agent that looks for new portal-side configuration every five minutes. This configuration is then applied to the Log Analytics agent for Linux configuration files located at /etc/opt/microsoft/omsagent/conf/omsagent.conf.

* In some cases, the Log Analytics agent for Linux configuration agent might not be able to communicate with the portal configuration service resulting in latest configuration not being applied.
  1. Check that the `omsconfig` agent is installed by running `dpkg --list omsconfig` or `rpm -qi omsconfig`.  If it is not installed, reinstall the latest version of the Log Analytics agent for Linux.

  2. Check that the `omsconfig` agent can communicate with Azure Monitor by running the following command `sudo su omsagent -c 'python /opt/microsoft/omsconfig/Scripts/GetDscConfiguration.py'`. This command returns the configuration that agent receives from the service, including Syslog settings, Linux performance counters, and custom logs. If this command fails, run the following command `sudo su omsagent -c 'python /opt/microsoft/omsconfig/Scripts/PerformRequiredConfigurationChecks.py'`. This command forces the omsconfig agent to talk to Azure Monitor and retrieve  the latest configuration.

## Issue: You are not seeing any custom log data 

### Probable causes
* Onboarding to Azure Monitor failed.
* The setting **Apply the following configuration to my Linux Servers** has not been selected.
* omsconfig has not picked up the latest custom log configuration from the service.
* Log Analytics agent for Linux user `omsagent` is unable to access the custom log due to permissions or not being found.  You may see the following errors:
 * `[DATETIME] [warn]: file not found. Continuing without tailing it.`
 * `[DATETIME] [error]: file not accessible by omsagent.`
* Known Issue with Race Condition fixed in Log Analytics agent for Linux version 1.1.0-217

### Resolution
1. Verify onboarding to Azure Monitor was successful by checking if the following file exists: `/etc/opt/microsoft/omsagent/<workspace id>/conf/omsadmin.conf`. If not, either:  

  1. Reonboard using the omsadmin.sh command line [instructions](https://github.com/Microsoft/OMS-Agent-for-Linux/blob/master/docs/OMS-Agent-for-Linux.md#onboarding-using-the-command-line).
  2. Under **Advanced Settings** in the Azure portal, ensure that the setting **Apply the following configuration to my Linux Servers** is enabled.  

2. Check that the `omsconfig` agent can communicate with Azure Monitor by running the following command `sudo su omsagent -c 'python /opt/microsoft/omsconfig/Scripts/GetDscConfiguration.py'`.  This command returns the configuration that agent receives from the service, including Syslog settings, Linux performance counters, and custom logs. If this command fails, run the following command `sudo su omsagent -c 'python /opt/microsoft/omsconfig/Scripts/PerformRequiredConfigurationChecks.py`. This command forces the omsconfig agent to talk to Azure Monitor and retrieve the latest configuration.

**Background:** Instead of the Log Analytics agent for Linux running as a privileged user - `root`, the agent runs as the `omsagent` user. In most cases, explicit permission must be granted to this user in order for certain files to be read. To grant permission to `omsagent` user, run the following commands:

1. Add the `omsagent` user to specific group `sudo usermod -a -G <GROUPNAME> <USERNAME>`
2. Grant universal read access to the required file `sudo chmod -R ugo+rx <FILE DIRECTORY>`

There is a known issue with a race condition with the Log Analytics agent for Linux version earlier than 1.1.0-217. After updating to the latest agent, run the following command to get the latest version of the output plugin `sudo cp /etc/opt/microsoft/omsagent/sysconf/omsagent.conf /etc/opt/microsoft/omsagent/<workspace id>/conf/omsagent.conf`.

## Issue: You are trying to reonboard to a new workspace
When you try to reonboard an agent to a new workspace, the Log Analytics agent  configuration needs to be cleaned up before reonboarding. To clean up old configuration from the agent, run the shell bundle with `--purge`

```
sudo sh ./omsagent-*.universal.x64.sh --purge
```
Or

```
sudo sh ./onboard_agent.sh --purge
```

You can continue reonboard after using the `--purge` option

## Log Analytics agent extension in the Azure portal is marked with a failed state: Provisioning failed

### Probable causes
* Log Analytics agent has been removed from the operating system
* Log Analytics agent service is down, disabled, or not configured

### Resolution 
Perform the following steps to correct the issue.
1. Remove extension from Azure portal.
2. Install the agent following the [instructions](../../azure-monitor/learn/quick-collect-linux-computer.md).
3. Restart the agent by running the following command: `sudo /opt/microsoft/omsagent/bin/service_control restart`.
* Wait several minutes and the provisioning state changes to **Provisioning succeeded**.


## Issue: The Log Analytics agent upgrade on-demand

### Probable causes

The Log Analytics agent packages on the host are outdated.

### Resolution 
Perform the following steps to correct the issue.

1. Check for the latest release on [page](https://github.com/Microsoft/OMS-Agent-for-Linux/releases/).
2. Download install script (1.4.2-124 as example version):

    ```
    wget https://github.com/Microsoft/OMS-Agent-for-Linux/releases/download/OMSAgent_GA_v1.4.2-124/omsagent-1.4.2-124.universal.x64.sh
    ```

3. Upgrade packages by executing `sudo sh ./omsagent-*.universal.x64.sh --upgrade`.
