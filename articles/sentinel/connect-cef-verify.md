---
title: Validate connectivity to Azure Sentinel | Microsoft Docs
description: Validate connectivity of your security solution to make sure CEF messages are being forwarded to Azure Sentinel.
services: sentinel
documentationcenter: na
author: yelevin
manager: rkarlin
editor: ''

ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 01/05/2021
ms.author: yelevin

---
# STEP 3: Validate connectivity

Once you have deployed your log forwarder (in Step 1) and configured your security solution to send it CEF messages (in Step 2), follow these instructions to verify connectivity between your security solution and Azure Sentinel.

## Prerequisites

- You must have elevated permissions (sudo) on your log forwarder machine.

- You must have **python 2.7** or **3** installed on your log forwarder machine.<br>
Use the `python –version` command to check.

- You may need the Workspace ID and Workspace Primary Key at some point in this process. You can find them in the workspace resource, under **Agents management**.

## How to validate connectivity

1. From the Azure Sentinel navigation menu, open **Logs**. Run a query using the **CommonSecurityLog** schema to see if you are receiving logs from your security solution.<br>
Be aware that it may take about 20 minutes until your logs start to appear in **Log Analytics**.

1. If you don't see any results from the query, verify that events are being generated from your security solution, or try generating some, and verify they are being forwarded to the Syslog forwarder machine you designated.

1. Run the following script on the log forwarder (applying the Workspace ID in place of the placeholder) to check connectivity between your security solution, the log forwarder, and Azure Sentinel. This script checks that the daemon is listening on the correct ports, that the forwarding is properly configured, and that nothing is blocking communication between the daemon and the Log Analytics agent. It also sends mock messages 'TestCommonEventFormat' to check end-to-end connectivity. <br>

    ```bash
    sudo wget -O cef_troubleshoot.py https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/CEF/cef_troubleshoot.py&&sudo python cef_troubleshoot.py [WorkspaceID]
    ```

   - You may get a message directing you to run a command to correct an issue with the **mapping of the *Computer* field**. See the [explanation in the validation script](#mapping-command) for details.

    - You may get a message directing you to run a command to correct an issue with the **parsing of Cisco ASA firewall logs**. See the [explanation in the validation script](#parsing-command) for details.

## Validation script explained

The validation script performs the following checks:

# [rsyslog daemon](#tab/rsyslog)

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

    - Configuration file: `/etc/rsyslog.d/security-config-omsagent.conf`

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

1. Sends MOCK data to port 514 on localhost. This data should be observable in the Azure Sentinel workspace by running the following query:

    ```kusto
    CommonSecurityLog
    | where DeviceProduct == "MOCK"
    ```

# [syslog-ng daemon](#tab/syslogng)

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

1. Sends MOCK data to port 514 on localhost. This data should be observable in the Azure Sentinel workspace by running the following query:

    ```kusto
    CommonSecurityLog
    | where DeviceProduct == "MOCK"
    ```
---


## Next steps

In this document, you learned how to connect CEF appliances to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:

- Learn about [CEF and CommonSecurityLog field mapping](cef-name-mapping.md).
- Learn how to [get visibility into your data, and potential threats](get-visibility.md).
- Get started [detecting threats with Azure Sentinel](./detect-threats-built-in.md).
- [Use workbooks](tutorial-monitor-your-data.md) to monitor your data.