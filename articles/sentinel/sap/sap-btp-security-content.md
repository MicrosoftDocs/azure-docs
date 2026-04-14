---
title: Microsoft Sentinel Solution for SAP BTP - security content reference
description: Learn about the built-in security content provided by the  Microsoft Sentinel Solution for SAP BTP.
author: batamig
ms.author: bagol
ms.topic: reference
ms.date: 07/17/2024
ms.custom: sfi-image-nochange


#Customer intent: As a security analyst, I want to use the Microsoft Sentinel solution for SAP BTP so that I can monitor, detect, and respond to security threats within my SAP BTP environment.

---

# Microsoft Sentinel Solution for SAP BTP: security content reference

This article details the security content available for the Microsoft Sentinel Solution for SAP BTP.

Available security content currently includes a built-in workbook and analytics rules. You can also add SAP-related [watchlists](../watchlists.md) to use in your search, detection rules, threat hunting, and response playbooks.

[Learn more about the solution](sap-btp-solution-overview.md).

## SAP BTP workbook

The BTP Activity Workbook provides a dashboard overview of BTP activity. 

:::image type="content" source="./media/sap-btp-security-content/sap-btp-workbook-btp-overview.png" alt-text="Screenshot of the Overview tab of the SAP BTP workbook." lightbox="./media/sap-btp-security-content/sap-btp-workbook-btp-overview.png":::

The **Overview** tab shows: 

- An overview of BTP subaccounts, helping analysts identify the most active accounts and the type of ingested data. 
- Subaccount sign-in activity, helping analysts identify spikes and trends that might be associated with sign-in failures in SAP Business Application Studio (BAS). 
- Timeline of BTP activity and number of BTP security alerts, helping analysts search for any correlation between the two.
 
The **Identity Management** tab shows a grid of identity management events, such as user and security role changes, in a human-readable format. The search bar lets you quickly find specific changes.

:::image type="content" source="./media/sap-btp-security-content/sap-btp-workbook-identity-management.png" alt-text="Screenshot of the Identity Management tab of the SAP BTP workbook." lightbox="./media/sap-btp-security-content/sap-btp-workbook-identity-management.png":::

For more information, see [Tutorial: Visualize and monitor your data](../monitor-your-data.md) and [Deploy Microsoft Sentinel Solution for SAP BTP](deploy-sap-btp-solution.md).

## Built-in analytics rules

These analytics rules detect suspicious activity using SAP BTP audit logs. The rules are organized by SAP service or product area. For more information see SAP's official documentation about [Security Events Logged by Cloud Foundry Services](https://help.sap.com/docs/btp/sap-business-technology-platform/security-events-logged-by-cf-services?version=Cloud) on SAP BTP.

**Data sources**: SAPBTPAuditLog_CL

### SAP Cloud Integration - Integration Suite

| Rule name | Description | Source action | Tactics |
| --------- | --------- | --------- | --------- |
| **BTP - Cloud Integration access policy tampering** | Detects unauthorized modification of access policies that could allow attackers to gain access to sensitive integration artifacts or evade security controls. | Create, change, or delete access policies or artifact references in SAP Cloud Integration. | Defense Evasion, Privilege Escalation |
| **BTP - Cloud Integration artifact deployment** | Detects deployment of potentially malicious integration flows that could be used for data exfiltration, persistence, or executing unauthorized code in the integration environment. | Deploy or undeploy integration artifacts in SAP Cloud Integration. | Execution, Persistence |
| **BTP - Cloud Integration JDBC data source changes** | Detects manipulation of database connections that could enable unauthorized access to backend systems or credential theft from stored connection strings. | Deploy or undeploy JDBC data sources in SAP Cloud Integration. | Credential Access, Lateral Movement |
| **BTP - Cloud Integration package import or transport** | Detects potentially malicious package imports that could introduce backdoors, supply chain compromises, or unauthorized code into the integration environment. | Import or transport integration packages/artifacts in SAP Cloud Integration. | Initial Access, Persistence |
| **BTP - Cloud Integration tampering with security material** | Detects unauthorized access to credentials, certificates, and encryption keys that could enable attackers to compromise external systems or intercept encrypted communications. | Create, update, or delete credentials, X.509 certificates, or PGP keys in SAP Cloud Integration. | Credential Access, Defense Evasion |

### SAP Cloud Identity Service - Identity Authentication

| Rule name | Description | Source action | Tactics |
| --------- | --------- | --------- | --------- |
| **BTP - Cloud Identity Service application configuration monitor** | Detects creation or modification of federated applications (SAML/OIDC) that could allow attackers to establish persistent backdoor access through rogue SSO configurations. | Create, update, or delete SSO domain/service provider configurations in SAP Cloud Identity Service. | Credential Access, Privilege Escalation |
| **BTP - Mass user deletion in Cloud Identity Service** | Detects large-scale user account deletion that could indicate a destructive attack, attempted cover-up of unauthorized activity, or denial of service against legitimate users.<br>Default threshold: 10 | Delete count of user accounts over the defined threshold in SAP Cloud Identity Service. | Impact |
| **BTP - User added to privileged Administrators list** | Detects privilege escalation through assignment of powerful identity management permissions that could enable attackers to create backdoor accounts or modify authentication controls. | Grant privileged administrator permissions to a user in SAP Cloud Identity Service. | Lateral Movement, Privilege Escalation |

### SAP Business Application Studio (BAS)

| Rule name | Description | Source action | Tactics |
| --------- | --------- | --------- | --------- |
| **BTP - Failed access attempts across multiple BAS subaccounts** | Detects reconnaissance activity or credential spray attacks targeting development environments across multiple subaccounts, indicating potential preparation for a broader compromise.<br>Default threshold: 3 | Run failed sign-in attempts to BAS over the defined threshold number of subaccounts. | Discovery, Reconnaissance |
| **BTP - Malware detected in BAS dev space** | Detects malicious code in development workspaces that could be used to compromise the software supply chain, inject backdoors into applications, or establish persistence in the development environment. | Copy or create a malware file in a BAS developer space. | Execution, Persistence, Resource Development |

### SAP Build Work Zone

| Rule name | Description | Source action | Tactics |
| --------- | --------- | --------- | --------- |
| **BTP - Build Work Zone unauthorized access and role tampering** | Detects attempts to access restricted portal resources or mass deletion of access controls that could indicate an attacker removing security boundaries or covering tracks after unauthorized activity. | Detect unauthorized OData service access or mass deletion of roles/users in SAP Build Work Zone. | Initial Access, Persistence, Defense Evasion |

### SAP BTP platform and subaccounts

| Rule name | Description | Source action | Tactics |
| --------- | --------- | --------- | --------- |
| **BTP - Audit log service unavailable** | Detects potential tampering with audit logging that could indicate an attacker attempting to operate without detection by disabling security monitoring or hiding malicious activity. | Subaccount fails to report audit logs exceeding configured threshold (default: 60 minutes). | Defense Evasion |
| **BTP - Mass user deletion in a subaccount** | Detects large-scale user deletion that could indicate a destructive attack, sabotage attempt, or effort to disrupt business operations by removing user access.<br>Default threshold: 10 | Delete count of user accounts over the defined threshold. | Impact |
| **BTP - Trust and authorization Identity Provider monitor** | Detects modifications to federation and authentication settings that could enable attackers to establish alternate authentication paths, bypass security controls, or gain unauthorized access through identity provider manipulation. | Change, read, update, or delete any of the identity provider settings within a subaccount. | Credential Access, Privilege Escalation |
| **BTP - User added to sensitive privileged role collection** | Detects privilege escalation attempts through assignment of powerful administrative roles that could enable full control over subaccounts, connectivity, and security configurations. | Assign one of the following role collections to a user: <br>- `Subaccount Service Administrator`<br>- `Subaccount Administrator`<br>- `Connectivity and Destination Administrator`<br>- `Destination Administrator`<br>- `Cloud Connector Administrator` | Lateral Movement, Privilege Escalation |

## Next steps

In this article, you learned about the security content provided with the Microsoft Sentinel Solution for SAP BTP.

- [Deploy Microsoft Sentinel solution for SAP BTP](deploy-sap-btp-solution.md)
- [Microsoft Sentinel Solution for SAP BTP overview](sap-btp-solution-overview.md)
