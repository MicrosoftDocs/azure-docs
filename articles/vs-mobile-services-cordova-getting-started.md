<properties title="Getting Started with Mobile Services" pageTitle="" metaKeywords="Azure, Getting Started, Mobile Services" description="" services="mobile-services" documentationCenter="" authors="ghogen, kempb" />

<tags ms.service="mobile-services" ms.workload="web" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="10/8/2014" ms.author="ghogen, kempb" />

# Getting Started with Mobile Services

## What Happened?

###References Added

The Azure Mobile Service Client plugin included with all Multi-Device Hybrid Apps has been enabled.
  
###Connection string values for Mobile Services

Under services\mobileServices\settings, a new JavaScript (.js) file with a MobileServiceClient was generated containing the selected mobile service’s application URL and application key.  
  
## Getting Started

###Get reference to a table

The following code gets a reference to a table that contains data for a TodoItem, which you can use in subsequent operations to read and update the data table.

	var mobileService = new WindowsAzure.MobileServiceClient(
	        "<your mobile service name>.azure-mobile.net",
	        "<insert your key>"
	    );
	var todoTable = mobileService.getTable('TodoItem');

###Add entry 

Insert a new item into a data table. An id (a GUID of type string) is automatically created as the primary key for the new row. Call the [done]() method on the returned [Promise]() object to get a copy of the inserted object and handle any errors.
    var insertTodoItem = function (todoItem) {
        todoTable.insert(todoItem).done(function (item) {
            // ...
        });
    };

###Read/query table 

The following code queries a table for all items, sorted by the text field. You can add code to process the query results in the success handler.

    todoTable.orderBy('text')
        .read( { success: (function (results) {
            //...
        });

For more examples of queries you can use, see [query]((http://msdn.microsoft.com/library/azure/jj613353.aspx)) object.

###Update entry

Update a row in a data table. In this code, when the MobileService responds, the item is removed from the list. Call the done method on the returned Promise object to get a copy of the updated object and handle any errors.
    todoTable.update(todoItem).done(function (item) {
        // ...
    });

###Delete entry

Delete a row in a data table using the del method. 
	todoTable.del(todoItem)
