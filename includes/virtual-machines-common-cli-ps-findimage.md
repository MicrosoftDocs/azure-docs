

## Azure CLI

> [AZURE.NOTE] This article describes how to navigate and select virtual machine images, using a recent installation of either the Azure CLI or Azure PowerShell. As a prerequisite, you would need to change to the Resource Manager mode. With the Azure CLI, enter that mode by typing `azure config mode arm`. 

The easiest and quickest way to locate an image to use either with `azure vm quick-create` or to create a resource group template file is to call the `azure vm image list` command and pass the location, the publisher name (it's not case-sensitive!), and an offer -- if you know the offer. For example, the following list is only a short example -- many lists are quite long -- if you know that "Canonical" is a publisher for the "UbuntuServer" offer.

    azure vm image list westus canonical ubuntuserver
    info:    Executing command vm image list
    warn:    The parameter --sku if specified will be ignored
    + Getting virtual machine image skus (Publisher:"canonical" Offer:"ubuntuserver" Location:"westus")
    data:    Publisher  Offer         Sku                OS     Version          Location  Urn
    data:    ---------  ------------  -----------------  -----  ---------------  --------  --------------------------------------------------------
    data:    canonical  ubuntuserver  16.04.0-LTS        Linux  16.04.201604203  westus    canonical:ubuntuserver:16.04.0-LTS:16.04.201604203
    data:    canonical  ubuntuserver  16.04.0-LTS        Linux  16.04.201605161  westus    canonical:ubuntuserver:16.04.0-LTS:16.04.201605161
    data:    canonical  ubuntuserver  16.04.0-LTS        Linux  16.04.201606100  westus    canonical:ubuntuserver:16.04.0-LTS:16.04.201606100
    data:    canonical  ubuntuserver  16.04.0-LTS        Linux  16.04.201606270  westus    canonical:ubuntuserver:16.04.0-LTS:16.04.201606270
    data:    canonical  ubuntuserver  16.04.0-LTS        Linux  16.04.201607210  westus    canonical:ubuntuserver:16.04.0-LTS:16.04.201607210
    data:    canonical  ubuntuserver  16.04.0-LTS        Linux  16.04.201608150  westus    canonical:ubuntuserver:16.04.0-LTS:16.04.201608150
    data:    canonical  ubuntuserver  16.10-DAILY        Linux  16.10.201607220  westus    canonical:ubuntuserver:16.10-DAILY:16.10.201607220
    data:    canonical  ubuntuserver  16.10-DAILY        Linux  16.10.201607230  westus    canonical:ubuntuserver:16.10-DAILY:16.10.201607230
    data:    canonical  ubuntuserver  16.10-DAILY        Linux  16.10.201607240  westus    canonical:ubuntuserver:16.10-DAILY:16.10.201607240

The **Urn** column will be the form you pass to `azure vm quick-create`.

Often, however, you don't yet know what is available. In this case, you can navigate images by discovering publishers first by using `azure vm image list-publishers` and responding to the location prompt with a data center location you expect to use for your resource group. For example, the following lists all image publishers in the West US location (pass the location argument by lowercasing and removing spaces from the standard locations)

    azure vm image list-publishers
    info:    Executing command vm image list-publishers
    Location: westus
    + Getting virtual machine and/or extension image publishers (Location: "westus")
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
    data:    Publisher  Offer                      Location
    data:    ---------  -------------------------  --------
    data:    canonical  Ubuntu15.04Snappy          westus
    data:    canonical  Ubuntu15.04SnappyDocker    westus
    data:    canonical  UbunturollingSnappy        westus
    data:    canonical  UbuntuServer               westus
    data:    canonical  Ubuntu_Snappy_Core         westus
    data:    canonical  Ubuntu_Snappy_Core_Docker  westus
    info:    vm image list-offers command OK

Now we know that in the West US region, Canonical publishes the **UbuntuServer** offer on Azure. But what SKUs? To get those, you call `azure vm image list-skus` and respond to the prompt with the location, publisher, and offer that you have discovered.

    azure vm image list-skus
    info:    Executing command vm image list-skus
    Location: westus
    Publisher: canonical
    Offer: ubuntuserver
    + Getting virtual machine image skus (Publisher:"canonical" Offer:"ubuntuserver" Location:"westus")
    data:    Publisher  Offer         sku                Location
    data:    ---------  ------------  -----------------  --------
    data:    canonical  ubuntuserver  12.04.2-LTS        westus
    data:    canonical  ubuntuserver  12.04.3-LTS        westus
    data:    canonical  ubuntuserver  12.04.4-LTS        westus
    data:    canonical  ubuntuserver  12.04.5-DAILY-LTS  westus
    data:    canonical  ubuntuserver  12.04.5-LTS        westus
    data:    canonical  ubuntuserver  12.10              westus
    data:    canonical  ubuntuserver  14.04-beta         westus
    data:    canonical  ubuntuserver  14.04.0-LTS        westus
    data:    canonical  ubuntuserver  14.04.1-LTS        westus
    data:    canonical  ubuntuserver  14.04.2-LTS        westus
    data:    canonical  ubuntuserver  14.04.3-LTS        westus
    data:    canonical  ubuntuserver  14.04.4-DAILY-LTS  westus
    data:    canonical  ubuntuserver  14.04.4-LTS        westus
    data:    canonical  ubuntuserver  14.04.5-DAILY-LTS  westus
    data:    canonical  ubuntuserver  14.04.5-LTS        westus
    data:    canonical  ubuntuserver  14.10              westus
    data:    canonical  ubuntuserver  14.10-beta         westus
    data:    canonical  ubuntuserver  14.10-DAILY        westus
    data:    canonical  ubuntuserver  15.04              westus
    data:    canonical  ubuntuserver  15.04-beta         westus
    data:    canonical  ubuntuserver  15.04-DAILY        westus
    data:    canonical  ubuntuserver  15.10              westus
    data:    canonical  ubuntuserver  15.10-alpha        westus
    data:    canonical  ubuntuserver  15.10-beta         westus
    data:    canonical  ubuntuserver  15.10-DAILY        westus
    data:    canonical  ubuntuserver  16.04-alpha        westus
    data:    canonical  ubuntuserver  16.04-beta         westus
    data:    canonical  ubuntuserver  16.04.0-DAILY-LTS  westus
    data:    canonical  ubuntuserver  16.04.0-LTS        westus
    data:    canonical  ubuntuserver  16.10-DAILY        westus
    info:    vm image list-skus command OK

With this information, you can now find exactly the image you want by calling the original call at the top.

    azure vm image list westus canonical ubuntuserver 16.04.0-LTS
    info:    Executing command vm image list
    + Getting virtual machine images (Publisher:"canonical" Offer:"ubuntuserver" Sku: "16.04.0-LTS" Location:"westus")
    data:    Publisher  Offer         Sku          OS     Version          Location  Urn
    data:    ---------  ------------  -----------  -----  ---------------  --------  --------------------------------------------------
    data:    canonical  ubuntuserver  16.04.0-LTS  Linux  16.04.201604203  westus    canonical:ubuntuserver:16.04.0-LTS:16.04.201604203
    data:    canonical  ubuntuserver  16.04.0-LTS  Linux  16.04.201605161  westus    canonical:ubuntuserver:16.04.0-LTS:16.04.201605161
    data:    canonical  ubuntuserver  16.04.0-LTS  Linux  16.04.201606100  westus    canonical:ubuntuserver:16.04.0-LTS:16.04.201606100
    data:    canonical  ubuntuserver  16.04.0-LTS  Linux  16.04.201606270  westus    canonical:ubuntuserver:16.04.0-LTS:16.04.201606270
    data:    canonical  ubuntuserver  16.04.0-LTS  Linux  16.04.201607210  westus    canonical:ubuntuserver:16.04.0-LTS:16.04.201607210
    data:    canonical  ubuntuserver  16.04.0-LTS  Linux  16.04.201608150  westus    canonical:ubuntuserver:16.04.0-LTS:16.04.201608150
    info:    vm image list command OK

Now you can choose precisely the image you want to use. To create a virtual machine quickly by using the URN information, which you just found, or to use a template with that URN information, see [Using the Azure CLI for Mac, Linux, and Windows with Azure Resource Manager](../articles/xplat-cli-azure-resource-manager.md).

## PowerShell

> [AZURE.NOTE] Install and configure the [latest Azure PowerShell](../articles/powershell-install-configure.md). If you are using Azure PowerShell modules below 1.0, you still use the following commands but you must first `Switch-AzureMode AzureResourceManager`. 

When creating a new virtual machine with Azure Resource Manager, in some cases you need to specify an image with the combination of the following image properties:

- Publisher
- Offer
- SKU

For example, these values are needed for the `Set-AzureRMVMSourceImage` PowerShell cmdlet or with a resource group template file in which you must specify the type of virtual machine to be created.

If you need to determine these values, you can navigate the images to determine these values:

1. List the image publishers.
2. For a given publisher, list their offers.
3. For a given offer, list their SKUs.


First, list the publishers with the following commands:

```powershell
$locName="<Azure location, such as West US>"
Get-AzureRMVMImagePublisher -Location $locName | Select PublisherName
```

Fill in your chosen publisher name and run the following commands:

```powershell
$pubName="<publisher>"
Get-AzureRMVMImageOffer -Location $locName -Publisher $pubName | Select Offer
```

Fill in your chosen offer name and run the following commands:

```powershell
$offerName="<offer>"
Get-AzureRMVMImageSku -Location $locName -Publisher $pubName -Offer $offerName | Select Skus
```

From the display of the `Get-AzureRMVMImageSku` command, you have all the information you need to specify the image for a new virtual machine.

The following shows a full example:

```powershell
PS C:\> $locName="West US"
PS C:\> Get-AzureRMVMImagePublisher -Location $locName | Select PublisherName

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
```

For the "MicrosoftWindowsServer" publisher:

```powershell
PS C:\> $pubName="MicrosoftWindowsServer"
PS C:\> Get-AzureRMVMImageOffer -Location $locName -Publisher $pubName | Select Offer

Offer
-----
WindowsServer
```

For the "WindowsServer" offer:

```powershell
PS C:\> $offerName="WindowsServer"
PS C:\> Get-AzureRMVMImageSku -Location $locName -Publisher $pubName -Offer $offerName | Select Skus

Skus
----
2008-R2-SP1
2012-Datacenter
2012-R2-Datacenter
2016-Nano-Server-Technical-Previe
2016-Technical-Preview-with-Conta
Windows-Server-Technical-Preview
```

From this list, copy the chosen SKU name, and you have all the information for the `Set-AzureRMVMSourceImage` PowerShell cmdlet or for a resource group template.


<!--Image references-->
[5]: ./media/markdown-template-for-new-articles/octocats.png
[6]: ./media/markdown-template-for-new-articles/pretty49.png
[7]: ./media/markdown-template-for-new-articles/channel-9.png
[8]: ./media/markdown-template-for-new-articles/copytemplate.png

<!--Reference style links - using these makes the source content way more readable than using inline links-->
[gog]: http://google.com/
[yah]: http://search.yahoo.com/  
[msn]: http://search.msn.com/