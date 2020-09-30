---
title: Dedupe rows and find nulls using data flow snippets
description: Learn how to easily dedupe rows and find nulls using code snippets in data flows
services: data-factory
author: kromerm

ms.service: data-factory
ms.workload: data-services

ms.topic: conceptual
ms.date: 09/30/2020
ms.author: makromer
---

# Dedupe rows and find nulls using data flow snippets

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

By using code snippets in mapping data flows, you can very easily perform common tasks like data deduplication and null filtering. This how-to guide will explain how to add those functions to your pipelines very easily using data flow script snippets.

## Create a pipeline

1. Select **+New Pipeline** to create a new pipeline.

2. Add a data flow activity.

3. Add a Source transformation and connect it to one of your datasets

    ![Source Snippet 2](media/data-flow/snippet2.png)

4. The dedupe and NULL check snippets use generic patterns that leverage data flow schema drift so they will work with any schema from your dataset, or with datasets that do not have any pre-defined schema.

5. Go to the Data Flow Script documentation page and copy the code snippet for Distinct Rows.

6. https://docs.microsoft.com/en-us/azure/data-factory/data-flow-script#distinct-row-using-all-columns

7. In your data flow designer UI, click the Script button on the top right to open the script editor behind the data flow graph.

    ![Source Snippet 3](media/data-flow/snippet3.png)

8. After the definition for ```source1``` in your script, hit Enter and then paste in the code snippet.

9. You will connect this pasted code snippet to the previous Source transformation that you created in the graph by typing "source1" in front of the pasted code.

10. Alternatively, you can connect the new tranformation in the designer by selecting the incoming stream from the new transformation node in the graph.

    ![Source Snippet 4](media/data-flow/snippet4.png)

10. In the expression builder, type the following:

    ```substring(Column_1,1,4)```

    ![derived column](media/data-flow/fwderivedcol1.png)

11. Repeat step 10 for all the columns you need to parse.

12. Select the **Inspect** tab to see the new columns that will be generated:

    ![inspect](media/data-flow/fwinspect.png)

13. Use the Select transform to remove any of the columns that you don't need for transformation:

    ![select transformation](media/data-flow/fwselect.png)

14. Use Sink to output the data to a folder:

    ![fixed width sink](media/data-flow/fwsink.png)

    Here's what the output looks like:

    ![fixed width output](media/data-flow/fxdoutput.png)

  The fixed-width data is now split, with four characters each and assigned to Col1, Col2, Col3, Col4, and so on. Based on the preceding example, the data is split into four columns.

## Next steps

* Build the rest of your data flow logic by using mapping data flows [transformations](concepts-data-flow-overview.md).
