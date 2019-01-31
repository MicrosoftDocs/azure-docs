---
title: Azure AD Password Protection preview operations and reporting
description: Azure AD Password Protection preview post-deployment operations and reporting

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: article
ms.date: 11/02/2018

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: jsimmons
---

# Preview: Azure AD Password Protection operational procedures

|     |
| --- |
| Azure AD Password Protection is a public preview feature of Azure Active Directory. For more information about previews, see  [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/)|
|     |

After you have completed the [installation of Azure AD Password Protection](howto-password-ban-bad-on-premises-deploy.md) on-premises, there are a couple items that must be configured in the Azure portal.

## Configure the custom banned password list

Follow the guidance in the article [Configuring the custom banned password list](howto-password-ban-bad-configure.md) for steps to customize the banned password list for your organization.

## Enable Password Protection

1. Sign in to the [Azure portal](https://portal.azure.com) and browse to **Azure Active Directory**, **Authentication methods**, then **Password Protection (Preview)**.
1. Set **Enable Password Protection on Windows Server Active Directory** to **Yes**
1. As mentioned in the [Deployment guide](howto-password-ban-bad-on-premises-deploy.md#deployment-strategy), it is recommended to initially set the **Mode** to **Audit**
   * After you are comfortable with the feature, you can switch the **Mode** to **Enforced**
1. Click **Save**

![Enabling Azure AD Password Protection components in the Azure portal](./media/howto-password-ban-bad-on-premises-operations/authentication-methods-password-protection-on-prem.png)

## Audit Mode

Audit mode is intended as a way to run the software in a “what if” mode. Each DC agent service evaluates an incoming password according to the currently active policy. If the current policy is configured to be in Audit mode, “bad” passwords result in event log messages but are accepted. This is the only difference between Audit and Enforce mode; all other operations run the same.

> [!NOTE]
> Microsoft recommends that initial deployment and testing always start out in Audit mode. Events in the event log should then be monitored to try to anticipate whether any existing operational processes would be disturbed once Enforce mode is enabled.

## Enforce Mode

Enforce mode is intended as the final configuration. As in Audit mode above, each DC agent service evaluates incoming passwords according to the currently active policy. If Enforce mode is enabled though, a password that is considered unsecure according to the policy is rejected.

When a password is rejected in Enforce mode by the Azure AD Password Protection DC Agent, the visible impact seen by an end user is identical to what they would see if their password was rejected by traditional on-premises password complexity enforcement. For example, a user might see the following traditional error message at the Windows logon\change password screen:

`Unable to update the password. The value provided for the new password does not meet the length, complexity, or history requirements of the domain.`

This message is only one example of several possible outcomes. The specific error message can vary depending on the actual software or scenario that is attempting to set an unsecure password.

Affected end users may need to work with their IT staff to understand the new requirements and be more able to choose secure passwords.

## Enable Mode

This setting should normally be left in its default enabled (Yes) state. Configuring this setting to disabled (No) will cause all deployed Azure AD Password Protection DC agents to go into a quiescent mode where all passwords are accepted as-is, and no validation activities will be executed whatsoever (for example, not even audit events will be emitted).

## Proxy discovery

The `Get-AzureADPasswordProtectionProxy` cmdlet may be used to display basic information about the various proxy services running in a domain or forest. This information is retrieved from the serviceConnectionPoint object(s) registered by the running proxy service(s). An example output of this cmdlet is as follows:

```PowerShell
Get-AzureADPasswordProtectionProxy
ServerFQDN            : bplProxy.bplchild2.bplRootDomain.com
Domain                : bplchild2.bplRootDomain.com
Forest                : bplRootDomain.com
Heartbeat             : 12/25/2018 6:35:02 AM
```

The various properties are updated by each DC agent service on an approximate hourly basis. The data is still subject to Active Directory replication latency.

The scope of the cmdlet’s query may be influenced using either the –Forest or –Domain parameters.

## DC Agent discovery

The `Get-AzureADPasswordProtectionDCAgent` cmdlet may be used to display basic information about the various DC agents running in a domain or forest. This information is retrieved from the serviceConnectionPoint object(s) registered by the running DC agent service(s). An example output of this cmdlet is as follows:

```PowerShell
Get-AzureADPasswordProtectionDCAgent
ServerFQDN            : bplChildDC2.bplchild.bplRootDomain.com
Domain                : bplchild.bplRootDomain.com
Forest                : bplRootDomain.com
PasswordPolicyDateUTC : 2/16/2018 8:35:01 AM
Heartbeat             : 2/16/2018 8:35:02 AM
```

The various properties are updated by each DC agent service on an approximate hourly basis. The data is still subject to Active Directory replication latency.

The scope of the cmdlet’s query may be influenced using either the –Forest or –Domain parameters.

## Next steps

[Monitoring for Azure AD Password Protection](howto-password-ban-bad-on-premises-monitor.md)
