<properties title="Getting Started with Mobile Services" pageTitle="" metaKeywords="Azure, Getting Started, Mobile Services" description="" services="mobile-services" documentationCenter="" authors="ghogen, kempb" />

<tags ms.service="mobile-services" ms.workload="web" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="10/8/2014" ms.author="ghogen, kempb" />

> [AZURE.SELECTOR]
> - [Getting Started](/documentation/articles/vs-mobile-services-cordova-getting-started/)
> - [What Happened](/documentation/articles/vs-mobile-services-cordova-what-happened/)

## Getting Started with Mobile Services (Cordova Projects)
  
#####Get reference to a table

The following code gets a reference to a table that contains data for a TodoItem, which you can use in subsequent operations to read and update the data table. The TodoItem table is created automatically when you create a mobile service.

	var todoTable = mobileServiceClient.getTable('TodoItem');

For these examples to work, permissions on the table must be set to **Anybody with an Application Key**. Later, you can set up authentication. See [Get started with authentication](http://azure.microsoft.com/en-us/documentation/articles/mobile-services-html-get-started-users/).

#####Add entry 

Insert a new item into a data table. An id (a GUID of type string) is automatically created as the primary key for the new row. Call the [done]() method on the returned [Promise]() object to get a copy of the inserted object and handle any errors.

    function TodoItem(text) {
        this.text = text;
        this.complete = false;
    }

    var items = new Array();
    todoTable.insert(todoItem).done(function (item) {
        items.push(item)
        });
    };

#####Read/query table 

The following code queries a table for all items, sorted by the text field. You can add code to process the query results in the success handler. In this case, a local array of the items is updated.

    todoTable.orderBy('text')
        .read().done(function (results) {
            items = results.slice();
            });
        });

You can use the where method to modify the query. Here's an example that filters out completed items.

	todoTable.where(function () {
                 return (this.complete === false);
              })
             .read().done(function (results) {
                items = results.slice();
             });

For more examples of queries you can use, see [query]((http://msdn.microsoft.com/library/azure/jj613353.aspx)) object.

#####Update entry

Update a row in a data table. In this code, when the mobile service responds, the item is removed from the list. Call the [done]() method on the returned [Promise]() object to get a copy of the inserted object and handle any errors.

    todoTable.update(todoItem).done(function (item) {
        // Update a local collection of items.
        items.splice(items.indexOf(todoItem), 1, item);
    });

#####Delete entry

Delete a row in a data table using the **del** method. Call the [done]() method on the returned [Promise]() object to get a copy of the inserted object and handle any errors.

	todoTable.del(todoItem).done(function (item) {
        items.splice(items.indexOf(todoItem), 1);
	});

[Learn more about mobile services](http://azure.microsoft.com/documentation/services/mobile-services/)