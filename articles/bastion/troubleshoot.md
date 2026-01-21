---
title: Troubleshoot Azure Bastion
description: Review Azure Bastion troubleshooting guidance to help you diagnose and resolve connectivity, authentication, and configuration issues effectively.
services: bastion
author: abell
ms.service: azure-bastion
ms.topic: troubleshooting
ms.date: 12/10/2025
ms.author: abell
# Customer intent: As a network administrator, I want to troubleshoot connectivity issues in Azure Bastion so that I can ensure seamless access to my virtual machines and efficiently manage network security settings.
---

# Troubleshoot Azure Bastion

This article helps you diagnose and resolve common issues with [Azure Bastion](bastion-overview.md).

Review these common problems and solutions before you contact support. We update this information regularly as new solutions become available.

## Deployment and configuration issues

This section describes common deployment and configuration issues and their resolutions.

|Issue  |Description  |Resolution  |
|---------|---------|---------|
|Failed to add subnet error|When you try to use "Deploy Bastion" in the portal, you get a "Failed to add subnet" error.|At this time, for most address spaces, you must add a subnet named **AzureBastionSubnet** to your virtual network before you select **Deploy Bastion**.|
|Deployment failures|Deployment of Azure Bastion fails with errors.|Review any error messages and [raise a support request in the Azure portal](/azure/azure-portal/supportability/how-to-create-azure-support-request) as needed. Deployment failures can result from [Azure subscription limits, quotas, and constraints](../azure-resource-manager/management/azure-subscription-service-limits.md). Specifically, customers might encounter a limit on the number of public IP addresses allowed per subscription that causes the Azure Bastion deployment to fail.|
|Moving virtual network to another resource group|You want to move your virtual network to a different resource group.|Moving a virtual network with Bastion isn't directly supported. You must first delete Bastion from the virtual network, then move the virtual network to the new resource group. Once the virtual network is in the new resource group, you can deploy Bastion to the virtual network.|
|Force-tunneling Internet traffic|You're advertising a default route (0.0.0.0/0) over ExpressRoute or VPN.|Force-tunneling with Azure Bastion isn't supported if you're advertising a default route over ExpressRoute or VPN. Azure Bastion needs to communicate with certain internal endpoints. Ensure the host virtual network isn't linked to a private DNS zone with these exact names: management.azure.com, blob.core.windows.NET, core.windows.NET, vaultcore.windows.NET, vault.azure.NET, or azure.com. You can use private DNS zones ending with these names (for example: privatelink.blob.core.windows.NET). Azure Bastion isn't supported with Azure Private DNS Zones in national clouds.|

## DNS and Private Link issues

This section describes common DNS and Private Link issues and their resolutions.

|Issue  |Description  |Resolution  |
|---------|---------|------|
|privatelink.azure.com can't resolve to management.privatelink.azure.com|DNS resolution fails for management.privatelink.azure.com when using privatelink.azure.com zone.|This issue might occur when the private DNS zone for privatelink.azure.com is linked to the Bastion virtual network, causing management.azure.com CNAMEs to resolve to management.privatelink.azure.com. To resolve this issue, create a CNAME record in your privatelink.azure.com zone for management.privatelink.azure.com to arm-frontdoor-prod.trafficmanager.NET.|

## Network security group (NSG) configuration issues

This section describes common NSG configuration issues and their resolutions.

|Issue  |Description  |Resolution  |
|---------|---------|---------|
|Unable to create an NSG on AzureBastionSubnet|When you try to create an NSG on the Azure Bastion subnet, you get the following error: *'Network security group \<NSG name\> doesn't have necessary rules for Azure Bastion Subnet AzureBastionSubnet"*.|If you create and apply an NSG to *AzureBastionSubnet*, make sure you add the required rules to the NSG. For a list of required rules, see [Working with NSG access and Azure Bastion](./bastion-nsg.md). If you don't add these rules, the NSG creation or update fails.<br><br>For an example of the NSG rules, see the [quickstart template](https://azure.microsoft.com/resources/templates/azure-bastion-nsg/). For more information, see [NSG guidance for Azure Bastion](bastion-nsg.md).|

## Authentication issues

This section describes common authentication issues and their resolutions.

|Issue  |Description  |Resolution  |
|---------|---------|---------|
|Unable to use SSH key with Azure Bastion|When you try to browse your SSH key file, you get the following error: *'SSH Private key must start with -----BEGIN RSA/DSA/OPENSSH PRIVATE KEY----- and ends with -----END RSA/DSA/OPENSSH PRIVATE KEY-----'*.|Azure Bastion currently supports RSA, DSA, and OPENSSH private keys. Make sure that you browse a key file that is RSA, DSA, or OPENSSH private key for SSH, with public key provisioned on the target VM.<br><br>As an example, you can use the following command to create a new RSA SSH key:<br><br>**ssh-keygen -t rsa -b 4096 -C "email@domain.com"**<br><br>For sample output, see the [SSH key generation example](#ssh-key-generation-example).|
|Unable to sign in to Windows domain-joined virtual machine|You're unable to connect to your Windows virtual machine that is domain-joined.|Azure Bastion supports domain-joined VM sign-in for username-password based domain sign-in only. When specifying the domain credentials in the Azure portal, use the UPN (username@domain) format instead of *domain\username* format to sign in. This is supported for domain-joined or hybrid-joined (both domain-joined and Microsoft Entra joined) virtual machines. It isn't supported for Microsoft Entra joined-only virtual machines.|

### SSH key generation example

The following example shows the output when you create a new RSA SSH key:

```
ashishj@dreamcatcher:~$ ssh-keygen -t rsa -b 4096 -C "email@domain.com"
Generating public/private rsa key pair.
Enter file in which to save the key (/home/ashishj/.ssh/id_rsa):
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in /home/ashishj/.ssh/id_rsa.
Your public key has been saved in /home/ashishj/.ssh/id_rsa.pub.
The key fingerprint is:
SHA256:c+SBciKXnwceaNQ8Ms8C4h46BsNosYx+9d+AUxdazuE email@domain.com
The key's randomart image is:
+---[RSA 4096]----+
|      .o         |
| .. ..oo+. +     |
|=.o...B==.O o    |
|==o  =.*oO E     |
|++ .. ..S =      |
|oo..   + =       |
|...     o o      |
|         . .     |
|                 |
+----[SHA256]-----+
```

## Connectivity issues

This section describes common connectivity issues and their resolutions.

|Issue  |Description  |Resolution  |
|---------|---------|---------|
|Unable to connect to virtual machine|You're unable to connect to your virtual machine (and you're not experiencing the other problems listed in this article).|You can troubleshoot your connectivity issues by navigating to the **Connection Troubleshoot** tab (in the **Help** section) of your Azure Bastion resource in the Azure portal. Network Watcher Connection Troubleshoot provides the capability to check a direct TCP connection from a virtual machine (VM) to a VM, fully qualified domain name (FQDN), URI, or IPv4 address. To start, choose a source to start the connection from, and the destination you wish to connect to and select "Check". For more information, see [Connection Troubleshoot](../network-watcher/network-watcher-connectivity-overview.md).<br><br>If just-in-time (JIT) is enabled, you might need to add additional role assignments to connect to Bastion. Add the permissions listed in the [JIT permissions table](#jit-permissions) to the user, and then try reconnecting to Bastion. For more information, see [Enable just-in-time access on VMs](/azure/defender-for-cloud/just-in-time-access-usage).|
|File transfer not working|File transfer isn't working as expected with Azure Bastion.|Azure Bastion offers support for file transfer between your target VM and local computer using Bastion and a native RDP or SSH client. At this time, you can't upload or download files using PowerShell or via the Azure portal. For more information, see [Upload and download files using the native client](./vm-upload-download-native.md).|
|Black screen in the Azure portal|When you try to connect using Azure Bastion, you can't connect to the target VM, and you get a black screen in the Azure portal.|This happens when there's either a network connectivity issue between your web browser and Azure Bastion (your client Internet firewall might be blocking WebSockets traffic or similar), or between the Azure Bastion and your target VM. Most cases include an NSG applied either to AzureBastionSubnet, or on your target VM subnet that's blocking the RDP/SSH traffic in your virtual network. Allow WebSockets traffic on your client internet firewall, and check the NSGs on your target VM subnet. See the [Unable to connect to virtual machine](#connectivity-issues) row in this table to learn how to use **Connection Troubleshoot** to troubleshoot your connectivity issues.|
|Session has expired error|You get a "Your session has expired" error message before the Bastion session starts.|If you go to the URL directly from another browser session or tab, this error is expected. It helps ensure that your session is more secure and that the session can be accessed only through the Azure portal. Sign in to the Azure portal and begin your session again.|

### JIT permissions

The following table lists the permissions required for just-in-time (JIT) access:

| Setting | Description|
|---|---|
|Microsoft.Security/locations/jitNetworkAccessPolicies/read|Gets the just-in-time network access policies|
|Microsoft.Security/locations/jitNetworkAccessPolicies/write | Creates a new just-in-time network access policy or updates an existing one |

## Shareable links issues

This section describes common shareable links issues and their resolutions.

|Issue  |Description  |Resolution  |
|---------|---------|------|
|Custom domains not supported|Custom domains aren't supported with Bastion shareable links.|Custom domains aren't supported with Bastion shareable links. Users receive a certificate error upon trying to add specific domains in the CN/SAN of the Bastion host certificate. This is a current limitation.|
|Reset Password not available for shareable link users|Reset Password button appears but doesn't work for local users connecting via shareable link.|Some organizations have company policies that require a password reset when a user signs in to a local account for the first time. When you use shareable links, you can't change the password, even though a "Reset Password" button might appear. This is a known limitation.|

## Virtual network peering issues

This section describes common virtual network peering issues and their resolutions.

|Issue  |Description  |Resolution  |
|---------|---------|------|
|Can't see VM in peered virtual network|You have access to the peered virtual network, but you can't see the VM deployed there.|Make sure you have **read** access to both the VM and the peered virtual network. Additionally, check under IAM that you have **read** access to the following resources:<br><br>• Reader role on the virtual machine<br>• Reader role on the NIC with private IP of the virtual machine<br>• Reader role on the Azure Bastion resource<br>• Reader role on the virtual network (not needed if there isn't a peered virtual network)<br><br>For a complete list of required permissions, see the [virtual network peering permissions table](#virtual-network-peering-permissions).|

### Virtual network peering permissions

The following table lists the permissions required for accessing VMs in peered virtual networks:

|Permissions|Description|Permission type|
|---|---| ---|
|Microsoft.Network/bastionHosts/read |Gets a Bastion Host|Action|
|Microsoft.Network/virtualNetworks/BastionHosts/action |Gets Bastion Host references in a virtual network.|Action|
|Microsoft.Network/virtualNetworks/bastionHosts/default/action|Gets Bastion Host references in a virtual network.|Action|
|Microsoft.Network/networkInterfaces/read|Gets a network interface definition.|Action|
|Microsoft.Network/networkInterfaces/ipconfigurations/read|Gets a network interface IP configuration definition.|Action|
|Microsoft.Network/virtualNetworks/read|Get the virtual network definition|Action|
|Microsoft.Network/virtualNetworks/subnets/virtualMachines/read|Gets references to all the virtual machines in a virtual network subnet|Action|
|Microsoft.Network/virtualNetworks/virtualMachines/read|Gets references to all the virtual machines in a virtual network|Action|

## Next steps

- [Azure Bastion FAQ](bastion-faq.md)
- [Azure Bastion configuration settings](configuration-settings.md)
- [Working with NSG access and Azure Bastion](bastion-nsg.md)
- [Upload and download files using the native client](vm-upload-download-native.md)
