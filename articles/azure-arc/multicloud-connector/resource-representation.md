---
title: Multicloud connector resource representation in Azure
description: Understand how AWS resources are represented in Azure after they're added through the multicloud connector enabled by Azure Arc.
ms.topic: how-to
ms.date: 06/11/2024
---

# Multicloud connector resource representation in Azure

The multicloud connector enabled by Azure Arc lets you connect non-Azure public cloud resources to Azure, providing a centralized source for management and governance. Currently, AWS public cloud environments are supported.

This article describes how AWS resources from a connected public cloud are represented in your Azure environment.

> [!IMPORTANT]
> Multicloud connector enabled by Azure Arc is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Resource group name

After you [connect your AWS public cloud to Azure](connect-to-aws.md), the multicloud connector creates a new resource group with the following naming convention:

`aws_yourAwsAccountId`

For every AWS resource discovered through the **[Inventory](view-multicloud-inventory.md)** solution, an Azure representation is created in the `aws_yourAwsAccountId` resource group. Each resource has the [`AwsConnector` namespace value associated with its AWS service](view-multicloud-inventory.md#supported-aws-services).

EC2 instances connected to Azure Arc through the **[Arc onboarding](onboard-multicloud-vms-arc.md)** solution are also represented as Arc-enabled server resources under `Microsoft.HybridCompute/machines` in the `aws_yourAwsAccountId` resource group. If you previously onboarded an EC2 machine to Azure Arc, you won't see that machine in this resource group, because it already has a representation in Azure.

## Region mapping

Resources that are discovered in AWS and projected in Azure are placed in Azure regions, using the following mapping scheme:

|AWS region |Mapped Azure region |
|--|--|
|us-east-1 | EastUS |
|us-east-2 | EastUS |
|us-west-1 | EastUS |
|us-west-2 | EastUS |
|ca-central-1 | EastUS |
|ap-southeast-1 | SoutheastAsia |
|ap-northeast-1 | SoutheastAsia |
|ap-northeast-3 | SoutheastAsia |
|ap-southeast-2 | AU East |
|eu-west-1 | West Europe |
|eu-central-1 | West Europe |
|eu-north-1 | West Europe |
|eu-west-2 | UK South |
|sa-east-1 | Brazil South |

## Removing resources

If you remove the connected cloud, or disable a solution, periodic syncs will stop for that solution, and resources will no longer be updated in Azure. However, the resources will remain in your Azure account unless you delete them. To avoid confusion, we recommend removing these AWS resource representations from Azure when you remove an AWS public cloud.

To remove all of the AWS resource representations from Azure, navigate to the `aws_yourAwsAccountId` resource group, then delete it.

If you delete the connector, you should delete the Cloud Formation template on AWS. If you delete a solution, you'll also need to update your Cloud Formation template to remove the required access for the deleted solution. You can find the updated template for the connector in the Azure portal under **Settings > Authentication template**.
