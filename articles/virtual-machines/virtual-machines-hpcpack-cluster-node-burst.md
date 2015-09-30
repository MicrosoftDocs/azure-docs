<properties
 pageTitle="Add "burst" nodes to an HPC Pack cluster | Microsoft Azure"
 description="Learn how to add worker role instances running in a cloud service on-demand as compute resources to an HPC Pack head node in Azure."
 services="virtual-machines"
 documentationCenter=""
 authors="dlepow"
 manager="timlt"
 editor=""
 tags="azure-service-management"/>
<tags
ms.service="virtual-machines"
 ms.devlang="na"
 ms.topic="article"
 ms.tgt_pltfrm="vm-multiple"
 ms.workload="big-compute"
 ms.date="09/28/2015"
 ms.author="danlep"/>

# Add on-demand "burst" nodes (worker role instances) as compute resources to an HPC Pack cluster in Azure

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-include.md)] This article applies to creating a resource with the classic deployment model.

This article shows you how to add Azure "burst" nodes (worker role instances
running in a cloud service) on-demand as compute resources to an
existing HPC Pack head node in Azure. This lets you scale up the compute capacity of the HPC cluster in Azure, without maintaining a set of preconfigured compute node VMs.

![Burst nodes][burst]

>[AZURE.TIP] If you use the [HPC Pack IaaS deployment script](virtual-machines-hpcpack-cluster-powershell-script.md) to create the cluster in Azure,
you can include Azure burst nodes in your automated
deployment.

The steps in this article will help you add Azure nodes quickly to a
cloud-based HPC Pack head node VM for a test or proof of concept deployment. The procedure is essentially the
same as the one to “burst to Azure” to add cloud compute capacity to an
on-premises HPC Pack cluster. For a tutorial, see [Set up a hybrid compute cluster with Microsoft HPC Pack](../cloud-services/cloud-services-setup-hybrid-hpcpack-cluster.md). For
detailed guidance and considerations for production deployments, see
[Burst to Azure with Microsoft HPC
Pack](http://go.microsoft.com/fwlink/p/?LinkID=200493).

If you want to use the A8 or A9 compute intensive instance size, see
[About the A8, A9, A10, and A11 compute-intensive instances](virtual-machines-a8-a9-a10-a11-specs.md).

## Prerequisites

* **HPC Pack head node deployed in an Azure VM** - See [Deploy an HPC
Pack Head Node in an Azure VM](virtual-machines-hpcpack-cluster-headnode.md) for
steps to create a cluster head node in the classic (Service Management) deployment model.

* **Azure subscription** - To add Azure nodes, you can choose the same
subscription used to deploy the head node VM, or a different
subscription (or subscriptions).

* **Cores quota** - You might need to increase the quota of cores, especially if you choose to deploy several Azure nodes with multicore sizes. To increase a quota, [open an online customer support request](http://azure.microsoft.com/blog/2014/06/04/azure-limits-quotas-increase-requests/) at no charge.

## Step 1: Create a cloud service and a storage account to add Azure nodes

Use the Azure Portal or equivalent tools to configure the following, which are needed to deploy
your Azure nodes:

* A new Azure cloud service
* A new Azure storage account

>[AZURE.NOTE] Don't reuse an existing cloud service in your subscription. Also don't
deploy a separate, custom cloud service package to this cloud service.
HPC Pack automatically deploys a cloud service package when you
start (provision) the Azure nodes.

**Considerations**

* Configure a separate cloud service for each Azure node template that you plan to create. However, you can use the same storage account for multiple node templates.

* You should generally locate the cloud service and the storage account for the deployment in the same region.




## Step 2: Configure an Azure management certificate

To add Azure nodes as compute resources, you'll need to have a management
certificate on the head node and upload a corresponding certificate
 to the Azure subscription used for the deployment.

For this scenario,  you can choose the **Default HPC Azure Management
Certificate** that HPC Pack installs and configures automatically on the
head node. This certificate is useful for testing purposes and
proof-of-concept deployments. To use this certificate, simply upload the
file C:\Program Files\Microsoft HPC Pack 2012\Bin\hpccert.cer from the head node VM to the
subscription.

For additional options to configure the management certificate, see
[Scenarios to Configure the Azure Management Certificate for Azure Burst
Deployments](http://technet.microsoft.com/library/gg481759.aspx).

## Step 3: Deploy Azure nodes to the cluster



The steps to add and start
Azure nodes in this scenario are generally the same as those used with
an on-premises head node. For more information, see the following
sections in [Steps to Deploy Azure Nodes with Microsoft HPC Pack]((https://technet.microsoft.com/library/gg481758(v=ws.10).aspx):

* Create an Azure node template

* Add Azure nodes to the Windows HPC cluster

* Start (provision) the Azure nodes

After you add and start the nodes, they are ready for you to use to run cluster jobs.

If you encounter problems when deploying Azure nodes, see [Troubleshoot
Deployments of Azure Nodes with Microsoft HPC
Pack](http://technet.microsoft.com/library/jj159097(v=ws.10).aspx).

## Next steps

* If you want a way to
automatically grow or shrink the Azure computing resources according to
the current workload of jobs and tasks on the cluster, see [Grow and shrink Azure compute resources in an HPC Pack cluste](virtual-machines-hpcpack-cluster-node-autogrowshrink.md).

<!--Image references-->
[burst]: ./media/virtual-machines-hpcpack-cluster-node-burst/burst.png
