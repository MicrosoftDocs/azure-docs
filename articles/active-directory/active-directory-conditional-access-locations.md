---
title: Migrate classic policies in the Azure portal | Microsoft Docs
description: Learn what you need to know to migrate classic policies in the Azure portal.
services: active-directory
keywords: conditional access to apps, conditional access with Azure AD, secure access to company resources, conditional access policies
documentationcenter: ''
author: MarkusVi
manager: femila
editor: ''

ms.assetid: 8c1d978f-e80b-420e-853a-8bbddc4bcdad
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 12/11/2017
ms.author: markvi
ms.reviewer: nigu

---
# Azure Active Directory location condition 

With Azure Active Directory (Azure AD) conditional access, you can control how authorized users can access your cloud apps. The location condition of a conditional access policy enables you to tie the access control to the network locations of your users.

This article provides you with with the information you need to configure the location condition. 

## Locations

In a mobile-first, cloud-first world, Azure Active Directory (Azure AD) enables single sign-on to devices, apps, and services from anywhere. Users can access your cloud apps not only from the corporate network, but also from any internet location. When an access attempt is made from outside your corporate network, there is an increased risk that a sign-in is not performed by the legitimate owner of an account. 

With the location condition, you can control access to your cloud apps based on the network location of a user. Common use cases for the location condition are:

- Requiring multi-factor authentication for users accessing a service when they are off the corporate network  

- Blocking access for users accessing a service from specific countries or regions. 

A location is a label for a network location that either represents a named location or MFA trusted IPs.


## Named Locations 

With named locations, you can create logical groupings of IP address ranges, countries and regions. 

 A name location has the following components:

![Locations](./media/active-directory-conditional-access-locations/42.png)

- **Name** - The display name of a named location.

- **IP ranges** - One or more IP address ranges in CIDR format.

- **Mark as trusted location** - A flag you can set for a named location to indicate a trusted location. Typically, trusted locations are network areas that are controlled by your IT department. In addition to conditional access, trusted named locations are also used by Azure Identity Protection and Azure AD security reports to reduce false positives.

- **Country / Regions** - This option enables you to select one or more country or region to define a named location. 

- **Include unknown areas** - Some IP addresses are not mapped to a specific country. This option allows you to choose if these IP addresses should be included in the named location. They could be check when the policy using the named location should apply to unknown locations.

The number of named locations you can configure is constrained by the size of the related object in Azure AD. You can configure:

- One named location with up to 500 IP ranges.

- A maximum of 60 named locations with one IP range assigned to each of them.




## MFA trusted IPs

You can also configure IP address ranges in the multi-factor authentication service settings of the Azure portal. If you have a MFA trusted IPs range configured, it shows up as **MFA Trusted IPS** in the list of locations in the location condition.  

You can configure up to 50 IP address ranges in the MFA trusted IP settings. The IP address ranges are in CIDR format. Learn more about trusted IP settings.

### Skipping multi-factor federated users on the corporate intranet

On the multi-factor authentication service settings page, you can identify corporate intranet users by selecting  **Skip multi-factor authentication for requests from federated users on my intranet**. This setting indicates that the inside corporate network claim, which is issued by AD FS, should be trusted and used to identify the user as being on the corporate network. Learn more about configuring this option.

After checking this option, including the named location “MFA Trusted IPS” will apply to any policies with this selected.

For mobile and desktop applications, which have long lived session lifetimes, conditional access is periodically re-evaluated. The default is once an hour. When the inside corporate network claim is and only issued at the time of the initial authentication, Azure AD may not have a list of trusted IP ranges, so it is more difficult to determine if the user is still on the corporate network. 

The following heuristic is applied:

1. First check to see if the user’s IP address falls with in one of the trusted IP ranges.

2. Check to see that the first three octets of the user’s IP address match the first 3 octets of the IP address the initial authentication. The IP address is compared to the initial authentication because that is when the inside corporate network, claim was originally issued, and the user location was validated.

If both steps fail, evaluate the user to no longer be on an MFA Trusted IP.



## Configuration

When you configure the location condition, you have the option to distinguish between:

- Any location 
- All trusted locations
- Selected locations

![Locations](./media/active-directory-conditional-access-locations/01.png)

### Any location

By default, selecting **Any location** causes a policy to be applied to all IP addresses, which means any address on the Internet. This setting is not not limited to IP addresses you have configured as named location. When you select **Any location**, you can still exclude specific locations from a policy. For example, you can apply a policy to all locations excepts trusted locations to set the scope to all locations, except the corporate network.

### All trusted locations

This option applies to:

- All locations that have been marked as trusted location
- **MFA Trusted IPS** (if configured)


### Selected locations

With this option, you can select one or more named locations. For a policy with this setting to apply, a user needs to connect from any of the selected locations. Whe you click **Select** the named network selection control that shows the list of named networks opens. The list also shows if the network location has been marked as trusted. The named location named **MFA Trusted IPs** is used to include the IP settings that can be configured in the multi-factor authentication service setting page.

## What you should know

### When is policy evaluated?

Conditional access policies are evaluated when a user initially signs in and any time Azure AD issues a token for the cloud app that conditional access policy has been set on. For mobile and desktop applications, this defaults to once an hour. That means that 

----with in an hour of moving off of the corporate network policy will be enforced for applications using modern authentication.

### User IP address

The IP address that is used in policy evaluation is the public IP address of the user. For devices on a private network, this is not the client IP of the user’s device on the intranet, it is the address used by the network to connect to the public internet. 

### Cloud proxies and VPNs 

When you use a cloud hosted proxy or VPN solution, the IP address Azure AD uses while evaluating a policy is the IP address of the proxy. The X-Forwarded-For (XFF) header that contains the users public IP address is not used because there is no validation that it comes from a trusted source, so would present a method for faking an IP address. 

When a cloud proxy is in place, a policy that is used to require a domain joined device can be used, or the inside corpnet claim from AD FS.


### Bulk uploading and downloading of named locations

When you create or update named locations, for bulk updates, you can upload or download a CSV file with the IP ranges. An upload replaces the IP ranges in the list with those from the file. Each row of the file contains one IP Address range in CIDR format. 

### API support and PowerShell 

API and PowerShell is not yet supported for named locations, or for conditional access policies.





## Next steps

- If you want to know how to configure a conditional access policy, see [Get started with conditional access in Azure Active Directory](active-directory-conditional-access-azure-portal-get-started.md).

- If you are ready to configure conditional access policies for your environment, see the [best practices for conditional access in Azure Active Directory](active-directory-conditional-access-best-practices.md). 
