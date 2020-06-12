---
title: Index of blueprint samples
description: Index of compliance and standard samples for deploying environments, policies, and Cloud Adoptions Framework foundations with Azure Blueprints.
ms.date: 06/02/2020
ms.topic: sample
---
# Azure Blueprints samples

The following table includes links to samples for Azure Blueprints. Each sample is production
quality and ready to deploy today to assist you in meeting your various compliance needs.

## Standards-based blueprint samples

|  |  |
|---------|---------|
| [Australian Government ISM PROTECTED](./ism-protected/control-mapping.md) | Provides guardrails for compliance to Australian Government ISM PROTECTED. |
| [Azure Security Benchmark](./azure-security-benchmark.md) | Provides guardrails for compliance to [Azure Security Benchmark](../../../security/benchmarks/overview.md). |
| [Canada Federal PBMM](./canada-federal-pbmm/index.md) | Provides guardrails for compliance to Canada Federal Protected B, Medium Integrity, Medium Availability (PBMM). |
| [CIS Microsoft Azure Foundations Benchmark](./cis-azure-1-1-0.md)| Provides a set of policies to help comply with CIS Microsoft Azure Foundations Benchmark recommendations. |
| [DoD Impact Level 4](./dod-impact-level-4/index.md) | Provides a set of policies to help comply with DoD Impact Level 4. |
| [FedRAMP Moderate](./fedramp-m/index.md) | Provides a set of policies to help comply with FedRAMP Moderate. |
| [FedRAMP High](./fedramp-h/index.md) | Provides a set of policies to help comply with FedRAMP High. |
| [HIPAA HITRUST](./HIPAA-HITRUST/index.md) | Provides a set of policies to help comply with HIPAA HITRUST. |
| [IRS 1075](./irs-1075/index.md) | Provides guardrails for compliance to IRS 1075.|
| [ISO 27001](./iso27001/index.md) | Provides guardrails for compliance with ISO 27001. |
| [ISO 27001 Shared Services](./iso27001-shared/index.md) | Provides a set of compliant infrastructure patterns and policy guard-rails that help towards ISO 27001 attestation. |
| [ISO 27001 App Service Environment/SQL Database workload](./iso27001-ase-sql-workload/index.md) | Provides additional infrastructure to the [ISO 27001 Shared Services](./iso27001-shared/index.md) blueprint sample. |
| [Media](./media/index.md) | Provides a set of policies to help comply with Media MPAA. |
| [NIST SP 800-53 R4](./nist-sp-800-53-r4.md) | Provides guardrails for compliance to NIST SP 800-53 R4. |
| [PCI-DSS v3.2.1](./pci-dss-3.2.1/index.md) | Provides a set of policies to aide in PCI-DSS v3.2.1 compliance. |
| [SWIFT CSP-CSCF v2020](./swift-2020/index.md) | Aides in SWIFT CSP-CSCF v2020 compliance. |
| [UK OFFICIAL and UK NHS Governance](./ukofficial/index.md) | Provides a set of compliant infrastructure patterns and policy guard-rails that help towards UK OFFICIAL and UK NHS attestation. |
| [CAF Foundation](./caf-foundation/index.md) | Provides a set of controls to help you manage your cloud estate in alignment with the [Microsoft Cloud Adoption Framework for Azure (CAF)](/azure/architecture/cloud-adoption/governance/journeys/index). |
| [CAF Migrate landing zone](./caf-migrate-landing-zone/index.md) | Provides a set of controls to help you set up for migrating your first workload and manage your cloud estate in alignment with the [Microsoft Cloud Adoption Framework for Azure (CAF)](/azure/architecture/cloud-adoption/migrate/index). |

## Samples strategy

:::image type="content" source="../media/blueprint-samples-strategy.png" alt-text="Blueprint samples strategy" border="false":::

The CAF foundation and the CAF Migrate landing zone blueprints assume that the customer is preparing
an existing clean single subscription for migrating on-premises assets and workloads in to Azure.
(Region A and B in the figure).  

There's an opportunity to iterate on the sample blueprints and look for patterns of customizations
that a customer is applying. There is also an opportunity to proactively address blueprints that are
industry-specific like financial services and e-commerce (top end of Region B). Similarly, we
envision building blueprints for complex architectural considerations like, multiple subscriptions,
high availability, cross region resources and customers who are implementing controls over existing
subscriptions and resources (Region C and D).

There are sample blueprints that address customer scenario where the compliance requirements are
high and the architectural complexities are high (Region E in the figure). Region F in the figure is
one that will be addressed by customers and partners who are leveraging the sample blueprints and
customizing it for their unique needs.

## Next steps

- Learn about the [blueprint lifecycle](../concepts/lifecycle.md).
- Understand how to use [static and dynamic parameters](../concepts/parameters.md).
- Learn to customize the [blueprint sequencing order](../concepts/sequencing-order.md).
- Find out how to make use of [blueprint resource locking](../concepts/resource-locking.md).
- Learn how to [update existing assignments](../how-to/update-existing-assignments.md).
- Resolve issues during the assignment of a blueprint with [general troubleshooting](../troubleshoot/general.md).
