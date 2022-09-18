---
title: Reference list of attack paths
description: This article lists Microsoft Defender for Cloud's list of attack paths based on resource.
ms.topic: reference
ms.date: 09/18/2022
---


# Reference list of attack paths

This article lists the attack paths you might see in Microsoft Defender for Cloud. The attack paths shown in your environment depend on the resources you're protecting and your customized configuration.

To learn about how to respond to these attack paths, see [Identify and remediate attack paths](how-to-manage-attack-path.md).

## Azure VMs

| Attack Path Display Name | Attack Path Description |
|--|--|
| Internet exposed VM has high severity vulnerabilities | Virtual machine '\[MachineName]' is reachable from the internet and has high severity vulnerabilities \[RCE] |
| Internet exposed VM has high severity vulnerabilities and high permission to a subscription | Virtual machine '\[MachineName]' is reachable from the internet, has high severity vulnerabilities \[RCE] and \[IdentityDescription] with \[PermissionType] permission to subscription '\[SubscriptionName]' |
| Internet exposed VM has high severity vulnerabilities and read permission to a data store with sensitive data | Virtual machine '\[MachineName]' is reachable from the internet, has high severity vulnerabilities \[RCE] and \[IdentityDescription] with read permission to \[DatabaseType] '\[DatabaseName]' containing sensitive data |
| Internet exposed VM has high severity vulnerabilities and read permission to a data store | Virtual machine '\[MachineName]' is reachable from the internet, has high severity vulnerabilities \[RCE] and \[IdentityDescription] with read permission to \[DatabaseType] '\[DatabaseName]' |
| Internet exposed VM has high severity vulnerabilities and read permission to a Key Vault | Virtual machine '\[MachineName]' is reachable from the internet, has high severity vulnerabilities \[RCE] and \[IdentityDescription] with read permission to Key Vault '\[KVName]' |
| VM has high severity vulnerabilities and high permission to a subscription | Virtual machine '\[MachineName]' has high severity vulnerabilities \[RCE] and has high permission to subscription '\[SubscriptionName]' |
| VM has high severity vulnerabilities and read permission to a data store with sensitive data | Virtual machine '\[MachineName]' has high severity vulnerabilities \[RCE] and \[IdentityDescription] with read permission to \[DatabaseType] '\[DatabaseName]' containing sensitive data |
| VM has high severity vulnerabilities and read permission to a Key Vault | Virtual machine '\[MachineName]' has high severity vulnerabilities \[RCE] and \[IdentityDescription] with read permission to Key Vault '\[KVName]' |
| VM has high severity vulnerabilities and read permission to a data store | Virtual machine '\[MachineName]' has high severity vulnerabilities \[RCE] and \[IdentityDescription] with read permission to \[DatabaseType] '\[DatabaseName]' |

## AWS VMs

| Attack Path Display Name	| Attack Path Description |
|--|--|
| Internet exposed EC2 instance has high severity vulnerabilities and high permission to an account | AWS EC2 instance '\[EC2Name]' is reachable from the internet, has high severity vulnerabilities\[RCE] and has '\[permission]' permission to account '\[AccountName]' |
| Internet exposed EC2 instance has high severity vulnerabilities and read permission to a DB | AWS EC2 instance '\[MachineName]' is reachable from the internet, has high severity vulnerabilities\[RCE] and has '\[permission]' permission to DB '\[DatabaseName]'|
| Internet exposed EC2 instance has high severity vulnerabilities and read permission to S3 bucket | Option 1 <br> AWS EC2 instance '\[MachineName]' is reachable from the internet, has high severity vulnerabilities\[RCE] and has IAM role attached with '\[Rolepermission]' permission via IAM policy to S3 bucket '\[BucketName]' <br> <br> Option 2 <br> AWS EC2 instance '\[MachineName]' is reachable from the internet, has high severity vulnerabilities\[RCE] and has IAM role attached with '\[S3permission]' permission via bucket policy to S3 bucket '\[BucketName]' <br> <br> Option 3 <br> AWS EC2 instance '\[MachineName]' is reachable from the internet, has high severity vulnerabilities\[RCE] and has IAM role attached with '\[Rolepermission]' permission via IAM policy and '\[S3permission]' permission via bucket policy to S3 bucket '\[BucketName]'|
| Internet exposed EC2 instance has high severity vulnerabilities and read permission to a S3 bucket with sensitive data | Option 1 <br> AWS EC2 instance '\[MachineName]' is reachable from the internet, has high severity vulnerabilities\[RCE] and has IAM role attached with '\[Rolepermission]' permission via IAM policy to S3 bucket '\[BucketName]' containing sensitive data <br> <br> Option 2 <br> AWS EC2 instance '\[MachineName]' is reachable from the internet, has high severity vulnerabilities\[RCE] and has IAM role attached with '\[S3permission]' permission via bucket policy to S3 bucket '\[BucketName]' containing sensitive data <br> <br> Option 3 <br> AWS EC2 instance '\[MachineName]' is reachable from the internet, has high severity vulnerabilities\[RCE] and has IAM role attached with '\[Rolepermission]' permission via IAM policy and '\[S3permission] permission via bucket policy to S3 bucket '\[BucketName]' containing sensitive data |
| Internet exposed EC2 instance has high severity vulnerabilities and read permission to a KMS | Option 1 <br> AWS EC2 instance '\[MachineName]' is reachable from the internet, has high severity vulnerabilities\[RCE] and has IAM role attached with '\[Rolepermission]' permission via IAM policy to AWS Key Management Service (KMS) '\[KeyName]' <br> <br> Option 2 <br> AWS EC2 instance '\[MachineName]' is reachable from the internet, has vulnerabilities allowing remote code execution and has IAM role attached with '\[Keypermission]' permission via AWS Key Management Service (KMS) policy to key '\[KeyName]' <br> <br> Option 3 <br> AWS EC2 instance '\[MachineName]' is reachable from the internet, has vulnerabilities allowing remote code execution and has IAM role attached with '\[Rolepermission]' permission via IAM policy and '\[Keypermission] permission via AWS Key Management Service (KMS) policy to key '\[KeyName]' |
| Internet exposed EC2 instance has high severity vulnerabilities and read permission to a data store | Option 1 <br> AWS EC2 instance '\[MachineName]' is reachable from the internet, has high severity vulnerabilities\[RCE] and has IAM role attached with '\[Rolepermission]' permission via IAM policy to '\[data storeType]' '\[BucketName]' <br> <br> Option 2 <br> AWS EC2 instance '\[MachineName]' is reachable from the internet, has high severity vulnerabilities\[RCE] and has IAM role attached with '\[S3permission]' permission via bucket policy to '\[data storeType]' '\[BucketName]' Option 3 <br> AWS EC2 instance '\[MachineName]' is reachable from the internet, has high severity vulnerabilities\[RCE] and has IAM role attached with '\[Rolepermission]' permission via IAM policy and '\[S3permission] permission via bucket policy to '\[data storeType]' '\[BucketName]' |
| Internet exposed EC2 instance with high severity vulnerabilities and read permission to a data store with sensitive data | Option 1 <br> AWS EC2 instance '\[MachineName]' is reachable from the internet, has high severity vulnerabilities\[RCE] and has IAM role attached with '\[Rolepermission]' permission via IAM policy to '\[data storeType]' '\[BucketName]' containing sensitive data <br> <br> Option 2 <br> AWS EC2 instance '\[MachineName]' is reachable from the internet, has high severity vulnerabilities\[RCE] and has IAM role attached with '\[S3permission]' permission via bucket policy to '\[data storeType]' '\[BucketName]' containing sensitive data <br> <br> Option 3 <br> AWS EC2 instance '\[MachineName]' is reachable from the internet, has high severity vulnerabilities\[RCE] and has IAM role attached with '\[Rolepermission]' permission via IAM policy and '\[S3permission] permission via bucket policy to '\[data storeType]' '\[BucketName]' containing sensitive data|
| Internet exposed EC2 instance has high severity vulnerabilities | AWS EC2 instance '\[EC2Name]' is reachable from the internet and has high severity vulnerabilities\[RCE] |
| EC2 instance has high severity vulnerabilities and high permission to an account | An EC2 instance '\[EC2Name]' has high severity vulnerabilities\[RCE] and has '\[permission]' permission to account '\[AccountName] |
| EC2 instance has high severity vulnerabilities and read permission to an AWS KMS | Option 1 <br> An EC2 instance '\[MachineName]' has high severity vulnerabilities\[RCE] and has IAM role attached with '\[Rolepermission]' permission via IAM policy to AWS Key Management Service (KMS) '\[KeyName]' <br> <br> Option 2 <br> An EC2 instance '\[MachineName]' has vulnerabilities allowing remote code execution and has IAM role attached with '\[Keypermission]' permission via AWS Key Management Service (KMS) policy to key '\[KeyName]' <br> <br> Option 3 <br> AWS EC2 instance '\[MachineName]' has vulnerabilities allowing remote code execution and has IAM role attached with '\[Rolepermission]' permission via IAM policy and '\[Keypermission] permission via AWS Key Management Service (KMS) policy to key '\[KeyName]' |
| EC2 instance has high severity vulnerabilities and read permission to a data store with sensitive data | Option 1 <br> An EC2 instance '\[MachineName]' has high severity vulnerabilities\[RCE] and has IAM role attached with '\[Rolepermission]' permission via IAM policy to S3 bucket '\[BucketName]' containing sensitive data <br> <br> Option 2 <br> An EC2 instance '\[MachineName]' has high severity vulnerabilities\[RCE] and has IAM role attached with '\[permission]' permission via bucket policy to S3 bucket '\[BucketName]' containing sensitive data <br> <br> Option 3 <br> An EC2 instance '\[MachineName]' has high severity vulnerabilities\[RCE] and has IAM role attached with '\[Rolepermission]' permission via IAM policy and '\[permission] permission via bucket policy to S3 bucket '\[BucketName]' containing sensitive data" |

## Azure data

| Attack Path Display Name	| Attack Path Description |
|--|--|
| Internet exposed SQL on VM has a user account with commonly used username and allows code execution on the VM | SQL on VM '\[SqlVirtualMachineName]' is reachable from the internet, has a local user account with commonly used username (which is prone to brute force attacks), and has vulnerabilities allowing code execution and lateral movement to the underlying VM |
| Internet exposed SQL on VM has a user account with commonly used username and known vulnerabilities | SQL on VM '\[SqlVirtualMachineName]' is reachable from the internet, has a local user account with commonly used username (which is prone to brute force attacks), and has known vulnerabilities (CVEs) |
| SQL on VM has a user account with commonly used username and allows code execution on the VM | SQL on VM '\[SqlVirtualMachineName]' has a local user account with commonly used username (which is prone to brute force attacks), and has vulnerabilities allowing code execution and lateral movement to the underlying VM |
| SQL on VM has a user account with commonly used username and known vulnerabilities | SQL on VM '\[SqlVirtualMachineName]' has a local user account with commonly used username (which is prone to brute force attacks), and has known vulnerabilities (CVEs) |

## AWS Data

| Attack Path Display Name	| Attack Path Description |
|--|--|
| Internet exposed AWS S3 Bucket with sensitive data is publicly accessible | S3 bucket '\[BucketName]' with sensitive data is reachable from the internet and allows public read access without authorization required |

## Azure containers

| Attack Path Display Name	| Attack Path Description |
|--|--|--|
| Internet exposed Kubernetes pod is running a container with RCE vulnerabilities | Internet exposed Kubernetes pod '\[pod name]' in namespace '\[namespace]' is running a container '\[container name]' using image '\[image name]' which has vulnerailities allowing remote code execution |
| Kubernetes pod running on an internet exposed node uses host network is running a container with RCE vulnerabilities | Kubernetes pod '\[pod name]' in namespace '\[namespace]' with host network access enabled is exposed to the internet via the host network. The pod is running container '\[container name]' using image '\[image name]' which has vulnerabilities allowing remote code execution |

## Insights and connections

| Insight | Description | Supported entities |
|--|--|--|
| Exposed to the internet | Indicates that a resource is exposed to the internet. Supports port filtering | Azure virtual machine, AWS EC2, Azure storage account, Azure SQL server, Azure Cosmos DB, AWS S3, Kubernetes pod. |
| Contains sensitive data | Indicates that a resource contains sensitive data based on Azure Purview scan and applicable only if Azure Purview is enabled. | Azure SQL Server, Azure Storage Account, AWS S3 bucket. |
| Has tags | List the resource tags of the cloud resource | All Azure and AWS resources. |
| Installed software | List all software installed on the machine. This is applicable only for VMs that have Threat and vulnerability management integration with Defender for Cloud enabled and are connected to Defender for Cloud. | Azure virtual machine, AWS EC2 |
| allows public access | Indicates that a public read access is allowed to the data store with no authorization required | Azure storage account, AWS S3 bucjet |
| doesn't have MFA enabled | Indicates that the user account does not have a multi-factor authentication solution enabled | AAD User account, IAM user |
| is external user | Indicates that the user account is outside the organization's domain | AAD User account |
| is managed | Indicates that an identity is managed by the cloud provider | Azure Managed Identity |
| contains common usernames | Indicates that a SQL server has user accounts with common usernames which are prone to brute force attacks. | SQL on VM |
| can execute code on the host | Indicates that a SQL server allows executing code on the underlying VM using a built-in mechanism such as xp_cmdshell. | SQL on VM |
| has vulnerabilities | indicates that the resource SQL server has vulnerabilities detected | SQL on VM |
| DEASM findings | Microsft Defender External Attack Surface Management  (DEASM) internet scanning findings | Public IP |
| privileged container | Indicates that a Kubernetes container runs in a privileged mode | Kubernetes container |
| uses host network | Indicates that a Kubernetes pod uses the network namespace of its host machine | Kubernetes pod |
| has high severity vulnerabilities | Indicates that a resource has high severity vulnerabilities | Azure VM, AWS EC2, Kubernetes image |
| vulnerable to remote code execution | Indicates that a resource has vulnerabilities allowing remote code execution | Azure VM, AWS EC2, Kubernetes image |
| public IP metadata | List the metadata of an Public IP | Public IP |
| identity metadata | List the metadata of an identity | AAD Identity |

## Next steps

For related information, see the following:
- [What are the Cloud Security Graph, Attack Path Analysis, and the Cloud Security Explorer?](concept-attack-path.md)
- [Identify and remediate attack paths](how-to-manage-attack-path.md)
- [Cloud Security Explorer](how-to-manage-cloud-security-explorer.md)
