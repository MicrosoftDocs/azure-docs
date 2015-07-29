* To test authentication, let's restrict access to the backend to only authenticated clients, since the backend is publicly invokable by default. Open the backend Visual Studio project > **Controllers** folder > **TodoItemController.cs**. **TodoItemController**  implements data access for the TodoItem table. 

* Apply the `Authorize` attribute to class **TodoItemController**. This makes all table operations require an authenticated user. Alternatively, set `Authorize` on individual methods you'd like to restrict access to. Finally, republish your backend project.

```
        [Authorize]
        public class TodoItemController : TableController<TodoItem>
```

