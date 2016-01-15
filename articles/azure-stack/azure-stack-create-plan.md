<properties
	pageTitle="Create a plan (service administrator)"
	description="Create a plan (service administrator)"
	services="azure-stack" 
	documentationCenter=""
	authors="v-anpasi"
	manager="v-kiwhit"
	editor=""/>

<tags
	ms.service="multiple"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="01/04/2016"
	ms.author="v-anpasi"/>

# Create a plan (service administrator)

In this step, you’ll create a plan that includes the compute, network, and storage resource providers. This will give subscribers to the plan the ability to provision virtual machines.

1.  In an internet browser, navigate to https://portal.azurestack.local.

2.  To sign into the Azure Stack Portal as a service administrator, enter your service administrator credentials (this is the account created during step 5 of the [Run the PowerShell script](azure-stack-run-powershell-script.md) section), and then click **Sign in**.

    Since you signed in as a service administrator, the portal enables administration operations, such as creating offers, plans, and managing users.

3.  To create a plan and offer that tenants can subscribe to, click **New**.

    ![](media/azure-stack-create-plan/image1.png)

4.  In the Create blade, click **Tenant Offers and Plans**, and then click **Plan**.

	![](media/azure-stack-create-plan/image2.png)

5.  Fill in **Display Name** and **Resource Name**.

	![](media/azure-stack-create-plan/image3.png)

6.  Select or create a new **Resource Group** as a container for the plan. This is required to support RBAC. By default, all plans and offers will go into a resource group called OffersAndPlans.

7.  Select **Offered Services**, select all three providers (**Compute Provider**, **Storage Provider**, and **Network Provider**) and then click **Select**.

	![](media/azure-stack-create-plan/image4.png)

8.  Click **Microsoft.Compute**, and then click **Needs Configuration**.

	![](media/azure-stack-create-plan/image5.png)

9.  In the **Set Quotas** blade, accept all the defaults, click **OK**, and then click **OK** again. **Note**: for the December Technical Preview 1 release, quotas are only enforced for the Storage RP.

    ![](media/azure-stack-create-plan/image6.png)

10. Click **Microsoft.Network**, then click **Needs Configuration**.

	![](media/azure-stack-create-plan/image7.png)

11. In the **Set Quotas** blade, select all the check boxes, click **OK**, then click **OK** again. **Note**: for the December Technical Preview 1 release, quotas are only enforced for the Storage RP.

	![](media/azure-stack-create-plan/image8.png)

12. Click **Microsoft.Storage**, click **Needs Configuration**, and then in the **Set Quotas** blade, accept all the defaults, click **OK**, click **OK** again, and then click **Create** to create the plan. **Note**: for the December Technical Preview 1 release, quotas are only enforced for the Storage RP.

	![](media/azure-stack-create-plan/image9.png)

13. Here is the view of the plan after you create it. You can view notifications by clicking the bell icon at the top right.

    ![](media/azure-stack-create-plan/image10.png)
