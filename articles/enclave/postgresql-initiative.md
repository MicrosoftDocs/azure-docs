---
title: PostgreSQL Initiative
description: PostgreSQL Initiative.
author: jadean-msft
ms.author: jadean
ms.service: azure-enclave
ai-usage: ai-assisted
ms.topic: overview
ms.date: 09/29/2026
---

# PostgreSQL guardrails initiative
This article describes the Policy guardrails in place to ensure Azure PostgreSQL is deployed securely.

## Initiative details

Azure Enclave assigns the PostgreSQL guardrails initiative (policy set definition ID `5eaa16b4-81f2-4354-aef3-2d77288e396e`) to workload resource groups.

The `Effect` values in the tables show the effects supported by the policy definitions. The effective behavior of a policy assignment can vary based on Azure Enclave policy configuration and policy parameters.

## PostgreSQL GitHub Repository

[GitHub Repository](https://github.com/Azure/azure-policy/tree/9b782ec8a2b509ab9e5466a80ea4370de172a171/built-in-policies/policyDefinitions/SQL)

## PostgreSQL Policies Built in

| Name | Description | Version | Type | Supported definition effect | Policy definition |
| :---- | :---- | :---- | :---- | :---- | :---- |
| Enforce SSL connection should be enabled for PostgreSQL database servers | Azure Database for PostgreSQL supports connecting your Azure Database for PostgreSQL server to client applications using Secure Sockets Layer (SSL). Enforcing SSL connections between your database server and your client applications helps protect against 'man in the middle' attacks by encrypting the data stream between the server and your application. This configuration enforces that SSL is always enabled for accessing your database server. | 1.0.1 | BuiltIn | Audit, Disabled | [Link](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fd158790f-bfb0-486c-8631-2dc6b4e8e6af) |
| Public network access should be disabled for PostgreSQL servers | Disable the public network access property to improve security and ensure your Azure Database for PostgreSQL can only be accessed from a private endpoint. This configuration disables access from any public address space outside of Azure IP range, and denies all logins that match IP or virtual network-based firewall rules. | 2.0.1 | BuiltIn | Audit, Deny, Disabled | [Link](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fb52376f7-9612-48a1-81cd-1ffe4b61032c) |
| Log duration should be enabled for PostgreSQL database servers | This policy helps audit any PostgreSQL databases in your environment without log_duration setting enabled. | 1.0.0 | BuiltIn | AuditIfNotExists, Disabled | [Link](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2feb6f77b9-bd53-4e35-a23d-7f65d5f0e8f3) |
| Log checkpoints should be enabled for PostgreSQL database servers | This policy helps audit any PostgreSQL databases in your environment without log_checkpoints setting enabled. | 1.0.0 | BuiltIn | AuditIfNotExists, Disabled | [Link](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2feb6f77b9-bd53-4e35-a23d-7f65d5f0e43d) |
| Log connections should be enabled for PostgreSQL database servers | This policy helps audit any PostgreSQL databases in your environment without log_connections setting enabled. | 1.0.0 | BuiltIn | AuditIfNotExists, Disabled | [Link](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2feb6f77b9-bd53-4e35-a23d-7f65d5f0e442) |
| Connection throttling should be enabled for PostgreSQL database servers | This policy helps audit any PostgreSQL databases in your environment without connection throttling enabled. This setting enables temporary connection throttling per IP for too many invalid password authentication failures. | 1.0.0 | BuiltIn | AuditIfNotExists, Disabled | [Link](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f5345bb39-67dc-4960-a1bf-427e16b9a0bd) |
| Disconnections should be logged for PostgreSQL database servers. | This policy helps audit any PostgreSQL databases in your environment without log_disconnections enabled. | 1.0.0 | BuiltIn | AuditIfNotExists, Disabled | [Link](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2feb6f77b9-bd53-4e35-a23d-7f65d5f0e446) |
| PostgreSQL servers should use customer-managed keys to encrypt data at rest | Use customer-managed keys to manage the encryption at rest of your PostgreSQL servers. By default, the data is encrypted at rest with service-managed keys, but customer-managed keys are commonly required to meet regulatory compliance standards. Customer-managed keys enable the data to be encrypted with an Azure Key Vault key created and owned by you. You have full control and responsibility for the key lifecycle, including rotation and management. | 1.0.4 | BuiltIn | AuditIfNotExists, Disabled | [Link](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f18adea5e-f416-4d0f-8aa8-d24321e3e274) |
| Infrastructure encryption should be enabled for Azure Database for PostgreSQL servers | Enable infrastructure encryption for Azure Database for PostgreSQL servers to have higher level of assurance that the data is secure. When infrastructure encryption is enabled, the data at rest is encrypted twice using FIPS 140-2 compliant Microsoft managed keys. | 1.0.0 | BuiltIn | Audit, Deny, Disabled | [Link](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f24fba194-95d6-48c0-aea7-f65bf859c598) |
| Configure Advanced Threat Protection to be enabled on Azure database for PostgreSQL servers | Enable Advanced Threat Protection on your non-Basic tier Azure database for PostgreSQL servers to detect anomalous activities indicating unusual and potentially harmful attempts to access or exploit databases. | 1.2.0 | BuiltIn | DeployIfNotExists, Disabled | [Link](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fdb048e65-913c-49f9-bb5f-1084184671d3) |
