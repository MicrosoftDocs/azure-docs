1. In the backend's Visual Studio project, open **Controllers** > **TodoItemController.cs**. At the top of the file, add the following `using` statement:

```
        using Microsoft.Azure.Mobile.Server.Notifications;
```

2. Replace the `PostTodoItem` method with the following code:  

```        
        public async Task<IHttpActionResult> PostTodoItem(TodoItem item)
        {
            TodoItem current = await InsertAsync(item);

           HttpConfiguration config = this.Configuration;

           ApplePushMessage message = new ApplePushMessage(item.Text, System.TimeSpan.FromHours(1));

            try
            {
                var client = new PushClient(config);
                var result = await client.SendAsync(message);

                ServiceSettingsDictionary settings = config.GetServiceSettingsProvider().GetServiceSettings();
                config.Services.GetTraceWriter().Info(result.State.ToString());
            }
            catch (System.Exception ex)
            {
                config.Services.GetTraceWriter().Error(ex.Message, null, "Push.SendAsync Error");
            }

            return CreatedAtRoute("Tables", new { id = current.Id }, current);
        }
```
