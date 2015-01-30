<properties 
	pageTitle="Quick start guide to R for Azure Machine Learning Studio" 
	description="How to use R in the Azure Machine Learning Studio" 
	services="machine-learning" 
	documentationCenter="" 
	authors="blackmist" 
	manager="paulettm" 
	editor="cgronlun"/>

<tags 
	ms.service="machine-learning" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="10/14/2014" 
	ms.author="larryfr"/>

#Quick Start Guide to R for Azure ML

Stephen F Elston, PhD.

##  Introduction

Azure ML contains many powerful machine learning and data manipulation modules.  The powerful R language has been described as the lingua franca of analytics.  Happily, analytics and data manipulation in Azure ML can be extended using R.  This combination provides the scalability ease of deployment of Azure ML with the flexibility and deep analytics of R.

This document will help you quickly start extending Azure ML using the R language. This guide contains the information you will need to create, test and execute R code within Azure ML. As you work though this quick start guide, you will create a complete forecasting solution using the R language in Azure ML.  

###Forecasting and the Data Set

Forecasting is a widely employed and quite useful analytical method. Common uses range from predicting sales of seasonal items, determining optimal inventory levels, to predicting macroeconomic variables. Forecasting is typically done with time series models.

Time series data are data in which the values have a time index. The time index can be regular, e.g. every month or every minute, or irregular. A time series model is based on time series data. R contains a flexible framework and extensive analytics for time series data.

In this quick start guide we will be working with California dairy production and pricing data.  These data include monthly information on the production of several dairy products and the price of milk fat, a benchmark commodity.

The  data used in this article, along with R scripts, can be [downloaded here][download]. This data was originally synthesized from information available from the University of Wisconsin at http://future.aae.wisc.edu/tab/production.html.

###	Organization

We will progress through several steps as you learn how to create, test and execute analytics and data manipulation R code in the Azure ML environment.  

* First we will explore the basics of using the R language in Azure ML Studio environment.

* Then we progress to discussing various aspects of I/O for data, R code and graphics in the Azure ML environment.

* We will then construct the first part of our forecasting solution by creating code for data cleaning and transformation.

* With our data prepared we will perform an analysis of the correlations between several of the variables in our data set.

* Finally, we will create a seasonal time series forecasting model for milk production.

##Table of Contents

* [Interacting with R in ML Studio](#mlstudio)

* [Getting Data In and Out of the Execute R Script Module](#scriptmodule)

* [Data Filtering and Transformation](#filtering)

* [Time Series Objects and Correlation Analysis](#timeseries)

* [Time Series Example: Seasonal Forecasting](#seasonalforecasting)

* [Appendix A - Guide to RStudio](#appendixa)

* [Appendix B - Further Reading](#appendixb)

##<a id="mlstudio"></a>Interacting with R in ML Studio

This section takes you through some basics of interacting with R in the ML Studio environment.  The R language provides a powerful tool to create customized analytics and data manipulation modules within the Azure ML environment.

I will use RStudio to develop, test and debug R code on a small scale.  This code is then cut and paste into an Execute R Script module in ML Studio ready to run.  

###The Execute R Script Module

Within ML Studio, R scripts are run within the Execute R Script module.  An example of the Execute R Script module in ML Studio is shown in Figure 1.

 ![The ML Studio environment showing the Execute R Script module selected][1]

*Figure 1. The ML Studio environment showing the Execute R Script module selected.*

Referring to Figure 1, let's look at some of the key parts of the ML Studio environment for working with the Execute R Script module.

- The modules in the experiment are shown in the center pane.

- The upper part of the right pane contains a window to view and edit your R scripts.  

- The lower part of right pane shows some properties of the Execute R Script. You can view the error and output logs by clicking on the appropriate spots of this pane.

We will, of course, be discussing the Execute R Script in greater detail in the rest of this document.

When working with complex R functions, I recommend that you edit, test and debug in RStudio. As with any software development, extend your code incrementally and test it on small simple test cases. Then cut and paste your functions into the R script window of the Execute R Script module.  This approach allows you to harness both the RStudio IDE and the power of Azure ML.  

####Executing R code

Any R code in the Execute R Script module will execute when you run the experiment by clicking on the **Run** button.  When execution has completed, a check mark will appear on the Execute R Script icon.

####Defensive R Coding for Azure ML

If you are developing R code for, say a web service using Azure ML, you should definitely plan how your code will deal with an unexpected data input and exceptions. To maintain clarity, I have not included much in the way of checking or exception handling in most of the code examples shown.  However, as we proceed I will give you several examples of functions using R's exception handling capability.  

If you need a more complete treatment of R exception handling I recommend you read the applicable sections of the book by Wickham listed in [Appendix B - Further Reading](#appendixb).


####Debugging and Testing R in ML Studio

To reiterate, I recommend you test and debug your R code on a small scale in RStudio.  However, there are cases where you will need to track down R code problems in the Execute R Script itself.  In addition, it is good practice to check your results in ML Studio.

Output from the execution of your R code and on the Azure ML platform is found primarily in output.log. Some additional information will be seen in the error.log.  

If an error occurs in ML Studio while running your R code, your first course of action should be to look at error.log. The error.log can contain useful error messages to help you understand and correct your error.  To view the error.log, click on **View error log** on the **properties pane** for the Execute R Script containing the error.

For example, I ran the following R code, with an undefined variable y, in an Execute R Script module:

```r
x <- 1.0
z <- x + y
```

This code fails to execute, resulting in an error condition. By clicking on **View error log** on the **properties pane** the display shown in Figure 2 is produced:

  ![Error message pop up][2]

*Figure 2. Error message pop up.*

It looks like we need to look in the output.log to see the R error message. Click on the Execute R Script and then click on the **View output.log** item on the **properties pane** to the right. A new browser window opens and I see the following:


	[ModuleOutput] [1] 14000
	[ModuleOutput]
	[ModuleOutput] Loading objects:
	[ModuleOutput]
	[ModuleOutput]   port1
	[ModuleOutput]
	[ModuleOutput] [1] "Loading variable port1..."
	[ModuleOutput]
	[ModuleOutput] Error in eval(expr, envir, enclos) : object 'y' not found

This error message contains no surprises and clearly identifies the problem.

To inspect the value of any object in R you can print these values to the output.log file.  The rules for examining object values are essentially the same as in an interactive R session.  For example, if you type a variable name on a line, the value of the object will be printed to the output.log file.  

####Packages in ML Studio

Azure ML comes with over 350 preinstalled R packages.  You can use the following code in the Execute R Script module to retrieve a list of the preinstalled packages.

```r
data.set <- data.frame(installed.packages())
maml.mapOutputPort("data.set")
```

If you don't understand the last line of this code at the moment read on.  In the rest of this document we will extensively discuss using R in the Azure ML environment.

###	Introducing RStudio

RStudio is a widely used integrated development environment (IDE) for R.  I will use RStudio for editing, testing and debugging some of the R code used in this Quick Start Guide.  Once R code is tested and ready, you simply cut and paste from the RStudio editor into an ML Studio Execute R Script module.  

If you do not have R installed on your desktop machine I recommend you do so now. Free downloads of open source R are available at the Comprehensive R Archive Network or CRAN at http://www.r-project.org/. There are downloads available for Windows, MacOS, and Linux/UNIX. Choose a nearby mirror and follow the download directions.   In addition, CRAN contains a wealth of useful analytics and data manipulation packages.

If you are new to RStudio, you should download and install the desktop version. You can find the RStudio downloads for Windows, MacOS, and Linux/UNIX  at http://www.rstudio.com/products/RStudio/. Follow the directions provided to install RStudio on your desktop machine.  

A tutorial introduction to RStudio is available at https://support.rstudio.com/hc/en-us/sections/200107586-Using-RStudio.

I provide some additional information on using RStudio in [Appendix A][appendixa].  

##<a id="scriptmodule"></a>Getting Data In and Out of the Execute R Script Module

In this section we will discuss how you get data into and out of the Execute R Script module.  We will review how to handle various data types read into and out of the Execute R Script module.

The complete code for this section is in the zip file you downloaded earlier.

###Loading and Checking Data in ML Studio

####<a id="loading"></a>Loading the dataset

We will start by loading the **csdairydata.csv** file into our Azure ML Studio.

- Start you Azure ML Studio environment.

- Click on the + at the lower left of your screen and select **Dataset**.

- Select the file with **Browse**.

- Make sure you have selected **Generic CSV file with header (.csv)**.

- Click the check mark.

- You should see the new data sets by clicking on the **Datasets** tab.  

####Creating an Experiment

Now that we have some data in ML Studio, we need to create an experiment to do the analysis.  

- Click on the + at the lower left and select **Experiment**

- Give your experiment a title.  I will call my experiment **CA Dairy Analysis**.

- Search for the data set you just uploaded.

- Drag and drop the **csdairydata.csv dataset** onto the experiment.  

- In the **Search experiment items** box on the top of the left pane, type **Execute R Script**.  You will see the module appear in the search list.

- Drag and drop the Execute R Script module onto your pallet.  

- Connect the output of the **csdairydata.csv dataset** to the left most input (**Dataset1**) of the **Execute R Script**.

- **Don't forget to click on 'Save'!**  

At this point your experiment should look something like Figure 3.

![The CA Dairy Analysis Experiment with dataset and Execute R Script module][3]

*Figure 3.  The CA Dairy Analysis Experiment with dataset and Execute R Script module.*

####Check on the data

Let's have a look at the data we have loaded into our experiment.  In the experiment, double click on the output of the **cadairydata.csv dataset**  and select **visualize**.   You should see something like Figure 4.  

![The summary of the cadairydata.csv data set][4]

*Figure 4.  The summary of the cadairydata.csv data set.*

In this view we see a lot of useful information.  The **Feature Type** row shows us what data types Azure ML Studio assigns to the columns in our data set.  We also see the first several rows of that data set.  Having a quick look like this is a good sanity check before we start to do any serious work.

###	First R Script

Let's create a simple first R script to experiment with in Azure ML Studio.  I have created and tested the following script in RStudio:  

```r
## Only one of the following two lines should be used
## If running in ML Studio use the first line with maml.mapInputPort().
## If in RStudio used the second line with read.csv()
cadairydata <- maml.mapInputPort(1)
# cadairydata  <- read.csv("cadairydata.csv", header = TRUE, stringsAsFactors = FALSE)
str(cadairydata)
pairs(~ Cotagecheese.Prod + Icecream.Prod + Milk.Prod + N.CA.Fat.Price, data = cadairydata)
## The following line should be executed only when running in
## Azure ML Studio.
maml.mapOutputPort('cadairydata')
```

Now I need to transfer this script to my Azure ML Studio.  I could simply cut and paste.  However, in this case, I will transfer my R script via a zip file.

###	Data input to the Execute R Script module

Let's have a look at the inputs to the Execute R Script module.  In this example we will read the California dairy data into the Execute R Script module.  

There are three possible inputs for the Execute R Script module.  You may use any one or all of these inputs, depending on your application.  It is also perfectly reasonable to use an R script which takes no input at all.  

Let's look at each of this inputs going from left to right. You can see the names of each of the inputs by placing your cursor over the input and reading the tool tip.  

####	Script Bundle

The Script Bundle input allows you to pass the contents of a zip file into Execute R Script module.  You can use one of the following commands to read the contents of the zip file into your R code:

```r
source("src/yourfile.R") # Reads an zipped R script
load("src/yourData.rdata") # Reads a zipped R data file
```

> [AZURE.NOTE] Azure ML treats files in the zip as if they are in the src/ directory, so you need to prefix your file names with this directory name.  

We already discussed loading data sets in [Loading the dataset](#loading).  Once you have created and tested the R script shown in the previous section do the following:

1. Save the R script into a .R file.  I call my script file "simpleplot.R".  

2.  Create a zip file and copy your script into this zip file.

3.	Add your file to the **datasets** in ML Studio, specifying the type as **zip**. You should now see the zip file in your data sets.

4.	Drag and drop the zip file from **datasets** onto the **ML Studio canvas**.

5.	Connect the output of the **zip data** icon to the **Script Bundle** input of the **Execute R script** module.

6.	Type the `source()` function with your zip file name into the code window for the **Execute R Script** module.  In my case I typed `source("src/SimplePlot.R")`.  

7.	Make sure you click **Save**.

Once these steps are complete, the Execute R Script module will execute the R script in the zip file when the experiment is run. At this point your experiment should look something like Figure 5.

![Experiment using zipped R script][6]

*Figure 5. Experiment using zipped R script.*

####Dataset1

You can pass a rectangular table of data to your R code using the Dataset1 input.  In our simple script the `maml.mapInputPort(1)` function reads the data from port 1.  These data are then assigned to a data frame variable name in your code.  In our simple script the first line of code performs the assignment.

```r
cadairydata <- maml.mapInputPort(1)
```

Execute your experiment by clicking on the **Run** button.  When the execution finishes, click on the Execute R Script module then click **View output log** on the properties pane.  A new page should appear in your browser showing the contents of the Output.log file.  When you scroll down you should see something like the following:

	[ModuleOutput] [1] "Loading variable port1..."
	[ModuleOutput]
	[ModuleOutput] 'data.frame':	228 obs. of  9 variables:
	[ModuleOutput]
	[ModuleOutput]  $ Column 0         : int  1 2 3 4 5 6 7 8 9 10 ...
	[ModuleOutput]
	[ModuleOutput]  $ Year.Month       : num  1995 1995 1995 1995 1995 ...
	[ModuleOutput]
	[ModuleOutput]  $ Month.Number     : int  1 2 3 4 5 6 7 8 9 10 ...
	[ModuleOutput]
	[ModuleOutput]  $ Year             : int  1995 1995 1995 1995 1995 1995 1995 1995 1995 1995 ...
	[ModuleOutput]
	[ModuleOutput]  $ Month            : chr  "Jan" "Feb" "Mar" "Apr" ...
	[ModuleOutput]
	[ModuleOutput]  $ Cotagecheese.Prod: num  4.37 3.69 4.54 4.28 4.47 ...
	[ModuleOutput]
	[ModuleOutput]  $ Icecream.Prod    : num  51.6 56.1 68.5 65.7 73.7 ...
	[ModuleOutput]
	[ModuleOutput]  $ Milk.Prod        : num  2.11 1.93 2.16 2.13 2.23 ...
	[ModuleOutput]
	[ModuleOutput]  $ N.CA.Fat.Price   : num  0.98 0.892 0.892 0.897 0.897 ...

These results are mostly as expected, with 228 observations and 9 columns in the dataframe.  We can see the column names, the R data type and a sample of each column.

> [AZURE.NOTE] This same printed output is conveniently available from the R Device output of the Execute R Script module.  We will discuss the outputs of the Execute R module in the next section.  

####Dataset2

The behavior of the Dataset2 input is identical to that of Dataset1.  Using this input you can pass a second rectangular table of data into your R code.  The function `maml.mapInputPort(2)`, with the argument 2, is used to pass this data.  

###Execute R Script outputs

####Output a dataframe

You can output the contents of an R dataframe as a rectangular table through the Result Dataset1 port using the `maml.mapOutputPort()` function.  In our simple R script this is performed by the following line:

```r
maml.mapOutputPort('cadairydata')
```

After running the experiment, click on the Result Dataset1 output port and then click on **Visualize**.  You should see something like Figure 6.

![The visualization of the output of the California dairy data][7]

*Figure 6. The visualization of the output of the California dairy data.*

This output looks identical to the input, exactly as we expected.  

###	R Device output

The Device output of the Execute R Script module contains messages and graphics output.  Both standard output and standard error messages from R are sent to the R Device output port.  

To view the R Device output, click on the port and then on **Visualize**.  We see the standard output and standard error from the R script in Figure 7.

![Standard output and standard error from the R Device port][8]

*Figure 7. Standard output and standard error from the R Device port.*

Scrolling down we see the graphics output from our R script in Figure 8.  

![Graphics output from the R Device port][9]

*Figure 8. Graphics output from the R Device port.*  

##<a id="filtering"></a>Data filtering and transformation

In this section we will perform some basic data filtering and transformation operations on the California dairy data.  By the end of this section we will have data in a format suitable for building an analytic model.  

More specifically, in this section we will perform several common data cleaning and transformation tasks; type transformation, filtering on dataframes, adding new computed columns, and value transformations. This background should help you deal with the many variations encountered in real-world problems.

The complete R code for this section is available in the zip file you downloaded earlier.

###	Type transformations

Now that we can read the California dairy data into the R code in the Execute R Script module, we need to ensure that the data in the columns has the intended type and format.  

R is a dynamically typed language, which means that data types are coerced from one to another as required. The atomic data types in R include numeric, logical and character.  The factor type is used to compactly store categorical data.  You can find much more information on data types in the references in [Appendix B - Further reading](#appendixb).

When tabular data is read into R from an external source, it is always a good idea to check the resulting types in the columns.  You may want a column of type character, but in many cases this will show up as factor or vice versa.  In other cases a column you think should be numeric is represented by character data, e.g. '1.23' rather than 1.23 as a floating point number.  

Fortunately, it is easy to convert one type to another, as long as mapping is possible.  For example, you cannot convert 'Nevada' into a numeric value, but you can convert it to a factor (categorical variable).  As another example, you can convert a numeric 1 into a character '1' or a factor.  

The syntax for any of these conversions is simple: `as.datatype()`.  These type conversion functions include the following:

* `as.numeric()`

* `as.character()`

* `as.logical()`

* `as.factor()`

Looking at the data types of the columns we input in the previous section. All columns are of type numeric, except for the column labeled 'Month', which is of type character.  Let's convert this to a factor and test the results.  

I have deleted the line which created the scatterplot matrix and added a line converting the 'Month' column to a factor.  In my experiment I will just cut and paste the R code into the code window of the Execute R Script Module.  You could also update the zip file and upload it to Azure ML Studio but this takes several steps.  

```r
## Only one of the following two lines should be used
## If running in ML Studio use the first line with maml.mapInputPort().
## If in RStudio used the second line with read.csv()
cadairydata <- maml.mapInputPort(1)
# cadairydata  <- read.csv("cadairydata.csv", header = TRUE, stringsAsFactors = FALSE)
## Ensure the coding is consistent and convert column to a factor
cadairydata$Month <- as.factor(cadairydata$Month)
str(cadairydata) # Check the result
## The following line should be executed only when running in
## Azure ML Studio.
maml.mapOutputPort('cadairydata')
```

Let's execute this code and look at the output. The output from **Visualize** on the R Device menu is shown in Figure 9.

![Summary of the dataframe with a factor variable][10]

*Figure 9. Summary of the dataframe with a factor variable.*

The type for Month should now say '**Factor w/ 14 levels**'.  This is a problem since there are only 12 months in the year. You can also check to see that the type in the **Visualize** of the Result Dataset port is '**Categorical**'.

The problem is that the 'Month' column has not been coded systematically.  In some cases a month is called April and in others it is abbreviated as Apr.  We can solve this problem by trimming the string to 3 characters.  The line of code now looks like the following:

```r
## Ensure the coding is consistent and convert column to a factor
cadairydata$Month <- as.factor(substr(cadairydata$Month, 1, 3))
```

Rerun the experiment and **Visualize** the output at the R Device port with the results shown in Figure 10.  

![Summary of the dataframe with correct number of factor levels][11]

*Figure 10. Summary of the dataframe with correct number of factor levels.*

Our factor variable now has the desired 12 levels.

###Basic data frame filtering

R dataframes support powerful filtering capabilities.  Datasets can be subsetted by using logical filters on either rows or columns. In many cases, complex filter criteria will be required. The references in [Appendix B - Further reading](#appendixb) contain extensive examples of filtering dataframes.  

There is one bit of filtering we should do on our dataset. If you look at the columns in the cadariydata dataframe, you will see two unnecessary columns.  The first column just holds a row number, which is not very useful. The second, Year.Month, column contains redundant information.  We can easily exclude these columns using the following R code.

> [AZURE.NOTE] From now on in this section, I will just show you the additional code I am adding in the execute R Script module.  I will add each new line **before** the `str()` function. I use this function to verify my results in Azure ML Studio.

I add the following line to my R code in the Execute R Script module.

```r
# Remove two columns we do not need
cadairydata <- cadairydata[, c(-1, -2)]
```

Run this code in your experiment and check the result with **Visualize** on the R Device port. These results are shown in figure 11.

![The summary of the dataframe with two columns removed][12]

*Figure 11.  The summary of the dataframe with two columns removed.*

Good news! We get the expected results.

###Adding a New Column

To create time series models it will be convenient to have a column containing the months since the start of the time series. We will create a new column 'Month.Count'.

To help organize the code we will create our first simple function, `num.month()`.  We then apply this function to create a new column in the dataframe. The new code is as follows:

```r
## Create a new column with the month count
## Function to find the number of months from the first
## month of the time series.
num.month <- function(Year, Month) {
  ## Find the starting year.
  min.year  <- min(Year)

  ## Compute the number of months from the start of the time series.
  12 * (Year - min.year) + Month - 1
}

# Compute the new column for the dataframe.
cadairydata$Month.Count <- num.month(cadairydata$Year, cadairydata$Month.Number)
```

Now run the updated experiment and use the **Visualize** on the R Device port to view the results. These results are shown in Figure 12.

![Summary of the dataframe with the additional column][13]

*Figure 12. Summary of the dataframe with the additional column.*

It looks like everything is working.  We have the new column with the expected values in our dataframe

###Value Transformations

In this section we will perform some simple transformations on the values in some of the columns of our dataframe.  The R language supports nearly arbitrary value transformations.  The references in [Appendix B - Further Reading](#appendixb) contain extensive examples.

If you look at the values in the summaries of our datafame you should see something odd here. Is more ice cream than milk produced in California?  No, of course not, as this makes no sense, sad as this fact may be to some of us ice cream lovers. The units are different. The price is in units of US pounds, milk is in units of 1 M US pounds, and ice cream is in units of 1,000 US gallons and cottage cheese is in units of 1,000 US pounds. Assuming ice cream weights about 6.5 pounds per gallon, we can easily do the multiplication to convert these values so they are all in equal units of 1,000 pounds.

For our forecasting model we use a multiplicative model for trend and seasonal adjustment of these data. A log transformation allows us to use a linear model, simplifying this process.  We can apply the log transformation in the same function where the multiplier is applied.

In the following code, I define a new function, `log.transform()`, and apply it to the rows containing the numerical values. The R `Map()` function is used to apply the `log.transform()` function to the selected columns of the dataframe.  `Map()` is similar to `apply()` but allows for more than one list of arguments to the function. Note that a list of multipliers supplies the second argument to the `log.transform()` function. The `na.omit()` function is used as a bit of clean up to ensure we do not have missing or undefined values in the dataframe.

```r
log.transform <- function(invec, multiplier = 1) {
  ## Function for the transformation which is the log
  ## of the input value times a multiplier

  warningmessages <- c("ERROR: Non-numeric argument encountered in function log.transform",
                       "ERROR: Arguments to function log.transform must be greate than zero",
                       "ERROR: Aggurment multiplier to funcition log.transform must be a scaler",
                       "ERROR: Invalid time seies value encountered in function log.transform"
                       )

  ## Check the input arguments.
  if(!is.numeric(invec) | !is.numeric(multiplier)) {warning(warningmessages[1]); return(NA)}  
  if(any(invec < 0.0) | any(multiplier < 0.0)) {warning(warningmessages[2]); return(NA)}
  if(length(multiplier) != 1) {{warning(warningmessages[3]); return(NA)}}

  ## Wrap the multiplication in tryCatch.
  ## If there is an exception, print the warningmessage to
  ## standard error and return NA.
  tryCatch(log(multiplier * invec),
           error = function(e){warning(warningmessages[4]); NA})
}


## Apply the transformation function to the 4 columns
## of the dataframe with production data.
multipliers  <- list(1.0, 6.5, 1000.0, 1000.0)
cadairydata[, 4:7] <- Map(log.transform, cadairydata[, 4:7], multipliers)

## Get rid of any rows with NA values
cadairydata <- na.omit(cadairydata)  
```

There is quite a bit happing in the `log.transform()` function.  Most of this code is checking for potential problems with the arguments or dealing with exceptions which can still arise during the computations. Only a few lines of this code actually do the computations.

The goal of the defensive programming is to prevent the failure of a single function preventing processing from continuing.  An abrupt failure of a long running analysis can be quite frustrating for users. To avoid this situation, default return values must be chosen which will limit damage to downstream processing.  A message is also produced to alert users that something has gone wrong.

If you are not used to defensive programming in R all this code may seem a bit overwhelming. I will walk you through the major steps:

1. A vector of four messages is defined which are used to communicate information about some of the possible errors and exceptions which can occur with this code.

2.  I return a value of NA for each case.  There are many other possibilities which might have fewer side effects.  I could return a vector of zeroes, or the original input vector, for example.

3.  Checks are run on the arguments to the function.  In each case, if an error is detected, a default value is returned and a message is produced by the `warming()` function. I am using `warning()` rather than `stop()` as the latter will terminate execution, exactly what I am trying to avoid. Note that I have written this code in a procedural style, as in this case a functional approach seemed complex and obscure.

4.  The log computations are wrapped in `tryCatch()` so that exceptions will not cause and abrupt halt to processing. Without `tryCatch()` most errors raised by R functions result in a stop signal, which does just that.

Execute this R code in your experiment and have a look at the printed output in the output.log file.  You will now see the transformed values of the four columns using the **Visualize** from the R Device menu as shown in Figure 13.

![The summary of the transformed values in the dataframe][14]

*Figure 13. The summary of the transformed values in the dataframe.*

We see the values have been transformed.  Milk production now greatly exceeds all other dairy product production, recalling that we are now looking at a log scale.

At this point our data is cleaned up and we are ready for some modeling.  Looking at the visualization summary for the Result Dataset output of our Execute R Script module, you will see the 'Month' column is 'Categorical' with 12 unique values, again, just as we wanted.

##<a id="timeseries"></a>Time Series Objects and Correlation Analysis

In this section we will explore a few basic R time series objects and analyze the correlations between some of the variables. Our goal is to output a dataframe containing the pairwise correlation information at several lags.

The complete R code for this section is in the zip file you downloaded earlier.

###Time Series Objects in R

As already mentioned, time series are a series of data values indexed by time.  R time series objects are used to create and manage the time index. There are several advantages to using time series objects. Time series objects free you from the many details of managing the time series index values which are encapsulated in the object. In addition, time series objects allow you to use the many time series methods for plotting, printing, modeling, etc.

The POSIXct time series class is commonly used and is relatively simple. This time series class measures time from the start of the epoch, January 1, 1970.  We will use POSIXct time series objects in this example. Other widely used R time series object classes include zoo and xts, extensible time series.
<!-- Additional information on R time series objects is provided in the references in Section 5.7. [commenting because this section doesn't exist, even in the original] -->

###	Time Series Object Example

Let's get started with our example. Drag and drop a **new Execute R Script module** into your experiment.  Connect the Result Dataset 1 output port of the existing Execute R Script module to the Dataset 1 input port of the new Execute R Script module.

As I did for the first examples, as we progress through the example, at some points I will only show the incremental additional lines of R code at each step.  

####	Reading the Dataframe

As a first step, let's read in a dataframe and make sure we get the expected results. The following code should do the job:

```r
# Comment the following if using RStudio
cadairydata <- maml.mapInputPort(1)
str(cadairydata) # Check the results
```

Now, run the experiment.  The output you see at the R Device port should look like Figure 14.

![Summary of the dataframe in the Execute R Script module][15]

*Figure 14. Summary of the dataframe in the Execute R Script module.*

These data are of the expected types and format.  Note that the 'Month' column is of type factor and has the expected number of levels.

####Creating a Time Series Object

We need to add a time series object to our dataframe.  Replace the current code in with the following, which adds a new column of class POSIXct.

```r
# Comment the following if using RStudio
cadairydata <- maml.mapInputPort(1)

## Create a new column as a POSIXct object
Sys.setenv(TZ = "PST8PDT")
cadairydata$Time <- as.POSIXct(strptime(paste(as.character(cadairydata$Year), "-", as.character(cadairydata$Month.Number), "-01 00:00:00", sep = ""), "%Y-%m-%d %H:%M:%S"))

str(cadairydata) # Check the results
```

Now, check the R Device output. It should look like Figure 15.

![Summary of the dataframe with a time series object][16]

*Figure 15. Summary of the dataframe with a time series object.*

We can see from the summary that the new column is in fact of class POSIXct.

###Exploring and Transforming the Data

Let's explore some of the variables in this data set.  A scatterplot matrix is a good way to produce a quick look. I am replacing the `str()` function in the previous R code with the following line:

```r
pairs(~ Cotagecheese.Prod + Icecream.Prod + Milk.Prod + N.CA.Fat.Price, data = cadairydata, main = "Pairwise Scatterplots of dairy time series")
```

Run this code and see what happens.  The plot produced at the R Device port should look like Figure 16.

![Scatterplot matrix of selected variables][17]

*Figure 16. Scatterplot matrix of selected variables.*

There is some odd looking structure in the relationships between these variables.  Perhaps this arises from trends in the data and from the fact that we have not standardized the variables.

###Correlation Analysis

To perform correlation analysis we need to both de-trend and standardize the variables. We could simply use the R `scale()` function which both centers and scales variables. This function might well run faster.  However, I want to show you an example of defensive programing in R.

The `ts.detrend()` function shown below performs both of these operations. The following two lines of code de-trend the data and then standardize the values.

```r
ts.detrend <- function(ts, Time, min.length = 3){
  ## Function to detrend and standardize a time series.

  ## Define some messages if they are NULL.  
  messages <- c('ERROR: ts.detrend requires arguments ts and Time to have the same length',
                'ERROR: ts.detrend requires argument ts to be of type numeric',
                paste('WARNING: ts.detrend has encountered a time series with length less than', as.character(min.length)),
                'ERROR: ts.detrend has encountered a Time argument not of class POSIXct',
                'ERROR: Detrend regression has failed in ts.detrend',
                'ERROR: Exception occurred in ts.detrend while standardizing time series in function ts.detrend'
  )
  # Create a vector of zeros to return as a default in some cases.
  zerovec  <- rep(length(ts), 0.0)

  # The input arguments are not of the same length, return ts and quit.
  if(length(Time) != length(ts)) {warning(messages[1]); return(ts)}

  # If the ts is not numeric, just return a zero vector and quit.
  if(!is.numeric(ts)) {warning(messages[2]); return(zerovec)}

  # If the ts is too short, just return it and quit.
  if((ts.length <- length(ts)) < min.length) {warning(messages[3]); return(ts)}

  ## Check that the Time variable is of class POSIXct.
  if(class(cadairydata$Time)[[1]] != "POSIXct") {warning(messages[4]); return(ts)}

  ## Detrent the time series using a linear model.
  ts.frame  <- data.frame(ts = ts, Time = Time)
  tryCatch({ts <- ts - fitted(lm(ts ~ Time, data = ts.frame))},
           error = function(e){warning(messages[5]); zerovec})

  tryCatch( {stdev <- sqrt(sum((ts - mean(ts))^2))/(ts.length - 1)
             ts <- ts/stdev},
            error = function(e){warning(messages[6]); zerovec})

  ts
}  
## Apply the detrend.ts function to the variables of interest.
df.detrend <- data.frame(lapply(cadairydata[, 4:7], ts.detrend, cadairydata$Time))

## Plot the results to look at the relationships.
pairs(~ Cotagecheese.Prod + Icecream.Prod + Milk.Prod + N.CA.Fat.Price, data = df.detrend, main = "Pairwise Scatterplots of detrended standardized time series")
```

There is quite a bit happing in the `ts.detrend()` function.  Most of this code is checking for potential problems with the arguments or dealing with exceptions which can still arise during the computations. Only a few lines of this code actually do the computations.

We have already discussed an example of defensive programming in [Value tansformations](#valuetransformations). Both computation blocks are wrapped in `tryCatch()`.  For some errors it makes sense to return the original input vector, and in other cases, I return a vector of zeros.  

Note that the linear regression used for de-trending is a time series regression. The predictor variable is a time series object.  

Once `ts.detrend()` is defined we apply it to the variables of interest in our dataframe. We must coerce the resulting list created by `lapply()` to data dataframe using `as.data.frame()`.  Because of defensive aspects of `ts.detrend()`, failure to process one of the variables will not prevent correct processing of the others.  

The final line of code creates a pairwise scatterplot. After running the R code the results of the scatterplot are shown in Figure 17.

![Pairwise scatterplot of de-trended and standardized time series][18]

*Figure 17. Pairwise scatterplot of de-trended and standardized time series.*

You can compare these results to those shown in Figure 17. With the trend removed and the variables standardized, we see a lot less structure in the relationships between these variables.

The code to compute the correlations as R ccf objects is as follows:

```r
## A function to compute pairwise correlations from a
## list of time series value vectors.
pair.cor <- function(pair.ind, ts.list, lag.max = 1, plot = FALSE){
  ccf(ts.list[[pair.ind[1]]], ts.list[[pair.ind[2]]], lag.max = lag.max, plot = plot)
}

## A list of the pairwaise indices.
corpairs <- list(c(1,2), c(1,3), c(1,4), c(2,3), c(2,4), c(3,4))

## Compute the list of ccf objects.
cadairycorrelations <- lapply(corpairs, pair.cor, df.detrend)  

cadairycorrelations
```

Running this code produces the output shown in Figure 18.

![List of ccf objects from the pairwise correlation analysis][19]

*Figure 18. List of ccf objects from the pairwise correlation analysis.*

There is a correlation value for each lag.  None of these correlation values is large enough to be significant. We can therefore conclude that we can model each variable independently.

###Output a Dataframe

We have computed the pairwise correlations as a list of R ccf objects. This presents a bit of a problem as the Result Dataset output port really requires a dataframe.  Further, the ccf object is itself a list and we only want the values in the first element of this list, the correlations at the various lags.

The following code extracts the lag values from the list of ccf objects, which are themselves lists:

```r
df.correlations <- data.frame(do.call(rbind, lapply(cadairycorrelations, '[[', 1)))

c.names <- c("-1 lag", "0 lag", "+1 lag")
r.names  <- c("Corr Cot Cheese - Ice Cream",
              "Corr Cot Cheese - Milk Prod",
              "Corr Cot Cheese - Fat Price",
              "Corr Ice Cream - Mik Prod",
              "Corr Ice Cream - Fat Price",
              "Corr Milk Prod - Fat Price")

## Build a dataframe with the row names column and the
## correlation data frame and assign the column names.
outframe <- cbind(r.names, df.correlations)
colnames(outframe) <- c.names
outframe


## WARNING!
## The following line only works in Azure ML.
## when running in RStudio, this code will result in an error.
#maml.mapOutputPort('outframe')
```

The first line of code is a bit tricky and some explanation may help you understand it. Working from the inside out we have the following:

1.  The '**[[**' operator with the argument '**1**', selects the vector of correlations at the lags from the first element of the ccf object list.

2.  The `do.call()` function applies the `rbind()` function over the elements of the list returns by `lapply()`.

3.  The `data.frame()` function coerces the result produced by `do.call()` to a dataframe.

Note that the row names are in a column of the data frame. Doing so preserves the row names when they are output from the Execute R Script.

Running the code produces the output shown in Figure 29 when I **Visualize** the output at the Result Dataset port. The row names are in the first column as intended.

![Results output from the correlation analysis][20]

*Figure 29. Results output from the correlation analysis.*

##<a id="seasonalforecasting"></a>Time Series Example: Seasonal forecasting

Our data is now in a form suitable for analysis and we have determined there are no significant correlations between the variables.  Let's move on and create a time series forecasting model.  Using this model we will forecast California milk production for the 12 months of 2013.

Our forecasting model will have two components, a trend component and a seasonal component.  The complete forecast is the product of these two components.  This type of model is known as a multiplicative model. The alternative is an additive model. We have already applied a log transformation to the variables of interest which makes this analysis tractable.

The complete R code for this section is in the zip file you downloaded earlier.

###	Creating the Dataframe for Analysis

Start by adding a **new Execute R Script module** to your experiment.  Connect the **Result Dataset** output of the existing Execute R Script module to the **Dataset1** input of the new module.  The result should look something like Figure 20.

![The experiment with the new Execute R Script module added][21]

*Figure 20. The experiment with the new Execute R Script module added.*

As with the correlation analysis we just completed, we need to add a column with a POSIXct time series object. The following code will do just this:

```r
# If running in ML Studio uncomment the first line with maml.mapInputPort().
cadairydata <- maml.mapInputPort(1)

## Create a new column as a POSIXct object
Sys.setenv(TZ = "PST8PDT")
cadairydata$Time <- as.POSIXct(strptime(paste(as.character(cadairydata$Year), "-", as.character(cadairydata$Month.Number), "-01 00:00:00", sep = ""), "%Y-%m-%d %H:%M:%S"))

str(cadairydata)
```

Run this code and look at the R Device output port. The result should look like Figure 21.

![A summary of the dataframe][22]

*Figure 21. A summary of the dataframe.*

With this result, we are ready to start our analysis.

###Create a Training Dataset

With the dataframe constructed we need to create a training dataset. This data will include all of the observations except the last 12, of the year 2013, which is our test dataset. The following code subsets the dataframe and creates plots of the dairy production and price variables. I then create plots of the four production and price variables. An anonymous function is used to define some augments for plot, and then iterate over the list of the other two arguments with `Map()`. If you are thinking that a for loop would have worked fine here, you are correct. But, since R is a functional language I am showing you a functional approach.

```r
cadairytrain <- cadairydata[1:216, ]

Ylabs  <- list("Log CA Cotage Cheese Production, 1000s lb",
               "Log CA Ice Cream Production, 1000s lb",
               "Log CA Milk Production 1000s lb",
               "Log North CA Milk Milk Fat Price per 1000 lb")

Map(function(y, Ylabs){plot(cadairytrain$Time, y, xlab = "Time", ylab = Ylabs, type = "l")}, cadairytrain[, 4:7], Ylabs)
```

Running the code produces the series of time series plots from the R Device output shown in Figure 22. Note that the time axis is in units of dates, a nice benefit of the time series plot method.

![First of time series plots of California dairy production and price data](./media/machine-learning-r-quickstart/unnamed-chunk-161.png)

![Second of time series plots of California dairy production and price data](./media/machine-learning-r-quickstart/unnamed-chunk-162.png)

![Third of time series plots of California dairy production and price data](./media/machine-learning-r-quickstart/unnamed-chunk-163.png)

![Fourth of time series plots of California dairy production and price data](./media/machine-learning-r-quickstart/unnamed-chunk-164.png)

*Figure 22. Time series plots of California dairy production and price data.*

###	A Trend Model

Having created a time series object and having had a look at the data, let's start to construct a trend model for the California milk production data. We can do this with a time series regression.  However, it is clear from the plot, that we will need more than a slope and intercept to accurately model the observed trend in the training data.

Given the small scale of the data, I will build the model for trend in RStudio and then cut and paste the resulting model into Azure ML. RStudio provides an interactive environment for this type of interactive analysis.

As a first attempt, I will try a polynomial regression with powers up to 3.  There is a real danger of over fitting these kinds of models. Therefore, it is best to avoid high order terms.  The `I()` function inhibits interpretation of the contents (interprets the contents 'as is') and allows you to write a literally interpreted function in a regression equation.

```r
milk.lm <- lm(Milk.Prod ~ Time + I(Month.Count^2) + I(Month.Count^3), data = cadairytrain)
summary(milk.lm)
```

This generates the following:

```
##
## Call:
## lm(formula = Milk.Prod ~ Time + I(Month.Count^2) + I(Month.Count^3),
##     data = cadairytrain)
##
## Residuals:
##      Min       1Q   Median       3Q      Max
## -0.12667 -0.02730  0.00236  0.02943  0.10586
##
## Coefficients:
##                   Estimate Std. Error t value Pr(>|t|)
## (Intercept)       6.33e+00   1.45e-01   43.60   <2e-16 ***
## Time              1.63e-09   1.72e-10    9.47   <2e-16 ***
## I(Month.Count^2) -1.71e-06   4.89e-06   -0.35    0.726
## I(Month.Count^3) -3.24e-08   1.49e-08   -2.17    0.031 *  
## ---
## Signif. codes:  0 '***' 0.001 '**' 0.01 '*' 0.05 '.' 0.1 ' ' 1
##
## Residual standard error: 0.0418 on 212 degrees of freedom
## Multiple R-squared:  0.941,	Adjusted R-squared:  0.94
## F-statistic: 1.12e+03 on 3 and 212 DF,  p-value: <2e-16
```

From P values (Pr(>|t|)) in this output, we can see that the squared term may not be significant.  I will use the `update()` function to modify this model by dropping the squared term.

```r
milk.lm <- update(milk.lm, . ~ . - I(Month.Count^2))
summary(milk.lm)
```

This generates the following:

```
##
## Call:
## lm(formula = Milk.Prod ~ Time + I(Month.Count^3), data = cadairytrain)
##
## Residuals:
##      Min       1Q   Median       3Q      Max
## -0.12597 -0.02659  0.00185  0.02963  0.10696
##
## Coefficients:
##                   Estimate Std. Error t value Pr(>|t|)
## (Intercept)       6.38e+00   4.07e-02   156.6   <2e-16 ***
## Time              1.57e-09   4.32e-11    36.3   <2e-16 ***
## I(Month.Count^3) -3.76e-08   2.50e-09   -15.1   <2e-16 ***
## ---
## Signif. codes:  0 '***' 0.001 '**' 0.01 '*' 0.05 '.' 0.1 ' ' 1
##
## Residual standard error: 0.0417 on 213 degrees of freedom
## Multiple R-squared:  0.941,  Adjusted R-squared:  0.94
## F-statistic: 1.69e+03 on 2 and 213 DF,  p-value: <2e-16
```

This looks better.  All of the terms are significant.  However, the 2e-16 value is a default value, and should not be taken too seriously.  

As a sanity test, let's make a time series plot of the California dairy production data with the trend curve shown.  I have added the following code in the Azure ML Execute R Script model (not RStudio) to create the model and make a plot.

```r
milk.lm <- lm(Milk.Prod ~ Time + I(Month.Count^3), data = cadairytrain)

plot(cadairytrain$Time, cadairytrain$Milk.Prod, xlab = "Time", ylab = "Log CA Milk Production 1000s lb", type = "l")
lines(cadairytrain$Time, predict(milk.lm, cadairytrain), lty = 2, col = 2)
```

![CA milk production data with trend model shown](./media/machine-learning-r-quickstart/unnamed-chunk-18.png)

*Figure 23. CA milk production data with trend model shown.*

It looks like the trend model fits the data fairly well. Further, there does not seem to be evidence of over-fitting, such as odd wiggles in the model curve.  

###Seasonal model

With a trend model in hand we need to push on and include the seasonal effects. We will use the month of the year as a dummy variable in the linear model to capture the month by month effect. Note that when you introduce factor variables into a model, the intercept must not be computed.  If you do not do this, the formula is over-specified and R will drop one of the desired factors but keep the intercept term.

Since we have a satisfactory trend model we can use the `update()` function to add the new terms to the existing model. The -1 in the update formula drops the intercept term.  Continuing in RStudio for the moment:

```r
milk.lm2 <- update(milk.lm, . ~ . + Month - 1)
summary(milk.lm2)
```

This generates the following:

```
##
## Call:
## lm(formula = Milk.Prod ~ Time + I(Month.Count^3) + Month - 1,
##     data = cadairytrain)
##
## Residuals:
##      Min       1Q   Median       3Q      Max
## -0.06879 -0.01693  0.00346  0.01543  0.08726
##
## Coefficients:
##                   Estimate Std. Error t value Pr(>|t|)
## Time              1.57e-09   2.72e-11    57.7   <2e-16 ***
## I(Month.Count^3) -3.74e-08   1.57e-09   -23.8   <2e-16 ***
## MonthApr          6.40e+00   2.63e-02   243.3   <2e-16 ***
## MonthAug          6.38e+00   2.63e-02   242.2   <2e-16 ***
## MonthDec          6.38e+00   2.64e-02   241.9   <2e-16 ***
## MonthFeb          6.31e+00   2.63e-02   240.1   <2e-16 ***
## MonthJan          6.39e+00   2.63e-02   243.1   <2e-16 ***
## MonthJul          6.39e+00   2.63e-02   242.6   <2e-16 ***
## MonthJun          6.38e+00   2.63e-02   242.4   <2e-16 ***
## MonthMar          6.42e+00   2.63e-02   244.2   <2e-16 ***
## MonthMay          6.43e+00   2.63e-02   244.3   <2e-16 ***
## MonthNov          6.34e+00   2.63e-02   240.6   <2e-16 ***
## MonthOct          6.37e+00   2.63e-02   241.8   <2e-16 ***
## MonthSep          6.34e+00   2.63e-02   240.6   <2e-16 ***
## ---
## Signif. codes:  0 '***' 0.001 '**' 0.01 '*' 0.05 '.' 0.1 ' ' 1
##
## Residual standard error: 0.0263 on 202 degrees of freedom
## Multiple R-squared:     1,	Adjusted R-squared:     1
## F-statistic: 1.42e+06 on 14 and 202 DF,  p-value: <2e-16
```

We see that the model no longer has an intercept term and has 12 significant month factors.  This is exactly what we wanted to see.

Let's make another time series plot of the California dairy production data to see how well the seasonal model is working.  I have added the following code in the Azure ML Execute R Script to create the model and make a plot:

```r
milk.lm2 <- lm(Milk.Prod ~ Time + I(Month.Count^3) + Month - 1, data = cadairytrain)

plot(cadairytrain$Time, cadairytrain$Milk.Prod, xlab = "Time", ylab = "Log CA Milk Production 1000s lb", type = "l")
lines(cadairytrain$Time, predict(milk.lm2, cadairytrain), lty = 2, col = 2)
```

Running this code in Azure ML produces the plot shown in Figure 24.

![CA milk production with model including seasonal effects](./media/machine-learning-r-quickstart/unnamed-chunk-20.png)

*Figure 24. CA milk production with model including seasonal effects.*

The fit to the data shown in Figure 24 is rather encouraging.  Both the trend and the seasonal effect (monthly variation) look reasonable.

As another check on our model, let's have a look at the residuals. The following code computes the predicted values from our two models, computes the residuals for the seasonal model and then plots these residuals for the training data.

```r
## Compute predictions from our models.
predict1  <- predict(milk.lm, cadairydata)
predict2  <- predict(milk.lm2, cadairydata)

## Compute and plot the residuals
residuals <- cadairydata$Milk.Prod - predict2
plot(cadairytrain$Time, residuals[1:216], xlab = "Time", ylab ="Residuals of Seasonal Model")
```

The residual plot is shown in Figure 25.

![Residuals of the seasonal model for the training data](./media/machine-learning-r-quickstart/unnamed-chunk-21.png)

*Figure 25. Residuals of the seasonal model for the training data.*

These residuals look reasonable.  There is no particular structure, except the effect of the 2008-2009 recession, which our model does not account for particularly well.

The plot shown in figure 25 is useful for detecting any time dependent patterns in the residuals. The explicit approach of computing and plotting the residuals I used places the residuals in time order on the plot.  If, on the other hand, I had plotted, `milk.lm$residuals` the plot would not have been in time order.

You can also use `plot.lm()` to produce a series of diagnostic plots:

```r
## Show the diagnostic plots for the model
plot(milk.lm2, ask = FALSE)
```

This code produces a series of diagnostic plots shown in figure 26.

![First of Diagnostic plots for the seasonal model](./media/machine-learning-r-quickstart/unnamed-chunk-221.png)

![Second of Diagnostic plots for the seasonal model](./media/machine-learning-r-quickstart/unnamed-chunk-222.png)

![Third of Diagnostic plots for the seasonal model](./media/machine-learning-r-quickstart/unnamed-chunk-223.png)

![Fourth of Diagnostic plots for the seasonal model](./media/machine-learning-r-quickstart/unnamed-chunk-224.png)

*Figure 26. Diagnostic plots for the seasonal model.*

There are a few highly influential points identified in these plots, but nothing to cause great concern. Further, we can see from the Normal Q-Q plot that the residuals are close to normally distributed, an important assumption for linear models.

###Forecasting  and model evaluation

There is just one more thing to do to complete our example.  We need to compute forecasts and measure the error against the actual data.  Our forecast will be for the 12 months of 2013. We can compute an error measure for this forecast to the actual data which are not part of our training dataset. Additionally, we can compare performance on the 18 years of training data to the 12 months of test data.  

A number of metrics are used to measure the performance of time series models. In our case we will use the root mean square error, or RMS error. The following function computes the RMS error between two series:  

```r
RMS.error <- function(series1, series2, is.log = TRUE, min.length = 2){
  ## Function to compute the RMS error or difference between two
  ## series or vectors.

  messages <- c("ERROR: Input arguments to function RMS.error of wrong type encountered",
                "ERROR: Input vector to function RMS.error is too short",
                "ERROR: Input vectors to function RMS.error must be of same length",
                "WARNING: Funtion rms.error has received invald input time series.")

  ## Check the arguments.
  if(!is.numeric(series1) | !is.numeric(series2) | !is.logical(is.log) | !is.numeric(min.length)) {
    warning(messages[1])
    return(NA)}

  if(length(series1) < min.length) {
    warning(messages[2])
    return(NA)}

  if((length(series1) != length(series2))) {
    warning(messages[3])
    return(NA)}

  ## If is.log is TRUE exponentiate the values, else just copy.
  if(is.log) {
    tryCatch( {
      temp1 <- exp(series1)
      temp2 <- exp(series2) },
      error = function(e){warning(messages[4]); NA}
    )
  } else {
    temp1 <- series1
    temp2 <- series2
  }

 ## Compute predictions from our models.
predict1  <- predict(milk.lm, cadairydata)
predict2  <- predict(milk.lm2, cadairydata)

## Compute the RMS error in a dataframe.
  tryCatch( {
    sqrt(sum((temp1 - temp2)^2) / length(temp1))},
    error = function(e){warning(messages[4]); NA})
}
```

As with the `log.transform()` function we discussed in the Value transformations section, there is quite a lot of error checking and exception recovery code in this function.  The principles employed are the same. The work is done in two places wrapped in `tryCatch()`.  First, the time series are exponentiated, since we have been working with the logs of the values. Second, the actual RMS error is computed.  

Equipped with a function to measure the RMS error, let's build and output a dataframe containing the RMS errors. We will include terms for the trend model alone and the complete model with seasonal factors. The following code does the job using the two linear models we have constructed:

```r
## Compute the RMS error in a dataframe.
## Include the row names in the first column so they will
## appear in the output of the Execute R Script.
RMS.df  <-  data.frame(
rowNames = c("Trend Model", "Seasonal Model"),
  Traing = c(
  RMS.error(predict1[1:216], cadairydata$Milk.Prod[1:216]),
  RMS.error(predict2[1:216], cadairydata$Milk.Prod[1:216])),
  Forecast = c(
    RMS.error(predict1[217:228], cadairydata$Milk.Prod[217:228]),
    RMS.error(predict2[217:228], cadairydata$Milk.Prod[217:228]))
)
RMS.df

## The following line should be executed only when running in
## Azure ML Studio.
maml.mapOutputPort('RMS.df')
```

Running this code produces the output shown in Figure 27 at the Result Dataset output port.

![Comparison of RMS error for the models][26]

*Figure 27. Comparison of RMS error for the models.*

From these results, we see that adding the seasonal factors to the model, reduces the RMS error significantly.  Not too surprisingly, the RMS error for the training data is a bit less than for the forecast.

##<a id="appendixa"></a>APPENDIX A - Guide to RStudio

RStudio is quite well documented, so in this appendix I will provide some links to the key sections of the RStudio documentation to get you started.

1.	Creating projects

	You can organize and manage your R code into projects with RStudio.  The documentation using projects can be found at https://support.rstudio.com/hc/en-us/articles/200526207-Using-Projects.

	I recommend that you follow these directions and create a project for the R code examples in this document.  

2.	Editing and executing R code

	RStudio provides an integrated environment for editing and executing R code.  Documentation can be found at https://support.rstudio.com/hc/en-us/articles/200484448-Editing-and-Executing-Code.

3.	Debugging

	RStudio includes powerful debugging capabilities.  Documentation for these features are at https://support.rstudio.com/hc/en-us/articles/200713843-Debugging-with-RStudio.

	The breakpoint troubleshooting features are documented at https://support.rstudio.com/hc/en-us/articles/200534337-Breakpoint-Troubleshooting.

##<a id="appendixb"></a>APPENDIX B - Further Reading

If you are not familiar with R, two introductions are available on CRAN.

- R for Beginners by Emmanuel Paradis is a good place to start at http://cran.r-project.org/doc/contrib/Paradis-rdebuts_en.pdf.  

- An Introduction to R by W. N. Venables et. al. goes into a bit more depth, at http://cran.r-project.org/doc/manuals/R-intro.html.

There are many books on R which can help you get started.  Here are a few I find useful:

- 'The Art of R Programming; A Tour of Statistical Software Design' by Norman Matloff is an excellent introduction to programming in R.  

- The 'R Cookbook' by Paul Teetor provides a problem and solution approach to using R.  

- 'R in Action' by Robert Ka
- bacoff is another useful introductory book.  The companion 'Quick R' web site is a useful resource at http://www.statmethods.net/.

- 'R Inferno' by Patrick Burns is a surprisingly humorous book which deals with a number of tricky and difficult topics which can be encountered when programming in R.  The book is available for free at http://www.burns-stat.com/documents/books/the-r-inferno/.

- If you want a deep dive into advanced topics in R, have a look at the upcoming book, 'Advanced R' by Hadley Wickham.  The online version of this book is available for free at http://adv-r.had.co.nz/.

A catalogue of R time series packages can be found in the CRAN Task View for time series analysis: http://cran.r-project.org/web/views/TimeSeries.html. For information on specific time series object packages, you should refer to the documentation for that package.

The book 'Introductory Time Series with R' by Paul Cowpertwait and Andrew Metcalfe provides an introduction to using R for time series analysis.  Many more theoretical texts provide R examples.

<!--Image references-->
[1]: ./media/machine-learning-r-quickstart/fig1.png
[2]: ./media/machine-learning-r-quickstart/fig2.png
[3]: ./media/machine-learning-r-quickstart/fig3.png
[4]: ./media/machine-learning-r-quickstart/fig4.png
[5]: ./media/machine-learning-r-quickstart/fig5.png
[6]: ./media/machine-learning-r-quickstart/fig6.png
[7]: ./media/machine-learning-r-quickstart/fig7.png
[8]: ./media/machine-learning-r-quickstart/fig8.png
[9]: ./media/machine-learning-r-quickstart/fig9.png
[10]: ./media/machine-learning-r-quickstart/fig10.png
[11]: ./media/machine-learning-r-quickstart/fig11.png
[12]: ./media/machine-learning-r-quickstart/fig12.png
[13]: ./media/machine-learning-r-quickstart/fig13.png
[14]: ./media/machine-learning-r-quickstart/fig14.png
[15]: ./media/machine-learning-r-quickstart/fig15.png
[16]: ./media/machine-learning-r-quickstart/fig16.png
[17]: ./media/machine-learning-r-quickstart/fig17.png
[18]: ./media/machine-learning-r-quickstart/fig18.png
[19]: ./media/machine-learning-r-quickstart/fig19.png
[20]: ./media/machine-learning-r-quickstart/fig20.png
[21]: ./media/machine-learning-r-quickstart/fig21.png
[22]: ./media/machine-learning-r-quickstart/fig22.png

[26]: ./media/machine-learning-r-quickstart/fig26.png

<!--links-->
[appendixa]: #appendixa
[download]: https://azurebigdatatutorials.blob.core.windows.net/rquickstart/RFiles.zip
