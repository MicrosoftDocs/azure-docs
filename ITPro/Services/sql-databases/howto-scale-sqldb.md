<properties linkid="manage-services-how-to-scale-a-sqldb" urlDisplayName="How to scale" pageTitle="How to scale a SQL Database - Windows Azure" metaKeywords="" metaDescription="Learn about options for scaling your SQL Database in Windows Azure." metaCanonical="" disqusComments="1" umbracoNaviHide="0" />




<h1 id="scale">How to Scale a SQL Database Solution</h1>


On Windows Azure, database scalability is synonymous with scale out, where a workload is redistributed across multiple commodity servers in a data center. Scale out is a strategy for addressing problems with data capacity or performance. A very large database that is on a high-growth trajectory will eventually require a scale out strategy, whether it is accessed by a few users or many users.

Scale out on Windows Azure is best achieved through federation. SQL Database federation is based on horizontal sharding, where one or more tables are split by row and portioned across multiple federation members. 

Federation is not the only answer to every scalability problem. Sometimes the characteristics of your data or application requirements point to simpler approaches. The following list presents potential solutions in order of complexity.

##Increase the size of the database

Databases are created at a fixed size subject to a maximum imposed by each edition. For the Web edition, you can increase a database to a maximum of 5 gigabytes. For Business edition, the maximum database size is 150 gigabytes. The most obvious way to increase data capacity is to change the edition and maximum size:

     ALTER DATABASE school MODIFY (EDITION = 'Business', MAXSIZE=10GB);

##Use multiple databases and allocate users

In limited scenarios, you could create copies of a database and then allocate logins and users across each database. Before federation was an option, this was a common approach for redistributing a workload. This approach is viable for databases that you use on a short-term basis and then merge later into a primary database that you keep on premise, and for solutions that provide read-only data.

##Use federations

Federations in SQL Database are used to achieve greater scalability and performance. One or more tables within a database are split by row and portioned across multiple databases (Federation members). This type of horizontal partitioning is often referred to as ‘sharding’. The primary scenarios in which this is useful are where you need to achieve scale, performance, or to manage capacity. 

Federations are supported in the Business edition. For more information, see [Federations in SQL Database][] and [SQL Database Federations Tutorial - DBA][].

##Consider other forms of storage

Remember that Windows Azure supports multiple forms of data storage, including table storage and blob storage. If you do not require relational features, table or blob storage can be more economical. 

[Federations in SQL Database]: http://msdn.microsoft.com/en-us/library/windowsazure/hh597452.aspx
[SQL Database Federations Tutorial - DBA]: http://msdn.microsoft.com/en-us/library/windowsazure/hh778416.aspx