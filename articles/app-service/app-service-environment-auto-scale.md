<properties 
	pageTitle="Auto scaleing and App Service Environment" 
	description="Auto scaleing and App Service Environment" 
	services="app-service"
	documentationCenter=""
	authors="btardif" 
	manager="wpickett" 
	editor="" 
/>

<tags 
	ms.service="app-service" 
	ms.workload="web" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="10/09/2015" 
	ms.author="byvinyal"
/>
	
#Auto scaleing and App Service Environment

##Introduction
App service environments support auto-scale. This is achieved by allowing you to auto-scale individual 
worker pools based on metrics or schedule.
 </br>![][intro]</br>
Auto-scale allows you to optimize your resource utilization by automatically growing and shrinking an 
app service environment to fit your budget and or load profile.

#Configuring Worker Pool Auto-scale 
You can access the auto-scale functionality from the settings tab of the Worker Pool. 
 </br>![][settings-scale]</br>
From there the interface should be fairly familiar since this is the same experience as when scaling an 
App Service Plan. You will be able to either enter a scale value manually
 </br>![][scale-manual]</br>
Or configure an auto-scale profile:
 </br>![][scale-profile]</br>
Auto-scale profiles are useful to set limits on your scale. This way you can have both a consistent 
performance experience by setting a lower bound scale value (1) and a predictable spend cap, by 
setting an upper bound (2). 
 </br>![][scale-profile2]</br>
Once a profile is defined, metrics based auto-scale rules can be added to scale up or down the 
number of instances in the worker pool within the bounds defined by the profile.
</br>![][scale-rule]</br>
 
##Auto-scale Example
Auto-scale of an App Service environment can best be illustrated by walking through a scenario. 
In this article I will walk through all the considerations necessary when setting up auto-scale and 
all the interaction that come into play when we factor in auto scaling App Service Environments that 
are hosted in an ASE.

###Scenario Introduction
Frank is a SysAdmin for an enterprise, he has migrated a portion of the workloads he manages to an 
App Service Environment.</br>

The App Service environment is configured to manual scale as follows:
<ul>
<li>**Front Ends**: 3</li>
<li>**Worker Pool 1**: 10</li>
<li>**Worker Pool 2**: 5</li>
<li>**Worker Pool 3**: 5</li>
</ul>

**Worker Pool 1** is used for production workloads, while **Worker Pool 2** and **Worker Pool 3** 
are used for QA and development workloads.</br>

The **App Service Plans** used for QA and Dev are configured for **manual scale** but the production 
**App Service Plan** is set to **auto-scale** to deal with variations in load and traffic.</br>

Frank is very familiar with the application and he knows that the peak hours for load are between 
9:00am and 6:00pm since this is a **LOB application** and is used by employees while they are in 
the office. Usage drops after that, once users are done for that day. But there is still some load 
since users can access it remotely with either their mobile devices or home computers. The production 
**App Service Plan** is already configured to **auto-scale** based on CPU usage with the following 
rules:
 


> [AZURE.NOTE] App Service plan scale operations are not instantaneous .


<!-- IMAGES -->
[intro]: ./media/app-service-environment-auto-scale/introduction.png
[settings-scale]: ./media/app-service-environment-auto-scale/settings-scale.png
[scale-manual]: ./media/app-service-environment-auto-scale/scale-manual.png
[scale-profile]: ./media/app-service-environment-auto-scale/scale-profile.png
[scale-profile2]: ./media/app-service-environment-auto-scale/scale-profile2.png
[scale-rule]: ./media/app-service-environment-auto-scale/scale-rule.png
[ase-scale]: ./media/app-service-environment-auto-scale/scale-rule.png