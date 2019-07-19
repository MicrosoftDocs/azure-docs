---
title:  "Import from Web URL via HTTP: Module Reference"
titleSuffix: Azure Machine Learning service
description: Learn how to use the Import from Web URL via HTTP module in Azure Machine Learning service to read data from a public Web page for use in a machine learning experiment.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: xiaoharper
ms.author: zhanxia
ms.date: 05/02/2019
ROBOTS: NOINDEX
---
# Import from Web URL via HTTP module

This article describes a module of the visual interface (preview) for Azure Machine Learning service.

Use this module to read data from a public Web page for use in a machine learning experiment.

The following restrictions apply to data published on a web page:

- Data must be in one of the supported formats: CSV, TSV, ARFF, or SvmLight. Other data will cause errors.
- No authentication is required or supported. Data must be publicly available. 

There are two ways to get data: use the wizard to set up the data source, or configure it manually.

## Use the Data Import Wizard

1. Add the **Import Data** module to your experiment. You can find the module in the interface, in the **Data Input and Output** category.

2. Click **Launch Import Data Wizard** and select Web URL via HTTP.

3. Paste in the URL, and select a data format.

4. When configuration is complete.

To edit an existing data connection, start the wizard again. The wizard loads all previous configuration details so that you don't have to start again from scratch

## Manually set properties in the Import Data module

The following steps describe how to manually configure the import source.

1. Add the [Import Data](import-data.md) module to your experiment. You can find the module in the interface, in the **Data Input and Output** category.

2. For **Data source**, select **Web URL via HTTP**.

3. For **URL**, type or paste the full URL of the page that contains the data you want to load.

    The URL should include the site URL and the full path, with file name and extension, to the page that contains the data to load.

    For example, the following page contains the Iris data set from the machine learning repository of the University of California, Irvine:

    `https://archive.ics.uci.edu/ml/machine-learning-databases/iris/iris.data`

4. For **Data format**, select one of the supported data formats from the list.

    We recommend that you always check the data beforehand to determine the format. The UC Irvine page uses the CSV format. Other supported data formats are TSV, ARFF, and SvmLight.

5. If the data is in CSV or TSV format, use the **File has header row** option to indicate whether or not the source data includes a header row. The header row is used to assign column names.

6. Select the **Use cached results** options if you don't expect the data to change much, or if you want to avoid reloading the data each time you run the experiment.

    When this option  is selected, the experiment loads the data the first time the module is run, and thereafter uses a cached version of the dataset.

    If you want to reload the dataset on each iteration of the experiment dataset, deselect the **Use cached results** option. Results are also reloaded if there are any changes to the parameters of [Import Data](import-data.md).

7. Run the experiment.

## Results

When complete, click the output dataset and select **Visualize** to see if the data was imported successfully.


## Next steps

See the [set of modules available](module-reference.md) to Azure Machine Learning service. 