---
title: Configure your security solution to connect CEF data to Azure Sentinel Preview| Microsoft Docs
description: Learn how to configure your security solution to connect CEF data to Azure Sentinel.
services: sentinel
documentationcenter: na
author: yelevin
manager: rkarlin
editor: ''

ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/30/2019
ms.author: yelevin

---
# STEP 2: Configure your security solution to send CEF messages

In this step you will perform the necessary configuration changes on your security solution itself to send logs to the CEF agent.

## Configure a solution with a connector

If your security solution already has an existing connector, use the connector-specific instructions as follows:

- [AI Vectra Detect](connect-ai-vectra-detect.md)
- [Akamai Security Events](connect-akamai-security-events.md)
- [Aruba ClearPass](connect-aruba-clearpass.md)
- [Broadcom Symantec DLP](connect-broadcom-symantec-dlp.md)
- [Check Point](connect-checkpoint.md)
- [Cisco ASA](connect-cisco.md)
- [Citrix WAF](connect-citrix-waf.md)
- [CyberArk Enterprise Password Vault](connect-cyberark.md)
- [ExtraHop Reveal(x)](connect-extrahop.md)
- [F5 ASM](connect-f5.md)
- [Forcepoint products](connect-forcepoint-casb-ngfw.md)
- [Fortinet](connect-fortinet.md)
- [Illusive Networks AMS](connect-illusive-attack-management-system.md)
- [Imperva WAF Gateway](connect-imperva-waf-gateway.md)
- [One Identity Safeguard](connect-one-identity.md)
- [Palo Alto Networks](connect-paloalto.md)
- [Thycotic Secret Server](connect-thycotic-secret-server.md)
- [Trend Micro Deep Security](connect-trend-micro.md)
- [Trend Micro TippingPoint](connect-trend-micro-tippingpoint.md)
- [WireX Network Forensics Platform](connect-wirex-systems.md)
- [Zscaler](connect-zscaler.md)
## Configure any other solution

If a connector does not exist for your specific security solution, use the following generic instructions for forwarding logs to the CEF agent.

1. Go to the specific configuration article for steps on how to configure your solution to send CEF messages. If your solution is not listed, on the appliance you need to set these values so that the appliance sends the necessary logs in the necessary format to the Azure Sentinel Syslog agent, based on the Log Analytics agent. You can modify these parameters in your appliance, as long as you also modify them in the Syslog daemon on the Azure Sentinel agent.
    - Protocol = TCP
    - Port = 514
    - Format = CEF
    - IP address - make sure to send the CEF messages to the IP address of the virtual machine you dedicated for this purpose.

   This solution supports Syslog RFC 3164 or RFC 5424.

1. To search for CEF events in Log Analytics, enter `CommonSecurityLog` in the query window.

1. Continue to STEP 3: [validate connectivity](connect-cef-verify.md).

> [!NOTE]
> **Changing the source of the TimeGenerated field**
>
> - By default, the Log Analytics agent populates the *TimeGenerated* field in the schema with the time the agent received the event from the Syslog daemon. As a result, the time at which the event was generated on the source system is not recorded in Azure Sentinel.
>
> - You can, however, run the following command, which will download and run the `TimeGenerated.py` script. This script configures the Log Analytics agent to populate the *TimeGenerated* field with the event's original time on its source system, instead of the time it was received by the agent.
>
>    ```bash
>    wget -O TimeGenerated.py https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/CEF/TimeGenerated.py && python TimeGenerated.py {ws_id}
>    ```

## Next steps

In this document, you learned how to connect CEF appliances to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](./tutorial-detect-threats-built-in.md).