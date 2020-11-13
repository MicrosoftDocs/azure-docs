---
title: Machine Learning Services in Azure SQL Managed Instance (preview)
description: This article provides an overview or Machine Learning Services in Azure SQL Managed Instance.
services: sql-database
ms.service: sql-managed-instance
ms.subservice: machine-learning
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: garyericson
ms.author: garye
ms.reviewer: sstein, davidph
manager: cgronlun
ms.date: 06/03/2020
---

# Machine Learning Services in Azure SQL Managed Instance (preview)

Machine Learning Services is a feature of Azure SQL Managed Instance (preview) that provides in-database machine learning, supporting both Python and R scripts. The feature includes Microsoft Python and R packages for high-performance predictive analytics and machine learning. The relational data can be used in scripts through stored procedures, T-SQL script containing Python or R statements, or Python or R code containing T-SQL.

> [!IMPORTANT]
> Machine Learning Services is a feature of Azure SQL Managed Instance that's currently in public preview.
> This preview functionality is initially available in a limited number of regions in the US, Asia Europe, and Australia with additional regions being added later.
>
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
>
> [Sign up for the preview](#signup) below.

## What is Machine Learning Services?

Machine Learning Services in Azure SQL Managed Instance lets you execute Python and R scripts in-database. You can use it to prepare and clean data, do feature engineering, and train, evaluate, and deploy machine learning models within a database. The feature runs your scripts where the data resides and eliminates transfer of the data across the network to another server.

Use Machine Learning Services with R/Python support in Azure SQL Managed Instance to:

- **Run R and Python scripts to do data preparation and general purpose data processing** - You can now bring your R/Python scripts to Azure SQL Managed Instance where your data lives, instead of having to move data out to some other server to run R and Python scripts. You can eliminate the need for data movement and associated problems related to latency, security, and compliance.

- **Train machine learning models in database** - You can train models using any open source algorithms. You can easily scale your training to the entire dataset rather than relying on sample datasets pulled out of the database.

- **Deploy your models and scripts into production in stored procedures** - The scripts and trained models can be operationalized simply by embedding them in T-SQL stored procedures. Apps connecting to Azure SQL Managed Instance can benefit from predictions and intelligence in these models by just calling a stored procedure. You can also use the native T-SQL PREDICT function to operationalize models for fast scoring in highly concurrent real-time scoring scenarios.

Base distributions of Python and R are included in Machine Learning Services. You can install and use open-source packages and frameworks, such as PyTorch, TensorFlow, and scikit-learn, in addition to the Microsoft packages [revoscalepy](/sql/advanced-analytics/python/ref-py-revoscalepy) and [microsoftml](/sql/advanced-analytics/python/ref-py-microsoftml) for Python, and [RevoScaleR](/sql/advanced-analytics/r/ref-r-revoscaler), [MicrosoftML](/sql/advanced-analytics/r/ref-r-microsoftml), [olapR](/sql/advanced-analytics/r/ref-r-olapr), and [sqlrutils](/sql/advanced-analytics/r/ref-r-sqlrutils) for R.

<a name="signup"></a>

## Sign up for the preview

This limited public preview is subject to the [Azure preview terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). 

If you're interested in joining the preview program and accept these terms, then you can request enrollment by creating an Azure support ticket at [**https://azure.microsoft.com/support/create-ticket/**](https://azure.microsoft.com/support/create-ticket/). 

1. On the **Create a support ticket** page, click **Create an Incident**.

1. On the **Help + support** page, click **New support request** to create a new ticket.

1. Select the following options:
   - Issue type - **Technical**
   - Subscription - *select your subscription*
   - Service - **SQL Managed Instance**
   - Resource - *select your managed instance*
   - Summary - *enter a brief description of your request*
   - Problem type - **Machine Learning Services for SQL Managed Instance (Preview)**
   - Problem subtype - **Other issue or "How To" questions**

1. Click **Next: Solutions**.

1. Read the information about the preview, and then click **Next: Details**.

1. On this page:
   - For the question **Are you trying to sign up for the Preview?**, select **Yes**. 
   - For **Description**, enter the specifics of your request, including the logical server name, region, and subscription ID that you want to enroll in the preview. Enter other details as appropriate.
   - Select your preferred contact method. 

1. When you're finished, click **Next: Review + create**, and then click **Create**.

Once you're enrolled in the program, Microsoft will onboard you to the public preview and enable Machine Learning Services for your existing or new database.

Machine Learning Services in SQL Managed Instance is not recommended for production workloads during the public preview.

## Next steps

- See the [key differences from SQL Server Machine Learning Services](machine-learning-services-differences.md).
- To learn how to use Python in Machine Learning Services, see [Run Python scripts](/sql/machine-learning/tutorials/quickstart-python-create-script?context=%252fazure%252fazure-sql%252fmanaged-instance%252fcontext%252fml-context&view=sql-server-ver15).
- To learn how to use R in Machine Learning Services, see [Run R scripts](/sql/machine-learning/tutorials/quickstart-r-create-script?context=%252fazure%252fazure-sql%252fmanaged-instance%252fcontext%252fml-context&view=sql-server-ver15).
- For more information about machine learning on other SQL platforms, see the [SQL machine learning documentation](/sql/machine-learning/).