---
title: Scalability and Performance - Personalizer
titleSuffix: Azure Cognitive Services
description: "High-performance and high-traffic websites and applications have two main factors to consider with Personalizer for scalability and performance: latency and training throughput."
services: cognitive-services
author: edjez
manager: nitinme
ms.service: cognitive-services
ms.subservice: personalizer
ms.topic: conceptual
ms.date: 06/07/2019
ms.author: edjez
---
# Scalability and Performance

High-performance and high-traffic websites and applications have two main factors to consider with Personalizer for scalability and performance:

* Keeping low latency when making Rank API calls
* Making sure training throughput keeps up with event input

Personalization can return a rank very rapidly, with most of the call duration dedicated to communication through the REST API. Azure will autoscale the ability to respond to requests rapidly.

##  Low-latency scenarios

Some applications require low latencies when returning a rank. This is necessary:

* To keep the user from waiting a noticeable amount of time before displaying ranked content.
* To help a server that is experiencing extreme traffic avoid tying up scarce compute time and network connections.

<!--

If your web site is scaled on your infrastructure, you can avoid making HTTP calls by hosting the Personalizer API in your own servers running a Docker container.

This change would be transparent to your application, other than using an endpoint URL referring to the running docker instances as opposed to an online service in the cloud.



### Extreme Low Latency Scenarios

If you require latencies under a millisecond, and have already tested using Personalizer via containers, please contact our support team so we can assess your scenario and provide guidance suited to your needs.

-->

## Scalability and training throughput

Personalizer works by updating a model that is retrained based on messages sent asynchronously by Personalizer after Rank and Reward APIs. These messages are sent using an Azure EventHub for the application.

 It is unlikely most applications will reach the maximum joining and training throughput of Personalizer. While reaching this maximum will not slow down the application, it would imply Event Hub queues are getting filled internally faster than they can be cleaned up.

## How to estimate your throughput requirements

* Estimate the average number of bytes per ranking event adding the lengths of the context and action JSON documents.
* Divide 20MB/sec by this estimated average bytes.

For example, if your average payload has 500 features and each is an estimated 20 characters, then each event is approximately 10kb. With these estimates, 20,000,000 / 10,000 = 2,000 events/sec, which is about 173 million events/day. 

If you are reaching these limits, please contact our support team for architecture advice.

## Next steps

[Create and configure Personalizer](how-to-settings.md).