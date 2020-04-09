---
title: Configure bot protection for Web Application Firewall with Azure Front Door (Preview)
description: Learn Web Application Firewall (WAF).
author: vhorne
ms.service: web-application-firewall
ms.topic: article
services: web-application-firewall
ms.date: 08/21/2019
ms.author: victorh
---

# Configure bot protection for Web Application Firewall (Preview)
This article shows you how to configure bot protection rule in Azure Web Application Firewall (WAF) for Front Door by using Azure portal. Bot protection rule can also be configured using CLI, Azure PowerShell, or Azure Resource Manager template.

> [!IMPORTANT]
> Bot protection rule set is currently in public preview and is provided with a preview service level agreement. Certain features may not be supported or may have constrained capabilities.  See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for details.

## Prerequisites

Create a basic WAF policy for Front Door by following the instructions described in [Create a WAF policy for Azure Front Door by using the Azure portal](waf-front-door-create-portal.md).

## Enable bot protection rule set

In the **Managed Rules** page when creating a Web Application Firewall policy, first find **Managed rule set** section, select the check box in front of the rule **Microsoft_BotManager_1.0** from the drop-down menu, and then select **Review + Create**.

   ![Bot protection rule](.././media/waf-front-door-configure-bot-protection/botmanager112019.png)

## Next steps

- Learn how to [monitor WAF](waf-front-door-monitor.md).
