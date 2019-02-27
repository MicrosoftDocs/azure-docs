---
title: Connect data sources to Azure Sentinel Preview?| Microsoft Docs
description: Learn how to connect data sources to Azure Sentinel.
services: sentinel
documentationcenter: na
author: rkarlin
manager: MBaldwin
editor: ''

ms.assetid: a3b63cfa-b5fe-4aff-b105-b22b424c418a
ms.service: sentinel
ms.devlang: na
ms.topic: overview
ms.custom: mvc
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 2/28/2019
ms.author: rkarlin

---
# Connect data sources

> [!IMPORTANT]
> Azure Sentinel is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).



To on-board Azure Sentinel, you first need to connect to your security sources. Azure Sentinel comes with a number of connectors for Microsoft solutions, available out of the box and providing real-time integration, including Microsoft Threat Protection solutions, and Microsoft 365 sources, including Office 365, Azure AD, Azure ATP, and Microsoft Cloud App Security, and more. In addition, there are built-in connectors to the broader security ecosystem for non-Microsoft solutions. You can also use common event format, Syslog or REST-API to connect your data sources with Azure Sentinel as well.  

![Tiles](./media/overview/connections.png)


## Data collection methods

The following data collection methods are supported by Azure Sentinel:

- Azure Sentinel can be connected to certain data sources using an agent installed either directly on the monitored data source or on a dedicated server. The agent was designed to ensure a small footprint and performs some basic data compression. The data volume sent varies based on the data source and logs selected. 

- Some data sources are connected using APIs that are provided by the connected data source. Typically, most security technologies provide a set of APIs through which event logs can be retrieved. These logs are then sent to Azure Log Analytics. The APIs connected to Azure Sentinel gather specific data types and consume data from Microsoft services from a dedicated event hub via a Scuba router.

- Real-time Syslog stream collection is a mainstay of most SIEM deployments. Syslog is a way for devices to send event messages to a logging server – usually known as a Syslog server. The Syslog protocol is supported by a wide range of devices and can be used to log different types of events. Syslog messages usually include information to help identify basic information about where, when, and why the log was sent: IP address, timestamp, and the actual log message. Messages are sometimes in a descriptive, human-readable format – but not always. Most of the industry has adopted the CEF standard for Syslog messages. So Azure Sentinel has extensive integration for CEF logs. Data sources that use Syslog, such as busy firewalls, produce thousands, or even tens of thousands of messages per second per each device. Because of this, the ASI Syslog collectors handle high-volume log sources. <br> Syslog collection is accomplished using the OMS agent for Linux. By default, the OMS Agent for Linux receives events from the Syslog daemon over UDP, but in cases where a Linux machine is expected to collect a high volume of Syslog events, such as when a Linux agent is receiving events from other devices, the configuration is modified to use TCP transport between the Syslog daemon and OMS agent.

## Supported data sources

- **Effortless data collection from services in the Microsoft ecosystem, including native service-to-service integration of all Microsoft solutions and their raw data:**
    - [Azure Information Protection](connect-azure-information-protection.md)
    - [Azure Security Center](connect-azure-security-center.md)
    - [Azure Advanced Threat Protection](connect-azure-atp.md)
    - [Cloud App Security](connect-cloud-app-security.md)
    - [Office 365](connect-office-365.md)
    - [Azure AD audit logs and sign-ins](connect-azure-active-directory.md)
    - [Azure Activity](connect-azure-activity.md)
    - [Azure AD Identity Protection](connect-azure-ad-Identity-protection.md)

- **Integration with other clouds**:
    - [AWS](connect-aws.md)

- **Integration with cloud and on-prem data from**:
    - Windows Servers 
    - Linux servers
    - Windows Event Forwarding
    - [DNS logs](connect-dns.md)
    - Servers and endpoints

- **Integration with any solution supporting Syslog, CEF, and REST API**
    - Firewalls
    - Proxy servers
    - DLP solutions



## Next steps

- To get started with Azure Sentinel, you need a subscription to Microsoft Azure. If you do not have a subscription, you can sign up for a [free trial](https://azure.microsoft.com/free/).
- Learn how to [onboard your data to Azure Sentinel](quickstart-onboard.md), and [get visibility into your data, and potential threats](quickstart-get-visibility.md).
