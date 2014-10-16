
<properties title="API basics for Azure Batch" pageTitle="API basics for Azure Batch" description="Concepts to introduce developers to the Azure Batch APIs and Batch service" metaKeywords="" services="batch" solutions="" documentationCenter=".NET" authors="yidingz, karran.batta" videoId="" scriptId="" manager="asutton" />

<tags ms.service="batch" ms.devlang="multiple" ms.topic="article" ms.tgt_pltfrm="na" ms.workload="big-compute" ms.date="10/27/2014" ms.author="yidingz, karran.batta" />


<!--The next line, with one pound sign at the beginning, is the page title--> 
# API basics for Azure Batch 

<p> Intro paragraph: Lorem ipsum dolor amet, consectetur adipiscing elit. Phasellus interdum nulla risus, lacinia porta nisl imperdiet sed. Mauris dolor mauris, tempus sed lacinia nec, euismod non felis. Nunc semper porta ultrices. Maecenas neque nulla, condimentum vitae ipsum sit amet, dignissim aliquet nisi.

<!--Table of contents for topic, the words in brackets must match the heading wording exactly-->

+ [Subheading 1] 
+ [Subheading 2]
+ [Subheading 3]
+ [Next steps]



## Subheading 1

Aenean sit amet leo nec purus placerat fermentum ac gravida odio. Aenean tellus lectus, faucibus in rhoncus in, faucibus sed urna. Suspendisse volutpat mi id purus ultrices iaculis nec non neque. <a href="http://msdn.microsoft.com/library/azure" target="_blank">Link text for link outside of azure.microsoft.com</a>. Nullam dictum dolor at aliquam pharetra. Vivamus ac hendrerit mauris.

> [WACOM.NOTE] Indented note text.  The word 'note' will be added during publication. Ut eu pretium lacus. Nullam purus est, iaculis sed est vel, euismod vehicula odio. Curabitur lacinia, erat tristique iaculis rutrum, erat sem sodales nisi, eu condimentum turpis nisi a purus.

1. Aenean sit amet leo nec **Purus** placerat fermentum ac gravida odio. 

2. Aenean tellus lectus, faucibus in **Rhoncus** in, faucibus sed urna. Suspendisse volutpat mi id purus ultrices iaculis nec non neque.
 

3. Nullam dictum dolor at aliquam pharetra. Vivamus ac hendrerit mauris. Sed dolor dui, condimentum et varius a, vehicula at nisl. 



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

<!--Link references-->
[Link 1 to another azure.microsoft.com documentation topic]: ../virtual-machines-windows-tutorial/
[Link 2 to another azure.microsoft.com documentation topic]: ../web-sites-custom-domain-name/
[Link 3 to another azure.microsoft.com documentation topic]: ../storage-whatis-account/
