---
title: Application development - Azure Database for MySQL
description: Introduces design considerations that a developer should follow when writing application code to connect to Azure Database for MySQL 
author: ajlam
ms.author: andrela
ms.service: mysql
ms.topic: conceptual
ms.date: 3/18/2020
---

# Application development overview for Azure Database for MySQL 
This article discusses design considerations that a developer should follow when writing application code to connect to Azure Database for MySQL. 

> [!TIP]
> For a tutorial showing you how to create a server, create a server-based firewall, view server properties, create database, and connect and query by using workbench and mysql.exe, see [Design your first Azure Database for MySQL database](tutorial-design-database-using-portal.md)

## Language and platform
There are code samples available for various programming languages and platforms. You can find links to the code samples at: 
[Connectivity libraries used to connect to Azure Database for MySQL](concepts-connection-libraries.md)

## Tools
Azure Database for MySQL uses the MySQL community version, compatible with MySQL common management tools such as Workbench or MySQL utilities such as mysql.exe, [phpMyAdmin](https://www.phpmyadmin.net/), [Navicat](https://www.navicat.com/products/navicat-for-mysql), and others. You can also use the Azure portal, Azure CLI, and REST APIs to interact with the database service.

## Resource limitations
Azure Database for MySQL manages the resources available to a server by using two different mechanisms: 
- Resources Governance.
- Enforcement of Limits.

## Security
Azure Database for MySQL provides resources for limiting access, protecting data, configuring users and roles, and monitoring activities on a MySQL database.

## Authentication
Azure Database for MySQL supports server authentication of users and logins.

## Resiliency
When a transient error occurs while connecting to a MySQL database, your code should retry the call. We recommend that the retry logic use back off logic so that it does not overwhelm the SQL database with multiple clients retrying simultaneously.

- Code samples: For code samples that illustrate retry logic, see samples for the language of your choice at: [Connectivity libraries used to connect to Azure Database for MySQL](concepts-connection-libraries.md)

## Managing connections
Database connections are a limited resource, so we recommend sensible use of connections when accessing your MySQL database to achieve better performance.
- Access the database by using connection pooling or persistent connections.
- Access the database by using short connection life span. 
- Use retry logic in your application at the point of the connection attempt to catch failures resulting from concurrent connections have reached the maximum allowed. In the retry logic, set a short delay, and then wait for a random time before the additional connection attempts.