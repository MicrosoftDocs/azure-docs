---
title: Compute benchmark scores for Azure Windows VMs | Microsoft Docs
description: Compare SPECint compute benchmark scores for Azure VMs running Windows Server.
services: virtual-machines-windows
documentationcenter: ''
author: cynthn
manager: gwallace
editor: ''
tags: azure-resource-manager,azure-service-management

ms.assetid: 69ae72ec-e8be-4e46-a8f0-e744aebb5cc2
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure-services
ms.date: 04/09/2018
ms.author: cynthn
ms.reviewer: davberg

---
# Compute benchmark scores for Windows VMs
The following SPECInt benchmark scores show compute performance for select Azure VMs running Windows Server. Compute benchmark scores are also available for [Linux VMs](../linux/compute-benchmark-scores.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).


## Av2 - General Compute
| Size | vCPUs | NUMA Nodes | CPU | Runs | Avg Base Rate | StdDev | 
| ---- | ----: | ---------: | --- | ---: | ------------: | -----: | 
| Standard_A1_v2 | 1 | 1 | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 12 | 14.2 | 0.3 | 
| Standard_A1_v2 | 1 | 1 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 9 | 13.2 | 0.6 | 
| Standard_A1_v2 | 1 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 10 | 14.1 | 0.7 | 
| Standard_A2_v2 | 2 | 1 | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 14 | 28.9 | 0.6 | 
| Standard_A2_v2 | 2 | 1 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 10 | 27.4 | 1.6 | 
| Standard_A2_v2 | 2 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 17 | 28.9 | 1.8 | 
| Standard_A2m_v2 | 2 | 1 | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 14 | 29.0 | 0.5 | 
| Standard_A2m_v2 | 2 | 1 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 11 | 26.3 | 0.8 | 
| Standard_A2m_v2 | 2 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 21 | 28.4 | 1.0 | 
| Standard_A4_v2 | 4 | 1 | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 27 | 56.6 | 1.0 | 
| Standard_A4_v2 | 4 | 1 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 13 | 52.8 | 2.0 | 
| Standard_A4_v2 | 4 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 15 | 52.1 | 4.5 | 
| Standard_A4m_v2 | 4 | 1 | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 17 | 56.4 | 1.8 | 
| Standard_A4m_v2 | 4 | 1 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 6 | 53.4 | 1.9 | 
| Standard_A4m_v2 | 4 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 23 | 57.1 | 3.6 | 
| Standard_A8_v2 | 8 | 1 | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 14 | 109.1 | 1.6 | 
| Standard_A8_v2 | 8 | 1 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 6 | 101.5 | 2.8 | 
| Standard_A8_v2 | 8 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 11 | 101.9 | 2.7 | 
| Standard_A8m_v2 | 8 | 1 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 11 | 101.4 | 1.2 | 
| Standard_A8m_v2 | 8 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 10 | 104.5 | 5.1 | 
| Standard_A8m_v2 | 8 | 2 | Intel(R) Xeon(R) CPU E5-2660 0 @ 2.20GHz | 13 | 111.6 | 2.3 | 

## B - Burstable
| Size | vCPUs | NUMA Nodes | CPU | Runs | Avg Base Rate | StdDev | 
| ---- | ----: | ---------: | --- | ---: | ------------: | -----: | 
| Standard_B1ms | 1 | 1 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 9 | 6.3 | 0.2 | 
| Standard_B1ms | 1 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 47 | 6.4 | 0.2 | 
| Standard_B2ms | 2 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 36 | 19.8 | 0.8 | 
| Standard_B2s | 2 | 1 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 2 | 13.0 | 0.0 | 
| Standard_B2s | 2 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 29 | 13.0 | 0.5 | 
| Standard_B4ms | 4 | 1 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 6 | 27.1 | 1.0 | 
| Standard_B4ms | 4 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 43 | 28.3 | 0.7 | 
| Standard_B8ms | 8 | 1 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 3 | 42.0 | 0.0 | 
| Standard_B8ms | 8 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 25 | 41.4 | 0.9 | 

## DSv3 - General Compute + Premium Storage
| Size | vCPUs | NUMA Nodes | CPU | Runs | Avg Base Rate | StdDev | 
| ---- | ----: | ---------: | --- | ---: | ------------: | -----: | 
| Standard_D2s_v3 | 2 | 1 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 10 | 40.8 | 2.3 | 
| Standard_D2s_v3 | 2 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 52 | 43.3 | 2.1 | 
| Standard_D4s_v3 | 4 | 1 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 21 | 77.9 | 2.6 | 
| Standard_D4s_v3 | 4 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 29 | 82.3 | 2.5 | 
| Standard_D8s_v3 | 8 | 1 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 7 | 148.3 | 1.9 | 
| Standard_D8s_v3 | 8 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 28 | 155.4 | 5.6 | 
| Standard_D16s_v3 | 16 | 1 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 3 | 275.7 | 5.1 | 
| Standard_D16s_v3 | 16 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 38 | 298.2 | 4.4 | 
| Standard_D32s_v3 | 32 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 24 | 545.8 | 10.5 | 
| Standard_D32s_v3 | 32 | 2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 9 | 535.6 | 12.6 | 
| Standard_D64s_v3 | 64 | 2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 35 | 1070.6 | 2.4 | 

## Dv3 - General Compute
| Size | vCPUs | NUMA Nodes | CPU | Runs | Avg Base Rate | StdDev | 
| ---- | ----: | ---------: | --- | ---: | ------------: | -----: | 
| Standard_D2_v3 | 2 | 1 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 10 | 38.6 | 1.8 | 
| Standard_D2_v3 | 2 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 24 | 41.8 | 3.3 | 
| Standard_D4_v3 | 4 | 1 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 17 | 77.8 | 1.3 | 
| Standard_D4_v3 | 4 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 45 | 82.7 | 4.5 | 
| Standard_D8_v3 | 8 | 1 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 9 | 146.7 | 10.4 | 
| Standard_D8_v3 | 8 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 27 | 159.9 | 8.3 | 
| Standard_D16_v3 | 16 | 1 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 10 | 274.1 | 3.8 | 
| Standard_D16_v3 | 16 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 32 | 300.7 | 8.8 | 
| Standard_D32_v3 | 32 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 24 | 549.3 | 11.1 | 
| Standard_D32_v3 | 32 | 2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 7 | 538.6 | 9.4 | 
| Standard_D64_v3 | 64 | 2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 32 | 1070.6 | 12.4 | 

## DSv2 - Storage Optimized
| Size | vCPUs | NUMA Nodes | CPU | Runs | Avg Base Rate | StdDev | 
| ---- | ----: | ---------: | --- | ---: | ------------: | -----: | 
| Standard_DS1_v2 | 1 | 1 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 12 | 33.0 | 1.1 | 
| Standard_DS1_v2 | 1 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 37 | 33.8 | 2.5 | 
| Standard_DS2_v2 | 2 | 1 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 33 | 63.9 | 1.7 | 
| Standard_DS2_v2 | 2 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 32 | 66.6 | 4.8 | 
| Standard_DS3_v2 | 4 | 1 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 15 | 125.5 | 3.2 | 
| Standard_DS3_v2 | 4 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 47 | 130.1 | 4.3 | 
| Standard_DS4_v2 | 8 | 1 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 23 | 235.7 | 6.6 | 
| Standard_DS4_v2 | 8 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 34 | 249.4 | 2.8 | 
| Standard_DS5_v2 | 16 | 1 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 11 | 414.9 | 5.1 | 
| Standard_DS5_v2 | 16 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 31 | 470.6 | 5.7 | 
| Standard_DS11_v2 | 2 | 1 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 22 | 66.3 | 2.8 | 
| Standard_DS11_v2 | 2 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 34 | 64.8 | 2.8 | 
| Standard_DS11-1_v2 | 1 | 1 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 17 | 33.6 | 1.8 | 
| Standard_DS11-1_v2 | 1 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 41 | 36.0 | 1.7 | 
| Standard_DS12_v2 | 4 | 1 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 10 | 126.8 | 2.7 | 
| Standard_DS12_v2 | 4 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 30 | 127.5 | 3.3 | 
| Standard_DS12-1_v2 | 1 | 1 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 20 | 33.5 | 1.4 | 
| Standard_DS12-1_v2 | 1 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 30 | 34.8 | 2.4 | 
| Standard_DS12-2_v2 | 2 | 1 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 17 | 65.5 | 2.3 | 
| Standard_DS12-2_v2 | 2 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 33 | 67.7 | 5.1 | 
| Standard_DS13_v2 | 8 | 1 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 20 | 234.1 | 7.1 | 
| Standard_DS13_v2 | 8 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 23 | 248.0 | 2.2 | 
| Standard_DS13-2_v2 | 2 | 1 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 17 | 65.2 | 3.1 | 
| Standard_DS13-2_v2 | 2 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 15 | 72.8 | 3.8 | 
| Standard_DS13-4_v2 | 4 | 1 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 24 | 126.1 | 4.3 | 
| Standard_DS13-4_v2 | 4 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 27 | 133.3 | 2.8 | 
| Standard_DS14_v2 | 16 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 22 | 469.5 | 6.9 | 
| Standard_DS14_v2 | 16 | 2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 16 | 456.6 | 7.3 | 
| Standard_DS14-4_v2 | 4 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 28 | 132.8 | 6.6 | 
| Standard_DS14-4_v2 | 4 | 2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 16 | 125.1 | 4.8 | 
| Standard_DS14-8_v2 | 8 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 27 | 251.3 | 2.4 | 
| Standard_DS14-8_v2 | 8 | 2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 14 | 247.4 | 10.2 | 
| Standard_DS15_v2 | 20 | 2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 45 | 546.1 | 10.5 | 

## Dv2 - General Compute
| Size | vCPUs | NUMA Nodes | CPU | Runs | Avg Base Rate | StdDev | 
| ---- | ----: | ---------: | --- | ---: | ------------: | -----: | 
| Standard_D1_v2 | 1 | 1 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 30 | 33.5 | 1.7 | 
| Standard_D1_v2 | 1 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 31 | 34.7 | 2.5 | 
| Standard_D2_v2 | 2 | 1 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 18 | 66.0 | 1.8 | 
| Standard_D2_v2 | 2 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 31 | 69.9 | 5.0 | 
| Standard_D3_v2 | 4 | 1 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 27 | 127.7 | 3.0 | 
| Standard_D3_v2 | 4 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 27 | 133.4 | 9.1 | 
| Standard_D4_v2 | 8 | 1 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 15 | 238.7 | 4.4 | 
| Standard_D4_v2 | 8 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 36 | 248.9 | 4.8 | 
| Standard_D5_v2 | 16 | 1 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 9 | 413.9 | 14.1 | 
| Standard_D5_v2 | 16 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 27 | 470.2 | 8.1 | 
| Standard_D5_v2 | 16 | 2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 5 | 466.0 | 0.0 | 
| Standard_D11_v2 | 2 | 1 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 22 | 66.4 | 2.9 | 
| Standard_D11_v2 | 2 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 27 | 69.0 | 6.7 | 
| Standard_D12_v2 | 4 | 1 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 24 | 127.7 | 4.6 | 
| Standard_D12_v2 | 4 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 20 | 135.9 | 9.3 | 
| Standard_D13_v2 | 8 | 1 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 16 | 237.4 | 6.6 | 
| Standard_D13_v2 | 8 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 28 | 250.2 | 3.8 | 
| Standard_D14_v2 | 16 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 23 | 473.0 | 9.4 | 
| Standard_D14_v2 | 16 | 2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 17 | 443.9 | 18.8 | 
| Standard_D15_v2 | 20 | 2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 37 | 558.8 | 8.4 | 

## Esv3 - Memory Optimized + Premium Storage
| Size | vCPUs | NUMA Nodes | CPU | Runs | Avg Base Rate | StdDev | 
| ---- | ----: | ---------: | --- | ---: | ------------: | -----: | 
| Standard_E2s_v3 | 2 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 39 | 42.5 | 2.2 | 
| Standard_E4s_v3 | 4 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 28 | 81.4 | 3.3 | 
| Standard_E8s_v3 | 8 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 29 | 156.3 | 5.1 | 
| Standard_E8-2s_v3 | 2 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 57 | 41.8 | 2.6 | 
| Standard_E8-4s_v3 | 4 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 45 | 82.9 | 3.0 | 
| Standard_E16s_v3 | 16 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 31 | 295.7 | 4.5 | 
| Standard_E16-4s_v3 | 4 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 45 | 82.7 | 3.8 | 
| Standard_E16-8s_v3 | 8 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 39 | 158.3 | 4.5 | 
| Standard_E20s_v3 | 20 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 27 | 369.7 | 3.2 | 
| Standard_E32s_v3 | 32 | 2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 31 | 577.9 | 9.4 | 
| Standard_E32-8s_v3 | 8 | 2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 31 | 163.4 | 6.8 | 
| Standard_E32-16s_v3 | 16 | 2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 41 | 307.1 | 8.7 | 
| Standard_E4-2s_v3 | 2 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 65 | 41.9 | 2.4 | 
| Standard_E64s_v3 | 64 | 2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 1 | 1080.0 | 0.0 | 
| Standard_E64-16s_v3 | 16 | 2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 3 | 334.3 | 1.5 | 
| Standard_E64-32s_v3 | 32 | 2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 4 | 592.5 | 4.4 | 

## Eisv3 - Memory Opt + Premium Storage (isolated)
| Size | vCPUs | NUMA Nodes | CPU | Runs | Avg Base Rate | StdDev | 
| ---- | ----: | ---------: | --- | ---: | ------------: | -----: | 
| Standard_E64is_v3 | 64 | 2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 28 | 1073.9 | 5.7 | 

## Ev3 - Memory Optimized
| Size | vCPUs | NUMA Nodes | CPU | Runs | Avg Base Rate | StdDev | 
| ---- | ----: | ---------: | --- | ---: | ------------: | -----: | 
| Standard_E2_v3 | 2 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 41 | 41.2 | 2.4 | 
| Standard_E4_v3 | 4 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 43 | 81.4 | 5.3 | 
| Standard_E8_v3 | 8 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 39 | 157.4 | 8.1 | 
| Standard_E16_v3 | 16 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 49 | 301.6 | 8.9 | 
| Standard_E20_v3 | 20 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 35 | 371.0 | 6.9 | 
| Standard_E32_v3 | 32 | 2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 35 | 579.9 | 16.1 | 
| Standard_E64_v3 | 64 | 2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 31 | 1080.0 | 11.3 | 

## Eiv3 - Memory Optimized (isolated)
| Size | vCPUs | NUMA Nodes | CPU | Runs | Avg Base Rate | StdDev | 
| ---- | ----: | ---------: | --- | ---: | ------------: | -----: | 
| Standard_E64i_v3 | 64 | 2 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 28 | 1081.4 | 11.1 | 

## Fsv2 - Compute + Storage Optimized
| Size | vCPUs | NUMA Nodes | CPU | Runs | Avg Base Rate | StdDev | 
| ---- | ----: | ---------: | --- | ---: | ------------: | -----: | 
| Standard_F2s_v2 | 2 | 1 | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 46 | 56.5 | 2.4 | 
| Standard_F4s_v2 | 4 | 1 | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 60 | 110.2 | 4.7 | 
| Standard_F8s_v2 | 8 | 1 | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 36 | 215.2 | 5.3 | 
| Standard_F16s_v2 | 16 | 1 | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 36 | 409.3 | 15.5 | 
| Standard_F32s_v2 | 32 | 1 | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 31 | 760.9 | 16.9 | 
| Standard_F64s_v2 | 64 | 2 | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 33 | 1440.9 | 26.0 | 
| Standard_F72s_v2 | 72 | 2 | Intel(R) Xeon(R) Platinum 8168 CPU @ 2.70GHz | 29 | 1372.1 | 8.2 | 

## Fs - Compute and Storage Optimized
| Size | vCPUs | NUMA Nodes | CPU | Runs | Avg Base Rate | StdDev | 
| ---- | ----: | ---------: | --- | ---: | ------------: | -----: | 
| Standard_F1s | 1 | 1 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 31 | 33.2 | 1.0 | 
| Standard_F1s | 1 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 41 | 35.1 | 2.0 | 
| Standard_F2s | 2 | 1 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 18 | 63.7 | 1.8 | 
| Standard_F2s | 2 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 21 | 66.6 | 3.8 | 
| Standard_F4s | 4 | 1 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 14 | 128.4 | 2.9 | 
| Standard_F4s | 4 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 25 | 127.7 | 4.5 | 
| Standard_F8s | 8 | 1 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 11 | 234.9 | 3.7 | 
| Standard_F8s | 8 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 19 | 251.2 | 4.5 | 
| Standard_F16s | 16 | 1 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 9 | 413.9 | 3.6 | 
| Standard_F16s | 16 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 36 | 471.8 | 7.5 | 

## F - Compute Optimized
| Size | vCPUs | NUMA Nodes | CPU | Runs | Avg Base Rate | StdDev | 
| ---- | ----: | ---------: | --- | ---: | ------------: | -----: | 
| Standard_F1 | 1 | 1 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 15 | 32.8 | 1.8 | 
| Standard_F1 | 1 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 13 | 33.3 | 2.0 | 
| Standard_F2 | 2 | 1 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 27 | 64.9 | 6.0 | 
| Standard_F2 | 2 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 21 | 67.8 | 4.9 | 
| Standard_F4 | 4 | 1 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 18 | 128.4 | 3.3 | 
| Standard_F4 | 4 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 32 | 132.1 | 7.8 | 
| Standard_F8 | 8 | 1 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 17 | 239.4 | 2.3 | 
| Standard_F8 | 8 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 25 | 251.2 | 7.0 | 
| Standard_F16 | 16 | 1 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 19 | 424.1 | 8.2 | 
| Standard_F16 | 16 | 1 | Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz | 32 | 467.8 | 11.1 | 
| Standard_F16 | 16 | 2 | Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz | 6 | 472.3 | 13.2 | 

## GS - Storage Optimized
| Size | vCPUs | NUMA Nodes | CPU | Runs | Avg Base Rate | StdDev | 
| ---- | ----: | ---------: | --- | ---: | ------------: | -----: | 
| Standard_GS1 | 2 | 1 | Intel(R) Xeon(R) CPU E5-2698B v3 @ 2.00GHz | 29 | 63.6 | 4.7 | 
| Standard_GS2 | 4 | 1 | Intel(R) Xeon(R) CPU E5-2698B v3 @ 2.00GHz | 29 | 122.3 | 6.9 | 
| Standard_GS3 | 8 | 1 | Intel(R) Xeon(R) CPU E5-2698B v3 @ 2.00GHz | 31 | 222.4 | 8.1 | 
| Standard_GS4 | 16 | 1 | Intel(R) Xeon(R) CPU E5-2698B v3 @ 2.00GHz | 31 | 391.4 | 28.6 | 
| Standard_GS4-4 | 4 | 1 | Intel(R) Xeon(R) CPU E5-2698B v3 @ 2.00GHz | 28 | 127.5 | 5.3 | 
| Standard_GS4-8 | 8 | 1 | Intel(R) Xeon(R) CPU E5-2698B v3 @ 2.00GHz | 31 | 226.7 | 5.8 | 
| Standard_GS5 | 32 | 2 | Intel(R) Xeon(R) CPU E5-2698B v3 @ 2.00GHz | 31 | 760.9 | 6.2 | 
| Standard_GS5-8 | 8 | 2 | Intel(R) Xeon(R) CPU E5-2698B v3 @ 2.00GHz | 31 | 259.5 | 2.7 | 
| Standard_GS5-16 | 16 | 2 | Intel(R) Xeon(R) CPU E5-2698B v3 @ 2.00GHz | 31 | 447.9 | 4.0 | 

## G - Compute Optimized
| Size | vCPUs | NUMA Nodes | CPU | Runs | Avg Base Rate | StdDev | 
| ---- | ----: | ---------: | --- | ---: | ------------: | -----: | 
| Standard_G1 | 2 | 1 | Intel(R) Xeon(R) CPU E5-2698B v3 @ 2.00GHz | 29 | 64.7 | 9.2 | 
| Standard_G2 | 4 | 1 | Intel(R) Xeon(R) CPU E5-2698B v3 @ 2.00GHz | 30 | 127.9 | 12.2 | 
| Standard_G3 | 8 | 1 | Intel(R) Xeon(R) CPU E5-2698B v3 @ 2.00GHz | 30 | 231.7 | 12.6 | 
| Standard_G4 | 16 | 1 | Intel(R) Xeon(R) CPU E5-2698B v3 @ 2.00GHz | 31 | 400.2 | 3.9 | 
| Standard_G5 | 32 | 2 | Intel(R) Xeon(R) CPU E5-2698B v3 @ 2.00GHz | 31 | 774.1 | 4.1 | 

## H - High Performance Compute (HPC)
| Size | vCPUs | NUMA Nodes | CPU | Runs | Avg Base Rate | StdDev | 
| ---- | ----: | ---------: | --- | ---: | ------------: | -----: | 
| Standard_H8 | 8 | 1 | Intel(R) Xeon(R) CPU E5-2667 v3 @ 3.20GHz | 31 | 296.1 | 1.4 | 
| Standard_H8m | 8 | 1 | Intel(R) Xeon(R) CPU E5-2667 v3 @ 3.20GHz | 34 | 295.1 | 1.5 | 
| Standard_H16 | 16 | 2 | Intel(R) Xeon(R) CPU E5-2667 v3 @ 3.20GHz | 19 | 563.5 | 4.3 | 
| Standard_H16m | 16 | 2 | Intel(R) Xeon(R) CPU E5-2667 v3 @ 3.20GHz | 19 | 562.9 | 3.3 | 
| Standard_H16mr | 16 | 2 | Intel(R) Xeon(R) CPU E5-2667 v3 @ 3.20GHz | 18 | 563.6 | 3.7 | 
| Standard_H16r | 16 | 2 | Intel(R) Xeon(R) CPU E5-2667 v3 @ 3.20GHz | 17 | 562.2 | 4.2 | 

## Ls - Storage Optimized
| Size | vCPUs | NUMA Nodes | CPU | Runs | Avg Base Rate | StdDev | 
| ---- | ----: | ---------: | --- | ---: | ------------: | -----: | 
| Standard_L4s | 4 | 1 | Intel(R) Xeon(R) CPU E5-2698B v3 @ 2.00GHz | 29 | 122.7 | 6.6 | 
| Standard_L8s | 8 | 1 | Intel(R) Xeon(R) CPU E5-2698B v3 @ 2.00GHz | 30 | 223.3 | 7.5 | 
| Standard_L16s | 16 | 1 | Intel(R) Xeon(R) CPU E5-2698B v3 @ 2.00GHz | 31 | 397.3 | 2.5 | 
| Standard_L32s | 32 | 2 | Intel(R) Xeon(R) CPU E5-2698B v3 @ 2.00GHz | 31 | 766.1 | 3.5 | 

## M - Memory Optimized
| Size | vCPUs | NUMA Nodes | CPU | Runs | Avg Base Rate | StdDev | 
| ---- | ----: | ---------: | --- | ---: | ------------: | -----: | 
| Standard_M8-2ms | 2 | 1 | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 15 | 42.1 | 2.1 | 
| Standard_M8-4ms | 4 | 1 | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 13 | 81.6 | 2.9 | 
| Standard_M16-4ms | 4 | 1 | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 14 | 82.5 | 2.5 | 
| Standard_M16-8ms | 8 | 1 | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 20 | 157.2 | 6.0 | 
| Standard_M32-8ms | 8 | 1 | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 18 | 162.5 | 2.1 | 
| Standard_M32-16ms | 16 | 1 | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 12 | 306.5 | 0.5 | 
| Standard_M64 | 64 | 2 | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 11 | 1010.9 | 5.4 | 
| Standard_M64-16ms | 16 | 2 | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 13 | 316.0 | 2.4 | 
| Standard_M64-32ms | 32 | 2 | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 12 | 586.8 | 5.4 | 
| Standard_M64m | 64 | 2 | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 12 | 1005.5 | 12.3 | 
| Standard_M64ms | 64 | 2 | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 12 | 1012.9 | 12.5 | 
| Standard_M64s | 64 | 2 | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 12 | 1012.5 | 4.5 | 
| Standard_M128 | 128 | 4 | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 11 | 1777.3 | 15.6 | 
| Standard_M128-32ms | 32 | 4 | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 13 | 620.5 | 2.5 | 
| Standard_M128-64ms | 64 | 4 | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 12 | 1140.8 | 2.9 | 
| Standard_M128m | 128 | 4 | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 12 | 1778.3 | 10.3 | 
| Standard_M128ms | 128 | 4 | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 15 | 1780.7 | 18.3 | 
| Standard_M128s | 128 | 4 | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 12 | 1775.8 | 11.6 | 
| Standard_M16ms | 16 | 1 | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 20 | 293.1 | 11.8 | 
| Standard_M32ls | 32 | 1 | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 13 | 535.2 | 4.8 | 
| Standard_M32ms | 32 | 1 | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 11 | 534.1 | 4.6 | 
| Standard_M32ms | 32 | 2 | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 1 | 589.0 | 0.0 | 
| Standard_M32ts | 32 | 1 | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 12 | 538.6 | 3.2 | 
| Standard_M64ls | 64 | 2 | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 13 | 1015.2 | 10.0 | 
| Standard_M8ms | 8 | 1 | Intel(R) Xeon(R) CPU E7-8890 v3 @ 2.50GHz | 13 | 158.2 | 5.5 | 

## NCSv3 - GPU Enabled
| Size | vCPUs | NUMA Nodes | CPU | Runs | Avg Base Rate | StdDev | 
| ---- | ----: | ---------: | --- | ---: | ------------: | -----: | 
| Standard_NC6s_v3 | 6 | 1 | Intel(R) Xeon(R) CPU E5-2690 v4 @ 2.60GHz | 6 | 230.2 | 1.6 | 
| Standard_NC12s_v3 | 12 | 1 | Intel(R) Xeon(R) CPU E5-2690 v4 @ 2.60GHz | 7 | 425.0 | 3.6 | 
| Standard_NC24rs_v3 | 24 | 2 | Intel(R) Xeon(R) CPU E5-2690 v4 @ 2.60GHz | 2 | 811.0 | 4.2 | 
| Standard_NC24s_v3 | 24 | 2 | Intel(R) Xeon(R) CPU E5-2690 v4 @ 2.60GHz | 3 | 809.3 | 2.3 | 

## NCSv2 - GPU Enabled
| Size | vCPUs | NUMA Nodes | CPU | Runs | Avg Base Rate | StdDev | 
| ---- | ----: | ---------: | --- | ---: | ------------: | -----: | 
| Standard_NC6s_v2 | 6 | 1 | Intel(R) Xeon(R) CPU E5-2690 v4 @ 2.60GHz | 11 | 227.0 | 6.2 | 
| Standard_NC12s_v2 | 12 | 1 | Intel(R) Xeon(R) CPU E5-2690 v4 @ 2.60GHz | 9 | 427.3 | 1.3 | 
| Standard_NC24rs_v2 | 24 | 2 | Intel(R) Xeon(R) CPU E5-2690 v4 @ 2.60GHz | 12 | 811.0 | 5.4 | 
| Standard_NC24s_v2 | 24 | 2 | Intel(R) Xeon(R) CPU E5-2690 v4 @ 2.60GHz | 11 | 811.5 | 4.4 | 

## NC - GPU Enabled
| Size | vCPUs | NUMA Nodes | CPU | Runs | Avg Base Rate | StdDev | 
| ---- | ----: | ---------: | --- | ---: | ------------: | -----: | 
| Standard_NC6 | 6 | 1 | Intel(R) Xeon(R) CPU E5-2690 v3 @ 2.60GHz | 27 | 209.6 | 4.4 | 
| Standard_NC12 | 12 | 1 | Intel(R) Xeon(R) CPU E5-2690 v3 @ 2.60GHz | 28 | 394.4 | 3.8 | 
| Standard_NC24 | 24 | 2 | Intel(R) Xeon(R) CPU E5-2690 v3 @ 2.60GHz | 28 | 751.7 | 3.5 | 
| Standard_NC24r | 24 | 2 | Intel(R) Xeon(R) CPU E5-2690 v3 @ 2.60GHz | 27 | 752.9 | 3.4 | 

## NDs- GPU Enabled
| Size | vCPUs | NUMA Nodes | CPU | Runs | Avg Base Rate | StdDev | 
| ---- | ----: | ---------: | --- | ---: | ------------: | -----: | 
| Standard_ND6s | 6 | 1 | Intel(R) Xeon(R) CPU E5-2690 v4 @ 2.60GHz | 8 | 230.1 | 1.2 | 
| Standard_ND12s | 12 | 1 | Intel(R) Xeon(R) CPU E5-2690 v4 @ 2.60GHz | 11 | 426.5 | 1.4 | 
| Standard_ND24rs | 24 | 2 | Intel(R) Xeon(R) CPU E5-2690 v4 @ 2.60GHz | 10 | 811.4 | 3.5 | 
| Standard_ND24s | 24 | 2 | Intel(R) Xeon(R) CPU E5-2690 v4 @ 2.60GHz | 11 | 812.6 | 4.4 | 

## NV - GPU Enabled
| Size | vCPUs | NUMA Nodes | CPU | Runs | Avg Base Rate | StdDev | 
| ---- | ----: | ---------: | --- | ---: | ------------: | -----: | 
| Standard_NV6 | 6 | 1 | Intel(R) Xeon(R) CPU E5-2690 v3 @ 2.60GHz | 28 | 210.5 | 6.1 | 
| Standard_NV12 | 12 | 1 | Intel(R) Xeon(R) CPU E5-2690 v3 @ 2.60GHz | 28 | 394.5 | 2.3 | 
| Standard_NV24 | 24 | 2 | Intel(R) Xeon(R) CPU E5-2690 v3 @ 2.60GHz | 26 | 752.2 | 4.4 | 

## About SPECint
Windows numbers were computed by running [SPECint 2006](https://www.spec.org/cpu2006/results/rint2006.html) on Windows Server. SPECint was run using the base rate option (SPECint_rate2006), with one copy per vCPU. SPECint consists of 12 separate tests, each run three times, taking the median value from each test and weighting them to form a composite score. Those tests were then run across multiple VMs to provide the average scores shown.

## Next steps
* For storage capacities, disk details, and additional considerations for choosing among VM sizes, see [Sizes for virtual machines](sizes.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

