---
title: Connecting to a database with Azure Static Web Apps
description: Learn about the database connection features of Azure Static Web Apps
author: craigshoemaker
ms.author: cshoe
ms.service: static-web-apps
ms.topic: conceptual
ms.date: 01/23/23
---

# Connecting to a database with Azure Static Web Apps (preview)

 Access your database without writing custom server-side code.

`/data-api` endpoint
supports REST or GraphQL

Integrated security
Secured connections to your database

out-of-the-box CRUD access to your database

Serverless

[Azure Data API Builder](https://github.com/Azure/data-api-builder)

[configuration file](https://github.com/Azure/data-api-builder/blob/main/docs/configuration-file.md)

## Use cases

Examples, not an exhaustive list of scenarios.

| Type | Description |
| Content management systems (CMS) |  |
| Marketing sites |  |
| Line-of-business applications |  |

## Supported databases

| Name | Details |
| CosmosDB for NoSQL |  |
|  |  |
|  |  |

### Connection authentication types

| Type | Description |
| Connection string | `env()` |
| System-assigned Managed Identity |  |
| User-assigned Managed Identity |  |

## Big picture

## Constraints

The database must be accessible by Azure's infrastructure. What is the IP address range/domain range to whitelist? Sajeetharan Sinnathurai
During public preview, the Database connections will scale from 0 to 1 worker. 


## Next steps

> [!div class="nextstepaction"]
> [Configure your database](database-configuration.md)