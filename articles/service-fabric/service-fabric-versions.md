---
title: Azure Service Fabric versions
description: Learn about cluster versions in Azure Service Fabric and platform versions actively supported
ms.topic: reference
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 03/03/2023
---

# Service Fabric supported versions
The tables in this article outline the Service Fabric and platform versions that are actively supported.

If you want to find a list of all the available Service Fabric runtime versions in available for your subscription, follow the guidance in the [Check for supported cluster versions section of the Manage Service Fabric Cluster Upgrades guide](service-fabric-cluster-upgrade-version-azure.md#check-for-supported-cluster-versions).

## Windows

### Current versions
| Service Fabric runtime |Can upgrade directly from|Can downgrade to*|Compatible SDK or NuGet package version|Supported .NET runtimes** |OS Version |End of support |
| --- | --- | --- | --- | --- | --- | --- |
| 10.1 RTO<br>10.1.1541.9590  | 9.1 CU6<br>9.1.1851.9590 | 9.0 | Less than or equal to version 6.0 | .NET 7, .NET 6, All, <br> >= .NET Framework 4.6.2 | [See supported OS version](#supported-windows-versions-and-support-end-date) | Current version |
| 10.0 CU1<br>10.0.1949.9590 | 9.0 CU10<br>9.0.1553.9590 | 9.0 | Less than or equal to version 6.0 | .NET 7, .NET 6, All, <br> >= .NET Framework 4.6.2 | [See supported OS version](#supported-windows-versions-and-support-end-date) | Current version |
| 10.0 RTO<br>10.0.1816.9590 | 9.0 CU10<br>9.0.1553.9590 | 9.0 | Less than or equal to version 6.0 | .NET 7, .NET 6, All, <br> >= .NET Framework 4.6.2 | [See supported OS version](#supported-windows-versions-and-support-end-date) | Current version |
| 9.1 CU7<br>9.1.1993.9590 | 8.2 CU6<br>8.2.1686.9590 | 8.2 | Less than or equal to version 6.0 | .NET 7, .NET 6, All, <br> >= .NET Framework 4.6.2 | [See supported OS version](#supported-windows-versions-and-support-end-date) | April 30, 2024 |
| 9.1 CU6<br>9.1.1851.9590 | 8.2 CU6<br>8.2.1686.9590 | 8.2 | Less than or equal to version 6.0 | .NET 7, .NET 6, All, <br> >= .NET Framework 4.6.2 | [See supported OS version](#supported-windows-versions-and-support-end-date) | April 30, 2024 |
| 9.1 CU5<br>9.1.1833.9590 | 8.2 CU6<br>8.2.1686.9590 | 8.2 | Less than or equal to version 6.0 | .NET 7, .NET 6, All, <br> >= .NET Framework 4.6.2 | [See supported OS version](#supported-windows-versions-and-support-end-date) | April 30, 2024 |
| 9.1 CU4<br>9.1.1799.9590 | 8.2 CU6<br>8.2.1686.9590 | 8.2 | Less than or equal to version 6.0 | .NET 7, .NET 6, All, <br> >= .NET Framework 4.6.2 | [See supported OS version](#supported-windows-versions-and-support-end-date) | April 30, 2024 |
| 9.1 CU3<br>9.1.1653.9590 | 8.2 CU6<br>8.2.1686.9590 | 8.2 | Less than or equal to version 6.0 | .NET 7, .NET 6, All, <br> >= .NET Framework 4.6.2 | [See supported OS version](#supported-windows-versions-and-support-end-date) | April 30, 2024 |
| 9.1 CU2<br>9.1.1583.9590 | 8.2 CU6<br>8.2.1686.9590 | 8.2 | Less than or equal to version 6.0 | .NET 7, .NET 6, All, <br> >= .NET Framework 4.6.2 | [See supported OS version](#supported-windows-versions-and-support-end-date) | April 30, 2024 |
| 9.1 CU1<br>9.1.1436.9590 | 8.2 CU6<br>8.2.1686.9590 | 8.2 | Less than or equal to version 6.0 | .NET 6.0 (GA), >= .NET Core 3.1, <br>All >= .NET Framework 4.5 | [See supported OS version](#supported-windows-versions-and-support-end-date) | April 30, 2024 |
| 9.1 RTO<br>9.1.1390.9590 | 8.2 CU6<br>8.2.1686.9590 | 8.2 | Less than or equal to version 6.0 | .NET 6.0 (GA), >= .NET Core 3.1, <br>All >= .NET Framework 4.5 | [See supported OS version](#supported-windows-versions-and-support-end-date) | April 30, 2024 |
| 9.0 CU12<br>9.0.1672.9590 | 8.0 CU3<br>8.0.536.9590 | 8.0 | Less than or equal to version 6.0 | .NET 6, All, <br> >= .NET Framework 4.6.2 | [See supported OS version](#supported-windows-versions-and-support-end-date) | January 1, 2024 |
| 9.0 CU11<br>9.0.1569.9590 | 8.0 CU3<br>8.0.536.9590 | 8.0 | Less than or equal to version 6.0 | .NET 6, All, <br> >= .NET Framework 4.6.2 | [See supported OS version](#supported-windows-versions-and-support-end-date) | November 1, 2023 |
| 9.0 CU10<br>9.0.1553.9590 | 8.0 CU3<br>8.0.536.9590 | 8.0 | Less than or equal to version 6.0 | .NET 6, All, <br> >= .NET Framework 4.6.2 | [See supported OS version](#supported-windows-versions-and-support-end-date) | November 1, 2023 |
| 9.0 CU9<br>9.0.1526.9590 | 8.0 CU3<br>8.0.536.9590 | 8.0 | Less than or equal to version 6.0 | .NET 6, All, <br> >= .NET Framework 4.6.2 | [See supported OS version](#supported-windows-versions-and-support-end-date) | November 1, 2023 |
| 9.0 CU8<br>9.0.1380.9590 | 8.0 CU3<br>8.0.536.9590 | 8.0 | Less than or equal to version 6.0 | .NET 6, All, <br> >= .NET Framework 4.6.2 | [See supported OS version](#supported-windows-versions-and-support-end-date) | November 1, 2023 |
| 9.0 CU7<br>9.0.1309.9590 | 8.0 CU3<br>8.0.536.9590 | 8.0 | Less than or equal to version 6.0 | .NET 6, All, <br> >= .NET Framework 4.6.2 | [See supported OS version](#supported-windows-versions-and-support-end-date) | November 1, 2023 |
| 9.0 CU6<br>9.0.1254.9590 | 8.0 CU3<br>8.0.536.9590 | 8.0 | Less than or equal to version 6.0 | .NET 6.0 (GA), >= .NET Core 3.1, <br>All >= .NET Framework 4.5 | [See supported OS version](#supported-windows-versions-and-support-end-date) | November 1, 2023 |
| 9.0 CU5<br>9.0.1155.9590 | 8.0 CU3<br>8.0.536.9590 | 8.0 | Less than or equal to version 6.0 | .NET 6.0 (GA), >= .NET Core 3.1, <br>All >= .NET Framework 4.5 | [See supported OS version](#supported-windows-versions-and-support-end-date) | November 1, 2023 |
| 9.0 CU4<br>9.0.1121.9590 | 8.0 CU3<br>8.0.536.9590 | 8.0 | Less than or equal to version 6.0 | .NET 6.0 (GA), >= .NET Core 3.1, <br>All >= .NET Framework 4.5 | [See supported OS version](#supported-windows-versions-and-support-end-date) | November 1, 2023 |
| 9.0 CU3<br>9.0.1107.9590 | 8.0 CU3<br>8.0.536.9590 | 8.0 | Less than or equal to version 6.0 | .NET 6.0 (GA), >= .NET Core 3.1, <br>All >= .NET Framework 4.5 | [See supported OS version](#supported-windows-versions-and-support-end-date) | November 1, 2023 |
| 9.0 CU2<br>9.0.1048.9590 | 8.0 CU3<br>8.0.536.9590 | 8.0 | Less than or equal to version 6.0 | .NET 6.0 (GA), >= .NET Core 3.1, <br>All >= .NET Framework 4.5 | [See supported OS version](#supported-windows-versions-and-support-end-date) | November 1, 2023 |
| 9.0 CU1<br>9.0.1028.9590 | 8.0 CU3<br>8.0.536.9590 | 8.0 | Less than or equal to version 6.0 | .NET 6.0 (GA), >= .NET Core 3.1, <br>All >= .NET Framework 4.5 | [See supported OS version](#supported-windows-versions-and-support-end-date) | November 1, 2023 |
| 9.0 RTO<br>9.0.1017.9590 | 8.0 CU3<br>8.0.536.9590 | 8.0 | Less than or equal to version 6.0 | .NET 6.0 (GA), >= .NET Core 3.1, <br>All >= .NET Framework 4.5 | [See supported OS version](#supported-windows-versions-and-support-end-date) | November 1, 2023 |
| 8.2 CU9<br>8.2.1748.9590 | 8.0 CU3<br>8.0.536.9590 | 8.0 | Less than or equal to version 6.0 | .NET 6, All, <br> >= .NET Framework 4.6.2 | [See supported OS version](#supported-windows-versions-and-support-end-date) | March 31, 2023 |
| 8.2 CU8<br>8.2.1723.9590 | 8.0 CU3<br>8.0.536.9590 | 8.0 | Less than or equal to version 6.0 | .NET 6.0 (GA), >= .NET Core 3.1, <br>All >= .NET Framework 4.5 | [See supported OS version](#supported-windows-versions-and-support-end-date) | March 31, 2023 |
| 8.2 CU7<br>8.2.1692.9590 | 8.0 CU3<br>8.0.536.9590 | 8.0 | Less than or equal to version 6.0 | .NET 6.0 (GA), >= .NET Core 3.1, <br>All >= .NET Framework 4.5 | [See supported OS version](#supported-windows-versions-and-support-end-date) | March 31, 2023 |
| 8.2 CU6<br>8.2.1686.9590 | 8.0 CU3<br>8.0.536.9590 | 8.0 | Less than or equal to version 6.0 | .NET 6.0 (GA), >= .NET Core 3.1, <br>All >= .NET Framework 4.5 | [See supported OS version](#supported-windows-versions-and-support-end-date) | March 31, 2023 |
| 8.2 CU4<br>8.2.1659.9590 | 8.0 CU3<br>8.0.536.9590 | 8.0 | Less than or equal to version 5.2 | .NET 5.0, >= .NET Core 3.1, <br>All >= .NET Framework 4.5 | [See supported OS version](#supported-windows-versions-and-support-end-date) | March 31, 2023 |
| 8.2 CU3<br>8.2.1620.9590 | 8.0 CU3<br>8.0.536.9590 | 8.0 | Less than or equal to version 5.2 | .NET 5.0, >= .NET Core 3.1, <br>All >= .NET Framework 4.5 | [See supported OS version](#supported-windows-versions-and-support-end-date) | March 31, 2023|
| 8.2 CU2.1<br>8.2.1571.9590 | 8.0 CU3<br>8.0.536.9590 | 8.0 | Less than or equal to version 5.2 | .NET 5.0, >= .NET Core 3.1, <br>All >= .NET Framework 4.5 | [See supported OS version](#supported-windows-versions-and-support-end-date) | March 31, 2023 |
| 8.2 CU2<br>8.2.1486.9590 | 8.0 CU3<br>8.0.536.9590 | 8.0 | Less than or equal to version 5.2 | .NET 6.0 (Preview), .NET 5.0, >= .NET Core 3.1, <br>All >= .NET Framework 4.5 | [See supported OS version](#supported-windows-versions-and-support-end-date) | March 31, 2023 |
| 8.2 CU1<br>8.2.1363.9590 | 8.0 CU3<br>8.0.536.9590 | 8.0 | Less than or equal to version 5.2 | .NET 5.0, >= .NET Core 3.1, <br>All >= .NET Framework 4.5 | [See supported OS version](#supported-windows-versions-and-support-end-date) | March 31, 2023 |
| 8.2 RTO<br>8.2.1235.9590 | 8.0 CU3<br>8.0.536.9590 | 8.0 | Less than or equal to version 5.2 | .NET 5.0, >= .NET Core 3.1, <br>All >= .NET Framework 4.5 | [See supported OS version](#supported-windows-versions-and-support-end-date) | March 31, 2023 |

| Service Fabric runtime |Can upgrade directly from|Can downgrade to*|Compatible SDK or NuGet package version|Supported .NET runtimes** |OS Version |End of support |
| --- | --- | --- | --- | --- | --- | --- |
| 8.1 CU4<br>8.1.388.9590 | 7.2 CU7<br>7.2.477.9590 | 8.0 | Less than or equal to version 5.1 | .NET 5.0, >= .NET Core 3.1, <br>All >= .NET Framework 4.5 | [See supported OS version](#supported-windows-versions-and-support-end-date) | June 30, 2022 |
| 8.1 CU3.1<br>8.1.337.9590 | 7.2 CU7<br>7.2.477.9590 | 8.0 | Less than or equal to version 5.1 | .NET 5.0, >= .NET Core 3.1, <br>All >= .NET Framework 4.5 | [See supported OS version](#supported-windows-versions-and-support-end-date) | June 30, 2022 |
| 8.1 CU3<br>8.1.335.9590 | 7.2 CU7<br>7.2.477.9590 | 8.0 | Less than or equal to version 5.1 | .NET 5.0, >= .NET Core 3.1, <br>All >= .NET Framework 4.5 | [See supported OS version](#supported-windows-versions-and-support-end-date) | June 30, 2022 |
| 8.1 CU2<br>8.1.329.9590 | 7.2 CU7<br>7.2.477.9590 | 8.0 | Less than or equal to version 5.1 | .NET 5.0, >= .NET Core 3.1 (GA), <br>All >= .NET Framework 4.5 | [See supported OS version](#supported-windows-versions-and-support-end-date) | June 30, 2022 |
| 8.1 CU1<br>8.1.321.9590 | 7.2 CU7<br>7.2.477.9590 | 8.0 | Less than or equal to version 5.1 | .NET 5.0, >= .NET Core 2.1, <br>All >= .NET Framework 4.5 | [See supported OS version](#supported-windows-versions-and-support-end-date) | June 30, 2022 |
| 8.1 RTO<br>8.1.316.9590 | 7.2 CU7<br>7.2.477.9590 | 8.0 | Less than or equal to version 5.1 | .NET 5.0, >= .NET Core 2.1, <br>All >= .NET Framework 4.5 | [See supported OS version](#supported-windows-versions-and-support-end-date) | June 30, 2022 |
| 8.0 CU3<br>8.0.536.9590 | 7.1 CU10<br>7.1.510.9590 | 7.2 | Less than or equal to version 5.0 | .NET 5.0, >= .NET Core 2.1, <br>All >= .NET Framework 4.5 | [See supported OS version](#supported-windows-versions-and-support-end-date) | February 28, 2022 |
| 8.0 CU2<br>8.0.521.9590 | 7.1 CU10<br>7.1.510.9590 | 7.2 | Less than or equal to version 5.0 | .NET 5.0, >= .NET Core 2.1, <br>All >= .NET Framework 4.5 | [See supported OS version](#supported-windows-versions-and-support-end-date) | February 28, 2022 |
| 8.0 CU1<br>8.0.516.9590 | 7.1 CU10<br>7.1.510.9590 | 7.2 | Less than or equal to version 5.0 | .NET 5.0, >= .NET Core 2.1, <br>All >= .NET Framework 4.5 | [See supported OS version](#supported-windows-versions-and-support-end-date) | February 28, 2022 |
| 8.0 RTO<br>8.0.514.9590 | 7.1 CU10<br>7.1.510.9590 | 7.2 | Less than or equal to version 5.0 | .NET 5.0 (GA), >= .NET Core 2.1, <br>All >= .NET Framework 4.5 | [See supported OS version](#supported-windows-versions-and-support-end-date) | February 28, 2022 |
| 7.2 CU7<br>7.2.477.9590 | 7.0 CU9<br>7.0.478.9590 | 7.1 | Less than or equal to version 4.2 | .NET 5.0 (Preview), >= .NET Core 2.1,<br>All >= .NET Framework 4.5 | [See supported OS version](#supported-windows-versions-and-support-end-date) | November 30, 2021 |
| 7.2 CU6<br>7.2.457.9590 | 7.0 CU4<br>7.0.470.9590 |7.1 | Less than or equal to version 4.2 | .NET 5.0 (Preview support), >= .NET Core 2.1,<br>All >= .NET Framework 4.5 | [See supported OS version](#supported-windows-versions-and-support-end-date)| November 30, 2021 |
| 7.2 RTO-CU5<br>7.2.413.9590-7.2.452.9590 | 7.0 CU4<br>7.0.470.9590 | 7.1 |Less than or equal to version 4.2 | >= .NET Core 2.1,<br>All >= .NET Framework 4.5 | [See supported OS version](#supported-windows-versions-and-support-end-date)| November 30, 2021 |
| 7.1<br>7.1.510.9590 |7.0 CU3<br>7.0.466.9590 |N/A | Less than or equal to version 4.1 | >= .NET Core 2.1,<br>All >= .NET Framework 4.5 | [See supported OS version](#supported-windows-versions-and-support-end-date) | July 31, 2021 |

\* The version shouldn't be out of support.<br/>
** Service Fabric does not provide a .NET Core runtime. The service author is responsible for ensuring it is <a href="/dotnet/core/deploying/">available</a>.

## Supported Windows versions and support end date
Support for Service Fabric on a specific OS ends when support for the OS version reaches its End of Life.


### Windows Server

| OS version | Service Fabric support end date | OS Lifecycle link |
|---|---|---|
|Windows Server 2022|10/14/2031|<a href="/lifecycle/products/windows-server-2022">Windows Server 2022 - Microsoft Lifecycle</a>|
|Windows Server 2019|1/9/2029|<a href="/lifecycle/products/windows-server-2019">Windows Server 2019 - Microsoft Lifecycle</a>|
|Windows Server 2016 |1/12/2027|<a href="/lifecycle/products/windows-server-2016">Windows Server 2016 - Microsoft Lifecycle</a>|
|Windows Server 2012 R2 |10/10/2023|<a href="/lifecycle/products/windows-server-2012-r2">Windows Server 2012 R2 - Microsoft Lifecycle</a>|
|Version 20H2 |5/10/2022|<a href="/lifecycle/products/windows-server">Windows Server - Microsoft Lifecycle</a>|
|Version 2004 |12/14/2021|<a href="/lifecycle/products/windows-server">Windows Server - Microsoft Lifecycle</a>|
|Version 1909 |5/11/2021|<a href="/lifecycle/products/windows-server">Windows Server - Microsoft Lifecycle</a>|

<br>

### Windows 10

| OS version | Service Fabric support end date | OS Lifecycle link |
| --- | --- | --- |
| Windows 10 2019 LTSC | 1/9/2029 | <a href="/lifecycle/products/windows-10-enterprise-ltsc-2019">Windows 10 2019 LTSC - Microsoft Lifecycle</a> |
| Version 20H2 | 5/9/2023 | <a href="/lifecycle/products/windows-10-enterprise-and-education">Windows 10 Enterprise and Education - Microsoft Lifecycle</a> |
| Version 2004 | 12/14/2021| <a href="/lifecycle/products/windows-10-enterprise-and-education">Windows 10 Enterprise and Education - Microsoft Lifecycle</a> |
| Version 1909 | 5/10/2022 | <a href="/lifecycle/products/windows-10-enterprise-and-education">Windows 10 Enterprise and Education - Microsoft Lifecycle</a> |
| Version 1809 | 5/11/2021 | <a href="/lifecycle/products/windows-10-enterprise-and-education">Windows 10 Enterprise and Education - Microsoft Lifecycle</a> |
| Version 1803 | 5/11/2021 | <a href="/lifecycle/products/windows-10-enterprise-and-education">Windows 10 Enterprise and Education - Microsoft Lifecycle</a> |

## Linux

### Current versions
| Service Fabric runtime | Can upgrade directly from |Can downgrade to*|Compatible SDK or NuGet package version | Supported .NET runtimes** | OS version | End of support |
| --- | --- | --- | --- | --- | --- | --- |
| 10.1 RTO<br>10.1.1507.1 | 9.1 CU6<br>9.1.1642.1 | 9.0 | .NET 7, .NET 6, All  | N/A | [See supported OS version](#supported-linux-versions-and-support-end-date) | Current version |
| 10.0 CU1<br>10.0.1829.1 | 9.0 CU10<br>9.0.1489.1 | 9.0 | .NET 7, .NET 6, All  | N/A | [See supported OS version](#supported-linux-versions-and-support-end-date) | Current version |
| 10.0 RTO<br>10.0.1728.1 | 9.0 CU10<br>9.0.1489.1 | 9.0 | .NET 7, .NET 6, All  | N/A | [See supported OS version](#supported-linux-versions-and-support-end-date) | Current version |
| 9.1 CU7<br>9.1.1740.1 | 8.2 CU6<br>8.2.1485.1 | 8.2 | .NET 7, .NET 6, All  | N/A | [See supported OS version](#supported-linux-versions-and-support-end-date) | April 30, 2024 |
| 9.1 CU6<br>9.1.1642.1 | 8.2 CU6<br>8.2.1485.1 | 8.2 | .NET 7, .NET 6, All  | N/A | [See supported OS version](#supported-linux-versions-and-support-end-date) | April 30, 2024 |
| 9.1 CU5<br>9.1.1625.1 | 8.2 CU6<br>8.2.1485.1 | 8.2 | .NET 7, .NET 6, All  | N/A | [See supported OS version](#supported-linux-versions-and-support-end-date) | April 30, 2024 |
| 9.1 CU4<br>9.1.1592.1 | 8.2 CU6<br>8.2.1485.1 | 8.2 | .NET 7, .NET 6, All  | N/A | [See supported OS version](#supported-linux-versions-and-support-end-date) | April 30, 2024 |
| 9.1 CU3<br>9.1.1457.1 | 8.2 CU6<br>8.2.1485.1 | 8.2 | .NET 7, .NET 6, All  | N/A | [See supported OS version](#supported-linux-versions-and-support-end-date) | April 30, 2024 |
| 9.1 CU2<br>9.1.1388.1 | 8.2 CU6<br>8.2.1485.1 | 8.2 | .NET 7, .NET 6, All  | N/A | [See supported OS version](#supported-linux-versions-and-support-end-date) | April 30, 2024 |
| 9.1 CU1<br>9.1.1230.1 | 8.2 CU6<br>8.2.1485.1 | 8.2 | Less than or equal to version 6.0 | >= .NET Core 2.1 | [See supported OS version](#supported-linux-versions-and-support-end-date) | April 30, 2024 |
| 9.1 RTO<br>9.1.1206.1 | 8.2 CU6<br>8.2.1485.1 | 8.2 | Less than or equal to version 6.0 | >= .NET Core 2.1 | [See supported OS version](#supported-linux-versions-and-support-end-date) | April 30, 2024 |
| 9.0 CU12<br>9.0.1554.1 | 8.0 CU3<br>8.0.527.1 | 8.2 CU 5.1<br>8.2.1483.1 | .NET 6 | N/A | [See supported OS version](#supported-linux-versions-and-support-end-date) | January 1, 2023 |
| 9.0 CU11<br>9.0.1503.1 | 8.0 CU3<br>8.0.527.1 | 8.2 CU 5.1<br>8.2.1483.1 | .NET 6 | N/A | [See supported OS version](#supported-linux-versions-and-support-end-date) | November 1, 2023 |
| 9.0 CU10<br>9.0.1489.1 | 8.0 CU3<br>8.0.527.1 | 8.2 CU 5.1<br>8.2.1483.1 | .NET 6 | N/A | [See supported OS version](#supported-linux-versions-and-support-end-date) | November 1, 2023 |
| 9.0 CU9<br>9.0.1463.1 | 8.0 CU3<br>8.0.527.1 | 8.2 CU 5.1<br>8.2.1483.1 | .NET 6 | N/A | [See supported OS version](#supported-linux-versions-and-support-end-date) | November 1, 2023 |
| 9.0 CU8<br>9.0.1317.1 | 8.0 CU3<br>8.0.527.1 | 8.2 CU 5.1<br>8.2.1483.1 | .NET 6 | N/A | [See supported OS version](#supported-linux-versions-and-support-end-date) | November 1, 2023 |
| 9.0 CU7<br>9.0.1260.1 | 8.0 CU3<br>8.0.527.1 | 8.2 CU 5.1<br>8.2.1483.1 | .NET 6 | N/A | [See supported OS version](#supported-linux-versions-and-support-end-date) | November 1, 2023 |
| 9.0 CU5<br>9.0.1148.1 | 8.0 CU3<br>8.0.527.1 | 8.2 CU 5.1<br>8.2.1483.1 | Less than or equal to version 6.0 | >= .NET Core 2.1 | [See supported OS version](#supported-linux-versions-and-support-end-date) | November 1, 2023 |
| 9.0 CU4<br>9.0.1114.1 | 8.0 CU3<br>8.0.527.1 | 8.2 CU 5.1<br>8.2.1483.1 | Less than or equal to version 6.0 | >= .NET Core 2.1 | [See supported OS version](#supported-linux-versions-and-support-end-date) | November 1, 2023 |
| 9.0 CU3<br>9.0.1103.1 | 8.0 CU3<br>8.0.527.1 | 8.2 CU 5.1<br>8.2.1483.1 | Less than or equal to version 6.0 | >= .NET Core 2.1 | [See supported OS version](#supported-linux-versions-and-support-end-date) | November 1, 2023 |
| 9.0 CU2.1<br>9.0.1086.1 | 8.0 CU3<br>8.0.527.1 | 8.2 CU 5.1<br>8.2.1483.1 | Less than or equal to version 6.0 | >= .NET Core 2.1 | [See supported OS version](#supported-linux-versions-and-support-end-date) | November 1, 2023 |

| Service Fabric runtime | Can upgrade directly from |Can downgrade to*|Compatible SDK or NuGet package version | Supported .NET runtimes** | OS version | End of support |
| --- | --- | --- | --- | --- | --- | --- |
| 9.0 CU2<br>9.0.1056.1 | 8.0 CU3<br>8.0.527.1 | 8.0 | Less than or equal to version 6.0 | >= .NET Core 2.1 | [See supported OS version](#supported-linux-versions-and-support-end-date) | August 19, 2022 |
| 9.0 CU1<br>9.0.1035.1 | 8.0 CU3<br>8.0.527.1 | 8.0 | Less than or equal to version 6.0 | >= .NET Core 2.1 | [See supported OS version](#supported-linux-versions-and-support-end-date) | August 19, 2022 |
| 9.0 RTO<br>9.0.1018.1 | 8.0 CU3<br>8.0.527.1 | 8.0 | Less than or equal to version 6.0 | >= .NET Core 2.1 | [See supported OS version](#supported-linux-versions-and-support-end-date) | August 19, 2022 |
| 8.2 CU8<br>8.2.1723.1 | 8.0 CU3<br>8.0.527.1 | N/A | Less than or equal to version 5.2 | >= .NET Core 2.1 | [See supported OS version](#supported-linux-versions-and-support-end-date) | November 30, 2022 |
| 8.2 CU6<br>8.2.1485.1 | 8.0 CU3<br>8.0.527.1 | N/A | Less than or equal to version 5.2 | >= .NET Core 2.1 | [See supported OS version](#supported-linux-versions-and-support-end-date) | November 30, 2022 |
| 8.2 CU5.1<br>8.2.1483.1 | 8.0 CU3<br>8.0.527.1 | N/A | Less than or equal to version 5.2 | >= .NET Core 2.1 | [See supported OS version](#supported-linux-versions-and-support-end-date) | November 30, 2022 |
| 8.2 CU4<br>8.2.1458.1 | 8.0 CU3<br>8.0.527.1 | 8.0 | Less than or equal to version 5.2 | >= .NET Core 2.1 | [See supported OS version](#supported-linux-versions-and-support-end-date) | November 30, 2022 |
| 8.2 CU3<br>8.2.1434.1 | 8.0 CU3<br>8.0.527.1 | 8.0 | Less than or equal to version 5.2 | >= .NET Core 2.1 | [See supported OS version](#supported-linux-versions-and-support-end-date) | November 30, 2022 |
| 8.2 CU2.1<br>8.2.1397.1 | 8.0 CU3<br>8.0.527.1 | 8.0 | Less than or equal to version 5.2 | >= .NET Core 2.1 | [See supported OS version](#supported-linux-versions-and-support-end-date) | November 30, 2022 |
| 8.2 CU2<br>8.2.1285.1 | 8.0 CU3<br>8.0.527.1 | 8.0 | Less than or equal to version 5.2 | >= .NET Core 2.1 | [See supported OS version](#supported-linux-versions-and-support-end-date) | November 30, 2022 |
| 8.2 CU1<br>8.2.1204.1 | 8.0 CU3<br>8.0.527.1 | 8.0 | Less than or equal to version 5.2 | >= .NET Core 2.1 | [See supported OS version](#supported-linux-versions-and-support-end-date) | November 30, 2022 |
| 8.2 RTO<br>8.2.1124.1 | 8.0 CU3<br>8.0.527.1 | 8.0 | Less than or equal to version 5.2 | >= .NET Core 2.1 | [See supported OS version](#supported-linux-versions-and-support-end-date) | November 30, 2022 |
| 8.1 CU4<br>8.1.360.1 | 7.2 CU7<br>7.2.476.1 | 8.0 | Less than or equal to version 5.1 | >= .NET Core 2.1 | [See supported OS version](#supported-linux-versions-and-support-end-date) | June 30, 2022 |
| 8.1 CU3.1<br>8.1.340.1 | 7.2 CU7<br>7.2.476.1 | 8.0 | Less than or equal to version 5.1 | >= .NET Core 2.1 | [See supported OS version](#supported-linux-versions-and-support-end-date) | June 30, 2022 |
| 8.1 CU3<br>8.1.334.1 | 7.2 CU7<br>7.2.476.1 | 8.0 | Less than or equal to version 5.1 | >= .NET Core 2.1 | [See supported OS version](#supported-linux-versions-and-support-end-date) | June 30, 2022 |
| 8.1 CU2<br>8.1.328.1 | 7.2 CU7<br>7.2.476.1 | 8.0 | Less than or equal to version 5.1 | >= .NET Core 2.1 | [See supported OS version](#supported-linux-versions-and-support-end-date) | June 30, 2022 |
| 8.1 CU1<br>8.1.323.1 | 7.2 CU7<br>7.2.476.1 | 8.0 | Less than or equal to version 5.1 | >= .NET Core 2.1 | [See supported OS version](#supported-linux-versions-and-support-end-date) | June 30, 2022 |
| 8.1 RTO<br>8.1.320.1 | 7.2 CU7<br>7.2.476.1 | 8.0 | Less than or equal to version 5.1 | >= .NET Core 2.1 | [See supported OS version](#supported-linux-versions-and-support-end-date) | June 30, 2022 |
| 8.0 CU3<br>8.0.527.1 | 7.1 CU8<br>7.1.508.1 | 7.2 | Less than or equal to version 5.0 | >= .NET Core 2.1 | [See supported OS version](#supported-linux-versions-and-support-end-date) | February 28, 2022 |
| 8.0 CU1<br>8.0.515.1 | 7.1 CU8<br>7.1.508.1 | 7.2 | Less than or equal to version 5.0 | >= .NET Core 2.1 | [See supported OS version](#supported-linux-versions-and-support-end-date) | February 28, 2022 |
| 8.0 RTO<br>8.0.513.1 | 7.1 CU8<br>7.1.508.1 | 7.2 | Less than or equal to version 5.0 | >= .NET Core 2.1 | [See supported OS version](#supported-linux-versions-and-support-end-date) | February 28, 2022 |
| 7.2 CU7<br>7.2.476.1 | 7.0 CU9<br>7.0.472.1 | 7.1 | Less than or equal to version  4.2 | >= .NET Core 2.1 | [See supported OS version](#supported-linux-versions-and-support-end-date) | November 30, 2021 |
| 7.2 RTO-CU6<br>7.2.431.1-7.2.456.1 | 7.0 CU4<br>7.0.469.1 | 7.1 | Less than or equal to version  4.2 | >= .NET Core 2.1 | [See supported OS version](#supported-linux-versions-and-support-end-date) | November 30, 2021 |
| 7.1<br>7.1.508.1| 7.0 CU3<br>7.0.465.1 | N/A | Less than or equal to version  4.1 | >= .NET Core 2.1 | [See supported OS version](#supported-linux-versions-and-support-end-date) | July 31, 2021 |

\* The version shouldn't be out of support.<br/>
** Service Fabric does not provide a .NET Core runtime and the service author is responsible for ensuring it is <a href="/dotnet/core/deploying/">available</a>

## Supported Linux versions and support end date
Support for Service Fabric on a specific OS ends when support for the OS version reaches its End of Life.

#### Ubuntu
| OS version | Service Fabric support end date| OS Lifecycle link |
| --- | --- | --- |
| Ubuntu 20.04 | April 2025 | <a href="https://wiki.ubuntu.com/Releases">Ubuntu lifecycle</a>|
| Ubuntu 18.04 | April 2023 | <a href="https://wiki.ubuntu.com/Releases">Ubuntu lifecycle</a>|

## Service Fabric version name and number reference
The following table lists the version names of Service Fabric and their corresponding version numbers.

| Version name | Windows version number | Linux version number |
| --- | --- | --- |
| 10.1 RTO | 10.1.1541.9590 | 10.1.1507.1 |
| 10.0 CU1 | 10.0.1949.9590 | 10.0.1829.1 |
| 10.0 RTO | 10.0.1816.9590 | 10.0.1728.1 |
| 9.1 CU7 | 9.1.1993.9590 | 9.1.1740.1 |
| 9.1 CU6 | 9.1.1851.9590 | 9.1.1642.1 |
| 9.1 CU5 | 9.1.1833.9590 | 9.1.1625.1 |
| 9.1 CU4 | 9.1.1799.9590 | 9.1.1592.1 |
| 9.1 CU3 | 9.1.1653.9590 | 9.1.1457.1 |
| 9.1 CU2 | 9.1.1583.9590 | 9.1.1388.1 |
| 9.1 CU1 | 9.1.1436.9590 | 9.1.1230.1 |
| 9.1 RTO | 9.1.1390.9590 | 9.1.1206.1 |
| 9.0 CU12 | 9.0.1672.9590 | 9.0.1554.1 |
| 9.0 CU11 | 9.0.1569.9590 | 9.0.1503.1 |
| 9.0 CU10 | 9.0.1553.9590 | 9.0.1489.1 |
| 9.0 CU9 | 9.0.1526.9590 | 9.0.1463.1 |
| 9.0 CU8 | 9.0.1380.9590 | 9.0.1317.1 |
| 9.0 CU7 | 9.0.1309.9590 | 9.0.1260.1 |
| 9.0 CU6 | 9.0.1254.9590 | Not applicable |
| 9.0 CU5 | 9.0.1155.9590 | 9.0.1148.1 |
| 9.0 CU4 | 9.0.1121.9590 | 9.0.1114.1 |
| 9.0 CU3 | 9.0.1107.9590 | 9.0.1103.1 |
| 9.0 CU2.1 | Not applicable | 9.0.1086.1 |
| 8.2 CU9 | 8.2.1748.9590 | Not applicable |
| 8.2 CU8 | 8.2.1723.9590 | 8.2.1521.1 |
| 8.2 CU7 | 8.2.1692.9590 | Not applicable |
| 8.2 CU6 | 8.2.1686.9590 | 8.2.1485.1 |
| 8.2 CU5.1 | Not applicable | 8.2.1483.1 |
| 9.0 CU2 | 9.0.1048.9590 | 9.0.1056.1 |
| 9.0 CU1 | 9.0.1028.9590 | 9.0.1035.1 |
| 9.0 RTO | 9.0.1017.9590 | 9.0.1018.1 |
| 8.2 CU4 | 8.2.1659.9590 | 8.2.1458.1 |
| 8.2 CU3 | 8.2.1620.9590 | 8.2.1434.1 |
| 8.2 CU2.1 | 8.2.1571.9590 | 8.2.1397.1 |
| 8.2 CU2 | 8.2.1486.9590 | 8.2.1285.1 |
| 8.2 CU1 | 8.2.1363.9590 | 8.2.1204.1 |
| 8.2 RTO | 8.2.1235.9590 | 8.2.1124.1 |
| 8.1 CU4 | 8.1.388.9590 | 8.1.360.1 |
| 8.1 CU3.1 | 8.1.337.9590 | 8.1.340.1 |
| 8.1 CU3 | 8.1.335.9590 | 8.1.334.1 |
| 8.1 CU2 | 8.1.329.9590 | 8.1.328.1 |
| 8.1 CU1 | 8.1.321.9590 | 8.1.323.1 |
| 8.1 RTO | 8.1.316.9590 | 8.1.320.1 |
| 8.0 CU3 | 8.0.536.9590 | 8.0.527.1 |
| 8.0 CU2 | 8.0.521.9590 | Not applicable |
| 8.0 CU1 | 8.0.516.9590 | 8.0.515.1 |
| 8.0 RTO | 8.0.514.9590 | 8.0.513.1 |
| 7.2 CU7 | 7.2.477.9590 | 7.2.476.1 |
| 7.2 CU6 | 7.2.457.9590 | 7.2.456.1 |
| 7.2 CU5 | 7.2.452.9590 | 7.2.454.1 |
| 7.2 CU4 | 7.2.445.9590 | 7.2.447.1 |
| 7.2 CU3 | 7.2.433.9590 | Not applicable |
| 7.2 CU2 | 7.2.432.9590 | 7.2.431.1 |
| 7.2 RTO | 7.2.413.9590 | Not applicable |
| 7.1 CU10 | 7.1.510.9590 | Not applicable |
| 7.1 CU8 | 7.1.503.9590 | 7.1.508.1 |
| 7.1 CU6 | 7.1.459.9590 | 7.1.455.1 |
| 7.1 CU5 | 7.1.458.9590 | 7.1.454.1 |
| 7.1 CU3 | 7.1.456.9590 | 7.1.452.1 |
| 7.1 CU2 | 7.1.428.9590 | 7.1.428.1 |
| 7.1 CU1 | 7.1.417.9590 | 7.1.418.1 |
| 7.1 RTO | 7.1.409.9590 | 7.1.410.1 |
| 7.0 CU9 | 7.0.478.9590 | 7.0.472.1 |
| 7.0 CU6 | 7.0.472.9590 | 7.0.471.1 |
| 7.0 CU4 | 7.0.470.9590 | 7.0.469.1 |
| 7.0 CU3 | 7.0.466.9590 | 7.0.465.1 |
| 7.0 CU2 | 7.0.464.9590 | 7.0.464.1 |
| 7.0 RTO | 7.0.457.9590 | 7.0.457.1 |
| 6.5 CU5 | 6.5.676.9590 | 6.5.467.1 |
| 6.5 CU3 | 6.5.664.9590 | 6.5.466.1 |
| 6.5 CU2 | 6.5.658.9590 | 6.5.460.1 |
| 6.5 CU1 | 6.5.641.9590 | 6.5.454.1 |
| 6.5 RTO | 6.5.639.9590 | 6.5.435.1 |
| 6.4 CU8 | 6.4.670.9590 | Not applicable|
| 6.4 CU7 | 6.4.664.9590 | 6.4.661.1 |
| 6.4 CU6 | 6.4.658.9590 | Not applicable|
| 6.4 CU5 | 6.4.654.9590 | 6.4.649.1 |
| 6.4 CU4 | 6.4.644.9590 | 6.4.639.1 |
| 6.4 CU3 | 6.4.637.9590 | 6.4.634.1 |
| 6.4 CU2 | 6.4.622.9590 | Not applicable|
| 6.4 RTO | 6.4.617.9590 | 6.4.625.1 |
| 6.3 CU1 | 6.3.187.9494 | 6.3.129.1 |
| 6.3 RTO | 6.3.162.9494 | 6.3.119.1 |
| 6.2 CU3 | 6.2.301.9494 | 6.2.199.1 |
| 6.2 CU2 | 6.2.283.9494 | 6.2.194.1 |
| 6.2 CU1 | 6.2.274.9494 | 6.2.191.1 |
| 6.2 RTO | 6.2.269.9494 | 6.2.184.1 |
| 6.1 CU4 | 6.1.480.9494 | 6.1.187.1 |
| 6.1 CU3 | 6.1.472.9494 | Not applicable|
| 6.1 CU2 | 6.1.467.9494 | 6.1.185.1 |
| 6.1 CU1 | 6.1.456.9494 | 6.1.183.1 |
| 6.0 CU2 | 6.0.232.9494 | 6.0.133.1 |
| 6.0 CU1 | 6.0.219.9494 | 6.0.127.1 |
| 6.0 RTO | 6.0.211.9494 | 6.0.120.1 |
| 5.7 CU4 | 5.7.221.9494 | Not applicable|
| 5.7 RTO | 5.7.198.9494 | Not applicable|
| 5.6 CU3 | 5.6.220.9494 | Not applicable|
| 5.6 CU2 | 5.6.210.9494 | Not applicable|
| 5.6 RTO | 5.6.204.9494 | Not applicable|
| 5.5 CU4 | 5.5.232.0 | Not applicable|
| 5.5 CU3 | 5.5.227.0 | Not applicable|
| 5.5 CU2 | 5.5.219.0 | Not applicable|
| 5.5 CU1 | 5.5.216.0    | Not applicable|
| 5.4 CU2 | 5.4.164.9494 | Not applicable|
| 5.3 CU3 | 5.3.311.9590 | Not applicable|
| 5.3 CU2 | 5.3.301.9590 | Not applicable|
| 5.3 CU1 | 5.3.204.9494 | Not applicable|
| 5.3 RTO | 5.3.121.9494 | Not applicable|
