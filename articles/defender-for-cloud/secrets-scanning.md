---
title: Protecting secrets in Microsoft Defender for Cloud
description: Learn how to protect secrets with Microsoft Defender for Server's agentless secrets scanning.
ms.topic: overview
ms.date: 04/16/2024
---


# Protecting secrets in Defender for Cloud

Microsoft Defender for Cloud helps security team to minimize the risk of attackers exploiting security secrets.

After gaining initial access, attackers can move laterally across networks, find sensitive data, and exploit vulnerabilities to damage critical information systems by accessing cloud deployments, resources, and internet facing workloads. Lateral movement often involves credentials threats that typically exploit sensitive data such as exposed credentials and secrets such as passwords, keys, tokens and connection strings to gain access to additional assets. Secrets are often found in files, stored on VM disks, or on containers, across multi-cloud deployments. Exposed secrets happen for a number of reasons:

- Lack of awareness: Organizations might not be aware of the risks and consequences of secrets exposure in their cloud environment. There might not be a clear policy on handling and protecting secrets in code and configuration files.
- Lack of discovery tools: Tools might not be in place to detect and remediate secrets leaks.
- Complexity and speed: Modern software development is complex and fast-paced, relying on multiple cloud platforms, open-source software, and third-party code. Developers might use secrets to access and integrate resources and services in cloud environments They might store secrets in source code repositories for convenience and reuse. This can lead to accidental exposure of secrets in public or private repositories, or during data transfer or processing.
- Trade-off between security and usability: Organizations might keep secrets exposed in cloud environments for ease-of-use, to avoid the complexity and latency of encrypting and decrypting data at rest and in transit. This can compromise the security and privacy of data and credentials.

Defender for Cloud provides secrets scanning for virtual machines, and for cloud deployments, to reduce lateral movement risk.

- **Virtual machines (VMs)**: Agentless secrets scanning on multicloud VMs.
- **Cloud deployments**: Agentless secrets scanning across multicloud infrastructure-as-code deployment resources.

## Deploying secrets scanning

Secrets scanning is provided as a feature in Defender for Cloud plans:
- VM scanning: Provided with Defender for Cloud Security Posture Management (CSPM) plan, or with Defender for Servers Plan 2.
- Cloud deployment resource scanning: Provided with Defender CSPM

## Reviewing secrets findings

You can review and investigate the security findings for secrets in a couple of ways:

- Review the asset inventory. In the Inventory page you can get an all-up view of your secrets.
- Review secrets recommendations: In the Defender for Cloud Recommendations page, you can review and remediate secrets recommendations. Learn more about Investigate recommendations and alerts.
- Investigate security insights: You can use cloud security explorer to query the cloud security graph. You can build your own queries, or use predefined query templates.
- Use attack paths: You can use attack paths to investigate and remediate critical secrets risk. Learn more.

## Discovery support

Defender for Cloud supports discovery of the types of secrets summarized in the table.


**Secrets type** |	**VM secrets discovery** |	**Cloud deployment secrets discovery** |	**Review location**
--- | --- | --- | ---
Insecure SSH private keys<br/>Supports RSA algorithm for PuTTy files.<br/>PKCS#8 and PKCS#1 standards<br/>OpenSSH standard |Yes	|Yes | Inventory, cloud security explorer, recommendations, attack paths
Plaintext Azure SQL connection strings, supports SQL PAAS|Yes	|Yes | Inventory, cloud security explorer, recommendations, attack paths
Plaintext Azure database for PostgreSQL.|Yes	|Yes | Inventory, cloud security explorer, recommendations, attack paths
Plaintext Azure database for MySQL.|Yes	|Yes | Inventory, cloud security explorer, recommendations, attack paths
Plaintext Azure database for MariaDB.|Yes	|Yes | Inventory, cloud security explorer, recommendations, attack paths
Plaintext Azure Cosmos DB, including PostgreSQL, MySQL and MariaDB.|Yes	|Yes | Inventory, cloud security explorer, recommendations, attack paths
Plaintext AWS RDS connection string, supports SQL PAAS:<br/>Plaintext Amazon Aurora with Postgres and MySQL flavors.<br/>Plaintext Amazon custom RDS with Oracle and SQL Server flavors.|Yes	|Yes | Inventory, cloud security explorer, recommendations, attack paths
Plaintext Azure storage account connection strings|Yes	|Yes | Inventory, cloud security explorer, recommendations, attack paths
Plaintext Azure storage account connection strings.|Yes	|Yes | Inventory, cloud security explorer, recommendations, attack paths
Plaintext Azure storage account SAS tokens.|Yes	|Yes | Inventory, cloud security explorer, recommendations, attack paths
Plaintext AWS access keys.|Yes	|Yes | Inventory, cloud security explorer, recommendations, attack paths
Plaintext AWS S3 pre-signed URL. |Yes	|Yes | Inventory, cloud security explorer, recommendations, attack paths
Plaintext Google storage signed URL. |Yes	|Yes | Inventory, cloud security explorer.
Plaintext Azure AD Client Secret. |Yes	|Yes | Inventory, cloud security explorer.
Plaintext Azure DevOps Personal Access Token. |Yes	|Yes | Inventory, cloud security explorer.
Plaintext GitHub Personal Access Token.|Yes	|Yes | Inventory, cloud security explorer.
Plaintext Azure App Configuration Access Key. |Yes	|Yes | Inventory, cloud security explorer.
Plaintext Azure Cognitive Service Key.|Yes	|Yes | Inventory, cloud security explorer.
Plaintext Azure AD User Credentials. |Yes	|Yes | Inventory, cloud security explorer.
Plaintext Azure Container Registry Access Key. |Yes	|Yes | Inventory, cloud security explorer.
Plaintext Azure App Service Deployment Password. |Yes	|Yes | Inventory, cloud security explorer.
Plaintext Azure Databricks Personal Access Token. |Yes	|Yes | Inventory, cloud security explorer.
Plaintext Azure SignalR Access Key. |Yes	|Yes | Inventory, cloud security explorer.
Plaintext Azure API Management Subscription Key. |Yes	|Yes | Inventory, cloud security explorer.
Plaintext Azure Bot Framework Secret Key. |Yes	|Yes | Inventory, cloud security explorer.
Plaintext Azure Machine Learning Web Service API Key. |Yes	|Yes | Inventory, cloud security explorer.
Plaintext Azure Communication Services Access Key.|Yes	|Yes | Inventory, cloud security explorer.
Plaintext Azure EventGrid Access Key. |Yes	|Yes | Inventory, cloud security explorer.
Plaintext Amazon Marketplace Web Service (MWS) Access Key. |Yes	|Yes | Inventory, cloud security explorer.
Plaintext Azure Maps Subscription Key. |Yes	|Yes | Inventory, cloud security explorer.
Plaintext Azure Web PubSub Access Key.|Yes	|Yes | Inventory, cloud security explorer.
Plaintext OpenAI API Key. |Yes	|Yes | Inventory, cloud security explorer.
Plaintext Azure Batch Shared Access Key. |Yes	|Yes | Inventory, cloud security explorer.
Plaintext NPM Author Token. |Yes	|Yes | Inventory, cloud security explorer.
Plaintext Azure Subscription Management Certificate. |Yes	|Yes | Inventory, cloud security explorer.
Plaintext GCP API Key. |No	|Yes | Inventory, cloud security explorer.
Plaintext AWS Redshift credentials.|No	|Yes | Inventory, cloud security explorer.
Plaintext Private key.|No	|Yes | Inventory, cloud security explorer.
Plaintext ODBC connection string.|No	|Yes | Inventory, cloud security explorer.
Plaintext General password.|No	|Yes | Inventory, cloud security explorer.
Plaintext User login credentials.|No	|Yes | Inventory, cloud security explorer.
Plaintext Travis personal token.|No	|Yes | Inventory, cloud security explorer.
Plaintext Slack access token. |No	|Yes | Inventory, cloud security explorer.
Plaintext ASP.NET Machine Key.|No	|Yes | Inventory, cloud security explorer.
Plaintext HTTP Authorization Header. |No	|Yes | Inventory, cloud security explorer.
Plaintext Azure Redis Cache password. |No	|Yes | Inventory, cloud security explorer.
Plaintext Azure IoT Shared Access Key. |No	|Yes | Inventory, cloud security explorer.
Plaintext Azure DevOps App Secret.|No	|Yes | Inventory, cloud security explorer.
Plaintext Azure Function API Key. |No	|Yes | Inventory, cloud security explorer.
Plaintext Azure Shared Access Key. |No	|Yes | Inventory, cloud security explorer.
Plaintext Azure Logic App Shared Access Signature. |No	|Yes | Inventory, cloud security explorer.
Plaintext Azure Active Directory Access Token.|No	|Yes | Inventory, cloud security explorer.
Plaintext Azure Service Bus Shared Access Signature.|No	|Yes | Inventory, cloud security explorer.




## Prerequisites

- An Azure account. If you don't already have an Azure account, you can [create your Azure free account today](https://azure.microsoft.com/free/).

- Access to [Defender for Cloud](get-started.md).

- [Enable](enable-enhanced-security.md#enable-defender-plans-to-get-the-enhanced-security-features) either or both of the following two plans:
  - [Defender for Servers Plan 2](plan-defender-for-servers-select-plan.md)
  - [Defender CSPM](concept-cloud-security-posture-management.md)

- [Enable agentless scanning for machines](enable-vulnerability-assessment-agentless.md#enabling-agentless-scanning-for-machines).

For requirements for agentless scanning, see [Learn about agentless scanning](concept-agentless-data-collection.md#availability).

## Remediate secrets with attack path

Attack path analysis is a graph-based algorithm that scans your [cloud security graph](concept-attack-path.md#what-is-cloud-security-graph). These scans expose exploitable paths that attackers might use to breach your environment to reach your high-impact assets. Attack path analysis exposes attack paths and suggests recommendations for how to best remediate issues that break the attack path and prevent successful breach.

Attack path analysis takes into account the contextual information of your environment to identify issues that might compromise it. This analysis helps prioritize the riskiest issues for faster remediation.

The attack path page shows an overview of your attack paths, affected resources, and a list of active attack paths.

### Azure VM supported attack path scenarios

Agentless secrets scanning for Azure VMs supports the following attack path scenarios:

- `Exposed Vulnerable VM has an insecure SSH private key that is used to authenticate to a VM`.

- `Exposed Vulnerable VM has insecure secrets that are used to authenticate to a storage account`.

- `Vulnerable VM has insecure secrets that are used to authenticate to a storage account`.

- `Exposed Vulnerable VM has insecure secrets that are used to authenticate to an SQL server`.

### AWS instances supported attack path scenarios

Agentless secrets scanning for AWS instances supports the following attack path scenarios:

- `Exposed Vulnerable EC2 instance has an insecure SSH private key that is used to authenticate to an EC2 instance`.

- `Exposed Vulnerable EC2 instance has an insecure secret that are used to authenticate to a storage account`.

- `Exposed Vulnerable EC2 instance has insecure secrets that are used to authenticate to an AWS RDS server`.

- `Vulnerable EC2 instance has insecure secrets that are used to authenticate to an AWS RDS server`.

### GCP instances supported attack path scenarios

Agentless secrets scanning for GCP VM instances supports the following attack path scenarios:

- `Exposed Vulnerable GCP VM instance has an insecure SSH private key that is used to authenticate to a GCP VM instance`.

**To investigate secrets with Attack path**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to **Microsoft Defender for Cloud** > **Recommendations** > **Attack path**.

    :::image type="content" source="media/secret-scanning/attack-path.png" alt-text="Screenshot that shows how to navigate to your attack path in Defender for Cloud." lightbox="media/secret-scanning/attack-path.png":::

1. Select the relevant attack path.

1. Follow the remediation steps to remediate the attack path.

## Remediate secrets with recommendations

If a secret is found on your resource, that resource triggers an affiliated recommendation that is located under the Remediate vulnerabilities security control on the Recommendations page. Depending on your resources, one or more of the following recommendations appears:

- **Azure resources**: `Machines should have secrets findings resolved`

- **AWS resources**: `EC2 instances should have secrets findings resolved`

- **GCP resources**: `VM instances should have secrets findings resolved`

**To remediate secrets from the recommendations page**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to **Microsoft Defender for Cloud** > **Recommendations**.

1. Expand the **Remediate vulnerabilities** security control.

1. Select one of the following:

    - **Azure resources**: `Machines should have secrets findings resolved`
    - **AWS resources**: `EC2 instances should have secrets findings resolved`
    - **GCP resources**: `VM instances should have secrets findings resolved`

        :::image type="content" source="media/secret-scanning/recommendation-findings.png" alt-text="Screenshot that shows either of the two results under the Remediate vulnerabilities security control." lightbox="media/secret-scanning/recommendation-findings.png":::

1. Expand **Affected resources** to review the list of all resources that contain secrets.

1. In the Findings section, select a secret to view detailed information about the secret.

    :::image type="content" source="media/secret-scanning/select-findings.png" alt-text="Screenshot that shows the detailed information of a secret after you have selected the secret in the findings section." lightbox="media/secret-scanning/select-findings.png":::

1. Expand **Remediation steps** and follow the listed steps.

1. Expand **Affected resources** to review the resources affected by this secret.

1. (Optional) You can select an affected resource to see that resource's information.

Secrets that don't have a known attack path are referred to as `secrets without an identified target resource`.

## Remediate secrets with cloud security explorer

The [cloud security explorer](concept-attack-path.md#what-is-cloud-security-explorer) enables you to proactively identify potential security risks within your cloud environment. It does so by querying the [cloud security graph](concept-attack-path.md#what-is-cloud-security-graph), which is the context engine of Defender for Cloud. The cloud security explorer allows your security team to prioritize any concerns, while also considering the specific context and conventions of your organization.

**To remediate secrets with cloud security explorer**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to **Microsoft Defender for Cloud** > **Cloud Security Explorer**.

1. Select one of the following templates:

    - **VM with plaintext secret that can authenticate to another VM** - Returns all Azure VMs, AWS EC2 instances, or GCP VM instances with plaintext secret that can access other VMs or EC2s.
    - **VM with plaintext secret that can authenticate to a storage account** - Returns all Azure VMs, AWS EC2 instances, or GCP VM instances with plaintext secret that can access storage accounts.
    - **VM with plaintext secret that can authenticate to an SQL database** - Returns all Azure VMs, AWS EC2 instances, or GCP VM instances with plaintext secret that can access SQL databases.

If you don't want to use any of the available templates, you can also [build your own query](how-to-manage-cloud-security-explorer.md) in the cloud security explorer.

## Remediate secrets from your asset inventory

Your [asset inventory](asset-inventory.md) shows the [security posture](concept-cloud-security-posture-management.md) of the resources you've connected to Defender for Cloud. Defender for Cloud periodically analyzes the security state of resources connected to your subscriptions to identify potential security issues and provides you with active recommendations.

The asset inventory allows you to view the secrets discovered on a specific machine.

**To remediate secrets from your asset inventory**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to **Microsoft Defender for Cloud** > **Inventory**.

1. Select the relevant VM.

1. Go to the **Secrets** tab.

1. Review each plaintext secret that appears with the relevant metadata.

1. Select a secret to view extra details of that secret.

Different types of secrets have different sets of additional information. For example, for plaintext SSH private keys, the information includes related public keys (mapping between the private key to the authorized keys’ file we discovered or mapping to a different virtual machine that contains the same SSH private key identifier).

## Related 


