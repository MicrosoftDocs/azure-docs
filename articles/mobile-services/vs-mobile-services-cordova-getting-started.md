<properties
	pageTitle="Getting Started with a Cordova mobile services project (Visual Studio Connected Services) | Microsoft Azure"
	description="Describes the first steps you can take after connecting your Cordova project to Azure Mobile Services by using Visual Studio Connected Services."
	services="mobile-services"
	documentationCenter=""
	authors="mlhoop"
	manager="douge"
	editor=""/>

<tags
	ms.service="mobile-services"
	ms.workload="mobile"
	ms.tgt_pltfrm="vs-getting-started"
	ms.devlang="multiple"
	ms.topic="article"
	ms.date="07/21/2016"
	ms.author="mlearned"/>

# Getting Started with Mobile Services (Cordova Projects)

[AZURE.INCLUDE [mobile-service-note-mobile-apps](../../includes/mobile-services-note-mobile-apps.md)]

##First steps
The first step you need to do in order to follow the code in these examples depends on what type of mobile service you connected to.

- For a JavaScript backend mobile service, create a table called TodoItem.  To create a table,  locate the mobile service under 
the Azure node in Server Explorer, right-click the mobile service's node to open the context menu, and choose **Create Table**. 
Enter "TodoItem" as the table name.

- If you have a .NET backend mobile service, there's already a TodoItem table in the default project template that Visual Studio 
created for you, but you need to publish it to Azure. To publish it, open the context menu for the mobile service project in 
Solution Explorer, and choose **Publish Web**. Accept the defaults, and choose the **Publish** button.

##Create a reference to a table

The following code gets a reference to a table that contains data for a TodoItem, which you can use in subsequent operations to 
read and update the data table. The TodoItem table is created automatically when you create a mobile service.

    var todoTable = mobileServiceClient.getTable('TodoItem');

For these examples to work, permissions on the table must be set to **Anybody with an Application Key**. Later, you can set
 up authentication. See [Get started with authentication](mobile-services-html-get-started-users.md).

##Add an item to a table

Insert a new item into a data table. An id (a GUID of type string) is automatically created as the primary key for the new 
row. Call the **done** method on the returned [Promise](https://msdn.microsoft.com/library/dn802826.aspx) object to get a 
copy of the inserted object and handle any errors.

    function TodoItem(text) {
        this.text = text;
        this.complete = false;
    }

    var items = new Array();
    var insertTodoItem = function (todoItem) {
        todoTable.insert(todoItem).done(function (item) {
            items.push(item)
        });
    };

##Read or query a table

The following code queries a table for all items, sorted by the text field. You can add code to process the query results
 in the success handler. In this case, a local array of the items is updated.

    todoTable.orderBy('text')
        .read().done(function (results) {
            items = results.slice();
        });

You can use the where method to modify the query. Here's an example that filters out completed items.

    todoTable.where(function () {
            return (this.complete === false);
        })
        .read().done(function (results) {
            items = results.slice();
        });

For more examples of queries you can use, see [query](https://msdn.microsoft.com/library/azure/jj613353.aspx) object.

##Update a table item

Update a row in a data table. In this code, when the mobile service responds, the item is removed from the 
list. Call the **done** method on the returned [Promise](https://msdn.microsoft.com/library/dn802826.aspx) object to 
get a copy of the inserted object and handle any errors.

    todoTable.update(todoItem).done(function (item) {
        // Update a local collection of items.
        items.splice(items.indexOf(todoItem), 1, item);
    });

##Delete a table item

Delete a row in a data table using the **del** method. Call the **done** method on the returned 
[Promise](https://msdn.microsoft.com/library/dn802826.aspx) object to get a copy of the inserted object 
and handle any errors.

    todoTable.del(todoItem).done(function (item) {
        items.splice(items.indexOf(todoItem), 1);
    });

