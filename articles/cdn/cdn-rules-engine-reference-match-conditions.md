---
title: Azure CDN rules engine match conditions | Microsoft Docs
description: Reference documentation for Azure CDN rules engine match conditions and features.
services: cdn
documentationcenter: ''
author: Lichard
manager: akucer
editor: ''

ms.assetid: 669ef140-a6dd-4b62-9b9d-3f375a14215e
ms.service: cdn
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/23/2017
ms.author: rli

---

# Azure CDN rules engine match conditions
This topic lists detailed descriptions of the available Match Conditions for Azure Content Delivery Network (CDN) [Rules Engine](cdn-rules-engine.md).

The second part of a rule is the match condition. A match condition identifies specific types of requests for which a set of features will be performed.

For example, it may be used to filter requests for content at a particular location, requests generated from a particular IP address or country, or by header information.

## Always

The Always match condition is designed to apply a default set of features to all requests.

## Device

The Device match condition identifies requests made from a mobile device based on its properties.  Mobile device detection is achieved through [WURFL](http://wurfl.sourceforge.net/).  WURFL capabilities and their CDN Rules Engine variables are listed below.

> [!NOTE] 
> The variables below are supported in the **Modify Client Request Header** and **Modify Client Response Header** features.

Capability | Variable | Description | Sample Value(s)
-----------|----------|-------------|----------------
Brand Name | %{wurfl_cap_brand_name} | A string that indicates the brand name of the device. | Samsung
Device OS | %{wurfl_cap_device_os} | A string that indicates the operating system installed on the device. | IOS
Device OS Version | %{wurfl_cap_device_os_version} | A string that indicates the version number of the OS installed on the device. | 1.0.1
Dual Orientation | %{wurfl_cap_dual_orientation} | A Boolean that indicates whether the device supports dual orientation. | true
HTML Preferred DTD | %{wurfl_cap_html_preferred_dtd} | A string that indicates the mobile device's preferred document type definition (DTD) for HTML content. | none<br/>xhtml_basic<br/>html5
Image Inlining | %{wurfl_cap_image_inlining} | A Boolean that indicates whether the device supports Base64 encoded images. | false
Is Android | %{wurfl_vcap_is_android} | A Boolean that indicates whether the device uses the Android OS. | true
Is IOS | %{wurfl_vcap_is_ios} | A Boolean that indicates whether the device uses iOS. | false
Is Smart TV | %{wurfl_cap_is_smarttv} | A Boolean that indicates whether the device is a smart TV. | false
Is Smartphone | %{wurfl_vcap_is_smartphone} | A Boolean that indicates whether the device is a smartphone. | true
Is Tablet | %{wurfl_cap_is_tablet} | A Boolean that indicates whether the device is a tablet. This is an OS-independent description. | true
Is Wireless Device | %{wurfl_cap_is_wireless_device} | A Boolean that indicates whether the device is considered a wireless device. | true
Marketing Name | %{wurfl_cap_marketing_name} | A string that indicates the device's marketing name. | BlackBerry 8100 Pearl
Mobile Browser | %{wurfl_cap_mobile_browser} | A string that indicates the browser used to request content from the device. | Chrome
Mobile Browser Version | %{wurfl_cap_mobile_browser_version} | A string that indicates the version of the browser used to request content from the device. | 31
Model Name | %{wurfl_cap_model_name} | A string that indicates the device's model name. | s3
Progressive Download | %{wurfl_cap_progressive_download} | A Boolean that indicates whether the device supports the playback of audio/video while it is still being downloaded. | true
Release Date | %{wurfl_cap_release_date} | A string that indicates the year and month on which the device was added to the WURFL database.<br/><br/>Format: `yyyy_mm` | 2013_december
Resolution Height | %{wurfl_cap_resolution_height} | An integer that indicates the device's height in pixels. | 768
Resolution Width | %{wurfl_cap_resolution_width} | An integer that indicates the device's width in pixels. | 1024


## Location

These match conditions are designed to identify requests based on the requester's location.

Name | Purpose
-----|--------
AS Number | Identifies requests that originate from a particular network.
Country | Identifies requests that originate from the specified countries.


## Origin

These match conditions are designed to identify requests that point to CDN storage or a customer origin server.

Name | Purpose
-----|--------
CDN Origin | Identifies requests for content stored on CDN storage.
Customer Origin | Identifies requests for content stored on a specific customer origin server.


## Request

These match conditions are designed to identify requests based on their properties.

Name | Purpose
-----|--------
Client IP Address | Identifies requests that originate from a particular IP address.
Cookie Parameter | Checks the cookies associated with each request for the specified value.
Cookie Parameter Regex | Checks the cookies associated with each request for the specified regular expression.
Edge Cname | Identifies requests that point to a specific edge CNAME.
Referring Domain | Identifies requests that were referred from the specified hostname(s).
Request Header Literal | Identifies requests that contain the specified header set to a specified value(s).
Request Header Regex | Identifies requests that contain the specified header set to a value that matches the specified regular expression.
Request Header Wildcard | Identifies requests that contain the specified header set to a value that matches the specified pattern.
Request Method | Identifies requests by their HTTP method.
Request Scheme | Identifies requests by their HTTP protocol.

## URL

These match conditions are designed to identify requests based on their URLs.

Name | Purpose
-----|--------
URL Path Directory | Identifies requests by their relative path.
URL Path Extension | Identifies requests by their filename extension.
URL Path Filename | Identifies requests by their filename.
URL Path Literal | Compares a request's relative path to the specified value.
URL Path Regex | Compares a request's relative path to the specified regular expression.
URL Path Wildcard | Compares a request's relative path to the specified pattern.
URL Query Literal | Compares a request's query string to the specified value.
URL Query Parameter | Identifies requests that contain the specified query string parameter set to a value that matches a specified pattern.
URL Query Regex | Identifies requests that contain the specified query string parameter set to a value that matches a specified regular expression.
URL Query Wildcard | Compares the specified value(s) against the request's query string.


## Next steps
* [Azure CDN Overview](cdn-overview.md)
* [Rules Engine Reference](cdn-rules-engine-reference.md)
* [Rules Engine Conditional Expressions](cdn-rules-engine-reference-conditional-expressions.md)
* [Rules Engine Features](cdn-rules-engine-reference-features.md)
* [Overriding default HTTP behavior using the rules engine](cdn-rules-engine.md)

