
<!--
    As of 2017/10/06, this 'include' file is meant to replace the first paragraph of plain text that is duplicated at the top inside every tutorial-*.md article in azure-docs-pr/articles/data-factory/.

    This 'include' file is basically one paragraph.
    It explains what Azure Data Factory is, to someone who knows nothing about ADF.
-->

Azure Data Factory is a data integration service. It enables you to create data-driven workflows in the cloud. A workflow is implemented as one or more *pipelines*. The pipelines orchestrate and automate data movement and data transformation. Pipelines can perform the following sequence with your data:

1. Ingest data from disparate data stores.
2. Transform or process the data by using compute services such as the following:
    - Azure HDInsight Hadoop
    - Spark
    - Azure Data Lake Analytics
    - Azure Machine Learning
3. Publish output data to data stores.
    - The publishing target could be an Azure SQL Data Warehouse for business intelligence (BI) applications to consume. 

You can schedule pipelines by using Data Factory.

