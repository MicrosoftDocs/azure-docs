---

title="Creating an App Service Environment using a resource manager template" 
description="Explains how to create an External or ILB App Service Environment using an ARM template" 
services: app-service
documentationcenter: ''
author: ccompy
manager: stefsch
editor: ''

ms.assetid: 
ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/08/2017
ms.author: ccompy

---


# Create an ASE from a template #





<!--Links-->
[Intro]: http://azure.microsoft.com/documentation/articles/app-service-env-intro/
[MakeExternalASE]: http://azure.microsoft.com/documentation/articles/app-service-env-create-external-ase/
[MakeASEfromTemplate]: http://azure.microsoft.com/documentation/articles/app-service-env-create-from-template/
[MakeILBASE]: http://azure.microsoft.com/documentation/articles/app-service-env-create-ilb-ase/
[ASENetwork]: http://azure.microsoft.com/documentation/articles/app-service-env-network-info/
[ASEReadme]: http://azure.microsoft.com/documentation/articles/app-service-env-readme/
[UsingASE]: http://azure.microsoft.com/documentation/articles/app-service-env-using-an-ase/
[UDRs]: http://docs.microsoft.com/azure/virtual-network/virtual-networks-udr-overview/
[NSGs]: http://docs.microsoft.com/azure/virtual-network/virtual-networks-nsg/
[ConfigureASEv1]: http://azure.microsoft.com/documentation/articles/app-service-web-configure-an-app-service-environment/
[ASEv1Intro]: http://azure.microsoft.com/documentation/articles/app-service-app-service-environment-intro/
[webapps]: http://azure.microsoft.com/documentation/articles/app-service-web-overview/
[mobileapps]: http://azure.microsoft.com/documentation/articles/app-service-mobile-value-prop-preview/
[APIapps]: http://azure.microsoft.com/documentation/articles/app-service-api-apps-why-best-platform/
[Functions]: https://docs.microsoft.com/en-us/azure/azure-functions/
[Pricing]: http://azure.microsoft.com/pricing/details/app-service/
[ARMOverview]: http://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview
[ConfigureSSL]: http://docs.microsoft.com/azure/app-service-web/web-sites-purchase-ssl-web-site/
[Kudu]: http://azure.microsoft.com/resources/videos/super-secret-kudu-debug-console-for-azure-web-sites/
[AppDeploy]: http://docs.microsoft.com/azure/app-service-web/web-sites-deploy/