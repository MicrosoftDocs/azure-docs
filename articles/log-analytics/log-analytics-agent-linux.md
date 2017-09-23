---
title: Connect your Linux Computers to Operations Management Suite (OMS) | Microsoft Docs
description: This article describes how to connect Linux computers hosted in Azure, other cloud, or on-premises to OMS using the OMS Agent for Linux.
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
ms.date: 09/05/2017
ms.author: magoedte
---

# Connect your Linux Computers to Operations Management Suite (OMS) 

With Microsoft Operations Management Suite (OMS), you can collect and act on data generated from Linux computers and container solutions like Docker, residing in your on-premises data center as physical servers or virtual machines, virtual machines in a cloud-hosted service like Amazon Web Services (AWS) or Microsoft Azure. You can also use management solutions available in OMS such as Change Tracking, to identify configuration changes, and Update Management to manage software updates to proactively manage the lifecycle of your Linux VMs. 

The OMS Agent for Linux communicates outbound with the OMS service over TCP port 443, and if the computer connects to a firewall or proxy server to communicate over the Internet, review [Configuring the agent for use with an HTTP proxy server or OMS Gateway](#configuring-the-agent-for-use-with-an-http-proxy-server-or-oms-gateway) to understand what configuration changes will need to be applied.  If you are monitoring the computer with System Center 2016 - Operations Manager or Operations Manager 2012 R2, it can be multi-homed with the OMS service to collect data and forward to the service and still be monitored by Operations Manager.  Linux computers monitored by an Operations Manager management group that is integrated with OMS do not receive configuration for data sources and forward collected data through the management group.  The OMS agent cannot be configured to report to more than one workspace.  

If your IT security policies do not allow computers on your network to connect to the Internet, the agent can be configured to connect to the OMS Gateway to receive configuration information and send collected data depending on the solution you have enabled. For more information and steps on how to configure your OMS Linux Agent to communicate through an OMS Gateway to the OMS service, see [Connect computers to OMS using the OMS Gateway](log-analytics-oms-gateway.md).  

The following diagram depicts the connection between the agent-managed Linux computers and OMS, including the direction and ports.

![direct agent communication with OMS diagram](./media/log-analytics-agent-linux/log-analytics-agent-linux-communication.png)

## System requirements
Before starting, review the following details to verify you meet the prerequisites.

### Supported Linux operating systems
The following Linux distributions are officially supported.  However, the OMS Agent for Linux might also run on other distributions not listed.

* Amazon Linux 2012.09 to 2015.09 (x86/x64)
* CentOS Linux 5, 6, and 7 (x86/x64)
* Oracle Linux 5, 6, and 7 (x86/x64)
* Red Hat Enterprise Linux Server 5, 6 and 7 (x86/x64)
* Debian GNU/Linux 6, 7, and 8 (x86/x64)
* Ubuntu 12.04 LTS, 14.04 LTS, 15.04, 15.10, 16.04 LTS (x86/x64)
* SUSE Linux Enterprise Server 11 and 12 (x86/x64)

### Network
The information below list the proxy and firewall configuration information required for the Linux agent to communicate with OMS. Traffic is outbound from your network to the OMS service. 

|Agent Resource| Ports |  
|------|---------|  
|*.ods.opinsights.azure.com | Port 443|   
|*.oms.opinsights.azure.com | Port 443|   
|*.blob.core.windows.net/ | Port 443|   
|*.azure-automation.net | Port 443|  

### Package requirements

 **Required package** 	| **Description** 	| **Minimum version**
--------------------- | --------------------- | -------------------
Glibc |	GNU C Library	| 2.5-12 
Openssl	| OpenSSL Libraries | 0.9.8e or 1.0
Curl | cURL web client | 7.15.5
Python-ctypes | | 
PAM | Pluggable authentication Modules | 

> [!NOTE]
>  Either rsyslog or syslog-ng are required to collect syslog messages. The default syslog daemon on version 5 of Red Hat Enterprise Linux, CentOS, and Oracle Linux version (sysklog) is not supported for syslog event collection. To collect syslog data from this version of these distributions, the rsyslog daemon should be installed and configured to replace sysklog, 

The agent includes multiple packages. The release file contains the following packages, available by running the shell bundle with `--extract`:

**Package** | **Version** | **Description**
----------- | ----------- | --------------
omsagent | 1.4.0 | The Operations Management Suite Agent for Linux
omsconfig | 1.1.1 | Configuration agent for the OMS Agent
omi | 1.2.0 | Open Management Infrastructure (OMI) - a lightweight CIM Server
scx | 1.6.3 | OMI CIM Providers for operating system performance metrics
apache-cimprov | 1.0.1 | Apache HTTP Server performance monitoring provider for OMI. Installed if Apache HTTP Server is detected.
mysql-cimprov | 1.0.1 | MySQL Server performance monitoring provider for OMI. Installed if MySQL/MariaDB server is detected.
docker-cimprov | 1.0.0 | Docker provider for OMI. Installed if Docker is detected.

### Compatibility with System Center Operations Manager
The OMS Agent for Linux shares agent binaries with the System Center Operations Manager agent. If you install the OMS Agent for Linux on a system currently managed by Operations Manager, it upgrades the OMI and SCX packages on the computer to a newer version. In this release, the OMS and System Center 2016 - Operations Manager/Operations Manager 2012 R2 agents for Linux are compatible. 

> [!NOTE]
> System Center 2012 SP1 and earlier versions are currently not compatible or supported with the OMS Agent for Linux.<br>
> If the OMS Agent for Linux is installed to a computer that is not currently monitored by Operations Manager, and you then wish to monitor the computer with Operations Manager, you must modify the [OMI configuration](#enable-the-oms-agent-for-linux-to-report-to-system-center-operations-manager) prior to discovering the computer. **This step is *not* needed if the Operations Manager agent is installed before the OMS Agent for Linux.**

### System configuration changes
After installing the OMS Agent for Linux packages, the following additional system-wide configuration changes are applied. These artifacts are removed when the omsagent package is uninstalled.

* A non-privileged user named: `omsagent` is created. This is the account the omsagent daemon runs as.
* A sudoers “include” file is created at /etc/sudoers.d/omsagent. This authorizes omsagent to restart the syslog and omsagent daemons. If sudo “include” directives are not supported in the installed version of sudo, these entries are written to /etc/sudoers.
* The syslog configuration is modified to forward a subset of events to the agent. For more information, see the **Configuring Data Collection** section below

### Upgrade from a previous release
Upgrade from versions earlier than 1.0.0-47 is supported in this release. Performing the installation with the `--upgrade` command upgrades all components of the agent to the latest version.

## Installing the agent

This section describes how to install the OMS Agent for Linux using a bunndle, which contains Debian and RPM packages for each of the agent components.  It can be installed directly or extracted to retrieve the individual packages.  

First you need your OMS workspace ID and key, which you can find by switching to the [OMS classic portal](https://mms.microsoft.com).  On the **Overview** page, from the top menu select **Settings**, and then navigate to **Connected Sources\Linux Servers**.  You see the value to the right of **Workspace ID** and **Primary Key**.  Copy and paste both into your favorite editor.    

1. Download the latest [OMS Agent for Linux (x64)](https://github.com/Microsoft/OMS-Agent-for-Linux/releases/download/OMSAgent_GA_v1.4.0-45/omsagent-1.4.0-45.universal.x64.sh) or [OMS Agent for Linux x86](https://github.com/Microsoft/OMS-Agent-for-Linux/releases/download/OMSAgent_GA_v1.4.0-45/omsagent-1.4.0-45.universal.x86.sh) from GitHub.  
2. Transfer the appropriate bundle (x86 or x64) to your Linux computer using scp/sftp.
3. Install the bundle by using the `--install` or `--upgrade` argument. 

    > [!NOTE]
    > If any existing packages are installed such as when the System Center Operations Manager agent for Linux is already installed, use the `--upgrade` argument. To connect to Operations Management Suite during installation, provide the `-w <WorkspaceID>` and `-s <Shared Key>` parameters.


#### To install and onboard directly
```
sudo sh ./omsagent-<version>.universal.x64.sh --upgrade -w <workspace id> -s <shared key>
```

#### To upgrade the agent package
```
sudo sh ./omsagent-<version>.universal.x64.sh --upgrade
```

#### To install and onboard to a workspace in US Government Cloud
```
sudo sh ./omsagent-<version>.universal.x64.sh --upgrade -w <workspace id> -s <shared key> -d opinsights.azure.us
```

## Configuring the agent for use with an HTTP proxy server or OMS Gateway
The OMS Agent for Linux supports communicating either through an HTTP or HTTPS proxy server or OMS Gateway to the OMS service.  Both anonymous and basic authentication (username/password) is supported.  

### Proxy configuration
The proxy configuration value has the following syntax:

`[protocol://][user:password@]proxyhost[:port]`

Property|Description
-|-
Protocol|http or https
user|Optional username for proxy authentication
password|Optional password for proxy authentication
proxyhost|Address or FQDN of the proxy server/OMS Gateway
port|Optional port number for the proxy server/OMS Gateway

For example:
`http://user01:password@proxy01.contoso.com:8080`

The proxy server can be specified during installation or by modifying the proxy.conf configuration file after installation.   

### Specify proxy configuration during installation
The `-p` or `--proxy` argument for the omsagent installation bundle specifies the proxy configuration to use. 

```
sudo sh ./omsagent-<version>.universal.x64.sh --upgrade -p http://<proxy user>:<proxy password>@<proxy address>:<proxy port> -w <workspace id> -s <shared key>
```

### Define the proxy configuration in a file
The proxy configuration can be set in the files `/etc/opt/microsoft/omsagent/proxy.conf`  and `/etc/opt/microsoft/omsagent/conf/proxy.conf `. The files can be directly created or edited, but their permissions must be updated to grant the omiuser user read permission on the files. For example:
```
proxyconf="https://proxyuser:proxypassword@proxyserver01:8080"
sudo echo $proxyconf >>/etc/opt/microsoft/omsagent/proxy.conf
sudo chown omsagent:omiusers /etc/opt/microsoft/omsagent/proxy.conf
sudo chmod 600 /etc/opt/microsoft/omsagent/proxy.conf /etc/opt/microsoft/omsagent/conf/proxy.conf  
sudo /opt/microsoft/omsagent/bin/service_control restart [<workspace id>]
```

### Removing the proxy configuration
To remove a previously defined proxy configuration and revert to direct connectivity, remove the proxy.conf file:
```
sudo rm /etc/opt/microsoft/omsagent/proxy.conf /etc/opt/microsoft/omsagent/conf/proxy.conf
sudo /opt/microsoft/omsagent/bin/service_control restart 
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
1.	Create the file `/etc/omsagent-onboard.conf`. The file must be readable and writable for root.
`sudo vi /etc/omsagent-onboard.conf`
2.	Insert the following lines in the file with your Workspace ID and Shared Key:

        WORKSPACE_ID=<WorkspaceID>  
        SHARED_KEY=<Shared Key>  
   
3.	Run the following command to Onboard to OMS:
`sudo /opt/microsoft/omsagent/bin/omsadmin.sh`
4.	The file is deleted on successful onboarding.

## Enable the OMS Agent for Linux to report to System Center Operations Manager
Perform the following steps to configure the OMS Agent for Linux to report to a System Center Operations Manager management group.  

1. Edit the file `/etc/opt/omi/conf/omiserver.conf`
2. Ensure that the line beginning with **httpsport=** defines the port 1270. Such as:
`httpsport=1270`
3. Restart the OMI server:
`sudo /opt/omi/bin/service_control restart`

## Agent logs
The logs for the OMS Agent for Linux can be found at: 
`/var/opt/microsoft/omsagent/<workspace id>/log/`
The logs for the omsconfig (agent configuration) program can be found at: 
`/var/opt/microsoft/omsconfig/log/`
Logs for the OMI and SCX components (which provide performance metrics data) can be found at:
`/var/opt/omi/log/ and /var/opt/microsoft/scx/log`

### Log rotation configuration##
The log rotate configuration for omsagent can be found at:
`/etc/logrotate.d/omsagent-<workspace id>`

The default settings are: 
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
The agent packages can be uninstalled by running the bundle .sh file with the `--purge` argument, which completely removes the agent and its configuration from the computer.   

```
> sudo rpm -e omsconfig
> sudo rpm -e omsagent
> sudo /opt/microsoft/scx/bin/uninstall
```

## Troubleshooting

### Issue: Unable to connect through proxy to OMS

#### Probable causes
* The proxy specified during onboarding was incorrect
* The OMS Service Endpoints are not whitelistested in your datacenter 

#### Resolutions
1. Reonboard to the OMS Service with the OMS Agent for Linux by using the following command with the option `-v` enabled. This allows verbose output of the agent connecting through the proxy to the OMS Service. 
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

#### Probable causes
* Date and Time is incorrect on Linux Server 
* Workspace ID and Workspace Key used are not correct

#### Resolution

1. Check the time on your Linux server with the command date. If the time is +/- 15 minutes from current time, then onboarding fails. To correct this update the date and/or timezone of your Linux server. 
2. Verify you have installed the latest version of the OMS Agent for Linux.  The newest version now notifies you if time skew is causing the onboarding failure.
3. Reonboard using correct Workspace ID and Workspace Key following the installation instructions earlier in this topic.

### Issue: You see a 500 and 404 error in the log file right after onboarding
This is a known issue that occurs on first upload of Linux data into an OMS workspace. This does not affect data being sent or service experience.

### Issue: You are not seeing any data in the OMS portal

#### Probable causes

- Onboarding to the OMS Service failed
- Connection to the OMS Service is blocked
- OMS Agent for Linux data is backed up

#### Resolutions
1. Check if onboarding the OMS Service was successful by checking if the following file exists: `/etc/opt/microsoft/omsagent/<workspace id>/conf/omsadmin.conf`
2. Reonboard using the `omsadmin.sh` command-line instructions
3. If using a proxy, refer to the proxy resolution steps provided earlier.
4. In some cases, when the OMS Agent for Linux cannot communicate with the OMS Service, data on the agent is queued to the full buffer size, which is 50 MB. The OMS Agent for Linux should be restarted by running the following command: `/opt/microsoft/omsagent/bin/service_control restart [<workspace id>]`. 

    >[!NOTE]
    >This issue is fixed in agent version 1.1.0-28 and later.

