---
title: Protecting VM secrets with Microsoft Defender for Cloud
description: Learn how to protect VM secrets with Defender for Server's agentless secrets scanning in Microsoft Defender for Cloud.
ms.topic: overview
ms.date: 04/16/2024
---


# Protecting VM secrets

Defender for Cloud provides [agentless secrets scanning](secrets-scanning.md) for virtual machines. Scanning helps you to quickly detect, prioritizes, and remediate exposed secrets. Secrets detection can identify a wide range of secrets types, such as tokens, passwords, keys, or credentials, stored in different types of file on the OS file system. 

Defender for Cloud's agentless secrets scanning for Virtual Machines (VM) locates plaintext secrets that exist in your environment. If secrets are detected, Defender for Cloud can assist your security team to prioritize and take actionable remediation steps to minimize the risk of lateral movement, all without affecting your machine's performance.

## How does VM secrets scanning work?

Secrets scanning for VMs is agentless and uses cloud APIs.

1. Scanning captures disk snapshots and analyses them, with no impact on VM performance.
1. After the Microsoft secrets scanning engine collects secrets metadata from disk, it sends them to Defender for Cloud. 
1. The secrets scanning engine verifies whether SSH private keys can be used to move laterally in your network.
    - SSH keys that aren’t successfully verified are categorized as unverified on the Defender for Cloud Recommendations page. 
    - Directories recognized as containing test-related content are excluded from scanning.

## What’s supported?

VM secrets scanning is available when you’re using either Defender for Servers Plan 2 or Defender Cloud Security Posture Management (CSPM). VM secrets scanning is able to scan Azure VMs, and AWS/GCP instances onboarded to Defender for Cloud. Review the secrets that can be discovered by Defender for Cloud.

## How does VM secrets scanning mitigate risk?

Secrets scanning helps reduce risk with the following mitigations:

- Eliminating secrets that aren’t needed.
- Applying the principle of least privilege.
- Strengthening secrets security by using secrets management systems such as Azure Key Vault.
- Using short-lived secrets such as substituting Azure Storage connection strings with SAS tokens that possess shorter validity periods.

## How do I identity and remediate secrets issues?

There are a number of ways. Not every method is supported for every secret. Review the supported secrets list for more details.

- Review secrets in the asset inventory: The inventory shows the security state of resources connected to Defender for Cloud. From the inventory you can view the secrets discovered on a specific machine.
- Review secrets recommendations: When secrets are found on assets, a recommendation is triggered under the Remediate vulnerabilities security control on the Defender for Cloud Recommendations page. Recommendations are triggered as follows:
- Review secrets with cloud security explorer. Use cloud security explorer to query the cloud security graph. You can build your own queries, or use one of the built-in templates to query for VM secrets across your environment.
- Review attack paths: Attack path analysis scans the cloud security graph to expose exploitable paths that attacks might use to breach your environment and reach high-impact assets. VM secrets scanning supports a number of attack path scenarios.
    
### Security recommendations

The following VM secrets security recommendations are available:

- Azure resources: Machines should have secrets findings resolved
- AWS resources: EC2 instances should have secrets findings resolved
- GCP resources: VM instances should have secrets findings resolved


### Attack path scenarios

The table summarizes supported attack paths.

**VM** | **Attack paths**
--- | ---
Azure | Exposed Vulnerable VM has an insecure SSH private key that is used to authenticate to a VM.<br/>Exposed Vulnerable VM has insecure secrets that are used to authenticate to a storage account.<br/>Vulnerable VM has insecure secrets that are used to authenticate to a storage account.<br/>Exposed Vulnerable VM has insecure secrets that are used to authenticate to an SQL server.
AWS | Exposed Vulnerable EC2 instance has an insecure SSH private key that is used to authenticate to an EC2 instance.<br/>Exposed Vulnerable EC2 instance has an insecure secret that is used to authenticate to a storage account.<br/>Exposed Vulnerable EC2 instance has insecure secrets that are used to authenticate to an AWS RDS server.<br/>Vulnerable EC2 instance has insecure secrets that are used to authenticate to an AWS RDS server.
GCP | Exposed Vulnerable GCP VM instance has an insecure SSH private key that is used to authenticate to a GCP VM instance.

### Predefined cloud security explorer queries

Defender for Cloud provides these predefined queries for investigating secrets security issues:

- VM with plaintext secret that can authenticate to another VM - Returns all Azure VMs, AWS EC2 instances, or GCP VM instances with plaintext secret that can access other VMs or EC2s.
- VM with plaintext secret that can authenticate to a storage account - Returns all Azure VMs, AWS EC2 instances, or GCP VM instances with plaintext secret that can access storage accounts
- VM with plaintext secret that can authenticate to an SQL database - Returns all Azure VMs, AWS EC2 instances, or GCP VM instances with plaintext secret that can access SQL databases.


## How do I mitigate secrets issues effectively?

It’s important to be able to prioritize secrets and identify which ones need immediate attention. To help you do this, Defender for Cloud provides:

- Providing rich metadata for every secret, such as last access time for a file, a token expiration date, an indication whether the target resource that the secrets provide access to exists, and more.
- Combining secrets metadata with cloud assets context. This helps you to start with assets that are exposed to the internet, or contain secrets that might compromise other sensitive assets. Secrets scanning findings are incorporated into risk-based recommendation prioritization.
- Providing multiple views to help you pinpoint the mostly commonly found secrets, or assets containing secrets.

## Related content

[Cloud deployment secrets scanning](secrets-scanning-cloud-deployment.md)
