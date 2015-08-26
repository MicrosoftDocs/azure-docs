=======
Entity|Quota (Standard Offer)
---|---
Database Accounts*|5
Number of databases per database account|100
Number of users per database account – across all databases|500,000
Number of permissions per database account – across all databases|2,000,000
Attachment storage per database account (Preview Feature)|2 GB
Maximum Request Units / second per collection|2500
Number of stored procedures, triggers and UDFs per collection* |25 each
Maximum execution time for stored procedure and trigger|5 seconds
Provisioned document storage / collection|10 GB
Maximum collections per database account*|100
Maximum document storage per database (100 collections)* |1 TB
Maximum Length of the Id property|255 characters
Maximum items per page|1000
Maximum request size of document and attachment |512KB
Maximum request size of stored procedure, trigger and UDF|512KB
Maximum response size|1MB
String|All strings must conform to the UTF-8 encoding. Since UTF-8 is a variable width encoding, string sizes are determined using the UTF-8 bytes.
Maximum length of property or value|No practical limit
Maximum number of UDFs per query* |1
Maximum number of JOINs per query* |2
Maximum number of AND clauses per query* |5
Maximum number of OR clauses per query* |5
Maximum number of values per IN expression* |100
Maximum number of points in a polygon argument in a ST_WITHIN query* |16
Maximum number of collection creates per minute* |5
Maximum number of scale operations per minute* |5

Quotas listed with an asterisk (*) [can be adjusted by contacting Azure support](../articles/documentdb/documentdb-increase-limits.md).
