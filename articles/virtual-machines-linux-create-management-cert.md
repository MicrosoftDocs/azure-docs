<properties linkid="manage-linux-common-tasks-manage-certs" urlDisplayName="Manage certificates" pageTitle="Manage certificates for Linux virtual machines in Azure" metaKeywords="Azure management certs, uploading management certs, Azure Service Management API" description="Learn how to create and upload management certificates for Linux in Azure. The certificate is required if you use the Service Management API." metaCanonical="" services="virtual-machines" documentationCenter="" title="Create management certificates for Linux in Azure" authors="kathydav" solutions="" manager="jeffreyg" editor="tysonn" />

<tags ms.service="virtual-machines" ms.workload="infrastructure-services" ms.tgt_pltfrm="vm-linux" ms.devlang="na" ms.topic="article" ms.date="01/01/1900" ms.author="kathydav" />






#Create management certificates for Linux in Azure

A management certificate is needed when you want to use the Service Management API to interact with the Azure image platform. 

There is already documentation on how to create and manage these certificates at [http://msdn.microsoft.com/en-us/library/azure/gg981929.aspx](http://msdn.microsoft.com/en-us/library/azure/gg981929.aspx). You can also use OpenSSL to create the management certificate.  For more information, see [OpenSSL](http://openssl.org/). However, this documentation  is primarily focused on the use of the Silverlight portal that might not be accessible to all the Linux users. It describes how you will be able to gain access to these certificates and integrate them with our different tools, partners and use them on your own until this functionality is added in the Azure Management Portal. 


##Table of Contents##

* [Obtain a management certificate from the publishsettings file](#createcert)
* [Install a management certificate using the Azure Management Portal](#management)

<h2><a id="publishsettings"></a>How to: Create and upload a management certificate</h2>


We have created an easy way for you to create a management certificate for Azure by visiting: [https://windows.azure.com/download/publishprofile.aspx](https://windows.azure.com/download/publishprofile.aspx)

This web site will ask you to login using your portal credentials and then generate a management certificate  for you that is packaged along with your subscriptionID  on a publishsettings file that you will be asked to download. 

![linuxcredentials](./media/virtual-machines-linux-create-management-cert/linuxcredentials.png)

Make sure you save this file in safe place as you will not be able to recover it and will need to generate a new management certificate. (There is a limit for the total number of certificates that you can use in the system. See the appropriate section on this web site to confirm this.) You can then use this certificate in multiple ways:

###In Visual Studio###

![VSpublish](./media/virtual-machines-linux-create-management-cert/VSpublish.png)


###In the Linux Azure Command Line###

You can import the certificate so that you can use it by running the Azure account import command:

![cmdlinepublish](./media/virtual-machines-linux-create-management-cert/cmdlinepublish.png)

With any other partner or software where you need the tool you will need to extract the management certificate from within the file itself and Base 64 decode it. Some partners such as ScaleXtreme and SUSE Studio will consume the file directly in their current form. 

In order to extract the management certificate you will need to follow this procedure.

You will need to extract from that file the base 64 encoded content between the  quotes after ManagementCertificate.

	?xml version="1.0" encoding="utf-8"?>
	<PublishData>
	  <PublishProfile
	    PublishMethod="AzureServiceManagementAPI"
	    Url="https://management.core.windows.net/"
	    ManagementCertificate="xxxxx">
	    <Subscription
	      Id="8a4a0a51-728e-482e-8daa-c477f03c541d"
	      Name="hjereztest" />
	  </PublishProfile>
	</PublishData>
	
You will need to copy that into a file (e.g.: encodedCert.txt) and then decode it using a base64 decoder:

	base64 -d [encodedCert.txt] > [decodedCert.pfx]

This will provide you a pfx file that you can either convert to other formats using openssl to extract the private key if needed:

 	openssl pkcs12 -in [decodedCert.pfx] -out [cert.pem] -nodes

In Windows you can decode and extract the PFX file using powershell or a free windows base 64 decoder such as [http://www.fourmilab.ch/webtools/base64/base64.zip]()  by running the command 

	base64 -d key.txt ->key.pfx

####Certificate Generation limit####

There is a limit of up to 10 certificates that you can create in the platform with this tool.
Unfortunately there is no way for you to recover the keys that you have generated once they have been generated as we do not save these private keys anywhere in the system.
If you reach the limit of certificates in the system you will need to contact support through the Azure forums in order to have your certificates erased or use a browser that can render the old Silverlight portal to perform these tasks.

####If your private key is compromised ####

If your private key is compromised at any point you will need to use a browser that supports Silverlight to access the old portal and delete the corresponding management certificates on file or contact support through the forums.  
Generating a new certificates is not enough since all 10 certificates are valid and your old compromised key will still be able to access the web site.

<h2><a id="management"></a>Install a management certificate using the Azure Management Portal</h2>

You can create a management certificate in a variety of ways.  For more information about creating certificates, see [Create a Management Certificate for Azure](http://msdn.microsoft.com/library/azure/gg551722.aspx).  After you create the certificate, add it to your subscription in Azure. 

1. Sign in to the Azure Management Portal.

2. In the navigation pane, click **Settings**.

3. Under **Management Certificates**, click **Upload a management certificate**.

4. In **Upload a management certificate**, browse to the certificate file, and then click **OK**.

### Obtain the thumbprint of the certificate and the subscription ID ###

You need the thumbprint of the management certificate that you added and you need the subscription ID to be able to upload the .vhd file to Azure.

1. From the Management Portal, click **Settings**.

2. Under **Management Certificates**, click your certificate, and then record the thumbprint from the **Properties** pane by copying and pasting it to a location where you can retrieve it later.

You also need the ID of your subscription to upload the .vhd file.

1. From the Management Portal, click **All Items**.

2. In the center pane, under **Subscription**, copy the subscription and paste it to a location where you can retrieve it later.

###Providing this information to tools if you generated your own key###

####For CSUPLOAD

1.	Open an Azure SDK Command Prompt window as an administrator.
2.	Set the connection string by using the following command and replacing **Subscriptionid** and **CertThumbprint** with the values that you obtained earlier:


		csupload Set-Connection "SubscriptionID=<Subscriptionid>;CertificateThumbprint=<Thumbprint>;ServiceManagementEndpoint=https://management.core.windows.net"

####For Linux Azure command line tools

You will need to base 64 encode the  PFX file you created using openssl with command:

 		Base64 [file] > [econded file]

You will then need to merge your subscription ID and the base64 encoded pfx into a single file that has the structure: 

		?xml version="1.0" encoding="utf-8"?>
		<PublishData>
		  <PublishProfile
		    PublishMethod="AzureServiceManagementAPI"
		    Url="https://management.core.windows.net/"
		    ManagementCertificate="xxxxx">
		    <Subscription
		      Id="8a4a0a51-728e-482e-8daa-c477f03c541d"
		      Name="hjereztest" />
		  </PublishProfile>
		</PublishData>
		
Where xxxxx is the contents of the [enconded file] you will use to provide the details to the Linux Azure Command Line Tools with the commands:
Azure account import (File)
