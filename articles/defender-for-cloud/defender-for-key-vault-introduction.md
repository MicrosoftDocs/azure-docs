---
title: Microsoft Defender for Key Vault - the benefits and features
description: Learn about the benefits and features of Microsoft Defender for Key Vault.
ms.date: 11/09/2021
ms.topic: overview
ms.author: dacurwin
author: dcurwin
ms.custom: references_regions
---

# Overview of Microsoft Defender for Key Vault

Azure Key Vault is a cloud service that safeguards encryption keys and secrets like certificates, connection strings, and passwords. 

Enable **Microsoft Defender for Key Vault** for Azure-native, advanced threat protection for Azure Key Vault, providing an additional layer of security intelligence. 

## Availability

|Aspect|Details|
|----|:----|
|Release state:|General availability (GA)|
|Pricing:|**Microsoft Defender for Key Vault** is billed as shown on the [pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/)|
|Clouds:|:::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/no-icon.png"::: National (Azure Government, Microsoft Azure operated by 21Vianet)|


## What are the benefits of Microsoft Defender for Key Vault?

Microsoft Defender for Key Vault detects unusual and potentially harmful attempts to access or exploit Key Vault accounts. This layer of protection helps you address threats even if you're not a security expert, and without the need to manage third-party security monitoring systems.

When anomalous activities occur, Defender for Key Vault shows alerts and optionally sends them via email to relevant members of your organization. These alerts include the details of the suspicious activity and recommendations on how to investigate and remediate threats. 

## Microsoft Defender for Key Vault alerts
When you get an alert from Microsoft Defender for Key Vault, we recommend you investigate and respond to the alert as described in [Respond to Microsoft Defender for Key Vault](defender-for-key-vault-usage.md). Microsoft Defender for Key Vault protects applications and credentials, so even if you're familiar with the application or user that triggered the alert, it's important to check the situation surrounding every alert.

The alerts appear in Key Vault's **Security** page, the Workload protections, and Defender for Cloud's security alerts page.

:::image type="content" source="./media/defender-for-key-vault-intro/key-vault-security-page.png" alt-text="Azure Key Vault's security page":::


> [!TIP]
> You can simulate Microsoft Defender for Key Vault alerts by following the instructions in [Validating Azure Key Vault threat detection in Microsoft Defender for Cloud](https://techcommunity.microsoft.com/t5/azure-security-center/validating-azure-key-vault-threat-detection-in-azure-security/ba-p/1220336).


## Respond to Microsoft Defender for Key Vault alerts
When you receive an alert from [Microsoft Defender for Key Vault](defender-for-key-vault-introduction.md), we recommend you investigate and respond to the alert as described below. Microsoft Defender for Key Vault protects applications and credentials, so even if you're familiar with the application or user that triggered the alert, it's important to verify the situation surrounding every alert.  

Alerts from Microsoft Defender for Key Vault includes these elements:

- Object ID
- User Principal Name or IP address of the suspicious resource 

Depending on the *type* of access that occurred, some fields might not be available. For example, if your key vault was accessed by an application, you won't see an associated User Principal Name. If the traffic originated from outside of Azure, you won't see an Object ID.

> [!TIP]
> Azure virtual machines are assigned Microsoft IPs. This means that an alert might contain a Microsoft IP even though it relates to activity performed from outside of Microsoft. So even if an alert has a Microsoft IP, you should still investigate as described on this page.

### Step 1: Identify the source

1. Verify whether the traffic originated from within your Azure tenant. If the key vault firewall is enabled, it's likely that you've provided access to the user or application that triggered this alert.
1. If you can't verify the source of the traffic, continue to [Step 2. Respond accordingly](#step-2-respond-accordingly).
1. If you can identify the source of the traffic in your tenant, contact the user or owner of the application. 

> [!CAUTION]
> Microsoft Defender for Key Vault is designed to help identify suspicious activity caused by stolen credentials. **Don't** dismiss the alert simply because you recognize the user or application. Contact the owner of the application or the user and verify the activity was legitimate. You can create a suppression rule to eliminate noise if necessary. Learn more in [Suppress security alerts](alerts-suppression-rules.md).


### Step 2: Respond accordingly 
If you don't recognize the user or application, or if you think the access shouldn't have been authorized:

- If the traffic came from an unrecognized IP Address:
    1. Enable the Azure Key Vault firewall as described in [Configure Azure Key Vault firewalls and virtual networks](../key-vault/general/network-security.md).
    1. Configure the firewall with trusted resources and virtual networks.

- If the source of the alert was an unauthorized application or suspicious user:
    1. Open the key vault's access policy settings.
    1. Remove the corresponding security principal, or restrict the operations the security principal can perform.  

- If the source of the alert has a Microsoft Entra role in your tenant:
    1. Contact your administrator.
    1. Determine whether there's a need to reduce or revoke Microsoft Entra permissions.

### Step 3: Measure the impact
When the event has been mitigated, investigate the secrets in your key vault that were affected:
1. Open the **Security** page on your Azure key vault and view the triggered alert.
1. Select the specific alert that was triggered and review the list of the secrets that were accessed and the timestamp.
1. Optionally, if you have key vault diagnostic logs enabled, review the previous operations for the corresponding caller IP, user principal, or object ID.  

### Step 4: Take action 
When you've compiled your list of the secrets, keys, and certificates that were accessed by the suspicious user or application, you should rotate those objects immediately.

1. Affected secrets should be disabled or deleted from your key vault.
1. If the credentials were used for a specific application:
    1. Contact the administrator of the application and ask them to audit their environment for any uses of the compromised credentials since they were compromised.
    1. If the compromised credentials were used, the application owner should identify the information that was accessed and mitigate the impact.

## Next steps

In this article, you learned about Microsoft Defender for Key Vault.

For related material, see the following articles: 

- [Key Vault security alerts](alerts-reference.md#alerts-azurekv)--The Key Vault section of the reference table for all Microsoft Defender for Cloud alerts
- [Continuously export Defender for Cloud data](continuous-export.md)
- [Suppress security alerts](alerts-suppression-rules.md)
