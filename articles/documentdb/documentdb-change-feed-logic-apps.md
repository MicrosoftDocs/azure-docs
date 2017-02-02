---
title: DocumentDB change notifications with change feed and Logic Apps | Microsoft Docs
description: .
keywords: 
services: documentdb
author: hedidin
manager: jhubbard
editor: mimig
documentationcenter: ''

ms.assetid: 0d25c11f-9197-419a-aa19-4614c6ab2d06
ms.service: documentdb
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/02/2017
ms.author: b-hoedid

---

# Solving the problem of notifying patients of changes to their Health Records #

Recently we were contacted by a Healthcare organization that wanted to add new functionality to their Patient Portal. They needed to send notifications to patients when their Health Record was updated. Patients could subscribe for these updates. 


## Requirements ##
- Providers would be sending the HL7 C-CDA document (XML format).
- C-CDA documents were to be converted to [HL7 FHIR Resources](http://hl7.org/fhir/2017Jan/resourcelist.html) (JSON Format).
- Modified FHIR Resource Documents were to be sent by email (JSON Format).


## Solution ##
Three Logic Apps were needed to meet the above requirements.
1. Receive the HL7 C-CDA document and transform it to the FHIR Resources.
2. Query the DocumentDB FHIR Repository and save the response to a Service Bus Queue.
3. Send an email notification with the FHIR Resource documents in the body.

## Architecture ##
The three Logic Apps are shown in the following figure

![](http://i.imgur.com/IPrt05p.png)

#### Workflow Steps ####
1. Convert C-CDA Documents to FHIR Resources
2. Recurrence Trigger polling for Modified FHIR Resources 
2. Call the FhirNotificationApi
3. Save Response to Service Bus Queue
4. Poll for new messages in the Service Bus Queue
5. Send email notification




### Azure Services ###

#### DocumentDB  ####
Repository for the FHIR Resources as shown in the  following figure.

![](http://i.imgur.com/nG9bOfr.png)

#### Logic Apps ####
Logic Apps would handle the workflow process


----------


**Receive the HL7 C-CDA document and transform it to the FHIR Resources**

**Enterprise Integration Pack for Logic Apps **
Enterprise Integration Pack would handle the mapping from the C-CDA to FHIR Resources

![](http://i.imgur.com/6zSXkRx.png)


----------


**Query the DocumentDB FHIR Repository and save the response to a Service Bus Queue.**

![](http://i.imgur.com/no4KVL0.png)

----------


**Send an email notification with the FHIR Resource documents in the body.**


![](http://i.imgur.com/lUGrfkF.png)


#### Service Bus ####
The following figure shows the patients queue. We used the Tag Property value for
the Email Subject.

![](http://i.imgur.com/WH2yWby.png)



#### API App ####
An API App would be used to connect to DocumentDB, and Query for new or modified FHIR 
Documents By Resource Type. Has one controller, **FhirNotificationApi** with a one
operation **GetNewOrModifiedFhirDocuments** 

We are using the [`CreateDocumentChangeFeedQuery`](https://msdn.microsoft.com/en-us/library/azure/microsoft.azure.documents.client.documentclient.createdocumentchangefeedquery.aspx) class from the DocumentDB .NET API

> NOTE:  You can read more about DocumentDB Change Feed [here](https://docs.microsoft.com/en-us/azure/documentdb/documentdb-change-feed) 

##### GetNewOrModifiedFhirDocuments #####

**Inputs**
- DatabaseId
- CollectionId
- HL7 FHIR Resource Type name
- Boolean: Start from Beginning
- Int: Number of documents returned

**Outputs**
- Success: Status Code: 200, Response: List of Documents (JSON Array)
- Failure: Status Code: 404, Response: "No Documents found for '*resource name'* Resource Type"

**Source**

```C#

	using System.Collections.Generic;
	using System.Linq;
	using System.Net;
	using System.Net.Http;
	using System.Threading.Tasks;
	using System.Web.Http;
	using Microsoft.Azure.Documents;
	using Microsoft.Azure.Documents.Client;
	using Swashbuckle.Swagger.Annotations;
	using TRex.Metadata;
	
	namespace FhirNotificationApi.Controllers
	{
	    /// <summary>
	    ///     FHIR Resource Type Controller
	    /// </summary>
	    /// <seealso cref="System.Web.Http.ApiController" />
	    public class FhirResourceTypeController : ApiController
	    {
	        /// <summary>
	        ///     Gets the new or modified FHIR documents from Last Run Date 
	        ///		or create date of the collection
	        /// </summary>
	        /// <param name="databaseId"></param>
	        /// <param name="collectionId"></param>
	        /// <param name="resourceType"></param>
	        /// <param name="startfromBeginning"></param>
	        /// <param name="maximumItemCount">-1 returns all (default)</param>
	        /// <returns></returns>
	        [Metadata("Get New or Modified FHIR Documents",
	            "Query for new or modifed FHIR Documents By Resource Type " +
	            "from Last Run Date or Begining of Collection creation"
	        )]
	        [SwaggerResponse(HttpStatusCode.OK, type: typeof(Task<dynamic>))]
	        [SwaggerResponse(HttpStatusCode.NotFound, "No New or Modifed Documents found")]
	        [SwaggerOperation("GetNewOrModifiedFHIRDocuments")]
	        public async Task<dynamic> GetNewOrModifiedFhirDocuments(
	            [Metadata("Database Id", "Database Id")] string databaseId,
	            [Metadata("Collection Id", "Collection Id")] string collectionId,
	            [Metadata("Resource Type", "FHIR resource type name")] string resourceType,
	            [Metadata("Start from Beginning ", "Change Feed Option")] bool startfromBeginning,
	            [Metadata("Maximum Item Count", "Number of documents returned. '-1 returns all' (default)")] int maximumItemCount = -1
	        )
	        {
	            var collectionLink = UriFactory.CreateDocumentCollectionUri(databaseId, collectionId);
	
	            var context = new DocumentDbContext();	
	
	            var docs = new List<dynamic>();
	
	            var partitionKeyRanges = new List<PartitionKeyRange>();
	            FeedResponse<PartitionKeyRange> pkRangesResponse;
	
	            do
	            {
	                pkRangesResponse = await context.Client.ReadPartitionKeyRangeFeedAsync(collectionLink);
	                partitionKeyRanges.AddRange(pkRangesResponse);
	            } while (pkRangesResponse.ResponseContinuation != null);
	
	            foreach (var pkRange in partitionKeyRanges)
	            {
	                var changeFeedOptions = new ChangeFeedOptions
	                {
	                    StartFromBeginning = startfromBeginning,
	                    RequestContinuation = null,
	                    MaxItemCount = maximumItemCount,
	                    PartitionKeyRangeId = pkRange.Id
	                };
	
	                using (var query = context.Client.CreateDocumentChangeFeedQuery(collectionLink, changeFeedOptions))
	                {
	                    do
	                    {
	                        if (query != null)
	                        {
	                            var results = await query.ExecuteNextAsync<dynamic>().ConfigureAwait(false);
	                            if (results.Count > 0)
	                                docs.AddRange(results.Where(doc => doc.resourceType == resourceType));
	                        }
	                        else
	                        {
	                            throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.NotFound));
	                        }
	                    } while (query.HasMoreResults);
	                }
	            }
	            if (docs.Count > 0)
	                return docs;
	            var msg = new StringContent("No documents found for " + resourceType + " Resource");
	            var response = new HttpResponseMessage
	            {
	                StatusCode = HttpStatusCode.NotFound,
	                Content = msg
	            };
	            return response;
	        }
	    }
	}
	
```

----------


### Testing the FhirNotificationApi ###


![](http://i.imgur.com/GKcjkEo.png)



### Azure Portal Dashboard ###

![](http://i.imgur.com/24qk1b6.png)


## Summary ##

- You have learned that DocumentDB has native suppport for Notifications for new or modifed documents and how easy it is to use. 
- By leveraging Logic Apps, you can create workflows without writing any code.
- Using Azure Service Bus Queues to handle the distribution for the HL7 FHIR documents





