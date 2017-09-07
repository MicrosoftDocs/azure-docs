title: <this Sample of Destination Connections (Python)> | Microsoft Docs
description: <this Gives samples of python destionation connections expressions>
author: <your cforbe>
ms.author: <your cforbe@microsoft.com>
ms.date: <today’s date: 9/7/2017>

Before reading this appendix read [Python Extensibility Overview](data-prep-python-extensibility-overview.md)
# Sample of Destination Connections (Python) #

## Write to Excel ##

Before writing some other changes might be needed. Some of the datatypes used in Data Prep are not supported in some destination formats, if "Error" objects exist for example these will not serialize correctly to Excel, hence a "Handle Error Values" transform that removes Errors from any columns is needed before attempting to write to Excel.

Assuming all of the above work has been completed the below line will write the data table to a single sheet in an Excel document. Add a Write DataFlow (Script) transform and enter the following in an expression section:

```
df.to_excel('c:\dev\data\Output\Customer.xlsx', sheet_name='Sheet1')
```
