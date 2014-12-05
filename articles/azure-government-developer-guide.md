<properties title="Azure Government Developers Guide" pageTitle="Azure Government Developers Guide" description="This provides a comparision of features and guidance on developing applications for Azure Government" metaKeywords="Azure Government AzureGov GovCloud" services="" solutions="" documentationCenter="" authors="John Harvey" videoId="" scriptId="" manager="required" />

<tags ms.service="Azure Government" ms.devlang="en-us" ms.topic="article" ms.tgt_pltfrm="may be required" ms.workload="required" ms.date="12/4/2014" ms.author="jharve" />




<!--This is a basic template that shows you how to use mark down to create a topic that includes a TOC, sections with subheadings, links to other azure.microsoft.com topics, links to other sites, bold text, italic text, numbered and bulleted lists, code snippets, and images. For fancier markdown, find a published topic and copy the markdown or HTML you want. For more details about using markdown, see http://sharepoint/sites/azurecontentguidance/wiki/Pages/Content%20Guidance%20Wiki%20Home.aspx.-->

<!--Properties section (above): this is required in all topics. Please fill it out! See http://sharepoint/sites/azurecontentguidance/wiki/Pages/Markdown%20tagging%20-%20add%20a%20properties%20section%20to%20your%20markdown%20file%20to%20specify%20metadata%20values.aspx for details. -->

<!-- Tags section (above): this is required in all topics. Please fill it out! See http://sharepoint/sites/azurecontentguidance/wiki/Pages/Markdown%20tagging%20-%20add%20a%20tags%20section%20to%20your%20markdown%20file%20to%20specify%20metadata%20for%20reporting.aspx for details. -->

<!--The next line, with one pound sign at the beginning, is the page title--> 
#  Microsoft Azure Government Developer Guide 

<p> Microsoft Azure Government is a physically and network isolated instance of Microsoft Azure.  This developers guide will provide details on the differences that application developers and administrators would need to interact and work with these seperate regions of Azure.

<!--Table of contents for topic, the words in brackets must match the heading wording exactly-->


## In this topic


+ Overview
+ Guidance for Developers
+ Features currently available in Microsoft Azure Government
+ Endpoint Mapping


## Overview

Microsoft Azure Government is a separate instance of the Microsoft Azure service addressing the security and compliance needs of U.S. federal agencies, state and local governments and their solutions providers. Azure Government offers physical and network isolation from non-U.S. government deployments and provides screened U.S. personnel. 

Microsoft provides a number of tools to create and deploy cloud applications to Microsoft’s global Microsoft Azure service (“Global Service”) and Microsoft Azure Government services.

When creating and deploying applications to the Azure Government Services, as opposed to the Global Service, developers need to know the key differences of the two services.  Specifically around setting up and configuring their programming environment, configuring endpoints, writing applications, and deploying them as services to Azure Government.

The information in this document summarizes those differences and supplements the information available on the [Azure Government](http://www.azure.com/gov "Azure Government") site and the [Microsoft Azure Technical Library](http://msdn.microsoft.com/cloud-app-development-msdn "MSDN") on MSDN. Official information may also be available in many other locations such as the [Microsoft Azure Trust Center](http://azure.microsoft.com/en-us/support/trust-center/ "Microsoft Azure Trust Center"), [Azure Documentation Center](http://azure.microsoft.com/en-us/documentation/) and in [Azure Blogs](http://azure.microsoft.com/blog/ "Azure Blogs"). 

This content is intended for partners and developers who are deploying to Microsoft Azure Government.



## Guidance for Developers
Because most of the technical content that is available currently assumes that applications are being developed for the Global Service rather than for Microsoft Azure Government, it’s important for you to ensure that developers are aware of key differences for applications developed to be hosted in Azure Government.

- First, there are services and feature differences, this means that certain features that are in specific regions of the Global Service may not be available in Azure Government.

- Second, for features that are offered in Azure Government, there are configuration differences from the Global Service.  Therefore, you should review your sample code, configurations and steps to ensure that you are building and executing within the Azure Government Cloud Services environment.


## Features currently available in Microsoft Azure Government
Azure Government currently has the following services available in both US GOV IOWA and US GOV VIRGINIA regions:

- Virtual Machines
- Cloud Services
- Storage
- Active Directory
- Scheduler
- Virtual Networking

Other services are available, for example Azure SQL DB is currently in Preview, and more services will be added on a continuous basis.  For the most current list of services, please see the [regions page](http://azure.microsoft.com/en-us/regions/#services) which will highlight each available region and their services.  

Currently, US GOV Iowa and US GOV Virginia are the data centers supporting Azure Government.  Please refer to the regions page above for current data centers and services available.

## Endpoint Mapping

Use the following table to guide you when mapping public Microsoft Azure and SQL Database endpoints to Azure Government specific endpoints.

<table>
<tr style='font-weight:bold'><td>
Service Type</td><td>	Azure Public</td><td>	Azure Government
</td></tr><tr><td>
Azure Government Home</td><td>	windowsazure.com	</td><td>microsoftazure.us
</td></tr><tr><td>
Management Portal</td><td>	manage.windowsazure.com</td><td>	manage.windowsazure.us
</td></tr><tr><td>
General</td><td>	*.windows.net	</td><td>*.usgovcloudapi.net
</td></tr><tr><td>
Core	</td><td>*.core.windows.net	</td><td>*.core.usgovcloudapi.net
</td></tr><tr><td>
Compute	</td><td>*.cloudapp.net	</td><td>*.usgovcloudapp.net
</td></tr><tr><td>
Blob Storage</td><td>	*.blob.core.windows.net</td><td>	*.blob.core.usgovcloudapi.net
</td></tr><tr><td>
Queue Storage	</td><td>*.queue.core.windows.net</td><td>	*.queue.core.usgovcloudapi.net
</td></tr><tr><td>
Table Storage</td><td>	*.table.core.windows.net	</td><td>*.table.core.usgovcloudapi.net
</td></tr><tr><td>
SQL Database</td><td>	*.database.windows.net	</td><td>*.database.usgovcloudapi.net
</td></tr><tr><td>
Service Management</td><td>	https://management.core.windows.net</td><td>	https://management.core.usgovcloudapi.net
</td></tr></table>




<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps

If you are interested in learning more and about Azure Government and how your organization can qualify to access, please go to <A href="http://azure.microsoft.com/gov">http://azure.microsoft.com/gov</a>

<!--Anchors-->
[Subheading 1]: #subheading-1
[Subheading 2]: #subheading-2
[Subheading 3]: #subheading-3
[Next steps]: #next-steps


<!-- Images. -->

[1]: ./media/azure-government-developer-guide/publisherguide.png


<!--Link references-->
[Link 1 to another azure.microsoft.com documentation topic]: ../virtual-machines-windows-tutorial/
[Link 2 to another azure.microsoft.com documentation topic]: ../web-sites-custom-domain-name/
[Link 3 to another azure.microsoft.com documentation topic]: ../storage-whatis-account/
