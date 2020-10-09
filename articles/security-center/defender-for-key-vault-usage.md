---
title: How to respond to Azure Defender for Key Vault alerts
description: Learn about the steps necessary for responding to alerts from Azure Defender for Key Vault.
author: memildin
ms.author: memildin
ms.date: 9/22/2020
ms.topic: how-to
ms.service: security-center
manager: rkarlin

---

# Respond to Azure Defender for Key Vault alerts
When you receive an alert from Azure Defender for Key Vault, we recommend you investigate and respond to the alert as described below. Azure Defender for Key Vault protects applications and credentials, so even if you're familiar with the application or user that triggered the alert, it's important to verify the situation surrounding every alert.  

Every alert from Azure Defender for Key Vault, includes the following elements:

- Object ID
- User Principal Name or IP Address of the suspicious resource

> [!TIP]
> Based on the *type* of access that occurred, some fields may not be available. For example, if your key vault was accessed by an application, you won't see an associated User Principal Name. If the traffic originated from outside of Azure, you won't see an Object ID.

## Step 1. Contact

1. Verify whether the traffic originated from within your Azure tenant. If the key vault firewall is enabled, it's likely that you've provided access to the user or application that triggered this alert.
1. If you can't verify the source of the traffic, continue to [Step 2. Immediate mitigation](#step-2-immediate-mitigation).
1. If you can identify the source of the traffic in your tenant, contact the user or owner of the application. 

> [!CAUTION]
> Azure Defender for Key Vault is designed to help identify suspicious activity caused by stolen credentials. **Don't** dismiss the alert simply because you recognize the user or application. Contact the owner of the application or the user and verify the activity was legitimate. You can create a suppression rule to eliminate noise if necessary. Learn more in [Suppress alerts from Azure Defender](alerts-suppression-rules.md).


## Step 2. Immediate mitigation 
If you don't recognize the user or application, or if you think the access shouldn't have been authorized:

- If the traffic came from an unrecognized IP Address:
    1. Enable the Azure Key Vault firewall as described in [Configure Azure Key Vault firewalls and virtual networks](../key-vault/general/network-security.md).
    1. Configure the firewall with trusted resources and virtual networks.

- If the source of the alert was an unauthorized application or suspicious user:
    1. Open the key vault's access policy settings.
    1. Remove the corresponding security principal, or restrict the operations the security principal can perform.  

- If the source of the alert has an Azure Active Directory role in your tenant:
    1. Contact your administrator.
    1. Determine whether there's a need to reduce or revoke Azure Active Directory permissions.

## Step 3. Identify impact 
When the impact has been mitigated, investigate the secrets in your key vault that were affected:
1. Open the “Security” page on your Azure Key Vault and view the triggered alert.
1. Select the specific alert that was triggered.
    Review the list of the secrets that were accessed and the timestamp.
1. Optionally, if you have key vault diagnostic logs enabled, review the previous operations for the corresponding caller IP, user principal, or object ID.  

## Step 4. Take action 
When you've compiled your list of the secrets, keys, and certificates that were accessed by the suspicious user or application, you should rotate those objects immediately.

1. Affected secrets should be disabled or deleted from your key vault.
1. If the credentials were used for a specific application:
    1. Contact the administrator of the application and ask them to audit their environment for any uses of the compromised credentials since they were compromised.
    1. If the compromised credentials were used, the application owner should identify the information that was accessed and mitigate the impact.


## Next steps

This page explained the process of responding to an alert from Azure Defender for Key Vault. For related information see the following pages:

- [Introduction to Azure Defender for Key Vault](defender-for-key-vault-introduction.md)
- [Suppress alerts from Azure Defender](alerts-suppression-rules.md)
- [Export security alerts](continuous-export.md)