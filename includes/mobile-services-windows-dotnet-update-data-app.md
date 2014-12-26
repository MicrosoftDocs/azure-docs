
1. In the file MainPage.xaml.cs, add or uncomment the following using statements: 

		using Microsoft.WindowsAzure.MobileServices;

2. Replace the TodoItem class definition with the following code: 

	    public class TodoItem
	    {
	        public string Id { get; set; }
	
	        [Newtonsoft.Json.JsonProperty(PropertyName = "text")]  
	        public string Text { get; set; }
	
	        [Newtonsoft.Json.JsonProperty(PropertyName = "complete")]  
	        public bool Complete { get; set; }
	    }
	
	The **JsonPropertyAttribute** is used to define the mapping between property names in the client type to column names in the underlying data table.

	>[AZURE.NOTE] In a universal Windows app project, the TodoItem class is defined in the seperate code file in the shared DataModel folder.

3. In MainPage.xaml.cs, comment-out or delete the line that defines the existing items collection, then uncomment or add the following lines, replacing _&lt;yourClient&gt;_ with the `MobileServiceClient` field added to the App.xaml.cs file when you connected your project to the mobile service: 

		private MobileServiceCollection<TodoItem, TodoItem> items;
		private IMobileServiceTable<TodoItem> todoTable = 
		    App.<yourClient>.GetTable<TodoItem>();
		  
	This code creates a mobile services-aware binding collection (items) and a proxy class for the database table (todoTable). 

4. In the **InsertTodoItem** method, remove the line of code that sets the **TodoItem.Id** property, add the **async** modifier to the method, and uncomment the following line of code: 

		await todoTable.InsertAsync(todoItem);


	This code inserts a new item into the table. 

5. Replace the **RefreshTodoItems** method with the following code: 

		private async void RefreshTodoItems()
        {
            MobileServiceInvalidOperationException exception = null;
            try
            {
                // Query that returns all items.   
                items = await todoTable.ToCollectionAsync();             
            }
            catch (MobileServiceInvalidOperationException e)
            {
                exception = e;
            }
            if (exception != null)
            {
                await new MessageDialog(exception.Message, "Error loading items").ShowAsync();
            }
            else
            {
                ListItems.ItemsSource = items;
                this.ButtonSave.IsEnabled = true;
            }    
        }

	This sets the binding to the collection of items in `todoTable`, which contains all of the **TodoItem** objects returned from the mobile service. If there is a problem executing the query, a message box is raised to display the errors. 

6. In the **UpdateCheckedTodoItem** method, add the **async** modifier to the method, and uncomment the following line of code: 

		await todoTable.UpdateAsync(item);

	This sends an item update to the mobile service. 

Now that the app has been updated to use Mobile Services for backend storage, it's time to test the app against Mobile Services.