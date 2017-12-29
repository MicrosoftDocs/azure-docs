---
title: Azure Security Center Quick Start - Connect Security Solutions | Microsoft Docs
description: Azure Security Center Quick Start - Connect Security Solutions
services: security-center
documentationcenter: na
author: YuriDio
manager: mbaldwin
editor: ''

ms.assetid: 3263bb3d-befc-428c-9f80-53de65761697
ms.service: security-center
ms.devlang: na
ms.topic: hero-article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/28/2017
ms.author: yurid
ms.custom: mvc
---

# Quickstart: Connect Security Solutions to Security Center

In addition to collecting security data from your computers, you can integrate security data from a variety of other security solutions, including any that support Common Event Format (CEF). Common Event Format (CEF) is an industry standard format on top of Syslog messages, used by many security vendors to allow event interoperability among different platforms. By connecting your CEF logs to Security Center, you can take advantage of Search & Correlation, Alerting and Threat Intelligence enrichment for each log.

This quickstart shows you how to:
- Connect a security solution to Security Center using Common Event Format Logs (CEF)
- Validate the connection with the security solution

## Prerequisites
To get started with Security Center, you must have a subscription to Microsoft Azure. If you do not have a subscription, you can sign up for a [free account](https://azure.microsoft.com/free/).

To step through this quickstart, you must be on Security Center’s Standard pricing tier. You can try Security Center Standard at no cost for the first 60 days   The Quickstart: Onboard your Azure subscription to Security Center Standard walks you through how to upgrade to Standard.

You also need a [Linux machine](https://docs.microsoft.com/azure/log-analytics/log-analytics-agent-linux), with Syslog service that is already connected to your Security Center.


## Connect a Security Solution using Common Event Format

1. Sign into the Azure portal.
2. On the **Microsoft Azure** menu, select **Security Center**.

	![Select security center](./media/quick-security-solutions/quick-security-solutions-fig1.png)  

3. In the left navigation pane, click **Security Solutions**.
4. In the Security Solutions page, under **Add data sources (3)**, click **Add** under **Common Event Format**.

	![Add data source](./media/quick-security-solutions/quick-security-solutions-fig2.png)

5. In the Common Event Format Logs page, expand the second step, **Configure Syslog forwarding to send the required logs to the agent on UDP port 25226**, and follow the instructions below in your Linux computer:

	![Configure syslog](./media/quick-security-solutions/quick-security-solutions-fig3.png)

6. Expand the third step, **Place the agent configuration file on the agent computer**, and follow the instructions below in your Linux computer:

	![Agent configuration](./media/quick-security-solutions/quick-security-solutions-fig4.png)

7. Expand the fourth step, **Restart the syslog daemon and the agent**, and follow the instructions below in your Linux computer:

	![Restart the syslog](./media/quick-security-solutions/quick-security-solutions-fig5.png)


## Validate the connection with the security solution

Before you proceed to the steps below, you will need to wait until the syslog starts reporting to Security Center. This can take some time, and it will vary according to the size of the environment.

1.	In the left pane, of the Security Center dashboard, click **Search**.
2.	Select the workspace that the Syslog (Linux Machine) is connected to.
3.	Type *CommonSecurityLog* and click the **Search** button.


## Next steps
In this quick start, you learned how to connect a Linux Syslog solution to Security Center. To learn more about how to use Security Center, continue to the tutorial for configuring a security policy and assessing the security of your resources.

> [!div class="nextstepaction"]
> [Tutorial: Define and assess security policies](./tutorial-security-policy.md)
