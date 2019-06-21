---
title: "Tutorial: Prepare data to train a predictive model in R"
titleSuffix: Azure SQL Database Machine Learning Services (preview)
description: In part one of this three-part tutorial series, you'll prepare the data from an Azure SQL database to train a predictive model in R with Azure SQL Database Machine Learning Services (preview).
services: sql-database
ms.service: sql-database
ms.subservice: machine-learning
ms.custom:
ms.devlang: r
ms.topic: tutorial
author: garyericson
ms.author: garye
ms.reviewer: davidph
manager: cgronlun
ms.date: 05/02/2019
---

# Tutorial: Prepare data to train a predictive model in R with Azure SQL Database Machine Learning Services (preview)

In part one of this three-part tutorial series, you'll prepare the data from an Azure SQL database to train a predictive model in R with Azure SQL Database Machine Learning Services (preview).

For this tutorial series, imagine you own a ski rental business and you want to predict the number of rentals that you'll have on a future date. This information will help you get your stock, staff, and facilities ready.

In this article, you'll learn how to:

> [!div class="checklist"]
> * Import a sample database into an Azure SQL database
> * Load the data from the Azure SQL database into a data frame using R
> * Prepare the data by identifying some columns as categorical

In [part two](sql-database-tutorial-predictive-model-build-compare.md), you'll learn how to create and train multiple models, and then choose the most accurate one.

In [part three](sql-database-tutorial-predictive-model-deploy.md), you'll learn how to store the model in a database, and then create a stored procedure that can make predictions based on new data.

[!INCLUDE[ml-preview-note](../../includes/sql-database-ml-preview-note.md)]

## Prerequisites

* Azure subscription - If you don't have an Azure subscription, [create an account](https://azure.microsoft.com/free/) before you begin.

* Azure SQL Database Server with Machine Learning Services enabled - During the public preview, Microsoft will onboard you and enable machine learning for your existing or new databases. Follow the steps in [Sign up for the preview](sql-database-machine-learning-services-overview.md#signup).

* RevoScaleR package - See [RevoScaleR](https://docs.microsoft.com/sql/advanced-analytics/r/ref-r-revoscaler?view=sql-server-2017#versions-and-platforms) for options to install this package locally.

* R IDE - This tutorial uses [RStudio Desktop](https://www.rstudio.com/products/rstudio/download/).

* SQL query tool - This tutorial assumes you're using [Azure Data Studio](https://docs.microsoft.com/sql/azure-data-studio/what-is) or [SQL Server Management Studio](https://docs.microsoft.com/sql/ssms/sql-server-management-studio-ssms) (SSMS).

## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com/).

## Import the sample database

The sample dataset used in this tutorial has been saved to a **.bacpac** database backup file for you to download and use.

1. Download the file [TutorialDB.bacpac](https://sqlchoice.blob.core.windows.net/sqlchoice/static/TutorialDB.bacpac).

1. Follow the directions in [Import a BACPAC file to create an Azure SQL database](https://docs.microsoft.com/azure/sql-database/sql-database-import), using these details:

   * Import from the **TutorialDB.bacpac** file you downloaded
   * During the public preview, choose the **Gen5/vCore** configuration for the new database
   * Name the new database "TutorialDB"

## Load the data into a data frame

To use the data in R, you'll load the data from the Azure SQL database into a data frame (`rentaldata`).

Create a new RScript file in RStudio and run the following script. Replace **Server**, **UID**, and **PWD** with your own connection information.

```r
#Define the connection string to connect to the TutorialDB database
connStr <- paste("Driver=SQL Server",
               "; Server=", "<Azure SQL Database Server>",
               "; Database=TutorialDB",
               "; UID=", "<user>",
               "; PWD=", "<password>",
                  sep = "");

#Get the data from the table
SQL_rentaldata <- RxSqlServerData(table = "dbo.rental_data", connectionString = connStr, returnDataFrame = TRUE);

#Import the data into a data frame
rentaldata <- rxImport(SQL_rentaldata);

#Take a look at the structure of the data and the top rows
head(rentaldata);
str(rentaldata);
```

You should see results similar to the following.

```results
   Year  Month  Day  RentalCount  WeekDay  Holiday  Snow
1  2014    1     20      445         2        1      0
2  2014    2     13       40         5        0      0
3  2013    3     10      456         1        0      0
4  2014    3     31       38         2        0      0
5  2014    4     24       23         5        0      0
6  2015    2     11       42         4        0      0
'data.frame':       453 obs. of  7 variables:
$ Year       : int  2014 2014 2013 2014 2014 2015 2013 2014 2013 2015 ...
$ Month      : num  1 2 3 3 4 2 4 3 4 3 ...
$ Day        : num  20 13 10 31 24 11 28 8 5 29 ...
$ RentalCount: num  445 40 456 38 23 42 310 240 22 360 ...
$ WeekDay    : num  2 5 1 2 5 4 1 7 6 1 ...
$ Holiday    : int  1 0 0 0 0 0 0 0 0 0 ...
$ Snow       : num  0 0 0 0 0 0 0 0 0 0 ...
```

## Prepare the data

In this sample database, most of the preparation has already been done, but you'll do one more preparation here.
Use the following R script to identify three columns as *categories* by changing the data types to *factor*.

```r
#Changing the three factor columns to factor types
rentaldata$Holiday <- factor(rentaldata$Holiday);
rentaldata$Snow    <- factor(rentaldata$Snow);
rentaldata$WeekDay <- factor(rentaldata$WeekDay);

#Visualize the dataset after the change
str(rentaldata);
```

You should see results similar to the following.

```results
data.frame':      453 obs. of  7 variables:
$ Year       : int  2014 2014 2013 2014 2014 2015 2013 2014 2013 2015 ...
$ Month      : num  1 2 3 3 4 2 4 3 4 3 ...
$ Day        : num  20 13 10 31 24 11 28 8 5 29 ...
$ RentalCount: num  445 40 456 38 23 42 310 240 22 360 ...
$ WeekDay    : Factor w/ 7 levels "1","2","3","4",..: 2 5 1 2 5 4 1 7 6 1 ...
$ Holiday    : Factor w/ 2 levels "0","1": 2 1 1 1 1 1 1 1 1 1 ...
$ Snow       : Factor w/ 2 levels "0","1": 1 1 1 1 1 1 1 1 1 1 ...
```

The data is now prepared for training.

## Clean up resources

If you're not going to continue with this tutorial, delete the TutorialDB database from your Azure SQL Database server.

From the Azure portal, follow these steps:

1. From the left-hand menu in the Azure portal, select **All resources** or **SQL databases**.
1. In the **Filter by name...** field, enter **TutorialDB**, and select your subscription.
1. Select your TutorialDB database.
1. On the **Overview** page, select **Delete**.

## Next steps

In part one of this tutorial series, you completed these steps:

* Import a database backup file into an Azure SQL database
* Load the data from the Azure SQL database into a data frame using R
* Prepare the data by identifying some columns as categories

To create a machine learning model that uses data from the TutorialDB database, follow part two of this tutorial series:

> [!div class="nextstepaction"]
> [Tutorial: Create a predictive model in R with Azure SQL Database Machine Learning Services (preview)](sql-database-tutorial-predictive-model-build-compare.md)
