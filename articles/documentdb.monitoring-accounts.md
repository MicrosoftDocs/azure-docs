#How to Monitor a DocumentDB Account  

You can monitor your DocumentDB accounts in the [Azure Preview Management Portal](https://portal.azure.com/). For each DocumentDB account, both performance metrics (e.g. requests, server errors) and usage metrics (e.g. storage consumption) are available.
##Table of Contents  

-	How to: View performance metrics for a DocumentDB account
-	How to: Customize performance metric views for a DocumentDB account
-	How to: Create side-by-side performance metric charts
-	How to: View usage metrics for a DocumentDB account
-	How to: Setup performance metric alerts for a DocumentDB account
-	Next steps  

##<a id="HowtoView"></a>How to: View performance metrics for a DocumentDB account
1.	In the [Azure Preview Management Portal](https://portal.azure.com/), click **Browse**, then **DocumentDB Accounts**, and then click the name of the DocumentDB account for which you would like to view performance metrics.
2.	Within the **Monitoring** lens you can, by default, view:
	1.	Total requests and server errors for the current day
	2.	Reads per second (RPS) and writes per second (WPS) throughput for the current day  
	
	![][1]


3.	Clicking on the **Requests and errors today** part will open a detailed **Metric** blade.
4.	The **Metric** blade shows you details about the metrics you have selected.  At the top of the blade is a graph and below that a table which shows aggregation values of the selected metrics such as average, minimum and maximum.  The metric blade also shows the list of alerts which have been defined, filtered to the metrics that appear on the current metric blade (this way, if you have a number of alerts, you’ll only see the relevant ones presented here).  

![][2]

 

##<a id=:"HowtoCustomize"></a>How to: Customize performance metric views for a DocumentDB account


1.	To customize the metrics which appear in a particular part, right click the metric chart and select **Edit Query**.  
![][3]

2.	On the **Edit Query** blade, there are options to modify the metrics to show in the part as well as the desired time range for which to view the associated metric data.  
![][4]

3.	To change the metrics which are shown in the part, simply select / unselect the available performance metrics and click **Save** at the bottom of the blade.  
4.	To change the time range, simply select a different range (for example, **Past Hour**) and click **Save** at the bottom of the blade.  
![][5] 

5.	The custom time range allows you to choose any period of time over the past 2 weeks.
6.	When you click **Save**, your changes will persist until you leave the DocumentDB Account blade.  When you come back later, you will see the original metrics and time range.  

##<a id="HowtoCreate"></a>How to: Create Side-By-Side Charts
The Azure management preview portal allows you to create side-by-side metric charts.  

1.	First, right click on the chart from which you want to start and select **Customize**  
![][6] 

2.	Click **Clone** on the … menu to copy the part.  
![][7]  


3.	Finally, click **Done** on the toolbar at the top of the screen.  You may now treat this part as any other metric part, customizing the metrics and time range displayed in the part.  By doing this, you can see two different metrics chart side-by-side at the same time.  
![][8] 

>Note that the chart time range and the chosen metrics will be reset to the part’s default values when you leave the Azure management preview portal.  

##<a id="HowtoView"><a/>How to: View Usage Metrics for a DocumentDB Account
1.	In the [Azure Preview Management Portal](https://portal.azure.com/), click **Browse**, then **DocumentDB Accounts**, and then click the name of the DocumentDB account for which you would like to view usage metrics.
2.	Within the **Usage** lens you can, by default, view:
	1.	Document storage consumed within the account
	2.	Index storage consumed within the account
	3.	Available storage of the account
	4.	Attachment usage within the account  
	![][9]
 
##<a id="HowtoSetup"></a>How to: Setup Performance Metrics Alerts for a DocumentDB Account
1.	In the [Azure Preview Management Portal](https://portal.azure.com/), click **Browse**, then **DocumentDB Accounts**, and then click the name of the DocumentDB account for which you would like to setup performance metric alerts.
2.	Within the **Operations** lens, click the **Alert rules** part.  
![][10]

3.	In the Alert rules blade, click **Add Alert**.  
![][11]

4.	In the **Add an alert rule** blade, specify:
	1.	The name of the alert rule you wish to create
	2.	A description of the alert rule you wish to create
	3.	The metric on which the alert rule should operate
	4.	The condition, threshold and period under which the alert should activate
		-	For example, Server errors count greater than 5 over the last 15 minutes
	5.	If the service administrator and co-administrators should be emailed when the alert fires
	6.	Additional email addresses which should receive alert notifications  
	![][12]

 
##<a id="NextSteps"></a>Next steps
-	Learn how to [grant access to DocumentDB resources](http://go.microsoft.com/fwlink/p/?LinkId=402366).
-	To learn more about DocumentDB, see the Azure DocumentDB documentation on [azure.com](http://go.microsoft.com/fwlink/?LinkID=402319&clcid=0x409)


[1]: ./media/documentdb.monitoring-accounts/madocdb1.png
[2]: ./media/documentdb.monitoring-accounts/madocdb2.png
[3]: ./media/documentdb.monitoring-accounts/madocdb3.png
[4]: ./media/documentdb.monitoring-accounts/madocdb4.png
[5]: ./media/documentdb.monitoring-accounts/madocdb5.png
[6]: ./media/documentdb.monitoring-accounts/madocdb6.png
[7]: ./media/documentdb.monitoring-accounts/madocdb7.png
[8]: ./media/documentdb.monitoring-accounts/madocdb8.png
[9]: ./media/documentdb.monitoring-accounts/madocdb9.png
[10]: ./media/documentdb.monitoring-accounts/madocdb10.png
[11]: ./media/documentdb.monitoring-accounts/madocdb11.png
[12]: ./media/documentdb.monitoring-accounts/madocdb12.png