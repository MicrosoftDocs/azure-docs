
## <a name="update-app"></a>Update App to Call Custom API

1. Create a Round Rect button next to the text field, so you can click it to call the custom API. Label it **"All"**.

2. Connect the button to a new action `onCompleteAll` in **QSTodoListViewController.h**:
```
		   - (IBAction)onCompleteAll:(id)sender;
```

3. This `onCompleteAll` method handles the Click event for the new button. In turn, it calls a new `completeAll` method, which in turn invokes the new custom API. The result  is displayed in a UI dialog. Add the following implementation to **QSTodoListViewController.m**:

```
		   - (IBAction)onCompleteAll:(id)sender {
		    [self.todoService completeAll:^(id result, NSHTTPURLResponse* response, NSError* error)
		     {
		         if (error)
		         {
		             NSString* errorMessage = @"There was a problem! ";
		             errorMessage = [errorMessage stringByAppendingString:[error localizedDescription]];
		             UIAlertView* myAlert = [[UIAlertView alloc]
		                                     initWithTitle:@"Error!"
		                                     message:errorMessage
		                                     delegate:nil
		                                     cancelButtonTitle:@"Okay"
		                                     otherButtonTitles:nil];
		             [myAlert show];
		             [self refresh];
		         } else {
		             NSString* successMessage = [NSString stringWithFormat:@"%ld items marked as complete", [[result objectForKey:@"count"] integerValue]];
		             UIAlertView* myAlert = [[UIAlertView alloc]
		                                     initWithTitle:@"Success!"
		                                     message:successMessage
		                                     delegate:nil
		                                     cancelButtonTitle:@"Okay"
		                                     otherButtonTitles:nil];
		             [myAlert show];
		             [self refresh];
		         }
		     }];
  		   }
```

4. The code above refers to a new method `completeAll`. Edit **QSTodoService.h** to add a declaration for `completeAll`:

```
		- (void) completeAll:(MSAPIBlock)completion;
```

5. Implement `completeAll` in **QSTodoService.m** to send a POST request to the custom API:

```
		- (void) completeAll:(MSAPIBlock)completion
		{
		    [self.client
		     invokeAPI:@"completeall"
		     body:nil
		     HTTPMethod:@"POST"
		     parameters:nil
		     headers:nil
		     completion:completion ];
		}
```

## <a name="test-app"></a>Test App

1. In Xcode, press the **Run** button to rebuild the project and start the app.

2. Type text in the text field, and then click the **+** button. Add several items to the list this way.

3. Tap the **All** button. An alert box is displayed that indicates the number of items marked complete. The filtered query is also executed again, which clears all items from the list.
