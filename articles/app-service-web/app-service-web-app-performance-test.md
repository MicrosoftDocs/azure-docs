<properties
   pageTitle="Test your Azure web app's performance | Microsoft Azure"
   description="Run Azure web app performance tests to check how your app handles user load. Measure response time and find failures that might indicate problems."
   services="app-service\web"
   documentationCenter=""
   authors="ecfan"
   manager="douge"
   editor="jimbe"/>

<tags
   ms.service="app-service-web"
   ms.workload="web"
   ms.tgt_pltfrm="na"
   ms.devlang="na"
   ms.topic="article"
   ms.date="09/11/2015"
   ms.author="estfan; manasma"/>

# Performance test your Azure web app under load

Check your web app's performance before you launch it or deploy updates to production. 
That way, you can better assess whether your app is ready for release. Feel more
confident that your app can handle the traffic during peak use or at your next marketing push.

During public preview, you can performance test your app for free in the Azure Preview Portal.
These tests simulate user load on your app over a specific time period and measure your app's response. For example, your test results show how fast your app responds to a specific number 
of users. They also show how many requests failed, which might indicate problems with your app.      

![Find performance problems in your web app][TestOverview]

## Before you start

*	You'll need an [Azure subscription][AzureSubscription], 
if you don't have one already. Learn how you can 
[open an Azure account for free][AzureFreeTrial].

*	You'll need a [Visual Studio Online (VSO)][WhatIsVSO] 
account to keep your performance test history. 
Create your new account when you set up your performance test, 
or use an existing account if you're the account owner. 
[What else can I do with a Visual Studio Online account?](#VSOAccount)

*	Deploy your app for testing in a non-production environment. 
Have your app use an App Service plan other than the plan used in production. 
That way, you don't affect any existing customers or slow down your app in production. 

## Set up and run your performance test

0.	Sign in to the [Azure Preview Portal][AzurePortal]. 
To use a Visual Studio Online account that you own, 
sign in as the account owner.

0.	Go to your web app.

	![Go to Browse All, Web Apps, your web app][WebApp]

0.	Go to **Performance Test**.

	![Go to Tools, Performance Test][ExpandedTools]
 
0.	Now you'll link a [Visual Studio Online (VSO)][WhatIsVSO] 
account to keep your performance test history.

	If you have a VSO account to use, select that account. If you don't, create a new account.

	![Select existing VSO account, or create a new account][ExistingNewVSOAccount]

0.	Create your performance test. Set the details and run the test. 
You can watch the results in real time while the test runs.

	For example, suppose we have an app that gave out coupons at last year's holiday sale. 
	This event lasted 15 minutes with a peak load of 100 concurrent customers. 
	We want to double the number of customers this year. We also want to improve 
	customer satisfaction by reducing the page load time from 5 seconds to 2 seconds. 
	So, we'll test our updated app's performance with 250 users for 15 minutes.

	We'll simulate load on our app by generating virtual users (customers) 
	who visit our web site at the same time. This will show us how many 
	requests are failing or responding slowly.

	![Create, set up, and run your performance test][NewTest]

	 *	Your web app's default URL is added automatically. 
	 You can change the URL to test other pages (HTTP GET requests only).

	 *	To simulate local conditions and reduce latency, 
	 select a location closest to your users for generating load.

	Here's the test in progress. During the first minute, 
	our page loads slower than we want.

	![Performance test in progress with real-time data][TestRunning]

	After the test is done, we learn that the page loads much faster 
	after the first minute. This helps identify where we might want to 
	start troubleshooting the problem.

	![Completed performance test shows results, including failed requests][TestDone]
	
We'd love your feedback. For questions or problems, 
please contact us at <vsoloadtest@microsoft.com>

##	Q & A

####Q: Is there a limit on how long I can run a test? 

A: Yes, you can run your test up to an hour in the Azure Preview Portal.

####Q: How much time do I get to run performance tests? 

A: After public preview, you get 20,000 virtual user minutes (VUMs) 
free each month with your Visual Studio Online account. 
A VUM is the number of virtual users multipled by the number 
of minutes in your test. If your needs exceed the free limit, 
you can purchase more time and pay only for what you use.

####Q: Where can I check how many VUMs I've used so far?

A: You can check this amount in the Azure Preview portal.

![Go to your VSO account][VSOAccount]

![Check VUMs used][CheckTestTime]

<a name="VSOAccount"></a>
####Q: What else can I do with a Visual Studio Online account?

A: To find your new account, go to ```https://{accountname}.visualstudio.com```. 
Share your code, build, test, track work, and ship software – all in the cloud 
using any tool or language. Learn more about how [Visual Studio Online][WhatIsVSO] 
features and services help your team collaborate more easily and deploy continuously.

<!--Image references-->
[WebApp]: ./media/app-service-web-app-performance-test/azure-np-web-apps.png
[TestOverview]: ./media/app-service-web-app-performance-test/azure-np-perf-test-overview.png
[ExpandedTools]: ./media/app-service-web-app-performance-test/azure-np-web-app-details-tools-expanded.png
[ExistingNewVSOAccount]: ./media/app-service-web-app-performance-test/azure-np-no-vso-account.png
[NewTest]: ./media/app-service-web-app-performance-test/azure-np-new-performance-test.png
[TestRunning]: ./media/app-service-web-app-performance-test/azure-np-running-perf-test.png
[TestDone]: ./media/app-service-web-app-performance-test/azure-np-perf-test-done.png
[VSOAccount]: ./media/app-service-web-app-performance-test/azure-np-vso-accounts.png
[CheckTestTime]: ./media/app-service-web-app-performance-test/azure-np-vso-accounts-vum-summary.png

<!--Reference links -->
[AzurePortal]: https://portal.azure.com
[AzureSubscription]: https://account.windowsazure.com/subscriptions
[AzureFreeTrial]: https://azure.microsoft.com/pricing/free-trial/?WT.mc_id=A261C142F
[WhatIsVSO]: https://www.visualstudio.com/products/what-is-visual-studio-online-vs
