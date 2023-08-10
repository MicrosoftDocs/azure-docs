---
author: dlepow
ms.service: api-management
ms.topic: include
ms.date: 06/16/2023
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

   :::image type="content" source="../articles/api-management/media/api-management-using-with-vnet/verify-network-connectivity-status.png" alt-text="Screenshot of verify network connectivity status in the portal." lightbox="../articles/api-management/media/api-management-using-with-vnet/verify-network-connectivity-status.png":::

  | Filter | Description |
  | ----- | ----- |
  | **Required** | Select to review the required Azure services connectivity for API Management. Failure indicates that the instance is unable to perform core operations to manage APIs. |
  | **Optional** | Select to review the optional services connectivity. Failure indicates only that the specific functionality won't work (for example, SMTP). Failure may lead to degradation in using and monitoring the API Management instance and providing the committed SLA. |

  To help troubleshoot connectivity issues, select:

  * **Metrics** - to review network connectivity status metrics 

  * **Diagnose** - to run a virtual network verifier over a specified time period

  To address connectivity issues, review [network configuration settings](../articles/api-management/virtual-network-reference.md) and fix required network settings.

* **Incremental updates**  
  When making changes to your network, refer to [NetworkStatus API](/rest/api/apimanagement/current-ga/network-status) to verify that the API Management service hasn't lost access to critical resources. The connectivity status should be updated every 15 minutes. 

  To apply a network configuration change to the API Management instance using the portal:

    1. In the left-hand menu for your instance, under **Deployment and infrastructure**, select **Network** > **Virtual network**.
    1. Select **Apply network configuration**. 

* **Resource navigation links**  
  An API Management instance hosted on the [`stv1` compute platform](../articles/api-management/compute-infrastructure.md), when deployed into a Resource Manager VNet subnet, reserves the subnet by creating a resource navigation link. If the subnet already contains a resource from a different provider, deployment will **fail**. Similarly, when you delete an API Management service, or move it to a different subnet, the resource navigation link will be removed.
  
 * **Challenges encountered in reassigning API Management instance to previous subnet**
   * When moving an API Management instance back to its original subnet, immediate reassignment may not be possible due to the VNet lock, which takes up to six hours to be removed. If the original subnet has other API Management services (cloud service-based), deleting them and waiting for 6 hours is necessary for deploying a VMSS-based service in the same subnet. 
   * Another scenario to consider is the presence of a scope lock at the resource group level or higher, hindering the Resource Navigation Link Deletion process. To resolve this, remove the scope lock and allow a delay of approximately 4-6 hours for the API Management service to unlink from the original subnet before the lock removal, enabling deployment to the desired subnet.
