---
title: Connect data sources to Azure Sentinel Preview?| Microsoft Docs
description: Learn how to connect data sources to Azure Sentinel.
services: sentinel
documentationcenter: na
author: rkarlin
manager: rkarlin
editor: ''

ms.assetid: a3b63cfa-b5fe-4aff-b105-b22b424c418a
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: overview
ms.custom: mvc
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 07/04/2019
ms.author: rkarlin

---
# Connect data sources

> [!IMPORTANT]
> Azure Sentinel is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).



To on-board Azure Sentinel, you first need to connect to your data sources. Azure Sentinel comes with a number of connectors for Microsoft solutions, available out of the box and providing real-time integration, including Microsoft Threat Protection solutions, and Microsoft 365 sources, including Office 365, Azure AD, Azure ATP, and Microsoft Cloud App Security, and more. In addition, there are built-in connectors to the broader security ecosystem for non-Microsoft solutions. You can also use common event format, Syslog or REST-API to connect your data sources with Azure Sentinel as well.  

1. On the menu, select **Data connectors**. This page lets you see the full list of connectors that Azure Sentinel provides and their status. Select the connector you want to connect and select **Open connector page**. 

   ![Data collectors](./media/collect-data/collect-data-page.png)

1. On the specific connector page, make sure you have fulfilled all the prerequisites and follow the instructions to connect the data to Azure Sentinel. It may take some time for the logs to start syncing with Azure Sentinel. After you connect, you see a summary of the data in the **Data received** graph, and connectivity status of the data types.

   ![Connect collectors](./media/collect-data/opened-connector-page.png)
  
1. Click the **Next steps** tab to get a list of out-of-the-box content Azure Sentinel provides for the specific data type.

   ![Data collectors](./media/collect-data/data-insights.png)
 

## Data connection methods

The following data connection methods are supported by Azure Sentinel:

- **Microsoft services**:<br> Microsoft services are connected natively, leveraging the Azure foundation for out-of-the box integration, the following solutions can be connected in a few clicks:
    - [Office 365](connect-office-365.md)
    - [Azure AD audit logs and sign-ins](connect-azure-active-directory.md)
    - [Azure Activity](connect-azure-activity.md)
    - [Azure AD Identity Protection](connect-azure-ad-Identity-protection.md)
    - [Azure Security Center](connect-azure-security-center.md)
    - [Azure Information Protection](connect-azure-information-protection.md)
    - [Azure Advanced Threat Protection](connect-azure-atp.md)
    - [Cloud App Security](connect-cloud-app-security.md)
    - [Windows security events](connect-windows-security-events.md) 
    - [Windows firewall](connect-windows-firewall.md)

- **External solutions via API**: Some data sources are connected using APIs that are provided by the connected data source. Typically, most security technologies provide a set of APIs through which event logs can be retrieved.The APIs connect to Azure Sentinel and gather specific data types and send them to Azure Log Analytics. Appliances connected via API include:
    - [Barracuda](connect-barracuda.md)
    - [Symantec](connect-symantec.md)
- **External solutions via agent**: Azure Sentinel can be connected to all other data sources that can perform real-time log streaming using the Syslog protocol, via an agent. <br>Most appliances use the Syslog protocol to send event messages that include the log itself and data about the log. The format of the logs varies, but most appliances support the Common Event Format (CEF) standard. <br>The Azure Sentinel agent, which is based on the Microsoft Monitoring Agent, converts CEF formatted logs into a format that can be ingested by Log Analytics. Depending on the appliance type, the agent is installed either directly on the appliance, or on a dedicated Linux server. The agent for Linux receives events from the Syslog daemon over UDP, but in cases where a Linux machine is expected to collect a high volume of Syslog events, they are sent over TCP from the Syslog daemon to the agent and from there to Log Analytics.
    - Firewalls, proxies, and endpoints:
        - [F5](connect-f5.md)
        - [Check Point](connect-checkpoint.md)
        - [Cisco ASA](connect-cisco.md)
        - [Fortinet](connect-fortinet.md)
        - [Palo Alto](connect-paloalto.md)
        - [Other CEF appliances](connect-common-event-format.md)
        - [Other Syslog appliances](connect-syslog.md)
    - DLP solutions
    - [Threat intelligence providers](connect-threat-intelligence.md)
    - [DNS machines](connect-dns.md) - agent installed directly on the DNS machine
    - Linux servers
    - Other clouds
    
## Agent connection options<a name="agent-options"></a>

To connect your external appliance to Azure Sentinel, the agent must be deployed on a dedicated machine (VM or on premises) to support the communication between the appliance and Azure Sentinel. You can deploy the agent automatically or manually. Automatic deployment is only available if your dedicated machine is a new VM you are creating in Azure. 


![CEF in Azure](./media/connect-cef/cef-syslog-azure.png)

Alternatively, you can deploy the agent manually on an existing Azure VM, on a VM in another cloud, or on an on-premises machine.

![CEF on premises](./media/connect-cef/cef-syslog-onprem.png)


## Next steps

- To get started with Azure Sentinel, you need a subscription to Microsoft Azure. If you do not have a subscription, you can sign up for a [free trial](https://azure.microsoft.com/free/).
- Learn how to [onboard your data to Azure Sentinel](quickstart-onboard.md), and [get visibility into your data, and potential threats](quickstart-get-visibility.md).
