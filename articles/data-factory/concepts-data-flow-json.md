---
title: Azure Data Factory Mapping Data Flow JSON concepts
description: Data Factory Mapping Data Flow has built-in capabilities for handling JSON documents with hierarchies
author: kromerm
ms.author: makromer
ms.service: data-factory
ms.topic: conceptual
ms.date: 08/30/2019
---

# Mapping Data Flow JSON handling

[!INCLUDE [notes](../../includes/data-factory-data-flow-preview.md)]

## Creating JSON structures in expression editor
### Derived column transformation
Adding a complex column to your data flow is easier through the derived column expression editor. After adding a new column and opening the editor, there are two options: enter the JSON structure manually or use the UI to add subcolumns interactively.

#### Interactive UI JSON design
From the output schema side pane, new subcolumns can be added using the `+` menu:
![Add subcolumn](media/data-flow/addsubcolumn.png "Add Subcolumn")

From there, new columns and subcolumns can be added in the same way. For each non-complex field, an expression can be added in the expression editor to the right.

![Complex column](media/data-flow/complexcolumn.png "Complex column")

#### Manual JSON design
To manually add a JSON structure, add a new column and enter the expression in the editor. The expression follows the following general format:
```
@(
	field1=0,
	field2=@(
		field1=0
	)
)
```
If this expression were entered for a column named "complexColumn" then it would be written to the sink as the following JSON:
```
{
	"complexColumn": {
		"field1": 0,
		"field2": {
			"field1": 0
		}
	}
}
```

#### Sample manual DSL
```
@(
	title=Title,
	firstName=FirstName,
	middleName=MiddleName,
	lastName=LastName,
	suffix=Suffix,
	contactDetails=@(
		email=EmailAddress,
		phone=Phone
	),
	address=@(
		line1=AddressLine1,
		line2=AddressLine2,
		city=City,
		state=StateProvince,
		country=CountryRegion,
		postCode=PostalCode
	),
	ids=[
		toString(CustomerID), toString(AddressID), rowguid
	]
)
```

## Source format options
### Default
```
{ "json": "record 1" }
{ "json": "record 2" }
{ "json": "record 3" }
```

### Single document
* Option one
```
[
    {
        "json": "record 1"
    },
    {
        "json": "record 2"
    },
    {
        "json": "record 3"
    }
]
```

* Option two
```
File1.json
{
    "json": "record 1"
}
File2.json
{
    "json": "record 2"
}
File3.json
{
    "json": "record 3"
}
```

### Unquoted column names
```
{ json: "record 1" }
{ json: "record 2" }
{ json: "record 3" }
```

### Has comments
```
{ "json": /** comment **/ "record 1" }
{ "json": "record 2" }
{ /** comment **/ "json": "record 3" }
```

### Single quoted
```
{ 'json': 'record 1' }
{ 'json': 'record 2' }
{ 'json': 'record 3' }
```

### Backslash escaped
```
{ "json": "record 1" }
{ "json": "\} \" \' \\ \n \\n record 2" }
{ "json": "record 3" }
```

# Higher order functions
## filter
Filters elements out of the array that do not meet the provided predicate. Filter expects a reference to one element in the predicate function as #item.

### Examples
```
filter([1, 2, 3, 4], #item > 2) => [3, 4]
filter(['a', 'b', 'c', 'd'], #item == 'a' || #item == 'b') => ['a', 'b']
```

## map
Maps each element of the array to a new element using the provided expression. Map expects a reference to one element in the expression function as #item.

### Examples
```
map([1, 2, 3, 4], #item + 2) => [3, 4, 5, 6]
map(['a', 'b', 'c', 'd'], #item + '_processed') => ['a_processed', 'b_processed', 'c_processed', 'd_processed']
```

## reduce
Accumulates elements in an array. Reduce expects a reference to an accumulator and one element in the first expression function as #acc and #item and it expects the resulting value as #result to be used in the second expression function.

### Examples
```
reduce([1, 2, 3, 4], 0, #acc + #item, #result) => 10
reduce(['1', '2', '3', '4'], '0', #acc + #item, #result) => '01234'
reduce([1, 2, 3, 4], 0, #acc + #item, #result + 15) => 25
```

## sort
Sorts the array using the provided predicate function. Sort expects a reference to two consecutive elements in the expression function as #item1 and #item2.

### Examples
```
sort([4, 8, 2, 3], compare(#item1, #item2)) => [2, 3, 4, 8]
sort(['a3', 'b2', 'c1'],
        iif(right(#item1, 1) >= right(#item2, 1), 1, -1)) => ['c1', 'b2', 'a3']
sort(['a3', 'b2', 'c1'],
        iif(#item1 >= #item2, 1, -1)) => ['a3', 'b2', 'c1']
```

## contains
Returns true if any element in the provided array evaluates as true in the provided predicate. Contains expects a reference to one element in the predicate function as #item.

### Examples
```
contains([1, 2, 3, 4], #item == 3) => true
contains([1, 2, 3, 4], #item > 5) => false
```

## Next steps

* [Use the Derived Column transformation to build your hierarchical structures](data-flow-derived-column.md)
