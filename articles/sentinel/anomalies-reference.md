---
title: Anomalies detected by the Microsoft Sentinel machine learning engine
description: Learn about the anomalies detected by Microsoft Sentinel's machine learning engines.
author: guywi-ms
ms.author: guywild
ms.topic: reference
ms.date: 09/08/2024

#Customer intent: As a security analyst, I want to understand the types of anomalies detected by machine learning models in my SIEM solution so that I can effectively monitor and respond to potential security threats.

---

# Anomalies detected by the Microsoft Sentinel machine learning engine

Microsoft Sentinel detects anomalies by analyzing the behavior of users in an environment over a period of time and constructing a baseline of legitimate activity. Once the baseline is established, any activity outside the normal parameters is considered anomalous and therefore suspicious.

Microsoft Sentinel uses two models to create baselines and detect anomalies.

- [UEBA anomalies](#ueba-anomalies)
- [Machine learning-based anomalies](#machine-learning-based-anomalies)

This article lists the anomalies that Microsoft Sentinel detects using various machine learning models.


In the [Anomalies](/azure/azure-monitor/reference/tables/anomalies) table:
- The `rulename` column indicates the rule Sentinel used to identify each anomaly. 
- The `score` column contains a numerical value between 0 and 1, which quantifies the degree of deviation from the expected behavior. Higher scores indicate greater deviation from the baseline and are more likely to be true anomalies. Lower scores might still be anomalous, but are less likely to be significant or actionable.


> [!NOTE]
> These anomaly detections are discontinued as of March 8, 2026, due to low quality of results:
> - Domain generation algorithm (DGA) on DNS domains
> - Potential domain generation algorithm (DGA) on next-level DNS Domains

[!INCLUDE [unified-soc-preview](includes/unified-soc-preview.md)]

## UEBA anomalies

Sentinel UEBA detects anomalies based on dynamic baselines created for each entity across various data inputs. Each entity's baseline behavior is set according to its own historical activities, those of its peers, and those of the organization as a whole. Anomalies can be triggered by the correlation of different attributes such as action type, geo-location, device, resource, ISP, and more.

You must [enable UEBA and anomaly detection in your Sentinel workspace](enable-entity-behavior-analytics.md) to detect UEBA anomalies.

UEBA detects anomalies based on these anomaly rules:

- [UEBA Anomalous Account Access Removal](#ueba-anomalous-account-access-removal)
- [UEBA Anomalous Account Creation](#ueba-anomalous-account-creation)
- [UEBA Anomalous Account Deletion](#ueba-anomalous-account-deletion)
- [UEBA Anomalous Account Manipulation](#ueba-anomalous-account-manipulation)
- [UEBA Anomalous Activity in GCP Audit Logs (Preview)](#ueba-anomalous-activity-in-gcp-audit-logs-preview)
- [UEBA Anomalous Activity in Okta_CL (Preview)](#ueba-anomalous-activity-in-okta_cl-preview)
- [UEBA Anomalous Authentication (Preview)](#ueba-anomalous-authentication-preview)
- [UEBA Anomalous Code Execution](#ueba-anomalous-code-execution)
- [UEBA Anomalous Data Destruction](#ueba-anomalous-data-destruction)
- [UEBA Anomalous Data Transfer from Amazon S3 (Preview)](#ueba-anomalous-data-transfer-from-amazon-s3-preview)
- [UEBA Anomalous Defensive Mechanism Modification](#ueba-anomalous-defensive-mechanism-modification)
- [UEBA Anomalous Failed Sign-in](#ueba-anomalous-failed-sign-in)
- [UEBA Anomalous Federated or SAML Identity Activity in AwsCloudTrail (Preview)](#ueba-anomalous-federated-or-saml-identity-activity-in-awscloudtrail-preview)
- [UEBA Anomalous IAM Privilege Modification in AwsCloudTrail (Preview)](#ueba-anomalous-iam-privilege-modification-in-awscloudtrail-preview)
- [UEBA Anomalous Logon in AwsCloudTrail (Preview)](#ueba-anomalous-logon-in-awscloudtrail-preview)
- [UEBA Anomalous MFA Failures in Okta_CL (Preview)](#ueba-anomalous-mfa-failures-in-okta_cl-preview)
- [UEBA Anomalous Password Reset](#ueba-anomalous-password-reset)
- [UEBA Anomalous Privilege Granted](#ueba-anomalous-privilege-granted)
- [UEBA Anomalous Secret or KMS Key Access in AwsCloudTrail (Preview)](#ueba-anomalous-secret-or-kms-key-access-in-awscloudtrail-preview)
- [UEBA Anomalous Sign-in](#ueba-anomalous-sign-in)
- [UEBA Anomalous STS AssumeRole Behavior in AwsCloudTrail (Preview)](#ueba-anomalous-sts-assumerole-behavior-in-awscloudtrail-preview)

Sentinel uses enriched data from the BehaviorAnalytics table to identify UEBA anomalies with a confidence score specific to your tenant and source. 

### UEBA Anomalous Account Access Removal

**Description:** An attacker may interrupt the availability of system and network resources by blocking access to accounts used by legitimate users. The attacker might delete, lock, or manipulate an account (for example, by changing its credentials) to remove access to it.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | UEBA                                                               |
| **Data sources:**                | Azure Activity logs                                                |
| **MITRE ATT&CK tactics:**        | Impact                                                             |
| **MITRE ATT&CK techniques:**     | T1531 - Account Access Removal                                     |
| **Activity:**                    | Microsoft.Authorization/roleAssignments/delete<br>Log Out          |

[Back to UEBA anomalies list](#ueba-anomalies) | [Back to top](#anomalies-detected-by-the-microsoft-sentinel-machine-learning-engine)

### UEBA Anomalous Account Creation

**Description:** Adversaries may create an account to maintain access to targeted systems. With a sufficient level of access, creating such accounts may be used to establish secondary credentialed access without requiring persistent remote access tools to be deployed on the system.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | UEBA                                                               |
| **Data sources:**                | Microsoft Entra audit logs                                         |
| **MITRE ATT&CK tactics:**        | Persistence                                                        |
| **MITRE ATT&CK techniques:**     | T1136 - Create Account                                             |
| **MITRE ATT&CK sub-techniques:** | Cloud Account                                                      |
| **Activity:**                    | Core Directory/UserManagement/Add user                             |

[Back to UEBA anomalies list](#ueba-anomalies) | [Back to top](#anomalies-detected-by-the-microsoft-sentinel-machine-learning-engine)

### UEBA Anomalous Account Deletion

**Description:** Adversaries may interrupt availability of system and network resources by inhibiting access to accounts utilized by legitimate users. Accounts may be deleted, locked, or manipulated (ex: changed credentials) to remove access to accounts.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | UEBA                                                               |
| **Data sources:**                | Microsoft Entra audit logs                                         |
| **MITRE ATT&CK tactics:**        | Impact                                                             |
| **MITRE ATT&CK techniques:**     | T1531 - Account Access Removal                                     |
| **Activity:**                    | Core Directory/UserManagement/Delete user<br>Core Directory/Device/Delete user<br>Core Directory/UserManagement/Delete user |

[Back to UEBA anomalies list](#ueba-anomalies) | [Back to top](#anomalies-detected-by-the-microsoft-sentinel-machine-learning-engine)

### UEBA Anomalous Account Manipulation

**Description:** Adversaries may manipulate accounts to maintain access to target systems. These actions include adding new accounts to high-privileged groups. Dragonfly 2.0, for example, added newly created accounts to the administrators group to maintain elevated access. The query below generates an output of all high-Blast Radius users performing "Update user" (name change) to privileged role, or ones that changed users for the first time.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | UEBA                                                               |
| **Data sources:**                | Microsoft Entra audit logs                                         |
| **MITRE ATT&CK tactics:**        | Persistence                                                        |
| **MITRE ATT&CK techniques:**     | T1098 - Account Manipulation                                       |
| **Activity:**                    | Core Directory/UserManagement/Update user                          |

[Back to UEBA anomalies list](#ueba-anomalies) | [Back to top](#anomalies-detected-by-the-microsoft-sentinel-machine-learning-engine)

### UEBA Anomalous Activity in GCP Audit Logs (Preview)

**Description:** Failed access attempts to Google Cloud Platform (GCP) resources based on IAM-related entries in GCP Audit Logs. These failures might reflect misconfigured permissions, attempts to access unauthorized services, or early-stage attacker behaviors like privilege probing or persistence through service accounts.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | UEBA                                                               |
| **Data sources:**                | GCP Audit Logs                                                     |
| **MITRE ATT&CK tactics:**        | Discovery                                                          |
| **MITRE ATT&CK techniques:**     | T1087 – Account Discovery, T1069 – Permission Groups Discovery     |
| **Activity:**                    | iam.googleapis.com                                                 |

[Back to UEBA anomalies list](#ueba-anomalies) | [Back to top](#anomalies-detected-by-the-microsoft-sentinel-machine-learning-engine)

### UEBA Anomalous Activity in Okta_CL (Preview)

**Description:** Unexpected authentication activity or security-related configuration changes in Okta, including modifications to sign-on rules, multifactor authentication (MFA) enforcement, or administrative privileges. Such activity might indicate attempts to alter identity security controls or maintain access through privileged changes.

| Attribute                        | Value                                                               |
| -------------------------------- | ------------------------------------------------------------------- |
| **Anomaly type:**                | UEBA                                                                |
| **Data sources:**                | Okta Cloud Logs                                                     |
| **MITRE ATT&CK tactics:**        | Persistence, Privilege Escalation                                   |
| **MITRE ATT&CK techniques:**     | T1098 - Account Manipulation, T1556 - Modify Authentication Process |
| **Activity:**                    | user.session.impersonation.grant<br>user.session.impersonation.initiate<br>user.session.start<br>app.oauth2.admin.consent.grant_success<br>app.oauth2.authorize.code_success<br>device.desktop_mfa.recovery_pin.generate<br>user.authentication.auth_via_mfa<br>user.mfa.attempt_bypass<br>user.mfa.factor.deactivate<br>user.mfa.factor.reset_all<br>user.mfa.factor.suspend<br>user.mfa.okta_verify |

[Back to UEBA anomalies list](#ueba-anomalies) | [Back to top](#anomalies-detected-by-the-microsoft-sentinel-machine-learning-engine)


### UEBA Anomalous Authentication (Preview)

**Description:** Unusual authentication activity across signals from Microsoft Defender for Endpoint and Microsoft Entra ID, including device logons, managed identity sign-ins, and service principal authentications from Microsoft Entra ID. These anomalies may suggest credential misuse, non-human identity abuse, or lateral movement attempts outside typical access patterns.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | UEBA                                                               |
| **Data sources:**                | Microsoft Defender for Endpoint, Microsoft Entra ID                |
| **MITRE ATT&CK tactics:**        | Initial Access                                                     |
| **MITRE ATT&CK techniques:**     | T1078 - Valid Accounts                                             |
| **Activity:**                    |                                                                    |

[Back to UEBA anomalies list](#ueba-anomalies) | [Back to top](#anomalies-detected-by-the-microsoft-sentinel-machine-learning-engine)

### UEBA Anomalous Code Execution

**Description:** Adversaries may abuse command and script interpreters to execute commands, scripts, or binaries. These interfaces and languages provide ways of interacting with computer systems and are a common feature across many different platforms.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | UEBA                                                               |
| **Data sources:**                | Azure Activity logs                                                |
| **MITRE ATT&CK tactics:**        | Execution                                                          |
| **MITRE ATT&CK techniques:**     | T1059 - Command and Scripting Interpreter                          |
| **MITRE ATT&CK sub-techniques:** | PowerShell                                                         |
| **Activity:**                    | Microsoft.Compute/virtualMachines/runCommand/action                |

[Back to UEBA anomalies list](#ueba-anomalies) | [Back to top](#anomalies-detected-by-the-microsoft-sentinel-machine-learning-engine)

### UEBA Anomalous Data Destruction

**Description:** Adversaries may destroy data and files on specific systems or in large numbers on a network to interrupt availability to systems, services, and network resources. Data destruction is likely to render stored data irrecoverable by forensic techniques through overwriting files or data on local and remote drives.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | UEBA                                                               |
| **Data sources:**                | Azure Activity logs                                                |
| **MITRE ATT&CK tactics:**        | Impact                                                             |
| **MITRE ATT&CK techniques:**     | T1485 - Data Destruction                                           |
| **Activity:**                    | Microsoft.Compute/disks/delete<br>Microsoft.Compute/galleries/images/delete<br>Microsoft.Compute/hostGroups/delete<br>Microsoft.Compute/hostGroups/hosts/delete<br>Microsoft.Compute/images/delete<br>Microsoft.Compute/virtualMachines/delete<br>Microsoft.Compute/virtualMachineScaleSets/delete<br>Microsoft.Compute/virtualMachineScaleSets/virtualMachines/delete<br>Microsoft.Devices/digitalTwins/Delete<br>Microsoft.Devices/iotHubs/Delete<br>Microsoft.KeyVault/vaults/delete<br>Microsoft.Logic/integrationAccounts/delete  <br>Microsoft.Logic/integrationAccounts/maps/delete <br>Microsoft.Logic/integrationAccounts/schemas/delete <br>Microsoft.Logic/integrationAccounts/partners/delete <br>Microsoft.Logic/integrationServiceEnvironments/delete<br>Microsoft.Logic/workflows/delete<br>Microsoft.Resources/subscriptions/resourceGroups/delete<br>Microsoft.Sql/instancePools/delete<br>Microsoft.Sql/managedInstances/delete<br>Microsoft.Sql/managedInstances/administrators/delete<br>Microsoft.Sql/managedInstances/databases/delete<br>Microsoft.Storage/storageAccounts/delete<br>Microsoft.Storage/storageAccounts/blobServices/containers/blobs/delete<br>Microsoft.Storage/storageAccounts/fileServices/fileshares/files/delete<br>Microsoft.Storage/storageAccounts/blobServices/containers/delete<br>Microsoft.AAD/domainServices/delete |

[Back to UEBA anomalies list](#ueba-anomalies) | [Back to top](#anomalies-detected-by-the-microsoft-sentinel-machine-learning-engine)

### UEBA Anomalous Data Transfer from Amazon S3 (Preview)

**Description:** Deviations in data access or download patterns from Amazon Simple Storage Service (S3). The anomaly is determined using behavioral baselines for each user, service, and resource, comparing data transfer volume, frequency, and accessed object count against historical norms. Significant deviations - such as first-time bulk access, unusually large data retrievals, or activity from new locations or applications - might indicate potential data exfiltration, policy violations, or misuse of compromised credentials.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | UEBA                                                               |
| **Data sources:**                | AWS CloudTrail logs                                                |
| **MITRE ATT&CK tactics:**        | Exfiltration                                                       |
| **MITRE ATT&CK techniques:**     | T1567 - Exfiltration Over Web Service                             |
| **Activity:**                    | PutObject, CopyObject, UploadPart, UploadPartCopy, CreateJob, CompleteMultipartUpload |

[Back to UEBA anomalies list](#ueba-anomalies) | [Back to top](#anomalies-detected-by-the-microsoft-sentinel-machine-learning-engine)

### UEBA Anomalous Defensive Mechanism Modification

**Description:** Adversaries may disable security tools to avoid possible detection of their tools and activities.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | UEBA                                                               |
| **Data sources:**                | Azure Activity logs                                                |
| **MITRE ATT&CK tactics:**        | Defense Evasion                                                    |
| **MITRE ATT&CK techniques:**     | T1562 - Impair Defenses                                            |
| **MITRE ATT&CK sub-techniques:** | Disable or Modify Tools<br>Disable or Modify Cloud Firewall        |
| **Activity:**                    | Microsoft.Sql/managedInstances/databases/vulnerabilityAssessments/rules/baselines/delete<br>Microsoft.Sql/managedInstances/databases/vulnerabilityAssessments/delete<br>Microsoft.Network/networkSecurityGroups/securityRules/delete<br>Microsoft.Network/networkSecurityGroups/delete<br>Microsoft.Network/ddosProtectionPlans/delete<br>Microsoft.Network/ApplicationGatewayWebApplicationFirewallPolicies/delete<br>Microsoft.Network/applicationSecurityGroups/delete<br>Microsoft.Authorization/policyAssignments/delete<br>Microsoft.Sql/servers/firewallRules/delete<br>Microsoft.Network/firewallPolicies/delete<br>Microsoft.Network/azurefirewalls/delete |

[Back to UEBA anomalies list](#ueba-anomalies) | [Back to top](#anomalies-detected-by-the-microsoft-sentinel-machine-learning-engine)

### UEBA Anomalous Failed Sign-in

**Description:** Adversaries with no prior knowledge of legitimate credentials within the system or environment may guess passwords to attempt access to accounts.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | UEBA                                                               |
| **Data sources:**                | Microsoft Entra sign-in logs<br>Windows Security logs              |
| **MITRE ATT&CK tactics:**        | Credential Access                                                  |
| **MITRE ATT&CK techniques:**     | T1110 - Brute Force                                                |
| **Activity:**                    | **Microsoft Entra ID:** Sign-in activity<br>**Windows Security:** Failed login (Event ID 4625) |

[Back to UEBA anomalies list](#ueba-anomalies) | [Back to top](#anomalies-detected-by-the-microsoft-sentinel-machine-learning-engine)

### UEBA Anomalous Federated or SAML Identity Activity in AwsCloudTrail (Preview)

**Description:** Unusual activity by federated or Security Assertion Markup Language (SAML)-based identities involving first-time actions, unfamiliar geo-locations, or excessive API calls. Such anomalies can indicate session hijacking or misuse of federated credentials.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | UEBA                                                               |
| **Data sources:**                | AWS CloudTrail logs                                                |
| **MITRE ATT&CK tactics:**        | Initial Access, Persistence                                        |
| **MITRE ATT&CK techniques:**     | T1078 - Valid Accounts, T1550 - Use Alternate Authentication Material |
| **Activity:**                    | UserAuthentication (EXTERNAL_IDP)                                  |

[Back to UEBA anomalies list](#ueba-anomalies) | [Back to top](#anomalies-detected-by-the-microsoft-sentinel-machine-learning-engine)

### UEBA Anomalous IAM Privilege Modification in AwsCloudTrail (Preview)

**Description:** Deviations in Identity and Access Management (IAM) administrative behavior, such as first-time creation, modification, or deletion of roles, users, and groups, or attachment of new inline or managed policies. These might indicate privilege escalation or policy abuse.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | UEBA                                                               |
| **Data sources:**                | AWS CloudTrail logs                                                |
| **MITRE ATT&CK tactics:**        | Privilege Escalation, Persistence                                  |
| **MITRE ATT&CK techniques:**     | T1136 - Create Account, T1098 - Account Manipulation               |
| **Activity:**                    | Create, Add, Attach, Delete, Deactivate, Put, and Update operations on iam.amazonaws.com, sso-directory.amazonaws.com |

[Back to UEBA anomalies list](#ueba-anomalies) | [Back to top](#anomalies-detected-by-the-microsoft-sentinel-machine-learning-engine)

### UEBA Anomalous Logon in AwsCloudTrail (Preview)

**Description:** Unusual logon activity in Amazon Web Services (AWS) services based on CloudTrail events such as ConsoleLogin and other authentication-related attributes. Anomalies are determined by deviations in user behavior based on attributes like geolocation, device fingerprint, ISP, and access method, and may indicate unauthorized access attempts or potential policy violations.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | UEBA                                                               |
| **Data sources:**                | AWS CloudTrail logs                                                |
| **MITRE ATT&CK tactics:**        | Initial Access                                                     |
| **MITRE ATT&CK techniques:**     | T1078 - Valid Accounts                                             |
| **Activity:**                    | ConsoleLogin                                                       |

[Back to UEBA anomalies list](#ueba-anomalies) | [Back to top](#anomalies-detected-by-the-microsoft-sentinel-machine-learning-engine)


### UEBA Anomalous MFA Failures in Okta_CL (Preview)

**Description:** Unusual patterns of failed MFA attempts in Okta. These anomalies might result from account misuse, credential stuffing, or improper use of trusted device mechanisms, and often reflect early-stage adversary behaviors, such as testing stolen credentials or probing identity safeguards.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | UEBA                                                               |
| **Data sources:**                | Okta Cloud Logs                                                    |
| **MITRE ATT&CK tactics:**        | Persistence, Privilege Escalation                                  |
| **MITRE ATT&CK techniques:**     | T1078 - Valid Accounts, T1556 - Modify Authentication Process      |
| **Activity:**                    | app.oauth2.admin.consent.grant_success<br>app.oauth2.authorize.code_success<br>device.desktop_mfa.recovery_pin.generate<br>user.authentication.auth_via_mfa<br>user.mfa.attempt_bypass<br>user.mfa.factor.deactivate<br>user.mfa.factor.reset_all<br>user.mfa.factor.suspend<br>user.mfa.okta_verify |

[Back to UEBA anomalies list](#ueba-anomalies) | [Back to top](#anomalies-detected-by-the-microsoft-sentinel-machine-learning-engine)

### UEBA Anomalous Password Reset

**Description:** Adversaries may interrupt availability of system and network resources by inhibiting access to accounts utilized by legitimate users. Accounts may be deleted, locked, or manipulated (ex: changed credentials) to remove access to accounts.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | UEBA                                                               |
| **Data sources:**                | Microsoft Entra audit logs                                         |
| **MITRE ATT&CK tactics:**        | Impact                                                             |
| **MITRE ATT&CK techniques:**     | T1531 - Account Access Removal                                     |
| **Activity:**                    | Core Directory/UserManagement/User password reset                  |

[Back to UEBA anomalies list](#ueba-anomalies) | [Back to top](#anomalies-detected-by-the-microsoft-sentinel-machine-learning-engine)

### UEBA Anomalous Privilege Granted

**Description:** Adversaries may add adversary-controlled credentials for Azure Service Principals in addition to existing legitimate credentials to maintain persistent access to victim Azure accounts.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | UEBA                                                               |
| **Data sources:**                | Microsoft Entra audit logs                                         |
| **MITRE ATT&CK tactics:**        | Persistence                                                        |
| **MITRE ATT&CK techniques:**     | T1098 - Account Manipulation                                       |
| **MITRE ATT&CK sub-techniques:** | Additional Azure Service Principal Credentials                     |
| **Activity:**                    | Account provisioning/Application Management/Add app role assignment to service principal |

[Back to UEBA anomalies list](#ueba-anomalies) | [Back to top](#anomalies-detected-by-the-microsoft-sentinel-machine-learning-engine)

### UEBA Anomalous Secret or KMS Key Access in AwsCloudTrail (Preview)

**Description:** Suspicious access to AWS Secrets Manager, or Key Management Service (KMS) resources. First-time access or unusually high access frequency might indicate credential harvesting or data exfiltration attempts.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | UEBA                                                               |
| **Data sources:**                | AWS CloudTrail logs                                                |
| **MITRE ATT&CK tactics:**        | Credential Access, Collection                                      |
| **MITRE ATT&CK techniques:**     | T1555 - Credentials from Password Stores                          |
| **Activity:**                    | GetSecretValue<br>BatchGetSecretValue <br>ListKeys<br>ListSecrets<br>PutSecretValue<br>CreateSecret<br>UpdateSecret<br>DeleteSecret<br>CreateKey<br>PutKeyPolicy |

[Back to UEBA anomalies list](#ueba-anomalies) | [Back to top](#anomalies-detected-by-the-microsoft-sentinel-machine-learning-engine)

### UEBA Anomalous Sign-in

**Description:** Adversaries may steal the credentials of a specific user or service account using Credential Access techniques or capture credentials earlier in their reconnaissance process through social engineering for means of gaining Persistence.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | UEBA                                                               |
| **Data sources:**                | Microsoft Entra sign-in logs<br>Windows Security logs              |
| **MITRE ATT&CK tactics:**        | Persistence                                                        |
| **MITRE ATT&CK techniques:**     | T1078 - Valid Accounts                                             |
| **Activity:**                    | **Microsoft Entra ID:** Sign-in activity<br>**Windows Security:** Successful login (Event ID 4624) |

[Back to UEBA anomalies list](#ueba-anomalies) | [Back to top](#anomalies-detected-by-the-microsoft-sentinel-machine-learning-engine)

### UEBA Anomalous STS AssumeRole Behavior in AwsCloudTrail (Preview)

**Description:** Anomalous usage of AWS Security Token Service (STS) AssumeRole actions, especially involving privileged roles or cross-account access. Deviations from typical usage might indicate privilege escalation or identity compromise.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | UEBA                                                               |
| **Data sources:**                | AWS CloudTrail logs                                                |
| **MITRE ATT&CK tactics:**        | Privilege Escalation, Defense Evasion                             |
| **MITRE ATT&CK techniques:**     | T1548 - Abuse Elevation Control Mechanism, T1078 - Valid Accounts  |
| **Activity:**                    | AssumeRole<br>AssumeRoleWithSAML<br>AssumeRoleWithWebIdentity<br>AssumeRoot |

[Back to UEBA anomalies list](#ueba-anomalies) | [Back to top](#anomalies-detected-by-the-microsoft-sentinel-machine-learning-engine)

## Machine learning-based anomalies

Microsoft Sentinel's customizable, machine learning-based anomalies can identify anomalous behavior with analytics rule templates that can be put to work right out of the box. While anomalies don't necessarily indicate malicious or even suspicious behavior by themselves, they can be used to improve detections, investigations, and threat hunting.

- [Anomalous Azure operations](#anomalous-azure-operations)
- [Anomalous Code Execution](#anomalous-code-execution)
- [Anomalous local account creation](#anomalous-local-account-creation)
- [Anomalous user activities in Office Exchange](#anomalous-user-activities-in-office-exchange)
- [Attempted computer brute force](#attempted-computer-brute-force)
- [Attempted user account brute force](#attempted-user-account-brute-force)
- [Attempted user account brute force per login type](#attempted-user-account-brute-force-per-login-type)
- [Attempted user account brute force per failure reason](#attempted-user-account-brute-force-per-failure-reason)
- [Detect machine generated network beaconing behavior](#detect-machine-generated-network-beaconing-behavior)
- [Domain generation algorithm (DGA) on DNS domains](#domain-generation-algorithm-dga-on-dns-domains)
- [Excessive Downloads via Palo Alto GlobalProtect](#excessive-downloads-via-palo-alto-globalprotect)
- [Excessive uploads via Palo Alto GlobalProtect](#excessive-uploads-via-palo-alto-globalprotect)
- [Potential domain generation algorithm (DGA) on next-level DNS Domains](#potential-domain-generation-algorithm-dga-on-next-level-dns-domains)
- [Suspicious volume of AWS API calls from Non-AWS source IP address](#suspicious-volume-of-aws-api-calls-from-non-aws-source-ip-address)
- [Suspicious volume of AWS write API calls from a user account](#suspicious-volume-of-aws-write-api-calls-from-a-user-account)
- [Suspicious volume of logins to computer](#suspicious-volume-of-logins-to-computer)
- [Suspicious volume of logins to computer with elevated token](#suspicious-volume-of-logins-to-computer-with-elevated-token)
- [Suspicious volume of logins to user account](#suspicious-volume-of-logins-to-user-account)
- [Suspicious volume of logins to user account by logon types](#suspicious-volume-of-logins-to-user-account-by-logon-types)
- [Suspicious volume of logins to user account with elevated token](#suspicious-volume-of-logins-to-user-account-with-elevated-token)

<a name='anomalous-azure-ad-sign-in-sessions'></a>


### Anomalous Azure operations

**Description:** This detection algorithm collects 21 days' worth of data on Azure operations grouped by user to train this ML model. The algorithm then generates anomalies in the case of users who performed sequences of operations uncommon in their workspaces. The trained ML model scores the operations performed by the user and considers anomalous those whose score is greater than the defined threshold.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | Customizable machine learning                                      |
| **Data sources:**                | Azure Activity logs                                                |
| **MITRE ATT&CK tactics:**        | Initial Access                                                     |
| **MITRE ATT&CK techniques:**     | T1190 - Exploit Public-Facing Application                          |

[Back to Machine learning-based anomalies list](#machine-learning-based-anomalies) | [Back to top](#anomalies-detected-by-the-microsoft-sentinel-machine-learning-engine)

### Anomalous Code Execution

**Description:** Attackers may abuse command and script interpreters to execute commands, scripts, or binaries. These interfaces and languages provide ways of interacting with computer systems and are a common feature across many different platforms.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | Customizable machine learning                                      |
| **Data sources:**                | Azure Activity logs                                                |
| **MITRE ATT&CK tactics:**        | Execution                                                          |
| **MITRE ATT&CK techniques:**     | T1059 - Command and Scripting Interpreter                          |

[Back to Machine learning-based anomalies list](#machine-learning-based-anomalies) | [Back to top](#anomalies-detected-by-the-microsoft-sentinel-machine-learning-engine)

### Anomalous local account creation

**Description:** This algorithm detects anomalous local account creation on Windows systems. Attackers may create local accounts to maintain access to targeted systems. This algorithm analyzes local account creation activity over the prior 14 days by users. It looks for similar activity on the current day from users who were not previously seen in historical activity. You can specify an allowlist to filter known users from triggering this anomaly.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | Customizable machine learning                                      |
| **Data sources:**                | Windows Security logs                                              |
| **MITRE ATT&CK tactics:**        | Persistence                                                        |
| **MITRE ATT&CK techniques:**     | T1136 - Create Account                                             |

[Back to Machine learning-based anomalies list](#machine-learning-based-anomalies) | [Back to top](#anomalies-detected-by-the-microsoft-sentinel-machine-learning-engine)



### Anomalous user activities in Office Exchange

**Description:** This machine learning model groups the Office Exchange logs on a per-user basis into hourly buckets. We define one hour as a session. The model is trained on the previous 7 days of behavior across all regular (non-admin) users. It indicates anomalous user Office Exchange sessions in the last day.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | Customizable machine learning                                      |
| **Data sources:**                | Office Activity log (Exchange)                                     |
| **MITRE ATT&CK tactics:**        | Persistence<br>Collection                                          |
| **MITRE ATT&CK techniques:**     | **Collection:**<br>T1114 - Email Collection<br>T1213 - Data from Information Repositories <br><br> **Persistence:**<br>T1098 - Account Manipulation<br>T1136 - Create Account<br>T1137 - Office Application Startup<br>T1505 - Server Software Component |

[Back to Machine learning-based anomalies list](#machine-learning-based-anomalies) | [Back to top](#anomalies-detected-by-the-microsoft-sentinel-machine-learning-engine)


### Attempted computer brute force

**Description:** This algorithm detects an unusually high volume of failed login attempts (security event ID 4625) per computer over the past day. The model is trained on the previous 21 days of Windows security event logs.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | Customizable machine learning                                      |
| **Data sources:**                | Windows Security logs                                              |
| **MITRE ATT&CK tactics:**        | Credential Access                                                  |
| **MITRE ATT&CK techniques:**     | T1110 - Brute Force                                                |

[Back to Machine learning-based anomalies list](#machine-learning-based-anomalies) | [Back to top](#anomalies-detected-by-the-microsoft-sentinel-machine-learning-engine)

### Attempted user account brute force

**Description:** This algorithm detects an unusually high volume of failed login attempts (security event ID 4625) per user account over the past day. The model is trained on the previous 21 days of Windows security event logs.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | Customizable machine learning                                      |
| **Data sources:**                | Windows Security logs                                              |
| **MITRE ATT&CK tactics:**        | Credential Access                                                  |
| **MITRE ATT&CK techniques:**     | T1110 - Brute Force                                                |

[Back to Machine learning-based anomalies list](#machine-learning-based-anomalies) | [Back to top](#anomalies-detected-by-the-microsoft-sentinel-machine-learning-engine)

### Attempted user account brute force per login type

**Description:** This algorithm detects an unusually high volume of failed login attempts (security event ID 4625) per user account per logon type over the past day. The model is trained on the previous 21 days of Windows security event logs.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | Customizable machine learning                                      |
| **Data sources:**                | Windows Security logs                                              |
| **MITRE ATT&CK tactics:**        | Credential Access                                                  |
| **MITRE ATT&CK techniques:**     | T1110 - Brute Force                                                |

[Back to Machine learning-based anomalies list](#machine-learning-based-anomalies) | [Back to top](#anomalies-detected-by-the-microsoft-sentinel-machine-learning-engine)

### Attempted user account brute force per failure reason

**Description:** This algorithm detects an unusually high volume of failed login attempts (security event ID 4625) per user account per failure reason over the past day. The model is trained on the previous 21 days of Windows security event logs.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | Customizable machine learning                                      |
| **Data sources:**                | Windows Security logs                                              |
| **MITRE ATT&CK tactics:**        | Credential Access                                                  |
| **MITRE ATT&CK techniques:**     | T1110 - Brute Force                                                |

[Back to Machine learning-based anomalies list](#machine-learning-based-anomalies) | [Back to top](#anomalies-detected-by-the-microsoft-sentinel-machine-learning-engine)

### Detect machine generated network beaconing behavior

**Description:** This algorithm identifies beaconing patterns from network traffic connection logs based on recurrent time delta patterns. Any network connection towards untrusted public networks at repetitive time deltas is an indication of malware callbacks or data exfiltration attempts. The algorithm will calculate the time delta between consecutive network connections between the same source IP and destination IP, as well as the number of connections in a time-delta sequence between the same sources and destinations. The percentage of beaconing is calculated as the connections in time-delta sequence against total connections in a day.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | Customizable machine learning                                      |
| **Data sources:**                | CommonSecurityLog (PAN)                                            |
| **MITRE ATT&CK tactics:**        | Command and Control                                                |
| **MITRE ATT&CK techniques:**     | T1071 - Application Layer Protocol<br>T1132 - Data Encoding<br>T1001 - Data Obfuscation<br>T1568 - Dynamic Resolution<br>T1573 - Encrypted Channel<br>T1008 - Fallback Channels<br>T1104 - Multi-Stage Channels<br>T1095 - Non-Application Layer Protocol<br>T1571 - Non-Standard Port<br>T1572 - Protocol Tunneling<br>T1090 - Proxy<br>T1205 - Traffic Signaling<br>T1102 - Web Service |

[Back to Machine learning-based anomalies list](#machine-learning-based-anomalies) | [Back to top](#anomalies-detected-by-the-microsoft-sentinel-machine-learning-engine)

### Domain generation algorithm (DGA) on DNS domains

**Description:** This machine learning model indicates potential DGA domains from the past day in the DNS logs. The algorithm applies to DNS records that resolve to IPv4 and IPv6 addresses.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | Customizable machine learning                                      |
| **Data sources:**                | DNS Events                                                         |
| **MITRE ATT&CK tactics:**        | Command and Control                                                |
| **MITRE ATT&CK techniques:**     | T1568 - Dynamic Resolution                                         |

[Back to Machine learning-based anomalies list](#machine-learning-based-anomalies) | [Back to top](#anomalies-detected-by-the-microsoft-sentinel-machine-learning-engine)


### Excessive Downloads via Palo Alto GlobalProtect

**Description:** This algorithm detects unusually high volume of download per user account through the Palo Alto VPN solution. The model is trained on the previous 14 days of the VPN logs. It indicates anomalous high volume of downloads in the past day.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | Customizable machine learning                                      |
| **Data sources:**                | CommonSecurityLog (PAN VPN)                                        |
| **MITRE ATT&CK tactics:**        | Exfiltration                                                       |
| **MITRE ATT&CK techniques:**     | T1030 - Data Transfer Size Limits<br>T1041 - Exfiltration Over C2 Channel<br>T1011 - Exfiltration Over Other Network Medium<br>T1567 - Exfiltration Over Web Service<br>T1029 - Scheduled Transfer<br>T1537 - Transfer Data to Cloud Account |

[Back to Machine learning-based anomalies list](#machine-learning-based-anomalies) | [Back to top](#anomalies-detected-by-the-microsoft-sentinel-machine-learning-engine)

### Excessive uploads via Palo Alto GlobalProtect

**Description:** This algorithm detects unusually high volume of upload per user account through the Palo Alto VPN solution. The model is trained on the previous 14 days of the VPN logs. It indicates anomalous high volume of upload in the past day.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | Customizable machine learning                                      |
| **Data sources:**                | CommonSecurityLog (PAN VPN)                                        |
| **MITRE ATT&CK tactics:**        | Exfiltration                                                       |
| **MITRE ATT&CK techniques:**     | T1030 - Data Transfer Size Limits<br>T1041 - Exfiltration Over C2 Channel<br>T1011 - Exfiltration Over Other Network Medium<br>T1567 - Exfiltration Over Web Service<br>T1029 - Scheduled Transfer<br>T1537 - Transfer Data to Cloud Account |

[Back to Machine learning-based anomalies list](#machine-learning-based-anomalies) | [Back to top](#anomalies-detected-by-the-microsoft-sentinel-machine-learning-engine)


### Potential domain generation algorithm (DGA) on next-level DNS Domains

**Description:** This machine learning model indicates the next-level domains (third-level and up) of the domain names from the last day of DNS logs that are unusual. They could potentially be the output of a domain generation algorithm (DGA). The anomaly applies to the DNS records that resolve to IPv4 and IPv6 addresses.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | Customizable machine learning                                      |
| **Data sources:**                | DNS Events                                                         |
| **MITRE ATT&CK tactics:**        | Command and Control                                                |
| **MITRE ATT&CK techniques:**     | T1568 - Dynamic Resolution                                         |

[Back to Machine learning-based anomalies list](#machine-learning-based-anomalies) | [Back to top](#anomalies-detected-by-the-microsoft-sentinel-machine-learning-engine)



### Suspicious volume of AWS API calls from Non-AWS source IP address

**Description:** This algorithm detects an unusually high volume of AWS API calls per user account per workspace, from source IP addresses outside of AWS's source IP ranges, within the last day. The model is trained on the previous 21 days of AWS CloudTrail log events by source IP address. This activity may indicate that the user account is compromised.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | Customizable machine learning                                      |
| **Data sources:**                | AWS CloudTrail logs                                                |
| **MITRE ATT&CK tactics:**        | Initial Access                                                     |
| **MITRE ATT&CK techniques:**     | T1078 - Valid Accounts                                             |

[Back to Machine learning-based anomalies list](#machine-learning-based-anomalies) | [Back to top](#anomalies-detected-by-the-microsoft-sentinel-machine-learning-engine)


### Suspicious volume of AWS write API calls from a user account

**Description:** This algorithm detects an unusually high volume of AWS write API calls per user account within the last day. The model is trained on the previous 21 days of AWS CloudTrail log events by user account. This activity may indicate that the account is compromised.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | Customizable machine learning                                      |
| **Data sources:**                | AWS CloudTrail logs                                                |
| **MITRE ATT&CK tactics:**        | Initial Access                                                     |
| **MITRE ATT&CK techniques:**     | T1078 - Valid Accounts                                             |

[Back to Machine learning-based anomalies list](#machine-learning-based-anomalies) | [Back to top](#anomalies-detected-by-the-microsoft-sentinel-machine-learning-engine)


### Suspicious volume of logins to computer

**Description:** This algorithm detects an unusually high volume of successful logins (security event ID 4624) per computer over the past day. The model is trained on the previous 21 days of Windows Security event logs.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | Customizable machine learning                                      |
| **Data sources:**                | Windows Security logs                                              |
| **MITRE ATT&CK tactics:**        | Initial Access                                                     |
| **MITRE ATT&CK techniques:**     | T1078 - Valid Accounts                                             |

[Back to Machine learning-based anomalies list](#machine-learning-based-anomalies) | [Back to top](#anomalies-detected-by-the-microsoft-sentinel-machine-learning-engine)

### Suspicious volume of logins to computer with elevated token

**Description:** This algorithm detects an unusually high volume of successful logins (security event ID 4624) with administrative privileges, per computer, over the last day. The model is trained on the previous 21 days of Windows Security event logs.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | Customizable machine learning                                      |
| **Data sources:**                | Windows Security logs                                              |
| **MITRE ATT&CK tactics:**        | Initial Access                                                     |
| **MITRE ATT&CK techniques:**     | T1078 - Valid Accounts                                             |

[Back to Machine learning-based anomalies list](#machine-learning-based-anomalies) | [Back to top](#anomalies-detected-by-the-microsoft-sentinel-machine-learning-engine)

### Suspicious volume of logins to user account

**Description:** This algorithm detects an unusually high volume of successful logins (security event ID 4624) per user account over the past day. The model is trained on the previous 21 days of Windows Security event logs.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | Customizable machine learning                                      |
| **Data sources:**                | Windows Security logs                                              |
| **MITRE ATT&CK tactics:**        | Initial Access                                                     |
| **MITRE ATT&CK techniques:**     | T1078 - Valid Accounts                                             |

[Back to Machine learning-based anomalies list](#machine-learning-based-anomalies) | [Back to top](#anomalies-detected-by-the-microsoft-sentinel-machine-learning-engine)

### Suspicious volume of logins to user account by logon types

**Description:** This algorithm detects an unusually high volume of successful logins (security event ID 4624) per user account, by different logon types, over the past day. The model is trained on the previous 21 days of Windows Security event logs.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | Customizable machine learning                                      |
| **Data sources:**                | Windows Security logs                                              |
| **MITRE ATT&CK tactics:**        | Initial Access                                                     |
| **MITRE ATT&CK techniques:**     | T1078 - Valid Accounts                                             |

[Back to Machine learning-based anomalies list](#machine-learning-based-anomalies) | [Back to top](#anomalies-detected-by-the-microsoft-sentinel-machine-learning-engine)

### Suspicious volume of logins to user account with elevated token

**Description:** This algorithm detects an unusually high volume of successful logins (security event ID 4624) with administrative privileges, per user account, over the last day. The model is trained on the previous 21 days of Windows Security event logs.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | Customizable machine learning                                      |
| **Data sources:**                | Windows Security logs                                              |
| **MITRE ATT&CK tactics:**        | Initial Access                                                     |
| **MITRE ATT&CK techniques:**     | T1078 - Valid Accounts                                             |

[Back to Machine learning-based anomalies list](#machine-learning-based-anomalies) | [Back to top](#anomalies-detected-by-the-microsoft-sentinel-machine-learning-engine)


## Next steps

- Learn about [machine learning-generated anomalies](soc-ml-anomalies.md) in Microsoft Sentinel.

- Learn how to [work with anomaly rules](work-with-anomaly-rules.md).

- [Investigate incidents](investigate-cases.md) with Microsoft Sentinel.
