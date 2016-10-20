<properties
	pageTitle="Using soft delete in Mobile Services (Windows Store) | Microsoft Azure"
	description="Learn how to use Azure Mobile Services soft delete feature in your application"
	documentationCenter=""
	authors="wesmc7777"
	manager="dwrede"
	editor=""
	services="mobile-services"/>

<tags
	ms.service="mobile-services"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-windows"
	ms.devlang="dotnet"
	ms.topic="article"
	ms.date="07/21/2016"
	ms.author="wesmc"/>

# Using soft delete in Mobile Services

[AZURE.INCLUDE [mobile-service-note-mobile-apps](../../includes/mobile-services-note-mobile-apps.md)]

&nbsp;


##Overview

Tables created with either the JavaScript or .NET backend can optionally have soft delete enabled. When using soft delete, a new column called *\__deleted* of [SQL bit type] is added to the database. With soft delete enabled, a delete operation does not physically delete rows from the database, but rather sets the value of the deleted column to TRUE.

When querying records on a table with soft delete enabled, deleted rows are not returned in the query by default. In order to request these rows, you must pass a query parameter *\__includeDeleted=true* in your [REST Query operation](http://msdn.microsoft.com/library/azure/jj677199.aspx). In the .NET client SDK, you can also use the helper method `IMobileServiceTable.IncludeDeleted()`.

Soft delete support for the .NET backend first released with version 1.0.402 of the Microsoft Azure Mobile Services .NET Backend. The latest NuGet packages are available here, [Microsoft Azure Mobile Services .NET Backend](http://go.microsoft.com/fwlink/?LinkId=513165).


Some of the potential benefits of using soft delete:

* When using the [Offline data Sync for Mobile Services] feature, the client SDK automatically queries for deleted records and removes them from the local database. Without soft delete enabled, you need to write additional code on the backend so that the client SDK knows which records to remove from the local store. Otherwise, the client local store and backend will be inconsistent with regard to these deleted records and the client method `PurgeAsync()` must be called to clear the local store.
* Some applications have a business requirement to never physically delete data, or to delete data only after it has been audited. The soft delete feature can be useful in this scenario.
* Soft delete can be used to implement an "undelete" feature, so that data deleted by accident can be recovered.
However, soft deleted records take up space in the database, so you should consider creating a scheduled job to periodically hard delete the soft deleted records. For an example of this, see [Using soft delete with the .NET backend](#using-with-dotnet) and [Using soft delete with the JavaScript backend](#using-with-javascript). Your client code should also periodically call `PurgeAsync()` so that these hard deleted records do not remain in the device's local data store.





##Enabling soft delete for the .NET backend

Soft delete support for the .NET backend first released with version 1.0.402 of the Microsoft Azure Mobile Services .NET Backend. The latest NuGet packages are available here, [Microsoft Azure Mobile Services .NET Backend](http://go.microsoft.com/fwlink/?LinkId=513165).

The following steps guide you on how to enable soft delete for a .NET backend mobile service.

1. Open your .NET backend mobile service project in Visual Studio.
2. Right click the .NET backend project and click **Manage NuGet Packages**.
3. In the package manager dialog, click **Nuget.org** under updates and install version 1.0.402 or later of the [Microsoft Azure Mobile Services .NET Backend](http://go.microsoft.com/fwlink/?LinkId=513165) NuGet packages.
3. In Solution Explorer for Visual Studio, expand the **Controllers** node under your .NET backend project and open your controller source for. For example, *TodoItemController.cs*.
4. In the `Initialize()` method of your controller, pass the `enableSoftDelete: true` parameter to the EntityDomainManager constructor.

        protected override void Initialize(HttpControllerContext controllerContext)
        {
            base.Initialize(controllerContext);
            MobileService1Context context = new MobileService1Context();
            DomainManager = new EntityDomainManager<TodoItem>(context, Request, Services, enableSoftDelete: true);
        }


##Enabling soft delete for the JavaScript backend

If you are creating a new table for your mobile service, you can enable soft delete on the table creation page.

![][2]

To enable soft delete on an existing table in the JavaScript backend:

1. In the [Azure classic portal], click your mobile service. Then click the Data tab.
2. On the data page, click to select the desired table. Then click the **Enable Soft Delete** button in the command bar. If the table already has soft delete enabled, this button will not appear but you will be able to see the *\__deleted* column when clicking the **Browse** or **Columns** tab for the table.

    ![][0]

    To disable soft delete for your table, click the **Columns** tab and then click the *\__deleted* column and the **Delete** button.

    ![][1]

## <a name="using-with-dotnet"></a>Using soft delete with the .NET backend


The following scheduled job purges soft deleted records that are more than a month old:

    public class SampleJob : ScheduledJob
    {
        private MobileService1Context context;

        protected override void Initialize(ScheduledJobDescriptor scheduledJobDescriptor,
            CancellationToken cancellationToken)
        {
            base.Initialize(scheduledJobDescriptor, cancellationToken);
            context = new MobileService1Context();
        }

        public override Task ExecuteAsync()
        {
            Services.Log.Info("Purging old records");
            var monthAgo = DateTimeOffset.UtcNow.AddDays(-30);

            var toDelete = context.TodoItems.Where(x => x.Deleted == true && x.UpdatedAt <= monthAgo).ToArray();
            context.TodoItems.RemoveRange(toDelete);
            context.SaveChanges();

            return Task.FromResult(true);
        }
    }

To learn more about schedule jobs with .NET backend Mobile Services, see: [Schedule recurring jobs with JavaScript backend Mobile Services](mobile-services-dotnet-backend-schedule-recurring-tasks.md)




## <a name="using-with-javascript"></a> Using soft delete with the JavaScript backend

You use table scripts to add logic around the soft delete feature with JavaScript backend mobile services.

To detect an undelete request, use the property "undelete" in your update table script:

    function update(item, user, request) {
        if (request.undelete) { /* any undelete specific code */; }
    }
To include deleted records in query result in a script, set the "includeDeleted" parameter to true:

    tables.getTable('softdelete_scenarios').read({
        includeDeleted: true,
        success: function (results) {
            request.respond(200, results)
        }
    });

To retrieve deleted records via an HTTP request, add the query parameter "__includedeleted=true":

    http://youservice.azure-mobile.net/tables/todoitem?__includedeleted=true

### Sample scheduled job for purging soft deleted records.

This is a sample scheduled job that deletes records that were updated prior to a particular date:

    function purgedeleted() {
         mssql.query('DELETE FROM softdelete WHERE __deleted=1', {
            success: function(results) {
                console.log(results);
            },
            error: function(err) {
                console.log("error is: " + err);
        }});
    }

To learn more about scheduled jobs with JavaScript backend Mobile Services, see: [Schedule recurring jobs with JavaScript backend Mobile Services](mobile-services-schedule-recurring-tasks.md).





<!-- Images -->
[0]: ./media/mobile-services-using-soft-delete/enable-soft-delete-button.png
[1]: ./media/mobile-services-using-soft-delete/disable-soft-delete.png
[2]: ./media/mobile-services-using-soft-delete/enable-soft-delete-new-table.png

<!-- URLs. -->
[SQL bit type]: http://msdn.microsoft.com/library/ms177603.aspx
[Offline data Sync for Mobile Services]: mobile-services-windows-store-dotnet-get-started-offline-data.md
[Azure classic portal]: https://manage.windowsazure.com/


