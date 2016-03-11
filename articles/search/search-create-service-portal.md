<properties
	pageTitle="Create an Azure Search service in the portal | Microsoft Azure | Cloud search service"
	description="Add free or standard Azure Search to an existing subscription using the Azure Portal. Azure Search is a cloud hosted search service for custom apps."
	services="search"
	documentationCenter=""
	authors="HeidiSteen"
	manager="mblythe"
	editor=""
    tags="azure-portal"/>

<tags
	ms.service="search"
	ms.devlang="na"
	ms.workload="search"
	ms.topic="hero-article"
	ms.tgt_pltfrm="na"
	ms.date="03/09/2016"
	ms.author="heidist"/>

# Create an Azure Search service in the Azure Portal

Microsoft Azure Search is a hosted cloud search service that allows you to embed search functionality into custom applications. It provides a search engine and storage of your search data, which you can access and manage through the Azure Portal, a .NET SDK, or a REST API. Key features include auto-complete queries, fuzzy matching, hit-highlighting, faceted navigation, scoring profiles, and multi-language support. To learn more about what Azure Search does, see [What is Azure Search](search-what-is-azure-search.md).

Azure Search is available at pricing levels ranging from free (shared) to Basic to Standard, where costs are prorated based on how much capacity you sign up for. 

## Add Azure Search to your subscription for free

As an administrator, you can add Azure Search to an existing Azure subscription at no cost when choosing the shared service. You can sign up for a [free Azure trial subscription](../../includes/free-trial-note.md) to begin your evaluation.

1. Sign in to the [Azure Portal](https://portal.azure.com).

2. In the Jumpbar, click **New** > **Data + storage** > **Search**.

     ![][1]

3. Configure the service name, pricing tier, resource group, subscription, and location. These settings are required and cannot be changed once the service is provisioned.

     ![][2]

	- **Service name** must be unique, lowercase, and under 60 characters, with no spaces. This name becomes part of the endpoint of your Azure Search service (for example, "https://**my-service-name**.search.windows.net"). See [Naming Rules](https://msdn.microsoft.com/library/azure/dn857353.aspx) for more information about naming conventions.

	- **Pricing Tier** determines capacity and billing. Both tiers provide the same features, but at different resource levels.

		- **Free**  runs on clusters that are shared with other subscribers. It offers enough capacity to try out tutorials and write proof-of-concept code, but is not intended for production applications. Deploying a free service typically only takes a few minutes.
		- **Basic (Preview)** runs on dedicated resources but with lower limits and pricing for smaller production workloads. You can scale up to 3 replicas and 1 partition, sufficient for high availability for query execution.
		- **Standard** runs on dedicated resources and is highly scalable. Initially, a standard service is provisioned with one replica and one partition, but you can up capacity to a maximum of 36 search units once the service is created. Deploying a standard service takes longer, usually about 15 minutes.

	- **Resource Groups** are containers for services and resources used for a common purpose. For example, if you're building a custom search application based on Azure Search, the Web Apps feature in Azure App Service, and Azure Blob storage, you could create a resource group that keeps these services together in the portal management pages.

	- **Subscription** allows you to choose among multiple subscriptions, if you have more than one subscription.

	- **Location** is the datacenter region. Currently, all resources must run in the same datacenter. Distributing resources across multiple datacenters is not supported.

4. Click **Create** to provision the service.

Watch for notifications in the Jumpbar. A notice will appear when the service is ready to use.

<a id="sub-3"></a>
## Add a Basic or Standard tier search service to get dedicated resources

Many customers start with the free service, and then switch up to either Basic or Standard tier to accommodate larger workloads. Basic and Standard tiers give you dedicated resources in an Azure data center that can be used only by you. 

Azure Search operations require both storage and service replicas. In contrast with the free service which has no option for adding resources, Standard tier lets you scale up to add more storage or query support by bumping up whichever resource is the more critical to your workloads. Basic also lets you scale up, but only for replicas, with a maximum limit of three.

To use either the Basic or Standard tier, you have to create a new search service at that pricing level. You can repeat the previous steps in this article to create a new Azure Search service. Note that setting up dedicated resources can take a while, up to 15 minutes or longer.

There is no in-place upgrade of the free version. Switching tiers, with the potential for scale, requires a new service. You will need to reload the indexes and documents used by your search application.

An Azure Search service at the Basic or Standard tier is created with one replica and partition each, but can be easily re-scaled at higher resource levels.

1.	Return to the service dashboard after the service is created.

2.	Click the **Scale** tile.

3.	Use the sliders to add replicas, partitions, or both for the Standard tier. For Basic, you can increase replicas to a maximum of three.

Additional replicas and partitions are billed in terms of search units. The total search units required to support any particular resource configuration are shown on the page, as you add resources.

You can check [Pricing Details](http://go.microsoft.com/fwlink/p/?LinkID=509792) to get the per-unit billing information. See [Capacity planning](search-capacity-planning.md) for help in choosing partition and replica combinations.

<a id="sub-2"></a>
## Find the service name and api-keys of your Azure Search service

After the service is created, you can return to the Azure Portal to get the URL or `api-key`. Connections to your Azure Search service requires that you have both the URL and an `api-key` to authenticate the call.

1. In the Jumpbar, click **Home** and then click the Azure Search service to open the service dashboard.

2. On the service dashboard, you'll see tiles for essential information, as well as the key icon for accessing the admin keys.

  	![][3]

3. Copy the service URL and an admin key. You will need them for your next task, [Verify service availability](#sub-4).


<a id="sub-4"></a>
## Verify service availability

Confirming that your service is operational and accessible from a client application is the final step in configuring Azure Search. You can use [Fiddler with Azure Search](search-fiddler.md) to verify service availability.

<!--Next steps and links -->
<a id="next-steps"></a>
## Next steps

Now that your service is created, you can take the next steps: build an [index](search-what-is-an-index.md), [query an index](search-query-overview.md), create and manage search applications that use Azure Search.

- [Create an Azure Search index in the Azure Portal](search-create-index-portal.md)

- [Query an Azure Search index using Search Explorer in the Azure Portal](search-explorer.md)

- [How to use Azure Search in .NET](search-howto-dotnet-sdk.md)

- [Manage your search solution in Microsoft Azure](search-manage.md)


<!--Anchors-->
[Find the service name and api-keys of your Azure Search service]: #sub-2
[Upgrade to the standard tier]: #sub-3
[Test service operations]: #sub-4
[Next steps]: #next-steps

<!--Image references-->
[1]: ./media/search-create-service-portal/create-search-portal-1.PNG
[2]: ./media/search-create-service-portal/create-search-portal-2.PNG
[3]: ./media/search-create-service-portal/create-search-portal-3.PNG
