<properties authors="kathydav" editor="tysonn" manager="timlt" /> 


#How to Connect Virtual Machines in a Cloud Service

When you create a virtual machine, a cloud service is automatically created to contain the machine. You can create multiple virtual machines within the same cloud service so virtual machines can communicate with each other. 

> [AZURE.NOTE] When VMs are in the same cloud service, you also can load balance them and manage their availability, which both require additional steps. For details, see [Load balancing virtual machines](../../articles/load-balance-virtual-machines/) and [Manage the availability of virtual machines](../../articles/manage-availability-virtual-machines/). 

First, you'll need to create a virtual machine with a new cloud service. Then you'll create additional virtual machines in the same cloud service. This 'connects' them. 

1. Create the first virtual machine using the steps in [How to create a custom virtual machine](../../articles/virtual-machines-create-custom/).

2. Follow the same basic process to create the other virtual machines, except you'll add them to the cloud service instead of creating a cloud service. For example, if you created a cloud service named *EndpointTest*, choose that service. The follow graphic shows this:

	![Add a virtual machine to an existing cloud service](./media/howto-connect-vm-cloud-service/Connect-VM-to-CS.png)

14. Complete the rest of the fields on this page and the next, then click the check mark to create the connected virtual machine.

#Resources

After you create a virtual machine, it's a good idea to add a data disk so your services and workloads have a location to store data. See one of the following:

[How to Attach a Data Disk to a Linux Virtual Machine](http://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-how-to-attach-disk/)

[How to Attach a Data Disk to a Windows Virtual Machine](http://azure.microsoft.com/en-us/documentation/articles/storage-windows-attach-disk/)


