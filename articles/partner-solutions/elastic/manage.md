---
title: Manage settings for your Elastic resource via Azure portal
description: Manage settings, view resources, reconfigure metrics/logs, and more for your Elastic resource via Azure portal.
ms.topic: how-to
ms.date: 07/01/2025


---

# Manage settings for your Elastic resource via Azure portal

This article shows how to manage the settings for Elastic resources.

## Resource overview

[!INCLUDE [manage](../includes/manage.md)]

:::image type="content" source="media/manage/resource-overview.png" alt-text="A screenshot of an Elastic resource in the Azure portal with the overview displayed in the working pane." lightbox="media/manage/resource-overview.png":::

The details include:

- Resource group
- Status
- Region
- Version
- Size
- Tags
- Subscription
- Advanced Settings
- Elasticsearch endpoint
- Deployment URL
- Billing term

To manage your resource, select the links next to corresponding details.

Below the essentials, you can navigate to other details about your resource by selecting the links.

- **Ingest logs and metrics from Azure Services** allows you to send logs and metrics from your Azure services resources.
- **Add more data sources in Elastic** allows you to configure extra data sources in Elastic.
- **View and manage your data in Elastic** allows you to create interactive dashboards to visualize your data in real time. 

## Reconfigure rules for metrics and logs

When you created the Elastic resource, you configured which logs are sent to Elastic. If you need to change those settings, select **Metrics and Logs** in the left pane. 

Make the needed changes to how logs are sent to Elastic.

## View monitored resources

To view the list of resources emitting logs to Elastic, select **Elastic deployment configuration > Monitored resources** in the service menu.

> [!TIP]
> You can filter the list of resources by type, subscription, resource group, region, and whether the resource is sending logs to Elastic. 

## Monitor multiple subscriptions

To monitor multiple subscriptions:

1. Select **Elastic deployment configuration > Monitored Subscriptions**.

1. Select **Add subscriptions** from the Command bar.

    The **Add subscriptions** experience that opens shows subscriptions you have _Owner_ role assigned to and any Elastic resource created in those subscriptions that is already linked to the same Elastic organization as the current resource.

1. Select the subscriptions you want to monitor through the Elastic resource and select **Add**.

    > [!IMPORTANT]
    > Setting separate tag rules for different subscriptions isn't supported.

    Diagnostics settings are automatically added to the subscription's resources that match the defined tag rules.

    Select **Refresh**  to view the subscriptions and their monitoring status. 

Once the subscription is added, the status changes to *Active*.  

### Remove subscriptions

To unlink subscriptions from an Elastic resource:

1. Select **Elastic deployment configuration > Monitored Subscriptions** from the service menu. 

1. Select the subscription you want to remove.

1. Choose **Remove subscriptions**. 

To view the updated list of monitored subscriptions, select **Refresh** from the Command bar.

## Monitor resources with Elastic agents

You can install Elastic agents on virtual machines. 

### Virtual machines

To monitor resources for virtual machines, select **Elastic deployment configuration > Virtual machine agent** in the service menu.

[!INCLUDE [install-elastic-agent](../includes/agent.md)]

## Connect Azure OpenAI service with Elastic

To configure Azure OpenAI, select **Elastic deployment configuration > Azure OpenAI configuration**. 

1. From the working pane's command bar, select **Add**. 

1. In the *Add OpenAI Configuration* panel, select your preferred **Azure OpenAI Resource** and **Azure OpenAI Deployment**.

1. Select the **Create** button.

Once the Connector is created, navigate to Kibana.

> [!NOTE]
> 
> Kibana is a user interface that lets you visualize your Elasticsearch data and navigate the Elastic Stack. Your Connector can be used within Elastic's Observability AI Assistant to help provide contextual responses to your natural language prompts on your observability data by invoking the Azure OpenAI deployment.

## Private link management

You can limit network access to a private link.

To enable private link access:

1. Select **Configuration** in the left navigation.

1. Under **Networking**, select **Private Link** and the name of the private link.

## Traffic filters

To manage how Elastic deployments can be accessed, set Traffic filters for Azure Private Links.

There are two types of filters available:

- IP traffic filter
- Private Link traffic filter

Select **Add** to set up and automatically associate a new traffic filter to an Elastic deployment.

To associate an already existing traffic filter to the current deployment, you select **Link**. 

> [!IMPORTANT]
> The traffic filter must be in the same region as the deployment.

If a traffic filter is no longer needed, unlink it from deployment and then delete it.

## Connected Elastic resources

To access all Elastic resources and deployments you created using the Azure or Elastic portal experience, go to the **Connected Elastic resources** tab in any of your Azure Elastic resources.

You can easily manage the corresponding Elastic deployments or Azure resources using the links, provided you have owner or contributor rights to those deployments and resources.

## Delete Elastic resource

[!INCLUDE [delete-resource](../includes/delete-resource.md)]

> [!IMPORTANT]
> 
> - A single Azure Marketplace SaaS unifies billing for multiple Elastic deployments. 
> - If you wish to completely stop billing for the marketplace SaaS, delete all linked Elastic deployments (created from Azure or Elastic portal). 

## Get support

Contact [Elastic](https://cloud.elastic.co/help) for customer support.

You can also request support in the Azure portal from the [resource overview](#resource-overview).  

Select **Support + Troubleshooting** > **New support request** from the service menu. 

## Related content

- [What is Azure private link?](../../private-link/private-link-overview.md)

