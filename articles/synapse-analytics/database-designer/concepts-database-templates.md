---
title: Azure Synapse database templates concepts
description: Learn more about the database templates within Azure Synapse
author: gsaurer
ms.author: gesaur
ms.service: synapse-analytics
ms.subservice: database-editor
ms.topic: conceptual
ms.date: 11/02/2021
ms.custom: template-concept, ignite-fall-2021
---

# Lake database templates

Azure Synapse Analytics provides standardized database templates for various industries to readily use and create a database model per organization needs. These templates contain rich metadata for building understanding of a data model. Use these templates to create your lake database and use Azure Synapse analytical runtime to provide insights to business users.

Learn concepts related to lake database templates in Azure Synapse. Use these templates to create a database with rich metadata for better understanding and productivity.  

## Business area templates  

Business area templates provide the most comprehensive and granular view of data for a business or subject area. Business area models are also referred to as Subject Area or domain templates. Business area templates contain tables and columns relevant to a particular business within an industry. Data stewards, data governance team, and business teams within an organization can use the business area templates to build business-centric data schema that facilitate detailed communication of business requirements and scope. Each business area template is constructed from a common set of entities from the corresponding industry enterprise database template to ensure that business area templates will have common keys, attributes, and definitions consistent with other industry models. For example, Accounting & Financial Reporting, Marketing, Budget & Forecasting are business area templates for many industries such as Retail, or Banking. 

![Business area templates example](./media/concepts-database-templates/business-area-template-example.png)

## Enterprise templates 

Enterprise database templates contain a subset of tables that are most likely to be of interest to an organization within a specific industry. It provides a high-level overview and describes the connectivity between the related business area templates. These templates serve as an accelerator for many types of large projects. For example, the banking template has one enterprise template called "Banking". 

![Enterprise template example](./media/concepts-database-templates/enterprise-template-example.png)

## Table

A table is an object with an independent existence that can be differentiated from other objects. For example, Customer, Store, Channel, and so on.

## Column

Each table is described by a set of columns. Each column has a name, description, data type and is associated with a table. There are around 30,000 columns in the database templates. For example, CustomerId is a column in the table Customer.

## Primary key

The primary key helps to uniquely identify the whole table. It must uniquely identify tuples in a table. For example, a key on the CustomerId column enforces uniqueness, to identify each customer in the table Customer.

## Foreign key

A foreign key is a column or a combination of columns whose values match a primary key in a different table. It helps to establish a link between two tables. For example, CustomerId in Transaction table represents a customer who has completed a transaction. A foreign key always has a relationship to a primary key, for example, to the CustomerId primary key in the Customer table.

## Composite key

A composite key is one that is composed of two or more columns that are together required to uniquely identify a record in a table. For example, in an Order table, both OrderNumber and ProductId may be required to uniquely identify a record.

## Relationships

Relations are associations or interactions between any two tables. For example, the tables Customer and CustomerEmail are related to each other. There are two tables involved in a relationship. There's a parent table and a child table, often connected by a foreign key. You might say that the relationship is From table To table.

## Table partitions

Lake database allows for the underlying data to be partitioned for a table for better performance. You can set partition configuration in the storage settings of a table in database editor.

## Next steps

Continue to explore the capabilities of the database designer using the links below.
- [Quick start](quick-start-create-lake-database.md)
- [Lake database Concept](concepts-lake-database.md)
