<properties
   pageTitle="Deploying a template using the Azure CLI for Mac, Linux, and Windows"
   description="Describes the basic steps to deploy or update any template."
   services="virtual-machines"
   documentationCenter=""
   authors="squillace"
   manager="timlt"
   editor=""/>

<tags
   ms.service="virtual-machines"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="infrastructure"
   ms.date="04/21/2015"
   ms.author="rasquill"/>

# Deploying a template using the Azure CLI for Mac, Linux, and Windows

## Install curl, wget, or other downloading tool
This topic uses **curl**. Use your operating system's package manager, or download it from [here](http://curl.haxx.se/download.html).

## Download the template parameters file (or the template if necessary)

The following steps will enable you to deploy one Azure template, even if it is a complex one. This topic uses the template that creates a basic Ubuntu server with the customscript VM extension installed as an example. The files are included as well at the end of the topic for reference.

### Download the azuredeploy-parameters.json file

Download the azuredeploy-parameters.json file if one exists for the template you want to deploy. 

    curl -O https://github.com/azure/azurermtemplates/raw/master/linux-virtual-machine-with-customdata/azuredeploy-parameters.json
    
## Enter your resource group deployment information
    
Open this file with your favorite editor. You'll see that you need to specify a value for several of the keys, particularly **adminUsername**, **adminPassword** (remember complexity rules!), and the storage account name and DNS names that you want. 
    
    {
      "newStorageAccountName": {
        "value": "uniquestorageaccountname"
      },
      "adminUsername": {
        "value": ""
      },
      "adminPassword": {
        "value": ""
      },
      "dnsNameForPublicIP": {
        "value": "uniquednsnameforpublicip"
      },
      "vmSourceImageName": {
        "value": "b39f27a8b8c64d52b05eac6a62ebad85__Ubuntu-14_04_2_LTS-amd64-server-20150309-en-us-30GB"
      },
      "location": {
        "value": "West US"
      },
      "virtualNetworkName": {
        "value": "myVNET"
      },
      "vmSize": {
        "value": "Standard_A0"
      },
      "vmName": {
        "value": "myVM"
      },
      "publicIPAddressName": {
        "value": "myPublicIP"
      },
      "nicName": {
        "value": "myNic"
      }
    }
    
Add either new values -- Azure will create new storage and DNS resources for you if it can -- or use resources that you have already created. The following azuredeploy-parameters.json file shows an example:




the url below grabs the parameters file from the "empty" azuredeploy-parameters.json, which will work if they use the interactive method. if they are using the downloaded and customized parameters file approach, they'll need to use the --template-file <template-file> option instead.
I also have scripts written that extract individual sections of any portion of these files as well, depending upon what you want to do. You may want to mention that to do json parsing they might want jq: curl http://stedolan.github.io/jq/download/linux64/jq -o /usr/bin/jq


### Deploy your template and parameters files


[AZURE.NOTE] You may find that 
Some templates may have no correspdonding azuredeploy-parameters.json file. 

parameters to set, or they may be already a part of the template itself, depending on what templates you are using. In these cases, you may

If your template contains its parameters directly, or you want to extract the parameters data yourself. For more information about the structure of templates, see [Azure Resource Manager Template Language](https://msdn.microsoft.com/library/azure/dn835138.aspx). 


https://github.com/azure/azurermtemplates/raw/master/linux-virtual-machine-with-customdata/azuredeploy.json (or just the azuredeploy-parameters.json file)
You can either extract the parameters section of the template -- in which case you'll need to save it back inside the template itself OR as a separate azuredeploy-parameters.json file. You'll need to go obtain the values to place into the parameters. 

## Modify the azuredeploy-templates.json file

Collect the values that you will need

<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps

Vestibul ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nullam ultricies, ipsum vitae volutpat hendrerit, purus diam pretium eros, vitae tincidunt nulla lorem sed turpis: [Link 3 to another azure.microsoft.com documentation topic](storage-whatis-account.md).

<!--Image references-->
[5]: ./media/markdown-template-for-new-articles/octocats.png
[6]: ./media/markdown-template-for-new-articles/pretty49.png
[7]: ./media/markdown-template-for-new-articles/channel-9.png
[8]: ./media/markdown-template-for-new-articles/copytemplate.png
