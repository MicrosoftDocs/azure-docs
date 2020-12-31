---
title: Microsoft resources for verifying your security against the SolarWinds attack | Microsoft Docs
description: Learn about how to use resources created by Microsoft specifically to battle against the SolarWinds attack.
services: sentinel
documentationcenter: na
author: batamig
manager: rkarlin
editor: ''

ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/30/2020
ms.author: bagol

---

# After SolarWinds: Apply Microsoft resources to verify your security

This article describes how to use the Microsoft resources created specifically to counteract the SolarWinds attack (Soliargate), with clear action items for you to perform to help ensure your organization's security.

## About the SolarWinds attack and Microsoft's response

In December 2020, [FireEye discovered a nation-state cyber attack on SolarWinds software](https://www.fireeye.com/blog/threat-research/2020/12/evasive-attacker-leverages-solarwinds-supply-chain-compromises-with-sunburst-backdoor.html).

Following this discovery, Microsoft swiftly took the following steps against the attack:

1. **Disclosed a set of complex techniques** used by an advanced actor in the attack, affecting several key customers.

    For more information, see the list of references [below](#references).

1. **Removed the digital certificates used by the Trojaned files,** effectively telling all Windows systems overnight to stop trusting those compromised files. 

1. **Updated Microsoft Windows Defender** to detect and alert if it found a Trojaned file on the system.

1. **Sinkholed one of the domains used by the malware** to command and control affected systems.

1. **Changed Windows Defender's default action for Solarigate from *Alert* to *Quarantine***, effectively killing the malware when found at the risk of crashing the system.

These steps helped to neutralize and then kill the malware and then taking control over the malware infrastructure from the attackers. 

The following sections provide additional instructions for customers to perform system checks using Microsoft software and help ensure continued security:

- [Use an Azure Active Directory workbook to help assess your organization's Solarigate risk.](#azure-active-directory)

-  

> [!IMPORTANT]
> The Solarwinds attack is an ongoing investigation, and our teams continue to act as first responders to these attacks. As new information becomes available, we will make updates through our Microsoft Security Response Center (MSRC) blog at https://aka.ms/solorigate.
> 

## Azure Active Directory

Microsoft has published a specific Azure AD workbook in the Azure administration portal to help you assess your organization's Solorigate risk and investigate any Identity-related indicators of compromise (IOCs) related to the attacks. 

- [Access the Microsoft Azure AD workbook for the Solarigate risk](#access-the-microsoft-azure-ad-workbook-for-the-solarigate-risk)
- [Data shown in the Microsoft Azure AD workbook for the Solarigate risk](#data-shown-in-the-microsoft-azure-ad-workbook-for-the-solarigate-risk)

> [!NOTE]
> The information in this workbook is also available in Azure AD audit and sign-in logs. The workbook helps to collect and visualize the information in a single view.
>
>This workbook includes an overview of some of the common attack patterns in AAD, not only in Solorigate, and can generally be useful as an investigation aid to ensure that your environment is safe from malicious actors.
>

For more information, see [Solarigate indicators of compromise (IOCs)](#solarigate-indicators-of-compromise-iocs).

### Access the Microsoft Azure AD workbook for the Solarigate risk

**Prerequisite**: Your Azure AD sign-in and audit logs must be integrated with Azure Monitor.

Integrating your logs with Azure Monitor enables you to store, query, and visualize your logs using workbooks for up to two years. Only sign-in and audit events created after the integration are stored, so this workbook will not contain any insights prior to the date of integration.

For more information, see [How to integrate activity logs with Log Analytics](/active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics).

**To access the Azure AD workbook for Solarigate**:
 
1. Sign into the [Azure portal](https://portal.azure.com) and navigate to **Azure Active Directory**.

1. Scroll down the menu on the left, and under **Monitoring**, select **Workbooks**.

1. The **Troubleshoot** area, select the **Sensitive Operations Report**. 

### Data shown in the Microsoft Azure AD workbook for the Solarigate risk

In your [workbook](#access-the-microsoft-azure-ad-workbook-for-the-solarigate-risk), expand each of the following areas to learn more about activity detected in your tenant:

|Area  |Description  |
|---------|---------|
|**Modified application and service principal credentials/authentication methods**     |   Helps you detect any new credentials that were added to existing applications and service principals. <br><br>These new credentials allow attackers to authenticate as the target application or service principal, granting them access to all resources where it has permissions. <br><br>This area of the workbook displays the following data for your tenant: <br>- **All new credentials added** to applications and service principals, including the credential type <br>- **A list of the top actors**, and the amount of credential modifications they performed <br>- **A timeline** for all credential changes <br><br>Use filters to drill down to suspicious actors or modified service principals.    <br><br>For more information, see [Apps & service principals in Azure AD - Microsoft identity platform](/active-directory/develop/app-objects-and-service-principals).  |
|**Modified federation settings**     |   Helps you understand changes performed to existing domain federation trusts, which can help an attacker to gain a long-term foothold in the environment by adding an attacker-controlled SAML IDP as a trusted authentication source. <br><br>This area of the workbook displays the following data for your tenant: <br>- Changes performed to existing domain federation trusts <br>- Any addition of new domains and trusts <br><br>**Important**: Any actions that modify or add domain federation trusts are rare and should be treated as high fidelity to be investigated as soon as possible. <br><br>For more information, see [What is federation with Azure AD?](/active-directory/hybrid/whatis-fed)|
|**Azure AD STS refresh token modifications by service principals and applications other than DirectorySync**     |  Lists any manual modifications made to refresh tokens, which are used to validate identification and obtain access tokens. <br><br>**Tip**: While manual modifications to refresh tokens may be legitimate, they have also been generated as a result of malicious token extensions. We recommend checking any new token validation time periods with high values, and investigating whether the change was legitimate or an attacker's attempt to gain persistence. <br><br>For more information, see [Refresh tokens in Azure AD](/azure/active-directory/develop/active-directory-configurable-token-lifetimes#refresh-tokens).  |
|**New permissions granted to service principals**     |  Helps you investigate any suspicious permissions added to an existing application or service principal. <br><br>Attackers may add permissions to existing applications or service principals when they are unable to find one that already has a highly privileged set of permissions they can use to gain access. <br><br>**Tip**: We recommend that administrators investigate any instances of excessively high permissions, included but not limited to: Exchange Online, Microsoft Graph, or Azure AD Graph <br><br>For more information, see [Microsoft identity platform scopes, permissions, and consent](https://docs.microsoft.com/azure/active-directory/develop/v2-permissions-and-consent).       |
|**Directory role and group membership updates for service principals**     |This area of the workbook provides an overview of all changes made to service principal memberships. <br><br>**Tip**: We recommend that you review the information for any additions to highly privileged roles and groups, which is another step an attacker might take in attempting to gain access to an environment.         |
|     |         |

## Microsoft Defender

Microsoft Defender solutions provides the following coverage and visibility to help protect against the Solorigate attack:

- **Microsoft Defender for Endpoint** has comprehensive detection coverage across the Solorigate attack chain. These detections raise alerts that inform security operations teams about activities and artifacts related to the attack.

    Since the attack compromised legitimate software that should not be interrupted, automatic remediation is not enabled. However, the detections provide visibility into the attack activity and can be used to investigate and hunt further.

    For more information, see [Endpoint detection and response (EDR)](#endpoint-detection-and-response-edr).

- **Microsoft 365 Defender** provides visibility *beyond* endpoints, by consolidating threat data from across domains, including identities, data, cloud apps, as well as endpoints. Cross-domain visibility enables Microsoft 365 Defender to correlate signals and comprehensively resolve whole attack chains. 

    Security operations teams can then hunt using rich threat data and gain insights for protecting networks from compromise.

    For more information, see [Endpoint detection and response (EDR)](#endpoint-detection-and-response-edr).

- **Microsoft Defender Antivirus**, the default anti-malware solution on Windows 10, detects and blocks the malicious DLL and its behaviors. It quarantines malware, even if the process is running. Detections include:

    |Dections  |Threat descriptions  |
    |---------|---------|
    |**Detection for backdoored SolarWinds.Orion.Core.BusinessLayer.dll files**     |   [Trojan:MSIL/Solorigate.BR!dha](https://www.microsoft.com/wdsi/threats/malware-encyclopedia-description?Name=Trojan:MSIL/Solorigate.BR!dha)      |
    |**Detection for Cobalt Strike fragments in process memory and stops the process**     | [Trojan:Win32/Solorigate.A!dha](https://www.microsoft.com/wdsi/threats/malware-encyclopedia-description?Name=Trojan:Win32/Solorigate.A!dha&threatId=-2147196107) <br>[Behavior:Win32/Solorigate.A!dha](https://www.microsoft.com/wdsi/threats/malware-encyclopedia-description?Name=Behavior:Win32/Solorigate.A!dha&threatId=-2147196108)       |
    |**Detection for the second-stage payload** <br>A cobalt strike beacon that might connect to `infinitysoftwares[.]com`|  [Trojan:Win64/Solorigate.SA!dha](https://www.microsoft.com/wdsi/threats/malware-encyclopedia-description?Name=Trojan:Win64/Solorigate.SA!dha)      |
    |**Detection for the PowerShell payload** that grabs hashes and SolarWinds passwords from the database along with machine information     |     [Trojan:PowerShell/Solorigate.H!dha](https://www.microsoft.com/wdsi/threats/malware-encyclopedia-description?Name=Trojan:PowerShell/Solorigate.H!dha&threatId=-2147196089)    |
    |     |         |

For more information, see: 

- [Endpoint detection and response (EDR)](#endpoint-detection-and-response-edr)
- [Threat analytics report](#threat-analytics-report)
- [Advanced hunting with Microsoft Defender](#advanced-hunting-with-microsoft-defender)
- [Find SolarWinds Orion software in your enterprise](#find-solarwinds-orion-software-in-your-enterprise)
- [ADFS adapter process spawning](#adfs-adapter-process-spawning)
- [MITRE ATT&CK techniques observed](#mitre-attck-techniques-observed)

### Endpoint detection and response (EDR)

We recommend that you check for the following titles in the Microsoft Defender Security Center and the Microsoft 365 security center:

|Indication  |Titles  |
|---------|---------|
|May indicate threat activity on your network    | **SolarWinds Malicious binaries associated with a supply chain attack** <br><br>**SolarWinds Compromised binaries associated with a supply chain attack** <br><br>**Network traffic to domains associated with a supply chain attack**  |
|May indicate that threat activity has occurred or may occur later.<br><br>These alerts may also be associated with other malicious threats.     |**ADFS private key extraction attempt** <br><br>**Masquerading Active Directory exploration tool**<br><br> **Suspicious mailbox export or access modification** <br><br>**Possible attempt to access ADFS key material** <br><br>**Suspicious ADFS adapter process created**         |
|    |         |

Each alert in Microsoft Defender for Endpoint provides a full description and recommended actions.

### Threat analytics report

Microsoft published a threat analytics report specifically to help investigate after the Solarigate attack, which includes a deep-dive analysis, MITRE techniques, detection details, recommended actions, updated lists of IOCs, and advanced hunting techniques to expand detection coverage.

**All customers**, including both E5 and E3 customers, can access and use the information in the threat report. 

**E5 customers** can also use the threat analytics report to view their own organization's state in connection with the Solarigate attack, and perform the following tasks:

- Monitor related incidents and alerts
- Handle impacted assets
- Track mitigations and their status, with options to investigate further and remediate weaknesses using threat and vulnerability management. 

For example:

:::image type="content" source="media/solarwinds/Threat-analytics-solorigate.jpg" alt-text="Threat analytics report in the Microsoft Defender Security Center":::

For more information, see: 

- [Understand the analyst report in threat analytics](/windows/security/threat-protection/microsoft-defender-atp/threat-analytics-analyst-reports)
- [Threat analytics for Microsoft 365 security](https://security.microsoft.com/threatanalytics3/2b74f636-146e-48dd-94f6-5cb5132467ca/overview)
- [Threat overview - Microsoft Defender for Endpoint](https://securitycenter.microsoft.com/threatanalytics3/2b74f636-146e-48dd-94f6-5cb5132467ca/overview)

### Advanced hunting with Microsoft Defender

Microsoft 365 Defender and Microsoft Defender for Endpoint customers can run the following advanced hunting queries to hunt for similar TTPs used in this attack:

- [Malicious DLLs loaded into memory](#malicious-dlls-loaded-into-memory)
- [Malicious DLLs created in the system or locally](#malicious-dlls-created-in-the-system-or-locally)
- [SolarWinds processes launching PowerShell with Base64](#solarwinds-processes-launching-powershell-with-base64)
- [SolarWinds processes launching CMD with echo](#solarwinds-processes-launching-cmd-with-echo)
- [C2 communications](#c2-communications)

#### Malicious DLLs loaded into memory

To locate the presence or distribution of malicious DLLs loaded into memory, [run the following query](https://securitycenter.windows.com/hunting?query=H4sIAAAAAAAEAE2XzQ7sNAyFs0biHa7uCiQWadL8LZFAAokdT5A0DdwFXAkQbHh4nM_uMBp1pm0S2zk-Ps585273t_vkLvn90f3muvtF7n5yn-Vuuu9l7Ha_u7_cn-6D-9J94f6V33_cr_L2D7k-uJ_dD-5bd8jdJ5n3wX3lPrrisnxO512Sq7oh47e8LfLc5C7JWOX5EC_JRXvf5Zo8RVmzWHVLZB_dN3JNeY5ib8jdtrQ9JBkN8hvls8RmFRuXzIn422-bzFmypsvqInNvecpEqFYPViyZeVis6jcy58LmjnbbGLI-ifeL6E88L_neMXR8PbHezNz-olgJYjnLuyafJe87cev7yP1emey72Pz9W_FZzWqW1VM-Vd4NGb_Y1SXXkhU3Ngv7TzK-PW_MTuwn9r_tphfCajWw405ce1eHfKbMPNirZ6yTidPWVr53fvdok0tz4dmvWh3idWDzBLFBdF7ug_x2spJZvSOrhuNiN0PWDL5vcrvRfrKV8aORDVkd5NqIePi6x_f9AusIFgEfJ9Yned3IbozLi1mV2VXmbbQnVvauh0SgbNiYLJiQ5HnAt0Lu9sxGvgdxNbOq3JsyuvNwwrELT09MaqGCeYSbHdZOq5SBtb3TJnPU6gUnCnhV8PasU4buCE84kfE42fEie4NZlSwoE3bNPRx4omi2021ryQrNqY5FYps8L7BqoF3gVoTNmew-VjfuWWztGCtVcpOHm5Wbq5HsX3Kv-ZuwalEpHS5eeNw5f6xuTHVvg0g91g6qp1OJB_hsmxrjoLZ2rCf6k8hFgZX_V-zBngocGWhRA7ELD1rfjfg8czSXO-oA7nt-t4yo1cVoQks8fFpYUyVRP5VVk5wltHLBlQWyASVTBu5YvxaN_Sza-yhvQAnf1Tfy7oA_FYZ6ailg68TLZuSNJm2NO8nB3s9tvJz8emo1oCrT6uE0nG5wbNSrZzyDaHnxVBV_ksMMkwoYdfjbiaeT6_nS0cN8FKI4iPAmwkAlTusQuidPTJWIDlhVqaf5UvfHWzJlb4w2U0fldyKaTPyTPVciiLwf9JWG5YKtiO5War4aRoU4VZEXmK03hd21p95UETcnM4qU4G2BxQGGdbwm0GrYG3x7Lk_-TubvHqe1l0BLu4VnteJ7wcRpUXTT1mCcu19KoLM92b9h4IVuV1C-rP5VZya6n9HlgWZm8A62n0k2NIeP-h7caxTaMTx4dupi8HuA4-ITqMJCbRWsTdYcxBLY7WUafbH7br0rMl7I1wkfGpo4WB3fVNRj8cRHpCKi-Uvo3039LdOMhV19Hqigcvokf5oFz24atXTDMe3-nbXap1XhywuLhbdCLqZpWiZzlfyqtmU7vzQwT6hopCdoBx6vU08Gha26jT1pP0_UUcd2gh0JZB52aie9qZYIut7i1S6vyHX8NOvZt0UdiSoYDyaR3RbXQgW00gYVtq0qnzI-jxc7lX_RunuioiMRqcKcMGuASICFjy4-3WmBi0eXOoqR7fmmdhRfVZlJZJkaXm89O5DdEwxvbEyr1GrnNtWmQe-57MSZQLBbpzis4w5yFfHeYMhBfaseelipfT4Rc3yr1Aj_Bva0V2vffphwma3CvADWJ-jrqe0gxhPGLTsTVfI0resNY2_ihKh9W09hTxQNNKZV3UStD8vqwwbtlsn6xYntaZqovPOmbZ4a0j7wKGUwfydRLJis_WbX5oOFKrpHYTJYBXDQk0hnX82y6MnaoFsW6x16hjzYQTVF1ZP3MCs3kTbQ015esLY9PafZar3iYvfKm8KuFkhqB59wJ7OPBmqqTXpeV96drAh0Fu2xep9NfwYM0v8di7zkl2pd5DG8VLahcTu7l3WZC72YpuKnxR1hWqc7-df5--RzmTqexkhP1Rx2IlGVrFTLc6ZZ2J_sVpkc0Kli1RTAJ8PPZXOUsXrCjm-9JZteTztBXPZPrdjZVnei_7cqu91noP8A9D6a0LYOAAA&runQuery=true&timeRangeId=week):

```Kusto
DeviceImageLoadEvents | where SHA1 in (“d130bd75645c2433f88ac03e73395fba172ef676″,”1acf3108bf1e376c8848fbb25dc87424f2c2a39c”,”e257236206e99f5a5c62035c9c59c57206728b28″,”6fdd82b7ca1c1f0ec67c05b36d14c9517065353b”,”2f1a5a7411d015d01aaee4535835400191645023″,”bcb5a4dcbc60d26a5f619518f2cfc1b4bb4e4387″,”16505d0b929d80ad1680f993c02954cfd3772207″,”d8938528d68aabe1e31df485eb3f75c8a925b5d9″,”395da6d4f3c890295f7584132ea73d759bd9d094″,”c8b7f28230ea8fbf441c64fdd3feeba88607069e”,”2841391dfbffa02341333dd34f5298071730366a”,”2546b0e82aecfe987c318c7ad1d00f9fa11cd305″,”e2152737bed988c0939c900037890d1244d9a30e”) or SHA256 in (“ce77d116a074dab7a22a0fd4f2c1ab475f16eec42e1ded3c0b0aa8211fe858d6″,”dab758bf98d9b36fa057a66cd0284737abf89857b73ca89280267ee7caf62f3b”,”eb6fab5a2964c5817fb239a7a5079cabca0a00464fb3e07155f28b0a57a2c0ed”,”ac1b2b89e60707a20e9eb1ca480bc3410ead40643b386d624c5d21b47c02917c”,”019085a76ba7126fff22770d71bd901c325fc68ac55aa743327984e89f4b0134″,”c09040d35630d75dfef0f804f320f8b3d16a481071076918e9b236a321c1ea77″,”0f5d7e6dfdd62c83eb096ba193b5ae394001bac036745495674156ead6557589″,”e0b9eda35f01c1540134aba9195e7e6393286dde3e001fce36fb661cc346b91d”,”20e35055113dac104d2bb02d4e7e33413fae0e5a426e0eea0dfd2c1dce692fd9″,”2b3445e42d64c85a5475bdbc88a50ba8c013febb53ea97119a11604b7595e53d”,”a3efbc07068606ba1c19a7ef21f4de15d15b41ef680832d7bcba485143668f2d”,”92bd1c3d2a11fc4aba2735d9547bd0261560fb20f36a0e7ca2f2d451f1b62690″,”a58d02465e26bdd3a839fd90e4b317eece431d28cab203bbdde569e11247d9e2″,”cc082d21b9e880ceb6c96db1c48a0375aaf06a5f444cb0144b70e01dc69048e6″)
```

#### Malicious DLLs created in the system or locally

To locate the presence or distribution of malicious DLLs created locally or elsewhere in the system, [run the following query](https://securitycenter.windows.com/hunting?query=H4sIAAAAAAAEAE2Xy87tNAyFO0biHX6dEUgM0twzRALEnCdImkYc6QgkQDDh4XE-u5utqru3xHaWl5ezfzju4-_j83HJ9Se5fpHrj_LmPn47_jr-PD6Or4-vjn_l-s_xq7z9Q86P45fj5-P745S7zzLu4_jm-HSUI8sRD3ckOesx5Pstb4s8N7lL8q3yfB5dnoK973JOnoLMWcy6JZ5Px3dyTnkOYm_I3ba0PST56uUa5Fhis4qNS8YE_O23TcYsmdNldpGxtzxlIlSrJzOWjDwtVvUbGHNhc0e7bQyZn8T7RfQRz0t-dwwdX0-sNyO3vyBWvFjO8q7JseR9J259H7jfM5P9Fhu_rxWf1axmmT3lqPJuyPeLVV1yLplxY7Ow_iTft-eNWcR-Yv3bbnohrFY9K-7EtVd1yjFl5MlaHd86mYg2t_K787u_Njk1F471qtUhXgc2I4gNonNy7-XayUpm9o6sGo6L1QyZM_i9ye1G-8lWxo9GNmS2l3Mj4sTm5Pu-X2AdwMLjI2J9kteN7Ma4vJhVGV1l3EZ7YmWvekgEyoaNyYIJSZ4HfCvkbo9s5HsQVzOryr0pX3ceIhy78PTEpBYqmAe42WHttEoZWNsrbTJGrV5wooBXBW_HPGXojjDCiYzHyYoX2RuMqmRBmbBr7uHAE0WzlW5bS2ZoTvVbILbJ8wKrBtoFbgXYnMnuY3XjnsXWjrFSJTd5uJm5uRrI_iX3mr8JqxaV0uHihced88fqxlTXNojUYe2kejqVeILPtqkxDmprxxrRn0QuCqz8v2JP1lTgyECLGohdeND6bsTnGKO53FF7cN_ju2VErS6-JrTEwaeFNVUS9VOZNclZQisXXFkg61EyZeCO9VvR2N9Fex_l9Sjhu_oG3p3wp8JQRy15bEW8bEbeaNLWuEgO9npu4-Xk6qhVj6pMq4doON3g2KhXx_cMouXFU1X8SQ4zTCpg1OFvJ55OrudLR0_zUYjiJMKbCD2VOK1D6JocMVUiOmFVpZ7mS90fb8mUvfG1mToqvxPRZOKfrLkSQeD9oK80LBdsBXS3UvPVMCrEqYq8wGy9KeyuPfWmirg5mVGkBG8LLPYwrOM1gVbD3uDXcTryFxm_e5zWXgIt7RaO2YrvBROnRdFNW71x7n4pgY52ZP-GgRe6XUH5svpXnZnofkaXB5qZwdvbeibZ0Bw-6ntyr1Fox3Dg2amLwfUEx8XhqcJCbRWsTeacxOJZ7WUafbH6br0r8L2QrwgfGpo4mB3eVNRhMeIjUBHB_CX076b-lmnGwq4-D1RQOR3Jn2bBsZpGLd1wTLt_Z672aVX48sJi4a2Qi2malslcJb-qbdn2Lw3MEyoa6Anagcdr15NBYatuY03azxN11LGdYEcCmYed2klvqiWArrN4tcsrch0_zXr2bVEHovLGg0lkt8W1UAGttEGFbavKp4zP88VO5V-w7p6o6EBEqjARZg0Q8bDw0cWnOy1wcehSRzGyPd_UjuKrKjOJLFPD661ne7IbwfDGxrRKrbZvU20a9J7LdpwJBLt1itM67iBXAe8NhpzUt-qhg5Xa5xMxh7dKDfBvYE97tfbthwmX2SqM82AdQV93bScxRhi3bE9UydO0rjeMvYkdovZt3YU9UTTQmFZ1E7U-LasPG7RbJusXEdvTNFF550zbHDWkfeBRSm_-IlEsmKz9Ztfmg4UqukNhMlh5cNCdSGddzbLoyNqgWxbrHbqHPFlBNUXVnfcwKzeRNtDTXl6wtj09u9lqveJi9cqbwqoWSGoHn3Ans44GaqpNul9X3kVmeDqL9li9z6Y_Awbp_45FXvJLtS7y6F8q29C4nd3LusyFXkxT8WhxB5jW6U7utf-OHJepYzRGOqrmtB2JqmSlWp49zcL-ZLXKZI9OFasmDz4Zfi4bo4zVHXZ46y3Z9HraDuKyf2rF9ra6Ev2_VVnt3gP9B3GMOb2sDgAA&runQuery=true&timeRangeId=week):

```Kusto
DeviceFileEvents | where SHA1 in (“d130bd75645c2433f88ac03e73395fba172ef676″,”1acf3108bf1e376c8848fbb25dc87424f2c2a39c”,”e257236206e99f5a5c62035c9c59c57206728b28″,”6fdd82b7ca1c1f0ec67c05b36d14c9517065353b”,”2f1a5a7411d015d01aaee4535835400191645023″,”bcb5a4dcbc60d26a5f619518f2cfc1b4bb4e4387″,”16505d0b929d80ad1680f993c02954cfd3772207″,”d8938528d68aabe1e31df485eb3f75c8a925b5d9″,”395da6d4f3c890295f7584132ea73d759bd9d094″,”c8b7f28230ea8fbf441c64fdd3feeba88607069e”,”2841391dfbffa02341333dd34f5298071730366a”,”2546b0e82aecfe987c318c7ad1d00f9fa11cd305″,”e2152737bed988c0939c900037890d1244d9a30e”) or SHA256 in (“ce77d116a074dab7a22a0fd4f2c1ab475f16eec42e1ded3c0b0aa8211fe858d6″,”dab758bf98d9b36fa057a66cd0284737abf89857b73ca89280267ee7caf62f3b”,”eb6fab5a2964c5817fb239a7a5079cabca0a00464fb3e07155f28b0a57a2c0ed”,”ac1b2b89e60707a20e9eb1ca480bc3410ead40643b386d624c5d21b47c02917c”,”019085a76ba7126fff22770d71bd901c325fc68ac55aa743327984e89f4b0134″,”c09040d35630d75dfef0f804f320f8b3d16a481071076918e9b236a321c1ea77″,”0f5d7e6dfdd62c83eb096ba193b5ae394001bac036745495674156ead6557589″,”e0b9eda35f01c1540134aba9195e7e6393286dde3e001fce36fb661cc346b91d”,”20e35055113dac104d2bb02d4e7e33413fae0e5a426e0eea0dfd2c1dce692fd9″,”2b3445e42d64c85a5475bdbc88a50ba8c013febb53ea97119a11604b7595e53d”,”a3efbc07068606ba1c19a7ef21f4de15d15b41ef680832d7bcba485143668f2d”,”92bd1c3d2a11fc4aba2735d9547bd0261560fb20f36a0e7ca2f2d451f1b62690″,”a58d02465e26bdd3a839fd90e4b317eece431d28cab203bbdde569e11247d9e2″,”cc082d21b9e880ceb6c96db1c48a0375aaf06a5f444cb0144b70e01dc69048e6″)
```

#### SolarWinds processes launching PowerShell with Base64

To locate SolarWinds processes that are spawning suspected Base64-encoded PowerShell commands, [run the following query](https://securitycenter.windows.com/hunting?query=H4sIAAAAAAAEAK1TXUsCQRQ9z0H_YfHF3VKzkqAHoW8KJIIegkpEdxeVdlV2TO3zt3fu3VHcsloohpm5d-ac-zlzghAT9OFzv0KCoUqG45TnIQYYU17HGl7hYIoezxJOBxe86_O2j7auA3Q_WTjjaUT5kohYOXW8cy3gmqiIpwlulBkQXcERHrmLnvIbRDypv3PiDb1UqM04Cysj-t7fiPyp4oziI46srS0OhznP6CUh3-fuoEPJELOHGjWphk9LAaWAulFsmnnJ3hvmkEYzITfibfDFTqTILtm9RR6heg61Fll8y97No0p91xec-bmLIucdDlHGLc_KeEaV6z42mVsTL9ihXsIbMXXVRdul7pEp8W_rmu3hMeWYo62RNWx3vD_FLTXqZKrn_sqUyKq6upaZVvF3pkeO9Lam0oaV8sQvfV7ut8QuvR3p25UKuThg7e4ZWVrBot2lXg-8b_2Y5bL9FnFD_RGJvvo8eXk2D3m7q_7DgBYFGzPicU6bju10nl7G-vN99WhsbbqKlErMX2KT8n9aTd-0WP0AdbkD_LwEAAA&runQuery=true&timeRangeId=month): 

```Kusto
DeviceProcessEvents| where InitiatingProcessFileName =~ “SolarWinds.BusinessLayerHost.exe”| where FileName =~ “powershell.exe”// Extract base64 encoded string, ensure valid base64 length| extend base64_extracted = extract(‘([A-Za-z0-9+/]{20,}[=]{0,3})’, 1, ProcessCommandLine)| extend base64_extracted = substring(base64_extracted, 0, (strlen(base64_extracted) / 4) * 4)| extend base64_decoded = replace(@’\0′, ”, make_string(base64_decode_toarray(base64_extracted)))//| where notempty(base64_extracted) and base64_extracted matches regex ‘[A-Z]’ and base64_extracted matches regex ‘[0-9]’
```

#### SolarWinds processes launching CMD with echo

To locate SolarWinds processes launching CMD with echo, [run the following query](https://securitycenter.windows.com/hunting?query=H4sIAAAAAAAEAG2OSwrCQBBEay14h2EOkBtk4w-FIIIL1yEZzEASIfEL4tl9M3EhITT9requXsnpLq-CfFCnS6x6bM3cqdWVeq6Z3jJ6qGLW4UY7MA_qlcfY6jy6sGFaU-9hNHEn1YdodYRVM-10ipsl7EQL3cihH_YzGK-ot4Xfo5LQPXE7-dGUXhr1Cvryb9vACKpm9PGSusEGNPv9YtDIQcMlB7eCZfUF5AwwqToBAAA&runQuery=true&timeRangeId=month):

```Kusto
DeviceProcessEvents| where InitiatingProcessFileName =~ “SolarWinds.BusinessLayerHost.exe”| where FileName == “cmd.exe” and ProcessCommandLine has “echo”
```

#### C2 communications

To locate DNS lookups to a malicious actor’s domain, [run the following query](https://securitycenter.windows.com/hunting?query=H4sIAAAAAAAEAGWOSwrCQBQEay14hyEH0BO4EKJLwc8FghkwEI2YZCTg4S1noQtpHt00Bf1KIomGs74xRW4M9MyZ8SLw5GL38AJrqUG2kzkxcc_tSgUKStuePWPmJw56L9PlPkoElqpkx9H8I8Mf-1mvzHVerVXzXa5o2ZqjXksHP6yyFyxMyZy4-msrP8oUvAEb21tt5gAAAA&runQuery=true&timeRangeId=month):

```kusto
DeviceEvents| where ActionType == “DnsQueryResponse” //DNS Query Responseand AdditionalFields has “.avsvmcloud”
```

<!-- repeated description? what does the following query do?-->
To locate DNS lookups to a malicious actor’s domain, [run the following query](https://securitycenter.windows.com/hunting?query=H4sIAAAAAAAEALWQPQ6CQBCFX23iHZDGjhvYqYmNMSYegCA_G4E1gEDh4f12KgtLCZmd3TfvZ5e9co1yyuhnatAkr04PHcBztSC9Iq210ps-qQLtqEhX1gb2QL-B1WAZ56BJ8WxNuWU_shvhZnC8XrorMWbD9JfzCa3DxaEdzKnUhZm3e_Z8R9Da7pziEjQb7VhjGJUxA5pQMxX_PaVhmvOOctEUZ85P-2vdokkFk-BSwJ4XzPG8JvikXxkfdzmn1oQCAAA&runQuery=true&timeRangeId=month):

```kusto
DeviceNetworkEvents| where RemoteUrl contains ‘avsvmcloud.com’| where InitiatingProcessFileName != “chrome.exe”| where InitiatingProcessFileName != “msedge.exe”| where InitiatingProcessFileName != “iexplore.exe”| where InitiatingProcessFileName != “firefox.exe”| where InitiatingProcessFileName != “opera.exe”
```

### Find SolarWinds Orion software in your enterprise

To search for Threat and Vulnerability Management data and find SolarWinds Orion software, [run the following query](https://securitycenter.windows.com/hunting?query=H4sIAAAAAAAEAI2QywrCMBBF71rwH7pTP8JdN27cKN1KH5EKfUATLYof78lAsYiChGQmd2ZOJpPK6aaLSuwRr9VBvc4KGpVrQN2pQ3ecgciguzJd1XB33HIVVDfswHbySrTUQk_sqNpyHP4nNTNiZcREW1aiFdU9rJgxQotxj_oPb49tLeJRoxbwRuurNnZ86cLZzYien7Ss3GIPq6-YRY8e_7tWOpvP9MaGrII5_O7ize-tkyl_zj59ZcecOMVSL39fnZCaAQAA&runQuery=true&timeRangeId=month): 

```kusto
DeviceTvmSoftwareInventoryVulnerabilities| where SoftwareVendor == ‘solarwinds’| where SoftwareName startswith ‘orion’| summarize dcount(DeviceName) by SoftwareName| sort by dcount_DeviceName desc
```

Data returned will be organized by product name and sorted by the number of devices the software is installed on.

### ADFS adapter process spawning

<!--why no description in source?-->
Use the following process to track ADFS adapter process spawning:

```kusto
DeviceProcessEvents| where InitiatingProcessFileName =~”Microsoft.IdentityServer.ServiceHost.exe”| where FileName in~(“werfault.exe”, “csc.exe”)| where ProcessCommandLine !contains (“nameId”)
```
 

### MITRE ATT&CK techniques observed

This threat makes use of the following attacker techniques documented in the [MITRE ATT&CK framework](https://attack.mitre.org/).

|Technique  |Reference  |
|---------|---------|
|**Initial Access**     |  T1195.001 Supply Chain Compromise       |
|**Execution**     |  T1072 Software Deployment Tools       |
|**Command and Control**     |  T1071.004 Application Layer Protocol: DNS <br><br>T1017.001 Application Layer Protocol: Web Protocols <br><br>T1568.002 Dynamic Resolution: Domain Generation Algorithms <br><br>T1132 Data Encoding       |
|**Persistence**     |    T1078 Valid Accounts      |
|**Defense Evasion**     |   T1480.001 Execution Guardrails: Environmental Keying <br><br>T1562.001 Impair Defenses: Disable or Modify Tools      |
|**Collection**     |  T1005 Data From Local System        |
|     |         |


## Azure Defender for IoT

## Azure Sentinel



## Microsoft 365

## Solarigate indicators of compromise (IOCs)

This section provides details about anomalies found by Microsoft in affected tenants that may indicate attacker activity, what to look for in your tenants, and how to mitigate the risks exposed by these anomalies.

> [!IMPORTANT]
> Although the steps taken by Microsoft detailed above have neutralized and killed the malware wherever found, we recommend that you perform your own checks for added security.
>
> We also recommend also reviewing the relevant IOCs listed by FireEye on the [FireEye Threat Research blog](https://www.fireeye.com/blog/threat-research/2020/12/evasive-attacker-leverages-solarwinds-supply-chain-compromises-with-sunburst-backdoor.html).
> 

Anomalies found generally included the following types:

- [Anomalies in Microsoft 365 API access patterns](#anomalies-in-microsoft-365-api-access-patterns)
- [Anomalies in SAML tokens being presented for access](#anomalies-in-saml-tokens-being-presented-for-access)

The following sections detail how specific attack patterns that might use these anomalies, and what to verify in your tenants to ensure your organization's security. 

- [Forged SAML tokens](#forged-saml-tokens)
- [Illegitimate SAML trust relationship registrations](#illegitimate-saml-trust-relationship-registrations)
- [Added credentials to existing applications](#added-credentials-to-existing-applications)

### Anomalies in SAML tokens being presented for access

In some impacted tenants, Microsoft detected anomalous SAML tokens presented for access to the Microsoft Cloud, which were signed by customer certificates. 

The anomalies indicate tha the customer SAML token-signing certificates may have been compromised, and that an attacker could be forging SAML tokens to access any resources that trust those certificates.

Compromising a SAML token-signing certificate usually requires admin access, and the presence of a forged SAML token usually indicates that the customer's on-premises infrastructure may be compromised. 

> [!NOTE]
> Since the signing certificate is the *root* of trust for the federated trust relationship, service principals would not easily detect these forgeries.         
> 

### Anomalies in Microsoft 365 API access patterns

In some impacted tenants, Microsoft detected anomalous API access patters, originating from existing applications and service principals. 

Anomalous API access patterns indicate that attackers with administrative credentials have added their own credentials to existing applications and service principals. 

Microsoft 365 APIs can be used to access email, documents, chats, configuration settings (such as email forwarding), and more.  

Since you must have a highly privileged Azure Active Directory (AAD) administrative account to add credentials to service principals, changes at this level can imply that one or more such privileged accounts have been compromised. There may be additional significant changes made in any impacted tenant.       


### Forged SAML tokens

- [Anomalies found that indicate forged SAML tokens](#anomalies-found-that-indicate-forged-saml-tokens)
- [How these anomalies indicate forged SAML tokens](#how-these-anomalies-indicate-forged-saml-tokens)
- [How to look for forged SAML tokens in your system](#how-to-look-for-forged-saml-tokens-in-your-system)
- [What to do if you've found forged SAML tokens](#what-to-do-if-youve-found-forged-saml-tokens)

#### Anomalies found that indicate forged SAML tokens

Anomalous tokens found included the following types:

- Tokens with an expiration of *exactly* **3600 seconds** or **144000 seconds**, with no millisecond values. 

    **144000** = **40 hours,** and is considered to be exceptionally long for a token expiration.
- Tokens that were received at the same time as the issuance time, without any delay between creation and usage
- Tokens that were received *before* the time they were issued. These tokens indicate a falsified issuance time after the token was received.
- Tokens that were used from outside typical user locations.
- Tokens that contained claims not previously seen by the tenant’s federation server.
- Tokens that indicated that MFA was used when the token claimed to authenticate from within the corporate estate, where MFA is not required.

> [!NOTE]
> Microsoft generally retains token logs only for 30 days, and never logs complete token. For this reason, Microsoft cannot see every aspect of an SAML  token. Customers who want longer retention can configure additional storage in Azure monitor or other systems. 
>
> The token anomalies detected were anomalous in lifetime, usage location, or claims (particularly MFA claims). The anomalies were sufficiently convincing as forgeries. These patterns were not found in all cases.

#### How these anomalies indicate forged SAML tokens

The token anomalies found in these cases may indicate any of the following scenarios:

- **The SAML token-signing certificate was exfiltrated** from the customer environment, and used to forge tokens by the actor.

- **Administrative access to the SAML Token Signing Certificate storage had been compromised**, either via a service administrative access, or by direct device storage / memory inspection.

- **The customer environment was deeply penetrated**, with administrative access to identity infrastructure, or the hardware environment running the identity infrastructure.

####  How to look for forged SAML tokens in your system

To search for forged SAML tokens in your system, look for the following indications:

- SAML tokens received by the service principal with configurations that deviate from the IDP’s configured behavior.

- SAML tokens received by the service principal without corresponding issuing logs at the IDP.

- SAML tokens received by the service principal with MFA claims,  but without corresponding MFA activity logs at the IDP.

- SAML tokens that are received from IP addresses, agents, times, or for services that are anomalous for the requesting identity represented in the token.

- Other evidence of unauthorized administrative activity.

#### What to do if you've found forged SAML tokens

If you think that you've found forged SAML tokens, perform the following steps:

- Determine how the certificates were exfiltrated, and remediate as needed.

- Roll all SAML token signing certificates.

- Where possible, consider reducing your reliance on on-premises SAML trust relationships.

- Consider using a Hardware Security Model (HSM) to manage your SAML Token Signing Certificates.

### Illegitimate SAML trust relationship registrations

In some cases, the SAML token forgeries correspond to service principal configuration changes. 

Actors can change SAML service principal configurations, such as Azure AD, telling the service principal to trust their certificate. In effect, in our case, the actor has told Azure AD, "Here is another SAML IDP that you should trust. Validate it with this public key." This additional trust is illegitimate.

For more information, see:

- [Types of illegitimate SAML trust relationship registrations found](#types-of-illegitimate-saml-trust-relationship-registrations-found)
- [Implications of illegitimate SAML trust relationship registrations](#implications-of-illegitimate-saml-trust-relationship-registrations)
- [How to look for illegitimate SAML trust relationship registrations in your system](#how-to-look-for-illegitimate-saml-trust-relationship-registrations-in-your-system)
- [What to do if you've found illegitimate SAML trust relationship registrations](#what-to-do-if-youve-found-illegitimate-saml-trust-relationship-registrations)

#### Types of illegitimate SAML trust relationship registrations found

Microsoft found the following types of illegitimate SAML trust relationship registrations on affected tenants:

- **The addition of federation trust relationships at the service principal**, which later resulted in SAML authentications of users with administrative privileges. 

    The actor took care to follow existing naming conventions for server names, or copy existing server names. For example, if a server named **GOV_SERVER01** already existed, they created a new one named **GOV_SERVERO1**.

    The impersonated users later took actions consistent with attacker patterns described below. see <x>.

- **Token forgeries** consistent with the [patterns described above](#forged-saml-tokens). 

Calls generally came from different IP addresses for each call and impersonated user, but generally tracked back to anonymous VPN servers.

#### Implications of illegitimate SAML trust relationship registrations 

Registering illegitimate SAML trust relationships provided administrative access to Azure AD. 

This may mean that the actors had been unable to gain access to on-premises resources, or was experimenting with other persistence mechanisms.

Additionally, this may mean that the actor may have been unable to exfiltrate tokens, possibly due to use of HSM.

#### How to look for illegitimate SAML trust relationship registrations in your system

Look for any anomalous administrative sessions that are associated with modifications to federation trust relationships.

#### What to do if you've found illegitimate SAML trust relationship registrations

If you think you've found an illegitimate SAML trust relationship registration, we recommend that you perform the following steps to secure your environment:

- Review all federation trust relationships to ensure that they are all valid.
- Determine how the administrative account was impersonated. For more information, see [below](#queries-that-impersonate-existing-applications).
- Roll back any illegitimate administrative account credentials.

### Added credentials to existing applications

Once an actor has been able to impersonate a privileged Azure AD administrator, they added credentials to existing applications or service principals, usually with the permissions that they wanted already associated and high traffic patterns, such as for mail archive applications.

In some cases, Microsoft found that the actor had added permissions for a new application or service principal for a short while, and used those permissions as another layer of indirection.

For more information, see:

- [Types of added credentials found](#types-of-added-credentials-found)
- [Implications of added credentials to existing applications](#implications-of-added-credentials-to-existing-applications)
- [How to find added credentials in your system](#how-to-find-added-credentials-in-your-system)
- [What to do if you've found added credentials in your system](#what-to-do-if-youve-found-added-credentials-in-your-system)

#### Types of added credentials found

Microsoft found the following types of added credentials in affected tenants:

- The addition of federation trust relationships at the service principal, resulting in SAML user authentications with administrative privileges. 

    The impersonated users later took actions consistent with attacker patterns described below.

- Service principals added into well-known administrative roles, such as **Tenant Admin** or **Cloud Application Admin**.

- Reconnaissance to identify existing applications that have application roles with permissions to call Microsoft Graph.

- Token forgeries consistent with the patterns described [above](#forged-saml-tokens)

The impersonated applications or service principals were different across different customers, and the actor did not have a default type of target. Impersonated applications and service principals included both customer-developed and vendor-developed software. 

Additionally, no Microsoft 365 applications or service principals were used when impersonated. Customer credentials cannot be added to these applications and service principals.

#### Implications of added credentials to existing applications

The addition of credentials to existing applications enabled the actor gain access to Azure AD. 

The actor performed extensive reconnaissance to find unique applications that could be used to obfuscate their activity.

#### How to find added credentials in your system

Search for the following indications:

- Anomalous administrative sessions associated with modified  federation trust relationships.

- Unexpected service principals added to privileged roles in cloud environments.

#### What to do if you've found added credentials in your system

If you think you've found added credentials the applications in your system, we recommend that you perform the following steps:

- Review all applications and service principals for credential modification activity.

- Review all applications and service principals for excess permissions.

- Remove all inactive service principals from your environment.

- Regularly roll credentials for all applications and service principals.

### Queries that impersonate existing applications

Once credentials were added to existing applications or service principals, the actor proceeded to acquire an OAUTH access token for the application using the forged credentials, and call APIs with the assigned permissions.

Most of the relevant API calls found on affected tenants were focused on email and document extraction, although some API calls also added users, or added permissions for other applications or service principals. 

Calls were generally very targeted, synchronizing, and then monitoring emails for specific users.

For more information, see:

- [Types of impersonating queries found](#types-of-impersonating-queries-found)
- [Implications of impersonating queries](#implications-of-impersonating-queries)
- [How to look for impersonating queries in your system](#how-to-look-for-impersonating-queries-in-your-system)
- [What to do if you find impersonating queries in your system](#what-to-do-if-you-find-impersonating-queries-in-your-system)

#### Types of impersonating queries found

The following types of impersonating queries were found on affected tenants:

- Application calls attempting to authenticate to Microsoft Graph resources with the following **applicationID**: `00000003-0000-0000-c000-000000000000`

- Impersonated calls to the Microsoft Graph **Mail.Read** and **Mail.ReadWrite** endpoints.

- Impersonating calls from anomalous endpoints. These endpoints were not repeated from customer to customer, and were usually Virtual Private Server (VPS) vendors.

#### Implications of impersonating queries

The actor used impersonating queries primarily to obfuscate their persistence and reconnaissance activities.

#### How to look for impersonating queries in your system

Search for the following in your systems:

- Anomalous requests to your resources from trusted applications or service principals.

- Requests from service principals that added or modified groups, users, applications, service principals, or trust relationships.

#### What to do if you find impersonating queries in your system

If you think you've found impersonating queries in your environment, we recommend taking the following steps:

- Review all federation trust relationships, ensure all are valid.

- Determine how the administrative account was impersonated. For more information, see [below](#queries-that-impersonate-existing-applications).

- Roll administrative account credentials.

### Other attacker behaviors

Microsoft also found the following types of attacker behaviors in affected tenants:

|Behavior  |Details  |
|---------|---------|
|**Attacker access to on premises resources**     | While Microsoft has a limited ability to view on-premises behavior, we have the following indications as to how on-premises access was gained. <br><br> - **Compromised network management software** was used as command and control software, and placed malicious binaries that exfiltrated SAML token-signing certificates.<br><br>- **Vendor networks were compromised**, including vendor credentials with existing administrative access.<br><br>- **Service account credentials, associated with compromised vendor software**, were also compromised.<br><br>- **Non-MFA service accounts** were used.  <br><br>**Important**: We recommend using on-premises tools, such as [Microsoft Defender for Identity](#microsoft-365-defender), to detect other anomalies.     |
|**Attacker access to cloud resources**     |   For administrative access to the Microsoft 365 cloud, Microsoft found evidence of the following indicators: <br><br>    - **Forged SAML tokens**, which impersonated accounts with cloud administrative privileges. <br><br>- **Accounts with no MFA required**. Such accounts [easily compromised](https://aka.ms/yourpassworddoesntmatter).     <br><br>- Access allowed from **trusted, but compromised vendor accounts**.      |
|   |         |


## References

|Source  |Links  |
|---------|---------|
|**Microsoft On The Issues**     |[Important steps for customers to protect themselves from recent nation-state cyberattacks](https://blogs.microsoft.com/on-the-issues/2020/12/13/customers-protect-nation-state-cyberattacks/)         |
|**Microsoft Security Response Center**     |  [Solorigate Resource Center: https://aka.ms/solorigate](https://aka.ms/solorigate) <br><br>[Customer guidance on recent nation-state cyber attack](https://msrc-blog.microsoft.com/2020/12/13/customer-guidance-on-recent-nation-state-cyber-attacks/)       |
|**Azure Active Directory Identity blog**     |  [Understanding "Solorigate"'s Identity IOCs - for Identity Vendors and their customers](https://techcommunity.microsoft.com/t5/azure-active-directory-identity/understanding-quot-solorigate-quot-s-identity-iocs-for-identity/ba-p/2007610)       |
|**TechCommunity**     |    [Azure AD workbook to help you assess Solarigate risk](https://techcommunity.microsoft.com/t5/azure-active-directory-identity/azure-ad-workbook-to-help-you-assess-solorigate-risk/ba-p/2010718) <br><br> [Solarwinds: Post compromise hunting with Azure Sentinel](https://techcommunity.microsoft.com/t5/azure-sentinel/solarwinds-post-compromise-hunting-with-azure-sentinel/ba-p/1995095)      |
|**Microsoft Security Intelligence**     |  [Malware encyclopedia definition: Solarigate](https://www.microsoft.com/en-us/wdsi/threats/malware-encyclopedia-description?Name=Trojan:MSIL/Solorigate.B!dha)       |
|**Microsoft Security blog**     |   [Analyzing Solarigate: The compromised DLL file that started a sophisticated cyberattack and how Microsoft Defender helps protect](https://www.microsoft.com/security/blog/2020/12/18/analyzing-solorigate-the-compromised-dll-file-that-started-a-sophisticated-cyberattack-and-how-microsoft-defender-helps-protect/)<br><br> [Advice for incident responders on recovery from system identity compromises](https://www.microsoft.com/security/blog/2020/12/21/advice-for-incident-responders-on-recovery-from-systemic-identity-compromises/) from the Detection and Response Team (DART) <br><br>[Using Microsoft 365 Defender to coordinate protection against Solorigate](https://www.microsoft.com/security/blog/2020/12/28/using-microsoft-365-defender-to-coordinate-protection-against-solorigate/)   <br><br>[Ensuring customers are protected from Solarigate](https://www.microsoft.com/security/blog/2020/12/15/ensuring-customers-are-protected-from-solorigate/)   |
| **GitHub resources**    |   [Azure Sentinel workbook for SolarWinds post-compromise hunting](https://github.com/Azure/Azure-Sentinel/blob/master/Workbooks/SolarWindsPostCompromiseHunting.json)      |
|     |         |
