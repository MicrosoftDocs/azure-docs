---
title: Troubleshoot a connection between Azure Sentinel and a CEF or Syslog data connector| Microsoft Docs
description: Learn how to troubleshoot issues with your Azure Sentinel CEF or Syslog data connector.
services: sentinel
documentationcenter: na
author: batamig
manager: rkarlin
editor: ''

ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 07/26/2021
ms.author: bagold

---

# Troubleshoot your CEF or Syslog data connector

This article describes common methods for troubleshooting a CEF or Syslog data connector for Azure Sentinel.

For more information, see [Connect your external solution using Common Event Format](connect-common-event-format.md) and [Collect data from Linux-based sources using Syslog](connect-syslog.md).

## Verify prerequisites

Use the following sections to check your CEF or Syslog data connector prerequisites.

### Azure Virtual Machine as a Syslog collector

If you're using an Azure Virtual Machine as a Syslog collector, verify the following:

- While you are setting up your Syslog data connector, make sure to turn off your [Azure Security Center auto-provisioning settings](/azure/security-center/security-center-enable-data-collection) for the [MMA/OMS agent](connect-windows-security-events.md#connector-options).

    You can turn them back on after your data connector is completely setup.

- Before you deploy the [Common Event Format Data connector python script](connect-cef-agent.md), make sure that your Virtual Machine isn't already connected to an existing Syslog workspace. You can find this information on the Log Analytics Workspace Virtual Machine list, where a VM that's connected to a Syslog workspace is listed as **Connected**.

- Make sure that Azure Sentinel is connected to the correct Syslog workspace, with the **SecurityInsights** solution installed.

    For more information, see [Step 1: Deploy the log forwarder](connect-cef-agent.md).

- Make sure that your Virtual Machine is sized correctly with at least the minimum required prerequisites. For more information, see [CEF prerequisites](connect-common-event-format.md#prerequisites).

### On-premises or a non-Azure Virtual Machine

If you are using an on-premises machine or a non-Azure virtual machine for your data connector, make sure that you've run the installation script on a fresh installation of a supported Linux operating system:

> [!TIP]
> You can also find this script from the **Common Event Format** data connector page in Azure Sentinel.
>

```cli
sudo wget -O cef_installer.py https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/CEF/cef_installer.py&&sudo python cef_installer.py <WorkspaceId> <Primary Key>
```

### Enable your Syslog facility and log severity collection

The rsyslog server forwards any data defined in the **/etc/rsyslod.d/95.omsagent.conf** files, which is automatically populated by the settings defined in your Log Analytics workspace.

Make sure to add details about the facilities and severity log levels that you want to be ingested into Azure Sentinel. The configuration process may take about 20 minutes.

For more information, see [Configure Syslog in the Azure portal.](/azure/azure-monitor/agents/data-sources-syslog)

To review your changes to the **/etc/rsyslod.d/95.omsagent.conf** files, display the current settings in your VM. Run:

```config
cat /etc/rsyslog.d/95-omsagent.conf
```

For example, output similar to the following should display:

```config
OMS Syslog collection for workspace c69fa733-da2e-4cf9-8d92-eee3bd23fe81
auth.=alert;auth.=crit;auth.=debug;auth.=emerg;auth.=err;auth.=info;auth.=notice;auth.=warning  @127.0.0.1:25224
authpriv.=alert;authpriv.=crit;authpriv.=debug;authpriv.=emerg;authpriv.=err;authpriv.=info;authpriv.=notice;authpriv.=warning  @127.0.0.1:25224
cron.=alert;cron.=crit;cron.=debug;cron.=emerg;cron.=err;cron.=info;cron.=notice;cron.=warning  @127.0.0.1:25224
local0.=alert;local0.=crit;local0.=debug;local0.=emerg;local0.=err;local0.=info;local0.=notice;local0.=warning  @127.0.0.1:25224
local4.=alert;local4.=crit;local4.=debug;local4.=emerg;local4.=err;local4.=info;local4.=notice;local4.=warning  @127.0.0.1:25224
syslog.=alert;syslog.=crit;syslog.=debug;syslog.=emerg;syslog.=err;syslog.=info;syslog.=notice;syslog.=warning  @127.0.0.1:25224
```

## Troubleshoot operating system issues

This procedure describes how to troubleshoot issues that are certainly derived from the operating system configuration.

**To troubleshoot operating system issues**:

1. If you haven't yet, verify that you're working with a supported operating system and Python version. For more information, see [CEF prerequisites](connect-common-event-format.md#prerequisites) and [Configure your Linux machine or appliance](connect-syslog.md#configure-your-linux-machine-or-appliance).

1. If your Virtual Machine is in Azure, verify that the network security group (NSG) allows inbound TCP/UDP connectivity from your log client (Sender) on port 514.

1. Verify that packets are arriving to the Syslog Collector. To capture the syslog packets arriving to the Syslog Collector, run:

    ```config
    tcpdump -Ani any port 514 and host <ip_address_of_sender> -vv
    ```

1. Do one of the following:

    - If you do not see any packets arriving, confirm the NSG security group permissions and the routing path to the Syslog Collector.

    - If you do see packets arriving, confirm that they are not being rejected.

    If you see rejected packets, confirm that the IP tables are not blocking the connections.

    To confirm that packets are not being rejected, run:

    ```config
    watch -n 2 -d iptables -nvL
    ```

1. Verify whether the rsyslog server is processing the logs. Run:

    ```config
    tail -f /var/log/messages or tail -f /var/log/syslog
    ```

    Any Syslog or CEF logs being processed are displayed in plain text.

1. Confirm that the rsyslog server is listening on TCP/UDP port 514. Run:

    ```config
    netstat -anp | grep syslog
    ```

    If you have any CEF or ASA logs being sent to your Syslog Collector, you should see an established connection on TCP port 25226.

    For example:

    ```config
    0 127.0.0.1:36120 127.0.0.1:25226 ESTABLISHED 1055/rsyslogd
    ```

    If the connection is blocked, you may have a [blocked SELinux connection to the OMS agent](#selinux-blocking-connection-to-the-oms-agent), or a [blocked firewalld process](#blocked-firewall-policy). Use the following sets of instructions to determine the issue.

### SELinux blocking connection to the OMS agent

This procedure describes how to confirm whether SELinux is currently in a `permissive` state, or is blocking a connection to the OMS agent. This procedure is relevant when your operating system is a distribution from RedHat or CentOS.

> [!NOTE]
> Azure Sentinel support for CEF and Syslog only includes FIPS hardening. Other hardening methods, such as SELinux or CIS are not currently supported.
>

1. Run:

    ```config
    sestatus
    ```

    The status is displayed as one of the following:

    - `disabled`. This configuration is supported for your connection to Azure Sentinel.
    - `permissive`. This configuration is supported for your connection to Azure Sentinel.
    - `enforced`. This configuration is not supported, and you must either disable the status or set it to `permissive`.

1. If the status is currently set to `enforced`, turn it off temporarily to confirm whether this was the blocker. Run:

    ```config
    setenforce 0
    ```

    > [!NOTE]
    > This step turns off SELinux only until the server reboots. Modify the SELinux configuration to keep it turned off.
    >

1. To verify whether the change was successful, run:

    ```
    getenforce
    ```

    The `permissive` state should be returned.

> [!IMPORTANT]
> This setting update is lost when the system is rebooted. To permanently update this setting to `permissive`, modify the **/etc/selinux/config** file, changing the `SELINUX` value to `SELINUX=permissive`.
>
> For more information, see [RedHat documentation](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html/using_selinux/changing-selinux-states-and-modes_using-selinux).


### Blocked firewall policy

This procedure describes how to verify whether a firewall policy is blocking the connection from the **Rsyslog daemon to the OMS agent, and how to disable it as needed.


1. Run the following command to verify whether there are any rejects in the IP tables, indicating traffic that's being dropped by the firewall policy.

    ```config
    watch -n 2 -d iptables -nvL
    ```

1. To keep the firewall policy enabled, create a policy rule to allow the connections. Add rules as needed to allow the TCP/UDP ports 25226 and 25224 through the active firewall.

    For example:

    ```config
    Every 2.0s: iptables -nvL                      rsyslog: Wed Jul  7 15:56:13 2021

    Chain INPUT (policy ACCEPT 6185K packets, 2466M bytes)
     pkts bytes target     prot opt in     out     source               destination


    Chain FORWARD (policy ACCEPT 0 packets, 0 bytes)
     pkts bytes target     prot opt in     out     source               destination


    Chain OUTPUT (policy ACCEPT 6792K packets, 6348M bytes)
     pkts bytes target     prot opt in     out     source               destination
    ```

    For more information, see the [CentOS Wiki](https://wiki.centos.org/HowTos/Network/IPTables).

1. To create a rule to allow TCP/UDP ports 25226 and 25224 through the active firewall, add rules as needed.

    1. To install the Firewall Policy editor, run:

        ```config
        yum install policycoreutils-python
        ```

    1. Add the firewall rules to the firewall policy. For example:

        ```config
        sudo firewall-cmd --direct --add-rule ipv4 filter INPUT 0 -p tcp --dport 25226  -j ACCEPT
        sudo firewall-cmd --direct --add-rule ipv4 filter INPUT 0 -p udp --dport 25224  -j ACCEPT
        sudo firewall-cmd --direct --add-rule ipv4 filter INPUT 0 -p tcp --dport 25224  -j ACCEPT
        ```

    1. Verify that the exception was added. Run:

        ```config
        sudo firewall-cmd --direct --get-rules ipv4 filter INPUT
        ```

    1. Reload the firewall. Run:

        ```config
        sudo firewall-cmd --reload
        ```

> [!NOTE]
> To disable the firewall, run: `sudo systemctl disable firewalld`
>

## OMS Agent or Azure-related issues

If you're having issues related to the OMS Agent or Azure, troubleshoot by verifying the following:

- Make sure that you can see packets arriving on TCP/UDP port 514 on the Syslog collector

- Make sure that you can see logs being written to the local log file, either **/var/log/messages** or **/var/log/syslog**

- Make sure that you can see data packets flowing on port 25524, 25526, or both

- Make sure that your virtual machine has an outbound connection to port 443 via TCP, or can connect to the [Log Analytics endpoints](/azure/azure-monitor/agents/log-analytics-agent#network-requirements)

- Make sure that your Azure Virtual Machine is shown as connected in your workspace's list of virtual machines.

Run the following command to determine if the agent is communicating successfully with Azure, or if the OMS agent is blocked from connecting to the Log Analytics workspace. <!--when will this work and when won't it work?-->

```config
Heartbeat
 | where Computer contains "<computername>"
 | sort by TimeGenerated desc
```

## Next steps

If the troubleshooting steps in this article have not helped your issue, open a support ticket or use the Azure Sentinel community resources.

For more information, see [Useful resources for working with Azure Sentinel](resources.md).
