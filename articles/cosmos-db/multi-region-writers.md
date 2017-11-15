---
title: Multi-master database architectures with Azure Cosmos DB | Microsoft Docs
description: Learn about how to design application architectures with local reads and writes across multiple geographic regions with Azure Cosmos DB.
services: cosmos-db
documentationcenter: ''
author: arramac
manager: jhubbard
editor: ''

ms.assetid: 706ced74-ea67-45dd-a7de-666c3c893687
ms.service: cosmos-db
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/23/2017
ms.author: arramac
ms.custom: H1Hack27Feb2017

---
# Multi-master globally replicated database architectures with Azure Cosmos DB
Azure Cosmos DB supports turnkey [global replication](distribute-data-globally.md), which allows you to distribute data to multiple regions with low latency access anywhere in the workload. This model is commonly used for publisher/consumer workloads where there is a writer in a single geographic region and globally distributed readers in other (read) regions. 

You can also use Azure Cosmos DB's global replication support to build applications in which writers and readers are globally distributed. This document outlines a pattern that enables achieving local write and local read access for distributed writers using Azure Cosmos DB.

## <a id="ExampleScenario"></a>Content Publishing - an example scenario
Let's look at a real world scenario to describe how you can use globally distributed multi-region/multi-master read write patterns with Azure Cosmos DB. Consider a content publishing platform built on Azure Cosmos DB. Here are some requirements that this platform must meet for a great user experience for both publishers and consumers.

* Both authors and subscribers are spread over the world 
* Authors must publish (write) articles to their local (closest) region
* Authors have readers/subscribers of their articles who are distributed across the globe. 
* Subscribers should get a notification when new articles are published.
* Subscribers must be able to read articles from their local region. They should also be able to add reviews to these articles. 
* Anyone including the author of the articles should be able view all the reviews attached to articles from a local region. 

Assuming millions of consumers and publishers with billions of articles, soon we have to confront the problems of scale along with guaranteeing locality of access. As with most scalability problems, the solution lies in a good partitioning strategy. Next, let's look at how to model articles, review, and notifications as documents, configure Azure Cosmos DB accounts, and implement a data access layer. 

If you would like to learn more about partitioning and partition keys, see [Partitioning and Scaling in Azure Cosmos DB](partition-data.md).

## <a id="ModelingNotifications"></a>Modeling notifications
Notifications are data feeds specific to a user. Therefore, the access patterns for notifications documents are always in the context of single user. For example, you would "post a notification to a user" or "fetch all notifications for a given user". So, the optimal choice of partitioning key for this type would be `UserId`.

	class Notification 
	{ 
		// Unique ID for Notification. 
		public string Id { get; set; }

		// The user Id for which notification is addressed to. 
		public string UserId { get; set; }

		// The partition Key for the resource. 
		public string PartitionKey 
		{ 
			get 
			{ 
				return this.UserId; 
			}
		}

		// Subscription for which this notification is raised. 
		public string SubscriptionFilter { get; set; }

		// Subject of the notification. 
		public string ArticleId { get; set; } 
	}

## <a id="ModelingSubscriptions"></a>Modeling subscriptions
Subscriptions can be created for various criteria like a specific category of articles of interest, or a specific publisher. Hence the `SubscriptionFilter` is a good choice for partition key.

	class Subscriptions 
	{ 
		// Unique ID for Subscription 
		public string Id { get; set; }

		// Subscription source. Could be Author | Category etc. 
		public string SubscriptionFilter { get; set; }

		// subscribing User. 
		public string UserId { get; set; }

		public string PartitionKey 
		{ 
			get 
			{ 
				return this.SubscriptionFilter; 
			} 
		} 
	}

## <a id="ModelingArticles"></a>Modeling articles
Once an article is identified through notifications, subsequent queries are typically based on the `Article.Id`. Choosing `Article.Id` as partition the key thus provides the best distribution for storing articles inside an Azure Cosmos DB collection. 

	class Article 
	{ 
		// Unique ID for Article 
		public string Id { get; set; }
		
		public string PartitionKey 
		{ 
			get 
			{ 
				return this.Id; 
			} 
		}
		
		// Author of the article
		public string Author { get; set; }

		// Category/genre of the article
		public string Category { get; set; }

		// Tags associated with the article
		public string[] Tags { get; set; }

		// Title of the article
		public string Title { get; set; }
		
		//... 
	}

## <a id="ModelingReviews"></a>Modeling reviews
Like articles, reviews are mostly written and read in the context of article. Choosing `ArticleId` as a partition key provides best distribution and efficient access of reviews associated with article. 

	class Review 
	{ 
		// Unique ID for Review 
		public string Id { get; set; }

		// Article Id of the review 
		public string ArticleId { get; set; }

		public string PartitionKey 
		{ 
			get 
			{ 
				return this.ArticleId; 
			} 
		}
		
		//Reviewer Id 
		public string UserId { get; set; }
		public string ReviewText { get; set; }
		
		public int Rating { get; set; } }
	}

## <a id="DataAccessMethods"></a>Data access layer methods
Now let's look at the main data access methods we need to implement. Here's the list of methods that the `ContentPublishDatabase` needs:

	class ContentPublishDatabase 
	{ 
		public async Task CreateSubscriptionAsync(string userId, string category);
	
		public async Task<IEnumerable<Notification>> ReadNotificationFeedAsync(string userId);
	
		public async Task<Article> ReadArticleAsync(string articleId);
	
		public async Task WriteReviewAsync(string articleId, string userId, string reviewText, int rating);
	
		public async Task<IEnumerable<Review>> ReadReviewsAsync(string articleId); 
	}

## <a id="Architecture"></a>Azure Cosmos DB account configuration
To guarantee local reads and writes, we must partition data not just on partition key, but also based on the geographical access pattern into regions. The model relies on having a geo-replicated Azure Cosmos DB database account for each region. For example, with two regions, here's a setup for multi-region writes:

| Account Name | Write Region | Read Region |
| --- | --- | --- |
| `contentpubdatabase-usa.documents.azure.com` | `West US` |`North Europe` |
| `contentpubdatabase-europe.documents.azure.com` | `North Europe` |`West US` |

The following diagram shows how reads and writes are performed in a typical application with this setup:

![Azure Cosmos DB multi-master architecture](./media/multi-region-writers/multi-master.png)

Here is a code snippet showing how to initialize the clients in a DAL running in the `West US` region.
    
    ConnectionPolicy writeClientPolicy = new ConnectionPolicy { ConnectionMode = ConnectionMode.Direct, ConnectionProtocol = Protocol.Tcp };
    writeClientPolicy.PreferredLocations.Add(LocationNames.WestUS);
    writeClientPolicy.PreferredLocations.Add(LocationNames.NorthEurope);

    DocumentClient writeClient = new DocumentClient(
        new Uri("https://contentpubdatabase-usa.documents.azure.com"), 
        writeRegionAuthKey,
        writeClientPolicy);

    ConnectionPolicy readClientPolicy = new ConnectionPolicy { ConnectionMode = ConnectionMode.Direct, ConnectionProtocol = Protocol.Tcp };
    readClientPolicy.PreferredLocations.Add(LocationNames.NorthEurope);
    readClientPolicy.PreferredLocations.Add(LocationNames.WestUS);

    DocumentClient readClient = new DocumentClient(
        new Uri("https://contentpubdatabase-europe.documents.azure.com"),
        readRegionAuthKey,
        readClientPolicy);

With the preceding setup, the data access layer can forward all writes to the local account based on where it is deployed. Reads are performed by reading from both accounts to get the global view of data. This approach can be extended to as many regions as required. For example, here's a setup with three geographic regions:

| Account Name | Write Region | Read Region 1 | Read Region 2 |
| --- | --- | --- | --- |
| `contentpubdatabase-usa.documents.azure.com` | `West US` |`North Europe` |`Southeast Asia` |
| `contentpubdatabase-europe.documents.azure.com` | `North Europe` |`West US` |`Southeast Asia` |
| `contentpubdatabase-asia.documents.azure.com` | `Southeast Asia` |`North Europe` |`West US` |

## <a id="DataAccessImplementation"></a>Data access layer implementation
Now let's look at the implementation of the data access layer (DAL) for an application with two writable regions. The DAL must implement the following steps:

* Create multiple instances of `DocumentClient` for each account. With two regions, each DAL instance has one `writeClient` and one `readClient`. 
* Based on the deployed region of the application, configure the endpoints for `writeclient` and `readClient`. For example, the DAL deployed in `West US` uses `contentpubdatabase-usa.documents.azure.com` for performing writes. The DAL deployed in `NorthEurope` uses `contentpubdatabase-europ.documents.azure.com` for writes.

With the preceding setup, the data access methods can be implemented. Write operations forward the write to the corresponding `writeClient`.

    public async Task CreateSubscriptionAsync(string userId, string category)
    {
        await this.writeClient.CreateDocumentAsync(this.contentCollection, new Subscriptions
        {
            UserId = userId,
            SubscriptionFilter = category
        });
    }

    public async Task WriteReviewAsync(string articleId, string userId, string reviewText, int rating)
    {
        await this.writeClient.CreateDocumentAsync(this.contentCollection, new Review
        {
            UserId = userId,
            ArticleId = articleId,
            ReviewText = reviewText,
            Rating = rating
        });
    }

For reading notifications and reviews, you must read from both regions and union the results as shown in the following snippet:

    public async Task<IEnumerable<Notification>> ReadNotificationFeedAsync(string userId)
    {
        IDocumentQuery<Notification> writeAccountNotification = (
        	from notification in this.writeClient.CreateDocumentQuery<Notification>(this.contentCollection) 
        	where notification.UserId == userId 
        	select notification).AsDocumentQuery();
        
        IDocumentQuery<Notification> readAccountNotification = (
        	from notification in this.readClient.CreateDocumentQuery<Notification>(this.contentCollection) 
        	where notification.UserId == userId 
        	select notification).AsDocumentQuery();

        List<Notification> notifications = new List<Notification>();

        while (writeAccountNotification.HasMoreResults || readAccountNotification.HasMoreResults)
        {
            IList<Task<FeedResponse<Notification>>> results = new List<Task<FeedResponse<Notification>>>();

            if (writeAccountNotification.HasMoreResults)
            {
                results.Add(writeAccountNotification.ExecuteNextAsync<Notification>());
            }

            if (readAccountNotification.HasMoreResults)
            {
                results.Add(readAccountNotification.ExecuteNextAsync<Notification>());
            }

            IList<FeedResponse<Notification>> notificationFeedResult = await Task.WhenAll(results);

            foreach (FeedResponse<Notification> feed in notificationFeedResult)
            {
                notifications.AddRange(feed);
            }
        }
        return notifications;
    }

    public async Task<IEnumerable<Review>> ReadReviewsAsync(string articleId)
    {
        IDocumentQuery<Review> writeAccountReviews = (
        	from review in this.writeClient.CreateDocumentQuery<Review>(this.contentCollection) 
        	where review.ArticleId == articleId 
        	select review).AsDocumentQuery();
        
        IDocumentQuery<Review> readAccountReviews = (
        	from review in this.readClient.CreateDocumentQuery<Review>(this.contentCollection) 
        	where review.ArticleId == articleId 
        	select review).AsDocumentQuery();

        List<Review> reviews = new List<Review>();
        
        while (writeAccountReviews.HasMoreResults || readAccountReviews.HasMoreResults)
        {
            IList<Task<FeedResponse<Review>>> results = new List<Task<FeedResponse<Review>>>();

            if (writeAccountReviews.HasMoreResults)
            {
                results.Add(writeAccountReviews.ExecuteNextAsync<Review>());
            }

            if (readAccountReviews.HasMoreResults)
            {
                results.Add(readAccountReviews.ExecuteNextAsync<Review>());
            }

            IList<FeedResponse<Review>> notificationFeedResult = await Task.WhenAll(results);

            foreach (FeedResponse<Review> feed in notificationFeedResult)
            {
                reviews.AddRange(feed);
            }
        }

        return reviews;
    }

Thus, by choosing a good partitioning key and static account-based partitioning, you can achieve multi-region local writes and reads using Azure Cosmos DB.

## <a id="NextSteps"></a>Next steps
In this article, we described how you can use globally distributed multi-region read write patterns with Azure Cosmos DB using content publishing as a sample scenario.

* Learn about how Azure Cosmos DB supports [global distribution](distribute-data-globally.md)
* Learn about [automatic and manual failovers in Azure Cosmos DB](regional-failover.md)
* Learn about [global consistency with Azure Cosmos DB](consistency-levels.md)
* Develop with multiple regions using the [Azure Cosmos DB - DocumentDB API](tutorial-global-distribution-documentdb.md)
* Develop with multiple regions using the [Azure Cosmos DB - MongoDB API](tutorial-global-distribution-MongoDB.md)
* Develop with multiple regions using the [Azure Cosmos DB - Table API](tutorial-global-distribution-table.md)
