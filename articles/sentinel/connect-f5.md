---
title: Connect F5 data to Azure Sentinel Preview| Microsoft Docs
description: Learn how to connect F5 data to Azure Sentinel.
services: sentinel
documentationcenter: na
author: rkarlin
manager: rkarlin
editor: ''

ms.assetid: 0001cad6-699c-4ca9-b66c-80c194e439a5
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 07/31/2019
ms.author: rkarlin

---
# Connect your F5 appliance

> [!IMPORTANT]
> Azure Sentinel is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

You can connect Azure Sentinel to any F5 appliance by saving the log files as Syslog CEF. The integration with Azure Sentinel enables you to easily run analytics and queries across the log file data from F5. For more information on how Azure Sentinel ingests CEF data, see [Connect CEF appliances](connect-common-event-format.md).

> [!NOTE]
> Data will be stored in the geographic location of the workspace on which you are running Azure Sentinel.

## Step 1: Connect your F5 appliance using an agent

To connect your F5 appliance to Azure Sentinel, you need to deploy an agent on a dedicated machine (VM or on premises) to support the communication between the appliance and Azure Sentinel.

Alternatively, you can deploy the agent manually on an existing Azure VM, on a VM in another cloud, or on an on-premises machine.

> [!NOTE]
> Make sure to configure the machine's security according to your organization's security policy. For example, you can configure your network to align with your corporate network security policy and change the ports and protocols in the daemon to align with your requirements. 

To see a network diagram of both options, see [Connect data sources](connect-data-sources.md#agent-options).

### Deploy the agent 

1. In the Azure Sentinel portal, click **Data connectors** and select **F5** and then **Open connector page**. 

1. Under **Download and install the Syslog agent**, select your machine type, either Azure or on-premises. 
1. In the **Virtual machines** screen that opens, select the machine you want to use and click **Connect**.
1. If you choose **Download and install agent for Azure Linux virtual machines**, select the machine and click **Connect**. If you chose **Download and install agent for non-Azure Linux virtual machines**, in the **Direct Agent** screen, run the script under **Download and onboard agent for Linux**.
1. In the connector screen, under **Configure and forward Syslog**, set whether your Syslog daemon is **rsyslog.d** or **syslog-ng**. 
1. Copy these commands and run them on your appliance:
    - If you selected rsyslog.d:
              
      1. Tell the Syslog daemon to listen on facility local_4 and to send the Syslog messages to the Azure Sentinel agent using port 25226. `sudo bash -c "printf 'local4.debug  @127.0.0.1:25226' > /etc/rsyslog.d/security-config-omsagent.conf"`
            
      2. Download and install the [security_events config file](https://aka.ms/asi-syslog-config-file-linux) that configures the Syslog agent to listen on port 25226. `sudo wget -O /etc/opt/microsoft/omsagent/{0}/conf/omsagent.d/security_events.conf "https://aka.ms/syslog-config-file-linux"` Where {0} should be replaced with your workspace GUID.
            
      1. Restart the syslog daemon `sudo service rsyslog restart`
             
    - If you selected syslog-ng:

      1. Tell the Syslog daemon to listen on facility local_4 and to send the Syslog messages to the Azure Sentinel agent using port 25226. `sudo bash -c "printf 'filter f_local4_oms { facility(local4); };\n  destination security_oms { tcp(\"127.0.0.1\" port(25226)); };\n  log { source(src); filter(f_local4_oms); destination(security_oms); };' > /etc/syslog-ng/security-config-omsagent.conf"`
      2. Download and install the [security_events config file](https://aka.ms/asi-syslog-config-file-linux) that configures the Syslog agent to listen on port 25226. `sudo wget -O /etc/opt/microsoft/omsagent/{0}/conf/omsagent.d/security_events.conf "https://aka.ms/syslog-config-file-linux"` Where {0} should be replaced with your workspace GUID.

      3. Restart the syslog daemon `sudo service syslog-ng restart`
 1. Restart the Syslog agent using this command: `sudo /opt/microsoft/omsagent/bin/service_control restart [{workspace GUID}]`
 1. Confirm that there are no errors in the agent log by running this command: `tail /var/opt/microsoft/omsagent/log/omsagent.log`


## Step 2: Forward F5 logs to the Syslog agent

Configure F5 to forward Syslog messages in CEF format to your Azure workspace via the Syslog agent:

Go to F5 [Configuring Application Security Event Logging](https://aka.ms/asi-syslog-f5-forwarding), and follow the instructions to set up remote logging, using the following guidelines:
  - Set the **Remote storage type** to **CEF**.
  - Set the **Protocol** to **UDP**.
  - Set the **IP address** to the Syslog server IP address.
  - Set the **port number** to **514**, or the port you set your agent to use.
  - Set the **facility** to the one that you set in the Syslog agent (by default, the agent sets this to **local4**).
  - You can set the **Maximum Query String Size** to the size you set in your agent.

## Step 3: Validate connectivity

It may take upwards of 20 minutes until your logs start to appear in Log Analytics. 

1. Make sure you use the right facility. The facility must be the same in your appliance and in Azure Sentinel. You can check which facility file you're using in Azure Sentinel and modify it in the file `security-config-omsagent.conf`. 

2. Make sure that your logs are getting to the right port in the Syslog agent. Run this command on the Syslog agent machine: `tcpdump -A -ni any  port 514 -vv` This command shows you the logs that streams from the device to the Syslog machine. Make sure that logs are being received from the source appliance on the right port and right facility.

3. Make sure that the logs you send comply with [RFC 3164](https://tools.ietf.org/html/rfc3164).

4. On the computer running the Syslog agent, make sure these ports 514, 25226 are open and listening, using the command `netstat -a -n:`. For more information about using this command, see [netstat(8) - Linux man page](https://linux.die.net/man/8/netstat). If it’s listening properly, you’ll see this:

   ![Azure Sentinel ports](./media/connect-cef/ports.png) 

5. Make sure the daemon is set to listen on port 514, on which you’re sending the logs.
    - For rsyslog:<br>Make sure that the file `/etc/rsyslog.conf` includes this configuration:

           # provides UDP syslog reception
           module(load="imudp")
           input(type="imudp" port="514")
        
           # provides TCP syslog reception
           module(load="imtcp")
           input(type="imtcp" port="514")

      For more information, see [imudp: UDP Syslog Input Module](https://www.rsyslog.com/doc/v8-stable/configuration/modules/imudp.html#imudp-udp-syslog-input-module) and [imtcp: TCP Syslog Input Module](https://www.rsyslog.com/doc/v8-stable/configuration/modules/imtcp.html#imtcp-tcp-syslog-input-module)

   - For syslog-ng:<br>Make sure that the file `/etc/syslog-ng/syslog-ng.conf` includes this configuration:

           # source s_network {
            network( transport(UDP) port(514));
             };
     For more information, see [syslog-ng Open Source Edition 3.16 - Administration Guide](https://www.syslog-ng.com/technical-documents/doc/syslog-ng-open-source-edition/3.16/administration-guide/19#TOPIC-956455).

1. Check that there is communication between the Syslog daemon and the agent. Run this command on the Syslog agent machine: `tcpdump -A -ni any  port 25226 -vv` This command shows you the logs that streams from the device to the Syslog machine. Make sure that the logs are also being received on the agent.

6. If both of those commands provided successful results, check Log Analytics to see if your logs are arriving. All events streamed from these appliances appear in raw form in Log Analytics under `CommonSecurityLog` type.

7. To check if there are errors or if the logs aren't arriving, look in `tail /var/opt/microsoft/omsagent/<workspace id>/log/omsagent.log`. If it says there are log format mismatch errors, go to `/etc/opt/microsoft/omsagent/{0}/conf/omsagent.d/security_events.conf "https://aka.ms/syslog-config-file-linux"` and look at the file `security_events.conf`and make sure that your logs match the regex format you see in this file.

8. Make sure that your Syslog message default size is limited to 2048 bytes (2 KB). If logs are too long, update the security_events.conf using this command: `message_length_limit 4096`



## Next steps
In this document, you learned how to connect F5 appliances to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats.md).

