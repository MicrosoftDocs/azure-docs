---
title: Protecting cloud deployment secrets with Microsoft Defender for Cloud
description: Learn how to protect cloud deployment secrets with Defender for CSPM's agentless secrets scanning in Microsoft Defender for Cloud.
ms.topic: overview
ms.date: 04/16/2024
---


# Protecting cloud deployment secrets

Defender for Cloud provides agentless secrets scanning for cloud deployments. Cloud deployments (infrastructure as code) refers to the process of deploying and managing resources on cloud providers such as Azure and AWS at scale, using tools such as Azure Resource Manager templates and AWS CloudFormation stack.

Scanning helps you to quickly detect plaintext secrets in cloud deployments. If secrets are detected Defender for Cloud can assist your security team to prioritize action and remediate to minimize the risk of lateral movement.

## How does cloud deployment secrets scanning work?

Secrets scanning for cloud deployment resources is agentless and uses cloud control plan APIs. 

The Microsoft secrets scanning engine verifies whether SSH private keys can be used to move laterally in your network. 

- SSH keys that aren’t successfully verified are categorized as unverified on the Defender for Cloud Recommendations page. 
- Directories recognized as containing test-related content are excluded from scanning.

## What’s supported?

Scanning for cloud deployment resources detects plaintext secrets. Scanning is available when you’re using the Defender Cloud Security Posture Management (CSPM) plan. Azure and AWS cloud deployment are supported. Review the list of secrets that Defender for Cloud can discover.

## How do I identity and remediate secrets issues?

There are a number of ways:
- Review secrets in the asset inventory: The inventory shows the security state of resources connected to Defender for Cloud. From the inventory you can view the secrets discovered on a specific machine.
- Review secrets recommendations: When secrets are found on assets, a recommendation is triggered under the Remediate vulnerabilities security control on the Defender for Cloud Recommendations page. 

### Security recommendations

The following cloud deployment secrets security recommendations are available:

- Azure resources: Azure Resource Manager deployments should have secrets findings resolved.
- AWS resources: AWS CloudFormation Stack should have secrets findings resolved.


### Attack path scenarios

The table summarizes supported attack paths.

**VM** | **Attack paths**
--- | ---
Azure | Exposed Vulnerable VM has an insecure SSH private key that is used to authenticate to a VM.<br/>Exposed Vulnerable VM has insecure secrets that are used to authenticate to a storage account.<br/>Vulnerable VM has insecure secrets that are used to authenticate to a storage account.<br/>Exposed Vulnerable VM has insecure secrets that are used to authenticate to an SQL server.
AWS | Exposed Vulnerable EC2 instance has an insecure SSH private key that is used to authenticate to an EC2 instance.<br/>Exposed Vulnerable EC2 instance has an insecure secret that are used to authenticate to a storage account.<br/>Exposed Vulnerable EC2 instance has insecure secrets that are used to authenticate to an AWS RDS server.<br/>Vulnerable EC2 instance has insecure secrets that are used to authenticate to an AWS RDS server.
GCP | Exposed Vulnerable GCP VM instance has an insecure SSH private key that is used to authenticate to a GCP VM instance.

### Predefined cloud security explorer queries

Defender for Cloud provides these predefined queries for investigating secrets security issues:

- VM with plaintext secret that can authenticate to another VM - Returns all Azure VMs, AWS EC2 instances, or GCP VM instances with plaintext secret that can access other VMs or EC2s.
- VM with plaintext secret that can authenticate to a storage account - Returns all Azure VMs, AWS EC2 instances, or GCP VM instances with plaintext secret that can access storage accounts
- VM with plaintext secret that can authenticate to an SQL database - Returns all Azure VMs, AWS EC2 instances, or GCP VM instances with plaintext secret that can access SQL databases.
