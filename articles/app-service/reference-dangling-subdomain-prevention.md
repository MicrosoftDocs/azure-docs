---
title: Prevent subdomain takeovers
description: Describes options for dangling subdomain prevention on Azure App Service.
ms.topic: article
ms.date: 10/14/2022
ms.author: msangapu
author: msangapu-msft
---

# What is a subdomain takeover?

Subdomain takeovers are a common threat for organizations that regularly create and delete many resources. A subdomain takeover can occur when you have a DNS record that points to a deprovisioned Azure resource. Such DNS records are also known as "dangling DNS" entries. Subdomain takeovers enable malicious actors to redirect traffic intended for an organization’s domain to a site performing malicious activity.

The risks of subdomain takeover include:

- Loss of control over the content of the subdomain
- Cookie harvesting from unsuspecting visitors
- Phishing campaigns
- Further risks of classic attacks such as XSS, CSRF, CORS bypass

Learn more about Subdomain Takeover at [Dangling DNS and subdomain takeover](../security/fundamentals/subdomain-takeover.md).

Azure App Service provides [Name Reservation](#how-name-reservation-service-works) Service and [domain verification tokens](#domain-verification-token) to prevent subdomain takeovers.
## How Name Reservation Service works

Upon deletion of an App Service app, the corresponding DNS is reserved. During the reservation period, re-use of the DNS will be forbidden except for subscriptions belonging to tenant of the subscription originally owning the DNS.

After the reservation expires, the DNS is free to be claimed by any subscription. By Name Reservation Service, the customer is afforded some time to either clean up any associations/pointers to said DNS or re-claim the DNS in Azure. The DNS name being reserved can be derived by appending 'azurewebsites.net'. Name Reservation Service is enabled by default on Azure App Service and doesn't require additional configuration.

#### Example scenario

Subscription 'A' and subscription 'B' are the only subscriptions belonging to tenant 'AB'. Subscription 'A' contains an App Service app 'test' with DNS name 'test'.azurewebsites.net'. Upon deletion of the app, a reservation is taken on DNS name 'test.azurewebsites.net'.

During the reservation period, only subscription 'A' or subscription 'B' will be able to claim the DNS name 'test.azurewebsites.net' by creating a web app named 'test'. No other subscriptions will be allowed to claim it. After the reservation period is complete, any subscription in Azure can now claim 'test.azurewebsites.net'.


## Domain verification token

When creating DNS entries for Azure App Service, create an asuid.{subdomain} TXT record with the Domain Verification ID. When such a TXT record exists, no other Azure Subscription can validate the Custom Domain or take it over unless they add their token verification ID to the DNS entries.

These records prevent the creation of another App Service app using the same name from your CNAME entry. Without the ability to prove ownership of the domain name, threat actors can't receive traffic or control the content.

DNS records should be updated before the site deletion to ensure bad actors can't take over the domain between the period of deletion and re-creation. Be aware that the DNS records take time to propagate.

To get a domain verification ID, see the [Map a custom domain tutorial](app-service-web-tutorial-custom-domain.md#2-get-a-domain-verification-id)