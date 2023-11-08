---
title: 'Scale and manage custom skill'
titleSuffix: Azure AI Search
description: Learn the tools and techniques for efficiently scaling out a custom skill for maximum throughput. Custom skills invoke custom AI models or logic that you can add to an AI-enriched indexing pipeline in Azure AI Search.

author: LiamCavanagh
ms.author: liamca
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 12/01/2022
---

# Efficiently scale out a custom skill

Custom skills are web APIs that implement a specific interface. A custom skill can be implemented on any publicly addressable resource. The most common implementations for custom skills are:
* Azure Functions for custom logic skills
* Azure Webapps for simple containerized AI skills
* Azure Kubernetes service for more complex or larger skills.

## Prerequisites

+ Review the [custom skill interface](cognitive-search-custom-skill-interface.md) for an introduction into the input/output interface that a custom skill should implement.

+ Set up your environment. You could start with [this tutorial end-to-end](../azure-functions/create-first-function-vs-code-python.md) to set up serverless Azure Function using Visual Studio Code and Python extensions.

## Skillset configuration

Configuring a custom skill for maximizing throughput of the indexing process requires an understanding of the skill, indexer configurations and how the skill relates to each document. For example, the number of times a skill is invoked per document and the expected duration per invocation.

### Skill settings

On the [custom skill](cognitive-search-custom-skill-web-api.md) set the following parameters.

1. Set `batchSize` of the custom skill to configure the number of records sent to the skill in a single invocation of the skill.

2. Set the `degreeOfParallelism` to calibrate the number of concurrent requests the indexer will make to your skill.

3. Set `timeout`to a value sufficient for the skill to respond with a valid response.

4. In the `indexer` definition, set [`batchSize`](/rest/api/searchservice/create-indexer#indexer-parameters) to the number of documents that should be read from the data source and enriched concurrently.

### Considerations

Setting these variables to optimize the indexers performance requires determining if your skill performs better with many concurrent small requests or fewer large requests. A few questions to consider are:

* What is the skill invocation cardinality? Does the skill execute once for each document, for instance a document classification skill, or could the skill execute multiple times per document, a paragraph classification skill?

* On average how many documents are read from the data source to fill out a skill request based on the skill batch size? Ideally, this should be less than the indexer batch size. With batch sizes greater than 1 your skill can receive records from multiple source documents. For example if the indexer batch count is 5 and the skill batch count is 50 and each document generates only five records, the indexer will need to fill a custom skill request across multiple indexer batches.

* The average number of requests an indexer batch can generate should give you an optimal setting for the degrees of parallelism. If your infrastructure hosting the skill cannot support that level of concurrency, consider dialing down the degrees of parallelism. As a best practice, test your configuration with a few documents to validate your choices on the parameters.

* Testing with a smaller sample of documents, evaluate the execution time of your skill to the overall time taken to process the subset of documents. Does your indexer spend more time building a batch or waiting for a response from your skill? 

* Consider the upstream implications of parallelism. If the input to a custom skill is an output from a prior skill, are all the skills in the skillset scaled out effectively to minimize latency?

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

Create a [debug session](cognitive-search-debug-session.md) to add your skill to the skillset and make sure it produces a valid enrichment. While a debug session does not allow you to tune the performance of the skill, it enables you to ensure that the skill is configured with valid values and returns the expected enriched objects.

## Best practices

* While skills can accept and return larger payloads, consider limiting the response to 150 MB or less when returning JSON.

* Consider setting the batch size on the indexer and skill to ensure that each data source batch generates a full payload for your skill.

* For long running tasks, set the timeout to a high enough value to ensure the indexer does not error out when processing documents concurrently.

* Optimize the indexer batch size, skill batch size, and skill degrees of parallelism to generate the load pattern your skill expects, fewer large requests or many small requests.

* Monitor custom skills with detailed logs of failures as you can have scenarios where specific requests consistently fail as a result of the data variability.


## Next steps
Congratulations! Your custom skill is now scaled right to maximize throughput on the indexer. 

+ [Power Skills: a repository of custom skills](https://github.com/Azure-Samples/azure-search-power-skills)
+ [Add a custom skill to an AI enrichment pipeline](cognitive-search-custom-skill-interface.md)
+ [Add an Azure Machine Learning skill](./cognitive-search-aml-skill.md)
+ [Use debug sessions to test changes](./cognitive-search-debug-session.md)
