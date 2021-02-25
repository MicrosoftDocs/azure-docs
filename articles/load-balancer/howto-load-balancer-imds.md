---
title: Retrieve load balancer metadata using the Azure Instance Metadata Service (IMDS)
titleSuffix: Azure Load Balancer
description: Get started learning how to retrieve load balancer metadata using the Azure Instance Metadata Service.
services: load-balancer
author: asudbring
ms.service: load-balancer
ms.topic: how-to
ms.date: 02/12/2021
ms.author: allensu

---
# Retrieve load balancer metadata using the Azure Instance Metadata Service (IMDS)

## Prerequisites

* Use the [latest API version](../virtual-machines/windows/instance-metadata-service.md?tabs=windows#supported-api-versions) for your request.

## Sample request and response
> [!IMPORTANT]
> This example bypasses proxies. You **must** bypass proxies when querying IMDS. For more information, see [Proxies](../virtual-machines/windows/instance-metadata-service.md?tabs=windows#proxies).
### [Windows](#tab/windows/)

```powershell
Invoke-RestMethod -Headers @{"Metadata"="true"} -Method GET -NoProxy -Uri "http://169.254.169.254:80/metadata/loadbalancer?api-version=2020-10-01" | ConvertTo-Json
```
> [!NOTE]
> The -NoProxy parameter was introduced in PowerShell 6.0. If you are using an older version of PowerShell, remove -NoProxy in the request body and make sure you are not using a proxy while retrieving IMDS info. Learn more [here](https://docs.microsoft.com/azure/virtual-machines/windows/instance-metadata-service?tabs=windows#proxies).
> 
### [Linux](#tab/linux/)

```bash
curl -H "Metadata:true" --noproxy "*" "http://169.254.169.254:80/metadata/loadbalancer?api-version=2020-10-01"
```

---
### Sample response

```json
{
   "loadbalancer": {
    "publicIpAddresses":[
      {
         "frontendIpAddress":"51.0.0.1",
         "privateIpAddress":"10.1.0.4"
      }
   ],
   "inboundRules":[
      {
         "frontendIpAddress":"50.0.0.1",
         "protocol":"tcp",
         "frontendPort":80,
         "backendPort":443,
         "privateIpAddress":"10.1.0.4"
      },
      {
         "frontendIpAddress":"2603:10e1:100:2::1:1",
         "protocol":"tcp",
         "frontendPort":80,
         "backendPort":443,
         "privateIpAddress":"ace:cab:deca:deed::1"
      }
   ],
   "outboundRules":[
      {
         "frontendIpAddress":"50.0.0.1",
         "privateIpAddress":"10.1.0.4"
      },
      {
         "frotendIpAddress":"2603:10e1:100:2::1:1",
         "privateIpAddress":"ace:cab:deca:deed::1"
      }
    ]
   }
}

```

## Next steps
[Common error codes and troubleshooting steps](troubleshoot-load-balancer-imds.md)

Learn more about [Azure Instance Metadata Service](../virtual-machines/windows/instance-metadata-service.md)

[Retrieve all metadata for an instance](../virtual-machines/windows/instance-metadata-service.md?tabs=windows#access-azure-instance-metadata-service)

[Deploy a standard load balancer](quickstart-load-balancer-standard-public-portal.md)

