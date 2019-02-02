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
# Connect your third-party appliance to Security Insights (Syslog)

You can connect any third-party appliance that supports Syslog to Security Insights. If the appliance supports Syslog CEF, the connection is more complete and you should choose this option and follow the instructions in [Collecting data from CEF](security-insights-connect-cef.md). If you want to connect to an appliance that doesn't support CEF, you can do so by installing the Azure OMS agent on your appliance.


Syslog collection is accomplished using an agent for Linux. By default, the agent for Linux receives events from the Syslog daemon over UDP, but in cases where a Linux machine is expected to collect a high volume of Syslog events, such as when a Linux agent is receiving events from other devices, the configuration is modified to use TCP transport between the Syslog daemon and the agent.


1. In the Security Insights portal select **Data collection** and choose the **Syslog** tile.
2. Download and install the Security Insights agent on your appliance. You can install it automatically or manually.
   1. Automatically: Select **Automatic**.
   2.  In the template that opens, click **Purchase**.

    >[!NOTE]
    > This sets the IP address to public and the facility to local4.

   1. Manually: Select **Manual**. 
   2. Choose whether you want to create the agent on a Linux server in Azure or on a non-Azure Linux server. 
       - If you choose Azure, select the server.
       - If you choose non-Azure, download the agent and then install it on your server. 

    3. Install the agent on your Linux server. 
3. Click **Open configuration blade** to set up the connection. 
4. Select **Data** and then **Syslog**.
   - Select a facility that you're going to monitor, and set a severity for it.
3. In your Syslog machine, make sure you're sending that facility. 





## Next steps
In this document, you learned how to connect Azure AD Identity Protection to Security Center. To learn more about Security Center, see the following articles:

