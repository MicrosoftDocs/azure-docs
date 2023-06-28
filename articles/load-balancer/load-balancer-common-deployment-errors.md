---
title: Troubleshoot common deployment errors
titleSuffix: Azure Load Balancer
description: Describes how to resolve common errors when you deploy Azure Load Balancers.
services: load-balancer
tags: top-support-issue
author: mbender-ms
ms.service: load-balancer
ms.topic: troubleshooting
ms.date: 04/20/2023
ms.author: mbender
ms.custom: template-concept, engagement-fy23
---

# Troubleshoot common Azure deployment errors with Azure Load Balancer

This article describes some common Azure Load Balancer deployment errors and provides information to resolve the errors. If you're looking for information about an error code and that information isn't provided in this article, let us know. At the bottom of this page, you can leave feedback. The feedback is tracked with GitHub Issues.

## Error codes

| Error code | Details and mitigation |
| ------- | ---------- |
|DifferentSkuLoadBalancersAndPublicIPAddressNotAllowed| Both Public IP SKU and Load Balancer SKU must match. Ensure Azure Load Balancer and Public IP SKUs match. Standard SKU is recommended for production workloads. Learn more about the [differences in SKUs](./skus.md)  |
|DifferentSkuLoadBalancerAndPublicIPAddressNotAllowedInVMSS | Virtual Machine Scale Sets default to Basic Load Balancers when SKU is unspecified or deployed without Standard Public IPs. Redeploy Virtual Machine Scale Set with Standard Public IPs on the individual instances to ensure Standard Load Balancer is selected or select a Standard LB when deploying Virtual Machine Scale Set from the Azure portal. |
|MaxAvailabilitySetsInLoadBalancerReached | The backend pool of a Load Balancer can contain a maximum of 150 availability sets. If you don't have availability sets explicitly defined for your VMs in the backend pool, each single VM goes into its own Availability Set. So deploying 150 standalone VMs would imply that it would have 150 Availability sets, thus hitting the limit. You can deploy an availability set and add more VMs to it as a workaround. |
|NetworkInterfaceAndLoadBalancerAreInDifferentAvailabilitySets | For Basic Sku load balancer, network interface and load balancer have to be in the same availability set. |
|RulesOfSameLoadBalancerTypeUseSameBackendPortProtocolAndIPConfig| You can't have more than one rule on a given load balancer type (internal, public) with same backend port and protocol referenced by same Virtual Machine Scale Set. Update your rule to change this duplicate rule creation. |
|RulesOfSameLoadBalancerTypeUseSameBackendPortProtocolAndVmssIPConfig| You can't have more than one rule on a given load balancer type (internal, public) with same backend port and protocol referenced by same Virtual Machine Scale Set. Update your rule parameters to change this duplicate rule creation. |
|AnotherInternalLoadBalancerExists| You can have only one Load Balancer of type internal reference the same set of VMs/network interfaces in the backend of the Load Balancer. Update your deployment to ensure you're creating only one Load Balancer of the same type. |
|CannotUseInactiveHealthProbe| You can't have a probe that's not used by any rule configured for Virtual Machine Scale Set health. Ensure that the probe that is set up is being actively used. |
|VMScaleSetCannotUseMultipleLoadBalancersOfSameType| You can't have multiple Load Balancers of the same type (internal, public). You can have a maximum of one internal and one public Load Balancer. |
|VMScaleSetCannotReferenceLoadbalancerWhenLargeScaleOrCrossAZ | Basic Load Balancer isn't supported for multiple-placement group Virtual Machine Scale Sets or cross-availability zone Virtual Machine Scale Set. Use Standard Load Balancer instead. |
|MarketplacePurchaseEligibilityFailed | Switch to the correct Administrative account to enable purchases due to subscription being an EA Subscription. You can read more [here](../marketplace/marketplace-faq-publisher-guide.yml#what-could-block-a-customer-from-completing-a-purchase-). |
|ResourceDeploymentFailure| If your load balancer is in a failed state, follow these steps to bring it back from the failed state:<ol><li>Go to https://resources.azure.com, and sign in with your Azure portal credentials.</li><li>Select **Read/Write**.</li><li>On the left, expand **Subscriptions**, and then expand the Subscription with the Load Balancer to update.</li><li>Expand **ResourceGroups**, and then expand the resource group with the Load Balancer to update.</li><li>Select **Microsoft.Network** > **LoadBalancers**, and then select the Load Balancer to update, **LoadBalancer_1**.</li><li>On the display page for **LoadBalancer_1**, select **GET** > **Edit**.</li><li>Update the **ProvisioningState** value from **Failed** to **Succeeded**.</li><li>Select **PUT**.</li></ol>|
|LoadBalancerWithoutFrontendIPCantHaveChildResources | A Load Balancer resource that has no frontend IP configurations, can't have associated child resources or components associated to it. In order to mitigate this error, add a frontend IP configuration and then add the resources you're trying to add. |
| LoadBalancerRuleCountLimitReachedForNic | A backend pool member's network interface (virtual machine, Virtual Machine Scale Set) can't be associated to more than 300 rules. Reduce the number of rules or use another Load Balancer. This limit is documented on the [Load Balancer limits page](../azure-resource-manager/management/azure-subscription-service-limits.md#load-balancer).
| LoadBalancerInUseByVirtualMachineScaleSet | The Load Balancer resource is in use by a Virtual Machine Scale Set and can't be deleted. Use the Azure Resource Manager ID provided in the error message to search for the Virtual Machine Scale Set in order to delete it. | 


## Next steps

* Look through the Azure Load Balancer [SKU comparison table](./skus.md)
* Learn about [Azure Load Balancer limits](../azure-resource-manager/management/azure-subscription-service-limits.md#load-balancer)