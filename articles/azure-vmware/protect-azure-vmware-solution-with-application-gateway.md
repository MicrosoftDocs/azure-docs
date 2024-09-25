---
title: Protect web apps on Azure VMware Solution with Azure Application Gateway
description: Configure Azure Application Gateway to securely expose your web apps running on Azure VMware Solution.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 3/21/2024
ms.custom: engagement-fy23
---

# Protect web apps on Azure VMware Solution with Azure Application Gateway

[Azure Application Gateway](https://azure.microsoft.com/services/application-gateway/) is a layer 7 web traffic load balancer that lets you manage traffic to your web applications, offered in both Azure VMware Solution v1.0 and v2.0. Both versions tested with web apps running on Azure VMware Solution.

The capabilities include:

- Cookie-based session affinity
- URL-based routing
- Web Application Firewall (WAF)

For a complete list of features, see [Azure Application Gateway features](../application-gateway/features.md).

This article shows you how to use Application Gateway in front of a web server farm to protect a web app running on Azure VMware Solution. 

## Topology

The diagram shows how Application Gateway is used to protect Azure IaaS virtual machines (VMs), Azure Virtual Machine Scale Sets, or on-premises servers. Application Gateway treats Azure VMware Solution VMs as on-premises servers.

:::image type="content" source="media/application-gateway/app-gateway-protects.png" alt-text="Diagram showing how Application Gateway protects Azure IaaS virtual machines (VMs), Azure Virtual Machine Scale Sets, or on-premises servers."lightbox="media/application-gateway/app-gateway-protects.png" border="false":::

> [!IMPORTANT]
> Azure Application Gateway is the preferred method to expose web apps running on Azure VMware Solution VMs.

The diagram shows the testing scenario used to validate the Application Gateway with Azure VMware Solution web applications.

:::image type="content" source="media/hub-spoke/azure-vmware-solution-second-level-traffic-segmentation.png" alt-text="Diagram showing the testing scenario used to validate the Application Gateway with Azure VMware Solution web applications."lightbox="media/hub-spoke/azure-vmware-solution-second-level-traffic-segmentation.png" border="false":::

The Application Gateway instance gets deployed on the hub in a dedicated subnet with an Azure public IP address. Activating the [Azure DDoS Protection](../ddos-protection/ddos-protection-overview.md) for the virtual network is recommended. The web server is hosted on an Azure VMware Solution private cloud behind NSX T0 and T1 Gateways. Additionally, Azure VMware Solution uses [ExpressRoute Global Reach](../expressroute/expressroute-global-reach.md) to enable communication with the hub and on-premises systems.

## Prerequisites

- An Azure account with an active subscription.
- An Azure VMware Solution private cloud deployed and running.

## Deployment and configuration

1. In the Azure portal, search for **Application Gateway** and select **Create application gateway**.

2. Provide the basic details as in the following figure; then select **Next: Frontends>**.

    :::image type="content" source="media/application-gateway/create-app-gateway.png" alt-text="Screenshot showing Create application gateway page in Azure portal."lightbox="media/application-gateway/create-app-gateway.png":::

3. Choose the frontend IP address type. For public, choose an existing public IP address or create a new one. Select **Next: Backends>**.

    > [!NOTE]
    > Only standard and Web Application Firewall (WAF) SKUs are supported for private frontends.

4. Add a backend pool of the VMs that run on Azure VMware Solution infrastructure. Provide the details of web servers that run on the Azure VMware Solution private cloud and select **Add**.  Then select **Next: Configuration>**.

5. On the **Configuration** tab, select **Add a routing rule**.

6. On the **Listener** tab, provide the details for the listener. If HTTPS is selected, you must provide a certificate, either from a PFX file or an existing Azure Key Vault certificate.

7. Select the **Backend targets** tab and select the backend pool previously created. For the **HTTP settings** field, select **Add new**.

8. Configure the parameters for the HTTP settings. Select **Add**.

9. If you want to configure path-based rules, select **Add multiple targets to create a path-based rule**.

10. Add a path-based rule and select **Add**. Repeat to add more path-based rules.

11. When you finish adding path-based rules, select **Add** again, then select **Next: Tags>**.

12. Add tags and then select **Next: Review + Create>**.

13. A validation runs on your Application Gateway. If it's successful, select **Create** to deploy.

## Configuration examples

Now configure Application Gateway with Azure VMware Solution VMs as backend pools for the following use cases:

- [Hosting multiple sites](#hosting-multiple-sites)
- [Routing by URL](#routing-by-url)

### Hosting multiple sites

This procedure shows you how to define backend address pools using VMs running on an Azure VMware Solution private cloud on an existing application gateway.

>[!NOTE]
>This procedure assumes you have multiple domains, so we'll use examples of www.contoso.com and www.contoso2.com.

1. In your private cloud, create two different pools of VMs. One represents Contoso and the second contoso2.

    :::image type="content" source="media/application-gateway/app-gateway-multi-backend-pool.png" alt-text="Screenshot showing summary of a web server's details in VMware vSphere Client."lightbox="media/application-gateway/app-gateway-multi-backend-pool.png":::

    We used Windows Server 2016 with the Internet Information Services (IIS) role installed. Once the VMs are installed, run the following PowerShell commands to configure IIS on each of the VMs.

    ```powershell
    Install-WindowsFeature -Name Web-Server
    Add-Content -Path C:\inetpub\wwwroot\Default.htm -Value $($env:computername)
    ```

2. In an existing application gateway instance, select **Backend pools** from the left menu, select  **Add**, and enter the new pools' details. Select **Add** in the right pane.

    :::image type="content" source="media/application-gateway/app-gateway-multi-backend-pool-02.png" alt-text="Screenshot of Backend pools page for adding backend pools." lightbox="media/application-gateway/app-gateway-multi-backend-pool-02.png":::

3. In the **Listeners** section, create a new listener for each website. Enter the details for each listener and select **Add**.

4. On the left, select **HTTP settings** and select **Add** in the left pane. Fill in the details to create a new HTTP setting and select **Save**.

    :::image type="content" source="media/application-gateway/app-gateway-multi-backend-pool-03.png" alt-text="Screenshot of HTTP settings page to create a new HTTP setting." lightbox="media/application-gateway/app-gateway-multi-backend-pool-03.png":::

5. Create the rules in the **Rules** section of the left menu. Associate each rule with the corresponding listener. Select **Add**.

6. Configure the corresponding backend pool and HTTP settings. Select **Add**.

7. Test the connection. Open your preferred browser and navigate to the different websites hosted on your Azure VMware Solution environment.

    :::image type="content" source="media/application-gateway/app-gateway-multi-backend-pool-07.png" alt-text="Screenshot of browser page showing successful test the connection.":::

### Routing by URL

The following steps define backend address pools using VMs running on an Azure VMware Solution private cloud. The private cloud is on an existing application gateway. You then create routing rules that make sure web traffic arrives at the appropriate servers in the pools.

1. In your private cloud, create a virtual machine pool to represent the web farm.

    :::image type="content" source="media/application-gateway/app-gateway-url-route-backend-pool.png" alt-text="Screenshot of page in VMware vSphere Client showing summary of another VM."lightbox="media/application-gateway/app-gateway-url-route-backend-pool.png":::

    Windows Server 2016 with IIS role installed was used to illustrate this tutorial. Once the VMs are installed, run the following PowerShell commands to configure IIS for each VM tutorial.

    The first virtual machine, contoso-web-01, hosts the main website.

    ```powershell
    Install-WindowsFeature -Name Web-Server
    Add-Content -Path C:\inetpub\wwwroot\Default.htm -Value $($env:computername)
    ```

    The second virtual machine, contoso-web-02, hosts the images site.

    ```powershell
    Install-WindowsFeature -Name Web-Server
    New-Item -Path "C:\inetpub\wwwroot\" -Name "images" -ItemType "directory"
    Add-Content -Path C:\inetpub\wwwroot\images\test.htm -Value $($env:computername)
    ```

    The third virtual machine, contoso-web-03, hosts the video site.

    ```powershell
    Install-WindowsFeature -Name Web-Server
    New-Item -Path "C:\inetpub\wwwroot\" -Name "video" -ItemType "directory"
    Add-Content -Path C:\inetpub\wwwroot\video\test.htm -Value $($env:computername)
    ```

2. Add three new backend pools in an existing application gateway instance.

   1. Select **Backend pools** from the left menu. 
   1. Select **Add** and enter the details of the first pool, **contoso-web**.
   1. Add one VM as the target.
   1. Select **Add**.
   1. Repeat this process for **contoso-images** and **contoso-video**, adding one unique VM as the target.

    :::image type="content" source="media/application-gateway/app-gateway-url-route-backend-pool-02.png" alt-text="Screenshot of Backend pools page showing the addition of three new backend pools." lightbox="media/application-gateway/app-gateway-url-route-backend-pool-02.png":::

3. In the **Listeners** section, create a new listener of type Basic using port 8080.

4. On the left navigation, select **HTTP settings** and select **Add** in the left pane. Fill in the details to create a new HTTP setting and select **Save**.

    :::image type="content" source="media/application-gateway/app-gateway-url-route-backend-pool-04.png" alt-text="Screenshot of Add HTTP setting page showing HTTP settings configuration."lightbox="media/application-gateway/app-gateway-url-route-backend-pool-04.png":::

5. Create the rules in the **Rules** section of the left menu and associate each rule with the previously created listener. Then configure the main backend pool and HTTP settings, and then select **Add**.

    :::image type="content" source="media/application-gateway/app-gateway-url-route-backend-pool-07.png" alt-text="Screenshot of Add a routing rule page to configure routing rules to a backend target."lightbox="media/application-gateway/app-gateway-url-route-backend-pool-07.png":::

6. Test the configuration. Access the application gateway on the Azure portal and copy the public IP address in the **Overview** section.

   1. Open a new browser window and enter the URL `http://<app-gw-ip-address>:8080`.

      :::image type="content" source="media/application-gateway/app-gateway-url-route-backend-pool-08.png" alt-text="Screenshot of browser page showing successful test of the configuration."lightbox="media/application-gateway/app-gateway-url-route-backend-pool-08.png":::

   1. Change the URL to `http://<app-gw-ip-address>:8080/images/test.htm`.

      :::image type="content" source="media/application-gateway/app-gateway-url-route-backend-pool-09.png" alt-text="Screenshot of another successful test with the new URL."lightbox="media/application-gateway/app-gateway-url-route-backend-pool-09.png":::

   1. Change the URL again to `http://<app-gw-ip-address>:8080/video/test.htm`.

      :::image type="content" source="media/application-gateway/app-gateway-url-route-backend-pool-10.png" alt-text="Screenshot of successful test with the final URL."lightbox="media/application-gateway/app-gateway-url-route-backend-pool-10.png":::

## Next Steps

Now that you covered using Application Gateway to protect a web app running on Azure VMware Solution, learn more about:

- [Configuring Azure Application Gateway for different scenarios](../application-gateway/configuration-overview.md).
- [Deploying Traffic Manager to balance Azure VMware Solution workloads](deploy-traffic-manager-balance-workloads.md).
- [Integrating Azure NetApp Files with Azure VMware Solution-based workloads](netapp-files-with-azure-vmware-solution.md).
- [Protecting Azure resources in virtual networks](../ddos-protection/ddos-protection-overview.md).
