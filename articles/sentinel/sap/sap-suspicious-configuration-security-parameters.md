---
title: SAP security parameters monitored by the Microsoft Sentinel solution for SAP to detect suspicious configuration changes
description: Learn about the security parameters in the SAP system that the Microsoft Sentinel solution for SAP applications monitors for suspicious configuration changes.
author: batamig
ms.author: bagol
ms.topic: reference
ms.date: 09/15/2024
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security
#Customer intent: As a security administrator, I want to monitor SAP security parameters so that I can detect and respond to suspicious configuration changes effectively.

---

# Monitored SAP security parameters for detecting suspicious configuration changes

This article lists the static security parameters in the SAP system that the Microsoft Sentinel solution for SAP applications monitors as part of the [*SAP - (Preview) Sensitive Static Parameter has Changed* analytics rule](sap-solution-security-content.md#monitor-the-configuration-of-static-sap-security-parameters-preview).

The Microsoft Sentinel solution for SAP applications provides updates for this content according to SAP best practice changes. Add parameters to watch for by changing values according to your organization's needs, and turn off specific parameters in the [*SAPSystemParameters* watchlist](sap-solution-security-content.md#systemparameters).

This article doesn't describe the parameters, and isn't a recommendation to configuring the parameters. For configuration considerations, consult your SAP admins. For parameter descriptions, see the SAP documentation.

Content in this article is intended for your **SAP BASIS** teams.

## Prerequisites

For the Microsoft Sentinel solution for SAP applications to successfully monitor the SAP security parameters, the solution needs to successfully monitor the SAP PAHI table at regular intervals. For more information, see [Verify that the PAHI table is updated at regular intervals](preparing-sap.md#verify-that-the-pahi-table-is-updated-at-regular-intervals).

### Authentication parameters

| Parameter | Security value/considerations |
| --------- | --------- |
| auth/no_check_in_some_cases | While this parameter might improve performance, it can also pose a security risk by allowing users to perform actions they might not have permission for. |
| auth/object_disabling_active | Can help improve security by reducing the number of inactive accounts with unnecessary permissions. |
| auth/rfc_authority_check | High. Enabling this parameter helps prevent unauthorized access to sensitive data and functions via RFCs. |

### Gateway parameters

| Parameter | Security value/considerations |
| --------- | --------- |
| gw/accept_remote_trace_level | The parameter can be configured to restrict the trace level accepted from external systems. Setting a lower trace level might reduce the amount of information that external systems can obtain about the internal workings of the SAP system. |
| gw/acl_mode | High. This parameter controls access to the gateway and helps prevent unauthorized access to the SAP system. |
| gw/logging | High. This parameter can be used to monitor and detect suspicious activity or potential security breaches. |
| gw/monitor | |
| gw/sim_mode | Enabling this parameter can be useful for testing purposes and can help prevent any unintended changes to the target system. |

### Internet Communication Manager (ICM) parameters

| Parameter | Security value/considerations |
| --------- | --------- |
| icm/accept_remote_trace_level | Medium <br><br>Allowing remote trace level changes can provide valuable diagnostic information to attackers and potentially compromise system security. |

### Sign-in parameters

| Parameter | Security value/considerations |
| --------- | --------- |
| login/accept_sso2_ticket | Enabling SSO2 can provide a more streamlined and convenient user experience, but also introduces extra security risks. If an attacker gains access to a valid SSO2 ticket, they might be able to impersonate a legitimate user and gain unauthorized access to sensitive data or perform malicious actions. |
| login/create_sso2_ticket | |
| login/disable_multi_gui_login | This parameter can help improve security by ensuring that users are only logged in to one session at a time. |
| login/failed_user_auto_unlock | |
| login/fails_to_session_end | High. This parameter helps prevent brute-force attacks on user accounts. |
| login/fails_to_user_lock | Helps prevent unauthorized access to the system and helps protect user accounts from being compromised. |
| login/min_password_diff | High. Requiring a minimum number of character differences can help prevent users from choosing weak passwords that can easily be guessed. |
| login/min_password_digits | High. This parameter increases the complexity of passwords and makes them harder to guess or crack. |
| login/min_password_letters | Specifies the minimum number of letters that must be included in a user's password. Setting a higher value helps increase password strength and security. |
| login/min_password_lng | Specifies the minimum length that a password can be. Setting a higher value for this parameter can improve security by ensuring that passwords aren't easily guessed. |
| login/min_password_lowercase | |
| login/min_password_specials | |
| login/min_password_uppercase | |
| login/multi_login_users | Enabling this parameter can help prevent unauthorized access to SAP systems by limiting the number of concurrent logins for a single user. When this parameter is set to `0`, only one login session is allowed per user, and other login attempts are rejected. This can help prevent unauthorized access to SAP systems in case a user's login credentials are compromised or shared with others. |
| login/no_automatic_user_sapstar | High. This parameter helps prevent unauthorized access to the SAP system via the default SAP* account. |
| login/password_change_for_SSO | High. Enforcing password changes can help prevent unauthorized access to the system by attackers who might have obtained valid credentials through phishing or other means. |
| login/password_change_waittime | Setting an appropriate value for this parameter can help ensure that users change their passwords regularly enough to maintain the security of the SAP system. At the same time, setting the wait time too short can be counterproductive because users might be more likely to reuse passwords or choose weak passwords that are easier to remember. |
| login/password_compliance_to_current_policy | High. Enabling this parameter can help ensure that users comply with the current password policy when changing passwords, which reduces the risk of unauthorized access to SAP systems. When this parameter is set to `1`, users are prompted to comply with the current password policy when changing their passwords. |
| login/password_downwards_compatibility | |
| login/password_expiration_time | Setting this parameter to a lower value can improve security by ensuring that passwords are changed frequently. |
| login/password_history_size | This parameter prevents users from repeatedly using the same passwords, which can improve security. |
| login/password_max_idle_initial | Setting a lower value for this parameter can improve security by ensuring that idle sessions aren't left open for extended periods of time. |
| login/ticket_only_by_https | High. Using HTTPS for ticket transmission encrypts the data in transit, making it more secure. |

### Remote dispatcher parameters

| Parameter | Security value/considerations |
| --------- | --------- |
| rdisp/gui_auto_logout | High. automatically logging out inactive users can help prevent unauthorized access to the system by attackers who might have access to a user's workstation. |
| rfc/ext_debugging | |
| rfc/reject_expired_passwd | Enabling this parameter can be helpful when enforcing password policies and preventing unauthorized access to SAP systems. When this parameter is set to `1`, RFC connections are rejected if the user's password expired, and the user is prompted to change their password before they can connect. This helps ensure that only authorized users with valid passwords can access the system. |
| rsau/enable | High. This Security Audit log can provide valuable information for detecting and investigating security incidents. |
| rsau/max_diskspace/local | Setting an appropriate value for this parameter helps prevent the local audit logs from consuming too much disk space, which could lead to system performance issues or even denial of service attacks. On the other hand, setting a value that's too low might result in the loss of audit log data, which might be required for compliance and auditing. |
| rsau/max_diskspace/per_day | |
| rsau/max_diskspace/per_file | Setting an appropriate value helps manage the size of audit files and avoid storage issues. |
| rsau/selection_slots | Helps ensure that audit files are retained for a longer period of time, which can be useful in a security breach. |
| rspo/auth/pagelimit | This parameter doesn't directly affect the security of the SAP system, but can help to prevent unauthorized access to sensitive authorization data. By limiting the number of entries displayed per page, it can reduce the risk of unauthorized individuals viewing sensitive authorization information. |

### Secure network communications (SNC) parameters

| Parameter | Security value/considerations |
| --------- | --------- |
| snc/accept_insecure_cpic | Enabling this parameter can increase the risk of data interception or manipulation, because it accepts SNC-protected connections that don't meet the minimum security standards. Therefore, the recommended security value for this parameter is to set it to `0`, which means that only SNC connections that meet the minimum security requirements are accepted. |
| snc/accept_insecure_gui | Setting the value of this parameter to `0` is recommended to ensure that SNC connections made through the SAP GUI are secure, and to reduce the risk of unauthorized access or interception of sensitive data. Allowing insecure SNC connections might increase the risk of unauthorized access to sensitive information or data interception, and should only be done when there's a specific need and the risks are properly assessed. |
| snc/accept_insecure_r3int_rfc | Enabling this parameter can increase the risk of data interception or manipulation, because it accepts SNC-protected connections that don't meet the minimum security standards. Therefore, the recommended security value for this parameter is to set it to `0`, which means that only SNC connections that meet the minimum security requirements are accepted. |
| snc/accept_insecure_rfc | Enabling this parameter can increase the risk of data interception or manipulation, because it accepts SNC-protected connections that don't meet the minimum security standards. Therefore, the recommended security value for this parameter is to set it to `0`, which means that only SNC connections that meet the minimum security requirements are accepted. |
| snc/data_protection/max | Setting a high value for this parameter can increase the level of data protection and reduce the risk of data interception or manipulation. The recommended security value for this parameter depends on the organization's specific security requirements and risk management strategy. |
| snc/data_protection/min | Setting an appropriate value for this parameter helps ensure that SNC-protected connections provide a minimum level of data protection. This setting helps prevent sensitive information from being intercepted or manipulated by attackers. The value of this parameter should be set based on the security requirements of the SAP system and the sensitivity of the data transmitted over SNC-protected connections. |
| snc/data_protection/use | |
| snc/enable | When enabled, SNC provides an extra layer of security by encrypting data transmitted between systems. |
| snc/extid_login_diag | Enabling this parameter can be helpful for troubleshooting SNC-related issues, because it provides extra diagnostic information. However, the parameter might also expose sensitive information about the external security products used by the system, which could be a potential security risk if that information falls into the wrong hands. |
| snc/extid_login_rfc | |

### Web dispatcher parameters

| Parameter | Security value/considerations |
| --------- | --------- |
| wdisp/ssl_encrypt | High. This parameter ensures that data transmitted over HTTP is encrypted, which helps prevent eavesdropping and data tampering. |

## Related content

For more information, see:

- [Connect your SAP system to Microsoft Sentinel](deploy-data-connector-agent-container.md)
- [Troubleshoot your Microsoft Sentinel solution for SAP applications solution deployment](sap-deploy-troubleshoot.md)
