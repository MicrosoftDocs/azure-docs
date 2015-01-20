<properties urlDisplayName="Using io.js in Azure Websites" pageTitle="How to Use Azure Websites with io.js" metaKeywords="io.js website azure, io.js azure, iojs azure web site, iojs azure" description="Learn how to use an Azure website with io.js." metaCanonical="" services="web-sites" documentationCenter="nodejs" title="" authors="feriese" solutions="" manager="wpickett" editor="mollybos"/>

<tags ms.service="web-sites" ms.workload="web" ms.tgt_pltfrm="na" ms.devlang="nodejs" ms.topic="article" ms.date="01/20/2015" ms.author="feriese" />





#How to use io.js with Azure Websites

The popular Node fork [io.js] features various differences to Joyent's Node.js project, including a more open governance model, a supposedly faster release cycle and a faster adoption of new and experimental JavaScript features.

While Azure Websites has many Node.js versions preinstalled, it also allows for a user-provided Node.js binary. This article discusses two methods enabling the use of io.js on Azure Websites: The use of an extended deployment script, which automatically configures Azure to use the latest available io.js version, as well as the manual upload of a io.js binary. 

##<a id="deploymentscript"></a>Using a Deployment Script

Upon deployment of a Node.js app, Azure Websites runs a number of small commands to ensure that the environment is configured properly. Using a deployment script, this process can be customized to include the download and configuration of io.js.

The [io.js Deployment Script] is available on GitHub. To enable io.js on your website, simply copy **.deployment**, **deploy.cmd** and **IISNode.yml** to the root of your application folder and deploy to Azure Websites.  

The first file, **.deployment**, instructs Azure Websites to run **deploy.cmd** upon deployment. This script runs all the usual steps for a Node.js applicaion, but also downloads the latest version of io.js. Finally, **IISNode.yml** configures Azure Website to use the just downloaded io.js binary instead of a pre-installed Node.js binary.

> [AZURE.NOTE] To update the used io.js binary, just redeploy your application - the script will download a new version of io.js every single time the application is deployed.

##<a id="manualinstallation"></a>Using Manual Installation

The manual installation of a custom io.js version includes only two steps. First, download the **win-x64** binary directly from the [io.js distribution]. Required are two files - **iojs.exe** and **iojs.lib**. Save both files to a folder inside your website, for example in **bin/iojs**.

To configure Azure Websites to use **iojs.exe** instead of a pre-installed Node version, create a **IISNode.yml** file at the root of your application and add the following line. The **--harmony** flag is optional, but enables many of the ECMAScript 6 "Harmony" features that distinguish io.js from Node.js.

    nodeProcessCommandLine: "D:\home\site\wwwroot\bin\iojs\iojs.exe" --harmony

##<a id="nextsteps"></a>Next Steps

In this article you learned how to use io.js with Azure Websites, using both provided deployment scripts as well as manual installation. 

> [AZURE.NOTE] io.js is in heavy development and updated more frequently than Node.js. A number of Node.js modules might not work with io.js - please consult [io.js on GitHub] for troubleshooting.

[io.js]: https://iojs.org
[io.js distribution]: https://iojs.org/dist/
[io.js on GitHub]: https://github.com/iojs/io.js
[io.js Deployment Script]: https://github.com/felixrieseberg/iojs-azure
