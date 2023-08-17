---
title: Direct SQL traffic with Azure Application Gateway (Preview)
titleSuffix: Azure Application Gateway
description: This article provides information on how to configure Application Gateway's layer 4 proxy service for non-HTTP workloads.
services: application-gateway
author: greg-lindsay
ms.service: application-gateway
ms.topic: how-to
ms.date: 08/17/2023
ms.author: greglin
---

# Direct SQL traffic with Azure Application Gateway (Preview)

To try out the Layer 4 features of Azure Application Gateway, in this quick start article we will use the Azure portal to create an Azure Application Gateway with SQL Server on Azure VMs as backend server. We will also test the connectivity through an SQL client to make sure that the configuration works correctly. This simple setup will guide you to create a listener with required port, a backend setting using layer 4 protocol, a routing rule, and add SQL VM to a backend pool. This article is divided into three parts.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Onboard to the preview



## Create a SQL server

First, create an SQL Server virtual machine (VM) using the Azure portal.

## Create an Application Gateway



## Connect to the SQL server



## Clean up resources



## Unregister from the preview



## Next steps

If you want to monitor the health of your backend pool, see [Backend health and diagnostic logs for Application Gateway](application-gateway-diagnostics.md).
