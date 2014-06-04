<!--This is a basic template that shows you how to use mark down to create a topic that includes a TOC, sections with subheadings, links to other azure.microsoft.com topics, links to other sites, bold text, italic text, numbered and bulleted lists, code snippets, and images. For fancier markdown, find a published topic and copy the markdown or HTML you want. For more details about using markdown, see http://sharepoint/sites/azurecontentguidance/wiki/Pages/Content%20Guidance%20Wiki%20Home.aspx.-->

<!--Properties section: this section is required in all topics. Please fill it out!-->
<properties title="required" pageTitle="required" description="required" metaKeywords="" services="" solutions="" documentationCenter="" authors="" videoId="" scriptId="" />

<!--The next line, with one pound sign at the beginning, is the page title--> 
# Export data from you ISS account to Excel 

<p> This tutorial walks you through two different ways to retrieve device data from the Azure Intelligent Systems Service (ISS) agent. 

<!--Table of contents for topic, the words in brackets must match the heading wording exactly-->

+ [Use Power Query for Excel to retrieve your data]<!--can we use "export" here for consistency--> 
+ [Use the REST APIs to retrieve your data]
+ [Next steps]

## Prerequisites

To perform the procedures in this tutorial, you will need the following information:

+ Your account name
+ The data endpoint
+ The host for the data endpoint
+ The data secret key
+ The data authorization (base-64 encoded key)

If you did not receive this information, contact your Limited Public Preview Buddy.

The following table shows the sample values used in this lab.

<!--figure out how to insert table here-->


| Tables        | Are           | Cool  |  
| ------------- |:-------------:| -----:|  
| col 3 is      | right-aligned | $1600 |  
| col 2 is      | centered      |   $12 |  
| zebra stripes | are neat      |    $1 |  


+ <b>Account name</b>   TreyResearch
+ <b>Data endpoint</b>  https://treyresearchegress.cloudapp.net/EgressService.svc/
+ <b>Host for the data endpoint</b>   treyresearchegress.cloudapp.net
+ <b>Data secret key</b>   opqrst456789def
+ <b>Data authorization <base-64 encoded key</b>   VHJleVJlc2VhcmNoOm9wcXJzdDQ1Njc4OWRlZg==
link

## Use Power Query for Excel to retrieve your data

You can retrieve your data from the service directly through the OData feed on the Data Endpoint. The simplest way to connect to the Odata feed is through Microsoft Power Query for Excel.

Power Query for Excel is an Excel add-in that allows advanced query and filtering options. For more information on Power Query, see [Power BI - Getting Started Guide](http://go.microsoft.com/fwlink/p/?LinkId=394606) or [Microsoft Power Query for Excel Help](http://go.microsoft.com/fwlink/p/?LinkId=401291). To download the Power Query add-in, see [Microsoft Power Query for Excel](http://go.microsoft.com/fwlink/p/?LinkId=401139).

> [WACOM.NOTE] Indented note text.  The word 'note' will be added during publication. Ut eu pretium lacus. Nullam purus est, iaculis sed est vel, euismod vehicula odio. Curabitur lacinia, erat tristique iaculis rutrum, erat sem sodales nisi, eu condimentum turpis nisi a purus.

1. Aenean sit amet leo nec **Purus** placerat fermentum ac gravida odio. 

2. Aenean tellus lectus, faucibus in **Rhoncus** in, faucibus sed urna. Suspendisse volutpat mi id purus ultrices iaculis nec non neque.
 
  	![][5]

3. Nullam dictum dolor at aliquam pharetra. Vivamus ac hendrerit mauris. Sed dolor dui, condimentum et varius a, vehicula at nisl. 

  	![][6]


Suspendisse volutpat mi id purus ultrices iaculis nec non neque. Nullam dictum dolor at aliquam pharetra. Vivamus ac hendrerit mauris. Otrus informatus: [Link 1 to another azure.microsoft.com documentation topic]

## Subheading 2

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

## Subheading 3
 
1. Maecenas sed condimentum nisi. Suspendisse potenti. 

  + Fusce
  + Malesuada
  + Sem

2. Nullam in massa eu tellus tempus hendrerit.

  	![][7]

3. Quisque felis enim, fermentum ut aliquam nec, pellentesque pulvinar magna.

 


<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps

Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nullam ultricies, ipsum vitae volutpat hendrerit, purus diam pretium eros, vitae tincidunt nulla lorem sed turpis: [Link 3 to another azure.microsoft.com documentation topic]. 

<!--Anchors-->
[Subheading 1]: #subheading-1
[Subheading 2]: #subheading-2
[Subheading 3]: #subheading-3
[Next steps]: #next-steps

<!--Image references-->
[5]: ./media/0-markdown-template-for-new-articles/octocats.png
[6]: ./media/0-markdown-template-for-new-articles/pretty49.png
[7]: ./media/0-markdown-template-for-new-articles/channel-9.png


<!--Link references-->
[Link 1 to another azure.microsoft.com documentation topic]: ../virtual-machines-windows-tutorial/
[Link 2 to another azure.microsoft.com documentation topic]: ../web-sites-custom-domain-name/
[Link 3 to another azure.microsoft.com documentation topic]: ../storage-whatis-account/