---
author: conceptdev
ms.service: app-service-mobile
ms.topic: include
ms.date: 08/23/2018
ms.author: crdun
---
## <a name="create-client"></a>Create a client connection
Create a client connection by creating a `WindowsAzure.MobileServiceClient` object.  Replace `appUrl` with the
URL to your Mobile App.

```javascript
var client = WindowsAzure.MobileServiceClient(appUrl);
```

## <a name="table-reference"></a>Work with tables
To access or update data, create a reference to the backend table. Replace `tableName` with the name of your table

```javascript
var table = client.getTable(tableName);
```

Once you have a table reference, you can work further with your table:

* [Query a Table](#querying)
  * [Filtering Data](#table-filter)
  * [Paging through Data](#table-paging)
  * [Sorting Data](#sorting-data)
* [Inserting Data](#inserting)
* [Modifying Data](#modifying)
* [Deleting Data](#deleting)

### <a name="querying"></a>How to: Query a table reference
Once you have a table reference, you can use it to query for data on the server.  Queries are made in a "LINQ-like" language.
To return all data from the table, use the following code:

```javascript
/**
 * Process the results that are received by a call to table.read()
 *
 * @param {Object} results the results as a pseudo-array
 * @param {int} results.length the length of the results array
 * @param {Object} results[] the individual results
 */
function success(results) {
   var numItemsRead = results.length;

   for (var i = 0 ; i < results.length ; i++) {
       var row = results[i];
       // Each row is an object - the properties are the columns
   }
}

function failure(error) {
    throw new Error('Error loading data: ', error);
}

table
    .read()
    .then(success, failure);
```

The success function is called with the results.  Do not use `for (var i in results)` in
the success function as that will iterate over information that is included in the results
when other query functions (such as `.includeTotalCount()`) are used.

For more information on the Query syntax, see the [Query object documentation].

#### <a name="table-filter"></a>Filtering data on the server
You can use a `where` clause on the table reference:

```javascript
table
    .where({ userId: user.userId, complete: false })
    .read()
    .then(success, failure);
```

You can also use a function that filters the object.  In this case, the `this` variable is assigned to the
current object being filtered.  The following code is functionally equivalent to the prior example:

```javascript
function filterByUserId(currentUserId) {
    return this.userId === currentUserId && this.complete === false;
}

table
    .where(filterByUserId, user.userId)
    .read()
    .then(success, failure);
```

#### <a name="table-paging"></a>Paging through data
Utilize the `take()` and `skip()` methods.  For example, if you wish to split the table into 100-row records:

```javascript
var totalCount = 0, pages = 0;

// Step 1 - get the total number of records
table.includeTotalCount().take(0).read(function (results) {
    totalCount = results.totalCount;
    pages = Math.floor(totalCount/100) + 1;
    loadPage(0);
}, failure);

function loadPage(pageNum) {
    let skip = pageNum * 100;
    table.skip(skip).take(100).read(function (results) {
        for (var i = 0 ; i < results.length ; i++) {
            var row = results[i];
            // Process each row
        }
    }
}
```

The `.includeTotalCount()` method is used to add a totalCount field to the results object.  The
totalCount field is filled with the total number of records that would be returned if no paging
is used.

You can then use the pages variable and some UI buttons to provide a page list; use `loadPage()` to
load the new records for each page.  Implement caching to speed access to records that have already been loaded.

#### <a name="sorting-data"></a>How to: Return sorted data
Use the `.orderBy()` or `.orderByDescending()` query methods:

```javascript
table
    .orderBy('name')
    .read()
    .then(success, failure);
```

For more information on the Query object, see the [Query object documentation].

### <a name="inserting"></a>How to: Insert data
Create a JavaScript object with the appropriate date and call `table.insert()` asynchronously:

```javascript
var newItem = {
    name: 'My Name',
    signupDate: new Date()
};

table
    .insert(newItem)
    .done(function (insertedItem) {
        var id = insertedItem.id;
    }, failure);
```

On successful insertion, the inserted item is returned with the additional fields that are required
for sync operations.  Update your own cache with this information for later updates.

The Azure Mobile Apps Node.js Server SDK supports dynamic schema for development purposes.  Dynamic Schema allows
you to add columns to the table by specifying them in an insert or update operation.  We recommend that you turn
off dynamic schema before moving your application to production.

### <a name="modifying"></a>How to: Modify data
Similar to the `.insert()` method, you should create an Update object and then call `.update()`.  The update
object must contain the ID of the record to be updated - the ID is obtained when reading the record or
when calling `.insert()`.

```javascript
var updateItem = {
    id: '7163bc7a-70b2-4dde-98e9-8818969611bd',
    name: 'My New Name'
};

table
    .update(updateItem)
    .done(function (updatedItem) {
        // You can now update your cached copy
    }, failure);
```

### <a name="deleting"></a>How to: Delete data
To delete a record, call the `.del()` method.  Pass the ID in an object reference:

```javascript
table
    .del({ id: '7163bc7a-70b2-4dde-98e9-8818969611bd' })
    .done(function () {
        // Record is now deleted - update your cache
    }, failure);
```
