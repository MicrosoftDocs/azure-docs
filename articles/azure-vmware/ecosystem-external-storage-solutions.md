--- 

title: External storage solutions (preview)
description: Learn about external storage solutions for Azure VMware Solution private cloud.
ms.topic: how-to
author: jjaygbay1
ms.author: jacobjaygbay
ms.service: azure-vmware
ms.date: 08/04/2023

--- 

# External storage solutions (preview) 

> [!NOTE] 
> Pure Cloud Block Store is available in preview for Azure VMware Solution. By using this feature, you agree to following [Microsoft’s supplemental Terms of Use](https://azure.microsoft.com /support/legal/preview-supplemental-terms/). It is advised NOT to run production workloads with preview features. 

## External storage solutions for Azure VMware Solution (preview) 

Azure VMware Solution is a Hyperconverged Infrastructure (HCI) service that offers VMware vSAN as the primary storage option. However, a significant requirement with on-premises VMware deployments is external storage, especially block storage. Providing the same consistent external block storage architecture in the cloud is crucial for some customers, a lack of which leaves those workloads stranded from cloud migration or deployment. As a key principle of Azure VMware Solution is to enable customers to continue to use their investments and their favorite VMware solutions running on Azure, we engaged storage providers with similar goals. 

Pure Cloud Block Store, offered by Pure Storage, is one such solution. It helps bridge the gap by allowing customers to provision external block storage as needed to make full use of an Azure VMware Solution deployment without the need to scale out compute resources, while helping customers migrate their on-premises workloads to Azure. Pure Cloud Block Store is a 100% software-delivered product running entirely on native Azure infrastructure that brings all the relevant Purity features and capabilities to Azure. 

## Onboarding and support

Pure Cloud Block Store is now available in preview for Azure VMware Solution and Pure Storage manages onboarding. If you are interested in joining the preview, reach out to avs@purestorage.com. Pure Cloud Block Store is enabled and led by Pure Storage. Since this solution is managed and installed by the customer, they should reach out to Pure Storage for support.

See the following resources for more information: 

- [Azure VMware Solution + CBS Implementation Guide](https://support.purestorage.com/Pure_Cloud_Block_Store/Azure_VMware_Solution_and_Cloud_Block_Store_Implementation_Guide)
- [CBS Deployment Guide](https://support.purestorage.com/Pure_Cloud_Block_Store/Pure_Cloud_Block_Store_on_Azure_Implementation_Guide)
- [Troubleshooting Guide](https://support.purestorage.com/Pure_Cloud_Block_Store/Pure_Cloud_Block_Store_on_Azure_Implementation_Guide)
- [Videos](https://support.purestorage.com/Pure_Cloud_Block_Store/Azure_VMware_Solution_and_Cloud_Block_Store_Video_Demos) 


