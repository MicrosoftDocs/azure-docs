---
title: Swap or switch deployments in Azure Cloud Services (extended support)
description: Learn how to swap or switch between deployments in Azure Cloud Services (extended support).
ms.topic: how-to
ms.service: cloud-services-extended-support
ms.custom: devx-track-arm-template
author: surbhijain
ms.author: surbhijain
ms.reviewer: gachandw
ms.date: 04/01/2021
---

# Swap or switch deployments in Azure Cloud Services (extended support)

You can swap between two independent cloud service deployments in Azure Cloud Services (extended support). Unlike in Azure Cloud Services (classic), the Azure Resource Manager model in Azure Cloud Services (extended support) doesn't use deployment slots. In Azure Cloud Services (extended support), when you deploy a new release of a cloud service, you can make the cloud service "swappable" with an existing cloud service in Azure Cloud Services (extended support).

After you swap the deployments, you can stage and test your new release by using the new cloud service deployment. In effect, swapping promotes a new cloud service that's staged to production release.

> [!NOTE]
> You can't swap between an Azure Cloud Services (classic) deployment and an Azure Cloud Services (extended support) deployment.

You must make a cloud service swappable with another cloud service when you deploy the second of a pair of cloud services for the first time. Once the second pair of cloud service is deployed, it can not be made swappable with an existing cloud service in subsequent updates.

You can swap the deployments by using an Azure Resource Manager template (ARM template), the Azure portal, or the REST API.

Upon deployment of the second cloud service, both the cloud services have their SwappableCloudService property set to point to each other. Any subsequent update to these cloud services will need to specify this property failing which an error will be returned indicating that the SwappableCloudService property cannot be deleted or updated.

Once set, the SwappableCloudService property is treated as readonly. It cannot be deleted or changed to another value. Deleting one of the cloud services (of the swappable pair) will result in the SwappableCloudService  property of the remaining cloud service being cleared.

## ARM template

If you use an ARM template deployment method, to make the cloud services swappable, set the `SwappableCloudService` property in `networkProfile` in the `cloudServices` object to the ID of the paired cloud service:

```json
"networkProfile": {
 "SwappableCloudService": {
              "id": "[concat(variables('swappableResourcePrefix'), 'Microsoft.Compute/cloudServices/', parameters('cloudServicesToBeSwappedWith'))]"
            },
        }
```

## Azure portal

To swap a deployment in the Azure portal:

1. In the portal menu, select **Cloud Services (extended support)** or **Dashboard**.
1. Select the cloud service you want to update.
1. In **Overview** for the cloud service, select **Swap**:

   :::image type="content" source="media/swap-cloud-service-portal-swap.png" alt-text="Screenshot that shows the swap tab for the cloud service.":::

1. In the swap confirmation pane, verify the deployment information, and then select **OK** to swap the deployments:

   :::image type="content" source="media/swap-cloud-service-portal-confirm.png" alt-text="Screenshot that shows confirming the deployment swap information.":::

Deployments swap quickly because the only thing that changes is the virtual IP address for the cloud service that's deployed.

To save compute costs, you can delete one of the cloud services (designated as a staging environment for your application deployment) after you verify that your swapped cloud service works as expected.

## REST API

To use the [REST API](/rest/api/load-balancer/load-balancers/swap-public-ip-addresses) to swap to a new cloud services deployment in Azure Cloud Services (extended support), use the following command and JSON configuration:

```http
POST https://management.azure.com/subscriptions/subid/providers/Microsoft.Network/locations/westus/setLoadBalancerFrontendPublicIpAddresses?api-version=2021-02-01
```

```json
{
  "frontendIPConfigurations": [
    {
      "id": "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/loadBalancers/lb1/frontendIPConfigurations/lbfe1",
      "properties": {
        "publicIPAddress": {
          "id": "/subscriptions/subid/resourceGroups/rg2/providers/Microsoft.Network/publicIPAddresses/pip2"
        }
      }
    },
    {
      "id": "/subscriptions/subid/resourceGroups/rg2/providers/Microsoft.Network/loadBalancers/lb2/frontendIPConfigurations/lbfe2",
      "properties": {
        "publicIPAddress": {
          "id": "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/publicIPAddresses/pip1"
        }
      }
    }
  ]
}
```

## Common questions about swapping deployments

Review these answers to common questions about deployment swaps in Azure Cloud Services (extended support).

### What are the prerequisites for swapping to a new cloud services deployment?

You must meet two key prerequisites for a successful deployment swap in Azure Cloud Services (extended support):

* If you want to use a static or reserved IP address for one of the swappable cloud services, the other cloud service must also use a reserved IP address. Otherwise, the swap fails.
* All instances of your roles must be running for the swap to succeed. To check the status of your instances, in the Azure portal, go to **Overview** for the newly deployed cloud service, or use the `Get-AzRole` command in Windows PowerShell.

Guest OS updates and service healing operations might cause a deployment swap to fail. For more information, see [Troubleshoot cloud service deployments](../cloud-services/cloud-services-troubleshoot-deployment-problems.md).

### Can I make a VIP swap in parallel with another mutating operation?

No. A VIP swap is a networking-only change that must finish before any other compute operation is started on a cloud service. Starting an update, delete, or autoscale operation for a cloud service while a VIP swap is in progress or triggering a VIP swap while another compute operation is in progress might put the cloud service in a state of unrecoverable error.

### Does a swap incur downtime for my application, and how should I handle it?

A cloud service swap usually is fast because it's only a configuration change in the Azure load balancer. In some cases, the swap might take 10 or more seconds and result in transient connection failures. To limit the effect of the swap on users, consider implementing client retry logic.

## Next steps 

* Review [deployment prerequisites](deploy-prerequisite.md) for Azure Cloud Services (extended support).
* Review [frequently asked questions](faq.yml) for Azure Cloud Services (extended support).
* Deploy an Azure Cloud Services (extended support) cloud service by using one of these options:
  * [Azure portal](deploy-portal.md)
  * [PowerShell](deploy-powershell.md)
  * [ARM template](deploy-template.md)
  * [Visual Studio](deploy-visual-studio.md)
