---
title: Create Confluent resources in Azure (preview)
description: Learn how to create and manage Confluent environments, clusters and topics in Azure, using the Azure portal UI.
# customerIntent: As a IT professional, I want create Confluent environments, clusters and topics within the Azure portal.
ms.topic: how-to
ms.date: 09/04/2024
---

# Create Confluent resources in Azure (preview)

The next step after creating a Confluent Organization is to create other Confluent constructs such as environments, clusters and topics. This can be done directly in Azure and is a pre-requisite to creating Confluent connectors. The feature presented in this article is in preview.

## Environments

Creating multiple environments within a Confluent organization is a good practice. It allows for clear separation of resources among teams or projects, ensuring there is no interference between them.

> [!TIP]
> In your Confluent organization, open **Confluent entity management** > **Environments (preview)** > **Manage environment in Confluent portal** to access advanced environment configuration in the Confluent UI.

> [NOTE]
> As of the time of writing this document, Azure doesn't support Confluent schema registry configuration. Access this option directly in the Confluent UI by selecting **Manage Schema Registry** on the top ribbon in your environment.

### Create a new environment 

Create a new Confluent environments following the guidelines below:

1. Open your Confluent organization in the Azure portal and open **Confluent entity management** > **Environments (preview)** from the left menu.
1. Select **Create environment** at the top. This action opens a new blade on the right hand side.
1. Enter a name for the new **Environment**. 
1. Select [a basic or advanced stream governance configuration](https://docs.confluent.io/cloud/current/stream-governance/packages.html#governance-package-types):
   - Basic: containing the essentials, supporting up to 100 free schemas
   - Advanced: additional support for enterprise level, supporting up to 20,000 free schemas. This comes at an additional cost during Schema configuration.
1. Select **Create**. Your new environment is up and running. 

### View existing environments 

To view the environments in your Confluent organization:

1. Open your Confluent organization in the Azure portal and open **Confluent entity management** > **Environments (preview)** from the left menu. This blade lists all the environments nested under the Confluent organization.
1. Select **>** to expand an environment, showing the clusters nested within the environment. 
1. Use the search bar or the filter at the top to look for a specific environment. 

### Delete an environment 

If you no longer need to use an environment and the clusters operating within it, you can delete the environment in Azure.

> [!NOTE]
> To delete an environment, ensure that none of the connectors nested within your environment are running. If needed, delete running connectors before you delete the environment.

* From the list of environments, select the ellipsis action (**…**) next to the name of the environment you want to delete and select **Delete Environment**.
* Alternatively, click on the name of the environment you want to delete and then select **Delete Environment** at the top. A right blade opens up, listing the environment's nested clusters and connectors and their status. Confirm deletion by entering the environment name in the text box at the bottom and selecting **Delete**. Confirm again. Your environment is now deleted. 

## Clusters

Similar to environments, you can have multiple clusters within a single environment. These clusters are available in various configurations: basic, standard, enterprise and dedicated. The pricing and feature support for clusters vary depending on the type of cluster. For more information on the cluster types, go to [Confluent Cloud Cluster Types](https://docs.confluent.io/cloud/current/clusters/cluster-types.html). 

### Create a cluster 

Select **Create a cluster** in the top ribbon of your environment page. A new window opens up. 

1. Select or enter the following information in the **Basics** tab:
   - Confluent resource details: Use the pre-populated default values of the organization and environment, or optionally modify the environment name to create the new cluster in another environment.
   - Cluster:
     - Cluster name: Enter a name for the new cluster.
     - Cluster type: Select between **Basic**, **Standard**, **Enterprise** and **Dedicated**. Select the hyperlink to view a detailed comparison of each plan.
     - Region and availability: Keep the default values or select another region and availability option. Review pricing and select **Next**.  
1. In the **Tags** tab, optionally enter tags or select **Review + create** to skip this step.
1. In the **Review + Create** tab, carefully review the new cluster. When ready, select **Create**. Your cluster will take approximately 2-3 minutes to spin up. Once done, a notification is displayed on the top right showing the cluster is up and running.

### View existing clusters

To view the clusters in your Confluent organization:

1. Go to **Environments (preview)** to view a list of all the environments nested under your organization. Select **>** to show the clusters nested within the environment. 
1. Select the cluster name you want to access. If you don't see your cluster, select the **See all Clusters** link in your environment to open up a list of clusters nested within your environment.

   Alternatively, select the environment where your cluster is nested. This opens a list of clusters nested within the environment. You can monitor the type, status and region of these clusters.  

1. Use the search bar and filter on top to quickly look for your cluster name. 

### Manage connectors 

Connectors are nested within the clusters. To manage these connectors and monitor their health and status, click on your cluster name and select **Manage Connectors** in the top ribbon within the cluster. You will get redirected to the **Confluent Connectors** blade that displays all existing connectors. 

To further manage your cluster for advanced configurations, select **Manage cluster in Confluent portal** at the top, which opens the Confluent UI.  

### Delete a cluster 

Follow the instructions below to delete a cluster, once you no longer need it.

> [!NOTE]
> To delete a cluster, ensure that none of the connectors within your cluster are running. If needed, delete running connectors before you delete the cluster.

* From the list of clusters, select the ellipsis action (**…**) next to the name of the cluster you want to delete and select **Delete cluster**.  <!-- is there another step here? -->
* Alternatively, click on the name of the cluster you want to delete and then select **Delete cluster** at the top. A right blade opens up, listing the cluster's connectors and their status. Confirm deletion by entering the cluster name in the text box at the bottom and selecting **Delete**. Confirm again. Your cluster is now deleted. 

## Topics

Topics in Confluent Cloud are fundamental units of organization for your data streams, contained within clusters and serving as channels for data publication and consumption.

### Create a topic

1. Select **Create topic** in the top ribbon on your cluster page. A new window opens up. 
1. Fill in the topic name, number of partitions, and optionally check the box to enable infinite retention.
1. Select **Create**.

### View existing topics

1. Go to **Environments** to view a list of all the environments nested under your organization. Select **>** to show the clusters nested within the environment. 
1. Select the cluster name that holds your topics you want to access. If you don't see your cluster, select the **See all Clusters** link to open up a list of clusters nested within your environment. Topics are nested within the clusters. Click on topic name to view the topic properties.

   Alternatively, select the cluster that contains your topics to see the list of topics along with their properties.

1. Use the search bar and filter on top to quickly look for your topic name. 

### Delete a topic 

Follow the instructions below to delete a topic, once you no longer need it.

* From the list of topics, select the ellipsis action (**…**) next to the name of the topic you want to delete and select **Delete topic**.  <!-- is there another step here? -->
* Alternatively, click on the name of the topic you want to delete and then select **Delete cluster** in the top ribbon. A blade opens up, listing the topic details. Select **Delete topic** at the top and confirm the operation. Your topic is now deleted. 

## Next steps

- For help with troubleshooting, see [Troubleshooting Apache Kafka & Apache Flink on Confluent Cloud solutions](troubleshoot.md).
- Get started with Apache Kafka & Apache Flink on Confluent Cloud - An Azure Native ISV Service on

    > [!div class="nextstepaction"]
    > [Azure portal](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Confluent%2Forganizations)

    > [!div class="nextstepaction"]
    > [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/confluentinc.confluent-cloud-azure-prod?tab=Overview)
