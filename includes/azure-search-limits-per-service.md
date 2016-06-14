Storage is constrained by disk space or by a hard limit on the *maximum number* of indexes or documents, whichever comes first. 

Resource|Free|Basic|S1|S2|S3 <br/>(Preview)|S3 HD <br/>(Preview)
---|---|---|---|----|---|----
Service Level Agreement (SLA)|No <sup>1</sup> |Yes |Yes  |Yes |No <sup>1</sup> |No <sup>1</sup> 
Storage per service|50 MB |2 GB|300 GB|1.2 TB|2.4 TB|200 GB
Partitions per service|N/A|1|12|12|12|1
Partition size|N/A|2 GB|25 GB|100 GB|200 GB |200 GB
Replicas|N/A|1|12|12|12|12
Maximum Indexes|3|5|50|200|200|1000
Maximum Documents|10,000|1 million|180 million per service, 15 million per partition |720 million documents per service, 60 million per partition|1.4 billion documents per service, 120 million per partition|200 million per service, 1 million per index
Estimated queries per second (QPS)|N/A|~3 per replica|~15 per replica|~60 per replica|>60 per replica|>60 per replica

<sup>1</sup> Free and Preview SKUs do not come with SLAs. SLAs are enforced once a SKU becomes generally available.