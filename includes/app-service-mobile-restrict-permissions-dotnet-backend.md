By default, the endpoints defined in your Mobile App are publicly exposed. To secure your resources, you need to restrict access to authenticated clients only.

1. To enable authentication in the backend, open the backend Visual Studio project for your Mobile App. Then open **TodoItemController.cs** from the **Controllers** folder. **TodoItemController**  implements data access for the TodoItem table. 

2. Add the `Authorize` attribute to the **TodoItemController** class. This makes all table operations require an authenticated user. Alternatively, set `Authorize` on individual methods you'd like to restrict access to. 

        [Authorize]
        public class TodoItemController : TableController<TodoItem>

3. Republish your backend project by right clicking the project and clicking **Publish**.
