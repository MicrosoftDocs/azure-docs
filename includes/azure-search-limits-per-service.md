Storage is constrained by disk space or by a hard limit on the *maximum number* of indexes or documents, whichever comes first.

| Resource | Free | Basic | S1 | S2 | S3 | S3 HD |
| --- | --- | --- | --- | --- | --- | --- |
| Service Level Agreement (SLA) |No <sup>1</sup> |Yes |Yes |Yes |Yes |Yes |
| Storage per partition |50 MB |2 GB |25 GB |100 GB |200 GB |200 GB |
| Partitions per service |N/A |1 |12 |12 |12 |3 <sup>2</sup> |
| Partition size |N/A |2 GB |25 GB |100 GB |200 GB |200 GB |
| Replicas |N/A |3 |12 |12 |12 |12 |
| Maximum indexes |3 |5 |50 |200 |200 |1000 per partition or 3000 per service |
| Maximum indexers |3 |5 |50 |200 |200 |No indexer support |
| Maximum datasources |3 |5 |50 |200 |200 |No indexer support |
| Maximum documents |10,000 |1 million |15 million per partition or 180 million per service |60 million per partition or 720 million per service |120 million per partition or 1.4 billion per service |1 million per index or 200 million per partition |
| Estimated queries per second (QPS) |N/A |~3 per replica |~15 per replica |~60 per replica |~60 per replica |>60 per replica |

<sup>1</sup> Free tier and preview features do not come with service level agreements (SLAs). For all billable tiers, SLAs take effect when you provision sufficient redundancy for your service. Two or more replicas are required for query (read) SLA. Three or more replicas are required for query and indexing (read-write) SLA. The number of partitions is not an SLA consideration. 

<sup>2</sup> S3 HD has a hard limit of 3 partitions, which is lower than the partition limit for S3. The lower partition limit is imposed because the index count for S3 HD is substantially higher. Given that service limits exist for both computing resources (storage and processing) and content (indexes and documents), the content limit is reached first.
