<properties 
	pageTitle="" 
	description="How to get started with Mobile Services in a JavaScript project in Visual Studio" 
	services="mobile-services" 
	documentationCenter="" 
	authors="patshea123" 
	manager="douge" 
	editor=""/>

<tags 
	ms.service="mobile-services" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="vs-getting-started" 
	ms.devlang="JavaScript" 
	ms.topic="article" 
	ms.date="05/06/2015" 
	ms.author="patshea123"/>

# Getting Started with Mobile Services

> [AZURE.SELECTOR]
> - [Getting Started](vs-mobile-services-javascript-getting-started.md)
> - [What Happened](vs-mobile-services-javascript-what-happened.md)

The first step you need to do in order to follow the code in these examples depends on what type of mobile service you connected to.

For a JavaScript backend mobile service, create a table called TodoItem.  To create a table,  locate the mobile service under the Azure node in Server Explorer, right-click the mobile service's node to open the context menu, and choose **Create Table**. Enter "TodoItem" as the table name.

If instead you have a .NET backend mobile service, there's already a TodoItem table in the default project template that Visual Studio created for you, but you need to publish it to Azure. To publish it, open the context menu for the mobile service project in Solution Explorer, and choose **Publish Web**. Accept the defaults, and choose the **Publish** button.

#####Get reference to a table

The client object was added to your project already.  Its name is the name of your mobile service with "Client" appended to it. The following code gets a reference to a table that contains data for a TodoItem, which you can use in subsequent operations to read and update the data table.

	var todoTable = yourMobileServiceClient.getTable('TodoItem');

#####Add entry 

Insert a new item into a data table. An id (a GUID of type string) is automatically created as the primary key for the new row. Don't change the type of the id column, since the mobile services infrastructure uses it.

    var todoTable = client.getTable('TodoItem');
    var todoItems = new WinJS.Binding.List();
    var insertTodoItem = function (todoItem) {
        todoTable.insert(todoItem).done(function (item) {
            todoItems.push(item);
        });
    };

#####Read/query table

The following code queries a table for all items, updates a local collection and binds the result to the UI element listItems.

        // This code refreshes the entries in the list view 
        // by querying the TodoItems table.
        todoTable.where()
            .read()
            .done(function (results) {
                todoItems = new WinJS.Binding.List(results);
                listItems.winControl.itemDataSource = todoItems.dataSource;
            });

You can use the where method to modify the query. Here's an example that filters out completed items.

    todoTable.where(function () {
        return (this.complete === false && this.createdAt !== null);
    })
    .read()
    .done(function (results) {
        todoItems = new WinJS.Binding.List(results);
        listItems.winControl.itemDataSource = todoItems.dataSource;
    });

For more examples of queries you can use, see [query object](http://msdn.microsoft.com/library/azure/jj613353.aspx).

#####Update entry

Update a row in a data table. In this example, todoItem is the updated item, and item is the same item as returned from the mobile service. When the mobile service responds, the item is updated in the local todoItems list using the [splice](http://msdn.microsoft.com/library/windows/apps/Hh700810.aspx) method. Call the [done]() method on the returned [Promise]() object to get a copy of the inserted object and handle any errors.

        todoTable.update(todoItem).done(function (item) {
            todoItems.splice(todoItems.indexOf(item), 1, item);
        });

#####Delete entry

Delete a row in a data table. Call the [done]() method on the returned [Promise]() object to get a copy of the inserted object and handle any errors.

	todoTable.delete(todoItem).done(function (item) {
	    todoItems.splice(todoItems.indexOf(item), 1);
    }



[Learn more about mobile services](http://azure.microsoft.com/documentation/services/mobile-services/)