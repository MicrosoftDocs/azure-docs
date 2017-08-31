---
title: Machine Learning 2017 Preview FAQ | Microsoft Docs
description: This article contains commonly asked questions and answers
services: machine-learning
author: serinakaye
ms.author: serinak
ms.reviewer: garyericson, jasonwhowell, mldocs
ms.service: machine-learning
ms.workload: data-services
ms.topic: article
ms.date: 08/30/2017
---
# Frequently Asked Questions

## General Product Questions

**What is Azure Machine Learning?**

Azure Machine Learning is a fully managed Azure service that allows you to create, test, manage and deploy predictive analytic solutions. You can choose between a browser-based, visual drag-and-drop authoring environment where no coding is necessary, or use a code-first approach that leverages the cloud,on-premises, and edge assets to provide the ultimate in power, speed, and flexibility in how you build AI. 

**How do I get started with the preview?**

The easiest way to get started is to sign up for the Azure Machine Learning Experimentation Service in the Azure portal. Your first two user accounts are free. From the portal, you can also download our free Workbench application or sign up for a Model Management account. (Please note: you will need a Model Management account when you are ready to deploy and manage your models.) In addition, please check out our documentation site for How To articles, videos, demo code and more. 

**I do not have an Azure subscription. Can I still try the new services?**

As part of the Microsoft Azure portfolio, requires a Microsoft Azure subscription. Please note that in addition to an Azure subscription, you must have adequate permissions to create assets such as Resource Groups, Virtual Machines, Azure Container Registry entries, etc. 

**In which regions will the new services be available?**

For Public Preview, our new services will be available in the United States, Canada and Australia. Supported Azure regions are: 
- US East 2
- West Central
- Australia
More regions and markets will be added as we continue to develop the product. For the latest updates, please check here. 

**What other Azure services are required?**

Azure Machine Learning has been designed with GIT integration to support versioning, collaboration and reproducibility. GIT integration is enabled via Visual Studio Team Services and a VSTS account is therefore required. For more information on GIT integration, click here.

**Since this is a public preview, can I trust enterprise-grade challenges and data to your solution?**

Yes! Azure Machine Learning is backed by the world’s most compliant and secure cloud. In addition, over the last few months, we’ve piloted AML Workbench with many large organizations including Adobe, JPMorgan Chase & Co., and Accenture. We’re also using AML Workbench here at Microsoft in teams such as Microsoft Universal Store, and our IoT group. 

**How does Azure Machine Learning relate to Microsoft Machine Learning Services in SQL Server 2017?**	

Machine Learning Services in SQL Server 2017 is an extensible, scalable platform for integrating machine learning tasks into the database workflow. It is a perfect fit for scenarios where data movement brings risk or is untenable, and an on premise solution is required. Cloud or hybrid data science workloads, in contrast, are best accommodated by Azure Machine Learning’s new Experimentation and Model Management Services. 

**Do you support both Python and R? What about other programming languages like C++**

We currently support Python only. We are working on R integration and expect to have it available soon. 

**How does Azure Machine Learning relate to Microsoft Machine Learning for Spark?**

A: MMLSpark provides deep learning and data science tools for Apache Spark, with emphasis on productivity,ease of experimentation and state-of-the-art algorithms. It includes seamless integration of Spark Machine Learning pipelines with Microsoft Cognitive Toolkit (CNTK) and OpenCV, enabling you to quickly create powerful, highly-scalable predictive and analytical models for large image and text data sets. MMLSpark is available under an open-source license and is included in AML Workbench as a set of consumable models and algorithms.  For more information on MMLSpark, please visit our product documentation. 

**Which versions of Spark are supported by the new tools and services? Top section**

AML Workbench currently includes and supports MMLSpark version 0.8, which is compatible with Apache Spark 2.1. You also have an option to use GPU-enabled Docker image of MMLSpark 0.8 on Linux virtual machines.

##Experimentation Service

**What is the Azure Machine Learning Experimentation Service?**

Our new Experimentation Service is a managed Azure service that allows data scientists to take their experimentation to the next level. Experiments can be built locally or in the cloud. Data Scientists can rapidly prototype on a desktop, then easily scale up on virtual machines or out using Spark clusters. Experiments can run in parallel and at massive scale using Azure Batch AI Training. With support for Azure VMs with the latest GPU technology, data scientists can engage in deep learning quickly and effectively. We’ve also included deep integration with Git, to provide familiar extensible development tools that plug easily into existing workflows for code tracking, configuration, and collaboration. 

**What is a “model”?**

A model is an experimentation run that has been promoted to the Vienna hosting account for model management. A model that is registered in the hosting account is counted against your plan. An model updated through re-training or a different version is counted against your included quantities.

**How will I be charged for the Experimentation Service?**

The first two users associated with your Azure Machine Learning Experimentation Service are free. Additional users will be charged at the Public Preview rate of $50 / month. For more information on pricing and billing, please see our Pricing page.

**Will I be charged based on how many experiments I run?**

No, the Experimentation Service allows as many experiments as you need, and charges only based on the number of users. Experimentation compute resources are charged separately.  Users are encouraged to perform multiple experiments (such as evaluating the performance of various algorithms on a data set or iteratively tweaking algorithm parameters).  You have control over the type of compute resources you want to use based on your needs. 

**What specific kinds of compute and storage resources will my experiments be run on?**

The Azure Machine Learning Experimentation service can execute your experiments on the following: local machine (direct or Docker-based), Azure compute resources (virtual machines), and HDInsight. It also needs to access an Azure Blob Storage account for storing tracked execution outputs. It can also optionally leverage a Visual Studio Team Service account for version-controlling your project using a Git repository. Please note that you will be billed independently for any consumed compute and storage resources, based upon their individual pricing.  

**Does the Experimentation Service support GPUs?**
Yes, you can accelerate the training time of deep neural network models significantly by using GPUs in your experiments. We encourage users to work with GPUs via the Azure Data Science Virtual Machine (DSVM) as execution target. While in principle it is possible to use GPUs on any Linux machine, the DSVM comes with the required drivers and libraries pre-installed, making the set-up much easier. Make sure you have installed Vienna app + CLI properly before you follow the below steps. Yes for experimentation but not model management. You can use models trained on GPU for inferencing on CPUs.

##Model Management Service

**What is the Azure Machine Learning Model Management Service?**

The Model Management Service is a managed Azure service that allows data scientists and dev-ops teams to deploy predictive models reliably into a wide variety of environments. With GIT repositories and Docker containers providing traceability and repeatability, models can be deployed reliably in the cloud, on-premises, or edge. Once in production, data scientists can manage model performance, then proactively retrain if performance degrades. Models can be deployed on local machines or to Azure VMs (both batch and real-time), or scaled to Spark HDInsight or Kubernetes-orchestrated Azure Container Service clusters. And all of this is enterprise ready, compliant, and backed with Microsoft-grade enterprise security and data privacy. 

**What is a “managed model”?**

A model is the output of a training process and is the application of a machine learning algorithm to training data. The Model Management service enables you to deploy models as web services, manage various versions of the models, and monitor the performance of your models and associated metrics. ‘Managed’ models are those that have been registered with an Azure Machine Learning Model Management account. As an example, consider a scenario where you are trying to forecast sales. During the experimentation phase, you generate many models by using different data sets or algorithms. In a case where you have generated four models with varying accuracies you may choose to register only the model with the highest accuracy. Any time you register a new model or register a new version of an existing model, it gets counted as part of your plan. At any point in time you may have up to the maximum number of managed models denoted by the tiers you have purchased. 
 
**What is a deployment?**

The Model Management service allows you to deploy models as packaged web service containers in Azure that can be invoked using REST APIs. Each web service is counted as a single deployment, and the total number of active deployments running are counted towards your plan. At any point in time you may have up to the maximum number of deployments denoted by the tier you have purchased. Using the sales forecasting example, by deploying your best performing model, you will increment your plan with one deployment. If you then retrain and redeploy your model you will have two deployments. If you determine that the newer model is better, and delete the original, your deployment count will decremented by one.  

**What specific kind of compute resources will my deployments be run on?** 

The Azure Machine Learning Model Management can run your deployments as docker containers on the Azure Container Service, Azure Virtual Machines, and local machines with more targets coming in the future. Please note that you will be billed independently for any consumed compute resources, based upon their individual pricing.     

**Can I use the  Azure Machine Learning Model Management to deploy models built using tools other than the Experimentation Service?**

You get the best experience when you deploy models created using the Experimentation Service, but the models that you can deploy are not limited to the ones created using Experimentation Service. We support a variety of models (such as Spark ML, TensorFlow, CNTK, scikit-learn, Keras, etc.) created using tools such as Azure Batch AI Training, Microsoft ML Server, or any other 3rd party tools.

**Can I use my own Azure resources?**

Yes, Azure Machine Learning Experimentation Service and Azure Machine Learning Model Management will work in conjunction with multiple Azure data stores, compute workloads and other services. For details on the services that you may need, please refer to our technical documentation.

**Do you support both on premise and cloud deployment scenarios?**

Yes. We support local and on premise deployment scenarios via Docker containers. Local execution targets include: single-node Docker deployments, Microsoft SQL Server with ML Services, Hadoop or Spark. We also support cloud deployments via Docker, including: clustered deployments via Azure Container Service and Kubernetes, HDInsight or Spark clusters. Edge scenarios are supported via Docker containers and Azure IOT Edge. 

**Can I run a Docker image that was created using the Azure Machine Learning CLI on another host?**

When you use the CLI to create a web service, it creates a docker image containing the web service and the dependent libraries. The CLI then returns the path to the Docker image file.
You can use the returned path to deploy the image as a web service on any docker host.

**Do you support for GPUs?**

Yes, the By using GPUs, you can accelerate the training time of deep neural network models significantly. In this document, you'll learn how to configure Vienna to use GPU-based Data Science Virtual Machine (DSVM) as execution target. While in principle it is possible to use GPUs on any Linux machine, the DSVM comes with the required drivers and libraries pre-installed, making the set-up much easier. Make sure you have installed Vienna app + CLI properly before you follow the below steps. Yes for experimentation but not model management. You can use models trained on GPU for inferencing on CPUs.

**Do you support retraining of deployed models?**

Yes,you can deploy multiple versions of the same model and the Model Management Service will support  service updates for all updated models and images.

##Workbench

**What is the Azure Machine Learning Workbench?**

Workbench is a code-first, extensible machine learning application built from the ground up for professional data scientists. Available for Windows and Mac, Workbench provides overview, management, and control for machine learning solutions. Workbench includes access to cutting edge AI frameworks from both Microsoft and the open source community toolkits including TensorFlow, Microsoft Cognitive Toolkit, Spark ML, scikit-learn and much more. We’ve enabled integration with popular data science IDEs such as Jupyter notebooks, PyCharm, or Visual Studio. Workbench has built-in data preparation capabilities to rapidly sample, understand, and prepare data, whether structured or unstructured. PROSE is built on cutting-edge technology from Microsoft Research, and can automatically program data preparation and transformations by example. PROSE can be used on sample data, output as Python or PySpark code, and then unleashed at scale. 

**Is Workbench an IDE?**

No, Workbench has been designed as a companion to popular IDEs such as Jupyter Notebooks, Visual Studio Code and PyCharm, but it is not a fully functional IDE. Workbench offers some basic text editing capabilities, but debugging, intellisense and other commonly used IDE capabilities are not supported. We recommend that you use your favorite IDE for code development, editing and debugging. 

**Will I be charged for Azure Machine Learning Workbench?**

No. Azure Machine Learning Workbench is a free application. You can download it on as many machines, and for as many users, as you need. In order to use the Azure Machine Learning Workbench, you must have an Experimentation account.  The Azure Machine Learning Workbench will let you develop models locally on your own machine or on the cloud, and makes it easy to then scale and deploy your job in Azure.  

**Do you support command line capabilities?**

A: Yes, Workbench offers a full CLI interface. Our Machine Learning CLI is installed by default with Workbench and is also provided as part of the Linux Data Science virtual machine on Azure. 

**Azure is a ‘cloud’. Why is the AML workbench a desktop application?**

AML Workbench fulfills the Azure promise of offering consistent on-premises and hybrid cloud capabilities. Our new application allows data scientists to use their desktop when appropriate, while still enabling them to connect to the cloud for resource intensive activities such as training and scoring on large data sets, or real time predictions at scale. 

**On which operating systems can I use Workbench?**

A: Workbench can be installed on Windows or MacOs. 

**Are there other dependencies or requirements?**

Training or deploying models in local Docker containers will require installation of the Docker engine on your Windows or MacOS system. (Please note that Docker on Windows is only supported on Windows 10.) For more information or to acquire Docker for Windows or MacOS, please visit the Docker site. 

**Can I use Jupyter Notebooks with Workbench?**

Yes! You can run Jupyter notebooks in Workbench, with Workbench as the client hosting application, just as you would use a browser as a client. 

**Which Jupyter Notebook kernels are supported?**

A: The current version of Jupyter included with Workbench will launch a Python 3 kernel, and an additional kernel for each .runconfig file in your aml_config folder. Current supported run configs include:
- Local Python
- Python in local Docker

##Data Formats and Capabilities

**Which file formats are currently supported for data ingestion in Workbench?**

The data preparation tools in Workbench currently support ingestion from the following formats: 
- Delimited files such as CSV, TSV, etc.  
- Fixed width files
- Plain text files
- Excel (.xls/xlsx)
- JSON files
- Parquet files 
- Custom files (scripts)
If your solution requires data ingestion from additional sources, Python code can be used to... 

**Which data storage locations are currently supported?**

For public preview, Workbench will support data ingestion from: 
- Local hard drive or mapped network storage location
- Azure BLOB or Azure Storage (requires an Azure subscription)
- Azure Data Lake or Azure Data Lake Storage (requires an Azure subscription)
- Azure SQL Server
- Microsoft SQL Server


**You’ve mentioned advanced data wrangling and data preparation capabilities. What kinds of data transformations are available?**

For public preview, Workbench will support “Derive Column by Example”, “Split Column by Example”, “Text Clustering”, “Handle Missing Values” and many others.  Workbench will also support data type conversion, data aggregation (e.g. COUNT, MEAN, VARIANCE, etc.), and complex data joins. For a full list of supported capabilities, please see our product documentation. 

**Are there any data size limits enforced by AML Workbench, Experimentation or Model Management Services?**

A: No, neither the new services nor the Workbench impose any data limitations. However, limitations on size and scope will be introduced by the particular environment in which you are performing your data preparation, model training, experimentation or deployment. For example, if you are targeting a local environment for training, you will be limited by the available space in your hard drive. Alternatively, if you are targeting HDInsight, you will be limited by any associated size or compute restraints. 

##Algorithms and Libraries

**What algorithms are supported in AML Workbench?**

Our preview products and services include the best of the open source community and offer support for a wide range of algorithms and libraries including TensorFlow, scikit-learn, Apache Spark, and the Microsoft Cognitive Toolkit. Workbench also includes the Microsoft RevoScalePy package.

**How does Azure Machine Learning relate to the Microsoft Cognitive Toolkit?**

The Microsoft Cognitive Toolkit is available under an open-source license is one of many frameworks supported by our new tools and services. CNTK is a unified deep-learning toolkit that allows you to easily consume and combine popular machine learning models including Feed-Forward Deep Neural Networks, Convolutional Nets,  Sequence-to-Sequence and Recurrent Networks. For more information on Microsoft Cognitive Toolkit, please visit our product documentation. 

##Pricing and Billing

**Will you charge for Azure Machine Learning during preview?**	

A: The Experimentation and Model Management Services will incur discounted charges during public preview, but you can also take advantage of free tiers before committing. Moreover, Workbench will be made available free of charge to Azure subscribers. For more information, please visit our pricing page.

**Will I be charged based on how many experiments I run?**

No, the Experimentation Service allows as many experiments as you need, and charges only based on the number of users. Experimentation compute resources are charged separately.  Users are encouraged to perform multiple experiments (such as evaluating the performance of various algorithms on a dataset or iteratively tweaking algorithm parameters).  You have control over the type of compute resources you want to use based on your needs.

**Will I be charged based on how many times my web services is called?**

No. Web services can be called as often as required, without any Model Management billing implications. You have full control to scale your deployments to meet the needs of your applications.

**How can I scale the number of units I have purchased in the Azure Machine Learning Model Management?**

You can change the number of units, either up or down, using either the Azure Management Portal or the CLI. 

**What will my bill look like?**

You will be billed daily. For billing purposes, a day commences at midnight UTC. Bills are generated monthly. Please note that you will incur separate charges for any Azure services consumed in conjunction with Azure Machine Learning, including but not limited to compute charges, HDInsight, Azure Container Service, Azure Container Registry, Azure Blob Storage, Application Insights, Azure Key Vault, Visual Studio Team Services, Virtual Network, Azure Event Hub and Azure Stream Analytics. For further details, or to view a sample bill, please visit our pricing page. 

##Support and Training

**Where can I get training for Azure Machine Learning?**

The Azure Machine Learning Documentation Center hosts video tutorials and how-to guides. These step-by-step guides introduce the services and explain the data science life cycle of importing data, cleaning data, building predictive models, and deploying them in production by using Azure Machine Learning. We add new material to the Machine Learning Center on an ongoing basis. You can submit requests for additional learning material on Machine Learning Center at the user feedback forum.

**How do I get support for Azure Machine Learning?**

To get technical support for Azure Machine Learning, go to Azure Support, and select Machine Learning. Azure Machine Learning also has a community forum on MSDN where you can ask questions about Azure Machine Learning. The Azure Machine Learning team monitors the forum. 
