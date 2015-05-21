<properties 
   pageTitle="Improving Application Availability in Azure Cloud Services"
   description=""
   services="cloud-services"
   documentationCenter=""
   authors="Thraka"
   manager="timlt"
   editor=""/>
<tags 
   ms.service="cloud-services"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="tbd"
   ms.date="05/12/2015"
   ms.author="adegeo" />

## Overview

For various reasons, the roles instances that host Azure applications are restarted or taken offline, which affects availability if the application is hosted with one role instance. Sometimes this happens because of a problem with the application itself or because it is a part of normal Azure operations, such as service healing or automatic upgrade to the guest operating system.

### Recommended Method for Improving Availability

The best way to improve availability of your Azure application is to configure your application to use a minimum of two role instances in at least two upgrade domains. By doing this, you ensure better availability for your application by making sure at least one instance remains running in the event that instances are restarted or taken offline as part a normal course of action.

The number of per-role instances in a Azure application is controlled by the Instances setting in the configuration (cscfg) file.

	<Role name="<role-name>">
	    <Instances count="<number-of-instances>" />    
	    <ConfigurationSettings>
	      <Setting name="<setting-name>" value="<setting-value>" />
	    </ConfigurationSettings>
	  </Role>

### Improving Availability for Deployments with One Instance

If you choose to use one role instance for your application, the following table lists the reasons for a role instance to go offline or be restarted and the ways you can mitigate downtime and improve availability of your application:

|Reason a role instance goes offline or is restarted|Way to improve availability|
|---|---|
|Guest operating system (OS) auto-upgrade: if the application is configured to be upgraded automatically, then the role instance will be automatically restarted when the guest OS upgrade happens (roughly once a month).|Do one of the following:<ul><li>Configure the application for manual upgrade and upgrade the instance at off peak hours so that the restart does not impact incoming traffic significantly. For more information on manually setting the Guest OS version, see Manage Upgrades to the Azure Guest Operating System (Guest OS). Choose the latest Guest OS possible.<br /><br /></li><li>Temporarily configure your application to use two instances, manually upgrade the guest OS on one instance while keeping the other instance running, and then reverting back to a single instance when you have completed the upgrade.</li></ul>|
|Application upgrade: if you upgrade the application in-place (manual or auto-walk), then since there is a single upgrade domain and instance, Azure will restart the role instance to deploy the new application.|Do one of the following:<ul><li>Deploy the upgraded application to the staging environment and then swap the virtual IP (VIP) addresses. This switches the traffic from the version of application in the production environment to the version in the staging environment almost instantly.<br /><br /></li><li>Temporarily configure your application to use two instances, manually upgrade the application on one instance while keeping the other instance running, and then reverting back to a single instance when you have completed the upgrade.</li><ul>
|Modifying the application configuration: When configuration settings are updated and the role instance running the application will restart.|Do one of the following:<ul><li>Specify a configuration change handler that can cancel the restart so that the role instance does not restart automatically.<br /><br /></li><li>Temporarily configure your application to use two instances, modify the configuration of the application one instance while keeping the other instance running, and then reverting back to a single instance when you have completed modifying the configuration settings.</li></ul>|
|Adding, deleting or updating a certificate.|Do one of the following:<ul><li>Deploy the application with certificate change to the staging environment and then swap the virtual IP (VIP) addresses. This switches the traffic from the version of application in the production environment to the version in the staging environment almost instantly.<br /><br /></li><li>Temporarily configure your application to use two instances, change the certificate for the application one instance while keeping the other instance running, and then reverting back to a single instance when you have completed changing the certificate.</li></ul>|
|Role status is “Busy” and StatusCheck event handler cause load balancer to take the instance offline.|Modify your application to not communicate the “Busy” status in the StatusCheck event handler.|
|Application requests a restart by calling RoleEnvironment.RequestRecycle()|Modify your application to not request restarts.|
|Updating the host computer, which causes all VMs on that node to restart.|Make application start time as fast as possible.|
|Azure fabric does service healing to the host computer running the VM for the role instance.|Modify application to be resilient to unexpected restarts.|
|Application crashes|Make the application code more robust by utilizing logging and diagnostic tools like WADS, Intellitrace, and RDP. For more information, see [Troubleshooting and Debugging in Azure Cloud Services](https://msdn.microsoft.com/library/gg465380) and [Common Issues Which Cause Roles to Recycle](https://msdn.microsoft.com/library/gg465402).|

