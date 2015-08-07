
By default, a Mobile App backend can be invoked anonymously. Next, you need to restrict access to only authenticated clients.  

1. In the server project in Visual Studio, open Controllers > **TodoItemController.cs**.

2. Add `AuthorizeAttribute` to the **TodoItemController** class, as follows:

```
    [Authorize]
    public class TodoItemController : TableController<TodoItem>
```
	This requires that all operations against the TodoItem table be made by an authenticated user. To restrict access only to specific methods, you can also apply this attribute just to those methods instead of the class. 

3. Republish your server project.


    