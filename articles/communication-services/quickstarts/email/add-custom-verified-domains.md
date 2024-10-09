---
title: How to add custom verified email domains
titleSuffix: An Azure Communication Services quick start guide
description: Learn about adding custom email domains in Azure Communication Services.
author: bashan-git
manager: sphenry
services: azure-communication-services
ms.author: bashan
ms.date: 03/31/2023
ms.topic: quickstart
ms.service: azure-communication-services
zone_pivot_groups: acs-plat-azp-azcli-net-ps
ms.custom: mode-other, devx-track-azurecli, devx-track-azurepowershell
ms.devlang: azurecli
---
# Quickstart: How to add custom verified email domains

In this quick start, you learn how to provision a custom verified email domain in Azure Communication Services.

::: zone pivot="platform-azp"
[!INCLUDE [Azure portal](./includes/create-custom-managed-domain-resource-az-portal.md)]
::: zone-end

::: zone pivot="platform-azcli"
[!INCLUDE [Azure CLI](./includes/create-custom-managed-domain-resource-az-cli.md)]
::: zone-end

::: zone pivot="platform-net"
[!INCLUDE [.NET](./includes/create-custom-managed-domain-resource-dot-net.md)]
::: zone-end

::: zone pivot="platform-powershell"
[!INCLUDE [PowerShell](./includes/create-custom-managed-domain-resource-powershell.md)]
::: zone-end

## Azure Managed Domains compared to Custom Domains

Before provisioning a custom email domain, review the following table to decide which domain type best meets your needs.

| | [Azure Managed Domains](./add-azure-managed-domains.md) | [Custom Domains](./add-custom-verified-domains.md) | 
|---|---|---|
|**Pros:** | - Setup is quick & easy<br/>- No domain verification required<br /> | - Emails are sent from your own domain |
|**Cons:** | - Sender domain isn't personalized and can't be changed<br/>- Sender usernames can't be personalized<br/>- Limited sending volume<br />- User Engagement Tracking can't be enabled<br /> | - Requires verification of domain records<br /> - Longer setup for verification |

## Change MailFrom and FROM display names for custom domains

You can optionally configure your `MailFrom` address to be something other than the default `DoNotReply` and add more than one sender username to your domain. For more information about how to configure your sender address, see [Quickstart: How to add multiple sender addresses](add-multiple-senders.md).

**Your email domain is now ready to send emails.**

## Add DNS records in popular domain registrars

### TXT records

The following links provide instructions about how to add a TXT record using popular domain registrars.

| Registrar Name | Documentation Link |
| --- | --- |
| IONOS by 1 & 1 | [Steps 1-7](/microsoft-365/admin/dns/create-dns-records-at-1-1-internet?view=o365-worldwide#:~:text=Add%20a%20TXT%20record%20for%20verification,created%20can%20update%20across%20the%20Internet.&preserve-view=true) 
| 123-reg.co.uk | [Steps 1-6](/microsoft-365/admin/dns/create-dns-records-at-123-reg-co-uk?view=o365-worldwide#:~:text=DNS%20records.-,Add%20a%20TXT%20record%20for%20verification,that%20the%20record%20you%20just%20created%20can%20update%20across%20the%20Internet.,-Now%20that%20you%27ve&preserve-view=true)
| Amazon Web Services (AWS) | [Steps 1-8](/microsoft-365/admin/dns/create-dns-records-at-aws?view=o365-worldwide#:~:text=DNS%20records.-,Add%20a%20TXT%20record%20for%20verification,that%20the%20record%20you%20just%20created%20can%20update%20across%20the%20Internet.,-Now%20that%20you%27ve&preserve-view=true)
| Cloudflare | [Steps 1-6](/microsoft-365/admin/dns/create-dns-records-at-cloudflare?view=o365-worldwide#:~:text=Add%20a%20TXT,across%20the%20Internet.&preserve-view=true)
| GoDaddy | [Steps 1-6](/microsoft-365/admin/dns/create-dns-records-at-godaddy?view=o365-worldwide#:~:text=Add%20a%20TXT,across%20the%20Internet.&preserve-view=true)
| Namecheap | [Steps 1-9](/microsoft-365/admin/dns/create-dns-records-at-namecheap?view=o365-worldwide#:~:text=DNS%20records.-,Add%20a%20TXT%20record%20for%20verification,that%20the%20record%20you%20just%20created%20can%20update%20across%20the%20Internet.,-Now%20that%20you%27ve&preserve-view=true)
| Network Solutions | [Steps 1-9](/microsoft-365/admin/dns/create-dns-records-at-network-solutions?view=o365-worldwide#:~:text=DNS%20records.-,Add%20a%20TXT%20record%20for%20verification,that%20the%20record%20you%20just%20created%20can%20update%20across%20the%20Internet,-.&preserve-view=true)
| OVH | [Steps 1-9](/microsoft-365/admin/dns/create-dns-records-at-ovh?view=o365-worldwide#:~:text=DNS%20records.-,Add%20a%20TXT%20record%20for%20verification,that%20the%20record%20you%20just%20created%20can%20update%20across%20the%20Internet.,-Now%20that%20you%27ve&preserve-view=true)
| web.com | [Steps 1-8](/microsoft-365/admin/dns/create-dns-records-at-web-com?view=o365-worldwide#:~:text=with%20your%20domain.-,Add%20a%20TXT%20record%20for%20verification,that%20the%20record%20you%20just%20created%20can%20update%20across%20the%20Internet,-.&preserve-view=true)
| Wix | [Steps 1-5](/microsoft-365/admin/dns/create-dns-records-at-wix?view=o365-worldwide#:~:text=DNS%20records.-,Add%20a%20TXT%20record%20for%20verification,that%20the%20record%20you%20just%20created%20can%20update%20across%20the%20Internet,-.&preserve-view=true)
| Other (General) | [Steps 1-4](/microsoft-365/admin/get-help-with-domains/create-dns-records-at-any-dns-hosting-provider?view=o365-worldwide#:~:text=Recommended%3A%20Verify%20with,domain%20is%20verified.&preserve-view=true)

### CNAME records

The following links provide more information about how to add a CNAME record using popular domain registrars. Make sure to use your values from the configuration window rather than the examples in the documentation link.

| Registrar Name | Documentation Link |
| --- | --- |
| IONOS by 1 & 1 | [Steps 1-10](/microsoft-365/admin/dns/create-dns-records-at-1-1-internet?view=o365-worldwide#:~:text=Add%20the%20CNAME,Select%20Save.&preserve-view=true) 
| 123-reg.co.uk | [Steps 1-6](/microsoft-365/admin/dns/create-dns-records-at-123-reg-co-uk?view=o365-worldwide#:~:text=for%20that%20record.-,Add%20the%20CNAME%20record%20required%20for%20Microsoft,Select%20Add.,-Add%20a%20TXT&preserve-view=true)
| Amazon Web Services (AWS) | [Steps 1-8](/microsoft-365/admin/dns/create-dns-records-at-aws?view=o365-worldwide#:~:text=selecting%20Delete.-,Add%20the%20CNAME%20record%20required%20for%20Microsoft%20365,Select%20Create%20records.,-Add%20a%20TXT&preserve-view=true)
| Cloudflare | [Steps 1-6](/microsoft-365/admin/dns/create-dns-records-at-cloudflare?view=o365-worldwide#:~:text=Add%20the%20CNAME,Select%20Save.&preserve-view=true)
| GoDaddy | [Steps 1-6](/microsoft-365/admin/dns/create-dns-records-at-godaddy?view=o365-worldwide#:~:text=Add%20the%20CNAME,Select%20Save.&preserve-view=true)
| Namecheap | [Steps 1-8](/microsoft-365/admin/dns/create-dns-records-at-namecheap?view=o365-worldwide#:~:text=in%20this%20procedure.-,Add%20the%20CNAME%20record%20required%20for%20Microsoft,Select%20the%20Save%20Changes%20(check%20mark)%20control.,-Add%20a%20TXT&preserve-view=true)
| Network Solutions | [Steps 1-9](/microsoft-365/admin/dns/create-dns-records-at-network-solutions?view=o365-worldwide#:~:text=for%20each%20record.-,Add%20the%20CNAME%20record%20required%20for%20Microsoft,View%20in%20the%20upper%20right%20to%20view%20the%20record%20you%20created.,-Add%20a%20TXT&preserve-view=true)
| OVH | [Steps 1-8](/microsoft-365/admin/dns/create-dns-records-at-ovh?view=o365-worldwide#add-the-cname-record-required-for-microsoft:~:text=Select%20Confirm.-,Add%20the%20CNAME%20record%20required%20for%20Microsoft,Select%20Confirm.,-Add%20a%20TXT&preserve-view=true)
| web.com | [Steps 1-8](/microsoft-365/admin/dns/create-dns-records-at-web-com?view=o365-worldwide#add-the-cname-record-required-for-microsoft:~:text=for%20each%20record.-,Add%20the%20CNAME%20record%20required%20for%20Microsoft,Select%20ADD.,-Add%20a%20TXT&preserve-view=true)
| Wix | [Steps 1-5](/microsoft-365/admin/dns/create-dns-records-at-wix?view=o365-worldwide#add-the-cname-record-required-for-microsoft:~:text=Select%20Save.-,Add%20the%20CNAME%20record%20required%20for%20Microsoft,that%20the%20record%20you%20just%20created%20can%20update%20across%20the%20Internet.,-Add%20a%20TXT&preserve-view=true)
| Other (General) | [Guide](/microsoft-365/admin/dns/create-dns-records-using-windows-based-dns?view=o365-worldwide#add-cname-records:~:text=%3E%20OK.-,Add%20CNAME%20records,Select%20OK.,-Add%20the%20SIP&preserve-view=true)

## Next steps

* [Get started by connecting Email Communication Service with an Azure Communication Service resource](../../quickstarts/email/connect-email-communication-resource.md)

* [How to send an email using Azure Communication Services](../../quickstarts/email/send-email.md)


## Related articles

* Familiarize yourself with the [Email client library](../../concepts/email/sdk-features.md)
