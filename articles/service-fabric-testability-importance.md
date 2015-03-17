<properties 
   pageTitle="Importance of Testability." 
   description="This article talks about why testability is important for services written on windows fabric." 
   services="Service-Fabric" 
   documentationCenter="Windows Azure" 
   authors="rishirsinha" 
   manager="timlt" 
   editor=""/>

<tags
   ms.service="Service-Fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA" 
   ms.date="03/17/2014"
   ms.author="rsinha"/>

# Importance of Testability.

Service Fabric makes the job of writing and managing distributed scalable applications significantly easier. However, testing a distributed application can be as challenging as writing one. There are two main issues that need to be solved while testing 

1. Simulating/Generating failures that might occur in the real world scenarios: One of the important aspect of Service Fabric is that it allows distributed applications to recover from various failures. However, in order to test that the application is able to recover from these failures we need a mechanism to simulate/generate these real world failures in a controlled test environment.
2. The ability to generate the required states and state transitions: Given the complexity of a distributed application, the enumeration of all states and state transitions is not trivial. This is specially applicable when you are programming against the lower level APIs.

While there are many mechanisms to solve the above mentioned problems, a system that does the same with required guarantees all the way from one box developer environment to test in production clusters is missing.

## Simulating/Generating real word failure scenarios.
In order to test the robustness of a distributed system against failures, we need a mechanism to generate failures. While in theory generating a failure like a node down seems easy, it starts hitting the same set of consistency problems that windows fabric is trying to solve. As an example if we want to shutdown a node, the required workflow is the the following:

1. From the client issue a shutdown node request.
2. Route the request to the right node.
	1. If the node is not found it should fail.
	2. If the node is found it should return only if the node is shutdown.


In order to have the above guarantees we need a system that can do consistent routing. This consistent routing is a hard distributed problem to solve.

## Generating required states and state transitions.


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
