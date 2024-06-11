---
title: NC2 on Azure responsibility matrix

author: jjaygbay1
ms.author: jacobjaygbay
description: Defines who is responsible for what for NC2 on Azure
ms.topic: conceptual
ms.subservice: baremetal-nutanix
ms.custom: engagement-fy23
ms.date: 06/07/2024
---

# NC2 on Azure responsibility matrix

On-premises Nutanix environments require the Nutanix customer to support all the hardware and software for running the platform. For NC2 on Azure Microsoft maintains the hardware for the customer. Let's look at what the customer manages versus what Microsoft & Nutanix manages.

<table>
<head>
    <style>
table, th, td {
  border: 1px solid;
}
</style>
</head>
    <thead>
        <tr>
            <th>Areas</th>
            <th>Deployment</th>
            <th>Life-cycle</th>
            <th>Configuration</th>
        </tr>
    </thead>
    <tbody>
        <tr>
        <td>Physical Infrastructure</td>
            <td rowspan=8 colspan=3 style="text-align: center;vertical-align: middle; border=5">Microsoft NC2 team</td> 
        </tr>
<tr>
<td>Physical Security</td>
</tr>
<tr>
 <td colspan=1>Baremetal Discounts</td>
</tr>
<tr>
<td>BareMetal Trial and Billing</td>
</tr>
<tr>
<td>Hardware failures</td>
</tr>
<td>Provisioning (Temporary) OS
</td>
</tr>
<tr>
<td>Firmware upgrade
</td>
</tr>
<tr>
<td>Network Underlay (MS-Control Plane)
</td>
</tr>
<tr>
<td>Azure Portal Experience</td>
<td rowspan=4 colspan=4 style="text-align: center;vertical-align: middle;">Customer manages</td>
</tr>
<tr>
<td>
UVM OS
</td>
</tr>

<tr>
<td>
Nutanix Product Portfolio    </td>
</tr>

<tr>
<td>
NC2 Clusters on Azure</td>
</tr>
<tr>
<td>NC2 Portal</td>
<td colspan=3 style="text-align: center;vertical-align: middle;">
Nutanix manages</td>
</tr>
<tr>
<td>
AHV/AOS
</td>
<td rowspan=2 style="text-align: center; vertical-align: middle;" border="1">
Nutanix manages
</td>
<td rowspan=2 colspan=2 style="text-align: center; vertical-align: middle;">
Customer manages</td>
</tr>

<tr>
<td>
Flow and Network Overlay/FGW</td>
</td>
</tr>

<tr>

<td> 
Physical security
</td>
<td rowspan=2 colspan=3 style="text-align: center;">
Microsoft Azure manages</td>
</tr>
<tr>
<td>
Azure Native Service SRs
</td>
</tr>


</table>










Microsoft manages the Azure BareMetal specialized compute hardware and its data and control plane platform for underlay network. Microsoft supports if the customers plan to bring their existing Azure Subscription, VNet, vWAN etc.

Nutanix covers the life-cycle management of Nutanix software (MCM, Prism Central/Element etc.) and their licenses.

**Monitoring and remediation**

Microsoft NC2 team continuously monitors the health of the underlay and BareMetal infrastructure. If MS NC2 detects a failure, it takes action to repair the failed services.