<properties 
	pageTitle="Application Architecture on Microsoft Azure" 
	description="Architecture overview that covers common design patterns" 
	services="" 
	documentationCenter="" 
	authors="Rboucher" 
	manager="jwhit" 
	editor="mattshel"/>

<tags 
	ms.service="multiple" 
	ms.workload="na" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="07/06/2015" 
	ms.author="robb"/>

#Application Architecture on Microsoft Azure
Resources for building applications that use Microsoft Azure.

##Azure Architectural Design Patterns
Microsoft publishes series of architectural design patterns to help you compose your own custom designs. The patterns are intended to be concise architectural guides which can be composed together in order provide guidance on how to best leverage the Microsoft Azure platform to solve your organization’s business needs.


[Overview](../azure-architectures-cpif-overview/) - 
[Hybrid networking](../azure-architectures-cpif-infrastructure-hybrid-networking/) - 
[Offsite batch processing](../azure-architectures-cpif-foundation-offsite-batch-processing-tier/) -
[Multi-site data tier](../azure-architectures-cpif-foundation-multi-site-data-tier/) -
[Global load balanced web tier](../azure-architectures-cpif-foundation-global-load-balanced-web-tier/) -
[Azure search tier](../azure-architectures-cpif-foundation-azure-search-tier/)
 
Each  pattern contains
 
- A service description
- A list of Azure Services required to leverage the pattern
- Architectural diagrams
- Architectural dependencies
- Design limitations or considerations that may impact the pattern
- Interfaces and endpoints
- Anti-patterns
- Key high-level architecture considerations including availability and resiliency, composite SLAs for services used, scale and performance, cost and operational considerations.

##Microsoft Architecture Blueprints

Microsoft publishes a set of high level architecture blueprints showing how to build specific types of systems which include  Mirosoft products and Microsoft Azure services. Each blueprint includes a 2D Visio-based file that you can download and modify, a more colorful 3D PDF file to introduce the blueprint, and a video that walks through the 3D version. See 
[Microsoft Architecture Blueprints](http://msdn.microsoft.com/dn630664). 

The 2D Blueprint diagrams use the Cloud and Enterprise Symbol Set mentioned below.  

The 3D Blueprint PDFs are created in a non-Microsoft tool, but a Visio template is under development. See a [BETA training video of the template here.](http://aka.ms/3dBlueprintTemplate). To obtain the Visio 3d Blueprint Template beta, email [CnESymbols@microsoft.com](mailto:CnESymbols@microsoft.com). 

![Microsoft Architecture Blueprint 3D diagram](./media/architecture-overview/BluePrintThumb.jpg)

##Cloud and Enterprise Symbol/Icon set

[Download the Cloud and Enterprise Symbol/Icon set](http://aka.ms/CnESymbols) to create technical materials that describe Azure, Windows Server, SQL Server and other Microsoft products. You can use them in architecture diagrams, training materials, presentations, datasheets, infographics, whitepapers and even 3rd party books if the book trains people to use Microsoft products. The symbols are in Visio and PNG formats. Instructions on how to use the PNGs in PowerPoint are included. 

The symbol set ships quarterly and is updated as new services are released. If you want a preview of the newest release, which may include additional Azure services, email [CnESymbols@microsoft.com](mailto:CnESymbols@microsoft.com).  

We’d like to know what you think, so there are instructions for providing feedback in the download. If you've used the symbols, fill out the short 5 question [survey](http://aka.ms/azuresymbolssurveyv2) or email us at the address above to let us know if they are useful and how you use them.  

Additional symbols are available in the [Microsoft Office Visio stencil](http://www.microsoft.com/en-us/download/details.aspx?id=35772), though they are not optimized for architectural diagrams like the CnE set is.  

![Cloud and Enterprise Symbol/Icon set](./media/architecture-overview/CnESymbols.png)

##Design patterns
Microsoft Patterns and Practices has published the book [Cloud Design Patterns](http://msdn.microsoft.com/library/dn568099.aspx) which is available both on MSDN and in PDF download. There is also a large format poster available which lists all the patterns. 

![Patterns and Practices Cloud Patterns Poster](./media/architecture-overview/PnPPatternPosterThumb.jpg)

##Architecture Infographics
Microsoft publishes several architecture related posters/infographics. They include [Building Real-World Cloud Applications](http://azure.microsoft.com/documentation/infographics/building-real-world-cloud-apps/) and [Scaling with Cloud Services](http://azure.microsoft.com/documentation/infographics/cloud-services/) . 

![Azure Architecture Infographics](./media/architecture-overview/AzureArchInfographicThumb.jpg)
