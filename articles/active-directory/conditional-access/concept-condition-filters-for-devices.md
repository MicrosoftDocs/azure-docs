---
title: Filter for devices as a condition in Conditional Access policy
description: Use filter for devices in Conditional Access to enhance security posture
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: conceptual
ms.date: 07/18/2023
ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: sandeo
ms.collection: M365-identity-device-management
---
# Conditional Access: Filter for devices

When creating Conditional Access policies, administrators have asked for the ability to target or exclude specific devices in their environment. The condition filter for devices gives administrators this capability. Now you can target specific devices using [supported operators and properties for device filters](#supported-operators-and-device-properties-for-filters) and the other available assignment conditions in your Conditional Access policies.

:::image type="content" source="media/concept-condition-filters-for-devices/create-filter-for-devices-condition.png" alt-text="Creating a filter for device in Conditional Access policy conditions":::

## Common scenarios

There are multiple scenarios that organizations can now enable using filter for devices condition. The following scenarios provide examples of how to use this new condition.

- **Restrict access to privileged resources**. For this example, lets say you want to allow access to Microsoft Azure Management from a user who is assigned a privileged role Global Administrator, has satisfied multifactor authentication and accessing from a device that is [privileged or secure admin workstations](/security/compass/privileged-access-devices) and attested as compliant. For this scenario, organizations would create two Conditional Access policies:
   - Policy 1: All users with the directory role of Global Administrator, accessing the Microsoft Azure Management cloud app, and for Access controls, Grant access, but require multifactor authentication and require device to be marked as compliant.
   - Policy 2: All users with the directory role of Global Administrator, accessing the Microsoft Azure Management cloud app, excluding a filter for devices using rule expression device.extensionAttribute1 equals SAW and for Access controls, Block. Learn how to [update extensionAttributes on an Azure AD device object](/graph/api/device-update?view=graph-rest-1.0&tabs=http&preserve-view=true).
- **Block access to organization resources from devices running an unsupported Operating System**. For this example, lets say you want to block access to resources from Windows OS version older than Windows 10. For this scenario, organizations would create the following Conditional Access policy:
   - All users, accessing all cloud apps, excluding a filter for devices using rule expression device.operatingSystem equals Windows and device.operatingSystemVersion startsWith "10.0" and for Access controls, Block.
- **Do not require multifactor authentication for specific accounts on specific devices**. For this example, lets say you want to not require multifactor authentication when using service accounts on specific devices like Teams phones or Surface Hub devices. For this scenario, organizations would create the following two Conditional Access policies:
   - Policy 1: All users excluding service accounts, accessing all cloud apps, and for Access controls, Grant access, but require multifactor authentication.
   - Policy 2: Select users and groups and include group that contains service accounts only, accessing all cloud apps, excluding a filter for devices using rule expression device.extensionAttribute2 not equals TeamsPhoneDevice and for Access controls, Block.

> [!NOTE] 
> Azure AD uses device authentication to evaluate device filter rules. For a device that is unregistered with Azure AD, all device properties are considered as null values and the device attributes cannot be determined since the device does not exist in the directory. The best way to target policies for unregistered devices is by using the negative operator since the configured filter rule would apply. If you were to use a positive operator, the filter rule would only apply when a device exists in the directory and the configured rule matches the attribute on the device. 

## Create a Conditional Access policy

Filter for devices is an option when creating a Conditional Access policy in the Azure portal or using the Microsoft Graph API.

The following steps will help create two Conditional Access policies to support the first scenario under [Common scenarios](#common-scenarios). 

Policy 1: All users with the directory role of Global Administrator, accessing the Microsoft Azure Management cloud app, and for Access controls, Grant access, but require multifactor authentication and require device to be marked as compliant.

1. Sign in to the **[Microsoft Entra admin center](https://entra.microsoft.com)** as a [Conditional Access Administrator](../roles/permissions-reference.md#conditional-access-administrator).
1. Browse to **Microsoft Entra ID (Azure AD)** > **Protection** > **Conditional Access**.
1. Select **Create new policy**.
1. Give your policy a name. We recommend that organizations create a meaningful standard for the names of their policies.
1. Under **Assignments**, select **Users or workload identities**.
   1. Under **Include**, select **Directory roles** and choose **Global Administrator**.
   
      > [!WARNING]
      > Conditional Access policies support built-in roles. Conditional Access policies are not enforced for other role types including [administrative unit-scoped](../roles/admin-units-assign-roles.md) or [custom roles](../roles/custom-create.md).

   1. Under **Exclude**, select **Users and groups** and choose your organization's emergency access or break-glass accounts. 
   1. Select **Done**.
1. Under **Target resources** > **Cloud apps** > **Include** > **Select apps**, choose **Microsoft Azure Management**, and select **Select**.
1. Under **Access controls** > **Grant**, select **Grant access**, **Require multifactor authentication**, and **Require device to be marked as compliant**, then select **Select**.
1. Confirm your settings and set **Enable policy** to **On**.
1. Select **Create** to create to enable your policy.

Policy 2: All users with the directory role of Global Administrator, accessing the Microsoft Azure Management cloud app, excluding a filter for devices using rule expression device.extensionAttribute1 equals SAW and for Access controls, Block.

1. Select **Create new policy**.
1. Give your policy a name. We recommend that organizations create a meaningful standard for the names of their policies.
1. Under **Assignments**, select **Users or workload identities**.
   1. Under **Include**, select **Directory roles** and choose **Global Administrator**.
   
      > [!WARNING]
      > Conditional Access policies support built-in roles. Conditional Access policies are not enforced for other role types including [administrative unit-scoped](../roles/admin-units-assign-roles.md) or [custom roles](../roles/custom-create.md).

   1. Under **Exclude**, select **Users and groups** and choose your organization's emergency access or break-glass accounts. 
   1. Select **Done**.
1. Under **Target resources** > **Cloud apps** > **Include** > **Select apps**, choose **Microsoft Azure Management**, and select **Select**.
1. Under **Conditions**, **Filter for devices**.
   1. Toggle **Configure** to **Yes**.
   1. Set **Devices matching the rule** to **Exclude filtered devices from policy**.
   1. Set the property to `ExtensionAttribute1`, the operator to `Equals` and the value to `SAW`.
   1. Select **Done**.
1. Under **Access controls** > **Grant**, select **Block access**, then select **Select**.
1. Confirm your settings and set **Enable policy** to **On**.
1. Select **Create** to create to enable your policy.

> [!WARNING]
> Policies that require compliant devices may prompt users on Mac, iOS, and Android to select a device certificate during policy evaluation, even though device compliance is not enforced. These prompts may repeat until the device is made compliant.

### Setting attribute values

Setting extension attributes is made possible through the Graph API. For more information about setting device attributes, see the article [Update device](/graph/api/device-update?tabs=http#example-2--write-extensionattributes-on-a-device).

### Filter for devices Graph API

The filter for devices API is available in Microsoft Graph v1.0 endpoint and can be accessed using the endpoint `https://graph.microsoft.com/v1.0/identity/conditionalaccess/policies/`. You can configure a filter for devices when creating a new Conditional Access policy or you can update an existing policy to configure the filter for devices condition. To update an existing policy, you can do a patch call on the Microsoft Graph v1.0 endpoint by appending the policy ID of an existing policy and executing the following request body. The example here shows configuring a filter for devices condition excluding devices that aren't marked as SAW devices. The rule syntax can consist of more than one single expression. To learn more about the syntax, see [dynamic membership rules for groups in Azure Active Directory](../enterprise-users/groups-dynamic-membership.md). 

```json
{
    "conditions": {
        "devices": {
            "deviceFilter": {
                "mode": "exclude",
                "rule": "device.extensionAttribute1 -ne \"SAW\""
            }
        }
    }
}
```

## Supported operators and device properties for filters

The following device attributes can be used with the filter for devices condition in Conditional Access.

> [!NOTE] 
> Azure AD uses device authentication to evaluate device filter rules. For a device that is unregistered with Azure AD, all device properties are considered as null values and the device attributes cannot be determined since the device does not exist in the directory. The best way to target policies for unregistered devices is by using the negative operator since the configured filter rule would apply. If you were to use a positive operator, the filter rule would only apply when a device exists in the directory and the configured rule matches the attribute on the device. 

| Supported device attributes | Supported operators | Supported values | Example |
| --- | --- | --- | --- |
| deviceId | Equals, NotEquals, In, NotIn | A valid deviceId that is a GUID | (device.deviceid -eq "498c4de7-1aee-4ded-8d5d-000000000000") |
| displayName | Equals, NotEquals, StartsWith, NotStartsWith, EndsWith, NotEndsWith, Contains, NotContains, In, NotIn | Any string | (device.displayName -contains "ABC") |
| deviceOwnership | Equals, NotEquals | Supported values are "Personal" for bring your own devices and "Company" for corporate owned devices  | (device.deviceOwnership -eq "Company") |
| isCompliant | Equals, NotEquals | Supported values are "True" for compliant devices and "False" for non compliant devices  | (device.isCompliant -eq "True") |
| manufacturer | Equals, NotEquals, StartsWith, NotStartsWith, EndsWith, NotEndsWith, Contains, NotContains, In, NotIn | Any string | (device.manufacturer -startsWith "Microsoft") |
| mdmAppId | Equals, NotEquals, In, NotIn | A valid MDM application ID | (device.mdmAppId -in ["0000000a-0000-0000-c000-000000000000"] |
| model | Equals, NotEquals, StartsWith, NotStartsWith, EndsWith, NotEndsWith, Contains, NotContains, In, NotIn | Any string | (device.model -notContains "Surface") |
| operatingSystem | Equals, NotEquals, StartsWith, NotStartsWith, EndsWith, NotEndsWith, Contains, NotContains, In, NotIn | A valid operating system (like Windows, iOS, or Android) | (device.operatingSystem -eq "Windows") |
| operatingSystemVersion | Equals, NotEquals, StartsWith, NotStartsWith, EndsWith, NotEndsWith, Contains, NotContains, In, NotIn | A valid operating system version (like 6.1 for Windows 7, 6.2 for Windows 8, or 10.0 for Windows 10 and Windows 11) | (device.operatingSystemVersion -in ["10.0.18363", "10.0.19041", "10.0.19042", "10.0.22000"]) |
| physicalIds | Contains, NotContains | As an example all Windows Autopilot devices store ZTDId (a unique value assigned to all imported Windows Autopilot devices) in device physicalIds property. | (device.physicalIds -contains "[ZTDId]:value") |
| profileType | Equals, NotEquals | A valid profile type set for a device. Supported values are: RegisteredDevice (default), SecureVM (used for Windows VMs in Azure enabled with Azure AD sign-in), Printer (used for printers), Shared (used for shared devices), IoT (used for IoT devices) | (device.profileType -eq "Printer") |
| systemLabels | Contains, NotContains | List of labels applied to the device by the system. Some of the supported values are: AzureResource (used for Windows VMs in Azure enabled with Azure AD sign-in), M365Managed (used for devices managed using Microsoft Managed Desktop), MultiUser (used for shared devices) | (device.systemLabels -contains "M365Managed") |
| trustType | Equals, NotEquals | A valid registered state for devices. Supported values are: AzureAD (used for Azure AD joined devices), ServerAD (used for Hybrid Azure AD joined devices), Workplace (used for Azure AD registered devices) | (device.trustType -eq "ServerAD") |
| extensionAttribute1-15 | Equals, NotEquals, StartsWith, NotStartsWith, EndsWith, NotEndsWith, Contains, NotContains, In, NotIn | extensionAttributes1-15 are attributes that customers can use for device objects. Customers can update any of the extensionAttributes1 through 15 with custom values and use them in the filter for devices condition in Conditional Access. Any string value can be used. | (device.extensionAttribute1 -eq "SAW") |

> [!NOTE] 
> When building complex rules or using too many individual identifiers like deviceid for device identities, keep in mind "The maximum length for the filter rule is 3072 characters".

> [!NOTE] 
> The `Contains` and the `NotContains` operators work differently depending on attribute types. For string attributes such as `operatingSystem` and `model`, the `Contains` operator indicates whether a specified substring occurs within the attribute. For string collection attributes such as `physicalIds` and `systemLabels`, the `Contains` operator indicates whether a specified string matches one of the whole strings in the collection.

## Policy behavior with filter for devices

The filter for devices condition in Conditional Access evaluates policy based on device attributes of a registered device in Azure AD and hence it's important to understand under what circumstances the policy is applied or not applied. The following table illustrates the behavior when a filter for devices condition is configured. 

| Filter for devices condition | Device registration state | Device filter Applied 
| --- | --- | --- |
| Include/exclude mode with positive operators (Equals, StartsWith, EndsWith, Contains, In) and use of any attributes | Unregistered device | No |
| Include/exclude mode with positive operators (Equals, StartsWith, EndsWith, Contains, In) and use of attributes excluding extensionAttributes1-15 | Registered device | Yes, if criteria are met |
| Include/exclude mode with positive operators (Equals, StartsWith, EndsWith, Contains, In) and use of attributes including extensionAttributes1-15 | Registered device managed by Intune | Yes, if criteria are met |
| Include/exclude mode with positive operators (Equals, StartsWith, EndsWith, Contains, In) and use of attributes including extensionAttributes1-15 | Registered device not managed by Intune | Yes, if criteria are met. When extensionAttributes1-15 are used, the policy will apply if device is compliant or Hybrid Azure AD joined |
| Include/exclude mode with negative operators (NotEquals, NotStartsWith, NotEndsWith, NotContains, NotIn) and use of any attributes | Unregistered device | Yes |
| Include/exclude mode with negative operators (NotEquals, NotStartsWith, NotEndsWith, NotContains, NotIn) and use of any attributes excluding extensionAttributes1-15 | Registered device | Yes, if criteria are met |
| Include/exclude mode with negative operators (NotEquals, NotStartsWith, NotEndsWith, NotContains, NotIn) and use of any attributes including extensionAttributes1-15 | Registered device managed by Intune | Yes, if criteria are met |
| Include/exclude mode with negative operators (NotEquals, NotStartsWith, NotEndsWith, NotContains, NotIn) and use of any attributes including extensionAttributes1-15 | Registered device not managed by Intune | Yes, if criteria are met. When extensionAttributes1-15 are used, the policy will apply if device is compliant or Hybrid Azure AD joined |

## Next steps

- [Back to school – Using Boolean algebra correctly in complex filters](https://techcommunity.microsoft.com/t5/intune-customer-success/back-to-school-using-boolean-algebra-correctly-in-complex/ba-p/3422765)
- [Update device Graph API](/graph/api/device-update?tabs=http)
- [Conditional Access: Conditions](concept-conditional-access-conditions.md)
- [Common Conditional Access policies](concept-conditional-access-policy-common.md)
- [Securing devices as part of the privileged access story](/security/compass/privileged-access-devices)
