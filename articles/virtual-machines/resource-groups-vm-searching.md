<properties
   pageTitle="Navigate and select Azure virtual machine images with PowerShell and the Azure CLI"
   description="Learn how to determine the publisher, offer, and SKU for images when creating an Azure virtual machine with Resource Manager."
   services="virtual-machines"
   documentationCenter=""
   authors="squillace"
   manager="timlt"
   editor=""
   tags="azure-resource-manager"
   />

<tags
   ms.service="virtual-machines"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="command-line-interface"
   ms.workload="infrastructure"
   ms.date="08/25/2015"
   ms.author="rasquill"/>

# Navigate and select Azure virtual machine images with Windows PowerShell and the Azure CLI

> [AZURE.NOTE] When you're searching for virtual machine images in this topic, you're using the [Azure Resource Manager mode](../resource-group-overview.md) with a recent installation of either the Azure Command-Line interface for Mac, Linux, and Windows or of Windows PowerShell. With the Azure CLI, enter that mode by typing `azure config mode arm`. With PowerShell, type `Switch-AzureMode AzureResourceManager`. See [Using Azure CLI with Resource Manager](xplat-cli-azure-resource-manager.md) and [Using Azure PowerShell with Azure Resource Manager](../powershell-azure-resource-manager.md) for more complete update and configuration details.

## Table of commonly used images


| PublisherName                        | Offer                                 | Sku                         |
|:---------------------------------|:-------------------------------------------|:---------------------------------|:--------------------|
| OpenLogic                        | CentOS                                     | 7                                |
| OpenLogic                        | CentOS                                     | 7.1                              |
| CoreOS                           | CoreOS                                     | Beta                             |
| CoreOS                           | CoreOS                                     | Stable                           |
| MicrosoftDynamicsNAV             | DynamicsNAV                                | 2015                             |
| MicrosoftSharePoint              | MicrosoftSharePointServer                  | 2013                             |
| Microsoft                        | Oracle-Database-12c-Weblogic-Server-12c    | Standard                         |
| Microsoft                        | Oracle-Database-12c-Weblogic-Server-12c    | Enterprise                       |
| MicrosoftSQLServer               | SQL2014-WS2012R2                           | Enterprise-Optimized-for-DW      |
| MicrosoftSQLServer               | SQL2014-WS2012R2                           | Enterprise-Optimized-for-OLTP    |
| Canonical                        | UbuntuServer                               | 12.04.5-LTS                      |
| Canonical                        | UbuntuServer                               | 14.04.2-LTS                      |
| MicrosoftWindowsServer           | WindowsServer                              | 2012-Datacenter                  |
| MicrosoftWindowsServer           | WindowsServer                              | 2012-R2-Datacenter               |
| MicrosoftWindowsServer           | WindowsServer                              | 2008-R2-SP1 |
| MicrosoftWindowsServer           | WindowsServer                              | Windows-Server-Technical-Preview |
| MicrosoftWindowsServerEssentials | WindowsServerEssentials                    | WindowsServerEssentials          |
| MicrosoftWindowsServerHPCPack    | WindowsServerHPCPack                       | 2012R2                           |


## Azure CLI

The easiest and quickest way to locate an image to use either with `azure vm quick-create` or to create a resource group template file is to call the `azure vm image list` command and pass the location, the publisher name (it's not case-sensitive!), and an offer -- if you know the offer. For example, the following list is only a short example -- many lists are quite long -- if you know that "Canonical" is a publisher for the "UbuntuServer" offer.

    azure vm image list westus canonical ubuntuserver
    info:    Executing command vm image list
    warn:    The parameter --sku if specified will be ignored
    + Getting virtual machine image skus (Publisher:"canonical" Offer:"ubuntuserver" Location:"westus")
    data:    Publisher  Offer         Sku          Version          Location  Urn
    data:    ---------  ------------  -----------  ---------------  --------  --------------------------------------------------
    data:    canonical  ubuntuserver  12.04-DAILY  12.04.201504201  westus    canonical:ubuntuserver:12.04-DAILY:12.04.201504201
    data:    canonical  ubuntuserver  12.04.2-LTS  12.04.201302250  westus    canonical:ubuntuserver:12.04.2-LTS:12.04.201302250
    data:    canonical  ubuntuserver  12.04.2-LTS  12.04.201303250  westus    canonical:ubuntuserver:12.04.2-LTS:12.04.201303250
    data:    canonical  ubuntuserver  12.04.2-LTS  12.04.201304150  westus    canonical:ubuntuserver:12.04.2-LTS:12.04.201304150
    data:    canonical  ubuntuserver  12.04.2-LTS  12.04.201305160  westus    canonical:ubuntuserver:12.04.2-LTS:12.04.201305160
    data:    canonical  ubuntuserver  12.04.2-LTS  12.04.201305270  westus    canonical:ubuntuserver:12.04.2-LTS:12.04.201305270
    data:    canonical  ubuntuserver  12.04.2-LTS  12.04.201306030  westus    canonical:ubuntuserver:12.04.2-LTS:12.04.201306030
    data:    canonical  ubuntuserver  12.04.2-LTS  12.04.201306240  westus    canonical:ubuntuserver:12.04.2-LTS:12.04.201306240

The **Urn** column will be the form you pass to `azure vm quick-create`.

Often, however, you don't yet know what is available. In this case, you can navigate images by discovering publishers first by using `azure vm image list-publishers` and responding to the location prompt with a data center location you expect to use for your resource group. For example, the following lists all image publishers in the West US location (pass the location argument by lowercasing and removing spaces from the standard locations)

    azure vm image list-publishers
    info:    Executing command vm image list-publishers
    Location: westus
    + Getting virtual machine image publishers (Location: "westus")
    data:    Publisher                                       Location
    data:    ----------------------------------------------  --------
    data:    a10networks                                     westus  
    data:    aiscaler-cache-control-ddos-and-url-rewriting-  westus  
    data:    alertlogic                                      westus  
    data:    AlertLogic.Extension                            westus  


These lists can be quite long, so the example list above is just a snippet. Let's say that I noticed that Canonical is, indeed, an image publisher in the West US location. You can now find their offers by calling `azure vm image list-offers` and pass the location and the publisher at the prompts, like the following example:

    azure vm image list-offers
    info:    Executing command vm image list-offers
    Location: westus
    Publisher: canonical
    + Getting virtual machine image offers (Publisher: "canonical" Location:"westus")
    data:    Publisher  Offer         Location
    data:    ---------  ------------  --------
    data:    canonical  UbuntuServer  westus  
    info:    vm image list-offers command OK

Now we know that in the West US region, Canonical publishes the **UbuntuServer** offer on Azure. But what SKUs? To get those, you call `azure vm image list-skus` and respond to the prompt with the location, publisher, and offer that you have discovered.

    azure vm image list-skus
    info:    Executing command vm image list-skus
    Location: westus
    Publisher: canonical
    Offer: ubuntuserver
    + Getting virtual machine image skus (Publisher:"canonical" Offer:"ubuntuserver" Location:"westus")
    data:    Publisher  Offer         sku          Location
    data:    ---------  ------------  -----------  --------
    data:    canonical  ubuntuserver  12.04-DAILY  westus  
    data:    canonical  ubuntuserver  12.04.2-LTS  westus  
    data:    canonical  ubuntuserver  12.04.3-LTS  westus  
    data:    canonical  ubuntuserver  12.04.4-LTS  westus  
    data:    canonical  ubuntuserver  12.04.5-LTS  westus  
    data:    canonical  ubuntuserver  12.10        westus  
    data:    canonical  ubuntuserver  14.04-beta   westus  
    data:    canonical  ubuntuserver  14.04-DAILY  westus  
    data:    canonical  ubuntuserver  14.04.0-LTS  westus  
    data:    canonical  ubuntuserver  14.04.1-LTS  westus  
    data:    canonical  ubuntuserver  14.04.2-LTS  westus  
    data:    canonical  ubuntuserver  14.10        westus  
    data:    canonical  ubuntuserver  14.10-beta   westus  
    data:    canonical  ubuntuserver  14.10-DAILY  westus  
    data:    canonical  ubuntuserver  15.04        westus  
    data:    canonical  ubuntuserver  15.04-beta   westus  
    data:    canonical  ubuntuserver  15.04-DAILY  westus  
    info:    vm image list-skus command OK

With this information, you can now find exactly the image you want by calling the original call at the top.

    azure vm image list westus canonical ubuntuserver 14.04.2-LTS
    info:    Executing command vm image list
    + Getting virtual machine images (Publisher:"canonical" Offer:"ubuntuserver" Sku: "14.04.2-LTS" Location:"westus")
    data:    Publisher  Offer         Sku          Version          Location  Urn
    data:    ---------  ------------  -----------  ---------------  --------  --------------------------------------------------
    data:    canonical  ubuntuserver  14.04.2-LTS  14.04.201503090  westus    canonical:ubuntuserver:14.04.2-LTS:14.04.201503090
    data:    canonical  ubuntuserver  14.04.2-LTS  14.04.20150422   westus    canonical:ubuntuserver:14.04.2-LTS:14.04.20150422
    data:    canonical  ubuntuserver  14.04.2-LTS  14.04.201504270  westus    canonical:ubuntuserver:14.04.2-LTS:14.04.201504270
    info:    vm image list command OK

Now you can choose precisely the image you want to use. To create a virtual machine quickly by using the URN information, which you just found, or to use a template with that URN information, see [Using the Azure CLI for Mac, Linux, and Windows with Azure Resource Manager](xplat-cli-azure-resource-manager.md).

### Video walkthrough

This video demonstrates the above steps using the CLI.

[AZURE.VIDEO resource-groups-vm-searching-cli]


## PowerShell

When creating a new virtual machine with Azure Resource Manager, in some cases you need to specify an image with the combination of the following image properties:

- Publisher
- Offer
- SKU

For example, these values are needed for the **Set-AzureVMSourceImage** PowerShell cmdlet or with a resource group template file in which you must specify the type of virtual machine to be created.

If you need to determine these values, you can navigate the images to determine these values:

1. List the image publishers.
2. For a given publisher, list their offers.
3. For a given offer, list their SKUs.

To do this in PowerShell, first switch to the Resource Manager mode of Azure PowerShell.

	Switch-AzureMode AzureResourceManager

For the first step above, list the publishers with these commands.

	$locName="<Azure location, such as West US>"
	Get-AzureVMImagePublisher -Location $locName | Select PublisherName

Fill in your chosen publisher name and run these commands.

	$pubName="<publisher>"
	Get-AzureVMImageOffer -Location $locName -Publisher $pubName | Select Offer

Fill in your chosen offer name and run these commands.

	$offerName="<offer>"
	Get-AzureVMImageSku -Location $locName -Publisher $pubName -Offer $offerName | Select Skus

From the display of the **Get-AzureVMImageSku** command, you have all the information you need to specify the image for a new virtual machine.

Here is an example.

	PS C:\> $locName="West US"
	PS C:\> Get-AzureVMImagePublisher -Location $locName | Select PublisherName

	PublisherName
	-------------
	a10networks
	aiscaler-cache-control-ddos-and-url-rewriting-
	alertlogic
	AlertLogic.Extension
	Barracuda.Azure.ConnectivityAgent
	barracudanetworks
	basho
	boxless
	bssw
	Canonical
	...

For the "MicrosoftWindowsServer" publisher:

	PS C:\> $pubName="MicrosoftWindowsServer"
	PS C:\> Get-AzureVMImageOffer -Location $locName -Publisher $pubName | Select Offer

	Offer
	-----
	WindowsServer

For the "WindowsServer" offer:

	PS C:\> $offerName="WindowsServer"
	PS C:\> Get-AzureVMImageSku -Location $locName -Publisher $pubName -Offer $offerName | Select Skus

	Skus
	----
	2008-R2-SP1
	2012-Datacenter
	2012-R2-Datacenter
	Windows-Server-Technical-Preview

From this list, copy the chosen SKU name, and you have all the information for the **Set-AzureVMSourceImage** PowerShell cmdlet or for a resource group template file that requires you to specify the publisher, offer, and SKU for an image.

### Video walkthrough

This video demonstrates the above steps using PowerShell.

[AZURE.VIDEO resource-groups-vm-searching-posh]


<!--Image references-->
[5]: ./media/markdown-template-for-new-articles/octocats.png
[6]: ./media/markdown-template-for-new-articles/pretty49.png
[7]: ./media/markdown-template-for-new-articles/channel-9.png
[8]: ./media/markdown-template-for-new-articles/copytemplate.png

<!--Reference style links - using these makes the source content way more readable than using inline links-->
[gog]: http://google.com/
[yah]: http://search.yahoo.com/  
[msn]: http://search.msn.com/
