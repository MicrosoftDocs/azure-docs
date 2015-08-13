
By default, APIs in a Mobile App backend can be invoked anonymously. Next, you need to restrict access to only authenticated clients.  

1. On your PC, open the server project in Visual Studio and navigate to **Controllers** > **TodoItemController.cs**.

2. Add the `[Authorize]` attribute to the **TodoItemController** class, as follows. This requires that all operations against the TodoItem table be made by an authenticated user. To restrict access only to specific methods, you can also apply this attribute just to those methods instead of the class.


        [Authorize]
        public class TodoItemController : TableController<TodoItem>
   
    This requires that all operations against the TodoItem table be made by an authenticated user. To restrict access only to specific methods, you can also apply this attribute just to those methods instead of the class.
   
3. Republish your server project.
