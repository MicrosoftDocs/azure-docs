<properties 
    pageTitle="How to install Apache Qpid Proton-C on a Linux VM | Microsoft Azure"
    description="How to create a CentOS Linux VM using Azure Virtual Machines and how to build and install the Apache Qpid Proton-C library."
    services="service-bus"
    documentationCenter="na"
    authors="sethmanheim"
    manager="timlt"
    editor="" /> 
<tags 
    ms.service="service-bus"
    ms.devlang="na"
    ms.topic="article"
    ms.tgt_pltfrm="na"
    ms.workload="na"
    ms.date="05/06/2016"
    ms.author="sethm" />

# Install Apache Qpid Proton-C on an Azure Linux VM

[AZURE.INCLUDE [service-bus-selector-amqp](../../includes/service-bus-selector-amqp.md)]

This section shows how to create a CentOS Linux VM using Azure Virtual Machines and how to download, build and install the Apache Qpid Proton-C library along with the Python and PHP language bindings. After completing these steps, you will be able to run the Python and PHP samples included with this guide.

The first step is performed using the [Azure classic portal][]. The following screen shot shows how a CentOS VM named "scott-centos" is created:

![Proton on a Azure Linux VM][0]

After provisioning, the portal displays the following:

![Proton on a Azure Linux VM][1]

In order to log on to the computer, you must know the endpoint port for SSH. You can obtain this value from the [Azure classic portal][] by selecting the newly created VM and clicking on the **Endpoints** tab. The following screen shot shows that the public SSH port for this computer is 57146.

![Proton on a Azure Linux VM][2]

You can now connect to the computer using SSH. This example uses the PuTTY tool, as in the following screen shot:

![Proton on a Azure Linux VM][3]

For the Python and PHP apps, this example uses the Proton client libraries from Apache. These libraries are available for download from [http://qpid.apache.org/download.html](http://qpid.apache.org/download.html). The Readme file in the distribution package explains the steps required to install the dependencies and build Proton. Here's a summary of the steps:

1.  Edit the yum config file (/etc/yum.conf) and comment out the exclusion for updates to kernel headers (\# exclude=kernel\*). This is necessary to install the gcc compiler.

2.  Install the prerequisite packages:

	```
	# required dependencies 
	yum install gcc cmake libuuid-devel
	
	# dependencies needed for ssl support
	yum install openssl-devel
	
	# dependencies needed for bindings
	yum install swig python-devel ruby-devel php-devel java-1.6.0-openjdk
	
	# dependencies needed for python docs
	yum install epydoc
	```

1.  Download the Proton library:

	```
	[azureuser@this-user ~]$ wget http://apache.panu.it/qpid/proton/0.9/qpid-proton-0.9.tar.gz
	--2016-04-17 14:45:03--  http://apache.panu.it/qpid/proton/0.9/qpid-proton-0.9.tar.gz
	Resolving apache.panu.it (apache.panu.it)... 81.208.22.71
	Connecting to apache.panu.it (apache.panu.it)|81.208.22.71|:80... connected.
	HTTP request sent, awaiting response... 200 OK
	Length: 868226 (848K) [application/x-gzip]
	Saving to: ‘qpid-proton-0.9.tar.gz’
	
	qpid-proton-0.9.tar.gz                               
	
	100%[====================================================================================================================>] 847.88K   102KB/s    in 8.4s    
	
	2016-04-17 14:45:12 (101 KB/s) - ‘qpid-proton-0.9.tar.gz’ saved [868226/868226]
	```

1.  Extract the Proton code from the distribution archive:

	```
	tar xvfz qpid-proton-0.9.tar.gz
	```

1.  Build and install the code using the following steps, taken from the Readme file:

	```
	From the directory where you found this README file:	
	
	mkdir build cd build
			
	# Set the install prefix. You may need to adjust depending on your		
	# system.		
	cmake -DCMAKE\_INSTALL\_PREFIX=/usr ..
			
	# Omit the docs target if you do not wish to build or install		
	# documentation.		
	make all docs
			
	# Note that this step will require root privileges.		
	make install
	```

After performing these steps, Proton is installed on the computer and ready for use.

## Next steps

Ready to learn more? Visit the following link:

- [Service Bus AMQP overview][]

[Service Bus AMQP overview]: service-bus-amqp-overview.md
[0]: ./media/service-bus-amqp-apache/amqp-apache-1.png
[1]: ./media/service-bus-amqp-apache/amqp-apache-2.png
[2]: ./media/service-bus-amqp-apache/amqp-apache-3.png
[3]: ./media/service-bus-amqp-apache/amqp-apache-4.png

[Azure classic portal]: http://manage.windowsazure.com


