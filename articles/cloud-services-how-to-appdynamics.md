<properties linkid="manage-services-how-to-use-appdynamics" urlDisplayName="Monitor with AppDynamics" pageTitle="How to use AppDynamics for Windows Azure" metaKeywords="" description="Learn how to use AppDynamics for Windows Azure." metaCanonical="" services="cloud-services" documentationCenter="" title="How To Use AppDynamics for Windows Azure" authors=""  solutions="" writer="ryanwi" manager="" editor=""  />


## How To Use AppDynamics for Windows Azure ##

Quickly start monitoring your Azure cloud solutions with the AppDynamics for Windows Azure NuGet package. Sign up for the AppDyanmics add-on in the Windows Azure portal, then simply enable the AppDynamics agent in your Visual Studio solution to begin monitoring.

### Part 1. Get the AppDynamics add-on from the Windows Azure store. ###
[Log in to the Windows Azure portal](http://manage.windowsazure.com/) to get the AppDynamics add-on.
***
#### Get the add-on ####
![Azure Portal Sign in](./media/cloud-services-how-to-appdynamics/1-azure-portal-login.png)
Log in to the Windows Azure portal at [https://manage.windowsazure.com](https://manage.windowsazure.com).
***
#### Click +NEW ####
![Azure Portal New](./media/cloud-services-how-to-appdynamics/2-portal-logged-in.png)
Click **+NEW** to find a new add-on.
***
#### Click STORE ####
![New Menu Store](./media/cloud-services-how-to-appdynamics/3-new-menu.png)
Go to the Windows Azure Store to search for an add-on.
***
#### Select AppDynamics ####
![Choose AppDynamics](./media/cloud-services-how-to-appdynamics/4-choose-appdynamics.png)
Select AppDynamics in the list of services and click the **NEXT** arrow.
***
#### Select your region ####
![Personalize](./media/cloud-services-how-to-appdynamics/5-personalize.png)
On the Personalize Add-on page, select your **REGION** and click the **NEXT arrow**. After the form validates the **NAME** field and displays a green checkmark, click the **NEXT** arrow. 
***
#### Review your purchase ####
![Review](./media/cloud-services-how-to-appdynamics/6-review.png)
Review your purchase and click the **CHECK** to purchase. 
***
#### Congratulations! ####
You've successfully signed up for AppDynamics for Windows Azure! 

We'll send you a welcome email with your URL and credentials to connect to the AppDynamics Controller. Then you can use NuGet to add the App Agent for .NET to your Windows Azure solution.
***
### Part 2: Add the AppDynamics agent to your solution with NuGet ###
Use the NuGet package manager to add the App Agent for .NET to your Azure solution in Visual Studio.
***
#### Select Manage NuGet Package ####
![Manage NuGet](./media/cloud-services-how-to-appdynamics/1-vs-manage-nuget-pkgs_0.png)
In Visual Studio, right click your solution name and chose **Manage NuGet Packages for Solution**.
***
#### Search for AppDynamics ####
![Search for AppDyanmics](./media/cloud-services-how-to-appdynamics/2-vs-package-search_0.png)
Select the **NuGet official package source** in the left menu and type "AppDynamics" in the search bar in the upper right. Select **AppDynamics .NET Agent for Azure** and click **Install**.
***
#### Select the projects to monitor###
![Select Process](./media/cloud-services-how-to-appdynamics/3-vs-choose-projects.png)
Select the projects you want to monitor and click **OK**.
***
#### Accept the license #####
![Accept License](./media/cloud-services-how-to-appdynamics/4-accept-license.png)
Click **I Accept** to agree to the license terms.
***
#### Enter the connection information ####
![Connection Info](./media/cloud-services-how-to-appdynamics/5-vs-config_0.png)
Enter the connection information from your Welcome email:

* Controller Host
* Controller Port
* Account Name
* Account Key
We automatically populate **Application Name** with the name of your Windows Azure solution.

***
#### Verify the changes ####
![Verify](./media/cloud-services-how-to-appdynamics/6-vs-verify_0.png)
Close the Manage NuGet Packages window and verify the following:

Instrumented projects have an AppDynamics folder
The AppDynamics folder(s) contain an msi installer package and a setup.cmd file
The ServiceDefinition.csdef has an AppDynamics startup task
***
#### Publish your solution ####
![Publish](./media/cloud-services-how-to-appdynamics/7-publish.png)
Right click the Windows Azure cloud solution and click **Publish**.
***
#### Monitor your app! ####
![Subscriptions](./media/cloud-services-how-to-appdynamics/8-subscriptions.png)
Once you've successfully published your project, you're ready to log in to the Controller and begin monitoring your solution!
