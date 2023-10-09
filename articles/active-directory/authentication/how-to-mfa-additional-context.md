---
title: Use additional context in Microsoft Authenticator notifications
description: Learn how to use additional context in MFA notifications
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 09/13/2023
ms.author: justinha
author: mjsantani
ms.collection: M365-identity-device-management

# Customer intent: As an identity administrator, I want to encourage users to use the Microsoft Authenticator app in Microsoft Entra ID to improve and secure user sign-in events.
---
# How to use additional context in Microsoft Authenticator notifications - Authentication methods policy

This topic covers how to improve the security of user sign-in by adding the application name and geographic location of the sign-in to Microsoft Authenticator passwordless and push notifications.  

## Prerequisites

- Your organization needs to enable Microsoft Authenticator passwordless and push notifications for some users or groups by using the new Authentication methods policy. You can edit the Authentication methods policy by using the Microsoft Entra admin center or Microsoft Graph API. 

  >[!NOTE]
  >The policy schema for Microsoft Graph APIs has been improved. The older policy schema is now deprecated. Make sure you use the new schema to help prevent errors.

- Additional context can be targeted to only a single group, which can be dynamic or nested. On-premises synchronized security groups and cloud-only security groups are supported for the Authentication method policy.

## Passwordless phone sign-in and multifactor authentication 

When a user receives a passwordless phone sign-in or MFA push notification in Microsoft Authenticator, they'll see the name of the application that requests the approval and the location based on the IP address where the sign-in originated from.

:::image type="content" border="false" source="./media/howto-authentication-passwordless-phone/location.png" alt-text="Screenshot of additional context in the MFA push notification.":::

The additional context can be combined with [number matching](how-to-mfa-number-match.md) to further improve sign-in security. 

:::image type="content" border="false" source="./media/howto-authentication-passwordless-phone/location-with-number-match.png" alt-text="Screenshot of additional context with number matching in the MFA push notification.":::

### Policy schema changes 

You can enable and disable application name and geographic location separately. Under featureSettings, you can use the following name mapping for each feature:

- Application name: displayAppInformationRequiredState
- Geographic location: displayLocationInformationRequiredState

>[!NOTE]
>Make sure you use the new policy schema for Microsoft Graph APIs. In Graph Explorer, you'll need to consent to the **Policy.Read.All** and **Policy.ReadWrite.AuthenticationMethod** permissions. 

Identify your single target group for each of the features. Then use the following API endpoint to change the displayAppInformationRequiredState or displayLocationInformationRequiredState properties under featureSettings to **enabled** and include or exclude the groups you want:

```http
https://graph.microsoft.com/v1.0/authenticationMethodsPolicy/authenticationMethodConfigurations/MicrosoftAuthenticator
```

#### MicrosoftAuthenticatorAuthenticationMethodConfiguration properties

**PROPERTIES**

| Property | Type | Description |
|---------|------|-------------|
| id | String | The Authentication method policy identifier. |
| state | authenticationMethodState | Possible values are: **enabled**<br>**disabled** |
 
**RELATIONSHIPS**

| Relationship | Type | Description |
|--------------|------|-------------|
| includeTargets | [microsoftAuthenticatorAuthenticationMethodTarget](/graph/api/resources/passwordlessmicrosoftauthenticatorauthenticationmethodtarget) collection | A collection of users or groups who are enabled to use the authentication method. |
| featureSettings | [microsoftAuthenticatorFeatureSettings](/graph/api/resources/passwordlessmicrosoftauthenticatorauthenticationmethodtarget) collection | A collection of Microsoft Authenticator features. |
 
#### MicrosoftAuthenticator includeTarget properties
 
**PROPERTIES**

| Property | Type | Description |
|----------|------|-------------|
| authenticationMode | String | Possible values are:<br>**any**: Both passwordless phone sign-in and traditional second factor notifications are allowed.<br>**deviceBasedPush**: Only passwordless phone sign-in notifications are allowed.<br>**push**: Only traditional second factor push notifications are allowed. |
| id | String | Object ID of a Microsoft Entra user or group. |
| targetType | authenticationMethodTargetType | Possible values are: **user**, **group**.|

#### MicrosoftAuthenticator featureSettings properties
 
**PROPERTIES**

| Property | Type | Description |
|----------|------|-------------|
| numberMatchingRequiredState | authenticationMethodFeatureConfiguration | Require number matching for MFA notifications. Value is ignored for phone sign-in notifications. |
| displayAppInformationRequiredState | authenticationMethodFeatureConfiguration | Determines whether the user is shown application name in Microsoft Authenticator notification. |
| displayLocationInformationRequiredState | authenticationMethodFeatureConfiguration | Determines whether the user is shown geographic location context in Microsoft Authenticator notification. |

#### Authentication method feature configuration properties

**PROPERTIES**

| Property | Type | Description |
|----------|------|-------------|
| excludeTarget | featureTarget | A single entity that is excluded from this feature. <br>You can only exclude one group for each feature.|
| includeTarget | featureTarget | A single entity that is included in this feature. <br>You can only include one group for each feature.|
| State | advancedConfigState | Possible values are:<br>**enabled** explicitly enables the feature for the selected group.<br>**disabled** explicitly disables the feature for the selected group.<br>**default** allows Microsoft Entra ID to manage whether the feature is enabled or not for the selected group. |

#### Feature target properties

**PROPERTIES**

| Property | Type | Description |
|----------|------|-------------|
| id | String | ID of the entity targeted. |
| targetType | featureTargetType | The kind of entity targeted, such as group, role, or administrative unit. The possible values are: ‘group’, 'administrativeUnit’, ‘role’, unknownFutureValue’. |

#### Example of how to enable additional context for all users

In **featureSettings**, change **displayAppInformationRequiredState** and **displayLocationInformationRequiredState** from **default** to **enabled**. 

The value of Authentication Mode can be either **any** or **push**, depending on whether or not you also want to enable passwordless phone sign-in. In these examples, we'll use **any**, but if you don't want to allow passwordless, use **push**.

You might need to PATCH the entire schema to prevent overwriting any previous configuration. In that case, do a GET first, update only the relevant fields, and then PATCH. The following example shows how to update **displayAppInformationRequiredState** and **displayLocationInformationRequiredState** under **featureSettings**. 

Only users who are enabled for Microsoft Authenticator under Microsoft Authenticator’s **includeTargets** will see the application name or geographic location. Users who aren't enabled for Microsoft Authenticator won't see these features.

```json
//Retrieve your existing policy via a GET. 
//Leverage the Response body to create the Request body section. Then update the Request body similar to the Request body as shown below.
//Change the Query to PATCH and Run query
 
{
    "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#authenticationMethodConfigurations/$entity",
    "@odata.type": "#microsoft.graph.microsoftAuthenticatorAuthenticationMethodConfiguration",
    "id": "MicrosoftAuthenticator",
    "state": "enabled",
    "featureSettings": {
        "displayAppInformationRequiredState": {
            "state": "enabled",
            "includeTarget": {
                "targetType": "group",
                "id": "all_users"
            },
            "excludeTarget": {
                "targetType": "group",
                "id": "00000000-0000-0000-0000-000000000000"
            }
        },
        "displayLocationInformationRequiredState": {
            "state": "enabled",
            "includeTarget": {
                "targetType": "group",
                "id": "all_users"
            },
            "excludeTarget": {
                "targetType": "group",
                "id": "00000000-0000-0000-0000-000000000000"
            }
        }
    },
    "includeTargets@odata.context": "https://graph.microsoft.com/v1.0/$metadata#authenticationMethodsPolicy/authenticationMethodConfigurations('MicrosoftAuthenticator')/microsoft.graph.microsoftAuthenticatorAuthenticationMethodConfiguration/includeTargets",
    "includeTargets": [
        {
            "targetType": "group",
            "id": "all_users",
            "isRegistrationRequired": false,
            "authenticationMode": "any",
        }
    ]
} 
```
 
 
#### Example of how to enable application name and geographic location for separate groups
 
In **featureSettings**, change **displayAppInformationRequiredState** and **displayLocationInformationRequiredState** from **default** to **enabled.** 
Inside the **includeTarget** for each featureSetting, change the **id** from **all_users** to the ObjectID of the group from the Microsoft Entra admin center.

You need to PATCH the entire schema to prevent overwriting any previous configuration. We recommend that you do a GET first, and then update only the relevant fields and then PATCH. The following example shows an update to **displayAppInformationRequiredState** and **displayLocationInformationRequiredState** under **featureSettings**. 

Only users who are enabled for Microsoft Authenticator under Microsoft Authenticator’s **includeTargets** will see the application name or geographic location. Users who aren't enabled for Microsoft Authenticator won't see these features.

```json
{
    "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#authenticationMethodConfigurations/$entity",
    "@odata.type": "#microsoft.graph.microsoftAuthenticatorAuthenticationMethodConfiguration",
    "id": "MicrosoftAuthenticator",
    "state": "enabled",
    "featureSettings": {
        "displayAppInformationRequiredState": {
            "state": "enabled",
            "includeTarget": {
                "targetType": "group",
                "id": "44561710-f0cb-4ac9-ab9c-e6c394370823"
            },
            "excludeTarget": {
                "targetType": "group",
                "id": "00000000-0000-0000-0000-000000000000"
            }
        },
        "displayLocationInformationRequiredState": {
            "state": "enabled",
            "includeTarget": {
                "targetType": "group",
                "id": "a229e768-961a-4401-aadb-11d836885c11"
            },
            "excludeTarget": {
                "targetType": "group",
                "id": "00000000-0000-0000-0000-000000000000"
            }
        }
    },
    "includeTargets@odata.context": "https://graph.microsoft.com/v1.0/$metadata#authenticationMethodsPolicy/authenticationMethodConfigurations('MicrosoftAuthenticator')/microsoft.graph.microsoftAuthenticatorAuthenticationMethodConfiguration/includeTargets",
    "includeTargets": [
        {
            "targetType": "group",
            "id": "all_users",
            "isRegistrationRequired": false,
            "authenticationMode": "any",
        }
    ]
}
```
 
To verify, run GET again and verify the ObjectID:

```http
GET https://graph.microsoft.com/v1.0/authenticationMethodsPolicy/authenticationMethodConfigurations/MicrosoftAuthenticator
```

#### Example of how to disable application name and only enable geographic location 
 
In **featureSettings**, change the state of **displayAppInformationRequiredState** to **default** or **disabled** and **displayLocationInformationRequiredState** to **enabled.** 
Inside the **includeTarget** for each featureSetting, change the **id** from **all_users** to the ObjectID of the group from the Microsoft Entra admin center.

You need to PATCH the entire schema to prevent overwriting any previous configuration. We recommend that you do a GET first, and then update only the relevant fields and then PATCH. The following example shows an update to **displayAppInformationRequiredState** and **displayLocationInformationRequiredState** under **featureSettings**. 

Only users who are enabled for Microsoft Authenticator under Microsoft Authenticator’s **includeTargets** will see the application name or geographic location. Users who aren't enabled for Microsoft Authenticator won't see these features.

```json
{
    "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#authenticationMethodConfigurations/$entity",
    "@odata.type": "#microsoft.graph.microsoftAuthenticatorAuthenticationMethodConfiguration",
    "id": "MicrosoftAuthenticator",
    "state": "enabled",
    "featureSettings": {
        "displayAppInformationRequiredState": {
            "state": "disabled",
            "includeTarget": {
                "targetType": "group",
                "id": "44561710-f0cb-4ac9-ab9c-e6c394370823"
            },
            "excludeTarget": {
                "targetType": "group",
                "id": "00000000-0000-0000-0000-000000000000"
            }
        },
        "displayLocationInformationRequiredState": {
            "state": "enabled",
            "includeTarget": {
                "targetType": "group",
                "id": "a229e768-961a-4401-aadb-11d836885c11"
            },
            "excludeTarget": {
                "targetType": "group",
                "id": "00000000-0000-0000-0000-000000000000"
            }
        }
    },
    "includeTargets@odata.context": "https://graph.microsoft.com/v1.0/$metadata#authenticationMethodsPolicy/authenticationMethodConfigurations('MicrosoftAuthenticator')/microsoft.graph.microsoftAuthenticatorAuthenticationMethodConfiguration/includeTargets",
    "includeTargets": [
        {
            "targetType": "group",
            "id": "all_users",
            "isRegistrationRequired": false,
            "authenticationMode": "any",
        }
    ]
}
```

#### Example of how to exclude a group from application name and geographic location 
 
In **featureSettings**, change the states of **displayAppInformationRequiredState** and **displayLocationInformationRequiredState** from **default** to **enabled.** 
Inside the **includeTarget** for each featureSetting, change the **id** from **all_users** to the ObjectID of the group from the Microsoft Entra admin center.

In addition, for each of the features, you'll change the id of the excludeTarget to the ObjectID of the group from the Microsoft Entra admin center. This change excludes that group from seeing application name or geographic location.

You need to PATCH the entire schema to prevent overwriting any previous configuration. We recommend that you do a GET first, and then update only the relevant fields and then PATCH. The following example shows an update to **displayAppInformationRequiredState** and **displayLocationInformationRequiredState** under **featureSettings**. 

Only users who are enabled for Microsoft Authenticator under Microsoft Authenticator’s **includeTargets** will see the application name or geographic location. Users who aren't enabled for Microsoft Authenticator won't see these features.

```json
{
    "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#authenticationMethodConfigurations/$entity",
    "@odata.type": "#microsoft.graph.microsoftAuthenticatorAuthenticationMethodConfiguration",
    "id": "MicrosoftAuthenticator",
    "state": "enabled",
    "featureSettings": {
        "displayAppInformationRequiredState": {
            "state": "enabled",
            "includeTarget": {
                "targetType": "group",
                "id": "44561710-f0cb-4ac9-ab9c-e6c394370823"
            },
            "excludeTarget": {
                "targetType": "group",
                "id": "5af8a0da-5420-4d69-bf3c-8b129f3449ce"
            }
        },
        "displayLocationInformationRequiredState": {
            "state": "enabled",
            "includeTarget": {
                "targetType": "group",
                "id": "a229e768-961a-4401-aadb-11d836885c11"
            },
            "excludeTarget": {
                "targetType": "group",
                "id": "b6bab067-5f28-4dac-ab30-7169311d69e8"
            }
        }
    },
    "includeTargets@odata.context": "https://graph.microsoft.com/v1.0/$metadata#authenticationMethodsPolicy/authenticationMethodConfigurations('MicrosoftAuthenticator')/microsoft.graph.microsoftAuthenticatorAuthenticationMethodConfiguration/includeTargets",
    "includeTargets": [
        {
            "targetType": "group",
            "id": "all_users",
            "isRegistrationRequired": false,
            "authenticationMode": "any",
        }
    ]
}
```
#### Example of removing the excluded group 
 
In **featureSettings**, change the states of **displayAppInformationRequiredState** from **default** to **enabled.** 
You need to change the **id** of the **excludeTarget** to `00000000-0000-0000-0000-000000000000`.

You need to PATCH the entire schema to prevent overwriting any previous configuration. We recommend that you do a GET first, and then update only the relevant fields and then PATCH. The following example shows an update to **displayAppInformationRequiredState** and **displayLocationInformationRequiredState** under **featureSettings**. 

Only users who are enabled for Microsoft Authenticator under Microsoft Authenticator’s **includeTargets** will see the application name or geographic location. Users who aren't enabled for Microsoft Authenticator won't see these features.

```json
{
    "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#authenticationMethodConfigurations/$entity",
    "@odata.type": "#microsoft.graph.microsoftAuthenticatorAuthenticationMethodConfiguration",
    "id": "MicrosoftAuthenticator",
    "state": "enabled",
    "featureSettings": {
        " displayAppInformationRequiredState ": {
            "state": "enabled",
            "includeTarget": {
                "targetType": "group",
                "id": "1ca44590-e896-4dbe-98ed-b140b1e7a53a"
            },
            "excludeTarget": {
                "targetType": "group",
                "id": " 00000000-0000-0000-0000-000000000000"
            }
        }
    },
    "includeTargets@odata.context": "https://graph.microsoft.com/v1.0/$metadata#authenticationMethodsPolicy/authenticationMethodConfigurations('MicrosoftAuthenticator')/microsoft.graph.microsoftAuthenticatorAuthenticationMethodConfiguration/includeTargets",
    "includeTargets": [
        {
            "targetType": "group",
            "id": "all_users",
            "isRegistrationRequired": false,
            "authenticationMode": "any"
        }
    ]
}
```

### Turn off additional context

To turn off additional context, you'll need to PATCH **displayAppInformationRequiredState** and **displayLocationInformationRequiredState** from **enabled** to **disabled**/**default**. You can also turn off just one of the features.

```json
{
    "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#authenticationMethodConfigurations/$entity",
    "@odata.type": "#microsoft.graph.microsoftAuthenticatorAuthenticationMethodConfiguration",
    "id": "MicrosoftAuthenticator",
    "state": "enabled",
    "featureSettings": {
        "displayAppInformationRequiredState": {
            "state": "disabled",
            "includeTarget": {
                "targetType": "group",
                "id": "44561710-f0cb-4ac9-ab9c-e6c394370823"
            },
            "excludeTarget": {
                "targetType": "group",
                "id": "00000000-0000-0000-0000-000000000000"
            }
        },
        "displayLocationInformationRequiredState": {
            "state": "disabled",
            "includeTarget": {
                "targetType": "group",
                "id": "a229e768-961a-4401-aadb-11d836885c11"
            },
            "excludeTarget": {
                "targetType": "group",
                "id": "00000000-0000-0000-0000-000000000000"
            }
        }
    },
    "includeTargets@odata.context": "https://graph.microsoft.com/v1.0/$metadata#authenticationMethodsPolicy/authenticationMethodConfigurations('MicrosoftAuthenticator')/microsoft.graph.microsoftAuthenticatorAuthenticationMethodConfiguration/includeTargets",
    "includeTargets": [
        {
            "targetType": "group",
            "id": "all_users",
            "isRegistrationRequired": false,
            "authenticationMode": "any",
        }
    ]
}
```

## Enable additional context in the Microsoft Entra admin center

To enable application name or geographic location in the Microsoft Entra admin center, complete the following steps:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least an [Authentication Policy Administrator](../roles/permissions-reference.md#authentication-policy-administrator).
1. Browse to **Protection** > **Authentication methods** > **Microsoft Authenticator**.
1. On the **Basics** tab, click **Yes** and **All users** to enable the policy for everyone, and change **Authentication mode** to **Any**. 
   
   Only users who are enabled for Microsoft Authenticator here can be included in the policy to show the application name or geographic location of the sign-in, or excluded from it. Users who aren't enabled for Microsoft Authenticator can't see application name or geographic location.

   :::image type="content" border="true" source="./media/how-to-mfa-additional-context/enable-settings-additional-context.png" alt-text="Screenshot of how to enable Microsoft Authenticator settings for Any authentication mode.":::

1. On the **Configure** tab, for **Show application name in push and passwordless notifications**, change **Status** to **Enabled**, choose who to include or exclude from the policy, and click **Save**. 

   :::image type="content" border="true" source="./media/how-to-mfa-additional-context/enable-app-name.png" alt-text="Screenshot of how to enable application name.":::

   Then do the same for **Show geographic location in push and passwordless notifications**.

   :::image type="content" border="true" source="./media/how-to-mfa-additional-context/enable-geolocation.png" alt-text="Screenshot of how to enable geographic location.":::

   You can configure application name and geographic location separately. For example, the following policy enables application name and geographic location for all users but excludes the Operations group from seeing geographic location. 

   :::image type="content" border="true" source="./media/how-to-mfa-additional-context/exclude.png" alt-text="Screenshot of how to enable application name and geographic location separately.":::

## Known issues

Additional context isn't supported for Network Policy Server (NPS) or Active Directory Federation Services (AD FS). 

## Next steps

[Authentication methods in Microsoft Entra ID - Microsoft Authenticator app](concept-authentication-authenticator-app.md)
