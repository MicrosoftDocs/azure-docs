
Next, you need to change the way that push notifications are registered so that a user is authenticated before registration is attempted.

1. In **QSAppDelegate.m**, remove the implementation of **didFinishLaunchingWithOptions** altogether.

2. Open **QSTodoListViewController.m** and add the following code to the end of the **viewDidLoad** method:

```
// Register for remote notifications
[[UIApplication sharedApplication] registerForRemoteNotificationTypes:
UIRemoteNotificationTypeAlert | UIRemoteNotificationTypeBadge | UIRemoteNotificationTypeSound];
```
