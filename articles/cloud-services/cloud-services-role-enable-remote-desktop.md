<properties 
pageTitle="Set Up a Remote Desktop Connection for a Role in Azure Cloud Services" 
description="How to configure your azure cloud service application to allow remote desktop connections" 
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
ms.date="07/06/2015" 
ms.author="adegeo"/>

# Set Up a Remote Desktop Connection for a Role in Azure
After you create a cloud service that is running your application, you can remotely access a role instance in that application to configure settings or troubleshoot issues. The cloud service must have been configured for remote desktop.

* Need a certificate to enable remote desktop authentication? [Create](cloud-services-certs-create.md) one and configure it below.
* Already have remote desktop setup for your cloud service? [Connect](#remote-into-role-instances) to your cloud service.

## Set up a remote desktop connection for web roles or worker roles
To enable a remote desktop connection for a web role or worker role, you can set up the connection in the service model for the application, or you can use the Azure Management Portal to set up the connection after the instances are running.

### Set up the connection in the service model
The **Imports** element must be added to the service definition file that imports the **RemoteAccess** module and the **RemoteForwarder** module into the service model. When you create an Azure project by using Visual Studio, the files for the service model are created for you.

The service model consists of a [ServiceDefinition.csdef](cloud-services-model-and-package.md#csdef) file and a [ServiceConfiguration.cscfg](cloud-services-model-and-package.md#cscfg) file. The definition file is packaged with the role binaries when the application for the cloud service is prepared for deployment. The ServiceConfiguration.cscfg file is deployed with the application package and is used by Azure to determine how the application should run. 

After you create your project, you can use Visual Studio to [enable a remote desktop connection](https://msdn.microsoft.com/library/gg443832.aspx).

After you configure the connection, the service definition file should be similar to the following example with the `<Imports>` element added.

```xml
<ServiceDefinition name="<name-of-cloud-service>" xmlns="http://schemas.microsoft.com/ServiceHosting/2008/10/ServiceDefinition" schemaVersion="2013-03.2.0">
    <WebRole name="WebRole1" vmsize="Small">
        <Sites>
            <Site name="Web">
                <Bindings>
                    <Binding name="Endpoint1" endpointName="Endpoint1" />
                </Bindings>
            </Site>
        </Sites>
        <Endpoints>
            <InputEndpoint name="Endpoint1" protocol="http" port="80" />
        </Endpoints>
        <Imports>
            <Import moduleName="Diagnostics" />
            <Import moduleName="RemoteAccess" />
            <Import moduleName="RemoteForwarder" />
        </Imports>
    </WebRole>
</ServiceDefinition>
```

The service configuration file should be similar to the following example with the values that you provided when you set up the connection, note the `<ConfigurationSettings>` and `<Certificates>` elements:

```xml
<?xml version="1.0" encoding="utf-8"?>
<ServiceConfiguration serviceName="<name-of-cloud-service>" xmlns="http://schemas.microsoft.com/ServiceHosting/2008/10/ServiceConfiguration" osFamily="3" osVersion="*" schemaVersion="2013-03.2.0">
    <Role name="WebRole1">
        <Instances count="2" />
        <ConfigurationSettings>
            <Setting name="Microsoft.WindowsAzure.Plugins.RemoteAccess.Enabled" value="true" />
            <Setting name="Microsoft.WindowsAzure.Plugins.RemoteAccess.AccountUsername" value="[name-of-user-account]" />
            <Setting name="Microsoft.WindowsAzure.Plugins.RemoteAccess.AccountEncryptedPassword" value="[base-64-encrypted-user-password]" />
            <Setting name="Microsoft.WindowsAzure.Plugins.RemoteAccess.AccountExpiration" value="[certificate-expiration]" />
            <Setting name="Microsoft.WindowsAzure.Plugins.RemoteForwarder.Enabled" value="true" />
        </ConfigurationSettings>
        <Certificates>
            <Certificate name="Microsoft.WindowsAzure.Plugins.RemoteAccess.PasswordEncryption" thumbprint="[certificate-thumbprint]" thumbprintAlgorithm="sha1" />
        </Certificates>
    </Role>
</ServiceConfiguration>
```

When you [package](cloud-services-model-and-package.md#cspkg) and [publish](cloud-services-how-to-create-deploy-portal.md) the application, you must ensure that the **Enable Remote Desktop for all Roles** check box is selected. [This](https://msdn.microsoft.com/library/ff683672.aspx) article provides lists common tasks related to using Visual Studio and Cloud Services.

### Set up the connection on running instances
On the Configure page for your cloud service, you can enable or modify remote desktop connection settings. For more information, see [Configure remote access to role instances](cloud-services-how-to-configure.md).




## Remote into role instances
To access instances of web roles or worker roles, you must use a remote desktop protocol (RDP) file. You can download the file from the Management Portal or you can programmatically retrieve the file.

### Download the RDP file through the management portal

You can use the following steps to retrieve the RDP file from the Management Portal and then use Remote Desktop Connection to connect to the instance using the file:

1.  On the Instances page, select the instance, and then click **Connect** on the command bar.
2.  Click **Save** to save the remote desktop protocol file to your local computer.
3.  Open **Remote Desktop Connection**, click **Show Options**, and then click **Open**.
4.  Browse to the location where you saved the RDP file, select the file, click **Open**, and then click **Connect**. Follow the instructions to complete the connection.

### Use PowerShell to get the RDP file
You can use the [Get-AzureRemoteDesktopFile](https://msdn.microsoft.com/library/azure/dn495261.aspx) cmdlet to retrieve the RDP file. 

### Use Visual Studio to download the RDP file
In Visual Studio, you can use the Server Explorer to create a remote desktop connection.

1.  In Server Explorer, expand the **Azure\\Cloud Services\\[cloud service name]** node.
2.  Expand either **Staging** or **Production**.
3.  Expand the individual role.
4.  Right-click one of the role instances, click **Connect using Remote Desktop...**, and then enter the user name and password.

### Programmatically download the RDP file through the Service Management REST API
You can use the [Download RDP File](https://msdn.microsoft.com/library/jj157183.aspx) REST operation to download the RDP file. You can then use the RDP file with Remote Desktop Connection to access the cloud service.

## Next steps
You may need to [package](cloud-services-model-and-package.md) or [upload (deploy)](cloud-services-how-to-create-deploy-portal.md) your application.
