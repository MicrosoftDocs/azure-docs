---
title: Collecting data in Azure Security Insights | Microsoft Docs
description: Learn how to collect data in Azure Security Insights.
services: security-insights
documentationcenter: na
author: rkarlin
manager: MBaldwin
editor: ''

ms.assetid: c3df8afb-90d7-459c-a188-c55ba99e7b92
ms.service: security-insights
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/30/2018
ms.author: rkarlin

---
# Connect your third-party appliance to Security Insights (CEF)

You can connect Security Insights with any following third-party appliance that enables you to save log files in Syslog. If your appliance enables you to save logs as Syslog CEF, the integration with Security Insights is even tighter. The following appliances have CEF connectors that are customized to work with Security Insights:

- Cisco ASA
- Barracuda (no need for CEF agent)
- Palo Alto 
- Check Point
- Generic appliance supporting CEF
- F5


All events streamed from these appliances appear in raw form in Log Analytics under `CommonSecurityLog ` type.

>[!NOTE]
> - If you use Cisco ASA, it is not necessary to use CEF, because it has been natively integrated with Security Insights.
> - Data will be stored in the geographic location of the workspace on which you are running Security Insights.
> - Security Insights takes advantage of the native integration between **Barracuda** and Microsoft Azure OMS. To connect to a Barracuda appliance there is no need to install an agent. This connection is performed in a single click after you select the Barracuda tile in the Data collection gallery.



To connect an appliance that supports CEF to Security Insights:
[include diagram from Mor of how it all connects]

1. Install the Security Insights agent on your appliance. You can install it automatically or manually.
   1. Automatically: Select **Automatic**.
   2.  In the template that opens, click **Purchase**.

    >[!NOTE]
    > This sets the IP address to public and the facility to local4.

   1. Manually: Select **Manual**. 
   2. Choose whether you want to create the agent on a Linux server in Azure or on a non-Azure Linux server. 
       - If you choose Azure, select the server.
       - If you choose non-Azure, download the agent and then install it on your server. 

    3. Install the agent on your Linux server. 
    4. Click **Data collection**. In the connect page, under **Configure Syslog appliance**, make sure to set these settings to match the settings in the configuration file on the server on which you installed the agent:
        - daemon: select either rsyslog or syslog-ng
        - ports 
        - facility:

    5. Copy the agent config file onto the Linux server you installed the agent on. <XXX Rachel - double check these steps carefully>

    6. Restart the Syslog daemon and the agent using the commands listed and make sure it runs successfully. 

    7. If your appliance is one of these, follow these additional steps:
        - Cisco - Run these commands:
            - Set “port” to 514 or your agent port​
            - Set “syslog_ip” to the IP address of the Syslog agent ​
            - Set “logging facility” to be the same as in the Syslog agent (by default, the agent sets this to 4)​
        - Checkpoint - copy the text from slide 23
            - If you use version R77.30 or R80.10, follow the instructions to install a Log Exporter.​
            - Set the Syslog port to 514 or your agent port​.
            - Replace the “name” and “<target-server IP address>” in the CLI with the Syslog agent name and IP address​.
            - Set the format to CEF​.
            - Set the facility number to be the same as in the Syslog agent (by default, the agent sets this to 4)​.
            - Palo Alto
                - Make sure that the facility number same as in the Syslog agent​
                - The copy/paste operations from the PDF might change the text and insert random characters. To avoid this, copy the text to an editor and remove any characters that might break the log format before pasting it, as you can see in this example.
            ![CEF text copy problem](./media/security-insights-connect-cef/paloalto-text-prob1.png)

2. After your connection is up and running, It takes about 20 minutes for the connection to start working. After this much time has passed, perform connection validation:
        1. In the Syslog agent, check what is arriving on port 514 and make sure you are seeing events using this command: `tcpdump -n udp dst port 514 -vv`
        2. Check that the Syslog messages are being saved the Syslog file: /var/log/syslog






## Next steps
In this document, you learned how to connect Azure AD Identity Protection to Security Center. To learn more about Security Center, see the following articles:

