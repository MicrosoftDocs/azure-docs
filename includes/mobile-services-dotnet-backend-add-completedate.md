In this section we will modify the model of our database by adding a new timestamp field named **CompleteDate**. This field will record the last time the todo item was completed. Entity Framework will update the database based on our model change using a default database initializer class derived from [DropCreateDatabaseIfModelChanges](http://go.microsoft.com/fwlink/?LinkId=394621). 

1. In Solution Explorer for Visual Studio, expand the **App_Start** folder in the todolist service project. Open the WebApiConfig.cs file.

2. In the WebApiConfig.cs file, notice that your default database initializer class is derived from the `DropCreateDatabaseIfModelChanges` class. This means any change to the model will result in the table being dropped and recreated to accommodate the new model. So the data in the table will be lost and the table will be re-seeded. Modify the Seed method of the database initializer so that the seed data is as follows as save the WebApiConfig.cs file.

    >[AZURE.NOTE] When using the default database initializer, Entity Framework will drop and recreate the database whenever it detects a data model change in the Code First model definition. To make this data model change and maintain existing data in the database, you must use Code First Migrations. For more information, see [How to Use Code First Migrations to Update the Data Model](../articles/mobile-services-dotnet-backend-how-to-use-code-first-migrations.md).

        List<TodoItem> todoItems = new List<TodoItem>
        {
          new TodoItem { Id = "1", Text = "First seed item", Complete = false },
          new TodoItem { Id = "2", Text = "Second seed item", Complete = false },
        };
     

3. In Solution Explorer for Visual Studio, expand the **DataObjects** folder in the todolist service project. Open the TodoItem.cs file and update the TodoItem class to include the CompleteDate field as follows. Then save the TodoItem.cs file.

        public class TodoItem : EntityData
        {
          public string Text { get; set; }
          public bool Complete { get; set; }
          public System.DateTime? CompleteDate { get; set; }
        }

4. In Solution Explorer for Visual Studio, expand the **Controllers** folder in the todolist service project. Open the TodoItemController.cs file and update the `PatchTodoItem` method so that it will set the **CompleteDate** when the **Complete** property is changing from false to true. Then save the TodoItemController.cs file.

        public Task<TodoItem> PatchTodoItem(string id, Delta<TodoItem> patch)
        {
            // If complete is being set to true and was false, set CompleteDate
            if ((patch.GetEntity().Complete == true) &&
                (GetTodoItem(id).Queryable.Single().Complete == false))
            {
                patch.TrySetPropertyValue("CompleteDate", System.DateTime.Now);
            }
            return UpdateAsync(id, patch);
        }


5. Rebuild the todolist .NET backend service project and verify that you have no build errors. 

Next, you will update the client app to display the new **CompleteDate** data.