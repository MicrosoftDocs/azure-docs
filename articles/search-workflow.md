<properties title="Search Service: workflow for developers" pageTitle="Search Service: workflow for developers" description="Search Service: workflow for developers" metaKeywords="" services="" solutions="" documentationCenter="" authors="" videoId="" scriptId="" />

# Search Service: workflow for developers

+ [Operations for Azure Search] 
+ [Tasks performed in your local dev environment]
+ [External functions needed in a Search application]
+ [Next steps]


## Operations for Azure Search

This section explains the typical usage flow an administrator will go through when creating and maintaining the search service and its indexes.

<h3>Create Search Service</h3>

In this step you are returned with 2 administrative keys as well as a single query key 


<h3>Create Search Index</h3>

The search index is contained within the search service.

In this step you define the schema in JSON format for the search service and execute an HTTPS PUT request to have this index created

<h3>Add Documents</h3>

Once the search index is created, you can add documents to the index by POSTing them in JSON format. Each document must have a unique key. Document data is represented as a set of key/value pairs

We recommend adding documents in batches to improve performance

Note: when the service receives documents, they are queued up for indexing, and may not be immediately included in search results. If the service is not under a heavy load, documents will typically be indexed within a few seconds. 

<h3>Query Index</h3>

Once the documents have been indexed, you can execute search queries 

<h3>Update and Delete Indexes</h3>

Optionally, you can make schema changes to the search index, update / delete documents from within the index and delete indexes

## Tasks performed in your local dev environment

Ut eu pretium lacus. Nullam purus est, iaculis sed est vel, euismod vehicula odio.   

1. Curabitur lacinia, erat tristique iaculis rutrum, erat sem sodales nisi, eu condimentum turpis nisi a purus. 

        - (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:
        (NSDictionary *)launchOptions
        {
            // Register for remote notifications
            [[UIApplication sharedApplication] registerForRemoteNotificationTypes:
            UIRemoteNotificationTypeAlert | UIRemoteNotificationTypeBadge | UIRemoteNotificationTypeSound];
            return YES;
        }   	 

2. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia. 

   	    // Because toast alerts don't work when the app is running, the app handles them.
        // This uses the userInfo in the payload to display a UIAlertView.
        - (void)application:(UIApplication *)application didReceiveRemoteNotification:
        (NSDictionary *)userInfo {
            NSLog(@"%@", userInfo);
            UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Notification" message:
            [userInfo objectForKey:@"inAppMessage"] delegate:nil cancelButtonTitle:
            @"OK" otherButtonTitles:nil, nil];
            [alert show];
        }


    > [WACOM.NOTE] Duis sed diam non <i>nisl molestie</i> pharetra eget a est. [Link 2 to another azure.microsoft.com documentation topic]


Quisque commodo eros vel lectus euismod auctor eget sit amet leo. Proin faucibus suscipit tellus dignissim ultrices.

## External functions needed in a Search application
 
1. Maecenas sed condimentum nisi. Suspendisse potenti. 

  + Fusce
  + Malesuada
  + Sem

2. Nullam in massa eu tellus tempus hendrerit.


3. Quisque felis enim, fermentum ut aliquam nec, pellentesque pulvinar magna.

 


<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps

Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nullam ultricies, ipsum vitae volutpat hendrerit, purus diam pretium eros, vitae tincidunt nulla lorem sed turpis: [Link 3 to another azure.microsoft.com documentation topic]. 

<!--Anchors-->
[Operations for Azure Search]: #subheading-1
[Tasks performed in your local dev environment]: #subheading-2
[External functions needed in a Search application]: #subheading-3
[Next steps]: #next-steps

<!--Image references-->
[5]: ./media/0-markdown-template-for-new-articles/octocats.png
[6]: ./media/0-markdown-template-for-new-articles/pretty49.png
[7]: ./media/0-markdown-template-for-new-articles/channel-9.png


<!--Link references-->
[Link 1 to another azure.microsoft.com documentation topic]: ../virtual-machines-windows-tutorial/
[Link 2 to another azure.microsoft.com documentation topic]: ../web-sites-custom-domain-name/
[Link 3 to another azure.microsoft.com documentation topic]: ../storage-whatis-account/
