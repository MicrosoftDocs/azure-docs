---
title: Protecting cloud deployment secrets with Microsoft Defender for Cloud
description: Learn how to protect cloud deployment secrets with Defender for CSPM's agentless secrets scanning in Microsoft Defender for Cloud.
ms.topic: overview
ms.date: 04/16/2024
---


# Protecting cloud deployment secrets

Microsoft Defender for Cloud provides agentless secrets scanning for cloud deployments. 

## What is cloud deployment?

Cloud deployment refers to the process of deploying and managing resources on cloud providers such as Azure and AWS at scale, using tools such as Azure Resource Manager templates and AWS CloudFormation stack. In other words, a cloud deployment is an instance of an infrastructure-as-code (IaC) template. 

Each cloud provide exposes an API query, and when querying APIs for cloud deployment resources, you typically retrieve deployment metadata such as deployment templates, parameters, output, and tags.


## Security from software development to runtime

Traditional secrets scanning solutions often detect misplaced secrets in code repositories, code pipelines, or files within VMs and containers. Cloud deployment resources tend to be overlooked, and might potentially include plaintext secrets that can lead to critical assets, such as databases, blob storage, GitHub repositories, and Azure OpenAI services. These secrets can allow attackers to exploit otherwise hidden attack surfaces within cloud environments.


Scanning for cloud deployment secrets adds an extra layer of security, addressing scenarios such as: 

- **Increased security coverage**: In Defender for Cloud, DevOps security capabilities in Defender for Cloud [can identify exposed secrets](defender-for-devops-introduction.md) within source control management platforms. However, manually triggered cloud deployments from a developer’s workstation can lead to exposed secrets that might be overlooked. In addition, some secrets might only surface during deployment runtime, like those revealed in deployment outputs, or resolved from Azure Key Vault. Scanning for cloud deployment secrets bridges this gap.
- **Preventing lateral movement**: Discovery of exposed secrets within deployment resources poses a significant risk of unauthorized access.
    - Threat actors can exploit these vulnerabilities to traverse laterally across an environment, ultimately compromising critical services
    -  Using attack path analysis with cloud deployment secrets scanning will automatically discover attack paths involving an Azure deployment that might lead to a sensitive data breach.  
- **Resource discovery**: The impact of misconfigured deployment resources can be extensive, leading to the new resources being created on an expanding attack surface.
    - Detecting and securing secrets within resource control plane data can help prevent potential breaches.
    - Addressing exposed secrets during resource creation can be particularly challenging.
    - Cloud deployment secrets scanning helps to identify and mitigate these vulnerabilities at an early stage. 


Scanning helps you to quickly detect plaintext secrets in cloud deployments. If secrets are detected Defender for Cloud can assist your security team to prioritize action and remediate to minimize the risk of lateral movement.




## How does cloud deployment secrets scanning work?

Scanning helps you to quickly detect plaintext secrets in cloud deployments. Secrets scanning for cloud deployment resources is agentless and uses the cloud control plane API.

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

Attack path analysis is a graph-based algorithm that scans your cloud security graph to expose exploitable paths that attackers might use to reach high-impact assets.

 
### Predefined cloud security explorer queries

The cloud security explorer enables you to proactively identify potential security risks within your cloud environment. It does so by querying the cloud security graph. Create queries by selecting cloud deployment resource types, and the types of secrets you want to find.


## Related content

[VM secrets scanning](secrets-scanning-servers.md).
