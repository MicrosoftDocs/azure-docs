<properties
	pageTitle="Subscription and Accounts Guidelines | Microsoft Azure"
	description="Learn about the key design and implementation guidelines for subscriptions and accounts on Azure."
	documentationCenter=""
	services="virtual-machines-linux"
	authors="iainfoulds"
	manager="timlt"
	editor=""
	tags="azure-resource-manager"/>

<tags
	ms.service="virtual-machines-linux"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-linux"
	ms.devlang="na"
	ms.topic="article"
	ms.date="06/22/2016"
	ms.author="iainfou"/>

# Subscription and accounts guidelines

[AZURE.INCLUDE [virtual-machines-linux-infrastructure-guidelines-intro](../../includes/virtual-machines-linux-infrastructure-guidelines-intro.md)] 

This article focuses on understanding how to approach subscription and account management as your environment and user base grows.


## Implementation guidelines for subscriptions and accounts

Decisions:

- What set of subscriptions and accounts do you need to host your IT workload or infrastructure?
- How will you break down the hierachy to fit your organization?

Tasks:

- Define your logical organization hierachy as you would like to manage it from a subscription level.
- Define the accounts required and subscriptions under each account to match this logical hierachy.
- Create the set of subscriptions and accounts using your naming convention.


## Subscriptions and accounts

In order to work with Azure, you need one or more Azure subscriptions. Resources like virtual machines (VMs) or virtual networks exist in of those subscriptions.

- Enterprise customers typically have an Enterprise Enrollment, which is the top-most resource in the hierarchy, and is associated to one or more accounts.
- For consumers and customers without an Enterprise Enrollment, the top-most resource is the account.
- Subscriptions are associated to accounts, and there can be one or more subscriptions per account. Azure records billing information at the subscription level.

Due to the limit of two hierarchy levels on the Account/Subscription relationship, it is important to align the naming convention of accounts and subscriptions to the billing needs. For instance, if a global company uses Azure, they might choose to have one account per region, and have subscriptions managed at the region level.

![](./media/virtual-machines-common-infrastructure-service-guidelines/sub01.png)

For instance, you might use this structure.

![](./media/virtual-machines-common-infrastructure-service-guidelines/sub02.png)

Following the same example, if a region decides to have more than one subscription associated to a particular group, then the naming convention should incorporate a way to encode the extra on either the account or the subscription name. This organization allows massaging billing data to generate the new levels of hierarchy during billing reports.

![](./media/virtual-machines-common-infrastructure-service-guidelines/sub03.png)

The organization could look like this.

![](./media/virtual-machines-common-infrastructure-service-guidelines/sub04.png)

Microsoft provides detailed billing via a downloadable file for a single account or for all accounts in an enterprise agreement. You can process this file, for example, by using Microsoft Excel. This process would ingest the data, partition the resources that encode more than one level of the hierarchy into separate columns, and use a pivot table or PowerPivot to provide dynamic reporting capabilities.


## Next steps

[AZURE.INCLUDE [virtual-machines-linux-infrastructure-guidelines-next-steps](../../includes/virtual-machines-linux-infrastructure-guidelines-next-steps.md)] 