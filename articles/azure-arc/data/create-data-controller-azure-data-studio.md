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
- You need to [install the client tools](install-client-tools.md) including the Azure Data Studio and extension called **Azure Arc**.
- You need to log in to Azure in Azure Data Studio.  To do this: type CTRL/Command + SHIFT + P to open the command text window and type **Azure**.  Choose **Azure: Sign in**.   In the panel the comes up click the + icon in the top right to add an Azure AD account.

> [!NOTE]
>  This wizard currently only works for AKS, EKS, and Kubeadm.

## Use the Deployment Wizard to deploy Azure Arc data controller

Follow these steps to deploy an Azure Arc data controller using the Deployment wizard.

1. In Azure Data Studio, click on the Connections tab on the left navigation.
1. Click on the **...** button at the top of the Connections panel and choose **New Deployment...**

In the new deployment wizard, choose **Azure Arc Data Controller**, check the license acceptance checkbox, ensure the required tools are installed with appropriate versions, and then click the Select button at the bottom to initiate the deployment wizard.

Step 1: Select from existing kubernetes clusters
1. Use the default kube.config file or use the Browse button to select a different kube.config file.
2. Choose a cluster context. 

Step 2: Choose the config profile
1.. Choose a deployment profile file - Elastic Kubernetes Service, or Azure Kubernetes Service, or Kubeadm etc, depending on your target cluster.
2. Click Next.

Step 3: Provide details to create Azure Arc data controller 
Project Details:
- Choose the desired subscription, resource group. Use the **Sign in** button to login to your Azure account and select the desired Subscription and Resource Group to deploy the Azure Arc data controller to. 

Data controller details:
1. Enter the name of the namespace where the data controller will be deployed. Ensure the name conforms to Kubernetes naming [conventions](https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names).
2. Enter a name for the data controller.
3. Choose the Azure location where the data controller resource will be projected to.
4. Enter an admin account for the data controller
5. Enter and confirm a password for the admin account.
6. Click Next.

Step 4: Review your configuration

7. Review and click **Script to Notebook**
8. Review the generated notebook.  Make any changes necessary such as storage class names.
9.  Click **Run All** at the top of the notebook.
