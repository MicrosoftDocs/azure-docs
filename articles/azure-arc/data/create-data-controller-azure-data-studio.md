---
title: Create data controller in Azure Data Studio
description: Create data controller in Azure Data Studio
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 08/04/2020
ms.topic: how-to
---

# Scenario: Create data controller in Azure Data Studio

You can create a data controller using Azure Data Studio through the deployment wizard and notebooks.

## Prerequisites

- You need access to a Kubernetes cluster and have your kubeconfig file.
- You need to [install the client tools](install-client-tools.md) including the Azure Data Studio extension called **Arc deployment**.
- You need to log in to Azure in Azure Data Studio.  To do this: type CTRL/Command + SHIFT + P to open the command text window and type **Azure**.  Choose **Azure: Sign in**.   In the panel the comes up click the + icon in the top right to add an Azure AD account.

> [!NOTE]
>  This wizard currently only works for AKS, EKS, and Kubeadm.

## Use the Deployment Wizard to deploy a data controller

Follow these steps to deploy a data controller using the Deployment wizard.

1. In Azure Data Studio, click on the Connections tab on the left navigation.
1. Click on the **...** button at the top of the Connections panel and choose **New Deployment...**
1. Click on the **...** button at the top of the Connections panel and choose **New Deployment...**
In the new deployment wizard, choose **Azure Arc Data Controller**, check the license acceptance checkbox, click the Select button at the bottom.
1. Click on the **...** button at the top of the Connections panel and choose **New Deployment...**
   Use the default kubeconfig file or select another one.
1. Click on the **...** button at the top of the Connections panel and choose **New Deployment...**
   Choose a cluster context.
1. Click on the **...** button at the top of the Connections panel and choose **New Deployment...**
   Leave the password as is.
1. Click on the **...** button at the top of the Connections panel and choose **New Deployment...**
   Enter the password:
1. Click Next.
1. Choose a deployment profile file - EKS, AKS, or Kubeadm depending on your target cluster.
1. Click Next.
1. Choose the desired subscription, resource group.
1. Enter a name for the data controller.  Note: the same name will be used to create a namespace in the Kubernetes cluster so it must conform to Kubernetes naming [conventions](https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names).
1. Enter and confirm a password for the admin account.
1. Click Next.
1. Review and click **Script to Notebook**
1. Review the generated notebook.  Make any changes necessary such as storage class names.
1. Click **Run All** at the top of the notebook.
