---
title: Exadata - OCI multicloud landing zone for Azure
description: Learn about Exadata - OCI multicloud landing zone for Azure.
author: jjaygbay1
ms.author: jacobjaygbay
ms.topic: concept-article
ms.service: oracle-on-azure
ms.date: 08/01/2024
---

# Exadata - OCI Multicloud landing zone for Azure

Oracle Cloud Infrastructure (OCI) partnered with Microsoft Azure to develop and distribute HashiCorp Terraform/OpenTofu modules that streamline the provisioning process.

Both OCI Multicloud Landing Zone for Azure (OCI LZ) and Microsoft Verified Modules (MVM) use multiple templates to empower Oracle Database@Azure. These Terraform/OpenTofu modules use four (4) terraform providers, AzureRM, AzureAD, AzAPI, and OCI, covering IAM, networking, and database layer resources. Apply these reference implementations for a quick start deployment, or customize them for a more complex topology fit to your needs.

The following diagram illustrates where Terraform or OpenTofu can be introduced to streamline the identity, access, networking, and provisioning processes within Oracle Database@Azure.

:::image type="content" source="media/architecture-diagram.png" alt-text="Architectural diagram showing the Terraform components.":::


## Prerequisites

- Complete, at a minimum, steps 1-2 of the [Onboarding with Oracle Database@Azure](onboard-oracle-database.md).
- Have a Terraform/OpenTofu, OCI CLI, Azure CLI, and python (minimum 3.4) environment. For more information, see the [Oracle Multicloud Landing Zone for Azure README](https://github.com/oracle-quickstart/terraform-oci-multicloud-azure?tab=readme-ov-file#prerequisites).

## Dependencies

The [Oracle Multicloud Landing Zone for Azure](https://github.com/oracle-quickstart/terraform-oci-multicloud-azure) modules and templates use multiple Terraform providers.

| Terraform/OpenTofu Providers | Terraform/OpenTofu Modules |
| ---------------------------- | -------------------------- |
| [AzAPI](/azure/developer/terraform/overview-azapi-provider) | [OCI Landing Zone modules](https://github.com/oci-landing-zones/) |
| [AzureAD](https://registry.terraform.io/providers/hashicorp/azuread/latest/docs) | [Azure Verified Modules](https://aka.ms/avm) |
| [AzureRM](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs) |   |
| [OCI](https://registry.terraform.io/providers/oracle/oci/latest/docs) |   |

## Templates

For module details, see [Oracle Multicloud Landing Zone for Azure](https://github.com/oracle-quickstart/terraform-oci-multicloud-azure).


| Template | Use Case and Configurations | Terraform/OpenTofu Providers |
| -------- | --------------------------- | ---------------------------- |
| [az-oci-exa-pdb](https://github.com/oracle-quickstart/terraform-oci-multicloud-azure/tree/main/templates/az-oci-exa-pdb) | Quick start Exadata Database Service | [hashicorp/azurerm](https://registry.terraform.io/providers/hashicorp/azurerm) |
|   | 1. Configuring Azure virtual network with [delegated subnet limits](oracle-database-delegated-subnet-limits.md) | [azure/azapi](https://registry.terraform.io/providers/Azure/azapi) |
|   | 2. [Provision Exadata infrastructure](exadata-provision-infrastructure.md) | [hashicorp/oci](https://registry.terraform.io/providers/hashicorp/oci) |
|   | 3. [Provision an Exadata VM Cluster](exadata-provision-vm-cluster.md) |  |
|   | 4. [Creating Database Home](https://docs.oracle.com/iaas/exadata/doc/ecc-creating-first-db-home-on-exacc.html) |  |
|   | 5. [Creating Container Database (CDB)](https://docs.oracle.com/iaas/exadata/doc/ecc-create-first-db.html) |  |
|   | 6. [Creating Pluggable Database (PDB)](https://docs.oracle.com/iaas/exadata/doc/ecc-create-first-db.html) |  |
| [az-oci-rbac-n-sso-fed](https://github.com/oracle-quickstart/terraform-oci-multicloud-azure/tree/main/templates/az-oci-rbac-n-sso-fed) | Set up both identity federation and RBAC roles/groups | All the following |
| [az-oci-sso-federation](https://github.com/oracle-quickstart/terraform-oci-multicloud-azure/tree/main/templates/az-oci-sso-federation) | Set up [SSO Between OCI and Microsoft Entra ID](https://docs.oracle.com/iaas/Content/Identity/tutorials/azure_ad/sso_azure/azure_sso.htm) | [hashicorp/azuread](https://registry.terraform.io/providers/hashicorp/azuread/) |
|   | 1. Get service provider metadata from OCI IAM. | [hashicorp/azurerm](https://registry.terraform.io/providers/hashicorp/azurerm) |
|   | 2. Create an Microsoft Entra ID application. | [hashicorp/oci](https://registry.terraform.io/providers/hashicorp/oci) |
|   | 3. Set up SAML SSO for the Microsoft Entra ID application. |  |
|   | 4. Set up attributes and claims in the Microsoft Entra ID application. |  |
|   | 5. Assign a test user to the Microsoft Entra ID application. |  |
|   | 6. Enable the Microsoft Entra ID application as the Identity Provider (IdP) for OCI IAM. |  |
|   | 7. Set up [Identity Lifecycle Management Between OCI IAM and Microsoft Entra ID](https://docs.oracle.com/iaas/Content/Identity/tutorials/azure_ad/lifecycle_azure/azure_lifecycle.htm#azure-lifecycle). |  |
| [az-odb-rbac](https://github.com/oracle-quickstart/terraform-oci-multicloud-azure/tree/main/templates/az-odb-rbac) | Create [roles and groups in Azure](https://docs.oracle.com/iaas/Content/multicloud/oaagroupsroles.htm) for Exadata and Autonomous Database services. | [hashicorp/azuread](https://registry.terraform.io/providers/hashicorp/azuread/) |
|   | 1. Create Azure role definition for ADBS Administrator role.| [hashicorp/azurerm](https://registry.terraform.io/providers/hashicorp/azurerm) |
|  | 2. Create Azure group. |  |
|   | 3. Create Azure role assignment. |  |

## More Terraform/OpenTofu resources

* [QuickStart Oracle Database@Azure with Terraform or OpenTofu Modules](https://docs.oracle.com/en/learn/dbazure-terraform/index.html) [Terraform: Set Up OCI Terraform](https://docs.oracle.com/iaas/developer-tutorials/tutorials/tf-provider/01-summary.htm)
* [Import OCI Resources into a Terraform State File](https://docs.oracle.com/en/learn/terraform-statefile-oci-resources/index.html)
* [Azure Verified Module for Virtual Network](https://github.com/Azure/terraform-azurerm-avm-res-network-virtualnetwork)
* [Quickstart: Install and Configure Terraform For Azure](/azure/developer/terraform/quickstart-configure)
* [Authenticate Terraform to Azure](/azure/developer/terraform/authenticate-to-azure)