---
title: Reference list of cloud security graph components
description: This article lists Microsoft Defender for Cloud's list of attack paths based on resource.
ms.topic: reference
ms.custom: ignite-2023
ms.date: 10/26/2023
---

# Reference list of cloud security graph components

This article lists all of the cloud security graph components (connections and insights) that can be used in queries with the [cloud security explorer](concept-attack-path.md).

- What you see in your environment depends on the resources you're protecting, and your customized configuration.

Learn more about [the cloud security graph, attack path analysis, and the cloud security explorer](concept-attack-path.md).

## Cloud security graph components list

### Insights

| Insight | Description | Supported entities |
|--|--|--|
| Exposed to the internet | Indicates that a resource is exposed to the internet. Supports port filtering. [Learn more](concept-data-security-posture-prepare.md#exposed-to-the-internetallows-public-access) | Azure virtual machine, AWS EC2, Azure storage account, Azure SQL server, Azure Cosmos DB, AWS S3, Kubernetes pod, Azure SQL Managed Instance, Azure MySQL Single Server, Azure MySQL Flexible Server, Azure PostgreSQL Single Server, Azure PostgreSQL Flexible Server, Azure MariaDB Single Server, Synapse Workspace, RDS Instance, GCP VM instance, GCP SQL admin instance |
| Allows basic authentication (Preview) | Indicates that a resource allows basic (local user/password or key-based) authentication | Azure SQL Server, RDS Instance, Azure MariaDB Single Server, Azure MySQL Single Server, Azure MySQL Flexible Server, Synapse Workspace, Azure PostgreSQL Single Server, Azure SQL Managed Instance |
| Contains sensitive data <br/> <br/> Prerequisite: [Enable data-aware security for storage accounts in Defender CSPM](data-security-posture-enable.md), or [leverage Microsoft Purview Data Catalog to protect sensitive data](information-protection.md). | Indicates that a resource contains sensitive data. | MDC Sensitive data discovery:<br /><br />Azure Storage Account, Azure Storage Account Container, AWS S3 bucket, Azure SQL Server (preview), Azure SQL Database (preview), RDS Instance (preview), RDS Instance Database (preview), RDS Cluster (preview)<br /><br />Purview Sensitive data discovery (preview):<br /><br />Azure Storage Account, Azure Storage Account Container, AWS S3 bucket, Azure SQL Server, Azure SQL Database, Azure Data Lake Storage Gen2, Azure Database for PostgreSQL, Azure Database for MySQL, Azure Synapse Analytics, Azure Cosmos DB accounts, GCP cloud storage bucket |
| Moves data to (Preview) | Indicates that a resource transfers its data to another resource | Storage account container, AWS S3, AWS RDS instance, AWS RDS cluster |
| Gets data from (Preview) | Indicates that a resource gets its data from another resource | Storage account container, AWS S3, AWS RDS instance, AWS RDS cluster |
| Has tags | Lists the resource tags of the cloud resource | All Azure, AWS, and GCP resources |
| Installed software | Lists all software installed on the machine. This insight is applicable only for VMs that have threat and vulnerability management integration with Defender for Cloud enabled and are connected to Defender for Cloud. | Azure virtual machine, AWS EC2 |
| Allows public access | Indicates that a public read access is allowed to the resource with no authorization required. [Learn more](concept-data-security-posture-prepare.md#exposed-to-the-internetallows-public-access) | Azure storage account, AWS S3 bucket, GitHub repository, GCP cloud storage bucket |
| Doesn't have MFA enabled | Indicates that the user account does not have a multi-factor authentication solution enabled | Microsoft Entra user account, IAM user |
| Is external user | Indicates that the user account is outside the organization's domain | Microsoft Entra user account |
| Is managed | Indicates that an identity is managed by the cloud provider | Azure Managed Identity |
| Contains common usernames | Indicates that a SQL server has user accounts with common usernames which are prone to brute force attacks. | SQL VM, Arc-Enabled SQL VM |
| Can execute code on the host | Indicates that a SQL server allows executing code on the underlying VM using a built-in mechanism such as xp_cmdshell. | SQL VM, Arc-Enabled SQL VM |
| Has vulnerabilities | Indicates that the resource SQL server has vulnerabilities detected | SQL VM, Arc-Enabled SQL VM |
| DEASM findings | Microsoft Defender External Attack Surface Management (DEASM) internet scanning findings | Public IP |
| Privileged container | Indicates that a Kubernetes container runs in a privileged mode | Kubernetes container |
| Uses host network | Indicates that a Kubernetes pod uses the network namespace of its host machine | Kubernetes pod |
| Has high severity vulnerabilities | Indicates that a resource has high severity vulnerabilities | Azure VM, AWS EC2, Container image, GCP VM instance |
| Vulnerable to remote code execution | Indicates that a resource has vulnerabilities allowing remote code execution | Azure VM, AWS EC2, Container image, GCP VM instance |
| Public IP metadata | Lists the metadata of an Public IP | Public IP |
| Identity metadata | Lists the metadata of an identity | Microsoft Entra identity |

### Connections

| Connection | Description | Source entity types | Destination entity types |
|--|--|--|--|
| Can authenticate as | Indicates that an Azure resource can authenticate to an identity and use its privileges | Azure VM, Azure VMSS, Azure Storage Account, Azure App Services, SQL Servers | Microsoft Entra managed identity |
| Has permission to | Indicates that an identity has permissions to a resource or a group of resources | Microsoft Entra user account, Managed Identity, IAM user, EC2 instance | All Azure & AWS resources|
| Contains | Indicates that the source entity contains the target entity | Azure subscription, Azure resource group, AWS account, Kubernetes namespace, Kubernetes pod, Kubernetes cluster, GitHub owner, Azure DevOps project, Azure DevOps organization, Azure SQL server, RDS Cluster, RDS Instance, GCP project, GCP Folder, GCP Organization | All Azure, AWS, and GCP resources, All Kubernetes entities, All DevOps entities, Azure SQL database, RDS Instance, RDS Instance Database |
| Routes traffic to | Indicates that the source entity can route network traffic to the target entity | Public IP, Load Balancer, VNET, Subnet, VPC, Internet Gateway, Kubernetes service, Kubernetes pod| Azure VM, Azure VMSS, AWS EC2, Subnet, Load Balancer, Internet gateway, Kubernetes pod, Kubernetes service, GCP VM instance, GCP instance group |
| Is running | Indicates that the source entity is running the target entity as a process | Azure VM, EC2, Kubernetes container | SQL, Arc-Enabled SQL, Hosted MongoDB, Hosted MySQL, Hosted Oracle, Hosted PostgreSQL, Hosted SQL Server, Container image, Kubernetes pod |
| Member of | Indicates that the source identity is a member of the target identities group | Microsoft Entra group, Microsoft Entra user | Microsoft Entra group |
| Maintains | Indicates that the source Kubernetes entity manages the life cycle of the target Kubernetes entity | Kubernetes workload controller, Kubernetes replica set, Kubernetes stateful set, Kubernetes daemon set, Kubernetes jobs, Kubernetes cron job | Kubernetes pod |

## Next steps

- [Identify and analyze risks across your environment](concept-attack-path.md)
- [Identify and remediate attack paths](how-to-manage-attack-path.md)
- [Cloud security explorer](how-to-manage-cloud-security-explorer.md)
