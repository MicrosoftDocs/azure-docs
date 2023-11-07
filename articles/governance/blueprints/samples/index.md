---
title: Index of blueprint samples
description: Index of compliance and standard samples for deploying environments, policies, and Cloud Adoptions Framework foundations with Azure Blueprints.
ms.date: 09/07/2023
ms.topic: sample
---
# Azure Blueprints samples

[!INCLUDE [Blueprints deprecation note](../../../../includes/blueprints-deprecation-note.md)]

The following table includes links to samples for Azure Blueprints. Each sample is production
quality and ready to deploy today to assist you in meeting your various compliance needs.

## Standards-based blueprint samples

| Sample | Description |
|---------|---------|
| [Australian Government ISM PROTECTED](./ism-protected/index.md) | Provides guardrails for compliance to Australian Government ISM PROTECTED. |
| [Azure Security Benchmark Foundation](./azure-security-benchmark-foundation/index.md) | Deploys and configures Azure Security Benchmark Foundation. |
| [Canada Federal PBMM](./canada-federal-pbmm.md) | Provides guardrails for compliance to Canada Federal Protected B, Medium Integrity, Medium Availability (PBMM). |
| [ISO 27001](./iso-27001-2013.md) | Provides guardrails for compliance with ISO 27001. |
| [ISO 27001 Shared Services](./iso27001-shared/index.md) | Provides a set of compliant infrastructure patterns and policy guardrails that help toward ISO 27001 attestation. |
| [ISO 27001 App Service Environment/SQL Database workload](./iso27001-ase-sql-workload/index.md) | Provides more infrastructure to the [ISO 27001 Shared Services](./iso27001-shared/index.md) blueprint sample. |
| [New Zealand ISM Restricted](./new-zealand-ism.md) | Assigns policies to address specific New Zealand Information Security Manual controls. |
| [SWIFT CSP-CSCF v2020](./swift-2020/index.md) | Aides in SWIFT CSP-CSCF v2020 compliance. |
| [UK OFFICIAL and UK NHS Governance](./ukofficial-uknhs.md) | Provides a set of compliant infrastructure patterns and policy guardrails that help toward UK OFFICIAL and UK NHS attestation. |
| [CAF Foundation](./caf-foundation/index.md) | Provides a set of controls to help you manage your cloud estate in alignment with the [Microsoft Cloud Adoption Framework for Azure (CAF)](/azure/architecture/cloud-adoption/governance/journeys/index). |
| [CAF Migrate landing zone](./caf-migrate-landing-zone/index.md) | Provides a set of controls to help you set up for migrating your first workload and manage your cloud estate in alignment with the [Microsoft Cloud Adoption Framework for Azure (CAF)](/azure/architecture/cloud-adoption/migrate/index). |

## Samples strategy

:::image type="complex" source="../media/blueprint-samples-strategy.png" alt-text="Diagram of where the Blueprint samples fit in for architectural complexity vs compliance requirements." border="false":::
   Describes a coordinate system where architectural complexity is on the X axis and compliance requirements are on the Y axis. As architectural complexity and compliance requirements increase, adopt standard Blueprint samples from the portal designated in region E. For customers getting started with Azure use Cloud Adoption Framework (C A F) based Foundation and Landing Zone blueprints designated by region A and B. The remaining space is attributed to custom blueprints created by customers are partners for regions C, D, and F.
:::image-end:::

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
one that is addressed by customers and partners who are applying the sample blueprints and
customizing each for their unique needs.

## Next steps

- Learn about the [blueprint lifecycle](../concepts/lifecycle.md).
- Understand how to use [static and dynamic parameters](../concepts/parameters.md).
- Learn to customize the [blueprint sequencing order](../concepts/sequencing-order.md).
- Find out how to make use of [blueprint resource locking](../concepts/resource-locking.md).
- Learn how to [update existing assignments](../how-to/update-existing-assignments.md).
- Resolve issues during the assignment of a blueprint with
  [general troubleshooting](../troubleshoot/general.md).
