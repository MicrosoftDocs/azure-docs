---
title: Manage secrets with agentless secret scanning
description: Learn how to scan your servers for secrets with Defender for Server's agentless secret scanning.
ms.topic: overview
ms.date: 11/21/2023
---

# Manage secrets with agentless secret scanning

Attackers can move laterally across networks, find sensitive data, and exploit vulnerabilities to damage critical information systems by accessing internet-facing workloads and exploiting exposed credentials and secrets.

Defender for Cloud's agentless secret scanning for Virtual Machines (VM) locates plaintext secrets that exist in your environment. If secrets are detected, Defender for Cloud can assist your security team to prioritize and take actionable remediation steps to minimize the risk of lateral movement, all without affecting your machine's performance.

By using agentless secret scanning, you can proactively discover the following types of secrets across your environments (in Azure, AWS and GCP cloud providers): 

- Insecure SSH private keys:
    - Supports RSA algorithm for PuTTy files.
    - PKCS#8 and PKCS#1 standards.
    - OpenSSH standard.
- Plaintext Azure SQL connection strings, supports SQL PAAS.
- Plaintext Azure database for PostgreSQL.
- Plaintext Azure database for MySQL.
- Plaintext Azure database for MariaDB.
- Plaintext Azure Cosmos DB, including PostgreSQL, MySQL and MariaDB.
- Plaintext AWS RDS connection string, supports SQL PAAS:
    - Plaintext Amazon Aurora with Postgres and MySQL flavors.
    - Plaintext Amazon custom RDS with Oracle and SQL Server flavors.
- Plaintext Azure storage account connection strings.
- Plaintext Azure storage account SAS tokens.
- Plaintext AWS access keys.
- Plaintext AWS S3 pre-signed URL.
- Plaintext Google storage signed URL.
- Plaintext Azure AD Client Secret.
- Plaintext Azure DevOps Personal Access Token.
- Plaintext GitHub Personal Access Token.
- Plaintext Azure App Configuration Access Key.
- Plaintext Azure Cognitive Service Key.
- Plaintext Azure AD User Credentials.
- Plaintext Azure Container Registry Access Key.
- Plaintext Azure App Service Deployment Password.
- Plaintext Azure Databricks Personal Access Token.
- Plaintext Azure SignalR Access Key.
- Plaintext Azure API Management Subscription Key.
- Plaintext Azure Bot Framework Secret Key.
- Plaintext Azure Machine Learning Web Service API Key.
- Plaintext Azure Communication Services Access Key.
- Plaintext Azure EventGrid Access Key.
- Plaintext Amazon Marketplace Web Service (MWS) Access Key.
- Plaintext Azure Maps Subscription Key.
- Plaintext Azure Web PubSub Access Key.
- Plaintext OpenAI API Key.
- Plaintext Azure Batch Shared Access Key.
- Plaintext NPM Author Token.
- Plaintext Azure Subscription Management Certificate. 

Secret findings can be found using the [Cloud Security Explorer](#remediate-secrets-with-cloud-security-explorer) and the [Secrets tab](#remediate-secrets-from-your-asset-inventory) when viewing the resource details, complete with metadata like secret type, file name, file path, last access time, and more. 

The following secrets can also be accessed from the `Security Recommendations` and `Attack Path`, across Azure, AWS and GCP cloud providers: 

- Insecure SSH private keys: 
    - Supporting RSA algorithm for PuTTy files.
    - PKCS#8 and PKCS#1 standards.
    - OpenSSH standard.
- Plaintext Azure database connection string: 
    - Plaintext Azure SQL connection strings, supports SQL PAAS.
    - Plaintext Azure database for PostgreSQL.
    - Plaintext Azure database for MySQL.
    - Plaintext Azure database for MariaDB.
    - Plaintext Azure Cosmos DB, including PostgreSQL, MySQL and MariaDB.
- Plaintext AWS RDS connection string, supports SQL PAAS:
    - Plaintext Amazon Aurora with Postgres and MySQL flavors.
    - Plaintext Amazon custom RDS with Oracle and SQL Server flavors.
- Plaintext Azure storage account connection strings.
- Plaintext Azure storage account SAS tokens.
- Plaintext AWS access keys.
- Plaintext AWS S3 pre-signed URL.
- Plaintext Google storage signed URL. 

The agentless scanner verifies whether SSH private keys can be used to move laterally in your network. Keys that aren't successfully verified are categorized as `unverified` on the Recommendation page. 

## Prerequisites

- An Azure account. If you don't already have an Azure account, you can [create your Azure free account today](https://azure.microsoft.com/free/).

- Access to [Defender for Cloud](get-started.md)

- [Enable](enable-enhanced-security.md#enable-defender-plans-to-get-the-enhanced-security-features) either or both of the following two plans:
  - [Defender for Servers Plan 2](plan-defender-for-servers-select-plan.md)
  - [Defender CSPM](concept-cloud-security-posture-management.md)

- [Enable agentless scanning for machines](enable-vulnerability-assessment-agentless.md#enabling-agentless-scanning-for-machines).

For requirements for agentless scanning, see [Learn about agentless scanning](concept-agentless-data-collection.md#availability).

## Remediate secrets with attack path

Attack path analysis is a graph-based algorithm that scans your [cloud security graph](concept-attack-path.md#what-is-cloud-security-graph). These scans expose exploitable paths that attackers might use to breach your environment to reach your high-impact assets. Attack path analysis exposes attack paths and suggests recommendations as to how best remediate issues that break the attack path and prevent successful breach.

Attack path analysis takes into account the contextual information of your environment to identify issues that might compromise it. This analysis helps prioritize the riskiest issues for faster remediation.

The attack path page shows an overview of your attack paths, affected resources and a list of active attack paths.

### Azure VM supported attack path scenarios

Agentless secret scanning for Azure VMs supports the following attack path scenarios:

- `Exposed Vulnerable VM has an insecure SSH private key that is used to authenticate to a VM`.

- `Exposed Vulnerable VM has insecure secrets that are used to authenticate to a storage account`.

- `Vulnerable VM has insecure secrets that are used to authenticate to a storage account`.

- `Exposed Vulnerable VM has insecure secrets that are used to authenticate to an SQL server`.

### AWS instances supported attack path scenarios

Agentless secret scanning for AWS instances supports the following attack path scenarios:

- `Exposed Vulnerable EC2 instance has an insecure SSH private key that is used to authenticate to a EC2 instance`.

- `Exposed Vulnerable EC2 instance has an insecure secret that are used to authenticate to a storage account`.

- `Exposed Vulnerable EC2 instance has insecure secrets that are used to authenticate to an AWS RDS server`.

- `Vulnerable EC2 instance has insecure secrets that are used to authenticate to an AWS RDS server`.

### GCP instances supported attack path scenarios

Agentless secret scanning for GCP VM instances supports the following attack path scenarios:

- `Exposed Vulnerable GCP VM instance has an insecure SSH private key that is used to authenticate to a GCP VM instance`.

**To investigate secrets with Attack path**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to **Microsoft Defender for Cloud** > **Recommendations** > **Attack path**.

    :::image type="content" source="media/secret-scanning/attack-path.png" alt-text="Screenshot that shows how to navigate to your attack path in Defender for Cloud.":::

1. Select the relevant attack path.

1. Follow the remediation steps to remediate the attack path.

## Remediate secrets with recommendations

If a secret is found on your resource, that resource triggers an affiliated recommendation that is located under the Remediate vulnerabilities security control on the recommendations page. Depending on your resources, either or both of the following recommendations appear:

- **Azure resources**: `Machines should have secrets findings resolved`

- **AWS resources**: `EC2 instances should have secret findings resolved`

- **GCP resources**: `VM instances should have secret findings resolved`

**To remediate secrets from the recommendations page**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to **Microsoft Defender for Cloud** > **Recommendations**.

1. Expand the **Remediate vulnerabilities** security control.

1. Select either:

    - **Azure resources**: `Machines should have secrets findings resolved`

    - **AWS resources**: `EC2 instances should have secret findings resolved`
    - **GCP resources**: `VM instances should have secret findings resolved`

        :::image type="content" source="media/secret-scanning/recommendation-findings.png" alt-text="Screenshot that shows either of the two results under the Remediate vulnerabilities security control." lightbox="media/secret-scanning/recommendation-findings.png":::

1. Expand **Affected resources** to review the list of all resources that contain secrets.

1. In the Findings section, select a secret to view detailed information about the secret.

    :::image type="content" source="media/secret-scanning/select-findings.png" alt-text="Screenshot that shows the detailed information of a secret after you have selected the secret in the findings section." lightbox="media/secret-scanning/select-findings.png":::

1. Expand **Remediation steps** and follow the listed steps.

1. Expand **Affected resources** to review the resources affected by this secret.

1. (Optional) You can select an affected resource to see that resources information.

Secrets that don't have a known attack path, are referred to as `secrets without an identified target resource`.

## Remediate secrets with cloud security explorer

The [cloud security explorer](concept-attack-path.md#what-is-cloud-security-explorer) enables you to proactively identify potential security risks within your cloud environment. It does so by querying the [cloud security graph](concept-attack-path.md#what-is-cloud-security-graph), which is the context engine of Defender for Cloud. The cloud security explorer allows your security team to prioritize any concerns, while also considering the specific context and conventions of your organization.

**To remediate secrets with cloud security explorer**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to **Microsoft Defender for Cloud** > **Cloud Security Explorer**.

1. Select one of the following templates:

    - **VM with plaintext secret that can authenticate to another VM** - Returns all Azure VMs, AWS EC2 instances, or GCP VM instances with plaintext secret that can access other VMs or EC2s.
    - **VM with plaintext secret that can authenticate to a storage account** - Returns all Azure VMs, AWS EC2 instances, or GCP VM instances with plaintext secret that can access storage accounts.
    - **VM with plaintext secret that can authenticate to a SQL database** - Returns all Azure VMs, AWS EC2 instances, or GCP VM instances with plaintext secret that can access SQL databases.

If you don't want to use any of the available templates, you can also [build your own query](how-to-manage-cloud-security-explorer.md) on the cloud security explorer.

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

## Next steps

- [Use asset inventory to manage your resources' security posture](asset-inventory.md)
