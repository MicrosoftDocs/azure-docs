---
title: Location condition in Azure Active Directory Conditional Access
description: Use the location condition to control access based on user physical or network location.

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: conceptual
ms.date: 08/15/2022

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: calebb, mewal

ms.collection: M365-identity-device-management
---
# Using the location condition in a Conditional Access policy 

As explained in the [overview article](overview.md) Conditional Access policies are at their most basic an if-then statement combining signals, to make decisions, and enforce organization policies. One of those signals that can be incorporated into the decision-making process is location.

![Conceptual Conditional signal plus decision to get enforcement](./media/location-condition/conditional-access-signal-decision-enforcement.png)

Organizations can use this location for common tasks like: 

- Requiring multifactor authentication for users accessing a service when they're off the corporate network.
- Blocking access for users accessing a service from specific countries or regions.

The location is determined by the public IP address a client provides to Azure Active Directory or GPS coordinates provided by the Microsoft Authenticator app. Conditional Access policies by default apply to all IPv4 and IPv6 addresses. 

## Named locations

Locations are named in the Azure portal under **Azure Active Directory** > **Security** > **Conditional Access** > **Named locations**. These named network locations may include locations like an organization's headquarters network ranges, VPN network ranges, or ranges that you wish to block. Named locations can be defined by IPv4/IPv6 address ranges or by countries. 

![Named locations in the Azure portal](./media/location-condition/new-named-location.png)

### IP address ranges

To define a named location by IPv4/IPv6 address ranges, you'll need to provide: 

- A **Name** for the location
- One or more IP ranges
- Optionally **Mark as trusted location**

![New IP locations in the Azure portal](./media/location-condition/new-trusted-location.png)

Named locations defined by IPv4/IPv6 address ranges are subject to the following limitations: 

- Configure up to 195 named locations
- Configure up to 2000 IP ranges per named location
- Both IPv4 and IPv6 ranges are supported
- Private IP ranges can't be configured
- The number of IP addresses contained in a range is limited. Only CIDR masks greater than /8 are allowed when defining an IP range. 

#### Trusted locations

Administrators can name locations defined by IP address ranges to be trusted named locations. 

Sign-ins from trusted named locations improve the accuracy of Azure AD Identity Protection's risk calculation, lowering a user's sign-in risk when they authenticate from a location marked as trusted. Additionally, trusted named locations can be targeted in Conditional Access policies. For example, you may [restrict multifactor authentication registration to trusted locations](howto-conditional-access-policy-registration.md). 

### Countries

Organizations can determine country location by IP address or GPS coordinates. 

To define a named location by country, you'll need to provide: 

- A **Name** for the location
- Choose to determine location by IP address or GPS coordinates
- Add one or more countries
- Optionally choose to **Include unknown countries/regions**

![Country as a location in the Azure portal](./media/location-condition/new-named-location-country-region.png)

If you select **Determine location by IP address (IPv4 only)**, the system will collect the IP address of the device the user is signing into. When a user signs in, Azure AD resolves the user's IPv4 address to a country or region, and the mapping is updated periodically. Organizations can use named locations defined by countries to block traffic from countries where they don't do business. 

> [!NOTE]
> Sign-ins from IPv6 addresses cannot be mapped to countries or regions, and are considered unknown areas. Only IPv4 addresses can be mapped to countries or regions.

If you select **Determine location by GPS coordinates**, the user will need to have the Microsoft Authenticator app installed on their mobile device. Every hour, the system will contact the user’s Microsoft Authenticator app to collect the GPS location of the user’s mobile device.

The first time the user is required to share their location from the Microsoft Authenticator app, the user will receive a notification in the app. The user will need to open the app and grant location permissions. 

For the next 24 hours, if the user is still accessing the resource and granted the app permission to run in the background, the device's location is shared silently once per hour. 

- After 24 hours, the user must open the app and approve the notification. 
- Users who have number matching or additional context enabled in the Microsoft Authenticator app won't receive notifications silently and must open the app to approve  notifications. 
 
Every time the user shares their GPS location, the app does jailbreak detection (Using the same logic as the Intune MAM SDK). If the device is jailbroken, the location isn't considered valid, and the user isn't granted access. 

A Conditional Access policy with GPS-based named locations in report-only mode prompts users to share their GPS location, even though they aren't blocked from signing in.

GPS location doesn't work with [passwordless authentication methods](../authentication/concept-authentication-passwordless.md). 

Multiple conditional access policies applications may prompt users for their GPS location before all Conditional Access policies are applied. Because of the way Conditional Access policies are applied, a user may be denied access if they pass the location check but fail another policy. For more information about policy enforcement, see the article [Building a Conditional Access policy](concept-conditional-access-policies.md).

> [!IMPORTANT]
> Users may receive prompts every hour letting them know that Azure AD is checking their location in the Authenticator app. The preview should only be used to protect very sensitive apps where this behavior is acceptable or where access needs to be restricted to a specific country/region.

#### Include unknown countries/regions

Some IP addresses aren't mapped to a specific country or region, including all IPv6 addresses. To capture these IP locations, check the box **Include unknown countries/regions** when defining a geographic location. This option allows you to choose if these IP addresses should be included in the named location. Use this setting when the policy using the named location should apply to unknown locations.

### Configure MFA trusted IPs

You can also configure IP address ranges representing your organization's local intranet in the [multifactor authentication service settings](https://account.activedirectory.windowsazure.com/usermanagement/mfasettings.aspx). This feature enables you to configure up to 50 IP address ranges. The IP address ranges are in CIDR format. For more information, see [Trusted IPs](../authentication/howto-mfa-mfasettings.md#trusted-ips).  

If you have Trusted IPs configured, they show up as **MFA Trusted IPs** in the list of locations for the location condition.

#### Skipping multifactor authentication

On the multifactor authentication service settings page, you can identify corporate intranet users by selecting  **Skip multifactor authentication for requests from federated users on my intranet**. This setting indicates that the inside corporate network claim, which is issued by AD FS, should be trusted and used to identify the user as being on the corporate network. For more information, see [Enable the Trusted IPs feature by using Conditional Access](../authentication/howto-mfa-mfasettings.md#enable-the-trusted-ips-feature-by-using-conditional-access).

After checking this option, including the named location **MFA Trusted IPs** will apply to any policies with this option selected.

For mobile and desktop applications, which have long lived session lifetimes, Conditional Access is periodically reevaluated. The default is once an hour. When the inside corporate network claim is only issued at the time of the initial authentication, Azure AD may not have a list of trusted IP ranges. In this case, it's more difficult to determine if the user is still on the corporate network:

1. Check if the user’s IP address is in one of the trusted IP ranges.
1. Check whether the first three octets of the user’s IP address match the first three octets of the IP address of the initial authentication. The IP address is compared with the initial authentication when the inside corporate network claim was originally issued and the user location was validated.

If both steps fail, a user is considered to be no longer on a trusted IP.

## Location condition in policy

When you configure the location condition, you can distinguish between:

- Any location
- All trusted locations
- Selected locations

### Any location

By default, selecting **Any location** causes a policy to be applied to all IP addresses, which means any address on the Internet. This setting isn't limited to IP addresses you've configured as named location. When you select **Any location**, you can still exclude specific locations from a policy. For example, you can apply a policy to all locations except trusted locations to set the scope to all locations, except the corporate network.

### All trusted locations

This option applies to:

- All locations that have been marked as trusted location
- **MFA Trusted IPs** (if configured)

### Selected locations

With this option, you can select one or more named locations. For a policy with this setting to apply, a user needs to connect from any of the selected locations. When you **Select** the named network selection control that shows the list of named networks opens. The list also shows if the network location has been marked as trusted. The named location called **MFA Trusted IPs** is used to include the IP settings that can be configured in the multifactor authentication service setting page.

## IPv6 traffic

By default, Conditional Access policies will apply to all IPv6 traffic. You can exclude specific IPv6 address ranges from a Conditional Access policy if you don’t want policies to be enforced for specific IPv6 ranges. For example, if you want to not enforce a policy for uses on your corporate network, and your corporate network is hosted on public IPv6 ranges.

### Identifying IPv6 traffic in the Azure AD Sign-in activity reports

You can discover IPv6 traffic in your tenant by going the [Azure AD sign-in activity reports](../reports-monitoring/concept-sign-ins.md). After you have the activity report open, add the “IP address” column. This column will give you to identify the IPv6 traffic.

You can also find the client IP by clicking a row in the report, and then going to the “Location” tab in the sign-in activity details. 

### When will my tenant have IPv6 traffic?

Azure Active Directory (Azure AD) doesn’t currently support direct network connections that use IPv6. However, there are some cases that authentication traffic is proxied through another service. In these cases, the IPv6 address will be used during policy evaluation.

Most of the IPv6 traffic that gets proxied to Azure AD comes from Microsoft Exchange Online. When available, Exchange will prefer IPv6 connections. **So if you have any Conditional Access policies for Exchange, that have been configured for specific IPv4 ranges, you’ll want to make sure you’ve also added your organizations IPv6 ranges.** Not including IPv6 ranges will cause unexpected behavior for the following two cases:

- When a mail client is used to connect to Exchange Online with legacy authentication, Azure AD may receive an IPv6 address. The initial authentication request goes to Exchange and is then proxied to Azure AD.
- When Outlook Web Access (OWA) is used in the browser, it will periodically verify all Conditional Access policies continue to be satisfied. This check is used to catch cases where a user may have moved from an allowed IP address to a new location, like the coffee shop down the street. In this case, if an IPv6 address is used and if the IPv6 address isn't in a configured range, the user may have their session interrupted and be directed back to Azure AD to reauthenticate. 

If you're using Azure VNets, you'll have traffic coming from an IPv6 address. If you have VNet traffic blocked by a Conditional Access policy, check your Azure AD sign-in log. Once you’ve identified the traffic, you can get the IPv6 address being used and exclude it from your policy. 

> [!NOTE]
> If you want to specify an IP CIDR range for a single address, apply the /128 bit mask. If you see the IPv6 address 2607:fb90:b27a:6f69:f8d5:dea0:fb39:74a and wanted to exclude that single address as a range, you would use 2607:fb90:b27a:6f69:f8d5:dea0:fb39:74a/128.

## What you should know

### When is a location evaluated?

Conditional Access policies are evaluated when:

- A user initially signs in to a web app, mobile or desktop application.
- A mobile or desktop application that uses modern authentication, uses a refresh token to acquire a new access token. By default this check is once an hour.

This check means for mobile and desktop applications using modern authentication, a change in location would be detected within an hour of changing the network location. For mobile and desktop applications that don’t use modern authentication, the policy is applied on each token request. The frequency of the request can vary based on the application. Similarly, for web applications, the policy is applied at initial sign-in and is good for the lifetime of the session at the web application. Because of differences in session lifetimes across applications, the time between policy evaluation will also vary. Each time the application requests a new sign-in token, the policy is applied.

By default, Azure AD issues a token on an hourly basis. After moving off the corporate network, within an hour the policy is enforced for applications using modern authentication.

### User IP address

The IP address used in policy evaluation is the public IP address of the user. For devices on a private network, this IP address isn't the client IP of the user’s device on the intranet, it's the address used by the network to connect to the public internet.

### Bulk uploading and downloading of named locations

When you create or update named locations, for bulk updates, you can upload or download a CSV file with the IP ranges. An upload replaces the IP ranges in the list with those ranges from the file. Each row of the file contains one IP Address range in CIDR format.

### Cloud proxies and VPNs

When you use a cloud hosted proxy or VPN solution, the IP address Azure AD uses while evaluating a policy is the IP address of the proxy. The X-Forwarded-For (XFF) header that contains the user’s public IP address isn't used because there's no validation that it comes from a trusted source, so would present a method for faking an IP address.

When a cloud proxy is in place, a policy that is used to require a hybrid Azure AD joined device can be used, or the inside corpnet claim from AD FS.

### API support and PowerShell

A preview version of the Graph API for named locations is available, for more information, see the [namedLocation API](/graph/api/resources/namedlocation).

## Next steps

- Configure an example Conditional Access policy using location, see the article [Conditional Access: Block access by location](howto-conditional-access-policy-location.md).
