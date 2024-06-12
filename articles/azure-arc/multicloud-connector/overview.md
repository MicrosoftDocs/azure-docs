---
title: "What is Multicloud connector enabled by Azure Arc (preview)?"
description: "The multicloud connector lets you connect non-Azure public cloud resources to Azure, providing a centralized source for management and governance."
ms.topic: overview
ms.date: 06/11/2024
ms.custom: references_regions
---

# What is Multicloud connector enabled by Azure Arc (preview)?

Multicloud connector enabled by Azure Arc lets you connect non-Azure public cloud resources to Azure, providing a centralized source for management and governance. Currently, AWS public cloud environments are supported.

The Multicloud connector supports these solutions:

- **Inventory**: Allows you to see an up-to-date view of your resources from other public clouds in Azure, providing you with a single place to see all of your cloud resources. You can query all your cloud resources through Azure Resource Graph. When assets are represented in Azure, metadata from the source cloud is also included. For instance, if you need to query all of your Azure and AWS resources with a certain tag, you can do so. The **Inventory** solution will scan your source cloud on a periodic basis to ensure a complete, correct view is represented in Azure. You can also apply Azure tags or Azure policies on these resources.
- **Arc onboarding**: Auto-discovers EC2 instances running in your AWS environment and installs the [Azure Connected Machine agent](/azure/azure-arc/servers/agent-overview) on the VMs so that they're onboarded to Azure Arc. This simplified experience lets you use Azure management services such as Azure Monitor on these VMs, providing a centralized way to manage Azure and AWS resources together.

For more information about how the multicloud connector works, including Azure and AWS prerequisites, see [Add a public cloud with the multicloud connector in the Azure portal](connect-to-aws.md).

The multicloud connector can work side-by-side with the [AWS connector in Defender for Cloud](/azure/defender-for-cloud/quickstart-onboard-aws). If you choose, you can use both of these connectors.

> [!IMPORTANT]
> Multicloud connector enabled by Azure Arc is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Supported regions

In Azure, the following regions are supported for the multicloud connector:

- East US, West Central US, Canada Central, West Europe

The multicloud connector isn't available in national clouds (Azure Government, Microsoft Azure operated by 21Vianet).

In AWS, we scan for resources in the following regions:

- us-east-1, us-east-2, us-west-1, us-west-2, ca-central-1, ap-southeast-1, ap-southeast-2, ap-northeast-1, ap-northeast-3, eu-west-1, eu-west-2, eu-central-1, eu-north-1, sa-east-1

Scanned AWS resources are automatically [mapped to corresponding Azure regions](resource-representation.md#region-mapping).

## Pricing

The multicloud connector is free to use, but it integrates with other Azure services that have their own pricing models. Any Azure service that is used with the Multicloud Connector, such as Azure Monitor, will be charged as per the pricing for that service. For more information, see the [Azure pricing page](https://azure.microsoft.com/pricing/).

After you connect your AWS cloud, the multicloud connector queries the AWS resource APIs several times a day. These read-only API calls incur no charges in AWS, but they *are* registered in CloudTrail if you've enabled a trail for read events.


## Next steps

- Learn how to [connect a public cloud in the Azure portal](connect-to-aws.md).
- Learn how to [use the multicloud connector **Inventory** solution](view-multicloud-inventory.md).
- Learn how to [use the multicloud connector **Arc onboarding** solution](onboard-multicloud-vms-arc.md).
