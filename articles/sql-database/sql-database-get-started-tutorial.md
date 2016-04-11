<properties
	pageTitle="Getting Started with SQL Database using the Microsoft Azure portal"
description="Learn how to set up a SQL Database logical server, server firewall rule, SQL database, sample data, connect with client tools, configure users, and database firewall rule."
	keywords="sql database tutorial,create a sql database"
	services="sql-database"
	documentationCenter=""
	authors="carlrabeler"
	manager="jhubbard"
	editor="cgronlun"/>


<tags
	ms.service="sql-database"
	ms.workload="data-management"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="hero-article"
	ms.date="04/11/2016"
	ms.author="carlrab"/>

# Getting start with SQL Dataabase using the Microsoft Azure portal

[AZURE.INCLUDE [Login](../../includes/sql-database-include-getting-started-portal-login.md)]

To copy the markdown from this template, copy the article in your local repo, or click the Raw button in the GitHub UI and copy the markdown.

  ![Alt text; do not leave blank. Describe image.][8]

Intro paragraph: Lorem dolor amet, adipiscing elit. Phasellus interdum nulla risus, lacinia porta nisl imperdiet sed. Mauris dolor mauris, tempus sed lacinia nec, euismod non felis. Nunc semper porta ultrices. Maecenas neque nulla, condimentum vitae ipsum sit amet, dignissim aliquet nisi.

## Heading 2 (H2)

Aenean sit amet leo nec purus placerat fermentum ac gravida odio. Aenean tellus lectus, faucibus in rhoncus in, faucibus sed urna.  volutpat mi id purus ultrices iaculis nec non neque. [Link text for link outside of azure.microsoft.com](http://weblogs.asp.net/scottgu). Nullam dictum dolor at aliquam pharetra. Vivamus ac hendrerit mauris [example link text for link to an article in a service folder](../articles/expressroute/expressroute-bandwidth-upgrade.md).

I get 10 times more traffic from [Google] [gog] than from [Yahoo] [yah] or [MSN] [msn].

> [AZURE.NOTE] Indented note text.  The word 'note' will be added during publication. Ut eu pretium lacus. Nullam purus est, iaculis sed est vel, euismod vehicula odio. Curabitur lacinia, erat tristique iaculis rutrum, erat sem sodales nisi, eu condimentum turpis nisi a purus.

1. Aenean sit amet leo nec **Purus** placerat fermentum ac gravida odio.

2. Aenean tellus lectus, faucius in **Rhoncus** in, faucibus sed urna. Suspendisse volutpat mi id purus ultrices iaculis nec non neque.

  	![Alt text; do not leave blank. Collector car in racing red.][5]

3. Nullam dictum dolor at aliquam pharetra. Vivamus ac hendrerit mauris. Sed dolor dui, condimentum et varius a, vehicula at nisl.

  	![Alt text; do not leave blank][6]


Suspendisse volutpat mi id purus ultrices iaculis nec non neque. Nullam dictum dolor at aliquam pharetra. Vivamus ac hendrerit mauris. Otrus informatus: [Link 1 to another azure.microsoft.com documentation topic](virtual-machines-windows-hero-tutorial.md)

## Heading (H2)

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


    > [AZURE.NOTE] Duis sed diam non <i>nisl molestie</i> pharetra eget a est. [Link 2 to another azure.microsoft.com documentation topic](web-sites-custom-domain-name.md)


Quisque commodo eros vel lectus euismod auctor eget sit amet leo. Proin faucibus suscipit tellus dignissim ultrices.

## Heading 2 (H2)

1. Maecenas sed condimentum nisi. Suspendisse potenti.

  + Fusce
  + Malesuada
  + Sem

2. Nullam in massa eu tellus tempus hendrerit.

  	![Alt text; do not leave blank. Example of a Channel 9 video.][7]

3. Quisque felis enim, fermentum ut aliquam nec, pellentesque pulvinar magna.




<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps

Vestibul ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nullam ultricies, ipsum vitae volutpat hendrerit, purus diam pretium eros, vitae tincidunt nulla lorem sed turpis: [Link 3 to another azure.microsoft.com documentation topic](storage-whatis-account.md).

<!--Image references-->
[5]: ./media/markdown-template-for-new-articles/octocats.png
[6]: ./media/markdown-template-for-new-articles/pretty49.png
[7]: ./media/markdown-template-for-new-articles/channel-9.png
[8]: ./media/markdown-template-for-new-articles/copytemplate.png

<!--Reference style links - using these makes the source content way more readable than using inline links-->
[gog]: http://google.com/        
[yah]: http://search.yahoo.com/  
[msn]: http://search.msn.com/    
