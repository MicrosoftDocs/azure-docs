---
title: PostgreSQL Initiative
description: PostgreSQL Initiative.
author: jadean-msft
ms.author: jadean
ms.topic: overview
ms.date: 9/30/2025
---

# PostgreSQL guardrails initiative
This article describes the Policy guardrails in place to ensure Azure PostgreSQL is deployed securely.

## PostgreSQL GitHub Repository

[GitHub Repository](https://github.com/Azure/azure-policy/tree/9b782ec8a2b509ab9e5466a80ea4370de172a171/built-in-policies/policyDefinitions/SQL)

## PostgreSQL Policies Built in

| Name | Description | Version | Type | Effect | Policy definition |
| :---- | :---- | :---- | :---- | :---- | :---- |
| Configure Advanced Threat Protection to be enabled on Azure database for PostgreSQL servers | Enable Advanced Threat Protection on your non-Basic tier Azure database for PostgreSQL servers to detect anomalous activities indicating unusual and potentially harmful attempts to access or exploit databases. | 1.1.0 | Built in | Deploy | [Link](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fdb048e65-913c-49f9-bb5f-1084184671d3) |

## PostgreSQL Policies Custom

| Name | Description | Version | Type | Effect | Policy definition |
| :---- | :---- | :---- | :---- | :---- | :---- |
| Enforce Secure Sockets Layer (SSL) connections should be enabled for PostgreSQL database servers | Azure Database for PostgreSQL supports connecting your Azure Database for PostgreSQL server to client applications using SSL. Enforcing SSL connections between your database server and your client applications helps protect against "man in the middle" attacks by encrypting the data stream between the server and your application. This configuration enforces that SSL is always enabled for accessing your database server. | 1.0.1 | Custom | Audit | N/A |
| Public network access should be disabled for PostgreSQL servers | Disable the public network access property to improve security and ensure your Azure Database for PostgreSQL can only be accessed from a private endpoint. This configuration disables access from any public address space outside of Azure IP range, and denies all logins that match IP or virtual network-based firewall rules. | 2.0.1 | Custom | AuditDeny | N/A |
| Log duration should be enabled for PostgreSQL database servers | This policy helps audit any PostgreSQL databases in your environment without log_duration setting enabled. | 1.0.0 | Custom | AuditIfNotExist | N/A |
| Log checkpoints should be enabled for PostgreSQL database servers | This policy helps audit any PostgreSQL databases in your environment without log_checkpoints setting enabled. | 1.0.0 | Custom | AuditIfNotExist | N/A |
| Log connections should be enabled for PostgreSQL database servers | This policy helps audit any PostgreSQL databases in your environment without log_connections setting enabled. | 1.0.0 | Custom | AuditIfNotExist | N/A |
| Connection throttling should be enabled for PostgreSQL database servers | This policy helps audit any PostgreSQL databases in your environment without Connection throttling enabled. This setting enables temporary connection throttling per IP for too many invalid password sign-in failures. | 1.0.0 | Custom | AuditIfNotExist | N/A |
| Disconnections should be logged for PostgreSQL database servers. | This policy helps audit any PostgreSQL databases in your environment without log_disconnections enabled. | 1.0.0 | Custom | AuditIfNotExist | N/A |
| PostgreSQL servers should use customer-managed keys to encrypt data at rest | Use customer-managed keys to manage the encryption at rest of your PostgreSQL servers. By default, the data is encrypted at rest with service-managed keys, but customer-managed keys are commonly required to meet regulatory compliance standards. Customer-managed keys enable the data to be encrypted with an Azure Key Vault key created and owned by you. You have full control and responsibility for the key lifecycle, including rotation and management. | 1.0.4 | Custom | AuditIfNotExist | N/A |
| Infrastructure encryption should be enabled for Azure Database for PostgreSQL servers | Enable infrastructure encryption for Azure Database for PostgreSQL servers to have higher level of assurance that the data is secure. When infrastructure encryption is enabled, the data at rest is encrypted twice using Federal Information Processing Standards (FIPS) 140-2 compliant Microsoft managed keys | 1.0.0 | Custom | AuditDeny | N/A |
| Private endpoint should be enabled for PostgreSQL servers | Private endpoint connections enforce secure communication by enabling private connectivity to Azure Database for PostgreSQL. Configure a private endpoint connection to enable access to traffic coming only from known networks and prevent access from all other IP addresses, including within Azure. | 1.0.2 | Custom | AuditIfNotExist | N/A |
