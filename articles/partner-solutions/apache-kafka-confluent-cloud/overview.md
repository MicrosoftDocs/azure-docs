---
title: Apache Kafka on Confluent Cloud overview - Azure partner solutions
description: Learn about using Apache Kafka on Confluent Cloud in the Azure Marketplace.
author: tfitzmac
ms.topic: conceptual
ms.service: partner-services
ms.date: 01/15/2021
ms.author: tomfitz
---

# What is Apache Kafka for Confluent Cloud?

Apache Kafka for Confluent Cloud is an Azure Marketplace offering that provides Apache Kafka as a service. It's fully managed so you can focus on building your applications rather than managing the clusters.

To reduce the burden of cross-platform management, Microsoft partnered with Confluent Cloud to build an integrated provisioning layer from Azure to Confluent Cloud. It provides a consolidated experience for using Confluent Cloud on Azure. You can easily integrate and manage Confluent Cloud with your Azure applications.

Previously, you had to purchase the Confluent Cloud offering in the Marketplace and separately set up the account in Confluent Cloud. To manage configurations and resources, you had to navigate between the portals for Azure and Confluent Cloud.

Now, you provision the Confluent Cloud resources through a resource provider named **Microsoft.Confluent**. You create and manage Confluent Cloud organization resources through the [Azure portal](https://portal.azure.com/), [Azure CLI](/cli/azure/), or [Azure SDKs](../../index.yml#languages-and-tools). Confluent Cloud owns and runs the software as a service (SaaS) application, including the environments, clusters, topics, API keys, and managed connectors.

## Capabilities

The deep integration between Confluent Cloud and Azure enables the following capabilities:

- Provision a new Confluent Cloud organization resource from the Azure portal with fully managed infrastructure.
- Streamline single sign-on (SSO) from Azure to Confluent Cloud with Azure Active Directory (Azure AD). No separate authentication is needed from the Confluent Cloud portal.
- Get unified billing of Confluent Cloud consumption through Azure subscription invoicing.
- Manage Confluent Cloud resources from the Azure portal, and track them in the **All resources** page with your other Azure resources.

## Confluent organization

A Confluent organization is a resource that provides the mapping between the Azure and Confluent Cloud resources. It's the parent resource for other Confluent Cloud resources.

Each Azure subscription can contain multiple Confluent plans. Each Confluent plan is mapped to a user account and organization in the Confluent portal. Within each Confluent organization, you can create multiple environments, clusters, topics, and connectors.

When you provision a Confluent Cloud resource in Azure, you get a Confluent organization ID, default environment, and user account. For more information, see [QuickStart: Get started with Confluent Cloud on Azure](create.md).

For billing, each Confluent Cloud offer purchased in the Marketplace maps to a unique Confluent organization.

## Single sign-on

When you sign in to the Azure portal, your credentials are also used to sign in to the Confluent Cloud SaaS portal. The experience uses [Azure AD](../../active-directory/fundamentals/active-directory-whatis.md) and [Azure AD SSO](../../active-directory/manage-apps/what-is-single-sign-on.md) to provide a secure and convenient way for you to sign in.

For more information, see [Single sign-on](manage.md#single-sign-on).

## Billing

There are two billing options available: pay-as-you-go monthly plan and commitment plan.

- With the **pay-as-you-go monthly plan**, you receive the Confluent Cloud consumption charges on your Azure monthly bill.
- With a **commitment plan**, you sign up for a minimum spend amount and get a discount on your committed usage of Confluent Cloud.

You decide which billing option to use when you create the service.

## Confluent links

For additional help with using Apache Kafka for Confluent Cloud, see the following links to the [Confluent site](https://docs.confluent.io/home/overview.html).

To learn about billing options, see:

* [Azure Marketplace with Pay As You Go](https://docs.confluent.io/cloud/current/billing/ccloud-azure-payg.html)
* [Azure Marketplace with Commitments](https://docs.confluent.io/cloud/current/billing/ccloud-azure-ubb.html)

To learn about managing the solutions, see:

* [Create a Cluster in Confluent Cloud](https://docs.confluent.io/cloud/current/clusters/create-cluster.html)
* [Confluent Cloud Environments](https://docs.confluent.io/current/cloud/using/environments.html)
* [Confluent Cloud Basics](https://docs.confluent.io/current/cloud/using/cloud-basics.html)

For support and terms, see:

* [Confluent support](https://support.confluent.io)
* [Terms of Service](https://www.confluent.io/confluent-cloud-tos).

## Next steps

To create an instance of Apache Kafka for Confluent Cloud, see [QuickStart: Get started with Confluent Cloud on Azure](create.md).