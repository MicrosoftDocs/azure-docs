---
title:  "Import Data: Module Reference"
titleSuffix: Azure Machine Learning service
description: Learn  how to use the Import Data module in Azure Machine Learning service to load data into a machine learning experiment from existing cloud data services.  
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: xiaoharper
ms.author: zhanxia
ms.date: 05/02/2019
ROBOTS: NOINDEX
---
# Import Data module

This article describes a module of the visual interface (preview) for Azure Machine Learning service.

Use this module to load data into a machine learning experiment from existing cloud data services.  
The module now features a wizard to help you choose a storage option and select from among existing subscriptions and accounts to quickly configure all options. Need to edit an existing data connection? No problem; the wizard loads all previous configuration details so that you don't have to start again from scratch. 
  
After you define the data you want and connect to the source, [Import Data](./import-data.md) infers the data type of each column based on the values it contains, and loads the data into your Azure Machine Learning workspace. The output of [Import Data](./import-data.md) is a dataset that can be used with any experiment.

  
If your source data changes, you can refresh the dataset and add new data by rerunning [Import Data](./import-data.md). However, if you don't want to re-read from the source each time you run the experiment, select the **Use cached results** option to TRUE. When this option is selected, the module checks whether the experiment has run previously using the same source and same input options. If a previous run is found, the data in the cache is used, instead of reloading the data from the source.
 

## Data sources

The Import Data module supports the following data sources. Click the links for detailed instructions and examples of using each data source. 
 
If you are not sure how or where you should store your data, see this guide to common data scenarios in the data science process:  [Scenarios for advanced analytics in Azure Machine Learning](https://docs.microsoft.com/azure/machine-learning/machine-learning-data-science-plan-sample-scenarios). 


|Data source| Use with|
|-----------|-----------|  
|[Web URL via HTTP](./import-from-web-url-via-http.md)|Get data that is hosted on a web URL that uses HTTP and that has been provided in the CSV, TSV, ARFF, or SvmLight formats|  
|[Import from Azure Blob Storage](./import-from-azure-blob-storage.md) |Get data that is stored in the Azure blob service|  

## How to use Import Data
 
1. Add the **Import Data** module to your experiment. You can find this module in the **Data Input and Output** category in the interface.

2. Click **Launch Data Import Wizard** to configure the data source using a wizard.

    The wizard gets the account name and credentials, and help you configure other options. If you are editing an existing configuration, it loads the current values first.

3. If you do not want to use the wizard, click **Data source**, and choose the type of cloud-based storage you are reading from. 

    Additional settings depend on the type of storage you choose, and whether the storage is secured or not. You might need to provide the account name, file type, or credentials. Some sources do not require authentication; for others, you might need to know the account name, a key, or container name.

4. Select the **Use cached results** option if you want to cache the dataset for reuse on successive runs.

    Assuming there have been no other changes to module parameters, the experiment loads the data only the first time the module is run, and thereafter uses a cached version of the dataset.

    Deselect this option if you need to reload the data each time you run the experiment.

5. Run the experiment.

    When Import Data loads the data into the interface, it infers the data type of each column based on the values it contains, either numerical or categorical.

    - If a header is present, the header is used to name the columns of the output dataset.

    - If there are no existing column headers in the data, new column names are generated using the format col1, col2,… , coln*.

## Results

When import completes, click the output dataset and select **Visualize** to see if the data was imported successfully.

If you want to save the data for re-use, rather than importing a new set of data each time the experiment is run, right-click the output and select **Save as Dataset**. Choose a name for the dataset. The saved dataset preserves the data at the time of saving, and data is not updated when the experiment is rerun, even if the dataset in the experiment changes. This can be handy for taking snapshots of data.

After importing the data, it might need some additional preparations for modeling and analysis:


- Use [Edit Metadata](./edit-metadata.md) to change column names, to handle a column as a different data type, or to indicate that some columns are labels or features.

- Use [Select Columns in Dataset](./select-columns-in-dataset.md) to select a subset of columns to transform or use in modeling. The transformed or removed columns can easily be rejoined to the original dataset by using the [Add Columns](./add-columns.md) module.  

- Use [Partition and Sample](./partition-and-sample.md) to divide the dataset, perform sampling, or get the top n rows.

## Next steps

See the [set of modules available](module-reference.md) to Azure Machine Learning service. 