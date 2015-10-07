<properties 
   pageTitle="How to install Apache Qpid Proton-C on a Linux VM | Microsoft Azure"
   description="How to create a CentOS Linux VM using Azure Virtual Machines and how to build and install the Apache Qpid Proton-C library."
   services="service-bus"
   documentationCenter="na"
   authors="sethmanheim"
   manager="timlt"
   editor="tysonn" /> 
<tags 
   ms.service="service-bus"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="10/07/2015"
   ms.author="sethm" />

# Install Apache Qpid Proton-C on an Azure Linux VM

[AZURE.INCLUDE [service-bus-selector-amqp](../../includes/service-bus-selector-amqp.md)]

This section shows how to create a CentOS Linux VM using Azure Virtual Machines and how to download, build and install the Apache Qpid Proton-C library along with the Python and PHP language bindings. After completing these steps, you will be able to run the Python and PHP samples included with this guide.

The first step is performed using the [Azure portal][]. The following screen shot shows how a CentOS VM named "scott-centos" is created:

![Proton on a Azure Linux VM][0]

After provisioning, the portal displays the following:

![Proton on a Azure Linux VM][1]

In order to log on to the computer, you must know the endpoint port for SSH. You can obtain this value from the portal by selecting the newly created VM and clicking on the **Endpoints** tab. The following screen shot shows that the public SSH port for this computer is 57146.

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
	[azureuser@this-user ~]$ wget http://www.bizdirusa.com/mirrors/apache/qpid/proton/0.4/qpid-proton-0.4.tar.gz 
		--2013-05-23 21:27:55-- http://www.bizdirusa.com/mirrors/apache/qpid/proton/0.4/qpid-proton-0.4.tar.gz 
		Resolving www.bizdirusa.com... 205.186.175.195 
		Connecting to www.bizdirusa.com|205.186.175.195|:80... connected. 
		HTTP request sent, awaiting response... 200 OK 
		Length: 456693 (446K) [application/x-gzip] 
		Saving to: âqpid-proton-0.4.tar.gzâ

		100%[======================================\>] 456,693 --.-K/s in 0.06s

		2015-05-23 21:27:55 (6.84 MB/s) - qpid-proton-0.4.tar.gz
	```

1.  Extract the Proton code from the distribution archive:

	```
	tar xvfz qpid-proton-0.4.tar.gz
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

Ready to learn more? Visit the following links:

- [Service Bus AMQP overview]
- [Using Service Bus from .NET with AMQP]
- [Using Service Bus from Java with AMQP]
- [Using Service Bus from Python with AMQP]
- [Using Service Bus from PHP with AMQP]

[Service Bus AMQP overview]: service-bus-amqp-overview.md
[0]: ./media/service-bus-amqp-apache/amqp-apache-1.png
[1]: ./media/service-bus-amqp-apache/amqp-apache-2.png
[2]: ./media/service-bus-amqp-apache/amqp-apache-3.png
[3]: ./media/service-bus-amqp-apache/amqp-apache-4.png

[Azure portal]: http://manage.windowsazure.com
[Using Service Bus from .NET with AMQP]: service-bus-amqp-dotnet.md
[Using Service Bus from Java with AMQP]: service-bus-amqp-java.md
[Using Service Bus from Python with AMQP]: service-bus-amqp-python.md
[Using Service Bus from PHP with AMQP]: service-bus-amqp-php.md


