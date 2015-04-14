<properties 
   pageTitle="Service Framework Unit Testing" 
   description="Article description that will be displayed on landing pages and in some search results" 
   services="service-fabric" 
   documentationCenter=".net" 
   authors="vturecek" 
   manager="timlt" 
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA" 
   ms.date="03/17/2015"
   ms.author="vturecek"/>

# Testability overview 

Testability is a suite of tools specifically designed for testing your services that are running on Microsoft Azure Service Fabric. The tools allow you to easily induce meaningful faults and run test scenarios to exercise and validate the numerous different states and transitions your services will experience throughout their lifetimes in a controlled and safe manner.

## Right tools for the right job

Testability provides a set of PowerShell and C# APIs to test your services, so you can write everything from test scripts that can be invoked via PowerShell in your development and test environments, to long-running services that continuously invoke test actions in production.

## Actions and scenarios

Testability is all about running tests against your services. With Testability we provide Actions and Scenarios to do the job. Actions are individual faults or actions that can be performed against your service. These are the building blocks for running tests. For example: 

  + Restart a node
  + Move a stateful service replica
  + Invoke quorum loss on a stateful service
  + Invoke data loss on a stateful service

Scenarios are complete tests that are composed of one or more actions, and since actions are simply PowerShell commands and C# functions, they can take any shope or form: long-running services, PowerShell commands, command line applications, and so forth. In Testability we provide two scenarios out of the box:

  + Chaos Test
  + Failover Test
  
  

Aenean sit amet leo nec purus placerat fermentum ac gravida odio. Aenean tellus lectus, faucibus in rhoncus in, faucibus sed urna.  volutpat mi id purus ultrices iaculis nec non neque. <a href="http://msdn.microsoft.com/library/azure" target="_blank">Link text for link outside of azure.microsoft.com</a>. Nullam dictum dolor at aliquam pharetra. Vivamus ac hendrerit mauris.

> [AZURE.NOTE] Indented note text.  The word 'note' will be added during publication. Ut eu pretium lacus. Nullam purus est, iaculis sed est vel, euismod vehicula odio. Curabitur lacinia, erat tristique iaculis rutrum, erat sem sodales nisi, eu condimentum turpis nisi a purus.

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


    > [AZURE.NOTE] Duis sed diam non <i>nisl molestie</i> pharetra eget a est. [Link 2 to another azure.microsoft.com documentation topic]


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

<!--Image references-->
[5]: ./media/markdown-template-for-new-articles/octocats.png
[6]: ./media/markdown-template-for-new-articles/pretty49.png
[7]: ./media/markdown-template-for-new-articles/channel-9.png
[8]: ./media/markdown-template-for-new-articles/copytemplate.png

<!--Link references--In actual articles, you only need a single period before the slash.>
[Link 1 to another azure.microsoft.com documentation topic]: ../virtual-machines-windows-tutorial/
[Link 2 to another azure.microsoft.com documentation topic]: ../web-sites-custom-domain-name/
[Link 3 to another azure.microsoft.com documentation topic]: ../storage-whatis-account/
