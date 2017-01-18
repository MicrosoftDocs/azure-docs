---
title: Saving Network Watcher topology to Visio with PowerShell and REST API | Microsoft Docs
description: This article will describe how to use the REST API to query your network topology and save in a basic Visio diagram.
services: network-watcher
documentationcenter: na
author: georgewallace
manager: timlt
editor: 

ms.assetid: ad27ab85-9d84-4759-b2b9-e861ef8ea8d8
ms.service: network-watcher
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload:  infrastructure-services
ms.date: 01/30/2017
ms.author: gwallace
---

# Saving Network Watcher topology to Visio with PowerShell and REST API

The Topology feature of Network Watcher provides a visual representation of the network resources in a subscription. In the portal, this visualization is presented to you automatically. The information behind the topology view in the portal can be retrieved through the REST API.
This makes the topology information more versatile as the data can be consumed by other tools to build out the visualization.

## Before you begin

In this scenario, you call the Network Watcher Rest API to retrieve the topology information. To provide the examples, **PowerShell** is used. Other tools like ARMclient can be used and is found on chocolatey at [ARMClient on Chocolatey](https://chocolatey.org/packages/ARMClient)

This scenario assumes you have already followed the steps in [Create a Network Watcher](network-watcher-create.md) to create a Network Watcher.

## Scenario

The scenario covered in this article creates a simple Visio diagram based off on topology information returned from the REST API.

In this scenario you will:

- Login with armclient
- Retrieve the topology information for your network
- Create a Visio diagram of the topology with PowerShell

## Log in with ARMClient

Log in to armclient with your Azure credentials.

```PowerShell
armclient login
```

## Retreive Topology

The following example requests the topology from the REST API.  The example is parameterized to allow for flexibility in creating an example.  Replace all values with \< \> surrounding them.

```powershell
$subscriptionId = "<subscription id>"
$resourceGroupName = "<resource group name>"
$networkWatcherName = "<network watcher name>"

armclient get "https://management.azure.com/subscriptions/${subscriptionId}/ResourceGroups/${resourceGroupName}/providers/Microsoft.Network/networkWatchers/${networkWatcherName}/topology?api-version=2016-07-01" | ConvertFrom-JSON
```

## Create Visio Diagram with PowerShell

The following code assumes you have the **$response** variable from the previous steps. The code then creates a Visio diagram based on the response information.

> ![IMPORTANT]
> In order to use the following script you must have visio installed.

```powershell
# Create an instance of Visio and create a document based on the Basic Diagram template.
$AppVisio = New-Object -ComObject Visio.Application
$docsObj = $AppVisio.Documents
$DocObj = $docsObj.Add("Basic Network Diagram.vst")

$stencilPath=$AppVisio.GetBuiltInStencilFile(2,0)
$stencil=$AppVisio.Documents.OpenEx($stencilPath,64)


$stencilMaster=$stencil.Masters('Classic')

$pagsObj = $AppVisio.ActiveDocument.Pages
$pagObj = $pagsObj.Item(1)

#Set Start Locations of Objects
$x = 0
$y = 10
$resources = $response.resources | ? {$_.associations -ne $null}
For($i=0; $i -lt $resources.count; $i++)
{

$containerObj = $pagObj.Drop($stencilMaster, $x, $y)
     $containerObj.Text = $resources[$i].Name

foreach($assoc in $resources[$i].associations)
{


$resource = $response.resources | ? {$($_.id + "_" + $resources[$i].name) -eq $($assoc.resourceId)}
$rec = $pagObj.DrawRectangle($x,$y,$x+1,$y+1)
$rec.Text = $($assoc.name)
$rec.ContainerProperties.fit
$x = $x + 1.5
$containerObj.ContainerProperties.AddMember($rec,1)
$containerObj.ContainerProperties.SetMargin(70,2.5)
$containerObj.ContainerProperties.FitToContents()
}
if($i % 5 -eq 0)
{
$y = $y - 2.5
$x = 0 
}
}
```

## View the results

The results will look like the following image. While the output is basic, it is meant to provide you the beginning steps to using Network Watcher Topology outside of the Azure portal.

![Visio diagram][1]

## Next Steps

Learn more about the security rules that are applied to your network resources by visiting [Security group view overview](network-watcher-security-group-view-overview.md)

[1]: ./media/network-watcher-topology-visio-rest/figure1.png