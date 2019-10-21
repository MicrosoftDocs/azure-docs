---
title: Join transformation in Azure Data Factory mapping data flow | Microsoft Docs
description: Combine data from two data sources using the join transformation in Azure Data Factory mapping data flow
author: kromerm
ms.author: makromer
ms.reviewer: daperlov
ms.service: data-factory
ms.topic: conceptual
ms.date: 10/17/2019
---

# Join transformation in mapping data flow

Use the join transformation to combine data from two sources or streams in a mapping data flow. The output stream will include all columns from both sources matched based on a join condition. 

## Join types

Mapping data flows currently supports five different join types.

### Inner Join

Inner join only outputs rows that have matching values both tables.

### Left Outer

Left outer join returns all rows from the left stream and matched records from the right stream. If a row from the left stream has no match, the output columns from the right stream are set to NULL. The output will be the rows returned by an inner join plus the unmatched rows from the left stream.

### Right Outer

Left outer join returns all rows from the right stream and matched records from the left stream. If a row from the right stream has no match, the output columns from the right stream are set to NULL. The output will be the rows returned by an inner join plus the unmatched rows from the right stream.

### Full Outer

Full outer join outputs all columns and rows from both sides with NULL values for columns aren't matched.

### Cross Join

Cross join outputs the cross product of the two streams based upon a condition. If you're using a condition that isn't equality, specify a custom expression as your cross join condition. The output stream will be all rows that meet the join condition. To create a cartesian product that outputs every row combination, specify `true()` as your join condition.

## Configuration

1. Choose which data stream you're joining with in the **Right stream** dropdown.
1. Select your **Join type**
1. Choose which key columns you want to match on for you join condition. By default, data flow looks for equality between one column in each stream. To compare via a computed value, hover over the column dropdown and select **Computed column**.

![Join Transformation](media/data-flow/join.png "Join")

## Optimizing join performance

Unlike merge join in tools like SSIS, the join transformation isn't a mandatory merge join operation. The join keys don't require sorting. The join operation occurs based on the optimal join operation in Spark, either broadcast or map-side join.

![Join Transformation optimize](media/data-flow/joinoptimize.png "Join Optimization")

If one or both of the data streams fit into worker node memory, further optimize your performance by enabling **Broadcast** in the optimize tab. You can also repartition your data on the join operation so that it fits better into memory per worker.

## Self-Join

To self-join a data stream with itself, alias an existing stream with a select transformation. Create a new branch by clicking on the plus icon next to a transformation and selecting **New branch**. Add a select transformation to alias the original stream. Add a join transformation and choose the original stream as the **Left stream** and the select transformation as the **Right stream**.

![Self-join](media/data-flow/selfjoin.png "Self-join")

## Testing join conditions

When testing the join transformations with data preview in debug mode, use a small set of known data. When sampling rows from a large dataset, you can't predict which rows and keys will be read for testing. The result is non-deterministic, meaning that your join conditions may not return any matches.

## Data flow script

### Syntax

```
<leftStream>, <rightStream>
    join(
        <conditionalExpression>,
        joinType: { 'inner'> | 'outer' | 'left_outer' | 'right_outer' | 'cross' }
        broadcast: { 'none' | 'left' | 'right' | 'both' }
    ) ~> <joinTransformationName>
```

### Inner join example

The below example is a join transformation named `JoinMatchedData` that takes left stream `TripData` and right stream `TripFare`.  The join condition is the expression `hack_license == { hack_license} && TripData@medallion == TripFare@medallion && vendor_id == { vendor_id} && pickup_datetime == { pickup_datetime}` that returns true if the `hack_license`, `medallion`, `vendor_id`, and `pickup_datetime` columns in each stream match. The `joinType` is `'inner'`. We're enabling broadcasting in only the left stream so `broadcast` has value `'left'`.

In the Data Factory UX, this transformation looks like the below image:

![Join example](media/data-flow/join-script1.png "Join example")

The data flow script for this transformation is in the snippet below:

```
TripData, TripFare
    join(
        hack_license == { hack_license}
    	&& TripData@medallion == TripFare@medallion
    	&& vendor_id == { vendor_id}
    	&& pickup_datetime == { pickup_datetime},
    	joinType:'inner',
    	broadcast: 'left'
    )~> JoinMatchedData
```

### Cross join example

The below example is a join transformation named `CartesianProduct` that takes left stream `TripData` and right stream `TripFare`. This transformation takes in two streams and returns a cartesian product of their rows. The join condition is `true()` because it outputs a full cartesian product. The `joinType` in `cross`. We're enabling broadcasting in only the left stream so `broadcast` has value `'left'`.

In the Data Factory UX, this transformation looks like the below image:

![Join example](media/data-flow/join-script2.png "Join example")

The data flow script for this transformation is in the snippet below:

```
TripData, TripFare
    join(
        true(),
	    joinType:'cross',
        broadcast: 'left'
    )~> CartesianProduct
```

## Next steps

After joining data, create a [derived column](data-flow-derived-column.md) and [sink](data-flow-sink.md) your data to a destination data store.
