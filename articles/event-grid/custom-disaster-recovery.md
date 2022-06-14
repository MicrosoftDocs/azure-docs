---
title: Build your own disaster recovery plan for Azure Event Grid topics and domains
description: This tutorial will walk you through how to set up your eventing architecture to recover if the Event Grid service becomes unhealthy in a region.
ms.topic: tutorial
ms.date: 06/14/2022
ms.devlang: csharp
ms.custom: devx-track-csharp
---

# Build your own disaster recovery plan for Azure Event Grid topics and domains

If you have decided to don't replicate any data to a paired region you will need to invest in some practices to build your own disaster recovery scenario and recover from a severe loss of application functionality.

## Build your scripts for automation

Keep your deployment pipelines automated, handcrafted processes can cause delays when a failover occurs. Ensure all your Azure deployments are backed up in scripts or templates so that deployments can be easily replicated in one or multiple regions if needed. Don't try to reinvent the wheel, use what it's already proven and works, there are a many automation tools capable to solve issues around cloud deployment automation like [Azure DevOps](https://docs.microsoft.com/en-us/azure/devops/?view=azure-devops) or [GitHub Actions](https://docs.github.com/en/actions), there are more tools out there that can help you during the deployment phase, use the one you feel more comfortable to work with and use this how-to guide just a checklist reference.

## Define the regions in your plan

To create a recovery plan you will need to choose which regions will be used in your plan. When you choose the regions you also need to consider the possible latency between your users and the cloud resources. Try to get the closest region to your primary region.

## Selecting a cross-region router

Once you already defined the regions, you will need to define the cross-region router that will help you to distribute the traffic across the regions if needed. [Traffic Manager](https://docs.microsoft.com/en-us/azure/traffic-manager/traffic-manager-overview) is a DNS-based traffic load balancer that allows you to distribute traffic to your public facing applications across the global Azure regions. Traffic Manager also provides your public endpoints with high availability and quick responsiveness, in case you need additional features like cross-region redirection and availability, reverse proxy, static content cache, WAF policies you may be interested to see [Front Door](https://docs.microsoft.com/en-us/azure/frontdoor/).
 
## Deploy your Azure Event Grid resources

Now it's time to create your Azure Event Grid topic resources, use the following [Bicep sample](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.eventgrid/event-grid) to create a topic with a webhook event subscription.

Repeat the topic deployment process for the secondary region you have chosen.

Note: Once you have deployed resources in Azure you will need to ensure changes made in the configuration of the topic and event subscriptions are reflected in the template, to continue the practice: create and recreate.

Save in some place the topic endpoints URLs for each resource you have created, you will see something like this: 

Region 1:
https://my-primary-topic.my-region-1.eventgrid.azure.net/api/events 

Region 2:
https://my-secondary-topic.my-secondary-1.eventgrid.azure.net/api/events 

## Create a Traffic Manager for Azure Event Grid endpoints

The previously created Azure Event Grid resources endpoints will be used when we create and configure the Traffic Manager profile in Azure, see the following [Quickstart: Create a Traffic Manager profile using the Azure Portal](https://docs.microsoft.com/en-us/azure/traffic-manager/quickstart-create-traffic-manager-profile) for more information.

Traffic Manager it's a global resource that provides a unique DNS name, like: https://myeventgridtopic.trafficmanager.net. Once you configure both Azure Event Grid topic endpoints in the Traffic Manager it will automatically redirect the traffic to the second region once the primary region becomes unavailable.

At this moment you have your resources deployed and running, and can start sending events to your traffic manager endpoint, in case you don't want to keep active the secondary endpoint in your traffic manager you may be interested to [disable the endpoint](https://docs.microsoft.com/en-us/azure/traffic-manager/traffic-manager-manage-endpoints#to-disable-an-endpoint).

## Integrate deployment scripts in your CI/CD process

Now that you ensure your configuration is working as expected and your events are delivered to the regions you defined, you will need to integrate your template with an automation tool, see [Quickstart: Integrate Bicep with Azure Pipelines](https://docs.microsoft.com/en-us/azure/azure-resource-manager/bicep/add-template-to-azure-pipelines?tabs=CLI) or [Quickstart: Deploy Bicep files by using GitHub Actions](https://docs.microsoft.com/en-us/azure/azure-resource-manager/bicep/deploy-github-actions?tabs=CLI) for more information.

Having a regularly tested automated process will provide confidence your dependencies used in your scripts and tools have not outdated and the recovery process can be triggered in a couple of minutes after any possible failure in the region.

## Next steps

- Learn how to [receive events at an http endpoint](./receive-events.md)
- Discover how to [route events to Hybrid Connections](./custom-event-to-hybrid-connection.md)
- Learn about [disaster recovery using Azure DNS and Traffic Manager](../networking/disaster-recovery-dns-traffic-manager.md)
