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
ms.date: 07/25/2021
ms.author: bagold

---

# Troubleshoot your CEF or Syslog data connector

This article describes common methods for troubleshooting a CEF or Syslog data connector for Azure Sentinel.

If your issue continues to recur, open a support ticket.

## Verify prerequisites

Use the following sections to check your CEF or Syslog data connector prerequisites:

### Azure Virtual Machine as a Syslog collector

If you're using an Azure Virtual Machine as a Syslog collector, verify the following:

- While you are setting up your Syslog data connector, make sure to turn off your Azure Security Center auto-provisioning settings for the MMA/OMS agent.

    You can turn them back on after your data connector is completely setup.

- Before you deploy the Common Event Format Data connector python script, make sure that your Virtual Machine isn't already connected to an existing Syslog workspace.

- Make sure that Azure Sentinel is connected to the correct Syslog workspace, with the **SecurityInsights** solution installed. 

    If you need to install this solution, run:

    ```cli
    sudo wget -O cef_installer.py https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/CEF/cef_installer.py&&sudo python cef_installer.py <WorkspaceId> <Primary Key>
    ```

- Make sure that your Virtual Machine is sized correctly, with a minimum of 4 virtual cores, and 8 GB of memory, allowing 8500 EPS.

### On-premises or a non-Azure Virtual Machine

If you are using an on-premises machine or a non-Azure virtual machine for your data connector, make sure that you've run the installation script on a fresh installation of a supported Linux Operating system:

> [!TIP]
> You can also find this script from the Common Event Format data connector page in Azure Sentinel.
>

```cli
sudo wget -O cef_installer.py https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/CEF/cef_installer.py&&sudo python cef_installer.py <WorkspaceId> <Primary Key>
```

### Enable your Syslog facility and log severity collection

The rsyslog server forwards any data defined in the **/etc/rsyslod.d/95.omsagent.conf** files, which is automatically populated by the settings defined in your Log Analytics workspace.

Make sure to add details about the facilities and severity log levels that you want to be ingested into Azure Sentinel. The configuration process may take about 20 minutes.

For more information, see [Configure Syslog in the Azure portal.](/azure/azure-monitor/agents/data-sources-syslog)

To review your changes to the **/etc/rsyslod.d/95.omsagent.conf** files, display the current settings in your VM. Run:

```powershell
cat /etc/rsyslog.d/95-omsagent.conf
```

For example, output similar to the following should display:

```powershell
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

1. If your Virtual Machine is in Azure, verify that the network security group (NSG) allows inbound TCP/UDP connectivity from your log client (Sender) on port 514.

1. Verify that packets are arriving to the Syslog Collector. To capture the syslog packets arriving to the Syslog Collector, run:

    ```powershell
    tcpdump -Ani any port 514 and host <ip_address_of_sender> -vv
    ```

1. Do one of the following:

    - If you do not see any packets arriving, confirm the NSG security group permissions and the routing path to the Syslog Collector.

    - If you do see packets arriving, confirm that they are not being rejected.

    If you see rejected packets, confirm that the IP tables are not blocking the connections.

    To confirm that packets are not being rejected, run:

    ```powershell
    watch -n 2 -d iptables -nvL
    ```

1. Verify whether the rsyslog server is processing the logs. Run:

    ```powershell
    tail -f /var/log/messages or tail -f /var/log/syslog
    ```

    Any Syslog or CEF logs being processed are displayed in plain text.

1. Confirm that the rsyslog server is listening on TCP/UDP port 514. Run:

    ```powershell
    netstat -anp | grep syslog
    ```

    If you have any CEF or ASA logs being sent to your Syslog Collector, you should see an established connection on TCP port 25226.

    For example:

    ```powershell
    0 127.0.0.1:36120 127.0.0.1:25226 ESTABLISHED 1055/rsyslogd
    ```

    If the connection is blocked, use any of the following sets of instructions to determine the issue.

### SELinux blocking connection to the OMSAgent

If your operating system is a distribution from RedHat or CentOS, confirm that SELinux is currently in a permissive state.

Run:

```powershell
sestatus
```

The status is displayed as one of the following:

- `disabled`. This configuration is supported for your connection to Azure Sentinel.
- `permissive`. This configuration is supported for your connection to Azure Sentinel.
- `enforced`. This configuration is not supported, and you must either disable the status or set it to `permissive`.

If the status is currently set to `enforced`, turn it off temporarily to confirm whether this was the blocker. Run:

```powershell
setenforce 0
```

To verify whether the change was successful, run:

```
getenforce
```

The `permissive` state should be returned.

> [!IMPORTANT]
> This setting update is lost when the system is rebooted. To permanently update this setting to `permissive`, modify the **/etc/selinux/config** file, changing the `SELINUX` value to `SELINUX=permissive`.
>
> For more information, see [RedHat documentation](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html/using_selinux/changing-selinux-states-and-modes_using-selinux).

<!-->
# cat /etc/selinux/config
# This file controls the state of SELinux on the system.
# SELINUX= can take one of these three values:
#     enforcing - SELinux security policy is enforced.
#     permissive - SELinux prints warnings instead of enforcing.
#     disabled - No SELinux policy is loaded.
SELINUX=permissive
# SELINUXTYPE= can take one of these two values:
#     targeted - Targeted processes are protected,
#     minimum - Modification of targeted policy. Only selected processes are protected.
#     mls - Multi Level Security protection.
SELINUXTYPE=targeted
-->

### Blocked firewalld process

The firewalld process may be blocking the connection from the rsyslog server to the OMS agent, and should be disabled.

Run the following command to verify whether there are any rejects in the IP tables:

```powershell
watch -n 2 -d iptables -nvL
```

If you want to keep the firewalld process enabled, you'll need to create a policy rule to allow the connections.

Add rules as needed to allow the TCP/UDP port 25226 and 25224 through the active firewall.

For more information, see <x>.

<!--
Every 2.0s: iptables -nvL                      rsyslog: Wed Jul  7 15:56:13 2021

Chain INPUT (policy ACCEPT 6185K packets, 2466M bytes)
 pkts bytes target     prot opt in     out     source               destination


Chain FORWARD (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination


Chain OUTPUT (policy ACCEPT 6792K packets, 6348M bytes)
 pkts bytes target     prot opt in     out     source               destination
To create a rule to allow tcp/udp port 25226 and 25224 through the active firewall you need to add the rules.

To install the Firewall Policy editor
yum install policycoreutils-python
Add the firewall rules to the firewall policy

sudo firewall-cmd --direct --add-rule ipv4 filter INPUT 0 -p tcp --dport 25226  -j ACCEPT
sudo firewall-cmd --direct --add-rule ipv4 filter INPUT 0 -p udp --dport 25224  -j ACCEPT
sudo firewall-cmd --direct --add-rule ipv4 filter INPUT 0 -p tcp --dport 25224  -j ACCEPT
Validate the exception was added in the configuration:

sudo firewall-cmd --direct --get-rules ipv4 filter INPUT
Reload the firewall:

sudo firewall-cmd --reload

You can disable your firewall by using this command

sudo systemctl stop firewalld
-->

## OMS Agent or Azure-related issues

If you're having issues related to the OMS Agent or Azure, use the following steps to troubleshoot:

1. Make sure that:

    - You can see packets arriving on TCP/UDP port 514 on the Syslog collector

    - You can see logs being written to the local log file, either **/var/log/messages** or **/var/log/syslog**

    - You can see data packets flowing on port 25524, 25526, or both

    - The virtual machine has an outbound connection to port 443 via TCP, or can connect to the [Log Analytics endpoints](/azure/azure-monitor/agents/log-analytics-agent#network-requirements)

1. Make sure that the Azure Virtual Machine is shown as connected in your workspace's list of virtual machines.

    Run the following command to determine if the agent is communicating successfully with Azure, or if the OMSAgent is blocked from connecting to the Log Analytics workspace. <!--when will this work and when won't it work?-->

    ```powershell
    Heartbeat
    | where Computer contains "<computername>"
    | sort by TimeGenerated desc
    ```

## Next steps

If the troubleshooting steps in this article have not helped your issue, open a support ticket or use the Azure Sentinel community resources.

For more information, see [Useful resources for working with Azure Sentinel](resources.md).
