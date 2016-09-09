<properties
	pageTitle="Tutorial:  DevOps with the Azure Portal | Microsoft Azure"
	description="Learn the various DevOps workflows in the Azure Portal."
	services="azure-portal"
	documentationCenter=""
	authors="mlearned"
	manager="douge"
	editor="mlearned"/>

<tags
	ms.service="multiple"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="hero-article"
	ms.date="06/05/2016"
	ms.author="mlearned"/>

# Tutorial: DevOps with the Azure Portal

The Azure platform is full of flexible DevOps workflows. In this tutorial, you learn how to leverage the capabilities of the Azure Portal to develop, test, deploy, troubleshoot, monitor, and manage running applications. This tutorial focuses on the following:

1.  Creating a web app and enabling continuous deployment

2.  Develop and test an app

3.  Monitoring and Troubleshooting an app

4.  General application management tasks

## Creating a web app and enabling continuous deployment

Create a Web app with [Azure App Service](https://azure.microsoft.com/services/app-service/), which you’ll use in the rest of this tutorial. You’ll initially enable continuous deployment from your source code repository into our running Azure environment.

1.  Sign into the Azure Portal

2.  Choose **App Services** &gt; **Add icon** and enter a name, choose your subscription, and create a new resource group to serve as the container for the service.

    Resource groups allow you to manage various aspects of the solution such as billing, deployments and monitoring all as a single group via [Azure Resource Manager](https://azure.microsoft.com/documentation/articles/resource-group-overview/).

	![image1][image1]


3.  After a few moments, your app service is created. Take a few minutes to explore the various menu options for the service in the portal.

	![image2][image2]    

4.  Click the URL. Notice the variety of available choices for tools and repositories. You can also use the languages and frameworks of your choice including .NET, Java, and Ruby.

	![image3][image3]    

3.  The Azure portal makes continuous deployment an easy process that involves only a few simple steps. In the Azure portal, choose settings from the icon for the app service you just created.

    ![image4][image4]

    From the blade that opens on the right, scroll to the publishing section.

    ![image5][image5]

4.  Next, configure some settings to enable continuous deployment for the app. Click Deployment Source and then click Choose Source. Notice the variety of options you have for repository sources.

	![image6][image6]

1.  For this example choose GitHub. Optionally choose the repository of your choice and setup the authorization credentials.

    ![image7][image7]

2.  After authorization to your repository, you can then choose a project and branch you wish to deploy. There are several fictitious sample examples listed below.

    ![image8][image8]

3.  Once you choose your project and branch, click ok. You should start to see notifications of a deployment.

    ![image9][image9]

4.  Navigate back to Github to see the webhook that was created to integrate the source control repo with Azure. The Azure Portal enables integration with Github with only a few simple steps.

    ![image10][image10]

5.  To demonstrate continuous deployment, you quickly add some content to the repository. For a simple example, add a sample text file to a Github repo. You are free to use .NET, Ruby, Python, or some other type of application with App Service. Feel free to add a text file, ASP.NET MVC, Java, or Ruby application to the repo of your choice.

    ![image11][image11]

6.  After committing changes to your repository, you see a new deployment initiate in the portal notifications area. Click Sync if you do not quickly see changes after committing to your repository.

    ![image12][image12]

7.  At this point, if you try and load the page for the app service, you may receive a 403 error. In this example, it is because there is no typical default document setup for the page such as a file like index.htm or default.html. You can quickly remedy this with the tooling in the Azure Portal.  In the Azure Portal choose Settings &gt; Application Settings.

	 ![image13][image13]

8.  A blade opens for application settings. Enter the name of the page “SamplePage.html” and click Save. Take a few minutes to explore the other settings.

	![image14][image14]

9.  Optionally refresh your browser URL to ensure you see the expected changes. In this case, there is some simple text now populating the page. Each additional change to the repository would result in a new automatic deployment.

    ![image15][image15]

    Enabling continuous deployment with the Azure Portal is an easy experience. You can also build more complex release pipelines and use many other techniques with existing source control and continuous integration systems to deploy to Azure, such as leveraging automated build and release management systems.

## Develop and test an app

Next, make some changes to the code base and rapidly deploy those changes. You will also setup up some performance testing for the Web app.

1.  In the Azure Portal choose App Services from the navigation pane, and locate your App Service.

    ![image16][image16]

2.  Click Tools

    ![image17][image17]

3.  Notice the develop category under Tools. There are several useful tools here that allow us to work with apps without leaving the Azure Portal. Click on Console.

    ![image18][image18]

4.  In the console window, you can issue live commands for your app. Type the dir command and hit enter. Note that commands requiring elevated privileges do not work.

    ![image19][image19]

5.  Move back to the Develop category and choose Visual Studio Online. Note: Visual Studio Online is now named Visual Studio Team Services.

    ![image20][image20]

6.  Toggle on the in-browser editing experience for your App.

    ![image21][image21]

7.  A web extension installs for your app. Extensions quickly and easily add functionality to apps in Azure. Notice some of the other extension types available in the screenshot below.

    ![image22][image22]

8.  Once the Visual Studio Online extension installs, click Go.

    ![image23][image23]

9.  A browser tab opens where you see a development IDE directly in the browser. Notice the experience below is in Chrome.

    ![image24][image24]

10. You can perform several activities such as edit files, add files and folders, and download content from the live site. Make a quick edit to the SamplePage.html file.

    ![image25][image25]

11. In a few moments, the changes are automatically saved. If you navigate back to the page, you can see the changes. Keep in mind live edits like these are most likely not suitable for production environments. However, the tools make it very easy to make quick changes for dev and test environments.

    ![image26][image26]

    ![image27][image27]

12. Move back to the tools blade and under the Develop category, click on Performance Test.

    ![image28][image28]

13. You need to set a team services account. See here for more details: [Create a Team Services Account](https://www.visualstudio.com/docs/setup-admin/team-services/sign-up-for-visual-studio-team-services)

14. Click on New to create a performance test.

    ![image29][image29]

    Configure the various values and click Run Test at the bottom of the dialogue to initiate a performance test.

    ![image30][image30]

	![image31][image31]

1.  Once the test starts running, you can monitor the state.

    ![image32][image32]

    Once the test finishes, clicking on the result shows more details.

    ![image33][image33]

2.  In this example, you created a small test run, so there is limited data to analyze, but you can see various metrics as well as rerun your test from this view. The Azure Portal makes creating, executing, and analyzing web performance tests an easy process. The screenshots below display the performance data.

    ![image34][image34]

    ![image35][image35]

    ![image36][image36]

## Monitoring and troubleshooting an app

Azure provides many capabilities for monitoring and troubleshooting running applications.

1.  In the Azure Portal for our Web app choose Tools.

    ![image37][image37]

2.  Under the Troubleshoot category, notice the various choices for using tools to troubleshoot potential issues with a running app. You can do things like monitor Live HTTP traffic, enable self-healing, view logs, and more.

    ![image38][image38]

3.  Choose Site Metrics to quickly get a view of some HTTP codes.

    ![image39][image39]

4.  Choose Diagnostics as a Service. Choose your application type, then choose Run.

    ![image40][image40]

    A collection begins.

    ![image41][image41]

5.  You may choose the appropriate log to diagnose potential issues. You need to enable logging to see all of the available data options such as HTTP Logs.

    ![image42][image42]

    By clicking on the Memory Dump file you can download and analyze a DebugDiag analysis report to help find potential issues.

    ![image43][image43]

6.  To view more data, you need to enable additional logging. In the Azure Portal, navigate to the Web app and choose Settings.

    ![image44][image44]

7.  Scroll down to the features category, and choose Diagnostic logs.

  	 ![image45][image45]

8.  Notice the various options for logging. Toggle on Web server logging and click save.

    ![image46][image46]

9.  Move back to the tools area for the app and choose Diagnostics as a service and click Run to rerun the data collection.

    ![image47][image47]

10. With the HTTP logging setting enabled, you now see data collected for HTTP Logs.

    ![image48][image48]

11. By clicking the HTML file log, you produce a rich browser-based report for further investigation.

    ![image49][image49]

12. Move back to the tools section in the Azure Portal for the app. Scroll to the Tools section and choose Process Explorer.

    ![image50][image50]

13. By choosing Process Explorer, you can view details about running processes. Notice below you can drill into processes and even kill processes all from the Azure Portal.

    ![image51][image51]

    ![image52][image52]

14. Move back to the Settings blade on the left. Click New support request.

    ![image53][image53]

15. From the blade on the right, you can fill out details about the issues, enter contact information, and even upload diagnostic data. The Azure Portal enables working with Microsoft support a seamless experience.

    ![image54][image54]

    ![image55][image55]

    The Azure Portal helps provide powerful and familiar tooling experiences to help monitor and troubleshoot our running applications. You are also able to take action quickly by performing tasks such as recycling processes, enabling and disabling various data collections, and even integrating with Microsoft professional support.

## General Application Management

When managing applications, you often need to perform a broad variety of activities such as configuring backup strategies, implementing and managing identity providers, and configuring Role-based access control. As with the other DevOps experiences, the Azure platform integrates these tasks directly into the portal.

1.  To ensure you are keeping the Web App safe from data loss you need to configure backups. Navigate to the Settings area for your Web app.

    ![image56][image56]

2.  In the blade on the right, scroll down to the Features category.

	 ![image57][image57]

1.  Choose Backups; a blade opens on the right.

    ![image58][image58]

2.  Click Configure, choose a storage account from the blade on the right.

    ![image59][image59]

3.  Now create and choose a storage container to hold your backups. Click create at the bottom of the blade. Then select the container.

    ![image60][image60]

4.  Once you have chosen the container, you can configure schedules, as well as setup backups for your databases. For this scenario, click the save icon.

     ![image61][image61]

5.  After saving, scroll back to the blade on the left for Backups. Click Backup Now to back the application.

     ![image62][image62]

6.  In a few moments, you see a backup created. Notice the Restore Now option on the screen-shot below.

     ![image63][image63]

7.  Click on Restore Now and examine the options to the blade on the right. You can choose an appropriate backup and easily restore to an earlier state as necessary. The Azure portal has helped us easily enable a simple disaster recovery strategy for the app.

     ![image64][image64]

8.  Move back to the Settings blade on the left, and under Features and choose Authentication/Authorization.

     ![image65][image65]

9.  In the blade on the right choose App Service Authentication. Notice the variety of options you can configure with popular providers.

     ![image66][image66]

10. Choose the provider of your choice and notice the options for the scope. You can provide an App ID and App Secret and quickly enable Facebook authentication for the app. The Azure Portal enables authentication as a turnkey solution for apps.

     ![image67][image67]

11. Move back to the Settings blade and choose Users under the Resource Management category.

     ![image68][image68]

12. In the blade on the right examine the various options for adding roles and users. The Azure Portal lets you easily control RBAC (Role-based access control) for the application.

     ![image69][image69]


## Summary

This tutorial demonstrated some of the power with the Azure platform by quickly enabling continuous deployment for a web app, performing various development and testing activities, monitoring and troubleshooting a live app, and finally managing key strategies such as disaster recovery, identity, and role-based access control. The Azure platform enables an integrated experience for these DevOps workflows, and you can work efficiently by staying in context for the task at hand.


## Next steps 

* Azure Resource Manager is important for enabling DevOps on the Azure platform.  To learn more visit [Azure Resource Manager overview](../resource-group-overview.md).

* To learn more about Azure App Service deployment visit [Deploy your app to Azure App Service](../app-service-web/web-sites-deploy.md)


[image1]: ./media/tutorial-azureportal-devops/image1.png
[image2]: ./media/tutorial-azureportal-devops/image2.png
[image3]: ./media/tutorial-azureportal-devops/image3.png
[image4]: ./media/tutorial-azureportal-devops/image4.png
[image5]: ./media/tutorial-azureportal-devops/image5.png
[image6]: ./media/tutorial-azureportal-devops/image6.png
[image7]: ./media/tutorial-azureportal-devops/image7.png
[image8]: ./media/tutorial-azureportal-devops/image8.png
[image9]: ./media/tutorial-azureportal-devops/image9.png
[image10]: ./media/tutorial-azureportal-devops/image10.png
[image11]: ./media/tutorial-azureportal-devops/image11.png
[image12]: ./media/tutorial-azureportal-devops/image12.png
[image13]: ./media/tutorial-azureportal-devops/image13.png
[image14]: ./media/tutorial-azureportal-devops/image14.png
[image15]: ./media/tutorial-azureportal-devops/image15.png
[image16]: ./media/tutorial-azureportal-devops/image16.png
[image17]: ./media/tutorial-azureportal-devops/image17.png
[image18]: ./media/tutorial-azureportal-devops/image18.png
[image19]: ./media/tutorial-azureportal-devops/image19.png
[image20]: ./media/tutorial-azureportal-devops/image20.png
[image21]: ./media/tutorial-azureportal-devops/image21.png
[image22]: ./media/tutorial-azureportal-devops/image22.png
[image23]: ./media/tutorial-azureportal-devops/image23.png
[image24]: ./media/tutorial-azureportal-devops/image24.png
[image25]: ./media/tutorial-azureportal-devops/image25.png
[image26]: ./media/tutorial-azureportal-devops/image26.png
[image27]: ./media/tutorial-azureportal-devops/image27.png
[image28]: ./media/tutorial-azureportal-devops/image28.png
[image29]: ./media/tutorial-azureportal-devops/image29.png
[image30]: ./media/tutorial-azureportal-devops/image30.png
[image31]: ./media/tutorial-azureportal-devops/image31.png
[image32]: ./media/tutorial-azureportal-devops/image32.png
[image33]: ./media/tutorial-azureportal-devops/image33.png
[image34]: ./media/tutorial-azureportal-devops/image34.png
[image35]: ./media/tutorial-azureportal-devops/image35.png
[image36]: ./media/tutorial-azureportal-devops/image36.png
[image37]: ./media/tutorial-azureportal-devops/image37.png
[image38]: ./media/tutorial-azureportal-devops/image38.png
[image39]: ./media/tutorial-azureportal-devops/image39.png
[image40]: ./media/tutorial-azureportal-devops/image40.png
[image41]: ./media/tutorial-azureportal-devops/image41.png
[image42]: ./media/tutorial-azureportal-devops/image42.png
[image43]: ./media/tutorial-azureportal-devops/image43.png
[image44]: ./media/tutorial-azureportal-devops/image44.png
[image45]: ./media/tutorial-azureportal-devops/image45.png
[image46]: ./media/tutorial-azureportal-devops/image46.png
[image47]: ./media/tutorial-azureportal-devops/image47.png
[image48]: ./media/tutorial-azureportal-devops/image48.png
[image49]: ./media/tutorial-azureportal-devops/image49.png
[image50]: ./media/tutorial-azureportal-devops/image50.png
[image51]: ./media/tutorial-azureportal-devops/image51.png
[image52]: ./media/tutorial-azureportal-devops/image52.png
[image53]: ./media/tutorial-azureportal-devops/image53.png
[image54]: ./media/tutorial-azureportal-devops/image54.png
[image55]: ./media/tutorial-azureportal-devops/image55.png
[image56]: ./media/tutorial-azureportal-devops/image56.png
[image57]: ./media/tutorial-azureportal-devops/image57.png
[image58]: ./media/tutorial-azureportal-devops/image58.png
[image59]: ./media/tutorial-azureportal-devops/image59.png
[image60]: ./media/tutorial-azureportal-devops/image60.png
[image61]: ./media/tutorial-azureportal-devops/image61.png
[image62]: ./media/tutorial-azureportal-devops/image62.png
[image63]: ./media/tutorial-azureportal-devops/image63.png
[image64]: ./media/tutorial-azureportal-devops/image64.png
[image65]: ./media/tutorial-azureportal-devops/image65.png
[image66]: ./media/tutorial-azureportal-devops/image66.png
[image67]: ./media/tutorial-azureportal-devops/image67.png
[image68]: ./media/tutorial-azureportal-devops/image68.png
[image69]: ./media/tutorial-azureportal-devops/image69.png
