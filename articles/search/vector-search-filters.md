---
title: Vector query filters
titleSuffix: Azure AI Search
description: Explains prefilters and post-filters in vector queries, and how filters affect query performance.

author: heidisteen
ms.author: heidist
ms.service: cognitive-search
ms.custom:
  - ignite-2023
ms.topic: conceptual
ms.date: 11/01/2023
---

# Filters in vector queries

You can set a [vector filter modes on a vector query](vector-search-how-to-query.md) to specify whether you want filtering before or after query execution. Filters are set on and iterate over string and numeric fields attributed as `filterable` in the index, but the effects of filtering determine *what* the vector query executes over: the searchable space, or the documents in the search results.

This article describes each filter mode and provides guidance on when to use each one.

## Prefilter mode

Prefiltering applies filters before query execution, reducing the search surface area over which the vector search algorithm looks for similar content. In a vector query, `preFilter` is the default.

:::image type="content" source="media/vector-search-filters/pre-filter.svg" alt-text="Diagram of prefilters." border="true" lightbox="media/vector-search-filters/pre-filter.png":::

## Postfilter mode

Post-filtering applies filters after query execution, narrowing the search results.

:::image type="content" source="media/vector-search-filters/post-filter.svg" alt-text="Diagram of post-filters." border="true" lightbox="media/vector-search-filters/post-filter.png":::

## Benchmark testing of vector filter modes

To understand the conditions under which one filter mode performs better than the other, we ran a series of tests to evaluate query outcomes over small, medium, and large indexes.

+ Small (100,000 documents, 2.5-GB index, 1536 dimensions)
+ Medium (1 million documents, 25-GB index, 1536 dimensions)
+ Large (1 billion documents, 1.9-TB index, 96 dimensions)

For the small and medium workloads, we used a Standard 2 (S2) service with one partition and one replica. For the large workload, we used a Standard 3 (S3) service with 12 partitions and one replica.

Indexes had an identical construction: one key field, one vector field, one text field, and one numeric filterable field.

```python
def get_index_schema(self, index_name, dimensions):
    return {
        "name": index_name,
        "fields": [
            {"name": "id", "type": "Edm.String", "key": True, "searchable": True},
            {"name": "myvector", "type": "Collection(Edm.Single)", "dimensions": dimensions,
              "searchable": True, "retrievable": True, "filterable": False, "facetable": False, "sortable": False,
              "vectorSearchConfiguration": "defaulthnsw"},
            {"name": "text", "type": "Edm.String", "searchable": True, "filterable": False, "retrievable": True,
              "sortable": False, "facetable": False, "key": False},
            {"name": "score", "type": "Edm.Double", "searchable": False, "filterable": True,
              "retrievable": True, "sortable": True, "facetable": True, "key": False}
        ],
        "vectorSearch":
        {
            "algorithmConfigurations": [
                {"name": "defaulthnsw", "kind": "hnsw", "hnswParameters": {"metric": "euclidean"}}
            ]
        }
    }
```

In queries, we used an identical filter for both prefilter and postfilter operations. We used a simple filter to ensure that variations in performance were due to filtering mode, and not filter complexity. 

Outcomes were measured in Queries Per Second (QPS).

### Takeaways

+ Prefiltering is almost always slower than postfiltering, except on small indexes where performance is approximately equal.

+ On larger datasets, prefiltering is orders of magnitude slower.

+ So why is prefilter the default if it's almost always slower? Prefiltering guarantees that `k` results are returned if they exist in the index, where the bias favors recall and precision over speed.

+ Postfiltering is for customers who:

  + value speed over selection (postfiltering can return fewer than `k` results)
  + use filters that are not overly selective
  + have indexes of sufficient size such that prefiltering performance is unacceptable

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

The following graph shows prefilter relative QPS, computed as prefilter QPS divided by postfilter QPS. 

:::image type="content" source="media/vector-search-filters/chart.svg" alt-text="Chart showing QPS performance for small, medium, and large indexes for relative QPS." border="true" lightbox="media/vector-search-filters/chart.png":::

The vertical axis is QPS of prefiltering over QPS of postfiltering. For example, a value of 0.0 means prefiltering is 100% slower, 0.5 on the vertical axis means prefiltering is 50% slower, 1.0 means prefiltering and post filtering are equivalent.

The horizontal axis represents the filtering rate, or the percentage of candidate documents after applying the filter. For example, `1.00%` means that one percent of the search corpus was selected by the filter criteria.
