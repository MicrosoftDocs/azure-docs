---
title: OCI multicloud landing zone for Azure
description: Learn about Oracle Cloud Infrastructure (OCI) multicloud Oracle Autonomous Database landing zones for Azure.
author: jjaygbay1
ms.author: jacobjaygbay
ms.topic: concept-article
ms.service: oracle-on-azure
ms.date: 08/01/2024
---


# OCI multicloud landing zone for Azure

Oracle partnered with Microsoft to develop and distribute HashiCorp Terraform/OpenTofu modules to streamline the process of provisioning Oracle Cloud Infrastructure (OCI) in Azure.

The OCI multicloud landing zone for Azure and Azure Verified Modules for Terraform give you a set of templates that help you provision Oracle Database@Azure. The Terraform/OpenTofu modules use four Terraform providers: AzureRM, AzureAD, AzAPI, and OCI. Together, they cover identity and access management (IAM), networking, and database layer resources. Apply these reference implementations for a quickstart deployment, or customize them for a more complex topology fit to your needs.

The following figure illustrates where Terraform or OpenTofu can be introduced to streamline the processes of identity, access, networking, and provisioning in Oracle Database@Azure.

:::image type="content" source="media/architecture-diagram.png" border="false" alt-text="Diagram of Terraform architectural components.":::

## Prerequisites

- Steps 1 and 2 completed in [Onboard Oracle Database@Azure](https://docs.oracle.com/iaas/Content/multicloud/oaaonboard.htm), minimum
- Terraform/OpenTofu, the OCI CLI, the Azure CLI, and Python (version 3.4 or later) installed in your environment

For more information, see [Oracle multicloud landing zone for Azure](https://github.com/oracle-quickstart/terraform-oci-multicloud-azure?tab=readme-ov-file#prerequisites) on GitHub.

## Dependencies

The [multicloud landing zone for Azure](https://github.com/oracle-quickstart/terraform-oci-multicloud-azure) modules and templates use multiple Terraform providers. The following table lists dependencies:

| Terraform/OpenTofu providers | Terraform/OpenTofu modules |
| ---------------------------- | -------------------------- |
| [AzAPI](/azure/developer/terraform/overview-azapi-provider) | [OCI landing zone modules](https://github.com/oci-landing-zones/) |
| [AzureAD](https://registry.terraform.io/providers/hashicorp/azuread/latest/docs) | [Azure Verified Modules](https://aka.ms/avm) |
| [AzureRM](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs) |   |
| [OCI](https://registry.terraform.io/providers/oracle/oci/latest/docs) |   |

## Templates

The following table describes Oracle multicloud landing zone for Azure templates.

For more information about modules, see [Oracle multicloud landing zone for Azure](https://github.com/oracle-quickstart/terraform-oci-multicloud-azure).

| Template | Use case and configurations | Terraform/OpenTofu providers |
| -------- | --------------------------- | ---------------------------- |
| [az-oci-adbs](https://github.com/oracle-quickstart/terraform-oci-multicloud-azure/tree/main/templates/az-oci-adbs) | **Quickstart Oracle Autonomous Database** | [hashicorp/azurerm](https://registry.terraform.io/providers/hashicorp/azurerm) |
|   | - Configure an Azure virtual network with [delegated subnet limits](https://docs.oracle.com/iaas/Content/database-at-azure/oaa-delegated-subnets-limits.htm) | [azure/api](https://registry.terraform.io/providers/Azure/azapi) |
|   | - [Provision Autonomous Database](oracle-database-provision-autonomous-database.md) |   |
| [az-oci-rbac-n-sso-fed](https://github.com/oracle-quickstart/terraform-oci-multicloud-azure/tree/main/templates/az-oci-rbac-n-sso-fed) | Set up identity federation and role-based access control (RBAC) roles and groups | All the following scenarios: |
| [az-oci-sso-federation](https://github.com/oracle-quickstart/terraform-oci-multicloud-azure/tree/main/templates/az-oci-sso-federation) | Set up [SSO between OCI and Microsoft Entra ID](https://docs.oracle.com/iaas/Content/Identity/tutorials/azure_ad/sso_azure/azure_sso.htm) | [hashicorp/azuread](https://registry.terraform.io/providers/hashicorp/azuread/) |
|   | - Get service provider metadata from OCI IAM | [hashicorp/azurerm](https://registry.terraform.io/providers/hashicorp/azurerm) |
|   | - Create a Microsoft Entra ID application | [hashicorp/oci](https://registry.terraform.io/providers/hashicorp/oci) |
|   | - Set up Security Assertion Markup Language (SAML) single sign-on (SSO) for a Microsoft Entra ID application |  |
|   | - Set up attributes and claims in a Microsoft Entra ID application |  |
|   | - Assign a test user to a Microsoft Entra ID application |  |
|   | - Enable a Microsoft Entra ID application as the identity provider (IdP) for OCI IAM |  |
|   | - Set up [identity lifecycle management between OCI IAM and Microsoft Entra ID](https://docs.oracle.com/iaas/Content/Identity/tutorials/azure_ad/lifecycle_azure/azure_lifecycle.htm#azure-lifecycle) |  |
| [az-odb-rbac](https://github.com/oracle-quickstart/terraform-oci-multicloud-azure/tree/main/templates/az-odb-rbac) | Create [roles and groups in Azure](https://docs.oracle.com/iaas/Content/multicloud/oaagroupsroles.htm) for Oracle Exadata and Oracle Autonomous Database | [hashicorp/azuread](https://registry.terraform.io/providers/hashicorp/azuread/) |
|   | - Create an Azure role definition for the ADBS Administrator role | [hashicorp/azurerm](https://registry.terraform.io/providers/hashicorp/azurerm) |
|   | - Create an Azure resource group |  |
|   | - Create an Azure role assignment |  |

## Related content

- [Quickstart: Oracle Database@Azure with Terraform or OpenTofu modules](https://docs.oracle.com/learn/dbazure-terraform/index.html)
- [Set up OCI Terraform](https://docs.oracle.com/iaas/developer-tutorials/tutorials/tf-provider/01-summary.htm)
- [Import OCI resources into a Terraform state file](https://docs.oracle.com/learn/terraform-statefile-oci-resources/index.html)
- [Azure Verified Modules for a virtual network](https://github.com/Azure/terraform-azurerm-avm-res-network-virtualnetwork)
- [Quickstart: Install and configure Terraform for Azure](/azure/developer/terraform/quickstart-configure)
- [Authenticate Terraform to Azure](/azure/developer/terraform/authenticate-to-azure)
