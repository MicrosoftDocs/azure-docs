---
title: 'Quickstart: Create an any-to-any configuration using an ARM template'
titleSuffix: Azure Virtual WAN
description: Learn how to create an any-to-any configuration using an Azure Resource Manager template (ARM template).
author: cherylmc
ms.service: virtual-wan
ms.topic: quickstart
ms.date: 06/14/2022
ms.author: cherylmc
ms.custom: subject-armqs, mode-arm, devx-track-arm-template
---

# Quickstart: Create an any-to-any configuration using an ARM template

This quickstart describes how to use an Azure Resource Manager template (ARM template) to create an any-to-any scenario where any spoke can reach another spoke.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

[![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3a%2f%2fraw.githubusercontent.com%2fAzure%2fazure-quickstart-templates%2fmaster%2fquickstarts%2fmicrosoft.network%2fvirtual-wan-with-all-gateways%2fazuredeploy.json)

## Prerequisites

* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
* Public key certificate data is required for this configuration. See [Generate and export certificates](certificates-point-to-site.md#cer) for steps to generate and export the required certificates. Sample certificate data is provided in the article only to satisfy the template requirements in order to create a P2S gateway.

## <a name="review"></a>Review the template

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/virtual-wan-with-all-gateways). The template for this article is too long to show here. To view the template, see [azuredeploy.json](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.network/virtual-wan-with-all-gateways/azuredeploy.json).

In this quickstart, you'll create an Azure Virtual WAN multi-hub deployment, including all gateways and VNet connections. The list of input parameters has been purposely kept at a minimum. The IP addressing scheme can be changed by modifying the variables inside of the template. The scenario is explained further in the [Any-to-any scenario](scenario-any-to-any.md) article.

:::image type="content" source="./media/routing-scenarios/any-any/figure-1.png" alt-text="Deployment architecture":::

This template creates a fully functional Azure Virtual WAN environment with the following resources:

* Two distinct hubs in different regions
* Four Azure virtual networks (VNet)
* Two VNet connections for each VWAN hub
* One Point-to-Site (P2S) VPN gateway in each hub
* One Site-to-Site (S2S) VPN gateway in each hub
* One ExpressRoute gateway in each hub

Multiple Azure resources are defined in the template:

* [**Microsoft.Network/virtualwans**](/azure/templates/microsoft.network/virtualwans)
* [**Microsoft.Network/virtualhubs**](/azure/templates/microsoft.network/virtualhubs)
* [**Microsoft.Network/virtualnetworks**](/azure/templates/microsoft.network/virtualnetworks)
* [**Microsoft.Network/hubvirtualnetworkconnections**](/azure/templates/microsoft.network/virtualhubs/hubvirtualnetworkconnections)
* [**Microsoft.Network/p2svpngateways**](/azure/templates/microsoft.network/p2svpngateways)
* [**Microsoft.Network/vpngateways**](/azure/templates/microsoft.network/vpngateways) 
* [**Microsoft.Network/expressroutegateways**](/azure/templates/microsoft.network/expressroutegateways)
* [**Microsoft.Network/vpnserverconfigurations**](/azure/templates/microsoft.network/vpnserverconfigurations)

> [!NOTE]
> This ARM template doesn't create the customer-side resources required for hybrid connectivity. After you deploy the template, you still need to create and configure the P2S VPN clients, the VPN branches (Local Sites), and connect the ExpressRoute circuits.

To find more templates, see [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Network&pageNumber=1&sort=Popular).

## <a name="deploy"></a>Deploy the template

To deploy this template properly, you must use **Deploy to Azure** button in the Azure portal, rather than other methods, for the following reasons:

* In order to create the P2S configuration, you need to upload the root certificate data. The data field doesn't accept the certificate data when using PowerShell or CLI.
* This template doesn't work properly using Cloud Shell due to the certificate data upload.
* Additionally, you can easily modify the template and parameters in the portal to accommodate IP address ranges and other values.

1. Click **Deploy to Azure**.

   [![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3a%2f%2fraw.githubusercontent.com%2fAzure%2fazure-quickstart-templates%2fmaster%2fquickstarts%2fmicrosoft.network%2fvirtual-wan-with-all-gateways%2fazuredeploy.json)
1. To view the template, click **Edit template**. On this page, you can adjust some of the values such as address space or the name of certain resources. **Save** to save your changes, or **Discard**.
1. On the template page, enter the values. For the **Hub_Public Certificate Data for P2S** fields, you need to input the public key certificate data from the root certificate that you want to use (as mentioned in the prerequisites). If you haven't generated a root certificate and you're using these steps as only an exercise to run the template and observe the results, you can use the following example certificate data for both hubs. If you choose to use this example data and later want P2S clients to connect, you must replace this information with the certificate data from your own environment.

   > [!NOTE]
   > This certificate data is supplied for example purposes only. Replace this example data with the public key [certificate data](certificates-point-to-site.md#cer) from your own certificate if you want P2S clients to connect.

   ```certificate-data
    MIIC9zCCAd+gAwIBAgIQOn0lVXm3E5hH/A7CdSuPyDANBgkqhkiG9w0BAQsFADAe
    MRwwGgYDVQQDDBNEZW1vUm9vdENlcnRpZmljYXRlMB4XDTIyMDExMTE5NDgwOFoX
    DTMyMDExMTE5NTgwOVowHjEcMBoGA1UEAwwTRGVtb1Jvb3RDZXJ0aWZpY2F0ZTCC
    ASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAM3m0yqbpV46r6D8pOjODw1E
    O5QBf9kynypwRy0yrgj+6j1YzVogYQgBFHGgg1OszoAWorvN1KmuqOvdqR5Jtiuv
    A3p8dfsWVZlkthTX9MaWQfskCThE+NucphalFgEOcpdJpN9kt+n1IMgbqI0metcW
    lCyOkUke13jcNkYEd5oRi053yEWUOSfNoDvxmbwrGdtpPo8VH+7bZaNB8mUfxUjO
    Hg6cv+BV910q0c+O6QWj5B5W+tJGDTxwuokyI94Fsb9FG6wxyZGSGX0uTBiuUC7V
    Uf9FZur9HTfofkiy6QX2+6j0iQfqv7jM9NOnAzhUT+l+2l+6glEbkA2R3vH5wZ0C
    AwEAAaMxMC8wDgYDVR0PAQH/BAQDAgIEMB0GA1UdDgQWBBQhyYPrM242o1FzArus
    77YlfhwkUzANBgkqhkiG9w0BAQsFAAOCAQEAL0wMThonNJ6dPRlbopqbuGLttDnX
    OnpKLrv6d8kl6y8z4orYUi1T7Q3wjlMwVoHgqc8r7DMWroWG8mFlCyVdUYH9oYQS
    m60v1fltvRxtFZiB3jzAMOcQsqr+v6QlAkr4RF7f7JtuLxwUCvVlF+rrQOAu9pu7
    Kh180o9a79CgrA67DTSYP4wI1YRKglWK8eAxEkAfHTXwC/MJmf3XMMyb3cBWiirl
    FLlDgEi4Jb14vd3diBg51df8WbW/+jmoNIbrWkpLhL27sSx6rgN/2NUYzdA4MWqp
    Odrcs3wQsYovibqHiQUFHc24bvlcKiEpL535nHrSJR6PITm3Wh83yQ02mQ==
   ```

1. When you have finished entering values, select **Review + create**.
1. On the **Review + create** page, after validation passes, select **Create**.
1. It takes about 75 minutes for the deployment to complete. You can view the progress on the template **Overview** page.  If you close the portal, deployment will continue.

   :::image type="content" source="./media/quickstart-any-to-any-template/template.png" alt-text="Example of deployment complete":::

## <a name="validate"></a>Validate the deployment

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select **Resource groups** from the left pane.
1. Select the resource group that you created in the previous section. On the **Overview** page, you'll see something similar to this example:
   :::image type="content" source="./media/quickstart-any-to-any-template/resources.png" alt-text="Example of resources" lightbox="./media/quickstart-any-to-any-template/resources.png":::

1. Click the virtual WAN to view the hubs. On the virtual WAN page, click each hub to view connections and other hub information.
   :::image type="content" source="./media/quickstart-any-to-any-template/hub.png" alt-text="Example of hubs" lightbox="./media/quickstart-any-to-any-template/hub.png":::

## <a name="complete"></a>Complete the hybrid configuration

The template doesn't configure all of the settings necessary for a hybrid network. Complete the following configurations and settings, depending on your requirements:

* [Configure the VPN branches - local sites](virtual-wan-site-to-site-portal.md#site)
* [Complete the P2S VPN configuration](virtual-wan-point-to-site-portal.md)
* [Connect the ExpressRoute circuits](virtual-wan-expressroute-portal.md)

## Clean up resources

When you no longer need the resources that you created, delete them. Some of the Virtual WAN resources must be deleted in a certain order due to dependencies. Deleting can take about 30 minutes to complete.

[!INCLUDE [Delete resources](../../includes/virtual-wan-resource-cleanup.md)]

## Next steps

> [!div class="nextstepaction"]
> [Complete the P2S VPN configuration](virtual-wan-point-to-site-portal.md)

> [!div class="nextstepaction"]
> [Configure the VPN branches - local sites](virtual-wan-site-to-site-portal.md#site)

> [!div class="nextstepaction"]
> [Connect the ExpressRoute circuits](virtual-wan-expressroute-portal.md)
