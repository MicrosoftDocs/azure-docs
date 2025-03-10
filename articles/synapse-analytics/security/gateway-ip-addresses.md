---
title: Gateway IP addresses
description: An article that teaches you what are the IP addresses used in different regions. 
ms.service: azure-synapse-analytics
ms.topic: concept-article
ms.subservice: security 
ms.date: 12/20/2024
author: ilijazagorac
ms.author: ilijazagorac 
ms.custom: references_regions 
---

# Gateway IP addresses

The table below lists the individual Gateway IP addresses and also Gateway IP address ranges per region.

Periodically, we'll retire Gateways using old hardware and migrate the traffic to new Gateways as per the process outlined at [Azure SQL Database traffic migration to newer Gateways](/azure/azure-sql/database/gateway-migration).
We strongly encourage customers to move away from relying on **any individual Gateway IP address** (since these will be retired in the future). Instead, allow network traffic to reach both the individual Gateway IP addresses and Gateway IP address subnets in a region.

> [!IMPORTANT]  
> - Logins for SQL Database or dedicated SQL pools (formerly SQL DW) in Azure Synapse can land on **any of the individual Gateway IP addresses or Gateway IP address subnets in a region**. For consistent connectivity to SQL Database or dedicated SQL pools (formerly SQL DW) in Azure Synapse, allow network traffic to and from **all the individual Gateway IP addresses and Gateway IP address subnets in a region**.
> - Use the individual Gateway IP addresses and Gateway IP address subnets in this section if you're using a Proxy connection policy to connect to Azure SQL Database. If you're using the Redirect connection policy, refer to the [Azure IP Ranges and Service Tags - Public Cloud](https://www.microsoft.com/download/details.aspx?id=56519) for a list of your region's IP addresses to allow. 

| Region name          | Gateway IP addresses | Gateway IP address subnets |
| --- | --- | --- |
| Australia Central    | 20.36.104.6, 20.36.104.7 | 20.36.105.32/29, 20.53.48.96/27 |
| Australia Central 2   | 20.36.113.0, 20.36.112.6 | 20.36.113.32/29, 20.53.56.32/27 |
| Australia East       | 13.75.149.87, 40.79.161.1, 13.70.112.9 | 13.70.112.32/29, 40.79.160.32/29, 40.79.168.32/29, 20.53.46.128/27 |
| Australia Southeast | 13.73.109.251, 13.77.48.10, 13.77.49.32 | 13.77.49.32/29, 104.46.179.160/27 |
| Brazil South         | 191.233.200.14, 191.234.144.16, 191.234.152.3 | 191.233.200.32/29, 191.234.144.32/29, 191.234.152.32/27, 191.234.153.32/27, 191.234.157.136/29 |
| Canada Central       | 52.246.152.0, 20.38.144.1 | 13.71.168.32/29, 20.38.144.32/29, 52.246.152.32/29, 20.48.196.32/27 |
| Canada East          | 40.69.105.9, 40.69.105.10 | 40.69.105.32/29, 52.139.106.192/27|
| Central US           | 104.208.21.1, 13.89.169.20 | 104.208.21.192/29, 13.89.168.192/29, 52.182.136.192/29, 20.40.228.128/27 |
| China East           | 139.219.130.35 |  52.130.112.136/29 |
| China East 2         | 40.73.82.1 | 52.130.120.88/29 |
| China North          | | 52.130.128.88/29 |
| China North 2        | 40.73.50.0 | 52.130.40.64/29 |
| East Asia            | 13.75.32.4, 13.75.32.14, 20.205.77.200, 20.205.83.224  | 13.75.32.192/29, 13.75.33.192/29, 20.195.72.32/27, 20.205.77.176/29, 20.205.77.200/29, 20.205.83.224/29 |
| East US              | 40.121.158.30, 40.79.153.12, 40.78.225.32 | 20.42.65.64/29, 20.42.73.0/29, 52.168.116.64/29, 20.62.132.160/29 |
| East US 2            | 40.79.84.180, 52.177.185.181, 52.167.104.0, 104.208.150.3,  40.70.144.193 | 104.208.150.192/29, 40.70.144.192/29, 52.167.104.192/29, 20.62.58.128/27 |
| France Central       | 40.79.129.1, 40.79.137.8, 40.79.145.12 | 40.79.136.32/29, 40.79.144.32/29, 40.79.128.32/29, 20.43.47.192/27 |
| France South         | 40.79.177.0, 40.79.177.10 ,40.79.177.12 | 40.79.176.40/29, 40.79.177.32/29, 52.136.185.0/27 |
| Germany West Central | 51.116.240.0, 51.116.248.0, 51.116.152.0 | 51.116.152.32/29, 51.116.240.32/29, 51.116.248.32/29, 51.116.149.32/27 |
| Germany North        | 51.116.56.0 | 51.116.57.32/29, 51.116.54.96/27 |
| Central India        | 104.211.96.159, 104.211.86.30 , 104.211.86.31, 40.80.48.32, 20.192.96.32  | 104.211.86.32/29, 20.192.96.32/29, 40.80.48.32/29, 20.192.43.160/29 |
| South India          | 104.211.224.146    | 40.78.192.32/29, 40.78.193.32/29, 52.172.113.96/27 |
| West India           | 104.211.160.80, 104.211.144.4 | 104.211.144.32/29, 104.211.145.32/29, 52.136.53.160/27 |
| Central Israel       | | 20.217.59.248/29, 20.217.91.192/29, 20.217.75.192/29 |
| North Italy          | | 4.232.107.184/29, 4.232.195.192/29, 4.232.123.192/29 |
| Japan East           | 40.79.184.8, 40.79.192.5, 13.78.104.32, 40.79.184.32 | 13.78.104.32/29, 40.79.184.32/29, 40.79.192.32/29, 20.191.165.160/27 |
| Japan West           | 104.214.148.156, 40.74.97.10 | 40.74.96.32/29, 20.18.179.192/29, 20.189.225.160/27 |
| Korea Central        | 52.231.32.42, 52.231.17.22 ,52.231.17.23, 20.44.24.32, 20.194.64.33 | 20.194.64.32/29,20.44.24.32/29, 52.231.16.32/29, 20.194.73.64/27 |
| Korea South          | 52.231.151.96 | 52.231.151.96/27, 52.231.151.88/29, 52.147.112.160/27 |
| Malaysia South       | | 20.17.67.248/29 |
| North Central US     | 52.162.104.33, 52.162.105.9 | 52.162.105.192/29, 52.162.105.200/29, 20.49.119.32/27, 20.125.171.192/29 |
| North Europe         | 52.138.224.1, 13.74.104.113 | 13.69.233.136/29, 13.74.105.192/29, 52.138.229.72/29, 52.146.133.128/27 |
| Norway East          | 51.120.96.0, 51.120.96.33, 51.120.104.32, 51.120.208.32 | 51.120.96.32/29, 51.120.104.32/29, 51.120.208.32/29, 51.120.232.192/27 |
| Norway West          | 51.120.216.0       | 51.120.217.32/29, 51.13.136.224/27 |
| Poland Central       | | 20.215.27.192/29, 20.215.155.248/29, 20.215.19.192/29 |
| Qatar Central        | | 20.21.43.248/29, 20.21.75.192/29, 20.21.67.192/29 |
| South Africa North   | 102.133.152.0, 102.133.120.2, 102.133.152.32 | 102.133.120.32/29, 102.133.152.32/29, 102.133.248.32/29, 102.133.221.224/27 |
| South Africa West    | 102.133.24.0       | 102.133.25.32/29, 102.37.80.96/27 |
| South Central US     | 104.214.16.32, 20.45.121.1, 20.49.88.1 | 20.45.121.32/29, 20.49.88.32/29, 20.49.89.32/29, 40.124.64.136/29, 20.65.132.160/27 |
| South East Asia      | 104.43.15.0, 40.78.232.3, 13.67.16.193 | 13.67.16.192/29, 23.98.80.192/29, 40.78.232.192/29, 20.195.65.32/27 |
| Spain Central        | | 68.221.99.184/29, 68.221.154.88/29, 68.221.147.192/29 |
| Sweden Central       | | 51.12.224.32/29, 51.12.232.32/29 |
| Sweden South         | | 51.12.200.32/29, 51.12.201.32/29 |
| Switzerland North    | 51.107.56.0 | 51.107.56.32/29, 51.103.203.192/29, 20.208.19.192/29, 51.107.242.32/27 |
| Switzerland West     | 51.107.152.0 | 51.107.153.32/29, 51.107.250.64/27 |
| Taiwan North         | | 51.53.107.248/29 |
| Taiwan Northwest     | | 51.53.187.248/29 |
| UAE Central          | 20.37.72.64        | 20.37.72.96/29, 20.37.73.96/29 |
| UAE North            | 65.52.248.0        | 40.120.72.32/29, 65.52.248.32/29, 20.38.152.24/29, 20.38.143.64/27 |
| UK South             | 51.140.184.11, 51.105.64.0, 51.140.144.36, 51.105.72.32 | 51.105.64.32/29, 51.105.72.32/29, 51.140.144.32/29, 51.143.209.224/27 |
| UK West              | 51.141.8.11, 51.140.208.96, 51.140.208.97 | 51.140.208.96/29, 51.140.209.32/29, 20.58.66.128/27 |
| West Central US      | 13.78.145.25, 13.78.248.43, 13.71.193.32, 13.71.193.33 | 13.71.193.32/29, 20.69.0.32/27 |
| West Europe          | 104.40.168.105, 52.236.184.163  | 104.40.169.32/29, 13.69.112.168/29, 52.236.184.32/29, 20.61.99.192/27 |
| West US              | 104.42.238.205, 13.86.216.196   | 13.86.217.224/29, 20.168.163.192/29, 20.66.3.64/27 |
| West US 2            | 40.78.240.8, 40.78.248.10  | 13.66.136.192/29, 40.78.240.192/29, 40.78.248.192/29, 20.51.9.128/27 |
| West US 3            | 20.150.168.0, 20.150.184.2   | 20.150.168.32/29, 20.150.176.32/29, 20.150.184.32/29, 20.150.241.128/27 |
