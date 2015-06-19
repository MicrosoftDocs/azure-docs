
Now, let's update the app to store items in Azure Mobile Services instead of the local in-memory collection.

* In **TodoService.h**, locate the following line:

```
// TODO - create an MSClient property
```

Replace this comment with the following line. This creates a property that represents the `MSClient` to connect to the service.

```
@property (nonatomic, strong)   MSClient *client;
```


* In **TodoService.m**, locate the following line:

```
// TODO - create an MSTable property for your items
```

Replace this comment with the following line inside the `@interface` declaration. This creates a property representation for your mobile services table.

```
@property (nonatomic, strong)   MSTable *table;
```


* In the Management Portal, click **Mobile Services**, and then click the mobile service. Click the **Dashboard** tab and make a note of the **Site URL**. Then click **Manage Keys** and make a note of the **Application Key**. You will need these values when accessing the mobile service from your app code.


* In **TodoService.m**, locate the following line:

```
// Initialize the Mobile Service client with your URL and key.
```

After this comment, add the following line of code. Replace `APPURL` and `APPKEY` with the site URL and application key you obtained in the previous step.

```
self.client = [MSClient clientWithApplicationURLString:@"APPURL" applicationKey:@"APPKEY"];
```


* In **TodoService.m**, locate the following line:

```
// Create an MSTable instance to allow us to work with the TodoItem table.
```

Replace this comment with the following line. This creates the TodoItem table instance.

```
self.table = [self.client tableWithName:@"TodoItem"];
```


* In **TodoService.m**, locate the following line:

```
// Create a predicate that finds items where complete is false
```

Replace this comment with the following line. This creates a query to return all tasks that have not yet been completed.

```
NSPredicate * predicate = [NSPredicate predicateWithFormat:@"complete == NO"];
```


* Locate the following line:

```
// Query the TodoItem table and update the items property with the results from the service
```

Replace the comment and the subsequent **completion** block invocation with the following code:

```
[self.table readWhere:predicate completion:^(NSArray *results, NSInteger totalCount, NSError *error)
{
self.items = [results mutableCopy];
   completion();
}];
```


* Locate the **addItem** method, and replace its body with the following code. This code sends an insert request to the mobile service.

```
// Insert the item into the TodoItem table and add to the items array on completion
[self.table insert:item completion:^(NSDictionary *result, NSError *error) {
    NSUInteger index = [items count];
    [(NSMutableArray *)items insertObject:item atIndex:index];

    // Let the caller know that we finished
    completion(index);
}];
```


* Locate the **completeItem** method, and locate the following commented line of code:

```
// Update the item in the TodoItem table and remove from the items array on completion
```

Replace the body of the method, from that point to the end of the method, with the following code. This code removes todo items after they are marked as completed.

```
// Update the item in the TodoItem table and remove from the items array on completion
[self.table update:mutable completion:^(NSDictionary *item, NSError *error) {

    // Get a fresh index in case the list has changed
    NSUInteger index = [items indexOfObjectIdenticalTo:mutable];

    [mutableItems removeObjectAtIndex:index];

    // Let the caller know that we have finished
    completion(index);
}];
```


* In TodoListController.m, locate the **onAdd** method and overwrite it with the following code:

```
- (IBAction)onAdd:(id)sender
{
    if (itemText.text.length  == 0)
    {
        return;
    }

    NSDictionary *item = @{ @"text" : itemText.text, @"complete" : @NO };
    UITableView *view = self.tableView;
    [self.todoService addItem:item completion:^(NSUInteger index)
    {
        NSIndexPath *indexPath = [NSIndexPath indexPathForRow:index inSection:0];
        [view insertRowsAtIndexPaths:@[ indexPath ]
                    withRowAnimation:UITableViewRowAnimationTop];
    }];

    itemText.text = @"";
}
```
