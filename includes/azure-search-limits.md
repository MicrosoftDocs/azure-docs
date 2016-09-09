Resource|Free|Basic (Preview) <sup>6</sup>|S1|S2 <sup>7</sup>
---|---|---|---|----
Maximum search services <sup>8</sup>|1 per subscription|12 per subscription|12 per subscription|1 per subscription
Maximum storage size <sup>1</sup>|50 MB or 10,000 documents|2 GB per service|25 GB per partition or 300 GB documents per service|100 GB per partition or 1.2 TB per service
Maximum documents hosted|10,000 total|1 million per service|15 million per partition (up to 180 million documents per service)|60 million per partition (up to 720 million documents per service)
Maximum indexes|3|5|50|200
Maximum indexers|3|5|50|200
Maximum indexer datasources|3|5|50|200
Index: maximum fields per index|1000|100 <sup>5</sup>|1000|1000
Index: maximum scoring profiles per index|16|16|16|16
Index: maximum functions per profile|8|8|8|8
Indexers: maximum indexing load per invocation|10,000 documents|Limited only by maximum documents|Limited only by maximum documents|Limited only by maximum documents
Indexers: maximum running time|3 minutes|24 hours|24 hours|24 hours
Blob indexer: maximum blob size, MB|16|16|128|256
Blob indexer: maximum characters of content extracted from a blob|32,000|64,000|4 million|4 million
Queries per second (QPS) <sup>2</sup>|N/A|~3 per replica|~15 per replica|~60 per replica
Scale out: maximum search units (SU) <sup>3</sup>|N/A|Up to 3 units (3 replicas and 1 partition)|36 units|36 units
Pricing <sup>4</sup>|N/A|$75 per SU per month|$250 per SU per month|$1000 per SU per month

<sup>1</sup> Storage size is either a fixed amount or the number of documents per service, whichever comes first.

<sup>2</sup> QPS is an approximation based on heuristics, using simulated and actual customer workloads to derive estimated values. Exact QPS throughput will vary depending on your data and the nature of the query.

<sup>3</sup> Search units are the billable unit for either a replica or a partition. You need both for storage, indexing, and query operations. See [Capacity Planning](../articles/search/search-capacity-planning.md) for valid combinations of replicas and partitions that keep you within the maximum limit of 3 or 36 units, for Basic and Standard respectively.

<sup>4</sup> Price is for the U.S. market, illustrating relative costs among alternative tiers. Different markets have different prices. Refer to the [Pricing page](https://azure.microsoft.com/pricing/details/search/) for rates in other currencies. The rate is per search unit (SU). At the S1 level, a configuration of 3 search units (say 3 replicas and 1 partition) would cost $750 per month on average. If you scale down to fewer SU within the month, the bill is prorated so that you are charged only for what you use.

<sup>5</sup> Basic tier is the only tier with a lower limit of 100 fields per index.

<sup>6</sup> [Basic tier](http://aka.ms/azuresearchbasic) is available at an introductory rate of 50% off the full price during the preview period.

<sup>7</sup> S2 requires a service ticket. It cannot be provisioned in the portal. Please contact Support or send email to azuresearch_contact@microsoft.com for assistance.

<sup>8</sup> You can raise the maximum number of services per subscription for all tiers except Free. Please contact Support or send email to azuresearch_contact@microsoft.com for assistance.
