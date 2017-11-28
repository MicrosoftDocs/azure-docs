

# Monitoring in Azure

Monitoring is the act of collecting and analyzing information to determine the performance or availability of your application or service.  It includes proactive alerts to notify you when a problem is detected so that you can address the issue 

Microsoft has multiple services to monitor Azure applications, and you may use one or more depending on your particular requirements.  


## Log Analytics
[Log Analytics](http://azure.microsoft.com/documentation/services/log-analytics) collects data from a variety of resources into a central repository where it can be analyzed with a powerful query language.  Log Analytics will typically play a central role in your monitoring strategy by collecting data from other services such as Application Insights and Azure Monitor in addition to collecting data from agents installed in virtual machines both in the cloud and on-premise.

## Application Insights
Application Insights is an Application Performance Management (APM) service that allows you to monitor your live web application.  This includes collecting performance information both from the server and client, identifying exceptions in the application, and proactively testing your application from different locations.  Developers can track exceptions down to the actual failing code.

Application Insights provides interactive analysis tools but also stores all data that it collects in Log Analytics.  This allows you to use a common query language for custom analysis across both tools.  

## Azure Monitor


## Management solutions

## Power BI
Power BI 