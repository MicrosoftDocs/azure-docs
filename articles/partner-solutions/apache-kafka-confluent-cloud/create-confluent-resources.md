---
title: Create Confluent Resources in Azure (preview)
description: Learn how to create and manage Confluent environments, clusters, and topics in Azure via the Azure portal.
ms.topic: how-to
ms.date: 11/22/2024

#customer intent: As an IT professional, I want to learn how to create Confluent environments, clusters, and topics in the Azure portal so that I can create my own resources.
---

# Create Confluent resources in Azure (preview)

After you create a Confluent organization, your next step is to create other Confluent constructs, like environments, clusters, and topics. You can create these resources directly in Azure. Create the resources before you create a Confluent connector.

> [!NOTE]
> The feature described in this article is in preview.

## Environments

A good practice is to create multiple environments in a Confluent organization. In environments, you can clearly separate resources deployed for different teams or projects.

### Create an environment

To create a new Confluent environment:

1. In the Azure portal, go to your Confluent organization.
1. On the left menu, select **Confluent entity management** > **Environments (preview)**.
1. Select **Create Environment**.
1. On the **Create environment** pane, enter a name for the new environment.
1. Select a Confluent [Essentials or Advanced stream governance configuration](https://docs.confluent.io/cloud/current/stream-governance/packages.html#governance-package-types):

   - **Essentials**: This option contains the essentials and supports up to 100 free schemas.
   - **Advanced**: This option gives you more support at the enterprise level. The option supports up to 20,000 free schemas. Additional cost is incurred during schema configuration.
1. Select **Create** to create the environment.

:::image type="content" source="./media/create-confluent-resources/create-environment.png" alt-text="Screenshot that shows the Create environment pane in the Azure portal.":::

> [!TIP]
> To access advanced environment configuration in the Confluent UI, in your Confluent organization, go to **Confluent entity management** > **Environments (Preview)** > **Manage environment in Confluent portal**.

> [!NOTE]
> Currently, Azure doesn't support configuration for the Confluent schema registry. Access this option directly in Confluent. For more information, see [Manage schemas in Confluent Cloud](https://docs.confluent.io/cloud/current/sr/schemas-manage.html).

### View existing environments

To view the environments in your Confluent organization:

1. In the Azure portal, go to your Confluent organization.
1. On the left menu, select **Confluent entity management** > **Environments (Preview)**.

    A list of all environments in your Confluent organization appears.
1. Select **>** to expand an environment and view the clusters nested within the environment.

Optionally, you can use the search box to find a specific environment.

### Delete an environment

If you no longer need to use an environment or the clusters that operate inside it, you can delete the environment in Azure.

> [!NOTE]
>
> - To delete an environment, ensure that none of the connectors nested in your environment are running. You might need to delete running connectors before you delete the environment.
>
> - Azure supports deleting only environments that you created in Azure. To delete an environment that you created in Confluent, use the Confluent UI.

In the list of environments, select the ellipsis (**…**) next to the name of the environment you want to delete. Then, in the command bar, select **Delete environment**.

Alternatively, select the name of the environment you want to delete, and then select **Delete environment**. Confirm deletion by entering the environment name in the text box. Then, select **Delete** and confirm deletion.

## Clusters

Similar to environments, you can deploy multiple clusters to a single environment. Clusters are available in different configurations: basic, standard, enterprise, and dedicated. Pricing and feature support for clusters vary based on the type of cluster. For more information on cluster types, see [Confluent Cloud cluster types](https://docs.confluent.io/cloud/current/clusters/cluster-types.html).

### Create a cluster

To create a cluster in your Confluent Cloud environment:

1. In the Azure portal, go to your Confluent organization.
1. On the left menu, select **Confluent entity management** > **Environments (Preview)**.
1. On the command bar, select **Create Cluster**.
1. On the **Basics** tab, enter or select values for the following settings:

   1. **Confluent resource details**: Leave the default values for the organization and environment. Optionally, you can change the environment name to create the new cluster in a different environment.
   1. **Cluster name**: Enter a name for the new cluster.
   1. **Cluster type**: Choose **Basic**, **Standard**, or **Enterprise**. Select the link to view a detailed comparison of each plan.
   1. **Region** and **Availability**: Leave the default values, or select another region and availability. Review pricing and select **Next**.  
1. On the **Tags** tab, optionally enter tags. To skip this step, select **Review + create**.
1. On the **Review + create** tab, carefully review your settings for the new cluster.
1. Select **Create**.

The message "Deployment is in progress" appears. Deployment takes 2 to 3 minutes. When the deployment is complete, the message "Your deployment is complete" appears on the upper-right corner of the Azure portal.

### View existing clusters

To view the clusters in your Confluent organization:

1. In the Azure portal, go to your Confluent organization.
1. On the left menu, select **Confluent entity management** > **Environments (Preview)**.
1. For an environment, select **>** to show the clusters nested within the environment. Select a cluster.

Optionally, you can select the environment where your cluster is nested to view all of its clusters. You can monitor a cluster's type, status, and region.

You can also use the search box to find a specific cluster.

### Manage connectors

Connectors are nested within clusters. To manage these connectors and monitor their health and status, select your cluster and select **Manage Connector**. A list of existing connectors appears.

To manage your cluster for advanced configurations, select **Manage cluster in Confluent portal** to open the Confluent UI.  

### Delete a cluster

When you no longer use a cluster, you can delete it.

> [!NOTE]
>
> - To delete a cluster, ensure that none of the connectors within your cluster are running. You might need to delete running connectors before you delete the cluster.
>
> - Azure supports deleting only clusters that you created in Azure. To delete a cluster you created in Confluent, use the Confluent UI.

To delete a cluster:

1. In the Azure portal, go to your Confluent organization.
1. On the left menu, select **Confluent entity management** > **Environments (Preview)**.
1. Select the cluster to delete and select **Delete Cluster**.
1. Enter the cluster name and select **Delete**. Confirm the deletion to delete the cluster.

## Topics

Topics in Confluent Cloud are fundamental units of organization for your data streams. Topics are contained in clusters and serve as channels for data publication and consumption.

### Create a topic

1. In the Azure portal, go to your Confluent organization.
1. On the left menu, select **Confluent entity management** > **Environments (Preview)**.
1. Select **Create Topic**.
1. Enter a topic name and the number of partitions.
1. Optionally, you can select the option to enable infinite retention.
1. Optionally, you can select **Enable advanced settings**. Select a cleanup policy, retention time, retention size, and maximum message size.
1. Select **Create**.

### View existing topics

To view a list of all topics in a cluster:

1. In the Azure portal, go to your Confluent organization.
1. On the left menu, select **Confluent entity management** > **Environments (Preview)**.
1. Select the cluster that contains your topics to view a list of topics and their properties.

Optionally, you can use the search box to find a specific topic.

### Delete a topic

When you no longer need a topic, you can delete it.

To delete a topic:

1. In the Azure portal, go to your Confluent organization.
1. On the left menu, select **Confluent entity management** > **Environments (Preview)**.
1. Select a cluster, and then select the topic you want to delete.
1. Select **Delete Topic**. Enter the topic name to confirm the deletion.

> [!NOTE]
> Azure supports deleting only the topics you create in Azure. To delete a topic you create in Confluent, use the Confluent UI.

## Related content

- [Troubleshoot Apache Kafka & Apache Flink on Confluent Cloud solutions](troubleshoot.md)
- Get started with Apache Kafka & Apache Flink on Confluent Cloud, an Azure Native Integrations service:

    > [!div class="nextstepaction"]
    > [Azure portal](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Confluent%2Forganizations)

    > [!div class="nextstepaction"]
    > [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/confluentinc.confluent-cloud-azure-prod?tab=Overview)
