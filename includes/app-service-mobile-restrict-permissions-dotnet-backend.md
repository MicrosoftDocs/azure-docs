

By default, the endpoints defined in your Mobile App are publically exposed. To secure your resources, you need to restrict access to authenticated clients only.

1. In Visual Studio, open the project that contains your Mobile App code. 

2. In Solution Explorer, expand the Controllers folder and open the TodoItemController.cs project file.

	The **TodoItemController** class implements data access for the TodoItem table. 

3. Apply the `Authorize` attribute to the **TodoItemController** class:

        [Authorize]
        public class TodoItemController : TableController<TodoItem>

	This will ensure that all operations against the **TodoItem** table require an authenticated user. 

	>[AZURE.NOTE]Apply the Authorize attribute to individual methods to set specific authorization levels on the methods exposed by the controller.

4. Republish your mobile app project.

