---
title: Map Infrastructure as Code templates from code to cloud
description: Learn how to map your Infrastructure as Code (IaC) templates to your cloud resources.
ms.date: 11/03/2023
ms.topic: how-to
ms.custom: ignite-2023
---

# Map Infrastructure as Code templates to cloud resources

Mapping Infrastructure as Code (IaC) templates to cloud resources helps you ensure consistent, secure, and auditable infrastructure provisioning. It supports rapid response to security threats and a security-by-design approach. You can use mapping to discover misconfigurations in runtime resources. Then, remediate at the template level to help ensure no drift and to facilitate deployment via CI/CD methodology.

## Prerequisites

To set Microsoft Defender for Cloud to map IaC templates to cloud resources, you need:

- An Azure account with Defender for Cloud configured. If you don't already have an Azure account, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An [Azure DevOps](quickstart-onboard-devops.md) environment set up in Defender for Cloud.
- [Defender Cloud Security Posture Management (CSPM)](tutorial-enable-cspm-plan.md) enabled.
- Azure Pipelines set up to run the [Microsoft Security DevOps Azure DevOps extension](azure-devops-extension.yml).
- IaC templates and cloud resources set up with tag support. You can use open-source tools like [Yor_trace](https://github.com/bridgecrewio/yor) to automatically tag IaC templates.
  - Supported cloud platforms: Microsoft Azure, Amazon Web Services, Google Cloud Platform
  - Supported source code management systems: Azure DevOps
  - Supported template languages: Azure Resource Manager, Bicep, CloudFormation, Terraform

> [!NOTE]
> Microsoft Defender for Cloud uses only the following tags from IaC templates for mapping:
>
> - `yor_trace`
> - `mapping_tag`

## See the mapping between your IaC template and your cloud resources

To see the mapping between your IaC template and your cloud resources in [Cloud Security Explorer](how-to-manage-cloud-security-explorer.md):

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Go to **Microsoft Defender for Cloud** > **Cloud Security Explorer**.

1. In the dropdown menu, search for and select all your cloud resources.

1. To add more filters to your query, select **+**.

1. In the **Identity & Access** category, add the subfilter **Provisioned by**.

1. In the **DevOps** category, select **Code repositories**.

1. After you build your query, select **Search** to run the query.

Alternatively, select the built-in template **Cloud resources provisioned by IaC templates with high severity misconfigurations**.

:::image type="content" source="media/iac-template-mapping/iac-mapping.png" alt-text="Screenshot that shows the IaC mapping Cloud Security Explorer template.":::

> [!NOTE]
> Mapping between your IaC templates and your cloud resources might take up to 12 hours to appear in Cloud Security Explorer.

## (Optional) Create sample IaC mapping tags

To create sample IaC mapping tags in your code repositories:

1. In your repository, add an IaC template that includes tags.

   You can start with a [sample template](https://github.com/microsoft/security-devops-azdevops/tree/main/samples/IaCMapping).

1. To commit directly to the main branch or create a new branch for this commit, select **Save**.

1. Confirm that you included the **Microsoft Security DevOps** task in your Azure pipeline.

1. Verify that pipeline logs show a finding that says **An IaC tag(s) was found on this resource**. The finding indicates that Defender for Cloud successfully discovered tags.

## Related content

- Learn more about [DevOps security in Defender for Cloud](defender-for-devops-introduction.md).
