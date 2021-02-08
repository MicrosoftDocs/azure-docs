---
title: How to prevent misconfigurations with Azure Security Center
description: Learn how to use Security Center's 'Enforce' and 'Deny' options on the recommendations details pages
services: security-center
author: memildin
manager: rkarlin
ms.service: security-center
ms.topic: how-to
ms.date: 02/04/2021
ms.author: memildin

---

# Prevent misconfigurations with Enforce/Deny recommendations

Security misconfigurations are a major cause of security incidents. Security Center now has the ability to help *prevent* misconfigurations of new resources with regards to specific recommendations. 

This feature can help keep your workloads secure and stabilize your secure score.

Enforcing a secure configuration, based on a specific recommendation, is offered in two modes:

- Using the **Deny** effect of Azure Policy, you can stop unhealthy resources from being created
- Using the **Enforce** option, you can take advantage of Azure policy's **DeployIfNotExist** effect and automatically remediate non-compliant resources upon creation

This can be found at the top of the resource details page for selected security recommendations (see [Recommendations with deny/enforce options](#recommendations-with-denyenforce-options)).

## Prevent resource creation

1. Open the recommendation that your new resources must satisfy, and select the **Deny** button at the top of the page.

    :::image type="content" source="./media/security-center-remediate-recommendations/recommendation-deny-button.png" alt-text="Recommendation page with Deny button highlighted":::

    The configuration pane opens listing the scope options. 

1. Set the scope by selecting the relevant subscription or management group.

    > [!TIP]
    > You can use the three dots at the end of the row to change a single subscription, or use the checkboxes to select multiple subscriptions or groups then select **Change to Deny**.

    :::image type="content" source="./media/security-center-remediate-recommendations/recommendation-prevent-resource-creation.png" alt-text="Setting the scope for Azure Policy deny":::


## Enforce a secure configuration

1. Open the recommendation that you'll deploy a template deployment for if new resources don't  satisfy it, and select the **Enforce** button at the top of the page.

    :::image type="content" source="./media/security-center-remediate-recommendations/recommendation-enforce-button.png" alt-text="Recommendation page with Enforce button highlighted":::

    The configuration pane opens with all of the policy configuration options. 

    :::image type="content" source="./media/security-center-remediate-recommendations/recommendation-enforce-config.png" alt-text="Enforce configuration options":::

1. Set the scope, assignment name, and other relevant options.

1. Select **Review + create**.

## Recommendations with deny/enforce options

These recommendations can be used with the **deny** option:

- Access to storage accounts with firewall and virtual network configurations should be restricted
- Azure Cache for Redis should reside within a virtual network
- Azure Cosmos DB accounts should use customer-managed keys to encrypt data at rest
- Azure Machine Learning workspaces should be encrypted with a customer-managed key (CMK)
- Azure Spring Cloud should use network injection
- Cognitive Services accounts should enable data encryption with a customer-managed key (CMK)
- Container CPU and memory limits should be enforced
- Container images should be deployed from trusted registries only
- Container registries should be encrypted with a customer-managed key (CMK)
- Container with privilege escalation should be avoided
- Containers sharing sensitive host namespaces should be avoided
- Containers should listen on allowed ports only
- Immutable (read-only) root filesystem should be enforced for containers
- Key Vault keys should have an expiration date
- Key Vault secrets should have an expiration date
- Key vaults should have purge protection enabled
- Key vaults should have soft delete enabled
- Least privileged Linux capabilities should be enforced for containers
- Only secure connections to your Redis Cache should be enabled
- Overriding or disabling of containers AppArmor profile should be restricted
- Privileged containers should be avoided
- Running containers as root user should be avoided
- Secure transfer to storage accounts should be enabled
- Service Fabric clusters should have the ClusterProtectionLevel property set to EncryptAndSign
- Service Fabric clusters should only use Azure Active Directory for client authentication
- Services should listen on allowed ports only
- Storage accounts should be migrated to new Azure Resource Manager resources
- Storage accounts should restrict network access using virtual network rules
- Usage of host networking and ports should be restricted
- Usage of pod HostPath volume mounts should be restricted to a known list to restrict node access from compromised containers
- Validity period of certificates stored in Azure Key Vault should not exceed 12 months
- Virtual machines should be migrated to new Azure Resource Manager resources
- Web Application Firewall (WAF) should be enabled for Application Gateway
- Web Application Firewall (WAF) should be enabled for Azure Front Door Service service

These recommendations can be used with the **enforce** option:

- Auditing on SQL server should be enabled
- Azure Backup should be enabled for virtual machines
- Azure Defender for SQL should be enabled on your SQL servers
- Diagnostic logs in Azure Stream Analytics should be enabled
- Diagnostic logs in Batch accounts should be enabled
- Diagnostic logs in Data Lake Analytics should be enabled
- Diagnostic logs in Event Hub should be enabled
- Diagnostic logs in Key Vault should be enabled
- Diagnostic logs in Logic Apps should be enabled
- Diagnostic logs in Search services should be enabled
- Diagnostic logs in Service Bus should be enabled