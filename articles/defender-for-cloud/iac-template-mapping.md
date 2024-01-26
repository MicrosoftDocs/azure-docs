---
title: Map IaC templates from code to cloud
description: Learn how to map your Infrastructure as Code templates to your cloud resources.
ms.date: 11/03/2023
ms.topic: how-to
ms.custom: ignite-2023
---

# Map Infrastructure as Code templates to cloud resources

Mapping Infrastructure as Code (IaC) templates to cloud resources helps you ensure consistent, secure, and auditable infrastructure provisioning. It supports rapid response to security threats and a security-by-design approach. You can use the mapping to discover misconfigurations in runtime resources. Then, remediate at the template level to help ensure no drift and to facilitate deployment via CI/CD methodology.

## Prerequisites

To allow Microsoft Defender for Cloud to map IaC template to cloud resources, you need:

- An Azure account with Defender for Cloud onboarded. If you don't already have an Azure account, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Azure DevOps](quickstart-onboard-devops.md) environment onboarded into Microsoft Defender for Cloud.
- [Defender Cloud Security Posture Management (CSPM)](tutorial-enable-cspm-plan.md) enabled.
- Configure your Azure Pipelines to run [Microsoft Security DevOps Azure DevOps extension](azure-devops-extension.md).
- Tag your supported IaC templates and your cloud resources. You can use open-source tools like [Yor_trace](https://github.com/bridgecrewio/yor) to automatically tag IaC templates.
  - Supported cloud platforms: AWS, Azure, GCP.
  - Supported source code management systems: Azure DevOps.
  - Supported template languages: Azure Resource Manager, Bicep, CloudFormation, Terraform.
  
> [!NOTE]
> Microsoft Defender for Cloud will only use the following tags from IaC templates for mapping:

> - `yor_trace`
> - `mapping_tag`

## See the mapping between your IaC template and your cloud resources

To see the mapping between your IaC template and your cloud resources in the [Cloud Security Explorer](how-to-manage-cloud-security-explorer.md):

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Go to **Microsoft Defender for Cloud** > **Cloud Security Explorer**.
1. In the dropdown menu, search for and select all your cloud resources.
1. To add more filters to your query, select **+**.
1. In the **Identity & Access** category, add the subfilter **Provisioned by**.
1. In the **DevOps** category, select **Code repositories**.
1. After you build your query, select **Search** to run the query.

Alternatively, you can use the built-in template named “Cloud resources provisioned by IaC templates with high severity misconfigurations”.

![Screenshot that shows the IaC Mapping Cloud Security Explorer template.](media/iac-template-mapping/iac-mapping.png)

> [!NOTE]
> Note that mapping between your IaC templates to your cloud resources might take up to 12 hours to appear in the Cloud Security Explorer.

## (Optional) Create sample IaC mapping tags

To create sample IaC mapping tags within your code repositories:

1. Add an IaC template with tags to your repository. To use an example template, see [this sample](https://github.com/microsoft/security-devops-azdevops/tree/main/samples/IaCMapping).
1. To commit directly to the main branch or create a new branch for this commit, select **Save**.
1. Check that you included the **Microsoft Security DevOps** task in your Azure pipeline.
1. Verify that the **pipeline logs** show a finding saying **“An IaC tag(s) was found on this resource”**. This means that Defender for Cloud successfully discovered tags.

## Related content

- Learn more about [DevOps security in Defender for Cloud](defender-for-devops-introduction.md).
