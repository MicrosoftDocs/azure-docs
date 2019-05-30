---
title: Tutorial - Receive data shared by a Data Provider 
description: Tutorial - Receive data from Azure Data Share 
services: azure-data-share
author: joannapea

ms.service: azure-data-share
ms.topic: tutorial
ms.date: 07/14/2019
ms.author: joannapea
---
# Tutorial: Receiving data shared with you by a Data Provider 

This tutorial will teach you:

* How to accept a Data Share invitation;
* Create a Data Share account
* Specify a destination for your data
* Create a subscription to your data share for scheduled refresh

## Prerquisites

* Azure Subscription
* Azure Storage account and/or Azure Data Lake account
* An e-mail invitation from the Data Provider 

## Accepting your Data Share invitation
There are two ways that you can accept a Data Share invitation. The first way is through an invitation which was sent to you by the Data Provider, and the second is directly through the Azure Portal. 

## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com/).

## Locate the invitation that was sent to you by the Data Provider 

If the organization that is sharing data with you has invited you to share data, you should see an invitation in your inbox from Microsoft Azure, titled *Azure Data Share invitation from <yourdataprovider@theiremail.com>*. Take note of the Share name to ensure that you are accepting the correct share in the case of multiple invitations. 

## Click on *View Invitation* and select the invitation corresponding to the invitation received. 

## Accept the invitation
To accept your Data Share invitation, you will be prompted to review the contents of the data share being shared with you as well as create a Data Share account if you do not already have an existing one. Ensure that all fields are reviewed, including the *Terms of Use*. If you agree to the terms of use, you will be required to check the box to indicate that you agree. 

Under *Target Data Share Account*, select the Subscription and Resource Group that you will be deploying your Data Share into. 

For the *Data Share Account* field, select *Create new* if you do not have an existing Data Share account. Alternatively, select an existing Data Share account that you'd like to accept your data share into. 

For the *Received Share Name* field, you may leave the default specified by the Data Provide, or specify a new name for the received share. 

Once you have agreed to the terms of use and specified a location for your share, click on *Accept and Configure*. 

## Configure target storage for your Data Share
Under *Target Storage Settings*, select the Subscription, Resource group and storage account that you'd like to receive your data into. 

Your Data Provider may have offered a synchronization setting for you to subscribe to. This will appear on this screen if one was offered, as shown below. If  Select the synchronization setting 



