    <properties
	pageTitle="Create a DevTest Lab | Microsoft Azure"
	description="Create a new DevTest Lab lab for virtual machines"
	services="devtest-lab,virtual-machines"
	documentationCenter="na"
	authors="tomarcher"
	manager="douge"
	editor=""/>

<tags
	ms.service="devtest-lab"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="04/19/2016"
	ms.author="tarcher"/>

# Create an Azure DevTest Lab

## Prerequisites

To create a DevTest Lab, you will need:

- An Azure subscription. To learn about Azure purchase options, see [How to buy Azure](https://azure.microsoft.com/pricing/purchase-options/) or [Free one-month trial](https://azure.microsoft.com/pricing/free-trial/). You must be the owner of the subscription to create the lab.
- An Azure Resource Group for the lab. See [Azure Resource Manager Overview](../resource-group-overview.md) and [Azure Role-based Access Control](../active-directory/role-based-access-control-configure.md).


## Create a lab

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Tap **Browse**.

1. Tap **DevTest Labs** from the list.

1. On the **DevTest Labs** blade, tap **Add**.

    ![Add a DevTest Lab](./media/devtest-lab-create-lab/add-lab-button.png)

1. On the **Create a DevTest Lab** blade:

    1. Enter a **Lab Name** for the new lab.
    1. Select the **Subscription** to associate with the lab.
    1. Select a **Location** in which to store the lab.
    1. Tap **Create**.

    ![Create a DevTest Lab blade](./media/devtest-lab-create-lab/create-devtestlab-blade.png)

## Next steps

Once you've created your lab, here are some next steps to consider:

- [Secure access to a DevTest Lab](devtest-lab-add-devtest-user.md).

- [Set lab policies](devtest-lab-set-lab-policy.md).

- [Create a lab template](devtest-lab-create-template.md).

- [Create custom artifacts for your VMs](devtest-lab-artifact-author.md).

- [Add a VM with artifacts to an Azure DevTest Lab](devtest-lab-add-vm-with-artifacts.md).
