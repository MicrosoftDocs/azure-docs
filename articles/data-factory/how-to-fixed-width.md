---
title: Process fixed-length text files with Mapping Data Flows in Azure Data Factory
description: Learn how to process fixed-length text files in Azure Data Factory using Mapping Data Flows.
services: data-factory
author: balakreshnan

ms.service: data-factory
ms.workload: data-services

ms.topic: conceptual
ms.date: 8/18/2019
ms.author: makromer
---

# Process fixed-length text files using Data Factory Mapping Data Flows

## Create a pipeline

* Go to **+New Pipeline** to start a new pipeline

* Add a data flow activity which will be used for processing fixed-width files

![Fixed Width Pipeline](media/data-flow/fwpipe.png)

* In the Data Flow activity, select New Mapping Data Flow

* Add a Source transformation, Derived Column, Select, and Sink Transformation

![Fixed Width Data Flow](media/data-flow/fw2.png)

* Configure the Source transformation to use a new dataset that will be of type Delimited Text

* Set no column delimiter and no headers

We're going to simply set field starting points and lengths for this file contents:

```
1234567813572468
1234567813572468
1234567813572468
1234567813572468
1234567813572468
1234567813572468
1234567813572468
1234567813572468
1234567813572468
1234567813572468
1234567813572468
1234567813572468
1234567813572468
```

* On the Projection tab of your Source transformation, you should see one string column called "Column_1"

* Now in the Derived Column, create a new column

* We'll give the columns simple names like col1

* Then in the expression builder, type:

```substring(Column_1,1,4)```

![derived column](media/data-flow/fwderivedcol1.png)

* Repeat this for all the columns you need to parse

* Click on the Inspect tab to see the new columns that will be generated

![inspect](media/data-flow/fwinspect.png)

* Use the Select transform to remove any of the columns that you will not need for transformation

![select transformation](media/data-flow/fwselect.png)

* Finally, use Sink to output the data to a folder:

![fixed width sink](media/data-flow/fwsink.png)

* Here is what the output will look like:

![fixed width output](media/data-flow/fxdoutput.png)

* The fixed-width data is now split with four characters each and assigned to Col1, Col2, Col3, Col4, ... Based on the above example I am splitting the data into 4 columns

## Next steps

* Build the rest of your data flow logic using Mapping Data Flow [transformations](concepts-data-flow-overview.md)
