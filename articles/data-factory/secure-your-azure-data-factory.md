---
title: Secure your Azure Data Factory deployment
description: Learn how to secure Azure Data Factory, with best practices for network security, identity and access management, data protection, logging, governance, and recovery.
author: msmbaldwin
ms.author: mbaldwin
ms.service: azure-data-factory
ms.topic: best-practice
ms.custom: horz-security
ms.date: 08/13/2026
ai-usage: ai-assisted
---

# Secure your Azure Data Factory deployment

Azure Data Factory is a cloud-based data integration service that allows you to create workflows for orchestrating and automating data movement and data transformation. Securing Azure Data Factory is crucial to protect sensitive data, ensure compliance, and maintain the integrity of your data workflows.

This article provides guidance on how to best secure your Azure Data Factory deployment.

[!INCLUDE [Security horizontal Zero Trust statement](~/reusable-content/ce-skilling/azure/includes/security/zero-trust-security-horizontal.md)]

## Network security

Network security is essential for protecting your Azure Data Factory from unauthorized access and potential threats, and for protecting your data in movement. Implementing robust network security measures helps to isolate and secure your data integration processes.

- **Isolate integration runtimes with virtual networks**: Use virtual networks to create isolated network environments for your integration runtimes and data sources, enabling segmentation of workloads based on risk. For more information, see [Join Azure-SSIS integration runtime to a virtual network](join-azure-ssis-integration-runtime-virtual-network.md) and [Join your Azure integration runtime to a managed virtual network](tutorial-managed-virtual-network-migrate.md).
- **Control traffic flow with network security groups (NSGs)**: For SSIS and self-hosted integration runtimes joined to your virtual network, apply NSGs to control inbound and outbound traffic by using a "deny by default, permit by exception" approach. On an Azure-SSIS integration runtime, port 3389 (RDP) is open by default at the NIC-level NSG for optional Microsoft support troubleshooting. Use a subnet-level NSG to restrict or close it. NSGs don't apply to managed virtual networks. For more information, see [Network security groups](../virtual-network/network-security-groups-overview.md).
- **Secure self-hosted integration runtime communication with TLS/SSL**: When you deploy multiple self-hosted integration runtime nodes for load balancing and high availability, enable remote access from intranet with TLS/SSL certificates to secure communication between nodes. For more information, see [Enable remote access from intranet with TLS/SSL certificate](tutorial-enable-remote-access-intranet-tls-ssl-certificate.md).
- **Connect privately with Azure Private Link**: Use a private endpoint to connect to Azure Data Factory from your self-hosted integration runtime and Azure resources, preventing exposure to the public internet and reducing attack vectors. For more information, see [Azure Private Link for Data Factory](data-factory-private-link.md).
- **Restrict outbound access with a managed virtual network**: Provision your Azure integration runtime inside a managed virtual network so that data movement uses managed private endpoints to reach data stores, keeping traffic off the public internet. For more information, see [Managed virtual network and managed private endpoints](managed-virtual-network-private-endpoint.md).

## Identity and access management

Identity and access management ensures that only authorized users and services can access your Azure Data Factory. Implementing strong identity practices helps to prevent unauthorized access and protect sensitive data.

- **Apply least-privilege access with Azure RBAC**: Use built-in roles such as Data Factory Contributor to assign the minimum permissions users and services need, and regularly review role assignments. For more information, see [Roles and permissions for Azure Data Factory](concepts-roles-permissions.md).
- **Use managed identities instead of stored credentials**: Authenticate Data Factory to Azure services such as Azure Key Vault and Azure SQL Database by using the factory's system-assigned or a user-assigned managed identity, eliminating the need to manage credentials. For more information, see [Managed identity for Data Factory](data-factory-service-identity.md).
- **Store secrets in Azure Key Vault**: Reference connection strings, secrets, and certificates from Azure Key Vault in your linked services so that you don't hard-code sensitive values in pipelines or datasets. For more information, see [Store credentials in Azure Key Vault](store-credentials-in-key-vault.md).

## Data protection

Implement robust data protection measures to safeguard sensitive information and comply with regulatory requirements. Azure Data Factory doesn't store the source or sink data it moves—only pipeline definitions, run metadata, and cached data—so you need to implement [network security](#network-security) and [identity and access management](#identity-and-access-management) to protect data in transit. However, you can use the following tools and practices to further protect your data:

- **Encrypt factory metadata with customer-managed keys**: By default, Data Factory encrypts data at rest, including entity definitions and cached data, with a Microsoft-managed key. For more control, enable customer-managed keys (CMK) with a key in Azure Key Vault. Enabling CMK requires a managed identity and a key vault with soft delete and purge protection enabled. For more information, see [Encrypt Azure Data Factory with customer-managed keys](enable-customer-managed-key.md).
- **Discover and classify sensitive data with Microsoft Purview**: Connect Data Factory to Microsoft Purview to discover and classify data your pipelines move, browse the data catalog, and track data lineage across your integration workflows. For more information, see [Connect Data Factory to Microsoft Purview](connect-data-factory-to-azure-purview.md).

## Logging and monitoring

Comprehensive logging and monitoring help you detect anomalous activity, investigate incidents, and demonstrate compliance for your data integration workloads.

- **Send diagnostic logs to a Log Analytics workspace**: Configure diagnostic settings to route pipeline, activity, and trigger run logs to a Log Analytics workspace for retention and analysis. Choose Resource-specific mode so that logs flow into the `ADFPipelineRun`, `ADFActivityRun`, and `ADFTriggerRun` tables rather than the shared `AzureDiagnostics` table. For more information, see [Configure diagnostic settings and a workspace](monitor-configure-diagnostics.md).
- **Capture SSIS integration runtime operational logs**: For Azure-SSIS integration runtimes, enable the `SSISIntegrationRuntimeLogs` and SSIS package execution log categories to record package events and execution statistics for auditing. For more information, see [Monitor SSIS operations with Azure Monitor](monitor-ssis.md).
- **Alert on failures and anomalies**: Create Azure Monitor alerts on Data Factory metrics and log queries—such as failed pipeline or activity runs—so operators are notified of conditions that can indicate misconfiguration or malicious activity. For more information, see [Monitor Azure Data Factory](monitor-data-factory.md).

## Compliance and governance

Governance controls help you enforce organizational standards consistently across your Data Factory deployments and keep your estate auditable.

- **Enforce standards with Azure Policy**: Assign built-in Azure Policy definitions for Data Factory to audit and enforce controls such as requiring customer-managed key encryption, using Key Vault to store linked-service secrets, and disabling public network access in favor of private links, so that noncompliant factories are flagged or blocked. For more information, see [Azure Policy built-in definitions for Data Factory](policy-reference.md).
- **Protect factories from accidental deletion with resource locks**: Apply a CanNotDelete or ReadOnly lock to production data factories and their resource groups so that pipelines, linked services, and integration runtimes can't be removed or altered inadvertently. For more information, see [Lock your resources to protect your infrastructure](../azure-resource-manager/management/lock-resources.md).
- **Organize and track factories with tags**: Apply resource tags to your data factories to support cost management, ownership, and governance reporting across environments. For more information, see [Use tags to organize your Azure resources](../azure-resource-manager/management/tag-resources.md).

## Backup and recovery

Backup and recovery are critical for ensuring that data and configurations in Azure Data Factory are protected and recoverable in case of failures or disasters.

- **Version control your factory with Git integration**: Connect your development data factory to Azure Repos or GitHub to version control pipelines, datasets, and linked services, track changes, and enable collaboration. Configure Git integration on development factories only; promote to test and production with CI/CD rather than Git. For more information, see [Source control in Azure Data Factory](source-control.md).
- **Protect deployments with CI/CD**: Use Azure Resource Manager templates that capture your factory's configuration to promote changes across environments, guard production from accidental changes, and provide a deployable backup. For more information, see [Continuous integration and delivery in Azure Data Factory](continuous-integration-delivery.md).

## Related content

- For scenario-based security considerations, see [Security considerations for data movement in Azure Data Factory](data-movement-security-considerations.md).
