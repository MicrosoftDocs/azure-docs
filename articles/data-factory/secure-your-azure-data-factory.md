---
title: Secure your Azure Data Factory
description: Learn how to secure Azure Data Factory, with best practices for network security, identity management, data protection, and recovery.
author: whhender #Required; your GitHub user alias.
ms.author: whhender #Required; Microsoft alias of author; optional team alias.
ms.service: azure-data-factory #Required; service per approved list. service slug assigned to your service by ACOM.
ms.topic: concept-article #Required
ms.custom: horz-security #Required
ms.date: 06/17/2025 #Required; mm/dd/yyyy format.
ai-usage: ai-assisted
---

# Secure your Azure Data Factory deployment

Azure Data Factory is a cloud-based data integration service that allows you to create workflows for orchestrating and automating data movement and data transformation. Securing Azure Data Factory is crucial to protect sensitive data, ensure compliance, and maintain the integrity of your data workflows.

This article provides guidance on how to best secure your Azure Data Factory deployment.

## Network security

Network security is essential for protecting your Azure Data Factory from unauthorized access and potential threats, and protecting your data in movement. Implementing robust network security measures helps to isolate and secure your data integration processes.

* **Isolate and segment workloads using Virtual Networks (VNets)**: Use VNets to create isolated network environments for your data factory and data sources, enabling segmentation of workloads based on risk. VNets help control traffic within the cloud infrastructure. Depending on your source locations, see:
    - [Join Azure-SSIS integration runtime to a virtual network](join-azure-ssis-integration-runtime-virtual-network.md)
    - [Join your Azure integration runtime to a managed virtual network](tutorial-managed-virtual-network-migrate.md)

* **Control traffic flow with Network Security Groups (NSGs)**: Apply NSGs to control inbound and outbound traffic for virtual machines and subnets within VNets. Use a "deny by default, permit by exception" approach to restrict traffic flow and protect sensitive resources. If you've joined Azure Data Factory to a virtual network, on the NSG that is automatically created by Azure Data Factory, Port 3389 is open to all traffic by default. Lock the port down to make sure that only your administrators have access. To manage your NSGs, see [Network security groups](../virtual-network/network-security-groups-overview.md).

* [Secure your self-hosted integration runtime nodes by enabling remote access from intranet with TLS/SSL certificates](https://learn.microsoft.com/en-us/azure/data-factory/tutorial-enable-remote-access-intranet-tls-ssl-certificate.md) - Multiple self-hosted integration runtime nodes can be deployed to balance load and provide high availability, and enabling remote access from intranet with TLS/SSL certificates ensures secure communication between integration runtime nodes.

* **Secure service access using Private Links**: Securely connect to Azure Data Factory from your self-hosted integration runtime and your Azure platform resources, preventing exposure to the public internet. This enhances data privacy and reduces attack vectors. By using Azure Private Link, you can connect to various platforms as a service (PaaS) deployments in Azure via a private endpoint. See [Azure Private Link for Data Factory](data-factory-private-link).

## Identity management

Identity management ensures that only authorized users and services can access your Azure Data Factory. Implementing strong identity management practices helps to prevent unauthorized access and protect sensitive data.

* **Apply least privilege principles**: Use Azure Data Factory's role-based access control (RBAC) to assign the minimum necessary permissions to users and services, ensuring that they only have access to what is needed to perform their duties. Regularly review and adjust roles to align with the principle of least privilege. See [Roles and permissions in Azure Data Factory](concepts-roles-permissions.md).

* **Use managed identities for secure access without credentials**: Use managed identities in Azure to securely authenticate Azure Data Factory with Azure services, without the need to manage credentials. This provides a secure and simplified way to access resources like Azure Key Vault or Azure SQL Database. See [Managed Identities for Azure Data Factory](data-factory-service-identity.md).

## Data protection

Implementing robust data protection measures helps to safeguard sensitive information and comply with regulatory requirements. Azure Data Factory doesn't store data itself, so implementing [network security](#network-security) and [identity management](#identity-management) is essential to protect the data in transit. However, there are some tools and practices you can use to further protect your data in process.

* **Use Microsoft Purview to identify and track sensitive data**: Integrate Azure Data Factory with Microsoft Purview to discover, classify, and manage sensitive data through its lifecycle. This helps to ensure that sensitive information is handled appropriately and complies with data protection regulations. See [Microsoft Purview integration with Data Factory](connect-data-factory-to-azure-purview.md).

* **Encrypt data at rest and in transit**: Azure Data Factory encrypts data at rest, including entity definitions and any data cached while runs are in progress. By default, data is encrypted with a randomly generated Microsoft-managed key that is uniquely assigned to your data factory. For extra security guarantees, you can now enable Bring Your Own Key (BYOK) with customer-managed keys feature in Azure Data Factory. See [Encrypt Azure Data Factory with customer-managed keys](enable-customer-managed-key.md)

* **Restrict the exposure of credentials and secrets**: Use Azure Key Vault to securely store and manage sensitive information such as connection strings, secrets, and certificates. Integrate Azure Data Factory with Azure Key Vault to retrieve secrets at runtime, ensuring that sensitive data isn't hard-coded in pipelines or datasets. See [Azure Key Vault integration with Data Factory](store-credentials-in-key-vault.md).

* **Use Azure Policy to enforce data protection standards**: Apply Azure Policy to enforce data protection standards across your Azure Data Factory deployment. This helps to ensure compliance with organizational and regulatory requirements. See [Azure Policy built-in definitions for Data Factory](policy-reference.md).

## Backup and recovery

Backup and recovery are critical for ensuring that data and configurations in Azure Data Factory are protected and recoverable in case of failures or disasters.

* **Implement source control for Azure Data Factory**: Use Azure Repos or GitHub to manage your Azure Data Factory configurations and pipelines. This allows you to version control your data factory resources, track changes, and collaboration. See [Source control for Azure Data Factory](source-control.md).

* **Implement continuous integration and continuous delivery (CI/CD)**: Azure Data Factory utilizes Azure Resource Manager templates to store the configuration of your various ADF entities (pipelines, datasets, data flows, and so on). This protects your production deployments from accidental changes, and can provide a deployable backup of your environment. See [CI/CD for Azure Data Factory](continuous-integration-delivery.md).

## Related content

* For scenario-based security considerations, see [Security considerations for Azure Data Factory](data-movement-security-considerations.md).