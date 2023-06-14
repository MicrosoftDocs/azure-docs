---
title: Troubleshoot Azure Red Hat OpenShift
description: Troubleshoot and resolve common issues with Azure Red Hat OpenShift
author: joharder
ms.author: joharder
ms.service: azure-redhat-openshift
ms.topic: troubleshooting
ms.date: 05/08/2019
---

# Troubleshooting for Azure Red Hat OpenShift

This article details some common issues encountered while creating or managing Microsoft Azure Red Hat OpenShift clusters.

## Retrying the creation of a failed cluster

If creating an Azure Red Hat OpenShift cluster using the `az` CLI command fails, retrying the create will continue to fail.
Use `az aro delete` to delete the failed cluster, then create an entirely new cluster.

## Hidden Azure Red Hat OpenShift cluster resource group

Currently, the `RedHatOpenShift/OpenShiftClusters` resource that's automatically created by the Azure CLI (`az aro create` command) is hidden in the Azure portal. In the **Resource group** view, check **Show hidden types** to view the resource group.

![Screenshot of the hidden type checkbox in the portal](./media/aro-portal-hidden-type.png)

## Creating a cluster results in error that no registered resource provider found

If creating a cluster results in an error that `No registered resource provider found for location '<location>' and API version '2019-04-30' for type 'openShiftManagedClusters'. The supported api-versions are '2018-09-30-preview'.`, then you were part of the preview and now need to [purchase Azure virtual machine reserved instances](https://aka.ms/openshift/buy) to use the generally available product. A reservation reduces your spend by pre-paying for fully managed Azure services. For more information about reservations and how they save you money, see [What are Azure Reservations?](../cost-management-billing/reservations/save-compute-costs-reservations.md)

## Next steps

- Visit the [OpenShift documentation](https://docs.openshift.com/container-platform)

- [Azure Support](https://azure.microsoft.com/support/) or [Red Hat Support](https://support.redhat.com/) to open a support case.

- Find answers to [frequently asked questions about Azure Red Hat OpenShift](openshift-faq.yml).
