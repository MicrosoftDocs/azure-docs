<properties 
   pageTitle="Troubleshoot issues with Operational Insights"
   description="Learn about troubleshooting issues with Operational Insights"
   services="operational-insights"
   documentationCenter=""
   authors="bandersmsft"
   manager="jwhit"
   editor="tysonn" />
<tags 
   ms.service="operational-insights"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="04/30/2015"
   ms.author="banders" />

#Troubleshoot issues with Operational Insights

[AZURE.INCLUDE [operational-insights-note-moms](../includes/operational-insights-note-moms.md)]

You can use the information in the following sections to help you troubleshoot problems. If the issue you're having isn't in this article, you can try the [Operational Insights team blog](http://blogs.technet.com/b/momteam/archive/2014/05/29/advisor-error-3000-unable-to-register-to-the-advisor-service-amp-onboarding-troubleshooting-steps.aspx).

## Diagnose connection issues for Operational Insights

Because Microsoft Azure Operational Insights relies on data that is moved to and from the cloud, connection issues can be crippling. Use the following information to understand and solve your connection issues.



<table border="1" cellspacing="4" cellpadding="4">
    <tbody>
    <tr align="left" valign="top">
		<td><b>Error message</b></td>
		<td><b>Possible causes</b></td>
    </tr>
    <tr align="left" valign="top">
		<td>The Internet connectivity was verified, but connection to Operational Insights service could not be established. Please try again later.|</td>
		<td>The Operational Insights service is under maintenance. Wait until the Operational Insights maintenance is done.<p>Your network has blocked Operational Insights. Contact your network administrator and request access to Operational Insights, or use another server as your gateway.</td>
    </tr>
    <tr align="left" valign="top">
		<td>Internet connection could not be established. Please check your proxy settings.</td>
		<td>This server is not connected to the Internet. Check the Internet connectivity status, and connect the server to the Internet.<p>The proxy setting is not correct. See <A HREF="operational-insights-proxy-filewall.md">Configure proxy and firewall settings</A> for information about how to set or change your proxy settings.<p>The proxy server requires authentication. See <A HREF="operational-insights-proxy-filewall.md">Configure proxy and firewall settings</A> to learn about how to configure Operations Manager to use a proxy server.</td>
    </tr>
    </tbody>
    </table>

## Troubleshoot SQL Server discovery

If you are running Microsoft SQL Server 2008 R2, and despite deploying the Operations Manager agent, you do not see alerts for this server, you might have a discovery issue.

To confirm if this is the source of your trouble, check for the following two issues:

- In the Operations Manager event log, you see Event ID 4001. This event indicates that there is an invalid class.

- In SQL Server Configuration Manager, when you view SQL Server Services, you see the error message, “The remote procedure call failed. [0x0800706be]”

If both issues are true, you need to install SQL Server 2008 R2 Service Pack 2. To download this service pack, see [SQL Server 2008 R2 Service Pack 2](http://go.microsoft.com/fwlink/?LinkId=271310) in the Microsoft Download Center.

After you install the service pack, you should see Operational Insights data for the server within 24 hours.

