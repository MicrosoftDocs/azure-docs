---
title: Azure SQL Database Multi-model capabilities | Microsoft Docs
description: Azure SQL Database enables you to work with multiple data models in the same database.
services: sql-database
ms.service: sql-database
ms.subservice: development
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: jovanpop-msft
ms.author: jovanpop
ms.reviewer:
manager: craigg
ms.date: 12/17/2018
---
# Multi-model capabilities of Azure SQL Database

Multi-model databases enable you to store and work with data represented in multiple data formats such as relational data, graphs, JSON/XML documents, key-value pairs, etc.

## When to use multi-model capabilities

Azure SQL Database is designed to work with the relational model that provides the best performance in the most of the cases for a variety of general-purpose applications. However, Azure SQL Database is not limited to relational-data only. Azure SQL Database enables you to use a variety of non-relational formats that are tightly integrated into the relational model.
You should consider using multi-model capabilities of Azure SQL Database in the following cases:
- You have some information or structures that are better fit for NoSQL models and you don't want to use separate NoSQL database.
- A majority of your data is suitable for relational model, and you need to model some parts of your data in NoSQL style.
- You want to leverage rich Transact-SQL language to query and analyze both relational and NoSQL data, and integrate it with a variety of tools and applications that can use SQL language.
- You want to apply database features such as [in-memory technologies](sql-database-in-memory.md) to improve performance of your analytic or processing of your NoSQL data strucutres, use [transactional replication](sql-database-managed-instance-transactional-replication.md) or [readable replicas](sql-database-read-scale-out.md) to create copy of your data on the other place and offload soem analytic workloads from the primary database.

## Overview

Azure SQL provides the following multi-model features:
- [Graph features](#graph-features) enable you to represent your data as set of nodes and edges, and use standard Transact-SQL queries enhanced with graph `MATCH` operator to query the graph data.
- [JSON features](#json-features) enable you to put JSON documents in tables, transform relational data to JSON documents and vice versa. You can use the standard Transact-SQL language enhanced with JSON functions for parsing documents, and use non clustered indexes, columnstore indexes, or memory-optimized tables, to optimize your queries.
- [Spatial features](#spatial-features) enables you to store geographical and geometrical data, index them using the spatial indexes, and retrieve the data using spatial queries.
- [XML features](#xml-features) enable you to store and index XML data in your database and use native XQuery/XPath operations to work with XML data. Azure SQL database has specialized built-in XML query engine that process XML data.
- [Key-value pairs](#key-value-pairs) are not explicitly supported as special features since key-value paris can be natively modeled as two-column tables.

  > [!Note]
  > You can use JSON Path expression, XQuery/XPath expressions, spatial functions, and graph-query expressions in the same Transact-SQL query to access any data that you stored in the database. Also, any tool or programming language that can execute Transact-SQL queries, can also use that query interface to access multi-model data. This is the key difference compared to the multi-model databases such as [Azure Cosmos DB](/azure/cosmos-db/) that provides specialized API for different data models.

In the following sections, you can learn about the most important multi-model capabilities of Azures SQL Database.

## Graph features

Azure SQL Database offers graph database capabilities to model many-to-many relationships in database. A graph is a collection of nodes (or vertices) and edges (or relationships). A node represents an entity (for example, a person or an organization) and an edge represents a relationship between the two nodes that it connects (for example, likes or friends). Here are some features that make a graph database unique:
- Edges or relationships are first class entities in a Graph Database and can have attributes or properties associated with them.
- A single edge can flexibly connect multiple nodes in a Graph Database.
- You can express pattern matching and multi-hop navigation queries easily.
- You can express transitive closure and polymorphic queries easily.

The graph relationships and graph query capabilities are integrated into Transact-SQL and receive the benefits of using SQL Server as the foundational database management system.
[Graph processing](https://docs.microsoft.com/sql/relational-databases/graphs/sql-graph-overview) is the core SQL Server Database Engine feature, so you can find more info about the Graph processing there.

### When to use a graph capability

There is nothing a graph database can achieve, which cannot be achieved using a relational database. However, a graph database can make it easier to express certain queries. Your decision to choose one over the other can be based on following factors:

- Model hierarchical data where one node can have multiple parents, so HierarchyId cannot be used
- Model has Your application has complex many-to-many relationships; as application evolves, new relationships are added.
- You need to analyze interconnected data and relationships.

## JSON features

Azure SQL Database lets you parse and query data represented in JavaScript Object Notation [(JSON)](https://www.json.org/) format, and export your relational data as JSON text.

JSON is a popular data format used for exchanging data in modern web and mobile applications. JSON is also used for storing semi-structured data in log files or in NoSQL databases like [Azure Cosmos DB](https://azure.microsoft.com/services/cosmos-db/). Many REST web services return results formatted as JSON text or accept data formatted as JSON. Most Azure services such as [Azure Search](https://azure.microsoft.com/services/search/), [Azure Storage](https://azure.microsoft.com/services/storage/), and [Azure Cosmos DB](https://azure.microsoft.com/services/cosmos-db/) have REST endpoints that return or consume JSON.

Azure SQL Database lets you work with JSON data easily and integrate your database with modern services. Azure SQL Database provides the following functions for working with JSON data:

![JSON Functions](./media/sql-database-json-features/image_1.png)

If you have JSON text, you can extract data from JSON or verify that JSON is properly formatted by using the built-in functions [JSON_VALUE](https://msdn.microsoft.com/library/dn921898.aspx), [JSON_QUERY](https://msdn.microsoft.com/library/dn921884.aspx), and [ISJSON](https://msdn.microsoft.com/library/dn921896.aspx). The [JSON_MODIFY](https://msdn.microsoft.com/library/dn921892.aspx) function lets you update value inside JSON text. For more advanced querying and analysis, [OPENJSON](https://msdn.microsoft.com/library/dn921885.aspx) function can transform an array of JSON objects into a set of rows. Any SQL query can be executed on the returned result set. Finally, there is a [FOR JSON](https://msdn.microsoft.com/library/dn921882.aspx) clause that lets you format data stored in your relational tables as JSON text.

For more information, see [How to work with JSON data in azure SQL Database](sql-database-json-features.md).
[JSON](https://docs.microsoft.com/sql/relational-databases/json/json-data-sql-server) is core SQL Server Database Engine feature, so you can find more info about the JSON feature there.

### When to use a JSON capability

Document models can be used instead of the relational models in some specific scenarios:
- High-normalization of schema doesn't bring significant benefits because you access the all fields of objects at once, or you never update normalized parts of the objects. However, the normalized model increases the complexity of your queries due to the large number of tables that you need to join to get the data.
- You are working with the applications that natively use JSON documents are communication or data models, and you don't want to introduce additional layers that transforms relational data to JSON and vice versa.
- You need to simplify your data model by de-normalizing child tables or Entity-Object-Value patterns.
- You need to load or export data stored in JSON format without some additional tool that parses the data.

## Spatial features

Spatial data represents information about the physical location and shape of geometric objects. These objects can be point locations or more complex objects such as countries/regions, roads, or lakes.

Azure SQL Database supports two spatial data types - the geometry data type and the geography data type.
- The geometry type represents data in a Euclidean (flat) coordinate system.
- The geography type represents data in a round-earth coordinate system.

There is a number of Spatial objects that can be used in Azure SQL database such as [Point](https://docs.microsoft.com/sql/relational-databases/spatial/point), [LineString](https://docs.microsoft.com/sql/relational-databases/spatial/linestring),
[Polygon](https://docs.microsoft.com/sql/relational-databases/spatial/polygon), etc.

Azure SQL Database also provides specialized [Spatial indexes](https://docs.microsoft.com/sql/relational-databases/spatial/spatial-indexes-overview) that can be used to improve performance of your spatial queries.

[Spatial support](https://docs.microsoft.com/sql/relational-databases/spatial/spatial-data-sql-server) is core SQL Server Database Engine feature, so you can find more info about the spatial feature there.

## XML features

SQL Server provides a powerful platform for developing rich applications for semi-structured data management. Support for XML is integrated into all the components in SQL Server and includes the following:

- The xml data type. XML values can be stored natively in an xml data type column that can be typed according to a collection of XML schemas, or left untyped. You can index the XML column.
- The ability to specify an XQuery query against XML data stored in columns and variables of the xml type. XQuery functionalities can be used in any Transact-SQL query that access any data model that you use in your database.
- Automatically index all elements in XML documents using [primary XML index](https://docs.microsoft.com/sql/relational-databases/xml/xml-indexes-sql-server#primary-xml-index) or specify the exact paths that should be indexed using [secondary XML index](https://docs.microsoft.com/sql/relational-databases/xml/xml-indexes-sql-server#secondary-xml-indexes).
- OPENROWSET that allows bulk loading of XML data.
- Transform relational data to XML format.

[XML](https://docs.microsoft.com/sql/relational-databases/xml/xml-data-sql-server) is core SQL Server Database Engine feature, so you can find more info about the XML feature there.

### When to use an XML capability

Document models can be used instead of the relational models in some specific scenarios:
- High-normalization of schema doesn't bring significant benefits because you access the all fields of objects at once, or you never update normalized parts of the objects. However, the normalized model increases the complexity of your queries due to the large number of tables that you need to join to get the data.
- You are working with the applications that natively use XML documents are communication or data models, and you don't want to introduce additional layers that transforms relational data to XML and vice versa.
- You need to simplify your data model by de-normalizing child tables or Entity-Object-Value patterns.
- You need to load or export data stored in XML format without some additional tool that parses the data.

## Key-value pairs

Azure SQL Database don't have specialized types or structures that support key-value pairs since key-value structures can be natively represented as standard relational tables:

```sql
CREATE TABLE Collection (
  Id int identity primary key,
  Data nvarchar(max)
)
```

You can customize this key-value structure to fit your needs without any constraints. As an example, the value can be XML document instead of `nvarchar(max)` type, if the value is JSON document, you can put `CHECK` constraint that verifies the validity of JSON content. You can put any number of values related to one key in the additional columns, add computed columns and indexes to simplify and optimize data access, define the table as memory/optimized schema-only table to get better performance, etc.

See [how BWin is using In-Memory OLTP to achieve unprecedented performance and scale](https://blogs.msdn.microsoft.com/sqlcat/20../../how-bwin-is-using-sql-server-2016-in-memory-oltp-to-achieve-unprecedented-performance-and-scale/) for their ASP.NET caching solution that achieved 1.200.000 batches per seconds, as an example how relational model can be effectively used as key-value pair solution in practice.

## Next steps
Multi-model capabilities in Azure SQL Databases are also the core SQL Server Database Engine features that are shared between Azure SQL Database and SQL Server. To learn more details about these features, visit the SQL Relational database documentation pages:

* [Graph processing](https://docs.microsoft.com/sql/relational-databases/graphs/sql-graph-overview)
* [JSON data](https://docs.microsoft.com/sql/relational-databases/json/json-data-sql-server)
* [Spatial support](https://docs.microsoft.com/sql/relational-databases/spatial/spatial-data-sql-server)
* [XML data](https://docs.microsoft.com/sql/relational-databases/xml/xml-data-sql-server)
