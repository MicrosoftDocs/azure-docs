---
title: 'Scale and manage custom skill'
titleSuffix: Azure Cognitive Search
description: Learn the tools and techniques for efficiently scaling out a custom skill. Custom skills invoke custom AI models or logic that you can add to an AI-enriched indexing pipeline in Azure Cognitive Search.

manager: nitinme
author: vkurpad
ms.author: vikurpad
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 01/28/2021
---

# Efficiently scale out a custom skill

Custom skills are web APIs that implement a specific interface. A custom skill can be implemented on any publicly addressable resource. The most common implementations for custom skills are:
1. Azure functions for custom logic skills
2. Azure webapps for simple containerized AI skills
3. Azure kubernetes service for more complex or larger skills.

## Prerequisites

+ Review the [custom skill interface](cognitive-search-custom-skill-interface.md) for an introduction into the input/output interface that a custom skill should implement.

+ Set up your environment. You could start with [this tutorial end-to-end](https://docs.microsoft.com/azure/python/tutorial-vs-code-serverless-python-01) to set up serverless Azure Function using Visual Studio Code and Python extensions.

## Skillset configuration

Configuring a custom skill for maximizing throughput of the indexing process requires an understanding of the skill, indexer configurations and how the skill relates to each document. For example, the number of times a skill is invoked per document and the expected duration per invocation.

### Skill settings

1. `batchSize` the [batch size parameter](https://docs.microsoft.com/azure/search/cognitive-search-custom-skill-web-api) configures the number of records sent to the skill in a single invocation of the skill. 

2. `degreeOfParallelism` the [degree of parallelism](https://docs.microsoft.com/azure/search/cognitive-search-custom-skill-web-api) is the number of concurrent requests the indexer will make to your skill.

3. 'timeout` the [timeout](https://docs.microsoft.com/azure/search/cognitive-search-custom-skill-web-api) is the duration the indexer will keep a connection alive for the skill to respond with a valid response.

### Indexer setting

1. `batchSize` the [indexer batchSize](https://docs.microsoft.com/rest/api/searchservice/create-indexer#indexer-parameters) is the number of documents read from the data source and enriched concurrently.

### Considerations

Setting these variables to optimize the indexers performance requires determining if your skill performs better with many concurrent small requests of fewer large requests. A few questions to consider are:

1. What is the skill invocation cardinality? Does the skill execute once for each document, for instance a document classification skill, or could the skill execute multiple times per document, a paragraph classification skill?

2. On average how many documents are read from the data source to fill out a skill request based on the skill batch size? Ideally, this should be less than the indexer batch size.

3. If each data source document generates multiple calls to the skill, what is the optimal setting for the degrees of parallelism? Can the infrastructure hosting the skill support that level of concurrency?

4. Does your indexer spend more time building a batch or waiting for a response from your skill?

5. Consider the upstream implications of parallelism. If the input to a custom skill is an output from a prior skill, are all the skills in the skillset scaled out effectively?

## Error handling in the custom skill

Custom skills should return a success status code HTTP 200 when the skill completes successfully. If one or more records in a batch result in errors, consider returning multi-status code 207. The errors or warnings list for the record should contain the appropriate message.

Any status code over 299 is evaluated as an error and all the enrichments are failed resulting in a failed document. 

## Testing custom skills

Start by testing your custom skill with a REST API client to validate:

1. The skill implements the custom skill interface for requests and responses

2. The skill returns valid JSON with the `application/JSON` MIME type

3. Returns a valid HTTP status code

Start a [debug session](https://docs.microsoft.com/azure/search/cognitive-search-debug-session) to add your skill to the skillset and validate it produces a valid enrichment. While a debug session does not allow you to tune the performance of the skill, it enables you to ensure that the skill is configured with valid values and returns the expected enriched objects.

## Best practices

1. While skills can accept and return larger payloads, consider limiting the response to 150 MB or less when returning JSON.

2. Consider setting the batch size on the indexer and skill to ensure that each data source batch generates a full payload for your skill.

3. For long running tasks, set the timeout to a high enough value to ensure the indexer does not error out when processing documents concurrently.

4. Optimize the indexer batch size, skill batch size, and skill degrees of parallelism to generate the load pattern your skill expects, fewer large requests or many small requests.

5. Monitor custom skills with detailed logs of failures as you can have scenarios where specific requests consistently fail as a result of the data variability.


## Next steps
Congratulations! Your custom skill is now scaled right to maximize throughput on the indexer. 

+ [Power Skills: a repository of custom skills](https://github.com/Azure-Samples/azure-search-power-skills)
+ [Add a custom skill to an AI enrichment pipeline](cognitive-search-custom-skill-interface.md)
+ [Add a Azure Machine Learning skill](https://docs.microsoft.com/azure/search/cognitive-search-aml-skill)
+ [Use debug sessions to test changes](https://docs.microsoft.com/azure/search/cognitive-search-debug-session)