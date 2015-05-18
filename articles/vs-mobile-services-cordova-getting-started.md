<properties 
	pageTitle="" 
	description="Describes the first steps you can take to get started with Azure Mobile Services in a Cordova project" 
	services="mobile-services" 
	documentationCenter="" 
	authors="patshea123" 
	manager="douge" 
	editor=""/>

<tags 
	ms.service="mobile-services" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="vs-getting-started" 
	ms.devlang="multiple" 
	ms.topic="article" 
	ms.date="05/06/2015" 
	ms.author="patshea123"/>

# Getting Started with Mobile Services (Cordova Projects)

> [AZURE.SELECTOR]
> - [Getting Started](vs-mobile-services-cordova-getting-started.md)
> - [What Happened](vs-mobile-services-cordova-what-happened.md)

The first step you need to do in order to follow the code in these examples depends on what type of mobile service you connected to.

For a JavaScript backend mobile service, create a table called TodoItem.  To create a table,  locate the mobile service under the Azure node in Server Explorer, right-click the mobile service's node to open the context menu, and choose **Create Table**. Enter "TodoItem" as the table name.

If instead you have a .NET backend mobile service, there's already a TodoItem table in the default project template that Visual Studio created for you, but you need to publish it to Azure. To publish it, open the context menu for the mobile service project in Solution Explorer, and choose **Publish Web**. Accept the defaults, and choose the **Publish** button.
  
>[AZURE.NOTE]**In Cordova projects that are built using Visual Studio 2015 Preview, use this [workaround](http://go.microsoft.com/fwlink/?LinkId=518765) to work with Azure Mobile Services. The workaround is not required for projects using later versions of Visual Studio 2015.**

#####Get reference to a table

The following code gets a reference to a table that contains data for a TodoItem, which you can use in subsequent operations to read and update the data table. The TodoItem table is created automatically when you create a mobile service.

	var todoTable = mobileServiceClient.getTable('TodoItem');

For these examples to work, permissions on the table must be set to **Anybody with an Application Key**. Later, you can set up authentication. See [Get started with authentication](mobile-services-html-get-started-users.md).

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