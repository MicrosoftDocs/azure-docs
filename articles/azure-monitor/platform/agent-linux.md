---
title: Connect Linux computers to Azure Monitor | Microsoft Docs
description: This article describes how to connect Linux computers hosted in other clouds or on-premises to Azure Monitor with the Log Analytics agent for Linux.
ms.subservice: logs
ms.topic: conceptual
author: mgoedtel
ms.author: magoedte
ms.date: 01/21/2020

---

# Connect Linux computers to Azure Monitor

In order to monitor and manage virtual machines or physical computers in your local datacenter or other cloud environment with Azure Monitor, you need to deploy the Log Analytics agent and configure it to report to a Log Analytics workspace. The agent also supports the Hybrid Runbook Worker role for Azure Automation.

The Log Analytics agent for Linux can be installed by using one of the following methods. Details on using each method are provided later in the article.

* [Manually download and install](#install-the-agent-manually) the agent. This is required when the Linux computer does not have access to the Internet and will be communicating with Azure Monitor or Azure Automation through the [Log Analytics gateway](gateway.md). 
* [Install the agent for Linux using a wrapper-script](#install-the-agent-using-wrapper-script) hosted on GitHub. This is the recommended method to install and upgrade the agent when the computer has connectivity with the Internet, directly or through a proxy server.

To understand the supported configuration, review [supported Linux operating systems](log-analytics-agent.md#supported-linux-operating-systems) and [network firewall configuration](log-analytics-agent.md#network-requirements).

>[!NOTE]
>The Log Analytics agent for Linux cannot be configured to report to more than one Log Analytics workspace. It can only be configured to report to both a System Center Operations Manager management group and Log Analytics workspace concurrently, or to either individually.

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

### Agent installation details

After installing the Log Analytics agent for Linux packages, the following additional system-wide configuration changes are applied. These artifacts are removed when the omsagent package is uninstalled.

* A non-privileged user named: `omsagent` is created. The daemon runs under this credential. 
* A sudoers *include* file is created in `/etc/sudoers.d/omsagent`. This authorizes `omsagent` to restart the syslog and omsagent daemons. If sudo *include* directives are not supported in the installed version of sudo, these entries will be written to `/etc/sudoers`.
* The syslog configuration is modified to forward a subset of events to the agent. For more information, see [Configure Syslog data collection](data-sources-syslog.md).

On a monitored Linux computer, the agent is listed as `omsagent`. `omsconfig` is the Log Analytics agent for Linux configuration agent that looks for new portal side configuration every 5 minutes. The new and updated configuration is applied to the agent configuration files located at `/etc/opt/microsoft/omsagent/conf/omsagent.conf`.

## Obtain workspace ID and key

Before installing the Log Analytics agent for Linux, you need the workspace ID and key for your Log Analytics workspace. This information is required during setup of the agent to properly configure it and ensure it can successfully communicate with Azure Monitor.

[!INCLUDE [log-analytics-agent-note](../../../includes/log-analytics-agent-note.md)]  

1. In the upper-left corner of the Azure portal, select **All services**. In the search box, enter **Log Analytics**. As you type, the list filters based on your input. Select **Log Analytics workspaces**.

2. In your list of Log Analytics workspaces, select the workspace you created earlier. (You might have named it **DefaultLAWorkspace**.)

3. Select **Advanced settings**:

    ![Advanced Settings menu for Log Analytics in the Azure portal](../learn/media/quick-collect-azurevm/log-analytics-advanced-settings-azure-portal.png) 
 
4. Select **Connected Sources**, and then select **Linux Servers**.

5. The value to the right of **Workspace ID** and **Primary Key**. Copy and paste both into your favorite editor.

## Install the agent manually

The Log Analytics agent for Linux is provided in a self-extracting and installable shell script bundle. This bundle contains Debian and RPM packages for each of the agent components and can be installed directly or extracted to retrieve the individual packages. One bundle is provided for x64 and one for x86 architectures. 

> [!NOTE]
> For Azure VMs, we recommend you install the agent on them using the [Azure Log Analytics VM extension](../../virtual-machines/extensions/oms-linux.md) for Linux. 

1. [Download](https://github.com/microsoft/OMS-Agent-for-Linux#azure-install-guide) and transfer the appropriate bundle (x64 or x86) to your Linux VM or physical computer, using scp/sftp.

2. Install the bundle by using the `--install` argument. To onboard to a Log Analytics workspace during installation, provide the `-w <WorkspaceID>` and `-s <workspaceKey>` parameters copied earlier.

    >[!NOTE]
    >You need to use the `--upgrade` argument if any dependent packages such as omi, scx, omsconfig or their older versions are installed, as would be the case if the system Center Operations Manager agent for Linux is already installed. 

    ```
    sudo sh ./omsagent-*.universal.x64.sh --install -w <workspace id> -s <shared key>
    ```

3. To configure the Linux agent to install and connect to a Log Analytics workspace through a Log Analytics gateway, run the following command providing the proxy, workspace ID, and workspace key parameters. This configuration can be specified on the command line by including `-p [protocol://][user:password@]proxyhost[:port]`. The *proxyhost* property accepts a fully qualified domain name or IP address of the Log Analytics gateway server.  

    ```
    sudo sh ./omsagent-*.universal.x64.sh --upgrade -p https://<proxy address>:<proxy port> -w <workspace id> -s <shared key>
    ```

    If authentication is required, you need to specify the username and password. For example: 
    
    ```
    sudo sh ./omsagent-*.universal.x64.sh --upgrade -p https://<proxy user>:<proxy password>@<proxy address>:<proxy port> -w <workspace id> -s <shared key>
    ```

4. To configure the Linux computer to connect to a Log Analytics workspace in Azure Government cloud, run the following command providing the workspace ID and primary key copied earlier.

    ```
    sudo sh ./omsagent-*.universal.x64.sh --upgrade -w <workspace id> -s <shared key> -d opinsights.azure.us
    ```

If you want to install the agent packages and configure it to report to a specific Log Analytics workspace at a later time, run the following command:

```
sudo sh ./omsagent-*.universal.x64.sh --upgrade
```

If you want to extract the agent packages from the bundle without installing the agent, run the following command:

```
sudo sh ./omsagent-*.universal.x64.sh --extract
```

## Install the agent using wrapper script

The following steps configure setup of the agent for Log Analytics in Azure and Azure Government cloud using the wrapper script for Linux computers that can communicate directly or through a proxy server to download the agent hosted on GitHub and install the agent.  

If your Linux computer needs to communicate through a proxy server to Log Analytics, this configuration can be specified on the command line by including `-p [protocol://][user:password@]proxyhost[:port]`. The *protocol* property accepts `http` or `https`, and the *proxyhost* property accepts a fully qualified domain name or IP address of the proxy server. 

For example: `https://proxy01.contoso.com:30443`

If authentication is required in either case, you need to specify the username and password. For example: `https://user01:password@proxy01.contoso.com:30443`

1. To configure the Linux computer to connect to a Log Analytics workspace, run the following command providing the workspace ID and primary key. The following command downloads the agent, validates its checksum, and installs it.
    
    ```
    wget https://raw.githubusercontent.com/Microsoft/OMS-Agent-for-Linux/master/installer/scripts/onboard_agent.sh && sh onboard_agent.sh -w <YOUR WORKSPACE ID> -s <YOUR WORKSPACE PRIMARY KEY>
    ```

    The following command includes the `-p` proxy parameter and example syntax when authentication is required by your proxy server:

   ```
    wget https://raw.githubusercontent.com/Microsoft/OMS-Agent-for-Linux/master/installer/scripts/onboard_agent.sh && sh onboard_agent.sh -p [protocol://]<proxy user>:<proxy password>@<proxyhost>[:port] -w <YOUR WORKSPACE ID> -s <YOUR WORKSPACE PRIMARY KEY>
    ```

2. To configure the Linux computer to connect to Log Analytics workspace in Azure Government cloud, run the following command providing the workspace ID and primary key copied earlier. The following command downloads the agent, validates its checksum, and installs it. 

    ```
    wget https://raw.githubusercontent.com/Microsoft/OMS-Agent-for-Linux/master/installer/scripts/onboard_agent.sh && sh onboard_agent.sh -w <YOUR WORKSPACE ID> -s <YOUR WORKSPACE PRIMARY KEY> -d opinsights.azure.us
    ``` 

    The following command includes the `-p` proxy parameter and example syntax when authentication is required by your proxy server:

   ```
    wget https://raw.githubusercontent.com/Microsoft/OMS-Agent-for-Linux/master/installer/scripts/onboard_agent.sh && sh onboard_agent.sh -p [protocol://]<proxy user>:<proxy password>@<proxyhost>[:port] -w <YOUR WORKSPACE ID> -s <YOUR WORKSPACE PRIMARY KEY> -d opinsights.azure.us
    ```
2. Restart the agent by running the following command: 

    ```
    sudo /opt/microsoft/omsagent/bin/service_control restart [<workspace id>]
    ``` 

## Upgrade from a previous release

Upgrading from a previous version, starting with version 1.0.0-47, is supported in each release. Perform the installation with the `--upgrade` parameter to upgrade all components of the agent to the latest version.

## Next steps

- Review [Managing and maintaining the Log Analytics agent for Windows and Linux](agent-manage.md) to learn about how to reconfigure, upgrade, or remove the agent from the virtual machine.

- Review [Troubleshooting the Linux agent](agent-linux-troubleshoot.md) if you encounter issues while installing or managing the agent.
