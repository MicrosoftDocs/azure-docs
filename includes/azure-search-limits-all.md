Resource|Free|S1|S2
---|---|---|----
Maximum search services|N/A|12 per Azure subscription|12 per Azure subscription
Maximum storage size<sup>1</sup>|50 MB or 10,000 documents|25 GB per partition or 300 GB documents per service|100 GB per partition or 1.2 TB per service
Maximum documents hosted|10,000 total|15 million per partition (up to 180 million documents per service)|60 million per partition (up to 720 million documents per service)

Maximum indexes|3|50|200

Maximum indexers|3|50|200

Maximum indexer datasources|3|50|200

Index: maximum fields per index|1000|1000|1000

Index: maximum scoring profiles per index|16|16|16

Index: maximum functions per profile|8|8|8

Indexers: maximum indexing load per invocation|10,000 documents|Limited only by maximum documents|Limited only by maximum documents

Indexers: maximum running time|3 minutes|24 hours|24 hours

Queries per second (QPS)<sup>2</sup>|N/A|~15 per replica|~60 per replica

Scale out: maximum search units<sup>3</sup>|N/A|36 units|36 units

Pricing<sup>4</sup>|N/A|$250 per month|$1000 per month

<sup>1</sup>Storage size is either a fixed amount or the number of documents per service, whichever comes first.

<sup>2</sup>QPS is an approximation based on heuristics, using simulated and actual customer workloads as inputs. Exact QPS throughput will vary depending on your data and the nature of the query.

<sup>3</sup>Search units are the billable unit for either a replica or a partition. You need both for both storage, indexing, and query operations. See [Capacity Planning](../articles/search/search-capacity-planning.md) for valid combinations of replicas and partitions that keep you within the maximum limit of 36 units.

<sup>4</sup>Price is for the U.S. market, illustrating relative costs among alternative tiers. Different markets have different prices. Refer to the [Pricing page](https://azure.microsoft.com/pricing/details/search/) for rates in other currencies.


