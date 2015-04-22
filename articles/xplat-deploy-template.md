<properties
   pageTitle="Deploying a template using the Azure CLI for Mac, Linux, and Windows"
   description="Describes the basic steps to deploy or update any template."
   services="virtual-machines"
   documentationCenter="virtual-machines"
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

​install curl if you do not already have it. apt-get/yum install curl
https://github.com/azure/azurermtemplates/raw/master/linux-virtual-machine-with-customdata/azuredeploy.json (or just the azuredeploy-parameters.json file)
You can either extract the parameters section of the template -- in which case you'll need to save it back inside the template itself OR as a separate azuredeploy-parameters.json file. You'll need to go obtain the values to place into the parameters. 
Either fill the file with the parameter values, or use the prompting method.
the url below grabs the parameters file from the "empty" azuredeploy-parameters.json, which will work if they use the interactive method. if they are using the downloaded and customized parameters file approach, they'll need to use the --template-file <template-file> option instead.
I also have scripts written that extract individual sections of any portion of these files as well, depending upon what you want to do. You may want to mention that to do json parsing they might want jq: curl http://stedolan.github.io/jq/download/linux64/jq -o /usr/bin/jq


<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps

Vestibul ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nullam ultricies, ipsum vitae volutpat hendrerit, purus diam pretium eros, vitae tincidunt nulla lorem sed turpis: [Link 3 to another azure.microsoft.com documentation topic](storage-whatis-account.md).

<!--Image references-->
[5]: ./media/markdown-template-for-new-articles/octocats.png
[6]: ./media/markdown-template-for-new-articles/pretty49.png
[7]: ./media/markdown-template-for-new-articles/channel-9.png
[8]: ./media/markdown-template-for-new-articles/copytemplate.png
