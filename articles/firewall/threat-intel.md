---
title: Azure Firewall threat intelligence based filtering
description: Learn about Azure Firewall threat intelligence filtering
services: firewall
author: vhorne
ms.service: firewall
ms.topic: article
ms.date: 1/23/2019
ms.author: victorh
---

# Azure Firewall threat intelligence-based filtering - Public Preview

Threat intelligence-based filtering can be enabled for your firewall to alert and block traffic to or from known malicious IP addresses and domains. The Microsoft Threat Intelligence feed is based on numerous internal and external data sources and is constantly updated. During the public preview, only high confidence indicators are provided.

> [!IMPORTANT]
> Threat intelligence-based filtering is currently in public preview. This preview is provided without a service level agreement and is not recommended for production workloads. Certain features may not be supported or may have constrained capabilities. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for details.

If threat intelligence-based filtering is enabled, the associated rules are processed before any of the NAT rules, network rules, or application rules.

You can choose to just log an alert when a rule is triggered, or alert and block.

[portal screenshot]

## Logs

The following log excerpt is an example showing triggered rules:

[log example]

## Next steps

- Learn how to [deploy and configure an Azure Firewall](tutorial-firewall-deploy-portal.md).