---
title: Azure Firewall prescaling
description: You can enable prescaling to proactively set a minimum and maximum number of firewall capacity units (instances) for predictable performance.
author: sujamiya
ms.service: azure-firewall
services: firewall
ms.topic: concept-article
ms.date: 10/13/2025
ms.author: sujamiya
# Customer intent: As a network security administrator, I want to enable Prescaling on my Azure Firewall, so that I can proactively set a minimum and maximum number of firewall capacity units (instances) for predictable performance during high-traffic events.
---

# Azure Firewall prescaling

Azure Firewall supports built-in autoscaling to dynamically adjust capacity based on CPU utilization, throughput, and connection volume. For mission-critical workloads or predictable traffic spikes (for example, Black Friday or migrations), you can configure greater control to ensure consistent performance.

**Prescaling** allows you to proactively set minimum and maximum capacity units. This configuration provides predictable performance while autoscaling occurs within the defined range.

## Key benefits

With prescaling, you can:

- **Pre-provision capacity** for high-traffic events or known traffic spikes
- **Maintain consistent performance** by setting a baseline capacity
- **Observe live capacity** with the Observed Capacity metric

## How prescaling works

You can configure two properties in the autoscaleConfiguration setting:

| Property | Description | Allowed range |
|----------|-------------|---------------|
| minCapacity | The minimum number of capacity units always provisioned | 2 to 50 |
| maxCapacity | The maximum number of capacity units the firewall can scale to | 2 to 50 |

When minCapacity and maxCapacity are set to the same value, the firewall runs at a fixed capacity with no autoscaling.

> [!NOTE]
> The minimum and maximum capacity values must either be equal, or their difference must be greater than 1. For example, if minCapacity is 5, maxCapacity must be at least 7.

## Configuration options

You can configure prescaling using the Azure portal, Azure PowerShell, ARM templates, or Bicep.

### Portal example

To configure prescaling in the Azure portal:

1. Navigate to your Azure Firewall resource.
1. Under **Settings**, select **Scaling options**.
1. Select **Prescaling**.
1. Set your desired minimum and maximum capacity values.

:::image type="content" source="media/prescaling/prescaling-portal.png" alt-text="Screenshot showing Azure Firewall prescaling minimum and maximum capacity settings in the Azure portal." lightbox="media/prescaling/prescaling-portal.png":::

### PowerShell example
```azurepowershell
New-AzFirewall `
  -Name "MyFirewall" `
  -ResourceGroupName "MyResourceGroup" `
  -Location "centralus" `
  -VirtualNetwork (Get-AzVirtualNetwork -Name "MyVNet" -ResourceGroupName "MyResourceGroup") `
  -PublicIpAddress (Get-AzPublicIpAddress -Name "MyFW-PublicIP" -ResourceGroupName "MyResourceGroup") `
  -MinCapacity 4 `
  -MaxCapacity 10
```
### Bicep Example
For reference, here’s an example configuration using a Bicep template where you can see the new autoscaleConfiguration property: [Azure Firewall Bicep template](/azure/templates/microsoft.network/azurefirewalls?pivots=deployment-language-bicep)

## Choosing capacity values

To determine the optimal minCapacity and maxCapacity values:

-  **Set a reasonable minimum to avoid unnecessary scaling**: Start with a minimum capacity that handles your typical peak traffic comfortably so scaling events are rare under normal conditions.
-  **Leave headroom with a higher maximum**: Set maxCapacity higher than your expected peak to handle unexpected surges. Azure Firewall autoscaling increases capacity up to your maxCapacity value.
-  **Monitor the Observed Capacity metric** to see how often scaling occurs and adjust minimum and maximum values as needed. If scaling happens frequently, consider raising minCapacity.
-  **Configure alerts** on the Observed Capacity metric to get notified when scaling events occur, so you can evaluate if adjustments are needed.

## Monitoring

Prescaling introduces new observability:

| Metric | Description |
|--------|-------------|
| Observed Capacity | Shows the number of capacity units currently provisioned and tracks scaling activity over time. Updates can take up to 30 minutes to appear. |
| Alerts | You can configure an alert for autoscaling events using the Observed Capacity metric. |

## Handling performance issues

If you experience packet drops or connectivity issues:

- **Review Observed Capacity** to assess capacity trends.
- **Consider increasing minimum capacity** to provide more capacity support or if frequent upward scales occur.
- **Use key telemetry metrics** such as Latency Probe, Throughput, and Observed Capacity to optimize scaling strategies.

## Limitations

Keep the following considerations in mind when using prescaling (Preview):

- **No region-level capacity guarantees**: Scaling might fail or be delayed if the region lacks capacity.
- **Fixed capacity disables autoscaling**: When minCapacity equals maxCapacity, autoscaling is disabled.
- **Retention of previous settings**: If your firewall already has autoscaleConfiguration values set, and you deploy or update the resource without specifying the autoscaleConfiguration property (such as via Bicep, ARM template, or other templates), the firewall keeps using the existing autoscaleConfiguration values. This behavior helps prevent accidental overwriting or loss of your scaling settings.
- **Configuration resets on resource changes**: Deleting, re-creating, or migrating the firewall might reset capacity values to defaults.
- **Active scaling or maintenance events**: Prescaling changes might fail if the firewall is midscale or during an upgrade. Retry after completion.

## Next steps

- Learn about [Monitoring Azure Firewall](monitor-firewall-reference.md)
- Review [Azure Firewall best practices](firewall-best-practices.md)

