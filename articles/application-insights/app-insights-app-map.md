<properties 
	pageTitle="Application Map in Application Insights" 
	description="A visual presentation of the dependencies between app components, labeled with KPIs and alerts." 
	services="application-insights" 
    documentationCenter=""
	authors="SoubhagyaDash" 
	manager="douge"/>

<tags 
	ms.service="application-insights" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="ibiza" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="06/15/2016" 
	ms.author="awills"/>
 
# Application Map in Application Insights

In [Visual Studio Application Insights](app-insights-overview.md), Application Map is a visual layout of the dependency relationships of your application components. Each component shows KPIs such as load, performance, failures, and alerts to help you discover any component causing a performance issue or failure. You can click through from any component to more detailed diagnostics, both from Application Insights, and - if your app uses Azure services - Azure diagnostics, such as the SQL Database Advisor recommendations.

Like other charts, you can pin an application map to the Azure dashboard, where it is fully functional. 

## Open the application map

Open the map from the overview blade for your application:

![open app map](./media/app-insights-app-map/01.png)

![app map](./media/app-insights-app-map/02.png)

The map shows the following nodes:

* Client side component (monitored with the JavaScript SDK)
*	Server side component
*	Dependencies from the client/server component
*	Availability tests

You can expand and collapse dependency link groups:

![collapse](./media/app-insights-app-map/03.png)
 
If you have a large number of dependencies of one type (SQL, HTTP etc.), they may appear grouped. 


![grouped dependencies](./media/app-insights-app-map/03-2.png)
 
 
## Spot problems

Each node has relevant performance indicators, such as the load, performance and failure rates for that component. 

Useful icons help you notice problems. An orange warning icon indicates failures in requests, page views or dependency calls. A red icon means a failure rate above 5%.


![failure icons](./media/app-insights-app-map/04.png)

 
Active alerts - orange means some alerts are active, red means all: 


![active alerts](./media/app-insights-app-map/05.png)
 
If you use SQL Azure, an icon will show up when there are recommendations on how you can improve performance. 


![Azure recommendation](./media/app-insights-app-map/06.png)

Click through to get details of the recommendations:


![azure recommendation](./media/app-insights-app-map/07.png)
 
 
## Diagnostic click through

Each of the nodes on the map offers targeted click through for diagnostics. The options vary depending on the type of the node.


![client options](./media/app-insights-app-map/08.png)


![server options](./media/app-insights-app-map/09.png)


![dependency options](./media/app-insights-app-map/10.png)
 
 
For components that are hosted in Azure, you can find direct links to them among the options.


## Filters and time range

By default, the map summarizes all the data available for the chosen time range. But you can filter it to include only specific operation names or dependencies.

* Operation name: This includes both page views and server side request types. With this option, the map shows the KPI on the server/client side node for the selected operations only. It shows the dependencies called in the context of those specific operations.
* Dependency base name: This includes the AJAX browser side dependencies and server side dependencies. If you report custom dependency telemetry with the TrackDependency API, they will also show here. You can select the dependencies to show on the map. Please note that at this time, this will not filter the server side requests, or the client side page views.


![Set filters](./media/app-insights-app-map/11.png)

 
 
## Save filters

To save the filters you have applied, pin the filtered view onto a [dashboard](app-insights-dashboards.md).


![Pin to dashboard](./media/app-insights-app-map/12.png)
 


## Feedback

Please [provide feedback through the portal feedback option](app-insights-get-dev-support.md).


![MapLink-1 image](./media/app-insights-app-map/13.png)


