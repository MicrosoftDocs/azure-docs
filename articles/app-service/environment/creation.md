---
title: Create an App Service Environment
description: Learn how to create an App Service Environment.
author: madsd
ms.topic: article
ms.date: 11/15/2021
ms.author: madsd
---

# Create an App Service Environment
> [!NOTE]
> This article is about the App Service Environment v3 which is used with Isolated v2 App Service plans
> 

The [App Service Environment (ASE)][Intro] is a single tenant deployment of the App Service that injects into your Azure Virtual Network (VNet). A deployment of an ASE will require use of one subnet. This subnet can't be used for anything else other than the ASE. 

## Before you create your ASE

After your ASE is created, you can't change:

- Location
- Subscription
- Resource group
- Azure Virtual Network (VNet) used
- Subnets used
- Subnet size
- Name of your ASE

The subnet needs to be large enough to hold the maximum size that you'll scale your ASE. Pick a large enough subnet to support your maximum scale needs since it can't be changed after creation. The recommended size is a /24 with 256 addresses.

## Deployment considerations

There are two important things that need to be thought out before you deploy your ASE.

- VIP type
- deployment type

There are two different VIP types, internal and external. With an internal VIP, your apps will be reached on the ASE at an address in your ASE subnet and your apps are not on public DNS. During creation in the portal, there is an option to create an Azure private DNS zone for your ASE. With an external VIP, your apps will be on a public internet facing address and your apps are in public DNS. 

There are three different deployment types;

- single zone
- zone redundant
- host group

The single zone ASE is available in all regions where ASEv3 is available. When you have a single zone ASE, you have a minimum App Service plan instance charge of one instance of Windows Isolated v2. As soon as you have one or more instances, then that charge goes away. It is not an additive charge.

In a zone redundant ASE, your apps spread across three zones in the same region. The zone redundant ASE is available in a subset of ASE capable regions primarily limited by the regions that support availability zones. When you have zone redundant ASE, the smallest size for your App Service plan is three instances. That ensures that there is an instance in each availability zone. App Service plans can be scaled up one or more instances at a time. Scaling does not need to be in units of three, but the app is only balanced across all availability zones when the total instances are multiples of three. A zone redundant ASE has triple the infrastructure and is made with zone redundant components so that if even two of the three zones go down for whatever reason, your workloads remain available. Due to the increased system need, the minimum charge for a zone redundant ASE is nine instances. If you have less than nine total App Service plan instances in your ASEv3, the difference will be charged as Windows I1v2. If you have nine or more instances, there is no added charge to have a zone redundant ASE. To learn more about zone redundancy, read [Regions and Availability zones](./overview-zone-redundancy.md).

In a host group deployment, your apps are deployed onto a dedicated host group. The dedicated host group is not zone redundant. Dedicated host group deployment enables your ASE to be deployed on dedicated hardware. There is no minimum instance charge for use of an ASE on a dedicated host group, but you do have to pay for the host group when provisioning the ASE. On top of that you pay a discounted App Service plan rate as you create your plans and scale out. There are a finite number of cores available with a dedicated host deployment that are used by both the App Service plans and the infrastructure roles. Dedicated host deployments of the ASE can't reach the 200 total instance count normally available in an ASE. The number of total instances possible is related to the total number of App Service plan instances plus the load based number of infrastructure roles.

## Creating an ASE in the portal

1. To create an ASE, search the marketplace for **App Service Environment v3**.

2. Basics:  Select the Subscription, select or create the Resource Group, and enter the name of your ASE.  Select the type of Virtual IP type. If you select Internal, your inbound ASE address will be an address in your ASE subnet. If you select External, your inbound ASE address will be a public internet facing address. The ASE name will be also used for the domain suffix of your ASE. If your ASE name is *contoso* and you have an Internal VIP ASE, then the domain suffix will be *contoso.appserviceenvironment.net*. If your ASE name is *contoso* and you have an external VIP, the domain suffix will be *contoso.p.azurewebsites.net*. 

    ![App Service Environment create basics tab](./media/creation/creation-basics.png)

3. Hosting: Select *Enabled* or *Disabled* for Host Group deployment. Host Group deployment is used to select dedicated hardware deployment. If you select Enabled, your ASE will be deployed onto dedicated hardware. When you deploy onto dedicated hardware, you are charged for the entire dedicated host during ASE creation and then a reduced price for your App Service plan instances.

    ![App Service Environment hosting selections](./media/creation/creation-hosting.png)

4. Networking:  Select or create your Virtual Network, select or create your subnet. If you are creating an internal VIP ASE, you can configure Azure DNS private zones to point your domain suffix to your ASE. Details on how to manually configure DNS are in the DNS section under [Using an App Service Environment][UsingASE].

    ![App Service Environment networking selections](./media/creation/creation-networking.png)

5. Review and Create: Check that your configuration is correct and select create. Your ASE can take up to nearly two hours to create. 

After your ASE creation completes, you can select it as a location when creating your apps. To learn more about creating apps in your new ASE or managing your ASE, read [Using an App Service Environment][UsingASE]

## Dedicated hosts

The ASE is normally deployed on VMs that are provisioned on a multi-tenant hypervisor. If you need to deploy on dedicated systems, including the hardware, you can provision your ASE onto dedicated hosts. Dedicated hosts come in a pair to ensure redundancy. Dedicated host-based ASE deployments are priced differently than normal. There is a charge for the dedicated host and then another charge for each App Service plan instance. Deployments on host groups are not zone redundant. To deploy onto dedicated hosts, select **enable** for host group deployment on the Hosting tab.

<!--Links-->
[Intro]: ./overview.md
[UsingASE]: ./using.md
