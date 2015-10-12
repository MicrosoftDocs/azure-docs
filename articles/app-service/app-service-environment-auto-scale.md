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
> [AZURE.NOTE] **App Service environment** scale operations are not instantaneous and can take 
several minutes to complete depending on the size of your environment.
</br>
**App Service environments** support auto-scale. This is achieved by allowing you to auto-scale individual 
worker pools based on metrics or schedule.
 </br>![][intro]</br>
Auto-scale allows you to optimize your resource utilization by automatically growing and shrinking an 
**App Service environment** to fit your budget and or load profile.

#Configuring Worker Pool Auto-scale 
You can access the auto-scale functionality from the settings tab of the **worker pool**. 
 </br>![][settings-scale]</br>
From there the interface should be fairly familiar since this is the same experience as when scaling an 
**App Service plan**. You will be able to either enter a scale value manually
 </br>![][scale-manual]</br>
Or configure an auto-scale profile:
 </br>![][scale-profile]</br>
Auto-scale profiles are useful to set limits on your scale. This way you can have both a consistent 
performance experience by setting a lower bound scale value (1) and a predictable spend cap, by 
setting an upper bound (2). 
 </br>![][scale-profile2]</br>
Once a profile is defined, metrics based auto-scale rules can be added to scale up or down the 
number of instances in the **worker pool** within the bounds defined by the profile.
</br>![][scale-rule]</br>
 Any of the **worker pool** or **front end** metrics can be used for defining auto scale rules. This are 
 the same metrics you can monitor in the resource blade graphs or set alerts for.
 
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
<li>Front Ends: 3</li>
<li>Worker Pool 1: 10</li>
<li>Worker Pool 2: 5</li>
<li>Worker Pool 3: 5</li>
</ul>

**Worker pool 1** is used for production workloads, while **worker pool 2** and **worker pool 3** 
are used for QA and development workloads.</br>

The **App Service plans** used for QA and Dev are configured for **manual scale** but the production 
**App Service plan** is set to **auto-scale** to deal with variations in load and traffic.</br>

Frank is very familiar with the application and he knows that the peak hours for load are between 
9:00am and 6:00pm since this is a **LOB application** and is used by employees while they are in 
the office. Usage drops after that, once users are done for that day. But there is still some load 
since users can access it remotely with either their mobile devices or home computers. The production 
**App Service plan** is already configured to **auto-scale** based on CPU usage with the following 
rules:
</br>![][asp-scale]</br>
<table>
	<tr>
		<td>
			<ul><li>Auto-scale Profile – Weekdays – App Service Plan</li></ul>
			<ul>
				<li>Name: Weekday Profile</li>
				<li>Scale by: Schedule and performance rules</li>
				<li>Profile: Weekdays</li>
				<li>Type: recurrence</li>
				<li>Target Range: 5 to 20 instances</li>
				<li>Days: Monday, Tuesday, Wednesday, Thursday, Friday</li>
				<li>Start Time: 9:00AM</li>
				<li>Time zone: UTC – 08</li>
			</ul>
			</br>
			<ul><li>Auto-scale Rule (Scale UP)</li></ul>
			<ul>
				<li>Resource: Production (App Service Environment)</li>
				<li>Metric: CPU %</li>
				<li>Operation: Greater than 60%</li>
				<li>Duration: 5 Minutes</li>
				<li>Time Aggregation: Average</li>
				<li>Action: Increase count by 2</li>
				<li>Cool down (minutes): 15</li>
			</ul>
			</br>
			<ul><li>Auto-scale Rule (Scale DOWN)</li></ul>
			<ul>
				<li>Resource: Production (App Service Environment)</li>
				<li>Metric: CPU %</li>
				<li>Operation: Lesser than 30%</li>
				<li>Duration: 10 Minutes</li>
				<li>Time Aggregation: Average</li>
				<li>Action: Decrease count by 1</li>
				<li>Cool down (minutes): 20</li>
			</ul>
		</td>
		<td>
			<ul><li>Auto-scale Profile – Weekends – App Service Plan</li></ul>
			<ul>
				<li>Name: Weekend Profile</li>
				<li>Scale by: Schedule and performance rules</li>
				<li>Profile: Weekend</li>
				<li>Type: recurrence</li>
				<li>Target Range: 3 to 10 instances</li>
				<li>Days: Saturday, Sunday</li>
				<li>Start Time: 9:00AM</li>
				<li>Time zone: UTC – 08</li>
			</ul>
			</br>
			<ul><li>Auto-scale Rule (Scale UP)</li></ul>
			<ul>
				<li>Resource: Production (App Service Environment)</li>
				<li>Metric: CPU %</li>
				<li>Operation: Greater than 80%</li>
				<li>Duration: 10 Minutes</li>
				<li>Time Aggregation: Average</li>
				<li>Action: Increase count by 1</li>
				<li>Cool down (minutes): 20</li>
			</ul>
			</br>
			<ul><li>Auto-scale Rule (Scale DOWN)</li></ul>
			<ul>
				<li>Resource: Production (App Service Environment)</li>
				<li>Metric: CPU %</li>
				<li>Operation: Lesser than 20%</li>
				<li>Duration: 15 Minutes</li>
				<li>Time Aggregation: Average</li>
				<li>Action: Decrease count by 1</li>
				<li>Cool down (minutes): 10</li>
			</ul>
		</td>
	</tr>
</table>

###App Service Plan Inflation Rate
App Service plans that are configured to auto-scale, will do so at a maximum rate per hour. This rate 
can be calculated based on the values provided on the auto-scale rule.</br>
Understanding and calculating the App Service plan Inflation rate is important to 
**App Service Environment** **worker pool** auto-scale since scale changes to a **worker pool** are 
not instantaneous and do take some time to apply.</br> 

The **App Service plan** inflation rate is calculated as follows:

</br>![][ASP-Inflation]</br>

Based on the *Auto-scale - Scale UP* rule for the *Weekday* profile of the production 
**App Service plan** this would look as follows:

</br>![][Equation1]</br>

In the case of the *Auto-scale – Scale UP* rule for the *Weekends* profile of the production 
**App Service plan** the formula would resolve to:

</br>![][Equation2]</br>

This value can also be calculated for scale down operations:

Based on the *Auto-scale - Scale Down* rule for the *Weekday* profile of the production 
**App Service plan** this would look as follows:

</br>![][Equation3]</br>

In the case of the *Auto-scale – Scale Down* rule for the *Weekends* profile of the production 
**App Service plan** the formula would resolve to:  

</br>![][Equation4]</br>

What this means is that the production *App Service plan* can grow at a maximum rate of **8** 
instances per hour during the week and **4** instances per hour during the weekend. And it can 
release instances at a maximum rate of **4** instances per hour during the week and **6** instances 
per hour during weekends.

If multiple **App Service plans** are being hosted in a **worker pool**, then the **total inflation rate** 
needs to be calculated and this can be expresses as the *sum* of the inflation rate for all the 
**App Service plans** being hosting in that **worker pool**.
</br>![][ASP-Total-Inflation]</br> 

###Using the App Service Plan Inflation rate to define worker pool auto-scale rules
**Worker pools** that host **App Service plans** that are configured to auto-scale will need to 
be allocate a buffer of capacity to allow for the auto-scale operations to grow/shrink the 
**App Service plan** as needed. The minimum buffer would be the calculated 
**Total App Service Plan Inflation Rate**.
</br>
Since App Service Environment scale operations take some time to apply, any change should account 
for further demand changes that could happen while a scale operation is in progress. For this we 
recommend using the calculated **Total App Service Plan Inflation Rate** as the minimum number of 
instances added for each auto-scale operation.
</br>

</br>

With this Information Frank can define the following Auto-scale Profile and Rules
</br>![][Worker-Pool-Scale]</br> 
<table>
	<tr>
		<td>
			<ul><li>Auto-scale Profile – Weekdays</li></ul>
			<ul>
				<li>Name: Weekday Profile</li>
				<li>Scale by: Schedule and performance rules</li>
				<li>Profile: Weekdays</li>
				<li>Type: recurrence</li>
				<li>Target Range: 13 to 25 instances</li>
				<li>Days: Monday, Tuesday, Wednesday, Thursday, Friday</li>
				<li>Start Time: 7:00AM</li>
				<li>Time zone: UTC – 08</li>
			</ul>
			</br>
			<ul><li>Auto-scale Rule (Scale UP)</li></ul>
			<ul>
				<li>Resource: Worker Pool 1</li>
				<li>Metric: WorkersAvailable/li>
				<li>Operation: Less than 8</li>
				<li>Duration: 20 Minutes</li>
				<li>Time Aggregation: Average</li>
				<li>Action: Increase count by 8</li>
				<li>Cool down (minutes): 90</li>
			</ul>
			</br>
			<ul><li>Auto-scale Rule (Scale DOWN)</li></ul>
			<ul>
				<li>Resource: Worker Pool 1</li>
				<li>Metric: WorkersAvailable/li>
				<li>Operation: Greater than 8</li>
				<li>Duration: 20 Minutes</li>
				<li>Time Aggregation: Average</li>
				<li>Action: Decrease count by 2</li>
				<li>Cool down (minutes): 90</li>
			</ul>
		</td>
		<td>
			<ul><li>Auto-scale Profile – Weekends</li></ul>
			<ul>
				<li>Name: Weekend Profile</li>
				<li>Scale by: Schedule and performance rules</li>
				<li>Profile: Weekend</li>
				<li>Type: recurrence</li>
				<li>Target Range: 6 to 15 instances</li>
				<li>Days: Saturday, Sunday</li>
				<li>Start Time: 9:00AM</li>
				<li>Time zone: UTC – 08</li>
			</ul>
			</br>
			<ul><li>Auto-scale Rule (Scale UP)</li></ul>
			<ul>
				<li>Resource: Worker Pool 1</li>
				<li>Metric: WorkersAvailable</li>
				<li>Operation: Less than 3</li>
				<li>Duration: 30 Minutes</li>
				<li>Time Aggregation: Average</li>
				<li>Action: Increase count by 3</li>
				<li>Cool down (minutes): 90</li>
			</ul>
			</br>
			<ul><li>Auto-scale Rule (Scale DOWN)</li></ul>
			<ul>
				<li>Resource: Worker Pool 1</li>
				<li>Metric: WorkersAvailable</li>
				<li>Operation: Less than 3</li>
				<li>Duration: 15 Minutes</li>
				<li>Time Aggregation: Average</li>
				<li>Action: Decrease count by 3</li>
				<li>Cool down (minutes): 90</li>
			</ul>
		</td>
	</tr>
</table>

The Target range defined in the profile is calculated by the minimum instances defined in the 
Profile for the **App Service plan** + buffer.</br>
The Maximum range would be the sum of all the maximum ranges for all **App Service plans** hosted in 
the **worker pool**.</br>
The Increase count for the scale up rules should be set to be at least 1X the 
**App Service Plan Inflation Rate** for scale up.</br>
Decrease count can be adjusted to something between 1/2X or 1X the **App Service Plan Inflation 
Rate** for scale down.</br>

###Auto-scale for Front End Pool
**Front end** auto-scale rules are simpler than for **worker pools**, the main things to look for is to 
make sure duration of the measurement and the cooldown timers take into consideration the fact that scale 
operations on an App Service plan are not instantaneous.</br>
For this scenario, Frank knows that the error rate increases once front ends reach 80% CPU utilization, 
to prevent this he sets the auto-scale rule to increase instances as follows:
 
 </br>![][Front-End-Scale]</br>
  
<ul><li>Auto-scale Profile – Front Ends</li></ul>
<ul>
	<li>Name: Auto-scale – Front Ends</li>
	<li>Scale by: Schedule and performance rules</li>
	<li>Profile: Everyday</li>
	<li>Type: recurrence</li>
	<li>Target Range: 3 to 10 instances</li>
	<li>Days: Everyday</li>
	<li>Start Time: 9:00AM</li>
	<li>Time zone: UTC – 08</li>
</ul>
</br>
<ul><li>Auto-scale Rule (Scale UP)</li></ul>
<ul>
	<li>Resource: Front End Pool</li>
	<li>Metric: CPU %</li>
	<li>Operation: Greater than 60%</li>
	<li>Duration: 20 Minutes</li>
	<li>Time Aggregation: Average</li>
	<li>Action: Increase count by 3</li>
	<li>Cool down (minutes): 90</li>
</ul>
</br>
<ul><li>Auto-scale Rule (Scale DOWN)</li></ul>
<ul>
	<li>Resource: Worker Pool 1</li>
	<li>Metric: CPU %</li>
	<li>Operation: Lesser than 30%</li>
	<li>Duration: 20 Minutes</li>
	<li>Time Aggregation: Average</li>
	<li>Action: Decrease count by 3</li>
	<li>Cool down (minutes): 90</li>
</ul>

<!-- IMAGES -->
[intro]: ./media/app-service-environment-auto-scale/introduction.png
[settings-scale]: ./media/app-service-environment-auto-scale/settings-scale.png
[scale-manual]: ./media/app-service-environment-auto-scale/scale-manual.png
[scale-profile]: ./media/app-service-environment-auto-scale/scale-profile.png
[scale-profile2]: ./media/app-service-environment-auto-scale/scale-profile-2.png
[scale-rule]: ./media/app-service-environment-auto-scale/scale-rule.png
[asp-scale]: ./media/app-service-environment-auto-scale/asp-scale.png
[ASP-Inflation]: ./media/app-service-environment-auto-scale/asp-inflation-rate.png
[Equation1]: ./media/app-service-environment-auto-scale/equation1.png
[Equation2]: ./media/app-service-environment-auto-scale/equation2.png
[Equation3]: ./media/app-service-environment-auto-scale/equation3.png
[Equation4]: ./media/app-service-environment-auto-scale/equation4.png
[ASP-Total-Inflation]: ./media/app-service-environment-auto-scale/asp-total-inflation-rate.png
[Worker-Pool-Scale]: ./media/app-service-environment-auto-scale/wp-scale.png
[Front-End-Scale]: ./media/app-service-environment-auto-scale/fe-scale.png