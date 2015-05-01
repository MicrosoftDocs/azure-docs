<properties 
   pageTitle="Connect to Operational Insights from System Center Operations Manager" 
   description="Learn about how to connect to Operational Insights through Operations Manager." 
   services="operational-insights" 
   documentationCenter="" 
   authors="lauracr" 
   manager="jwhit" 
   editor="bandersmsft"/>

<tags
   ms.service="operational-insights"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na" 
   ms.date="02/20/2015"
   ms.author="lauracr"/>

# Connect to Operational Insights from System Center Operations Manager 

You can connect Operational Insights to an existing System Center Operations Manager environment. This will allow you to use existing Operations Manager agents as Operational Insights agents.

 >[AZURE.NOTE] Support for Operational Insights is available as of Operations Manager 2012 SP1 UR6 and Operations Manager 2012 R2 UR2. Proxy support was added in SCOM 2012 SP1 UR7 and SCOM 2012 R2 UR3.

## Connect SCOM to Operational Insights and add agents

1. In the Operations Manager console, click **Administration**.

2. Expand the **Operational Insights** node and click **Operational Insights Connection**.

3. Click the **Register to Operational Insights** link and follow the onscreen instructions. 

4. After completing the registration wizard, click **Add a Computer/Group**.

5. In the **Computer Search** dialog box you can search for computers or groups monitored by Operations Manager. Select computers or groups to onboard to Operational Insights, click **Add**, and then click **OK**.

<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps

[Configure Proxy and Firewall settings (Optional)](https://msdn.microsoft.com/library/azure/dn884643.aspx)


