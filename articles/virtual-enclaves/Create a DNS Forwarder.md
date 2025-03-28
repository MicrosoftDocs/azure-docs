---
title: Create a DNS Forwarder
description: Azure Virtual Enclaves Documentation
author: jadean-msft
ms.author: jadean
ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 01/31/2025
---

# Create a DNS Forwarder
This example of setting up a DNS Forwarder VM is for the contoso5.com domain with three domain controllers on IPs 10.0.2.4, 10.0.2.5, and 10.0.2.6.

Note: Service Catalog template for DNS Forwarders coming soon!

## Steps in this guide

1. Deploy DNS Forwarder VM
2. Update vnet DNS

## Deploy and COnfigure DNS Forwarder VM

### Create VM
Create Windows Server VM in the enclave workload of your choice, within the enclave vnet, `AzureVirtualEnclaveSubnet` subnet, and with no public IP address.


### Install `DNS` feature on windows server VM
In the `Server Manager` window, select `Manage` to install a new feature like the picture below
![image](/assets/dns-forwarder-add-roles-and-features.png)

Click next until `Server Roles` where you check the box next to `DNS Server`, accept additional recommended tools and click next until the install button appears. Wait for the installation to finish.

### Add domain controller IPs as the "Forwarders"
In the `Server Manager` window, select `Tools` and `DNS`. Make sure the DNS forwarder VM name is selected and double click `Forwarders`. Add the domain controller IPs as seen below.
![image](/assets/dns-forwarder-add-forwarders.png)

### Set Static IP for DNS Forwarder
Use the commands `ipconfig /all` and `nslookup contoso5.com` to get the VM IP address, gateway, and DNS Servers (one or more of the DC IPs).
![image](/assets/dns-forwarder-static-ip-config.png)

## Update enclave VNET DNS
1. Open enclave VNET resource
2. Select the DNS blade
3. Remove the default azure IP address and add the domain controller IPs. Reboot any VMs in the vnet for these new setting to take effect automatically.

## Create Conditional Forwarder (Optional)
1.
