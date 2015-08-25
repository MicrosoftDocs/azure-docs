Resource|Default Limit
---|---
Database size|Depends on performance level <sup>1</sup>
Logins|Depends on performance level <sup>1</sup>
Memory usage|16 MB memory grant for more than 20 seconds
Sessions|Depends on performance level <sup>1</sup>
Tempdb size|5 GB
Transaction duration|24 hours<sup>2</sup>
Locks per transaction|1 million
Size per transaction|2 GB
Percent of total log space used per transaction|20%
Max concurrent requests (worker threads)|Depends on performance level <sup>1</sup>


<sup>1</sup>SQL Database has performance tiers, such as Basic, Standard, and Premium. Standard and Premium are also divided into performance levels. For detailed limits per tier and service level, see [Azure SQL Database Service Tiers and Performance Levels](https://msdn.microsoft.com/library/azure/dn741336.aspx).

<sup>2</sup>If the transaction locks a resource required by an underlying system task, then the max duration is 20 seconds.
