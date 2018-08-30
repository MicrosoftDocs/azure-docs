---
title: Constructing filter strings for the table designer | Microsoft Docs
description: Constructing filter strings for the table designer
services: visual-studio-online
author: ghogen
manager: douge
assetId: a1a10ea1-687a-4ee1-a952-6b24c2fe1a22
ms.prod: visual-studio-dev15
ms.technology: vs-azure
ms.custom: vs-azure
ms.workload: azure-vs
ms.topic: conceptual
ms.date: 11/18/2016
ms.author: ghogen

---
# Constructing Filter Strings for the Table Designer
## Overview
To filter data in an Azure table that is displayed in the Visual Studio **Table Designer**, you construct a filter string and enter it into the filter field. The filter string syntax is defined by the WCF Data Services and is similar to a SQL WHERE clause, but is sent to the Table service via an HTTP request. The **Table Designer** handles the proper encoding for you, so to filter on a desired property value, you need only enter the property name, comparison operator, criteria value, and optionally, Boolean operator in the filter field. You do not need to include the $filter query option as you would if you were constructing a URL to query the table via the [Storage Services REST API Reference](http://go.microsoft.com/fwlink/p/?LinkId=400447).

The WCF Data Services are based on the [Open Data Protocol](http://go.microsoft.com/fwlink/p/?LinkId=214805) (OData). For details on the filter system query option (**$filter**), see the [OData URI Conventions specification](http://go.microsoft.com/fwlink/p/?LinkId=214806).

## Comparison Operators
The following logical operators are supported for all property types:

| Logical operator | Description | Example filter string |
| --- | --- | --- |
| eq |Equal |City eq 'Redmond' |
| gt |Greater than |Price gt 20 |
| ge |Greater than or equal to |Price ge 10 |
| lt |Less than |Price lt 20 |
| le |Less than or equal |Price le 100 |
| ne |Not equal |City ne 'London' |
| and |And |Price le 200 and Price gt 3.5 |
| or |Or |Price le 3.5 or Price gt 200 |
| not |Not |not isAvailable |

When constructing a filter string, the following rules are important:

* Use the logical operators to compare a property to a value. Note that it is not possible to compare a property to a dynamic value; one side of the expression must be a constant.
* All parts of the filter string are case-sensitive.
* The constant value must be of the same data type as the property in order for the filter to return valid results. For more information about supported property types, see [Understanding the Table Service Data Model](http://go.microsoft.com/fwlink/p/?LinkId=400448).

## Filtering on String Properties
When you filter on string properties, enclose the string constant in single quotation marks.

The following example filters on the **PartitionKey** and **RowKey** properties; additional non-key properties could also be added to the filter string:

    PartitionKey eq 'Partition1' and RowKey eq '00001'

You can enclose each filter expression in parentheses, although it is not required:

    (PartitionKey eq 'Partition1') and (RowKey eq '00001')

Note that the Table service does not support wildcard queries, and they are not supported in the Table Designer either. However, you can perform prefix matching by using comparison operators on the desired prefix. The following example returns entities with a LastName property beginning with the letter 'A':

    LastName ge 'A' and LastName lt 'B'

## Filtering on Numeric Properties
To filter on an integer or floating-point number, specify the number without quotation marks.

This example returns all entities with an Age property whose value is greater than 30:

    Age gt 30

This example returns all entities with an AmountDue property whose value is less than or equal to 100.25:

    AmountDue le 100.25

## Filtering on Boolean Properties
To filter on a Boolean value, specify **true** or **false** without quotation marks.

The following example returns all entities where the IsActive property is set to **true**:

    IsActive eq true

You can also write this filter expression without the logical operator. In the following example, the Table service will also return all entities where IsActive is **true**:

    IsActive

To return all entities where IsActive is false, you can use the not operator:

    not IsActive

## Filtering on DateTime Properties
To filter on a DateTime value, specify the **datetime** keyword, followed by the date/time constant in single quotation marks. The date/time constant must be in combined UTC format, as described in [Formatting DateTime Property Values](http://go.microsoft.com/fwlink/p/?LinkId=400449).

The following example returns entities where the CustomerSince property is equal to July 10, 2008:

    CustomerSince eq datetime'2008-07-10T00:00:00Z'
