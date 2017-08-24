# Overview

## [What's Machine Learning?](what-is-machine-learning.md)

## Team Data Science Process
### [Overview](overview.md)
### [Lifecycle](lifecycle.md)
### [Walkthroughs](walkthroughs.md)
####[Spark with PySpark and Scala](walkthroughs-spark.md)
##### [Explore data](spark-data-exploration-modeling.md)
##### [Score models](spark-model-consumption.md)
##### [Advanced data exploration](spark-advanced-data-exploration-modeling.md)
####[Hive with HDInsight Hadoop](walkthroughs-hdinsight-hadoop.md)
####[U-SQL with Azure Data Lake](walkthroughs-azure-data-lake.md)
####[R, Python and T-SQL with SQL Server](walkthroughs-sql-server.md)
####[T-SQL and Python with SQL DW](walkthroughs-sql-data-warehouse.md)
### [With Azure ML](http://aka.ms/datascienceprocess)

## Machine Learning Studio
### [What's the Studio?](what-is-ml-studio.md)
### [Studio capabilities](studio-overview-diagram.md)
### [Infographic: ML basics](basics-infographic-with-algorithm-examples.md)

## [Frequently asked questions](faq.md)
## [What's new?](whats-new.md)

# Get Started

## [Create your first experiment](create-experiment.md)

## Example walkthrough
### [Create a predictive solution](walkthrough-develop-predictive-solution.md)
### [1: Create a workspace](walkthrough-1-create-ml-workspace.md)
### [2: Upload data](walkthrough-2-upload-data.md)
### [3: Create experiment](walkthrough-3-create-new-experiment.md)
### [4: Train and evaluate](walkthrough-4-train-and-evaluate-models.md)
### [5: Deploy web service](walkthrough-5-publish-web-service.md)
### [6: Access web service](walkthrough-6-access-web-service.md)

## Data Science for Beginners
### [1: Five questions](data-science-for-beginners-the-5-questions-data-science-answers.md)
### [2: Is your data ready?](data-science-for-beginners-is-your-data-ready-for-data-science.md)
### [3: Ask the right question](data-science-for-beginners-ask-a-question-you-can-answer-with-data.md)
### [4: Predict an answer](data-science-for-beginners-predict-an-answer-with-a-simple-model.md)
### [5: Copy other people's work](data-science-for-beginners-copy-other-peoples-work-to-do-data-science.md)

## [R quick start](r-quickstart.md)

# How T

## Set up tools and utilities
### [Set up environments](environment-setup.md)
### [Set up virtual machines](virtual-machines.md)
### [Customize Hadoop](customize-hadoop-cluster.md)
### Set up a virtual machine
#### [DS VM overview](virtual-machine-overview.md)
#### [How to use the DS VM](vm-do-ten-things.md)
#### [Provision the DS VM](provision-vm.md
#### [Set up Azure VM](setup-virtual-machine.md)
#### [Set up SQL VM](setup-sql-server-virtual-machine.md)
#### [Provision Linux VM](linux-dsvm-intro.md)
#### [Use Linux VM](linux-dsvm-walkthrough.md)
### Manage a workspace
#### [Create](create-workspace.md)
#### [Manage](manage-workspace.md)
#### [Troubleshoot](troubleshooting-creating-ml-workspace.md)
#### [Deploy using ARM](deploy-with-resource-manager-template.md
#### [Create in another region](multi-geo.md)

## Analyze business needs
### [Technical needs](plan-your-environment.md)
### [Identify your scenario](plan-sample-scenarios.md)

## Acquire and understand data
### Load data into storage
#### [Overview](ingest-data.md
#### [Blob storage](move-azure-blob.md)
#### [Use Storage Explorer](move-data-to-azure-blob-using-azure-storage-explorer.md)
#### [Use AzCopy](move-data-to-azure-blob-using-azcopy.md)
#### [Use Python](move-data-to-azure-blob-using-python.md)
#### [Use SSIS](move-data-to-azure-blob-using-ssis.md)
#### [Move to a VM](move-sql-server-virtual-machine.md)
#### [Move to SQL database](move-sql-azure.md)
#### [Load into hive tables](move-hive-tables.md)
#### [Load from on-prem SQL](move-sql-azure-adf.md
#### [Load fromSQL partition tables](parallel-load-sql-partitioned-tables.md)
### Import training data
#### [Overview](import-data.md)
#### [From a local file](import-data-from-local-file.md)
#### [From online sources](import-data-from-online-sources.md)
#### [From an experiment](import-data-from-an-experiment.md)
#### [Use on-prem SQL](use-data-from-an-on-premises-sql-server.md)
### Explore and visualize data
#### [Prepare data](prepare-data.md
#### Explore data
##### [Overview](explore-data.md)
##### [Use Pandas](explore-data-blob.md)
##### [Use SQL VM](explore-data-sql-server.md)
##### [Use Hive tables](explore-data-hive-tables.md)
#### Sample data
##### [Overview](sample-data.md)
##### [Use blob storage](sample-data-blob.md)
##### [Use SQL Server](sample-data-sql-server.md
##### [Use Hive tables](sample-data-hive.md)
#### Process data
##### [Access with Python](python-data-access.md)
##### [Process blob data](data-blob.md)
##### [Use Azure Data Lake](data-lake-walkthrough.md)
##### [Use SQL VM](sql-server-virtual-machine.md)
##### [Use data pipeline](automated-data-pipeline-cheat-sheet.md)

## Develop model
### Engineer and select features
#### [Overview](create-features.md)
#### [Use Pandas](create-features-blob.md)
#### [Use SQL+Python](create-features-sql-server.md)
#### [Use Hive queries](create-features-hive.md)
#### [TDSP feature selection](select-features.md)
### Create and train models
#### [Experiment lifecycle management](version-control.md)
#### [Manage iterations](manage-experiment-iterations.md
#### [Use PowerShell to create models](create-models-and-endpoints-with-powershell.md)
#### Select algorithms
##### [Choose algorithms](algorithm-choice.md)
##### [Algorithm cheat sheet](algorithm-cheat-sheet.md)
##### [Use linear regression](linear-regression-in-azure.md)
##### [Use text analytics](text-analytics-module-tutorial.md)
#### Evaluate and interpret results
##### [Evaluate performance](evaluate-model-performance.md)
##### [Optimize parameters](algorithm-parameters-optimize.md)
##### [Interpret results](interpret-model-results.md)
##### [Debug](debug-models.md)
#### Use R and Python
##### [Execute R scripts](extend-your-experiment-with-r.md)
##### [Author custom R modules](custom-r-modules.md)
##### [Execute Python scripts](execute-python-scripts.md)

## Operationalize models
### [Overview](deploy-consume-web-service-guide.md)
### Deploy models
#### [Deploy a web service](publish-a-machine-learning-web-service.md)
#### [How it works](model-progression-experiment-to-web-service.md)
#### [Prepare for deployment](convert-training-experiment-to-scoring-experiment.md)
#### [Use external data](web-services-that-use-import-export-modules.md)
#### [Deploy in multi-regions](how-to-deploy-to-multiple-regions.md)
#### [Use web service parameters](web-service-parameters.md)
#### [Enable logging](web-services-logging.md)
### Manage web services
#### [Use Web Services portal](manage-new-webservice.md)
#### [Manage with APIs](manage-web-service-endpoints-using-api-management.md)
#### [Create endpoints](create-endpoint.md)
#### [Scaling](scaling-webservice.md)
### Retrain models
#### [Overview](retrain-machine-learning-model.md)
#### [Retrain programmatically](retrain-models-programmatically.md)
#### [Retrain a Classic web service](retrain-a-classic-web-service.md)
#### [Retrain with PowerShell](retrain-new-web-service-using-powershell.md)
#### [Retrain an existing web service](retrain-existing-resource-manager-based-web-service.md)
#### [Troubleshoot](troubleshooting-retraining-models.md)
### Consume models
#### [Overview](consume-web-services.md)
#### [Use Excel](consuming-from-excel.md)
#### [Use Excel add-in](excel-add-in-for-web-services.md)
#### [Use web app template](consume-web-service-with-web-app-template.md)
#### [Use Batch Pool](dedicated-capacity-for-bes-jobs.md)

## Examples
### [Sample experiments](sample-experiments.md)
### [Sample datasets](use-sample-datasets.md)
### [Customer churn example](azure-ml-customer-churn-scenario.md)


# Reference

## [Code samples](https://azure.microsoft.com/en-us/resources/samples/?service=machine-learning)
## [PowerShell module (New)](/powershell/module/azurerm.machinelearning)
## [PowerShell module (Classic)](powershell-module.md)
## [Algorithm & Module reference](https://msdn.microsoft.com/library/azure/dn905974.aspx)
## [REST API reference](/rest/api/machinelearning)
## [Web service error codes](web-service-error-codes.md)

# Related

## Cortana Intelligence Gallery
### [Overview](gallery-how-to-use-contribute-publish.md)
### [Industries](gallery-industries.md)
### [Solutions](gallery-solutions.md)
### [Experiments](gallery-experiments.md)
### [Jupyter Notebooks](gallery-jupyter-notebooks.md)
### [Competitions](gallery-competitions.md)
### [Competitions FAQ](competition-faq.md)
### [Tutorials](gallery-tutorials.md)
### [Collections](gallery-collections.md)
### [Custom Modules](gallery-custom-modules.md)

## Cortana Intelligence Partner Solutions
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
## [Azure Roadmap](https://azure.microsoft.com/roadmap/)

## [Net# Neural Networks Language](azure-ml-netsharp-reference-guide.md)
## [Pricing](https://azure.microsoft.com/pricing/details/machine-learning/)
## [Pricing calculator](https://azure.microsoft.com/pricing/calculator/)
## [Service updates](https://azure.microsoft.com/updates/?product=machine-learning)
## [Blog](http://blogs.technet.com/b/machinelearning/)
## [MSDN forum](https://social.msdn.microsoft.com/forums/azure/home?forum=MachineLearning)
## [Stack Overflow](http://stackoverflow.com/questions/tagged/azure-machine-learning)
## [Videos](https://azure.microsoft.com/resources/videos/index/?services=machine-learning)
## [Get help from live chat](live-chat.md)
