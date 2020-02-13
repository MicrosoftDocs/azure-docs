---
title:  "Enter Data Manually: Module Reference"
titleSuffix: Azure Machine Learning
description: Learn how to use the Enter Data Manually module in Azure Machine Learning to create a small dataset by typing values. The dataset can have multiple columns.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: xiaoharper
ms.author: zhanxia
ms.date: 10/22/2019
---
# Enter Data Manually module

This article describes a module in Azure Machine Learning designer (preview).

Use this module to create a small dataset by typing values. The dataset can have multiple columns.
  
This module can be helpful in scenarios such as these:  
  
- Generating a small set of values for testing  
  
- Creating a short list of labels
  
- Typing a list of column names to insert in a dataset

## Enter Data Manually 
  
1.  Add the [Enter Data Manually](./enter-data-manually.md) module to your pipeline. You can find this module in the **Data Input and Output** category in Azure Machine Learning. 
  
2.  For **DataFormat**, select one of the following options. These options determine how the data that you provide should be parsed. The requirements for each format differ greatly, so be sure to read the related topics.  
  
    -   **ARFF**. The attribute-relation file format, used by Weka.   
  
    -   **CSV**. Comma-separated values format. For more information, see [Convert to CSV](./convert-to-csv.md).  
  
    -   **SVMLight**. A format used by Vowpal Wabbit and other machine learning frameworks.  
  
    -   **TSV**. Tab-separated values format.

     If you choose a format and do not provide data that meets the format specifications, a run-time error occurs.
  
3.  Click inside the **Data** text box to start entering data. The following formats require special attention:  
  
    - **CSV**:  To create multiple columns, paste in comma-separated text, or type multiple columns using commas between fields.
  
        If you select the **HasHeader** option, you can use the first row of values as the column heading.  
  
        If you deselect this option, the columns names, Col1, Col2, and so forth, are used. You can add or change columns names later using [Edit Metadata](./edit-metadata.md).  
  
    - **TSV**: To create multiple columns, paste in tab-separated text, or type multiple columns using tabs between fields.  
  
        If you select the **HasHeader** option, you can use the first row of values as the column heading.  
  
        If you deselect this option, the columns names, Col1, Col2, and so forth, are used. You can add or change columns names later using [Edit Metadata](./edit-metadata.md).  
  
    -   **ARFF**:  Paste in an existing ARFF format file. If you are typing values directly, be sure to add the optional header and required attribute fields at the  beginning of the data. 
    
        For example, the following header and attribute rows could be added to a simple list. The column heading would be `SampleText`.
    
        ```text
        % Title: SampleText.ARFF  
        % Source: Enter Data module  
        @ATTRIBUTE SampleText STRING  
        @DATA  
        \<type first data row here>  
        ```

    -   **SVMLight**: Type or paste in values using the SVMLight format.  
  
        For example, the following sample represents the first couple lines of the Blood Donation dataset, in SVMight format:  
  
        ```text  
        # features are [Recency], [Frequency], [Monetary], [Time]  
        1 1:2 2:50 3:12500 4:98   
        1 1:0 2:13 3:3250 4:28   
        ```  
  
        When you run the [Enter Data Manually](./enter-data-manually.md) module, these lines are converted to a dataset of columns and index values as follows:  
  
        |Col1|Col2|Col3|Col4|Labels|  
        |-|-|-|-|-|  
        |0.00016|0.004|0.999961|0.00784|1|  
        |0|0.004|0.999955|0.008615|1|  
  
4.  Press ENTER after each row, to start a new line.  
  
     **Be sure to press ENTER after the final row.** 
     
     If you press ENTER multiple times to add multiple empty trailing rows, the final empty row is removed trimmed, but other empty rows are treated as missing values.  
  
     If you create rows with missing values, you can always filter them out later.  
  
5.  Connect the output port to other modules, and run the pipeline.  
  
     To view the dataset, right-click the module and select **Visualize**.  
## Next steps

See the [set of modules available](module-reference.md) to Azure Machine Learning. 