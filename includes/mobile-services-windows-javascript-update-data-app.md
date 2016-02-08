

1. Next, uncomment or add the following line of code and replace `<yourClient>` with the variable added to the service.js file when you connected your project to the mobile service:

		var todoTable = <yourClient>.getTable('TodoItem');

   	This code creates a proxy object (**todoTable**) for the new database table, using the caching filter. 

2. Replace the **InsertTodoItem** function with the following code:

		var insertTodoItem = function (todoItem) {
		    // Inserts a new row into the database. When the operation completes
		    // and Mobile Services has assigned an id, the item is added to the binding list.
		    todoTable.insert(todoItem).done(function (item) {
		        todoItems.push(item);
		    });
		};

	This code inserts a new item into the table.

3. Replace the **RefreshTodoItems** function with the following code:

        var refreshTodoItems = function () {
            // This code refreshes the entries in the list by querying the table.
            // Results are filtered to remove completed items.
            todoTable.where({ complete: false })
                .read().done(function (results) {
                todoItems = new WinJS.Binding.List(results);
                listItems.winControl.itemDataSource = todoItems.dataSource;
            });
        };

   	This sets the binding to the collection of items in the todoTable, which contains all of the **TodoItem** objects returned from the mobile service. 

4. Replace the **UpdateCheckedTodoItem** function with the following code:
        
        var updateCheckedTodoItem = function (todoItem) {
            // This code takes a freshly completed TodoItem and updates the database. 
            todoTable.update(todoItem);
            // Remove the completed item from the filtered list.
            todoItems.splice(todoItems.indexOf(todoItem), 1);
        };

   	This sends an item update to the mobile service.

Now that the app has been updated to use Mobile Services for backend storage, it's time to test the app against Mobile Services.
