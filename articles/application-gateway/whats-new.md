---
title: What's new in Azure Application Gateway
description: Learn what's new with Azure Application Gateway, such as the latest release notes, known issues, bug fixes, deprecated functionality, and upcoming changes.
services: application-gateway
author: vhorne
ms.service: application-gateway
ms.topic: overview
ms.date: 4/30/2019
ms.author: victorh

---
# What's new in Azure Application Gateway?

Azure Application Gateway is updated on an ongoing basis. To stay up-to-date with the most recent developments, this article provides you with information about:

- The latest releases
- Known issues
- Bug fixes
- Deprecated functionality

## New features

|Feature  |Description  |Date added  |
|---------|---------|---------|
|WAF custom rules |Applicaiton Gateway WAF_v2 now supports creating custom rules. See [Application Gateway custom rules](custom-waf-rules-overview.md). |June 2019 |
|Autoscaling, zone redundancy, static VIP support GA |General availability for v2 SKU which supports autoscaling, zone redundancy, enhance performance, static VIPs, Key Vault, Header rewrite. See [Application Gateway autoscaling documentation](application-gateway-autoscaling-zone-redundant.md). |April 2019 |
|Key Vault integration |Application Gateway now supports integration with Key Vault (in public preview) for server certificates that are attached to HTTPS enabled listeners. See [SSL termination with Key Vault certificates](key-vault-certs.md). |April 2019 |
|Header CRUD/Rewrites     |You can now rewrite HTTP headers. See [Tutorial: Create an application gateway and rewrite HTTP headers](tutorial-http-header-rewrite-powershell.md) for more information.|December 2018|
|WAF configuration and exclusion list     |We’ve added more options to help you configure your WAF and reduce false positives. See [Web application firewall request size limits and exclusion lists](application-gateway-waf-configuration.md) for more information.|December 2018|
|Autoscaling, zone redundancy, static VIP support      |With the v2 SKU, there are many improvements such as Autoscaling, improved performance, and more. See [What is Azure Application Gateway?](overview.md) for more information.|September 2018|
|Connection draining     |Connection draining allows you to gracefully remove members from your backend pools. For more information, see [Connection draining](overview.md#connection-draining).|September 2018|
|Custom error pages     |With custom error pages, you can create an error page within the format of the rest of your websites. To enable this, see [Create Application Gateway custom error pages](custom-error.md).|September 2018|
|Metrics Enhancements     |You can get a better view of the state of your Application Gateway with enhanced metrics. To enable metrics on your Application Gateway, see [Back-end health, diagnostic logs, and metrics for Application Gateway](application-gateway-diagnostics.md).|June 2018|

## Next steps

For more information about Azure Application Gateway, see [What is Azure Application Gateway?](overview.md)
