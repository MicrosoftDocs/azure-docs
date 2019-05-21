---
title: Collect Windows security event data in Azure Sentinel Preview| Microsoft Docs
description: Learn how to collect Windows security event data in Azure Sentinel.
services: sentinel
documentationcenter: na
author: rkarlin
manager: barbkess
editor: ''

ms.assetid: d51d2e09-a073-41c8-b396-91d60b057e6a
ms.service: sentinel
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 2/28/2019
ms.author: rkarlin

---
# Connect Windows security events 

> [!IMPORTANT]
> Azure Sentinel is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

You can stream all security events from the Windows Servers connected to your Azure Sentinel workspace. This connection enables you to view dashboards, create custom alerts, and improve investigation. This gives you more insight into your organization’s network and improves your security operation capabilities.  You can select which events to stream:

- **All events** - All Windows security and AppLocker events.
- **Common** - A standard set of events for auditing purposes.
- **Minimal** - A small set of events that might indicate potential threats. By enabling this option, you won't be able to have a full audit trail.
- **None** - No security or AppLocker events.

> [!NOTE]
> 
> - Data will be stored in the geographic location of the workspace on which you are running Azure Sentinel.

## Set up the Windows security events connector

To fully integrate your Windows security events with Azure Sentinel:

1. In the Azure Sentinel portal, select **Data collection** and then click on the **Windows security events** tile. 
1. Select which data types you want to stream.
1. Click **Update**.


## Validate connectivity

It may take around 20 minutes until your logs start to appear in Log Analytics. 



## Next steps
In this document, you learned how to connect Windows security events to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats.md).

