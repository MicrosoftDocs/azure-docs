---
title: Create and use a custom domain 
description: Connect a custom domain to a virtual machine in Azure.
author: jasonmesser7
ms.service: virtual-machines
ms.subservice: networking
ms.topic: how-to
ms.workload: infrastructure-services
ms.date: 02/23/2023
ms.author: jamesserra
ms.reviewer: cynthn
---


# Add Custom Domain to Azure VM or resource

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets


In Azure there are multiple ways to connect a custom domain to your VM or resource. For any resource with a public IP (Virtual Machine, Load Balancer, Application Gateway) the most straight-forward way is to create an A record set in your corresponding domain registrar. 

## Prerequisites 
- You need a VM with a web server running. You can use the [Quickstart](./linux/quick-create-cli.md) to create a VM and add NGINX.

- The VM must be accessible to the web (open port 80, or 443). For a more secure deployment place your VM behind a load balancer or Application Gateway first. For more information, see [Quickstart: Load Balancer](../load-balancer/quickstart-load-balancer-standard-public-portal.md?tabs=option-1-create-load-balancer-standard).

- Have an existing domain and access to DNS settings. For more information, see [Buy a custom domain for Azure App Service](../app-service/manage-custom-dns-buy-domain.md).


## Add custom domain to VM public IP address

When you create a virtual machine in the Azure portal, a public IP resource for the virtual machine is automatically created. Your public IP address is shown in VM overview page. 
 
:::image type="content" source="media/custom-domain/essentials.png" alt-text="Shows the public IP address in the essentials section of the VM overview page.":::

If you select the IP address you can see more information on it. Check to make sure your **IP Assignment** is set to **Static**. A static IP address will not change if the VM or resource reboots or shuts down.

:::image type="content" source="media/custom-domain/ip-config.png" alt-text="Shows the public IP configuration so you can see if the IP address is static.":::

If your IP Address is not static, you will need to create an FQDN. 

1. Select your VM in the portal. 
1. In the left menu, select **Properties**
1. Under **Public IP address\DNS name label**, select your IP address. The **Configuration** page will open.
2. Under **DNS name label**, enter the prefix you want to use.
3. Select **Save** at the top of the page.
4. Select **Overview** in the left menu to return to the VM overview blade.
5. Verify that the *DNS name* appears correctly. 

Open a browser and enter your IP address or FQDN and verify that it shows the web content running on your VM.
 
After verifying your static IP or FQDN, go to your domain provider and navigate to DNS settings. Add an *A record* pointing to your Public IP Address or FQDN. For example, the procedure for the GoDaddy domain registrar is as follows:

1. Sign in and select the custom domain you want to use.
2. In the **Domains** section, select **Manage All**, then select **DNS | Manage Zones**.
3. For **Domain Name**, enter your custom domain, then select **Search**.
4. From the DNS Management page, select Add, then select A in the Type list.
5. Complete the fields of the A entry:
    - Type: Leave **A** selected.
    - Host: Enter **@**
    - Points to: Enter the Public IP Address or FQDN of your VM. 
    - TTL: Leave one hour selected.
6. Select **Save**.

The A record entry is added to the DNS records table.
 
After the record is created it usually takes about an hour for DNS propagate, but it can sometimes take up to 48 hours. 


 
## Next steps
[Overview of TLS termination and end to end TLS with Application Gateway](../application-gateway/ssl-overview.md).

