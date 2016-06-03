<properties
 pageTitle="Troubleshoot cloud service deployment problems | Microsoft Azure"
 description="There are a few common problems you may run into when deploying a cloud service to Azure. This article provides solutions to some of them."
   services="cloud-services"
   documentationCenter=""
   authors="simonxjx"
   manager="felixwu"
   editor=""
   tags="top-support-issue"/>
<tags
   ms.service="cloud-services"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="tbd"
   ms.date="06/03/2016"
   ms.author="v-six" />

# Troubleshoot cloud service deployment problems

When you deploy a cloud service application package to Azure, you can obtain information about the deployment from the **Properties** pane in the Azure portal. You can use the details in this pane to help you troubleshoot problems with the cloud service, and you can provide this information to Azure Support when opening a new support request.

You can find the **Properties** pane as follows:

* In the Azure portal, click the deployment of your cloud service, click **All settings**, and then click **Properties**.
* In the Azure classic portal, click the deployment of your cloud service, click **DASHBOARD**, located at the lower-right corner of the page (under **quick glance**). Be aware that there's no "Properties" label on this pane.

> [AZURE.NOTE] You can copy the contents of the **Properties** pane to the clipboard by clicking the icon in the upper-right corner of the pane.

[AZURE.INCLUDE [support-disclaimer](../../includes/support-disclaimer.md)]

## Problem: I cannot access my website, but my deployment is started and all role instances are ready

The website URL link shown in the portal does not include the port. The default port for websites is 80. If your application is configured to run in a different port, you must add the correct port number to the URL when accessing the website.

1. In the Azure portal, click the deployment of your cloud service.
2. In the **Properties** pane of the Azure portal, check the ports for the role instances (under **Input Endpoints**).
3. If the port is not 80, add the correct port value to the URL when you access the application. To specify a non-default port, type the URL, followed by a colon (:), followed by the port number, with no spaces.

## Problem: My role instances recycled without me doing anything

Service healing occurs automatically when Azure detects problem nodes and therefore moves role instances to new nodes. When this occurs, you might see your role instances recycling automatically. To find out if service healing occurred:

1. In the Azure portal, click the deployment of your cloud service.
2. In the **Properties** pane of the Azure portal, review the information and determine whether service healing occurred during the time that you observed the roles recycling.

Roles will also recycle roughly once per month during host-OS and guest-OS updates.  
For more information, see the blog post [Role Instance Restarts Due to OS Upgrades](http://blogs.msdn.com/b/kwill/archive/2012/09/19/role-instance-restarts-due-to-os-upgrades.aspx)

## Problem: I cannot do a VIP swap and receive an error

A VIP swap is not allowed if a deployment update is in progress. Deployment updates can occur automatically when:

* A new guest operating system is available and you are configured for automatic updates.
* Service healing occurs.

To find out if an automatic update is preventing you from doing a VIP swap:

1. In the Azure portal, click the deployment of your cloud service.
2. In the **Properties** pane of the Azure portal, look at the value of **Status**. If it is **Ready**, then check **Last operation** to see if one recently happened that might prevent the VIP swap.
3. Repeat steps 1 and 2 for the production deployment.
4. If an automatic update is in process, wait for it to finish before trying to do the VIP swap.

## Problem: A role instance is looping between Started, Initializing, Busy, and Stopped

This condition could indicate a problem with your application code, package, or configuration file. In that case, you should be able to see the status changing every few minutes and the Azure portal may say something like **Recycling**, **Busy**, or **Initializing**. This indicates that there is something wrong with the application that is keeping the role instance from running.

For more information on how to troubleshoot for this problem, see the blog post [Azure PaaS Compute Diagnostics Data](http://blogs.msdn.com/b/kwill/archive/2013/08/09/windows-azure-paas-compute-diagnostics-data.aspx) and [Common issues that cause roles to recycle](cloud-services-troubleshoot-common-issues-which-cause-roles-recycle.md).

## Problem: My application stopped working

1. In the Azure portal, click the role instance.
2. In the **Properties** pane of the Azure portal, consider the following conditions to resolve your problem:
   * If the role instance has recently stopped (you can check the value of **Abort count**), the deployment could be updating. Wait to see if the role instance resumes functioning on its own.
   * If the role instance is **Busy**, check your application code to see if the [StatusCheck](https://msdn.microsoft.com/library/microsoft.windowsazure.serviceruntime.roleenvironment.statuscheck) event is handled. You might need to add or fix some code that handles this event.
   * Go through the diagnostic data and troubleshooting scenarios in the blog post [Azure PaaS Compute Diagnostics Data](http://blogs.msdn.com/b/kwill/archive/2013/08/09/windows-azure-paas-compute-diagnostics-data.aspx).

>[AZURE.WARNING] If you recycle your cloud service, you reset the properties for the deployment, effectively erasing the information for the original problem.

## Next steps

View more [troubleshooting articles](https://azure.microsoft.com/documentation/articles/?tag=top-support-issue&product=cloud-services) for cloud services.

To learn how to troubleshoot cloud service role issues by using Azure PaaS computer diagnostics data, see [Kevin Williamson's blog series](http://blogs.msdn.com/b/kwill/archive/2013/08/09/windows-azure-paas-compute-diagnostics-data.aspx).
