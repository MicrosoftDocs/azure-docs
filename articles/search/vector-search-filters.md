---
title: Vector query filters
titleSuffix: Azure AI Search
description: Explains prefilters and post-filters in vector queries, and how filters affect query performance.

author: heidisteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 10/31/2023
---

# Filters in vector queries

Vector search provides [vector filter modes on query](vector-search-how-to-query.md) to specify whether you want filtering before or after query execution. This article describes each mode and explains  performance implications.

## Prefilter mode

Prefiltering applies filters before query execution, reducing the search surface area over which the query executes. In a vector query, `preFilter` is the default.

:::image type="content" source="media/vector-search-filters/pre-filter.svg" alt-text="Diagram of prefilters." border="true" lightbox="media/vector-search-filters/pre-filter.png":::

## Postfilter mode

Post-filtering applies filters after query execution, narrowing the search results.

:::image type="content" source="media/vector-search-filters/post-filter.svg" alt-text="Diagram of post-filters." border="true" lightbox="media/vector-search-filters/post-filter.png":::

## Benchmark testing of vector filter modes

To understand the conditions under which one filter mode performs better than the other, we ran a series of tests to evaluate query outcomes over small, medium, and large indexes.

+ Small (100,000 documents, 2.5-GB index, 1536 dimensions)
+ Medium (1 million documents, 25-GB index, 1536 dimensions)
+ Large (1 billion documents, 1.9-TB index, 96 dimensions)

Indexes had an identical construction: one key field, one vector field, one filter field.

In queries, we used an identical filter for both prefilter and postfilter operations. We used a simple filter to ensure that variations in performance were due to filtering mode, and not filter complexity.

Outcomes were measured in Queries Per Second (QPS).

### Takeaways

+ Prefiltering is almost always slower than postfiltering, except on small indexes where performance is approximately equal.

+ On larger datasets, prefiltering is orders of magnitude slower.

+ Prefilter is the default. If you're working with larger indexes, we recommend setting the `vectorFilterMode` to `postFilter`.

### Details

+ Given a dataset with 100,000 vectors at 1536 dimensions:
  + When filtering more than 30% of the dataset, prefiltering and postfiltering were comparable.
  + When filtering less than 0.1% of the dataset, prefiltering was about 50% slower than postfiltering.

+ Given a dataset with 1 million vectors at 1536 dimensions:
  + When filtering more than 30% of the dataset, prefiltering was about 30% slower.
  + When filtering less than 2% of the dataset, prefiltering was about seven times slower.

+ Given a dataset with 1 billion vectors at 96 dimensions:
  + When filtering more than 5% of the dataset, prefiltering was about 50% slower.
  + When filtering less than 10% of the dataset, prefiltering was about seven times slower.

The following graph shows prefilter relative QPS, computed as prefilter QPS divided by postfilter QPS. The horizontal axis represents the filtering rate, or the percentage of candidate documents after applying the filter. For example, a value of 0.5 on the vertical axis means prefiltering was 50% slower than postfiltering.

:::image type="content" source="media/vector-search-filters/chart.svg" alt-text="Chart showing QPS performance for small, medium, and large indexes for relative QPS." border="true" lightbox="media/vector-search-filters/chart.png":::
