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


## Anomalous Account Access Removal

**Description:** Adversaries may interrupt availability of system and network resources by inhibiting access to accounts utilized by legitimate users. Accounts may be deleted, locked, or manipulated (ex: changed credentials) to remove access to accounts.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | UEBA - High volume                                                 |
| **Data sources:**                | Azure Activity logs<br>Check Point VPN (not in rule?)              |
| **MITRE ATT&CK tactics:**        | Impact                                                             |
| **MITRE ATT&CK techniques:**     | T1531 - Account Access Removal                                     |
| **Activity:**                    | Microsoft.Authorization/roleAssignments/delete<br>Log Out |


## Anomalous Account Creation

**Description:** Adversaries may create an <!-- additional? -->account to maintain access to targeted systems. With a sufficient level of access, creating such accounts may be used to establish secondary credentialed access without requiring persistent remote access tools to be deployed on the system.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | UEBA - Single activity                                             |
| **Data sources:**                | Azure Active Directory audit logs                                  |
| **MITRE ATT&CK tactics:**        | Persistence                                                        |
| **MITRE ATT&CK techniques:**     | T1136 - Create Account                                             |
| **MITRE ATT&CK sub-techniques:** | Cloud Account                                                      |
| **Activity:**                    | Core Directory/UserManagement/Add user                             |


## Anomalous Account Deletion

**Description:** Adversaries may interrupt availability of system and network resources by inhibiting access to accounts utilized by legitimate users. Accounts may be deleted, locked, or manipulated (ex: changed credentials) to remove access to accounts.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | UEBA - Single activity                                             |
| **Data sources:**                | Azure Active Directory audit logs                                  |
| **MITRE ATT&CK tactics:**        | Impact                                                             |
| **MITRE ATT&CK techniques:**     | T1531 - Account Access Removal                                     |
| **Activity:**                    | Core Directory/UserManagement/Delete user<br>Core Directory/Device/Delete user<br>Core Directory/UserManagement/Delete user |


## Anomalous Account Discovery (no rule?)

**Description:** Adversaries may attempt to get a listing of accounts on a system or within an environment. This information can help adversaries determine which accounts exist to aid in follow-on behavior.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | UEBA - Single activity                                             |
| **Data sources:**                | Azure Activity logs                                                |
| **MITRE ATT&CK tactics:**        | Discovery                                                          |
| **MITRE ATT&CK techniques:**     | Cloud Discovery                                                    |
| **MITRE ATT&CK sub-techniques:** | Cloud Account                                                      |
| **Activity:**                    | Microsoft.Sql/managedInstances/administrators/read<br>Microsoft.Sql/servers/administrators/read<br>Microsoft.Authorization/classicAdministrators/read |


## Anomalous Account Manipulation

**Description:** Adversaries may manipulate accounts to maintain access to target systems. These actions include adding new accounts to high-privileged groups. Dragonfly 2.0, for example, added newly created accounts to the administrators group to maintain elevated access. The query below generates an output of all high-Blast Radius users performing "Update user" (name change) to privileged role, or ones that changed users for the first time.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**                | UEBA - Single activity                                             |
| **Data sources:**                | Azure Active Directory audit logs                                  |
| **MITRE ATT&CK tactics:**        | Persistence                                                        |
| **MITRE ATT&CK techniques:**     | T1098 - Account Manipulation                                       |
| **Activity:**                    | Core Directory/UserManagement/Update user                          |


## Anomalous Application Deletion (no rule?)

**Description:** Adversaries may interrupt availability of system and network resources by inhibiting access to accounts utilized by legitimate users. Accounts may be deleted, locked, or manipulated (ex: changed credentials) to remove access to accounts.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**            |                                    |
| **Data sources:**            |                                    |
| **MITRE ATT&CK tactics:**    |                                    |
| **MITRE ATT&CK techniques:** |                                    |
| **Activity:**                | <br><br> |


## Anomalous Code Execution

**Description:** Adversaries may abuse command and script interpreters to execute commands, scripts, or binaries. These interfaces and languages provide ways of interacting with computer systems and are a common feature across many different platforms.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**            |                                    |
| **Data sources:**            |                                    |
| **MITRE ATT&CK tactics:**    |                                    |
| **MITRE ATT&CK techniques:** |                                    |
| **Activity:**                | <br><br> |


## Anomalous Credential Access

**Description:** Adversaries may search for common password storage locations to obtain user credentials. Once credentials are obtained, they can be used to perform lateral movement and access restricted information.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**            |                                    |
| **Data sources:**            |                                    |
| **MITRE ATT&CK tactics:**    |                                    |
| **MITRE ATT&CK techniques:** |                                    |
| **Activity:**                | <br><br> |


## Anomalous Data Destruction

**Description:** Adversaries may destroy data and files on specific systems or in large numbers on a network to interrupt availability to systems, services, and network resources. Data destruction is likely to render stored data irrecoverable by forensic techniques through overwriting files or data on local and remote drives.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**            |                                    |
| **Data sources:**            |                                    |
| **MITRE ATT&CK tactics:**    |                                    |
| **MITRE ATT&CK techniques:** |                                    |
| **Activity:**                | <br><br> |


## Anomalous Data Discovery

**Description:** An adversary may attempt to enumerate the cloud services running on a system after gaining access. They may attempt to discover information about the services enabled throughout the environment.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**            |                                    |
| **Data sources:**            |                                    |
| **MITRE ATT&CK tactics:**    |                                    |
| **MITRE ATT&CK techniques:** |                                    |
| **Activity:**                | <br><br> |


## Anomalous Defensive Mechanism Discovery

**Description:** Adversaries may attempt to get a listing of security software, configurations, defensive tools, and sensors that are installed on a system or in a cloud environment. They may use this information during automated discovery to shape follow-on behaviors, including whether or not the adversary fully infects the target and/or attempts specific actions.

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**            |                                    |
| **Data sources:**            |                                    |
| **MITRE ATT&CK tactics:**    |                                    |
| **MITRE ATT&CK techniques:** |                                    |
| **Activity:**                | <br><br> |


## Anomaly name

**Description:** 

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**            |                                    |
| **Data sources:**            |                                    |
| **MITRE ATT&CK tactics:**    |                                    |
| **MITRE ATT&CK techniques:** |                                    |
| **Activity:**                | <br><br> |


## Anomaly name

**Description:** 

| Attribute                        | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| **Anomaly type:**            |                                    |
| **Data sources:**            |                                    |
| **MITRE ATT&CK tactics:**    |                                    |
| **MITRE ATT&CK techniques:** |                                    |
| **Activity:**                | <br><br> |




## Next steps

Now you've learned more about advanced multistage attack detection, you might be interested in the following quickstart to learn how to get visibility into your data and potential threats: [Get started with Microsoft Sentinel](get-visibility.md).

If you're ready to investigate the incidents that are created for you, see the following tutorial: [Investigate incidents with Microsoft Sentinel](investigate-cases.md).
