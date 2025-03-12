---
author: dlepow
ms.service: azure-api-management
ms.topic: include
ms.date: 02/21/2025
ms.author: danlep
---

## Automatic migration

After the retirement date, we'll automatically migrate remaining `stv1` service instances to the `stv2` compute platform. All affected customers will be notified of the upcoming automatic migration a week in advance. Automatic migration might cause downtime for your upstream API consumers. You may still migrate your own instances before automatic migration takes place.

### Virtual network configuration may be removed during automatic migration

Im most cases, automatic migration retains the virtual network settings of your API Management instance, if they're configured. Under certain [special conditions](../articles/api-management/migrate-stv1-to-stv2-vnet.md#special-conditions-and-scenarios), the virtual network configuration of your `stv1` service instance is removed during automatic migration and, as a security measure, access to your service endpoints is blocked. If the network settings were removed during the migration process, you'll see a message in the portal similar to: `We have blocked access to all endpoints for your service`.

:::image type="content" source="media/api-management-automatic-migration/blocked-access.png" alt-text="Screenshot of blocked access to API Management in the portal.":::

While access is blocked, access to the API gateway, developer portal, direct management API, and Git repository is disabled. To restore access to your service endpoints:

1. Redeploy your API Management instance in your virtual network. For steps, see the guidance for deploying API Management in an [external](../articles/api-management/api-management-using-with-vnet.md) or [internal](../articles/api-management/api-management-using-with-internal-vnet.md) virtual network. We strongly recommend deploying the instance in a **new subnet** of the virtual network with settings compatible with the API Management `stv2` compute platform. 
1. After the virtual network is reestablished, unblock access to your service endpoints. In the portal, on the **Overview** page of the instance, select **Unblock my service**. This action is not reversible.

> [!WARNING]
> If you unblock access to your service endpoints before reconfiguring the virtual network, your service endpoints will be publicly accessible from the internet. To protect your environment, make sure to reestablish your virtual network as soon as possible.

> [!TIP]
> If you need a reminder of the names of the virtual network and subnet where your API Management instance was originally deployed, you can find information in the portal. In the left menu of your instance, select **Diagnose and solve problems** > **Availability and performance** > **VNet Verifier**. In **Time range**, select a period before the instance was migrated.




