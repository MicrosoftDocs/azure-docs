<properties
	pageTitle="Get Started with Azure Mobile Services for HTML/JavaScript apps | Microsoft Azure"
	description="Follow this tutorial to get started using Azure Mobile Services for HTML development."
	services="mobile-services"
	documentationCenter=""
	authors="ggailey777"
	manager="dwrede"
	editor=""/>

<tags
	ms.service="mobile-services"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-html5"
	ms.devlang="javascript"
	ms.topic="get-started-article" 
	ms.date="07/21/2016"
	ms.author="glenga"/>


# <a name="getting-started"> </a>Get started with Mobile Services

[AZURE.INCLUDE [mobile-services-selector-get-started](../../includes/mobile-services-selector-get-started.md)]
&nbsp;

[AZURE.INCLUDE [mobile-services-hero-slug](../../includes/mobile-services-hero-slug.md)]

##Overview 

This tutorial shows you how to add a cloud-based backend service to an HTML app using Azure Mobile Services. In this tutorial, you will create both a new mobile service and a simple *To do list* app that stores app data in the new mobile service. You can view the following video version of this tutorial. 

> [AZURE.VIDEO mobile-get-started-html]
 
A screenshot from the completed app is below:

![][0]

Completing this tutorial is a prerequisite for all other Mobile Services tutorials for HTML apps. For a PhoneGap/Cordova app, see the the [PhoneGap/Cordova version](mobile-services-javascript-backend-phonegap-get-started.md) of this tutorial.

##Prerequisites

The following are required to complete this tutorial:

+ You must have one of the following web servers running on your local computer:

	+  **On Windows**: IIS Express. IIS Express is installed by the [Microsoft Web Platform Installer].
	+  **On MacOS X**: Python, which should already be installed.
	+  **On Linux**: Python. You must install the [latest version of Python].

	You can use any web server to host the app, but these are the web servers that are supported by the downloaded scripts.  

+ A web browser that supports HTML5.
+ An Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial](https://azure.microsoft.com/pricing/free-trial/?WT.mc_id=A0E0E5C02&amp;returnurl=http%3A%2F%2Fazure.microsoft.com%2Fen-us%2Fdevelop%2Fmobile%2Ftutorials%2Fget-started-html%2F"%20target="_blank). 


## <a name="create-new-service"> </a>Create a new mobile service

[AZURE.INCLUDE [mobile-services-create-new-service](../../includes/mobile-services-create-new-service.md)]

## Create a new HTML app

Once you have created your mobile service, you can follow an easy quickstart in the Azure classic portal to either create a new app or modify an existing app to connect to your mobile service.

In this section you will create a new HTML app that is connected to your mobile service.

1.  In the [Azure classic portal], click **Mobile Services**, and then click the mobile service that you just created.


2. In the quickstart tab, click **Windows** under **Choose platform** and expand **Create a new HTML app**.

   	![][6]

   	This displays the three easy steps to create and host an HTML app connected to your mobile service.

  	![][7]

3. Click **Create TodoItems table** to create a table to store app data.

4. Under **Download and run your app**, click **Download**.

  	This downloads the website files for the sample _To do list_ application that is connected to your mobile service. Save the compressed file to your local computer, and make a note of where you save it.

5. In the **Configure** tab, verify that `localhost` is already listed in the **Allow requests from host names** list under **Cross-Origin Resource Sharing (CORS)**. If it's not, type `localhost` in the **Host name** field and then click **Save**.

  	![][9]

	> [AZURE.IMPORTANT] If you deploy the quickstart app to a web server other than localhost, you must add the host name of the web server to the **Allow requests from host names** list. For more information, see [Cross-origin resource sharing](http://msdn.microsoft.com/library/windowsazure/dn155871.aspx).

## Host and run your HTML app

The final stage of this tutorial is to host and run your new app on your local computer.

1. Browse to the location where you saved the compressed project files, expand the files on your computer, and launch one of the following command files from the **server** subfolder.

	+ **launch-windows** (Windows computers)
	+ **launch-mac.command** (Mac OS X computers)
	+ **launch-linux.sh** (Linux computers)

	> [AZURE.NOTE] On a Windows computer, type `R` when PowerShell asks you to confirm that you want to run the script. Your web browser might warn you to not run the script because it was downloaded from the internet. When this happens, you must request that the browser proceed to load the script.

	This starts a web server on your local computer to host the new app.

2. Open the URL <a href="http://localhost:8000/" target="_blank">http://localhost:8000/</a> in a web browser to start the app.

3. In the app, type meaningful text, such as _Complete the tutorial_, in **Enter new task**, and then click **Add**.

   	![][10]

   	This sends a POST request to the new mobile service hosted in Azure. Data from the request is inserted into the TodoItem table. Items stored in the table are returned by the mobile service, and the data is displayed in the second column in the app.

	> [AZURE.NOTE] You can review the code that accesses your mobile service to query and insert data, which is found in the page.js file.

4. Back in the [Azure classic portal], click the **Data** tab and then click the **TodoItems** table.

   	![][11]

   	This lets you browse the data inserted by the app into the table.

   	![][12]

## <a name="next-steps"> </a>Next Steps
Now that you have completed the quickstart, learn how to perform additional important tasks in Mobile Services:

* **[Add authentication to your app]**  
  Learn how to authenticate users of your app with an identity provider.

* **[Mobile Services HTML/JavaScript How-to Conceptual Reference]**  
  Learn more about how to use Mobile Services with HTML/JavaScript


[AZURE.INCLUDE [app-service-disqus-feedback-slug](../../includes/app-service-disqus-feedback-slug.md)]

<!-- Anchors. -->
[Getting started with Mobile Services]:#getting-started
[Create a new mobile service]:#create-new-service
[Define the mobile service instance]:#define-mobile-service-instance
[Next Steps]:#next-steps

<!-- Images. -->
[0]: ./media/mobile-services-html-get-started/mobile-quickstart-completed-html.png

[6]: ./media/mobile-services-html-get-started/mobile-portal-quickstart-html.png
[7]: ./media/mobile-services-html-get-started/mobile-quickstart-steps-html.png

[9]: ./media/mobile-services-html-get-started/mobile-services-set-cors-localhost.png
[10]: ./media/mobile-services-html-get-started/mobile-quickstart-startup-html.png
[11]: ./media/mobile-services-html-get-started/mobile-data-tab.png
[12]: ./media/mobile-services-html-get-started/mobile-data-browse.png


<!-- URLs. -->
[Add authentication to your app]: mobile-services-html-get-started-users.md

[Azure classic portal]: https://manage.windowsazure.com/
[Microsoft Web Platform Installer]:  http://go.microsoft.com/fwlink/p/?LinkId=286333
[latest version of Python]: http://go.microsoft.com/fwlink/p/?LinkId=286342
[Mobile Services HTML/JavaScript How-to Conceptual Reference]: mobile-services-html-how-to-use-client-library.md
[Cross-origin resource sharing]: http://msdn.microsoft.com/library/azure/dn155871.aspx
 
