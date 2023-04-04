---
title: What is Azure Service Health?
description: Personalized information about how your Azure apps are affected by current and future Azure service problems and maintenance. 
ms.topic: overview
ms.date: 05/10/2019
---
# What is Azure Service Health?

Azure offers a suite of experiences to keep you informed about the health of your cloud resources. This information includes current and upcoming issues such as service impacting events, planned maintenance, and other changes that may affect your availability.

Azure Service Health is a combination of three separate smaller services.

[Azure status](azure-status-overview.md) informs you of service outages in Azure on the **[Azure Status page](https://azure.status.microsoft)**. The page is a global view of the health of all Azure services across all Azure regions. The status page is a good reference for incidents with widespread impact, but we strongly recommend that current Azure users leverage Azure service health to stay informed about Azure incidents and maintenance.

[Service health](service-health-overview.md) provides a personalized view of the health of the Azure services and regions you're using. This is the best place to look for service impacting communications about outages, planned maintenance activities, and other health advisories because the authenticated Service Health experience knows which services and resources you currently use. The best way to use Service Health is to set up Service Health alerts to notify you via your preferred communication channels when service issues, planned maintenance, or other changes may affect the Azure services and regions you use.

[Resource health](resource-health-overview.md) provides information about the health of your individual cloud resources such as a specific virtual machine instance. Using Azure Monitor, you can also configure alerts to notify you of availability changes to your cloud resources. Resource Health along with Azure Monitor notifications will help you stay better informed about the availability of your resources minute by minute and quickly assess whether an issue is due to a problem on your side or related to an Azure platform event.

Together, these experiences provide you with a comprehensive view into the health of Azure, at the granularity that is most relevant to you.

**Watch an overview of the Azure Status page, Azure Service Health, and Azure Resource Health**

>[!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE2OgX6]

[!INCLUDE [azure-lighthouse-supported-service](../../includes/azure-lighthouse-supported-service.md)]