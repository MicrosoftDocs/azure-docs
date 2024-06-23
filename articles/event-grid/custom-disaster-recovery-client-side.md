---
title: Build your own client-side failover implementation in Azure Event Grid
description: This article describes how to build your own client-side failover implementation in Azure Event Grid resources.
ms.topic: tutorial
ms.date: 11/15/2023
ms.devlang: csharp
ms.custom:
  - devx-track-csharp
  - build-2023
  - ignite-2023
---

# Client-side failover implementation in Azure Event Grid

Disaster recovery typically involves creating a backup resource to prevent interruptions when a region becomes unhealthy. During this process a primary and secondary region of Azure Event Grid resources will be needed in your workload.

There are different ways to recover from a severe loss of application functionality. In this article we're going to describe the checklist you'll need to follow to prepare your client to recover from a failure due to an unhealthy resource or region.

Event Grid supports manual and automatic geo disaster recovery (GeoDR) on the server side. You can still implement client-side disaster recovery logic if you want a greater control on the failover process. For details about automatic GeoDR, see [Server-side geo disaster recovery in Azure Event Grid](geo-disaster-recovery.md).

The following table illustrates the client-side failover and geo disaster recovery support in Event Grid.

| Event Grid resource | Client-side failover support              | Geo disaster recovery (GeoDR) support |
|---------------------|-------------------------------------------|---------------------------------------|
| Custom Topics       | Supported                                 | Cross-Geo / Regional                  |
| System Topics       | Not supported                             | Enabled automatically                 |
| Domains             | Supported                                 | Cross-Geo / Regional                  |
| Partner Namespaces  | Supported                                 | Not supported                         |
| Namespaces          | Supported                                 | Not supported                         |




## Client-side failover considerations

1. Create and configure your **primary** Event Grid resource.
2. Create and configure your **secondary** Event Grid resource.
3. Keep in mind both resources must have the same configuration, subresources and capabilities enabled.
4. Event Grid resources must be hosted in different regions.
5. If the Event Grid resource has dependant resources like a storage resource for dead-lettering you should use the same region used in the secondary Event Grid resource.
6. Ensure your endpoints are regularly tests to provide warranty your recovery plan resources are in place and functioning correctly.

## Basic client-side failover implementation sample for custom topics

The following sample code is a simple .NET publisher that attempts to publish to your primary topic first. If it doesn't succeed, it fails over the secondary topic. In either case, it also checks the health api of the other topic by doing a GET on `https://<topic-name>.<topic-region>.eventgrid.azure.net/api/health`. A healthy topic should always respond with **200 OK** when a GET is made on the **/api/health** endpoint.

> [!NOTE]
> The following sample code is only for demonstration purposes and is not intended for production use.

```csharp
using System;
using System.Net.Http;
using System.Collections.Generic;
using System.Threading.Tasks;
using Azure;
using Azure.Messaging.EventGrid;

namespace EventGridFailoverPublisher
{
    // This captures the "Data" portion of an EventGridEvent on a custom topic
    class FailoverEventData
    {
        public string TestStatus { get; set; }
    }

    class Program
    {
        static async Task Main(string[] args)
        {
            // TODO: Enter the endpoint each topic. You can find this topic endpoint value
            // in the "Overview" section in the "Event Grid topics" page in Azure Portal..
            string primaryTopic = "https://<primary-topic-name>.<primary-topic-region>.eventgrid.azure.net/api/events";
            string secondaryTopic = "https://<secondary-topic-name>.<secondary-topic-region>.eventgrid.azure.net/api/events";

            // TODO: Enter topic key for each topic. You can find this in the "Access Keys" section in the
            // "Event Grid topics" page in Azure Portal.
            string primaryTopicKey = "<your-primary-topic-key>";
            string secondaryTopicKey = "<your-secondary-topic-key>";

            Uri primaryTopicUri = new Uri(primaryTopic);
            Uri secondaryTopicUri = new Uri(secondaryTopic);

            Uri primaryTopicHealthProbe = new Uri($"https://{primaryTopicUri.Host}/api/health");
            Uri secondaryTopicHealthProbe = new Uri($"https://{secondaryTopicUri.Host}/api/health");

            var httpClient = new HttpClient();

            try
            {
                var client = new EventGridPublisherClient(primaryTopicUri, new AzureKeyCredential(primaryTopicKey));

                await client.SendEventsAsync(GetEventsList());
                Console.Write("Published events to primary Event Grid topic.");

                HttpResponseMessage health = httpClient.GetAsync(secondaryTopicHealthProbe).Result;
                Console.Write("\n\nSecondary Topic health " + health);
            }
            catch (RequestFailedException ex)
            {
                var client = new EventGridPublisherClient(secondaryTopicUri, new AzureKeyCredential(secondaryTopicKey));

                await client.SendEventsAsync(GetEventsList());
                Console.Write("Published events to secondary Event Grid topic. Reason for primary topic failure:\n\n" + ex);

                HttpResponseMessage health = await httpClient.GetAsync(primaryTopicHealthProbe);
                Console.WriteLine($"Primary Topic health {health}");
            }

            Console.ReadLine();
        }

        static IList<EventGridEvent> GetEventsList()
        {
            List<EventGridEvent> eventsList = new List<EventGridEvent>();

            for (int i = 0; i < 5; i++)
            {
                eventsList.Add(new EventGridEvent(
                    subject: "test" + i,
                    eventType: "Contoso.Failover.Test",
                    dataVersion: "2.0",
                    data: new FailoverEventData
                    {
                        TestStatus = "success"
                    }));
            }

            return eventsList;
        }
    }
}
```

### Try it out

Now that you have all of your components in place, you can test out your failover implementation.

To make sure your failover is working, you can change a few characters in the primary topic key to make it no longer valid. Try running the publisher again. With the following sample events will continue flowing through Event Grid, however when you look at your client, you'll see they're now being published via the secondary topic.

### Possible extensions

There are many ways to extend this sample based on your needs. For high-volume scenarios, you may want to regularly check the topic's health api independently. That way, if a topic were to go down, you don't need to check it with every single publish. Once you know a topic isn't healthy, you can default to publishing to the secondary topic.

Similarly, you may want to implement failback logic based on your specific needs. If publishing to the closest data center is critical for you to reduce latency, you can periodically probe the health api of a topic that has failed over. Once it's healthy again, it's safe to failback to the closer data center.

## Next steps

- Learn how to [receive events at an http endpoint](./receive-events.md)
- Discover how to [route events to Hybrid Connections](./custom-event-to-hybrid-connection.md)
- Learn about [disaster recovery using Azure DNS and Traffic Manager](../networking/disaster-recovery-dns-traffic-manager.md)
