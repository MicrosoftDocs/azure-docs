<properties 
	pageTitle="How to Create a Web App in an App Service Environment" 
	description="Creation flow for web apps and app service plans examined for an app service environment" 
	services="app-services\web" 
	documentationCenter="" 
	authors="ccompy" 
	manager="stefsch" 
	editor=""/>

<tags 
	ms.service="app-services-web" 
	ms.workload="web" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/27/2015" 
	ms.author="ccompy"/>

# How to Create a Web App in an App Service Environment #

Creating web apps is nearly the same in an App Service Environments (ASE) as it is normally.  If you are unfamiliar with the ASE capability then read the document here [What is an App Service Environment][WhatisASE]. 

To create an web app in an ASE you need to first start by having an ASE.   For details around creating an ASE read the document here: [How to Create an App Service Environment][HowtoCreateASE] .

The first step to creating a web app is creating or selecting an App Service Plan (ASP).  Creating an ASP in an ASE starts the same as it does normally which is by going through the web app creation flow starting with New -> Web + Mobile -> Web App

![][1]

If the term is unfamiliar, App Service Plans used to be called Web Hosting Plans. Simply put, App Service Plans are containers that hold a set of your web apps.  When you select pricing, that is applied against the App Service Plan.  To scale up the number of instances of a web app you scale up the instances of your ASP and it affects all of the web apps in that plan.  Some features such as site slots or VNET Integration also have quantity restrictions within the plan.  You can learn more about App Service Plans from the document here: [Azure App Service plans in-depth][Appserviceplans] 

If you are using an App Service Plan that you have already created, select that plan, enter the name for your web app and select Create.  It's the same flow as when you create a web app normally.

If you are making a new App Service Plan though, there are some differences to creating an ASP in an App Service Environment.  Among other things, your worker choices are different as there are no shared workers in an App Service Environment.  The workers you have to use are the ones that have been allocated to the ASE by the admin.  This means that to create a new ASP, you need to have more workers allocated to your App Service Environment than the total number of instances across all of your ASPs in your App Service Environment.  If you don't have enough workers in your App Service Environment to create your ASP, you need to work with your App Service Environment admin to get them added.    

Another difference with App Service Environment hosted ASPs is the lack of pricing selection.  When you have an App Service Environment you are paying VMs used by the system and do not have added charges for the ASPs in that environment.  Normally when you create an ASP you select a pricing plan which determines your billing.  An App Service Environment is essentially a private location where you can create content.  

Because an App Service Environment is essentially a private deployment location, you start by selecting the ASE you wish to use from your location picker. 

![][2]

After selection the UI will update and replace the pricing plan picker with a worker pool picker.  The location shows the name of the ASE system and the region it is in.  Under the URL the domain name for the ASE replaces the normally present .azurewebsites.net.  Web apps created in this ASE will be accessed using that.  If you were creating a web app named mytestapp in an ASE named asedemo then it would be accessed at mytestapp.asedemo.p.azurewebsites.net.  

![][3]

In the normal multi-tenant regions there are 3 sizes that are available with selection of a dedicated price plan.  In a similar fashion, customers that own an ASE can define up to 3 pools of workers and specify the size of the VM that is used for that worker pool.  Instead of selecting a pricing plan for your ASP, you select a Worker Pool.  

The worker pool selection UI shows the size of the VMs used for that worker pool below the name.  The quantity available refers to how many VMs are available for use in that pool.  The total pool may actually have more VMs than this number but this value refers to simply how many are not in use.  

![][4]

In this example you can see only two worker pools available. That is because the ASE administrator only allocated VMs into those two worker pools.  The third would show up when there are VMs allocated into it.  

There are a few considerations to running web apps and managing ASPs in an ASE that need to be taken into account.  

As noted earlier, the owner of the ASE is responsible for the size of the system and as a result they are also responsible for ensuring that there is sufficient capacity to host the desired ASPs. If there are no available workers then you will not be able to create your ASP.  This is also true to scaling up your web app.  If you need more instances then you would have to get your App Service Environment admin to add more workers.

After creating your web app and ASP it is a good idea to scale it up.  In an ASE you always need to have at least 2 instances of your ASP to provide fault tolerance for your apps.  Scaling an ASP in an ASE is the same as normal through the ASP UI.  For more details around scaling read the document here [How to scale a web app in an App Service Environment][HowtoScale]

<!--Image references-->
[1]: ./media/app-service-web-how-to-create-a-web-app-in-an-ase/createaspnewwebapp.png
[2]: ./media/app-service-web-how-to-create-a-web-app-in-an-ase/createasplocation.png
[3]: ./media/app-service-web-how-to-create-a-web-app-in-an-ase/createaspselected.png
[4]: ./media/app-service-web-how-to-create-a-web-app-in-an-ase/createaspworkerpool.png

<!--Links-->
[WhatisASE]:http://azure.microsoft.com/documentation/articles/app-service-web-what-is-an-app-service-environment/
[Appserviceplans]http://azure.microsoft.com/documentation/articles/azure-web-sites-web-hosting-plans-in-depth-overview/
[HowtoCreateASE]http://azure.microsoft.com/documentation/articles/app-service-web-how-to-create-an-app-service-environment-in-an-ase/
[HowtoScale]:http://azure.microsoft.com/documentation/articles/app-service-web-how-to-scale-a-web-app-in-an-app-service-environment