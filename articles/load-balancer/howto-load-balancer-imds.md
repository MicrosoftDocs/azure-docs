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

* Use the [latest API version](https://docs.microsoft.com/azure/virtual-machines/windows/instance-metadata-service?tabs=windows#supported-api-versions) for your request.

## Sample request and response
> [!IMPORTANT]
> This example bypasses proxies. You **must** bypass proxies when querying IMDS. For more information, see [Proxies](https://docs.microsoft.com/azure/virtual-machines/windows/instance-metadata-service?tabs=windows#proxies).
### [Windows](#tab/windows/)

```powershell
Invoke-RestMethod -Headers @{"Metadata"="true"} -Method GET -NoProxy -Uri "http://169.254.169.254:80/metadata/loadbalancer?api-version=2020-10-01" | ConvertTo-Json
```

### [Linux](#tab/linux/)

```bash
curl -H "Metadata:true" --noproxy "*" "http://169.254.169.254:80/metadata/loadbalancer?api-version=2020-10-01"
```

---
### Sample Response

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

## Next Steps
[Common error codes and troubleshooting steps](troubleshoot-load-balancer-imds.md)

Learn more about [Azure Instance Metadata Service](https://docs.microsoft.com/azure/virtual-machines/windows/instance-metadata-service)

[Retrieve all metadata for an instance](https://docs.microsoft.com/azure/virtual-machines/windows/instance-metadata-service?tabs=windows#access-azure-instance-metadata-service)

[Deploy a standard load balancer](https://docs.microsoft.com/azure/load-balancer/quickstart-load-balancer-standard-public-portal?tabs=option-1-create-load-balancer-standard)

