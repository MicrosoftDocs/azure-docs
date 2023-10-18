---
title: Configure the Microsoft Entra multifactor authentication NPS extension
description: After you install the NPS extension, use these steps for advanced configuration like allowed IP lists and UPN replacement.

services: multi-factor-authentication
ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 01/29/2023

ms.author: justinha
author: justinha
manager: amycolannino
ms.reviewer: michmcla

ms.collection: M365-identity-device-management
---
# Advanced configuration options for the NPS extension for multifactor authentication

The Network Policy Server (NPS) extension extends your cloud-based Microsoft Entra multifactor authentication features into your on-premises infrastructure. This article assumes that you already have the extension installed, and now want to know how to customize the extension for your needs.

## Alternate login ID

Since the NPS extension connects to both your on-premises and cloud directories, you might encounter an issue where your on-premises user principal names (UPNs) don't match the names in the cloud. To solve this problem, use alternate login IDs. 

Within the NPS extension, you can designate an Active Directory attribute to be used as the UPN for Microsoft Entra multifactor authentication. This enables you to protect your on-premises resources with two-step verification without modifying your on-premises UPNs. 

To configure alternate login IDs, go to `HKLM\SOFTWARE\Microsoft\AzureMfa` and edit the following registry values:

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| LDAP_ALTERNATE_LOGINID_ATTRIBUTE | string | Empty | Designate the name of Active Directory attribute that you want to use as the UPN. This attribute is used as the AlternateLoginId attribute. If this registry value is set to a [valid Active Directory attribute](/windows/win32/adschema/attributes-all) (for example, mail or displayName), then the attribute's value is used as the user's UPN for authentication. If this registry value is empty or not configured, then AlternateLoginId is disabled and the user's UPN is used for authentication. |
| LDAP_FORCE_GLOBAL_CATALOG | boolean | False | Use this flag to force the use of Global Catalog for LDAP searches when looking up AlternateLoginId. Configure a domain controller as a Global Catalog, add the AlternateLoginId attribute to the Global Catalog, and then enable this flag. <br><br> If LDAP_LOOKUP_FORESTS is configured (not empty), **this flag is enforced as true**, regardless of the value of the registry setting. In this case, the NPS extension requires the Global Catalog to be configured with the AlternateLoginId attribute for each forest. |
| LDAP_LOOKUP_FORESTS | string | Empty | Provide a semi-colon separated list of forests to search. For example, *contoso.com;foobar.com*. If this registry value is configured, the NPS extension iteratively searches all the forests in the order in which they were listed, and returns the first successful AlternateLoginId value. If this registry value is not configured, the AlternateLoginId lookup is confined to the current domain.|

To troubleshoot problems with alternate login IDs, use the recommended steps for [Alternate login ID errors](howto-mfa-nps-extension-errors.md#alternate-login-id-errors).

## IP exceptions

If you need to monitor server availability, like if load balancers verify which servers are running before sending workloads, you don't want these checks to be blocked by verification requests. Instead, create a list of IP addresses that you know are used by service accounts, and disable multifactor authentication requirements for that list.

To configure an IP allowed list, go to `HKLM\SOFTWARE\Microsoft\AzureMfa` and configure the following registry value:

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| IP_WHITELIST | string | Empty | Provide a semi-colon separated list of IP addresses. Include the IP addresses of machines where service requests originate, like the NAS/VPN server. IP ranges and subnets are not supported. <br><br> For example, *10.0.0.1;10.0.0.2;10.0.0.3*.

> [!NOTE]
> This registry key is not created by default by the installer and an error appears in the AuthZOptCh log when the service is restarted. This error in the log can be ignored, but if this registry key is created and left empty if not needed then the error message does not return.

When a request comes in from an IP address that exists in the `IP_WHITELIST`, two-step verification is skipped. The IP list is compared to the IP address that is provided in the *ratNASIPAddress* attribute of the RADIUS request. If a RADIUS request comes in without the ratNASIPAddress attribute, a warning is logged: "IP_WHITE_LIST_WARNING::IP Whitelist is being ignored as the source IP is missing in the RADIUS request NasIpAddress attribute."

## Next steps

- [Resolve error messages from the NPS extension for Microsoft Entra multifactor authentication](howto-mfa-nps-extension-errors.md)
- [Use REQUIRE_USER_MATCH to prepare for users that aren't enrolled for MFA](howto-mfa-nps-extension.md#configure-your-nps-extension)
