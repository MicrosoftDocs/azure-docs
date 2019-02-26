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


# Supported data sources

- **Effortless data collection from services in the Microsoft ecosystem, including native service-to-service integration of all Microsoft solutions and their raw data:**
    - Azure Information Protection
    - Azure Security Center
    - Azure Advanced Threat Protection
    - Cloud App Security
    - Office 365 
    - Azure AD audit logs and sign-ins
    - Azure Activity
    - Azure AD Identity Protection

- **Integration with other clouds**:
    - AWS

- **Integration with cloud and on-prem data from**:
    - Windows Servers 
    - Linux servers
    - Windows Event Forwarding
    - DNS logs
    - Servers and endpoints

-**Integration with any solution supporting Syslog, CEF, and REST API**
    - Firewalls
    - Proxy servers
    - DLP solutions



## Next steps

- To get started with Azure Sentinel, you need a subscription to Microsoft Azure. If you do not have a subscription, you can sign up for a [free trial](https://azure.microsoft.com/free/).
- Learn how to [onboard your data to Azure Sentinel](quickstart-onboard.md), and [get visibility into your data, and potential threats](quickstart-get-visibility.md).
