<properties
   pageTitle="Set up a Service Fabric cluster by using an Azure Resource Manager template | Microsoft Azure"
   description="Set up a Service Fabric cluster by using an Azure Resource Manager template."
   services="service-fabric"
   documentationCenter=".net"
   authors="ChackDan"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="05/02/2016"
   ms.author="chackdan"/>


# Set up a Service Fabric cluster by using an Azure Resource Manager template

This page helps you set up an Azure Service Fabric cluster by using an Azure Resource Manager template. To do this, your subscription must have enough cores to deploy the IaaS VMs that will make up this cluster.

## Prerequisites

- To set up a secure cluster, you must first upload an X.509 certificate to your key vault. You will need the source vault URL, the certificate URL, and the certificate thumbprint.
- Refer to [Service Fabric cluster security](service-fabric-cluster-security.md) for more details on how to set up a secure cluster.

## Get a sample Resource Manager template

Sample Resource Manager templates are available at the [Azure quick-start template gallery on GitHub](https://github.com/Azure/azure-quickstart-templates). All the Service Fabric template names start with "service-fabric..". You can either search the repository for "fabric" or scroll down to the set of sample templates. To help you quickly find what you are looking for, the templates have been named as follows:

- [service-fabric-unsecure-cluster-5-node-1-nodetype](http://go.microsoft.com/fwlink/?LinkId=716923) to indicate a five-node single-node unsecure cluster template.

- [service-fabric-secure-cluster-5-node-1-nodetype-wad](http://go.microsoft.com/fwlink/?LinkID=716924) to indicate a five-node single-node secure cluster template that is WAD enabled.

- [service-fabric-secure-cluster-10-node-2-nodetype-wad](http://go.microsoft.com/fwlink/?LinkId=716925) to indicate a ten-node two-node secure cluster template that is WAD enabled.

## Create a custom Resource Manager template

There are two ways to create a custom Resource Manager template:

1. You can acquire a sample template from the [Azure quick-start template gallery on GitHub ](https://github.com/Azure/azure-quickstart-templates) and make changes to it.

2. You can sign in to the Azure portal and use the Service Fabric portal pages to generate the template for you to customize. To do that, follow these steps:

    a. Sign in to the [Azure portal](https://portal.azure.com/).

    b. Go through the process of creating the cluster as described in [Create an Azure Service Fabric cluster via portal](service-fabric-cluster-creation-via-portal.md), but do not click on **Create**. Instead, go to **Summary** and download the template, as shown in the following screen shot.

 ![Screen shot of the Service Fabric Cluster page showing the link for downloading a Resource Manager template][DownloadTemplate]

## Deploy the Resource Manager template to Azure by using Azure PowerShell

Refer to [Deploying Resource Manager templates by using PowerShell](../resource-group-template-deploy.md) for detailed guidance on how to deploy the template by using PowerShell.

>[AZURE.NOTE] Service Fabric clusters require a certain number of nodes to be up at all times in order to maintain availability and preserve state - referred to as "maintaining quorum". Consequently, it is typically not safe to shut down all of the machines in the cluster unless you have first performed a [full backup of your state](service-fabric-reliable-services-backup-restore.md).

<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps
- [Service Fabric cluster security](service-fabric-cluster-security.md)
- [Managing your Service Fabric applications in Visual Studio](service-fabric-manage-application-in-visual-studio.md).
- [Service Fabric health model introduction](service-fabric-health-introduction.md)

<!--Image references-->
[DownloadTemplate]: ./media/service-fabric-cluster-creation-via-arm/DownloadTemplate.png
