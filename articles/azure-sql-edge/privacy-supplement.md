---
title: Azure SQL Edge (Preview) privacy supplement 
description: Learn about Internet-enabled features in Azure SQL Edge that can collect and send anonymous feature usage and diagnostic data to Microsoft.
services: sql-edge
ms.service: sql-edge
ms.topic: conceptual
author: SQLSourabh
ms.author: sourabha
ms.reviewer: sstein
ms.date: 07/30/2020
---
# Azure SQL Edge privacy supplement

This article summarizes Internet-enabled features that can collect and send anonymous feature usage and diagnostic data to Microsoft. Azure SQL Edge may collect standard computer information and data about usage and performance may be transmitted to Microsoft and analyzed for purposes of improving the quality, security, and reliability of the product. This article serves as an addendum to the overall [Microsoft Privacy Statement](https://go.microsoft.com/fwlink/?LinkId=521839). The data classification in this article only applies to Azure SQL Edge. It does not apply to the items:

- Azure SQL Family of products
- SQL Server
- [SQL Server  Management Studio (SSMS)](https://docs.microsoft.com/sql/ssms/sql-server-management-studio-telemetry-ssms)
- SQL Server Data Tools (SSDT)
- Azure Data Studio
- Database Migration Assistant
- SQL Server Migration Assistant
- MS-SQL Extension

Definition of *Permitted usage Scenarios*. For the context of this article, Microsoft defines "Permitted Usages Scenarios" as actions or activities that are initiated by Microsoft.

## Access control

Credential-related information used to secure logins, users, or accounts within an Azure SQL Edge installation.

### Examples of access control

- Passwords
- Certificates

### Permitted usage scenarios

|Scenario |Access restrictions |Retention requirements |
|---------|---------|---------|
|These credentials never leave the user machine via Usage and Diagnostics Data. |- |- |
|Crash Dumps may contain Access Control Data. |- |Crash Dumps: Maximum 30 days. |
|These credentials never leave the user machine via User Feedback unless customer injects it manually |Limit to Microsoft internal use with no third-party access. |User Feedback: Max 1 year|
|&nbsp;|&nbsp;|&nbsp;|

## Customer content

Customer content is defined as data stored within user tables, directly or indirectly. The data includes statistics or user literals within query texts that might be stored within user tables.

### Examples of customer content

- Data values stored within the rows of any user table.
- Statistics objects containing copies of values within the rows of any user table.
- Query texts containing literal values.

### Permitted usage scenarios

|Scenario  |Access restrictions  |Retention requirements |
|---------|---------|---------|
|This data does not leave the user machine via Usage and Diagnostics Data. |- |- |
|Crash Dumps may contain Customer Content and be emitted to Microsoft. |- |Crash Dumps: Max 30 days. |
|Customers with their consent can send User Feedback that contains Customer Content to Microsoft. |Limit to Microsoft internal with no third-party access. Microsoft can expose the data to the original customer. |User Feedback: Max 1 year |

## End-user identifiable information (EUII)

Data received from a user, or generated from their use of the product.
- Linkable to an individual user.
- Does not contain content.

### Examples of end-user identifiable information

- Interface Identification. The Full IP address
- Machine Name
- Login/User names
- Local-part of e-mail address (joe@contoso.com)
- Location Information
- Customer Identification

### Permitted usage scenarios

|Scenario  |Access restrictions  |Retention requirements|
|---------|---------|---------|
|This data does not leave the user machine via Usage and Diagnostics Data. |- |- |
|Crash dumps may contain EUII and be emitted to Microsoft. |- |Crash dumps: Max 30 days |
|Customer identification ID may be emitted to Microsoft to deliver new hybrid and cloud features that the users have subscribed to. |- |Currently no such hybrid or cloud features exist.|
|Customers with their consent can send User Feedback that contains customer content to Microsoft.|Limit to Microsoft internal use with no third-party access. Microsoft can expose the data to the original customer. |User feedback: Max 1 year |

## Internet-based services data

Data needed to provide Internet-based services, per the Azure SQL Edge EULA.

### Examples of Internet-based services data

- Computer specification information
- Azure SQL Edge build number
- Language code
- An IP address with certain octets removed
- Map data

### Permitted usage scenarios

|Scenario  |Access restrictions  |Retention requirements|
|---------|---------|---------|
|May be used by Microsoft to improve features and/or fix bugs in current features. |Limit to Microsoft internal use with no third-party access. Microsoft can expose the data to the original customer.  For example, dashboards |Min 90 days - Max 3 years |
|Customers with their consent can send User Feedback that contains Customer Content to Microsoft. |Limit to Microsoft internal use with no third-party access. |Customers with their consent can send User Feedback that contains Customer Content to Microsoft. |
|Power View and SQL Reporting Services Map Item(s) may send data for use of Bing Maps. |Limit to session data |- |

## Organization identifiable information (OII)

Data received from an organization, or generated from their use of the product.

- Linkable to an organization.
- Does not contain content.

### Examples of organization identifiable information

- Organization Name (example: Microsoft Corp.)

### Permitted usage scenarios

|Scenario  |Access Restrictions  |Retention Requirements|
|---------|---------|---------|
| Microsoft may collect generic usage data of Azure SQL Edge instances running in Azure Virtual Machines for the express purpose of giving customers optional benefits within Azure for using Azure SQL Edge within Azure Virtual Machines. | Microsoft can expose data to the customer, such as through the Azure portal, to help customers running Azure SQL Edge in Azure Virtual Machines to access benefits specific to running Azure SQL Edge in Azure. | Min 90 days - Max 3 years |

## System metadata

Data generated in the course of running the Azure SQL Edge.  The data does not contain customer content.

### Examples of system metadata

The following are considered system metadata when they do not include customer content, object metadata, customer access control data, or EUII:

- Database GUID
- Hash of docker host name or the Azure SQL Edge container host name
- Application name
- Behavioral/usage data
- SQL Customer Experience improvement program data  (SQLCEIP)
- Server configuration data, for example settings of sp_configure
- Feature configuration data
- Event names and error codes
- Hardware settings and identification such as OEM Manufacturer

Microsoft does examine application name values set by other programs that use Azure SQL Edge. Customers should not place personal data, such as end-user identifiable information, in System Metadata fields or create applications designed to store personal data in these fields.

### Permitted usage scenarios

|Scenario  |Access Restrictions  |Retention Requirements|
|---------|---------|---------|
|May be used by Microsoft to improve features and or fix bugs in current features.|Limit to Microsoft internal use with no third-party access. |Min 90 days - Max 3 years |
|May be used to make suggestions to the customer.  For example, "Based on your usage of the product, consider using feature *X* since it would perform better." |Microsoft can expose the data to the original customer, for example through dashboards. |Customer Data Security Logs: Min 3 years - Max 6 years |
|May be used by Microsoft for future product planning. |Microsoft may share this information with other hardware and software vendors to improve how their products run with Microsoft software. |Min 90 days - Max 3 years|
|May be used by Microsoft to provide cloud-based services based on emitted Usage and Diagnostics Data. For example, a customer dashboard showing feature usage across all Azure SQL Edge installations in an organization. |Microsoft can expose the data to the original customer, for example, through dashboards. |Min 90 days - Max 3 years |
|Customers with their consent can send User Feedback that contains Customer Content to Microsoft. |Limit to Microsoft internal with no third-party access. Microsoft can expose the data to the original customer. |User Feedback: Max 1 year |
|May use database name and application name to categorize databases and applications into known categories, for example, those that may be running software provided by Microsoft or other companies.|Limit to Microsoft internal with no third-party access.|Min 90 days - Max 3 years |

## Object metadata

Data that describes or is used to configure servers, databases, tables, and other resources.  Object metadata includes database table and column names but not the contents of database rows or other Customer Content. Customers should not place personal data, such as end-user identifiable information in Object Metadata fields or create applications designed to store personal data in these fields. For the permitted usage scenario's below, only hash form is used to determine usage patterns to improve the product.

### Examples of object metadata

- Azure SQL Edge database names
- Table names and column names
- Statistics names

### Permitted usage scenarios

> [!NOTE]
> All object metadata values are hashed before collection.
>

|Scenario  |Access restrictions  |Retention requirements|
|---------|---------|---------|
|May be used by Microsoft to improve features and or fix bugs in current features. |Limited to Microsoft internal use with no third-party access. |Min 90 days - Max 3 years|

## Telemetry controls

For instructions on how telemetry can be turned on or off, see [Azure SQL Edge usage and diagnostics data collection](usage-and-diagnostics-data-configuration.md).

## Next steps

- [Usage and diagnostics data configuration](usage-and-diagnostics-data-configuration.md)
- [Build an end-to-end IoT solution with SQL Edge](tutorial-deploy-azure-resources.md)