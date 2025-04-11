---
title: Create a Community
description: Create a Community.
author: jadean-msft
ms.author: jadean
# ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 04/08/2025
---

# Create a Community in the Azure portal

[Communities](./what-community.md) are isolated hub networks that can securely and logically group several Enclaves together for governance, management, and security purposes. A Community Owner can enable other Communities or on-premises networks to connect through Transit Hubs or Endpoints.

## Prerequisites
To access Azure Virtual Enclaves, you need an Azure subscription. If you don't already have a subscription, create a [free account](https://azure.microsoft.com/free/) and sign-in to the Azure portal at https://portal.azure.combefore you begin.

## Create community

1. Enter `Azure Virtual Enclaves` in the search.
2. Under `Services`, select `Azure Virtual Enclaves`. You will be directed to the Azure Virtual Enclaves homepage.

![Screenshot showing the Azure portal homepage for Azure Virtual Enclaves with the Create a Community button.](./media/azure-virtual-enclaves-homepage.png)

3. Select the `Create a community` button. The community deployment can take around 25 minutes to complete.
4. Enter the basic details for your community:
   - **Subscription**: Select an Azure Subscription
   - **Resource Group**: Create a new or select an existing Resource group
   - **Community**: Name of the Community (for example `My-Community`)
   - **Region**: Azure region the Community will be created in
   - **Community Address Space**: IP Address space of the Community (for example `10.0.0.0/16`)
   > [!NOTE]
   > `192.168.0.0/16`, `192.0.0.0/8`, `192.128.0.0/9`, or any other range that includes `192.168.x.x` addresses are reserved for the platform to manage enclaves deployed within a Community. Users shouldn't create Communities with any of these address spaces as that would create overlapping conflicts with the platform-managed enclave management IP ranges.
   
   ![Screenshot showing the create Community screen with the basics inputs for the tutorial environment.](./media/tutorial-step-one-create-community-screen-basics-input.png)

5. Select `Next`.
6. Customize your Policy Management settings as needed.

![Screenshot of Policy Management page where a user can manage policies on a selection of Azure services.](./media/community-creation-governance.png)


> [!NOTE]
> 
> In the context of governance for Communities, the following settings can be specified for each service:
> - Enforcement: This setting determines whether the rules defined for a service are actively enforced. When enforcement is enabled, any action that violates the rules will be blocked or flagged.
> - Audit Mode: This option allows for the monitoring of services without actively enforcing the rules. It's useful for understanding the change to potential governance policies by logging all actions that would violate the rules if enforcement were > enabled.
> - Options: This setting declares whether the service is:
> - - Allow: The service is allowed in the policies
> - - Deny: The service isn't allowed in the policies
> - - ExceptionOnly: The service isn't allowed in the policies, but manual [Policy Exemptions](../governance/policy/concepts/exemption-structure.md) can be made.

7. Select `Next`.
8. Enter any [Tags](../azure-resource-manager/management/tag-resources.md) for your community.
9. Select `Next`.
10. Select `Review + create`, ensure the details for your community are correct, and select `Create`.

![Screenshot showing created community on its overview page.](./media/tutorial-step-one-community-overview-page.png)

## References
- [What is a Community?](./what-community.md)
- [Create an enclave](./create-enclave-azure-portal.md)
- [Best practices](./best-practices.md)
- [Name resolution for resources in Azure Virtual Networks](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md)
