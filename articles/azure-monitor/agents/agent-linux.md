---
title: Install Log Analytics agent on Linux computers
description: This article describes how to connect Linux computers hosted in other clouds or on-premises to Azure Monitor with the Log Analytics agent for Linux.
ms.topic: conceptual
ms.custom: devx-track-linux
ms.date: 06/01/2023
ms.reviewer: JeffWo
---

# Install the Log Analytics agent on Linux computers
This article provides details on installing the Log Analytics agent on Linux computers hosted in other clouds or on-premises.

[!INCLUDE [Log Analytics agent deprecation](../../../includes/log-analytics-agent-deprecation.md)]

The [installation methods described in this article](#install-the-agent) are:

* Install the agent for Linux by using a wrapper-script hosted on GitHub. We recommend this method to install and upgrade the agent when the computer has connectivity with the internet, either directly or through a proxy server.
* Manually download and install the agent. This step is required when the Linux computer doesn't have access to the internet and will be communicating with Azure Monitor or Azure Automation through the [Log Analytics gateway](./gateway.md).

For more efficient options that you can use for Azure virtual machines, see [Installation options](./log-analytics-agent.md#installation-options).

## Requirements

The following sections outline the requirements for installation.

### Supported operating systems

For a list of Linux distributions supported by the Log Analytics agent, see [Overview of Azure Monitor agents](agents-overview.md#supported-operating-systems).

OpenSSL 1.1.0 is only supported on x86_x64 platforms (64-bit). OpenSSL earlier than 1.x isn't supported on any platform.

>[!NOTE]
>The Log Analytics Linux agent doesn't run in containers. To monitor containers, use the [Container Monitoring solution](/previous-versions/azure/azure-monitor/containers/containers) for Docker hosts or [Container insights](../containers/container-insights-overview.md) for Kubernetes.

Starting with versions released after August 2018, we're making the following changes to our support model:  

* Only the server versions are supported, not the client versions.  
* Focus support on any of the [Azure Linux Endorsed distros](../../virtual-machines/linux/endorsed-distros.md). There might be some delay between a new distro/version being Azure Linux Endorsed and it being supported for the Log Analytics Linux agent.
* All minor releases are supported for each major version listed.
* Versions that have passed their manufacturer's end-of-support date aren't supported.
* Only support VM images. Containers aren't supported, even those derived from official distro publishers' images.
* New versions of AMI aren't supported.  
* Only versions that run OpenSSL 1.x by default are supported.

>[!NOTE]
>If you're using a distro or version that isn't currently supported and doesn't align to our support model, we recommend that you fork this repo. Acknowledge that Microsoft support won't provide assistance with forked agent versions.

### Python requirement

Starting from agent version 1.13.27, the Linux agent will support both Python 2 and 3. We always recommend that you use the latest agent.

If you're using an older version of the agent, you must have the virtual machine use Python 2 by default. If your virtual machine is using a distro that doesn't include Python 2 by default, then you must install it. The following sample commands will install Python 2 on different distros:

 - **Red Hat, CentOS, Oracle**: 
 
 ```bash
    sudo yum install -y python2
 ```
 - **Ubuntu, Debian**: 
 
 ```bash
    sudo apt-get update
    sudo apt-get install -y python2
 ```
 - **SUSE**: 

 ```bash
    sudo zypper install -y python2
 ```

Again, only if you're using an older version of the agent, the python2 executable must be aliased to *python*. Use the following method to set this alias:

1. Run the following command to remove any existing aliases:
 
    ```bash
    sudo update-alternatives --remove-all python
    ```

1. Run the following command to create the alias:

    ```bash
    sudo update-alternatives --install /usr/bin/python python /usr/bin/python2
    ```

### Supported Linux hardening
The OMS Agent has limited customization and hardening support for Linux.

The following tools are currently supported:
- SELinux (Marketplace images for CentOS and RHEL with their default settings)
- FIPS (Marketplace images for CentOS and RHEL 6/7 with their default settings)

The following tools aren't supported:
- CIS
- SELinux (custom hardening like MLS)

CIS, FIPS, and SELinux hardening support is planned for [Azure Monitor Agent](./azure-monitor-agent-overview.md). Further hardening and customization methods aren't supported or planned for OMS Agent. For instance, OS images like GitHub Enterprise Server, which include customizations such as limitations to user account privileges, aren't supported.

### Agent prerequisites

The following table highlights the packages required for [supported Linux distros](#supported-operating-systems) on which the agent will be installed.

|Required package |Description |Minimum version |
|-----------------|------------|----------------|
|Glibc |    GNU C library | 2.5-12 
|Openssl    | OpenSSL libraries | 1.0.x or 1.1.x |
|Curl | cURL web client | 7.15.5 |
|Python | | 2.7 or 3.6+
|Python-ctypes | | 
|PAM | Pluggable authentication modules | | 

>[!NOTE]
>Either rsyslog or syslog-ng is required to collect syslog messages. The default syslog daemon on version 5 of Red Hat Enterprise Linux, CentOS, and Oracle Linux version (sysklog) isn't supported for syslog event collection. To collect syslog data from this version of these distributions, the rsyslog daemon should be installed and configured to replace sysklog.

### Network requirements
For the network requirements for the Linux agent, see [Log Analytics agent overview](./log-analytics-agent.md#network-requirements).

### Workspace ID and key

Regardless of the installation method used, you need the workspace ID and key for the Log Analytics workspace that the agent will connect to. Select the workspace from the **Log Analytics workspaces** menu in the Azure portal. Under the **Settings** section, select **Agents**.

:::image type="content" source="media/log-analytics-agent/workspace-details.png" lightbox="media/log-analytics-agent/workspace-details.png" alt-text="Screenshot that shows workspace details.":::

## Agent install package

The Log Analytics agent for Linux is composed of multiple packages. The release file contains the following packages, which are available by running the shell bundle with the `--extract` parameter:

Package | Version | Description
----------- | ----------- | --------------
omsagent | 1.16.0 | The Log Analytics agent for Linux.
omsconfig | 1.2.0 | Configuration agent for the Log Analytics agent.
omi | 1.7.1 | Open Management Infrastructure (OMI), a lightweight CIM Server. *OMI requires root access to run a cron job necessary for the functioning of the service*.
scx | 1.7.1 | OMI CIM providers for operating system performance metrics.
apache-cimprov | 1.0.1 | Apache HTTP Server performance monitoring provider for OMI. Only installed if Apache HTTP Server is detected.
mysql-cimprov | 1.0.1 | MySQL Server performance monitoring provider for OMI. Only installed if MySQL/MariaDB server is detected.
docker-cimprov | 1.0.0 | Docker provider for OMI. Only installed if Docker is detected.

### Agent installation details

[!INCLUDE [Log Analytics agent deprecation](../../../includes/log-analytics-agent-deprecation.md)]

Installing the Log Analytics agent for Linux packages also applies the following systemwide configuration changes. Uninstalling the omsagent package removes these artifacts.

* A non-privileged user named `omsagent` is created. The daemon runs under this credential.
* A sudoers *include* file is created in `/etc/sudoers.d/omsagent`. This file authorizes `omsagent` to restart the syslog and omsagent daemons. If sudo *include* directives aren't supported in the installed version of sudo, these entries will be written to `/etc/sudoers`.
* The syslog configuration is modified to forward a subset of events to the agent. For more information, see [Configure Syslog data collection](data-sources-syslog.md).

On a monitored Linux computer, the agent is listed as `omsagent`. `omsconfig` is the Log Analytics agent for the Linux configuration agent that looks for new portal-side configuration every 5 minutes. The new and updated configuration is applied to the agent configuration files located at `/etc/opt/microsoft/omsagent/conf/omsagent.conf`.

## Install the agent

[!INCLUDE [Log Analytics agent deprecation](../../../includes/log-analytics-agent-deprecation.md)]

### [Wrapper script](#tab/wrapper-script)

The following steps configure setup of the agent for Log Analytics in Azure and Azure Government cloud. A wrapper script is used for Linux computers that can communicate directly or through a proxy server to download the agent hosted on GitHub and install the agent.  

If your Linux computer needs to communicate through a proxy server to Log Analytics, this configuration can be specified on the command line by including `-p [protocol://][user:password@]proxyhost[:port]`. The `protocol` property accepts `http` or `https`. The `proxyhost` property accepts a fully qualified domain name or IP address of the proxy server.

For example: `https://proxy01.contoso.com:30443`

If authentication is required in either case, specify the username and password. For example: `https://user01:password@proxy01.contoso.com:30443`

1. To configure the Linux computer to connect to a Log Analytics workspace, run the following command that provides the workspace ID and primary key. The following command downloads the agent, validates its checksum, and installs it.
    
    ```
    wget https://raw.githubusercontent.com/Microsoft/OMS-Agent-for-Linux/master/installer/scripts/onboard_agent.sh && sh onboard_agent.sh -w <YOUR WORKSPACE ID> -s <YOUR WORKSPACE PRIMARY KEY>
    ```

    The following command includes the `-p` proxy parameter and example syntax when authentication is required by your proxy server:

   ```
    wget https://raw.githubusercontent.com/Microsoft/OMS-Agent-for-Linux/master/installer/scripts/onboard_agent.sh && sh onboard_agent.sh -p [protocol://]<proxy user>:<proxy password>@<proxyhost>[:port] -w <YOUR WORKSPACE ID> -s <YOUR WORKSPACE PRIMARY KEY>
    ```

1. To configure the Linux computer to connect to a Log Analytics workspace in Azure Government cloud, run the following command that provides the workspace ID and primary key copied earlier. The following command downloads the agent, validates its checksum, and installs it.

    ```
    wget https://raw.githubusercontent.com/Microsoft/OMS-Agent-for-Linux/master/installer/scripts/onboard_agent.sh && sh onboard_agent.sh -w <YOUR WORKSPACE ID> -s <YOUR WORKSPACE PRIMARY KEY> -d opinsights.azure.us
    ``` 

    The following command includes the `-p` proxy parameter and example syntax when authentication is required by your proxy server:

   ```
    wget https://raw.githubusercontent.com/Microsoft/OMS-Agent-for-Linux/master/installer/scripts/onboard_agent.sh && sh onboard_agent.sh -p [protocol://]<proxy user>:<proxy password>@<proxyhost>[:port] -w <YOUR WORKSPACE ID> -s <YOUR WORKSPACE PRIMARY KEY> -d opinsights.azure.us
    ```
1. Restart the agent by running the following command:

    ```
    sudo /opt/microsoft/omsagent/bin/service_control restart [<workspace id>]
    ``` 

### [Shell](#tab/shell)

The Log Analytics agent for Linux is provided in a self-extracting and installable shell script bundle. This bundle contains Debian and RPM packages for each of the agent components and can be installed directly or extracted to retrieve the individual packages. One bundle is provided for x64 and one for x86 architectures.

> [!NOTE]
> For Azure VMs, we recommend that you install the agent on them by using the [Azure Log Analytics VM extension](../../virtual-machines/extensions/oms-linux.md) for Linux.

1. [Download](https://github.com/microsoft/OMS-Agent-for-Linux#azure-install-guide) and transfer the appropriate bundle (x64 or x86) to your Linux VM or physical computer by using scp/sftp.

1. Install the bundle by using the `--install` argument. To onboard to a Log Analytics workspace during installation, provide the `-w <WorkspaceID>` and `-s <workspaceKey>` parameters copied earlier.

    >[!NOTE]
    > Use the `--upgrade` argument if any dependent packages, such as omi, scx, omsconfig, or their older versions, are installed. This would be the case if the System Center Operations Manager agent for Linux is already installed.
  
    ```
    sudo sh ./omsagent-*.universal.x64.sh --install -w <workspace id> -s <shared key> --skip-docker-provider-install
    ```

    > [!NOTE]
    > The preceding command uses the optional `--skip-docker-provider-install` flag to disable the Container Monitoring data collection because the [Container Monitoring solution](/previous-versions/azure/azure-monitor/containers/containers) is being retired.

1. To configure the Linux agent to install and connect to a Log Analytics workspace through a Log Analytics gateway, run the following command. It provides the proxy, workspace ID, and workspace key parameters. This configuration can be specified on the command line by including `-p [protocol://][user:password@]proxyhost[:port]`. The `proxyhost` property accepts a fully qualified domain name or IP address of the Log Analytics gateway server.  

    ```
    sudo sh ./omsagent-*.universal.x64.sh --upgrade -p https://<proxy address>:<proxy port> -w <workspace id> -s <shared key>
    ```

    If authentication is required, specify the username and password. For example:
    
    ```
    sudo sh ./omsagent-*.universal.x64.sh --upgrade -p https://<proxy user>:<proxy password>@<proxy address>:<proxy port> -w <workspace id> -s <shared key>
    ```

1. To configure the Linux computer to connect to a Log Analytics workspace in Azure Government or Microsoft Azure operated by 21Vianet cloud, run the following command that provides the workspace ID and primary key copied earlier, substituting `opinsights.azure.us` or `opinsights.azure.cn` respectively for the domain name:

    ```
    sudo sh ./omsagent-*.universal.x64.sh --upgrade -w <workspace id> -s <shared key> -d <domain name>
    ```

To install the agent packages and configure the agent to report to a specific Log Analytics workspace at a later time, run:

```
sudo sh ./omsagent-*.universal.x64.sh --upgrade
```

To extract the agent packages from the bundle without installing the agent, run:

```
sudo sh ./omsagent-*.universal.x64.sh --extract
```

---

## Upgrade from a previous release

Upgrading from a previous version, starting with version 1.0.0-47, is supported in each release. Perform the installation with the `--upgrade` parameter to upgrade all components of the agent to the latest version.

> [!NOTE]
> The warning message "docker provider package installation skipped" appears during the upgrade because the `--skip-docker-provider-install` flag is set. If you're installing over an existing `omsagent` installation and want to remove the docker provider, purge the existing installation first. Then install by using the `--skip-docker-provider-install` flag.

## Cache information
Data from the Log Analytics agent for Linux is cached on the local machine at *%STATE_DIR_WS%/out_oms_common*.buffer* before it's sent to Azure Monitor. Custom log data is buffered in *%STATE_DIR_WS%/out_oms_blob*.buffer*. The path might be different for some [solutions and data types](https://github.com/microsoft/OMS-Agent-for-Linux/search?utf8=%E2%9C%93&q=+buffer_path&type=).

The agent attempts to upload every 20 seconds. If it fails, it waits an exponentially increasing length of time until it succeeds. For example, it waits 30 seconds before the second attempt, 60 seconds before the third, 120 seconds, and so on, up to a maximum of 16 minutes between retries until it successfully connects again. The agent retries up to six times for a given chunk of data before discarding and moving to the next one. This process continues until the agent can successfully upload again. For this reason, the data might be buffered up to approximately 30 minutes before it's discarded.

The default cache size is 10 MB but can be modified in the [omsagent.conf file](https://github.com/microsoft/OMS-Agent-for-Linux/blob/e2239a0714ae5ab5feddcc48aa7a4c4f971417d4/installer/conf/omsagent.conf).

## Next steps

- Review [Managing and maintaining the Log Analytics agent for Windows and Linux](agent-manage.md) to learn about how to reconfigure, upgrade, or remove the agent from the virtual machine.
- Review [Troubleshooting the Linux agent](agent-linux-troubleshoot.md) if you encounter issues while you're installing or managing the agent.
- Review [Agent data sources](./agent-data-sources.md) to learn about data source configuration.
