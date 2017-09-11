# [Team Data Science Process Documentation](index.yml)
# [Overview](overview.md)
# [Lifecycle](lifecycle.md)
## [1. Business Understanding](lifecycle-business-understanding.md)
## [2. Data Acquisition and Understanding](lifecycle-data.md)
## [3. Modeling](lifecycle-modeling.md)
## [4. Deployment](lifecycle-deployment.md)
## [5. Customer Acceptance](lifecycle-acceptance.md)
## [With Azure ML](http://aka.ms/datascienceprocess)

# [Roles and tasks](roles-tasks.md)
## [Group Manager](group-manager-tasks.md)
## [Team Lead](team-lead-tasks.md)
## [Project Lead](project-lead-tasks.md)
## [Individual Contributor](project-ic-tasks.md)

# [Project structure](https://github.com/Azure/Azure-TDSP-ProjectTemplate)

# [Project execution](project-execution.md)

# [Tutorials](walkthroughs.md)

## [Azure Machine Learning Workbench](walkthroughs-aml-with-tdsp.md)
### [Classify incomes](../preview/tutorial-classifying-uci-incomes.md)
### [Bio-medical entity recognition with NLP](../preview/sample-tdsp-nlp.md)

## [Spark with PySpark and Scala](walkthroughs-spark.md)
### [Explore data](spark-data-exploration-modeling.md)
### [Score models](spark-model-consumption.md)
### [Advanced data exploration](spark-advanced-data-exploration-modeling.md)
## [Hive with HDInsight Hadoop](walkthroughs-hdinsight-hadoop.md)
## [U-SQL with Azure Data Lake](walkthroughs-azure-data-lake.md)
## [R, Python and T-SQL with SQL Server](walkthroughs-sql-server.md)
## [T-SQL and Python with SQL DW](walkthroughs-sql-data-warehouse.md)


# How To

## [Use TDSP in Azure ML](../preview/how-to-use-tdsp-in-azure-ml.md)

## [Set up data science environments](environment-setup.md)
### [Azure storage accounts](../../storage/common/storage-create-storage-account.md)
### [Platforms and tools](platforms-and-tools.md)
### [Customize Hadoop](customize-hadoop-cluster.md)
### [Azure Machine Learning workspace](../studio/create-workspace.md)
### [Set up virtual machines](virtual-machines.md)

## Analyze business needs
### [Identify your scenario](plan-your-environment.md)

## Acquire and understand data
### Manage data logistics
#### [Overview](ingest-data.md)
#### [Blob storage](move-azure-blob.md)
#### [Use Storage Explorer](move-data-to-azure-blob-using-azure-storage-explorer.md)
#### [Use AzCopy](move-data-to-azure-blob-using-azcopy.md)
#### [Use Python](move-data-to-azure-blob-using-python.md)
#### [Use SSIS](move-data-to-azure-blob-using-ssis.md)
#### [Move to a VM](move-sql-server-virtual-machine.md)
#### [Move to SQL database](move-sql-azure.md)
#### [Load into hive tables](move-hive-tables.md)
#### [Load from on-prem SQL](move-sql-azure-adf.md)
#### [Load fromSQL partition tables](parallel-load-sql-partitioned-tables.md)

### Explore and visualize data
#### [Prepare data](prepare-data.md)
#### Explore data
##### [Overview](explore-data.md)
##### [Use Pandas](explore-data-blob.md)
##### [Use SQL VM](explore-data-sql-server.md)
##### [Use Hive tables](explore-data-hive-tables.md)

#### Sample data
##### [Overview](sample-data.md)
##### [Use blob storage](sample-data-blob.md)
##### [Use SQL Server](sample-data-sql-server.md)
##### [Use Hive tables](sample-data-hive.md)

#### Process data
##### [Access with Python](python-data-access.md)
##### [Process blob data](data-blob.md)
##### [Use Azure Data Lake](data-lake-walkthrough.md)
##### [Use SQL VM](sql-server-virtual-machine.md)
##### [Use data pipeline](automated-data-pipeline-cheat-sheet.md)
##### [Process data with Spark](spark-data-exploration-modeling.md)
##### [Overview](spark-overview.md)
##### [Explore data](spark-data-exploration-modeling.md)
##### [Score models](spark-model-consumption.md)
##### [Advanced data exploration](spark-advanced-data-exploration-modeling.md)
##### [Use Scala and Spark](scala-walkthrough.md)

## Develop models
### Engineer features
#### [Overview](create-features.md)
#### [Use Pandas](create-features-blob.md)
#### [Use SQL+Python](create-features-sql-server.md)
#### [Use Hive queries](create-features-hive.md)
### [Select features](select-features.md)

### Create and train models
#### [Choose algorithms](../studio/algorithm-choice.md)
#### [Algorithm cheat sheet](../studio/algorithm-cheat-sheet.md)

## Deploy models
### [With a web service](../studio/publish-a-machine-learning-web-service.md)
### [Consume a web service](../studio/consume-web-services.md)

# Related

## [Microsoft Cognitive Toolkit - CNTK](https://docs.microsoft.com/en-us/cognitive-toolkit/)

## Cortana Intelligence Partner Solutions
### [Cortana Intelligence Gallery](https://gallery.cortanaintelligence.com)
### [Cortana Intelligence publishing guide](cortana-intelligence-appsource-publishing-guide.md)
### [Cortana Intelligence solution evaluation tool](cortana-intelligence-appsource-evaluation-tool.md)

## Cortana Analytics

### APIs
#### [Anomaly detection](apps-anomaly-detection-api.md)
#### [Cognitive Services](https://azure.microsoft.com/services/cognitive-services/)

#### Predictive maintenance
##### [Overview](cortana-analytics-playbook-predictive-maintenance.md)
##### [Architecture](cortana-analytics-architecture-predictive-maintenance.md)
##### [Technical guide](cortana-analytics-technical-guide-predictive-maintenance.md)

#### Vehicle telemetry
##### [Overview](cortana-analytics-playbook-vehicle-telemetry.md)
##### [Playbook](cortana-analytics-playbook-vehicle-telemetry-deep-dive.md)
##### [Setup](cortana-analytics-playbook-vehicle-telemetry-powerbi.md)

# Resources

## [TDSP Tools and Utilities GitHub](https://github.com/Azure/Azure-TDSP-Utilities)
### [Latest Rev of Utilities for Microsoft Team Data Science Process](https://blogs.technet.microsoft.com/machinelearning/2017/04/05/latest-rev-of-utilities-for-microsoft-team-data-science-process-tdsp-now-available/)

## [Cortana Intelligence and Machine Learning Blog](https://blogs.technet.microsoft.com/machinelearning/)
## [MSDN forum](https://social.msdn.microsoft.com/forums/azure/home?forum=MachineLearning)
## [Stack Overflow](http://stackoverflow.com/questions/tagged/azure-machine-learning)
## [Videos](https://azure.microsoft.com/resources/videos/index/?services=machine-learning)
