---
title: Troubleshoot a connection between Microsoft Sentinel and a CEF or Syslog data connector| Microsoft Docs
description: Learn how to troubleshoot issues with your Microsoft Sentinel CEF or Syslog data connector.
author: limwainstein
ms.topic: how-to
ms.date: 01/09/2023
ms.author: lwainstein
ms.custom: ignite-fall-2021
---

# Troubleshoot your CEF or Syslog data connector

This article describes common methods for verifying and troubleshooting a CEF or Syslog data connector for Microsoft Sentinel.

For example, if your logs are not appearing in Microsoft Sentinel, either in the Syslog or the Common Security Log tables, your data source may be failing to connect or there may be another reason your data is not being ingested.

Other symptoms of a failed connector deployment include when either the **security_events.conf** or the **security-omsagent.config.conf** files are missing, or if the rsyslog server is not listening on port 514.

For more information, see [Connect your external solution using Common Event Format](connect-common-event-format.md) and [Collect data from Linux-based sources using Syslog](connect-syslog.md).

If you've deployed your connector using a method different than the documented procedure and are having issues, we recommend that you purge the deployment and install again as documented.

This article shows you how to troubleshoot CEF or Syslog connectors with the Log Analytics agent. For troubleshooting information related to ingesting CEF logs via the Azure Monitor Agent (AMA), review the [Common Event Format (CEF) via AMA](connect-cef-ama.md) connector instructions.

> [!IMPORTANT]
>
> On **February 28th 2023**, we introduced changes to the CommonSecurityLog table schema. Following this change, you might need to review and update custom queries. For more details, see the [recommended actions section](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/upcoming-changes-to-the-commonsecuritylog-table/ba-p/3643232) in this blog post. Out-of-the-box content (detections, hunting queries, workbooks, parsers, etc.) has been updated by Microsoft Sentinel.

## How to use this article

When information in this article is relevant only for Syslog or only for CEF connectors, we've organized the page into tabs. Make sure that you're using the instructions on the correct tab for your connector type.

For example, if you're troubleshooting a CEF connector, start with [Validate CEF connectivity](#validate-cef-connectivity). If you're troubleshooting a Syslog connector, start below, with [Verify your data connector prerequisites](#verify-your-data-connector-prerequisites).

# [CEF](#tab/cef)

### Validate CEF connectivity

After you've [deployed your log forwarder](connect-common-event-format.md) and [configured your security solution to send it CEF messages](./connect-common-event-format.md), use the steps in this section to verify connectivity between your security solution and Microsoft Sentinel.

This procedure is relevant only for CEF connections, and is *not* relevant for Syslog connections.

1. Make sure that you have the following prerequisites:

    - You must have elevated permissions (sudo) on your log forwarder machine.

    - You must have **python 2.7** or **3** installed on your log forwarder machine. Use the `python --version` command to check.

    - You may need the Workspace ID and Workspace Primary Key at some point in this process. You can find them in the workspace resource, under **Agents management**.

1. From the Microsoft Sentinel navigation menu, open **Logs**. Run a query using the **CommonSecurityLog** schema to see if you are receiving logs from your security solution.

    It may take about 20 minutes until your logs start to appear in **Log Analytics**.

1. If you don't see any results from the query, verify that events are being generated from your security solution, or try generating some, and verify they are being forwarded to the Syslog forwarder machine you designated.

1. Run the following script on the log forwarder (applying the Workspace ID in place of the placeholder) to check connectivity between your security solution, the log forwarder, and Microsoft Sentinel. This script checks that the daemon is listening on the correct ports, that the forwarding is properly configured, and that nothing is blocking communication between the daemon and the Log Analytics agent. It also sends mock messages 'TestCommonEventFormat' to check end-to-end connectivity. <br>

    ```bash
    sudo wget -O cef_troubleshoot.py https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/CEF/cef_troubleshoot.py&&sudo python cef_troubleshoot.py [WorkspaceID]
    ```

   - You may get a message directing you to run a command to correct an issue with the **mapping of the *Computer* field**. See the [explanation in the validation script](#mapping-command) for details.

    - You may get a message directing you to run a command to correct an issue with the **parsing of Cisco ASA firewall logs**. See the [explanation in the validation script](#parsing-command) for details.

### CEF validation script explained

The following section describes the CEF validation script, for the [rsyslog daemon](#rsyslog-daemon) and the [syslog-ng daemon](#syslog-ng-daemon).

#### rsyslog daemon

For an rsyslog daemon, the CEF validation script runs the following checks:

1. Checks that the file<br>
    `/etc/opt/microsoft/omsagent/[WorkspaceID]/conf/omsagent.d/security_events.conf`<br>
    exists and is valid.

1. Checks that the file includes the following text:

    ```bash
    <source>
        type syslog
        port 25226
        bind 127.0.0.1
        protocol_type tcp
        tag oms.security
        format /(?<time>(?:\w+ +){2,3}(?:\d+:){2}\d+|\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.[\w\-\:\+]{3,12}):?\s*(?:(?<host>[^: ]+) ?:?)?\s*(?<ident>.*CEF.+?(?=0\|)|%ASA[0-9\-]{8,10})\s*:?(?<message>0\|.*|.*)/
        <parse>
            message_format auto
        </parse>
    </source>

    <filter oms.security.**>
        type filter_syslog_security
    </filter>
    ```

1. Checks that the parsing for Cisco ASA Firewall events is configured as expected, using the following command:

    ```bash
    grep -i "return ident if ident.include?('%ASA')" /opt/microsoft/omsagent/plugin/security_lib.rb
    ```

    - <a name="parsing-command"></a>If there is an issue with the parsing, the script will produce an error message directing you to **manually run the following command** (applying the Workspace ID in place of the placeholder). The command will ensure the correct parsing and restart the agent.

        ```bash
        # Cisco ASA parsing fix
        sed -i "s|return '%ASA' if ident.include?('%ASA')|return ident if ident.include?('%ASA')|g" /opt/microsoft/omsagent/plugin/security_lib.rb && sudo /opt/microsoft/omsagent/bin/service_control restart [workspaceID]
        ```

1. Checks that the *Computer* field in the syslog source is properly mapped in the Log Analytics agent, using the following command:

    ```bash
    grep -i "'Host' => record\['host'\]"  /opt/microsoft/omsagent/plugin/filter_syslog_security.rb
    ```

    - <a name="mapping-command"></a>If there is an issue with the mapping, the script will produce an error message directing you to **manually run the following command** (applying the Workspace ID in place of the placeholder). The command will ensure the correct mapping and restart the agent.

        ```bash
        # Computer field mapping fix
        sed -i -e "/'Severity' => tags\[tags.size - 1\]/ a \ \t 'Host' => record['host']" -e "s/'Severity' => tags\[tags.size - 1\]/&,/" /opt/microsoft/omsagent/plugin/filter_syslog_security.rb && sudo /opt/microsoft/omsagent/bin/service_control restart [workspaceID]
        ```

1. Checks if there are any security enhancements on the machine that might be blocking network traffic (such as a host firewall).

1. Checks that the syslog daemon (rsyslog) is properly configured to send messages (that it identifies as CEF) to the Log Analytics agent on TCP port 25226:

    Configuration file: `/etc/rsyslog.d/security-config-omsagent.conf`

    ```bash
    if $rawmsg contains "CEF:" or $rawmsg contains "ASA-" then @@127.0.0.1:25226
    ```

1. Restarts the syslog daemon and the Log Analytics agent:

    ```bash
    service rsyslog restart

    /opt/microsoft/omsagent/bin/service_control restart [workspaceID]
    ```

1. Checks that the necessary connections are established: tcp 514 for receiving data, tcp 25226 for internal communication between the syslog daemon and the Log Analytics agent:

    ```bash
    netstat -an | grep 514

    netstat -an | grep 25226
    ```

1. Checks that the syslog daemon is receiving data on port 514, and that the agent is receiving data on port 25226:

    ```bash
    sudo tcpdump -A -ni any port 514 -vv

    sudo tcpdump -A -ni any port 25226 -vv
    ```

1. Sends MOCK data to port 514 on localhost. This data should be observable in the Microsoft Sentinel workspace by running the following query:

    ```kusto
    CommonSecurityLog
    | where DeviceProduct == "MOCK"
    ```

#### syslog-ng daemon

For a syslog-ng daemon, the CEF validation script runs the following checks:

1. Checks that the file<br>
    `/etc/opt/microsoft/omsagent/[WorkspaceID]/conf/omsagent.d/security_events.conf`<br>
    exists and is valid.

1. Checks that the file includes the following text:

    ```bash
    <source>
        type syslog
        port 25226
        bind 127.0.0.1
        protocol_type tcp
        tag oms.security
        format /(?<time>(?:\w+ +){2,3}(?:\d+:){2}\d+|\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.[\w\-\:\+]{3,12}):?\s*(?:(?<host>[^: ]+) ?:?)?\s*(?<ident>.*CEF.+?(?=0\|)|%ASA[0-9\-]{8,10})\s*:?(?<message>0\|.*|.*)/
        <parse>
            message_format auto
        </parse>
    </source>

    <filter oms.security.**>
        type filter_syslog_security
    </filter>
    ```

1. Checks that the parsing for Cisco ASA Firewall events is configured as expected, using the following command:

    ```bash
    grep -i "return ident if ident.include?('%ASA')" /opt/microsoft/omsagent/plugin/security_lib.rb
    ```

    - <a name="parsing-command"></a>If there is an issue with the parsing, the script will produce an error message directing you to **manually run the following command** (applying the Workspace ID in place of the placeholder). The command will ensure the correct parsing and restart the agent.

        ```bash
        # Cisco ASA parsing fix
        sed -i "s|return '%ASA' if ident.include?('%ASA')|return ident if ident.include?('%ASA')|g" /opt/microsoft/omsagent/plugin/security_lib.rb && sudo /opt/microsoft/omsagent/bin/service_control restart [workspaceID]
        ```

1. Checks that the *Computer* field in the syslog source is properly mapped in the Log Analytics agent, using the following command:

    ```bash
    grep -i "'Host' => record\['host'\]"  /opt/microsoft/omsagent/plugin/filter_syslog_security.rb
    ```

    - <a name="mapping-command"></a>If there is an issue with the mapping, the script will produce an error message directing you to **manually run the following command** (applying the Workspace ID in place of the placeholder). The command will ensure the correct mapping and restart the agent.

        ```bash
        # Computer field mapping fix
        sed -i -e "/'Severity' => tags\[tags.size - 1\]/ a \ \t 'Host' => record['host']" -e "s/'Severity' => tags\[tags.size - 1\]/&,/" /opt/microsoft/omsagent/plugin/filter_syslog_security.rb && sudo /opt/microsoft/omsagent/bin/service_control restart [workspaceID]
        ```

1. Checks if there are any security enhancements on the machine that might be blocking network traffic (such as a host firewall).

1. Checks that the syslog daemon (syslog-ng) is properly configured to send messages that it identifies as CEF (using a regex) to the Log Analytics agent on TCP port 25226:

    - Configuration file: `/etc/syslog-ng/conf.d/security-config-omsagent.conf`

        ```bash
        filter f_oms_filter {match(\"CEF\|ASA\" ) ;};destination oms_destination {tcp(\"127.0.0.1\" port(25226));};
        log {source(s_src);filter(f_oms_filter);destination(oms_destination);};
        ```

1. Restarts the syslog daemon and the Log Analytics agent:

    ```bash
    service syslog-ng restart

    /opt/microsoft/omsagent/bin/service_control restart [workspaceID]
    ```

1. Checks that the necessary connections are established: tcp 514 for receiving data, tcp 25226 for internal communication between the syslog daemon and the Log Analytics agent:

    ```bash
    netstat -an | grep 514

    netstat -an | grep 25226
    ```

1. Checks that the syslog daemon is receiving data on port 514, and that the agent is receiving data on port 25226:

    ```bash
    sudo tcpdump -A -ni any port 514 -vv

    sudo tcpdump -A -ni any port 25226 -vv
    ```

1. Sends MOCK data to port 514 on localhost. This data should be observable in the Microsoft Sentinel workspace by running the following query:

    ```kusto
    CommonSecurityLog
    | where DeviceProduct == "MOCK"
    ```

# [Syslog](#tab/syslog)

### Troubleshooting Syslog data connectors

If you are troubleshooting a Syslog data connector, start with verifying your prerequisites in the section [below](#verify-your-data-connector-prerequisites), using the information in the **Syslog** tab.

---

## Verify your data connector prerequisites

Use the following sections to check your CEF or Syslog data connector prerequisites.

# [CEF](#tab/cef)

### Azure Virtual Machine as a CEF collector

If you're using an Azure Virtual Machine as a CEF collector, verify the following:

- Before you deploy the [Common Event Format Data connector Python script](./connect-log-forwarder.md), make sure that your Virtual Machine isn't already connected to an existing Log Analytics workspace. You can find this information on the Log Analytics Workspace Virtual Machine list, where a VM that's connected to a Syslog workspace is listed as **Connected**.

- Make sure that Microsoft Sentinel is connected to the correct Log Analytics workspace, with the **SecurityInsights** solution installed.

    For more information, see [Step 1: Deploy the log forwarder](./connect-log-forwarder.md).

- Make sure that your machine is sized correctly with at least the minimum required prerequisites. For more information, see [CEF prerequisites](connect-common-event-format.md#prerequisites).

### On-premises or a non-Azure Virtual Machine

If you are using an on-premises machine or a non-Azure virtual machine for your data connector, make sure that you've run the installation script on a fresh installation of a supported Linux operating system:

> [!TIP]
> You can also find this script from the **Common Event Format** data connector page in Microsoft Sentinel.
>

```cli
sudo wget -O cef_installer.py https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/CEF/cef_installer.py&&sudo python cef_installer.py <WorkspaceId> <Primary Key>
```

### Enable your CEF facility and log severity collection

The Syslog server, either rsyslog or syslog-ng, forwards any data defined in the relevant configuration file, which is automatically populated by the settings defined in your Log Analytics workspace.

Make sure to add details about the facilities and severity log levels that you want to be ingested into Microsoft Sentinel. The configuration process may take about 20 minutes.

For more information, see [Deployment script explained](./connect-log-forwarder.md#deployment-script-explained).

For example, for an rsyslog server, run the following command to display the current settings for your Syslog forwarding, and review any changes to the configuration file:

```bash
cat /etc/rsyslog.d/security-config-omsagent.conf
```

In this case, for rsyslog, output similar to the following should display:

```bash
if $rawmsg contains "CEF:" or $rawmsg contains "ASA-" then @@127.0.0.1:25226
```


# [Syslog](#tab/syslog)

### Azure Virtual Machine as a Syslog collector

If you're using an Azure Virtual Machine as a Syslog collector, verify the following:

- While you are setting up your Syslog data connector, make sure to turn off your [Microsoft Defender for Cloud auto-provisioning settings](../security-center/security-center-enable-data-collection.md) for the [MMA/OMS agent](connect-windows-security-events.md#connector-options).

    You can turn them back on after your data connector is completely set up.

- Make sure that Microsoft Sentinel is connected to the correct Log Analytics workspace, with the **SecurityInsights** solution installed.

    For more information, see [Step 1: Deploy the log forwarder](./connect-log-forwarder.md).

- Make sure that your machine is sized correctly with at least the minimum required prerequisites. For more information, see [CEF prerequisites](connect-common-event-format.md#prerequisites).

### Enable your Syslog facility and log severity collection

The Syslog server, either rsyslog or syslog-ng, forwards any data defined in the relevant configuration file, which is automatically populated by the settings defined in your Log Analytics workspace.

Make sure to add details about the facilities and severity log levels that you want to be ingested into Microsoft Sentinel. The configuration process may take about 20 minutes.

For more information, see [Deployment script explained](./connect-log-forwarder.md#deployment-script-explained). and [Configure Syslog in the Azure portal](../azure-monitor/agents/data-sources-syslog.md).

**For example, for an rsyslog server**, run the following command to display the current settings for your Syslog forwarding, and review any changes to the configuration file:

```bash
cat /etc/rsyslog.d/95-omsagent.conf
```

In this case, for rsyslog, output similar to the following should display. The contents of this file should reflect what's defined in the Syslog Configuration on the **Log Analytics Workspace Client configuration - Syslog facility settings** screen.


```bash
OMS Syslog collection for workspace c69fa733-da2e-4cf9-8d92-eee3bd23fe81
auth.=alert;auth.=crit;auth.=debug;auth.=emerg;auth.=err;auth.=info;auth.=notice;auth.=warning  @127.0.0.1:25224
authpriv.=alert;authpriv.=crit;authpriv.=debug;authpriv.=emerg;authpriv.=err;authpriv.=info;authpriv.=notice;authpriv.=warning  @127.0.0.1:25224
cron.=alert;cron.=crit;cron.=debug;cron.=emerg;cron.=err;cron.=info;cron.=notice;cron.=warning  @127.0.0.1:25224
local0.=alert;local0.=crit;local0.=debug;local0.=emerg;local0.=err;local0.=info;local0.=notice;local0.=warning  @127.0.0.1:25224
local4.=alert;local4.=crit;local4.=debug;local4.=emerg;local4.=err;local4.=info;local4.=notice;local4.=warning  @127.0.0.1:25224
syslog.=alert;syslog.=crit;syslog.=debug;syslog.=emerg;syslog.=err;syslog.=info;syslog.=notice;syslog.=warning  @127.0.0.1:25224
```

---


## Troubleshoot operating system issues

This section describes how to troubleshoot issues that are certainly derived from the operating system configuration.

# [CEF](#tab/cef)

**To troubleshoot operating system issues**:

1. If you haven't yet, verify that you're working with a supported operating system and Python version. For more information, see [CEF prerequisites](connect-common-event-format.md#prerequisites).

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

1. Verify whether the CEF server is processing the logs. Run:

    ```config
    tail -f /var/log/messages or tail -f /var/log/syslog
    ```

    Any CEF logs being processed are displayed in plain text.

1. Confirm that the rsyslog server is listening on TCP/UDP port 514. Run:

    ```config
    netstat -anp | grep syslog
    ```

    If you have any CEF or ASA logs being sent to your Syslog Collector, you should see an established connection on TCP port 25226.

    For example:

    ```config
    0 127.0.0.1:36120 127.0.0.1:25226 ESTABLISHED 1055/rsyslogd
    ```

    If the connection is blocked, you may have a [blocked SELinux connection to the OMS agent](#selinux-blocking-connection-to-the-oms-agent), or a [blocked firewall process](#blocked-firewall-policy). Use the relevant instructions below to determine the issue.


# [Syslog](#tab/syslog)

**To troubleshoot operating system issues**:

1. If you haven't yet, verify that you're working with a supported operating system and Python version. For more information, see [Configure your Linux machine or appliance](connect-syslog.md#configure-your-linux-machine-or-appliance).

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

1. Verify whether the Syslog server is processing the logs. Run:

    ```config
    tail -f /var/log/messages or tail -f /var/log/syslog
    ```

    Any Syslog logs being processed are displayed in plain text.

1. Confirm that the rsyslog server is listening on TCP/UDP port 514. Run:

    ```config
    netstat -anp | grep syslog
    ```
---

### SELinux blocking connection to the OMS agent

This procedure describes how to confirm whether SELinux is currently in a `permissive` state, or is blocking a connection to the OMS agent. This procedure is relevant when your operating system is a distribution from RedHat or CentOS, and for both CEF and Syslog data connectors.

> [!NOTE]
> Microsoft Sentinel support for CEF and Syslog only includes FIPS hardening. Other hardening methods, such as SELinux or CIS are not currently supported.
>

1. Run:

    ```config
    sestatus
    ```

    The status is displayed as one of the following:

    - `disabled`. This configuration is supported for your connection to Microsoft Sentinel.
    - `permissive`. This configuration is supported for your connection to Microsoft Sentinel.
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

This procedure describes how to verify whether a firewall policy is blocking the connection from the Rsyslog daemon to the OMS agent, and how to disable it as needed. This procedure is relevant for both CEF and Syslog data connectors.


1. Run the following command to verify whether there are any rejects in the IP tables, indicating traffic that's being dropped by the firewall policy:

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

## Linux and OMS Agent-related issues

# [CEF](#tab/cef)

If the steps described earlier in this article do not solve your issue, you may have a connectivity problem between the OMS Agent and the Microsoft Sentinel workspace.

In such cases, continue troubleshooting by verifying the following:

- Make sure that you can see packets arriving on TCP/UDP port 514 on the Syslog collector

- Make sure that you can see logs being written to the local log file, either **/var/log/messages** or **/var/log/syslog**

- Make sure that you can see data packets flowing on port 25226

- Make sure that your virtual machine has an outbound connection to port 443 via TCP, or can connect to the [Log Analytics endpoints](../azure-monitor/agents/log-analytics-agent.md#network-requirements)

- Make sure that you have access to required URLs from your CEF collector through your firewall policy. For more information, see [Log Analytics agent firewall requirements](../azure-monitor/agents/log-analytics-agent.md#firewall-requirements).

Run the following command to determine if the agent is communicating successfully with Azure, or if the OMS agent is blocked from connecting to the Log Analytics workspace.

```config
Heartbeat
 | where Computer contains "<computername>"
 | sort by TimeGenerated desc
```

A log entry is returned if the agent is communicating successfully. Otherwise, the OMS agent may be blocked.


# [Syslog](#tab/syslog)

If the steps described earlier in this article do not solve your issue, you may have a connectivity problem between the OMS Agent and the Microsoft Sentinel workspace.

In such cases, continue troubleshooting by verifying the following:

- Make sure that you can see packets arriving on TCP/UDP port 514 on the Syslog collector

- Make sure that you can see logs being written to the local log file, either **/var/log/messages** or **/var/log/syslog**

- Make sure that you can see data packets flowing on port 25224

- Make sure that your virtual machine has an outbound connection to port 443 via TCP, or can connect to the [Log Analytics endpoints](../azure-monitor/agents/log-analytics-agent.md#network-requirements)

- Make sure that you have access to required URLs from your Syslog or CEF collector through your firewall policy. For more information, see [Log Analytics agent firewall requirements](../azure-monitor/agents/log-analytics-agent.md#firewall-requirements).

- Make sure that your Azure Virtual Machine is shown as connected in your workspace's list of virtual machines.

Run the following command to determine if the agent is communicating successfully with Azure, or if the OMS agent is blocked from connecting to the Log Analytics workspace.

```config
Heartbeat
 | where Computer contains "<computername>"
 | sort by TimeGenerated desc
```

A log entry is returned if the agent is communicating successfully. Otherwise, the OMS agent may be blocked.

---

## Next steps

If the troubleshooting steps in this article have not helped your issue, open a support ticket or use the Microsoft Sentinel community resources. For more information, see [Useful resources for working with Microsoft Sentinel](resources.md).

To learn more about Microsoft Sentinel, see the following articles:

- Learn about [CEF and CommonSecurityLog field mapping](cef-name-mapping.md).
- Learn how to [get visibility into your data, and potential threats](get-visibility.md).
- Get started [detecting threats with Microsoft Sentinel](./detect-threats-built-in.md).
- [Use workbooks](monitor-your-data.md) to monitor your data.
