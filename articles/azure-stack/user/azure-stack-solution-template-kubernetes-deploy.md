---
title: Deploy a Kubernetes Cluster to Azure Stack | Microsoft Docs
description: Learn how to deploy a Kubernetes Cluster to Azure Stack.
services: azure-stack
documentationcenter: ''
author: mattbriggs
manager: femila
editor: ''

ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/08/2018
ms.author: mabrigg
ms.reviewer: waltero

---

# Deploy a Kubernetes cluster to Azure Stack

You can install Kubernetes on Azure Stack.

The following article look at using an Azure Resource Manager template to deploy and provision the resources for Kubernetes in a single, coordinated operation. Collect the required information about your Azure Stack installation, generate the template, and then deploy to your cloud.

This solution deploys Kubernetes cluster running as an standalone cluster with templates generated using ACS-Engine. Kubernetes is a distributed systems platform used to build scalable, reliable, and easily-managed applications for the cloud. You can use Kubernetes to:

- Develop massively scalable, upgradable, applications that can be deployed in seconds. 
- Simplify the design of your application and improve its reliability by different Helm applications. 
- Easily monitor and diagnose the health of your applications with scale and upgrade functionality.

## Deploy the Kubernetes cluster

1. Open the [Azure Stack portal](https://portal.local.azurestack.external).

2. Select **Marketplace** > **Kubernetes Cluster** in **Compute**.

3. Select **Create**.

## Install Helm
And then they work with the Deploy Solution Template blade and the Parameters blade?

If so, then I should have the workflow for the deploy solution template and completing the parameters in the User topic.

If not, then I will need to know what happens.

INSTALLING HELM AND AN APP

I plan to document then the HELM install path.

Here is my guess on the workflow. Please update.

1. Use Putty with the private key to SSH into one of the VMs created by the solution template. Does it matter which one? 
2. in the bash:

$ curl https://raw.githubusercontent.com/kubernetes/helm/master/scripts/get > get_helm.sh
$ chmod 700 get_helm.sh
$ ./get_helm.sh

[Does curl need to be installed?]

And then installed wordpress:

helm install stable/wordpress

What happens here? Is this the classic Wordpress questsion, db, password, etc. What is the connection string to the mysql database? And finally what is the URL for wordpress?

Is it the IP? I am assuming to connect to this IP I need in the datacenter running Azure Stack?



Wordpress Installation (using Helm): helm install stable/wordpress

##

## Next steps

[Add a Kubernetes Cluster to the Marketplace](..\azure-stack-solution-template-kubernetes-cluster-add.md)