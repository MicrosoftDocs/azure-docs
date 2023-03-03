---
title: Azure Communication Services direct routing domain validation
description: A how-to page about domain validation for direct routing.
services: azure-communication-services
author: boris-bazilevskiy

ms.service: azure-communication-services
ms.subservice: pstn
ms.date: 03/03/2023
ms.topic: how-to
ms.custom: include file
ms.author: nikuklic
---

# Domain validation

ACS direct routing configuration consist of the following steps:

1. Verify domain ownership for your SBC FQDN
1. Configure SBC FQDN and port number
1. Create voice routing rules

## Domain ownership validation

Make sure to add and verify domain name portion of the FQDN and keep in mind that the `*.onmicrosoft.com` domain name isn't supported for the SBC FQDN domain name. For example, if you have two domain names, `contoso.com` and `contoso.onmicrosoft.com`, use `sbc.contoso.com` as the SBC name. If using a subdomain, make sure this subdomain is also added and verified. For example, if you want to use `sbc.acs.contoso.com`, then acs.contoso.com needs to be registered.

### Domain verification using Azure portal

#### Add new domain name

1. Open Azure portal and navigate to your [Communication Service resource](http://link.how.to.create.resource).
1. In the left navigation pane, select Direct routing under Voice Calling - PSTN.
1. Select Connect domain from the Domains tab.
1. Enter the domain part of SBC’s fully qualified domain name.
1. Reenter the domain name.
1. Select Confirm and Add.
1. 
<picture here>

1. Select Verify next to new domain that is now visible in Domain’s list.
1. Azure portal will generate a value for a TXT record, you need to add that record to your registrars or DNS hosting provider website to set up your domain.

<another picture here>

[!Note] It might take up to 30 minutes for new DNS record to propagate on the Internet

1. Select Next. If everything is set up correctly, you should see Domain status changed to Verified next to the added domain.

#### Edit existing domain record

tba

#### Remove domain from Azure Communication Services

tba
