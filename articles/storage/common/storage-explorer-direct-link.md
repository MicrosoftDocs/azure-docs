---
title: Azure Storage Explorer direct-link | Microsoft Docs
description: Documentation of Azure Storage Explorer direct link
services: storage
author: chuye
ms.service: storage
ms.topic: article
ms.date: 02/24/2021
ms.author: chuye
---

# Azure Storage Explorer direct link

During installation, Storage Explorer will register its own protocol to open Storage Explorer and navigate to a certain resource using a link, called direct link. An example direct link to a Blob container in Storage Explorer will look like `storageexplorer://v=1&accountid=/subscriptions/the_subscription_id/resourceGroups/the_resource_group_name/providers/Microsoft.Storage/storageAccounts/the_storage_account_name&subscriptionid=the_subscription_id&resourcetype=Azure.BlobContainer&resourcename=the_blob_container_name`. This doc page introduces how direct links work and how to use direct links.

## How direct links work

Storage Explorer uses the tree view to visualize resources on the Cloud. Each resource is represented as a node in the tree view. Each direct link contains the hierarchical information for the target resource node. When a direct link is opened, it opens Storage Explorer and sends the parameters of the direct link. Storage Explorer then uses that information to navigate in the tree view and show the target resource.

To enable Storage Explorer to navigate to the target resource, you must be signed-in to a user account that grants access to the target resource.

## How to use a direct link

Storage Explorer provides a convenient way to create direct link of a certain resource. In the context menu of the resource, the "Copy Direct Link" action will construct the direct link to the resource and save the link to the clipboard. You can also manually construct a direct link by filling its parameters.

You can open a direct link in any web browser as if the link is to a website. The browser will then open Storage Explorer with the direct link.

## Parameters

A Storage Explorer direct link always starts with protocol `storageexplorer://`. The rest of the direct link is parameters that can vary to point to different resources. The following table explains each of the possible parameters in a direct link.

Parameter | Description
:---------| ----------
`v`         | Version of the direct-link protocol.
`accountid` | a / delimited string representing the node path in Storage Explorer to the target resource. Each segment represents a node in the Storage Explorer tree view.
`subscriptions` | ID of the subscription the target resource is in.
`resourcetype` | Optional. One of "Azure.BlobContainer", "Azure.FileShare", "Azure.Queue", "Azure.FileShare". Only used when the target resource is a blob container, a file share, a queue, or a table.
`resourcename` | Optional. The name of the target blob container, target file share, target queue, or target table. Only used when the target resource is a blob container, a file share, a queue, or a table.
