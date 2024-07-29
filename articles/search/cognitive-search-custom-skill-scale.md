---
title: 'Scale and manage custom skill'
titleSuffix: Azure AI Search
description: Learn the tools and techniques for efficiently scaling out a custom skill for maximum throughput. Custom skills invoke custom AI models or logic that you can add to an AI-enriched indexing pipeline in Azure AI Search.

author: gmndrg
ms.author: gimondra
ms.service: cognitive-search
ms.custom:
  - ignite-2023
ms.topic: conceptual
ms.date: 03/18/2024
---

# Efficiently scale out a custom skill

Custom skills are web APIs that implement a specific interface. A custom skill can be implemented on any publicly addressable resource. The most common implementations for custom skills are:

+ Azure Functions for custom logic skills
+ Azure Web apps for simple containerized AI skills
+ Azure Kubernetes service for more complex or larger skills.

## Skillset configuration

The following properties on a [custom skill](cognitive-search-custom-skill-web-api.md) are used for scale. Review the [custom skill interface](cognitive-search-custom-skill-interface.md) for an introduction into the inputs and outputs that a custom skill should implement.

1. Set `batchSize` of the custom skill to configure the number of records sent to the skill in a single invocation of the skill.

1. Set the `degreeOfParallelism` to calibrate the number of concurrent requests the indexer makes to your skill.

1. Set `timeout`to a value sufficient for the skill to respond with a valid response.

1. In the `indexer` definition, set [`batchSize`](/rest/api/searchservice/create-indexer#indexer-parameters) to the number of documents that should be read from the data source and enriched concurrently.

### Considerations

 There's no "one size fits all" set of recommendations. You should plan on testing different configurations to reach an optimum result. Scale up strategies are based on fewer large requests, or many small requests.

+ Skill invocation cardinality: make sure you know whether the custom skill executes once for each document (`/document/content`) or multiple times per document (`/document/reviews_text/pages/*`). If it's multiple times per document, stay on the lower side of `batchSize` and `degreeOfParallelism` to reduce churn, and try setting indexer batch size to incrementally higher values for more scale.

+ Coordinate custom skill `batchSize` and indexer `batchSize`, and make sure you're not creating bottlenecks. For example, if the indexer batch size is 5, and the skill batch size is 50, you would need 10 indexer batches to fill a custom skill request. Ideally, skill batch size should be less than or equal to indexer batch size.

+ For `degreeOfParallelism`, use the average number of requests an indexer batch can generate to guide your decision on how to set this value. If your infrastructure hosting the skill, for example an Azure function, can't support high levels of concurrency, consider dialing down the degrees of parallelism. You can test your configuration with a few documents to validate your understanding of average number of requests.

+ Although your object is scale and support of high volumes, testing with a smaller sample of documents helps quantify different stages of execution. For example, you can evaluate the execution time of your skill, relative to the overall time taken to process the subset of documents. This helps you answer the question: does your indexer spend more time building a batch or waiting for a response from your skill? 

+ Consider the upstream implications of parallelism. If the input to a custom skill is an output from a prior skill, are all the skills in the skillset scaled out effectively to minimize latency?

## Error handling in the custom skill

Custom skills should return a success status code HTTP 200 when the skill completes successfully. If one or more records in a batch result in errors, consider returning multi-status code 207. The errors or warnings list for the record should contain the appropriate message.

Any items in a batch that errors will result in the corresponding document failing. If you need the document to succeed, return a warning.

Any status code over 299 is evaluated as an error and all the enrichments are failed resulting in a failed document. 

### Common error messages

* `Could not execute skill because it did not execute within the time limit '00:00:30'. This is likely transient. Please try again later. For custom skills, consider increasing the 'timeout' parameter on your skill in the skillset.` Set the timeout parameter on the skill to allow for a longer execution duration.

* `Could not execute skill because Web Api skill response is invalid.` Indicative of the skill not returning a message in the custom skill response format. This could be the result of an uncaught exception in the skill.

* `Could not execute skill because the Web Api request failed.` Most likely caused by authorization errors or exceptions.

* `Could not execute skill.` Commonly the result of the skill response being mapped to an existing property in the document hierarchy.

## Testing custom skills

Start by testing your custom skill with a REST API client to validate:

* The skill implements the custom skill interface for requests and responses

* The skill returns valid JSON with the `application/JSON` MIME type

* Returns a valid HTTP status code

Create a [debug session](cognitive-search-debug-session.md) to add your skill to the skillset and make sure it produces a valid enrichment. While a debug session doesn't allow you to tune the performance of the skill, it enables you to ensure that the skill is configured with valid values and returns the expected enriched objects.

## Best practices

* While skills can accept and return larger payloads, consider limiting the response to 150 MB or less when returning JSON.

* Consider setting the batch size on the indexer and skill to ensure that each data source batch generates a full payload for your skill.

* For long running tasks, set the timeout to a high enough value to ensure the indexer doesn't error out when processing documents concurrently.

* Optimize the indexer batch size, skill batch size, and skill degrees of parallelism to generate the load pattern your skill expects, fewer large requests or many small requests.

* Monitor custom skills with detailed logs of failures as you can have scenarios where specific requests consistently fail as a result of the data variability.