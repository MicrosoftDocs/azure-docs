--- 
title: External storage solutions for Azure VMware Solution (preview)
description: Learn about external storage solutions for Azure VMware Solution private cloud.
ms.topic: how-to
author: jjaygbay1
ms.author: jacobjaygbay
ms.service: azure-vmware
ms.date: 08/07/2023
--- 

# External storage solutions (preview) 

> [!NOTE] 
> By using Pure Cloud Block Store, you agree to the following [Microsoft supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). It is advised NOT to run production workloads with preview features. 

## External storage solutions for Azure VMware Solution (preview) 

Azure VMware Solution is a Hyperconverged Infrastructure (HCI) service that offers VMware vSAN as the primary storage option. However, a significant requirement with on-premises VMware deployments is external storage, especially block storage. Providing the same consistent external block storage architecture in the cloud is crucial for some customers. Some workloads can't be migrated or deployed to the cloud without consistent external block storage. As a key principle of Azure VMware Solution is to enable customers to continue to use their investments and their favorite VMware solutions running on Azure, we engaged storage providers with similar goals. 

Pure Cloud Block Store, offered by Pure Storage, is one such solution. It helps bridge the gap by allowing customers to provision external block storage as needed to make full use of an Azure VMware Solution deployment without the need to scale out compute resources, while helping customers migrate their on-premises workloads to Azure. Pure Cloud Block Store is a 100% software-delivered product running entirely on native Azure infrastructure that brings all the relevant Purity features and capabilities to Azure. 

## Onboarding and support

During preview, Pure Storage manages onboarding of Pure Cloud Block Store for Azure VMware Solution. You can join the preview by emailing [avs@purestorage.com](mailto:avs@purestorage.com). As Pure Cloud Block Store is a customer deployed and managed solution, please reach out to Pure Storage for Customer Support.

For more information, see the following resources: 

- [Azure VMware Solution + CBS Implementation Guide](https://support.purestorage.com/Pure_Cloud_Block_Store/Azure_VMware_Solution_and_Cloud_Block_Store_Implementation_Guide)
- [CBS Deployment Guide](https://support.purestorage.com/Pure_Cloud_Block_Store/Pure_Cloud_Block_Store_on_Azure_Implementation_Guide)
- [Troubleshooting CBS Deployment](https://support.purestorage.com/Pure_Cloud_Block_Store/Pure_Cloud_Block_Store_on_Azure_-_Troubleshooting_Guide)
- [Videos](https://support.purestorage.com/Pure_Cloud_Block_Store/Azure_VMware_Solution_and_Cloud_Block_Store_Video_Demos)
