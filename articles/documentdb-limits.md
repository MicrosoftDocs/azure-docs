<properties title="required" pageTitle="required" description="required" metaKeywords="Optional" services="Optional" solutions="Optional" documentationCenter="Optional" authors="Required" videoId="Optional" scriptId="Optional" />


#DocumentDB Limits for the Preview Release
The following table describes the limits and quota enforcements of DocumentDB during the Preview release. In most cases the limits are enforced either with an intent to get your feedback or based on the current capacity constraints. If you have business need to relax the limits, please call us and we will do our best to accommodate within the constraints of the public offer.    

|Entity	|Quota (Standard Offer for the Preview release)|
|-------|--------|
|Database Accounts	|5
|Number of databases per database account	|100
|Number of users per database account – across all databases	|500, 000
|Number of permissions per database account – across all databases	|2,000,000
|Attachment storage per database account	|2 GB
|Maximum number of capacity units per database account	|5
|Number of collections per capacity unit	|3
|Minimum Allocated Storage per collection with minimum 1 document	|3.3 GB
|Minimum Allocated Throughput per collection with minimum 1 document	|667 RUs
|Elasticity of a collection	|0-10 GB
|Maximum Request Units / sec per collection	|2000
|Number of stored procedures, triggers and UDFs per collection 	|5 each
|Maximum execution time for stored procedure and trigger	|5 seconds
|Provisioned document storage / capacity unit	|10 GB
|Provisioned Request Units / sec / capacity unit	|2000
|Maximum document storage per database (5 capacity units)	|50 GB
|Maximum Length of the Id property	|255 characters
|Default number of items per page	|100
|Maximum items per page	|1000
|Maximum request size of document, attachment, stored procedure, trigger and UDF	|8KB
|Maximum response size	|100KB
|Maximum number of unique paths per collection	|100
|String	|All strings must conform to the UTF-8 encoding. Since UTF-8 is a variable width encoding, string sizes are determined using the UTF-8 bytes.
|Maximum length of property or value	|No practical limit
|Maximum number of UDFs per query	|1
|Maximum number of WHERE clauses per query 	|5
|Maximum number of JOINs per query	|1
|Maximum number of AND clauses per query	|1
|Maximum number of OR clauses per query	|1

