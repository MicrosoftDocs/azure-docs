---
title: Connect Linux computers to Azure Monitor | Microsoft Docs
description: This article describes how to connect Linux computers hosted in other clouds or on-premises to Azure Monitor with the Log Analytics agent for Linux.
ms.service:  azure-monitor
ms.subservice: logs
ms.topic: conceptual
author: MGoedtel
ms.author: magoedte
ms.date: 12/24/2019

---

# Connect Linux computers to Azure Monitor

In order to monitor and manage virtual machines or physical computers in your local datacenter or other cloud environment with Azure Monitor, you need to deploy the Log Analytics agent and configure it to report to a Log Analytics workspace. The agent also supports the Hybrid Runbook Worker role for Azure Automation.

On a monitored Linux computer, the agent is listed as `omsagent`. `omsconfig` is the Log Analytics agent for Linux configuration agent that looks for new portal side configuration every 5 minutes. The new and updated configuration is applied to the agent configuration files located at `/etc/opt/microsoft/omsagent/conf/omsagent.conf`.

The Log Analytics agent for Linux can be installed by using one of the following methods. Details on using each method are provided later in the article.

* Manually download and install the agent. This is required when the Linux computer does not have access to the Internet and will be communicating with Azure Monitor or Azure Automation through a [Log Analytics Gateway](gateway.md).  
* Install the agent for Linux calling a wrapper-script hosted on GitHub. This is the recommended method to install and upgrade the agent when it has connectivity with the Internet.

To understand the supported configuration, review [supported Linux operating systems](log-analytics-agent.md#supported-linux-operating-systems) and [network firewall configuration](log-analytics-agent.md#network-firewall-requirements).

## Agent install package

The Log Analytics agent for Linux is composed of multiple packages. The release file contains the following packages, which are available by running the shell bundle with the `--extract` parameter:

**Package** | **Version** | **Description**
----------- | ----------- | --------------
omsagent | 1.12.15 | The Log Analytics Agent for Linux
omsconfig | 1.1.1 | Configuration agent for the Log Analytics agent
omi | 1.6.3 | Open Management Infrastructure (OMI) -- a lightweight CIM Server. *Note that OMI requires root access to run a cron job necessary for the functioning of the service*
scx | 1.6.3 | OMI CIM Providers for operating system performance metrics
apache-cimprov | 1.0.1 | Apache HTTP Server performance monitoring provider for OMI. Only installed if Apache HTTP Server is detected.
mysql-cimprov | 1.0.1 | MySQL Server performance monitoring provider for OMI. Only installed if MySQL/MariaDB server is detected.
docker-cimprov | 1.0.0 | Docker provider for OMI. Only installed if Docker is detected.

### Additional installation artifacts

After installing the Log Analytics agent for Linux packages, the following additional system-wide configuration changes are applied. These artifacts are removed when the omsagent package is uninstalled.

* A non-privileged user named: `omsagent` is created. The daemon runs under this credential. 
* A sudoers *include* file is created in `/etc/sudoers.d/omsagent`. This authorizes `omsagent` to restart the syslog and omsagent daemons. If sudo *include* directives are not supported in the installed version of sudo, these entries will be written to `/etc/sudoers`.
* The syslog configuration is modified to forward a subset of events to the agent. For more information, see [Configure Syslog data collection](data-sources-syslog.md).

## Manual agent install

The Log Analytics agent for Linux is provided in a self-extracting and installable shell script bundle. This bundle contains Debian and RPM packages for each of the agent components and can be installed directly or extracted to retrieve the individual packages. One bundle is provided for x64 architectures and one for x86 architectures. 

For Azure VMs, you can install the agent on them using the [Azure Log Analytics VM extension](../../virtual-machines/extensions/oms-linux.md) for Linux. 

### Installing the agent

1. Transfer the appropriate bundle (x86 or x64) to your Linux computer, using scp/sftp.

2. Install the bundle by using the `--install` argument. 

    >[!NOTE]
    >You need to use the `--upgrade` argument if any dependent packages such as omi, scx, omsconfig or their older versions are installed, as would be the case if the system Center Operations Manager agent for Linux is already installed. To onboard to a Log Analytics workspace during installation, provide the `-w <WorkspaceID>` and `-s <workspaceKey>` parameters.


**To install and onboard directly:**
```
sudo sh ./omsagent-*.universal.x64.sh --upgrade -w <workspace id> -s <shared key>
```

**To install and onboard directly using an HTTP proxy:**
```
sudo sh ./omsagent-*.universal.x64.sh --upgrade -p http://<proxy user>:<proxy password>@<proxy address>:<proxy port> -w <workspace id> -s <shared key>
```

**To install and onboard to a workspace in FairFax:**
```
sudo sh ./omsagent-*.universal.x64.sh --upgrade -w <workspace id> -s <shared key> -d opinsights.azure.us
```

**To install the agent packages and onboard at a later time:**
```
sudo sh ./omsagent-*.universal.x64.sh --upgrade
```

**To extract the agent packages from the bundle without installing:**
```
sudo sh ./omsagent-*.universal.x64.sh --extract
```
