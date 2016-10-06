<properties 
	pageTitle="How to configure a cloud service (portal) | Microsoft Azure" 
	description="Learn how to configure cloud services in Azure. Learn to update the cloud service configuration and configure remote access to role instances. These examples use the Azure portal." 
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
	ms.date="07/27/2016"
	ms.author="adegeo"/>

# How to Configure Cloud Services

> [AZURE.SELECTOR]
- [Azure portal](cloud-services-how-to-configure-portal.md)
- [Azure classic portal](cloud-services-how-to-configure.md)

You can configure the most commonly used settings for a cloud service in the Azure portal. Or, if you like to update your configuration files directly, download a service configuration file to update, and then upload the updated file and update the cloud service with the configuration changes. Either way, the configuration updates are pushed out to all role instances.

You can also manage the instances of your cloud service roles, or remote desktop into them.

Azure can only ensure 99.95 percent service availability during the configuration updates if you have at least two role instances for every role. That enables one virtual machine to process client requests while the other is being updated. For more information, see [Service Level Agreements](https://azure.microsoft.com/support/legal/sla/).

## Change a cloud service

After opening the [Azure portal](https://portal.azure.com/), navigate to your cloud service. From here you manage many aspects of it. 

![Settings Page](./media/cloud-services-how-to-configure-portal/cloud-service.png)

The **Settings** or **All settings** links will open up the **Settings** blade where you can change the **Properties**, change the **Configuration**, manage the **Certificates**, setup **Alert rules**, and manage the **Users** who have access to this cloud service.

![Azure cloud service settings blade](./media/cloud-services-how-to-configure-portal/cs-settings-blade.png)

>[AZURE.NOTE]
>The operating system used for the cloud service cannot be changed using the **Azure portal**, you can only change this setting through the [Azure classic portal](http://manage.windowsazure.com/). This is detailed [here](cloud-services-how-to-configure.md#update-a-cloud-service-configuration-file).

## Monitoring

You can add alerts to your cloud service. Click **Settings** > **Alert Rules** > **Add alert**. 

![](./media/cloud-services-how-to-configure-portal/cs-alerts.png)

From here you can setup an alert. With the **Mertic** drop down box, you can setup an alert for the following types of data.

- Disk read
- Disk write
- Network in
- Network out
- CPU percentage 

![](./media/cloud-services-how-to-configure-portal/cs-alert-item.png)

### Configure monitoring from a metric tile

Instead of using **Settings** > **Alert Rules**, you can click on one of the metric tiles in the **Monitoring** section of the **Cloud service** blade.

![Cloud Service Monitoring](./media/cloud-services-how-to-configure-portal/cs-monitoring.png)

From here you can customize the chart used with the tile, or add an alert rule.


## Reboot, reimage, or remote desktop

At this time you cannot configure remote desktop using the **Azure portal**. However, you can set it up through the [Azure classic portal](cloud-services-role-enable-remote-desktop.md), [PowerShell](cloud-services-role-enable-remote-desktop-powershell.md), or through [Visual Studio](../vs-azure-tools-remote-desktop-roles.md). 

First, click on the cloud service instance.

![Cloud Service Instance](./media/cloud-services-how-to-configure-portal/cs-instance.png)

From the blade that opens uou can initiate a remote desktop connection, remotely reboot the instance, or remotely reimage (start with a fresh image) the instance.

![Cloud Service Instance Buttons](./media/cloud-services-how-to-configure-portal/cs-instance-buttons.png)



## Reconfigure your .cscfg

You may need to reconfigure you cloud service through the [service config (cscfg)](cloud-services-model-and-package.md#cscfg) file. First you need to download your .cscfg file, modify it, then upload it.

1. Click on the **Settings** icon or the **All settings** link to open up the **Settings** blade.

    ![Settings Page](./media/cloud-services-how-to-configure-portal/cloud-service.png)

2. Click on the **Configuration** item.

    ![Configuration Blade](./media/cloud-services-how-to-configure-portal/cs-settings-config.png)

3. Click on the **Download** button.

    ![Download](./media/cloud-services-how-to-configure-portal/cs-settings-config-panel-download.png)

4. After you update the service configuration file, upload and apply the configuration updates:

    ![Upload](./media/cloud-services-how-to-configure-portal/cs-settings-config-panel-upload.png) 
    
5. Select the .cscfg file and click **OK**.

			
## Next steps

* Learn how to [deploy a cloud service](cloud-services-how-to-create-deploy-portal.md).
* Configure a [custom domain name](cloud-services-custom-domain-name-portal.md).
* [Manage your cloud service](cloud-services-how-to-manage-portal.md).
* Configure [ssl certificates](cloud-services-configure-ssl-certificate-portal.md).