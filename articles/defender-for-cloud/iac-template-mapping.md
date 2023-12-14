---
title: Map IaC templates from code to cloud
description: Learn how to map your Infrastructure as Code templates to your cloud resources.
ms.date: 11/03/2023
ms.topic: how-to
ms.custom: ignite-2023
---

# Map Infrastructure as Code Templates to Cloud Resources
Mapping Infrastructure as Code (IaC) templates to cloud resources ensures consistent, secure, and auditable infrastructure provisioning. It enables rapid response to security threats and a security-by-design approach. If there are misconfigurations in runtime resources, this mapping allows remediation at the template level, ensuring no drift and facilitating deployment via CI/CD methodology.

## Prerequisites

To allow Microsoft Defender for Cloud to map Infrastructure as Code template to cloud resources, you need:

- An Azure account with Defender for Cloud onboarded. If you don't already have an Azure account, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Azure DevOps](quickstart-onboard-devops.md) environment onboarded into Microsoft Defender for Cloud.
- [Defender Cloud Security Posture Management (CSPM)](tutorial-enable-cspm-plan.md) enabled.
- Tag your Infrastructure as Code templates and your cloud resources. (Open-source tools like [Yor_trace](https://github.com/bridgecrewio/yor) can be used to automatically tag Infrastructure as Code templates)

  > [!NOTE]
  > Microsoft Defender for Cloud will only use the following tags from Infrastructure as Code templates for mapping:
  > - yor_trace
  > - mapping_tag
- Configure your Azure pipelines to run [Microsoft Security DevOps Azure DevOps extension](azure-devops-extension.md).

## See the mapping between your IaC template and your cloud resources 

To see ee the mapping between your IaC template and your cloud resources by using the [Cloud Security Explorer](how-to-manage-cloud-security-explorer.md):

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Go to **Microsoft Defender for Cloud** > **Cloud Security Explorer**.

1. Search for and select all your cloud resources from the drop-down menu

1. Select + to add other filters to your query.

1. Add the subfilter **Provisioned by** from the category **Identity & Access**.

1. Select **Code repositories** from the category **DevOps**.

1. After building your query, select **Search** to run the query.

> [!NOTE]
> Please note that mapping between your Infrastructure as Code templates to your cloud resources can take up to 12 hours to appear in the Cloud Security Explorer.

## Next steps

- Learn more about [DevOps security in Defender for Cloud](defender-for-devops-introduction.md).
