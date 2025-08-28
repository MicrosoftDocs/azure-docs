---
title: Manage a Confluent Cloud
description: Learn how to manage your Confluent Cloud settings.
ms.topic: how-to
ms.date: 02/27/2025

---

# Manage a Confluent Cloud resource

This article describes how to manage the settings for Apache Kafka® & Apache Flink® on Confluent Cloud™.

## Resource overview 

[!INCLUDE [manage](../includes/manage.md)]


:::image type="content" source="media/manage/resource-overview.png" alt-text="A screenshot of a Confluent resource in the Azure portal with the overview displayed in the working pane.":::

The *Essentials* details include:

- Resource group
- Location
- Subscription
- Subscription ID
- Tags
- Confluent SSO URL
- Status
- Plan
- Billing term

To manage your resource, select the links next to corresponding details.

Below the essentials, you can navigate to other details about your resource by selecting a tab.

- The **Get started** tab provides deep links to *Configure connectors*, *Manage user access*, and *Manage Confluent*. 
    Select the **Launch** button to [create clusters](https://docs.confluent.io/cloud/current/clusters/create-cluster.html), [connect your apps, systems, and entire organizations](https://docs.confluent.io/cloud/current/connectors/index.html#). 
- The **Tutorials** tab provides links to free courses and video tutorials.

## Delete a resource

[!INCLUDE [delete-resource](../includes/delete-resource.md)]

> [!IMPORTANT]
>
> - To delete the resource on Confluent Cloud, see the documentation for [Confluent Cloud Environments](https://docs.confluent.io/current/cloud/using/environments.html) and [Confluent Cloud Basics](https://docs.confluent.io/current/cloud/using/cloud-basics.html).
> - The cluster and all data in the cluster are permanently deleted. If your contract includes a data retention clause, Confluent keeps your data for the time period that is specified in the [Terms of Service](https://www.confluent.io/confluent-cloud-tos).
> - You're billed for prorated usage up to the time of cluster deletion. After your cluster is permanently deleted, Confluent sends you an email confirmation.

## Next steps

[Troubleshoot Confluent Cloud](troubleshoot.md)
