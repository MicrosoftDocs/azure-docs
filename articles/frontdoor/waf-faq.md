---
title: Azure web application firewall - Frequently Asked Questions
description: This page provides answers to frequently asked questions about Azure Front Door Service
services: frontdoor
documentationcenter: ''
author: KumudD
ms.service: frontdoor
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 06/10/2019
ms.author: kumud
ms.reviewer: tyao
---

# Frequently asked questions for Azure web application firewall

This article answers common questions about Azure web application firewall (WAF) features and functionality. 

## What is Azure WAF?

Azure WAF is a web application firewall that helps protect your web applications from common threats such as SQL injection, cross-site scripting and other web exploits. You can define a WAF policy consisting of a combination of custom and managed rules to control access to your web applications.

An Azure WAF policy can be applied to web applications hosted on Application Gateway or Azure Front Door services.

## What is WAF for Azure Front Door Service? 

Azure Front Door is a highly scalable, globally distributed application and content delivery network. Azure WAF, when integrated with Front Door, stops denial-of-service and targeted application attacks at the Azure network edge, close to attack sources before they enter your virtual network, offers protection without sacrificing performance.

## Does Azure WAF support HTTPS?

Front Door Service offers SSL offloading. WAF is natively integrated with Front Door and can inspect a request after it is decrypted.

## Does Azure WAF support IPv6?

Yes. You can configure IP restriction for IPv4 and IPv6.

## How up-to-date are the managed rule sets?

We do our best to keep up with changing threat landscape. Once a new rule is updated, it's added to the Default Rule Set with a new version number.

## What is the propagation time if I make a change to my WAF policy?

Deploying a WAF policy globally usually takes about 5 minutes and often completes sooner.

## Can WAF policies be different for different regions?

When integrated with Front Door Service, WAF is a global resource. Same configuration applies across all Front Door locations.
 
## How do I limit access to my back-end to be from Front Door only?

You may configure IP Access Control List in your back-end to allow for only Front Door outbound IP address ranges and deny any direct access from Internet. Service tags are supported for you to use on your virtual network. In addition, you can verify that the X-Forwarded-Host HTTP header field is valid for your web application.




## Which Azure WAF options should I choose?

There are two options when applying WAF policies in Azure. WAF with Azure Front Door is a globally distributed, edge security solution. WAF with Application Gateway is a regional, dedicated solution. We recommend you choose a solution based on your overall performance and security requirements. For more information, see [Load-balancing with Azure’s application delivery suite](https://docs.microsoft.com/azure/frontdoor/front-door-lb-with-azure-app-delivery-suite).


## Do you support same WAF features in all integrated platforms?

Currently, ModSec CRS 2.2.9 and CRS 3.0 rules are only supported with WAF at Application Gateway. Rate-limiting, geo-filtering, and Azure managed Default Rule Set rules are supported only with WAF at Azure Front Door.

## Is DDoS protection integrated with Front Door? 

Globally distributed at Azure network edges, Azure Front Door can absorb and geographically isolate large volume attacks. You can create custom WAF policy to automatically block and rate limit http(s) attacks that have known signatures. Further more, you can enable DDoS Protection Standard on the VNet where your back-ends are deployed. Azure DDoS Protection Standard customers receive additional benefits including cost protection, SLA guarantee, and access to experts from DDoS Rapid Response Team for immediate help during an attack. 

## Next steps

- Learn about [Azure web application firewall](waf-overview.md).
- Learn more about [Azure Front Door](front-door-overview.md).
