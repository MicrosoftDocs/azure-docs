---
title: Apache Kafka & Apache Flink on Confluent Cloud overview
description: Learn about using Apache Kafka & Apache Flink on Confluent Cloud in Azure Marketplace.
ms.topic: overview
ms.date: 01/22/2025
---

# What is Apache Kafka & Apache Flink on Confluent Cloud?

[!INCLUDE [what-is](../includes/what-is.md)]

Microsoft and Confluent Cloud developed this service and manage it together.

You can find Apache Kafka® & Apache Flink® on Confluent Cloud™ in the [Azure portal](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Confluent%2Forganizations) or get it on [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/confluentinc.confluent-cloud-azure-prod?tab=Overview).

Apache Kafka & Apache Flink on Confluent Cloud is an Azure Marketplace offering that provides Apache Kafka and Apache Flink as a fully managed service so you can focus on building your applications rather than managing the clusters.

To reduce the burden of cross-platform management, Microsoft partnered with Confluent Cloud to build an integrated provisioning layer from Azure to Confluent Cloud. It provides a consolidated experience for using Confluent Cloud on Azure. You can easily integrate and manage Confluent Cloud with your Azure applications.

Previously, you had to buy the Confluent Cloud offering in the Marketplace and separately set up the account in Confluent Cloud. To manage configurations and resources, you had to navigate between the portals for Azure and Confluent Cloud.

Now, you provision the Confluent Cloud resources through a resource provider named **Microsoft.Confluent**. You create and manage Confluent Cloud organization resources through the [Azure portal](https://portal.azure.com/), [Azure CLI](/cli/azure/), or [Azure SDKs](/azure#languages-and-tools). Confluent Cloud owns and runs the software as a service (SaaS) application, including the environments, clusters, topics, API keys, and managed connectors.

## Capabilities

The deep integration between Confluent Cloud and Azure enables the following capabilities:

- Provision a new Confluent Cloud organization resource from the Azure portal with fully managed infrastructure or link to an existing Confluent Cloud organization.
- Streamline single sign-on (SSO) from Azure to Confluent Cloud with Microsoft Entra ID. No separate authentication is needed from the Confluent Cloud portal.
- Get unified billing of Confluent Cloud consumption through Azure subscription invoicing.
- Manage Confluent Cloud resources from the Azure portal, and track them in the **All resources** page with your other Azure resources.

## Confluent organization

A Confluent organization is a resource that provides the mapping between the Azure and Confluent Cloud resources. It's the parent resource for other Confluent Cloud resources.

Each Azure subscription can contain multiple Confluent plans. Each Confluent plan is mapped to a user account and organization in the Confluent portal. Within each Confluent organization, you can create multiple environments, clusters, topics, and connectors.

When you provision a Confluent Cloud resource in Azure, you get a Confluent organization ID, default environment, and user account. For more information, see [QuickStart: Get started with Confluent Cloud on Azure](create.md).

Each Confluent Cloud offer you buy in Azure Marketplace maps to a unique Confluent organization for billing.

## Single sign-on

When you sign in to the Azure portal, your credentials are also used to sign in to the Confluent Cloud SaaS portal. The experience uses [Microsoft Entra ID](../../active-directory/fundamentals/active-directory-whatis.md) and [Microsoft Entra SSO](../../active-directory/manage-apps/what-is-single-sign-on.md) to provide a secure and convenient way for you to sign in.

## Billing

There are two billing options available: pay-as-you-go monthly plan and commitment plan.

- With the **pay-as-you-go monthly plan**, you receive the Confluent Cloud consumption charges on your Azure monthly bill.
- With a **commitment plan**, you sign up for a minimum spend amount and get a discount on your committed usage of Confluent Cloud.

You decide which billing option to use when you create the service.

## Subscribe to Confluent Cloud

[!INCLUDE [subscribe](../includes/subscribe.md)] *Apache Kafka and Apache Flink on Confluent Cloud*.

[!INCLUDE [subscribe](../includes/subscribe-from-azure-portal.md)]

## Next steps

- [QuickStart: Get started with Apache Kafka & Apache Flink on Confluent Cloud](create.md)
