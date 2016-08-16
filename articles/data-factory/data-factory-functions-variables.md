<properties 
	pageTitle="Data Factory Functions and System Variables | Microsoft Azure" 
	description="Provides a list of Azure Data Factory functions and system variables" 
	documentationCenter="" 
	authors="spelluru" 
	manager="jhubbard" 
	editor="monicar"
	services="data-factory"
/>

<tags 
	ms.service="data-factory" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="07/25/2016" 
	ms.author="spelluru"/>

# Azure Data Factory - Functions and System Variables
This article provides information about functions and variables supported by Azure Data Factory.
  
## Data Factory system variables

Variable Name | Description | Object Scope | JSON Scope and Use Cases
------------- | ----------- | ------------ | ------------------------
WindowStart | Start of time interval for current activity run window | activity | <ol><li>Specify data selection queries. See connector articles referenced in the [Data Movement Activities](data-factory-data-movement-activities.md) article.</li><li>Pass parameters to Hive script (sample shown above).</li>
WindowEnd | End of time interval for current activity run window | activity | same as above
SliceStart | Start of time interval for data  slice being produced | activity<br/>dataset | <ol><li>Specify dynamic folder paths and file names while working with [Azure Blob](data-factory-azure-blob-connector.md) and [File System datasets](data-factory-onprem-file-system-connector.md).</li><li>Specify input dependencies with data factory functions in activity inputs collection.</li></ol>
SliceEnd | End of time interval for current data slice being produced | activity<br/>dataset | same as above. 

> [AZURE.NOTE] Currently data factory requires that the schedule specified in the activity exactly match the schedule specified in availability of the output dataset. This means WindowStart, WindowEnd and SliceStart and SliceEnd always map to the same time period and a single output slice.
 
## Data Factory functions 

You can use functions in data factory along with above mentioned system variables for the following purposes:

1.	Specifying data selection queries (see connector articles referenced by the [Data Movement Activities](data-factory-data-movement-activities.md) article.

	The syntax to invoke a data factory function is: **$$<function>** for data selection  queries and other properties in the activity and datasets.  
2. Specifying input dependencies with data factory functions in activity inputs collection (see sample above).

	$$ is not needed for specifying input dependency expressions. 	

In the following sample, **sqlReaderQuery** property in a JSON file is assigned to a value returned by the **Text.Format** function. This sample also uses a system variable named **WindowStart**, which represents the start time of the activity run window.
	
	{
	    "Type": "SqlSource",
	    "sqlReaderQuery": "$$Text.Format('SELECT * FROM MyTable WHERE StartTime = \\'{0:yyyyMMdd-HH}\\'', WindowStart)"
	}

### Functions

The following tables list all the functions in Azure Data Factory:

Category | Function | Parameters | Description
-------- | -------- | ---------- | ----------- 
Time | AddHours(X,Y) | X: DateTime <br/><br/>Y: int | Adds Y hours to the given time X. <br/><br/>Example: 9/5/2013 12:00:00 PM + 2 hours = 9/5/2013 2:00:00 PM
Time | AddMinutes(X,Y) | X: DateTime <br/><br/>Y: int | Adds Y minutes to X.<br/><br/>Example: 9/15/2013 12: 00:00 PM + 15 minutes = 9/15/2013 12: 15:00 PM
Time | StartOfHour(X) | X: Datetime | Gets the starting time for the hour represented by the hour component of X. <br/><br/>Example: StartOfHour of 9/15/2013 05: 10:23 PM is 9/15/2013 05: 00:00 PM
Date | AddDays(X,Y) | X: DateTime<br/><br/>Y: int | Adds Y days to X.<br/><br/>Example: 9/15/2013 12:00:00 PM + 2 days = 9/17/2013 12:00:00 PM
Date | AddMonths(X,Y) | X: DateTime<br/><br/>Y: int | Adds Y months to X.<br/><br/>Example: 9/15/2013 12:00:00 PM + 1 month = 10/15/2013 12:00:00 PM 
Date | AddQuarters(X,Y) | X: DateTime <br/><br/>Y: int | Adds Y * 3 months to X.<br/><br/>Example: 9/15/2013 12:00:00 PM + 1 quarter = 12/15/2013 12:00:00 PM
Date | AddWeeks(X,Y) | X: DateTime<br/><br/>Y: int | Adds Y * 7 days to X<br/><br/>Example: 9/15/2013 12:00:00 PM + 1 week = 9/22/2013 12:00:00 PM
Date | AddYears(X,Y) | X: DateTime<br/><br/>Y: int | Adds Y years to X.<br/><br/>Example: 9/15/2013 12:00:00 PM + 1 year = 9/15/2014 12:00:00 PM
Date | Day(X) | X: DateTime | Gets the day component of X.<br/><br/>Example: Day of 9/15/2013 12:00:00 PM is 9. 
Date | DayOfWeek(X) | X: DateTime | Gets the day of week component of X.<br/><br/>Example: DayOfWeek of 9/15/2013 12:00:00 PM is Sunday.
Date | DayOfYear(X) | X: DateTime | Gets the day in the year represented by the year component of X.<br/><br/>Examples:<br/>12/1/2015: day 335 of 2015<br/>12/31/2015: day 365 of 2015<br/>12/31/2016: day 366 of 2016 (Leap Year)
Date | DaysInMonth(X) | X: DateTime | Gets the days in the month represented by the month component of parameter X.<br/><br/>Example: DaysInMonth of 9/15/2013 are 30 since there are 30 days in the September month.
Date | EndOfDay(X) | X: DateTime | Gets the date-time that represents the end of the day (day component) of X.<br/><br/>Example: EndOfDay of 9/15/2013 05:10:23 PM is 9/15/2013 11:59:59 PM.
Date | EndOfMonth(X) | X: DateTime | Gets the end of the month represented by month component of parameter X. <br/><br/>Example: EndOfMonth of 9/15/2013 05:10:23 PM is 9/30/2013 11:59:59 PM (date time that represents the end of September month)
Date | StartOfDay(X) | X: DateTime | Gets the start of the day represented by the day component of parameter X.<br/><br/>Example: StartOfDay of 9/15/2013 05:10:23 PM is 9/15/2013 12:00:00 AM.
DateTime | From(X) | X: String | Parse string X to a date time.
DateTime | Ticks(X) | X: DateTime | Gets the ticks property of the parameter X. One tick equals 100 nanoseconds. The value of this property represents the number of ticks that have elapsed since 12:00:00 midnight, January 1, 0001. 
Text | Format(X) | X: String variable | Formats the text.

#### Text.Format example

	"defines": { 
	    "Year" : "$$Text.Format('{0:yyyy}',WindowStart)",
	    "Month" : "$$Text.Format('{0:MM}',WindowStart)",
	    "Day" : "$$Text.Format('{0:dd}',WindowStart)",
	    "Hour" : "$$Text.Format('{0:hh}',WindowStart)"
	}

See [Custom Date and Time Format Strings](https://msdn.microsoft.com/library/8kb3ddd4.aspx) topic that describes different formatting options you can use (for example: yy vs. yyyy). 

> [AZURE.NOTE] When using a function within another function, you do not need to use **$$** prefix for the inner function. For example: $$Text.Format('PartitionKey eq \\'my_pkey_filter_value\\' and RowKey ge \\'{0:yyyy-MM-dd HH:mm:ss}\\'', Time.AddHours(SliceStart, -6)). In this example, notice that **$$** prefix is not used for the **Time.AddHours** function. 
  

