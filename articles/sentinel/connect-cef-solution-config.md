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

- [Check Point](connect-checkpoint.md)
- [Cisco](connect-cisco.md)
- [ExtraHop Reveal(x)](connect-extrahop.md)
- [F5 ](connect-f5.md)  
- [Fortinet](connect-fortinet.md)
- [One Identity Safeguard](connect-one-identity.md)
- [Palo Alto Networks](connect-paloalto.md)
- [Trend Micro Deep Security](connect-trend-micro.md)
- [Zscaler](connect-zscaler.md)   

## Configure any other solution
If a connector does not exist for your specific security solution, use the following generic instructions for forwarding logs to the CEF agent.

1. Go to the specific configuration article for steps on how to configure your solution to send CEF messages. If your solution is not listed, on the appliance you need to set these values so that the appliance sends the necessary logs in the necessary format to the Azure Sentinel Syslog agent, based on the Log Analytics agent. You can modify these parameters in your appliance, as long as you also modify them in the Syslog daemon on the Azure Sentinel agent.
    - Protocol = TCP
    - Port = 514
    - Format = CEF
    - IP address - make sure to send the CEF messages to the IP address of the virtual machine you dedicated for this purpose.

   > [!NOTE]
   > This solution supports Syslog RFC 3164 or RFC 5424.


1. To use the relevant schema in Log Analytics for the CEF events, search for `CommonSecurityLog`.

1. Continue to STEP 3: [validate connectivity](connect-cef-verify.md).

## Next steps
In this document, you learned how to connect CEF appliances to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats.md).

