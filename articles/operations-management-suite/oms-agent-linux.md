---
title: Connect your Linux Computers to Operations Management Suite (OMS) | Microsoft Docs
description: This article describes how to connect Windows computers hosted in your on-premises infrastructure to OMS using the Microsoft Monitoring Agent (MMA).
services: log-analytics
documentationcenter: ''
author: mgoedtel
manager: carmonm
editor: tysonn

ms.assetid: 
ms.service: log-analytics
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 03/09/2017
ms.author: magoedte
---

# Connect your Linux Computers to Operations Management Suite (OMS) 

With OMS, you can collect and act on data generated from Linux computers and container solutions like Docker, regardless of where your computers are located.  They might reside in your on-premises data center as physical servers or virtual machines, virtual machines in a cloud-hosted service like Amazon Web Services (AWS) or Microsoft Azure, or even a laptop on your desk. 

You can view and manage data from all of those sources with Log Analytics and leverage management solutions available in OMS to track configuration changes and manage software  updates, all from a single management portal. This reduces the need to manage them using many different systems or solutions.

This article is a guide that will help you configure your Linux computers using the OMS Agent for Linux.

The Operations Management Suite Agent for Linux comprises multiple packages. The release file contains the following packages, available by running the shell bundle with `--extract`:

**Package** | **Version** | **Description**
----------- | ----------- | --------------
omsagent | 1.1.0 | The Operations Management Suite Agent for Linux
omsconfig | 1.1.1 | Configuration agent for the OMS Agent
omi | 1.0.8.3 | Open Management Infrastructure (OMI) -- a lightweight CIM Server
scx | 1.6.2 | OMI CIM Providers for operating system performance metrics
apache-cimprov | 1.0.0 | Apache HTTP Server performance monitoring provider for OMI. Only installed if Apache HTTP Server is detected.
mysql-cimprov | 1.0.0 | MySQL Server performance monitoring provider for OMI. Only installed if MySQL/MariaDB server is detected.
docker-cimprov | 0.1.0 | Docker provider for OMI. Only installed if Docker is detected.

**Additional Installation Artifacts**
After installing the OMS agent for Linux packages, the following additional system-wide configuration changes are applied. These artifacts are removed when the omsagent package is uninstalled.
* A non-privileged user named: `omsagent` is created. This is the account the omsagent daemon runs as
* A sudoers “include” file is created at /etc/sudoers.d/omsagent This authorizes omsagent to restart the syslog and omsagent daemons. If sudo “include” directives are not supported in the installed version of sudo, these entries will be written to /etc/sudoers.
* The syslog configuration is modified to forward a subset of events to the agent. For more information, see the **Configuring Data Collection** section below

## Supported Linux Operating Systems

* Amazon Linux 2012.09 --> 2015.09 (x86/x64)
* CentOS Linux 5,6, and 7 (x86/x64)
* Oracle Linux 5,6, and 7 (x86/x64)
* Red Hat Enterprise Linux Server 5,6 and 7 (x86/x64)
* Debian GNU/Linux 6, 7, and 8 (x86/x64)
* Ubuntu 12.04 LTS, 14.04 LTS, 15.04, 15.10, 16.04 LTS (x86/x64)
* SUSE Linux Enteprise Server 11 and 12 (x86/x64)

## Package Requirements

 **Required package** 	| **Description** 	| **Minimum version**
--------------------- | --------------------- | -------------------
Glibc |	GNU C Library	| 2.5-12 
Openssl	| OpenSSL Libraries | 0.9.8e or 1.0
Curl | cURL web client | 7.15.5
Python-ctypes | | 
PAM | Pluggable authentication Modules	 | 

> [!NOTE]
>  Either rsyslog or syslog-ng are required to collect syslog messages. The default syslog daemon on version 5 of Red Hat Enterprise Linux, CentOS, and Oracle Linux version (sysklog) is not supported for syslog event collection. To collect syslog data from this version of these distributions, the rsyslog daemon should be installed and configured to replace sysklog, 


## Upgrade from a Previous Release
Upgrade from prior versions (>1.0.0-47) is supported in this release. Performing the installation with the --upgrade command will upgrade all components of the agent to the latest version.


## Steps to install the OMS Agent for Linux
The OMS agent for Linux is provided in a self-extracting and installable shell script bundle. This bundle contains Debian and RPM packages for each of the agent components and can be installed directly or extracted to retrieve the individual packages. One bundle is provided for x64 architectures and one for x86 architectures. 

### Installing the agent

1. Transfer the appropriate bundle (x86 or x64) to your Linux computer, using scp/sftp.
2. Install the bundle by using the `--install` or `--upgrade` argument. Note: use the `--upgrade` argument if any existing packages are installed, as would be the case if the system Center Operations Manager agent for Linux is already installed. To onboard to Operations Management Suite during installation, provide the `-w <WorkspaceID>` and `-s <Shared Key>` parameters.

### All bundle operations
```
Options:
  --extract              Extract contents and exit.
  --force                Force upgrade (override version checks).
  --install              Install the package from the system.
  --purge                Uninstall the package and remove all related data.
  --remove               Uninstall the package from the system.
  --restart-deps         Reconfigure and restart dependent service
  --source-references    Show source code reference hashes.
  --upgrade              Upgrade the package in the system.
  --version              Version of this shell bundle.
  --version-check        Check versions already installed to see if upgradable.
  --debug                use shell debug mode.
  
  -w id, --id id         Use workspace ID <id> for automatic onboarding.
  -s key, --shared key   Use <key> as the shared key for automatic onboarding.
  -d dmn, --domain dmn   Use <dmn> as the OMS domain for onboarding. Optional.
                         default: opinsights.azure.com
                         ex: opinsights.azure.us (for FairFax)
  -p conf, --proxy conf  Use <conf> as the proxy configuration.
                         ex: -p [protocol://][user:password@]proxyhost[:port]
  -a id, --azure-resource id Use Azure Resource ID <id>.
  -m marker, --multi-homing-marker marker
                         Onboard as a multi-homing(Non-Primary) workspace.

  -? | --help            shows this usage text.
```

#### To install and onboard directly
```
sudo sh ./omsagent-1.3.0-1.universal.x64.sh --upgrade -w <workspace id> -s <shared key>
```

#### To install and onboard directly using an HTTP proxy
```
sudo sh ./omsagent-1.3.0-1.universal.x64.sh --upgrade -p http://<proxy user>:<proxy password>@<proxy address>:<proxy port> -w <workspace id> -s <shared key>
```

#### To install and onboard to a workspace in US Government Cloud
```
sudo sh ./omsagent-1.3.0-1.universal.x64.sh --upgrade -w <workspace id> -s <shared key> -d opinsights.azure.us
```

#### To install the agent packages and onboard at a later time
```
sudo sh ./omsagent-1.3.0-1.universal.x64.sh --upgrade
```

#### To install and onboard to a non-primary workspace
```
sudo sh ./omsagent-1.3.0-1.universal.x64.sh --upgrade -w <workspace id> -s <shared key> -m <multi-homing marker>
```

#### To extract the agent packages from the bundle without installing
```
sudo sh ./omsagent-1.3.0-1.universal.x64.sh --extract
```

##Configuring the agent for use with an HTTP proxy server
Communication between the agent and OMS services can use an HTTP or HTTPS proxy server. Both anonymous and basic authentication (username/password) proxies are supported. 

### Proxy Configuration
The proxy configuration value has the following syntax:

`[protocol://][user:password@]proxyhost[:port]`

Property|Description
-|-
Protocol|http or https
user|Optional username for proxy authentication
password|Optional password for proxy authentication
proxyhost|Address or FQDN of the proxy server
port|Optional port number for the proxy server

For example:
`http://user01:password@proxy01.contoso.com:8080`

The proxy server can be specified during installation or directly in a file (at any point). 

### Specify proxy configuration during installation
The `-p` or `--proxy` argument to the omsagent installation bundle specifies the proxy configuration to use. 

```
sudo sh ./omsagent-1.3.0-1.universal.x64.sh --upgrade -p http://<proxy user>:<proxy password>@<proxy address>:<proxy port> -w <workspace id> -s <shared key>
```

### Define the proxy configuration in a file
The proxy configuration is set in the file: `/etc/opt/microsoft/omsagent/proxy.conf` This file can be directly created or edited, but must be readable by the omsagent user. For example:
```
proxyconf="https://proxyuser:proxypassword@proxyserver01:8080"
sudo echo $proxyconf >>/etc/opt/microsoft/omsagent/proxy.conf
sudo chown omsagent:omiusers /etc/opt/microsoft/omsagent/proxy.conf
sudo chmod 600 /etc/opt/microsoft/omsagent/proxy.conf
sudo /opt/microsoft/omsagent/bin/service_control restart [<workspace id>]
```

### Removing the proxy configuration
To remove a previously defined proxy configuration and revert to direct connectivity, remove the proxy.conf file:
```
sudo rm /etc/opt/microsoft/omsagent/proxy.conf
sudo /opt/microsoft/omsagent/bin/service_control restart [<workspace id>]
```

## Onboarding with Operations Management Suite
If a workspace ID and key were not provided during the bundle installation, the agent must be subsequently registered with Operations Management Suite.

### Onboarding using the command line
Run the omsadmin.sh command supplying the workspace id and key for your workspace. This command must be run as root (with sudo elevation):
```
cd /opt/microsoft/omsagent/bin
sudo ./omsadmin.sh -w <WorkspaceID> -s <Shared Key>
```

### Onboarding using a file
1.	Create the file `/etc/omsagent-onboard.conf` The file must be readable and writable for root.
`sudo vi /etc/omsagent-onboard.conf`
2.	Insert the following lines in the file with your Workspace ID and Shared Key:
```
WORKSPACE_ID=<WorkspaceID>
SHARED_KEY=<Shared Key>
```
3.	Onboard to OMS:
`sudo /opt/microsoft/omsagent/bin/omsadmin.sh`
4.	The file will be deleted on successful onboarding

### Onboard a secondary workspace
From 1.3.0-1, OMSAgent supports to onboard the agent to multiple workspaces.
Run the omsadmin.sh command supplying the workspace id and key for your workspace, and -m to indicate secondary workspace:
```
cd /opt/microsoft/omsagent/bin
sudo ./omsadmin.sh -w <workspace id> -s <shared key> -m <multi-homing marker>
```
NOTE: Secondary workspace is currently unable to pull the configuration from OMS service. We are working on it.

### Onboard a secondary workspace using a file
Reference [Onboarding using a file](#onboarding-using-a-file)

Add the following line into `/etc/omsagent-onboard.conf`
```
MULTI_HOMING_MARKER=<any string, e.g. MySecondaryWS>
```

## Manage Workspaces
From 1.3.0-1, OMSAgent supports onboarding to multiple workspaces. Here are the commands for workspace management:

### List all workspaces
```
sudo sh /opt/microsoft/omsagent/bin/omsadmin.sh -l
```

Sample result for an agent onboarded to 2 workspaces:
```
Primary Workspace: 000c7bcd-28d2-453a-84bd-8523e396f600    Success(OMSAgent Registered)
Workspace(MySecondaryWS): ffffb0c0-7fac-4159-987c-000271282eff    Success(OMSAgent Registered)
```

### Remove a workspace
```
sudo sh /opt/microsoft/omsagent/bin/omsadmin.sh -x <workspace id>
```

### Remove all workspaces
```
sudo sh /opt/microsoft/omsagent/bin/omsadmin.sh -X
```

## Manage omsagent Daemon
From 1.3.0-1, we will register omsagent daemon for each onboarded workspace. The daemon name is omsagent-\<workspace-id>
You can use `/opt/microsoft/omsagent/bin/service_control` command to operate the daemon.

```
sudo sh /opt/microsoft/omsagent/bin/service_control start|stop|restart|enable|disable [<workspace id>]
```

The workspace id is an optional parameter. If it is specified, it will only operate on the workspace-specific daemon.
Otherwise, it will operate on all the daemons.


## Agent Logs
The logs for the Operations Management Suite Agent for Linux can be found at: 
`/var/opt/microsoft/omsagent/<workspace id>/log/`
The logs for the omsconfig (agent configuration) program can be found at: 
`/var/opt/microsoft/omsconfig/log/`
Logs for the OMI and SCX components (which provide performance metrics data) can be found at:
`/var/opt/omi/log/ and /var/opt/microsoft/scx/log`

### Log Rotation Configuration##
The log rotate configuration for omsagent can be found at:
`/etc/logrotate.d/omsagent-<workspace id>`

The default settings are 
```
/var/opt/microsoft/omsagent/<workspace id>/log/omsagent.log {
    rotate 5
    missingok
    notifempty
    compress
    size 50k
    copytruncate
}
```

## Uninstalling the OMS Agent for Linux
The agent packages can be uninstalled using dpkg or rpm, or by running the bundle .sh file with the `--remove` argument. Additionally, if you want to completely remove all pieces of the OMS Agent for Linux you can run the bundle .sh file with the `--purge` arguement. 

### Debian & Ubuntu
```
> sudo dpkg -P omsconfig
> sudo dpkg -P omsagent
> sudo /opt/microsoft/scx/bin/uninstall
```

### CentOS, Oracle Linux, RHEL, and SLES
```
> sudo rpm -e omsconfig
> sudo rpm -e omsagent
> sudo /opt/microsoft/scx/bin/uninstall
```

## Compatibility with System Center Operations Manager
The Operations Management Suite Agent for Linux shares agent binaries with the System Center Operations Manager agent. Installing the OMS Agent for Linux on a system currently managed by Operations Manager upgrades the OMI and SCX packages on the computer to a newer version. In this preview release, the OMS and System Center 2012 R2 Agents for Linux are compatible. 

> [!NOTE]
> System Center 2012 SP1 and earlier versions are currently not compatible or supported with the OMS Agent for Linux.<br>
> If the OMS Agent for Linux is installed to a computer that is not currently managed by Operations Manager, and you then wish to manage the computer with Operations Manager, you must modify the OMI configuration prior to discovering the computer. **This step is *not* needed if the Operations Manager agent is installed before the OMS Agent for Linux.**

### To enable the OMS Agent for Linux to communicate with System Center Operations Manager:
* Edit the file `/etc/opt/omi/conf/omiserver.conf`
* Ensure that the line beginning with **httpsport=** defines the port 1270. Such as:
`httpsport=1270`
* Restart the OMI server:
`sudo /opt/omi/bin/service_control restart`

## Troubleshooting

### Issue: Unable to connect through proxy to OMS

#### Probable Causes
* The proxy specified during onboarding was incorrect
* The OMS Service Endpoints are not whitelistested in your datacenter 

#### Resolutions
1. Re-onboard to the OMS Service with the OMS Agent for Linux by using the following command with the option `-v` enabled. This allows verbose output of the agent connecting through the proxy to the OMS Service. 
`/opt/microsoft/omsagent/bin/omsadmin.sh -w <OMS Workspace ID> -s <OMS Workspace Key> -p <Proxy Conf> -v`

2. Review the section [Configuring the agent for use with an HTTP proxy server(#configuring the-agent-for-use-with-a-http-proxy-server) to verify you have properly configured the agent to communicate through a proxy server.    
* Double check that the following OMS Service endpoints are whitelisted:
|Agent Resource| Ports |
|------|---------|
|*.ods.opinsights.azure.com | Port 443| 
|*.oms.opinsights.azure.com | Port 443| 
|ods.systemcenteradvisor.com | Port 443| 
|*.blob.core.windows.net/ | Port 443| 

### Issue: You receive a 403 error when trying to onboard

#### Probable Causes
* Date and Time is incorrect on Linux Server 
* Workspace ID and Workspace Key used are not correct

#### Resolution

1. Check the time on your Linux server with the command date. If the time is +/- 15 minutes from current time, then onboarding fails. To correct this update the date and/or timezone of your Linux server. 
New! The latest version of the OMS Agent for Linux now notifies you if the time skew is causing the onboarding failure
Re-onboard using correct Workspace ID and Workspace Key instructions

### Issue: You see a 500 and 404 error in the log file right after onboarding
This is a known issue an occurs on first upload of Linux data into an OMS workspace. This does not affect data being sent or service experience.

### Issue:  You are not seeing any data in the OMS portal

#### Probable Causes

- Onboarding to the OMS Service failed
- Connection to the OMS Service is blocked
- OMS Agent for Linux data is backed up

#### Resolutions
1. Check if onboarding the OMS Service was successful by checking if the following file exists: `/etc/opt/microsoft/omsagent/<workspace id>/conf/omsadmin.conf`
2. Re-onboard using the `omsadmin.sh` command line instructions
3. If using a proxy, refer to the proxy resolution steps provided earlier.
4. In some cases, when the OMS Agent for Linux cannot communicate with the OMS Service, data on the agent is queued to the full buffer size, which is 50 MB. The OMS Agent for Linux should be restarted by running the following command `/opt/microsoft/omsagent/bin/service_control restart [<workspace id>]`. 
> [!Note]
> This issue is fixed in agent version >= 1.1.0-28