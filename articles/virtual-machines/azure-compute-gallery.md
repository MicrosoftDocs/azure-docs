---
title: Overview of Azure Compute Gallery 
description: Learn about the Azure Compute Gallery and how to share Azure resources.
author: cynthn
ms.author: cynthn
ms.service: virtual-machines
ms.subservice: gallery
ms.topic: overview
ms.date: 04/26/2022
ms.reviewer: cynthn

---

# Store and share resources in an Azure Compute Gallery

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

An Azure Compute Gallery helps you build structure and organization around your Azure resources, like images and [applications](vm-applications.md). An Azure Compute Gallery provides:

- Global replication.
- Versioning and grouping of resources for easier management.
- Highly available resources with Zone Redundant Storage (ZRS) accounts in regions that support Availability Zones. ZRS offers better resilience against zonal failures.
- Premium storage support (Premium_LRS).
- Sharing to the community, across subscriptions, and between Active Directory (AD) tenants.
- Scaling your deployments with resource replicas in each region.

With a gallery, you can share your resources to everyone, or limit sharing to different users, service principals, or AD groups within your organization. Resources can be replicated to multiple regions, for quicker scaling of your deployments.


## Images 

For more information about storing images in an Azure Compute Gallery, see [Store and share images in an Azure Compute Gallery](shared-image-galleries.md).

## VM apps

While you can create an image of a VM with apps pre-installed, you would need to update your image each time you have application changes. Separating your application installation from your VM images means there’s no need to publish a new image for every line of code change.

For more information about storing applications in an Azure Compute Gallery, see [VM Applications](vm-applications.md).


## Regional Support

All public regions can be target regions, but certain regions require that customers go through a request process in order to gain access. To request that a subscription is added to the allowlist for a region such as Australia Central or Australia Central 2, submit [an access request](/troubleshoot/azure/general/region-access-request-process)

## Limits 

There are limits, per subscription, for deploying resources using Azure Compute Galleries:
- 100 galleries, per subscription, per region
- 1,000 image definitions, per subscription, per region
- 10,000 image versions, per subscription, per region
- 10 image version replicas, per subscription, per region
- Any disk attached to the image must be less than or equal to 1TB in size

For more information, see [Check resource usage against limits](../networking/check-usage-against-limits.md) for examples on how to check your current usage.
 
## Scaling
Azure Compute Gallery allows you to specify the number of replicas you want to keep. This helps in multi-VM deployment scenarios as the VM deployments can be spread to different replicas reducing the chance of instance creation processing being throttled due to overloading of a single replica.

With Azure Compute Gallery, you can deploy up to a 1,000 VM instances in a virtual machine scale set. You can set a different replica count in each target region, based on the scale needs for the region. Since each replica is a copy of your resource, this helps scale your deployments linearly with each extra replica. While we understand no two resources or regions are the same, here's our general guideline on how to use replicas in a region:

- For every 20 VMs that you create concurrently, we recommend you keep one replica. For example, if you are creating 120 VMs concurrently using the same image in a region, we suggest you keep at least 6 replicas of your image.
- For each scale set you create concurrently, we recommend you keep one replica.

We always recommend that to over-provision the number of replicas due to factors like resource size, content and OS type.

![Graphic showing how you can scale images](./media/shared-image-galleries/scaling.png)

## High availability

[Azure Zone Redundant Storage (ZRS)](https://azure.microsoft.com/blog/azure-zone-redundant-storage-in-public-preview/) provides resilience against an Availability Zone failure in the region. With the general availability of Azure Compute Gallery, you can choose to store your images in ZRS accounts in regions with Availability Zones.

You can also choose the account type for each of the target regions. The default storage account type is Standard_LRS, but you can choose Standard_ZRS for regions with Availability Zones. For more information on regional availability of ZRS, see [Data redundancy](../storage/common/storage-redundancy.md).

![Graphic showing ZRS](./media/shared-image-galleries/zrs.png)

## Replication
Azure Compute Gallery also allows you to replicate your resources to other Azure regions automatically. Each image version can be replicated to different regions depending on what makes sense for your organization. One example is to always replicate the latest image in multi-regions while all older image versions are only available in 1 region. This can help save on storage costs.

The regions that a resource is replicated to can be updated after creation time. The time it takes to replicate to different regions depends on the amount of data being copied and the number of regions the version is replicated to. This can take a few hours in some cases. While the replication is happening, you can view the status of replication per region. Once the image replication is complete in a region, you can then deploy a VM or scale-set using that resource in the region.

![Graphic showing how you can replicate images](./media/shared-image-galleries/replication.png)

<a name=community></a>
## Community gallery (preview)


> [!IMPORTANT]
> Azure Compute Gallery – community gallery is currently in PREVIEW and subject to the [Preview Terms for Azure Compute Gallery - community gallery](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
> 
> To share images in the community gallery, you need to register for the preview at [https://aka.ms/communitygallery-preview](https://aka.ms/communitygallery-preview). Creating VMs and scale sets from images shared the community gallery is open to all Azure users.


Sharing images to the community is a new capability in Azure Compute Gallery. In the preview, you can make your image galleries public, and share them to all Azure customers. When a gallery is marked as a community gallery, all images under the gallery become available to all Azure customers as a new resource type under Microsoft.Compute/communityGalleries. All Azure customers can see the galleries and use them to create VMs. Your original resources of the type `Microsoft.Compute/galleries` are still under your subscription, and private.

### Why share to the community?

As a content publisher, you might want to share a gallery to the community:

- If you have non-commercial, non-proprietary content to share widely on Azure.

- You want greater control over the number of versions, regions, and the duration of image availability.  

- You want to quickly share daily or nightly builds with your customers.  

- You don’t want to deal with the complexity of multi-tenant authentication when sharing with multiple tenants on Azure.

### How sharing with the community works

You [create a gallery resource](create-gallery.md#create-a-community-gallery-preview) under `Microsoft.Compute/Galleries` and choose `community` as a sharing option.

When you are ready, you flag your gallery as ready to be shared publicly. Only the  owner of a subscription, or a user or service principal with the `Compute Gallery Sharing Admin` role at the subscription or gallery level, can enable a gallery to go public to the community. At this point, the Azure infrastructure creates proxy read-only regional resources, under `Microsoft.Compute/CommunityGalleries`, which are public.

The end-users can only interact with the proxy resources, they never interact with your private resources. As the publisher of the private resource, you should consider the private resource as your handle to the public proxy resources. The `prefix` you provide when you create the gallery will be used, along with a unique GUID, to create the public facing name for your gallery.

Azure users can see the latest image versions shared to the community in the portal, or query for them using the CLI. Only the latest version of an image is listed in the community gallery.

When creating a community gallery, you will need to provide contact information for your images. This information will be shown **publicly**, so be careful when providing it:
- Community gallery prefix
- Publisher support email
- Publisher URL
- Legal agreement URL

Information from your image definitions will also be publicly available, like what you provide for **Publisher**, **Offer**, and **SKU**.

> [!WARNING]
> If you want to stop sharing a gallery publicly, you can update the gallery to stop sharing, but making the gallery private will prevent existing virtual machine scale set users from scaling their resources.
>
> If you stop sharing your gallery during the preview, you won't be able to re-share it.


### Limitations for images shared to the community

There are some limitations for sharing your gallery to the community:
- Encrypted images aren't supported.
- For the preview, image resources need to be created in the same region as the gallery. For example, if you create a gallery in West US, the image definitions and image versions should be created in West US if you want to make them available during the public preview.
- For the preview, you can't share [VM Applications](vm-applications.md) to the community.
- The gallery must be created as a community gallery. For the preview, there is no way to migrate an existing gallery to be a community gallery.
- To find images shared to the community from the Azure portal, you need to go through the VM create or scale set creation pages. You can't search the portal or Azure Marketplace for the images.

> [!IMPORTANT]
> Microsoft does not provide support for images you share to the community.

### Community-shared images FAQ

**Q: What are the charges for using a gallery that is shared to the community?**

**A**: There are no charges for using the service itself. However, content publishers would be charged for the following:
- Storage charges for application versions and replicas in each of the regions (source and target). These charges are based on the storage account type chosen. 
- Network egress charges for replication across regions.

**Q: Is it safe to use images shared to the community?**

**A**: Users should exercise caution while using images from non-verified sources, since these images are not subject to Azure certification.  

**Q: If an image that is shared to the community doesn’t work, who do I contact for support?**

**A**: Azure is not responsible for any issues users might encounter with community-shared images. The support is provided by the image publisher. Please look up the publisher contact information for the image and reach out to them for any support.  


**Q: I have concerns about an image, who do I contact?**

**A**: For issues with images shared to the community:
- To report malicious images, contact [Abuse Report](https://msrc.microsoft.com/report/abuse). 
- To report images that potentially violate intellectual property rights, contact [Infringement Report](https://msrc.microsoft.com/report/infringement).
 

**Q: How do I request that an image shared to the community be replicated to a specific region?**

**A**: Only the content publishers have control over the regions their images are available in. If you don’t find an image in a specific region, reach out to the publisher directly.


## Explicit sharing using RBAC roles

As the Azure Compute Gallery, definition, and version are all resources, they can be shared using the built-in native Azure Roles-based Access Control (RBAC) roles. Using Azure RBAC roles you can share these resources to other users, service principals, and groups. You can even share access to individuals outside of the tenant they were created within. Once a user has access to the resource version, they can use it to deploy a VM or a Virtual Machine Scale Set.  Here is the sharing matrix that helps understand what the user gets access to:

| Shared with User     | Azure Compute Gallery | Image Definition | Image version |
|----------------------|----------------------|--------------|----------------------|
| Azure Compute Gallery | Yes                  | Yes          | Yes                  |
| Image Definition     | No                   | Yes          | Yes                  |

We recommend sharing at the Gallery level for the best experience. We do not recommend sharing individual image versions. For more information about Azure RBAC, see [Assign Azure roles](../role-based-access-control/role-assignments-portal.md).


## Billing
There is no extra charge for using the Azure Compute Gallery service. You will be charged for the following resources:
- Storage costs of storing each replica. For images, the storage cost is charged as a snapshot and is based on the occupied size of the image version, the number of replicas of the image version and the number of regions the version is replicated to. 
- Network egress charges for replication of the first resource version from the source region to the replicated regions. Subsequent replicas are handled within the region, so there are no additional charges. 

For example, let's say you have an image of a 127 GB OS disk, that only occupies 10GB of storage, and one empty 32 GB data disk. The occupied size of each image would only be 10 GB. The image is replicated to 3 regions and each region has two replicas. There will be six total snapshots, each using 10GB. You will be charged the storage cost for each snapshot based on the occupied size of 10 GB. You will pay network egress charges for the first replica to be copied to the additional two regions. For more information on the pricing of snapshots in each region, see [Managed disks pricing](https://azure.microsoft.com/pricing/details/managed-disks/). For more information on network egress, see [Bandwidth pricing](https://azure.microsoft.com/pricing/details/bandwidth/).


## SDK support

The following SDKs support creating Azure Compute Galleries:

- [.NET](/dotnet/api/overview/azure/virtualmachines/management)
- [Java](/java/azure/)
- [Node.js](/javascript/api/overview/azure/arm-compute-readme)
- [Python](/python/api/overview/azure/virtualmachines)
- [Go](/azure/go/)

## Templates

You can create Azure Compute Gallery resource using templates. There are several quickstart templates available: 

- [Create a gallery](https://azure.microsoft.com/resources/templates/sig-create/)
- [Create an image definition in a gallery](https://azure.microsoft.com/resources/templates/sig-image-definition-create/)
- [Create an image version in a gallery](https://azure.microsoft.com/resources/templates/sig-image-version-create/)


## Next steps

Learn how to deploy [images](shared-image-galleries.md) and [VM apps](vm-applications.md) using an Azure Compute Gallery.
