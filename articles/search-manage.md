<properties 
	pageTitle="Manage your Search service on Microsoft Azure | Microsoft Azure" 
	description="Manage your Search service on Microsoft Azure" 
	services="search" 
	documentationCenter="" 
	authors="HeidiSteen" 
	manager="mblythe" 
	editor=""
    tags="azure-portal"/>

<tags 
	ms.service="search" 
	ms.devlang="rest-api" 
	ms.workload="search" 
	ms.topic="article" 
	ms.tgt_pltfrm="na" 
	ms.date="04/27/2015" 
	ms.author="heidist"/>

# Manage your Search service on Microsoft Azure

Azure Search is a cloud-based service and HTTP-based API that can be used in custom search applications. Our Search service provides the engine for full-text search text analysis, advanced search features, search data storage, and a query command syntax. 

This article explains how to administer a Search service in the [Azure portal](https://portal.azure.com).

Alternatively, you can use the Management REST API. See [Get started with Azure Search Management REST API](search-get-started-management-api.md) and [Azure Search Management REST API reference](http://msdn.microsoft.com/library/azure/dn832684.aspx) for details.

<a id="sub-1"></a>
## Add search service to your subscription

As the administrator setting up a Search service, one of your first decisions is choosing a pricing tier. Options include the Free and Standard pricing tiers.

At no charge to existing subscribers, you can opt for a shared service, recommended for learning purposes, proof-of-concept testing, and small developmental projects. The shared service is constrained by 50 MB of storage, three indexes, and document count - a hard limit of 10,000 document, even if storage consumption is less than the full 50 MB allowed. There are no performance guarantees with the Shared service, so if you're building a production search application, consider Standard search instead.

Standard search is billable because you are signing up for dedicated resources and infrastructure used only by your subscription. Standard search is allocated in user-defined bundles of partitions (storage) and replicas (service workloads), and priced by search unit. You can scale up on partitions or replicas independently, adding more of whatever resource is needed.

To plan for capacity and understand the billing impact, we recommend these links:

+	[Limits and constraints](http://msdn.microsoft.com/library/dn798934.aspx)
+	[Pricing Details](http://go.microsoft.com/fwlink/p/?LinkdID=509792)

When you are ready to sign up, see [Create a Search service in the portal](search-create-service-portal.md).

<a id="sub-2"></a>
## Administrative tasks

Although some services can have co-administrators, an Azure Search service has one administrator per subscription. You need to be an administrator to perform the tasks outlined in this section.
Besides adding Search to the subscription, an administrator is responsible for these additional tasks:

+	Distribution of the service URL (defined during service provisioning).
+	Management and distribution of the api-keys.
+	Monitor resource usage
+	Scale up or down (applies to standard search only)
+	Start or stop the service
+	Set roles to control administrative access

<a id="sub-3"></a>
## Service URL

The service URL is defined as a fixed property when you create the service; it cannot be changed later. 

Developers who are building search applications will need to know the service URL for HTTP requests. You can quickly locate the service URL via the service dashboard.

To get the service URL from the service dashboard:

1.	Sign in to the [Azure portal](https://portal.azure.com).
2.	Click **Browse** | **Everything** | **Search services**.
3.	Click the name of your search service to open the dashboard.
4.	Click **PROPERTIES** to slide open a property page. The service URL is at the top of the page. You can pin this page for fast access later.

    ![][8]

Developers might also ask you about the api-version. A coding requirement of Azure Search API is to always specify the api-version in the request. This requirement exists so that developers can continue using a previous version, and then move up to a later version when the timing is right.

The api-version is not displayed in the portal pages, so that is not information that you can provide. For information about current and previous API versions, see the [Azure Search REST API](http://go.microsoft.com/fwlink/p/?LinkdID=509922).


<a id="sub-4"></a>
## Manage the api-keys

Developers who are building search applications will need to have an api-key in order to access Search. Every HTTP request to your search service will need an api-key that was generated specifically for your service. This api-key is the sole mechanism for authenticating to your search service URL.

Two types of keys are used to access your search service:

+	Admin (valid for any operation)
+	Query (valid only for query requests)

An admin api-key is created with the service. There is a primary key and secondary key. You can use them equally; neither one conveys a higher or lower level of access, which is useful in the event you want to roll over keys. You can regenerate either admin key, but you cannot add to the total admin key count. There can be a maximum of two admin keys per search service.

Query keys are designed for use in client applications that call Search directly. You can create up to 50 query keys.

To get or regenerate api-keys, open the service dashboard. Click **KEYS** to slide open the key management page. Commands for regenerating or creating keys are at the top of the page.

 ![][9]


<a id="sub-5"></a>
## Monitor resource usage

In this public preview, resource monitoring is limited to the information shown in the service dashboard and a few metrics that you can obtain by querying the service.

On the service dashboard, in the Usage section, you can quickly determine whether partition resource levels are adequate for your application.

Using the Search Service API, you can get a count on documents and indexes. There are hard limits associated with these counts based on the pricing tier. See [Limits and constraints](http://msdn.microsoft.com/library/dn798934.aspx) for details. 

+	[Get Index Statistics](http://msdn.microsoft.com/library/dn798942.aspx)
+	[Count Documents](http://msdn.microsoft.com/library/dn798924.aspx)

> [AZURE.NOTE] Caching behaviors can temporarily overstate a limit. For example, when using the shared service, you might see a document count over the hard limit of 10,000 documents. The overstatement is temporary and will be detected on the next limit enforcement check. 


<a id="sub-6"></a>
## Scale up or down

Every search service starts with a minimum of one replica and one partition. If you signed up for dedicated resources using the Standard pricing tier, you can click the **SCALE** tile in the service dashboard to readjust the number of partitions and replicas used by your service.

When you add either resource, the service uses them automatically. No further action is required on your part, but there will be a slight delay before the impact of the new resource is realized. It can take 15 minutes or more to provision the additional resources.

 ![][10]

### Add replicas

Increasing queries per second (QPS) or achieving high availability is done by adding replicas. Each replica has one copy of an index, so adding one more replica translates to one more index that can be used to service query requests. Currently, the rule of thumb is that you need at least 3 replicas for high availability. 

A search service having more replicas can load balance query requests over a larger number of indexes. Given a level of query volume, query throughput is going to be faster when there are more copies of the index available to service the request. If you are experiencing query latency, you can expect a positive impact on performance once the additional replicas are online.

Although query throughput goes up as you add replicas, it does not precisely double or triple as you add replicas to your service. All search applications are subject to external factors that can impinge on query performance. Complex queries and network latency are two factors that contribute to variations in query response times.

### Add partitions

Most service applications have a built-in need for more replicas rather than partitions, as most applications that utilize search can fit easily into a single partition that can support up to 15 million documents. 

For those cases where an increased document count is required, you can add partitions. Notice that partitions are added in multiples of 12 (specifically, 1, 2, 3, 4, 6, or 12). This is an artifact of sharding; an index is created in 12 shards, which can all be stored on 1 partition or equally divided into 2, 3, 4, 6, or 12 partitions (one shard per partition).

### Remove replicas

After periods of high query volumes, you will most likely remove replicas once search query loads have normalized (for example, after holiday sales are over).

To do this, you just move the replica slider back to a lower number. There are no further steps required on your part. Lowering the replica count relinquishes virtual machines in the data center. Your query and data ingestion operations will now run on fewer VMs than before. The minimum limit is one replica.

### Remove partitions

In contrast with removing replicas, which requires no extra effort on your part, you might have some work to do if you are using more storage than can be reduced. For example, if your solution is using three partitions, attempting to reduce to one or two partitions will generate an error if you are using more storage space than can be stored in the reduced number of partitions. In this case, your choices are to delete indexes or documents within an associated index to free up space, or keep the current configuration.

There is no detection method that tells you which index shards are stored on specific partitions. Each partition provides approximately 25 GB in storage, so you will need to reduce storage to a size that can be accommodated by the number of partitions you have. If you want to revert to one partition, all 12 shards will need to fit.

To help with future planning, you might want to check storage (using [Get Index Statistics](http://msdn.microsoft.com/library/dn798942.aspx)) to see how much you actually used. 


<a id="sub-7"></a>
## Start or Stop the Service

You can start, stop, or even delete the service using commands in the service dashboard.

 ![][11]


Stopping or starting the service does not turn off billing. You must delete the service to avoid charges altogether. Any data associated with your service is deleted when your service is decommissioned.

<a id="sub-8"></a>
## Set roles on administrative access

Azure provides a global role-based authorization model for all services managed through the Preview Portal, or in the Azure Resource Manager API if you're using a custom administration tool. Owner, Contributor, and Reader roles set the level of service administration for the Active Directory users, groups, and security principals you assign to each role. See [Role-based access control in Azure Portal](role-based-access-control-configure.md) for details about role membership.

In terms of Azure Search, role-based access controls determine the following administrative tasks:

<table>
<tr>
<td>Owner</td>
<td>
Start, stop, or delete the service.</br>
Generate and view admin keys and query keys.</br>
View service status, including index count, index names, document count, and storage size.</br>
Add or delete role membership (only an Owner can manage role membership).</br>
</br>
Subscription and service administrators have automatic membership in the Owners role.
</td>
</tr>
<tr>
<td>Contributor</td>	
<td>Has the same level of access as Owner, except for role management. For example, a Contributor can view and regenerate `api-key`, but he or she cannot modify role memberships.
</td>
</tr>
<tr>
<td>Reader</td>
<td>View service status and query keys. Members of this role cannot start or stop a service, nor can they view admin keys.
</td>
</tr>
</table>

Note that roles do not grant access rights to the service endpoint. Search service operations, such as index management, index population, and queries on search data, are controlled through api-keys, not roles. See "Authorization for management versus data operations" in [Role-based access control in Azure Portal](role-based-access-control-configure.md) for more information.

Roles provide access control after the service is created. Only subscription managers can add a Search service to a subscription.

<!--Anchors-->
[Add search service to your subscription]: #sub-1
[Administrative tasks]: #sub-2
[Service URL]: #sub-3
[Manage the api-keys]: #sub-4
[Monitor resource usage]: #sub-5
[Scale up or down]: #sub-6
[Start or Stop the Service]: #sub-7
[Set roles to control administrative access]: #sub-8

<!--Image references-->
[8]: ./media/search-manage/Azure-Search-Manage-1-URL.png
[9]: ./media/search-manage/Azure-Search-Manage-2-Keys.png
[10]: ./media/search-manage/Azure-Search-Manage-3-ScaleUp.png
[11]: ./media/search-manage/Azure-Search-Manage-4-StartStop.png


