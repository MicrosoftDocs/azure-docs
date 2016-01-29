<properties
	pageTitle="Subscribe to an offer and then provision a VM in Azure Stack (tenant) | Microsoft Azure"
	description="As a tenant, learn how to subscribe to an offer and then provision a VM in Azure Stack."
	services="azure-stack"
	documentationCenter=""
	authors="ErikjeMS"
	manager="v-kiwhit"
	editor=""/>

<tags
	ms.service="azure-stack"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="01/29/2016"
	ms.author="erikje"/>

# Subscribe to an offer

Now that you've created an offer, test that your tenants can  create a subscription.

1.  On the Azure Stack POC computer, log in to `https://portal.azurestack.local` as [a tenant](azure-stack-connect-azure-stack.md) and click **Get a Subscription**.

    ![](media/azure-stack-subscribe-plan-provision-vm/image1.png)

2.  In the **Display Name** field, type a name for your subscription.

	![](media/azure-stack-subscribe-plan-provision-vm/image2.png)

3.  Click **Offer** and verify that the offer you created is in the **Choose an offer** blade. Click that offer, click **Select**, and then click **OK**.  

	![](media/azure-stack-subscribe-plan-provision-vm/image3.png)

4.  To view the subscription you just created, click **Browse**, and then click **Subscriptions**.  

	![](media/azure-stack-subscribe-plan-provision-vm/image4.png)

After you subscribe to an offer, wait until the subscription state is InSync. Then refresh the portal to see which services are part of the new subscription.

## Provision a virtual machine

Now that you've created a subscription, test that your tenants can provision a virtual machine.

1.  Click **New**, click **Compute**, and then click **WindowsServer-2012-R2-Datacenter**.  

	![](media/azure-stack-subscribe-plan-provision-vm/image5.png)

2.  In the **Basics** blade, type a **Name**, **User name**, **Password**, and **Resource Group,** and then click **OK**.  

	![](media/azure-stack-subscribe-plan-provision-vm/image6.png)

3.  In the **Choose a size** blade, click **A1 Basic**, and then click **Select**.  

	![](media/azure-stack-subscribe-plan-provision-vm/image7.png)

4.  In the **Settings** blade, accept all the defaults and click **OK**.  

	![](media/azure-stack-subscribe-plan-provision-vm/image8.png)

5.  In the Summary blade, click **OK** to create the virtual machine.  

	![](media/azure-stack-subscribe-plan-provision-vm/image9.png)



## Next Steps

[Storage accounts](azure-stack-provision-storage-account.md)
