In order to support the offline features of mobile services, we used the `IMobileServiceSyncTable` interface and initialized `MobileServiceClient.SyncContext` with a local store. In this case the local store was a SQLite database.

The normal CRUD operations for mobile services work as if the app is still connected but, all the operations occur against the local store.

When we wanted to synchronize the local store with the server, we used the `IMobileServiceSyncTable.PullAsync` and `MobileServiceClient.SyncContext.PushAsync` methods.

*  To push changes to the server, we called `IMobileServiceSyncContext.PushAsync()`. This method is a member of `IMobileServicesSyncContext` instead of the sync table because it will push changes across all tables.

    Only records that have been modified in some way locally (through CUD operations) will be sent to the server.
   
* To pull data from a table on the server to the app, we called `IMobileServiceSyncTable.PullAsync`.

    A pull always issues a push first. This is to ensure all tables in the local store along with relationships remain consistent.

    There are also overloads of `PullAsync()` that allow a query to be specified in order to filter the data that is stored on the client. If a query is not passed, `PullAsync()` will pull all rows in the corresponding table (or query). You can pass the query to filter only the changes your app needs to sync with.

* To enable incremental sync, pass a query ID to `PullAsync()`. The query ID is used to store the last updated timestamp from the results of the last pull operation. The query ID should be a descriptive string that is unique for each logical query in your app. If the query has a parameter, then the same parameter value has to be part of the query ID.

    For instance, if you are filtering on userid, it needs to be part of the query ID:

        await PullAsync("todoItems" + userid, syncTable.Where(u => u.UserId = userid));

    If you want to opt out of incremental sync, pass `null` as the query ID. In this case, all records will be retrieved on every call to `PullAsync`, which is potentially inefficient.

* To remove records from the device local store when they have been deleted in your mobile service database, you should enable [Soft Delete]. Otherwise, your app should periodically call `IMobileServiceSyncTable.PurgeAsync()` to purge the local store.
