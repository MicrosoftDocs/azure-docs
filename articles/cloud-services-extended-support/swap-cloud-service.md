---
title: Swap/Switch between two Azure Cloud Services (Extended Support)
description: Swap/Switch between two Azure Cloud Services (Extended Support)
ms.topic: how-to
ms.service: cloud-services-extended-support
author: surbhijain
ms.author: surbhijain
ms.reviewer: gachandw
ms.date: 04/01/2021
ms.custom: 
---

# Swap/Switch between two Azure Cloud Services (Extended Support)
With cloud services (extended support) you can swap between two independent cloud service deployments. Unlike cloud services (classic), the concept of slots does not exist with the Azure Resource Manager model. When you decide to deploy a new release of a cloud service (extended support), you can make it “swappable” with another existing cloud service (extended support) enabling you to stage and test your new release using this deployment. A cloud service can be made ‘swappable’ with another cloud service only at the time of deploying the second cloud service (of the pair). When using the ARM template-based deployment method, this is done by setting the SwappableCloudService property within the Network Profile of the Cloud Service object to the ID of the paired cloud service. 

```
"networkProfile": {
 "SwappableCloudService": {
              "id": "[concat(variables('swappableResourcePrefix'), 'Microsoft.Compute/cloudServices/', parameters('cloudServicesToBeSwappedWith'))]"
            },
```
> [!Note] 
> You cannot swap between a cloud service (classic) and a cloud service (extended support)

Use **Swap** to switch the URLs by which the two cloud services are addressed, in effect promoting a new cloud service (staged) to production release.
You can swap deployments from the Cloud Services page or the dashboard.

1. In the [Azure portal](https://portal.azure.com), select the cloud service you want to update. This step opens the cloud service instance blade.
2. On the blade, select **Swap**
   :::image type="content" source="media/swap-cloud-service-1.png" alt-text="Image shows the swap option the cloud service":::
   
3. The following confirmation prompt opens
   
   :::image type="content" source="media/swap-cloud-service-2.png" alt-text="Image shows swapping the cloud service":::
   
4. After you verify the deployment information, select OK to swap the deployments.
The swap happens quickly because the only thing that changes is the virtual IP addresses (VIPs) for the two cloud services.

To save compute costs, you can delete one of the cloud services (designated as a staging environment for your application deployment) after you verify that your swapped cloud service is working as expected.

The rest API to perform a ‘swap’ between two cloud services extended support deployments is below:
```http
POST https://management.azure.com/subscriptions/subId/providers/Microsoft.Network/locations/region/setLoadBalancerFrontendPublicIpAddresses?api-version=2020-11-01
```
```
{
  "frontendIPConfigurations": [
 	{
 	"id": "#LBFE1#",
 	"properties": {
 	"publicIPAddress": {
 	"id": "#PIP2#"
 	}
      }
    },
   {
 	"id": "#LBFE2#",
 	"properties": {
 	"publicIPAddress": {
 	"id": "#PIP1#"
	 }
       }
    }
  ]
 }
```
## Common questions about swapping deployments

### What are the prerequisites for swapping between two cloud services?
There are two key prerequisites for a successful cloud service (extended support) swap:
* If you want to use a static / reserved IP address for one of the swappable cloud services, the other cloud service must also use a reserved IP. Otherwise, the swap fails.
* All instances of your roles must be running before you can perform the swap. You can check the status of your instances on the Overview blade of the Azure portal. Alternatively, you can use the Get-AzRole command in Windows PowerShell.

Guest OS updates and service healing operations also can cause deployment swaps to fail. For more information, see Troubleshoot cloud service deployment problems.

### Can I perform a VIP Swap in parallel with another mutating operation?
No. VIP Swap is a networking only change that needs to complete before any other compute operation is performed on the cloud service(s). Performing an update, delete or autoscale operation on the cloud service(s) while a VIP Swap is in progress or triggering a VIP Swap while another compute operation is in progress can leave the cloud service in an undesired state from which recovery might not be possible. 

### Does a swap incur downtime for my application? How should I handle it?
As described in the previous section, a cloud service swap is typically fast because it's just a configuration change in the Azure load balancer. In some cases, it can take 10 or more seconds and result in transient connection failures. To limit impact to your customers, consider implementing client retry logic.

## Next steps 
- Review the [deployment prerequisites](deploy-prerequisite.md) for Cloud Services (extended support).
- Review [frequently asked questions](faq.md) for Cloud Services (extended support).
- Deploy a Cloud Service (extended support) using the [Azure portal](deploy-portal.md), [PowerShell](deploy-powershell.md), [Template](deploy-template.md) or [Visual Studio](deploy-visual-studio.md).
