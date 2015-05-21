<properties 
 pageTitle="Troubleshooting Deployment Problems Using the Deployment Properties" 
 description="" 
 services="cloud-services" 
 documentationCenter="" 
 authors="Thraka" 
 manager="timlt" 
 editor=""/>


<tags 
 ms.service="cloud-services" 
 ms.workload="tbd" 
 ms.tgt_pltfrm="na" 
 ms.devlang="na" 
 ms.topic="article" 
 ms.date="05/12/2015" 
 ms.author="adegeo"/>

##Troubleshooting Deployment Problems Using the Deployment Properties

Updated: January 13, 2014

When you deploy an application package to Azure, you can obtain information about the deployment from the Properties pane in the Management Portal. You can use the details in this pane to help you troubleshoot problems with the cloud service, and you can provide this information to Azure support when opening a new support request.

> [AZURE.NOTE] You can copy the contents of the Properties pane to the clipboard by clicking the icon in the upper-right corner of the pane.

The following table lists some possible deployment problems that can occur and resolution steps for fixing the problem. If these suggestions do not resolve your problem, contact Azure Support.

|Problem|Resolution|
|:--|:--|
|I cannot access my website even though my deployment is started and all role instances are ready.|The website URL link shown in the portal does not include the port. The default port for websites is 80. However, if your application is configured to run in a different port, you must add the correct port to the URL when accessing the website.<ol><li>In the Management Portal, click the deployment of your cloud service.</li><li>In the <b>Properties</b> pane of the Management Portal, check the ports for the role instances (under Input Endpoints).</li><li>If the port is not 80, add the correct port value to the URL when you access the application. To specify a non-default port, type the URL, followed by a colon (:), followed by the port number with no spaces.</li></ol>
|My roles instances restarted without me doing anything.|Service healing occurs automatically when the Azure detects problematic nodes and moves role instances to new nodes. When this occurs, you might see your role instances restarting automatically. To find out if service healing occurred:<ol><li>In the Management Portal, click the deployment of your cloud service.</li><li>In the <strong>Properties</strong> pane of the Management Portal, review the information and determine if service healing occurred during the time you observed the roles restarting.</li></ol><p>Roles will also restart roughly once per month during Host OS and Guest OS upgrades.&nbsp; For more information, see the blog post <a href="http://blogs.msdn.com/b/kwill/archive/2012/09/19/role-instance-restarts-due-to-os-upgrades.aspx">Role Instance Restarts Due to OS Upgrades</a></p>|
|I cannot do a VIP swap and receive an error whenever I try.|A VIP swap is not allowed if a deployment update is in progress. Deployment updates can occur automatically when:<ul><li>A new guest operating system is available and you are configured for automatic updates</li><li>Service healing occurs</li></ul><p>To find out if an automatic upgrade is preventing you from doing a VIP swap:</p><ol><li>In the Management Portal, click the deployment of your cloud service.</li><li>In the <strong>Properties</strong> pane of the Management Portal, look at the value of <strong>Status</strong>. If it is <strong>Ready</strong>, then check <strong>Last operation</strong> to see if one recently happened that might prevent the VIP swap.</li><li>Repeat steps 1 and 2 for the production deployment.</li><li>If an automatic update is in process, wait for it to finish before trying to do the VIP swap.</li></ol>|
|A role instance is looping between Started, Initializing, Busy, and Stopped.|This condition could indicate a problem with your application code, package or configuration file. If true, then you should be able to see the Status changing every few minutes and the Azure Management Portal may say something like Recycling, Busy, or Initializing. This indicates that there is something wrong with the application that is keeping the role instance from running.<br /><br /><br />For more information on how to troubleshoot for this problem, see the blog post <a href="http://blogs.msdn.com/b/kwill/archive/2013/08/09/windows-azure-paas-compute-diagnostics-data.aspx">Azure PaaS Compute Diagnostics Data</a> and <a href="https://msdn.microsoft.com/library/gg465402">Common Issues Which Cause Roles to Recycle</a>.
|My application stopped working.|<ol><li>In the Management Portal, click the role instance.</li><li>In the <strong>Properties</strong> pane of the Management Portal, consider the following conditions to resolve your problem:<ul><li>If the role instance has recently stopped (you can check the value of <strong>Abort count</strong>), the deployment could be updating. Wait to see if the role instance resumes functioning on its own.</li><li>If the role instance is Busy, check your application code to see if the <a href="https://msdn.microsoft.com/library/microsoft.windowsazure.serviceruntime.roleenvironment.statuscheck">StatusCheck</a> event is handled. You might need to add or fix some code that handles this event.</li><li>Go through the diagnostic data and troubleshooting scenarios in the blog post <a href="http://blogs.msdn.com/b/kwill/archive/2013/08/09/windows-azure-paas-compute-diagnostics-data.aspx">Azure PaaS Compute Diagnostics Data</a>.</li></ul></li></ol>|
>[AZURE.NOTE] If you restart your cloud service, you reset the properties for the deployment, effectively erasing the information for the original problem.