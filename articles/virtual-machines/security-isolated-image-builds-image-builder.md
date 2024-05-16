---
title: Isolated Image Builds for Azure VM Image Builder
description: Isolated Image Builds is achieved by transitioning core process of VM image customization/validation from shared infrastructure to dedicated Azure Container Instances resources in your subscription providing compute and network isolation.
ms.date: 02/13/2024
ms.topic: sample
author: kof-f
ms.author: jushiman
ms.reviewer: mattmcinnes
ms.service: virtual-machines
ms.subservice: image-builder
---

# Isolated Image Builds for Azure VM Image Builder

Isolated Image Builds is a feature of Azure VM Image Builder (AIB). It transitions the core process of VM image customization/validation from shared platform infrastructure to dedicated Azure Container Instances (ACI) resources in your subscription, providing compute and network isolation.

## Advantages of Isolated Image Builds

Isolated Image Builds enables defense-in-depth by limiting network access of your build VM to just your subscription. Isolated Image Builds also provides you with more transparency by allowing your inspection of the processing done by AIB to customize/validate your VM image. Further, Isolated Image Builds eases viewing of live build logs. Specifically:

1. **Compute Isolation:** Isolated Image Builds performs major portion of image building processing in ACI resources in your subscription instead of on AIB's shared platform resources. ACI provides hypervisor isolation for each container group to ensure containers run in isolation without sharing a kernel.
2. **Network Isolation:**  Isolated Image Builds removes all direct network WinRM/ssh communication between your build VM and backend components of the AIB service.
    - If you're provisioning an AIB template without your own subnet for build VM, then a Public IP Address resource is no more provisioned in your staging resource group at image build time.
    - If you're provisioning an AIB template with an existing subnet for build VM, then a Private Link based communication channel is no more setup between your build VM and AIB's backend platform resources. Instead, the communication channel is set up between the ACI and the build VM resources - both of which reside in the staging resource group in your subscription.
    - Starting API version 2024-02-01, you can specify a second subnet for deploying the ACI in addition to the subnet for build VM. If specified, AIB deploys ACI on this subnet and there's no need for AIB to set up the Private Link based communication channel between the ACI and the build VM. For more information about the second subnet, see the section [here](./security-isolated-image-builds-image-builder.md#bring-your-own-build-vm-subnet-and-bring-your-own-aci-subnet). 

3. **Transparency:** AIB is built on HashiCorp [Packer](https://www.packer.io/). Isolated Image Builds executes Packer in the ACI in your subscription, which allows you to inspect the ACI resource and its containers. Similarly, having the entire network communication pipeline in your subscription allows you to inspect all the network resources, their settings, and their allowances.
4. **Better viewing of live logs:** AIB writes customization logs to a storage account in the staging resource group in your subscription. Isolated Image Builds provides with another way to follow the same logs directly in the Azure portal, which can be done by navigating to AIB's container in the ACI resource.

## Network topologies
Isolated Image Builds deploys the ACI and the build VM both in the staging resource group in your subscription. For AIB to customize/validate your image, container instances running in the ACI need to have a network path to the build VM. Based on your custom networking needs and policies, you can configure AIB to use different network topologies for this purpose:
### Don't bring your own Build VM subnet
- You can select this topology by not specifying the `vnetConfig` field in the Image Template or by specifying the field but without `subnetId` and `containerInstanceSubnetId` subfields.
- In this case, AIB deploys a Virtual Network in the staging resource group along with two subnets and Network Security Groups (NSGs). One of the subnets is used to deploy the ACI, while the other subnet is used to deploy the Build VM. NSGs are set up to allow communication between the two subnets.
- AIB doesn't deploy a Public IP resource or a Private link based communication pipeline in this case.
### Bring your own Build VM subnet but don't bring your own ACI subnet
- You can select this topology by specifying the `vnetConfig` field along with the `subnetId` subfield, but not the `containerInstanceSubnetId` subfield in the Image Template.
- In this case, AIB deploys a temporary Virtual Network in the staging resource group along with two subnets and Network Security Groups (NSGs). One of the subnets is used to deploy the ACI, while the other subnet is used to deploy the Private Endpoint resource. The build VM is deployed in your specified subnet. A Private link based communication pipeline consisting of a Private Endpoint, Private Link Service, Azure Load Balancer, and Proxy Virtual Machine is also deployed in the staging resource group to facilitate communication between the ACI subnet and your build VM subnet.
### Bring your own Build VM subnet and bring your own ACI subnet
- You can select this topology by specifying the `vnetConfig` field along with the `subnetId` & `containerInstanceSubnetId` subfields in the Image Template. This option (and subfield `containerInstanceSubnetId`) is available starting API version 2024-02-01. You can also update your existing templates to use this topology.
- In this case, AIB deploys build VM to the specified build VM subnet and ACI to the specified ACI subnet.
- AIB doesn't deploy any of the networking resources in the staging resource group including Public IP, Virtual Network, subnets, Network Security Groups, Private Endpoint, Private Link Service, Azure Load Balancer, and Proxy Virtual Machine. This topology can be used if you have quota restrictions or policies disallowing deployment of these resources. 
- The ACI subnet must meet certain conditions to allow its use with Isolated Image Builds.

You can see details about these fields in the [template reference](./linux/image-builder-json.md#vnetconfig-optional). Networking options are discussed in detail [here](./linux/image-builder-networking.md).

## Backward compatibility

Isolated Image Builds is a platform level change and doesn't affect AIB's interfaces. So, your existing Image Template and Trigger resources continue to function and there's no change in the way you deploy new resources of these types. You need to create new templates or update existing templates if you want to use [the network topology allowing bringing your own ACI subnet](./security-isolated-image-builds-image-builder.md#bring-your-own-build-vm-subnet-and-bring-your-own-aci-subnet).

Your image builds are automatically migrated to Isolated Image Builds and you need to take no action to opt in. Also, customization logs continue to be available in the storage account.

Depending on the network topology specified in the Image Template, you might observe a few new resources temporarily appear in the staging resource group (for example, ACI, Virtual Network, Network Security Group, and Private Endpoint) while some other resources no longer appear (for example, Public IP Address). As earlier, these temporary resources exist only during the build and AIB deletes them thereafter.

> [!IMPORTANT] 
> Make sure your subscription is registered for `Microsoft.ContainerInstance provider`: 
> - Azure CLI: `az provider register -n Microsoft.ContainerInstance`
> - PowerShell: `Register-AzResourceProvider -ProviderNamespace Microsoft.ContainerInstance`
>
> After successfully registering your subscription, make sure there are no Azure Policies in your subscription that deny deployment of ACI resoures. Policies allowing only a restricted set of resource types not including ACI would cause Isolated Image Builds to fail. 
>
> Ensure that your subscription also has a sufficient [quota of resources](../container-instances/container-instances-resource-and-quota-limits.md) required for deployment of ACI resources.
>

> [!IMPORTANT]
> Depending on the network topology specified in the Image Template, AIB may need to deploy temporary networking related resources in the staging resource group in your subscription. Ensure that no Azure Policies deny the deployment of such resources (Virtual Network with Subnets, Network Security Group, Private endpoint) in the resource group.
>
> If you have Azure Policies applying DDoS protection plans to any newly created Virtual Network, either relax the Policy for the resource group or ensure that the Template Managed Identity has permissions to join the plan. Alternatively, you can use the network topology that does not require deployment of a new Virtual Network by AIB.

> [!IMPORTANT]
> Make sure you follow all [best practices](image-builder-best-practices.md) while using AIB.

> [!NOTE]
> AIB is in the process of rolling this change out to all locations and customers. Some of these details (especially around deployment of new Networking related resources) might change as the process is fine-tuned based on service telemetry and feedback. For any errors, please refer to the [troubleshooting guide](./linux/image-builder-troubleshoot.md#troubleshoot-build-failures).

## Next steps

- [Azure VM Image Builder overview](./image-builder-overview.md)
- [Getting started with Azure Container Instances](../container-instances/container-instances-overview.md)
- [Securing your Azure resources](../security/fundamentals/overview.md)
- [Troubleshooting guide for Azure VM Image Builder](./linux/image-builder-troubleshoot.md#troubleshoot-build-failures)
