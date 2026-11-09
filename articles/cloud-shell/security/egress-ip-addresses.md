---
title: Azure Cloud Shell outbound IP addresses
description: Find your Azure Cloud Shell session region and configure supported Azure resource public endpoint network rules for Cloud Shell outbound IP addresses.
ms.date: 11/09/2026
ms.topic: how-to
---
# Azure Cloud Shell outbound IP addresses

When you use the default Azure Cloud Shell environment to connect to an Azure resource's public
endpoint, the resource can receive traffic from a shared Cloud Shell outbound (egress) IP address.
If the resource supports public IP network rules, you can allow the applicable regional addresses
while restricting other public access.

IP network rules don't provide access to private-endpoint-only resources. If your resources must
remain private, use [Cloud Shell in a virtual network][01] instead.

## Find your Cloud Shell session region

To find the region of your current Cloud Shell machine, run the following command in Bash:

```bash
echo "$ACC_LOCATION"
```

In PowerShell, run:

```powershell
$env:ACC_LOCATION
```

Match the returned value to the region identifier in the following table. Use the region of the
Cloud Shell session, not the region of the resource that you want to access. Check the region again
when you start a new session.

## Regional outbound IP addresses

The following table lists Cloud Shell NAT gateway public IPv4 addresses by region. These addresses
aren't assigned exclusively to your user, subscription, or tenant. The table covers NAT gateway
egress, not every possible outbound network path.

| Region | Region identifier | Outbound IPv4 addresses |
| --- | --- | --- |
| Australia East | `australiaeast` | `4.198.204.254`, `4.198.205.186`, `4.198.205.187`, `4.198.205.189` |
| Australia Southeast | `australiasoutheast` | `4.199.114.154`, `4.199.115.154`, `4.199.115.155`, `4.199.115.157` |
| Central India | `centralindia` | `135.13.134.69`, `135.13.134.72`, `135.13.134.73`, `135.13.134.74` |
| Central US EUAP | `centraluseuap` | `20.46.12.224`, `20.46.12.226` |
| East US 2 | `eastus2` | `9.234.210.115`, `9.234.210.168`, `9.234.210.169`, `9.234.210.170` |
| East US 2 EUAP | `eastus2euap` | `74.151.26.8`, `74.151.26.9`, `74.151.26.10` |
| France Central | `francecentral` | `48.220.18.170`, `48.220.18.172` |
| Germany West Central | `germanywestcentral` | `135.220.92.106` |
| North Europe | `northeurope` | `134.149.91.186` |
| South Central US | `southcentralus` | `48.221.128.48`, `48.221.128.53`, `48.221.128.56`, `48.221.128.57` |
| South India | `southindia` | `135.13.5.170`, `135.13.5.171`, `135.13.7.192` |
| Southeast Asia | `southeastasia` | `135.171.36.88`, `135.171.36.89`, `135.171.36.90` |
| Sweden Central | `swedencentral` | `135.116.40.62`, `135.116.40.63`, `135.116.41.120`, `135.225.147.226` |
| West Central US | `westcentralus` | `128.24.198.36`, `128.24.198.43`, `128.24.198.46` |
| West Europe | `westeurope` | `134.149.156.73`, `134.149.156.74`, `134.149.156.75` |
| West US 2 | `westus2` | `48.221.10.88`, `48.221.10.92`, `48.221.10.96`, `48.221.10.97` |

## Configure resource network rules

1. Confirm that the target resource supports source public IP rules and that its public endpoint
   is enabled for access from selected networks. Follow that service's networking documentation;
   support and rule behavior vary by service.
1. Find your current Cloud Shell session region by using `ACC_LOCATION`.
1. Add the addresses listed for that region to the resource's allowed source IP addresses. If the
   rule requires CIDR notation, enter each individual IPv4 address with a `/32` prefix length.
1. Connect from Cloud Shell by using the resource's public endpoint and your usual credentials.

> [!IMPORTANT]
> These IP addresses are shared service infrastructure, not proof of a user's or tenant's identity.
> Allowing an address doesn't grant permissions to the resource. Continue to require authentication
> and authorization, and grant only the permissions that users need.

Don't rely on a single observed outbound IP address as a fixed address for a session or user.
Allowing these addresses doesn't override routing, DNS, other firewall rules, or a resource's
disabled public network access setting. If a connection still fails, check the target service's
networking requirements and the network path used by the request.

## Access resources without enabling public access

For resources that must not expose a public endpoint, [deploy Cloud Shell in a virtual network][01]
that you control. With the required private connectivity, DNS, routing, network rules, and resource
permissions in place, Cloud Shell can access those resources privately without adding the shared
public addresses in this article to their network rules.

Review the [supported regions and architecture][01] and follow the
[virtual network deployment prerequisites and configuration steps][02]. The documented deployment
requires the Owner role on the subscription, resource provider registration, the required subnets,
Azure Relay, and accessible storage. Azure Relay, storage, and network resource charges apply.
For private access to Cloud Shell's storage, see
[Connect to a storage account using an Azure private endpoint][03].

<!-- link references -->
[01]: ../vnet/overview.md
[02]: ../vnet/deployment.md
[03]: ../vnet/how-to-use-private-endpoint-storage.md
