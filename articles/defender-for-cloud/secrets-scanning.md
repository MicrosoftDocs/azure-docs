---
title: Protecting secrets in Microsoft Defender for Cloud
description: Learn how to protect secrets with Microsoft Defender for Server's agentless secrets scanning.
ms.topic: overview
ms.date: 04/16/2024
---


# Protecting secrets in Defender for Cloud

Microsoft Defender for Cloud helps security team to minimize the risk of attackers exploiting security secrets.

After gaining initial access, attackers can move laterally across networks, find sensitive data, and exploit vulnerabilities to damage critical information systems by accessing cloud deployments, resources, and internet facing workloads. Lateral movement often involves credentials threats that typically exploit sensitive data such as exposed credentials and secrets such as passwords, keys, tokens, and connection strings to gain access to additional assets. Secrets are often found in files, stored on VM disks, or on containers, across multicloud deployments. Exposed secrets happen for a number of reasons:

- Lack of awareness: Organizations might not be aware of the risks and consequences of secrets exposure in their cloud environment. There might not be a clear policy on handling and protecting secrets in code and configuration files.
- Lack of discovery tools: Tools might not be in place to detect and remediate secrets leaks.
- Complexity and speed: Modern software development is complex and fast-paced, relying on multiple cloud platforms, open-source software, and third-party code. Developers might use secrets to access and integrate resources and services in cloud environments They might store secrets in source code repositories for convenience and reuse. This can lead to accidental exposure of secrets in public or private repositories, or during data transfer or processing.
- Trade-off between security and usability: Organizations might keep secrets exposed in cloud environments for ease-of-use, to avoid the complexity and latency of encrypting and decrypting data at rest and in transit. This can compromise the security and privacy of data and credentials.

Defender for Cloud provides secrets scanning for virtual machines, and for cloud deployments, to reduce lateral movement risk.

- **Virtual machines (VMs)**: Agentless secrets scanning on multicloud VMs.
- **Cloud deployments**: Agentless secrets scanning across multicloud infrastructure-as-code deployment resources.
- **Azure DevOps**: [Scanning to discover exposed secrets in Azure DevOps](defender-for-devops-introduction.md).

## Deploying secrets scanning

Secrets scanning is provided as a feature in Defender for Cloud plans:

- **VM scanning**: Provided with Defender for Cloud Security Posture Management (CSPM) plan, or with Defender for Servers Plan 2.
- **Cloud deployment resource scanning** Provided with Defender CSPM.
- **DevOps scanning**: Provided with Defender CSPM.

## Reviewing secrets findings

You can review and investigate the security findings for secrets in a couple of ways:

- Review the asset inventory. In the Inventory page you can get an all-up view of your secrets.
- Review secrets recommendations: In the Defender for Cloud Recommendations page, you can review and remediate secrets recommendations. Learn more about Investigate recommendations and alerts.
- Investigate security insights: You can use cloud security explorer to query the cloud security graph. You can build your own queries, or use predefined query templates.
- Use attack paths: You can use attack paths to investigate and remediate critical secrets risk. Learn more.

## Discovery support

Defender for Cloud supports discovery of the types of secrets summarized in the table.

**Secrets type** | **VM secrets discovery** | **Cloud deployment secrets discovery** | **Review location**
--- | --- | --- | ---
Insecure SSH private keys<br/>Supports RSA algorithm for PuTTy files.<br/>PKCS#8 and PKCS#1 standards<br/>OpenSSH standard |Yes |Yes | Inventory, cloud security explorer, recommendations, attack paths
Plaintext Azure SQL connection strings support SQL PAAS.|Yes |Yes | Inventory, cloud security explorer, recommendations, attack paths
Plaintext Azure database for PostgreSQL.|Yes |Yes | Inventory, cloud security explorer, recommendations, attack paths
Plaintext Azure database for MySQL.|Yes |Yes | Inventory, cloud security explorer, recommendations, attack paths
Plaintext Azure database for MariaDB.|Yes |Yes | Inventory, cloud security explorer, recommendations, attack paths
Plaintext Azure Cosmos DB, including PostgreSQL, MySQL and MariaDB.|Yes |Yes | Inventory, cloud security explorer, recommendations, attack paths
Plaintext AWS RDS connection string supports SQL PAAS:<br/>Plaintext Amazon Aurora with Postgres and MySQL flavors.<br/>Plaintext Amazon custom RDS with Oracle and SQL Server flavors.|Yes |Yes | Inventory, cloud security explorer, recommendations, attack paths
Plaintext Azure storage account connection strings|Yes |Yes | Inventory, cloud security explorer, recommendations, attack paths
Plaintext Azure storage account connection strings.|Yes |Yes | Inventory, cloud security explorer, recommendations, attack paths
Plaintext Azure storage account SAS tokens.|Yes |Yes | Inventory, cloud security explorer, recommendations, attack paths
Plaintext AWS access keys.|Yes |Yes | Inventory, cloud security explorer, recommendations, attack paths
Plaintext AWS S3 presigned URL. |Yes |Yes | Inventory, cloud security explorer, recommendations, attack paths
Plaintext Google storage signed URL. |Yes |Yes | Inventory, cloud security explorer.
Plaintext Azure AD Client Secret. |Yes |Yes | Inventory, cloud security explorer.
Plaintext Azure DevOps Personal Access Token. |Yes |Yes | Inventory, cloud security explorer.
Plaintext GitHub Personal Access Token.|Yes |Yes | Inventory, cloud security explorer.
Plaintext Azure App Configuration Access Key. |Yes |Yes | Inventory, cloud security explorer.
Plaintext Azure Cognitive Service Key.|Yes |Yes | Inventory, cloud security explorer.
Plaintext Azure AD User Credentials. |Yes |Yes | Inventory, cloud security explorer.
Plaintext Azure Container Registry Access Key. |Yes |Yes | Inventory, cloud security explorer.
Plaintext Azure App Service Deployment Password. |Yes |Yes | Inventory, cloud security explorer.
Plaintext Azure Databricks Personal Access Token. |Yes |Yes | Inventory, cloud security explorer.
Plaintext Azure SignalR Access Key. |Yes |Yes | Inventory, cloud security explorer.
Plaintext Azure API Management Subscription Key. |Yes |Yes | Inventory, cloud security explorer.
Plaintext Azure Bot Framework Secret Key. |Yes |Yes | Inventory, cloud security explorer.
Plaintext Azure Machine Learning Web Service API Key. |Yes |Yes | Inventory, cloud security explorer.
Plaintext Azure Communication Services Access Key.|Yes |Yes | Inventory, cloud security explorer.
Plaintext Azure Event Grid Access Key. |Yes |Yes | Inventory, cloud security explorer.
Plaintext Amazon Marketplace Web Service (MWS) Access Key. |Yes |Yes | Inventory, cloud security explorer.
Plaintext Azure Maps Subscription Key. |Yes |Yes | Inventory, cloud security explorer.
Plaintext Azure Web PubSub Access Key.|Yes |Yes | Inventory, cloud security explorer.
Plaintext OpenAI API Key. |Yes |Yes | Inventory, cloud security explorer.
Plaintext Azure Batch Shared Access Key. |Yes |Yes | Inventory, cloud security explorer.
Plaintext NPM Author Token. |Yes |Yes | Inventory, cloud security explorer.
Plaintext Azure Subscription Management Certificate. |Yes |Yes | Inventory, cloud security explorer.
Plaintext GCP API Key. |No |Yes | Inventory, cloud security explorer.
Plaintext AWS Redshift credentials.|No |Yes | Inventory, cloud security explorer.
Plaintext Private key.|No |Yes | Inventory, cloud security explorer.
Plaintext ODBC connection string.|No |Yes | Inventory, cloud security explorer.
Plaintext General password.|No |Yes | Inventory, cloud security explorer.
Plaintext User login credentials.|No |Yes | Inventory, cloud security explorer.
Plaintext Travis personal token.|No |Yes | Inventory, cloud security explorer.
Plaintext Slack access token. |No |Yes | Inventory, cloud security explorer.
Plaintext ASP.NET Machine Key.|No |Yes | Inventory, cloud security explorer.
Plaintext HTTP Authorization Header. |No |Yes | Inventory, cloud security explorer.
Plaintext Azure Redis Cache password. |No |Yes | Inventory, cloud security explorer.
Plaintext Azure IoT Shared Access Key. |No |Yes | Inventory, cloud security explorer.
Plaintext Azure DevOps App Secret.|No |Yes | Inventory, cloud security explorer.
Plaintext Azure Function API Key. |No |Yes | Inventory, cloud security explorer.
Plaintext Azure Shared Access Key. |No |Yes | Inventory, cloud security explorer.
Plaintext Azure Logic App Shared Access Signature. |No |Yes | Inventory, cloud security explorer.
Plaintext Azure Active Directory Access Token.|No |Yes | Inventory, cloud security explorer.
Plaintext Azure Service Bus Shared Access Signature.|No |Yes | Inventory, cloud security explorer.

## Related content

- [VM secrets scanning](secrets-scanning-servers.md).
- [Cloud deployment secrets scanning](secrets-scanning-cloud-deployment.md)
- [Azure DevOps scanning](devops-support.md)
