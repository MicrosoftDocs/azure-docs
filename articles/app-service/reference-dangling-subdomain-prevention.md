---
title: Name Reservation Service
description: Describes the Name Reservation Service on Azure App Service to prevent dangling subdomain takeovers
ms.topic: article
ms.date: 10/11/2022
ms.author: msangapu
author: msangapu-msft
---

# Name Reservation Service

When a DNS record points to a resource that isn't available, the record itself should be removed from your DNS zone. If it hasn't been deleted, it's a "dangling DNS" record and creates the possibility for subdomain takeover. Name Reservation Service (also known as DNS reservations) prevents this subdomain takeover.

## How Name Reservation Service works

Upon deletion of an App Service app, the corresponding DNS is reserved. During the reservation period, re-use of the DNS will be forbidden EXCEPT for subscriptions belonging to tenant of the subscription originally owning the DNS. 

After the reservation expires, the DNS is free to be claimed by any subscription. By Name Reservation Service, the customer is afforded some time to either clean up any associations/pointers to said DNS or re-claim the DNS in Azure. The DNS name being reserved can be derived by appending 'azurewebsites.net'.

#### Example scenario

Subscription 'A' and subscription 'B' are the only subscriptions belonging to tenant 'AB'. Subscription 'A' contains an App Service app 'test' with DNS name 'test'.azurewebsites.net'. Upon deletion of the app, a reservation is taken on DNS name 'test.cloudapp.net'.

During the reservation period, only subscription 'A' or subscription 'B' will be able to claim the DNS name 'test.azurewebsites.net' by creating a classic cloud service named 'test'. No other subscriptions will be allowed to claim it. After the reservation period is complete, any subscription in Azure can now claim 'test.azurewebsites.net'.


## What is a subdomain takeover?

Subdomain takeovers are a common threat for organizations that regularly create and delete many resources. A subdomain takeover can occur when you have a DNS record that points to a deprovisioned Azure resource. Such DNS records are also known as "dangling DNS" entries. Subdomain takeovers enable malicious actors to redirect traffic intended for an organization’s domain to a site performing malicious activity.

The risks of subdomain takeover include:
•	Loss of control over the content of the subdomain
•	Cookie harvesting from unsuspecting visitors
•	Phishing campaigns
•	Further risks of classic attacks such as XSS, CSRF, CORS bypass

Learn more about Subdomain Takeover at [Dangling DNS and subdomain takeover](/azure/security/fundamentals/subdomain-takeover.md).



