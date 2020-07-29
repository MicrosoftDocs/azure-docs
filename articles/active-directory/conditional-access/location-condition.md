---
title: Location condition in Azure Active Directory Conditional Access
description: Learn how to use the location condition to control access to your cloud apps based on a user's network location.

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: article
ms.workload: identity
ms.date: 05/28/2020

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: calebb

ms.collection: M365-identity-device-management

ms.custom: contperfq4
---
# Using the location condition in a Conditional Access policy 

As explained in the [overview article](overview.md) Conditional Access policies are at their most basic an if-then statement combining signals, to make decisions, and enforce organization policies. One of those signals that can be incorporated into the decision-making process is network location.

![Conceptual Conditional signal plus decision to get enforcement](./media/location-condition/conditional-access-signal-decision-enforcement.png)

Organizations can use this network location for common tasks like: 

- Requiring multi-factor authentication for users accessing a service when they are off the corporate network.
- Blocking access for users accessing a service from specific countries or regions.

The network location is determined by the public IP address a client provides to Azure Active Directory. Conditional Access policies by default apply to all IPv4 and IPv6 addresses. 

> [!TIP]
> IPv6 ranges are only supported in the **[Named location (preview)](#preview-features)** interface. 

## Named locations

Locations are designated in the Azure portal under **Azure Active Directory** > **Security** > **Conditional Access** > **Named locations**. These named network locations may include locations like an organization's headquarters network ranges, VPN network ranges, or ranges that you wish to block. 

![Named locations in the Azure portal](./media/location-condition/new-named-location.png)

To configure a location, you will need to provide at least a **Name** and the IP range. 

The number of named locations you can configure is constrained by the size of the related object in Azure AD. You can configure locations based on of the following limitations:

- One named location with up to 1200 IPv4 ranges.
- A maximum of 90 named locations with one IP range assigned to each of them.

> [!TIP]
> IPv6 ranges are only supported in the **[Named location (preview)](#preview-features)** interface. 

### Trusted locations

When creating a network location, an administrator has the option to mark a location as a trusted location. 

![Trusted locations in the Azure portal](./media/location-condition/new-trusted-location.png)

This option can factor in to Conditional Access policies where you may, for example,  require registration for multi-factor authentication from a trusted network location. It also factors in to Azure AD Identity Protection's risk calculation, lowering a users' sign-in risk when coming from a location marked as trusted.

### Countries and regions

Some organizations may choose to define entire countries or regions IP boundaries as named locations for Conditional Access policies. They may use these locations when blocking unnecessary traffic when they know valid users will never come from a location such as North Korea. These mappings of IP address to country are updated periodically. 

> [!NOTE]
> Countries do not include IPv6 address ranges, only known IPv4 address ranges, and cannot be marked as trusted.

![Create a new country or region-based location in the Azure portal](./media/location-condition/new-named-location-country-region.png)

#### Include unknown areas

Some IP addresses are not mapped to a specific country or region. To capture these IP locations, check the box **Include unknown areas** when defining a location. This option allows you to choose if these IP addresses should be included in the named location. Use this setting when the policy using the named location should apply to unknown locations.

### Configure MFA trusted IPs

You can also configure IP address ranges representing your organization's local intranet in the [multi-factor authentication service settings](https://account.activedirectory.windowsazure.com/usermanagement/mfasettings.aspx). This feature enables you to configure up to 50 IP address ranges. The IP address ranges are in CIDR format. For more information, see [Trusted IPs](../authentication/howto-mfa-mfasettings.md#trusted-ips).  

If you have Trusted IPs configured, they show up as **MFA Trusted IPS** in the list of locations for the location condition.

### Skipping multi-factor authentication

On the multi-factor authentication service settings page, you can identify corporate intranet users by selecting  **Skip multi-factor authentication for requests from federated users on my intranet**. This setting indicates that the inside corporate network claim, which is issued by AD FS, should be trusted and used to identify the user as being on the corporate network. For more information, see [Enable the Trusted IPs feature by using Conditional Access](../authentication/howto-mfa-mfasettings.md#enable-the-trusted-ips-feature-by-using-conditional-access).

After checking this option, including the named location **MFA Trusted IPS** will apply to any policies with this option selected.

For mobile and desktop applications, which have long lived session lifetimes, Conditional Access is periodically reevaluated. The default is once an hour. When the inside corporate network claim is only issued at the time of the initial authentication, Azure AD may not have a list of trusted IP ranges. In this case, it is more difficult to determine if the user is still on the corporate network:

1. Check if the user’s IP address is in one of the trusted IP ranges.
1. Check whether the first three octets of the user’s IP address match the first three octets of the IP address of the initial authentication. The IP address is compared with the initial authentication when the inside corporate network claim was originally issued and the user location was validated.

If both steps fail, a user is considered to be no longer on a trusted IP.

## Preview features

In addition to the generally available named location feature, there is also a named location (preview). You can access the named location preview by using the banner at the top of the current named location blade.

![Try the named locations preview](./media/location-condition/preview-features.png)

With the named location preview, you are able to

- Configure up to 195 named locations
- Configure up to 2000 IP Ranges per named location
- Configure IPv6 addresses alongside IPv4 addresses

We’ve also added some additional checks to help reduce the change of misconfiguration.

- Private IP ranges can no longer be configured
- The number of IP addresses that can be included in a range are limited. Only CIDR masks greater than /8 will be allowed when configuring an IP range.

With the preview, there are now two create options: 

- **Countries location**
- **IP ranges location**

> [!NOTE]
> Countries do not include IPv6 address ranges, only known IPv4 address ranges, and cannot be marked as trusted.

![Named locations preview interface](./media/location-condition/named-location-preview.png)

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
- **MFA Trusted IPS** (if configured)

### Selected locations

With this option, you can select one or more named locations. For a policy with this setting to apply, a user needs to connect from any of the selected locations. When you click **Select** the named network selection control that shows the list of named networks opens. The list also shows if the network location has been marked as trusted. The named location called **MFA Trusted IPs** is used to include the IP settings that can be configured in the multi-factor authentication service setting page.

## What you should know

### When is a location evaluated?

Conditional Access policies are evaluated when:

- A user initially signs in to a web app, mobile or desktop application.
- A mobile or desktop application that uses modern authentication, uses a refresh token to acquire a new access token. By default this check is once an hour.

This check means for mobile and desktop applications using modern authentication, a change in location would be detected within an hour of changing the network location. For mobile and desktop applications that don’t use modern authentication, the policy is applied on each token request. The frequency of the request can vary based on the application. Similarly, for web applications, the policy is applied at initial sign-in and is good for the lifetime of the session at the web application. Due to differences in session lifetimes across applications, the time between policy evaluation will also vary. Each time the application requests a new sign-in token, the  policy is applied.

By default, Azure AD issues a token on an hourly basis. After moving off the corporate network, within an hour the policy is enforced for applications using modern authentication.

### User IP address

The IP address that is used in policy evaluation is the public IP address of the user. For devices on a private network, this IP address is not the client IP of the user’s device on the intranet, it is the address used by the network to connect to the public internet.

### Bulk uploading and downloading of named locations

When you create or update named locations, for bulk updates, you can upload or download a CSV file with the IP ranges. An upload replaces the IP ranges in the list with those ranges from the file. Each row of the file contains one IP Address range in CIDR format.

### Cloud proxies and VPNs

When you use a cloud hosted proxy or VPN solution, the IP address Azure AD uses while evaluating a policy is the IP address of the proxy. The X-Forwarded-For (XFF) header that contains the user’s public IP address is not used because there is no validation that it comes from a trusted source, so would present a method for faking an IP address.

When a cloud proxy is in place, a policy that is used to require a domain joined device can be used, or the inside corpnet claim from AD FS.

### API support and PowerShell

API and PowerShell is not yet supported for named locations.

## Next steps

- If you want to know how to configure a Conditional Access policy, see the article [Building a Conditional Access policy](concept-conditional-access-policies.md).
- Looking for an example policy using the location condition? See the article, [Conditional Access: Block access by location](howto-conditional-access-policy-location.md)
