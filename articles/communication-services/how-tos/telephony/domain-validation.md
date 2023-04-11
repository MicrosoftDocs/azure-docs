---
title: Azure Communication Services direct routing domain validation
description: A how-to page about domain validation for direct routing.
services: azure-communication-services
author: boris-bazilevskiy

ms.service: azure-communication-services
ms.subservice: pstn
ms.date: 03/11/2023
ms.topic: how-to
ms.custom: include file
ms.author: nikuklic
---

# Domain validation

This page describes the process of domain name ownership validation. Fully Qualified Domain Name (FQDN) consists of two parts: host name and domain name. For example, if your session border controller (SBC) name is `sbc1.contoso.com`, then `sbc1` would be a host name, while `contoso.com` would be a domain name. If there's an SBC with FQDN of `acs.sbc1.testing.contoso.com`, `acs` would be a host name, and `sbc1.testing.contoso.com` would be a domain name. To use direct routing, you need to validate that you own a domain part of your FQDN.

Azure Communication Services direct routing configuration consists of the following steps:

- Verify domain ownership for your SBC FQDN
- Configure SBC FQDN and port number
- Create voice routing rules

## Domain ownership validation

Make sure to add and verify domain name portion of the FQDN and keep in mind that the `*.onmicrosoft.com` and `*.azure.com` domain names aren't supported for the SBC FQDN domain name. For example, if you have two domain names, `contoso.com` and `contoso.onmicrosoft.com`, use `sbc.contoso.com` as the SBC name. If using a subdomain, make sure this subdomain is also added and verified. For example, if you want to use `sbc.acs.contoso.com`, then `acs.contoso.com` needs to be registered.

### Domain verification using Azure portal

#### Add new domain name

1. Open Azure portal and navigate to your [Communication Service resource](../../quickstarts/create-communication-resource.md).
1. In the left navigation pane, select Direct routing under Voice Calling - PSTN.
1. Select Connect domain from the Domains tab.
1. Enter the domain part of SBC’s fully qualified domain name.
1. Reenter the domain name.
1. Select Confirm and then select Add.

[ ![Screenshot of adding a custom domain.](./media/direct-routing-add-domain.png)](./media/direct-routing-add-domain.png#lightbox)

#### Verify domain ownership

1. Select Verify next to new domain that is now visible in Domain’s list.
1. Azure portal generates a value for a TXT record, you need to add that record to

[ ![Screenshot of verifying a custom domain.](./media/direct-routing-verify-domain-2.png)](./media/direct-routing-verify-domain-2.png#lightbox)

>[!Note] 
>It might take up to 30 minutes for new DNS record to propagate on the Internet

3. Select Next. If everything is set up correctly, you should see Domain status changed to *Verified* next to the added domain.

[ ![Screenshot of a verified domain.](./media/direct-routing-domain-verified.png)](./media/direct-routing-domain-verified.png#lightbox)

#### Remove domain from Azure Communication Services

If you want to remove a domain from your Azure Communication Services direct routing configuration, select the checkbox fir a corresponding domain name, and select *Remove*.

[ ![Screenshot of removing a custom domain.](./media/direct-routing-remove-domain.png)](./media/direct-routing-remove-domain.png#lightbox)

## Next steps:

### Conceptual documentation

- [Telephony in Azure Communication Services](../../concepts/telephony/telephony-concept.md)
- [Direct routing infrastructure requirements](../../concepts/telephony/direct-routing-infrastructure.md)
- [Pricing](../../concepts/pricing.md)

### Quickstarts

- [Outbound call to a phone number](../../quickstarts/telephony/pstn-call.md)
- [Redirect inbound telephony calls with Call Automation](../../quickstarts/call-automation/redirect-inbound-telephony-calls.md)