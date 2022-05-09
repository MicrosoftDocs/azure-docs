---
title: Anomalies detected by the Microsoft Sentinel machine learning engine
description: Learn about the anomalies detected by Microsoft Sentinel's machine learning engines.
author: yelevin
ms.topic: reference
ms.date: 05/08/2022
ms.author: yelevin
---

# Anomalies detected by the Microsoft Sentinel machine learning engine

<!--This document lists the types of scenario-based multistage attacks, grouped by threat classification, that Microsoft Sentinel detects using the Fusion correlation engine.

Since [Fusion](fusion.md) correlates multiple signals from various products to detect advanced multistage attacks, successful Fusion detections are presented as **Fusion incidents** on the Microsoft Sentinel **Incidents** page and not as **alerts**, and are stored in the *Incidents* table in **Logs** and not in the *SecurityAlerts* table.

In order to enable these Fusion-powered attack detection scenarios, any data sources listed must be ingested to your Log Analytics workspace.

-->


Sentinel UEBA detects anomalies based on dynamic baselines created for each entity across various data inputs. Each entity's baseline behavior is set according to its own historical activities, those of its peers, and those of the organization as a whole. Anomalies can be triggered by the correlation of different attributes such as action type, geo-location, device, resource, ISP, and more. Supported data sources: Azure Audit (Core Directory/UserManagement/Delete user, Core Directory/Device/Delete user, Core Directory/UserManagement/Delete user)


> [!NOTE]
> Anomalies are in **PREVIEW**. 

## UEBA anomalies
### Anomalous Account Access Removal

**Description:** Adversaries may interrupt availability of system and network resources by inhibiting access to accounts utilized by legitimate users. Accounts may be deleted, locked, or manipulated (ex: changed credentials) to remove access to accounts.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | UEBA - High volume                                                 |
| **Data sources:**                | Azure Activity logs<br>Check Point VPN (not in rule?)              |
| **MITRE ATT&CK tactics:**        | Impact                                                             |
| **MITRE ATT&CK techniques:**     | T1531 - Account Access Removal                                     |
| **Activity:**                    | Microsoft.Authorization/roleAssignments/delete<br>Log Out |


### Anomalous Account Creation

**Description:** Adversaries may create an <!-- additional? -->account to maintain access to targeted systems. With a sufficient level of access, creating such accounts may be used to establish secondary credentialed access without requiring persistent remote access tools to be deployed on the system.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | UEBA - Single activity                                             |
| **Data sources:**                | Azure Active Directory audit logs                                  |
| **MITRE ATT&CK tactics:**        | Persistence                                                        |
| **MITRE ATT&CK techniques:**     | T1136 - Create Account                                             |
| **MITRE ATT&CK sub-techniques:** | Cloud Account                                                      |
| **Activity:**                    | Core Directory/UserManagement/Add user                             |


### Anomalous Account Deletion

**Description:** Adversaries may interrupt availability of system and network resources by inhibiting access to accounts utilized by legitimate users. Accounts may be deleted, locked, or manipulated (ex: changed credentials) to remove access to accounts.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | UEBA - Single activity                                             |
| **Data sources:**                | Azure Active Directory audit logs                                  |
| **MITRE ATT&CK tactics:**        | Impact                                                             |
| **MITRE ATT&CK techniques:**     | T1531 - Account Access Removal                                     |
| **Activity:**                    | Core Directory/UserManagement/Delete user<br>Core Directory/Device/Delete user<br>Core Directory/UserManagement/Delete user |


### Anomalous Account Discovery (no rule?)

**Description:** Adversaries may attempt to get a listing of accounts on a system or within an environment. This information can help adversaries determine which accounts exist to aid in follow-on behavior.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | UEBA - Single activity                                             |
| **Data sources:**                | Azure Activity logs                                                |
| **MITRE ATT&CK tactics:**        | Discovery                                                          |
| **MITRE ATT&CK techniques:**     | T1087 - Account Discovery                                          |
| **MITRE ATT&CK sub-techniques:** | Cloud Account                                                      |
| **Activity:**                    | Microsoft.Sql/managedInstances/administrators/read<br>Microsoft.Sql/servers/administrators/read<br>Microsoft.Authorization/classicAdministrators/read |


### Anomalous Account Manipulation

**Description:** Adversaries may manipulate accounts to maintain access to target systems. These actions include adding new accounts to high-privileged groups. Dragonfly 2.0, for example, added newly created accounts to the administrators group to maintain elevated access. The query below generates an output of all high-Blast Radius users performing "Update user" (name change) to privileged role, or ones that changed users for the first time.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | UEBA - Single activity                                             |
| **Data sources:**                | Azure Active Directory audit logs                                  |
| **MITRE ATT&CK tactics:**        | Persistence                                                        |
| **MITRE ATT&CK techniques:**     | T1098 - Account Manipulation                                       |
| **Activity:**                    | Core Directory/UserManagement/Update user                          |


### Anomalous Application Deletion (no rule?)

**Description:** Adversaries may interrupt availability of system and network resources by inhibiting access to accounts utilized by legitimate users. Accounts may be deleted, locked, or manipulated (ex: changed credentials) to remove access to accounts.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | UEBA                                                               |
| **Data sources:**                | Azure Active Directory audit logs                                  |
| **MITRE ATT&CK tactics:**        | Impact                                                             |
| **MITRE ATT&CK techniques:**     | T1531 - Account Access Removal                                     |
| **Activity:**                    | Core Directory/ApplicationManagement/Delete application            |


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


### Anomalous Credential Access (no rule?)

**Description:** Adversaries may search for common password storage locations to obtain user credentials. Once credentials are obtained, they can be used to perform lateral movement and access restricted information.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | UEBA                                                               |
| **Data sources:**                | Azure Activity logs                                                |
| **MITRE ATT&CK tactics:**        | Credential Access                                                  |
| **MITRE ATT&CK techniques:**     | T1555 - Credentials from Password Stores                           |
| **Activity:**                    | Microsoft.KeyVault/vaults/keys/read<br>Microsoft.KeyVault/vaults/secrets/getSecret/action<br>Microsoft.KeyVault/vaults/storageaccounts/regeneratekey/action<br>Microsoft.KeyVault/vaults/storageaccounts/sas/set/action |


### Anomalous Data Destruction

**Description:** Adversaries may destroy data and files on specific systems or in large numbers on a network to interrupt availability to systems, services, and network resources. Data destruction is likely to render stored data irrecoverable by forensic techniques through overwriting files or data on local and remote drives.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | UEBA                                                               |
| **Data sources:**                | Azure Activity logs                                                |
| **MITRE ATT&CK tactics:**        | Impact                                                             |
| **MITRE ATT&CK techniques:**     | T1485 - Data Destruction                                           |
| **Activity:**                    | Microsoft.Compute/disks/delete<br>Microsoft.Compute/galleries/images/delete<br>Microsoft.Compute/hostGroups/delete<br>Microsoft.Compute/hostGroups/hosts/delete<br>Microsoft.Compute/images/delete<br>Microsoft.Compute/virtualMachines/delete<br>Microsoft.Compute/virtualMachineScaleSets/delete<br>Microsoft.Compute/virtualMachineScaleSets/virtualMachines/delete<br>Microsoft.Devices/digitalTwins/Delete<br>Microsoft.Devices/iotHubs/Delete<br>Microsoft.KeyVault/vaults/delete<br>Microsoft.Logic/integrationAccounts/delete  <br>Microsoft.Logic/integrationAccounts/maps/delete <br>Microsoft.Logic/integrationAccounts/schemas/delete <br>Microsoft.Logic/integrationAccounts/partners/delete <br>Microsoft.Logic/integrationServiceEnvironments/delete<br>Microsoft.Logic/workflows/delete<br>Microsoft.Resources/subscriptions/resourceGroups/delete<br>Microsoft.Sql/instancePools/delete<br>Microsoft.Sql/managedInstances/delete<br>Microsoft.Sql/managedInstances/administrators/delete<br>Microsoft.Sql/managedInstances/databases/delete<br>Microsoft.Storage/storageAccounts/delete<br>Microsoft.Storage/storageAccounts/blobServices/containers/blobs/delete<br>Microsoft.Storage/storageAccounts/fileServices/fileshares/files/delete<br>Microsoft.Storage/storageAccounts/blobServices/containers/delete<br>Microsoft.AAD/domainServices/delete |


### Anomalous Data Discovery (no rule?)

**Description:** An adversary may attempt to enumerate the cloud services running on a system after gaining access. They may attempt to discover information about the services enabled throughout the environment.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | UEBA                                                               |
| **Data sources:**                | Azure Activity logs                                                |
| **MITRE ATT&CK tactics:**        | Discovery                                                          |
| **MITRE ATT&CK techniques:**     | T1526 - Cloud Service Discovery<br>T1518 - Software Discovery      |
| **Activity:**                    | Microsoft.SecurityGraph/diagnosticsettings/read<br>Microsoft.KeyVault/vaults/eventGridFilters/read<br>Microsoft.KeyVault/vaults/certificatecas/read |


### Anomalous Defensive Mechanism Discovery (no rule?)

**Description:** Adversaries may attempt to get a listing of security software, configurations, defensive tools, and sensors that are installed on a system or in a cloud environment. They may use this information during automated discovery to shape follow-on behaviors, including whether or not the adversary fully infects the target and/or attempts specific actions.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | UEBA                                                               |
| **Data sources:**                | Azure Activity logs                                                |
| **MITRE ATT&CK tactics:**        | Discovery                                                          |
| **MITRE ATT&CK techniques:**     | T1518 - Software Discovery                                         |
| **MITRE ATT&CK sub-techniques:** | Security Software Discovery                                        |
| **Activity:**                    | Microsoft.Network/azurefirewalls/read<br>Microsoft.Sql/servers/firewallRules/read<br>Microsoft.Network/firewallPolicies/ruleGroups/read<br>Microsoft.Network/networkSecurityGroups/securityRules/read<br>Microsoft.Sql/managedInstances/databases/vulnerabilityAssessments/rules/baselines/read<br>Microsoft.Sql/managedInstances/databases/vulnerabilityAssessments/read<br>Microsoft.Network/networkSecurityGroups/read<br>Microsoft.Network/ddosProtectionPlans/read<br>Microsoft.Network/ApplicationGatewayWebApplicationFirewallPolicies/read<br>Microsoft.Authorization/policyAssignments/read |


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


### Anomalous Failed Sign-in

**Description:** Adversaries with no prior knowledge of legitimate credentials within the system or environment may guess passwords to attempt access to accounts.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | UEBA                                                               |
| **Data sources:**                | Azure Active Directory sign-in logs<br>Check Point VPN logs<br>Windows Security logs |
| **MITRE ATT&CK tactics:**        | Credential Access                                                  |
| **MITRE ATT&CK techniques:**     | T1110 - Brute Force                                                |
| **Activity:**                    | Sign-in activity<br>Failed Log In<br>4625                          |


### Anomalous Password Reset

**Description:** Adversaries may interrupt availability of system and network resources by inhibiting access to accounts utilized by legitimate users. Accounts may be deleted, locked, or manipulated (ex: changed credentials) to remove access to accounts.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | UEBA                                                               |
| **Data sources:**                | Azure Active Directory audit logs                                  |
| **MITRE ATT&CK tactics:**        | Impact                                                             |
| **MITRE ATT&CK techniques:**     | T1531 - Account Access Removal                                     |
| **Activity:**                    | Core Directory/UserManagement/User password reset |


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


### Anomalous Role Assignment (no rule?)

**Description:** Adversaries may manipulate accounts to maintain access to victim systems. These actions include adding new accounts to high privileged groups.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | UEBA                                                               |
| **Data sources:**                | Azure Active Directory audit logs                                  |
| **MITRE ATT&CK tactics:**        | Persistence                                                        |
| **MITRE ATT&CK techniques:**     | T1098 - Account Manipulation                                       |
| **Activity:**                    | Add member to group<br>Add member to role                          |


### Anomalous Session Duration (no rule?)

**Description:** Adversaries may leverage external-facing remote services to initially access and/or persist within a network. Remote services such as VPNs, Citrix, and other access mechanisms allow users to connect to internal enterprise network resources from external locations.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | UEBA                                                               |
| **Data sources:**                | VPN logs                                                           |
| **MITRE ATT&CK tactics:**        | Persistence                                                        |
| **MITRE ATT&CK techniques:**     | T1133 - External Remote Services                                   |
| **Activity:**                    | Log Out |


### Anomalous Sign-in

**Description:** Adversaries may steal the credentials of a specific user or service account using Credential Access techniques or capture credentials earlier in their reconnaissance process through social engineering for means of gaining Persistence.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | UEBA                                                               |
| **Data sources:**                | Azure Active Directory sign-in logs<br>Check Point VPN logs<br>Windows Security logs |
| **MITRE ATT&CK tactics:**        | Persistence **(Excel)**<br>Impact **(UI)**                         |
| **MITRE ATT&CK techniques:**     | T1078 - Valid Accounts                                             |
| **Activity:**                    | Sign-in activity<br>4624<br>Successful Log In                      |


### Anomalous Process Creation (no rule?)

**Description:** Services, daemons, or agents may be created with administrator privileges but executed under root/SYSTEM privileges. Adversaries may leverage this functionality to create or modify system processes in order to escalate privileges.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | UEBA                                                               |
| **Data sources:**                | Windows Security logs                                              |
| **MITRE ATT&CK tactics:**        | Persistence<br>Privilege Escalation                                |
| **MITRE ATT&CK techniques:**     | T1543 - Create or Modify System Processes                          |
| **Activity:**                    | 4688                                                               |


## Customizable anomalies

### Anomalous Azure AD sign-in sessions

**Description:** 

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                |                                    |
| **Data sources:**                |                                    |
| **MITRE ATT&CK tactics:**        |                                    |
| **MITRE ATT&CK techniques:**     |                                    |
| **Activity:**                    | <br><br> |


### Anomalous Azure operations

**Description:** 

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                |                                    |
| **Data sources:**                |                                    |
| **MITRE ATT&CK tactics:**        |                                    |
| **MITRE ATT&CK techniques:**     |                                    |
| **Activity:**                    | <br><br> |


### Anomalous Code Execution (duplicate?)

**Description:** 

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                |                                    |
| **Data sources:**                |                                    |
| **MITRE ATT&CK tactics:**        |                                    |
| **MITRE ATT&CK techniques:**     |                                    |
| **Activity:**                    | <br><br> |


### 

**Description:** 

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                |                                    |
| **Data sources:**                |                                    |
| **MITRE ATT&CK tactics:**        |                                    |
| **MITRE ATT&CK techniques:**     |                                    |
| **Activity:**                    | <br><br> |


### 

**Description:** 

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                |                                    |
| **Data sources:**                |                                    |
| **MITRE ATT&CK tactics:**        |                                    |
| **MITRE ATT&CK techniques:**     |                                    |
| **Activity:**                    | <br><br> |





## Next steps

Now you've learned more about advanced multistage attack detection, you might be interested in the following quickstart to learn how to get visibility into your data and potential threats: [Get started with Microsoft Sentinel](get-visibility.md).

If you're ready to investigate the incidents that are created for you, see the following tutorial: [Investigate incidents with Microsoft Sentinel](investigate-cases.md).
