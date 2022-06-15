---
title: Anomalies detected by the Microsoft Sentinel machine learning engine
description: Learn about the anomalies detected by Microsoft Sentinel's machine learning engines.
author: yelevin
ms.topic: reference
ms.date: 06/13/2022
ms.author: yelevin
---

# Anomalies detected by the Microsoft Sentinel machine learning engine

This article lists the anomalies that Microsoft Sentinel detects using different machine learning models.

Anomaly detection works by analyzing the behavior of users in an environment over a period of time and constructing a baseline of legitimate activity. Once the baseline is established, any activity outside the normal parameters is considered anomalous and therefore suspicious.

Microsoft Sentinel uses two different models to create baselines and detect anomalies.

- [UEBA anomalies](#ueba-anomalies)
- [Machine learning-based anomalies](#machine-learning-based-anomalies)

## UEBA anomalies

Sentinel UEBA detects anomalies based on dynamic baselines created for each entity across various data inputs. Each entity's baseline behavior is set according to its own historical activities, those of its peers, and those of the organization as a whole. Anomalies can be triggered by the correlation of different attributes such as action type, geo-location, device, resource, ISP, and more.

Supported data sources: Azure Audit (Core Directory/UserManagement/Delete user, Core Directory/Device/Delete user, Core Directory/UserManagement/Delete user)


> [!NOTE]
> Anomalies are in **PREVIEW**. 

- [Anomalous Account Access Removal](#anomalous-account-access-removal)
- [Anomalous Account Creation](#anomalous-account-creation)
- [Anomalous Account Deletion](#anomalous-account-deletion)
- [Anomalous Account Discovery](#anomalous-account-discovery)
- [Anomalous Account Manipulation](#anomalous-account-manipulation)
- [Anomalous Application Deletion](#anomalous-application-deletion)
- [Anomalous Code Execution](#anomalous-code-execution)
- [Anomalous Credential Access](#anomalous-credential-access)
- [Anomalous Data Destruction](#anomalous-data-destruction)
- [Anomalous Data Discovery](#anomalous-data-discovery)
- [Anomalous Defensive Mechanism Discovery](#anomalous-defensive-mechanism-discovery)
- [Anomalous Defensive Mechanism Modification](#anomalous-defensive-mechanism-modification)
- [Anomalous Failed Sign-in](#anomalous-failed-sign-in)
- [Anomalous Password Reset](#anomalous-password-reset)
- [Anomalous Privilege Granted](#anomalous-privilege-granted)
- [Anomalous Role Assignment](#anomalous-role-assignment)
- [Anomalous Session Duration](#anomalous-session-duration)
- [Anomalous Sign-in](#anomalous-sign-in)
- [Anomalous Process Creation](#anomalous-process-creation)

### Anomalous Account Access Removal

**Description:** An attacker may interrupt the availability of system and network resources by blocking access to accounts used by legitimate users. The attacker might delete, lock, or manipulate an account (for example, by changing its credentials) to remove access to it.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | UEBA                                                               |
| **Data sources:**                | Azure Activity logs<br>Check Point VPN (not in rule?)              |
| **MITRE ATT&CK tactics:**        | Impact                                                             |
| **MITRE ATT&CK techniques:**     | T1531 - Account Access Removal                                     |
| **Activity:**                    | Microsoft.Authorization/roleAssignments/delete<br>Log Out |

[Back to UEBA anomalies list](#ueba-anomalies)

### Anomalous Account Creation

**Description:** Adversaries may create an <!-- additional? -->account to maintain access to targeted systems. With a sufficient level of access, creating such accounts may be used to establish secondary credentialed access without requiring persistent remote access tools to be deployed on the system.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | UEBA                                                               |
| **Data sources:**                | Azure Active Directory audit logs                                  |
| **MITRE ATT&CK tactics:**        | Persistence                                                        |
| **MITRE ATT&CK techniques:**     | T1136 - Create Account                                             |
| **MITRE ATT&CK sub-techniques:** | Cloud Account                                                      |
| **Activity:**                    | Core Directory/UserManagement/Add user                             |

[Back to UEBA anomalies list](#ueba-anomalies)

### Anomalous Account Deletion

**Description:** Adversaries may interrupt availability of system and network resources by inhibiting access to accounts utilized by legitimate users. Accounts may be deleted, locked, or manipulated (ex: changed credentials) to remove access to accounts.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | UEBA                                                               |
| **Data sources:**                | Azure Active Directory audit logs                                  |
| **MITRE ATT&CK tactics:**        | Impact                                                             |
| **MITRE ATT&CK techniques:**     | T1531 - Account Access Removal                                     |
| **Activity:**                    | Core Directory/UserManagement/Delete user<br>Core Directory/Device/Delete user<br>Core Directory/UserManagement/Delete user |

[Back to UEBA anomalies list](#ueba-anomalies)

### Anomalous Account Discovery
***(NO RULE?)***

**Description:** Adversaries may attempt to get a listing of accounts on a system or within an environment. This information can help adversaries determine which accounts exist to aid in follow-on behavior.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | UEBA                                                               |
| **Data sources:**                | Azure Activity logs                                                |
| **MITRE ATT&CK tactics:**        | Discovery                                                          |
| **MITRE ATT&CK techniques:**     | T1087 - Account Discovery                                          |
| **MITRE ATT&CK sub-techniques:** | Cloud Account                                                      |
| **Activity:**                    | Microsoft.Sql/managedInstances/administrators/read<br>Microsoft.Sql/servers/administrators/read<br>Microsoft.Authorization/classicAdministrators/read |

[Back to UEBA anomalies list](#ueba-anomalies)

### Anomalous Account Manipulation

**Description:** Adversaries may manipulate accounts to maintain access to target systems. These actions include adding new accounts to high-privileged groups. Dragonfly 2.0, for example, added newly created accounts to the administrators group to maintain elevated access. The query below generates an output of all high-Blast Radius users performing "Update user" (name change) to privileged role, or ones that changed users for the first time.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | UEBA                                                               |
| **Data sources:**                | Azure Active Directory audit logs                                  |
| **MITRE ATT&CK tactics:**        | Persistence                                                        |
| **MITRE ATT&CK techniques:**     | T1098 - Account Manipulation                                       |
| **Activity:**                    | Core Directory/UserManagement/Update user                          |

[Back to UEBA anomalies list](#ueba-anomalies)

### Anomalous Application Deletion
***(NO RULE?)***

**Description:** Adversaries may interrupt availability of system and network resources by inhibiting access to accounts utilized by legitimate users. Accounts may be deleted, locked, or manipulated (ex: changed credentials) to remove access to accounts.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | UEBA                                                               |
| **Data sources:**                | Azure Active Directory audit logs                                  |
| **MITRE ATT&CK tactics:**        | Impact                                                             |
| **MITRE ATT&CK techniques:**     | T1531 - Account Access Removal                                     |
| **Activity:**                    | Core Directory/ApplicationManagement/Delete application            |

[Back to UEBA anomalies list](#ueba-anomalies)

### Anomalous Code Execution

**Description:** Adversaries may abuse command and script interpreters to execute commands, scripts, or binaries. These interfaces and languages provide ways of interacting with computer systems and are a common feature across many different platforms.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | UEBA                                                               |
| **Data sources:**                | Azure Activity logs                                                |
| **MITRE ATT&CK tactics:**        | Execution                                                          |
| **MITRE ATT&CK techniques:**     | T1059 - Command and Scripting Interpreter                          |
| **MITRE ATT&CK sub-techniques:** | PowerShell                                                         |
| **Activity:**                    | Microsoft.Compute/virtualMachines/runCommand/action                |

[Back to UEBA anomalies list](#ueba-anomalies)

### Anomalous Credential Access
***(NO RULE?)***

**Description:** Adversaries may search for common password storage locations to obtain user credentials. Once credentials are obtained, they can be used to perform lateral movement and access restricted information.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | UEBA                                                               |
| **Data sources:**                | Azure Activity logs                                                |
| **MITRE ATT&CK tactics:**        | Credential Access                                                  |
| **MITRE ATT&CK techniques:**     | T1555 - Credentials from Password Stores                           |
| **Activity:**                    | Microsoft.KeyVault/vaults/keys/read<br>Microsoft.KeyVault/vaults/secrets/getSecret/action<br>Microsoft.KeyVault/vaults/storageaccounts/regeneratekey/action<br>Microsoft.KeyVault/vaults/storageaccounts/sas/set/action |

[Back to UEBA anomalies list](#ueba-anomalies)

### Anomalous Data Destruction

**Description:** Adversaries may destroy data and files on specific systems or in large numbers on a network to interrupt availability to systems, services, and network resources. Data destruction is likely to render stored data irrecoverable by forensic techniques through overwriting files or data on local and remote drives.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | UEBA                                                               |
| **Data sources:**                | Azure Activity logs                                                |
| **MITRE ATT&CK tactics:**        | Impact                                                             |
| **MITRE ATT&CK techniques:**     | T1485 - Data Destruction                                           |
| **Activity:**                    | Microsoft.Compute/disks/delete<br>Microsoft.Compute/galleries/images/delete<br>Microsoft.Compute/hostGroups/delete<br>Microsoft.Compute/hostGroups/hosts/delete<br>Microsoft.Compute/images/delete<br>Microsoft.Compute/virtualMachines/delete<br>Microsoft.Compute/virtualMachineScaleSets/delete<br>Microsoft.Compute/virtualMachineScaleSets/virtualMachines/delete<br>Microsoft.Devices/digitalTwins/Delete<br>Microsoft.Devices/iotHubs/Delete<br>Microsoft.KeyVault/vaults/delete<br>Microsoft.Logic/integrationAccounts/delete  <br>Microsoft.Logic/integrationAccounts/maps/delete <br>Microsoft.Logic/integrationAccounts/schemas/delete <br>Microsoft.Logic/integrationAccounts/partners/delete <br>Microsoft.Logic/integrationServiceEnvironments/delete<br>Microsoft.Logic/workflows/delete<br>Microsoft.Resources/subscriptions/resourceGroups/delete<br>Microsoft.Sql/instancePools/delete<br>Microsoft.Sql/managedInstances/delete<br>Microsoft.Sql/managedInstances/administrators/delete<br>Microsoft.Sql/managedInstances/databases/delete<br>Microsoft.Storage/storageAccounts/delete<br>Microsoft.Storage/storageAccounts/blobServices/containers/blobs/delete<br>Microsoft.Storage/storageAccounts/fileServices/fileshares/files/delete<br>Microsoft.Storage/storageAccounts/blobServices/containers/delete<br>Microsoft.AAD/domainServices/delete |

[Back to UEBA anomalies list](#ueba-anomalies)

### Anomalous Data Discovery
***(NO RULE?)***

**Description:** An adversary may attempt to enumerate the cloud services running on a system after gaining access. They may attempt to discover information about the services enabled throughout the environment.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | UEBA                                                               |
| **Data sources:**                | Azure Activity logs                                                |
| **MITRE ATT&CK tactics:**        | Discovery                                                          |
| **MITRE ATT&CK techniques:**     | T1526 - Cloud Service Discovery<br>T1518 - Software Discovery      |
| **Activity:**                    | Microsoft.SecurityGraph/diagnosticsettings/read<br>Microsoft.KeyVault/vaults/eventGridFilters/read<br>Microsoft.KeyVault/vaults/certificatecas/read |

[Back to UEBA anomalies list](#ueba-anomalies)

### Anomalous Defensive Mechanism Discovery
***(NO RULE?)***

**Description:** Adversaries may attempt to get a listing of security software, configurations, defensive tools, and sensors that are installed on a system or in a cloud environment. They may use this information during automated discovery to shape follow-on behaviors, including whether or not the adversary fully infects the target and/or attempts specific actions.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | UEBA                                                               |
| **Data sources:**                | Azure Activity logs                                                |
| **MITRE ATT&CK tactics:**        | Discovery                                                          |
| **MITRE ATT&CK techniques:**     | T1518 - Software Discovery                                         |
| **MITRE ATT&CK sub-techniques:** | Security Software Discovery                                        |
| **Activity:**                    | Microsoft.Network/azurefirewalls/read<br>Microsoft.Sql/servers/firewallRules/read<br>Microsoft.Network/firewallPolicies/ruleGroups/read<br>Microsoft.Network/networkSecurityGroups/securityRules/read<br>Microsoft.Sql/managedInstances/databases/vulnerabilityAssessments/rules/baselines/read<br>Microsoft.Sql/managedInstances/databases/vulnerabilityAssessments/read<br>Microsoft.Network/networkSecurityGroups/read<br>Microsoft.Network/ddosProtectionPlans/read<br>Microsoft.Network/ApplicationGatewayWebApplicationFirewallPolicies/read<br>Microsoft.Authorization/policyAssignments/read |

[Back to UEBA anomalies list](#ueba-anomalies)

### Anomalous Defensive Mechanism Modification

**Description:** Adversaries may disable security tools to avoid possible detection of their tools and activities.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | UEBA                                                               |
| **Data sources:**                | Azure Activity logs                                                |
| **MITRE ATT&CK tactics:**        | Defense Evasion **(Excel)**<br>Impact **(UI)**                     |
| **MITRE ATT&CK techniques:**     | T1562 - Impair Defenses **(Excel)**<br>T1531 - Account Access Removal **(UI)** |
| **MITRE ATT&CK sub-techniques:** | Disable or Modify Tools<br>Disable or Modify Cloud Firewall<br>**(Excel)** |
| **Activity:**                | Microsoft.Sql/managedInstances/databases/vulnerabilityAssessments/rules/baselines/delete<br>Microsoft.Sql/managedInstances/databases/vulnerabilityAssessments/delete<br>Microsoft.Network/networkSecurityGroups/securityRules/delete<br>Microsoft.Network/networkSecurityGroups/delete<br>Microsoft.Network/ddosProtectionPlans/delete<br>Microsoft.Network/ApplicationGatewayWebApplicationFirewallPolicies/delete<br>Microsoft.Network/applicationSecurityGroups/delete<br>Microsoft.Authorization/policyAssignments/delete<br>Microsoft.Sql/servers/firewallRules/delete<br>Microsoft.Network/firewallPolicies/delete<br>Microsoft.Network/azurefirewalls/delete |

[Back to UEBA anomalies list](#ueba-anomalies)

### Anomalous Failed Sign-in

**Description:** Adversaries with no prior knowledge of legitimate credentials within the system or environment may guess passwords to attempt access to accounts.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | UEBA                                                               |
| **Data sources:**                | Azure Active Directory sign-in logs<br>Check Point VPN logs<br>Windows Security logs |
| **MITRE ATT&CK tactics:**        | Credential Access                                                  |
| **MITRE ATT&CK techniques:**     | T1110 - Brute Force                                                |
| **Activity:**                    | Sign-in activity<br>Failed Log In<br>4625                          |

[Back to UEBA anomalies list](#ueba-anomalies)

### Anomalous Password Reset

**Description:** Adversaries may interrupt availability of system and network resources by inhibiting access to accounts utilized by legitimate users. Accounts may be deleted, locked, or manipulated (ex: changed credentials) to remove access to accounts.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | UEBA                                                               |
| **Data sources:**                | Azure Active Directory audit logs                                  |
| **MITRE ATT&CK tactics:**        | Impact                                                             |
| **MITRE ATT&CK techniques:**     | T1531 - Account Access Removal                                     |
| **Activity:**                    | Core Directory/UserManagement/User password reset |

[Back to UEBA anomalies list](#ueba-anomalies)

### Anomalous Privilege Granted

**Description:** Adversaries may add adversary-controlled credentials for Azure Service Principals in addition to existing legitimate credentials to maintain persistent access to victim Azure accounts.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | UEBA                                                               |
| **Data sources:**                | Azure Active Directory audit logs                                  |
| **MITRE ATT&CK tactics:**        | Persistence **(Excel)**<br>Impact **(UI)**                         |
| **MITRE ATT&CK techniques:**     | T1098 - Account Manipulation **(Excel)**<br>T1531 - Account Access Removal **(UI)** |
| **MITRE ATT&CK sub-techniques:** | Additional Azure Service Principal Credentials                     |
| **Activity:**                    | Account provisioning/Application Management/Add app role assignment to service principal |

[Back to UEBA anomalies list](#ueba-anomalies)

### Anomalous Role Assignment
***(NO RULE?)***

**Description:** Adversaries may manipulate accounts to maintain access to victim systems. These actions include adding new accounts to high privileged groups.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | UEBA                                                               |
| **Data sources:**                | Azure Active Directory audit logs                                  |
| **MITRE ATT&CK tactics:**        | Persistence                                                        |
| **MITRE ATT&CK techniques:**     | T1098 - Account Manipulation                                       |
| **Activity:**                    | Add member to group<br>Add member to role                          |

[Back to UEBA anomalies list](#ueba-anomalies)

### Anomalous Session Duration
***(NO RULE?)***

**Description:** Adversaries may leverage external-facing remote services to initially access and/or persist within a network. Remote services such as VPNs, Citrix, and other access mechanisms allow users to connect to internal enterprise network resources from external locations.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | UEBA                                                               |
| **Data sources:**                | VPN logs                                                           |
| **MITRE ATT&CK tactics:**        | Persistence                                                        |
| **MITRE ATT&CK techniques:**     | T1133 - External Remote Services                                   |
| **Activity:**                    | Log Out |

[Back to UEBA anomalies list](#ueba-anomalies)

### Anomalous Sign-in

**Description:** Adversaries may steal the credentials of a specific user or service account using Credential Access techniques or capture credentials earlier in their reconnaissance process through social engineering for means of gaining Persistence.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | UEBA                                                               |
| **Data sources:**                | Azure Active Directory sign-in logs<br>Check Point VPN logs<br>Windows Security logs |
| **MITRE ATT&CK tactics:**        | Persistence **(Excel)**<br>Impact **(UI)**                         |
| **MITRE ATT&CK techniques:**     | T1078 - Valid Accounts                                             |
| **Activity:**                    | Sign-in activity<br>4624<br>Successful Log In                      |

[Back to UEBA anomalies list](#ueba-anomalies)

### Anomalous Process Creation
***(NO RULE?)***

**Description:** Services, daemons, or agents may be created with administrator privileges but executed under root/SYSTEM privileges. Adversaries may leverage this functionality to create or modify system processes in order to escalate privileges.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | UEBA                                                               |
| **Data sources:**                | Windows Security logs                                              |
| **MITRE ATT&CK tactics:**        | Persistence<br>Privilege Escalation                                |
| **MITRE ATT&CK techniques:**     | T1543 - Create or Modify System Processes                          |
| **Activity:**                    | 4688                                                               |

[Back to UEBA anomalies list](#ueba-anomalies)

## Machine learning-based anomalies

Microsoft Sentinel's customizable, machine learning-based anomalies can identify anomalous behavior with analytics rule templates that can be put to work right out of the box. While anomalies don't necessarily indicate malicious or even suspicious behavior by themselves, they can be used to improve detections, investigations, and threat hunting.

- [Anomalous Azure AD sign-in sessions](#anomalous-azure-ad-sign-in-sessions)
- [Anomalous Azure operations](#anomalous-azure-operations)
- [Anomalous Code Execution (duplicate?)](#anomalous-code-execution-duplicate)
- [Anomalous local account creation](#anomalous-local-account-creation)
- [Anomalous scanning activity](#anomalous-scanning-activity)
- [Anomalous user activities in Office Exchange](#anomalous-user-activities-in-office-exchange)
- [Anomalous user/app activities in Azure audit logs](#anomalous-userapp-activities-in-azure-audit-logs)
- [Anomalous W3CIIS logs activity](#anomalous-w3ciis-logs-activity)
- [Anomalous web request activity](#anomalous-web-request-activity)
- [Attempted computer brute force](#attempted-computer-brute-force)
- [Attempted user account brute force](#attempted-user-account-brute-force)
- [Attempted user account brute force per login type](#attempted-user-account-brute-force-per-login-type)
- [Attempted user account bruteforce per failure reason](#attempted-user-account-bruteforce-per-failure-reason)
- [Detect machine generated network beaconing behavior](#detect-machine-generated-network-beaconing-behavior)
- [Domain generation algorithm (DGA) on DNS domains](#domain-generation-algorithm-dga-on-dns-domains)
- [Domain Reputation Palo Alto anomaly](#domain-reputation-palo-alto-anomaly)
- [Excessive data transfer anomaly](#excessive-data-transfer-anomaly)
- [Excessive Downloads via Palo Alto GlobalProtect](#excessive-downloads-via-palo-alto-globalprotect)
- [Excessive uploads via Palo Alto GlobalProtect](#excessive-uploads-via-palo-alto-globalprotect)
- [Login from an unusual region via Palo Alto GlobalProtect account logins](#login-from-an-unusual-region-via-palo-alto-globalprotect-account-logins)
- [Multi-region logins in a single day via Palo Alto GlobalProtect](#multi-region-logins-in-a-single-day-via-palo-alto-globalprotect)
- [Potential data staging](#potential-data-staging)
- [Potential domain generation algorithm (DGA) on next-level DNS Domains](#potential-domain-generation-algorithm-dga-on-next-level-dns-domains)
- [Suspicious geography change in Palo Alto GlobalProtect account logins](#suspicious-geography-change-in-palo-alto-globalprotect-account-logins)
- [Suspicious number of protected documents accessed](#suspicious-number-of-protected-documents-accessed)
- [Suspicious volume of AWS API calls from Non-AWS source IP address from a user account id per workspace on a daily basis](#suspicious-volume-of-aws-api-calls-from-non-aws-source-ip-address-from-a-user-account-id-per-workspace-on-a-daily-basis)
- [Suspicious volume of AWS cloud trail logs events of group user account by EventTypeName](#suspicious-volume-of-aws-cloud-trail-logs-events-of-group-user-account-by-eventtypename)
- [Suspicious volume of AWS write API calls from a user account](#suspicious-volume-of-aws-write-api-calls-from-a-user-account)
- [Suspicious volume of failed login attempts to AWS Console by each group user account](#suspicious-volume-of-failed-login-attempts-to-aws-console-by-each-group-user-account)
- [Suspicious volume of failed login attempts to AWS Console by each source IP address](#suspicious-volume-of-failed-login-attempts-to-aws-console-by-each-source-ip-address)
- [Suspicious volume of logins to computer](#suspicious-volume-of-logins-to-computer)
- [Suspicious volume of logins to computer with elevated token](#suspicious-volume-of-logins-to-computer-with-elevated-token)
- [Suspicious volume of logins to user account](#suspicious-volume-of-logins-to-user-account)
- [Suspicious volume of logins to user account by logon types](#suspicious-volume-of-logins-to-user-account-by-logon-types)
- [Suspicious volume of logins to user account with elevated token](#suspicious-volume-of-logins-to-user-account-with-elevated-token)
- [Unusual external firewall alarm detected](#unusual-external-firewall-alarm-detected)
- [Unusual mass downgrade AIP label](#unusual-mass-downgrade-aip-label)
- [Unusual network communication on commonly used ports](#unusual-network-communication-on-commonly-used-ports)
- [Unusual network volume anomaly](#unusual-network-volume-anomaly)
- [Unusual web traffic detected with IP in URL path](#unusual-web-traffic-detected-with-ip-in-url-path)

### Anomalous Azure AD sign-in sessions

**Description:** The machine learning model groups the Azure AD sign-in logs on a per-user basis. The model is trained on the previous 6 days of user sign-in behavior. It indicates anomalous user sign-in sessions in the last day. 

An autoencoder model is used. Its aim is to compress the user sign-in sessions into a bottleneck encoding. It then attempts to reconstruct the input sessions as best it can from the bottleneck encoding. The sessions with high reconstruction errors are assumed to be anomalous. ***THIS LEVEL OF EXPLANATION ISN'T NECESSARY, RIGHT?***

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | Customizable machine learning                                      |
| **Data sources:**                | Azure Active Directory sign-in logs                                |
| **MITRE ATT&CK tactics:**        | Initial Access                                                     |
| **MITRE ATT&CK techniques:**     | T1078 - Valid Accounts<br>T1566 - Phishing<br>T1133 - External Remote Services |
| **Entities:**                    | **Type:** Account<br><br>**Fields:** Name, UPN Suffix, AaadTenantId, AaaUserId,  isDomainJoined, LastVerdict |

[Back to Machine learning-based anomalies list](#machine-learning-based-anomalies)

### Anomalous Azure operations

**Description:** This detection algorithm generates anomaly of a caller who performed sequence of an operation(s) which is uncommon in their workspace. We collect and featurize last 21 days of operation happened in the workspace grouped by the caller as a training data for ML algorithm. The trained model is used to score the operation performed by the caller on the test date and we tag those caller as anomaly whose error score is greater than given thershold. From Security perspective, this anomaly will capture the caller along with operation performed on the test date which are not common in their workspace.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | Customizable machine learning                                      |
| **Data sources:**                | Azure Activity logs                                                |
| **MITRE ATT&CK tactics:**        | Initial Access                                                     |
| **MITRE ATT&CK techniques:**     | T1190 - Exploit Public-Facing Application                          |
| **Entities:**                    |                                                                    |

[Back to Machine learning-based anomalies list](#machine-learning-based-anomalies)

### Anomalous Code Execution (duplicate?)

**Description:** Adversaries may abuse command and script interpreters to execute commands, scripts, or binaries. These interfaces and languages provide ways of interacting with computer systems and are a common feature across many different platforms.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | Customizable machine learning                                      |
| **Data sources:**                | Azure Activity logs                                                |
| **MITRE ATT&CK tactics:**        | Execution                                                          |
| **MITRE ATT&CK techniques:**     | T1059 - Command and Scripting Interpreter                          |
| **Entities:**                    |                                                                    |

[Back to Machine learning-based anomalies list](#machine-learning-based-anomalies)

### Anomalous local account creation

**Description:** This algorithm is to detect anomalous local account creation on windows systems. Adversaries may create local accounts to maintain access to victim systems. This algorithm analyzes historical local account creation activity (14 days) by users and compare with current day to find similar activity from the users who were not previously seen in historical activity. You can further customize the allowlist to filter known users from triggering this anomaly.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | Customizable machine learning                                      |
| **Data sources:**                | Windows Security logs                                              |
| **MITRE ATT&CK tactics:**        | Persistence                                                        |
| **MITRE ATT&CK techniques:**     | T1136 - Create Account                                             |
| **Entities:**                    | **Type:** Account<br><br>**Fields:** Name, isDomainJoined, IsValid, LastVerdict |

[Back to Machine learning-based anomalies list](#machine-learning-based-anomalies)

### Anomalous scanning activity

**Description:** The Scanning Activity anomaly is looking to determine if there is potential port scanning anomaly in an environment coming from a single source IP to one or more destination IPs.  
The algorithm takes into account whether the IP is public, meaning external, or private, meaning internal, and the event is marked accordingly. Only private to public or public to private is considered at this time. Scanning activity can indicate an attacker attempting to determine available services in an environment that can be potentially exploited and used for ingress or lateral movement. A high number of source ports and high number of destination ports from a single source IP to either a single or multiple destination IP or IPs can be interesting and indicate anomalous scanning. Additionally, if there is a high ratio of destination IPs to the single source IP this can indicate anomalous scanning. Configuration details - Job run default is daily, with hourly bins The algorithm uses the following defaults to limit the results based on hourly bins, each is configurable -> Included device actions - accept, allow, start -> Excluded ports - 53, 67, 80, 8080, 123, 137, 138, 443, 445, 3389 -> Distinct destination port count >= 600 -> Distinct source port count >= 600 -> Distinct source port count divided by distinct destination port, ratio converted to percent >= 99.99 -> Source IP (always 1) divided by destination IP, ratio converted to percent >= 99.99

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | Customizable machine learning                                      |
| **Data sources:**                | CommonSecurityLog (PAN, Zscaler, CEF, CheckPoint, Fortinet)        |
| **MITRE ATT&CK tactics:**        | Discovery                                                          |
| **MITRE ATT&CK techniques:**     | T1046 - Network Service Scanning                                   |
| **Entities:**                    | **Type:** IP<br><br>**Field:** IP                                  |

[Back to Machine learning-based anomalies list](#machine-learning-based-anomalies)

### Anomalous user activities in Office Exchange

**Description:** This machine learning model groups the Office Exchange logs on a per-user basis into hourly buckets. We define one hour as a session. The model is trained on the previous 7 days of behavior across all regular (non-admin) users. It indicates anomalous user Office.  
An autoencoder model is used. Its aim is to compress the user Office Exchange sessions into a bottleneck encoding. It then attempts to reconstruct the input sessions as best it can from the bottleneck encoding. The sessions with high reconstruction errors are assumed to be anomalous.xchange sessions in the last day.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | Customizable machine learning                                      |
| **Data sources:**                | Office Activity log (Exchange)                                     |
| **MITRE ATT&CK tactics:**        | Persistence<br>Collection                                          |
| **MITRE ATT&CK techniques:**     | **Collection:**<br>T1114 - Email Collection<br>T1213 - Data from Information Repositories<br><br>**Persistence:**<br>T1098 - Account Manipulation<br>T1136 - Create Account<br>T1137 - Office Application Startup<br>T1505 - Server Software Component |
| **Entities:**                    | **Type:** Account<br><br>**Fields:** Name, UPNSuffix, IsDomainJoined, LastVerdict |

[Back to Machine learning-based anomalies list](#machine-learning-based-anomalies)

### Anomalous user/app activities in Azure audit logs

**Description:** This autoencoder model identifies anomalous user/app Azure sessions in audit logs for the last day. We define 10 minutes to be the length of a session. It groups the Azure audit logs on a per-user/app basis into sessions. It compresses these user/app Azure sessions into a bottleneck encoding. It then reconstructs the input sessions as best it can from the bottleneck encoding. If the sessions have high reconstruction errors, they are assumed to be anomalous. The model is trained on the previous 21 days of behavior across all users and apps. This algorithm checks for sufficient volume of data before training the model.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | Customizable machine learning                                      |
| **Data sources:**                | Azure Active Directory audit logs                                  |
| **MITRE ATT&CK tactics:**        | Collection<br>Discovery<br>Initial Access<br>Persistence<br>Privilege Escalation |
| **MITRE ATT&CK techniques:**     | **Collection:**<br>T1530 - Data from Cloud Storage Object<br><br>**Discovery:**<br>T1087 - Account Discovery<br>T1538 - Cloud Service Dashboard<br>T1526 - Cloud Service Discovery<br>T1069 - Permission Groups Discovery<br>T1518 - Software Discovery<br><br>**Initial Access:**<br>T1190 - Exploit Public-Facing Application<br>T1078 - Valid Accounts<br><br>**Persistence:**<br>T1098 - Account Manipulation<br>T1136 - Create Account<br>T1078 - Valid Accounts<br><br>**Privilege Escalation:**<br>T1484 - Domain Policy Modification<br>T1078 - Valid Accounts  |
| **Entities:**                    | **Type:** cloud-application<br><br>**Fields:** Name, InstanceName, LastVerdict |

[Back to Machine learning-based anomalies list](#machine-learning-based-anomalies)

### Anomalous W3CIIS logs activity

**Description:** This anomaly indicates anomalous W3CIIS sessions within the last day, due to reasons such as a high number of distinct uri queries, specific http verbs or http statuses, user agents, or an unusually high number of logs in a session. The machine learning algorithm identifies unusual W3CIIS log events within an hourly session, grouped by site name and client IP. The model is trained on the previous 7 days of W3CIIS activity, using an autoencoder. The algorithm checks for sufficient volume of W3CIIS activity before training the model. The autoencoder compressess these site name/client IP sessions using a bottleneck encoding, and reconstructs the input sessions using a decoder. Sessions with high reconstruction errors are marked as anomalous.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | Customizable machine learning                                      |
| **Data sources:**                | W3CIIS logs                                                        |
| **MITRE ATT&CK tactics:**        | Initial Access<br>Persistence                                      |
| **MITRE ATT&CK techniques:**     | **Initial Access:**<br>T1190 - Exploit Public-Facing Application<br><br>**Persistence:**<br>T1505 - Server Software Component                                |
| **Entities:**                    |                                                                    |

[Back to Machine learning-based anomalies list](#machine-learning-based-anomalies)

### Anomalous web request activity

**Description:** This algorithm groups the W3CIIS logs into per site name and per URI stem hourly sessions. The machine learning model identifies the sessions with anomalous requests that triggered response code 5xx in the last day. 5xx codes are an indication that some application instability or error condition has been triggered by the request. They can be an indication that an attacker is probing the URI stem for vulnerabilities and configuration issues, performing some exploitation activity such as SQL injection, or leveraging an unpatched vulnerability.  
The algorithm uses 6 days of data for training. It identifies unusual high volume of web requests that generated respond code 5xx in the last day.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | Customizable machine learning                                      |
| **Data sources:**                | W3CIIS logs                                                        |
| **MITRE ATT&CK tactics:**        | Initial Access<br>Persistence                                      |
| **MITRE ATT&CK techniques:**     | **Initial Access:**<br>T1190 - Exploit Public-Facing Application<br><br>**Persistence:**<br>T1505 - Server Software Component                                |
| **Entities:**                    | **Type:** IP<br><br>**Fields:** Address, LastVerdict               |

[Back to Machine learning-based anomalies list](#machine-learning-based-anomalies)

### Attempted computer brute force

**Description:** This algorithm detects an unusually high volume of failed login attempts to each computer. The model is trained on the previous 21 days of security event ID 4625 on a computer. It indicates anomalous high volume of failed login attempts in the last day.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | Customizable machine learning                                      |
| **Data sources:**                | Windows Security logs                                              |
| **MITRE ATT&CK tactics:**        | Credential Access                                                  |
| **MITRE ATT&CK techniques:**     | T1110 - Brute Force                                                |
| **Entities:**                    | **Type:** Host<br><br>**Fields:** Hostname                         |

[Back to Machine learning-based anomalies list](#machine-learning-based-anomalies)

### Attempted user account brute force

**Description:** This algorithm detects an unusually high volume of failed login attempts per user account. The model is trained on the previous 21 days of security event ID 4625 on an account. It indicates anomalous high volume of failed login attempts in the last day.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | Customizable machine learning                                      |
| **Data sources:**                | Windows Security logs                                              |
| **MITRE ATT&CK tactics:**        | Credential Access                                                  |
| **MITRE ATT&CK techniques:**     | T1110 - Brute Force                                                |
| **Entities:**                    | **Type:** Account<br><br>**Fields:** Name, IsDomainJoined          |

[Back to Machine learning-based anomalies list](#machine-learning-based-anomalies)

### Attempted user account brute force per login type

**Description:** This algorithm detects an unusually high volume of failed login attempts per user account per logon type. The model is trained on the previous 21 days of security event ID 4625 on an account and a logon type. It indicates anomalous high volume of failed login attempts with certain logon type in the last day.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | Customizable machine learning                                      |
| **Data sources:**                | Windows Security logs                                              |
| **MITRE ATT&CK tactics:**        | Credential Access                                                  |
| **MITRE ATT&CK techniques:**     | T1110 - Brute Force                                                |
| **Entities:**                    | **Type:** Account<br><br>**Fields:** Name, IsDomainJoined          |

[Back to Machine learning-based anomalies list](#machine-learning-based-anomalies)

### Attempted user account bruteforce per failure reason

**Description:** This algorithm detects an unusually high volume of failed login attempts per user account per failure reason. The model is trained on the previous 21 days of security event ID 4625 on an account and a failure reason. It indicates anomalous high volume of failed login attempts with certain failure reason in the last day.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | Customizable machine learning                                      |
| **Data sources:**                | Windows Security logs                                              |
| **MITRE ATT&CK tactics:**        | Credential Access                                                  |
| **MITRE ATT&CK techniques:**     | T1110 - Brute Force                                                |
| **Entities:**                    | **Type:** Account<br><br>**Fields:** Name, IsDomainJoined          |

[Back to Machine learning-based anomalies list](#machine-learning-based-anomalies)

### Detect machine generated network beaconing behavior

**Description:** This algorithm identifies beaconing patterns from network traffic connection logs based on recurrent time delta patterns. Any network connection towards the untrusted public networks at repetitive time delta is an indication of malware callbacks or data exfiltration attempts. The anomaly will calculate time delta between consecutive network connection between same source and destination IP as well as count (Connections in time-delta sequence) of time-delta sequence between same source and destination. Percentage of beaconing is calculated between connections in time-delta sequence against total connections in a day.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | Customizable machine learning                                      |
| **Data sources:**                | CommonSecurityLog (PAN)                                            |
| **MITRE ATT&CK tactics:**        | Command and Control                                                |
| **MITRE ATT&CK techniques:**     | T1071 - Application Layer Protocol<br>T1132 - Data Encoding<br>T1001 - Data Obfuscation<br>T1568 - Dynamic Resolution<br>T1573 - Encrypted Channel<br>T1008 - Fallback Channels<br>T1104 - Multi-Stage Channels<br>T1095 - Non-Application Layer Protocol<br>T1571 - Non-Standard Port<br>T1572 - Protocol Tunneling<br>T1090 - Proxy<br>T1205 - Traffic Signaling<br>T1102 - Web Service |
| **Entities:**                    | **Type:** Network Connection<br><br>**Fields:** SourceIP, DestinationIP, DestinationPort, Protocol |

[Back to Machine learning-based anomalies list](#machine-learning-based-anomalies)

### Domain generation algorithm (DGA) on DNS domains

**Description:** This machine learning model indicates potential DGA domains from the last day in the DNS logs. The algorithm applies to the DNS records that resolve to IPv4 and IPv6 addresses.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | Customizable machine learning                                      |
| **Data sources:**                | DNS Events                                                         |
| **MITRE ATT&CK tactics:**        | Command and Control                                                |
| **MITRE ATT&CK techniques:**     | T1568 - Dynamic Resolution                                         |
| **Entities:**                    | **Type:** IP<br><br>**Fields:** IP, Location, ASN                  |

[Back to Machine learning-based anomalies list](#machine-learning-based-anomalies)

### Domain Reputation Palo Alto anomaly

**Description:** This anomaly evaluates the reputation for all domains seen specifically for Palo Alto firewall (PAN-OS product). A high anomaly score indicates a low reputation, suggesting that the domain has been observed to host malicious content or is likely to do so.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | Customizable machine learning                                      |
| **Data sources:**                | CommonSecurityLog (PAN)                                            |
| **MITRE ATT&CK tactics:**        | Command and Control                                                |
| **MITRE ATT&CK techniques:**     | T1568 - Dynamic Resolution                                         |
| **Entities:**                    | **Type:** IP<br><br>**Fields:** Address, LastVerdict               |

[Back to Machine learning-based anomalies list](#machine-learning-based-anomalies)

### Excessive data transfer anomaly

**Description:** This algorithm is to detect unusually high data transfer seen in network logs. It uses time series to decompose the data into seasonal, trend and residual components to calculate baseline. Any sudden large deviation from the historical baseline is considered anomalous activity.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | Customizable machine learning                                      |
| **Data sources:**                | CommonSecurityLog (PAN, Zscaler, CEF, CheckPoint, Fortinet)        |
| **MITRE ATT&CK tactics:**        | Exfiltration                                                       |
| **MITRE ATT&CK techniques:**     | T1030 - Data Transfer Size Limits<br>T1041 - Exfiltration Over C2 Channel<br>T1011 - Exfiltration Over Other Network Medium<br>T1567 - Exfiltration Over Web Service<br>T1029 - Scheduled Transfer<br>T1537 - Transfer Data to Cloud Account |
| **Entities:**                    | **Type:** IP<br><br>**Field:** IP                                  |

[Back to Machine learning-based anomalies list](#machine-learning-based-anomalies)

### Excessive Downloads via Palo Alto GlobalProtect

**Description:** This algorithm detects unusually high volume of download per user account via Palo Alto VPN solution. The model is trained on the previous 14 days of the VPN logs. It indicates anomalous high volume of downloads in the last day.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | Customizable machine learning                                      |
| **Data sources:**                | CommonSecurityLog (PAN VPN)                                        |
| **MITRE ATT&CK tactics:**        | Exfiltration                                                       |
| **MITRE ATT&CK techniques:**     | T1030 - Data Transfer Size Limits<br>T1041 - Exfiltration Over C2 Channel<br>T1011 - Exfiltration Over Other Network Medium<br>T1567 - Exfiltration Over Web Service<br>T1029 - Scheduled Transfer<br>T1537 - Transfer Data to Cloud Account |
| **Entities:**                    | **Type:** Account<br><br>**Fields:** Name, IsDomainJoined          |

[Back to Machine learning-based anomalies list](#machine-learning-based-anomalies)

### Excessive uploads via Palo Alto GlobalProtect

**Description:** This algorithm detects unusually high volume of upload per user account via Palo Alto VPN solution. The model is trained on the previous 14 days of the VPN logs. It indicates anomalous high volume of upload in the last day.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | Customizable machine learning                                      |
| **Data sources:**                | CommonSecurityLog (PAN VPN)                                        |
| **MITRE ATT&CK tactics:**        | Exfiltration                                                       |
| **MITRE ATT&CK techniques:**     | T1030 - Data Transfer Size Limits<br>T1041 - Exfiltration Over C2 Channel<br>T1011 - Exfiltration Over Other Network Medium<br>T1567 - Exfiltration Over Web Service<br>T1029 - Scheduled Transfer<br>T1537 - Transfer Data to Cloud Account |
| **Entities:**                    |                                                                    |

[Back to Machine learning-based anomalies list](#machine-learning-based-anomalies)

### Login from an unusual region via Palo Alto GlobalProtect account logins

**Description:** When a Palo Alto GlobalProtect account logs in from a source region that has rarely been logged in from during the last 14 days, an anomaly is triggered. This anomaly may indicate that the account has been compromised.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | Customizable machine learning                                      |
| **Data sources:**                | CommonSecurityLog (PAN VPN)                                        |
| **MITRE ATT&CK tactics:**        | Credential Access<br>Initial Access<br>Lateral Movement            |
| **MITRE ATT&CK techniques:**     | T1133 - External Remote Services                                   |
| **Entities:**                    |                                                                    |

[Back to Machine learning-based anomalies list](#machine-learning-based-anomalies)

### Multi-region logins in a single day via Palo Alto GlobalProtect

**Description:** This algorithm detects a user account which had logins from multiple non-adjacent regions in a single day via Palo Alto VPN.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | Customizable machine learning                                      |
| **Data sources:**                | CommonSecurityLog (PAN VPN)                                        |
| **MITRE ATT&CK tactics:**        | Defense Evasion<br>Initial Access                                  |
| **MITRE ATT&CK techniques:**     | T1078 - Valid Accounts                                             |
| **Entities:**                    |                                                                    |

[Back to Machine learning-based anomalies list](#machine-learning-based-anomalies)

### Potential data staging

**Description:** the algorithm compares the downloads of distinct files on a per user basis from the previous week with the downloads for the current day for each user and an anomaly is triggered when the number of downloads of distinct files exceeds the configured number of standard deviations above the mean. Currently the algorithm only analyze commonly seen files during exfiltration of type documents, images, videos and archives with the extensions ["doc","docx","xls","xlsx","xlsm","ppt","pptx","one","pdf","zip","rar","bmp","jpg","mp3","mp4","mov"].

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | Customizable machine learning                                      |
| **Data sources:**                | Office Activity log (Exchange)                                     |
| **MITRE ATT&CK tactics:**        | Collection                                                         |
| **MITRE ATT&CK techniques:**     | T1074 - Data Staged                                                |
| **Entities:**                    |                                                                    |

[Back to Machine learning-based anomalies list](#machine-learning-based-anomalies)

### Potential domain generation algorithm (DGA) on next-level DNS Domains

**Description:** This machine learning model indicates the next-level domains (third-level and up) of the domain names from the last day of DNS logs are unusual. They could potentially be the output of a domain generation algorithm (DGA). The anomaly applies to the DNS records that resolve to IPv4 and IPv6 addresses.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | Customizable machine learning                                      |
| **Data sources:**                | DNS Events                                                         |
| **MITRE ATT&CK tactics:**        | Command and Control                                                |
| **MITRE ATT&CK techniques:**     | T1568 - Dynamic Resolution                                         |
| **Entities:**                    |                                                                    |

[Back to Machine learning-based anomalies list](#machine-learning-based-anomalies)

### Suspicious geography change in Palo Alto GlobalProtect account logins

**Description:** A match indicates that a user logged in remotely from a country that is different from the country of the user's last remote login. This rule might also indicate an account compromise, particularly if the rule matches occurred closely in time. (include impossible travel)

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | Customizable machine learning                                      |
| **Data sources:**                | CommonSecurityLog (PAN VPN)                                        |
| **MITRE ATT&CK tactics:**        | Initial Access<br>Credential Access                                |
| **MITRE ATT&CK techniques:**     | T1133 - External Remote Services<br>T1078 - Valid Accounts         |
| **Entities:**                    |                                                                    |

[Back to Machine learning-based anomalies list](#machine-learning-based-anomalies)

### Suspicious number of protected documents accessed

**Description:** This algorithm is to detect high volume of access to protected documents in Azure Information Protection (AIP) logs. It considers AIP workload records for a given number of days and determines whether the user performed unusual access to protected documents in a day given his/her historical behavior.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | Customizable machine learning                                      |
| **Data sources:**                | Azure Information Protection logs                                  |
| **MITRE ATT&CK tactics:**        | Collection                                                         |
| **MITRE ATT&CK techniques:**     | T1530 - Data from Cloud Storage Object<br>T1213 - Data from Information Repositories<br>T1005 - Data from Local System<br>T1039 - Data from Network Shared Drive<br>T1114 - Email Collection |
| **Entities:**                    | **Type:** Account<br><br>**Fields:** Name, AadTenantId, IsDomainJoined |

[Back to Machine learning-based anomalies list](#machine-learning-based-anomalies)

### Suspicious volume of AWS API calls from Non-AWS source IP address from a user account id per workspace on a daily basis

**Description:** This algorithm detects an unusually high volume of AWS API calls from Source IPs not in AWS Source IP ranges from one user account per workspace within the last day. The model is trained on the previous 21 days of AWS cloud trail log events on source IP address basis. This activity may indicate that the user account is compromised.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | Customizable machine learning                                      |
| **Data sources:**                | AWS CloudTrail logs                                                |
| **MITRE ATT&CK tactics:**        | Initial Access                                                     |
| **MITRE ATT&CK techniques:**     | T1078 - Valid Accounts                                             |
| **Entities:**                    |                                                                    |

[Back to Machine learning-based anomalies list](#machine-learning-based-anomalies)

### Suspicious volume of AWS cloud trail logs events of group user account by EventTypeName

**Description:** This algorithm detects an unusually high volume of AWS cloud trail log events per group user account by different event types (AwsApiCall, AwsServiceEvent, AwsConsoleSignIn, AwsConsoleAction) within the last day. The model is trained on the previous 21 days of AWS cloud trail log events on a group user account basis. This activity may indicate that the account is compromised.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | Customizable machine learning                                      |
| **Data sources:**                | AWS CloudTrail logs                                                |
| **MITRE ATT&CK tactics:**        | Initial Access                                                     |
| **MITRE ATT&CK techniques:**     | T1078 - Valid Accounts                                             |
| **Entities:**                    | **Type:** Account<br><br>**Fields:** Name, NTDomain, DnsDomain, UPNSuffix, Host, Sid, AadTenantId, AaadUserId, PUID, IsDomainJoined, ObjectGuid |

[Back to Machine learning-based anomalies list](#machine-learning-based-anomalies)

### Suspicious volume of AWS write API calls from a user account

**Description:** This algorithm detects an unusually high volume of AWS write API calls per user account within the last day. The model is trained on the previous 21 days of AWS cloud trail log events on a user account basis. This activity may indicate that the account is compromised.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | Customizable machine learning                                      |
| **Data sources:**                | AWS CloudTrail logs                                                |
| **MITRE ATT&CK tactics:**        | Initial Access                                                     |
| **MITRE ATT&CK techniques:**     | T1078 - Valid Accounts                                             |
| **Entities:**                    |                                                                    |

[Back to Machine learning-based anomalies list](#machine-learning-based-anomalies)

### Suspicious volume of failed login attempts to AWS Console by each group user account

**Description:** This algorithm detects an unusually high volume of AWS cloud trail log console failed login events per group user account within the last day. The model is trained on the previous 21 days of AWS cloud trail log events on group user account basis. This activity may indicate that the account is compromised.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | Customizable machine learning                                      |
| **Data sources:**                | AWS CloudTrail logs                                                |
| **MITRE ATT&CK tactics:**        | Initial Access                                                     |
| **MITRE ATT&CK techniques:**     | T1078 - Valid Accounts                                             |
| **Entities:**                    | **Type:** Account<br><br>**Fields:** Name, IsDomainJoined, LastVerdict |

[Back to Machine learning-based anomalies list](#machine-learning-based-anomalies)

### Suspicious volume of failed login attempts to AWS Console by each source IP address

**Description:** This algorithm detects an unusually high volume of AWS cloud trail log console failed login events per source IP address within the last day. The model is trained on the previous 21 days of AWS cloud trail log events on source IP address basis. This activity may indicate that the IP address is compromised.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | Customizable machine learning                                      |
| **Data sources:**                | AWS CloudTrail logs                                                |
| **MITRE ATT&CK tactics:**        | Initial Access                                                     |
| **MITRE ATT&CK techniques:**     | T1078 - Valid Accounts                                             |
| **Entities:**                    | **Type:** IP<br><br>**Fields:** Address, LastVerdict               |

[Back to Machine learning-based anomalies list](#machine-learning-based-anomalies)

### Suspicious volume of logins to computer

**Description:** This algorithm detects an unusually high volume of successful logins per computer. The model is trained on the previous 21 days of security event ID 4624 on a computer. It indicates anomalous high volume of successful logins in the last day

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | Customizable machine learning                                      |
| **Data sources:**                | Windows Security logs                                              |
| **MITRE ATT&CK tactics:**        | Initial Access                                                     |
| **MITRE ATT&CK techniques:**     | T1078 - Valid Accounts                                             |
| **Entities:**                    | **Type:** Account<br><br>**Fields:** Name, IsDomainJoined          |

[Back to Machine learning-based anomalies list](#machine-learning-based-anomalies)

### Suspicious volume of logins to computer with elevated token

**Description:** This algorithm detects an unusually high volume of successful logins with elevated token per user account. The model is trained on the previous 21 days of security event ID 4624 on an account. It indicates anomalous high volume of successful logins with administrator privileges in the last day.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | Customizable machine learning                                      |
| **Data sources:**                | Windows Security logs                                              |
| **MITRE ATT&CK tactics:**        | Initial Access                                                     |
| **MITRE ATT&CK techniques:**     | T1078 - Valid Accounts                                             |
| **Entities:**                    |                                                                    |

[Back to Machine learning-based anomalies list](#machine-learning-based-anomalies)

### Suspicious volume of logins to user account

**Description:** This algorithm detects an unusually high volume of successful logins per user account. The model is trained on the previous 21 days of security event ID 4624 on an account. It indicates anomalous high volume of successful logins in the last day

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | Customizable machine learning                                      |
| **Data sources:**                | Windows Security logs                                              |
| **MITRE ATT&CK tactics:**        | Initial Access                                                     |
| **MITRE ATT&CK techniques:**     | T1078 - Valid Accounts                                             |
| **Entities:**                    |                                                                    |

[Back to Machine learning-based anomalies list](#machine-learning-based-anomalies)

### Suspicious volume of logins to user account by logon types

**Description:** This algorithm detects an unusually high volume of successful logins per user account by different logon types. The model is trained on the previous 21 days of security event ID 4624 on an account. It indicates anomalous high volume of successful logins in the last day.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | Customizable machine learning                                      |
| **Data sources:**                | Windows Security logs                                              |
| **MITRE ATT&CK tactics:**        | Initial Access                                                     |
| **MITRE ATT&CK techniques:**     | T1078 - Valid Accounts                                             |
| **Entities:**                    | **Type:** Account<br><br>**Fields:** Name, IsDomainJoined          |

[Back to Machine learning-based anomalies list](#machine-learning-based-anomalies)

### Suspicious volume of logins to user account with elevated token

**Description:** This algorithm detects an unusually high volume of successful logins with elevated token per user account. The model is trained on the previous 21 days of security event ID 4624 on an account. It indicates anomalous high volume of successful logins with administrator privileges in the last day.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | Customizable machine learning                                      |
| **Data sources:**                | Windows Security logs                                              |
| **MITRE ATT&CK tactics:**        | Initial Access                                                     |
| **MITRE ATT&CK techniques:**     | T1078 - Valid Accounts                                             |
| **Entities:**                    |                                                                    |

[Back to Machine learning-based anomalies list](#machine-learning-based-anomalies)

### Unusual external firewall alarm detected

**Description:** This algorithm identifies unusual external firewall alarms which are threat signatures released by a firewall vendor. The anomaly takes last 7 days activities to calculate top 10 noisy signatures and also noisy source hosts which are repeatedly seen triggering threat signatures. After excluding both type of noisy events, it triggers an anomaly only after exceeding the threshold of number of signatures triggered in a single day.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | Customizable machine learning                                      |
| **Data sources:**                | CommonSecurityLog (PAN)                                            |
| **MITRE ATT&CK tactics:**        | Discovery<br>Command and Control                                   |
| **MITRE ATT&CK techniques:**     | **Discovery:**<br>T1046 - Network Service Scanning<br>T1135 - Network Share Discovery<br><br>**Command and Control:**<br>T1071 - Application Layer Protocol<br>T1095 - Non-Application Layer Protocol<br>T1571 - Non-Standard Port |
| **Entities:**                    | **Type:** IP<br><br>**Field:** IP                                  |

[Back to Machine learning-based anomalies list](#machine-learning-based-anomalies)

### Unusual mass downgrade AIP label

**Description:** This algorithm is to detect unusual high volume of downgrade label activity in Azure Information Protection (AIP) logs. It considers "AIP" workload records for a given number of days and determines the sequence of activity performed on documents along with the label applied to classify unusual volume of downgrade activity.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | Customizable machine learning                                      |
| **Data sources:**                | Azure Information Protection logs                                  |
| **MITRE ATT&CK tactics:**        | Collection                                                         |
| **MITRE ATT&CK techniques:**     | T1530 - Data from Cloud Storage Object<br>T1213 - Data from Information Repositories<br>T1005 - Data from Local System<br>T1039 - Data from Network Shared Drive<br>T1114 - Email Collection |
| **Entities:**                    |                                                                    |

[Back to Machine learning-based anomalies list](#machine-learning-based-anomalies)

### Unusual network communication on commonly used ports

**Description:** This algorithm identifies unusual network communication on commonly used ports, comparing daily traffic to a baseline from the previous 7 days. This includes traffic on commonly used ports (22, 53, 80, 443, 8080, 8888), and compares daily traffic to the mean and standard deviation of several network traffic attributes calculated over the baseline period. The traffic attributes considered are daily total events, daily data transfer and number of distinct source IP addresses per port. An anomaly is triggered when the daily values are greater than the configured number of standard deviations above the mean.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | Customizable machine learning                                      |
| **Data sources:**                | CommonSecurityLog (PAN, Zscaler, CheckPoint, Fortinet)             |
| **MITRE ATT&CK tactics:**        | Command and Control<br>Exfiltration                                |
| **MITRE ATT&CK techniques:**     | **Command and Control:**<br>T1071 - Application Layer Protocol<br><br>**Exfiltration:**<br>T1030 - Data Transfer Size Limits                                  |
| **Entities:**                    | **Type:** IP<br><br>**Fields:** Address, Location                  |

[Back to Machine learning-based anomalies list](#machine-learning-based-anomalies)

### Unusual network volume anomaly

**Description:** This algorithm is to detect unusually high volume of connections in network logs. It uses time series to decompose the data into seasonal, trend and residual components to calculate baseline. Any sudden large deviation from the historical baseline is considered as anomalous activity.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | Customizable machine learning                                      |
| **Data sources:**                | CommonSecurityLog (PAN, Zscaler, CEF, CheckPoint, Fortinet)        |
| **MITRE ATT&CK tactics:**        | Exfiltration                                                       |
| **MITRE ATT&CK techniques:**     | T1030 - Data Transfer Size Limits                                  |
| **Entities:**                    | **Type:** IP<br><br>**Field:** IP                                  |

[Back to Machine learning-based anomalies list](#machine-learning-based-anomalies)

### Unusual web traffic detected with IP in URL path

**Description:** This algorithm identifies unusual web requests which have a direct IP address as the host. This can be an attempt to bypass URL reputation services etc for malicious purposes. The anomaly filters all web requests with IP addresses in the URL path and compares them with the previous week of data to exclude known benign traffic. After excluding known benign traffic, it triggers an anomaly only after exceeding certain thresholds with configured values such as total web requests, numbers of URLs seen with same host destination IP address, and number of distinct source IPs within the set of URLs with the same destination IP address.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | Customizable machine learning                                      |
| **Data sources:**                | CommonSecurityLog (PAN, Zscaler, CheckPoint, Fortinet)             |
| **MITRE ATT&CK tactics:**        | Command and Control<br>Initial Access                              |
| **MITRE ATT&CK techniques:**     | **Command and Control:**<br>T1071 - Application Layer Protocol<br><br>**Initial Access:**<br>T1189 - Drive-by Compromise                                      |
| **Entities:**                    | **Type:** Network Connection, IP<br><br>**Field:** SourceIP, IP, DestinationIP, DestinationPort, Protocol |

[Back to Machine learning-based anomalies list](#machine-learning-based-anomalies)

## Next steps

Now you've learned more about machine learning-based anomaly detection, you might be interested in the following quickstart to learn how to get visibility into your data and potential threats: [Get started with Microsoft Sentinel](get-visibility.md).

If you're ready to investigate the incidents that are created for you, see the following tutorial: [Investigate incidents with Microsoft Sentinel](investigate-cases.md).
