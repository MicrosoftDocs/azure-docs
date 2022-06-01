---
author: dlepow
ms.service: api-management
ms.topic: include
ms.date: 12/15/2021
ms.author: danlep
---

## Troubleshooting

* **Unsuccessful initial deployment of API Management service into a subnet** 
  * Deploy a virtual machine into the same subnet. 
  * Connect to the virtual machine and validate connectivity to one of each of the following resources in your Azure subscription:
    * Azure Storage blob
    * Azure SQL Database
    * Azure Storage Table
    * Azure Key Vault (for an API Management instance hosted on the [`stv2` platform](../articles/api-management/compute-infrastructure.md))

  > [!IMPORTANT]
  > After validating the connectivity, remove all the resources in the subnet before deploying API Management into the subnet (required when API Management is hosted on the `stv1` platform).

* **Verify network status**  
  * After deploying API Management into the subnet, use the portal to check the connectivity of your instance to dependencies, such as Azure Storage. 
  * In the portal, in the left-hand menu, under **Deployment and infrastructure**, select **Network** > **Network status**.

   :::image type="content" source="../articles/api-management/media/api-management-using-with-vnet/verify-network-connectivity-status.png" alt-text="Verify network connectivity status in the portal":::

  | Filter | Description |
  | ----- | ----- |
  | **Required** | Select to review the required Azure services connectivity for API Management. Failure indicates that the instance is unable to perform core operations to manage APIs. |
  | **Optional** | Select to review the optional services connectivity. Failure indicates only that the specific functionality will not work (for example, SMTP). Failure may lead to degradation in using and monitoring the API Management instance and providing the committed SLA. |

  To address connectivity issues, review [network configuration settings](../articles/api-management/virtual-network-reference.md) and fix required network settings.

* **Incremental updates**  
  When making changes to your network, refer to [NetworkStatus API](/rest/api/apimanagement/current-ga/network-status) to verify that the API Management service has not lost access to critical resources. The connectivity status should be updated every 15 minutes. 

  To apply a network configuration change to the API Management instance using the portal:

    1. In the left-hand menu for your instance, under **Deployment and infrastructure**, select **Virtual network**.
    1. Select **Apply network configuration**. 

* **Resource navigation links**  
  An APIM instance hosted on the [`stv1` compute platform](../articles/api-management/compute-infrastructure.md), when deployed into a Resource Manager VNET subnet, reserves the subnet by creating a resource navigation link. If the subnet already contains a resource from a different provider, deployment will **fail**. Similarly, when you delete an API Management service, or move it to a different subnet, the resource navigation link will be removed.