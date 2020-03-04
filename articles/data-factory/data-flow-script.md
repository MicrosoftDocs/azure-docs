---
title: Mapping data flow script
description: Overview of Data Factory's data flow script code-behind language
author: kromerm
ms.author: nimoolen
ms.service: data-factory
ms.topic: conceptual
ms.custom: seo-lt-2019
ms.date: 11/10/2019
---

# Data flow script (DFS)

Data flow script (DFS) is the underlying metadata, similar to a coding language, that is used to execute the transformations that are included in a mapping data flow. Every transformation is represented by a series of properties that provide the necessary information to run the job properly. The script is visible and editable from ADF by clicking on the "script" button on the top ribbon of the browser UI.

![Script button](media/data-flow/scriptbutton.png "Script button")

For instance, `allowSchemaDrift: true,` in a source transformation tells the service to include all columns from the source dataset in the data flow even if they are not included in the schema projection.

## Use cases
The DFS is automatically produced by the user interface. You can click the Script button to view and customize the script. You can also generate scripts outside of the ADF UI and then pass that into the PowerShell cmdlet. When debugging complex data flows, you may find it easier to scan the script code-behind instead of scanning the UI graph representation of your flows.

Here are a few example use cases:
- Programatically producing many data flows that are fairly similar, i.e. "stamping-out" data flows.
- Complex expressions that are difficult to manage in the UI or are resulting in validation issues.
- Debugging and better understanding various errors returned during execution.

When you build a data flow script to use with PowerShell or an API, you must collapse the formatted text into a single line. You can keep tabs and newlines as escape characters. But the text must be formatted to fit inside a JSON property. There is a button on the script editor UI at the bottom that will format the script as a single line for you.

![Copy button](media/data-flow/copybutton.png "Copy button")

## How to add transforms
Adding transformations requires three basic steps: adding the core transformation data, rerouting the input stream, and then rerouting the output stream. This can be seen easiest in an example.
Let's say we start with a simple source to sink data flow like the following:

```
source(output(
		movieId as string,
		title as string,
		genres as string
	),
	allowSchemaDrift: true,
	validateSchema: false) ~> source1
source1 sink(allowSchemaDrift: true,
	validateSchema: false) ~> sink1
```

If we decide to add a derive transformation, first we need to create the core transformation text, which has a simple expression to add a new uppercase column called `upperCaseTitle`:
```
derive(upperCaseTitle = upper(title)) ~> deriveTransformationName
```

Then, we take the existing DFS and add the transformation:
```
source(output(
		movieId as string,
		title as string,
		genres as string
	),
	allowSchemaDrift: true,
	validateSchema: false) ~> source1
derive(upperCaseTitle = upper(title)) ~> deriveTransformationName
source1 sink(allowSchemaDrift: true,
	validateSchema: false) ~> sink1
```

And now we reroute the incoming stream by identifying which transformation we want the new transformation to come after (in this case, `source1`) and copying the name of the stream to the new transformation:
```
source(output(
		movieId as string,
		title as string,
		genres as string
	),
	allowSchemaDrift: true,
	validateSchema: false) ~> source1
source1 derive(upperCaseTitle = upper(title)) ~> deriveTransformationName
source1 sink(allowSchemaDrift: true,
	validateSchema: false) ~> sink1
```

Finally we identify the transformation we want to come after this new transformation, and replace its input stream (in this case, `sink1`) with the output stream name of our new transformation:
```
source(output(
		movieId as string,
		title as string,
		genres as string
	),
	allowSchemaDrift: true,
	validateSchema: false) ~> source1
source1 derive(upperCaseTitle = upper(title)) ~> deriveTransformationName
deriveTransformationName sink(allowSchemaDrift: true,
	validateSchema: false) ~> sink1
```

## DFS fundamentals
The DFS is composed of a series of connected transformations, including sources, sinks, and various others which can add new columns, filter data, join data, and much more. Usually, the script with start with one or more sources followed by many transformations and ending with one or more sinks.

Sources all have the same basic construction:
```
source(
  source properties
) ~> source_name
```

For instance, a simple source with three columns (movieId, title, genres) would be:
```
source(output(
		movieId as string,
		title as string,
		genres as string
	),
	allowSchemaDrift: true,
	validateSchema: false) ~> source1
```

All transformations other than sources have the same basic construction:
```
name_of_incoming_stream transformation_type(
  properties
) ~> new_stream_name
```

For example, a simple derive transformation that takes a column (title) and overwrites it with an uppercase version would be as follows:
```
source1 derive(
  title = upper(title)
) ~> derive1
```

And a sink with no schema would simply be:
```
derive1 sink(allowSchemaDrift: true,
	validateSchema: false) ~> sink1
```

## Next steps

Explore Data Flows by starting with the [data flows overview article](concepts-data-flow-overview.md)
