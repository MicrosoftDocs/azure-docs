---
title: Preventing domain take over vulnerability in Cloud Services
description: This document talks about preventing the web domain take over security vulnerability.
author: tanmaygore
manager: vashan
ms.service: cloud-services
ms.topic: conceptual
ms.date: 01/04/2020
ms.author: tagore
---

# Preventing domain take over in Azure Cloud Services
## What is domain take over vulnerability?
Customers create a CNAME record that aliases one of their domain/subdomains to the "*.cloudapp.net" DNS address of their cloud service deployment. 

Example: contoso.com -> contoso-app.cloudapp.net

If the cloud service (hosted service) is deleted, the DNS linked to the hosted service is also deleted. If the cname is not updated/deleted, it continues to point to a non existent DNS. A hacker can immediately create a new cloud service with the same DNS name and start owning the domain. This means, all the traffic to contoso.com will be served by hacker’s malicious application running at contoso-app.cloudapp.net. 

Both customer and Azure need to take actions to prevent this vulnerability. 

## What Azure provides to prevent the vulnerability
When a DNS address is released, Azure will block this address for reuse across any other subscription for 7 days. The address can be reused only in the same subscription within the 7 day window. 

After 7 days, the address will be available for reuse. 

There is a limit on number of DNS addresses that are be blocked within a subscription. 

## What customers need to do?
Customer is responsible to update/delete the reference between Cname and DNS address within 7 days. Azure does not store Cname information. 

