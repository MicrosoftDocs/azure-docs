---
title: Configure VMware Cloud Director Service in Azure VMware Solution
description: How to configure VMware Cloud Director Service in Azure VMware Solution
author: jjaygbay1
ms.author: jacobjaygbay
ms.service: azure-vmware
ms.topic: article
ms.date: 06/12/2023
---

# Configure VMware Cloud Director Service in Azure VMware Solution

In this article, learn how to configure [VMware Cloud Director](./https://docs.vmware.com/en/VMware-Cloud-Director-service/index.html) service in Azure VMware Solution.  

## Prerequisites
-	Plan and deploy a VMware Cloud Director Service Instance in your preferred region using the process described here. [How Do I Create a VMware Cloud Director Instance](https://docs.vmware.com/en/VMware-Cloud-Director-service/services/using-vmware-cloud-director-service/GUID-26D98BA1-CF4B-4A57-971E-E58A0B482EBB.html#GUID-26D98BA1-CF4B-4A57-971E-E58A0B482EBB)

>[!Note] 
>  VMware Cloud Director Instances can establish connections to AVS SDDC in regions where latency remains under 150 ms.

 - Plan and deploy Azure VMware solution private cloud using the following links:
    - [Plan Azure VMware solution private cloud SDDC.](plan-private-cloud-deployment.md)
    - [Deploy and configure Azure VMware Solution - Azure VMware Solution.](deploy-azure-vmware-solution?tabs=azure-portal) 
-	After successfully gaining access to both your VMware Cloud Director instance and Azure VMware Solution SDDC, you can then proceed to the next section.

## Plan and prepare Azure VMware solution private cloud for VMware Reverse proxy

- VMware Reverse proxy VM is deployed within the Azure VMware solution SDDC and requires outbound connectivity to your VMware Cloud director Service Instance. [Plan how you would provide this internet connectivity.](concepts-design-public-internet-access.md) 

- Public IP on NSX-T edge can be used to provide outbound access for the VMware Reverse proxy VM as shown in this article. Learn more on, [How to configure a public IP in the Azure portal](enable-public-ip-nsx-edge#configure-a-public-ip-in-the-azure-portal) and [Outbound Internet access for VMs](enable-public-ip-nsx-edge#outbound-internet-access-for-vms)
 
-  VMware Reverse proxy can acquire an IP address through either DHCP or manual IP configuration.
- Optionally create a dedicated Tier-1 router for the reverse proxy VM segment.

### Prepare your Azure VMware Solution SDDC for deploying VMware Reverse proxy VM OVA

-  Obtain NSX-T cloud admin credentials from Azure portal under VMware credentials. Then, Log in to NSX-T manager.
-  Create a dedicated Tier-1 router (optional) for VMware Reverse proxy VM.
    - Log in to Azure VMware solution NSX-T manage and select **ADD Tier-1 Gateway**
    - Provide name, Linked Tier-0 gateway and then select save.
    - Configure appropriate settings under Route Advertisements.
    
        :::image type="content" source="./media/vmware-cds-avs/pic2.png" alt-text="Screenshot showing how to create a Tier-1 Gateway." lightbox="./media/vmware-cds-avs/pic2.png":::
 
- Create a segment for VMware Reverse proxy VM. 
    - Log in to Azure VMware solution NSX-T manage and under segments, select **ADD SEGMENT**
    - Provide name, Connected Gateway, Transport Zone and Subnet information and then select save.
    
    :::image type="content" source="./media/vmware-cds-avs/pic3.png" alt-text="Screenshot showing how to create a NSX-T segment for reverse proxy VM." lightbox="./media/vmware-cds-avs/pic3.png":::
    
-	Optionally enable segment for DHCP by creating a DHCP profile and setting DHCP config. You can skip this step if you use static IPs.
- Add two NAT rules to provide an outbound access to VMware Reverse proxy VM to reach VMware cloud director service. You can also reach the management components of Azure VMware solution SDDC such as vCenter and NSX-T that are deployed in the management plane.
    - Create **NOSNAT** rule, 
        - Provide name of the rule and select source IP. You can use CIDR format or specific IP address.
        - Under destination port, use private cloud network CIDR. 
    - Create **SNAT** rule
        - Provide name and select source IP.
        - Under translated IP, provide a public IP address.
        - Set priority of this rule higher as compared to the NOSNAT rule.
    - Click **Save**.
    
 :::image type="content" source="./media/vmware-cds-avs/pic6.png" alt-text="Screenshot showing how to verify the NAT rules have been created." lightbox="./media/vmware-cds-avs/pic6.png":::
    

- Ensure on Tier-1 gateway, NAT is enabled under router advertisement.
- Configure gateway firewall rules to enhance security.

## Generate and Download VMware Reverse proxy OVA

- What follows is a step-by-step procedure and how to obtain the required information on Azure portal and how to use it to generate VMware Reverse proxy VM.

### Prerequisites on VMware cloud service

- Verify that you're assigned the network administrator service role. See [Managing Roles and Permissions](https://docs.vmware.com/en/VMware-Cloud-services/services/Using-VMware-Cloud-Services/GUID-84E54AD5-A53F-416C-AEBE-783927CD66C1.html) and make changes using VMware Cloud Services Console.
- If you're accessing VMware Cloud Director service through VMware Cloud Partner Navigator, verify that you're a Provider Service Manager user and that you have been assigned the provider:**admin** and provider:**network service** roles.
- See [How do I change the roles of users in my organization](https://docs.vmware.com/en/VMware-Cloud-Partner-Navigator/services/Cloud-Partner-Navigator-Using-Provider/GUID-BF0ED645-1124-4828-9842-18F5C71019AE.html) in the VMware Cloud Partner Navigator documentation.

### Procedure
- Log in to VMware Cloud Director service.
- Click Cloud Director Instances.
- In the card of the VMware Cloud Director instance for which you want to configure a reverse proxy service, click **Actions** > **Generate VMware Reverse Proxy OVА**. 
- The **Generate VMware Reverse proxy OVA** wizard opens. Fill in the required information.
- Enter Network Name
    - Network name is the name of the NSX-T segment you created in previous section for reverse proxy VM.
- Enter the required information such as vCenter FQDN, Management IP for vCenter, NSX FQDN or IP and more hosts within the SDDC to proxy. 
- vCenter and NSX-T IP address of your Azure VMware solution private cloud can be found under **Azure portal** -> **manage**-> **VMware credentials**.
![Obtain VMware credentials using Azure portal](./media/vmware-cds-avs/pic7.png)
- To find FQDN of vCenter of your Azure VMware solution private cloud, login to the vCenter using VMware credential provided on Azure portal.
- In vSphere Client, select vCenter, which displays FQDN of the vCenter server. 
- To obtain FQDN of NSX-T, replace vc with nsx. NSX-T FQDN in this example would be,  “nsx.f31ca07da35f4b42abe08e.uksouth.avs.azure.com”
 
    :::image type="content" source="./media/vmware-cds-avs/pic8.png" alt-text="Screenshot showing how to obtain vCenter and NSX-T FQDN in Azure VMware solution private cloud." lightbox="./media/vmware-cds-avs/pic8.png":::

 

- Obtain ESXi management IP addresses and CIDR for adding IP addresses in allowlist when generating reverse proxy VM OVA.

    :::image type="content" source="./media/vmware-cds-avs/pic9.png" alt-text="Screenshot showing how to obtain management IP address and CIDR for ESXi hosts in Azure VMware solution private cloud." lightbox="./media/vmware-cds-avs/pic9.png":::



- Enter a list of any other IP addresses that VMware Cloud Director must be able to access through the proxy, such as ESXi hosts to use for console proxy connection.
Use new lines to separate list entries.

>[!TIP] 
> To ensure that future additions of ESXi hosts don't require updates to the allowed targets, use a CIDR notation to enter the ESXi hosts in the allow list. This way, you can provide any new host with an IP address that is already allocated as part of the CIDR block.

- Once you have gathered all the required information, add the information in the VMware Reverse proxy OVA generation wizard in the following diagram.

    :::image type="content" source="./media/vmware-cds-avs/pic10.png" alt-text="Screenshot showing how to generate a reverse proxy VM OVA." lightbox="./media/vmware-cds-avs/pic10.png":::

- Click Generate VMware Reverse Proxy OVА.
- On the Activity Log tab, locate the task for generating an OVА and check its status.
- Once the status of the task is displayed as Success, click the vertical ellipsis icon and select View files.
- Download the reverse proxy OVA.

## Deploy VMware Reverse proxy VM
- Transfer reverse proxy VM OVA you generated in the previous section to a location from where you can access your private cloud.
- Deploy reverse proxy VM using OVA. 
- Select appropriate parameters for OVA deployment for folder, computer resources, and storage.
    - For network, select appropriate segment for reverse proxy.
    - Under customize template, use DHCP or provide static IP if you aren't planning to use DHCP.
    - Enable SSH to log in to reverse proxy VM.
    - Provide root password.
- Once VM is deployed, power it on and then log in using the root credentials provided during OVA deployment.
- Log in to the VMware Reverse proxy VM and use the command **transporter-status.sh** to verify that the connection between CDs instance and Transporter VM is established. 
    - The status should indicate "UP." The command channel should display "Connected," and the allowed targets should be listed as "reachable."
- Next step is to associate Azure VMware Solution SDDC with the VMware Cloud Director Instance. 


## Associate Azure solution private cloud SDDC with VMware Cloud Director Instance  via VMware Reverse proxy

This process pools all the resources from Azure private solution SDDC and creates a provider virtual datacenter (PVDC) in CDs. 

1.	Log in to VMware Cloud Director service.
1.	Click Cloud Director Instances.
1. In the card of the VMware Cloud Director instance for which you want to associate your Azure VMware solution SDDC, select **Actions** and then click 
**Associate datacenter via VMware reverse proxy**.
1. Review datacenter information. 
1. Select a proxy network for the reverse proxy appliance to use. Ensure correct NSX-T segment is selected where reverse proxy VM is deployed.

    :::image type="content" source="./media/vmware-cds-avs/pic14.png" alt-text="Screenshot showing how to review a proxy network information." lightbox="./media/vmware-cds-avs/pic14.png":::

6. In the **Data center name** text box, enter a name for the SDDC that you want to associate with datacenter.
This name is only used to identify the data center in the VMware Cloud Director inventory, so it doesn't need to match the SDDC name  entered when you generated the reverse proxy appliance OVA.
7.	Enter the FQDN for your vCenter Server instance.
8.	Enter the URL for the NSX Manager instance and wait for a connection to establish.
9.	Click Next.
10.	Under Credentials, enter your user name and password for the vCenter Server endpoint.
11.	Enter your user name and password for NSX Manager.
12.	To create infrastructure resources for your VMware Cloud Director instance, such as a network pool, an external network and a provider VDC, select Create Infrastructure.
13.	Click Validate Credentials. Ensure that validation is successful.
14.	Confirm that you acknowledge the costs associated with your instance, and click Submit.
15.	Check activity log to note the progress.
16.	Once this process is completed, you should see that your VMware Azure solution SDDC is securely associated with your VMware Cloud Director instance. 
17.	When you open the VMware Cloud Director instance, the vCenter Server and the NSX Manager instances that you associated are visible in Infrastructure Resources.

    :::image type="content" source="./media/vmware-cds-avs/pic17.png" alt-text="Screenshot showing how the vcenter server is connected and enabled." lightbox="./media/vmware-cds-avs/pic17.png":::

18.	A newly created Provider VDC is visible in Cloud Resources. 
19.	In your Azure VMware solution private cloud, when logged into vCenter you see that a Resource Pool is created as a result of this association.

    :::image type="content" source="./media/vmware-cds-avs/pic19.png" alt-text="Screenshot showing how resource pools are created for CDs." lightbox="./media/vmware-cds-avs/pic19.png":::

20.	You can use your VMware cloud director instance provider portal to configure tenants such as organizations and virtual data center.

## What’s next

- Configure tenant networking on VMware Cloud director service on Azure VMware solution using link [Enable VMware Cloud Director service with Azure VMware Solution](enable-vmware-cds-with-azure.md).

- Learn more about VMware cloud director service using [VMware Cloud Director Service Documentation](https://docs.vmware.com/en/VMware-Cloud-Director-service/index.html)

- To learn about Cloud director Service provider admin portal, Visit [VMware Cloud Director™ Service Provider Admin Portal Guide](https://docs.vmware.com/en/VMware-Cloud-Director/10.4/VMware-Cloud-Director-Service-Provider-Admin-Portal-Guide/GUID-F8F4B534-49B2-43B2-AEEE-7BAEE8CE1844.html).
