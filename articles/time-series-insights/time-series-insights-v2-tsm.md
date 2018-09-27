---
title: Explore data using the Azure Time Series Insights explorer | Microsoft Docs
description: This article describes how to use the Azure Time Series Insights explorer in your web browser to quickly see a global view of your big data and validate your IoT environment.
ms.service: time-series-insights
services: time-series-insights
author: ashannon7
ms.author: anshan
manager: cshankar
ms.reviewer: v-mamcge, jasonh, kfile, anshan
ms.devlang: csharp
ms.workload: big-data
ms.topic: conceptual
ms.date: 09/18/2018
---

# Time Series Model

## Overview

Time Series Model (TSM), makes it easier to find and analyze IoT data. TSM enables curation, maintenance, and enrichment of time series data to help establishing consumer-ready data sets. They play a vital role in queries and navigations as they contextualize device and non-device entities. Data persisted in models power time series queries computations by leveraging the formulas stored in them.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;![Time Series Model](media/v2/data_model.png)

## Terminology
* Event is the single timestamp + properties + values on the wire as persisted in TSI.​
* Time Series is an array of rows, where each row has a timestamp and multiple values. ts is abbreviation used in JSON and APIs.​
* Time Series Instance is a group of events that has the same Time Series ID (tsId). Time Series ID is unique key within event stream and within the model.​
* Time Series Instance has a required Time Series Type that is persisted in Time Series Model (TSM).​
* Time Series Type defines variables using Time Series Query (TSQ). Variables are named calculations over values from the events. Calculations can be aggregations, interpolations and scalar calculations.​
* In addition to persisting calculations of variables in TSM, TSQ can be used ad-hoc to perform calculations and return values without persisting calculations in the TSM.​
* Time Series Expressions (TSX) is a string-based expression language with strong typing (unlike predicate string). Type specification is required, e.g. p1.Double. In JSON, TSX is a string value of tsx property.​
* Time Series Variable is a name associated with a value of one of TSI types. Variable definitions also contain formulas and computation rules. Variable definitions can be stored in types in TSM, as well as provided ad-hoc on TSQ APIs.​
* Most APIs operate on and return Time Series Value (TSV) data structure:​

## Key Capabilities

With a goal to make it simple and effortless to manage time series contextualization, Time Series Model enables below capabilities in TSI: 

1. Author and Manage computation formulas to transform the data leveraging scalar functions, aggregate operations, etc.  
2. Define parent child relationships to enable navigation and reference to provide context to time series telemetry 
3. Storage Control Flags for storage policies and routing rules (Still Developing)  
4. Access Control Flags for role-based access control (Still Developing) 

## Key Components
There are five major components of TSM: 

1. Time Series Types
2. Time Series Hierarchies
3. Time Series Instances
4. Storage Policies
5. RBAC Policies

## Time Series Types
*Types* enable defining variables/formulas for doing computations, they are associated with a given instances.  A Type can have one or more variables. For example, an Instance might be of Type “Temperature Sensor” and consists of variables avg temperature, min temperature, and max temperature. By default, *Types* will be a variable count of the events

## Time Series Hierarchies
*Hierarchies* are the systematic organizations of your data. *Hierarchies* depict the relationships between different entities in your data.  You might have a single or multiple Hierarchies.  Additionally, these need not be a current part of your data, but each Instance should map to a *Hierarchy*.

## Time Series Instances
*Instances* are the time series themselves. In most cases these will be the DeviceID or AssetID which is a unique identifier of the asset in the environment. *Instances* have descriptive information associated with them called Instance properties. At a minimum, Instance properties include Hierarchy information, but also could include useful, descriptive data like the manufacturer, operator, or last service date 
Each *Instance* maps to only one *Types*, and one or more *Hierarchies*.

## Storage Policies 
Still Developing

## RBAC Policies
Still Developing

## Time Series Model

*Input*
![Time Series Model](media/v2/time-series-get-model.png)

*Output*
![Time Series Model](media/v2/time-series-model-out1.png)

## Time Series Types 
Types define variables or formulas associated with a given Time Series Instance, they are defined by name, description, and one or more variables definitions. By default, variables define the count of the events. 

Variables are named calculations over values from the events, their definition contain formula/computation rules and include kind, value, filter, reduction and boundaries defined. They are stored in TSM, also can be provided inline via Query APIs. Variables can be Numeric (continuous), Categorical (discrete), and Derived (from one of the above types). 

Variable reduction kind be by aggregating recorded data from source, or reconstructing signals using interpolation and aggregating, or reconstructing signal using interpolation and sampling. Variable boundaries can be added to interpolation, these allow calculations to include events outside of search span. 

*Input*
![Time Series Model](media/v2/time-series-get-type1.png)

*Output*
![Time Series Model](media/v2/time-series-type-out1.png)

*Input*
![Time Series Model](media/v2/time-series-get-type2.png)

*Output*
![Time Series Model](media/v2/time-series-type-out2.png)

###Variables Matrix

![Time Series Types](media/v2/time-series-variables-matrix.png)

### Variable Reductions 
Process of converting a set of values to a value per interval is called Reduction. Currently we support following Reduction types.

**Aggregate Recorded**
*AggregateRecorded* is a process of taking a set of values within each interval and aggregating them into one value. An example is calculating count of events per interval or calculating average value of all the values within each interval.

![Time Series Reduction](media/v2/time-series-reduction-aggrec.png)

### Aggregate Interpolated (Coming Soon) 

*AggregateInterpolated* is a process of reconstructing the signals/values using interpolation and then performing time-weighted aggregations. Currently we support step or linear interpolation, aggregate functions include Time-weighted Sum, Time-weighted Min, Time-weighted Max and Time-weighted Avg. An example is computing for time-weighted sum which is the area under the resulting interpolated curve. 

![Time Series Reduction](media/v2/time-series-reduction-aggint.png)

### Sample Interpolated (Coming Soon)
 
*SampleInterpolated* is a process of reconstructing the signals/values using interpolation and then returning Y-value of interpolated function at a fixed set of timestamp values on X-axis according to the interval. Currently we support step or linear interpolation. An example can be TBD

![Time Series Reduction](media/v2/time-series-reduction-samint.png)

## Time Series Hierarchies

*Hierarchies* are systematic organizations of data and show relationships between entities. Hierarchies organize instances by specifying property names and their relationships. 

Hierarchies are defined by HierarchyID, Name and Source. Hierarchies have paths, a path is top-down parent-child order of the hierarchy the user wants to create. The parent/children properties map instance fields.  A time series instance can map to a have single or multiple hierarchies. 

*Input*
![Time Series Hierarchy](media/v2/time-series-get-hierarchy1.png)

*Output*
![Time Series Hierarchy](media/v2/time-series-hierarchy-out1.png)

*Input*
![Time Series Hierarchy](media/v2/time-series-get-hierarchy2.png)

*Output*
![Time Series Hierarchy](media/v2/time-series-hierarchy-out2.png)

*Instance* describes a time series, for the most scenarios these are the DeviceIDs and are unique identifiers of the assets. Instance help defining Instance properties, and associate types and hierarchies. 

Instances are defined by *timeSeriesID*, *typeID*, *hierarchyID*, and *instanceFields*. Each instance will map to one type and one or more hierarchies. Instance inherits all properties from hierarchy, while additional instance fields can be added for describing. 

*InstanceFields* are properties of an instance and are any static data that defines an instance. They define values of hierarchy or non-hierarchy properties while supporting index to perform search operations

## Time Series Instances
*Instance* describes a time series, for the most scenarios these are the DeviceIDs and are unique identifiers of the assets. Instance help defining Instance properties, and associate types and hierarchies. 

Instances are defined by *timeSeriesID*, *typeID*, *hierarchyID*, and *instanceFields*. Each instance will map to one type and one or more hierarchies. Instance inherits all properties from hierarchy, while additional instance fields can be added for describing. 

*InstanceFields* are properties of an instance and are any static data that defines an instance. They define values of hierarchy or non-hierarchy properties while supporting index to perform search operations

*Input*
![Time Series Instance](media/v2/time-series-get-instance1.png)

*Output*
![Time Series Instance](media/v2/time-series-instance-out1.png)


## Time Series Model Tutorial
To Be updated

## V2 Private Preview Documents
* [Private Preview Explorer](https://review.docs.microsoft.com/en-us/azure/time-series-insights/time-series-insights-v2-explorer?branch=pr-en-us-53512)
* [Private Preview Storage and ingress](https://review.docs.microsoft.com/en-us/azure/time-series-insights/time-series-insights-v2-storage-ingress?branch=pr-en-us-53512)
* [Private Preview TSM](https://review.docs.microsoft.com/en-us/azure/time-series-insights/time-series-insights-v2-tsm?branch=pr-en-us-53512)
* [Private Preview TSQ](https://review.docs.microsoft.com/en-us/azure/time-series-insights/time-series-insights-v2-tsq?branch=pr-en-us-53512)
* [Private Preview TSI Javascript SDK](https://review.docs.microsoft.com/en-us/azure/time-series-insights/time-series-insights-v2-sdk?branch=pr-en-us-53512)