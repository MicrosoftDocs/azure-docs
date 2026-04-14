---
title: Prevent Subdomain Takeovers
description: Learn how to prevent dangling subdomain takeovers to reduce the threat of malicious activity.
ms.topic: concept-article
ms.date: 12/02/2025
ms.update-cycle: 1095-days
ms.author: msangapu
ms.custom: UpdateFrequency3
author: msangapu-msft
ms.service: azure-app-service

# Customer intent: As an App Service admin, I want to learn options for mitigating subdomain takeovers in Azure App Service so that I can reduce the threat of malicious activity.  

---

# Prevent subdomain takeovers in Azure App Service

Subdomain takeovers are a common threat for organizations that regularly create and delete many resources. A subdomain takeover can occur when you have a DNS record that points to a deprovisioned Azure resource. Such DNS records are also known as "dangling DNS" entries. Subdomain takeovers allow malicious actors to redirect traffic intended for an organization’s domain to a site performing malicious activity.

The risks of subdomain takeover include:

- Loss of control over the content of the subdomain
- Cookie harvesting from unsuspecting visitors
- Phishing campaigns
- Further risks of classic attacks such as XSS, CSRF, or CORS bypass

To learn more about subdomain takeover, see [Prevent dangling DNS entries and avoid subdomain takeover](../security/fundamentals/subdomain-takeover.md).

Azure App Service provides [name reservation](#how-app-service-prevents-subdomain-takeovers) and [domain verification tokens](#how-you-can-prevent-subdomain-takeovers) to prevent subdomain takeovers.

## How App Service prevents subdomain takeovers

Upon deletion of an App Service app or App Service Environment (ASE), the corresponding DNS is forbidden from reuse except by subscriptions that belong to the tenant of the subscription that originally owned the DNS. Thus, the customer has some time to either clean up any associations or pointers to the said DNS or reclaim the DNS in Azure by recreating the resource with the same name. This behavior is enabled by default on Azure App Service for `*.azurewebsites.net` and `*.appserviceenvironment.net` resources, so it doesn't require any customer configuration.

### Example scenario

Subscription *A* and subscription *B* are the only subscriptions that belong to tenant *AB*. Subscription *A* contains an App Service web app *test* with DNS name `test.azurewebsites.net`. Upon deletion of the app, only subscriptions *A* or *B* are able to immediately reuse the DNS name `test.azurewebsites.net` by creating a web app named *test*. No other subscriptions are allowed to claim the name right after the resource deletion.

## How you can prevent subdomain takeovers

When creating DNS entries for Azure App Service, create an *asuid.{subdomain}* TXT record with the domain verification ID. When such a TXT record exists, no other Azure subscription can validate the custom domain or take it over unless they add their token verification ID to the DNS entries.

These records prevent the creation of another App Service app using the same name from your CNAME entry. Without the ability to prove ownership of the domain name, threat actors can't receive traffic or control the content.

DNS records should be updated before the site deletion to ensure bad actors can't take over the domain between the period of deletion and re-creation.

To get a domain verification ID, see [Set up an existing custom domain in Azure App Service](app-service-web-tutorial-custom-domain.md).
