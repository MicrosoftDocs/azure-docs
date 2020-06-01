---
title: Azure CDN from Verizon Premium rules engine match conditions | Microsoft Docs
description: Reference documentation for Azure Content Delivery Network from Verizon Premium rules engine match conditions.
services: cdn
author: asudbring

ms.service: azure-cdn
ms.topic: article
ms.date: 05/26/2020
ms.author: allensu

---

# Azure CDN from Verizon Premium rules engine match conditions

This article lists detailed descriptions of the available match conditions for the Azure Content Delivery Network (CDN) from Verizon Premium [rules engine](cdn-verizon-premium-rules-engine.md).

The second part of a rule is the match condition. A match condition identifies specific types of requests for which a set of features will be performed.

For example, you can use a match condition to:

- Filter requests for content at a particular location.
- Filter requests generated from a particular IP address or country/region.
- Filter requests by header information.

## Match Conditions

* Always
* Device
* Location
* Origin
* Request
* URL

### <a name="always"></a>Always

[The Always match condition](https://docs.vdms.com/cdn/Content/HRE/M/Always.htm) is designed to apply a default set of features to all requests.

### <a name="device"></a>Device

These match conditions are designed to identify requests based on the client's user agent.

| Name       | Purpose                                                           |
|------------|-------------------------------------------------------------------|
| Brand Name | Identifies requests by whether the device's brand name matches a: <br> **-** Specific value ([Brand Name Literal](https://docs.vdms.com/cdn/Content/HRE/M/D-Brand-Name-Literal.htm)) <br> **-** Regular expression ([Brand Name Regex](https://docs.vdms.com/cdn/Content/HRE/M/D-Brand-Name-Regex.htm)) <br> **-** Specific pattern ([Brand Name Wildcard](https://docs.vdms.com/cdn/Content/HRE/M/D-Brand-Name-Wildcard.htm)) |
| Device OS | Identifies requests by whether the device's OS matches a: <br> **-** Specific value ([Device OS Literal](https://docs.vdms.com/cdn/Content/HRE/M/D-Device-OS-Literal.htm)) <br> **-** Regular expression ([Device OS Regex](https://docs.vdms.com/cdn/Content/HRE/M/D-Device-OS-Regex.htm)) <br> **-** Specific pattern ([Device OS Wildcard](https://docs.vdms.com/cdn/Content/HRE/M/D-Device-OS-Wildcard.htm)) |
| Device OS Version | Identifies requests by whether the device's OS version matches a: <br> **-** Specific value ([Device OS Version Literal](https://docs.vdms.com/cdn/Content/HRE/M/D-Device-OS-Version-Literal.htm)) <br> **-** Regular expression ([Device OS Version Regex](https://docs.vdms.com/cdn/Content/HRE/M/D-Device-OS-Version-Regex.htm)) <br> **-** Specific pattern ([Device OS Version Wildcard](https://docs.vdms.com/cdn/Content/HRE/M/D-Device-OS-Version-Wildcard.htm)) |
| [Dual Orientation?](https://docs.vdms.com/cdn/Content/HRE/M/D-Dual-Orientation.htm) | Identifies requests by whether the device supports dual orientation. |
| HTML Preferred DTD | Identifies requests by whether the device's HTML preferred DTD matches a: <br> **-** Specific value ([HTML Preferred DTD Literal](https://docs.vdms.com/cdn/Content/HRE/M/D-HTML-Preferred-DTD-Literal.htm)) <br> **-** Regular expression ([HTML Preferred DTD Regex](https://docs.vdms.com/cdn/Content/HRE/M/D-HTML-Preferred-DTD-Regex.htm)) <br> **-** Specific pattern ([HTML Preferred DTD Wildcard](https://docs.vdms.com/cdn/Content/HRE/M/D-HTML-Preferred-DTD-Wildcard.htm)) |
| [Image Inlining?](https://docs.vdms.com/cdn/Content/HRE/M/D-Image-Inlining.htm) | Identifies requests by whether the device supports Base64 encoded images. |
| [Is Android?](https://docs.vdms.com/cdn/Content/HRE/M/D-Is-Android.htm) | Identifies requests by whether the device uses the Android OS. |
| [Is App?](https://docs.vdms.com/cdn/Content/HRE/M/D-Is-App.htm) | Identifies requests by whether a native application requested content. |
| [Is Full Desktop?](https://docs.vdms.com/cdn/Content/HRE/M/D-Is-Full-Desktop.htm) | Identifies requests by whether the device provides a full desktop experience. |
| [Is iOS?](https://docs.vdms.com/cdn/Content/HRE/M/D-Is-iOS.htm) | Identifies requests by whether the device uses iOS. |
| [Is Robot?](https://docs.vdms.com/cdn/Content/HRE/M/D-Is-Robot.htm) | Identifies requests by whether the device is considered to be an automated HTTP client (e.g., a robot crawler). |
| 










### <a name="request"></a>Request

These match conditions are designed to identify requests based on their properties.

| Name              | Purpose                                                                |
|-------------------|------------------------------------------------------------------------|
| [Client IP Address](https://docs.vdms.com/cdn/Content/HRE/M/Client-IP-Address.htm) | Identifies requests that originate from a particular IP address.      |
| Cookie Parameter  | Identifies a request by whether it contains a cookie that matches a: <br> **-** Specific Value ([Cookie Parameter Literal](https://docs.vdms.com/cdn/Content/HRE/M/Cookie-Parameter-Literal.htm)) <br> **-** Regular expression ([Cookie Parameter Regex](https://docs.vdms.com/cdn/Content/HRE/M/Cookie-Parameter-Regex.htm) <br> **-** Specific pattern ([Cookie Parameter Wildcard](https://docs.vdms.com/cdn/Content/HRE/M/Cookie-Parameter-Wildcard.htm)) |
| [Edge CN]







## Next steps

For the most recent match conditions, see the [Verizon Rules Engine documentation](https://docs.vdms.com/cdn/index.html#Quick_References/HRE_QR.htm#Conditio).

- [Azure Content Delivery Network overview](cdn-overview.md)
- [Rules engine reference](cdn-verizon-premium-rules-engine-reference.md)
- [Rules engine conditional expressions](cdn-verizon-premium-rules-engine-reference-conditional-expressions.md)
- [Rules engine features](cdn-verizon-premium-rules-engine-reference-features.md)
- [Overriding default HTTP behavior using the rules engine](cdn-verizon-premium-rules-engine.md)
