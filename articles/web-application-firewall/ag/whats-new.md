---
title: What's new in Azure Web Application Firewall
description: Learn what's new with Azure Web Application Firewall, such as the latest release notes, known issues, bug fixes, deprecated functionality, and upcoming changes.
services: web-application-firewall
author: vhorne
ms.service: web-application-firewall
ms.topic: overview
ms.date: 10/24/2019
ms.author: victorh

---
# What's new in Azure Web Application Firewall?

Azure Web Application Firewall is updated on an ongoing basis. To stay up-to-date with the most recent developments, this article provides you with information about:

- The latest releases
- Known issues
- Bug fixes
- Deprecated functionality

## New features

|Feature  |Description  |Date added  |
|---------|---------|---------|
|Bot Mitigation Ruleset (preview)|You can enable a Bot Mitigation ruleset, alongside the CRS ruleset you choose. | November 2019 |
|GeoDB Integration (preview)|Now you can create custom rules restricting traffic by country/region of origin. | November 2019 |
|WAF per-site/per-URI policy (preview)|WAF-v2 now supports applying a policy to listeners, as well as path-based rules. See [Create WAF Policy](create-waf-policy-ag.md). | November 2019 |
|WAF custom rules |Application Gateway WAF_v2 now supports creating custom rules. See [Application Gateway custom rules](custom-waf-rules-overview.md). |June 2019 |
|WAF configuration and exclusion list     |We've added more options to help you configure your WAF and reduce false positives. See [Web application firewall request size limits and exclusion lists](application-gateway-waf-configuration.md) for more information.|December 2018|

## Next steps

For more information about Web Application Firewall on Application Gateway, see [Azure Web Application Firewall on Azure Application Gateway](ag-overview.md).
