<properties title="Getting Started with Mobile Services" pageTitle="" metaKeywords="Azure, Getting Started, Mobile Services" description="" services="mobile-services" documentationCenter="" authors="ghogen, kempb" />

<tags ms.service="mobile-services" ms.workload="web" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="10/8/2014" ms.author="ghogen, kempb" />

## Getting Started with Mobile Services

### What Happened?

#####References Added

The Azure Mobile Services NuGet package was added to your project. As a result, the following .NET references were added to your project: `Microsoft.WindowsAzure.Mobile`, `Microsoft.WindowsAzure.Mobile.Ext`, `Newtonsoft.Json`, `System.Net.Http.Extensions`, `System.Net.Http.Primitives` 

#####Connection string values for Mobile Services

In your App.xaml.cs file, a **MobileServiceClient** object was created with the selected mobile service’s application URL and application key. 

### Getting Started with Mobile Services

#####Get reference to a table

The following code gets a reference to a table that contains data for a TodoItem, which you can use in subsequent operations to read and update the data table. You'll need the TodoItem class with attributes set up to interpet the JSON that the mobile service sends in response to your queries.

	public class TodoItem
    {
        public string Id { get; set; }

        [JsonProperty(PropertyName = "text")]
        public string Text { get; set; }

        [JsonProperty(PropertyName = "complete")]
        public bool Complete { get; set; }
    }

	IMobileServiceTable<TodoItem> todoTable = App.<yourClient>.GetTable<TodoItem>();

This code works if your table has permissions set to **Anybody with an Application Key**. If you change the permissions to secure your mobile service, you'll need to add user authentication support. See [Get Started with Authentication](http://azure.microsoft.com/en-us/documentation/articles/mobile-services-dotnet-backend-windows-universal-dotnet-get-started-users/).

#####Add entry 

Insert a new item into a data table.

	TodoItem todoItem = new TodoItem() { Text = "My first to do item", Complete = false };
	await todoTable.InsertAsync(todoItem);

#####Read/query table 

The following code queries a table for all items. Note that it returns only the first page of data, which by default is 50 items. You can pass the page size you want, since it's an optional parameter.

    List<TodoItem> items = await todoTable.ToListAsync();
    try
    {
        // Query that returns all items.   
        items = await todoTable.ToCollectionAsync();             
    }
    catch (MobileServiceInvalidOperationException e)
    {
        // handle exception
    }


#####Update entry

Update a row in a data table. The parameter item is the TodoItem object to be updated.

	await todoTable.UpdateAsync(item);

#####Delete entry

Delete a row in the database. The parameter item is the TodoItem object to be deleted.

	await todoTable.DeleteAsync(item);

[Learn more about mobile services](http://azure.microsoft.com/documentation/services/mobile-services/)