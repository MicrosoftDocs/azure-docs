---
title: Troubleshooting network issues with the Azure Storage Mover Agent
description: Learn how to troubleshoot network issues with the Azure Storage Mover Agent.
author: stevenmatthew
ms.author: shaas
ms.service: azure-storage-mover
ms.topic: how-to
ms.date: 10/22/2025
ms.custom: template-how-to
---

# Troubleshooting network issues with the Azure Storage Mover agent

The Azure Storage Mover agent is an important part of the Azure Storage Mover service, a powerful tool for seamlessly migrating data to Azure. The agent's functionality depends heavily on reliable network connectivity. When network issues arise, the Azure Storage Mover agent provides a robust set of tools for diagnosing and resolving network issues. 

By following a structured approach, starting with configuration checks, progressing through connectivity tests, and applying endpoint diagnostics, administrators can ensure reliable operation and successful data migrations. For persistent or complex issues, the support bundle offers a path to deeper analysis and assistance from Microsoft Support. 

These native diagnostic tools can be used with standard network troubleshooting tools and techniques.

This article outlines available methods for troubleshooting agent network issues. Recommended troubleshooting steps include configuration checks, connectivity tests, endpoint diagnostics, and the use of support tools.

## Network configuration overview

The recommended first step in diagnosing network issues is to inspect the agent's network configuration. This inspection can be done via the **Show network configuration** tool located in **Network Configuration** group of the agent's menu. 

The **Show Network Configuration** tool displays critical information such as:

- DHCP status
- IP address and subnet mask
- MAC address
- Link and operational state
- Speed and MTU
- DNS servers and routing table
- Default gateway and proxy settings
- NTP server configuration

The following example provides sample output from the tool:

```Output
Network Interface(s):
eth0:
  DHCP (Dynamic Host Configuration Protocol) status: true
  IP Address and mask: 192.168.1.10/24
  MAC Address (The unique hardware identifier for your network interface): 00:1A:2B:3C:4D:5E
  Link (The connection status of your network interface): up
  Operstate (The operational state of your network interface): up
  Speed (The data transfer rate of your network interface): 10Gbps
  MTU (Maximum Transmission Unit - the largest size of a network packet that can be transmitted): 1500
  DNS (Domain Name System - the service that translates domain names to IP addresses): 192.168.1.1
  Routes (The rules that determine the paths network traffic will take from your device to reach their destination):
    default via 192.168.1.1 proto dhcp src 192.168.1.10 metric 100
    192.168.1.0/24 dev eth0 proto kernel scope link src 192.168.1.10 metric 100
    169.254.0.0/24 proto dhcp scope link src 192.168.1.10 metric 100
Global DNS (The Domain Name System servers that are used by all devices on your network): 192.168.1.1
Default Gateway (The device that routes your network traffic to other networks or the internet): 192.168.1.1
Proxy (A server that acts as an intermediary for requests from clients seeking resources from other servers): No proxy
NTP Server(s) (Network Time Protocol servers - these servers provide time synchronization for your device): [ntp.ubuntu.com, time.google.com]
```

When an agent's network configuration is inspected, any fields containing blank or incorrect values indicate a potential misconfiguration of the hypervisor's network adapter settings or the agent's interface settings. For example, an empty `IP address` value or a `Link` or `Operstate` status other than `up` suggests that the agent might not be properly connected to the network. In such cases, administrators should verify the hypervisor's network adapter settings or reconfigure the agent's interface settings.

## Connectivity testing

After the network configuration is verified, the next step is to test the connectivity to the agent's essential Azure endpoints. The agent provides several tools for this purpose, and allows you to choose the level of detail required for your troubleshooting needs. You can choose from general connectivity tests, verbose output for deeper analysis, or single endpoint testing for targeted diagnostics. All three options provide valuable insights into the agent's network connectivity and can help identify potential issues.

Connectivity testing tools are located in the **Network Configuration** group of the agent's menu.

### General network checks

For general connectivity testing, select the **Test Network Connectivity** option. This tool verifies HTTPS connectivity to essential Azure endpoints, including the endpoints required for agent registration and operations. The tool uses the `azcmagent check` command to test Azure Arc endpoints, and then checks Storage Mover-specific endpoints. The results of these tests include:

- HTTPS reachability
- DNS resolution status
- IP type, either private or public
- Proxy usage

> [!NOTE]
> This test doesn't include Storage Account or Key Vault endpoints used during job execution.

### Verbose network checks

The `Test network connectivity verbosely` option provides a more detailed analysis of network connectivity issues. This enhanced version of the General Network Check provides detailed output from `azcmagent` and `curl`, including HTTP response codes and TLS packet data. It's useful for diagnosing SSL-related issues or inspecting specific error messages.

### Single endpoint testing

The `Test single endpoint connectivity` option allows you to test the connectivity of a specific endpoint. In addition to testing Storage Account and Key Vault endpoints that aren't covered by the general network check, this tool allows targeted testing of a specific endpoint using:

- `nslookup` for DNS resolution
- `traceroute` for path analysis
- `curl` for HTTPS connectivity

The following example provides sample output from the tool:

```Output
1) Show network configuration
2) Update network configuration
3) Test network connectivity
4) Test network connectivity verbosely
5) Test single endpoint connectivity
6) Quit
 
Choice: 5
This option tests connectivity to one endpoint with your current network setup using tools like nslookup, traceroute, curl, etc.
Provide an Azure endpoint (URL or FQDN) to test: https://mydemoaccount.blob.core.windows.net/demo-container
Run in verbose mode? [y/N] n
+----------------------------------------------------------+
| Checking domain name resolution with nslookup... |
+----------------------------------------------------------+
  Testing 'mydemoaccount.blob.core.windows.net'...
 
Server:         203.50.10.50
Address:        203.50.10.50#53
 
Non-authoritative answer:
mydemoaccount.blob.core.windows.net  canonical name = blob.regionprdstr03a.store.core.windows.net.
Name:   blob.regionprdstr03a.store.core.windows.net
Address: 203.60.14.164
 
+------------------------------------------------------------+
|    Checking network path to endpoint with traceroute...    |
+------------------------------------------------------------+
  Testing 'mydemoaccount.blob.core.windows.net' port 443 over TCP...
 
traceroute to mydemoaccount.blob.core.windows.net (10.60.14.164), 30 hops max, 60 byte packets
1  demosrva901.network.microsoft.com (10.126.12.2)  0.401 ms  0.440 ms  0.507 ms
2  demosrvl1.network.microsoft.com (10.10.80.2)  0.279 ms demosrvl2.network.microsoft.com (10.10.80.6)  0.267 ms demosrvl1.network.microsoft.com (10.10.80.2)  0.305 ms
3  demosrvb1.network.microsoft.com (10.126.137.144)  0.303 ms demosrvb3.network.microsoft.com (10.126.137.156)  0.230 ms demosrvb2.network.microsoft.com (10.126.137.146)  0.279 ms
4  musmtv005anrs2.clouddatahub.net (10.126.137.139)  0.274 ms  0.262 ms demosrvs2.network.microsoft.com (10.126.137.141)  0.250 ms
5  10.161.128.7 (10.161.128.7)  0.123 ms 10.161.128.21 (10.161.128.21)  0.216 ms 10.161.128.7 (10.161.128.7)  0.218 ms
6  demosrvs1.network.microsoft.com (10.161.128.4)  0.323 ms  0.337 ms  0.273 ms
7  demosrvb3.network.microsoft.com (10.126.137.4)  0.329 ms demosrvb4.network.microsoft.com (10.126.137.6)  0.553 ms demosrvb2.network.microsoft.com (10.126.137.2)  0.306 ms
8  demosrvc2.network.network.microsoft.com (10.126.137.9)  0.393 ms  0.326 ms demosrvc1.network.network.microsoft.com (10.126.137.1)  0.382 ms
9  democussrvca901.network.microsoft.com (10.37.12.118)  0.800 ms 10.37.12.120 (10.37.12.120)  0.870 ms  0.814 ms
10  * * *
11  * * *
12  * * *
13  democussrvb21ca940.network.microsoft.com (10.37.12.104)  2.850 ms democussrvb21ca940.network.microsoft.com (10.37.12.106)  2.126 ms democussrvb21ca940.network.microsoft.com (10.37.12.104)  2.560 ms
14  democussrvb21an7k1.network.microsoft.com (10.37.171.33)  0.787 ms  0.826 ms  0.814 ms
15  10.37.171.70 (10.37.171.70)  1.077 ms  1.056 ms  1.040 ms
16  democussrvlb21an7k1.microsoft.com (10.37.168.4)  1.221 ms  1.295 ms  1.212 ms
17  democussrvlb21a7201.network.microsoft.com (169.220.17.1)  1.168 ms  1.351 ms  1.340 ms
18  ae60-0.region.ntwk.msn.net (203.44.15.46)  2.153 ms  1.319 ms  1.306 ms
19  ae22-0.region.ntwk.msn.net (203.44.232.202)  1.382 ms ae24-0.region.ntwk.msn.net (203.44.232.204)  1.370 ms  1.717 ms
20  be-120-0.region.ntwk.msn.net (203.44.22.167)  17.054 ms * *
21  be-2-0.region.ntwk.msn.net (203.44.17.23)  16.926 ms * be-2-0.region.ntwk.msn.net (203.44.17.21)  17.911 ms
22  * be-5-0.region.ntwk.msn.net (203.44.17.71)  116.530 ms  116.798 ms
23  169.10.19.29 (169.10.19.29)  18.540 ms  18.096 ms *
24  * 169.10.6.142 (169.10.6.142)  18.161 ms 169.10.11.182 (169.10.11.182)  18.559 ms
25  169.10.11.174 (169.10.11.174)  17.550 ms 169.10.11.170 (169.10.11.170)  17.132 ms *
26  * * *
27  * * 192.98.222.143 (192.98.222.143)  15.860 ms
28  * 127.106.199.121 (127.106.199.121)  16.719 ms 127.106.199.111 (127.106.199.111)  16.341 ms
29  127.106.199.112 (127.106.199.112)  16.521 ms * 127.106.199.109 (127.106.199.109)  16.200 ms
30  * * *
 
+------------------------------------------------+
|   Checking HTTPS connectivity with curl...   |
+------------------------------------------------+
  Testing 'https://mydemoaccount.blob.core.windows.net/sm-nfs4-file-share'...
 
This only checks that the endpoint is physically reachable over the network, and does not attempt authentication or authorization;
some 4XX or 5XX errors will be expected when testing certain Azure endpoints, even when the endpoints are reachable over the network.
See https://learn.microsoft.com/en-us/azure/storage-mover/deployment-planning for more info about RBAC roles for Storage Mover resources.
 
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0
HTTP/1.1 409 Public access is not permitted on this storage account.
Transfer-Encoding: chunked
Server: Blob Service Version 1.0 Microsoft-HTTPAPI/2.0
x-ms-request-id: 22cc22cc-dd33-ee44-ff55-66aa66aa66aa
Date: Thu, 23 Oct 2025 21:37:01 GMT
```

## Service and job status checks

Within the `Service and job Status` menu, two tools are available for assessing the health of the agent's connection to the Storage Mover Service and the status of job executions. These tools, the **Service Communication Status** and **Job Summary, Details, and Copy logs**, help assess the Agent's registration status and job execution health.

- **Service Communication Status**: Verifies the agent's connection to the Storage Mover Service.
- **Job Summary, Details, and Copy logs**: Provide insights into job performance, including transfer rates and potential network errors such as SSL interception.

## Restricted shell tools

The `Open restricted shell` option allows execution of the following basic network commands. These commands are useful for manual diagnostics and troubleshooting source share connectivity issues:

- `nslookup` and `ping` for endpoint testing.
- `mount`, `showmount`, and `umount` for SMB/NFS share diagnostics.

## SMB diagnostics

Within the `Troubleshooting` group, the `SMB Troubleshooting` option collects SMB logs for inclusion in the support bundle. It's essential for diagnosing issues with SMB source shares. These logs provide insights into authentication problems, permission issues, and connectivity errors related to SMB shares.

## Support bundle collection

The `Collect support bundle` option aggregates logs from all diagnostic tools except for the restricted shell tools. It can be shared with Microsoft Support via SFTP, and is the most comprehensive resource for in-depth troubleshooting.

For more help with collecting an agent's support bundle, refer to the [Create, retrieve, and view the support bundle](troubleshooting.md) article.

## Common network issues and resolutions

The following list outlines several common issues and their resolutions:

- **DNS Resolution Failures**<br />
When you encounter issues involving DNS resolution, use the `nslookup` tool, endpoint testing, and network configuration tools to verify DNS settings.
- **HTTPS Connectivity Failures**<br />
HTTPS connectivity failures can often be resolved by checking firewall/proxy settings, validating IP addresses, and inspecting verbose curl output.
- **Arc Private Link Scope Misconfiguration**<br />
Misconfigurations are frequently the cause of most Private Link Scope issues. To resolve these issues, ensure that you obtain correct responses during network checks and validate required endpoint IP types.
- **SSL Interception Errors**<br />
Look for "x509: certificate signed by unknown authority" in verbose logs or copy logs. Allowlisting endpoints might be necessary.

## Next steps

You might find information in the following articles helpful:

- [Release notes](release-notes.md)
- [Resource hierarchy](resource-hierarchy.md)
