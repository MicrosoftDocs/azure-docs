---
title: Reference list of attack paths and cloud security graph components
titleSuffix: Defender for Cloud
description: This article lists Microsoft Defender for Cloud's list of attack paths based on resource.
ms.topic: reference
ms.custom: ignite-2022
ms.date: 03/22/2023
---

# Reference list of attack paths and cloud security graph components

This article lists the attack paths, connections, and insights used in Defender for Cloud Security Posture Management (CSPM).

- You need to [enable Defender for CSPM](enable-enhanced-security.md#enable-defender-plans-to-get-the-enhanced-security-features) to view attack paths.
- What you see in your environment depends on the resources you're protecting, and your customized configuration. 

Learn more about [the cloud security graph, attack path analysis, and the cloud security explorer](concept-attack-path.md).

## Attack paths

### Azure VMs

Prerequisite: For a list of prerequisites, see the [Availability table](how-to-manage-attack-path.md#availability) for attack paths.

| Attack Path Display Name | Attack Path Description |
|--|--|
| Internet exposed VM has high severity vulnerabilities | A virtual machine is reachable from the internet and has high severity vulnerabilities. |
| Internet exposed VM has high severity vulnerabilities and high permission to a subscription | A virtual machine is reachable from the internet, has high severity vulnerabilities, and identity and permission to a subscription. |
| Internet exposed VM has high severity vulnerabilities and read permission to a data store with sensitive data (Preview) | A virtual machine is reachable from the internet, has high severity vulnerabilities and read permission to a data store containing sensitive data. <br/> Prerequisite: [Enable data-aware security for storage accounts in Defender for CSPM](data-security-posture-enable.md), or [leverage Microsoft Purview Data Catalog to protect sensitive data](information-protection.md). |
| Internet exposed VM has high severity vulnerabilities and read permission to a data store | A virtual machine is reachable from the internet and has high severity vulnerabilities and read permission to a data store. |
| Internet exposed VM has high severity vulnerabilities and read permission to a Key Vault | A virtual machine is reachable from the internet and has high severity vulnerabilities and read permission to a key vault. |
| VM has high severity vulnerabilities and high permission to a subscription | A virtual machine has high severity vulnerabilities and has high permission to a subscription. |
| VM has high severity vulnerabilities and read permission to a data store with sensitive data (Preview) | A virtual machine has high severity vulnerabilities and read permission to a data store containing sensitive data. <br/>Prerequisite: [Enable data-aware security for storage accounts in Defender for CSPM](data-security-posture-enable.md), or [leverage Microsoft Purview Data Catalog to protect sensitive data](information-protection.md). |
| VM has high severity vulnerabilities and read permission to a key vault | A virtual machine has high severity vulnerabilities and read permission to a key vault. |
| VM has high severity vulnerabilities and read permission to a data store | A virtual machine has high severity vulnerabilities and read permission to a data store. |

### AWS Instances

Prerequisite: [Enable agentless scanning](enable-vulnerability-assessment-agentless.md).

| Attack Path Display Name	| Attack Path Description |
|--|--|
| Internet exposed EC2 instance has high severity vulnerabilities and high permission to an account | An AWS EC2 instance is reachable from the internet, has high severity vulnerabilities and has permission to an account. |
| Internet exposed EC2 instance has high severity vulnerabilities and read permission to a DB | An AWS EC2 instance is reachable from the internet, has high severity vulnerabilities and has permission to a database. |
| Internet exposed EC2 instance has high severity vulnerabilities and read permission to S3 bucket | An AWS EC2 instance is reachable from the internet, has high severity vulnerabilities and has an IAM role attached with permission to an S3 bucket via an IAM policy, or via a bucket policy, or via both an IAM policy and a bucket policy. 
| Internet exposed EC2 instance has high severity vulnerabilities and read permission to a S3 bucket with sensitive data (Preview) | An AWS EC2 instance is reachable from the internet has high severity vulnerabilities and has an IAM role attached with permission to an S3 bucket containing sensitive data via an IAM policy, or via a bucket policy, or via both an IAM policy and bucket policy. <br/> Prerequisite: [Enable data-aware security for S3 buckets in Defender for CSPM](data-security-posture-enable.md), or [leverage Microsoft Purview Data Catalog to protect sensitive data](information-protection.md).  |
| Internet exposed EC2 instance has high severity vulnerabilities and read permission to a KMS | An AWS EC2 instance is reachable from the internet, has high severity vulnerabilities and has an IAM role attached with permission to an AWS Key Management Service (KMS) via an IAM policy, or via an AWS Key Management Service (KMS) policy, or via both an IAM policy and an AWS KMS policy.|
| Internet exposed EC2 instance has high severity vulnerabilities | An AWS EC2 instance is reachable from the internet and has high severity vulnerabilities. | 
| EC2 instance with high severity vulnerabilities has high privileged permissions to an account | An AWS EC2 instance  has high severity vulnerabilities and has permissions to an account. | 
| EC2 instance with high severity vulnerabilities has read permissions to a data store |An AWS EC2 instance has high severity vulnerabilities and has an IAM role attached which is granted with permissions to an S3 bucket via an IAM policy or via a bucket policy, or via both an IAM policy and a bucket policy. | 
| EC2 instance with high severity vulnerabilities has read permissions to a data store with sensitive data (Preview) | An AWS EC2 instance has high severity vulnerabilities and has an IAM role attached which is granted with permissions to an S3 bucket containing sensitive data via an IAM policy or via a bucket policy, or via both an IAM and bucket policy. <br/> Prerequisite: [Enable data-aware security for S3 buckets in Defender for CSPM](data-security-posture-enable.md), or [leverage Microsoft Purview Data Catalog to protect sensitive data](information-protection.md).  | 
| EC2 instance with high severity vulnerabilities has read permissions to a KMS key | An AWS EC2 instance has high severity vulnerabilities and has an IAM role attached which is granted with permissions to an AWS Key Management Service (KMS) key via an IAM policy, or via an AWS Key Management Service (KMS) policy, or via both an IAM and AWS KMS policy.  |

### Azure data

| Attack Path Display Name	| Attack Path Description |
|--|--|
| Internet exposed SQL on VM has a user account with commonly used username and allows code execution on the VM | SQL on VM is reachable from the internet, has a local user account with a commonly used username (which is prone to brute force attacks), and has vulnerabilities allowing code execution and lateral movement to the underlying VM. <br/> Prerequisite: [Enable Microsoft Defender for SQL servers on machines](defender-for-sql-usage.md) |
| Internet exposed SQL on VM has a user account with commonly used username and known vulnerabilities | SQL on VM is reachable from the internet, has a local user account with a commonly used username (which is prone to brute force attacks), and has known vulnerabilities (CVEs). <br/> Prerequisite: [Enable Microsoft Defender for SQL servers on machines](defender-for-sql-usage.md) |
| SQL on VM has a user account with commonly used username and allows code execution on the VM | SQL on VM has a local user account with a commonly used username (which is prone to brute force attacks), and has vulnerabilities allowing code execution and lateral movement to the underlying VM. <br/> Prerequisite: [Enable Microsoft Defender for SQL servers on machines](defender-for-sql-usage.md)|
| SQL on VM has a user account with commonly used username and known vulnerabilities | SQL on VM has a local user account with a commonly used username (which is prone to brute force attacks), and has known vulnerabilities (CVEs). <br/> Prerequisite: [Enable Microsoft Defender for SQL servers on machines](defender-for-sql-usage.md)|
| Managed database with excessive internet exposure allows basic (local user/password) authentication | Database can be accessed through the internet from any public IP and allows authentication using username and password (basic authentication mechanism) which exposes the DB to brute force attacks. |
| Internet exposed VM has high severity vulnerabilities and a hosted database installed  | An attacker with network access to the DB machine can exploit the vulnerabilities and gain remote code execution.
| Private Azure blob storage container replicates data to internet exposed and publicly accessible Azure blob storage container (Preview) | An internal Azure storage container replicates its data to another Azure storage container which is reachable from the internet and allows public access, and poses this data at risk. |
| Internet exposed Azure Blob Storage container with sensitive data is publicly accessible (Preview) | A blob storage account container with sensitive data is reachable from the internet and allows public read access without authorization required. <br/> Prerequisite: [Enable data-aware security for storage accounts in Defender for CSPM](data-security-posture-enable.md).|
| Internet exposed managed database allows basic (local user/password) authentication (Preview) | A database can be accessed through the internet and allows authentication using username and password (basic authentication mechanism) which exposes the DB to brute force attacks. |
| Internet exposed Azure Blob Storage container with sensitive data is publicly accessible (Preview) | Azure Blob storage container with sensitive data is reachable from the internet and allows public read access without authorization required |

### AWS data

| Attack Path Display Name	| Attack Path Description |
|--|--|
| Internet exposed AWS S3 Bucket with sensitive data is publicly accessible | An S3 bucket with sensitive data is reachable from the internet and allows public read access without authorization required. <br/> Prerequisite: [Enable data-aware security for S3 buckets in Defender for CSPM](data-security-posture-enable.md), or [leverage Microsoft Purview Data Catalog to protect sensitive data](information-protection.md). |
|Internet exposed SQL on EC2 instance has a user account with commonly used username and allows code execution on the underlying compute | Internet exposed SQL on EC2 instance has a user account with commonly used username and allows code execution on the underlying compute. <br/> Prerequisite: [Enable Microsoft Defender for SQL servers on machines](defender-for-sql-usage.md). |
|Internet exposed SQL on EC2 instance has a user account with commonly used username and known vulnerabilities | SQL on EC2 instance is reachable from the internet, has a local user account with a commonly used username (which is prone to brute force attacks), and has known vulnerabilities (CVEs). <br/> Prerequisite: [Enable Microsoft Defender for SQL servers on machines](defender-for-sql-usage.md) |
|SQL on EC2 instance has a user account with commonly used username and allows code execution on the underlying compute | SQL on EC2 instance has a local user account with commonly used username (which is prone to brute force attacks), and has vulnerabilities allowing code execution and lateral movement to the underlying compute. <br/> Prerequisite: [Enable Microsoft Defender for SQL servers on machines](defender-for-sql-usage.md) |
| SQL on EC2 instance has a user account with commonly used username and known vulnerabilities |SQL on EC2 instance [EC2Name] has a local user account with commonly used username (which is prone to brute force attacks), and has known vulnerabilities (CVEs). <br/> Prerequisite: [Enable Microsoft Defender for SQL servers on machines](defender-for-sql-usage.md)   |
|Managed database with excessive internet exposure allows basic (local user/password) authentication | Database can be accessed through the internet from any public IP and allows authentication using username and password (basic authentication mechanism) which exposes the DB to brute force attacks. |
|Internet exposed EC2 instance has high severity vulnerabilities and a hosted database installed | An attacker with network access to the DB machine can exploit the vulnerabilities and gain remote code execution.
| Private AWS S3 bucket replicates data to internet exposed and publicly accessible AWS S3 bucket (Preview) | An internal AWS S3 bucket replicates its data to another S3 bucket which is reachable from the internet and allows public access, and poses this data at risk. |
| RDS snapshot is publicly available to all AWS accounts (Preview) | A snapshot of an RDS instance or cluster is publicly accessible by all AWS accounts. |
| Internet exposed managed database allows basic (local user/password) authentication (Preview) | A database can be accessed through the internet and allows user/password authentication only which exposes the DB to brute force attacks. |
| Internet exposed SQL on EC2 instance has a user account with commonly used username and allows code execution on the underlying compute (Preview) | SQL on EC2 instance is reachable from the internet, has a local user account with commonly used username (which is prone to brute force attacks), and has vulnerabilities allowing code execution and lateral movement to the underlying compute |
| Internet exposed SQL on EC2 instance has a user account with commonly used username and known vulnerabilities (Preview) | SQL on EC2 instance is reachable from the internet, has a local user account with commonly used username (which is prone to brute force attacks), and has known vulnerabilities (CVEs) |
| SQL on EC2 instance has a user account with commonly used username and allows code execution on the underlying compute (Preview) | SQL on EC2 instance has a local user account with commonly used username (which is prone to brute force attacks), and has vulnerabilities allowing code execution and lateral movement to the underlying compute |
| SQL on EC2 instance has a user account with commonly used username and known vulnerabilities (Preview) | SQL on EC2 instance has a local user account with commonly used username (which is prone to brute force attacks), and has known vulnerabilities (CVEs) |
| Private AWS S3 bucket replicates data to internet exposed and publicly accessible AWS S3 bucket (Preview) | Private AWS S3 bucket is replicating data to internet exposed and publicly accessible AWS S3 bucket |
| Private AWS S3 bucket with sensitive data replicates data to internet exposed and publicly accessible AWS S3 bucket (Preview) | Private AWS S3 bucket with sensitive data is replicating data to internet exposed and publicly accessible AWS S3 bucket|
| RDS snapshot is publicly available to all AWS accounts (Preview) | RDS snapshot is publicly available to all AWS accounts |

### Azure containers

Prerequisite: [Enable Defender for Containers](defender-for-containers-enable.md), and install the relevant agents in order to view attack paths that are related to containers. This will also give you the ability to [query](how-to-manage-cloud-security-explorer.md#build-a-query-with-the-cloud-security-explorer) containers data plane workloads in security explorer.

| Attack Path Display Name	| Attack Path Description |
|--|--|
| Internet exposed Kubernetes pod is running a container with RCE vulnerabilities | An internet exposed Kubernetes pod in a namespace is running a container using an image that has vulnerabilities allowing remote code execution. |
| Kubernetes pod running on an internet exposed node uses host network is running a container with RCE vulnerabilities | A Kubernetes pod in a namespace with host network access enabled is exposed to the internet via the host network. The pod is running a container using an image that has vulnerabilities allowing remote code execution. |

### GitHub repositories

Prerequisite: [Enable Defender for DevOps](defender-for-devops-introduction.md).

| Attack Path Display Name	| Attack Path Description |
|--|--|
| Internet exposed GitHub repository with plaintext secret is publicly accessible (Preview) | A GitHub repository is reachable from the internet, allows public read access without authorization required, and holds plaintext secrets. |

## Cloud security graph components list

This section  lists all of the cloud security graph components (connections and insights) that can be used in queries with the [cloud security explorer](concept-attack-path.md).

### Insights

| Insight | Description | Supported entities |
|--|--|--|
| Exposed to the internet | Indicates that a resource is exposed to the internet. Supports port filtering | Azure virtual machine, AWS EC2, Azure storage account, Azure SQL server, Azure Cosmos DB, AWS S3, Kubernetes pod, Azure SQL Managed Instance, Azure MySQL Single Server, Azure MySQL Flexible Server, Azure PostgreSQL Single Server, Azure PostgreSQL Flexible Server, Azure MariaDB Single Server, Synapse Workspace, RDS Instance |
| Allows basic authentication | Indicates that a resource allows basic (local user/password or key-based) authentication | Azure SQL Server, RDS Instance |
| Contains sensitive data <br/> <br/> Prerequisite: [Enable data-aware security for storage accounts in Defender for CSPM](data-security-posture-enable.md), or [leverage Microsoft Purview Data Catalog to protect sensitive data](information-protection.md). | Indicates that a resource contains sensitive data. | Azure Storage Account, Azure Storage Account Container, AWS S3 bucket, Azure SQL Server, Azure SQL Database, Azure Data Lake Storage Gen2, Azure Database for PostgreSQL, Azure Database for MySQL, Azure Synapse Analytics, Azure Cosmos DB accounts |
| Moves data to | Indicates that a resource moves its data to another resource | Storage account container, AWS S3, AWS RDS instance, AWS RDS cluster |
| Gets data from | Indicates that a resource gets its data from another resource | Storage account container, AWS S3, AWS RDS instance, AWS RDS cluster |
| Has tags | Lists the resource tags of the cloud resource | All Azure and AWS resources |
| Installed software | Lists all software installed on the machine. This insight is applicable only for VMs that have threat and vulnerability management integration with Defender for Cloud enabled and are connected to Defender for Cloud. | Azure virtual machine, AWS EC2 |
| Allows public access | Indicates that a public read access is allowed to the resource with no authorization required | Azure storage account, AWS S3 bucket, GitHub repository |
| Doesn't have MFA enabled | Indicates that the user account does not have a multi-factor authentication solution enabled | Azure AD User account, IAM user |
| Is external user | Indicates that the user account is outside the organization's domain | Azure AD User account |
| Is managed | Indicates that an identity is managed by the cloud provider | Azure Managed Identity |
| Contains common usernames | Indicates that a SQL server has user accounts with common usernames which are prone to brute force attacks. | SQL VM, Arc-Enabled SQL VM |
| Can execute code on the host | Indicates that a SQL server allows executing code on the underlying VM using a built-in mechanism such as xp_cmdshell. | SQL VM, Arc-Enabled SQL VM |
| Has vulnerabilities | Indicates that the resource SQL server has vulnerabilities detected | SQL VM, Arc-Enabled SQL VM |
| DEASM findings | Microsoft Defender External Attack Surface Management (DEASM) internet scanning findings | Public IP |
| Privileged container | Indicates that a Kubernetes container runs in a privileged mode | Kubernetes container |
| Uses host network | Indicates that a Kubernetes pod uses the network namespace of its host machine | Kubernetes pod |
| Has high severity vulnerabilities | Indicates that a resource has high severity vulnerabilities | Azure VM, AWS EC2, Kubernetes image |
| Vulnerable to remote code execution | Indicates that a resource has vulnerabilities allowing remote code execution | Azure VM, AWS EC2, Kubernetes image |
| Public IP metadata | Lists the metadata of an Public IP | Public IP |
| Identity metadata | Lists the metadata of an identity | Azure AD Identity |

### Connections

| Connection | Description | Source entity types | Destination entity types |
|--|--|--|--|
| Can authenticate as | Indicates that an Azure resource can authenticate to an identity and use its privileges | Azure VM, Azure VMSS, Azure Storage Account, Azure App Services, SQL Servers | Azure AD managed identity |
| Has permission to | Indicates that an identity has permissions to a resource or a group of resources | Azure AD user account, Managed Identity, IAM user, EC2 instance | All Azure & AWS resources|
| Contains | Indicates that the source entity contains the target entity | Azure subscription, Azure resource group, AWS account, Kubernetes namespace, Kubernetes pod, Kubernetes cluster, GitHub owner, Azure DevOps project, Azure DevOps organization, Azure SQL server | All Azure & AWS resources, All Kubernetes entities, All DevOps entities, Azure SQL database |
| Routes traffic to | Indicates that the source entity can route network traffic to the target entity | Public IP, Load Balancer, VNET, Subnet, VPC, Internet Gateway, Kubernetes service, Kubernetes pod| Azure VM, Azure VMSS, AWS EC2, Subnet, Load Balancer, Internet gateway, Kubernetes pod, Kubernetes service |
| Is running | Indicates that the source entity is running the target entity as a process | Azure VM, EC2, Kubernetes container | SQL, Arc-Enabled SQL, Hosted MongoDB, Hosted MySQL, Hosted Oracle, Hosted PostgreSQL, Hosted SQL Server, Kubernetes image, Kubernetes pod |
| Member of | Indicates that the source identity is a member of the target identities group | Azure AD group, Azure AD user | Azure AD group |
| Maintains | Indicates that the source Kubernetes entity manages the life cycle of the target Kubernetes entity | Kubernetes workload controller, Kubernetes replica set, Kubernetes stateful set, Kubernetes daemon set, Kubernetes jobs, Kubernetes cron job | Kubernetes pod |


## Next steps

- [Identify and analyze risks across your environment](concept-attack-path.md)
- [Identify and remediate attack paths](how-to-manage-attack-path.md)
- [Cloud security explorer](how-to-manage-cloud-security-explorer.md)