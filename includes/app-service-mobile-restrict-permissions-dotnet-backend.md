* To test authentication, let's restrict access to the backend to only authenticated clients, since the backend publicly invokable by default. Open the backend Visual Studio project > **Controllers** folder > **TodoItemController.cs**. **TodoItemController**  implements data access for the TodoItem table. 

* Apply the `Authorize` attribute to class **TodoItemController**. This makes all **TodoItem** table operations require an authenticated user. Alternatively, set `Authorize` on individual methods you'd like to restrict access to.

```
        [Authorize]
        public class TodoItemController : TableController<TodoItem>
```

* Republish your backend project.

