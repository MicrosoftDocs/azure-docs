---
title: Location condition in Azure Active Directory Conditional Access
description: Learn how to use the location condition to control access to your cloud apps based on a user's network location.

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: conceptual
ms.date: 11/24/2020

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: calebb

ms.collection: M365-identity-device-management

ms.custom: contperf-fy20q4
---
# Using the location condition in a Conditional Access policy 

As explained in the [overview article](overview.md) Conditional Access policies are at their most basic an if-then statement combining signals, to make decisions, and enforce organization policies. One of those signals that can be incorporated into the decision-making process is network location.

![Conceptual Conditional signal plus decision to get enforcement](./media/location-condition/conditional-access-signal-decision-enforcement.png)

Organizations can use this network location for common tasks like: 

- Requiring multi-factor authentication for users accessing a service when they are off the corporate network.
- Blocking access for users accessing a service from specific countries or regions.

The network location is determined by the public IP address a client provides to Azure Active Directory. Conditional Access policies by default apply to all IPv4 and IPv6 addresses. 

## Named locations

Locations are designated in the Azure portal under **Azure Active Directory** > **Security** > **Conditional Access** > **Named locations**. These named network locations may include locations like an organization's headquarters network ranges, VPN network ranges, or ranges that you wish to block. Named locations can be defined by IPv4/IPv6 address ranges or by countries/regions. 

![Named locations in the Azure portal](./media/location-condition/new-named-location.png)

### IP address ranges

To define a named location by IPv4/IPv6 address ranges, you will need to provide a **Name** and an IP range. 

Named locations defined by IPv4/IPv6 address ranges are subject to the following limitations: 
- Configure up to 195 named locations
- Configure up to 2000 IP ranges per named location
- Both IPv4 and IPv6 ranges are supported
- Private IP ranges cannot be configured
- The number of IP addresses contained in a range is limited. Only CIDR masks greater than /8 are allowed when defining an IP range. 

### Trusted locations

Administrators can designate named locations defined by IP address ranges to be trusted named locations. 

![Trusted locations in the Azure portal](./media/location-condition/new-trusted-location.png)

Sign-ins from trusted named locations improve the accuracy of Azure AD Identity Protection's risk calculation, lowering a user's sign-in risk when they authenticate from a location marked as trusted. Additionally, trusted named locations can be targeted in Conditional Access policies. For example, you may require restrict multi-factor authentication registration to trusted named locations only. 

### Countries and regions

Some organizations may choose to restrict access to certain countries or regions using Conditional Access. In addition to defining named locations by IP ranges, admins can define named locations by country or regions. When a user signs in, Azure AD resolves the user's IPv4 address to a country or region, and the mapping is updated periodically. Organizations can use named locations defined by countries to block traffic from countries where they do not do business, such as North Korea. 

> [!NOTE]
> Sign-ins from IPv6 addresses cannot be mapped to countries or regions, and are considered unknown areas. Only IPv4 addresses can be mapped to countries or regions.

![Create a new country or region-based location in the Azure portal](./media/location-condition/new-named-location-country-region.png)

#### Include unknown areas

Some IP addresses are not mapped to a specific country or region, including all IPv6 addresses. To capture these IP locations, check the box **Include unknown areas** when defining a location. This option allows you to choose if these IP addresses should be included in the named location. Use this setting when the policy using the named location should apply to unknown locations.

### Configure MFA trusted IPs

You can also configure IP address ranges representing your organization's local intranet in the [multi-factor authentication service settings](https://account.activedirectory.windowsazure.com/usermanagement/mfasettings.aspx). This feature enables you to configure up to 50 IP address ranges. The IP address ranges are in CIDR format. For more information, see [Trusted IPs](../authentication/howto-mfa-mfasettings.md#trusted-ips).  

If you have Trusted IPs configured, they show up as **MFA Trusted IPs** in the list of locations for the location condition.

### Skipping multi-factor authentication

On the multi-factor authentication service settings page, you can identify corporate intranet users by selecting  **Skip multi-factor authentication for requests from federated users on my intranet**. This setting indicates that the inside corporate network claim, which is issued by AD FS, should be trusted and used to identify the user as being on the corporate network. For more information, see [Enable the Trusted IPs feature by using Conditional Access](../authentication/howto-mfa-mfasettings.md#enable-the-trusted-ips-feature-by-using-conditional-access).

After checking this option, including the named location **MFA Trusted IPs** will apply to any policies with this option selected.

For mobile and desktop applications, which have long lived session lifetimes, Conditional Access is periodically reevaluated. The default is once an hour. When the inside corporate network claim is only issued at the time of the initial authentication, Azure AD may not have a list of trusted IP ranges. In this case, it is more difficult to determine if the user is still on the corporate network:

1. Check if the user’s IP address is in one of the trusted IP ranges.
1. Check whether the first three octets of the user’s IP address match the first three octets of the IP address of the initial authentication. The IP address is compared with the initial authentication when the inside corporate network claim was originally issued and the user location was validated.

If both steps fail, a user is considered to be no longer on a trusted IP.

## Location condition in policy

When you configure the location condition, you have the option to distinguish between:

- Any location
- All trusted locations
- Selected locations

### Any location

By default, selecting **Any location** causes a policy to be applied to all IP addresses, which means any address on the Internet. This setting is not limited to IP addresses you have configured as named location. When you select **Any location**, you can still exclude specific locations from a policy. For example, you can apply a policy to all locations except trusted locations to set the scope to all locations, except the corporate network.

### All trusted locations

This option applies to:

- All locations that have been marked as trusted location
- **MFA Trusted IPs** (if configured)

### Selected locations

With this option, you can select one or more named locations. For a policy with this setting to apply, a user needs to connect from any of the selected locations. When you click **Select** the named network selection control that shows the list of named networks opens. The list also shows if the network location has been marked as trusted. The named location called **MFA Trusted IPs** is used to include the IP settings that can be configured in the multi-factor authentication service setting page.

## IPv6 traffic

By default, Conditional Access policies will apply to all IPv6 traffic. You can exclude specific IPv6 address ranges from a Conditional Access policy if you don’t want policies to be enforced for specific IPv6 ranges. For example, if you want to not enforce a policy for uses on your corporate network, and your corporate network is hosted on public IPv6 ranges.  

### When will my tenant have IPv6 traffic?

Azure Active Directory (Azure AD) doesn’t currently support direct network connections that use IPv6. However, there are some cases that authentication traffic is proxied through another service. In these cases, the IPv6 address will be used during policy evaluation.

Most of the IPv6 traffic that gets proxied to Azure AD comes from Microsoft Exchange Online. When available, Exchange will prefer IPv6 connections. **So if you have any Conditional Access policies for Exchange, that have been configured for specific IPv4 ranges, you’ll want to make sure you’ve also added your organizations IPv6 ranges.** Not including IPv6 ranges will cause unexpected behavior for the following two cases:

- When a mail client is used to connect to Exchange Online with legacy authentication, Azure AD may receive an IPv6 address. The initial authentication request goes to Exchange and is then proxied to Azure AD.
- When Outlook Web Access (OWA) is used in the browser, it will periodically verify all Conditional Access policies continue to be satisfied. This check is used to catch cases where a user may have moved from an allowed IP address to a new location, like the coffee shop down the street. In this case, if an IPv6 address is used and if the IPv6 address is not in a configured range, the user may have their session interrupted and be directed back to Azure AD to reauthenticate. 

These are the most common reasons you may need to configure IPv6 ranges in your named locations. In addition, if you are using Azure VNets, you will have traffic coming from an IPv6 address. If you have VNet traffic blocked by a Conditional Access policy, check your Azure AD sign-in log. Once you’ve identified the traffic, you can get the IPv6 address being used and exclude it from your policy. 

> [!NOTE]
> If you want to specify an IP CIDR range for a single address, apply the /128 bit mask. If you see the IPv6 address 2607:fb90:b27a:6f69:f8d5:dea0:fb39:74a and wanted to exclude that single address as a range, you would use 2607:fb90:b27a:6f69:f8d5:dea0:fb39:74a/128.

### Identifying IPv6 traffic in the Azure AD Sign-in activity reports

You can discover IPv6 traffic in your tenant by going the [Azure AD sign-in activity reports](../reports-monitoring/concept-sign-ins.md). After you have the activity report open, add the “IP address” column. This column will give you to identify the IPv6 traffic.

You can also find the client IP by clicking a row in the report, and then going to the “Location” tab in the sign-in activity details. 

## What you should know

### When is a location evaluated?

Conditional Access policies are evaluated when:

- A user initially signs in to a web app, mobile or desktop application.
- A mobile or desktop application that uses modern authentication, uses a refresh token to acquire a new access token. By default this check is once an hour.

This check means for mobile and desktop applications using modern authentication, a change in location would be detected within an hour of changing the network location. For mobile and desktop applications that don’t use modern authentication, the policy is applied on each token request. The frequency of the request can vary based on the application. Similarly, for web applications, the policy is applied at initial sign-in and is good for the lifetime of the session at the web application. Due to differences in session lifetimes across applications, the time between policy evaluation will also vary. Each time the application requests a new sign-in token, the policy is applied.

By default, Azure AD issues a token on an hourly basis. After moving off the corporate network, within an hour the policy is enforced for applications using modern authentication.

### User IP address

The IP address that is used in policy evaluation is the public IP address of the user. For devices on a private network, this IP address is not the client IP of the user’s device on the intranet, it is the address used by the network to connect to the public internet.

### Bulk uploading and downloading of named locations

When you create or update named locations, for bulk updates, you can upload or download a CSV file with the IP ranges. An upload replaces the IP ranges in the list with those ranges from the file. Each row of the file contains one IP Address range in CIDR format.

### Cloud proxies and VPNs

When you use a cloud hosted proxy or VPN solution, the IP address Azure AD uses while evaluating a policy is the IP address of the proxy. The X-Forwarded-For (XFF) header that contains the user’s public IP address is not used because there is no validation that it comes from a trusted source, so would present a method for faking an IP address.

When a cloud proxy is in place, a policy that is used to require a hybrid Azure AD joined device can be used, or the inside corpnet claim from AD FS.

### API support and PowerShell

A preview version of the Graph API for named locations is available, for more information see the [namedLocation API](/graph/api/resources/namedlocation).

> [!NOTE]
> Named locations that you create by using PowerShell display only in Named locations (preview). You can't see named locations in the old view.  

## Next steps

- If you want to know how to configure a Conditional Access policy, see the article [Building a Conditional Access policy](concept-conditional-access-policies.md).
- Looking for an example policy using the location condition? See the article, [Conditional Access: Block access by location](howto-conditional-access-policy-location.md)
