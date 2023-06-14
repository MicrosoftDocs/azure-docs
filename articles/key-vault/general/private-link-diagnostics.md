---
title: Diagnose private links configuration issues on Azure Key Vault
description: Resolve common private links issues with Key Vault and deep dive into the configuration
author: msfcolombo
ms.author: fcolombo
ms.date: 01/17/2023
ms.service: key-vault
ms.subservice: general
ms.topic: how-to

---
# Diagnose private links configuration issues on Azure Key Vault

## Introduction

This article helps users diagnosing and fixing issues involving Key Vault and the Private Links feature. This guide helps on configuration aspects, such as getting private links working for the first time, or for fixing a situation where private links stopped working because of some change.

If you are new to this feature, see [Integrate Key Vault with Azure Private Link](private-link-service.md).

### Problems covered by this article

- Your DNS queries still return a public IP address for the key vault, instead of a private IP address that you would expect from using the private links feature.
- All requests made by a given client that is using private link, are failing with timeouts or network errors, and the problem is not intermittent.
- The key vault has a private IP address, but requests still get `403` response with the `ForbiddenByFirewall` inner error code.
- You are using private links, but your key vault still accepts requests from the public Internet.
- Your key vault has two Private Endpoints. Requests using one are working fine, but requests using the other are failing.
- You have another subscription, key vault, or virtual network that is using private links. You want to make a new similar deployment, but you can't get private links to work there.

### Problems NOT covered by this article

- There is an intermittent connectivity issue. In a given client, you see some requests working and some not working. *Intermittent problems are typically not caused by an issue in private links configuration; they are a sign of network or client overload.*
- You are using an Azure product that supports BYOK (Bring Your Own Key), CMK (Customer Managed Keys), or access to secrets stored in key vault. When you enable the firewall in key vault settings, that product cannot access your key vault. *Look at product specific documentation. Make sure it explicitly states support for key vaults with the firewall enabled. Contact support for that specific product, if needed.*

### How to read this article

If you are new to private links or you are evaluating a complex deployment, it's recommended that you read the entire article. Otherwise, feel free to choose the section that makes more sense for the problem you are facing.

Let's get started!

## 1. Confirm that you own the client connection

### Confirm that your client runs at the virtual network

This guide is intended to help you fixing connections to key vault that originate from application code. Examples are applications and scripts that execute in Azure Virtual Machines, Azure Service Fabric clusters, Azure App Service, Azure Kubernetes Service (AKS), and similar others. This guide is also applicable to accesses performed in the Azure portal web-base user interface, where the browser accesses your key vault directly.

By definition of private links, the application, script or portal must be running on machine, cluster, or environment connected to the Virtual Network where the [Private Endpoint resource](../../private-link/private-endpoint-overview.md) was deployed.

If the application, script or portal is running on an arbitrary Internet-connected network, this guide is NOT applicable, and likely private links cannot be used. This limitation is also applicable to commands executed in the Azure Cloud Shell, because they run in a remote Azure machine provided on-demand instead of the user browser.

### If you use a managed solution, refer to specific documentation

This guide is NOT applicable to solutions that are managed by Microsoft, where the key vault is accessed by an Azure product that exists independently from the customer Virtual Network. Examples of such scenarios are Azure Storage or Azure SQL configured for encryption at rest, Azure Event Hubs encrypting data with customer-provided keys, Azure Data Factory accessing service credentials stored in key vault, Azure Pipelines retrieving secrets from key vault, and other similar scenarios. In these cases, *you must check if the product supports key vaults with the firewall enabled*. This support is typically performed with the [Trusted Services](overview-vnet-service-endpoints.md#trusted-services) feature of Key Vault firewall. However, many products are not included in the list of trusted services, for various reasons. In that case, reach the product-specific support.

A few Azure products supports the concept of *vnet injection*. In simple terms, the product adds a network device into the customer Virtual Network, allowing it to send requests as if it was deployed to the Virtual Network. A notable example is [Azure Databricks](/azure/databricks/administration-guide/cloud-configurations/azure/vnet-inject). Products like this can make requests to the key vault using the private links, and this troubleshooting guide may help.

## 2. Confirm that the connection is approved and succeeded

The following steps validate that the private endpoint connection is approved  and succeeded:

1. Open the Azure portal and open your key vault resource.
2. In the left menu, select **Networking**.
3. Select the **Private endpoint connections** tab. This will show all private endpoint connections and their respective states. If there are no connections, or if the connection for your Virtual Network is missing, you have to create a new Private Endpoint. This will be covered later.
4. Still in **Private endpoint connections**, find the one you are diagnosing and confirm that "Connection state" is **Approved** and "Provisioning state" is **Succeeded**.
    - If the connection is in "Pending" state, you might be able to just approve it.
    - If the connection "Rejected", "Failed", "Error", "Disconnected" or other state, then it's not effective at all, you have to create a new Private Endpoint resource.

It's a good idea to delete ineffective connections in order to keep things clean.

## 3. Confirm that the key vault firewall is properly configured

>[!IMPORTANT]
> Changing firewall settings may remove access from legitimate clients that are still not using private links. Make sure you are aware of the implications of each change in the firewall configuration.

An important notion is that the private links feature only *gives* access to your key vault in a Virtual Network that is closed to prevent data exfiltration. It does not *remove* any existing access. In order to effectively block accesses from the public Internet, you must enable the key vault firewall explicitly:

1. Open the Azure portal and open your key vault resource.
2. In the left menu, select **Networking**.
3. Make sure the **Firewalls and virtual networks** tab is selected on top.
4. If you find **Allow public access from all networks** selected, that explains why external clients are still able to access the key vault. If you would like the Key Vault to be accessible only over Private Link, select **Disable Public Access**.

The following statements also apply to firewall settings:

- The private links feature doesn't require any "virtual network" to be specified in the key vault firewall settings. All requests using the private IP address of the key vault (see next section) must work, even if no virtual network is specified in key vault firewall settings.
- The private links feature doesn't require specifying any IP address in the key vault firewall settings. Again, all requests using the private IP address of the key vault must work, even if no IP address was specified in the firewall settings.

If you are using private links, the only motivations for specifying virtual network or IP address in key vault firewall are:

- You have an hybrid system where some clients use private links, some use service endpoints, some use public IP address.
- You are transitioning to private links. In this case, once you confirm all clients are using private links, you should remove virtual networks and IP addresses from the key vault firewall settings.

## 4. Make sure the key vault has a private IP address

### Difference between private and public IP addresses

A private IP address has always one of the following formats:

- 10.x.x.x: Examples: `10.1.2.3`, `10.56.34.12`.
- 172.16.x.x to 172.32.x.x: Examples: `172.20.1.1`, `172.31.67.89`.
- 192.168.x.x: Examples: `192.168.0.1`, `192.168.100.7`

Certain IP addresses and ranges are reserved:

- 224.x.x.x: Multicast
- 255.255.255.255: Broadcast
- 127.x.x.x: Loopback
- 169.254.x.x: Link-local
- 168.63.129.16: Internal DNS

All other IP addresses are public.

When you browse the portal or run a command that shows the IP address, make sure you can identify if that IP address is private, public, or reserved. For private links to work, the key vault hostname must resolve to a private IP address belonging to the Virtual Network address space.

### Find the key vault private IP address in the virtual network

You will need to diagnose hostname resolution, and for that you must know the exact private IP address of your key vault with private links enabled. In order to find that address, follow this procedure:

1. Open the Azure portal and open your key vault resource.
2. In the left menu, select **Networking**.
3. Select the **Private endpoint connections** tab. This will show all private endpoint connections and their respective states.
4. Find the one you are diagnosing and confirm that "Connection state" is **Approved** and Provisioning state is **Succeeded**. If you are not seeing this, go back to previous sections of this document.
5. When you find the right item, click the link in the **Private endpoint** column. This will open the Private Endpoint resource.
6. The Overview page may show a section called **Custom DNS settings**. Confirm that there is only one entry that matches the key vault hostname. That entry shows the key vault private IP address.
7. You may also click the link at **Network interface** and confirm that the private IP address is the same displayed in the previous step. The network interface is a virtual device that represents key vault.

The IP address is the one that VMs and other devices *running in the same Virtual Network* will use to connect to the key vault. Make note of the IP address, or keep the browser tab open and don't touch it while you do further investigations.

>[!NOTE]
> If your key vault has multiple private endpoints, then it has multiple private IP addresses. This is only useful if you have multiple Virtual Networks accessing the same key vault, each through its own Private Endpoint (the Private Endpoint belongs to a single Virtual Network). Make sure you diagnose the problem for the correct Virtual Network, and select the correct private endpoint connection in the procedure above. Furthermore, **do not** create multiple Private Endpoints for the same Key Vault in the same Virtual Network. This is not needed and is a source of confusion.

## 5. Validate the DNS resolution

DNS resolution is the process of translating the key vault hostname (example: `fabrikam.vault.azure.net`) into an IP address (example: `10.1.2.3`). The following subsections show expected results of DNS resolution in each scenario.

### Key vaults without private link

This section is intended for learning purposes. When the key vault has no private endpoint connection in approved state, resolving the hostname gives a result similar to this one:

Windows:

```console
C:\> nslookup fabrikam.vault.azure.net
```

```output
Non-authoritative answer:
Address:  52.168.109.101
Aliases:  fabrikam.vault.azure.net
          data-prod-eus.vaultcore.azure.net
          data-prod-eus-region.vaultcore.azure.net
```

Linux:

```console
joe@MyUbuntu:~$ host fabrikam.vault.azure.net
```

```output
fabrikam.vault.azure.net is an alias for data-prod-eus.vaultcore.azure.net.
data-prod-eus.vaultcore.azure.net is an alias for data-prod-eus-region.vaultcore.azure.net.
data-prod-eus-region.vaultcore.azure.net has address 52.168.109.101
```

You can see that the name resolves to a public IP address, and there is no `privatelink` alias. The alias is explained later, don't worry about it now.

The above result is expected regardless of the machine be connected to the Virtual Network or be an arbitrary machine with an Internet connection. This happens because the key vault has no private endpoint connection in approved state, and therefore there is no need for the key vault to support private links.

### Key vault with private link resolving from arbitrary Internet machine

When the key vault has one or more private endpoint connections in approved state and you resolve the hostname from an arbitrary machine connected to the Internet (a machine that *is not* connected to the Virtual Network where the Private Endpoint resides), you shall find this:

Windows:

```console
C:\> nslookup fabrikam.vault.azure.net
```

```output
Non-authoritative answer:
Address:  52.168.109.101
Aliases:  fabrikam.vault.azure.net
          fabrikam.privatelink.vaultcore.azure.net
          data-prod-eus.vaultcore.azure.net
          data-prod-eus-region.vaultcore.azure.net
```

Linux:

```console
joe@MyUbuntu:~$ host fabrikam.vault.azure.net
```

```output
fabrikam.vault.azure.net is an alias for fabrikam.privatelink.vaultcore.azure.net.
fabrikam.privatelink.vaultcore.azure.net is an alias for data-prod-eus.vaultcore.azure.net.
data-prod-eus.vaultcore.azure.net is an alias for data-prod-eus-region.vaultcore.azure.net.
data-prod-eus-region.vaultcore.azure.net has address 52.168.109.101
```

The notable difference from previous scenario is that there is a new alias with the value `{vaultname}.privatelink.vaultcore.azure.net`. This means the key vault Data Plane is ready to accept requests from private links.

It doesn't mean that requests performed from machines *outside* the Virtual Network (like the one you just used) will use private links - they won't. You can see that from the fact that the hostname still resolves to a public IP address. Only machines *connected to the Virtual Network* can use private links. More on this will follow.

If you don't see the `privatelink` alias, it means the key vault has zero private endpoint connections in `Approved` state. Go back to [this section](#2-confirm-that-the-connection-is-approved-and-succeeded) before retrying.

### Key vault with private link resolving from Virtual Network

When the key vault has one or more private endpoint connections in approved state and you resolve the hostname from a machine connected to the Virtual Network where the Private Endpoint was create, this is the expected response:

Windows:

```console
C:\> nslookup fabrikam.vault.azure.net
```

```output
Non-authoritative answer:
Address:  10.1.2.3
Aliases:  fabrikam.vault.azure.net
          fabrikam.privatelink.vaultcore.azure.net
```

Linux:

```console
joe@MyUbuntu:~$ host fabrikam.vault.azure.net
```

```output
fabrikam.vault.azure.net is an alias for fabrikam.privatelink.vaultcore.azure.net.
fabrikam.privatelink.vaultcore.azure.net has address 10.1.2.3
```

There are two notable differences. First, the name resolves to a private IP address. That must be the IP address that we found in the [corresponding section](#find-the-key-vault-private-ip-address-in-the-virtual-network) of this article. Second, there are no other aliases after the `privatelink` one. This happens because the Virtual Network DNS servers *intercept* the chain of aliases and return the private IP address directly from the name `fabrikam.privatelink.vaultcore.azure.net`. That entry is actually an `A` record in a Private DNS Zone. More on this will follow.

>[!NOTE]
> The outcome above only happens at a Virtual Machine connected to the Virtual Network where the Private Endpoint was created. If you don't have a VM deployed in the Virtual Network that contains the Private Endpoint, deploy one and connect remotely to it, then execute the `nslookup` command (Windows) or the `host` command (Linux) above.

If you run these commands on a Virtual Machine connected to the Virtual Network where the Private Endpoint was created, and they are **not** showing the key vault private IP address, the next section may help fixing the issue.

## 6. Validate the Private DNS Zone

If the DNS resolution is not working as described in previous section, there might be an issue with your Private DNS Zone and this section may help. If the DNS resolution shows the correct key vault private IP address, your Private DNS Zone is probably correct. You can skip this entire section.

### Confirm that the required Private DNS Zone resource exists

Your Azure subscription must have a [Private DNS Zone](../../dns/private-dns-privatednszone.md) resource with this exact name:

`privatelink.vaultcore.azure.net`

You can check for the presence of this resource by going to the subscription page in the Portal, and selecting "Resources" on the left menu. The resource name must be `privatelink.vaultcore.azure.net`, and the resource type must be **Private DNS zone**.

Normally this resource is created automatically when you create a Private Endpoint using a common procedure. But there are cases where this resource is not created automatically and you have to do it manually. This resource might have been accidentally deleted as well.

If you don't have this resource, create a new Private DNS Zone resource in your subscription. Remember that the name must be exactly `privatelink.vaultcore.azure.net`, without spaces or additional dots. If you specify the wrong name, the name resolution explained in this article will not work. For more information on how to create this resource, see [Create an Azure private DNS zone using the Azure portal](../../dns/private-dns-getstarted-portal.md). If you follow that page, you can skip Virtual Network creation because at this point you should have one already. You can also skip validation procedures with Virtual Machines.

### Confirm that the Private DNS Zone is linked to the Virtual Network

It is not enough to have a Private DNS Zone. It must also be linked to the Virtual Network that contains the Private Endpoint. If the Private DNS Zone is not linked to the correct Virtual Network, any DNS resolution from that Virtual Network will ignore the Private DNS Zone.

Open the Private DNS Zone resource and click the **Virtual network links** option in the left menu. This will show a list of links, each with the name of a Virtual Network in your subscription. The Virtual Network that contains the Private Endpoint resource must be listed here. If it's not there, add it. For detailed steps, see [Link the virtual network](../../dns/private-dns-getstarted-portal.md#link-the-virtual-network). You can leave "Enable auto registration" unchecked - that feature is not related to private links.

Once the Private DNS Zone is linked to the Virtual Network, DNS requests originating from the Virtual Network will look for names in the Private DNS Zone. This is required for correct address resolution performed at Virtual Machines connected to the Virtual Network where the Private Endpoint was created.

>[!NOTE]
> If you just saved the link, it may take some time for this go into effect, even after the Portal says the operation is complete. You might also need to reboot the VM that you are using to test DNS resolution.

### Confirm that the Private DNS Zone contains the right A record

Using the Portal, open the Private DNS Zone with name `privatelink.vaultcore.azure.net`. The Overview page shows all records. By default, there will be one record with name `@` and type `SOA`, meaning Start of Authority. Don't touch that.

For the key vault name resolution to work, there must be an `A` record with the simple vault name without suffix or dots. For example, if the hostname is `fabrikam.vault.azure.net`, there must be an `A` record with the name `fabrikam`, without any suffix or dots.

Also, the value of the `A` record (the IP address) must be [the key vault private IP address](#find-the-key-vault-private-ip-address-in-the-virtual-network). If you find the `A` record but it contains the wrong IP address, you must remove the wrong IP address and add a new one. It's recommended that you remove the entire `A` record and add a new one.

>[!NOTE]
> Whenever you remove or modify an `A` record, the machine may still resolve to the old IP address because the TTL (Time To Live) value might not be expired yet. It is recommended that you always specify a TTL value no smaller than 10 seconds and no bigger than 600 seconds (10 minutes). If you specify a value that is too large, your clients may take too long to recover from outages.

### DNS resolution for more than one Virtual Network

If there are multiple Virtual Networks and each has its own Private Endpoint resource referencing the same key vault, then the key vault hostname needs to resolve to a different private IP address depending on the network. This means multiple Private DNS Zones are also needed, each linked to a different Virtual Network and using a different IP address in the `A` record.

In more advanced scenarios, the Virtual Networks may have peering enabled. In this case, only one Virtual Network needs the Private Endpoint resource, although both may need to be linked to the Private DNS Zone resource. This is scenario is not directly covered by this document.

### Understand that you have control over DNS resolution

As explained in the [previous section](#key-vault-with-private-link-resolving-from-arbitrary-internet-machine), a key vault with private links has the alias `{vaultname}.privatelink.vaultcore.azure.net` in its *public* registration. The DNS server used by the Virtual Network uses the public registration, but it checks every alias for a *private* registration, and if one is found, it will stop following aliases defined at public registration.

This logic means that if the Virtual Network is linked to a Private DNS Zone with name `privatelink.vaultcore.azure.net`, and the public DNS registration for the key vault has the alias `fabrikam.privatelink.vaultcore.azure.net` (note that the key vault hostname suffix matches the Private DNS Zone name exactly), then the DNS query will look for an `A` record with name `fabrikam` *in the Private DNS Zone*. If the `A` record is found, its IP address is returned in the DNS query, and no further lookup is performed at public DNS registration.

As you can see, the name resolution is under your control. The rationales for this design are:

- You may have a complex scenario that involves custom DNS servers and integration with on-premises networks. In that case, you need to control how names are translated to IP addresses.
- You may need to access a key vault without private links. In that case, resolving the hostname from the Virtual Network must return the public IP address, and this happens because key vaults without private links don't have the `privatelink` alias in the name registration.

## 7. Validate that requests to key vault use private link

### Query the `/healthstatus` endpoint of the key vault

Your key vault provides the `/healthstatus` endpoint, which can be used for diagnostics. The response headers include the origin IP address, as seen by the key vault service. You can call that endpoint with the following command (**remember to use your key vault hostname**):

Windows (PowerShell):

```powershell
PS C:\> $(Invoke-WebRequest -UseBasicParsing -Uri https://fabrikam.vault.azure.net/healthstatus).Headers
```

```output
Key                           Value
---                           -----
Pragma                        no-cache
x-ms-request-id               3729ddde-eb6d-4060-af2b-aac08661d2ec
x-ms-keyvault-service-version 1.2.27.0
x-ms-keyvault-network-info    addr=10.4.5.6;act_addr_fam=InterNetworkV6;
Strict-Transport-Security     max-age=31536000;includeSubDomains
Content-Length                4
Cache-Control                 no-cache
Content-Type                  application/json; charset=utf-8
```

Linux, or a recent version of Windows 10 that includes `curl`:

```console
joe@MyUbuntu:~$ curl -i https://fabrikam.vault.azure.net/healthstatus
```

```output
HTTP/1.1 200 OK
Cache-Control: no-cache
Pragma: no-cache
Content-Type: application/json; charset=utf-8
x-ms-request-id: 6c090c46-0a1c-48ab-b740-3442ce17e75e
x-ms-keyvault-service-version: 1.2.27.0
x-ms-keyvault-network-info: addr=10.4.5.6;act_addr_fam=InterNetworkV6;
Strict-Transport-Security: max-age=31536000;includeSubDomains
Content-Length: 4
```

If you are not getting an output similar to that, or if you get a network error, it means your key vault is not accessible via the hostname you specified (`fabrikam.vault.azure.net` in the example). Either the hostname is not resolving to the correct IP address, or you have a connectivity issue at the transport layer. It may be caused by routing issues, package drops, and other reasons. You have to investigate further.

The response must include header `x-ms-keyvault-network-info`:

```console
x-ms-keyvault-network-info: addr=10.4.5.6;act_addr_fam=InterNetworkV6;
```

The `addr` field in the `x-ms-keyvault-network-info` header shows the IP address of the origin of the request. This IP address can be one of the following:

- The private IP address of the machine doing the request. This indicates that the request is using private links or service endpoints. This is the expected outcome for private links.
- Some other private IP address, *not* from the machine doing the request. This indicates that some custom routing is effective. It still indicates that the request is using private links or service endpoints.
- Some public IP address. This indicates that the request is being routed to the Internet through a gateway (NAT) device. This indicates that the request is NOT using private links, and some issue needs to be fixed. The common reasons for this are 1) the private endpoint is not in approved and succeeded state; and 2) the hostname is not resolving to the key vault's private IP address. This article includes troubleshooting actions for both cases.

>[!NOTE]
> If the request to `/healthstatus` works, but the `x-ms-keyvault-network-info` header is missing, then the endpoint is likely not being served by the key vault. Since the above commands also validate HTTPS certificate, the missing header might be a sign of tampering.

### Query the key vault IP address directly

>[!IMPORTANT]
> Accessing the key vault without HTTPS certificate validation is dangerous and can only be used for learning purposes. Production code must NEVER access the key vault without this client-side validation. Even if you are just diagnosing issues, you might be subject to tampering attempts that will not be revealed if you frequently disable HTTPS certificate validation in your requests to key vault.

If you installed a recent version of PowerShell, you can use `-SkipCertificateCheck` to skip HTTPS certificate checks, then you can target the [key vault IP address](#find-the-key-vault-private-ip-address-in-the-virtual-network) directly:

```powershell
PS C:\> $(Invoke-WebRequest -SkipCertificateCheck -Uri https://10.1.2.3/healthstatus).Headers
```

If you are using `curl`, you can do the same with the `-k` argument:

```console
joe@MyUbuntu:~$ curl -i -k https://10.1.2.3/healthstatus
```

The responses must be the same of previous section, which means it must include the `x-ms-keyvault-network-info` header with the same value. The `/healthstatus` endpoint doesn't care if you are using the key vault hostname or IP address.

If you see `x-ms-keyvault-network-info` returning one value for the request using the key vault hostname, and another value for the request using the IP address, then each request is targeting a different endpoint. Refer to the explanation of the `addr` field from `x-ms-keyvault-network-info` in the previous section, to decide which case is wrong and needs to be fixed.

## 8. Other changes and customizations that cause impact

The following items are non-exhaustive investigation actions. They will tell you where to look for additional issues, but you must have advanced network knowledge to fix issues in these scenarios.

### Diagnose custom DNS servers at Virtual Network

In the Portal, open the Virtual Network resource. In the left menu, open **DNS servers**. If you are using "Custom", then DNS resolution may not be as described in this document. You have to diagnose how your DNS servers are resolving the key vault hostname.

If you are using the default Azure-provided DNS servers, this entire document is applicable.

### Diagnose hosts overriding or custom DNS servers at Virtual Machine

Many operating systems allow setting an explicit fixed IP address per hostname, typically by changing the `hosts` file. They may also allow overriding the DNS servers. If you use one of these scenarios, proceed with system specific diagnostics options.

### Promiscuous proxies (Fiddler, etc.)

Except when explicitly noted, the diagnostics options in this article only work if there is no promiscuous proxy present in the environment. While these proxies are often installed exclusively in the machine that is being diagnosed (Fiddler is the most common example), advanced administrators may overwrite root Certificate Authorities (CAs) and install a promiscuous proxy in gateway devices that serve multiple machines in the network. These proxies can affect both security and reliability substantially. Microsoft does not support configurations that use such products.

### Other things that may affect connectivity

This is a non-exhaustive list of items that can be found on advanced or complex scenarios:

- Firewall settings, either the Azure Firewall connected to the Virtual Network, or a custom firewall solution deploying in the Virtual Network or in the machine.
- Network peering, which may impact which DNS servers are used and how traffic is routed.
- Custom gateway (NAT) solutions, which may impact how traffic is routed, including traffic from DNS queries.
