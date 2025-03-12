---
title: Create Confluent resources in Azure (preview)
description: Learn how to create and manage Confluent environments, clusters, and topics in Azure, using the Azure portal UI.
# customerIntent: As an IT professional, I want create Confluent environments, clusters and topics within the Azure portal.
ms.topic: how-to
ms.date: 11/22/2024
---

# Create Confluent resources in Azure (preview)

The next step after creating a Confluent Organization is to create other Confluent constructs such as environments, clusters, and topics. This can be done directly in Azure and is a prerequisite to creating Confluent connectors. The feature presented in this article is in preview.

## Environments

Creating multiple environments within a Confluent organization is a good practice. It allows for clear separation of resources among teams or projects, ensuring there's no interference between them.

### Create an environment 

Create a new Confluent environment following the guidelines below:

1. Open your Confluent organization in the Azure portal and open **Confluent entity management** > **Environments (preview)** from the left menu.
1. Select **Create Environment** at the top. This action opens a new pane on the right hand side.
1. Enter a name for the new **Environment**.

   :::image type="content" source="./media/create-confluent-resources/create-environment.png" alt-text="Screenshot from the Azure portal showing the Create environment pane.":::

1. Select [an essentials or advanced stream governance configuration](https://docs.confluent.io/cloud/current/stream-governance/packages.html#governance-package-types).
   - Essentials: containing the essentials, supporting up to 100 free schemas
   - Advanced: additional support for enterprise level, supporting up to 20,000 free schemas. This comes at an additional cost during Schema configuration.
1. Select **Create**. Your new environment is up and running. 

> [!TIP]
> In your Confluent organization, open **Confluent entity management** > **Environments (Preview)** > **Manage environment in Confluent portal** to access advanced environment configuration in the Confluent UI.

> [!NOTE]
> As of the time of writing this document, Azure doesn't support Confluent schema registry configuration. Access this option directly from Confluent. For more information, go to [Manage Schemas in Confluent Cloud.](https://docs.confluent.io/cloud/current/sr/schemas-manage.html)

### View existing environments 

To view the environments in your Confluent organization:

1. Open your Confluent organization in the Azure portal and open **Confluent entity management** > **Environments (Preview)** from the left menu. This pane lists all the environments nested under the Confluent organization.
1. Select **>** to expand an environment, showing the clusters nested within the environment. Optionally use the search bar at the top to search for a specific environment. 

### Delete an environment 

If you no longer need to use an environment and the clusters operating within it, you can delete the environment in Azure.

> [!NOTE]
> To delete an environment, ensure that none of the connectors nested within your environment are running. If needed, delete running connectors before you delete the environment.

> [!NOTE]
> Azure only supports deleting environments created in Azure. To delete an environment created in Confluent, use the Confluent UI.

From the list of environments, select the ellipsis action (**…**) next to the name of the environment you want to delete and select **Delete Environment**. Alternatively, click on the name of the environment you want to delete and then select **Delete Environment** at the top. A right pane opens up, listing the environment's nested clusters, connectors, and their status. Confirm deletion by entering the environment name in the text box at the bottom and selecting **Delete**. Confirm again. Your environment is now deleted. 


## Clusters

Similar to environments, you can have multiple clusters within a single environment. These clusters are available in various configurations: basic, standard, enterprise, and dedicated. The pricing and feature support for clusters vary depending on the type of cluster. For more information on the cluster types, go to [Confluent Cloud Cluster Types](https://docs.confluent.io/cloud/current/clusters/cluster-types.html). 

### Create a cluster 

Select **Create Cluster** in the top ribbon of your environment page. A new window opens up. 

1. Select or enter the following information in the **Basics** tab:
   - Confluent resource details: Use the pre-populated default values of the organization and environment, or optionally modify the environment name to create the new cluster in another environment.
   - Cluster:
     - Cluster name: Enter a name for the new cluster.
     - Cluster type: Select between **Basic**, **Standard**, and **Enterprise**. Select the hyperlink to view a detailed comparison of each plan.
     - Region and availability: Keep the default values or select another region and availability option. Review pricing and select **Next**.  
1. In the **Tags** tab, optionally enter tags or select **Review + create** to skip this step.
1. In the **Review + Create** tab, carefully review the new cluster. When ready, select **Create**. Your cluster takes approximately 2-3 minutes to spin up. Once done, a notification is displayed on the top right showing the cluster is up and running.

### View existing clusters

To view the clusters in your Confluent organization:

1. Go to **Environments (Preview)** to view a list of all the environments nested under your organization. 
1. Select **>** to show the clusters nested within the environment, and select the cluster you want to access. Alternatively, select the environment where your cluster is nested to view all of its clusters. You can monitor the type, status, and region of these clusters. Optionally use the search bar on top to quickly look for your cluster. 

### Manage connectors 

Connectors are nested within the clusters. To manage these connectors and monitor their health and status, click on your cluster name and select **Manage Connector** in the top ribbon within the cluster. This action opens the **Confluent Connectors** blade that displays all existing connectors. 

Back in the cluster pane, to further manage your cluster for advanced configurations, select **Manage cluster in Confluent portal** at the top, which opens the Confluent UI.  

### Delete a cluster 

Follow the instructions below to delete a cluster, once you no longer need it.

> [!NOTE]
> To delete a cluster, ensure that none of the connectors within your cluster are running. If needed, delete running connectors before you delete the cluster.

> [!NOTE]
> Azure only supports deleting clusters created in Azure. To delete a cluster created in Confluent, use the Confluent UI.

From the **Environments (Preview)** menu, select the name of the cluster you want to delete and then select **Delete Cluster** at the top. A right pane opens up, listing the cluster's connectors and their status. Confirm deletion by entering the cluster name in the text box at the bottom and selecting **Delete**. Confirm again. Your cluster is now deleted. 

## Topics

Topics in Confluent Cloud are fundamental units of organization for your data streams, contained within clusters and serving as channels for data publication and consumption.

### Create a topic

1. Select **Create Topic** in the top ribbon on your cluster page. A new pane opens up. 
1. Fill in the topic name, number of partitions, and optionally select the checkbox to enable infinite retention.
2. Optionally toggle on **Enable advanced settings** and select a cleanup policy, retention time, retention size, and maximum message size.
1. Select **Create**.

### View existing topics

1. Go to **Environments (Preview)** to view a list of all the environments nested under your organization. Select **>** to show the clusters nested within the environment. 
1. Select the cluster that contains your topics to view a list of your topics and their properties. Optionally use the search bar on top to quickly look for your topic name. 

### Delete a topic 

Follow the instructions below to delete a topic, once you no longer need it.

In the **Environments (Preview)** menu, open a cluster, then the topic you want to delete, and select **Delete Topic** in the top ribbon. Enter the topic name to confirm the operation. Your topic is now deleted. 

> [!NOTE]
> Azure only supports deleting topics created in Azure. To delete a topics created in Confluent, use the Confluent UI.

## Next steps

- For help with troubleshooting, see [Troubleshooting Apache Kafka & Apache Flink on Confluent Cloud solutions](troubleshoot.md).
- Get started with Apache Kafka & Apache Flink on Confluent Cloud - An Azure Native ISV Service on

    > [!div class="nextstepaction"]
    > [Azure portal](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Confluent%2Forganizations)

    > [!div class="nextstepaction"]
    > [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/confluentinc.confluent-cloud-azure-prod?tab=Overview)
