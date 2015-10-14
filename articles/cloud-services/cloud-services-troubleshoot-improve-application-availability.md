<properties 
   pageTitle="Improving Application Availability in Azure Cloud Services"
   description=""
   services="cloud-services"
   documentationCenter=""
   authors="kevingw"
   manager="jroley"
   editor=""
   tags="top-support-issue"/>
<tags 
   ms.service="cloud-services"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="tbd"
   ms.date="10/14/2015"
   ms.author="kwill" />

# Improving Application Availability for Cloud Services

For various reasons, the roles instances that host Azure applications are restarted or taken offline, which affects availability if the application is hosted with one role instance. Sometimes this happens because of a problem with the application itself or because it is a part of normal Azure operations, such as service healing or an automatic upgrade to the guest operating system.

## Contact Azure Customer Support

If you need more help at any point in this article, you can contact the Azure experts on [the MSDN Azure and the Stack Overflow forums](http://azure.microsoft.com/support/forums/).

Alternatively, you can also file an Azure support incident. Go to the [Azure Support site](http://azure.microsoft.com/support/options/) and click on **Get Support**. For information about using Azure Support, read the [Microsoft Azure Support FAQ](http://azure.microsoft.com/support/faq/).


## Recommended Method for Improving Availability

The best way to improve availability of your Azure application is to configure your application to use a minimum of two role instances in at least two upgrade domains. By doing this, you ensure better availability for your application by making sure at least one instance remains running in the event that instances are restarted or taken offline as part a normal course of action.

The number of per-role instances in a Azure application is controlled by the Instances setting in the configuration (cscfg) file:

```xml
<Role name="role-name">
    <Instances count="number-of-instances" />    
    <ConfigurationSettings>
        <Setting name="setting-name" value="setting-value" />
    </ConfigurationSettings>
</Role>
```

## Improving availability for deployments with one instance

If you choose to use one role instance for your application, the following sections list the reasons for a role instance to go offline or be restarted and the ways you can mitigate downtime and improve availability of your application.

## Reason: Guest OS auto-upgrade

If the application is configured to be upgraded automatically, then the role instance will be automatically restarted when the guest OS upgrade happens (roughly once a month).

### Solutions
Do one of the following:

* Configure the application for [manual upgrade](cloud-services-how-to-configure.md) and upgrade the instance at off peak hours so that the restart does not impact incoming traffic significantly. Choose the latest Guest OS possible.

* Temporarily configure your application to use two instances, manually upgrade the guest OS on one instance while keeping the other instance running, and then reverting back to a single instance when you have completed the upgrade.

## Reason: Application upgrade

If you upgrade the application in-place (manual or auto-walk), when there is a single upgrade domain and instance, Azure will restart the role instance to deploy the new application.

### Solutions
Do one of the following:

* Deploy the upgraded application to the staging environment and then swap the virtual IP (VIP) addresses. This switches the traffic from the version of application in the production environment to the version in the staging environment almost instantly.

* Temporarily configure your application to use two instances, manually upgrade the application on one instance while keeping the other instance running, and then reverting back to a single instance when you have completed the upgrade.

## Reason: Changed the app config
When configuration settings are updated and the role instance running the application will restart.

### Solutions
Do one of the following:

* Specify a configuration change handler that can cancel the restart so that the role instance does not restart automatically.

* Temporarily configure your application to use two instances, modify the configuration of the application one instance while keeping the other instance running, and then reverting back to a single instance when you have completed modifying the configuration settings.


## Reason: Added, deleted, or updated a certificate 
Changing the certificates associated with a cloud service may cause the role instance to restart.

### Solutions
Do one of the following:

* Deploy the application with certificate change to the staging environment and then swap the virtual IP (VIP) addresses. This switches the traffic from the version of application in the production environment to the version in the staging environment almost instantly.

* Temporarily configure your application to use two instances, change the certificate for the application one instance while keeping the other instance running, and then reverting back to a single instance when you have completed changing the certificate.

## Reason: A busy role and load balancer may take the instance offline 
If the role status is *Busy** and the **StatusCheck** event handler triggers, the load balancer may take the instance offline

### Solution
Modify your application to not communicate the “Busy” status in the StatusCheck event handler.

## Reason: Application requests a restart 
You may have coded your application to call `RoleEnvironment.RequestRecycle()` which would cause the role to restart.

### Solution
Modify your application to not request restarts.

## Reason: Host computer updated
The host computer may have updated which causes all of the virtual machines on that node to restart.

### Solution
Make sure the application start-up time is as fast as possible to minimize an outage.

## Reason: Azure fabric heals the host computer
If the Azure fabric does service healing to the host computer running the VM for the role instance, your role may restart.

### Solution
Modify application to be resilient to unexpected restarts.

## Reason: Application crashes
If your application crashes, it will be restarted.

### Solution
Make the application code more robust by utilizing logging and diagnostic tools like WADS, Intellitrace, and RDP. Also, see [Common Issues Which Cause Roles to Recycle](cloud-services-troubleshoot-common-issues-which-cause-roles-recycle.md) which may have a solution to your problem.


## Next steps

View more [troubleshooting articles](/documentation/articles/?tag=top-support-issue&service=cloud-services) for cloud services.

